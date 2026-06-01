// ============================================================
// Tema "sekolah" — Academic Heritage.
// Palet cream + deep burgundy + warm amber. Playfair Display + Lato.
// Bukan website sekolah negeri biasa — tapi lembaga pendidikan
// premium yang menjual kualitas dan kepercayaan.
// Add-on: ppdb, portal-siswa, absensi, cert, wa-auto, admin-dash.
// ============================================================

import { Playfair_Display, Lato } from 'next/font/google'
import type { PageSection, Service, TenantProfile } from '@/types/websitebuilder'

const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-sk-serif',
})
const sans = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  variable: '--font-sk-sans',
})

// ── Palette ──────────────────────────────────────────────────
const MAROON  = '#7B2D3E'
const MAROON_D= '#5A1F2C'
const CREAM   = '#FFFBF0'
const PARCHM  = '#FEF3DC'
const AMBER   = '#D4860A'
const AMBER_L = '#F0A830'
const FOREST  = '#2C4A2E'
const DARK    = '#1A0A0E'
const MUTED   = '#7A6B5A'
const SOFT    = '#EDE4D4'

type Isi = Record<string, any>
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : [] }

// ── Crest SVG ornament ────────────────────────────────────────
function Crest({ size = 32, color = AMBER }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3l3 8h8l-6.5 5 2.5 8L20 19l-7 5 2.5-8L9 11h8z" fill={color} opacity={0.85}/>
      <path d="M10 28h20M12 32h16" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity={0.5}/>
    </svg>
  )
}

// ── Divider ───────────────────────────────────────────────────
function Divider({ color = AMBER }: { color?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <div style={{ width: 48, height: 1, backgroundColor: color, opacity: 0.35 }} />
      <Crest size={16} color={color} />
      <div style={{ width: 48, height: 1, backgroundColor: color, opacity: 0.35 }} />
    </div>
  )
}

// ── Floating WA ───────────────────────────────────────────────
function FloatingWA({ wa }: { wa?: string }) {
  if (!wa) return null
  return (
    <a href={`https://wa.me/${wa}`} target="_blank" aria-label="WhatsApp"
      style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 999, width: 52, height: 52, borderRadius: '50%', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.492a.5.5 0 00.618.618l5.647-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.917 0-3.71-.504-5.263-1.385l-.378-.217-3.922 1.027 1.027-3.922-.217-.378A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    </a>
  )
}

