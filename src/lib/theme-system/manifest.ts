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

// 'cinematic' (lux) = fullbleed + ken-burns gambar + scrim sinematik + scroll cue,
// panen dari RestaurantLuxRenderer.rl-hero. Hanya dipakai manifest lux (nol regresi).
export type HeroVariant = 'centered' | 'split' | 'fullbleed' | 'cinematic'
// Showcase = blok inti yang menggambarkan industri. Varian generik:
// 'menu-list'/'card-grid'/'lookbook'. Varian KHAS-INDUSTRI (Sprint 10a) yang
// mengonsumsi field industri dari DB → bentuk yang benar-benar berbeda:
// 'service-list' (jasa/klinik: durasi + kategori) · 'article-feed' (blog:
// penulis + tanggal) · 'menu-board' (resto: dikelompokkan per kategori).
// 'signature' (lux) = beat editorial: top-N item ber-gambar tampil selang-seling
// kiri/kanan + indeks besar + harga, sisanya daftar ringkas (panen RestaurantLux
// rl-dish). Industri-agnostik (hidangan/produk/layanan/karya). Hanya manifest lux.
export type ShowcaseVariant =
  | 'menu-list' | 'card-grid' | 'lookbook'
  | 'service-list' | 'article-feed' | 'menu-board'
  | 'signature'
// 'sticky' (panen flagship) = passage kiri pinned + baris bernomor kanan.
export type FeaturesVariant = 'grid' | 'rows' | 'zigzag' | 'sticky'
// Testimoni (Sprint 5) — sosial-proof. 3 varian parametrik via token.
// 'cards' = grid kartu quote · 'spotlight' = 1 kutipan besar berfokus ·
// 'marquee' = strip bergerak (CSS-only) untuk banyak testimoni ringkas.
// 'carousel' (panen flagship) = scroll-snap + tombol/dot via ce-script.ts.
export type TestimoniVariant = 'cards' | 'spotlight' | 'marquee' | 'carousel'
// Galeri (Sprint 5b) — 'masonry' = grid foto fasilitas tinggi-rendah;
// 'before-after' = pasangan sebelum/sesudah (cocok estetik/skincare/interior).
// 'editorial' (lux) = grid 4-kolom tetap dgn span tinggi/lebar (panen RestaurantLux
// rl-gal), foto zoom + caption reveal. Hanya manifest lux (nol regresi).
// 'editorial-quicklook' (panen flagship) = editorial + dialog lightbox per foto.
export type GalleryVariant = 'masonry' | 'before-after' | 'editorial' | 'editorial-quicklook'
// Stats (lux) — 'band' (default, kartu ber-tint) | 'recognition' (kolom divider
// border-kiri, angka serif besar, panen RestaurantLux rl-recog).
export type StatsVariant = 'band' | 'recognition'
// Motif/tekstur otentik — dipanen dari BatikTokoRenderer (S-Kerajinan). Overlay
// halus di hero + strip footer, ditint warna primary tema. 'none' = polos
// (default semua tema lama → nol regresi).
export type MotifVariant = 'none' | 'kawung' | 'tenun'
// Sprint A — Trust layer balok baru
export type TeamVariant = 'grid' | 'spotlight' | 'horizontal'
export type AboutVariant = 'text' | 'split-right' | 'split-left' | 'story'
export interface TeamMember {
  nama: string
  peran: string
  foto?: string // URL foto; fallback = avatar inisial
  bio?: string  // 1 kalimat bio; muncul saat hover (CSS-only)
}
// Sprint B — Conversion layer balok baru
// Pricing: 'cards' = kartu tier berdampingan · 'table' = matriks perbandingan ·
// 'single' = 1 paket unggulan terfokus. Harga string supaya fleksibel.
export type PricingVariant = 'cards' | 'table' | 'single'
// Process: 'horizontal' = langkah bernomor sebaris + konektor · 'timeline' =
// linimasa vertikal · 'cards' = kartu langkah grid.
export type ProcessVariant = 'horizontal' | 'timeline' | 'cards'
// CTA: 'card' = kartu gradient (perilaku lama) · 'banner' = strip lebar penuh ·
// 'split' = gambar + ajakan berdampingan.
// 'duotone' (panen flagship) = band full-bleed foto grayscale + tint primary +
// tombol magnetic (pointer presisi).
export type CtaVariant = 'card' | 'banner' | 'split' | 'duotone'
export interface PricingPlan {
  nama: string
  harga: string         // string fleksibel: "Rp250rb" / "Gratis" / "Hubungi kami"
  periode?: string      // "/bulan" · "/paket" · "/orang"
  desc?: string
  fitur: string[]
  ctaText?: string
  ctaHref?: string
  unggulan?: boolean    // tandai paket utama → di-highlight
  badge?: string        // override teks badge (default "Paling Populer")
}
export interface PricingContent { title?: string; subtitle?: string; plans: PricingPlan[] }
export interface ProcessStep { judul: string; desc: string }
export interface ProcessContent { title?: string; subtitle?: string; steps: ProcessStep[] }
// Sprint C — Trust/Social layer balok baru
// Partners: 'grid' = deret logo statis · 'marquee' = strip bergerak (CSS-only).
export type PartnersVariant = 'grid' | 'marquee'
export interface PartnerLogo { nama: string; logo?: string; href?: string } // logo URL; fallback = chip teks nama
export interface PartnersContent { title?: string; subtitle?: string; logos: PartnerLogo[] }
// Social: deret ikon medsos/marketplace (kritis konteks Indonesia: jualan di
// IG/TikTok/Shopee/WA). Ikon monokrom (currentColor) → ikut token tema.
export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'whatsapp' | 'x' | 'shopee' | 'tokopedia' | 'website'
export interface SocialLink { platform: SocialPlatform; href: string; label?: string }
export interface SocialContent { title?: string; subtitle?: string; links: SocialLink[] }

