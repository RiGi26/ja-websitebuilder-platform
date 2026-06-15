'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// LUMEN — Klinik Estetik / Skincare & Dermatologi Bespoke Lux Renderer
// (Editorial Derma). Industri JASA (source: services) — tanpa keranjang.
// Bodoni Moda (display, high-contrast fashion serif) + Outfit (body, geometric) |
// Cool-white #FBF9FA · lilac #F1EBF1/#EAE2EB · plum-ink #271F2C |
// accent orchid #9A5C8E / accentDeep #7A3F70 (palet tunggal, tanpa pop) |
// signature: kartu perawatan ber-NUMERAL serif raksasa (01/02/…) + bingkai
//   hairline tipis-ganda, banyak ruang putih (editorial luxe) | ns: le-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.le-*`.
// Light palette → contrast.test menjaga WCAG (plum ink AAA, orchid accentDeep ≥4.5).
// Editorial-derma tenang & matte — sengaja beda dari toko-kecantikan "Embun"
// (bright luminous glow): ini serif-led, hairline, plum/orchid cool, bukan glow rose.
// ============================================================

export interface LePal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentDeep: string; onAccent: string
  line: string; line2: string; shadow: string; shadowDeep: string
}

export const PALETTES: Record<string, LePal> = {
  // Lumen — cool-white ivory, lilac lembut, tinta plum, aksen orchid.
  lumen: {
    bg: '#FBF9FA', bg2: '#F1EBF1', surface: '#FFFFFF', surface2: '#EAE2EB',
    ink: '#271F2C', inkDim: '#463C4C', muted: '#635A6A',
    accent: '#9A5C8E', accentDeep: '#7A3F70', onAccent: '#FFFFFF',
    line: 'rgba(39,31,44,.13)', line2: 'rgba(39,31,44,.08)',
    shadow: 'rgba(39,31,44,.08)', shadowDeep: 'rgba(39,31,44,.16)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..600;1,6..96,400..500&family=Outfit:wght@300;400;500;600&display=swap'
const DISPLAY = '"Bodoni Moda","Didot",Georgia,serif'
const BODY = '"Outfit","Segoe UI",system-ui,sans-serif'
const EASE = 'cubic-bezier(.22,1,.36,1)'

function leCss(): string {
  return `
@import url('${FONT_IMPORT}');
html,body{overflow-x:hidden;max-width:100%}
.le-root{font-family:${BODY};color:var(--le-ink);background:var(--le-bg);line-height:1.7;font-weight:400;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.le-root *,.le-root *::before,.le-root *::after{box-sizing:border-box;margin:0;padding:0}
.le-root img{max-width:100%;height:auto;display:block}
.le-root ::selection{background:rgba(154,92,142,.18);color:var(--le-ink)}

/* NAV */
.le-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.3rem 7vw;display:flex;align-items:center;justify-content:space-between;transition:background .5s,box-shadow .5s,backdrop-filter .5s,padding .5s}
.le-root.lx-scrolled .le-nav{background:rgba(251,249,250,.86);backdrop-filter:blur(12px);box-shadow:0 1px 0 var(--le-line2);padding-top:.95rem;padding-bottom:.95rem}
.le-nav-logo{font-family:${DISPLAY};font-weight:500;letter-spacing:.01em;color:var(--le-ink);font-size:1.55rem;text-decoration:none}
.le-nav-cta{font-family:${BODY};font-size:.8rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--le-ink);text-decoration:none;border-bottom:1px solid var(--le-accent);padding-bottom:3px;transition:color .3s,border-color .3s}
.le-nav-cta:hover{color:var(--le-accentDeep);border-color:var(--le-accentDeep)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO — editorial: judul serif besar + potret berbingkai hairline-ganda */
.le-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1.08fr .92fr;align-items:center;gap:clamp(2rem,5vw,5rem);padding:9rem 7vw 5rem;background:var(--le-bg)}
.le-hero-text{position:relative;z-index:2}
.le-hero-ew{font-family:${BODY};font-size:.76rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--le-accentDeep);margin-bottom:1.6rem;display:flex;align-items:center;gap:.9rem}
.le-hero-ew::before{content:'';width:2.4rem;height:1px;background:var(--le-accent)}
.le-hero-title{font-family:${DISPLAY};font-size:clamp(2.8rem,6vw,5.2rem);font-weight:500;line-height:1.04;color:var(--le-ink);margin-bottom:1.6rem;letter-spacing:-.01em;text-wrap:balance}
.le-hero-title em{font-style:italic;color:var(--le-accentDeep);font-weight:500}
.le-hero-sub{font-size:1.08rem;color:var(--le-inkDim);margin-bottom:2.4rem;max-width:42ch;line-height:1.85;font-weight:300}
.le-hero-btns{display:flex;gap:1.4rem;flex-wrap:wrap;align-items:center;margin-bottom:2.8rem}
.le-btn-primary{font-family:${BODY};font-size:.82rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;background:var(--le-accentDeep);color:var(--le-onAccent);padding:1.05rem 2.2rem;text-decoration:none;transition:background .35s,transform .35s ${EASE}}
.le-btn-primary:hover{background:var(--le-ink);transform:translateY(-2px)}
.le-btn-ghost{font-family:${BODY};font-size:.82rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--le-ink);text-decoration:none;border-bottom:1px solid var(--le-line);padding-bottom:5px;transition:border-color .35s,color .35s}
.le-btn-ghost:hover{border-color:var(--le-accentDeep);color:var(--le-accentDeep)}
.le-hero-meta{display:flex;flex-wrap:wrap;gap:2.4rem}
.le-meta-item{display:flex;flex-direction:column;gap:.25rem}
.le-meta-num{font-family:${DISPLAY};font-size:1.85rem;font-weight:500;color:var(--le-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.le-meta-label{font-size:.72rem;color:var(--le-muted);font-weight:500;letter-spacing:.05em;text-transform:uppercase}
/* Media */
.le-hero-media{position:relative;z-index:1}
.le-hero-frame{position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--le-surface2)}
.le-hero-frame img{width:100%;height:100%;object-fit:cover}
.le-hero-media::before{content:'';position:absolute;inset:-14px;border:1px solid var(--le-line);pointer-events:none;z-index:2}
.le-hero-tag{position:absolute;left:-1.2rem;bottom:2.2rem;z-index:3;background:var(--le-surface);padding:.85rem 1.5rem;box-shadow:0 18px 44px var(--le-shadowDeep)}
.le-hero-tag b{display:block;font-family:${DISPLAY};font-size:1.15rem;font-weight:500;color:var(--le-ink);line-height:1.1}
.le-hero-tag span{font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--le-accentDeep);font-weight:500}
@media(max-width:880px){
  .le-hero{grid-template-columns:1fr;min-height:unset;padding:7.5rem 7vw 3rem}
  .le-hero-media{order:-1;max-width:380px;margin:0 auto}
  .le-hero-title{font-size:clamp(2.4rem,9vw,3.6rem)}
}
@media(max-width:560px){.le-nav{padding:1rem 6vw}.le-hero-tag{left:0}}

/* PITA — kata editorial tipis (BUKAN klaim) */
.le-ribbon{background:var(--le-bg2);padding:1.5rem 7vw}
.le-ribbon-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.5rem 2.6rem}
.le-ribbon-item{font-family:${DISPLAY};font-size:1.02rem;font-style:italic;color:var(--le-inkDim);font-weight:400}
.le-ribbon-item::after{content:'·';margin-left:1.3rem;color:var(--le-accent);font-style:normal}
.le-ribbon-item:last-child::after{display:none}

/* SECTION COMMONS */
.le-section{padding:clamp(4.5rem,8.5vw,8rem) 7vw}
.le-eyebrow{font-family:${BODY};font-size:.74rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--le-accentDeep);margin-bottom:1.1rem;display:flex;align-items:center;gap:.85rem}
.le-eyebrow::before{content:'';width:2rem;height:1px;background:var(--le-accent)}
.le-heading{font-family:${DISPLAY};font-size:clamp(2.1rem,4vw,3.3rem);font-weight:500;color:var(--le-ink);line-height:1.12;letter-spacing:-.01em;text-wrap:balance}
.le-subtext{color:var(--le-inkDim);font-size:1.02rem;margin-top:1.1rem;max-width:54ch;line-height:1.85;font-weight:300}
.le-sec-hdr{margin-bottom:3.6rem;max-width:60ch}

/* FEATURES — kolom hairline editorial */
.le-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid var(--le-line)}
.le-feat-card{padding:2.4rem 2rem 2.4rem 0;border-bottom:1px solid var(--le-line2);transition:transform .4s ${EASE}}
.le-feat-card:hover{transform:translateX(6px)}
.le-feat-idx{font-family:${DISPLAY};font-size:.9rem;font-weight:500;color:var(--le-accentDeep);letter-spacing:.1em;margin-bottom:1rem}
.le-feat-title{font-family:${DISPLAY};font-size:1.35rem;font-weight:500;color:var(--le-ink);margin-bottom:.6rem;line-height:1.25}
.le-feat-desc{font-size:.92rem;color:var(--le-muted);line-height:1.75;font-weight:300}
@media(max-width:820px){.le-feat-grid{grid-template-columns:1fr}.le-feat-card{padding-right:0}}

/* SHOWCASE — signature: kartu perawatan ber-numeral serif raksasa + hairline */
.le-showcase{background:var(--le-bg2)}
.le-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(2rem,4vw,3.5rem)}
.le-grid[data-count="1"]{grid-template-columns:minmax(0,520px);justify-content:center}
.le-card{position:relative;cursor:pointer;background:var(--le-surface);transition:transform .45s ${EASE},box-shadow .45s}
.le-card:hover{transform:translateY(-5px);box-shadow:0 30px 60px var(--le-shadow)}
.le-card-inner{display:grid;grid-template-columns:.9fr 1.1fr;align-items:stretch}
.le-card-frame{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--le-surface2)}
.le-card-frame img{width:100%;height:100%;object-fit:cover;transition:transform .7s ${EASE}}
.le-card:hover .le-card-frame img{transform:scale(1.05)}
.le-card-num{position:absolute;top:.4rem;left:.7rem;z-index:2;font-family:${DISPLAY};font-size:3.4rem;font-weight:500;line-height:.8;color:var(--le-onAccent);mix-blend-mode:difference;opacity:.92}
.le-card-body{padding:1.8rem 1.8rem 1.8rem 1.7rem;display:flex;flex-direction:column;justify-content:center;border:1px solid var(--le-line2);border-left:none}
.le-card-cat{font-family:${BODY};font-size:.66rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--le-accentDeep);margin-bottom:.7rem}
.le-card-name{font-family:${DISPLAY};font-size:1.5rem;font-weight:500;color:var(--le-ink);margin-bottom:.55rem;line-height:1.2}
.le-card-desc{font-size:.88rem;color:var(--le-muted);margin-bottom:1.3rem;line-height:1.7;font-weight:300}
.le-card-foot{display:flex;align-items:baseline;justify-content:space-between;gap:.8rem;padding-top:1rem;border-top:1px solid var(--le-line2)}
.le-card-price{font-family:${DISPLAY};font-size:1.2rem;font-weight:500;color:var(--le-accentDeep)}
.le-card-price-soft{font-size:1rem;color:var(--le-muted)}
.le-card-dur{font-size:.72rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--le-muted)}
@media(max-width:980px){.le-grid{grid-template-columns:1fr;max-width:560px;margin:0 auto}}
@media(max-width:520px){.le-card-inner{grid-template-columns:1fr}.le-card-frame{aspect-ratio:16/11}.le-card-body{border-left:1px solid var(--le-line2);border-top:none}}

/* STATEMENT — editorial serif besar berkutip */
.le-statement{padding:clamp(4rem,8vw,7rem) 7vw;background:var(--le-bg)}
.le-stmt-inner{max-width:46ch;margin:0 auto;text-align:center}
.le-stmt-ew{font-family:${BODY};font-size:.74rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--le-accentDeep);margin-bottom:1.6rem}
.le-stmt-quote{font-family:${DISPLAY};font-size:clamp(1.6rem,3.2vw,2.5rem);font-style:italic;font-weight:400;color:var(--le-ink);line-height:1.4}
.le-stmt-cite{display:block;font-family:${BODY};font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:var(--le-muted);font-weight:500;margin-top:1.6rem}

/* ABOUT — split + bingkai hairline */
.le-about{background:var(--le-bg2)}
.le-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2.5rem,6vw,6rem);align-items:center}
.le-about-inner.le-about-solo{grid-template-columns:1fr;max-width:50ch;margin:0 auto;text-align:center}
.le-about-solo .le-eyebrow{justify-content:center}
.le-about-solo .le-about-body{margin-left:auto;margin-right:auto}
.le-about-body{font-size:1.04rem;color:var(--le-inkDim);line-height:1.95;margin-top:1.3rem;white-space:pre-line;font-weight:300}
.le-about-cta{display:inline-flex;align-items:center;gap:.6rem;margin-top:2rem;font-family:${BODY};font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--le-accentDeep);text-decoration:none;border-bottom:1px solid var(--le-accent);padding-bottom:4px;transition:gap .3s,color .3s}
.le-about-cta:hover{gap:1rem;color:var(--le-ink)}
.le-about-img{position:relative}
.le-about-frame{position:relative;z-index:1;aspect-ratio:4/5;overflow:hidden;background:var(--le-surface2)}
.le-about-frame img{width:100%;height:100%;object-fit:cover}
.le-about-img::before{content:'';position:absolute;inset:-14px;border:1px solid var(--le-line);z-index:2;pointer-events:none}
@media(max-width:840px){.le-about-inner{grid-template-columns:1fr;gap:3rem}.le-about-img{order:-1;max-width:360px;margin:0 auto}}

/* STATS — angka serif ber-countUp + hairline */
.le-stats{background:var(--le-bg);border-top:1px solid var(--le-line);border-bottom:1px solid var(--le-line)}
.le-stats-grid{display:grid;grid-template-columns:repeat(4,1fr)}
.le-stat{padding:2.4rem 1.2rem;text-align:center;border-left:1px solid var(--le-line2)}
.le-stat:first-child{border-left:none}
.le-stat-num{font-family:${DISPLAY};font-size:clamp(2.4rem,4.6vw,3.4rem);font-weight:500;color:var(--le-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.le-stat-label{font-size:.72rem;color:var(--le-muted);font-weight:500;letter-spacing:.06em;text-transform:uppercase;margin-top:.7rem}
@media(max-width:620px){.le-stats-grid{grid-template-columns:repeat(2,1fr)}.le-stat:nth-child(3){border-left:none}.le-stat:nth-child(odd){border-left:none}}

/* TESTIMONIALS — carousel editorial */
.le-testimonials{background:var(--le-bg2)}
.le-tcar{position:relative}
.le-tcar-track{display:flex;gap:2rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .25rem 1.5rem;-ms-overflow-style:none;scrollbar-width:none}
.le-tcar-track::-webkit-scrollbar{display:none}
.le-test-card{scroll-snap-align:start;background:var(--le-surface);border:1px solid var(--le-line2);padding:2.6rem 2.4rem;min-width:320px;max-width:400px;flex:0 0 auto}
.le-test-quote{font-family:${DISPLAY};font-size:1.18rem;font-style:italic;color:var(--le-inkDim);line-height:1.55;margin:0 0 1.6rem;font-weight:400}
.le-test-name{font-family:${BODY};font-weight:500;font-size:.92rem;letter-spacing:.04em;color:var(--le-ink)}
.le-test-role{font-size:.74rem;color:var(--le-muted);font-weight:400;letter-spacing:.04em;margin-top:.2rem}
.le-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1.2rem;margin-top:1.8rem}
.le-tcar-btn{width:46px;height:46px;border:1px solid var(--le-line);background:transparent;color:var(--le-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .3s,color .3s,border-color .3s,opacity .3s}
.le-tcar-btn:hover:not(:disabled){background:var(--le-accentDeep);color:var(--le-onAccent);border-color:var(--le-accentDeep)}
.le-tcar-btn:disabled{opacity:.3;cursor:default}
.le-tcar-dots{display:flex;gap:.5rem;align-items:center}
.le-dot-nav{width:7px;height:7px;border-radius:50%;background:var(--le-line);border:none;padding:0;cursor:pointer;transition:background .3s,transform .3s}
.le-dot-nav[aria-current="true"]{background:var(--le-accent);transform:scale(1.5)}

/* FAQ — hairline */
.le-faq{background:var(--le-bg)}
.le-faq-wrap{max-width:780px;margin:0 auto;border-top:1px solid var(--le-line)}
.le-faq-item{border-bottom:1px solid var(--le-line2)}
.le-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.5rem 0;cursor:pointer;font-family:${DISPLAY};font-size:1.22rem;font-weight:500;color:var(--le-ink);background:none;border:none;text-align:left}
.le-faq-q:focus-visible{outline:2px solid var(--le-accentDeep);outline-offset:3px}
.le-faq-icon{font-size:1.4rem;color:var(--le-accentDeep);flex-shrink:0;transition:transform .35s ${EASE};line-height:1;font-family:${BODY};font-weight:300}
.le-faq-icon.open{transform:rotate(45deg)}
.le-faq-a{font-size:.96rem;color:var(--le-inkDim);line-height:1.85;padding:0 0 1.5rem;max-width:64ch;font-weight:300}

/* CTA — panel plum editorial */
.le-cta{background:var(--le-bg2)}
.le-cta-inner{position:relative;background:var(--le-ink);color:var(--le-onAccent);padding:clamp(3.5rem,7vw,6rem) clamp(1.5rem,5vw,4rem);text-align:center;overflow:hidden}
.le-cta-inner::before{content:'';position:absolute;inset:14px;border:1px solid rgba(255,255,255,.16);pointer-events:none}
.le-cta-ew{position:relative;font-family:${BODY};font-size:.74rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#D9BBD0;margin-bottom:1.4rem}
.le-cta-title{position:relative;font-family:${DISPLAY};font-size:clamp(2.2rem,4.6vw,3.4rem);font-weight:500;margin-bottom:1.1rem;line-height:1.15;letter-spacing:-.01em;text-wrap:balance}
.le-cta-sub{position:relative;font-size:1.04rem;opacity:.85;max-width:48ch;margin:0 auto 2.6rem;line-height:1.85;font-weight:300}
.le-cta-btns{position:relative;display:flex;gap:1.4rem;justify-content:center;flex-wrap:wrap;align-items:center}
.le-cta .le-btn-primary{background:var(--le-surface);color:var(--le-ink)}
.le-cta .le-btn-primary:hover{background:var(--le-accent);color:var(--le-onAccent)}
.le-cta .le-btn-ghost{color:var(--le-onAccent);border-color:rgba(255,255,255,.4)}
.le-cta .le-btn-ghost:hover{color:#fff;border-color:#fff}

/* BAND ADD-ON */
.le-band{background:var(--le-surface);border-top:1px solid var(--le-line2);border-bottom:1px solid var(--le-line2);padding:3.4rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.6rem}
.le-band-ew{font-family:${BODY};font-size:.7rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--le-accentDeep);margin-bottom:.6rem}
.le-band .le-heading{font-size:clamp(1.5rem,2.4vw,2.1rem)}
.le-band-sub{color:var(--le-muted);font-size:.94rem;line-height:1.65;margin-top:.5rem;max-width:56ch;font-weight:300}

/* FOOTER */
.le-footer{background:var(--le-ink);color:rgba(255,255,255,.66);padding:4.6rem 7vw 2.6rem}
.le-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:3rem}
.le-footer-brand{font-family:${DISPLAY};font-size:1.8rem;font-weight:500;color:#fff;margin-bottom:1rem}
.le-footer-tagline{font-size:.9rem;color:rgba(255,255,255,.55);line-height:1.8;max-width:34ch;font-weight:300}
.le-footer-h{font-family:${BODY};font-size:.72rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#fff;margin-bottom:1.1rem}
.le-footer-link{display:block;font-size:.9rem;color:rgba(255,255,255,.66);text-decoration:none;margin-bottom:.6rem;transition:color .3s;font-weight:300}
.le-footer-link:hover{color:#fff}
.le-footer-copy{border-top:1px solid rgba(255,255,255,.13);padding-top:1.6rem;font-size:.78rem;color:rgba(255,255,255,.5);text-align:center;font-weight:300}
@media(max-width:768px){.le-footer-grid{grid-template-columns:1fr;gap:2.2rem}}

/* REVEAL — via LUX_JS (.lx-reveal → .lx-in), digate .lx-js (kontrak no-JS #138) */
.lx-js .le-rv{opacity:0;transform:translateY(24px);transition:opacity .8s ${EASE},transform .8s ${EASE}}
.lx-js .le-rv.lx-in{opacity:1;transform:none}
.le-rv-d1{transition-delay:.09s}.le-rv-d2{transition-delay:.18s}.le-rv-d3{transition-delay:.27s}.le-rv-d4{transition-delay:.36s}

/* LIGHTBOX — le-root overrides palet lx-lb (editorial) */
.le-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.le-root .lx-lb[hidden]{display:none}
.le-root .lx-lb-back{position:absolute;inset:0;background:rgba(39,31,44,.55);backdrop-filter:blur(6px);border:0;cursor:pointer}
.le-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:900px;width:100%;max-height:88vh;background:var(--le-surface);margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .45s ${EASE},transform .45s ${EASE}}
.le-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.le-root .lx-lb-media{position:relative;overflow:hidden;background:var(--le-surface2);min-height:320px}
.le-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.le-root .lx-lb-body{padding:clamp(24px,3vw,46px);display:flex;flex-direction:column;gap:11px;justify-content:center}
.le-root .lx-lb-cat{font-family:${BODY};font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--le-accentDeep)}
.le-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(24px,2.8vw,32px);font-weight:500;line-height:1.18;color:var(--le-ink)}
.le-root .lx-lb-price{font-family:${DISPLAY};font-size:20px;font-weight:500;color:var(--le-accentDeep)}
.le-root .lx-lb-desc{color:var(--le-muted);font-size:13.5px;line-height:1.8;font-weight:300}
.le-root .lx-lb-cta{margin-top:16px;width:fit-content;display:inline-flex;align-items:center;background:var(--le-accentDeep);color:var(--le-onAccent);font-family:${BODY};font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;padding:13px 28px;text-decoration:none;transition:background .3s}
.le-root .lx-lb-cta:hover{background:var(--le-ink)}
.le-root .lx-lb-x{position:absolute;top:14px;right:14px;z-index:3;width:42px;height:42px;background:var(--le-surface);border:1px solid var(--le-line);color:var(--le-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s}
.le-root .lx-lb-x:hover{background:var(--le-accentDeep);color:var(--le-onAccent);border-color:var(--le-accentDeep)}
.le-root .lx-lb-prev,.le-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:42px;height:42px;background:var(--le-surface);border:1px solid var(--le-line);color:var(--le-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s}
.le-root .lx-lb-prev:hover,.le-root .lx-lb-next:hover{background:var(--le-accentDeep);color:var(--le-onAccent)}
.le-root .lx-lb-prev{left:10px}.le-root .lx-lb-next{right:10px}
@media(max-width:640px){.le-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.le-root .lx-lb-media{min-height:240px}}

/* ── RASA polish ── */
.le-btn-primary:active,.le-nav-cta:active{transform:translateY(0)}
.le-card:active{transform:translateY(-2px)}
.le-tcar-btn:active{transform:scale(.94)}
.le-nav-cta:focus-visible,.le-btn-primary:focus-visible,.le-btn-ghost:focus-visible,.le-about-cta:focus-visible,.le-footer-link:focus-visible,.le-card:focus-visible,.le-tcar-btn:focus-visible,.le-dot-nav:focus-visible,.le-cta-btns a:focus-visible{outline:2px solid var(--le-accentDeep);outline-offset:3px}
.le-hero-sub,.le-subtext,.le-about-body,.le-cta-sub,.le-feat-desc{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Kata pita = mood editorial-derma (BUKAN klaim seperti bersertifikat/BPOM);
// tampil di SEMUA situs Lumen. Klaim spesifik milik klien → konten editabel.
const RIBBON = ['Konsultasi', 'Analisa Kulit', 'Perawatan', 'Dermatologi', 'Kenyamanan']

export default function KlinikEstetikRenderer({ content: c, variant = 'lumen' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.lumen
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa}` : '#konsultasi'
  const hero = c.hero ?? {}
  const items = c.showcase?.items ?? []
  const features = c.features ?? []
  const stats = c.stats ?? []
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []
  const jamRows = c.info?.jam ?? []

  const rootStyle = {
    '--le-bg': p.bg, '--le-bg2': p.bg2, '--le-surface': p.surface, '--le-surface2': p.surface2,
    '--le-ink': p.ink, '--le-inkDim': p.inkDim, '--le-muted': p.muted,
    '--le-accent': p.accent, '--le-accentDeep': p.accentDeep, '--le-onAccent': p.onAccent,
    '--le-line': p.line, '--le-line2': p.line2, '--le-shadow': p.shadow, '--le-shadowDeep': p.shadowDeep,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const priceText = (n?: number) => (typeof n === 'number' && n > 0 ? fmt(n) : 'Konsultasi')

  return (
    <div className="le-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: leCss() }} />

      {/* NAV */}
      <nav className="le-nav" aria-label="Navigasi utama">
        <a href="#beranda" className="le-nav-logo">{c.nama ?? 'Lumen'}</a>
        <a href={waUrl} className="le-nav-cta">Konsultasi</a>
      </nav>

      {/* HERO — editorial */}
      <section className="le-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="le-hero-text">
          {hero.eyebrow && <p className="le-hero-ew">{hero.eyebrow}</p>}
          {hero.title && <h1 className="le-hero-title">{hero.title}</h1>}
          {hero.subtitle && <p className="le-hero-sub">{hero.subtitle}</p>}
          <div className="le-hero-btns">
            <a href={hero.ctaHref ?? waUrl} className="le-btn-primary">{hero.ctaText ?? 'Konsultasi Gratis'}</a>
            <a href={hero.ctaHref2 ?? '#perawatan'} className="le-btn-ghost">{hero.ctaText2 ?? 'Lihat Perawatan'}</a>
          </div>
          {stats.length > 0 && (
            <div className="le-hero-meta">
              {stats.slice(0, 3).map((s, i) => (
                <div key={i} className="le-meta-item">
                  <span className="le-meta-num">{s.angka}</span>
                  <span className="le-meta-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="le-hero-media">
          <div className="le-hero-frame">
            {hero.image
              ? <img src={hero.image} alt={c.nama ?? 'Klinik estetik'} loading="eager" style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined} />
              : <span aria-hidden style={{ display: 'block', width: '100%', height: '100%' }} />}
          </div>
          <div className="le-hero-tag">
            <b>{c.nama ?? 'Lumen'}</b>
            <span>{hero.eyebrow ?? 'Klinik Estetik'}</span>
          </div>
        </div>
      </section>

      {/* PITA */}
      <div className="le-ribbon" aria-hidden="true">
        <div className="le-ribbon-row">
          {RIBBON.map((m, i) => (
            <span key={i} className="le-ribbon-item">{m}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="le-section" id="keunggulan">
          <div className="le-sec-hdr le-rv lx-reveal">
            <p className="le-eyebrow">{c.featuresEyebrow ?? 'Kenapa Kami'}</p>
            {c.featuresTitle && <h2 className="le-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="le-feat-grid">
            {features.slice(0, 3).map((f, i) => (
              <div key={i} className={`le-feat-card le-rv lx-reveal le-rv-d${i + 1}`}>
                <div className="le-feat-idx">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="le-feat-title">{f.title}</h3>
                <p className="le-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SHOWCASE — kartu numeral serif (signature) */}
      {items.length > 0 && (
        <section className="le-section le-showcase" id="perawatan">
          <div className="le-sec-hdr le-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.6rem' }}>
            <p className="le-eyebrow" style={{ justifyContent: 'center' }}>Perawatan</p>
            {c.showcase?.title && <h2 className="le-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="le-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{c.showcase.subtitle}</p>}
          </div>
          <div className="le-grid lx-look" data-count={items.length}>
            {items.map((item, i) => (
              <article
                key={i}
                className="le-card lx-lb-open le-rv lx-reveal"
                style={{ transitionDelay: `${(i % 2) * 0.1}s` }}
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
                <div className="le-card-inner">
                  <div className="le-card-frame">
                    <span className="le-card-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                    {item.gambar && <img src={item.gambar} alt={item.nama} loading="lazy" />}
                  </div>
                  <div className="le-card-body">
                    {item.kategori && <span className="le-card-cat">{item.kategori}</span>}
                    <h3 className="le-card-name">{item.nama}</h3>
                    {item.desc && <p className="le-card-desc">{item.desc}</p>}
                    <div className="le-card-foot">
                      <span className={`le-card-price${typeof item.harga === 'number' && item.harga > 0 ? '' : ' le-card-price-soft'}`}>
                        {priceText(item.harga)}
                      </span>
                      {typeof item.durasi === 'number' && item.durasi > 0 && (
                        <span className="le-card-dur">{item.durasi} menit</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT */}
      {c.statement && (
        <div className="le-statement">
          <div className="le-stmt-inner le-rv lx-reveal">
            {c.statement.eyebrow && <p className="le-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="le-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="le-stmt-cite">{c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="le-section le-about" id="tentang">
          <div className={`le-about-inner${c.about.image ? '' : ' le-about-solo'}`}>
            <div className="le-rv lx-reveal">
              <p className="le-eyebrow">Tentang Kami</p>
              <h2 className="le-heading">{c.about.title}</h2>
              <p className="le-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="le-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="le-about-img le-rv lx-reveal le-rv-d2">
                <div className="le-about-frame">
                  <img src={c.about.image} alt={c.about.title} loading="lazy" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="le-stats">
          <div className="le-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="le-stat">
                <div className="le-stat-num" data-cu>{s.angka}</div>
                <div className="le-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="le-section le-testimonials" id="ulasan">
          <div className="le-sec-hdr le-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="le-eyebrow" style={{ justifyContent: 'center' }}>Ulasan</p>
            <h2 className="le-heading">Kata Pasien Kami</h2>
          </div>
          <div className="le-tcar lx-tcar">
            <div className="le-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="le-test-card">
                  <p className="le-test-quote">&ldquo;{t.quote}&rdquo;</p>
                  <p className="le-test-name">{t.nama}</p>
                  {t.peran && <p className="le-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="le-tcar-ctrl">
                <button className="le-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="le-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="le-dot-nav lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="le-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="le-section le-faq" id="faq">
          <div className="le-sec-hdr le-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="le-eyebrow" style={{ justifyContent: 'center' }}>Pertanyaan</p>
            <h2 className="le-heading">Sering Ditanyakan</h2>
          </div>
          <div className="le-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="le-faq-item">
                <button
                  className="le-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`le-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="le-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="le-section le-cta" id="konsultasi">
          <div className="le-cta-inner le-rv lx-reveal">
            <p className="le-cta-ew">Mulai Hari Ini</p>
            <h2 className="le-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="le-cta-sub">{c.cta.subtitle}</p>}
            <div className="le-cta-btns">
              <a href={waUrl} className="le-btn-primary">{c.cta.ctaText ?? 'Konsultasi via WhatsApp'}</a>
              <a href="#perawatan" className="le-btn-ghost">Lihat Perawatan</a>
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON */}
      {(c.bands ?? []).map((b, i) => (
        <section className="le-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="le-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="le-heading">{b.title}</h2>
            {b.subtitle && <p className="le-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="le-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="le-footer">
        <div className="le-footer-grid">
          <div>
            <p className="le-footer-brand">{c.nama ?? 'Lumen'}</p>
            <p className="le-footer-tagline">
              {hero.eyebrow ?? `${c.nama ?? 'Lumen'} — klinik estetik & dermatologi.`}
            </p>
          </div>
          <div>
            <p className="le-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="le-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="le-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="le-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="le-footer-h">Jam Praktik</p>
            {jamRows.length
              ? jamRows.map((j, i) => <p key={i} className="le-footer-link">{j.hari}: {j.jam}</p>)
              : (
                <>
                  <p className="le-footer-link">Senin–Sabtu: 10.00–20.00</p>
                  <p className="le-footer-link">Minggu: Dengan perjanjian</p>
                </>
              )}
          </div>
        </div>
        <p className="le-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Lumen'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX */}
      <BespokeLightbox ctaText="Konsultasi via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
