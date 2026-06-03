// ============================================================
// Adapter: PageSection[] (output build_order) → SiteContent
// (input TokenDrivenRenderer). Membaca isi_komponen defensif,
// pola sama seperti SectionRenderer.
// ============================================================
import type { PageSection, TenantProfile } from '@/types/websitebuilder'
import type { SiteContent } from '@/app/components/themes/universal/TokenDrivenRenderer'

type Isi = Record<string, unknown>
const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v : undefined)
const asArray = (v: unknown): Isi[] => (Array.isArray(v) ? (v as Isi[]) : [])

export function sectionsToSiteContent(
  nama: string,
  sections: PageSection[],
  profile: TenantProfile | null,
  konten: Record<string, unknown> = {},
): SiteContent {
  const isiOf = (tipe: string): Isi =>
    (sections.find((s) => s.tipe_komponen === tipe)?.isi_komponen as Isi | undefined) ?? {}

  const heroIsi = isiOf('hero_banner')
  const aboutIsi = sections.find((s) => s.tipe_komponen === 'about')
  const featIsi = sections.find((s) => s.tipe_komponen === 'features')
  const ctaIsi = sections.find((s) => s.tipe_komponen === 'cta')

  const hero = {
    eyebrow: str(heroIsi.eyebrow) ?? str(konten.tagline),
    title: str(heroIsi.title) ?? str(heroIsi.judul) ?? nama,
    subtitle: str(heroIsi.subtitle) ?? str(heroIsi.subjudul) ?? str(konten.deskripsi),
    ctaText: str(heroIsi.cta_text),
    ctaHref: str(heroIsi.cta_link),
  }

  const features = featIsi
    ? asArray((featIsi.isi_komponen as Isi)?.items ?? (featIsi.isi_komponen as Isi)?.fitur)
        .map((it) => ({ title: str(it.title) ?? str(it.judul) ?? '', desc: str(it.desc) ?? str(it.deskripsi) ?? '' }))
        .filter((f) => f.title)
    : undefined

  const aboutI = aboutIsi?.isi_komponen as Isi | undefined
  const about = aboutI
    ? { title: str(aboutI.title) ?? 'Tentang Kami', body: str(aboutI.body) ?? str(aboutI.deskripsi) ?? '' }
    : undefined

  const ctaI = ctaIsi?.isi_komponen as Isi | undefined
  const cta = ctaI
    ? { title: str(ctaI.title) ?? 'Siap Memulai?', subtitle: str(ctaI.subtitle), ctaText: str(ctaI.cta_text), ctaHref: str(ctaI.cta_link) }
    : undefined

  const contact = {
    wa: profile?.wa ?? str(konten.wa),
    email: profile?.email ?? undefined,
    alamat: profile?.alamat ?? undefined,
  }

  return { nama, hero, features: features && features.length ? features : undefined, about, cta, contact }
}
