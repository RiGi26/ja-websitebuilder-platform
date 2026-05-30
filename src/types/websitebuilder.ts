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
  hasDelivery?: boolean // integrasi delivery (GoFood/GrabFood)
  hasMembership?: boolean // sistem membership
  hasLMS?: boolean // LMS / kelas online / sertifikat
  hasMultiLang?: boolean // multi-bahasa
  hasWhatsApp?: boolean // otomasi WhatsApp
  hasAnalytics?: boolean // ads tracking / pixel / GA
  hasNewsletter?: boolean // newsletter
  hasLiveChat?: boolean // live chat support
  hasCareer?: boolean // portal lowongan kerja
  hasEmail?: boolean // email bisnis
}

export interface BrandingConfig {
  primary?: string // warna utama (hex)
  secondary?: string
  logo_url?: string
  font?: string
}

export interface KonfigurasiWebsite {
  features?: FeatureFlags
  branding?: BrandingConfig
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
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  tenant_id: string
  page_id: string
  nama_pemesan: string
  kontak: string | null
  jadwal: string | null
  catatan: string | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'done'
  created_at: string
}
