import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ComposableRenderer from './ComposableRenderer'
import { MANIFESTS, type ComposableContent, type ThemeManifest } from '@/lib/theme-system/manifest'

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
      // article-feed (blog) sengaja tak render harga (artikel bukan produk); varian lain tetap.
      if (manifest.blocks.showcase !== 'article-feed') {
        expect(html).toContain('Rp15.000') // harga terformat
      }
      // Features kini OPSIONAL per manifest (manifest.sections). Tema lux yang
      // memimpin dengan beat lain (statement/showcase/gallery) boleh tanpa
      // section features → cek hanya bila section ini memang dirender.
      const hasFeatures = !manifest.sections || manifest.sections.includes('features')
      if (hasFeatures) {
        expect(html).toContain('Homemade Harian') // features (keunggulan)
        expect(html).toContain('Mengapa Memilih Kami') // heading features (fallback non-generik; konten bisa override)
      }
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
    // Manifest minimal (hanya hero/features/showcase) — uji gating renderer langsung,
    // tak bergantung pada manifest registry tertentu tetap "polos".
    const bare: ThemeManifest = {
      id: 'bare-test', label: 'Bare', basePackId: 'kuliner-rustic',
      blocks: { hero: 'centered', features: 'grid', showcase: 'menu-list' },
    }
    const html = renderToStaticMarkup(<ComposableRenderer manifest={bare} content={CONTENT_FULL} />)
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

describe('Sprint 7 — sekolah', () => {
  it('registry memuat 9 manifest sekolah', () => {
    const keys = Object.keys(MANIFESTS)
    for (const id of [
      'reguler-cerdas', 'reguler-ceria', 'reguler-prestasi',
      'islami-hijau', 'islami-emas', 'islami-malam',
      'kursus-fokus', 'kursus-energi', 'kursus-malam',
    ]) {
      expect(keys).toContain(id)
    }
  })

  it('9 gaya sekolah render tanpa error + data-theme + balok aktif', () => {
    for (const id of [
      'reguler-cerdas', 'reguler-ceria', 'reguler-prestasi',
      'islami-hijau', 'islami-emas', 'islami-malam',
      'kursus-fokus', 'kursus-energi', 'kursus-malam',
    ]) {
      const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS[id]} content={CONTENT_GALLERY} />)
      expect(html).toContain(`data-theme="${id}"`)
      expect(html.length).toBeGreaterThan(300)
    }
  })

  it('reguler-cerdas: showcase+stats+testimoni+gallery+info+faq dari konten', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['reguler-cerdas']} content={CONTENT_GALLERY} />)
    expect(html).toContain('Tahun melayani') // stats label dari CONTENT_FULL
    expect(html).toContain('Dipercaya Pelanggan Kami') // testimoni cards
    expect(html).toContain('ce-masonry') // gallery masonry aktif (manifest gallery:'masonry')
    expect(html).toContain('output=embed') // info-lokasi
    expect(html).toContain('Jam berapa buka?') // FAQ
  })
})

describe('Sprint 8a — personal', () => {
  it('registry memuat 9 manifest personal', () => {
    const keys = Object.keys(MANIFESTS)
    for (const id of [
      'kreator-spotlight', 'kreator-pop', 'kreator-clean',
      'profesional-korporat', 'profesional-mono', 'profesional-warm',
      'coach-energi', 'coach-tenang', 'coach-prestige',
    ]) {
      expect(keys).toContain(id)
    }
  })

  it('9 gaya personal render tanpa error + data-theme benar', () => {
    for (const id of [
      'kreator-spotlight', 'kreator-pop', 'kreator-clean',
      'profesional-korporat', 'profesional-mono', 'profesional-warm',
      'coach-energi', 'coach-tenang', 'coach-prestige',
    ]) {
      const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS[id]} content={CONTENT_GALLERY} />)
      expect(html).toContain(`data-theme="${id}"`)
      expect(html.length).toBeGreaterThan(300)
    }
  })
})

describe('Sprint 8b — company', () => {
  it('registry memuat 9 manifest company', () => {
    const keys = Object.keys(MANIFESTS)
    for (const id of [
      'startup-aurora', 'startup-midnight', 'startup-mint',
      'agency-bold', 'agency-noir', 'agency-prisma',
      'korporat-biru', 'korporat-slate', 'korporat-netral',
    ]) {
      expect(keys).toContain(id)
    }
  })

  it('9 gaya company render tanpa error + data-theme benar', () => {
    for (const id of [
      'startup-aurora', 'startup-midnight', 'startup-mint',
      'agency-bold', 'agency-noir', 'agency-prisma',
      'korporat-biru', 'korporat-slate', 'korporat-netral',
    ]) {
      const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS[id]} content={CONTENT_GALLERY} />)
      expect(html).toContain(`data-theme="${id}"`)
      expect(html.length).toBeGreaterThan(300)
    }
  })
})

