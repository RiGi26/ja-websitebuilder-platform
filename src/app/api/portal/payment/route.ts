import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getTenantPaymentStatus, saveTenantMidtrans } from '@/lib/tenant-midtrans'
import { paymentEntitled } from '@/lib/addons/portal-tabs'
import type { FeatureFlags } from '@/types/websitebuilder'

// Tenant id dari sesi customer (JWT app_metadata). null bila tak login.
async function getSessionTenantId(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const tid = (user.app_metadata as Record<string, unknown>)?.tenant_id
  return typeof tid === 'string' ? tid : null
}

// Gate add-on: tab Pembayaran = add-on `midtrans` (features.hasPayment) atau
// grandfather (sudah pernah konfigurasi). Gate UI di PortalDashboard hanya
// kosmetik — penolakan sesungguhnya di sini.
async function checkEntitlement(tenantId: string) {
  const [{ data: page }, status] = await Promise.all([
    supabaseAdmin
      .from('landing_pages')
      .select('konfigurasi')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
    getTenantPaymentStatus(tenantId),
  ])
  const features = ((page?.konfigurasi ?? {}) as { features?: FeatureFlags }).features
  return { entitled: paymentEntitled(features, status.configured), status }
}

const FORBIDDEN = {
  error: 'Fitur pembayaran online belum termasuk paket Anda. Hubungi admin Webzoka untuk mengaktifkan.',
}

// GET — status konfigurasi pembayaran toko (tanpa membuka server key)
export async function GET() {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { entitled, status } = await checkEntitlement(tenantId)
  if (!entitled) return NextResponse.json(FORBIDDEN, { status: 403 })
  return NextResponse.json({ status })
}

// POST — simpan kredensial Midtrans milik tenant
//   { serverKey?, clientKey?, isProduction?, isActive? }
export async function POST(request: Request) {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { entitled, status: cur } = await checkEntitlement(tenantId)
    if (!entitled) return NextResponse.json(FORBIDDEN, { status: 403 })

    const body = await request.json()
    // Validasi ringan: kalau mengaktifkan, wajib sudah ada server key (baru/existing)
    if (body.isActive === true) {
      const willHaveServerKey = (typeof body.serverKey === 'string' && body.serverKey.trim()) || cur.configured
      if (!willHaveServerKey) {
        return NextResponse.json({ error: 'Server key wajib diisi sebelum mengaktifkan pembayaran.' }, { status: 400 })
      }
    }
    await saveTenantMidtrans(tenantId, {
      serverKey: body.serverKey,
      clientKey: body.clientKey,
      isProduction: body.isProduction,
      isActive: body.isActive,
    })
    const status = await getTenantPaymentStatus(tenantId)
    return NextResponse.json({ status })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
