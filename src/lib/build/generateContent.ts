// ============================================================
// F1-1 — generateContent(order): pintu masuk pipeline build_order.
// order -> normalisasi briefing -> template per industri -> tokens + features
// -> BuildPlan siap tulis. Murni fungsi (tanpa I/O) → mudah dites & dipanggil
// dari API route. Port logika skill .claude/commands/build-order.md.
// ============================================================
import type { BuildPlan, BuildTenantProfile } from './types'
import { normalizeBriefing } from './briefing'
import { runTemplate } from './templates'
import { deriveDesignTokens, defaultVariant } from './designTokens'
import { industryToTheme, addonsToFeatures } from '@/lib/websitebuilder-mapping'
import { capabilitiesForAddons } from '@/lib/addons/catalog'
import { getManifest } from '@/lib/theme-system/manifest'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

type OrderLike = {
  industri?: string | null
  nama_usaha?: string | null
  nama_perusahaan?: string | null
  nomor_wa?: string | null
  email?: string | null
  briefing_data?: unknown
  selected_addons?: string[] | null
}

export function generateContent(order: OrderLike): BuildPlan {
  const b = normalizeBriefing(order)
  const out = runTemplate(b)

  // Fine Dining premium → renderer bespoke RestaurantLuxRenderer (theme
  // 'restaurant-lux'). Upgrade dari finedining composable: pilihan Fine Dining di
  // briefing kini membangun situs bespoke. Palet diturunkan dari gaya terpilih
  // (default 'aurum'); 'nordic' (terang) dipetakan ke 'noir' karena renderer
  // bespoke bergaya gelap-mewah, tak punya palet terang.
  const LUX_PALETTE: Record<string, 'aurum' | 'noir' | 'hearth'> = {
    'finedining-aurum': 'aurum',
    'finedining-hearth': 'hearth',
    'finedining-nordic': 'noir',
  }
  const isLux =
    b.tipe === 'restaurant' &&
    (b.subKategori === 'finedining' || (b.variant ?? '').startsWith('finedining-'))

  const variant = isLux
    ? LUX_PALETTE[b.variant ?? ''] ?? 'aurum'
    : b.variant || defaultVariant(b.tipe)
  // Theme System: bila variant = id manifest composable (mis. 'kuliner-rustic'),
  // tandai theme 'composable' supaya SiteRenderer me-route ke ComposableRenderer.
  // Fine Dining → 'restaurant-lux'. Selain itu jalur lama (theme per industri).
  const manifest = isLux ? null : getManifest(variant)
  const theme = isLux
    ? 'restaurant-lux'
    : manifest
      ? 'composable'
      : industryToTheme(b.tipe)
  const designTokens = deriveDesignTokens(b.tipe, b.primary)
  const features = addonsToFeatures(order.selected_addons)
  const capabilities = capabilitiesForAddons(order.selected_addons)

  // Opsi C: konten "contoh" bila inti showcase (menu/fleet/layanan/dokter/program/
  // produk) TIDAK diisi di briefing → template fallback dipakai. Portal pakai flag
  // ini untuk banner onboarding "ganti konten contoh".
  const CORE_KEYS = ['menu', 'fleet', 'layanan', 'dokter', 'program', 'produk_unggulan']
  const kontenObj = b.konten as Record<string, unknown>
  const contentIsSample = !CORE_KEYS.some(
    (k) => Array.isArray(kontenObj[k]) && (kontenObj[k] as unknown[]).length > 0,
  )

  // Imagery enrichment (anti-slop): dummy auto-build tak punya foto → semua jatuh
  // ke placeholder gradient. Pinjam foto Unsplash terkurasi dari sample-content
  // (per sub-kategori) HANYA utk tema composable — di situ sub-kat pasti cocok,
  // jadi fotonya relevan (tema lama/generik dilewati supaya tak salah industri).
  // Hanya mengisi yang masih kosong; saat klien upload foto via portal, ditimpa.
  // Imagery enrichment: composable pakai sample per manifest; Fine Dining bespoke
  // pinjam sample 'finedining' (foto hidangan terkurasi) supaya signature dishes &
  // hero tak kosong pada auto-build dummy.
  const sample = isLux
    ? sampleContentForTheme('finedining')
    : manifest && variant
      ? sampleContentForTheme(variant)
      : null
  const showcaseImgs = (sample?.showcase?.items ?? [])
    .map((it) => it.gambar)
    .filter((g): g is string => !!g)
  const withGambar = <T extends { gambar?: string }>(rows: T[]): T[] =>
    showcaseImgs.length
      ? rows.map((r, i) => (r.gambar ? r : { ...r, gambar: showcaseImgs[i % showcaseImgs.length] }))
      : rows

  const services = withGambar(out.services ?? [])
  const menuItems = withGambar(out.menuItems ?? [])
  const products = withGambar(out.products ?? [])

  const dataKonten: Record<string, unknown> = { ...out.dataKonten }
  if (sample) {
    if (sample.hero?.image && !dataKonten.foto_hero) dataKonten.foto_hero = sample.hero.image
    if (sample.about?.image && !dataKonten.about_image) dataKonten.about_image = sample.about.image
    if (sample.cta?.image && !dataKonten.cta_image) dataKonten.cta_image = sample.cta.image
  }

  const tenantProfile: BuildTenantProfile = {
    wa: b.wa || undefined,
    email: b.email || undefined,
    alamat: b.alamat || undefined,
    jam: b.jamOperasional || undefined,
    instagram: b.sosial.instagram || undefined,
  }

  return {
    theme,
    variant,
    primary: b.primary,
    designTokens,
    features,
    capabilities,
    contentIsSample,
    dataKonten,
    sections: out.sections,
    services,
    menuItems,
    products,
    tenantProfile,
    summary: {
      tipe: b.tipe,
      theme,
      variant,
      primary: b.primary,
      nSections: out.sections.length,
      nServices: services.length,
      nMenu: menuItems.length,
      nProducts: products.length,
    },
  }
}
