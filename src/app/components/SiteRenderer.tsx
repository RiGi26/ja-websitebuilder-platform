import type { SupabaseClient } from '@supabase/supabase-js'
import {
  fetchProductsByPage,
  fetchBlogPostsByPage,
  fetchServicesByPage,
  fetchMenuItemsByPage,
  fetchGalleryByPage,
  fetchTenantProfile,
} from '@/lib/supabase/addons'
import { SectionRenderer } from '@/app/components/sections/SectionRenderer'
import { CartProvider } from '@/app/components/cart/CartProvider'
import RestaurantRenderer from '@/app/components/themes/restaurant/RestaurantRenderer'
import RestaurantLuxRenderer from '@/app/components/themes/restaurant-lux/RestaurantLuxRenderer'
import AtelierCartButton from '@/app/components/themes/toko-atelier/AtelierCartButton'
import { TOKO_BESPOKE } from '@/app/components/themes/toko-bespoke/registry'
import BatikTokoRenderer from '@/app/components/themes/batik-toko/BatikTokoRenderer'
import KlinikRenderer from '@/app/components/themes/klinik/KlinikRenderer'
import KlinikCleanRenderer from '@/app/components/themes/klinik/KlinikCleanRenderer'
import CompanyRenderer from '@/app/components/themes/company/CompanyRenderer'
import SekolahRenderer from '@/app/components/themes/sekolah/SekolahRenderer'
import RentalRenderer from '@/app/components/themes/rental/RentalRenderer'
import TokenDrivenRenderer from '@/app/components/themes/universal/TokenDrivenRenderer'
import ComposableRenderer from '@/app/components/theme-engine/ComposableRenderer'
import { getManifest } from '@/lib/theme-system/manifest'
import { composableContentFromSections, articlesFromBlogPosts, type ShowcaseSourceItem } from '@/lib/theme-system/content-adapter'
import { resolveTokenPack, isTokenDrivenTheme } from '@/lib/design-tokens/packs'
import { sectionsToSiteContent } from '@/lib/design-tokens/section-adapter'
import LiveChatWidget from '@/app/components/LiveChatWidget'
import type { KonfigurasiWebsite, LandingPageWithSections } from '@/types/websitebuilder'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>

