// ============================================================
// TOKO-KULINER — renderer bespoke lux untuk sub-kategori KULINER (toko makanan).
// Arah seni "Toko Dapur": editorial dapur-rumahan-premium tempat hidangan
// disajikan seperti halaman majalah masak — Newsreader (serif literer, italic
// hangat) + Plus Jakarta Sans (geometric ramah), geometri LEMBAT (sudut membulat
// 12–16px, bayangan hangat), tata letak "papan menu" ber-leader titik.
//
// SENGAJA BERBEDA dari Toko Atelier (fashion): atelier = near-black tajam 2px,
// Fraunces+Archivo, lookbook grid grayscale. Kuliner = hangat membulat, menu-board,
// galeri film-strip, foto berwarna penuh selera. Dua varian:
//   • tungku — krem hangat & ember terracotta (terang, appetite).
//   • pamor  — espresso gelap & emas (heritage, dramatis sinematik).
//
// Interaksi via LUX_JS bersama (hook `.lx-*`); STYLING pakai namespace `.kl-*`.
// Mengonsumsi ComposableContent yang sama (nol plumbing baru). Tombol keranjang
// di-inject via slot CartButton (SiteRenderer kirim AtelierCartButton saat hasCart).
// ============================================================
import type { CSSProperties } from 'react'
import type { ShowcaseItem } from '@/lib/theme-system/manifest'
import type { BespokeTokoProps } from './types'
import { LUX_JS } from './lux-script'
import BespokeLightbox from './BespokeLightbox'

// ── Palet peran semantik (tungku = default) ───────────────────
export interface KlPal {
  bg: string; bg2: string; surface: string; ink: string; inkDim: string
  muted: string; accent: string; onAccent: string; line: string; line2: string
  scrim: string
}
export const PALETTES: Record<string, KlPal> = {
  // Tungku — krem linen hangat & ember terracotta. Terang, mengundang selera.
  tungku: {
    bg: '#F7F0E4', bg2: '#EFE5D3', surface: '#FFFDF8', ink: '#241A12', inkDim: '#4A3B2A',
    muted: '#6A5842', accent: '#A8381A', onAccent: '#FFF8F0',
    line: 'rgba(36,26,18,.12)', line2: 'rgba(36,26,18,.07)', scrim: '#1A120A',
  },
  // Pamor — espresso near-black & emas tua. Heritage, dramatis, sinematik.
  pamor: {
    bg: '#1A120C', bg2: '#22170F', surface: '#2A1D12', ink: '#F3E9D9', inkDim: '#DAC9B0',
    muted: '#A8927A', accent: '#C9A24A', onAccent: '#1A120C',
    line: 'rgba(243,233,217,.10)', line2: 'rgba(243,233,217,.06)', scrim: '#140D08',
  },
}
function getPal(variant?: string): KlPal {
  return PALETTES[variant ?? 'tungku'] ?? PALETTES.tungku
}

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400;1,6..72,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');"
const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif"
const SANS = "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const EASE = 'cubic-bezier(.16,1,.3,1)'

// Tekstur kertas halus (SVG feTurbulence inline) — atmosfer dapur, offline-safe.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.32'/%3E%3C/svg%3E"

function rupiah(n?: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return ''
  return 'Rp' + n.toLocaleString('id-ID')
}
function initials(nama: string): string {
  const p = nama.trim().split(/\s+/).filter(Boolean)
  const ini = (p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')
  return ini.toUpperCase() || 'K'
}

const WA_ICON = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
)
const CHEV_L = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
)
const CHEV_R = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
)

function StokBadge({ stok }: { stok?: number }) {
  if (typeof stok !== 'number') return null
  if (stok === 0) return <span className="kl-stok kl-stok-out">Habis</span>
  if (stok <= 5) return <span className="kl-stok">Sisa {stok}</span>
  return null
}

