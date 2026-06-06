// ============================================================
// THEME SYSTEM — adapter PageSection[]+Product[] → ComposableContent (S0-4).
// Reuse sectionsToSiteContent untuk hero/about/cta/contact, lalu tambah
// `showcase` (produk/menu) — bagian yang khas Theme System. Dipakai SiteRenderer
// saat me-route tema composable. Pola baca defensif sama seperti adapter lain.
// ============================================================
import type { PageSection, TenantProfile } from '@/types/websitebuilder'
import type { ComposableContent, ShowcaseItem, InfoLokasi } from './manifest'
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

  return {
    nama: base.nama,
    hero: { ...base.hero, image: fotoHero },
    features: base.features,
    showcase,
    info,
    about: base.about,
    cta: base.cta,
    contact: base.contact,
  }
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