// ── Sprint A — Trust layer balok baru ────────────────────────
const TEAM_CONTENT: ComposableContent = {
  ...CONTENT,
  team: [
    { nama: 'Dr. Sari Dewi', peran: 'Dokter Umum', foto: 'https://x.test/sari.jpg', bio: 'Berpengalaman 10 tahun di bidang kesehatan keluarga.' },
    { nama: 'Dr. Budi Santoso', peran: 'Spesialis Penyakit Dalam', bio: 'Lulusan FK UI, spesialisasi sejak 2014.' },
    { nama: 'Perawat Ani', peran: 'Kepala Perawat' },
  ],
  about: {
    title: 'Klinik Terpercaya Keluarga',
    body: 'Sejak 2010 kami melayani ribuan pasien dengan pelayanan terbaik.',
    image: 'https://x.test/klinik-foto.jpg',
    ctaText: 'Buat Janji',
    ctaHref: '#janji',
  },
  features: [
    { title: 'Dokter Berpengalaman', desc: 'Tim dokter rata-rata 10 tahun pengalaman.', image: 'https://x.test/feat1.jpg' },
    { title: 'Peralatan Modern', desc: 'Alat diagnosis terkini untuk hasil akurat.' },
    { title: 'Layanan 7 Hari', desc: 'Buka setiap hari termasuk hari libur.' },
  ],
}

describe('Sprint A — Team / About / Zigzag', () => {
  // helper: manifest inline dengan block override
  const withBlocks = (id: string, extra: Partial<ThemeManifest['blocks']>): ThemeManifest => ({
    ...MANIFESTS[id],
    blocks: { ...MANIFESTS[id].blocks, ...extra },
  })

  it('team grid: merender nama + peran semua anggota', () => {
    const m = withBlocks('umum-bluecare', { team: 'grid' })
    const html = renderToStaticMarkup(<ComposableRenderer manifest={m} content={TEAM_CONTENT} />)
    expect(html).toContain('Dr. Sari Dewi')
    expect(html).toContain('Dokter Umum')
    expect(html).toContain('Dr. Budi Santoso')
    expect(html).toContain('Perawat Ani')
    expect(html).toContain('ce-team-card')
  })

  it('team grid: foto ter-render sebagai <img> bila ada URL', () => {
    const m = withBlocks('umum-bluecare', { team: 'grid' })
    const html = renderToStaticMarkup(<ComposableRenderer manifest={m} content={TEAM_CONTENT} />)
    expect(html).toContain('https://x.test/sari.jpg')
  })

  it('team grid: fallback inisial bila foto kosong (Perawat Ani)', () => {
    const m = withBlocks('umum-bluecare', { team: 'grid' })
    const html = renderToStaticMarkup(<ComposableRenderer manifest={m} content={TEAM_CONTENT} />)
    // Inisial "PA" dari "Perawat Ani"
    expect(html).toContain('PA')
  })

  it('team spotlight: featured punya bio ditampilkan + pendukung tanpa bio besar', () => {
    const m = withBlocks('umum-bluecare', { team: 'spotlight' })
    const html = renderToStaticMarkup(<ComposableRenderer manifest={m} content={TEAM_CONTENT} />)
    expect(html).toContain('Berpengalaman 10 tahun') // bio featured
    expect(html).toContain('ce-team-bio-reveal')       // hover reveal container
  })

  it('team horizontal: semua anggota di scroll strip', () => {
    const m = withBlocks('umum-bluecare', { team: 'horizontal' })
    const html = renderToStaticMarkup(<ComposableRenderer manifest={m} content={TEAM_CONTENT} />)
    expect(html).toContain('ce-team-scroll')
    expect(html).toContain('ce-team-scroll-item')
    expect(html).toContain('Perawat Ani')
  })

  it('team TAK dirender bila manifest tak punya slot team (nol regresi)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={TEAM_CONTENT} />)
    expect(html).not.toContain('Dr. Sari Dewi')
    expect(html).not.toContain('Kenali Tim di Balik Layanan Kami')
  })

  it('team TAK dirender bila content.team kosong walau manifest aktif', () => {
    const m = withBlocks('umum-bluecare', { team: 'grid' })
    const html = renderToStaticMarkup(<ComposableRenderer manifest={m} content={CONTENT} />)
    expect(html).not.toContain('Kenali Tim di Balik Layanan Kami')
  })

  it('about split-right: gambar + teks + CTA ter-render', () => {
    const m = withBlocks('kuliner-rustic', { about: 'split-right' })
    const html = renderToStaticMarkup(<ComposableRenderer manifest={m} content={TEAM_CONTENT} />)
    expect(html).toContain('https://x.test/klinik-foto.jpg')
    expect(html).toContain('Klinik Terpercaya Keluarga')
    expect(html).toContain('Buat Janji')
    expect(html).toContain('Tentang Kami') // eyebrow
  })

  it('about split-left: gambar + teks (urutan terbalik dari split-right)', () => {
    const mRight = withBlocks('kuliner-rustic', { about: 'split-right' })
    const mLeft  = withBlocks('kuliner-rustic', { about: 'split-left' })
    const right = renderToStaticMarkup(<ComposableRenderer manifest={mRight} content={TEAM_CONTENT} />)
    const left  = renderToStaticMarkup(<ComposableRenderer manifest={mLeft}  content={TEAM_CONTENT} />)
    // Keduanya punya gambar + judul, tapi markup berbeda (urutan div berbeda)
    expect(left).toContain('https://x.test/klinik-foto.jpg')
    expect(right).not.toBe(left)
  })

  it('about story: gambar 16:7 + teks centered', () => {
    const m = withBlocks('kuliner-rustic', { about: 'story' })
    const html = renderToStaticMarkup(<ComposableRenderer manifest={m} content={TEAM_CONTENT} />)
    expect(html).toContain('https://x.test/klinik-foto.jpg')
    expect(html).toContain('16/7') // aspect-ratio story
    expect(html).toContain('Klinik Terpercaya Keluarga')
  })

  it('about text (default): nol regresi — judul tetap muncul tanpa gambar', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={TEAM_CONTENT} />)
    expect(html).toContain('Klinik Terpercaya Keluarga')
    // Tidak pakai split karena manifest tak punya about variant
    expect(html).not.toContain('split-right')
  })

  it('features zigzag: nomor watermark + teks tiap item', () => {
    const m = withBlocks('startup-aurora', { features: 'zigzag' })
    const html = renderToStaticMarkup(<ComposableRenderer manifest={m} content={TEAM_CONTENT} />)
    expect(html).toContain('ce-zigzag-item')
    expect(html).toContain('Dokter Berpengalaman')
    expect(html).toContain('Peralatan Modern')
    // Gambar feat1 ter-render
    expect(html).toContain('https://x.test/feat1.jpg')
  })

  it('features zigzag TAK aktif bila manifest pakai grid/rows (nol regresi)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={TEAM_CONTENT} />)
    // Hanya FeaturesZigzag yang render gambar fitur — grid/rows tidak
    expect(html).not.toContain('https://x.test/feat1.jpg')
  })

  it('umum-bluecare (updated manifest): team spotlight aktif saat ada data tim', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['umum-bluecare']} content={TEAM_CONTENT} />)
    expect(html).toContain('ce-team-card')
    expect(html).toContain('Dr. Sari Dewi')
  })

  it('startup-aurora (updated manifest): zigzag + team grid + about split-right', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['startup-aurora']} content={TEAM_CONTENT} />)
    expect(html).toContain('ce-zigzag-item')
    expect(html).toContain('ce-team-card')
    expect(html).toContain('https://x.test/klinik-foto.jpg') // about split-right
  })
})

