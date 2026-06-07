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
