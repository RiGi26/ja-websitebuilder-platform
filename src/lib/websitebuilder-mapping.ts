// ============================================================
// Mapping helper: order (intake) -> data builder (landing_pages)
// Dipakai saat provisioning website dari sebuah order (Stage 1).
// ============================================================

import type { TipeIndustri, FeatureFlags } from '@/types/websitebuilder'

// ── industri (teks bebas dari corp-landing) -> TipeIndustri enum ──
// Nilai aktual yang ada di orders: "Website Perusahaan", "Toko Online", "".
// Pakai pencocokan substring agar tahan variasi penulisan.
export function industriToTipe(industri: string | null | undefined): TipeIndustri {
  const s = (industri ?? '').toLowerCase()
  if (!s.trim()) return 'custom'

  if (s.includes('toko') || s.includes('online') || s.includes('jual') || s.includes('ecommerce') || s.includes('e-commerce')) return 'toko_online'
  if (s.includes('perusahaan') || s.includes('corporate') || s.includes('company') || s.includes('bisnis')) return 'corporate'
  if (s.includes('sekolah') || s.includes('kampus') || s.includes('pendidikan') || s.includes('school')) return 'sekolah'
  if (s.includes('klinik') || s.includes('dokter') || s.includes('kesehatan') || s.includes('rumah sakit') || s.includes('clinic')) return 'klinik'
  if (s.includes('travel') || s.includes('wisata') || s.includes('tour') || s.includes('rental') || s.includes('sewa') || s.includes('rent')) return 'travel'
  if (s.includes('resto') || s.includes('restaurant') || s.includes('cafe') || s.includes('kuliner') || s.includes('makan')) return 'restaurant'
  if (s.includes('personal') || s.includes('pribadi') || s.includes('portfolio') || s.includes('cv')) return 'personal'
  if (s.includes('blog') || s.includes('berita') || s.includes('news')) return 'blog'
  if (s.includes('jastip') || s.includes('titip')) return 'jastip'

  return 'custom'
}

// ── selected_addons (id add-on) -> FeatureFlags ──
// Peta ID add-on RESMI dari form /order (src/app/order/page.tsx, konstanta ADDONS).
// Inilah sumber utama: nilai di orders.selected_addons berupa id seperti
// 'shop', 'katalog-pro', 'booking', dst — bukan kata bebas. Heuristik substring
// dipertahankan sebagai fallback untuk teks bebas (mis. dari referensi_manual)
// & variasi penulisan. Admin tetap bisa override semua flag lewat toggle editor.
const ADDON_FLAG_MAP: Record<string, (keyof FeatureFlags)[]> = {
  'admin': ['hasAdmin'],
  'client-portal': ['hasClientPortal'],
  'shop': ['hasCart'],
  'midtrans': ['hasPayment'],
  'ongkir': ['hasCart', 'hasShipping'],
  'katalog-pro': ['hasCart'],
  'variant': ['hasCart'],
  'qr-menu': ['hasMenu'],
  'delivery': ['hasDelivery'],
  'booking': ['hasBooking'],
  'telemedicine': ['hasBooking'],
  'membership': ['hasMembership'],
  'lms': ['hasLMS'],
  'cert-auto': ['hasLMS'],
  'live-session': ['hasLMS', 'hasBooking'],
  'email-biz': ['hasEmail'],
  'lang-multi': ['hasMultiLang'],
  'wa': ['hasWhatsApp'],
  'seo': ['hasSEO'],
  'ads-tracking': ['hasAnalytics'],
  'protection': [], // proteksi gambar — tak ada flag tampilan
  'career': ['hasCareer'],
  'newsletter': ['hasNewsletter'],
  'chat': ['hasLiveChat'],
  // rental-specific add-ons (dari services.ts ADDON_GROUPS.travel)
  'gps': ['hasTracking'],
  'e-ticket': ['hasTracking'],
  'driver-sched': ['hasBooking'],
  'seat': ['hasBooking'],
  'invoice-travel': [],
}