// Konten konversi — pricing/process/cta untuk Sprint B.
const CONV_CONTENT: ComposableContent = {
  ...CONTENT,
  pricing: {
    title: 'Pilih Paket Belajar',
    subtitle: 'Harga transparan, tanpa biaya tersembunyi.',
    plans: [
      { nama: 'Reguler', harga: 'Rp250rb', periode: '/bulan', desc: 'Untuk pemula.', fitur: ['8x pertemuan', 'Modul digital'], ctaText: 'Daftar Reguler', ctaHref: '#reg' },
      { nama: 'Intensif', harga: 'Rp450rb', periode: '/bulan', desc: 'Paling diminati.', fitur: ['8x pertemuan', 'Modul digital', 'Konsultasi 1-on-1', 'Garansi nilai'], unggulan: true, ctaText: 'Daftar Intensif', ctaHref: '#int' },
      { nama: 'Privat', harga: 'Rp900rb', periode: '/bulan', desc: 'Belajar eksklusif.', fitur: ['12x pertemuan', 'Konsultasi 1-on-1'], ctaText: 'Daftar Privat', ctaHref: '#priv' },
    ],
  },
  process: {
    title: 'Cara Mulai Belajar',
    steps: [
      { judul: 'Konsultasi Awal', desc: 'Diskusi kebutuhan belajarmu.' },
      { judul: 'Pilih Jadwal', desc: 'Tentukan waktu yang pas.' },
      { judul: 'Mulai Kelas', desc: 'Belajar bersama mentor.' },
    ],
  },
  cta: { title: 'Siap Mulai?', subtitle: 'Gabung sekarang.', ctaText: 'Daftar', ctaHref: '#daftar', image: 'https://x.test/cta-foto.jpg' },
}

