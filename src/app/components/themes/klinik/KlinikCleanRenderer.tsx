'use client'
// ============================================================
// Variant "clean" untuk tema klinik.
// Berbeda dari KlinikRenderer (Warm Sanctuary) yang dark sage-green.
// Clean: putih dominan, biru medis, sans-serif, layout modern/bersih.
// Terasa seperti klinik internasional / RS swasta.
// ============================================================

import { Plus_Jakarta_Sans } from 'next/font/google'
import type { PageSection, Service, TenantProfile, FeatureFlags } from '@/types/websitebuilder'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-klinik-clean',
})

// ── Palette — Clean Medical ───────────────────────────────────
const BLUE    = '#0EA5E9'   // sky-500
const BLUE_D  = '#0369A1'   // sky-700
const BLUE_LT = '#E0F2FE'   // sky-100
const WHITE   = '#FFFFFF'
const BG      = '#F8FAFC'   // slate-50
const SURFACE = '#FFFFFF'
const DARK    = '#0F172A'   // slate-900
const MUTED   = '#64748B'   // slate-500
const BORDER  = '#E2E8F0'   // slate-200
const GREEN   = '#10B981'   // emerald-500

type Isi = Record<string, any>
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : [] }

// ── WA Float ─────────────────────────────────────────────────
function FloatingWA({ wa }: { wa?: string }) {
  if (!wa) return null
  return (
    <a href={`https://wa.me/${wa}?text=Halo, saya ingin buat janji konsultasi`}
      target="_blank" aria-label="WhatsApp"
      style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, width: 52, height: 52,
        borderRadius: '50%', backgroundColor: '#25D366', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(37,211,102,.35)', transition: 'transform 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
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
      style={{ backgroundColor: WHITE, borderBottom: `1px solid ${BORDER}`, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: BLUE,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
            </svg>
          </div>
          <span className="font-bold text-base" style={{ color: DARK }}>{nama}</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: MUTED }}>
          {['Layanan', 'Dokter', 'Fasilitas', 'Kontak'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-sky-600 transition-colors">{l}</a>
          ))}
        </nav>
        {wa && (
          <a href={`https://wa.me/${wa}`} target="_blank"
            className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:opacity-90"
            style={{ backgroundColor: BLUE, color: WHITE }}>
            Buat Janji
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero — split layout, light ────────────────────────────────
function Hero({ konten, wa, features }: { konten?: Isi; wa?: string; features?: FeatureFlags }) {
  const nama = konten?.nama_klinik ?? 'Klinik Kami'
  const tagline = konten?.deskripsi ?? 'Layanan kesehatan modern untuk keluarga Anda.'
  const jam = konten?.jam_operasional ?? 'Senin–Sabtu 08.00–21.00'
  const dokterList = asArray(konten?.dokter).slice(0, 3)

  const addonBadges = [
    { flag: 'hasBooking',  label: 'Reservasi Online' },
    { flag: 'hasWhatsApp', label: 'Notif WA' },
    { flag: 'hasSEO',      label: 'SEO Ready' },
    { flag: 'hasPayment',  label: 'Bayar Online' },
  ].filter(b => features?.[b.flag as keyof FeatureFlags])

  return (
    <section style={{ backgroundColor: BG, minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
      <div className="max-w-6xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: BLUE_LT, color: BLUE_D }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: GREEN, display: 'inline-block' }} />
            Klinik Terakreditasi
          </div>
          <h1 className="font-extrabold leading-tight mb-5"
            style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', color: DARK, letterSpacing: '-0.02em' }}>
            {nama}
          </h1>
          <p className="text-lg leading-relaxed mb-8 font-normal" style={{ color: MUTED }}>
            {tagline}
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {wa && (
              <a href={`https://wa.me/${wa}?text=Halo, saya ingin reservasi`} target="_blank"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: BLUE, color: WHITE, boxShadow: `0 4px 16px ${BLUE}40` }}>
                Reservasi Online →
              </a>
            )}
            <a href="#dokter"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all"
              style={{ border: `1.5px solid ${BORDER}`, color: DARK }}>
              Lihat Dokter
            </a>
          </div>
          {addonBadges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {addonBadges.map(b => (
                <span key={b.label} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: BLUE_LT, color: BLUE_D }}>
                  ✓ {b.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right — jadwal card, clean white */}
        <div id="dokter" className="hidden lg:block">
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}`, boxShadow: '0 4px 24px rgba(0,0,0,.06)' }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: BLUE, color: WHITE }}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Jadwal Dokter</p>
                <p className="text-sm font-semibold mt-0.5">{jam.split(',')[0]}</p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M8 2v4M16 2v4M3 10h18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div style={{ backgroundColor: WHITE }}>
              {(dokterList.length > 0 ? dokterList : [
                { nama: 'dr. Spesialis Umum', spesialis: 'Dokter Umum', jadwal: '08:00–14:00' },
              ]).map((d: Isi, i: number) => (
                <div key={i} className="flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: i < dokterList.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{ backgroundColor: BLUE_LT, color: BLUE }}>
                      {(d.nama ?? 'D')[3] ?? 'D'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: DARK }}>{d.nama ?? d.name}</p>
                      <p className="text-xs" style={{ color: MUTED }}>{d.spesialis ?? d.sp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: DARK }}>{d.jadwal ?? d.jam}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>Tersedia</span>
                  </div>
                </div>
              ))}
            </div>
            {wa && (
              <div className="px-6 py-4" style={{ backgroundColor: BG, borderTop: `1px solid ${BORDER}` }}>
                <a href={`https://wa.me/${wa}?text=Halo, saya ingin booking dokter`} target="_blank"
                  className="block text-center text-sm font-semibold py-2.5 rounded-xl transition-all hover:opacity-90"
                  style={{ backgroundColor: BLUE, color: WHITE }}>
                  Booking Sekarang
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Stats — clean horizontal ──────────────────────────────────
function Stats({ konten }: { konten?: Isi }) {
  const dokterCount = asArray(konten?.dokter).length || 3
  const fasCount = asArray(konten?.fasilitas).length || 4
  const asuransiCount = asArray(konten?.asuransi_diterima).length || 4
  const items = [
    { v: `${dokterCount}`, l: 'Dokter Spesialis' },
    { v: `${fasCount}+`, l: 'Fasilitas Medis' },
    { v: `${asuransiCount}+`, l: 'Asuransi Diterima' },
    { v: '4.9', l: 'Rating Google ★' },
  ]
  return (
    <div style={{ backgroundColor: WHITE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {items.map(s => (
          <div key={s.l}>
            <p className="text-3xl font-extrabold" style={{ color: BLUE, letterSpacing: '-0.02em' }}>{s.v}</p>
            <p className="text-xs font-medium mt-1 uppercase tracking-wider" style={{ color: MUTED }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Layanan dari services ──────────────────────────────────────
function Layanan({ services }: { services?: Service[] }) {
  const items = services && services.length > 0
    ? services
    : [
        { nama: 'Konsultasi Umum', deskripsi: 'Pemeriksaan kesehatan menyeluruh oleh dokter berpengalaman.', kategori: 'Umum' },
        { nama: 'Poli Spesialis', deskripsi: 'Dokter spesialis tersedia setiap hari kerja.', kategori: 'Spesialis' },
        { nama: 'Reservasi Online', deskripsi: 'Booking jadwal dari rumah, tanpa antre di klinik.', kategori: 'Digital' },
      ]
  return (
    <section id="layanan" style={{ backgroundColor: BG }}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: BLUE }}>Layanan Kami</p>
          <h2 className="font-extrabold" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: DARK, letterSpacing: '-0.02em' }}>
            Perawatan Lengkap di Satu Tempat
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.slice(0, 6).map((s: any, i: number) => (
            <div key={i} className="group p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-md"
              style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: BLUE_LT, color: BLUE }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: DARK }}>{s.nama}</h3>
              <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{s.deskripsi ?? ''}</p>
              {s.harga > 0 && (
                <p className="mt-3 text-xs font-semibold" style={{ color: BLUE }}>
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

// ── Keunggulan ────────────────────────────────────────────────
function Keunggulan({ konten }: { konten?: Isi }) {
  const items = asArray(konten?.keunggulan).filter((k: string) => k?.trim())
  if (items.length === 0) return null
  return (
    <section style={{ backgroundColor: BLUE }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-extrabold text-white" style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '-0.02em' }}>
            Kenapa Pilih Kami?
          </h2>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)` }}>
          {items.map((k: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-5 rounded-2xl"
              style={{ backgroundColor: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: 'rgba(255,255,255,.25)' }}>
                <span style={{ color: WHITE, fontSize: 12, fontWeight: 700 }}>✓</span>
              </div>
              <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,.9)' }}>{k}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Asuransi & Fasilitas ──────────────────────────────────────
function FasilitasAsuransi({ konten }: { konten?: Isi }) {
  const fasilitas = asArray(konten?.fasilitas)
  const asuransi = asArray(konten?.asuransi_diterima)
  if (!fasilitas.length && !asuransi.length) return null
  return (
    <section style={{ backgroundColor: WHITE, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {fasilitas.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: BLUE }}>Fasilitas</p>
            <div className="flex flex-wrap gap-2">
              {fasilitas.map((f: string, i: number) => (
                <span key={i} className="text-sm font-medium px-4 py-2 rounded-full"
                  style={{ backgroundColor: BLUE_LT, color: BLUE_D }}>{f}</span>
              ))}
            </div>
          </div>
        )}
        {asuransi.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: BLUE }}>Asuransi Diterima</p>
            <div className="flex flex-wrap gap-2">
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

// ── CTA ───────────────────────────────────────────────────────
function CTA({ wa }: { wa?: string }) {
  return (
    <section style={{ backgroundColor: DARK }}>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-extrabold mb-4 text-white" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', letterSpacing: '-0.02em' }}>
          Jadwalkan Konsultasi Hari Ini
        </h2>
        <p className="text-base mb-8 font-normal" style={{ color: 'rgba(255,255,255,.6)' }}>
          Pilih dokter, pilih jadwal, konfirmasi via WhatsApp. Mudah dan cepat.
        </p>
        {wa && (
          <a href={`https://wa.me/${wa}?text=Halo, saya ingin buat janji konsultasi`} target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: BLUE, color: WHITE, boxShadow: `0 4px 20px ${BLUE}40` }}>
            Reservasi via WhatsApp →
          </a>
        )}
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer({ nama, profile }: { nama: string; profile?: TenantProfile | null }) {
  return (
    <footer style={{ backgroundColor: '#0F172A', color: 'rgba(255,255,255,.5)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p className="font-medium text-white">{nama}</p>
        <div className="flex flex-wrap gap-6 text-xs">
          {profile?.alamat && <span>📍 {profile.alamat}</span>}
          {profile?.jam && <span>🕐 {profile.jam}</span>}
          {profile?.wa && <span>📱 +{profile.wa}</span>}
        </div>
        <p className="text-xs">
          © {new Date().getFullYear()} {nama} · Dibuat dengan{' '}
          <a href="https://japanarena.com" style={{ color: BLUE }}>Japan Arena</a>
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
    <div className={sans.variable} style={{ backgroundColor: BG, fontFamily: 'var(--font-klinik-clean), system-ui' }}>
      <Navbar nama={nama} wa={waContact} />
      <main>
        <Hero konten={k} wa={waContact} features={features} />
        <Stats konten={k} />
        <Layanan services={services} />
        <Keunggulan konten={k} />
        <FasilitasAsuransi konten={k} />
        <CTA wa={waContact} />
      </main>
      <Footer nama={nama} profile={profile} />
      <FloatingWA wa={waContact} />
    </div>
  )
}
