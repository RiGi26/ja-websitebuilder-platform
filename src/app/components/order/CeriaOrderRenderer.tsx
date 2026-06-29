'use client'
// ============================================================
// CERIA & RAMAH — Order-First storefront renderer (cutover Portal, Bakso Fase 1).
//
// BEDA dari renderer bespoke showcase (WarungRenderer dkk): ini etalase GAYA
// APP PESAN-ANTAR (GoFood-like) — appbar+search sticky, hero foto, info-strip,
// kartu menu ber-stepper, dan BOTTOM CART BAR. Menu dari catalog_mirror
// (PortalCatalogItem), keranjang via usePortalCart (PortalCartProvider membungkus
// dari SiteRenderer). Checkout tetap drawer PortalCartProvider (kontrak §4.1).
//
// Dipakai HANYA lewat blok cutover Portal di SiteRenderer saat branding.variant
// = 'ceria' → SELALU di dalam <PortalCartProvider> + portalCatalog non-kosong.
// (Tak terdaftar di BESPOKE_RENDERERS → tak ikut hide-contract parametrik; teks
// blok pengayaan tetap ber-guard kehadiran konten, pola sama renderer bespoke.)
//
// KEJUJURAN-JUALAN: TANPA rating bintang / "X terjual" karangan (tak ada datanya
// di catalog_mirror). Badge status = avail_status NYATA. "Pedas" diturunkan dari
// nama. "Menu Andalan" = kurasi manual owner (andalanIds dari data_konten).
// ============================================================
import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Baloo_2, Plus_Jakarta_Sans } from 'next/font/google'
import {
  ShoppingBag, Search, Plus, Minus, Truck, ShieldCheck, Wallet,
  Flame, Soup, ArrowRight, MessageCircle, Clock, MapPin, Sparkles, Check,
} from 'lucide-react'
import { usePortalCart } from './PortalCartProvider'
import { formatMoney, moneyFromConfig } from '@/lib/format-money'
import type { BespokeProps } from '@/app/components/themes/toko-bespoke/types'
import type { PortalCatalogItem } from '@/lib/portal/types'

// Font di-self-host via next/font (zero render-block). Sebelumnya dimuat lewat
// CSS @import di dalam <style> → render-blocking berantai (perf P1). Variabel CSS
// di-pasang di .co-root lalu dirujuk oleh --co-display / --co-body di coCss().
const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--co-font-display',
})
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--co-font-body',
})

// Host yang boleh dioptimasi next/image (sinkron dgn remotePatterns next.config).
// Foto bakso (hero 0.8 MB, menu s.d. 2.3 MB PNG) ada di storage Supabase → di-resize
// + di-WebP/AVIF jadi puluhan KB. Host tak dikenal → fallback <img> mentah (tak putus).
function isOptimizable(src?: string): boolean {
  if (!src) return false
  try {
    const h = new URL(src).hostname
    return /\.supabase\.co$/i.test(h) || h === 'images.unsplash.com'
  } catch {
    return false
  }
}

// Gambar penutup-bingkai (object-fit:cover) untuk hero/kartu/about. Pakai next/image
// `fill` bila host optimizable; selain itu <img> mentah dgn gaya cover yang sama.
// Bingkai induk WAJIB position:relative + punya tinggi (aspect-ratio / min-height).
function SmartImg({
  src, alt, sizes, priority, className, objectPosition,
}: {
  src?: string
  alt: string
  sizes: string
  priority?: boolean
  className?: string
  objectPosition?: string
}) {
  if (!src) return null
  const style: React.CSSProperties = { objectFit: 'cover', objectPosition }
  if (isOptimizable(src)) {
    return (
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority}
        className={className} style={style} />
    )
  }
  return (
    <img src={src} alt={alt} className={className} decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} />
  )
}

export type CeriaOrderProps = BespokeProps & {
  /** Pack-id pilihan owner utk "Menu Andalan" (kurasi manual, data_konten.andalan). */
  andalanIds?: string[]
  /** Tampilkan stempel HALAL (data_konten.order_meta.halal; fallback heuristik kata). */
  halal?: boolean
}

const PEDAS_RE = /pedas|mercon|setan|cabai|sambal|spicy/i

function isPedas(item: PortalCatalogItem): boolean {
  return PEDAS_RE.test(item.product_nama) || PEDAS_RE.test(item.kategori ?? '')
}

// Ikon info-strip diturunkan dari kata kunci judul fitur (editable via konten) —
// bukan hardcode urutan. Default: Sparkles (poin nilai umum).
function iconForFeature(title: string) {
  const t = title.toLowerCase()
  if (/halal|sertif|aman/.test(t)) return ShieldCheck
  if (/kirim|antar|delivery|ongkir|ekspedisi|sagawa|pos/.test(t)) return Truck
  if (/bayar|transfer|cod|pembayaran|paypay/.test(t)) return Wallet
  if (/jam|buka|waktu|jadwal|rabu|sabtu/.test(t)) return Clock
  if (/lokasi|alamat|resto|cabang/.test(t)) return MapPin
  return Sparkles
}