describe('Sprint B — Pricing / Process / CTA varian', () => {
  const withBlocks = (id: string, extra: Partial<ThemeManifest['blocks']>): ThemeManifest => ({
    ...MANIFESTS[id],
    blocks: { ...MANIFESTS[id].blocks, ...extra },
  })
  const render = (m: ThemeManifest, c: ComposableContent) =>
    renderToStaticMarkup(<ComposableRenderer manifest={m} content={c} />)

  // ── PRICING ──
  it('pricing cards: render semua paket + harga + badge unggulan + fitur', () => {
    const html = render(withBlocks('kuliner-rustic', { pricing: 'cards' }), CONV_CONTENT)
    expect(html).toContain('Reguler')
    expect(html).toContain('Intensif')
    expect(html).toContain('Privat')
    expect(html).toContain('Rp450rb')
    expect(html).toContain('Paling Populer')      // badge default plan.unggulan
    expect(html).toContain('Konsultasi 1-on-1')   // fitur
    expect(html).toContain('ce-pcard feat')       // class spasi hanya di markup (bukan CSS)
  })

  it('pricing table: gabungan fitur jadi baris perbandingan semua paket', () => {
    const html = render(withBlocks('kuliner-rustic', { pricing: 'table' }), CONV_CONTENT)
    expect(html).toContain('Garansi nilai')   // fitur khusus Intensif → tetap jadi baris
    expect(html).toContain('8x pertemuan')    // fitur bersama
    expect(html).toContain('12x pertemuan')   // fitur khusus Privat
    expect(html).toContain('Reguler')
    expect(html).toContain('Privat')
  })

  it('pricing single: pilih paket unggulan (Intensif), bukan paket lain', () => {
    const html = render(withBlocks('kuliner-rustic', { pricing: 'single' }), CONV_CONTENT)
    expect(html).toContain('Intensif')
    expect(html).toContain('Rp450rb')
    expect(html).not.toContain('Reguler') // single hanya render 1 paket
    expect(html).not.toContain('Privat')
  })

  it('pricing TAK dirender bila manifest tak punya slot (nol regresi)', () => {
    const html = render(MANIFESTS['kuliner-rustic'], CONV_CONTENT)
    expect(html).not.toContain('Pilih Paket Belajar') // judul pricing
    expect(html).not.toContain('Paling Populer')
  })

  it('pricing TAK dirender bila content.pricing kosong walau manifest aktif', () => {
    const html = render(withBlocks('kuliner-rustic', { pricing: 'cards' }), CONTENT)
    expect(html).not.toContain('Paket & Harga') // eyebrow pricing
  })

  // ── PROCESS ──
  it('process horizontal: render judul tiap langkah', () => {
    const html = render(withBlocks('kuliner-rustic', { process: 'horizontal' }), CONV_CONTENT)
    expect(html).toContain('Cara Mulai Belajar')
    expect(html).toContain('Konsultasi Awal')
    expect(html).toContain('Pilih Jadwal')
    expect(html).toContain('Mulai Kelas')
  })

  it('process timeline: render linimasa vertikal (ce-tl-item di markup)', () => {
    const html = render(withBlocks('kuliner-rustic', { process: 'timeline' }), CONV_CONTENT)
    expect(html).toContain('ce-tl-item')
    expect(html).toContain('Konsultasi Awal')
  })

  it('process cards: render kartu langkah', () => {
    const html = render(withBlocks('kuliner-rustic', { process: 'cards' }), CONV_CONTENT)
    expect(html).toContain('Cara Mulai Belajar')
    expect(html).toContain('Mulai Kelas')
  })

  it('process TAK dirender bila manifest tak punya slot (nol regresi)', () => {
    const html = render(MANIFESTS['kuliner-rustic'], CONV_CONTENT)
    expect(html).not.toContain('Cara Mulai Belajar')
    expect(html).not.toContain('Konsultasi Awal')
  })

  // ── CTA VARIAN ──
  it('cta split: render gambar (unik untuk varian split) + judul', () => {
    const html = render(withBlocks('kuliner-rustic', { cta: 'split' }), CONV_CONTENT)
    expect(html).toContain('https://x.test/cta-foto.jpg') // hanya split render cta.image
    expect(html).toContain('Siap Mulai?')
  })

  it('cta banner: markup beda dari card default + tetap render judul', () => {
    const banner = render(withBlocks('kuliner-rustic', { cta: 'banner' }), CONV_CONTENT)
    const card = render(MANIFESTS['kuliner-rustic'], CONV_CONTENT) // tanpa varian = card
    expect(banner).toContain('Siap Mulai?')
    expect(banner).not.toBe(card)
    expect(banner).not.toContain('https://x.test/cta-foto.jpg') // banner tak render gambar
  })

  it('cta default (card): nol regresi — render judul tanpa gambar', () => {
    const html = render(MANIFESTS['kuliner-rustic'], CONV_CONTENT)
    expect(html).toContain('Siap Mulai?')
    expect(html).not.toContain('https://x.test/cta-foto.jpg') // card tak render cta.image
  })

  // ── MANIFEST TERUPDATE ──
  it('startup-aurora (updated): pricing cards + process horizontal aktif', () => {
    const html = render(MANIFESTS['startup-aurora'], CONV_CONTENT)
    expect(html).toContain('Intensif')        // pricing
    expect(html).toContain('Konsultasi Awal') // process
  })

  it('coach-prestige (updated): pricing single pilih unggulan', () => {
    const html = render(MANIFESTS['coach-prestige'], CONV_CONTENT)
    expect(html).toContain('Intensif')
    expect(html).not.toContain('Reguler') // single → 1 paket saja
  })

  it('startup-midnight (updated): pricing table aktif', () => {
    const html = render(MANIFESTS['startup-midnight'], CONV_CONTENT)
    expect(html).toContain('Garansi nilai') // baris fitur tabel
    expect(html).toContain('Reguler')
    expect(html).toContain('Privat')
  })
})

