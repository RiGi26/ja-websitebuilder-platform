import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import {
  upsertSection,
  updateSectionContent,
  toggleSectionVisibility,
  deleteSections,
} from '@/lib/supabase/websitebuilder'
import type { InsertPageSectionInput } from '@/types/websitebuilder'

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

// POST: buat/update section (upsert by page_id + urutan).
// Body wajib: page_id, tenant_id, urutan, tipe_komponen, isi_komponen?, is_visible?
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const b = await request.json()
    if (!b.page_id || !b.tenant_id || b.urutan === undefined || !b.tipe_komponen) {
      return NextResponse.json({ error: 'page_id, tenant_id, urutan, tipe_komponen wajib' }, { status: 400 })
    }
    const input: InsertPageSectionInput = {
      page_id: b.page_id,
      tenant_id: b.tenant_id,
      urutan: b.urutan,
      tipe_komponen: b.tipe_komponen,
      is_visible: b.is_visible ?? true,
      isi_komponen: b.isi_komponen ?? {},
    }
    const section = await upsertSection(supabaseAdmin, input)
    return NextResponse.json({ section })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH { action: 'content'|'visibility'|'reorder', ... }
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const b = await request.json()
    switch (b.action) {
      case 'content': {
        if (!b.sectionId) return NextResponse.json({ error: 'sectionId wajib' }, { status: 400 })
        const section = await updateSectionContent(supabaseAdmin, b.sectionId, b.isi_komponen ?? {})
        return NextResponse.json({ section })
      }
      case 'visibility': {
        if (!b.sectionId) return NextResponse.json({ error: 'sectionId wajib' }, { status: 400 })
        const section = await toggleSectionVisibility(supabaseAdmin, b.sectionId, !!b.is_visible)
        return NextResponse.json({ section })
      }
      case 'reorder': {
        if (!Array.isArray(b.updates)) return NextResponse.json({ error: 'updates[] wajib' }, { status: 400 })
        // UPDATE per-baris (bukan upsert) supaya tidak kena NOT NULL pada
        // kolom lain. updates: Array<{ id, urutan }>.
        for (const u of b.updates as Array<{ id: string; urutan: number }>) {
          const { error } = await supabaseAdmin
            .from('page_sections')
            .update({ urutan: u.urutan })
            .eq('id', u.id)
          if (error) throw error
        }
        return NextResponse.json({ success: true })
      }
      default:
        return NextResponse.json({ error: 'action tidak dikenal' }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE { pageId, sectionIds: string[] }
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { pageId, sectionIds } = await request.json()
    if (!pageId || !Array.isArray(sectionIds)) {
      return NextResponse.json({ error: 'pageId & sectionIds[] wajib' }, { status: 400 })
    }
    await deleteSections(supabaseAdmin, pageId, sectionIds)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
