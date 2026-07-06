import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { BESPOKE_RENDERERS } from '@/app/components/themes/toko-bespoke/registry'
import { validateThemeCopyInput } from '@/lib/theme-system/slot-schema'
import { BLOG_SLOT_MANIFEST } from '@/app/[slug]/blog/blog.slots'

// Copy khas-tema editan klien (panel "Konten Tema" portal) — baca/tulis
// data_konten.theme_copy milik tenant sendiri. Beda dari /api/portal/landing-page
// (whitelist field tetap), field yang sah di sini DITENTUKAN manifest slot tema
// si tenant (BespokeEntry.slots) — schema-driven, tak ada whitelist tulisan
// tangan per tema. Tulis via service role SETELAH verifikasi kepemilikan
// (konsisten dgn route portal lain). Nilai dirender sebagai text node React;
// saringan XSS shared tetap dipasang di pintu tulis (pertahanan berlapis).

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
    .select('id, data_konten, konfigurasi, tipe_industri')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

// Manifest slot untuk tema halaman ini; null bila tema tak punya (belum
// dimigrasi zero-hardcode / bukan bespoke). Fallback: halaman ber-blog aktif
// (tipe blog / add-on hasBlog) dapat manifest slot blog (chrome /{slug}/blog).
function manifestForPage(konfigurasi: unknown, tipeIndustri?: string | null) {
  const konfig = (konfigurasi ?? {}) as Record<string, unknown>
  const branding = (konfig.branding ?? {}) as Record<string, unknown>
  const theme = typeof branding.theme === 'string' ? branding.theme : undefined
  const bespoke = theme ? BESPOKE_RENDERERS[theme]?.slots ?? null : null
  if (bespoke) return bespoke
  const features = (konfig.features ?? {}) as Record<string, unknown>
  const blogEnabled = tipeIndustri === 'blog' || features.hasBlog === true
  return blogEnabled ? BLOG_SLOT_MANIFEST : null
}

export async function GET() {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const page = await getTenantPage(tenantId)
    if (!page) return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 })
    const k = (page.data_konten ?? {}) as Record<string, unknown>
    const values = k.theme_copy && typeof k.theme_copy === 'object' && !Array.isArray(k.theme_copy)
      ? k.theme_copy
      : {}
    return NextResponse.json({ values })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PATCH { values: { [slotKey]: nilai } } — null/''/[] = hapus key (kembali ke
// copy bawaan tema). Key wajib terdaftar di manifest slot tema (pipe 'copy').
export async function PATCH(request: Request) {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json().catch(() => ({}))
    const input = (body as Record<string, unknown> | null)?.values

    const page = await getTenantPage(tenantId)
    if (!page) return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 })

    const manifest = manifestForPage(page.konfigurasi, (page as { tipe_industri?: string | null }).tipe_industri)
    if (!manifest) {
      return NextResponse.json({ error: 'Tema ini belum mendukung edit copy tema' }, { status: 400 })
    }

    const result = validateThemeCopyInput(manifest, input)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

    // Merge ke data_konten.theme_copy: nilai baru menimpa, removal menghapus
    // (fallback default manifest hidup di renderer, bukan di DB).
    const existing = (page.data_konten ?? {}) as Record<string, unknown>
    const currentCopy = existing.theme_copy && typeof existing.theme_copy === 'object' && !Array.isArray(existing.theme_copy)
      ? (existing.theme_copy as Record<string, unknown>)
      : {}
    const nextCopy: Record<string, unknown> = { ...currentCopy, ...result.values }
    for (const key of result.removals) delete nextCopy[key]

    const { error } = await supabaseAdmin
      .from('landing_pages')
      .update({ data_konten: { ...existing, theme_copy: nextCopy } })
      .eq('id', page.id)
      .eq('tenant_id', tenantId)
    if (error) throw error

    return NextResponse.json({ ok: true, values: nextCopy })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
