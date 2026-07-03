'use client'
// ============================================================
// GENERATED — jangan edit manual. Sumber: theme-sources/corporate-agency/index.html
// Regenerasi: npx tsc -p scripts/html-theme/tsconfig.json && node .tmp-html-theme/compile.js corporate-agency
// POSTER — corporate/agency Swiss-typographic. Anton (display condensed poster, uppercase) + Albert Sans | paper #F4F3EF · ink #101012 · ultramarine #2438E8 | sudut TAJAM 0px | motif: hairline rule + tab indeks | signature: Garis Proses (timeline draw scaleX saat reveal)
// Interaksi via LUX_JS bersama (hook .lx-*); styling namespace .ag-*.
// ============================================================
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import { copyGetter } from '@/lib/theme-system/theme-copy'
import { CORPORATE_AGENCY_SLOTS } from './slots/corporate-agency.slots'
import { formatMoney, moneyFromConfig } from '@/lib/format-money'

export interface AgPal {
  bg: string
  bg2: string
  surface: string
  ink: string
  inkDim: string
  muted: string
  accent: string
  accentDeep: string
  onAccent: string
  line: string
  line2: string
}

export const PALETTES: Record<string, AgPal> = {
  bawaan: {
    bg: '#F4F3EF',
    bg2: '#EAE8E1',
    surface: '#FFFFFF',
    ink: '#101012',
    inkDim: '#3A3A3E',
    muted: '#5D5D57',
    accent: '#2438E8',
    accentDeep: '#1B2AB8',
    onAccent: '#FFFFFF',
    line: 'rgba(16,16,18,.16)',
    line2: 'rgba(16,16,18,.07)',
  },
  arang: {
    bg: '#101014',
    bg2: '#17171C',
    surface: '#1B1B21',
    ink: '#F4F3EF',
    inkDim: '#C9C8C1',
    muted: '#9C9B94',
    accent: '#6D7DFF',
    accentDeep: '#93A2FF',
    onAccent: '#101014',
    line: 'rgba(244,243,239,.18)',
    line2: 'rgba(244,243,239,.08)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Anton&family=Albert+Sans:wght@400;500;600;700;800&display=swap'
const DISPLAY = '\'Anton\',\'Arial Narrow\',Impact,sans-serif'
const BODY = '\'Albert Sans\',\'Segoe UI\',system-ui,sans-serif'
type ThemeFont = { importUrl: string; display: string; body: string }
const DEFAULT_FONT: ThemeFont = { importUrl: FONT_IMPORT, display: DISPLAY, body: BODY }

function themeCss(f: ThemeFont): string {
  return `
@import url('${f.importUrl}');
html,body{overflow-x:hidden;max-width:100%}
.ag-root{font-family:var(--ag-body);color:var(--ag-ink);background:var(--ag-bg);line-height:1.65;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.ag-root *,.ag-root *::before,.ag-root *::after{box-sizing:border-box;margin:0;padding:0}
.ag-root img{max-width:100%;height:auto;display:block}
.ag-root ::selection{background:var(--ag-accent);color:var(--ag-onAccent)}

/* ── NAV ── */
.ag-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1rem 5vw;border-bottom:1px solid transparent;transition:background .4s,border-color .4s,padding .4s}
.ag-root.lx-scrolled .ag-nav{background:var(--ag-bg);border-color:var(--ag-line);padding-top:.65rem;padding-bottom:.65rem}
.ag-nav-logo{font-family:var(--ag-display);font-size:1.45rem;letter-spacing:.04em;text-transform:uppercase;color:var(--ag-ink);text-decoration:none}
.ag-nav-cta{display:inline-flex;align-items:center;min-height:44px;font-size:.8rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ag-onAccent);background:var(--ag-accentDeep);padding:.7rem 1.5rem;text-decoration:none;transition:background .25s,transform .25s}
.ag-nav-cta:hover{background:var(--ag-ink);transform:translateY(-1px)}
.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:120px;opacity:0;pointer-events:none}

/* ── TAB INDEKS (motif) ── */
.ag-tab{display:inline-block;border:1px solid var(--ag-ink);background:var(--ag-bg);padding:.42rem .85rem;font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ag-ink)}
.ag-sechead{border-top:2px solid var(--ag-ink);margin-bottom:2rem}
.ag-sechead .ag-tab{transform:translateY(-50%)}
.ag-heading{font-family:var(--ag-display);font-size:clamp(2rem,4.4vw,3.4rem);line-height:1.02;letter-spacing:.01em;text-transform:uppercase;color:var(--ag-ink);text-wrap:balance}
.ag-subtext{color:var(--ag-inkDim);font-size:1rem;margin-top:.9rem;max-width:56ch;line-height:1.75}

/* ── SECTION COMMONS ── */
.ag-section{padding:clamp(2.2rem,5vw,3.6rem) 5vw}

/* ── HERO ── */
.ag-hero{position:relative;display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(1.6rem,4vw,3.6rem);align-items:end;padding:7.5rem 5vw 2.6rem;border-bottom:2px solid var(--ag-ink)}
.ag-hero-title{font-family:var(--ag-display);font-size:clamp(2.9rem,7.2vw,6rem);line-height:.98;letter-spacing:.01em;text-transform:uppercase;color:var(--ag-ink);margin:1.1rem 0 1rem;text-wrap:balance}
.ag-hero-sub{font-size:1.05rem;color:var(--ag-inkDim);max-width:46ch;line-height:1.7;margin-bottom:1.6rem}
.ag-hero-btns{display:flex;flex-wrap:wrap;gap:.7rem;align-items:center}
.ag-btn{display:inline-flex;align-items:center;min-height:48px;font-size:.84rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:var(--ag-accentDeep);color:var(--ag-onAccent);padding:.85rem 1.9rem;text-decoration:none;transition:background .25s cubic-bezier(.2,0,0,1),transform .25s cubic-bezier(.2,0,0,1),box-shadow .25s cubic-bezier(.2,0,0,1)}
.ag-btn:hover{background:var(--ag-ink);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--ag-accent)}
.ag-btn-ghost{display:inline-flex;align-items:center;min-height:48px;font-size:.84rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ag-ink);border:1px solid var(--ag-ink);padding:.85rem 1.6rem;text-decoration:none;transition:background .25s,color .25s,transform .25s}
.ag-btn-ghost:hover{background:var(--ag-ink);color:var(--ag-bg);transform:translateY(-2px)}
.ag-hero-media{position:relative}
.ag-hero-frame{aspect-ratio:4/3;overflow:hidden;background:repeating-linear-gradient(45deg,var(--ag-bg2),var(--ag-bg2) 10px,var(--ag-bg) 10px,var(--ag-bg) 11px);border:1px solid var(--ag-line)}
.ag-hero-frame img{width:100%;height:100%;object-fit:cover;filter:grayscale(.15) contrast(1.04)}
.ag-hero-cap{display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--ag-ink);margin-top:.6rem;padding-top:.5rem;font-size:.74rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ag-muted)}
@media(max-width:880px){
  .ag-hero{grid-template-columns:1fr;padding-top:6.2rem;align-items:start}
  .ag-hero-title{font-size:clamp(2.5rem,11vw,3.8rem)}
}
@media(max-width:560px){.ag-nav{padding-left:6vw;padding-right:6vw}.ag-section{padding-left:6vw;padding-right:6vw}.ag-hero{padding-left:6vw;padding-right:6vw}}

/* ── STATS — strip berpalang ── */
.ag-stats{border-bottom:1px solid var(--ag-line);background:var(--ag-bg)}
.ag-stats-grid{display:grid;grid-template-columns:repeat(4,1fr)}
.ag-stat{padding:1.4rem 1.2rem;border-left:1px solid var(--ag-line)}
.ag-stat:first-child{border-left:none}
.ag-stat-num{font-family:var(--ag-display);font-size:clamp(2.1rem,4.6vw,3.4rem);line-height:1;color:var(--ag-accentDeep);font-variant-numeric:tabular-nums}
.ag-stat-label{font-size:.76rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ag-muted);margin-top:.45rem}
@media(max-width:720px){.ag-stats-grid{grid-template-columns:repeat(2,1fr)}.ag-stat:nth-child(3){border-left:none}.ag-stat:nth-child(n+3){border-top:1px solid var(--ag-line)}}

/* ── LAYANAN — baris editorial ── */
.ag-rows{border-top:1px solid var(--ag-ink)}
.ag-row{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1.4fr) auto;gap:1.2rem;align-items:baseline;padding:1.5rem .2rem;border-bottom:1px solid var(--ag-line);transition:padding .3s cubic-bezier(.2,0,0,1),box-shadow .3s cubic-bezier(.2,0,0,1)}
.ag-row:hover{padding-left:.8rem;box-shadow:inset 4px 0 0 var(--ag-accentDeep)}
.ag-row-name{font-family:var(--ag-display);font-size:clamp(1.3rem,2.4vw,1.9rem);letter-spacing:.02em;text-transform:uppercase;color:var(--ag-ink);transition:color .25s}
.ag-row:hover .ag-row-name{color:var(--ag-accentDeep)}
.ag-row-desc{font-size:.94rem;color:var(--ag-muted);line-height:1.65;max-width:52ch}
.ag-row-price{font-size:.8rem;font-weight:700;letter-spacing:.08em;color:var(--ag-inkDim);border:1px solid var(--ag-line);padding:.35rem .7rem;white-space:nowrap;justify-self:end;font-variant-numeric:tabular-nums}
@media(max-width:820px){.ag-row{grid-template-columns:1fr;gap:.5rem}.ag-row-price{justify-self:start}}

/* ── GARIS PROSES (signature) ── */
.ag-proses{background:var(--ag-bg2);border-bottom:1px solid var(--ag-line)}
.ag-line-wrap{position:relative;height:2px;background:var(--ag-line2);margin:2.6rem 0 0}
.ag-line{position:absolute;inset:0;background:var(--ag-accentDeep);transform-origin:left}
.lx-js .ag-line{transform:scaleX(0);transition:transform 1.4s cubic-bezier(.22,1,.36,1) .2s}
.lx-js .ag-line.lx-in{transform:scaleX(1)}
.ag-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem}
.ag-step{position:relative;padding:1.6rem 1rem 0 0}
.ag-step::before{content:'';position:absolute;top:-5px;left:0;width:12px;height:12px;background:var(--ag-accentDeep);outline:3px solid var(--ag-bg2)}
/* Node kotak "pop" menyusul garis ter-draw (gate .lx-js, no-JS = tampil) */
.lx-js .ag-step::before{transform:scale(0);transition:transform .5s cubic-bezier(.34,1.56,.64,1) .45s}
.lx-js .ag-step.lx-in::before{transform:scale(1)}
.ag-step-title{font-family:var(--ag-display);font-size:1.25rem;letter-spacing:.03em;text-transform:uppercase;color:var(--ag-ink);margin-bottom:.4rem}
.ag-step-desc{font-size:.9rem;color:var(--ag-muted);line-height:1.65}
@media(max-width:820px){.ag-steps{grid-template-columns:repeat(2,1fr)}}
@media(max-width:540px){.ag-steps{grid-template-columns:1fr}}

/* ── STATEMENT — band aksen ── */
.ag-stmt{background:var(--ag-accentDeep);color:var(--ag-onAccent);padding:clamp(2.6rem,6vw,4.2rem) 5vw}
.ag-stmt .ag-tab{border-color:var(--ag-onAccent);color:var(--ag-onAccent);background:transparent;margin-bottom:1.4rem}
.ag-stmt-quote{font-family:var(--ag-display);font-size:clamp(1.7rem,3.8vw,3rem);line-height:1.12;letter-spacing:.01em;text-transform:uppercase;max-width:26ch;text-wrap:balance}
.ag-stmt-cite{display:block;font-size:.84rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-top:1.3rem;opacity:.85;font-style:normal}

/* ── ABOUT ── */
.ag-about-inner{display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(1.8rem,4.5vw,4rem);align-items:center}
.ag-about-frame{aspect-ratio:4/5;overflow:hidden;border:1px solid var(--ag-line);background:var(--ag-bg2)}
.ag-about-frame img{width:100%;height:100%;object-fit:cover;filter:grayscale(.15) contrast(1.04)}
/* Mode sparse: tanpa foto tentang → kolom tunggal, frame kosong disembunyikan */
.ag-about-media:has(.ag-about-frame:empty){display:none}
.ag-about-inner:not(:has(.ag-about-frame img)){grid-template-columns:1fr;max-width:62ch}
.ag-about-body{font-size:1rem;color:var(--ag-inkDim);line-height:1.75;margin-top:1rem;white-space:pre-line}
.ag-about-cta{display:inline-flex;align-items:center;min-height:44px;margin-top:1.4rem;font-size:.82rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ag-ink);border-bottom:2px solid var(--ag-accentDeep);padding:.4rem 0;text-decoration:none;transition:color .25s}
.ag-about-cta:hover{color:var(--ag-accentDeep)}
@media(max-width:820px){.ag-about-inner{grid-template-columns:1fr}.ag-about-media{max-width:340px}}

/* ── TESTIMONIALS — carousel ── */
.ag-testimonials{background:var(--ag-bg2)}
.ag-tcar{position:relative}
.ag-tcar-track{display:flex;gap:1rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.2rem .1rem 1.2rem;-ms-overflow-style:none;scrollbar-width:none}
.ag-tcar-track::-webkit-scrollbar{display:none}
.ag-test{scroll-snap-align:start;flex:0 0 auto;min-width:300px;max-width:380px;background:var(--ag-surface);border:1px solid var(--ag-line);padding:1.5rem}
.ag-test-quote{font-size:.98rem;color:var(--ag-inkDim);line-height:1.7;margin-bottom:1rem}
.ag-test-name{display:block;font-size:.86rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--ag-ink)}
.ag-test-role{display:block;font-size:.76rem;font-weight:600;letter-spacing:.08em;color:var(--ag-muted);margin-top:.2rem}
.ag-tcar-ctrl{display:flex;justify-content:flex-end;gap:.6rem;margin-top:.4rem}
.ag-tcar-btn{width:46px;height:46px;border:1px solid var(--ag-ink);background:var(--ag-bg);color:var(--ag-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s,opacity .25s}
.ag-tcar-btn:hover:not(:disabled){background:var(--ag-ink);color:var(--ag-bg)}
.ag-tcar-btn:disabled{opacity:.3;cursor:default}

/* ── FAQ ── */
.ag-faq-wrap{max-width:820px}
.ag-faq-item{border-bottom:1px solid var(--ag-line)}
.ag-faq-item:first-child{border-top:1px solid var(--ag-ink)}
.ag-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;min-height:44px;padding:1.05rem .2rem;cursor:pointer;font-size:1.02rem;font-weight:700;color:var(--ag-ink);list-style:none}
.ag-faq-q::-webkit-details-marker{display:none}
.ag-faq-q::after{content:'+';font-family:var(--ag-display);font-size:1.3rem;color:var(--ag-accentDeep);flex-shrink:0;transition:transform .3s}
.ag-faq-item[open] .ag-faq-q::after{transform:rotate(45deg)}
.ag-faq-a{font-size:.94rem;color:var(--ag-inkDim);line-height:1.7;padding:0 .2rem 1.2rem;max-width:64ch}
.ag-faq-item[open] .ag-faq-a{animation:agFadeUp .35s cubic-bezier(.16,1,.3,1)}
@keyframes agFadeUp{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}

/* ── CTA — band ink ── */
.ag-cta{background:var(--ag-ink);color:var(--ag-bg);padding:clamp(2.8rem,6.5vw,4.6rem) 5vw}
.ag-cta-title{font-family:var(--ag-display);font-size:clamp(2.3rem,5.4vw,4.2rem);line-height:1;letter-spacing:.01em;text-transform:uppercase;max-width:22ch;text-wrap:balance}
.ag-cta-title::before{content:'';display:block;width:64px;height:4px;background:var(--ag-accent);margin-bottom:1.2rem}
.ag-cta-sub{font-size:1rem;opacity:.8;max-width:48ch;margin:1rem 0 1.8rem;line-height:1.7}
.ag-cta-btns{display:flex;flex-wrap:wrap;gap:.7rem}
.ag-cta .ag-btn-ghost{color:var(--ag-bg);border-color:var(--ag-bg)}
.ag-cta .ag-btn-ghost:hover{background:var(--ag-bg);color:var(--ag-ink)}

/* ── BAND ADD-ON ── */
.ag-band{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.2rem;padding:2rem 5vw;border-bottom:1px solid var(--ag-line);background:var(--ag-surface)}
.ag-band-ew{font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ag-accentDeep);margin-bottom:.4rem}
.ag-band-title{font-family:var(--ag-display);font-size:clamp(1.4rem,2.4vw,2rem);letter-spacing:.02em;text-transform:uppercase;color:var(--ag-ink)}
.ag-band-sub{color:var(--ag-muted);font-size:.92rem;line-height:1.6;margin-top:.4rem;max-width:56ch}

/* ── FOOTER ── */
.ag-footer{background:var(--ag-bg);border-top:2px solid var(--ag-ink);padding:2.6rem 5vw 1.6rem}
.ag-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:2rem;margin-bottom:2rem}
.ag-footer-brand{font-family:var(--ag-display);font-size:1.6rem;letter-spacing:.04em;text-transform:uppercase;color:var(--ag-ink);margin-bottom:.7rem}
.ag-footer-tag{font-size:.92rem;color:var(--ag-muted);line-height:1.7;max-width:36ch}
.ag-footer-h{font-size:.74rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ag-ink);margin-bottom:.9rem}
.ag-footer-line{display:block;font-size:.92rem;color:var(--ag-inkDim);text-decoration:none;margin-bottom:.5rem;transition:color .25s}
a.ag-footer-line:hover{color:var(--ag-accentDeep)}
.ag-footer-copy{display:flex;justify-content:center;gap:.4rem;flex-wrap:wrap;border-top:1px solid var(--ag-line);padding-top:1.3rem;font-size:.78rem;color:var(--ag-muted);text-align:center}
@media(max-width:768px){.ag-footer-grid{grid-template-columns:1fr;gap:1.8rem}}

/* ── REVEAL (gate .lx-js — kontrak no-JS) ── */
.lx-js .ag-rv{opacity:0;transform:translateY(18px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1)}
.lx-js .ag-rv.lx-in{opacity:1;transform:none}
.ag-rv-d1{transition-delay:.07s}.ag-rv-d2{transition-delay:.14s}.ag-rv-d3{transition-delay:.21s}.ag-rv-d4{transition-delay:.28s}

/* ── polish ── */
.ag-btn:active,.ag-nav-cta:active,.ag-btn-ghost:active{transform:translateY(0) scale(.97)}
.ag-tcar-btn:active{transform:scale(.94)}
.ag-nav-cta:focus-visible,.ag-btn:focus-visible,.ag-btn-ghost:focus-visible,.ag-about-cta:focus-visible,.ag-footer-line:focus-visible,.ag-tcar-btn:focus-visible,.ag-faq-q:focus-visible{outline:2px solid var(--ag-accent);outline-offset:3px}
.ag-hero-sub,.ag-subtext,.ag-about-body,.ag-cta-sub,.ag-row-desc,.ag-step-desc{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

export default function AgencyPosterRenderer({ content: c, variant = 'bawaan', localeConfig, font }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.bawaan
  const fx = font ?? DEFAULT_FONT
  const cp = copyGetter(c.themeCopy, CORPORATE_AGENCY_SLOTS)
  const hero = c.hero ?? {}
  const items = c.showcase?.items ?? []
  const features = c.features ?? []
  const stats = c.stats ?? []
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []
  const jamRows = c.info?.jam ?? []
  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa}` : '#kontak'
  const { locale, currency } = moneyFromConfig(localeConfig)
  const fmt = (n: number) => formatMoney(n, locale, currency)
  const priceText = (n?: number) => (typeof n === 'number' && n > 0 ? fmt(n) : 'Tanya')

  const rootStyle = {
    '--ag-bg': p.bg,
    '--ag-bg2': p.bg2,
    '--ag-surface': p.surface,
    '--ag-ink': p.ink,
    '--ag-inkDim': p.inkDim,
    '--ag-muted': p.muted,
    '--ag-accent': p.accent,
    '--ag-accentDeep': p.accentDeep,
    '--ag-onAccent': p.onAccent,
    '--ag-line': p.line,
    '--ag-line2': p.line2,
    '--ag-display': fx.display,
    '--ag-body': fx.body,
  } as React.CSSProperties

  return (
    <div className="ag-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: themeCss(fx) }} />
      <nav className="ag-nav" aria-label="Navigasi utama">
        <a className="ag-nav-logo" href="#beranda">{c.nama ?? 'Nama Usaha'}</a>
        <a className="ag-nav-cta" href="#kontak" data-edit="copy.nav_cta">{cp.t('copy.nav_cta')}</a>
      </nav>

      <section className="ag-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="ag-hero-text">
          {hero.eyebrow && (
            <p className="ag-tab" data-edit="section:hero_banner.eyebrow">{hero.eyebrow}</p>
          )}
          {hero.title && (
            <h1 className="ag-hero-title" data-edit="section:hero_banner.title">{hero.title}</h1>
          )}
          {hero.subtitle && (
            <p className="ag-hero-sub" data-edit="section:hero_banner.subtitle">{hero.subtitle}</p>
          )}
          <div className="ag-hero-btns">
            <a className="ag-btn" href={hero.ctaHref ?? '#kontak'} data-edit="copy.hero_cta1">{hero.ctaText ?? cp.t('copy.hero_cta1')}</a>
            <a className="ag-btn-ghost" href={hero.ctaHref2 ?? '#layanan'} data-edit="copy.hero_cta2">{hero.ctaText2 ?? cp.t('copy.hero_cta2')}</a>
          </div>
        </div>
        <figure className="ag-hero-media">
          <div className="ag-hero-frame">
            {hero.image && (
              <img alt="Suasana kerja tim di studio" loading="eager" src={hero.image} />
            )}
          </div>
          <figcaption className="ag-hero-cap">
            <span data-edit="copy.hero_caption">{cp.t('copy.hero_caption')}</span>
            <span aria-hidden>
              ↗
            </span>
          </figcaption>
        </figure>
      </section>

      {stats.length > 0 && (
        <section className="ag-stats" aria-label="Angka kunci">
          <div className="ag-stats-grid" data-edit="konten:stats">
            {stats.map((s, i) => (
              <div key={i} className="ag-stat ag-rv lx-reveal" style={{ transitionDelay: `${(i % 4) * 0.08}s` }}>
                <div className="ag-stat-num" data-cu>{s.angka}</div>
                <div className="ag-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {items.length > 0 && (
        <section className="ag-section" id="layanan">
          <div className="ag-sechead ag-rv lx-reveal">
            <p className="ag-tab" data-edit="copy.layanan_eyebrow">{cp.t('copy.layanan_eyebrow')}</p>
            {c.showcase?.title && (
              <h2 className="ag-heading">{c.showcase?.title}</h2>
            )}
            {c.showcase?.subtitle && (
              <p className="ag-subtext">{c.showcase?.subtitle}</p>
            )}
          </div>
          <div className="ag-rows">
            {items.map((item, i) => (
              <article key={i} className="ag-row ag-rv lx-reveal" style={{ transitionDelay: `${(i % 2) * 0.08}s` }}>
                <h3 className="ag-row-name">{item.nama}</h3>
                {item.desc && (
                  <p className="ag-row-desc">{item.desc}</p>
                )}
                <span className="ag-row-price">{priceText(item.harga)}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {features.length > 0 && (
        <section className="ag-section ag-proses" id="proses">
          <div className="ag-sechead ag-rv lx-reveal">
            <p className="ag-tab" data-edit="copy.features_eyebrow">{c.featuresEyebrow ?? cp.t('copy.features_eyebrow')}</p>
            {c.featuresTitle && (
              <h2 className="ag-heading" data-edit="konten:featuresTitle">{c.featuresTitle}</h2>
            )}
          </div>
          <div className="ag-line-wrap" aria-hidden>
            <span className="ag-line lx-reveal" />
          </div>
          <div className="ag-steps">
            {features.map((ft, i) => (
              <div key={i} className="ag-step ag-rv lx-reveal" style={{ transitionDelay: `${(i % 4) * 0.08}s` }}>
                <h3 className="ag-step-title">{ft.title}</h3>
                <p className="ag-step-desc">{ft.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {c.statement && (
        <section className="ag-stmt" aria-label="Prinsip">
          {c.statement.eyebrow && (
            <p className="ag-tab">{c.statement.eyebrow}</p>
          )}
          <blockquote className="ag-stmt-quote ag-rv lx-reveal">{c.statement.quote}</blockquote>
          {c.statement.cite && (
            <cite className="ag-stmt-cite">{c.statement.cite}</cite>
          )}
        </section>
      )}

      {c.about && (
        <section className="ag-section" id="tentang">
          <div className="ag-about-inner">
            <div className="ag-about-media ag-rv lx-reveal">
              <div className="ag-about-frame">
                {c.about.image && (
                  <img alt="Ruang kerja studio" loading="lazy" src={c.about.image} />
                )}
              </div>
            </div>
            <div className="ag-rv lx-reveal ag-rv-d2">
              <p className="ag-tab" data-edit="copy.about_eyebrow">{cp.t('copy.about_eyebrow')}</p>
              <h2 className="ag-heading" data-edit="section:about.title">{c.about.title}</h2>
              <p className="ag-about-body" data-edit="section:about.body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a className="ag-about-cta" href={c.about.ctaHref}>{c.about.ctaText ?? 'Pelajari lebih lanjut'}</a>
              )}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="ag-section ag-testimonials" id="ulasan">
          <div className="ag-sechead ag-rv lx-reveal">
            <p className="ag-tab" data-edit="copy.ulasan_eyebrow">{cp.t('copy.ulasan_eyebrow')}</p>
            <h2 className="ag-heading" data-edit="copy.ulasan_title">{cp.t('copy.ulasan_title')}</h2>
          </div>
          <div className="ag-tcar lx-tcar">
            <div className="ag-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <figure key={i} className="ag-test ag-rv lx-reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                  <blockquote className="ag-test-quote">{t.quote}</blockquote>
                  <figcaption>
                    <span className="ag-test-name">{t.nama}</span>
                    {t.peran && (
                      <span className="ag-test-role">{t.peran}</span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="ag-tcar-ctrl">
              <button className="ag-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">
                ‹
              </button>
              <button className="ag-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">
                ›
              </button>
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="ag-section" id="faq">
          <div className="ag-sechead ag-rv lx-reveal">
            <p className="ag-tab" data-edit="copy.faq_eyebrow">{cp.t('copy.faq_eyebrow')}</p>
            <h2 className="ag-heading" data-edit="copy.faq_title">{cp.t('copy.faq_title')}</h2>
          </div>
          <div className="ag-faq-wrap">
            {faqs.map((fq, i) => (
              <details key={i} className="ag-faq-item">
                <summary className="ag-faq-q">{fq.q}</summary>
                <p className="ag-faq-a">{fq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {c.cta && (
        <section className="ag-cta" id="kontak" aria-label="Ajakan">
          <h2 className="ag-cta-title ag-rv lx-reveal">{c.cta.title}</h2>
          {c.cta.subtitle && (
            <p className="ag-cta-sub">{c.cta.subtitle}</p>
          )}
          <div className="ag-cta-btns">
            <a className="ag-btn" href={c.cta.ctaHref ?? waUrl} data-edit="copy.cta_primary">{c.cta.ctaText ?? cp.t('copy.cta_primary')}</a>
            <a className="ag-btn-ghost" href="#layanan" data-edit="copy.cta_ghost">{cp.t('copy.cta_ghost')}</a>
          </div>
        </section>
      )}

      <div>
        {(c.bands ?? []).map((b, i) => (
          <section key={i} className="ag-band" data-band={b.preset}>
            <div>
              <p className="ag-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
              <h2 className="ag-band-title">{b.title}</h2>
              {b.subtitle && (
                <p className="ag-band-sub">{b.subtitle}</p>
              )}
            </div>
            {b.ctaText && (
              <a className="ag-btn" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>
            )}
          </section>
        ))}
      </div>

      <footer className="ag-footer">
        <div className="ag-footer-grid">
          <div>
            <p className="ag-footer-brand">{c.nama ?? 'Nama Usaha'}</p>
            <p className="ag-footer-tag" data-edit="copy.footer_tagline">{cp.t('copy.footer_tagline')}</p>
          </div>
          <div>
            <p className="ag-footer-h" data-edit="copy.footer_kontak_h">{cp.t('copy.footer_kontak_h')}</p>
            <a className="ag-footer-line" href={waUrl} data-edit="copy.footer_wa_label">{cp.t('copy.footer_wa_label')}</a>
            {c.contact?.email && (
              <a className="ag-footer-line" href={`mailto:${c.contact?.email ?? ''}`}>{c.contact?.email}</a>
            )}
            {c.contact?.alamat && (
              <p className="ag-footer-line">{c.contact?.alamat}</p>
            )}
          </div>
          <div>
            <p className="ag-footer-h" data-edit="copy.footer_jam_h">{cp.t('copy.footer_jam_h')}</p>
            <div>
              {jamRows.length
                ? jamRows.map((j, i) => (
                  <p key={i} className="ag-footer-line">
                    <span>{j.hari}</span>
                    :
                    <span>{j.jam}</span>
                  </p>
                ))
                : <p className="ag-footer-line" data-edit="copy.footer_jam_fallback">{cp.t('copy.footer_jam_fallback')}</p>}
            </div>
          </div>
        </div>
        <p className="ag-footer-copy">
          <span aria-hidden>
            ©
          </span>
          <span>{new Date().getFullYear()}</span>
          <span>{c.nama ?? 'Nama Usaha'}</span>
          <span aria-hidden>
            ·
          </span>
          <span data-edit="copy.footer_copyright">{cp.t('copy.footer_copyright')}</span>
        </p>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
