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
}
