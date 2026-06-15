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

  it('render gaya Klinik Umum = flagship bespoke (Klinik Bersih, Wave 2)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="klinik" subKategori="umum" value="" onChange={noop} />,
    )
    expect(html).toContain('Klinik Bersih')
    expect(html).toContain('#2B5BD7') // swatch mood indigo ter-inject
  })

  it('render gaya Klinik Estetik = flagship bespoke (Lumen, Wave 2)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="klinik" subKategori="estetik" value="" onChange={noop} />,
    )
    expect(html).toContain('Lumen')
    expect(html).toContain('#9A5C8E') // swatch mood orchid ter-inject
  })

  it('render gaya Klinik Wellness = flagship bespoke (Sanara, Wave 2)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="klinik" subKategori="wellness" value="" onChange={noop} />,
    )
    expect(html).toContain('Sanara')
    expect(html).toContain('#3E8378') // swatch mood teal ter-inject
  })

  it('render gaya Restaurant Warung = flagship bespoke (Hangat, Wave 2)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="restaurant" subKategori="warung" value="" onChange={noop} />,
    )
    expect(html).toContain('Hangat')
    expect(html).toContain('#C0432E') // swatch mood bata ter-inject
  })

  it('render gaya Restaurant Cafe = flagship bespoke (Seduh, Wave 2)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="restaurant" subKategori="cafe" value="" onChange={noop} />,
    )
    expect(html).toContain('Seduh')
    expect(html).toContain('#A4642E') // swatch mood moka ter-inject
  })

  it('render gaya Restaurant Fine Dining = 3 palet restaurant-lux (Aurum/Hearth/Noir)', () => {
    const html = renderToStaticMarkup(
      <ThemePicker tipe="restaurant" subKategori="finedining" value="" onChange={noop} />,
    )
    expect(html).toContain('Aurum')
    expect(html).toContain('Hearth')
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
    // Wave 1 TOKO TUNTAS — semua 8 sub-kategori toko bespoke + tampil di picker.
    expect(html).toContain('Kuliner / Makanan')
    expect(html).toContain('Fashion / Pakaian')
    expect(html).toContain('Kerajinan / Heritage')
    expect(html).toContain('Kecantikan / Skincare')
    expect(html).toContain('Elektronik / Gadget')
    expect(html).toContain('Rumah &amp; Dekor') // renderToStaticMarkup meng-escape '&'
    expect(html).toContain('Kesehatan &amp; Herbal')
    expect(html).toContain('Bayi &amp; Anak')
    expect(html).toContain('Lainnya (gaya umum)')
  })

  it('klinik (Wave 2 TUNTAS) → picker TAMPIL 3 sub-kat bespoke + opsi "Lainnya", copy industri-aware', () => {
    // umum/estetik/wellness semua ready → SubKategoriPicker muncul utk klinik dgn
    // ketiga sub-kat + escape hatch. Label industri-aware ("Jenis Klinik").
    const html = renderToStaticMarkup(<SubKategoriPicker tipe="klinik" value="" onChange={noop} />)
    expect(html).toContain('Jenis Klinik') // label industri-aware, bukan "Tipe Toko"
    expect(html).toContain('Klinik Umum / Gigi')
    expect(html).toContain('Skincare / Estetik')
    expect(html).toContain('Fisio / Wellness') // Wave 2 #3: wellness kini ready
    expect(html).toContain('Lainnya (gaya umum)')
  })

  it('klinik: kartu umum & escape "Lainnya" TIDAK aktif bersamaan (sentinel ≠ id sub-kat)', () => {
    // Regresi: dulu escape memakai sentinel 'umum' yang bentrok dgn sub-kat klinik
    // 'umum' → dua kartu sama-sama aktif. Kini value='umum' hanya menyalakan SATU.
    const html = renderToStaticMarkup(<SubKategoriPicker tipe="klinik" value="umum" onChange={noop} />)
    expect((html.match(/aria-pressed="true"/g) ?? []).length).toBe(1)
  })

  it('restaurant (Wave 2 TUNTAS) → picker TAMPIL (warung + cafe + finedining + Lainnya), copy "Jenis Restoran"', () => {
    // warung + cafe + finedining semua ready → SubKategoriPicker muncul utk restaurant.
    const html = renderToStaticMarkup(<SubKategoriPicker tipe="restaurant" value="" onChange={noop} />)
    expect(html).toContain('Jenis Restoran') // label industri-aware, bukan "Tipe Toko"
    expect(html).toContain('Warung / Kedai')
    expect(html).toContain('Cafe / Coffee Shop') // cafe kini ready → tampil
    expect(html).toContain('Fine Dining / Resto Keluarga')
    expect(html).toContain('Lainnya (gaya umum)')
  })

  it('non-toko lux-only (sekolah) → picker DISEMBUNYIKAN (langsung kartu Lux)', () => {
    // ready:false utk semua sub-kat → SubKategoriPicker null → brief form langsung
    // tampilkan variant grid (satu kartu Lux), tanpa langkah sub-kategori.
    expect(renderToStaticMarkup(<SubKategoriPicker tipe="sekolah" value="" onChange={noop} />)).toBe('')
  })

  it('tetap dormant untuk industri tanpa sub-kategori (mis. custom)', () => {
    const html = renderToStaticMarkup(
      <SubKategoriPicker tipe="custom" value="" onChange={noop} />,
    )
    expect(html).toBe('')
  })
})
