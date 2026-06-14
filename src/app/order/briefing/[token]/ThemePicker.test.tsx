import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ThemePicker from './ThemePicker'
import SubKategoriPicker from './SubKategoriPicker'

const noop = () => {}

describe('ThemePicker (S0-3)', () => {
  it('render gaya Kuliner = flagship lux (Tungku/Pamor)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="kuliner" value="" onChange={noop} />,
    )
    expect(html).toContain('Tungku')
    expect(html).toContain('Pamor')
    expect(html).toContain('#A8381A') // swatch mood tungku ter-inject
  })

  it('render varian Fashion → Atelier (Noir/Ivoire) dengan nama + swatch', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="fashion" value="" onChange={noop} />,
    )
    expect(html).toContain('Noir')
    expect(html).toContain('Ivoire')
    expect(html).toContain('#1C1916') // swatch mood noir ter-inject
  })

  it('render gaya Kerajinan = flagship lux (Tanah Loka)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="kerajinan" value="" onChange={noop} />,
    )
    expect(html).toContain('Tanah Loka')
    expect(html).toContain('#1E3A2F') // swatch mood tanah ter-inject
  })

  it('sub-kategori tak dikenal → render kosong (null)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="tidak-ada" value="" onChange={noop} />,
    )
    expect(html).toBe('')
  })

  it('menandai tema terpilih (aria-pressed)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="toko_online" subKategori="kuliner" value="kuliner-tungku" onChange={noop} />,
    )
    expect(html).toContain('aria-pressed="true"')
  })
})

describe('SubKategoriPicker — aktif untuk toko_online (S1-5)', () => {
  it('menampilkan sub-kategori lux yang ready + opsi "Lainnya" untuk toko_online', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="toko_online" value="" onChange={noop} />,
    )
    // Lux bespoke yang sudah ship: Kuliner + Fashion + Kerajinan + Kecantikan (Embun)
    // + Gadget (Onyx) + Rumah (Selaras). Sisanya ready:false (sembunyi).
    expect(html).toContain('Kuliner / Makanan')
    expect(html).toContain('Fashion / Pakaian')
    expect(html).toContain('Kerajinan / Heritage')
    expect(html).toContain('Kecantikan / Skincare')
    expect(html).toContain('Elektronik / Gadget')
    expect(html).toContain('Rumah & Dekor')
    expect(html).toContain('Lainnya (gaya umum)')
    // Sub-kategori yang belum bespoke disembunyikan (ready:false)
    expect(html).not.toContain('Kesehatan & Herbal')
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
