import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sanitizeHiddenSections, isValidHiddenSectionsInput } from '@/lib/portal/section-visibility'

// Tab Tampilan + kartu "Angka, FAQ & Filosofi" portal — baca/ubah field
// whitelist di landing_pages.data_konten milik tenant sendiri. Whitelist KETAT
// (foto_hero, foto_hero_focus, stats, faq, statement — tiap field divalidasi
// bentuk & panjangnya); jangan pernah menerima data_konten bebas dari klien.
// Tulis via service role SETELAH verifikasi kepemilikan (konsisten dgn route
// portal lain).

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

// ── Validator konten brand (stats/faq/statement) ────────────────
// Bentuk mengikuti parser content-adapter.ts (parseStats/parseFaq/
// parseStatement). Batas panjang menjaga payload tetap konten wajar.
function cleanStr(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null
  const s = v.trim()
  return s && s.length <= max ? s : null
}

// stats: array ≤4 dari {angka ≤30, label ≤80}. [] = hapus (section self-hide).
function parseStatsInput(v: unknown): { angka: string; label: string }[] | null {
  if (!Array.isArray(v) || v.length > 4) return null
  const out: { angka: string; label: string }[] = []
  for (const raw of v) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
    const r = raw as Record<string, unknown>
    const angka = cleanStr(r.angka, 30)
    const label = cleanStr(r.label, 80)
    if (!angka || !label) return null
    out.push({ angka, label })
  }
  return out
}

// faq: array ≤10 dari {q ≤200, a ≤1000}. [] = hapus.
function parseFaqInput(v: unknown): { q: string; a: string }[] | null {
  if (!Array.isArray(v) || v.length > 10) return null
  const out: { q: string; a: string }[] = []
  for (const raw of v) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
    const r = raw as Record<string, unknown>
    const q = cleanStr(r.q, 200)
    const a = cleanStr(r.a, 1000)
    if (!q || !a) return null
    out.push({ q, a })
  }
  return out
}

// statement: null = hapus; objek {quote wajib ≤300, eyebrow ≤60, cite ≤120}.
// Sentinel 'invalid' membedakan input rusak dari nilai null yang sah.
function parseStatementInput(v: unknown): { eyebrow?: string; quote: string; cite?: string } | null | 'invalid' {
  if (v === null) return null
  if (!v || typeof v !== 'object' || Array.isArray(v)) return 'invalid'
  const r = v as Record<string, unknown>
  const quote = cleanStr(r.quote, 300)
  if (!quote) return 'invalid'
  const eyebrow = cleanStr(r.eyebrow, 60)
  const cite = cleanStr(r.cite, 120)
  return { quote, ...(eyebrow ? { eyebrow } : {}), ...(cite ? { cite } : {}) }
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
      stats: Array.isArray(k.stats) ? k.stats : [],
      faq: Array.isArray(k.faq) ? k.faq : [],
      statement: k.statement && typeof k.statement === 'object' ? k.statement : null,
      hidden_sections: sanitizeHiddenSections(k.hidden_sections),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PATCH { foto_hero?, foto_hero_focus?, stats?, faq?, statement? } —
// string kosong / array kosong / null = hapus (section self-hide di renderer).
export async function PATCH(request: Request) {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json().catch(() => ({}))
    const { foto_hero, foto_hero_focus, stats, faq, statement, hidden_sections } = (body ?? {}) as {
      foto_hero?: unknown; foto_hero_focus?: unknown; stats?: unknown; faq?: unknown; statement?: unknown; hidden_sections?: unknown
    }

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
    if (stats !== undefined) {
      const parsed = parseStatsInput(stats)
      if (!parsed) return NextResponse.json({ error: 'stats tidak valid (maks 4, angka & label wajib)' }, { status: 400 })
      updates.stats = parsed
    }
    if (faq !== undefined) {
      const parsed = parseFaqInput(faq)
      if (!parsed) return NextResponse.json({ error: 'faq tidak valid (maks 10, pertanyaan & jawaban wajib)' }, { status: 400 })
      updates.faq = parsed
    }
    if (statement !== undefined) {
      const parsed = parseStatementInput(statement)
      if (parsed === 'invalid') return NextResponse.json({ error: 'statement tidak valid (kutipan wajib, maks 300 karakter)' }, { status: 400 })
      updates.statement = parsed
    }
    if (hidden_sections !== undefined) {
      if (!isValidHiddenSectionsInput(hidden_sections)) {
        return NextResponse.json({ error: 'hidden_sections tidak valid' }, { status: 400 })
      }
      updates.hidden_sections = sanitizeHiddenSections(hidden_sections)
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
