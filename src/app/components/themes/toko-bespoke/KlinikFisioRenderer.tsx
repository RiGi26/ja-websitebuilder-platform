'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'
import KlinikFisioBooking from './KlinikFisioBooking'
import { copyGetter } from '@/lib/theme-system/theme-copy'
import { KLINIK_FISIO_SLOTS } from './slots/klinik-fisio.slots'

// ============================================================
// GERAK — Klinik Sport-Physiotherapy Bespoke Lux Renderer (Athletic-Clinical)
// Industri JASA (source: services) — bukan toko (tanpa keranjang). Tinggal di
// folder toko-bespoke/ sbg rumah engine bespoke bersama (lux-script, lightbox,
// types) — registry.ts LINTAS INDUSTRI.
// Sora (display, geometric-athletic) + Plus Jakarta Sans (body) |
// Cool-white #F5F9FB · tint #EAF6FC/#E4EEF3 · ink-navy #10262F |
// accent teal #0E7CB0 (light #1B9CD8 / deep #0B6E96) + POP ORANGE #F39C12/#E58208 |
// signature: "busur gerak" (arc SVG dinamis) + kartu rating mengambang di hero +
//   "jalur pemulihan bernomor" (recovery track ber-busur) | ns: kf-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.kf-*`.
// Light palette → contrast.test menjaga WCAG (ink navy AAA, teal deep ≥4.5).
// Atletik-klinis, energik-tepercaya (sport rehab) — SENGAJA beda dari klinik lain:
// dwi-warna teal+oranye DENGAN pop (klinik-umum/estetik/wellness = palet tunggal).
// ============================================================

export interface KfPal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentLight: string; accentDeep: string; onAccent: string
  pop: string; popDeep: string
  dark: string; dark2: string
  line: string; line2: string; shadow: string; shadowDeep: string
}

