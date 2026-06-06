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
  features: [
    { title: 'Homemade Harian', desc: 'Dibuat segar tiap hari dari ikan tenggiri asli.' },
    { title: 'Cuko Turun-temurun', desc: 'Racikan khas Palembang yang nampol.' },
    { title: 'Vacuum & Frozen', desc: 'Tahan 1 bulan, aman kirim seluruh Indonesia.' },
  ],
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
  it('registry memuat 3 gaya Kuliner + Fashion', () => {
    const keys = Object.keys(MANIFESTS)
    for (const id of ['kuliner-rustic', 'kuliner-modern', 'kuliner-heritage', 'fashion-editorial', 'fashion-minimal', 'fashion-vibrant']) {
      expect(keys).toContain(id)
    }
  })

  for (const [id, manifest] of Object.entries(MANIFESTS)) {
    it(`render manifest "${id}" tanpa error + memuat konten inti`, () => {
      const html = renderToStaticMarkup(<ComposableRenderer manifest={manifest} content={CONTENT} />)
      expect(html.length).toBeGreaterThan(300)
      expect(html).toContain('Pempek Homemade Asli Palembang') // hero
      expect(html).toContain('Pempek Kapal Selam') // showcase item
      expect(html).toContain('Rp15.000') // harga terformat
      expect(html).toContain('Homemade Harian') // features (keunggulan)
      expect(html).toContain('Mengapa Kami') // heading features
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

  it('foto hero dipakai sebagai background bila ada (S1-2)', () => {
    const withFoto = { ...CONTENT, hero: { ...CONTENT.hero, image: 'https://x.test/pempek.jpg' } }
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={withFoto} />)
    expect(html).toContain('https://x.test/pempek.jpg')
  })

  it('showcase: modern pakai card-grid, rustic pakai menu-list (varian beda)', () => {
    const modern = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-modern']} content={CONTENT} />)
    const rustic = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={CONTENT} />)
    expect(modern).toContain('ce-card')
    expect(rustic).toContain('ce-menu-row')
  })

  it('Fashion Editorial pakai showcase lookbook (S2-2) — spread + kartu portrait', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['fashion-editorial']} content={CONTENT} />)
    expect(html).toContain('ce-look-card') // varian lookbook ter-render
    expect(html).toContain('ce-look-frame')
    expect(html).toContain('Pempek Kapal Selam') // item pertama (featured)
    expect(html).toContain('ce-look-idx') // index editorial khas lookbook
  })

  it('Kerajinan Pusaka: motif kawung ter-render (panen batik), ditint primary', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kerajinan-pusaka']} content={CONTENT} />)
    // tile SVG motif (kawung) hadir sebagai data-uri di overlay hero/footer
    expect(html).toContain('data:image/svg+xml')
    expect(html).toContain('ellipse') // kawung = elips
    // ditint warna primary pusaka (emas #C8922A → tanpa # di data-uri)
    expect(html).toContain('C8922A')
  })

  it('Kerajinan Galeri (motif none) tak menyuntik tile motif', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kerajinan-galeri']} content={CONTENT} />)
    expect(html).not.toContain('data:image/svg+xml')
  })

  it('tema lama tetap polos (nol regresi): kuliner-rustic tanpa motif tile', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={CONTENT} />)
    expect(html).not.toContain('data:image/svg+xml')
  })

  it('lookbook: pakai <img> zoom bila item punya gambar', () => {
    const withImg = {
      ...CONTENT,
      showcase: { title: 'Koleksi', items: [{ nama: 'Look 01', gambar: 'https://x.test/look.jpg', harga: 250000 }] },
    }
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['fashion-editorial']} content={withImg} />)
    expect(html).toContain('ce-look-img')
    expect(html).toContain('https://x.test/look.jpg')
    expect(html).toContain('Rp250.000')
  })
})

// ── Sprint 5 balok + Sprint 4 restaurant ─────────────────────
const CONTENT_FULL: ComposableContent = {
  ...CONTENT,
  stats: [
    { angka: '25+', label: 'Tahun melayani' },
    { angka: '300', label: 'Porsi/hari' },
  ],
  testimonials: [
    { quote: 'Rasanya seperti masakan rumah.', nama: 'Pak Hendra', peran: 'Pelanggan' },
    { quote: 'Porsinya jujur, harganya jujur.', nama: 'Rina', peran: 'Mahasiswa' },
  ],
  faq: [
    { q: 'Jam berapa buka?', a: 'Tiap hari pukul 07.00 sampai habis.' },
  ],
  info: {
    jam: [{ hari: 'Senin – Jumat', jam: '07.00 – 16.00' }],
    alamat: 'Jl. Kaliurang KM 5, Sleman',
    mapsQuery: 'Jl. Kaliurang KM 5 Sleman',
    telp: '081296917963',
    reservasiText: 'Pesan via WhatsApp',
    reservasiHref: '#wa',
  },
}

