import { describe, it, expect } from 'vitest'
import { generateContent } from './generateContent'

// Anti-slop: auto-build dummy dulu 0 foto → placeholder gradient. Sekarang
// di-enrich dengan foto Unsplash terkurasi dari sample-content (HANYA tema
// composable, supaya sub-kategori cocok = foto relevan).
describe('generateContent — imagery enrichment (anti-slop dummy)', () => {
  it('tema composable: isi foto_hero + gambar showcase dari sample terkurasi', () => {
    const plan = generateContent({
      industri: 'Toko Online',
      nama_usaha: 'Toko Uji',
      briefing_data: { industri_tipe: 'toko_online', branding: { variant: 'kuliner-rustic' } },
    })
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(String(plan.dataKonten.foto_hero)).toContain('unsplash')

    const rows = [...plan.products, ...plan.services, ...plan.menuItems]
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((r) => typeof r.gambar === 'string' && r.gambar!.length > 0)).toBe(true)
  })

  it('tema lama/non-composable: TIDAK di-enrich (hindari foto salah industri)', () => {
    const plan = generateContent({
      industri: 'Toko Online',
      nama_usaha: 'Toko Uji',
      briefing_data: { industri_tipe: 'toko_online', branding: { variant: 'clean' } },
    })
    expect(plan.dataKonten.foto_hero).toBeUndefined()
  })
})

// Fine Dining → renderer bespoke restaurant-lux (upgrade dari composable finedining).
// Pilihan Fine Dining di briefing harus menghasilkan theme='restaurant-lux' + palet.
describe('generateContent — Fine Dining → restaurant-lux (bespoke premium)', () => {
  const luxOrder = (variant: string) => ({
    industri: 'Restaurant',
    nama_usaha: 'Resto Uji',
    briefing_data: {
      industri_tipe: 'restaurant',
      branding: { sub_kategori: 'finedining', variant, primary_color: '#1f7a3d' },
    },
  })

  it('finedining-aurum → theme restaurant-lux, variant aurum, aksen brand', () => {
    const plan = generateContent(luxOrder('finedining-aurum'))
    expect(plan.theme).toBe('restaurant-lux')
    expect(plan.variant).toBe('aurum')
    expect(plan.primary).toBe('#1f7a3d')
  })

  it('finedining-hearth → variant hearth; finedining-nordic → noir (palet gelap terdekat)', () => {
    expect(generateContent(luxOrder('finedining-hearth')).variant).toBe('hearth')
    expect(generateContent(luxOrder('finedining-nordic')).variant).toBe('noir')
  })

  it('sub_kategori finedining tanpa variant cocok → default aurum', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      briefing_data: { industri_tipe: 'restaurant', branding: { sub_kategori: 'finedining' } },
    })
    expect(plan.theme).toBe('restaurant-lux')
    expect(plan.variant).toBe('aurum')
  })

  it('imagery enrichment aktif: menuItems punya foto + foto_hero terisi', () => {
    const plan = generateContent(luxOrder('finedining-aurum'))
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(plan.menuItems.length).toBeGreaterThan(0)
    expect(plan.menuItems.every((m) => typeof m.gambar === 'string' && m.gambar!.length > 0)).toBe(true)
  })

  it('restaurant non-finedining (warung) tetap jalur lama, BUKAN restaurant-lux', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Warung Uji',
      briefing_data: { industri_tipe: 'restaurant', branding: { sub_kategori: 'warung', variant: 'warung-rakyat' } },
    })
    expect(plan.theme).not.toBe('restaurant-lux')
  })

  // Lux-only brief form (non-toko): sub-kategori disembunyikan → restaurant memilih
  // satu kartu Lux → variant 'lux-restaurant'. Itu kini juga = bespoke restaurant-lux.
  it('lux-restaurant (kartu Lux brief form) → theme restaurant-lux, variant aurum', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      briefing_data: { industri_tipe: 'restaurant', branding: { variant: 'lux-restaurant', primary_color: '#1f7a3d' } },
    })
    expect(plan.theme).toBe('restaurant-lux')
    expect(plan.variant).toBe('aurum')
    expect(plan.primary).toBe('#1f7a3d')
  })
})

