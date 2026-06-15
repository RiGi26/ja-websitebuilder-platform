'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// SANARA — Klinik Wellness / Fisio & Terapi Bespoke Lux Renderer (Calm Healing)
// Industri JASA (source: services) — tanpa keranjang.
// Marcellus (display, classical-calm serif) + Figtree (body) |
// Warm-stone #F4F2EB · #E9E5DA/#E6E2D7 · ink #25302D |
// accent teal-green #3E8378 / accentDeep #2C6359 (palet tunggal, tanpa pop) |
// signature: bingkai foto bentuk DAUN (border-radius dua-ujung runcing) + motif
//   tunas/sprout + transisi gelombang lembut antar-section | ns: sn-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.sn-*`.
// Light palette → contrast.test menjaga WCAG (ink AAA, teal accentDeep ≥4.5).
// Tenang-natural-healing — sengaja beda dari Rumah "Selaras" (Japandi greige/
// sage-slate cool arched-alcove): ini warm-stone + teal jenuh + bentuk daun.
// ============================================================

export interface SnPal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentDeep: string; onAccent: string
  line: string; line2: string; shadow: string; shadowDeep: string
}

export const PALETTES: Record<string, SnPal> = {
  // Sanara — batu hangat, tinta hijau-gelap, aksen teal menyembuhkan.
  sanara: {
    bg: '#F4F2EB', bg2: '#E9E5DA', surface: '#FFFFFF', surface2: '#E6E2D7',
    ink: '#25302D', inkDim: '#3E4D49', muted: '#54615B',
    accent: '#3E8378', accentDeep: '#2C6359', onAccent: '#FFFFFF',
    line: 'rgba(37,48,45,.13)', line2: 'rgba(37,48,45,.07)',
    shadow: 'rgba(37,48,45,.09)', shadowDeep: 'rgba(37,48,45,.16)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Marcellus&family=Figtree:wght@300;400;500;600&display=swap'
const DISPLAY = '"Marcellus","Cormorant Garamond",Georgia,serif'
const BODY = '"Figtree","Segoe UI",system-ui,sans-serif'
const EASE = 'cubic-bezier(.22,1,.36,1)'
const LEAF = '54% 8% 54% 8% / 8% 54% 8% 54%'

// Tunas/sprout — motif healing kecil; tampil tanpa JS (tak digate). aria-hidden.
function Sprout({ className = '' }: { className?: string }) {
  return (
    <svg className={`sn-sprout ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 13C12 9.5 9 7.5 6 7.5c0 3.4 2.6 5.5 6 5.5Z" fill="currentColor" opacity=".85" />
      <path d="M12 11.5C12 8.4 14.6 6 18 6c0 3.1-2.6 5.5-6 5.5Z" fill="currentColor" />
    </svg>
  )
}

function snCss(): string {
  return `
@import url('${FONT_IMPORT}');
html,body{overflow-x:hidden;max-width:100%}
.sn-root{font-family:${BODY};color:var(--sn-ink);background:var(--sn-bg);line-height:1.75;font-weight:400;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.sn-root *,.sn-root *::before,.sn-root *::after{box-sizing:border-box;margin:0;padding:0}
.sn-root img{max-width:100%;height:auto;display:block}
.sn-root ::selection{background:rgba(62,131,120,.2);color:var(--sn-ink)}
.sn-sprout{color:var(--sn-accent);width:20px;height:20px;display:inline-block;flex-shrink:0}

/* NAV */
.sn-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.3rem 7vw;display:flex;align-items:center;justify-content:space-between;transition:background .5s,box-shadow .5s,backdrop-filter .5s,padding .5s}
.sn-root.lx-scrolled .sn-nav{background:rgba(244,242,235,.86);backdrop-filter:blur(12px);box-shadow:0 1px 0 var(--sn-line2);padding-top:.95rem;padding-bottom:.95rem}
.sn-nav-logo{font-family:${DISPLAY};letter-spacing:.01em;color:var(--sn-ink);font-size:1.55rem;text-decoration:none;display:flex;align-items:center;gap:.6rem}
.sn-nav-logo .sn-sprout{width:18px;height:18px}
.sn-nav-cta{font-family:${BODY};font-size:.86rem;font-weight:500;letter-spacing:.01em;color:var(--sn-onAccent);background:var(--sn-accentDeep);padding:.66rem 1.5rem;border-radius:999px;text-decoration:none;transition:background .3s,transform .3s ${EASE}}
.sn-nav-cta:hover{background:var(--sn-ink);transform:translateY(-2px)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO — tenang: teks + foto bingkai DAUN (signature) */
.sn-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1.02fr .98fr;align-items:center;gap:clamp(2rem,5vw,5rem);padding:9rem 7vw 5rem;background:radial-gradient(110% 80% at 85% 20%,var(--sn-bg2),var(--sn-bg) 65%)}
.sn-hero-text{position:relative;z-index:2}
.sn-hero-ew{font-family:${BODY};font-size:.82rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--sn-accentDeep);margin-bottom:1.3rem;display:flex;align-items:center;gap:.6rem}
.sn-hero-title{font-family:${DISPLAY};font-size:clamp(2.7rem,5.8vw,4.9rem);font-weight:400;line-height:1.1;color:var(--sn-ink);margin-bottom:1.5rem;letter-spacing:.005em;text-wrap:balance}
.sn-hero-title em{font-style:italic;color:var(--sn-accentDeep)}
.sn-hero-sub{font-size:1.1rem;color:var(--sn-inkDim);margin-bottom:2.4rem;max-width:44ch;line-height:1.9;font-weight:300}
.sn-hero-btns{display:flex;gap:1rem;flex-wrap:wrap;align-items:center;margin-bottom:2.6rem}
.sn-btn-primary{font-family:${BODY};font-size:.95rem;font-weight:500;background:var(--sn-accentDeep);color:var(--sn-onAccent);padding:.98rem 2.1rem;border-radius:999px;text-decoration:none;transition:background .35s,transform .35s ${EASE},box-shadow .35s;box-shadow:0 8px 22px rgba(44,99,89,.22)}
.sn-btn-primary:hover{background:var(--sn-ink);transform:translateY(-3px);box-shadow:0 14px 30px var(--sn-shadowDeep)}
.sn-btn-ghost{font-family:${BODY};font-size:.95rem;font-weight:500;color:var(--sn-ink);padding:.98rem 1.5rem;text-decoration:none;border-radius:999px;border:1px solid var(--sn-line);transition:border-color .35s,color .35s,transform .35s ${EASE}}
.sn-btn-ghost:hover{border-color:var(--sn-accent);color:var(--sn-accentDeep);transform:translateY(-2px)}
.sn-hero-meta{display:flex;flex-wrap:wrap;gap:2.2rem}
.sn-meta-item{display:flex;flex-direction:column;gap:.2rem}
.sn-meta-num{font-family:${DISPLAY};font-size:1.9rem;color:var(--sn-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.sn-meta-label{font-size:.74rem;color:var(--sn-muted);font-weight:500;letter-spacing:.02em}
.sn-hero-media{position:relative;z-index:1}
.sn-hero-frame{position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--sn-surface2);border-radius:${LEAF};box-shadow:0 30px 64px var(--sn-shadowDeep)}
.sn-hero-frame img{width:100%;height:100%;object-fit:cover}
.sn-hero-badge{position:absolute;right:-.6rem;bottom:2.4rem;z-index:3;background:var(--sn-surface);border-radius:999px;padding:.7rem 1.3rem;display:flex;align-items:center;gap:.55rem;box-shadow:0 16px 38px var(--sn-shadowDeep)}
.sn-hero-badge .sn-sprout{width:18px;height:18px}
.sn-hero-badge span{font-family:${DISPLAY};font-size:.98rem;color:var(--sn-ink)}
@media(max-width:880px){
  .sn-hero{grid-template-columns:1fr;min-height:unset;padding:7.5rem 7vw 3rem}
  .sn-hero-media{order:-1;max-width:380px;margin:0 auto}
  .sn-hero-title{font-size:clamp(2.4rem,9vw,3.5rem)}
}
@media(max-width:560px){.sn-nav{padding:1rem 6vw}.sn-hero-badge{right:0}}

/* PITA — kata wellness lembut (BUKAN klaim) */
.sn-ribbon{background:var(--sn-surface);border-top:1px solid var(--sn-line2);border-bottom:1px solid var(--sn-line2);padding:1.4rem 7vw}
.sn-ribbon-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.6rem 1.6rem}
.sn-ribbon-item{font-family:${DISPLAY};font-size:1.05rem;color:var(--sn-inkDim);display:inline-flex;align-items:center;gap:.6rem}
.sn-ribbon-item .sn-sprout{width:15px;height:15px;opacity:.7}

/* SECTION COMMONS */
.sn-section{padding:clamp(4.5rem,8.5vw,8rem) 7vw}
.sn-eyebrow{font-family:${BODY};font-size:.82rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--sn-accentDeep);margin-bottom:1rem;display:inline-flex;align-items:center;gap:.55rem}
.sn-heading{font-family:${DISPLAY};font-size:clamp(2.1rem,4vw,3.2rem);font-weight:400;color:var(--sn-ink);line-height:1.16;letter-spacing:.005em;text-wrap:balance}
.sn-subtext{color:var(--sn-inkDim);font-size:1.04rem;margin-top:1rem;max-width:56ch;line-height:1.9;font-weight:300}
.sn-sec-hdr{margin-bottom:3.4rem;max-width:60ch}

/* FEATURES — kartu tenang membulat */
.sn-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
.sn-feat-card{padding:2.4rem 2rem;background:var(--sn-surface);border-radius:24px;transition:transform .4s ${EASE},box-shadow .4s}
.sn-feat-card:hover{transform:translateY(-5px);box-shadow:0 22px 46px var(--sn-shadow)}
.sn-feat-ic{width:3rem;height:3rem;border-radius:50%;background:var(--sn-bg2);display:flex;align-items:center;justify-content:center;margin-bottom:1.3rem}
.sn-feat-ic .sn-sprout{width:22px;height:22px}
.sn-feat-title{font-family:${DISPLAY};font-size:1.35rem;font-weight:400;color:var(--sn-ink);margin-bottom:.5rem;line-height:1.3}
.sn-feat-desc{font-size:.92rem;color:var(--sn-muted);line-height:1.8;font-weight:300}
@media(max-width:820px){.sn-feat-grid{grid-template-columns:1fr}}

/* SHOWCASE — kartu layanan bingkai daun + quick-look */
.sn-showcase{background:var(--sn-bg2)}
.sn-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.6rem,3vw,2.4rem)}
.sn-grid[data-count="1"]{grid-template-columns:minmax(0,380px);justify-content:center}
.sn-grid[data-count="2"]{grid-template-columns:repeat(2,minmax(0,360px));justify-content:center;max-width:820px;margin:0 auto}
.sn-card{position:relative;cursor:pointer;background:var(--sn-surface);border-radius:24px;padding:1rem;transition:transform .45s ${EASE},box-shadow .45s}
.sn-card:hover{transform:translateY(-6px);box-shadow:0 28px 56px var(--sn-shadow)}
.sn-card-frame{position:relative;aspect-ratio:5/4;overflow:hidden;border-radius:${LEAF};background:var(--sn-surface2)}
.sn-card-frame img{width:100%;height:100%;object-fit:cover;transition:transform .7s ${EASE}}
.sn-card:hover .sn-card-frame img{transform:scale(1.05)}
.sn-card-cat{position:absolute;top:.8rem;left:.8rem;z-index:2;font-family:${BODY};font-size:.66rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--sn-accentDeep);background:rgba(255,255,255,.92);padding:.32rem .7rem;border-radius:999px}
.sn-card-body{padding:1.3rem .8rem .6rem}
.sn-card-name{font-family:${DISPLAY};font-size:1.4rem;font-weight:400;color:var(--sn-ink);margin-bottom:.4rem;line-height:1.25}
.sn-card-desc{font-size:.88rem;color:var(--sn-muted);margin-bottom:1rem;line-height:1.7;font-weight:300;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sn-card-foot{display:flex;align-items:center;justify-content:space-between;gap:.7rem;padding-top:.9rem;border-top:1px solid var(--sn-line2)}
.sn-card-price{font-family:${DISPLAY};font-size:1.2rem;color:var(--sn-accentDeep)}
.sn-card-price-soft{font-size:1rem;color:var(--sn-muted)}
.sn-card-dur{font-size:.74rem;font-weight:500;color:var(--sn-muted);display:inline-flex;align-items:center;gap:.35rem}
.sn-card-dur::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--sn-accent)}
@media(max-width:980px){.sn-grid{grid-template-columns:repeat(2,1fr)}.sn-grid[data-count="1"]{grid-template-columns:minmax(0,380px)}}
@media(max-width:560px){.sn-grid,.sn-grid[data-count="1"],.sn-grid[data-count="2"]{grid-template-columns:1fr;max-width:380px;margin:0 auto}}

