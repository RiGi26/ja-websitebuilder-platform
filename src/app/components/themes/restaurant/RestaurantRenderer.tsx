// ============================================================
// Tema visual "restaurant" — desain bespoke (BUKAN template generik).
// Palet hangat espresso/krem/terracotta, tipografi serif display (Playfair),
// hero full-screen, menu bergaya klasik dengan dotted leader, galeri food.
// Dipilih oleh src/app/[slug]/page.tsx saat konfigurasi.branding.theme==='restaurant'.
// Membaca PageSection.isi_komponen (JSONB) secara defensif.
// ============================================================

import { Playfair_Display } from 'next/font/google'
import type { PageSection, MenuItem } from '@/types/websitebuilder'

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

// Palet
const INK = '#1C1714'      // espresso gelap
const CREAM = '#F7F0E6'    // krem
const PAPER = '#FBF7F0'    // krem terang
const CLAY = '#B5532A'     // terracotta aksen
const MUTED = '#8A7E72'    // teks sekunder

type Isi = Record<string, any>
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : [] }
function rupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(n) || 0)
}

// ── Nav tipis (sticky) ────────────────────────────────────────
function TopBar({ nama, wa }: { nama: string; wa?: string }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md" style={{ backgroundColor: 'rgba(28,23,20,0.82)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className={`${display.className} text-lg tracking-wide`} style={{ color: CREAM }}>{nama}</span>
        <nav className="hidden sm:flex items-center gap-7 text-[12px] uppercase tracking-[0.18em]" style={{ color: '#D9CEC0' }}>
          <a href="#cerita" className="hover:opacity-70 transition-opacity">Cerita</a>
          <a href="#menu" className="hover:opacity-70 transition-opacity">Menu</a>
          <a href="#galeri" className="hover:opacity-70 transition-opacity">Galeri</a>
          <a href="#kunjungi" className="hover:opacity-70 transition-opacity">Kunjungi</a>
        </nav>
        {wa && (
          <a href={`https://wa.me/${wa}`} target="_blank" className="text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full transition-transform hover:scale-[1.03]" style={{ backgroundColor: CLAY, color: CREAM }}>
            Reservasi
          </a>
        )}
      </div>
    </header>
  )
}

