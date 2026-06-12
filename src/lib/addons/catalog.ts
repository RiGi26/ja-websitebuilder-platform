// ============================================================
// ADD-ON CATALOG — Single Source of Truth (SSOT)
// ------------------------------------------------------------
// Sebelumnya data add-on tersebar di 4 tempat yang saling bentrok:
//   1. order/page.tsx `ADDONS` (24, form order)
//   2. AddonMarketplace.tsx `ADDONS` (14, harga BEDA)
//   3. ja-corp-landing constants/services.ts `ADDON_GROUPS` (~41, id beda)
//   4. websitebuilder-mapping.ts `ADDON_FLAG_MAP` (resolusi flag)
// → funnel bocor, harga ganda, mapping korup (blog→newsletter dst).
//
// File ini menyatukan sumber kebenaran untuk SISI WEBSITE-BUILDER
// (order form + marketplace + resolusi flag). Reconciliation lintas-repo
// dengan corp-landing = Sprint A1 (lihat ADDON_ARCHITECTURE_PLAN.md §F).
//
// PRINSIP:
//  - `features` = perilaku flag lama (di-derive oleh addonsToFeatures →
//    PERSIS sama dengan ADDON_FLAG_MAP, behavior-preserving di Sprint A0).
//  - `status` = KEJUJURAN deliverability (lihat audit §B Temuan A). 'planned'
//    artinya BELUM ada code path yang membaca flag-nya → jangan ditagih
//    sebagai fitur jadi tanpa keputusan wire-vs-drop (Sprint A3).
//  - `industries`/`requires`/`capability`/`sections`/`aliases` = metadata
//    forward-looking untuk Sprint A1-A2 (gating) & B (Blueprint Registry).
//    TIDAK memengaruhi runtime Sprint A0.
// ============================================================
import type { FeatureFlags, TipeIndustri, TipeKomponen } from '@/types/websitebuilder'

// Kelas add-on (lihat audit §B Temuan): menentukan cara materialisasi.
//  - structural : memunculkan SECTION (mis. shop→product_list)
//  - capability : mengaktifkan PERILAKU tanpa section (mis. midtrans→checkout)
//  - enhancer   : MEMODIFIKASI section yang sudah ada (mis. variant→product_list)
//  - operational: layanan operasional, BUKAN artefak website (mis. email-biz)
export type AddonClass = 'structural' | 'capability' | 'enhancer' | 'operational'

// Status deliverability — kejujuran terhadap audit.
//  - live      : ada code path yang membaca flag/capability-nya (terbukti)
//  - backend   : berfungsi di luar render (route/portal/meta), bukan via flag
//  - planned   : flag ter-set tapi NOL pembaca → belum ada efek (audit Temuan A)
//  - deprecated: jangan ditawarkan di katalog website
export type AddonStatus = 'live' | 'backend' | 'planned' | 'deprecated'

// Blueprint section (forward-looking, Sprint B). `tipe` WAJIB ∈ CHECK
// page_sections.tipe_komponen (18 nilai sah) atau insert akan gagal.
export interface SectionBlueprint {
  tipe: TipeKomponen
  source?: 'products' | 'menu' | 'services'
  preset?: string
  anchor?: 'after-showcase' | 'before-cta' | 'end'
}

export interface AddonDef {
  id: string
  name: string
  desc: string
  price: number
  yearlyMaint: number
  klass: AddonClass
  status: AddonStatus
  /** Industri yang relevan (undefined = semua). Dipakai gating Sprint A2. */
  industries?: TipeIndustri[]
  /** Dependency add-on id (mis. variant butuh shop). Gating Sprint A2. */
  requires?: string[]
  /** Flag yang dinyalakan — PERSIS sama dengan ADDON_FLAG_MAP lama. */
  features: (keyof FeatureFlags)[]
  /** Kapabilitas yang dibaca renderer (Sprint B). Bebas-bentuk untuk kini. */
  capability?: string[]
  /** Section yang diinjeksikan (Sprint B, kelas structural). */
  sections?: SectionBlueprint[]
  /** Id ekuivalen dari surface lain (corp-landing/marketplace) → A1 dedupe. */
  aliases?: string[]
  /** Catatan audit (kenapa planned/deprecated, dst). */
  note?: string
}

