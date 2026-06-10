// ============================================================
// TOKO-ATELIER — gate kontras WCAG (Sprint 4).
// contrast.test.ts global hanya memindai TokenPacks; PALETTES flagship
// bespoke tidak lewat jalur itu → self-test ini menjaganya.
// Ambang: teks utama 7:1 (AAA), teks sekunder/label kecil 4.5:1 (AA).
// Aksen dipakai sebagai TEKS kecil (eyebrow 11px) → wajib 4.5, bukan 3.
// ============================================================
import { describe, it, expect } from 'vitest'
import { contrastRatio } from '@/lib/design-tokens/packs'
import { PALETTES } from './TokoAtelierRenderer'

const SURFACES: (keyof (typeof PALETTES)[string])[] = ['bg', 'bg2', 'surface']

describe('toko-atelier — kontras palet', () => {
  for (const [name, pal] of Object.entries(PALETTES)) {
    it(`${name}: ink AAA di semua permukaan`, () => {
      for (const s of SURFACES) {
        expect(contrastRatio(pal.ink, pal[s]), `ink vs ${s}`).toBeGreaterThanOrEqual(7)
      }
    })

    it(`${name}: inkDim & muted ≥ 4.5 (teks sekunder/label) di semua permukaan`, () => {
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
      // scrim band CTA/hero turun ke ~#0d0b09 — putih harus tetap AAA
      expect(contrastRatio('#FFFFFF', pal.bg)).toBeGreaterThanOrEqual(7)
    })
  }
})