export function addonsToFeatures(addons: string[] | null | undefined): FeatureFlags {
  const features: FeatureFlags = {}
  const set = (k: keyof FeatureFlags) => { features[k] = true }

  for (const raw of addons ?? []) {
    const a = (raw ?? '').toLowerCase().trim()
    if (!a) continue

    // 1) cocokkan ID add-on resmi lebih dulu
    const mapped = ADDON_FLAG_MAP[a]
    if (mapped) { mapped.forEach(set); continue }

    // 2) fallback heuristik substring (teks bebas / variasi penulisan)
    if (a.includes('cart') || a.includes('toko') || a.includes('shop') || a.includes('ecommerce') || a.includes('checkout') || a.includes('produk') || a.includes('katalog')) set('hasCart')
    if (a.includes('blog') || a.includes('artikel') || a.includes('berita')) set('hasBlog')
    if (a.includes('booking') || a.includes('reservasi') || a.includes('janji') || a.includes('appointment') || a.includes('jadwal')) set('hasBooking')
    if (a.includes('seo')) set('hasSEO')
    if (a.includes('galeri') || a.includes('gallery') || a.includes('foto')) set('hasGallery')
    if (a.includes('kontak') || a.includes('contact') || a.includes('form')) set('hasContactForm')
    if (a.includes('maps') || a.includes('peta') || a.includes('lokasi')) set('hasMap')
    if (a.includes('whatsapp') || a === 'wa') set('hasWhatsApp')
    if (a.includes('membership') || a.includes('member')) set('hasMembership')
    if (a.includes('lms') || a.includes('course') || a.includes('kelas') || a.includes('sertifikat')) set('hasLMS')
    if (a.includes('bahasa') || a.includes('language') || a.includes('lang-')) set('hasMultiLang')
    if (a.includes('chat')) set('hasLiveChat')
    if (a.includes('newsletter')) set('hasNewsletter')
    if (a.includes('ongkir') || a.includes('shipping') || a.includes('ekspedisi')) set('hasShipping')
    if (a.includes('delivery') || a.includes('gofood') || a.includes('grabfood')) set('hasDelivery')
    if (a.includes('menu') || a.includes('qr')) set('hasMenu')
    if (a.includes('cms') || a.includes('admin') || a.includes('dashboard')) set('hasAdmin')
    if (a.includes('portal')) set('hasClientPortal')
    if (a.includes('payment') || a.includes('midtrans') || a.includes('bayar')) set('hasPayment')
    if (a.includes('email')) set('hasEmail')
    if (a.includes('career') || a.includes('lowongan') || a.includes('karir')) set('hasCareer')
    if (a.includes('ads') || a.includes('pixel') || a.includes('analytics') || a.includes('tracking')) set('hasAnalytics')
  }
  return features
}

// ── industri -> tema visual renderer ──────────────────────────
// Dipakai saat provisioning supaya theme di-set otomatis tanpa
// intervensi manual admin. Admin masih bisa override via builder.
const TIPE_TO_THEME: Partial<Record<TipeIndustri, string>> = {
  restaurant: 'restaurant',
  klinik:     'klinik',
  corporate:  'company',
  sekolah:    'sekolah',
  toko_online:'batik_toko',
  travel:     'rental',
}
export function industryToTheme(tipe: TipeIndustri): string {
  return TIPE_TO_THEME[tipe] ?? ''
}

// ── slugify: hasilkan slug valid sesuai CHECK ^[a-z0-9]+(-[a-z0-9]+)*$ ──
export function slugify(nama: string | null | undefined): string {
  const base = (nama ?? '')
    .toLowerCase()
    .normalize('NFKD') // dekomposisi aksen; mark-nya kebuang di langkah berikut
    .replace(/[^a-z0-9]+/g, '-') // semua non-alfanumerik (termasuk diakritik) -> dash
    .replace(/^-+|-+$/g, '') // trim dash di ujung
  return base || 'website'
}