// ── KATALOG (24 add-on kanonik form order) ─────────────────────
// Harga = nilai resmi dari order/page.tsx (surface order utama). Konflik
// harga marketplace diselesaikan di Sprint A1 (keputusan bisnis user).
export const ADDON_CATALOG: AddonDef[] = [
  // ── Core & Operational ──
  {
    id: 'admin', name: 'Dashboard Admin (CMS)', price: 250000, yearlyMaint: 150000,
    desc: 'Kelola konten website sendiri tanpa coding.',
    klass: 'operational', status: 'backend', features: ['hasAdmin'],
    capability: ['cms'], aliases: ['admin-dash'],
    note: 'Akses CMS via auth terpisah; flag hasAdmin sendiri tak dibaca renderer.',
  },
  {
    id: 'client-portal', name: 'Client Portal Dashboard', price: 500000, yearlyMaint: 250000,
    desc: 'Area khusus klien untuk progres & invoice.',
    klass: 'operational', status: 'deprecated', features: ['hasClientPortal'],
    aliases: ['portal'],
    note: 'Konsep studio↔klien (progres build), BUKAN fitur situs end-client. Pindahkan ke kategori layanan operasional (A1).',
  },

  // ── E-Commerce (shop = induk) ──
  {
    id: 'shop', name: 'Sistem Toko Online', price: 450000, yearlyMaint: 300000,
    desc: 'Katalog, keranjang, dan manajemen order.',
    klass: 'structural', status: 'live', industries: ['toko_online', 'jastip'],
    features: ['hasCart'], capability: ['cart', 'checkout-page'],
    sections: [{ tipe: 'product_list', source: 'products', anchor: 'after-showcase' }],
    aliases: ['cart', 'checkout', 'vendor'],
    note: 'Hidup di composable+batik (CartProvider) & /checkout route. MATI di restaurant-lux/bespoke (Temuan C) → wire di Sprint B2.',
  },
  {
    id: 'midtrans', name: 'Payment Gateway (Midtrans)', price: 400000, yearlyMaint: 150000,
    desc: 'Terima bayar otomatis via QRIS & Bank.',
    klass: 'capability', status: 'backend',
    features: ['hasPayment'], capability: ['payment'],
    note: 'Lintas-fungsi: dipakai checkout shop ATAU DP booking → TIDAK di-requires ke shop saja (hindari blokir salah utk booking).',
  },
  {
    id: 'ongkir', name: 'Integrasi Ongkir Otomatis', price: 250000, yearlyMaint: 100000,
    desc: 'Cek ongkir real-time (JNE/J&T/dll).',
    klass: 'enhancer', status: 'planned', industries: ['toko_online', 'jastip'], requires: ['shop'],
    features: ['hasCart', 'hasShipping'], capability: ['shipping'],
    note: 'hasShipping NOL pembaca (Temuan A). Child shop. Wire/drop di A3.',
  },
  {
    id: 'katalog-pro', name: 'Katalog & Stok Pro', price: 350000, yearlyMaint: 150000,
    desc: 'Manajemen inventori & stok otomatis.',
    klass: 'enhancer', status: 'planned', industries: ['toko_online', 'jastip'], requires: ['shop'],
    features: ['hasCart'], capability: ['stock'], aliases: ['stock'],
    note: 'Collapse ke hasCart sama dgn shop (Temuan D). Butuh capability "stock" tersendiri (B). Child shop.',
  },
  {
    id: 'variant', name: 'Varian Produk (Size/Warna)', price: 150000, yearlyMaint: 50000,
    desc: 'Pilihan variasi untuk tiap produk.',
    klass: 'enhancer', status: 'planned', industries: ['toko_online'], requires: ['shop'],
    features: ['hasCart'], capability: ['variants'],
    note: 'Collapse ke hasCart (Temuan D). Child shop.',
  },

  // ── F&B ──
  {
    id: 'qr-menu', name: 'QR Code Menu', price: 200000, yearlyMaint: 100000,
    desc: 'Pelanggan scan meja untuk lihat menu digital.',
    klass: 'capability', status: 'backend', industries: ['restaurant'],
    features: ['hasMenu'], capability: ['qr-menu'],
    note: 'Menu sudah ada di base resto (templates.ts). Add-on ini = QR generator, bukan menu itu sendiri. Label diperbaiki (Temuan D).',
  },
  {
    id: 'delivery', name: 'Integrasi Delivery', price: 300000, yearlyMaint: 150000,
    desc: 'Tombol pesan via GrabFood/GoFood.',
    klass: 'enhancer', status: 'planned', industries: ['restaurant'],
    features: ['hasDelivery'], capability: ['delivery-buttons'],
    note: 'hasDelivery NOL pembaca (Temuan A). Wire mudah (tombol link) di A3/B2.',
  },

  // ── Booking / Service (booking = induk) ──
  {
    id: 'booking', name: 'Sistem Booking & Kalender', price: 300000, yearlyMaint: 150000,
    desc: 'Jadwal temu & janji temu real-time.',
    klass: 'structural', status: 'live', industries: ['klinik', 'travel', 'restaurant', 'personal'],
    features: ['hasBooking'], capability: ['booking', 'booking-page'],
    sections: [{ tipe: 'contact_form', preset: 'booking', anchor: 'before-cta' }],
    aliases: ['clinic-res', 'doc-sched'],
    note: 'Route /booking + /api/booking/create hidup. CTA in-page utk lux/composable = B2.',
  },
  {
    // Hasil merge telemedicine + live-session → satu SKU "Video Meeting" (Temuan D).
    // requires 'booking' (BUKAN 'lms' — lms disembunyikan; live-session dulu jadi
    // orphan karena itu). Id lama 'telemedicine'/'live-session' kini ALIAS →
    // order lama tetap resolve capability (capabilitiesForAddons) + FLAG_ALIASES
    // jaga parity flag addonsToFeatures.
    id: 'video-meeting', name: 'Integrasi Video Meeting', price: 400000, yearlyMaint: 200000,
    desc: 'Jadwalkan sesi konsultasi atau kelas online via Zoom/Google Meet.',
    klass: 'capability', status: 'planned',
    industries: ['klinik', 'sekolah', 'personal'], requires: ['booking'],
    features: ['hasBooking'], capability: ['video-meeting'],
    aliases: ['telemedicine', 'live-session'],
    note: 'Merge telemedicine (konsultasi klinik) + live-session (kelas online). Penjadwalan via booking + tautan video; capability video-meeting dibaca renderer Sprint B2.',
  },

  // ── LMS / Education (lms = induk) ──
  {
    id: 'membership', name: 'Sistem Membership', price: 500000, yearlyMaint: 200000,
    desc: 'Area login khusus member/siswa.',
    klass: 'capability', status: 'planned', industries: ['sekolah', 'corporate', 'personal', 'klinik'],
    features: ['hasMembership'], capability: ['membership'], aliases: ['member'],
    note: 'hasMembership NOL pembaca (Temuan A). Overlap client-portal. Prasyarat lms.',
  },
  {
    id: 'lms', name: 'LMS / Video Course', price: 400000, yearlyMaint: 300000,
    desc: 'Sistem pembelajaran & progres video.',
    klass: 'structural', status: 'planned', industries: ['sekolah'],
    features: ['hasLMS'], capability: ['lms'], aliases: ['zoom'],
    note: 'hasLMS NOL pembaca (Temuan A). Bangun mesin atau tarik (A3).',
  },
  {
    id: 'cert-auto', name: 'Sertifikat Otomatis', price: 350000, yearlyMaint: 150000,
    desc: 'Generate PDF sertifikat otomatis.',
    klass: 'capability', status: 'planned', industries: ['sekolah'], requires: ['lms'],
    features: ['hasLMS'], capability: ['certificate'], aliases: ['cert'],
    note: 'Child lms. hasLMS mati.',
  },
  // (live-session dihapus — di-merge ke 'video-meeting' di grup Booking/Service.)

  // ── Marketing & General ──
  {
    id: 'email-biz', name: 'Email Bisnis (nama@brand.com)', price: 150000, yearlyMaint: 300000,
    desc: 'Email profesional untuk kredibilitas.',
    klass: 'operational', status: 'deprecated', features: ['hasEmail'],
    note: 'Email hosting eksternal — NOL artefak situs (Temuan D). Maint>harga. Pindah ke layanan operasional (A1).',
  },
  {
    id: 'lang-multi', name: 'Multi-Language (ID/EN/JP)', price: 400000, yearlyMaint: 200000,
    desc: 'Website dalam 2-3 bahasa sekaligus.',
    klass: 'capability', status: 'planned', features: ['hasMultiLang'], capability: ['i18n'],
    note: 'Renderer BELUM punya i18n. Jangan jual sbg jadi; tandai "custom manual" sampai mesin ada (Temuan D).',
  },
  {
    id: 'wa', name: 'Otomasi WhatsApp', price: 300000, yearlyMaint: 150000,
    desc: 'Notifikasi order otomatis ke WA.',
    klass: 'capability', status: 'backend', features: ['hasWhatsApp'], capability: ['wa-automation'],
    aliases: ['wa-auto'],
    note: 'Kontak WA muncul via CTA section (template), bukan flag. Flag hasWhatsApp hanya dibaca RentalRenderer.',
  },
  {
    // Harga diselaraskan dgn corp-landing (150k) — keputusan owner 2026-06-12.
    id: 'seo', name: 'SEO Optimization', price: 150000, yearlyMaint: 100000,
    desc: 'Optimasi agar muncul di halaman 1 Google.',
    klass: 'capability', status: 'backend', features: ['hasSEO'], capability: ['seo'],
    note: 'Meta kemungkinan via generateMetadata [slug], bukan flag. Konfirmasi terpisah.',
  },
  {
    id: 'ads-tracking', name: 'Ads Tracking (Pixel/GA)', price: 150000, yearlyMaint: 0,
    desc: 'Pantau efektivitas iklan FB/Google.',
    klass: 'capability', status: 'planned', features: ['hasAnalytics'], capability: ['analytics'],
    note: 'hasAnalytics NOL pembaca (Temuan A). Wire (inject script) mudah di A3.',
  },
  {
    id: 'protection', name: 'Proteksi Gambar (Anti-Copy)', price: 100000, yearlyMaint: 0,
    desc: 'Cegah download gambar ilegal.',
    klass: 'capability', status: 'deprecated', features: [],
    note: 'Anti-copy trivially bypass (screenshot/devtools). Nol flag. Drop / reposisi "best-effort" (Temuan D).',
  },
  {
    id: 'career', name: 'Portal Lowongan Kerja', price: 300000, yearlyMaint: 100000,
    desc: 'Halaman karir & lamaran online.',
    klass: 'structural', status: 'live', industries: ['corporate'],
    features: ['hasCareer'], capability: ['career'],
    // Dulu custom_html — tipe itu TIDAK punya pembaca di blueprintToSection
    // (case default → null) sehingga career tak pernah terinject. Kini band
    // `cta` ber-preset: terinject build, dirender SectionRenderer (token path)
    // DAN ComposableRenderer via content.bands (lux path).
    sections: [{ tipe: 'cta', preset: 'career', anchor: 'end' }],
    note: 'v1 = band ajakan lamaran (CTA WA/email). Listing lowongan terstruktur = butuh tabel jobs (belum ada).',
  },
  {
    id: 'newsletter', name: 'Newsletter System', price: 200000, yearlyMaint: 100000,
    desc: 'Kumpulkan email database pelanggan.',
    klass: 'structural', status: 'live',
    features: ['hasNewsletter'], capability: ['newsletter'],
    sections: [{ tipe: 'cta', preset: 'newsletter', anchor: 'before-cta' }],
    // Dulu SELALU ter-skip: dedupe per-tipe & semua template punya `cta`.
    // Dedupe kini per tipe+preset → band newsletter masuk berdampingan dgn
    // CTA penutup. JANGAN aliaskan corp blog/email-auto ke sini (Temuan B).
    note: 'v1 = band berlangganan via WA (belum ada kolektor email backend).',
  },
  {
    // BARU (A1): blog hilang dari katalog order lama; corp `blog` salah dipetakan
    // ke newsletter (Temuan B). Kini SKU kanonik sendiri → hasBlog. id 'blog'
    // langsung cocok dgn corp id 'blog' (tak perlu alias).
    id: 'blog', name: 'Blog / Artikel', price: 200000, yearlyMaint: 100000,
    desc: 'Halaman artikel/berita dengan manajemen konten.',
    klass: 'structural', status: 'backend', industries: ['blog', 'corporate', 'personal', 'sekolah'],
    features: ['hasBlog'], capability: ['blog'],
    sections: [{ tipe: 'blog_list', anchor: 'after-showcase' }],
    note: 'hasBlog dibaca portal tab; section blog_list dirender SiteRenderer bila ada. Injeksi section = Sprint B.',
  },
  {
    id: 'chat', name: 'Live Chat Support', price: 100000, yearlyMaint: 50000,
    desc: 'Chat langsung di website (Tawk.to).',
    klass: 'capability', status: 'live', features: ['hasLiveChat'], capability: ['live-chat'],
    aliases: ['live-chat'],
    note: 'Hidup via tawk widget BILA konfigurasi.addons.tawk_property_id diisi.',
  },
]

