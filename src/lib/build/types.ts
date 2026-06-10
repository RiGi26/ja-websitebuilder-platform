// ============================================================
// F1 — Otomatisasi build_order. Tipe untuk pipeline generate konten.
// generateContent(order) -> BuildPlan -> applyBuildPlan() tulis ke DB.
// Port logika dari skill manual .claude/commands/build-order.md ke kode.
// ============================================================
import type { DesignTokens, FeatureFlags, TipeIndustri, TipeKomponen } from '@/types/websitebuilder'

// Briefing yang sudah dinormalisasi dari orders.briefing_data (JSONB freeform).
// Semua field punya default aman — template tidak perlu cek null berulang.
export interface NormalizedBriefing {
  tipe: TipeIndustri
  namaUsaha: string
  tagline: string
  deskripsi: string
  wa: string
  email: string
  alamat: string
  jamOperasional: string
  kotaLayanan: string[]
  primary?: string
  variant?: string
  subKategori?: string // Theme System: jenis toko (mem-filter tema). Kosong = jalur lama.
  logoUrl?: string
  referensi?: string
  sosial: {
    instagram?: string
    tiktok?: string
    shopee?: string
    youtube?: string
    facebook?: string
    linkedin?: string
  }
  // Bucket konten mentah per industri (fleet/dokter/menu/layanan/program/produk/dst).
  konten: Record<string, unknown>
  kebijakan: string
  testimoni: Array<{ nama?: string; isi?: string }>
}

export interface BuildSection {
  tipe_komponen: TipeKomponen
  isi_komponen: Record<string, unknown>
}

export interface BuildRowService {
  nama: string
  deskripsi?: string
  harga: number
  dp_amount?: number
  durasi_menit?: number
  kategori?: string
  gambar?: string // foto placeholder (Unsplash terkurasi) — ditimpa saat klien upload
}
export interface BuildRowMenu {
  nama: string
  deskripsi?: string
  harga: number
  kategori?: string
  gambar?: string
}
export interface BuildRowProduct {
  nama: string
  deskripsi?: string
  harga: number
  kategori?: string
  stok?: number
  gambar?: string
}

export interface BuildTenantProfile {
  wa?: string
  email?: string
  alamat?: string
  jam?: string
  maps_url?: string
  instagram?: string
}

// Hasil murni dari template (sebelum digabung token/feature di generateContent).
export interface TemplateOutput {
  dataKonten: Record<string, unknown>
  sections: BuildSection[]
  services?: BuildRowService[]
  menuItems?: BuildRowMenu[]
  products?: BuildRowProduct[]
}

export type TemplateFn = (b: NormalizedBriefing) => TemplateOutput

// Rencana lengkap siap ditulis ke DB.
export interface BuildPlan {
  theme: string
  variant?: string
  primary?: string
  designTokens: DesignTokens
  features: FeatureFlags
  capabilities: string[]
  /** Opsi C: true bila konten inti showcase TIDAK diisi di briefing → build pakai
   *  contoh template. Portal pakai ini untuk banner "ganti konten contoh". */
  contentIsSample: boolean
  dataKonten: Record<string, unknown>
  sections: BuildSection[]
  services: BuildRowService[]
  menuItems: BuildRowMenu[]
  products: BuildRowProduct[]
  tenantProfile: BuildTenantProfile
  summary: {
    tipe: TipeIndustri
    theme: string
    variant?: string
    primary?: string
    nSections: number
    nServices: number
    nMenu: number
    nProducts: number
  }
}
