import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import { fetchServicesByPage } from '@/lib/supabase/addons'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'
import BookingClient from './BookingClient'

export const dynamic = 'force-dynamic'

export default async function BookingPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ service?: string }>
}) {
  const { slug } = await params
  const { service } = await searchParams

  const page = await fetchPageBySlug(supabase, slug).catch(() => null)
  if (!page) notFound()

  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  if (!konfig.features?.hasBooking) notFound()

  const services = await fetchServicesByPage(supabase, page.id)
  if (services.length === 0) notFound()

  return (
    <BookingClient
      slug={slug}
      namaWebsite={page.nama_website}
      primary={konfig.branding?.primary}
      services={services}
      initialServiceId={service ?? services[0].id}
    />
  )
}
