'use client'
import { useState } from 'react'
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ============================================================
// SELARAS — Toko Rumah & Dekor Bespoke Lux Renderer (Japandi)
// Spectral (display, serif) + Hanken Grotesk (body) |
// Kapur #F4F1EA · Greige #EDE8DD · Arang #2C2A25 · Sage-slate #7C8574 |
// signature: bingkai produk "arched alcove" (ceruk lengkung) + bayangan
// natural lembut + ruang lapang (ma) | ns: rm-*
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.rm-*`.
// Light-calm Japandi — sengaja kontras dengan tema bespoke lain (dark/glow/heritage).
// ============================================================

export interface RmPal {
  bg: string; bg2: string; surface: string; surface2: string
  ink: string; inkDim: string; muted: string
  accent: string; accentDeep: string; onAccent: string
  line: string; line2: string; shadow: string; shadowDeep: string
}

export const PALETTES: Record<string, RmPal> = {
  // Selaras — greige hangat, kaca terang, aksen sage-slate kalem.
  selaras: {
    bg: '#F4F1EA', bg2: '#EDE8DD', surface: '#FBF9F4', surface2: '#F1ECE2',
    ink: '#2C2A25', inkDim: '#5A554C', muted: '#696456',
    accent: '#6F7A66', accentDeep: '#525B49', onAccent: '#F7F4EE',
    line: 'rgba(44,42,37,.12)', line2: 'rgba(44,42,37,.07)',
    shadow: 'rgba(58,50,38,.10)', shadowDeep: 'rgba(58,50,38,.16)',
  },
}

const FONT_IMPORT = 'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap'
const DISPLAY = '"Spectral","Georgia",serif'
const BODY = '"Hanken Grotesk","Segoe UI",sans-serif'
const EASE = 'cubic-bezier(.22,1,.36,1)'

function rmCss(): string {
  return `
@import url('${FONT_IMPORT}');
/* Guard tingkat-dokumen: cegah scroll horizontal dari bingkai/ruang lebar
   (satu tema per halaman → aman set di html/body). */
html,body{overflow-x:hidden;max-width:100%}
.rm-root{font-family:${BODY};color:var(--rm-ink);background:var(--rm-bg);line-height:1.75;-webkit-font-smoothing:antialiased;overflow-x:hidden;max-width:100%}
.rm-root *,.rm-root *::before,.rm-root *::after{box-sizing:border-box;margin:0;padding:0}
.rm-root img{max-width:100%;height:auto;display:block}
.rm-root ::selection{background:rgba(111,122,102,.22);color:var(--rm-ink)}

/* Bingkai signature: "arched alcove" — ceruk lengkung lembut. */
.rm-arch{position:relative;overflow:hidden;background:var(--rm-surface2);border-radius:50% 50% 14px 14px / 24% 24% 4px 4px}
.rm-arch img{width:100%;height:100%;object-fit:cover}

/* NAV */
.rm-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.25rem 7vw;display:flex;align-items:center;justify-content:space-between;transition:background .45s,box-shadow .45s,backdrop-filter .45s,padding .45s}
.rm-root.lx-scrolled .rm-nav{background:rgba(244,241,234,.82);backdrop-filter:blur(11px);box-shadow:0 1px 0 var(--rm-line);padding-top:.95rem;padding-bottom:.95rem}
.rm-nav-logo{font-family:${DISPLAY};font-weight:500;letter-spacing:.01em;color:var(--rm-ink);font-size:1.45rem;text-decoration:none;display:flex;align-items:center;gap:.55rem}
.rm-nav-logo::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--rm-accent)}
.rm-nav-cta{font-size:.82rem;font-weight:600;letter-spacing:.02em;color:var(--rm-onAccent);background:var(--rm-accentDeep);padding:.7rem 1.4rem;border-radius:999px;text-decoration:none;transition:transform .3s ${EASE},background .3s}
.rm-nav-cta:hover{transform:translateY(-2px);background:var(--rm-ink)}

.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:130px;opacity:0;pointer-events:none}

