import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import { fetchMenuItemsByPage } from '@/lib/supabase/addons'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'
import POClient from './POClient'

export const dynamic = 'force-dynamic'

// Halaman form Pre-Order F&B (/[slug]/po). Anon client → RLS hanya melayani
// halaman published. Menu di-fetch lewat fetchMenuItemsByPage (kolom eksplisit,
// tanpa hpp → aman). Renderer situs (WarungRenderer) sudah mengarahkan CTA
// "Pesan (PO)" ke sini saat konfig.features.hasPreorder + preorder.open.
export default async function PreorderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const page = await fetchPageBySlug(supabase, slug).catch(() => null)
  if (!page) notFound()

  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  if (!konfig.features?.hasPreorder) notFound()

  const menu = await fetchMenuItemsByPage(supabase, page.id)

  return (
    <POClient
      slug={slug}
      namaWebsite={page.nama_website}
      primary={konfig.branding?.primary}
      preorder={konfig.preorder ?? { open: false }}
      localeConfig={konfig.localeConfig}
      menu={menu.map((m) => ({
        id: m.id,
        nama: m.nama,
        harga: m.harga,
        kategori: m.kategori,
        gambar_url: m.gambar_url,
        is_sold_out: !!m.is_sold_out,
      }))}
    />
  )
}
