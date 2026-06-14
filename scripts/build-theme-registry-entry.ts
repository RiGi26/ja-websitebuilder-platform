// ============================================================
// FASE 1 (PREVIEW_MODEL_ANALYSIS.md §9.2) — generator `theme-registry.json`.
//
// Membaca SUMBER KEBENARAN data tema (taxonomy: INDUSTRY_SUBKATEGORI + THEMES,
// variants: BESPOKE_VARIANTS) → emit registry yang dikonsumsi galeri "Model B"
// di konfigurator CORP (/seluruh-layanan). Bentuk = PREVIEW_MODEL_ANALYSIS §5.
//
// GERBANG KEJUJURAN: sebuah tema hanya berstatus `live` bila id-nya terdaftar di
// BESPOKE_VARIANTS (atau = restaurant-lux) DAN ketiga screenshot
// `theme-samples/<id>-{mobile,tablet,desktop}.png` ada. Tanpa screenshot →
// `live-noshot` (kartu nama+swatch+microcopy tanpa gambar). Sub-kat `ready:false`
// → di-exclude (tak pernah ditawarkan yg WB tak bangun).
//
// SENGAJA TIDAK meng-import registry.ts (BESPOKE_RENDERERS): file itu meng-import
// komponen React renderer ('use client') → tak bisa dijalankan di node. Data yang
// dibutuhkan (themeId→themeKey) seluruhnya ada di variants.ts. `restaurant-lux`
// (di luar BESPOKE_VARIANTS, punya jalur isLux sendiri) ditangani sbg entry eksplisit.
//
// DIJALANKAN via tsc→run-gen.cjs (BUKAN .mjs): node tak bisa import `.ts` langsung
// & esbuild/vitest crash di sandbox Windows (winmm). Pola identik gen-rumah-entry.
//   npx tsc -p scripts/tsconfig.gen-theme-registry.json
//   node scripts/run-gen.cjs .tmp-gen-registry .tmp-gen-registry/scripts/build-theme-registry-entry.js
// npm: `npm run build:theme-registry` (rangkai tsc + node + cleanup).
// ============================================================
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { INDUSTRY_SUBKATEGORI, THEMES } from '../src/lib/theme-system/taxonomy'
import type { ThemeBg } from '../src/lib/theme-system/taxonomy'
import { BESPOKE_VARIANTS } from '../src/app/components/themes/toko-bespoke/variants'
import type { TipeIndustri } from '../src/types/websitebuilder'

const SAMPLES_DIR = 'theme-samples'
const OUT_PATH = `${SAMPLES_DIR}/theme-registry.json`
const VIEWPORTS = ['mobile', 'tablet', 'desktop'] as const

type Status = 'live' | 'live-noshot' | 'coming-soon'
interface ViewportThumbs {
  mobile: string
  tablet: string
  desktop: string
}
interface ThemePreviewEntry {
  themeId: string
  themeKey: string
  subKategori: string
  subKategoriNama: string
  nama: string
  deskripsi: string
  mood: string
  bg: ThemeBg
  icon: string
  status: Status
  thumbs: ViewportThumbs | null
  liveDemoUrl?: string
  /** INTERNAL (WB-only): id file PNG di theme-samples/ (≠ themeId utk tema legacy).
   *  Dialirkan ke sync-corp-preview.mjs, di-STRIP sebelum ditulis ke registry CORP. */
  _shootId?: string
}
interface SubKategoriGroup {
  id: string
  nama: string
  icon: string
  themes: ThemePreviewEntry[]
}
interface IndustryPreview {
  tipe: string
  corpLabels: string[]
  hasReadyThemes: boolean
  subKategori: SubKategoriGroup[]
  fallback: { tagline: string; mockupGradient: string; sections: string[]; emoji: string }
}
type ThemeRegistry = Record<string, IndustryPreview>

// corpLabels per D1 (PREVIEW_MODEL_ANALYSIS §9.1): nama tile CORP yg routing ke
// TipeIndustri ini. "Kuliner & Makanan" → toko_online/kuliner (perbaikan bug);
// "Website Restaurant" → restaurant (resto/dine-in → restaurant-lux).
const CORP_LABELS: Partial<Record<string, string[]>> = {
  toko_online: ['Toko Online', 'Kuliner & Makanan'],
  restaurant: ['Website Restaurant'],
}

// Preview "wakil" per industri — dipakai CORP saat galeri tak bisa dirender
// (mis. semua tema masih noshot). Senada TEMPLATE_PREVIEWS lama, di-generate di
// sini agar CORP tak perlu hardcode untuk industri yg sudah punya tema.
const FALLBACK: Partial<Record<string, IndustryPreview['fallback']>> = {
  toko_online: {
    tagline: 'Toko online siap terima order & pembayaran 24/7',
    mockupGradient: 'from-orange-800 to-red-900',
    sections: ['Hero + Promo', 'Katalog Produk', 'Keranjang', 'Checkout', 'Riwayat Order'],
    emoji: '🛍️',
  },
  restaurant: {
    tagline: 'Menu digital sinematik yang menggugah selera',
    mockupGradient: 'from-amber-800 to-orange-900',
    sections: ['Hero Foto Makanan', 'Menu Digital', 'Reservasi Meja', 'Promo', 'Lokasi & Maps'],
    emoji: '🍜',
  },
}
const DEFAULT_FALLBACK: IndustryPreview['fallback'] = {
  tagline: '',
  mockupGradient: 'from-slate-800 to-slate-900',
  sections: [],
  emoji: '🌐',
}

