// ============================================================
// Refresh status pembayaran booking dengan menanyakan langsung ke
// Midtrans (Status API) memakai server key KLIEN. Webhook OPSIONAL:
// status terupdate saat pemesan kembali dari pembayaran / portal di-refresh.
// Pola sama dengan shop-order-status.ts. Server-only.
// ============================================================

import { supabaseAdmin } from '@/lib/supabase-admin'
import { getTenantMidtrans } from '@/lib/tenant-midtrans'

type RefreshResult = {
  payment_status: string
  status: string
  changed: boolean
}

// Map transaction_status Midtrans → status pembayaran internal booking.
function mapStatus(transaction_status: string, fraud_status?: string): { payment_status: string; status?: string } {
  const isPaid =
    (transaction_status === 'capture' && fraud_status === 'accept') ||
    transaction_status === 'settlement'
  if (isPaid) return { payment_status: 'paid', status: 'confirmed' }
  if (transaction_status === 'pending') return { payment_status: 'awaiting_payment' }
  if (transaction_status === 'expire') return { payment_status: 'expired' }
  if (['deny', 'cancel'].includes(transaction_status)) return { payment_status: 'failed' }
  return { payment_status: 'awaiting_payment' }
}

/**
 * Cek status terkini sebuah booking ke Midtrans & update DB bila berubah.
 * Tidak melakukan apa-apa jika booking sudah dibayar (paid), tidak butuh
 * pembayaran (not_required), atau belum punya midtrans_order_id. Idempotent.
 */
export async function refreshBookingStatus(bookingId: string): Promise<RefreshResult | null> {
  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('id, tenant_id, midtrans_order_id, payment_status, status')
    .eq('id', bookingId)
    .maybeSingle()
  if (!booking || !booking.midtrans_order_id) return null

  // Sudah final → tak perlu tanya lagi.
  if (booking.payment_status === 'paid' || booking.payment_status === 'not_required') {
    return { payment_status: booking.payment_status, status: booking.status, changed: false }
  }

  const mid = await getTenantMidtrans(booking.tenant_id)
  if (!mid) return { payment_status: booking.payment_status, status: booking.status, changed: false }

  const base = mid.isProduction ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com'
  const auth = Buffer.from(`${mid.serverKey}:`).toString('base64')

  let txStatus: string | undefined
  let fraud: string | undefined
  try {
    const res = await fetch(`${base}/v2/${encodeURIComponent(booking.midtrans_order_id)}/status`, {
      headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
      cache: 'no-store',
    })
    const data = await res.json()
    if (!res.ok) return { payment_status: booking.payment_status, status: booking.status, changed: false }
    txStatus = data.transaction_status
    fraud = data.fraud_status
  } catch {
    return { payment_status: booking.payment_status, status: booking.status, changed: false }
  }
  if (!txStatus) return { payment_status: booking.payment_status, status: booking.status, changed: false }

  const mapped = mapStatus(txStatus, fraud)
  const changed = mapped.payment_status !== booking.payment_status || (mapped.status && mapped.status !== booking.status)
  if (changed) {
    const update: Record<string, string> = { payment_status: mapped.payment_status }
    if (mapped.status) update.status = mapped.status
    await supabaseAdmin.from('bookings').update(update).eq('id', booking.id)
  }
  return {
    payment_status: mapped.payment_status,
    status: mapped.status ?? booking.status,
    changed: !!changed,
  }
}