/* HERO — terang, lapang, asimetris; bingkai arched alcove + bayangan natural */
.rm-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:clamp(2rem,5vw,5rem);padding:9rem 7vw 5rem;background:var(--rm-bg)}
.rm-hero::before{content:'';position:absolute;left:0;right:0;bottom:0;height:42%;background:linear-gradient(180deg,transparent,var(--rm-bg2));z-index:0;pointer-events:none}
.rm-hero-text{position:relative;z-index:2}
.rm-hero-ew{font-size:.74rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--rm-accentDeep);margin-bottom:1.5rem;display:inline-flex;align-items:center;gap:.7rem}
.rm-hero-ew::before{content:'';width:2rem;height:1px;background:var(--rm-accent)}
.rm-hero-title{font-family:${DISPLAY};font-size:clamp(2.7rem,6vw,5rem);font-weight:400;line-height:1.08;color:var(--rm-ink);margin-bottom:1.6rem;letter-spacing:-.01em}
.rm-hero-title span{display:inline;opacity:1}
@media(prefers-reduced-motion:no-preference){.rm-hero-title span{animation:rmRise .8s ${EASE} both;animation-delay:var(--rm-d,0ms)}}
@keyframes rmRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.rm-hero-title em{font-style:italic;color:var(--rm-accent)}
.rm-hero-sub{font-size:1.1rem;color:var(--rm-inkDim);margin-bottom:2.2rem;max-width:46ch;line-height:1.85}
.rm-hero-btns{display:flex;gap:1rem;flex-wrap:wrap;align-items:center;margin-bottom:2.4rem}
.rm-btn-primary{font-size:.9rem;font-weight:600;letter-spacing:.01em;background:var(--rm-accentDeep);color:var(--rm-onAccent);padding:.95rem 2rem;border-radius:999px;text-decoration:none;transition:transform .3s ${EASE},background .3s,box-shadow .3s;box-shadow:0 6px 18px var(--rm-shadow)}
.rm-btn-primary:hover{transform:translateY(-2px);background:var(--rm-ink);box-shadow:0 12px 28px var(--rm-shadowDeep)}
.rm-btn-ghost{font-size:.9rem;font-weight:600;color:var(--rm-ink);padding:.95rem .6rem;text-decoration:none;border-bottom:1px solid var(--rm-accent);transition:color .3s,border-color .3s}
.rm-btn-ghost:hover{color:var(--rm-accentDeep)}
/* Hero detail-strip — chip kalem dari stats (data klien, bukan klaim hardcoded) */
.rm-hero-meta{display:flex;flex-wrap:wrap;gap:1.6rem}
.rm-meta-item{display:flex;flex-direction:column;gap:.15rem}
.rm-meta-num{font-family:${DISPLAY};font-size:1.5rem;font-weight:500;color:var(--rm-ink);line-height:1;font-variant-numeric:tabular-nums}
.rm-meta-label{font-size:.74rem;color:var(--rm-muted);letter-spacing:.04em}
.rm-hero-media{position:relative;z-index:1;display:flex;align-items:center;justify-content:center}
.rm-hero-frame{position:relative;width:100%;max-width:430px;aspect-ratio:4/5}
.rm-hero-frame .rm-arch{width:100%;height:100%;box-shadow:0 40px 80px var(--rm-shadowDeep)}
.rm-hero-badge{position:absolute;bottom:1.4rem;left:-1.2rem;z-index:3;display:flex;align-items:center;gap:.6rem;font-size:.82rem;color:var(--rm-ink);background:var(--rm-surface);border:1px solid var(--rm-line);padding:.7rem 1.1rem;border-radius:14px;box-shadow:0 14px 30px var(--rm-shadow)}
.rm-hero-badge b{font-family:${DISPLAY};color:var(--rm-accentDeep);font-weight:600;font-size:1.05rem}
.rm-hero-frame::after{content:'';position:absolute;right:-1.1rem;top:-1.1rem;width:62px;height:62px;border:1px solid var(--rm-accent);border-radius:50% 50% 8px 8px / 30% 30% 4px 4px;opacity:.45;z-index:-1}
@media(max-width:860px){
  .rm-hero{grid-template-columns:1fr;min-height:unset;padding:7.5rem 7vw 3.5rem;text-align:center}
  .rm-hero-title{font-size:clamp(2.2rem,9vw,3.2rem)}
  .rm-hero-media{order:-1;margin-bottom:1rem}
  .rm-hero-frame{max-width:300px;aspect-ratio:1/1.1}
  .rm-hero-sub{margin-left:auto;margin-right:auto}
  .rm-hero-btns,.rm-hero-meta,.rm-hero-ew{justify-content:center}
  .rm-hero-meta{gap:1.4rem}
  .rm-hero-badge{left:50%;transform:translateX(-50%)}
}
@media(max-width:560px){.rm-nav{padding:1rem 6vw}.rm-nav-cta{padding:.6rem 1rem;font-size:.76rem}}

/* ETHOS — pita kata kalem (mood, BUKAN klaim) ganti marquee */
.rm-ethos{background:var(--rm-bg2);border-top:1px solid var(--rm-line2);border-bottom:1px solid var(--rm-line2);padding:1.5rem 7vw}
.rm-ethos-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1.1rem 1.8rem}
.rm-ethos-item{font-size:.76rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--rm-muted);display:flex;align-items:center;gap:1.8rem}
.rm-ethos-item::after{content:'';width:4px;height:4px;border-radius:50%;background:var(--rm-accent);opacity:.6}
.rm-ethos-item:last-child::after{display:none}

