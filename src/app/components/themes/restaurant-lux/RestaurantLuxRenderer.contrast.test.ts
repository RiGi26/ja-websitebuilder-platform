import { describe, it, expect } from 'vitest'
import { PALETTES } from './RestaurantLuxRenderer'

// ============================================================
// WCAG contrast self-test — RestaurantLuxRenderer (warm-dark luxury)
// AA = 4.5:1 (teks normal) | AAA = 7:1 | large/UI = 3:1
// Ketiga palet (aurum/noir/hearth) kini ditawarkan sebagai style knob
// (registry design.palettes) → wajib ber-gate kontras. Semua teks duduk di
// permukaan gelap (bg/bg2/surface); aksen dipakai utk eyebrow (teks kecil)
// dan tombol emas membawa teks gelap #16120A (.rl-btn-gold).
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

// Teks gelap tombol emas — hard-coded di renderer (.rl-btn-gold color:#16120A).
const BTN_TEXT = '#16120A'

describe('RestaurantLuxRenderer PALETTES — WCAG contrast', () => {
  for (const [name, p] of Object.entries(PALETTES)) {
    const DARKS = [p.bg, p.bg2, p.surface]

    describe(`palette "${name}"`, () => {
      it('ink AAA (≥7:1) on all dark surfaces', () => {
        for (const surf of DARKS) {
          expect(cr(p.ink, surf), `ink on ${surf}`).toBeGreaterThanOrEqual(7)
        }
      })

      it('inkDim ≥4.5 on all dark surfaces', () => {
        for (const surf of DARKS) {
          expect(cr(p.inkDim, surf), `inkDim on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('muted ≥4.5 on all dark surfaces (teks sekunder)', () => {
        for (const surf of DARKS) {
          expect(cr(p.muted, surf), `muted on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('accent ≥4.5 on all dark surfaces (eyebrow = teks kecil beraksen)', () => {
        for (const surf of DARKS) {
          expect(cr(p.accent, surf), `accent on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('teks tombol emas ≥4.5 on accent (.rl-btn-gold)', () => {
        expect(cr(BTN_TEXT, p.accent)).toBeGreaterThanOrEqual(4.5)
      })
    })
  }
})
