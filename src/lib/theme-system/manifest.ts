// ============================================================
// THEME SYSTEM — Lapis 3 manifest (Sprint 0, S0-2).
// 1 tema = 1 "resep" deklaratif: pilih balok per slot + token (base pack +
// override). Mesin ComposableRenderer membaca manifest ini.
//
// Reuse penuh packs.ts (TokenPack) sebagai bahasa token — manifest hanya
// memilih base pack + override warna/layout + varian balok. Belum di-wire ke
// SiteRenderer/brief form (itu S0-3/S0-4) → nol regresi.
//
// Catatan: 3 gaya Kuliner di sini = BENIH (engine proof). Token & balok masih
// reuse pack lama + override ringan; keotentikan penuh per gaya digarap di
// Sprint 1 (THEME_SYSTEM_PLAN §8). Lihat juga taxonomy.ts (id tema cocok).
// ============================================================
import { PACKS, type TokenPack } from '@/lib/design-tokens/packs'
import { THEME_PACKS } from './theme-packs'

export type HeroVariant = 'centered' | 'split' | 'fullbleed'
export type ShowcaseVariant = 'menu-list' | 'card-grid' | 'lookbook'
export type FeaturesVariant = 'grid' | 'rows'
// Testimoni (Sprint 5) — sosial-proof. 3 varian parametrik via token.
// 'cards' = grid kartu quote · 'spotlight' = 1 kutipan besar berfokus ·
// 'marquee' = strip bergerak (CSS-only) untuk banyak testimoni ringkas.
export type TestimoniVariant = 'cards' | 'spotlight' | 'marquee'
// Galeri (Sprint 5b) — 'masonry' = grid foto fasilitas tinggi-rendah;
// 'before-after' = pasangan sebelum/sesudah (cocok estetik/skincare/interior).
export type GalleryVariant = 'masonry' | 'before-after'
// Motif/tekstur otentik — dipanen dari BatikTokoRenderer (S-Kerajinan). Overlay
// halus di hero + strip footer, ditint warna primary tema. 'none' = polos
// (default semua tema lama → nol regresi).
export type MotifVariant = 'none' | 'kawung' | 'tenun'

export interface ThemeManifest {
  id: string // cocok dgn ThemeOption.manifest di taxonomy.ts (mis. 'kuliner-rustic')
  label: string
  basePackId: string // id TokenPack dasar dari packs.ts
  colorOverrides?: Partial<TokenPack['color']>
  layoutOverrides?: Partial<TokenPack['layout']>
  motif?: MotifVariant // default 'none'
  blocks: {
    hero: HeroVariant
    features?: FeaturesVariant
    showcase: ShowcaseVariant
    // ── Balok Sprint 5 (semua opsional → tema lama nol regresi) ──
    testimoni?: TestimoniVariant // sosial-proof; absen = tak dirender
    stats?: boolean // strip angka kredibilitas (mis. "5.000+ pelanggan")
    faq?: boolean // accordion objection-handling (CSS-only <details>)
    info?: boolean // jam buka + lokasi/maps + reservasi (wajib F&B/toko fisik)
    gallery?: GalleryVariant // masonry fasilitas / before-after (Sprint 5b)
  }
}

// ── Bentuk konten yang dikonsumsi mesin ───────────────────────
export interface ShowcaseItem {
  nama: string
  harga?: number
  desc?: string
  gambar?: string
}
// ── Konten balok Sprint 5 ─────────────────────────────────────
export interface Testimonial { quote: string; nama: string; peran?: string }
export interface StatItem { angka: string; label: string }
export interface FaqItem { q: string; a: string }
export interface JamBuka { hari: string; jam: string }
export interface InfoLokasi {
  jam?: JamBuka[]
  alamat?: string
  mapsQuery?: string // dipakai embed Google Maps tanpa API key (output=embed)
  telp?: string
  reservasiText?: string
  reservasiHref?: string
}
// Galeri (Sprint 5b). `images` dipakai varian masonry; `pairs` varian before-after.
export interface GalleryImage { src: string; caption?: string }
export interface BeforeAfterPair { before: string; after: string; label?: string }
export interface GalleryContent {
  title?: string
  subtitle?: string
  images?: GalleryImage[]
  pairs?: BeforeAfterPair[]
}
export interface ComposableContent {
  nama: string
  hero: { eyebrow?: string; title: string; subtitle?: string; ctaText?: string; ctaHref?: string; image?: string }
  features?: { title: string; desc: string }[]
  showcase?: { title?: string; subtitle?: string; items: ShowcaseItem[] }
  // Sprint 5 — semua opsional; absen + manifest off = tak dirender (nol regresi)
  testimonials?: Testimonial[]
  stats?: StatItem[]
  faq?: FaqItem[]
  info?: InfoLokasi
  gallery?: GalleryContent
  about?: { title: string; body: string }
  cta?: { title: string; subtitle?: string; ctaText?: string; ctaHref?: string }
  contact?: { wa?: string; email?: string; alamat?: string }
}