function klCss(): string {
  return `${FONT_IMPORT}
.kl-root{background:var(--kl-bg);color:var(--kl-ink);font-family:${SANS};line-height:1.7;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden;overflow-x:clip}
.kl-root h1,.kl-root h2,.kl-root h3{font-family:${SERIF};font-weight:500;letter-spacing:-.01em;line-height:1.08;margin:0}
.kl-root h1,.kl-root h2{text-wrap:balance}
.kl-root p{margin:0;text-wrap:pretty}
.kl-root a{color:inherit;text-decoration:none}
.kl-root img{display:block;max-width:100%}
.kl-root [id]{scroll-margin-top:92px}
.kl-root ::selection{background:var(--kl-accent);color:var(--kl-on-accent)}
.kl-root :focus-visible{outline:2px solid var(--kl-accent);outline-offset:3px}
.kl-wrap{max-width:1200px;margin:0 auto;padding:0 clamp(20px,4vw,46px)}
.kl-pad{padding:clamp(74px,10vw,128px) 0}
.kl-eyebrow{font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--kl-accent);display:inline-flex;align-items:center;gap:11px}
.kl-eyebrow::before{content:"";width:22px;height:2px;border-radius:2px;background:var(--kl-accent)}
.kl-btn{display:inline-flex;align-items:center;gap:9px;font-family:${SANS};font-size:13px;font-weight:700;letter-spacing:.02em;padding:15px 28px;border-radius:11px;transition:transform .3s ${EASE},background-color .3s ease,color .3s ease,border-color .3s ease,box-shadow .3s ease}
.kl-btn:active{transform:translateY(0) scale(.97)}
.kl-btn-solid{background:var(--kl-accent);color:var(--kl-on-accent);box-shadow:0 10px 26px color-mix(in srgb,var(--kl-accent) 30%,transparent)}
.kl-btn-solid:hover{transform:translateY(-2px);box-shadow:0 16px 34px color-mix(in srgb,var(--kl-accent) 38%,transparent)}
.kl-btn-ghost{border:1.5px solid rgba(255,255,255,.4);color:#fff}
.kl-btn-ghost:hover{border-color:#fff;background:rgba(255,255,255,.1);transform:translateY(-2px)}
.kl-sec-head{margin-bottom:clamp(34px,5vw,56px);max-width:60ch}
.kl-sec-head .kl-eyebrow{margin-bottom:16px}
.kl-sec-head h2{font-size:clamp(32px,4.6vw,54px)}
.kl-sec-head p{color:var(--kl-muted);margin-top:14px;font-size:16px;max-width:50ch}
/* reveal engine (digate .lx-js → no-JS tampil penuh) */
.lx-js .lx-reveal{opacity:0;transform:translateY(26px);transition:opacity .8s ${EASE},transform .8s ${EASE},filter .8s ${EASE};transition-delay:var(--kl-d,0ms)}
.lx-js .lx-reveal-l{transform:translateX(-32px)}
.lx-js .lx-reveal-r{transform:translateX(32px)}
.lx-js .lx-reveal-sc{transform:translateY(16px) scale(.97)}
.lx-js .lx-reveal.lx-in{opacity:1;transform:none;filter:none}
/* ── nav ── */
.kl-nav{position:fixed;inset:0 0 auto 0;z-index:100;transition:background-color .4s ease,box-shadow .4s ease}
.kl-nav-in{display:flex;align-items:center;justify-content:space-between;gap:22px;max-width:1200px;margin:0 auto;padding:22px clamp(20px,4vw,46px);transition:padding .45s ${EASE}}
.lx-scrolled .kl-nav{background:color-mix(in srgb,var(--kl-bg) 90%,transparent);backdrop-filter:blur(16px) saturate(1.3);box-shadow:0 1px 0 var(--kl-line2),0 10px 30px color-mix(in srgb,var(--kl-scrim) 12%,transparent)}
.lx-scrolled .kl-nav-in{padding-top:12px;padding-bottom:12px}
.kl-brand{display:inline-flex;align-items:center;gap:11px;font-family:${SERIF};font-size:23px;font-weight:600;letter-spacing:-.01em;color:#fff;transition:color .3s ease}
.lx-scrolled .kl-brand{color:var(--kl-ink)}
.kl-brand-mk{width:38px;height:38px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-family:${SERIF};font-style:italic;font-size:19px;background:var(--kl-accent);color:var(--kl-on-accent);box-shadow:0 4px 14px color-mix(in srgb,var(--kl-accent) 38%,transparent)}
.kl-nav-links{display:flex;gap:28px}
.kl-nav-link{font-family:${SANS};font-size:13px;font-weight:600;color:rgba(255,255,255,.9);position:relative;padding:4px 0;transition:color .25s ease}
.lx-scrolled .kl-nav-link{color:var(--kl-inkDim,#4A3B2A)}
.kl-nav-link::after{content:"";position:absolute;left:0;bottom:-1px;width:100%;height:2px;border-radius:2px;background:var(--kl-accent);transform:scaleX(0);transform-origin:left;transition:transform .35s ${EASE}}
.kl-nav-link:hover{color:var(--kl-accent)}
.kl-nav-link:hover::after,.kl-nav-link:focus-visible::after{transform:scaleX(1)}
.kl-nav-cta{font-family:${SANS};font-size:12px;font-weight:700;background:rgba(255,255,255,.16);backdrop-filter:blur(6px);border:1.5px solid rgba(255,255,255,.5);color:#fff;padding:11px 20px;border-radius:10px;transition:background-color .3s,color .3s,border-color .3s}
.kl-nav-cta:hover{background:var(--kl-accent);border-color:var(--kl-accent);color:var(--kl-on-accent)}
.lx-scrolled .kl-nav-cta{background:var(--kl-accent);border-color:var(--kl-accent);color:var(--kl-on-accent)}
@media(max-width:880px){.kl-nav-links{display:none}}
/* ── hero ── */
.kl-hero{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:flex-end;overflow:hidden;color:#fff}
.lx-sentinel{position:absolute;top:0;left:0;width:1px;height:120px;opacity:0;pointer-events:none}
.kl-hero-bg{position:absolute;inset:0;background:#241a12 center/cover no-repeat;transform:scale(1.08);animation:klKb 18s ease-out forwards}
@keyframes klKb{to{transform:scale(1)}}
.kl-hero-scrim{position:absolute;inset:0;background:linear-gradient(to top,color-mix(in srgb,var(--kl-scrim) 94%,transparent) 0%,color-mix(in srgb,var(--kl-scrim) 46%,transparent) 40%,transparent 72%),linear-gradient(118deg,color-mix(in srgb,var(--kl-scrim) 56%,transparent),transparent 58%)}
.kl-grain{position:absolute;inset:0;background:url("${GRAIN}") repeat;background-size:160px 160px;mix-blend-mode:soft-light;opacity:.7;pointer-events:none;z-index:1}
/* pamor: bara hangat di sudut → kesan tungku menyala */
[data-variant="pamor"] .kl-hero-scrim{background:linear-gradient(to top,color-mix(in srgb,var(--kl-scrim) 95%,transparent) 0%,color-mix(in srgb,var(--kl-scrim) 50%,transparent) 42%,transparent 74%),radial-gradient(ellipse 60% 50% at 16% 92%,color-mix(in srgb,var(--kl-accent) 26%,transparent),transparent 60%)}
.kl-hero-in{position:relative;z-index:2;width:100%;max-width:1200px;margin:0 auto;padding:0 clamp(20px,4vw,46px) clamp(66px,10vh,104px)}
.kl-hero .kl-eyebrow{color:var(--kl-accent);opacity:0;animation:klFadeUp .9s ${EASE} .15s forwards}
[data-variant="tungku"] .kl-hero .kl-eyebrow{color:#FFD9A8}
.kl-hero h1{font-size:clamp(46px,8.4vw,112px);font-weight:400;letter-spacing:-.018em;line-height:1.0;margin:20px 0 0;max-width:15ch;color:#fff}
.kl-hero h1 em{font-style:italic;color:#FFE0B0}
.kl-w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em}
.kl-w>span{display:inline-block;transform:translateY(120%);animation:klRise 1.05s ${EASE} forwards;animation-delay:var(--kl-d,0ms)}
@keyframes klRise{to{transform:translateY(0)}}
@keyframes klFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.kl-hero-sub{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:30px;margin-top:34px;opacity:0;animation:klFadeUp 1s ${EASE} .7s forwards}
.kl-hero-sub p{max-width:44ch;font-size:17px;color:rgba(255,255,255,.9);line-height:1.7}
.kl-hero-actions{display:flex;gap:12px;flex-wrap:wrap}
.kl-hero-chips{display:flex;gap:9px;flex-wrap:wrap;margin-top:26px;opacity:0;animation:klFadeUp 1.1s ${EASE} .95s forwards}
.kl-hero-chip{font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.02em;color:#fff;background:rgba(255,255,255,.14);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.26);padding:8px 14px;border-radius:999px}
.kl-cue{position:absolute;left:50%;bottom:0;transform:translateX(-50%);z-index:2;width:2px;height:58px;overflow:hidden;border-radius:2px}
.kl-cue span{display:block;width:2px;height:100%;background:linear-gradient(to bottom,transparent,#fff);animation:klCue 2.4s ${EASE} infinite}
@keyframes klCue{0%{transform:translateY(-100%)}55%{transform:translateY(0)}100%{transform:translateY(102%)}}
/* ── marquee ── */
.kl-marquee{background:var(--kl-accent);color:var(--kl-on-accent);padding:15px 0;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.kl-mq-track{display:flex;width:max-content;animation:klMarquee 34s linear infinite}
.kl-marquee:hover .kl-mq-track{animation-play-state:paused}
@keyframes klMarquee{to{transform:translateX(-50%)}}
.kl-mq-seq{display:flex;align-items:center;flex-shrink:0}
.kl-mq-item{font-family:${SERIF};font-style:italic;font-weight:400;font-size:clamp(16px,2vw,23px);white-space:nowrap;padding:0 22px;opacity:.96}
.kl-mq-sep{font-size:11px;opacity:.7}
/* ── menu board (showcase) ── */
.kl-menu-feat{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,3vw,40px);align-items:center;margin-bottom:clamp(40px,5vw,64px);background:var(--kl-surface);border:1px solid var(--kl-line2);border-radius:22px;overflow:hidden;box-shadow:0 24px 60px color-mix(in srgb,var(--kl-scrim) 12%,transparent)}
.kl-menu-feat-media{position:relative;overflow:hidden;aspect-ratio:5/4;min-height:280px}
.kl-menu-feat-media img{width:100%;height:100%;object-fit:cover;transition:transform 1.1s ${EASE}}
.kl-menu-feat:hover .kl-menu-feat-media img{transform:scale(1.05)}
.kl-menu-feat-body{padding:clamp(26px,3.4vw,48px) clamp(24px,3vw,44px) clamp(26px,3.4vw,48px) 0}
.kl-tag{display:inline-flex;align-items:center;gap:7px;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--kl-accent);background:color-mix(in srgb,var(--kl-accent) 12%,transparent);padding:6px 12px;border-radius:999px;margin-bottom:14px}
.kl-menu-feat-body h3{font-size:clamp(28px,3.4vw,42px);margin:0 0 12px}
.kl-menu-feat-body>p{color:var(--kl-inkDim,#4A3B2A);font-size:15.5px;line-height:1.75;max-width:42ch}
.kl-menu-feat-foot{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:24px}
.kl-price{font-family:${SERIF};font-weight:500;font-size:25px;color:var(--kl-accent);font-variant-numeric:tabular-nums}
@media(max-width:820px){.kl-menu-feat{grid-template-columns:1fr}.kl-menu-feat-body{padding:0 26px 30px}}
.kl-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:30px}
.kl-chip{font-family:${SANS};font-size:12px;font-weight:600;color:var(--kl-muted);background:var(--kl-surface);border:1px solid var(--kl-line);padding:9px 16px;border-radius:999px;cursor:pointer;transition:color .25s ease,background-color .25s ease,border-color .25s ease}
.kl-chip:hover{color:var(--kl-ink);border-color:var(--kl-accent)}
@media(hover:none){.kl-chip{padding:12px 18px}}
.kl-chip[aria-pressed="true"]{background:var(--kl-accent);color:var(--kl-on-accent);border-color:var(--kl-accent)}
.lx-hide{display:none!important}
.kl-menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,1.8vw,24px) clamp(28px,4vw,64px)}
.kl-mrow{display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:center;padding:16px 0;border-top:1px solid var(--kl-line2);transition:transform .35s ${EASE}}
.kl-mrow:hover{transform:translateX(4px)}
.kl-mrow-th{position:relative;width:64px;height:64px;border-radius:14px;overflow:hidden;flex:0 0 auto;background:linear-gradient(150deg,var(--kl-surface),var(--kl-bg2))}
.kl-mrow-th img{width:100%;height:100%;object-fit:cover;transition:transform .6s ${EASE}}
.kl-mrow:hover .kl-mrow-th img{transform:scale(1.08)}
.kl-mrow-th .kl-mrow-ini{display:flex;align-items:center;justify-content:center;height:100%;font-family:${SERIF};font-size:24px;color:var(--kl-accent);opacity:.55}
.kl-mrow-main{min-width:0}
.kl-mrow-top{display:flex;align-items:baseline;gap:10px}
.kl-mrow-nm{font-family:${SERIF};font-size:20px;font-weight:500;color:var(--kl-ink)}
.kl-mrow-leader{flex:1;border-bottom:1.5px dotted var(--kl-line);transform:translateY(-4px);min-width:14px}
.kl-mrow-pr{font-family:${SERIF};font-weight:500;font-size:18px;color:var(--kl-accent);white-space:nowrap;font-variant-numeric:tabular-nums}
.kl-mrow-desc{color:var(--kl-muted);font-size:13.5px;line-height:1.6;margin-top:3px;max-width:48ch}
.kl-mrow-act{display:flex;flex-direction:column;gap:7px;align-items:flex-end;flex:0 0 auto}
.kl-quick{font-family:${SANS};font-size:11px;font-weight:700;color:var(--kl-muted);background:transparent;border:1px solid var(--kl-line);padding:8px 13px;border-radius:9px;cursor:pointer;transition:color .25s ease,border-color .25s ease,background-color .25s ease;white-space:nowrap}
.kl-quick:hover{color:var(--kl-ink);border-color:var(--kl-accent)}
.kl-cardbtn{display:inline-flex;align-items:center;gap:7px;font-family:${SANS};font-size:11px;font-weight:700;color:var(--kl-on-accent);background:var(--kl-accent);border:1px solid var(--kl-accent);padding:8px 14px;border-radius:9px;cursor:pointer;white-space:nowrap;transition:filter .25s ease,transform .25s ease}
.kl-cardbtn:hover{filter:brightness(1.06);transform:translateY(-1px)}
.kl-stok{position:absolute;top:7px;left:7px;z-index:2;font-family:${SANS};font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;background:color-mix(in srgb,var(--kl-scrim) 72%,transparent);backdrop-filter:blur(5px);color:#fff;padding:4px 7px;border-radius:7px}
.kl-stok-out{background:color-mix(in srgb,#7a2418 84%,transparent)}
@media(max-width:760px){.kl-menu-grid{grid-template-columns:1fr;gap:0}.kl-mrow-act{flex-direction:row}}
/* ── statement (kartu resep) ── */
.kl-statement .kl-wrap{display:grid;place-items:center}
.kl-recipe{position:relative;max-width:860px;text-align:center;background:var(--kl-surface);border:1px solid var(--kl-line2);border-radius:24px;padding:clamp(40px,6vw,76px) clamp(28px,5vw,72px);box-shadow:0 30px 70px color-mix(in srgb,var(--kl-scrim) 14%,transparent)}
.kl-recipe::before,.kl-recipe::after{content:"";position:absolute;left:50%;transform:translateX(-50%);width:46px;height:2px;border-radius:2px;background:var(--kl-accent);opacity:.6}
.kl-recipe::before{top:26px}.kl-recipe::after{bottom:26px}
.kl-recipe .kl-eyebrow{justify-content:center;margin-bottom:22px}
.kl-quote{font-family:${SERIF};font-style:italic;font-weight:400;font-size:clamp(26px,3.4vw,42px);line-height:1.32;color:var(--kl-ink)}
.kl-cite{display:block;margin-top:24px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--kl-muted)}
/* ── keunggulan (kartu) ── */
.kl-why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2vw,26px)}
.kl-why-card{background:var(--kl-surface);border:1px solid var(--kl-line2);border-radius:18px;padding:clamp(26px,3vw,38px);transition:transform .4s ${EASE},box-shadow .4s ease}
.kl-why-card:hover{transform:translateY(-5px);box-shadow:0 22px 48px color-mix(in srgb,var(--kl-scrim) 12%,transparent)}
.kl-why-num{display:flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:14px;background:color-mix(in srgb,var(--kl-accent) 14%,transparent);font-family:${SERIF};font-style:italic;font-size:24px;color:var(--kl-accent);margin-bottom:20px}
.kl-why-card b{font-family:${SERIF};font-size:clamp(20px,2.2vw,24px);font-weight:500;display:block;margin-bottom:8px}
.kl-why-card p{color:var(--kl-muted);font-size:14.5px;line-height:1.7}
@media(max-width:820px){.kl-why-grid{grid-template-columns:1fr}}
/* ── cerita / about (split) ── */
.kl-about{display:grid;grid-template-columns:1fr 1fr;min-height:clamp(440px,76vh,720px);background:var(--kl-bg2)}
.kl-about-media{position:relative;overflow:hidden}
.kl-about-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.kl-about-body{display:flex;flex-direction:column;justify-content:center;padding:clamp(48px,7vw,96px) clamp(24px,5vw,80px)}
.kl-about-body h2{font-size:clamp(32px,4.2vw,52px);margin:16px 0 22px}
.kl-about-text{color:var(--kl-inkDim,#4A3B2A);font-size:16px;line-height:1.9;max-width:52ch;white-space:pre-wrap}
.kl-about-noimg{grid-template-columns:1fr}
.kl-about-noimg .kl-about-body{align-items:flex-start;max-width:820px;margin:0 auto;text-align:left}
.kl-about-link{margin-top:28px;display:inline-flex;align-items:center;gap:9px;font-family:${SANS};font-size:13px;font-weight:700;color:var(--kl-accent);position:relative;width:fit-content}
.kl-about-link::after{content:"";position:absolute;left:0;bottom:-4px;width:100%;height:2px;border-radius:2px;background:var(--kl-accent);transform:scaleX(0);transform-origin:left;transition:transform .35s ${EASE}}
.kl-about-link:hover::after{transform:scaleX(1)}
@media(max-width:820px){.kl-about{grid-template-columns:1fr;min-height:0}.kl-about-media{aspect-ratio:16/10}}
/* ── stats (count-up) ── */
.kl-stats .kl-wrap{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(14px,2vw,24px)}
.kl-stat{background:var(--kl-surface);border:1px solid var(--kl-line2);border-radius:18px;padding:clamp(26px,3vw,40px) clamp(18px,2vw,28px);text-align:center}
.kl-stat-num{display:block;font-family:${SERIF};font-weight:500;font-size:clamp(38px,4.6vw,60px);line-height:1;color:var(--kl-accent);font-variant-numeric:tabular-nums}
.kl-stat-lbl{display:block;margin-top:10px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.04em;color:var(--kl-muted)}
@media(max-width:760px){.kl-stats .kl-wrap{grid-template-columns:1fr 1fr}}
/* ── galeri (film-strip) ── */
.kl-gal-strip{display:flex;gap:clamp(14px,2vw,22px);overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none;padding:6px 0 14px;margin:0 calc(50% - 50vw);padding-left:max(clamp(20px,4vw,46px),calc(50vw - 600px));padding-right:max(clamp(20px,4vw,46px),calc(50vw - 600px))}
.kl-gal-strip::-webkit-scrollbar{display:none}
.kl-gal{position:relative;flex:0 0 clamp(240px,30vw,360px);aspect-ratio:4/5;scroll-snap-align:center;margin:0;overflow:hidden;border-radius:18px;background:linear-gradient(150deg,var(--kl-surface),var(--kl-bg2));box-shadow:0 16px 40px color-mix(in srgb,var(--kl-scrim) 12%,transparent);cursor:zoom-in}
.kl-gal img{width:100%;height:100%;object-fit:cover;transition:transform 1s ${EASE}}
.kl-gal:hover img,.kl-gal:focus-within img{transform:scale(1.06)}
.kl-gal figcaption{position:absolute;left:0;right:0;bottom:0;z-index:1;padding:34px 16px 14px;background:linear-gradient(to top,color-mix(in srgb,var(--kl-scrim) 82%,transparent),transparent);color:#fff;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.02em;opacity:0;transform:translateY(6px);transition:opacity .4s ease,transform .4s ${EASE}}
.kl-gal:hover figcaption,.kl-gal:focus-within figcaption{opacity:1;transform:none}
@media(hover:none){.kl-gal figcaption{opacity:1;transform:none}}
.kl-gal-zoom{position:absolute;inset:0;z-index:2;background:transparent;border:0;cursor:zoom-in;padding:0}
/* ── testimoni (carousel) ── */
.kl-tsec{background:var(--kl-bg2)}
.kl-tctrl{display:flex;gap:10px}
.kl-tbtn{width:46px;height:46px;border-radius:13px;border:1px solid var(--kl-line);background:var(--kl-surface);color:var(--kl-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color .25s ease,color .25s ease,border-color .25s ease,opacity .25s ease}
.kl-tbtn:hover:not(:disabled){background:var(--kl-accent);color:var(--kl-on-accent);border-color:var(--kl-accent)}
.kl-tbtn:disabled{opacity:.32;cursor:default}
.kl-thead{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:clamp(30px,4vw,48px)}
.kl-thead .kl-sec-head{margin-bottom:0}
.lx-tcar-track{display:flex;gap:clamp(16px,2vw,24px);overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:6px}
.lx-tcar-track::-webkit-scrollbar{display:none}
.kl-tslide{flex:0 0 min(100%,500px);scroll-snap-align:start;margin:0;display:flex;flex-direction:column;gap:24px;background:var(--kl-surface);border:1px solid var(--kl-line2);border-radius:20px;padding:clamp(28px,3.2vw,42px)}
.kl-tslide blockquote{margin:0;position:relative;padding-top:14px}
.kl-tquote{font-family:${SERIF};font-style:italic;font-size:clamp(18px,1.9vw,22px);line-height:1.55;color:var(--kl-ink)}
.kl-tstars{display:flex;gap:3px;color:var(--kl-accent);margin-bottom:14px}
.kl-tmeta{display:flex;align-items:center;gap:13px;margin-top:auto}
.kl-tava{flex:0 0 auto;width:46px;height:46px;border-radius:50%;background:color-mix(in srgb,var(--kl-accent) 16%,transparent);display:flex;align-items:center;justify-content:center;font-family:${SERIF};font-size:16px;color:var(--kl-accent)}
.kl-tnm{font-family:${SANS};font-size:14px;font-weight:700;color:var(--kl-ink);display:block}
.kl-trole{font-family:${SANS};font-size:12.5px;color:var(--kl-muted);display:block;margin-top:1px}
.kl-dots{display:flex;gap:8px;margin-top:24px}
.kl-dot{position:relative;width:8px;height:8px;border-radius:999px;background:var(--kl-line);border:0;padding:0;cursor:pointer;transition:width .3s ${EASE},background-color .3s ease}
.kl-dot::after{content:"";position:absolute;inset:-15px}
.kl-dot[aria-current="true"]{width:26px;background:var(--kl-accent)}
/* ── faq ── */
.kl-faq-grid{display:grid;grid-template-columns:.85fr 1.4fr;gap:clamp(32px,5vw,80px);align-items:start}
.kl-faq-side{position:sticky;top:104px}
.kl-faq-side h2{font-size:clamp(28px,3.6vw,44px);margin-top:16px}
.kl-faq-side p{color:var(--kl-muted);margin-top:14px;font-size:15px;max-width:34ch}
.kl-faq-side .kl-about-link{margin-top:22px}
.kl-qa{border:1px solid var(--kl-line2);border-radius:16px;margin-bottom:12px;background:var(--kl-surface);overflow:hidden;transition:border-color .3s ease}
.kl-qa[open]{border-color:color-mix(in srgb,var(--kl-accent) 50%,transparent)}
.kl-qa summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(18px,2.2vw,24px) clamp(20px,2.4vw,26px);font-family:${SERIF};font-size:clamp(17px,1.9vw,21px);font-weight:500;color:var(--kl-ink);transition:color .25s ease}
.kl-qa summary::-webkit-details-marker{display:none}
.kl-qa summary:hover{color:var(--kl-accent)}
.kl-qa-ic{flex:0 0 auto;width:30px;height:30px;border:1px solid var(--kl-line);border-radius:9px;position:relative;transition:transform .35s ${EASE},border-color .3s ease}
.kl-qa-ic::before,.kl-qa-ic::after{content:"";position:absolute;left:50%;top:50%;background:var(--kl-accent);transform:translate(-50%,-50%)}
.kl-qa-ic::before{width:12px;height:2px}
.kl-qa-ic::after{width:2px;height:12px}
.kl-qa[open] .kl-qa-ic{transform:rotate(45deg);border-color:var(--kl-accent)}
.kl-qa>p{color:var(--kl-inkDim,#4A3B2A);font-size:15px;line-height:1.8;max-width:58ch;padding:0 clamp(20px,2.4vw,26px) clamp(20px,2.4vw,24px)}
@media(max-width:820px){.kl-faq-grid{grid-template-columns:1fr;gap:26px}.kl-faq-side{position:static}}
/* ── cta band (duotone + magnetic) ── */
.kl-cta{position:relative;overflow:hidden;text-align:center;color:#fff}
.kl-cta-bg{position:absolute;inset:0;background:#241a12 center/cover no-repeat}
.kl-cta-tint{position:absolute;inset:0;background:linear-gradient(120deg,color-mix(in srgb,var(--kl-accent) 60%,transparent),transparent 72%);mix-blend-mode:multiply}
.kl-cta-scrim{position:absolute;inset:0;background:linear-gradient(to bottom,color-mix(in srgb,var(--kl-scrim) 82%,transparent),color-mix(in srgb,var(--kl-scrim) 62%,transparent) 50%,color-mix(in srgb,var(--kl-scrim) 86%,transparent))}
.kl-cta-noimg .kl-cta-bg{background:radial-gradient(ellipse 70% 60% at 18% 86%,color-mix(in srgb,var(--kl-accent) 26%,transparent),transparent 60%),var(--kl-bg2)}
.kl-cta-noimg .kl-cta-tint,.kl-cta-noimg .kl-cta-scrim{display:none}
.kl-cta-noimg{color:var(--kl-ink)}
.kl-cta-noimg h2{color:var(--kl-ink)}
.kl-cta-noimg .kl-cta-sub{color:var(--kl-inkDim,#4A3B2A)}
.kl-cta-in{position:relative;z-index:2;max-width:840px;margin:0 auto;padding:clamp(96px,13vw,164px) clamp(20px,4vw,46px)}
.kl-cta h2{font-size:clamp(38px,6vw,76px);font-weight:400;line-height:1.04;color:#fff}
.kl-cta-noimg h2{color:var(--kl-ink)}
.kl-cta-sub{color:rgba(255,255,255,.88);font-size:clamp(15px,1.6vw,18px);max-width:50ch;margin:20px auto 0;line-height:1.75}
.kl-cta-actions{display:flex;gap:13px;justify-content:center;flex-wrap:wrap;margin-top:38px}
.kl-mag{will-change:transform;transition:transform .45s cubic-bezier(.34,1.56,.64,1)}
/* ── lightbox ── */
.lx-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,40px)}
.lx-lb[hidden]{display:none}
.lx-lb-back{position:absolute;inset:0;background:color-mix(in srgb,var(--kl-scrim) 76%,transparent);backdrop-filter:blur(8px);border:0;cursor:pointer}
.lx-lb-panel{position:relative;z-index:2;display:grid;grid-template-columns:1.05fr .95fr;max-width:920px;width:100%;max-height:86vh;background:var(--kl-surface);border:1px solid var(--kl-line);border-radius:20px;margin:0;overflow:hidden;opacity:0;transform:translateY(16px) scale(.985);transition:opacity .45s ${EASE},transform .45s ${EASE}}
.lx-lb-in .lx-lb-panel{opacity:1;transform:none}
.lx-lb-media{position:relative;overflow:hidden;background:var(--kl-bg2);min-height:320px}
.lx-lb-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.lx-lb-body{padding:clamp(24px,3.2vw,42px);display:flex;flex-direction:column;gap:9px;justify-content:center}
.lx-lb-cat{font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--kl-accent)}
.lx-lb-title{font-family:${SERIF};font-size:clamp(24px,2.8vw,32px);font-weight:500;line-height:1.14}
.lx-lb-price{font-family:${SERIF};font-size:21px;color:var(--kl-accent);font-variant-numeric:tabular-nums}
.lx-lb-desc{color:var(--kl-inkDim,#4A3B2A);font-size:14px;line-height:1.75}
.lx-lb-cta{margin-top:14px;width:fit-content;display:inline-flex;align-items:center;gap:8px;font-family:${SANS};font-size:13px;font-weight:700;background:var(--kl-accent);color:var(--kl-on-accent);padding:13px 22px;border-radius:11px}
.lx-lb-x{position:absolute;top:10px;right:10px;z-index:3;width:42px;height:42px;border-radius:12px;background:color-mix(in srgb,var(--kl-surface) 86%,transparent);border:1px solid var(--kl-line);color:var(--kl-ink);font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color .25s,color .25s,border-color .25s}
.lx-lb-x:hover{background:var(--kl-accent);color:var(--kl-on-accent);border-color:var(--kl-accent)}
.lx-lb-prev,.lx-lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:42px;height:42px;border-radius:12px;background:color-mix(in srgb,var(--kl-surface) 86%,transparent);border:1px solid var(--kl-line);color:var(--kl-ink);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color .25s,color .25s,border-color .25s}
.lx-lb-prev{left:10px}.lx-lb-next{right:10px}
.lx-lb-prev:hover,.lx-lb-next:hover{background:var(--kl-accent);color:var(--kl-on-accent);border-color:var(--kl-accent)}
@media(max-width:760px){.lx-lb-panel{grid-template-columns:1fr;overflow:auto}.lx-lb-media{min-height:0;aspect-ratio:4/3}}
/* ── footer ── */
.kl-footer{background:color-mix(in srgb,var(--kl-bg) 70%,var(--kl-scrim));border-top:1px solid var(--kl-line2)}
.kl-footer-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:clamp(30px,5vw,52px);padding:clamp(52px,7vw,80px) 0 44px}
.kl-footer .kl-brand{font-size:28px;color:var(--kl-ink)}
.kl-footer-tag{color:var(--kl-muted);font-size:14px;line-height:1.8;margin-top:14px;max-width:34ch}
.kl-f-label{font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--kl-muted);margin-bottom:16px}
.kl-f-rows{display:grid;gap:10px;font-size:14px;color:var(--kl-inkDim,#4A3B2A)}
.kl-f-rows a{position:relative;width:fit-content}
.kl-f-rows a:hover{color:var(--kl-accent)}
.kl-f-jam{display:grid;grid-template-columns:auto 1fr;gap:6px 18px;font-size:14px;color:var(--kl-inkDim,#4A3B2A)}
.kl-f-jam span:nth-child(odd){color:var(--kl-muted)}
.kl-footer-cr{border-top:1px solid var(--kl-line2);padding:22px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:12.5px;color:var(--kl-muted)}
@media(max-width:820px){.kl-footer-grid{grid-template-columns:1fr;gap:32px}}
/* ── WA float ── */
.kl-wa{position:fixed;right:22px;bottom:22px;z-index:90;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 26px rgba(37,211,102,.4);transition:transform .25s ${EASE}}
.kl-wa:hover{transform:scale(1.08)}
/* ── reduced motion ── */
@media(prefers-reduced-motion:reduce){
.kl-root *,.kl-root *::before,.kl-root *::after{animation:none!important;transition:none!important}
.kl-hero-bg{transform:none}
.kl-w>span{transform:none}
.kl-hero .kl-eyebrow,.kl-hero-sub,.kl-hero-chips{opacity:1}
.lx-js .lx-reveal{opacity:1;transform:none;filter:none}
.kl-mag{transform:none!important}
.kl-gal figcaption{opacity:1;transform:none}
.lx-tcar-track{scroll-behavior:auto}
}
`
}

