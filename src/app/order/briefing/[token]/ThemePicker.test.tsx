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

  it('render varian Fashion → Atelier (Noir/Ivoire) dengan nama + swatch', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="fashion" value="" onChange={noop} />,
    )
    expect(html).toContain('Noir')
    expect(html).toContain('Ivoire')
    expect(html).toContain('#1C1916') // swatch mood noir ter-inject
  })

  it('render 3 gaya Kerajinan dengan motif (flagship)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="kerajinan" value="" onChange={noop} />,
    )
    expect(html).toContain('Pusaka')
    expect(html).toContain('Tenun')
    expect(html).toContain('Galeri')
  })

  it('sub-kategori tak dikenal → render kosong (null)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="tidak-ada" value="" onChange={noop} />,
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
  it('menampilkan Fashion (lux-ready) + opsi "Lainnya" untuk toko_online', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="toko_online" value="" onChange={noop} />,
    )
    expect(html).toContain('Fashion / Pakaian')
    expect(html).toContain('Lainnya (gaya umum)')
    // Sub-kategori non-lux disembunyikan (ready:false)
    expect(html).not.toContain('Kuliner / Makanan')
  })

  it('non-toko (klinik/sekolah) → picker DISEMBUNYIKAN (lux-only, langsung kartu Lux)', () => {
    // ready:false utk semua sub-kat non-toko → SubKategoriPicker null → brief form
    // langsung tampilkan variant grid (satu kartu Lux), tanpa langkah sub-kategori.
    expect(renderToStaticMarkup(<SubKategoriPicker tipe="klinik" value="" onChange={noop} />)).toBe('')
    expect(renderToStaticMarkup(<SubKategoriPicker tipe="sekolah" value="" onChange={noop} />)).toBe('')
    expect(renderToStaticMarkup(<SubKategoriPicker tipe="restaurant" value="" onChange={noop} />)).toBe('')
  })

  it('tetap dormant untuk industri tanpa sub-kategori (mis. custom)', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="custom" value="" onChange={noop} />,
    )
    expect(html).toBe('')
  })
})
