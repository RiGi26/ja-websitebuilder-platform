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

// FLAGSHIP "Toko Atelier" (toko baju) → renderer bespoke theme='toko-atelier'.
// Dipilih saat sub-kategori 'fashion' di brief form; variant 'atelier-noir'/
// 'atelier-ivoire' dipetakan ke palet native renderer 'noir'/'ivoire'.
describe('generateContent — Fashion → toko-atelier (bespoke flagship)', () => {
  const mkToko = (branding: Record<string, unknown>) =>
    generateContent({
      industri: 'Toko Online',
      nama_usaha: 'Toko Baju Uji',
      briefing_data: { industri_tipe: 'toko_online', branding },
    })

  it('atelier-noir → theme toko-atelier, variant noir, aksen brand', () => {
    const plan = mkToko({ sub_kategori: 'fashion', variant: 'atelier-noir', primary_color: '#7E1F2D' })
    expect(plan.theme).toBe('toko-atelier')
    expect(plan.variant).toBe('noir')
    expect(plan.primary).toBe('#7E1F2D')
  })

  it('atelier-ivoire → variant ivoire', () => {
    expect(mkToko({ sub_kategori: 'fashion', variant: 'atelier-ivoire' }).variant).toBe('ivoire')
  })

  it('sub_kategori fashion tanpa variant cocok → default noir', () => {
    const plan = mkToko({ sub_kategori: 'fashion' })
    expect(plan.theme).toBe('toko-atelier')
    expect(plan.variant).toBe('noir')
  })

  it('imagery enrichment aktif: products punya foto + foto_hero terisi (sample atelier)', () => {
    const plan = mkToko({ sub_kategori: 'fashion', variant: 'atelier-noir' })
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(plan.products.length).toBeGreaterThan(0)
    expect(plan.products.every((p) => typeof p.gambar === 'string' && p.gambar!.length > 0)).toBe(true)
  })

  it('toko_online di luar fashion ("Lainnya") tetap lux-toko composable, BUKAN atelier', () => {
    const plan = mkToko({ variant: 'lux-toko' })
    expect(plan.theme).toBe('composable')
    expect(plan.variant).toBe('lux-toko')
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