describe('Sprint 5 balok — stats / testimoni / FAQ / info-lokasi', () => {
  it('registry memuat 9 manifest restaurant', () => {
    const keys = Object.keys(MANIFESTS)
    for (const id of [
      'warung-rakyat', 'warung-sambal', 'warung-angkringan',
      'cafe-latte', 'cafe-roastery', 'cafe-bloom',
      'finedining-aurum', 'finedining-hearth', 'finedining-nordic',
    ]) {
      expect(keys).toContain(id)
    }
  })

  // Catatan: kelas CSS (ce-quote dll) SELALU ada di <style>; assertion pakai
  // teks konten yang hanya muncul saat balok benar-benar dirender.
  it('warung-rakyat (stats+cards+info+faq aktif) merender keempat balok', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['warung-rakyat']} content={CONTENT_FULL} />)
    expect(html).toContain('Tahun melayani') // stats label
    expect(html).toContain('Dipercaya Pelanggan Kami') // judul testimoni cards
    expect(html).toContain('Pak Hendra') // nama testimoni
    expect(html).toContain('Jam berapa buka?') // FAQ
    expect(html).toContain('output=embed') // peta embed tanpa API key
    expect(html).toContain('Jam Operasional') // info-lokasi
  })

  it('testimoni varian beda: spotlight vs marquee vs cards (judul section unik)', () => {
    const spot = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['warung-angkringan']} content={CONTENT_FULL} />)
    const marquee = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['warung-sambal']} content={CONTENT_FULL} />)
    const cards = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['warung-rakyat']} content={CONTENT_FULL} />)
    expect(marquee).toContain('Ribuan Pelanggan Puas') // judul khas marquee
    expect(cards).toContain('Dipercaya Pelanggan Kami') // judul khas cards
    // spotlight: tanpa judul, hanya kutipan pertama besar
    expect(spot).not.toContain('Ribuan Pelanggan Puas')
    expect(spot).not.toContain('Dipercaya Pelanggan Kami')
    expect(spot).toContain('Rasanya seperti masakan rumah.')
  })

  it('balok Sprint 5 TAK dirender bila manifest tak mengaktifkan (nol regresi)', () => {
    // kuliner-rustic tak punya stats/testimoni/faq/info di blocks
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={CONTENT_FULL} />)
    expect(html).not.toContain('Dipercaya Pelanggan Kami') // testimoni
    expect(html).not.toContain('output=embed') // info-lokasi
    expect(html).not.toContain('Tahun melayani') // stats
    expect(html).not.toContain('Jam berapa buka?') // FAQ
  })

  it('balok TAK dirender bila konten kosong walau manifest aktif', () => {
    // warung-rakyat aktifkan stats/testimoni/faq/info, tapi CONTENT polos (tanpa field itu)
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['warung-rakyat']} content={CONTENT} />)
    expect(html).not.toContain('Dipercaya Pelanggan Kami')
    expect(html).not.toContain('output=embed')
  })

  it('9 gaya restaurant render tanpa error + data-theme benar', () => {
    for (const id of [
      'warung-rakyat', 'warung-sambal', 'warung-angkringan',
      'cafe-latte', 'cafe-roastery', 'cafe-bloom',
      'finedining-aurum', 'finedining-hearth', 'finedining-nordic',
    ]) {
      const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS[id]} content={CONTENT_FULL} />)
      expect(html).toContain(`data-theme="${id}"`)
      expect(html.length).toBeGreaterThan(300)
    }
  })
})

// ── Sprint 5b galeri + Sprint 6 klinik ───────────────────────
const CONTENT_GALLERY: ComposableContent = {
  ...CONTENT_FULL,
  gallery: {
    title: 'Galeri',
    images: [
      { src: 'https://x.test/fasilitas1.jpg', caption: 'Ruang tunggu' },
      { src: 'https://x.test/fasilitas2.jpg', caption: 'Ruang periksa' },
    ],
    pairs: [
      { before: 'https://x.test/before1.jpg', after: 'https://x.test/after1.jpg', label: 'Acne — 8 minggu' },
    ],
  },
}

describe('Sprint 5b galeri + Sprint 6 klinik', () => {
  it('registry memuat 9 manifest klinik', () => {
    const keys = Object.keys(MANIFESTS)
    for (const id of [
      'umum-bluecare', 'umum-freshteal', 'umum-trustnavy',
      'estetik-rosegold', 'estetik-derma', 'estetik-noir',
      'wellness-sage', 'wellness-terra', 'wellness-forest',
    ]) {
      expect(keys).toContain(id)
    }
  })

  it('gallery masonry: render foto + caption (umum-bluecare)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['umum-bluecare']} content={CONTENT_GALLERY} />)
    expect(html).toContain('ce-masonry')
    expect(html).toContain('https://x.test/fasilitas1.jpg')
    expect(html).toContain('Ruang tunggu')
    // bukan before-after
    expect(html).not.toContain('https://x.test/before1.jpg')
  })

  it('gallery before-after: render pasangan + label (estetik-rosegold)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['estetik-rosegold']} content={CONTENT_GALLERY} />)
    expect(html).toContain('ce-ba-pair')
    expect(html).toContain('https://x.test/before1.jpg')
    expect(html).toContain('https://x.test/after1.jpg')
    expect(html).toContain('Sebelum')
    expect(html).toContain('Sesudah')
    // bukan masonry
    expect(html).not.toContain('https://x.test/fasilitas1.jpg')
  })

  it('galeri TAK dirender bila manifest tak punya slot gallery (nol regresi)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={CONTENT_GALLERY} />)
    expect(html).not.toContain('https://x.test/fasilitas1.jpg')
    expect(html).not.toContain('https://x.test/before1.jpg')
  })

  it('9 gaya klinik render tanpa error + data-theme benar', () => {
    for (const id of [
      'umum-bluecare', 'umum-freshteal', 'umum-trustnavy',
      'estetik-rosegold', 'estetik-derma', 'estetik-noir',
      'wellness-sage', 'wellness-terra', 'wellness-forest',
    ]) {
      const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS[id]} content={CONTENT_GALLERY} />)
      expect(html).toContain(`data-theme="${id}"`)
      expect(html.length).toBeGreaterThan(300)
    }
  })
})
