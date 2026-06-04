import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import TokenDrivenRenderer, { type SiteContent } from './TokenDrivenRenderer'
import { PACKS } from '@/lib/design-tokens/packs'

// Konten contoh tetap → output hanya berubah karena pack (warna + LAYOUT).
const CONTENT: SiteContent = {
  nama: 'Studio Aksara',
  hero: {
    eyebrow: 'Agensi Kreatif',
    title: 'Bangun merek yang diingat',
    subtitle: 'Desain, strategi, dan eksekusi dalam satu tim.',
    ctaText: 'Mulai Proyek',
    ctaHref: '#kontak',
  },
  features: [
    { title: 'Brand Identity', desc: 'Logo, palet, dan panduan merek.' },
    { title: 'Web Design', desc: 'Situs cepat yang mengonversi.' },
    { title: 'Konten', desc: 'Foto, video, dan copywriting.' },
  ],
  about: { title: 'Tentang Kami', body: 'Tim kecil yang fokus pada hasil.' },
  cta: { title: 'Siap mulai?', subtitle: 'Konsultasi gratis 30 menit.', ctaText: 'Hubungi', ctaHref: '#' },
  contact: { wa: '628123456789', email: 'halo@aksara.id', alamat: 'Jakarta' },
}

describe('TokenDrivenRenderer — render tiap pack', () => {
  for (const [id, pack] of Object.entries(PACKS)) {
    it(`render pack "${id}" tanpa error + memuat konten inti`, () => {
      const html = renderToStaticMarkup(<TokenDrivenRenderer content={CONTENT} pack={pack} />)
      expect(html.length).toBeGreaterThan(200)
      expect(html).toContain('Bangun merek yang diingat') // hero title
      expect(html).toContain('Brand Identity') // feature
      // token pack ter-inject sbg CSS var
      expect(html).toContain('--c-primary')
    })

    it(`snapshot markup pack "${id}"`, () => {
      const html = renderToStaticMarkup(<TokenDrivenRenderer content={CONTENT} pack={pack} />)
      expect(html).toMatchSnapshot()
    })
  }

  it('arketipe layout menghasilkan struktur berbeda (split ≠ fullbleed ≠ list)', () => {
    const split = renderToStaticMarkup(<TokenDrivenRenderer content={CONTENT} pack={PACKS['luxury-navy']} />)
    const fullbleed = renderToStaticMarkup(<TokenDrivenRenderer content={CONTENT} pack={PACKS['bold-energetic']} />)
    const baseline = renderToStaticMarkup(<TokenDrivenRenderer content={CONTENT} pack={PACKS['clean-modern']} />)
    // markup ketiganya tidak identik → layout benar-benar beda, bukan cuma warna
    expect(split).not.toBe(fullbleed)
    expect(split).not.toBe(baseline)
    expect(fullbleed).not.toBe(baseline)
  })
})
