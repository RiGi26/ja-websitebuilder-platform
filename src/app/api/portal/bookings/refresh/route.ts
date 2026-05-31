import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { refreshBookingStatus } from '@/lib/booking-status'

// POST — refresh status semua booking yang masih menunggu pembayaran milik
// tenant (sesi customer). Status terupdate tanpa webhook (zero-config).
export async function POST() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const tenantId = (user?.app_metadata as Record<string, unknown>)?.tenant_id
  if (!user || typeof tenantId !== 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: pending } = await supabaseAdmin
    .from('bookings')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('payment_status', 'awaiting_payment')
    .order('created_at', { ascending: false })
    .limit(20)

  let updated = 0
  for (const b of pending ?? []) {
    try {
      const r = await refreshBookingStatus(b.id)
      if (r?.changed) updated++
    } catch { /* lanjut */ }
  }
  return NextResponse.json({ checked: pending?.length ?? 0, updated })
}
