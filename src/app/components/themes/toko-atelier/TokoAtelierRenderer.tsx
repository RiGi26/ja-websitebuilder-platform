// ============================================================
// TOKO-ATELIER — renderer bespoke FLAGSHIP (Opsi A) untuk toko/fashion.
// Arah seni "Atelier Noir": maison gelap-hangat tempat busana disorot seperti
// artefak — Fraunces (serif editorial, optical sizing) + Archivo (grotesque),
// panggung near-black, aksen champagne dipakai hemat sebagai tanda tangan.
//
// Mengonsumsi ComposableContent yang SAMA dengan jalur composable → nol
// plumbing data baru (pola RestaurantLuxRenderer). Di-route oleh
// theme==='toko-atelier' di SiteRenderer (dark-launch; tak ada di taxonomy).
//
// Interaksi = ATELIER_JS (IIFE vanilla, di-inject inline) — WAJIB pola ini,
// bukan CeReveal/useEffect, supaya animasi hidup di static sample (file://)
// sekaligus produksi SSR. Tanpa JS konten tampil penuh (gate .ta-js).
// Font via @import di CSS string (preview + produksi + test, tanpa next/font).
//
// Tombol keranjang di-inject via prop slot `CartButton` (SiteRenderer mengirim
// AtelierCartButton saat hasCart) — bukan import langsung, supaya graph
// generator statis (scripts/gen-atelier-entry.tsx, tsc→node) bebas alias `@/`
// dan bebas modul client cart.
// ============================================================
import type { ComponentType, CSSProperties } from 'react'
import type { ComposableContent, ShowcaseItem } from '@/lib/theme-system/manifest'
import type { Product } from '@/types/websitebuilder'
import { ATELIER_JS } from './atelier-script'
import { copyGetter } from '@/lib/theme-system/theme-copy'
import { TOKO_ATELIER_SLOTS } from '../toko-bespoke/slots/toko-atelier.slots'

// ── Palet peran semantik (noir = default flagship) ────────────
// `scrim` = dasar gelap overlay foto (hero/CTA). Foto SELALU di-scrim gelap +
// teks putih, apa pun palet halaman — itu yang membuat varian terang aman.
export interface TaPal {
  bg: string; bg2: string; surface: string; ink: string; inkDim: string
  muted: string; accent: string; onAccent: string; line: string; line2: string
  scrim: string
}
export const PALETTES: Record<string, TaPal> = {
  // Noir — near-black hangat (kayu gelap & lampu sorot), aksen champagne.
  noir: {
    bg: '#141210', bg2: '#191613', surface: '#201C18', ink: '#F1EAE0', inkDim: '#D8CEC0',
    muted: '#A89C8C', accent: '#C5A572', onAccent: '#181410',
    line: 'rgba(241,234,224,.10)', line2: 'rgba(241,234,224,.06)',
    scrim: '#141210',
  },
  // Ivoire — gading hangat (kertas linen & cahaya pagi), aksen perunggu tua.
  // Rasio dihitung tangan: ink/bg 15.3 · inkDim/bg2 8.3 · muted/bg2 4.8 ·
  // accent/bg2 5.1 · putih/scrim 18.1 — semua lolos gate kontras.
  ivoire: {
    bg: '#F6F1E8', bg2: '#EFE8DC', surface: '#FBF8F2', ink: '#1F1A14', inkDim: '#4A4036',
    muted: '#6E6354', accent: '#7A5C32', onAccent: '#FFFFFF',
    line: 'rgba(31,26,20,.14)', line2: 'rgba(31,26,20,.08)',
    scrim: '#1A150F',
  },
}
function getPal(variant?: string): TaPal {
  return PALETTES[variant ?? 'noir'] ?? PALETTES.noir
}

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=Archivo:wght@400;500;600;700&display=swap'
const SERIF = "'Fraunces', Georgia, 'Times New Roman', serif"
const SANS = "'Archivo', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const EASE = 'cubic-bezier(.16,1,.3,1)'

// Font parametrik (style knobs Wave 3): default = konstanta bawaan (byte-identik
// render lama; parity.test menjaga). Pairing alternatif datang dari kurasi
// registry (BespokeEntry.design.fontPairings) via props.font.
type TaFont = { importUrl: string; display: string; body: string }
const DEFAULT_FONT: TaFont = { importUrl: FONT_URL, display: SERIF, body: SANS }

// Grain halus (SVG feTurbulence inline, ter-encode) — atmosfer film, offline-safe.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.38'/%3E%3C/svg%3E"

