import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getPlatformMidtrans } from '@/lib/platform-midtrans'

export async function POST(request: Request) {
  try {
    const { order_id } = await request.json()
    if (!order_id) return NextResponse.json({ error: 'order_id wajib' }, { status: 400 })

    // Mode Midtrans dari DB (switch sandbox/production via /admin tanpa redeploy).
    const { serverKey: SERVER_KEY, snapApiUrl: SNAP_API, mode: MIDTRANS_MODE } = await getPlatformMidtrans()

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, nama_usaha, nama_perusahaan, nomor_wa, email, total_estimasi, dp_amount, payment_status, created_at, delivered_url')
      .eq('id', order_id)
      .maybeSingle()

    if (error || !order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })

    if (order.payment_status !== 'dp_paid') {
      return NextResponse.json({ error: 'Order tidak dalam status DP terbayar' }, { status: 400 })
    }

    const total = Number(order.total_estimasi)
    const dp = Number(order.dp_amount ?? 0)
    const pelunasan = total - dp

    if (pelunasan <= 0) {
      return NextResponse.json({ error: 'Order sudah lunas atau tidak ada sisa pembayaran' }, { status: 400 })
    }

    const year = new Date(order.created_at).getFullYear()
    const displayId = `JA-${year}-${order.id.slice(0, 8).toUpperCase()}`
    const midtransOrderId = `${displayId}-LUNAS`
    const clientName = order.nama_perusahaan || order.nama_usaha || 'Customer'
    const finishUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/track?id=${order.id}&paid=lunas`

    const snapPayload = {
      transaction_details: { order_id: midtransOrderId, gross_amount: pelunasan },
      item_details: [{
        id: 'pelunasan',
        price: pelunasan,
        quantity: 1,
        name: 'Pelunasan — Japan Arena Studio',
      }],
      customer_details: {
        first_name: clientName,
        ...(order.nomor_wa && { phone: order.nomor_wa }),
        ...(order.email && { email: order.email }),
      },
      callbacks: { finish: finishUrl },
      gopay: { enable_callback: true, callback_url: finishUrl },
      shopeepay: { callback_url: finishUrl },
    }

    const auth = Buffer.from(`${SERVER_KEY}:`).toString('base64')
    const snapRes = await fetch(SNAP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify(snapPayload),
    })
    const snapData = await snapRes.json()
    if (!snapRes.ok) throw new Error(snapData.error_messages?.join(', ') || 'Midtrans error')

    // Simpan id transaksi pelunasan + environment-nya di kolom TERPISAH
    // (pelunasan_midtrans_mode) supaya tak menimpa midtrans_mode milik DP —
    // webhook -LUNAS verifikasi terhadap kolom ini.
    await supabaseAdmin
      .from('orders')
      .update({ pelunasan_midtrans_order_id: midtransOrderId, pelunasan_midtrans_mode: MIDTRANS_MODE })
      .eq('id', order.id)

    return NextResponse.json({
      redirect_url: snapData.redirect_url,
      pelunasan_amount: pelunasan,
      display_id: displayId,
    })
  } catch (err: any) {
    console.error('[payment/pelunasan]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
