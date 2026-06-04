// ============================================================
// Token-Pack System
// ------------------------------------------------------------
// Satu "token pack" = bahasa desain lengkap (palet + tipografi +
// radius + shadow + mood). Satu renderer token-driven + N pack =
// N tampilan, tanpa nulis renderer baru per variant.
//
// Variant yang dipilih klien di briefing → di-resolve ke token pack
// lewat REGISTRY. Warna brand klien (primary) menimpa pack.color.primary.
//
// Nama mood terinspirasi design-skill TypeUI (Clean, Premium, Bold,
// Cafe, Refined, dst) — nilainya kita definisikan sendiri (aman lisensi).
// ============================================================

export interface TokenPack {
  id: string
  label: string
  mood: 'clean' | 'luxury' | 'warm' | 'bold' | 'minimal'
  color: {
    page: string      // latar halaman
    surface: string   // latar kartu
    ink: string       // teks utama
    muted: string      // teks sekunder
    border: string     // garis tipis
    primary: string    // aksen brand (bisa ditimpa primary klien)
    onPrimary: string  // teks di atas primary
    heroFrom: string   // gradient hero — mulai
    heroTo: string     // gradient hero — akhir
    heroInk: string    // teks di hero
  }
  font: {
    display: string        // font-family heading (stack CSS)
    body: string           // font-family body
    displayWeight: number
    bodyWeight: number
    tracking: string       // letter-spacing heading
  }
  radius: { sm: string; md: string; lg: string; pill: string }
  shadow: { sm: string; md: string; lg: string }
  // F4 — arketipe LAYOUT (susunan, bukan sekadar warna/font).
  //  hero:     centered (default) | split (2-kolom editorial) | fullbleed (full-viewport)
  //  features: grid (kartu auto-fit) | rows (baris bernomor) | list (daftar garis tipis)
  //  pad:      normal | airy (whitespace lebih lega)
  //  align:    center | left (heading section & nav rhythm)
  layout: {
    hero: 'centered' | 'split' | 'fullbleed'
    features: 'grid' | 'rows' | 'list'
    pad: 'normal' | 'airy'
    align: 'center' | 'left'
  }
}

// ── Pack definitions ──────────────────────────────────────────
// Stack font pakai font sistem/generik supaya POC tidak bergantung
// pada next/font. Produksi bisa ganti ke font asli per pack.
const SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const SERIF = "'Iowan Old Style', Georgia, 'Times New Roman', serif"

