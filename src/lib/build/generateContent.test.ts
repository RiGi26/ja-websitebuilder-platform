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
