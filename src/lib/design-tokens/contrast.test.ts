import { describe, it, expect } from 'vitest'
import { PACKS, contrastRatio, type TokenPack } from './packs'
import { THEME_PACKS } from '@/lib/theme-system/theme-packs'

// Gate kontras token (WCAG 2.1). Menjaga keterbacaan di SEMUA pack — terutama
// `muted` di atas surface/page pada tema gelap (temuan audit visual Track A).
// Bar: teks normal ≥ 4.5:1; teks besar/tebal (heading hero, CTA on primary) ≥ 3:1.
const ALL: Record<string, TokenPack> = { ...PACKS, ...THEME_PACKS }

// Pasangan yang diperiksa: [nama, fg, bg, minRasio]
function pairs(p: TokenPack): [string, string, string, number][] {
  const c = p.color
  return [
    ['ink/page', c.ink, c.page, 4.5],
    ['ink/surface', c.ink, c.surface, 4.5],
    ['muted/page', c.muted, c.page, 4.5],
    ['muted/surface', c.muted, c.surface, 4.5],
    ['onPrimary/primary', c.onPrimary, c.primary, 3], // teks tombol = besar/tebal → AA large
    ['heroInk/heroFrom', c.heroInk, c.heroFrom, 4.5], // teks hero saat tanpa foto (gradient)
  ]
}

describe('Kontras token (WCAG 2.1) — semua pack', () => {
  it('setiap pasangan teks memenuhi rasio minimum', () => {
    const failures: string[] = []
    for (const [id, pack] of Object.entries(ALL)) {
      for (const [name, fg, bg, min] of pairs(pack)) {
        const ratio = contrastRatio(fg, bg)
        if (Number.isNaN(ratio)) continue // border rgba dll. dilewati
        if (ratio < min) failures.push(`${id} ${name}: ${ratio.toFixed(2)} < ${min} (${fg} on ${bg})`)
      }
    }
    expect(failures, `Pasangan gagal kontras:\n${failures.join('\n')}`).toEqual([])
  })
})
