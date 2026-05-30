import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { updateLandingPage, publishPage } from '@/lib/supabase/websitebuilder'
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
    const { id, action, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id wajib' }, { status: 400 })

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
