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

describe('SubKategoriPicker — aktif untuk toko_online (S1-5)', () => {
  it('menampilkan Kuliner + opsi "Lainnya" untuk toko_online', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="toko_online" value="" onChange={noop} />,
    )
    expect(html).toContain('Kuliner / Makanan')
    expect(html).toContain('Lainnya (gaya umum)')
  })

  it('tetap dormant untuk industri tanpa sub-kategori ready (mis. klinik)', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="klinik" value="" onChange={noop} />,
    )
    expect(html).toBe('')
  })
})
