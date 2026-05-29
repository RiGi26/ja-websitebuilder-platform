// ============================================================
// Section Renderer — memetakan PageSection.tipe_komponen ke komponen
// tampilan publik. Membaca isi_komponen (JSONB freeform) secara defensif
// dengan default aman. Dipakai oleh src/app/[slug]/page.tsx.
// ============================================================

import type { PageSection, TipeKomponen } from '@/types/websitebuilder'

type Isi = Record<string, any>

// helper baca array string dari isi_komponen
function asArray(v: unknown): any[] {
  return Array.isArray(v) ? v : []
}

// ── Hero ──────────────────────────────────────────────────────
function HeroBanner({ isi }: { isi: Isi }) {
  return (
    <section className="px-6 py-24 md:py-32 text-center bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto">
        {isi.eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-apple-blue mb-4">{isi.eyebrow}</p>
        )}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          {isi.title ?? isi.judul ?? 'Judul Hero'}
        </h1>
        {(isi.subtitle ?? isi.subjudul) && (
          <p className="mt-6 text-lg text-gray-500">{isi.subtitle ?? isi.subjudul}</p>
        )}
        {isi.cta_text && (
          <a
            href={isi.cta_link ?? '#'}
            className="inline-block mt-8 px-8 py-3 bg-apple-blue text-white rounded-2xl font-bold hover:bg-blue-600 transition-colors"
          >
            {isi.cta_text}
          </a>
        )}
        {isi.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={isi.image_url} alt="" className="mt-12 rounded-3xl mx-auto shadow-xl" />
        )}
      </div>
    </section>
  )
}

