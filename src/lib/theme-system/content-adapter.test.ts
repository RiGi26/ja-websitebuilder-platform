import { describe, it, expect } from 'vitest'
import type { PageSection, Product } from '@/types/websitebuilder'
import { composableContentFromSections } from './content-adapter'
import { generateContent } from '@/lib/build/generateContent'

const sections = [
  { tipe_komponen: 'hero_banner', isi_komponen: { title: 'Pempek RIGIZAF', subtitle: 'Asli Palembang' } },
  { tipe_komponen: 'about', isi_komponen: { title: 'Tentang', body: 'Homemade.' } },
] as unknown as PageSection[]

const products = [
  { nama: 'Kapal Selam', harga: 15000, deskripsi: 'telur utuh', gambar_url: null },
  { nama: 'Lenjer', harga: 28000, deskripsi: null, gambar_url: null },
] as unknown as Product[]

describe('composableContentFromSections (S0-4)', () => {
  it('petakan hero/about + showcase dari produk', () => {
    const c = composableContentFromSections('Pempek RIGIZAF', sections, products, null)
    expect(c.hero.title).toBe('Pempek RIGIZAF')
    expect(c.about?.title).toBe('Tentang')
    expect(c.showcase?.items).toHaveLength(2)
    expect(c.showcase?.items[0]).toMatchObject({ nama: 'Kapal Selam', harga: 15000 })
  })

  it('tanpa produk → showcase undefined', () => {
    const c = composableContentFromSections('Toko', sections, [], null)
    expect(c.showcase).toBeUndefined()
  })

  it('showcaseTitle custom + source generik (services) → judul & item benar (FU#1)', () => {
    const services = [
      { nama: 'Fisioterapi', harga: 200000, deskripsi: 'pemulihan cedera', gambar_url: null },
    ] as unknown as Product[]
    const c = composableContentFromSections('Klinik', sections, services, null, {}, 'Layanan Kami')
    expect(c.showcase?.title).toBe('Layanan Kami')
    expect(c.showcase?.items[0]).toMatchObject({ nama: 'Fisioterapi', harga: 200000 })
  })

  // ── Band add-on (newsletter/career) — row cta ber-preset ──
  it('row cta ber-preset → content.bands, dan CTA utama TIDAK terbajak', () => {
    const withBands = [
      ...sections,
      { tipe_komponen: 'cta', isi_komponen: { preset: 'newsletter', title: 'Tetap Terhubung', subtitle: 'Promo terbaru.', cta_text: 'Berlangganan' } },
      { tipe_komponen: 'cta', isi_komponen: { title: 'Pesan Sekarang', cta_text: 'Order' } },
      { tipe_komponen: 'cta', isi_komponen: { preset: 'career', title: 'Bergabung dengan Tim Kami', cta_text: 'Kirim Lamaran' } },
    ] as unknown as PageSection[]
    const profile = { wa: '6281234567890' } as never
    const c = composableContentFromSections('Toko', withBands, [], profile)
    expect(c.cta?.title).toBe('Pesan Sekarang') // band newsletter di urutan lebih awal TIDAK membajak
    expect(c.bands).toHaveLength(2)
    expect(c.bands![0]).toMatchObject({ preset: 'newsletter', title: 'Tetap Terhubung', ctaText: 'Berlangganan' })
    expect(c.bands![1].preset).toBe('career')
    expect(c.bands![0].ctaHref).toContain('wa.me/6281234567890') // tanpa cta_link → WA terpusat
  })

  it('tanpa row ber-preset → bands undefined (nol regresi)', () => {
    const c = composableContentFromSections('Toko', sections, [], null)
    expect(c.bands).toBeUndefined()
  })
})

// ── Wire konten Sprint A/B dari data_konten (pasca-DP) ────────
const sectionsAboutCta = [
  { tipe_komponen: 'hero_banner', isi_komponen: { title: 'Klinik X' } },
  { tipe_komponen: 'about', isi_komponen: { title: 'Tentang', body: 'Halo.' } },
  { tipe_komponen: 'cta', isi_komponen: { title: 'Buat Janji', cta_text: 'Hubungi' } },
] as unknown as PageSection[]

