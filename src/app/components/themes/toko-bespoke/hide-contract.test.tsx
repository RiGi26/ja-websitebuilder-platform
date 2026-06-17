// ============================================================
// SUSUNAN HALAMAN — kontrak durabilitas fitur sembunyikan-section (portal).
//
// Fitur portal "Susunan Halaman" menyembunyikan blok pengayaan (stats/faq/
// statement/gallery) dengan cara: adapter `composableContentFromSections`
// me-null-kan field blok yang terdaftar di `data_konten.hidden_sections`, lalu
// SETIAP renderer bespoke—yang merender blok itu di belakang guard kehadiran—
// otomatis berhenti merendernya.
//
// Test ini MENGUNCI dua sisi kontrak supaya fitur tetap jalan untuk SEMUA tema,
// termasuk tema yang dibuat NANTI:
//   1. Adapter benar me-null-kan blok saat key ada di hidden_sections.
//   2. Tiap renderer di BESPOKE_RENDERERS menghormati guard kehadiran — blok
//      hilang saat field-nya undefined (parametrik → tema baru auto-teruji).
//
// Reorder item (produk/menu/layanan/galeri) TIDAK perlu kontrak per-tema: fetch
// publik (lib/supabase/addons.ts) selalu ORDER BY urutan, jadi berlaku universal.
// ============================================================
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ComposableContent } from '@/lib/theme-system/manifest'
import { composableContentFromSections } from '@/lib/theme-system/content-adapter'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'
import { HIDEABLE_SECTION_KEYS } from '@/lib/portal/section-visibility'
import { BESPOKE_RENDERERS } from './registry'
import { BESPOKE_VARIANTS, BESPOKE_RENDERED_BLOCKS } from './variants'

// Sentinel acak: hanya muncul di HTML bila renderer benar-benar membaca field
// konten terkait (bukan teks fallback yang di-hardcode).
// gallery sentinel ditaruh di URL gambar — pasti muncul di HTML entah sebagai
// <img src> atau CSS background-image url(), tak bergantung apakah caption dirender.
const S = {
  stats: 'ZZ_STAT_SENTINEL_ZZ',
  faq: 'ZZ_FAQ_SENTINEL_ZZ',
  statement: 'ZZ_STMT_SENTINEL_ZZ',
  gallery: 'ZZ-GAL-SENTINEL-ZZ',
} as const

// Inversi BESPOKE_VARIANTS → {variant, sample} pertama per theme key. restaurant-lux
// sengaja di luar BESPOKE_VARIANTS (jalur isLux) → fixture manual.
const THEME_FIXTURE: Record<string, { variant: string; sample: string }> = {
  'restaurant-lux': { variant: 'aurum', sample: 'finedining-aurum' },
}
for (const v of Object.values(BESPOKE_VARIANTS)) {
  if (!THEME_FIXTURE[v.theme]) THEME_FIXTURE[v.theme] = { variant: v.variant, sample: v.sample }
}

// Tanam blok pengayaan ber-sentinel di atas sample konten yang shape-nya valid.
function withEnrichment(base: ComposableContent): ComposableContent {
  return {
    ...base,
    stats: [{ angka: S.stats, label: 'x' }],
    faq: [{ q: S.faq, a: 'y' }],
    statement: { quote: S.statement },
    gallery: { images: [{ src: `https://example.com/${S.gallery}.jpg`, caption: 'x' }] },
  }
}

// ── Sisi 1: kontrak adapter terpusat ──
describe('Susunan Halaman — adapter me-null-kan blok tersembunyi', () => {
  const galleryRows = [{ url: 'https://example.com/a.jpg' }]
  const konten = {
    stats: [{ angka: '500+', label: 'Pelanggan' }],
    faq: [{ q: 'Q', a: 'A' }],
    statement: { quote: 'Filosofi kami' },
  }

  it('tanpa hidden_sections → keempat blok pengayaan ada', () => {
    const out = composableContentFromSections('Toko', [], [], null, konten, 'Produk', galleryRows)
    expect(out.stats).toBeDefined()
    expect(out.faq).toBeDefined()
    expect(out.statement).toBeDefined()
    expect(out.gallery).toBeDefined()
  })

  it('hidden_sections sebagian → hanya blok terdaftar yang di-null-kan', () => {
    const out = composableContentFromSections('Toko', [], [], null,
      { ...konten, hidden_sections: ['faq', 'gallery'] }, 'Produk', galleryRows)
    expect(out.faq).toBeUndefined()
    expect(out.gallery).toBeUndefined()
    expect(out.stats).toBeDefined()
    expect(out.statement).toBeDefined()
  })

  it('semua key disembunyikan → keempat blok null', () => {
    const out = composableContentFromSections('Toko', [], [], null,
      { ...konten, hidden_sections: [...HIDEABLE_SECTION_KEYS] }, 'Produk', galleryRows)
    for (const k of HIDEABLE_SECTION_KEYS) expect(out[k]).toBeUndefined()
  })
})

// ── Sisi 2: kontrak presence-guard tiap renderer bespoke (parametrik) ──
// Tema baru yang ditambahkan ke BESPOKE_RENDERERS otomatis ikut teruji di sini.
describe('Susunan Halaman — tiap renderer bespoke menghormati kontrak hide', () => {
  for (const [theme, entry] of Object.entries(BESPOKE_RENDERERS)) {
    const fx = THEME_FIXTURE[theme]
    const Renderer = entry.Renderer
    // stats/faq/statement = konstanta semua renderer; gallery hanya yang mendeklarasikannya.
    const rendersGallery = !!BESPOKE_RENDERED_BLOCKS[theme]?.gallery || theme === 'restaurant-lux'

    describe(theme, () => {
      it('terdaftar dgn fixture variant/sample (daftarkan di BESPOKE_VARIANTS)', () => {
        expect(fx, `Tema "${theme}" ada di BESPOKE_RENDERERS tapi tak ada di BESPOKE_VARIANTS`).toBeDefined()
      })
      if (!fx) return

      it('merender stats/faq/statement (+galeri bila berlaku) saat datanya ada', () => {
        const html = renderToStaticMarkup(
          <Renderer content={withEnrichment(sampleContentForTheme(fx.sample))} variant={fx.variant} />)
        expect(html).toContain(S.stats)
        expect(html).toContain(S.faq)
        expect(html).toContain(S.statement)
        if (rendersGallery) expect(html).toContain(S.gallery)
      })

      it('menyembunyikan blok saat field-nya undefined — tanpa error', () => {
        const base = withEnrichment(sampleContentForTheme(fx.sample))
        const blocks = (rendersGallery
          ? ['stats', 'faq', 'statement', 'gallery']
          : ['stats', 'faq', 'statement']) as Array<keyof typeof S>
        for (const b of blocks) {
          const html = renderToStaticMarkup(
            <Renderer content={{ ...base, [b]: undefined } as ComposableContent} variant={fx.variant} />)
          expect(html, `${theme}: blok "${b}" tak boleh muncul saat disembunyikan`).not.toContain(S[b])
        }
      })
    })
  }
})