export const PALETTES: Record<string, KfPal> = {
  // Gerak — cool-white, tinta navy, teal energik + aksen oranye (pop).
  gerak: {
    bg: '#F5F9FB', bg2: '#EAF6FC', surface: '#FFFFFF', surface2: '#E4EEF3',
    ink: '#10262F', inkDim: '#26414C', muted: '#46606C',
    accent: '#0E7CB0', accentLight: '#1B9CD8', accentDeep: '#0B6E96', onAccent: '#FFFFFF',
    pop: '#F39C12', popDeep: '#E58208',
    dark: '#0A2233', dark2: '#0E2C40',
    line: '#E4EEF3', line2: 'rgba(16,38,47,.07)',
    shadow: 'rgba(11,110,150,.16)', shadowDeep: 'rgba(11,110,150,.30)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
const DISPLAY = '"Sora","Segoe UI",system-ui,sans-serif'
const BODY = '"Plus Jakarta Sans","Segoe UI",system-ui,sans-serif'
const EASE = 'cubic-bezier(.16,1,.3,1)'
const SPRING = 'cubic-bezier(.34,1.56,.64,1)'

// Font parametrik (style knobs Wave 3): default = konstanta bawaan (byte-identik
// render lama; parity.test menjaga). Pairing alternatif datang dari kurasi
// registry (BespokeEntry.design.fontPairings) via props.font.
type KfFont = { importUrl: string; display: string; body: string }
const DEFAULT_FONT: KfFont = { importUrl: FONT_IMPORT, display: DISPLAY, body: BODY }

// Ikon WhatsApp (glyph) — dipakai tombol WA primer. aria-hidden (dekoratif).
function IconWa({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.2Z" />
    </svg>
  )
}

// Bintang rating — pop oranye. aria-hidden (label di induk).
function IconStar({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m12 2 3 6.5 7 .6-5.3 4.6L18.2 21 12 17.3 5.8 21l1.5-7.3L2 9.1l7-.6L12 2Z" />
    </svg>
  )
}

// "Busur gerak" — arc SVG dinamis (signature). Sapuan lengkung tunggal yang
// menggemakan gerak/pemulihan; tampil tanpa JS (tak digate .lx-js). aria-hidden.
function MotionArc({ className = '' }: { className?: string }) {
  return (
    <svg className={`kf-arc ${className}`} viewBox="0 0 320 120" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 112 C 90 8, 230 8, 316 112" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle className="kf-arc-dot" cx="316" cy="112" r="5" fill="currentColor" />
    </svg>
  )
}

function kfCss(f: KfFont): string {
  return `
@import url('${f.importUrl}');
html,body{overflow-x:hidden;max-width:100%}
.kf-root{font-family:${f.body};color:var(--kf-ink);background:var(--kf-bg);line-height:1.65;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.kf-root *,.kf-root *::before,.kf-root *::after{box-sizing:border-box;margin:0;padding:0}
.kf-root h1,.kf-root h2,.kf-root h3,.kf-root h4{font-family:${f.display};color:var(--kf-ink);line-height:1.12;letter-spacing:-.02em;text-wrap:balance}
.kf-root p{text-wrap:pretty}
.kf-root img{max-width:100%;height:auto;display:block}
.kf-root ::selection{background:rgba(14,124,176,.18);color:var(--kf-ink)}

/* Busur gerak (signature) */
.kf-arc{color:var(--kf-accentLight);display:block;width:100%;height:100%}
.kf-arc-dot{transform-box:fill-box;transform-origin:center;color:var(--kf-pop)}
@media(prefers-reduced-motion:no-preference){.kf-arc-dot{animation:kfPulse 2.8s ${EASE} infinite}}
@keyframes kfPulse{0%,70%,100%{transform:scale(1);opacity:.95}82%{transform:scale(1.6);opacity:1}90%{transform:scale(1);opacity:.95}}

/* NAV */
.kf-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.05rem 7vw;display:flex;align-items:center;justify-content:space-between;transition:background .45s,box-shadow .45s,backdrop-filter .45s,padding .45s}
.kf-root.lx-scrolled .kf-nav{background:rgba(245,249,251,.84);backdrop-filter:blur(14px);box-shadow:0 1px 0 var(--kf-line),0 6px 24px var(--kf-shadow);padding-top:.8rem;padding-bottom:.8rem}
.kf-nav-logo{font-family:${f.display};font-weight:800;letter-spacing:-.02em;color:var(--kf-ink);font-size:1.4rem;text-decoration:none;display:flex;align-items:center;gap:.55rem}
.kf-nav-logo::before{content:'';width:11px;height:11px;border-radius:50%;background:var(--kf-accent);box-shadow:0 0 0 4px rgba(14,124,176,.16)}
.kf-nav-logo b{color:var(--kf-pop);font-weight:800}
.kf-nav-cta{display:inline-flex;align-items:center;gap:.5rem;font-family:${f.display};font-size:.86rem;font-weight:700;color:var(--kf-ink);background:var(--kf-pop);padding:.62rem 1.3rem;border-radius:999px;text-decoration:none;transition:transform .25s ${SPRING},background .25s,box-shadow .25s;box-shadow:0 10px 22px -10px rgba(243,156,18,.7)}
.kf-nav-cta:hover{transform:translateY(-2px);background:var(--kf-popDeep)}
.kf-nav-cta svg{width:17px;height:17px;flex:none}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO — copy kiri + kartu visual teal kanan dgn kartu rating mengambang + busur (signature) */
.kf-hero{position:relative;overflow:hidden;background:radial-gradient(ellipse 70% 60% at 92% 6%,rgba(27,156,216,.10),transparent 55%),radial-gradient(ellipse 50% 50% at 4% 92%,rgba(243,156,18,.06),transparent 50%)}
.kf-hero::before{content:'';position:absolute;top:-220px;right:-160px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(27,156,216,.20),rgba(243,156,18,.10) 55%,transparent 72%);z-index:0;pointer-events:none}
.kf-hero-grid{position:relative;z-index:1;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:clamp(2rem,5vw,3.4rem);padding:9rem 7vw 5rem}
.kf-hero-text{position:relative;z-index:2}
.kf-eyebrow{font-family:${f.display};font-size:.76rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--kf-accentDeep)}
.kf-hero-tagline{display:inline-flex;align-items:center;gap:.5rem;background:var(--kf-bg2);color:var(--kf-accentDeep);font-weight:600;font-size:.86rem;padding:.5rem 1rem;border-radius:999px;margin:1.1rem 0 1.3rem}
.kf-hero-tagline svg{width:16px;height:16px;flex:none}
.kf-hero-title{font-size:clamp(2.3rem,5.4vw,3.85rem);font-weight:800;line-height:1.06;color:var(--kf-ink);letter-spacing:-.025em}
.kf-hero-title em{font-style:normal;color:var(--kf-accent)}
.kf-hero-sub{font-size:1.12rem;color:var(--kf-inkDim);margin:1.4rem 0 1.9rem;max-width:50ch;line-height:1.75}
.kf-hero-cta{display:flex;gap:.9rem;flex-wrap:wrap}
.kf-btn-wa{display:inline-flex;align-items:center;gap:.55rem;font-family:${f.display};font-weight:700;font-size:1rem;background:var(--kf-pop);color:var(--kf-ink);padding:.95rem 1.7rem;border-radius:999px;text-decoration:none;border:1px solid transparent;transition:transform .25s ${SPRING},background .2s,box-shadow .25s;box-shadow:0 14px 28px -12px rgba(243,156,18,.7)}
.kf-btn-wa:hover{background:var(--kf-popDeep);transform:translateY(-2px)}
.kf-btn-wa svg{width:19px;height:19px;flex:none}
.kf-btn-ghost{display:inline-flex;align-items:center;gap:.5rem;font-family:${f.display};font-weight:700;font-size:1rem;background:var(--kf-surface);color:var(--kf-accentDeep);padding:.95rem 1.6rem;border-radius:999px;text-decoration:none;border:1px solid var(--kf-bg2);box-shadow:0 4px 14px -8px var(--kf-shadow);transition:transform .25s ${SPRING},border-color .2s}
.kf-btn-ghost:hover{border-color:var(--kf-accentLight);transform:translateY(-2px)}
.kf-hero-micro{margin-top:1.1rem;font-size:.86rem;color:var(--kf-muted);display:flex;align-items:center;gap:.45rem}
.kf-hero-micro svg{width:16px;height:16px;flex:none}
/* trust strip */
.kf-trust{display:flex;align-items:center;gap:1.1rem;margin-top:2rem;padding-top:1.6rem;border-top:1px solid var(--kf-line);flex-wrap:wrap}
.kf-trust-stars{display:flex;gap:2px}
.kf-trust-stars svg{width:18px;height:18px;color:var(--kf-pop)}
.kf-trust b{color:var(--kf-ink);font-family:${f.display};font-weight:700;font-variant-numeric:tabular-nums}
.kf-trust small{font-size:.78rem;color:var(--kf-muted);display:block}
.kf-trust-div{width:1px;height:30px;background:var(--kf-line)}
/* visual kanan */
.kf-hero-visual{position:relative}
.kf-hero-photo{position:relative;aspect-ratio:4/4.4;border-radius:28px;overflow:hidden;background:linear-gradient(150deg,var(--kf-accent),var(--kf-accentLight) 45%,#7FCBEC);box-shadow:0 30px 70px -28px var(--kf-shadowDeep)}
.kf-hero-photo img{width:100%;height:100%;object-fit:cover}
.kf-hero-photo-ph{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.7rem;color:rgba(255,255,255,.92);height:100%;text-align:center;padding:1.5rem}
.kf-hero-photo-ph svg{width:46px;height:46px;opacity:.9}
.kf-hero-photo-ph span{font-size:.82rem;font-weight:600;letter-spacing:.02em;max-width:230px;opacity:.92}
.kf-hero-arc{position:absolute;left:0;right:0;bottom:-1px;height:46%;z-index:2;pointer-events:none}
.kf-float-card{position:absolute;left:-1.6rem;bottom:2.1rem;z-index:3;background:var(--kf-surface);border-radius:18px;padding:.95rem 1.2rem;box-shadow:0 16px 40px -18px var(--kf-shadowDeep);display:flex;align-items:center;gap:.8rem}
.kf-float-ring{width:46px;height:46px;border-radius:50%;background:conic-gradient(var(--kf-accentLight),var(--kf-pop),var(--kf-accentLight));display:grid;place-items:center;flex:none}
.kf-float-ring i{width:38px;height:38px;border-radius:50%;background:var(--kf-surface);display:grid;place-items:center;font-family:${f.display};font-weight:800;color:var(--kf-ink);font-size:.92rem;font-style:normal;font-variant-numeric:tabular-nums}
.kf-float-card b{font-family:${f.display};color:var(--kf-ink);font-size:.92rem;display:block}
.kf-float-card small{font-size:.74rem;color:var(--kf-muted)}
.kf-float-badge{position:absolute;right:-1rem;top:1.9rem;z-index:3;background:var(--kf-surface);border-radius:14px;padding:.65rem .9rem;box-shadow:0 16px 40px -18px var(--kf-shadowDeep);font-size:.78rem;font-weight:700;color:var(--kf-accentDeep);display:flex;align-items:center;gap:.5rem}
.kf-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;box-shadow:0 0 0 4px rgba(34,197,94,.18)}
@media(max-width:880px){
  .kf-hero-grid{grid-template-columns:1fr;gap:2.4rem;padding:7.5rem 7vw 3.5rem}
  .kf-hero-visual{max-width:420px;margin:0 auto;width:100%}
  .kf-hero-title{font-size:clamp(2.1rem,8vw,3rem)}
}
@media(max-width:560px){.kf-nav{padding:.9rem 6vw}.kf-float-card{left:0}.kf-float-badge{right:0}}

/* SECTION COMMONS */
.kf-section{padding:clamp(4.2rem,8vw,7rem) 7vw}
.kf-sec-hdr{max-width:620px;margin-bottom:3rem}
.kf-sec-hdr.kf-center{margin-left:auto;margin-right:auto;text-align:center}
.kf-sec-hdr .kf-eyebrow{display:block;margin-bottom:.85rem}
.kf-heading{font-size:clamp(1.85rem,4vw,2.75rem);font-weight:800;color:var(--kf-ink);line-height:1.12;letter-spacing:-.02em}
.kf-subtext{color:var(--kf-inkDim);font-size:1.08rem;margin-top:.9rem;line-height:1.7}
.kf-mocklabel{display:inline-flex;align-items:center;gap:.45rem;background:#FFF4E5;color:var(--kf-ink);font-size:.74rem;font-weight:700;padding:.38rem .8rem;border-radius:999px;border:1px dashed #F3C77E;margin-top:.85rem}
.kf-mocklabel svg{width:15px;height:15px;flex:none}

/* KELUHAN — pill grid */
.kf-pills{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.kf-pill{background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:18px;padding:1.35rem;display:flex;align-items:center;gap:.9rem;font-family:${f.display};font-weight:600;font-size:.96rem;color:var(--kf-ink);box-shadow:0 4px 14px -8px var(--kf-shadow);transition:transform .25s ${EASE},border-color .2s}
.kf-pill:hover{transform:translateY(-4px);border-color:var(--kf-bg2)}
.kf-pill-ic{flex:none;width:46px;height:46px;border-radius:13px;background:var(--kf-bg2);display:grid;place-items:center;color:var(--kf-accent)}
.kf-pill-ic svg{width:24px;height:24px}
@media(max-width:760px){.kf-pills{grid-template-columns:1fr 1fr;gap:.75rem}.kf-pill{padding:1rem;font-size:.88rem}}
@media(max-width:430px){.kf-pills{grid-template-columns:1fr}}

/* WHY — bento kartu */
.kf-why{background:var(--kf-surface)}
.kf-why-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.1rem}
.kf-why-card{background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:18px;padding:1.7rem;box-shadow:0 4px 14px -8px var(--kf-shadow);transition:transform .35s ${EASE},box-shadow .35s,border-color .35s}
.kf-why-card:hover{transform:translateY(-5px);box-shadow:0 20px 42px -22px var(--kf-shadow);border-color:var(--kf-bg2)}
.kf-why-ic{width:48px;height:48px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(135deg,var(--kf-accentLight),var(--kf-accent));color:#fff;margin-bottom:1rem}
.kf-why-ic svg{width:24px;height:24px}
.kf-why-card.kf-accent .kf-why-ic{background:linear-gradient(135deg,var(--kf-pop),var(--kf-popDeep));color:var(--kf-ink)}
.kf-why-title{font-size:1.12rem;font-weight:700;margin-bottom:.45rem;color:var(--kf-ink)}
.kf-why-desc{font-size:.92rem;color:var(--kf-muted);line-height:1.65}
@media(max-width:920px){.kf-why-grid{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.kf-why-grid{grid-template-columns:1fr}}

/* RECOVERY TRACK (SIGNATURE) — jalur pemulihan bernomor ber-busur */
.kf-track{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;counter-reset:kf-step}
.kf-track-arc{position:absolute;top:1.4rem;left:8%;right:8%;height:64px;z-index:0;color:var(--kf-accentLight);opacity:.55;pointer-events:none}
.kf-step{position:relative;z-index:1;padding:.4rem .3rem}
.kf-step-n{width:54px;height:54px;border-radius:50%;background:var(--kf-surface);border:2px solid var(--kf-bg2);color:var(--kf-accent);font-family:${f.display};font-weight:800;font-size:1.25rem;display:grid;place-items:center;margin-bottom:1.1rem;box-shadow:0 8px 22px -12px var(--kf-shadow);position:relative}
.kf-step:nth-child(2) .kf-step-n{border-color:rgba(243,156,18,.4);color:var(--kf-ink)}
.kf-step-n::after{content:'';position:absolute;inset:-7px;border-radius:50%;border:1px dashed var(--kf-line)}
.kf-step-title{font-size:1.18rem;font-weight:700;margin-bottom:.45rem;color:var(--kf-ink)}
.kf-step-desc{font-size:.95rem;color:var(--kf-muted);line-height:1.65}
@media(max-width:760px){.kf-track{grid-template-columns:1fr;gap:1.3rem}.kf-track-arc{display:none}}

/* BOOKING — seksi flow native (B5) */
.kf-booking{background:var(--kf-bg2)}

/* SHOWCASE LAYANAN — kartu layanan + quick-look */
.kf-showcase{background:linear-gradient(180deg,var(--kf-surface),#F2F8FB)}
.kf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.1rem,3vw,1.6rem)}
.kf-grid[data-count="1"]{grid-template-columns:minmax(0,380px);justify-content:center}
.kf-grid[data-count="2"]{grid-template-columns:repeat(2,minmax(0,360px));justify-content:center;max-width:820px;margin:0 auto}
.kf-card{position:relative;cursor:pointer;background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:18px;overflow:hidden;transition:transform .4s ${EASE},box-shadow .4s,border-color .4s;display:flex;flex-direction:column;box-shadow:0 4px 14px -8px var(--kf-shadow)}
.kf-card:hover{transform:translateY(-6px);box-shadow:0 26px 52px -26px var(--kf-shadow);border-color:var(--kf-bg2)}
.kf-card-frame{position:relative;aspect-ratio:16/11;overflow:hidden;background:var(--kf-surface2)}
.kf-card-frame img{width:100%;height:100%;object-fit:cover;transition:transform .6s ${EASE}}
.kf-card:hover .kf-card-frame img{transform:scale(1.05)}
.kf-card-frame-ph{position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(150deg,var(--kf-accent),var(--kf-accentLight));color:rgba(255,255,255,.85)}
.kf-card-frame-ph svg{width:40px;height:40px}
.kf-card-cat{position:absolute;top:.7rem;left:.7rem;z-index:2;font-family:${f.display};font-size:.64rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--kf-accentDeep);background:rgba(255,255,255,.94);padding:.3rem .64rem;border-radius:8px;box-shadow:0 3px 9px -4px var(--kf-shadow)}
.kf-card-body{padding:1.2rem 1.25rem 1.3rem;display:flex;flex-direction:column;flex:1}
.kf-card-name{font-size:1.14rem;font-weight:700;color:var(--kf-ink);margin-bottom:.35rem;line-height:1.3}
.kf-card-desc{font-size:.88rem;color:var(--kf-muted);margin-bottom:1rem;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.kf-card-foot{display:flex;align-items:center;justify-content:space-between;gap:.7rem;margin-top:auto;padding-top:.85rem;border-top:1px solid var(--kf-line)}
.kf-card-price{font-family:${f.display};font-size:1.04rem;font-weight:800;color:var(--kf-accentDeep);font-variant-numeric:tabular-nums}
.kf-card-price-soft{font-size:.92rem;font-weight:700;color:var(--kf-muted)}
.kf-card-dur{font-size:.76rem;font-weight:600;color:var(--kf-muted);display:inline-flex;align-items:center;gap:.35rem}
.kf-card-dur::before{content:'';width:13px;height:13px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.7}
@media(max-width:980px){.kf-grid{grid-template-columns:repeat(2,1fr)}.kf-grid[data-count="1"]{grid-template-columns:minmax(0,380px)}}
@media(max-width:560px){.kf-grid,.kf-grid[data-count="1"],.kf-grid[data-count="2"]{grid-template-columns:1fr;max-width:380px;margin:0 auto}}

/* STATEMENT — panel + busur */
.kf-statement{padding:clamp(3.5rem,7vw,6rem) 7vw}
.kf-stmt-inner{position:relative;max-width:62ch;margin:0 auto;background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:24px;padding:clamp(2.4rem,5vw,3.6rem);text-align:center;box-shadow:0 18px 44px -22px var(--kf-shadow);overflow:hidden}
.kf-stmt-arc{position:absolute;left:50%;top:-30px;transform:translateX(-50%);width:200px;height:90px;opacity:.5}
.kf-stmt-ew{font-family:${f.display};font-size:.74rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--kf-accentDeep);margin-bottom:1rem}
.kf-stmt-quote{font-family:${f.display};font-size:clamp(1.4rem,2.8vw,2.05rem);font-weight:700;color:var(--kf-ink);line-height:1.35;letter-spacing:-.015em}
.kf-stmt-cite{display:block;font-size:.82rem;color:var(--kf-muted);font-weight:600;margin-top:1.2rem}

/* ABOUT — split + bingkai foto */
.kf-about{background:var(--kf-bg2)}
.kf-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:center}
.kf-about-inner.kf-about-solo{grid-template-columns:1fr;max-width:62ch;margin:0 auto;text-align:center}
.kf-about-solo .kf-eyebrow{display:block}
.kf-about-solo .kf-about-body{margin-left:auto;margin-right:auto}
.kf-about-body{font-size:1.04rem;color:var(--kf-inkDim);line-height:1.9;margin-top:1.1rem;white-space:pre-line}
.kf-about-cta{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.7rem;font-family:${f.display};font-size:.95rem;font-weight:700;color:var(--kf-accentDeep);text-decoration:none;transition:gap .3s,color .3s}
.kf-about-cta:hover{gap:.8rem;color:var(--kf-ink)}
.kf-about-img{position:relative}
.kf-about-frame{position:relative;z-index:1;aspect-ratio:4/3;border-radius:22px;overflow:hidden;box-shadow:0 28px 60px -30px var(--kf-shadowDeep)}
.kf-about-frame img{width:100%;height:100%;object-fit:cover}
@media(max-width:840px){.kf-about-inner{grid-template-columns:1fr;gap:2.5rem}.kf-about-img{order:-1;max-width:420px;margin:0 auto}}

/* STATS — angka ber-countUp */
.kf-stats{background:var(--kf-surface);border-top:1px solid var(--kf-line);border-bottom:1px solid var(--kf-line)}
.kf-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3rem;text-align:center}
.kf-stat{padding:1.4rem 1rem}
.kf-stat-num{font-family:${f.display};font-size:clamp(2.1rem,4.4vw,3rem);font-weight:800;color:var(--kf-accent);line-height:1;font-variant-numeric:tabular-nums}
.kf-stat-label{font-size:.78rem;color:var(--kf-muted);font-weight:600;margin-top:.6rem}
@media(max-width:560px){.kf-stats-grid{grid-template-columns:repeat(2,1fr);gap:1rem}}

/* TESTIMONIALS — carousel scroll-snap */
.kf-testimonials{background:var(--kf-bg)}
.kf-tcar{position:relative}
.kf-tcar-track{display:flex;gap:1.2rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .25rem 1.5rem;-ms-overflow-style:none;scrollbar-width:none}
.kf-tcar-track::-webkit-scrollbar{display:none}
.kf-test-card{scroll-snap-align:start;background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:18px;padding:1.8rem;min-width:300px;max-width:360px;flex:0 0 auto;box-shadow:0 10px 26px -16px var(--kf-shadow)}
.kf-test-stars{display:flex;gap:2px;margin-bottom:.85rem}
.kf-test-stars svg{width:16px;height:16px;color:var(--kf-pop)}
.kf-test-quote{color:var(--kf-ink);font-size:.98rem;line-height:1.7;margin:0 0 1.3rem}
.kf-test-person{display:flex;align-items:center;gap:.75rem}
.kf-test-av{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-family:${f.display};font-weight:700;color:#fff;font-size:1rem;flex:none;background:var(--kf-accent)}
.kf-test-name{font-family:${f.display};font-weight:700;font-size:.95rem;color:var(--kf-ink)}
.kf-test-role{font-size:.76rem;color:var(--kf-muted);margin-top:.1rem}
.kf-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1.1rem;margin-top:1.4rem}
.kf-tcar-btn{width:44px;height:44px;border-radius:12px;background:var(--kf-surface);border:1px solid var(--kf-line);color:var(--kf-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s,border-color .25s,opacity .25s,transform .25s ${EASE}}
.kf-tcar-btn:hover:not(:disabled){background:var(--kf-accentDeep);color:var(--kf-onAccent);border-color:var(--kf-accentDeep);transform:translateY(-2px)}
.kf-tcar-btn:disabled{opacity:.3;cursor:default}
.kf-tcar-dots{display:flex;gap:.5rem;align-items:center}
.kf-dot-nav{width:8px;height:8px;border-radius:50%;background:var(--kf-line);border:none;padding:0;cursor:pointer;transition:background .25s,transform .25s}
.kf-dot-nav[aria-current="true"]{background:var(--kf-accent);transform:scale(1.5)}

/* FAQ */
.kf-faq{background:var(--kf-surface)}
.kf-faq-wrap{max-width:780px;margin:0 auto}
.kf-faq-item{background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:18px;margin-bottom:.75rem;overflow:hidden;box-shadow:0 4px 14px -8px var(--kf-shadow)}
.kf-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.25rem 1.5rem;cursor:pointer;font-family:${f.display};font-size:1.04rem;font-weight:700;color:var(--kf-ink);background:none;border:none;text-align:left}
.kf-faq-q:focus-visible{outline:2px solid var(--kf-accentLight);outline-offset:-2px;border-radius:14px}
.kf-faq-pl{flex:none;width:24px;height:24px;border-radius:50%;background:var(--kf-bg2);color:var(--kf-accent);display:grid;place-items:center;transition:transform .25s ${EASE}}
.kf-faq-pl svg{width:14px;height:14px}
.kf-faq-pl.open{transform:rotate(45deg)}
.kf-faq-a{font-size:.96rem;color:var(--kf-inkDim);line-height:1.8;padding:0 1.5rem 1.3rem;max-width:64ch}

/* CTA — band teal + busur */
.kf-cta{background:var(--kf-bg)}
.kf-cta-inner{position:relative;background:linear-gradient(120deg,var(--kf-accentDeep),var(--kf-accentLight));color:#fff;text-align:center;border-radius:28px;padding:clamp(3rem,6vw,4.5rem) clamp(1.5rem,5vw,2.5rem);overflow:hidden}
.kf-cta-inner::after{content:'';position:absolute;right:-80px;top:-80px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(243,156,18,.35),transparent 65%);pointer-events:none}
.kf-cta-arc{position:absolute;left:50%;top:-26px;transform:translateX(-50%);width:220px;height:90px;color:rgba(255,255,255,.5)}
.kf-cta-title{position:relative;font-size:clamp(1.9rem,4.4vw,2.85rem);font-weight:800;color:#fff;line-height:1.14;letter-spacing:-.02em;text-wrap:balance}
.kf-cta-sub{position:relative;font-size:1.08rem;color:rgba(255,255,255,.9);margin:.9rem auto 2rem;max-width:50ch;line-height:1.7}
.kf-cta-btns{position:relative;display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap}
.kf-cta .kf-btn-wa{background:#fff;color:var(--kf-ink);box-shadow:0 14px 30px -12px rgba(0,0,0,.4)}
.kf-cta .kf-btn-wa:hover{background:var(--kf-bg2);color:var(--kf-ink)}
.kf-cta .kf-btn-ghost{background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.35)}
.kf-cta .kf-btn-ghost:hover{border-color:#fff;background:rgba(255,255,255,.16)}

/* BAND ADD-ON */
.kf-band{background:var(--kf-surface);border-top:1px solid var(--kf-line);border-bottom:1px solid var(--kf-line);padding:3.2rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.4rem}
.kf-band-ew{font-family:${f.display};font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--kf-accentDeep);margin-bottom:.5rem}
.kf-band .kf-heading{font-size:clamp(1.5rem,2.4vw,2rem)}
.kf-band-sub{color:var(--kf-muted);font-size:.95rem;line-height:1.6;margin-top:.5rem;max-width:56ch}

/* FOOTER — navy gelap */
.kf-footer{background:var(--kf-dark);color:#9FBED0;padding:4.2rem 7vw 2.4rem}
.kf-footer-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:3rem;margin-bottom:2.6rem}
.kf-footer-brand{display:inline-flex;align-items:center;gap:.6rem;font-family:${f.display};font-size:1.4rem;font-weight:800;color:#fff;margin-bottom:1rem}
.kf-footer-brand::before{content:'';width:11px;height:11px;border-radius:50%;background:var(--kf-accentLight);box-shadow:0 0 0 4px rgba(27,156,216,.3)}
.kf-footer-brand b{color:var(--kf-pop)}
.kf-footer-tagline{font-size:.9rem;color:#9FBED0;line-height:1.7;max-width:36ch}
.kf-footer-h{font-family:${f.display};font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fff;margin-bottom:1rem}
.kf-footer-link{display:block;font-size:.9rem;color:#9FBED0;text-decoration:none;margin-bottom:.55rem;transition:color .25s}
.kf-footer-link:hover{color:#fff}
.kf-footer-copy{border-top:1px solid rgba(255,255,255,.1);padding-top:1.5rem;font-size:.8rem;color:#6B8A9B;text-align:center}
@media(max-width:768px){.kf-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* FLOATING WHATSAPP */
.kf-wafloat{position:fixed;right:20px;bottom:20px;z-index:999;width:56px;height:56px;border-radius:50%;background:#25D366;display:grid;place-items:center;box-shadow:0 10px 28px -8px rgba(37,211,102,.6);transition:transform .3s ${SPRING}}
.kf-wafloat:hover{transform:scale(1.1)}
.kf-wafloat svg{width:30px;height:30px;color:#fff}

/* REVEAL — via LUX_JS (.lx-reveal → .lx-in), digate .lx-js (kontrak no-JS #138) */
.lx-js .kf-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ${EASE},transform .7s ${EASE}}
.lx-js .kf-rv.lx-in{opacity:1;transform:none}
.kf-rv-d1{transition-delay:.08s}.kf-rv-d2{transition-delay:.16s}.kf-rv-d3{transition-delay:.24s}.kf-rv-d4{transition-delay:.32s}

/* LIGHTBOX — kf-root overrides palet lx-lb (athletic-clinical) */
.kf-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.kf-root .lx-lb[hidden]{display:none}
.kf-root .lx-lb-back{position:absolute;inset:0;background:rgba(10,34,51,.55);backdrop-filter:blur(6px);border:0;cursor:pointer}
.kf-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:22px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .42s ${EASE},transform .42s ${EASE}}
.kf-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.kf-root .lx-lb-media{position:relative;overflow:hidden;background:linear-gradient(150deg,var(--kf-accent),var(--kf-accentLight));min-height:300px}
.kf-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.kf-root .lx-lb-body{padding:clamp(22px,3vw,42px);display:flex;flex-direction:column;gap:9px;justify-content:center}
.kf-root .lx-lb-cat{font-family:${f.display};font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--kf-accentDeep)}
.kf-root .lx-lb-title{font-family:${f.display};font-size:clamp(22px,2.6vw,29px);font-weight:700;line-height:1.2;color:var(--kf-ink)}
.kf-root .lx-lb-price{font-family:${f.display};font-size:19px;font-weight:800;color:var(--kf-accentDeep)}
.kf-root .lx-lb-desc{color:var(--kf-muted);font-size:13.5px;line-height:1.8}
.kf-root .lx-lb-cta{margin-top:14px;width:fit-content;display:inline-flex;align-items:center;gap:.45rem;background:var(--kf-pop);color:var(--kf-ink);font-family:${f.display};font-size:13px;font-weight:700;padding:12px 24px;border-radius:999px;text-decoration:none;transition:background .25s}
.kf-root .lx-lb-cta:hover{background:var(--kf-popDeep)}
.kf-root .lx-lb-x{position:absolute;top:12px;right:12px;z-index:3;width:40px;height:40px;border-radius:11px;background:var(--kf-surface);border:1px solid var(--kf-line);color:var(--kf-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.kf-root .lx-lb-x:hover{background:var(--kf-accentDeep);color:var(--kf-onAccent);border-color:var(--kf-accentDeep)}
.kf-root .lx-lb-prev,.kf-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:40px;height:40px;border-radius:11px;background:var(--kf-surface);border:1px solid var(--kf-line);color:var(--kf-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.kf-root .lx-lb-prev:hover,.kf-root .lx-lb-next:hover{background:var(--kf-accentDeep);color:var(--kf-onAccent)}
.kf-root .lx-lb-prev{left:8px}.kf-root .lx-lb-next{right:8px}
@media(max-width:640px){.kf-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.kf-root .lx-lb-media{min-height:230px}}

/* ── RASA polish ── */
.kf-btn-wa:active,.kf-btn-ghost:active,.kf-nav-cta:active{transform:translateY(0) scale(.97)}
.kf-card:active{transform:translateY(-2px)}
.kf-tcar-btn:active{transform:scale(.93)}
.kf-nav-cta:focus-visible,.kf-btn-wa:focus-visible,.kf-btn-ghost:focus-visible,.kf-about-cta:focus-visible,.kf-footer-link:focus-visible,.kf-card:focus-visible,.kf-tcar-btn:focus-visible,.kf-dot-nav:focus-visible,.kf-faq-q:focus-visible,.kf-cta-btns a:focus-visible,.kf-wafloat:focus-visible{outline:3px solid var(--kf-accentLight);outline-offset:3px}
.kf-hero-sub,.kf-subtext,.kf-about-body,.kf-cta-sub,.kf-why-desc,.kf-test-quote{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Ikon keluhan (kf-pills) — diputar siklis bila item > set ini. Lucide-style inline.
const COMPLAINT_ICONS = [
  // dumbbell (otot/olahraga)
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 3v6a6 6 0 0 0 12 0V3" /><path d="M6 21v-4a6 6 0 0 1 12 0v4" /></svg>,
  // knee/joint (lutut/sendi)
  <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="6" r="3" /><path d="M12 9v6m0 0-3 6m3-6 3 6" /></svg>,
  // spine (punggung/leher)
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 3v18M15 3v18M4 8h5M15 8h5M4 16h5M15 16h5" /></svg>,
  // brain/neuro (stroke)
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 2a4 4 0 0 0-4 4c0 2 1 3 1 5H7a3 3 0 0 0 0 6h1l1 5h6l1-5h1a3 3 0 0 0 0-6h-2c0-2 1-3 1-5a4 4 0 0 0-4-4Z" /></svg>,
  // clock (sendi/waktu)
  <svg key="e" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  // activity (kembali latihan)
  <svg key="f" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 12h4l2-6 4 12 2-6h6" /></svg>,
]

// Ikon kenapa-kami (kf-why) — selaras mood sport-rehab. Lucide-style inline.
const WHY_ICONS = [
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 3v6a6 6 0 0 0 12 0V3" /><path d="M6 21v-4a6 6 0 0 1 12 0v4" /></svg>,
  <svg key="b" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.5 7 .6-5.3 4.6L18.2 21 12 17.3 5.8 21l1.5-7.3L2 9.1l7-.6L12 2Z" /></svg>,
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
]

// Jalur pemulihan bernomor (SIGNATURE) — 3 langkah default; copy dari mockup.
// Mood sport-rehab: Konsultasi → Program terarah → Pulih. Selalu tampil (bukan
// dari ComposableContent — identitas tema; klaim spesifik klien tetap di konten).
// Belum di-slot: butuh array objek {title,desc}; ThemeCopyPanel belum punya
// editor item-array — follow-up saat editor itu dibangun (header seksi sudah slot).
const RECOVERY_STEPS = [
  { title: 'Cerita keluhanmu', desc: 'Hubungi via WhatsApp, ceritakan keluhanmu, dan kami bantu jadwalkan kunjungan.' },
  { title: 'Assessment & program', desc: 'Terapis menilai kondisimu, lalu menyusun program terarah sesuai target pemulihanmu.' },
  { title: 'Pulih & kembali aktif', desc: 'Jalani sesi terpandu sampai kamu bisa bergerak bebas lagi tanpa khawatir.' },
]

// Avatar fallback — warna selang-seling teal/oranye/deep (mengikuti mockup).
const AV_COLORS = ['#1B9CD8', '#F39C12', '#0B6E96']
function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'P'
}

export default function KlinikFisioRenderer({ content: c, variant = 'gerak', bookingSlug, font }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.gerak
  const f = font ?? DEFAULT_FONT
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Copy khas-tema (slot manifest) — editan klien dari portal "Konten Tema";
  // default = copy bawaan tema (byte-identik hardcode lama; parity.test menjaga).
  const cp = copyGetter(c.themeCopy, KLINIK_FISIO_SLOTS)

  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa}` : '#konsultasi'
  // B5: bila booking online aktif, CTA utama arahkan ke seksi #booking (flow native);
  // WhatsApp tetap tersedia (floating + footer). Absen → perilaku lama (WA).
  const booking = !!bookingSlug
  const primaryHref = booking ? '#booking' : (c.hero?.ctaHref ?? waUrl)
  const primaryLabel = booking ? cp.t('copy.booking_cta') : undefined
  const hero = c.hero ?? {}
  const items = c.showcase?.items ?? []
  const features = c.features ?? []
  const stats = c.stats ?? []
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []
  const jamRows = c.info?.jam ?? []
  const jamSingkat = jamRows[0]?.jam ?? cp.t('copy.jam_fallback')

  const rootStyle = {
    '--kf-bg': p.bg, '--kf-bg2': p.bg2, '--kf-surface': p.surface, '--kf-surface2': p.surface2,
    '--kf-ink': p.ink, '--kf-inkDim': p.inkDim, '--kf-muted': p.muted,
    '--kf-accent': p.accent, '--kf-accentLight': p.accentLight, '--kf-accentDeep': p.accentDeep, '--kf-onAccent': p.onAccent,
    '--kf-pop': p.pop, '--kf-popDeep': p.popDeep,
    '--kf-dark': p.dark, '--kf-dark2': p.dark2,
    '--kf-line': p.line, '--kf-line2': p.line2, '--kf-shadow': p.shadow, '--kf-shadowDeep': p.shadowDeep,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const priceText = (n?: number) => (typeof n === 'number' && n > 0 ? fmt(n) : cp.t('copy.price_fallback'))

  // Rating utk kartu mengambang & trust strip — dari stats bila ada, jika tidak '5,0'.
  const ratingStat = stats.find((s) => /^[0-9][.,][0-9]/.test(s.angka))?.angka ?? '5,0'

  return (
    <div className="kf-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: kfCss(f) }} />

      {/* NAV */}
      <nav className="kf-nav" aria-label="Navigasi utama">
        <span className="kf-nav-logo">{c.nama ?? 'Klinik Fisio'}</span>
        {booking
          ? <a href="#booking" className="kf-nav-cta" data-edit="copy.booking_cta">{cp.t('copy.booking_cta')}</a>
          : <a href={waUrl} className="kf-nav-cta" data-edit="copy.wa_cta"><IconWa />{cp.t('copy.wa_cta')}</a>}
      </nav>

      {/* HERO — copy kiri + visual teal kanan + kartu rating mengambang + busur (signature) */}
      <section className="kf-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="kf-hero-grid">
          <div className="kf-hero-text">
            {hero.eyebrow && <span className="kf-eyebrow">{hero.eyebrow}</span>}
            <div className="kf-hero-tagline" data-edit="copy.hero_tagline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>
              {hero.ctaText2 ?? cp.t('copy.hero_tagline')}
            </div>
            {hero.title && <h1 className="kf-hero-title">{hero.title}</h1>}
            {hero.subtitle && <p className="kf-hero-sub">{hero.subtitle}</p>}
            <div className="kf-hero-cta">
              <a href={primaryHref} className="kf-btn-wa" data-edit={booking ? 'copy.booking_cta' : 'copy.hero_cta'}>{booking ? null : <IconWa />}{primaryLabel ?? hero.ctaText ?? cp.t('copy.hero_cta')}</a>
              {booking
                ? <a href={waUrl} className="kf-btn-ghost" data-edit="copy.wa_cta"><IconWa />{cp.t('copy.wa_cta')}</a>
                : <a href={hero.ctaHref2 ?? '#layanan'} className="kf-btn-ghost" data-edit="copy.hero_cta2">{cp.t('copy.hero_cta2')}</a>}
            </div>
            <p className="kf-hero-micro" data-edit="copy.hero_micro">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              {cp.t('copy.hero_micro')}
            </p>
            <div className="kf-trust">
              <div>
                <div className="kf-trust-stars" aria-label={`Rating ${ratingStat} dari 5`}>
                  {[0, 1, 2, 3, 4].map((i) => <IconStar key={i} />)}
                </div>
                <small data-edit="copy.trust_reviews"><b>{ratingStat}</b> · {cp.t('copy.trust_reviews')}</small>
              </div>
              {stats.slice(0, 2).map((s, i) =>
                /^[0-9][.,][0-9]/.test(s.angka) ? null : (
                  <span key={i} style={{ display: 'contents' }}>
                    <span className="kf-trust-div" aria-hidden />
                    <div><b>{s.angka}</b><small>{s.label}</small></div>
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="kf-hero-visual kf-rv lx-reveal">
            <div className="kf-hero-photo">
              {hero.image ? (
                <img
                  src={hero.image}
                  alt={c.nama ?? 'Klinik fisioterapi'}
                  loading="eager"
                  style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
                />
              ) : (
                <div className="kf-hero-photo-ph" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2.2" /><path d="m4 19 5-4 4 3 3-2 4 3" /></svg>
                  <span>Foto klinik / sesi terapi</span>
                </div>
              )}
              <MotionArc className="kf-hero-arc" />
            </div>
            <div className="kf-float-card">
              <div className="kf-float-ring"><i>{ratingStat}</i></div>
              <div><b data-edit="copy.float_rating_prefix">{cp.t('copy.float_rating_prefix')} {ratingStat} {cp.t('copy.float_rating_suffix')}</b><small data-edit="copy.float_rating_sub">{cp.t('copy.float_rating_sub')}</small></div>
            </div>
            <div className="kf-float-badge" data-edit="copy.badge_open"><span className="kf-dot" aria-hidden /> {cp.t('copy.badge_open')} · {jamSingkat}</div>
          </div>
        </div>
      </section>

      {/* KELUHAN — yang kami tangani (pill grid; dipetakan dari showcase items) */}
      {items.length > 0 && (
        <section className="kf-section" id="keluhan">
          <div className="kf-sec-hdr kf-rv lx-reveal">
            <span className="kf-eyebrow" data-edit="copy.keluhan_eyebrow">{cp.t('copy.keluhan_eyebrow')}</span>
            <h2 className="kf-heading" data-edit="copy.keluhan_title">{cp.t('copy.keluhan_title')}</h2>
            <p className="kf-subtext" data-edit="copy.keluhan_sub">{cp.t('copy.keluhan_sub')}</p>
          </div>
          <div className="kf-pills">
            {items.slice(0, 6).map((item, i) => (
              <div key={i} className="kf-pill kf-rv lx-reveal" style={{ transitionDelay: `${(i % 3) * 0.07}s` }}>
                <span className="kf-pill-ic">{COMPLAINT_ICONS[i % COMPLAINT_ICONS.length]}</span>
                {item.nama}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WHY — kenapa kami (kartu bento) */}
      {features.length > 0 && (
        <section className="kf-section kf-why" id="kenapa">
          <div className="kf-sec-hdr kf-rv lx-reveal">
            <span className="kf-eyebrow" data-edit="copy.features_eyebrow">{c.featuresEyebrow ?? cp.t('copy.features_eyebrow')}</span>
            {c.featuresTitle && <h2 className="kf-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="kf-why-grid">
            {features.slice(0, 4).map((f, i) => (
              <div key={i} className={`kf-why-card kf-rv lx-reveal kf-rv-d${i + 1}${i === 1 ? ' kf-accent' : ''}`}>
                <div className="kf-why-ic">{WHY_ICONS[i % WHY_ICONS.length]}</div>
                <h3 className="kf-why-title">{f.title}</h3>
                <p className="kf-why-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RECOVERY TRACK (SIGNATURE) — jalur pemulihan bernomor ber-busur */}
      <section className="kf-section" id="cara">
        <div className="kf-sec-hdr kf-center kf-rv lx-reveal">
          <span className="kf-eyebrow" data-edit="copy.steps_eyebrow">{cp.t('copy.steps_eyebrow')}</span>
          <h2 className="kf-heading" data-edit="copy.steps_title">{cp.t('copy.steps_title')}</h2>
        </div>
        <div className="kf-track">
          <MotionArc className="kf-track-arc" />
          {RECOVERY_STEPS.map((s, i) => (
            <div key={i} className={`kf-step kf-rv lx-reveal kf-rv-d${i + 1}`}>
              <div className="kf-step-n">{i + 1}</div>
              <h3 className="kf-step-title">{s.title}</h3>
              <p className="kf-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE LAYANAN — kartu layanan + quick-look */}
      {items.length > 0 && (
        <section className="kf-section kf-showcase" id="layanan">
          <div className="kf-sec-hdr kf-center kf-rv lx-reveal">
            <span className="kf-eyebrow" data-edit="copy.layanan_eyebrow">{cp.t('copy.layanan_eyebrow')}</span>
            {c.showcase?.title && <h2 className="kf-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="kf-subtext">{c.showcase.subtitle}</p>}
          </div>
          <div className="kf-grid lx-look" data-count={items.length}>
            {items.map((item, i) => (
              <article
                key={i}
                className="kf-card lx-lb-open kf-rv lx-reveal"
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
                <div className="kf-card-frame">
                  {item.kategori && <span className="kf-card-cat">{item.kategori}</span>}
                  {item.gambar ? (
                    <img src={item.gambar} alt={item.nama} loading="lazy" />
                  ) : (
                    <span className="kf-card-frame-ph" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12h4l2-6 4 12 2-6h6" /></svg>
                    </span>
                  )}
                </div>
                <div className="kf-card-body">
                  <h3 className="kf-card-name">{item.nama}</h3>
                  {item.desc && <p className="kf-card-desc">{item.desc}</p>}
                  <div className="kf-card-foot">
                    <span className={`kf-card-price${typeof item.harga === 'number' && item.harga > 0 ? '' : ' kf-card-price-soft'}`}>
                      {priceText(item.harga)}
                    </span>
                    {typeof item.durasi === 'number' && item.durasi > 0 && (
                      <span className="kf-card-dur">± {item.durasi} {cp.t('copy.durasi_suffix')}</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* BOOKING — flow native realtime (B5, hanya bila booking online aktif) */}
      {booking && (
        <section className="kf-section kf-booking" id="booking" aria-label="Booking online">
          <div className="kf-sec-hdr kf-center kf-rv lx-reveal">
            <span className="kf-eyebrow" data-edit="copy.booking_eyebrow">{cp.t('copy.booking_eyebrow')}</span>
            <h2 className="kf-heading" data-edit="copy.booking_title">{cp.t('copy.booking_title')}</h2>
            <p className="kf-subtext" data-edit="copy.booking_sub">{cp.t('copy.booking_sub')}</p>
          </div>
          <div className="kf-rv lx-reveal">
            <KlinikFisioBooking slug={bookingSlug!} />
          </div>
        </section>
      )}

      {/* STATEMENT — panel + busur */}
      {c.statement && (
        <div className="kf-statement">
          <div className="kf-stmt-inner kf-rv lx-reveal">
            <MotionArc className="kf-stmt-arc" />
            {c.statement.eyebrow && <p className="kf-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="kf-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="kf-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="kf-section kf-about" id="tentang">
          <div className={`kf-about-inner${c.about.image ? '' : ' kf-about-solo'}`}>
            <div className="kf-rv lx-reveal">
              <span className="kf-eyebrow" data-edit="copy.about_eyebrow">{cp.t('copy.about_eyebrow')}</span>
              <h2 className="kf-heading">{c.about.title}</h2>
              <p className="kf-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="kf-about-cta" data-edit="copy.about_cta">
                  {c.about.ctaText ?? cp.t('copy.about_cta')} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="kf-about-img kf-rv lx-reveal kf-rv-d2">
                <div className="kf-about-frame">
                  <img src={c.about.image} alt={c.about.title} loading="lazy" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="kf-section kf-stats">
          <div className="kf-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`kf-stat kf-rv lx-reveal kf-rv-d${i + 1}`}>
                <div className="kf-stat-num" data-cu>{s.angka}</div>
                <div className="kf-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS — carousel */}
      {testimonials.length > 0 && (
        <section className="kf-section kf-testimonials" id="ulasan">
          <div className="kf-sec-hdr kf-center kf-rv lx-reveal">
            <span className="kf-eyebrow" data-edit="copy.ulasan_eyebrow">{cp.t('copy.ulasan_eyebrow')}</span>
            <h2 className="kf-heading" data-edit="copy.ulasan_title">{cp.t('copy.ulasan_title')}</h2>
            <p className="kf-mocklabel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
              Contoh untuk mockup — ganti dengan testimoni asli (izin pasien)
            </p>
          </div>
          <div className="kf-tcar lx-tcar">
            <div className="kf-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="kf-test-card">
                  <div className="kf-test-stars" aria-hidden>{[0, 1, 2, 3, 4].map((j) => <IconStar key={j} />)}</div>
                  <p className="kf-test-quote">{t.quote}</p>
                  <div className="kf-test-person">
                    <span className="kf-test-av" style={{ background: AV_COLORS[i % AV_COLORS.length] }} aria-hidden>{initials(t.nama)}</span>
                    <div>
                      <p className="kf-test-name">{t.nama}</p>
                      {t.peran && <p className="kf-test-role">{t.peran}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="kf-tcar-ctrl">
                <button className="kf-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="kf-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="kf-dot-nav lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="kf-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="kf-section kf-faq" id="faq">
          <div className="kf-sec-hdr kf-center kf-rv lx-reveal">
            <span className="kf-eyebrow" data-edit="copy.faq_eyebrow">{cp.t('copy.faq_eyebrow')}</span>
            <h2 className="kf-heading" data-edit="copy.faq_title">{cp.t('copy.faq_title')}</h2>
          </div>
          <div className="kf-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="kf-faq-item">
                <button
                  className="kf-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`kf-faq-pl${openFaq === i ? ' open' : ''}`} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
                {openFaq === i && <p className="kf-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA — band teal + busur */}
      {c.cta && (
        <section className="kf-section kf-cta" id="konsultasi">
          <div className="kf-cta-inner kf-rv lx-reveal">
            <MotionArc className="kf-cta-arc" />
            <h2 className="kf-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="kf-cta-sub">{c.cta.subtitle}</p>}
            <div className="kf-cta-btns">
              {booking
                ? <><a href="#booking" className="kf-btn-wa" data-edit="copy.booking_cta">{cp.t('copy.booking_cta')}</a>
                    <a href={waUrl} className="kf-btn-ghost" data-edit="copy.cta_wa"><IconWa />{cp.t('copy.cta_wa')}</a></>
                : <><a href={waUrl} className="kf-btn-wa" data-edit="copy.cta_wa"><IconWa />{c.cta.ctaText ?? cp.t('copy.cta_wa')}</a>
                    <a href="#layanan" className="kf-btn-ghost" data-edit="copy.hero_cta2">{cp.t('copy.hero_cta2')}</a></>}
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON */}
      {(c.bands ?? []).map((b, i) => (
        <section className="kf-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="kf-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="kf-heading">{b.title}</h2>
            {b.subtitle && <p className="kf-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="kf-btn-wa" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="kf-footer">
        <div className="kf-footer-grid">
          <div>
            <p className="kf-footer-brand">{c.nama ?? 'Klinik Fisio'}</p>
            <p className="kf-footer-tagline" data-edit="copy.footer_tagline">
              {hero.eyebrow ?? `${c.nama ?? 'Klinik'} — ${cp.t('copy.footer_desc')}`} {cp.t('copy.footer_tagline')}
            </p>
          </div>
          <div>
            <p className="kf-footer-h" data-edit="copy.footer_kontak_h">{cp.t('copy.footer_kontak_h')}</p>
            {wa && <a href={waUrl} className="kf-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="kf-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="kf-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="kf-footer-h" data-edit="copy.footer_jam_h">{cp.t('copy.footer_jam_h')}</p>
            {jamRows.length
              ? jamRows.map((j, i) => <p key={i} className="kf-footer-link">{j.hari}: {j.jam}</p>)
              : <p className="kf-footer-link" data-edit="copy.footer_jam_fallback">{cp.t('copy.footer_jam_fallback')}</p>}
          </div>
        </div>
        <p className="kf-footer-copy" data-edit="copy.footer_copyright">
          © {new Date().getFullYear()} {c.nama ?? 'Klinik Fisio'}. {cp.t('copy.footer_copyright')}
        </p>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a className="kf-wafloat" href={waUrl} aria-label="Chat via WhatsApp" target="_blank" rel="noopener">
        <IconWa />
      </a>

      {/* LIGHTBOX */}
      <BespokeLightbox ctaText={cp.t('copy.cta_wa')} />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