/** URL publik webp di repo CORP. sync-corp-preview.mjs memateri PNG→webp ke path persis ini. */
function thumbUrls(tipe: string, subkat: string, themeId: string): ViewportThumbs {
  const base = `/theme-previews/${tipe}/${subkat}/${themeId}`
  return { mobile: `${base}-mobile.webp`, tablet: `${base}-tablet.webp`, desktop: `${base}-desktop.webp` }
}

// Tema lama ter-shot dgn id sampel ≠ themeId (mis. Atelier noir = `toko-atelier`).
// Peta ini memetakan themeId → id file PNG di theme-samples/ supaya shot lama
// dikenali tanpa re-shoot. Default (tak terdaftar) = themeId. Tema bespoke baru
// SELALU di-shot per themeId (kuliner-tungku, gadget-onyx, dll) → tak perlu entri.
const SHOOT_ID: Partial<Record<string, string>> = {
  'atelier-noir': 'toko-atelier',
  'atelier-ivoire': 'toko-atelier-ivoire',
}

function hasAllShots(shootId: string): boolean {
  return VIEWPORTS.every((vp) => existsSync(`${SAMPLES_DIR}/${shootId}-${vp}.png`))
}

const registry: ThemeRegistry = {}

// ── Industri ber-sub-kategori (data-driven dari taxonomy) ──────────────────
for (const [tipeStr, subs] of Object.entries(INDUSTRY_SUBKATEGORI)) {
  if (!subs) continue
  const tipe = tipeStr as TipeIndustri
  const groups: SubKategoriGroup[] = []

  for (const sub of subs) {
    if (!sub.ready) continue // gerbang kejujuran: tak tawarkan yg belum siap
    const themeOpts = THEMES[tipe]?.[sub.id] ?? []
    const themes: ThemePreviewEntry[] = []

    for (const t of themeOpts) {
      const v = BESPOKE_VARIANTS[t.id]
      if (!v) continue // hanya tema bespoke sellable (intercept generateContent)
      const shootId = SHOOT_ID[t.id] ?? t.id
      const shot = hasAllShots(shootId)
      themes.push({
        themeId: t.id,
        themeKey: v.theme,
        subKategori: sub.id,
        subKategoriNama: sub.nama,
        nama: t.nama,
        deskripsi: t.deskripsi,
        mood: t.mood,
        bg: t.bg,
        icon: t.icon,
        status: shot ? 'live' : 'live-noshot',
        thumbs: shot ? thumbUrls(tipeStr, sub.id, t.id) : null,
        _shootId: shootId,
      })
    }

    if (themes.length) groups.push({ id: sub.id, nama: sub.nama, icon: sub.icon, themes })
  }

  if (groups.length) {
    registry[tipeStr] = {
      tipe: tipeStr,
      corpLabels: CORP_LABELS[tipeStr] ?? [],
      hasReadyThemes: groups.some((g) => g.themes.some((t) => t.status !== 'coming-soon')),
      subKategori: groups,
      fallback: FALLBACK[tipeStr] ?? DEFAULT_FALLBACK,
    }
  }
}

// ── restaurant-lux — entry EKSPLISIT (di luar BESPOKE_VARIANTS, jalur isLux) ──
{
  const tipe = 'restaurant'
  const subkat = 'finedining'
  const themeId = 'restaurant-lux'
  const shootId = SHOOT_ID[themeId] ?? themeId
  const shot = hasAllShots(shootId)
  const entry: ThemePreviewEntry = {
    themeId,
    themeKey: 'restaurant-lux',
    subKategori: subkat,
    subKategoriNama: 'Fine Dining',
    nama: 'Lux',
    deskripsi:
      'Sinematik gelap-mewah beraksen emas, menu sebagai panggung. Untuk fine dining, omakase, chef table.',
    mood: '#C9A24A',
    bg: 'dark',
    icon: 'Wine',
    status: shot ? 'live' : 'live-noshot',
    thumbs: shot ? thumbUrls(tipe, subkat, themeId) : null,
    _shootId: shootId,
  }
  const group: SubKategoriGroup = { id: subkat, nama: 'Fine Dining', icon: 'UtensilsCrossed', themes: [entry] }
  const existing = registry[tipe]
  if (existing) {
    existing.subKategori.unshift(group)
    existing.hasReadyThemes = true
  } else {
    registry[tipe] = {
      tipe,
      corpLabels: CORP_LABELS[tipe] ?? [],
      hasReadyThemes: true,
      subKategori: [group],
      fallback: FALLBACK[tipe] ?? DEFAULT_FALLBACK,
    }
  }
}

// ── Emit + ringkasan ──────────────────────────────────────────────────────
mkdirSync(SAMPLES_DIR, { recursive: true })
writeFileSync(OUT_PATH, JSON.stringify(registry, null, 2) + '\n')

let total = 0
let live = 0
const lines: string[] = []
for (const ip of Object.values(registry)) {
  for (const g of ip.subKategori) {
    for (const t of g.themes) {
      total++
      if (t.status === 'live') live++
      lines.push(`  ${ip.tipe}/${g.id}/${t.themeId} → ${t.status}`)
    }
  }
}
console.log(`ok ${OUT_PATH} — ${Object.keys(registry).length} industri, ${total} tema (${live} live, ${total - live} live-noshot)`)
console.log(lines.join('\n'))
