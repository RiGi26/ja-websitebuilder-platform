import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { BESPOKE_RENDERERS } from '@/app/components/themes/toko-bespoke/registry'

// Style knobs (Wave 3) — tenant memilih palet/font pairing dari daftar KURASI
// temanya (BespokeEntry.design). BUKAN free-form: id divalidasi lawan registry;
// nilai bawaan TIDAK disalin ke DB (pilih bawaan = key dihapus → renderer pakai
// konstanta tema, parity terjaga). Tulis via service role SETELAH verifikasi
// kepemilikan (pola route portal lain), merge ke konfigurasi.design.

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
    .select('id, konfigurasi')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

function designOptionsForPage(konfigurasi: unknown) {
  const konfig = (konfigurasi ?? {}) as Record<string, unknown>
  const branding = (konfig.branding ?? {}) as Record<string, unknown>
  const theme = typeof branding.theme === 'string' ? branding.theme : undefined
  if (!theme) return null
  return BESPOKE_RENDERERS[theme]?.design ?? null
}

// PATCH { palette?, fontPairing? } — string = pilih; null/'' /id bawaan ([0]) =
// hapus key (kembali bawaan). Key tak dikirim = tak diubah.
export async function PATCH(request: Request) {
  const tenantId = await getSessionTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown> | null
    const page = await getTenantPage(tenantId)
    if (!page) return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 })

    const options = designOptionsForPage(page.konfigurasi)
    if (!options) {
      return NextResponse.json({ error: 'Tema ini belum menawarkan pilihan gaya' }, { status: 400 })
    }

    const updates: Record<string, string> = {}
    const removals: string[] = []

    const pick = (
      key: 'palette' | 'fontPairing',
      raw: unknown,
      list: { id: string }[] | undefined,
    ): string | null => {
      if (raw === undefined) return null
      if (raw === null || raw === '') { removals.push(key); return null }
      if (typeof raw !== 'string') return `${key} tidak valid`
      if (!list || !list.some((o) => o.id === raw)) return `${key} "${raw}" tidak tersedia untuk tema ini`
      // Pilih bawaan ([0]) = hapus key — default tak pernah disalin ke DB.
      if (list[0]?.id === raw) removals.push(key)
      else updates[key] = raw
      return null
    }

    const errPalette = pick('palette', body?.palette, options.palettes)
    if (errPalette) return NextResponse.json({ error: errPalette }, { status: 400 })
    const errPairing = pick('fontPairing', body?.fontPairing, options.fontPairings)
    if (errPairing) return NextResponse.json({ error: errPairing }, { status: 400 })

    if (Object.keys(updates).length === 0 && removals.length === 0) {
      return NextResponse.json({ error: 'Tak ada perubahan' }, { status: 400 })
    }

    const konfig = (page.konfigurasi ?? {}) as Record<string, unknown>
    const currentDesign = konfig.design && typeof konfig.design === 'object' && !Array.isArray(konfig.design)
      ? (konfig.design as Record<string, unknown>)
      : {}
    const nextDesign: Record<string, unknown> = { ...currentDesign, ...updates }
    for (const key of removals) delete nextDesign[key]

    const { error } = await supabaseAdmin
      .from('landing_pages')
      .update({ konfigurasi: { ...konfig, design: nextDesign } })
      .eq('id', page.id)
      .eq('tenant_id', tenantId)
    if (error) throw error

    return NextResponse.json({ ok: true, design: nextDesign })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