// ── About ─────────────────────────────────────────────────────
function About({ isi }: { isi: Isi }) {
  return (
    <section className="px-6 py-20 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{isi.title ?? 'Tentang Kami'}</h2>
      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{isi.body ?? isi.deskripsi ?? ''}</p>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────
function Features({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.fitur)
  return (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {isi.title && <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{isi.title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((it: Isi, i: number) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-black/5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{it.title ?? it.judul ?? `Fitur ${i + 1}`}</h3>
              <p className="text-sm text-gray-500">{it.desc ?? it.deskripsi ?? ''}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────
function Stats({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.stats)
  return (
    <section className="px-6 py-16">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((it: Isi, i: number) => (
          <div key={i}>
            <p className="text-4xl font-extrabold text-apple-blue">{it.value ?? it.angka ?? '0'}</p>
            <p className="text-sm text-gray-500 mt-1">{it.label ?? ''}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Gallery ───────────────────────────────────────────────────
function Gallery({ isi }: { isi: Isi }) {
  const images = asArray(isi.images ?? isi.gambar)
  return (
    <section className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {isi.title && <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{isi.title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src: any, i: number) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={typeof src === 'string' ? src : src?.url} alt="" className="rounded-2xl w-full object-cover aspect-square" />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────
function Testimonials({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.testimoni)
  return (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {isi.title && <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{isi.title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((it: Isi, i: number) => (
            <blockquote key={i} className="bg-white p-6 rounded-3xl border border-black/5">
              <p className="text-gray-600 italic">“{it.quote ?? it.isi ?? ''}”</p>
              <footer className="mt-4 text-sm font-bold text-gray-900">{it.name ?? it.nama ?? ''}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Team ──────────────────────────────────────────────────────
function Team({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.tim)
  return (
    <section className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {isi.title && <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{isi.title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {items.map((it: Isi, i: number) => (
            <div key={i}>
              {it.foto_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.foto_url} alt="" className="w-24 h-24 rounded-full mx-auto object-cover mb-3" />
              )}
              <p className="font-bold text-gray-900">{it.nama ?? it.name ?? ''}</p>
              <p className="text-sm text-gray-500">{it.jabatan ?? it.role ?? ''}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────
function PricingTable({ isi }: { isi: Isi }) {
  const plans = asArray(isi.plans ?? isi.paket)
  return (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {isi.title && <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{isi.title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p: Isi, i: number) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-black/5 text-center">
              <h3 className="text-lg font-bold text-gray-900">{p.nama ?? p.name ?? ''}</h3>
              <p className="text-3xl font-extrabold text-apple-blue my-4">{p.harga ?? p.price ?? ''}</p>
              <ul className="text-sm text-gray-500 space-y-2">
                {asArray(p.fitur ?? p.features).map((f: string, j: number) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────
function Faq({ isi }: { isi: Isi }) {
  const items = asArray(isi.items ?? isi.faq)
  return (
    <section className="px-6 py-20 max-w-3xl mx-auto">
      {isi.title && <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{isi.title}</h2>}
      <div className="space-y-4">
        {items.map((it: Isi, i: number) => (
          <details key={i} className="bg-gray-50 rounded-2xl p-5 border border-black/5">
            <summary className="font-bold text-gray-900 cursor-pointer">{it.q ?? it.pertanyaan ?? ''}</summary>
            <p className="mt-3 text-sm text-gray-600">{it.a ?? it.jawaban ?? ''}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────
function Cta({ isi }: { isi: Isi }) {
  return (
    <section className="px-6 py-20 text-center bg-[#1D1D1F] text-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold">{isi.title ?? 'Siap memulai?'}</h2>
        {isi.subtitle && <p className="mt-3 text-gray-400">{isi.subtitle}</p>}
        {isi.cta_text && (
          <a href={isi.cta_link ?? '#'} className="inline-block mt-8 px-8 py-3 bg-apple-blue text-white rounded-2xl font-bold hover:bg-blue-600 transition-colors">
            {isi.cta_text}
          </a>
        )}
      </div>
    </section>
  )
}

// ── Contact form (statis — submit ke wa/email) ────────────────
function ContactForm({ isi }: { isi: Isi }) {
  return (
    <section className="px-6 py-20 max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{isi.title ?? 'Hubungi Kami'}</h2>
      {isi.deskripsi && <p className="text-gray-500 mb-8">{isi.deskripsi}</p>}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {isi.wa && (
          <a href={`https://wa.me/${isi.wa}`} className="px-6 py-3 bg-green-500 text-white rounded-2xl font-bold">WhatsApp</a>
        )}
        {isi.email && (
          <a href={`mailto:${isi.email}`} className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold">Email</a>
        )}
      </div>
    </section>
  )
}

// ── Embeds ────────────────────────────────────────────────────
function VideoEmbed({ isi }: { isi: Isi }) {
  if (!isi.url) return null
  return (
    <section className="px-6 py-16 max-w-3xl mx-auto">
      <div className="aspect-video rounded-2xl overflow-hidden">
        <iframe src={isi.url} className="w-full h-full" allowFullScreen title="video" />
      </div>
    </section>
  )
}

function MapEmbed({ isi }: { isi: Isi }) {
  if (!isi.url && !isi.maps_url) return null
  return (
    <section className="px-6 py-16 max-w-4xl mx-auto">
      <div className="aspect-video rounded-2xl overflow-hidden">
        <iframe src={isi.url ?? isi.maps_url} className="w-full h-full" title="map" loading="lazy" />
      </div>
    </section>
  )
}

function CustomHtml({ isi }: { isi: Isi }) {
  if (!isi.html) return null
  // Konten dibuat oleh tim studio (tepercaya), bukan input publik.
  return <section className="px-6 py-10" dangerouslySetInnerHTML={{ __html: String(isi.html) }} />
}

// ── Placeholder add-on (data dari tabel bersama — Stage 3) ────
function AddonPlaceholder({ label }: { label: string }) {
  return (
    <section className="px-6 py-16 max-w-4xl mx-auto">
      <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center text-gray-400">
        <p className="text-sm font-bold uppercase tracking-widest">{label}</p>
        <p className="text-xs mt-1">Konten add-on ini akan tampil setelah data diisi (Stage 3).</p>
      </div>
    </section>
  )
}

// ── Renderer utama ────────────────────────────────────────────
const MAP: Partial<Record<TipeKomponen, (p: { isi: Isi }) => React.ReactElement | null>> = {
  hero_banner: HeroBanner,
  about: About,
  features: Features,
  stats: Stats,
  gallery: Gallery,
  testimonials: Testimonials,
  team: Team,
  pricing_table: PricingTable,
  faq: Faq,
  cta: Cta,
  contact_form: ContactForm,
  video_embed: VideoEmbed,
  map_embed: MapEmbed,
  custom_html: CustomHtml,
}

const ADDON_LABEL: Partial<Record<TipeKomponen, string>> = {
  product_list: 'Daftar Produk',
  blog_list: 'Daftar Artikel',
  social_feed: 'Social Feed',
}

export function SectionRenderer({ section }: { section: PageSection }) {
  const isi = (section.isi_komponen ?? {}) as Isi
  const Comp = MAP[section.tipe_komponen]
  if (Comp) return <Comp isi={isi} />
  if (ADDON_LABEL[section.tipe_komponen]) {
    return <AddonPlaceholder label={ADDON_LABEL[section.tipe_komponen]!} />
  }
  return null
}