// ── Sprint C — Partners / Social ─────────────────────────────
const SOCIAL_CONTENT: ComposableContent = {
  ...CONTENT,
  partners: {
    title: 'Dipercaya Oleh',
    logos: [
      { nama: 'Tokopedia', href: 'https://tokopedia.com' },
      { nama: 'Gojek' },
      { nama: 'BrandLogo', logo: 'https://x.test/logo.png' },
    ],
  },
  social: {
    title: 'Ikuti Kami',
    links: [
      { platform: 'instagram', href: 'https://ig.test/akun', label: '@akun' },
      { platform: 'tiktok', href: 'https://tiktok.test/akun' },
      { platform: 'shopee', href: 'https://shopee.test/toko' },
    ],
  },
}

describe('Sprint C — Partners / Social', () => {
  const withBlocks = (id: string, extra: Partial<ThemeManifest['blocks']>): ThemeManifest => ({
    ...MANIFESTS[id],
    blocks: { ...MANIFESTS[id].blocks, ...extra },
  })
  const render = (m: ThemeManifest, c: ComposableContent) =>
    renderToStaticMarkup(<ComposableRenderer manifest={m} content={c} />)

  it('partners grid: render nama logo + link + <img> utk yg punya logo URL', () => {
    const html = render(withBlocks('kuliner-rustic', { partners: 'grid' }), SOCIAL_CONTENT)
    expect(html).toContain('Dipercaya Oleh')           // judul partners
    expect(html).toContain('Tokopedia')
    expect(html).toContain('Gojek')
    expect(html).toContain('https://tokopedia.com')     // href
    expect(html).toContain('https://x.test/logo.png')   // <img> utk yg punya logo
  })

  it('partners marquee: logo digandakan untuk loop mulus', () => {
    const html = render(withBlocks('kuliner-rustic', { partners: 'marquee' }), SOCIAL_CONTENT)
    expect(html).toContain('Dipercaya Oleh')
    // marquee menggandakan daftar → src logo muncul 2× (src hanya di <img>, bukan aria-label)
    expect(html.split('https://x.test/logo.png').length - 1).toBe(2)
  })

  it('social: render label tiap platform; pakai label custom bila ada', () => {
    const html = render(withBlocks('kuliner-rustic', { social: true }), SOCIAL_CONTENT)
    expect(html).toContain('Ikuti Kami')   // judul social
    expect(html).toContain('@akun')        // label custom instagram
    expect(html).toContain('TikTok')       // label default
    expect(html).toContain('Shopee')
    expect(html).toContain('https://ig.test/akun')
  })

  it('partners TAK dirender bila manifest tak punya slot (nol regresi)', () => {
    const html = render(MANIFESTS['kuliner-modern'], SOCIAL_CONTENT) // kuliner-modern tanpa partners
    expect(html).not.toContain('Dipercaya Oleh')
  })

  it('social TAK dirender bila content.social kosong walau manifest aktif', () => {
    const html = render(withBlocks('kuliner-rustic', { social: true }), CONTENT) // CONTENT tanpa social
    expect(html).not.toContain('Ikuti Kami')
  })

  it('kuliner-rustic (updated): social aktif saat ada data', () => {
    const html = render(MANIFESTS['kuliner-rustic'], SOCIAL_CONTENT)
    expect(html).toContain('Ikuti Kami')
    expect(html).toContain('@akun')
  })

  it('startup-aurora (updated): partners grid aktif', () => {
    const html = render(MANIFESTS['startup-aurora'], SOCIAL_CONTENT)
    expect(html).toContain('Dipercaya Oleh')
    expect(html).toContain('Tokopedia')
  })
})

describe('Sprint 9 — travel / blog / jastip', () => {
  const ALL_S9 = [
    'kendaraan-asphalt', 'kendaraan-bersih', 'kendaraan-kuning',
    'wisata-tropis', 'wisata-rimba', 'wisata-senja',
    'akomodasi-resort', 'akomodasi-kayu', 'akomodasi-malam',
    'jurnal-hangat', 'jurnal-mono', 'jurnal-senja',
    'media-merah', 'media-biru', 'media-malam',
    'niche-hijau', 'niche-pop', 'niche-gelap',
    'luar-global', 'luar-premium', 'luar-pop',
    'lokal-hangat', 'lokal-segar', 'lokal-gelap',
    'preorder-fokus', 'preorder-energi', 'preorder-malam',
  ]

  it('registry memuat 27 manifest Sprint 9', () => {
    const keys = Object.keys(MANIFESTS)
    for (const id of ALL_S9) expect(keys).toContain(id)
  })

  it('27 gaya Sprint 9 render tanpa error + data-theme benar', () => {
    for (const id of ALL_S9) {
      const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS[id]} content={CONTENT_GALLERY} />)
      expect(html).toContain(`data-theme="${id}"`)
      expect(html.length).toBeGreaterThan(300)
    }
  })
})

