// ============================================================
// THEME SYSTEM — Lapis 1 taksonomi (Sprint 0, S0-1).
// Lapis BARU di atas industri: Industri → Sub-Kategori → Tema (3 gaya).
// File ini MURNI data + tipe + fungsi pure. TIDAK menyentuh jalur render
// manapun (SiteRenderer/generateContent) → nol regresi. Mesin composable
// yang mengonsumsi `manifest` dibangun di S0-2.
//
// Lihat THEME_SYSTEM_PLAN.md (§2 taksonomi, §3 peta sub-kategori, §6 penempatan).
// ============================================================
import type { TipeIndustri } from '@/types/websitebuilder'

export type ThemeBg = 'dark' | 'light' | 'warm'

// Sub-kategori = jenis toko spesifik di dalam satu industri (mis. Toko Online
// → Kuliner / Fashion / Kerajinan). Dipilih customer di brief form (mini-step
// sebelum Branding) untuk mem-filter daftar tema.
export interface SubKategoriOption {
  id: string
  nama: string
  deskripsi: string
  // STANDAR IKON: nama ikon lucide-react (mis. 'UtensilsCrossed'), BUKAN emoji.
  // Emoji render beda-beda per OS → tak terkontrol untuk produk yang menjual
  // desain. lucide = konsisten lintas platform + bisa diwarnai. UI (S0-3)
  // memetakan nama ini ke komponen + mewarnainya dgn `mood` tema.
  icon: string
  // true bila 3 gaya temanya sudah lengkap & render. UI hanya menampilkan
  // sub-kategori yang `ready` (lihat getReadySubKategori). Default false sampai
  // playbook produksi tema (THEME_SYSTEM_PLAN §5) selesai untuk sub-kategori itu.
  ready: boolean
}

// Tema = 1 gaya otentik untuk satu sub-kategori.
export interface ThemeOption {
  id: string // unik global, mis. 'kuliner-rustic' — disimpan di branding.variant
  subKategori: string
  nama: string
  deskripsi: string
  icon: string // nama ikon lucide-react (lihat catatan STANDAR IKON di atas)
  mood: string // warna swatch preview (hex) — juga dipakai mewarnai ikon
  bg: ThemeBg
  // id manifest yang dibaca ComposableRenderer (S0-2). Untuk sekarang = id.
  manifest: string
}

// ── Registry sub-kategori per industri ────────────────────────
// Hanya industri yang memakai lapis sub-kategori yang didaftarkan. Sprint 0
// fokus Toko Online (paling banyak sub-kategori + pain pempek). Industri lain
// menyusul via playbook.
export const INDUSTRY_SUBKATEGORI: Partial<Record<TipeIndustri, SubKategoriOption[]>> = {
  toko_online: [
    { id: 'kuliner', nama: 'Kuliner / Makanan', deskripsi: 'Pempek, kue, frozen food, kopi, snack.', icon: 'UtensilsCrossed', ready: true },
    { id: 'fashion', nama: 'Fashion / Pakaian', deskripsi: 'Baju, hijab, sepatu, tas.', icon: 'Shirt', ready: true },
    { id: 'kerajinan', nama: 'Kerajinan / Heritage', deskripsi: 'Batik, tenun, ukiran, anyaman.', icon: 'Palette', ready: false },
    { id: 'kecantikan', nama: 'Kecantikan / Skincare', deskripsi: 'Kosmetik, parfum, perawatan.', icon: 'Sparkles', ready: false },
    { id: 'gadget', nama: 'Elektronik / Gadget', deskripsi: 'Aksesoris HP, gadget, elektronik.', icon: 'Smartphone', ready: false },
    { id: 'rumah', nama: 'Rumah & Dekor', deskripsi: 'Mebel, dekorasi, tanaman.', icon: 'Sofa', ready: false },
    { id: 'kesehatan', nama: 'Kesehatan & Herbal', deskripsi: 'Madu, jamu, suplemen.', icon: 'Leaf', ready: false },
    { id: 'anak', nama: 'Bayi & Anak', deskripsi: 'Perlengkapan bayi, mainan.', icon: 'Baby', ready: false },
  ],
}