// FLAGSHIP bespoke toko (registry theme key). Tabel BESPOKE_VARIANTS (SSOT)
// memetakan id ThemeOption brief → { theme key, palet variant native, sample }.
// Brief form SELALU menyetel variant saat sub-kategori dipilih → intercept
// berbasis id variant (bukan sub_kategori).
describe('generateContent — bespoke toko (Atelier fashion + Kuliner lux)', () => {
  const mkToko = (branding: Record<string, unknown>) =>
    generateContent({
      industri: 'Toko Online',
      nama_usaha: 'Toko Uji',
      briefing_data: { industri_tipe: 'toko_online', branding },
    })

  it('atelier-noir → theme toko-atelier, variant noir, aksen brand', () => {
    const plan = mkToko({ sub_kategori: 'fashion', variant: 'atelier-noir', primary_color: '#7E1F2D' })
    expect(plan.theme).toBe('toko-atelier')
    expect(plan.variant).toBe('noir')
    expect(plan.primary).toBe('#7E1F2D')
  })

  it('atelier-ivoire → variant ivoire', () => {
    expect(mkToko({ sub_kategori: 'fashion', variant: 'atelier-ivoire' }).variant).toBe('ivoire')
  })

  it('fashion tanpa variant dikenal → fallback Atelier noir (paritas isAtelier lama)', () => {
    const plan = mkToko({ sub_kategori: 'fashion' })
    expect(plan.theme).toBe('toko-atelier')
    expect(plan.variant).toBe('noir')
  })

  it('kuliner-tungku → theme toko-kuliner, variant tungku', () => {
    const plan = mkToko({ sub_kategori: 'kuliner', variant: 'kuliner-tungku' })
    expect(plan.theme).toBe('toko-kuliner')
    expect(plan.variant).toBe('tungku')
  })

  it('kuliner-pamor → variant pamor', () => {
    expect(mkToko({ sub_kategori: 'kuliner', variant: 'kuliner-pamor' }).variant).toBe('pamor')
  })

  it('imagery enrichment aktif: products punya foto + foto_hero terisi (sample kuliner-lux)', () => {
    const plan = mkToko({ sub_kategori: 'kuliner', variant: 'kuliner-tungku' })
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(plan.products.length).toBeGreaterThan(0)
    expect(plan.products.every((p) => typeof p.gambar === 'string' && p.gambar!.length > 0)).toBe(true)
  })

  it('kecantikan-embun → theme toko-kecantikan, variant embun (Wave 1)', () => {
    const plan = mkToko({ sub_kategori: 'kecantikan', variant: 'kecantikan-embun' })
    expect(plan.theme).toBe('toko-kecantikan')
    expect(plan.variant).toBe('embun')
  })

  it('imagery enrichment aktif: products kecantikan punya foto (sample kecantikan-lux)', () => {
    const plan = mkToko({ sub_kategori: 'kecantikan', variant: 'kecantikan-embun' })
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(plan.products.length).toBeGreaterThan(0)
    expect(plan.products.every((p) => typeof p.gambar === 'string' && p.gambar!.length > 0)).toBe(true)
  })

  it('gadget-onyx → theme toko-gadget, variant onyx (Wave 1)', () => {
    const plan = mkToko({ sub_kategori: 'gadget', variant: 'gadget-onyx' })
    expect(plan.theme).toBe('toko-gadget')
    expect(plan.variant).toBe('onyx')
  })

  it('imagery enrichment aktif: products gadget punya foto (sample gadget-lux)', () => {
    const plan = mkToko({ sub_kategori: 'gadget', variant: 'gadget-onyx' })
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(plan.products.length).toBeGreaterThan(0)
    expect(plan.products.every((p) => typeof p.gambar === 'string' && p.gambar!.length > 0)).toBe(true)
  })

  it('rumah-selaras → theme toko-rumah, variant selaras (Wave 1)', () => {
    const plan = mkToko({ sub_kategori: 'rumah', variant: 'rumah-selaras' })
    expect(plan.theme).toBe('toko-rumah')
    expect(plan.variant).toBe('selaras')
  })

  it('imagery enrichment aktif: products rumah punya foto (sample rumah-lux)', () => {
    const plan = mkToko({ sub_kategori: 'rumah', variant: 'rumah-selaras' })
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(plan.products.length).toBeGreaterThan(0)
    expect(plan.products.every((p) => typeof p.gambar === 'string' && p.gambar!.length > 0)).toBe(true)
  })

  it('gadget tanpa variant dikenal → fallback composable lux-toko (BUKAN bespoke, sengaja)', () => {
    // Berbeda dari fashion (selalu Atelier noir): gadget tak punya fallback
    // bespoke per-sub-kategori. Variant kosong/typo → turun ke composable
    // lux-toko, bukan diam-diam ke Onyx. Mengunci keputusan ini.
    const plan = mkToko({ sub_kategori: 'gadget' })
    expect(plan.theme).toBe('composable')
    expect(plan.variant).toBe('lux-toko')
  })

  it('toko_online di luar bespoke ("Lainnya" → lux-toko) tetap composable', () => {
    const plan = mkToko({ variant: 'lux-toko' })
    expect(plan.theme).toBe('composable')
    expect(plan.variant).toBe('lux-toko')
  })
})

