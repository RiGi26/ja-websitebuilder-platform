// ============================================================
// RESTAURANT-LUX — renderer bespoke premium (Opsi A, tier premium).
// Port dari theme-samples/finedining-bespoke.html. Mengonsumsi ComposableContent
// yang SAMA dengan jalur composable (di-rakit composableContentFromSections),
// jadi nol plumbing data baru — ini cuma VIEW alternatif yang jauh lebih kaya.
//
// Variasi klien (keputusan user): palet kurasi TETAP + AKSEN ikut warna brand
// (primary menimpa emas default). 3 preset palet (aurum/noir/hearth).
// Coexist dengan composable (di-route oleh theme==='restaurant-lux' di SiteRenderer)
// → nol regresi.
//
// Font via @import di CSS string (browser preview + produksi + test aman, tanpa
// ketergantungan next/font di lingkungan test).
// ============================================================
import type { CSSProperties } from 'react'
import type { ComposableContent, ShowcaseItem, TeamMember } from '@/lib/theme-system/manifest'

// ── Palet peran semantik (warm-dark luxury) ──────────────────
interface Pal {
  bg: string; bg2: string; surface: string; ink: string; inkDim: string
  muted: string; accent: string; line: string; line2: string
}
const PALETTES: Record<string, Pal> = {
  // Aurum — near-black hangat + emas (default, = mockup)
  aurum: {
    bg: '#100C0A', bg2: '#15100D', surface: '#1C1714', ink: '#F3ECE1', inkDim: '#D9CDBC',
    muted: '#A1937F', accent: '#C9A24B', line: 'rgba(243,236,225,.10)', line2: 'rgba(243,236,225,.06)',
  },
  // Noir — lebih dingin/gelap, aksen sampanye
  noir: {
    bg: '#0D0D0F', bg2: '#131316', surface: '#1A1A1E', ink: '#F0EFEC', inkDim: '#CFCEC9',
    muted: '#928F89', accent: '#C7B07E', line: 'rgba(240,239,236,.10)', line2: 'rgba(240,239,236,.06)',
  },
  // Hearth — coklat hangat (rumahan-mewah), aksen tembaga
  hearth: {
    bg: '#140F0B', bg2: '#1A130D', surface: '#221913', ink: '#F4EADD', inkDim: '#DDCBB8',
    muted: '#A48D77', accent: '#CB8A4E', line: 'rgba(244,234,221,.10)', line2: 'rgba(244,234,221,.06)',
  },
}
function getPal(variant?: string): Pal {
  return PALETTES[variant ?? 'aurum'] ?? PALETTES.aurum
}

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap');"
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
const SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

