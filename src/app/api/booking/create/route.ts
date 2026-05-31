import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getTenantMidtrans } from '@/lib/tenant-midtrans'

// POST { slug, service_id, jadwal, pemesan:{nama,kontak,email,catatan} }
// Membuat booking. Jika layanan punya DP/booking fee > 0 dan toko sudah
// mengaktifkan Midtrans → panggil Snap pakai SERVER KEY KLIEN (bayar DP online).
// Jika DP = 0 → reservasi langsung tercatat tanpa pembayaran online.
// Nominal SELALU diambil ulang dari DB (jangan percaya angka dari client).
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { slug, service_id, jadwal, pemesan } = body
    if (!slug || !service_id || !pemesan?.nama || !pemesan?.kontak) {
      return NextResponse.json({ error: 'Data pemesan tidak lengkap.' }, { status: 400 })
    }

    // 1. Halaman + tenant (hanya yang published)
    const { data: page } = await supabaseAdmin
      .from('landing_pages')
      .select('id, tenant_id, status, konfigurasi')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
    if (!page) return NextResponse.json({ error: 'Halaman tidak ditemukan.' }, { status: 404 })

    const konfig = (page.konfigurasi ?? {}) as { features?: Record<string, boolean> }
    if (!konfig.features?.hasBooking) {
      return NextResponse.json({ error: 'Halaman ini tidak menerima reservasi online.' }, { status: 400 })
    }

    // 2. Ambil layanan dari DB (validasi harga & ketersediaan)
    const { data: service } = await supabaseAdmin
      .from('services')
      .select('id, nama, harga, dp_amount, is_active, page_id')
      .eq('id', service_id)
      .eq('page_id', page.id)
      .eq('is_active', true)
      .maybeSingle()
    if (!service) return NextResponse.json({ error: 'Layanan tidak tersedia.' }, { status: 400 })

    const harga = Number(service.harga) || 0
    const dp = Math.max(0, Math.floor(Number(service.dp_amount) || 0))
    const perluBayar = dp > 0

    // 3. Buat booking (pending). Jika tak perlu bayar → payment_status not_required.
    const { data: booking, error: bErr } = await supabaseAdmin
      .from('bookings')
      .insert({
        tenant_id: page.tenant_id,
        page_id: page.id,
        service_id: service.id,
        nama_pemesan: pemesan.nama,
        kontak: pemesan.kontak,
        email: pemesan.email || null,
        jadwal: jadwal || null,
        catatan: pemesan.catatan || null,
        total: harga,
        dp_amount: dp,
        status: 'pending',
        payment_status: perluBayar ? 'unpaid' : 'not_required',
      })
      .select()
      .single()
    if (bErr) throw new Error(bErr.message)

    // 4. Tanpa pembayaran online → selesai, kembalikan konfirmasi.
    if (!perluBayar) {
      return NextResponse.json({ booking_id: booking.id, requires_payment: false })
    }

    // 5. Perlu DP → wajib Midtrans aktif.
    const mid = await getTenantMidtrans(page.tenant_id)
    if (!mid) {
      // Tetap simpan booking, tapi beri tahu pembayaran belum aktif.
      return NextResponse.json({
        booking_id: booking.id,
        requires_payment: true,
        error: 'Reservasi tercatat, tetapi pembayaran online belum diaktifkan. Penjual akan menghubungi Anda.',
      }, { status: 200 })
    }

    const midtransOrderId = `BOOK-${booking.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36)}`
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''
    const finishUrl = `${baseUrl}/${slug}/booking-status?id=${booking.id}`
    const snapPayload = {
      transaction_details: { order_id: midtransOrderId, gross_amount: dp },
      item_details: [{ id: service.id, price: dp, quantity: 1, name: `Booking: ${service.nama}`.slice(0, 50) }],
      customer_details: {
        first_name: pemesan.nama,
        ...(pemesan.kontak && { phone: pemesan.kontak }),
        ...(pemesan.email && { email: pemesan.email }),
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
      await supabaseAdmin.from('bookings').update({ payment_status: 'failed' }).eq('id', booking.id)
      throw new Error(snapData.error_messages?.join(', ') || `Midtrans error ${snapRes.status}`)
    }

    await supabaseAdmin
      .from('bookings')
      .update({ midtrans_order_id: midtransOrderId, payment_status: 'awaiting_payment' })
      .eq('id', booking.id)

    return NextResponse.json({
      booking_id: booking.id,
      requires_payment: true,
      redirect_url: snapData.redirect_url,
      snap_token: snapData.token,
    })
  } catch (err: any) {
    console.error('[booking/create]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
