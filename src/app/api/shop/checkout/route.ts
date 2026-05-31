import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getTenantMidtrans } from '@/lib/tenant-midtrans'

// POST { slug, pembeli:{nama,hp,email,alamat,catatan}, items:[{id,qty}] }
// Membuat shop_order + memanggil Midtrans Snap memakai SERVER KEY KLIEN.
// Harga SELALU diambil ulang dari DB (jangan percaya harga dari client).
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { slug, pembeli, items } = body
    if (!slug || !pembeli?.nama || !pembeli?.hp) {
      return NextResponse.json({ error: 'Data pembeli tidak lengkap.' }, { status: 400 })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Keranjang kosong.' }, { status: 400 })
    }

    // 1. Halaman + tenant (hanya yang published)
    const { data: page } = await supabaseAdmin
      .from('landing_pages')
      .select('id, tenant_id, nama_website, status, konfigurasi')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
    if (!page) return NextResponse.json({ error: 'Toko tidak ditemukan.' }, { status: 404 })

    const konfig = (page.konfigurasi ?? {}) as { features?: Record<string, boolean> }
    if (!konfig.features?.hasCart) {
      return NextResponse.json({ error: 'Toko ini tidak menerima pesanan online.' }, { status: 400 })
    }

    // 2. Ambil produk dari DB (validasi harga & ketersediaan)
    const ids = items.map((i: any) => i.id)
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, nama, harga, is_active, page_id')
      .in('id', ids)
      .eq('page_id', page.id)
      .eq('is_active', true)
    const byId = new Map((products ?? []).map((p: any) => [p.id, p]))

    const lineItems: { product_id: string; nama: string; harga_satuan: number; qty: number; subtotal: number }[] = []
    for (const it of items) {
      const p = byId.get(it.id)
      const qty = Math.max(1, Math.floor(Number(it.qty) || 1))
      if (!p) return NextResponse.json({ error: 'Ada produk yang tidak tersedia lagi.' }, { status: 400 })
      const harga = Number(p.harga)
      lineItems.push({ product_id: p.id, nama: p.nama, harga_satuan: harga, qty, subtotal: harga * qty })
    }
    const subtotal = lineItems.reduce((a, b) => a + b.subtotal, 0)
    const total = subtotal // ongkir = 0 untuk Tahap 1
    if (total <= 0) return NextResponse.json({ error: 'Total tidak valid.' }, { status: 400 })

    // 3. Kredensial Midtrans KLIEN
    const mid = await getTenantMidtrans(page.tenant_id)
    if (!mid) {
      return NextResponse.json({ error: 'Toko belum mengaktifkan pembayaran online.' }, { status: 400 })
    }

    // 4. Buat shop_order (status pending) + items
    const { data: order, error: ordErr } = await supabaseAdmin
      .from('shop_orders')
      .insert({
        tenant_id: page.tenant_id,
        page_id: page.id,
        pembeli_nama: pembeli.nama,
        pembeli_hp: pembeli.hp,
        pembeli_email: pembeli.email || null,
        alamat: pembeli.alamat || null,
        catatan: pembeli.catatan || null,
        subtotal, ongkir: 0, total,
        status: 'pending', payment_status: 'unpaid',
      })
      .select()
      .single()
    if (ordErr) throw new Error(ordErr.message)

    const midtransOrderId = `SHOP-${order.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36)}`
    await supabaseAdmin.from('shop_order_items').insert(
      lineItems.map((li) => ({ shop_order_id: order.id, ...li })),
    )

    // 5. Snap pakai server key KLIEN
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''
    const finishUrl = `${baseUrl}/${slug}/order-status?id=${order.id}`
    const snapPayload = {
      transaction_details: { order_id: midtransOrderId, gross_amount: total },
      item_details: lineItems.map((li) => ({ id: li.product_id, price: li.harga_satuan, quantity: li.qty, name: li.nama.slice(0, 50) })),
      customer_details: {
        first_name: pembeli.nama,
        ...(pembeli.hp && { phone: pembeli.hp }),
        ...(pembeli.email && { email: pembeli.email }),
      },
      callbacks: { finish: finishUrl },
    }
    const auth = Buffer.from(`${mid.serverKey}:`).toString('base64')
    const snapRes = await fetch(mid.snapApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify(snapPayload),
    })
    const snapData = await snapRes.json()
    if (!snapRes.ok) {
      // tandai order gagal dibuat di Midtrans
      await supabaseAdmin.from('shop_orders').update({ payment_status: 'failed' }).eq('id', order.id)
      throw new Error(snapData.error_messages?.join(', ') || `Midtrans error ${snapRes.status}`)
    }

    // 6. Simpan midtrans_order_id + awaiting_payment
    await supabaseAdmin
      .from('shop_orders')
      .update({ midtrans_order_id: midtransOrderId, payment_status: 'awaiting_payment' })
      .eq('id', order.id)

    return NextResponse.json({
      order_id: order.id,
      redirect_url: snapData.redirect_url,
      snap_token: snapData.token,
    })
  } catch (err: any) {
    console.error('[shop/checkout]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
