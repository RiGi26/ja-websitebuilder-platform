// ============================================================
// TokenDrivenRenderer — renderer token-driven untuk tema non-bespoke.
// Warna/font/radius/shadow dari CSS vars token pack (re-skin), DAN sejak F4
// SUSUNAN layout ikut berubah lewat pack.layout (arketipe):
//   hero:     centered (default) | split (2-kolom editorial) | fullbleed
//   features: grid (kartu) | rows (baris bernomor) | list (garis tipis)
//   pad/align: ritme whitespace & perataan heading.
// Arketipe 'centered + grid + normal + center' = perilaku lama (no-regression
// untuk clean-modern & warm-cafe).
// ============================================================
import type { CSSProperties } from 'react'
import { type TokenPack, packToCssVars } from '@/lib/design-tokens/packs'

export interface SiteContent {
  nama: string
  hero: { eyebrow?: string; title: string; subtitle?: string; ctaText?: string; ctaHref?: string }
  features?: { title: string; desc: string }[]
  about?: { title: string; body: string }
  cta?: { title: string; subtitle?: string; ctaText?: string; ctaHref?: string }
  contact?: { wa?: string; email?: string; alamat?: string }
}

const SCOPED_CSS = `
.td-root { background: var(--c-page); color: var(--c-ink); font-family: var(--f-body); font-weight: var(--fw-body); -webkit-font-smoothing: antialiased; }
.td-root h1, .td-root h2, .td-root h3 { font-family: var(--f-display); font-weight: var(--fw-display); letter-spacing: var(--tracking); text-wrap: balance; }
.td-btn { background: var(--c-primary); color: var(--c-on-primary); border-radius: var(--r-pill); box-shadow: var(--s-md); transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s ease; text-decoration: none; }
.td-btn:hover { transform: translateY(-2px); }
.td-btn:active { transform: scale(.97); }
.td-card { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--s-sm); transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease; }
.td-card:hover { transform: translateY(-4px); box-shadow: var(--s-lg); }
.td-eyebrow { color: var(--c-primary); text-transform: uppercase; letter-spacing: .18em; font-weight: 700; font-size: 12px; }
.td-row { border-top: 1px solid var(--c-border); transition: background .2s ease, padding-left .2s ease; }
.td-row:hover { background: color-mix(in srgb, var(--c-primary) 5%, transparent); padding-left: 8px; }
.td-li { border-top: 1px solid var(--c-border); transition: padding-left .2s ease; }
.td-li:hover { padding-left: 6px; }
`

function Btn({ text, href }: { text?: string; href?: string }) {
  if (!text) return null
  return (
    <a href={href ?? '#'} className="td-btn" style={{ display: 'inline-block', padding: '14px 32px', fontWeight: 700, fontSize: 15 }}>
      {text}
    </a>
  )
}

// ── HERO arketipe ─────────────────────────────────────────────
function HeroCentered({ hero }: { hero: SiteContent['hero'] }) {
  return (
    <section style={{ background: `linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))`, color: 'var(--c-hero-ink)', padding: '96px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        {hero.eyebrow && <p className="td-eyebrow" style={{ marginBottom: 16 }}>{hero.eyebrow}</p>}
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.05, margin: 0, color: 'var(--c-hero-ink)' }}>{hero.title}</h1>
        {hero.subtitle && <p style={{ marginTop: 24, fontSize: 18, opacity: .85, lineHeight: 1.6 }}>{hero.subtitle}</p>}
        {hero.ctaText && <div style={{ marginTop: 32 }}><Btn text={hero.ctaText} href={hero.ctaHref} /></div>}
      </div>
    </section>
  )
}

// Split: teks kiri di atas page-bg + panel dekoratif kanan (gradient hero + inisial).
function HeroSplit({ hero, nama }: { hero: SiteContent['hero']; nama: string }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: '112px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
        <div>
          {hero.eyebrow && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 36, height: 1, background: 'var(--c-primary)' }} />
              <span className="td-eyebrow">{hero.eyebrow}</span>
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(38px, 5vw, 64px)', lineHeight: 1.08, margin: 0, color: 'var(--c-ink)' }}>{hero.title}</h1>
          {hero.subtitle && <p style={{ marginTop: 24, fontSize: 18, color: 'var(--c-muted)', lineHeight: 1.7, maxWidth: 520 }}>{hero.subtitle}</p>}
          {hero.ctaText && <div style={{ marginTop: 36 }}><Btn text={hero.ctaText} href={hero.ctaHref} /></div>}
        </div>
        <div style={{ position: 'relative', minHeight: 420, borderRadius: 'var(--r-lg)', overflow: 'hidden', background: `linear-gradient(150deg, var(--c-hero-from), var(--c-hero-to))`, border: '1px solid var(--c-border)', boxShadow: 'var(--s-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 'clamp(120px, 18vw, 220px)', lineHeight: 1, color: 'var(--c-hero-ink)', opacity: .9 }}>
            {(nama.trim()[0] ?? 'A').toUpperCase()}
          </span>
        </div>
      </div>
    </section>
  )
}

