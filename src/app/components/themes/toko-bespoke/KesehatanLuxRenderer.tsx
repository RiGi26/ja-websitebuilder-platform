'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// JAMU — Toko Kesehatan & Herbal Bespoke Lux Renderer (Apothecary Heritage)
// Zilla Slab (display, slab serif) + Work Sans (body) |
// Kraft #ECE3CE · #E6DCC4 · Ink olive-hitam #21271A · Turmeric #A8661A / #7C4A0E |
// signature: kartu "label apotek" (tepi perforasi + segel/stempel) + pita halftone
// | motif: stempel segel + dot-screen halftone | ns: ks-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.ks-*`.
// Heritage-warm apothecary — sengaja kontras dgn tema lain (forest kerajinan,
// sage rumah, glow kecantikan, dll). Light palette → contrast.test menjaga WCAG.
// ============================================================

export interface KsPal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentDeep: string; onAccent: string
  line: string; line2: string; shadow: string; shadowDeep: string
}

export const PALETTES: Record<string, KsPal> = {
  // Jamu — kraft hangat, tinta olive-hitam herbal, aksen kunyit (turmeric).
  jamu: {
    bg: '#ECE3CE', bg2: '#E6DCC4', surface: '#F4EEDF', surface2: '#E9DEC6',
    ink: '#21271A', inkDim: '#46402C', muted: '#5A5234',
    accent: '#A8661A', accentDeep: '#7C4A0E', onAccent: '#F7F1E2',
    line: 'rgba(33,39,26,.14)', line2: 'rgba(33,39,26,.08)',
    shadow: 'rgba(48,34,12,.10)', shadowDeep: 'rgba(48,34,12,.18)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Zilla+Slab:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Work+Sans:wght@300;400;500;600;700&display=swap'
const DISPLAY = '"Zilla Slab","Georgia",serif'
const BODY = '"Work Sans","Segoe UI",sans-serif'
const EASE = 'cubic-bezier(.22,1,.36,1)'

function ksCss(): string {
  return `
@import url('${FONT_IMPORT}');
html,body{overflow-x:hidden;max-width:100%}
.ks-root{font-family:${BODY};color:var(--ks-ink);background:var(--ks-bg);line-height:1.7;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.ks-root *,.ks-root *::before,.ks-root *::after{box-sizing:border-box;margin:0;padding:0}
.ks-root img{max-width:100%;height:auto;display:block}
.ks-root ::selection{background:rgba(168,102,26,.22);color:var(--ks-ink)}

/* SEGEL/STEMPEL — motif inti: lingkaran cincin-ganda ala stempel apotek lawas. */
.ks-seal{display:grid;place-items:center;width:5.4rem;height:5.4rem;border-radius:50%;border:1.5px solid var(--ks-accentDeep);box-shadow:inset 0 0 0 3px var(--ks-bg),inset 0 0 0 4.5px var(--ks-accent);text-align:center;color:var(--ks-accentDeep);background:var(--ks-surface);transform:rotate(-9deg)}
.ks-seal b{font-family:${DISPLAY};font-weight:700;font-size:.78rem;line-height:1;letter-spacing:.02em;text-transform:uppercase}
.ks-seal i{font-style:normal;font-size:.48rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ks-muted);margin-top:.18rem}

/* Tepi perforasi (tiket/label apotek) — garis robekan titik-titik. */
.ks-perf{height:0;border-top:2px dotted var(--ks-line);margin:0}

/* NAV */
.ks-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.2rem 7vw;display:flex;align-items:center;justify-content:space-between;transition:background .45s,box-shadow .45s,backdrop-filter .45s,padding .45s}
.ks-root.lx-scrolled .ks-nav{background:rgba(236,227,206,.84);backdrop-filter:blur(11px);box-shadow:0 1px 0 var(--ks-line);padding-top:.9rem;padding-bottom:.9rem}
.ks-nav-logo{font-family:${DISPLAY};font-weight:700;letter-spacing:.01em;color:var(--ks-ink);font-size:1.5rem;text-decoration:none;display:flex;align-items:center;gap:.55rem}
.ks-nav-logo::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--ks-accent);box-shadow:0 0 0 3px var(--ks-bg),0 0 0 4px var(--ks-accentDeep)}
.ks-nav-cta{font-family:${BODY};font-size:.82rem;font-weight:600;letter-spacing:.03em;text-transform:uppercase;color:var(--ks-onAccent);background:var(--ks-accentDeep);padding:.7rem 1.45rem;border-radius:7px;text-decoration:none;transition:transform .3s ${EASE},background .3s}
.ks-nav-cta:hover{transform:translateY(-2px);background:var(--ks-ink)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO — tipografi slab besar di atas produk + segel; pita halftone di bawah */
.ks-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1.08fr .92fr;align-items:center;gap:clamp(2rem,5vw,5rem);padding:9rem 7vw 5rem;background:var(--ks-bg)}
.ks-hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(var(--ks-accent) .9px,transparent .9px);background-size:18px 18px;opacity:.05;z-index:0;pointer-events:none}
.ks-hero-text{position:relative;z-index:2}
.ks-hero-ew{font-size:.74rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ks-accentDeep);margin-bottom:1.4rem;display:inline-flex;align-items:center;gap:.7rem}
.ks-hero-ew::before{content:'';width:2rem;height:2px;background:var(--ks-accent)}
.ks-hero-title{font-family:${DISPLAY};font-size:clamp(2.9rem,6.6vw,5.6rem);font-weight:700;line-height:1.02;color:var(--ks-ink);margin-bottom:1.5rem;letter-spacing:-.015em}
.ks-hero-title span{display:inline;opacity:1}
@media(prefers-reduced-motion:no-preference){.ks-hero-title span{animation:ksRise .8s ${EASE} both;animation-delay:var(--ks-d,0ms)}}
@keyframes ksRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.ks-hero-title em{font-style:italic;font-weight:500;color:var(--ks-accentDeep)}
.ks-hero-sub{font-size:1.08rem;color:var(--ks-inkDim);margin-bottom:2rem;max-width:46ch;line-height:1.85}
.ks-hero-btns{display:flex;gap:1rem;flex-wrap:wrap;align-items:center;margin-bottom:2.3rem}
.ks-btn-primary{font-family:${BODY};font-size:.88rem;font-weight:600;letter-spacing:.02em;background:var(--ks-accentDeep);color:var(--ks-onAccent);padding:.95rem 2rem;border-radius:8px;text-decoration:none;transition:transform .3s ${EASE},background .3s,box-shadow .3s;box-shadow:0 6px 18px var(--ks-shadow)}
.ks-btn-primary:hover{transform:translateY(-2px);background:var(--ks-ink);box-shadow:0 12px 28px var(--ks-shadowDeep)}
.ks-btn-ghost{font-size:.88rem;font-weight:600;color:var(--ks-ink);padding:.95rem .5rem;text-decoration:none;border-bottom:2px solid var(--ks-accent);transition:color .3s,border-color .3s}
.ks-btn-ghost:hover{color:var(--ks-accentDeep)}
.ks-hero-meta{display:flex;flex-wrap:wrap;gap:1.7rem}
.ks-meta-item{display:flex;flex-direction:column;gap:.15rem}
.ks-meta-num{font-family:${DISPLAY};font-size:1.55rem;font-weight:600;color:var(--ks-ink);line-height:1;font-variant-numeric:tabular-nums}
.ks-meta-label{font-size:.74rem;color:var(--ks-muted);letter-spacing:.04em}
.ks-hero-media{position:relative;z-index:1;display:flex;align-items:center;justify-content:center}
.ks-hero-frame{position:relative;width:100%;max-width:420px;aspect-ratio:4/5}
.ks-frame{position:relative;overflow:hidden;background:var(--ks-surface2);border-radius:14px;border:1px solid var(--ks-line)}
.ks-frame img{width:100%;height:100%;object-fit:cover}
.ks-hero-frame .ks-frame{width:100%;height:100%;box-shadow:0 36px 74px var(--ks-shadowDeep)}
.ks-hero-seal{position:absolute;top:-1.4rem;right:-1.2rem;z-index:3}
.ks-hero-tag{position:absolute;bottom:1.3rem;left:-1.2rem;z-index:3;display:flex;align-items:center;gap:.55rem;font-size:.82rem;color:var(--ks-ink);background:var(--ks-surface);border:1px solid var(--ks-line);padding:.7rem 1.05rem;border-radius:9px;box-shadow:0 14px 30px var(--ks-shadow)}
.ks-hero-tag b{font-family:${DISPLAY};color:var(--ks-accentDeep);font-weight:700;font-size:1.02rem}
@media(max-width:860px){
  .ks-hero{grid-template-columns:1fr;min-height:unset;padding:7.5rem 7vw 3.5rem;text-align:center}
  .ks-hero-title{font-size:clamp(2.4rem,11vw,3.6rem)}
  .ks-hero-media{order:-1;margin-bottom:1.2rem}
  .ks-hero-frame{max-width:290px;aspect-ratio:1/1.05}
  .ks-hero-sub{margin-left:auto;margin-right:auto}
  .ks-hero-btns,.ks-hero-meta,.ks-hero-ew{justify-content:center}
  .ks-hero-tag{left:50%;transform:translateX(-50%)}
}
@media(max-width:560px){.ks-nav{padding:1rem 6vw}.ks-nav-cta{padding:.6rem 1rem;font-size:.74rem}.ks-hero-seal{width:auto}.ks-seal{width:4.4rem;height:4.4rem}}

/* HALFTONE BAND — dot-screen + kata apotek (ganti marquee) */
.ks-halftone{position:relative;background:var(--ks-accentDeep);color:var(--ks-onAccent);padding:1.4rem 7vw;overflow:hidden}
.ks-halftone::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(247,241,226,.5) 1px,transparent 1px);background-size:9px 9px;opacity:.16;pointer-events:none}
.ks-halftone-row{position:relative;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.8rem 1.6rem}
.ks-halftone-item{font-family:${DISPLAY};font-size:.82rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;display:flex;align-items:center;gap:1.6rem}
.ks-halftone-item::after{content:'✦';font-size:.6rem;color:var(--ks-accent);opacity:.9}
.ks-halftone-item:last-child::after{display:none}

/* SECTION COMMONS */
.ks-section{padding:clamp(4.5rem,9vw,8rem) 7vw}
.ks-eyebrow{font-size:.74rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ks-accentDeep);margin-bottom:1rem;display:inline-flex;align-items:center;gap:.6rem}
.ks-eyebrow::before{content:'';width:1.6rem;height:2px;background:var(--ks-accent)}
.ks-heading{font-family:${DISPLAY};font-size:clamp(2rem,3.8vw,3.2rem);font-weight:600;color:var(--ks-ink);line-height:1.15;letter-spacing:-.01em;text-wrap:balance}
.ks-subtext{color:var(--ks-inkDim);font-size:1.02rem;margin-top:1rem;max-width:56ch;line-height:1.85}
.ks-sec-hdr{margin-bottom:3.4rem;max-width:60ch}

/* FEATURES — "Khasiat & Mutu": kartu label bernomor */
.ks-feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem}
.ks-feat-card{position:relative;padding:2rem 1.6rem;background:var(--ks-surface);border:1px solid var(--ks-line);border-radius:12px;transition:transform .35s ${EASE},box-shadow .35s,border-color .35s}
.ks-feat-card:hover{transform:translateY(-5px);box-shadow:0 20px 44px var(--ks-shadow);border-color:rgba(168,102,26,.4)}
.ks-feat-idx{font-family:${DISPLAY};font-size:1.05rem;font-weight:700;color:var(--ks-accentDeep);width:2.6rem;height:2.6rem;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--ks-accent);border-radius:8px;margin-bottom:1.3rem}
.ks-feat-title{font-family:${DISPLAY};font-size:1.22rem;font-weight:600;color:var(--ks-ink);margin-bottom:.5rem;line-height:1.3}
.ks-feat-desc{font-size:.9rem;color:var(--ks-muted);line-height:1.75}
@media(max-width:900px){.ks-feat-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.ks-feat-grid{grid-template-columns:1fr}}

/* STATEMENT — proklamasi apotek (slab tegas, BUKAN quote italic sinematik) */
.ks-statement{background:var(--ks-bg2);padding:clamp(4.5rem,8vw,7rem) 7vw;text-align:center;position:relative;overflow:hidden}
.ks-statement::before{content:'';position:absolute;inset:0;background-image:radial-gradient(var(--ks-ink) 1px,transparent 1px);background-size:16px 16px;opacity:.035;pointer-events:none}
.ks-stmt-inner{position:relative;max-width:52ch;margin:0 auto}
.ks-stmt-seal{display:flex;justify-content:center;margin-bottom:1.6rem}
.ks-stmt-ew{font-size:.74rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ks-accentDeep);margin-bottom:1.2rem}
.ks-stmt-quote{font-family:${DISPLAY};font-size:clamp(1.55rem,3vw,2.45rem);font-weight:600;color:var(--ks-ink);line-height:1.32;letter-spacing:-.01em}
.ks-stmt-cite{display:block;font-size:.82rem;color:var(--ks-muted);letter-spacing:.04em;margin-top:1.4rem}

/* SHOWCASE — signature: kartu LABEL APOTEK (perforasi + segel) + quick-look */
.ks-showcase{background:var(--ks-bg2)}
.ks-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.5rem,3vw,2.2rem)}
/* Mode sparse (pelajaran #132): 1–2 produk → grid simetris terpusat, bukan kolom kosong. */
.ks-grid[data-count="1"]{grid-template-columns:minmax(0,400px);justify-content:center}
.ks-grid[data-count="2"]{grid-template-columns:repeat(2,minmax(0,360px));justify-content:center;max-width:840px;margin:0 auto}
.ks-card{position:relative;cursor:pointer;background:var(--ks-surface);border:1px solid var(--ks-line);border-radius:12px;overflow:hidden;transition:transform .4s ${EASE},box-shadow .4s ${EASE}}
.ks-card:hover{transform:translateY(-6px);box-shadow:0 26px 54px var(--ks-shadow)}
.ks-card-frame{position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--ks-surface2)}
.ks-card-frame img{width:100%;height:100%;object-fit:cover;transition:transform .6s ${EASE}}
.ks-card:hover .ks-card-frame img{transform:scale(1.05)}
.ks-card-cat{position:absolute;top:.9rem;left:.9rem;z-index:2;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ks-onAccent);background:var(--ks-accentDeep);padding:.3rem .6rem;border-radius:5px}
.ks-card-seal{position:absolute;bottom:.7rem;right:.7rem;z-index:3;transform:rotate(-9deg) scale(.58);transform-origin:bottom right;filter:drop-shadow(0 4px 10px var(--ks-shadowDeep))}
.ks-card-body{position:relative;padding:1.5rem 1.3rem 1.4rem}
.ks-card-perf{position:absolute;top:0;left:1rem;right:1rem;border-top:2px dotted var(--ks-line)}
.ks-card-name{font-family:${DISPLAY};font-size:1.24rem;font-weight:600;color:var(--ks-ink);margin-bottom:.3rem;line-height:1.25}
.ks-card-desc{font-size:.85rem;color:var(--ks-muted);margin-bottom:.85rem;line-height:1.65;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ks-card-foot{display:flex;align-items:center;gap:.7rem}
.ks-card-price{font-family:${DISPLAY};font-size:1.18rem;font-weight:700;color:var(--ks-accentDeep)}
.ks-card-sep{flex:1;border-bottom:1px dotted var(--ks-line)}
.ks-card-ql{font-size:.72rem;font-weight:600;letter-spacing:.04em;color:var(--ks-muted);transition:color .3s}
.ks-card:hover .ks-card-ql{color:var(--ks-accentDeep)}
@media(max-width:980px){.ks-grid{grid-template-columns:repeat(2,1fr)}.ks-grid[data-count="1"]{grid-template-columns:minmax(0,400px)}}
@media(max-width:560px){.ks-grid,.ks-grid[data-count="1"],.ks-grid[data-count="2"]{grid-template-columns:1fr;max-width:360px;margin:0 auto}}

/* ABOUT — kisah, split + bingkai + segel */
.ks-about{background:var(--ks-bg)}
.ks-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:center}
.ks-about-inner.ks-about-solo{grid-template-columns:1fr;max-width:60ch;margin:0 auto;text-align:center}
.ks-about-solo .ks-eyebrow{justify-content:center}
.ks-about-solo .ks-about-body{margin-left:auto;margin-right:auto;max-width:56ch}
.ks-about-body{font-size:1.02rem;color:var(--ks-inkDim);line-height:1.95;margin-top:1.2rem;white-space:pre-line}
.ks-about-cta{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.8rem;font-size:.86rem;font-weight:600;letter-spacing:.02em;color:var(--ks-accentDeep);text-decoration:none;border-bottom:2px solid var(--ks-accent);padding-bottom:3px;transition:gap .3s}
.ks-about-cta:hover{gap:.85rem}
.ks-about-img{position:relative}
.ks-about-frame{position:relative;z-index:1;aspect-ratio:4/5;box-shadow:0 30px 64px var(--ks-shadowDeep)}
.ks-about-frame .ks-frame{width:100%;height:100%}
.ks-about-seal{position:absolute;z-index:2;bottom:-1.4rem;left:-1.2rem}
@media(max-width:840px){.ks-about-inner{grid-template-columns:1fr;gap:3rem}.ks-about-img{order:-1;max-width:360px;margin:0 auto}}

/* STATS — angka slab ber-countUp */
.ks-stats{background:var(--ks-bg2);border-top:1px solid var(--ks-line2);border-bottom:1px solid var(--ks-line2)}
.ks-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;text-align:center}
.ks-stat-num{font-family:${DISPLAY};font-size:clamp(2.4rem,4.6vw,3.4rem);font-weight:700;color:var(--ks-ink);line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.ks-stat-label{font-size:.78rem;color:var(--ks-muted);letter-spacing:.06em;margin-top:.8rem}
@media(max-width:560px){.ks-stats-grid{grid-template-columns:repeat(2,1fr);gap:2.2rem}}

/* TESTIMONIALS — carousel scroll-snap (lx-tcar) */
.ks-testimonials{background:var(--ks-bg)}
.ks-tcar{position:relative}
.ks-tcar-track{display:flex;gap:1.3rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .25rem 1.5rem;-ms-overflow-style:none;scrollbar-width:none}
.ks-tcar-track::-webkit-scrollbar{display:none}
.ks-test-card{scroll-snap-align:start;background:var(--ks-surface);border:1px solid var(--ks-line);border-radius:14px;padding:2rem;min-width:300px;max-width:360px;flex:0 0 auto;box-shadow:0 12px 30px var(--ks-shadow)}
.ks-test-mark{font-family:${DISPLAY};font-size:2.6rem;font-weight:700;color:var(--ks-accent);opacity:.45;line-height:.5;margin-bottom:.6rem}
.ks-test-quote{font-size:1rem;color:var(--ks-inkDim);line-height:1.7;margin:0 0 1.4rem}
.ks-test-name{font-family:${DISPLAY};font-weight:600;font-size:1rem;color:var(--ks-ink)}
.ks-test-role{font-size:.78rem;color:var(--ks-muted);margin-top:.2rem}
.ks-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1.1rem;margin-top:1.5rem}
.ks-tcar-btn{width:44px;height:44px;border-radius:50%;background:var(--ks-surface);border:1px solid var(--ks-line);color:var(--ks-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s,border-color .25s,opacity .25s}
.ks-tcar-btn:hover:not(:disabled){background:var(--ks-accentDeep);color:var(--ks-onAccent);border-color:var(--ks-accentDeep)}
.ks-tcar-btn:disabled{opacity:.3;cursor:default}
.ks-tcar-dots{display:flex;gap:.5rem;align-items:center}
.ks-dot{width:7px;height:7px;border-radius:50%;background:var(--ks-line);border:none;padding:0;cursor:pointer;transition:background .25s,transform .25s}
.ks-dot[aria-current="true"]{background:var(--ks-accent);transform:scale(1.5)}

/* FAQ */
.ks-faq{background:var(--ks-bg2)}
.ks-faq-wrap{max-width:760px;margin:0 auto}
.ks-faq-item{border-bottom:1px solid var(--ks-line)}
.ks-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.5rem 0;cursor:pointer;font-family:${DISPLAY};font-size:1.15rem;font-weight:600;color:var(--ks-ink);background:none;border:none;text-align:left}
.ks-faq-q:focus-visible{outline:2px solid var(--ks-accentDeep);outline-offset:3px;border-radius:3px}
.ks-faq-icon{font-size:1.3rem;color:var(--ks-accentDeep);flex-shrink:0;transition:transform .3s ${EASE};line-height:1}
.ks-faq-icon.open{transform:rotate(45deg)}
.ks-faq-a{font-size:.96rem;color:var(--ks-inkDim);line-height:1.85;padding-bottom:1.5rem;max-width:64ch}

/* CTA — panel kraft + perforasi + segel */
.ks-cta{background:var(--ks-bg)}
.ks-cta-inner{position:relative;background:var(--ks-bg2);border:1px solid var(--ks-line);border-radius:18px;padding:clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem);text-align:center;overflow:hidden}
.ks-cta-inner::before{content:'';position:absolute;inset:0;background-image:radial-gradient(var(--ks-accent) 1px,transparent 1px);background-size:16px 16px;opacity:.06;pointer-events:none}
.ks-cta-seal{position:relative;display:flex;justify-content:center;margin-bottom:1.4rem}
.ks-cta-title{position:relative;font-family:${DISPLAY};font-size:clamp(2rem,4.4vw,3.2rem);font-weight:600;color:var(--ks-ink);margin-bottom:1rem;line-height:1.16;letter-spacing:-.01em;text-wrap:balance}
.ks-cta-sub{position:relative;font-size:1.05rem;color:var(--ks-inkDim);max-width:48ch;margin:0 auto 2.4rem;line-height:1.85}
.ks-cta-btns{position:relative;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}

/* BAND ADD-ON */
.ks-band{background:var(--ks-surface);border-top:1px solid var(--ks-line2);border-bottom:1px solid var(--ks-line2);padding:3.5rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.5rem}
.ks-band-ew{font-size:.72rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--ks-accentDeep);margin-bottom:.55rem}
.ks-band .ks-heading{font-size:clamp(1.5rem,2.4vw,2.1rem)}
.ks-band-sub{color:var(--ks-muted);font-size:.96rem;line-height:1.7;margin-top:.55rem;max-width:56ch}

/* FOOTER */
.ks-footer{background:var(--ks-bg2);color:var(--ks-inkDim);padding:4.5rem 7vw 2.5rem;border-top:1px solid var(--ks-line)}
.ks-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.8rem}
.ks-footer-brand{font-family:${DISPLAY};font-size:1.7rem;font-weight:700;color:var(--ks-ink);margin-bottom:.9rem;display:flex;align-items:center;gap:.55rem}
.ks-footer-brand::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--ks-accent);box-shadow:0 0 0 3px var(--ks-bg2),0 0 0 4px var(--ks-accentDeep)}
.ks-footer-tagline{font-size:.9rem;color:var(--ks-muted);line-height:1.75;max-width:34ch}
.ks-footer-h{font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ks-ink);margin-bottom:1.1rem}
.ks-footer-link{display:block;font-size:.9rem;color:var(--ks-inkDim);text-decoration:none;margin-bottom:.6rem;transition:color .25s}
.ks-footer-link:hover{color:var(--ks-accentDeep)}
.ks-footer-copy{border-top:1px solid var(--ks-line);padding-top:1.6rem;font-size:.8rem;color:var(--ks-muted);text-align:center}
@media(max-width:768px){.ks-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* REVEAL — via LUX_JS (.lx-reveal → .lx-in), digate .lx-js: tanpa JS / sample
   statis = tampil penuh (kontrak lux-script, pelajaran #138). */
.lx-js .ks-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ${EASE},transform .7s ${EASE}}
.lx-js .ks-rv.lx-in{opacity:1;transform:none}
.ks-rv-d1{transition-delay:.08s}.ks-rv-d2{transition-delay:.16s}.ks-rv-d3{transition-delay:.24s}.ks-rv-d4{transition-delay:.32s}

/* LIGHTBOX — ks-root overrides palet lx-lb (kraft/heritage) */
.ks-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.ks-root .lx-lb[hidden]{display:none}
.ks-root .lx-lb-back{position:absolute;inset:0;background:rgba(33,39,26,.46);backdrop-filter:blur(6px);border:0;cursor:pointer}
.ks-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--ks-surface);border:1px solid var(--ks-line);border-radius:18px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .42s ${EASE},transform .42s ${EASE}}
.ks-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.ks-root .lx-lb-media{position:relative;overflow:hidden;background:var(--ks-surface2);min-height:300px}
.ks-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ks-root .lx-lb-body{padding:clamp(22px,3vw,42px);display:flex;flex-direction:column;gap:9px;justify-content:center}
.ks-root .lx-lb-cat{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ks-accentDeep)}
.ks-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(22px,2.6vw,30px);font-weight:600;line-height:1.2;color:var(--ks-ink)}
.ks-root .lx-lb-price{font-family:${DISPLAY};font-size:20px;font-weight:700;color:var(--ks-accentDeep)}
.ks-root .lx-lb-desc{color:var(--ks-muted);font-size:13.5px;line-height:1.8}
.ks-root .lx-lb-cta{margin-top:14px;width:fit-content;display:inline-flex;align-items:center;background:var(--ks-accentDeep);color:var(--ks-onAccent);font-size:13px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;letter-spacing:.02em;transition:background .25s}
.ks-root .lx-lb-cta:hover{background:var(--ks-ink)}
.ks-root .lx-lb-x{position:absolute;top:12px;right:12px;z-index:3;width:40px;height:40px;border-radius:50%;background:var(--ks-surface);border:1px solid var(--ks-line);color:var(--ks-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.ks-root .lx-lb-x:hover{background:var(--ks-accentDeep);color:var(--ks-onAccent);border-color:var(--ks-accentDeep)}
.ks-root .lx-lb-prev,.ks-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:40px;height:40px;border-radius:50%;background:var(--ks-surface);border:1px solid var(--ks-line);color:var(--ks-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.ks-root .lx-lb-prev:hover,.ks-root .lx-lb-next:hover{background:var(--ks-accentDeep);color:var(--ks-onAccent)}
.ks-root .lx-lb-prev{left:8px}.ks-root .lx-lb-next{right:8px}
@media(max-width:640px){.ks-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.ks-root .lx-lb-media{min-height:230px}}

/* ── RASA polish ── */
.ks-btn-primary:active,.ks-nav-cta:active{transform:translateY(0) scale(.97)}
.ks-card:active{transform:translateY(-3px) scale(.994)}
.ks-tcar-btn:active{transform:scale(.94)}
.ks-nav-cta:focus-visible,.ks-btn-primary:focus-visible,.ks-btn-ghost:focus-visible,.ks-about-cta:focus-visible,.ks-footer-link:focus-visible,.ks-card:focus-visible,.ks-tcar-btn:focus-visible,.ks-dot:focus-visible,.ks-cta-btns a:focus-visible{outline:2px solid var(--ks-accentDeep);outline-offset:3px}
.ks-hero-sub,.ks-subtext,.ks-about-body,.ks-cta-sub,.ks-feat-desc,.ks-test-quote{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Kosakata herbal (kategori/bahan) — BUKAN klaim verifiable, karena tampil di
// SEMUA situs Jamu. Klaim spesifik (murni/teruji/tanpa pengawet) milik tiap klien
// → ditaruh di konten yang bisa mereka edit (fitur/stats), bukan di-hardcode.
const HALFTONE = ['Herbal', 'Rempah', 'Ramuan', 'Akar & Daun', 'Madu']

function Seal() {
  return (
    <span className="ks-seal" aria-hidden>
      <b>Racikan</b>
      <i>Herbal</i>
    </span>
  )
}

export default function KesehatanLuxRenderer({ content: c, variant = 'jamu' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.jamu
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa}` : '#wa'
  const hero = c.hero ?? {}
  const items = c.showcase?.items ?? []
  const features = c.features ?? []
  const stats = c.stats ?? []
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []

  const rootStyle = {
    '--ks-bg': p.bg, '--ks-bg2': p.bg2, '--ks-surface': p.surface, '--ks-surface2': p.surface2,
    '--ks-ink': p.ink, '--ks-inkDim': p.inkDim, '--ks-muted': p.muted,
    '--ks-accent': p.accent, '--ks-accentDeep': p.accentDeep, '--ks-onAccent': p.onAccent,
    '--ks-line': p.line, '--ks-line2': p.line2, '--ks-shadow': p.shadow, '--ks-shadowDeep': p.shadowDeep,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const words = (hero.title ?? '').split(' ')

  return (
    <div className="ks-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: ksCss() }} />

      {/* NAV */}
      <nav className="ks-nav" aria-label="Navigasi utama">
        <span className="ks-nav-logo">{c.nama ?? 'Jamu'}</span>
        <a href={waUrl} className="ks-nav-cta">Tanya Produk</a>
      </nav>

      {/* HERO */}
      <section className="ks-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="ks-hero-text">
          {hero.eyebrow && <p className="ks-hero-ew">{hero.eyebrow}</p>}
          {hero.title && (
            <h1 className="ks-hero-title" aria-label={hero.title}>
              {words.map((w, i) => (
                <span key={i} style={{ '--ks-d': `${160 + i * 70}ms` } as React.CSSProperties}>
                  {w}{' '}
                </span>
              ))}
            </h1>
          )}
          {hero.subtitle && <p className="ks-hero-sub">{hero.subtitle}</p>}
          <div className="ks-hero-btns">
            {hero.ctaHref && (
              <a href={hero.ctaHref} className="ks-btn-primary lx-mag">{hero.ctaText ?? 'Lihat Produk'}</a>
            )}
            <a href={hero.ctaHref2 ?? waUrl} className="ks-btn-ghost">{hero.ctaText2 ?? 'Konsultasi'}</a>
          </div>
          {stats.length > 0 && (
            <div className="ks-hero-meta">
              {stats.slice(0, 3).map((s, i) => (
                <div key={i} className="ks-meta-item">
                  <span className="ks-meta-num">{s.angka}</span>
                  <span className="ks-meta-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {hero.image && (
          <div className="ks-hero-media">
            <div className="ks-hero-frame">
              <div className="ks-frame">
                <img
                  src={hero.image}
                  alt={c.nama ?? 'Produk herbal'}
                  loading="eager"
                  style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
                />
              </div>
              <span className="ks-hero-seal"><Seal /></span>
              {stats[0] && (
                <div className="ks-hero-tag"><b>{stats[0].angka}</b> {stats[0].label}</div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* HALFTONE BAND */}
      <div className="ks-halftone" aria-hidden="true">
        <div className="ks-halftone-row">
          {HALFTONE.map((m, i) => (
            <span key={i} className="ks-halftone-item">{m}</span>
          ))}
        </div>
      </div>

      {/* FEATURES — Khasiat & Mutu */}
      {features.length > 0 && (
        <section className="ks-section" id="khasiat">
          <div className="ks-sec-hdr ks-rv lx-reveal">
            <p className="ks-eyebrow">{c.featuresEyebrow ?? 'Khasiat & Mutu'}</p>
            {c.featuresTitle && <h2 className="ks-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="ks-feat-grid">
            {features.slice(0, 4).map((f, i) => (
              <div key={i} className={`ks-feat-card ks-rv lx-reveal ks-rv-d${i + 1}`}>
                <div className="ks-feat-idx">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="ks-feat-title">{f.title}</h3>
                <p className="ks-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT — proklamasi apotek */}
      {c.statement && (
        <div className="ks-statement">
          <div className="ks-stmt-inner ks-rv lx-reveal">
            <div className="ks-stmt-seal"><Seal /></div>
            {c.statement.eyebrow && <p className="ks-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="ks-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="ks-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* SHOWCASE — kartu label apotek (signature) */}
      {items.length > 0 && (
        <section className="ks-section ks-showcase" id="produk">
          <div className="ks-sec-hdr ks-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.4rem' }}>
            <p className="ks-eyebrow" style={{ justifyContent: 'center' }}>Etalase</p>
            {c.showcase?.title && <h2 className="ks-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="ks-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{c.showcase.subtitle}</p>}
          </div>
          <div className="ks-grid lx-look" data-count={items.length}>
            {items.map((item, i) => (
              <article
                key={i}
                className="ks-card lx-lb-open ks-rv lx-reveal"
                style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
                data-cat={item.kategori ?? ''}
                data-src={item.gambar ?? ''}
                data-title={item.nama}
                data-price={fmt(item.harga ?? 0)}
                data-desc={item.desc ?? ''}
                data-href={waUrl}
                role="button"
                tabIndex={0}
                aria-label={`${item.nama} — ${fmt(item.harga ?? 0)}`}
              >
                <div className="ks-card-frame">
                  {item.kategori && <span className="ks-card-cat">{item.kategori}</span>}
                  {item.gambar && <img src={item.gambar} alt={item.nama} loading="lazy" />}
                  <span className="ks-card-seal"><Seal /></span>
                </div>
                <div className="ks-card-body">
                  <span className="ks-card-perf" aria-hidden />
                  <h3 className="ks-card-name">{item.nama}</h3>
                  {item.desc && <p className="ks-card-desc">{item.desc}</p>}
                  <div className="ks-card-foot">
                    <span className="ks-card-price">{fmt(item.harga ?? 0)}</span>
                    <span className="ks-card-sep" aria-hidden />
                    <span className="ks-card-ql">Lihat detail</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT — Kisah */}
      {c.about && (
        <section className="ks-section ks-about" id="tentang">
          <div className={`ks-about-inner${c.about.image ? '' : ' ks-about-solo'}`}>
            <div className="ks-rv lx-reveal">
              <p className="ks-eyebrow">Kisah Kami</p>
              <h2 className="ks-heading">{c.about.title}</h2>
              <p className="ks-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="ks-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="ks-about-img ks-rv lx-reveal ks-rv-d2">
                <div className="ks-about-frame">
                  <div className="ks-frame">
                    <img src={c.about.image} alt={c.about.title} loading="lazy" />
                  </div>
                </div>
                <span className="ks-about-seal"><Seal /></span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="ks-section ks-stats">
          <div className="ks-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`ks-rv lx-reveal ks-rv-d${i + 1}`}>
                <div className="ks-stat-num" data-cu>{s.angka}</div>
                <div className="ks-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="ks-section ks-testimonials" id="ulasan">
          <div className="ks-sec-hdr ks-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="ks-eyebrow" style={{ justifyContent: 'center' }}>Ulasan</p>
            <h2 className="ks-heading">Kata Pelanggan</h2>
          </div>
          <div className="ks-tcar lx-tcar">
            <div className="ks-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="ks-test-card">
                  <div className="ks-test-mark" aria-hidden>&ldquo;</div>
                  <p className="ks-test-quote">{t.quote}</p>
                  <p className="ks-test-name">{t.nama}</p>
                  {t.peran && <p className="ks-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="ks-tcar-ctrl">
                <button className="ks-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="ks-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="ks-dot lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="ks-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="ks-section ks-faq" id="faq">
          <div className="ks-sec-hdr ks-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="ks-eyebrow" style={{ justifyContent: 'center' }}>Pertanyaan</p>
            <h2 className="ks-heading">Sering Ditanyakan</h2>
          </div>
          <div className="ks-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="ks-faq-item">
                <button
                  className="ks-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`ks-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="ks-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="ks-section ks-cta" id="pesan">
          <div className="ks-cta-inner ks-rv lx-reveal">
            <div className="ks-cta-seal"><Seal /></div>
            <h2 className="ks-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="ks-cta-sub">{c.cta.subtitle}</p>}
            <div className="ks-cta-btns">
              <a href={waUrl} className="ks-btn-primary lx-mag">{c.cta.ctaText ?? 'Pesan via WhatsApp'}</a>
              {hero.ctaHref && (
                <a href={hero.ctaHref} className="ks-btn-ghost">Lihat Produk</a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON */}
      {(c.bands ?? []).map((b, i) => (
        <section className="ks-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="ks-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="ks-heading">{b.title}</h2>
            {b.subtitle && <p className="ks-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="ks-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="ks-footer">
        <div className="ks-footer-grid">
          <div>
            <p className="ks-footer-brand">{c.nama ?? 'Jamu'}</p>
            <p className="ks-footer-tagline">
              {hero.eyebrow ?? `${c.nama ?? 'Jamu'} — apotek herbal pilihan Anda.`}
            </p>
          </div>
          <div>
            <p className="ks-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="ks-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="ks-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="ks-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="ks-footer-h">Jam Buka</p>
            {c.info?.jam
              ? c.info.jam.map((j, i) => (
                  <p key={i} className="ks-footer-link">{j.hari}: {j.jam}</p>
                ))
              : (
                <>
                  <p className="ks-footer-link">Senin–Sabtu: 08.00–17.00</p>
                  <p className="ks-footer-link">Minggu: Tutup</p>
                </>
              )}
          </div>
        </div>
        <p className="ks-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Jamu'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX — JS-driven via LUX_JS */}
      <BespokeLightbox ctaText="Pesan via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
