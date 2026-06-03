// ============================================================
// TokenDrivenRenderer — POC renderer yang SEPENUHNYA token-driven.
// Tidak ada warna/font/radius hardcode: semua dari CSS vars token pack.
// Tukar pack → seluruh tampilan berubah, komponen tetap sama.
//
// POC pakai bentuk konten ringkas (SiteContent). Integrasi nyata:
// tinggal tambah adapter PageSection[] → SiteContent.
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
`

function Btn({ text, href }: { text?: string; href?: string }) {
  if (!text) return null
  return (
    <a href={href ?? '#'} className="td-btn" style={{ display: 'inline-block', padding: '14px 32px', fontWeight: 700, fontSize: 15 }}>
      {text}
    </a>
  )
}

export default function TokenDrivenRenderer({ content, pack }: { content: SiteContent; pack: TokenPack }) {
  const vars = packToCssVars(pack) as CSSProperties

  return (
    <div className="td-root" style={vars}>
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* Nav */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', maxWidth: 1120, margin: '0 auto' }}>
        <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 20, letterSpacing: 'var(--tracking)' }}>{content.nama}</span>
        {content.hero.ctaText && <Btn text={content.hero.ctaText} href={content.hero.ctaHref} />}
      </header>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))`, color: 'var(--c-hero-ink)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          {content.hero.eyebrow && <p className="td-eyebrow" style={{ marginBottom: 16 }}>{content.hero.eyebrow}</p>}
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.05, margin: 0, color: 'var(--c-hero-ink)' }}>{content.hero.title}</h1>
          {content.hero.subtitle && <p style={{ marginTop: 24, fontSize: 18, opacity: .85, lineHeight: 1.6 }}>{content.hero.subtitle}</p>}
          {content.hero.ctaText && <div style={{ marginTop: 32 }}><Btn text={content.hero.ctaText} href={content.hero.ctaHref} /></div>}
        </div>
      </section>

      {/* Features */}
      {content.features && content.features.length > 0 && (
        <section style={{ padding: '80px 24px', maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {content.features.map((f, i) => (
              <div key={i} className="td-card" style={{ padding: 32 }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'var(--c-primary)', opacity: .12, marginBottom: 20 }} />
                <h3 style={{ fontSize: 19, margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      {content.about && (
        <section style={{ padding: '64px 24px', maxWidth: 760, margin: '0 auto' }}>
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
