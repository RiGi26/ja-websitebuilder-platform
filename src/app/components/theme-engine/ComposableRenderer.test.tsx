import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ComposableRenderer from './ComposableRenderer'
import { MANIFESTS, type ComposableContent } from '@/lib/theme-system/manifest'

// Konten contoh = pempek (kasus nyata yang memicu Theme System).
const CONTENT: ComposableContent = {
  nama: 'Pempek RIGIZAF',
  hero: {
    eyebrow: 'Kuliner Khas Palembang',
    title: 'Pempek Homemade Asli Palembang',
    subtitle: 'Dibuat harian dari ikan tenggiri pilihan, cuko racikan turun-temurun.',
    ctaText: 'Pesan via WhatsApp',
    ctaHref: '#wa',
  },
  showcase: {
    title: 'Menu Andalan',
    items: [
      { nama: 'Pempek Kapal Selam', harga: 15000, desc: 'Telur ayam utuh di dalam.' },
      { nama: 'Pempek Lenjer Besar', harga: 28000 },
      { nama: 'Paket Campur 1/2 Kg + Cuko', harga: 55000 },
    ],
  },
  about: { title: 'Tentang Kami', body: 'Cita rasa otentik wong kito.' },
  cta: { title: 'Lapar?', subtitle: 'Pesan sekarang.', ctaText: 'Order', ctaHref: '#' },
  contact: { wa: '081296917963', email: 'halo@pempek.id', alamat: 'Palembang' },
}

describe('ComposableRenderer — mesin Theme System (S0-2)', () => {
  it('registry punya 3 gaya Kuliner', () => {
    expect(Object.keys(MANIFESTS)).toEqual([
      'kuliner-rustic',
      'kuliner-modern',
      'kuliner-heritage',
    ])
  })

  for (const [id, manifest] of Object.entries(MANIFESTS)) {
    it(`render manifest "${id}" tanpa error + memuat konten inti`, () => {
      const html = renderToStaticMarkup(<ComposableRenderer manifest={manifest} content={CONTENT} />)
      expect(html.length).toBeGreaterThan(300)
      expect(html).toContain('Pempek Homemade Asli Palembang') // hero
      expect(html).toContain('Pempek Kapal Selam') // showcase item
      expect(html).toContain('Rp15.000') // harga terformat
      expect(html).toContain('--c-primary') // token ter-inject
      expect(html).toContain(`data-theme="${id}"`)
    })
  }

  it('3 gaya menghasilkan markup berbeda (token + balok beda nyata)', () => {
    const rustic = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={CONTENT} />)
    const modern = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-modern']} content={CONTENT} />)
    const heritage = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-heritage']} content={CONTENT} />)
    expect(rustic).not.toBe(modern)
    expect(rustic).not.toBe(heritage)
    expect(modern).not.toBe(heritage)
  })

  it('showcase: modern pakai card-grid, rustic pakai menu-list (varian beda)', () => {
    const modern = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-modern']} content={CONTENT} />)
    const rustic = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={CONTENT} />)
    expect(modern).toContain('ce-card')
    expect(rustic).toContain('ce-menu-row')
  })
})
