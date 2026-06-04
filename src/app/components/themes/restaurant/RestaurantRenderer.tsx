// ============================================================
// Tema visual "restaurant" — dua variant nyata (F2):
//  - rustic (default): Rustic Warm — espresso/krem/terracotta, section campur
//    terang+gelap, hangat & cozy. IDENTIK desain lama (no regression).
//  - modern: Modern Dark — fine dining, slate gelap merata + aksen champagne
//    gold, elegan. Section Story/Galeri/Visit di-flip jadi permukaan gelap.
// Renderer aslinya pakai token dwiperan (INK = bg-section-gelap DAN teks-gelap
// di section terang; CLAY = aksen tombol DAN eyebrow). Palet dipecah jadi peran
// semantik (darkBg/lightBg/heading/clay/gold/...) supaya variant modern bisa
// membalik terang<->gelap tanpa rusak. Tipografi serif display (Playfair).
// Dipilih oleh src/app/[slug]/page.tsx saat konfigurasi.branding.theme==='restaurant'.
// Membaca PageSection.isi_komponen (JSONB) secara defensif.
// ============================================================

import { Playfair_Display } from 'next/font/google'
import type { PageSection, MenuItem, GalleryImage, TenantProfile } from '@/types/websitebuilder'

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

// ── Palette per variant (peran semantik) ─────────────────────
interface Pal {
  darkBg: string      // bg section gelap (hero/menu/closing)        — eks-INK(bg)
  darkBgDeep: string  // bg footer (lebih gelap)                     — eks-#15110E
  lightBg: string     // bg section "terang" (story/visit)           — eks-PAPER
  galleryBg: string   // bg galeri                                   — eks-CREAM
  cream: string       // teks utama di atas darkBg                   — eks-CREAM
  creamMuted: string  // teks sekunder di atas darkBg (nav/subtitle) — eks-#D9CEC0
  heading: string     // heading/teks tegas di section terang        — eks-INK(text)
  muted: string       // teks sekunder (body)                        — eks-MUTED
  clay: string        // aksen primer: tombol + eyebrow section terang — eks-CLAY
  onClay: string      // teks di atas tombol clay                    — eks-CREAM
  gold: string        // aksen di atas darkBg (eyebrow/kategori/harga) — eks-#E4B27A
  shadowClay: string  // shadow tombol clay                          — eks-S_CLAY
  dottedBorder: string // garis titik leader menu                    — eks-rgba CREAM .25
  heroOutline: string  // border tombol outline hero                 — eks-rgba CREAM .4
  galleryPlaceholder: string // bg placeholder gambar galeri         — eks-#E5DACB
  menuHover: string    // bg hover baris menu                        — eks-rgba CLAY .04
}

const PALETTES: Record<string, Pal> = {
  // Rustic Warm (default — identik desain lama, no regression)
  rustic: {
    darkBg: '#1C1714', darkBgDeep: '#15110E', lightBg: '#FBF7F0', galleryBg: '#F7F0E6',
    cream: '#F7F0E6', creamMuted: '#D9CEC0', heading: '#1C1714', muted: '#8A7E72',
    clay: '#B5532A', onClay: '#F7F0E6', gold: '#E4B27A',
    shadowClay: '0 8px 24px rgba(181,83,42,.32), 0 2px 8px rgba(181,83,42,.16)',
    dottedBorder: 'rgba(247,240,230,0.25)', heroOutline: 'rgba(247,240,230,0.4)',
    galleryPlaceholder: '#E5DACB', menuHover: 'rgba(181,83,42,.04)',
  },
  // Modern Dark — fine dining, slate gelap merata + champagne gold
  modern: {
    darkBg: '#14171A', darkBgDeep: '#0E1012', lightBg: '#1B1F23', galleryBg: '#1B1F23',
    cream: '#F2EFE9', creamMuted: '#AAB0B7', heading: '#F2EFE9', muted: '#8B9097',
    clay: '#B8893E', onClay: '#14171A', gold: '#D9B978',
    shadowClay: '0 8px 24px rgba(184,137,62,.34), 0 2px 8px rgba(184,137,62,.18)',
    dottedBorder: 'rgba(242,239,233,0.18)', heroOutline: 'rgba(242,239,233,0.35)',
    galleryPlaceholder: '#23282D', menuHover: 'rgba(184,137,62,.06)',
  },
}

