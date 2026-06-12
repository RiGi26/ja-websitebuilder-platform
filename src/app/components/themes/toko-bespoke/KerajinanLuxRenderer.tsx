'use client'
import { useState, useEffect } from 'react'
import type { BespokeTokoProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// TANAH LOKA — Toko Kerajinan Bespoke Lux Renderer
// Cinzel (display) + Raleway (body) | Forest #1E3A2F ·
// Parchment #F7F0E3 · Bronze #C8962A | Kawung motif | ns: kr-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.kr-*`.
// ============================================================

export interface KrPal {
  bg: string; bg2: string; surface: string; ink: string; inkDim: string
  muted: string; accent: string; onAccent: string; gold: string
  line: string; line2: string; scrim: string
}

export const PALETTES: Record<string, KrPal> = {
  tanah: {
    bg: '#F7F0E3', bg2: '#EDE5D4', surface: '#FDFAF5',
    ink: '#1E1208', inkDim: '#3D2812', muted: '#6B5540',
    accent: '#1E3A2F', onAccent: '#F7F0E3', gold: '#C8962A',
    line: 'rgba(30,18,8,.10)', line2: 'rgba(30,18,8,.06)', scrim: '#0E0905',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap'
const DISPLAY = '"Cinzel","Georgia",serif'
const BODY = '"Raleway","Helvetica Neue",sans-serif'
const EASE = 'cubic-bezier(.16,1,.3,1)'

// Kawung batik motif — 4 tangent circles form the classic petal pattern
const KW_DARK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Ccircle cx='0' cy='0' r='70' fill='none' stroke='%23C8962A' stroke-width='1.2' opacity='.18'/%3E%3Ccircle cx='160' cy='0' r='70' fill='none' stroke='%23C8962A' stroke-width='1.2' opacity='.18'/%3E%3Ccircle cx='0' cy='160' r='70' fill='none' stroke='%23C8962A' stroke-width='1.2' opacity='.18'/%3E%3Ccircle cx='160' cy='160' r='70' fill='none' stroke='%23C8962A' stroke-width='1.2' opacity='.18'/%3E%3Ccircle cx='80' cy='80' r='26' fill='none' stroke='%23C8962A' stroke-width='.8' opacity='.12'/%3E%3C/svg%3E`
const KW_LIGHT = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Ccircle cx='0' cy='0' r='70' fill='none' stroke='%231E3A2F' stroke-width='1' opacity='.05'/%3E%3Ccircle cx='160' cy='0' r='70' fill='none' stroke='%231E3A2F' stroke-width='1' opacity='.05'/%3E%3Ccircle cx='0' cy='160' r='70' fill='none' stroke='%231E3A2F' stroke-width='1' opacity='.05'/%3E%3Ccircle cx='160' cy='160' r='70' fill='none' stroke='%231E3A2F' stroke-width='1' opacity='.05'/%3E%3C/svg%3E`

function krCss(): string {
  return `
@import url('${FONT_IMPORT}');
.kr-root{font-family:${BODY};color:var(--kr-ink);background:var(--kr-bg);line-height:1.65;-webkit-font-smoothing:antialiased}
.kr-root *,.kr-root *::before,.kr-root *::after{box-sizing:border-box;margin:0;padding:0}
.kr-root img{max-width:100%;height:auto;display:block}

/* NAV */
.kr-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.1rem 5vw;display:flex;align-items:center;justify-content:space-between;transition:background .35s,box-shadow .35s}
.kr-nav.scrolled{background:var(--kr-bg);box-shadow:0 1px 0 var(--kr-line)}
.kr-nav-logo{font-family:${DISPLAY};font-weight:700;letter-spacing:.05em;color:var(--kr-onAccent);font-size:1rem;text-decoration:none}
.kr-nav.scrolled .kr-nav-logo{color:var(--kr-ink)}
.kr-nav-cta{background:var(--kr-gold);color:var(--kr-scrim);font-family:${BODY};font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.55rem 1.25rem;border-radius:2px;text-decoration:none;transition:opacity .2s}
.kr-nav-cta:hover{opacity:.85}
.kr-nav.scrolled .kr-nav-cta{background:var(--kr-accent);color:var(--kr-onAccent)}

/* HERO */
.kr-hero{min-height:100svh;background:var(--kr-accent);background-image:url('${KW_DARK}');background-size:160px 160px;display:grid;grid-template-columns:55% 45%;align-items:center;padding-top:5rem}
.kr-hero-text{padding:4rem 2rem 4rem 5vw}
.kr-hero-ew{font-family:${BODY};font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--kr-gold);margin-bottom:1.25rem}
.kr-hero-title{font-family:${DISPLAY};font-size:clamp(2.2rem,4.5vw,4rem);font-weight:700;line-height:1.1;color:var(--kr-onAccent);margin-bottom:1.25rem;letter-spacing:-.01em}
.kr-hero-title span{display:inline;opacity:0;transform:translateY(.35em);transition:opacity .5s ${EASE},transform .5s ${EASE}}
.kr-hero-title span.vis{opacity:1;transform:none}
.kr-hero-sub{font-size:1rem;color:var(--kr-onAccent);opacity:.78;margin-bottom:2rem;max-width:42ch;line-height:1.75}
.kr-hero-btns{display:flex;gap:.75rem;flex-wrap:wrap}
.kr-btn-primary{background:var(--kr-gold);color:var(--kr-scrim);font-family:${BODY};font-size:.82rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.85rem 1.75rem;border-radius:2px;text-decoration:none;transition:opacity .2s}
.kr-btn-primary:hover{opacity:.88}
.kr-btn-ghost{border:1px solid rgba(247,240,227,.35);color:var(--kr-onAccent);font-family:${BODY};font-size:.82rem;font-weight:500;padding:.85rem 1.75rem;border-radius:2px;text-decoration:none;transition:border-color .2s}
.kr-btn-ghost:hover{border-color:rgba(247,240,227,.7)}
.kr-hero-media{padding:3rem 5vw 3rem 1rem;display:flex;align-items:center;justify-content:center}
.kr-hero-frame{position:relative;width:100%;border-radius:4px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.55);aspect-ratio:3/4;max-height:70vh}
.kr-hero-frame::after{content:'';position:absolute;inset:0;border:1px solid rgba(200,144,42,.22);border-radius:4px;pointer-events:none}
.kr-hero-frame img{width:100%;height:100%;object-fit:cover}
.kr-hero-badge{position:absolute;bottom:-1rem;left:-1rem;background:var(--kr-bg);color:var(--kr-ink);font-family:${DISPLAY};font-size:.72rem;font-weight:600;letter-spacing:.05em;padding:.7rem 1.1rem;border-radius:2px;box-shadow:0 4px 20px rgba(0,0,0,.2);z-index:2}
@media(max-width:768px){
  .kr-hero{grid-template-columns:1fr;min-height:unset;padding-top:4.5rem}
  .kr-hero-media{order:-1;padding:1.5rem 5vw 0}
  .kr-hero-frame{aspect-ratio:4/3;max-height:50vw}
  .kr-hero-text{padding:1.75rem 5vw 3.5rem}
}

/* MARQUEE */
.kr-marquee{overflow:hidden;background:var(--kr-inkDim);padding:.9rem 0}
.kr-mq-track{display:flex;animation:kr-scroll 32s linear infinite;width:max-content}
.kr-mq-track:hover{animation-play-state:paused}
.kr-mq-item{font-family:${DISPLAY};font-size:.68rem;font-weight:400;letter-spacing:.2em;text-transform:uppercase;color:var(--kr-gold);padding:0 2.5rem;white-space:nowrap}
@keyframes kr-scroll{to{transform:translateX(-50%)}}

/* SECTION COMMONS */
.kr-section{padding:5rem 5vw}
.kr-eyebrow{font-family:${BODY};font-size:.7rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--kr-accent);margin-bottom:.75rem}
.kr-heading{font-family:${DISPLAY};font-size:clamp(1.75rem,3vw,2.75rem);font-weight:700;color:var(--kr-ink);line-height:1.15;letter-spacing:-.01em}
.kr-subtext{color:var(--kr-muted);font-size:.95rem;margin-top:.75rem;max-width:56ch;line-height:1.7}
.kr-sec-hdr{margin-bottom:3rem}

/* FEATURES */
.kr-features{background:var(--kr-bg)}
.kr-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2.5rem}
.kr-feat{border-top:2px solid var(--kr-line);padding-top:1.5rem}
.kr-feat-num{font-family:${DISPLAY};font-size:.68rem;font-weight:700;color:var(--kr-accent);letter-spacing:.1em;margin-bottom:.75rem}
.kr-feat-title{font-family:${DISPLAY};font-size:1rem;font-weight:600;color:var(--kr-ink);margin-bottom:.5rem}
.kr-feat-desc{font-size:.85rem;color:var(--kr-muted);line-height:1.65}
@media(max-width:768px){.kr-feat-grid{grid-template-columns:1fr;gap:1.75rem}}

/* STATEMENT */
.kr-statement{background:var(--kr-bg2);padding:4.5rem 5vw;text-align:center}
.kr-stmt-ew{font-family:${BODY};font-size:.7rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--kr-accent);margin-bottom:1.25rem}
.kr-stmt-quote{font-family:${DISPLAY};font-size:clamp(1.3rem,2.5vw,1.9rem);font-weight:400;color:var(--kr-ink);line-height:1.55;max-width:54ch;margin:0 auto 1.25rem;letter-spacing:-.01em}
.kr-stmt-cite{font-size:.82rem;color:var(--kr-muted)}

/* SHOWCASE / CARD GRID */
.kr-showcase{background:var(--kr-bg);background-image:url('${KW_LIGHT}');background-size:160px 160px}
.kr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
.kr-card{background:var(--kr-surface);border:1px solid var(--kr-line);border-radius:6px;overflow:hidden;cursor:pointer;transition:box-shadow .25s,transform .25s}
.kr-card:hover{box-shadow:0 20px 56px rgba(30,18,8,.12);transform:translateY(-4px)}
.kr-card-feat{grid-column:span 2}
.kr-card-img{overflow:hidden;aspect-ratio:4/3}
.kr-card-feat .kr-card-img{aspect-ratio:16/9}
.kr-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s ${EASE}}
.kr-card:hover .kr-card-img img{transform:scale(1.05)}
.kr-card-body{padding:1.25rem}
.kr-card-name{font-family:${DISPLAY};font-size:.9rem;font-weight:600;color:var(--kr-ink);margin-bottom:.35rem;line-height:1.3}
.kr-card-desc{font-size:.8rem;color:var(--kr-muted);margin-bottom:.65rem;line-height:1.55}
.kr-card-price{font-family:${DISPLAY};font-size:.95rem;font-weight:700;color:var(--kr-accent)}
.kr-card-ql{display:inline-block;margin-top:.65rem;font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--kr-accent);border-bottom:1px solid currentColor;padding-bottom:1px}
@media(max-width:1024px){.kr-grid{grid-template-columns:repeat(2,1fr)}.kr-card-feat{grid-column:span 2}}
@media(max-width:600px){.kr-grid{grid-template-columns:1fr}.kr-card-feat{grid-column:span 1}}

/* ABOUT / WORKSHOP — dark forest bg */
.kr-about{background:var(--kr-accent);background-image:url('${KW_DARK}');background-size:160px 160px}
.kr-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:4.5rem;align-items:center}
.kr-about .kr-eyebrow{color:var(--kr-gold)}
.kr-about .kr-heading{color:var(--kr-onAccent)}
.kr-about-body{font-size:1rem;color:var(--kr-onAccent);opacity:.8;line-height:1.85;margin-top:1rem;white-space:pre-line}
.kr-about-cta{display:inline-block;margin-top:2rem;font-family:${BODY};font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--kr-gold);border-bottom:1px solid currentColor;padding-bottom:2px;text-decoration:none}
.kr-about-img{position:relative}
.kr-about-frame{aspect-ratio:3/4;border-radius:4px;overflow:hidden;box-shadow:0 24px 72px rgba(0,0,0,.45)}
.kr-about-frame img{width:100%;height:100%;object-fit:cover}
.kr-about-tag{position:absolute;top:-1rem;right:-1rem;background:var(--kr-gold);color:var(--kr-scrim);font-family:${DISPLAY};font-size:.68rem;font-weight:700;letter-spacing:.08em;padding:.6rem 1rem;border-radius:2px;text-transform:uppercase}
@media(max-width:768px){.kr-about-inner{grid-template-columns:1fr;gap:2.5rem}.kr-about-img{order:-1}.kr-about-tag{top:-.75rem;right:.5rem}}

/* STATS */
.kr-stats{background:var(--kr-bg2)}
.kr-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;text-align:center}
.kr-stat-num{font-family:${DISPLAY};font-size:clamp(2.25rem,4.5vw,3.5rem);font-weight:700;color:var(--kr-accent);line-height:1}
.kr-stat-label{font-size:.75rem;color:var(--kr-muted);letter-spacing:.08em;text-transform:uppercase;margin-top:.5rem}
@media(max-width:600px){.kr-stats-grid{grid-template-columns:repeat(2,1fr);gap:2rem}}

/* TESTIMONIALS */
.kr-testimonials{background:var(--kr-surface)}
.kr-test-wrap{overflow-x:auto;padding-bottom:1rem;-ms-overflow-style:none;scrollbar-width:none}
.kr-test-wrap::-webkit-scrollbar{display:none}
.kr-test-track{display:flex;gap:1.25rem;padding:.25rem 0;width:max-content}
.kr-test-card{background:var(--kr-bg);border:1px solid var(--kr-line);border-radius:6px;padding:1.75rem;width:300px;flex-shrink:0}
.kr-test-mark{font-family:${DISPLAY};font-size:2.5rem;color:var(--kr-accent);opacity:.18;line-height:1;margin-bottom:-.25rem}
.kr-test-quote{font-size:.9rem;color:var(--kr-inkDim);line-height:1.72;margin-bottom:1.25rem;font-style:italic}
.kr-test-name{font-family:${DISPLAY};font-size:.8rem;font-weight:600;color:var(--kr-ink)}
.kr-test-role{font-size:.74rem;color:var(--kr-muted);margin-top:.2rem}

/* FAQ */
.kr-faq{background:var(--kr-bg)}
.kr-faq-item{border-bottom:1px solid var(--kr-line)}
.kr-faq-q{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 0;cursor:pointer;font-family:${DISPLAY};font-size:.9rem;font-weight:600;color:var(--kr-ink);gap:1rem;width:100%;background:none;border:none;text-align:left}
.kr-faq-q:focus-visible{outline:2px solid var(--kr-accent);outline-offset:2px;border-radius:2px}
.kr-faq-icon{font-size:1.2rem;color:var(--kr-accent);flex-shrink:0;transition:transform .25s}
.kr-faq-icon.open{transform:rotate(45deg)}
.kr-faq-a{font-size:.875rem;color:var(--kr-muted);line-height:1.75;padding-bottom:1.25rem;max-width:64ch}

/* CTA */
.kr-cta{background:var(--kr-scrim);background-image:url('${KW_DARK}');background-size:200px 200px;text-align:center}
.kr-cta .kr-stmt-ew{color:var(--kr-gold)}
.kr-cta-title{font-family:${DISPLAY};font-size:clamp(1.85rem,4vw,3.25rem);font-weight:700;color:var(--kr-onAccent);margin-bottom:1rem;line-height:1.1;letter-spacing:-.01em}
.kr-cta-sub{font-size:1rem;color:var(--kr-onAccent);opacity:.72;max-width:48ch;margin:0 auto 2.5rem;line-height:1.7}
.kr-cta-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.kr-cta-btn{background:var(--kr-gold);color:var(--kr-scrim);font-family:${BODY};font-weight:700;font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;padding:1rem 2.5rem;border-radius:2px;text-decoration:none;transition:opacity .2s}
.kr-cta-btn:hover{opacity:.88}
.kr-cta-ghost{border:1px solid rgba(247,240,227,.28);color:var(--kr-onAccent);font-family:${BODY};font-size:.85rem;padding:1rem 2.5rem;border-radius:2px;text-decoration:none;transition:border-color .2s}
.kr-cta-ghost:hover{border-color:rgba(247,240,227,.6)}

/* FOOTER */
.kr-footer{background:var(--kr-inkDim);color:var(--kr-onAccent);padding:3.5rem 5vw 2rem}
.kr-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.5rem}
.kr-footer-brand{font-family:${DISPLAY};font-size:1.1rem;font-weight:700;letter-spacing:.05em;margin-bottom:.75rem}
.kr-footer-tagline{font-size:.82rem;color:var(--kr-onAccent);opacity:.55;line-height:1.65;max-width:36ch}
.kr-footer-h{font-family:${DISPLAY};font-size:.68rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--kr-gold);margin-bottom:1rem}
.kr-footer-link{display:block;font-size:.82rem;color:var(--kr-onAccent);opacity:.7;text-decoration:none;margin-bottom:.5rem;transition:opacity .2s}
.kr-footer-link:hover{opacity:1}
.kr-footer-copy{border-top:1px solid rgba(247,240,227,.1);padding-top:1.5rem;font-size:.75rem;color:var(--kr-onAccent);opacity:.38;text-align:center}
@media(max-width:768px){.kr-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* REVEAL */
.kr-rv{opacity:0;transform:translateY(18px);transition:opacity .6s ${EASE},transform .6s ${EASE}}
.kr-rv.vis{opacity:1;transform:none}
.kr-rv-d1{transition-delay:.08s}.kr-rv-d2{transition-delay:.16s}.kr-rv-d3{transition-delay:.24s}

/* LIGHTBOX — kr-root overrides for lx-lb palette */
.kr-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.kr-root .lx-lb[hidden]{display:none}
.kr-root .lx-lb-back{position:absolute;inset:0;background:rgba(14,9,5,.78);backdrop-filter:blur(8px);border:0;cursor:pointer}
.kr-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--kr-surface);border:1px solid var(--kr-line);border-radius:8px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .4s ${EASE},transform .4s ${EASE}}
.kr-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.kr-root .lx-lb-media{position:relative;overflow:hidden;background:var(--kr-bg2);min-height:280px}
.kr-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.kr-root .lx-lb-body{padding:clamp(20px,3vw,40px);display:flex;flex-direction:column;gap:8px;justify-content:center}
.kr-root .lx-lb-cat{font-family:${BODY};font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--kr-accent)}
.kr-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(20px,2.5vw,28px);font-weight:600;line-height:1.18;color:var(--kr-ink)}
.kr-root .lx-lb-price{font-family:${DISPLAY};font-size:18px;color:var(--kr-accent);font-variant-numeric:tabular-nums}
.kr-root .lx-lb-desc{color:var(--kr-muted);font-size:13px;line-height:1.75}
.kr-root .lx-lb-cta{margin-top:12px;width:fit-content;display:inline-flex;align-items:center;background:var(--kr-accent);color:var(--kr-onAccent);font-family:${BODY};font-size:13px;font-weight:700;padding:12px 20px;border-radius:3px;text-decoration:none;letter-spacing:.06em;text-transform:uppercase}
.kr-root .lx-lb-x{position:absolute;top:10px;right:10px;z-index:3;width:40px;height:40px;border-radius:4px;background:var(--kr-bg);border:1px solid var(--kr-line);color:var(--kr-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.kr-root .lx-lb-x:hover{background:var(--kr-accent);color:var(--kr-onAccent);border-color:var(--kr-accent)}
.kr-root .lx-lb-prev,.kr-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:40px;height:40px;border-radius:4px;background:var(--kr-bg);border:1px solid var(--kr-line);color:var(--kr-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.kr-root .lx-lb-prev:hover,.kr-root .lx-lb-next:hover{background:var(--kr-accent);color:var(--kr-onAccent)}
.kr-root .lx-lb-prev{left:8px}.kr-root .lx-lb-next{right:8px}
@media(max-width:640px){.kr-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.kr-root .lx-lb-media{min-height:220px}}
`
}

const MQ_ITEMS = ['BATIK TULIS', 'TENUN IKAT', 'GERABAH', 'ANYAMAN ROTAN', 'UKIRAN KAYU', 'SONGKET', 'WAYANG KULIT']

export default function KerajinanLuxRenderer({ content: c, variant = 'tanah' }: BespokeTokoProps) {
  const p = PALETTES[variant] ?? PALETTES.tanah
  const [scrolled, setScrolled] = useState(false)
  const [titleVis, setTitleVis] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setTitleVis(true), 250)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('vis') }),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.kr-rv').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa}` : '#wa'
  const hero = c.hero ?? {}
  const items = c.showcase?.items ?? []
  const stats = c.stats ?? []
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []

  const rootStyle = {
    '--kr-bg': p.bg, '--kr-bg2': p.bg2, '--kr-surface': p.surface,
    '--kr-ink': p.ink, '--kr-inkDim': p.inkDim, '--kr-muted': p.muted,
    '--kr-accent': p.accent, '--kr-onAccent': p.onAccent, '--kr-gold': p.gold,
    '--kr-line': p.line, '--kr-line2': p.line2, '--kr-scrim': p.scrim,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const words = (hero.title ?? '').split(' ')

  return (
    <div className="kr-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: krCss() }} />

      {/* NAV */}
      <nav className={`kr-nav${scrolled ? ' scrolled' : ''}`} aria-label="Navigasi utama">
        <span className="kr-nav-logo">{c.nama ?? 'Tanah Loka'}</span>
        <a href={waUrl} className="kr-nav-cta">Hubungi Kami</a>
      </nav>

      {/* HERO */}
      <section className="kr-hero" id="beranda" aria-label="Hero">
        <div className="kr-hero-text">
          {hero.eyebrow && <p className="kr-hero-ew">{hero.eyebrow}</p>}
          <h1 className="kr-hero-title" aria-label={hero.title}>
            {words.map((w, i) => (
              <span key={i} className={titleVis ? 'vis' : ''} style={{ transitionDelay: `${i * 75}ms` }}>
                {w}{' '}
              </span>
            ))}
          </h1>
          {hero.subtitle && <p className="kr-hero-sub">{hero.subtitle}</p>}
          <div className="kr-hero-btns">
            {hero.ctaHref && (
              <a href={hero.ctaHref} className="kr-btn-primary">{hero.ctaText ?? 'Lihat Koleksi'}</a>
            )}
            {hero.ctaHref2 && (
              <a href={hero.ctaHref2} className="kr-btn-ghost">{hero.ctaText2 ?? 'Hubungi Kami'}</a>
            )}
          </div>
        </div>
        {hero.image && (
          <div className="kr-hero-media">
            <div className="kr-hero-frame">
              <img src={hero.image} alt={c.nama ?? 'Kerajinan'} loading="eager" />
              {stats[0] && (
                <div className="kr-hero-badge">{stats[0].angka} {stats[0].label}</div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* MARQUEE */}
      <div className="kr-marquee" aria-hidden="true">
        <div className="kr-mq-track">
          {[...MQ_ITEMS, ...MQ_ITEMS].map((m, i) => (
            <span key={i} className="kr-mq-item">{m} ·</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      {(c.features?.length ?? 0) > 0 && (
        <section className="kr-section kr-features" id="keunggulan">
          {(c.featuresEyebrow || c.featuresTitle) && (
            <div className="kr-sec-hdr kr-rv">
              {c.featuresEyebrow && <p className="kr-eyebrow">{c.featuresEyebrow}</p>}
              {c.featuresTitle && <h2 className="kr-heading">{c.featuresTitle}</h2>}
            </div>
          )}
          <div className="kr-feat-grid">
            {c.features!.map((f, i) => (
              <div key={i} className={`kr-feat kr-rv kr-rv-d${i + 1}`}>
                <div className="kr-feat-num">0{i + 1}</div>
                <h3 className="kr-feat-title">{f.title}</h3>
                <p className="kr-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT */}
      {c.statement && (
        <div className="kr-statement kr-rv">
          {c.statement.eyebrow && <p className="kr-stmt-ew">{c.statement.eyebrow}</p>}
          <blockquote className="kr-stmt-quote">"{c.statement.quote}"</blockquote>
          {c.statement.cite && <cite className="kr-stmt-cite">— {c.statement.cite}</cite>}
        </div>
      )}

      {/* SHOWCASE */}
      {items.length > 0 && (
        <section className="kr-section kr-showcase" id="koleksi">
          <div className="kr-sec-hdr kr-rv">
            <p className="kr-eyebrow">Koleksi</p>
            {c.showcase?.title && <h2 className="kr-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="kr-subtext">{c.showcase.subtitle}</p>}
          </div>
          <div className="kr-grid">
            {items.map((item, i) => (
              <article
                key={i}
                className={`kr-card lx-lb-open kr-rv${i === 0 ? ' kr-card-feat' : ''}`}
                style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
                data-src={item.gambar ?? ''}
                data-title={item.nama}
                data-price={fmt(item.harga ?? 0)}
                data-desc={item.desc ?? ''}
                data-href={waUrl}
                role="button"
                tabIndex={0}
                aria-label={`${item.nama} — ${fmt(item.harga ?? 0)}`}
              >
                {item.gambar && (
                  <div className="kr-card-img">
                    <img src={item.gambar} alt={item.nama} loading="lazy" />
                  </div>
                )}
                <div className="kr-card-body">
                  <h3 className="kr-card-name">{item.nama}</h3>
                  {item.desc && <p className="kr-card-desc">{item.desc}</p>}
                  <p className="kr-card-price">{fmt(item.harga ?? 0)}</p>
                  <span className="kr-card-ql">Lihat Detail →</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="kr-section kr-about" id="sanggar">
          <div className="kr-about-inner">
            <div className="kr-rv">
              <p className="kr-eyebrow">Sanggar</p>
              <h2 className="kr-heading">{c.about.title}</h2>
              <p className="kr-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="kr-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'}
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="kr-about-img kr-rv kr-rv-d2">
                <div className="kr-about-frame">
                  <img src={c.about.image} alt={c.about.title} loading="lazy" />
                </div>
                <div className="kr-about-tag">Sanggar</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="kr-section kr-stats">
          <div className="kr-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`kr-rv kr-rv-d${i + 1}`} style={{ textAlign: 'center' }}>
                <div className="kr-stat-num">{s.angka}</div>
                <div className="kr-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="kr-section kr-testimonials" id="ulasan">
          <div className="kr-sec-hdr kr-rv">
            <p className="kr-eyebrow">Ulasan</p>
            <h2 className="kr-heading">Kata Mereka</h2>
          </div>
          <div className="kr-test-wrap">
            <div className="kr-test-track">
              {testimonials.map((t, i) => (
                <div key={i} className="kr-test-card">
                  <div className="kr-test-mark">"</div>
                  <p className="kr-test-quote">{t.quote}</p>
                  <p className="kr-test-name">{t.nama}</p>
                  {t.peran && <p className="kr-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="kr-section kr-faq" id="faq">
          <div className="kr-sec-hdr kr-rv">
            <p className="kr-eyebrow">Pertanyaan</p>
            <h2 className="kr-heading">Sering Ditanyakan</h2>
          </div>
          {faqs.map((f, i) => (
            <div key={i} className="kr-faq-item">
              <button
                className="kr-faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span>{f.q}</span>
                <span className={`kr-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
              </button>
              {openFaq === i && <p className="kr-faq-a">{f.a}</p>}
            </div>
          ))}
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="kr-section kr-cta" id="pesan">
          <p className="kr-stmt-ew">Miliki Karya</p>
          <h2 className="kr-cta-title">{c.cta.title}</h2>
          {c.cta.subtitle && <p className="kr-cta-sub">{c.cta.subtitle}</p>}
          <div className="kr-cta-btns">
            <a href={waUrl} className="kr-cta-btn">{c.cta.ctaText ?? 'Hubungi via WhatsApp'}</a>
            {hero.ctaHref && (
              <a href={hero.ctaHref} className="kr-cta-ghost">Lihat Koleksi</a>
            )}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="kr-footer">
        <div className="kr-footer-grid">
          <div>
            <p className="kr-footer-brand">{c.nama ?? 'Tanah Loka'}</p>
            <p className="kr-footer-tagline">
              {hero.eyebrow ?? 'Kerajinan tangan Nusantara — tradisi yang hidup di tiap karya.'}
            </p>
          </div>
          <div>
            <p className="kr-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="kr-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="kr-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="kr-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="kr-footer-h">Jam Sanggar</p>
            {c.info?.jam
              ? c.info.jam.map((j, i) => (
                  <p key={i} className="kr-footer-link">{j.hari}: {j.jam}</p>
                ))
              : (
                <>
                  <p className="kr-footer-link">Senin–Sabtu: 09.00–17.00</p>
                  <p className="kr-footer-link">Minggu: Appointment</p>
                </>
              )}
          </div>
        </div>
        <p className="kr-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Tanah Loka'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX — JS-driven via LUX_JS (class lx-lb-open + data-* on cards) */}
      <BespokeLightbox ctaText="Hubungi via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
