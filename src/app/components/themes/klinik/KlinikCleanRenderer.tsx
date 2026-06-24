'use client'
// ============================================================
// Variant "clean" — Klinik tema modern putih/biru.
// Polish pass: gradient mesh hero, section rhythm, stagger cards,
// colored shadows, eyebrow pattern, concentric radius, spring easing.
// ============================================================

import { Plus_Jakarta_Sans } from 'next/font/google'
import type { PageSection, Service, TenantProfile, FeatureFlags } from '@/types/websitebuilder'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-kc',
})

// ── Palette ───────────────────────────────────────────────────
const BLUE    = '#0EA5E9'
const BLUE_D  = '#0369A1'
const BLUE_LT = '#E0F2FE'
const BLUE_XL = '#F0F9FF'
const WHITE   = '#FFFFFF'
const BG      = '#F8FAFC'
const DARK    = '#0F172A'
const NAVY    = '#0C1A2E'  // warmer dark for CTA
const MUTED   = '#64748B'
const BORDER  = '#E2E8F0'
const GREEN   = '#10B981'

// ── Shadow System ─────────────────────────────────────────────
const S_SM   = '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)'
const S_MD   = '0 4px 16px rgba(0,0,0,.08), 0 2px 6px rgba(0,0,0,.04)'
const S_LG   = '0 12px 40px rgba(0,0,0,.10), 0 4px 12px rgba(0,0,0,.06)'
const S_BLUE = `0 8px 28px rgba(14,165,233,.32), 0 2px 8px rgba(14,165,233,.16)`

type Isi = Record<string, any>
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : [] }

// ── Global CSS injected once ──────────────────────────────────
const GLOBAL_CSS = `
  .kc-root {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-variant-numeric: tabular-nums;
  }
  @keyframes kc-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .kc-fade-up { animation: kc-fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .kc-d0 { animation-delay: 0ms; }
  .kc-d1 { animation-delay: 80ms; }
  .kc-d2 { animation-delay: 160ms; }
  .kc-d3 { animation-delay: 240ms; }
  .kc-d4 { animation-delay: 320ms; }
  .kc-card-hover {
    transition: transform 220ms cubic-bezier(0.16,1,0.3,1),
                box-shadow 220ms cubic-bezier(0.16,1,0.3,1),
                border-color 220ms ease;
  }
  .kc-card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(0,0,0,.10), 0 4px 12px rgba(0,0,0,.06) !important;
    border-color: rgba(14,165,233,.25) !important;
  }
  .kc-btn-primary {
    transition: transform 200ms cubic-bezier(0.16,1,0.3,1),
                box-shadow 200ms ease, opacity 150ms ease;
  }
  .kc-btn-primary:hover { transform: translateY(-2px); }
  .kc-btn-primary:active { transform: scale(0.96); }
  .kc-btn-ghost {
    transition: transform 200ms ease, background 150ms ease;
  }
  .kc-btn-ghost:hover { transform: translateY(-1px); background: rgba(0,0,0,.04); }
  .kc-wa-float { transition: transform 220ms cubic-bezier(0.34,1.56,0.64,1); }
  .kc-wa-float:hover { transform: scale(1.12); }
  .kc-nav-link { transition: color 150ms ease; }
  .kc-nav-link:hover { color: ${BLUE} !important; }
  .kc-stat { transition: color 150ms ease; }
`

// ── WA Float ─────────────────────────────────────────────────
function FloatingWA({ wa }: { wa?: string }) {
  if (!wa) return null
  return (
    <a href={`https://wa.me/${wa}?text=Halo, saya ingin buat janji konsultasi`}
      target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp"
      className="kc-wa-float"
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 999,
        width: 56, height: 56, borderRadius: '50%',
        backgroundColor: '#25D366', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,.40)',
      }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a9 9 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.492a.5.5 0 00.618.618l5.647-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.917 0-3.71-.504-5.263-1.385l-.378-.217-3.922 1.027 1.027-3.922-.217-.378A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    </a>
  )
}

