// ============================================================
// BESPOKE — SUMBER KEBENARAN TUNGGAL pemetaan varian (intercept build-time).
// id ThemeOption (disimpan briefing.branding.variant) → { theme key bespoke,
// palet variant native renderer, sample HTML untuk imagery-borrow }.
//
// Dipakai generateContent.ts (intercept LINTAS INDUSTRI) + portal-tabs.ts +
// detail/page.tsx (gating permukaan edit). WAJIB sinkron dengan id di
// taxonomy.ts THEMES[tipe][subcat] dan key di registry.ts (theme) +
// LUX_SAMPLE_ALIAS sample-content.ts (sample).
//
// CATATAN: restaurant-lux SENGAJA tidak didaftarkan di sini — ia punya jalur
// `isLux` sendiri di generateContent + gating eksplisit di portal-tabs. Map ini
// menurunkan BESPOKE_THEMES (portal-tabs) yang harus tetap toko-only. Renderer-
// nya tetap universal via registry.ts BESPOKE_RENDERERS.
// ============================================================

export interface BespokeVariantMap {
  /** Key bespoke di registry.ts + branding.theme (mis. 'toko-atelier'). */
  theme: string
  /** Palet native renderer (mis. 'noir' | 'ivoire' | 'tungku' | 'pamor'). */
  variant: string
  /** Key sampleContentForTheme untuk imagery-borrow auto-build + sample HTML. */
  sample: string
}

export const BESPOKE_VARIANTS: Record<string, BespokeVariantMap> = {
  // Fashion — flagship Atelier (noir/ivoire). Tetap.
  'atelier-noir': { theme: 'toko-atelier', variant: 'noir', sample: 'toko-atelier' },
  'atelier-ivoire': { theme: 'toko-atelier', variant: 'ivoire', sample: 'toko-atelier' },
  // Kuliner — Toko Dapur (Tungku terang-hangat / Pamor gelap-heritage).
  'kuliner-tungku': { theme: 'toko-kuliner', variant: 'tungku', sample: 'kuliner-lux' },
  'kuliner-pamor': { theme: 'toko-kuliner', variant: 'pamor', sample: 'kuliner-lux' },
  // Kerajinan — Tanah Loka (forest/parchment/bronze, kawung motif).
  'kerajinan-tanah': { theme: 'toko-kerajinan', variant: 'tanah', sample: 'kerajinan-lux' },
  // Kecantikan — Embun (porcelain/blush/rose, signature glow halo).
  'kecantikan-embun': { theme: 'toko-kecantikan', variant: 'embun', sample: 'kecantikan-lux' },
  // Gadget — Onyx (near-black/cyan, signature blueprint-grid + spec-readout HUD).
  'gadget-onyx': { theme: 'toko-gadget', variant: 'onyx', sample: 'gadget-lux' },
  // Rumah & Dekor — Selaras (Japandi greige/sage-slate, signature arched alcove).
  'rumah-selaras': { theme: 'toko-rumah', variant: 'selaras', sample: 'rumah-lux' },
  // Kesehatan & Herbal — Jamu (apothecary heritage kraft/turmeric, signature label apotek + segel).
  'kesehatan-jamu': { theme: 'toko-kesehatan', variant: 'jamu', sample: 'kesehatan-lux' },
  // Bayi & Anak — Ceria (playful bright sky/coral/mint, signature kartu stiker + bento + confetti).
  'anak-ceria': { theme: 'toko-anak', variant: 'ceria', sample: 'anak-lux' },
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
  'toko-kecantikan': {},
  'toko-gadget': {},
  'toko-rumah': {},
  'toko-kesehatan': {},
  'toko-anak': {},
}
