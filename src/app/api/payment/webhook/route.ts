import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import crypto from 'crypto'

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!

// Midtrans requires HTTP 200 always — non-200 triggers retries
// Signature check still happens; invalid ones are logged and ignored
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

    // Verify signature — reject silently if invalid (return 200 so Midtrans doesn't retry)
    const expected = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${SERVER_KEY}`)
      .digest('hex')

    if (signature_key !== expected) {
      console.warn('[webhook] Invalid signature for order:', order_id)
      return NextResponse.json({ received: true, note: 'signature_mismatch' })
    }

    const isPaid =
      (transaction_status === 'capture' && fraud_status === 'accept') ||
      transaction_status === 'settlement'
    const isPending = transaction_status === 'pending'
    const isFailed = ['deny', 'cancel', 'expire'].includes(transaction_status)

    const update: Record<string, string> = {}

    if (isPaid) {
      update.payment_status = 'dp_paid'
      update.status = 'pending'
    } else if (isPending) {
      update.payment_status = 'awaiting_payment'
    } else if (isFailed) {
      update.payment_status = 'failed'
      update.status = 'pending_payment'
    }

    if (Object.keys(update).length > 0) {
      // Lookup by midtrans_order_id (exact match) — kolom ini sudah di-index dan
      // disimpan saat order dibuat di payment/create. Jauh lebih reliable
      // dibanding ilike pada UUID (yang silent fail karena UUID tidak punya operator ILIKE).
      const { error } = await supabaseAdmin
        .from('orders')
        .update(update)
        .eq('midtrans_order_id', order_id)

      if (error) console.error('[webhook] DB update error:', error.message)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[webhook] Unhandled error:', err.message)
    // Still return 200 — Midtrans must not retry on our internal errors
    return NextResponse.json({ received: true, error: err.message })
  }
}