// LUX TIER (Sprint 1) — composable lux jadi DEFAULT premium per industri pilot
// (restaurant + klinik) saat briefing tak memilih variant; pilihan eksplisit
// dihormati; Fine Dining bespoke (benchmark) tetap menang; konten produksi
// di-enrich (statement/stats/faq) supaya situs lux tak sparse.
describe('generateContent — LUX TIER default + enrichment (Sprint 1)', () => {
  const mk = (tipe: string, branding?: Record<string, unknown>) =>
    generateContent({
      industri: tipe,
      nama_usaha: 'Uji',
      briefing_data: { industri_tipe: tipe, ...(branding ? { branding } : {}) },
    })

  it('restaurant tanpa variant → composable lux-restaurant (default premium)', () => {
    const plan = mk('restaurant')
    expect(plan.theme).toBe('composable')
    expect(plan.variant).toBe('lux-restaurant')
  })

  it('klinik tanpa variant → composable lux-klinik', () => {
    const plan = mk('klinik')
    expect(plan.theme).toBe('composable')
    expect(plan.variant).toBe('lux-klinik')
  })

  it('klinik-bersih (Wave 2 bespoke) → theme klinik-umum, variant bersih + services ber-foto', () => {
    const plan = mk('klinik', { sub_kategori: 'umum', variant: 'klinik-bersih', primary_color: '#2B5BD7' })
    expect(plan.theme).toBe('klinik-umum')
    expect(plan.variant).toBe('bersih')
    expect(plan.primary).toBe('#2B5BD7')
    // imagery enrichment: services pinjam foto sample klinik-lux
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(plan.services.length).toBeGreaterThan(0)
    expect(plan.services.every((s) => typeof s.gambar === 'string' && s.gambar!.length > 0)).toBe(true)
  })

  it('warung-hangat (Wave 2 bespoke, source menu) → theme restaurant-warung, variant hangat + menu ber-foto', () => {
    const plan = mk('restaurant', { sub_kategori: 'warung', variant: 'warung-hangat', primary_color: '#C0432E' })
    expect(plan.theme).toBe('restaurant-warung')
    expect(plan.variant).toBe('hangat')
    expect(plan.primary).toBe('#C0432E')
    // imagery enrichment: menu pinjam foto sample warung-lux
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(plan.menuItems.length).toBeGreaterThan(0)
    expect(plan.menuItems.every((m) => typeof m.gambar === 'string' && m.gambar!.length > 0)).toBe(true)
  })

  it('cafe-seduh (Wave 2 bespoke, source menu) → theme restaurant-cafe, variant seduh + menu ber-foto', () => {
    const plan = mk('restaurant', { sub_kategori: 'cafe', variant: 'cafe-seduh', primary_color: '#A4642E' })
    expect(plan.theme).toBe('restaurant-cafe')
    expect(plan.variant).toBe('seduh')
    expect(plan.primary).toBe('#A4642E')
    // imagery enrichment: menu pinjam foto sample cafe-lux
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
    expect(plan.menuItems.length).toBeGreaterThan(0)
    expect(plan.menuItems.every((m) => typeof m.gambar === 'string' && m.gambar!.length > 0)).toBe(true)
  })

  it('reguler-almamater (Wave 3 bespoke, source services) → theme sekolah-reguler, variant almamater + foto enrich', () => {
    const plan = mk('sekolah', { sub_kategori: 'reguler', variant: 'reguler-almamater', primary_color: '#15294B' })
    expect(plan.theme).toBe('sekolah-reguler')
    expect(plan.variant).toBe('almamater')
    expect(plan.primary).toBe('#15294B')
    // imagery enrichment: hero pinjam foto sample sekolah-lux
    expect(typeof plan.dataKonten.foto_hero).toBe('string')
  })

  it('pilihan variant lama composable dihormati (escape hatch) — bukan lux/bespoke', () => {
    const plan = mk('restaurant', { variant: 'warung-rakyat' })
    expect(plan.variant).toBe('warung-rakyat')
    expect(plan.theme).toBe('composable')
  })

  it('Fine Dining tetap → restaurant-lux bespoke (benchmark), bukan lux composable', () => {
    const plan = mk('restaurant', { sub_kategori: 'finedining' })
    expect(plan.theme).toBe('restaurant-lux')
  })

  it('industri non-pilot (corporate) tak kena default lux', () => {
    const plan = mk('corporate')
    expect(plan.variant).not.toBe('lux-restaurant')
    expect(plan.variant).not.toBe('lux-klinik')
  })

  it('enrich produksi: dataKonten restaurant punya statement + stats + faq', () => {
    const dk = mk('restaurant').dataKonten as Record<string, unknown>
    expect(dk.statement).toBeTruthy()
    expect(Array.isArray(dk.stats) && (dk.stats as unknown[]).length).toBeGreaterThanOrEqual(2)
    expect(Array.isArray(dk.faq) && (dk.faq as unknown[]).length).toBeGreaterThanOrEqual(3)
  })

  it('enrich produksi: dataKonten klinik punya statement + stats + faq', () => {
    const dk = mk('klinik').dataKonten as Record<string, unknown>
    expect(dk.statement).toBeTruthy()
    expect(Array.isArray(dk.stats)).toBe(true)
    expect(Array.isArray(dk.faq)).toBe(true)
  })
})

