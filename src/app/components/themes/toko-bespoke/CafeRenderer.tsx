'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// SEDUH — Cafe / Coffee Shop Bespoke Lux Renderer (specialty warm-minimal)
// Industri RESTORAN (source: menu) — tanpa keranjang.
// Instrument Serif (display, editorial elegant) + Manrope (body) |
// Oat #F4EEE3 · paper #FBF7EF · ink espresso #2A1F18 |
// accent moka #A4642E / accentDeep #7E4A1E · onAccent #FBF7EF |
// signature: "kopi-ring" — badge harga di dalam noda cincin kopi (ring coklat
//   tak-penuh + radial-stain) di tiap kartu menu + uap CSS naik dari cangkir hero.
// ns: cf-*  | interaksi via LUX_JS bersama (hook `.lx-*`).
// Light palette → contrast.test menjaga WCAG (ink AAA, accentDeep ≥4.5 utk teks
// aksen, accent ≥3 dekoratif). Specialty third-wave coffee — sengaja beda dari
// restaurant-warung (Caprasimo/folk merah-bata/banderol), toko-kuliner
// (Newsreader/menu-board), restaurant-lux (Cormorant/gelap-emas-sinematik).
// ============================================================

export interface CfPal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentDeep: string; onAccent: string
  line: string; line2: string; shadow: string; shadowDeep: string
}

