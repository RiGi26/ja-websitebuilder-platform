import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getTenantPaymentStatus, saveTenantMidtrans } from '@/lib/tenant-midtrans'

// Tenant id dari sesi customer (JWT app_metadata). null bila tak login.
async function getSessionTenantId(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const tid = (user.app_metadata as Record<string, unknown>)?.tenant_id
  return typeof tid === 'string' ? tid : null
}

// GET — status konfigurasi pembayaran toko (tanpa membuka server key)
export async function GET() {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const status = await getTenantPaymentStatus(tenantId)
  return NextResponse.json({ status })
}

// POST — simpan kredensial Midtrans milik tenant
//   { serverKey?, clientKey?, isProduction?, isActive? }
export async function POST(request: Request) {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    // Validasi ringan: kalau mengaktifkan, wajib sudah ada server key (baru/existing)
    if (body.isActive === true) {
      const cur = await getTenantPaymentStatus(tenantId)
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
