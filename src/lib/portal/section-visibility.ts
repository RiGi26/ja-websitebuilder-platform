// SSOT bagian situs yang boleh disembunyikan customer via portal "Susunan
// Halaman". Key = nama field di ComposableContent yang dibaca renderer
// bespoke/lux (content-adapter) — menonaktifkan = null-kan field itu → renderer
// (semua ber-guard `&& length > 0`) otomatis berhenti merendernya. Dipakai
// bertiga: server (portal/page.tsx menghitung yang tersedia), API
// (landing-page route memvalidasi input), dan client (SusunanPanel).
//
// Hanya blok PENGAYAAN yang boleh disembunyikan — bukan inti halaman (hero/
// etalase/kontak/CTA), yang akan merusak situs bila hilang.

export const HIDEABLE_SECTION_KEYS = ['stats', 'faq', 'statement', 'gallery'] as const
export type HideableSectionKey = (typeof HIDEABLE_SECTION_KEYS)[number]

export const HIDEABLE_SECTION_LABEL: Record<HideableSectionKey, string> = {
  stats: 'Statistik',
  faq: 'FAQ',
  statement: 'Filosofi',
  gallery: 'Galeri',
}

const KEY_SET = new Set<string>(HIDEABLE_SECTION_KEYS)

// Saring input bebas → hanya key valid, unik, urutan stabil. Dipakai di render
// path (data_konten) maupun validasi API — satu pintu agar tak drift.
export function sanitizeHiddenSections(v: unknown): HideableSectionKey[] {
  if (!Array.isArray(v)) return []
  const out: HideableSectionKey[] = []
  for (const key of HIDEABLE_SECTION_KEYS) {
    if (v.some((x) => x === key)) out.push(key)
  }
  return out
}

// Beda dari sanitize: untuk validasi PATCH — true bila SEMUA elemen valid
// (input rusak ditolak 400, bukan dibersihkan diam-diam).
export function isValidHiddenSectionsInput(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string' && KEY_SET.has(x))
}
