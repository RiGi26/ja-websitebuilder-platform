// ============================================================
// GENERATED — jangan edit manual. Sumber: theme-sources/corporate-agency/index.html
// Contrast gate WCAG utk semua palet AgencyPosterRenderer (aturan tema LIGHT
// wajib contrast.test — DESIGN_LEDGER).
// ============================================================
import { describe, it, expect } from 'vitest'
import { PALETTES } from './AgencyPosterRenderer'

function chan(v: number): number {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}
function lum(hex: string): number {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h
  const n = parseInt(full.slice(0, 6), 16)
  return 0.2126 * chan((n >> 16) & 255) + 0.7152 * chan((n >> 8) & 255) + 0.0722 * chan(n & 255)
}
function cr(a: string, b: string): number {
  const L1 = Math.max(lum(a), lum(b))
  const L2 = Math.min(lum(a), lum(b))
  return (L1 + 0.05) / (L2 + 0.05)
}

const SURFACES = ['bg', 'bg2', 'surface'] as const

describe('AgencyPosterRenderer PALETTES — WCAG contrast', () => {
  for (const [name, p] of Object.entries(PALETTES)) {
    describe(`palet "${name}"`, () => {
      it('ink AAA (>=7) di semua permukaan', () => { for (const s of SURFACES) expect(cr(p.ink, p[s])).toBeGreaterThanOrEqual(7) })
      it('inkDim AA (>=4.5) di semua permukaan', () => { for (const s of SURFACES) expect(cr(p.inkDim, p[s])).toBeGreaterThanOrEqual(4.5) })
      it('muted AA (>=4.5) di semua permukaan', () => { for (const s of SURFACES) expect(cr(p.muted, p[s])).toBeGreaterThanOrEqual(4.5) })
      it('accentDeep AA (>=4.5) di semua permukaan', () => { for (const s of SURFACES) expect(cr(p.accentDeep, p[s])).toBeGreaterThanOrEqual(4.5) })
      it('onAccent AA (>=4.5) di atas accentDeep (bg tombol solid)', () => { expect(cr(p.onAccent, p.accentDeep)).toBeGreaterThanOrEqual(4.5) })
    })
  }
})
