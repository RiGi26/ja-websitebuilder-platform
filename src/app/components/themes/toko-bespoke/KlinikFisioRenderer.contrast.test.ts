import { describe, it, expect } from 'vitest'
import { PALETTES } from './KlinikFisioRenderer'

// ============================================================
// WCAG contrast self-test — KlinikFisioRenderer "GERAK" (athletic teal + orange pop)
// AA = 4.5:1 (teks normal) | AAA = 7:1 | large/UI = 3:1
//
// Dwi-warna teal+oranye DENGAN pop (beda dari klinik-umum/estetik/wellness yang palet
// tunggal). Kontrak warna tema ini:
//   • Teks baca (body/heading/sekunder) → ink / inkDim / muted di atas surface terang.
//   • Teks aksen normal (eyebrow/kategori/band) → accentDeep (teal tua).
//   • Isi-tombol TEAL → onAccent (putih) di atas accentDeep / accent.
//   • Isi-tombol ORANYE (CTA Booking) → teks INK (gelap) di atas pop / popDeep.
//     Oranye #F39C12 ≤2.2:1 sbg foreground terang di latar terang → TIDAK PERNAH dipakai
//     sebagai teks. Hanya sbg: isi-tombol (di bawah teks ink), dekoratif non-teks
//     (dot/bintang/ring), atau aksen logotype (dikecualikan WCAG 1.4.3). Karena itu
//     pop/popDeep TIDAK di-assert sebagai teks di sini — by design.
//   Tema LIGHT → wajib gate ini.
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

describe('KlinikFisioRenderer PALETTES — WCAG contrast', () => {
  for (const [name, p] of Object.entries(PALETTES)) {
    const LIGHT = [p.bg, p.bg2, p.surface, p.surface2]

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

      it('muted ≥4.5 on all light surfaces (teks sekunder)', () => {
        for (const surf of LIGHT) {
          expect(cr(p.muted, surf), `muted on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('accentDeep ≥4.5 on all light surfaces (eyebrow/kategori/band/ghost-btn)', () => {
        for (const surf of LIGHT) {
          expect(cr(p.accentDeep, surf), `accentDeep on ${surf}`).toBeGreaterThanOrEqual(4.5)
        }
      })

      it('onAccent ≥4.5 on teal fills (accentDeep & accent — tombol/hover/avatar)', () => {
        expect(cr(p.onAccent, p.accentDeep), 'onAccent on accentDeep').toBeGreaterThanOrEqual(4.5)
        expect(cr(p.onAccent, p.accent), 'onAccent on accent').toBeGreaterThanOrEqual(4.5)
      })

      it('ink ≥4.5 on orange fills (CTA Booking — teks gelap di pop & popDeep)', () => {
        expect(cr(p.ink, p.pop), 'ink on pop').toBeGreaterThanOrEqual(4.5)
        expect(cr(p.ink, p.popDeep), 'ink on popDeep').toBeGreaterThanOrEqual(4.5)
      })

      it('accent ≥3 on all light surfaces (dekoratif / teks besar SAJA, bukan teks normal)', () => {
        for (const surf of LIGHT) {
          expect(cr(p.accent, surf), `accent on ${surf}`).toBeGreaterThanOrEqual(3)
        }
      })
    })
  }
})