// Render satu halaman klien (semua cabang tema bespoke + token-driven + generik).
// Dipakai oleh [slug] (publik, anon client) dan /admin/preview (draft, service role).
// `client` menentukan dari mana data add-on diambil: anon untuk publik (gated RLS),
// service role untuk preview (lihat draft sebelum publish).
export async function renderSite({
  page,
  slug,
  client,
}: {
  page: LandingPageWithSections
  slug: string
  client: Client
}) {
  const konfig = (page.konfigurasi ?? {}) as KonfigurasiWebsite
  const primary = konfig.branding?.primary
  const theme = konfig.branding?.theme
  const variant = konfig.branding?.variant
  const hasCart = !!konfig.features?.hasCart
  const hasBooking = !!konfig.features?.hasBooking
  const tawkId = konfig.features?.hasLiveChat ? (konfig.addons?.tawk_property_id ?? null) : null
  const sections = [...(page.page_sections ?? [])].sort((a, b) => a.urutan - b.urutan)

  // ── Bespoke premium: Restaurant Lux (Opsi A, tier premium) ──
  // theme='restaurant-lux' → renderer bespoke = view kaya atas ComposableContent
  // yang SAMA (reuse menu fetch + composableContentFromSections). variant = preset
  // palet (aurum/noir/hearth); primary = aksen brand. Coexist, nol regresi.
  if (theme === 'restaurant-lux') {
    const [source, profile] = await Promise.all([
      fetchMenuItemsByPage(client, page.id),
      fetchTenantProfile(client, page.id),
    ])
    const content = composableContentFromSections(
      page.nama_website, sections, source, profile, page.data_konten as Record<string, unknown>, 'Menu Kami',
    )
    return <RestaurantLuxRenderer content={content} variant={variant} primary={primary} slug={slug} capabilities={konfig.capabilities} />
  }

  // ── Bespoke FLAGSHIP toko (registry: Atelier/Kuliner/…) ──
  // Theme System lux bespoke per sub-kategori toko. SATU lookup registry (bukan
  // cabang if per tema). Reuse fetch products + composableContentFromSections;
  // products mentah diteruskan untuk pencocokan tombol keranjang per item
  // (AtelierCartButton di-inject via slot supaya renderer bebas modul cart).
  const bespoke = theme ? TOKO_BESPOKE[theme] : undefined
  if (bespoke) {
    const [products, profile] = await Promise.all([
      fetchProductsByPage(client, page.id),
      fetchTenantProfile(client, page.id),
    ])
    const content = composableContentFromSections(
      page.nama_website, sections, products, profile, page.data_konten as Record<string, unknown>, bespoke.showcaseTitle ?? 'Koleksi Kami',
    )
    const Renderer = bespoke.Renderer
    const renderer = (
      <Renderer
        content={content}
        variant={variant}
        primary={primary}
        products={products}
        hasCart={hasCart}
        CartButton={AtelierCartButton}
      />
    )
    return hasCart ? <CartProvider slug={slug} primary={primary}>{renderer}</CartProvider> : renderer
  }

  // ── Theme System (composable) ───────────────────────────────
  // Bila variant = id manifest composable (mis. 'kuliner-rustic'), render via
  // ComposableRenderer. Dicek SEBELUM cabang bespoke/token-driven. DORMANT:
  // tak ada page existing memakai id manifest → cabang ini tak terambil (nol regresi).
  const manifest = getManifest(variant)
  if (manifest) {
    // Showcase di-isi dari SOURCE yang benar per industri (bukan selalu products):
    // restaurant→menu_items, blog→blog_posts (artikel), jasa (klinik/sekolah/
    // corporate/travel/personal)→services, selain itu→products. Semua dipetakan
    // ke {nama,deskripsi,harga,gambar_url}.
    const tipe = (page as { tipe_industri?: string }).tipe_industri ?? ''
    const SERVICE_INDUSTRI = ['klinik', 'sekolah', 'corporate', 'travel', 'personal']
    const fetchSource: Promise<ShowcaseSourceItem[]> =
      tipe === 'restaurant' ? fetchMenuItemsByPage(client, page.id)
        : tipe === 'blog'
          ? fetchBlogPostsByPage(client, page.id).then((posts) =>
              posts.map((p) => ({ nama: p.judul, deskripsi: p.ringkasan, harga: null, gambar_url: p.cover_url, penulis: p.penulis, tanggal: p.published_at })))
          : SERVICE_INDUSTRI.includes(tipe) ? fetchServicesByPage(client, page.id)
            : fetchProductsByPage(client, page.id)
    const showcaseTitle =
      tipe === 'restaurant' ? 'Menu Kami'
        : tipe === 'blog' ? 'Artikel Terbaru'
          : tipe === 'sekolah' ? 'Program Kami'
            : tipe === 'personal' ? 'Layanan Saya'
              : tipe === 'travel' ? 'Pilihan Kami'
                : tipe === 'jastip' ? 'Katalog Titipan'
                  : SERVICE_INDUSTRI.includes(tipe) ? 'Layanan Kami'
                    : 'Produk Kami'
    const [source, profile] = await Promise.all([
      fetchSource,
      fetchTenantProfile(client, page.id),
    ])
    const content = composableContentFromSections(
      page.nama_website, sections, source, profile, page.data_konten as Record<string, unknown>, showcaseTitle,
    )
    // Add-on blog lintas-industri (B-section): alur manifest tak punya slot
    // artikel → petakan additive (pola bands). Industri blog tidak lewat sini
    // (showcase utamanya sudah article-feed dari blog_posts).
    if (tipe !== 'blog' && sections.some((s) => s.tipe_komponen === 'blog_list')) {
      const posts = await fetchBlogPostsByPage(client, page.id)
      content.articles = articlesFromBlogPosts(sections, posts)
    }
    const renderer = <ComposableRenderer manifest={manifest} content={content} />
    return hasCart ? <CartProvider slug={slug} primary={primary}>{renderer}</CartProvider> : renderer
  }

  // ── Tema visual bespoke per industri ────────────────────────
  if (theme === 'klinik') {
    const [services, profile] = await Promise.all([
      fetchServicesByPage(client, page.id),
      fetchTenantProfile(client, page.id),
    ])
    const klinikProps = {
      nama: page.nama_website, sections, services, profile,
      wa: profile?.wa ?? (page.data_konten as Record<string, any>)?.wa,
      slug, primary, konten: page.data_konten as Record<string, any>,
      features: konfig.features,
    }
    if (variant === 'clean') return <KlinikCleanRenderer {...klinikProps} />
    // variant 'warm' (default) atau 'premium' → KlinikRenderer (variant-aware)
    return <KlinikRenderer {...klinikProps} variant={variant} />
  }

  if (theme === 'company') {
    const [services, gallery, profile] = await Promise.all([
      fetchServicesByPage(client, page.id),
      fetchGalleryByPage(client, page.id),
      fetchTenantProfile(client, page.id),
    ])
    return <CompanyRenderer nama={page.nama_website} sections={sections} services={services} gallery={gallery} profile={profile} wa={profile?.wa ?? (page.data_konten as Record<string, any>)?.wa} slug={slug} primary={primary} variant={variant} />
  }

  if (theme === 'sekolah') {
    const [services, profile] = await Promise.all([
      fetchServicesByPage(client, page.id),
      fetchTenantProfile(client, page.id),
    ])
    return <SekolahRenderer nama={page.nama_website} sections={sections} services={services} profile={profile} wa={profile?.wa ?? (page.data_konten as Record<string, any>)?.wa} slug={slug} primary={primary} variant={variant} />
  }

  if (theme === 'restaurant') {
    const [menuItems, gallery, profile] = await Promise.all([
      fetchMenuItemsByPage(client, page.id),
      fetchGalleryByPage(client, page.id),
      fetchTenantProfile(client, page.id),
    ])
    return <RestaurantRenderer nama={page.nama_website} sections={sections} wa={profile?.wa ?? (page.data_konten as Record<string, any>)?.wa} menuItems={menuItems} gallery={gallery} profile={profile} variant={variant} />
  }

  if (theme === 'rental') {
    const [services, profile] = await Promise.all([
      fetchServicesByPage(client, page.id),
      fetchTenantProfile(client, page.id),
    ])
    return <RentalRenderer nama={page.nama_website} sections={sections} services={services} profile={profile} wa={profile?.wa ?? (page.data_konten as Record<string, any>)?.wa} slug={slug} primary={primary} konten={page.data_konten as any} features={konfig.features} designTokens={konfig.branding?.design_tokens} variant={variant} />
  }

  if (theme === 'batik_toko') {
    const [products, profile] = await Promise.all([
      fetchProductsByPage(client, page.id),
      fetchTenantProfile(client, page.id),
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
        variant={variant}
      />
    )
    return hasCart ? <CartProvider slug={slug} primary={primary}>{renderer}</CartProvider> : renderer
  }

  // ── Token-driven (registry) ─────────────────────────────────
  // Tema tanpa renderer bespoke + halaman murni konten (tanpa add-on
  // commerce/booking) → render token-driven. Variant + warna brand klien
  // di-resolve ke token pack. Halaman commerce/booking jatuh ke
  // SectionRenderer generik di bawah (tetap dukung cart/booking).
  const tipe = (page as { tipe_industri?: string }).tipe_industri
  const hasCommerce = sections.some((s) => ['product_list', 'service_list', 'blog_list'].includes(s.tipe_komponen))
  if (isTokenDrivenTheme(theme) && !hasCart && !hasBooking && !hasCommerce && sections.length > 0) {
    const profile = await fetchTenantProfile(client, page.id)
    const pack = resolveTokenPack(tipe ?? theme, variant, primary)
    const content = sectionsToSiteContent(page.nama_website, sections, profile, page.data_konten as Record<string, unknown>)
    return (
      <>
        <TokenDrivenRenderer content={content} pack={pack} />
        {tawkId ? <LiveChatWidget propertyId={tawkId} /> : null}
      </>
    )
  }

  // Fetch data add-on hanya jika ada section yang membutuhkannya.
  const needProducts = sections.some((s) => s.tipe_komponen === 'product_list')
  const needPosts = sections.some((s) => s.tipe_komponen === 'blog_list')
  const needServices = sections.some((s) => s.tipe_komponen === 'service_list')
  const needGallery = sections.some((s) => s.tipe_komponen === 'gallery')
  const needProfile = sections.some((s) => s.tipe_komponen === 'contact_form')
  const [products, posts, services, gallery, profile] = await Promise.all([
    needProducts ? fetchProductsByPage(client, page.id) : Promise.resolve([]),
    needPosts ? fetchBlogPostsByPage(client, page.id) : Promise.resolve([]),
    needServices ? fetchServicesByPage(client, page.id) : Promise.resolve([]),
    needGallery ? fetchGalleryByPage(client, page.id) : Promise.resolve([]),
    needProfile ? fetchTenantProfile(client, page.id) : Promise.resolve(null),
  ])

  const body = (
    <main className="min-h-screen bg-white">
      {/* aksen branding tipis (theming dasar) */}
      {primary && <div style={{ height: 4, backgroundColor: primary }} />}

      {sections.length === 0 ? (
        // Safety net: halaman tanpa konten (mis. dipublish sebelum di-build).
        // Tampilkan "Segera Hadir" ber-brand, bukan teks abu polos.
        <div className="px-6 py-32 text-center">
          <div className="mx-auto max-w-md">
            <div
              className="mx-auto mb-6 h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{
                backgroundColor: primary ? `${primary}1A` : '#f3f4f6',
                color: primary ?? '#6b7280',
              }}
            >
              {(page.nama_website?.trim()[0] ?? 'W').toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{page.nama_website}</h1>
            <p className="mt-2 text-sm text-gray-500">Website sedang disiapkan — segera hadir.</p>
          </div>
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
