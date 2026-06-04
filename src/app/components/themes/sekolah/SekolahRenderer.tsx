// ============================================================
// Tema "sekolah" — dua variant nyata (F2):
//  - warm  (default): Academic Heritage — cream + deep maroon + warm amber.
//  - clean: Modern Institutional — white + royal blue + sky accent.
// Palet di-resolve per variant jadi objek `pal` lalu di-thread ke tiap
// komponen (pola interpolasi `${pal.accent}40` butuh hex 6-digit, jadi
// tidak pakai CSS var). Konten tetap dari DB. Playfair Display + Lato.
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

// ── Palette per variant ──────────────────────────────────────
// Semua warna hex 6-digit agar pola alpha-concat (`${pal.accent}40`) valid.
interface Pal {
  primary: string   // brand utama (navbar, heading) — eks-MAROON
  primaryD: string  // versi gelap (hero bg, footer)   — eks-MAROON_D
  bg: string        // latar section terang             — eks-CREAM
  surface: string   // kartu / teks terang di atas gelap — eks-PARCHM
  accent: string    // aksen (CTA, ornamen)             — eks-AMBER
  accentL: string   // aksen terang                     — eks-AMBER_L
  forest: string    // warna ketiga gradient hero       — eks-FOREST
  ink: string       // teks gelap (body)                — eks-DARK
  onAccent: string  // teks di atas tombol accent
  muted: string     // teks sekunder
  soft: string      // latar section alternatif
}

const PALETTES: Record<string, Pal> = {
  // Academic Heritage (default, sama persis seperti desain lama → no regression)
  warm: {
    primary: '#7B2D3E', primaryD: '#5A1F2C', bg: '#FFFBF0', surface: '#FEF3DC',
    accent: '#D4860A', accentL: '#F0A830', forest: '#2C4A2E', ink: '#1A0A0E',
    onAccent: '#1A0A0E', muted: '#7A6B5A', soft: '#EDE4D4',
  },
  // Modern Institutional — biru royal + sky, bersih & formal
  clean: {
    primary: '#1D4ED8', primaryD: '#1E3A8A', bg: '#FFFFFF', surface: '#EFF6FF',
    accent: '#2563EB', accentL: '#60A5FA', forest: '#0E7490', ink: '#0F172A',
    onAccent: '#FFFFFF', muted: '#64748B', soft: '#F1F5F9',
  },
}

function getPalette(variant?: string): Pal {
  return PALETTES[variant ?? 'warm'] ?? PALETTES.warm
}

const EASE = 'cubic-bezier(0.16,1,0.3,1)'
function skCss(pal: Pal): string {
  return `
  .sk-root{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-variant-numeric:tabular-nums}
  .sk-btn{transition:transform 200ms ${EASE},box-shadow 200ms ease}
  .sk-btn:hover{transform:translateY(-2px)}.sk-btn:active{transform:scale(0.96)}
  .sk-card{transition:transform 220ms ${EASE},box-shadow 220ms ease,border-color 180ms ease}
  .sk-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px ${pal.primary}1F,0 4px 12px ${pal.primary}0F!important;border-color:${pal.accent}47!important}
  .sk-testi{transition:transform 200ms ${EASE},border-color 180ms ease}
  .sk-testi:hover{transform:translateY(-3px);border-color:${pal.accent}47!important}
  .sk-wa{transition:transform 220ms cubic-bezier(0.34,1.56,0.64,1)}.sk-wa:hover{transform:scale(1.12)}
`
}

type Isi = Record<string, any>
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : [] }

// ── Crest SVG ornament ────────────────────────────────────────
function Crest({ size = 32, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3l3 8h8l-6.5 5 2.5 8L20 19l-7 5 2.5-8L9 11h8z" fill={color} opacity={0.85}/>
      <path d="M10 28h20M12 32h16" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity={0.5}/>
    </svg>
  )
}

// ── Divider ───────────────────────────────────────────────────
function Divider({ color }: { color: string }) {
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
    <a href={`https://wa.me/${wa}`} target="_blank" aria-label="WhatsApp" className="sk-wa"
      style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 999, width: 52, height: 52, borderRadius: '50%', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.40)' }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.492a.5.5 0 00.618.618l5.647-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.917 0-3.71-.504-5.263-1.385l-.378-.217-3.922 1.027 1.027-3.922-.217-.378A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    </a>
  )
}