// ── Alias flag non-SKU (preserve perilaku addonsToFeatures) ─────
// Id yang TIBA dari surface lain (rental travel group corp-landing) tapi
// BUKAN SKU di form order 24. Wajib dipertahankan eksplisit karena fallback
// substring tak menangkapnya (mis. 'gps' tak mengandung 'tracking').
// Reconciliation jadi SKU penuh = Sprint A1.
export const FLAG_ALIASES: Record<string, (keyof FeatureFlags)[]> = {
  'gps': ['hasTracking'],
  'e-ticket': ['hasTracking'],
  'driver-sched': ['hasBooking'],
  'seat': ['hasBooking'],
  'invoice-travel': [],
  // Legacy: telemedicine + live-session di-merge → SKU 'video-meeting'. Id lama
  // dipetakan ke flag asalnya supaya order LAMA tak berubah perilaku (parity
  // ADDON_FLAG_MAP). Capability di-resolve via alias → video-meeting.
  'telemedicine': ['hasBooking'],
  'live-session': ['hasLMS', 'hasBooking'],
}

// ── Helper ─────────────────────────────────────────────────────
const BY_ID: Record<string, AddonDef> = Object.fromEntries(ADDON_CATALOG.map((a) => [a.id, a]))

export function getAddon(id: string): AddonDef | undefined {
  return BY_ID[id]
}

