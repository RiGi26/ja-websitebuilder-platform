// ============================================================
// Normalisasi orders.briefing_data (JSONB freeform) -> NormalizedBriefing.
// Bentuk nyata briefing_data (dari form briefing customer):
//   { konten:{...}, tahap_2:{...}, branding:{variant,primary_color,logo_url,
//     referensi_website}, identitas:{nama_usaha,tagline,deskripsi,wa,email,
//     alamat,kota_layanan[],jam_operasional}, sosial_media:{...}, industri_tipe }
// ============================================================
import type { TipeIndustri } from '@/types/websitebuilder'
import { industriToTipe } from '@/lib/websitebuilder-mapping'
import type { NormalizedBriefing } from './types'

// ── coercers aman ──────────────────────────────────────────────
export const asStr = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
export const asArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
export const asObj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {}

// Angka dari string ("Rp 350.000", "350000", 350000) -> number. Default 0.
export const asNum = (v: unknown): number => {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const digits = v.replace(/[^\d]/g, '')
    if (digits) return Number(digits)
  }
  return 0
}

type OrderLike = {
  industri?: string | null
  nama_usaha?: string | null
  nama_perusahaan?: string | null
  nomor_wa?: string | null
  email?: string | null
  briefing_data?: unknown
}

export function normalizeBriefing(order: OrderLike): NormalizedBriefing {
  const bd = asObj(order.briefing_data)
  const identitas = asObj(bd.identitas)
  const branding = asObj(bd.branding)
  const sosial = asObj(bd.sosial_media)
  const konten = asObj(bd.konten)
  const tahap2 = asObj(bd.tahap_2)

  // industri_tipe di briefing adalah sumber kanonik; fallback ke kolom industri.
  const tipeRaw = asStr(bd.industri_tipe)
  const tipe: TipeIndustri = tipeRaw
    ? industriToTipe(tipeRaw)
    : industriToTipe(order.industri)

  const namaUsaha =
    asStr(identitas.nama_usaha) ||
    asStr(order.nama_perusahaan) ||
    asStr(order.nama_usaha) ||
    'Bisnis Anda'

  const testimoni = asArr(tahap2.testimoni)
    .map((t) => {
      const o = asObj(t)
      return { nama: asStr(o.nama) || undefined, isi: asStr(o.isi) || asStr(o.quote) || undefined }
    })
    .filter((t) => t.isi)

  return {
    tipe,
    namaUsaha,
    tagline: asStr(identitas.tagline),
    deskripsi: asStr(identitas.deskripsi),
    wa: asStr(identitas.wa) || asStr(order.nomor_wa),
    email: asStr(identitas.email) || asStr(order.email),
    alamat: asStr(identitas.alamat),
    jamOperasional: asStr(identitas.jam_operasional),
    kotaLayanan: asArr(identitas.kota_layanan).map(asStr).filter(Boolean),
    primary: asStr(branding.primary_color) || undefined,
    variant: asStr(branding.variant) || undefined,
    subKategori: asStr(branding.sub_kategori) || undefined,
    logoUrl: asStr(branding.logo_url) || undefined,
    referensi: asStr(branding.referensi_website) || undefined,
    sosial: {
      instagram: asStr(sosial.instagram) || undefined,
      tiktok: asStr(sosial.tiktok) || undefined,
      shopee: asStr(sosial.shopee) || undefined,
      youtube: asStr(sosial.youtube) || undefined,
      facebook: asStr(sosial.facebook) || undefined,
      linkedin: asStr(sosial.linkedin) || undefined,
    },
    konten,
    kebijakan: asStr(tahap2.kebijakan),
    testimoni,
  }
}

// Daftar kota sebagai frasa ("Surabaya, Sidoarjo & Gresik" / "kota Anda").
export function kotaPhrase(kota: string[]): string {
  if (kota.length === 0) return 'kota Anda'
  if (kota.length === 1) return kota[0]
  return `${kota.slice(0, -1).join(', ')} & ${kota[kota.length - 1]}`
}

// Link WA siap pakai untuk CTA. '#' kalau nomor kosong.
export function waLink(wa: string): string {
  const digits = wa.replace(/[^\d]/g, '')
  return digits ? `https://wa.me/${digits}` : '#'
}
