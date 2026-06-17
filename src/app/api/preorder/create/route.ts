import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { notifyPreorder } from '@/lib/fonnte'
import { formatMoney, moneyFromConfig } from '@/lib/format-money'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'

// POST { slug, pembeli:{nama,hp,email,catatan}, fulfillment:{type,date,time,alamat}, items:[{id,qty}] }
// Membuat PRE-ORDER F&B (tanpa bayar online — model PO: bayar saat ambil/transfer).
// Pola gabungan: booking/create (payment-optional) + shop/checkout (line items).
// Harga & HPP SELALU diambil ulang dari DB via service role (jangan percaya client;
// hpp tak pernah dikirim dari browser). Insert via supabaseAdmin → anon tak menyentuh tabel.
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { slug, pembeli, fulfillment, items } = body
    if (!slug || !pembeli?.nama?.trim() || !pembeli?.hp?.trim()) {
      return NextResponse.json({ error: 'Nama & nomor WhatsApp wajib diisi.' }, { status: 400 })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Pilih minimal satu menu.' }, { status: 400 })
    }
    const ftype: 'pickup' | 'delivery' = fulfillment?.type === 'delivery' ? 'delivery' : 'pickup'
    if (!fulfillment?.date) {
      return NextResponse.json({ error: 'Tanggal pengambilan/pengantaran wajib diisi.' }, { status: 400 })
    }
    if (ftype === 'delivery' && !fulfillment?.alamat?.trim()) {
      return NextResponse.json({ error: 'Alamat pengantaran wajib diisi.' }, { status: 400 })
    }

    // 1. Halaman published + konfigurasi
    const { data: page } = await supabaseAdmin
      .from('landing_pages')
      .select('id, tenant_id, nama_website, status, konfigurasi')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
    if (!page) return NextResponse.json({ error: 'Halaman tidak ditemukan.' }, { status: 404 })

    const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
    if (!konfig.features?.hasPreorder) {
      return NextResponse.json({ error: 'Halaman ini tidak menerima pre-order.' }, { status: 400 })
    }
    if (konfig.preorder?.open !== true) {
      return NextResponse.json({ error: 'Pre-order sedang ditutup.' }, { status: 400 })
    }

    // 2. Ambil menu dari DB (validasi harga/HPP/ketersediaan). Service role → hpp aman dibaca.
    const ids = items.map((i: any) => i.id)
    const { data: menus } = await supabaseAdmin
      .from('menu_items')
      .select('id, nama, harga, hpp, is_active, is_sold_out, stok_harian, page_id')
      .in('id', ids)
      .eq('page_id', page.id)
      .eq('is_active', true)
    const byId = new Map((menus ?? []).map((m: any) => [m.id, m]))

    const lineItems: { menu_item_id: string; nama: string; harga_satuan: number; qty: number; subtotal: number; hpp_satuan: number }[] = []
    for (const it of items) {
      const m = byId.get(it.id)
      const qty = Math.max(1, Math.floor(Number(it.qty) || 1))
      if (!m) return NextResponse.json({ error: 'Ada menu yang tidak tersedia lagi.' }, { status: 400 })
      if (m.is_sold_out) return NextResponse.json({ error: `"${m.nama}" sedang habis.` }, { status: 400 })
      if (m.stok_harian != null && qty > m.stok_harian) {
        return NextResponse.json({ error: `Stok "${m.nama}" tinggal ${m.stok_harian}.` }, { status: 400 })
      }
      const harga = Number(m.harga) || 0
      lineItems.push({
        menu_item_id: m.id, nama: m.nama, harga_satuan: harga, qty,
        subtotal: harga * qty, hpp_satuan: Number(m.hpp) || 0,
      })
    }
    const subtotal = lineItems.reduce((a, b) => a + b.subtotal, 0)
    if (subtotal <= 0) return NextResponse.json({ error: 'Total tidak valid.' }, { status: 400 })

    // 3. Buat pre-order (status pending, tanpa bayar online)
    const alamat = ftype === 'delivery' ? (fulfillment.alamat?.trim() || null) : null
    const { data: order, error: ordErr } = await supabaseAdmin
      .from('shop_orders')
      .insert({
        tenant_id: page.tenant_id,
        page_id: page.id,
        pembeli_nama: pembeli.nama.trim(),
        pembeli_hp: pembeli.hp.trim(),
        pembeli_email: pembeli.email?.trim() || null,
        alamat,
        catatan: pembeli.catatan?.trim() || null,
        subtotal, ongkir: 0, total: subtotal,
        status: 'pending', payment_status: 'not_required',
        order_kind: 'preorder',
        fulfillment_type: ftype,
        fulfillment_date: fulfillment.date,
        fulfillment_time: fulfillment.time?.trim() || null,
      })
      .select('id, tracking_token')
      .single()
    if (ordErr) throw new Error(ordErr.message)

    await supabaseAdmin.from('shop_order_items').insert(
      lineItems.map((li) => ({ shop_order_id: order.id, ...li })),
    )

    // 4. Kurangi stok harian per item bila di-set (conditional → aman dari race sederhana)
    for (const li of lineItems) {
      const m = byId.get(li.menu_item_id)
      if (m?.stok_harian != null) {
        await supabaseAdmin
          .from('menu_items')
          .update({ stok_harian: Math.max(0, Number(m.stok_harian) - li.qty) })
          .eq('id', li.menu_item_id)
          .gte('stok_harian', li.qty)
      }
    }

    // 5. Notifikasi WA ke admin (fire-and-forget — kegagalan WA tak menggagalkan order)
    const waAdmin = konfig.preorder?.wa_admin?.trim()
    if (waAdmin) {
      const { locale, currency } = moneyFromConfig(konfig.localeConfig)
      const phoneCc = konfig.localeConfig?.phone_cc || '62'
      const itemsText = lineItems.map((li) => `${li.nama} ×${li.qty}`).join(', ')
      const fulfillmentText = `${ftype === 'delivery' ? 'Diantar' : 'Ambil sendiri'} · ${fulfillment.date}${fulfillment.time ? ' ' + fulfillment.time : ''}`
      notifyPreorder({ type: 'preorder_admin' }, waAdmin, {
        businessName: page.nama_website,
        customerName: pembeli.nama.trim(),
        orderShort: order.id.slice(0, 8).toUpperCase(),
        itemsText,
        totalText: formatMoney(subtotal, locale, currency),
        fulfillmentText,
        address: alamat,
        note: pembeli.catatan?.trim() || null,
      }, phoneCc).catch((e: any) => console.error('[preorder WA]', e?.message))
    }

    return NextResponse.json({ order_id: order.id, tracking_token: order.tracking_token })
  } catch (err: any) {
    console.error('[preorder/create]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