function rupiah(n?: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return ''
  return 'Rp' + n.toLocaleString('id-ID')
}
function menuSlug(s: string): string {
  return 'menu-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
function navWord(s?: string): string | undefined {
  const w = s?.trim().split(/\s+/)[0]
  return w || undefined
}
function initials(nama: string): string {
  const p = nama.trim().split(/\s+/).filter(Boolean)
  const ini = (p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')
  return ini.toUpperCase() || 'A'
}
function groupByKategori(items: ShowcaseItem[]): { kategori?: string; items: ShowcaseItem[] }[] {
  if (!items.some((it) => it.kategori)) return [{ items }]
  const order: string[] = []
  const map = new Map<string, ShowcaseItem[]>()
  for (const it of items) {
    const key = it.kategori || 'Lainnya'
    if (!map.has(key)) { map.set(key, []); order.push(key) }
    map.get(key)!.push(it)
  }
  return order.map((k) => ({ kategori: k, items: map.get(k)! }))
}

const EASE = 'cubic-bezier(.16,1,.3,1)'
function rlCss(): string {
  return `${FONT_IMPORT}
.rl-root{background:var(--rl-bg);color:var(--rl-ink);font-family:${SANS};line-height:1.65;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.rl-root h1,.rl-root h2,.rl-root h3{font-family:${SERIF};font-weight:600;letter-spacing:-.01em;line-height:1.05;margin:0}
.rl-root p{margin:0;text-wrap:pretty}
.rl-root a{color:inherit;text-decoration:none}
.rl-root img{display:block;max-width:100%}
.rl-wrap{max-width:1200px;margin:0 auto;padding:0 32px}
.rl-eyebrow{font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--rl-accent);display:inline-flex;align-items:center;gap:13px}
.rl-eyebrow::before{content:"";width:32px;height:1px;background:var(--rl-accent);opacity:.65}
.rl-btn{display:inline-flex;align-items:center;gap:9px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:15px 30px;border-radius:2px;transition:transform .35s ${EASE},background-color .35s ease,color .35s ease}
.rl-btn-gold{background:var(--rl-accent);color:#16120A}
.rl-btn-gold:hover{transform:translateY(-2px);filter:brightness(1.08)}
.rl-btn-ghost{border:1px solid rgba(255,255,255,.35);color:#fff}
.rl-btn-ghost:hover{border-color:var(--rl-accent);color:var(--rl-accent);transform:translateY(-2px)}
.rl-price{font-variant-numeric:tabular-nums}
.rl-pad{padding:clamp(80px,11vw,140px) 0}
.rl-sec-head{margin-bottom:54px;max-width:60ch}
.rl-sec-head h2{font-size:clamp(32px,4.6vw,52px)}
.rl-sec-head .rl-eyebrow{margin-bottom:16px}
.rl-sec-head p{color:var(--rl-muted);margin-top:14px;font-size:16px}
/* nav */
.rl-nav{position:sticky;top:0;z-index:100;backdrop-filter:saturate(1.3) blur(14px);background:linear-gradient(to bottom,color-mix(in srgb,var(--rl-bg) 72%,transparent),color-mix(in srgb,var(--rl-bg) 34%,transparent));border-bottom:1px solid var(--rl-line2)}
.rl-nav-in{display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1200px;margin:0 auto;padding:18px 32px}
.rl-brand{font-family:${SERIF};font-size:25px;font-weight:600;letter-spacing:.02em}
.rl-brand small{display:block;font-family:${SANS};font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:var(--rl-muted);margin-top:-2px}
.rl-nav-links{display:flex;gap:32px}
.rl-nav-link{font-size:13px;font-weight:500;color:var(--rl-inkDim);position:relative;padding:4px 0;transition:color .25s ease}
.rl-nav-link::after{content:"";position:absolute;left:0;bottom:0;width:0;height:1px;background:var(--rl-accent);transition:width .3s ease}
.rl-nav-link:hover{color:var(--rl-accent)}.rl-nav-link:hover::after{width:100%}
.rl-nav-cta{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;border:1px solid var(--rl-accent);color:var(--rl-accent);padding:10px 22px;border-radius:2px;transition:background-color .3s,color .3s}
.rl-nav-cta:hover{background:var(--rl-accent);color:#16120A}
@media(max-width:880px){.rl-nav-links{display:none}}
/* hero */
.rl-hero{position:relative;min-height:100vh;display:flex;align-items:flex-end;overflow:hidden;color:#fff}
.rl-hero-bg{position:absolute;inset:0;background:#0a0706 center/cover no-repeat;transform:scale(1.04);animation:rlKb 18s ease-out forwards}
@keyframes rlKb{to{transform:scale(1)}}
.rl-hero-grad{position:absolute;inset:0;background:linear-gradient(to top,color-mix(in srgb,var(--rl-bg) 94%,transparent) 0%,color-mix(in srgb,var(--rl-bg) 50%,transparent) 38%,transparent 70%,color-mix(in srgb,var(--rl-bg) 45%,transparent) 100%)}
.rl-hero-in{position:relative;z-index:2;max-width:1200px;margin:0 auto;padding:0 32px 92px;width:100%}
.rl-hero h1{font-size:clamp(52px,9vw,118px);font-weight:500;letter-spacing:-.02em;margin:22px 0 0;max-width:15ch;color:#fff}
.rl-hero-sub{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:34px;margin-top:34px}
.rl-hero-sub p{max-width:46ch;font-size:17px;color:rgba(255,255,255,.9);line-height:1.7}
.rl-hero-actions{display:flex;gap:14px;flex-wrap:wrap}
.rl-cue{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);z-index:2;color:#fff;opacity:.6;animation:rlCue 2.2s ease-in-out infinite}
@keyframes rlCue{0%,100%{transform:translate(-50%,0);opacity:.45}50%{transform:translate(-50%,8px);opacity:.85}}
/* statement */
.rl-statement{background:var(--rl-bg2);border-top:1px solid var(--rl-line2);border-bottom:1px solid var(--rl-line2)}
.rl-statement .rl-wrap{display:grid;grid-template-columns:1fr 2.1fr;gap:48px;align-items:start}
.rl-quote{font-family:${SERIF};font-style:italic;font-weight:500;font-size:clamp(26px,3.4vw,42px);line-height:1.22;position:relative}
.rl-quote::before{content:"\\201C";position:absolute;left:-.4em;top:-.35em;font-size:2.6em;color:var(--rl-accent);opacity:.16;font-style:normal}
.rl-cite{display:block;margin-top:26px;font-family:${SANS};font-style:normal;font-size:13px;letter-spacing:.06em;color:var(--rl-muted)}
@media(max-width:780px){.rl-statement .rl-wrap{grid-template-columns:1fr;gap:24px}}
/* signature dishes */
.rl-dish{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,5vw,72px);align-items:center;margin-bottom:clamp(56px,8vw,110px)}
.rl-dish:last-child{margin-bottom:0}
.rl-dish:nth-child(even) .rl-dish-media{order:2}
.rl-dish-media{position:relative;overflow:hidden;border-radius:3px;aspect-ratio:4/5;background:linear-gradient(135deg,var(--rl-surface),var(--rl-bg2))}
.rl-dish-media img{width:100%;height:100%;object-fit:cover;transition:transform .9s ${EASE}}
.rl-dish:hover .rl-dish-media img{transform:scale(1.06)}
.rl-dish-idx{font-family:${SERIF};font-size:clamp(46px,6vw,80px);color:var(--rl-accent);opacity:.4;line-height:1;font-variant-numeric:tabular-nums}
.rl-dish h3{font-size:clamp(28px,3.4vw,42px);margin:12px 0 14px}
.rl-dish .rl-lead{color:var(--rl-inkDim);font-size:16px;line-height:1.75;max-width:42ch}
.rl-dish .rl-meta{margin-top:22px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.rl-dish .rl-dprice{font-family:${SERIF};font-size:26px;color:color-mix(in srgb,var(--rl-accent) 72%,#fff)}
.rl-tag{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--rl-muted);border:1px solid var(--rl-line);padding:5px 12px;border-radius:999px}
@media(max-width:780px){.rl-dish{grid-template-columns:1fr;gap:24px}.rl-dish:nth-child(even) .rl-dish-media{order:0}}
/* menu */
.rl-menu{background:var(--rl-bg2)}
.rl-menu-tabs{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:46px}
.rl-menu-tab{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--rl-muted);border:1px solid var(--rl-line);padding:9px 18px;border-radius:999px;transition:all .25s ease}
.rl-menu-tab:hover{color:#16120A;background:var(--rl-accent);border-color:var(--rl-accent)}
.rl-menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px 72px}
.rl-menu-cat>h3{font-size:24px;color:color-mix(in srgb,var(--rl-accent) 72%,#fff);margin-bottom:22px;padding-bottom:12px;border-bottom:1px solid var(--rl-line)}
.rl-menu-row{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:baseline;padding:13px 0;border-bottom:1px solid var(--rl-line2)}
.rl-menu-row:last-child{border-bottom:none}
.rl-menu-row .rl-nm{font-family:${SERIF};font-size:20px;color:var(--rl-ink)}
.rl-menu-row .rl-ds{font-size:13px;color:var(--rl-muted);margin-top:2px;line-height:1.5}
.rl-menu-row .rl-pr{font-family:${SERIF};font-size:19px;color:color-mix(in srgb,var(--rl-accent) 72%,#fff);white-space:nowrap}
.rl-root [id^="menu-"]{scroll-margin-top:96px}
@media(max-width:780px){.rl-menu-grid{grid-template-columns:1fr;gap:44px}}
/* about/story */
.rl-story .rl-wrap{display:grid;grid-template-columns:1fr 1.4fr;gap:clamp(28px,5vw,64px);align-items:start}
.rl-story h2{font-size:clamp(30px,4vw,46px)}
.rl-story .rl-body{color:var(--rl-inkDim);font-size:16px;line-height:1.85;white-space:pre-wrap;max-width:56ch}
@media(max-width:780px){.rl-story .rl-wrap{grid-template-columns:1fr;gap:18px}}
/* people */
.rl-people .rl-chef{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(32px,5vw,72px);align-items:center;margin-bottom:60px}
.rl-chef-media{position:relative;aspect-ratio:3/4;overflow:hidden;border-radius:3px;background:radial-gradient(circle at 30% 25%,var(--rl-surface),var(--rl-bg2));display:flex;align-items:center;justify-content:center}
.rl-chef-media img{width:100%;height:100%;object-fit:cover}
.rl-chef-ini{font-family:${SERIF};font-size:clamp(64px,9vw,120px);color:var(--rl-accent);opacity:.5}
.rl-chef-badge{position:absolute;left:18px;bottom:18px;background:color-mix(in srgb,var(--rl-bg) 72%,transparent);backdrop-filter:blur(6px);border:1px solid var(--rl-line);padding:10px 16px;border-radius:2px}
.rl-chef-badge b{font-family:${SERIF};font-size:18px;display:block}
.rl-chef-badge span{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--rl-accent)}
.rl-chef h3{font-size:clamp(28px,3.4vw,44px);margin:14px 0 18px}
.rl-chef p{color:var(--rl-inkDim);font-size:16px;line-height:1.8;max-width:50ch}
.rl-chef .rl-sign{margin-top:22px;font-family:${SERIF};font-style:italic;font-size:24px;color:color-mix(in srgb,var(--rl-accent) 72%,#fff)}
.rl-team-row{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.rl-tm{text-align:center}
.rl-tm-av{width:78px;height:78px;border-radius:999px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-family:${SERIF};font-size:26px;color:color-mix(in srgb,var(--rl-accent) 72%,#fff);background:radial-gradient(circle at 30% 30%,var(--rl-surface),var(--rl-bg));border:1px solid var(--rl-line);overflow:hidden}
.rl-tm-av img{width:100%;height:100%;object-fit:cover}
.rl-tm b{font-family:${SERIF};font-size:19px;font-weight:600;display:block}
.rl-tm span{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--rl-muted)}
@media(max-width:780px){.rl-people .rl-chef{grid-template-columns:1fr;gap:24px}.rl-team-row{grid-template-columns:repeat(2,1fr);gap:32px}}
/* gallery */
.rl-gal{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:200px;gap:14px}
.rl-gal figure{position:relative;overflow:hidden;border-radius:3px;margin:0}
.rl-gal img{width:100%;height:100%;object-fit:cover;transition:transform .8s ${EASE}}
.rl-gal figure:hover img{transform:scale(1.07)}
.rl-gal figcaption{position:absolute;left:14px;bottom:12px;font-size:12px;letter-spacing:.08em;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.6);opacity:0;transition:opacity .3s ease}
.rl-gal figure:hover figcaption{opacity:1}
.rl-g-tall{grid-row:span 2}.rl-g-wide{grid-column:span 2}
@media(max-width:780px){.rl-gal{grid-template-columns:repeat(2,1fr);grid-auto-rows:150px}}
/* testimonial */
.rl-testi{text-align:center}.rl-testi .rl-wrap{max-width:860px}
.rl-testi blockquote{font-family:${SERIF};font-style:italic;font-size:clamp(24px,3.2vw,40px);line-height:1.3;margin:18px 0 0}
.rl-testi cite{display:block;margin-top:22px;font-style:normal;font-size:13px;letter-spacing:.06em;color:var(--rl-muted)}
/* recognition */
.rl-recog{background:var(--rl-bg2);border-top:1px solid var(--rl-line2);border-bottom:1px solid var(--rl-line2)}
.rl-recog .rl-wrap{display:grid;grid-template-columns:repeat(4,1fr)}
.rl-stat{padding:14px 26px;border-left:1px solid var(--rl-line)}
.rl-stat:first-child{border-left:none;padding-left:0}
.rl-stat b{font-family:${SERIF};font-size:clamp(38px,4.6vw,58px);color:color-mix(in srgb,var(--rl-accent) 72%,#fff);display:block;line-height:1;font-variant-numeric:tabular-nums}
.rl-stat span{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--rl-muted);margin-top:10px;display:block}
@media(max-width:780px){.rl-recog .rl-wrap{grid-template-columns:1fr 1fr;gap:32px 0}.rl-stat:nth-child(odd){border-left:none;padding-left:0}}
/* faq */
.rl-faq-list{max-width:760px}
.rl-faq details{border-bottom:1px solid var(--rl-line2)}
.rl-faq summary{cursor:pointer;list-style:none;padding:22px 0;font-family:${SERIF};font-size:21px;display:flex;justify-content:space-between;gap:16px;align-items:center}
.rl-faq summary::-webkit-details-marker{display:none}
.rl-faq summary::after{content:"+";color:var(--rl-accent);font-size:24px;transition:transform .3s ease}
.rl-faq details[open] summary::after{transform:rotate(45deg)}
.rl-faq p{color:var(--rl-muted);font-size:15px;line-height:1.7;padding:0 0 22px;max-width:60ch}
/* visit */
.rl-visit .rl-wrap{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,5vw,72px);align-items:center}
.rl-visit h2{font-size:clamp(34px,4.6vw,56px)}
.rl-visit .rl-rows{margin-top:28px;display:grid;gap:18px}
.rl-visit .rl-r{display:grid;grid-template-columns:130px 1fr;gap:18px;padding-bottom:16px;border-bottom:1px solid var(--rl-line2)}
.rl-visit .rl-k{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--rl-accent)}
.rl-visit .rl-v{color:var(--rl-inkDim);font-size:15px;line-height:1.6}
.rl-visit .rl-cta{margin-top:34px;display:flex;gap:14px;flex-wrap:wrap}
.rl-map{aspect-ratio:1/1;border-radius:3px;overflow:hidden;border:1px solid var(--rl-line);background:linear-gradient(135deg,var(--rl-surface),var(--rl-bg2))}
.rl-map iframe{width:100%;height:100%;border:0;filter:grayscale(1) invert(.9) contrast(.85)}
@media(max-width:780px){.rl-visit .rl-wrap{grid-template-columns:1fr}.rl-map{aspect-ratio:16/10}}
/* footer + wa */
.rl-footer{background:color-mix(in srgb,var(--rl-bg) 80%,#000);border-top:1px solid var(--rl-line2);padding:56px 0 40px}
.rl-footer .rl-wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:24px;align-items:center}
.rl-footer .rl-brand{font-size:22px}
.rl-soc{display:flex;gap:22px;font-size:13px;color:var(--rl-muted)}
.rl-soc a:hover{color:var(--rl-accent)}
.rl-cr{width:100%;border-top:1px solid var(--rl-line2);margin-top:32px;padding-top:24px;font-size:12px;color:var(--rl-muted)}
.rl-wa{position:fixed;right:22px;bottom:22px;z-index:200;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 26px rgba(37,211,102,.4);transition:transform .25s ${EASE}}
.rl-wa:hover{transform:scale(1.08)}
.rl-root :focus-visible{outline:2px solid var(--rl-accent);outline-offset:3px}
@media(prefers-reduced-motion:reduce){.rl-root *,.rl-root *::before,.rl-root *::after{animation:none!important;transition:none!important}.rl-hero-bg{transform:none}}
`
}

const CHEV = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
)
const WA_ICON = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
)