// Urutan & himpunan section TENGAH (antara hero & footer). Manifest boleh
// menentukannya supaya RANGKA halaman beda per industri (bukan cuma kulit
// warna). Absen → ComposableRenderer pakai urutan default (tema lama nol regresi).
export type SectionKey =
  | 'features' | 'statement' | 'showcase' | 'process' | 'stats' | 'partners'
  | 'team' | 'testimoni' | 'gallery' | 'info' | 'about' | 'pricing' | 'faq' | 'cta' | 'social'

export interface ThemeManifest {
  id: string // cocok dgn ThemeOption.manifest di taxonomy.ts (mis. 'kuliner-rustic')
  label: string
  basePackId: string // id TokenPack dasar dari packs.ts
  colorOverrides?: Partial<TokenPack['color']>
  layoutOverrides?: Partial<TokenPack['layout']>
  motif?: MotifVariant // default 'none'
  // Urutan section tengah (lux). Absen = urutan default (DEFAULT_SECTION_ORDER).
  sections?: SectionKey[]
  blocks: {
    hero: HeroVariant
    features?: FeaturesVariant
    showcase: ShowcaseVariant
    // ── Balok Sprint 5 (semua opsional → tema lama nol regresi) ──
    testimoni?: TestimoniVariant // sosial-proof; absen = tak dirender
    stats?: boolean | StatsVariant // strip angka kredibilitas; true/'band' = kartu, 'recognition' (lux) = kolom divider
    statsCountUp?: boolean // panen flagship: angka stats dianimasikan 0→final saat terlihat (SSR tetap final)
    faq?: boolean // accordion objection-handling (CSS-only <details>)
    info?: boolean // jam buka + lokasi/maps + reservasi (wajib F&B/toko fisik)
    gallery?: GalleryVariant // masonry fasilitas / before-after (Sprint 5b)
    // ── Balok Sprint A — Trust layer (semua opsional → tema lama nol regresi) ──
    team?: TeamVariant    // grid kartu · spotlight 1-featured · horizontal scroll
    about?: AboutVariant  // default 'text' (perilaku lama); 'split-right/left/story' = dengan gambar
    // ── Balok Sprint B — Conversion layer (semua opsional → tema lama nol regresi) ──
    pricing?: PricingVariant // cards tier · table perbandingan · single unggulan
    process?: ProcessVariant // horizontal langkah · timeline · cards
    cta?: CtaVariant         // default 'card' (perilaku lama); 'banner' · 'split'
    // ── Balok Sprint C — Trust/Social layer (semua opsional → tema lama nol regresi) ──
    partners?: PartnersVariant // grid logo · marquee strip
    social?: boolean           // strip ikon medsos/marketplace
    // ── Signature (craft) — pernyataan posisi/filosofi editorial (1 beat dramatis) ──
    statement?: boolean
  }
}

