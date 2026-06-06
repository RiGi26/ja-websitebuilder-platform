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

  it('render 3 gaya Fashion dengan nama + swatch (S2-1)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="fashion" value="" onChange={noop} />,
    )
    expect(html).toContain('Editorial')
    expect(html).toContain('Minimalis')
    expect(html).toContain('Vibrant')
    expect(html).toContain('#5B2BE8') // swatch mood vibrant ter-inject
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
  it('menampilkan Kuliner + opsi "Lainnya" untuk toko_online', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="toko_online" value="" onChange={noop} />,
    )
    expect(html).toContain('Kuliner / Makanan')
    expect(html).toContain('Lainnya (gaya umum)')
  })

  it('menampilkan sub-kategori Klinik untuk tipe klinik (S6)', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="klinik" value="" onChange={noop} />,
    )
    expect(html).toContain('Klinik Umum / Gigi')
    expect(html).toContain('Skincare / Estetik')
    expect(html).toContain('Fisio / Wellness')
  })

  it('menampilkan sub-kategori Sekolah untuk tipe sekolah (S7)', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="sekolah" value="" onChange={noop} />,
    )
    expect(html).toContain('Sekolah Umum (SD/SMP/SMA)')
    expect(html).toContain('Sekolah Islami / Pesantren')
    expect(html).toContain('Kursus / Bimbel')
  })

  it('tetap dormant untuk industri tanpa sub-kategori ready (mis. blog)', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="blog" value="" onChange={noop} />,
    )
    expect(html).toBe('')
  })
})
