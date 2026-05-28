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
  konfigurasi: Record<string, unknown>
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
