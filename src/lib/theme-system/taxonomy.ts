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
    { id: 'kerajinan', nama: 'Kerajinan / Heritage', deskripsi: 'Batik, tenun, ukiran, anyaman.', icon: 'Palette', ready: true },
    { id: 'kecantikan', nama: 'Kecantikan / Skincare', deskripsi: 'Kosmetik, parfum, perawatan.', icon: 'Sparkles', ready: true },
    { id: 'gadget', nama: 'Elektronik / Gadget', deskripsi: 'Aksesoris HP, gadget, elektronik.', icon: 'Smartphone', ready: true },
    { id: 'rumah', nama: 'Rumah & Dekor', deskripsi: 'Mebel, dekorasi, tanaman.', icon: 'Sofa', ready: true },
    { id: 'kesehatan', nama: 'Kesehatan & Herbal', deskripsi: 'Madu, jamu, suplemen.', icon: 'Leaf', ready: true },
    { id: 'anak', nama: 'Bayi & Anak', deskripsi: 'Perlengkapan bayi, mainan.', icon: 'Baby', ready: true },
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

    // ── KERAJINAN / HERITAGE ×3 (flagship) — motif & tekstur ──────
    kerajinan: [
      {
        id: 'kerajinan-pusaka', subKategori: 'kerajinan', nama: 'Pusaka',
        deskripsi: 'Gelap mewah dengan motif kawung emas. Untuk batik tulis, songket, koleksi warisan.',
        icon: 'Gem', mood: '#C8922A', bg: 'dark', manifest: 'kerajinan-pusaka',
      },
      {
        id: 'kerajinan-tenun', subKategori: 'kerajinan', nama: 'Tenun',
        deskripsi: 'Hangat bertekstur anyaman, terasa buatan tangan. Untuk tenun, rotan, gerabah, anyaman.',
        icon: 'Grid2x2', mood: '#A8512C', bg: 'warm', manifest: 'kerajinan-tenun',
      },
      {
        id: 'kerajinan-galeri', subKategori: 'kerajinan', nama: 'Galeri',
        deskripsi: 'Terang & lapang seperti galeri seni. Untuk ukiran, keramik, karya yang ingin menonjol.',
        icon: 'Frame', mood: '#8A6D3B', bg: 'light', manifest: 'kerajinan-galeri',
      },
    ],

    // ── KECANTIKAN / SKINCARE ×3 — lembut/elegan/pastel ──────────
    kecantikan: [
      {
        id: 'kecantikan-blush', subKategori: 'kecantikan', nama: 'Blush',
        deskripsi: 'Lembut & pastel, feminin. Untuk skincare, body care, brand kecantikan ramah.',
        icon: 'Flower2', mood: '#D98A9E', bg: 'light', manifest: 'kecantikan-blush',
      },
      {
        id: 'kecantikan-glow', subKategori: 'kecantikan', nama: 'Glow',
        deskripsi: 'Bersih & bercahaya, mewah ringan. Untuk serum, kosmetik, perawatan premium.',
        icon: 'Sun', mood: '#BD9A5F', bg: 'light', manifest: 'kecantikan-glow',
      },
      {
        id: 'kecantikan-noir', subKategori: 'kecantikan', nama: 'Noir',
        deskripsi: 'Gelap elegan, kesan parfum mahal. Untuk parfum, kosmetik high-end, edisi terbatas.',
        icon: 'Moon', mood: '#D8A7A0', bg: 'dark', manifest: 'kecantikan-noir',
      },
    ],

    // ── ELEKTRONIK / GADGET ×3 — modern/gelap/tech ───────────────
    gadget: [
      {
        id: 'gadget-onyx', subKategori: 'gadget', nama: 'Onyx',
        deskripsi: 'Gelap dengan aksen cyan elektrik. Untuk aksesoris HP, audio, gadget.',
        icon: 'Cpu', mood: '#22D3EE', bg: 'dark', manifest: 'gadget-onyx',
      },
      {
        id: 'gadget-studio', subKategori: 'gadget', nama: 'Studio',
        deskripsi: 'Terang & bersih ala Apple, fokus produk. Untuk gadget premium, smart home.',
        icon: 'Monitor', mood: '#0071E3', bg: 'light', manifest: 'gadget-studio',
      },
      {
        id: 'gadget-neon', subKategori: 'gadget', nama: 'Neon',
        deskripsi: 'Gelap neon magenta, energik. Untuk gaming gear, aksesoris RGB, brand gen-Z.',
        icon: 'Gamepad2', mood: '#D946EF', bg: 'dark', manifest: 'gadget-neon',
      },
    ],

    // ── RUMAH & DEKOR / FURNITURE ×3 — natural/lapang ────────────
    rumah: [
      {
        id: 'rumah-natural', subKategori: 'rumah', nama: 'Natural',
        deskripsi: 'Kayu hangat & organik, lapang. Untuk mebel, dekor kayu, perabot rumah.',
        icon: 'Armchair', mood: '#9C6B3F', bg: 'light', manifest: 'rumah-natural',
      },
      {
        id: 'rumah-japandi', subKategori: 'rumah', nama: 'Japandi',
        deskripsi: 'Minimalis greige, tenang & lega. Untuk dekor minimalis, keramik, tanaman.',
        icon: 'Wind', mood: '#6B6657', bg: 'light', manifest: 'rumah-japandi',
      },
      {
        id: 'rumah-walnut', subKategori: 'rumah', nama: 'Walnut',
        deskripsi: 'Walnut gelap moody, premium. Untuk furnitur kelas atas, pencahayaan, interior mewah.',
        icon: 'Lamp', mood: '#C49A6C', bg: 'dark', manifest: 'rumah-walnut',
      },
    ],

    // ── KESEHATAN & HERBAL ×3 — natural/hijau/trust ──────────────
    kesehatan: [
      {
        id: 'herbal-daun', subKategori: 'kesehatan', nama: 'Daun',
        deskripsi: 'Hijau segar & bersih, terpercaya. Untuk madu, teh herbal, produk organik.',
        icon: 'Sprout', mood: '#4E944F', bg: 'light', manifest: 'herbal-daun',
      },
      {
        id: 'herbal-jamu', subKategori: 'kesehatan', nama: 'Jamu',
        deskripsi: 'Amber kunyit hangat, tradisional. Untuk jamu, rempah, ramuan warisan.',
        icon: 'Soup', mood: '#C97A1B', bg: 'warm', manifest: 'herbal-jamu',
      },
      {
        id: 'herbal-botani', subKategori: 'kesehatan', nama: 'Botani',
        deskripsi: 'Emerald gelap & emas, esensial premium. Untuk minyak esensial, suplemen botani.',
        icon: 'Leaf', mood: '#C9AE6A', bg: 'dark', manifest: 'herbal-botani',
      },
    ],

    // ── BAYI & ANAK / MAINAN ×3 — playful/ramah ──────────────────
    anak: [
      {
        id: 'anak-pastel', subKategori: 'anak', nama: 'Pastel',
        deskripsi: 'Pastel mint-peach lembut, menenangkan. Untuk perlengkapan bayi, baju newborn.',
        icon: 'Rabbit', mood: '#8FC9C2', bg: 'light', manifest: 'anak-pastel',
      },
      {
        id: 'anak-ceria', subKategori: 'anak', nama: 'Ceria',
        deskripsi: 'Cerah & ramah, seimbang. Untuk mainan edukasi, baju anak, perlengkapan sekolah.',
        icon: 'Smile', mood: '#2BA8E0', bg: 'light', manifest: 'anak-ceria',
      },
      {
        id: 'anak-pop', subKategori: 'anak', nama: 'Pop',
        deskripsi: 'Candy lantang & ceria, penuh energi. Untuk mainan seru, snack anak, brand playful.',
        icon: 'Candy', mood: '#E5318F', bg: 'light', manifest: 'anak-pop',
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
