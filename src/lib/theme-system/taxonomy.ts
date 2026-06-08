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
  // ── RESTAURANT (Sprint 4) — jenis tempat makan. AKTIF (ready:true):
  // gerbang 3 skill + verify SSR (3 flagship: warung-rakyat/cafe-latte/
  // finedining-aurum) tuntas, 127/127 test + build bersih.
  restaurant: [
    { id: 'warung', nama: 'Warung / Kedai', deskripsi: 'Warung makan, kedai, masakan rumahan, angkringan.', icon: 'Store', ready: true },
    { id: 'cafe', nama: 'Cafe / Coffee Shop', deskripsi: 'Kopi, dessert, tempat nongkrong, brunch.', icon: 'Coffee', ready: true },
    { id: 'finedining', nama: 'Fine Dining / Resto Keluarga', deskripsi: 'Restoran keluarga, fine dining, resto spesial.', icon: 'ChefHat', ready: true },
  ],
  // ── KLINIK (Sprint 6) — jenis layanan kesehatan. AKTIF (ready:true):
  // gerbang 3 skill + verify SSR (flagship umum-bluecare/estetik-rosegold/
  // wellness-sage) tuntas, test + build bersih.
  klinik: [
    { id: 'umum', nama: 'Klinik Umum / Gigi', deskripsi: 'Klinik umum, dokter gigi, poli, layanan medis dasar.', icon: 'Stethoscope', ready: true },
    { id: 'estetik', nama: 'Skincare / Estetik', deskripsi: 'Klinik kecantikan, dermatologi, perawatan kulit & wajah.', icon: 'Sparkles', ready: true },
    { id: 'wellness', nama: 'Fisio / Wellness', deskripsi: 'Fisioterapi, terapi, spa medis, pusat kebugaran.', icon: 'HeartPulse', ready: true },
  ],
  // ── SEKOLAH (Sprint 7) — jenis institusi pendidikan. AKTIF (ready:true):
  // pipeline visual (ui-ux-pro-max DB + Playwright scorecard) + gerbang 3 skill
  // pada flagship tuntas.
  sekolah: [
    { id: 'reguler', nama: 'Sekolah Umum (SD/SMP/SMA)', deskripsi: 'Sekolah negeri/swasta, TK, SD, SMP, SMA/SMK.', icon: 'GraduationCap', ready: true },
    { id: 'islami', nama: 'Sekolah Islami / Pesantren', deskripsi: 'Madrasah, pesantren, sekolah Islam terpadu.', icon: 'BookOpen', ready: true },
    { id: 'kursus', nama: 'Kursus / Bimbel', deskripsi: 'Bimbel, kursus bahasa, skill, course online.', icon: 'PencilRuler', ready: true },
  ],
  // ── PERSONAL / PORTFOLIO (Sprint 8a) — personal branding. AKTIF.
  personal: [
    { id: 'kreator', nama: 'Kreator / Influencer', deskripsi: 'Content creator, YouTuber, selebgram, seniman.', icon: 'Video', ready: true },
    { id: 'profesional', nama: 'Profesional / Expert', deskripsi: 'Konsultan, freelancer, dokter, pengacara, portofolio.', icon: 'Briefcase', ready: true },
    { id: 'coach', nama: 'Coach / Mentor', deskripsi: 'Coach, trainer, pembicara, mentor bisnis.', icon: 'Compass', ready: true },
  ],
  // ── COMPANY / CORPORATE (Sprint 8b) — profil perusahaan. AKTIF.
  corporate: [
    { id: 'startup', nama: 'Startup / Tech', deskripsi: 'Startup, SaaS, aplikasi, perusahaan teknologi.', icon: 'Rocket', ready: true },
    { id: 'agency', nama: 'Agency / Kreatif', deskripsi: 'Agensi digital, kreatif, branding, production house.', icon: 'Megaphone', ready: true },
    { id: 'korporat', nama: 'Korporat / Manufaktur', deskripsi: 'Perusahaan mapan, manufaktur, distributor, B2B.', icon: 'Building2', ready: true },
  ],
  // ── TRAVEL / RENTAL (Sprint 9) — perjalanan & sewa. AKTIF.
  travel: [
    { id: 'kendaraan', nama: 'Rental Kendaraan', deskripsi: 'Sewa mobil, motor, bus, lepas kunci & dengan sopir.', icon: 'Car', ready: true },
    { id: 'wisata', nama: 'Wisata / Tour', deskripsi: 'Open trip, paket wisata, travel agent, tour guide.', icon: 'Palmtree', ready: true },
    { id: 'akomodasi', nama: 'Akomodasi / Sewa', deskripsi: 'Villa, homestay, kos, guest house, penginapan.', icon: 'BedDouble', ready: true },
  ],
  // ── BLOG / MEDIA (Sprint 9) — konten & publikasi. AKTIF.
  blog: [
    { id: 'jurnal', nama: 'Blog Pribadi', deskripsi: 'Blog personal, jurnal, catatan, opini.', icon: 'NotebookPen', ready: true },
    { id: 'media', nama: 'Media / Berita', deskripsi: 'Portal berita, majalah online, media digital.', icon: 'Newspaper', ready: true },
    { id: 'niche', nama: 'Blog Niche', deskripsi: 'Blog tema khusus: kuliner, teknologi, traveling, gaya hidup.', icon: 'Hash', ready: true },
  ],
  // ── JASTIP (Sprint 9) — jasa titip & preorder. AKTIF.
  jastip: [
    { id: 'luar', nama: 'Jastip Luar Negeri', deskripsi: 'Titip beli dari LN: branded, skincare, gadget.', icon: 'Plane', ready: true },
    { id: 'lokal', nama: 'Jastip Lokal / UMKM', deskripsi: 'Titip beli dalam negeri, oleh-oleh, produk UMKM.', icon: 'Store', ready: true },
    { id: 'preorder', nama: 'Preorder / PO', deskripsi: 'Sistem PO terjadwal, ready stock batch, grup buy.', icon: 'PackageCheck', ready: true },
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

  // ════════════════════════════════════════════════════════════
  // RESTAURANT (Sprint 4). 3 sub-kategori × 3 gaya. Deskripsi =
  // microcopy self-select: [sifat visual] + "Untuk [jenis tempat]".
  // ════════════════════════════════════════════════════════════
  restaurant: {
    warung: [
      {
        id: 'warung-rakyat', subKategori: 'warung', nama: 'Rakyat',
        deskripsi: 'Hangat & merakyat, terasa rumahan. Untuk warung makan, masakan padang, soto, nasi.',
        icon: 'Soup', mood: '#C24E2C', bg: 'warm', manifest: 'warung-rakyat',
      },
      {
        id: 'warung-sambal', subKategori: 'warung', nama: 'Sambal',
        deskripsi: 'Berani & menggugah, merah membara. Untuk ayam geprek, seblak, pedasan, lalapan.',
        icon: 'Flame', mood: '#D62828', bg: 'light', manifest: 'warung-sambal',
      },
      {
        id: 'warung-angkringan', subKategori: 'warung', nama: 'Angkringan',
        deskripsi: 'Gelap hangat bercahaya lampu, suasana malam. Untuk angkringan, kedai kopi tubruk, wedangan.',
        icon: 'Moon', mood: '#E8A23D', bg: 'dark', manifest: 'warung-angkringan',
      },
    ],
    cafe: [
      {
        id: 'cafe-latte', subKategori: 'cafe', nama: 'Latte',
        deskripsi: 'Cream lembut & cozy, nyaman berlama-lama. Untuk coffee shop, brunch, bakery cafe.',
        icon: 'Coffee', mood: '#9C6B4A', bg: 'light', manifest: 'cafe-latte',
      },
      {
        id: 'cafe-roastery', subKategori: 'cafe', nama: 'Roastery',
        deskripsi: 'Gelap espresso & industrial, untuk pecinta kopi serius. Untuk roastery, specialty coffee, manual brew.',
        icon: 'Bean', mood: '#C98A3E', bg: 'dark', manifest: 'cafe-roastery',
      },
      {
        id: 'cafe-bloom', subKategori: 'cafe', nama: 'Bloom',
        deskripsi: 'Pastel ceria & instagrammable, manis. Untuk dessert cafe, matcha, boba, tempat foto.',
        icon: 'Cherry', mood: '#E08CA0', bg: 'light', manifest: 'cafe-bloom',
      },
    ],
    finedining: [
      {
        id: 'finedining-aurum', subKategori: 'finedining', nama: 'Aurum',
        deskripsi: 'Gelap emas mewah, kesan eksklusif. Untuk fine dining, steakhouse, restoran premium.',
        icon: 'Crown', mood: '#C7A24A', bg: 'dark', manifest: 'finedining-aurum',
      },
      {
        id: 'finedining-hearth', subKategori: 'finedining', nama: 'Hearth',
        deskripsi: 'Hangat terang & ramah keluarga. Untuk resto keluarga, rumah makan besar, katering acara.',
        icon: 'Utensils', mood: '#B5532A', bg: 'warm', manifest: 'finedining-hearth',
      },
      {
        id: 'finedining-nordic', subKategori: 'finedining', nama: 'Noir',
        deskripsi: 'Gelap dingin & elegan, aksen sampanye. Untuk fine dining modern, bar, omakase, chef’s table.',
        icon: 'Wine', mood: '#C7B07E', bg: 'dark', manifest: 'finedining-nordic',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // KLINIK (Sprint 6). 3 sub-kategori × 3 gaya. Deskripsi = microcopy
  // self-select: [sifat visual] + "Untuk [jenis klinik]".
  // ════════════════════════════════════════════════════════════
  klinik: {
    umum: [
      {
        id: 'umum-bluecare', subKategori: 'umum', nama: 'Bluecare',
        deskripsi: 'Biru klinis bersih & menenangkan. Untuk klinik umum, poli, layanan keluarga.',
        icon: 'Stethoscope', mood: '#1E6FE0', bg: 'light', manifest: 'umum-bluecare',
      },
      {
        id: 'umum-freshteal', subKategori: 'umum', nama: 'Freshteal',
        deskripsi: 'Teal segar & ramah, kesan higienis. Untuk klinik gigi, anak, laboratorium.',
        icon: 'Activity', mood: '#0E9E96', bg: 'light', manifest: 'umum-freshteal',
      },
      {
        id: 'umum-trustnavy', subKategori: 'umum', nama: 'Trustnavy',
        deskripsi: 'Navy gelap profesional & mantap. Untuk klinik spesialis, medical center premium.',
        icon: 'Shield', mood: '#4FA3F0', bg: 'dark', manifest: 'umum-trustnavy',
      },
    ],
    estetik: [
      {
        id: 'estetik-rosegold', subKategori: 'estetik', nama: 'Rosegold',
        deskripsi: 'Rose-gold hangat & elegan. Untuk klinik kecantikan, beauty clinic, perawatan wajah.',
        icon: 'Flower2', mood: '#C58B6B', bg: 'warm', manifest: 'estetik-rosegold',
      },
      {
        id: 'estetik-derma', subKategori: 'estetik', nama: 'Derma',
        deskripsi: 'Putih klinis & pink lembut, ilmiah. Untuk dermatologi, skincare clinic, dokter kulit.',
        icon: 'Droplet', mood: '#E0789C', bg: 'light', manifest: 'estetik-derma',
      },
      {
        id: 'estetik-noir', subKategori: 'estetik', nama: 'Noir',
        deskripsi: 'Plum gelap mewah, kesan eksklusif. Untuk aesthetic clinic premium, anti-aging, laser.',
        icon: 'Gem', mood: '#D6A4B6', bg: 'dark', manifest: 'estetik-noir',
      },
    ],
    wellness: [
      {
        id: 'wellness-sage', subKategori: 'wellness', nama: 'Sage',
        deskripsi: 'Sage hijau lembut & tenang. Untuk fisioterapi, klinik tumbuh kembang, holistik.',
        icon: 'Leaf', mood: '#6E8B5A', bg: 'light', manifest: 'wellness-sage',
      },
      {
        id: 'wellness-terra', subKategori: 'wellness', nama: 'Terra',
        deskripsi: 'Earth terracotta hangat & membumi. Untuk spa medis, terapi pijat, pusat relaksasi.',
        icon: 'Sprout', mood: '#B07A4E', bg: 'warm', manifest: 'wellness-terra',
      },
      {
        id: 'wellness-forest', subKategori: 'wellness', nama: 'Forest',
        deskripsi: 'Hijau hutan gelap & menyembuhkan. Untuk wellness center, retreat, terapi premium.',
        icon: 'TreePine', mood: '#5FB389', bg: 'dark', manifest: 'wellness-forest',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // SEKOLAH (Sprint 7). 3 sub-kategori × 3 gaya. Palet dari ui-ux-pro-max DB.
  // Deskripsi = microcopy self-select: [sifat visual] + "Untuk [jenis sekolah]".
  // ════════════════════════════════════════════════════════════
  sekolah: {
    reguler: [
      {
        id: 'reguler-cerdas', subKategori: 'reguler', nama: 'Cerdas',
        deskripsi: 'Biru akademik bersih & terpercaya. Untuk SMP/SMA, sekolah negeri, sekolah modern.',
        icon: 'GraduationCap', mood: '#2563EB', bg: 'light', manifest: 'reguler-cerdas',
      },
      {
        id: 'reguler-ceria', subKategori: 'reguler', nama: 'Ceria',
        deskripsi: 'Hangat & ramah anak, penuh semangat. Untuk TK, PAUD, SD, sekolah dasar.',
        icon: 'Backpack', mood: '#C2680C', bg: 'warm', manifest: 'reguler-ceria',
      },
      {
        id: 'reguler-prestasi', subKategori: 'reguler', nama: 'Prestasi',
        deskripsi: 'Navy emas gelap & berwibawa. Untuk SMA unggulan, sekolah favorit, boarding school.',
        icon: 'Trophy', mood: '#C9A24A', bg: 'dark', manifest: 'reguler-prestasi',
      },
    ],
    islami: [
      {
        id: 'islami-hijau', subKategori: 'islami', nama: 'Hijau',
        deskripsi: 'Emerald segar & menenangkan. Untuk sekolah Islam terpadu, madrasah, TPQ.',
        icon: 'BookOpen', mood: '#0F7A4E', bg: 'light', manifest: 'islami-hijau',
      },
      {
        id: 'islami-emas', subKategori: 'islami', nama: 'Emas',
        deskripsi: 'Krem emas elegan & berkelas. Untuk pesantren modern, sekolah tahfidz premium.',
        icon: 'Sparkles', mood: '#936A1A', bg: 'warm', manifest: 'islami-emas',
      },
      {
        id: 'islami-malam', subKategori: 'islami', nama: 'Malam',
        deskripsi: 'Emerald gelap & emas, khusyuk. Untuk pesantren, ma’had, lembaga dakwah.',
        icon: 'Star', mood: '#CBA35A', bg: 'dark', manifest: 'islami-malam',
      },
    ],
    kursus: [
      {
        id: 'kursus-fokus', subKategori: 'kursus', nama: 'Fokus',
        deskripsi: 'Indigo modern & rapi. Untuk bimbel, kursus bahasa, lembaga sertifikasi.',
        icon: 'Target', mood: '#4F46E5', bg: 'light', manifest: 'kursus-fokus',
      },
      {
        id: 'kursus-energi', subKategori: 'kursus', nama: 'Energi',
        deskripsi: 'Coral semangat & berani. Untuk kursus skill, coding bootcamp, pelatihan kerja.',
        icon: 'Zap', mood: '#DC4220', bg: 'light', manifest: 'kursus-energi',
      },
      {
        id: 'kursus-malam', subKategori: 'kursus', nama: 'Malam',
        deskripsi: 'Violet gelap premium. Untuk course online, kelas digital, platform e-learning.',
        icon: 'Rocket', mood: '#A855F7', bg: 'dark', manifest: 'kursus-malam',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // PERSONAL / PORTFOLIO (Sprint 8a). 3 sub-kategori × 3 gaya. Palet ui-ux-pro-max DB.
  // ════════════════════════════════════════════════════════════
  personal: {
    kreator: [
      {
        id: 'kreator-spotlight', subKategori: 'kreator', nama: 'Spotlight',
        deskripsi: 'Gelap violet bak panggung, dramatis. Untuk YouTuber, musisi, seniman panggung.',
        icon: 'Mic', mood: '#C084FC', bg: 'dark', manifest: 'kreator-spotlight',
      },
      {
        id: 'kreator-pop', subKategori: 'kreator', nama: 'Pop',
        deskripsi: 'Pink terang & playful, energik. Untuk selebgram, TikToker, kreator gaya hidup.',
        icon: 'Heart', mood: '#D6206A', bg: 'light', manifest: 'kreator-pop',
      },
      {
        id: 'kreator-clean', subKategori: 'kreator', nama: 'Clean',
        deskripsi: 'Mono minimal & rapi, fokus karya. Untuk fotografer, desainer, videografer.',
        icon: 'Aperture', mood: '#111111', bg: 'light', manifest: 'kreator-clean',
      },
    ],
    profesional: [
      {
        id: 'profesional-korporat', subKategori: 'profesional', nama: 'Korporat',
        deskripsi: 'Biru bersih & terpercaya. Untuk konsultan, analis, profesional korporat.',
        icon: 'Briefcase', mood: '#1E40AF', bg: 'light', manifest: 'profesional-korporat',
      },
      {
        id: 'profesional-mono', subKategori: 'profesional', nama: 'Mono',
        deskripsi: 'Editorial gelap & elegan. Untuk arsitek, penulis, desainer, portofolio premium.',
        icon: 'PenTool', mood: '#E8E6E1', bg: 'dark', manifest: 'profesional-mono',
      },
      {
        id: 'profesional-warm', subKategori: 'profesional', nama: 'Warm',
        deskripsi: 'Cokelat hangat & ramah. Untuk dokter, terapis, pengacara, konsultan personal.',
        icon: 'Coffee', mood: '#B45309', bg: 'warm', manifest: 'profesional-warm',
      },
    ],
    coach: [
      {
        id: 'coach-energi', subKategori: 'coach', nama: 'Energi',
        deskripsi: 'Oranye semangat & memotivasi. Untuk life coach, motivator, trainer kebugaran.',
        icon: 'Flame', mood: '#C2410C', bg: 'light', manifest: 'coach-energi',
      },
      {
        id: 'coach-tenang', subKategori: 'coach', nama: 'Tenang',
        deskripsi: 'Teal kalem & menenangkan. Untuk mindfulness coach, terapis, mentor wellness.',
        icon: 'Leaf', mood: '#0C7A70', bg: 'light', manifest: 'coach-tenang',
      },
      {
        id: 'coach-prestige', subKategori: 'coach', nama: 'Prestige',
        deskripsi: 'Emas gelap & berkelas. Untuk business coach, mentor eksekutif, pembicara premium.',
        icon: 'Award', mood: '#C9A24A', bg: 'dark', manifest: 'coach-prestige',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // COMPANY / CORPORATE (Sprint 8b). 3 sub-kategori × 3 gaya. Palet ui-ux-pro-max DB.
  // ════════════════════════════════════════════════════════════
  corporate: {
    startup: [
      {
        id: 'startup-aurora', subKategori: 'startup', nama: 'Aurora',
        deskripsi: 'Gradien indigo-cyan terang & modern. Untuk SaaS, aplikasi, produk digital.',
        icon: 'Rocket', mood: '#4F46E5', bg: 'light', manifest: 'startup-aurora',
      },
      {
        id: 'startup-midnight', subKategori: 'startup', nama: 'Midnight',
        deskripsi: 'Gelap tech dengan aksen biru langit. Untuk startup AI, fintech, platform data.',
        icon: 'Gauge', mood: '#38BDF8', bg: 'dark', manifest: 'startup-midnight',
      },
      {
        id: 'startup-mint', subKategori: 'startup', nama: 'Mint',
        deskripsi: 'Emerald bersih & segar terang. Untuk green-tech, health-tech, produk ramah.',
        icon: 'Boxes', mood: '#0C7A52', bg: 'light', manifest: 'startup-mint',
      },
    ],
    agency: [
      {
        id: 'agency-bold', subKategori: 'agency', nama: 'Bold',
        deskripsi: 'Hitam-lime tegas & berani. Untuk agensi digital, branding, marketing.',
        icon: 'Megaphone', mood: '#4D7C0F', bg: 'light', manifest: 'agency-bold',
      },
      {
        id: 'agency-noir', subKategori: 'agency', nama: 'Noir',
        deskripsi: 'Editorial gelap & artistik. Untuk creative studio, production house, portofolio agensi.',
        icon: 'Layers', mood: '#F2F0EA', bg: 'dark', manifest: 'agency-noir',
      },
      {
        id: 'agency-prisma', subKategori: 'agency', nama: 'Prisma',
        deskripsi: 'Pink-peach vibrant & ceria. Untuk social media agency, event organizer, kreatif muda.',
        icon: 'Palette', mood: '#DB2777', bg: 'light', manifest: 'agency-prisma',
      },
    ],
    korporat: [
      {
        id: 'korporat-biru', subKategori: 'korporat', nama: 'Biru',
        deskripsi: 'Biru korporat bersih & terpercaya. Untuk perusahaan jasa, konsultan, B2B.',
        icon: 'Building2', mood: '#1D4ED8', bg: 'light', manifest: 'korporat-biru',
      },
      {
        id: 'korporat-slate', subKategori: 'korporat', nama: 'Slate',
        deskripsi: 'Slate gelap & premium. Untuk korporasi besar, holding, perusahaan energi.',
        icon: 'Landmark', mood: '#7DB8FF', bg: 'dark', manifest: 'korporat-slate',
      },
      {
        id: 'korporat-netral', subKategori: 'korporat', nama: 'Netral',
        deskripsi: 'Taupe hangat & mapan. Untuk manufaktur, distributor, perusahaan keluarga.',
        icon: 'Building', mood: '#5C5347', bg: 'warm', manifest: 'korporat-netral',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // TRAVEL / RENTAL (Sprint 9). 3 sub-kategori × 3 gaya. Palet ui-ux-pro-max DB.
  // ════════════════════════════════════════════════════════════
  travel: {
    kendaraan: [
      { id: 'kendaraan-asphalt', subKategori: 'kendaraan', nama: 'Asphalt', deskripsi: 'Gelap tegas otomotif, aksen oranye. Untuk rental mobil sport, mewah, premium.', icon: 'Car', mood: '#FF6A00', bg: 'dark', manifest: 'kendaraan-asphalt' },
      { id: 'kendaraan-bersih', subKategori: 'kendaraan', nama: 'Bersih', deskripsi: 'Biru bersih & terpercaya. Untuk rental harian, lepas kunci, mobil keluarga.', icon: 'KeyRound', mood: '#2563EB', bg: 'light', manifest: 'kendaraan-bersih' },
      { id: 'kendaraan-kuning', subKategori: 'kendaraan', nama: 'Kuning', deskripsi: 'Kuning energik & ramah. Untuk rental motor, skuter, kendaraan harian.', icon: 'Bike', mood: '#A16207', bg: 'light', manifest: 'kendaraan-kuning' },
    ],
    wisata: [
      { id: 'wisata-tropis', subKategori: 'wisata', nama: 'Tropis', deskripsi: 'Tosca cerah & segar. Untuk open trip pantai, snorkeling, paket pulau.', icon: 'Palmtree', mood: '#0B7A90', bg: 'light', manifest: 'wisata-tropis' },
      { id: 'wisata-rimba', subKategori: 'wisata', nama: 'Rimba', deskripsi: 'Hijau hutan gelap & petualang. Untuk pendakian, eco-tour, trip alam liar.', icon: 'Mountain', mood: '#5FB389', bg: 'dark', manifest: 'wisata-rimba' },
      { id: 'wisata-senja', subKategori: 'wisata', nama: 'Senja', deskripsi: 'Oranye senja hangat & syahdu. Untuk honeymoon, city tour, paket budaya.', icon: 'Sunset', mood: '#C2410C', bg: 'warm', manifest: 'wisata-senja' },
    ],
    akomodasi: [
      { id: 'akomodasi-resort', subKategori: 'akomodasi', nama: 'Resort', deskripsi: 'Teal resort bersih & lapang. Untuk villa, resort, hotel butik.', icon: 'BedDouble', mood: '#0F766E', bg: 'light', manifest: 'akomodasi-resort' },
      { id: 'akomodasi-kayu', subKategori: 'akomodasi', nama: 'Kayu', deskripsi: 'Kayu hangat & homey. Untuk homestay, guest house, kos eksklusif.', icon: 'Home', mood: '#9C6B3F', bg: 'warm', manifest: 'akomodasi-kayu' },
      { id: 'akomodasi-malam', subKategori: 'akomodasi', nama: 'Malam', deskripsi: 'Gelap emas mewah. Untuk villa private, penginapan premium, glamping.', icon: 'Hotel', mood: '#C9A24A', bg: 'dark', manifest: 'akomodasi-malam' },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // BLOG / MEDIA (Sprint 9). 3 sub-kategori × 3 gaya. Palet ui-ux-pro-max DB.
  // ════════════════════════════════════════════════════════════
  blog: {
    jurnal: [
      { id: 'jurnal-hangat', subKategori: 'jurnal', nama: 'Hangat', deskripsi: 'Krem serif hangat & intim. Untuk blog pribadi, jurnal, catatan harian.', icon: 'NotebookPen', mood: '#9A3412', bg: 'warm', manifest: 'jurnal-hangat' },
      { id: 'jurnal-mono', subKategori: 'jurnal', nama: 'Mono', deskripsi: 'Mono minimal & bersih, fokus tulisan. Untuk blog esai, penulis, opini.', icon: 'Type', mood: '#141414', bg: 'light', manifest: 'jurnal-mono' },
      { id: 'jurnal-senja', subKategori: 'jurnal', nama: 'Senja', deskripsi: 'Gelap cozy & nyaman dibaca malam. Untuk blog puisi, refleksi, personal.', icon: 'Moon', mood: '#E0A458', bg: 'dark', manifest: 'jurnal-senja' },
    ],
    media: [
      { id: 'media-merah', subKategori: 'media', nama: 'Merah', deskripsi: 'Merah berita tegas & cepat. Untuk portal berita, breaking news, media umum.', icon: 'Newspaper', mood: '#C81E1E', bg: 'light', manifest: 'media-merah' },
      { id: 'media-biru', subKategori: 'media', nama: 'Biru', deskripsi: 'Biru editorial terpercaya. Untuk media bisnis, jurnal, majalah online.', icon: 'Globe', mood: '#1D4ED8', bg: 'light', manifest: 'media-biru' },
      { id: 'media-malam', subKategori: 'media', nama: 'Malam', deskripsi: 'Gelap modern & fokus. Untuk media tech, review, kanal spesialis.', icon: 'Radio', mood: '#60A5FA', bg: 'dark', manifest: 'media-malam' },
    ],
    niche: [
      { id: 'niche-hijau', subKategori: 'niche', nama: 'Hijau', deskripsi: 'Hijau segar & sehat. Untuk blog kuliner, organik, gaya hidup sehat.', icon: 'Leaf', mood: '#15803D', bg: 'light', manifest: 'niche-hijau' },
      { id: 'niche-pop', subKategori: 'niche', nama: 'Pop', deskripsi: 'Violet ceria & ekspresif. Untuk blog gaya hidup, fashion, hiburan.', icon: 'Hash', mood: '#7C3AED', bg: 'light', manifest: 'niche-pop' },
      { id: 'niche-gelap', subKategori: 'niche', nama: 'Gelap', deskripsi: 'Gelap teal techie. Untuk blog teknologi, coding, review gadget.', icon: 'Terminal', mood: '#2DD4BF', bg: 'dark', manifest: 'niche-gelap' },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // JASTIP (Sprint 9). 3 sub-kategori × 3 gaya. Palet ui-ux-pro-max DB.
  // ════════════════════════════════════════════════════════════
  jastip: {
    luar: [
      { id: 'luar-global', subKategori: 'luar', nama: 'Global', deskripsi: 'Biru internasional bersih. Untuk jastip branded, mall LN, e-commerce global.', icon: 'Globe', mood: '#2563EB', bg: 'light', manifest: 'luar-global' },
      { id: 'luar-premium', subKategori: 'luar', nama: 'Premium', deskripsi: 'Gelap emas eksklusif. Untuk jastip luxury, designer bag, watch, hype item.', icon: 'Crown', mood: '#C9A24A', bg: 'dark', manifest: 'luar-premium' },
      { id: 'luar-pop', subKategori: 'luar', nama: 'Pop', deskripsi: 'Pink playful & ramah. Untuk jastip skincare, K-beauty, fashion gen-Z.', icon: 'ShoppingBag', mood: '#DB2777', bg: 'light', manifest: 'luar-pop' },
    ],
    lokal: [
      { id: 'lokal-hangat', subKategori: 'lokal', nama: 'Hangat', deskripsi: 'Oranye hangat & dekat. Untuk jastip oleh-oleh, makanan, produk lokal.', icon: 'Truck', mood: '#C2410C', bg: 'warm', manifest: 'lokal-hangat' },
      { id: 'lokal-segar', subKategori: 'lokal', nama: 'Segar', deskripsi: 'Hijau segar & jujur. Untuk jastip produk UMKM, sayur, frozen, sehat.', icon: 'Sprout', mood: '#15803D', bg: 'light', manifest: 'lokal-segar' },
      { id: 'lokal-gelap', subKategori: 'lokal', nama: 'Gelap', deskripsi: 'Gelap amber elegan. Untuk jastip kopi, craft, produk premium lokal.', icon: 'Moon', mood: '#E0A458', bg: 'dark', manifest: 'lokal-gelap' },
    ],
    preorder: [
      { id: 'preorder-fokus', subKategori: 'preorder', nama: 'Fokus', deskripsi: 'Indigo rapi & terjadwal. Untuk PO terstruktur, batch order, grup buy.', icon: 'PackageCheck', mood: '#4F46E5', bg: 'light', manifest: 'preorder-fokus' },
      { id: 'preorder-energi', subKategori: 'preorder', nama: 'Energi', deskripsi: 'Coral semangat & cepat. Untuk flash PO, limited drop, hype release.', icon: 'Truck', mood: '#DC4220', bg: 'light', manifest: 'preorder-energi' },
      { id: 'preorder-malam', subKategori: 'preorder', nama: 'Malam', deskripsi: 'Violet gelap premium. Untuk PO eksklusif, member-only, pre-launch.', icon: 'Clock', mood: '#A855F7', bg: 'dark', manifest: 'preorder-malam' },
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
