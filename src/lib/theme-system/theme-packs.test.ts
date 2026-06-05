import { describe, it, expect } from 'vitest'
import { THEME_PACKS } from './theme-packs'
import { MANIFESTS, resolveManifestPack } from './manifest'

describe('theme-packs Kuliner (S1-1)', () => {
  it('punya 3 pack Kuliner otentik', () => {
    const keys = Object.keys(THEME_PACKS)
    expect(keys).toContain('kuliner-rustic')
    expect(keys).toContain('kuliner-modern')
    expect(keys).toContain('kuliner-heritage')
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

describe('theme-packs Fashion (S2-1)', () => {
  it('punya 3 pack Fashion otentik', () => {
    const keys = Object.keys(THEME_PACKS)
    expect(keys).toContain('fashion-editorial')
    expect(keys).toContain('fashion-minimal')
    expect(keys).toContain('fashion-vibrant')
  })

  it('tiap manifest Fashion resolve ke pack otentiknya', () => {
    expect(resolveManifestPack(MANIFESTS['fashion-editorial']).color.primary).toBe('#F2EFEA')
    expect(resolveManifestPack(MANIFESTS['fashion-minimal']).color.primary).toBe('#1C1B19')
    expect(resolveManifestPack(MANIFESTS['fashion-vibrant']).color.primary).toBe('#5B2BE8')
  })

  it('VARIASI WAJIB: 3 gaya rentang gelap↔terang, page & mood tak seragam', () => {
    const e = resolveManifestPack(MANIFESTS['fashion-editorial'])
    const m = resolveManifestPack(MANIFESTS['fashion-minimal'])
    const v = resolveManifestPack(MANIFESTS['fashion-vibrant'])
    expect(new Set([e.color.page, m.color.page, v.color.page]).size).toBe(3)
    expect(e.color.page).toBe('#0E0E0F') // editorial gelap
    expect(new Set([e.mood, m.mood, v.mood]).size).toBe(3)
    // distinct dari heritage Kuliner (bukan kloning maroon+gold)
    expect(e.color.primary).not.toBe(resolveManifestPack(MANIFESTS['kuliner-heritage']).color.primary)
  })
})