// ── Sprint 10a — Showcase khas-industri ──────────────────────
const CONTENT_SERVICE: ComposableContent = {
  ...CONTENT,
  showcase: {
    title: 'Layanan Kami',
    items: [
      { nama: 'Pemeriksaan Umum', harga: 50000, desc: 'Konsultasi dokter umum.', kategori: 'Pemeriksaan', durasi: 30 },
      { nama: 'Perawatan Gigi', harga: 150000, desc: 'Scaling & tambal.', kategori: 'Gigi & Mulut', durasi: 45 },
      { nama: 'Vaksinasi', harga: 200000, desc: 'Imunisasi anak & dewasa.', kategori: 'Pemeriksaan', durasi: 20 },
    ],
  },
}
const CONTENT_ARTIKEL: ComposableContent = {
  ...CONTENT,
  showcase: {
    title: 'Artikel Terbaru',
    items: [
      { nama: 'Belajar Pelan dari Hujan', desc: 'Refleksi sore yang basah.', gambar: 'https://x.test/art.jpg', penulis: 'Laras', tanggal: '2026-06-02' },
      { nama: 'Tentang Memulai Lagi', desc: 'Sedikit soal keberanian.', penulis: 'Laras', tanggal: '2026-04-28' },
    ],
  },
}
const CONTENT_MENU: ComposableContent = {
  ...CONTENT,
  showcase: {
    title: 'Menu Andalan',
    items: [
      { nama: 'Ayam Goreng', harga: 18000, desc: 'Kremes gurih.', kategori: 'Makanan Utama' },
      { nama: 'Soto Daging', harga: 20000, desc: 'Kuah bening.', kategori: 'Makanan Utama' },
      { nama: 'Es Teh', harga: 5000, desc: 'Manis pas.', kategori: 'Minuman' },
    ],
  },
}

describe('Sprint 10a — showcase khas-industri', () => {
  it('default manifest: klinik→service-list, blog→article-feed, resto→menu-board', () => {
    expect(MANIFESTS['umum-bluecare'].blocks.showcase).toBe('service-list')
    expect(MANIFESTS['estetik-rosegold'].blocks.showcase).toBe('service-list')
    expect(MANIFESTS['wellness-forest'].blocks.showcase).toBe('service-list')
    expect(MANIFESTS['jurnal-hangat'].blocks.showcase).toBe('article-feed')
    expect(MANIFESTS['media-merah'].blocks.showcase).toBe('article-feed')
    expect(MANIFESTS['niche-gelap'].blocks.showcase).toBe('article-feed')
    expect(MANIFESTS['warung-rakyat'].blocks.showcase).toBe('menu-board')
    expect(MANIFESTS['finedining-aurum'].blocks.showcase).toBe('menu-board')
  })

  // Catatan: nama kelas (ce-svc-row dll) SELALU ada di <style>; untuk menguji
  // RENDER elemen, assert bentuk atribut `class="..."` (bukan selektor CSS).
  it('service-list: durasi + kategori grouping + harga (umum-bluecare)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['umum-bluecare']} content={CONTENT_SERVICE} />)
    expect(html).toContain('class="ce-svc-row"')
    expect(html).toContain('class="ce-meta-pill"') // badge durasi ter-render
    expect(html).toContain('menit')                // teks durasi
    expect(html).toContain('Rp50.000')             // harga layanan
    expect(html).toContain('Pemeriksaan')          // header kategori
    expect(html).toContain('Gigi &amp; Mulut')     // header kategori (escaped &)
    expect(html).toContain('class="ce-cat-head"')
  })

  it('article-feed: penulis + tanggal + tanpa harga (jurnal-hangat)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['jurnal-hangat']} content={CONTENT_ARTIKEL} />)
    expect(html).toContain('class="ce-art-card"')
    expect(html).toContain('Laras')             // penulis
    expect(html).toContain('2 Jun 2026')        // tanggal terformat (UTC-stabil)
    expect(html).toContain('Baca selengkapnya')
    expect(html).toContain('https://x.test/art.jpg') // cover ada
    expect(html).not.toContain('Rp')            // artikel tak punya harga
  })

  it('menu-board: grouping kategori + harga (warung-rakyat)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['warung-rakyat']} content={CONTENT_MENU} />)
    expect(html).toContain('class="ce-mb-row"')
    expect(html).toContain('class="ce-cat-head"')
    expect(html).toContain('Makanan Utama')
    expect(html).toContain('Minuman')
    expect(html).toContain('Rp18.000')
  })

  it('grouping: tanpa kategori → satu grup tanpa header (nol regresi)', () => {
    // CONTENT (pempek) tak punya kategori → service-list render rows tanpa header kategori
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['umum-bluecare']} content={CONTENT} />)
    expect(html).toContain('class="ce-svc-row"')
    expect(html).not.toContain('class="ce-cat-head"') // elemen header tak dirender (CSS-nya tetap ada)
    expect(html).toContain('Pempek Kapal Selam')
  })

  it('cafe-latte tetap card-grid (variasi intra-industri terjaga)', () => {
    expect(MANIFESTS['cafe-latte'].blocks.showcase).toBe('card-grid')
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['cafe-latte']} content={CONTENT_MENU} />)
    expect(html).toContain('class="ce-card"')
  })
})

