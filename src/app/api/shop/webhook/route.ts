import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getTenantMidtrans } from '@/lib/tenant-midtrans'

// Webhook notifikasi Midtrans untuk pesanan toko klien.
// Signature diverifikasi memakai SERVER KEY milik tenant pemilik pesanan
// (tiap klien punya akun Midtrans sendiri). Selalu balas 200 agar tak retry.
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body
    if (!order_id) return NextResponse.json({ received: true, note: 'no_order_id' })

    // 1. Temukan pesanan + tenant berdasarkan midtrans_order_id
    const { data: order } = await supabaseAdmin
      .from('shop_orders')
      .select('id, tenant_id, payment_status')
      .eq('midtrans_order_id', order_id)
      .maybeSingle()
    if (!order) return NextResponse.json({ received: true, note: 'order_not_found' })

    // 2. Ambil server key klien utk verifikasi signature
    const mid = await getTenantMidtrans(order.tenant_id)
    if (!mid) return NextResponse.json({ received: true, note: 'no_payment_config' })

    const expected = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${mid.serverKey}`)
      .digest('hex')
    if (signature_key !== expected) {
      console.warn('[shop/webhook] invalid signature for', order_id)
      return NextResponse.json({ received: true, note: 'signature_mismatch' })
    }

    // 3. Map status → payment_status + status pesanan
    const isPaid =
      (transaction_status === 'capture' && fraud_status === 'accept') ||
      transaction_status === 'settlement'
    const isPending = transaction_status === 'pending'
    const isFailed = ['deny', 'cancel', 'expire'].includes(transaction_status)

    const update: Record<string, string> = {}
    if (isPaid) { update.payment_status = 'paid'; update.status = 'paid' }
    else if (isPending) { update.payment_status = 'awaiting_payment' }
    else if (isFailed) { update.payment_status = transaction_status === 'expire' ? 'expired' : 'failed' }

    if (Object.keys(update).length > 0) {
      const { error } = await supabaseAdmin.from('shop_orders').update(update).eq('id', order.id)
      if (error) console.error('[shop/webhook] update error:', error.message)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[shop/webhook] error:', err.message)
    return NextResponse.json({ received: true, error: err.message })
  }
}