function getPalette(variant?: string): Pal {
  return PALETTES[variant ?? 'rustic'] ?? PALETTES.rustic
}

const EASE = 'cubic-bezier(0.16,1,0.3,1)'
function rtCss(pal: Pal): string {
  return `
  .rt-root{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-variant-numeric:tabular-nums}
  .rt-btn{transition:transform 200ms ${EASE},box-shadow 200ms ease}
  .rt-btn:hover{transform:translateY(-2px)}.rt-btn:active{transform:scale(0.96)}
  .rt-menu-item{transition:background 150ms ease,padding-left 150ms ease}
  .rt-menu-item:hover{background:${pal.menuHover};padding-left:4px}
  .rt-wa{transition:transform 220ms cubic-bezier(0.34,1.56,0.64,1)}.rt-wa:hover{transform:scale(1.12)}
`
}

type Isi = Record<string, any>
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : [] }
function rupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(n) || 0)
}

// ── Nav tipis (sticky) ────────────────────────────────────────
function TopBar({ nama, wa, pal }: { nama: string; wa?: string; pal: Pal }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md" style={{ backgroundColor: `${pal.darkBg}D1` }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className={`${display.className} text-lg tracking-wide`} style={{ color: pal.cream }}>{nama}</span>
        <nav className="hidden sm:flex items-center gap-7 text-[12px] uppercase tracking-[0.18em]" style={{ color: pal.creamMuted }}>
          <a href="#cerita" className="hover:opacity-70 transition-opacity">Cerita</a>
          <a href="#menu" className="hover:opacity-70 transition-opacity">Menu</a>
          <a href="#galeri" className="hover:opacity-70 transition-opacity">Galeri</a>
          <a href="#kunjungi" className="hover:opacity-70 transition-opacity">Kunjungi</a>
        </nav>
        {wa && (
          <a href={`https://wa.me/${wa}`} target="_blank" className="rt-btn text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full" style={{ backgroundColor: pal.clay, color: pal.onClay, boxShadow: pal.shadowClay }}>
            Reservasi
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero full-screen ──────────────────────────────────────────
function Hero({ isi, pal }: { isi: Isi; pal: Pal }) {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center text-center overflow-hidden" style={{ backgroundColor: pal.darkBg }}>
      {isi.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={isi.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      )}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${pal.darkBg}73 0%, ${pal.darkBg}59 40%, ${pal.darkBg}D9 100%)` }} />
      <div className="relative px-6 max-w-3xl">
        {isi.eyebrow && (
          <p className="text-[12px] font-semibold uppercase tracking-[0.35em] mb-6" style={{ color: pal.gold }}>{isi.eyebrow}</p>
        )}
        <h1 className={`${display.className} text-5xl md:text-7xl leading-[1.05] font-medium`} style={{ color: pal.cream }}>
          {isi.title ?? 'Nama Restoran'}
        </h1>
        {isi.subtitle && (
          <p className="mt-7 text-base md:text-lg leading-relaxed mx-auto max-w-xl" style={{ color: pal.creamMuted }}>{isi.subtitle}</p>
        )}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <a href="#menu" className="rt-btn px-7 py-3.5 rounded-full text-[12px] font-bold uppercase tracking-[0.18em]" style={{ backgroundColor: pal.clay, color: pal.onClay, boxShadow: pal.shadowClay }}>
            {isi.cta_text ?? 'Lihat Menu'}
          </a>
          {isi.wa && (
            <a href={`https://wa.me/${isi.wa}`} target="_blank" className="px-7 py-3.5 rounded-full text-[12px] font-bold uppercase tracking-[0.18em] border transition-colors hover:bg-white/10" style={{ borderColor: pal.heroOutline, color: pal.cream }}>
              Reservasi Meja
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Cerita (about) — dua kolom ────────────────────────────────
function Story({ isi, pal }: { isi: Isi; pal: Pal }) {
  return (
    <section id="cerita" className="py-24 px-6" style={{ backgroundColor: pal.lightBg }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          {isi.eyebrow && <p className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-4" style={{ color: pal.clay }}>{isi.eyebrow}</p>}
          <h2 className={`${display.className} text-4xl md:text-5xl leading-tight mb-6`} style={{ color: pal.heading }}>{isi.title ?? 'Cerita Kami'}</h2>
          <p className="leading-[1.9] whitespace-pre-wrap" style={{ color: pal.muted }}>{isi.body ?? ''}</p>
        </div>
        {isi.image_url && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={isi.image_url} alt="" className="rounded-[20px] w-full aspect-[4/5] object-cover shadow-xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full -z-0" style={{ backgroundColor: pal.clay, opacity: 0.15 }} />
          </div>
        )}
      </div>
    </section>
  )
}

// ── Menu — bergaya klasik, dikelompokkan per kategori ─────────
// Sumber utama: tabel menu_items (dikelola customer). Fallback: isi.items section.
function Menu({ isi, menuItems, pal }: { isi: Isi; menuItems?: MenuItem[]; pal: Pal }) {
  const items: Isi[] = (menuItems && menuItems.length > 0)
    ? menuItems.map((m) => ({ nama: m.nama, harga: m.harga, desc: m.deskripsi, kategori: m.kategori ?? 'Menu' }))
    : asArray(isi.items)
  const kategoris: string[] = [...new Set(items.map((i: Isi) => i.kategori ?? 'Menu'))]
  return (
    <section id="menu" className="py-24 px-6" style={{ backgroundColor: pal.darkBg }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: pal.gold }}>Sajian Kami</p>
          <h2 className={`${display.className} text-4xl md:text-5xl`} style={{ color: pal.cream }}>{isi.title ?? 'Menu'}</h2>
        </div>
        <div className="space-y-14">
          {kategoris.map((kat) => (
            <div key={kat}>
              <h3 className={`${display.className} italic text-2xl mb-7 text-center`} style={{ color: pal.gold }}>{kat}</h3>
              <ul className="space-y-5">
                {items.filter((i: Isi) => (i.kategori ?? 'Menu') === kat).map((it: Isi, idx: number) => (
                  <li key={idx}>
                    <div className="flex items-baseline gap-3">
                      <span className="text-lg" style={{ color: pal.cream }}>{it.nama ?? it.name}</span>
                      <span className="flex-1 border-b border-dotted" style={{ borderColor: pal.dottedBorder }} />
                      <span className="text-lg font-medium" style={{ color: pal.gold }}>{rupiah(it.harga ?? it.price)}</span>
                    </div>
                    {(it.desc ?? it.deskripsi) && (
                      <p className="text-sm mt-1 max-w-md" style={{ color: pal.muted }}>{it.desc ?? it.deskripsi}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Galeri — grid asimetris ───────────────────────────────────
function Gallery({ isi, gallery, pal }: { isi: Isi; gallery?: GalleryImage[]; pal: Pal }) {
  const images = (gallery && gallery.length > 0) ? gallery.map((g) => g.url) : asArray(isi.images ?? isi.gambar)
  if (images.length === 0) return null
  return (
    <section id="galeri" className="py-24 px-6" style={{ backgroundColor: pal.galleryBg }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: pal.clay }}>Suasana</p>
          <h2 className={`${display.className} text-4xl md:text-5xl`} style={{ color: pal.heading }}>{isi.title ?? 'Galeri'}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((src: any, i: number) => (
            <div key={i} className={i % 5 === 0 ? 'col-span-2 row-span-2' : ''}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={typeof src === 'string' ? src : src?.url} alt="" className="rounded-2xl w-full h-full object-cover aspect-square" style={{ backgroundColor: pal.galleryPlaceholder }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Kunjungi (kontak/jam/lokasi) ──────────────────────────────
// Profil bisnis dari tabel tenant_profile (customer) menimpa isi section.
function Visit({ isi, profile, pal }: { isi: Isi; profile?: TenantProfile | null; pal: Pal }) {
  isi = {
    ...isi,
    alamat: profile?.alamat ?? isi.alamat,
    jam: profile?.jam ?? isi.jam,
    wa: profile?.wa ?? isi.wa,
    email: profile?.email ?? isi.email,
    maps_url: profile?.maps_url ?? isi.maps_url,
  }
  return (
    <section id="kunjungi" className="py-24 px-6" style={{ backgroundColor: pal.lightBg }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-4" style={{ color: pal.clay }}>Kunjungi Kami</p>
          <h2 className={`${display.className} text-4xl md:text-5xl leading-tight mb-8`} style={{ color: pal.heading }}>{isi.title ?? 'Sampai Jumpa di Meja Kami'}</h2>
          <div className="space-y-5 text-[15px]" style={{ color: pal.muted }}>
            {isi.alamat && (<div><p className="text-[11px] uppercase tracking-[0.2em] mb-1" style={{ color: pal.heading }}>Alamat</p><p>{isi.alamat}</p></div>)}
            {isi.jam && (<div><p className="text-[11px] uppercase tracking-[0.2em] mb-1" style={{ color: pal.heading }}>Jam Buka</p><p className="whitespace-pre-wrap">{isi.jam}</p></div>)}
            <div className="flex flex-wrap gap-3 pt-2">
              {isi.wa && <a href={`https://wa.me/${isi.wa}`} target="_blank" className="rt-btn px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-[0.16em]" style={{ backgroundColor: pal.clay, color: pal.onClay, boxShadow: pal.shadowClay }}>Reservasi via WhatsApp</a>}
              {isi.email && <a href={`mailto:${isi.email}`} className="px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-[0.16em] border" style={{ borderColor: pal.heading, color: pal.heading }}>Email</a>}
            </div>
          </div>
        </div>
        {isi.maps_url && (
          <div className="rounded-[20px] overflow-hidden min-h-[320px] shadow-lg">
            <iframe src={isi.maps_url} className="w-full h-full min-h-[320px]" loading="lazy" title="peta" />
          </div>
        )}
      </div>
    </section>
  )
}

// ── CTA penutup ───────────────────────────────────────────────
function Closing({ isi, pal }: { isi: Isi; pal: Pal }) {
  return (
    <section className="py-28 px-6 text-center" style={{ backgroundColor: pal.darkBg }}>
      <div className="max-w-2xl mx-auto">
        <h2 className={`${display.className} text-4xl md:text-5xl`} style={{ color: pal.cream }}>{isi.title ?? 'Pesan Meja Anda'}</h2>
        {isi.subtitle && <p className="mt-4" style={{ color: pal.muted }}>{isi.subtitle}</p>}
        {isi.wa && (
          <a href={`https://wa.me/${isi.wa}`} target="_blank" className="rt-btn inline-block mt-9 px-9 py-4 rounded-full text-[12px] font-bold uppercase tracking-[0.2em]" style={{ backgroundColor: pal.clay, color: pal.onClay, boxShadow: pal.shadowClay }}>
            {isi.cta_text ?? 'Reservasi Sekarang'}
          </a>
        )}
      </div>
    </section>
  )
}

function Footer({ nama, pal }: { nama: string; pal: Pal }) {
  return (
    <footer className="py-10 px-6 text-center" style={{ backgroundColor: pal.darkBgDeep }}>
      <p className={`${display.className} text-lg`} style={{ color: pal.cream }}>{nama}</p>
      <p className="text-[11px] uppercase tracking-[0.2em] mt-2" style={{ color: pal.muted }}>© {new Date().getFullYear()} · Dibuat dengan Japan Arena</p>
    </footer>
  )
}

export default function RestaurantRenderer({
  nama, sections, wa, menuItems, gallery, profile, variant,
}: {
  nama: string
  sections: PageSection[]
  wa?: string
  menuItems?: MenuItem[]
  gallery?: GalleryImage[]
  profile?: TenantProfile | null
  variant?: string
}) {
  const pal = getPalette(variant)
  return (
    <main className="rt-root" style={{ backgroundColor: pal.lightBg }}>
      <style dangerouslySetInnerHTML={{ __html: rtCss(pal) }} />
      <TopBar nama={nama} wa={wa} pal={pal} />
      {sections.map((s) => {
        const isi = (s.isi_komponen ?? {}) as Isi
        switch (s.tipe_komponen) {
          case 'hero_banner': return <Hero key={s.id} isi={isi} pal={pal} />
          case 'about': return <Story key={s.id} isi={isi} pal={pal} />
          case 'pricing_table': return <Menu key={s.id} isi={isi} menuItems={menuItems} pal={pal} />
          case 'gallery': return <Gallery key={s.id} isi={isi} gallery={gallery} pal={pal} />
          case 'contact_form': return <Visit key={s.id} isi={isi} profile={profile} pal={pal} />
          case 'cta': return <Closing key={s.id} isi={isi} pal={pal} />
          default: return null
        }
      })}
      <Footer nama={nama} pal={pal} />
    </main>
  )
}