/* SECTION COMMONS */
.rm-section{padding:clamp(4.5rem,9vw,8rem) 7vw}
.rm-eyebrow{font-size:.74rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--rm-accentDeep);margin-bottom:1rem;display:inline-flex;align-items:center;gap:.6rem}
.rm-eyebrow::before{content:'';width:1.6rem;height:1px;background:var(--rm-accent)}
.rm-heading{font-family:${DISPLAY};font-size:clamp(2rem,3.6vw,3.1rem);font-weight:400;color:var(--rm-ink);line-height:1.16;letter-spacing:-.01em;text-wrap:balance}
.rm-subtext{color:var(--rm-inkDim);font-size:1.02rem;margin-top:1rem;max-width:56ch;line-height:1.85}
.rm-sec-hdr{margin-bottom:3.5rem;max-width:60ch}

/* FEATURES — "Pendekatan": kartu kalem bernomor serif, banyak ruang */
.rm-feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem}
.rm-feat-card{padding:2rem 1.6rem;background:var(--rm-surface);border:1px solid var(--rm-line);border-radius:18px;transition:transform .35s ${EASE},box-shadow .35s,border-color .35s}
.rm-feat-card:hover{transform:translateY(-5px);box-shadow:0 20px 44px var(--rm-shadow);border-color:rgba(111,122,102,.3)}
.rm-feat-idx{font-family:${DISPLAY};font-size:1.05rem;font-weight:500;color:var(--rm-accentDeep);width:2.6rem;height:2.6rem;display:flex;align-items:center;justify-content:center;border:1px solid var(--rm-line);border-radius:50%;margin-bottom:1.3rem}
.rm-feat-title{font-family:${DISPLAY};font-size:1.2rem;font-weight:500;color:var(--rm-ink);margin-bottom:.55rem;line-height:1.3}
.rm-feat-desc{font-size:.9rem;color:var(--rm-muted);line-height:1.75}
@media(max-width:900px){.rm-feat-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.rm-feat-grid{grid-template-columns:1fr}}

/* STATEMENT — kalimat tenang serif (BUKAN quote sinematik italic) + rule sage */
.rm-statement{background:var(--rm-bg);padding:clamp(4.5rem,8vw,7rem) 7vw;text-align:center}
.rm-stmt-inner{max-width:50ch;margin:0 auto}
.rm-stmt-mark{width:2.4rem;height:1px;background:var(--rm-accent);margin:0 auto 1.8rem}
.rm-stmt-ew{font-size:.74rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--rm-accentDeep);margin-bottom:1.3rem}
.rm-stmt-quote{font-family:${DISPLAY};font-size:clamp(1.5rem,3vw,2.4rem);font-weight:400;color:var(--rm-ink);line-height:1.38;letter-spacing:-.005em}
.rm-stmt-cite{display:block;font-size:.82rem;color:var(--rm-muted);letter-spacing:.04em;margin-top:1.5rem}

/* SHOWCASE — grid kartu arched alcove + bayangan natural + quick-look */
.rm-showcase{background:var(--rm-bg2)}
.rm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.5rem,3vw,2.4rem)}
.rm-card{position:relative;cursor:pointer;background:transparent;transition:transform .4s ${EASE}}
.rm-card:hover{transform:translateY(-6px)}
.rm-card-frame{position:relative;aspect-ratio:3/4;margin-bottom:1.1rem;box-shadow:0 18px 40px var(--rm-shadow);transition:box-shadow .4s ${EASE}}
.rm-card:hover .rm-card-frame{box-shadow:0 30px 60px var(--rm-shadowDeep)}
.rm-card-frame .rm-arch{width:100%;height:100%}
.rm-card-frame .rm-arch img{transition:transform .6s ${EASE}}
.rm-card:hover .rm-card-frame .rm-arch img{transform:scale(1.05)}
.rm-card-cat{position:absolute;top:1rem;left:50%;transform:translateX(-50%);z-index:2;font-size:.62rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--rm-ink);background:rgba(251,249,244,.92);padding:.32rem .7rem;border-radius:999px;backdrop-filter:blur(4px)}
.rm-card-body{padding:0 .4rem;text-align:center}
.rm-card-name{font-family:${DISPLAY};font-size:1.22rem;font-weight:500;color:var(--rm-ink);margin-bottom:.3rem;line-height:1.3}
.rm-card-desc{font-size:.85rem;color:var(--rm-muted);margin-bottom:.7rem;line-height:1.65;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.rm-card-foot{display:flex;align-items:center;justify-content:center;gap:.6rem}
.rm-card-price{font-family:${DISPLAY};font-size:1.1rem;font-weight:500;color:var(--rm-accentDeep)}
.rm-card-sep{width:3px;height:3px;border-radius:50%;background:var(--rm-muted);opacity:.5}
.rm-card-ql{font-size:.72rem;font-weight:600;letter-spacing:.04em;color:var(--rm-muted);transition:color .3s}
.rm-card:hover .rm-card-ql{color:var(--rm-accentDeep)}
@media(max-width:980px){.rm-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.rm-grid{grid-template-columns:1fr;max-width:340px;margin:0 auto}}

/* ABOUT — split terang + bingkai arched */
.rm-about{background:var(--rm-bg)}
.rm-about-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:center}
.rm-about-body{font-size:1.02rem;color:var(--rm-inkDim);line-height:1.95;margin-top:1.2rem;white-space:pre-line}
.rm-about-cta{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.9rem;font-size:.86rem;font-weight:600;letter-spacing:.02em;color:var(--rm-accentDeep);text-decoration:none;border-bottom:1px solid var(--rm-accent);padding-bottom:3px;transition:gap .3s}
.rm-about-cta:hover{gap:.85rem}
.rm-about-img{position:relative}
.rm-about-frame{position:relative;z-index:1;aspect-ratio:4/5;box-shadow:0 30px 64px var(--rm-shadowDeep)}
.rm-about-frame .rm-arch{width:100%;height:100%}
.rm-about-tag{position:absolute;z-index:2;bottom:1.2rem;right:-1.1rem;font-family:${DISPLAY};font-style:italic;font-size:.92rem;color:var(--rm-ink);background:var(--rm-surface);border:1px solid var(--rm-line);padding:.55rem 1rem;border-radius:12px;box-shadow:0 12px 28px var(--rm-shadow)}
@media(max-width:840px){.rm-about-inner{grid-template-columns:1fr;gap:2.5rem}.rm-about-img{order:-1;max-width:360px;margin:0 auto}}