/** Flag eksplisit untuk sebuah id (katalog → alias). undefined bila tak dikenal
 *  (pemanggil lalu jatuh ke heuristik substring). Union katalog+alias = PERSIS
 *  ADDON_FLAG_MAP lama (dijaga test parity). */
export function explicitFeatures(id: string): (keyof FeatureFlags)[] | undefined {
  return BY_ID[id]?.features ?? FLAG_ALIASES[id]
}

// ── A1: dual-tier harga + visibilitas triage + alias terkoreksi ─────────────

// Harga tier UPGRADE (marketplace) bila beda dari harga order baru.
// Keputusan user 2026-06-09: dua-tier EKSPLISIT (nol perubahan harga ke customer,
// cuma dijadikan eksplisit di SSOT). id → [price, yearlyMaint].
const UPGRADE_PRICE: Record<string, [number, number]> = {
  shop: [299000, 199000],
  admin: [199000, 99000],
  midtrans: [299000, 99000],
  wa: [199000, 99000],
  seo: [149000, 49000],
  booking: [249000, 99000],
  chat: [99000, 49000],
  blog: [99000, 50000],
}

// SKU yang TIDAK ditawarkan saat ini — triage A3 disetujui user 2026-06-09:
//  - DROP snake-oil: protection, email-biz, client-portal
//  - HIDE heavy-unbuilt: lms, membership, cert-auto, lang-multi
// Merge-video (2026-06-09): live-session DIHAPUS sbg SKU → di-merge ke
//   'video-meeting' (requires 'booking', bukan lms) shg tak lagi orphan; id lama
//   jadi alias. telemedicine juga lebur ke video-meeting (lihat grup Booking).
// KEBIJAKAN BARU (owner, 2026-06-12 — kejujuran jualan): SKU ber-status
//   'planned' TIDAK ditawarkan di order/upgrade sampai kapabilitasnya benar-benar
//   dibangun (flip status → otomatis muncul lagi). Mencabut kebijakan lama
//   "4 SKU wire tetap ditawarkan" — jangan jual yang belum ada kodenya.
const NOT_OFFERED = new Set<string>([
  'protection', 'email-biz', 'client-portal',
  'lms', 'membership', 'cert-auto', 'lang-multi',
])

