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
  // ── WAVE 2 (jasa, source services) ──
  // Klinik Umum — Bersih (cool trust blue indigo/navy, signature panel Jadwal Praktik + garis detak EKG).
  'klinik-bersih': { theme: 'klinik-umum', variant: 'bersih', sample: 'klinik-lux' },
  // Klinik Estetik — Lumen (editorial derma plum/orchid, signature numeral serif raksasa + hairline).
  'estetik-lumen': { theme: 'klinik-estetik', variant: 'lumen', sample: 'estetik-lux' },
  // Klinik Wellness — Sanara (calm healing warm-stone/teal, signature bingkai daun + sprout).
  'wellness-sanara': { theme: 'klinik-wellness', variant: 'sanara', sample: 'wellness-lux' },
  // Klinik Fisioterapi / Sport — Gerak (athletic teal+oranye dwi-warna ber-pop, signature busur gerak + kartu rating mengambang + jalur pemulihan bernomor).
  'fisio-gerak': { theme: 'klinik-fisio', variant: 'gerak', sample: 'fisio-lux' },
  // ── WAVE 2 (restoran, source menu) ──
  // Warung/Kedai — Hangat (folk-warmth cream/brick/mustard, signature banderol tag harga).
  // Tema menu-source pertama lewat BESPOKE_VARIANTS (restaurant-lux sengaja di luar — isLux).
  'warung-hangat': { theme: 'restaurant-warung', variant: 'hangat', sample: 'warung-lux' },
  // Cafe/Coffee Shop — Seduh (specialty warm-minimal oat/espresso/moka, signature kopi-ring harga).
  'cafe-seduh': { theme: 'restaurant-cafe', variant: 'seduh', sample: 'cafe-lux' },
  // ── WAVE 3 (edukasi, source services) ──
  // Sekolah Umum — Almamater (collegiate prestige navy/krem/emas, signature lencana/crest perisai).
  'reguler-almamater': { theme: 'sekolah-reguler', variant: 'almamater', sample: 'sekolah-lux' },
  // ── WAVE 4 (corporate, source services — tema pertama compiler HTML-first) ──
  // Agency — Poster (Swiss-typographic paper/ink/ultramarine, signature Garis Proses).
  'agency-poster': { theme: 'corporate-agency', variant: 'bawaan', sample: 'corporate-agency' },
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
  // Klinik bespoke: dokter tampil di etalase Layanan (template memetakan dokter→services),
  // jadi tak ada balok terpisah yang perlu permukaan edit khusus di sini.
  'klinik-umum': {},
  'klinik-estetik': {},
  'klinik-wellness': {},
  'klinik-fisio': {},
  // Warung "Hangat": etalase = menu (source menu), tanpa galeri/social terpisah.
  'restaurant-warung': {},
  // Cafe "Seduh": etalase = menu (source menu), tanpa galeri/social terpisah.
  'restaurant-cafe': {},
  // Sekolah "Almamater": etalase = services (program), tanpa galeri/social terpisah.
  'sekolah-reguler': {},
  // Agency "Poster": etalase = services (layanan), tanpa galeri/social terpisah.
  'corporate-agency': {},
}
