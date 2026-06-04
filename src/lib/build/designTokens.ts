// ============================================================
// Derivasi design_tokens + variant default per industri.
// Port "LANGKAH 2B — DESIGN REFINEMENT" dari skill build-order ke kode
// deterministik (nol-opex, tanpa LLM). Lihat [[project-ja-wb-upgrade-plan]].
// ============================================================
import type { DesignTokens, TipeIndustri } from '@/types/websitebuilder'

type TokenBase = Required<Pick<DesignTokens, 'visual_mood' | 'bg_style' | 'typography_weight' | 'hero_style'>>

// Karakter visual default per industri (dari tabel contoh di skill).
const TOKENS_BY_TIPE: Record<TipeIndustri, TokenBase> = {
  travel:      { visual_mood: 'energetic',     bg_style: 'dark',  typography_weight: 'black',   hero_style: 'immersive' },
  restaurant:  { visual_mood: 'warm',          bg_style: 'warm',  typography_weight: 'bold',    hero_style: 'immersive' },
  corporate:   { visual_mood: 'authoritative', bg_style: 'dark',  typography_weight: 'bold',    hero_style: 'split' },
  klinik:      { visual_mood: 'warm',          bg_style: 'light', typography_weight: 'regular', hero_style: 'split' },
  sekolah:     { visual_mood: 'warm',          bg_style: 'light', typography_weight: 'bold',    hero_style: 'centered' },
  toko_online: { visual_mood: 'playful',       bg_style: 'light', typography_weight: 'bold',    hero_style: 'centered' },
  personal:    { visual_mood: 'minimal',       bg_style: 'light', typography_weight: 'regular', hero_style: 'centered' },
  blog:        { visual_mood: 'minimal',       bg_style: 'light', typography_weight: 'regular', hero_style: 'centered' },
  jastip:      { visual_mood: 'warm',          bg_style: 'light', typography_weight: 'bold',    hero_style: 'centered' },
  custom:      { visual_mood: 'minimal',       bg_style: 'light', typography_weight: 'regular', hero_style: 'centered' },
}

// Variant default (poin pertama tiap industri) — dipakai kalau briefing kosong.
const DEFAULT_VARIANT: Partial<Record<TipeIndustri, string>> = {
  klinik: 'warm',
  travel: 'bold',
  corporate: 'editorial',
  restaurant: 'rustic',
  sekolah: 'warm',
  toko_online: 'batik',
}

export function defaultVariant(tipe: TipeIndustri): string | undefined {
  return DEFAULT_VARIANT[tipe]
}

// ── util hex ───────────────────────────────────────────────────
type RGB = { r: number; g: number; b: number }
const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))

function parseHex(hex: string): RGB | null {
  const h = hex.replace('#', '').trim()
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}
const toHex = ({ r, g, b }: RGB) =>
  '#' + [r, g, b].map((x) => clamp(x).toString(16).padStart(2, '0')).join('')
const luminance = ({ r, g, b }: RGB) => (0.299 * r + 0.587 * g + 0.114 * b) / 255
const mix = (c: RGB, t: RGB, amt: number): RGB => ({
  r: c.r + (t.r - c.r) * amt,
  g: c.g + (t.g - c.g) * amt,
  b: c.b + (t.b - c.b) * amt,
})

// accent_secondary: primary gelap -> versi lebih terang; primary cerah -> lebih dalam.
export function accentSecondary(primary?: string): string | undefined {
  if (!primary) return undefined
  const c = parseHex(primary)
  if (!c) return undefined
  const lum = luminance(c)
  return lum < 0.5
    ? toHex(mix(c, { r: 255, g: 255, b: 255 }, 0.45)) // terangkan
    : toHex(mix(c, { r: 0, g: 0, b: 0 }, 0.25)) // dalamkan
}

export function deriveDesignTokens(tipe: TipeIndustri, primary?: string): DesignTokens {
  const base = TOKENS_BY_TIPE[tipe] ?? TOKENS_BY_TIPE.custom
  const accent = accentSecondary(primary)
  return { ...base, ...(accent ? { accent_secondary: accent } : {}) }
}
