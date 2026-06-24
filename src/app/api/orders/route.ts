import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit'
import { sendWhatsApp } from '@/lib/fonnte'
import { renderTemplate, type NotifVars } from '@/lib/notif/template'
import { getTenantNotif, effectiveFonnteToken } from '@/lib/tenant-notif'
import { logWa } from '@/lib/notif/wa-log'
import { formatMoney, moneyFromConfig } from '@/lib/format-money'
import { createPortalOrder } from '@/lib/portal/client'
import {
  METODE_BAYAR,
  type MetodeBayar,
  type FulfillmentMode,
  type PortalOrderRequest,
  type RingkasanItem,
} from '@/lib/portal/types'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'

// ============================================================
// WB intake order Bakso Fase 1 (BAKSO_PORTAL_CONTRACT.md §4.1, §14).
// Browser → SINI → (signed) POST {PORTAL}/api/orders → bootstrap order_projection.
// Order System-of-Record = PORTAL (satu arah). WB hanya intake + proyeksi lokal.
//
// Harga di-reprice server-side dari catalog_mirror (jangan percaya browser); Portal
// reprice OTORITATIF lagi (§4.1 step 3). Website WAJIB menampilkan total_* dari
// response Portal (BUKAN estimasi sendiri) — diteruskan ke klien apa adanya.
// Stok: WB tak punya otoritas (mirror bisa basi) → Portal balas 409 stock_conflict.
// ============================================================

const METODE_LABEL: Record<MetodeBayar, string> = {
  transfer_jp: 'Transfer 銀行振込 (Japan Post Bank)',
  transfer_id: 'Transfer Bank Indonesia',
  paypay: 'PayPay',
  cod_full: '代引き — COD penuh (bayar ke kurir)',
  cod_ongkir: '着払い — ongkir dibayar ke kurir',
}