/* STATS — angka serif ber-countUp */
.rm-stats{background:var(--rm-bg2);border-top:1px solid var(--rm-line2);border-bottom:1px solid var(--rm-line2)}
.rm-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;text-align:center}
.rm-stat-num{font-family:${DISPLAY};font-size:clamp(2.4rem,4.6vw,3.4rem);font-weight:500;color:var(--rm-ink);line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.rm-stat-label{font-size:.78rem;color:var(--rm-muted);letter-spacing:.06em;margin-top:.8rem}
@media(max-width:560px){.rm-stats-grid{grid-template-columns:repeat(2,1fr);gap:2.2rem}}

/* TESTIMONIALS — carousel scroll-snap (lx-tcar), kartu tenang */
.rm-testimonials{background:var(--rm-bg)}
.rm-tcar{position:relative}
.rm-tcar-track{display:flex;gap:1.3rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .25rem 1.5rem;-ms-overflow-style:none;scrollbar-width:none}
.rm-tcar-track::-webkit-scrollbar{display:none}
.rm-test-card{scroll-snap-align:start;background:var(--rm-surface);border:1px solid var(--rm-line);border-radius:20px;padding:2.1rem;min-width:300px;max-width:360px;flex:0 0 auto;box-shadow:0 12px 30px var(--rm-shadow)}
.rm-test-mark{font-family:${DISPLAY};font-size:2.6rem;font-weight:500;color:var(--rm-accent);opacity:.4;line-height:.5;margin-bottom:.6rem}
.rm-test-quote{font-family:${DISPLAY};font-size:1.02rem;color:var(--rm-inkDim);line-height:1.7;margin:0 0 1.5rem;font-style:italic}
.rm-test-name{font-weight:600;font-size:.95rem;color:var(--rm-ink)}
.rm-test-role{font-size:.78rem;color:var(--rm-muted);margin-top:.2rem}
.rm-tcar-ctrl{display:flex;align-items:center;justify-content:center;gap:1.1rem;margin-top:1.5rem}
.rm-tcar-btn{width:44px;height:44px;border-radius:50%;background:var(--rm-surface);border:1px solid var(--rm-line);color:var(--rm-ink);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s,color .25s,border-color .25s,opacity .25s}
.rm-tcar-btn:hover:not(:disabled){background:var(--rm-accentDeep);color:var(--rm-onAccent);border-color:var(--rm-accentDeep)}
.rm-tcar-btn:disabled{opacity:.3;cursor:default}
.rm-tcar-dots{display:flex;gap:.5rem;align-items:center}
.rm-dot{width:7px;height:7px;border-radius:50%;background:var(--rm-line);border:none;padding:0;cursor:pointer;transition:background .25s,transform .25s}
.rm-dot[aria-current="true"]{background:var(--rm-accent);transform:scale(1.5)}

/* FAQ */
.rm-faq{background:var(--rm-bg2)}
.rm-faq-wrap{max-width:760px;margin:0 auto}
.rm-faq-item{border-bottom:1px solid var(--rm-line)}
.rm-faq-q{display:flex;justify-content:space-between;align-items:center;gap:1rem;width:100%;padding:1.5rem 0;cursor:pointer;font-family:${DISPLAY};font-size:1.15rem;font-weight:500;color:var(--rm-ink);background:none;border:none;text-align:left}
.rm-faq-q:focus-visible{outline:2px solid var(--rm-accent);outline-offset:3px;border-radius:3px}
.rm-faq-icon{font-size:1.3rem;color:var(--rm-accentDeep);flex-shrink:0;transition:transform .3s ${EASE};line-height:1}
.rm-faq-icon.open{transform:rotate(45deg)}
.rm-faq-a{font-size:.96rem;color:var(--rm-inkDim);line-height:1.85;padding-bottom:1.5rem;max-width:64ch}

/* CTA — panel greige tenang */
.rm-cta{background:var(--rm-bg)}
.rm-cta-inner{position:relative;background:var(--rm-bg2);border:1px solid var(--rm-line);border-radius:28px;padding:clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem);text-align:center;overflow:hidden}
.rm-cta-inner::after{content:'';position:absolute;right:-60px;bottom:-60px;width:200px;height:200px;border:1px solid var(--rm-accent);border-radius:50% 50% 16px 16px / 30% 30% 6px 6px;opacity:.25;pointer-events:none}
.rm-cta-title{font-family:${DISPLAY};font-size:clamp(2rem,4.4vw,3.2rem);font-weight:400;color:var(--rm-ink);margin-bottom:1rem;line-height:1.16;letter-spacing:-.01em;text-wrap:balance}
.rm-cta-sub{font-size:1.05rem;color:var(--rm-inkDim);max-width:48ch;margin:0 auto 2.4rem;line-height:1.85}
.rm-cta-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}

