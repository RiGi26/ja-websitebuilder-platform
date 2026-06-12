// ============================================================
// TOKO-KULINER — gate kontras WCAG. PALETTES bespoke tak lewat scan TokenPack
// global → self-test ini menjaganya (pola toko-atelier.contrast.test.ts).
// Ambang: teks utama 7:1 (AAA), teks sekunder/label/aksen kecil 4.5:1 (AA).
// ============================================================
import { describe, it, expect } from 'vitest'
import { contrastRatio } from '@/lib/design-tokens/packs'
import { PALETTES } from './KulinerLuxRenderer'

const SURFACES: (keyof (typeof PALETTES)[string])[] = ['bg', 'bg2', 'surface']

describe('toko-kuliner — kontras palet', () => {
  for (const [name, pal] of Object.entries(PALETTES)) {
    it(`${name}: ink AAA di semua permukaan`, () => {
      for (const s of SURFACES) {
        expect(contrastRatio(pal.ink, pal[s]), `ink vs ${s}`).toBeGreaterThanOrEqual(7)
      }
    })

    it(`${name}: inkDim & muted ≥ 4.5 di semua permukaan`, () => {
      for (const s of SURFACES) {
        expect(contrastRatio(pal.inkDim, pal[s]), `inkDim vs ${s}`).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(pal.muted, pal[s]), `muted vs ${s}`).toBeGreaterThanOrEqual(4.5)
      }
    })

    it(`${name}: aksen terbaca sebagai teks kecil (eyebrow/harga) di semua permukaan`, () => {
      for (const s of SURFACES) {
        expect(contrastRatio(pal.accent, pal[s]), `accent vs ${s}`).toBeGreaterThanOrEqual(4.5)
      }
    })

    it(`${name}: teks tombol solid (onAccent di atas accent) ≥ 4.5`, () => {
      expect(contrastRatio(pal.onAccent, pal.accent)).toBeGreaterThanOrEqual(4.5)
    })

    it(`${name}: teks putih hero/CTA di atas scrim gelap ≥ 7`, () => {
      expect(contrastRatio('#FFFFFF', pal.scrim)).toBeGreaterThanOrEqual(7)
    })
  }
})
