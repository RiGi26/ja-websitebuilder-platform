// ============================================================
// THEME SYSTEM — Lapis 2 perpustakaan balok (S0-2 + S1-2).
// Balok section parametrik via token (CSS vars dari packs.ts). Tiap section
// punya beberapa VARIAN; manifest memilih varian per slot.
// S1-2: dukungan FOTO hero (gradient → foto + scrim) + balok Features (keunggulan).
//
// Konvensi: semua warna/font/radius/shadow lewat var(--c-*/--f-*/--r-*/--s-*),
// JANGAN hex hardcoded — kecuali scrim hitam untuk keterbacaan teks di atas foto.
// ============================================================
import type { ComposableContent, ShowcaseItem, MotifVariant, Testimonial, StatItem, FaqItem, InfoLokasi } from '@/lib/theme-system/manifest'

export const ENGINE_CSS = `
.ce-root { background: var(--c-page); color: var(--c-ink); font-family: var(--f-body); font-weight: var(--fw-body); -webkit-font-smoothing: antialiased; }
.ce-root h1, .ce-root h2, .ce-root h3 { font-family: var(--f-display); font-weight: var(--fw-display); letter-spacing: var(--tracking); text-wrap: balance; }
.ce-btn { background: var(--c-primary); color: var(--c-on-primary); border-radius: var(--r-pill); box-shadow: var(--s-md); transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s ease; text-decoration: none; }
.ce-btn:hover { transform: translateY(-2px); box-shadow: var(--s-lg); }
.ce-btn:active { transform: scale(.97); }
.ce-card { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--s-sm); transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease; overflow: hidden; }
.ce-card:hover { transform: translateY(-4px); box-shadow: var(--s-lg); }
.ce-eyebrow { color: var(--c-primary); text-transform: uppercase; letter-spacing: .18em; font-weight: 700; font-size: 12px; }
.ce-menu-row { border-top: 1px solid var(--c-border); transition: padding-left .2s ease, background-color .2s ease; }
.ce-menu-row:hover { padding-left: 8px; background: color-mix(in srgb, var(--c-primary) 5%, transparent); }
.ce-feat-row { border-top: 1px solid var(--c-border); transition: padding-left .2s ease; }
.ce-feat-row:hover { padding-left: 8px; }
.ce-root p { text-wrap: pretty; }
.ce-price { font-variant-numeric: tabular-nums; }
.ce-btn:hover { box-shadow: 0 12px 28px color-mix(in srgb, var(--c-primary) 38%, transparent); }
/* Stagger fade-in (CSS-only, server-safe) */
.ce-stagger > * { opacity: 0; transform: translateY(14px); animation: ceFadeUp .5s cubic-bezier(.16,1,.3,1) forwards; }
.ce-stagger > *:nth-child(1){animation-delay:0ms}.ce-stagger > *:nth-child(2){animation-delay:80ms}.ce-stagger > *:nth-child(3){animation-delay:160ms}.ce-stagger > *:nth-child(4){animation-delay:240ms}.ce-stagger > *:nth-child(5){animation-delay:320ms}.ce-stagger > *:nth-child(6){animation-delay:400ms}.ce-stagger > *:nth-child(n+7){animation-delay:480ms}
@keyframes ceFadeUp { to { opacity: 1; transform: translateY(0); } }
/* Lookbook (editorial fashion) — image zoom halus saat hover, tanpa JS */
.ce-look-frame { overflow: hidden; border-radius: var(--r-lg); border: 1px solid var(--c-border); background: linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to)); }
.ce-look-img { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1.001); transition: transform .6s cubic-bezier(.16,1,.3,1); }
.ce-look-card:hover .ce-look-img { transform: scale(1.05); }
.ce-look-idx { font-family: var(--f-display); font-weight: var(--fw-display); color: var(--c-primary); opacity: .55; font-variant-numeric: tabular-nums; }
/* Floating WhatsApp — wajib konteks Indonesia */
.ce-wa { position: fixed; right: 20px; bottom: 20px; z-index: 999; width: 56px; height: 56px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 22px rgba(37,211,102,.40); transition: transform .2s cubic-bezier(.16,1,.3,1); }
.ce-wa:hover { transform: scale(1.08); }
.ce-wa:active { transform: scale(.96); }
/* ── Sprint 5 balok ───────────────────────────────────────── */
/* Testimoni — kartu quote: lift + border menyala primary saat hover */
.ce-quote { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--s-sm); transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease, border-color .25s ease; }
.ce-quote:hover { transform: translateY(-4px); box-shadow: var(--s-lg); border-color: color-mix(in srgb, var(--c-primary) 40%, var(--c-border)); }
.ce-quote-mark { font-family: var(--f-display); font-weight: var(--fw-display); color: var(--c-primary); opacity: .28; line-height: .6; }
/* Marquee testimoni — dua track berjalan, CSS-only, jeda saat hover */
.ce-marquee { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.ce-marquee-track { display: flex; gap: 20px; width: max-content; animation: ceMarquee 38s linear infinite; }
.ce-marquee:hover .ce-marquee-track { animation-play-state: paused; }
@keyframes ceMarquee { to { transform: translateX(-50%); } }
/* Stats — angka kredibilitas, tabular-nums, garis pemisah halus */
.ce-stat-num { font-family: var(--f-display); font-weight: var(--fw-display); color: var(--c-primary); font-variant-numeric: tabular-nums; line-height: 1; letter-spacing: var(--tracking); }
/* FAQ — accordion CSS-only via <details>, ikon +/− berputar */
.ce-faq { border-top: 1px solid var(--c-border); }
.ce-faq > summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 0; font-family: var(--f-display); font-weight: 700; color: var(--c-ink); transition: color .2s ease; }
.ce-faq > summary::-webkit-details-marker { display: none; }
.ce-faq > summary:hover { color: var(--c-primary); }
.ce-faq-ico { flex-shrink: 0; width: 26px; height: 26px; border-radius: 999px; background: color-mix(in srgb, var(--c-primary) 12%, transparent); color: var(--c-primary); display: flex; align-items: center; justify-content: center; transition: transform .25s cubic-bezier(.16,1,.3,1); }
.ce-faq[open] .ce-faq-ico { transform: rotate(45deg); }
.ce-faq-body { padding: 0 0 22px; color: var(--c-muted); line-height: 1.7; max-width: 640px; }
/* Info/Lokasi — kartu jam buka + peta embed */
.ce-map { border: 0; width: 100%; height: 100%; min-height: 280px; display: block; filter: grayscale(.15); }
.ce-jam-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 11px 0; border-top: 1px solid var(--c-border); }
.ce-jam-row:first-child { border-top: 0; }
@media (prefers-reduced-motion: reduce) { .ce-stagger > * { opacity: 1; transform: none; animation: none; } .ce-marquee-track { animation: none; } }
`

