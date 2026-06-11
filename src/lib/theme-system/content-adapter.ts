// ============================================================
// THEME SYSTEM — adapter PageSection[]+Product[] → ComposableContent (S0-4).
// Reuse sectionsToSiteContent untuk hero/about/cta/contact, lalu tambah
// `showcase` (produk/menu) — bagian yang khas Theme System. Dipakai SiteRenderer
// saat me-route tema composable. Pola baca defensif sama seperti adapter lain.
// ============================================================
import type { PageSection, TenantProfile } from '@/types/websitebuilder'
import type { ComposableContent, ShowcaseItem, InfoLokasi, TeamMember, PricingContent, PricingPlan, ProcessContent, PartnersContent, PartnerLogo, SocialContent, SocialLink, SocialPlatform, Testimonial, GalleryContent, GalleryImage, StatItem, FaqItem, StatementContent, PresetBand } from './manifest'
import { sectionsToSiteContent } from '@/lib/design-tokens/section-adapter'
import { resolveWaHref, waLink } from '@/lib/wa'

// Bentuk yang dibagi Product / MenuItem / Service / (blog map). Field dasar
// dipakai semua varian; field industri (kategori/durasi_menit/stok/penulis/
// tanggal) opsional — varian khas-industri (Sprint 10a) memakainya bila ada,
// varian generik mengabaikan. Nama field = kolom DB supaya Product/Service/
// MenuItem (select *) mengalir tanpa transform; blog dipetakan di SiteRenderer.
export interface ShowcaseSourceItem {
  nama: string
  deskripsi?: string | null
  harga?: number | null
  gambar_url?: string | null
  kategori?: string | null      // products/services/menu_items
  durasi_menit?: number | null  // services
  stok?: number | null          // products
  penulis?: string | null       // blog (dipetakan dari blog_posts.penulis)
  tanggal?: string | null       // blog (dipetakan dari blog_posts.published_at)
}

export function composableContentFromSections(
  nama: string,
  sections: PageSection[],
  showcaseSource: ShowcaseSourceItem[],
  profile: TenantProfile | null,
  konten: Record<string, unknown> = {},
  showcaseTitle = 'Produk Kami',
): ComposableContent {
  const base = sectionsToSiteContent(nama, sections, profile, konten)

  const items: ShowcaseItem[] = (showcaseSource ?? [])
    .filter((p) => p?.nama)
    .slice(0, 12)
    .map((p) => ({
      nama: p.nama,
      harga: typeof p.harga === 'number' ? p.harga : undefined,
      desc: p.deskripsi ?? undefined,
      gambar: p.gambar_url ?? undefined,
      // Field khas-industri (Sprint 10a) — diteruskan bila ada; varian generik abaikan.
      kategori: p.kategori ?? undefined,
      durasi: typeof p.durasi_menit === 'number' ? p.durasi_menit : undefined,
      stok: typeof p.stok === 'number' ? p.stok : undefined,
      penulis: p.penulis ?? undefined,
      tanggal: p.tanggal ?? undefined,
    }))

  const showcase = items.length ? { title: showcaseTitle, items } : undefined

  // Foto hero opsional dari "Lengkapi Website" (data_konten.foto_hero).
  const fotoHero = typeof konten.foto_hero === 'string' && konten.foto_hero.trim()
    ? konten.foto_hero.trim()
    : undefined
  // Titik fokus foto hero (CSS background/object-position) dari brief form.
  const fotoHeroFocus = typeof konten.foto_hero_focus === 'string' && konten.foto_hero_focus.trim()
    ? konten.foto_hero_focus.trim()
    : undefined

  // Info/Lokasi (balok Sprint 5) — dirakit dari profil bisnis bila ada data
  // jam/alamat. Manifest yang mengaktifkan `info` (mis. tema restaurant) akan
  // merendernya; tema lain abaikan. Absen data → undefined → tak dirender.
  const info = buildInfoLokasi(profile)

  // Balok Sprint A/B (team/pricing/process + gambar about/cta) — diisi pasca-DP
  // lewat data_konten (form "Lengkapi Website" / draft Claude). Parser defensif:
  // entri tak valid dibuang, kosong → undefined → balok tak dirender (nol regresi
  // untuk situs lama yang data_konten-nya belum punya field ini).
  const team = parseTeam(konten.team)
  const pricing = parsePricing(konten.pricing)
  const proc = parseProcess(konten.process)
  const partners = parsePartners(konten.partners)
  const social = parseSocial(konten.social)
  // Testimoni & foto pendukung sudah dikumpulkan form "Lengkapi Website"
  // (data_konten.testimoni / .foto_items) — petakan ke balok composable.
  const testimonials = parseTestimoni(konten.testimoni)
  const gallery = galleryFromFotoItems(konten.foto_items)
  const stats = parseStats(konten.stats)
  const faq = parseFaq(konten.faq)
  // Signature band (filosofi/posisi) — dipakai tema craft/bespoke (mis. restaurant-lux).
  // data_konten.statement ({quote, cite?, eyebrow?}). Absen → balok tak dirender.
  const statement = parseStatement(konten.statement)
  // Heading section tim dari konten (human-centric). Absen → renderer pakai fallback.
  const teamEyebrow = str(konten.teamEyebrow)
  const teamTitle = str(konten.teamTitle)
  const aboutImage = str(konten.about_image)
  const ctaImage = str(konten.cta_image)
  // Band add-on (newsletter/career) — row `cta` ber-preset hasil injeksi
  // B-section. CTA utama sudah mengabaikannya (section-adapter); di sini band
  // dipetakan supaya tema composable/lux ikut merendernya (token path sudah
  // merender row-nya via SectionRenderer).
  const bands = buildPresetBands(sections, base.contact?.wa)

  return {
    nama: base.nama,
    hero: { ...base.hero, image: fotoHero, imagePosition: fotoHeroFocus },
    features: base.features,
    showcase,
    info,
    statement,
    testimonials,
    stats,
    faq,
    gallery,
    teamEyebrow,
    teamTitle,
    team,
    pricing,
    process: proc,
    partners,
    social,
    about: base.about ? { ...base.about, image: aboutImage } : base.about,
    cta: base.cta ? { ...base.cta, image: ctaImage } : base.cta,
    contact: base.contact,
    bands,
  }
}

