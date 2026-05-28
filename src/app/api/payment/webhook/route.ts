import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import crypto from 'crypto'

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body

    // Verify Midtrans signature
    const expected = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${SERVER_KEY}`)
      .digest('hex')

    if (signature_key !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // order_id format: JA-2025-XXXXXXXX-DP → extract 8-char hex shortId
    const shortId = order_id.replace(/-DP$/, '').split('-')[2]?.toLowerCase()
    if (!shortId) return NextResponse.json({ error: 'Bad order_id' }, { status: 400 })

    const isPaid =
      (transaction_status === 'capture' && fraud_status === 'accept') ||
      transaction_status === 'settlement'
    const isPending = transaction_status === 'pending'
    const isFailed = ['deny', 'cancel', 'expire'].includes(transaction_status)

    const update: Record<string, string> = {}

    if (isPaid) {
      update.payment_status = 'dp_paid'
      update.status = 'pending' // admin review queue
    } else if (isPending) {
      update.payment_status = 'awaiting_payment'
    } else if (isFailed) {
      update.payment_status = 'failed'
      update.status = 'pending_payment'
    }

    if (Object.keys(update).length > 0) {
      const { error } = await supabaseAdmin
        .from('orders')
        .update(update)
        .ilike('id', `${shortId}%`)

      if (error) throw new Error(error.message)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[payment/webhook]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
