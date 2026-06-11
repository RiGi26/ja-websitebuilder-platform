// ============================================================
// Website variant definitions per industri.
// Variant = gaya visual (layout + palet + tipografi).
// Konten tetap dari DB — hanya tampilan yang berbeda.
//
// LUX-ONLY (keputusan owner 2026-06-11): brief form hanya menampilkan tier
// lux per industri — varian legacy (warm/clean/bold/dll) DIHAPUS dari picker.
// Situs EXISTING yang memakai variant legacy tetap aman: renderer membaca
// konfigurasi.branding.variant dari DB langsung, bukan dari daftar ini.
// (Jalur sub-kategori toko_online via SubKategoriPicker tidak berubah.)
// ============================================================

export interface VariantOption {
  id: string
  nama: string
  deskripsi: string
  emoji: string
  mood: string // warna preview swatch (hex)
  bg: 'dark' | 'light' | 'warm'
}

export const INDUSTRY_VARIANTS: Record<string, VariantOption[]> = {
  klinik: [
    {
      id: 'lux-klinik',
      nama: 'Lux',
      deskripsi: 'Premium default — ivory bersih & petrol-teal. Tepercaya, terang, berkelas.',
      emoji: '✨',
      mood: '#134E48',
      bg: 'light',
    },
  ],
  travel: [
    {
      id: 'lux-travel',
      nama: 'Lux',
      deskripsi: 'Premium default — indigo malam & amber senja, sinematik membangkitkan wanderlust.',
      emoji: '✨',
      mood: '#E0954A',
      bg: 'dark',
    },
  ],
  corporate: [
    {
      id: 'lux-corporate',
      nama: 'Lux',
      deskripsi: 'Premium default — navy dalam, editorial. Otoritatif untuk B2B & konsultan.',
      emoji: '✨',
      mood: '#1B3A6B',
      bg: 'light',
    },
  ],
  restaurant: [
    {
      id: 'lux-restaurant',
      nama: 'Lux',
      deskripsi: 'Premium default — fine-dining gelap hangat & emas, sinematik.',
      emoji: '✨',
      mood: '#C9A24B',
      bg: 'dark',
    },
  ],
  sekolah: [
    {
      id: 'lux-sekolah',
      nama: 'Lux',
      deskripsi: 'Premium default — krem hangat & crimson akademik, heritage kampus.',
      emoji: '✨',
      mood: '#7A2230',
      bg: 'light',
    },
  ],
  // Toko: "Lux" boutique kini eksklusif Fashion (flagship Atelier, lihat
  // taxonomy.ts). Kartu generik ini = jalur "Lainnya (gaya umum)" untuk toko di
  // luar kategori khusus → gaya composable serbaguna, BUKAN dilabeli "Lux".
  toko_online: [
    {
      id: 'lux-toko',
      nama: 'Umum / Simple',
      deskripsi: 'Gaya bersih & serbaguna untuk toko di luar kategori khusus.',
      emoji: '🛍️',
      mood: '#1C1916',
      bg: 'light',
    },
  ],
  personal: [
    {
      id: 'lux-personal',
      nama: 'Lux',
      deskripsi: 'Premium default — gelap netral & clay-rose, spotlight kreator.',
      emoji: '✨',
      mood: '#C2766B',
      bg: 'dark',
    },
  ],
  blog: [
    {
      id: 'lux-blog',
      nama: 'Lux',
      deskripsi: 'Premium default — kertas hangat & plum sastrawi, all-serif nyaman dibaca.',
      emoji: '✨',
      mood: '#5E3A5B',
      bg: 'light',
    },
  ],
  jastip: [
    {
      id: 'lux-jastip',
      nama: 'Lux',
      deskripsi: 'Premium default — charcoal & jade, aspirational untuk jasa titip.',
      emoji: '✨',
      mood: '#18684E',
      bg: 'dark',
    },
  ],
  custom: [
    {
      id: 'clean',
      nama: 'Clean & Simple',
      deskripsi: 'Layout bersih dan fleksibel.',
      emoji: '📄',
      mood: '#0EA5E9',
      bg: 'light',
    },
  ],
}

export function getVariants(tipe: string): VariantOption[] {
  return INDUSTRY_VARIANTS[tipe] ?? INDUSTRY_VARIANTS.custom
}

export function getVariant(tipe: string, variantId: string): VariantOption {
  const variants = getVariants(tipe)
  return variants.find(v => v.id === variantId) ?? variants[0]
}
