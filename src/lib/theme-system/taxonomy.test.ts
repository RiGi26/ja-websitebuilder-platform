import { describe, it, expect } from 'vitest'
import {
  INDUSTRY_SUBKATEGORI,
  THEMES,
  hasSubKategori,
  getSubKategori,
  getReadySubKategori,
  getThemes,
  getTheme,
} from './taxonomy'

describe('theme-system taxonomy (S0-1)', () => {
  it('toko_online punya lapis sub-kategori', () => {
    expect(hasSubKategori('toko_online')).toBe(true)
    expect(getSubKategori('toko_online').length).toBeGreaterThanOrEqual(3)
  })

  it('industri tanpa registri → kosong, tidak error', () => {
    expect(hasSubKategori('klinik')).toBe(false)
    expect(getSubKategori('klinik')).toEqual([])
    expect(getThemes('klinik', 'apapun')).toEqual([])
    expect(getTheme('klinik', 'apapun')).toBeUndefined()
  })

  it('Kuliner = pilot dengan 3 gaya', () => {
    const themes = getThemes('toko_online', 'kuliner')
    expect(themes).toHaveLength(3)
    expect(themes.map((t) => t.id)).toEqual([
      'kuliner-rustic',
      'kuliner-modern',
      'kuliner-heritage',
    ])
  })

  it('setiap tema mereferensi sub-kategori yang terdaftar di industrinya', () => {
    for (const [tipe, byCat] of Object.entries(THEMES)) {
      const validCats = new Set((INDUSTRY_SUBKATEGORI[tipe as keyof typeof INDUSTRY_SUBKATEGORI] ?? []).map((s) => s.id))
      for (const [subKat, list] of Object.entries(byCat ?? {})) {
        expect(validCats.has(subKat)).toBe(true)
        for (const t of list) {
          expect(t.subKategori).toBe(subKat)
        }
      }
    }
  })

  it('id tema unik global per industri', () => {
    for (const byCat of Object.values(THEMES)) {
      const ids = Object.values(byCat ?? {}).flat().map((t) => t.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('invarian S0-1: manifest === id', () => {
    for (const byCat of Object.values(THEMES)) {
      for (const t of Object.values(byCat ?? {}).flat()) {
        expect(t.manifest).toBe(t.id)
      }
    }
  })

  it('getReadySubKategori: Kuliner aktif (S1-5), sisanya belum', () => {
    const ready = getReadySubKategori('toko_online')
    expect(ready.map((s) => s.id)).toEqual(['kuliner'])
    // sub-kategori lain masih ready:false sampai dibangun via playbook
    expect(getSubKategori('toko_online').filter((s) => s.ready)).toHaveLength(1)
  })

  it('getTheme menemukan tema lintas sub-kategori', () => {
    const t = getTheme('toko_online', 'kuliner-heritage')
    expect(t?.nama).toBe('Heritage Kuliner')
  })

  it('Fashion (S2-1): 3 gaya terdaftar tapi sub-kategori belum ready (dormant)', () => {
    const themes = getThemes('toko_online', 'fashion')
    expect(themes.map((t) => t.id)).toEqual([
      'fashion-editorial',
      'fashion-minimal',
      'fashion-vibrant',
    ])
    const fashion = getSubKategori('toko_online').find((s) => s.id === 'fashion')
    expect(fashion?.ready).toBe(false) // belum aktif sampai blok+polish+verify tuntas
    expect(getReadySubKategori('toko_online').map((s) => s.id)).not.toContain('fashion')
  })

  it('STANDAR IKON: setiap sub-kategori & tema punya icon (nama lucide) non-kosong, bukan emoji', () => {
    // Heuristik anti-emoji: nama ikon lucide = ASCII PascalCase.
    const asciiPascal = /^[A-Z][A-Za-z0-9]+$/
    for (const list of Object.values(INDUSTRY_SUBKATEGORI)) {
      for (const s of list ?? []) {
        expect(s.icon).toMatch(asciiPascal)
      }
    }
    for (const byCat of Object.values(THEMES)) {
      for (const t of Object.values(byCat ?? {}).flat()) {
        expect(t.icon).toMatch(asciiPascal)
      }
    }
  })
})