// ── Craft upgrade — mood/layout-aware + heading konten + statement ──
describe('Craft upgrade (anti-slop)', () => {
  it('inject craft vars + data-mood dari pack (luxury → align kiri)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['finedining-aurum']} content={CONTENT} />)
    expect(html).toContain('data-mood="luxury"')
    expect(html).toContain('--sec-align:left')   // finedining-aurum layout.align = left
    expect(html).toContain('--sec-pad-y')         // ritme whitespace dari pack
  })

  it('align center untuk pack yang memang center (warung-rakyat)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['warung-rakyat']} content={CONTENT} />)
    expect(html).toContain('--sec-align:center')
  })

  it('heading features dari konten bila ada; fallback non-generik bila tidak', () => {
    const withHead = { ...CONTENT, featuresEyebrow: 'Mengapa Meja Nusantara', featuresTitle: 'Pengalaman, bukan sekadar santapan' }
    const a = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['finedining-aurum']} content={withHead} />)
    expect(a).toContain('Pengalaman, bukan sekadar santapan')
    expect(a).toContain('Mengapa Meja Nusantara')
    expect(a).not.toContain('Mengapa Memilih Kami')
    // tanpa konten → fallback (bukan "Mengapa Kami" generik lama)
    const b = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['finedining-aurum']} content={CONTENT} />)
    expect(b).toContain('Mengapa Memilih Kami')
    expect(b).not.toContain('Mengapa Kami<') // string generik lama benar2 hilang
  })

  it('statement band render bila slot + konten ada (finedining-aurum)', () => {
    const withStmt = { ...CONTENT, statement: { eyebrow: 'Filosofi Dapur', quote: 'Kami merawatnya, satu piring pada satu waktu.', cite: 'Chef Anindya' } }
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['finedining-aurum']} content={withStmt} />)
    expect(html).toContain('class="ce-statement"')
    expect(html).toContain('Kami merawatnya, satu piring pada satu waktu.')
    expect(html).toContain('Filosofi Dapur')
  })

  it('statement TAK render bila slot off walau konten ada (nol regresi)', () => {
    const withStmt = { ...CONTENT, statement: { quote: 'X kalimat filosofi' } }
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={withStmt} />)
    expect(html).not.toContain('class="ce-statement"')
    expect(html).not.toContain('X kalimat filosofi')
  })
})

// ── Craft round 2 — human-centric + cinematic hero + menu tabs (referensi resto) ──
describe('Craft round 2 (referensi situs resto)', () => {
  it('team "Di Balik Dapur": heading dari konten + anggota (finedining-aurum spotlight)', () => {
    const c = {
      ...CONTENT,
      teamEyebrow: 'Di Balik Dapur',
      teamTitle: 'Tim yang Menyiapkan Malam Anda',
      team: [
        { nama: 'Chef Anindya Larasati', peran: 'Kepala Dapur', bio: 'Dua puluh tahun memasak Nusantara.' },
        { nama: 'Bagas Wirawan', peran: 'Sous Chef' },
      ],
    }
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['finedining-aurum']} content={c} />)
    expect(html).toContain('id="tim"')
    expect(html).toContain('Tim yang Menyiapkan Malam Anda') // heading dari konten
    expect(html).toContain('Di Balik Dapur')                 // eyebrow dari konten
    expect(html).toContain('Chef Anindya Larasati')
    expect(html).toContain('Kepala Dapur')
    expect(html).not.toContain('Kenali Tim Ahli Kami')        // default generik tak dipakai
  })

  it('menu category tabs render untuk menu-board multi-kategori (warung-rakyat)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['warung-rakyat']} content={CONTENT_MENU} />)
    expect(html).toContain('class="ce-menu-tab"')
    expect(html).toContain('href="#menu-makanan-utama"')
    expect(html).toContain('id="menu-minuman"')
  })

  it('hero sinematik: kelas ce-hero-fb + scroll cue (fullbleed)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['finedining-aurum']} content={CONTENT} />)
    expect(html).toContain('class="ce-hero-fb"')
    expect(html).toContain('ce-hero-cue')
  })

  it('nav sadar-konten memuat tautan #tim saat ada tim', () => {
    const c = { ...CONTENT, teamTitle: 'Tim Dapur', team: [{ nama: 'A', peran: 'Chef' }] }
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['finedining-aurum']} content={c} />)
    expect(html).toContain('href="#tim"')
  })
})