// ── Navbar ────────────────────────────────────────────────────
function Navbar({ nama, wa }: { nama: string; wa?: string }) {
  return (
    <header className={`sticky top-0 z-50 ${sans.variable}`}
      style={{ backgroundColor: 'rgba(255,255,255,.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`, boxShadow: S_SM }}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo mark — cross médical */}
          <div style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: BLUE,
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${BLUE}40` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="10" y="4" width="4" height="16" rx="2"/>
              <rect x="4" y="10" width="16" height="4" rx="2"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: DARK }}>{nama}</p>
            <p className="text-[10px] font-medium" style={{ color: MUTED }}>Klinik Spesialis</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-7">
          {['Layanan', 'Dokter', 'Fasilitas', 'Kontak'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="kc-nav-link text-sm font-medium"
              style={{ color: MUTED }}>{l}</a>
          ))}
        </nav>
        {wa && (
          <a href={`https://wa.me/${wa}`} target="_blank"
            className="kc-btn-primary text-sm font-semibold px-5 py-2.5 rounded-full"
            style={{ backgroundColor: BLUE, color: WHITE, boxShadow: S_BLUE }}>
            Buat Janji
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero — gradient mesh + split layout ───────────────────────
function Hero({ konten, wa, features }: { konten?: Isi; wa?: string; features?: FeatureFlags }) {
  const nama    = konten?.nama_klinik ?? 'Klinik Kami'
  const tagline = konten?.deskripsi ?? 'Layanan kesehatan modern dengan dokter spesialis berpengalaman.'
  const jam     = konten?.jam_operasional ?? 'Senin–Sabtu 08.00–21.00'
  const dokters = asArray(konten?.dokter).slice(0, 3)

  const badges = [
    { flag: 'hasBooking',  label: 'Reservasi Online' },
    { flag: 'hasWhatsApp', label: 'Notif WA Otomatis' },
    { flag: 'hasSEO',      label: 'SEO Teroptimasi' },
    { flag: 'hasPayment',  label: 'Bayar Online' },
  ].filter(b => features?.[b.flag as keyof FeatureFlags])

  // Gradient mesh — atmosfer biru medis yang kaya
  const heroBg = [
    `radial-gradient(ellipse 70% 60% at 90% 10%, rgba(14,165,233,.09) 0%, transparent 55%)`,
    `radial-gradient(ellipse 50% 40% at 5% 85%, rgba(16,185,129,.07) 0%, transparent 45%)`,
    `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(14,165,233,.04) 0%, transparent 60%)`,
    BG,
  ].join(', ')

  return (
    <section style={{ background: heroBg, minHeight: '88vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle geometric accent */}
      <div style={{
        position: 'absolute', top: -80, right: -80, width: 400, height: 400,
        borderRadius: '50%', border: `1px solid rgba(14,165,233,.08)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 280, height: 280,
        borderRadius: '50%', border: `1px solid rgba(14,165,233,.12)`,
        pointerEvents: 'none',
      }} />

      <div className="max-w-6xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" style={{ position: 'relative', zIndex: 1 }}>
        {/* Left copy */}
        <div>
          {/* Eyebrow */}
          <div className="kc-fade-up kc-d0 inline-flex items-center gap-2 mb-5 px-3.5 py-2 rounded-full"
            style={{ backgroundColor: BLUE_LT, border: `1px solid rgba(14,165,233,.2)` }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: GREEN, display: 'inline-block', boxShadow: `0 0 6px ${GREEN}80` }} />
            <span className="text-xs font-bold" style={{ color: BLUE_D, letterSpacing: '0.05em' }}>Klinik Terakreditasi · Surabaya</span>
          </div>

          <h1 className="kc-fade-up kc-d1 font-extrabold leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', color: DARK, letterSpacing: '-0.03em', textWrap: 'balance' } as React.CSSProperties}>
            {nama}
          </h1>

          <p className="kc-fade-up kc-d2 leading-relaxed mb-8"
            style={{ fontSize: '1.0625rem', color: MUTED, fontWeight: 400, maxWidth: 440, textWrap: 'pretty' } as React.CSSProperties}>
            {tagline}
          </p>

          <div className="kc-fade-up kc-d3 flex flex-wrap gap-3 mb-8">
            {wa && (
              <a href={`https://wa.me/${wa}?text=Halo, saya ingin reservasi`} target="_blank"
                className="kc-btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm"
                style={{ backgroundColor: BLUE, color: WHITE, boxShadow: S_BLUE }}>
                Reservasi Online →
              </a>
            )}
            <a href="#layanan"
              className="kc-btn-ghost inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm"
              style={{ border: `1.5px solid ${BORDER}`, color: DARK }}>
              Lihat Layanan
            </a>
          </div>

          {badges.length > 0 && (
            <div className="kc-fade-up kc-d4 flex flex-wrap gap-2">
              {badges.map(b => (
                <span key={b.label}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: BLUE_XL, color: BLUE_D, border: `1px solid ${BLUE_LT}` }}>
                  ✓ {b.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right — jadwal card */}
        <div id="dokter" className="hidden lg:block kc-fade-up kc-d2">
          <div className="rounded-3xl overflow-hidden" style={{ boxShadow: S_LG, border: `1px solid ${BORDER}` }}>
            {/* Card header */}
            <div className="px-6 py-5 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_D})`, color: WHITE }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-75 mb-1">Jadwal Dokter</p>
                <p className="text-sm font-semibold">{jam.split(',')[0]}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,.18)', backdropFilter: 'blur(4px)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="white" strokeWidth="1.5"/>
                  <path d="M8 2v4M16 2v4M3 10h18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* Doctor rows */}
            <div style={{ backgroundColor: WHITE }}>
              {(dokters.length > 0 ? dokters : [
                { nama: 'dr. Spesialis A', spesialis: 'Penyakit Dalam', jadwal: '08:00–14:00' },
                { nama: 'dr. Spesialis B', spesialis: 'Anak',           jadwal: '13:00–19:00' },
              ]).map((d: Isi, i: number) => (
                <div key={i} className="flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: i < 2 ? `1px solid ${BORDER}` : 'none' }}>
                  <div className="flex items-center gap-3">
                    {/* Avatar — concentric radius: outer 12, inner text */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, // outer 12
                      background: `linear-gradient(135deg, ${BLUE_LT}, ${BLUE_XL})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1.5px solid rgba(14,165,233,.2)`, flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: BLUE_D }}>
                        {(d.nama ?? 'D').replace('dr. ', '').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight" style={{ color: DARK }}>{d.nama ?? d.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: MUTED }}>{d.spesialis ?? d.sp}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-xs font-medium mb-1" style={{ color: DARK }}>{d.jadwal ?? d.jam}</p>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>Tersedia</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking footer */}
            {wa && (
              <div className="px-6 py-4" style={{ backgroundColor: BG, borderTop: `1px solid ${BORDER}` }}>
                <a href={`https://wa.me/${wa}?text=Halo, saya ingin booking dokter`} target="_blank"
                  className="kc-btn-primary block text-center text-sm font-semibold py-3 rounded-xl"  // concentric: card 24 → btn inside 12
                  style={{ backgroundColor: BLUE, color: WHITE, boxShadow: S_BLUE, borderRadius: 12 }}>
                  Booking Sekarang
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wave divider bawah */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
        backgroundColor: WHITE, clipPath: 'ellipse(52% 100% at 50% 100%)', pointerEvents: 'none' }} />
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────
function Stats({ konten }: { konten?: Isi }) {
  const dokterCount  = asArray(konten?.dokter).length || 3
  const fasCount     = asArray(konten?.fasilitas).length || 4
  const asuransiCount = asArray(konten?.asuransi_diterima).length || 4
  const items = [
    { v: `${dokterCount}`, l: 'Dokter Spesialis' },
    { v: `${fasCount}+`,   l: 'Fasilitas Medis' },
    { v: `${asuransiCount}+`, l: 'Asuransi Diterima' },
    { v: '4.9★', l: 'Rating Google' },
  ]
  return (
    <div style={{ backgroundColor: WHITE, borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {items.map((s, i) => (
          <div key={s.l} className={`kc-fade-up kc-d${i}`}>
            <p className="font-extrabold" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: BLUE, letterSpacing: '-0.03em' }}>{s.v}</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mt-1" style={{ color: MUTED }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Layanan ───────────────────────────────────────────────────
function Layanan({ services }: { services?: Service[] }) {
  const items = services && services.length > 0 ? services : [
    { nama: 'Konsultasi Dokter Umum', deskripsi: 'Pemeriksaan kesehatan umum, diagnosa awal, dan rujukan spesialis bila diperlukan.', harga: 0 },
    { nama: 'Poli Spesialis',         deskripsi: 'Dokter spesialis tersedia setiap hari kerja dengan perjanjian.', harga: 0 },
    { nama: 'Reservasi Online',       deskripsi: 'Booking jadwal dari rumah — ambil nomor antrian digital tanpa antre.', harga: 0 },
  ]
  const icons = [
    // Stethoscope
    <svg key="a" width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="17" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M6 3v7a6 6 0 006 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 3v7a6 6 0 01-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="6" cy="3" r="1.5" fill="currentColor"/><circle cx="18" cy="3" r="1.5" fill="currentColor"/></svg>,
    // User-md
    <svg key="b" width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    // Calendar check
    <svg key="c" width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 2v4M16 2v4M3 10h18M9 16l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    // Shield
    <svg key="d" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 9.5C8 19.5 5 15.5 5 11V6l7-3z" stroke="currentColor" strokeWidth="1.5"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    // Clock
    <svg key="e" width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    // Pill
    <svg key="f" width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" opacity=".2"/><rect x="6.5" y="6.5" width="11" height="11" rx="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9.5 9.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  ]

  return (
    <section id="layanan" style={{ backgroundColor: BG }}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Eyebrow + title */}
        <div className="mb-14">
          <p className="kc-fade-up kc-d0 text-[11px] font-black uppercase tracking-[0.18em] mb-3" style={{ color: BLUE }}>Layanan Kami</p>
          <h2 className="kc-fade-up kc-d1 font-extrabold" style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', color: DARK, letterSpacing: '-0.02em', textWrap: 'balance' } as React.CSSProperties}>
            Perawatan Lengkap<br />di Satu Tempat
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.slice(0, 6).map((s: any, i: number) => (
            <div key={i}
              className={`kc-card-hover kc-fade-up kc-d${Math.min(i, 4)} rounded-2xl p-7`}
              style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, boxShadow: S_SM }}>
              {/* Icon — concentric: card 16px, icon bg 12px */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `linear-gradient(135deg, ${BLUE_LT}, ${BLUE_XL})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: BLUE, marginBottom: 20,
                border: `1.5px solid rgba(14,165,233,.15)`,
              }}>
                {icons[i % icons.length]}
              </div>
              <h3 className="font-bold mb-2 leading-snug" style={{ fontSize: '0.9375rem', color: DARK }}>{s.nama}</h3>
              <p className="text-sm leading-relaxed" style={{ color: MUTED, fontWeight: 400 }}>{s.deskripsi ?? ''}</p>
              {s.harga > 0 && (
                <p className="mt-4 text-sm font-bold" style={{ color: BLUE }}>
                  Mulai Rp {s.harga.toLocaleString('id-ID')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Keunggulan — dark section sebagai "breath" ────────────────
function Keunggulan({ konten }: { konten?: Isi }) {
  const items = asArray(konten?.keunggulan).filter((k: string) => k?.trim())
  if (items.length === 0) return null

  // Gradient dark navy untuk kontras
  const sectionBg = `linear-gradient(135deg, ${NAVY} 0%, #0A1628 100%)`

  return (
    <section style={{ background: sectionBg, position: 'relative', overflow: 'hidden' }}>
      {/* Decorative radial glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 600, height: 400,
        background: `radial-gradient(ellipse at center, rgba(14,165,233,.08) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div className="max-w-6xl mx-auto px-6 py-20" style={{ position: 'relative', zIndex: 1 }}>
        {/* Eyebrow */}
        <div className="text-center mb-14">
          <p className="kc-fade-up kc-d0 text-[11px] font-black uppercase tracking-[0.18em] mb-3" style={{ color: BLUE }}>Mengapa Kami</p>
          <h2 className="kc-fade-up kc-d1 font-extrabold text-white" style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', letterSpacing: '-0.02em', textWrap: 'balance' } as React.CSSProperties}>
            Komitmen Nyata untuk Kesehatan Anda
          </h2>
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)` }}>
          {items.map((k: string, i: number) => (
            <div key={i}
              className={`kc-card-hover kc-fade-up kc-d${Math.min(i, 4)} p-7 rounded-2xl`}
              style={{
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.1)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06)',
              }}>
              {/* Checkmark icon — not emoji */}
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `rgba(14,165,233,.2)`,
                border: `1px solid rgba(14,165,233,.3)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="leading-relaxed font-medium" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,.88)' }}>{k}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Fasilitas & Asuransi ──────────────────────────────────────
function FasilitasAsuransi({ konten }: { konten?: Isi }) {
  const fasilitas = asArray(konten?.fasilitas)
  const asuransi  = asArray(konten?.asuransi_diterima)
  if (!fasilitas.length && !asuransi.length) return null
  return (
    <section id="fasilitas" style={{ backgroundColor: WHITE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-14">
        {fasilitas.length > 0 && (
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] mb-5" style={{ color: BLUE }}>Fasilitas</p>
            <div className="flex flex-wrap gap-2.5">
              {fasilitas.map((f: string, i: number) => (
                <span key={i} className="text-sm font-semibold px-4 py-2 rounded-full"
                  style={{ backgroundColor: BLUE_LT, color: BLUE_D, border: `1px solid rgba(14,165,233,.2)` }}>{f}</span>
              ))}
            </div>
          </div>
        )}
        {asuransi.length > 0 && (
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] mb-5" style={{ color: BLUE }}>Asuransi Diterima</p>
            <div className="flex flex-wrap gap-2.5">
              {asuransi.map((a: string, i: number) => (
                <span key={i} className="text-sm font-medium px-4 py-2 rounded-full"
                  style={{ border: `1.5px solid ${BORDER}`, color: MUTED }}>{a}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ── CTA — dark gradient dengan dekoratif ──────────────────────
function CTA({ wa }: { wa?: string }) {
  return (
    <section id="kontak" style={{
      background: `linear-gradient(135deg, ${NAVY} 0%, #0A1628 60%, #061020 100%)`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Radial glow dekoratif */}
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          `radial-gradient(ellipse 60% 80% at 15% 50%, rgba(14,165,233,.12) 0%, transparent 55%)`,
          `radial-gradient(ellipse 40% 60% at 85% 50%, rgba(16,185,129,.07) 0%, transparent 50%)`,
        ].join(', '),
        pointerEvents: 'none',
      }} />
      {/* Decorative circle border */}
      <div style={{
        position: 'absolute', bottom: -120, right: -120,
        width: 400, height: 400, borderRadius: '50%',
        border: '1px solid rgba(14,165,233,.08)', pointerEvents: 'none',
      }} />

      <div className="max-w-3xl mx-auto px-6 py-24 text-center" style={{ position: 'relative', zIndex: 1 }}>
        {/* Eyebrow */}
        <div className="kc-fade-up kc-d0 inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
          style={{ background: 'rgba(14,165,233,.15)', border: '1px solid rgba(14,165,233,.25)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: GREEN, display: 'inline-block' }} />
          <span className="text-xs font-bold" style={{ color: 'rgba(14,165,233,.9)', letterSpacing: '0.08em' }}>BUKA 7 HARI SEMINGGU</span>
        </div>

        <h2 className="kc-fade-up kc-d1 font-extrabold text-white mb-5"
          style={{ fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-0.02em', textWrap: 'balance' } as React.CSSProperties}>
          Jadwalkan Konsultasi Hari Ini
        </h2>
        <p className="kc-fade-up kc-d2 text-base mb-10 mx-auto max-w-md"
          style={{ color: 'rgba(255,255,255,.55)', fontWeight: 400, lineHeight: 1.7 }}>
          Pilih dokter, pilih jadwal, konfirmasi via WhatsApp. Selesai dalam 2 menit.
        </p>

        <div className="kc-fade-up kc-d3 flex flex-col sm:flex-row gap-4 justify-center">
          {wa && (
            <a href={`https://wa.me/${wa}?text=Halo, saya ingin buat janji konsultasi`} target="_blank"
              className="kc-btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm"
              style={{ backgroundColor: BLUE, color: WHITE, boxShadow: S_BLUE }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: .85 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a9 9 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              </svg>
              Reservasi via WhatsApp
            </a>
          )}
          <a href="#layanan"
            className="kc-btn-ghost inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm"
            style={{ border: '1.5px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.8)' }}>
            Lihat Jadwal Dokter
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer({ nama, profile }: { nama: string; profile?: TenantProfile | null }) {
  return (
    <footer style={{ backgroundColor: '#070D1A', borderTop: '1px solid rgba(255,255,255,.06)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: BLUE,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <rect x="10" y="4" width="4" height="16" rx="2"/>
              <rect x="4" y="10" width="16" height="4" rx="2"/>
            </svg>
          </div>
          <span className="font-bold text-sm text-white">{nama}</span>
        </div>
        <div className="flex flex-wrap gap-6 text-xs font-medium" style={{ color: 'rgba(255,255,255,.4)' }}>
          {profile?.alamat && <span>📍 {profile.alamat}</span>}
          {profile?.jam    && <span>🕐 {profile.jam}</span>}
          {profile?.wa     && <span>📱 +{profile.wa}</span>}
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,.3)' }}>
          © {new Date().getFullYear()} {nama} ·{' '}
          <a href="https://www.webzoka.com" style={{ color: BLUE, textDecoration: 'none' }}>Webzoka</a>
        </p>
      </div>
    </footer>
  )
}

// ── Root ──────────────────────────────────────────────────────
export default function KlinikCleanRenderer({
  nama, sections: _, services = [], profile = null, wa,
  konten, features = {},
}: {
  nama: string
  sections: PageSection[]
  services?: Service[]
  profile?: TenantProfile | null
  wa?: string
  slug?: string
  primary?: string
  konten?: Record<string, any>
  features?: FeatureFlags
}) {
  const waContact = wa ?? profile?.wa ?? undefined
  const k = konten ?? {}

  return (
    <div className={`kc-root ${sans.variable}`}
      style={{ backgroundColor: BG, fontFamily: `'Plus Jakarta Sans', system-ui, sans-serif` }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <Navbar nama={nama} wa={waContact} />
      <main>
        <Hero       konten={k} wa={waContact} features={features} />
        <Stats      konten={k} />
        <Layanan    services={services} />
        <Keunggulan konten={k} />
        <FasilitasAsuransi konten={k} />
        <CTA        wa={waContact} />
      </main>
      <Footer nama={nama} profile={profile} />
      <FloatingWA  wa={waContact} />
    </div>
  )
}