// Row `cta` ber-isi_komponen.preset → PresetBand[]. Tanpa cta_link → jatuh ke
// WA terpusat (band ini ajakan kontak: lamaran/berlangganan via WA).
function buildPresetBands(sections: PageSection[], wa?: string): PresetBand[] | undefined {
  const out: PresetBand[] = []
  for (const s of sections) {
    if (s.tipe_komponen !== 'cta') continue
    const isi = (s.isi_komponen ?? {}) as Record<string, unknown>
    const preset = str(isi.preset)
    if (!preset) continue
    const title = str(isi.title)
    if (!title) continue
    const href = resolveWaHref(str(isi.cta_link), wa) ?? (waLink(wa) !== '#' ? waLink(wa) : undefined)
    out.push({ preset, title, subtitle: str(isi.subtitle), ctaText: str(isi.cta_text), ctaHref: href })
  }
  return out.length ? out : undefined
}

// data_konten.testimoni (bentuk form: {nama,kota,teks,bintang}) → Testimonial
// (quote/nama/peran). Dukung juga nama field composable langsung (quote/peran).
function parseTestimoni(v: unknown): Testimonial[] | undefined {
  if (!Array.isArray(v)) return undefined
  const out: Testimonial[] = []
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const quote = str(r.teks) ?? str(r.quote)
    const nama = str(r.nama)
    if (!quote || !nama) continue // quote + nama wajib
    out.push({ quote, nama, peran: str(r.kota) ?? str(r.peran) })
  }
  return out.length ? out.slice(0, 12) : undefined
}

// data_konten.statement ({quote, cite?, eyebrow?}) → signature band. quote wajib.
function parseStatement(v: unknown): StatementContent | undefined {
  if (!v || typeof v !== 'object') return undefined
  const r = v as Record<string, unknown>
  const quote = str(r.quote) ?? str(r.teks)
  if (!quote) return undefined // quote wajib
  return { quote, cite: str(r.cite), eyebrow: str(r.eyebrow) }
}

// data_konten.stats ({angka,label}) → strip angka kredibilitas.
function parseStats(v: unknown): StatItem[] | undefined {
  if (!Array.isArray(v)) return undefined
  const out: StatItem[] = []
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const angka = str(r.angka)
    const label = str(r.label)
    if (!angka || !label) continue // angka + label wajib
    out.push({ angka, label })
  }
  return out.length ? out.slice(0, 4) : undefined
}

// data_konten.faq ({q,a}) → accordion.
function parseFaq(v: unknown): FaqItem[] | undefined {
  if (!Array.isArray(v)) return undefined
  const out: FaqItem[] = []
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const q = str(r.q)
    const a = str(r.a)
    if (!q || !a) continue // q + a wajib
    out.push({ q, a })
  }
  return out.length ? out.slice(0, 10) : undefined
}

