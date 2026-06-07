// ============================================================
// THEME SYSTEM — adapter PageSection[]+Product[] → ComposableContent (S0-4).
// Reuse sectionsToSiteContent untuk hero/about/cta/contact, lalu tambah
// `showcase` (produk/menu) — bagian yang khas Theme System. Dipakai SiteRenderer
// saat me-route tema composable. Pola baca defensif sama seperti adapter lain.
// ============================================================
import type { PageSection, TenantProfile } from '@/types/websitebuilder'
import type { ComposableContent, ShowcaseItem, InfoLokasi, TeamMember, PricingContent, PricingPlan, ProcessContent, PartnersContent, PartnerLogo, SocialContent, SocialLink, SocialPlatform } from './manifest'
import { sectionsToSiteContent } from '@/lib/design-tokens/section-adapter'

// Bentuk minimal yang dibagi Product / MenuItem / Service (semua punya field
// ini). Composable showcase generik → satu mapper untuk semua industri.
export interface ShowcaseSourceItem {
  nama: string
  deskripsi?: string | null
  harga?: number | null
  gambar_url?: string | null
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
    }))

  const showcase = items.length ? { title: showcaseTitle, items } : undefined

  // Foto hero opsional dari "Lengkapi Website" (data_konten.foto_hero).
  const fotoHero = typeof konten.foto_hero === 'string' && konten.foto_hero.trim()
    ? konten.foto_hero.trim()
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
  const aboutImage = str(konten.about_image)
  const ctaImage = str(konten.cta_image)

  return {
    nama: base.nama,
    hero: { ...base.hero, image: fotoHero },
    features: base.features,
    showcase,
    info,
    team,
    pricing,
    process: proc,
    partners,
    social,
    about: base.about ? { ...base.about, image: aboutImage } : base.about,
    cta: base.cta ? { ...base.cta, image: ctaImage } : base.cta,
    contact: base.contact,
  }
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
