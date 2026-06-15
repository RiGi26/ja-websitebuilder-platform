'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// ALMAMATER — Sekolah Umum (SD/SMP/SMA) Bespoke Lux Renderer (Collegiate Prestige)
// Industri JASA (source: services) — bukan toko (tanpa keranjang). Tinggal di
// folder toko-bespoke/ sbg rumah engine bespoke bersama; registry LINTAS INDUSTRI.
// Libre Baskerville (display serif) + Source Sans 3 (body) |
// Krem #F6F1E6 · paper #FCF9F1 · ink navy #15294B |
// accent gold #93722C / accentDeep #74571C · gold-on-dark #C9A24A |
// signature: LENCANA/crest sekolah (perisai heraldik SVG + monogram + bintang +
//   laurel) di hero & penanda section + pita nilai (values) | ns: al-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.al-*`.
// Light palette → contrast.test menjaga WCAG (navy AAA, gold accentDeep ≥4.5 teks,
// accent ≥3 dekoratif). Berwibawa-akademik — sengaja beda dari klinik-umum
// (Bricolage/biru-klinis/EKG) & anak (playful) & restaurant-lux (gelap).
// ============================================================

export interface AlPal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentDeep: string; onAccent: string
  line: string; line2: string; shadow: string; shadowDeep: string
}

export const PALETTES: Record<string, AlPal> = {
  // Almamater — krem hangat, tinta navy, aksen emas-perunggu (antique gold).
  almamater: {
    bg: '#F6F1E6', bg2: '#EFE8D8', surface: '#FCF9F1', surface2: '#EAE2CF',
    ink: '#15294B', inkDim: '#2E456A', muted: '#535D75',
    accent: '#93722C', accentDeep: '#74571C', onAccent: '#F6F1E6',
    line: 'rgba(21,41,75,.14)', line2: 'rgba(21,41,75,.07)',
    shadow: 'rgba(21,41,75,.1)', shadowDeep: 'rgba(21,41,75,.2)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap'
const DISPLAY = '"Libre Baskerville",Georgia,"Times New Roman",serif'
const BODY = '"Source Sans 3","Segoe UI",system-ui,sans-serif'
const EASE = 'cubic-bezier(.22,1,.36,1)'
// Emas terang khusus DI ATAS navy (crest, footer, panel CTA) — kontras tinggi di
// latar gelap; di latar terang pakai accent/accentDeep (lihat contrast.test).
const GOLD = '#C9A24A'

// Lencana/crest sekolah (signature) — perisai heraldik + monogram + bintang +
// laurel. Dekoratif (aria-hidden); monogram di-overlay HTML supaya font display
// pasti terpakai. Tampil tanpa JS.
function Crest({ initial }: { initial: string }) {
  return (
    <div className="al-crest" aria-hidden="true">
      <svg className="al-crest-shield" viewBox="0 0 100 116" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M50 4 L92 16 V58 C92 84 73 102 50 112 C27 102 8 84 8 58 V16 Z" fill="var(--al-ink)" stroke={GOLD} strokeWidth="2.5" />
        <path d="M50 13 L83 23 V57 C83 78 67 93 50 100 C33 93 17 78 17 57 V23 Z" fill="none" stroke={GOLD} strokeWidth="1" opacity=".5" />
        <path d="M50 23 l2.7 5.7 6.3 .7 -4.6 4.3 1.2 6.1 -5.6 -3 -5.6 3 1.2 -6.1 -4.6 -4.3 6.3 -.7 Z" fill={GOLD} />
        <path d="M31 88 q-9 -10 -7 -23" stroke={GOLD} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".85" />
        <path d="M69 88 q9 -10 7 -23" stroke={GOLD} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".85" />
      </svg>
      <span className="al-crest-mono">{initial}</span>
    </div>
  )
}

// Mark kecil = perisai mini untuk eyebrow/nav (currentColor).
function ShieldMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`al-mark ${className}`} viewBox="0 0 24 28" fill="currentColor" aria-hidden="true">
      <path d="M12 1 L22 4 V15 C22 22 17 26 12 27 C7 26 2 22 2 15 V4 Z" />
    </svg>
  )
}

