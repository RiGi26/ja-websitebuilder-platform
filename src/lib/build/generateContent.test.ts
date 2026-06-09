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
