// ============================================================
// JapanArena Website Builder — Type Definitions
// ============================================================

// ── Enum-like union types (mirror SQL CHECK constraints) ──────

export type TipeIndustri =
  | 'sekolah'
  | 'toko_online'
  | 'corporate'
  | 'klinik'
  | 'travel'
  | 'restaurant'
  | 'personal'
  | 'blog'
  | 'jastip'
  | 'custom'

export type StatusPage = 'draft' | 'published' | 'suspended' | 'archived'

// ── Feature flags & konfigurasi website ──────────────────────
// Bentuk baku kolom `landing_pages.konfigurasi` (JSONB). Saklar add-on
// per website diatur di sini — bukan tabel/schema terpisah. Tim studio
// menyalakan/mematikan sesuai struk add-on order.

export interface FeatureFlags {
  hasCart?: boolean // toko online / checkout (tabel add-on: products)
  hasBlog?: boolean // artikel/berita (tabel add-on: blog_posts)
  hasBooking?: boolean // reservasi/janji temu (tabel add-on: bookings)
  hasGallery?: boolean // galeri foto
  hasSEO?: boolean // meta SEO lanjutan
  hasContactForm?: boolean // form kontak
  hasMap?: boolean // peta lokasi
  // ── add-on lanjutan (dipetakan dari ID add-on form /order) ──
  hasAdmin?: boolean // dashboard admin / CMS
  hasClientPortal?: boolean // area login khusus klien
  hasPayment?: boolean // payment gateway (Midtrans)
  hasShipping?: boolean // integrasi ongkir
  hasMenu?: boolean // menu digital QR (F&B)
  hasPreorder?: boolean // F&B pre-order: form PO pelanggan → dashboard order/omzet
  hasDelivery?: boolean // integrasi delivery (GoFood/GrabFood)
  hasMembership?: boolean // sistem membership
  hasLMS?: boolean // LMS / kelas online / sertifikat
  hasMultiLang?: boolean // multi-bahasa
  hasWhatsApp?: boolean // otomasi WhatsApp
  hasAnalytics?: boolean // ads tracking / pixel / GA
  hasNewsletter?: boolean // newsletter
  hasLiveChat?: boolean // live chat support (Tawk.to)
  hasTracking?: boolean // tracking paket resi (Binderbyte)
  hasCareer?: boolean // portal lowongan kerja
  hasEmail?: boolean // email bisnis
}

export interface DesignTokens {
  visual_mood?: 'energetic' | 'authoritative' | 'warm' | 'minimal' | 'luxury' | 'playful'
  bg_style?: 'dark' | 'light' | 'warm'
  typography_weight?: 'black' | 'bold' | 'regular' | 'light'
  hero_style?: 'editorial' | 'split' | 'centered' | 'immersive'
  accent_secondary?: string // hex warna turunan dari primary
}

export interface BrandingConfig {
  primary?: string // warna utama (hex)
  secondary?: string
  logo_url?: string
  font?: string
  theme?: string    // tema visual renderer (mis. 'restaurant', 'klinik', 'rental')
  variant?: string  // gaya visual per industri (mis. 'warm', 'clean', 'premium')
  design_tokens?: DesignTokens
}

// Konfigurasi spesifik per add-on (data operasional, bukan feature flag).
export interface AddonsConfig {
  tawk_property_id?: string  // Live Chat — property ID dari Tawk.to dashboard
  sheets_webhook?: string    // Google Sheets — URL Apps Script webhook milik tenant
}

// Konfigurasi Pre-Order F&B (disimpan di landing_pages.konfigurasi).
export interface PreorderConfig {
  open: boolean                            // ronde PO dibuka/ditutup ("Buka/Tutup PO")
  open_label?: string                      // mis. "PO dibuka s/d Jumat, ambil Sabtu"
  wa_admin?: string                        // nomor WA admin utk notifikasi order baru (Fonnte)
  fulfillment?: ('pickup' | 'delivery')[]  // opsi pemenuhan yang ditawarkan
}

// Locale per-tenant (default IDR/id-ID/62 → tenant Indonesia existing tak berubah).
export interface LocaleConfig {
  currency?: string  // ISO 4217, mis. 'IDR' | 'JPY'
  locale?: string    // BCP-47, mis. 'id-ID' | 'ja-JP'
  phone_cc?: string  // kode negara telp tanpa '+', mis. '62' | '81'
}