function rupiah(n?: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return ''
  return 'Rp' + n.toLocaleString('id-ID')
}
function initials(nama: string): string {
  const p = nama.trim().split(/\s+/).filter(Boolean)
  const ini = (p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')
  return ini.toUpperCase() || 'A'
}

function taCss(f: TaFont): string {
  return `@import url('${f.importUrl}');
.ta-root{background:var(--ta-bg);color:var(--ta-ink);font-family:${f.body};line-height:1.7;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden;overflow-x:clip}
.ta-root h1,.ta-root h2,.ta-root h3{font-family:${f.display};font-weight:500;letter-spacing:-.015em;line-height:1.04;margin:0}
.ta-root h1,.ta-root h2{text-wrap:balance}
.ta-root p{margin:0;text-wrap:pretty}
.ta-root a{color:inherit;text-decoration:none}
.ta-root img{display:block;max-width:100%}
.ta-root [id]{scroll-margin-top:96px}
.ta-root ::selection{background:var(--ta-accent);color:var(--ta-on-accent)}
.ta-root :focus-visible{outline:2px solid var(--ta-accent);outline-offset:3px}
.ta-wrap{max-width:1240px;margin:0 auto;padding:0 clamp(20px,4vw,48px)}
.ta-pad{padding:clamp(88px,12vw,150px) 0}
.ta-eyebrow{font-family:${f.body};font-size:11px;font-weight:600;letter-spacing:.32em;text-transform:uppercase;color:var(--ta-accent);display:inline-flex;align-items:center;gap:14px}
.ta-eyebrow::before{content:"";width:34px;height:1px;background:var(--ta-accent);opacity:.6}
.ta-btn{display:inline-flex;align-items:center;gap:10px;font-family:${f.body};font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:17px 32px;border-radius:2px;transition:transform .35s ${EASE},background-color .3s ease,color .3s ease,border-color .3s ease,filter .3s ease}
.ta-btn:active{transform:translateY(0) scale(.97)}
.ta-btn-solid{background:var(--ta-accent);color:var(--ta-on-accent)}
.ta-btn-solid:hover{transform:translateY(-2px);filter:brightness(1.07)}
.ta-btn-ghost{border:1px solid rgba(255,255,255,.28);color:#fff}
.ta-btn-ghost:hover{border-color:var(--ta-accent);color:var(--ta-accent);transform:translateY(-2px)}
.ta-sec-head{margin-bottom:clamp(40px,6vw,64px);max-width:62ch}
.ta-sec-head .ta-eyebrow{margin-bottom:18px}
.ta-sec-head h2{font-size:clamp(34px,4.8vw,58px)}
.ta-sec-head p{color:var(--ta-muted);margin-top:16px;font-size:16px;max-width:52ch}
/* ── reveal engine (digate .ta-js → no-JS tampil penuh) ── */
.ta-js .ta-reveal{opacity:0;transform:translateY(28px);transition:opacity .85s ${EASE},transform .85s ${EASE},filter .85s ${EASE};transition-delay:var(--ta-d,0ms)}
.ta-js .ta-reveal-l{transform:translateX(-36px)}
.ta-js .ta-reveal-r{transform:translateX(36px)}
.ta-js .ta-reveal-blur{filter:blur(12px)}
.ta-js .ta-reveal-sc{transform:translateY(18px) scale(.955)}
.ta-js .ta-reveal.ta-in{opacity:1;transform:none;filter:none}
/* ── nav ── */
.ta-nav{position:fixed;inset:0 0 auto 0;z-index:100;transition:background-color .4s ease,border-color .4s ease}
.ta-nav-in{display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1240px;margin:0 auto;padding:26px clamp(20px,4vw,48px);transition:padding .45s ${EASE}}
.ta-scrolled .ta-nav{background:color-mix(in srgb,var(--ta-bg) 84%,transparent);backdrop-filter:blur(16px) saturate(1.2);border-bottom:1px solid var(--ta-line2)}
.ta-scrolled .ta-nav-in{padding-top:13px;padding-bottom:13px}
.ta-brand{font-family:${f.display};font-size:24px;font-weight:500;letter-spacing:.02em;color:#fff;transition:color .3s ease}
.ta-scrolled .ta-brand{color:var(--ta-ink)}
.ta-brand small{display:block;font-family:${f.body};font-size:9px;font-weight:600;letter-spacing:.42em;text-transform:uppercase;color:var(--ta-muted);margin-top:0}
.ta-nav-links{display:flex;gap:30px}
.ta-nav-link{font-family:${f.body};font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.85);position:relative;padding:4px 0;transition:color .25s ease}
.ta-scrolled .ta-nav-link{color:var(--ta-ink-dim,#D8CEC0)}
.ta-nav-link::after{content:"";position:absolute;left:0;bottom:0;width:100%;height:1px;background:var(--ta-accent);transform:scaleX(0);transform-origin:left;transition:transform .35s ${EASE}}
.ta-nav-link:hover{color:var(--ta-accent)}
.ta-nav-link:hover::after,.ta-nav-link:focus-visible::after{transform:scaleX(1)}
.ta-nav-cta{font-family:${f.body};font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;border:1px solid var(--ta-accent);color:var(--ta-accent);padding:11px 22px;border-radius:2px;transition:background-color .3s,color .3s,border-color .3s}
.ta-nav-cta:hover{background:var(--ta-accent);color:var(--ta-on-accent)}
/* Ivoire: aksen perunggu gelap tak terbaca di atas foto hero → nav CTA putih
   saat transparan, kembali ke aksen begitu nav memadat (scrolled). */
[data-variant="ivoire"] .ta-nav-cta{border-color:rgba(255,255,255,.5);color:#fff}
[data-variant="ivoire"].ta-scrolled .ta-nav-cta{border-color:var(--ta-accent);color:var(--ta-accent)}
[data-variant="ivoire"] .ta-nav-cta:hover{background:var(--ta-accent);border-color:var(--ta-accent);color:var(--ta-on-accent)}
@media(max-width:880px){.ta-nav-links{display:none}}
/* ── hero "cover" ── */
.ta-hero{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:flex-end;overflow:hidden;color:#fff}
.ta-sentinel{position:absolute;top:0;left:0;width:1px;height:140px;opacity:0;pointer-events:none}
.ta-hero-bg{position:absolute;inset:0;background:#0d0b09 center/cover no-repeat;transform:scale(1.09);animation:taKb 16s ease-out forwards}
@keyframes taKb{to{transform:scale(1)}}
.ta-hero-scrim{position:absolute;inset:0;background:linear-gradient(to top,color-mix(in srgb,var(--ta-scrim,var(--ta-bg)) 96%,transparent) 0%,color-mix(in srgb,var(--ta-scrim,var(--ta-bg)) 52%,transparent) 34%,transparent 66%),linear-gradient(135deg,rgba(20,18,16,.62),transparent 55%)}
.ta-grain{position:absolute;inset:0;background:url("${GRAIN}") repeat;background-size:140px 140px;mix-blend-mode:overlay;pointer-events:none;z-index:1}
.ta-hero-ghost{position:absolute;top:9vh;right:-2vw;z-index:1;font-family:${f.display};font-style:italic;font-weight:300;font-size:clamp(110px,23vw,330px);line-height:1;color:transparent;-webkit-text-stroke:1px rgba(241,234,224,.08);user-select:none;pointer-events:none;white-space:nowrap}
.ta-hero-in{position:relative;z-index:2;width:100%;max-width:1240px;margin:0 auto;padding:0 clamp(20px,4vw,48px) clamp(76px,11vh,116px)}
.ta-hero .ta-eyebrow{opacity:0;animation:taFadeUp .9s ${EASE} .15s forwards}
.ta-hero h1{font-size:clamp(52px,9.4vw,126px);font-weight:400;letter-spacing:-.02em;line-height:.98;margin:24px 0 0;max-width:13ch;color:#fff}
.ta-w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.1em;margin-bottom:-.1em}
.ta-w>span{display:inline-block;transform:translateY(118%);animation:taRise 1.05s ${EASE} forwards;animation-delay:var(--ta-d,0ms)}
@keyframes taRise{to{transform:translateY(0)}}
@keyframes taFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.ta-hero-sub{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:34px;margin-top:40px;opacity:0;animation:taFadeUp 1s ${EASE} .75s forwards}
.ta-hero-sub p{max-width:46ch;font-size:17px;color:rgba(255,255,255,.88);line-height:1.75}
.ta-hero-actions{display:flex;gap:14px;flex-wrap:wrap}
.ta-hero-meta{position:absolute;right:clamp(18px,3vw,42px);bottom:110px;z-index:2;writing-mode:vertical-rl;display:flex;align-items:center;gap:16px;font-size:10px;font-weight:600;letter-spacing:.34em;text-transform:uppercase;color:rgba(241,234,224,.5);opacity:0;animation:taFadeUp 1.2s ${EASE} 1.1s forwards}
.ta-hero-meta::after{content:"";width:1px;height:56px;background:var(--ta-accent);opacity:.55}
@media(max-width:980px){.ta-hero-ghost{display:none}.ta-hero-meta{display:none}}
.ta-cue{position:absolute;left:50%;bottom:0;transform:translateX(-50%);z-index:2;width:1px;height:62px;overflow:hidden}
.ta-cue span{display:block;width:1px;height:100%;background:linear-gradient(to bottom,transparent,rgba(255,255,255,.75));animation:taCue 2.4s ${EASE} infinite}
@keyframes taCue{0%{transform:translateY(-100%)}55%{transform:translateY(0)}100%{transform:translateY(102%)}}
/* ── marquee ── */
.ta-marquee{border-top:1px solid var(--ta-line2);border-bottom:1px solid var(--ta-line2);padding:22px 0;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.ta-mq-track{display:flex;width:max-content;animation:taMarquee 38s linear infinite}
.ta-marquee:hover .ta-mq-track{animation-play-state:paused}
@keyframes taMarquee{to{transform:translateX(-50%)}}
.ta-mq-seq{display:flex;align-items:center;flex-shrink:0}
.ta-mq-item{font-family:${f.display};font-style:italic;font-weight:400;font-size:clamp(17px,2.1vw,25px);color:var(--ta-ink-dim,#D8CEC0);white-space:nowrap;padding:0 26px}
.ta-mq-sep{color:var(--ta-accent);font-size:9px;opacity:.85}
/* ── lookbook / koleksi ── */
.ta-look-head{display:flex;align-items:flex-end;justify-content:space-between;gap:28px;flex-wrap:wrap;margin-bottom:clamp(40px,6vw,64px)}
.ta-look-head .ta-sec-head{margin-bottom:0}
.ta-chips{display:flex;gap:8px;flex-wrap:wrap}
.ta-chip{font-family:${f.body};font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--ta-muted);background:transparent;border:1px solid var(--ta-line);padding:9px 16px;border-radius:999px;cursor:pointer;transition:color .25s ease,background-color .25s ease,border-color .25s ease}
.ta-chip:hover{color:var(--ta-ink);border-color:var(--ta-line)}
@media(hover:none){.ta-chip{padding:13px 18px}}
.ta-chip[aria-pressed="true"]{background:var(--ta-accent);color:var(--ta-on-accent);border-color:var(--ta-accent)}
.ta-hide{display:none!important}
.ta-look-feat{display:grid;grid-template-columns:1.15fr .85fr;align-items:end;margin-bottom:clamp(52px,7vw,92px)}
.ta-look-feat-media{position:relative;overflow:hidden;aspect-ratio:4/3;background:linear-gradient(160deg,var(--ta-surface),var(--ta-bg2))}
.ta-look-feat-media img{width:100%;height:100%;object-fit:cover;transition:transform 1.1s ${EASE}}
.ta-look-feat:hover .ta-look-feat-media img{transform:scale(1.045)}
.ta-look-feat-body{position:relative;z-index:2;margin-left:clamp(-170px,-11vw,-56px);margin-bottom:clamp(22px,4vw,54px);background:color-mix(in srgb,var(--ta-bg) 78%,transparent);backdrop-filter:blur(14px) saturate(1.15);border:1px solid var(--ta-line2);padding:clamp(26px,3.4vw,46px)}
.ta-look-idx{position:absolute;top:-.52em;right:20px;font-family:${f.display};font-style:italic;font-size:clamp(64px,8vw,110px);line-height:1;color:var(--ta-accent);opacity:.2;pointer-events:none;font-variant-numeric:tabular-nums}
.ta-look-feat-body h3{font-size:clamp(28px,3.6vw,46px);margin:10px 0 12px}
.ta-look-feat-body>p{color:var(--ta-ink-dim,#D8CEC0);font-size:15px;line-height:1.75;max-width:44ch}
.ta-look-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(18px,2.4vw,30px);align-items:start}
.ta-look-grid .ta-card:nth-child(3n+2){margin-top:52px}
/* koleksi tipis (<3): simetris, tanpa stagger — editorial offset butuh koleksi penuh */
.ta-look-duo{grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(24px,3.4vw,44px);max-width:920px;margin:0 auto}
.ta-look-solo{grid-template-columns:minmax(0,1fr);max-width:520px;margin:0 auto}
.ta-look-duo .ta-card:nth-child(3n+2),.ta-look-solo .ta-card:nth-child(3n+2){margin-top:0}
.ta-card-media{position:relative;overflow:hidden;aspect-ratio:3/4;background:linear-gradient(160deg,var(--ta-surface),var(--ta-bg2))}
.ta-card-media img{width:100%;height:100%;object-fit:cover;filter:grayscale(.85) contrast(1.02);transform:scale(1.01);transition:filter .7s ease,transform .95s ${EASE}}
.ta-card:hover .ta-card-media img,.ta-card:focus-within .ta-card-media img{filter:grayscale(0) contrast(1);transform:scale(1.06)}
.ta-card-ini{display:flex;align-items:center;justify-content:center;height:100%;font-family:${f.display};font-size:54px;color:var(--ta-accent);opacity:.45}
.ta-stok{position:absolute;top:14px;left:14px;z-index:2;font-family:${f.body};font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;background:color-mix(in srgb,var(--ta-bg) 72%,transparent);backdrop-filter:blur(6px);border:1px solid var(--ta-line);color:var(--ta-accent);padding:6px 10px}
.ta-quick{position:absolute;left:50%;bottom:18px;transform:translate(-50%,12px);opacity:0;z-index:2;font-family:${f.body};font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;background:var(--ta-ink);color:var(--ta-bg);border:0;padding:12px 20px;border-radius:2px;cursor:pointer;transition:opacity .35s ease,transform .35s ${EASE}}
.ta-card:hover .ta-quick,.ta-look-feat:hover .ta-quick,.ta-quick:focus-visible{opacity:1;transform:translate(-50%,0)}
@media(hover:none){.ta-quick{opacity:1;transform:translate(-50%,0);background:color-mix(in srgb,var(--ta-bg) 72%,transparent);color:var(--ta-ink);backdrop-filter:blur(8px);border:1px solid var(--ta-line)}}
.ta-card-body{padding:16px 2px 0}
.ta-cat{font-family:${f.body};font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--ta-muted)}
.ta-card-nm{font-size:21px;font-weight:500;margin:6px 0 4px}
.ta-price{font-family:${f.display};font-size:18px;color:color-mix(in srgb,var(--ta-accent) 75%,#fff);font-variant-numeric:tabular-nums}
.ta-card-meta{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-top:2px}
.ta-cardbtn{margin-top:14px;display:inline-flex;align-items:center;gap:8px;font-family:${f.body};font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ta-accent);background:transparent;border:1px solid color-mix(in srgb,var(--ta-accent) 45%,transparent);padding:11px 18px;border-radius:2px;cursor:pointer;transition:background-color .3s ease,color .3s ease,border-color .3s ease}
.ta-cardbtn:hover{background:var(--ta-accent);color:var(--ta-on-accent);border-color:var(--ta-accent)}
@media(max-width:880px){
.ta-look-feat{grid-template-columns:1fr}
.ta-look-feat-body{margin:-44px 14px 0}
.ta-look-grid{grid-template-columns:repeat(2,1fr)}
.ta-look-grid .ta-card{margin-top:0}
.ta-look-grid .ta-card:nth-child(3n+2){margin-top:0}
.ta-look-grid .ta-card:nth-child(2n){margin-top:36px}
.ta-look-duo .ta-card:nth-child(2n),.ta-look-solo .ta-card:nth-child(2n){margin-top:0}
.ta-look-solo{grid-template-columns:1fr}
}
/* ── statement ── */
.ta-statement{background:var(--ta-bg2);border-top:1px solid var(--ta-line2);border-bottom:1px solid var(--ta-line2)}
.ta-statement .ta-wrap{display:grid;grid-template-columns:1fr 2.1fr;gap:clamp(28px,4vw,56px);align-items:start}
.ta-statement-side{display:flex;flex-direction:column;gap:22px}
.ta-rule{width:64px;height:1px;background:var(--ta-accent);transform-origin:left}
.ta-js .ta-reveal .ta-rule{transform:scaleX(0);transition:transform 1.1s ${EASE} .3s}
.ta-js .ta-reveal.ta-in .ta-rule{transform:scaleX(1)}
.ta-quote{font-family:${f.display};font-style:italic;font-weight:400;font-size:clamp(28px,3.7vw,47px);line-height:1.2;position:relative}
.ta-quote::before{content:"\\201C";position:absolute;left:-.42em;top:-.3em;font-size:2.7em;color:var(--ta-accent);opacity:.14;font-style:normal}
.ta-cite{display:block;margin-top:28px;font-family:${f.body};font-style:normal;font-size:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--ta-muted)}
@media(max-width:780px){.ta-statement .ta-wrap{grid-template-columns:1fr;gap:24px}}
/* ── keunggulan (sticky passage) ── */
.ta-why .ta-wrap{display:grid;grid-template-columns:.9fr 1.4fr;gap:clamp(36px,6vw,88px);align-items:start}
.ta-why-side{position:sticky;top:110px}
.ta-why-side h2{font-size:clamp(34px,4.6vw,56px);margin-top:18px}
.ta-why-side p{color:var(--ta-muted);margin-top:16px;font-size:16px;max-width:38ch}
.ta-why-row{display:grid;grid-template-columns:auto 1fr;gap:clamp(18px,3vw,36px);padding:clamp(26px,3.4vw,40px) 0;border-top:1px solid var(--ta-line2);transition:padding-left .45s ${EASE}}
.ta-why-rows .ta-why-row:last-child{border-bottom:1px solid var(--ta-line2)}
.ta-why-row:hover{padding-left:14px}
.ta-why-num{font-family:${f.display};font-style:italic;font-size:clamp(30px,3.6vw,44px);line-height:1.1;color:transparent;-webkit-text-stroke:1px color-mix(in srgb,var(--ta-accent) 65%,transparent);min-width:2.2ch;transition:color .4s ease;font-variant-numeric:tabular-nums}
.ta-why-row:hover .ta-why-num{color:var(--ta-accent)}
.ta-why-row b{font-family:${f.display};font-size:clamp(20px,2.4vw,26px);font-weight:500;display:block}
.ta-why-row p{color:var(--ta-ink-dim,#D8CEC0);font-size:15px;line-height:1.75;margin-top:8px;max-width:52ch}
@media(max-width:880px){.ta-why .ta-wrap{grid-template-columns:1fr}.ta-why-side{position:static}}
/* ── cerita / about (split-screen) ── */
.ta-about{display:grid;grid-template-columns:1fr 1fr;min-height:clamp(480px,82vh,820px);background:var(--ta-bg2);border-top:1px solid var(--ta-line2);border-bottom:1px solid var(--ta-line2)}
.ta-about-media{position:relative;overflow:hidden}
.ta-about-media img{position:absolute;left:0;top:-7%;width:100%;height:114%;object-fit:cover;filter:grayscale(.3) contrast(1.02)}
@supports(animation-timeline:view()){
.ta-about-media img{animation:taDrift linear both;animation-timeline:view();animation-range:cover 0% cover 100%}
@keyframes taDrift{from{transform:translateY(-3.5%)}to{transform:translateY(3.5%)}}
}
.ta-about-media::after{content:"";position:absolute;inset:0;background:linear-gradient(to right,transparent 55%,color-mix(in srgb,var(--ta-bg2) 76%,transparent))}
.ta-about-body{display:flex;flex-direction:column;justify-content:center;padding:clamp(56px,8vw,110px) clamp(24px,5vw,90px)}
.ta-about-body h2{font-size:clamp(34px,4.4vw,56px);margin:18px 0 24px;position:relative;z-index:2;margin-left:clamp(-180px,-12vw,-48px);text-shadow:0 2px 30px rgba(0,0,0,.5)}
.ta-about-noimg{grid-template-columns:1fr}
.ta-about-noimg .ta-about-body{align-items:flex-start;max-width:840px;margin:0 auto}
.ta-about-noimg .ta-about-body h2{margin-left:0;text-shadow:none}
.ta-about-text{color:var(--ta-ink-dim,#D8CEC0);font-size:16px;line-height:1.9;max-width:54ch;white-space:pre-wrap}
.ta-about-link{margin-top:32px;display:inline-flex;align-items:center;gap:10px;font-family:${f.body};font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ta-accent);position:relative;width:fit-content}
.ta-about-link::after{content:"";position:absolute;left:0;bottom:-4px;width:100%;height:1px;background:var(--ta-accent);transform:scaleX(0);transform-origin:left;transition:transform .35s ${EASE}}
.ta-about-link:hover::after{transform:scaleX(1)}
@media(max-width:880px){.ta-about{grid-template-columns:1fr;min-height:0}.ta-about-media{aspect-ratio:16/10}.ta-about-body h2{margin-left:0}}
/* ── stats (band hairline, count-up) ── */
.ta-stats{border-top:1px solid var(--ta-line2);border-bottom:1px solid var(--ta-line2)}
.ta-stats-grid{display:grid;grid-template-columns:repeat(4,1fr)}
.ta-stat{display:flex;flex-direction:column;gap:12px;padding:clamp(36px,5vw,66px) clamp(18px,2.6vw,40px);border-left:1px solid var(--ta-line2)}
.ta-stat:first-child{border-left:0}
.ta-stat-num{font-family:${f.display};font-weight:400;font-size:clamp(38px,4.6vw,62px);line-height:1;color:var(--ta-ink);font-variant-numeric:tabular-nums}
.ta-stat-lbl{font-family:${f.body};font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--ta-muted)}
@media(max-width:780px){.ta-stats-grid{grid-template-columns:repeat(2,1fr)}.ta-stat{padding:26px 18px}.ta-stat:nth-child(odd){border-left:0}.ta-stat:nth-child(n+3){border-top:1px solid var(--ta-line2)}}
/* ── galeri (editorial + breakout edge-to-edge) ── */
.ta-gal-grid{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:clamp(120px,16vw,236px);gap:clamp(14px,2vw,24px)}
.ta-gal{position:relative;overflow:hidden;margin:0;background:linear-gradient(160deg,var(--ta-surface),var(--ta-bg2))}
.ta-gal img{width:100%;height:100%;object-fit:cover;filter:grayscale(.25);transform:scale(1.005);transition:transform 1s ${EASE},filter .6s ease}
.ta-gal:hover img,.ta-gal:focus-within img{transform:scale(1.05);filter:grayscale(0)}
.ta-gal-grid .ta-gal:nth-child(1){grid-column:1/6;grid-row:span 2}
.ta-gal-grid .ta-gal:nth-child(2){grid-column:6/13}
.ta-gal-grid .ta-gal:nth-child(3){grid-column:6/10}
.ta-gal-grid .ta-gal:nth-child(4){grid-column:10/13}
.ta-gal figcaption{position:absolute;left:0;right:0;bottom:0;z-index:1;padding:36px 16px 13px;background:linear-gradient(to top,rgba(10,8,7,.74),transparent);color:#F1EAE0;font-family:${f.body};font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;opacity:0;transform:translateY(6px);transition:opacity .4s ease,transform .4s ${EASE}}
.ta-gal:hover figcaption,.ta-gal:focus-within figcaption{opacity:1;transform:none}
@media(hover:none){.ta-gal figcaption{opacity:1;transform:none}}
.ta-gal-zoom{position:absolute;inset:0;z-index:2;background:transparent;border:0;cursor:zoom-in;padding:0}
.ta-gal-break{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(10px,1.2vw,18px);width:100vw;margin:clamp(14px,2vw,24px) 0 0 calc(50% - 50vw)}
.ta-gal-break .ta-gal{aspect-ratio:16/10}
@media(max-width:780px){
.ta-gal-grid{grid-auto-rows:clamp(110px,24vw,180px)}
.ta-gal-grid .ta-gal:nth-child(1){grid-column:1/13}
.ta-gal-grid .ta-gal:nth-child(2){grid-column:1/13}
.ta-gal-grid .ta-gal:nth-child(3){grid-column:1/7}
.ta-gal-grid .ta-gal:nth-child(4){grid-column:7/13}
.ta-gal-break{grid-template-columns:1fr 1fr}
.ta-gal-break .ta-gal:last-child{grid-column:1/-1}
}
/* ── testimoni (scroll-snap carousel) ── */
.ta-tsec{background:var(--ta-bg2);border-top:1px solid var(--ta-line2);border-bottom:1px solid var(--ta-line2)}
.ta-tctrl{display:flex;gap:10px}
.ta-tbtn{width:46px;height:46px;border-radius:999px;border:1px solid var(--ta-line);background:transparent;color:var(--ta-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color .25s ease,color .25s ease,border-color .25s ease,opacity .25s ease}
.ta-tbtn:hover:not(:disabled){background:var(--ta-accent);color:var(--ta-on-accent);border-color:var(--ta-accent)}
.ta-tbtn:disabled{opacity:.32;cursor:default}
.ta-tcar-track{display:flex;gap:clamp(16px,2vw,26px);overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:6px}
.ta-tcar-track::-webkit-scrollbar{display:none}
.ta-tslide{flex:0 0 min(100%,520px);scroll-snap-align:start;margin:0;display:flex;flex-direction:column;gap:28px;background:var(--ta-surface);border:1px solid var(--ta-line2);padding:clamp(28px,3.4vw,46px)}
.ta-tslide blockquote{margin:0;position:relative;padding-top:30px}
.ta-tslide blockquote::before{content:"\\201C";position:absolute;left:-6px;top:-14px;font-family:${f.display};font-size:74px;line-height:1;color:var(--ta-accent);opacity:.3}
.ta-tquote{font-family:${f.display};font-style:italic;font-size:clamp(18px,1.9vw,22px);line-height:1.55;color:var(--ta-ink-dim,#D8CEC0)}
.ta-tmeta{display:flex;align-items:center;gap:14px;margin-top:auto}
.ta-tava{flex:0 0 auto;width:46px;height:46px;border-radius:999px;border:1px solid color-mix(in srgb,var(--ta-accent) 45%,transparent);display:flex;align-items:center;justify-content:center;font-family:${f.display};font-size:15px;color:var(--ta-accent)}
.ta-tnm{font-family:${f.body};font-size:14px;font-weight:600;color:var(--ta-ink);display:block}
.ta-trole{font-family:${f.body};font-size:12px;color:var(--ta-muted);display:block;margin-top:2px}
.ta-dots{display:flex;gap:8px;margin-top:26px}
.ta-dot{position:relative;width:8px;height:8px;border-radius:999px;background:var(--ta-line);border:0;padding:0;cursor:pointer;transition:width .3s ${EASE},background-color .3s ease}
.ta-dot::after{content:"";position:absolute;inset:-16px}
.ta-dot[aria-current="true"]{width:26px;background:var(--ta-accent)}
/* ── faq (details CSS-only) ── */
.ta-faq-grid{display:grid;grid-template-columns:.8fr 1.4fr;gap:clamp(36px,6vw,88px);align-items:start}
.ta-faq-side{position:sticky;top:110px}
.ta-faq-side h2{font-size:clamp(30px,3.8vw,46px);margin-top:18px}
.ta-faq-side p{color:var(--ta-muted);margin-top:14px;font-size:15px;max-width:36ch}
.ta-faq-side .ta-about-link{margin-top:24px}
.ta-qa{border-top:1px solid var(--ta-line2)}
.ta-faq-list .ta-qa:last-child{border-bottom:1px solid var(--ta-line2)}
.ta-qa summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:clamp(20px,2.6vw,28px) 0;font-family:${f.display};font-size:clamp(18px,2vw,22px);font-weight:500;color:var(--ta-ink);transition:color .25s ease}
.ta-qa summary::-webkit-details-marker{display:none}
.ta-qa summary:hover{color:var(--ta-accent)}
.ta-qa-ic{flex:0 0 auto;width:30px;height:30px;border:1px solid var(--ta-line);border-radius:999px;position:relative;transition:transform .35s ${EASE},border-color .3s ease}
.ta-qa-ic::before,.ta-qa-ic::after{content:"";position:absolute;left:50%;top:50%;background:var(--ta-accent);transform:translate(-50%,-50%)}
.ta-qa-ic::before{width:12px;height:1px}
.ta-qa-ic::after{width:1px;height:12px}
.ta-qa[open] .ta-qa-ic{transform:rotate(45deg);border-color:var(--ta-accent)}
.ta-qa>p{color:var(--ta-ink-dim,#D8CEC0);font-size:15px;line-height:1.85;max-width:58ch;padding:0 0 26px}
@media(max-width:880px){.ta-faq-grid{grid-template-columns:1fr;gap:28px}.ta-faq-side{position:static}}
/* ── cta band (duotone + magnetic) ── */
.ta-cta{position:relative;overflow:hidden;text-align:center;color:#fff}
.ta-cta-bg{position:absolute;inset:0;background:#0d0b09 center/cover no-repeat;filter:grayscale(1) contrast(1.06) brightness(.85)}
.ta-cta-tint{position:absolute;inset:0;background:linear-gradient(120deg,var(--ta-accent),#241a12 70%);mix-blend-mode:color;opacity:.6}
.ta-cta-scrim{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(13,11,9,.84),rgba(13,11,9,.6) 50%,rgba(13,11,9,.88))}
.ta-cta-noimg .ta-cta-bg{background:radial-gradient(ellipse 70% 60% at 18% 85%,color-mix(in srgb,var(--ta-accent) 22%,transparent),transparent 60%),radial-gradient(ellipse 55% 45% at 85% 12%,color-mix(in srgb,var(--ta-accent) 12%,transparent),transparent 55%),var(--ta-bg2);filter:none}
.ta-cta-noimg .ta-cta-tint{display:none}
.ta-cta-noimg .ta-cta-scrim{background:transparent}
.ta-cta-noimg{color:var(--ta-ink)}
.ta-cta-noimg h2{color:var(--ta-ink)}
.ta-cta-noimg .ta-cta-sub{color:var(--ta-ink-dim,#D8CEC0)}
.ta-cta-in{position:relative;z-index:2;max-width:880px;margin:0 auto;padding:clamp(110px,15vw,184px) clamp(20px,4vw,48px)}
.ta-cta h2{font-size:clamp(40px,6.4vw,82px);font-weight:400;line-height:1.02;color:#fff}
.ta-cta-sub{color:rgba(255,255,255,.84);font-size:clamp(15px,1.6vw,18px);max-width:52ch;margin:22px auto 0;line-height:1.8}
.ta-cta-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:42px}
.ta-cta .ta-btn-solid{box-shadow:0 14px 44px color-mix(in srgb,var(--ta-accent) 35%,transparent)}
.ta-mag{will-change:transform;transition:transform .45s cubic-bezier(.34,1.56,.64,1)}
/* ── lightbox (quick-look) ── */
.ta-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.ta-lb[hidden]{display:none}
.ta-lb-back{position:absolute;inset:0;background:rgba(10,8,7,.78);backdrop-filter:blur(8px);border:0;cursor:pointer}
.ta-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1.1fr .9fr;max-width:980px;width:100%;max-height:86vh;background:var(--ta-bg2);border:1px solid var(--ta-line);margin:0;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .45s ${EASE},transform .45s ${EASE}}
.ta-lb-in .ta-lb-panel{opacity:1;transform:none}
.ta-lb-media{position:relative;overflow:hidden;background:var(--ta-surface);min-height:340px}
.ta-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ta-lb-body{padding:clamp(24px,3.4vw,44px);display:flex;flex-direction:column;gap:10px;justify-content:center}
.ta-lb-cat{font-family:${f.body};font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--ta-muted)}
.ta-lb-title{font-family:${f.display};font-size:clamp(24px,2.8vw,34px);font-weight:500;line-height:1.12}
.ta-lb-price{font-family:${f.display};font-size:20px;color:color-mix(in srgb,var(--ta-accent) 75%,#fff);font-variant-numeric:tabular-nums}
.ta-lb-desc{color:var(--ta-ink-dim,#D8CEC0);font-size:14px;line-height:1.8}
.ta-lb-cta{margin-top:14px;width:fit-content}
.ta-lb-x{position:absolute;top:10px;right:10px;z-index:3;width:44px;height:44px;border-radius:999px;background:color-mix(in srgb,var(--ta-bg) 70%,transparent);border:1px solid var(--ta-line);color:var(--ta-ink);font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color .25s ease,color .25s ease,border-color .25s ease}
.ta-lb-x:hover{background:var(--ta-accent);color:var(--ta-on-accent);border-color:var(--ta-accent)}
.ta-lb-prev,.ta-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:44px;height:44px;border-radius:999px;background:color-mix(in srgb,var(--ta-bg) 70%,transparent);border:1px solid var(--ta-line);color:var(--ta-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color .25s ease,color .25s ease,border-color .25s ease}
.ta-lb-prev{left:-22px}.ta-lb-next{right:-22px}
.ta-lb-prev:hover,.ta-lb-next:hover{background:var(--ta-accent);color:var(--ta-on-accent);border-color:var(--ta-accent)}
@media(max-width:780px){.ta-lb-panel{grid-template-columns:1fr;overflow:auto;max-height:92vh}.ta-lb-media{min-height:0;aspect-ratio:4/3}.ta-lb-prev{left:10px;top:31vw}.ta-lb-next{right:10px;top:31vw}}
/* ── band add-on (newsletter/career) ── */
.ta-band{background:var(--ta-surface);border-top:1px solid var(--ta-line2);border-bottom:1px solid var(--ta-line2);padding:clamp(46px,6vw,68px) 0}
.ta-band-in{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:24px}
.ta-band h2{font-size:clamp(24px,3.2vw,32px)}
.ta-band p{color:var(--ta-muted);margin-top:10px;font-size:14px;max-width:56ch}
/* ── footer ── */
.ta-footer{background:color-mix(in srgb,var(--ta-bg) 84%,#000);border-top:1px solid var(--ta-line2)}
.ta-footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:clamp(32px,5vw,56px);padding:clamp(56px,8vw,84px) 0 48px}
.ta-footer .ta-brand{font-size:30px;color:var(--ta-ink)}
.ta-footer-tag{color:var(--ta-muted);font-size:14px;line-height:1.8;margin-top:14px;max-width:34ch}
.ta-f-label{font-family:${f.body};font-size:10px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--ta-muted);margin-bottom:18px}
.ta-f-rows{display:grid;gap:10px;font-size:14px;color:var(--ta-ink-dim,#D8CEC0)}
.ta-f-rows a{position:relative;width:fit-content}
.ta-f-rows a::after{content:"";position:absolute;left:0;bottom:-2px;width:100%;height:1px;background:var(--ta-accent);transform:scaleX(0);transform-origin:left;transition:transform .35s ${EASE}}
.ta-f-rows a:hover{color:var(--ta-accent)}
.ta-f-rows a:hover::after{transform:scaleX(1)}
.ta-f-jam{display:grid;grid-template-columns:auto 1fr;gap:6px 18px;font-size:14px;color:var(--ta-ink-dim,#D8CEC0)}
.ta-f-jam span:nth-child(odd){color:var(--ta-muted)}
.ta-footer-markwrap{overflow:hidden;pointer-events:none}
.ta-footer-mark{font-family:${f.display};font-style:italic;font-weight:300;font-size:clamp(88px,17.5vw,250px);line-height:.78;white-space:nowrap;color:transparent;-webkit-text-stroke:1px color-mix(in srgb,var(--ta-ink) 9%,transparent);transform:translateY(33%);user-select:none}
.ta-footer-cr{border-top:1px solid var(--ta-line2);padding:22px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:12px;color:var(--ta-muted)}
@media(max-width:880px){.ta-footer-grid{grid-template-columns:1fr;gap:36px}}
/* ── WA float ── */
.ta-wa{position:fixed;right:22px;bottom:22px;z-index:90;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 26px rgba(37,211,102,.38);transition:transform .25s ${EASE}}
.ta-wa:hover{transform:scale(1.08)}
/* ── reduced motion: matikan semua, tampilkan semua ── */
@media(prefers-reduced-motion:reduce){
.ta-root *,.ta-root *::before,.ta-root *::after{animation:none!important;transition:none!important}
.ta-hero-bg{transform:none}
.ta-w>span{transform:none}
.ta-hero .ta-eyebrow,.ta-hero-sub,.ta-hero-meta{opacity:1}
.ta-js .ta-reveal{opacity:1;transform:none;filter:none}
.ta-js .ta-reveal .ta-rule{transform:none}
.ta-quick{opacity:1;transform:translate(-50%,0)}
.ta-lb-panel{opacity:1;transform:none}
.ta-mag{transform:none!important}
.ta-gal figcaption{opacity:1;transform:none}
.ta-tcar-track{scroll-behavior:auto}
}
`
}

const WA_ICON = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
)
const CHEV_L = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
)
const CHEV_R = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
)

