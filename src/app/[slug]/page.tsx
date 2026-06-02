import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchPageBySlug } from '@/lib/supabase/websitebuilder'
import { fetchProductsByPage, fetchBlogPostsByPage, fetchServicesByPage, fetchMenuItemsByPage, fetchGalleryByPage, fetchTenantProfile } from '@/lib/supabase/addons'
import { SectionRenderer } from '@/app/components/sections/SectionRenderer'
import { CartProvider } from '@/app/components/cart/CartProvider'
import RestaurantRenderer from '@/app/components/themes/restaurant/RestaurantRenderer'
import BatikTokoRenderer from '@/app/components/themes/batik-toko/BatikTokoRenderer'
import KlinikRenderer from '@/app/components/themes/klinik/KlinikRenderer'
import CompanyRenderer from '@/app/components/themes/company/CompanyRenderer'
import SekolahRenderer from '@/app/components/themes/sekolah/SekolahRenderer'
import RentalRenderer from '@/app/components/themes/rental/RentalRenderer'
import LiveChatWidget from '@/app/components/LiveChatWidget'
import type { KonfigurasiWebsite, LandingPageWithSections } from '@/types/websitebuilder'

// Halaman publik klien. Render dinamis (data dari Supabase), dibaca via
// anon client → RLS hanya mengizinkan status='published' + section visible.
export const dynamic = 'force-dynamic'

async function getPage(slug: string): Promise<LandingPageWithSections | null> {
  try {
    return await fetchPageBySlug(supabase, slug)
  } catch (e) {
    console.error('[slug] fetchPageBySlug error:', e)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return { title: 'Halaman tidak ditemukan' }

  const konten = (page.data_konten ?? {}) as Record<string, any>
  const title = konten.meta_title ?? page.nama_website
  const description = konten.meta_description ?? konten.deskripsi ?? konten.tagline ?? undefined
  return { title, description }
}

export default async function PublicSitePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  const primary = konfig.branding?.primary
  const theme = konfig.branding?.theme
  const hasCart = !!konfig.features?.hasCart
  const hasBooking = !!konfig.features?.hasBooking
  const tawkId = konfig.features?.hasLiveChat ? (konfig.addons?.tawk_property_id ?? null) : null
  const sections = [...(page.page_sections ?? [])].sort((a, b) => a.urutan - b.urutan)

  // ── Tema visual bespoke per industri ────────────────────────
  if (theme === 'klinik') {
    const [services, profile] = await Promise.all([
      fetchServicesByPage(supabase, page.id),
      fetchTenantProfile(supabase, page.id),
    ])
    return <KlinikRenderer nama={page.nama_website} sections={sections} services={services} profile={profile} wa={profile?.wa ?? (page.data_konten as Record<string, any>)?.wa} slug={slug} primary={primary} konten={page.data_konten as Record<string, any>} features={konfig.features} />
  }

  if (theme === 'company') {
    const [services, gallery, profile] = await Promise.all([
      fetchServicesByPage(supabase, page.id),
      fetchGalleryByPage(supabase, page.id),
      fetchTenantProfile(supabase, page.id),
    ])
    return <CompanyRenderer nama={page.nama_website} sections={sections} services={services} gallery={gallery} profile={profile} wa={profile?.wa ?? (page.data_konten as Record<string, any>)?.wa} slug={slug} primary={primary} />
  }

  if (theme === 'sekolah') {
    const [services, profile] = await Promise.all([
      fetchServicesByPage(supabase, page.id),
      fetchTenantProfile(supabase, page.id),
    ])
    return <SekolahRenderer nama={page.nama_website} sections={sections} services={services} profile={profile} wa={profile?.wa ?? (page.data_konten as Record<string, any>)?.wa} slug={slug} primary={primary} />
  }

  if (theme === 'restaurant') {
    const [menuItems, gallery, profile] = await Promise.all([
      fetchMenuItemsByPage(supabase, page.id),
      fetchGalleryByPage(supabase, page.id),
      fetchTenantProfile(supabase, page.id),
    ])
    return <RestaurantRenderer nama={page.nama_website} sections={sections} wa={profile?.wa ?? (page.data_konten as Record<string, any>)?.wa} menuItems={menuItems} gallery={gallery} profile={profile} />
  }

  if (theme === 'rental') {
    const [services, profile] = await Promise.all([
      fetchServicesByPage(supabase, page.id),
      fetchTenantProfile(supabase, page.id),
    ])
    return <RentalRenderer nama={page.nama_website} sections={sections} services={services} profile={profile} wa={profile?.wa ?? (page.data_konten as Record<string, any>)?.wa} slug={slug} primary={primary} konten={page.data_konten as any} features={konfig.features} designTokens={konfig.branding?.design_tokens} />
  }

  if (theme === 'batik_toko') {
    const [products, profile] = await Promise.all([
      fetchProductsByPage(supabase, page.id),
      fetchTenantProfile(supabase, page.id),
    ])
    const renderer = (
      <BatikTokoRenderer
        nama={page.nama_website}
        sections={sections}
        products={products}
        profile={profile}
        hasCart={hasCart}
        slug={slug}
        primary={primary}
        wa={profile?.wa ?? (page.data_konten as Record<string, any>)?.wa}
      />
    )
    return hasCart ? <CartProvider slug={slug} primary={primary}>{renderer}</CartProvider> : renderer
  }

  // Fetch data add-on hanya jika ada section yang membutuhkannya.
  const needProducts = sections.some((s) => s.tipe_komponen === 'product_list')
  const needPosts = sections.some((s) => s.tipe_komponen === 'blog_list')
  const needServices = sections.some((s) => s.tipe_komponen === 'service_list')
  const needGallery = sections.some((s) => s.tipe_komponen === 'gallery')
  const needProfile = sections.some((s) => s.tipe_komponen === 'contact_form')
  const [products, posts, services, gallery, profile] = await Promise.all([
    needProducts ? fetchProductsByPage(supabase, page.id) : Promise.resolve([]),
    needPosts ? fetchBlogPostsByPage(supabase, page.id) : Promise.resolve([]),
    needServices ? fetchServicesByPage(supabase, page.id) : Promise.resolve([]),
    needGallery ? fetchGalleryByPage(supabase, page.id) : Promise.resolve([]),
    needProfile ? fetchTenantProfile(supabase, page.id) : Promise.resolve(null),
  ])

  const body = (
    <main className="min-h-screen bg-white">
      {/* aksen branding tipis (theming dasar) */}
      {primary && <div style={{ height: 4, backgroundColor: primary }} />}

      {sections.length === 0 ? (
        <div className="px-6 py-32 text-center text-gray-400">
          <h1 className="text-2xl font-bold text-gray-700">{page.nama_website}</h1>
          <p className="mt-2 text-sm">Halaman ini belum memiliki konten.</p>
        </div>
      ) : (
        sections.map((s) => (
          <SectionRenderer key={s.id} section={s} products={products} posts={posts} services={services} gallery={gallery} profile={profile} hasCart={hasCart} hasBooking={hasBooking} slug={slug} primary={primary} />
        ))
      )}
    </main>
  )

  const liveChat = tawkId ? <LiveChatWidget propertyId={tawkId} /> : null

  // Bungkus dengan keranjang hanya bila fitur toko aktif.
  if (hasCart) {
    return <CartProvider slug={slug} primary={primary}>{body}{liveChat}</CartProvider>
  }
  return <>{body}{liveChat}</>
}