// ── Registry manifest (pilot Kuliner ×3) ──────────────────────
export const MANIFESTS: Record<string, ThemeManifest> = {
  // Rustic Hangat — warung homemade (pempek). Token otentik di theme-packs.ts.
  'kuliner-rustic': {
    id: 'kuliner-rustic',
    label: 'Rustic Hangat',
    basePackId: 'kuliner-rustic',
    blocks: { hero: 'centered', features: 'grid', showcase: 'menu-list' },
  },
  // Modern Appetite — brand F&B kekinian. Bersih, cerah, grid kartu produk.
  'kuliner-modern': {
    id: 'kuliner-modern',
    label: 'Modern Appetite',
    basePackId: 'kuliner-modern',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid' },
  },
  // Heritage Kuliner — kuliner premium/tradisional. Gelap-hangat maroon + gold.
  'kuliner-heritage': {
    id: 'kuliner-heritage',
    label: 'Heritage Kuliner',
    basePackId: 'kuliner-heritage',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'menu-list' },
  },

  // ── FASHION ×3 (Sprint 2). Token otentik di theme-packs.ts. DORMANT
  // (taxonomy ready:false) sampai S2 aktivasi.
  'fashion-editorial': {
    id: 'fashion-editorial',
    label: 'Fashion Editorial',
    basePackId: 'fashion-editorial',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'lookbook' },
  },
  'fashion-minimal': {
    id: 'fashion-minimal',
    label: 'Fashion Minimalis',
    basePackId: 'fashion-minimal',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid' },
  },
  'fashion-vibrant': {
    id: 'fashion-vibrant',
    label: 'Fashion Vibrant',
    basePackId: 'fashion-vibrant',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid' },
  },

  // ── KERAJINAN ×3 (flagship) — motif/tekstur panen batik ───────
  'kerajinan-pusaka': {
    id: 'kerajinan-pusaka', label: 'Kerajinan Pusaka', basePackId: 'kerajinan-pusaka',
    motif: 'kawung',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid' },
  },
  'kerajinan-tenun': {
    id: 'kerajinan-tenun', label: 'Kerajinan Tenun', basePackId: 'kerajinan-tenun',
    motif: 'tenun',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid' },
  },
  'kerajinan-galeri': {
    id: 'kerajinan-galeri', label: 'Kerajinan Galeri', basePackId: 'kerajinan-galeri',
    blocks: { hero: 'centered', features: 'grid', showcase: 'lookbook' },
  },

  // ── KECANTIKAN ×3 — lembut/elegan/pastel ──────────────────────
  'kecantikan-blush': {
    id: 'kecantikan-blush', label: 'Kecantikan Blush', basePackId: 'kecantikan-blush',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid' },
  },
  'kecantikan-glow': {
    id: 'kecantikan-glow', label: 'Kecantikan Glow', basePackId: 'kecantikan-glow',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid' },
  },
  'kecantikan-noir': {
    id: 'kecantikan-noir', label: 'Kecantikan Noir', basePackId: 'kecantikan-noir',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'lookbook' },
  },

  // ── GADGET ×3 — modern/gelap/tech ─────────────────────────────
  'gadget-onyx': {
    id: 'gadget-onyx', label: 'Gadget Onyx', basePackId: 'gadget-onyx',
    blocks: { hero: 'fullbleed', features: 'grid', showcase: 'card-grid' },
  },
  'gadget-studio': {
    id: 'gadget-studio', label: 'Gadget Studio', basePackId: 'gadget-studio',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid' },
  },
  'gadget-neon': {
    id: 'gadget-neon', label: 'Gadget Neon', basePackId: 'gadget-neon',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid' },
  },

  // ── RUMAH ×3 — natural/lapang ─────────────────────────────────
  'rumah-natural': {
    id: 'rumah-natural', label: 'Rumah Natural', basePackId: 'rumah-natural',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid' },
  },
  'rumah-japandi': {
    id: 'rumah-japandi', label: 'Rumah Japandi', basePackId: 'rumah-japandi',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid' },
  },
  'rumah-walnut': {
    id: 'rumah-walnut', label: 'Rumah Walnut', basePackId: 'rumah-walnut',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid' },
  },

  // ── HERBAL ×3 — natural/hijau/trust ───────────────────────────
  'herbal-daun': {
    id: 'herbal-daun', label: 'Herbal Daun', basePackId: 'herbal-daun',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid' },
  },
  'herbal-jamu': {
    id: 'herbal-jamu', label: 'Herbal Jamu', basePackId: 'herbal-jamu',
    blocks: { hero: 'centered', features: 'rows', showcase: 'menu-list' },
  },
  'herbal-botani': {
    id: 'herbal-botani', label: 'Herbal Botani', basePackId: 'herbal-botani',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid' },
  },

  // ── ANAK ×3 — playful/ramah ───────────────────────────────────
  'anak-pastel': {
    id: 'anak-pastel', label: 'Anak Pastel', basePackId: 'anak-pastel',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid' },
  },
  'anak-ceria': {
    id: 'anak-ceria', label: 'Anak Ceria', basePackId: 'anak-ceria',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid' },
  },
  'anak-pop': {
    id: 'anak-pop', label: 'Anak Pop', basePackId: 'anak-pop',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid' },
  },

  // ── RESTAURANT (Sprint 4) — pakai balok Sprint 5 (info/stats/
  // testimoni/faq). Tiap gaya kombinasi balok berbeda untuk variasi. ──
  // WARUNG / KEDAI
  'warung-rakyat': {
    id: 'warung-rakyat', label: 'Warung Rakyat', basePackId: 'warung-rakyat',
    blocks: { hero: 'centered', features: 'grid', showcase: 'menu-list', stats: true, testimoni: 'cards', info: true, faq: true },
  },
  'warung-sambal': {
    id: 'warung-sambal', label: 'Warung Sambal', basePackId: 'warung-sambal',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', info: true },
  },
  'warung-angkringan': {
    id: 'warung-angkringan', label: 'Warung Angkringan', basePackId: 'warung-angkringan',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'menu-list', testimoni: 'spotlight', info: true },
  },
  // CAFE / COFFEE SHOP
  'cafe-latte': {
    id: 'cafe-latte', label: 'Cafe Latte', basePackId: 'cafe-latte',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true },
  },
  'cafe-roastery': {
    id: 'cafe-roastery', label: 'Cafe Roastery', basePackId: 'cafe-roastery',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'menu-list', testimoni: 'spotlight', info: true, faq: true },
  },
  'cafe-bloom': {
    id: 'cafe-bloom', label: 'Cafe Bloom', basePackId: 'cafe-bloom',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', testimoni: 'marquee', info: true },
  },
  // FINE DINING / RESTO KELUARGA
  'finedining-aurum': {
    id: 'finedining-aurum', label: 'Fine Dining Aurum', basePackId: 'finedining-aurum',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'menu-list', stats: true, testimoni: 'spotlight', info: true, faq: true },
  },
  'finedining-hearth': {
    id: 'finedining-hearth', label: 'Fine Dining Hearth', basePackId: 'finedining-hearth',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true },
  },
  'finedining-nordic': {
    id: 'finedining-nordic', label: 'Fine Dining Nordic', basePackId: 'finedining-nordic',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', testimoni: 'spotlight', info: true, faq: true },
  },

  // ── KLINIK (Sprint 6) — pakai balok S5 (stats/testimoni/faq/info
  // jam praktek+booking) + galeri S5b (masonry fasilitas / before-after). ──
  // KLINIK UMUM / GIGI
  'umum-bluecare': {
    id: 'umum-bluecare', label: 'Klinik Bluecare', basePackId: 'umum-bluecare',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', gallery: 'masonry', info: true, faq: true },
  },
  'umum-freshteal': {
    id: 'umum-freshteal', label: 'Klinik Freshteal', basePackId: 'umum-freshteal',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', info: true, faq: true },
  },
  'umum-trustnavy': {
    id: 'umum-trustnavy', label: 'Klinik Trustnavy', basePackId: 'umum-trustnavy',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', info: true, faq: true },
  },
  // KLINIK ESTETIK / SKINCARE (before-after)
  'estetik-rosegold': {
    id: 'estetik-rosegold', label: 'Estetik Rosegold', basePackId: 'estetik-rosegold',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', testimoni: 'cards', gallery: 'before-after', info: true, faq: true },
  },
  'estetik-derma': {
    id: 'estetik-derma', label: 'Estetik Derma', basePackId: 'estetik-derma',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', gallery: 'before-after', info: true },
  },
  'estetik-noir': {
    id: 'estetik-noir', label: 'Estetik Noir', basePackId: 'estetik-noir',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', testimoni: 'spotlight', gallery: 'before-after', info: true, faq: true },
  },
  // FISIO / WELLNESS
  'wellness-sage': {
    id: 'wellness-sage', label: 'Wellness Sage', basePackId: 'wellness-sage',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', testimoni: 'cards', info: true, faq: true },
  },
  'wellness-terra': {
    id: 'wellness-terra', label: 'Wellness Terra', basePackId: 'wellness-terra',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', info: true },
  },
  'wellness-forest': {
    id: 'wellness-forest', label: 'Wellness Forest', basePackId: 'wellness-forest',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', testimoni: 'spotlight', gallery: 'masonry', info: true, faq: true },
  },
}

export function getManifest(id?: string): ThemeManifest | undefined {
  if (!id) return undefined
  return MANIFESTS[id]
}

// Resolve TokenPack final dari manifest. Cari pack otentik theme-system dulu
// (THEME_PACKS), fallback ke pack generik (PACKS), lalu terapkan override.
export function resolveManifestPack(m: ThemeManifest): TokenPack {
  const base = THEME_PACKS[m.basePackId] ?? PACKS[m.basePackId] ?? PACKS['clean-modern']
  return {
    ...base,
    color: { ...base.color, ...(m.colorOverrides ?? {}) },
    layout: { ...base.layout, ...(m.layoutOverrides ?? {}) },
  }
}
