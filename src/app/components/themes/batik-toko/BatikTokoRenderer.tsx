// ============================================================
// Tema "batik_toko" — dua variant nyata (F2):
//  - batik (default): Luxury Heritage — indigo + krem + amber, motif kawung.
//  - modern: Contemporary Dark — slate gelap + gold refined (fashion/lifestyle).
// Renderer aslinya light dengan banyak token dwiperan (INK=teks gelap & bg
// footer; CREAM=bg terang & teks-di-tombol; INDIGO=bg gelap & bg tombol).
// Palet dipecah jadi peran semantik per variant; nilai 'batik' = persis nilai
// lama (no regression). Cormorant Garamond + Josefin Sans.
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

// ── Palette per variant (peran semantik) ─────────────────────
interface Pal {
  dark: string        // bg gelap: navbar/hero/testi (+ bg tombol indigo) — eks-INDIGO
  sectionA: string    // bg section terang: Features/Contact            — eks-CREAM
  sectionB: string    // bg section terang: root/ProductList            — eks-PAPER
  card: string        // bg kartu fitur                                  — eks-PAPER
  cardAlt: string     // bg kartu produk                                 — eks-CREAM
  footer: string      // bg footer                                       — eks-INK(bg)
  ink: string         // teks gelap di section terang                    — eks-INK(teks)
  muted: string       // teks sekunder di terang                         — eks-MUTED
  onDark: string      // teks krem terang di atas gelap (judul/nama/btn) — eks-#F5E6C8
  navText: string     // link nav di navbar gelap                        — eks-#BFA97A
  heroSub: string     // subtitle hero di atas gelap                     — eks-#C8B08A
  testiQuote: string  // teks kutipan testimoni di atas gelap            — eks-#E8D4B0
  accent: string      // aksen utama (eyebrow, harga, CTA bg, btn)       — eks-AMBER
  gold: string        // emas ornamen                                    — eks-GOLD
  soft: string        // garis/border + bg placeholder                   — eks-SOFT
  onAccentBtn: string // teks di tombol accent                           — eks-CREAM(on-amber)
  ctaInk: string      // heading gelap di atas section accent (Cta)      — eks-INK(on-amber)
  testiCard: string   // bg kartu testimoni di atas gelap
}

const PALETTES: Record<string, Pal> = {
  // Luxury Heritage (default — nilai PERSIS desain lama, no regression)
  batik: {
    dark: '#1A1040', sectionA: '#FFF8ED', sectionB: '#FFFDF8', card: '#FFFDF8',
    cardAlt: '#FFF8ED', footer: '#2C1C0E', ink: '#2C1C0E', muted: '#7A6348',
    onDark: '#F5E6C8', navText: '#BFA97A', heroSub: '#C8B08A', testiQuote: '#E8D4B0',
    accent: '#B45309', gold: '#C8922A', soft: '#F0E6D3', onAccentBtn: '#FFF8ED',
    ctaInk: '#2C1C0E', testiCard: 'rgba(255,248,237,0.06)',
  },
  // Contemporary Dark — slate gelap + gold refined
  modern: {
    dark: '#0F1115', sectionA: '#16181D', sectionB: '#0F1115', card: '#1A1D23',
    cardAlt: '#1A1D23', footer: '#0A0B0D', ink: '#ECEAE3', muted: '#9AA0A8',
    onDark: '#ECEAE3', navText: '#A8AEB8', heroSub: '#C2C6CE', testiQuote: '#D4D8DE',
    accent: '#C9A14A', gold: '#C9A14A', soft: 'rgba(255,255,255,0.08)', onAccentBtn: '#0F1115',
    ctaInk: '#1A1208', testiCard: 'rgba(255,255,255,0.05)',
  },
}

function getPalette(variant?: string): Pal {
  return PALETTES[variant ?? 'batik'] ?? PALETTES.batik
}

// ── Shadow system (statis — bekerja di terang & gelap) ────────
const S_SM    = '0 2px 12px rgba(26,16,64,.07), 0 1px 3px rgba(26,16,64,.04)'
const S_MD    = '0 8px 28px rgba(26,16,64,.11), 0 3px 8px rgba(26,16,64,.06)'
const S_AMBER = `0 8px 24px rgba(180,83,9,.30), 0 2px 8px rgba(180,83,9,.16)`
const S_INDIGO = `0 8px 24px rgba(26,16,64,.40), 0 2px 8px rgba(26,16,64,.20)`

