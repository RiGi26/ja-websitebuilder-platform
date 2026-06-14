import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit, tooManyRequests } from '@/lib/rate-limit'
import { getPlatformMidtrans } from '@/lib/platform-midtrans'

export async function POST(request: Request) {
  try {
    const { order_id } = await request.json()
    if (!order_id) return NextResponse.json({ error: 'order_id wajib' }, { status: 400 })

    // Rate-limit per order (audit 2026-06-13, #8): endpoint keyed order_id tanpa
    // auth dan me-reset payment_status + midtrans_order_id → batasi ketat supaya
    // tak bisa dipakai mengganggu pembayaran order korban secara massal.
    const rl = rateLimit(`pay:retry:${order_id}`, 5, 10 * 60_000)
    if (!rl.allowed) return tooManyRequests(rl.retryAfter)

    // Mode Midtrans dari DB (switch sandbox/production via /admin tanpa redeploy).
    const { serverKey: SERVER_KEY, snapApiUrl: SNAP_API, mode: MIDTRANS_MODE } = await getPlatformMidtrans()

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, nama_usaha, nama_perusahaan, nomor_wa, email, total_estimasi, payment_status, created_at')
      .eq('id', order_id)
      .maybeSingle()

    if (error || !order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })

    // Hanya izinkan retry untuk unpaid atau failed
    if (!['unpaid', 'failed', 'awaiting_payment'].includes(order.payment_status as string)) {
      return NextResponse.json({ error: 'Order sudah terbayar atau tidak bisa di-retry' }, { status: 400 })
    }

    const year = new Date(order.created_at).getFullYear()
    const displayId = `JA-${year}-${order.id.slice(0, 8).toUpperCase()}`
    const DP_THRESHOLD = 4_000_000
    const total = Number(order.total_estimasi || 0)
    const isDP = total >= DP_THRESHOLD
    const dpAmount = isDP ? Math.ceil(total * 0.5) : total
    const clientName = order.nama_perusahaan || order.nama_usaha || 'Customer'
    // Gunakan timestamp untuk buat midtrans order_id unik
    const retryOrderId = `${displayId}-DP-${Date.now()}`
    const finishUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?id=${order.id}`

    const snapPayload = {
      transaction_details: { order_id: retryOrderId, gross_amount: dpAmount },
      item_details: [{
        id: isDP ? 'dp-50pct' : 'lunas',
        price: dpAmount,
        quantity: 1,
        name: isDP ? 'DP 50% — Japan Arena Studio' : 'Lunas — Japan Arena Studio',
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

    // Update midtrans_order_id + reset status ke awaiting_payment + environment transaksi
    await supabaseAdmin
      .from('orders')
      .update({ midtrans_order_id: retryOrderId, payment_status: 'awaiting_payment', dp_amount: dpAmount, midtrans_mode: MIDTRANS_MODE })
      .eq('id', order.id)

    return NextResponse.json({
      redirect_url: snapData.redirect_url,
      display_id: displayId,
      dp_amount: dpAmount,
    })
  } catch (err: any) {
    console.error('[payment/retry]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