export async function POST(request: Request) {
  // Rate-limit best-effort (per-instance) — anti spam order-create (§8).
  const rl = rateLimit(`orders:create:${clientIp(request)}`, 8, 60_000)
  if (!rl.allowed) return tooManyRequests(rl.retryAfter)

  try {
    const body = await request.json()
    const { slug, pembeli, metode_bayar, fulfillment_mode, jam_kirim, items } = body

    // Slot jam kirim same-day (cth '18:00〜20:00'). Pengiriman selalu di HARI order →
    // tgl_kirim diisi otomatis = tanggal hari ini di Asia/Tokyo (lokasi toko), bukan
    // dari browser. Hanya diset bila pelanggan memilih slot (opsional).
    const jamKirim = typeof jam_kirim === 'string' && jam_kirim.trim() ? jam_kirim.trim() : null
    const tglKirim = jamKirim
      ? new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date()) // YYYY-MM-DD
      : null

    // 1. Validasi payload
    if (!slug || !pembeli?.nama?.trim() || !pembeli?.telp?.trim()) {
      return NextResponse.json({ ok: false, error: 'invalid_payload', message: 'Nama & nomor WhatsApp wajib diisi.' }, { status: 400 })
    }
    if (!METODE_BAYAR.includes(metode_bayar)) {
      return NextResponse.json({ ok: false, error: 'invalid_payload', message: 'Metode pembayaran tidak valid.' }, { status: 400 })
    }
    const mode: FulfillmentMode = fulfillment_mode === 'PREORDER' ? 'PREORDER' : 'IMMEDIATE'
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'invalid_payload', message: 'Keranjang masih kosong.' }, { status: 400 })
    }

    // 2. Halaman published + gate cutover portal
    const { data: page } = await supabaseAdmin
      .from('landing_pages')
      .select('id, tenant_id, nama_website, slug, konfigurasi')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
    if (!page) return NextResponse.json({ ok: false, error: 'unknown_tenant', message: 'Halaman tidak ditemukan.' }, { status: 404 })
    const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
    if (konfig.source_of_truth !== 'portal') {
      return NextResponse.json({ ok: false, error: 'not_portal_tenant', message: 'Halaman ini belum memakai checkout portal.' }, { status: 400 })
    }

    // 3. Reprice dari catalog_mirror (pre-flight WB; Portal reprice otoritatif lagi).
    //    Service-role: catalog_mirror tanpa akses anon (§3/§8).
    const reqItems: { product_pack_id: string; qty: number }[] = []
    for (const it of items) {
      const packId = String(it?.product_pack_id || it?.pack_id || it?.id || '')
      const qty = Math.max(1, Math.floor(Number(it?.qty) || 1))
      if (!packId) return NextResponse.json({ ok: false, error: 'invalid_payload', message: 'Item tidak valid.' }, { status: 400 })
      reqItems.push({ product_pack_id: packId, qty })
    }
    const packIds = reqItems.map((i) => i.product_pack_id)
    const { data: mirrorRows } = await supabaseAdmin
      .from('catalog_mirror')
      .select('pack_id, product_nama, harga, avail_status')
      .eq('tenant_slug', slug)
      .eq('is_active', true)
      .in('pack_id', packIds)
    const mirror = new Map((mirrorRows ?? []).map((r) => [r.pack_id as string, r]))

    const ringkasan: RingkasanItem[] = []
    for (const it of reqItems) {
      const m = mirror.get(it.product_pack_id)
      if (!m) return NextResponse.json({ ok: false, error: 'unknown_pack', message: 'Ada menu yang tidak tersedia lagi — muat ulang halaman.' }, { status: 404 })
      ringkasan.push({ nama: m.product_nama as string, qty: it.qty, harga: Number(m.harga) || 0 })
    }

    // 4. Idempotency-Key: dari browser bila ada (tahan refresh/retry), else server.
    const idempotencyKey = (typeof body.idempotency_key === 'string' && body.idempotency_key.trim())
      ? body.idempotency_key.trim()
      : crypto.randomUUID()

    // 5. Susun request kontrak §4.1 + panggil Portal (signed). ongkir estimasi Fase 1 = 0
    //    (region calc ditunda §12); Portal recompute otoritatif.
    const portalReq: PortalOrderRequest = {
      tenant_slug: slug,
      pembeli: {
        nama: pembeli.nama.trim(),
        telp: pembeli.telp.trim(),
        email: pembeli.email?.trim() || null,
        ig: pembeli.ig?.trim() || null,
        kode_pos: pembeli.kode_pos?.trim() || null,
        alamat: pembeli.alamat?.trim() || null,
        catatan: pembeli.catatan?.trim() || null,
      },
      metode_bayar,
      fulfillment_mode: mode,
      tgl_kirim: tglKirim,
      jam_kirim: jamKirim,
      items: reqItems,
      ongkir: 0,
    }
    const result = await createPortalOrder(portalReq, idempotencyKey)

    if (!result.ok) {
      if (result.kind === 'contract') {
        // Teruskan error kontrak apa adanya (409 stock_conflict + conflicts[], dll).
        return NextResponse.json(result.body, { status: result.status })
      }
      // Transport/konfigurasi → fail-closed.
      const msg = result.reason === 'not_configured'
        ? 'Sistem pesanan belum dikonfigurasi. Hubungi admin via WhatsApp.'
        : 'Sistem pesanan sedang sibuk. Coba lagi sebentar.'
      return NextResponse.json({ ok: false, error: 'portal_unavailable', message: msg }, { status: 503 })
    }

    const r = result.body
    const createdAt = r.created_at || new Date().toISOString()

    // 6. Bootstrap order_projection (single-writer; guard monotonic milik §4.3 sync Fase 2).
    //    Replay (HTTP 200) → baris sudah ada → ignore-duplicate.
    await supabaseAdmin.from('order_projection').upsert({
      order_code: r.order_code,
      tenant_slug: slug,
      tracking_token: r.tracking_token,
      pembeli_nama: pembeli.nama.trim(),
      pembeli_telp: pembeli.telp.trim(),
      status_bayar: r.status_bayar,
      status_fulfillment: r.status_fulfillment,
      metode_bayar: r.metode_bayar,
      total_online: r.total_online,
      total_courier: r.total_courier,
      total_gross: r.total_gross,
      biaya_kurir: r.biaya_kurir,
      ringkasan_items: ringkasan,
      tgl_kirim: tglKirim,
      jam_kirim: jamKirim,
      created_at: createdAt,
      source_updated_at: createdAt,
    }, { onConflict: 'order_code', ignoreDuplicates: true })

    // 7. Notifikasi WA — HANYA pada order BARU (201), bukan replay idempoten (200).
    //    Cegah struk/notif ganda saat double-submit (idempotency_key sama → Portal 200).
    //    Token HYBRID: token Fonnte tenant (bila aktif) → fallback token platform.
    //    Template per-event editable tenant (anti-rusak) → fallback default platform.
    //    Fire-and-forget — kegagalan WA tak menggagalkan order.
    if (result.status === 201) {
      const waAdmin = konfig.preorder?.wa_admin?.trim()
      const phoneCc = konfig.localeConfig?.phone_cc || '62'
      const { locale, currency } = moneyFromConfig(konfig.localeConfig)
      const itemsText = ringkasan.map((i) => `${i.nama} ×${i.qty}`).join(', ')
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
      const trackUrl = `${baseUrl}/lacak/${r.tracking_token}`

      const notif = page.tenant_id ? await getTenantNotif(page.tenant_id).catch(() => null) : null
      const token = notif ? effectiveFonnteToken(notif) : (process.env.FONNTE_TOKEN || undefined)
      const vars: NotifVars = {
        nama: pembeli.nama.trim(),
        bisnis: page.nama_website,
        kode: r.order_code,
        items: itemsText,
        total: formatMoney(r.total_gross, locale, currency),
        bayar: METODE_LABEL[r.metode_bayar],
        lacak: trackUrl,
        alamat: pembeli.alamat?.trim() || null,
        catatan: pembeli.catatan?.trim() || null,
        tanggal: jamKirim ? `${tglKirim} · ${jamKirim}` : null,
        // Link invoice/faktur PDF — permanen, tapi PDF baru bisa diakses setelah
        // pembayaran terverifikasi (route /invoice gated). Dikirim sejak awal.
        invoice: baseUrl ? `${baseUrl}/invoice/${r.tracking_token}` : null,
      }

      // Struk ke pembeli — selalu. Rekam hasil ke wa_log (keandalan: kegagalan tak hening).
      const buyerPhone = pembeli.telp.trim()
      const receiptMsg = renderTemplate('order_receipt', notif?.templates.order_receipt, vars)
      sendWhatsApp(buyerPhone, receiptMsg, phoneCc, token)
        .then((res) => logWa({ orderCode: r.order_code, tenantSlug: slug, event: 'order_receipt', target: buyerPhone, result: res }))
        .catch((e: unknown) => console.error('[orders WA receipt]', (e as Error)?.message))

      // Notif ke admin — bila wa_admin di-set.
      if (waAdmin) {
        const adminMsg = renderTemplate('order_admin', notif?.templates.order_admin, vars)
        sendWhatsApp(waAdmin, adminMsg, phoneCc, token)
          .then((res) => logWa({ orderCode: r.order_code, tenantSlug: slug, event: 'order_admin', target: waAdmin, result: res }))
          .catch((e: unknown) => console.error('[orders WA admin]', (e as Error)?.message))
      }
    }

    // 8. Balas ke browser — total_* + instruksi_bayar dari Portal (BUKAN estimasi WB).
    return NextResponse.json({
      ok: true,
      order_code: r.order_code,
      tracking_token: r.tracking_token,
      status_bayar: r.status_bayar,
      status_fulfillment: r.status_fulfillment,
      metode_bayar: r.metode_bayar,
      total_online: r.total_online,
      total_courier: r.total_courier,
      total_gross: r.total_gross,
      biaya_kurir: r.biaya_kurir,
      instruksi_bayar: r.instruksi_bayar,
    })
  } catch (err) {
    console.error('[api/orders]', (err as Error)?.message)
    return NextResponse.json({ ok: false, error: 'server_error', message: 'Terjadi kesalahan. Coba lagi.' }, { status: 500 })
  }
}
