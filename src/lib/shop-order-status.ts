// ============================================================
// Refresh status pesanan toko dengan menanyakan langsung ke Midtrans
// (Status API) memakai server key KLIEN. Ini membuat webhook OPSIONAL:
// status terupdate saat pembeli kembali dari pembayaran / saat portal
// di-refresh, tanpa client perlu set Notification URL di Midtrans.
// Server-only.
// ============================================================

import { supabaseAdmin } from '@/lib/supabase-admin'
import { getTenantMidtrans } from '@/lib/tenant-midtrans'

type RefreshResult = {
  payment_status: string
  status: string
  changed: boolean
}

// Map transaction_status Midtrans → status internal.
function mapStatus(transaction_status: string, fraud_status?: string): { payment_status: string; status?: string } {
  const isPaid =
    (transaction_status === 'capture' && fraud_status === 'accept') ||
    transaction_status === 'settlement'
  if (isPaid) return { payment_status: 'paid', status: 'paid' }
  if (transaction_status === 'pending') return { payment_status: 'awaiting_payment' }
  if (transaction_status === 'expire') return { payment_status: 'expired' }
  if (['deny', 'cancel'].includes(transaction_status)) return { payment_status: 'failed' }
  return { payment_status: 'awaiting_payment' }
}

/**
 * Cek status terkini sebuah shop_order ke Midtrans & update DB bila berubah.
 * Tidak melakukan apa-apa jika order sudah final (paid) atau belum punya
 * midtrans_order_id. Aman dipanggil berulang (idempotent).
 */
export async function refreshShopOrderStatus(orderId: string): Promise<RefreshResult | null> {
  const { data: order } = await supabaseAdmin
    .from('shop_orders')
    .select('id, tenant_id, midtrans_order_id, payment_status, status')
    .eq('id', orderId)
    .maybeSingle()
  if (!order || !order.midtrans_order_id) return null

  // Sudah final → tak perlu tanya lagi.
  if (order.payment_status === 'paid') {
    return { payment_status: order.payment_status, status: order.status, changed: false }
  }

  const mid = await getTenantMidtrans(order.tenant_id)
  if (!mid) return { payment_status: order.payment_status, status: order.status, changed: false }

  const base = mid.isProduction ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com'
  const auth = Buffer.from(`${mid.serverKey}:`).toString('base64')

  let txStatus: string | undefined
  let fraud: string | undefined
  try {
    const res = await fetch(`${base}/v2/${encodeURIComponent(order.midtrans_order_id)}/status`, {
      headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
      cache: 'no-store',
    })
    const data = await res.json()
    // 404 = transaksi belum ada di Midtrans (pembeli belum bayar) → biarkan.
    if (!res.ok) return { payment_status: order.payment_status, status: order.status, changed: false }
    txStatus = data.transaction_status
    fraud = data.fraud_status
  } catch {
    return { payment_status: order.payment_status, status: order.status, changed: false }
  }
  if (!txStatus) return { payment_status: order.payment_status, status: order.status, changed: false }

  const mapped = mapStatus(txStatus, fraud)
  const changed = mapped.payment_status !== order.payment_status || (mapped.status && mapped.status !== order.status)
  if (changed) {
    const update: Record<string, string> = { payment_status: mapped.payment_status }
    if (mapped.status) update.status = mapped.status
    await supabaseAdmin.from('shop_orders').update(update).eq('id', order.id)
  }
  return {
    payment_status: mapped.payment_status,
    status: mapped.status ?? order.status,
    changed: !!changed,
  }
}
