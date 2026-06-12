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
import { addonSectionBlueprints, mergeAddonSections } from '@/lib/addons/sections'
import { getManifest } from '@/lib/theme-system/manifest'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'
import { TOKO_BESPOKE_VARIANTS } from '@/app/components/themes/toko-bespoke/variants'

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
  // Restaurant "Lux" SELALU = renderer bespoke RestaurantLuxRenderer (keputusan
  // owner 2026-06-11): brief form non-toko kini menampilkan satu kartu Lux saja
  // (sub-kategori lama disembunyikan), variant = 'lux-restaurant'. Itu + jalur
  // finedining lama → bespoke. LUX_PALETTE tak punya 'lux-restaurant' → default 'aurum'.
  const isLux =
    b.tipe === 'restaurant' &&
    (b.subKategori === 'finedining' || (b.variant ?? '').startsWith('finedining-') || b.variant === 'lux-restaurant')

  // FLAGSHIP bespoke toko (Toko Atelier/Kuliner/…) → renderer bespoke via theme
  // key di registry SiteRenderer. Tabel TOKO_BESPOKE_VARIANTS (SSOT) memetakan id
  // ThemeOption brief → { theme key, palet variant native, sample imagery }.
  // Warna brand klien tetap jadi aksen via primary di renderer.
  // Sub-kategori fashion tanpa variant dikenal → Atelier noir (paritas jalur
  // isAtelier lama: fashion SELALU bespoke, tak boleh jatuh ke lux-toko).
  const bespoke =
    b.tipe === 'toko_online'
      ? (b.variant ? TOKO_BESPOKE_VARIANTS[b.variant] : undefined) ??
        (b.subKategori === 'fashion' ? TOKO_BESPOKE_VARIANTS['atelier-noir'] : undefined)
      : undefined

  // LUX TIER composable = DEFAULT premium per industri (Sprint 1 pilot:
  // restaurant + klinik). Bila briefing TIDAK memilih variant eksplisit →
  // variant = lux-<industri> → theme 'composable'. Pilihan eksplisit klien tetap
  // dihormati (escape hatch). Fine Dining bespoke (isLux, benchmark beku) menang
  // lebih dulu; migrasi default-nya ke composable lux = Sprint 3 pasca-parity.
  const LUX_DEFAULT: Record<string, string | undefined> = {
    restaurant: 'lux-restaurant',
    klinik: 'lux-klinik',
    // Sprint 2 — 9 industri tuntas (custom tetap generik/non-lux).
    corporate: 'lux-corporate',
    sekolah: 'lux-sekolah',
    toko_online: 'lux-toko',
    travel: 'lux-travel',
    personal: 'lux-personal',
    blog: 'lux-blog',
    jastip: 'lux-jastip',
  }

  const variant = bespoke
    ? bespoke.variant
    : isLux
      ? LUX_PALETTE[b.variant ?? ''] ?? 'aurum'
      : b.variant || LUX_DEFAULT[b.tipe] || defaultVariant(b.tipe)
  // Theme System: bila variant = id manifest composable (mis. 'kuliner-rustic'),
  // tandai theme 'composable' supaya SiteRenderer me-route ke ComposableRenderer.
  // Bespoke toko → theme key registry (mis. 'toko-atelier'/'toko-kuliner').
  // Fine Dining → 'restaurant-lux'. Selain itu jalur lama (theme per industri).
  const manifest = isLux || bespoke ? null : getManifest(variant)
  const theme = bespoke
    ? bespoke.theme
    : isLux
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
  const sample = bespoke
    ? sampleContentForTheme(bespoke.sample)
    : isLux
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

  // B-section: seed service "Reservasi Meja" bila booking aktif TAPI industri tak
  // menghasilkan service (resto pakai menu_items). Tanpa ini /[slug]/booking 404
  // (route gate services.length>0). Industri jasa (klinik/travel/dll) sudah punya.
  if (capabilities.includes('booking') && services.length === 0) {
    services.push({
      nama: 'Reservasi Meja',
      deskripsi: 'Pesan meja lebih dulu agar Anda tidak perlu menunggu saat tiba.',
      harga: 0,
      dp_amount: 0,
      kategori: 'Reservasi',
    })
  }

  // B-section: injeksi section struktural add-on (cross-industri; dedupe vs native).
  const sections = mergeAddonSections(out.sections, addonSectionBlueprints(order.selected_addons))

  const dataKonten: Record<string, unknown> = { ...out.dataKonten }
  // Foto hero/background dari brief form MENANG atas sample (situs selaras dgn
  // yang diisi klien). Sample hanya mengisi yang masih kosong (di bawah).
  if (b.heroImage && !dataKonten.foto_hero) dataKonten.foto_hero = b.heroImage
  // Titik fokus foto hero (object/background-position) dari brief form.
  if (b.heroImageFocus && !dataKonten.foto_hero_focus) dataKonten.foto_hero_focus = b.heroImageFocus
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
    sections,
    services,
    menuItems,
    products,
    tenantProfile,
    summary: {
      tipe: b.tipe,
      theme,
      variant,
      primary: b.primary,
      nSections: sections.length,
      nServices: services.length,
      nMenu: menuItems.length,
      nProducts: products.length,
    },
  }
}
