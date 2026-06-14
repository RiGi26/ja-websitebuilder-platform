import type { BrandingConfig, FeatureFlags } from '@/types/websitebuilder'
import { getManifest } from '@/lib/theme-system/manifest'
import { BESPOKE_VARIANTS, BESPOKE_RENDERED_BLOCKS } from '@/app/components/themes/toko-bespoke/variants'

// Gating tab portal berbasis add-on (SSOT = landing_pages.konfigurasi.features,
// diisi addonsToFeatures(order.selected_addons) saat provisioning; admin bisa
// override per-page via BuilderEditor). Helper murni — aman diimpor client.

/**
 * Tab Pembayaran (Midtrans self-service) = berbayar (add-on `midtrans`).
 * Entitled bila flag hasPayment menyala ATAU tenant sudah pernah konfigurasi
 * pembayaran (grandfather — tab dulunya tanpa gate; jangan matikan checkout
 * yang sudah hidup).
 */
export function paymentEntitled(features: FeatureFlags | undefined, hasExistingConfig: boolean): boolean {
  return !!features?.hasPayment || hasExistingConfig
}

// ── Tab KONTEN yang harus terbuka karena temanya merender datanya ─────────
// Tema bespoke/lux merender etalase (products/menu/services/blog) + galeri
// TANPA syarat add-on (SiteRenderer fetch tanpa flag) — maka permukaan EDIT-nya
// juga harus terbuka tanpa add-on; flag add-on tetap menggate transaksi
// (Pesanan=hasCart, Reservasi=hasBooking). OR-kan hasil ini dengan flag lama.

export interface ThemeContentTabs {
  produk: boolean
  menu: boolean
  layanan: boolean
  blog: boolean
  galeri: boolean
}

// Cermin pemilihan sumber showcase di SiteRenderer (cabang composable).
const SERVICE_INDUSTRI = ['klinik', 'sekolah', 'corporate', 'travel', 'personal']

// Toko-only (restaurant-lux tidak ada di BESPOKE_VARIANTS — digate eksplisit di bawah).
const BESPOKE_THEMES = new Set(Object.values(BESPOKE_VARIANTS).map((v) => v.theme))

export function themeContentTabs(
  branding: BrandingConfig | undefined,
  tipeIndustri: string | null | undefined,
): ThemeContentTabs {
  const none: ThemeContentTabs = { produk: false, menu: false, layanan: false, blog: false, galeri: false }
  const theme = branding?.theme
  // Bespoke toko (Atelier/Kuliner/Kerajinan): etalase = products; galeri hanya
  // untuk renderer yang benar merendernya (BESPOKE_RENDERED_BLOCKS).
  if (theme && BESPOKE_THEMES.has(theme)) {
    return { ...none, produk: true, galeri: !!BESPOKE_RENDERED_BLOCKS[theme]?.gallery }
  }
  // Bespoke premium restaurant-lux: etalase = menu_items; galeri dirender (rl-gal).
  if (theme === 'restaurant-lux') return { ...none, menu: true, galeri: true }
  // Composable/lux via manifest: sumber etalase per industri, galeri per blocks.
  const manifest = getManifest(branding?.variant)
  if (manifest) {
    const tipe = tipeIndustri ?? ''
    const out = { ...none, galeri: !!manifest.blocks.gallery }
    if (tipe === 'restaurant') out.menu = true
    else if (tipe === 'blog') out.blog = true
    else if (SERVICE_INDUSTRI.includes(tipe)) out.layanan = true
    else out.produk = true
    return out
  }
  return none
}

// ── Konten brand (stats/faq/statement di data_konten) ─────────────────────
// Semua renderer bespoke (Atelier/Kuliner/Kerajinan/RestaurantLux) merender
// ketiganya; tema composable/lux ikut deklarasi manifest.blocks. Tema lama
// (section-driven) mengedit stats/faq lewat tab Konten biasa → semua false
// supaya tidak muncul UI yang tak berefek.
export interface KontenBrandFlags {
  stats: boolean
  faq: boolean
  statement: boolean
}

export function kontenBrandEditable(branding: BrandingConfig | undefined): KontenBrandFlags {
  const theme = branding?.theme
  if (theme && (BESPOKE_THEMES.has(theme) || theme === 'restaurant-lux')) {
    return { stats: true, faq: true, statement: true }
  }
  const manifest = getManifest(branding?.variant)
  if (manifest) {
    return { stats: !!manifest.blocks.stats, faq: !!manifest.blocks.faq, statement: !!manifest.blocks.statement }
  }
  return { stats: false, faq: false, statement: false }
}
