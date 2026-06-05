import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ThemePicker from './ThemePicker'
import SubKategoriPicker from './SubKategoriPicker'

const noop = () => {}

describe('ThemePicker (S0-3)', () => {
  it('render 3 gaya Kuliner dengan nama + swatch warna', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="kuliner" value="" onChange={noop} />,
    )
    expect(html).toContain('Rustic Hangat')
    expect(html).toContain('Modern Appetite')
    expect(html).toContain('Heritage Kuliner')
    expect(html).toContain('#B5532A') // swatch mood rustic ter-inject
  })

  it('sub-kategori tanpa tema → render kosong (null)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="fashion" value="" onChange={noop} />,
    )
    expect(html).toBe('')
  })

  it('menandai tema terpilih (aria-pressed)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="kuliner" value="kuliner-modern" onChange={noop} />,
    )
    expect(html).toContain('aria-pressed="true"')
  })
})

describe('SubKategoriPicker — jaminan DORMANT (S0-3)', () => {
  it('render kosong selama belum ada sub-kategori ready (nol regresi produksi)', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="toko_online" value="" onChange={noop} />,
    )
    expect(html).toBe('')
  })
})
