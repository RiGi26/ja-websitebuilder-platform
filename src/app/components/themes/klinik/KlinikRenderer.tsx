// ============================================================
// Tema "klinik" — Warm Sanctuary.
// Palet sage-green + terracotta + warm-cream. Tipografi DM Serif Display
// & Outfit. Bukan klinik pemerintah yang dingin — tapi wellness premium.
// Add-on yang ditonjolkan: clinic-res, queue, doc-sched, wa-auto, seo.
// ============================================================

import { DM_Serif_Display, Outfit } from 'next/font/google'
import type { PageSection, Service, TenantProfile } from '@/types/websitebuilder'

const serif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-klinik-serif',
})
const sans = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-klinik-sans',
})

// ── Palette ──────────────────────────────────────────────────
const SAGE    = '#2D6A4F'
const SAGE_LT = '#52B788'
const CREAM   = '#FEFDF8'
const SURFACE = '#F0EBE3'
const TERRA   = '#C67B5C'
const DARK    = '#1A2E26'
const MUTED   = '#6B7C75'
const GOLD    = '#B7956A'

type Isi = Record<string, any>
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : [] }

// ── Leaf SVG ornament ─────────────────────────────────────────
function Leaf({ color = SAGE_LT, size = 20 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 4 8 4 15a8 8 0 0016 0C20 8 12 2 12 2z" fill={color} opacity={0.9}/>
      <path d="M12 2v20" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
    </svg>
  )
}

// ── Floating WA Button ────────────────────────────────────────
function FloatingWA({ wa }: { wa?: string }) {
  if (!wa) return null
  return (
    <a
      href={`https://wa.me/${wa}?text=Halo, saya ingin buat janji konsultasi`}
      target="_blank"
      aria-label="Chat WhatsApp"
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 999,
        width: 56, height: 56, borderRadius: '50%',
        backgroundColor: '#25D366', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.492a.5.5 0 00.618.618l5.647-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.917 0-3.71-.504-5.263-1.385l-.378-.217-3.922 1.027 1.027-3.922-.217-.378A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    </a>
  )
}