describe('composableContentFromSections — data_konten Sprint A/B (team/pricing/process/gambar)', () => {
  it('team: dipetakan dari data_konten.team, entri tanpa nama/peran dibuang', () => {
    const konten = {
      team: [
        { nama: 'dr. Sari', peran: 'Dokter Umum', bio: '10 tahun pengalaman', foto: 'https://x.test/sari.jpg' },
        { nama: 'Tanpa Peran' }, // invalid → dibuang (peran wajib)
        { peran: 'Tanpa Nama' }, // invalid → dibuang (nama wajib)
        'bukan objek',           // invalid → dibuang
      ],
    }
    const c = composableContentFromSections('Klinik X', sectionsAboutCta, [], null, konten)
    expect(c.team).toHaveLength(1)
    expect(c.team?.[0]).toMatchObject({ nama: 'dr. Sari', peran: 'Dokter Umum', bio: '10 tahun pengalaman', foto: 'https://x.test/sari.jpg' })
  })

  it('pricing: dipetakan; plan tanpa harga dibuang; fitur non-string difilter', () => {
    const konten = {
      pricing: {
        title: 'Paket',
        plans: [
          { nama: 'Basic', harga: 'Rp100rb', periode: '/bln', fitur: ['A', 'B', 123, null], unggulan: true },
          { nama: 'Tanpa Harga', fitur: ['X'] }, // invalid → dibuang
        ],
      },
    }
    const c = composableContentFromSections('Klinik X', sectionsAboutCta, [], null, konten)
    expect(c.pricing?.title).toBe('Paket')
    expect(c.pricing?.plans).toHaveLength(1)
    expect(c.pricing?.plans[0]).toMatchObject({ nama: 'Basic', harga: 'Rp100rb', unggulan: true })
    expect(c.pricing?.plans[0].fitur).toEqual(['A', 'B']) // angka/null dibuang
  })

  it('process: dipetakan; langkah tanpa judul/desc dibuang', () => {
    const konten = {
      process: { title: 'Cara', steps: [{ judul: 'Langkah 1', desc: 'Lakukan ini' }, { judul: 'Tanpa desc' }] },
    }
    const c = composableContentFromSections('Klinik X', sectionsAboutCta, [], null, konten)
    expect(c.process?.steps).toHaveLength(1)
    expect(c.process?.steps[0]).toMatchObject({ judul: 'Langkah 1', desc: 'Lakukan ini' })
  })

  it('about_image + cta_image di-merge ke about/cta dari section', () => {
    const konten = { about_image: 'https://x.test/about.jpg', cta_image: 'https://x.test/cta.jpg' }
    const c = composableContentFromSections('Klinik X', sectionsAboutCta, [], null, konten)
    expect(c.about?.image).toBe('https://x.test/about.jpg')
    expect(c.cta?.image).toBe('https://x.test/cta.jpg')
  })

  it('statement: dipetakan dari data_konten.statement (quote wajib); teamTitle/teamEyebrow diteruskan', () => {
    const konten = {
      statement: { eyebrow: 'Filosofi', quote: 'Kami merangkai malam.', cite: 'Chef · Pendiri' },
      teamEyebrow: 'Di Balik Dapur',
      teamTitle: 'Tim yang Menyiapkan Malam Anda',
    }
    const c = composableContentFromSections('Resto', sectionsAboutCta, [], null, konten)
    expect(c.statement).toMatchObject({ eyebrow: 'Filosofi', quote: 'Kami merangkai malam.', cite: 'Chef · Pendiri' })
    expect(c.teamEyebrow).toBe('Di Balik Dapur')
    expect(c.teamTitle).toBe('Tim yang Menyiapkan Malam Anda')
  })

  it('statement: quote kosong → undefined (tak dirender)', () => {
    const c1 = composableContentFromSections('Resto', sectionsAboutCta, [], null, { statement: { eyebrow: 'X' } })
    expect(c1.statement).toBeUndefined()
    const c2 = composableContentFromSections('Resto', sectionsAboutCta, [], null, {})
    expect(c2.statement).toBeUndefined()
    expect(c2.teamTitle).toBeUndefined()
  })

  it('nol regresi: tanpa data_konten field → team/pricing/process undefined', () => {
    const c = composableContentFromSections('Klinik X', sectionsAboutCta, [], null, {})
    expect(c.team).toBeUndefined()
    expect(c.pricing).toBeUndefined()
    expect(c.process).toBeUndefined()
  })

  it('defensif: data_konten field bertipe salah → undefined, tak crash', () => {
    const konten = { team: 'bukan array', pricing: 42, process: { steps: 'bukan array' } }
    const c = composableContentFromSections('Klinik X', sectionsAboutCta, [], null, konten)
    expect(c.team).toBeUndefined()
    expect(c.pricing).toBeUndefined()
    expect(c.process).toBeUndefined()
  })

  it('partners: dipetakan; logo tanpa nama dibuang', () => {
    const konten = {
      partners: {
        title: 'Klien',
        logos: [
          { nama: 'Astra', href: 'https://astra.test' },
          { nama: 'Logo Img', logo: 'https://x.test/l.png' },
          { logo: 'https://x.test/no-name.png' }, // invalid → dibuang (nama wajib)
        ],
      },
    }
    const c = composableContentFromSections('PT X', sectionsAboutCta, [], null, konten)
    expect(c.partners?.title).toBe('Klien')
    expect(c.partners?.logos).toHaveLength(2)
    expect(c.partners?.logos[0]).toMatchObject({ nama: 'Astra', href: 'https://astra.test' })
  })

  it('social: dipetakan; platform tak dikenal / tanpa href dibuang', () => {
    const konten = {
      social: {
        links: [
          { platform: 'instagram', href: 'https://ig.test/a', label: '@a' },
          { platform: 'tiktok', href: 'https://tt.test/a' },
          { platform: 'myspace', href: 'https://x.test' }, // platform invalid → dibuang
          { platform: 'shopee' },                          // tanpa href → dibuang
        ],
      },
    }
    const c = composableContentFromSections('Toko X', sectionsAboutCta, [], null, konten)
    expect(c.social?.links).toHaveLength(2)
    expect(c.social?.links[0]).toMatchObject({ platform: 'instagram', href: 'https://ig.test/a', label: '@a' })
    expect(c.social?.links[1].platform).toBe('tiktok')
  })

  it('nol regresi + defensif: partners/social absen atau tipe salah → undefined', () => {
    expect(composableContentFromSections('X', sectionsAboutCta, [], null, {}).partners).toBeUndefined()
    expect(composableContentFromSections('X', sectionsAboutCta, [], null, {}).social).toBeUndefined()
    const bad = composableContentFromSections('X', sectionsAboutCta, [], null, { partners: 'x', social: { links: 9 } })
    expect(bad.partners).toBeUndefined()
    expect(bad.social).toBeUndefined()
  })

  it('testimoni (form): data_konten.testimoni {nama,kota,teks} → testimonials {quote,nama,peran}', () => {
    const konten = {
      testimoni: [
        { nama: 'Bu Sari', kota: 'Semarang', teks: 'Pelayanan ramah sekali.', bintang: 5 },
        { kota: 'X', teks: 'tanpa nama' }, // invalid → dibuang
        { nama: 'Tanpa teks' },            // invalid → dibuang
      ],
    }
    const c = composableContentFromSections('Klinik X', sectionsAboutCta, [], null, konten)
    expect(c.testimonials).toHaveLength(1)
    expect(c.testimonials?.[0]).toEqual({ quote: 'Pelayanan ramah sekali.', nama: 'Bu Sari', peran: 'Semarang' })
  })

  it('foto_items (form): {label,url} → gallery.images {src,caption}; tanpa url dibuang', () => {
    const konten = {
      foto_items: [
        { label: 'Ruang Tunggu', url: 'https://x.test/1.jpg' },
        { label: 'Tanpa URL', url: '' }, // dibuang
      ],
    }
    const c = composableContentFromSections('Klinik X', sectionsAboutCta, [], null, konten)
    expect(c.gallery?.images).toHaveLength(1)
    expect(c.gallery?.images?.[0]).toEqual({ src: 'https://x.test/1.jpg', caption: 'Ruang Tunggu' })
  })

  it('nol regresi: tanpa testimoni/foto_items → testimonials/gallery undefined', () => {
    const c = composableContentFromSections('X', sectionsAboutCta, [], null, {})
    expect(c.testimonials).toBeUndefined()
    expect(c.gallery).toBeUndefined()
  })

  it('stats & faq: dipetakan dari data_konten; entri tak lengkap dibuang', () => {
    const konten = {
      stats: [{ angka: '5rb+', label: 'Pelanggan' }, { angka: 'tanpa label' }],
      faq: [{ q: 'Buka kapan?', a: 'Setiap hari.' }, { a: 'tanpa pertanyaan' }],
    }
    const c = composableContentFromSections('Toko X', sectionsAboutCta, [], null, konten)
    expect(c.stats).toHaveLength(1)
    expect(c.stats?.[0]).toEqual({ angka: '5rb+', label: 'Pelanggan' })
    expect(c.faq).toHaveLength(1)
    expect(c.faq?.[0]).toEqual({ q: 'Buka kapan?', a: 'Setiap hari.' })
  })

  it('nol regresi + defensif: stats/faq absen atau tipe salah → undefined', () => {
    expect(composableContentFromSections('X', sectionsAboutCta, [], null, {}).stats).toBeUndefined()
    expect(composableContentFromSections('X', sectionsAboutCta, [], null, {}).faq).toBeUndefined()
    const bad = composableContentFromSections('X', sectionsAboutCta, [], null, { stats: 9, faq: 'x' })
    expect(bad.stats).toBeUndefined()
    expect(bad.faq).toBeUndefined()
  })
})

