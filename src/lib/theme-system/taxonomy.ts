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
  // Hanya sub-kategori dengan tema lux/bespoke yang `ready` (keputusan owner
  // 2026-06-11): Fashion = flagship Atelier (boutique). Sisanya disembunyikan
  // dari brief form sampai tema lux-nya dibangun (composable lama tetap render
  // untuk situs existing — renderer baca branding.variant, bukan daftar ini).
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
  // ── RESTAURANT (Wave 2) — sub-kategori picker AKTIF, ketiganya READY. Warung =
  // bespoke "Hangat" (WarungRenderer, source menu). Cafe = bespoke "Seduh"
  // (CafeRenderer, source menu). Fine Dining = restaurant-lux (3 palet via isLux,
  // generateContent). "Lainnya (gaya umum)" di picker → kartu Lux/restaurant-lux
  // (escape hatch). Tema composable lama (warung/cafe/finedining ×3) tetap di
  // manifest.ts utk situs existing.
  restaurant: [
    { id: 'warung', nama: 'Warung / Kedai', deskripsi: 'Warung makan, kedai, masakan rumahan, angkringan.', icon: 'Store', ready: true },
    { id: 'cafe', nama: 'Cafe / Coffee Shop', deskripsi: 'Kopi, dessert, tempat nongkrong, brunch.', icon: 'Coffee', ready: true },
    { id: 'finedining', nama: 'Fine Dining / Resto Keluarga', deskripsi: 'Restoran keluarga, fine dining, resto spesial.', icon: 'ChefHat', ready: true },
  ],
  klinik: [
    { id: 'umum', nama: 'Klinik Umum / Gigi', deskripsi: 'Klinik umum, dokter gigi, poli, layanan medis dasar.', icon: 'Stethoscope', ready: true },
    { id: 'estetik', nama: 'Skincare / Estetik', deskripsi: 'Klinik kecantikan, dermatologi, perawatan kulit & wajah.', icon: 'Sparkles', ready: true },
    { id: 'wellness', nama: 'Fisio / Wellness', deskripsi: 'Fisioterapi, terapi, spa medis, pusat kebugaran.', icon: 'HeartPulse', ready: true },
  ],
  sekolah: [
    { id: 'reguler', nama: 'Sekolah Umum (SD/SMP/SMA)', deskripsi: 'Sekolah negeri/swasta, TK, SD, SMP, SMA/SMK.', icon: 'GraduationCap', ready: false },
    { id: 'islami', nama: 'Sekolah Islami / Pesantren', deskripsi: 'Madrasah, pesantren, sekolah Islam terpadu.', icon: 'BookOpen', ready: false },
    { id: 'kursus', nama: 'Kursus / Bimbel', deskripsi: 'Bimbel, kursus bahasa, skill, course online.', icon: 'PencilRuler', ready: false },
  ],
  personal: [
    { id: 'kreator', nama: 'Kreator / Influencer', deskripsi: 'Content creator, YouTuber, selebgram, seniman.', icon: 'Video', ready: false },
    { id: 'profesional', nama: 'Profesional / Expert', deskripsi: 'Konsultan, freelancer, dokter, pengacara, portofolio.', icon: 'Briefcase', ready: false },
    { id: 'coach', nama: 'Coach / Mentor', deskripsi: 'Coach, trainer, pembicara, mentor bisnis.', icon: 'Compass', ready: false },
  ],
  corporate: [
    { id: 'startup', nama: 'Startup / Tech', deskripsi: 'Startup, SaaS, aplikasi, perusahaan teknologi.', icon: 'Rocket', ready: false },
    { id: 'agency', nama: 'Agency / Kreatif', deskripsi: 'Agensi digital, kreatif, branding, production house.', icon: 'Megaphone', ready: false },
    { id: 'korporat', nama: 'Korporat / Manufaktur', deskripsi: 'Perusahaan mapan, manufaktur, distributor, B2B.', icon: 'Building2', ready: false },
  ],
  travel: [
    { id: 'kendaraan', nama: 'Rental Kendaraan', deskripsi: 'Sewa mobil, motor, bus, lepas kunci & dengan sopir.', icon: 'Car', ready: false },
    { id: 'wisata', nama: 'Wisata / Tour', deskripsi: 'Open trip, paket wisata, travel agent, tour guide.', icon: 'Palmtree', ready: false },
    { id: 'akomodasi', nama: 'Akomodasi / Sewa', deskripsi: 'Villa, homestay, kos, guest house, penginapan.', icon: 'BedDouble', ready: false },
  ],
  blog: [
    { id: 'jurnal', nama: 'Blog Pribadi', deskripsi: 'Blog personal, jurnal, catatan, opini.', icon: 'NotebookPen', ready: false },
    { id: 'media', nama: 'Media / Berita', deskripsi: 'Portal berita, majalah online, media digital.', icon: 'Newspaper', ready: false },
    { id: 'niche', nama: 'Blog Niche', deskripsi: 'Blog tema khusus: kuliner, teknologi, traveling, gaya hidup.', icon: 'Hash', ready: false },
  ],
  jastip: [
    { id: 'luar', nama: 'Jastip Luar Negeri', deskripsi: 'Titip beli dari LN: branded, skincare, gadget.', icon: 'Plane', ready: false },
    { id: 'lokal', nama: 'Jastip Lokal / UMKM', deskripsi: 'Titip beli dalam negeri, oleh-oleh, produk UMKM.', icon: 'Store', ready: false },
    { id: 'preorder', nama: 'Preorder / PO', deskripsi: 'Sistem PO terjadwal, ready stock batch, grup buy.', icon: 'PackageCheck', ready: false },
  ],
}

