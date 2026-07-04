// ============================================================
// Tema rental varian "asphalt" (Asphalt Editorial — SetirYuk).
// Token bersama renderer (server) + fleet/wizard/status (client).
// Aksen = keluarga turunan dari satu hex brand (branding.primary) supaya bisa
// diganti dari data/panel tanpa deploy; default = oranye sinyal hasil mockup
// yang sudah di-approve owner (pasangan kontras AA dicek manual).
// ============================================================

export const FONT_IMPORT =
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Barlow:wght@400;500;600;700&display=swap'

export const FONT_DISPLAY = "'Barlow Condensed', Impact, sans-serif"
export const FONT_BODY = "'Barlow', system-ui, sans-serif"

// Permukaan & teks (identik dgn mockup theme-samples/setiryuk-mock.html).
export const PALETTE = {
  asphalt: '#14171C',
  asphalt2: '#1C2128',
  asphalt3: '#262C36',
  paper: '#F7F5F0',
  card: '#FFFFFF',
  ink: '#1A1D23',
  inkSoft: '#49525F',
  onDark: '#F4F6F9',
  onDarkMuted: '#A6AFBD',
  okBg: '#DCFCE7', okInk: '#166534',
  warnBg: '#FEF3C7', warnInk: '#92400E',
  errBg: '#FEE2E2', errInk: '#B91C1C',
  wa: '#1FAB55', waDark: '#128C4B',
} as const

export interface AccentFamily {
  base: string
  hover: string
  ink: string   // teks aksen di latar terang (AA)
  deep: string  // ujung gradasi CTA band
  soft: string
  glow: string
  beam: string  // sorot lampu hero
}

// Default = hasil tuning manual mockup (bukan turunan rumus) — approved owner.
export const DEFAULT_ACCENT = '#FF6B2C'
const DEFAULT_FAMILY: AccentFamily = {
  base: '#FF6B2C',
  hover: '#E85A1F',
  ink: '#C2410C',
  deep: '#9A3412',
  soft: 'rgba(255,107,44,.12)',
  glow: 'rgba(255,107,44,.32)',
  beam: 'rgba(255,190,130,.28)',
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h, s, l]
}

function hslToHex(h: number, s: number, l: number): string {
  const f = (n: number) => {
    const k = (n + h * 12) % 12
    const a = s * Math.min(l, 1 - l)
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(c * 255).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
}

/**
 * Keluarga aksen dari satu hex. `ink`/`deep` dipaksa cukup gelap (L ≤ 38%/26%)
 * supaya teks aksen di paper tetap ≥ AA apa pun warna brand-nya.
 */
export function deriveAccent(hex?: string | null): AccentFamily {
  if (!hex || hex.toUpperCase() === DEFAULT_ACCENT) return DEFAULT_FAMILY
  const rgb = hexToRgb(hex)
  if (!rgb) return DEFAULT_FAMILY
  const [r, g, b] = rgb
  const [h, s, l] = rgbToHsl(r, g, b)
  return {
    base: hslToHex(h, s, l),
    hover: hslToHex(h, s, Math.max(0.2, l - 0.08)),
    ink: hslToHex(h, Math.min(s, 0.85), Math.min(l, 0.38)),
    deep: hslToHex(h, Math.min(s, 0.8), Math.min(l, 0.26)),
    soft: `rgba(${r},${g},${b},.12)`,
    glow: `rgba(${r},${g},${b},.32)`,
    beam: `rgba(${r},${g},${b},.24)`,
  }
}

/** CSS custom properties keluarga aksen + palet — dipasang di root tema & halaman status. */
export function accentVars(fam: AccentFamily): Record<string, string> {
  return {
    '--ra-accent': fam.base,
    '--ra-accent-hover': fam.hover,
    '--ra-accent-ink': fam.ink,
    '--ra-accent-deep': fam.deep,
    '--ra-accent-soft': fam.soft,
    '--ra-accent-glow': fam.glow,
    '--ra-accent-beam': fam.beam,
  }
}

/** Kendaraan dari endpoint publik portal rental (GET /api/booking/[slug]/info). */
export interface PortalVehicle {
  id: string
  brand: string | null
  model: string | null
  type: string
  capacity: number
  year: number | null
  transmission: string | null
  fuel_type: string | null
  description: string | null
  photos: string[]
  price_per_day: number
}

export const SHADOW = {
  sm: '0 1px 3px rgba(16,20,26,.06), 0 1px 2px rgba(16,20,26,.04)',
  md: '0 4px 16px rgba(16,20,26,.08), 0 2px 6px rgba(16,20,26,.05)',
  lg: '0 12px 40px rgba(16,20,26,.14), 0 4px 12px rgba(16,20,26,.06)',
} as const

export const EASE = 'cubic-bezier(.16,1,.3,1)'

/** Format rupiah tanpa desimal: 350000 → "Rp350.000". */
export function rupiah(n: number): string {
  return `Rp${Math.round(n).toLocaleString('id-ID')}`
}

/** Link WA dari nomor bebas format (08…/62…) + pesan opsional. */
export function waLink(phone?: string | null, text?: string): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 9) return null
  const intl = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  return `https://wa.me/${intl}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