// Judul hero dipecah per kata → kaskade naik (clip per kata, SSR-safe tanpa JS).
function HeroTitle({ title }: { title: string }) {
  const words = title.trim().split(/\s+/)
  return (
    <h1>
      {words.map((w, i) => (
        <span className="kl-w" key={i}>
          <span style={{ '--kl-d': `${170 + i * 65}ms` } as CSSProperties}>{w}</span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </h1>
  )
}

export default function KulinerLuxRenderer({
  content, variant, primary, products, hasCart, CartButton,
}: BespokeTokoProps) {
  const pal = getPal(variant)
  const accent = (primary && primary.trim()) || pal.accent
  const rootStyle = {
    '--kl-bg': pal.bg, '--kl-bg2': pal.bg2, '--kl-surface': pal.surface, '--kl-ink': pal.ink,
    '--kl-inkDim': pal.inkDim, '--kl-muted': pal.muted, '--kl-accent': accent,
    '--kl-on-accent': pal.onAccent, '--kl-line': pal.line, '--kl-line2': pal.line2,
    '--kl-scrim': pal.scrim,
    background: pal.bg, color: pal.ink,
  } as CSSProperties

  const wa = content.contact?.wa
  const waLink = wa ? `https://wa.me/${wa.replace(/[^\d]/g, '')}` : undefined
  const waItem = (nm: string) =>
    wa ? `https://wa.me/${wa.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Halo ${content.nama}, saya ingin memesan "${nm}".`)}` : undefined

  const items = (content.showcase?.items ?? []).slice(0, 12)
  const feat = items.length > 0 && items[0].gambar ? items[0] : null
  const rest = feat ? items.slice(1) : items
  const cats = Array.from(new Set(items.map((it) => it.kategori).filter((k): k is string => !!k)))

  const itemCta = (it: ShowcaseItem) => {
    const prod = hasCart && CartButton ? products?.find((p) => p.nama === it.nama) : undefined
    if (prod && CartButton) return <CartButton product={prod} />
    const href = waItem(it.nama)
    if (!href) return null
    return <a className="kl-cardbtn" href={href} target="_blank" rel="noopener noreferrer">Pesan</a>
  }
  const quickProps = (it: ShowcaseItem) => ({
    'data-src': it.gambar,
    'data-cat': it.kategori ?? '',
    'data-title': it.nama,
    'data-price': rupiah(it.harga),
    'data-desc': it.desc ?? '',
    'data-href': waItem(it.nama) ?? '',
  })
  const hasQuickLook = items.some((it) => !!it.gambar) || (content.gallery?.images?.length ?? 0) > 0

  const mq = [content.nama, ...(content.features ?? []).map((f) => f.title)].filter(Boolean)

  const nav: { label: string; href: string }[] = []
  if (items.length) nav.push({ label: 'Menu', href: '#menu' })
  if (content.statement) nav.push({ label: 'Filosofi', href: '#filosofi' })
  if (content.about) nav.push({ label: 'Cerita', href: '#cerita' })
  if (content.gallery?.images?.length) nav.push({ label: 'Galeri', href: '#galeri' })
  nav.push({ label: 'Kontak', href: '#kontak' })

  const galImgs = (content.gallery?.images ?? []).slice(0, 8)
  const ctaHref = content.cta?.ctaHref && content.cta.ctaHref !== '#wa' ? content.cta.ctaHref : (waLink ?? '#kontak')

  const heroBg: CSSProperties = content.hero.image
    ? { backgroundImage: `url(${content.hero.image})` }
    : { background: `linear-gradient(150deg, color-mix(in srgb, ${pal.scrim} 78%, ${accent}), ${pal.scrim} 72%)` }

  return (
    <div className="kl-root lx-root" style={rootStyle} data-theme="toko-kuliner" data-variant={variant ?? 'tungku'}>
      <style dangerouslySetInnerHTML={{ __html: klCss() }} />
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />

      {/* NAV */}
      <header className="kl-nav">
        <div className="kl-nav-in">
          <a className="kl-brand" href="#atas" aria-label={content.nama}>
            <span className="kl-brand-mk" aria-hidden>{initials(content.nama)}</span>
            {content.nama}
          </a>
          {nav.length > 0 && (
            <nav className="kl-nav-links" aria-label="Navigasi utama">
              {nav.map((l) => <a key={l.href} className="kl-nav-link" href={l.href}>{l.label}</a>)}
            </nav>
          )}
          <a className="kl-nav-cta" href={waLink ?? '#kontak'}>Pesan Sekarang</a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="kl-hero" id="atas">
          <span className="lx-sentinel" aria-hidden />
          <div className="kl-hero-bg" style={heroBg} />
          <div className="kl-hero-scrim" />
          <div className="kl-grain" />
          <div className="kl-hero-in">
            {content.hero.eyebrow && <span className="kl-eyebrow">{content.hero.eyebrow}</span>}
            <HeroTitle title={content.hero.title} />
            <div className="kl-hero-sub">
              {content.hero.subtitle && <p>{content.hero.subtitle}</p>}
              <div className="kl-hero-actions">
                {content.hero.ctaText && (
                  <a className="kl-btn kl-btn-solid" href={content.hero.ctaHref ?? waLink ?? '#menu'}>{content.hero.ctaText}</a>
                )}
                {content.hero.ctaText2 && (
                  <a className="kl-btn kl-btn-ghost" href={content.hero.ctaHref2 ?? '#menu'}>{content.hero.ctaText2}</a>
                )}
              </div>
            </div>
            {cats.length > 0 && (
              <div className="kl-hero-chips" aria-hidden>
                {cats.slice(0, 5).map((c) => <span className="kl-hero-chip" key={c}>{c}</span>)}
              </div>
            )}
          </div>
          <span className="kl-cue" aria-hidden><span /></span>
        </section>

        {/* MARQUEE */}
        {mq.length > 1 && (
          <div className="kl-marquee" aria-hidden>
            <div className="kl-mq-track">
              {[0, 1].map((dup) => (
                <div className="kl-mq-seq" key={dup} aria-hidden={dup === 1}>
                  {mq.map((t, i) => (
                    <span className="kl-mq-item" key={i}>{t} <span className="kl-mq-sep">&nbsp;&nbsp;✦&nbsp;&nbsp;</span></span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MENU BOARD */}
        {items.length > 0 && (
          <section className="kl-menu kl-pad" id="menu">
            <div className="kl-wrap lx-look">
              <div className="kl-sec-head lx-reveal">
                <span className="kl-eyebrow">Daftar Menu</span>
                <h2>{content.showcase?.title ?? 'Menu Andalan'}</h2>
                {content.showcase?.subtitle && <p>{content.showcase.subtitle}</p>}
              </div>

              {feat && (
                <article className="kl-menu-feat lx-reveal" data-cat={feat.kategori ?? ''}>
                  <div className="kl-menu-feat-media">
                    <img src={feat.gambar} alt={feat.nama} loading="lazy" />
                    <StokBadge stok={feat.stok} />
                  </div>
                  <div className="kl-menu-feat-body">
                    <span className="kl-tag">{feat.kategori ?? 'Paling Dicari'}</span>
                    <h3>{feat.nama}</h3>
                    {feat.desc && <p>{feat.desc}</p>}
                    <div className="kl-menu-feat-foot">
                      {feat.harga != null && <span className="kl-price">{rupiah(feat.harga)}</span>}
                      {itemCta(feat)}
                      <button type="button" className="kl-quick lx-lb-open" {...quickProps(feat)}>Lihat Detail</button>
                    </div>
                  </div>
                </article>
              )}

              {cats.length > 1 && (
                <div className="kl-chips lx-reveal" role="group" aria-label="Filter kategori">
                  <button className="kl-chip lx-chip" type="button" aria-pressed="true" data-f="*">Semua</button>
                  {cats.map((c) => (
                    <button className="kl-chip lx-chip" type="button" aria-pressed="false" data-f={c} key={c}>{c}</button>
                  ))}
                </div>
              )}

              {rest.length > 0 && (
                <div className="kl-menu-grid">
                  {rest.map((it, i) => (
                    <article className="kl-mrow lx-reveal" data-cat={it.kategori ?? ''} key={i} style={{ '--kl-d': `${(i % 2) * 80}ms` } as CSSProperties}>
                      <div className="kl-mrow-th">
                        {it.gambar
                          ? <img src={it.gambar} alt={it.nama} loading="lazy" />
                          : <span className="kl-mrow-ini" aria-hidden>{initials(it.nama)}</span>}
                        <StokBadge stok={it.stok} />
                      </div>
                      <div className="kl-mrow-main">
                        <div className="kl-mrow-top">
                          <span className="kl-mrow-nm">{it.nama}</span>
                          <span className="kl-mrow-leader" aria-hidden />
                          {it.harga != null && <span className="kl-mrow-pr">{rupiah(it.harga)}</span>}
                        </div>
                        {it.desc && <p className="kl-mrow-desc">{it.desc}</p>}
                      </div>
                      <div className="kl-mrow-act">
                        {it.gambar && <button type="button" className="kl-quick lx-lb-open" {...quickProps(it)}>Detail</button>}
                        {itemCta(it)}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* STATEMENT — kartu resep */}
        {content.statement && (
          <section className="kl-statement kl-pad" id="filosofi">
            <div className="kl-wrap">
              <div className="kl-recipe lx-reveal lx-reveal-sc">
                <span className="kl-eyebrow">{content.statement.eyebrow ?? 'Filosofi Dapur'}</span>
                <p className="kl-quote">{content.statement.quote}</p>
                {content.statement.cite && <span className="kl-cite">{content.statement.cite}</span>}
              </div>
            </div>
          </section>
        )}

        {/* KEUNGGULAN — kartu */}
        {content.features && content.features.length > 0 && (
          <section className="kl-pad">
            <div className="kl-wrap">
              <div className="kl-sec-head lx-reveal">
                <span className="kl-eyebrow">{content.featuresEyebrow ?? 'Mengapa Kami'}</span>
                <h2>{content.featuresTitle ?? 'Resep kepercayaan pelanggan'}</h2>
                {content.featuresSubtitle && <p>{content.featuresSubtitle}</p>}
              </div>
              <div className="kl-why-grid">
                {content.features.slice(0, 3).map((f, i) => (
                  <div className="kl-why-card lx-reveal" key={i} style={{ '--kl-d': `${i * 90}ms` } as CSSProperties}>
                    <span className="kl-why-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                    <b>{f.title}</b>
                    <p>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CERITA / ABOUT */}
        {content.about && (
          <section className={`kl-about${content.about.image ? '' : ' kl-about-noimg'}`} id="cerita">
            {content.about.image && (
              <div className="kl-about-media">
                <img src={content.about.image} alt={content.about.title} loading="lazy" />
              </div>
            )}
            <div className="kl-about-body">
              <span className="kl-eyebrow lx-reveal">Cerita Kami</span>
              <h2 className="lx-reveal">{content.about.title}</h2>
              <p className="kl-about-text lx-reveal" style={{ '--kl-d': '120ms' } as CSSProperties}>{content.about.body}</p>
              {content.about.ctaText && (
                <a className="kl-about-link lx-reveal" style={{ '--kl-d': '220ms' } as CSSProperties} href={content.about.ctaHref ?? '#kontak'}>
                  {content.about.ctaText} →
                </a>
              )}
            </div>
          </section>
        )}

        {/* STATS */}
        {content.stats && content.stats.length > 0 && (
          <section className="kl-stats kl-pad" aria-label="Pencapaian kami">
            <div className="kl-wrap">
              {content.stats.map((s, i) => (
                <div className="kl-stat lx-reveal" key={i} style={{ '--kl-d': `${i * 80}ms` } as CSSProperties}>
                  <span className="kl-stat-num" data-cu>{s.angka}</span>
                  <span className="kl-stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALERI — film strip */}
        {galImgs.length > 0 && (
          <section className="kl-pad" id="galeri">
            <div className="kl-wrap">
              <div className="kl-sec-head lx-reveal">
                <span className="kl-eyebrow">Galeri</span>
                <h2>{content.gallery?.title ?? 'Dari Dapur Kami'}</h2>
                {content.gallery?.subtitle && <p>{content.gallery.subtitle}</p>}
              </div>
            </div>
            <div className="kl-gal-strip">
              {galImgs.map((g, i) => (
                <figure className="kl-gal lx-reveal lx-reveal-sc" key={i} style={{ '--kl-d': `${(i % 4) * 80}ms` } as CSSProperties}>
                  <img src={g.src} alt={g.caption ?? `Galeri ${i + 1}`} loading="lazy" />
                  {g.caption && <figcaption>{g.caption}</figcaption>}
                  <button
                    type="button" className="kl-gal-zoom lx-lb-open"
                    aria-label={`Perbesar foto: ${g.caption ?? `galeri ${i + 1}`}`}
                    data-src={g.src} data-cat="Dari Dapur" data-title={g.caption ?? content.gallery?.title ?? 'Galeri'}
                  />
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* TESTIMONI — carousel */}
        {content.testimonials && content.testimonials.length > 0 && (
          <section className="kl-tsec kl-pad">
            <div className="kl-wrap">
              <div className="kl-thead">
                <div className="kl-sec-head lx-reveal">
                  <span className="kl-eyebrow">Testimoni</span>
                  <h2>Kata mereka yang mencicipi</h2>
                </div>
                {content.testimonials.length > 1 && (
                  <div className="kl-tctrl lx-reveal">
                    <button type="button" className="kl-tbtn lx-tprev" aria-label="Testimoni sebelumnya">{CHEV_L}</button>
                    <button type="button" className="kl-tbtn lx-tnext" aria-label="Testimoni berikutnya">{CHEV_R}</button>
                  </div>
                )}
              </div>
              <div className="lx-tcar lx-reveal" role="region" aria-roledescription="carousel" aria-label="Testimoni pelanggan">
                <div className="lx-tcar-track" tabIndex={0} role="group" aria-label="Daftar testimoni — gulir horizontal atau pakai tombol panah">
                  {content.testimonials.map((t, i) => (
                    <figure className="kl-tslide" key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} dari ${content.testimonials!.length}`}>
                      <blockquote>
                        <span className="kl-tstars" aria-hidden>★★★★★</span>
                        <p className="kl-tquote">{t.quote}</p>
                      </blockquote>
                      <figcaption className="kl-tmeta">
                        <span className="kl-tava" aria-hidden>{initials(t.nama)}</span>
                        <span>
                          <span className="kl-tnm">{t.nama}</span>
                          {t.peran && <span className="kl-trole">{t.peran}</span>}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
                {content.testimonials.length > 1 && (
                  <div className="kl-dots" role="group" aria-label="Pilih testimoni">
                    {content.testimonials.map((_, i) => (
                      <button type="button" className="kl-dot lx-dot" key={i} aria-label={`Ke testimoni ${i + 1}`} aria-current={i === 0 ? 'true' : 'false'} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {content.faq && content.faq.length > 0 && (
          <section className="kl-pad" id="tanya">
            <div className="kl-wrap kl-faq-grid">
              <div className="kl-faq-side lx-reveal">
                <span className="kl-eyebrow">Tanya Jawab</span>
                <h2>Hal yang sering ditanyakan</h2>
                <p>Belum menemukan jawaban Anda? Kami senang membantu.</p>
                {waLink && <a className="kl-about-link" href={waLink} target="_blank" rel="noopener noreferrer">Tanya via WhatsApp →</a>}
              </div>
              <div className="kl-faq-list">
                {content.faq.map((f, i) => (
                  <details className="kl-qa lx-reveal" key={i} style={{ '--kl-d': `${i * 60}ms` } as CSSProperties}>
                    <summary>{f.q}<span className="kl-qa-ic" aria-hidden /></summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA BAND */}
        {content.cta && (
          <section className={`kl-cta${content.cta.image ? '' : ' kl-cta-noimg'}`}>
            <div className="kl-cta-bg" style={content.cta.image ? { backgroundImage: `url(${content.cta.image})` } : undefined} />
            <div className="kl-cta-tint" />
            <div className="kl-cta-scrim" />
            <div className="kl-grain" />
            <div className="kl-cta-in lx-reveal">
              <h2>{content.cta.title}</h2>
              {content.cta.subtitle && <p className="kl-cta-sub">{content.cta.subtitle}</p>}
              <div className="kl-cta-actions">
                <a className="kl-btn kl-btn-solid kl-mag" href={ctaHref} {...(ctaHref.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {content.cta.ctaText ?? 'Pesan Sekarang'}
                </a>
                {items.length > 0 && <a className="kl-btn kl-btn-ghost" href="#menu">Lihat Menu</a>}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="kl-footer" id="kontak">
        <div className="kl-wrap">
          <div className="kl-footer-grid">
            <div>
              <span className="kl-brand"><span className="kl-brand-mk" aria-hidden>{initials(content.nama)}</span>{content.nama}</span>
              <p className="kl-footer-tag">{content.hero.subtitle ?? 'Dimasak dengan cinta, disajikan dengan bangga.'}</p>
            </div>
            <div>
              <div className="kl-f-label">Kunjungi</div>
              <div className="kl-f-rows">
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
                  <div className="kl-f-label">Jam Buka</div>
                  <div className="kl-f-jam">
                    {content.info.jam.map((j, i) => (
                      <span key={i} style={{ display: 'contents' }}><span>{j.hari}</span><span>{j.jam}</span></span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="kl-footer-cr">
            <span>© {new Date().getUTCFullYear()} {content.nama}. Seluruh hak cipta.</span>
            <span>Dibuat dengan Japan Arena</span>
          </div>
        </div>
      </footer>

      {waLink && (
        <a className="kl-wa" href={waLink} target="_blank" rel="noopener noreferrer" aria-label="Pesan via WhatsApp">{WA_ICON}</a>
      )}

      {/* LIGHTBOX (bersama) */}
      {hasQuickLook && <BespokeLightbox ctaText="Pesan via WhatsApp" />}
    </div>
  )
}
