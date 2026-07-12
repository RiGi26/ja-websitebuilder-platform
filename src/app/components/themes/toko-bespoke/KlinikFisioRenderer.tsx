'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'
import KlinikFisioBooking from './KlinikFisioBooking'
import KlinikFisioJadwal, { KlinikFisioLiveCard, KlinikFisioTerapis, KlinikFisioCabang } from './KlinikFisioJadwal'
import { copyGetter } from '@/lib/theme-system/theme-copy'
import { KLINIK_FISIO_SLOTS } from './slots/klinik-fisio.slots'

// ============================================================
// GERAK — Klinik Sport-Physiotherapy Bespoke Lux Renderer (Athletic-Clinical)
// REDESIGN 2026-07-12 (port 1:1 dari mockup approved "kamy-physio-redesign"):
// hero asimetris + kartu visual ber-quote, papan jadwal realtime (band gelap
// signature), pill keluhan, kartu layanan ber-ikon, recovery track 3 kartu,
// seksi Terapis & Cabang (data live Portal Klinik), stats+testimoni, FAQ, CTA.
// Industri JASA (source: services) — bukan toko (tanpa keranjang).
// Sora (display) + Plus Jakarta Sans (body) | teal #0E7CB0 + POP ORANGE
// #F39C12 (foreground oranye selalu ink — keputusan WCAG PR #236 sesi 2).
// signature: papan jadwal gelap ("papan skor") + busur gerak | ns: kf-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.kf-*`.
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

// Font parametrik (style knobs Wave 3): pairing alternatif datang dari kurasi
// registry (BespokeEntry.design.fontPairings) via props.font.
type KfFont = { importUrl: string; display: string; body: string }
const DEFAULT_FONT: KfFont = { importUrl: FONT_IMPORT, display: DISPLAY, body: BODY }

// Ikon WhatsApp (glyph) — dipakai tombol WA. aria-hidden (dekoratif).
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

// "Busur gerak" — arc SVG dinamis (signature pendamping). aria-hidden.
function MotionArc({ className = '' }: { className?: string }) {
  return (
    <svg className={`kf-arc ${className}`} viewBox="0 0 320 120" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 112 C 90 8, 230 8, 316 112" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle className="kf-arc-dot" cx="316" cy="112" r="5" fill="currentColor" />
    </svg>
  )
}

// Logo mark — tile teal + busur mini (identitas mockup). aria-hidden.
function LogoMark() {
  return (
    <span className="kf-logo-mark" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 17c4-9 10-13 18-11-6 1-10 5-12 12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /><circle cx="19" cy="18" r="2.4" fill="#F39C12" /></svg>
    </span>
  )
}

