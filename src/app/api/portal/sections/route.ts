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

// XSS guard (audit 2026-06-13): isi_komponen dirender apa adanya, dan tipe
// custom_html dirender via dangerouslySetInnerHTML. Portal (klien) TIDAK boleh
// menulis HTML mentah atau URL skema berbahaya. Studio (admin) tak lewat sini.
// Mengembalikan alasan penolakan, atau null bila aman.
function findUnsafeContent(value: unknown, key = ''): string | null {
  if (key.toLowerCase() === 'html') return 'field "html" tidak diizinkan dari portal'
  if (typeof value === 'string') {
    if (/^\s*javascript:/i.test(value)) return 'URL javascript: tidak diizinkan'
    if (/^\s*data:text\/html/i.test(value)) return 'data URL HTML tidak diizinkan'
    return null
  }
  if (Array.isArray(value)) {
    for (const v of value) {
      const r = findUnsafeContent(v, key)
      if (r) return r
    }
    return null
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const r = findUnsafeContent(v, k)
      if (r) return r
    }
    return null
  }
  return null
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
      .select('id, tenant_id, tipe_komponen')
      .eq('id', sectionId)
      .maybeSingle()
    if (selErr) throw selErr
    if (!section || section.tenant_id !== tenantId) {
      return NextResponse.json({ error: 'Section tidak ditemukan' }, { status: 404 })
    }

    // XSS hardening: portal tak boleh menulis HTML mentah. custom_html dirender
    // via dangerouslySetInnerHTML (studio-only); tolak edit isi_komponen-nya dari
    // portal, dan saring HTML/URL berbahaya untuk tipe lain.
    if (update.isi_komponen !== undefined) {
      if (section.tipe_komponen === 'custom_html') {
        return NextResponse.json(
          { error: 'Section HTML kustom hanya bisa diedit oleh tim studio.' },
          { status: 403 },
        )
      }
      const unsafe = findUnsafeContent(update.isi_komponen)
      if (unsafe) {
        return NextResponse.json({ error: `Konten tidak diizinkan: ${unsafe}` }, { status: 400 })
      }
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