export const PALETTES: Record<string, CfPal> = {
  // Seduh — oat hangat, tinta espresso, aksen moka/caramel. Warm-minimal.
  seduh: {
    bg: '#F4EEE3', bg2: '#ECE3D3', surface: '#FBF7EF', surface2: '#F0E8DA',
    ink: '#2A1F18', inkDim: '#4A382B', muted: '#6E5949',
    accent: '#A4642E', accentDeep: '#7E4A1E', onAccent: '#FBF7EF',
    line: 'rgba(42,31,24,.14)', line2: 'rgba(42,31,24,.07)',
    shadow: 'rgba(42,31,24,.1)', shadowDeep: 'rgba(42,31,24,.2)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&display=swap'
const DISPLAY = '"Instrument Serif",Georgia,"Times New Roman",serif'
const BODY = '"Manrope","Segoe UI",system-ui,sans-serif'
const EASE = 'cubic-bezier(.22,1,.36,1)'
// Noda cincin kopi (signature) — dipakai badge harga & dekorasi. Ring coklat
// tak-penuh: dua inset ring beda opasitas + radial-stain samar di dalam.
const RING = 'inset 0 0 0 2px rgba(126,74,30,.5),inset 0 0 0 5px rgba(164,100,46,.13)'
const STAIN = 'radial-gradient(circle at 50% 48%,rgba(164,100,46,.11),rgba(164,100,46,.04) 58%,transparent 72%)'

function cfCss(): string {
  return `
@import url('${FONT_IMPORT}');
html,body{overflow-x:hidden;max-width:100%}
.cf-root{font-family:${BODY};color:var(--cf-ink);background:var(--cf-bg);line-height:1.7;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.cf-root *,.cf-root *::before,.cf-root *::after{box-sizing:border-box;margin:0;padding:0}
.cf-root img{max-width:100%;height:auto;display:block}
.cf-root ::selection{background:rgba(164,100,46,.2);color:var(--cf-ink)}

/* NAV */
.cf-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.15rem 7vw;display:flex;align-items:center;justify-content:space-between;transition:background .45s,box-shadow .45s,backdrop-filter .45s,padding .45s}
.cf-root.lx-scrolled .cf-nav{background:rgba(244,238,227,.88);backdrop-filter:blur(10px);box-shadow:0 1px 0 var(--cf-line2);padding-top:.78rem;padding-bottom:.78rem}
.cf-nav-logo{font-family:${DISPLAY};color:var(--cf-ink);font-size:1.85rem;text-decoration:none;letter-spacing:.005em;line-height:1}
.cf-nav-cta{font-size:.82rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--cf-onAccent);background:var(--cf-accentDeep);padding:.62rem 1.4rem;border-radius:999px;text-decoration:none;transition:transform .3s ${EASE},background .3s}
.cf-nav-cta:hover{transform:translateY(-2px);background:var(--cf-ink)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO — editorial asimetris: teks + cangkir ber-uap */
.cf-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1.04fr .96fr;align-items:center;gap:clamp(2rem,5vw,4.5rem);padding:8.5rem 7vw 4.5rem;background:var(--cf-bg)}
.cf-hero::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(420px 420px at 88% 18%,rgba(164,100,46,.06),transparent 70%);z-index:0}
.cf-hero-text{position:relative;z-index:2}
.cf-eyebrow{font-size:.78rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--cf-accentDeep);margin-bottom:1.1rem;display:inline-flex;align-items:center;gap:.55rem}
.cf-eyebrow::before{content:'';width:1.5rem;height:1.5rem;border-radius:50%;background:${STAIN};box-shadow:${RING};flex-shrink:0}
.cf-hero-title{font-family:${DISPLAY};font-weight:400;font-size:clamp(3rem,7vw,5.8rem);line-height:.98;color:var(--cf-ink);margin-bottom:1.3rem;letter-spacing:.004em}
.cf-hero-title em{font-style:italic;color:var(--cf-accentDeep)}
.cf-hero-sub{font-size:1.1rem;color:var(--cf-inkDim);margin-bottom:2rem;max-width:46ch;line-height:1.8}
.cf-hero-btns{display:flex;gap:.9rem;flex-wrap:wrap;align-items:center;margin-bottom:2.3rem}
.cf-btn-primary{font-size:.86rem;font-weight:600;letter-spacing:.03em;background:var(--cf-accentDeep);color:var(--cf-onAccent);padding:.95rem 2rem;border-radius:999px;text-decoration:none;transition:transform .3s ${EASE},background .3s,box-shadow .3s;box-shadow:0 8px 20px var(--cf-shadow)}
.cf-btn-primary:hover{transform:translateY(-3px);background:var(--cf-ink);box-shadow:0 14px 30px var(--cf-shadowDeep)}
.cf-btn-ghost{font-size:.86rem;font-weight:600;letter-spacing:.03em;color:var(--cf-ink);padding:.95rem 1.6rem;text-decoration:none;border-radius:999px;border:1.5px solid var(--cf-line);transition:border-color .3s,color .3s,transform .3s ${EASE}}
.cf-btn-ghost:hover{border-color:var(--cf-accent);color:var(--cf-accentDeep);transform:translateY(-2px)}
.cf-hero-meta{display:flex;flex-wrap:wrap;gap:2rem}
.cf-meta-item{display:flex;flex-direction:column;gap:.15rem}
.cf-meta-num{font-family:${DISPLAY};font-size:2rem;color:var(--cf-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.cf-meta-label{font-size:.76rem;color:var(--cf-muted);font-weight:600;letter-spacing:.02em}
.cf-hero-media{position:relative;z-index:1}
.cf-hero-frame{position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:200px 200px 26px 26px;background:var(--cf-surface2);box-shadow:0 28px 60px var(--cf-shadowDeep)}
.cf-hero-frame img{width:100%;height:100%;object-fit:cover}
/* Uap naik dari atas cangkir (dekoratif, hilang saat reduced-motion) */
.cf-steam{position:absolute;top:-2.4rem;left:50%;transform:translateX(-50%);z-index:3;display:flex;gap:1.3rem;pointer-events:none}
.cf-steam span{display:block;width:8px;height:42px;border-radius:999px;background:linear-gradient(to top,transparent,rgba(164,100,46,.34));opacity:0;animation:cf-rise 3.6s ${EASE} infinite}
.cf-steam span:nth-child(2){animation-delay:.9s;height:54px}
.cf-steam span:nth-child(3){animation-delay:1.8s}
@keyframes cf-rise{0%{opacity:0;transform:translateY(10px) scaleY(.7)}30%{opacity:.7}100%{opacity:0;transform:translateY(-22px) scaleY(1.15)}}
.cf-hero-badge{position:absolute;right:-.6rem;bottom:1.6rem;z-index:4;width:5.4rem;height:5.4rem;display:flex;align-items:center;justify-content:center;text-align:center;font-family:${DISPLAY};font-size:1rem;line-height:1.05;color:var(--cf-accentDeep);background:var(--cf-surface);border-radius:50%;box-shadow:${RING},0 12px 28px var(--cf-shadowDeep);transform:rotate(-7deg)}
@media(max-width:880px){
  .cf-hero{grid-template-columns:1fr;min-height:unset;padding:7rem 7vw 3rem}
  .cf-hero-media{order:-1;max-width:360px;margin:0 auto}
  .cf-hero-title{font-size:clamp(2.8rem,11vw,4rem)}
}
@media(max-width:560px){.cf-nav{padding:.9rem 6vw}.cf-hero-badge{right:0}}

/* AROMA STRIP — kata vibe kopi (BUKAN klaim) */
.cf-aroma{background:var(--cf-accentDeep);padding:.95rem 7vw;overflow:hidden}
.cf-aroma-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.6rem 1.5rem}
.cf-aroma-item{font-family:${DISPLAY};font-size:1.12rem;color:#FBEFE0;display:inline-flex;align-items:center;gap:.7rem;font-style:italic}
.cf-aroma-item::after{content:'';width:6px;height:6px;border-radius:50%;background:rgba(251,239,224,.55)}
.cf-aroma-item:last-child::after{display:none}

/* SECTION COMMONS */
.cf-section{padding:clamp(4.4rem,8vw,7rem) 7vw}
.cf-sec-ew{font-size:.78rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--cf-accentDeep);margin-bottom:.85rem;display:inline-flex;align-items:center;gap:.55rem}
.cf-sec-ew::before{content:'';width:1.3rem;height:1.3rem;border-radius:50%;background:${STAIN};box-shadow:${RING};flex-shrink:0}
.cf-heading{font-family:${DISPLAY};font-weight:400;font-size:clamp(2.3rem,4.4vw,3.5rem);color:var(--cf-ink);line-height:1.05;letter-spacing:.004em;text-wrap:balance}
.cf-subtext{color:var(--cf-inkDim);font-size:1.04rem;margin-top:.9rem;max-width:54ch;line-height:1.8}
.cf-sec-hdr{margin-bottom:3.2rem;max-width:60ch}

/* FEATURES */
.cf-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
.cf-feat-card{position:relative;padding:2.3rem 1.9rem;background:var(--cf-surface);border:1px solid var(--cf-line2);border-radius:20px;transition:transform .35s ${EASE},box-shadow .35s,border-color .35s}
.cf-feat-card:hover{transform:translateY(-5px);box-shadow:0 20px 42px var(--cf-shadow);border-color:var(--cf-line)}
.cf-feat-idx{font-family:${DISPLAY};font-size:1.3rem;color:var(--cf-accentDeep);width:3.1rem;height:3.1rem;display:flex;align-items:center;justify-content:center;border-radius:50%;background:${STAIN};box-shadow:${RING};margin-bottom:1.2rem}
.cf-feat-title{font-family:${DISPLAY};font-size:1.6rem;color:var(--cf-ink);margin-bottom:.4rem;line-height:1.15}
.cf-feat-desc{font-size:.92rem;color:var(--cf-muted);line-height:1.75}
@media(max-width:820px){.cf-feat-grid{grid-template-columns:1fr}}

/* SHOWCASE MENU — kartu + KOPI-RING harga (signature) */
.cf-showcase{background:var(--cf-bg2)}
.cf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.4rem,3vw,2.1rem)}
.cf-grid[data-count="1"]{grid-template-columns:minmax(0,380px);justify-content:center}
.cf-grid[data-count="2"]{grid-template-columns:repeat(2,minmax(0,360px));justify-content:center;max-width:820px;margin:0 auto}
.cf-card{position:relative;cursor:pointer;background:var(--cf-surface);border:1px solid var(--cf-line2);border-radius:20px;overflow:hidden;transition:transform .4s ${EASE},box-shadow .4s,border-color .4s}
.cf-card:hover{transform:translateY(-6px);box-shadow:0 26px 52px var(--cf-shadow);border-color:var(--cf-line)}
.cf-card-frame{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--cf-surface2)}
.cf-card-frame img{width:100%;height:100%;object-fit:cover;transition:transform .6s ${EASE}}
.cf-card:hover .cf-card-frame img{transform:scale(1.06)}
.cf-card-cat{position:absolute;top:.8rem;left:.8rem;z-index:2;font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--cf-ink);background:rgba(251,247,239,.94);padding:.32rem .7rem;border-radius:999px}
/* Kopi-ring — badge harga di dalam noda cincin kopi */
.cf-card-tag{position:absolute;top:.85rem;right:.85rem;z-index:3;width:4.7rem;height:4.7rem;display:flex;align-items:center;justify-content:center;text-align:center;font-family:${DISPLAY};font-size:1.08rem;line-height:1.02;color:var(--cf-accentDeep);background:${STAIN},var(--cf-surface);border-radius:50%;box-shadow:${RING},0 6px 16px var(--cf-shadow);transform:rotate(-5deg)}
.cf-card-body{padding:1.25rem 1.35rem 1.4rem}
.cf-card-name{font-family:${DISPLAY};font-size:1.55rem;color:var(--cf-ink);margin-bottom:.3rem;line-height:1.12}
.cf-card-desc{font-size:.88rem;color:var(--cf-muted);line-height:1.65;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cf-card-more{display:inline-flex;align-items:center;gap:.3rem;margin-top:.9rem;font-size:.78rem;font-weight:600;letter-spacing:.03em;color:var(--cf-accentDeep);transition:gap .3s}
.cf-card:hover .cf-card-more{gap:.6rem}
@media(max-width:980px){.cf-grid{grid-template-columns:repeat(2,1fr)}.cf-grid[data-count="1"]{grid-template-columns:minmax(0,380px)}}
@media(max-width:560px){.cf-grid,.cf-grid[data-count="1"],.cf-grid[data-count="2"]{grid-template-columns:1fr;max-width:380px;margin:0 auto}}

/* STATEMENT — panel tenang dengan noda ring samar */
.cf-statement{padding:clamp(3.5rem,7vw,6rem) 7vw}
.cf-stmt-inner{position:relative;max-width:60ch;margin:0 auto;background:var(--cf-surface);border:1px solid var(--cf-line2);border-radius:26px;padding:clamp(2.6rem,5vw,3.8rem);text-align:center;overflow:hidden}
.cf-stmt-inner::before{content:'';position:absolute;width:240px;height:240px;border-radius:50%;background:${STAIN};box-shadow:${RING};top:-90px;right:-70px;opacity:.7}
.cf-stmt-ew{position:relative;font-size:.78rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--cf-accentDeep);margin-bottom:1rem}
.cf-stmt-quote{position:relative;font-family:${DISPLAY};font-style:italic;font-size:clamp(1.6rem,3.1vw,2.4rem);color:var(--cf-ink);line-height:1.32}
.cf-stmt-cite{position:relative;display:block;font-size:.82rem;color:var(--cf-muted);font-weight:600;letter-spacing:.02em;margin-top:1.3rem}

/* ABOUT */
.cf-about{background:var(--cf-bg)}
.cf-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:center}
.cf-about-inner.cf-about-solo{grid-template-columns:1fr;max-width:58ch;margin:0 auto;text-align:center}
.cf-about-solo .cf-sec-ew{justify-content:center}
.cf-about-solo .cf-about-body{margin-left:auto;margin-right:auto}
.cf-about-body{font-size:1.04rem;color:var(--cf-inkDim);line-height:1.9;margin-top:1.1rem;white-space:pre-line}
.cf-about-cta{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.7rem;font-size:.84rem;font-weight:600;letter-spacing:.03em;color:var(--cf-onAccent);background:var(--cf-accentDeep);padding:.85rem 1.8rem;border-radius:999px;text-decoration:none;transition:gap .3s,transform .3s ${EASE},background .3s}
.cf-about-cta:hover{gap:.8rem;transform:translateY(-2px);background:var(--cf-ink)}
.cf-about-img{position:relative}
.cf-about-frame{position:relative;z-index:1;aspect-ratio:4/5;border-radius:24px;overflow:hidden;box-shadow:0 28px 60px var(--cf-shadowDeep)}
.cf-about-frame img{width:100%;height:100%;object-fit:cover}
@media(max-width:840px){.cf-about-inner{grid-template-columns:1fr;gap:2.5rem}.cf-about-img{order:-1;max-width:340px;margin:0 auto}}

/* STATS */
.cf-stats{background:var(--cf-bg2)}
.cf-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3rem;text-align:center}
.cf-stat{background:var(--cf-surface);border:1px solid var(--cf-line2);border-radius:20px;padding:1.9rem 1rem}
.cf-stat-num{font-family:${DISPLAY};font-size:clamp(2.4rem,4.6vw,3.2rem);color:var(--cf-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.cf-stat-label{font-size:.76rem;color:var(--cf-muted);font-weight:600;letter-spacing:.02em;margin-top:.6rem}
@media(max-width:560px){.cf-stats-grid{grid-template-columns:repeat(2,1fr);gap:1rem}}

/* TESTIMONIALS — carousel */
.cf-testimonials{background:var(--cf-bg)}
.cf-tcar{position:relative}
.cf-tcar-track{display:flex;gap:1.4rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .25rem 1.5rem;-ms-overflow-style:none;scrollbar-width:none}
.cf-tcar-track::-webkit-scrollbar{display:none}
.cf-test-card{scroll-snap-align:start;background:var(--cf-surface);border:1px solid var(--cf-line2);border-radius:20px;padding:2.2rem;min-width:310px;max-width:380px;flex:0 0 auto;box-shadow:0 12px 28px var(--cf-shadow)}
.cf-test-mark{font-family:${DISPLAY};font-style:italic;font-size:3rem;color:var(--cf-accent);line-height:.5;margin-bottom:.6rem}
.cf-test-quote{font-size:1.02rem;color:var(--cf-inkDim);line-height:1.7;margin:0 0 1.3rem}
.cf-test-name{font-family:${DISPLAY};font-size:1.2rem;color:var(--cf-ink)}
.cf-test-role{font-size:.76rem;color:var(--cf-muted);font-weight:600;margin-top:.15rem}
.cf-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1.1rem;margin-top:1.5rem}
.cf-tcar-btn{width:46px;height:46px;border-radius:50%;background:var(--cf-surface);border:1px solid var(--cf-line);color:var(--cf-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s,border-color .25s,opacity .25s,transform .25s ${EASE}}
.cf-tcar-btn:hover:not(:disabled){background:var(--cf-accentDeep);color:var(--cf-onAccent);border-color:var(--cf-accentDeep);transform:scale(1.08)}
.cf-tcar-btn:disabled{opacity:.3;cursor:default}
.cf-tcar-dots{display:flex;gap:.5rem;align-items:center}
.cf-dot-nav{width:8px;height:8px;border-radius:50%;background:var(--cf-line);border:none;padding:0;cursor:pointer;transition:background .25s,transform .25s}
.cf-dot-nav[aria-current="true"]{background:var(--cf-accent);transform:scale(1.5)}

/* FAQ */
.cf-faq{background:var(--cf-bg2)}
.cf-faq-wrap{max-width:760px;margin:0 auto}
.cf-faq-item{background:var(--cf-surface);border:1px solid var(--cf-line2);border-radius:16px;margin-bottom:.8rem;overflow:hidden}
.cf-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.25rem 1.4rem;cursor:pointer;font-family:${DISPLAY};font-size:1.3rem;color:var(--cf-ink);background:none;border:none;text-align:left}
.cf-faq-q:focus-visible{outline:2px solid var(--cf-accentDeep);outline-offset:-2px;border-radius:12px}
.cf-faq-icon{font-size:1.5rem;color:var(--cf-accentDeep);flex-shrink:0;transition:transform .3s ${EASE};line-height:1}
.cf-faq-icon.open{transform:rotate(45deg)}
.cf-faq-a{font-size:.95rem;color:var(--cf-inkDim);line-height:1.8;padding:0 1.4rem 1.3rem;max-width:64ch}

/* CTA — panel moka */
.cf-cta{background:var(--cf-bg)}
.cf-cta-inner{position:relative;background:var(--cf-accentDeep);color:var(--cf-onAccent);border-radius:30px;padding:clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem);text-align:center;overflow:hidden}
.cf-cta-inner::after{content:'';position:absolute;width:220px;height:220px;border-radius:50%;background:transparent;box-shadow:inset 0 0 0 3px rgba(251,247,239,.18),inset 0 0 0 8px rgba(251,247,239,.07);top:-70px;right:-50px}
.cf-cta-title{position:relative;font-family:${DISPLAY};font-size:clamp(2.3rem,4.6vw,3.4rem);margin-bottom:.9rem;line-height:1.08;text-wrap:balance}
.cf-cta-sub{position:relative;font-size:1.05rem;opacity:.92;max-width:48ch;margin:0 auto 2.2rem;line-height:1.8}
.cf-cta-btns{position:relative;display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap}
.cf-cta .cf-btn-primary{background:var(--cf-surface);color:var(--cf-accentDeep)}
.cf-cta .cf-btn-primary:hover{background:var(--cf-ink);color:var(--cf-onAccent)}
.cf-cta .cf-btn-ghost{color:var(--cf-onAccent);border-color:rgba(251,247,239,.5)}
.cf-cta .cf-btn-ghost:hover{color:#fff;border-color:#fff}

/* BAND ADD-ON */
.cf-band{background:var(--cf-surface);border-top:1px solid var(--cf-line2);border-bottom:1px solid var(--cf-line2);padding:3.2rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.4rem}
.cf-band-ew{font-size:.74rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--cf-accentDeep);margin-bottom:.5rem}
.cf-band .cf-heading{font-size:clamp(1.6rem,2.6vw,2.2rem)}
.cf-band-sub{color:var(--cf-muted);font-size:.94rem;line-height:1.6;margin-top:.5rem;max-width:56ch}

/* FOOTER */
.cf-footer{background:var(--cf-ink);color:rgba(251,247,239,.7);padding:4.2rem 7vw 2.4rem}
.cf-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.6rem}
.cf-footer-brand{font-family:${DISPLAY};font-size:1.9rem;color:#fff;margin-bottom:.8rem}
.cf-footer-tagline{font-size:.9rem;color:rgba(251,247,239,.6);line-height:1.7;max-width:34ch}
.cf-footer-h{font-size:.76rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fff;margin-bottom:1rem}
.cf-footer-link{display:block;font-size:.9rem;color:rgba(251,247,239,.7);text-decoration:none;margin-bottom:.55rem;transition:color .25s}
.cf-footer-link:hover{color:#fff}
.cf-footer-copy{border-top:1px solid rgba(251,247,239,.14);padding-top:1.5rem;font-size:.8rem;color:rgba(251,247,239,.55);text-align:center}
@media(max-width:768px){.cf-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* REVEAL — via LUX_JS (.lx-reveal → .lx-in), digate .lx-js (kontrak no-JS #138) */
.lx-js .cf-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ${EASE},transform .7s ${EASE}}
.lx-js .cf-rv.lx-in{opacity:1;transform:none}
.cf-rv-d1{transition-delay:.08s}.cf-rv-d2{transition-delay:.16s}.cf-rv-d3{transition-delay:.24s}.cf-rv-d4{transition-delay:.32s}

/* LIGHTBOX — cf-root overrides palet lx-lb (seduh) */
.cf-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.cf-root .lx-lb[hidden]{display:none}
.cf-root .lx-lb-back{position:absolute;inset:0;background:rgba(42,31,24,.55);backdrop-filter:blur(6px);border:0;cursor:pointer}
.cf-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--cf-surface);border:1px solid var(--cf-line2);border-radius:26px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .42s ${EASE},transform .42s ${EASE}}
.cf-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.cf-root .lx-lb-media{position:relative;overflow:hidden;background:var(--cf-surface2);min-height:300px}
.cf-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cf-root .lx-lb-body{padding:clamp(22px,3vw,42px);display:flex;flex-direction:column;gap:9px;justify-content:center}
.cf-root .lx-lb-cat{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--cf-accentDeep)}
.cf-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(26px,3vw,34px);line-height:1.12;color:var(--cf-ink)}
.cf-root .lx-lb-price{font-family:${DISPLAY};font-size:22px;color:var(--cf-accentDeep)}
.cf-root .lx-lb-desc{color:var(--cf-muted);font-size:13.5px;line-height:1.8}
.cf-root .lx-lb-cta{margin-top:14px;width:fit-content;display:inline-flex;align-items:center;background:var(--cf-accentDeep);color:var(--cf-onAccent);font-size:12px;font-weight:600;letter-spacing:.04em;padding:12px 26px;border-radius:999px;text-decoration:none;transition:background .25s}
.cf-root .lx-lb-cta:hover{background:var(--cf-ink)}
.cf-root .lx-lb-x{position:absolute;top:12px;right:12px;z-index:3;width:42px;height:42px;border-radius:50%;background:var(--cf-surface);border:1px solid var(--cf-line);color:var(--cf-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.cf-root .lx-lb-x:hover{background:var(--cf-accentDeep);color:var(--cf-onAccent);border-color:var(--cf-accentDeep)}
.cf-root .lx-lb-prev,.cf-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:42px;height:42px;border-radius:50%;background:var(--cf-surface);border:1px solid var(--cf-line);color:var(--cf-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.cf-root .lx-lb-prev:hover,.cf-root .lx-lb-next:hover{background:var(--cf-accentDeep);color:var(--cf-onAccent)}
.cf-root .lx-lb-prev{left:10px}.cf-root .lx-lb-next{right:10px}
@media(max-width:640px){.cf-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.cf-root .lx-lb-media{min-height:240px}}

/* ── RASA polish ── */
.cf-btn-primary:active,.cf-nav-cta:active,.cf-about-cta:active{transform:translateY(0) scale(.97)}
.cf-card:active{transform:translateY(-2px)}
.cf-tcar-btn:active{transform:scale(.93)}
.cf-nav-cta:focus-visible,.cf-btn-primary:focus-visible,.cf-btn-ghost:focus-visible,.cf-about-cta:focus-visible,.cf-footer-link:focus-visible,.cf-card:focus-visible,.cf-tcar-btn:focus-visible,.cf-dot-nav:focus-visible,.cf-cta-btns a:focus-visible{outline:3px solid var(--cf-accent);outline-offset:3px}
.cf-hero-sub,.cf-subtext,.cf-about-body,.cf-cta-sub,.cf-feat-desc{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Kata aroma = vibe kopi (BUKAN klaim seperti "terenak"/"termurah"); tampil di
// SEMUA situs Seduh. Klaim spesifik milik klien → konten editabel.
const AROMA = ['Biji Pilihan', 'Diseduh Segar', 'Aroma Hangat', 'Tempat Berlama-lama']

export default function CafeRenderer({ content: c, variant = 'seduh' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.seduh
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
    '--cf-bg': p.bg, '--cf-bg2': p.bg2, '--cf-surface': p.surface, '--cf-surface2': p.surface2,
    '--cf-ink': p.ink, '--cf-inkDim': p.inkDim, '--cf-muted': p.muted,
    '--cf-accent': p.accent, '--cf-accentDeep': p.accentDeep, '--cf-onAccent': p.onAccent,
    '--cf-line': p.line, '--cf-line2': p.line2, '--cf-shadow': p.shadow, '--cf-shadowDeep': p.shadowDeep,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const priceText = (n?: number) => (typeof n === 'number' && n > 0 ? fmt(n) : 'Tanya')

  return (
    <div className="cf-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: cfCss() }} />

      {/* NAV */}
      <nav className="cf-nav" aria-label="Navigasi utama">
        <a href="#beranda" className="cf-nav-logo">{c.nama ?? 'Cafe'}</a>
        <a href={waUrl} className="cf-nav-cta">Pesan</a>
      </nav>

      {/* HERO */}
      <section className="cf-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="cf-hero-text">
          {hero.eyebrow && <p className="cf-eyebrow">{hero.eyebrow}</p>}
          {hero.title && <h1 className="cf-hero-title">{hero.title}</h1>}
          {hero.subtitle && <p className="cf-hero-sub">{hero.subtitle}</p>}
          <div className="cf-hero-btns">
            <a href={hero.ctaHref ?? '#menu'} className="cf-btn-primary">{hero.ctaText ?? 'Lihat Menu'}</a>
            <a href={hero.ctaHref2 ?? waUrl} className="cf-btn-ghost">{hero.ctaText2 ?? 'Pesan Antar'}</a>
          </div>
          {stats.length > 0 && (
            <div className="cf-hero-meta">
              {stats.slice(0, 3).map((s, i) => (
                <div key={i} className="cf-meta-item">
                  <span className="cf-meta-num">{s.angka}</span>
                  <span className="cf-meta-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="cf-hero-media">
          {/* Uap = dekoratif evergreen (hilang saat prefers-reduced-motion). */}
          <div className="cf-steam" aria-hidden><span /><span /><span /></div>
          <div className="cf-hero-frame">
            {hero.image
              ? <img src={hero.image} alt={c.nama ?? 'Cafe'} loading="eager" style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined} />
              : <span aria-hidden style={{ display: 'block', width: '100%', height: '100%' }} />}
          </div>
          {/* Segel kopi-ring evergreen (tak menggemakan eyebrow). */}
          <div className="cf-hero-badge" aria-hidden>Diseduh<br />Tiap Hari</div>
        </div>
      </section>

      {/* AROMA STRIP */}
      <div className="cf-aroma" aria-hidden="true">
        <div className="cf-aroma-row">
          {AROMA.map((m, i) => (
            <span key={i} className="cf-aroma-item">{m}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="cf-section" id="keunggulan">
          <div className="cf-sec-hdr cf-rv lx-reveal">
            <p className="cf-sec-ew">{c.featuresEyebrow ?? 'Kenapa Kami'}</p>
            {c.featuresTitle && <h2 className="cf-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="cf-feat-grid">
            {features.slice(0, 3).map((f, i) => (
              <div key={i} className={`cf-feat-card cf-rv lx-reveal cf-rv-d${i + 1}`}>
                <div className="cf-feat-idx">{String(i + 1)}</div>
                <h3 className="cf-feat-title">{f.title}</h3>
                <p className="cf-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SHOWCASE MENU — kopi-ring harga (signature) */}
      {items.length > 0 && (
        <section className="cf-section cf-showcase" id="menu">
          <div className="cf-sec-hdr cf-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.2rem' }}>
            <p className="cf-sec-ew" style={{ justifyContent: 'center' }}>Menu</p>
            {c.showcase?.title && <h2 className="cf-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="cf-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{c.showcase.subtitle}</p>}
          </div>
          <div className="cf-grid lx-look" data-count={items.length}>
            {items.map((item, i) => (
              <article
                key={i}
                className="cf-card lx-lb-open cf-rv lx-reveal"
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
                <div className="cf-card-frame">
                  {item.kategori && <span className="cf-card-cat">{item.kategori}</span>}
                  <span className="cf-card-tag">{priceText(item.harga)}</span>
                  {item.gambar && <img src={item.gambar} alt={item.nama} loading="lazy" />}
                </div>
                <div className="cf-card-body">
                  <h3 className="cf-card-name">{item.nama}</h3>
                  {item.desc && <p className="cf-card-desc">{item.desc}</p>}
                  <span className="cf-card-more">Lihat &amp; pesan →</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT */}
      {c.statement && (
        <div className="cf-statement">
          <div className="cf-stmt-inner cf-rv lx-reveal">
            {c.statement.eyebrow && <p className="cf-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="cf-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="cf-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="cf-section cf-about" id="tentang">
          <div className={`cf-about-inner${c.about.image ? '' : ' cf-about-solo'}`}>
            <div className="cf-rv lx-reveal">
              <p className="cf-sec-ew">Tentang Kami</p>
              <h2 className="cf-heading">{c.about.title}</h2>
              <p className="cf-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="cf-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="cf-about-img cf-rv lx-reveal cf-rv-d2">
                <div className="cf-about-frame">
                  <img src={c.about.image} alt={c.about.title} loading="lazy" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="cf-section cf-stats">
          <div className="cf-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`cf-stat cf-rv lx-reveal cf-rv-d${i + 1}`}>
                <div className="cf-stat-num" data-cu>{s.angka}</div>
                <div className="cf-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="cf-section cf-testimonials" id="ulasan">
          <div className="cf-sec-hdr cf-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="cf-sec-ew" style={{ justifyContent: 'center' }}>Ulasan</p>
            <h2 className="cf-heading">Kata Pelanggan</h2>
          </div>
          <div className="cf-tcar lx-tcar">
            <div className="cf-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="cf-test-card">
                  <div className="cf-test-mark" aria-hidden>&ldquo;</div>
                  <p className="cf-test-quote">{t.quote}</p>
                  <p className="cf-test-name">{t.nama}</p>
                  {t.peran && <p className="cf-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="cf-tcar-ctrl">
                <button className="cf-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="cf-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="cf-dot-nav lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="cf-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="cf-section cf-faq" id="faq">
          <div className="cf-sec-hdr cf-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="cf-sec-ew" style={{ justifyContent: 'center' }}>Pertanyaan</p>
            <h2 className="cf-heading">Sering Ditanyakan</h2>
          </div>
          <div className="cf-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="cf-faq-item">
                <button
                  className="cf-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`cf-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="cf-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="cf-section cf-cta" id="pesan">
          <div className="cf-cta-inner cf-rv lx-reveal">
            <h2 className="cf-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="cf-cta-sub">{c.cta.subtitle}</p>}
            <div className="cf-cta-btns">
              <a href={waUrl} className="cf-btn-primary">{c.cta.ctaText ?? 'Pesan via WhatsApp'}</a>
              <a href="#menu" className="cf-btn-ghost">Lihat Menu</a>
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON */}
      {(c.bands ?? []).map((b, i) => (
        <section className="cf-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="cf-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="cf-heading">{b.title}</h2>
            {b.subtitle && <p className="cf-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="cf-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="cf-footer">
        <div className="cf-footer-grid">
          <div>
            <p className="cf-footer-brand">{c.nama ?? 'Cafe'}</p>
            <p className="cf-footer-tagline">
              {hero.eyebrow ?? `${c.nama ?? 'Cafe'} — tempat menyeduh hari yang baik.`}
            </p>
          </div>
          <div>
            <p className="cf-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="cf-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="cf-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="cf-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="cf-footer-h">Jam Buka</p>
            {jamRows.length
              ? jamRows.map((j, i) => <p key={i} className="cf-footer-link">{j.hari}: {j.jam}</p>)
              : (
                <>
                  <p className="cf-footer-link">Setiap hari: 08.00–22.00</p>
                </>
              )}
          </div>
        </div>
        <p className="cf-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Cafe'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX */}
      <BespokeLightbox ctaText="Pesan via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
