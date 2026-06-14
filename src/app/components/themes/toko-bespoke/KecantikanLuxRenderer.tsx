'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// EMBUN — Toko Kecantikan Bespoke Lux Renderer
// Italiana (display) + Mulish (body) | Porcelain #FBF7F5 ·
// Blush #F4E7E4 · Rose #B5566B / #A8455C | signature: radial GLOW halo
// (CSS bloom yang bernapas) + Ritual stepper bernomor | ns: kc-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.kc-*`.
// Light-luminous — sengaja kontras dengan tema bespoke lain (gelap/heritage).
// ============================================================

export interface KcPal {
  bg: string; bg2: string; surface: string; ink: string; inkDim: string
  muted: string; accent: string; accentDeep: string; onAccent: string
  champ: string; glowA: string; glowB: string
  line: string; line2: string; scrim: string
}

export const PALETTES: Record<string, KcPal> = {
  // Embun — porcelain hangat + mekar rose, glow peach-champagne.
  embun: {
    bg: '#FBF7F5', bg2: '#F4E7E4', surface: '#FFFFFF',
    ink: '#2A1D22', inkDim: '#574048', muted: '#7C6068',
    accent: '#B5566B', accentDeep: '#A8455C', onAccent: '#FFFFFF',
    champ: '#C9A98A', glowA: 'rgba(246,201,192,.95)', glowB: 'rgba(233,201,168,.55)',
    line: 'rgba(42,29,34,.10)', line2: 'rgba(42,29,34,.055)', scrim: '#241016',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Italiana&family=Mulish:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap'
const DISPLAY = '"Italiana","Georgia",serif'
const BODY = '"Mulish","Helvetica Neue",sans-serif'
const EASE = 'cubic-bezier(.16,1,.3,1)'

function kcCss(): string {
  return `
@import url('${FONT_IMPORT}');
/* Guard tingkat-dokumen: glow ber-vw + frame mobile tak boleh memicu scroll
   horizontal (satu tema per halaman → aman set di html/body). */
html,body{overflow-x:hidden;max-width:100%}
.kc-root{font-family:${BODY};color:var(--kc-ink);background:var(--kc-bg);line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden;max-width:100%}
.kc-root *,.kc-root *::before,.kc-root *::after{box-sizing:border-box;margin:0;padding:0}
.kc-root img{max-width:100%;height:auto;display:block}
.kc-root ::selection{background:var(--kc-bg2);color:var(--kc-accentDeep)}

/* NAV */
.kc-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.15rem 6vw;display:flex;align-items:center;justify-content:space-between;transition:background .4s,box-shadow .4s,backdrop-filter .4s}
.kc-root.lx-scrolled .kc-nav{background:rgba(251,247,245,.82);backdrop-filter:blur(12px);box-shadow:0 1px 0 var(--kc-line)}
.kc-nav-logo{font-family:${DISPLAY};letter-spacing:.06em;color:var(--kc-ink);font-size:1.35rem;text-decoration:none}
.kc-nav-cta{background:var(--kc-accentDeep);color:var(--kc-onAccent);font-family:${BODY};font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:.7rem 1.4rem;border-radius:999px;text-decoration:none;transition:transform .25s ${EASE},box-shadow .25s}
.kc-nav-cta:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(168,69,92,.28)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:140px;opacity:0;pointer-events:none}

/* HERO — asimetris terang + glow halo di belakang produk */
.kc-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:52% 48%;align-items:center;padding:7rem 6vw 4rem;overflow:hidden}
.kc-hero::before{content:'';position:absolute;top:-10%;right:-6%;width:60vw;height:60vw;max-width:760px;max-height:760px;background:radial-gradient(circle at 50% 45%,var(--kc-glowA),var(--kc-glowB) 42%,transparent 70%);filter:blur(8px);z-index:0;pointer-events:none}
/* Signature: glow halo bernapas — hanya untuk motion-OK; base (freeze/reduced) = statis tampil. */
@media(prefers-reduced-motion:no-preference){.kc-hero::before{animation:kcBreathe 7s ${EASE} infinite}}
@keyframes kcBreathe{0%,100%{opacity:.9;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
.kc-hero-text{position:relative;z-index:2;padding-right:2rem}
.kc-hero-ew{font-family:${BODY};font-size:.72rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--kc-accent);margin-bottom:1.4rem}
.kc-hero-title{font-family:${DISPLAY};font-size:clamp(2.7rem,6vw,5rem);font-weight:400;line-height:1.06;color:var(--kc-ink);margin-bottom:1.4rem;letter-spacing:.005em}
/* Stagger kata via CSS murni (base = TAMPIL): hidup di sample statis tanpa
   hydration; reduced-motion / no-anim jatuh ke keadaan terlihat. */
.kc-hero-title span{display:inline;opacity:1}
@media(prefers-reduced-motion:no-preference){.kc-hero-title span{animation:kcRise .7s ${EASE} both;animation-delay:var(--kc-d,0ms)}}
@keyframes kcRise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.kc-hero-sub{font-size:1.05rem;color:var(--kc-inkDim);margin-bottom:2.25rem;max-width:42ch;line-height:1.85}
.kc-hero-btns{display:flex;gap:.85rem;flex-wrap:wrap}
.kc-btn-primary{background:var(--kc-accentDeep);color:var(--kc-onAccent);font-family:${BODY};font-size:.82rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.95rem 2rem;border-radius:999px;text-decoration:none;transition:transform .25s ${EASE},box-shadow .25s}
.kc-btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(168,69,92,.3)}
.kc-btn-ghost{border:1px solid var(--kc-accent);color:var(--kc-accent);font-family:${BODY};font-size:.82rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.95rem 2rem;border-radius:999px;text-decoration:none;transition:background .25s,color .25s}
.kc-btn-ghost:hover{background:var(--kc-accent);color:var(--kc-onAccent)}
.kc-hero-media{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;padding:1rem 0 1rem 1rem}
.kc-hero-frame{position:relative;width:100%;max-width:420px;aspect-ratio:4/5;border-radius:24px;overflow:hidden;box-shadow:0 40px 90px rgba(42,29,34,.18)}
.kc-hero-frame img{width:100%;height:100%;object-fit:cover}
.kc-hero-badge{position:absolute;bottom:1rem;left:-1.25rem;background:var(--kc-surface);color:var(--kc-ink);font-family:${BODY};font-size:.74rem;font-weight:700;letter-spacing:.02em;padding:.7rem 1.15rem;border-radius:999px;box-shadow:0 12px 30px rgba(42,29,34,.14);z-index:3;display:flex;align-items:center;gap:.5rem}
.kc-hero-badge b{font-family:${DISPLAY};font-size:1.05rem;color:var(--kc-accentDeep);font-weight:400}
@media(max-width:768px){
  .kc-hero{grid-template-columns:1fr;min-height:unset;padding:6rem 6vw 3rem;text-align:center}
  .kc-hero-title{font-size:clamp(1.95rem,7vw,2.7rem)}
  .kc-hero-text{padding-right:0}
  .kc-hero-media{order:-1;padding:0 0 1.5rem}
  .kc-hero-frame{max-width:300px;aspect-ratio:1/1}
  .kc-hero-sub{margin-left:auto;margin-right:auto}
  .kc-hero-btns{justify-content:center}
  .kc-hero-badge{left:50%;transform:translateX(-50%);bottom:.75rem}
}
@media(max-width:560px){
  .kc-nav{padding:1rem 5vw}
  .kc-nav-cta{padding:.62rem 1.05rem;font-size:.66rem;letter-spacing:.08em}
}

/* MARQUEE — pita lembut */
.kc-marquee{overflow:hidden;background:var(--kc-bg2);padding:.95rem 0}
.kc-mq-track{display:flex;animation:kc-scroll 34s linear infinite;width:max-content}
@media(prefers-reduced-motion:reduce){.kc-mq-track{animation:none}}
.kc-mq-track:hover{animation-play-state:paused}
.kc-mq-item{font-family:${BODY};font-size:.68rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--kc-accent);padding:0 2.25rem;white-space:nowrap;display:flex;align-items:center;gap:2.25rem}
.kc-mq-item::after{content:'';width:5px;height:5px;border-radius:50%;background:var(--kc-champ)}
@keyframes kc-scroll{to{transform:translateX(-50%)}}

/* SECTION COMMONS */
.kc-section{padding:clamp(4rem,8vw,7rem) 6vw}
.kc-eyebrow{font-family:${BODY};font-size:.72rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--kc-accent);margin-bottom:.85rem}
.kc-heading{font-family:${DISPLAY};font-size:clamp(2rem,3.6vw,3.1rem);font-weight:400;color:var(--kc-ink);line-height:1.14;letter-spacing:.005em;text-wrap:balance}
.kc-subtext{color:var(--kc-muted);font-size:.98rem;margin-top:.9rem;max-width:56ch;line-height:1.8}
.kc-sec-hdr{margin-bottom:3.25rem;max-width:60ch}

/* RITUAL — signature: langkah bernomor dengan garis luminous penghubung */
.kc-ritual{background:var(--kc-bg)}
.kc-ritual-grid{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem}
.kc-ritual-grid::before{content:'';position:absolute;top:1.35rem;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,var(--kc-champ),var(--kc-accent),var(--kc-champ),transparent);opacity:.55}
.kc-step{position:relative;text-align:center;padding-top:.25rem}
.kc-step-num{position:relative;z-index:1;width:2.7rem;height:2.7rem;margin:0 auto 1.4rem;border-radius:50%;background:var(--kc-surface);border:1px solid var(--kc-line);display:flex;align-items:center;justify-content:center;font-family:${DISPLAY};font-size:1.05rem;color:var(--kc-accentDeep);box-shadow:0 8px 22px rgba(181,86,107,.16)}
.kc-step-title{font-family:${DISPLAY};font-size:1.2rem;color:var(--kc-ink);margin-bottom:.55rem}
.kc-step-desc{font-size:.86rem;color:var(--kc-muted);line-height:1.7;max-width:26ch;margin:0 auto}
@media(max-width:768px){
  .kc-ritual-grid{grid-template-columns:1fr;gap:1.75rem}
  .kc-ritual-grid::before{display:none}
}

/* STATEMENT — serif besar terang + aksen glow (BUKAN italic sinematik) */
.kc-statement{position:relative;background:var(--kc-bg2);padding:clamp(4rem,7vw,6rem) 6vw;text-align:center;overflow:hidden}
.kc-statement::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:55vw;height:55vw;max-width:620px;max-height:620px;background:radial-gradient(circle,var(--kc-glowA),transparent 65%);opacity:.5;filter:blur(10px);pointer-events:none}
.kc-stmt-inner{position:relative;z-index:1}
.kc-stmt-ew{font-family:${BODY};font-size:.72rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--kc-accent);margin-bottom:1.4rem}
.kc-stmt-quote{font-family:${DISPLAY};font-size:clamp(1.5rem,3vw,2.4rem);font-weight:400;color:var(--kc-ink);line-height:1.4;max-width:24ch;margin:0 auto 1.4rem;letter-spacing:.005em}
.kc-stmt-cite{font-size:.84rem;color:var(--kc-muted);letter-spacing:.02em}

/* SHOWCASE — grid kartu lembut + glow hover + quick-look */
.kc-showcase{background:var(--kc-bg)}
.kc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
.kc-card{background:var(--kc-surface);border:1px solid var(--kc-line2);border-radius:20px;overflow:hidden;cursor:pointer;transition:box-shadow .3s ${EASE},transform .3s ${EASE},border-color .3s}
.kc-card:hover{box-shadow:0 24px 60px rgba(181,86,107,.16);transform:translateY(-5px);border-color:rgba(181,86,107,.22)}
.kc-card-img{position:relative;overflow:hidden;aspect-ratio:1/1;background:var(--kc-bg2)}
.kc-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s ${EASE}}
.kc-card:hover .kc-card-img img{transform:scale(1.06)}
.kc-card-img::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 120%,var(--kc-glowA),transparent 60%);opacity:0;transition:opacity .4s;mix-blend-mode:screen}
.kc-card:hover .kc-card-img::after{opacity:.7}
.kc-card-body{padding:1.35rem}
.kc-card-name{font-family:${DISPLAY};font-size:1.15rem;color:var(--kc-ink);margin-bottom:.4rem;line-height:1.25}
.kc-card-desc{font-size:.82rem;color:var(--kc-muted);margin-bottom:.8rem;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.kc-card-foot{display:flex;align-items:center;justify-content:space-between;gap:1rem}
.kc-card-price{font-family:${DISPLAY};font-size:1.1rem;color:var(--kc-accentDeep);font-variant-numeric:tabular-nums}
.kc-card-ql{font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--kc-accent);white-space:nowrap}
@media(max-width:1024px){.kc-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.kc-grid{grid-template-columns:1fr}}

/* ABOUT — split terang + frame glow */
.kc-about{background:var(--kc-bg2);overflow:hidden}
.kc-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,4.5rem);align-items:center}
.kc-about-body{font-size:1rem;color:var(--kc-inkDim);line-height:1.9;margin-top:1.1rem;white-space:pre-line}
.kc-about-cta{display:inline-block;margin-top:1.9rem;font-family:${BODY};font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--kc-accentDeep);border-bottom:1px solid currentColor;padding-bottom:2px;text-decoration:none}
.kc-about-img{position:relative}
.kc-about-img::before{content:'';position:absolute;inset:-12% -8% -8% -12%;background:radial-gradient(circle at 60% 40%,var(--kc-glowA),transparent 62%);opacity:.6;filter:blur(6px);z-index:0}
.kc-about-frame{position:relative;z-index:1;aspect-ratio:4/5;border-radius:24px;overflow:hidden;box-shadow:0 30px 70px rgba(42,29,34,.16)}
.kc-about-frame img{width:100%;height:100%;object-fit:cover}
.kc-about-tag{position:absolute;z-index:2;top:1rem;right:-1rem;background:var(--kc-surface);color:var(--kc-accentDeep);font-family:${DISPLAY};font-size:.9rem;padding:.55rem 1.1rem;border-radius:999px;box-shadow:0 10px 26px rgba(42,29,34,.14)}
@media(max-width:768px){.kc-about-inner{grid-template-columns:1fr;gap:2.5rem}.kc-about-img{order:-1}}

/* STATS — angka glow ber-countUp */
.kc-stats{background:var(--kc-bg)}
.kc-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;text-align:center}
.kc-stat-num{font-family:${DISPLAY};font-size:clamp(2.4rem,4.5vw,3.4rem);font-weight:400;color:var(--kc-accentDeep);line-height:1;font-variant-numeric:tabular-nums}
.kc-stat-label{font-size:.74rem;color:var(--kc-muted);letter-spacing:.1em;text-transform:uppercase;margin-top:.65rem}
@media(max-width:560px){.kc-stats-grid{grid-template-columns:repeat(2,1fr);gap:2rem}}

/* TESTIMONIALS — carousel scroll-snap (lx-tcar) */
.kc-testimonials{background:var(--kc-bg2)}
.kc-tcar{position:relative}
.kc-tcar-track{display:flex;gap:1.25rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.25rem .25rem 1.25rem;-ms-overflow-style:none;scrollbar-width:none}
.kc-tcar-track::-webkit-scrollbar{display:none}
.kc-test-card{scroll-snap-align:start;background:var(--kc-surface);border:1px solid var(--kc-line2);border-radius:20px;padding:2rem;min-width:300px;max-width:340px;flex:0 0 auto;box-shadow:0 12px 40px rgba(42,29,34,.05)}
.kc-test-mark{font-family:${DISPLAY};font-size:2.6rem;color:var(--kc-accent);opacity:.3;line-height:.7}
.kc-test-quote{font-size:.94rem;color:var(--kc-inkDim);line-height:1.78;margin:.5rem 0 1.4rem}
.kc-test-name{font-family:${DISPLAY};font-size:1rem;color:var(--kc-ink)}
.kc-test-role{font-size:.76rem;color:var(--kc-muted);margin-top:.2rem}
.kc-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1rem;margin-top:1.5rem}
.kc-tcar-btn{width:44px;height:44px;border-radius:999px;background:var(--kc-surface);border:1px solid var(--kc-line);color:var(--kc-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s,opacity .2s}
.kc-tcar-btn:hover:not(:disabled){background:var(--kc-accentDeep);color:var(--kc-onAccent);border-color:var(--kc-accentDeep)}
.kc-tcar-btn:disabled{opacity:.35;cursor:default}
.kc-tcar-dots{display:flex;gap:.5rem;align-items:center}
.kc-dot{width:8px;height:8px;border-radius:50%;background:var(--kc-line);border:none;padding:0;cursor:pointer;transition:background .2s,transform .2s}
.kc-dot[aria-current="true"]{background:var(--kc-accent);transform:scale(1.3)}

/* FAQ */
.kc-faq{background:var(--kc-bg)}
.kc-faq-wrap{max-width:760px;margin:0 auto}
.kc-faq-item{border-bottom:1px solid var(--kc-line)}
.kc-faq-q{display:flex;justify-content:space-between;align-items:center;padding:1.35rem 0;cursor:pointer;font-family:${DISPLAY};font-size:1.1rem;color:var(--kc-ink);gap:1rem;width:100%;background:none;border:none;text-align:left}
.kc-faq-q:focus-visible{outline:2px solid var(--kc-accent);outline-offset:3px;border-radius:3px}
.kc-faq-icon{font-size:1.3rem;color:var(--kc-accent);flex-shrink:0;transition:transform .25s ${EASE}}
.kc-faq-icon.open{transform:rotate(45deg)}
.kc-faq-a{font-size:.92rem;color:var(--kc-muted);line-height:1.8;padding-bottom:1.35rem;max-width:64ch}

/* CTA — pita glow lembut, tombol pill */
.kc-cta{position:relative;background:var(--kc-bg2);text-align:center;overflow:hidden}
.kc-cta::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:70vw;height:70vw;max-width:720px;max-height:720px;background:radial-gradient(circle,var(--kc-glowA),var(--kc-glowB) 40%,transparent 68%);opacity:.6;filter:blur(8px);pointer-events:none}
.kc-cta-inner{position:relative;z-index:1}
.kc-cta-title{font-family:${DISPLAY};font-size:clamp(2rem,4.5vw,3.4rem);font-weight:400;color:var(--kc-ink);margin-bottom:1rem;line-height:1.12;letter-spacing:.005em;text-wrap:balance}
.kc-cta-sub{font-size:1.02rem;color:var(--kc-inkDim);max-width:46ch;margin:0 auto 2.4rem;line-height:1.8}
.kc-cta-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.kc-cta-btn{background:var(--kc-accentDeep);color:var(--kc-onAccent);font-family:${BODY};font-weight:700;font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;padding:1.05rem 2.6rem;border-radius:999px;text-decoration:none;transition:transform .25s ${EASE},box-shadow .25s}
.kc-cta-btn:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(168,69,92,.32)}
.kc-cta-ghost{border:1px solid var(--kc-accent);color:var(--kc-accentDeep);font-family:${BODY};font-weight:700;font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;padding:1.05rem 2.6rem;border-radius:999px;text-decoration:none;transition:background .25s,color .25s}
.kc-cta-ghost:hover{background:var(--kc-accent);color:var(--kc-onAccent)}

/* BAND ADD-ON */
.kc-band{background:var(--kc-surface);border-top:1px solid var(--kc-line2);border-bottom:1px solid var(--kc-line2);padding:3.5rem 6vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.5rem}
.kc-band-ew{font-family:${BODY};font-size:.68rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--kc-accent);margin-bottom:.55rem}
.kc-band .kc-heading{font-size:clamp(1.5rem,2.4vw,2.05rem)}
.kc-band-sub{color:var(--kc-muted);font-size:.95rem;line-height:1.7;margin-top:.55rem;max-width:56ch}

/* FOOTER */
.kc-footer{background:var(--kc-scrim);color:#F3E4E0;padding:4rem 6vw 2rem}
.kc-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.5rem}
.kc-footer-brand{font-family:${DISPLAY};font-size:1.55rem;letter-spacing:.04em;margin-bottom:.85rem}
.kc-footer-tagline{font-size:.84rem;color:#F3E4E0;opacity:.6;line-height:1.7;max-width:36ch}
.kc-footer-h{font-family:${BODY};font-size:.68rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--kc-champ);margin-bottom:1rem}
.kc-footer-link{display:block;font-size:.85rem;color:#F3E4E0;opacity:.72;text-decoration:none;margin-bottom:.55rem;transition:opacity .2s}
.kc-footer-link:hover{opacity:1}
.kc-footer-copy{border-top:1px solid rgba(243,228,224,.12);padding-top:1.5rem;font-size:.76rem;color:#F3E4E0;opacity:.42;text-align:center}
@media(max-width:768px){.kc-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* REVEAL — via primitive LUX_JS (.lx-reveal → .lx-in), digate .lx-js: tanpa JS /
   sample statis = konten tampil penuh (kontrak lux-script). */
.lx-js .kc-rv{opacity:0;transform:translateY(20px);transition:opacity .65s ${EASE},transform .65s ${EASE}}
.lx-js .kc-rv.lx-in{opacity:1;transform:none}
.kc-rv-d1{transition-delay:.08s}.kc-rv-d2{transition-delay:.16s}.kc-rv-d3{transition-delay:.24s}.kc-rv-d4{transition-delay:.32s}

/* LIGHTBOX — kc-root overrides untuk palet lx-lb */
.kc-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.kc-root .lx-lb[hidden]{display:none}
.kc-root .lx-lb-back{position:absolute;inset:0;background:rgba(36,16,22,.62);backdrop-filter:blur(8px);border:0;cursor:pointer}
.kc-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--kc-surface);border:1px solid var(--kc-line);border-radius:20px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .4s ${EASE},transform .4s ${EASE}}
.kc-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.kc-root .lx-lb-media{position:relative;overflow:hidden;background:var(--kc-bg2);min-height:280px}
.kc-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.kc-root .lx-lb-body{padding:clamp(20px,3vw,40px);display:flex;flex-direction:column;gap:8px;justify-content:center}
.kc-root .lx-lb-cat{font-family:${BODY};font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--kc-accent)}
.kc-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(22px,2.6vw,30px);line-height:1.18;color:var(--kc-ink)}
.kc-root .lx-lb-price{font-family:${DISPLAY};font-size:20px;color:var(--kc-accentDeep);font-variant-numeric:tabular-nums}
.kc-root .lx-lb-desc{color:var(--kc-muted);font-size:13px;line-height:1.75}
.kc-root .lx-lb-cta{margin-top:12px;width:fit-content;display:inline-flex;align-items:center;background:var(--kc-accentDeep);color:var(--kc-onAccent);font-family:${BODY};font-size:13px;font-weight:700;padding:12px 22px;border-radius:999px;text-decoration:none;letter-spacing:.06em;text-transform:uppercase}
.kc-root .lx-lb-x{position:absolute;top:10px;right:10px;z-index:3;width:40px;height:40px;border-radius:999px;background:var(--kc-surface);border:1px solid var(--kc-line);color:var(--kc-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.kc-root .lx-lb-x:hover{background:var(--kc-accentDeep);color:var(--kc-onAccent);border-color:var(--kc-accentDeep)}
.kc-root .lx-lb-prev,.kc-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:40px;height:40px;border-radius:999px;background:var(--kc-surface);border:1px solid var(--kc-line);color:var(--kc-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.kc-root .lx-lb-prev:hover,.kc-root .lx-lb-next:hover{background:var(--kc-accentDeep);color:var(--kc-onAccent)}
.kc-root .lx-lb-prev{left:8px}.kc-root .lx-lb-next{right:8px}
@media(max-width:640px){.kc-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.kc-root .lx-lb-media{min-height:220px}}

/* ── RASA polish: press feedback, resting depth, motion safety ── */
.kc-root{-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
.kc-btn-primary,.kc-cta-btn{box-shadow:0 6px 18px rgba(168,69,92,.18)}
.kc-btn-primary:active,.kc-cta-btn:active,.kc-nav-cta:active,.kc-btn-ghost:active,.kc-cta-ghost:active{transform:translateY(0) scale(.97)}
.kc-card{box-shadow:0 1px 3px rgba(42,29,34,.05)}
.kc-card:active{transform:translateY(-2px) scale(.992)}
.kc-tcar-btn:active{transform:scale(.94)}
.kc-hero-sub,.kc-subtext,.kc-about-body,.kc-cta-sub,.kc-step-desc,.kc-test-quote{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Istilah aspiratif/mood — BUKAN klaim regulasi (BPOM/vegan/cruelty-free) karena
// marquee ini tampil di SEMUA situs Embun; klaim spesifik milik tiap klien, ditaruh
// di konten yang bisa mereka edit (fitur/stats), bukan di-hardcode universal.
const MQ_ITEMS = ['GLASS SKIN', 'GLOW RITUAL', 'DEWY FINISH', 'KULIT SEHAT', 'SELF-CARE', 'RAWAT DIRI', 'SKINCARE HARIAN']

export default function KecantikanLuxRenderer({ content: c, variant = 'embun' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.embun
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
    '--kc-bg': p.bg, '--kc-bg2': p.bg2, '--kc-surface': p.surface,
    '--kc-ink': p.ink, '--kc-inkDim': p.inkDim, '--kc-muted': p.muted,
    '--kc-accent': p.accent, '--kc-accentDeep': p.accentDeep, '--kc-onAccent': p.onAccent,
    '--kc-champ': p.champ, '--kc-glowA': p.glowA, '--kc-glowB': p.glowB,
    '--kc-line': p.line, '--kc-line2': p.line2, '--kc-scrim': p.scrim,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const words = (hero.title ?? '').split(' ')

  return (
    <div className="kc-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: kcCss() }} />

      {/* NAV */}
      <nav className="kc-nav" aria-label="Navigasi utama">
        <span className="kc-nav-logo">{c.nama ?? 'Embun'}</span>
        <a href={waUrl} className="kc-nav-cta">Pesan Sekarang</a>
      </nav>

      {/* HERO */}
      <section className="kc-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="kc-hero-text">
          {hero.eyebrow && <p className="kc-hero-ew">{hero.eyebrow}</p>}
          <h1 className="kc-hero-title" aria-label={hero.title}>
            {words.map((w, i) => (
              <span key={i} style={{ '--kc-d': `${200 + i * 70}ms` } as React.CSSProperties}>
                {w}{' '}
              </span>
            ))}
          </h1>
          {hero.subtitle && <p className="kc-hero-sub">{hero.subtitle}</p>}
          <div className="kc-hero-btns">
            {hero.ctaHref && (
              <a href={hero.ctaHref} className="kc-btn-primary">{hero.ctaText ?? 'Lihat Produk'}</a>
            )}
            {(hero.ctaHref2 ?? waUrl) && (
              <a href={hero.ctaHref2 ?? waUrl} className="kc-btn-ghost">{hero.ctaText2 ?? 'Konsultasi Kulit'}</a>
            )}
          </div>
        </div>
        {hero.image && (
          <div className="kc-hero-media">
            <div className="kc-hero-frame">
              <img
                src={hero.image}
                alt={c.nama ?? 'Produk kecantikan'}
                loading="eager"
                style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
              />
            </div>
            {stats[0] && (
              <div className="kc-hero-badge"><b>{stats[0].angka}</b> {stats[0].label}</div>
            )}
          </div>
        )}
      </section>

      {/* MARQUEE */}
      <div className="kc-marquee" aria-hidden="true">
        <div className="kc-mq-track">
          {[...MQ_ITEMS, ...MQ_ITEMS].map((m, i) => (
            <span key={i} className="kc-mq-item">{m}</span>
          ))}
        </div>
      </div>

      {/* RITUAL — signature stepper bernomor (memakai data features) */}
      {features.length > 0 && (
        <section className="kc-section kc-ritual" id="ritual">
          <div className="kc-sec-hdr kc-rv lx-reveal">
            <p className="kc-eyebrow">{c.featuresEyebrow ?? 'Ritual Glow'}</p>
            {c.featuresTitle && <h2 className="kc-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="kc-ritual-grid">
            {features.slice(0, 4).map((f, i) => (
              <div key={i} className={`kc-step kc-rv lx-reveal kc-rv-d${i + 1}`}>
                <div className="kc-step-num">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="kc-step-title">{f.title}</h3>
                <p className="kc-step-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT */}
      {c.statement && (
        <div className="kc-statement">
          <div className="kc-stmt-inner kc-rv lx-reveal">
            {c.statement.eyebrow && <p className="kc-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="kc-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="kc-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* SHOWCASE */}
      {items.length > 0 && (
        <section className="kc-section kc-showcase" id="produk">
          <div className="kc-sec-hdr kc-rv lx-reveal">
            <p className="kc-eyebrow">Koleksi</p>
            {c.showcase?.title && <h2 className="kc-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="kc-subtext">{c.showcase.subtitle}</p>}
          </div>
          <div className="kc-grid lx-look">
            {items.map((item, i) => (
              <article
                key={i}
                className="kc-card lx-lb-open kc-rv lx-reveal"
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
                  <div className="kc-card-img">
                    <img src={item.gambar} alt={item.nama} loading="lazy" />
                  </div>
                )}
                <div className="kc-card-body">
                  <h3 className="kc-card-name">{item.nama}</h3>
                  {item.desc && <p className="kc-card-desc">{item.desc}</p>}
                  <div className="kc-card-foot">
                    <span className="kc-card-price">{fmt(item.harga ?? 0)}</span>
                    <span className="kc-card-ql">Lihat Detail →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="kc-section kc-about" id="tentang">
          <div className="kc-about-inner">
            <div className="kc-rv lx-reveal">
              <p className="kc-eyebrow">Cerita Kami</p>
              <h2 className="kc-heading">{c.about.title}</h2>
              <p className="kc-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="kc-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'}
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="kc-about-img kc-rv lx-reveal kc-rv-d2">
                <div className="kc-about-frame">
                  <img src={c.about.image} alt={c.about.title} loading="lazy" />
                </div>
                <div className="kc-about-tag">Glow</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="kc-section kc-stats">
          <div className="kc-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`kc-rv lx-reveal kc-rv-d${i + 1}`}>
                <div className="kc-stat-num" data-cu>{s.angka}</div>
                <div className="kc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS — carousel */}
      {testimonials.length > 0 && (
        <section className="kc-section kc-testimonials" id="ulasan">
          <div className="kc-sec-hdr kc-rv lx-reveal">
            <p className="kc-eyebrow">Ulasan</p>
            <h2 className="kc-heading">Kata Mereka</h2>
          </div>
          <div className="kc-tcar lx-tcar">
            <div className="kc-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="kc-test-card">
                  <div className="kc-test-mark">&ldquo;</div>
                  <p className="kc-test-quote">{t.quote}</p>
                  <p className="kc-test-name">{t.nama}</p>
                  {t.peran && <p className="kc-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="kc-tcar-ctrl">
                <button className="kc-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="kc-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="kc-dot lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="kc-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="kc-section kc-faq" id="faq">
          <div className="kc-sec-hdr kc-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.25rem' }}>
            <p className="kc-eyebrow">Pertanyaan</p>
            <h2 className="kc-heading">Sering Ditanyakan</h2>
          </div>
          <div className="kc-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="kc-faq-item">
                <button
                  className="kc-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`kc-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="kc-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="kc-section kc-cta" id="pesan">
          <div className="kc-cta-inner">
            <p className="kc-stmt-ew">Mulai Ritual Anda</p>
            <h2 className="kc-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="kc-cta-sub">{c.cta.subtitle}</p>}
            <div className="kc-cta-btns">
              <a href={waUrl} className="kc-cta-btn">{c.cta.ctaText ?? 'Pesan via WhatsApp'}</a>
              {hero.ctaHref && (
                <a href={hero.ctaHref} className="kc-cta-ghost">Lihat Produk</a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON (newsletter/career) — additive via content.bands */}
      {(c.bands ?? []).map((b, i) => (
        <section className="kc-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="kc-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="kc-heading">{b.title}</h2>
            {b.subtitle && <p className="kc-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="kc-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="kc-footer">
        <div className="kc-footer-grid">
          <div>
            <p className="kc-footer-brand">{c.nama ?? 'Embun'}</p>
            <p className="kc-footer-tagline">
              {hero.eyebrow ?? 'Perawatan kulit yang menyala dari dalam — lembut, jujur, dan teruji.'}
            </p>
          </div>
          <div>
            <p className="kc-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="kc-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="kc-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="kc-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="kc-footer-h">Jam Layanan</p>
            {c.info?.jam
              ? c.info.jam.map((j, i) => (
                  <p key={i} className="kc-footer-link">{j.hari}: {j.jam}</p>
                ))
              : (
                <>
                  <p className="kc-footer-link">Senin–Sabtu: 09.00–18.00</p>
                  <p className="kc-footer-link">Minggu: Tutup</p>
                </>
              )}
          </div>
        </div>
        <p className="kc-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Embun'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX — JS-driven via LUX_JS (class lx-lb-open + data-* on cards) */}
      <BespokeLightbox ctaText="Pesan via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