// ── Registry tema per industri → sub-kategori ─────────────────
// THEMES[tipe][subKategori] = daftar gaya. Sprint 0 menyemai Kuliner ×3 sebagai
// cetakan; sub-kategori lain diisi belakangan. Stub di sini BELUM punya renderer
// (S0-2) — aman karena belum ada yang membaca registry ini.
export const THEMES: Partial<Record<TipeIndustri, Record<string, ThemeOption[]>>> = {
  toko_online: {
    // Kuliner = FLAGSHIP lux bespoke "Toko Dapur" (KulinerLuxRenderer, bukan
    // composable). 2 varian: tungku (terang hangat) & pamor (gelap heritage).
    // manifest:'toko-kuliner' inert (di-intercept generateContent SEBELUM
    // getManifest). Tema composable lama (kuliner-rustic/modern/heritage) tetap
    // di manifest.ts untuk situs existing, hanya tak ditawarkan lagi di brief form.
    kuliner: [
      {
        id: 'kuliner-tungku',
        subKategori: 'kuliner',
        nama: 'Tungku',
        deskripsi: 'Hangat & rumahan, krem dan bara terracotta. Untuk warung, kue, frozen, masakan rumahan.',
        icon: 'Flame',
        mood: '#A8381A',
        bg: 'warm',
        manifest: 'toko-kuliner',
      },
      {
        id: 'kuliner-pamor',
        subKategori: 'kuliner',
        nama: 'Pamor',
        deskripsi: 'Gelap heritage & emas, dramatis sinematik. Untuk kuliner premium, signature, oleh-oleh khas.',
        icon: 'Crown',
        mood: '#C9A24A',
        bg: 'dark',
        manifest: 'toko-kuliner',
      },
    ],
    // Fashion → FLAGSHIP Atelier (boutique bespoke). 2 varian maison; brief form
    // menyimpan id ini di branding.variant → generateContent meng-intercept ke
    // TokoAtelierRenderer (theme 'toko-atelier'), bukan composable. `manifest` di
    // sini hanya metadata (tak dibaca saat intercept). Komposable fashion lama
    // (fashion-editorial/minimal/vibrant) tetap di manifest.ts utk situs existing.
    fashion: [
      {
        id: 'atelier-noir',
        subKategori: 'fashion',
        nama: 'Noir',
        deskripsi: 'Gelap mewah seperti butik malam, sorot dramatis. Untuk label busana premium & koleksi eksklusif.',
        icon: 'Moon',
        mood: '#1C1916',
        bg: 'dark',
        manifest: 'atelier-noir',
      },
      {
        id: 'atelier-ivoire',
        subKategori: 'fashion',
        nama: 'Ivoire',
        deskripsi: 'Gading hangat & terang, elegan tenang. Untuk fashion minimalis, ready-to-wear, brand bersih.',
        icon: 'Sun',
        mood: '#A9885E',
        bg: 'light',
        manifest: 'atelier-ivoire',
      },
    ],

    // ── KERAJINAN / HERITAGE ×3 (flagship) — motif & tekstur ──────
    kerajinan: [
      {
        id: 'kerajinan-tanah', subKategori: 'kerajinan', nama: 'Tanah Loka',
        deskripsi: 'Heritage botanical — motif kawung, palet hutan dan perkamen. Untuk batik tulis, tenun, anyaman, ukiran.',
        icon: 'Palette', mood: '#1E3A2F', bg: 'dark', manifest: 'toko-kerajinan',
      },
    ],

    // ── KECANTIKAN / SKINCARE (flagship bespoke "Embun") ─────────
    // KecantikanLuxRenderer (light-luminous, signature glow halo). 1 varian
    // default: embun. manifest:'toko-kecantikan' inert (di-intercept generateContent
    // SEBELUM getManifest). Tema composable lama (kecantikan-blush/glow/noir) tetap
    // di manifest.ts untuk situs existing, hanya tak ditawarkan lagi di brief form.
    kecantikan: [
      {
        id: 'kecantikan-embun', subKategori: 'kecantikan', nama: 'Embun',
        deskripsi: 'Terang berkilau seperti glass skin, mekar rose lembut. Untuk skincare, kosmetik, parfum, body care.',
        icon: 'Sparkles', mood: '#B5566B', bg: 'light', manifest: 'toko-kecantikan',
      },
    ],

    // ── ELEKTRONIK / GADGET (flagship bespoke "Onyx") ────────────
    // GadgetLuxRenderer (dark-tech, signature blueprint-grid + spec-readout HUD).
    // 1 varian default: onyx. manifest:'toko-gadget' inert (di-intercept
    // generateContent SEBELUM getManifest). Tema composable lama (gadget-onyx/
    // studio/neon di manifest.ts) tetap untuk situs existing, hanya tak ditawarkan
    // lagi di brief form.
    gadget: [
      {
        id: 'gadget-onyx', subKategori: 'gadget', nama: 'Onyx',
        deskripsi: 'Gelap teknis dengan cyan elektrik, presisi & modern. Untuk aksesoris HP, audio, gadget, smart device.',
        icon: 'Cpu', mood: '#22D3EE', bg: 'dark', manifest: 'toko-gadget',
      },
    ],

    // ── RUMAH & DEKOR (flagship bespoke "Selaras") ───────────────
    // RumahLuxRenderer (Japandi light-calm, signature arched-alcove + bayangan
    // natural). 1 varian default: selaras. manifest:'toko-rumah' inert (di-intercept
    // generateContent SEBELUM getManifest). Tema composable lama (rumah-natural/
    // japandi/walnut di manifest.ts) tetap untuk situs existing, hanya tak
    // ditawarkan lagi di brief form.
    rumah: [
      {
        id: 'rumah-selaras', subKategori: 'rumah', nama: 'Selaras',
        deskripsi: 'Japandi tenang & lapang, greige hangat dengan aksen sage. Untuk mebel, dekorasi, keramik, tanaman.',
        icon: 'Armchair', mood: '#6F7A66', bg: 'light', manifest: 'toko-rumah',
      },
    ],

    // ── KESEHATAN & HERBAL (flagship bespoke "Jamu") ─────────────
    // KesehatanLuxRenderer (apothecary heritage light — kraft/turmeric, signature
    // kartu label apotek + segel). 1 varian default: jamu. manifest:'toko-kesehatan'
    // inert (di-intercept generateContent SEBELUM getManifest). Tema composable lama
    // (herbal-daun/jamu/botani di manifest.ts) tetap untuk situs existing, hanya tak
    // ditawarkan lagi di brief form.
    kesehatan: [
      {
        id: 'kesehatan-jamu', subKategori: 'kesehatan', nama: 'Jamu',
        deskripsi: 'Apotek herbal bergaya warisan — kraft & kunyit, label & segel. Untuk madu, jamu, teh herbal, minyak esensial, suplemen.',
        icon: 'Soup', mood: '#A8661A', bg: 'light', manifest: 'toko-kesehatan',
      },
    ],

    // ── BAYI & ANAK / MAINAN (flagship bespoke "Ceria") ──────────
    // AnakLuxRenderer (playful bright rounded — sky/coral/mint, signature kartu
    // stiker + hero bento + confetti). 1 varian default: ceria. manifest:'toko-anak'
    // inert (di-intercept generateContent SEBELUM getManifest). Tema composable lama
    // (anak-pastel/ceria/pop di manifest.ts) tetap untuk situs existing, hanya tak
    // ditawarkan lagi di brief form.
    anak: [
      {
        id: 'anak-ceria', subKategori: 'anak', nama: 'Ceria',
        deskripsi: 'Cerah & ramah, membulat dan menyenangkan. Untuk mainan, perlengkapan bayi, baju anak, snack.',
        icon: 'Smile', mood: '#2491C8', bg: 'light', manifest: 'toko-anak',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // RESTAURANT (Sprint 4 → Wave 2). Warung & Cafe kini bespoke (1 varian masing-
  // masing); Fine Dining tetap 3 palet (restaurant-lux via isLux). Deskripsi =
  // microcopy self-select: [sifat visual] + "Untuk [jenis tempat]".
  // ════════════════════════════════════════════════════════════
  restaurant: {
    // ── WARUNG / KEDAI (flagship bespoke "Hangat", Wave 2) ────────
    // WarungRenderer (folk-warmth light, source menu — bukan toko; signature label
    // harga "banderol" tag kertas miring + spanduk hangat). 1 varian default: hangat.
    // manifest:'restaurant-warung' = key registry bespoke (inert; di-intercept
    // generateContent SEBELUM getManifest). Tema composable lama (warung-rakyat/
    // sambal/angkringan di manifest.ts) tetap untuk situs existing, hanya tak
    // ditawarkan lagi di brief form.
    warung: [
      {
        id: 'warung-hangat', subKategori: 'warung', nama: 'Hangat',
        deskripsi: 'Merakyat & hangat seperti masakan rumah — krem, bata, dan mustard. Untuk warung makan, kedai, masakan rumahan, angkringan.',
        icon: 'Soup', mood: '#C0432E', bg: 'warm', manifest: 'restaurant-warung',
      },
    ],
    // ── CAFE / COFFEE SHOP (flagship bespoke "Seduh", Wave 2) ────
    // CafeRenderer (specialty warm-minimal light, source menu; signature "kopi-ring"
    // badge harga di noda cincin kopi + uap hero). 1 varian default: seduh.
    // manifest:'restaurant-cafe' = key registry bespoke (inert; di-intercept
    // generateContent SEBELUM getManifest). Tema composable lama (cafe-latte/
    // roastery/bloom di manifest.ts) tetap untuk situs existing, hanya tak
    // ditawarkan lagi di brief form.
    cafe: [
      {
        id: 'cafe-seduh', subKategori: 'cafe', nama: 'Seduh',
        deskripsi: 'Specialty warm-minimal — oat, espresso, dan aksen moka. Untuk coffee shop, manual brew, brunch, bakery cafe.',
        icon: 'Coffee', mood: '#A4642E', bg: 'light', manifest: 'restaurant-cafe',
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
    // ── KLINIK UMUM & GIGI (flagship bespoke "Klinik Bersih", Wave 2) ────
    // KlinikUmumRenderer (cool trust blue, source services — bukan toko; signature
    // panel Jadwal Praktik + garis detak EKG). 1 varian default: bersih.
    // manifest:'klinik-umum' = key registry bespoke (inert; di-intercept
    // generateContent SEBELUM getManifest). Tema composable lama (umum-bluecare/
    // freshteal/trustnavy di manifest.ts) tetap untuk situs existing, hanya tak
    // ditawarkan lagi di brief form.
    umum: [
      {
        id: 'klinik-bersih', subKategori: 'umum', nama: 'Klinik Bersih',
        deskripsi: 'Biru tepercaya & menenangkan, klinis dan rapi. Untuk klinik umum, dokter gigi, poli, layanan keluarga.',
        icon: 'Stethoscope', mood: '#2B5BD7', bg: 'light', manifest: 'klinik-umum',
      },
    ],
    // ── KLINIK ESTETIK (flagship bespoke "Lumen", Wave 2) ─────────
    // KlinikEstetikRenderer (editorial derma plum/orchid, source services; signature
    // numeral serif raksasa + bingkai hairline). 1 varian: lumen. manifest='klinik-estetik'
    // (key registry; di-intercept generateContent SEBELUM getManifest). Composable lama
    // (estetik-rosegold/derma/noir di manifest.ts) tetap untuk situs existing.
    estetik: [
      {
        id: 'estetik-lumen', subKategori: 'estetik', nama: 'Lumen',
        deskripsi: 'Editorial derma yang tenang — serif elegan, plum & orchid di atas putih lembut. Untuk klinik kecantikan, dermatologi, perawatan kulit & wajah.',
        icon: 'Sparkles', mood: '#9A5C8E', bg: 'light', manifest: 'klinik-estetik',
      },
    ],
    // ── KLINIK WELLNESS (flagship bespoke "Sanara", Wave 2) ───────
    // KlinikWellnessRenderer (calm healing warm-stone/teal, source services; signature
    // bingkai foto bentuk daun + motif sprout). 1 varian: sanara. manifest='klinik-wellness'
    // (key registry; di-intercept generateContent). Composable lama (wellness-sage/terra/
    // forest di manifest.ts) tetap untuk situs existing.
    wellness: [
      {
        id: 'wellness-sanara', subKategori: 'wellness', nama: 'Sanara',
        deskripsi: 'Tenang & menyembuhkan — batu hangat, teal lembut, dan bentuk daun. Untuk fisioterapi, terapi, spa medis, pusat kebugaran.',
        icon: 'Sprout', mood: '#3E8378', bg: 'light', manifest: 'klinik-wellness',
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
