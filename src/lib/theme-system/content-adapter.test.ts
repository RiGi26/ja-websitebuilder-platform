import { describe, it, expect } from 'vitest'
import type { PageSection, Product } from '@/types/websitebuilder'
import { composableContentFromSections } from './content-adapter'
import { generateContent } from '@/lib/build/generateContent'

const sections = [
  { tipe_komponen: 'hero_banner', isi_komponen: { title: 'Pempek RIGIZAF', subtitle: 'Asli Palembang' } },
  { tipe_komponen: 'about', isi_komponen: { title: 'Tentang', body: 'Homemade.' } },
] as unknown as PageSection[]

const products = [
  { nama: 'Kapal Selam', harga: 15000, deskripsi: 'telur utuh', gambar_url: null },
  { nama: 'Lenjer', harga: 28000, deskripsi: null, gambar_url: null },
] as unknown as Product[]

describe('composableContentFromSections (S0-4)', () => {
  it('petakan hero/about + showcase dari produk', () => {
    const c = composableContentFromSections('Pempek RIGIZAF', sections, products, null)
    expect(c.hero.title).toBe('Pempek RIGIZAF')
    expect(c.about?.title).toBe('Tentang')
    expect(c.showcase?.items).toHaveLength(2)
    expect(c.showcase?.items[0]).toMatchObject({ nama: 'Kapal Selam', harga: 15000 })
  })

  it('tanpa produk → showcase undefined', () => {
    const c = composableContentFromSections('Toko', sections, [], null)
    expect(c.showcase).toBeUndefined()
  })
})

describe('generateContent — routing tema composable (S0-4)', () => {
  it('variant = id manifest → theme "composable"', () => {
    const plan = generateContent({
      industri: 'Toko Online',
      briefing_data: {
        industri_tipe: 'toko_online',
        identitas: { nama_usaha: 'Pempek X' },
        branding: { variant: 'kuliner-rustic', sub_kategori: 'kuliner' },
      },
    })
    expect(plan.theme).toBe('composable')
    expect(plan.variant).toBe('kuliner-rustic')
  })

  it('variant biasa → theme per industri (bukan composable)', () => {
    const plan = generateContent({
      industri: 'Toko Online',
      briefing_data: {
        industri_tipe: 'toko_online',
        identitas: { nama_usaha: 'Toko Y' },
        branding: { variant: 'batik' },
      },
    })
    expect(plan.theme).not.toBe('composable')
  })
})
