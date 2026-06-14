import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { notifyCustomer, notifyReferrer } from '@/lib/fonnte'
import { createEarningForOrder } from '@/lib/referral'
import { getPlatformMidtrans } from '@/lib/platform-midtrans'

export async function POST(request: Request) {
  try {
    const { order_id, midtrans_order_id } = await request.json()
    if (!order_id || !midtrans_order_id) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

    // Mode Midtrans dari DB (switch sandbox/production via /admin tanpa redeploy).
    const { serverKey: SERVER_KEY, statusApiUrl: STATUS_API } = await getPlatformMidtrans()

    // Verify transaction status directly from Midtrans
    const auth = Buffer.from(`${SERVER_KEY}:`).toString('base64')
    const res = await fetch(`${STATUS_API}/${midtrans_order_id}/status`, {
      headers: { Authorization: `Basic ${auth}` },
    })

    const tx = await res.json()

    const isPaid =
      (tx.transaction_status === 'capture' && tx.fraud_status === 'accept') ||
      tx.transaction_status === 'settlement'
    const isPending = tx.transaction_status === 'pending'

    if (isPaid) {
      const { data: updated } = await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'dp_paid', status: 'pending' })
        .eq('id', order_id)
        .select('id, nomor_wa, nama_usaha, nama_perusahaan, created_at, tracking_token')
        .maybeSingle()

      if (updated?.nomor_wa) {
        const clientName = updated.nama_perusahaan || updated.nama_usaha || 'Customer'
        const year = new Date(updated.created_at ?? Date.now()).getFullYear()
        const displayId = `JA-${year}-${updated.id.slice(0, 8).toUpperCase()}`
        const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
        notifyCustomer({ type: 'dp_confirmed' }, updated.nomor_wa, {
          clientName,
          displayId,
          trackUrl: `${base}/track?id=${updated.id}`,
          briefingUrl: `${base}/order/briefing/${updated.tracking_token}`,
        }).catch((e) => console.error('[confirm] WA dp_confirmed failed:', e))
      }

      // Program Mitra — race-safe terhadap webhook: upsert onConflict order_id,
      // siapa pun yang menang race hanya membuat satu earning + satu notif.
      if (updated) {
        try {
          const t = await createEarningForOrder(updated.id)
          if ((t.outcome === 'created' || t.outcome === 'created_confirmed') && t.referrerWa) {
            const year = new Date(updated.created_at ?? Date.now()).getFullYear()
            const displayId = `JA-${year}-${updated.id.slice(0, 8).toUpperCase()}`
            const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
            notifyReferrer(
              {
                type: t.outcome === 'created_confirmed'
                  ? 'referral_earning_confirmed'
                  : 'referral_earning_pending',
              },
              t.referrerWa,
              {
                referrerName: t.referrerName ?? 'Mitra',
                amount: t.amount,
                displayId,
                mitraUrl: `${base}/mitra`,
              },
            ).catch((e) => console.error('[confirm] WA referral earning failed:', e))
          }
        } catch (e) {
          console.error('[confirm] referral earning failed:', e)
        }
      }

      return NextResponse.json({ confirmed: true, status: 'dp_paid' })
    }

    if (isPending) {
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'awaiting_payment' })
        .eq('id', order_id)
      return NextResponse.json({ confirmed: false, status: 'awaiting_payment' })
    }

    return NextResponse.json({ confirmed: false, status: tx.transaction_status })
  } catch (err: any) {
    console.error('[payment/confirm]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
