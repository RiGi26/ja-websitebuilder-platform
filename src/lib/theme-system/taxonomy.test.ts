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
    // 'custom' = satu-satunya industri tanpa lapis sub-kategori (sisanya sudah, S1-9).
    expect(hasSubKategori('custom')).toBe(false)
    expect(getSubKategori('custom')).toEqual([])
    expect(getThemes('custom', 'apapun')).toEqual([])
    expect(getTheme('custom', 'apapun')).toBeUndefined()
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

  it('getReadySubKategori: ke-8 sub-kategori Toko Online aktif (replikasi tuntas)', () => {
    const ready = getReadySubKategori('toko_online')
    expect(ready.map((s) => s.id)).toEqual([
      'kuliner', 'fashion', 'kerajinan', 'kecantikan', 'gadget', 'rumah', 'kesehatan', 'anak',
    ])
    expect(getSubKategori('toko_online').filter((s) => s.ready)).toHaveLength(8)
  })

  it('tiap sub-kategori baru punya 3 gaya, subKategori cocok, id unik', () => {
    for (const sub of ['kerajinan', 'kecantikan', 'gadget', 'rumah', 'kesehatan', 'anak']) {
      const themes = getThemes('toko_online', sub)
      expect(themes).toHaveLength(3)
      expect(themes.every((t) => t.subKategori === sub)).toBe(true)
    }
  })

  it('getTheme menemukan tema lintas sub-kategori', () => {
    const t = getTheme('toko_online', 'kuliner-heritage')
    expect(t?.nama).toBe('Heritage Kuliner')
  })

  it('Fashion (S2): 3 gaya terdaftar & sub-kategori AKTIF (S2-3)', () => {
    const themes = getThemes('toko_online', 'fashion')
    expect(themes.map((t) => t.id)).toEqual([
      'fashion-editorial',
      'fashion-minimal',
      'fashion-vibrant',
    ])
    const fashion = getSubKategori('toko_online').find((s) => s.id === 'fashion')
    expect(fashion?.ready).toBe(true) // aktif: blok+polish+verify tuntas
    expect(getReadySubKategori('toko_online').map((s) => s.id)).toContain('fashion')
  })

  it('Restaurant: sub-kategori terdaftar tapi DISEMBUNYIKAN dari brief form (lux-only)', () => {
    expect(hasSubKategori('restaurant')).toBe(true)
    const subs = getSubKategori('restaurant')
    expect(subs.map((s) => s.id)).toEqual(['warung', 'cafe', 'finedining'])
    // Non-toko lux-only: sub-kategori lama ready:false → tak muncul di brief form.
    expect(getReadySubKategori('restaurant')).toEqual([])
  })

  it('Restaurant (S4): tiap sub-kategori 3 gaya, subKategori cocok, VARIASI bg gelap↔terang', () => {
    for (const sub of ['warung', 'cafe', 'finedining']) {
      const themes = getThemes('restaurant', sub)
      expect(themes).toHaveLength(3)
      expect(themes.every((t) => t.subKategori === sub)).toBe(true)
      // tiap sub-kat wajib punya minimal 1 gaya gelap & 1 terang (prinsip #6)
      const bgs = new Set(themes.map((t) => t.bg))
      expect(bgs.has('dark')).toBe(true)
      expect(bgs.has('light') || bgs.has('warm')).toBe(true)
    }
  })

  it('Restaurant (S4): id tema unik & manifest === id', () => {
    const all = getThemes('restaurant', 'warung')
      .concat(getThemes('restaurant', 'cafe'), getThemes('restaurant', 'finedining'))
    const ids = all.map((t) => t.id)
    expect(new Set(ids).size).toBe(9)
    expect(all.every((t) => t.manifest === t.id)).toBe(true)
    expect(getTheme('restaurant', 'cafe-roastery')?.nama).toBe('Roastery')
  })

  it('Klinik: sub-kategori terdaftar tapi DISEMBUNYIKAN dari brief form (lux-only)', () => {
    expect(hasSubKategori('klinik')).toBe(true)
    const subs = getSubKategori('klinik')
    expect(subs.map((s) => s.id)).toEqual(['umum', 'estetik', 'wellness'])
    expect(getReadySubKategori('klinik')).toEqual([])
  })

  it('Klinik (S6): tiap sub-kategori 3 gaya, subKategori cocok, VARIASI bg gelap↔terang', () => {
    for (const sub of ['umum', 'estetik', 'wellness']) {
      const themes = getThemes('klinik', sub)
      expect(themes).toHaveLength(3)
      expect(themes.every((t) => t.subKategori === sub)).toBe(true)
      const bgs = new Set(themes.map((t) => t.bg))
      expect(bgs.has('dark')).toBe(true)
      expect(bgs.has('light') || bgs.has('warm')).toBe(true)
    }
  })

  it('Klinik (S6): id tema unik (9) & manifest === id', () => {
    const all = getThemes('klinik', 'umum')
      .concat(getThemes('klinik', 'estetik'), getThemes('klinik', 'wellness'))
    expect(new Set(all.map((t) => t.id)).size).toBe(9)
    expect(all.every((t) => t.manifest === t.id)).toBe(true)
    expect(getTheme('klinik', 'estetik-noir')?.nama).toBe('Noir')
  })

  it('Sekolah: sub-kategori terdaftar tapi DISEMBUNYIKAN dari brief form (lux-only)', () => {
    expect(hasSubKategori('sekolah')).toBe(true)
    const subs = getSubKategori('sekolah')
    expect(subs.map((s) => s.id)).toEqual(['reguler', 'islami', 'kursus'])
    expect(getReadySubKategori('sekolah')).toEqual([])
  })

  it('Sekolah (S7): tiap sub-kategori 3 gaya, subKategori cocok, VARIASI bg gelap↔terang', () => {
    for (const sub of ['reguler', 'islami', 'kursus']) {
      const themes = getThemes('sekolah', sub)
      expect(themes).toHaveLength(3)
      expect(themes.every((t) => t.subKategori === sub)).toBe(true)
      const bgs = new Set(themes.map((t) => t.bg))
      expect(bgs.has('dark')).toBe(true)
      expect(bgs.has('light') || bgs.has('warm')).toBe(true)
    }
  })

  it('Sekolah (S7): id tema unik (9) & manifest === id', () => {
    const all = getThemes('sekolah', 'reguler')
      .concat(getThemes('sekolah', 'islami'), getThemes('sekolah', 'kursus'))
    expect(new Set(all.map((t) => t.id)).size).toBe(9)
    expect(all.every((t) => t.manifest === t.id)).toBe(true)
    expect(getTheme('sekolah', 'kursus-malam')?.nama).toBe('Malam')
  })

  it('Personal: 9 tema terdaftar (DISEMBUNYIKAN dari brief form), VARIASI bg gelap↔terang', () => {
    expect(hasSubKategori('personal')).toBe(true)
    expect(getReadySubKategori('personal')).toEqual([])
    const all = getThemes('personal', 'kreator')
      .concat(getThemes('personal', 'profesional'), getThemes('personal', 'coach'))
    expect(new Set(all.map((t) => t.id)).size).toBe(9)
    expect(all.every((t) => t.manifest === t.id)).toBe(true)
    for (const sub of ['kreator', 'profesional', 'coach']) {
      const themes = getThemes('personal', sub)
      expect(themes).toHaveLength(3)
      const bgs = new Set(themes.map((t) => t.bg))
      expect(bgs.has('dark')).toBe(true)
      expect(bgs.has('light') || bgs.has('warm')).toBe(true)
    }
  })

  it('Company: 9 tema terdaftar (DISEMBUNYIKAN dari brief form), VARIASI bg gelap↔terang', () => {
    expect(hasSubKategori('corporate')).toBe(true)
    expect(getReadySubKategori('corporate')).toEqual([])
    const all = getThemes('corporate', 'startup')
      .concat(getThemes('corporate', 'agency'), getThemes('corporate', 'korporat'))
    expect(new Set(all.map((t) => t.id)).size).toBe(9)
    expect(all.every((t) => t.manifest === t.id)).toBe(true)
    for (const sub of ['startup', 'agency', 'korporat']) {
      const themes = getThemes('corporate', sub)
      expect(themes).toHaveLength(3)
      const bgs = new Set(themes.map((t) => t.bg))
      expect(bgs.has('dark')).toBe(true)
      expect(bgs.has('light') || bgs.has('warm')).toBe(true)
    }
  })

  it('Sprint 9 (travel/blog/jastip): tiap industri 3 sub-kat AKTIF ×3 gaya, VARIASI', () => {
    const expected: Record<string, string[]> = {
      travel: ['kendaraan', 'wisata', 'akomodasi'],
      blog: ['jurnal', 'media', 'niche'],
      jastip: ['luar', 'lokal', 'preorder'],
    }
    for (const [tipe, subs] of Object.entries(expected)) {
      expect(hasSubKategori(tipe)).toBe(true)
      expect(getReadySubKategori(tipe)).toEqual([]) // lux-only: disembunyikan dari brief form
      const all = subs.flatMap((s) => getThemes(tipe, s))
      expect(new Set(all.map((t) => t.id)).size).toBe(9)
      expect(all.every((t) => t.manifest === t.id)).toBe(true)
      for (const s of subs) {
        const themes = getThemes(tipe, s)
        expect(themes).toHaveLength(3)
        const bgs = new Set(themes.map((t) => t.bg))
        expect(bgs.has('dark')).toBe(true)
        expect(bgs.has('light') || bgs.has('warm')).toBe(true)
      }
    }
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
