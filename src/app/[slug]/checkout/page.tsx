import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'
import CheckoutClient from './CheckoutClient'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let page = null
  try { page = await fetchPageBySlug(supabase, slug) } catch { /* noop */ }
  if (!page) notFound()

  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  // Checkout hanya untuk toko yang mengaktifkan fitur cart.
  if (!konfig.features?.hasCart) notFound()

  return (
    <CheckoutClient
      slug={slug}
      namaWebsite={page.nama_website}
      primary={konfig.branding?.primary}
    />
  )
}
