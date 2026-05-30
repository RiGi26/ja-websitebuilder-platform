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
  if (s.includes('travel') || s.includes('wisata') || s.includes('tour')) return 'travel'
  if (s.includes('resto') || s.includes('restaurant') || s.includes('cafe') || s.includes('kuliner') || s.includes('makan')) return 'restaurant'
  if (s.includes('personal') || s.includes('pribadi') || s.includes('portfolio') || s.includes('cv')) return 'personal'
  if (s.includes('blog') || s.includes('berita') || s.includes('news')) return 'blog'
  if (s.includes('jastip') || s.includes('titip')) return 'jastip'

  return 'custom'
}

// ── selected_addons (id add-on) -> FeatureFlags ──
// Best-effort: di praktik saat ini add-on sering masuk via referensi_manual
// (teks), bukan selected_addons. Jadi ini titik awal — admin tetap bisa
// override semua flag lewat toggle di editor.
export function addonsToFeatures(addons: string[] | null | undefined): FeatureFlags {
  const features: FeatureFlags = {}
  for (const raw of addons ?? []) {
    const a = (raw ?? '').toLowerCase()
    if (a.includes('cart') || a.includes('toko') || a.includes('ecommerce') || a.includes('checkout') || a.includes('produk')) features.hasCart = true
    if (a.includes('blog') || a.includes('artikel') || a.includes('berita')) features.hasBlog = true
    if (a.includes('booking') || a.includes('reservasi') || a.includes('janji') || a.includes('appointment')) features.hasBooking = true
    if (a.includes('seo')) features.hasSEO = true
    if (a.includes('galeri') || a.includes('gallery') || a.includes('foto')) features.hasGallery = true
    if (a.includes('kontak') || a.includes('contact') || a.includes('form')) features.hasContactForm = true
    if (a.includes('maps') || a.includes('peta') || a.includes('lokasi')) features.hasMap = true
  }
  return features
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