describe('generateContent — capabilities (B-cap)', () => {
  it('selected_addons → plan.capabilities', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      selected_addons: ['booking', 'delivery', 'qr-menu'],
      briefing_data: { industri_tipe: 'restaurant' },
    })
    expect(plan.capabilities).toEqual(expect.arrayContaining(['booking', 'delivery-buttons', 'qr-menu']))
  })

  it('tanpa add-on → capabilities []', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      briefing_data: { industri_tipe: 'restaurant' },
    })
    expect(plan.capabilities).toEqual([])
  })
})

// Konten + gambar dari brief form HARUS dipakai apa adanya (situs selaras dgn
// yang diisi klien); sample hanya mengisi yang kosong.
describe('generateContent — gambar & hero dari brief form (selaras)', () => {
  const FOTO = 'https://cdn.example.com/menu-rendang.jpg'
  const HERO = 'https://cdn.example.com/hero-dapur.jpg'

  it('foto_url menu dari brief → menuItems[].gambar (tak ditimpa sample)', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      briefing_data: {
        industri_tipe: 'restaurant',
        branding: { variant: 'lux-restaurant', foto_hero: HERO },
        konten: { menu: [{ nama: 'Rendang', harga: '65000', foto_url: FOTO }] },
      },
    })
    const rendang = plan.menuItems.find((m) => m.nama === 'Rendang')
    expect(rendang?.gambar).toBe(FOTO)
  })

  it('foto_hero dari brief → dataKonten.foto_hero (menang atas sample)', () => {
    const plan = generateContent({
      industri: 'Restaurant',
      nama_usaha: 'Resto Uji',
      briefing_data: {
        industri_tipe: 'restaurant',
        branding: { variant: 'lux-restaurant', foto_hero: HERO },
        konten: { menu: [{ nama: 'Rendang', harga: '65000' }] },
      },
    })
    expect(plan.dataKonten.foto_hero).toBe(HERO)
  })

  it('foto_url produk toko dari brief → products[].gambar', () => {
    const plan = generateContent({
      industri: 'Toko Online',
      nama_usaha: 'Toko Uji',
      briefing_data: {
        industri_tipe: 'toko_online',
        branding: { variant: 'lux-toko' },
        konten: { produk_unggulan: [{ nama: 'Kemeja', harga: '150000', foto_url: FOTO }] },
      },
    })
    const kemeja = plan.products.find((p) => p.nama === 'Kemeja')
    expect(kemeja?.gambar).toBe(FOTO)
  })
})