function alCss(): string {
  return `
@import url('${FONT_IMPORT}');
html,body{overflow-x:hidden;max-width:100%}
.al-root{font-family:${BODY};color:var(--al-ink);background:var(--al-bg);line-height:1.7;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.al-root *,.al-root *::before,.al-root *::after{box-sizing:border-box;margin:0;padding:0}
.al-root img{max-width:100%;height:auto;display:block}
.al-root ::selection{background:rgba(147,114,44,.22);color:var(--al-ink)}

/* Mark perisai mini */
.al-mark{width:.86em;height:1em;flex-shrink:0;display:inline-block;vertical-align:-.08em}

/* NAV */
.al-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.1rem 7vw;display:flex;align-items:center;justify-content:space-between;transition:background .45s,box-shadow .45s,backdrop-filter .45s,padding .45s}
.al-root.lx-scrolled .al-nav{background:rgba(246,241,230,.9);backdrop-filter:blur(11px);box-shadow:0 1px 0 var(--al-line2),0 6px 22px var(--al-shadow);padding-top:.82rem;padding-bottom:.82rem}
.al-nav-logo{font-family:${DISPLAY};font-weight:700;color:var(--al-ink);font-size:1.5rem;text-decoration:none;display:flex;align-items:center;gap:.55rem;letter-spacing:.01em}
.al-nav-logo .al-mark{color:var(--al-accentDeep)}
.al-nav-cta{font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--al-onAccent);background:var(--al-ink);padding:.66rem 1.4rem;border-radius:8px;text-decoration:none;transition:transform .3s ${EASE},background .3s}
.al-nav-cta:hover{transform:translateY(-2px);background:var(--al-accentDeep)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO — teks + foto + crest mengambang (signature) */
.al-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:clamp(2rem,5vw,4.5rem);padding:8.5rem 7vw 4.5rem;background:radial-gradient(115% 90% at 90% 6%,var(--al-bg2),var(--al-bg) 60%)}
.al-hero-text{position:relative;z-index:2}
.al-eyebrow{font-size:.78rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--al-accentDeep);margin-bottom:1.1rem;display:inline-flex;align-items:center;gap:.5rem}
.al-eyebrow .al-mark{color:var(--al-accent)}
.al-hero-title{font-family:${DISPLAY};font-weight:700;font-size:clamp(2.6rem,6vw,5rem);line-height:1.08;color:var(--al-ink);margin-bottom:1.3rem;letter-spacing:.005em;text-wrap:balance}
.al-hero-title em{font-style:italic;color:var(--al-accentDeep)}
.al-hero-rule{width:64px;height:3px;background:var(--al-accent);margin-bottom:1.5rem;border-radius:2px}
.al-hero-sub{font-size:1.1rem;color:var(--al-inkDim);margin-bottom:2rem;max-width:46ch;line-height:1.8}
.al-hero-btns{display:flex;gap:.9rem;flex-wrap:wrap;align-items:center;margin-bottom:2.3rem}
.al-btn-primary{font-size:.84rem;font-weight:700;letter-spacing:.04em;background:var(--al-ink);color:var(--al-onAccent);padding:.95rem 1.9rem;border-radius:9px;text-decoration:none;transition:transform .3s ${EASE},background .3s,box-shadow .3s;box-shadow:0 8px 20px var(--al-shadow)}
.al-btn-primary:hover{transform:translateY(-3px);background:var(--al-accentDeep);box-shadow:0 14px 30px var(--al-shadowDeep)}
.al-btn-ghost{font-size:.84rem;font-weight:700;letter-spacing:.04em;color:var(--al-ink);padding:.95rem 1.55rem;text-decoration:none;border-radius:9px;border:1.5px solid var(--al-line);transition:border-color .3s,color .3s,transform .3s ${EASE},background .3s}
.al-btn-ghost:hover{border-color:var(--al-accent);color:var(--al-accentDeep);background:var(--al-surface);transform:translateY(-2px)}
.al-hero-meta{display:flex;flex-wrap:wrap;gap:2rem}
.al-meta-item{display:flex;flex-direction:column;gap:.12rem}
.al-meta-num{font-family:${DISPLAY};font-size:1.9rem;font-weight:700;color:var(--al-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.al-meta-label{font-size:.76rem;color:var(--al-muted);font-weight:600;letter-spacing:.02em}
/* Media + crest */
.al-hero-media{position:relative;z-index:1;min-height:440px}
.al-hero-photo{position:relative;height:100%;min-height:440px;border-radius:8px 8px 120px 120px / 8px 8px 60px 60px;overflow:hidden;background:var(--al-surface2);box-shadow:0 30px 64px var(--al-shadowDeep),0 0 0 1px var(--al-line2)}
.al-hero-photo img{width:100%;height:100%;object-fit:cover}
.al-hero-photo-ph{position:absolute;inset:0;background:linear-gradient(160deg,var(--al-surface2),var(--al-bg2))}
/* Crest (SIGNATURE) */
.al-crest{position:absolute;left:-1.6rem;bottom:1.8rem;z-index:3;width:7.6rem;height:8.8rem;filter:drop-shadow(0 18px 34px var(--al-shadowDeep))}
.al-crest-shield{position:absolute;inset:0;width:100%;height:100%}
.al-crest-mono{position:absolute;left:0;right:0;top:46%;transform:translateY(-50%);text-align:center;font-family:${DISPLAY};font-weight:700;font-size:2.5rem;color:${GOLD};line-height:1}
@media(max-width:880px){
  .al-hero{grid-template-columns:1fr;min-height:unset;padding:7rem 7vw 3rem}
  .al-hero-media{order:-1;max-width:440px;margin:0 auto;min-height:360px}
  .al-hero-photo{min-height:340px}
  .al-crest{left:auto;right:-.5rem;bottom:-1rem}
}
@media(max-width:560px){.al-nav{padding:.9rem 6vw}.al-crest{right:0;width:6.4rem;height:7.4rem}.al-crest-mono{font-size:2.1rem}}

/* VALUES RIBBON — nilai sekolah (BUKAN klaim) */
.al-ribbon{background:var(--al-surface);border-top:1px solid var(--al-line2);border-bottom:1px solid var(--al-line2);padding:1.15rem 7vw}
.al-ribbon-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.6rem 1.6rem}
.al-ribbon-item{font-family:${DISPLAY};font-size:.92rem;color:var(--al-inkDim);display:inline-flex;align-items:center;gap:.7rem;letter-spacing:.01em}
.al-ribbon-item::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--al-accent)}

/* SECTION COMMONS */
.al-section{padding:clamp(4.2rem,8vw,7rem) 7vw}
.al-eyebrow-c{justify-content:center}
.al-heading{font-family:${DISPLAY};font-weight:700;font-size:clamp(2rem,3.8vw,3.1rem);color:var(--al-ink);line-height:1.16;letter-spacing:.005em;text-wrap:balance}
.al-subtext{color:var(--al-inkDim);font-size:1.02rem;margin-top:.9rem;max-width:56ch;line-height:1.8}
.al-sec-hdr{margin-bottom:3.2rem;max-width:62ch}

/* FEATURES — kartu ber-mark perisai */
.al-feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3rem}
.al-feat-card{padding:2rem 1.7rem;background:var(--al-surface);border:1px solid var(--al-line2);border-radius:14px;border-top:3px solid var(--al-accent);transition:transform .35s ${EASE},box-shadow .35s,border-color .35s}
.al-feat-card:hover{transform:translateY(-5px);box-shadow:0 20px 42px var(--al-shadow)}
.al-feat-ic{width:2.9rem;height:2.9rem;display:flex;align-items:center;justify-content:center;border-radius:10px;margin-bottom:1.15rem;background:var(--al-bg2);color:var(--al-accentDeep);font-size:1.3rem}
.al-feat-ic .al-mark{width:1.3rem;height:1.5rem}
.al-feat-title{font-family:${DISPLAY};font-size:1.18rem;font-weight:700;color:var(--al-ink);margin-bottom:.5rem;line-height:1.3}
.al-feat-desc{font-size:.9rem;color:var(--al-muted);line-height:1.7}
@media(max-width:900px){.al-feat-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.al-feat-grid{grid-template-columns:1fr}}

/* SHOWCASE PROGRAM/JENJANG — kartu + quick-look */
.al-showcase{background:var(--al-bg2)}
.al-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.3rem,3vw,2rem)}
.al-grid[data-count="1"]{grid-template-columns:minmax(0,380px);justify-content:center}
.al-grid[data-count="2"]{grid-template-columns:repeat(2,minmax(0,360px));justify-content:center;max-width:820px;margin:0 auto}
.al-card{position:relative;cursor:pointer;background:var(--al-surface);border:1px solid var(--al-line2);border-radius:14px;overflow:hidden;transition:transform .4s ${EASE},box-shadow .4s,border-color .4s;display:flex;flex-direction:column}
.al-card:hover{transform:translateY(-6px);box-shadow:0 26px 52px var(--al-shadow);border-color:var(--al-line)}
.al-card-frame{position:relative;aspect-ratio:16/11;overflow:hidden;background:var(--al-surface2)}
.al-card-frame img{width:100%;height:100%;object-fit:cover;transition:transform .6s ${EASE}}
.al-card:hover .al-card-frame img{transform:scale(1.05)}
.al-card-cat{position:absolute;top:.7rem;left:.7rem;z-index:2;font-size:.66rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--al-onAccent);background:var(--al-ink);padding:.34rem .7rem;border-radius:6px}
.al-card-body{padding:1.2rem 1.3rem 1.35rem;display:flex;flex-direction:column;flex:1}
.al-card-name{font-family:${DISPLAY};font-size:1.22rem;font-weight:700;color:var(--al-ink);margin-bottom:.4rem;line-height:1.28}
.al-card-desc{font-size:.88rem;color:var(--al-muted);margin-bottom:1rem;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.al-card-foot{display:flex;align-items:center;justify-content:space-between;gap:.7rem;margin-top:auto;padding-top:.85rem;border-top:1px solid var(--al-line2)}
.al-card-price{font-family:${DISPLAY};font-size:1.04rem;font-weight:700;color:var(--al-accentDeep)}
.al-card-price-soft{font-size:.9rem;font-weight:700;color:var(--al-muted)}
.al-card-more{font-size:.76rem;font-weight:700;letter-spacing:.04em;color:var(--al-accentDeep);display:inline-flex;align-items:center;gap:.3rem;transition:gap .3s}
.al-card:hover .al-card-more{gap:.6rem}
@media(max-width:980px){.al-grid{grid-template-columns:repeat(2,1fr)}.al-grid[data-count="1"]{grid-template-columns:minmax(0,380px)}}
@media(max-width:560px){.al-grid,.al-grid[data-count="1"],.al-grid[data-count="2"]{grid-template-columns:1fr;max-width:380px;margin:0 auto}}

/* STATEMENT — panel berwibawa + mark */
.al-statement{padding:clamp(3.5rem,7vw,6rem) 7vw}
.al-stmt-inner{position:relative;max-width:62ch;margin:0 auto;background:var(--al-ink);color:var(--al-onAccent);border-radius:18px;padding:clamp(2.6rem,5vw,3.8rem);text-align:center;overflow:hidden}
.al-stmt-inner::before,.al-stmt-inner::after{content:'';position:absolute;width:120px;height:120px;border:1px solid rgba(201,162,74,.3);border-radius:50%}
.al-stmt-inner::before{top:-50px;left:-50px}
.al-stmt-inner::after{bottom:-50px;right:-50px}
.al-stmt-mark{position:relative;color:${GOLD};width:30px;height:35px;margin:0 auto 1.2rem}
.al-stmt-ew{position:relative;font-size:.76rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${GOLD};margin-bottom:1rem}
.al-stmt-quote{position:relative;font-family:${DISPLAY};font-style:italic;font-weight:400;font-size:clamp(1.45rem,2.8vw,2.15rem);color:var(--al-onAccent);line-height:1.4}
.al-stmt-cite{position:relative;display:block;font-size:.82rem;color:rgba(246,241,230,.72);font-weight:600;margin-top:1.3rem;font-style:normal}

/* ABOUT — split + bingkai */
.al-about{background:var(--al-bg)}
.al-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:center}
.al-about-inner.al-about-solo{grid-template-columns:1fr;max-width:62ch;margin:0 auto;text-align:center}
.al-about-solo .al-eyebrow{justify-content:center}
.al-about-solo .al-about-body{margin-left:auto;margin-right:auto}
.al-about-body{font-size:1.02rem;color:var(--al-inkDim);line-height:1.9;margin-top:1.1rem;white-space:pre-line}
.al-about-cta{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.7rem;font-size:.84rem;font-weight:700;letter-spacing:.04em;color:var(--al-accentDeep);text-decoration:none;transition:gap .3s,color .3s}
.al-about-cta:hover{gap:.8rem;color:var(--al-ink)}
.al-about-img{position:relative}
.al-about-frame{position:relative;z-index:1;aspect-ratio:4/3;border-radius:14px;overflow:hidden;box-shadow:0 28px 60px var(--al-shadowDeep);border:1px solid var(--al-line2)}
.al-about-frame img{width:100%;height:100%;object-fit:cover}
.al-about-corner{position:absolute;bottom:-.9rem;left:-.9rem;z-index:2;width:58px;height:58px;border-radius:12px;background:var(--al-ink);display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px var(--al-shadowDeep)}
.al-about-corner .al-mark{width:1.5rem;height:1.75rem;color:${GOLD}}
@media(max-width:840px){.al-about-inner{grid-template-columns:1fr;gap:2.5rem}.al-about-img{order:-1;max-width:420px;margin:0 auto}}

/* STATS — angka ber-countUp di panel navy */
.al-stats{background:var(--al-ink)}
.al-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3rem;text-align:center}
.al-stat{padding:1.4rem 1rem}
.al-stat-num{font-family:${DISPLAY};font-size:clamp(2.2rem,4.4vw,3rem);font-weight:700;color:${GOLD};line-height:1;font-variant-numeric:tabular-nums}
.al-stat-label{font-size:.78rem;color:rgba(246,241,230,.72);font-weight:600;margin-top:.6rem}
@media(max-width:560px){.al-stats-grid{grid-template-columns:repeat(2,1fr);gap:1rem}}

/* TESTIMONIALS — carousel */
.al-testimonials{background:var(--al-bg)}
.al-tcar{position:relative}
.al-tcar-track{display:flex;gap:1.2rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .25rem 1.5rem;-ms-overflow-style:none;scrollbar-width:none}
.al-tcar-track::-webkit-scrollbar{display:none}
.al-test-card{scroll-snap-align:start;background:var(--al-surface);border:1px solid var(--al-line2);border-radius:14px;padding:2rem;min-width:300px;max-width:360px;flex:0 0 auto;box-shadow:0 10px 26px var(--al-shadow)}
.al-test-stars{color:var(--al-accent);font-size:.95rem;letter-spacing:.15em;margin-bottom:.85rem}
.al-test-quote{font-family:${DISPLAY};font-style:italic;font-size:1.02rem;color:var(--al-inkDim);line-height:1.7;margin:0 0 1.3rem}
.al-test-name{font-family:${DISPLAY};font-weight:700;font-size:1rem;color:var(--al-ink)}
.al-test-role{font-size:.78rem;color:var(--al-muted);font-weight:600;margin-top:.15rem}
.al-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1.1rem;margin-top:1.4rem}
.al-tcar-btn{width:44px;height:44px;border-radius:9px;background:var(--al-surface);border:1px solid var(--al-line);color:var(--al-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s,border-color .25s,opacity .25s,transform .25s ${EASE}}
.al-tcar-btn:hover:not(:disabled){background:var(--al-ink);color:var(--al-onAccent);border-color:var(--al-ink);transform:translateY(-2px)}
.al-tcar-btn:disabled{opacity:.3;cursor:default}
.al-tcar-dots{display:flex;gap:.5rem;align-items:center}
.al-dot-nav{width:8px;height:8px;border-radius:50%;background:var(--al-line);border:none;padding:0;cursor:pointer;transition:background .25s,transform .25s}
.al-dot-nav[aria-current="true"]{background:var(--al-accent);transform:scale(1.5)}

/* FAQ */
.al-faq{background:var(--al-bg2)}
.al-faq-wrap{max-width:760px;margin:0 auto}
.al-faq-item{background:var(--al-surface);border:1px solid var(--al-line2);border-radius:12px;margin-bottom:.8rem;overflow:hidden}
.al-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.25rem 1.4rem;cursor:pointer;font-family:${DISPLAY};font-size:1.1rem;font-weight:700;color:var(--al-ink);background:none;border:none;text-align:left}
.al-faq-q:focus-visible{outline:2px solid var(--al-accentDeep);outline-offset:-2px;border-radius:10px}
.al-faq-icon{font-size:1.4rem;color:var(--al-accentDeep);flex-shrink:0;transition:transform .3s ${EASE};line-height:1}
.al-faq-icon.open{transform:rotate(45deg)}
.al-faq-a{font-size:.95rem;color:var(--al-inkDim);line-height:1.8;padding:0 1.4rem 1.3rem;max-width:64ch}

/* CTA — panel navy + crest mark */
.al-cta{background:var(--al-bg)}
.al-cta-inner{position:relative;background:var(--al-ink);color:var(--al-onAccent);border-radius:20px;padding:clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem);text-align:center;overflow:hidden}
.al-cta-inner::after{content:'';position:absolute;width:240px;height:240px;border-radius:50%;border:1px solid rgba(201,162,74,.25);top:-90px;left:-70px}
.al-cta-mark{position:relative;color:${GOLD};width:30px;height:35px;margin:0 auto 1.3rem}
.al-cta-title{position:relative;font-family:${DISPLAY};font-weight:700;font-size:clamp(2rem,4.4vw,3.1rem);margin-bottom:.9rem;line-height:1.18;letter-spacing:.005em;text-wrap:balance}
.al-cta-sub{position:relative;font-size:1.05rem;color:rgba(246,241,230,.9);max-width:50ch;margin:0 auto 2.2rem;line-height:1.8}
.al-cta-btns{position:relative;display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap}
.al-cta .al-btn-primary{background:${GOLD};color:var(--al-ink);box-shadow:0 8px 22px rgba(0,0,0,.22)}
.al-cta .al-btn-primary:hover{background:var(--al-surface);color:var(--al-ink)}
.al-cta .al-btn-ghost{color:var(--al-onAccent);border-color:rgba(246,241,230,.45)}
.al-cta .al-btn-ghost:hover{color:#fff;border-color:#fff;background:rgba(246,241,230,.08)}

/* BAND ADD-ON */
.al-band{background:var(--al-surface);border-top:1px solid var(--al-line2);border-bottom:1px solid var(--al-line2);padding:3.2rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.4rem}
.al-band-ew{font-size:.74rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--al-accentDeep);margin-bottom:.5rem}
.al-band .al-heading{font-size:clamp(1.5rem,2.4vw,2rem)}
.al-band-sub{color:var(--al-muted);font-size:.95rem;line-height:1.6;margin-top:.5rem;max-width:56ch}

/* FOOTER */
.al-footer{background:var(--al-ink);color:rgba(246,241,230,.72);padding:4.2rem 7vw 2.4rem}
.al-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.6rem}
.al-footer-brand{font-family:${DISPLAY};font-size:1.6rem;font-weight:700;color:#fff;margin-bottom:.8rem;display:flex;align-items:center;gap:.5rem}
.al-footer-brand .al-mark{color:${GOLD}}
.al-footer-tagline{font-size:.9rem;color:rgba(246,241,230,.6);line-height:1.7;max-width:36ch}
.al-footer-h{font-size:.76rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;margin-bottom:1rem}
.al-footer-link{display:block;font-size:.9rem;color:rgba(246,241,230,.72);text-decoration:none;margin-bottom:.55rem;transition:color .25s}
.al-footer-link:hover{color:${GOLD}}
.al-footer-copy{border-top:1px solid rgba(246,241,230,.14);padding-top:1.5rem;font-size:.8rem;color:rgba(246,241,230,.55);text-align:center}
@media(max-width:768px){.al-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* REVEAL — via LUX_JS (.lx-reveal → .lx-in), digate .lx-js (kontrak no-JS #138) */
.lx-js .al-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ${EASE},transform .7s ${EASE}}
.lx-js .al-rv.lx-in{opacity:1;transform:none}
.al-rv-d1{transition-delay:.08s}.al-rv-d2{transition-delay:.16s}.al-rv-d3{transition-delay:.24s}.al-rv-d4{transition-delay:.32s}

/* LIGHTBOX — al-root overrides palet lx-lb (almamater) */
.al-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.al-root .lx-lb[hidden]{display:none}
.al-root .lx-lb-back{position:absolute;inset:0;background:rgba(21,41,75,.55);backdrop-filter:blur(6px);border:0;cursor:pointer}
.al-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--al-surface);border:1px solid var(--al-line2);border-radius:18px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .42s ${EASE},transform .42s ${EASE}}
.al-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.al-root .lx-lb-media{position:relative;overflow:hidden;background:var(--al-surface2);min-height:300px}
.al-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.al-root .lx-lb-body{padding:clamp(22px,3vw,42px);display:flex;flex-direction:column;gap:9px;justify-content:center}
.al-root .lx-lb-cat{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--al-accentDeep)}
.al-root .lx-lb-title{font-family:${DISPLAY};font-weight:700;font-size:clamp(22px,2.6vw,29px);line-height:1.2;color:var(--al-ink)}
.al-root .lx-lb-price{font-family:${DISPLAY};font-size:19px;font-weight:700;color:var(--al-accentDeep)}
.al-root .lx-lb-desc{color:var(--al-muted);font-size:13.5px;line-height:1.8}
.al-root .lx-lb-cta{margin-top:14px;width:fit-content;display:inline-flex;align-items:center;background:var(--al-ink);color:var(--al-onAccent);font-size:12px;font-weight:700;letter-spacing:.04em;padding:12px 24px;border-radius:9px;text-decoration:none;transition:background .25s}
.al-root .lx-lb-cta:hover{background:var(--al-accentDeep)}
.al-root .lx-lb-x{position:absolute;top:12px;right:12px;z-index:3;width:40px;height:40px;border-radius:9px;background:var(--al-surface);border:1px solid var(--al-line);color:var(--al-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.al-root .lx-lb-x:hover{background:var(--al-ink);color:var(--al-onAccent);border-color:var(--al-ink)}
.al-root .lx-lb-prev,.al-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:40px;height:40px;border-radius:9px;background:var(--al-surface);border:1px solid var(--al-line);color:var(--al-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.al-root .lx-lb-prev:hover,.al-root .lx-lb-next:hover{background:var(--al-ink);color:var(--al-onAccent)}
.al-root .lx-lb-prev{left:8px}.al-root .lx-lb-next{right:8px}
@media(max-width:640px){.al-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.al-root .lx-lb-media{min-height:230px}}

/* ── RASA polish ── */
.al-btn-primary:active,.al-nav-cta:active{transform:translateY(0) scale(.97)}
.al-card:active{transform:translateY(-2px)}
.al-tcar-btn:active{transform:scale(.93)}
.al-nav-cta:focus-visible,.al-btn-primary:focus-visible,.al-btn-ghost:focus-visible,.al-about-cta:focus-visible,.al-footer-link:focus-visible,.al-card:focus-visible,.al-tcar-btn:focus-visible,.al-dot-nav:focus-visible,.al-cta-btns a:focus-visible{outline:3px solid var(--al-accent);outline-offset:3px}
.al-hero-sub,.al-subtext,.al-about-body,.al-cta-sub,.al-feat-desc,.al-test-quote{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Kata pita = NILAI sekolah (aspiratif, BUKAN klaim verifiable spt akreditasi A);
// tampil di SEMUA situs Almamater. Klaim spesifik milik klien → konten editabel.
const VALUES = ['Belajar', 'Berkarakter', 'Disiplin', 'Kepedulian', 'Kebersamaan']

export default function SekolahAlmamaterRenderer({ content: c, variant = 'almamater' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.almamater
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa}` : '#daftar'
  const hero = c.hero ?? {}
  const items = c.showcase?.items ?? []
  const features = c.features ?? []
  const stats = c.stats ?? []
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []
  const jamRows = c.info?.jam ?? []
  const initial = (c.nama ?? 'S').trim().charAt(0).toUpperCase() || 'S'

  const rootStyle = {
    '--al-bg': p.bg, '--al-bg2': p.bg2, '--al-surface': p.surface, '--al-surface2': p.surface2,
    '--al-ink': p.ink, '--al-inkDim': p.inkDim, '--al-muted': p.muted,
    '--al-accent': p.accent, '--al-accentDeep': p.accentDeep, '--al-onAccent': p.onAccent,
    '--al-line': p.line, '--al-line2': p.line2, '--al-shadow': p.shadow, '--al-shadowDeep': p.shadowDeep,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const priceText = (n?: number) => (typeof n === 'number' && n > 0 ? fmt(n) : 'Info Pendaftaran')

  return (
    <div className="al-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: alCss() }} />

      {/* NAV */}
      <nav className="al-nav" aria-label="Navigasi utama">
        <span className="al-nav-logo"><ShieldMark />{c.nama ?? 'Sekolah'}</span>
        <a href={waUrl} className="al-nav-cta">Daftar</a>
      </nav>

      {/* HERO — teks + foto + crest (signature) */}
      <section className="al-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="al-hero-text">
          {hero.eyebrow && <p className="al-eyebrow"><ShieldMark />{hero.eyebrow}</p>}
          {hero.title && <h1 className="al-hero-title">{hero.title}</h1>}
          <div className="al-hero-rule" aria-hidden />
          {hero.subtitle && <p className="al-hero-sub">{hero.subtitle}</p>}
          <div className="al-hero-btns">
            <a href={hero.ctaHref ?? waUrl} className="al-btn-primary">{hero.ctaText ?? 'Daftar Sekarang'}</a>
            <a href={hero.ctaHref2 ?? '#program'} className="al-btn-ghost">{hero.ctaText2 ?? 'Lihat Program'}</a>
          </div>
          {stats.length > 0 && (
            <div className="al-hero-meta">
              {stats.slice(0, 3).map((s, i) => (
                <div key={i} className="al-meta-item">
                  <span className="al-meta-num">{s.angka}</span>
                  <span className="al-meta-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="al-hero-media">
          <div className="al-hero-photo">
            {hero.image ? (
              <img
                src={hero.image}
                alt={c.nama ?? 'Sekolah'}
                loading="eager"
                style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
              />
            ) : (
              <span className="al-hero-photo-ph" aria-hidden />
            )}
          </div>
          <Crest initial={initial} />
        </div>
      </section>

      {/* VALUES RIBBON */}
      <div className="al-ribbon" aria-hidden="true">
        <div className="al-ribbon-row">
          {VALUES.map((m, i) => (
            <span key={i} className="al-ribbon-item">{m}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="al-section" id="keunggulan">
          <div className="al-sec-hdr al-rv lx-reveal">
            <p className="al-eyebrow"><ShieldMark />{c.featuresEyebrow ?? 'Keunggulan Kami'}</p>
            {c.featuresTitle && <h2 className="al-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="al-feat-grid">
            {features.slice(0, 4).map((f, i) => (
              <div key={i} className={`al-feat-card al-rv lx-reveal al-rv-d${i + 1}`}>
                <div className="al-feat-ic" aria-hidden><ShieldMark /></div>
                <h3 className="al-feat-title">{f.title}</h3>
                <p className="al-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SHOWCASE PROGRAM/JENJANG — kartu + quick-look */}
      {items.length > 0 && (
        <section className="al-section al-showcase" id="program">
          <div className="al-sec-hdr al-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.2rem' }}>
            <p className="al-eyebrow al-eyebrow-c"><ShieldMark />Program</p>
            {c.showcase?.title && <h2 className="al-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="al-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{c.showcase.subtitle}</p>}
          </div>
          <div className="al-grid lx-look" data-count={items.length}>
            {items.map((item, i) => (
              <article
                key={i}
                className="al-card lx-lb-open al-rv lx-reveal"
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
                <div className="al-card-frame">
                  {item.kategori && <span className="al-card-cat">{item.kategori}</span>}
                  {item.gambar && <img src={item.gambar} alt={item.nama} loading="lazy" />}
                </div>
                <div className="al-card-body">
                  <h3 className="al-card-name">{item.nama}</h3>
                  {item.desc && <p className="al-card-desc">{item.desc}</p>}
                  <div className="al-card-foot">
                    <span className={`al-card-price${typeof item.harga === 'number' && item.harga > 0 ? '' : ' al-card-price-soft'}`}>
                      {priceText(item.harga)}
                    </span>
                    <span className="al-card-more">Selengkapnya →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT */}
      {c.statement && (
        <div className="al-statement">
          <div className="al-stmt-inner al-rv lx-reveal">
            <ShieldMark className="al-stmt-mark" />
            {c.statement.eyebrow && <p className="al-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="al-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="al-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="al-section al-about" id="tentang">
          <div className={`al-about-inner${c.about.image ? '' : ' al-about-solo'}`}>
            <div className="al-rv lx-reveal">
              <p className="al-eyebrow"><ShieldMark />Tentang Kami</p>
              <h2 className="al-heading">{c.about.title}</h2>
              <p className="al-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="al-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="al-about-img al-rv lx-reveal al-rv-d2">
                <div className="al-about-frame">
                  <img src={c.about.image} alt={c.about.title} loading="lazy" />
                </div>
                <span className="al-about-corner" aria-hidden><ShieldMark /></span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="al-section al-stats">
          <div className="al-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`al-stat al-rv lx-reveal al-rv-d${i + 1}`}>
                <div className="al-stat-num" data-cu>{s.angka}</div>
                <div className="al-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="al-section al-testimonials" id="ulasan">
          <div className="al-sec-hdr al-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="al-eyebrow al-eyebrow-c"><ShieldMark />Ulasan</p>
            <h2 className="al-heading">Kata Orang Tua &amp; Alumni</h2>
          </div>
          <div className="al-tcar lx-tcar">
            <div className="al-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="al-test-card">
                  <div className="al-test-stars" aria-hidden>★★★★★</div>
                  <p className="al-test-quote">{t.quote}</p>
                  <p className="al-test-name">{t.nama}</p>
                  {t.peran && <p className="al-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="al-tcar-ctrl">
                <button className="al-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="al-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="al-dot-nav lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="al-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="al-section al-faq" id="faq">
          <div className="al-sec-hdr al-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="al-eyebrow al-eyebrow-c"><ShieldMark />Pertanyaan</p>
            <h2 className="al-heading">Sering Ditanyakan</h2>
          </div>
          <div className="al-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="al-faq-item">
                <button
                  className="al-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`al-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="al-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="al-section al-cta" id="daftar">
          <div className="al-cta-inner al-rv lx-reveal">
            <ShieldMark className="al-cta-mark" />
            <h2 className="al-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="al-cta-sub">{c.cta.subtitle}</p>}
            <div className="al-cta-btns">
              <a href={waUrl} className="al-btn-primary">{c.cta.ctaText ?? 'Daftar via WhatsApp'}</a>
              <a href="#program" className="al-btn-ghost">Lihat Program</a>
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON */}
      {(c.bands ?? []).map((b, i) => (
        <section className="al-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="al-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="al-heading">{b.title}</h2>
            {b.subtitle && <p className="al-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="al-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="al-footer">
        <div className="al-footer-grid">
          <div>
            <p className="al-footer-brand"><ShieldMark />{c.nama ?? 'Sekolah'}</p>
            <p className="al-footer-tagline">
              {hero.eyebrow ?? `${c.nama ?? 'Sekolah'} — mendidik dengan hati, menumbuhkan karakter.`}
            </p>
          </div>
          <div>
            <p className="al-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="al-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="al-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="al-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="al-footer-h">Jam Operasional</p>
            {jamRows.length
              ? jamRows.map((j, i) => <p key={i} className="al-footer-link">{j.hari}: {j.jam}</p>)
              : <p className="al-footer-link">Senin–Jumat: 07.00–15.00</p>}
          </div>
        </div>
        <p className="al-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Sekolah'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX */}
      <BespokeLightbox ctaText="Daftar via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
