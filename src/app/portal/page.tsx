import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getTenantPaymentStatus } from '@/lib/tenant-midtrans'
import { paymentEntitled, themeContentTabs, kontenBrandEditable } from '@/lib/addons/portal-tabs'
import { sanitizeHiddenSections, type HideableSectionKey } from '@/lib/portal/section-visibility'
import type { KonfigurasiWebsite, Product, Service, MenuItem, BlogPost, GalleryImage, TenantProfile } from '@/types/websitebuilder'
import PortalDashboard, { type ShopOrderRow, type BookingRow } from './PortalDashboard'
import type { EditableSection } from './ContentPanel'
import type { KontenBrandData } from './KontenBrandPanel'

export const dynamic = 'force-dynamic'

export default async function PortalPage() {
  // 1. Verifikasi sesi customer
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const tenantId = (user.app_metadata as Record<string, unknown>)?.tenant_id as string | undefined
  if (!tenantId) redirect('/portal/login')

  // 2. Ambil data tenant + halaman miliknya (service role utk baca lengkap;
  //    isolasi tetap dijaga karena kita filter eksplisit pakai tenantId dari JWT).
  const { data: tenant } = await supabaseAdmin
    .from('tenants').select('nama').eq('id', tenantId).maybeSingle()

  const { data: page } = await supabaseAdmin
    .from('landing_pages')
    .select('id, nama_website, slug, status, tipe_industri, konfigurasi, data_konten')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  let products: Product[] = []
  if (page?.id) {
    const { data } = await supabaseAdmin
      .from('products').select('*').eq('page_id', page.id).order('urutan', { ascending: true })
    products = (data ?? []) as Product[]
  }

  const konfig = (page?.konfigurasi ?? {}) as KonfigurasiWebsite
  // Tenant "cutover Portal" (Bakso Fase 1, source_of_truth='portal'): pesanan,
  // katalog (menu/produk), stok & pembayaran dikelola di Portal Operasi eksternal,
  // BUKAN di tabel WB. Matikan tab commerce WB-native agar tak tabrakan/menyesatkan
  // (order hantu, laporan basi, edit menu yg ditimpa sync, upsell Midtrans redundan).
  // Tenant WB biasa (source_of_truth != 'portal') → nol perubahan.
  const portalManaged = konfig.source_of_truth === 'portal'
  const portalAdminUrl =
    (typeof (konfig as { portal_admin_url?: unknown }).portal_admin_url === 'string'
      && (konfig as { portal_admin_url?: string }).portal_admin_url)
      || 'https://stock.japanarena.id'
  // Tab Tampilan — foto hero + titik fokus dari data_konten (whitelist).
  const dataKonten = (page?.data_konten ?? {}) as Record<string, unknown>
  const initialTampilan = {
    foto_hero: typeof dataKonten.foto_hero === 'string' ? dataKonten.foto_hero : '',
    foto_hero_focus: typeof dataKonten.foto_hero_focus === 'string' ? dataKonten.foto_hero_focus : '',
  }
  const hasShop = !portalManaged && !!konfig.features?.hasCart
  const hasBooking = !!konfig.features?.hasBooking
  const hasMenu = !portalManaged && !!konfig.features?.hasMenu
  const hasBlog = !!konfig.features?.hasBlog
  const hasGallery = !!konfig.features?.hasGallery
  const hasPreorder = !portalManaged && !!konfig.features?.hasPreorder
  const contentIsSample = !!konfig.content_is_sample

  // Tab konten yang HARUS terbuka karena tema situs merender datanya tanpa
  // syarat add-on (bespoke/lux) — OR dengan flag add-on. Pesanan/Reservasi
  // (transaksi) tetap murni di-gate flag add-on.
  const themeTabs = themeContentTabs(konfig.branding, page?.tipe_industri)
  const showProduk = !portalManaged && (hasShop || themeTabs.produk)
  const showLayanan = hasBooking || themeTabs.layanan
  const showMenu = !portalManaged && (hasMenu || themeTabs.menu)
  const showBlog = hasBlog || themeTabs.blog
  const showGallery = hasGallery || themeTabs.galeri

  // Konten brand (stats/faq/statement) — editable hanya untuk tema yang
  // membacanya dari data_konten (bespoke/lux/composable).
  const brandFlags = kontenBrandEditable(konfig.branding)
  const sstr = (v: unknown) => (typeof v === 'string' ? v : '')
  const rawStatement = dataKonten.statement as Record<string, unknown> | null | undefined
  const initialKontenBrand: KontenBrandData = {
    flags: brandFlags,
    stats: Array.isArray(dataKonten.stats)
      ? (dataKonten.stats as unknown[])
          .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
          .map((r) => ({ angka: sstr(r.angka), label: sstr(r.label) }))
          .slice(0, 4)
      : [],
    faq: Array.isArray(dataKonten.faq)
      ? (dataKonten.faq as unknown[])
          .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
          .map((r) => ({ q: sstr(r.q), a: sstr(r.a) }))
          .slice(0, 10)
      : [],
    statement: rawStatement && typeof rawStatement === 'object'
      ? { eyebrow: sstr(rawStatement.eyebrow), quote: sstr(rawStatement.quote), cite: sstr(rawStatement.cite) }
      : { eyebrow: '', quote: '', cite: '' },
  }

  const paymentStatus = await getTenantPaymentStatus(tenantId)
  // Tab Pembayaran = add-on `midtrans` (flag hasPayment); tenant yang sudah
  // terlanjur konfigurasi di-grandfather (lihat lib/addons/portal-tabs).
  const hasPaymentTab = !portalManaged && paymentEntitled(konfig.features, paymentStatus.configured)

  // Pesanan masuk (toko + pre-order F&B) — terbaru dulu, dengan item-nya.
  // PO juga tersimpan di shop_orders → muat juga saat hasPreorder.
  let shopOrders: ShopOrderRow[] = []
  if ((hasShop || hasPreorder) && page?.id) {
    const { data } = await supabaseAdmin
      .from('shop_orders')
      .select('*, shop_order_items(*)')
      .eq('page_id', page.id)
      .order('created_at', { ascending: false })
      .limit(100)
    shopOrders = (data ?? []) as ShopOrderRow[]
  }

  // Layanan (tab terbuka bila tema merendernya) + reservasi (murni add-on booking).
  let services: Service[] = []
  if (showLayanan && page?.id) {
    const { data } = await supabaseAdmin
      .from('services').select('*').eq('page_id', page.id).order('urutan', { ascending: true })
    services = (data ?? []) as Service[]
  }
  let bookings: BookingRow[] = []
  if (hasBooking && page?.id) {
    const { data } = await supabaseAdmin
      .from('bookings').select('*, services(nama)').eq('page_id', page.id).order('created_at', { ascending: false }).limit(100)
    bookings = (data ?? []) as BookingRow[]
  }

  // Menu (resto) — kalau tab menu tampil.
  let menu: MenuItem[] = []
  if (showMenu && page?.id) {
    const { data } = await supabaseAdmin
      .from('menu_items').select('*').eq('page_id', page.id).order('urutan', { ascending: true })
    menu = (data ?? []) as MenuItem[]
  }

  // Blog & galeri & profil bisnis (customer-editable).
  let blog: BlogPost[] = []
  if (showBlog && page?.id) {
    const { data } = await supabaseAdmin
      .from('blog_posts').select('*').eq('page_id', page.id).order('created_at', { ascending: false })
    blog = (data ?? []) as BlogPost[]
  }
  let gallery: GalleryImage[] = []
  if (showGallery && page?.id) {
    const { data } = await supabaseAdmin
      .from('gallery_images').select('*').eq('page_id', page.id).order('urutan', { ascending: true })
    gallery = (data ?? []) as GalleryImage[]
  }
  let profile: TenantProfile | null = null
  if (page?.id) {
    const { data } = await supabaseAdmin
      .from('tenant_profile').select('*').eq('page_id', page.id).maybeSingle()
    profile = (data ?? null) as TenantProfile | null
  }

  // F5-3 — section halaman (teks/gambar) yang bisa diedit klien sendiri.
  let sections: EditableSection[] = []
  if (page?.id) {
    const { data } = await supabaseAdmin
      .from('page_sections')
      .select('id, tipe_komponen, urutan, is_visible, isi_komponen')
      .eq('page_id', page.id)
      .order('urutan', { ascending: true })
    sections = (data ?? []) as EditableSection[]
  }

  // Tab "Susunan Halaman" (di dalam Tampilan): bagian pengayaan yang BENAR
  // dirender tema ini DAN punya data → bisa disembunyikan customer. Bagian
  // tanpa data sudah otomatis tak tampil, jadi tak perlu ditawarkan.
  const hiddenSections = sanitizeHiddenSections(dataKonten.hidden_sections)
  const hasStatement = !!(rawStatement && typeof rawStatement === 'object'
    && typeof rawStatement.quote === 'string' && rawStatement.quote.trim())
  const fotoItems = Array.isArray(dataKonten.foto_items) ? dataKonten.foto_items : []
  const susunanSections: HideableSectionKey[] = []
  if (brandFlags.stats && initialKontenBrand.stats.length > 0) susunanSections.push('stats')
  if (brandFlags.faq && initialKontenBrand.faq.length > 0) susunanSections.push('faq')
  if (brandFlags.statement && hasStatement) susunanSections.push('statement')
  if (themeTabs.galeri && (gallery.length > 0 || fotoItems.length > 0)) susunanSections.push('gallery')

  return (
    <PortalDashboard
      tenantId={tenantId}
      namaTenant={tenant?.nama ?? 'Website Saya'}
      portalManaged={portalManaged}
      portalAdminUrl={portalAdminUrl}
      susunanSections={susunanSections}
      hiddenSections={hiddenSections}
      page={page ? { id: page.id, nama_website: page.nama_website, slug: page.slug, status: page.status } : null}
      initialProducts={products}
      hasShop={hasShop}
      hasBooking={hasBooking}
      showProduk={showProduk}
      showLayanan={showLayanan}
      hasMenu={showMenu}
      hasBlog={showBlog}
      hasGallery={showGallery}
      hasPreorder={hasPreorder}
      preorder={konfig.preorder ?? { open: false }}
      localeConfig={konfig.localeConfig}
      contentIsSample={contentIsSample}
      kontenBrand={initialKontenBrand}
      paymentStatus={paymentStatus}
      paymentEntitled={hasPaymentTab}
      initialOrders={shopOrders}
      initialServices={services}
      initialBookings={bookings}
      initialMenu={menu}
      initialBlog={blog}
      initialGallery={gallery}
      initialProfile={profile}
      initialSections={sections}
      initialTampilan={initialTampilan}
    />
  )
}
