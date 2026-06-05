// ============================================================
// THEME SYSTEM — Lapis 2 perpustakaan balok (S0-2 + S1-2).
// Balok section parametrik via token (CSS vars dari packs.ts). Tiap section
// punya beberapa VARIAN; manifest memilih varian per slot.
// S1-2: dukungan FOTO hero (gradient → foto + scrim) + balok Features (keunggulan).
//
// Konvensi: semua warna/font/radius/shadow lewat var(--c-*/--f-*/--r-*/--s-*),
// JANGAN hex hardcoded — kecuali scrim hitam untuk keterbacaan teks di atas foto.
// ============================================================
import type { ComposableContent, ShowcaseItem } from '@/lib/theme-system/manifest'

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
`

// Scrim untuk teks di atas foto (legibilitas konsisten apa pun temanya).
const HERO_SCRIM = 'linear-gradient(180deg, rgba(0,0,0,.30) 0%, rgba(0,0,0,.55) 100%)'

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
  return { background: `linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))` }
}
const heroInk = (image?: string) => (image ? '#FFFFFF' : 'var(--c-hero-ink)')

export function HeroCentered({ hero }: { hero: Hero }) {
  const ink = heroInk(hero.image)
  return (
    <section style={{ ...heroBg(hero.image), color: ink, padding: '96px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        {hero.eyebrow && <p className="ce-eyebrow" style={{ marginBottom: 16, color: hero.image ? '#FFFFFF' : 'var(--c-primary)' }}>{hero.eyebrow}</p>}
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.05, margin: 0, color: ink }}>{hero.title}</h1>
        {hero.subtitle && <p style={{ marginTop: 24, fontSize: 18, opacity: .9, lineHeight: 1.6 }}>{hero.subtitle}</p>}
        {hero.ctaText && <div style={{ marginTop: 32 }}><Btn text={hero.ctaText} href={hero.ctaHref} /></div>}
      </div>
    </section>
  )
}

export function HeroSplit({ hero, nama }: { hero: Hero; nama: string }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: '112px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
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

export function HeroFullbleed({ hero }: { hero: Hero }) {
  const ink = heroInk(hero.image)
  return (
    <section style={{ ...heroBg(hero.image), color: ink, minHeight: '90vh', display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden', padding: '0 24px 80px' }}>
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
      <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', margin: 0, color: 'var(--c-ink)' }}>Yang Membuat Kami Berbeda</h2>
    </div>
  )
}

export function FeaturesGrid({ features }: { features: Feature[] }) {
  return (
    <section style={{ padding: '80px 24px', maxWidth: 1120, margin: '0 auto' }}>
      <FeatHeading />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        {features.map((f, i) => (
          <div key={i} className="ce-card" style={{ padding: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--c-primary)', opacity: .14, marginBottom: 18 }} />
            <h3 style={{ fontSize: 19, margin: '0 0 8px', color: 'var(--c-ink)' }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FeaturesRows({ features }: { features: Feature[] }) {
  return (
    <section style={{ padding: '88px 24px', maxWidth: 1000, margin: '0 auto' }}>
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
      <div>
        {showcase.items.map((it: ShowcaseItem, i) => (
          <div key={i} className="ce-menu-row" style={{ padding: '22px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
              <h3 style={{ fontSize: 19, margin: 0, color: 'var(--c-ink)' }}>{it.nama}</h3>
              {it.harga != null && <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)', whiteSpace: 'nowrap' }}>{formatRupiah(it.harga)}</span>}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {showcase.items.map((it: ShowcaseItem, i) => (
          <div key={i} className="ce-card">
            <div style={{ aspectRatio: '4 / 3', background: it.gambar ? `center/cover no-repeat url(${it.gambar})` : `linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))` }} />
            <div style={{ padding: 20 }}>
              <h3 style={{ fontSize: 17, margin: '0 0 6px', color: 'var(--c-ink)' }}>{it.nama}</h3>
              {it.desc && <p style={{ fontSize: 13, color: 'var(--c-muted)', lineHeight: 1.55, margin: '0 0 10px' }}>{it.desc}</p>}
              {it.harga != null && <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)' }}>{formatRupiah(it.harga)}</span>}
            </div>
          </div>
        ))}
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
    <section style={{ padding: '24px 24px 88px' }}>
      <div className="ce-card" style={{ maxWidth: 920, margin: '0 auto', padding: '56px 32px', textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', margin: '0 0 12px' }}>{cta.title}</h2>
        {cta.subtitle && <p style={{ color: 'var(--c-muted)', margin: '0 0 28px', fontSize: 16 }}>{cta.subtitle}</p>}
        <Btn text={cta.ctaText ?? 'Pesan Sekarang'} href={cta.ctaHref} />
      </div>
    </section>
  )
}

export function Footer({ content }: { content: ComposableContent }) {
  return (
    <footer style={{ borderTop: '1px solid var(--c-border)', padding: '32px 24px', maxWidth: 1120, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number }}>{content.nama}</span>
      <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--c-muted)' }}>
        {content.contact?.wa && <a href={`https://wa.me/${content.contact.wa}`} style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 700 }}>WhatsApp</a>}
        {content.contact?.email && <a href={`mailto:${content.contact.email}`} style={{ color: 'var(--c-muted)', textDecoration: 'none' }}>Email</a>}
        {content.contact?.alamat && <span>{content.contact.alamat}</span>}
      </div>
    </footer>
  )
}