// Scrim untuk teks di atas foto (legibilitas konsisten apa pun temanya).
const HERO_SCRIM = 'linear-gradient(180deg, rgba(0,0,0,.30) 0%, rgba(0,0,0,.55) 100%)'

// ── MOTIF / TEKSTUR (panen dari BatikTokoRenderer) ────────────
// Tile SVG data-uri, ditint warna primary tema. Dipakai sebagai overlay halus
// di hero + strip footer untuk tema Kerajinan/Heritage. Parametrik: warna &
// opacity dari pemanggil, BUKAN hardcode → satu set motif melayani semua gaya.
function hexBody(hex?: string): string {
  return (hex ?? '#C8922A').replace('#', '')
}
// Kawung — motif batik Jawa klasik (4 elips + inti). Dipanen verbatim.
function motifKawung(color: string, opacity: number): string {
  const c = hexBody(color)
  return `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${c}' fill-opacity='${opacity}'%3E%3Cellipse cx='32' cy='8' rx='10' ry='7'/%3E%3Cellipse cx='32' cy='56' rx='10' ry='7'/%3E%3Cellipse cx='8' cy='32' rx='7' ry='10'/%3E%3Cellipse cx='56' cy='32' rx='7' ry='10'/%3E%3Ccircle cx='32' cy='32' r='6'/%3E%3C/g%3E%3C/svg%3E")`
}
// Tenun — anyaman silang (garis diagonal dua arah), nuansa wastra tenun.
function motifTenun(color: string, opacity: number): string {
  const c = hexBody(color)
  return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23${c}' stroke-opacity='${opacity}' stroke-width='2'%3E%3Cpath d='M0 10 L40 10 M0 30 L40 30'/%3E%3Cpath d='M10 0 L10 40 M30 0 L30 40' stroke-opacity='${opacity * 0.55}'/%3E%3C/g%3E%3C/svg%3E")`
}
function motifTile(variant: MotifVariant | undefined, color: string, opacity: number): string | null {
  if (variant === 'kawung') return motifKawung(color, opacity)
  if (variant === 'tenun') return motifTenun(color, opacity)
  return null
}
const motifSize = (v?: MotifVariant) => (v === 'tenun' ? '40px 40px' : '64px 64px')

