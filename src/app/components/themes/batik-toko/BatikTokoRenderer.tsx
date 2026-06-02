// ============================================================
// Tema visual "batik_toko" — desain bespoke luxury heritage.
// Palet indigo-krem-amber terinspirasi batik tulis Jawa, tipografi
// Cormorant Garamond, motif kawung sebagai ornamen dekoratif.
// Dipilih oleh [slug]/page.tsx saat konfigurasi.branding.theme==='batik_toko'.
// ============================================================

import { Cormorant_Garamond, Josefin_Sans } from 'next/font/google'
import AddToCartButton from '@/app/components/cart/AddToCartButton'
import type { PageSection, Product, TenantProfile } from '@/types/websitebuilder'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-batik-serif',
})

const sans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  variable: '--font-batik-sans',
})

// ── Palette ──────────────────────────────────────────────────
const INDIGO   = '#1A1040'
const CREAM    = '#FFF8ED'
const PAPER    = '#FFFDF8'
const AMBER    = '#B45309'
const GOLD     = '#C8922A'
const MUTED    = '#7A6348'
const INK      = '#2C1C0E'
const SOFT     = '#F0E6D3'

// ── Kawung SVG pattern (motif batik Jawa) ─────────────────────
const kawungPattern = (opacity = 0.09, color = 'D4A544') =>
  `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${color}' fill-opacity='${opacity}'%3E%3Cellipse cx='32' cy='8' rx='10' ry='7'/%3E%3Cellipse cx='32' cy='56' rx='10' ry='7'/%3E%3Cellipse cx='8' cy='32' rx='7' ry='10'/%3E%3Cellipse cx='56' cy='32' rx='7' ry='10'/%3E%3Ccircle cx='32' cy='32' r='6'/%3E%3C/g%3E%3C/svg%3E")`

// ── Helpers ───────────────────────────────────────────────────
type Isi = Record<string, any>
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : [] }
function rupiah(n: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(n) || 0)
}

// ── Ornamen ──────────────────────────────────────────────────
function Ornament({ color = GOLD }: { color?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div style={{ width: 40, height: 1, backgroundColor: color, opacity: 0.4 }} />
      <svg width="10" height="10" viewBox="0 0 10 10" fill={color} opacity={0.6}>
        <path d="M5 0L6.2 3.8H10L6.9 6.2L8.1 10L5 7.6L1.9 10L3.1 6.2L0 3.8H3.8Z" />
      </svg>
      <div style={{ width: 40, height: 1, backgroundColor: color, opacity: 0.4 }} />
    </div>
  )
}