export interface KonfigurasiWebsite {
  features?: FeatureFlags
  branding?: BrandingConfig
  addons?: AddonsConfig
  // B-cap: capability add-on (mis. 'booking', 'delivery-buttons', 'qr-menu') —
  // diturunkan dari selected_addons via catalog.capabilitiesForAddons, dibaca
  // renderer untuk render UI kondisional. Beda dari `features` (flag boolean lama).
  capabilities?: string[]
  /** F&B Pre-Order: konfigurasi ronde PO + nomor WA admin. */
  preorder?: PreorderConfig
  /** Locale per-tenant (currency/locale/phone). Default IDR/id-ID/62 bila kosong. */
  localeConfig?: LocaleConfig
  /** Opsi C: konten halaman masih contoh template (briefing inti kosong saat build).
   *  Portal pakai ini untuk banner onboarding. Tidak memengaruhi render situs publik. */
  content_is_sample?: boolean
  /** Cutover Bakso Fase 1 (BAKSO_PORTAL_CONTRACT.md §11). 'portal' → storefront baca
   *  catalog_mirror + checkout POST ke /api/orders (Portal SoR). Default/absen = jalur
   *  WB lama (menu_items + /api/preorder/create). Per-tenant; tenant lain nol regresi. */
  source_of_truth?: 'wb' | 'portal'
  /** Penyesuaian checkout per-tenant (mis. Mama Zafran, bisnis dalam gedung kantor).
   *  transferOnly → sembunyikan opsi COD, sisakan Transfer Bank saja (alamat WAJIB).
   *  catatanHint → placeholder field Catatan (mis. arahkan tulis lantai/patokan lokasi). */
  checkout?: { transferOnly?: boolean; catatanHint?: string }
  /** B5 (Kamy): booking online realtime lewat Portal Klinik eksternal. Renderer klinik
   *  bespoke merender flow booking native (pilih cabang→dokter→slot→data→konfirmasi) yang
   *  memanggil Portal via proxy server WB (/api/booking-proxy/{slug}/…). Absen → tak dirender. */
  booking?: { portal_base?: string; slug?: string }
  /** Style knobs (Wave 3 full-editability) — pilihan tenant dari daftar KURASI tema
   *  (BespokeEntry.design): palet (= variant renderer) + font pairing. Divalidasi
   *  /api/portal/design lawan daftar registry; absen = bawaan tema (nol regresi).
   *  Nilai default TIDAK disalin ke sini (pilih bawaan = key dihapus). */
  design?: { palette?: string; fontPairing?: string; accent?: string }
}

export type TipeKomponen =
  | 'hero_banner'
  | 'about'
  | 'features'
  | 'pricing_table'
  | 'gallery'
  | 'testimonials'
  | 'team'
  | 'cta'
  | 'contact_form'
  | 'faq'
  | 'stats'
  | 'blog_list'
  | 'product_list'
  | 'service_list'
  | 'video_embed'
  | 'map_embed'
  | 'social_feed'
  | 'custom_html'

// ── data_konten JSONB shape per industri ─────────────────────
// Digunakan saat insert/update dengan `satisfies` operator
// untuk validasi shape tanpa mengubah tipe JSONB di database.

export interface DataKontenTokoOnline {
  nama_toko: string
  deskripsi: string
  logo_url?: string
  kategori_produk?: string[]
  kontak: {
    wa?: string
    email?: string
    alamat?: string
  }
  sosial_media?: {
    instagram?: string
    tiktok?: string
    shopee?: string
    tokopedia?: string
  }
  tagline?: string
  warna_tema?: string
}

export interface DataKontenSekolah {
  nama_sekolah: string
  akreditasi?: string
  deskripsi: string
  logo_url?: string
  visi?: string
  misi?: string[]
  program_unggulan?: string[]
  kontak: {
    telepon?: string
    email?: string
    alamat: string
    maps_url?: string
  }
  sosial_media?: {
    instagram?: string
    youtube?: string
    facebook?: string
  }
  ppdb_aktif?: boolean
  warna_tema?: string
}

export interface DataKontenCorporate {
  nama_perusahaan: string
  tagline?: string
  deskripsi: string
  logo_url?: string
  tahun_berdiri?: number
  bidang_usaha: string
  layanan_utama?: string[]
  klien_unggulan?: string[]
  kontak: {
    telepon?: string
    email: string
    alamat?: string
    website?: string
  }
  sosial_media?: {
    linkedin?: string
    instagram?: string
    twitter?: string
  }
  warna_tema?: string
}

export interface DataKontenKlinik {
  nama_klinik: string
  deskripsi: string
  logo_url?: string
  spesialisasi?: string[]
  dokter?: Array<{
    nama: string
    spesialis: string
    foto_url?: string
    jadwal?: string
  }>
  jam_operasional?: string
  fasilitas?: string[]
  kontak: {
    telepon: string
    email?: string
    alamat: string
    maps_url?: string
    wa?: string
  }
  asuransi_diterima?: string[]
  warna_tema?: string
}

