// ============================================================
// Tema "rental" varian ASPHALT — "Asphalt Editorial" (dibangun utk SetirYuk).
// Porting 1:1 dari mockup approved theme-samples/setiryuk-mock.html:
// dark asphalt + paper berselang, Barlow Condensed/Barlow, marka jalan sebagai
// motif, aksen turunan branding.primary (default oranye sinyal). Armada + wizard
// booking realtime dari Portal Rental via AsphaltFleetSection (client).
// Varian lain tema rental tetap RentalRenderer lama (nol regresi).
// ============================================================
import type { CSSProperties, ReactNode } from 'react'
import type { Service, TenantProfile, DataKontenRental } from '@/types/websitebuilder'
import {
  FONT_IMPORT, FONT_DISPLAY, FONT_BODY, PALETTE, SHADOW, EASE,
  deriveAccent, accentVars, waLink,
} from './tokens'
import AsphaltFleetSection, { type FallbackCar } from './AsphaltFleetSection'

// ── Ikon inline (Lucide-style, stroke currentColor) ───────────
const IC = {
  wheel: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.6" /><path d="M12 14.6V21M9.8 10.9 3.4 9.2M14.2 10.9l6.4-1.7" /></>,
  shield: <><path d="M20 13c0 5-3.5 7.5-7.7 9a.6.6 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" /></>,
  shieldCheck: <><path d="M20 13c0 5-3.5 7.5-7.7 9a.6.6 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  cal: <><rect x="3" y="4" width="18" height="17" rx="3" /><path d="M8 2v4M16 2v4M3 9h18M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01" /></>,
  pin: <><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z" /><circle cx="12" cy="9" r="2.5" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h4" /></>,
  key: <><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.7 12.3 9.8-9.8M15 4l3 3M12.5 6.5l3 3" /></>,
  check: <path d="m5 13 4 4L19 7" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5h.01" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  road: <><path d="M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2" /><path d="M8 12h8" /></>,
}
function Icon({ d, size = 24, sw = 2 }: { d: ReactNode; size?: number; sw?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden="true">{d}</svg>
}

// ── Konten default (copy approved dari mockup; data_konten menimpa) ──
const DEFAULT_SUB = 'Pilih mobil, pilih tanggal, bayar online — jadwal kepastiannya kelihatan di depan, bukan setelah DM berbalas-balas.'
const DEFAULT_WHY = [
  { icon: IC.card, t: 'Harga transparan', p: 'Tarif per hari tercantum di depan. Total dihitung otomatis — tanpa biaya kejutan saat serah terima.' },
  { icon: IC.shieldCheck, t: 'Bayar online aman', p: 'Pembayaran diproses Midtrans — transfer bank, e-wallet, atau kartu. Booking terkonfirmasi otomatis.' },
  { icon: IC.cal, t: 'Jadwal real-time', p: 'Tanggal yang sudah tersewa langsung terkunci di kalender. Tidak ada booking dobel.' },
  { icon: IC.pin, t: 'Serah terima fleksibel', p: 'Ambil di garasi kami atau atur pengantaran lewat WhatsApp setelah booking terkonfirmasi.' },
]
const WHY_ICONS = [IC.card, IC.shieldCheck, IC.cal, IC.pin]
const DEFAULT_STEPS = [
  { t: 'Pilih mobil & tanggal', p: 'Cek armada, lihat kalender ketersediaan, tentukan tanggal ambil dan kembali.' },
  { t: 'Isi data & bayar', p: 'Nama dan nomor WhatsApp saja. Bayar penuh lewat Midtrans dengan metode favoritmu.' },
  { t: 'Terima kode booking', p: 'Konfirmasi otomatis setelah pembayaran — kode booking tampil di halaman status.' },
  { t: 'Ambil & jalan', p: 'Tunjukkan kode booking + KTP & SIM saat serah terima. Selesai!' },
]
const DEFAULT_SYARAT = [
  'KTP asli + SIM A aktif (ditunjukkan saat serah terima)',
  'Usia minimal 21 tahun',
  'Deposit jaminan disepakati saat serah terima',
  'BBM kembali di level yang sama',
]
const DRIVER_SYARAT = [
  'Tanpa syarat SIM — duduk manis saja',
  'Rute dan jam pakai disepakati di awal',
  'Makan & penginapan sopir (trip luar kota) ditanggung penyewa',
]

// ── Global CSS (porting mockup, prefix ra-) ───────────────────
const GLOBAL_CSS = `
@import url('${FONT_IMPORT}');
.ra-root{font-family:${FONT_BODY};font-size:16px;line-height:1.65;color:${PALETTE.ink};background:${PALETTE.asphalt};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;
  --ra-display:${FONT_DISPLAY};--ra-asphalt:${PALETTE.asphalt};--ra-paper:${PALETTE.paper};--ra-ink:${PALETTE.ink};--ra-ink-soft:${PALETTE.inkSoft};--ra-on-dark-muted:${PALETTE.onDarkMuted};}
.ra-root h1,.ra-root h2,.ra-root h3,.ra-root h4{font-family:var(--ra-display);line-height:1.05;text-wrap:balance;letter-spacing:.005em;margin:0}
.ra-root p{text-wrap:pretty;margin:0}
.ra-root img,.ra-root svg{display:block;max-width:100%}
.ra-root a{color:inherit}
.ra-root :focus-visible{outline:3px solid var(--ra-accent);outline-offset:2px;border-radius:4px}
.ra-container{max-width:1140px;margin:0 auto;padding:0 24px}
.ra-eyebrow{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--ra-accent-ink);margin-bottom:14px}
.ra-dark .ra-eyebrow{color:var(--ra-accent)}
.ra-title{font-size:clamp(2rem,4.4vw,3.1rem);font-weight:700;text-transform:uppercase;letter-spacing:.01em}
.ra-sub{color:${PALETTE.inkSoft};max-width:56ch;margin-top:12px}
.ra-dark .ra-sub{color:${PALETTE.onDarkMuted}}
.ra-lane{height:4px;border:0;margin:28px 0 0;background:repeating-linear-gradient(90deg,var(--ra-accent) 0 34px,transparent 34px 58px);border-radius:2px;max-width:220px}
.ra-lane-c{margin-left:auto;margin-right:auto;background:repeating-linear-gradient(90deg,rgba(255,255,255,.85) 0 34px,transparent 34px 58px)}
.ra-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 28px;border-radius:14px;border:0;font-family:var(--ra-display);font-size:19px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;text-decoration:none;cursor:pointer;transition:transform .2s ${EASE},box-shadow .2s ${EASE},background .2s}
.ra-btn:hover{transform:translateY(-2px)}
.ra-btn:active{transform:scale(.97)}
.ra-btn-primary{background:var(--ra-accent);color:#16130F;box-shadow:0 8px 24px var(--ra-accent-glow)}
.ra-btn-primary:hover{background:var(--ra-accent-hover);box-shadow:0 12px 32px var(--ra-accent-glow)}
.ra-btn-ghost{background:transparent;color:${PALETTE.onDark};border:1.5px solid ${PALETTE.asphalt3}}
.ra-btn-ghost:hover{border-color:${PALETTE.onDarkMuted}}
.ra-chip{display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;font-size:13px;font-weight:600;background:rgba(255,255,255,.06);color:${PALETTE.onDarkMuted};border:1px solid ${PALETTE.asphalt3}}
.ra-chip svg{color:var(--ra-accent)}
/* nav */
.ra-nav{background:${PALETTE.asphalt};border-bottom:1px solid rgba(255,255,255,.05)}
.ra-nav .ra-container{display:flex;align-items:center;gap:28px;min-height:68px}
.ra-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:${PALETTE.onDark}}
.ra-brand svg{color:var(--ra-accent)}
.ra-brand-nm{font-family:var(--ra-display);font-size:24px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:${PALETTE.onDark}}
.ra-brand-nm em{font-style:italic;color:var(--ra-accent)}
.ra-nav-links{display:flex;gap:4px;margin-left:auto}
.ra-nav-links a{color:${PALETTE.onDarkMuted};text-decoration:none;font-size:14.5px;font-weight:600;padding:10px 14px;border-radius:10px;transition:color .2s,background .2s}
.ra-nav-links a:hover{color:${PALETTE.onDark};background:rgba(255,255,255,.05)}
.ra-nav-cta{min-height:42px;padding:0 20px;font-size:16px;border-radius:11px}
@media(max-width:760px){.ra-nav-links{display:none}}
/* hero */
.ra-hero{position:relative;overflow:hidden;color:${PALETTE.onDark};background:radial-gradient(ellipse 70% 55% at 85% 18%,var(--ra-accent-soft) 0%,transparent 55%),radial-gradient(ellipse 55% 45% at 8% 92%,rgba(255,255,255,.04) 0%,transparent 55%),linear-gradient(160deg,#1A1F27 0%,${PALETTE.asphalt} 55%,#101318 100%)}
.ra-hero .ra-container{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:40px;align-items:center;padding-top:clamp(56px,9vw,110px);padding-bottom:clamp(64px,10vw,120px)}
.ra-hero h1{font-size:clamp(2.9rem,7.2vw,5.2rem);font-weight:800;text-transform:uppercase;color:#fff}
.ra-hero h1 .go{font-style:italic;color:var(--ra-accent);display:inline-block}
.ra-hero-sub{color:${PALETTE.onDarkMuted};font-size:clamp(1rem,1.4vw,1.15rem);max-width:46ch;margin-top:20px}
.ra-hero-cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:32px}
.ra-hero-trust{display:flex;gap:10px;flex-wrap:wrap;margin-top:30px}
.ra-hero-vis{position:relative;min-height:260px}
.ra-hero-vis svg.ra-car{width:130%;max-width:none;position:absolute;right:-18%;top:50%;transform:translateY(-50%);color:#2A313C;filter:drop-shadow(0 24px 48px rgba(0,0,0,.45))}
.ra-beam{position:absolute;left:-6%;top:38%;width:65%;height:36%;pointer-events:none;background:radial-gradient(ellipse at right center,var(--ra-accent-beam),transparent 70%);transform:rotate(-6deg)}
.ra-road{position:absolute;left:0;right:0;bottom:34px;height:4px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.28) 0 44px,transparent 44px 76px)}
.ra-fade{opacity:0;transform:translateY(16px);animation:raUp .55s ${EASE} forwards}
.ra-fade:nth-child(2){animation-delay:90ms}.ra-fade:nth-child(3){animation-delay:180ms}.ra-fade:nth-child(4){animation-delay:270ms}.ra-fade:nth-child(5){animation-delay:360ms}
@keyframes raUp{to{opacity:1;transform:translateY(0)}}
@media(max-width:880px){.ra-hero .ra-container{grid-template-columns:1fr}.ra-hero-vis{min-height:200px;order:2}.ra-hero-vis svg.ra-car{width:110%;right:-10%}}
/* bands */
.ra-band{padding:clamp(56px,8vw,96px) 0}
.ra-paper{background:${PALETTE.paper};color:${PALETTE.ink}}
.ra-dark{background:${PALETTE.asphalt};color:${PALETTE.onDark}}
.ra-head{margin-bottom:40px}
/* fleet */
.ra-fleet-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
@media(max-width:960px){.ra-fleet-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.ra-fleet-grid{grid-template-columns:1fr}}
.ra-car-card{background:${PALETTE.card};border:1px solid rgba(16,20,26,.07);border-radius:20px;overflow:hidden;box-shadow:${SHADOW.sm};display:flex;flex-direction:column;transition:transform .2s ${EASE},box-shadow .2s ${EASE},border-color .2s}
.ra-car-card:hover{transform:translateY(-4px);box-shadow:${SHADOW.md};border-color:rgba(16,20,26,.13)}
.ra-car-photo{position:relative;aspect-ratio:16/9;background:linear-gradient(135deg,#ECEAE4 0%,#DFDCD4 100%);display:flex;align-items:center;justify-content:center;color:rgba(20,23,28,.28);overflow:hidden}
.ra-car-photo img{width:100%;height:100%;object-fit:cover}
.ra-car-photo>svg{width:38%;height:auto}
.ra-badge{position:absolute;top:12px;left:12px;font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:5px 11px;border-radius:999px;background:rgba(20,23,28,.82);color:#fff;z-index:1}
.ra-car-body{padding:20px 20px 22px;display:flex;flex-direction:column;gap:13px;flex:1}
.ra-car-name{font-size:26px;font-weight:700;text-transform:uppercase}
.ra-car-desc{font-size:13.5px;color:${PALETTE.inkSoft}}
.ra-spec-row{display:flex;gap:8px;flex-wrap:wrap}
.ra-spec{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:${PALETTE.inkSoft};background:#F1EFE9;border-radius:8px;padding:5px 9px;text-transform:capitalize}
.ra-car-foot{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.ra-price{font-family:var(--ra-display);font-weight:800;font-size:27px;font-variant-numeric:tabular-nums}
.ra-price small{font-family:${FONT_BODY};font-size:12.5px;font-weight:600;color:${PALETTE.inkSoft};display:block;letter-spacing:.02em}
.ra-btn-card{min-height:46px;padding:0 20px;font-size:17px;border-radius:12px}
.ra-fleet-empty{grid-column:1/-1;text-align:center;color:${PALETTE.inkSoft};padding:32px 0}
.ra-skel .ra-car-photo{background:linear-gradient(90deg,#ECEAE4 25%,#F5F3EE 50%,#ECEAE4 75%);background-size:200% 100%;animation:raShimmer 1.4s infinite}
.ra-skel-line{height:14px;border-radius:7px;background:linear-gradient(90deg,#ECEAE4 25%,#F5F3EE 50%,#ECEAE4 75%);background-size:200% 100%;animation:raShimmer 1.4s infinite}
@keyframes raShimmer{to{background-position:-200% 0}}
/* why */
.ra-why-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
@media(max-width:960px){.ra-why-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.ra-why-grid{grid-template-columns:1fr}}
.ra-why{background:${PALETTE.asphalt2};border:1px solid ${PALETTE.asphalt3};border-radius:18px;padding:26px 22px;transition:border-color .2s,box-shadow .2s}
.ra-why:hover{border-color:var(--ra-accent-glow);box-shadow:0 0 0 4px var(--ra-accent-soft)}
.ra-why svg{color:var(--ra-accent);margin-bottom:16px}
.ra-why h3{font-size:22px;font-weight:700;text-transform:uppercase;margin-bottom:8px;color:#fff}
.ra-why p{font-size:14.5px;color:${PALETTE.onDarkMuted}}
/* how */
.ra-how-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
@media(max-width:960px){.ra-how-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.ra-how-grid{grid-template-columns:1fr}}
.ra-how{background:${PALETTE.card};border:1px solid rgba(16,20,26,.07);border-radius:18px;padding:24px 20px;box-shadow:${SHADOW.sm}}
.ra-how-n{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:${PALETTE.asphalt};color:#fff;font-family:var(--ra-display);font-size:22px;font-weight:800;margin-bottom:14px;font-variant-numeric:tabular-nums}
.ra-how:nth-child(2) .ra-how-n,.ra-how:nth-child(4) .ra-how-n{background:var(--ra-accent);color:#16130F}
.ra-how h3{font-size:21px;font-weight:700;text-transform:uppercase;margin-bottom:6px}
.ra-how p{font-size:14.5px;color:${PALETTE.inkSoft}}
.ra-how-note{margin-top:22px;font-size:13.5px;color:${PALETTE.inkSoft}}
.ra-how-note b{color:${PALETTE.ink}}
/* terms */
.ra-terms{display:grid;grid-template-columns:1fr 1fr;gap:24px}
@media(max-width:760px){.ra-terms{grid-template-columns:1fr}}
.ra-term{background:${PALETTE.card};border:1px solid rgba(16,20,26,.07);border-radius:20px;padding:28px;box-shadow:${SHADOW.sm}}
.ra-term>svg{color:var(--ra-accent-ink);margin-bottom:14px}
.ra-term h3{font-size:24px;font-weight:700;text-transform:uppercase;margin-bottom:14px}
.ra-term ul{list-style:none;display:flex;flex-direction:column;gap:11px;margin:0;padding:0}
.ra-term li{display:flex;gap:10px;font-size:15px;color:${PALETTE.inkSoft}}
.ra-term li svg{flex:none;color:${PALETTE.okInk};margin-top:2px}
.ra-term-note{margin-top:16px;padding:12px 14px;border-radius:12px;background:${PALETTE.warnBg};color:${PALETTE.warnInk};font-size:13.5px;font-weight:500;display:flex;gap:9px}
.ra-term-note svg{flex:none;margin-top:2px}
/* cta band */
.ra-cta{position:relative;overflow:hidden;padding:clamp(56px,8vw,88px) 0;text-align:center;color:#fff;background:radial-gradient(ellipse 60% 80% at 50% -10%,rgba(255,255,255,.14),transparent 60%),linear-gradient(150deg,var(--ra-accent-hover),var(--ra-accent-ink) 70%,var(--ra-accent-deep))}
.ra-cta h2{font-size:clamp(2.2rem,5vw,3.4rem);font-weight:800;text-transform:uppercase}
.ra-cta p{margin:12px auto 30px;max-width:46ch;color:rgba(255,255,255,.9)}
.ra-cta .ra-btn-primary{background:#fff;color:${PALETTE.ink};box-shadow:0 10px 30px rgba(0,0,0,.22)}
.ra-cta .ra-btn-ghost{border-color:rgba(255,255,255,.5);color:#fff}
.ra-cta .ra-lane{margin-left:auto;margin-right:auto;background:repeating-linear-gradient(90deg,rgba(255,255,255,.85) 0 34px,transparent 34px 58px)}
/* footer */
.ra-footer{background:#101318;color:${PALETTE.onDarkMuted};padding:40px 0 34px;font-size:14px}
.ra-footer .ra-container{display:flex;gap:24px;flex-wrap:wrap;align-items:center;justify-content:space-between}
.ra-footer .ra-brand-nm{font-size:20px;color:#fff}
.ra-foot-meta{display:flex;gap:18px;flex-wrap:wrap;align-items:center}
.ra-foot-meta a{color:${PALETTE.onDarkMuted}}
/* wa fab */
.ra-wa{position:fixed;right:20px;bottom:20px;z-index:999;width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,${PALETTE.wa},${PALETTE.waDark});display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(31,171,85,.4);transition:transform .2s cubic-bezier(.34,1.56,.64,1)}
.ra-wa:hover{transform:scale(1.1)}
.ra-wa svg{width:28px;height:28px;fill:#fff}
@media(prefers-reduced-motion:reduce){.ra-root *,.ra-root *::before,.ra-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`

const WA_PATH = 'M12.04 2a9.9 9.9 0 0 0-8.42 15.17L2.2 21.8l4.75-1.38A9.9 9.9 0 1 0 12.04 2Zm5.83 14.13c-.24.68-1.4 1.3-1.93 1.35-.52.05-1.17.24-3.94-.82-3.32-1.3-5.42-4.7-5.59-4.92-.16-.22-1.33-1.77-1.33-3.38 0-1.6.84-2.4 1.14-2.72.3-.33.65-.41.87-.41h.62c.2 0 .47-.08.73.56.27.65.92 2.24 1 2.4.08.16.13.36.02.58-.1.22-.16.35-.32.54-.16.19-.34.42-.49.57-.16.16-.33.34-.14.66.19.33.84 1.4 1.8 2.26 1.24 1.1 2.28 1.45 2.61 1.61.32.16.51.14.7-.08.19-.22.81-.94 1.02-1.27.22-.32.43-.27.73-.16.3.1 1.9.9 2.22 1.06.33.16.54.24.62.38.08.13.08.78-.16 1.46Z'

function CarSilhouette() {
  return (
    <svg className="ra-car" viewBox="0 0 640 220" fill="currentColor" aria-hidden="true">
      <path d="M96 154c-20 0-30-8-30-22 0-10 6-16 18-20l38-12c14-24 34-38 66-42 46-6 118-6 168 2 30 5 56 20 74 40l60 10c26 4 40 14 40 30 0 10-8 14-24 14H96Z" opacity=".9" />
      <path d="M206 66c-24 4-40 15-52 33l90-3-4-31c-12 0-24 0-34 1Zm60-2 4 32 96-3c-14-14-33-24-54-27-14-2-30-3-46-2Z" fill="#161A20" />
      <circle cx="170" cy="158" r="34" fill="#0E1114" /><circle cx="170" cy="158" r="20" fill="#2A313C" /><circle cx="170" cy="158" r="8" fill="#4A5361" />
      <circle cx="470" cy="158" r="34" fill="#0E1114" /><circle cx="470" cy="158" r="20" fill="#2A313C" /><circle cx="470" cy="158" r="8" fill="#4A5361" />
      <rect x="502" y="118" width="34" height="10" rx="5" style={{ fill: 'var(--ra-accent)' }} opacity=".95" />
    </svg>
  )
}

/** Wordmark: bagian terakhir nama di-italic-aksen. Multi-kata → kata terakhir
 *  ("Nusantara Drive" → Nusantara <em>Drive</em>); satu kata CamelCase → segmen
 *  Kapital terakhir ("SetirYuk" → Setir<em>Yuk</em>). */
function BrandName({ nama }: { nama: string }) {
  const t = nama.trim()
  const words = t.split(/\s+/)
  if (words.length > 1) {
    const last = words.pop()!
    return <span className="ra-brand-nm">{words.join(' ')}{' '}<em>{last}</em></span>
  }
  const m = /^(.*[a-z0-9])([A-Z][a-z0-9]*)$/.exec(t)
  if (m) return <span className="ra-brand-nm">{m[1]}<em>{m[2]}</em></span>
  return <span className="ra-brand-nm">{t}</span>
}

export default function RentalAsphaltRenderer({
  nama,
  services,
  profile,
  wa,
  primary,
  konten,
  bookingSlug,
}: {
  nama: string
  services: Service[]
  profile: TenantProfile | null
  wa?: string
  slug: string
  primary?: string
  konten?: DataKontenRental
  bookingSlug?: string
}) {
  const accent = deriveAccent(primary ?? konten?.warna_tema)
  const waNumber = profile?.wa ?? konten?.wa ?? wa ?? null
  const waHref = waLink(waNumber, `Halo ${nama}, saya mau tanya sewa mobil.`)
  const alamat = konten?.kontak?.alamat ?? profile?.alamat ?? null
  const kota = (konten?.kota_layanan ?? []).filter(Boolean)

  // Hero: tagline bisa pakai pemisah "|" → bagian kedua jadi baris italic aksen.
  const [line1, line2] = (konten?.tagline ?? 'Sewa mobil tanpa ribet.|Gas, berangkat!').split('|')
  const sub = konten?.deskripsi ?? DEFAULT_SUB

  const why = (konten?.keunggulan?.length
    ? konten.keunggulan.slice(0, 4).map((t, i) => ({ icon: WHY_ICONS[i % WHY_ICONS.length], t, p: '' }))
    : DEFAULT_WHY)

  const syaratLepas = konten?.syarat_sewa
    ? konten.syarat_sewa.split('\n').map((s) => s.trim()).filter(Boolean)
    : DEFAULT_SYARAT

  const fallbackFleet: FallbackCar[] = services.map((s) => ({
    nama: s.nama,
    deskripsi: s.deskripsi,
    harga: Number(s.harga) || 0,
    gambar_url: s.gambar_url,
  }))

  return (
    <div className="ra-root" style={accentVars(accent) as CSSProperties}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <header className="ra-nav">
        <div className="ra-container">
          <a className="ra-brand" href="#beranda" aria-label={`${nama} — beranda`}>
            <Icon d={IC.wheel} size={26} />
            <BrandName nama={nama} />
          </a>
          <nav className="ra-nav-links" aria-label="Navigasi utama">
            <a href="#armada">Armada</a>
            <a href="#cara">Cara Sewa</a>
            <a href="#syarat">Syarat</a>
          </nav>
          <a className="ra-btn ra-btn-primary ra-nav-cta" href="#armada">Booking</a>
        </div>
      </header>

      <main id="beranda">
        <section className="ra-hero">
          <div className="ra-container">
            <div>
              <p className="ra-eyebrow ra-fade" style={{ color: 'var(--ra-accent)' }}>Rental Mobil · Lepas Kunci &amp; Dengan Sopir</p>
              <h1 className="ra-fade">{line1?.trim()}{line2 ? <><br /><span className="go">{line2.trim()}</span></> : null}</h1>
              <p className="ra-hero-sub ra-fade">{sub}</p>
              <div className="ra-hero-cta ra-fade">
                <a className="ra-btn ra-btn-primary" href="#armada">Lihat Armada <Icon d={IC.chevron} size={20} /></a>
                {waHref && <a className="ra-btn ra-btn-ghost" href={waHref} target="_blank" rel="noopener noreferrer">Tanya via WhatsApp</a>}
              </div>
              <div className="ra-hero-trust ra-fade">
                <span className="ra-chip"><Icon d={IC.shield} size={15} />Bayar aman via Midtrans</span>
                <span className="ra-chip"><Icon d={IC.clock} size={15} />Konfirmasi otomatis</span>
                <span className="ra-chip"><Icon d={IC.road} size={15} />Jadwal real-time</span>
              </div>
            </div>
            <div className="ra-hero-vis" aria-hidden="true">
              <span className="ra-beam" />
              <CarSilhouette />
              <span className="ra-road" />
            </div>
          </div>
        </section>

        <section className="ra-band ra-paper" id="armada">
          <div className="ra-container">
            <div className="ra-head">
              <p className="ra-eyebrow">Armada</p>
              <h2 className="ra-title">Pilih mobilmu</h2>
              <p className="ra-sub">Harga per hari sudah final — tanpa biaya tersembunyi. Ketersediaan tanggal dicek langsung saat booking.</p>
              <hr className="ra-lane" />
            </div>
            <AsphaltFleetSection bookingSlug={bookingSlug} fallback={fallbackFleet} waHref={waHref} />
          </div>
        </section>

        <section className="ra-band ra-dark">
          <div className="ra-container">
            <div className="ra-head">
              <p className="ra-eyebrow">Kenapa {nama}</p>
              <h2 className="ra-title" style={{ color: '#fff' }}>Sewa yang jelas dari awal</h2>
              <hr className="ra-lane" />
            </div>
            <div className="ra-why-grid">
              {why.map((w, i) => (
                <div className="ra-why" key={i}>
                  <Icon d={w.icon} size={38} sw={1.7} />
                  <h3>{w.t}</h3>
                  {w.p ? <p>{w.p}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ra-band ra-paper" id="cara">
          <div className="ra-container">
            <div className="ra-head">
              <p className="ra-eyebrow">Cara Sewa</p>
              <h2 className="ra-title">Empat langkah, selesai</h2>
              <hr className="ra-lane" />
            </div>
            <div className="ra-how-grid">
              {DEFAULT_STEPS.map((s, i) => (
                <div className="ra-how" key={i}>
                  <span className="ra-how-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.t}</h3>
                  <p>{s.p}</p>
                </div>
              ))}
            </div>
            <p className="ra-how-note"><b>Catatan:</b> pembayaran penuh di depan; booking otomatis hangus jika tidak dibayar dalam 2 jam.</p>
          </div>
        </section>

        <section className="ra-band ra-paper" id="syarat" style={{ paddingTop: 0 }}>
          <div className="ra-container">
            <div className="ra-head">
              <p className="ra-eyebrow">Syarat Sewa</p>
              <h2 className="ra-title">Dua cara pakai</h2>
              <hr className="ra-lane" />
            </div>
            <div className="ra-terms">
              <div className="ra-term">
                <Icon d={IC.key} size={34} sw={1.8} />
                <h3>Lepas Kunci</h3>
                <ul>
                  {syaratLepas.map((s, i) => (
                    <li key={i}><Icon d={IC.check} size={18} sw={2.4} />{s}</li>
                  ))}
                </ul>
              </div>
              <div className="ra-term">
                <Icon d={IC.wheel} size={34} sw={1.8} />
                <h3>Dengan Sopir</h3>
                <ul>
                  {DRIVER_SYARAT.map((s, i) => (
                    <li key={i}><Icon d={IC.check} size={18} sw={2.4} />{s}</li>
                  ))}
                </ul>
                <p className="ra-term-note">
                  <Icon d={IC.info} size={17} />
                  <span>Biaya sopir <b>belum termasuk</b> harga sewa online — admin konfirmasi nominalnya via WhatsApp setelah booking.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="ra-cta" id="kontak">
          <div className="ra-container">
            <h2>Mobil siap. Tinggal setir.</h2>
            <p>Booking sekarang — kalender ketersediaan dan harga final langsung kelihatan.</p>
            <div className="ra-hero-cta" style={{ justifyContent: 'center' }}>
              <a className="ra-btn ra-btn-primary" href="#armada">Booking Sekarang</a>
              {waHref && <a className="ra-btn ra-btn-ghost" href={waHref} target="_blank" rel="noopener noreferrer">Chat WhatsApp</a>}
            </div>
            <hr className="ra-lane ra-lane-c" />
          </div>
        </section>
      </main>

      <footer className="ra-footer">
        <div className="ra-container">
          <div>
            <BrandName nama={nama} />
            <p style={{ marginTop: 6 }}>Rental mobil lepas kunci &amp; dengan sopir.{kota.length ? ` Melayani ${kota.join(', ')}.` : ''}</p>
          </div>
          <div className="ra-foot-meta">
            {alamat && <span>{alamat}</span>}
            {waHref && <a href={waHref} target="_blank" rel="noopener noreferrer">WhatsApp{waNumber ? ` ${waNumber}` : ''}</a>}
            <span>© {new Date().getFullYear()} {nama} · Website oleh Webzoka</span>
          </div>
        </div>
      </footer>

      {waHref && (
        <a className="ra-wa" href={waHref} target="_blank" rel="noopener noreferrer" aria-label={`Chat WhatsApp ${nama}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={WA_PATH} /></svg>
        </a>
      )}
    </div>
  )
}