// ── Bentuk konten yang dikonsumsi mesin ───────────────────────
export interface ShowcaseItem {
  nama: string
  harga?: number
  desc?: string
  gambar?: string
  // Field khas-industri (Sprint 10a) — semua opsional → varian generik abaikan,
  // varian khas-industri pakai bila ada. Dipetakan dari kolom DB lewat adapter.
  kategori?: string  // products/services/menu_items.kategori → grouping menu / label layanan
  durasi?: number    // services.durasi_menit (menit) → badge "± 30 menit" di service-list
  penulis?: string   // blog_posts.penulis → meta artikel
  tanggal?: string   // blog_posts.published_at (ISO) → meta tanggal artikel
  stok?: number      // products.stok → badge ketersediaan (opsional)
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
export interface StatementContent { eyebrow?: string; quote: string; cite?: string }
// Band add-on ber-preset (newsletter/career) — dipetakan content-adapter dari
// row page_sections `cta` yang membawa isi_komponen.preset. Dirender
// ComposableRenderer SETELAH alur manifest (additive; absen → tak dirender).
export interface PresetBand { preset: string; title: string; subtitle?: string; ctaText?: string; ctaHref?: string }
export interface ComposableContent {
  nama: string
  hero: { eyebrow?: string; title: string; subtitle?: string; ctaText?: string; ctaHref?: string; ctaText2?: string; ctaHref2?: string; image?: string }
  // Heading section "keunggulan" dari konten (bukan hardcode generik). Opsional →
  // fallback non-generik di FeatHeading.
  featuresEyebrow?: string
  featuresTitle?: string
  featuresSubtitle?: string
  features?: { title: string; desc: string; image?: string }[]
  // Signature band (craft) — pernyataan posisi/filosofi. Absen + slot off = tak dirender.
  statement?: StatementContent
  showcase?: { title?: string; subtitle?: string; items: ShowcaseItem[] }
  // Sprint 5 — semua opsional; absen + manifest off = tak dirender (nol regresi)
  testimonials?: Testimonial[]
  stats?: StatItem[]
  faq?: FaqItem[]
  info?: InfoLokasi
  gallery?: GalleryContent
  about?: { title: string; body: string; image?: string; ctaText?: string; ctaHref?: string }
  // Heading section tim dari konten (human-centric, pola sama featuresTitle).
  teamEyebrow?: string
  teamTitle?: string
  team?: TeamMember[]
  // Sprint B — conversion layer; absen + manifest off = tak dirender (nol regresi)
  pricing?: PricingContent
  process?: ProcessContent
  cta?: { title: string; subtitle?: string; ctaText?: string; ctaHref?: string; image?: string }
  // Sprint C — trust/social layer; absen + manifest off = tak dirender (nol regresi)
  partners?: PartnersContent
  social?: SocialContent
  contact?: { wa?: string; email?: string; alamat?: string }
  // Band add-on (newsletter/career) — lihat PresetBand.
  bands?: PresetBand[]
}

// ── Registry manifest (pilot Kuliner ×3) ──────────────────────
export const MANIFESTS: Record<string, ThemeManifest> = {
  // Rustic Hangat — warung homemade (pempek). Token otentik di theme-packs.ts.
  'kuliner-rustic': {
    id: 'kuliner-rustic',
    label: 'Rustic Hangat',
    basePackId: 'kuliner-rustic',
    blocks: { hero: 'centered', features: 'grid', showcase: 'menu-list', stats: true, testimoni: 'cards', faq: true, social: true },
  },
  // Modern Appetite — brand F&B kekinian. Bersih, cerah, grid kartu produk.
  'kuliner-modern': {
    id: 'kuliner-modern',
    label: 'Modern Appetite',
    basePackId: 'kuliner-modern',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', faq: true },
  },
  // Heritage Kuliner — kuliner premium/tradisional. Gelap-hangat maroon + gold.
  'kuliner-heritage': {
    id: 'kuliner-heritage',
    label: 'Heritage Kuliner',
    basePackId: 'kuliner-heritage',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'menu-list', stats: true, testimoni: 'spotlight', faq: true },
  },