export default function CeriaOrderRenderer({
  content: c,
  primary,
  localeConfig,
  andalanIds,
  halal,
  portalCatalog,
}: CeriaOrderProps) {
  const catalog = useMemo(() => portalCatalog ?? [], [portalCatalog])
  const { add, inc, dec, qtyOf, count, subtotal, openCart } = usePortalCart()
  const { locale, currency } = moneyFromConfig(localeConfig)
  const fmt = (n: number) => formatMoney(n, locale, currency)
  const priceText = (n: number) => (n > 0 ? fmt(n) : 'Tanya')

  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState('Semua')
  const [expanded, setExpanded] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const LIMIT = 8

  const hero = c.hero // required di ComposableContent (adapter selalu mengisi)
  const features = (c.features ?? []).slice(0, 3)
  const stats = (c.stats ?? []).slice(0, 3)
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []
  const jamRows = c.info?.jam ?? []
  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa.replace(/[^\d]/g, '')}` : undefined

  // HALAL: flag eksplisit (data_konten) ATAU disebut di konten editable (jujur).
  const showHalal = halal === true
    || /halal/i.test(hero.eyebrow ?? '')
    || features.some((f) => /halal/i.test(`${f.title} ${f.desc}`))

  // Kategori dinamis dari katalog + "Semua".
  const categories = useMemo(
    () => ['Semua', ...Array.from(new Set(catalog.map((m) => m.kategori).filter(Boolean))) as string[]],
    [catalog],
  )

  // Filter: kategori + pencarian (nama/kategori).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.filter((m) => {
      const okCat = activeCat === 'Semua' || m.kategori === activeCat
      const okQ = !q || m.product_nama.toLowerCase().includes(q) || (m.kategori ?? '').toLowerCase().includes(q)
      return okCat && okQ
    })
  }, [catalog, activeCat, query])

  const visible = expanded || query.trim() ? filtered : filtered.slice(0, LIMIT)

  // Menu Andalan = kurasi manual owner (andalanIds). Kosong → section tak dirender.
  const andalan = useMemo(() => {
    if (!andalanIds?.length) return []
    const set = new Set(andalanIds)
    return catalog.filter((m) => set.has(m.pack_id))
  }, [catalog, andalanIds])

  // Storefront kecil (≤4 produk): rapikan jadi kolom ter-center (kartu, judul section,
  // chip kategori). Storefront besar (mis. Bakso 37 menu) tetap kiri-rata/GoFood-like —
  // lebih scannable, dan grid memang penuh sehingga tak ada ruang kosong.
  const isSparse = catalog.length <= 4

  const rootStyle = {
    '--co-primary': primary || '#FF6B35',
    '--co-deep': '#C2410C',
    '--co-tint': '#FFE9DF',
  } as React.CSSProperties

  function setCat(cat: string) {
    setActiveCat(cat)
    setExpanded(false)
  }

  // ── kartu menu (grid penuh) — fungsi render (bukan komponen bersarang) ──
  const renderCard = (m: PortalCatalogItem) => {
    const soldOut = m.avail_status === 'habis'
    const low = m.avail_status === 'menipis'
    const preorder = m.avail_status === 'preorder'
    const ready = m.avail_status === 'tersedia'
    const qty = qtyOf(m.pack_id)
    const pedas = isPedas(m)
    return (
      <article key={m.pack_id} className={`co-card${soldOut ? ' is-out' : ''}`}>
        <div className="co-card-frame">
          {/* Status stok NYATA dari avail_status (kontrak Portal) — satu badge stok per kartu, kiri-atas. */}
          {soldOut && <span className="co-badge co-badge-out">Habis</span>}
          {preorder && <span className="co-badge co-badge-po"><Clock size={11} aria-hidden /> Pre-Order</span>}
          {low && !soldOut && <span className="co-badge co-badge-low">Terbatas</span>}
          {ready && <span className="co-badge co-badge-ready"><Check size={11} aria-hidden /> Ready</span>}
          {/* Pedas = indikator terpisah, kanan-atas, agar tak bentrok dgn badge stok. */}
          {pedas && !soldOut && (
            <span className="co-badge co-badge-pedas co-badge-tr"><Flame size={11} aria-hidden /> Pedas</span>
          )}
          {m.foto_url
            ? <SmartImg src={m.foto_url} alt={m.product_nama} sizes="(max-width:600px) 50vw, 210px" />
            : <div className="co-card-ph" aria-hidden><Soup size={30} /></div>}
        </div>
        <div className="co-card-body">
          {/* FAB/stepper hidup di body (punya padding-top 22px utk overlap) — di frame ber-overflow:hidden ia kepotong. */}
          {soldOut ? (
            <button className="co-fab" disabled aria-label={`${m.product_nama} habis`}><Plus size={20} aria-hidden /></button>
          ) : qty === 0 ? (
            <button className="co-fab" onClick={() => add({ pack_id: m.pack_id, nama: m.product_nama, harga: m.harga, kategori: m.kategori, gambar: m.foto_url, preorder })} aria-label={`Tambah ${m.product_nama}`}>
              <Plus size={20} aria-hidden />
            </button>
          ) : (
            <div className="co-step">
              <button onClick={() => dec(m.pack_id)} aria-label={`Kurangi ${m.product_nama}`}><Minus size={17} aria-hidden /></button>
              <span className="co-q" aria-live="polite">{qty}</span>
              <button onClick={() => inc(m.pack_id)} aria-label={`Tambah ${m.product_nama}`}><Plus size={17} aria-hidden /></button>
            </div>
          )}
          <h3 className="co-card-name">{m.product_nama}</h3>
          {m.deskripsi && <p className="co-card-desc">{m.deskripsi}</p>}
          <div className="co-card-foot">
            <span className="co-price">{priceText(m.harga)}</span>
            {preorder && <span className="co-po-note">jadwal PO</span>}
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className={`co-root ${baloo2.variable} ${jakarta.variable}${count > 0 ? ' has-cart' : ''}`} data-sparse={isSparse ? '' : undefined} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: coCss() }} />

      {/* ── APP BAR ── */}
      <header className="co-appbar">
        <div className="co-appbar-in">
          <a href="#beranda" className="co-brand">
            <span className="co-mark"><Soup size={24} aria-hidden /></span>
            <span className="co-loc">
              <b>{c.nama ?? 'Menu'}</b>
              {(showHalal || hero.eyebrow) && (
                <small>
                  {showHalal && <ShieldCheck size={12} aria-hidden />}
                  {showHalal ? 'Halal' : ''}{showHalal && hero.eyebrow ? ' · ' : ''}{hero.eyebrow ?? ''}
                </small>
              )}
            </span>
          </a>
          <div className="co-search">
            <Search size={19} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari menu favoritmu…"
              aria-label="Cari menu"
            />
          </div>
          <button className="co-cart-ico" onClick={openCart} aria-label={`Buka keranjang${count > 0 ? ` (${count} item)` : ''}`}>
            <ShoppingBag size={21} aria-hidden />
            {count > 0 && <span className="co-cart-badge">{count}</span>}
          </button>
        </div>
      </header>

      <div className="co-wrap">
        {/* ── HERO ── */}
        <section className="co-hero" id="beranda">
          {/* Hero = elemen LCP. priority → next/image preload + fetchpriority high,
              di-WebP/AVIF + resize (sebelumnya PNG ~0.8 MB sbg CSS background yang
              ditemukan telat). Duduk di z-0 di belakang gradient (::before z-1). */}
          <SmartImg src={hero.image} alt="" priority sizes="100vw"
            className="co-hero-media" objectPosition={hero.imagePosition || 'center 38%'} />
          {showHalal && (
            <div className="co-halal" role="img" aria-label="Sertifikasi seratus persen Halal">
              <ShieldCheck size={19} aria-hidden /><b>HALAL</b><small>100%</small>
            </div>
          )}
          <div className="co-hero-in">
            {hero.eyebrow && <span className="co-pill"><span className="co-dot" />{hero.eyebrow}</span>}
            <h1 className="co-hero-title">{hero.title || c.nama || 'Pesan Sekarang'}</h1>
            {hero.subtitle && <p className="co-hero-sub">{hero.subtitle}</p>}
            <a href="#menu" className="co-hero-cta">{hero.ctaText ?? 'Pesan Sekarang'} <ArrowRight size={19} aria-hidden /></a>
            {stats.length > 0 && (
              <div className="co-hero-trust">
                {stats.map((s, i) => (
                  <span className="co-trust" key={i}><b>{s.angka}</b> {s.label}</span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── INFO STRIP (dari fitur editable) ── */}
        {features.length > 0 && (
          <div className="co-info-strip">
            {features.map((f, i) => {
              const Ic = iconForFeature(f.title)
              return (
                <div className="co-info-card" key={i}>
                  <span className="co-info-ic"><Ic size={22} aria-hidden /></span>
                  <div className="co-info-txt"><b>{f.title}</b><span>{f.desc}</span></div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── MENU ANDALAN (kurasi manual) ── */}
        {andalan.length > 0 && (
          <>
            <div className="co-sec-head">
              <h2><Flame size={22} aria-hidden /> Menu Andalan</h2>
              <span className="co-sub">Pilihan dari kami</span>
            </div>
            <div className="co-laris" data-sparse={isSparse ? '' : undefined}>
              {andalan.map((m) => {
                const soldOut = m.avail_status === 'habis'
                return (
                  <article className="co-lcard" key={m.pack_id}>
                    <div className="co-lf">
                      {m.foto_url
                        ? <SmartImg src={m.foto_url} alt={m.product_nama} sizes="158px" />
                        : <div className="co-card-ph" aria-hidden><Soup size={24} /></div>}
                    </div>
                    <div className="co-lbody">
                      <div className="co-lname">{m.product_nama}</div>
                      <div className="co-lrow">
                        <span className="co-lprice">{priceText(m.harga)}</span>
                        <button
                          className="co-mini"
                          disabled={soldOut}
                          onClick={() => add({ pack_id: m.pack_id, nama: m.product_nama, harga: m.harga, kategori: m.kategori, gambar: m.foto_url, preorder: m.avail_status === 'preorder' })}
                          aria-label={soldOut ? `${m.product_nama} habis` : `Tambah ${m.product_nama}`}
                        >
                          <Plus size={17} aria-hidden />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}

        {/* ── CHIPS KATEGORI ── */}
        {categories.length > 1 && (
          <div className="co-chips-wrap">
            <div className="co-chips" role="tablist" aria-label="Kategori menu">
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={cat === activeCat}
                  className={`co-chip${cat === activeCat ? ' active' : ''}`}
                  onClick={() => setCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── GRID MENU ── */}
        <main className="co-menu" id="menu">
          <div className="co-sec-head">
            <h2>{activeCat === 'Semua' ? 'Semua Menu' : activeCat}</h2>
            <span className="co-sub">{filtered.length} menu</span>
          </div>
          {visible.length > 0 ? (
            <div className="co-grid" data-sparse={isSparse ? '' : undefined}>
              {visible.map((m) => renderCard(m))}
            </div>
          ) : (
            <p className="co-empty">Menu tak ditemukan. Coba kata kunci lain.</p>
          )}
          {!query.trim() && filtered.length > LIMIT && (
            <div className="co-more-wrap">
              <button className="co-more-btn" onClick={() => setExpanded((v) => !v)}>
                {expanded ? 'Lihat lebih sedikit' : `Lihat Semua Menu (${filtered.length})`}
              </button>
            </div>
          )}
        </main>

        {/* ── STATEMENT (opsional) ── */}
        {c.statement && (
          <div className="co-statement">
            <div className="co-stmt-inner">
              {c.statement.eyebrow && <p className="co-stmt-ew">{c.statement.eyebrow}</p>}
              <blockquote className="co-stmt-quote">{c.statement.quote}</blockquote>
              {c.statement.cite && <cite className="co-stmt-cite">— {c.statement.cite}</cite>}
            </div>
          </div>
        )}

        {/* ── ABOUT (opsional) ── */}
        {c.about && (
          <section className="co-about" id="tentang">
            <div className={`co-about-in${c.about.image ? '' : ' solo'}`}>
              <div>
                <p className="co-eyebrow">Tentang Kami</p>
                <h2 className="co-about-title">{c.about.title}</h2>
                <p className="co-about-body">{c.about.body}</p>
              </div>
              {c.about.image && (
                <div className="co-about-img"><SmartImg src={c.about.image} alt={c.about.title} sizes="(max-width:760px) 100vw, 540px" /></div>
              )}
            </div>
          </section>
        )}

        {/* ── TESTIMONI (opsional) ── */}
        {testimonials.length > 0 && (
          <section className="co-testi" id="ulasan">
            <div className="co-sec-head"><h2>Kata Pelanggan</h2></div>
            <div className="co-testi-track">
              {testimonials.map((t, i) => (
                <div className="co-testi-card" key={i}>
                  <p className="co-testi-quote">&ldquo;{t.quote}&rdquo;</p>
                  <p className="co-testi-name">{t.nama}</p>
                  {t.peran && <p className="co-testi-role">{t.peran}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQ (opsional) ── */}
        {faqs.length > 0 && (
          <section className="co-faq" id="faq">
            <div className="co-sec-head"><h2>Sering Ditanyakan</h2></div>
            <div className="co-faq-wrap">
              {faqs.map((f, i) => (
                <div className="co-faq-item" key={i}>
                  <button className="co-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                    <span>{f.q}</span>
                    <span className={`co-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden>+</span>
                  </button>
                  {openFaq === i && <p className="co-faq-a">{f.a}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="co-footer">
        <div className="co-footer-brand">{c.nama ?? 'Menu'}</div>
        {(hero.subtitle || c.about?.body) && (
          <p className="co-footer-tag">{hero.subtitle ?? `${c.nama} — pesan mudah, kirim cepat.`}</p>
        )}
        {features.length > 0 && (
          <div className="co-footer-facts">
            {features.map((f, i) => <span key={i}>{f.title}</span>)}
            {showHalal && <span>100% Halal</span>}
          </div>
        )}
        {jamRows.length > 0 && (
          <p className="co-footer-jam"><Clock size={13} aria-hidden /> {jamRows.map((j) => `${j.hari}: ${j.jam}`).join(' · ')}</p>
        )}
        {c.contact?.alamat && <p className="co-footer-jam"><MapPin size={13} aria-hidden /> {c.contact.alamat}</p>}
        {waUrl && (
          <a className="co-wa" href={waUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden /> Chat WhatsApp
          </a>
        )}
      </footer>

      {/* ── BOTTOM CART BAR ── */}
      <div className={`co-cart-bar${count > 0 ? ' show' : ''}`} role="region" aria-label="Ringkasan pesanan" aria-hidden={count === 0}>
        <div className="co-cart-left">
          <div className="co-cart-cico">
            <ShoppingBag size={21} aria-hidden />
            <span className="co-cart-b">{count}</span>
          </div>
          <div>
            <div className="co-cart-items">{count} item</div>
            <div className="co-cart-total">{fmt(subtotal)}</div>
          </div>
        </div>
        <button className="co-cart-go" onClick={openCart} tabIndex={count === 0 ? -1 : 0}>
          Lanjut Pesan <ArrowRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  )
}

