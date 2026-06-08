import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import RestaurantLuxRenderer from './RestaurantLuxRenderer'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

const content = sampleContentForTheme('finedining-aurum')

describe('RestaurantLuxRenderer (bespoke premium, Opsi A)', () => {
  it('render lengkap + konten kunci dari ComposableContent', () => {
    const html = renderToStaticMarkup(<RestaurantLuxRenderer content={content} variant="aurum" />)
    expect(html).toContain('class="rl-nav"')
    expect(html).toContain('class="rl-hero"')
    expect(html).toContain('Cormorant Garamond')          // font via @import
    expect(html).toContain(content.nama)                  // brand
    expect(html).toContain(content.hero.title)
    expect(html).toContain('class="rl-statement')         // filosofi
    // signature dishes (item ber-foto) ter-render
    expect(html).toContain('Iga Bakar Madu Kecombrang')
    expect(html).toContain('class="rl-dish-idx"')
    // menu tabs + anchor kategori
    expect(html).toContain('class="rl-menu-tab"')
    expect(html).toContain('id="menu-hidangan-utama"')
    // human-centric team
    expect(html).toContain('Tim yang Menyiapkan Malam Anda')
    expect(html).toContain('Chef Anindya Larasati')
    // galeri + recognition + faq + peta
    expect(html).toContain('class="rl-gal"')
    expect(html).toContain('class="rl-recog"')
    expect(html).toContain('class="rl-faq')
    expect(html).toContain('output=embed')
  })

  it('aksen ikut warna brand (primary override)', () => {
    const html = renderToStaticMarkup(<RestaurantLuxRenderer content={content} primary="#7FA06B" />)
    expect(html).toContain('--rl-accent:#7FA06B')
  })

  it('preset palet berbeda → markup berbeda (aurum vs noir)', () => {
    const a = renderToStaticMarkup(<RestaurantLuxRenderer content={content} variant="aurum" />)
    const n = renderToStaticMarkup(<RestaurantLuxRenderer content={content} variant="noir" />)
    expect(a).not.toBe(n)
    expect(n).toContain('data-variant="noir"')
  })

  it('tim tanpa foto → fallback inisial bermartabat (bukan <img> kosong)', () => {
    const html = renderToStaticMarkup(<RestaurantLuxRenderer content={content} />)
    expect(html).toContain('class="rl-chef-ini"')
  })
})
