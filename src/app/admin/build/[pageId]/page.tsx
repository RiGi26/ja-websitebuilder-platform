import { supabaseAdmin } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import Navbar from '@/app/components/Navbar'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import BuilderEditor from './BuilderEditor'
import type { LandingPage, PageSection } from '@/types/websitebuilder'

export const dynamic = 'force-dynamic'

export default async function BuildPage({
  params,
}: {
  params: Promise<{ pageId: string }>
}) {
  const { pageId } = await params

  const cookieStore = await cookies()
  if (!verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin/login')
  }

  const { data: page, error } = await supabaseAdmin
    .from('landing_pages')
    .select('*')
    .eq('id', pageId)
    .maybeSingle()

  if (error) console.error('Error fetching page:', error)
  if (!page) notFound()

  const { data: sections } = await supabaseAdmin
    .from('page_sections')
    .select('*')
    .eq('page_id', pageId)
    .order('urutan', { ascending: true })

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <main className="pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/admin"
            className="text-[11px] font-bold text-gray-400 hover:text-apple-blue transition-colors flex items-center gap-1 uppercase tracking-widest mb-6"
          >
            <ChevronLeft size={14} /> Kembali ke Daftar Order
          </Link>

          <BuilderEditor
            page={page as LandingPage}
            initialSections={(sections ?? []) as PageSection[]}
          />
        </div>
      </main>
    </div>
  )
}
