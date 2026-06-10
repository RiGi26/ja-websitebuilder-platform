// ============================================================
// TOKO-ATELIER — smoke test renderer flagship (Opsi A).
// renderToStaticMarkup persis jalur gen-samples → menjaga kontrak:
// identitas, script inline tunggal, gate no-JS, override aksen brand,
// alias sample dedikasi, fallback tanpa gambar, dan jalur commerce
// (CTA WA fallback vs tombol keranjang via slot + CartProvider).
// ============================================================
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import TokoAtelierRenderer, { PALETTES } from './TokoAtelierRenderer'
import AtelierCartButton from './AtelierCartButton'
import { CartProvider } from '@/app/components/cart/CartProvider'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'
import type { Product } from '@/types/websitebuilder'

const content = sampleContentForTheme('toko-atelier')

describe('TokoAtelierRenderer', () => {
  it('merender struktur inti + identitas Atelier Noir', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html).toContain('ta-root')
    expect(html).toContain('KALA Atelier')
    expect(html).toContain('Fraunces') // font display via @import CSS string
    expect(html).toContain('Archivo')
    expect(html).toContain('ta-hero')
    expect(html).toContain('ta-marquee')
    expect(html).toContain('ta-statement')
    expect(html).toContain('ta-footer')
    expect(html).toContain('wa.me/') // CTA WhatsApp
  })

  it('alias sample dedikasi terpasang (bukan fallback toko generik)', () => {
    expect(content.nama).toBe('KALA Atelier')
    expect(content.showcase?.items.length ?? 0).toBeGreaterThanOrEqual(8)
    expect(content.statement?.quote).toBeTruthy()
  })

  it('script interaksi inline tepat satu kali + kontrak no-JS/reduced-motion', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html.match(/window\.__taInit=1/g)?.length).toBe(1) // IIFE di-inject sekali
    expect(html).toContain('.ta-js .ta-reveal') // hidden-state digate kelas JS
    expect(html).toContain('prefers-reduced-motion')
  })

  it('primary menimpa aksen champagne (variasi brand klien)', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} primary="#7E1F2D" />)
    expect(html).toContain('--ta-accent:#7E1F2D')
    expect(html).not.toContain('--ta-accent:#C5A572')
  })

  it('variant ivoire → palet terang + scrim gelap tetap dipakai untuk foto', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} variant="ivoire" />)
    expect(html).toContain('data-variant="ivoire"')
    expect(html).toContain('--ta-bg:#F6F1E8') // panggung gading
    expect(html).toContain('--ta-accent:#7A5C32') // aksen perunggu
    expect(html).toContain('--ta-scrim:#1A150F') // overlay foto tetap gelap
  })

  it('variant tak dikenal → jatuh aman ke noir', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} variant="tidak-ada" />)
    expect(html).toContain('--ta-bg:#141210')
  })

  it('hero tanpa gambar → fallback gradient (tidak crash, tetap render)', () => {
    const c = { ...content, hero: { ...content.hero, image: undefined } }
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={c} />)
    expect(html).toContain('ta-hero-bg')
    expect(html).toContain('linear-gradient')
  })

  // ── Sprint 2: lookbook + filter + lightbox + commerce ──
  it('lookbook: spread unggulan, grid, chips filter aria-pressed, badge stok', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html).toContain('ta-look-feat') // item 01 dipromosikan (bergambar)
    expect(html).toContain('ta-look-grid')
    expect(html).toContain('aria-pressed="true"') // chip "Semua" aktif default
    expect(html).toContain('data-f="Outerwear"')
    expect(html).toContain('Sisa 3') // Celana Linen “Muara” stok 3
    expect(html).toContain('data-cat="Aksesori"')
  })

  it('lightbox: dialog tunggal aksesibel + trigger quick-look ber-data', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html.match(/role="dialog"/g)?.length).toBe(1)
    expect(html).toContain('aria-modal="true"')
    expect((html.match(/ta-lb-open/g)?.length ?? 0)).toBeGreaterThanOrEqual(8)
    expect(html).toContain('data-title="Kemeja “Subuh”')
  })

  it('tanpa cart → CTA per item jatuh ke WA prefilled', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html).toContain('?text=') // wa.me prefilled per item
    expect(html).not.toContain('+ Keranjang')
  })

  it('hasCart + produk cocok + slot CartButton → tombol keranjang dirender', () => {
    const prod: Product = {
      id: 'p1', tenant_id: 't1', page_id: 'pg1', nama: 'Kemeja “Subuh”',
      deskripsi: null, harga: 485000, gambar_url: null, kategori: 'Atasan',
      stok: 10, is_active: true, urutan: 1, created_at: '',
    } as Product
    const html = renderToStaticMarkup(
      <CartProvider slug="uji" primary="#C5A572">
        <TokoAtelierRenderer content={content} products={[prod]} hasCart CartButton={AtelierCartButton} />
      </CartProvider>,
    )
    expect(html).toContain('ta-cardbtn')
    expect(html).toContain('+ Keranjang')
  })

  it('keunggulan sticky + cerita split dirender dari konten', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html).toContain('ta-why')
    expect(html).toContain('Lambat itu disengaja')
    expect(html).toContain('ta-about')
    expect(html).toContain('Atelier Kecil yang Keras Kepala')
  })

  it('PALETTES diekspor untuk gate kontras (Sprint 4)', () => {
    expect(PALETTES.noir).toBeDefined()
    expect(PALETTES.noir.ink).toBeTruthy()
    expect(PALETTES.noir.onAccent).toBeTruthy()
  })

  // ── Sprint 3: stats + galeri + carousel + faq + cta ──
  // CATATAN: CSS string ikut ter-render → assert kelas pakai bentuk markup
  // `class="..."` supaya tidak false-positive dari selector di <style>.
  it('stats: band count-up — SSR menulis nilai final, marker data-cu terpasang', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html).toContain('class="ta-stats"')
    expect(html.match(/data-cu="true"/g)?.length).toBe(4)
    expect(html).toContain('12rb+') // nilai final tampil tanpa JS
    expect(html).toContain('48 jam')
  })

  it('galeri: mosaik + pita breakout + tiap foto memicu lightbox', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html).toContain('class="ta-gal-grid"')
    expect(html).toContain('class="ta-gal-break"') // >4 foto → pita edge-to-edge
    expect(html).toContain('Pemilihan kain')
    expect(html).toContain('data-title="Meja potong"')
    // trigger lightbox = 9 produk bergambar + 7 foto galeri
    expect((html.match(/ta-lb-open/g)?.length ?? 0)).toBeGreaterThanOrEqual(15)
  })

  it('galeri tanpa images → section self-hide, lookbook tetap punya lightbox', () => {
    const c = { ...content, gallery: undefined }
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={c} />)
    expect(html).not.toContain('class="ta-gal-grid"')
    expect(html.match(/role="dialog"/g)?.length).toBe(1) // produk masih bergambar
  })

  it('carousel testimoni: aria carousel + slide bernomor + dots + tombol', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html).toContain('aria-roledescription="carousel"')
    expect(html).toContain('aria-label="1 dari 4"')
    expect((html.match(/class="ta-dot"/g)?.length ?? 0)).toBe(4)
    expect(html).toContain('class="ta-tbtn ta-tprev"')
    expect(html).toContain('Sarasvati')
  })

  it('faq: details CSS-only dengan summary serif', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect((html.match(/<details/g)?.length ?? 0)).toBe(4)
    expect(html).toContain('Apakah bisa custom ukuran?')
    expect(html).toContain('class="ta-qa-ic"')
  })

  it('cta band: duotone + tombol magnetic; href #wa dipetakan ke wa.me', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html).toContain('class="ta-cta"')
    expect(html).toContain('class="ta-cta-tint"') // lapis duotone
    expect(html).toContain('ta-btn-solid ta-mag') // tombol magnetic di markup
    expect(html).toContain('Sekali Habis, Tidak Diulang')
    expect(html).not.toContain('href="#wa"') // '#wa' tidak bocor sebagai anchor mati
  })

  it('primitive S3 hadir di script inline (countUp + carousel + magnetic)', () => {
    const html = renderToStaticMarkup(<TokoAtelierRenderer content={content} />)
    expect(html).toContain('data-cu-i')
    expect(html).toContain('ta-tcar-track')
    expect(html).toContain('pointer:fine') // magnetic digate pointer presisi
  })
})
