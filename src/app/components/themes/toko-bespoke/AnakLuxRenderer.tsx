'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// CERIA — Toko Bayi & Anak / Mainan Bespoke Lux Renderer (Playful Friendly)
// Fredoka (display, rounded) + Nunito (body) |
// Warm-white #FFFCF5 · Sky #2491C8 / #176F9E · Ink-navy #1E3147 |
// pop: coral #FF6B5C · sunny #FFC23C · mint #3CC9A8 |
// signature: kartu "stiker" (tag kategori menempel miring + peel) + bingkai blob
// | motif: blob organik + confetti titik warna | ns: an-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.an-*`.
// Playful-bright rounded — sengaja kontras dgn tema lain (semua gelap/earthy/
// elegant). Light palette → contrast.test menjaga WCAG (ink navy AAA, sky accentDeep).
// ============================================================

export interface AnPal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentDeep: string; onAccent: string
  line: string; line2: string; shadow: string; shadowDeep: string
}

export const PALETTES: Record<string, AnPal> = {
  // Ceria — warm-white ceria, aksen langit, tinta navy ramah.
  ceria: {
    bg: '#FFFCF5', bg2: '#FFF3E2', surface: '#FFFFFF', surface2: '#EAF6FC',
    ink: '#1E3147', inkDim: '#3C5468', muted: '#566879',
    accent: '#2491C8', accentDeep: '#176F9E', onAccent: '#FFFFFF',
    line: 'rgba(30,49,71,.12)', line2: 'rgba(30,49,71,.07)',
    shadow: 'rgba(30,49,71,.12)', shadowDeep: 'rgba(30,49,71,.2)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap'
const DISPLAY = '"Fredoka","Trebuchet MS",sans-serif'
const BODY = '"Nunito","Segoe UI",sans-serif'
const EASE = 'cubic-bezier(.22,1,.36,1)'
const BOUNCE = 'cubic-bezier(.34,1.56,.64,1)'
// Pop dekoratif (fill blob/confetti/tag; teks di atasnya pakai ink — ink-on-pop ≥4.5).
const CORAL = '#FF6B5C'
const SUNNY = '#FFC23C'
const MINT = '#3CC9A8'

function anCss(): string {
  return `
@import url('${FONT_IMPORT}');
html,body{overflow-x:hidden;max-width:100%}
.an-root{font-family:${BODY};color:var(--an-ink);background:var(--an-bg);line-height:1.7;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.an-root *,.an-root *::before,.an-root *::after{box-sizing:border-box;margin:0;padding:0}
.an-root img{max-width:100%;height:auto;display:block}
.an-root ::selection{background:rgba(36,145,200,.22);color:var(--an-ink)}

/* Bingkai blob organik (motif) */
.an-blob{position:relative;overflow:hidden;background:var(--an-surface2);border-radius:46% 54% 52% 48% / 52% 46% 54% 48%}
.an-blob img{width:100%;height:100%;object-fit:cover}
/* Confetti — titik warna dekoratif */
.an-dot{position:absolute;border-radius:50%;pointer-events:none}

/* NAV */
.an-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.1rem 7vw;display:flex;align-items:center;justify-content:space-between;transition:background .45s,box-shadow .45s,backdrop-filter .45s,padding .45s}
.an-root.lx-scrolled .an-nav{background:rgba(255,252,245,.85);backdrop-filter:blur(11px);box-shadow:0 2px 0 var(--an-line2);padding-top:.85rem;padding-bottom:.85rem}
.an-nav-logo{font-family:${DISPLAY};font-weight:700;letter-spacing:-.01em;color:var(--an-ink);font-size:1.55rem;text-decoration:none;display:flex;align-items:center;gap:.5rem}
.an-nav-logo::before{content:'';width:13px;height:13px;border-radius:50%;background:var(--an-accent);box-shadow:6px -3px 0 -2px ${SUNNY},-6px 3px 0 -2px ${CORAL}}
.an-nav-cta{font-family:${DISPLAY};font-size:.86rem;font-weight:600;letter-spacing:.01em;color:var(--an-onAccent);background:var(--an-accentDeep);padding:.68rem 1.5rem;border-radius:999px;text-decoration:none;transition:transform .3s ${BOUNCE},background .3s}
.an-nav-cta:hover{transform:translateY(-2px) scale(1.03);background:var(--an-ink)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO — bento ceria: teks + klaster media membulat + confetti */
.an-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:clamp(2rem,5vw,4.5rem);padding:8.5rem 7vw 4.5rem;background:var(--an-bg)}
.an-hero-text{position:relative;z-index:2}
.an-hero-ew{font-family:${DISPLAY};font-size:.84rem;font-weight:600;letter-spacing:.04em;color:var(--an-accentDeep);margin-bottom:1.1rem;display:inline-flex;align-items:center;gap:.5rem;background:var(--an-surface2);padding:.4rem 1rem;border-radius:999px}
.an-hero-ew::before{content:'✿';color:${CORAL};font-size:1rem}
.an-hero-title{font-family:${DISPLAY};font-size:clamp(2.7rem,6.2vw,5rem);font-weight:700;line-height:1.04;color:var(--an-ink);margin-bottom:1.4rem;letter-spacing:-.02em}
.an-hero-title span{display:inline;opacity:1}
@media(prefers-reduced-motion:no-preference){.an-hero-title span{animation:anPop .7s ${BOUNCE} both;animation-delay:var(--an-d,0ms)}}
@keyframes anPop{from{opacity:0;transform:translateY(14px) scale(.92)}to{opacity:1;transform:none}}
.an-hero-title em{font-style:normal;color:var(--an-accent);position:relative}
.an-hero-title em::after{content:'';position:absolute;left:0;right:0;bottom:.06em;height:.28em;background:${SUNNY};border-radius:999px;z-index:-1;opacity:.65}
.an-hero-sub{font-size:1.1rem;color:var(--an-inkDim);margin-bottom:2rem;max-width:44ch;line-height:1.8}
.an-hero-btns{display:flex;gap:.9rem;flex-wrap:wrap;align-items:center;margin-bottom:2.3rem}
.an-btn-primary{font-family:${DISPLAY};font-size:.95rem;font-weight:600;background:var(--an-accentDeep);color:var(--an-onAccent);padding:.95rem 2rem;border-radius:999px;text-decoration:none;transition:transform .3s ${BOUNCE},background .3s,box-shadow .3s;box-shadow:0 8px 20px var(--an-shadow)}
.an-btn-primary:hover{transform:translateY(-3px) scale(1.03);background:var(--an-ink);box-shadow:0 14px 30px var(--an-shadowDeep)}
.an-btn-ghost{font-family:${DISPLAY};font-size:.95rem;font-weight:600;color:var(--an-ink);padding:.95rem 1.5rem;text-decoration:none;border-radius:999px;border:2px solid var(--an-line);transition:border-color .3s,color .3s,transform .3s ${BOUNCE}}
.an-btn-ghost:hover{border-color:var(--an-accent);color:var(--an-accentDeep);transform:translateY(-2px)}
.an-hero-meta{display:flex;flex-wrap:wrap;gap:1.6rem}
.an-meta-item{display:flex;flex-direction:column;gap:.1rem}
.an-meta-num{font-family:${DISPLAY};font-size:1.6rem;font-weight:700;color:var(--an-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.an-meta-label{font-size:.76rem;color:var(--an-muted);font-weight:600}
/* Media bento */
.an-hero-media{position:relative;z-index:1;display:grid;grid-template-columns:1.4fr .9fr;grid-template-rows:1fr 1fr;gap:.9rem;min-height:440px}
.an-hero-main{grid-row:1/3;position:relative;border-radius:32px;overflow:hidden;box-shadow:0 30px 60px var(--an-shadowDeep)}
.an-hero-main img{width:100%;height:100%;object-fit:cover}
.an-hero-cell{border-radius:26px;display:flex;flex-direction:column;justify-content:center;padding:1.2rem;color:var(--an-ink)}
.an-hero-cell-1{background:${SUNNY}}
.an-hero-cell-2{background:${MINT}}
.an-hero-cell b{font-family:${DISPLAY};font-size:1.7rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
.an-hero-cell span{font-size:.78rem;font-weight:700;margin-top:.25rem}
.an-hero-cell-emoji{font-size:1.9rem;margin-bottom:.3rem}
.an-hero .an-dot-a{width:22px;height:22px;background:${CORAL};top:5.5rem;right:1rem}
.an-hero .an-dot-b{width:14px;height:14px;background:${MINT};bottom:3rem;left:48%}
.an-hero .an-dot-c{width:30px;height:30px;background:${SUNNY};opacity:.5;top:7rem;left:-.5rem}
@media(max-width:860px){
  .an-hero{grid-template-columns:1fr;min-height:unset;padding:7rem 7vw 3rem;text-align:center}
  .an-hero-title{font-size:clamp(2.3rem,10vw,3.4rem)}
  .an-hero-media{order:-1;margin-bottom:.5rem;min-height:340px;max-width:440px;margin-left:auto;margin-right:auto}
  .an-hero-sub{margin-left:auto;margin-right:auto}
  .an-hero-btns,.an-hero-meta,.an-hero-ew{justify-content:center}
  .an-hero-ew{display:inline-flex}
}
@media(max-width:560px){.an-nav{padding:.9rem 6vw}.an-hero-media{grid-template-columns:1.3fr .9fr}}

/* PITA — pil kata ceria (mood/kategori, BUKAN klaim) ganti marquee */
.an-ribbon{background:var(--an-bg2);padding:1.3rem 7vw}
.an-ribbon-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.7rem}
.an-ribbon-item{font-family:${DISPLAY};font-size:.84rem;font-weight:600;color:var(--an-ink);background:var(--an-surface);border:2px solid var(--an-line2);padding:.42rem 1.05rem;border-radius:999px}
.an-ribbon-item:nth-child(3n+1){background:${SUNNY}}
.an-ribbon-item:nth-child(3n+2){background:${MINT}}
.an-ribbon-item:nth-child(3n){background:${CORAL}}

/* SECTION COMMONS */
.an-section{padding:clamp(4.2rem,8vw,7rem) 7vw}
.an-eyebrow{font-family:${DISPLAY};font-size:.84rem;font-weight:600;letter-spacing:.02em;color:var(--an-accentDeep);margin-bottom:.9rem;display:inline-flex;align-items:center;gap:.5rem}
.an-eyebrow::before{content:'';width:1.4rem;height:4px;border-radius:999px;background:var(--an-accent)}
.an-heading{font-family:${DISPLAY};font-size:clamp(2rem,3.8vw,3.1rem);font-weight:700;color:var(--an-ink);line-height:1.12;letter-spacing:-.015em;text-wrap:balance}
.an-subtext{color:var(--an-inkDim);font-size:1.02rem;margin-top:.9rem;max-width:54ch;line-height:1.8}
.an-sec-hdr{margin-bottom:3.2rem;max-width:60ch}

/* FEATURES — kartu ceria ber-ikon pop */
.an-feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.4rem}
.an-feat-card{padding:2rem 1.5rem;background:var(--an-surface);border:2px solid var(--an-line2);border-radius:24px;transition:transform .35s ${BOUNCE},box-shadow .35s,border-color .35s}
.an-feat-card:hover{transform:translateY(-6px) rotate(-1deg);box-shadow:0 22px 44px var(--an-shadow);border-color:var(--an-accent)}
.an-feat-idx{font-family:${DISPLAY};font-size:1.5rem;font-weight:700;color:var(--an-ink);width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;border-radius:50%;margin-bottom:1.2rem}
.an-feat-card:nth-child(4n+1) .an-feat-idx{background:${SUNNY}}
.an-feat-card:nth-child(4n+2) .an-feat-idx{background:${MINT}}
.an-feat-card:nth-child(4n+3) .an-feat-idx{background:${CORAL}}
.an-feat-card:nth-child(4n) .an-feat-idx{background:var(--an-surface2)}
.an-feat-title{font-family:${DISPLAY};font-size:1.2rem;font-weight:600;color:var(--an-ink);margin-bottom:.45rem;line-height:1.25}
.an-feat-desc{font-size:.9rem;color:var(--an-muted);line-height:1.7}
@media(max-width:900px){.an-feat-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.an-feat-grid{grid-template-columns:1fr}}

/* STATEMENT — panel ceria membulat */
.an-statement{padding:clamp(3.5rem,7vw,6rem) 7vw}
.an-stmt-inner{position:relative;max-width:60ch;margin:0 auto;background:var(--an-surface2);border-radius:36px;padding:clamp(2.5rem,5vw,4rem);text-align:center;overflow:hidden}
.an-stmt-inner .an-dot-a{width:60px;height:60px;background:${SUNNY};opacity:.4;top:-1rem;left:-1rem}
.an-stmt-inner .an-dot-b{width:42px;height:42px;background:${CORAL};opacity:.4;bottom:-.6rem;right:1.5rem}
.an-stmt-ew{font-family:${DISPLAY};font-size:.8rem;font-weight:600;letter-spacing:.04em;color:var(--an-accentDeep);margin-bottom:1rem;position:relative}
.an-stmt-quote{font-family:${DISPLAY};font-size:clamp(1.5rem,3vw,2.3rem);font-weight:600;color:var(--an-ink);line-height:1.3;letter-spacing:-.01em;position:relative}
.an-stmt-cite{display:block;font-size:.82rem;color:var(--an-muted);font-weight:600;margin-top:1.2rem;position:relative}

/* SHOWCASE — signature: kartu "stiker" (tag menempel miring) + quick-look */
.an-showcase{background:var(--an-bg2)}
.an-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.4rem,3vw,2.1rem)}
.an-grid[data-count="1"]{grid-template-columns:minmax(0,380px);justify-content:center}
.an-grid[data-count="2"]{grid-template-columns:repeat(2,minmax(0,360px));justify-content:center;max-width:820px;margin:0 auto}
.an-card{position:relative;cursor:pointer;background:var(--an-surface);border:2px solid var(--an-line2);border-radius:26px;padding:.85rem;transition:transform .4s ${BOUNCE},box-shadow .4s,border-color .4s}
.an-card:hover{transform:translateY(-7px) rotate(-1deg);box-shadow:0 26px 52px var(--an-shadow);border-color:var(--an-accent)}
.an-card-frame{position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:20px;background:var(--an-surface2)}
.an-card-frame img{width:100%;height:100%;object-fit:cover;transition:transform .6s ${EASE}}
.an-card:hover .an-card-frame img{transform:scale(1.06)}
.an-card-sticker{position:absolute;top:.7rem;left:.7rem;z-index:2;font-family:${DISPLAY};font-size:.64rem;font-weight:700;letter-spacing:.02em;text-transform:uppercase;color:var(--an-ink);background:${SUNNY};padding:.34rem .72rem;border-radius:999px;transform:rotate(-6deg);box-shadow:0 4px 10px var(--an-shadow)}
.an-card:nth-child(3n+2) .an-card-sticker{background:${MINT}}
.an-card:nth-child(3n) .an-card-sticker{background:${CORAL}}
.an-card-body{padding:1.1rem .6rem .5rem}
.an-card-name{font-family:${DISPLAY};font-size:1.18rem;font-weight:600;color:var(--an-ink);margin-bottom:.25rem;line-height:1.25}
.an-card-desc{font-size:.84rem;color:var(--an-muted);margin-bottom:.8rem;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.an-card-foot{display:flex;align-items:center;gap:.6rem}
.an-card-price{font-family:${DISPLAY};font-size:1.18rem;font-weight:700;color:var(--an-accentDeep)}
.an-card-sep{flex:1;border-bottom:2px dotted var(--an-line2)}
.an-card-ql{font-size:.74rem;font-weight:700;color:var(--an-muted);transition:color .3s}
.an-card:hover .an-card-ql{color:var(--an-accentDeep)}
@media(max-width:980px){.an-grid{grid-template-columns:repeat(2,1fr)}.an-grid[data-count="1"]{grid-template-columns:minmax(0,380px)}}
@media(max-width:560px){.an-grid,.an-grid[data-count="1"],.an-grid[data-count="2"]{grid-template-columns:1fr;max-width:360px;margin:0 auto}}

/* ABOUT — split ceria + bingkai blob */
.an-about{background:var(--an-bg)}
.an-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:center}
.an-about-inner.an-about-solo{grid-template-columns:1fr;max-width:60ch;margin:0 auto;text-align:center}
.an-about-solo .an-eyebrow{justify-content:center}
.an-about-solo .an-about-body{margin-left:auto;margin-right:auto}
.an-about-body{font-size:1.02rem;color:var(--an-inkDim);line-height:1.9;margin-top:1.1rem;white-space:pre-line}
.an-about-cta{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.7rem;font-family:${DISPLAY};font-size:.92rem;font-weight:600;color:var(--an-onAccent);background:var(--an-accentDeep);padding:.8rem 1.7rem;border-radius:999px;text-decoration:none;transition:gap .3s,transform .3s ${BOUNCE},background .3s}
.an-about-cta:hover{gap:.8rem;transform:translateY(-2px);background:var(--an-ink)}
.an-about-img{position:relative}
.an-about-frame{position:relative;z-index:1;aspect-ratio:1/1;box-shadow:0 28px 60px var(--an-shadowDeep)}
.an-about-frame .an-blob{width:100%;height:100%}
.an-about-img .an-dot-a{width:34px;height:34px;background:${SUNNY};top:1rem;right:-.5rem;z-index:2}
.an-about-img .an-dot-b{width:20px;height:20px;background:${CORAL};bottom:2rem;left:-.8rem;z-index:2}
@media(max-width:840px){.an-about-inner{grid-template-columns:1fr;gap:2.5rem}.an-about-img{order:-1;max-width:340px;margin:0 auto}}

/* STATS — angka ceria ber-countUp dalam pil */
.an-stats{background:var(--an-bg2)}
.an-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3rem;text-align:center}
.an-stat{background:var(--an-surface);border:2px solid var(--an-line2);border-radius:24px;padding:1.8rem 1rem}
.an-stat-num{font-family:${DISPLAY};font-size:clamp(2.2rem,4.4vw,3rem);font-weight:700;color:var(--an-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.an-stat-label{font-size:.78rem;color:var(--an-muted);font-weight:600;margin-top:.6rem}
@media(max-width:560px){.an-stats-grid{grid-template-columns:repeat(2,1fr);gap:1rem}}

/* TESTIMONIALS — carousel scroll-snap (lx-tcar) */
.an-testimonials{background:var(--an-bg)}
.an-tcar{position:relative}
.an-tcar-track{display:flex;gap:1.2rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .25rem 1.5rem;-ms-overflow-style:none;scrollbar-width:none}
.an-tcar-track::-webkit-scrollbar{display:none}
.an-test-card{scroll-snap-align:start;background:var(--an-surface);border:2px solid var(--an-line2);border-radius:24px;padding:2rem;min-width:300px;max-width:360px;flex:0 0 auto;box-shadow:0 12px 28px var(--an-shadow)}
.an-test-mark{font-family:${DISPLAY};font-size:2.4rem;font-weight:700;color:${CORAL};line-height:.5;margin-bottom:.6rem}
.an-test-quote{font-size:1rem;color:var(--an-inkDim);line-height:1.7;margin:0 0 1.3rem}
.an-test-name{font-family:${DISPLAY};font-weight:600;font-size:1rem;color:var(--an-ink)}
.an-test-role{font-size:.78rem;color:var(--an-muted);font-weight:600;margin-top:.15rem}
.an-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1.1rem;margin-top:1.4rem}
.an-tcar-btn{width:44px;height:44px;border-radius:50%;background:var(--an-surface);border:2px solid var(--an-line2);color:var(--an-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s,border-color .25s,opacity .25s,transform .25s ${BOUNCE}}
.an-tcar-btn:hover:not(:disabled){background:var(--an-accentDeep);color:var(--an-onAccent);border-color:var(--an-accentDeep);transform:scale(1.08)}
.an-tcar-btn:disabled{opacity:.3;cursor:default}
.an-tcar-dots{display:flex;gap:.5rem;align-items:center}
.an-dot-nav{width:8px;height:8px;border-radius:50%;background:var(--an-line);border:none;padding:0;cursor:pointer;transition:background .25s,transform .25s}
.an-dot-nav[aria-current="true"]{background:var(--an-accent);transform:scale(1.5)}

/* FAQ */
.an-faq{background:var(--an-bg2)}
.an-faq-wrap{max-width:760px;margin:0 auto}
.an-faq-item{background:var(--an-surface);border:2px solid var(--an-line2);border-radius:18px;margin-bottom:.8rem;overflow:hidden}
.an-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.25rem 1.4rem;cursor:pointer;font-family:${DISPLAY};font-size:1.08rem;font-weight:600;color:var(--an-ink);background:none;border:none;text-align:left}
.an-faq-q:focus-visible{outline:2px solid var(--an-accentDeep);outline-offset:-2px;border-radius:14px}
.an-faq-icon{font-size:1.4rem;color:var(--an-accentDeep);flex-shrink:0;transition:transform .3s ${BOUNCE};line-height:1}
.an-faq-icon.open{transform:rotate(45deg)}
.an-faq-a{font-size:.95rem;color:var(--an-inkDim);line-height:1.8;padding:0 1.4rem 1.3rem;max-width:64ch}

/* CTA — panel ceria membulat + confetti */
.an-cta{background:var(--an-bg)}
.an-cta-inner{position:relative;background:var(--an-accentDeep);color:var(--an-onAccent);border-radius:36px;padding:clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem);text-align:center;overflow:hidden}
.an-cta-inner .an-dot-a{width:70px;height:70px;background:${SUNNY};opacity:.7;top:-1.5rem;right:2rem}
.an-cta-inner .an-dot-b{width:40px;height:40px;background:${CORAL};opacity:.8;bottom:1rem;left:2.5rem}
.an-cta-inner .an-dot-c{width:24px;height:24px;background:${MINT};top:2.5rem;left:18%}
.an-cta-title{position:relative;font-family:${DISPLAY};font-size:clamp(2rem,4.4vw,3.1rem);font-weight:700;margin-bottom:.9rem;line-height:1.14;letter-spacing:-.015em;text-wrap:balance}
.an-cta-sub{position:relative;font-size:1.05rem;opacity:.92;max-width:48ch;margin:0 auto 2.2rem;line-height:1.8}
.an-cta-btns{position:relative;display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap}
.an-cta .an-btn-primary{background:var(--an-surface);color:var(--an-accentDeep);box-shadow:0 8px 20px rgba(0,0,0,.18)}
.an-cta .an-btn-primary:hover{background:${SUNNY};color:var(--an-ink)}
.an-cta .an-btn-ghost{color:var(--an-onAccent);border-color:rgba(255,255,255,.5)}
.an-cta .an-btn-ghost:hover{color:var(--an-onAccent);border-color:#fff}

/* BAND ADD-ON */
.an-band{background:var(--an-surface);border-top:2px solid var(--an-line2);border-bottom:2px solid var(--an-line2);padding:3.2rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.4rem}
.an-band-ew{font-family:${DISPLAY};font-size:.74rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--an-accentDeep);margin-bottom:.5rem}
.an-band .an-heading{font-size:clamp(1.5rem,2.4vw,2.1rem)}
.an-band-sub{color:var(--an-muted);font-size:.95rem;line-height:1.6;margin-top:.5rem;max-width:56ch}

/* FOOTER */
.an-footer{background:var(--an-bg2);color:var(--an-inkDim);padding:4.2rem 7vw 2.4rem;border-top:2px solid var(--an-line2)}
.an-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.6rem}
.an-footer-brand{font-family:${DISPLAY};font-size:1.7rem;font-weight:700;color:var(--an-ink);margin-bottom:.8rem;display:flex;align-items:center;gap:.5rem}
.an-footer-brand::before{content:'';width:13px;height:13px;border-radius:50%;background:var(--an-accent);box-shadow:6px -3px 0 -2px ${SUNNY},-6px 3px 0 -2px ${CORAL}}
.an-footer-tagline{font-size:.9rem;color:var(--an-muted);line-height:1.7;max-width:34ch}
.an-footer-h{font-family:${DISPLAY};font-size:.78rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--an-ink);margin-bottom:1rem}
.an-footer-link{display:block;font-size:.9rem;color:var(--an-inkDim);text-decoration:none;margin-bottom:.55rem;transition:color .25s}
.an-footer-link:hover{color:var(--an-accentDeep)}
.an-footer-copy{border-top:2px solid var(--an-line2);padding-top:1.5rem;font-size:.8rem;color:var(--an-muted);text-align:center}
@media(max-width:768px){.an-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* REVEAL — via LUX_JS (.lx-reveal → .lx-in), digate .lx-js (kontrak no-JS #138) */
.lx-js .an-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ${EASE},transform .7s ${EASE}}
.lx-js .an-rv.lx-in{opacity:1;transform:none}
.an-rv-d1{transition-delay:.08s}.an-rv-d2{transition-delay:.16s}.an-rv-d3{transition-delay:.24s}.an-rv-d4{transition-delay:.32s}

/* LIGHTBOX — an-root overrides palet lx-lb (ceria/rounded) */
.an-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.an-root .lx-lb[hidden]{display:none}
.an-root .lx-lb-back{position:absolute;inset:0;background:rgba(30,49,71,.5);backdrop-filter:blur(6px);border:0;cursor:pointer}
.an-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--an-surface);border:2px solid var(--an-line2);border-radius:28px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .42s ${EASE},transform .42s ${EASE}}
.an-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.an-root .lx-lb-media{position:relative;overflow:hidden;background:var(--an-surface2);min-height:300px}
.an-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.an-root .lx-lb-body{padding:clamp(22px,3vw,42px);display:flex;flex-direction:column;gap:9px;justify-content:center}
.an-root .lx-lb-cat{font-family:${DISPLAY};font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--an-accentDeep)}
.an-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(22px,2.6vw,30px);font-weight:600;line-height:1.2;color:var(--an-ink)}
.an-root .lx-lb-price{font-family:${DISPLAY};font-size:20px;font-weight:700;color:var(--an-accentDeep)}
.an-root .lx-lb-desc{color:var(--an-muted);font-size:13.5px;line-height:1.8}
.an-root .lx-lb-cta{margin-top:14px;width:fit-content;display:inline-flex;align-items:center;background:var(--an-accentDeep);color:var(--an-onAccent);font-family:${DISPLAY};font-size:13px;font-weight:600;padding:12px 26px;border-radius:999px;text-decoration:none;transition:background .25s}
.an-root .lx-lb-cta:hover{background:var(--an-ink)}
.an-root .lx-lb-x{position:absolute;top:12px;right:12px;z-index:3;width:40px;height:40px;border-radius:50%;background:var(--an-surface);border:2px solid var(--an-line2);color:var(--an-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.an-root .lx-lb-x:hover{background:var(--an-accentDeep);color:var(--an-onAccent);border-color:var(--an-accentDeep)}
.an-root .lx-lb-prev,.an-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:40px;height:40px;border-radius:50%;background:var(--an-surface);border:2px solid var(--an-line2);color:var(--an-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.an-root .lx-lb-prev:hover,.an-root .lx-lb-next:hover{background:var(--an-accentDeep);color:var(--an-onAccent)}
.an-root .lx-lb-prev{left:8px}.an-root .lx-lb-next{right:8px}
@media(max-width:640px){.an-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.an-root .lx-lb-media{min-height:230px}}

/* ── RASA polish ── */
.an-btn-primary:active,.an-nav-cta:active,.an-about-cta:active{transform:translateY(0) scale(.96)}
.an-card:active{transform:translateY(-3px) scale(.99)}
.an-tcar-btn:active{transform:scale(.92)}
.an-nav-cta:focus-visible,.an-btn-primary:focus-visible,.an-btn-ghost:focus-visible,.an-about-cta:focus-visible,.an-footer-link:focus-visible,.an-card:focus-visible,.an-tcar-btn:focus-visible,.an-dot-nav:focus-visible,.an-cta-btns a:focus-visible{outline:3px solid var(--an-accent);outline-offset:3px}
.an-hero-sub,.an-subtext,.an-about-body,.an-cta-sub,.an-feat-desc,.an-test-quote{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Kata pita ceria (kategori/aktivitas/mood) — BUKAN klaim verifiable; tampil di
// SEMUA situs Ceria. Klaim spesifik (aman/SNI/dll) milik klien → konten editabel.
const RIBBON = ['Mainan', 'Bayi', 'Belajar', 'Bermain', 'Ceria', 'Hadiah']

export default function AnakLuxRenderer({ content: c, variant = 'ceria' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.ceria
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
    '--an-bg': p.bg, '--an-bg2': p.bg2, '--an-surface': p.surface, '--an-surface2': p.surface2,
    '--an-ink': p.ink, '--an-inkDim': p.inkDim, '--an-muted': p.muted,
    '--an-accent': p.accent, '--an-accentDeep': p.accentDeep, '--an-onAccent': p.onAccent,
    '--an-line': p.line, '--an-line2': p.line2, '--an-shadow': p.shadow, '--an-shadowDeep': p.shadowDeep,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const words = (hero.title ?? '').split(' ')

  return (
    <div className="an-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: anCss() }} />

      {/* NAV */}
      <nav className="an-nav" aria-label="Navigasi utama">
        <span className="an-nav-logo">{c.nama ?? 'Ceria'}</span>
        <a href={waUrl} className="an-nav-cta">Tanya Produk</a>
      </nav>

      {/* HERO — bento ceria */}
      <section className="an-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <span className="an-dot an-dot-a" aria-hidden />
        <span className="an-dot an-dot-b" aria-hidden />
        <span className="an-dot an-dot-c" aria-hidden />
        <div className="an-hero-text">
          {hero.eyebrow && <p className="an-hero-ew">{hero.eyebrow}</p>}
          {hero.title && (
            <h1 className="an-hero-title" aria-label={hero.title}>
              {words.map((w, i) => (
                <span key={i} style={{ '--an-d': `${140 + i * 65}ms` } as React.CSSProperties}>
                  {w}{' '}
                </span>
              ))}
            </h1>
          )}
          {hero.subtitle && <p className="an-hero-sub">{hero.subtitle}</p>}
          <div className="an-hero-btns">
            {hero.ctaHref && (
              <a href={hero.ctaHref} className="an-btn-primary lx-mag">{hero.ctaText ?? 'Lihat Produk'}</a>
            )}
            <a href={hero.ctaHref2 ?? waUrl} className="an-btn-ghost">{hero.ctaText2 ?? 'Tanya Kami'}</a>
          </div>
          {stats.length > 0 && (
            <div className="an-hero-meta">
              {stats.slice(0, 3).map((s, i) => (
                <div key={i} className="an-meta-item">
                  <span className="an-meta-num">{s.angka}</span>
                  <span className="an-meta-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {hero.image && (
          <div className="an-hero-media">
            <div className="an-hero-main">
              <img
                src={hero.image}
                alt={c.nama ?? 'Mainan & perlengkapan anak'}
                loading="eager"
                style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
              />
            </div>
            <div className="an-hero-cell an-hero-cell-1">
              {stats[0] ? (
                <>
                  <b>{stats[0].angka}</b>
                  <span>{stats[0].label}</span>
                </>
              ) : (
                <span className="an-hero-cell-emoji" aria-hidden>★</span>
              )}
            </div>
            <div className="an-hero-cell an-hero-cell-2">
              {stats[1] ? (
                <>
                  <b>{stats[1].angka}</b>
                  <span>{stats[1].label}</span>
                </>
              ) : (
                <span className="an-hero-cell-emoji" aria-hidden>✿</span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* PITA kata ceria */}
      <div className="an-ribbon" aria-hidden="true">
        <div className="an-ribbon-row">
          {RIBBON.map((m, i) => (
            <span key={i} className="an-ribbon-item">{m}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="an-section" id="keunggulan">
          <div className="an-sec-hdr an-rv lx-reveal">
            <p className="an-eyebrow">{c.featuresEyebrow ?? 'Kenapa Kami'}</p>
            {c.featuresTitle && <h2 className="an-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="an-feat-grid">
            {features.slice(0, 4).map((f, i) => (
              <div key={i} className={`an-feat-card an-rv lx-reveal an-rv-d${i + 1}`}>
                <div className="an-feat-idx">{String(i + 1)}</div>
                <h3 className="an-feat-title">{f.title}</h3>
                <p className="an-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT */}
      {c.statement && (
        <div className="an-statement">
          <div className="an-stmt-inner an-rv lx-reveal">
            <span className="an-dot an-dot-a" aria-hidden />
            <span className="an-dot an-dot-b" aria-hidden />
            {c.statement.eyebrow && <p className="an-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="an-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="an-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* SHOWCASE — kartu stiker (signature) */}
      {items.length > 0 && (
        <section className="an-section an-showcase" id="produk">
          <div className="an-sec-hdr an-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.2rem' }}>
            <p className="an-eyebrow" style={{ justifyContent: 'center' }}>Etalase</p>
            {c.showcase?.title && <h2 className="an-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="an-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{c.showcase.subtitle}</p>}
          </div>
          <div className="an-grid lx-look" data-count={items.length}>
            {items.map((item, i) => (
              <article
                key={i}
                className="an-card lx-lb-open an-rv lx-reveal"
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
                <div className="an-card-frame">
                  {item.kategori && <span className="an-card-sticker">{item.kategori}</span>}
                  {item.gambar && <img src={item.gambar} alt={item.nama} loading="lazy" />}
                </div>
                <div className="an-card-body">
                  <h3 className="an-card-name">{item.nama}</h3>
                  {item.desc && <p className="an-card-desc">{item.desc}</p>}
                  <div className="an-card-foot">
                    <span className="an-card-price">{fmt(item.harga ?? 0)}</span>
                    <span className="an-card-sep" aria-hidden />
                    <span className="an-card-ql">Lihat detail</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="an-section an-about" id="tentang">
          <div className={`an-about-inner${c.about.image ? '' : ' an-about-solo'}`}>
            <div className="an-rv lx-reveal">
              <p className="an-eyebrow">Tentang Kami</p>
              <h2 className="an-heading">{c.about.title}</h2>
              <p className="an-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="an-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="an-about-img an-rv lx-reveal an-rv-d2">
                <span className="an-dot an-dot-a" aria-hidden />
                <span className="an-dot an-dot-b" aria-hidden />
                <div className="an-about-frame">
                  <div className="an-blob">
                    <img src={c.about.image} alt={c.about.title} loading="lazy" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="an-section an-stats">
          <div className="an-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`an-stat an-rv lx-reveal an-rv-d${i + 1}`}>
                <div className="an-stat-num" data-cu>{s.angka}</div>
                <div className="an-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="an-section an-testimonials" id="ulasan">
          <div className="an-sec-hdr an-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="an-eyebrow" style={{ justifyContent: 'center' }}>Ulasan</p>
            <h2 className="an-heading">Kata Bunda & Ayah</h2>
          </div>
          <div className="an-tcar lx-tcar">
            <div className="an-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="an-test-card">
                  <div className="an-test-mark" aria-hidden>&ldquo;</div>
                  <p className="an-test-quote">{t.quote}</p>
                  <p className="an-test-name">{t.nama}</p>
                  {t.peran && <p className="an-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="an-tcar-ctrl">
                <button className="an-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="an-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="an-dot-nav lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="an-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="an-section an-faq" id="faq">
          <div className="an-sec-hdr an-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="an-eyebrow" style={{ justifyContent: 'center' }}>Pertanyaan</p>
            <h2 className="an-heading">Sering Ditanyakan</h2>
          </div>
          <div className="an-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="an-faq-item">
                <button
                  className="an-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`an-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="an-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="an-section an-cta" id="pesan">
          <div className="an-cta-inner an-rv lx-reveal">
            <span className="an-dot an-dot-a" aria-hidden />
            <span className="an-dot an-dot-b" aria-hidden />
            <span className="an-dot an-dot-c" aria-hidden />
            <h2 className="an-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="an-cta-sub">{c.cta.subtitle}</p>}
            <div className="an-cta-btns">
              <a href={waUrl} className="an-btn-primary lx-mag">{c.cta.ctaText ?? 'Pesan via WhatsApp'}</a>
              {hero.ctaHref && (
                <a href={hero.ctaHref} className="an-btn-ghost">Lihat Produk</a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON */}
      {(c.bands ?? []).map((b, i) => (
        <section className="an-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="an-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="an-heading">{b.title}</h2>
            {b.subtitle && <p className="an-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="an-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="an-footer">
        <div className="an-footer-grid">
          <div>
            <p className="an-footer-brand">{c.nama ?? 'Ceria'}</p>
            <p className="an-footer-tagline">
              {hero.eyebrow ?? `${c.nama ?? 'Ceria'} — perlengkapan & mainan anak.`}
            </p>
          </div>
          <div>
            <p className="an-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="an-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="an-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="an-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="an-footer-h">Jam Buka</p>
            {c.info?.jam
              ? c.info.jam.map((j, i) => (
                  <p key={i} className="an-footer-link">{j.hari}: {j.jam}</p>
                ))
              : (
                <>
                  <p className="an-footer-link">Senin–Sabtu: 08.00–17.00</p>
                  <p className="an-footer-link">Minggu: Tutup</p>
                </>
              )}
          </div>
        </div>
        <p className="an-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Ceria'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX */}
      <BespokeLightbox ctaText="Pesan via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