// ── Navbar ────────────────────────────────────────────────────
function Navbar({ nama, wa, pal }: { nama: string; wa?: string; pal: Pal }) {
  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: pal.primary, borderBottom: `2px solid ${pal.accent}40` }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crest size={28} color={pal.accentL} />
          <span className={`${serif.className} text-xl font-600 tracking-wide`} style={{ color: pal.surface }}>{nama}</span>
        </div>
        <nav className={`hidden md:flex items-center gap-8 text-[11px] font-700 uppercase tracking-[0.18em] ${sans.className}`} style={{ color: `${pal.surface}80` }}>
          {['Program', 'PPDB', 'Fasilitas', 'Kontak'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:opacity-100 transition-opacity">{l}</a>
          ))}
        </nav>
        {wa && (
          <a href={`https://wa.me/${wa}?text=Halo, saya ingin info PPDB`} target="_blank"
            className={`text-[11px] font-700 uppercase tracking-[0.15em] px-5 py-2.5 rounded transition-all hover:opacity-90 ${sans.className}`}
            style={{ backgroundColor: pal.accent, color: pal.onAccent }}>
            Info PPDB
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero({ isi, wa, pal }: { isi: Isi; wa?: string; pal: Pal }) {
  const sAccent = `0 8px 24px ${pal.accent}4D, 0 2px 8px ${pal.accent}26`
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ backgroundColor: pal.primaryD }}>
      {/* Image */}
      {isi.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={isi.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.2 }} />
      )}
      {/* Gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${pal.primaryD} 40%, ${pal.primary} 70%, ${pal.forest}80 100%)` }} />
      {/* Accent radial */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-20" style={{ background: `radial-gradient(ellipse 60% 60% at 100% 100%, ${pal.accent}, transparent)` }} />
      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${pal.accentL} 0, ${pal.accentL} 1px, transparent 0, transparent 50%)`, backgroundSize: '24px 24px' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="mb-8">
            <Crest size={48} color={pal.accentL} />
          </div>
          {isi.eyebrow && (
            <p className={`text-[11px] font-700 uppercase tracking-[0.35em] mb-4 ${sans.className}`} style={{ color: pal.accentL }}>
              {isi.eyebrow}
            </p>
          )}
          <h1 className={`${serif.className} font-800 leading-[1.1] mb-6`}
            style={{ fontSize: 'clamp(2.5rem,5.5vw,4.5rem)', color: pal.surface }}>
            {isi.title ?? 'Membentuk\nGenerasi Unggul\nBerdaya Saing'}
          </h1>
          <Divider color={`${pal.accent}60`} />
          <p className={`text-base leading-relaxed mt-6 mb-10 max-w-md ${sans.className}`} style={{ color: `${pal.surface}B0`, fontWeight: 300 }}>
            {isi.subtitle ?? 'Lembaga pendidikan dengan kurikulum terstruktur, pengajar berpengalaman, dan fasilitas yang mendukung potensi maksimal setiap peserta didik.'}
          </p>
          <div className="flex flex-wrap gap-4">
            {wa && (
              <a href={`https://wa.me/${wa}?text=Halo, saya ingin informasi PPDB`} target="_blank"
                className={`sk-btn px-8 py-4 font-700 text-sm uppercase tracking-[0.12em] rounded ${sans.className}`}
                style={{ backgroundColor: pal.accent, color: pal.onAccent, boxShadow: sAccent }}>
                Daftar PPDB Online
              </a>
            )}
            <a href="#program"
              className={`px-8 py-4 font-700 text-sm uppercase tracking-[0.12em] rounded transition-all hover:-translate-y-0.5 ${sans.className}`}
              style={{ border: `1px solid ${pal.surface}30`, color: pal.surface }}>
              Lihat Program
            </a>
          </div>
          {/* Addon badges */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['PPDB Online', 'Portal Siswa', 'Sertifikat Digital', 'Absensi Online', 'Notif WA Otomatis'].map(b => (
              <span key={b} className={`text-[10px] font-700 px-3 py-1 ${sans.className}`}
                style={{ border: `1px solid ${pal.accent}40`, color: `${pal.accentL}`, backgroundColor: `${pal.accent}10` }}>
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
            <div key={i} className="p-6 rounded-2xl text-center" style={{ backgroundColor: `${pal.surface}0C`, border: `1px solid ${pal.accent}20`, backdropFilter: 'blur(12px)' }}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className={`${serif.className} text-3xl font-700 mb-1`} style={{ color: pal.accentL }}>{s.v}</p>
              <p className={`text-[11px] font-700 uppercase tracking-wider ${sans.className}`} style={{ color: `${pal.surface}70` }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Features / Program Unggulan ───────────────────────────────
function Features({ isi, pal }: { isi: Isi; pal: Pal }) {
  const items = asArray(isi.items ?? isi.fitur)
  const fallback = [
    { title: 'Kurikulum Terstruktur', desc: 'Materi disusun progresif dari dasar hingga mahir, dirancang bersama praktisi industri dan akademisi berpengalaman.' },
    { title: 'Pengajar Bersertifikat', desc: 'Setiap pengajar telah tersertifikasi dan menjalani pelatihan reguler untuk memastikan kualitas pengajaran terkini.' },
    { title: 'Sertifikat Diakui', desc: 'Sertifikat kelulusan kami diakui oleh mitra industri dan institusi terkait sebagai bukti kompetensi peserta didik.' },
  ]
  const data = items.length ? items : fallback
  return (
    <section id="program" style={{ backgroundColor: pal.bg }}>
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className={`text-[11px] font-700 uppercase tracking-[0.35em] mb-3 ${sans.className}`} style={{ color: pal.accent }}>Keunggulan Kami</p>
          <h2 className={`${serif.className} font-700 leading-tight`} style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: pal.primary }}>
            {isi.title ?? 'Mengapa Memilih Kami?'}
          </h2>
          <Divider color={pal.accent} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((it: Isi, i: number) => (
            <div key={i} className="sk-card group p-8 rounded-2xl"
              style={{ backgroundColor: pal.surface, border: `1px solid ${pal.accent}18`, boxShadow: `0 2px 8px ${pal.primary}0F` }}>
              <div className="mb-6">
                <Crest size={28} color={pal.accent} />
              </div>
              <h3 className={`${serif.className} text-xl font-600 mb-3`} style={{ color: pal.primaryD }}>
                {it.title ?? it.judul ?? `Keunggulan ${i + 1}`}
              </h3>
              <p className={`text-sm leading-relaxed ${sans.className}`} style={{ color: pal.muted }}>
                {it.desc ?? it.deskripsi ?? ''}
              </p>
              <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${pal.accent}20` }}>
                <div style={{ width: 24, height: 2, backgroundColor: pal.accent, borderRadius: 1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PPDB CTA ──────────────────────────────────────────────────
function PpdbCta({ wa, pal }: { wa?: string; pal: Pal }) {
  const sAccent = `0 8px 24px ${pal.accent}4D, 0 2px 8px ${pal.accent}26`
  return (
    <section id="ppdb" className="relative overflow-hidden py-24" style={{ backgroundColor: pal.primary }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${pal.accentL} 0, ${pal.accentL} 1px, transparent 0, transparent 50%)`, backgroundSize: '24px 24px' }} />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className={`text-[11px] font-700 uppercase tracking-[0.35em] mb-4 ${sans.className}`} style={{ color: pal.accentL }}>Penerimaan Peserta Didik Baru</p>
            <h2 className={`${serif.className} font-700 leading-tight mb-6`} style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: pal.surface }}>
              Pendaftaran PPDB<br />Kini Bisa Online
            </h2>
            <p className={`text-base leading-relaxed mb-8 ${sans.className}`} style={{ color: `${pal.surface}B0`, fontWeight: 300 }}>
              Daftar dari rumah, upload berkas digital, pantau status pendaftaran secara real-time. Tidak perlu datang ke kantor.
            </p>
            {wa && (
              <a href={`https://wa.me/${wa}?text=Halo, saya ingin daftar PPDB online`} target="_blank"
                className={`sk-btn inline-flex items-center gap-2 px-8 py-4 font-700 text-sm uppercase tracking-[0.12em] rounded ${sans.className}`}
                style={{ backgroundColor: pal.accent, color: pal.onAccent, boxShadow: sAccent }}>
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
              <div key={s.step} className="flex gap-5 p-5 rounded-xl" style={{ backgroundColor: `${pal.surface}08`, border: `1px solid ${pal.accent}20` }}>
                <span className={`${serif.className} text-3xl font-700 shrink-0`} style={{ color: `${pal.accent}50` }}>{s.step}</span>
                <div>
                  <p className={`font-700 text-sm mb-1 ${sans.className}`} style={{ color: pal.surface }}>{s.title}</p>
                  <p className={`text-[12px] ${sans.className}`} style={{ color: `${pal.surface}70` }}>{s.desc}</p>
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
function Testimonials({ isi, pal }: { isi: Isi; pal: Pal }) {
  const items = asArray(isi.items ?? isi.testimoni)
  const fallback = [
    { quote: 'Anak saya sangat berkembang setelah bergabung. Pengajarnya sabar, kurikulumnya terstruktur, dan sertifikatnya diakui oleh tempat kerjanya.', name: 'Ibu Sari W.', peran: 'Orang Tua Siswa' },
    { quote: 'Sistem PPDB online memudahkan proses pendaftaran. Tidak perlu antre panjang, semua bisa dari HP. Sangat modern dan profesional.', name: 'Bapak Ahmad F.', peran: 'Wali Murid Angkatan 2024' },
  ]
  const data = items.length ? items : fallback
  return (
    <section style={{ backgroundColor: pal.soft }}>
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className={`text-[11px] font-700 uppercase tracking-[0.35em] mb-3 ${sans.className}`} style={{ color: pal.accent }}>Testimoni</p>
          <h2 className={`${serif.className} font-700`} style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: pal.primary }}>
            {isi.title ?? 'Kata Mereka'}
          </h2>
          <Divider color={pal.accent} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((it: Isi, i: number) => (
            <blockquote key={i} className="sk-testi p-8 rounded-2xl" style={{ backgroundColor: pal.bg, border: `1px solid ${pal.accent}18` }}>
              <div className={`${serif.className} text-4xl leading-none mb-4`} style={{ color: pal.accent, opacity: 0.3 }}>"</div>
              <p className={`${serif.className} italic text-lg leading-relaxed mb-6`} style={{ color: pal.ink }}>
                {it.quote ?? it.isi ?? ''}
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: `${pal.primary}15`, color: pal.primary }}>
                  {(it.name ?? it.nama ?? 'A')[0]}
                </div>
                <div>
                  <p className={`text-sm font-700 ${sans.className}`} style={{ color: pal.primaryD }}>{it.name ?? it.nama}</p>
                  <p className={`text-[11px] ${sans.className}`} style={{ color: pal.muted }}>{it.peran ?? it.posisi ?? ''}</p>
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
function Contact({ isi, profile, pal }: { isi: Isi; profile?: TenantProfile | null; pal: Pal }) {
  const wa = profile?.wa ?? isi.wa
  const alamat = profile?.alamat ?? isi.alamat
  const jam = profile?.jam ?? isi.jam
  return (
    <section id="kontak" style={{ backgroundColor: pal.bg, borderTop: `1px solid ${pal.accent}18` }}>
      <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <p className={`text-[11px] font-700 uppercase tracking-[0.35em] mb-3 ${sans.className}`} style={{ color: pal.accent }}>Hubungi Kami</p>
          <h2 className={`${serif.className} font-700 mb-6`} style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: pal.primary }}>
            {isi.title ?? 'Kami Siap\nMenjawab Pertanyaan Anda'}
          </h2>
          <Divider color={pal.accent} />
          <div className={`space-y-4 text-sm mt-6 ${sans.className}`} style={{ color: pal.muted }}>
            {alamat && <p className="flex gap-3"><span style={{ color: pal.accent }}>📍</span>{alamat}</p>}
            {jam && <p className="flex gap-3 whitespace-pre-wrap"><span style={{ color: pal.accent }}>🕐</span>{jam}</p>}
            {wa && <p className="flex gap-3"><span style={{ color: pal.accent }}>📱</span>+{wa}</p>}
          </div>
        </div>
        <div className="space-y-4">
          {wa && (
            <a href={`https://wa.me/${wa}?text=Halo, saya ingin info lebih lanjut`} target="_blank"
              className={`flex justify-center items-center gap-2 py-4 font-700 text-sm uppercase tracking-[0.15em] rounded transition-all hover:-translate-y-0.5 ${sans.className}`}
              style={{ backgroundColor: pal.primary, color: pal.surface }}>
              Chat via WhatsApp
            </a>
          )}
          {/* Portal siswa CTA */}
          <div className="p-6 rounded-2xl" style={{ backgroundColor: pal.surface, border: `1px solid ${pal.accent}20` }}>
            <p className={`text-[11px] font-700 uppercase tracking-widest mb-4 ${sans.className}`} style={{ color: pal.primary }}>Fitur Digital Lembaga Ini</p>
            {[
              { label: 'PPDB Online', desc: 'Pendaftaran siswa baru dari rumah' },
              { label: 'Portal Siswa', desc: 'Akses jadwal, nilai & materi belajar' },
              { label: 'Absensi Online', desc: 'Check-in & rekap kehadiran otomatis' },
              { label: 'Sertifikat Digital', desc: 'Digenerate & dikirim otomatis' },
              { label: 'Notif WA Otomatis', desc: 'Pengumuman & reminder via WhatsApp' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3 mb-3">
                <span style={{ color: pal.accent, marginTop: 2, fontSize: 12 }}>✓</span>
                <div>
                  <p className={`text-sm font-700 ${sans.className}`} style={{ color: pal.primaryD }}>{f.label}</p>
                  <p className={`text-[11px] ${sans.className}`} style={{ color: pal.muted }}>{f.desc}</p>
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
function Footer({ nama, pal }: { nama: string; pal: Pal }) {
  return (
    <footer className="py-10" style={{ backgroundColor: pal.primaryD }}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-4"><Crest size={28} color={`${pal.accentL}60`} /></div>
        <p className={`${serif.className} italic text-sm`} style={{ color: `${pal.surface}50` }}>
          © {new Date().getFullYear()} {nama} — Mencerdaskan Kehidupan Bangsa
        </p>
      </div>
    </footer>
  )
}

// ── Root Renderer ─────────────────────────────────────────────
export default function SekolahRenderer({
  nama, sections, services = [], profile = null, wa, variant,
}: {
  nama: string
  sections: PageSection[]
  services?: Service[]
  profile?: TenantProfile | null
  wa?: string
  slug?: string
  primary?: string
  variant?: string
}) {
  void services
  const pal = getPalette(variant)
  const waContact = wa ?? profile?.wa ?? undefined
  const visible = [...sections].filter(s => s.is_visible).sort((a, b) => a.urutan - b.urutan)

  const renderSection = (s: PageSection) => {
    const isi = (s.isi_komponen ?? {}) as Isi
    switch (s.tipe_komponen) {
      case 'hero_banner':  return <Hero key={s.id} isi={isi} wa={waContact} pal={pal} />
      case 'features':     return <Features key={s.id} isi={isi} pal={pal} />
      case 'testimonials': return <Testimonials key={s.id} isi={isi} pal={pal} />
      case 'cta':          return <PpdbCta key={s.id} wa={waContact} pal={pal} />
      case 'contact_form': return <Contact key={s.id} isi={isi} profile={profile} pal={pal} />
      default:             return null
    }
  }

  return (
    <div className={`sk-root ${serif.variable} ${sans.variable}`} style={{ backgroundColor: pal.bg }}>
      <style dangerouslySetInnerHTML={{ __html: skCss(pal) }} />
      <Navbar nama={nama} wa={waContact} pal={pal} />
      <main>
        {visible.length === 0 ? (
          <>
            <Hero isi={{ title: nama }} wa={waContact} pal={pal} />
            <Features isi={{}} pal={pal} />
            <PpdbCta wa={waContact} pal={pal} />
            <Testimonials isi={{}} pal={pal} />
            <Contact isi={{}} profile={profile} pal={pal} />
          </>
        ) : (
          visible.map(renderSection)
        )}
      </main>
      <Footer nama={nama} pal={pal} />
      <FloatingWA wa={waContact} />
    </div>
  )
}
