// ============================================================
// TOKO-BESPOKE — SUMBER KEBENARAN TUNGGAL pemetaan varian.
// id ThemeOption (disimpan briefing.branding.variant) → { theme key bespoke,
// palet variant native renderer, sample HTML untuk imagery-borrow }.
//
// Dipakai generateContent.ts (intercept toko_online) + gen-samples.test.tsx.
// WAJIB sinkron dengan id di taxonomy.ts THEMES.toko_online[subcat] dan key di
// registry.ts (theme) + LUX_SAMPLE_ALIAS sample-content.ts (sample).
// ============================================================

export interface BespokeVariantMap {
  /** Key bespoke di registry.ts + branding.theme (mis. 'toko-atelier'). */
  theme: string
  /** Palet native renderer (mis. 'noir' | 'ivoire' | 'tungku' | 'pamor'). */
  variant: string
  /** Key sampleContentForTheme untuk imagery-borrow auto-build + sample HTML. */
  sample: string
}

export const TOKO_BESPOKE_VARIANTS: Record<string, BespokeVariantMap> = {
  // Fashion — flagship Atelier (noir/ivoire). Tetap.
  'atelier-noir': { theme: 'toko-atelier', variant: 'noir', sample: 'toko-atelier' },
  'atelier-ivoire': { theme: 'toko-atelier', variant: 'ivoire', sample: 'toko-atelier' },
  // Kuliner — Toko Dapur (Tungku terang-hangat / Pamor gelap-heritage).
  'kuliner-tungku': { theme: 'toko-kuliner', variant: 'tungku', sample: 'kuliner-lux' },
  'kuliner-pamor': { theme: 'toko-kuliner', variant: 'pamor', sample: 'kuliner-lux' },
  // Kerajinan — Tanah Loka (forest/parchment/bronze, kawung motif).
  'kerajinan-tanah': { theme: 'toko-kerajinan', variant: 'tanah', sample: 'kerajinan-lux' },
}

// Blok opsional yang BENAR dikonsumsi tiap renderer bespoke dari ComposableContent
// (cek pemakaian content.social / content.gallery di renderer-nya). Dipakai
// detail-form (gate blok input) + portal (gate tab Galeri) supaya permukaan edit
// hanya muncul untuk konten yang benar-benar dirender. Semua renderer bespoke
// juga mengonsumsi stats/faq/statement/about/testimoni/foto_hero + products —
// itu konstanta, tak perlu dideklarasikan per tema di sini.
export interface BespokeRenderedBlocks {
  social?: boolean
  gallery?: boolean
}

export const BESPOKE_RENDERED_BLOCKS: Record<string, BespokeRenderedBlocks> = {
  'toko-atelier': { social: true, gallery: true },
  'toko-kuliner': { social: true, gallery: true },
  'toko-kerajinan': {},
}
