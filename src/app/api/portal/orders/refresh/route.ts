import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { refreshShopOrderStatus } from '@/lib/shop-order-status'

// POST — refresh status semua pesanan yang belum final milik tenant (sesi customer).
// Membuat status terupdate tanpa webhook (zero-config bagi klien).
export async function POST() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const tenantId = (user?.app_metadata as Record<string, unknown>)?.tenant_id
  if (!user || typeof tenantId !== 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ambil pesanan yang masih menunggu pembayaran (batasi agar ringan).
  const { data: pending } = await supabaseAdmin
    .from('shop_orders')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('payment_status', 'awaiting_payment')
    .order('created_at', { ascending: false })
    .limit(20)

  let updated = 0
  for (const o of pending ?? []) {
    try {
      const r = await refreshShopOrderStatus(o.id)
      if (r?.changed) updated++
    } catch { /* lanjut */ }
  }
  return NextResponse.json({ checked: pending?.length ?? 0, updated })
}