function kfCss(f: KfFont): string {
  return `
@import url('${f.importUrl}');
html,body{overflow-x:hidden;max-width:100%}
html{scroll-behavior:smooth}
.kf-root{font-family:${f.body};color:var(--kf-ink);background:var(--kf-surface);line-height:1.65;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;overflow-x:hidden;max-width:100%}
.kf-root *,.kf-root *::before,.kf-root *::after{box-sizing:border-box;margin:0;padding:0}
.kf-root h1,.kf-root h2,.kf-root h3,.kf-root h4{font-family:${f.display};color:var(--kf-ink);line-height:1.15;letter-spacing:-.02em;text-wrap:balance}
.kf-root p{text-wrap:pretty}
.kf-root img{max-width:100%;height:auto;display:block}
.kf-root ::selection{background:rgba(14,124,176,.18);color:var(--kf-ink)}

/* Busur gerak */
.kf-arc{color:var(--kf-accentLight);display:block;width:100%;height:100%}
.kf-arc-dot{transform-box:fill-box;transform-origin:center;color:var(--kf-pop)}
@media(prefers-reduced-motion:no-preference){.kf-arc-dot{animation:kfPulse 2.8s ${EASE} infinite}}
@keyframes kfPulse{0%,70%,100%{transform:scale(1);opacity:.95}82%{transform:scale(1.6);opacity:1}90%{transform:scale(1);opacity:.95}}

/* Tombol (mockup) — foreground di oranye SELALU ink (WCAG #236). */
.kf-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:48px;padding:.75rem 1.6rem;border-radius:999px;border:0;font-family:${f.display};font-weight:700;font-size:.95rem;text-decoration:none;transition:transform .25s ${SPRING},box-shadow .25s,background .25s;cursor:pointer}
.kf-btn:active{transform:scale(.97)}
.kf-btn-pop{background:var(--kf-pop);color:var(--kf-ink);box-shadow:0 8px 20px -6px rgba(243,156,18,.55)}
.kf-btn-pop:hover{background:var(--kf-popDeep);transform:translateY(-1px)}
.kf-btn-teal{background:var(--kf-accentDeep);color:var(--kf-onAccent);box-shadow:0 8px 20px -6px rgba(14,124,176,.5)}
.kf-btn-teal:hover{background:var(--kf-accent);transform:translateY(-1px)}
.kf-btn-ghost{background:var(--kf-surface);color:var(--kf-ink);border:1.5px solid var(--kf-line);box-shadow:0 1px 2px rgba(7,32,46,.04),0 8px 24px -8px rgba(7,32,46,.1)}
.kf-btn-ghost:hover{border-color:rgba(16,38,47,.18);transform:translateY(-1px)}

/* NAV — sticky putih blur (mockup; tanpa dependensi lx-scrolled) */
.kf-nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--kf-line)}
.kf-nav-in{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:68px;padding:0 7vw}
.kf-nav-logo{display:flex;align-items:center;gap:.6rem;text-decoration:none;font-family:${f.display};font-weight:800;font-size:1.06rem;letter-spacing:-.01em;color:var(--kf-ink);white-space:nowrap}
.kf-nav-logo b{color:var(--kf-accent);font-weight:800}
.kf-logo-mark{width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,var(--kf-accent),var(--kf-accentDeep));display:grid;place-items:center;flex:none}
.kf-nav-links{display:flex;gap:.25rem;list-style:none}
.kf-nav-links a{text-decoration:none;font-size:.9rem;font-weight:600;color:var(--kf-inkDim);padding:.6rem .85rem;border-radius:999px;transition:background .25s ${EASE},color .25s ${EASE}}
.kf-nav-links a:hover{background:var(--kf-bg);color:var(--kf-ink)}
.kf-nav .kf-btn{min-height:44px;padding:.6rem 1.35rem;font-size:.88rem;white-space:nowrap}
@media(max-width:860px){.kf-nav-links{display:none}}
@media(max-width:480px){.kf-nav .kf-btn{padding:.55rem 1rem;font-size:.82rem}.kf-nav-logo{font-size:.94rem}}
.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO (mockup) */
.kf-hero{position:relative;overflow:hidden;background:radial-gradient(1200px 600px at 85% -10%,rgba(14,124,176,.09),transparent 60%),radial-gradient(800px 500px at -10% 110%,rgba(243,156,18,.07),transparent 55%),var(--kf-surface)}
.kf-hero-grid{position:relative;z-index:1;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:clamp(2rem,5vw,3rem);padding:4.5rem 7vw 5rem}
.kf-eyebrow{font-family:${f.display};font-size:.75rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--kf-accentDeep)}
.kf-hero-title{font-size:clamp(2.4rem,5.6vw,3.9rem);font-weight:800;letter-spacing:-.03em;margin:1rem 0 1.25rem;color:var(--kf-ink)}
.kf-hero-title em{font-style:normal;color:var(--kf-accent);position:relative;white-space:nowrap}
.kf-hero-title em::after{content:'';position:absolute;left:0;right:0;bottom:4px;height:10px;background:rgba(243,156,18,.35);border-radius:6px;z-index:-1}
.kf-hero-sub{font-size:1.1rem;color:var(--kf-inkDim);max-width:30em;margin-bottom:1.75rem;line-height:1.7}
.kf-hero-cta{display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:1rem}
.kf-hero-micro{font-size:.85rem;color:var(--kf-muted);display:flex;align-items:center;gap:.45rem;margin-bottom:1.5rem}
.kf-hero-micro svg{width:16px;height:16px;flex:none}
.kf-trust{display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;color:var(--kf-muted);font-size:.88rem;font-weight:600}
.kf-trust b{color:var(--kf-ink);font-family:${f.display};font-size:1rem;font-variant-numeric:tabular-nums}
.kf-trust-stars{display:inline-flex;gap:2px;vertical-align:-2px;margin-right:.3rem}
.kf-trust-stars svg{width:15px;height:15px;color:var(--kf-pop)}
/* visual kanan */
.kf-hero-visual{position:relative;min-height:420px}
.kf-hero-card{position:absolute;inset:0;border-radius:40px;background:linear-gradient(150deg,var(--kf-accent) 0%,var(--kf-accentDeep) 55%,#07364F 100%);overflow:hidden;box-shadow:0 2px 4px rgba(7,32,46,.06),0 24px 48px -16px var(--kf-shadowDeep)}
.kf-hero-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.92}
.kf-hero-card::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,32,46,.45) 0%,transparent 45%)}
.kf-hero-chip{position:absolute;left:28px;top:28px;z-index:2;display:inline-flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(6px);padding:.5rem .9rem;border-radius:999px;font-size:.8rem;font-weight:700;font-family:${f.display}}
.kf-hero-quote{position:absolute;left:28px;top:84px;right:88px;z-index:2;color:#fff;font-family:${f.display};font-weight:700;font-size:clamp(1.25rem,2.2vw,1.6rem);line-height:1.3;letter-spacing:-.01em;text-shadow:0 2px 12px rgba(0,0,0,.28)}
.kf-hero-quote .kf-q2{color:var(--kf-pop)}
.kf-hero-arcwrap{position:absolute;left:0;right:0;bottom:-1px;height:46%;z-index:1;pointer-events:none}
.kf-float-card{position:absolute;left:-1.2rem;bottom:2rem;z-index:3;background:var(--kf-surface);border-radius:18px;padding:.95rem 1.2rem;box-shadow:0 16px 40px -18px var(--kf-shadowDeep);display:flex;align-items:center;gap:.8rem}
.kf-float-ring{width:46px;height:46px;border-radius:50%;background:conic-gradient(var(--kf-accentLight),var(--kf-pop),var(--kf-accentLight));display:grid;place-items:center;flex:none}
.kf-float-ring i{width:38px;height:38px;border-radius:50%;background:var(--kf-surface);display:grid;place-items:center;font-family:${f.display};font-weight:800;color:var(--kf-ink);font-size:.92rem;font-style:normal;font-variant-numeric:tabular-nums}
.kf-float-card b{font-family:${f.display};color:var(--kf-ink);font-size:.92rem;display:block}
.kf-float-card small{font-size:.74rem;color:var(--kf-muted)}
.kf-float-badge{position:absolute;right:-1rem;top:1.9rem;z-index:3;background:var(--kf-surface);border-radius:14px;padding:.65rem .9rem;box-shadow:0 16px 40px -18px var(--kf-shadowDeep);font-size:.78rem;font-weight:700;color:var(--kf-accentDeep);display:flex;align-items:center;gap:.5rem}
.kf-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;box-shadow:0 0 0 4px rgba(34,197,94,.18)}
@media(max-width:940px){
  .kf-hero-grid{grid-template-columns:1fr;gap:2.6rem;padding:3rem 7vw 4.5rem}
  .kf-hero-visual{min-height:340px;max-width:480px;width:100%;margin:0 auto 1.4rem}
  .kf-hero-quote{right:40px}
}
@media(max-width:560px){.kf-float-card{left:0}.kf-float-badge{right:0}}

/* SECTION COMMONS */
.kf-section{padding:clamp(4.2rem,8vw,6.5rem) 7vw}
.kf-sec-hdr{max-width:620px;margin-bottom:2.75rem}
.kf-sec-hdr.kf-center{margin-left:auto;margin-right:auto;text-align:center}
.kf-sec-hdr .kf-eyebrow{display:block;margin-bottom:.8rem;color:var(--kf-accent)}
.kf-heading{font-size:clamp(1.75rem,4vw,2.5rem);font-weight:800;color:var(--kf-ink);line-height:1.12;letter-spacing:-.02em}
.kf-subtext{color:var(--kf-inkDim);font-size:1.06rem;margin-top:.9rem;line-height:1.7}
.kf-mocklabel{display:inline-flex;align-items:center;gap:.45rem;background:#FFF4E5;color:var(--kf-ink);font-size:.74rem;font-weight:700;padding:.38rem .8rem;border-radius:999px;border:1px dashed #F3C77E;margin-top:.85rem}
.kf-mocklabel svg{width:15px;height:15px;flex:none}

/* KELUHAN — pill cloud (mockup) */
.kf-keluhan{text-align:center;background:var(--kf-surface)}
.kf-pills{display:flex;gap:.65rem;flex-wrap:wrap;justify-content:center;max-width:780px;margin:0 auto}
.kf-pill{padding:.7rem 1.25rem;border-radius:999px;background:var(--kf-bg);border:1px solid var(--kf-line);font-family:${f.display};font-weight:700;font-size:.9rem;color:var(--kf-inkDim);transition:background .25s ${EASE},color .25s ${EASE},border-color .25s ${EASE},transform .25s ${EASE}}
.kf-pill:hover{background:var(--kf-accent);border-color:var(--kf-accent);color:#fff;transform:translateY(-2px)}

/* LAYANAN — kartu ber-ikon (mockup) */
.kf-layanan{background:var(--kf-bg)}
.kf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
.kf-grid[data-count="1"]{grid-template-columns:minmax(0,380px);justify-content:center}
.kf-grid[data-count="2"]{grid-template-columns:repeat(2,minmax(0,360px));justify-content:center;max-width:820px;margin:0 auto}
.kf-svc{position:relative;cursor:pointer;background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:24px;padding:1.75rem;overflow:hidden;box-shadow:0 1px 2px rgba(7,32,46,.04),0 8px 24px -8px rgba(7,32,46,.1);transition:transform .3s ${EASE},box-shadow .3s ${EASE};display:flex;flex-direction:column}
.kf-svc:hover{transform:translateY(-5px);box-shadow:0 2px 4px rgba(7,32,46,.06),0 16px 40px -12px rgba(7,32,46,.22)}
.kf-svc::before{content:'';position:absolute;top:0;left:28px;right:28px;height:3px;border-radius:0 0 4px 4px;background:linear-gradient(90deg,var(--kf-accent),transparent);opacity:0;transition:opacity .3s ${EASE}}
.kf-svc:hover::before{opacity:1}
.kf-svc-ico{width:48px;height:48px;border-radius:16px;background:var(--kf-bg);display:grid;place-items:center;margin-bottom:1.1rem;color:var(--kf-accent)}
.kf-svc-ico svg{width:24px;height:24px}
.kf-svc h3{font-size:1.12rem;font-weight:700;margin-bottom:.5rem}
.kf-svc p{font-size:.9rem;color:var(--kf-inkDim);margin-bottom:1.1rem;line-height:1.6}
.kf-svc-meta{display:flex;align-items:baseline;justify-content:space-between;gap:.5rem;border-top:1px solid var(--kf-line);padding-top:1rem;margin-top:auto}
.kf-svc-price{font-family:${f.display};font-weight:800;font-size:1.1rem;color:var(--kf-accent);font-variant-numeric:tabular-nums}
.kf-svc-price-soft{font-size:.95rem;font-weight:700;color:var(--kf-muted)}
.kf-svc-dur{font-size:.8rem;font-weight:600;color:var(--kf-muted)}
.kf-svc-cat{position:absolute;top:1.25rem;right:1.25rem;background:rgba(243,156,18,.14);color:var(--kf-ink);font-size:.68rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:.3rem .6rem;border-radius:999px;font-family:${f.display}}
@media(max-width:940px){.kf-grid{grid-template-columns:1fr 1fr}}
@media(max-width:620px){.kf-grid,.kf-grid[data-count="1"],.kf-grid[data-count="2"]{grid-template-columns:1fr;max-width:400px;margin:0 auto}}

/* RECOVERY TRACK — 3 kartu bernomor + konektor putus-putus (mockup) */
.kf-track-sec{background:var(--kf-bg)}
.kf-track{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
.kf-step{background:var(--kf-surface);border-radius:24px;padding:2rem 1.75rem;border:1px solid var(--kf-line);box-shadow:0 1px 2px rgba(7,32,46,.04),0 8px 24px -8px rgba(7,32,46,.1);position:relative}
.kf-step-n{width:44px;height:44px;border-radius:999px;background:var(--kf-dark);color:var(--kf-pop);display:grid;place-items:center;font-family:${f.display};font-weight:800;font-size:1.05rem;margin-bottom:1.25rem}
.kf-step h3{font-size:1.16rem;font-weight:700;margin-bottom:.6rem}
.kf-step p{font-size:.9rem;color:var(--kf-inkDim);line-height:1.65}
.kf-step::after{content:'';position:absolute;top:52px;right:-22px;width:24px;height:2px;background:repeating-linear-gradient(90deg,var(--kf-accent) 0 5px,transparent 5px 9px)}
.kf-step:last-child::after{display:none}
@media(max-width:940px){.kf-track{grid-template-columns:1fr}.kf-step::after{display:none}}

/* WHY — kartu keunggulan */
.kf-why{background:var(--kf-surface)}
.kf-why-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.1rem}
.kf-why-card{background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:22px;padding:1.6rem;box-shadow:0 1px 2px rgba(7,32,46,.04),0 8px 24px -8px rgba(7,32,46,.1);transition:transform .3s ${EASE},box-shadow .3s ${EASE}}
.kf-why-card:hover{transform:translateY(-4px);box-shadow:0 2px 4px rgba(7,32,46,.06),0 16px 40px -12px rgba(7,32,46,.22)}
.kf-why-ic{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,var(--kf-accentLight),var(--kf-accent));color:#fff;margin-bottom:1rem}
.kf-why-ic svg{width:23px;height:23px}
.kf-why-card.kf-accent .kf-why-ic{background:linear-gradient(135deg,var(--kf-pop),var(--kf-popDeep));color:var(--kf-ink)}
.kf-why-title{font-size:1.08rem;font-weight:700;margin-bottom:.45rem}
.kf-why-desc{font-size:.88rem;color:var(--kf-muted);line-height:1.6}
@media(max-width:920px){.kf-why-grid{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.kf-why-grid{grid-template-columns:1fr}}

/* BOOKING — wizard native */
.kf-booking{background:var(--kf-bg2)}

/* STATEMENT */
.kf-statement{padding:clamp(3.2rem,6vw,5rem) 7vw;background:var(--kf-surface)}
.kf-stmt-inner{position:relative;max-width:62ch;margin:0 auto;background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:24px;padding:clamp(2.2rem,5vw,3.2rem);text-align:center;box-shadow:0 18px 44px -22px var(--kf-shadow);overflow:hidden}
.kf-stmt-arc{position:absolute;left:50%;top:-30px;transform:translateX(-50%);width:200px;height:90px;opacity:.5}
.kf-stmt-ew{font-family:${f.display};font-size:.74rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--kf-accentDeep);margin-bottom:1rem}
.kf-stmt-quote{font-family:${f.display};font-size:clamp(1.3rem,2.6vw,1.9rem);font-weight:700;color:var(--kf-ink);line-height:1.35;letter-spacing:-.015em}
.kf-stmt-cite{display:block;font-size:.82rem;color:var(--kf-muted);font-weight:600;margin-top:1.1rem}

/* ABOUT + CABANG (band bg lembut) */
.kf-about{background:var(--kf-bg)}
.kf-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:center}
.kf-about-inner.kf-about-solo{grid-template-columns:1fr;max-width:62ch;margin:0 auto;text-align:center}
.kf-about-solo .kf-eyebrow{display:block}
.kf-about-solo .kf-about-body{margin-left:auto;margin-right:auto}
.kf-about-body{font-size:1.02rem;color:var(--kf-inkDim);line-height:1.85;margin-top:1rem;white-space:pre-line}
.kf-about-cta{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.5rem;font-family:${f.display};font-size:.92rem;font-weight:700;color:var(--kf-accentDeep);text-decoration:none;transition:gap .3s,color .3s}
.kf-about-cta:hover{gap:.8rem;color:var(--kf-ink)}
.kf-about-img{position:relative}
.kf-about-frame{position:relative;z-index:1;aspect-ratio:4/3;border-radius:24px;overflow:hidden;box-shadow:0 28px 60px -30px var(--kf-shadowDeep)}
.kf-about-frame img{width:100%;height:100%;object-fit:cover}
@media(max-width:840px){.kf-about-inner{grid-template-columns:1fr;gap:2.4rem}.kf-about-img{order:-1;max-width:420px;margin:0 auto}}

/* BUKTI — stats tiles + testimoni grid (mockup) */
.kf-bukti{background:var(--kf-surface)}
.kf-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:3rem}
.kf-stat{text-align:center;padding:1.75rem .75rem;border-radius:22px;background:var(--kf-bg);border:1px solid var(--kf-line)}
.kf-stat-num{font-family:${f.display};font-size:clamp(1.75rem,3.4vw,2.4rem);font-weight:800;color:var(--kf-accent);line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.kf-stat-label{font-size:.82rem;color:var(--kf-muted);font-weight:600;margin-top:.6rem}
.kf-quote-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
.kf-quote{background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:24px;padding:1.75rem;box-shadow:0 1px 2px rgba(7,32,46,.04),0 8px 24px -8px rgba(7,32,46,.1);display:flex;flex-direction:column;gap:1rem}
.kf-quote p{font-size:.94rem;color:var(--kf-ink);line-height:1.7;flex:1}
.kf-quote-who{display:flex;align-items:center;gap:.75rem}
.kf-quote-av{width:42px;height:42px;border-radius:999px;display:grid;place-items:center;font-family:${f.display};font-weight:700;color:#fff;font-size:.94rem;flex:none}
.kf-quote-nm{font-family:${f.display};font-weight:700;font-size:.9rem;color:var(--kf-ink)}
.kf-quote-role{font-size:.76rem;color:var(--kf-muted);font-weight:600;margin-top:.1rem}
@media(max-width:940px){.kf-stats-grid{grid-template-columns:1fr 1fr}.kf-quote-grid{grid-template-columns:1fr}}

/* FAQ */
.kf-faq{background:var(--kf-bg)}
.kf-faq-wrap{max-width:720px;margin:0 auto}
.kf-faq-item{background:var(--kf-surface);border:1px solid var(--kf-line);border-radius:18px;margin-bottom:.7rem;overflow:hidden;box-shadow:0 1px 2px rgba(7,32,46,.04),0 8px 24px -8px rgba(7,32,46,.1)}
.kf-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;min-height:44px;padding:1.2rem 1.5rem;cursor:pointer;font-family:${f.display};font-size:.98rem;font-weight:700;color:var(--kf-ink);background:none;border:none;text-align:left;transition:background .25s ${EASE}}
.kf-faq-q:hover{background:var(--kf-bg)}
.kf-faq-pl{flex:none;width:24px;height:24px;border-radius:50%;background:var(--kf-bg2);color:var(--kf-accent);display:grid;place-items:center;transition:transform .25s ${EASE}}
.kf-faq-pl svg{width:14px;height:14px}
.kf-faq-pl.open{transform:rotate(45deg)}
.kf-faq-a{font-size:.94rem;color:var(--kf-inkDim);line-height:1.75;padding:0 1.5rem 1.3rem;max-width:64ch}

/* CTA — band teal rounded (mockup) */
.kf-cta{background:var(--kf-bg);padding:clamp(3rem,6vw,5rem) 7vw}
.kf-cta-inner{position:relative;background:linear-gradient(140deg,var(--kf-accent) 0%,var(--kf-accentDeep) 60%,#07364F 100%);color:#fff;text-align:center;border-radius:40px;padding:clamp(3rem,6vw,4.5rem) clamp(1.5rem,5vw,2.5rem);overflow:hidden}
.kf-cta-inner::before{content:'';position:absolute;inset:0;background:radial-gradient(600px 300px at 80% 20%,rgba(243,156,18,.28),transparent 60%);pointer-events:none}
.kf-cta-title{position:relative;font-size:clamp(1.9rem,4.4vw,2.85rem);font-weight:800;color:#fff;line-height:1.14;letter-spacing:-.02em;text-wrap:balance}
.kf-cta-sub{position:relative;font-size:1.05rem;color:rgba(255,255,255,.88);margin:.9rem auto 2rem;max-width:30em;line-height:1.7}
.kf-cta-btns{position:relative;display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}
.kf-cta .kf-btn-ghost{background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.3);box-shadow:none;backdrop-filter:blur(4px)}
.kf-cta .kf-btn-ghost:hover{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.5)}

/* BAND ADD-ON */
.kf-band{background:var(--kf-surface);border-top:1px solid var(--kf-line);border-bottom:1px solid var(--kf-line);padding:3.2rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.4rem}
.kf-band-ew{font-family:${f.display};font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--kf-accentDeep);margin-bottom:.5rem}
.kf-band .kf-heading{font-size:clamp(1.5rem,2.4vw,2rem)}
.kf-band-sub{color:var(--kf-muted);font-size:.95rem;line-height:1.6;margin-top:.5rem;max-width:56ch}

/* FOOTER (mockup) */
.kf-footer{background:var(--kf-dark);color:#AFC5D1;padding:4rem 7vw 2.4rem}
.kf-footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:2.6rem;margin-bottom:2.75rem}
.kf-footer-brand{display:inline-flex;align-items:center;gap:.6rem;font-family:${f.display};font-size:1.05rem;font-weight:800;color:#fff;margin-bottom:1rem;text-decoration:none}
.kf-footer-brand b{color:#8FD4F5;font-weight:800}
.kf-footer-tagline{font-size:.9rem;color:#AFC5D1;line-height:1.7;max-width:36ch}
.kf-footer-h{font-family:${f.display};font-size:.76rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;margin-bottom:1rem}
.kf-footer-link{display:block;font-size:.9rem;color:#AFC5D1;text-decoration:none;margin-bottom:.55rem;transition:color .25s;font-variant-numeric:tabular-nums}
.kf-footer-link:hover{color:#fff}
.kf-footer-copy{border-top:1px solid rgba(255,255,255,.1);padding-top:1.5rem;font-size:.8rem;color:#7E99A8;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}
@media(max-width:768px){.kf-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* FLOATING WHATSAPP */
.kf-wafloat{position:fixed;right:20px;bottom:20px;z-index:999;width:56px;height:56px;border-radius:50%;background:#25D366;display:grid;place-items:center;box-shadow:0 10px 28px -8px rgba(37,211,102,.6);transition:transform .3s ${SPRING}}
.kf-wafloat:hover{transform:scale(1.1)}
.kf-wafloat svg{width:30px;height:30px;color:#fff}

/* REVEAL — via LUX_JS (.lx-reveal → .lx-in), digate .lx-js (kontrak no-JS #138) */
.lx-js .kf-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ${EASE},transform .7s ${EASE}}
.lx-js .kf-rv.lx-in{opacity:1;transform:none}
.kf-rv-d1{transition-delay:.08s}.kf-rv-d2{transition-delay:.16s}.kf-rv-d3{transition-delay:.24s}.kf-rv-d4{transition-delay:.32s}

/* LIGHTBOX — kf-root overrides palet lx-lb */
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

/* RASA polish */
.kf-btn:focus-visible,.kf-nav-links a:focus-visible,.kf-about-cta:focus-visible,.kf-footer-link:focus-visible,.kf-svc:focus-visible,.kf-faq-q:focus-visible,.kf-wafloat:focus-visible{outline:3px solid var(--kf-accentLight);outline-offset:3px}
.kf-svc:active{transform:translateY(-2px)}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Ikon layanan (kf-svc) — diputar siklis. Lucide-style inline.
const SVC_ICONS = [
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 3v6a6 6 0 0 0 12 0V3" /><path d="M6 21v-4a6 6 0 0 1 12 0v4" /></svg>,
  <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3v18M5 8l7-5 7 5M7 21h10" /></svg>,
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 4a3 3 0 0 1 3 3c0 1.5-1 2.5-2 3.5s-1 2-1 3.5m0 3v.5M4 12c2-5 6-8 8-8s6 3 8 8" /></svg>,
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M7 20v-6a5 5 0 0 1 10 0v6M12 3v2m6.4.6-1.4 1.4M5.6 5.6 7 7" /></svg>,
  <svg key="e" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 15c3-2 5-6 8-6s5 4 8 6M6 19h12" /></svg>,
  <svg key="f" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M8 4h8v6a4 4 0 0 1-8 0V4Zm4 10v6m-4 0h8" /></svg>,
]

// Ikon kenapa-kami (kf-why). Lucide-style inline.
const WHY_ICONS = [
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 3v6a6 6 0 0 0 12 0V3" /><path d="M6 21v-4a6 6 0 0 1 12 0v4" /></svg>,
  <svg key="b" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.5 7 .6-5.3 4.6L18.2 21 12 17.3 5.8 21l1.5-7.3L2 9.1l7-.6L12 2Z" /></svg>,
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
]

// Jalur pemulihan bernomor — 3 langkah; copy dari mockup redesign 2026-07-12.
// Belum di-slot: butuh array objek {title,desc}; ThemeCopyPanel belum punya
// editor item-array objek — follow-up saat editor itu dibangun.
const RECOVERY_STEPS = [
  { title: 'Asesmen & Diagnosa Gerak', desc: 'Fisioterapis memeriksa pola gerak, kekuatan, dan riwayat cederamu — supaya tahu persis apa yang diperbaiki.' },
  { title: 'Terapi Terarah', desc: 'Kombinasi terapi manual, latihan, dan modalitas — disusun khusus untuk kondisimu, dievaluasi tiap sesi.' },
  { title: 'Program Latihan Mandiri', desc: 'Kamu pulang dengan program latihan yang jelas, supaya hasil terapi bertahan dan cedera tidak kambuh.' },
]

// Avatar fallback — warna selang-seling teal/oranye/deep.
const AV_COLORS = ['#1B9CD8', '#F39C12', '#0B6E96']
function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'P'
}

// Wordmark: kata terakhir diberi warna aksen (mockup "KAMY <Physio>").
function BrandName({ nama }: { nama: string }) {
  const words = nama.trim().split(/\s+/)
  if (words.length < 2) return <>{nama}</>
  const last = words.pop()!
  return <>{words.join(' ')} <b>{last}</b></>
}

// Judul hero: potongan `em` (slot copy.hero_em) dibungkus <em> ber-underline
// oranye. Hanya match di BATAS KATA (hindari "ber[gerak bebas]" ter-sorot
// separuh kata); tak ketemu → judul apa adanya.
function HeroTitle({ title, em }: { title: string; em: string }) {
  let i = -1
  if (em) {
    let from = 0
    while (from <= title.length - em.length) {
      const j = title.indexOf(em, from)
      if (j < 0) break
      const before = j === 0 ? '' : title[j - 1]
      const after = title[j + em.length] ?? ''
      if (!/[a-zA-Z]/.test(before) && !/[a-zA-Z]/.test(after)) { i = j; break }
      from = j + 1
    }
  }
  if (i < 0) return <h1 className="kf-hero-title">{title}</h1>
  return (
    <h1 className="kf-hero-title">
      {title.slice(0, i)}<em>{title.slice(i, i + em.length)}</em>{title.slice(i + em.length)}
    </h1>
  )
}

export default function KlinikFisioRenderer({ content: c, variant = 'gerak', bookingSlug, font }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.gerak
  const f = font ?? DEFAULT_FONT
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Copy khas-tema (slot manifest) — editan klien dari portal "Konten Tema".
  const cp = copyGetter(c.themeCopy, KLINIK_FISIO_SLOTS)

  const wa = c.contact?.wa
  const waUrl = wa ? `https://wa.me/${wa}` : '#konsultasi'
  // Booking aktif → CTA utama ke #jadwal (papan ketersediaan live di bawah
  // hero, berisi CTA lanjut ke #booking); WA tetap sekunder + floating.
  const booking = !!bookingSlug
  const primaryHref = booking ? '#jadwal' : (c.hero?.ctaHref ?? waUrl)
  const hero = c.hero ?? {}
  const items = c.showcase?.items ?? []
  const features = c.features ?? []
  const stats = c.stats ?? []
  const testimonials = c.testimonials ?? []
  const faqs = c.faq ?? []
  const jamRows = c.info?.jam ?? []
  const jamSingkat = jamRows[0]?.jam ?? cp.t('copy.jam_fallback')
  const keluhanItems = cp.list('copy.keluhan_items')

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

  // Rating utk trust strip & kartu mengambang — dari stats bila ada.
  const ratingStat = stats.find((s) => /^[0-9][.,][0-9]/.test(s.angka))?.angka ?? '5,0'
  // Stat non-rating pertama utk trust row ("1.000+ pasien ditangani").
  const trustStat = stats.find((s) => !/^[0-9][.,][0-9]/.test(s.angka))

  const nama = c.nama ?? 'Klinik Fisio'

  return (
    <div className="kf-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: kfCss(f) }} />

      {/* NAV — sticky putih blur + link seksi (mockup) */}
      <nav className="kf-nav" aria-label="Navigasi utama">
        <div className="kf-nav-in">
          <a className="kf-nav-logo" href="#beranda" aria-label={`${nama} — beranda`}>
            <LogoMark /><span><BrandName nama={nama} /></span>
          </a>
          <ul className="kf-nav-links">
            {booking && <li><a href="#jadwal">Jadwal</a></li>}
            {items.length > 0 && <li><a href="#layanan">Layanan</a></li>}
            {booking && <li><a href="#terapis">Terapis</a></li>}
            {booking && <li><a href="#cabang">Cabang</a></li>}
            {faqs.length > 0 && <li><a href="#faq">FAQ</a></li>}
          </ul>
          {booking
            ? <a href="#booking" className="kf-btn kf-btn-teal" data-edit="copy.booking_cta">{cp.t('copy.booking_cta')}</a>
            : <a href={waUrl} className="kf-btn kf-btn-teal" data-edit="copy.wa_cta"><IconWa />{cp.t('copy.wa_cta')}</a>}
        </div>
      </nav>

      {/* HERO — asimetris: copy kiri + kartu visual ber-quote kanan (mockup) */}
      <section className="kf-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="kf-hero-grid">
          <div className="kf-hero-text">
            {hero.eyebrow && <span className="kf-eyebrow">{hero.eyebrow}</span>}
            {hero.title && <HeroTitle title={hero.title} em={cp.t('copy.hero_em')} />}
            {hero.subtitle && <p className="kf-hero-sub">{hero.subtitle}</p>}
            <div className="kf-hero-cta">
              {booking
                ? <a href={primaryHref} className="kf-btn kf-btn-pop" data-edit="copy.hero_booking_cta">{cp.t('copy.hero_booking_cta')}</a>
                : <a href={primaryHref} className="kf-btn kf-btn-pop" data-edit="copy.hero_cta"><IconWa />{hero.ctaText ?? cp.t('copy.hero_cta')}</a>}
              {booking
                ? <a href={waUrl} className="kf-btn kf-btn-ghost" data-edit="copy.wa_cta"><IconWa />{cp.t('copy.wa_cta')}</a>
                : <a href={hero.ctaHref2 ?? '#layanan'} className="kf-btn kf-btn-ghost" data-edit="copy.hero_cta2">{cp.t('copy.hero_cta2')}</a>}
            </div>
            <p className="kf-hero-micro" data-edit="copy.hero_micro">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              {cp.t('copy.hero_micro')}
            </p>
            <div className="kf-trust">
              <span>
                <span className="kf-trust-stars" aria-label={`Rating ${ratingStat} dari 5`}>{[0, 1, 2, 3, 4].map((i) => <IconStar key={i} />)}</span>
                <b>{ratingStat}</b> · <span data-edit="copy.trust_reviews">{cp.t('copy.trust_reviews')}</span>
              </span>
              {trustStat && <span><b>{trustStat.angka}</b> {trustStat.label}</span>}
            </div>
          </div>

          <div className="kf-hero-visual kf-rv lx-reveal">
            <div className="kf-hero-card">
              {hero.image && (
                <img
                  src={hero.image}
                  alt={nama}
                  loading="eager"
                  style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
                />
              )}
              <span className="kf-hero-chip" data-edit="copy.hero_chip">{cp.t('copy.hero_chip')}</span>
              <p className="kf-hero-quote">
                <span data-edit="copy.hero_quote_1">{cp.t('copy.hero_quote_1')}</span><br />
                <span className="kf-q2" data-edit="copy.hero_quote_2">{cp.t('copy.hero_quote_2')}</span>
              </p>
              <span className="kf-hero-arcwrap"><MotionArc /></span>
            </div>
            {booking
              ? <KlinikFisioLiveCard slug={bookingSlug!} />
              : (
                <>
                  <div className="kf-float-card">
                    <div className="kf-float-ring"><i>{ratingStat}</i></div>
                    <div><b data-edit="copy.float_rating_prefix">{cp.t('copy.float_rating_prefix')} {ratingStat} {cp.t('copy.float_rating_suffix')}</b><small data-edit="copy.float_rating_sub">{cp.t('copy.float_rating_sub')}</small></div>
                  </div>
                  <div className="kf-float-badge" data-edit="copy.badge_open"><span className="kf-dot" aria-hidden /> {cp.t('copy.badge_open')} · {jamSingkat}</div>
                </>
              )}
          </div>
        </div>
      </section>

      {/* JADWAL REALTIME — papan gelap signature (hanya bila booking aktif) */}
      {booking && (
        <section className="kf-section kf-board" id="jadwal" aria-label="Jadwal dan ketersediaan terapis">
          <KlinikFisioJadwal
            slug={bookingSlug!}
            copy={{
              eyebrow: cp.t('copy.jadwal_eyebrow'),
              title: cp.t('copy.jadwal_title'),
              sub: cp.t('copy.jadwal_sub'),
              weekTitle: cp.t('copy.jadwal_week_title'),
              note: cp.t('copy.jadwal_note'),
            }}
          />
        </section>
      )}

      {/* BOOKING — wizard native realtime (persis di bawah papan jadwal) */}
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

      {/* KELUHAN — pill cloud terpusat (mockup) */}
      {keluhanItems.length > 0 && (
        <section className="kf-section kf-keluhan" id="keluhan">
          <div className="kf-sec-hdr kf-center kf-rv lx-reveal" style={{ marginBottom: '1.75rem' }}>
            <span className="kf-eyebrow" data-edit="copy.keluhan_eyebrow">{cp.t('copy.keluhan_eyebrow')}</span>
            <h2 className="kf-heading" data-edit="copy.keluhan_title">{cp.t('copy.keluhan_title')}</h2>
          </div>
          <div className="kf-pills kf-rv lx-reveal" aria-label="Daftar keluhan yang ditangani" data-edit="copy.keluhan_items">
            {keluhanItems.map((k, i) => <span key={i} className="kf-pill">{k}</span>)}
          </div>
        </section>
      )}

      {/* LAYANAN — kartu ber-ikon + quick-look (mockup) */}
      {items.length > 0 && (
        <section className="kf-section kf-layanan" id="layanan">
          <div className="kf-sec-hdr kf-rv lx-reveal">
            <span className="kf-eyebrow" data-edit="copy.layanan_eyebrow">{cp.t('copy.layanan_eyebrow')}</span>
            <h2 className="kf-heading" data-edit="copy.layanan_title">{cp.t('copy.layanan_title')}</h2>
            <p className="kf-subtext" data-edit="copy.layanan_sub">{cp.t('copy.layanan_sub')}</p>
          </div>
          <div className="kf-grid lx-look" data-count={items.length}>
            {items.map((item, i) => (
              <article
                key={i}
                className="kf-svc lx-lb-open kf-rv lx-reveal"
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
                {item.kategori && <span className="kf-svc-cat">{item.kategori}</span>}
                <span className="kf-svc-ico">{SVC_ICONS[i % SVC_ICONS.length]}</span>
                <h3>{item.nama}</h3>
                {item.desc && <p>{item.desc}</p>}
                <div className="kf-svc-meta">
                  <span className={typeof item.harga === 'number' && item.harga > 0 ? 'kf-svc-price' : 'kf-svc-price-soft'}>{priceText(item.harga)}</span>
                  {typeof item.durasi === 'number' && item.durasi > 0 && (
                    <span className="kf-svc-dur">{item.durasi} {cp.t('copy.durasi_suffix')}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* RECOVERY TRACK — 3 kartu bernomor + konektor (mockup) */}
      <section className="kf-section kf-track-sec" id="cara">
        <div className="kf-sec-hdr kf-rv lx-reveal">
          <span className="kf-eyebrow" data-edit="copy.steps_eyebrow">{cp.t('copy.steps_eyebrow')}</span>
          <h2 className="kf-heading" data-edit="copy.steps_title">{cp.t('copy.steps_title')}</h2>
          <p className="kf-subtext" data-edit="copy.steps_sub">{cp.t('copy.steps_sub')}</p>
        </div>
        <div className="kf-track">
          {RECOVERY_STEPS.map((s, i) => (
            <article key={i} className={`kf-step kf-rv lx-reveal kf-rv-d${i + 1}`}>
              <span className="kf-step-n" aria-hidden>{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* WHY — kenapa kami */}
      {features.length > 0 && (
        <section className="kf-section kf-why" id="kenapa">
          <div className="kf-sec-hdr kf-rv lx-reveal">
            <span className="kf-eyebrow" data-edit="copy.features_eyebrow">{c.featuresEyebrow ?? cp.t('copy.features_eyebrow')}</span>
            {c.featuresTitle && <h2 className="kf-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="kf-why-grid">
            {features.slice(0, 4).map((ft, i) => (
              <div key={i} className={`kf-why-card kf-rv lx-reveal kf-rv-d${i + 1}${i === 1 ? ' kf-accent' : ''}`}>
                <div className="kf-why-ic">{WHY_ICONS[i % WHY_ICONS.length]}</div>
                <h3 className="kf-why-title">{ft.title}</h3>
                <p className="kf-why-desc">{ft.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TERAPIS — profil dari Portal Klinik (hanya bila booking aktif) */}
      {booking && (
        <section className="kf-section" id="terapis" aria-label="Tim fisioterapis">
          <KlinikFisioTerapis
            slug={bookingSlug!}
            copy={{
              eyebrow: cp.t('copy.terapis_eyebrow'),
              title: cp.t('copy.terapis_title'),
              sub: cp.t('copy.terapis_sub'),
            }}
          />
        </section>
      )}

      {/* CABANG — lokasi dari Portal Klinik (hanya bila booking aktif) */}
      {booking && (
        <section className="kf-section kf-about" id="cabang" aria-label="Daftar cabang">
          <KlinikFisioCabang
            slug={bookingSlug!}
            copy={{
              eyebrow: cp.t('copy.cabang_eyebrow'),
              title: cp.t('copy.cabang_title'),
              sub: cp.t('copy.cabang_sub'),
            }}
          />
        </section>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="kf-section kf-about" id="tentang" style={booking ? { paddingTop: 0 } : undefined}>
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

      {/* BUKTI — stats tiles + testimoni grid (mockup) */}
      {(stats.length > 0 || testimonials.length > 0) && (
        <section className="kf-section kf-bukti" id="ulasan">
          <div className="kf-sec-hdr kf-center kf-rv lx-reveal">
            <span className="kf-eyebrow" data-edit="copy.ulasan_eyebrow">{cp.t('copy.ulasan_eyebrow')}</span>
            <h2 className="kf-heading" data-edit="copy.ulasan_title">{cp.t('copy.ulasan_title')}</h2>
            {testimonials.length > 0 && (
              <p className="kf-mocklabel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
                Contoh untuk mockup — ganti dengan testimoni asli (izin pasien)
              </p>
            )}
          </div>
          {stats.length > 0 && (
            <div className="kf-stats-grid">
              {stats.map((s, i) => (
                <div key={i} className={`kf-stat kf-rv lx-reveal kf-rv-d${i + 1}`}>
                  <div className="kf-stat-num" data-cu>{s.angka}</div>
                  <div className="kf-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}
          {testimonials.length > 0 && (
            <div className="kf-quote-grid">
              {testimonials.map((t, i) => (
                <figure key={i} className={`kf-quote kf-rv lx-reveal kf-rv-d${(i % 3) + 1}`}>
                  <p>“{t.quote}”</p>
                  <figcaption className="kf-quote-who">
                    <span className="kf-quote-av" style={{ background: AV_COLORS[i % AV_COLORS.length] }} aria-hidden>{initials(t.nama)}</span>
                    <span>
                      <span className="kf-quote-nm">{t.nama}</span>
                      {t.peran && <span className="kf-quote-role" style={{ display: 'block' }}>{t.peran}</span>}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      )}

      {/* STATEMENT */}
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

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="kf-section kf-faq" id="faq">
          <div className="kf-sec-hdr kf-center kf-rv lx-reveal">
            <span className="kf-eyebrow" data-edit="copy.faq_eyebrow">{cp.t('copy.faq_eyebrow')}</span>
            <h2 className="kf-heading" data-edit="copy.faq_title">{cp.t('copy.faq_title')}</h2>
          </div>
          <div className="kf-faq-wrap">
            {faqs.map((q, i) => (
              <div key={i} className="kf-faq-item">
                <button
                  className="kf-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{q.q}</span>
                  <span className={`kf-faq-pl${openFaq === i ? ' open' : ''}`} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
                {openFaq === i && <p className="kf-faq-a">{q.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA — band teal rounded (mockup) */}
      {c.cta && (
        <section className="kf-cta" id="konsultasi">
          <div className="kf-cta-inner kf-rv lx-reveal">
            <h2 className="kf-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="kf-cta-sub">{c.cta.subtitle}</p>}
            <div className="kf-cta-btns">
              {booking
                ? <><a href="#jadwal" className="kf-btn kf-btn-pop" data-edit="copy.hero_booking_cta">{cp.t('copy.hero_booking_cta')}</a>
                    <a href={waUrl} className="kf-btn kf-btn-ghost" data-edit="copy.cta_wa"><IconWa />{cp.t('copy.cta_wa')}</a></>
                : <><a href={waUrl} className="kf-btn kf-btn-pop" data-edit="copy.cta_wa"><IconWa />{c.cta.ctaText ?? cp.t('copy.cta_wa')}</a>
                    <a href="#layanan" className="kf-btn kf-btn-ghost" data-edit="copy.hero_cta2">{cp.t('copy.hero_cta2')}</a></>}
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
          {b.ctaText && <a className="kf-btn kf-btn-pop" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER (mockup: brand+desc | jam+kontak | menu) */}
      <footer className="kf-footer">
        <div className="kf-footer-grid">
          <div>
            <a className="kf-footer-brand" href="#beranda"><LogoMark /><span><BrandName nama={nama} /></span></a>
            <p className="kf-footer-tagline" data-edit="copy.footer_tagline">
              {hero.eyebrow ?? `${nama} — ${cp.t('copy.footer_desc')}`} {cp.t('copy.footer_tagline')}
            </p>
          </div>
          <div>
            <p className="kf-footer-h" data-edit="copy.footer_jam_h">{cp.t('copy.footer_jam_h')}</p>
            {jamRows.length
              ? jamRows.map((j, i) => <p key={i} className="kf-footer-link">{j.hari}: {j.jam}</p>)
              : <p className="kf-footer-link" data-edit="copy.footer_jam_fallback">{cp.t('copy.footer_jam_fallback')}</p>}
            <p className="kf-footer-h" style={{ marginTop: '1.5rem' }} data-edit="copy.footer_kontak_h">{cp.t('copy.footer_kontak_h')}</p>
            {wa && <a href={waUrl} className="kf-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="kf-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="kf-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="kf-footer-h">Menu</p>
            {booking && <a href="#jadwal" className="kf-footer-link">Jadwal &amp; Booking</a>}
            {items.length > 0 && <a href="#layanan" className="kf-footer-link">Layanan</a>}
            {booking && <a href="#terapis" className="kf-footer-link">Terapis</a>}
            {booking && <a href="#cabang" className="kf-footer-link">Cabang</a>}
            {faqs.length > 0 && <a href="#faq" className="kf-footer-link">FAQ</a>}
          </div>
        </div>
        <p className="kf-footer-copy">
          <span data-edit="copy.footer_copyright">© {new Date().getFullYear()} {nama}. {cp.t('copy.footer_copyright')}</span>
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
