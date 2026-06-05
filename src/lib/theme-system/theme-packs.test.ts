import { describe, it, expect } from 'vitest'
import { THEME_PACKS } from './theme-packs'
import { MANIFESTS, resolveManifestPack } from './manifest'

describe('theme-packs Kuliner (S1-1)', () => {
  it('punya 3 pack Kuliner otentik', () => {
    expect(Object.keys(THEME_PACKS)).toEqual([
      'kuliner-rustic',
      'kuliner-modern',
      'kuliner-heritage',
    ])
  })

  it('tiap manifest Kuliner resolve ke pack otentiknya (bukan pack generik lama)', () => {
    expect(resolveManifestPack(MANIFESTS['kuliner-rustic']).color.primary).toBe('#B5532A')
    expect(resolveManifestPack(MANIFESTS['kuliner-modern']).color.primary).toBe('#E2582B')
    expect(resolveManifestPack(MANIFESTS['kuliner-heritage']).color.primary).toBe('#C8A24B')
  })

  it('3 gaya beda karakter: page bg & mood tak seragam', () => {
    const r = resolveManifestPack(MANIFESTS['kuliner-rustic'])
    const m = resolveManifestPack(MANIFESTS['kuliner-modern'])
    const h = resolveManifestPack(MANIFESTS['kuliner-heritage'])
    const pages = new Set([r.color.page, m.color.page, h.color.page])
    expect(pages.size).toBe(3) // page bg ketiganya beda
    expect(h.color.page).toBe('#1A1011') // heritage gelap
    expect(new Set([r.mood, m.mood, h.mood]).size).toBe(3)
  })
})
