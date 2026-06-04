// ============================================================
// Tema "company" — tiga variant nyata (F2):
//  - editorial (default): Bold Editorial — near-black + electric amber (dark).
//  - clean: Clean Professional — white + royal blue (light).
//  - minimal: Minimal Tech — white + near-black accent (light, monokrom).
// Karena renderer aslinya dark dengan token dwiperan (INK = bg gelap DAN
// teks-di-atas-amber; LIGHT = teks DAN teks-di-tombol-gelap), palet dipecah
// jadi peran semantik (pageBg/text/accent/onAccent/strong/onStrong/...) supaya
// variant terang bisa membalik bg<->teks tanpa rusak. Barlow Condensed + IBM Plex.
// ============================================================

import { Barlow_Condensed, IBM_Plex_Sans } from 'next/font/google'
import type { PageSection, Service, GalleryImage, TenantProfile } from '@/types/websitebuilder'

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-co-display',
})
const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-co-body',
})

// ── Palette per variant (peran semantik) ─────────────────────
interface Pal {
  pageBg: string    // latar utama (root/hero/testi/footer/navbar) — eks-INK(bg)
  surfaceBg: string // latar section sekunder (services/contact)   — eks-SURFACE
  cardBg: string    // latar kartu                                 — eks-CARD
  text: string      // teks utama / heading                        — eks-LIGHT
  muted: string     // teks sekunder                               — eks-MUTED
  accent: string    // aksen (eyebrow, garis, stats/cta bg, btn)   — eks-AMBER
  onAccent: string  // teks di atas accent                         — eks-INK(text)
  strong: string    // bg tombol "gelap" (CTA solid)               — eks-INK(bg-btn)
  onStrong: string  // teks di atas strong                         — eks-LIGHT(on-ink)
  border: string    // garis tipis
  gridLine: string  // warna tekstur grid hero (solid)
  shadowAccent: string
}

const PALETTES: Record<string, Pal> = {
  // Bold Editorial (default — identik desain lama, no regression)
  editorial: {
    pageBg: '#08090B', surfaceBg: '#111316', cardBg: '#181B20', text: '#F0F0EC',
    muted: '#7A7D84', accent: '#F5A623', onAccent: '#08090B', strong: '#08090B',
    onStrong: '#F0F0EC', border: 'rgba(245,166,35,0.12)', gridLine: 'rgba(240,240,236,1)',
    shadowAccent: '0 8px 28px rgba(245,166,35,.28), 0 2px 8px rgba(245,166,35,.14)',
  },
  // Clean Professional — putih + royal blue
  clean: {
    pageBg: '#FFFFFF', surfaceBg: '#F5F7FA', cardBg: '#FFFFFF', text: '#0F172A',
    muted: '#64748B', accent: '#2563EB', onAccent: '#FFFFFF', strong: '#0F172A',
    onStrong: '#FFFFFF', border: 'rgba(37,99,235,0.16)', gridLine: 'rgba(15,23,42,1)',
    shadowAccent: '0 8px 28px rgba(37,99,235,.20), 0 2px 8px rgba(37,99,235,.12)',
  },
  // Minimal Tech — putih + near-black accent (monokrom)
  minimal: {
    pageBg: '#FFFFFF', surfaceBg: '#FAFAFA', cardBg: '#FFFFFF', text: '#18181B',
    muted: '#71717A', accent: '#18181B', onAccent: '#FFFFFF', strong: '#18181B',
    onStrong: '#FFFFFF', border: 'rgba(0,0,0,0.10)', gridLine: 'rgba(24,24,27,1)',
    shadowAccent: '0 8px 28px rgba(0,0,0,.10), 0 2px 8px rgba(0,0,0,.06)',
  },
}

function getPalette(variant?: string): Pal {
  return PALETTES[variant ?? 'editorial'] ?? PALETTES.editorial
}