/* STATEMENT — panel tenang + sprout */
.sn-statement{padding:clamp(4rem,8vw,7rem) 7vw;background:var(--sn-bg)}
.sn-stmt-inner{max-width:52ch;margin:0 auto;text-align:center}
.sn-stmt-sprout{width:34px;height:34px;margin:0 auto 1.4rem}
.sn-stmt-ew{font-family:${BODY};font-size:.78rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--sn-accentDeep);margin-bottom:1rem}
.sn-stmt-quote{font-family:${DISPLAY};font-size:clamp(1.6rem,3.2vw,2.5rem);font-weight:400;color:var(--sn-ink);line-height:1.45;font-style:italic}
.sn-stmt-cite{display:block;font-family:${BODY};font-size:.8rem;letter-spacing:.04em;color:var(--sn-muted);font-weight:500;margin-top:1.5rem}

/* ABOUT — split + bingkai daun */
.sn-about{background:var(--sn-bg2)}
.sn-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2.5rem,6vw,6rem);align-items:center}
.sn-about-inner.sn-about-solo{grid-template-columns:1fr;max-width:54ch;margin:0 auto;text-align:center}
.sn-about-solo .sn-eyebrow{justify-content:center}
.sn-about-solo .sn-about-body{margin-left:auto;margin-right:auto}
.sn-about-body{font-size:1.04rem;color:var(--sn-inkDim);line-height:1.95;margin-top:1.2rem;white-space:pre-line;font-weight:300}
.sn-about-cta{display:inline-flex;align-items:center;gap:.55rem;margin-top:1.9rem;font-family:${BODY};font-size:.92rem;font-weight:500;color:var(--sn-onAccent);background:var(--sn-accentDeep);padding:.82rem 1.7rem;border-radius:999px;text-decoration:none;transition:gap .3s,transform .3s ${EASE},background .3s}
.sn-about-cta:hover{gap:.85rem;transform:translateY(-2px);background:var(--sn-ink)}
.sn-about-img{position:relative}
.sn-about-frame{position:relative;z-index:1;aspect-ratio:4/5;overflow:hidden;border-radius:${LEAF};box-shadow:0 28px 60px var(--sn-shadowDeep)}
.sn-about-frame img{width:100%;height:100%;object-fit:cover}
@media(max-width:840px){.sn-about-inner{grid-template-columns:1fr;gap:3rem}.sn-about-img{order:-1;max-width:340px;margin:0 auto}}