export function isOffered(id: string): boolean {
  return BY_ID[id] != null && !NOT_OFFERED.has(id) && BY_ID[id].status !== 'planned'
}

// Bentuk ringkas yang dikonsumsi UI order/marketplace (gantikan const ADDONS lokal).
// `requires`/`industries` dibawa untuk gating A2 di form order.
export interface AddonOption {
  id: string
  name: string
  price: number
  yearlyMaint: number
  desc: string
  requires?: string[]
  industries?: TipeIndustri[]
}

/** Add-on yang ditawarkan di form ORDER BARU (harga order). */
export function orderAddons(): AddonOption[] {
  return ADDON_CATALOG.filter((a) => isOffered(a.id)).map((a) => ({
    id: a.id, name: a.name, price: a.price, yearlyMaint: a.yearlyMaint, desc: a.desc,
    requires: a.requires, industries: a.industries,
  }))
}

/** Add-on yang ditawarkan di marketplace UPGRADE (harga upgrade bila ada). */
export function upgradeAddons(): AddonOption[] {
  return ADDON_CATALOG.filter((a) => isOffered(a.id)).map((a) => {
    const up = UPGRADE_PRICE[a.id]
    return {
      id: a.id, name: a.name,
      price: up ? up[0] : a.price,
      yearlyMaint: up ? up[1] : a.yearlyMaint,
      desc: a.desc,
    }
  })
}