// ── Registry tema per industri → sub-kategori ─────────────────
// THEMES[tipe][subKategori] = daftar gaya. Sprint 0 menyemai Kuliner ×3 sebagai
// cetakan; sub-kategori lain diisi belakangan. Stub di sini BELUM punya renderer
// (S0-2) — aman karena belum ada yang membaca registry ini.
export const THEMES: Partial<Record<TipeIndustri, Record<string, ThemeOption[]>>> = {
  toko_online: {
    kuliner: [
      {
        id: 'kuliner-rustic',
        subKategori: 'kuliner',
        nama: 'Rustic Hangat',
        deskripsi: 'Warung homemade, hangat & menggugah. Cocok untuk pempek, kue, masakan rumahan.',
        icon: 'Flame',
        mood: '#B5532A',
        bg: 'warm',
        manifest: 'kuliner-rustic',
      },
      {
        id: 'kuliner-modern',
        subKategori: 'kuliner',
        nama: 'Modern Appetite',
        deskripsi: 'Brand F&B kekinian, bersih & cerah. Untuk kopi, dessert, snack modern.',
        icon: 'CupSoda',
        mood: '#E2582B',
        bg: 'light',
        manifest: 'kuliner-modern',
      },
      {
        id: 'kuliner-heritage',
        subKategori: 'kuliner',
        nama: 'Heritage Kuliner',
        deskripsi: 'Kuliner premium/tradisional, elegan & berkelas. Untuk oleh-oleh khas & signature dish.',
        icon: 'Crown',
        mood: '#7B2D3E',
        bg: 'dark',
        manifest: 'kuliner-heritage',
      },
    ],
    // Fashion ×3 (Sprint 2) — AKTIF (S2-3). 3 gaya otentik beragam, verified
    // SSR + lolos gerbang 3 skill (§5.a). Deskripsi = microcopy self-select:
    // [sifat visual] + "Untuk [jenis toko]" → pemilik cepat memilih yang pas.
    fashion: [
      {
        id: 'fashion-editorial',
        subKategori: 'fashion',
        nama: 'Editorial',
        deskripsi: 'Gelap, dramatis, serasa majalah mode. Untuk butik, label desainer, koleksi premium.',
        icon: 'Camera',
        mood: '#0E0E0F',
        bg: 'dark',
        manifest: 'fashion-editorial',
      },
      {
        id: 'fashion-minimal',
        subKategori: 'fashion',
        nama: 'Minimalis',
        deskripsi: 'Bersih & lapang, banyak ruang kosong. Untuk basic tee, hijab polos, esensial harian.',
        icon: 'Wind',
        mood: '#1C1B19',
        bg: 'light',
        manifest: 'fashion-minimal',
      },
      {
        id: 'fashion-vibrant',
        subKategori: 'fashion',
        nama: 'Vibrant',
        deskripsi: 'Berani & ceria, penuh warna. Untuk distro, sneakers, brand anak muda.',
        icon: 'Zap',
        mood: '#5B2BE8',
        bg: 'light',
        manifest: 'fashion-vibrant',
      },
    ],
  },
}

// ── Fungsi akses (pure) ───────────────────────────────────────

// Apakah industri ini memakai lapis sub-kategori? (Saat ini hanya toko_online.)
export function hasSubKategori(tipe: string): boolean {
  return (INDUSTRY_SUBKATEGORI[tipe as TipeIndustri]?.length ?? 0) > 0
}

// Semua sub-kategori sebuah industri (termasuk yang belum ready).
export function getSubKategori(tipe: string): SubKategoriOption[] {
  return INDUSTRY_SUBKATEGORI[tipe as TipeIndustri] ?? []
}

// Hanya sub-kategori yang temanya sudah lengkap — dipakai filter UI brief form.
export function getReadySubKategori(tipe: string): SubKategoriOption[] {
  return getSubKategori(tipe).filter((s) => s.ready)
}

// Daftar tema (gaya) untuk sebuah sub-kategori.
export function getThemes(tipe: string, subKategori: string): ThemeOption[] {
  return THEMES[tipe as TipeIndustri]?.[subKategori] ?? []
}

// Satu tema by id global. Mencari lintas sub-kategori dalam industri.
export function getTheme(tipe: string, themeId: string): ThemeOption | undefined {
  const byCat = THEMES[tipe as TipeIndustri]
  if (!byCat) return undefined
  for (const list of Object.values(byCat)) {
    const found = list.find((t) => t.id === themeId)
    if (found) return found
  }
  return undefined
}