// ── Panen flagship toko-atelier → varian interaktif (ce-script.ts) ──
// CATATAN: ENGINE_CSS ikut ter-render → assert kelas pakai bentuk markup
// `class="..."` supaya tidak false-positive dari selector di <style>.
describe('ComposableRenderer — panen flagship (countUp/carousel/quicklook/duotone)', () => {
  const RICH: ComposableContent = {
    ...CONTENT,
    stats: [
      { angka: '4.9', label: 'Rating' },
      { angka: '12rb+', label: 'Terkirim' },
      { angka: '48 jam', label: 'Kirim' },
    ],
    testimonials: [
      { quote: 'Mantap sekali.', nama: 'Dewi', peran: 'Jakarta' },
      { quote: 'Datang lagi.', nama: 'Budi', peran: 'Bandung' },
      { quote: 'Nampol.', nama: 'Sari' },
    ],
    gallery: {
      title: 'Galeri',
      images: [
        { src: 'https://example.com/a.jpg', caption: 'Dapur' },
        { src: 'https://example.com/b.jpg', caption: 'Ruang' },
        { src: 'https://example.com/c.jpg' },
      ],
    },
  }

  it('lux-toko: script inline sekali + countUp + carousel aria + CTA duotone magnetic', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['lux-toko']} content={RICH} />)
    expect(html.match(/window\.__ceInit=1/g)?.length).toBe(1) // IIFE di-inject sekali
    expect(html.match(/data-cu="true"/g)?.length).toBe(3) // SSR tetap nilai final
    expect(html).toContain('12rb+')
    expect(html).toContain('aria-roledescription="carousel"')
    expect(html).toContain('aria-label="1 dari 3"')
    expect((html.match(/class="ce-dot"/g)?.length ?? 0)).toBe(3)
    expect(html).toContain('class="ce-cta-duo-tint"') // lapis duotone
    expect(html).toContain('ce-btn ce-mag') // tombol magnetic
  })

  it('lux-travel: galeri quicklook — trigger per foto + dialog tunggal aksesibel', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['lux-travel']} content={RICH} />)
    expect((html.match(/class="ce-lb-open"/g)?.length ?? 0)).toBe(3)
    expect(html.match(/role="dialog"/g)?.length).toBe(1)
    expect(html).toContain('aria-modal="true"')
    expect(html).toContain('aria-label="Perbesar foto: Dapur"')
  })

  it('lux-klinik: features sticky-passage dirender dengan baris bernomor', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['lux-klinik']} content={RICH} />)
    expect(html).toContain('class="ce-fsticky-side"')
    expect(html).toContain('class="ce-fsticky-num"')
    expect(html).toContain('Homemade Harian')
  })

  it('CE_JS menggantikan CeReveal pada tema penyuntik (reveal tetap satu jalur)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['lux-toko']} content={RICH} />)
    // reveal hidup di script inline → sample statis ikut beranimasi
    expect(html).toContain("classList.add('ce-in')")
  })

  it('regresi: manifest non-interaktif TIDAK menyuntik script — output bebas CE_JS', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['kuliner-rustic']} content={RICH} />)
    expect(html).not.toContain('window.__ceInit')
    expect(html).not.toContain('data-cu="true"')
    expect(html).not.toContain('class="ce-lb-open"')
  })

  it('regresi: stats tanpa statsCountUp tidak diberi marker data-cu', () => {
    const manifest: ThemeManifest = { ...MANIFESTS['lux-toko'], blocks: { ...MANIFESTS['lux-toko'].blocks, statsCountUp: undefined } }
    const html = renderToStaticMarkup(<ComposableRenderer manifest={manifest} content={RICH} />)
    expect(html).not.toContain('data-cu="true"')
  })
})

// ── Band add-on (newsletter/career) — content.bands dirender additive ──
describe('ComposableRenderer — band add-on (newsletter/career)', () => {
  it('bands dirender dengan data-band + CTA, tanpa mengubah CTA utama', () => {
    const c: ComposableContent = {
      ...CONTENT,
      bands: [
        { preset: 'newsletter', title: 'Tetap Terhubung', subtitle: 'Promo terbaru.', ctaText: 'Berlangganan', ctaHref: 'https://wa.me/628123' },
        { preset: 'career', title: 'Bergabung dengan Tim Kami', ctaText: 'Kirim Lamaran' },
      ],
    }
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['lux-corporate']} content={c} />)
    expect(html).toContain('data-band="newsletter"')
    expect(html).toContain('data-band="career"')
    expect(html).toContain('Tetap Terhubung')
    expect(html).toContain('Berlangganan')
    expect(html).toContain('Lapar?') // CTA utama (duotone) tetap dari content.cta
  })

  it('tanpa bands → nol band (regresi)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['lux-corporate']} content={CONTENT} />)
    expect(html).not.toContain('data-band=')
  })
})

// ── Artikel add-on blog — content.articles dirender additive (pola bands) ──
describe('ComposableRenderer — artikel add-on blog (content.articles)', () => {
  it('articles → article-feed additive di industri non-blog', () => {
    const c: ComposableContent = {
      ...CONTENT,
      articles: {
        title: 'Artikel & Berita',
        items: [{ nama: 'Tips Merawat Batik Tulis', desc: 'Ringkasan singkat.', penulis: 'Admin', tanggal: '2026-01-02' }],
      },
    }
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['lux-corporate']} content={c} />)
    expect(html).toContain('Artikel &amp; Berita') // '&' di-escape renderToStaticMarkup
    expect(html).toContain('Tips Merawat Batik Tulis')
  })

  it('tanpa articles → tak dirender (nol regresi)', () => {
    const html = renderToStaticMarkup(<ComposableRenderer manifest={MANIFESTS['lux-corporate']} content={CONTENT} />)
    expect(html).not.toContain('Tips Merawat Batik Tulis')
  })
})
