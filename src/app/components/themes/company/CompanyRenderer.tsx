// ============================================================
// Tema "company" — Bold Editorial.
// Palet near-black + electric amber. Barlow Condensed (display)
// + IBM Plex Sans (body). Authoritative, graphic, premium.
// Add-on: admin-dash, seo, live-chat, wa-auto, crm, blog.
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

// ── Palette ──────────────────────────────────────────────────
const INK     = '#08090B'
const SURFACE = '#111316'
const CARD    = '#181B20'
const AMBER   = '#F5A623'
const AMBER_D = '#C4841A'
const LIGHT   = '#F0F0EC'
const MUTED   = '#7A7D84'
const BORDER  = 'rgba(245,166,35,0.12)'

type Isi = Record<string, any>
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : [] }

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
    <header className="sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: `${INK}E8`, borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className={`${display.className} text-2xl font-700 tracking-[0.08em] uppercase`} style={{ color: LIGHT, letterSpacing: '0.06em' }}>
          {nama}
        </span>
        <nav className={`hidden md:flex items-center gap-8 text-[11px] font-500 uppercase tracking-[0.2em] ${body.className}`} style={{ color: MUTED }}>
          {['Layanan', 'Tentang', 'Portofolio', 'Kontak'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-amber transition-colors" style={{ '--amber': AMBER } as any}>{l}</a>
          ))}
        </nav>
        {wa && (
          <a href={`https://wa.me/${wa}`} target="_blank"
            className={`text-[11px] font-600 uppercase tracking-[0.15em] px-5 py-2.5 transition-all hover:opacity-85 ${body.className}`}
            style={{ backgroundColor: AMBER, color: INK }}>
            Hubungi Kami
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero({ isi, wa }: { isi: Isi; wa?: string }) {
  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden" style={{ backgroundColor: INK }}>
      {/* Amber glow top-right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-15" style={{ background: `radial-gradient(ellipse 60% 60% at 100% 0%, ${AMBER}, transparent)` }} />
      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(240,240,236,1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,240,236,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      {/* Background image */}
      {isi.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={isi.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.08, mixBlendMode: 'luminosity' }} />
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 pt-32">
        {/* Large amber number */}
        <div className={`${display.className} text-[clamp(8rem,20vw,18rem)] font-900 leading-none select-none pointer-events-none mb-4`}
          style={{ color: AMBER, opacity: 0.06, lineHeight: 0.85, marginBottom: '-4rem' }}>
          01
        </div>
        {isi.eyebrow && (
          <div className={`inline-flex items-center gap-3 mb-6 ${body.className}`}>
            <div style={{ width: 32, height: 1, backgroundColor: AMBER }} />
            <span className="text-[11px] font-500 uppercase tracking-[0.3em]" style={{ color: AMBER }}>{isi.eyebrow}</span>
          </div>
        )}
        <h1 className={`${display.className} font-900 uppercase leading-none mb-8`}
          style={{ fontSize: 'clamp(3.5rem,9vw,8rem)', color: LIGHT, letterSpacing: '-0.01em' }}>
          {(isi.title ?? 'Solusi Digital\nUntuk Bisnis\nAnda').split('\n').map((line: string, i: number) => (
            <span key={i} className="block">
              {i === 1 ? <em style={{ color: AMBER, fontStyle: 'italic' }}>{line}</em> : line}
            </span>
          ))}
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <p className={`text-base leading-relaxed max-w-md ${body.className}`} style={{ color: MUTED, fontWeight: 300 }}>
            {isi.subtitle ?? 'Strategi digital, branding, dan sistem yang membuat bisnis Anda unggul di era persaingan ketat.'}
          </p>
          <div className="flex gap-4 shrink-0">
            <a href="#kontak"
              className={`px-8 py-4 font-600 text-sm uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 ${body.className}`}
              style={{ backgroundColor: AMBER, color: INK }}>
              Konsultasi Gratis
            </a>
            <a href="#layanan"
              className={`px-8 py-4 font-600 text-sm uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 ${body.className}`}
              style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
              Lihat Layanan
            </a>
          </div>
        </div>
        {/* SEO badge */}
        <div className="mt-12 flex flex-wrap gap-3">
          {['SEO Optimized', 'Dashboard Admin', 'WA Automation', 'CRM Terintegrasi', 'Live Chat'].map(b => (
            <span key={b} className={`text-[10px] font-500 uppercase tracking-widest px-3 py-1.5 ${body.className}`}
              style={{ border: `1px solid ${BORDER}`, color: `${AMBER}80` }}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Services ──────────────────────────────────────────────────
function Services({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.fitur)
  const fallback = [
    { title: 'Branding & Identitas', desc: 'Logo, panduan merek, dan sistem visual yang kohesif untuk menampilkan bisnis Anda secara profesional.' },
    { title: 'Website & Sistem Digital', desc: 'Pengembangan platform digital custom: website company profile, portal klien, dan sistem manajemen internal.' },
    { title: 'SEO & Digital Marketing', desc: 'Optimasi mesin pencari, iklan digital, dan strategi konten yang mendatangkan leads berkualitas.' },
    { title: 'Konsultasi Bisnis', desc: 'Analisis proses bisnis, rekomendasi teknologi, dan roadmap transformasi digital yang terukur.' },
  ]
  const data = items.length ? items : fallback
  return (
    <section id="layanan" style={{ backgroundColor: SURFACE }}>
      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
          <div>
            <div className={`flex items-center gap-3 mb-4 ${body.className}`}>
              <div style={{ width: 32, height: 1, backgroundColor: AMBER }} />
              <span className="text-[11px] font-500 uppercase tracking-[0.3em]" style={{ color: AMBER }}>Layanan Kami</span>
            </div>
            <h2 className={`${display.className} font-800 uppercase leading-none`}
              style={{ fontSize: 'clamp(2.5rem,5vw,5rem)', color: LIGHT }}>
              {isi.title ?? 'Apa yang\nKami Lakukan'}
            </h2>
          </div>
          <p className={`text-sm max-w-xs leading-relaxed ${body.className}`} style={{ color: MUTED }}>
            Setiap layanan dirancang untuk memberikan hasil nyata — bukan sekadar deliverable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: BORDER }}>
          {data.map((it: Isi, i: number) => (
            <div key={i} className="group p-10 transition-colors" style={{ backgroundColor: CARD }}>
              <div className="flex items-start justify-between mb-8">
                <span className={`${display.className} font-700 text-5xl leading-none`} style={{ color: `${AMBER}20` }}>
                  0{i + 1}
                </span>
                <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7v10" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className={`${display.className} font-700 text-2xl uppercase tracking-wide mb-4`} style={{ color: LIGHT }}>
                {it.title ?? it.judul ?? `Layanan ${i + 1}`}
              </h3>
              <p className={`text-sm leading-relaxed ${body.className}`} style={{ color: MUTED }}>
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
function Stats() {
  const data = [
    { v: '50+', l: 'Klien Aktif' },
    { v: '8 Thn', l: 'Pengalaman' },
    { v: '120+', l: 'Proyek Selesai' },
    { v: '98%', l: 'Tingkat Kepuasan' },
  ]
  return (
    <div style={{ backgroundColor: AMBER }}>
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {data.map(s => (
          <div key={s.l}>
            <p className={`${display.className} font-800 text-5xl uppercase`} style={{ color: INK }}>{s.v}</p>
            <p className={`text-[11px] font-600 uppercase tracking-[0.2em] mt-2 ${body.className}`} style={{ color: `${INK}80` }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Testimonials ──────────────────────────────────────────────
function Testimonials({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.testimoni)
  const fallback = [
    { quote: 'Japan Arena merombak total sistem digital kami. Sekarang tim lebih efisien, klien lebih puas, dan revenue naik 40% dalam 6 bulan.', name: 'Budi S.', jabatan: 'CEO, PT Maju Bersama' },
    { quote: 'Website dan CRM yang mereka bangun benar-benar game changer. Lead qualification jadi jauh lebih mudah dan terstruktur.', name: 'Dewi R.', jabatan: 'Marketing Director, Kreasi Nusantara' },
  ]
  const data = items.length ? items : fallback
  return (
    <section id="portofolio" style={{ backgroundColor: INK }}>
      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="flex items-center gap-3 mb-16">
          <div style={{ width: 32, height: 1, backgroundColor: AMBER }} />
          <span className={`text-[11px] font-500 uppercase tracking-[0.3em] ${body.className}`} style={{ color: AMBER }}>Kata Klien</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.map((it: Isi, i: number) => (
            <blockquote key={i} className="p-10" style={{ border: `1px solid ${BORDER}`, backgroundColor: CARD }}>
              <p className={`${display.className} font-400 text-2xl leading-snug mb-8 italic`} style={{ color: LIGHT }}>
                "{it.quote ?? it.isi ?? ''}"
              </p>
              <footer>
                <p className={`font-600 text-sm uppercase tracking-wider ${body.className}`} style={{ color: AMBER }}>{it.name ?? it.nama}</p>
                <p className={`text-[11px] mt-1 ${body.className}`} style={{ color: MUTED }}>{it.jabatan ?? it.posisi ?? ''}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────
function Cta({ isi, wa }: { isi: Isi; wa?: string }) {
  return (
    <section className="relative overflow-hidden py-32" style={{ backgroundColor: AMBER }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(8,9,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(8,9,11,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <h2 className={`${display.className} font-900 uppercase leading-none mb-8`}
          style={{ fontSize: 'clamp(3rem,8vw,7rem)', color: INK }}>
          {isi.title ?? 'Siap Tumbuh\nBersama Kami?'}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {wa ? (
            <a href={`https://wa.me/${wa}?text=Halo, saya ingin konsultasi`} target="_blank"
              className={`inline-flex items-center gap-2 px-8 py-4 font-600 text-sm uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 ${body.className}`}
              style={{ backgroundColor: INK, color: LIGHT }}>
              Mulai Konsultasi →
            </a>
          ) : null}
          <a href="#layanan"
            className={`inline-flex items-center gap-2 px-8 py-4 font-600 text-sm uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 ${body.className}`}
            style={{ border: `2px solid ${INK}30`, color: INK }}>
            Lihat Portofolio
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────
function Contact({ isi, profile }: { isi: Isi; profile?: TenantProfile | null }) {
  const wa = profile?.wa ?? isi.wa
  const alamat = profile?.alamat ?? isi.alamat
  const email = profile?.email ?? isi.email
  return (
    <section id="kontak" style={{ backgroundColor: SURFACE, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: 32, height: 1, backgroundColor: AMBER }} />
            <span className={`text-[11px] font-500 uppercase tracking-[0.3em] ${body.className}`} style={{ color: AMBER }}>Kontak</span>
          </div>
          <h2 className={`${display.className} font-800 uppercase leading-none mb-8`}
            style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: LIGHT }}>
            {isi.title ?? 'Bicara\nDengan Kami'}
          </h2>
          <div className={`space-y-4 text-sm ${body.className}`} style={{ color: MUTED }}>
            {alamat && <p>📍 {alamat}</p>}
            {email && <p>✉ {email}</p>}
            {wa && <p>📱 +{wa}</p>}
          </div>
          {/* Addon highlight */}
          <div className="mt-10 p-6" style={{ border: `1px solid ${BORDER}`, backgroundColor: CARD }}>
            <p className={`text-[10px] font-600 uppercase tracking-widest mb-4 ${body.className}`} style={{ color: AMBER }}>Add-On Aktif</p>
            {[
              'Dashboard Admin & CMS',
              'SEO Technical Setup',
              'WhatsApp Automation',
              'CRM Customer',
              'Live Chat Support',
            ].map(f => (
              <div key={f} className="flex items-center gap-2 mb-2">
                <span style={{ color: AMBER, fontSize: 12 }}>▸</span>
                <span className={`text-[12px] ${body.className}`} style={{ color: MUTED }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 justify-center">
          {wa && (
            <a href={`https://wa.me/${wa}?text=Halo, saya ingin konsultasi project`} target="_blank"
              className={`flex justify-center items-center gap-2 py-5 font-600 text-sm uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 ${body.className}`}
              style={{ backgroundColor: AMBER, color: INK }}>
              Chat via WhatsApp
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`}
              className={`flex justify-center items-center py-5 font-600 text-sm uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 ${body.className}`}
              style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
              Kirim Email
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer({ nama }: { nama: string }) {
  return (
    <footer className="py-8 border-t" style={{ backgroundColor: INK, borderColor: BORDER }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className={`${display.className} font-700 uppercase tracking-[0.08em] text-xl`} style={{ color: `${LIGHT}40` }}>{nama}</span>
        <p className={`text-[11px] ${body.className}`} style={{ color: MUTED }}>© {new Date().getFullYear()} {nama}. All rights reserved.</p>
      </div>
    </footer>
  )
}

// ── Root Renderer ─────────────────────────────────────────────
export default function CompanyRenderer({
  nama, sections, services = [], gallery = [], profile = null, wa, primary,
}: {
  nama: string
  sections: PageSection[]
  services?: Service[]
  gallery?: GalleryImage[]
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
      case 'features':     return <Services key={s.id} isi={isi} />
      case 'testimonials': return <Testimonials key={s.id} isi={isi} />
      case 'cta':          return <Cta key={s.id} isi={isi} wa={waContact} />
      case 'contact_form': return <Contact key={s.id} isi={isi} profile={profile} />
      default:             return null
    }
  }

  return (
    <div className={`${display.variable} ${body.variable}`} style={{ backgroundColor: INK }}>
      <Navbar nama={nama} wa={waContact} />
      <main>
        {visible.length === 0 ? (
          <>
            <Hero isi={{ title: nama }} wa={waContact} />
            <Stats />
            <Services isi={{}} />
            <Testimonials isi={{}} />
            <Cta isi={{}} wa={waContact} />
            <Contact isi={{}} profile={profile} />
          </>
        ) : (
          <>
            {visible.map(renderSection)}
            <Stats />
          </>
        )}
      </main>
      <Footer nama={nama} />
      <FloatingWA wa={waContact} />
    </div>
  )
}
