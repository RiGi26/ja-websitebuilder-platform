'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// ONYX — Toko Elektronik / Gadget Bespoke Lux Renderer
// Space Grotesk (display) + IBM Plex Sans (body) + IBM Plex Mono (spec) |
// Onyx #0A0E14 · Surface #131B25 · Cyan #22D3EE | signature: blueprint GRID
// + spec-readout HUD (kartu mono ber-corner-bracket + garis sirkuit) +
// device-frame ber-scanline | ns: gd-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.gd-*`.
// Dark-tech-electric — sengaja kontras dengan tema bespoke lain (heritage/glow).
// ============================================================

export interface GdPal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentDeep: string; onAccent: string
  glow: string; grid: string; line: string; line2: string; scrim: string
}

export const PALETTES: Record<string, GdPal> = {
  // Onyx — near-black biru, kaca gelap, cyan elektrik + grid teknis.
  onyx: {
    bg: '#0A0E14', bg2: '#0D131B', surface: '#131B25', surface2: '#0F1721',
    ink: '#E8EEF4', inkDim: '#A6B5C4', muted: '#8294A6',
    accent: '#22D3EE', accentDeep: '#0AA5C2', onAccent: '#04161C',
    glow: 'rgba(34,211,238,.30)', grid: 'rgba(150,180,205,.08)',
    line: 'rgba(165,195,220,.14)', line2: 'rgba(165,195,220,.07)', scrim: '#06090E',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap'
const DISPLAY = '"Space Grotesk","Segoe UI",sans-serif'
const BODY = '"IBM Plex Sans","Helvetica Neue",sans-serif'
const MONO = '"IBM Plex Mono","SFMono-Regular",ui-monospace,monospace'
const EASE = 'cubic-bezier(.16,1,.3,1)'

function gdCss(): string {
  return `
@import url('${FONT_IMPORT}');
/* Guard tingkat-dokumen: grid ber-vw + frame tak boleh memicu scroll horizontal
   (satu tema per halaman → aman set di html/body). */
html,body{overflow-x:hidden;max-width:100%}
.gd-root{font-family:${BODY};color:var(--gd-ink);background:var(--gd-bg);line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden;max-width:100%}
.gd-root *,.gd-root *::before,.gd-root *::after{box-sizing:border-box;margin:0;padding:0}
.gd-root img{max-width:100%;height:auto;display:block}
.gd-root ::selection{background:rgba(34,211,238,.25);color:var(--gd-ink)}
.gd-mono{font-family:${MONO};font-feature-settings:"tnum" 1}

/* NAV */
.gd-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.1rem 6vw;display:flex;align-items:center;justify-content:space-between;transition:background .4s,box-shadow .4s,backdrop-filter .4s}
.gd-root.lx-scrolled .gd-nav{background:rgba(10,14,20,.78);backdrop-filter:blur(12px);box-shadow:0 1px 0 var(--gd-line)}
.gd-nav-logo{font-family:${DISPLAY};font-weight:600;letter-spacing:.04em;color:var(--gd-ink);font-size:1.3rem;text-decoration:none;display:flex;align-items:center;gap:.55rem}
.gd-nav-logo::before{content:'';width:9px;height:9px;border-radius:2px;background:var(--gd-accent);box-shadow:0 0 12px var(--gd-glow)}
.gd-nav-cta{font-family:${MONO};font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--gd-onAccent);background:var(--gd-accent);padding:.7rem 1.3rem;border-radius:8px;text-decoration:none;transition:transform .25s ${EASE},box-shadow .25s}
.gd-nav-cta:hover{transform:translateY(-2px);box-shadow:0 10px 26px var(--gd-glow)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:140px;opacity:0;pointer-events:none}

/* HERO — blueprint grid gelap + device-frame ber-scanline */
.gd-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:53% 47%;align-items:center;padding:7rem 6vw 4rem;overflow:hidden;background:var(--gd-bg)}
.gd-hero::before{content:'';position:absolute;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(var(--gd-grid) 1px,transparent 1px),linear-gradient(90deg,var(--gd-grid) 1px,transparent 1px);background-size:46px 46px;-webkit-mask-image:radial-gradient(ellipse 80% 75% at 60% 35%,#000 35%,transparent 80%);mask-image:radial-gradient(ellipse 80% 75% at 60% 35%,#000 35%,transparent 80%)}
.gd-hero::after{content:'';position:absolute;top:-12%;right:-8%;width:55vw;height:55vw;max-width:680px;max-height:680px;border-radius:50%;background:radial-gradient(circle at 50% 50%,var(--gd-glow),transparent 66%);filter:blur(14px);z-index:0;pointer-events:none;opacity:.7}
.gd-hero-text{position:relative;z-index:2;padding-right:2rem}
.gd-hero-ew{font-family:${MONO};font-size:.72rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--gd-accent);margin-bottom:1.35rem;display:inline-flex;align-items:center;gap:.6rem}
.gd-hero-ew::before{content:'';width:1.8rem;height:1px;background:var(--gd-accent);opacity:.7}
.gd-hero-title{font-family:${DISPLAY};font-size:clamp(2.6rem,5.6vw,4.7rem);font-weight:600;line-height:1.04;color:var(--gd-ink);margin-bottom:1.4rem;letter-spacing:-.015em}
.gd-hero-title span{display:inline;opacity:1}
@media(prefers-reduced-motion:no-preference){.gd-hero-title span{animation:gdRise .7s ${EASE} both;animation-delay:var(--gd-d,0ms)}}
@keyframes gdRise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.gd-hero-title em{font-style:normal;color:var(--gd-accent)}
.gd-hero-sub{font-size:1.05rem;color:var(--gd-inkDim);margin-bottom:2rem;max-width:44ch;line-height:1.8}
.gd-hero-btns{display:flex;gap:.85rem;flex-wrap:wrap;margin-bottom:2.1rem}
.gd-btn-primary{font-family:${MONO};font-size:.78rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;background:var(--gd-accent);color:var(--gd-onAccent);padding:.95rem 1.9rem;border-radius:9px;text-decoration:none;transition:transform .25s ${EASE},box-shadow .25s}
.gd-btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 32px var(--gd-glow)}
.gd-btn-ghost{font-family:${MONO};font-size:.78rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--gd-line);color:var(--gd-ink);padding:.95rem 1.9rem;border-radius:9px;text-decoration:none;transition:border-color .25s,background .25s,color .25s}
.gd-btn-ghost:hover{border-color:var(--gd-accent);color:var(--gd-accent);background:rgba(34,211,238,.06)}
/* Hero spec-strip — chip mono key/value dari stats (data klien, bukan klaim hardcoded) */
.gd-hero-spec{display:flex;flex-wrap:wrap;gap:.5rem}
.gd-spec-chip{display:flex;align-items:center;gap:.5rem;font-family:${MONO};font-size:.72rem;color:var(--gd-inkDim);border:1px solid var(--gd-line);border-radius:7px;padding:.5rem .8rem;background:var(--gd-surface2)}
.gd-spec-chip b{color:var(--gd-accent);font-weight:600}
.gd-hero-media{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;padding:1rem}
.gd-hero-frame{position:relative;width:100%;max-width:430px;aspect-ratio:4/5;border-radius:16px;overflow:hidden;background:var(--gd-surface);border:1px solid var(--gd-line);box-shadow:0 40px 100px rgba(0,0,0,.55)}
.gd-hero-frame img{width:100%;height:100%;object-fit:cover}
/* corner brackets */
.gd-hero-frame::before,.gd-hero-frame::after{content:'';position:absolute;width:26px;height:26px;z-index:3;pointer-events:none;border:2px solid var(--gd-accent)}
.gd-hero-frame::before{top:12px;left:12px;border-right:0;border-bottom:0;border-radius:4px 0 0 0}
.gd-hero-frame::after{bottom:12px;right:12px;border-left:0;border-top:0;border-radius:0 0 4px 0}
/* scanline — hanya motion-OK; base/reduced = tak ada */
.gd-scan{position:absolute;left:0;right:0;top:0;height:2px;z-index:2;pointer-events:none;background:linear-gradient(90deg,transparent,var(--gd-accent),transparent);opacity:0}
@media(prefers-reduced-motion:no-preference){.gd-scan{animation:gdScan 4.5s ${EASE} infinite}}
@keyframes gdScan{0%{top:0;opacity:0}12%{opacity:.9}88%{opacity:.9}100%{top:100%;opacity:0}}
.gd-hero-badge{position:absolute;bottom:1rem;left:-1rem;z-index:4;display:flex;align-items:center;gap:.55rem;font-family:${MONO};font-size:.74rem;color:var(--gd-ink);background:var(--gd-surface);border:1px solid var(--gd-line);padding:.6rem 1rem;border-radius:9px;box-shadow:0 14px 34px rgba(0,0,0,.5)}
.gd-hero-badge b{color:var(--gd-accent);font-weight:600;font-size:1rem}
.gd-hero-badge i{width:7px;height:7px;border-radius:50%;background:var(--gd-accent);box-shadow:0 0 10px var(--gd-glow)}
@media(prefers-reduced-motion:no-preference){.gd-hero-badge i{animation:gdPulse 2s ease-in-out infinite}}
@keyframes gdPulse{0%,100%{opacity:1}50%{opacity:.35}}
@media(max-width:768px){
  .gd-hero{grid-template-columns:1fr;min-height:unset;padding:6rem 6vw 3rem;text-align:center}
  .gd-hero-title{font-size:clamp(2rem,8vw,2.9rem)}
  .gd-hero-text{padding-right:0}
  .gd-hero-media{order:-1;padding:0 0 1.5rem}
  .gd-hero-frame{max-width:300px;aspect-ratio:1/1}
  .gd-hero-sub{margin-left:auto;margin-right:auto}
  .gd-hero-btns,.gd-hero-spec{justify-content:center}
  .gd-hero-ew{justify-content:center}
  .gd-hero-badge{left:50%;transform:translateX(-50%);bottom:.6rem}
}
@media(max-width:560px){.gd-nav{padding:1rem 5vw}.gd-nav-cta{padding:.6rem 1rem;font-size:.64rem}}

/* MARQUEE — pita teknis */
.gd-marquee{overflow:hidden;background:var(--gd-bg2);border-top:1px solid var(--gd-line2);border-bottom:1px solid var(--gd-line2);padding:.85rem 0}
.gd-mq-track{display:flex;animation:gd-scroll 32s linear infinite;width:max-content}
@media(prefers-reduced-motion:reduce){.gd-mq-track{animation:none}}
.gd-mq-track:hover{animation-play-state:paused}
.gd-mq-item{font-family:${MONO};font-size:.7rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--gd-muted);padding:0 2rem;white-space:nowrap;display:flex;align-items:center;gap:2rem}
.gd-mq-item::after{content:'';width:5px;height:5px;border-radius:1px;background:var(--gd-accent);opacity:.8}
@keyframes gd-scroll{to{transform:translateX(-50%)}}

/* SECTION COMMONS */
.gd-section{padding:clamp(4rem,8vw,7rem) 6vw}
.gd-eyebrow{font-family:${MONO};font-size:.72rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--gd-accent);margin-bottom:.85rem;display:inline-flex;align-items:center;gap:.55rem}
.gd-eyebrow::before{content:'';width:1.5rem;height:1px;background:var(--gd-accent);opacity:.7}
.gd-heading{font-family:${DISPLAY};font-size:clamp(1.9rem,3.4vw,3rem);font-weight:600;color:var(--gd-ink);line-height:1.12;letter-spacing:-.015em;text-wrap:balance}
.gd-subtext{color:var(--gd-muted);font-size:.98rem;margin-top:.9rem;max-width:56ch;line-height:1.8}
.gd-sec-hdr{margin-bottom:3.25rem;max-width:60ch}

/* SPEC — signature: kartu HUD mono ber-corner-bracket + garis sirkuit penghubung */
.gd-spec-sec{background:var(--gd-bg2)}
.gd-spec-grid{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem}
.gd-spec-grid::before{content:'';position:absolute;top:2.55rem;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,var(--gd-accentDeep),var(--gd-accent),var(--gd-accentDeep),transparent);opacity:.5}
.gd-spec-card{position:relative;background:var(--gd-surface);border:1px solid var(--gd-line);border-radius:12px;padding:1.6rem 1.35rem 1.5rem;transition:border-color .3s,transform .3s ${EASE},box-shadow .3s}
.gd-spec-card:hover{border-color:rgba(34,211,238,.4);transform:translateY(-4px);box-shadow:0 20px 44px rgba(0,0,0,.4)}
.gd-spec-card::before{content:'';position:absolute;top:9px;left:9px;width:16px;height:16px;border-top:2px solid var(--gd-accent);border-left:2px solid var(--gd-accent);border-radius:3px 0 0 0;opacity:.65}
.gd-spec-idx{position:relative;z-index:1;font-family:${MONO};font-size:.78rem;font-weight:600;color:var(--gd-accent);background:var(--gd-bg);border:1px solid var(--gd-line);width:2.7rem;height:2.7rem;display:flex;align-items:center;justify-content:center;border-radius:9px;margin-bottom:1.25rem}
.gd-spec-title{font-family:${DISPLAY};font-size:1.12rem;font-weight:600;color:var(--gd-ink);margin-bottom:.5rem;line-height:1.25}
.gd-spec-desc{font-size:.85rem;color:var(--gd-muted);line-height:1.7}
@media(max-width:880px){.gd-spec-grid{grid-template-columns:repeat(2,1fr)}.gd-spec-grid::before{display:none}}
@media(max-width:480px){.gd-spec-grid{grid-template-columns:1fr}}

/* STATEMENT — kalimat besar + frame bracket (BUKAN quote sinematik / glow) */
.gd-statement{position:relative;background:var(--gd-bg);padding:clamp(4rem,7vw,6rem) 6vw;text-align:center;overflow:hidden}
.gd-statement::before{content:'';position:absolute;inset:0;background-image:linear-gradient(var(--gd-grid) 1px,transparent 1px),linear-gradient(90deg,var(--gd-grid) 1px,transparent 1px);background-size:46px 46px;-webkit-mask-image:radial-gradient(ellipse 60% 70% at 50% 50%,#000,transparent 75%);mask-image:radial-gradient(ellipse 60% 70% at 50% 50%,#000,transparent 75%);opacity:.7;pointer-events:none}
.gd-stmt-inner{position:relative;z-index:1;max-width:48ch;margin:0 auto}
.gd-stmt-ew{font-family:${MONO};font-size:.72rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--gd-accent);margin-bottom:1.3rem}
.gd-stmt-quote{font-family:${DISPLAY};font-size:clamp(1.45rem,3vw,2.3rem);font-weight:500;color:var(--gd-ink);line-height:1.32;letter-spacing:-.01em}
.gd-stmt-cite{display:block;font-family:${MONO};font-size:.8rem;color:var(--gd-muted);letter-spacing:.04em;margin-top:1.3rem}

/* SHOWCASE — grid kartu gelap + glow hover + quick-look */
.gd-showcase{background:var(--gd-bg2)}
.gd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.35rem}
.gd-card{position:relative;background:var(--gd-surface);border:1px solid var(--gd-line2);border-radius:14px;overflow:hidden;cursor:pointer;transition:box-shadow .3s ${EASE},transform .3s ${EASE},border-color .3s}
.gd-card:hover{box-shadow:0 24px 60px rgba(0,0,0,.5);transform:translateY(-5px);border-color:rgba(34,211,238,.38)}
.gd-card-img{position:relative;overflow:hidden;aspect-ratio:1/1;background:var(--gd-surface2)}
.gd-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s ${EASE}}
.gd-card:hover .gd-card-img img{transform:scale(1.06)}
.gd-card-img::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(6,9,14,.55));opacity:.9}
.gd-card-cat{position:absolute;top:.7rem;left:.7rem;z-index:2;font-family:${MONO};font-size:.62rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--gd-accent);background:rgba(6,9,14,.7);border:1px solid var(--gd-line);padding:.3rem .55rem;border-radius:6px;backdrop-filter:blur(4px)}
.gd-card-body{padding:1.25rem}
.gd-card-name{font-family:${DISPLAY};font-size:1.1rem;font-weight:600;color:var(--gd-ink);margin-bottom:.4rem;line-height:1.25}
.gd-card-desc{font-size:.82rem;color:var(--gd-muted);margin-bottom:.9rem;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.gd-card-foot{display:flex;align-items:center;justify-content:space-between;gap:1rem}
.gd-card-price{font-family:${MONO};font-size:1rem;font-weight:600;color:var(--gd-accent)}
.gd-card-ql{font-family:${MONO};font-size:.66rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--gd-inkDim);white-space:nowrap;display:flex;align-items:center;gap:.3rem;transition:color .25s}
.gd-card:hover .gd-card-ql{color:var(--gd-accent)}
@media(max-width:1024px){.gd-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.gd-grid{grid-template-columns:1fr}}

/* ABOUT — split gelap + frame bracket */
.gd-about{background:var(--gd-bg)}
.gd-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,4.5rem);align-items:center}
.gd-about-body{font-size:1rem;color:var(--gd-inkDim);line-height:1.9;margin-top:1.1rem;white-space:pre-line}
.gd-about-cta{display:inline-flex;align-items:center;gap:.45rem;margin-top:1.8rem;font-family:${MONO};font-size:.76rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--gd-accent);text-decoration:none;border-bottom:1px solid var(--gd-accentDeep);padding-bottom:3px;transition:gap .25s}
.gd-about-cta:hover{gap:.8rem}
.gd-about-img{position:relative}
.gd-about-frame{position:relative;z-index:1;aspect-ratio:4/5;border-radius:14px;overflow:hidden;border:1px solid var(--gd-line);box-shadow:0 30px 70px rgba(0,0,0,.5)}
.gd-about-frame img{width:100%;height:100%;object-fit:cover}
.gd-about-frame::before,.gd-about-frame::after{content:'';position:absolute;width:24px;height:24px;z-index:2;border:2px solid var(--gd-accent);opacity:.7}
.gd-about-frame::before{top:11px;right:11px;border-left:0;border-bottom:0;border-radius:0 4px 0 0}
.gd-about-frame::after{bottom:11px;left:11px;border-right:0;border-top:0;border-radius:0 0 0 4px}
.gd-about-tag{position:absolute;z-index:3;top:1rem;left:-1rem;font-family:${MONO};font-size:.74rem;color:var(--gd-accent);background:var(--gd-surface);border:1px solid var(--gd-line);padding:.5rem .9rem;border-radius:8px;box-shadow:0 10px 26px rgba(0,0,0,.45)}
@media(max-width:768px){.gd-about-inner{grid-template-columns:1fr;gap:2.5rem}.gd-about-img{order:-1}}

/* STATS — angka mono ber-countUp */
.gd-stats{background:var(--gd-bg2);border-top:1px solid var(--gd-line2);border-bottom:1px solid var(--gd-line2)}
.gd-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;text-align:center}
.gd-stat-num{font-family:${DISPLAY};font-size:clamp(2.3rem,4.4vw,3.3rem);font-weight:600;color:var(--gd-accent);line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.gd-stat-label{font-family:${MONO};font-size:.72rem;color:var(--gd-muted);letter-spacing:.08em;text-transform:uppercase;margin-top:.7rem}
@media(max-width:560px){.gd-stats-grid{grid-template-columns:repeat(2,1fr);gap:2rem}}

/* TESTIMONIALS — carousel scroll-snap (lx-tcar) */
.gd-testimonials{background:var(--gd-bg)}
.gd-tcar{position:relative}
.gd-tcar-track{display:flex;gap:1.1rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.25rem .25rem 1.25rem;-ms-overflow-style:none;scrollbar-width:none}
.gd-tcar-track::-webkit-scrollbar{display:none}
.gd-test-card{scroll-snap-align:start;background:var(--gd-surface);border:1px solid var(--gd-line2);border-radius:14px;padding:1.9rem;min-width:300px;max-width:340px;flex:0 0 auto}
.gd-test-mark{font-family:${DISPLAY};font-size:2.4rem;font-weight:700;color:var(--gd-accent);opacity:.32;line-height:.6}
.gd-test-quote{font-size:.93rem;color:var(--gd-inkDim);line-height:1.78;margin:.5rem 0 1.4rem}
.gd-test-name{font-family:${DISPLAY};font-size:1rem;font-weight:600;color:var(--gd-ink)}
.gd-test-role{font-family:${MONO};font-size:.72rem;color:var(--gd-muted);margin-top:.25rem}
.gd-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1rem;margin-top:1.5rem}
.gd-tcar-btn{width:44px;height:44px;border-radius:10px;background:var(--gd-surface);border:1px solid var(--gd-line);color:var(--gd-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s,border-color .2s,opacity .2s}
.gd-tcar-btn:hover:not(:disabled){background:var(--gd-accent);color:var(--gd-onAccent);border-color:var(--gd-accent)}
.gd-tcar-btn:disabled{opacity:.32;cursor:default}
.gd-tcar-dots{display:flex;gap:.5rem;align-items:center}
.gd-dot{width:8px;height:8px;border-radius:2px;background:var(--gd-line);border:none;padding:0;cursor:pointer;transition:background .2s,transform .2s}
.gd-dot[aria-current="true"]{background:var(--gd-accent);transform:scaleX(1.8)}

/* FAQ */
.gd-faq{background:var(--gd-bg2)}
.gd-faq-wrap{max-width:760px;margin:0 auto}
.gd-faq-item{border-bottom:1px solid var(--gd-line)}
.gd-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.35rem 0;cursor:pointer;font-family:${DISPLAY};font-size:1.08rem;font-weight:500;color:var(--gd-ink);background:none;border:none;text-align:left}
.gd-faq-q:focus-visible{outline:2px solid var(--gd-accent);outline-offset:3px;border-radius:3px}
.gd-faq-icon{font-family:${MONO};font-size:1.2rem;color:var(--gd-accent);flex-shrink:0;transition:transform .25s ${EASE}}
.gd-faq-icon.open{transform:rotate(45deg)}
.gd-faq-a{font-size:.92rem;color:var(--gd-muted);line-height:1.8;padding-bottom:1.35rem;max-width:64ch}

/* CTA — panel grid + tombol mono */
.gd-cta{position:relative;background:var(--gd-bg);text-align:center;overflow:hidden}
.gd-cta::before{content:'';position:absolute;inset:0;background-image:linear-gradient(var(--gd-grid) 1px,transparent 1px),linear-gradient(90deg,var(--gd-grid) 1px,transparent 1px);background-size:46px 46px;-webkit-mask-image:radial-gradient(ellipse 70% 80% at 50% 50%,#000,transparent 78%);mask-image:radial-gradient(ellipse 70% 80% at 50% 50%,#000,transparent 78%);opacity:.7;pointer-events:none}
.gd-cta::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60vw;height:60vw;max-width:620px;max-height:620px;border-radius:50%;background:radial-gradient(circle,var(--gd-glow),transparent 66%);filter:blur(16px);opacity:.6;pointer-events:none}
.gd-cta-inner{position:relative;z-index:1}
.gd-cta-title{font-family:${DISPLAY};font-size:clamp(2rem,4.4vw,3.3rem);font-weight:600;color:var(--gd-ink);margin-bottom:1rem;line-height:1.1;letter-spacing:-.02em;text-wrap:balance}
.gd-cta-sub{font-size:1.02rem;color:var(--gd-inkDim);max-width:46ch;margin:0 auto 2.3rem;line-height:1.8}
.gd-cta-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.gd-cta-btn{font-family:${MONO};font-weight:600;font-size:.82rem;letter-spacing:.06em;text-transform:uppercase;background:var(--gd-accent);color:var(--gd-onAccent);padding:1.05rem 2.5rem;border-radius:10px;text-decoration:none;transition:transform .25s ${EASE},box-shadow .25s}
.gd-cta-btn:hover{transform:translateY(-2px);box-shadow:0 16px 36px var(--gd-glow)}
.gd-cta-ghost{font-family:${MONO};font-weight:600;font-size:.82rem;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--gd-line);color:var(--gd-ink);padding:1.05rem 2.5rem;border-radius:10px;text-decoration:none;transition:border-color .25s,color .25s,background .25s}
.gd-cta-ghost:hover{border-color:var(--gd-accent);color:var(--gd-accent);background:rgba(34,211,238,.06)}

/* BAND ADD-ON */
.gd-band{background:var(--gd-surface);border-top:1px solid var(--gd-line2);border-bottom:1px solid var(--gd-line2);padding:3.5rem 6vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.5rem}
.gd-band-ew{font-family:${MONO};font-size:.68rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gd-accent);margin-bottom:.55rem}
.gd-band .gd-heading{font-size:clamp(1.5rem,2.4vw,2.05rem)}
.gd-band-sub{color:var(--gd-muted);font-size:.95rem;line-height:1.7;margin-top:.55rem;max-width:56ch}

/* FOOTER */
.gd-footer{background:var(--gd-scrim);color:#C9D6E3;padding:4rem 6vw 2rem;border-top:1px solid var(--gd-line2)}
.gd-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.5rem}
.gd-footer-brand{font-family:${DISPLAY};font-size:1.5rem;font-weight:600;letter-spacing:.02em;color:var(--gd-ink);margin-bottom:.85rem;display:flex;align-items:center;gap:.55rem}
.gd-footer-brand::before{content:'';width:9px;height:9px;border-radius:2px;background:var(--gd-accent);box-shadow:0 0 12px var(--gd-glow)}
.gd-footer-tagline{font-size:.84rem;color:#C9D6E3;opacity:.62;line-height:1.7;max-width:36ch}
.gd-footer-h{font-family:${MONO};font-size:.68rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--gd-accent);margin-bottom:1rem}
.gd-footer-link{display:block;font-size:.85rem;color:#C9D6E3;opacity:.72;text-decoration:none;margin-bottom:.55rem;transition:opacity .2s,color .2s}
.gd-footer-link:hover{opacity:1;color:var(--gd-accent)}
.gd-footer-copy{border-top:1px solid var(--gd-line2);padding-top:1.5rem;font-family:${MONO};font-size:.74rem;color:#C9D6E3;opacity:.66;text-align:center}
@media(max-width:768px){.gd-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* REVEAL — via primitive LUX_JS (.lx-reveal → .lx-in), digate .lx-js: tanpa JS /
   sample statis = konten tampil penuh (kontrak lux-script). */
.lx-js .gd-rv{opacity:0;transform:translateY(20px);transition:opacity .65s ${EASE},transform .65s ${EASE}}
.lx-js .gd-rv.lx-in{opacity:1;transform:none}
.gd-rv-d1{transition-delay:.08s}.gd-rv-d2{transition-delay:.16s}.gd-rv-d3{transition-delay:.24s}.gd-rv-d4{transition-delay:.32s}

/* LIGHTBOX — gd-root overrides untuk palet lx-lb */
.gd-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.gd-root .lx-lb[hidden]{display:none}
.gd-root .lx-lb-back{position:absolute;inset:0;background:rgba(4,7,11,.74);backdrop-filter:blur(8px);border:0;cursor:pointer}
.gd-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--gd-surface);border:1px solid var(--gd-line);border-radius:16px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .4s ${EASE},transform .4s ${EASE}}
.gd-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.gd-root .lx-lb-media{position:relative;overflow:hidden;background:var(--gd-surface2);min-height:280px}
.gd-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.gd-root .lx-lb-body{padding:clamp(20px,3vw,40px);display:flex;flex-direction:column;gap:8px;justify-content:center}
.gd-root .lx-lb-cat{font-family:${MONO};font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--gd-accent)}
.gd-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(22px,2.6vw,30px);font-weight:600;line-height:1.18;color:var(--gd-ink)}
.gd-root .lx-lb-price{font-family:${MONO};font-size:20px;font-weight:600;color:var(--gd-accent)}
.gd-root .lx-lb-desc{color:var(--gd-muted);font-size:13px;line-height:1.75}
.gd-root .lx-lb-cta{margin-top:12px;width:fit-content;display:inline-flex;align-items:center;background:var(--gd-accent);color:var(--gd-onAccent);font-family:${MONO};font-size:13px;font-weight:600;padding:12px 22px;border-radius:9px;text-decoration:none;letter-spacing:.04em;text-transform:uppercase}
.gd-root .lx-lb-x{position:absolute;top:10px;right:10px;z-index:3;width:40px;height:40px;border-radius:9px;background:var(--gd-surface);border:1px solid var(--gd-line);color:var(--gd-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.gd-root .lx-lb-x:hover{background:var(--gd-accent);color:var(--gd-onAccent);border-color:var(--gd-accent)}
.gd-root .lx-lb-prev,.gd-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:40px;height:40px;border-radius:9px;background:var(--gd-surface);border:1px solid var(--gd-line);color:var(--gd-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.gd-root .lx-lb-prev:hover,.gd-root .lx-lb-next:hover{background:var(--gd-accent);color:var(--gd-onAccent)}
.gd-root .lx-lb-prev{left:8px}.gd-root .lx-lb-next{right:8px}
@media(max-width:640px){.gd-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.gd-root .lx-lb-media{min-height:220px}}

/* ── RASA polish: press feedback, depth, motion safety ── */
.gd-root{-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
.gd-btn-primary,.gd-cta-btn,.gd-nav-cta{box-shadow:0 4px 14px rgba(34,211,238,.12)}
.gd-btn-primary:active,.gd-cta-btn:active,.gd-nav-cta:active,.gd-btn-ghost:active,.gd-cta-ghost:active{transform:translateY(0) scale(.97)}
.gd-card:active{transform:translateY(-2px) scale(.992)}
.gd-tcar-btn:active{transform:scale(.94)}
/* Focus ring konsisten — cyan pada near-black ~10.7:1 (WCAG 2.4.7) */
.gd-nav-cta:focus-visible,.gd-btn-primary:focus-visible,.gd-btn-ghost:focus-visible,.gd-cta-btn:focus-visible,.gd-cta-ghost:focus-visible,.gd-about-cta:focus-visible,.gd-footer-link:focus-visible,.gd-card:focus-visible,.gd-tcar-btn:focus-visible,.gd-dot:focus-visible{outline:2px solid var(--gd-accent);outline-offset:3px}
.gd-hero-sub,.gd-subtext,.gd-about-body,.gd-cta-sub,.gd-spec-desc,.gd-test-quote{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Istilah teknis/mood — sengaja BUKAN klaim verifiable (garansi/original/QC/kirim)
// karena marquee ini tampil di SEMUA situs Onyx; klaim spesifik milik tiap klien,
// ditaruh di konten yang bisa mereka edit (fitur/stats), bukan di-hardcode universal.
const MQ_ITEMS = ['NEXT-GEN', 'FAST CHARGING', 'PLUG & PLAY', 'PERFORMA', 'PRESISI', 'AUDIO', 'KONEKTIVITAS', 'DAYA']

export default function GadgetLuxRenderer({ content: c, variant = 'onyx' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.onyx
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
    '--gd-bg': p.bg, '--gd-bg2': p.bg2, '--gd-surface': p.surface, '--gd-surface2': p.surface2,
    '--gd-ink': p.ink, '--gd-inkDim': p.inkDim, '--gd-muted': p.muted,
    '--gd-accent': p.accent, '--gd-accentDeep': p.accentDeep, '--gd-onAccent': p.onAccent,
    '--gd-glow': p.glow, '--gd-grid': p.grid, '--gd-line': p.line, '--gd-line2': p.line2, '--gd-scrim': p.scrim,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const words = (hero.title ?? '').split(' ')

  return (
    <div className="gd-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: gdCss() }} />

      {/* NAV */}
      <nav className="gd-nav" aria-label="Navigasi utama">
        <span className="gd-nav-logo">{c.nama ?? 'Onyx'}</span>
        <a href={waUrl} className="gd-nav-cta">Pesan Sekarang</a>
      </nav>

      {/* HERO */}
      <section className="gd-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="gd-hero-text">
          {hero.eyebrow && <p className="gd-hero-ew">{hero.eyebrow}</p>}
          <h1 className="gd-hero-title" aria-label={hero.title}>
            {words.map((w, i) => (
              <span key={i} style={{ '--gd-d': `${180 + i * 65}ms` } as React.CSSProperties}>
                {w}{' '}
              </span>
            ))}
          </h1>
          {hero.subtitle && <p className="gd-hero-sub">{hero.subtitle}</p>}
          <div className="gd-hero-btns">
            {hero.ctaHref && (
              <a href={hero.ctaHref} className="gd-btn-primary lx-mag">{hero.ctaText ?? 'Lihat Produk'}</a>
            )}
            <a href={hero.ctaHref2 ?? waUrl} className="gd-btn-ghost">{hero.ctaText2 ?? 'Konsultasi'}</a>
          </div>
          {stats.length > 0 && (
            <div className="gd-hero-spec">
              {stats.slice(0, 3).map((s, i) => (
                <span key={i} className="gd-spec-chip"><b>{s.angka}</b> {s.label}</span>
              ))}
            </div>
          )}
        </div>
        {hero.image && (
          <div className="gd-hero-media">
            <div className="gd-hero-frame">
              <span className="gd-scan" aria-hidden />
              <img
                src={hero.image}
                alt={c.nama ?? 'Produk gadget'}
                loading="eager"
                style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
              />
            </div>
            {stats[0] && (
              <div className="gd-hero-badge"><i aria-hidden /><b>{stats[0].angka}</b> {stats[0].label}</div>
            )}
          </div>
        )}
      </section>

      {/* MARQUEE */}
      <div className="gd-marquee" aria-hidden="true">
        <div className="gd-mq-track">
          {[...MQ_ITEMS, ...MQ_ITEMS].map((m, i) => (
            <span key={i} className="gd-mq-item">{m}</span>
          ))}
        </div>
      </div>

      {/* SPEC — signature kartu HUD bernomor (memakai data features) */}
      {features.length > 0 && (
        <section className="gd-section gd-spec-sec" id="spesifikasi">
          <div className="gd-sec-hdr gd-rv lx-reveal">
            <p className="gd-eyebrow">{c.featuresEyebrow ?? 'Kenapa Kami'}</p>
            {c.featuresTitle && <h2 className="gd-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="gd-spec-grid">
            {features.slice(0, 4).map((f, i) => (
              <div key={i} className={`gd-spec-card gd-rv lx-reveal gd-rv-d${i + 1}`}>
                <div className="gd-spec-idx gd-mono">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="gd-spec-title">{f.title}</h3>
                <p className="gd-spec-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT */}
      {c.statement && (
        <div className="gd-statement">
          <div className="gd-stmt-inner gd-rv lx-reveal">
            {c.statement.eyebrow && <p className="gd-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="gd-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="gd-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* SHOWCASE */}
      {items.length > 0 && (
        <section className="gd-section gd-showcase" id="produk">
          <div className="gd-sec-hdr gd-rv lx-reveal">
            <p className="gd-eyebrow">Katalog</p>
            {c.showcase?.title && <h2 className="gd-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="gd-subtext">{c.showcase.subtitle}</p>}
          </div>
          <div className="gd-grid lx-look">
            {items.map((item, i) => (
              <article
                key={i}
                className="gd-card lx-lb-open gd-rv lx-reveal"
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
                {item.gambar && (
                  <div className="gd-card-img">
                    {item.kategori && <span className="gd-card-cat gd-mono">{item.kategori}</span>}
                    <img src={item.gambar} alt={item.nama} loading="lazy" />
                  </div>
                )}
                <div className="gd-card-body">
                  <h3 className="gd-card-name">{item.nama}</h3>
                  {item.desc && <p className="gd-card-desc">{item.desc}</p>}
                  <div className="gd-card-foot">
                    <span className="gd-card-price">{fmt(item.harga ?? 0)}</span>
                    <span className="gd-card-ql">Detail →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="gd-section gd-about" id="tentang">
          <div className="gd-about-inner">
            <div className="gd-rv lx-reveal">
              <p className="gd-eyebrow">Tentang Kami</p>
              <h2 className="gd-heading">{c.about.title}</h2>
              <p className="gd-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="gd-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="gd-about-img gd-rv lx-reveal gd-rv-d2">
                <div className="gd-about-frame">
                  <img src={c.about.image} alt={c.about.title} loading="lazy" />
                </div>
                <div className="gd-about-tag gd-mono">// est.</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="gd-section gd-stats">
          <div className="gd-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`gd-rv lx-reveal gd-rv-d${i + 1}`}>
                <div className="gd-stat-num" data-cu>{s.angka}</div>
                <div className="gd-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS — carousel */}
      {testimonials.length > 0 && (
        <section className="gd-section gd-testimonials" id="ulasan">
          <div className="gd-sec-hdr gd-rv lx-reveal">
            <p className="gd-eyebrow">Ulasan</p>
            <h2 className="gd-heading">Kata Pengguna</h2>
          </div>
          <div className="gd-tcar lx-tcar">
            <div className="gd-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="gd-test-card">
                  <div className="gd-test-mark">&ldquo;</div>
                  <p className="gd-test-quote">{t.quote}</p>
                  <p className="gd-test-name">{t.nama}</p>
                  {t.peran && <p className="gd-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="gd-tcar-ctrl">
                <button className="gd-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="gd-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="gd-dot lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="gd-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="gd-section gd-faq" id="faq">
          <div className="gd-sec-hdr gd-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.25rem' }}>
            <p className="gd-eyebrow" style={{ justifyContent: 'center' }}>Pertanyaan</p>
            <h2 className="gd-heading">Sering Ditanyakan</h2>
          </div>
          <div className="gd-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="gd-faq-item">
                <button
                  className="gd-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`gd-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="gd-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="gd-section gd-cta" id="pesan">
          <div className="gd-cta-inner">
            <p className="gd-stmt-ew">Siap Upgrade?</p>
            <h2 className="gd-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="gd-cta-sub">{c.cta.subtitle}</p>}
            <div className="gd-cta-btns">
              <a href={waUrl} className="gd-cta-btn lx-mag">{c.cta.ctaText ?? 'Pesan via WhatsApp'}</a>
              {hero.ctaHref && (
                <a href={hero.ctaHref} className="gd-cta-ghost">Lihat Produk</a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON (newsletter/career) — additive via content.bands */}
      {(c.bands ?? []).map((b, i) => (
        <section className="gd-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="gd-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="gd-heading">{b.title}</h2>
            {b.subtitle && <p className="gd-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="gd-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="gd-footer">
        <div className="gd-footer-grid">
          <div>
            <p className="gd-footer-brand">{c.nama ?? 'Onyx'}</p>
            <p className="gd-footer-tagline">
              {hero.eyebrow ?? 'Gadget & aksesoris pilihan, dikurasi untuk performa dan daya tahan.'}
            </p>
          </div>
          <div>
            <p className="gd-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="gd-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="gd-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="gd-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="gd-footer-h">Jam Layanan</p>
            {c.info?.jam
              ? c.info.jam.map((j, i) => (
                  <p key={i} className="gd-footer-link">{j.hari}: {j.jam}</p>
                ))
              : (
                <>
                  <p className="gd-footer-link">Senin–Sabtu: 09.00–18.00</p>
                  <p className="gd-footer-link">Minggu: Tutup</p>
                </>
              )}
          </div>
        </div>
        <p className="gd-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Onyx'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX — JS-driven via LUX_JS (class lx-lb-open + data-* on cards) */}
      <BespokeLightbox ctaText="Pesan via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