// Overlay motif penuh (absolute) — dipakai di dalam hero. Subtil, di bawah konten.
function MotifOverlay({ motif, color, opacity = 0.08 }: { motif?: MotifVariant; color: string; opacity?: number }) {
  const tile = motifTile(motif, color, opacity)
  if (!tile) return null
  return <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: tile, backgroundSize: motifSize(motif) }} />
}

export function formatRupiah(n?: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return ''
  return 'Rp' + n.toLocaleString('id-ID')
}

export function Btn({ text, href }: { text?: string; href?: string }) {
  if (!text) return null
  return (
    <a href={href ?? '#'} className="ce-btn" style={{ display: 'inline-block', padding: '14px 32px', fontWeight: 700, fontSize: 15 }}>
      {text}
    </a>
  )
}

export function Nav({ content }: { content: ComposableContent }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', maxWidth: 1120, margin: '0 auto' }}>
      <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 20, letterSpacing: 'var(--tracking)' }}>{content.nama}</span>
      {content.hero.ctaText && <Btn text={content.hero.ctaText} href={content.hero.ctaHref} />}
    </header>
  )
}

// ── HERO varian (dukung foto opsional) ────────────────────────
type Hero = ComposableContent['hero']

// Latar hero: foto + scrim kalau ada gambar; gradient token kalau tidak.
function heroBg(image?: string): React.CSSProperties {
  if (image) {
    return { backgroundImage: `${HERO_SCRIM}, url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }
  // Gradient MESH (bukan flat): 2 radial aksen + linear dasar → ada kedalaman.
  return {
    backgroundImage: [
      'radial-gradient(ellipse 70% 55% at 18% 80%, color-mix(in srgb, var(--c-primary) 18%, transparent) 0%, transparent 60%)',
      'radial-gradient(ellipse 55% 45% at 85% 18%, color-mix(in srgb, var(--c-primary) 12%, transparent) 0%, transparent 55%)',
      'linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))',
    ].join(', '),
  }
}
const heroInk = (image?: string) => (image ? '#FFFFFF' : 'var(--c-hero-ink)')

export function HeroCentered({ hero, motif, motifColor }: { hero: Hero; motif?: MotifVariant; motifColor?: string }) {
  const ink = heroInk(hero.image)
  return (
    <section style={{ ...heroBg(hero.image), color: ink, padding: '96px 24px', position: 'relative', overflow: 'hidden' }}>
      <MotifOverlay motif={motif} color={hero.image ? '#FFFFFF' : motifColor ?? '#C8922A'} />
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {hero.eyebrow && <p className="ce-eyebrow" style={{ marginBottom: 16, color: hero.image ? '#FFFFFF' : 'var(--c-primary)' }}>{hero.eyebrow}</p>}
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.05, margin: 0, color: ink }}>{hero.title}</h1>
        {hero.subtitle && <p style={{ marginTop: 24, fontSize: 18, opacity: .9, lineHeight: 1.6 }}>{hero.subtitle}</p>}
        {hero.ctaText && <div style={{ marginTop: 32 }}><Btn text={hero.ctaText} href={hero.ctaHref} /></div>}
      </div>
    </section>
  )
}

export function HeroSplit({ hero, nama, motif, motifColor }: { hero: Hero; nama: string; motif?: MotifVariant; motifColor?: string }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: '112px 24px', position: 'relative', overflow: 'hidden' }}>
      <MotifOverlay motif={motif} color={motifColor ?? '#C8922A'} opacity={0.05} />
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div>
          {hero.eyebrow && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 36, height: 1, background: 'var(--c-primary)' }} />
              <span className="ce-eyebrow">{hero.eyebrow}</span>
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(38px, 5vw, 64px)', lineHeight: 1.08, margin: 0, color: 'var(--c-ink)' }}>{hero.title}</h1>
          {hero.subtitle && <p style={{ marginTop: 24, fontSize: 18, color: 'var(--c-muted)', lineHeight: 1.7, maxWidth: 520 }}>{hero.subtitle}</p>}
          {hero.ctaText && <div style={{ marginTop: 36 }}><Btn text={hero.ctaText} href={hero.ctaHref} /></div>}
        </div>
        <div style={{ position: 'relative', minHeight: 420, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--c-border)', boxShadow: 'var(--s-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...(hero.image ? { backgroundImage: `url(${hero.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: `linear-gradient(150deg, var(--c-hero-from), var(--c-hero-to))` }) }}>
          {!hero.image && (
            <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 'clamp(120px, 18vw, 220px)', lineHeight: 1, color: 'var(--c-hero-ink)', opacity: .9 }}>
              {(nama.trim()[0] ?? 'A').toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

export function HeroFullbleed({ hero, motif, motifColor }: { hero: Hero; motif?: MotifVariant; motifColor?: string }) {
  const ink = heroInk(hero.image)
  return (
    <section style={{ ...heroBg(hero.image), color: ink, minHeight: '90vh', display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden', padding: '0 24px 80px' }}>
      <MotifOverlay motif={motif} color={hero.image ? '#FFFFFF' : motifColor ?? '#C8922A'} opacity={0.07} />
      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        {hero.eyebrow && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ width: 36, height: 1, background: hero.image ? '#FFFFFF' : 'var(--c-primary)' }} />
            <span className="ce-eyebrow" style={{ color: hero.image ? '#FFFFFF' : 'var(--c-primary)' }}>{hero.eyebrow}</span>
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(48px, 9vw, 104px)', lineHeight: .98, margin: 0, color: ink }}>{hero.title}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 28, marginTop: 32 }}>
          {hero.subtitle && <p style={{ fontSize: 18, opacity: .9, lineHeight: 1.6, maxWidth: 480, margin: 0 }}>{hero.subtitle}</p>}
          {hero.ctaText && <Btn text={hero.ctaText} href={hero.ctaHref} />}
        </div>
      </div>
    </section>
  )
}

// ── FEATURES varian (keunggulan / "Mengapa Kami") ─────────────
type Feature = { title: string; desc: string }

function FeatHeading() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      <p className="ce-eyebrow" style={{ marginBottom: 10 }}>Mengapa Kami</p>
      <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', margin: 0, color: 'var(--c-ink)' }}>Alasan Pelanggan Selalu Kembali</h2>
    </div>
  )
}

export function FeaturesGrid({ features }: { features: Feature[] }) {
  return (
    <section style={{ background: 'var(--c-surface)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <FeatHeading />
        <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="ce-card" style={{ padding: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--c-primary)', opacity: .14, marginBottom: 18 }} />
              <h3 style={{ fontSize: 19, margin: '0 0 8px', color: 'var(--c-ink)' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeaturesRows({ features }: { features: Feature[] }) {
  return (
    <section style={{ background: 'var(--c-surface)', padding: '88px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <FeatHeading />
      {features.map((f, i) => (
        <div key={i} className="ce-feat-row" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'baseline', padding: '28px 0' }}>
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 40, lineHeight: 1, color: 'var(--c-primary)', opacity: .4 }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 style={{ fontSize: 22, margin: '0 0 8px', color: 'var(--c-ink)' }}>{f.title}</h3>
            <p style={{ fontSize: 15, color: 'var(--c-muted)', lineHeight: 1.7, margin: 0, maxWidth: 620 }}>{f.desc}</p>
          </div>
        </div>
      ))}
      </div>
    </section>
  )
}

// ── SHOWCASE varian (produk/menu) ─────────────────────────────
function ShowHeading({ title, subtitle }: { title?: string; subtitle?: string }) {
  if (!title && !subtitle) return null
  return (
    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      {title && <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', margin: '0 0 8px', color: 'var(--c-ink)' }}>{title}</h2>}
      {subtitle && <p style={{ fontSize: 16, color: 'var(--c-muted)', margin: 0 }}>{subtitle}</p>}
    </div>
  )
}

export function ShowcaseMenuList({ showcase }: { showcase: NonNullable<ComposableContent['showcase']> }) {
  return (
    <section style={{ padding: '88px 24px', maxWidth: 820, margin: '0 auto' }}>
      <ShowHeading title={showcase.title} subtitle={showcase.subtitle} />
      <div className="ce-stagger">
        {showcase.items.map((it: ShowcaseItem, i) => (
          <div key={i} className="ce-menu-row" style={{ padding: '22px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
              <h3 style={{ fontSize: 19, margin: 0, color: 'var(--c-ink)' }}>{it.nama}</h3>
              {it.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)', whiteSpace: 'nowrap' }}>{formatRupiah(it.harga)}</span>}
            </div>
            {it.desc && <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: '6px 0 0', maxWidth: 560 }}>{it.desc}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export function ShowcaseCardGrid({ showcase }: { showcase: NonNullable<ComposableContent['showcase']> }) {
  return (
    <section style={{ padding: '88px 24px', maxWidth: 1120, margin: '0 auto' }}>
      <ShowHeading title={showcase.title} subtitle={showcase.subtitle} />
      <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {showcase.items.map((it: ShowcaseItem, i) => (
          <div key={i} className="ce-card">
            <div style={{ aspectRatio: '4 / 3', background: it.gambar ? `center/cover no-repeat url(${it.gambar})` : `linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))` }} />
            <div style={{ padding: 20 }}>
              <h3 style={{ fontSize: 17, margin: '0 0 6px', color: 'var(--c-ink)' }}>{it.nama}</h3>
              {it.desc && <p style={{ fontSize: 13, color: 'var(--c-muted)', lineHeight: 1.55, margin: '0 0 10px' }}>{it.desc}</p>}
              {it.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)' }}>{formatRupiah(it.harga)}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Bingkai gambar lookbook: <img> dgn zoom kalau ada foto; placeholder bermartabat
// (inisial di atas gradient token) kalau belum. ratio = aspect-ratio CSS.
function LookFrame({ it, ratio }: { it: ShowcaseItem; ratio: string }) {
  return (
    <div className="ce-look-frame" style={{ aspectRatio: ratio }}>
      {it.gambar ? (
        <img className="ce-look-img" src={it.gambar} alt={it.nama} loading="lazy" />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 'clamp(56px, 10vw, 120px)', lineHeight: 1, color: 'var(--c-hero-ink)', opacity: .85 }}>
            {(it.nama.trim()[0] ?? 'A').toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}

function LookCaption({ idx, it }: { idx: number; it: ShowcaseItem }) {
  return (
    <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 14 }}>
      <span className="ce-look-idx" style={{ fontSize: 15 }}>{String(idx + 1).padStart(2, '0')}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: 19, margin: 0, color: 'var(--c-ink)' }}>{it.nama}</h3>
        {it.desc && <p style={{ fontSize: 13, color: 'var(--c-muted)', lineHeight: 1.55, margin: '4px 0 0' }}>{it.desc}</p>}
      </div>
      {it.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)', whiteSpace: 'nowrap' }}>{formatRupiah(it.harga)}</span>}
    </div>
  )
}

// Lookbook — showcase editorial fashion: 1 spread featured + grid portrait 3/4.
export function ShowcaseLookbook({ showcase }: { showcase: NonNullable<ComposableContent['showcase']> }) {
  const items = showcase.items
  const [featured, ...rest] = items
  return (
    <section style={{ padding: '96px 24px', maxWidth: 1120, margin: '0 auto' }}>
      <ShowHeading title={showcase.title} subtitle={showcase.subtitle} />
      <div className="ce-stagger">
        {/* Spread featured — landscape besar + kaption editorial di samping */}
        {featured && (
          <div className="ce-look-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 36, alignItems: 'center', marginBottom: 56 }}>
            <LookFrame it={featured} ratio="4 / 5" />
            <div>
              <span className="ce-look-idx" style={{ fontSize: 'clamp(40px, 6vw, 64px)', display: 'block', marginBottom: 12 }}>01</span>
              <h3 style={{ fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 12px', color: 'var(--c-ink)', lineHeight: 1.1 }}>{featured.nama}</h3>
              {featured.desc && <p style={{ fontSize: 16, color: 'var(--c-muted)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 460 }}>{featured.desc}</p>}
              {featured.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 22, color: 'var(--c-primary)' }}>{formatRupiah(featured.harga)}</span>}
            </div>
          </div>
        )}
        {/* Sisanya — grid kartu portrait */}
        {rest.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
            {rest.map((it, i) => (
              <div key={i} className="ce-look-card">
                <LookFrame it={it} ratio="3 / 4" />
                <LookCaption idx={i + 1} it={it} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── ABOUT / CTA / FOOTER ──────────────────────────────────────
export function About({ about }: { about: NonNullable<ComposableContent['about']> }) {
  return (
    <section style={{ padding: '64px 24px', maxWidth: 760, margin: '0 auto' }}>
      <h2 style={{ fontSize: 'clamp(26px, 4vw, 34px)', margin: '0 0 16px' }}>{about.title}</h2>
      <p style={{ fontSize: 16, color: 'var(--c-muted)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{about.body}</p>
    </section>
  )
}

export function CTA({ cta }: { cta: NonNullable<ComposableContent['cta']> }) {
  return (
    <section style={{ padding: '32px 24px 96px' }}>
      <div
        style={{
          maxWidth: 920, margin: '0 auto', padding: '64px 32px', textAlign: 'center',
          borderRadius: 'var(--r-lg)', color: 'var(--c-hero-ink)', boxShadow: 'var(--s-lg)',
          border: '1px solid var(--c-border)', overflow: 'hidden',
          backgroundImage: [
            'radial-gradient(ellipse 60% 80% at 50% 0%, color-mix(in srgb, var(--c-primary) 22%, transparent) 0%, transparent 60%)',
            'linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))',
          ].join(', '),
        }}
      >
        <h2 style={{ fontSize: 'clamp(26px, 4.5vw, 36px)', margin: '0 0 12px', color: 'var(--c-hero-ink)' }}>{cta.title}</h2>
        {cta.subtitle && <p style={{ opacity: .85, margin: '0 0 28px', fontSize: 16 }}>{cta.subtitle}</p>}
        <Btn text={cta.ctaText ?? 'Pesan Sekarang'} href={cta.ctaHref} />
      </div>
    </section>
  )
}

// Floating WhatsApp — komponen wajib konteks Indonesia (pesan via WA).
export function FloatingWA({ wa }: { wa?: string }) {
  const digits = (wa ?? '').replace(/[^\d]/g, '')
  if (!digits) return null
  return (
    <a className="ce-wa" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" aria-label="Pesan via WhatsApp">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    </a>
  )
}

// ── SECTION HEADING generik (eyebrow + judul) ─────────────────
function SectionHead({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 44 }}>
      {eyebrow && <p className="ce-eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</p>}
      <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', margin: 0, color: 'var(--c-ink)' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 16, color: 'var(--c-muted)', margin: '10px auto 0', maxWidth: 560, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  )
}

// ── STATS — strip angka kredibilitas (tabular-nums) ───────────
export function Stats({ stats }: { stats: StatItem[] }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: '56px 24px' }}>
      <div className="ce-stagger" style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: 24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div className="ce-stat-num" style={{ fontSize: 'clamp(34px, 5vw, 52px)' }}>{s.angka}</div>
            <div style={{ marginTop: 6, fontSize: 13, color: 'var(--c-muted)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── TESTIMONI — 3 varian sosial-proof ─────────────────────────
function QuoteCard({ t }: { t: Testimonial }) {
  return (
    <figure className="ce-quote" style={{ margin: 0, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span className="ce-quote-mark" style={{ fontSize: 52 }} aria-hidden>&ldquo;</span>
      <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: 'var(--c-ink)' }}>{t.quote}</blockquote>
      <figcaption style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 38, height: 38, borderRadius: 999, background: 'color-mix(in srgb, var(--c-primary) 16%, transparent)', color: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
          {(t.nama.trim()[0] ?? 'A').toUpperCase()}
        </span>
        <span>
          <span style={{ display: 'block', fontWeight: 700, fontSize: 14, color: 'var(--c-ink)' }}>{t.nama}</span>
          {t.peran && <span style={{ display: 'block', fontSize: 12, color: 'var(--c-muted)' }}>{t.peran}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

export function TestimoniCards({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section style={{ background: 'var(--c-surface)', padding: '88px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow="Kata Mereka" title="Dipercaya Pelanggan Kami" />
        <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {testimonials.map((t, i) => <QuoteCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  )
}

export function TestimoniSpotlight({ testimonials }: { testimonials: Testimonial[] }) {
  const t = testimonials[0]
  if (!t) return null
  return (
    <section style={{ background: 'var(--c-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        <span className="ce-quote-mark" style={{ fontSize: 'clamp(64px, 10vw, 96px)', display: 'block' }} aria-hidden>&ldquo;</span>
        <blockquote style={{ margin: '0 0 28px', fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 'clamp(22px, 3.4vw, 32px)', lineHeight: 1.35, color: 'var(--c-ink)', letterSpacing: 'var(--tracking)' }}>
          {t.quote}
        </blockquote>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--c-ink)' }}>{t.nama}</div>
        {t.peran && <div style={{ fontSize: 13, color: 'var(--c-muted)', marginTop: 2 }}>{t.peran}</div>}
      </div>
    </section>
  )
}

export function TestimoniMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  // Gandakan daftar agar loop -50% mulus.
  const loop = [...testimonials, ...testimonials]
  return (
    <section style={{ background: 'var(--c-surface)', padding: '80px 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <SectionHead eyebrow="Kata Mereka" title="Ribuan Pelanggan Puas" />
      </div>
      <div className="ce-marquee">
        <div className="ce-marquee-track">
          {loop.map((t, i) => (
            <figure key={i} className="ce-quote" aria-hidden={i >= testimonials.length} style={{ margin: 0, padding: 24, width: 340, flexShrink: 0 }}>
              <blockquote style={{ margin: '0 0 14px', fontSize: 15, lineHeight: 1.6, color: 'var(--c-ink)' }}>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption style={{ fontSize: 13, color: 'var(--c-muted)' }}>
                <strong style={{ color: 'var(--c-ink)' }}>{t.nama}</strong>{t.peran ? ` · ${t.peran}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ — accordion CSS-only (<details>), objection-handling ───
export function FAQ({ faq }: { faq: FaqItem[] }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: '88px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionHead eyebrow="Pertanyaan Umum" title="Yang Sering Ditanyakan" />
        <div>
          {faq.map((f, i) => (
            <details key={i} className="ce-faq" name="ce-faq">
              <summary>
                <span style={{ fontSize: 17 }}>{f.q}</span>
                <span className="ce-faq-ico" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </span>
              </summary>
              <div className="ce-faq-body" style={{ fontSize: 15 }}>{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── INFO / LOKASI — jam buka + peta embed + reservasi ─────────
export function InfoLokasiBlock({ info }: { info: InfoLokasi }) {
  const hasMap = !!info.mapsQuery
  const mapSrc = hasMap
    ? `https://maps.google.com/maps?q=${encodeURIComponent(info.mapsQuery!)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : null
  return (
    <section style={{ background: 'var(--c-surface)', padding: '88px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow="Kunjungi Kami" title="Jam Buka & Lokasi" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28, alignItems: 'stretch' }}>
          {/* Kartu jam + kontak */}
          <div className="ce-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {info.jam && info.jam.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--c-muted)' }}>Jam Operasional</h3>
                {info.jam.map((j, i) => (
                  <div key={i} className="ce-jam-row">
                    <span style={{ fontWeight: 600, color: 'var(--c-ink)', fontSize: 14 }}>{j.hari}</span>
                    <span className="ce-price" style={{ color: 'var(--c-muted)', fontSize: 14 }}>{j.jam}</span>
                  </div>
                ))}
              </div>
            )}
            {info.alamat && (
              <div>
                <h3 style={{ fontSize: 14, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--c-muted)' }}>Alamat</h3>
                <p style={{ margin: 0, color: 'var(--c-ink)', fontSize: 15, lineHeight: 1.6 }}>{info.alamat}</p>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 'auto' }}>
              {info.reservasiText && <Btn text={info.reservasiText} href={info.reservasiHref ?? '#'} />}
              {info.telp && (
                <a href={`tel:${info.telp.replace(/[^\d+]/g, '')}`} style={{ display: 'inline-block', padding: '14px 28px', borderRadius: 'var(--r-pill)', border: '1px solid var(--c-border)', color: 'var(--c-ink)', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
                  Telepon
                </a>
              )}
            </div>
          </div>
          {/* Peta embed (tanpa API key) atau placeholder bermartabat */}
          <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--c-border)', boxShadow: 'var(--s-sm)', minHeight: 280, background: 'linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))' }}>
            {mapSrc && <iframe className="ce-map" src={mapSrc} title="Peta lokasi" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer({ content, motif, motifColor }: { content: ComposableContent; motif?: MotifVariant; motifColor?: string }) {
  const strip = motifTile(motif, motifColor ?? '#C8922A', 0.5)
  return (
    <>
    {strip && <div aria-hidden style={{ height: 28, opacity: 0.25, backgroundImage: strip, backgroundSize: motifSize(motif), borderTop: '1px solid var(--c-border)' }} />}
    <footer style={{ borderTop: strip ? 'none' : '1px solid var(--c-border)', padding: '32px 24px', maxWidth: 1120, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number }}>{content.nama}</span>
      <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--c-muted)' }}>
        {content.contact?.wa && <a href={`https://wa.me/${content.contact.wa}`} style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 700 }}>WhatsApp</a>}
        {content.contact?.email && <a href={`mailto:${content.contact.email}`} style={{ color: 'var(--c-muted)', textDecoration: 'none' }}>Email</a>}
        {content.contact?.alamat && <span>{content.contact.alamat}</span>}
      </div>
    </footer>
    </>
  )
}