const EASE_SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)'

const EXTRA_CSS = `
  .bt-root {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-variant-numeric: tabular-nums;
  }
  .bt-card-feat {
    transition: transform 220ms ${EASE_SPRING}, box-shadow 220ms ease, border-color 180ms ease;
  }
  .bt-card-feat:hover {
    transform: translateY(-5px);
    box-shadow: ${S_MD} !important;
    border-color: rgba(200,146,42,.25) !important;
  }
  .bt-card-prod {
    transition: transform 240ms ${EASE_SPRING}, box-shadow 240ms ease;
  }
  .bt-card-prod:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(26,16,64,.14), 0 6px 14px rgba(26,16,64,.08) !important;
  }
  .bt-card-testi {
    transition: transform 200ms ${EASE_SPRING}, background 200ms ease, border-color 200ms ease;
  }
  .bt-card-testi:hover {
    transform: translateY(-4px);
    background: rgba(255,248,237,.10) !important;
    border-color: rgba(200,146,42,.35) !important;
  }
  .bt-btn {
    transition: transform 200ms ${EASE_SPRING}, opacity 150ms ease, box-shadow 200ms ease;
  }
  .bt-btn:hover { transform: translateY(-2px); opacity: .92; }
  .bt-btn:active { transform: scale(0.96); }
  .bt-wa-float { transition: transform 220ms cubic-bezier(0.34,1.56,0.64,1); }
  .bt-wa-float:hover { transform: scale(1.12); }
`

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
function Ornament({ color }: { color: string }) {
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
function TopBar({ nama, wa, pal }: { nama: string; wa?: string; pal: Pal }) {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{ backgroundColor: `${pal.dark}e8`, borderBottom: `1px solid ${pal.gold}26` }}
    >
      <div className="max-w-6xl mx-auto px-5 h-[60px] flex items-center justify-between">
        <span
          className={`${serif.className} text-xl tracking-wider`}
          style={{ color: pal.onDark, letterSpacing: '0.08em' }}
        >
          {nama}
        </span>

        <nav
          className={`hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] ${sans.className}`}
          style={{ color: pal.navText }}
        >
          <a href="#keunggulan" className="hover:opacity-70 transition-opacity">Keunggulan</a>
          <a href="#koleksi" className="hover:opacity-70 transition-opacity">Koleksi</a>
          <a href="#kontak" className="hover:opacity-70 transition-opacity">Kontak</a>
        </nav>

        {wa && (
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            className={`bt-btn text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-2.5 rounded-full ${sans.className}`}
            style={{ backgroundColor: pal.accent, color: pal.onAccentBtn, boxShadow: S_AMBER }}
          >
            Pesan Kini
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero Full-Screen ──────────────────────────────────────────
function Hero({ isi, pal }: { isi: Isi; pal: Pal }) {
  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center text-center overflow-hidden"
      style={{ backgroundColor: pal.dark }}
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

      {/* Overlay gradient bawah + atmospheric mesh */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `linear-gradient(to top, ${pal.dark} 0%, transparent 55%, ${pal.dark}80 100%)`
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: [
          `radial-gradient(ellipse 70% 50% at 20% 75%, ${pal.gold}1F 0%, transparent 55%)`,
          `radial-gradient(ellipse 50% 40% at 80% 25%, ${pal.accent}17 0%, transparent 45%)`,
        ].join(', '),
      }} />

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
            style={{ border: `1px solid ${pal.gold}50`, color: pal.gold, backgroundColor: `${pal.gold}12` }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: pal.gold, display: 'inline-block' }} />
            {isi.eyebrow}
          </div>
        )}

        {/* Judul besar */}
        <h1
          className={`${serif.className} font-light leading-none tracking-tight`}
          style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: pal.onDark }}
        >
          {isi.title ?? 'Batik Larasati'}
        </h1>

        {/* Ornamen garis */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div style={{ width: 48, height: 1, backgroundColor: pal.gold, opacity: 0.5 }} />
          <svg width="8" height="8" viewBox="0 0 8 8" fill={pal.gold} opacity={0.7}>
            <rect x="3" y="0" width="2" height="8" rx="1"/>
            <rect x="0" y="3" width="8" height="2" rx="1"/>
          </svg>
          <div style={{ width: 48, height: 1, backgroundColor: pal.gold, opacity: 0.5 }} />
        </div>

        {/* Subtitle */}
        {(isi.subtitle ?? isi.subjudul) && (
          <p
            className={`${serif.className} italic text-xl md:text-2xl leading-relaxed`}
            style={{ color: pal.heroSub, fontWeight: 300 }}
          >
            {isi.subtitle ?? isi.subjudul}
          </p>
        )}

        {/* CTA */}
        {isi.cta_text && (
          <a
            href={isi.cta_link ?? '#koleksi'}
            className={`bt-btn inline-block mt-10 px-10 py-3.5 rounded-full font-bold text-sm uppercase ${sans.className}`}
            style={{ backgroundColor: pal.accent, color: pal.onAccentBtn, letterSpacing: '0.18em', boxShadow: S_AMBER }}
          >
            {isi.cta_text}
          </a>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, transparent, ${pal.gold}90)` }} />
      </div>
    </section>
  )
}

// ── SVG motif batik mini (parang, kawung, truntum) ───────────
const BATIK_ICONS = [
  <svg key="parang" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 24L14 4L24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 17h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="14" cy="4" r="1.5" fill="currentColor"/>
  </svg>,
  <svg key="kawung" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <ellipse cx="14" cy="7" rx="4.5" ry="3" stroke="currentColor" strokeWidth="1.3"/>
    <ellipse cx="14" cy="21" rx="4.5" ry="3" stroke="currentColor" strokeWidth="1.3"/>
    <ellipse cx="7" cy="14" rx="3" ry="4.5" stroke="currentColor" strokeWidth="1.3"/>
    <ellipse cx="21" cy="14" rx="3" ry="4.5" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="14" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
  </svg>,
  <svg key="truntum" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 3v5M14 20v5M3 14h5M20 14h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M6.5 6.5l3.5 3.5M18 18l3.5 3.5M21.5 6.5l-3.5 3.5M10 18l-3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="14" cy="14" r="1" fill="currentColor"/>
  </svg>,
]

// ── Features / Keunggulan ─────────────────────────────────────
function Features({ isi, pal }: { isi: Isi; pal: Pal }) {
  const items = asArray(isi.items ?? isi.fitur)
  return (
    <section id="keunggulan" style={{ backgroundColor: pal.sectionA }}>
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p
            className={`text-[10px] uppercase tracking-[0.35em] mb-3 ${sans.className}`}
            style={{ color: pal.accent }}
          >
            Keunggulan Kami
          </p>
          {isi.title && (
            <h2
              className={`${serif.className} font-normal leading-tight`}
              style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: pal.ink }}
            >
              {isi.title}
            </h2>
          )}
          <Ornament color={pal.gold} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it: Isi, i: number) => (
            <div
              key={i}
              className={`bt-card-feat relative p-8 rounded-2xl text-center group b-reveal b-delay-${i + 1}`}
              style={{ backgroundColor: pal.card, border: `1px solid ${pal.soft}`, boxShadow: S_SM }}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-5"
                style={{ backgroundColor: `${pal.gold}15`, color: pal.gold }}
              >
                {BATIK_ICONS[i] ?? BATIK_ICONS[0]}
              </div>
              <h3
                className={`${serif.className} text-xl mb-3 font-medium`}
                style={{ color: pal.ink }}
              >
                {it.title ?? it.judul ?? `Keunggulan ${i + 1}`}
              </h3>
              <p className={`text-sm leading-relaxed ${sans.className}`} style={{ color: pal.muted }}>
                {it.desc ?? it.deskripsi ?? ''}
              </p>
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-300 group-hover:w-16"
                style={{ width: 32, height: 2, backgroundColor: pal.accent, borderRadius: 1 }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Product List ──────────────────────────────────────────────
function ProductList({ isi, products, hasCart, primary, pal }: {
  isi: Isi; products: Product[]; hasCart?: boolean; primary?: string; pal: Pal
}) {
  const accent = primary ?? pal.accent
  return (
    <section id="koleksi" style={{ backgroundColor: pal.sectionB }}>
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p
            className={`text-[10px] uppercase tracking-[0.35em] mb-3 ${sans.className}`}
            style={{ color: pal.accent }}
          >
            Koleksi Kami
          </p>
          <h2
            className={`${serif.className} font-normal`}
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: pal.ink }}
          >
            {isi.title ?? 'Koleksi Pilihan'}
          </h2>
          <Ornament color={pal.gold} />
        </div>

        {products.length === 0 ? (
          <p className={`text-center text-sm ${sans.className}`} style={{ color: pal.muted }}>
            Koleksi segera hadir.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <div
                key={p.id}
                className={`bt-card-prod group flex flex-col rounded-2xl overflow-hidden b-reveal b-delay-${Math.min(i + 1, 3)}`}
                style={{ backgroundColor: pal.cardAlt, border: `1px solid ${pal.soft}`, boxShadow: S_SM }}
              >
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
                      style={{ backgroundColor: pal.soft, backgroundImage: kawungPattern(0.15) }}
                    >
                      <span className={`${serif.className} text-2xl`} style={{ color: pal.gold }}>✦</span>
                    </div>
                  )}
                  {p.kategori && (
                    <span
                      className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${sans.className}`}
                      style={{ backgroundColor: `${pal.dark}d0`, color: pal.onDark }}
                    >
                      {p.kategori}
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-4 gap-2">
                  <h3
                    className={`${serif.className} text-base font-medium leading-snug`}
                    style={{ color: pal.ink }}
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
function Testimonials({ isi, pal }: { isi: Isi; pal: Pal }) {
  const items = asArray(isi.items ?? isi.testimoni)
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: pal.dark }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: kawungPattern(0.06), backgroundSize: '64px 64px' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p
            className={`text-[10px] uppercase tracking-[0.35em] mb-3 ${sans.className}`}
            style={{ color: pal.gold }}
          >
            Testimoni Pelanggan
          </p>
          <h2
            className={`${serif.className} font-light`}
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: pal.onDark }}
          >
            {isi.title ?? 'Apa Kata Pelanggan'}
          </h2>
          <Ornament color={pal.gold} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((it: Isi, i: number) => (
            <blockquote
              key={i}
              className={`bt-card-testi relative p-8 rounded-2xl b-reveal b-delay-${i + 1}`}
              style={{ backgroundColor: pal.testiCard, border: `1px solid ${pal.gold}25` }}
            >
              <div
                className={`${serif.className} absolute -top-2 left-6 text-6xl leading-none pointer-events-none`}
                style={{ color: pal.gold, opacity: 0.25 }}
              >
                "
              </div>
              <p
                className={`${serif.className} italic text-lg leading-relaxed mt-2`}
                style={{ color: pal.testiQuote }}
              >
                "{it.quote ?? it.isi ?? ''}"
              </p>
              <footer
                className={`mt-5 text-[11px] font-bold uppercase tracking-widest ${sans.className}`}
                style={{ color: pal.gold }}
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
function Cta({ isi, pal }: { isi: Isi; pal: Pal }) {
  return (
    <section
      className="relative overflow-hidden text-center"
      style={{ backgroundColor: pal.accent }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: kawungPattern(0.12, 'FFFDF8'), backgroundSize: '64px 64px' }}
      />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-24">
        <h2
          className={`${serif.className} font-light leading-tight mb-4`}
          style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: pal.ctaInk }}
        >
          {isi.title ?? 'Tampil Anggun dengan Batik Asli'}
        </h2>
        {isi.subtitle && (
          <p
            className={`${serif.className} italic text-lg mb-10`}
            style={{ color: `${pal.ctaInk}99` }}
          >
            {isi.subtitle}
          </p>
        )}
        {isi.cta_text && (
          <a
            href={isi.cta_link ?? '#'}
            target="_blank"
            className={`bt-btn inline-block px-10 py-4 rounded-full font-bold text-sm uppercase tracking-[0.18em] ${sans.className}`}
            style={{ backgroundColor: pal.dark, color: pal.onDark, boxShadow: S_INDIGO }}
          >
            {isi.cta_text}
          </a>
        )}
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────
function Contact({ isi, profile, pal }: { isi: Isi; profile?: TenantProfile | null; pal: Pal }) {
  const wa     = profile?.wa ?? isi.wa
  const email  = profile?.email ?? isi.email
  const alamat = profile?.alamat ?? isi.alamat
  const jam    = profile?.jam ?? isi.jam
  return (
    <section id="kontak" style={{ backgroundColor: pal.sectionA, borderTop: `1px solid ${pal.soft}` }}>
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <p
          className={`text-[10px] uppercase tracking-[0.35em] mb-3 ${sans.className}`}
          style={{ color: pal.accent }}
        >
          Hubungi Kami
        </p>
        <h2
          className={`${serif.className} font-normal mb-2`}
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: pal.ink }}
        >
          {isi.title ?? 'Terhubung dengan Kami'}
        </h2>
        <Ornament color={pal.gold} />
        {isi.deskripsi && (
          <p className={`text-sm leading-relaxed mt-4 mb-8 ${sans.className}`} style={{ color: pal.muted }}>
            {isi.deskripsi}
          </p>
        )}
        {(alamat || jam) && (
          <div className={`text-sm mb-8 space-y-1 ${sans.className}`} style={{ color: pal.muted }}>
            {alamat && <p>{alamat}</p>}
            {jam && <p className="whitespace-pre-wrap">{jam}</p>}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank"
              className={`bt-btn px-7 py-3 rounded-full font-bold text-sm uppercase tracking-widest ${sans.className}`}
              style={{ backgroundColor: pal.accent, color: pal.onAccentBtn, boxShadow: S_AMBER }}>
              WhatsApp
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`}
              className={`bt-btn px-7 py-3 rounded-full font-bold text-sm uppercase tracking-widest ${sans.className}`}
              style={{ backgroundColor: pal.dark, color: pal.onDark, boxShadow: S_INDIGO }}>
              Email
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
    <footer style={{ backgroundColor: pal.footer }}>
      <div
        className="w-full h-10 opacity-20"
        style={{
          backgroundImage: kawungPattern(0.7, 'C8922A'),
          backgroundSize: '40px 40px',
          borderTop: `1px solid ${pal.gold}30`,
        }}
      />
      <div className="py-8 text-center">
        <Ornament color={`${pal.gold}50`} />
        <p
          className={`${serif.className} italic text-sm mt-4`}
          style={{ color: `${pal.gold}70` }}
        >
          © {new Date().getFullYear()} {nama}
        </p>
        <p
          className={`${sans.className} text-[10px] uppercase tracking-[0.3em] mt-1`}
          style={{ color: `${pal.gold}40` }}
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
        .b-delay-1 { transition-delay: 80ms; }
        .b-delay-2 { transition-delay: 160ms; }
        .b-delay-3 { transition-delay: 240ms; }
        ${EXTRA_CSS}
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
  primary,
  wa,
  variant,
}: {
  nama: string
  sections: PageSection[]
  products?: Product[]
  profile?: TenantProfile | null
  hasCart?: boolean
  slug?: string
  primary?: string
  wa?: string
  variant?: string
}) {
  const pal = getPalette(variant)
  const waContact = wa ?? profile?.wa ?? undefined

  const renderSection = (s: PageSection) => {
    const isi = (s.isi_komponen ?? {}) as Isi

    switch (s.tipe_komponen) {
      case 'hero_banner':  return <Hero key={s.id} isi={isi} pal={pal} />
      case 'features':     return <Features key={s.id} isi={isi} pal={pal} />
      case 'product_list': return <ProductList key={s.id} isi={isi} products={products} hasCart={hasCart} primary={primary} pal={pal} />
      case 'testimonials': return <Testimonials key={s.id} isi={isi} pal={pal} />
      case 'cta':          return <Cta key={s.id} isi={isi} pal={pal} />
      case 'contact_form': return <Contact key={s.id} isi={isi} profile={profile} pal={pal} />
      default:             return null
    }
  }

  return (
    <div className={`bt-root ${serif.variable} ${sans.variable}`} style={{ backgroundColor: pal.sectionB }}>
      <ScrollRevealScript />
      <TopBar nama={nama} wa={waContact} pal={pal} />
      <main>
        {sections
          .filter((s) => s.is_visible)
          .sort((a, b) => a.urutan - b.urutan)
          .map(renderSection)}
      </main>
      <Footer nama={nama} pal={pal} />
    </div>
  )
}