  // ── FASHION ×3 (Sprint 2). Token otentik di theme-packs.ts. DORMANT
  // (taxonomy ready:false) sampai S2 aktivasi.
  'fashion-editorial': {
    id: 'fashion-editorial',
    label: 'Fashion Editorial',
    basePackId: 'fashion-editorial',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'lookbook', stats: true, testimoni: 'spotlight', faq: true },
  },
  'fashion-minimal': {
    id: 'fashion-minimal',
    label: 'Fashion Minimalis',
    basePackId: 'fashion-minimal',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true },
  },
  'fashion-vibrant': {
    id: 'fashion-vibrant',
    label: 'Fashion Vibrant',
    basePackId: 'fashion-vibrant',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', faq: true },
  },

  // ── KERAJINAN ×3 (flagship) — motif/tekstur panen batik ───────
  'kerajinan-pusaka': {
    id: 'kerajinan-pusaka', label: 'Kerajinan Pusaka', basePackId: 'kerajinan-pusaka',
    motif: 'kawung',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', faq: true },
  },
  'kerajinan-tenun': {
    id: 'kerajinan-tenun', label: 'Kerajinan Tenun', basePackId: 'kerajinan-tenun',
    motif: 'tenun',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true },
  },
  'kerajinan-galeri': {
    id: 'kerajinan-galeri', label: 'Kerajinan Galeri', basePackId: 'kerajinan-galeri',
    blocks: { hero: 'centered', features: 'grid', showcase: 'lookbook', stats: true, testimoni: 'cards', faq: true },
  },

  // ── KECANTIKAN ×3 — lembut/elegan/pastel ──────────────────────
  'kecantikan-blush': {
    id: 'kecantikan-blush', label: 'Kecantikan Blush', basePackId: 'kecantikan-blush',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true },
  },
  'kecantikan-glow': {
    id: 'kecantikan-glow', label: 'Kecantikan Glow', basePackId: 'kecantikan-glow',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true },
  },
  'kecantikan-noir': {
    id: 'kecantikan-noir', label: 'Kecantikan Noir', basePackId: 'kecantikan-noir',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'lookbook', stats: true, testimoni: 'spotlight', faq: true },
  },

  // ── GADGET ×3 — modern/gelap/tech ─────────────────────────────
  'gadget-onyx': {
    id: 'gadget-onyx', label: 'Gadget Onyx', basePackId: 'gadget-onyx',
    blocks: { hero: 'fullbleed', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'spotlight', faq: true },
  },
  'gadget-studio': {
    id: 'gadget-studio', label: 'Gadget Studio', basePackId: 'gadget-studio',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true },
  },
  'gadget-neon': {
    id: 'gadget-neon', label: 'Gadget Neon', basePackId: 'gadget-neon',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', faq: true },
  },

  // ── RUMAH ×3 — natural/lapang ─────────────────────────────────
  'rumah-natural': {
    id: 'rumah-natural', label: 'Rumah Natural', basePackId: 'rumah-natural',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true },
  },
  'rumah-japandi': {
    id: 'rumah-japandi', label: 'Rumah Japandi', basePackId: 'rumah-japandi',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true },
  },
  'rumah-walnut': {
    id: 'rumah-walnut', label: 'Rumah Walnut', basePackId: 'rumah-walnut',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', faq: true },
  },

  // ── HERBAL ×3 — natural/hijau/trust ───────────────────────────
  'herbal-daun': {
    id: 'herbal-daun', label: 'Herbal Daun', basePackId: 'herbal-daun',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true },
  },
  'herbal-jamu': {
    id: 'herbal-jamu', label: 'Herbal Jamu', basePackId: 'herbal-jamu',
    blocks: { hero: 'centered', features: 'rows', showcase: 'menu-list', stats: true, testimoni: 'marquee', faq: true },
  },
  'herbal-botani': {
    id: 'herbal-botani', label: 'Herbal Botani', basePackId: 'herbal-botani',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', faq: true },
  },

  // ── ANAK ×3 — playful/ramah ───────────────────────────────────
  'anak-pastel': {
    id: 'anak-pastel', label: 'Anak Pastel', basePackId: 'anak-pastel',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true },
  },
  'anak-ceria': {
    id: 'anak-ceria', label: 'Anak Ceria', basePackId: 'anak-ceria',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true },
  },
  'anak-pop': {
    id: 'anak-pop', label: 'Anak Pop', basePackId: 'anak-pop',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', faq: true },
  },

  // ── RESTAURANT (Sprint 4) — pakai balok Sprint 5 (info/stats/
  // testimoni/faq). Tiap gaya kombinasi balok berbeda untuk variasi. ──
  // WARUNG / KEDAI
  'warung-rakyat': {
    id: 'warung-rakyat', label: 'Warung Rakyat', basePackId: 'warung-rakyat',
    blocks: { hero: 'centered', features: 'grid', showcase: 'menu-board', stats: true, testimoni: 'cards', info: true, faq: true },
  },
  'warung-sambal': {
    id: 'warung-sambal', label: 'Warung Sambal', basePackId: 'warung-sambal',
    blocks: { hero: 'split', features: 'grid', showcase: 'menu-board', stats: true, testimoni: 'marquee', info: true },
  },
  'warung-angkringan': {
    id: 'warung-angkringan', label: 'Warung Angkringan', basePackId: 'warung-angkringan',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'menu-board', testimoni: 'spotlight', info: true },
  },
  // CAFE / COFFEE SHOP
  'cafe-latte': {
    id: 'cafe-latte', label: 'Cafe Latte', basePackId: 'cafe-latte',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true },
  },
  'cafe-roastery': {
    id: 'cafe-roastery', label: 'Cafe Roastery', basePackId: 'cafe-roastery',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'menu-board', testimoni: 'spotlight', info: true, faq: true },
  },
  'cafe-bloom': {
    id: 'cafe-bloom', label: 'Cafe Bloom', basePackId: 'cafe-bloom',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', testimoni: 'marquee', info: true },
  },
  // FINE DINING / RESTO KELUARGA
  'finedining-aurum': {
    id: 'finedining-aurum', label: 'Fine Dining Aurum', basePackId: 'finedining-aurum',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'menu-board', statement: true, stats: true, team: 'spotlight', testimoni: 'spotlight', gallery: 'masonry', info: true, faq: true },
  },
  'finedining-hearth': {
    id: 'finedining-hearth', label: 'Fine Dining Hearth', basePackId: 'finedining-hearth',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true },
  },
  'finedining-nordic': {
    id: 'finedining-nordic', label: 'Fine Dining Nordic', basePackId: 'finedining-nordic',
    blocks: { hero: 'centered', features: 'grid', showcase: 'menu-board', testimoni: 'spotlight', info: true, faq: true },
  },

  // ── KLINIK (Sprint 6) — pakai balok S5 (stats/testimoni/faq/info
  // jam praktek+booking) + galeri S5b (masonry fasilitas / before-after). ──
  // KLINIK UMUM / GIGI
  'umum-bluecare': {
    id: 'umum-bluecare', label: 'Klinik Bluecare', basePackId: 'umum-bluecare',
    blocks: { hero: 'split', features: 'grid', showcase: 'service-list', stats: true, testimoni: 'cards', gallery: 'masonry', info: true, faq: true, team: 'spotlight' },
  },
  'umum-freshteal': {
    id: 'umum-freshteal', label: 'Klinik Freshteal', basePackId: 'umum-freshteal',
    blocks: { hero: 'centered', features: 'grid', showcase: 'service-list', stats: true, testimoni: 'marquee', info: true, faq: true },
  },
  'umum-trustnavy': {
    id: 'umum-trustnavy', label: 'Klinik Trustnavy', basePackId: 'umum-trustnavy',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'service-list', stats: true, testimoni: 'spotlight', info: true, faq: true },
  },
  // KLINIK ESTETIK / SKINCARE (before-after)
  'estetik-rosegold': {
    id: 'estetik-rosegold', label: 'Estetik Rosegold', basePackId: 'estetik-rosegold',
    blocks: { hero: 'split', features: 'grid', showcase: 'service-list', testimoni: 'cards', gallery: 'before-after', info: true, faq: true },
  },
  'estetik-derma': {
    id: 'estetik-derma', label: 'Estetik Derma', basePackId: 'estetik-derma',
    blocks: { hero: 'centered', features: 'grid', showcase: 'service-list', stats: true, testimoni: 'cards', gallery: 'before-after', info: true },
  },
  'estetik-noir': {
    id: 'estetik-noir', label: 'Estetik Noir', basePackId: 'estetik-noir',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'service-list', testimoni: 'spotlight', gallery: 'before-after', info: true, faq: true },
  },
  // FISIO / WELLNESS
  'wellness-sage': {
    id: 'wellness-sage', label: 'Wellness Sage', basePackId: 'wellness-sage',
    blocks: { hero: 'split', features: 'grid', showcase: 'service-list', testimoni: 'cards', info: true, faq: true },
  },
  'wellness-terra': {
    id: 'wellness-terra', label: 'Wellness Terra', basePackId: 'wellness-terra',
    blocks: { hero: 'centered', features: 'grid', showcase: 'service-list', stats: true, testimoni: 'marquee', info: true },
  },
  'wellness-forest': {
    id: 'wellness-forest', label: 'Wellness Forest', basePackId: 'wellness-forest',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'service-list', testimoni: 'spotlight', gallery: 'masonry', info: true, faq: true },
  },

  // ── SEKOLAH (Sprint 7) — showcase=program/jurusan, stats=akreditasi,
  // info=PPDB CTA + lokasi, gallery masonry=kegiatan/fasilitas. ──
  // SEKOLAH REGULER (SD/SMP/SMA)
  'reguler-cerdas': {
    id: 'reguler-cerdas', label: 'Sekolah Cerdas', basePackId: 'reguler-cerdas',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', gallery: 'masonry', info: true, faq: true },
  },
  'reguler-ceria': {
    id: 'reguler-ceria', label: 'Sekolah Ceria', basePackId: 'reguler-ceria',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', gallery: 'masonry', info: true },
  },
  'reguler-prestasi': {
    id: 'reguler-prestasi', label: 'Sekolah Prestasi', basePackId: 'reguler-prestasi',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', info: true, faq: true },
  },
  // SEKOLAH ISLAMI / PESANTREN
  'islami-hijau': {
    id: 'islami-hijau', label: 'Islami Hijau', basePackId: 'islami-hijau',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true, faq: true },
  },
  'islami-emas': {
    id: 'islami-emas', label: 'Islami Emas', basePackId: 'islami-emas',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', testimoni: 'cards', gallery: 'masonry', info: true, faq: true },
  },
  'islami-malam': {
    id: 'islami-malam', label: 'Islami Malam', basePackId: 'islami-malam',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', info: true, faq: true },
  },
  // KURSUS / BIMBEL
  'kursus-fokus': {
    id: 'kursus-fokus', label: 'Kursus Fokus', basePackId: 'kursus-fokus',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', faq: true, info: true, process: 'cards', pricing: 'cards' },
  },
  'kursus-energi': {
    id: 'kursus-energi', label: 'Kursus Energi', basePackId: 'kursus-energi',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', info: true },
  },
  'kursus-malam': {
    id: 'kursus-malam', label: 'Kursus Malam', basePackId: 'kursus-malam',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', faq: true, info: true },
  },

  // ── PERSONAL / PORTFOLIO (Sprint 8a) — showcase=karya/layanan,
  // stats=angka pencapaian, gallery masonry=portofolio, info=kontak/booking. ──
  // KREATOR
  'kreator-spotlight': {
    id: 'kreator-spotlight', label: 'Kreator Spotlight', basePackId: 'kreator-spotlight',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', gallery: 'masonry', info: true },
  },
  'kreator-pop': {
    id: 'kreator-pop', label: 'Kreator Pop', basePackId: 'kreator-pop',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', gallery: 'masonry', info: true },
  },
  'kreator-clean': {
    id: 'kreator-clean', label: 'Kreator Clean', basePackId: 'kreator-clean',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', testimoni: 'cards', gallery: 'masonry', info: true },
  },
  // PROFESIONAL
  'profesional-korporat': {
    id: 'profesional-korporat', label: 'Profesional Korporat', basePackId: 'profesional-korporat',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true, faq: true },
  },
  'profesional-mono': {
    id: 'profesional-mono', label: 'Profesional Mono', basePackId: 'profesional-mono',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', testimoni: 'spotlight', info: true, faq: true },
  },
  'profesional-warm': {
    id: 'profesional-warm', label: 'Profesional Warm', basePackId: 'profesional-warm',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true, faq: true },
  },
  // COACH
  'coach-energi': {
    id: 'coach-energi', label: 'Coach Energi', basePackId: 'coach-energi',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', info: true, faq: true },
  },
  'coach-tenang': {
    id: 'coach-tenang', label: 'Coach Tenang', basePackId: 'coach-tenang',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', testimoni: 'cards', info: true, faq: true },
  },
  'coach-prestige': {
    id: 'coach-prestige', label: 'Coach Prestige', basePackId: 'coach-prestige',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', info: true, faq: true, team: 'spotlight', about: 'story', pricing: 'single', cta: 'banner' },
  },

  // ── COMPANY / CORPORATE (Sprint 8b) — showcase=layanan, stats=angka
  // perusahaan, gallery masonry=klien/proyek, info=kontak kantor. ──
  // STARTUP / TECH / SAAS
  'startup-aurora': {
    id: 'startup-aurora', label: 'Startup Aurora', basePackId: 'startup-aurora',
    blocks: { hero: 'split', features: 'zigzag', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true, faq: true, team: 'grid', about: 'split-right', process: 'horizontal', pricing: 'cards', partners: 'grid' },
  },
  'startup-midnight': {
    id: 'startup-midnight', label: 'Startup Midnight', basePackId: 'startup-midnight',
    blocks: { hero: 'fullbleed', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'spotlight', info: true, faq: true, pricing: 'table' },
  },
  'startup-mint': {
    id: 'startup-mint', label: 'Startup Mint', basePackId: 'startup-mint',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', info: true },
  },
  // AGENCY / KREATIF
  'agency-bold': {
    id: 'agency-bold', label: 'Agency Bold', basePackId: 'agency-bold',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', gallery: 'masonry', info: true },
  },
  'agency-noir': {
    id: 'agency-noir', label: 'Agency Noir', basePackId: 'agency-noir',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', testimoni: 'spotlight', gallery: 'masonry', info: true },
  },
  'agency-prisma': {
    id: 'agency-prisma', label: 'Agency Prisma', basePackId: 'agency-prisma',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', gallery: 'masonry', info: true },
  },
  // KORPORAT / MANUFAKTUR / B2B
  'korporat-biru': {
    id: 'korporat-biru', label: 'Korporat Biru', basePackId: 'korporat-biru',
    blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true, faq: true, process: 'timeline', partners: 'marquee' },
  },
  'korporat-slate': {
    id: 'korporat-slate', label: 'Korporat Slate', basePackId: 'korporat-slate',
    blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', info: true, faq: true },
  },
  'korporat-netral': {
    id: 'korporat-netral', label: 'Korporat Netral', basePackId: 'korporat-netral',
    blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true, faq: true },
  },

  // ── TRAVEL / RENTAL (Sprint 9) — showcase=armada/paket, gallery=destinasi ──
  'kendaraan-asphalt': { id: 'kendaraan-asphalt', label: 'Kendaraan Asphalt', basePackId: 'kendaraan-asphalt', blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', info: true, faq: true } },
  'kendaraan-bersih': { id: 'kendaraan-bersih', label: 'Kendaraan Bersih', basePackId: 'kendaraan-bersih', blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true, faq: true } },
  'kendaraan-kuning': { id: 'kendaraan-kuning', label: 'Kendaraan Kuning', basePackId: 'kendaraan-kuning', blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', info: true } },
  'wisata-tropis': { id: 'wisata-tropis', label: 'Wisata Tropis', basePackId: 'wisata-tropis', blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', gallery: 'masonry', info: true } },
  'wisata-rimba': { id: 'wisata-rimba', label: 'Wisata Rimba', basePackId: 'wisata-rimba', blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', testimoni: 'spotlight', gallery: 'masonry', info: true, faq: true } },
  'wisata-senja': { id: 'wisata-senja', label: 'Wisata Senja', basePackId: 'wisata-senja', blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', gallery: 'masonry', info: true } },
  'akomodasi-resort': { id: 'akomodasi-resort', label: 'Akomodasi Resort', basePackId: 'akomodasi-resort', blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', gallery: 'masonry', info: true, faq: true } },
  'akomodasi-kayu': { id: 'akomodasi-kayu', label: 'Akomodasi Kayu', basePackId: 'akomodasi-kayu', blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', testimoni: 'cards', gallery: 'masonry', info: true } },
  'akomodasi-malam': { id: 'akomodasi-malam', label: 'Akomodasi Malam', basePackId: 'akomodasi-malam', blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', gallery: 'masonry', info: true, faq: true } },

  // ── BLOG / MEDIA (Sprint 9) — showcase=artikel (blog_posts) ──
  'jurnal-hangat': { id: 'jurnal-hangat', label: 'Blog Jurnal', basePackId: 'jurnal-hangat', blocks: { hero: 'centered', features: 'grid', showcase: 'article-feed', faq: true } },
  'jurnal-mono': { id: 'jurnal-mono', label: 'Blog Mono', basePackId: 'jurnal-mono', blocks: { hero: 'split', features: 'grid', showcase: 'article-feed', faq: true } },
  'jurnal-senja': { id: 'jurnal-senja', label: 'Blog Senja', basePackId: 'jurnal-senja', blocks: { hero: 'fullbleed', features: 'rows', showcase: 'article-feed', faq: true } },
  'media-merah': { id: 'media-merah', label: 'Media Merah', basePackId: 'media-merah', blocks: { hero: 'split', features: 'grid', showcase: 'article-feed', stats: true, faq: true } },
  'media-biru': { id: 'media-biru', label: 'Media Biru', basePackId: 'media-biru', blocks: { hero: 'split', features: 'grid', showcase: 'article-feed', stats: true, faq: true } },
  'media-malam': { id: 'media-malam', label: 'Media Malam', basePackId: 'media-malam', blocks: { hero: 'fullbleed', features: 'rows', showcase: 'article-feed', stats: true, faq: true } },
  'niche-hijau': { id: 'niche-hijau', label: 'Niche Hijau', basePackId: 'niche-hijau', blocks: { hero: 'centered', features: 'grid', showcase: 'article-feed', testimoni: 'cards', faq: true } },
  'niche-pop': { id: 'niche-pop', label: 'Niche Pop', basePackId: 'niche-pop', blocks: { hero: 'centered', features: 'grid', showcase: 'article-feed', testimoni: 'marquee', faq: true } },
  'niche-gelap': { id: 'niche-gelap', label: 'Niche Gelap', basePackId: 'niche-gelap', blocks: { hero: 'fullbleed', features: 'grid', showcase: 'article-feed', testimoni: 'spotlight', faq: true } },

  // ── JASTIP (Sprint 9) — showcase=katalog titipan (products) ──
  'luar-global': { id: 'luar-global', label: 'Jastip Global', basePackId: 'luar-global', blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true, faq: true } },
  'luar-premium': { id: 'luar-premium', label: 'Jastip Premium', basePackId: 'luar-premium', blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', testimoni: 'spotlight', info: true, faq: true, process: 'horizontal', pricing: 'cards', social: true } },
  'luar-pop': { id: 'luar-pop', label: 'Jastip Pop', basePackId: 'luar-pop', blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', info: true } },
  'lokal-hangat': { id: 'lokal-hangat', label: 'Jastip Hangat', basePackId: 'lokal-hangat', blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true, faq: true } },
  'lokal-segar': { id: 'lokal-segar', label: 'Jastip Segar', basePackId: 'lokal-segar', blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', info: true } },
  'lokal-gelap': { id: 'lokal-gelap', label: 'Jastip Lokal Gelap', basePackId: 'lokal-gelap', blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', testimoni: 'spotlight', info: true, faq: true } },
  'preorder-fokus': { id: 'preorder-fokus', label: 'PO Fokus', basePackId: 'preorder-fokus', blocks: { hero: 'split', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'cards', info: true, faq: true } },
  'preorder-energi': { id: 'preorder-energi', label: 'PO Energi', basePackId: 'preorder-energi', blocks: { hero: 'centered', features: 'grid', showcase: 'card-grid', stats: true, testimoni: 'marquee', info: true } },
  'preorder-malam': { id: 'preorder-malam', label: 'PO Malam', basePackId: 'preorder-malam', blocks: { hero: 'fullbleed', features: 'rows', showcase: 'card-grid', stats: true, testimoni: 'spotlight', info: true, faq: true } },

  // ── LUX TIER (Sprint 1 pilot) — default premium per industri. Pakai balok
  // lux baru (hero cinematic · showcase signature/service-list · stats
  // recognition · gallery editorial) di atas pack lux (bawa lux:{} → data-lux).
  // Manifest deklarasi balok PENUH: produksi merender yang ada datanya
  // (hero/features/statement/showcase/stats/faq/info/about), sisanya (team/
  // testimoni/gallery) self-hide sampai klien isi via portal; preview/sample
  // menampilkan semuanya (parity shoot vs flagship). ──
  'lux-restaurant': {
    id: 'lux-restaurant', label: 'Lux Restaurant', basePackId: 'lux-restaurant',
    // Food-forward: filosofi → hidangan signature → suasana → pengakuan → chef.
    sections: ['statement', 'showcase', 'gallery', 'stats', 'team', 'testimoni', 'info', 'faq'],
    blocks: {
      hero: 'cinematic', showcase: 'signature', statement: true, stats: 'recognition', statsCountUp: true,
      team: 'spotlight', testimoni: 'spotlight', gallery: 'editorial-quicklook', info: true, faq: true,
    },
  },
  'lux-klinik': {
    id: 'lux-klinik', label: 'Lux Klinik', basePackId: 'lux-klinik',
    // Trust-forward: kredibilitas (angka) → alasan → layanan → komitmen → dokter.
    sections: ['stats', 'features', 'showcase', 'statement', 'team', 'gallery', 'testimoni', 'info', 'faq'],
    blocks: {
      hero: 'split', features: 'sticky', showcase: 'service-list', statement: true,
      stats: 'recognition', statsCountUp: true, team: 'spotlight', testimoni: 'spotlight', gallery: 'editorial-quicklook',
      info: true, faq: true,
    },
  },

  // ── LUX TIER Sprint 2 — 7 industri sisa. Balok lux penuh; showcase ikut
  // sumber data per industri di SiteRenderer (corporate/sekolah/travel/personal
  // → services; toko/jastip → products; blog → blog_posts). ──
  'lux-corporate': {
    id: 'lux-corporate', label: 'Lux Corporate', basePackId: 'lux-corporate',
    // Credibility + process: angka → kapabilitas → layanan → cara kerja → tim → klien.
    sections: ['stats', 'features', 'showcase', 'process', 'team', 'partners', 'testimoni', 'faq', 'cta'],
    blocks: { hero: 'split', features: 'sticky', showcase: 'service-list', stats: 'recognition', statsCountUp: true, process: 'timeline', team: 'spotlight', partners: 'marquee', testimoni: 'spotlight', faq: true, cta: 'duotone' },
  },
  'lux-sekolah': {
    id: 'lux-sekolah', label: 'Lux Sekolah', basePackId: 'lux-sekolah',
    // Proud institutional: visi → akreditasi → program → kegiatan → guru → PPDB.
    sections: ['statement', 'stats', 'showcase', 'gallery', 'team', 'testimoni', 'faq', 'info'],
    blocks: { hero: 'centered', showcase: 'service-list', statement: true, stats: 'recognition', statsCountUp: true, team: 'spotlight', testimoni: 'spotlight', gallery: 'editorial-quicklook', info: true, faq: true },
  },
  'lux-toko': {
    id: 'lux-toko', label: 'Lux Toko', basePackId: 'lux-toko',
    // Product-forward: katalog lookbook → alasan → brand → angka → ulasan → CTA penutup → sosial.
    sections: ['showcase', 'features', 'statement', 'stats', 'testimoni', 'faq', 'cta', 'social'],
    blocks: { hero: 'fullbleed', features: 'grid', showcase: 'lookbook', statement: true, stats: 'recognition', statsCountUp: true, testimoni: 'carousel', faq: true, cta: 'duotone', social: true },
  },
  'lux-travel': {
    id: 'lux-travel', label: 'Lux Travel', basePackId: 'lux-travel',
    // Destination-forward: galeri destinasi → paket → angka → ulasan → lokasi.
    sections: ['gallery', 'showcase', 'stats', 'testimoni', 'info', 'faq'],
    blocks: { hero: 'cinematic', showcase: 'card-grid', stats: 'recognition', statsCountUp: true, testimoni: 'carousel', gallery: 'editorial-quicklook', info: true, faq: true },
  },
  'lux-personal': {
    id: 'lux-personal', label: 'Lux Personal', basePackId: 'lux-personal',
    // Portfolio + personality: karya → cerita → angka → ulasan → galeri → sosial.
    sections: ['showcase', 'about', 'stats', 'testimoni', 'gallery', 'social', 'faq'],
    blocks: { hero: 'fullbleed', showcase: 'card-grid', stats: 'recognition', statsCountUp: true, testimoni: 'spotlight', gallery: 'editorial-quicklook', about: 'story', social: true, faq: true },
  },
  'lux-blog': {
    id: 'lux-blog', label: 'Lux Blog', basePackId: 'lux-blog',
    // Lean reading: artikel → pernyataan editorial → tentang → sosial → faq.
    sections: ['showcase', 'statement', 'about', 'social', 'faq'],
    blocks: { hero: 'centered', showcase: 'article-feed', statement: true, about: 'story', social: true, faq: true },
  },
  'lux-jastip': {
    id: 'lux-jastip', label: 'Lux Jastip', basePackId: 'lux-jastip',
    // Trust/process-forward: cara titip → katalog → angka → ulasan → faq → CTA penutup → sosial.
    sections: ['process', 'showcase', 'stats', 'testimoni', 'faq', 'cta', 'social', 'info'],
    blocks: { hero: 'split', showcase: 'card-grid', process: 'horizontal', stats: 'recognition', statsCountUp: true, testimoni: 'carousel', faq: true, cta: 'duotone', social: true, info: true },
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
