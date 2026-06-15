'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// KLINIK BERSIH — Klinik Umum & Gigi Bespoke Lux Renderer (Cool Trust Blue)
// Industri JASA (source: services) — bukan toko (tanpa keranjang). Tinggal di
// folder toko-bespoke/ sbg rumah engine bespoke bersama (lux-script, lightbox,
// types) — registry.ts LINTAS INDUSTRI.
// Bricolage Grotesque (display) + Public Sans (body) |
// Snow #F7FAFD · cool #EAF1F8/#E4EDF7 · ink-navy #0E2438 |
// accent indigo #2B5BD7 / accentDeep #1E44A8 |
// signature: panel "Jadwal Praktik / Janji Temu" (kartu mengambang) +
//   motif "garis detak" (EKG hairline) | ns: kb-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.kb-*`.
// Light palette → contrast.test menjaga WCAG (ink navy AAA, indigo accentDeep ≥4.5).
// Profesional-tenang — kontras dgn tema toko (playful/earthy/elegant): ini klinis,
// disiplin, dipercaya. Tanpa pop color (palet tunggal indigo-on-snow).
// ============================================================

export interface KbPal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentDeep: string; onAccent: string
  line: string; line2: string; shadow: string; shadowDeep: string
}

export const PALETTES: Record<string, KbPal> = {
  // Bersih — snow cool, tinta navy, aksen indigo tepercaya.
  bersih: {
    bg: '#F7FAFD', bg2: '#EAF1F8', surface: '#FFFFFF', surface2: '#E4EDF7',
    ink: '#0E2438', inkDim: '#2A4358', muted: '#4A6075',
    accent: '#2B5BD7', accentDeep: '#1E44A8', onAccent: '#FFFFFF',
    line: 'rgba(14,36,56,.12)', line2: 'rgba(14,36,56,.07)',
    shadow: 'rgba(14,36,56,.10)', shadowDeep: 'rgba(14,36,56,.18)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Public+Sans:wght@400;500;600;700&display=swap'
const DISPLAY = '"Bricolage Grotesque","Segoe UI",system-ui,sans-serif'
const BODY = '"Public Sans","Segoe UI",system-ui,sans-serif'
const EASE = 'cubic-bezier(.22,1,.36,1)'

// Motif "garis detak" (EKG) — tampil tanpa JS (tak digate .lx-js); titik puncak
// berdenyut halus via CSS (dimatikan prefers-reduced-motion). Dekoratif → aria-hidden.
function EkgLine({ className = '' }: { className?: string }) {
  return (
    <svg className={`kb-ekg ${className}`} viewBox="0 0 240 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path
        d="M0 12 H92 L98 12 L103 6 L109 12 L114 3 L120 21 L125 12 L131 10 L136 12 H240"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle className="kb-ekg-dot" cx="114" cy="3" r="2.6" fill="currentColor" />
    </svg>
  )
}

function kbCss(): string {
  return `
@import url('${FONT_IMPORT}');
html,body{overflow-x:hidden;max-width:100%}
.kb-root{font-family:${BODY};color:var(--kb-ink);background:var(--kb-bg);line-height:1.7;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.kb-root *,.kb-root *::before,.kb-root *::after{box-sizing:border-box;margin:0;padding:0}
.kb-root img{max-width:100%;height:auto;display:block}
.kb-root ::selection{background:rgba(43,91,215,.18);color:var(--kb-ink)}

/* Motif EKG */
.kb-ekg{color:var(--kb-accent);display:block;height:18px;width:150px}
@media(prefers-reduced-motion:no-preference){.kb-ekg-dot{animation:kbBeat 2.4s ${EASE} infinite}}
@keyframes kbBeat{0%,72%,100%{transform:scale(1);opacity:.9}80%{transform:scale(1.7);opacity:1}88%{transform:scale(1);opacity:.9}}
.kb-ekg-dot{transform-box:fill-box;transform-origin:center}

/* NAV */
.kb-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.1rem 7vw;display:flex;align-items:center;justify-content:space-between;transition:background .45s,box-shadow .45s,backdrop-filter .45s,padding .45s}
.kb-root.lx-scrolled .kb-nav{background:rgba(247,250,253,.86);backdrop-filter:blur(12px);box-shadow:0 1px 0 var(--kb-line2),0 6px 24px var(--kb-shadow);padding-top:.85rem;padding-bottom:.85rem}
.kb-nav-logo{font-family:${DISPLAY};font-weight:700;letter-spacing:-.02em;color:var(--kb-ink);font-size:1.5rem;text-decoration:none;display:flex;align-items:center;gap:.55rem}
.kb-nav-logo::before{content:'';width:11px;height:11px;border-radius:50%;background:var(--kb-accent);box-shadow:0 0 0 4px rgba(43,91,215,.16)}
.kb-nav-cta{font-family:${DISPLAY};font-size:.88rem;font-weight:600;letter-spacing:-.01em;color:var(--kb-onAccent);background:var(--kb-accentDeep);padding:.66rem 1.45rem;border-radius:12px;text-decoration:none;transition:transform .3s ${EASE},background .3s,box-shadow .3s;box-shadow:0 6px 16px rgba(30,68,168,.22)}
.kb-nav-cta:hover{transform:translateY(-2px);background:var(--kb-ink);box-shadow:0 10px 22px var(--kb-shadowDeep)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO — teks + media foto + panel Jadwal Praktik mengambang (signature) */
.kb-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:clamp(2rem,5vw,4.5rem);padding:8.5rem 7vw 4.5rem;background:radial-gradient(120% 90% at 88% 8%,var(--kb-bg2),var(--kb-bg) 60%)}
.kb-hero-text{position:relative;z-index:2}
.kb-hero-ew{font-family:${DISPLAY};font-size:.82rem;font-weight:600;letter-spacing:.01em;color:var(--kb-accentDeep);margin-bottom:1.1rem;display:inline-flex;align-items:center;gap:.6rem;background:var(--kb-surface);border:1px solid var(--kb-line2);padding:.42rem 1rem;border-radius:999px;box-shadow:0 4px 14px var(--kb-shadow)}
.kb-hero-ew::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--kb-accent)}
.kb-hero-title{font-family:${DISPLAY};font-size:clamp(2.6rem,6vw,4.8rem);font-weight:700;line-height:1.05;color:var(--kb-ink);margin-bottom:1.3rem;letter-spacing:-.025em;text-wrap:balance}
.kb-hero-title em{font-style:normal;color:var(--kb-accentDeep);position:relative;white-space:nowrap}
.kb-hero-title em::after{content:'';position:absolute;left:0;right:0;bottom:.04em;height:.18em;background:var(--kb-accent);opacity:.22;border-radius:4px;z-index:-1}
.kb-hero-ekg{width:200px;height:20px;margin-bottom:1.3rem;opacity:.9}
.kb-hero-sub{font-size:1.1rem;color:var(--kb-inkDim);margin-bottom:2rem;max-width:46ch;line-height:1.8}
.kb-hero-btns{display:flex;gap:.9rem;flex-wrap:wrap;align-items:center;margin-bottom:2.3rem}
.kb-btn-primary{font-family:${DISPLAY};font-size:.95rem;font-weight:600;background:var(--kb-accentDeep);color:var(--kb-onAccent);padding:.95rem 1.9rem;border-radius:13px;text-decoration:none;transition:transform .3s ${EASE},background .3s,box-shadow .3s;box-shadow:0 8px 22px rgba(30,68,168,.24)}
.kb-btn-primary:hover{transform:translateY(-3px);background:var(--kb-ink);box-shadow:0 14px 30px var(--kb-shadowDeep)}
.kb-btn-ghost{font-family:${DISPLAY};font-size:.95rem;font-weight:600;color:var(--kb-ink);padding:.95rem 1.5rem;text-decoration:none;border-radius:13px;border:1.5px solid var(--kb-line);transition:border-color .3s,color .3s,transform .3s ${EASE},background .3s}
.kb-btn-ghost:hover{border-color:var(--kb-accent);color:var(--kb-accentDeep);background:var(--kb-surface);transform:translateY(-2px)}
.kb-hero-meta{display:flex;flex-wrap:wrap;gap:1.8rem}
.kb-meta-item{display:flex;flex-direction:column;gap:.1rem}
.kb-meta-num{font-family:${DISPLAY};font-size:1.6rem;font-weight:700;color:var(--kb-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.kb-meta-label{font-size:.78rem;color:var(--kb-muted);font-weight:600}
/* Media */
.kb-hero-media{position:relative;z-index:1;min-height:430px}
.kb-hero-photo{position:relative;height:100%;min-height:430px;border-radius:26px;overflow:hidden;background:var(--kb-surface2);box-shadow:0 30px 64px var(--kb-shadowDeep),0 0 0 1px var(--kb-line2)}
.kb-hero-photo img{width:100%;height:100%;object-fit:cover}
.kb-hero-photo-ph{position:absolute;inset:0;background:linear-gradient(160deg,var(--kb-surface2),var(--kb-bg2))}
.kb-hero-plus{position:absolute;top:1.2rem;right:1.2rem;width:34px;height:34px;border-radius:9px;background:rgba(255,255,255,.92);box-shadow:0 6px 16px var(--kb-shadow)}
.kb-hero-plus::before,.kb-hero-plus::after{content:'';position:absolute;background:var(--kb-accent);border-radius:2px}
.kb-hero-plus::before{top:50%;left:9px;right:9px;height:3px;transform:translateY(-50%)}
.kb-hero-plus::after{left:50%;top:9px;bottom:9px;width:3px;transform:translateX(-50%)}
/* Panel Jadwal Praktik (SIGNATURE) */
.kb-appt{position:absolute;left:-1.4rem;bottom:1.6rem;z-index:3;width:min(300px,80%);background:var(--kb-surface);border:1px solid var(--kb-line2);border-radius:18px;padding:1.25rem 1.3rem;box-shadow:0 24px 54px var(--kb-shadowDeep)}
.kb-appt-head{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin-bottom:.9rem}
.kb-appt-title{font-family:${DISPLAY};font-size:1.02rem;font-weight:700;color:var(--kb-ink);letter-spacing:-.01em}
.kb-appt-chip{font-size:.66rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--kb-accentDeep);background:var(--kb-bg2);padding:.28rem .6rem;border-radius:999px}
.kb-appt-rows{list-style:none;display:flex;flex-direction:column;gap:.5rem;margin:0}
.kb-appt-row{display:flex;align-items:baseline;justify-content:space-between;gap:.8rem;font-size:.86rem}
.kb-appt-row .kb-appt-hari{color:var(--kb-muted);font-weight:600}
.kb-appt-row .kb-appt-jam{color:var(--kb-ink);font-weight:600;font-variant-numeric:tabular-nums}
.kb-appt-ekg{width:100%;height:16px;margin:.9rem 0;opacity:.55}
.kb-appt-cta{display:flex;align-items:center;justify-content:center;gap:.4rem;font-family:${DISPLAY};font-size:.88rem;font-weight:600;color:var(--kb-onAccent);background:var(--kb-accentDeep);padding:.7rem 1rem;border-radius:11px;text-decoration:none;transition:background .25s,transform .25s ${EASE}}
.kb-appt-cta:hover{background:var(--kb-ink);transform:translateY(-1px)}
@media(max-width:880px){
  .kb-hero{grid-template-columns:1fr;min-height:unset;padding:7rem 7vw 3rem}
  .kb-hero-media{order:-1;max-width:460px;margin:0 auto;min-height:340px}
  .kb-hero-photo{min-height:300px}
  .kb-appt{left:auto;right:0;bottom:-1rem;width:min(280px,86%)}
}
@media(max-width:560px){.kb-nav{padding:.9rem 6vw}.kb-appt{position:relative;left:0;right:0;bottom:0;width:100%;margin-top:.9rem}.kb-hero-media{margin-bottom:1rem}}

/* TRUST RIBBON — kata domain layanan (BUKAN klaim) */
.kb-ribbon{background:var(--kb-surface);border-top:1px solid var(--kb-line2);border-bottom:1px solid var(--kb-line2);padding:1.2rem 7vw}
.kb-ribbon-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.6rem 1.4rem}
.kb-ribbon-item{font-family:${DISPLAY};font-size:.86rem;font-weight:600;color:var(--kb-inkDim);display:inline-flex;align-items:center;gap:.55rem}
.kb-ribbon-item::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--kb-accent);opacity:.6}

/* SECTION COMMONS */
.kb-section{padding:clamp(4.2rem,8vw,7rem) 7vw}
.kb-eyebrow{font-family:${DISPLAY};font-size:.82rem;font-weight:600;letter-spacing:.02em;color:var(--kb-accentDeep);margin-bottom:.85rem;display:inline-flex;align-items:center;gap:.55rem}
.kb-eyebrow::before{content:'';width:1.5rem;height:2px;border-radius:999px;background:var(--kb-accent)}
.kb-heading{font-family:${DISPLAY};font-size:clamp(2rem,3.8vw,3rem);font-weight:700;color:var(--kb-ink);line-height:1.14;letter-spacing:-.02em;text-wrap:balance}
.kb-subtext{color:var(--kb-inkDim);font-size:1.02rem;margin-top:.9rem;max-width:56ch;line-height:1.8}
.kb-sec-hdr{margin-bottom:3.2rem;max-width:62ch}

/* FEATURES — kartu klinis ber-ikon plus */
.kb-feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3rem}
.kb-feat-card{padding:2rem 1.6rem;background:var(--kb-surface);border:1px solid var(--kb-line2);border-radius:18px;transition:transform .35s ${EASE},box-shadow .35s,border-color .35s}
.kb-feat-card:hover{transform:translateY(-5px);box-shadow:0 20px 42px var(--kb-shadow);border-color:rgba(43,91,215,.4)}
.kb-feat-ic{width:2.9rem;height:2.9rem;display:flex;align-items:center;justify-content:center;border-radius:13px;margin-bottom:1.2rem;background:var(--kb-bg2);position:relative}
.kb-feat-ic::before,.kb-feat-ic::after{content:'';position:absolute;background:var(--kb-accentDeep);border-radius:2px}
.kb-feat-ic::before{top:50%;left:.85rem;right:.85rem;height:3px;transform:translateY(-50%)}
.kb-feat-ic::after{left:50%;top:.85rem;bottom:.85rem;width:3px;transform:translateX(-50%)}
.kb-feat-title{font-family:${DISPLAY};font-size:1.16rem;font-weight:600;color:var(--kb-ink);margin-bottom:.45rem;line-height:1.3}
.kb-feat-desc{font-size:.9rem;color:var(--kb-muted);line-height:1.7}
@media(max-width:900px){.kb-feat-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.kb-feat-grid{grid-template-columns:1fr}}

/* SHOWCASE LAYANAN — kartu layanan bersih + quick-look */
.kb-showcase{background:var(--kb-bg2)}
.kb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.3rem,3vw,2rem)}
.kb-grid[data-count="1"]{grid-template-columns:minmax(0,380px);justify-content:center}
.kb-grid[data-count="2"]{grid-template-columns:repeat(2,minmax(0,360px));justify-content:center;max-width:820px;margin:0 auto}
.kb-card{position:relative;cursor:pointer;background:var(--kb-surface);border:1px solid var(--kb-line2);border-radius:18px;overflow:hidden;transition:transform .4s ${EASE},box-shadow .4s,border-color .4s;display:flex;flex-direction:column}
.kb-card:hover{transform:translateY(-6px);box-shadow:0 26px 52px var(--kb-shadow);border-color:rgba(43,91,215,.4)}
.kb-card-frame{position:relative;aspect-ratio:16/11;overflow:hidden;background:var(--kb-surface2)}
.kb-card-frame img{width:100%;height:100%;object-fit:cover;transition:transform .6s ${EASE}}
.kb-card:hover .kb-card-frame img{transform:scale(1.05)}
.kb-card-cat{position:absolute;top:.7rem;left:.7rem;z-index:2;font-family:${DISPLAY};font-size:.66rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--kb-accentDeep);background:rgba(255,255,255,.94);padding:.32rem .66rem;border-radius:8px;box-shadow:0 3px 9px var(--kb-shadow)}
.kb-card-body{padding:1.2rem 1.25rem 1.3rem;display:flex;flex-direction:column;flex:1}
.kb-card-name{font-family:${DISPLAY};font-size:1.16rem;font-weight:600;color:var(--kb-ink);margin-bottom:.35rem;line-height:1.3}
.kb-card-desc{font-size:.86rem;color:var(--kb-muted);margin-bottom:1rem;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.kb-card-foot{display:flex;align-items:center;justify-content:space-between;gap:.7rem;margin-top:auto;padding-top:.85rem;border-top:1px solid var(--kb-line2)}
.kb-card-price{font-family:${DISPLAY};font-size:1.05rem;font-weight:700;color:var(--kb-accentDeep)}
.kb-card-price-soft{font-size:.92rem;font-weight:600;color:var(--kb-muted)}
.kb-card-dur{font-size:.76rem;font-weight:600;color:var(--kb-muted);display:inline-flex;align-items:center;gap:.35rem}
.kb-card-dur::before{content:'';width:13px;height:13px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.7}
@media(max-width:980px){.kb-grid{grid-template-columns:repeat(2,1fr)}.kb-grid[data-count="1"]{grid-template-columns:minmax(0,380px)}}
@media(max-width:560px){.kb-grid,.kb-grid[data-count="1"],.kb-grid[data-count="2"]{grid-template-columns:1fr;max-width:380px;margin:0 auto}}

/* STATEMENT — panel tenang + EKG */
.kb-statement{padding:clamp(3.5rem,7vw,6rem) 7vw}
.kb-stmt-inner{position:relative;max-width:62ch;margin:0 auto;background:var(--kb-surface);border:1px solid var(--kb-line2);border-radius:24px;padding:clamp(2.4rem,5vw,3.6rem);text-align:center;box-shadow:0 18px 44px var(--kb-shadow)}
.kb-stmt-ekg{width:140px;height:18px;margin:0 auto 1.3rem}
.kb-stmt-ew{font-family:${DISPLAY};font-size:.78rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--kb-accentDeep);margin-bottom:1rem}
.kb-stmt-quote{font-family:${DISPLAY};font-size:clamp(1.45rem,2.8vw,2.1rem);font-weight:600;color:var(--kb-ink);line-height:1.35;letter-spacing:-.015em}
.kb-stmt-cite{display:block;font-size:.82rem;color:var(--kb-muted);font-weight:600;margin-top:1.2rem}

/* ABOUT — split + bingkai foto */
.kb-about{background:var(--kb-bg2)}
.kb-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:center}
.kb-about-inner.kb-about-solo{grid-template-columns:1fr;max-width:62ch;margin:0 auto;text-align:center}
.kb-about-solo .kb-eyebrow{justify-content:center}
.kb-about-solo .kb-about-body{margin-left:auto;margin-right:auto}
.kb-about-body{font-size:1.02rem;color:var(--kb-inkDim);line-height:1.9;margin-top:1.1rem;white-space:pre-line}
.kb-about-cta{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.7rem;font-family:${DISPLAY};font-size:.92rem;font-weight:600;color:var(--kb-accentDeep);text-decoration:none;transition:gap .3s,color .3s}
.kb-about-cta:hover{gap:.8rem;color:var(--kb-ink)}
.kb-about-img{position:relative}
.kb-about-frame{position:relative;z-index:1;aspect-ratio:4/3;border-radius:22px;overflow:hidden;box-shadow:0 28px 60px var(--kb-shadowDeep),0 0 0 1px var(--kb-line2)}
.kb-about-frame img{width:100%;height:100%;object-fit:cover}
.kb-about-plus{position:absolute;bottom:-1rem;left:-1rem;z-index:2;width:64px;height:64px;border-radius:16px;background:var(--kb-accentDeep);box-shadow:0 14px 30px rgba(30,68,168,.34)}
.kb-about-plus::before,.kb-about-plus::after{content:'';position:absolute;background:#fff;border-radius:2px}
.kb-about-plus::before{top:50%;left:18px;right:18px;height:4px;transform:translateY(-50%)}
.kb-about-plus::after{left:50%;top:18px;bottom:18px;width:4px;transform:translateX(-50%)}
@media(max-width:840px){.kb-about-inner{grid-template-columns:1fr;gap:2.5rem}.kb-about-img{order:-1;max-width:420px;margin:0 auto}}

/* STATS — angka ber-countUp */
.kb-stats{background:var(--kb-surface);border-top:1px solid var(--kb-line2);border-bottom:1px solid var(--kb-line2)}
.kb-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3rem;text-align:center}
.kb-stat{padding:1.4rem 1rem}
.kb-stat-num{font-family:${DISPLAY};font-size:clamp(2.2rem,4.4vw,3rem);font-weight:700;color:var(--kb-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.kb-stat-label{font-size:.78rem;color:var(--kb-muted);font-weight:600;margin-top:.6rem}
@media(max-width:560px){.kb-stats-grid{grid-template-columns:repeat(2,1fr);gap:1rem}}

/* TESTIMONIALS — carousel scroll-snap */
.kb-testimonials{background:var(--kb-bg)}
.kb-tcar{position:relative}
.kb-tcar-track{display:flex;gap:1.2rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .25rem 1.5rem;-ms-overflow-style:none;scrollbar-width:none}
.kb-tcar-track::-webkit-scrollbar{display:none}
.kb-test-card{scroll-snap-align:start;background:var(--kb-surface);border:1px solid var(--kb-line2);border-radius:18px;padding:2rem;min-width:300px;max-width:360px;flex:0 0 auto;box-shadow:0 10px 26px var(--kb-shadow)}
.kb-test-stars{color:var(--kb-accent);font-size:.95rem;letter-spacing:.15em;margin-bottom:.85rem}
.kb-test-quote{font-size:1rem;color:var(--kb-inkDim);line-height:1.75;margin:0 0 1.3rem}
.kb-test-name{font-family:${DISPLAY};font-weight:600;font-size:1rem;color:var(--kb-ink)}
.kb-test-role{font-size:.78rem;color:var(--kb-muted);font-weight:600;margin-top:.15rem}
.kb-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1.1rem;margin-top:1.4rem}
.kb-tcar-btn{width:44px;height:44px;border-radius:12px;background:var(--kb-surface);border:1px solid var(--kb-line);color:var(--kb-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s,border-color .25s,opacity .25s,transform .25s ${EASE}}
.kb-tcar-btn:hover:not(:disabled){background:var(--kb-accentDeep);color:var(--kb-onAccent);border-color:var(--kb-accentDeep);transform:translateY(-2px)}
.kb-tcar-btn:disabled{opacity:.3;cursor:default}
.kb-tcar-dots{display:flex;gap:.5rem;align-items:center}
.kb-dot-nav{width:8px;height:8px;border-radius:50%;background:var(--kb-line);border:none;padding:0;cursor:pointer;transition:background .25s,transform .25s}
.kb-dot-nav[aria-current="true"]{background:var(--kb-accent);transform:scale(1.5)}

/* FAQ */
.kb-faq{background:var(--kb-bg2)}
.kb-faq-wrap{max-width:760px;margin:0 auto}
.kb-faq-item{background:var(--kb-surface);border:1px solid var(--kb-line2);border-radius:14px;margin-bottom:.8rem;overflow:hidden}
.kb-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.25rem 1.4rem;cursor:pointer;font-family:${DISPLAY};font-size:1.06rem;font-weight:600;color:var(--kb-ink);background:none;border:none;text-align:left}
.kb-faq-q:focus-visible{outline:2px solid var(--kb-accentDeep);outline-offset:-2px;border-radius:12px}
.kb-faq-icon{font-size:1.4rem;color:var(--kb-accentDeep);flex-shrink:0;transition:transform .3s ${EASE};line-height:1}
.kb-faq-icon.open{transform:rotate(45deg)}
.kb-faq-a{font-size:.95rem;color:var(--kb-inkDim);line-height:1.8;padding:0 1.4rem 1.3rem;max-width:64ch}

/* CTA — panel ajakan janji + EKG */
.kb-cta{background:var(--kb-bg)}
.kb-cta-inner{position:relative;background:linear-gradient(150deg,var(--kb-accentDeep),#16357f);color:var(--kb-onAccent);border-radius:26px;padding:clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem);text-align:center;overflow:hidden}
.kb-cta-ekg{width:170px;height:20px;margin:0 auto 1.4rem;color:rgba(255,255,255,.7)}
.kb-cta-title{position:relative;font-family:${DISPLAY};font-size:clamp(2rem,4.4vw,3rem);font-weight:700;margin-bottom:.9rem;line-height:1.16;letter-spacing:-.02em;text-wrap:balance}
.kb-cta-sub{position:relative;font-size:1.05rem;opacity:.92;max-width:50ch;margin:0 auto 2.2rem;line-height:1.8}
.kb-cta-btns{position:relative;display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap}
.kb-cta .kb-btn-primary{background:var(--kb-surface);color:var(--kb-accentDeep);box-shadow:0 8px 22px rgba(0,0,0,.22)}
.kb-cta .kb-btn-primary:hover{background:var(--kb-bg);color:var(--kb-ink)}
.kb-cta .kb-btn-ghost{color:var(--kb-onAccent);border-color:rgba(255,255,255,.45)}
.kb-cta .kb-btn-ghost:hover{color:var(--kb-onAccent);border-color:#fff;background:rgba(255,255,255,.08)}

/* BAND ADD-ON */
.kb-band{background:var(--kb-surface);border-top:1px solid var(--kb-line2);border-bottom:1px solid var(--kb-line2);padding:3.2rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.4rem}
.kb-band-ew{font-family:${DISPLAY};font-size:.74rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--kb-accentDeep);margin-bottom:.5rem}
.kb-band .kb-heading{font-size:clamp(1.5rem,2.4vw,2rem)}
.kb-band-sub{color:var(--kb-muted);font-size:.95rem;line-height:1.6;margin-top:.5rem;max-width:56ch}

/* FOOTER */
.kb-footer{background:var(--kb-ink);color:rgba(255,255,255,.72);padding:4.2rem 7vw 2.4rem}
.kb-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.6rem}
.kb-footer-brand{font-family:${DISPLAY};font-size:1.6rem;font-weight:700;color:#fff;margin-bottom:.8rem;display:flex;align-items:center;gap:.5rem}
.kb-footer-brand::before{content:'';width:11px;height:11px;border-radius:50%;background:var(--kb-accent);box-shadow:0 0 0 4px rgba(43,91,215,.3)}
.kb-footer-tagline{font-size:.9rem;color:rgba(255,255,255,.6);line-height:1.7;max-width:36ch}
.kb-footer-h{font-family:${DISPLAY};font-size:.78rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:#fff;margin-bottom:1rem}
.kb-footer-link{display:block;font-size:.9rem;color:rgba(255,255,255,.72);text-decoration:none;margin-bottom:.55rem;transition:color .25s}
.kb-footer-link:hover{color:#fff}
.kb-footer-copy{border-top:1px solid rgba(255,255,255,.14);padding-top:1.5rem;font-size:.8rem;color:rgba(255,255,255,.55);text-align:center}
@media(max-width:768px){.kb-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* REVEAL — via LUX_JS (.lx-reveal → .lx-in), digate .lx-js (kontrak no-JS #138) */
.lx-js .kb-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ${EASE},transform .7s ${EASE}}
.lx-js .kb-rv.lx-in{opacity:1;transform:none}
.kb-rv-d1{transition-delay:.08s}.kb-rv-d2{transition-delay:.16s}.kb-rv-d3{transition-delay:.24s}.kb-rv-d4{transition-delay:.32s}

/* LIGHTBOX — kb-root overrides palet lx-lb (klinis/bersih) */
.kb-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.kb-root .lx-lb[hidden]{display:none}
.kb-root .lx-lb-back{position:absolute;inset:0;background:rgba(14,36,56,.52);backdrop-filter:blur(6px);border:0;cursor:pointer}
.kb-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--kb-surface);border:1px solid var(--kb-line2);border-radius:22px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .42s ${EASE},transform .42s ${EASE}}
.kb-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.kb-root .lx-lb-media{position:relative;overflow:hidden;background:var(--kb-surface2);min-height:300px}
.kb-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.kb-root .lx-lb-body{padding:clamp(22px,3vw,42px);display:flex;flex-direction:column;gap:9px;justify-content:center}
.kb-root .lx-lb-cat{font-family:${DISPLAY};font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--kb-accentDeep)}
.kb-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(22px,2.6vw,29px);font-weight:600;line-height:1.2;color:var(--kb-ink)}
.kb-root .lx-lb-price{font-family:${DISPLAY};font-size:19px;font-weight:700;color:var(--kb-accentDeep)}
.kb-root .lx-lb-desc{color:var(--kb-muted);font-size:13.5px;line-height:1.8}
.kb-root .lx-lb-cta{margin-top:14px;width:fit-content;display:inline-flex;align-items:center;background:var(--kb-accentDeep);color:var(--kb-onAccent);font-family:${DISPLAY};font-size:13px;font-weight:600;padding:12px 24px;border-radius:11px;text-decoration:none;transition:background .25s}
.kb-root .lx-lb-cta:hover{background:var(--kb-ink)}
.kb-root .lx-lb-x{position:absolute;top:12px;right:12px;z-index:3;width:40px;height:40px;border-radius:11px;background:var(--kb-surface);border:1px solid var(--kb-line2);color:var(--kb-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.kb-root .lx-lb-x:hover{background:var(--kb-accentDeep);color:var(--kb-onAccent);border-color:var(--kb-accentDeep)}
.kb-root .lx-lb-prev,.kb-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:40px;height:40px;border-radius:11px;background:var(--kb-surface);border:1px solid var(--kb-line2);color:var(--kb-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.kb-root .lx-lb-prev:hover,.kb-root .lx-lb-next:hover{background:var(--kb-accentDeep);color:var(--kb-onAccent)}
.kb-root .lx-lb-prev{left:8px}.kb-root .lx-lb-next{right:8px}
@media(max-width:640px){.kb-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.kb-root .lx-lb-media{min-height:230px}}

/* ── RASA polish ── */
.kb-btn-primary:active,.kb-nav-cta:active,.kb-appt-cta:active{transform:translateY(0) scale(.97)}
.kb-card:active{transform:translateY(-2px)}
.kb-tcar-btn:active{transform:scale(.93)}
.kb-nav-cta:focus-visible,.kb-btn-primary:focus-visible,.kb-btn-ghost:focus-visible,.kb-appt-cta:focus-visible,.kb-about-cta:focus-visible,.kb-footer-link:focus-visible,.kb-card:focus-visible,.kb-tcar-btn:focus-visible,.kb-dot-nav:focus-visible,.kb-cta-btns a:focus-visible{outline:3px solid var(--kb-accent);outline-offset:3px}
.kb-hero-sub,.kb-subtext,.kb-about-body,.kb-cta-sub,.kb-feat-desc,.kb-test-quote{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Kata pita = domain layanan klinik (BUKAN klaim verifiable seperti BPJS/lisensi);
// tampil di SEMUA situs Klinik Bersih. Klaim spesifik milik klien → konten editabel.
const RIBBON = ['Konsultasi', 'Pemeriksaan', 'Perawatan', 'Kesehatan Keluarga', 'Pencegahan', 'Kenyamanan']

export default function KlinikUmumRenderer({ content: c, variant = 'bersih' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.bersih
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa}` : '#janji'
  const hero = c.hero ?? {}
  const items = c.showcase?.items ?? []
  const features = c.features ?? []
  const stats = c.stats ?? []
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []
  const jamRows = c.info?.jam ?? [
    { hari: 'Senin–Sabtu', jam: '08.00–21.00' },
    { hari: 'Minggu', jam: '08.00–14.00' },
  ]

  const rootStyle = {
    '--kb-bg': p.bg, '--kb-bg2': p.bg2, '--kb-surface': p.surface, '--kb-surface2': p.surface2,
    '--kb-ink': p.ink, '--kb-inkDim': p.inkDim, '--kb-muted': p.muted,
    '--kb-accent': p.accent, '--kb-accentDeep': p.accentDeep, '--kb-onAccent': p.onAccent,
    '--kb-line': p.line, '--kb-line2': p.line2, '--kb-shadow': p.shadow, '--kb-shadowDeep': p.shadowDeep,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const priceText = (n?: number) => (typeof n === 'number' && n > 0 ? fmt(n) : 'Konsultasi')

  return (
    <div className="kb-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: kbCss() }} />

      {/* NAV */}
      <nav className="kb-nav" aria-label="Navigasi utama">
        <span className="kb-nav-logo">{c.nama ?? 'Klinik'}</span>
        <a href={waUrl} className="kb-nav-cta">Buat Janji</a>
      </nav>

      {/* HERO — teks + media + panel Jadwal Praktik (signature) */}
      <section className="kb-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="kb-hero-text">
          {hero.eyebrow && <p className="kb-hero-ew">{hero.eyebrow}</p>}
          <EkgLine className="kb-hero-ekg" />
          {hero.title && <h1 className="kb-hero-title">{hero.title}</h1>}
          {hero.subtitle && <p className="kb-hero-sub">{hero.subtitle}</p>}
          <div className="kb-hero-btns">
            <a href={hero.ctaHref ?? waUrl} className="kb-btn-primary">{hero.ctaText ?? 'Buat Janji'}</a>
            <a href={hero.ctaHref2 ?? '#layanan'} className="kb-btn-ghost">{hero.ctaText2 ?? 'Lihat Layanan'}</a>
          </div>
          {stats.length > 0 && (
            <div className="kb-hero-meta">
              {stats.slice(0, 3).map((s, i) => (
                <div key={i} className="kb-meta-item">
                  <span className="kb-meta-num">{s.angka}</span>
                  <span className="kb-meta-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="kb-hero-media">
          <div className="kb-hero-photo">
            {hero.image ? (
              <img
                src={hero.image}
                alt={c.nama ?? 'Klinik'}
                loading="eager"
                style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
              />
            ) : (
              <span className="kb-hero-photo-ph" aria-hidden />
            )}
            <span className="kb-hero-plus" aria-hidden />
          </div>
          <aside className="kb-appt" aria-label="Jadwal praktik">
            <div className="kb-appt-head">
              <span className="kb-appt-title">Jadwal Praktik</span>
              <span className="kb-appt-chip">Janji Temu</span>
            </div>
            <ul className="kb-appt-rows">
              {jamRows.slice(0, 3).map((j, i) => (
                <li key={i} className="kb-appt-row">
                  <span className="kb-appt-hari">{j.hari}</span>
                  <span className="kb-appt-jam">{j.jam}</span>
                </li>
              ))}
            </ul>
            <EkgLine className="kb-appt-ekg" />
            <a href={waUrl} className="kb-appt-cta">Buat Janji →</a>
          </aside>
        </div>
      </section>

      {/* TRUST RIBBON */}
      <div className="kb-ribbon" aria-hidden="true">
        <div className="kb-ribbon-row">
          {RIBBON.map((m, i) => (
            <span key={i} className="kb-ribbon-item">{m}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="kb-section" id="keunggulan">
          <div className="kb-sec-hdr kb-rv lx-reveal">
            <p className="kb-eyebrow">{c.featuresEyebrow ?? 'Kenapa Kami'}</p>
            {c.featuresTitle && <h2 className="kb-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="kb-feat-grid">
            {features.slice(0, 4).map((f, i) => (
              <div key={i} className={`kb-feat-card kb-rv lx-reveal kb-rv-d${i + 1}`}>
                <div className="kb-feat-ic" aria-hidden />
                <h3 className="kb-feat-title">{f.title}</h3>
                <p className="kb-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SHOWCASE LAYANAN — kartu layanan + quick-look */}
      {items.length > 0 && (
        <section className="kb-section kb-showcase" id="layanan">
          <div className="kb-sec-hdr kb-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.2rem' }}>
            <p className="kb-eyebrow" style={{ justifyContent: 'center' }}>Layanan</p>
            {c.showcase?.title && <h2 className="kb-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="kb-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{c.showcase.subtitle}</p>}
          </div>
          <div className="kb-grid lx-look" data-count={items.length}>
            {items.map((item, i) => (
              <article
                key={i}
                className="kb-card lx-lb-open kb-rv lx-reveal"
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
                <div className="kb-card-frame">
                  {item.kategori && <span className="kb-card-cat">{item.kategori}</span>}
                  {item.gambar && <img src={item.gambar} alt={item.nama} loading="lazy" />}
                </div>
                <div className="kb-card-body">
                  <h3 className="kb-card-name">{item.nama}</h3>
                  {item.desc && <p className="kb-card-desc">{item.desc}</p>}
                  <div className="kb-card-foot">
                    <span className={`kb-card-price${typeof item.harga === 'number' && item.harga > 0 ? '' : ' kb-card-price-soft'}`}>
                      {priceText(item.harga)}
                    </span>
                    {typeof item.durasi === 'number' && item.durasi > 0 && (
                      <span className="kb-card-dur">± {item.durasi} menit</span>
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
        <div className="kb-statement">
          <div className="kb-stmt-inner kb-rv lx-reveal">
            <EkgLine className="kb-stmt-ekg" />
            {c.statement.eyebrow && <p className="kb-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="kb-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="kb-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="kb-section kb-about" id="tentang">
          <div className={`kb-about-inner${c.about.image ? '' : ' kb-about-solo'}`}>
            <div className="kb-rv lx-reveal">
              <p className="kb-eyebrow">Tentang Kami</p>
              <h2 className="kb-heading">{c.about.title}</h2>
              <p className="kb-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="kb-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="kb-about-img kb-rv lx-reveal kb-rv-d2">
                <div className="kb-about-frame">
                  <img src={c.about.image} alt={c.about.title} loading="lazy" />
                </div>
                <span className="kb-about-plus" aria-hidden />
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="kb-section kb-stats">
          <div className="kb-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`kb-stat kb-rv lx-reveal kb-rv-d${i + 1}`}>
                <div className="kb-stat-num" data-cu>{s.angka}</div>
                <div className="kb-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="kb-section kb-testimonials" id="ulasan">
          <div className="kb-sec-hdr kb-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="kb-eyebrow" style={{ justifyContent: 'center' }}>Ulasan</p>
            <h2 className="kb-heading">Kata Pasien Kami</h2>
          </div>
          <div className="kb-tcar lx-tcar">
            <div className="kb-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="kb-test-card">
                  <div className="kb-test-stars" aria-hidden>★★★★★</div>
                  <p className="kb-test-quote">{t.quote}</p>
                  <p className="kb-test-name">{t.nama}</p>
                  {t.peran && <p className="kb-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="kb-tcar-ctrl">
                <button className="kb-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="kb-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="kb-dot-nav lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="kb-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="kb-section kb-faq" id="faq">
          <div className="kb-sec-hdr kb-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="kb-eyebrow" style={{ justifyContent: 'center' }}>Pertanyaan</p>
            <h2 className="kb-heading">Sering Ditanyakan</h2>
          </div>
          <div className="kb-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="kb-faq-item">
                <button
                  className="kb-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`kb-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="kb-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="kb-section kb-cta" id="janji">
          <div className="kb-cta-inner kb-rv lx-reveal">
            <EkgLine className="kb-cta-ekg" />
            <h2 className="kb-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="kb-cta-sub">{c.cta.subtitle}</p>}
            <div className="kb-cta-btns">
              <a href={waUrl} className="kb-btn-primary">{c.cta.ctaText ?? 'Buat Janji via WhatsApp'}</a>
              <a href="#layanan" className="kb-btn-ghost">Lihat Layanan</a>
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON */}
      {(c.bands ?? []).map((b, i) => (
        <section className="kb-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="kb-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="kb-heading">{b.title}</h2>
            {b.subtitle && <p className="kb-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="kb-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="kb-footer">
        <div className="kb-footer-grid">
          <div>
            <p className="kb-footer-brand">{c.nama ?? 'Klinik'}</p>
            <p className="kb-footer-tagline">
              {hero.eyebrow ?? `${c.nama ?? 'Klinik'} — layanan kesehatan keluarga.`}
            </p>
          </div>
          <div>
            <p className="kb-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="kb-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="kb-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="kb-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="kb-footer-h">Jam Praktik</p>
            {jamRows.map((j, i) => (
              <p key={i} className="kb-footer-link">{j.hari}: {j.jam}</p>
            ))}
          </div>
        </div>
        <p className="kb-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Klinik'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX */}
      <BespokeLightbox ctaText="Buat Janji via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
