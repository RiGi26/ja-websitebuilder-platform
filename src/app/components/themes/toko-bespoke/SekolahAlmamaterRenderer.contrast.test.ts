import { describe, it, expect } from 'vitest'
import { PALETTES } from './SekolahAlmamaterRenderer'

// ============================================================
// WCAG contrast self-test — SekolahAlmamaterRenderer ALMAMATER (collegiate light)
// AA = 4.5:1 (teks normal) | AAA = 7:1 | large/UI = 3:1
// Aksen emas `accent` (#93722C) hanya untuk dekoratif & teks besar (rule, mark,
// dot nav) — teks normal beraksen (eyebrow/harga/angka) memakai `accentDeep`
// (#74571C). GOLD terang (#C9A24A) hanya dipakai DI ATAS navy (crest/footer/CTA),
// jadi tak diuji terhadap surface terang di sini.
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

describe('SekolahAlmamaterRenderer PALETTES — WCAG contrast', () => {
  for (const [name, p] of Object.entries(PALETTES)) {
    const LIGHT = [p.bg, p.bg2, p.surface, p.surface2]

    describe(`palette "${name}"`, () => {
      it('ink (navy) AAA (≥7:1) on all light surfaces', () => {
        for (const surf of LIGHT) {
          expect(cr(p.ink, surf), `ink on ${surf}`).toBeGreaterThanOrEqual(7)
        }
      })

      it('inkDim ≥4.5 on all light surfaces', () => {
        for (const surf of LIGHT) {
          expect(cr(p.inkDim, surf), `inkDim on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('muted ≥4.5 on all light surfaces (teks sekunder)', () => {
        for (const surf of LIGHT) {
          expect(cr(p.muted, surf), `muted on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('accentDeep ≥4.5 on all light surfaces (eyebrow/harga/teks aksen emas)', () => {
        for (const surf of LIGHT) {
          expect(cr(p.accentDeep, surf), `accentDeep on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('onAccent (krem) ≥4.5 on ink (tombol primary/nav/panel navy) + on accentDeep', () => {
        expect(cr(p.onAccent, p.ink)).toBeGreaterThanOrEqual(4.5)
        expect(cr(p.onAccent, p.accentDeep)).toBeGreaterThanOrEqual(4.5)
      })

      it('accent ≥3 on all light surfaces (dekoratif / teks besar SAJA, bukan teks normal)', () => {
        for (const surf of LIGHT) {
          expect(cr(p.accent, surf), `accent on ${surf}`).toBeGreaterThanOrEqual(3)
        }
      })
    })
  }
})
