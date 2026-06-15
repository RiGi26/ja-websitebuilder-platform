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
import { BESPOKE_RENDERERS } from '@/app/components/themes/toko-bespoke/registry'

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

  it('Kuliner = flagship lux bespoke (Tungku/Pamor)', () => {
    const themes = getThemes('toko_online', 'kuliner')
    expect(themes.map((t) => t.id)).toEqual(['kuliner-tungku', 'kuliner-pamor'])
    expect(themes.every((t) => t.manifest === 'toko-kuliner')).toBe(true)
  })

  it('Kerajinan = flagship lux bespoke (Tanah Loka)', () => {
    const themes = getThemes('toko_online', 'kerajinan')
    expect(themes.map((t) => t.id)).toEqual(['kerajinan-tanah'])
    expect(themes.every((t) => t.manifest === 'toko-kerajinan')).toBe(true)
    const kerajinan = getSubKategori('toko_online').find((s) => s.id === 'kerajinan')
    expect(kerajinan?.ready).toBe(true)
    expect(getReadySubKategori('toko_online').map((s) => s.id)).toContain('kerajinan')
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
        // Bespoke lintas industri (toko-*/klinik-umum/…) = renderer bespoke, bukan
        // manifest composable → manifest sengaja = key registry (≠ id). Dikecualikan
        // via keanggotaan di BESPOKE_RENDERERS (future-proof, bukan cek prefix).
        if (t.manifest in BESPOKE_RENDERERS) continue
        expect(t.manifest).toBe(t.id)
      }
    }
  })

  it('getReadySubKategori: hanya sub-kategori lux ber-renderer yang aktif di Toko Online', () => {
    // Wave 1 TOKO TUNTAS — semua 8 sub-kategori toko kini bespoke + ready:
    // Kuliner + Fashion + Kerajinan + Kecantikan + Gadget + Rumah + Kesehatan + Anak.
    expect(getReadySubKategori('toko_online').map((s) => s.id)).toEqual(['kuliner', 'fashion', 'kerajinan', 'kecantikan', 'gadget', 'rumah', 'kesehatan', 'anak'])
    expect(getSubKategori('toko_online').filter((s) => s.ready)).toHaveLength(8)
  })

  it('Wave 1 toko tuntas — tak ada sub-kategori toko yang belum bespoke (semua ready)', () => {
    expect(getSubKategori('toko_online').filter((s) => !s.ready)).toHaveLength(0)
  })

  it('getTheme menemukan tema lintas sub-kategori (bespoke kecantikan-embun + gadget-onyx + rumah-selaras)', () => {
    expect(getTheme('toko_online', 'kecantikan-embun')?.nama).toBe('Embun')
    expect(getTheme('toko_online', 'gadget-onyx')?.nama).toBe('Onyx')
    expect(getTheme('toko_online', 'rumah-selaras')?.nama).toBe('Selaras')
  })

  it('Fashion → flagship Atelier (boutique bespoke): varian noir/ivoire, AKTIF', () => {
    const themes = getThemes('toko_online', 'fashion')
    expect(themes.map((t) => t.id)).toEqual([
      'atelier-noir',
      'atelier-ivoire',
    ])
    const fashion = getSubKategori('toko_online').find((s) => s.id === 'fashion')
    expect(fashion?.ready).toBe(true)
    expect(getReadySubKategori('toko_online').map((s) => s.id)).toContain('fashion')
  })

  it('Restaurant (Wave 2): warung + cafe + finedining semua READY (sub-kat picker aktif)', () => {
    expect(hasSubKategori('restaurant')).toBe(true)
    const subs = getSubKategori('restaurant')
    expect(subs.map((s) => s.id)).toEqual(['warung', 'cafe', 'finedining'])
    // warung = bespoke "Hangat", cafe = bespoke "Seduh", finedining = restaurant-lux (3 palet via isLux).
    expect(getReadySubKategori('restaurant').map((s) => s.id)).toEqual(['warung', 'cafe', 'finedining'])
  })

  it('Restaurant warung = flagship bespoke "Hangat" (1 varian, manifest = key registry)', () => {
    const themes = getThemes('restaurant', 'warung')
    expect(themes.map((t) => t.id)).toEqual(['warung-hangat'])
    expect(themes.every((t) => t.manifest === 'restaurant-warung')).toBe(true)
    expect('restaurant-warung' in BESPOKE_RENDERERS).toBe(true)
    expect(getTheme('restaurant', 'warung-hangat')?.nama).toBe('Hangat')
  })

  it('Restaurant cafe = flagship bespoke "Seduh" (1 varian, manifest = key registry)', () => {
    const themes = getThemes('restaurant', 'cafe')
    expect(themes.map((t) => t.id)).toEqual(['cafe-seduh'])
    expect(themes.every((t) => t.manifest === 'restaurant-cafe')).toBe(true)
    expect('restaurant-cafe' in BESPOKE_RENDERERS).toBe(true)
    expect(getTheme('restaurant', 'cafe-seduh')?.nama).toBe('Seduh')
  })

  it('Restaurant finedining tetap 3 gaya, subKategori cocok, VARIASI bg gelap↔terang', () => {
    // finedining → restaurant-lux (3 palet, jalur isLux generateContent).
    const themes = getThemes('restaurant', 'finedining')
    expect(themes).toHaveLength(3)
    expect(themes.every((t) => t.subKategori === 'finedining')).toBe(true)
    const bgs = new Set(themes.map((t) => t.bg))
    expect(bgs.has('dark')).toBe(true)
    expect(bgs.has('light') || bgs.has('warm')).toBe(true)
  })

  it('Restaurant: id tema unik (5 total) & manifest === id kecuali warung/cafe bespoke', () => {
    const all = getThemes('restaurant', 'warung')
      .concat(getThemes('restaurant', 'cafe'), getThemes('restaurant', 'finedining'))
    expect(new Set(all.map((t) => t.id)).size).toBe(5) // 1 warung + 1 cafe bespoke + 3 finedining
    for (const t of all) {
      // Bespoke warung/cafe: manifest = key registry (≠ id). Composable finedining: manifest === id.
      if (t.manifest in BESPOKE_RENDERERS) continue
      expect(t.manifest).toBe(t.id)
    }
    expect(getTheme('restaurant', 'finedining-aurum')?.nama).toBe('Aurum')
  })

  it('Klinik (Wave 2 TUNTAS): umum + estetik + wellness semua bespoke + READY', () => {
    expect(hasSubKategori('klinik')).toBe(true)
    const subs = getSubKategori('klinik')
    expect(subs.map((s) => s.id)).toEqual(['umum', 'estetik', 'wellness'])
    // Wave 2: 3/3 sub-kat klinik bespoke + ready (Klinik Bersih · Lumen · Sanara).
    expect(getReadySubKategori('klinik').map((s) => s.id)).toEqual(['umum', 'estetik', 'wellness'])
    expect(getSubKategori('klinik').filter((s) => s.ready)).toHaveLength(3)
  })

  it('Klinik 3 sub-kat = flagship bespoke (1 varian masing-masing, manifest = key registry)', () => {
    const expected: Record<string, { id: string; theme: string; nama: string }> = {
      umum: { id: 'klinik-bersih', theme: 'klinik-umum', nama: 'Klinik Bersih' },
      estetik: { id: 'estetik-lumen', theme: 'klinik-estetik', nama: 'Lumen' },
      wellness: { id: 'wellness-sanara', theme: 'klinik-wellness', nama: 'Sanara' },
    }
    for (const [sub, e] of Object.entries(expected)) {
      const themes = getThemes('klinik', sub)
      expect(themes.map((t) => t.id)).toEqual([e.id])
      expect(themes.every((t) => t.manifest === e.theme)).toBe(true)
      expect(getTheme('klinik', e.id)?.nama).toBe(e.nama)
    }
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