// ── Hero full-screen ──────────────────────────────────────────
function Hero({ isi }: { isi: Isi }) {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center text-center overflow-hidden" style={{ backgroundColor: INK }}>
      {isi.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={isi.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(28,23,20,0.45) 0%, rgba(28,23,20,0.35) 40%, rgba(28,23,20,0.85) 100%)' }} />
      <div className="relative px-6 max-w-3xl">
        {isi.eyebrow && (
          <p className="text-[12px] font-semibold uppercase tracking-[0.35em] mb-6" style={{ color: '#E4B27A' }}>{isi.eyebrow}</p>
        )}
        <h1 className={`${display.className} text-5xl md:text-7xl leading-[1.05] font-medium`} style={{ color: CREAM }}>
          {isi.title ?? 'Nama Restoran'}
        </h1>
        {isi.subtitle && (
          <p className="mt-7 text-base md:text-lg leading-relaxed mx-auto max-w-xl" style={{ color: '#D9CEC0' }}>{isi.subtitle}</p>
        )}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <a href="#menu" className="px-7 py-3.5 rounded-full text-[12px] font-bold uppercase tracking-[0.18em] transition-transform hover:scale-[1.03]" style={{ backgroundColor: CLAY, color: CREAM }}>
            {isi.cta_text ?? 'Lihat Menu'}
          </a>
          {isi.wa && (
            <a href={`https://wa.me/${isi.wa}`} target="_blank" className="px-7 py-3.5 rounded-full text-[12px] font-bold uppercase tracking-[0.18em] border transition-colors hover:bg-white/10" style={{ borderColor: 'rgba(247,240,230,0.4)', color: CREAM }}>
              Reservasi Meja
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Cerita (about) — dua kolom ────────────────────────────────
function Story({ isi }: { isi: Isi }) {
  return (
    <section id="cerita" className="py-24 px-6" style={{ backgroundColor: PAPER }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          {isi.eyebrow && <p className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-4" style={{ color: CLAY }}>{isi.eyebrow}</p>}
          <h2 className={`${display.className} text-4xl md:text-5xl leading-tight mb-6`} style={{ color: INK }}>{isi.title ?? 'Cerita Kami'}</h2>
          <p className="leading-[1.9] whitespace-pre-wrap" style={{ color: MUTED }}>{isi.body ?? ''}</p>
        </div>
        {isi.image_url && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={isi.image_url} alt="" className="rounded-[20px] w-full aspect-[4/5] object-cover shadow-xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full -z-0" style={{ backgroundColor: CLAY, opacity: 0.15 }} />
          </div>
        )}
      </div>
    </section>
  )
}

// ── Menu — bergaya klasik, dikelompokkan per kategori ─────────
// Sumber utama: tabel menu_items (dikelola customer). Fallback: isi.items section.
function Menu({ isi, menuItems }: { isi: Isi; menuItems?: MenuItem[] }) {
  const items: Isi[] = (menuItems && menuItems.length > 0)
    ? menuItems.map((m) => ({ nama: m.nama, harga: m.harga, desc: m.deskripsi, kategori: m.kategori ?? 'Menu' }))
    : asArray(isi.items)
  const kategoris: string[] = [...new Set(items.map((i: Isi) => i.kategori ?? 'Menu'))]
  return (
    <section id="menu" className="py-24 px-6" style={{ backgroundColor: INK }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: '#E4B27A' }}>Sajian Kami</p>
          <h2 className={`${display.className} text-4xl md:text-5xl`} style={{ color: CREAM }}>{isi.title ?? 'Menu'}</h2>
        </div>
        <div className="space-y-14">
          {kategoris.map((kat) => (
            <div key={kat}>
              <h3 className={`${display.className} italic text-2xl mb-7 text-center`} style={{ color: '#E4B27A' }}>{kat}</h3>
              <ul className="space-y-5">
                {items.filter((i: Isi) => (i.kategori ?? 'Menu') === kat).map((it: Isi, idx: number) => (
                  <li key={idx}>
                    <div className="flex items-baseline gap-3">
                      <span className="text-lg" style={{ color: CREAM }}>{it.nama ?? it.name}</span>
                      <span className="flex-1 border-b border-dotted" style={{ borderColor: 'rgba(247,240,230,0.25)' }} />
                      <span className="text-lg font-medium" style={{ color: '#E4B27A' }}>{rupiah(it.harga ?? it.price)}</span>
                    </div>
                    {(it.desc ?? it.deskripsi) && (
                      <p className="text-sm mt-1 max-w-md" style={{ color: MUTED }}>{it.desc ?? it.deskripsi}</p>
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
function Gallery({ isi }: { isi: Isi }) {
  const images = asArray(isi.images ?? isi.gambar)
  if (images.length === 0) return null
  return (
    <section id="galeri" className="py-24 px-6" style={{ backgroundColor: CREAM }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: CLAY }}>Suasana</p>
          <h2 className={`${display.className} text-4xl md:text-5xl`} style={{ color: INK }}>{isi.title ?? 'Galeri'}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((src: any, i: number) => (
            <div key={i} className={i % 5 === 0 ? 'col-span-2 row-span-2' : ''}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={typeof src === 'string' ? src : src?.url} alt="" className="rounded-2xl w-full h-full object-cover aspect-square" style={{ backgroundColor: '#E5DACB' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Kunjungi (kontak/jam/lokasi) ──────────────────────────────
function Visit({ isi }: { isi: Isi }) {
  return (
    <section id="kunjungi" className="py-24 px-6" style={{ backgroundColor: PAPER }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-4" style={{ color: CLAY }}>Kunjungi Kami</p>
          <h2 className={`${display.className} text-4xl md:text-5xl leading-tight mb-8`} style={{ color: INK }}>{isi.title ?? 'Sampai Jumpa di Meja Kami'}</h2>
          <div className="space-y-5 text-[15px]" style={{ color: MUTED }}>
            {isi.alamat && (<div><p className="text-[11px] uppercase tracking-[0.2em] mb-1" style={{ color: INK }}>Alamat</p><p>{isi.alamat}</p></div>)}
            {isi.jam && (<div><p className="text-[11px] uppercase tracking-[0.2em] mb-1" style={{ color: INK }}>Jam Buka</p><p className="whitespace-pre-wrap">{isi.jam}</p></div>)}
            <div className="flex flex-wrap gap-3 pt-2">
              {isi.wa && <a href={`https://wa.me/${isi.wa}`} target="_blank" className="px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-[0.16em]" style={{ backgroundColor: CLAY, color: CREAM }}>Reservasi via WhatsApp</a>}
              {isi.email && <a href={`mailto:${isi.email}`} className="px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-[0.16em] border" style={{ borderColor: INK, color: INK }}>Email</a>}
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
function Closing({ isi }: { isi: Isi }) {
  return (
    <section className="py-28 px-6 text-center" style={{ backgroundColor: INK }}>
      <div className="max-w-2xl mx-auto">
        <h2 className={`${display.className} text-4xl md:text-5xl`} style={{ color: CREAM }}>{isi.title ?? 'Pesan Meja Anda'}</h2>
        {isi.subtitle && <p className="mt-4" style={{ color: MUTED }}>{isi.subtitle}</p>}
        {isi.wa && (
          <a href={`https://wa.me/${isi.wa}`} target="_blank" className="inline-block mt-9 px-9 py-4 rounded-full text-[12px] font-bold uppercase tracking-[0.2em] transition-transform hover:scale-[1.03]" style={{ backgroundColor: CLAY, color: CREAM }}>
            {isi.cta_text ?? 'Reservasi Sekarang'}
          </a>
        )}
      </div>
    </section>
  )
}

function Footer({ nama }: { nama: string }) {
  return (
    <footer className="py-10 px-6 text-center" style={{ backgroundColor: '#15110E' }}>
      <p className={`${display.className} text-lg`} style={{ color: CREAM }}>{nama}</p>
      <p className="text-[11px] uppercase tracking-[0.2em] mt-2" style={{ color: MUTED }}>© {new Date().getFullYear()} · Dibuat dengan Japan Arena</p>
    </footer>
  )
}

export default function RestaurantRenderer({
  nama, sections, wa, menuItems,
}: {
  nama: string
  sections: PageSection[]
  wa?: string
  menuItems?: MenuItem[]
}) {
  return (
    <main style={{ backgroundColor: PAPER }}>
      <TopBar nama={nama} wa={wa} />
      {sections.map((s) => {
        const isi = (s.isi_komponen ?? {}) as Isi
        switch (s.tipe_komponen) {
          case 'hero_banner': return <Hero key={s.id} isi={isi} />
          case 'about': return <Story key={s.id} isi={isi} />
          case 'pricing_table': return <Menu key={s.id} isi={isi} menuItems={menuItems} />
          case 'gallery': return <Gallery key={s.id} isi={isi} />
          case 'contact_form': return <Visit key={s.id} isi={isi} />
          case 'cta': return <Closing key={s.id} isi={isi} />
          default: return null
        }
      })}
      <Footer nama={nama} />
    </main>
  )
}
