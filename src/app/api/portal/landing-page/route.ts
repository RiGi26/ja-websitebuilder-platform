import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Tab Tampilan portal — baca/ubah field tampilan di landing_pages.data_konten
// milik tenant sendiri. Whitelist KETAT (hanya foto_hero & foto_hero_focus);
// jangan pernah menerima data_konten bebas dari klien. Tulis via service role
// SETELAH verifikasi kepemilikan (konsisten dgn route portal lain).

async function getSessionTenantId(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const tid = (user.app_metadata as Record<string, unknown>)?.tenant_id
  return typeof tid === 'string' ? tid : null
}

async function getTenantPage(tenantId: string) {
  const { data, error } = await supabaseAdmin
    .from('landing_pages')
    .select('id, data_konten')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

// CSS position "x% y%" dengan komponen 0-100.
function validFocus(v: string): boolean {
  const m = /^(\d{1,3})% (\d{1,3})%$/.exec(v)
  return !!m && Number(m[1]) <= 100 && Number(m[2]) <= 100
}

export async function GET() {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const page = await getTenantPage(tenantId)
    if (!page) return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 })
    const k = (page.data_konten ?? {}) as Record<string, unknown>
    return NextResponse.json({
      foto_hero: typeof k.foto_hero === 'string' ? k.foto_hero : '',
      foto_hero_focus: typeof k.foto_hero_focus === 'string' ? k.foto_hero_focus : '',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PATCH { foto_hero?, foto_hero_focus? } — string kosong = hapus.
export async function PATCH(request: Request) {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json().catch(() => ({}))
    const { foto_hero, foto_hero_focus } = (body ?? {}) as { foto_hero?: unknown; foto_hero_focus?: unknown }

    const updates: Record<string, unknown> = {}
    if (foto_hero !== undefined) {
      if (typeof foto_hero !== 'string' || foto_hero.length > 2048) {
        return NextResponse.json({ error: 'foto_hero tidak valid' }, { status: 400 })
      }
      const url = foto_hero.trim()
      if (url && !url.startsWith('https://')) {
        return NextResponse.json({ error: 'URL foto harus https://' }, { status: 400 })
      }
      updates.foto_hero = url
    }
    if (foto_hero_focus !== undefined) {
      if (typeof foto_hero_focus !== 'string') {
        return NextResponse.json({ error: 'foto_hero_focus tidak valid' }, { status: 400 })
      }
      const focus = foto_hero_focus.trim()
      if (focus && !validFocus(focus)) {
        return NextResponse.json({ error: 'Titik fokus tidak valid (format "x% y%")' }, { status: 400 })
      }
      updates.foto_hero_focus = focus
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Tak ada perubahan' }, { status: 400 })
    }

    const page = await getTenantPage(tenantId)
    if (!page) return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 })

    const existing = (page.data_konten ?? {}) as Record<string, unknown>
    const { error } = await supabaseAdmin
      .from('landing_pages')
      .update({ data_konten: { ...existing, ...updates } })
      .eq('id', page.id)
      .eq('tenant_id', tenantId)
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
