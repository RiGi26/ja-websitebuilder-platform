import { redirect, notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { fetchPageByIdAdmin } from '@/lib/supabase/websitebuilder'
import { renderSite } from '@/app/components/SiteRenderer'
import PreviewBar from './PreviewBar'

// F5-1 — Preview hasil build sebelum publish. Admin-gated, service role →
// render halaman apa pun statusnya (draft termasuk). Pakai renderer yang sama
// dengan [slug] publik supaya WYSIWYG.
export const dynamic = 'force-dynamic'

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ pageId: string }>
}) {
  const { pageId } = await params

  const cookieStore = await cookies()
  if (!verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin/login')
  }

  const page = await fetchPageByIdAdmin(supabaseAdmin, pageId)
  if (!page) notFound()

  const slug = page.slug ?? ''
  const rendered = await renderSite({ page, slug, client: supabaseAdmin })

  return (
    <>
      <PreviewBar pageId={page.id} slug={slug} status={page.status} />
      {/* offset konten supaya tidak ketutup bar 56px */}
      <div className="pt-14">{rendered}</div>
    </>
  )
}
