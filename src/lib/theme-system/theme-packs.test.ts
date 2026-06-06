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

// ── Replikasi 6 sub-kategori (Kerajinan…Anak) ────────────────
const SUBKAT_PACKS: Record<string, string[]> = {
  kerajinan: ['kerajinan-pusaka', 'kerajinan-tenun', 'kerajinan-galeri'],
  kecantikan: ['kecantikan-blush', 'kecantikan-glow', 'kecantikan-noir'],
  gadget: ['gadget-onyx', 'gadget-studio', 'gadget-neon'],
  rumah: ['rumah-natural', 'rumah-japandi', 'rumah-walnut'],
  herbal: ['herbal-daun', 'herbal-jamu', 'herbal-botani'],
  anak: ['anak-pastel', 'anak-ceria', 'anak-pop'],
}

describe('theme-packs replikasi 6 sub-kategori', () => {
  for (const [sub, ids] of Object.entries(SUBKAT_PACKS)) {
    it(`${sub}: 3 pack ada + resolve ke pack-nya sendiri`, () => {
      for (const id of ids) {
        expect(Object.keys(THEME_PACKS)).toContain(id)
        // manifest dgn id sama resolve ke pack otentik (bukan fallback generik)
        expect(resolveManifestPack(MANIFESTS[id]).id).toBe(id)
      }
    })

    it(`${sub}: VARIASI WAJIB — page bg & mood ke-3 gaya tak seragam`, () => {
      const packs = ids.map((id) => resolveManifestPack(MANIFESTS[id]))
      expect(new Set(packs.map((p) => p.color.page)).size).toBe(3)
      expect(new Set(packs.map((p) => p.mood)).size).toBe(3)
    })
  }

  it('rentang gelap↔terang: Kerajinan/Kecantikan/Gadget/Rumah/Herbal punya min. 1 gaya gelap', () => {
    const darkPages = ['kerajinan-pusaka', 'kecantikan-noir', 'gadget-onyx', 'rumah-walnut', 'herbal-botani']
    for (const id of darkPages) {
      const page = resolveManifestPack(MANIFESTS[id]).color.page.toLowerCase()
      // gelap = komponen pertama hex rendah (mis. #0..#2..)
      expect(['#0', '#1', '#2'].some((p) => page.startsWith(p))).toBe(true)
    }
  })
})

// ── Restaurant (Sprint 4) — 3 sub-kategori × 3 gaya ──────────
const RESTO_PACKS: Record<string, string[]> = {
  warung: ['warung-rakyat', 'warung-sambal', 'warung-angkringan'],
  cafe: ['cafe-latte', 'cafe-roastery', 'cafe-bloom'],
  finedining: ['finedining-aurum', 'finedining-hearth', 'finedining-nordic'],
}

describe('theme-packs restaurant (S4)', () => {
  for (const [sub, ids] of Object.entries(RESTO_PACKS)) {
    it(`${sub}: 3 pack ada + manifest resolve ke pack otentiknya`, () => {
      for (const id of ids) {
        expect(Object.keys(THEME_PACKS)).toContain(id)
        expect(resolveManifestPack(MANIFESTS[id]).id).toBe(id)
      }
    })

    it(`${sub}: VARIASI WAJIB — page bg & mood ke-3 gaya tak seragam`, () => {
      const packs = ids.map((id) => resolveManifestPack(MANIFESTS[id]))
      expect(new Set(packs.map((p) => p.color.page)).size).toBe(3)
      expect(new Set(packs.map((p) => p.mood)).size).toBe(3)
    })

    it(`${sub}: punya minimal 1 gaya gelap`, () => {
      const hasDark = ids.some((id) => {
        const page = resolveManifestPack(MANIFESTS[id]).color.page.toLowerCase()
        return ['#0', '#1', '#2'].some((p) => page.startsWith(p))
      })
      expect(hasDark).toBe(true)
    })
  }

  it('semua hex page valid 6-digit (anti-typo)', () => {
    for (const ids of Object.values(RESTO_PACKS)) {
      for (const id of ids) {
        const c = resolveManifestPack(MANIFESTS[id]).color
        for (const hex of [c.page, c.surface, c.primary, c.heroFrom, c.heroTo, c.heroInk]) {
          expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/)
        }
      }
    }
  })
})

// ── Klinik (Sprint 6) — 3 sub-kategori × 3 gaya ──────────────
const KLINIK_PACKS: Record<string, string[]> = {
  umum: ['umum-bluecare', 'umum-freshteal', 'umum-trustnavy'],
  estetik: ['estetik-rosegold', 'estetik-derma', 'estetik-noir'],
  wellness: ['wellness-sage', 'wellness-terra', 'wellness-forest'],
}

describe('theme-packs klinik (S6)', () => {
  for (const [sub, ids] of Object.entries(KLINIK_PACKS)) {
    it(`${sub}: 3 pack ada + manifest resolve ke pack otentiknya`, () => {
      for (const id of ids) {
        expect(Object.keys(THEME_PACKS)).toContain(id)
        expect(resolveManifestPack(MANIFESTS[id]).id).toBe(id)
      }
    })

    it(`${sub}: VARIASI WAJIB — page bg & mood ke-3 gaya tak seragam`, () => {
      const packs = ids.map((id) => resolveManifestPack(MANIFESTS[id]))
      expect(new Set(packs.map((p) => p.color.page)).size).toBe(3)
      expect(new Set(packs.map((p) => p.mood)).size).toBe(3)
    })

    it(`${sub}: punya minimal 1 gaya gelap`, () => {
      const hasDark = ids.some((id) => {
        const page = resolveManifestPack(MANIFESTS[id]).color.page.toLowerCase()
        return ['#0', '#1', '#2'].some((p) => page.startsWith(p))
      })
      expect(hasDark).toBe(true)
    })
  }

  it('semua hex page valid 6-digit (anti-typo)', () => {
    for (const ids of Object.values(KLINIK_PACKS)) {
      for (const id of ids) {
        const c = resolveManifestPack(MANIFESTS[id]).color
        for (const hex of [c.page, c.surface, c.primary, c.heroFrom, c.heroTo, c.heroInk]) {
          expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/)
        }
      }
    }
  })
})