// data_konten.foto_items ({label,url}) → galeri masonry ({src,caption}).
function galleryFromFotoItems(v: unknown): GalleryContent | undefined {
  if (!Array.isArray(v)) return undefined
  const images: GalleryImage[] = []
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const src = str(r.url) ?? str(r.src)
    if (!src) continue
    images.push({ src, caption: str(r.label) ?? str(r.caption) })
  }
  return images.length ? { images } : undefined
}

// ── Parser defensif konten balok Sprint A/B dari data_konten ──
// data_konten = JSON bebas (diisi pasca-DP). Validasi ketat: field wajib harus
// string non-kosong, entri tak valid dilewati, hasil kosong → undefined.
function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}
function strList(v: unknown): string[] {
  return Array.isArray(v) ? v.map(str).filter((x): x is string => !!x) : []
}

function parseTeam(v: unknown): TeamMember[] | undefined {
  if (!Array.isArray(v)) return undefined
  const out: TeamMember[] = []
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const nama = str(r.nama)
    const peran = str(r.peran)
    if (!nama || !peran) continue // nama + peran wajib
    out.push({ nama, peran, foto: str(r.foto), bio: str(r.bio) })
  }
  return out.length ? out.slice(0, 12) : undefined
}

function parsePricing(v: unknown): PricingContent | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  if (!Array.isArray(o.plans)) return undefined
  const plans: PricingPlan[] = []
  for (const raw of o.plans) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const nama = str(r.nama)
    const harga = str(r.harga)
    if (!nama || !harga) continue // nama + harga wajib
    plans.push({
      nama, harga,
      periode: str(r.periode),
      desc: str(r.desc),
      fitur: strList(r.fitur),
      ctaText: str(r.ctaText),
      ctaHref: str(r.ctaHref),
      unggulan: r.unggulan === true,
      badge: str(r.badge),
    })
  }
  if (!plans.length) return undefined
  return { title: str(o.title), subtitle: str(o.subtitle), plans: plans.slice(0, 6) }
}

function parseProcess(v: unknown): ProcessContent | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  if (!Array.isArray(o.steps)) return undefined
  const steps: ProcessContent['steps'] = []
  for (const raw of o.steps) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const judul = str(r.judul)
    const desc = str(r.desc)
    if (!judul || !desc) continue // judul + desc wajib
    steps.push({ judul, desc })
  }
  if (!steps.length) return undefined
  return { title: str(o.title), subtitle: str(o.subtitle), steps: steps.slice(0, 8) }
}

function parsePartners(v: unknown): PartnersContent | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  if (!Array.isArray(o.logos)) return undefined
  const logos: PartnerLogo[] = []
  for (const raw of o.logos) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const nama = str(r.nama)
    if (!nama) continue // nama wajib (jadi chip teks bila tak ada logo)
    logos.push({ nama, logo: str(r.logo), href: str(r.href) })
  }
  if (!logos.length) return undefined
  return { title: str(o.title), subtitle: str(o.subtitle), logos: logos.slice(0, 24) }
}

const SOCIAL_PLATFORMS = new Set<SocialPlatform>(['instagram', 'tiktok', 'youtube', 'facebook', 'whatsapp', 'x', 'shopee', 'tokopedia', 'website'])
function parseSocial(v: unknown): SocialContent | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  if (!Array.isArray(o.links)) return undefined
  const links: SocialLink[] = []
  for (const raw of o.links) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const platform = str(r.platform)
    const href = str(r.href)
    if (!platform || !href || !SOCIAL_PLATFORMS.has(platform as SocialPlatform)) continue // platform valid + href wajib
    links.push({ platform: platform as SocialPlatform, href, label: str(r.label) })
  }
  if (!links.length) return undefined
  return { title: str(o.title), subtitle: str(o.subtitle), links: links.slice(0, 12) }
}

// Profil bisnis → InfoLokasi. Jam = string bebas (1 baris). mapsQuery dari
// alamat untuk embed Google Maps tanpa API key. Reservasi default ke WA.
function buildInfoLokasi(profile: TenantProfile | null): InfoLokasi | undefined {
  if (!profile) return undefined
  const alamat = profile.alamat?.trim() || undefined
  const jamStr = profile.jam?.trim() || undefined
  const wa = profile.wa?.trim() || undefined
  if (!alamat && !jamStr) return undefined // tak cukup data → jangan render

  return {
    jam: jamStr ? [{ hari: 'Jam Buka', jam: jamStr }] : undefined,
    alamat,
    mapsQuery: alamat,
    telp: wa,
    reservasiText: wa ? 'Pesan via WhatsApp' : undefined,
    reservasiHref: wa ? `https://wa.me/${wa.replace(/[^\d]/g, '')}` : undefined,
  }
}
