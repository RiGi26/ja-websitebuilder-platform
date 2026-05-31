import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { createClientAccountForTenant, generatePassword } from '@/lib/client-account'

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

// GET ?tenantId= : status akun (apakah sudah ada, email-nya apa)
export async function GET(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tenantId = new URL(request.url).searchParams.get('tenantId')
  if (!tenantId) return NextResponse.json({ error: 'tenantId wajib' }, { status: 400 })

  const { data: tenant, error } = await supabaseAdmin
    .from('tenants')
    .select('auth_user_id, email')
    .eq('id', tenantId)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    hasAccount: !!tenant?.auth_user_id,
    email: tenant?.email ?? null,
  })
}

// POST { tenantId, email? } : buat akun (untuk website lama / order tanpa email)
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { tenantId, email } = await request.json()
    if (!tenantId) return NextResponse.json({ error: 'tenantId wajib' }, { status: 400 })

    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('nama, email').eq('id', tenantId).maybeSingle()

    const result = await createClientAccountForTenant(tenantId, email ?? tenant?.email, tenant?.nama)
    if (!result.created && result.reason === 'no_email') {
      return NextResponse.json({ error: 'Tenant belum punya email. Sertakan email pada body.' }, { status: 400 })
    }
    return NextResponse.json({ account: result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH { tenantId } : reset password akun yang sudah ada
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { tenantId } = await request.json()
    if (!tenantId) return NextResponse.json({ error: 'tenantId wajib' }, { status: 400 })

    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('auth_user_id, email').eq('id', tenantId).maybeSingle()
    if (!tenant?.auth_user_id) {
      return NextResponse.json({ error: 'Akun belum ada — buat dulu.' }, { status: 400 })
    }

    const password = generatePassword()
    const { error } = await supabaseAdmin.auth.admin.updateUserById(tenant.auth_user_id, { password })
    if (error) throw error
    return NextResponse.json({ account: { created: true, email: tenant.email, password } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