const EASE = 'cubic-bezier(0.16,1,0.3,1)'
function coCss(pal: Pal): string {
  return `
  .co-root{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-variant-numeric:tabular-nums}
  .co-btn{transition:transform 200ms ${EASE},box-shadow 200ms ease,opacity 150ms ease}
  .co-btn:hover{transform:translateY(-2px)}.co-btn:active{transform:scale(0.96)}
  .co-svc{transition:background 200ms ease,border-color 200ms ease}
  .co-svc:hover{background:${pal.accent}0F!important;border-color:${pal.accent}38!important}
  .co-svc:hover .co-arrow{opacity:1!important;transform:translate(2px,-2px)}
  .co-arrow{transition:opacity 150ms ease,transform 200ms ${EASE}}
  .co-testi{transition:transform 220ms ${EASE},border-color 200ms ease}
  .co-testi:hover{transform:translateY(-4px);border-color:${pal.accent}47!important}
  .co-wa{transition:transform 220ms cubic-bezier(0.34,1.56,0.64,1)}.co-wa:hover{transform:scale(1.12)}
`
}

type Isi = Record<string, any>
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : [] }

// ── Floating WA ───────────────────────────────────────────────
function FloatingWA({ wa }: { wa?: string }) {
  if (!wa) return null
  return (
    <a href={`https://wa.me/${wa}`} target="_blank" aria-label="WhatsApp" className="co-wa"
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
    <header className="sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: `${pal.pageBg}E8`, borderBottom: `1px solid ${pal.border}` }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className={`${display.className} text-2xl font-700 tracking-[0.08em] uppercase`} style={{ color: pal.text, letterSpacing: '0.06em' }}>
          {nama}
        </span>
        <nav className={`hidden md:flex items-center gap-8 text-[11px] font-500 uppercase tracking-[0.2em] ${body.className}`} style={{ color: pal.muted }}>
          {['Layanan', 'Tentang', 'Portofolio', 'Kontak'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="transition-colors">{l}</a>
          ))}
        </nav>
        {wa && (
          <a href={`https://wa.me/${wa}`} target="_blank"
            className={`co-btn text-[11px] font-600 uppercase tracking-[0.15em] px-5 py-2.5 ${body.className}`}
            style={{ backgroundColor: pal.accent, color: pal.onAccent, boxShadow: pal.shadowAccent }}>
            Hubungi Kami
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero({ isi, wa, pal }: { isi: Isi; wa?: string; pal: Pal }) {
  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden" style={{ backgroundColor: pal.pageBg }}>
      {/* Accent glow top-right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-15" style={{ background: `radial-gradient(ellipse 60% 60% at 100% 0%, ${pal.accent}, transparent)` }} />
      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${pal.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${pal.gridLine} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      {/* Background image */}
      {isi.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={isi.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.08, mixBlendMode: 'luminosity' }} />
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 pt-32">
        {/* Large accent number */}
        <div className={`${display.className} text-[clamp(8rem,20vw,18rem)] font-900 leading-none select-none pointer-events-none mb-4`}
          style={{ color: pal.accent, opacity: 0.06, lineHeight: 0.85, marginBottom: '-4rem' }}>
          01
        </div>
        {isi.eyebrow && (
          <div className={`inline-flex items-center gap-3 mb-6 ${body.className}`}>
            <div style={{ width: 32, height: 1, backgroundColor: pal.accent }} />
            <span className="text-[11px] font-500 uppercase tracking-[0.3em]" style={{ color: pal.accent }}>{isi.eyebrow}</span>
          </div>
        )}
        <h1 className={`${display.className} font-900 uppercase leading-none mb-8`}
          style={{ fontSize: 'clamp(3.5rem,9vw,8rem)', color: pal.text, letterSpacing: '-0.01em' }}>
          {(isi.title ?? 'Solusi Digital\nUntuk Bisnis\nAnda').split('\n').map((line: string, i: number) => (
            <span key={i} className="block">
              {i === 1 ? <em style={{ color: pal.accent, fontStyle: 'italic' }}>{line}</em> : line}
            </span>
          ))}
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <p className={`text-base leading-relaxed max-w-md ${body.className}`} style={{ color: pal.muted, fontWeight: 300 }}>
            {isi.subtitle ?? 'Strategi digital, branding, dan sistem yang membuat bisnis Anda unggul di era persaingan ketat.'}
          </p>
          <div className="flex gap-4 shrink-0">
            <a href="#kontak"
              className={`co-btn px-8 py-4 font-600 text-sm uppercase tracking-[0.15em] ${body.className}`}
              style={{ backgroundColor: pal.accent, color: pal.onAccent, boxShadow: pal.shadowAccent }}>
              Konsultasi Gratis
            </a>
            <a href="#layanan"
              className={`co-btn px-8 py-4 font-600 text-sm uppercase tracking-[0.15em] ${body.className}`}
              style={{ border: `1px solid ${pal.border}`, color: pal.muted }}>
              Lihat Layanan
            </a>
          </div>
        </div>
        {/* Feature badge */}
        <div className="mt-12 flex flex-wrap gap-3">
          {['SEO Optimized', 'Dashboard Admin', 'WA Automation', 'CRM Terintegrasi', 'Live Chat'].map(b => (
            <span key={b} className={`text-[10px] font-500 uppercase tracking-widest px-3 py-1.5 ${body.className}`}
              style={{ border: `1px solid ${pal.border}`, color: `${pal.accent}B0` }}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Services ──────────────────────────────────────────────────
function Services({ isi, pal }: { isi: Isi; pal: Pal }) {
  const items = asArray(isi.items ?? isi.fitur)
  const fallback = [
    { title: 'Branding & Identitas', desc: 'Logo, panduan merek, dan sistem visual yang kohesif untuk menampilkan bisnis Anda secara profesional.' },
    { title: 'Website & Sistem Digital', desc: 'Pengembangan platform digital custom: website company profile, portal klien, dan sistem manajemen internal.' },
    { title: 'SEO & Digital Marketing', desc: 'Optimasi mesin pencari, iklan digital, dan strategi konten yang mendatangkan leads berkualitas.' },
    { title: 'Konsultasi Bisnis', desc: 'Analisis proses bisnis, rekomendasi teknologi, dan roadmap transformasi digital yang terukur.' },
  ]
  const data = items.length ? items : fallback
  return (
    <section id="layanan" style={{ backgroundColor: pal.surfaceBg }}>
      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
          <div>
            <div className={`flex items-center gap-3 mb-4 ${body.className}`}>
              <div style={{ width: 32, height: 1, backgroundColor: pal.accent }} />
              <span className="text-[11px] font-500 uppercase tracking-[0.3em]" style={{ color: pal.accent }}>Layanan Kami</span>
            </div>
            <h2 className={`${display.className} font-800 uppercase leading-none`}
              style={{ fontSize: 'clamp(2.5rem,5vw,5rem)', color: pal.text }}>
              {isi.title ?? 'Apa yang\nKami Lakukan'}
            </h2>
          </div>
          <p className={`text-sm max-w-xs leading-relaxed ${body.className}`} style={{ color: pal.muted }}>
            Setiap layanan dirancang untuk memberikan hasil nyata — bukan sekadar deliverable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: pal.border }}>
          {data.map((it: Isi, i: number) => (
            <div key={i} className="co-svc group p-10" style={{ backgroundColor: pal.cardBg }}>
              <div className="flex items-start justify-between mb-8">
                <span className={`${display.className} font-700 text-5xl leading-none`} style={{ color: `${pal.accent}20` }}>
                  0{i + 1}
                </span>
                <svg className="co-arrow opacity-0" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7v10" stroke={pal.accent} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className={`${display.className} font-700 text-2xl uppercase tracking-wide mb-4`} style={{ color: pal.text }}>
                {it.title ?? it.judul ?? `Layanan ${i + 1}`}
              </h3>
              <p className={`text-sm leading-relaxed ${body.className}`} style={{ color: pal.muted }}>
                {it.desc ?? it.deskripsi ?? ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────
function Stats({ pal }: { pal: Pal }) {
  const data = [
    { v: '50+', l: 'Klien Aktif' },
    { v: '8 Thn', l: 'Pengalaman' },
    { v: '120+', l: 'Proyek Selesai' },
    { v: '98%', l: 'Tingkat Kepuasan' },
  ]
  return (
    <div style={{ backgroundColor: pal.accent }}>
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {data.map(s => (
          <div key={s.l}>
            <p className={`${display.className} font-800 text-5xl uppercase`} style={{ color: pal.onAccent }}>{s.v}</p>
            <p className={`text-[11px] font-600 uppercase tracking-[0.2em] mt-2 ${body.className}`} style={{ color: `${pal.onAccent}B0` }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Testimonials ──────────────────────────────────────────────
function Testimonials({ isi, pal }: { isi: Isi; pal: Pal }) {
  const items = asArray(isi.items ?? isi.testimoni)
  const fallback = [
    { quote: 'Japan Arena merombak total sistem digital kami. Sekarang tim lebih efisien, klien lebih puas, dan revenue naik 40% dalam 6 bulan.', name: 'Budi S.', jabatan: 'CEO, PT Maju Bersama' },
    { quote: 'Website dan CRM yang mereka bangun benar-benar game changer. Lead qualification jadi jauh lebih mudah dan terstruktur.', name: 'Dewi R.', jabatan: 'Marketing Director, Kreasi Nusantara' },
  ]
  const data = items.length ? items : fallback
  return (
    <section id="portofolio" style={{ backgroundColor: pal.pageBg }}>
      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="flex items-center gap-3 mb-16">
          <div style={{ width: 32, height: 1, backgroundColor: pal.accent }} />
          <span className={`text-[11px] font-500 uppercase tracking-[0.3em] ${body.className}`} style={{ color: pal.accent }}>Kata Klien</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.map((it: Isi, i: number) => (
            <blockquote key={i} className="co-testi p-10" style={{ border: `1px solid ${pal.border}`, backgroundColor: pal.cardBg }}>
              <p className={`${display.className} font-400 text-2xl leading-snug mb-8 italic`} style={{ color: pal.text }}>
                "{it.quote ?? it.isi ?? ''}"
              </p>
              <footer>
                <p className={`font-600 text-sm uppercase tracking-wider ${body.className}`} style={{ color: pal.accent }}>{it.name ?? it.nama}</p>
                <p className={`text-[11px] mt-1 ${body.className}`} style={{ color: pal.muted }}>{it.jabatan ?? it.posisi ?? ''}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────
function Cta({ isi, wa, pal }: { isi: Isi; wa?: string; pal: Pal }) {
  return (
    <section className="relative overflow-hidden py-32" style={{ backgroundColor: pal.accent }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(${pal.onAccent} 1px, transparent 1px), linear-gradient(90deg, ${pal.onAccent} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <h2 className={`${display.className} font-900 uppercase leading-none mb-8`}
          style={{ fontSize: 'clamp(3rem,8vw,7rem)', color: pal.onAccent }}>
          {isi.title ?? 'Siap Tumbuh\nBersama Kami?'}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {wa ? (
            <a href={`https://wa.me/${wa}?text=Halo, saya ingin konsultasi`} target="_blank"
              className={`co-btn inline-flex items-center gap-2 px-8 py-4 font-600 text-sm uppercase tracking-[0.15em] ${body.className}`}
              style={{ backgroundColor: pal.strong, color: pal.onStrong, boxShadow: `0 8px 24px ${pal.strong}66` }}>
              Mulai Konsultasi →
            </a>
          ) : null}
          <a href="#layanan"
            className={`inline-flex items-center gap-2 px-8 py-4 font-600 text-sm uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 ${body.className}`}
            style={{ border: `2px solid ${pal.onAccent}4D`, color: pal.onAccent }}>
            Lihat Portofolio
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────
function Contact({ isi, profile, pal }: { isi: Isi; profile?: TenantProfile | null; pal: Pal }) {
  const wa = profile?.wa ?? isi.wa
  const alamat = profile?.alamat ?? isi.alamat
  const email = profile?.email ?? isi.email
  return (
    <section id="kontak" style={{ backgroundColor: pal.surfaceBg, borderTop: `1px solid ${pal.border}` }}>
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: 32, height: 1, backgroundColor: pal.accent }} />
            <span className={`text-[11px] font-500 uppercase tracking-[0.3em] ${body.className}`} style={{ color: pal.accent }}>Kontak</span>
          </div>
          <h2 className={`${display.className} font-800 uppercase leading-none mb-8`}
            style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: pal.text }}>
            {isi.title ?? 'Bicara\nDengan Kami'}
          </h2>
          <div className={`space-y-4 text-sm ${body.className}`} style={{ color: pal.muted }}>
            {alamat && <p>📍 {alamat}</p>}
            {email && <p>✉ {email}</p>}
            {wa && <p>📱 +{wa}</p>}
          </div>
          {/* Addon highlight */}
          <div className="mt-10 p-6" style={{ border: `1px solid ${pal.border}`, backgroundColor: pal.cardBg }}>
            <p className={`text-[10px] font-600 uppercase tracking-widest mb-4 ${body.className}`} style={{ color: pal.accent }}>Add-On Aktif</p>
            {[
              'Dashboard Admin & CMS',
              'SEO Technical Setup',
              'WhatsApp Automation',
              'CRM Customer',
              'Live Chat Support',
            ].map(f => (
              <div key={f} className="flex items-center gap-2 mb-2">
                <span style={{ color: pal.accent, fontSize: 12 }}>▸</span>
                <span className={`text-[12px] ${body.className}`} style={{ color: pal.muted }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 justify-center">
          {wa && (
            <a href={`https://wa.me/${wa}?text=Halo, saya ingin konsultasi project`} target="_blank"
              className={`flex justify-center items-center gap-2 py-5 font-600 text-sm uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 ${body.className}`}
              style={{ backgroundColor: pal.accent, color: pal.onAccent }}>
              Chat via WhatsApp
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`}
              className={`flex justify-center items-center py-5 font-600 text-sm uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 ${body.className}`}
              style={{ border: `1px solid ${pal.border}`, color: pal.muted }}>
              Kirim Email
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer({ nama, pal }: { nama: string; pal: Pal }) {
  return (
    <footer className="py-8 border-t" style={{ backgroundColor: pal.pageBg, borderColor: pal.border }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className={`${display.className} font-700 uppercase tracking-[0.08em] text-xl`} style={{ color: `${pal.text}40` }}>{nama}</span>
        <p className={`text-[11px] ${body.className}`} style={{ color: pal.muted }}>© {new Date().getFullYear()} {nama}. All rights reserved.</p>
      </div>
    </footer>
  )
}

// ── Root Renderer ─────────────────────────────────────────────
export default function CompanyRenderer({
  nama, sections, services = [], gallery = [], profile = null, wa, variant,
}: {
  nama: string
  sections: PageSection[]
  services?: Service[]
  gallery?: GalleryImage[]
  profile?: TenantProfile | null
  wa?: string
  slug?: string
  primary?: string
  variant?: string
}) {
  void services; void gallery
  const pal = getPalette(variant)
  const waContact = wa ?? profile?.wa ?? undefined
  const visible = [...sections].filter(s => s.is_visible).sort((a, b) => a.urutan - b.urutan)

  const renderSection = (s: PageSection) => {
    const isi = (s.isi_komponen ?? {}) as Isi
    switch (s.tipe_komponen) {
      case 'hero_banner':  return <Hero key={s.id} isi={isi} wa={waContact} pal={pal} />
      case 'features':     return <Services key={s.id} isi={isi} pal={pal} />
      case 'testimonials': return <Testimonials key={s.id} isi={isi} pal={pal} />
      case 'cta':          return <Cta key={s.id} isi={isi} wa={waContact} pal={pal} />
      case 'contact_form': return <Contact key={s.id} isi={isi} profile={profile} pal={pal} />
      default:             return null
    }
  }

  return (
    <div className={`co-root ${display.variable} ${body.variable}`} style={{ backgroundColor: pal.pageBg }}>
      <style dangerouslySetInnerHTML={{ __html: coCss(pal) }} />
      <Navbar nama={nama} wa={waContact} pal={pal} />
      <main>
        {visible.length === 0 ? (
          <>
            <Hero isi={{ title: nama }} wa={waContact} pal={pal} />
            <Stats pal={pal} />
            <Services isi={{}} pal={pal} />
            <Testimonials isi={{}} pal={pal} />
            <Cta isi={{}} wa={waContact} pal={pal} />
            <Contact isi={{}} profile={profile} pal={pal} />
          </>
        ) : (
          <>
            {visible.map(renderSection)}
            <Stats pal={pal} />
          </>
        )}
      </main>
      <Footer nama={nama} pal={pal} />
      <FloatingWA wa={waContact} />
    </div>
  )
}