// ── Top Navigation ────────────────────────────────────────────
function TopBar({ nama, wa }: { nama: string; wa?: string }) {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{ backgroundColor: `${INDIGO}e8`, borderBottom: `1px solid rgba(212,165,68,0.15)` }}
    >
      <div className="max-w-6xl mx-auto px-5 h-[60px] flex items-center justify-between">
        <span
          className={`${serif.className} text-xl tracking-wider`}
          style={{ color: '#F5E6C8', letterSpacing: '0.08em' }}
        >
          {nama}
        </span>

        <nav
          className={`hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] ${sans.className}`}
          style={{ color: '#BFA97A' }}
        >
          <a href="#keunggulan" className="hover:opacity-70 transition-opacity">Keunggulan</a>
          <a href="#koleksi" className="hover:opacity-70 transition-opacity">Koleksi</a>
          <a href="#kontak" className="hover:opacity-70 transition-opacity">Kontak</a>
        </nav>

        {wa && (
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            className={`text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full transition-all hover:opacity-85 ${sans.className}`}
            style={{ backgroundColor: AMBER, color: '#FFF8ED' }}
          >
            Pesan Kini
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero Full-Screen ──────────────────────────────────────────
function Hero({ isi }: { isi: Isi }) {
  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center text-center overflow-hidden"
      style={{ backgroundColor: INDIGO }}
    >
      {/* Foto background */}
      {isi.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={isi.image_url} alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.28 }}
        />
      )}

      {/* Overlay gradient bawah */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${INDIGO} 0%, transparent 55%, ${INDIGO}80 100%)` }}
      />

      {/* Kawung pattern subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: kawungPattern(0.07), backgroundSize: '64px 64px' }}
      />

      {/* Konten */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24">
        {/* Badge warisan */}
        {isi.eyebrow && (
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-[10px] uppercase tracking-[0.3em] ${sans.className}`}
            style={{ border: `1px solid ${GOLD}50`, color: GOLD, backgroundColor: `${GOLD}12` }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: GOLD, display: 'inline-block' }} />
            {isi.eyebrow}
          </div>
        )}

        {/* Judul besar */}
        <h1
          className={`${serif.className} font-light leading-none tracking-tight`}
          style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: '#F5E6C8' }}
        >
          {isi.title ?? 'Batik Larasati'}
        </h1>

        {/* Ornamen garis */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div style={{ width: 48, height: 1, backgroundColor: GOLD, opacity: 0.5 }} />
          <svg width="8" height="8" viewBox="0 0 8 8" fill={GOLD} opacity={0.7}>
            <rect x="3" y="0" width="2" height="8" rx="1"/>
            <rect x="0" y="3" width="8" height="2" rx="1"/>
          </svg>
          <div style={{ width: 48, height: 1, backgroundColor: GOLD, opacity: 0.5 }} />
        </div>

        {/* Subtitle */}
        {(isi.subtitle ?? isi.subjudul) && (
          <p
            className={`${serif.className} italic text-xl md:text-2xl leading-relaxed`}
            style={{ color: '#C8B08A', fontWeight: 300 }}
          >
            {isi.subtitle ?? isi.subjudul}
          </p>
        )}

        {/* CTA */}
        {isi.cta_text && (
          <a
            href={isi.cta_link ?? '#koleksi'}
            className={`inline-block mt-10 px-10 py-3.5 rounded-full font-bold tracking-widest text-sm uppercase transition-all hover:opacity-90 hover:-translate-y-0.5 ${sans.className}`}
            style={{ backgroundColor: AMBER, color: CREAM, letterSpacing: '0.18em' }}
          >
            {isi.cta_text}
          </a>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, transparent, ${GOLD}90)` }} />
      </div>
    </section>
  )
}

// ── SVG motif batik mini (parang, kawung, truntum) ───────────
const BATIK_ICONS = [
  // Parang — diagonal blade motif
  <svg key="parang" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 24L14 4L24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 17h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="14" cy="4" r="1.5" fill="currentColor"/>
  </svg>,
  // Kawung — four-petal circle motif
  <svg key="kawung" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <ellipse cx="14" cy="7" rx="4.5" ry="3" stroke="currentColor" strokeWidth="1.3"/>
    <ellipse cx="14" cy="21" rx="4.5" ry="3" stroke="currentColor" strokeWidth="1.3"/>
    <ellipse cx="7" cy="14" rx="3" ry="4.5" stroke="currentColor" strokeWidth="1.3"/>
    <ellipse cx="21" cy="14" rx="3" ry="4.5" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="14" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
  </svg>,
  // Truntum — star/jasmine blossom motif
  <svg key="truntum" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 3v5M14 20v5M3 14h5M20 14h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M6.5 6.5l3.5 3.5M18 18l3.5 3.5M21.5 6.5l-3.5 3.5M10 18l-3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="14" cy="14" r="1" fill="currentColor"/>
  </svg>,
]

// ── Features / Keunggulan ─────────────────────────────────────
function Features({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.fitur)
  return (
    <section id="keunggulan" style={{ backgroundColor: CREAM }}>
      <div className="max-w-5xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className={`text-[10px] uppercase tracking-[0.35em] mb-3 ${sans.className}`}
            style={{ color: AMBER }}
          >
            Keunggulan Kami
          </p>
          {isi.title && (
            <h2
              className={`${serif.className} font-normal leading-tight`}
              style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: INK }}
            >
              {isi.title}
            </h2>
          )}
          <Ornament />
        </div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it: Isi, i: number) => (
            <div
              key={i}
              className={`relative p-8 rounded-2xl text-center group transition-shadow hover:shadow-xl b-reveal b-delay-${i + 1}`}
              style={{
                backgroundColor: PAPER,
                border: `1px solid ${SOFT}`,
                boxShadow: '0 2px 12px rgba(26,16,64,0.06)',
              }}
            >
              {/* Icon ornament batik */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-5"
                style={{ backgroundColor: `${GOLD}15`, color: GOLD }}
              >
                {BATIK_ICONS[i] ?? BATIK_ICONS[0]}
              </div>
              <h3
                className={`${serif.className} text-xl mb-3 font-medium`}
                style={{ color: INK }}
              >
                {it.title ?? it.judul ?? `Keunggulan ${i + 1}`}
              </h3>
              <p className={`text-sm leading-relaxed ${sans.className}`} style={{ color: MUTED }}>
                {it.desc ?? it.deskripsi ?? ''}
              </p>
              {/* Border bawah aksen */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-300 group-hover:w-16"
                style={{ width: 32, height: 2, backgroundColor: AMBER, borderRadius: 1 }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Product List ──────────────────────────────────────────────
function ProductList({ isi, products, hasCart, primary }: {
  isi: Isi; products: Product[]; hasCart?: boolean; primary?: string
}) {
  const accent = primary ?? AMBER
  return (
    <section id="koleksi" style={{ backgroundColor: PAPER }}>
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className={`text-[10px] uppercase tracking-[0.35em] mb-3 ${sans.className}`}
            style={{ color: AMBER }}
          >
            Koleksi Kami
          </p>
          <h2
            className={`${serif.className} font-normal`}
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: INK }}
          >
            {isi.title ?? 'Koleksi Pilihan'}
          </h2>
          <Ornament />
        </div>

        {products.length === 0 ? (
          <p className={`text-center text-sm ${sans.className}`} style={{ color: MUTED }}>
            Koleksi segera hadir.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <div
                key={p.id}
                className={`group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl b-reveal b-delay-${Math.min(i + 1, 3)}`}
                style={{
                  backgroundColor: CREAM,
                  border: `1px solid ${SOFT}`,
                  boxShadow: '0 2px 16px rgba(26,16,64,0.07)',
                }}
              >
                {/* Foto produk */}
                <div className="relative overflow-hidden aspect-square">
                  {p.gambar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.gambar_url}
                      alt={p.nama}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: SOFT, backgroundImage: kawungPattern(0.15) }}
                    >
                      <span className={`${serif.className} text-2xl`} style={{ color: GOLD }}>✦</span>
                    </div>
                  )}
                  {/* Kategori badge */}
                  {p.kategori && (
                    <span
                      className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${sans.className}`}
                      style={{ backgroundColor: `${INDIGO}d0`, color: '#F5E6C8' }}
                    >
                      {p.kategori}
                    </span>
                  )}
                </div>

                {/* Info produk */}
                <div className="flex flex-col flex-1 p-4 gap-2">
                  <h3
                    className={`${serif.className} text-base font-medium leading-snug`}
                    style={{ color: INK }}
                  >
                    {p.nama}
                  </h3>
                  <p
                    className={`text-sm font-bold mt-auto ${sans.className}`}
                    style={{ color: accent }}
                  >
                    {rupiah(p.harga)}
                  </p>
                  {hasCart && (
                    <div className="mt-2">
                      <AddToCartButton product={p} primary={accent} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────
function Testimonials({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.testimoni)
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: INDIGO }}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: kawungPattern(0.06), backgroundSize: '64px 64px' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p
            className={`text-[10px] uppercase tracking-[0.35em] mb-3 ${sans.className}`}
            style={{ color: GOLD }}
          >
            Testimoni Pelanggan
          </p>
          <h2
            className={`${serif.className} font-light`}
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#F5E6C8' }}
          >
            {isi.title ?? 'Apa Kata Pelanggan'}
          </h2>
          <Ornament color={GOLD} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((it: Isi, i: number) => (
            <blockquote
              key={i}
              className={`relative p-8 rounded-2xl b-reveal b-delay-${i + 1}`}
              style={{
                backgroundColor: 'rgba(255,248,237,0.06)',
                border: `1px solid ${GOLD}25`,
              }}
            >
              {/* Tanda kutip besar */}
              <div
                className={`${serif.className} absolute -top-2 left-6 text-6xl leading-none pointer-events-none`}
                style={{ color: GOLD, opacity: 0.25 }}
              >
                "
              </div>
              <p
                className={`${serif.className} italic text-lg leading-relaxed mt-2`}
                style={{ color: '#E8D4B0' }}
              >
                "{it.quote ?? it.isi ?? ''}"
              </p>
              <footer
                className={`mt-5 text-[11px] font-bold uppercase tracking-widest ${sans.className}`}
                style={{ color: GOLD }}
              >
                — {it.name ?? it.nama ?? ''}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────
function Cta({ isi }: { isi: Isi }) {
  return (
    <section
      className="relative overflow-hidden text-center"
      style={{ backgroundColor: AMBER }}
    >
      {/* Kawung pattern terang */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: kawungPattern(0.12, 'FFFDF8'), backgroundSize: '64px 64px' }}
      />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-24">
        <h2
          className={`${serif.className} font-light leading-tight mb-4`}
          style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: INK }}
        >
          {isi.title ?? 'Tampil Anggun dengan Batik Asli'}
        </h2>
        {isi.subtitle && (
          <p
            className={`${serif.className} italic text-lg mb-10`}
            style={{ color: `${INK}99` }}
          >
            {isi.subtitle}
          </p>
        )}
        {isi.cta_text && (
          <a
            href={isi.cta_link ?? '#'}
            target="_blank"
            className={`inline-block px-10 py-4 rounded-full font-bold text-sm uppercase tracking-[0.18em] transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg ${sans.className}`}
            style={{ backgroundColor: INDIGO, color: '#F5E6C8' }}
          >
            {isi.cta_text}
          </a>
        )}
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────
function Contact({ isi, profile }: { isi: Isi; profile?: TenantProfile | null }) {
  const wa     = profile?.wa ?? isi.wa
  const email  = profile?.email ?? isi.email
  const alamat = profile?.alamat ?? isi.alamat
  const jam    = profile?.jam ?? isi.jam
  return (
    <section id="kontak" style={{ backgroundColor: CREAM, borderTop: `1px solid ${SOFT}` }}>
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <p
          className={`text-[10px] uppercase tracking-[0.35em] mb-3 ${sans.className}`}
          style={{ color: AMBER }}
        >
          Hubungi Kami
        </p>
        <h2
          className={`${serif.className} font-normal mb-2`}
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: INK }}
        >
          {isi.title ?? 'Terhubung dengan Kami'}
        </h2>
        <Ornament />
        {isi.deskripsi && (
          <p className={`text-sm leading-relaxed mt-4 mb-8 ${sans.className}`} style={{ color: MUTED }}>
            {isi.deskripsi}
          </p>
        )}
        {(alamat || jam) && (
          <div className={`text-sm mb-8 space-y-1 ${sans.className}`} style={{ color: MUTED }}>
            {alamat && <p>{alamat}</p>}
            {jam && <p className="whitespace-pre-wrap">{jam}</p>}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              className={`px-7 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 ${sans.className}`}
              style={{ backgroundColor: AMBER, color: CREAM }}
            >
              WhatsApp
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className={`px-7 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 ${sans.className}`}
              style={{ backgroundColor: INDIGO, color: CREAM }}
            >
              Email
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
    <footer style={{ backgroundColor: INK }}>
      {/* Kawung decorative border row */}
      <div
        className="w-full h-10 opacity-20"
        style={{
          backgroundImage: kawungPattern(0.7, 'C8922A'),
          backgroundSize: '40px 40px',
          borderTop: `1px solid ${GOLD}30`,
        }}
      />
      <div className="py-8 text-center">
        <Ornament color={`${GOLD}50`} />
        <p
          className={`${serif.className} italic text-sm mt-4`}
          style={{ color: `${GOLD}70` }}
        >
          © {new Date().getFullYear()} {nama}
        </p>
        <p
          className={`${sans.className} text-[10px] uppercase tracking-[0.3em] mt-1`}
          style={{ color: `${GOLD}40` }}
        >
          Warisan Wastra Nusantara
        </p>
      </div>
    </footer>
  )
}

// ── Scroll Reveal Script (injected once per page) ─────────────
function ScrollRevealScript() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .b-reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
        .b-reveal.b-visible { opacity: 1; transform: translateY(0); }
        .b-delay-1 { transition-delay: 100ms; }
        .b-delay-2 { transition-delay: 200ms; }
        .b-delay-3 { transition-delay: 300ms; }
      ` }} />
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          function init(){
            var io = new IntersectionObserver(function(entries){
              entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('b-visible'); io.unobserve(e.target); } });
            }, { threshold: 0.1 });
            document.querySelectorAll('.b-reveal').forEach(function(el){ io.observe(el); });
          }
          if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }
        })();
      ` }} />
    </>
  )
}