/* BAND ADD-ON */
.rm-band{background:var(--rm-surface);border-top:1px solid var(--rm-line2);border-bottom:1px solid var(--rm-line2);padding:3.5rem 7vw;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.5rem}
.rm-band-ew{font-size:.72rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--rm-accentDeep);margin-bottom:.55rem}
.rm-band .rm-heading{font-size:clamp(1.5rem,2.4vw,2.1rem)}
.rm-band-sub{color:var(--rm-muted);font-size:.96rem;line-height:1.7;margin-top:.55rem;max-width:56ch}

/* FOOTER */
.rm-footer{background:var(--rm-bg2);color:var(--rm-inkDim);padding:4.5rem 7vw 2.5rem;border-top:1px solid var(--rm-line)}
.rm-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;margin-bottom:2.8rem}
.rm-footer-brand{font-family:${DISPLAY};font-size:1.65rem;font-weight:500;color:var(--rm-ink);margin-bottom:.9rem;display:flex;align-items:center;gap:.55rem}
.rm-footer-brand::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--rm-accent)}
.rm-footer-tagline{font-size:.9rem;color:var(--rm-muted);line-height:1.75;max-width:34ch}
.rm-footer-h{font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--rm-ink);margin-bottom:1.1rem}
.rm-footer-link{display:block;font-size:.9rem;color:var(--rm-inkDim);text-decoration:none;margin-bottom:.6rem;transition:color .25s}
.rm-footer-link:hover{color:var(--rm-accentDeep)}
.rm-footer-copy{border-top:1px solid var(--rm-line);padding-top:1.6rem;font-size:.8rem;color:var(--rm-muted);text-align:center}
@media(max-width:768px){.rm-footer-grid{grid-template-columns:1fr;gap:2rem}}

/* REVEAL — via primitive LUX_JS (.lx-reveal → .lx-in), digate .lx-js: tanpa JS /
   sample statis = konten tampil penuh (kontrak lux-script). */
.lx-js .rm-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ${EASE},transform .7s ${EASE}}
.lx-js .rm-rv.lx-in{opacity:1;transform:none}
.rm-rv-d1{transition-delay:.08s}.rm-rv-d2{transition-delay:.16s}.rm-rv-d3{transition-delay:.24s}.rm-rv-d4{transition-delay:.32s}