// ── Navbar ────────────────────────────────────────────────────
function Navbar({ nama, wa }: { nama: string; wa?: string }) {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: `${CREAM}e8`, borderBottom: `1px solid ${SAGE}18` }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf size={22} />
          <span className={`${serif.className} text-xl tracking-wide`} style={{ color: DARK }}>
            {nama}
          </span>
        </div>
        <nav className={`hidden md:flex items-center gap-8 text-[12px] font-semibold uppercase tracking-[0.15em] ${sans.className}`} style={{ color: MUTED }}>
          <a href="#layanan" className="hover:text-sage transition-colors" style={{ '--sage': SAGE } as any}>Layanan</a>
          <a href="#jadwal" className="hover:text-sage transition-colors">Jadwal</a>
          <a href="#testimoni" className="hover:text-sage transition-colors">Testimoni</a>
          <a href="#kontak" className="hover:text-sage transition-colors">Kontak</a>
        </nav>
        {wa && (
          <a
            href={`https://wa.me/${wa}?text=Halo, saya ingin buat janji`}
            target="_blank"
            className={`text-[12px] font-bold px-5 py-2.5 rounded-full transition-all hover:opacity-90 ${sans.className}`}
            style={{ backgroundColor: SAGE, color: CREAM, letterSpacing: '0.08em' }}
          >
            Buat Janji
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero({ isi, wa }: { isi: Isi; wa?: string }) {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ backgroundColor: DARK }}
    >
      {/* Background image */}
      {isi.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={isi.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.22 }} />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(105deg, ${DARK} 45%, ${SAGE}60 100%)` }} />
      {/* Leaf texture top-right */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 70% 30%, ${SAGE_LT}, transparent 60%)`,
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left copy */}
        <div>
          {isi.eyebrow && (
            <div className={`inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.25em] ${sans.className}`}
              style={{ border: `1px solid ${SAGE_LT}50`, color: SAGE_LT }}>
              <Leaf size={14} color={SAGE_LT} />
              {isi.eyebrow}
            </div>
          )}
          <h1 className={`${serif.className} leading-[1.1] mb-6`}
            style={{ fontSize: 'clamp(2.8rem,6vw,4.5rem)', color: CREAM }}>
            {isi.title ?? 'Kesehatan Anda,\nPrioritas Kami'}
          </h1>
          <p className={`text-lg leading-relaxed mb-10 max-w-lg ${sans.className}`} style={{ color: '#B8CCC4', fontWeight: 300 }}>
            {isi.subtitle ?? 'Layanan kesehatan modern dengan sentuhan personal. Konsultasi dengan dokter berpengalaman dalam suasana yang nyaman dan bersahabat.'}
          </p>
          <div className="flex flex-wrap gap-4">
            {wa && (
              <a href={`https://wa.me/${wa}?text=Halo, saya ingin reservasi`} target="_blank"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 ${sans.className}`}
                style={{ backgroundColor: TERRA, color: CREAM, boxShadow: `0 8px 24px ${TERRA}40` }}>
                Reservasi Online →
              </a>
            )}
            <a href="#layanan"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 ${sans.className}`}
              style={{ border: `1px solid ${CREAM}30`, color: CREAM, backdropFilter: 'blur(8px)' }}>
              Lihat Layanan
            </a>
          </div>
          {/* Addon badges */}
          <div className="flex flex-wrap gap-3 mt-10">
            {['Reservasi Online', 'Antrian Digital', 'Jadwal Dokter', 'Notif WA Otomatis'].map(b => (
              <span key={b} className={`text-[10px] font-semibold px-3 py-1 rounded-full ${sans.className}`}
                style={{ backgroundColor: `${SAGE_LT}15`, color: SAGE_LT, border: `1px solid ${SAGE_LT}30` }}>
                ✓ {b}
              </span>
            ))}
          </div>
        </div>
        {/* Right — schedule card mock */}
        <div id="jadwal" className="hidden lg:block">
          <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: `${CREAM}0D`, border: `1px solid ${SAGE_LT}20`, backdropFilter: 'blur(16px)' }}>
            <div className="px-6 pt-6 pb-3 border-b" style={{ borderColor: `${SAGE_LT}15` }}>
              <p className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-1 ${sans.className}`} style={{ color: SAGE_LT }}>Jadwal Dokter Hari Ini</p>
              <p className={`text-[11px] ${sans.className}`} style={{ color: '#8AADA0' }}>Senin — Sabtu, 08.00 – 20.00</p>
            </div>
            {[
              { name: 'dr. Amelia Kusuma', sp: 'Sp. Penyakit Dalam', jam: '08:00 – 12:00', tersedia: true },
              { name: 'dr. Reza Pratama', sp: 'Sp. Kulit & Kelamin', jam: '13:00 – 17:00', tersedia: true },
              { name: 'dr. Nadia Sari', sp: 'Sp. Gizi Klinik', jam: '09:00 – 14:00', tersedia: false },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 border-b last:border-0" style={{ borderColor: `${SAGE_LT}10` }}>
                <div>
                  <p className={`text-sm font-semibold ${sans.className}`} style={{ color: CREAM }}>{d.name}</p>
                  <p className={`text-[11px] ${sans.className}`} style={{ color: '#7A9E94' }}>{d.sp}</p>
                  <p className={`text-[10px] mt-0.5 ${sans.className}`} style={{ color: '#5A7A70' }}>{d.jam}</p>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${sans.className}`}
                  style={{ backgroundColor: d.tersedia ? `${SAGE_LT}20` : `${TERRA}15`, color: d.tersedia ? SAGE_LT : TERRA }}>
                  {d.tersedia ? 'Tersedia' : 'Penuh'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Stats Bar ─────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { v: '12+', l: 'Tahun Pengalaman' },
    { v: '8', l: 'Dokter Spesialis' },
    { v: '15rb+', l: 'Pasien Ditangani' },
    { v: '4.9★', l: 'Rating Google' },
  ]
  return (
    <div style={{ backgroundColor: SAGE }} className="py-8">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map(s => (
          <div key={s.l}>
            <p className={`text-3xl font-bold ${sans.className}`} style={{ color: CREAM }}>{s.v}</p>
            <p className={`text-[11px] font-medium uppercase tracking-widest mt-1 ${sans.className}`} style={{ color: `${CREAM}80` }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Features / Layanan ────────────────────────────────────────
function Features({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.fitur)
  const icons = [
    <svg key="a" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/></svg>,
    <svg key="b" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2a5 5 0 100 10A5 5 0 0012 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" fill="currentColor"/></svg>,
    <svg key="c" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  ]
  return (
    <section id="layanan" style={{ backgroundColor: CREAM }}>
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className={`text-[11px] font-bold uppercase tracking-[0.3em] mb-3 ${sans.className}`} style={{ color: TERRA }}>Layanan Kami</p>
          <h2 className={`${serif.className} leading-tight`} style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: DARK }}>
            {isi.title ?? 'Perawatan Lengkap\ndi Satu Tempat'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(items.length ? items : [
            { title: 'Konsultasi Dokter Umum', desc: 'Pemeriksaan kesehatan umum, diagnosa awal, dan rujukan spesialis bila diperlukan.' },
            { title: 'Poli Spesialis', desc: 'Dokter spesialis kulit, penyakit dalam, gizi, dan anak tersedia setiap hari kerja.' },
            { title: 'Reservasi & Antrian Online', desc: 'Booking jadwal dari rumah, ambil nomor antrian digital, tidak perlu menunggu lama.' },
          ]).map((it: Isi, i: number) => (
            <div key={i}
              className="group p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: SURFACE, border: `1px solid ${SAGE}12` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors"
                style={{ backgroundColor: `${SAGE}18`, color: SAGE }}>
                {icons[i % icons.length]}
              </div>
              <h3 className={`text-lg font-semibold mb-3 ${sans.className}`} style={{ color: DARK }}>
                {it.title ?? it.judul ?? `Layanan ${i + 1}`}
              </h3>
              <p className={`text-sm leading-relaxed ${sans.className}`} style={{ color: MUTED }}>
                {it.desc ?? it.deskripsi ?? ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Booking CTA ───────────────────────────────────────────────
function BookingCta({ wa }: { wa?: string }) {
  return (
    <section className="relative overflow-hidden py-24" style={{ backgroundColor: TERRA }}>
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(ellipse 60% 80% at 90% 50%, ${CREAM}, transparent)`,
      }} />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <Leaf size={32} color={`${CREAM}80`} />
        <h2 className={`${serif.className} mt-4 mb-4`} style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: CREAM }}>
          Konsultasi Lebih Mudah dengan Reservasi Online
        </h2>
        <p className={`text-lg mb-8 max-w-xl mx-auto ${sans.className}`} style={{ color: `${CREAM}CC`, fontWeight: 300 }}>
          Pilih dokter, pilih jadwal, konfirmasi via WA — semua dari HP Anda. Tanpa antre panjang di meja resepsionis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {wa && (
            <a href={`https://wa.me/${wa}?text=Halo, saya ingin buat janji konsultasi`} target="_blank"
              className={`px-8 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 ${sans.className}`}
              style={{ backgroundColor: DARK, color: CREAM }}>
              Buat Janji via WA →
            </a>
          )}
          <a href="#jadwal"
            className={`px-8 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 ${sans.className}`}
            style={{ border: `2px solid ${CREAM}60`, color: CREAM }}>
            Lihat Jadwal Dokter
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────
function Testimonials({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.testimoni)
  const fallback = [
    { quote: 'Dokternya sabar dan penjelasannya mudah dimengerti. Reservasi online sangat membantu, tidak perlu antre lama.', name: 'Ibu Ratna S.', kota: 'Jakarta Selatan' },
    { quote: 'Pertama kali ke klinik ini langsung nyaman. Fasilitasnya bersih, stafnya ramah, dan sistem antriannya rapi.', name: 'Bapak Hendri W.', kota: 'Depok' },
  ]
  const data = items.length ? items : fallback
  return (
    <section id="testimoni" style={{ backgroundColor: SURFACE }}>
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className={`text-[11px] font-bold uppercase tracking-[0.3em] mb-3 ${sans.className}`} style={{ color: TERRA }}>Kata Pasien Kami</p>
          <h2 className={`${serif.className}`} style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: DARK }}>
            {isi.title ?? 'Kepercayaan yang Kami Jaga'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((it: Isi, i: number) => (
            <blockquote key={i} className="p-8 rounded-3xl" style={{ backgroundColor: CREAM, border: `1px solid ${SAGE}14` }}>
              <p className={`${serif.className} italic text-lg leading-relaxed mb-6`} style={{ color: DARK }}>
                "{it.quote ?? it.isi ?? ''}"
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: `${SAGE}20`, color: SAGE }}>
                  {(it.name ?? it.nama ?? 'P')[0]}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${sans.className}`} style={{ color: DARK }}>{it.name ?? it.nama}</p>
                  <p className={`text-[11px] ${sans.className}`} style={{ color: MUTED }}>{it.kota ?? ''}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────
function Contact({ isi, profile }: { isi: Isi; profile?: TenantProfile | null }) {
  const wa = profile?.wa ?? isi.wa
  const alamat = profile?.alamat ?? isi.alamat
  const jam = profile?.jam ?? isi.jam
  return (
    <section id="kontak" style={{ backgroundColor: CREAM, borderTop: `1px solid ${SAGE}12` }}>
      <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-[0.3em] mb-3 ${sans.className}`} style={{ color: TERRA }}>Hubungi Kami</p>
          <h2 className={`${serif.className} mb-6`} style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: DARK }}>
            {isi.title ?? 'Siap Membantu\nKesehatan Anda'}
          </h2>
          {isi.deskripsi && <p className={`text-sm leading-relaxed mb-8 ${sans.className}`} style={{ color: MUTED }}>{isi.deskripsi}</p>}
          <div className={`space-y-4 text-sm ${sans.className}`} style={{ color: MUTED }}>
            {alamat && <p className="flex gap-3"><span style={{ color: SAGE }}>📍</span>{alamat}</p>}
            {jam && <p className="flex gap-3 whitespace-pre-wrap"><span style={{ color: SAGE }}>🕐</span>{jam}</p>}
            {wa && <p className="flex gap-3"><span style={{ color: SAGE }}>📱</span>+{wa}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {wa && (
            <a href={`https://wa.me/${wa}?text=Halo, saya ingin reservasi`} target="_blank"
              className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${sans.className}`}
              style={{ backgroundColor: SAGE, color: CREAM }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              </svg>
              Reservasi via WhatsApp
            </a>
          )}
          <div className="p-6 rounded-2xl" style={{ backgroundColor: SURFACE, border: `1px solid ${SAGE}15` }}>
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-4 ${sans.className}`} style={{ color: SAGE }}>Fitur Add-On Aktif</p>
            {[
              { label: 'Reservasi Online', desc: 'Booking jadwal dari HP' },
              { label: 'Antrian Digital', desc: 'Tidak perlu antre di klinik' },
              { label: 'Notif WA Otomatis', desc: 'Konfirmasi & reminder jadwal' },
              { label: 'Jadwal Dokter Live', desc: 'Ketersediaan real-time' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3 mb-3">
                <span style={{ color: SAGE_LT, marginTop: 2 }}>✓</span>
                <div>
                  <p className={`text-sm font-semibold ${sans.className}`} style={{ color: DARK }}>{f.label}</p>
                  <p className={`text-[11px] ${sans.className}`} style={{ color: MUTED }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer({ nama }: { nama: string }) {
  return (
    <footer className="py-10 text-center" style={{ backgroundColor: DARK }}>
      <div className="flex justify-center mb-3"><Leaf size={20} color={`${SAGE_LT}60`} /></div>
      <p className={`${serif.className} italic text-sm`} style={{ color: `${CREAM}50` }}>
        © {new Date().getFullYear()} {nama} — Kesehatan adalah investasi terbaik
      </p>
    </footer>
  )
}

// ── Root Renderer ─────────────────────────────────────────────
export default function KlinikRenderer({
  nama, sections, services = [], profile = null, wa, primary,
}: {
  nama: string
  sections: PageSection[]
  services?: Service[]
  profile?: TenantProfile | null
  wa?: string
  slug?: string
  primary?: string
}) {
  const waContact = wa ?? profile?.wa ?? undefined
  const visible = [...sections].filter(s => s.is_visible).sort((a, b) => a.urutan - b.urutan)

  const renderSection = (s: PageSection) => {
    const isi = (s.isi_komponen ?? {}) as Isi
    switch (s.tipe_komponen) {
      case 'hero_banner':  return <Hero key={s.id} isi={isi} wa={waContact} />
      case 'features':     return <Features key={s.id} isi={isi} />
      case 'testimonials': return <Testimonials key={s.id} isi={isi} />
      case 'cta':          return <BookingCta key={s.id} wa={waContact} />
      case 'contact_form': return <Contact key={s.id} isi={isi} profile={profile} />
      default:             return null
    }
  }

  return (
    <div className={`${serif.variable} ${sans.variable}`} style={{ backgroundColor: CREAM }}>
      <Navbar nama={nama} wa={waContact} />
      <main>
        {visible.length === 0 ? (
          <>
            <Hero isi={{ title: nama }} wa={waContact} />
            <StatsBar />
            <Features isi={{}} />
            <BookingCta wa={waContact} />
            <Testimonials isi={{}} />
            <Contact isi={{}} profile={profile} />
          </>
        ) : (
          <>
            {visible.map(renderSection)}
            <StatsBar />
          </>
        )}
      </main>
      <Footer nama={nama} />
      <FloatingWA wa={waContact} />
    </div>
  )
}