export interface DataKontenRental {
  nama_usaha: string
  tagline?: string
  deskripsi?: string
  kota_layanan?: string[]
  wa?: string
  keunggulan?: string[]   // max 4 poin dari customer, tampil di "Mengapa Kami"
  syarat_sewa?: string    // persyaratan & kebijakan sewa
  kontak?: {
    telepon?: string
    email?: string
    alamat?: string
  }
  sosial_media?: {
    instagram?: string
    tiktok?: string
  }
  warna_tema?: string
}

// ── Database row types ────────────────────────────────────────

export interface LandingPage {
  id: string
  tenant_id: string
  nama_website: string
  slug: string | null
  domain_custom: string | null
  tipe_industri: TipeIndustri
  status: StatusPage
  data_konten: Record<string, unknown>
  konfigurasi: KonfigurasiWebsite
  created_at: string
  updated_at: string
}

export interface PageSection {
  id: string
  page_id: string
  tenant_id: string
  urutan: number
  tipe_komponen: TipeKomponen
  is_visible: boolean
  isi_komponen: Record<string, unknown>
  created_at: string
  updated_at: string
}

// ── Input types (server-generated fields dihapus) ─────────────

export type InsertLandingPageInput = Omit<LandingPage, 'id' | 'created_at' | 'updated_at'>
export type InsertPageSectionInput = Omit<PageSection, 'id' | 'created_at' | 'updated_at'>

// ── Composite: page + sections dalam satu fetch ───────────────

export interface LandingPageWithSections extends LandingPage {
  page_sections: PageSection[]
}

// ── Add-on data (tabel bersama multi-tenant — Stage 3) ────────

export interface Product {
  id: string
  tenant_id: string
  page_id: string
  nama: string
  deskripsi: string | null
  harga: number
  gambar_url: string | null
  kategori: string | null
  stok: number | null
  is_active: boolean
  urutan: number
  created_at: string
  updated_at: string
}

// Item menu restoran (pola mirip Product). Dikelola customer via portal.
export interface MenuItem {
  id: string
  tenant_id: string
  page_id: string
  kategori: string | null
  nama: string
  deskripsi: string | null
  harga: number
  gambar_url: string | null
  is_active: boolean
  /** Biaya/cost per item → perhitungan profit. TIDAK diekspos ke anon (lihat fetchMenuItemsByPage). */
  hpp?: number
  /** Stok per ronde PO; null/undefined = tak terbatas. TIDAK diekspos ke anon. */
  stok_harian?: number | null
  /** Tandai habis → badge "Habis" di menu + tolak di form PO. */
  is_sold_out?: boolean
  urutan: number
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  tenant_id: string
  page_id: string
  judul: string
  slug: string | null
  ringkasan: string | null
  konten: string | null
  cover_url: string | null
  penulis: string | null
  /** Kategori bebas (chips filter di index blog publik). */
  kategori: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

// Layanan yang bisa di-booking (pola mirip Product). harga = harga penuh
// (informasi), dp_amount = nominal yang dibayar online saat booking
// (0 = bayar di tempat / tanpa pembayaran online).
export interface Service {
  id: string
  tenant_id: string
  page_id: string
  nama: string
  deskripsi: string | null
  harga: number
  dp_amount: number
  durasi_menit: number | null
  gambar_url: string | null
  kategori: string | null
  is_active: boolean
  urutan: number
  created_at: string
  updated_at: string
}

// Galeri foto — dikelola customer via portal (reklasifikasi studio→customer).
export interface GalleryImage {
  id: string
  tenant_id: string
  page_id: string
  url: string
  caption: string | null
  is_active: boolean
  urutan: number
  created_at: string
}

// Profil bisnis (1 baris per halaman) — kontak/jam/alamat/peta/sosial, editable customer.
export interface TenantProfile {
  page_id: string
  tenant_id: string
  wa: string | null
  email: string | null
  alamat: string | null
  jam: string | null
  maps_url: string | null
  instagram: string | null
  ongkir: string | null
  delivery: string | null
  newsletter: boolean
  updated_at: string
}

export interface Booking {
  id: string
  tenant_id: string
  page_id: string
  service_id: string | null
  nama_pemesan: string
  kontak: string | null
  email: string | null
  jadwal: string | null
  catatan: string | null
  total: number
  dp_amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'done'
  payment_status: 'not_required' | 'unpaid' | 'awaiting_payment' | 'paid' | 'failed' | 'expired'
  midtrans_order_id: string | null
  created_at: string
  updated_at: string
}
