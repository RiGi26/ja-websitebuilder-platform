'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// HANGAT — Restaurant Warung / Kedai Bespoke Lux Renderer (Folk Warmth)
// Industri RESTORAN (source: menu) — tanpa keranjang.
// Caprasimo (display, chunky-rounded serif) + Karla (body) |
// Cream #FBF3E4 · #F3E7CF/#F0E4CC · ink coklat-gelap #2B1A12 |
// accent brick-red #C0432E / accentDeep #9A3322 · pop mustard #E0A93C |
// signature: "banderol" — label HARGA bentuk tag kertas miring di tiap menu +
//   spanduk hangat | ns: wr-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.wr-*`.
// Light palette → contrast.test menjaga WCAG (ink AAA, brick accentDeep ≥4.5,
// ink ≥4.5 di atas mustard). Merakyat-hangat — sengaja beda dari toko-kuliner
// (Newsreader/menu-board) & restaurant-lux (Cormorant/gelap-emas-sinematik).
// ============================================================

export interface WrPal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentDeep: string; onAccent: string
  line: string; line2: string; shadow: string; shadowDeep: string
}

export const PALETTES: Record<string, WrPal> = {
  // Hangat — cream hangat, tinta coklat, aksen bata, mustard pop.
  hangat: {
    bg: '#FBF3E4', bg2: '#F3E7CF', surface: '#FFFBF2', surface2: '#F0E4CC',
    ink: '#2B1A12', inkDim: '#4A3326', muted: '#6E5240',
    accent: '#C0432E', accentDeep: '#9A3322', onAccent: '#FFFBF2',
    line: 'rgba(43,26,18,.14)', line2: 'rgba(43,26,18,.08)',
    shadow: 'rgba(43,26,18,.1)', shadowDeep: 'rgba(43,26,18,.2)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Caprasimo&family=Karla:wght@300;400;500;600;700&display=swap'
const DISPLAY = '"Caprasimo","Cooper Black",Georgia,serif'
const BODY = '"Karla","Segoe UI",system-ui,sans-serif'
const EASE = 'cubic-bezier(.22,1,.36,1)'
const BOUNCE = 'cubic-bezier(.34,1.4,.64,1)'
const MUSTARD = '#E0A93C'

function wrCss(): string {
  return `
@import url('${FONT_IMPORT}');
html,body{overflow-x:hidden;max-width:100%}
.wr-root{font-family:${BODY};color:var(--wr-ink);background:var(--wr-bg);line-height:1.7;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.wr-root *,.wr-root *::before,.wr-root *::after{box-sizing:border-box;margin:0;padding:0}
.wr-root img{max-width:100%;height:auto;display:block}
.wr-root ::selection{background:rgba(192,67,46,.2);color:var(--wr-ink)}

/* NAV */
.wr-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.1rem 7vw;display:flex;align-items:center;justify-content:space-between;transition:background .45s,box-shadow .45s,backdrop-filter .45s,padding .45s}
.wr-root.lx-scrolled .wr-nav{background:rgba(251,243,228,.9);backdrop-filter:blur(10px);box-shadow:0 2px 0 var(--wr-line2);padding-top:.8rem;padding-bottom:.8rem}
.wr-nav-logo{font-family:${DISPLAY};color:var(--wr-ink);font-size:1.6rem;text-decoration:none;letter-spacing:.005em}
.wr-nav-cta{font-family:${DISPLAY};font-size:.86rem;color:var(--wr-onAccent);background:var(--wr-accentDeep);padding:.66rem 1.5rem;border-radius:999px;text-decoration:none;transition:transform .3s ${BOUNCE},background .3s}
.wr-nav-cta:hover{transform:translateY(-2px) rotate(-1deg);background:var(--wr-ink)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO — spanduk hangat: teks + foto */
.wr-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:clamp(2rem,5vw,4.5rem);padding:8.5rem 7vw 4.5rem;background:var(--wr-bg)}
.wr-hero-text{position:relative;z-index:2}
.wr-hero-ew{font-family:${DISPLAY};font-size:.92rem;color:var(--wr-accentDeep);margin-bottom:1.1rem;display:inline-flex;align-items:center;gap:.5rem;background:${MUSTARD};color:var(--wr-ink);padding:.4rem 1.1rem;border-radius:999px;transform:rotate(-1.5deg)}
.wr-hero-title{font-family:${DISPLAY};font-size:clamp(2.8rem,6.4vw,5.2rem);line-height:1.02;color:var(--wr-ink);margin-bottom:1.3rem;letter-spacing:.005em}
.wr-hero-title em{font-style:normal;color:var(--wr-accentDeep);position:relative;white-space:nowrap}
.wr-hero-title em::after{content:'';position:absolute;left:-.02em;right:-.02em;bottom:.04em;height:.2em;background:${MUSTARD};border-radius:999px;z-index:-1}
.wr-hero-sub{font-size:1.1rem;color:var(--wr-inkDim);margin-bottom:2rem;max-width:44ch;line-height:1.8}
.wr-hero-btns{display:flex;gap:.9rem;flex-wrap:wrap;align-items:center;margin-bottom:2.3rem}
.wr-btn-primary{font-family:${DISPLAY};font-size:.95rem;background:var(--wr-accentDeep);color:var(--wr-onAccent);padding:.95rem 2rem;border-radius:999px;text-decoration:none;transition:transform .3s ${BOUNCE},background .3s,box-shadow .3s;box-shadow:0 8px 20px var(--wr-shadow)}
.wr-btn-primary:hover{transform:translateY(-3px) rotate(-1deg);background:var(--wr-ink);box-shadow:0 14px 30px var(--wr-shadowDeep)}
.wr-btn-ghost{font-family:${DISPLAY};font-size:.95rem;color:var(--wr-ink);padding:.95rem 1.5rem;text-decoration:none;border-radius:999px;border:2px solid var(--wr-line);transition:border-color .3s,color .3s,transform .3s ${BOUNCE}}
.wr-btn-ghost:hover{border-color:var(--wr-accent);color:var(--wr-accentDeep);transform:translateY(-2px)}
.wr-hero-meta{display:flex;flex-wrap:wrap;gap:1.8rem}
.wr-meta-item{display:flex;flex-direction:column;gap:.1rem}
.wr-meta-num{font-family:${DISPLAY};font-size:1.7rem;color:var(--wr-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.wr-meta-label{font-size:.78rem;color:var(--wr-muted);font-weight:600}
.wr-hero-media{position:relative;z-index:1}
.wr-hero-frame{position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:28px;background:var(--wr-surface2);box-shadow:0 28px 60px var(--wr-shadowDeep);transform:rotate(1.5deg)}
.wr-hero-frame img{width:100%;height:100%;object-fit:cover}
.wr-hero-stamp{position:absolute;left:-1rem;bottom:1.5rem;z-index:3;background:${MUSTARD};color:var(--wr-ink);font-family:${DISPLAY};font-size:.95rem;padding:.8rem 1.3rem;border-radius:14px;transform:rotate(-3deg);box-shadow:0 12px 28px var(--wr-shadowDeep);display:flex;align-items:center;gap:.45rem}
@media(max-width:880px){
  .wr-hero{grid-template-columns:1fr;min-height:unset;padding:7rem 7vw 3rem}
  .wr-hero-media{order:-1;max-width:400px;margin:0 auto}
  .wr-hero-title{font-size:clamp(2.5rem,10vw,3.6rem)}
}
@media(max-width:560px){.wr-nav{padding:.9rem 6vw}.wr-hero-stamp{left:0}}

/* PITA — kata warung hangat (BUKAN klaim) */
.wr-ribbon{background:var(--wr-accentDeep);padding:1rem 7vw;overflow:hidden}
.wr-ribbon-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.7rem 1.6rem}
.wr-ribbon-item{font-family:${DISPLAY};font-size:1.05rem;color:#FCEBD2;display:inline-flex;align-items:center;gap:.7rem}
.wr-ribbon-item::after{content:'●';color:${MUSTARD};font-size:.5rem}
.wr-ribbon-item:last-child::after{display:none}

/* SECTION COMMONS */
.wr-section{padding:clamp(4.2rem,8vw,7rem) 7vw}
.wr-eyebrow{font-family:${DISPLAY};font-size:.95rem;color:var(--wr-accentDeep);margin-bottom:.85rem;display:inline-flex;align-items:center;gap:.5rem}
.wr-eyebrow::before{content:'';width:1.6rem;height:4px;border-radius:999px;background:${MUSTARD}}
.wr-heading{font-family:${DISPLAY};font-size:clamp(2.1rem,4vw,3.2rem);color:var(--wr-ink);line-height:1.1;letter-spacing:.005em;text-wrap:balance}
.wr-subtext{color:var(--wr-inkDim);font-size:1.04rem;margin-top:.9rem;max-width:54ch;line-height:1.8}
.wr-sec-hdr{margin-bottom:3.2rem;max-width:60ch}

/* FEATURES — kartu hangat */
.wr-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
.wr-feat-card{padding:2.2rem 1.8rem;background:var(--wr-surface);border:2px solid var(--wr-line2);border-radius:22px;transition:transform .35s ${BOUNCE},box-shadow .35s,border-color .35s}
.wr-feat-card:hover{transform:translateY(-5px) rotate(-.5deg);box-shadow:0 20px 42px var(--wr-shadow);border-color:var(--wr-accent)}
.wr-feat-idx{font-family:${DISPLAY};font-size:1.4rem;color:var(--wr-ink);width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;border-radius:50%;background:${MUSTARD};margin-bottom:1.1rem}
.wr-feat-title{font-family:${DISPLAY};font-size:1.4rem;color:var(--wr-ink);margin-bottom:.45rem;line-height:1.2}
.wr-feat-desc{font-size:.92rem;color:var(--wr-muted);line-height:1.75}
@media(max-width:820px){.wr-feat-grid{grid-template-columns:1fr}}

/* SHOWCASE MENU — kartu menu + BANDEROL harga (signature) */
.wr-showcase{background:var(--wr-bg2)}
.wr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.4rem,3vw,2.1rem)}
.wr-grid[data-count="1"]{grid-template-columns:minmax(0,380px);justify-content:center}
.wr-grid[data-count="2"]{grid-template-columns:repeat(2,minmax(0,360px));justify-content:center;max-width:820px;margin:0 auto}
.wr-card{position:relative;cursor:pointer;background:var(--wr-surface);border:2px solid var(--wr-line2);border-radius:22px;overflow:hidden;transition:transform .4s ${BOUNCE},box-shadow .4s,border-color .4s}
.wr-card:hover{transform:translateY(-6px);box-shadow:0 26px 52px var(--wr-shadow);border-color:var(--wr-accent)}
.wr-card-frame{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--wr-surface2)}
.wr-card-frame img{width:100%;height:100%;object-fit:cover;transition:transform .6s ${EASE}}
.wr-card:hover .wr-card-frame img{transform:scale(1.06)}
.wr-card-cat{position:absolute;top:.8rem;left:.8rem;z-index:2;font-family:${DISPLAY};font-size:.72rem;letter-spacing:.02em;color:var(--wr-ink);background:rgba(255,251,242,.94);padding:.3rem .7rem;border-radius:999px}
/* Banderol — tag harga kertas miring */
.wr-card-tag{position:absolute;top:.9rem;right:-.2rem;z-index:3;font-family:${DISPLAY};font-size:1.05rem;color:var(--wr-ink);background:${MUSTARD};padding:.4rem 1rem .4rem .85rem;transform:rotate(2deg);box-shadow:0 6px 14px var(--wr-shadow);clip-path:polygon(12% 0,100% 0,100% 100%,12% 100%,0 50%)}
.wr-card-body{padding:1.2rem 1.3rem 1.3rem}
.wr-card-name{font-family:${DISPLAY};font-size:1.45rem;color:var(--wr-ink);margin-bottom:.35rem;line-height:1.2}
.wr-card-desc{font-size:.88rem;color:var(--wr-muted);line-height:1.65;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.wr-card-more{display:inline-flex;align-items:center;gap:.3rem;margin-top:.9rem;font-family:${DISPLAY};font-size:.82rem;color:var(--wr-accentDeep);transition:gap .3s}
.wr-card:hover .wr-card-more{gap:.6rem}
@media(max-width:980px){.wr-grid{grid-template-columns:repeat(2,1fr)}.wr-grid[data-count="1"]{grid-template-columns:minmax(0,380px)}}
@media(max-width:560px){.wr-grid,.wr-grid[data-count="1"],.wr-grid[data-count="2"]{grid-template-columns:1fr;max-width:380px;margin:0 auto}}

/* STATEMENT — panel hangat */
.wr-statement{padding:clamp(3.5rem,7vw,6rem) 7vw}
.wr-stmt-inner{position:relative;max-width:58ch;margin:0 auto;background:var(--wr-surface);border:2px solid var(--wr-line2);border-radius:28px;padding:clamp(2.4rem,5vw,3.6rem);text-align:center}
.wr-stmt-ew{font-family:${DISPLAY};font-size:.92rem;color:var(--wr-accentDeep);margin-bottom:1rem}
.wr-stmt-quote{font-family:${DISPLAY};font-size:clamp(1.5rem,3vw,2.3rem);color:var(--wr-ink);line-height:1.3}
.wr-stmt-cite{display:block;font-size:.84rem;color:var(--wr-muted);font-weight:600;margin-top:1.2rem}

/* ABOUT */
.wr-about{background:var(--wr-bg)}
.wr-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:center}
.wr-about-inner.wr-about-solo{grid-template-columns:1fr;max-width:58ch;margin:0 auto;text-align:center}
.wr-about-solo .wr-eyebrow{justify-content:center}
.wr-about-solo .wr-about-body{margin-left:auto;margin-right:auto}
.wr-about-body{font-size:1.04rem;color:var(--wr-inkDim);line-height:1.9;margin-top:1.1rem;white-space:pre-line}
.wr-about-cta{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.7rem;font-family:${DISPLAY};font-size:.92rem;color:var(--wr-onAccent);background:var(--wr-accentDeep);padding:.8rem 1.7rem;border-radius:999px;text-decoration:none;transition:gap .3s,transform .3s ${BOUNCE},background .3s}
.wr-about-cta:hover{gap:.8rem;transform:translateY(-2px);background:var(--wr-ink)}
.wr-about-img{position:relative}
.wr-about-frame{position:relative;z-index:1;aspect-ratio:4/5;border-radius:24px;overflow:hidden;box-shadow:0 28px 60px var(--wr-shadowDeep);transform:rotate(-1.5deg)}
.wr-about-frame img{width:100%;height:100%;object-fit:cover}
@media(max-width:840px){.wr-about-inner{grid-template-columns:1fr;gap:2.5rem}.wr-about-img{order:-1;max-width:340px;margin:0 auto}}

/* STATS */
.wr-stats{background:var(--wr-bg2)}
.wr-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3rem;text-align:center}
.wr-stat{background:var(--wr-surface);border:2px solid var(--wr-line2);border-radius:22px;padding:1.8rem 1rem}
.wr-stat-num{font-family:${DISPLAY};font-size:clamp(2.2rem,4.4vw,3rem);color:var(--wr-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.wr-stat-label{font-size:.78rem;color:var(--wr-muted);font-weight:600;margin-top:.6rem}
@media(max-width:560px){.wr-stats-grid{grid-template-columns:repeat(2,1fr);gap:1rem}}

/* TESTIMONIALS — carousel */
.wr-testimonials{background:var(--wr-bg)}
.wr-tcar{position:relative}
.wr-tcar-track{display:flex;gap:1.4rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .25rem 1.5rem;-ms-overflow-style:none;scrollbar-width:none}
.wr-tcar-track::-webkit-scrollbar{display:none}
.wr-test-card{scroll-snap-align:start;background:var(--wr-surface);border:2px solid var(--wr-line2);border-radius:22px;padding:2.2rem;min-width:310px;max-width:380px;flex:0 0 auto;box-shadow:0 12px 28px var(--wr-shadow)}
.wr-test-mark{font-family:${DISPLAY};font-size:2.6rem;color:${MUSTARD};line-height:.5;margin-bottom:.5rem}
.wr-test-quote{font-size:1.02rem;color:var(--wr-inkDim);line-height:1.7;margin:0 0 1.3rem}
.wr-test-name{font-family:${DISPLAY};font-size:1.05rem;color:var(--wr-ink)}
.wr-test-role{font-size:.78rem;color:var(--wr-muted);font-weight:600;margin-top:.15rem}
.wr-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1.1rem;margin-top:1.5rem}
.wr-tcar-btn{width:46px;height:46px;border-radius:50%;background:var(--wr-surface);border:2px solid var(--wr-line2);color:var(--wr-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s,border-color .25s,opacity .25s,transform .25s ${BOUNCE}}
.wr-tcar-btn:hover:not(:disabled){background:var(--wr-accentDeep);color:var(--wr-onAccent);border-color:var(--wr-accentDeep);transform:scale(1.08)}
.wr-tcar-btn:disabled{opacity:.3;cursor:default}
.wr-tcar-dots{display:flex;gap:.5rem;align-items:center}
.wr-dot-nav{width:8px;height:8px;border-radius:50%;background:var(--wr-line);border:none;padding:0;cursor:pointer;transition:background .25s,transform .25s}
.wr-dot-nav[aria-current="true"]{background:var(--wr-accent);transform:scale(1.5)}

/* FAQ */
.wr-faq{background:var(--wr-bg2)}
.wr-faq-wrap{max-width:760px;margin:0 auto}
.wr-faq-item{background:var(--wr-surface);border:2px solid var(--wr-line2);border-radius:18px;margin-bottom:.8rem;overflow:hidden}
.wr-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.25rem 1.4rem;cursor:pointer;font-family:${DISPLAY};font-size:1.15rem;color:var(--wr-ink);background:none;border:none;text-align:left}
.wr-faq-q:focus-visible{outline:2px solid var(--wr-accentDeep);outline-offset:-2px;border-radius:14px}
.wr-faq-icon{font-size:1.4rem;color:var(--wr-accentDeep);flex-shrink:0;transition:transform .3s ${BOUNCE};line-height:1}
.wr-faq-icon.open{transform:rotate(45deg)}
.wr-faq-a{font-size:.95rem;color:var(--wr-inkDim);line-height:1.8;padding:0 1.4rem 1.3rem;max-width:64ch}

/* CTA — panel bata */
.wr-cta{background:var(--wr-bg)}
.wr-cta-inner{position:relative;background:var(--wr-accentDeep);color:var(--wr-onAccent);border-radius:30px;padding:clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem);text-align:center;overflow:hidden}
.wr-cta-inner::after{content:'';position:absolute;width:200px;height:200px;border-radius:50%;background:${MUSTARD};opacity:.18;top:-60px;right:-40px}
.wr-cta-title{position:relative;font-family:${DISPLAY};font-size:clamp(2.1rem,4.4vw,3.2rem);margin-bottom:.9rem;line-height:1.12;text-wrap:balance}
.wr-cta-sub{position:relative;font-size:1.05rem;opacity:.92;max-width:48ch;margin:0 auto 2.2rem;line-height:1.8}
.wr-cta-btns{position:relative;display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap}
.wr-cta .wr-btn-primary{background:${MUSTARD};color:var(--wr-ink)}
.wr-cta .wr-btn-primary:hover{background:var(--wr-surface);color:var(--wr-ink)}
.wr-cta .wr-btn-ghost{color:var(--wr-onAccent);border-color:rgba(255,251,242,.5)}
.wr-cta .wr-btn-ghost:hover{color:#fff;border-color:#fff}

/* BAND ADD-ON */
.wr-band{background:var(--wr-surface);border-top:2px solid var(--wr-line2);border-bottom:2px solid var(--wr-line2);padding:3.2rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.4rem}
.wr-band-ew{font-family:${DISPLAY};font-size:.8rem;color:var(--wr-accentDeep);margin-bottom:.5rem}
.wr-band .wr-heading{font-size:clamp(1.5rem,2.4vw,2.1rem)}
.wr-band-sub{color:var(--wr-muted);font-size:.94rem;line-height:1.6;margin-top:.5rem;max-width:56ch}

/* FOOTER */
.wr-footer{background:var(--wr-ink);color:rgba(255,251,242,.7);padding:4.2rem 7vw 2.4rem}
.wr-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.6rem}
.wr-footer-brand{font-family:${DISPLAY};font-size:1.7rem;color:#fff;margin-bottom:.8rem}
.wr-footer-tagline{font-size:.9rem;color:rgba(255,251,242,.6);line-height:1.7;max-width:34ch}
.wr-footer-h{font-family:${DISPLAY};font-size:.95rem;color:#fff;margin-bottom:1rem}
.wr-footer-link{display:block;font-size:.9rem;color:rgba(255,251,242,.7);text-decoration:none;margin-bottom:.55rem;transition:color .25s}
.wr-footer-link:hover{color:${MUSTARD}}
.wr-footer-copy{border-top:2px solid rgba(255,251,242,.14);padding-top:1.5rem;font-size:.8rem;color:rgba(255,251,242,.55);text-align:center}
@media(max-width:768px){.wr-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* REVEAL — via LUX_JS (.lx-reveal → .lx-in), digate .lx-js (kontrak no-JS #138) */
.lx-js .wr-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ${EASE},transform .7s ${EASE}}
.lx-js .wr-rv.lx-in{opacity:1;transform:none}
.wr-rv-d1{transition-delay:.08s}.wr-rv-d2{transition-delay:.16s}.wr-rv-d3{transition-delay:.24s}.wr-rv-d4{transition-delay:.32s}

/* LIGHTBOX — wr-root overrides palet lx-lb (hangat) */
.wr-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.wr-root .lx-lb[hidden]{display:none}
.wr-root .lx-lb-back{position:absolute;inset:0;background:rgba(43,26,18,.55);backdrop-filter:blur(6px);border:0;cursor:pointer}
.wr-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--wr-surface);border:2px solid var(--wr-line2);border-radius:26px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .42s ${EASE},transform .42s ${EASE}}
.wr-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.wr-root .lx-lb-media{position:relative;overflow:hidden;background:var(--wr-surface2);min-height:300px}
.wr-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.wr-root .lx-lb-body{padding:clamp(22px,3vw,42px);display:flex;flex-direction:column;gap:9px;justify-content:center}
.wr-root .lx-lb-cat{font-family:${DISPLAY};font-size:12px;letter-spacing:.02em;color:var(--wr-accentDeep)}
.wr-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(24px,2.8vw,32px);line-height:1.15;color:var(--wr-ink)}
.wr-root .lx-lb-price{font-family:${DISPLAY};font-size:20px;color:var(--wr-accentDeep)}
.wr-root .lx-lb-desc{color:var(--wr-muted);font-size:13.5px;line-height:1.8}
.wr-root .lx-lb-cta{margin-top:14px;width:fit-content;display:inline-flex;align-items:center;background:var(--wr-accentDeep);color:var(--wr-onAccent);font-family:${DISPLAY};font-size:13px;padding:12px 26px;border-radius:999px;text-decoration:none;transition:background .25s}
.wr-root .lx-lb-cta:hover{background:var(--wr-ink)}
.wr-root .lx-lb-x{position:absolute;top:12px;right:12px;z-index:3;width:42px;height:42px;border-radius:50%;background:var(--wr-surface);border:2px solid var(--wr-line2);color:var(--wr-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.wr-root .lx-lb-x:hover{background:var(--wr-accentDeep);color:var(--wr-onAccent);border-color:var(--wr-accentDeep)}
.wr-root .lx-lb-prev,.wr-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:42px;height:42px;border-radius:50%;background:var(--wr-surface);border:2px solid var(--wr-line2);color:var(--wr-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.wr-root .lx-lb-prev:hover,.wr-root .lx-lb-next:hover{background:var(--wr-accentDeep);color:var(--wr-onAccent)}
.wr-root .lx-lb-prev{left:10px}.wr-root .lx-lb-next{right:10px}
@media(max-width:640px){.wr-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.wr-root .lx-lb-media{min-height:240px}}

/* ── RASA polish ── */
.wr-btn-primary:active,.wr-nav-cta:active,.wr-about-cta:active{transform:translateY(0) scale(.97)}
.wr-card:active{transform:translateY(-2px)}
.wr-tcar-btn:active{transform:scale(.93)}
.wr-nav-cta:focus-visible,.wr-btn-primary:focus-visible,.wr-btn-ghost:focus-visible,.wr-about-cta:focus-visible,.wr-footer-link:focus-visible,.wr-card:focus-visible,.wr-tcar-btn:focus-visible,.wr-dot-nav:focus-visible,.wr-cta-btns a:focus-visible{outline:3px solid var(--wr-accent);outline-offset:3px}
.wr-hero-sub,.wr-subtext,.wr-about-body,.wr-cta-sub,.wr-feat-desc{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Kata pita = vibe warung (BUKAN klaim seperti halal/terenak); tampil di SEMUA
// situs Hangat. Klaim spesifik milik klien → konten editabel.
const RIBBON = ['Masakan Rumahan', 'Hangat', 'Dimasak Dadakan', 'Bersama', 'Sederhana']

export default function WarungRenderer({ content: c, variant = 'hangat' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.hangat
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa}` : '#menu'
  const hero = c.hero ?? {}
  const items = c.showcase?.items ?? []
  const features = c.features ?? []
  const stats = c.stats ?? []
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []
  const jamRows = c.info?.jam ?? []

  const rootStyle = {
    '--wr-bg': p.bg, '--wr-bg2': p.bg2, '--wr-surface': p.surface, '--wr-surface2': p.surface2,
    '--wr-ink': p.ink, '--wr-inkDim': p.inkDim, '--wr-muted': p.muted,
    '--wr-accent': p.accent, '--wr-accentDeep': p.accentDeep, '--wr-onAccent': p.onAccent,
    '--wr-line': p.line, '--wr-line2': p.line2, '--wr-shadow': p.shadow, '--wr-shadowDeep': p.shadowDeep,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const priceText = (n?: number) => (typeof n === 'number' && n > 0 ? fmt(n) : 'Tanya')

  return (
    <div className="wr-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: wrCss() }} />

      {/* NAV */}
      <nav className="wr-nav" aria-label="Navigasi utama">
        <a href="#beranda" className="wr-nav-logo">{c.nama ?? 'Warung'}</a>
        <a href={waUrl} className="wr-nav-cta">Pesan</a>
      </nav>

      {/* HERO */}
      <section className="wr-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="wr-hero-text">
          {hero.eyebrow && <p className="wr-hero-ew">{hero.eyebrow}</p>}
          {hero.title && <h1 className="wr-hero-title">{hero.title}</h1>}
          {hero.subtitle && <p className="wr-hero-sub">{hero.subtitle}</p>}
          <div className="wr-hero-btns">
            <a href={hero.ctaHref ?? '#menu'} className="wr-btn-primary">{hero.ctaText ?? 'Lihat Menu'}</a>
            <a href={hero.ctaHref2 ?? waUrl} className="wr-btn-ghost">{hero.ctaText2 ?? 'Pesan Antar'}</a>
          </div>
          {stats.length > 0 && (
            <div className="wr-hero-meta">
              {stats.slice(0, 3).map((s, i) => (
                <div key={i} className="wr-meta-item">
                  <span className="wr-meta-num">{s.angka}</span>
                  <span className="wr-meta-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="wr-hero-media">
          <div className="wr-hero-frame">
            {hero.image
              ? <img src={hero.image} alt={c.nama ?? 'Warung'} loading="eager" style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined} />
              : <span aria-hidden style={{ display: 'block', width: '100%', height: '100%' }} />}
          </div>
          {/* Stempel = seal dekoratif evergreen (tak menggemakan eyebrow di kiri-atas). */}
          <div className="wr-hero-stamp"><span aria-hidden>♨</span> Selalu Hangat</div>
        </div>
      </section>

      {/* PITA */}
      <div className="wr-ribbon" aria-hidden="true">
        <div className="wr-ribbon-row">
          {RIBBON.map((m, i) => (
            <span key={i} className="wr-ribbon-item">{m}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="wr-section" id="keunggulan">
          <div className="wr-sec-hdr wr-rv lx-reveal">
            <p className="wr-eyebrow">{c.featuresEyebrow ?? 'Kenapa Kami'}</p>
            {c.featuresTitle && <h2 className="wr-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="wr-feat-grid">
            {features.slice(0, 3).map((f, i) => (
              <div key={i} className={`wr-feat-card wr-rv lx-reveal wr-rv-d${i + 1}`}>
                <div className="wr-feat-idx">{String(i + 1)}</div>
                <h3 className="wr-feat-title">{f.title}</h3>
                <p className="wr-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SHOWCASE MENU — banderol harga (signature) */}
      {items.length > 0 && (
        <section className="wr-section wr-showcase" id="menu">
          <div className="wr-sec-hdr wr-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.2rem' }}>
            <p className="wr-eyebrow" style={{ justifyContent: 'center' }}>Menu</p>
            {c.showcase?.title && <h2 className="wr-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="wr-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{c.showcase.subtitle}</p>}
          </div>
          <div className="wr-grid lx-look" data-count={items.length}>
            {items.map((item, i) => (
              <article
                key={i}
                className="wr-card lx-lb-open wr-rv lx-reveal"
                style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
                data-cat={item.kategori ?? ''}
                data-src={item.gambar ?? ''}
                data-title={item.nama}
                data-price={priceText(item.harga)}
                data-desc={item.desc ?? ''}
                data-href={waUrl}
                role="button"
                tabIndex={0}
                aria-label={`${item.nama} — ${priceText(item.harga)}`}
              >
                <div className="wr-card-frame">
                  {item.kategori && <span className="wr-card-cat">{item.kategori}</span>}
                  <span className="wr-card-tag">{priceText(item.harga)}</span>
                  {item.gambar && <img src={item.gambar} alt={item.nama} loading="lazy" />}
                </div>
                <div className="wr-card-body">
                  <h3 className="wr-card-name">{item.nama}</h3>
                  {item.desc && <p className="wr-card-desc">{item.desc}</p>}
                  <span className="wr-card-more">Lihat &amp; pesan →</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT */}
      {c.statement && (
        <div className="wr-statement">
          <div className="wr-stmt-inner wr-rv lx-reveal">
            {c.statement.eyebrow && <p className="wr-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="wr-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="wr-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="wr-section wr-about" id="tentang">
          <div className={`wr-about-inner${c.about.image ? '' : ' wr-about-solo'}`}>
            <div className="wr-rv lx-reveal">
              <p className="wr-eyebrow">Tentang Kami</p>
              <h2 className="wr-heading">{c.about.title}</h2>
              <p className="wr-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="wr-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="wr-about-img wr-rv lx-reveal wr-rv-d2">
                <div className="wr-about-frame">
                  <img src={c.about.image} alt={c.about.title} loading="lazy" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="wr-section wr-stats">
          <div className="wr-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`wr-stat wr-rv lx-reveal wr-rv-d${i + 1}`}>
                <div className="wr-stat-num" data-cu>{s.angka}</div>
                <div className="wr-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="wr-section wr-testimonials" id="ulasan">
          <div className="wr-sec-hdr wr-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="wr-eyebrow" style={{ justifyContent: 'center' }}>Ulasan</p>
            <h2 className="wr-heading">Kata Pelanggan</h2>
          </div>
          <div className="wr-tcar lx-tcar">
            <div className="wr-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="wr-test-card">
                  <div className="wr-test-mark" aria-hidden>&ldquo;</div>
                  <p className="wr-test-quote">{t.quote}</p>
                  <p className="wr-test-name">{t.nama}</p>
                  {t.peran && <p className="wr-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="wr-tcar-ctrl">
                <button className="wr-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="wr-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="wr-dot-nav lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="wr-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="wr-section wr-faq" id="faq">
          <div className="wr-sec-hdr wr-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="wr-eyebrow" style={{ justifyContent: 'center' }}>Pertanyaan</p>
            <h2 className="wr-heading">Sering Ditanyakan</h2>
          </div>
          <div className="wr-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="wr-faq-item">
                <button
                  className="wr-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`wr-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="wr-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="wr-section wr-cta" id="pesan">
          <div className="wr-cta-inner wr-rv lx-reveal">
            <h2 className="wr-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="wr-cta-sub">{c.cta.subtitle}</p>}
            <div className="wr-cta-btns">
              <a href={waUrl} className="wr-btn-primary">{c.cta.ctaText ?? 'Pesan via WhatsApp'}</a>
              <a href="#menu" className="wr-btn-ghost">Lihat Menu</a>
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON */}
      {(c.bands ?? []).map((b, i) => (
        <section className="wr-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="wr-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="wr-heading">{b.title}</h2>
            {b.subtitle && <p className="wr-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="wr-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="wr-footer">
        <div className="wr-footer-grid">
          <div>
            <p className="wr-footer-brand">{c.nama ?? 'Warung'}</p>
            <p className="wr-footer-tagline">
              {hero.eyebrow ?? `${c.nama ?? 'Warung'} — masakan rumahan yang bikin kangen.`}
            </p>
          </div>
          <div>
            <p className="wr-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="wr-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="wr-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="wr-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="wr-footer-h">Jam Buka</p>
            {jamRows.length
              ? jamRows.map((j, i) => <p key={i} className="wr-footer-link">{j.hari}: {j.jam}</p>)
              : (
                <>
                  <p className="wr-footer-link">Setiap hari: 07.00–21.00</p>
                </>
              )}
          </div>
        </div>
        <p className="wr-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Warung'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX */}
      <BespokeLightbox ctaText="Pesan via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
