import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// F5-3 — Self-edit konten halaman oleh klien (teks/gambar section).
// Klien login portal → edit isi_komponen section miliknya. Tulis lewat
// service role SETELAH verifikasi section ini milik tenant si klien
// (tidak melebarkan RLS page_sections; konsisten dgn route portal lain).

async function getSessionTenantId(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const tid = (user.app_metadata as Record<string, unknown>)?.tenant_id
  return typeof tid === 'string' ? tid : null
}

// PATCH { sectionId, isi_komponen }  → update teks/gambar satu section.
export async function PATCH(request: Request) {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { sectionId, isi_komponen, is_visible, urutan } = body ?? {}
    if (!sectionId || typeof sectionId !== 'string') {
      return NextResponse.json({ error: 'sectionId wajib' }, { status: 400 })
    }

    // Bangun update dari field yang dikirim: isi_komponen (teks/gambar) dan/atau
    // metadata is_visible (tampil/sembunyi) & urutan (reorder). Semua opsional.
    const update: Record<string, unknown> = {}
    if (isi_komponen !== undefined) {
      if (typeof isi_komponen !== 'object' || Array.isArray(isi_komponen)) {
        return NextResponse.json({ error: 'isi_komponen tidak valid' }, { status: 400 })
      }
      update.isi_komponen = isi_komponen
    }
    if (is_visible !== undefined) {
      if (typeof is_visible !== 'boolean') {
        return NextResponse.json({ error: 'is_visible tidak valid' }, { status: 400 })
      }
      update.is_visible = is_visible
    }
    if (urutan !== undefined) {
      if (typeof urutan !== 'number' || !Number.isInteger(urutan)) {
        return NextResponse.json({ error: 'urutan tidak valid' }, { status: 400 })
      }
      update.urutan = urutan
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'Tak ada perubahan' }, { status: 400 })
    }

    // Ownership: section harus milik tenant si klien.
    const { data: section, error: selErr } = await supabaseAdmin
      .from('page_sections')
      .select('id, tenant_id')
      .eq('id', sectionId)
      .maybeSingle()
    if (selErr) throw selErr
    if (!section || section.tenant_id !== tenantId) {
      return NextResponse.json({ error: 'Section tidak ditemukan' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('page_sections')
      .update(update)
      .eq('id', sectionId)
      .select('id, tipe_komponen, urutan, isi_komponen, is_visible')
      .single()
    if (error) throw error

    return NextResponse.json({ ok: true, section: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