describe('sampleContentForTheme — konten contoh Sprint A/B (preview)', () => {
  it('umum-bluecare punya team; coach-prestige punya team+pricing+about.image', async () => {
    const { sampleContentForTheme } = await import('./sample-content')
    const umum = sampleContentForTheme('umum-bluecare')
    expect(umum.team?.length).toBeGreaterThan(0)
    const coach = sampleContentForTheme('coach-prestige')
    expect(coach.team?.length).toBeGreaterThan(0)
    expect(coach.pricing?.plans.length).toBeGreaterThan(0)
    expect(coach.about?.image).toBeTruthy()
  })

  it('startup punya pricing+process+team+about.image; korporat punya process; kursus punya pricing+process', async () => {
    const { sampleContentForTheme } = await import('./sample-content')
    const startup = sampleContentForTheme('startup-aurora')
    expect(startup.pricing?.plans.length).toBeGreaterThan(0)
    expect(startup.process?.steps.length).toBeGreaterThan(0)
    expect(startup.team?.length).toBeGreaterThan(0)
    expect(startup.about?.image).toBeTruthy()
    expect(sampleContentForTheme('korporat-biru').process?.steps.length).toBeGreaterThan(0)
    const kursus = sampleContentForTheme('kursus-fokus')
    expect(kursus.pricing?.plans.length).toBeGreaterThan(0)
    expect(kursus.process?.steps.length).toBeGreaterThan(0)
  })

  it('Sprint C: startup+korporat punya partners; kuliner+jastip punya social', async () => {
    const { sampleContentForTheme } = await import('./sample-content')
    expect(sampleContentForTheme('startup-aurora').partners?.logos.length).toBeGreaterThan(0)
    expect(sampleContentForTheme('korporat-biru').partners?.logos.length).toBeGreaterThan(0)
    expect(sampleContentForTheme('kuliner-rustic').social?.links.length).toBeGreaterThan(0)
    expect(sampleContentForTheme('luar-premium').social?.links.length).toBeGreaterThan(0)
  })

  it('Enrich toko: 8 sub-kat toko kini punya stats + testimonials + faq', async () => {
    const { sampleContentForTheme } = await import('./sample-content')
    for (const id of ['kuliner-rustic', 'fashion-minimal', 'kerajinan-galeri', 'kecantikan-blush', 'gadget-onyx', 'rumah-natural', 'herbal-daun', 'anak-pop']) {
      const c = sampleContentForTheme(id)
      expect(c.stats?.length, `${id} stats`).toBeGreaterThan(0)
      expect(c.testimonials?.length, `${id} testimonials`).toBeGreaterThan(0)
      expect(c.faq?.length, `${id} faq`).toBeGreaterThan(0)
    }
  })
})

describe('generateContent — routing tema composable (S0-4)', () => {
  it('variant = id manifest → theme "composable"', () => {
    const plan = generateContent({
      industri: 'Toko Online',
      briefing_data: {
        industri_tipe: 'toko_online',
        identitas: { nama_usaha: 'Pempek X' },
        branding: { variant: 'kuliner-rustic', sub_kategori: 'kuliner' },
      },
    })
    expect(plan.theme).toBe('composable')
    expect(plan.variant).toBe('kuliner-rustic')
  })

  it('variant biasa → theme per industri (bukan composable)', () => {
    const plan = generateContent({
      industri: 'Toko Online',
      briefing_data: {
        industri_tipe: 'toko_online',
        identitas: { nama_usaha: 'Toko Y' },
        branding: { variant: 'batik' },
      },
    })
    expect(plan.theme).not.toBe('composable')
  })
})
