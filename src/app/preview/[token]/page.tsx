import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { fetchPageByIdAdmin } from '@/lib/supabase/websitebuilder'
import { verifyPreviewToken } from '@/lib/preview-token'
import { renderSite } from '@/app/components/SiteRenderer'

// Link pratinjau KLIEN (alur "mockup = draft build") — render draft persis
// seperti live via renderSite yang sama dengan [slug] publik & admin/preview,
// tapi diakses lewat token HMAC ber-expiry (tanpa login). Token rusak/kedaluwarsa
// → 404 (tak membocorkan ada/tidaknya halaman). Slug draft di route publik tetap
// 404 (status != published) — satu-satunya jalan lihat draft tanpa login = link ini.
export const dynamic = 'force-dynamic'

// Jangan pernah terindeks — link berumur pendek untuk review klien.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function ClientPreviewPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const pageId = verifyPreviewToken(token)
  if (!pageId) notFound()

  const page = await fetchPageByIdAdmin(supabaseAdmin, pageId)
  if (!page) notFound()

  const slug = page.slug ?? ''
  const rendered = await renderSite({ page, slug, client: supabaseAdmin })
  const isLive = page.status === 'published'

  return (
    <>
      {/* Pita status tipis — statis, tanpa aksi (klien hanya melihat). */}
      <div className="fixed top-0 inset-x-0 z-[9999] h-10 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/85 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'}`} aria-hidden />
          <span className="text-[11px] font-bold uppercase tracking-widest">
            {isLive ? 'Pratinjau — versi live' : 'Pratinjau — belum live'}
          </span>
          <span className="hidden sm:inline text-[11px] text-gray-400">
            · Ada masukan? Balas via WhatsApp seperti biasa.
          </span>
        </div>
      </div>
      {/* offset konten supaya tidak ketutup pita 40px */}
      <div className="pt-10">{rendered}</div>
    </>
  )
}