/* STATS — angka serif ber-countUp */
.sn-stats{background:var(--sn-surface);border-top:1px solid var(--sn-line2);border-bottom:1px solid var(--sn-line2)}
.sn-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3rem;text-align:center}
.sn-stat{padding:1.6rem 1rem}
.sn-stat-num{font-family:${DISPLAY};font-size:clamp(2.4rem,4.6vw,3.3rem);color:var(--sn-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.sn-stat-label{font-size:.76rem;color:var(--sn-muted);font-weight:500;margin-top:.6rem}
@media(max-width:600px){.sn-stats-grid{grid-template-columns:repeat(2,1fr);gap:1rem}}

/* TESTIMONIALS — carousel */
.sn-testimonials{background:var(--sn-bg)}
.sn-tcar{position:relative}
.sn-tcar-track{display:flex;gap:1.6rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .25rem 1.5rem;-ms-overflow-style:none;scrollbar-width:none}
.sn-tcar-track::-webkit-scrollbar{display:none}
.sn-test-card{scroll-snap-align:start;background:var(--sn-surface);border-radius:24px;padding:2.4rem 2.2rem;min-width:310px;max-width:380px;flex:0 0 auto;box-shadow:0 12px 30px var(--sn-shadow)}
.sn-test-sprout{width:24px;height:24px;margin-bottom:1rem}
.sn-test-quote{font-family:${DISPLAY};font-size:1.16rem;color:var(--sn-inkDim);line-height:1.6;margin:0 0 1.5rem;font-style:italic}
.sn-test-name{font-family:${BODY};font-weight:600;font-size:.94rem;color:var(--sn-ink)}
.sn-test-role{font-size:.76rem;color:var(--sn-muted);font-weight:400;margin-top:.18rem}
.sn-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1.1rem;margin-top:1.7rem}
.sn-tcar-btn{width:46px;height:46px;border-radius:50%;background:var(--sn-surface);border:1px solid var(--sn-line);color:var(--sn-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .3s,color .3s,border-color .3s,opacity .3s,transform .3s ${EASE}}
.sn-tcar-btn:hover:not(:disabled){background:var(--sn-accentDeep);color:var(--sn-onAccent);border-color:var(--sn-accentDeep);transform:scale(1.06)}
.sn-tcar-btn:disabled{opacity:.3;cursor:default}
.sn-tcar-dots{display:flex;gap:.5rem;align-items:center}
.sn-dot-nav{width:8px;height:8px;border-radius:50%;background:var(--sn-line);border:none;padding:0;cursor:pointer;transition:background .3s,transform .3s}
.sn-dot-nav[aria-current="true"]{background:var(--sn-accent);transform:scale(1.5)}

/* FAQ */
.sn-faq{background:var(--sn-bg2)}
.sn-faq-wrap{max-width:780px;margin:0 auto}
.sn-faq-item{background:var(--sn-surface);border-radius:18px;margin-bottom:.8rem;overflow:hidden}
.sn-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.4rem 1.6rem;cursor:pointer;font-family:${DISPLAY};font-size:1.18rem;font-weight:400;color:var(--sn-ink);background:none;border:none;text-align:left}
.sn-faq-q:focus-visible{outline:2px solid var(--sn-accentDeep);outline-offset:-2px;border-radius:14px}
.sn-faq-icon{font-size:1.4rem;color:var(--sn-accentDeep);flex-shrink:0;transition:transform .35s ${EASE};line-height:1;font-weight:300}
.sn-faq-icon.open{transform:rotate(45deg)}
.sn-faq-a{font-size:.96rem;color:var(--sn-inkDim);line-height:1.85;padding:0 1.6rem 1.4rem;max-width:64ch;font-weight:300}

/* CTA — panel teal tenang */
.sn-cta{background:var(--sn-bg)}
.sn-cta-inner{position:relative;background:linear-gradient(150deg,var(--sn-accentDeep),#234e47);color:var(--sn-onAccent);border-radius:32px;padding:clamp(3.5rem,7vw,6rem) clamp(1.5rem,5vw,4rem);text-align:center;overflow:hidden}
.sn-cta-sprout{width:38px;height:38px;margin:0 auto 1.4rem;color:rgba(255,255,255,.85)}
.sn-cta-title{position:relative;font-family:${DISPLAY};font-size:clamp(2.2rem,4.6vw,3.4rem);font-weight:400;margin-bottom:1rem;line-height:1.18;text-wrap:balance}
.sn-cta-sub{position:relative;font-size:1.05rem;opacity:.9;max-width:48ch;margin:0 auto 2.5rem;line-height:1.85;font-weight:300}
.sn-cta-btns{position:relative;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.sn-cta .sn-btn-primary{background:var(--sn-surface);color:var(--sn-accentDeep)}
.sn-cta .sn-btn-primary:hover{background:var(--sn-bg);color:var(--sn-ink)}
.sn-cta .sn-btn-ghost{color:var(--sn-onAccent);border-color:rgba(255,255,255,.42)}
.sn-cta .sn-btn-ghost:hover{color:#fff;border-color:#fff}

/* BAND ADD-ON */
.sn-band{background:var(--sn-surface);border-top:1px solid var(--sn-line2);border-bottom:1px solid var(--sn-line2);padding:3.4rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.6rem}
.sn-band-ew{font-family:${BODY};font-size:.72rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--sn-accentDeep);margin-bottom:.5rem}
.sn-band .sn-heading{font-size:clamp(1.5rem,2.4vw,2.1rem)}
.sn-band-sub{color:var(--sn-muted);font-size:.94rem;line-height:1.65;margin-top:.5rem;max-width:56ch;font-weight:300}

/* FOOTER */
.sn-footer{background:var(--sn-ink);color:rgba(255,255,255,.66);padding:4.6rem 7vw 2.6rem}
.sn-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:3rem}
.sn-footer-brand{font-family:${DISPLAY};font-size:1.8rem;color:#fff;margin-bottom:1rem;display:flex;align-items:center;gap:.55rem}
.sn-footer-brand .sn-sprout{width:20px;height:20px;color:#7FBDB0}
.sn-footer-tagline{font-size:.9rem;color:rgba(255,255,255,.55);line-height:1.8;max-width:34ch;font-weight:300}
.sn-footer-h{font-family:${BODY};font-size:.74rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#fff;margin-bottom:1.1rem}
.sn-footer-link{display:block;font-size:.9rem;color:rgba(255,255,255,.66);text-decoration:none;margin-bottom:.6rem;transition:color .3s;font-weight:300}
.sn-footer-link:hover{color:#fff}
.sn-footer-copy{border-top:1px solid rgba(255,255,255,.13);padding-top:1.6rem;font-size:.78rem;color:rgba(255,255,255,.5);text-align:center;font-weight:300}
@media(max-width:768px){.sn-footer-grid{grid-template-columns:1fr;gap:2.2rem}}

/* REVEAL — via LUX_JS (.lx-reveal → .lx-in), digate .lx-js (kontrak no-JS #138) */
.lx-js .sn-rv{opacity:0;transform:translateY(24px);transition:opacity .8s ${EASE},transform .8s ${EASE}}
.lx-js .sn-rv.lx-in{opacity:1;transform:none}
.sn-rv-d1{transition-delay:.09s}.sn-rv-d2{transition-delay:.18s}.sn-rv-d3{transition-delay:.27s}.sn-rv-d4{transition-delay:.36s}

/* LIGHTBOX — sn-root overrides palet lx-lb (tenang/membulat) */
.sn-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.sn-root .lx-lb[hidden]{display:none}
.sn-root .lx-lb-back{position:absolute;inset:0;background:rgba(37,48,45,.55);backdrop-filter:blur(6px);border:0;cursor:pointer}
.sn-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--sn-surface);border-radius:28px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .45s ${EASE},transform .45s ${EASE}}
.sn-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.sn-root .lx-lb-media{position:relative;overflow:hidden;background:var(--sn-surface2);min-height:320px}
.sn-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sn-root .lx-lb-body{padding:clamp(24px,3vw,44px);display:flex;flex-direction:column;gap:10px;justify-content:center}
.sn-root .lx-lb-cat{font-family:${BODY};font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--sn-accentDeep)}
.sn-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(24px,2.8vw,31px);font-weight:400;line-height:1.2;color:var(--sn-ink)}
.sn-root .lx-lb-price{font-family:${DISPLAY};font-size:20px;color:var(--sn-accentDeep)}
.sn-root .lx-lb-desc{color:var(--sn-muted);font-size:13.5px;line-height:1.8;font-weight:300}
.sn-root .lx-lb-cta{margin-top:14px;width:fit-content;display:inline-flex;align-items:center;background:var(--sn-accentDeep);color:var(--sn-onAccent);font-family:${BODY};font-size:13px;font-weight:500;padding:12px 26px;border-radius:999px;text-decoration:none;transition:background .3s}
.sn-root .lx-lb-cta:hover{background:var(--sn-ink)}
.sn-root .lx-lb-x{position:absolute;top:13px;right:13px;z-index:3;width:42px;height:42px;border-radius:50%;background:var(--sn-surface);border:1px solid var(--sn-line);color:var(--sn-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s}
.sn-root .lx-lb-x:hover{background:var(--sn-accentDeep);color:var(--sn-onAccent);border-color:var(--sn-accentDeep)}
.sn-root .lx-lb-prev,.sn-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:42px;height:42px;border-radius:50%;background:var(--sn-surface);border:1px solid var(--sn-line);color:var(--sn-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s}
.sn-root .lx-lb-prev:hover,.sn-root .lx-lb-next:hover{background:var(--sn-accentDeep);color:var(--sn-onAccent)}
.sn-root .lx-lb-prev{left:10px}.sn-root .lx-lb-next{right:10px}
@media(max-width:640px){.sn-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.sn-root .lx-lb-media{min-height:240px}}

/* ── RASA polish ── */
.sn-btn-primary:active,.sn-nav-cta:active,.sn-about-cta:active{transform:translateY(0) scale(.97)}
.sn-card:active{transform:translateY(-2px)}
.sn-tcar-btn:active{transform:scale(.93)}
.sn-nav-cta:focus-visible,.sn-btn-primary:focus-visible,.sn-btn-ghost:focus-visible,.sn-about-cta:focus-visible,.sn-footer-link:focus-visible,.sn-card:focus-visible,.sn-tcar-btn:focus-visible,.sn-dot-nav:focus-visible,.sn-cta-btns a:focus-visible{outline:2px solid var(--sn-accentDeep);outline-offset:3px}
.sn-hero-sub,.sn-subtext,.sn-about-body,.sn-cta-sub,.sn-feat-desc{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Kata pita = mood wellness (BUKAN klaim seperti tersertifikasi/sembuh);
// tampil di SEMUA situs Sanara. Klaim spesifik milik klien → konten editabel.
const RIBBON = ['Pemulihan', 'Keseimbangan', 'Ketenangan', 'Gerak', 'Napas']

export default function KlinikWellnessRenderer({ content: c, variant = 'sanara' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.sanara
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa}` : '#jadwal'
  const hero = c.hero ?? {}
  const items = c.showcase?.items ?? []
  const features = c.features ?? []
  const stats = c.stats ?? []
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []
  const jamRows = c.info?.jam ?? []

  const rootStyle = {
    '--sn-bg': p.bg, '--sn-bg2': p.bg2, '--sn-surface': p.surface, '--sn-surface2': p.surface2,
    '--sn-ink': p.ink, '--sn-inkDim': p.inkDim, '--sn-muted': p.muted,
    '--sn-accent': p.accent, '--sn-accentDeep': p.accentDeep, '--sn-onAccent': p.onAccent,
    '--sn-line': p.line, '--sn-line2': p.line2, '--sn-shadow': p.shadow, '--sn-shadowDeep': p.shadowDeep,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const priceText = (n?: number) => (typeof n === 'number' && n > 0 ? fmt(n) : 'Konsultasi')

  return (
    <div className="sn-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: snCss() }} />

      {/* NAV */}
      <nav className="sn-nav" aria-label="Navigasi utama">
        <a href="#beranda" className="sn-nav-logo"><Sprout />{c.nama ?? 'Sanara'}</a>
        <a href={waUrl} className="sn-nav-cta">Jadwalkan</a>
      </nav>

      {/* HERO */}
      <section className="sn-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="sn-hero-text">
          {hero.eyebrow && <p className="sn-hero-ew"><Sprout className="sn-sprout" />{hero.eyebrow}</p>}
          {hero.title && <h1 className="sn-hero-title">{hero.title}</h1>}
          {hero.subtitle && <p className="sn-hero-sub">{hero.subtitle}</p>}
          <div className="sn-hero-btns">
            <a href={hero.ctaHref ?? waUrl} className="sn-btn-primary">{hero.ctaText ?? 'Jadwalkan Terapi'}</a>
            <a href={hero.ctaHref2 ?? '#layanan'} className="sn-btn-ghost">{hero.ctaText2 ?? 'Lihat Layanan'}</a>
          </div>
          {stats.length > 0 && (
            <div className="sn-hero-meta">
              {stats.slice(0, 3).map((s, i) => (
                <div key={i} className="sn-meta-item">
                  <span className="sn-meta-num">{s.angka}</span>
                  <span className="sn-meta-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="sn-hero-media">
          <div className="sn-hero-frame">
            {hero.image
              ? <img src={hero.image} alt={c.nama ?? 'Klinik wellness'} loading="eager" style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined} />
              : <span aria-hidden style={{ display: 'block', width: '100%', height: '100%' }} />}
          </div>
          <div className="sn-hero-badge"><Sprout /><span>{hero.eyebrow ?? 'Fisio & Wellness'}</span></div>
        </div>
      </section>

      {/* PITA */}
      <div className="sn-ribbon" aria-hidden="true">
        <div className="sn-ribbon-row">
          {RIBBON.map((m, i) => (
            <span key={i} className="sn-ribbon-item"><Sprout className="sn-sprout" />{m}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="sn-section" id="keunggulan">
          <div className="sn-sec-hdr sn-rv lx-reveal">
            <p className="sn-eyebrow"><Sprout className="sn-sprout" />{c.featuresEyebrow ?? 'Kenapa Kami'}</p>
            {c.featuresTitle && <h2 className="sn-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="sn-feat-grid">
            {features.slice(0, 3).map((f, i) => (
              <div key={i} className={`sn-feat-card sn-rv lx-reveal sn-rv-d${i + 1}`}>
                <div className="sn-feat-ic"><Sprout /></div>
                <h3 className="sn-feat-title">{f.title}</h3>
                <p className="sn-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SHOWCASE — bingkai daun (signature) */}
      {items.length > 0 && (
        <section className="sn-section sn-showcase" id="layanan">
          <div className="sn-sec-hdr sn-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.4rem' }}>
            <p className="sn-eyebrow" style={{ justifyContent: 'center' }}><Sprout className="sn-sprout" />Layanan</p>
            {c.showcase?.title && <h2 className="sn-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="sn-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{c.showcase.subtitle}</p>}
          </div>
          <div className="sn-grid lx-look" data-count={items.length}>
            {items.map((item, i) => (
              <article
                key={i}
                className="sn-card lx-lb-open sn-rv lx-reveal"
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
                <div className="sn-card-frame">
                  {item.kategori && <span className="sn-card-cat">{item.kategori}</span>}
                  {item.gambar && <img src={item.gambar} alt={item.nama} loading="lazy" />}
                </div>
                <div className="sn-card-body">
                  <h3 className="sn-card-name">{item.nama}</h3>
                  {item.desc && <p className="sn-card-desc">{item.desc}</p>}
                  <div className="sn-card-foot">
                    <span className={`sn-card-price${typeof item.harga === 'number' && item.harga > 0 ? '' : ' sn-card-price-soft'}`}>
                      {priceText(item.harga)}
                    </span>
                    {typeof item.durasi === 'number' && item.durasi > 0 && (
                      <span className="sn-card-dur">{item.durasi} menit</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT */}
      {c.statement && (
        <div className="sn-statement">
          <div className="sn-stmt-inner sn-rv lx-reveal">
            <Sprout className="sn-stmt-sprout" />
            {c.statement.eyebrow && <p className="sn-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="sn-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="sn-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="sn-section sn-about" id="tentang">
          <div className={`sn-about-inner${c.about.image ? '' : ' sn-about-solo'}`}>
            <div className="sn-rv lx-reveal">
              <p className="sn-eyebrow"><Sprout className="sn-sprout" />Tentang Kami</p>
              <h2 className="sn-heading">{c.about.title}</h2>
              <p className="sn-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="sn-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="sn-about-img sn-rv lx-reveal sn-rv-d2">
                <div className="sn-about-frame">
                  <img src={c.about.image} alt={c.about.title} loading="lazy" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="sn-stats">
          <div className="sn-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="sn-stat">
                <div className="sn-stat-num" data-cu>{s.angka}</div>
                <div className="sn-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="sn-section sn-testimonials" id="ulasan">
          <div className="sn-sec-hdr sn-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="sn-eyebrow" style={{ justifyContent: 'center' }}><Sprout className="sn-sprout" />Ulasan</p>
            <h2 className="sn-heading">Kata Pasien Kami</h2>
          </div>
          <div className="sn-tcar lx-tcar">
            <div className="sn-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="sn-test-card">
                  <Sprout className="sn-test-sprout" />
                  <p className="sn-test-quote">{t.quote}</p>
                  <p className="sn-test-name">{t.nama}</p>
                  {t.peran && <p className="sn-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="sn-tcar-ctrl">
                <button className="sn-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="sn-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="sn-dot-nav lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="sn-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="sn-section sn-faq" id="faq">
          <div className="sn-sec-hdr sn-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="sn-eyebrow" style={{ justifyContent: 'center' }}><Sprout className="sn-sprout" />Pertanyaan</p>
            <h2 className="sn-heading">Sering Ditanyakan</h2>
          </div>
          <div className="sn-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="sn-faq-item">
                <button
                  className="sn-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`sn-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="sn-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="sn-section sn-cta" id="jadwal">
          <div className="sn-cta-inner sn-rv lx-reveal">
            <Sprout className="sn-cta-sprout" />
            <h2 className="sn-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="sn-cta-sub">{c.cta.subtitle}</p>}
            <div className="sn-cta-btns">
              <a href={waUrl} className="sn-btn-primary">{c.cta.ctaText ?? 'Jadwalkan via WhatsApp'}</a>
              <a href="#layanan" className="sn-btn-ghost">Lihat Layanan</a>
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON */}
      {(c.bands ?? []).map((b, i) => (
        <section className="sn-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="sn-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="sn-heading">{b.title}</h2>
            {b.subtitle && <p className="sn-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="sn-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="sn-footer">
        <div className="sn-footer-grid">
          <div>
            <p className="sn-footer-brand"><Sprout />{c.nama ?? 'Sanara'}</p>
            <p className="sn-footer-tagline">
              {hero.eyebrow ?? `${c.nama ?? 'Sanara'} — fisioterapi & pusat wellness.`}
            </p>
          </div>
          <div>
            <p className="sn-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="sn-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="sn-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="sn-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="sn-footer-h">Jam Praktik</p>
            {jamRows.length
              ? jamRows.map((j, i) => <p key={i} className="sn-footer-link">{j.hari}: {j.jam}</p>)
              : (
                <>
                  <p className="sn-footer-link">Senin–Sabtu: 09.00–19.00</p>
                  <p className="sn-footer-link">Minggu: Dengan perjanjian</p>
                </>
              )}
          </div>
        </div>
        <p className="sn-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Sanara'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX */}
      <BespokeLightbox ctaText="Jadwalkan via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
