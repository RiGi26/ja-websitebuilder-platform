import { describe, it, expect } from 'vitest'
import { PALETTES } from './KlinikWellnessRenderer'

// ============================================================
// WCAG contrast self-test — KlinikWellnessRenderer SANARA (calm healing)
// AA = 4.5:1 | AAA = 7:1 | large/UI = 3:1. Teal `accent` (#3E8378) dekoratif/teks
// besar; teks normal beraksen pakai `accentDeep` (#2C6359). Palet TUNGGAL (tanpa pop).
// ============================================================
function lum(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
function cr(a: string, b: string): number {
  const L1 = Math.max(lum(a), lum(b)), L2 = Math.min(lum(a), lum(b))
  return (L1 + 0.05) / (L2 + 0.05)
}
describe('KlinikWellnessRenderer PALETTES — WCAG contrast', () => {
  for (const [name, p] of Object.entries(PALETTES)) {
    const LIGHT = [p.bg, p.bg2, p.surface, p.surface2]
    describe(`palette "${name}"`, () => {
      it('ink AAA (≥7:1) on all light surfaces', () => { for (const s of LIGHT) expect(cr(p.ink, s), `ink on ${s}`).toBeGreaterThanOrEqual(7) })
      it('inkDim ≥4.5 on all light surfaces', () => { for (const s of LIGHT) expect(cr(p.inkDim, s), `inkDim on ${s}`).toBeGreaterThanOrEqual(4.5) })
      it('muted ≥4.5 on all light surfaces', () => { for (const s of LIGHT) expect(cr(p.muted, s), `muted on ${s}`).toBeGreaterThanOrEqual(4.5) })
      it('accentDeep ≥4.5 on all light surfaces', () => { for (const s of LIGHT) expect(cr(p.accentDeep, s), `accentDeep on ${s}`).toBeGreaterThanOrEqual(4.5) })
      it('onAccent ≥4.5 on accentDeep', () => { expect(cr(p.onAccent, p.accentDeep)).toBeGreaterThanOrEqual(4.5) })
      it('accent ≥3 on all light surfaces (dekoratif/teks besar)', () => { for (const s of LIGHT) expect(cr(p.accent, s), `accent on ${s}`).toBeGreaterThanOrEqual(3) })
    })
  }
})