// Fullbleed: hero setinggi viewport, judul raksasa + angka samar, rata kiri.
function HeroFullbleed({ hero }: { hero: SiteContent['hero'] }) {
  return (
    <section style={{ background: `linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))`, color: 'var(--c-hero-ink)', minHeight: '90vh', display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden', padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div aria-hidden style={{ fontFamily: 'var(--f-display)', fontWeight: 900, fontSize: 'clamp(140px, 28vw, 360px)', lineHeight: .8, color: 'var(--c-primary)', opacity: .08, marginBottom: '-3rem', userSelect: 'none', pointerEvents: 'none' }}>01</div>
        {hero.eyebrow && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ width: 36, height: 1, background: 'var(--c-primary)' }} />
            <span className="td-eyebrow">{hero.eyebrow}</span>
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(48px, 9vw, 104px)', lineHeight: .98, margin: 0, color: 'var(--c-hero-ink)', textTransform: 'uppercase' }}>{hero.title}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 28, marginTop: 32 }}>
          {hero.subtitle && <p style={{ fontSize: 18, opacity: .85, lineHeight: 1.6, maxWidth: 480, margin: 0 }}>{hero.subtitle}</p>}
          {hero.ctaText && <Btn text={hero.ctaText} href={hero.ctaHref} />}
        </div>
      </div>
    </section>
  )
}

// ── FEATURES arketipe ─────────────────────────────────────────
function FeaturesGrid({ features, pad }: { features: NonNullable<SiteContent['features']>; pad: string }) {
  return (
    <section style={{ padding: `${pad} 24px`, maxWidth: 1120, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        {features.map((f, i) => (
          <div key={i} className="td-card" style={{ padding: 32 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'var(--c-primary)', opacity: .12, marginBottom: 20 }} />
            <h3 style={{ fontSize: 19, margin: '0 0 8px' }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Rows: baris editorial bernomor, rata kiri, airy.
function FeaturesRows({ features, pad }: { features: NonNullable<SiteContent['features']>; pad: string }) {
  return (
    <section style={{ padding: `${pad} 24px`, maxWidth: 1000, margin: '0 auto' }}>
      {features.map((f, i) => (
        <div key={i} className="td-row" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'baseline', padding: '32px 0' }}>
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 40, lineHeight: 1, color: 'var(--c-primary)', opacity: .35 }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 style={{ fontSize: 24, margin: '0 0 8px', color: 'var(--c-ink)' }}>{f.title}</h3>
            <p style={{ fontSize: 15, color: 'var(--c-muted)', lineHeight: 1.7, margin: 0, maxWidth: 620 }}>{f.desc}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

// List: daftar minimal garis tipis, satu kolom, sangat ringan.
function FeaturesList({ features, pad }: { features: NonNullable<SiteContent['features']>; pad: string }) {
  return (
    <section style={{ padding: `${pad} 24px`, maxWidth: 760, margin: '0 auto' }}>
      {features.map((f, i) => (
        <div key={i} className="td-li" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'baseline', padding: '28px 0' }}>
          <h3 style={{ fontSize: 18, fontWeight: 'var(--fw-display)' as unknown as number, margin: 0, color: 'var(--c-ink)', flex: '0 0 auto', minWidth: 180 }}>{f.title}</h3>
          <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: 0, flex: '1 1 320px', maxWidth: 460 }}>{f.desc}</p>
        </div>
      ))}
    </section>
  )
}

export default function TokenDrivenRenderer({ content, pack }: { content: SiteContent; pack: TokenPack }) {
  const vars = packToCssVars(pack) as CSSProperties
  const L = pack.layout
  const padFeat = L.pad === 'airy' ? '112px' : '80px'
  const padAbout = L.pad === 'airy' ? '88px' : '64px'
  // Teks about selalu rata kiri (keterbacaan); lebar container ikut arketipe.
  const aboutMax = L.align === 'left' ? 920 : 760

  return (
    <div className="td-root" style={vars}>
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* Nav */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', maxWidth: 1120, margin: '0 auto' }}>
        <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 20, letterSpacing: 'var(--tracking)' }}>{content.nama}</span>
        {content.hero.ctaText && <Btn text={content.hero.ctaText} href={content.hero.ctaHref} />}
      </header>

      {/* Hero — arketipe */}
      {L.hero === 'split' ? (
        <HeroSplit hero={content.hero} nama={content.nama} />
      ) : L.hero === 'fullbleed' ? (
        <HeroFullbleed hero={content.hero} />
      ) : (
        <HeroCentered hero={content.hero} />
      )}

      {/* Features — arketipe */}
      {content.features && content.features.length > 0 && (
        L.features === 'rows' ? (
          <FeaturesRows features={content.features} pad={padFeat} />
        ) : L.features === 'list' ? (
          <FeaturesList features={content.features} pad={padFeat} />
        ) : (
          <FeaturesGrid features={content.features} pad={padFeat} />
        )
      )}

      {/* About */}
      {content.about && (
        <section style={{ padding: `${padAbout} 24px`, maxWidth: aboutMax, margin: '0 auto', textAlign: 'left' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 34px)', margin: '0 0 16px' }}>{content.about.title}</h2>
          <p style={{ fontSize: 16, color: 'var(--c-muted)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{content.about.body}</p>
        </section>
      )}

      {/* CTA */}
      {content.cta && (
        <section style={{ padding: '24px 24px 88px' }}>
          <div className="td-card" style={{ maxWidth: 920, margin: '0 auto', padding: '56px 32px', textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', margin: '0 0 12px' }}>{content.cta.title}</h2>
            {content.cta.subtitle && <p style={{ color: 'var(--c-muted)', margin: '0 0 28px', fontSize: 16 }}>{content.cta.subtitle}</p>}
            <Btn text={content.cta.ctaText ?? 'Mulai Sekarang'} href={content.cta.ctaHref} />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--c-border)', padding: '32px 24px', maxWidth: 1120, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number }}>{content.nama}</span>
        <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--c-muted)' }}>
          {content.contact?.wa && <a href={`https://wa.me/${content.contact.wa}`} style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 700 }}>WhatsApp</a>}
          {content.contact?.email && <a href={`mailto:${content.contact.email}`} style={{ color: 'var(--c-muted)', textDecoration: 'none' }}>Email</a>}
          {content.contact?.alamat && <span>{content.contact.alamat}</span>}
        </div>
      </footer>
    </div>
  )
}