// ── Navbar ────────────────────────────────────────────────────
function Navbar({ nama, wa }: { nama: string; wa?: string }) {
  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: MAROON, borderBottom: `2px solid ${AMBER}40` }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crest size={28} color={AMBER_L} />
          <span className={`${serif.className} text-xl font-600 tracking-wide`} style={{ color: PARCHM }}>{nama}</span>
        </div>
        <nav className={`hidden md:flex items-center gap-8 text-[11px] font-700 uppercase tracking-[0.18em] ${sans.className}`} style={{ color: `${PARCHM}80` }}>
          {['Program', 'PPDB', 'Fasilitas', 'Kontak'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:opacity-100 transition-opacity">{l}</a>
          ))}
        </nav>
        {wa && (
          <a href={`https://wa.me/${wa}?text=Halo, saya ingin info PPDB`} target="_blank"
            className={`text-[11px] font-700 uppercase tracking-[0.15em] px-5 py-2.5 rounded transition-all hover:opacity-90 ${sans.className}`}
            style={{ backgroundColor: AMBER, color: DARK }}>
            Info PPDB
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero({ isi, wa }: { isi: Isi; wa?: string }) {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ backgroundColor: MAROON_D }}>
      {/* Image */}
      {isi.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={isi.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.2 }} />
      )}
      {/* Gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${MAROON_D} 40%, ${MAROON} 70%, ${FOREST}80 100%)` }} />
      {/* Amber radial */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-20" style={{ background: `radial-gradient(ellipse 60% 60% at 100% 100%, ${AMBER}, transparent)` }} />
      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${AMBER_L} 0, ${AMBER_L} 1px, transparent 0, transparent 50%)`, backgroundSize: '24px 24px' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="mb-8">
            <Crest size={48} color={AMBER_L} />
          </div>
          {isi.eyebrow && (
            <p className={`text-[11px] font-700 uppercase tracking-[0.35em] mb-4 ${sans.className}`} style={{ color: AMBER_L }}>
              {isi.eyebrow}
            </p>
          )}
          <h1 className={`${serif.className} font-800 leading-[1.1] mb-6`}
            style={{ fontSize: 'clamp(2.5rem,5.5vw,4.5rem)', color: PARCHM }}>
            {isi.title ?? 'Membentuk\nGenerasi Unggul\nBerdaya Saing'}
          </h1>
          <Divider color={`${AMBER}60`} />
          <p className={`text-base leading-relaxed mt-6 mb-10 max-w-md ${sans.className}`} style={{ color: `${PARCHM}B0`, fontWeight: 300 }}>
            {isi.subtitle ?? 'Lembaga pendidikan dengan kurikulum terstruktur, pengajar berpengalaman, dan fasilitas yang mendukung potensi maksimal setiap peserta didik.'}
          </p>
          <div className="flex flex-wrap gap-4">
            {wa && (
              <a href={`https://wa.me/${wa}?text=Halo, saya ingin informasi PPDB`} target="_blank"
                className={`px-8 py-4 font-700 text-sm uppercase tracking-[0.12em] rounded transition-all hover:-translate-y-0.5 ${sans.className}`}
                style={{ backgroundColor: AMBER, color: DARK, boxShadow: `0 8px 24px ${AMBER}40` }}>
                Daftar PPDB Online
              </a>
            )}
            <a href="#program"
              className={`px-8 py-4 font-700 text-sm uppercase tracking-[0.12em] rounded transition-all hover:-translate-y-0.5 ${sans.className}`}
              style={{ border: `1px solid ${PARCHM}30`, color: PARCHM }}>
              Lihat Program
            </a>
          </div>
          {/* Addon badges */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['PPDB Online', 'Portal Siswa', 'Sertifikat Digital', 'Absensi Online', 'Notif WA Otomatis'].map(b => (
              <span key={b} className={`text-[10px] font-700 px-3 py-1 ${sans.className}`}
                style={{ border: `1px solid ${AMBER}40`, color: `${AMBER_L}`, backgroundColor: `${AMBER}10` }}>
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        {/* Right — stats cards */}
        <div className="hidden lg:grid grid-cols-2 gap-4">
          {[
            { v: '15+', l: 'Tahun Berdiri', icon: '🏛️' },
            { v: '2.400+', l: 'Alumni Sukses', icon: '🎓' },
            { v: '98%', l: 'Tingkat Kelulusan', icon: '📋' },
            { v: '40+', l: 'Pengajar Bersertifikat', icon: '👩‍🏫' },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-2xl text-center" style={{ backgroundColor: `${PARCHM}0C`, border: `1px solid ${AMBER}20`, backdropFilter: 'blur(12px)' }}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className={`${serif.className} text-3xl font-700 mb-1`} style={{ color: AMBER_L }}>{s.v}</p>
              <p className={`text-[11px] font-700 uppercase tracking-wider ${sans.className}`} style={{ color: `${PARCHM}70` }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Features / Program Unggulan ───────────────────────────────
function Features({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.fitur)
  const fallback = [
    { title: 'Kurikulum Terstruktur', desc: 'Materi disusun progresif dari dasar hingga mahir, dirancang bersama praktisi industri dan akademisi berpengalaman.' },
    { title: 'Pengajar Bersertifikat', desc: 'Setiap pengajar telah tersertifikasi dan menjalani pelatihan reguler untuk memastikan kualitas pengajaran terkini.' },
    { title: 'Sertifikat Diakui', desc: 'Sertifikat kelulusan kami diakui oleh mitra industri dan institusi terkait sebagai bukti kompetensi peserta didik.' },
  ]
  const data = items.length ? items : fallback
  return (
    <section id="program" style={{ backgroundColor: CREAM }}>
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className={`text-[11px] font-700 uppercase tracking-[0.35em] mb-3 ${sans.className}`} style={{ color: AMBER }}>Keunggulan Kami</p>
          <h2 className={`${serif.className} font-700 leading-tight`} style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: MAROON }}>
            {isi.title ?? 'Mengapa Memilih Kami?'}
          </h2>
          <Divider />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((it: Isi, i: number) => (
            <div key={i} className="group p-8 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: PARCHM, border: `1px solid ${AMBER}18` }}>
              <div className="mb-6">
                <Crest size={28} color={AMBER} />
              </div>
              <h3 className={`${serif.className} text-xl font-600 mb-3`} style={{ color: MAROON_D }}>
                {it.title ?? it.judul ?? `Keunggulan ${i + 1}`}
              </h3>
              <p className={`text-sm leading-relaxed ${sans.className}`} style={{ color: MUTED }}>
                {it.desc ?? it.deskripsi ?? ''}
              </p>
              <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${AMBER}20` }}>
                <div style={{ width: 24, height: 2, backgroundColor: AMBER, borderRadius: 1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PPDB CTA ──────────────────────────────────────────────────
function PpdbCta({ wa }: { wa?: string }) {
  return (
    <section id="ppdb" className="relative overflow-hidden py-24" style={{ backgroundColor: MAROON }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${AMBER_L} 0, ${AMBER_L} 1px, transparent 0, transparent 50%)`, backgroundSize: '24px 24px' }} />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className={`text-[11px] font-700 uppercase tracking-[0.35em] mb-4 ${sans.className}`} style={{ color: AMBER_L }}>Penerimaan Peserta Didik Baru</p>
            <h2 className={`${serif.className} font-700 leading-tight mb-6`} style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: PARCHM }}>
              Pendaftaran PPDB<br />Kini Bisa Online
            </h2>
            <p className={`text-base leading-relaxed mb-8 ${sans.className}`} style={{ color: `${PARCHM}B0`, fontWeight: 300 }}>
              Daftar dari rumah, upload berkas digital, pantau status pendaftaran secara real-time. Tidak perlu datang ke kantor.
            </p>
            {wa && (
              <a href={`https://wa.me/${wa}?text=Halo, saya ingin daftar PPDB online`} target="_blank"
                className={`inline-flex items-center gap-2 px-8 py-4 font-700 text-sm uppercase tracking-[0.12em] rounded transition-all hover:-translate-y-0.5 ${sans.className}`}
                style={{ backgroundColor: AMBER, color: DARK }}>
                Daftar Sekarang →
              </a>
            )}
          </div>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Isi Formulir Online', desc: 'Lengkapi data diri dan unggah dokumen yang diperlukan' },
              { step: '02', title: 'Verifikasi & Seleksi', desc: 'Tim kami verifikasi berkas dan hubungi via WA untuk konfirmasi' },
              { step: '03', title: 'Pengumuman & Orientasi', desc: 'Terima hasil seleksi dan jadwal orientasi siswa baru' },
            ].map(s => (
              <div key={s.step} className="flex gap-5 p-5 rounded-xl" style={{ backgroundColor: `${PARCHM}08`, border: `1px solid ${AMBER}20` }}>
                <span className={`${serif.className} text-3xl font-700 shrink-0`} style={{ color: `${AMBER}50` }}>{s.step}</span>
                <div>
                  <p className={`font-700 text-sm mb-1 ${sans.className}`} style={{ color: PARCHM }}>{s.title}</p>
                  <p className={`text-[12px] ${sans.className}`} style={{ color: `${PARCHM}70` }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────
function Testimonials({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.testimoni)
  const fallback = [
    { quote: 'Anak saya sangat berkembang setelah bergabung. Pengajarnya sabar, kurikulumnya terstruktur, dan sertifikatnya diakui oleh tempat kerjanya.', name: 'Ibu Sari W.', peran: 'Orang Tua Siswa' },
    { quote: 'Sistem PPDB online memudahkan proses pendaftaran. Tidak perlu antre panjang, semua bisa dari HP. Sangat modern dan profesional.', name: 'Bapak Ahmad F.', peran: 'Wali Murid Angkatan 2024' },
  ]
  const data = items.length ? items : fallback
  return (
    <section style={{ backgroundColor: SOFT }}>
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className={`text-[11px] font-700 uppercase tracking-[0.35em] mb-3 ${sans.className}`} style={{ color: AMBER }}>Testimoni</p>
          <h2 className={`${serif.className} font-700`} style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: MAROON }}>
            {isi.title ?? 'Kata Mereka'}
          </h2>
          <Divider />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((it: Isi, i: number) => (
            <blockquote key={i} className="p-8 rounded-2xl" style={{ backgroundColor: CREAM, border: `1px solid ${AMBER}18` }}>
              <div className={`${serif.className} text-4xl leading-none mb-4`} style={{ color: AMBER, opacity: 0.3 }}>"</div>
              <p className={`${serif.className} italic text-lg leading-relaxed mb-6`} style={{ color: DARK }}>
                {it.quote ?? it.isi ?? ''}
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: `${MAROON}15`, color: MAROON }}>
                  {(it.name ?? it.nama ?? 'A')[0]}
                </div>
                <div>
                  <p className={`text-sm font-700 ${sans.className}`} style={{ color: MAROON_D }}>{it.name ?? it.nama}</p>
                  <p className={`text-[11px] ${sans.className}`} style={{ color: MUTED }}>{it.peran ?? it.posisi ?? ''}</p>
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
    <section id="kontak" style={{ backgroundColor: CREAM, borderTop: `1px solid ${AMBER}18` }}>
      <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <p className={`text-[11px] font-700 uppercase tracking-[0.35em] mb-3 ${sans.className}`} style={{ color: AMBER }}>Hubungi Kami</p>
          <h2 className={`${serif.className} font-700 mb-6`} style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: MAROON }}>
            {isi.title ?? 'Kami Siap\nMenjawab Pertanyaan Anda'}
          </h2>
          <Divider />
          <div className={`space-y-4 text-sm mt-6 ${sans.className}`} style={{ color: MUTED }}>
            {alamat && <p className="flex gap-3"><span style={{ color: AMBER }}>📍</span>{alamat}</p>}
            {jam && <p className="flex gap-3 whitespace-pre-wrap"><span style={{ color: AMBER }}>🕐</span>{jam}</p>}
            {wa && <p className="flex gap-3"><span style={{ color: AMBER }}>📱</span>+{wa}</p>}
          </div>
        </div>
        <div className="space-y-4">
          {wa && (
            <a href={`https://wa.me/${wa}?text=Halo, saya ingin info lebih lanjut`} target="_blank"
              className={`flex justify-center items-center gap-2 py-4 font-700 text-sm uppercase tracking-[0.15em] rounded transition-all hover:-translate-y-0.5 ${sans.className}`}
              style={{ backgroundColor: MAROON, color: PARCHM }}>
              Chat via WhatsApp
            </a>
          )}
          {/* Portal siswa CTA */}
          <div className="p-6 rounded-2xl" style={{ backgroundColor: PARCHM, border: `1px solid ${AMBER}20` }}>
            <p className={`text-[11px] font-700 uppercase tracking-widest mb-4 ${sans.className}`} style={{ color: MAROON }}>Fitur Digital Lembaga Ini</p>
            {[
              { label: 'PPDB Online', desc: 'Pendaftaran siswa baru dari rumah' },
              { label: 'Portal Siswa', desc: 'Akses jadwal, nilai & materi belajar' },
              { label: 'Absensi Online', desc: 'Check-in & rekap kehadiran otomatis' },
              { label: 'Sertifikat Digital', desc: 'Digenerate & dikirim otomatis' },
              { label: 'Notif WA Otomatis', desc: 'Pengumuman & reminder via WhatsApp' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3 mb-3">
                <span style={{ color: AMBER, marginTop: 2, fontSize: 12 }}>✓</span>
                <div>
                  <p className={`text-sm font-700 ${sans.className}`} style={{ color: MAROON_D }}>{f.label}</p>
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
    <footer className="py-10" style={{ backgroundColor: MAROON_D }}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-4"><Crest size={28} color={`${AMBER_L}60`} /></div>
        <p className={`${serif.className} italic text-sm`} style={{ color: `${PARCHM}50` }}>
          © {new Date().getFullYear()} {nama} — Mencerdaskan Kehidupan Bangsa
        </p>
      </div>
    </footer>
  )
}

// ── Root Renderer ─────────────────────────────────────────────
export default function SekolahRenderer({
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
      case 'cta':          return <PpdbCta key={s.id} wa={waContact} />
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
            <Features isi={{}} />
            <PpdbCta wa={waContact} />
            <Testimonials isi={{}} />
            <Contact isi={{}} profile={profile} />
          </>
        ) : (
          visible.map(renderSection)
        )}
      </main>
      <Footer nama={nama} />
      <FloatingWA wa={waContact} />
    </div>
  )
}
