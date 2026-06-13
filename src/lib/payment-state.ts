import type { SupabaseClient } from '@supabase/supabase-js'

// An order is "paid enough to provision / build / publish" once the DP (or full
// payment) has cleared. Mirrors the dp_paid guard already used in /api/briefing
// and /api/payment/pelunasan. Centralised here so every fulfillment path uses
// the same invariant (see audit 2026-06-13: provisioning/publish had no gate).
export const PAID_STATES = ['dp_paid', 'lunas'] as const

export function isOrderPaid(status: string | null | undefined): boolean {
  return status === 'dp_paid' || status === 'lunas'
}

/**
 * Whether the order linked to a tenant has cleared payment. Returns true when
 * there is NO linked order (internal/demo page) so non-order pages are never
 * blocked from publishing.
 */
export async function orderPaidForTenant(
  db: SupabaseClient,
  tenantId: string,
): Promise<boolean> {
  const { data } = await db
    .from('orders')
    .select('payment_status')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: true })
    .limit(1)
  const row = data?.[0]
  if (!row) return true // no linked order → not an order-gated page
  return isOrderPaid(row.payment_status)
}