/* LIGHTBOX — rm-root overrides untuk palet lx-lb (terang/calm) */
.rm-root .lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.rm-root .lx-lb[hidden]{display:none}
.rm-root .lx-lb-back{position:absolute;inset:0;background:rgba(44,42,37,.42);backdrop-filter:blur(6px);border:0;cursor:pointer}
.rm-root .lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;max-width:880px;width:100%;max-height:88vh;background:var(--rm-surface);border:1px solid var(--rm-line);border-radius:24px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .42s ${EASE},transform .42s ${EASE}}
.rm-root .lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.rm-root .lx-lb-media{position:relative;overflow:hidden;background:var(--rm-surface2);min-height:300px}
.rm-root .lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.rm-root .lx-lb-body{padding:clamp(22px,3vw,42px);display:flex;flex-direction:column;gap:9px;justify-content:center}
.rm-root .lx-lb-cat{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--rm-accentDeep)}
.rm-root .lx-lb-title{font-family:${DISPLAY};font-size:clamp(22px,2.6vw,30px);font-weight:500;line-height:1.2;color:var(--rm-ink)}
.rm-root .lx-lb-price{font-family:${DISPLAY};font-size:20px;font-weight:500;color:var(--rm-accentDeep)}
.rm-root .lx-lb-desc{color:var(--rm-muted);font-size:13.5px;line-height:1.8}
.rm-root .lx-lb-cta{margin-top:14px;width:fit-content;display:inline-flex;align-items:center;background:var(--rm-accentDeep);color:var(--rm-onAccent);font-size:13px;font-weight:600;padding:12px 24px;border-radius:999px;text-decoration:none;letter-spacing:.02em;transition:background .25s}
.rm-root .lx-lb-cta:hover{background:var(--rm-ink)}
.rm-root .lx-lb-x{position:absolute;top:12px;right:12px;z-index:3;width:40px;height:40px;border-radius:50%;background:var(--rm-surface);border:1px solid var(--rm-line);color:var(--rm-ink);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.rm-root .lx-lb-x:hover{background:var(--rm-accentDeep);color:var(--rm-onAccent);border-color:var(--rm-accentDeep)}
.rm-root .lx-lb-prev,.rm-root .lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:40px;height:40px;border-radius:50%;background:var(--rm-surface);border:1px solid var(--rm-line);color:var(--rm-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.rm-root .lx-lb-prev:hover,.rm-root .lx-lb-next:hover{background:var(--rm-accentDeep);color:var(--rm-onAccent)}
.rm-root .lx-lb-prev{left:8px}.rm-root .lx-lb-next{right:8px}
@media(max-width:640px){.rm-root .lx-lb-panel{grid-template-columns:1fr;overflow-y:auto}.rm-root .lx-lb-media{min-height:230px}}

/* ── RASA polish: press feedback, motion safety ── */
.rm-root{-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
.rm-btn-primary:active,.rm-nav-cta:active{transform:translateY(0) scale(.97)}
.rm-card:active{transform:translateY(-3px) scale(.994)}
.rm-tcar-btn:active{transform:scale(.94)}
.rm-nav-cta:focus-visible,.rm-btn-primary:focus-visible,.rm-btn-ghost:focus-visible,.rm-about-cta:focus-visible,.rm-footer-link:focus-visible,.rm-card:focus-visible,.rm-tcar-btn:focus-visible,.rm-dot:focus-visible,.rm-cta-btns a:focus-visible{outline:2px solid var(--rm-accentDeep);outline-offset:3px}
.rm-hero-sub,.rm-subtext,.rm-about-body,.rm-cta-sub,.rm-feat-desc,.rm-test-quote{text-wrap:pretty}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
}

// Kata mood kalem — sengaja BUKAN klaim verifiable (garansi/original/dll) karena
// tampil di SEMUA situs Selaras; klaim spesifik milik tiap klien, ditaruh di
// konten yang bisa mereka edit (fitur/stats), bukan di-hardcode universal.
const ETHOS = ['Ruang', 'Material', 'Cahaya', 'Tekstur', 'Ketenangan']

export default function RumahLuxRenderer({ content: c, variant = 'selaras' }: BespokeProps) {
  const p = PALETTES[variant] ?? PALETTES.selaras
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
    '--rm-bg': p.bg, '--rm-bg2': p.bg2, '--rm-surface': p.surface, '--rm-surface2': p.surface2,
    '--rm-ink': p.ink, '--rm-inkDim': p.inkDim, '--rm-muted': p.muted,
    '--rm-accent': p.accent, '--rm-accentDeep': p.accentDeep, '--rm-onAccent': p.onAccent,
    '--rm-line': p.line, '--rm-line2': p.line2, '--rm-shadow': p.shadow, '--rm-shadowDeep': p.shadowDeep,
  } as React.CSSProperties

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const words = (hero.title ?? '').split(' ')

  return (
    <div className="rm-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: rmCss() }} />

      {/* NAV */}
      <nav className="rm-nav" aria-label="Navigasi utama">
        <span className="rm-nav-logo">{c.nama ?? 'Selaras'}</span>
        <a href={waUrl} className="rm-nav-cta">Tanya Stok</a>
      </nav>

      {/* HERO */}
      <section className="rm-hero" id="beranda" aria-label="Hero">
        <span className="lx-sentinel" aria-hidden />
        <div className="rm-hero-text">
          {hero.eyebrow && <p className="rm-hero-ew">{hero.eyebrow}</p>}
          {hero.title && (
            <h1 className="rm-hero-title" aria-label={hero.title}>
              {words.map((w, i) => (
                <span key={i} style={{ '--rm-d': `${160 + i * 70}ms` } as React.CSSProperties}>
                  {w}{' '}
                </span>
              ))}
            </h1>
          )}
          {hero.subtitle && <p className="rm-hero-sub">{hero.subtitle}</p>}
          <div className="rm-hero-btns">
            {hero.ctaHref && (
              <a href={hero.ctaHref} className="rm-btn-primary lx-mag">{hero.ctaText ?? 'Lihat Koleksi'}</a>
            )}
            <a href={hero.ctaHref2 ?? waUrl} className="rm-btn-ghost">{hero.ctaText2 ?? 'Konsultasi'}</a>
          </div>
          {stats.length > 0 && (
            <div className="rm-hero-meta">
              {stats.slice(0, 3).map((s, i) => (
                <div key={i} className="rm-meta-item">
                  <span className="rm-meta-num">{s.angka}</span>
                  <span className="rm-meta-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {hero.image && (
          <div className="rm-hero-media">
            <div className="rm-hero-frame">
              <div className="rm-arch">
                <img
                  src={hero.image}
                  alt={c.nama ?? 'Interior rumah'}
                  loading="eager"
                  style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
                />
              </div>
              {stats[0] && (
                <div className="rm-hero-badge"><b>{stats[0].angka}</b> {stats[0].label}</div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ETHOS — pita kata kalem (ganti marquee) */}
      <div className="rm-ethos" aria-hidden="true">
        <div className="rm-ethos-row">
          {ETHOS.map((m, i) => (
            <span key={i} className="rm-ethos-item">{m}</span>
          ))}
        </div>
      </div>

      {/* FEATURES — Pendekatan */}
      {features.length > 0 && (
        <section className="rm-section" id="pendekatan">
          <div className="rm-sec-hdr rm-rv lx-reveal">
            <p className="rm-eyebrow">{c.featuresEyebrow ?? 'Pendekatan Kami'}</p>
            {c.featuresTitle && <h2 className="rm-heading">{c.featuresTitle}</h2>}
          </div>
          <div className="rm-feat-grid">
            {features.slice(0, 4).map((f, i) => (
              <div key={i} className={`rm-feat-card rm-rv lx-reveal rm-rv-d${i + 1}`}>
                <div className="rm-feat-idx">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="rm-feat-title">{f.title}</h3>
                <p className="rm-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATEMENT */}
      {c.statement && (
        <div className="rm-statement">
          <div className="rm-stmt-inner rm-rv lx-reveal">
            <div className="rm-stmt-mark" aria-hidden />
            {c.statement.eyebrow && <p className="rm-stmt-ew">{c.statement.eyebrow}</p>}
            <blockquote className="rm-stmt-quote">{c.statement.quote}</blockquote>
            {c.statement.cite && <cite className="rm-stmt-cite">— {c.statement.cite}</cite>}
          </div>
        </div>
      )}

      {/* SHOWCASE */}
      {items.length > 0 && (
        <section className="rm-section rm-showcase" id="koleksi">
          <div className="rm-sec-hdr rm-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.5rem' }}>
            <p className="rm-eyebrow" style={{ justifyContent: 'center' }}>Koleksi</p>
            {c.showcase?.title && <h2 className="rm-heading">{c.showcase.title}</h2>}
            {c.showcase?.subtitle && <p className="rm-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{c.showcase.subtitle}</p>}
          </div>
          <div className="rm-grid lx-look">
            {items.map((item, i) => (
              <article
                key={i}
                className="rm-card lx-lb-open rm-rv lx-reveal"
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
                <div className="rm-card-frame">
                  {item.kategori && <span className="rm-card-cat">{item.kategori}</span>}
                  <div className="rm-arch">
                    {item.gambar && <img src={item.gambar} alt={item.nama} loading="lazy" />}
                  </div>
                </div>
                <div className="rm-card-body">
                  <h3 className="rm-card-name">{item.nama}</h3>
                  {item.desc && <p className="rm-card-desc">{item.desc}</p>}
                  <div className="rm-card-foot">
                    <span className="rm-card-price">{fmt(item.harga ?? 0)}</span>
                    <span className="rm-card-sep" aria-hidden />
                    <span className="rm-card-ql">Lihat detail</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {c.about && (
        <section className="rm-section rm-about" id="tentang">
          <div className="rm-about-inner">
            <div className="rm-rv lx-reveal">
              <p className="rm-eyebrow">Tentang Kami</p>
              <h2 className="rm-heading">{c.about.title}</h2>
              <p className="rm-about-body">{c.about.body}</p>
              {c.about.ctaHref && (
                <a href={c.about.ctaHref} className="rm-about-cta">
                  {c.about.ctaText ?? 'Pelajari lebih lanjut'} →
                </a>
              )}
            </div>
            {c.about.image && (
              <div className="rm-about-img rm-rv lx-reveal rm-rv-d2">
                <div className="rm-about-frame">
                  <div className="rm-arch">
                    <img src={c.about.image} alt={c.about.title} loading="lazy" />
                  </div>
                </div>
                <div className="rm-about-tag">ruang &amp; napas</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="rm-section rm-stats">
          <div className="rm-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`rm-rv lx-reveal rm-rv-d${i + 1}`}>
                <div className="rm-stat-num" data-cu>{s.angka}</div>
                <div className="rm-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="rm-section rm-testimonials" id="ulasan">
          <div className="rm-sec-hdr rm-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="rm-eyebrow" style={{ justifyContent: 'center' }}>Ulasan</p>
            <h2 className="rm-heading">Kata Penghuni Rumah</h2>
          </div>
          <div className="rm-tcar lx-tcar">
            <div className="rm-tcar-track lx-tcar-track">
              {testimonials.map((t, i) => (
                <div key={i} className="rm-test-card">
                  <div className="rm-test-mark" aria-hidden>&ldquo;</div>
                  <p className="rm-test-quote">{t.quote}</p>
                  <p className="rm-test-name">{t.nama}</p>
                  {t.peran && <p className="rm-test-role">{t.peran}</p>}
                </div>
              ))}
            </div>
            {testimonials.length > 1 && (
              <div className="rm-tcar-ctrl">
                <button className="rm-tcar-btn lx-tprev" aria-label="Ulasan sebelumnya">‹</button>
                <div className="rm-tcar-dots">
                  {testimonials.map((_, i) => (
                    <button key={i} className="rm-dot lx-dot" aria-current={i === 0 ? 'true' : 'false'} aria-label={`Ulasan ${i + 1}`} />
                  ))}
                </div>
                <button className="rm-tcar-btn lx-tnext" aria-label="Ulasan berikutnya">›</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="rm-section rm-faq" id="faq">
          <div className="rm-sec-hdr rm-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            <p className="rm-eyebrow" style={{ justifyContent: 'center' }}>Pertanyaan</p>
            <h2 className="rm-heading">Sering Ditanyakan</h2>
          </div>
          <div className="rm-faq-wrap">
            {faqs.map((f, i) => (
              <div key={i} className="rm-faq-item">
                <button
                  className="rm-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`rm-faq-icon${openFaq === i ? ' open' : ''}`} aria-hidden="true">+</span>
                </button>
                {openFaq === i && <p className="rm-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {c.cta && (
        <section className="rm-section rm-cta" id="pesan">
          <div className="rm-cta-inner rm-rv lx-reveal">
            <h2 className="rm-cta-title">{c.cta.title}</h2>
            {c.cta.subtitle && <p className="rm-cta-sub">{c.cta.subtitle}</p>}
            <div className="rm-cta-btns">
              <a href={waUrl} className="rm-btn-primary lx-mag">{c.cta.ctaText ?? 'Konsultasi via WhatsApp'}</a>
              {hero.ctaHref && (
                <a href={hero.ctaHref} className="rm-btn-ghost">Lihat Koleksi</a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* BAND ADD-ON (newsletter/career) — additive via content.bands */}
      {(c.bands ?? []).map((b, i) => (
        <section className="rm-band" data-band={b.preset} key={`${b.preset}-${i}`}>
          <div>
            <p className="rm-band-ew">{b.preset === 'career' ? 'Karier' : b.preset === 'newsletter' ? 'Buletin' : 'Info'}</p>
            <h2 className="rm-heading">{b.title}</h2>
            {b.subtitle && <p className="rm-band-sub">{b.subtitle}</p>}
          </div>
          {b.ctaText && <a className="rm-btn-primary" href={b.ctaHref ?? waUrl}>{b.ctaText}</a>}
        </section>
      ))}

      {/* FOOTER */}
      <footer className="rm-footer">
        <div className="rm-footer-grid">
          <div>
            <p className="rm-footer-brand">{c.nama ?? 'Selaras'}</p>
            <p className="rm-footer-tagline">
              {hero.eyebrow ?? 'Mebel dan dekorasi pilihan untuk rumah yang menenangkan.'}
            </p>
          </div>
          <div>
            <p className="rm-footer-h">Kontak</p>
            {wa && <a href={waUrl} className="rm-footer-link">WhatsApp</a>}
            {c.contact?.email && (
              <a href={`mailto:${c.contact.email}`} className="rm-footer-link">{c.contact.email}</a>
            )}
            {c.contact?.alamat && <p className="rm-footer-link">{c.contact.alamat}</p>}
          </div>
          <div>
            <p className="rm-footer-h">Jam Buka</p>
            {c.info?.jam
              ? c.info.jam.map((j, i) => (
                  <p key={i} className="rm-footer-link">{j.hari}: {j.jam}</p>
                ))
              : (
                <>
                  <p className="rm-footer-link">Senin–Sabtu: 09.00–17.00</p>
                  <p className="rm-footer-link">Minggu: Tutup</p>
                </>
              )}
          </div>
        </div>
        <p className="rm-footer-copy">
          © {new Date().getFullYear()} {c.nama ?? 'Selaras'}. Semua hak cipta dilindungi.
        </p>
      </footer>

      {/* LIGHTBOX — JS-driven via LUX_JS (class lx-lb-open + data-* on cards) */}
      <BespokeLightbox ctaText="Konsultasi via WhatsApp" />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
