import { describe, it, expect } from 'vitest'
import { generateContent } from './generateContent'

// Anti-slop: auto-build dummy dulu 0 foto → placeholder gradient. Sekarang
// di-enrich dengan foto Unsplash terkurasi dari sample-content (HANYA tema
// composable, supaya sub-kategori cocok = foto relevan).
describe('generateContent — imagery enrichment (anti-slop dummy)', () => {
  it('tema composable: isi foto_hero + gambar showcase dari sample terkurasi', () => {
    const plan = generateContent({
      industri: 'Toko Online',
      nama_usaha: 'Toko Uji',
      briefing_data: { industri_tipe: 'toko_online', branding: { variant: 'kuliner-rustic' } },
    })
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(String(plan.dataKonten.foto_hero)).toContain('unsplash')

    const rows = [...plan.products, ...plan.services, ...plan.menuItems]
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((r) => typeof r.gambar === 'string' && r.gambar!.length > 0)).toBe(true)
  })

  it('tema lama/non-composable: TIDAK di-enrich (hindari foto salah industri)', () => {
    const plan = generateContent({
      industri: 'Toko Online',
      nama_usaha: 'Toko Uji',
      briefing_data: { industri_tipe: 'toko_online', branding: { variant: 'clean' } },
    })
    expect(plan.dataKonten.foto_hero).toBeUndefined()
  })
})

// Fine Dining → renderer bespoke restaurant-lux (upgrade dari composable finedining).
// Pilihan Fine Dining di briefing harus menghasilkan theme='restaurant-lux' + palet.
describe('generateContent — Fine Dining → restaurant-lux (bespoke premium)', () => {
  const luxOrder = (variant: string) => ({
    industri: 'Restaurant',
    nama_usaha: 'Resto Uji',
    briefing_data: {
      industri_tipe: 'restaurant',
      branding: { sub_kategori: 'finedining', variant, primary_color: '#1f7a3d' },
    },
  })

  it('finedining-aurum → theme restaurant-lux, variant aurum, aksen brand', () => {
    const plan = generateContent(luxOrder('finedining-aurum'))
    expect(plan.theme).toBe('restaurant-lux')
    expect(plan.variant).toBe('aurum')
    expect(plan.primary).toBe('#1f7a3d')
  })

  it('finedining-hearth → variant hearth; finedining-nordic → noir (palet gelap terdekat)', () => {
    expect(generateContent(luxOrder('finedining-hearth')).variant).toBe('hearth')
    expect(generateContent(luxOrder('finedining-nordic')).variant).toBe('noir')
  })

  it('sub_kategori finedining tanpa variant cocok → default aurum', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      briefing_data: { industri_tipe: 'restaurant', branding: { sub_kategori: 'finedining' } },
    })
    expect(plan.theme).toBe('restaurant-lux')
    expect(plan.variant).toBe('aurum')
  })

  it('imagery enrichment aktif: menuItems punya foto + foto_hero terisi', () => {
    const plan = generateContent(luxOrder('finedining-aurum'))
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(plan.menuItems.length).toBeGreaterThan(0)
    expect(plan.menuItems.every((m) => typeof m.gambar === 'string' && m.gambar!.length > 0)).toBe(true)
  })

  it('restaurant non-finedining (warung) tetap jalur lama, BUKAN restaurant-lux', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Warung Uji',
      briefing_data: { industri_tipe: 'restaurant', branding: { sub_kategori: 'warung', variant: 'warung-rakyat' } },
    })
    expect(plan.theme).not.toBe('restaurant-lux')
  })

  // Lux-only brief form (non-toko): sub-kategori disembunyikan → restaurant memilih
  // satu kartu Lux → variant 'lux-restaurant'. Itu kini juga = bespoke restaurant-lux.
  it('lux-restaurant (kartu Lux brief form) → theme restaurant-lux, variant aurum', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      briefing_data: { industri_tipe: 'restaurant', branding: { variant: 'lux-restaurant', primary_color: '#1f7a3d' } },
    })
    expect(plan.theme).toBe('restaurant-lux')
    expect(plan.variant).toBe('aurum')
    expect(plan.primary).toBe('#1f7a3d')
  })
})

