import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { updateLandingPage, publishPage } from '@/lib/supabase/websitebuilder'
import { orderPaidForTenant } from '@/lib/payment-state'
import type { InsertLandingPageInput } from '@/types/websitebuilder'

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

// PATCH { id, action?: 'publish'|'unpublish', ...fields }
// - action publish/unpublish: ubah status.
// - tanpa action: update field landing_page (nama_website, slug, domain_custom,
//   tipe_industri, data_konten, konfigurasi).
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { id, action, force, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id wajib' }, { status: 400 })

    // Payment gate (audit 2026-06-13): jangan terbitkan situs (status published)
    // sebelum order-nya bayar DP/lunas. Berlaku utk action 'publish' DAN update
    // field status:'published'. Page tanpa order tertaut (demo/internal) tak
    // diblokir. Override eksplisit via { force: true }.
    const isPublishing = action === 'publish' || (action !== 'unpublish' && rest.status === 'published')
    if (isPublishing && force !== true) {
      const { data: pg } = await supabaseAdmin
        .from('landing_pages')
        .select('tenant_id')
        .eq('id', id)
        .maybeSingle()
      const paid = pg?.tenant_id ? await orderPaidForTenant(supabaseAdmin, pg.tenant_id) : true
      if (!paid) {
        return NextResponse.json(
          { error: 'Pembayaran belum dikonfirmasi (DP/lunas) — tidak bisa publish situs.' },
          { status: 409 },
        )
      }
    }

    if (action === 'publish') {
      const page = await publishPage(supabaseAdmin, id)
      return NextResponse.json({ page })
    }
    if (action === 'unpublish') {
      const page = await updateLandingPage(supabaseAdmin, id, { status: 'draft' })
      return NextResponse.json({ page })
    }

    // Whitelist field yang boleh diupdate (hindari ubah id/tenant_id/timestamps)
    const allowed: (keyof InsertLandingPageInput)[] = [
      'nama_website',
      'slug',
      'domain_custom',
      'tipe_industri',
      'data_konten',
      'konfigurasi',
      'status',
    ]
    const patch: Partial<InsertLandingPageInput> = {}
    for (const key of allowed) {
      if (key in rest) (patch as Record<string, unknown>)[key] = rest[key]
    }

    const page = await updateLandingPage(supabaseAdmin, id, patch)
    return NextResponse.json({ page })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