/** Peta alias id (surface lain, mis. corp-landing) → id kanonik katalog.
 *  Gantikan CORP_TO_ORDER_ID hardcode (yang punya mapping korup blog→newsletter,
 *  track-pack→ads-tracking). Hanya alias yang BENAR secara semantik dihormati;
 *  id korup tak lagi dipetakan (jatuh & tersaring, bukan salah-petakan). */
export function aliasToId(): Record<string, string> {
  const m: Record<string, string> = {}
  for (const a of ADDON_CATALOG) {
    for (const al of a.aliases ?? []) m[al] = a.id
  }
  return m
}

// ── B-cap: capabilities ─────────────────────────────────────────────────────
// Kumpulkan capability dari selected_addons → disimpan ke konfigurasi.capabilities,
// dibaca renderer (mis. RestaurantLuxRenderer) untuk render kondisional. Resolve
// alias dulu (order menyimpan id kanonik, tapi tahan thd alias corp-landing).
export function capabilitiesForAddons(addons: string[] | null | undefined): string[] {
  const alias = aliasToId()
  const out = new Set<string>()
  for (const raw of addons ?? []) {
    const k = (raw ?? '').toLowerCase().trim()
    if (!k) continue
    const id = BY_ID[k] ? k : alias[k]
    const def = id ? BY_ID[id] : undefined
    for (const c of def?.capability ?? []) out.add(c)
  }
  return [...out]
}