// ── Root Renderer ─────────────────────────────────────────────
export default function BatikTokoRenderer({
  nama,
  sections,
  products = [],
  profile = null,
  hasCart = false,
  slug,
  primary,
  wa,
}: {
  nama: string
  sections: PageSection[]
  products?: Product[]
  profile?: TenantProfile | null
  hasCart?: boolean
  slug?: string
  primary?: string
  wa?: string
}) {
  const waContact = wa ?? profile?.wa ?? undefined

  const renderSection = (s: PageSection) => {
    const isi = (s.isi_komponen ?? {}) as Isi

    switch (s.tipe_komponen) {
      case 'hero_banner':  return <Hero key={s.id} isi={isi} />
      case 'features':     return <Features key={s.id} isi={isi} />
      case 'product_list': return <ProductList key={s.id} isi={isi} products={products} hasCart={hasCart} primary={primary} />
      case 'testimonials': return <Testimonials key={s.id} isi={isi} />
      case 'cta':          return <Cta key={s.id} isi={isi} />
      case 'contact_form': return <Contact key={s.id} isi={isi} profile={profile} />
      default:             return null
    }
  }

  return (
    <div className={`${serif.variable} ${sans.variable}`} style={{ backgroundColor: PAPER }}>
      <ScrollRevealScript />
      <TopBar nama={nama} wa={waContact} />
      <main>
        {sections
          .filter((s) => s.is_visible)
          .sort((a, b) => a.urutan - b.urutan)
          .map(renderSection)}
      </main>
      <Footer nama={nama} />
    </div>
  )
}
