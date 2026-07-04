import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import { fetchTenantProfile } from '@/lib/supabase/addons'
import type { KonfigurasiWebsite, DataKontenRental } from '@/types/websitebuilder'
import { deriveAccent, accentVars, waLink, FONT_IMPORT, FONT_DISPLAY, FONT_BODY } from '@/app/components/themes/rental/asphalt/tokens'
import SewaStatusClient from './SewaStatusClient'

// ============================================================
// /{slug}/sewa/{code} — halaman status booking sewa mobil (finish URL Midtrans).
// Di subdomain tenant otomatis jadi {slug}.webzoka.com/sewa/{code} (rewrite
// src/proxy.ts mode-1, tanpa perubahan proxy). Status live dipoll client via
// /api/rental-proxy — halaman ini hanya resolve branding + slug portal tenant.
// ============================================================

export const dynamic = 'force-dynamic'

const CODE_RE = /^JA-[A-Z0-9]{8}$/

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; code: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await fetchPageBySlug(supabase, slug).catch(() => null)
  return { title: page ? `Status Booking · ${page.nama_website}` : 'Status Booking', robots: { index: false } }
}

export default async function SewaStatusPage({
  params,
}: {
  params: Promise<{ slug: string; code: string }>
}) {
  const { slug, code: rawCode } = await params
  const code = rawCode.toUpperCase()
  if (!CODE_RE.test(code)) notFound()

  const page = await fetchPageBySlug(supabase, slug).catch(() => null)
  if (!page) notFound()

  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  const bookingSlug = konfig.booking?.slug
  // Halaman ini hanya berlaku utk tenant yang wired ke portal rental.
  if (!bookingSlug) notFound()

  const konten = (page.data_konten ?? {}) as Partial<DataKontenRental>
  const profile = await fetchTenantProfile(supabase, page.id).catch(() => null)
  const accent = deriveAccent(konfig.branding?.primary ?? konten.warna_tema)
  const waHref = waLink(
    profile?.wa ?? konten.wa ?? null,
    `Halo ${page.nama_website}, saya mau konfirmasi booking ${code}.`,
  )

  return (
    <div style={{ ...accentVars(accent), '--sst-display': FONT_DISPLAY, '--sst-body': FONT_BODY } as CSSProperties}>
      <style dangerouslySetInnerHTML={{ __html: `@import url('${FONT_IMPORT}');` }} />
      <SewaStatusClient code={code} nama={page.nama_website} bookingSlug={bookingSlug} waHref={waHref} />
    </div>
  )
}
