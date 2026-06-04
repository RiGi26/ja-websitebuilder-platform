import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { listPageVersions, restorePageVersion, snapshotPage } from '@/lib/build/versions'

// F5-2 — Riwayat versi & rollback halaman (admin-only, service role).
// GET    /api/admin/pages/[id]/versions          → daftar versi
// POST   /api/admin/pages/[id]/versions          → { action: 'snapshot', label? }  simpan versi sekarang
//        body { action: 'restore', versionId }   → kembalikan ke versi tsb

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id: pageId } = await params
    const versions = await listPageVersions(supabaseAdmin, pageId)
    return NextResponse.json({ versions })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id: pageId } = await params
    const body = await request.json().catch(() => ({}))
    const action = body?.action ?? 'snapshot'

    if (action === 'restore') {
      const versionId = body?.versionId
      if (!versionId) return NextResponse.json({ error: 'versionId wajib' }, { status: 400 })
      // Pastikan versi memang milik page ini (cegah restore lintas page).
      const { data: v } = await supabaseAdmin
        .from('page_versions')
        .select('page_id')
        .eq('id', versionId)
        .maybeSingle()
      if (!v || v.page_id !== pageId) {
        return NextResponse.json({ error: 'Versi tidak ditemukan untuk halaman ini' }, { status: 404 })
      }
      const result = await restorePageVersion(supabaseAdmin, versionId)
      return NextResponse.json({ ok: true, ...result })
    }

    if (action === 'snapshot') {
      const { data: page } = await supabaseAdmin
        .from('landing_pages')
        .select('tenant_id')
        .eq('id', pageId)
        .maybeSingle()
      if (!page) return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 })
      const res = await snapshotPage(supabaseAdmin, {
        pageId,
        tenantId: page.tenant_id,
        kind: 'manual',
        label: typeof body?.label === 'string' && body.label.trim() ? body.label.trim() : 'Snapshot manual',
        force: true,
      })
      return NextResponse.json({ ok: true, versionId: res?.id ?? null })
    }

    return NextResponse.json({ error: 'action tidak dikenal' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