// LUX TIER (Sprint 1) — composable lux jadi DEFAULT premium per industri pilot
// (restaurant + klinik) saat briefing tak memilih variant; pilihan eksplisit
// dihormati; Fine Dining bespoke (benchmark) tetap menang; konten produksi
// di-enrich (statement/stats/faq) supaya situs lux tak sparse.
describe('generateContent — LUX TIER default + enrichment (Sprint 1)', () => {
  const mk = (tipe: string, branding?: Record<string, unknown>) =>
    generateContent({
      industri: tipe,
      nama_usaha: 'Uji',
      briefing_data: { industri_tipe: tipe, ...(branding ? { branding } : {}) },
    })

  it('restaurant tanpa variant → composable lux-restaurant (default premium)', () => {
    const plan = mk('restaurant')
    expect(plan.theme).toBe('composable')
    expect(plan.variant).toBe('lux-restaurant')
  })

  it('klinik tanpa variant → composable lux-klinik', () => {
    const plan = mk('klinik')
    expect(plan.theme).toBe('composable')
    expect(plan.variant).toBe('lux-klinik')
  })

  it('pilihan variant eksplisit dihormati (escape hatch) — bukan lux', () => {
    const plan = mk('restaurant', { variant: 'warung-rakyat' })
    expect(plan.variant).toBe('warung-rakyat')
    expect(plan.theme).toBe('composable')
  })

  it('Fine Dining tetap → restaurant-lux bespoke (benchmark), bukan lux composable', () => {
    const plan = mk('restaurant', { sub_kategori: 'finedining' })
    expect(plan.theme).toBe('restaurant-lux')
  })

  it('industri non-pilot (corporate) tak kena default lux', () => {
    const plan = mk('corporate')
    expect(plan.variant).not.toBe('lux-restaurant')
    expect(plan.variant).not.toBe('lux-klinik')
  })

  it('enrich produksi: dataKonten restaurant punya statement + stats + faq', () => {
    const dk = mk('restaurant').dataKonten as Record<string, unknown>
    expect(dk.statement).toBeTruthy()
    expect(Array.isArray(dk.stats) && (dk.stats as unknown[]).length).toBeGreaterThanOrEqual(2)
    expect(Array.isArray(dk.faq) && (dk.faq as unknown[]).length).toBeGreaterThanOrEqual(3)
  })

  it('enrich produksi: dataKonten klinik punya statement + stats + faq', () => {
    const dk = mk('klinik').dataKonten as Record<string, unknown>
    expect(dk.statement).toBeTruthy()
    expect(Array.isArray(dk.stats)).toBe(true)
    expect(Array.isArray(dk.faq)).toBe(true)
  })
})

describe('generateContent — capabilities (B-cap)', () => {
  it('selected_addons → plan.capabilities', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      selected_addons: ['booking', 'delivery', 'qr-menu'],
      briefing_data: { industri_tipe: 'restaurant' },
    })
    expect(plan.capabilities).toEqual(expect.arrayContaining(['booking', 'delivery-buttons', 'qr-menu']))
  })

  it('tanpa add-on → capabilities []', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      briefing_data: { industri_tipe: 'restaurant' },
    })
    expect(plan.capabilities).toEqual([])
  })
})

// Konten + gambar dari brief form HARUS dipakai apa adanya (situs selaras dgn
// yang diisi klien); sample hanya mengisi yang kosong.
describe('generateContent — gambar & hero dari brief form (selaras)', () => {
  const FOTO = 'https://cdn.example.com/menu-rendang.jpg'
  const HERO = 'https://cdn.example.com/hero-dapur.jpg'

  it('foto_url menu dari brief → menuItems[].gambar (tak ditimpa sample)', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      briefing_data: {
        industri_tipe: 'restaurant',
        branding: { variant: 'lux-restaurant', foto_hero: HERO },
        konten: { menu: [{ nama: 'Rendang', harga: '65000', foto_url: FOTO }] },
      },
    })
    const rendang = plan.menuItems.find((m) => m.nama === 'Rendang')
    expect(rendang?.gambar).toBe(FOTO)
  })

  it('foto_hero dari brief → dataKonten.foto_hero (menang atas sample)', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      briefing_data: {
        industri_tipe: 'restaurant',
        branding: { variant: 'lux-restaurant', foto_hero: HERO },
        konten: { menu: [{ nama: 'Rendang', harga: '65000' }] },
      },
    })
    expect(plan.dataKonten.foto_hero).toBe(HERO)
  })

  it('foto_url produk toko dari brief → products[].gambar', () => {
    const plan = generateContent({
      industri: 'Toko Online',
      nama_usaha: 'Toko Uji',
      briefing_data: {
        industri_tipe: 'toko_online',
        branding: { variant: 'lux-toko' },
        konten: { produk_unggulan: [{ nama: 'Kemeja', harga: '150000', foto_url: FOTO }] },
      },
    })
    const kemeja = plan.products.find((p) => p.nama === 'Kemeja')
    expect(kemeja?.gambar).toBe(FOTO)
  })
})
