import { describe, it, expect } from 'vitest'
import { PALETTES } from './KerajinanLuxRenderer'

// ============================================================
// WCAG contrast self-test — KerajinanLuxRenderer TANAH LOKA
// AA = 4.5:1 (normal text) | AAA = 7:1
// ============================================================

function lum(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function cr(a: string, b: string): number {
  const L1 = Math.max(lum(a), lum(b))
  const L2 = Math.min(lum(a), lum(b))
  return (L1 + 0.05) / (L2 + 0.05)
}

describe('KerajinanLuxRenderer PALETTES — WCAG contrast', () => {
  for (const [name, p] of Object.entries(PALETTES)) {
    const LIGHT = [p.bg, p.bg2, p.surface]

    describe(`palette "${name}"`, () => {
      it('ink AAA (≥7:1) on all light surfaces', () => {
        for (const surf of LIGHT) {
          expect(cr(p.ink, surf), `ink on ${surf}`).toBeGreaterThanOrEqual(7)
        }
      })

      it('inkDim ≥4.5 on all light surfaces', () => {
        for (const surf of LIGHT) {
          expect(cr(p.inkDim, surf), `inkDim on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('muted ≥4.5 on all light surfaces', () => {
        for (const surf of LIGHT) {
          expect(cr(p.muted, surf), `muted on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('accent (forest) ≥4.5 on all light surfaces (eyebrow/price text)', () => {
        for (const surf of LIGHT) {
          expect(cr(p.accent, surf), `accent on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('onAccent (parchment) AAA on accent (forest) — hero/about text', () => {
        expect(cr(p.onAccent, p.accent)).toBeGreaterThanOrEqual(7)
      })

      it('gold ≥4.5 on accent (forest) — eyebrow/cta on dark sections', () => {
        expect(cr(p.gold, p.accent)).toBeGreaterThanOrEqual(4.5)
      })

      it('#FFFFFF AAA (≥7:1) on scrim', () => {
        expect(cr('#FFFFFF', p.scrim)).toBeGreaterThanOrEqual(7)
      })
    })
  }
})
