import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!
const IS_PROD = process.env.NEXT_PUBLIC_MIDTRANS_ENV === 'production'
const STATUS_API = IS_PROD
  ? 'https://api.midtrans.com/v2'
  : 'https://api.sandbox.midtrans.com/v2'

export async function POST(request: Request) {
  try {
    const { order_id, midtrans_order_id } = await request.json()
    if (!order_id || !midtrans_order_id) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

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
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'dp_paid', status: 'pending' })
        .eq('id', order_id)
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