export default function RestaurantLuxRenderer({
  content, variant, primary, slug,
}: { content: ComposableContent; variant?: string; primary?: string; slug?: string }) {
  const pal = getPal(variant)
  const accent = (primary && primary.trim()) || pal.accent
  const rootStyle = {
    '--rl-bg': pal.bg, '--rl-bg2': pal.bg2, '--rl-surface': pal.surface, '--rl-ink': pal.ink,
    '--rl-inkDim': pal.inkDim, '--rl-muted': pal.muted, '--rl-accent': accent,
    '--rl-line': pal.line, '--rl-line2': pal.line2,
    background: pal.bg, color: pal.ink,
  } as CSSProperties

  const items = content.showcase?.items ?? []
  const featured = items.filter((it) => it.gambar).slice(0, 3)
  const groups = groupByKategori(items)
  const showTabs = groups.filter((g) => g.kategori).length > 1
  const wa = content.contact?.wa
  const waLink = wa ? `https://wa.me/${wa.replace(/[^\d]/g, '')}` : undefined
  const resHref = content.info?.reservasiHref || waLink || '#kunjungi'
  const resText = content.info?.reservasiText || 'Reservasi'
  const gallery = content.gallery?.images ?? []
  const [chef, ...restTeam] = content.team ?? []
  const testi = content.testimonials?.[0]

  // Nav links sadar-konten
  const nav: { label: string; href: string }[] = []
  if (items.length) nav.push({ label: navWord(content.showcase?.title) ?? 'Menu', href: '#menu' })
  if (content.statement) nav.push({ label: 'Filosofi', href: '#filosofi' })
  if (content.about) nav.push({ label: 'Cerita', href: '#cerita' })
  if (content.team?.length) nav.push({ label: navWord(content.teamTitle) ?? 'Tim', href: '#tim' })
  if (gallery.length) nav.push({ label: 'Galeri', href: '#galeri' })
  if (content.info) nav.push({ label: 'Kunjungi', href: '#kunjungi' })

  const heroBg: CSSProperties = content.hero.image
    ? { backgroundImage: `url(${content.hero.image})` }
    : { background: `linear-gradient(135deg, ${pal.surface}, ${pal.bg})` }

  return (
    <div className="rl-root" style={rootStyle} data-variant={variant ?? 'aurum'}>
      <style dangerouslySetInnerHTML={{ __html: rlCss() }} />

      {/* NAV */}
      <header className="rl-nav">
        <div className="rl-nav-in">
          <span className="rl-brand">{content.nama}<small>Fine Dining</small></span>
          {nav.length > 0 && (
            <nav className="rl-nav-links" aria-label="Navigasi utama">
              {nav.map((l) => <a key={l.href} className="rl-nav-link" href={l.href}>{l.label}</a>)}
            </nav>
          )}
          <a className="rl-nav-cta" href={resHref}>{resText}</a>
        </div>
      </header>

      {/* HERO */}
      <section className="rl-hero">
        <div className="rl-hero-bg" style={heroBg} />
        <div className="rl-hero-grad" />
        <div className="rl-hero-in">
          {content.hero.eyebrow && <span className="rl-eyebrow">{content.hero.eyebrow}</span>}
          <h1>{content.hero.title}</h1>
          <div className="rl-hero-sub">
            {content.hero.subtitle && <p>{content.hero.subtitle}</p>}
            <div className="rl-hero-actions">
              {content.hero.ctaText && <a className="rl-btn rl-btn-gold" href={content.hero.ctaHref ?? resHref}>{content.hero.ctaText}</a>}
              <a className="rl-btn rl-btn-ghost" href={content.hero.ctaHref2 ?? '#menu'}>{content.hero.ctaText2 ?? 'Lihat Menu'}</a>
            </div>
          </div>
        </div>
        <span className="rl-cue" aria-hidden>{CHEV}</span>
      </section>

      {/* STATEMENT */}
      {content.statement && (
        <section className="rl-statement rl-pad" id="filosofi">
          <div className="rl-wrap">
            <span className="rl-eyebrow">{content.statement.eyebrow ?? 'Filosofi'}</span>
            <div>
              <p className="rl-quote">{content.statement.quote}</p>
              {content.statement.cite && <span className="rl-cite">{content.statement.cite}</span>}
            </div>
          </div>
        </section>
      )}

      {/* SIGNATURE dishes */}
      {featured.length > 0 && (
        <section className="rl-pad" id="signature">
          <div className="rl-wrap">
            <div className="rl-sec-head">
              <span className="rl-eyebrow">Yang Kami Banggakan</span>
              <h2>Hidangan yang menentukan kami</h2>
            </div>
            {featured.map((it, i) => (
              <article className="rl-dish" key={i}>
                <div className="rl-dish-media">{it.gambar && <img src={it.gambar} alt={it.nama} loading="lazy" />}</div>
                <div>
                  <span className="rl-dish-idx">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{it.nama}</h3>
                  {it.desc && <p className="rl-lead">{it.desc}</p>}
                  <div className="rl-meta">
                    {it.harga != null && <span className="rl-dprice rl-price">{rupiah(it.harga)}</span>}
                    {it.kategori && <span className="rl-tag">{it.kategori}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* MENU */}
      {items.length > 0 && (
        <section className="rl-menu rl-pad" id="menu">
          <div className="rl-wrap">
            <div className="rl-sec-head">
              <span className="rl-eyebrow">Menu</span>
              <h2>{content.showcase?.title ?? 'Daftar Pilihan'}</h2>
              {content.showcase?.subtitle && <p>{content.showcase.subtitle}</p>}
            </div>
            {showTabs && (
              <div className="rl-menu-tabs">
                {groups.map((g, i) => g.kategori ? <a key={i} className="rl-menu-tab" href={`#${menuSlug(g.kategori)}`}>{g.kategori}</a> : null)}
              </div>
            )}
            <div className="rl-menu-grid">
              {groups.map((g, gi) => (
                <div className="rl-menu-cat" key={gi} id={g.kategori ? menuSlug(g.kategori) : undefined}>
                  {g.kategori && <h3>{g.kategori}</h3>}
                  {g.items.map((it, i) => (
                    <div className="rl-menu-row" key={i}>
                      <div>
                        <div className="rl-nm">{it.nama}</div>
                        {it.desc && <div className="rl-ds">{it.desc}</div>}
                      </div>
                      {it.harga != null && <div className="rl-pr rl-price">{rupiah(it.harga)}</div>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STORY / about */}
      {content.about && (
        <section className="rl-story rl-pad" id="cerita">
          <div className="rl-wrap">
            <div>
              <span className="rl-eyebrow">Cerita Kami</span>
              <h2 style={{ marginTop: 16 }}>{content.about.title}</h2>
            </div>
            <p className="rl-body">{content.about.body}</p>
          </div>
        </section>
      )}

      {/* PEOPLE */}
      {content.team && content.team.length > 0 && chef && (
        <section className="rl-people rl-pad" id="tim">
          <div className="rl-wrap">
            <div className="rl-sec-head">
              <span className="rl-eyebrow">{content.teamEyebrow ?? 'Tim Kami'}</span>
              <h2>{content.teamTitle ?? 'Di Balik Dapur'}</h2>
            </div>
            <div className="rl-chef">
              <div className="rl-chef-media">
                {chef.foto ? <img src={chef.foto} alt={chef.nama} loading="lazy" /> : <span className="rl-chef-ini" aria-hidden>{initials(chef.nama)}</span>}
                <div className="rl-chef-badge"><b>{chef.nama}</b><span>{chef.peran}</span></div>
              </div>
              <div>
                <h3>{chef.peran}</h3>
                {chef.bio && <p>{chef.bio}</p>}
                <div className="rl-sign">— {chef.nama.split(' ').slice(-1)[0]}</div>
              </div>
            </div>
            {restTeam.length > 0 && (
              <div className="rl-team-row">
                {restTeam.map((m: TeamMember, i) => (
                  <div className="rl-tm" key={i}>
                    <div className="rl-tm-av">{m.foto ? <img src={m.foto} alt={m.nama} loading="lazy" /> : <span aria-hidden>{initials(m.nama)}</span>}</div>
                    <b>{m.nama}</b><span>{m.peran}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="rl-pad" id="galeri">
          <div className="rl-wrap">
            <div className="rl-sec-head">
              <span className="rl-eyebrow">{content.gallery?.title ?? 'Suasana & Sajian'}</span>
              <h2>{content.gallery?.subtitle ?? 'Ruang untuk perayaan'}</h2>
            </div>
            <div className="rl-gal">
              {gallery.slice(0, 6).map((g, i) => (
                <figure key={i} className={i === 0 ? 'rl-g-tall' : (i === 1 || i === 4) ? 'rl-g-wide' : undefined}>
                  <img src={g.src} alt={g.caption ?? 'Galeri'} loading="lazy" />
                  {g.caption && <figcaption>{g.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {testi && (
        <section className="rl-testi rl-pad" style={{ background: pal.bg2 }}>
          <div className="rl-wrap">
            <span className="rl-eyebrow" style={{ justifyContent: 'center' }}>Kata Tamu</span>
            <blockquote>“{testi.quote}”</blockquote>
            <cite>— {testi.nama}{testi.peran ? ` · ${testi.peran}` : ''}</cite>
          </div>
        </section>
      )}

      {/* RECOGNITION */}
      {content.stats && content.stats.length > 0 && (
        <section className="rl-recog" style={{ paddingTop: 'clamp(56px,7vw,90px)', paddingBottom: 'clamp(56px,7vw,90px)' }}>
          <div className="rl-wrap">
            {content.stats.slice(0, 4).map((s, i) => (
              <div className="rl-stat" key={i}><b>{s.angka}</b><span>{s.label}</span></div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {content.faq && content.faq.length > 0 && (
        <section className="rl-faq rl-pad">
          <div className="rl-wrap">
            <div className="rl-sec-head"><span className="rl-eyebrow">Pertanyaan</span><h2>Sebelum Anda datang</h2></div>
            <div className="rl-faq-list">
              {content.faq.map((f, i) => (
                <details key={i}><summary>{f.q}</summary><p>{f.a}</p></details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VISIT */}
      {content.info && (
        <section className="rl-visit rl-pad" id="kunjungi">
          <div className="rl-wrap">
            <div>
              <span className="rl-eyebrow">Kunjungi Kami</span>
              <h2 style={{ marginTop: 16 }}>Amankan malam Anda</h2>
              <div className="rl-rows">
                {content.info.jam && content.info.jam.length > 0 && (
                  <div className="rl-r"><div className="rl-k">Jam Buka</div><div className="rl-v">{content.info.jam.map((j, i) => <div key={i}>{j.hari} · {j.jam}</div>)}</div></div>
                )}
                {content.info.alamat && <div className="rl-r"><div className="rl-k">Alamat</div><div className="rl-v">{content.info.alamat}</div></div>}
                {content.info.telp && <div className="rl-r"><div className="rl-k">Reservasi</div><div className="rl-v">{content.info.telp}</div></div>}
              </div>
              <div className="rl-cta">
                <a className="rl-btn rl-btn-gold" href={resHref}>{resText}</a>
              </div>
            </div>
            <div className="rl-map">
              {content.info.mapsQuery && (
                <iframe loading="lazy" title="Peta lokasi" src={`https://www.google.com/maps?q=${encodeURIComponent(content.info.mapsQuery)}&output=embed`} />
              )}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="rl-footer">
        <div className="rl-wrap">
          <span className="rl-brand">{content.nama}</span>
          <div className="rl-soc">
            {waLink && <a href={waLink}>WhatsApp</a>}
            {content.contact?.email && <a href={`mailto:${content.contact.email}`}>Email</a>}
            {content.contact?.alamat && <span>{content.contact.alamat}</span>}
          </div>
          <div className="rl-cr">© {new Date().getUTCFullYear()} {content.nama}. Dibuat dengan Japan Arena.</div>
        </div>
      </footer>

      {waLink && <a className="rl-wa" href={waLink} target="_blank" rel="noopener noreferrer" aria-label="Pesan via WhatsApp">{WA_ICON}</a>}
    </div>
  )
}