// Judul hero dipecah per kata → kaskade naik (clip per kata, SSR-safe tanpa JS).
function HeroTitle({ title }: { title: string }) {
  const words = title.trim().split(/\s+/)
  return (
    <h1>
      {words.map((w, i) => (
        <span className="ta-w" key={i}>
          <span style={{ '--ta-d': `${180 + i * 70}ms` } as CSSProperties}>{w}</span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </h1>
  )
}

function StokBadge({ stok, habis, sisa }: { stok?: number; habis: string; sisa: string }) {
  if (typeof stok !== 'number') return null
  if (stok === 0) return <span className="ta-stok" data-edit="copy.stok_habis">{habis}</span>
  if (stok <= 5) return <span className="ta-stok" data-edit="copy.stok_sisa">{sisa} {stok}</span>
  return null
}

export interface TokoAtelierProps {
  content: ComposableContent
  variant?: string
  primary?: string
  /** Produk DB mentah (produksi) — dipasangkan ke item showcase via nama. */
  products?: Product[]
  hasCart?: boolean
  /** Slot tombol keranjang (SiteRenderer mengirim AtelierCartButton saat hasCart). */
  CartButton?: ComponentType<{ product: Product }>
  /** Style knobs (Wave 3): font pairing terpilih tenant — sudah diresolve SiteRenderer. */
  font?: { importUrl: string; display: string; body: string }
}

export default function TokoAtelierRenderer({
  content, variant, primary, products, hasCart, CartButton, font,
}: TokoAtelierProps) {
  const pal = getPal(variant)
  const accent = (primary && primary.trim()) || pal.accent
  const f = font ?? DEFAULT_FONT
  // Copy khas-tema (slot manifest) — editan klien dari portal "Konten Tema";
  // default = copy bawaan tema (byte-identik hardcode lama; parity.test menjaga).
  const cp = copyGetter(content.themeCopy, TOKO_ATELIER_SLOTS)
  const rootStyle = {
    '--ta-bg': pal.bg, '--ta-bg2': pal.bg2, '--ta-surface': pal.surface, '--ta-ink': pal.ink,
    '--ta-ink-dim': pal.inkDim, '--ta-muted': pal.muted, '--ta-accent': accent,
    '--ta-on-accent': pal.onAccent, '--ta-line': pal.line, '--ta-line2': pal.line2,
    '--ta-scrim': pal.scrim,
    background: pal.bg, color: pal.ink,
  } as CSSProperties

  const wa = content.contact?.wa
  const waLink = wa ? `https://wa.me/${wa.replace(/[^\d]/g, '')}` : undefined
  const waItem = (nm: string) =>
    wa
      ? `https://wa.me/${wa.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Halo ${content.nama}, saya ingin memesan "${nm}".`)}`
      : undefined
  const ghost = content.nama.trim().split(/\s+/)[0]

  // Lookbook: item pertama bergambar dipromosikan jadi spread unggulan.
  // Koleksi tipis (<3 item) → mode simetris: tanpa spread + tanpa stagger,
  // karena layout editorial offset terlihat timpang saat item sedikit.
  const items = (content.showcase?.items ?? []).slice(0, 12)
  const sparse = items.length > 0 && items.length < 3
  const feat = !sparse && items.length > 0 && items[0].gambar ? items[0] : null
  const rest = feat ? items.slice(1) : items
  const cats = Array.from(new Set(items.map((it) => it.kategori).filter((k): k is string => !!k)))

  // CTA per item: tombol keranjang (slot) bila produk DB cocok, selain itu WA.
  const itemCta = (it: ShowcaseItem) => {
    const prod = hasCart && CartButton ? products?.find((p) => p.nama === it.nama) : undefined
    if (prod && CartButton) return <CartButton product={prod} />
    const href = waItem(it.nama)
    if (!href) return null
    return <a className="ta-cardbtn" href={href} target="_blank" rel="noopener noreferrer" data-edit="copy.card_pesan">{cp.t('copy.card_pesan')}</a>
  }
  // Trigger quick-look (lightbox) — hanya item bergambar.
  const quickProps = (it: ShowcaseItem) => ({
    'data-src': it.gambar,
    'data-cat': it.kategori ?? '',
    'data-title': it.nama,
    'data-price': rupiah(it.harga),
    'data-desc': it.desc ?? '',
    'data-href': waItem(it.nama) ?? '',
  })
  // Galeri ikut memakai dialog quick-look yang sama → dialog dirender bila
  // ada trigger dari lookbook ATAU galeri.
  const hasQuickLook = items.some((it) => !!it.gambar) || (content.gallery?.images?.length ?? 0) > 0

  // Marquee dirakit dari konten (nama + judul keunggulan) — tanpa field baru.
  const mq = [content.nama, ...(content.features ?? []).map((f) => f.title)].filter(Boolean)

  // Nav sadar-konten — hanya section yang benar-benar dirender (anti anchor mati).
  const nav: { label: string; href: string; edit: string }[] = []
  if (items.length) nav.push({ label: cp.t('copy.nav_koleksi'), href: '#koleksi', edit: 'copy.nav_koleksi' })
  if (content.statement) nav.push({ label: cp.t('copy.nav_filosofi'), href: '#filosofi', edit: 'copy.nav_filosofi' })
  if (content.about) nav.push({ label: cp.t('copy.nav_cerita'), href: '#cerita', edit: 'copy.nav_cerita' })
  if (content.gallery?.images?.length) nav.push({ label: cp.t('copy.nav_galeri'), href: '#galeri', edit: 'copy.nav_galeri' })
  nav.push({ label: cp.t('copy.nav_kontak'), href: '#kontak', edit: 'copy.nav_kontak' })

  // Galeri: 4 pertama = mosaik editorial, sisanya pita breakout edge-to-edge.
  const galImgs = (content.gallery?.images ?? []).slice(0, 7)
  const galMosaic = galImgs.slice(0, 4)
  const galBreak = galImgs.slice(4)
  // CTA band: '#wa' (atau tanpa href) → tautan WhatsApp; selain itu pakai apa adanya.
  const ctaHref = content.cta?.ctaHref && content.cta.ctaHref !== '#wa'
    ? content.cta.ctaHref
    : (waLink ?? '#kontak')

  // Fallback tanpa foto = panggung gelap berbasis scrim (teks hero selalu
  // putih) — aman juga untuk palet terang (ivoire).
  const heroBg: CSSProperties = content.hero.image
    ? { backgroundImage: `url(${content.hero.image})`, backgroundPosition: content.hero.imagePosition || 'center' }
    : { background: `linear-gradient(150deg, color-mix(in srgb, ${pal.scrim} 82%, #fff), ${pal.scrim} 70%)` }

  return (
    <div className="ta-root" style={rootStyle} data-theme="toko-atelier" data-variant={variant ?? 'noir'}>
      <style dangerouslySetInnerHTML={{ __html: taCss(f) }} />
      <script dangerouslySetInnerHTML={{ __html: ATELIER_JS }} />

      {/* NAV */}
      <header className="ta-nav">
        <div className="ta-nav-in">
          <a className="ta-brand" href="#atas" aria-label={content.nama}>
            {content.nama}<small data-edit="copy.brand_sub">{cp.t('copy.brand_sub')}</small>
          </a>
          {nav.length > 0 && (
            <nav className="ta-nav-links" aria-label="Navigasi utama">
              {nav.map((l) => <a key={l.href} className="ta-nav-link" href={l.href} data-edit={l.edit}>{l.label}</a>)}
            </nav>
          )}
          <a className="ta-nav-cta" href={waLink ?? '#kontak'} data-edit="copy.contact_cta">{cp.t('copy.contact_cta')}</a>
        </div>
      </header>

      <main>
        {/* HERO — cover penuh, masuk bertahap (CSS murni, hidup tanpa JS) */}
        <section className="ta-hero" id="atas">
          <span className="ta-sentinel" aria-hidden />
          <div className="ta-hero-bg" style={heroBg} />
          <div className="ta-hero-scrim" />
          <div className="ta-grain" />
          <span className="ta-hero-ghost" aria-hidden>{ghost}</span>
          {content.contact?.alamat && <span className="ta-hero-meta" aria-hidden>{content.contact.alamat}</span>}
          <div className="ta-hero-in">
            {content.hero.eyebrow && <span className="ta-eyebrow">{content.hero.eyebrow}</span>}
            <HeroTitle title={content.hero.title} />
            <div className="ta-hero-sub">
              {content.hero.subtitle && <p>{content.hero.subtitle}</p>}
              <div className="ta-hero-actions">
                {content.hero.ctaText && (
                  <a className="ta-btn ta-btn-solid" href={content.hero.ctaHref ?? waLink ?? '#kontak'}>{content.hero.ctaText}</a>
                )}
                {content.hero.ctaText2 && (
                  <a className="ta-btn ta-btn-ghost" href={content.hero.ctaHref2 ?? '#filosofi'}>{content.hero.ctaText2}</a>
                )}
              </div>
            </div>
          </div>
          <span className="ta-cue" aria-hidden><span /></span>
        </section>

        {/* MARQUEE — pita identitas, loop CSS murni (track ganda, satu aria-hidden) */}
        {mq.length > 1 && (
          <div className="ta-marquee" aria-hidden>
            <div className="ta-mq-track">
              {[0, 1].map((dup) => (
                <div className="ta-mq-seq" key={dup} aria-hidden={dup === 1}>
                  {mq.map((t, i) => (
                    <span className="ta-mq-item" key={i}>
                      {t} <span className="ta-mq-sep">&nbsp;&nbsp;◆</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOOKBOOK / KOLEKSI — beat utama: spread unggulan + grid editorial + filter */}
        {items.length > 0 && (
          <section className="ta-look ta-pad" id="koleksi">
            <div className="ta-wrap">
              <div className="ta-look-head">
                <div className="ta-sec-head ta-reveal">
                  <span className="ta-eyebrow" data-edit="copy.lookbook_eyebrow">{cp.t('copy.lookbook_eyebrow')}</span>
                  <h2 data-edit="copy.lookbook_title">{content.showcase?.title ?? cp.t('copy.lookbook_title')}</h2>
                  {content.showcase?.subtitle && <p>{content.showcase.subtitle}</p>}
                </div>
                {cats.length > 1 && (
                  <div className="ta-chips ta-reveal" role="group" aria-label="Filter kategori">
                    <button className="ta-chip" type="button" aria-pressed="true" data-f="*" data-edit="copy.chip_semua">{cp.t('copy.chip_semua')}</button>
                    {cats.map((c) => (
                      <button className="ta-chip" type="button" aria-pressed="false" data-f={c} key={c}>{c}</button>
                    ))}
                  </div>
                )}
              </div>

              {feat && (
                <article className="ta-look-feat ta-reveal" data-cat={feat.kategori ?? ''}>
                  <div className="ta-look-feat-media">
                    <img src={feat.gambar} alt={feat.nama} loading="lazy" />
                    <StokBadge stok={feat.stok} habis={cp.t('copy.stok_habis')} sisa={cp.t('copy.stok_sisa')} />
                    <button className="ta-quick ta-lb-open" type="button" {...quickProps(feat)} data-edit="copy.quick_detail">{cp.t('copy.quick_detail')}</button>
                  </div>
                  <div className="ta-look-feat-body">
                    <span className="ta-look-idx" aria-hidden>01</span>
                    {feat.kategori && <span className="ta-cat">{feat.kategori}</span>}
                    <h3>{feat.nama}</h3>
                    {feat.desc && <p>{feat.desc}</p>}
                    <div className="ta-card-meta">
                      {feat.harga != null && <span className="ta-price">{rupiah(feat.harga)}</span>}
                    </div>
                    {itemCta(feat)}
                  </div>
                </article>
              )}

              {rest.length > 0 && (
                <div className={`ta-look-grid${sparse ? (rest.length === 1 ? ' ta-look-solo' : ' ta-look-duo') : ''}`}>
                  {rest.map((it, i) => (
                    <article className="ta-card ta-reveal" data-cat={it.kategori ?? ''} key={i} style={{ '--ta-d': `${(i % 3) * 90}ms` } as CSSProperties}>
                      <div className="ta-card-media">
                        {it.gambar ? (
                          <img src={it.gambar} alt={it.nama} loading="lazy" />
                        ) : (
                          <span className="ta-card-ini" aria-hidden>{initials(it.nama)}</span>
                        )}
                        <StokBadge stok={it.stok} habis={cp.t('copy.stok_habis')} sisa={cp.t('copy.stok_sisa')} />
                        {it.gambar && (
                          <button className="ta-quick ta-lb-open" type="button" {...quickProps(it)} data-edit="copy.quick_detail">{cp.t('copy.quick_detail')}</button>
                        )}
                      </div>
                      <div className="ta-card-body">
                        {it.kategori && <span className="ta-cat">{it.kategori}</span>}
                        <h3 className="ta-card-nm">{it.nama}</h3>
                        <div className="ta-card-meta">
                          {it.harga != null && <span className="ta-price">{rupiah(it.harga)}</span>}
                        </div>
                        {itemCta(it)}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* STATEMENT — filosofi, reveal blur + garis aksen tergambar */}
        {content.statement && (
          <section className="ta-statement ta-pad" id="filosofi">
            <div className="ta-wrap ta-reveal ta-reveal-blur">
              <div className="ta-statement-side">
                <span className="ta-eyebrow" data-edit="copy.statement_eyebrow">{content.statement.eyebrow ?? cp.t('copy.statement_eyebrow')}</span>
                <span className="ta-rule" aria-hidden />
              </div>
              <div>
                <p className="ta-quote">{content.statement.quote}</p>
                {content.statement.cite && <span className="ta-cite">{content.statement.cite}</span>}
              </div>
            </div>
          </section>
        )}

        {/* KEUNGGULAN — passage kiri pinned (CSS sticky), kanan baris bernomor */}
        {content.features && content.features.length > 0 && (
          <section className="ta-why ta-pad">
            <div className="ta-wrap">
              <div className="ta-why-side ta-reveal">
                <span className="ta-eyebrow" data-edit="copy.features_eyebrow">{content.featuresEyebrow ?? cp.t('copy.features_eyebrow')}</span>
                <h2 data-edit="copy.features_title">{content.featuresTitle ?? cp.t('copy.features_title')}</h2>
                {content.featuresSubtitle && <p>{content.featuresSubtitle}</p>}
              </div>
              <div className="ta-why-rows">
                {content.features.map((f, i) => (
                  <div className="ta-why-row ta-reveal ta-reveal-r" key={i} style={{ '--ta-d': `${i * 90}ms` } as CSSProperties}>
                    <span className="ta-why-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <b>{f.title}</b>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CERITA / ABOUT — split-screen, judul melintasi seam, parallax progresif */}
        {content.about && (
          <section className={`ta-about${content.about.image ? '' : ' ta-about-noimg'}`} id="cerita">
            {content.about.image && (
              <div className="ta-about-media">
                <img src={content.about.image} alt={content.about.title} loading="lazy" />
              </div>
            )}
            <div className="ta-about-body">
              <span className="ta-eyebrow ta-reveal" data-edit="copy.about_eyebrow">{cp.t('copy.about_eyebrow')}</span>
              <h2 className="ta-reveal">{content.about.title}</h2>
              <p className="ta-about-text ta-reveal" style={{ '--ta-d': '120ms' } as CSSProperties}>{content.about.body}</p>
              {content.about.ctaText && (
                <a className="ta-about-link ta-reveal" style={{ '--ta-d': '220ms' } as CSSProperties} href={content.about.ctaHref ?? '#kontak'}>
                  {content.about.ctaText} →
                </a>
              )}
            </div>
          </section>
        )}

        {/* STATS — band hairline 4 kolom; SSR nilai final, JS count-up saat terlihat */}
        {content.stats && content.stats.length > 0 && (
          <section className="ta-stats" aria-label="Pencapaian kami">
            <div className="ta-wrap">
              <div className="ta-stats-grid">
                {content.stats.map((s, i) => (
                  <div className="ta-stat ta-reveal" key={i} style={{ '--ta-d': `${i * 80}ms` } as CSSProperties}>
                    <span className="ta-stat-num" data-cu>{s.angka}</span>
                    <span className="ta-stat-lbl">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GALERI — mosaik editorial + pita breakout edge-to-edge; klik = lightbox */}
        {galImgs.length > 0 && (
          <section className="ta-pad" id="galeri">
            <div className="ta-wrap">
              <div className="ta-sec-head ta-reveal">
                <span className="ta-eyebrow" data-edit="copy.gallery_eyebrow">{cp.t('copy.gallery_eyebrow')}</span>
                <h2 data-edit="copy.gallery_title">{content.gallery?.title ?? cp.t('copy.gallery_title')}</h2>
                {content.gallery?.subtitle && <p>{content.gallery.subtitle}</p>}
              </div>
              <div className="ta-gal-grid">
                {galMosaic.map((g, i) => (
                  <figure className="ta-gal ta-reveal ta-reveal-sc" key={i} style={{ '--ta-d': `${i * 80}ms` } as CSSProperties}>
                    <img src={g.src} alt={g.caption ?? `Galeri ${i + 1}`} loading="lazy" />
                    {g.caption && <figcaption>{g.caption}</figcaption>}
                    <button
                      type="button" className="ta-gal-zoom ta-lb-open"
                      aria-label={`Perbesar foto: ${g.caption ?? `galeri ${i + 1}`}`}
                      data-src={g.src} data-cat={cp.t('copy.gallery_lb_cat')} data-title={g.caption ?? content.gallery?.title ?? cp.t('copy.gallery_eyebrow')}
                    />
                  </figure>
                ))}
              </div>
            </div>
            {galBreak.length > 0 && (
              <div className="ta-gal-break">
                {galBreak.map((g, i) => (
                  <figure className="ta-gal ta-reveal ta-reveal-sc" key={i} style={{ '--ta-d': `${i * 90}ms` } as CSSProperties}>
                    <img src={g.src} alt={g.caption ?? `Galeri ${galMosaic.length + i + 1}`} loading="lazy" />
                    {g.caption && <figcaption>{g.caption}</figcaption>}
                    <button
                      type="button" className="ta-gal-zoom ta-lb-open"
                      aria-label={`Perbesar foto: ${g.caption ?? `galeri ${galMosaic.length + i + 1}`}`}
                      data-src={g.src} data-cat={cp.t('copy.gallery_lb_cat')} data-title={g.caption ?? content.gallery?.title ?? cp.t('copy.gallery_eyebrow')}
                    />
                  </figure>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TESTIMONI — carousel scroll-snap; JS hanya tombol + dot */}
        {content.testimonials && content.testimonials.length > 0 && (
          <section className="ta-tsec ta-pad">
            <div className="ta-wrap">
              <div className="ta-look-head">
                <div className="ta-sec-head ta-reveal">
                  <span className="ta-eyebrow" data-edit="copy.testi_eyebrow">{cp.t('copy.testi_eyebrow')}</span>
                  <h2 data-edit="copy.testi_title">{cp.t('copy.testi_title')}</h2>
                </div>
                {content.testimonials.length > 1 && (
                  <div className="ta-tctrl ta-reveal">
                    <button type="button" className="ta-tbtn ta-tprev" aria-label="Testimoni sebelumnya">{CHEV_L}</button>
                    <button type="button" className="ta-tbtn ta-tnext" aria-label="Testimoni berikutnya">{CHEV_R}</button>
                  </div>
                )}
              </div>
              <div className="ta-tcar ta-reveal" role="region" aria-roledescription="carousel" aria-label="Testimoni pelanggan">
                <div className="ta-tcar-track" tabIndex={0} role="group" aria-label="Daftar testimoni — gulir horizontal atau pakai tombol panah">
                  {content.testimonials.map((t, i) => (
                    <figure className="ta-tslide" key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} dari ${content.testimonials!.length}`}>
                      <blockquote>
                        <p className="ta-tquote">{t.quote}</p>
                      </blockquote>
                      <figcaption className="ta-tmeta">
                        <span className="ta-tava" aria-hidden>{initials(t.nama)}</span>
                        <span>
                          <span className="ta-tnm">{t.nama}</span>
                          {t.peran && <span className="ta-trole">{t.peran}</span>}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
                {content.testimonials.length > 1 && (
                  <div className="ta-dots" role="group" aria-label="Pilih testimoni">
                    {content.testimonials.map((_, i) => (
                      <button type="button" className="ta-dot" key={i} aria-label={`Ke testimoni ${i + 1}`} aria-current={i === 0 ? 'true' : 'false'} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FAQ — details CSS murni, ikon plus berputar */}
        {content.faq && content.faq.length > 0 && (
          <section className="ta-pad" id="tanya">
            <div className="ta-wrap ta-faq-grid">
              <div className="ta-faq-side ta-reveal">
                <span className="ta-eyebrow" data-edit="copy.faq_eyebrow">{cp.t('copy.faq_eyebrow')}</span>
                <h2 data-edit="copy.faq_title">{cp.t('copy.faq_title')}</h2>
                <p data-edit="copy.faq_sub">{cp.t('copy.faq_sub')}</p>
                {waLink && (
                  <a className="ta-about-link" href={waLink} target="_blank" rel="noopener noreferrer" data-edit="copy.faq_wa">{cp.t('copy.faq_wa')} →</a>
                )}
              </div>
              <div className="ta-faq-list">
                {content.faq.map((f, i) => (
                  <details className="ta-qa ta-reveal" key={i} style={{ '--ta-d': `${i * 70}ms` } as CSSProperties}>
                    <summary>
                      {f.q}
                      <span className="ta-qa-ic" aria-hidden />
                    </summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA BAND — full-bleed duotone (grayscale + tint aksen) + tombol magnetic */}
        {content.cta && (
          <section className={`ta-cta${content.cta.image ? '' : ' ta-cta-noimg'}`}>
            <div className="ta-cta-bg" style={content.cta.image ? { backgroundImage: `url(${content.cta.image})` } : undefined} />
            <div className="ta-cta-tint" />
            <div className="ta-cta-scrim" />
            <div className="ta-grain" />
            <div className="ta-cta-in ta-reveal">
              <h2>{content.cta.title}</h2>
              {content.cta.subtitle && <p className="ta-cta-sub">{content.cta.subtitle}</p>}
              <div className="ta-cta-actions">
                <a className="ta-btn ta-btn-solid ta-mag" href={ctaHref} {...(ctaHref.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} data-edit="copy.contact_cta">
                  {content.cta.ctaText ?? cp.t('copy.contact_cta')}
                </a>
                {items.length > 0 && (
                  <a className="ta-btn ta-btn-ghost" href="#koleksi" data-edit="copy.cta_ghost">{cp.t('copy.cta_ghost')}</a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* BAND ADD-ON (newsletter/career) — additive, hadir hanya bila adapter
            menemukan row cta ber-preset (injeksi B-section). Pola sama
            ComposableRenderer; data-band utk verifikasi. */}
        {(content.bands ?? []).map((b, i) => (
          <section className="ta-band" data-band={b.preset} key={`${b.preset}-${i}`}>
            <div className="ta-wrap ta-band-in">
              <div>
                <h2>{b.title}</h2>
                {b.subtitle && <p>{b.subtitle}</p>}
              </div>
              {b.ctaText && <a className="ta-btn ta-btn-solid" href={b.ctaHref ?? waLink ?? '#kontak'}>{b.ctaText}</a>}
            </div>
          </section>
        ))}
      </main>

      {/* FOOTER — wordmark raksasa ter-crop */}
      <footer className="ta-footer" id="kontak">
        <div className="ta-wrap">
          <div className="ta-footer-grid">
            <div>
              <span className="ta-brand">{content.nama}</span>
              <p className="ta-footer-tag" data-edit="copy.footer_tagline">{content.hero.subtitle ?? cp.t('copy.footer_tagline')}</p>
            </div>
            <div>
              <div className="ta-f-label" data-edit="copy.footer_kunjungi_h">{cp.t('copy.footer_kunjungi_h')}</div>
              <div className="ta-f-rows">
                {content.contact?.alamat && <span>{content.contact.alamat}</span>}
                {content.contact?.email && <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>}
                {waLink && <a href={waLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
                {(content.social?.links ?? []).map((s, i) => (
                  <a key={i} href={s.href}>{s.label ?? s.platform}</a>
                ))}
              </div>
            </div>
            <div>
              {content.info?.jam && content.info.jam.length > 0 && (
                <>
                  <div className="ta-f-label" data-edit="copy.footer_jam_h">{cp.t('copy.footer_jam_h')}</div>
                  <div className="ta-f-jam">
                    {content.info.jam.map((j, i) => (
                      <span key={i} style={{ display: 'contents' }}><span>{j.hari}</span><span>{j.jam}</span></span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="ta-footer-markwrap" aria-hidden>
          <div className="ta-footer-mark">{content.nama}</div>
        </div>
        <div className="ta-wrap">
          <div className="ta-footer-cr">
            <span data-edit="copy.footer_copyright">© {new Date().getUTCFullYear()} {content.nama}. {cp.t('copy.footer_copyright')}</span>
            <span data-edit="copy.footer_credit">{cp.t('copy.footer_credit')}</span>
          </div>
        </div>
      </footer>

      {waLink && (
        <a className="ta-wa" href={waLink} target="_blank" rel="noopener noreferrer" aria-label="Pesan via WhatsApp">{WA_ICON}</a>
      )}

      {/* LIGHTBOX — dialog tunggal SSR; diisi script dari data-* trigger */}
      {hasQuickLook && (
        <div className="ta-lb" role="dialog" aria-modal="true" aria-label="Pratinjau produk" hidden>
          <div className="ta-lb-back" data-lb-close aria-hidden />
          <figure className="ta-lb-panel">
            <button type="button" className="ta-lb-x" data-lb-close aria-label="Tutup pratinjau">×</button>
            <div className="ta-lb-media"><img alt="" /></div>
            <figcaption className="ta-lb-body">
              <span className="ta-lb-cat" />
              <span className="ta-lb-title" />
              <span className="ta-lb-price" />
              <p className="ta-lb-desc" />
              <a className="ta-btn ta-btn-solid ta-lb-cta" href="#" target="_blank" rel="noopener noreferrer" data-edit="copy.lightbox_cta">{cp.t('copy.lightbox_cta')}</a>
            </figcaption>
            <button type="button" className="ta-lb-prev" aria-label="Item sebelumnya">{CHEV_L}</button>
            <button type="button" className="ta-lb-next" aria-label="Item berikutnya">{CHEV_R}</button>
          </figure>
        </div>
      )}
    </div>
  )
}