export const PACKS: Record<string, TokenPack> = {
  'clean-modern': {
    id: 'clean-modern', label: 'Clean Modern', mood: 'clean',
    color: {
      page: '#FFFFFF', surface: '#F8FAFC', ink: '#0F172A', muted: '#5B6472',
      border: 'rgba(15,23,42,0.08)', primary: '#0EA5E9', onPrimary: '#FFFFFF',
      heroFrom: '#F8FAFC', heroTo: '#DBEAFE', heroInk: '#0F172A',
    },
    font: { display: SANS, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '12px', md: '20px', lg: '28px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.06)',
      md: '0 4px 16px rgba(0,0,0,.08)',
      lg: '0 20px 48px rgba(0,0,0,.10)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'luxury-navy': {
    id: 'luxury-navy', label: 'Luxury Navy', mood: 'luxury',
    color: {
      page: '#0B1220', surface: '#131C2E', ink: '#F1F5F9', muted: '#94A3B8',
      border: 'rgba(255,255,255,0.10)', primary: '#C8A24B', onPrimary: '#0B1220',
      heroFrom: '#0B1220', heroTo: '#1E293B', heroInk: '#FFFFFF',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 8px 28px rgba(0,0,0,.45)',
      lg: '0 30px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'split', features: 'rows', pad: 'airy', align: 'left' },
  },
  'warm-cafe': {
    id: 'warm-cafe', label: 'Warm Cafe', mood: 'warm',
    color: {
      page: '#FFFBF5', surface: '#FFFFFF', ink: '#1C1917', muted: '#78716C',
      border: 'rgba(28,25,23,0.08)', primary: '#B45309', onPrimary: '#FFFFFF',
      heroFrom: '#FFFBEB', heroTo: '#FDE68A', heroInk: '#1C1917',
    },
    font: { display: SERIF, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '16px', md: '24px', lg: '32px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(120,53,15,.08)',
      md: '0 6px 20px rgba(120,53,15,.12)',
      lg: '0 24px 50px rgba(120,53,15,.16)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'bold-energetic': {
    id: 'bold-energetic', label: 'Bold Energetic', mood: 'bold',
    color: {
      page: '#0C0A09', surface: '#1C1917', ink: '#FAFAF9', muted: '#A8A29E',
      border: 'rgba(255,255,255,0.10)', primary: '#EA580C', onPrimary: '#FFFFFF',
      heroFrom: '#1C0A00', heroTo: '#7C2D12', heroInk: '#FFFFFF',
    },
    font: { display: SANS, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '10px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.3)',
      md: '0 8px 28px rgba(234,88,12,.25)',
      lg: '0 24px 56px rgba(234,88,12,.30)',
    },
    layout: { hero: 'fullbleed', features: 'grid', pad: 'normal', align: 'left' },
  },
  'minimal-refined': {
    id: 'minimal-refined', label: 'Minimal Refined', mood: 'minimal',
    color: {
      page: '#FFFFFF', surface: '#FAFAFA', ink: '#18181B', muted: '#71717A',
      border: 'rgba(0,0,0,0.07)', primary: '#18181B', onPrimary: '#FFFFFF',
      heroFrom: '#FFFFFF', heroTo: '#F4F4F5', heroInk: '#18181B',
    },
    font: { display: SANS, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '8px', md: '14px', lg: '20px', pill: '9999px' },
    shadow: {
      sm: '0 1px 2px rgba(0,0,0,.04)',
      md: '0 2px 8px rgba(0,0,0,.05)',
      lg: '0 8px 24px rgba(0,0,0,.06)',
    },
    layout: { hero: 'centered', features: 'list', pad: 'airy', align: 'center' },
  },
}

export const DEFAULT_PACK_ID = 'clean-modern'

// Theme yang punya renderer bespoke sendiri (RentalRenderer dll) — biarkan
// pakai renderer-nya, JANGAN token-driven. Sisanya kandidat token-driven.
const BESPOKE_THEMES = new Set(['klinik', 'company', 'sekolah', 'restaurant', 'rental', 'batik_toko'])
export function isTokenDrivenTheme(theme?: string): boolean {
  return !theme || !BESPOKE_THEMES.has(theme)
}

// ── Registry: (theme:variant) → packId ────────────────────────
// Memetakan variant yang sudah dijanjikan di website-variants.ts ke
// token pack. Ini menutup gap "variant tak dirender" tanpa renderer baru.
export const VARIANT_PACK: Record<string, string> = {
  'klinik:warm': 'warm-cafe',
  'klinik:clean': 'clean-modern',
  'klinik:premium': 'luxury-navy',

  'rental:bold': 'bold-energetic',
  'rental:fresh': 'clean-modern',
  'rental:luxury': 'luxury-navy',

  'company:editorial': 'bold-energetic',
  'company:clean': 'clean-modern',
  'company:minimal': 'minimal-refined',

  'restaurant:rustic': 'warm-cafe',
  'restaurant:modern': 'luxury-navy',

  'sekolah:warm': 'warm-cafe',
  'sekolah:clean': 'clean-modern',

  'batik_toko:batik': 'warm-cafe',
  'batik_toko:modern': 'minimal-refined',
  'toko_online:batik': 'warm-cafe',
  'toko_online:modern': 'minimal-refined',

  'personal:minimal': 'minimal-refined',
  'personal:bold': 'bold-energetic',

  'custom:clean': 'clean-modern',
}

// ── Helpers ───────────────────────────────────────────────────
function clampHex(hex?: string): string | null {
  if (!hex) return null
  return /^#([0-9a-fA-F]{6})$/.test(hex) ? hex : null
}

// Pilih teks kontras (putih/gelap) untuk di atas warna primary klien.
function readableOn(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  // luminance relatif (perceptual)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.6 ? '#111111' : '#FFFFFF'
}

/**
 * Resolve token pack dari pilihan klien.
 * @param theme   konfig.branding.theme (mis. 'rental')
 * @param variant konfig.branding.variant (mis. 'luxury')
 * @param primary warna brand klien (opsional) — menimpa pack.color.primary
 */
export function resolveTokenPack(theme?: string, variant?: string, primary?: string): TokenPack {
  const key = `${theme ?? ''}:${variant ?? ''}`
  const base = PACKS[VARIANT_PACK[key]] ?? PACKS[DEFAULT_PACK_ID]

  const brand = clampHex(primary)
  if (!brand) return base

  // Override aksen dengan warna brand klien; sisanya tetap dari pack.
  return {
    ...base,
    color: { ...base.color, primary: brand, onPrimary: readableOn(brand) },
  }
}

// CSS custom properties dari pack — dipakai renderer via style scope.
export function packToCssVars(p: TokenPack): Record<string, string> {
  return {
    '--c-page': p.color.page,
    '--c-surface': p.color.surface,
    '--c-ink': p.color.ink,
    '--c-muted': p.color.muted,
    '--c-border': p.color.border,
    '--c-primary': p.color.primary,
    '--c-on-primary': p.color.onPrimary,
    '--c-hero-from': p.color.heroFrom,
    '--c-hero-to': p.color.heroTo,
    '--c-hero-ink': p.color.heroInk,
    '--f-display': p.font.display,
    '--f-body': p.font.body,
    '--fw-display': String(p.font.displayWeight),
    '--fw-body': String(p.font.bodyWeight),
    '--tracking': p.font.tracking,
    '--r-sm': p.radius.sm,
    '--r-md': p.radius.md,
    '--r-lg': p.radius.lg,
    '--r-pill': p.radius.pill,
    '--s-sm': p.shadow.sm,
    '--s-md': p.shadow.md,
    '--s-lg': p.shadow.lg,
  }
}