// ── CSS namespaced .co-* (port mockup "Ceria & Ramah", parametrik --co-primary) ──
function coCss(): string {
  return `
.co-root{
  --co-sunny:#FFB81C;--co-green:#15803D;--co-green-tint:#E3F6EE;
  --co-bg:#FFF8F0;--co-surface:#fff;--co-surface-soft:#FFF1E6;
  --co-ink:#3A2A1E;--co-ink-dim:#5E4A3A;--co-muted:#6E5D50;--co-grey:#A89B8E;
  --co-line:#F0E6DA;--co-line2:#F6EFE6;
  --co-shadow:0 6px 20px rgba(58,42,30,.08);--co-shadow-lg:0 18px 40px rgba(58,42,30,.16);
  --co-display:var(--co-font-display),'Baloo 2','Segoe UI',system-ui,sans-serif;
  --co-body:var(--co-font-body),'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif;
  --co-bounce:cubic-bezier(.34,1.56,.64,1);
  font-family:var(--co-body);color:var(--co-ink);background:var(--co-bg);line-height:1.55;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden;
}
.co-root *,.co-root *::before,.co-root *::after{box-sizing:border-box;margin:0;padding:0}
/* Saat keranjang berisi, bottom cart bar (fixed) muncul → beri ruang di akhir
   halaman agar bar tak menutupi footer/konten terakhir. Kosong → tanpa gap. */
.co-root.has-cart{padding-bottom:96px}
.co-root h1,.co-root h2,.co-root h3{font-family:var(--co-display);line-height:1.15;letter-spacing:-.01em}
.co-root img{display:block;max-width:100%}
.co-root :focus-visible{outline:3px solid var(--co-primary);outline-offset:2px;border-radius:8px}
.co-wrap{max-width:1080px;margin:0 auto;padding:0 16px}

/* APP BAR */
.co-appbar{position:sticky;top:0;z-index:100;background:rgba(255,248,240,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--co-line)}
.co-appbar-in{max-width:1080px;margin:0 auto;padding:10px 16px;display:flex;align-items:center;gap:12px}
.co-brand{display:flex;align-items:center;gap:10px;color:var(--co-ink);text-decoration:none;flex-shrink:0}
.co-mark{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,var(--co-sunny),var(--co-primary));display:grid;place-items:center;box-shadow:0 6px 14px rgba(255,107,53,.35);color:var(--co-ink)}
.co-loc{display:flex;flex-direction:column;line-height:1.12}
.co-loc b{font-family:var(--co-display);font-weight:800;font-size:18px}
.co-loc small{font-size:11px;color:var(--co-muted);font-weight:600;display:inline-flex;align-items:center;gap:4px}
.co-loc small svg{color:var(--co-green)}
.co-search{flex:1;display:flex;align-items:center;gap:8px;background:var(--co-surface);border:1.5px solid var(--co-line);border-radius:14px;padding:0 14px;min-height:46px;transition:border-color .2s,box-shadow .2s}
.co-search:focus-within{border-color:var(--co-primary);box-shadow:0 0 0 4px var(--co-tint)}
.co-search svg{color:var(--co-muted);flex-shrink:0}
.co-search input{border:none;background:none;outline:none;font:600 16px/1 var(--co-body);color:var(--co-ink);width:100%}
.co-search input::placeholder{color:var(--co-muted);font-weight:500}
.co-cart-ico{position:relative;width:46px;height:46px;border:none;background:var(--co-surface-soft);border-radius:14px;display:grid;place-items:center;cursor:pointer;flex-shrink:0;color:var(--co-deep);transition:background .2s,transform .2s var(--co-bounce)}
.co-cart-ico:hover{background:var(--co-tint);transform:translateY(-1px)}
.co-cart-badge{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;background:var(--co-primary);color:#fff;font-size:11px;font-weight:800;border-radius:999px;display:grid;place-items:center;padding:0 5px;border:2px solid var(--co-bg)}

/* HERO */
.co-hero{margin:16px 0 8px;border-radius:26px;overflow:hidden;position:relative;min-height:300px;display:flex;align-items:flex-end;background-color:#3A2A1E;box-shadow:var(--co-shadow-lg)}
.co-hero-media{z-index:0}
.co-hero::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(100deg,rgba(40,22,12,.9) 0%,rgba(40,22,12,.65) 38%,rgba(40,22,12,.05) 75%)}
.co-hero-in{position:relative;z-index:2;padding:clamp(22px,4vw,38px);max-width:600px;color:#fff}
.co-pill{display:inline-flex;align-items:center;gap:7px;background:var(--co-green);color:#fff;font-weight:800;font-size:12.5px;padding:6px 13px;border-radius:999px;margin-bottom:14px}
.co-dot{width:7px;height:7px;border-radius:50%;background:#fff;animation:co-blink 1.6s infinite}
@keyframes co-blink{0%{opacity:.4}50%{opacity:1}100%{opacity:.4}}
.co-hero-title{font-size:clamp(26px,4.6vw,40px);font-weight:800;margin-bottom:8px;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.3)}
.co-hero-sub{font-size:clamp(14px,2vw,16px);color:#FCEFE2;margin-bottom:18px;max-width:46ch;text-wrap:pretty}
.co-hero-cta{display:inline-flex;align-items:center;gap:8px;background:var(--co-primary);color:#fff;font-weight:800;font-size:15.5px;border:none;min-height:50px;padding:0 26px;border-radius:999px;text-decoration:none;cursor:pointer;box-shadow:0 10px 24px rgba(255,107,53,.4);transition:transform .2s var(--co-bounce),filter .2s}
.co-hero-cta:hover{transform:translateY(-2px) scale(1.02);filter:brightness(1.05)}
.co-hero-trust{display:flex;gap:16px;margin-top:16px;flex-wrap:wrap}
.co-trust{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#FCEFE2}
.co-trust b{font-weight:800;color:var(--co-sunny);font-family:var(--co-display)}
.co-halal{position:absolute;top:16px;right:16px;z-index:3;width:80px;height:80px;border-radius:50%;background:var(--co-green);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 8px 20px rgba(22,160,106,.45);border:3px solid rgba(255,255,255,.65);transform:rotate(7deg)}
.co-halal b{font-family:var(--co-display);font-weight:800;font-size:14px;line-height:1}
.co-halal small{font-size:9px;font-weight:700;letter-spacing:.05em;opacity:.92}

/* INFO STRIP */
.co-info-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0 4px}
.co-info-card{display:flex;align-items:center;gap:12px;background:var(--co-surface);border:1px solid var(--co-line2);border-radius:18px;padding:14px 16px;box-shadow:var(--co-shadow)}
.co-info-ic{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;flex-shrink:0;background:var(--co-tint);color:var(--co-deep)}
.co-info-txt b{font-family:var(--co-display);font-size:15px;color:var(--co-ink);display:block;line-height:1.2}
.co-info-txt span{font-size:12.5px;color:var(--co-muted);font-weight:600}

/* SECTION HEAD */
.co-sec-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:24px 0 14px}
.co-sec-head h2{font-size:clamp(19px,2.6vw,24px);font-weight:800;color:var(--co-ink);display:flex;align-items:center;gap:8px}
.co-sec-head h2 svg{color:var(--co-primary)}
.co-sec-head .co-sub{font-size:13px;color:var(--co-muted);font-weight:600;flex-shrink:0}
/* Storefront kecil (root[data-sparse]): judul section + chip kategori ikut center,
   selaras dgn kartu yang sudah ter-center. Judul jadi kolom (h2 di atas, sub di bawah). */
.co-root[data-sparse] .co-sec-head{flex-direction:column;align-items:center;text-align:center;gap:4px}
.co-root[data-sparse] .co-chips{justify-content:safe center}

/* MENU ANDALAN (carousel) */
.co-laris{display:flex;gap:12px;overflow-x:auto;scrollbar-width:none;padding:4px 16px 8px;margin:0 -16px;scroll-snap-type:x mandatory}
.co-laris[data-sparse]{justify-content:safe center}
.co-laris::-webkit-scrollbar{display:none}
.co-lcard{flex:0 0 158px;scroll-snap-align:start;background:var(--co-surface);border:1px solid var(--co-line2);border-radius:18px;overflow:hidden;box-shadow:var(--co-shadow);transition:transform .25s,box-shadow .25s}
.co-lcard:hover{transform:translateY(-4px);box-shadow:var(--co-shadow-lg)}
.co-lf{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--co-surface-soft)}
.co-lf img{width:100%;height:100%;object-fit:cover}
.co-lbody{padding:9px 11px 11px}
.co-lname{font-size:13.5px;font-weight:700;color:var(--co-ink);line-height:1.2;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.co-lrow{display:flex;align-items:center;justify-content:space-between;gap:6px}
.co-lprice{font-size:14.5px;font-weight:800;color:var(--co-deep);font-variant-numeric:tabular-nums}
.co-mini{width:40px;height:40px;border:none;border-radius:10px;background:var(--co-tint);color:var(--co-deep);cursor:pointer;display:grid;place-items:center;transition:background .15s,color .15s,transform .15s var(--co-bounce)}
.co-mini:hover:not(:disabled){background:var(--co-primary);color:#fff;transform:scale(1.08)}
.co-mini:disabled{background:var(--co-line);color:var(--co-grey);cursor:not-allowed}

/* CHIPS */
.co-chips-wrap{position:sticky;top:67px;z-index:90;background:var(--co-bg);padding:10px 0;margin:0 -16px;padding-left:16px;padding-right:16px}
.co-chips{display:flex;gap:9px;overflow-x:auto;scrollbar-width:none}
.co-chips::-webkit-scrollbar{display:none}
.co-chip{font:700 14px/1 var(--co-body);color:var(--co-ink-dim);background:var(--co-surface);border:1.5px solid var(--co-line);min-height:44px;padding:0 18px;border-radius:999px;cursor:pointer;white-space:nowrap;transition:border-color .2s,background .2s,color .2s,transform .15s var(--co-bounce)}
.co-chip:hover{border-color:var(--co-primary);transform:translateY(-1px)}
.co-chip.active{background:var(--co-primary);color:#fff;border-color:var(--co-primary);box-shadow:0 6px 14px rgba(255,107,53,.3)}

/* MENU GRID */
.co-menu{padding-bottom:24px}
.co-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px}
/* Katalog kecil (≤4 item): cap lebar kartu + center supaya grid tak lengang di desktop. Tenant banyak-produk (default, tanpa [data-sparse]) tak terpengaruh. */
.co-grid[data-sparse]{grid-template-columns:repeat(auto-fit,minmax(220px,300px));justify-content:center}
.co-card{position:relative;background:var(--co-surface);border:1px solid var(--co-line2);border-radius:22px;overflow:hidden;box-shadow:var(--co-shadow);transition:transform .25s,box-shadow .25s;display:flex;flex-direction:column}
.co-card:hover{transform:translateY(-4px);box-shadow:var(--co-shadow-lg)}
.co-card-frame{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--co-surface-soft)}
.co-card-frame img{width:100%;height:100%;object-fit:cover;transition:transform .45s}
.co-card:hover .co-card-frame img{transform:scale(1.05)}
.co-card-ph{width:100%;height:100%;display:grid;place-items:center;color:var(--co-grey);background:var(--co-surface-soft)}
.co-badge{position:absolute;top:9px;left:9px;z-index:2;display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:800;padding:4px 9px;border-radius:8px;color:#fff}
.co-badge-po{background:var(--co-primary)}
.co-badge-low{background:#B45309}
.co-badge-out{background:#6E5D50}
.co-badge-ready{background:var(--co-green)}
.co-badge-pedas{background:var(--co-sunny);color:#5A3D00}
.co-badge-tr{left:auto;right:9px}
.co-fab{position:absolute;right:10px;top:-22px;width:40px;height:40px;border:none;border-radius:13px;background:var(--co-primary);color:#fff;box-shadow:0 8px 18px rgba(255,107,53,.4);cursor:pointer;display:grid;place-items:center;transition:transform .2s var(--co-bounce),filter .2s;z-index:3}
.co-fab:hover:not(:disabled){filter:brightness(1.06);transform:scale(1.1)}
.co-fab:active:not(:disabled){transform:scale(.92)}
.co-fab:disabled{background:var(--co-grey);box-shadow:none;cursor:not-allowed}
.co-step{position:absolute;right:10px;top:-22px;display:inline-flex;align-items:center;gap:5px;background:var(--co-surface);border-radius:13px;box-shadow:0 8px 18px rgba(58,42,30,.2);padding:3px;z-index:3;animation:co-pop .2s var(--co-bounce)}
@keyframes co-pop{0%{transform:scale(.8);opacity:0}100%{transform:scale(1);opacity:1}}
.co-step button{width:36px;height:36px;border:none;border-radius:10px;background:var(--co-tint);color:var(--co-deep);cursor:pointer;display:grid;place-items:center;transition:background .15s,color .15s}
.co-step button:hover{background:var(--co-primary);color:#fff}
.co-q{min-width:1.4ch;text-align:center;font-weight:800;font-variant-numeric:tabular-nums;font-size:16px}
.co-card-body{position:relative;padding:26px 14px 16px;display:flex;flex-direction:column;gap:5px;flex:1}
.co-card-name{font-family:var(--co-display);font-size:17px;font-weight:700;color:var(--co-ink);line-height:1.2}
.co-card-desc{font-size:12.5px;color:var(--co-muted);font-weight:500;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.co-card-foot{display:flex;align-items:baseline;gap:8px;margin-top:auto;padding-top:4px}
.co-price{font-size:18px;font-weight:800;color:var(--co-deep);font-variant-numeric:tabular-nums}
.co-po-note{font-size:11px;color:var(--co-muted);font-weight:600}
.co-card.is-out .co-card-frame img{filter:grayscale(.7) opacity(.6)}
.co-empty{text-align:center;color:var(--co-muted);font-weight:600;padding:32px 0}
.co-more-wrap{text-align:center;margin-top:18px}
.co-more-btn{font:800 14px/1 var(--co-body);color:var(--co-deep);background:var(--co-surface);border:1.5px solid var(--co-tint);min-height:48px;padding:0 26px;border-radius:999px;cursor:pointer;box-shadow:var(--co-shadow);transition:background .2s,color .2s,border-color .2s,transform .15s var(--co-bounce)}
.co-more-btn:hover{background:var(--co-primary);color:#fff;border-color:var(--co-primary);transform:translateY(-1px)}

/* STATEMENT */
.co-statement{padding:8px 0 4px}
.co-stmt-inner{max-width:60ch;margin:0 auto;background:var(--co-surface);border:1px solid var(--co-line2);border-radius:22px;padding:clamp(18px,3vw,28px);text-align:center;box-shadow:var(--co-shadow)}
.co-stmt-ew{font-size:12.5px;font-weight:800;color:var(--co-deep);margin-bottom:10px;text-transform:uppercase;letter-spacing:.04em}
.co-stmt-quote{font-family:var(--co-display);font-size:clamp(18px,2.6vw,24px);color:var(--co-ink);line-height:1.35}
.co-stmt-cite{display:block;font-size:13px;color:var(--co-muted);font-weight:600;margin-top:14px;font-style:normal}

/* ABOUT */
.co-eyebrow{font-size:12.5px;font-weight:800;color:var(--co-deep);text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px}
.co-about{padding:24px 0 4px}
.co-about-in{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,4vw,44px);align-items:center}
.co-about-in.solo{grid-template-columns:1fr;max-width:60ch;margin:0 auto;text-align:center}
.co-about-in.solo .co-about-body{margin-left:auto;margin-right:auto}
.co-about-title{font-size:clamp(20px,3vw,28px);font-weight:800;color:var(--co-ink);margin-bottom:10px}
.co-about-body{font-size:15px;color:var(--co-ink-dim);line-height:1.7;max-width:54ch;white-space:pre-line}
.co-about-img{position:relative;aspect-ratio:4/3;border-radius:22px;overflow:hidden;box-shadow:var(--co-shadow-lg)}
.co-about-img img{width:100%;height:100%;object-fit:cover}

/* TESTIMONI */
.co-testi{padding:24px 0 4px}
.co-testi-track{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding-bottom:8px;margin:0 -16px;padding-left:16px;padding-right:16px}
.co-testi-track::-webkit-scrollbar{display:none}
.co-testi-card{scroll-snap-align:start;flex:0 0 300px;background:var(--co-surface);border:1px solid var(--co-line2);border-radius:18px;padding:18px;box-shadow:var(--co-shadow)}
.co-testi-quote{font-size:14.5px;color:var(--co-ink-dim);line-height:1.6;margin-bottom:12px}
.co-testi-name{font-size:15px;font-weight:800;color:var(--co-ink);font-family:var(--co-display)}
.co-testi-role{font-size:12px;color:var(--co-muted);font-weight:600;margin-top:2px}

/* FAQ */
.co-faq{padding:24px 0 8px}
.co-faq-wrap{max-width:760px;margin:0 auto}
.co-faq-item{background:var(--co-surface);border:1px solid var(--co-line2);border-radius:16px;margin-bottom:8px;overflow:hidden;box-shadow:var(--co-shadow)}
.co-faq-q{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;padding:14px 16px;cursor:pointer;font:800 15.5px/1.3 var(--co-body);color:var(--co-ink);background:none;border:none;text-align:left}
.co-faq-icon{font-size:22px;color:var(--co-primary);flex-shrink:0;transition:transform .3s var(--co-bounce);line-height:1}
.co-faq-icon.open{transform:rotate(45deg)}
.co-faq-a{font-size:14px;color:var(--co-ink-dim);line-height:1.7;padding:0 16px 14px}

/* FOOTER */
.co-footer{background:var(--co-surface);border-top:1px solid var(--co-line);padding:30px 16px 42px;text-align:center;color:var(--co-muted);font-size:13.5px;margin-top:8px}
.co-footer-brand{font-family:var(--co-display);font-weight:800;font-size:20px;color:var(--co-ink);margin-bottom:6px}
.co-footer-tag{max-width:46ch;margin:0 auto 10px;line-height:1.6}
.co-footer-facts{display:flex;flex-wrap:wrap;gap:8px 18px;justify-content:center;margin-top:10px;font-weight:600}
.co-footer-jam{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:10px;font-weight:600;text-align:center}
.co-wa{display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#08361b;font-weight:800;min-height:48px;padding:0 24px;border-radius:13px;text-decoration:none;margin-top:16px;font-size:14px;transition:transform .2s var(--co-bounce)}
.co-wa:hover{transform:translateY(-2px)}

/* BOTTOM CART BAR */
.co-cart-bar{position:fixed;left:50%;transform:translate(-50%,170%);bottom:16px;z-index:95;width:min(640px,calc(100vw - 28px));background:var(--co-primary);color:#fff;border-radius:18px;padding:11px 12px 11px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;box-shadow:0 16px 38px rgba(224,81,28,.45);transition:transform .42s var(--co-bounce)}
.co-cart-bar.show{transform:translate(-50%,0)}
.co-cart-left{display:flex;align-items:center;gap:12px}
.co-cart-cico{position:relative;width:42px;height:42px;background:rgba(255,255,255,.2);border-radius:12px;display:grid;place-items:center;color:#fff}
.co-cart-b{position:absolute;top:-5px;right:-5px;min-width:18px;height:18px;background:var(--co-sunny);color:#5A3D00;font-size:11px;font-weight:800;border-radius:999px;display:grid;place-items:center;border:2px solid var(--co-primary)}
.co-cart-items{font-size:12px;opacity:.9;font-weight:600}
.co-cart-total{font-family:var(--co-display);font-weight:800;font-size:19px;font-variant-numeric:tabular-nums;line-height:1.05}
.co-cart-go{display:inline-flex;align-items:center;gap:7px;background:#fff;color:var(--co-deep);font-weight:800;font-size:15px;border:none;min-height:48px;padding:0 22px;border-radius:13px;cursor:pointer;transition:transform .2s var(--co-bounce),filter .2s}
.co-cart-go:hover{transform:scale(1.03)}
.co-cart-go:active{transform:scale(.96)}

/* RESPONSIVE */
@media(max-width:640px){
  .co-info-strip{display:flex;overflow-x:auto;scrollbar-width:none;gap:10px;margin:14px -16px 4px;padding:2px 16px;scroll-snap-type:x mandatory}
  .co-info-strip::-webkit-scrollbar{display:none}
  .co-info-card{flex:0 0 auto;min-width:214px;scroll-snap-align:start}
  .co-about-in{grid-template-columns:1fr;gap:16px}
  .co-about-img{order:-1}
}
@media(max-width:600px){
  .co-loc{display:none}
  .co-hero{min-height:268px}
  .co-hero::before{background:linear-gradient(180deg,rgba(40,22,12,.45),rgba(40,22,12,.86))}
  .co-halal{width:60px;height:60px;top:12px;right:12px}
  .co-halal b{font-size:12px}
  .co-pill{max-width:calc(100% - 76px);text-wrap:balance}
  .co-grid{grid-template-columns:1fr 1fr;gap:11px}
  .co-grid[data-sparse]{grid-template-columns:minmax(0,360px);justify-content:center}
  .co-card-body{padding:26px 11px 13px}
  .co-card-name{font-size:15px}
  .co-price{font-size:16px}
  .co-chips-wrap{top:66px}
}
@media (prefers-reduced-motion: reduce){
  .co-root *,.co-root *::before,.co-root *::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
}
`
}
