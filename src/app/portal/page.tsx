import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getTenantPaymentStatus } from '@/lib/tenant-midtrans'
import type { Product, Service, MenuItem, BlogPost, GalleryImage, TenantProfile } from '@/types/websitebuilder'
import PortalDashboard, { type ShopOrderRow, type BookingRow } from './PortalDashboard'

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
    .select('id, nama_website, slug, status, tipe_industri, konfigurasi')
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

  const konfig = (page?.konfigurasi ?? {}) as { features?: Record<string, boolean> }
  const hasShop = !!konfig.features?.hasCart
  const hasBooking = !!konfig.features?.hasBooking
  const hasMenu = !!konfig.features?.hasMenu
  const hasBlog = !!konfig.features?.hasBlog
  const hasGallery = !!konfig.features?.hasGallery

  const paymentStatus = await getTenantPaymentStatus(tenantId)

  // Pesanan masuk (toko) — terbaru dulu, dengan item-nya.
  let shopOrders: ShopOrderRow[] = []
  if (hasShop && page?.id) {
    const { data } = await supabaseAdmin
      .from('shop_orders')
      .select('*, shop_order_items(*)')
      .eq('page_id', page.id)
      .order('created_at', { ascending: false })
      .limit(100)
    shopOrders = (data ?? []) as ShopOrderRow[]
  }

  // Layanan + reservasi (booking) — kalau fitur booking aktif.
  let services: Service[] = []
  let bookings: BookingRow[] = []
  if (hasBooking && page?.id) {
    const [{ data: svc }, { data: bk }] = await Promise.all([
      supabaseAdmin.from('services').select('*').eq('page_id', page.id).order('urutan', { ascending: true }),
      supabaseAdmin.from('bookings').select('*, services(nama)').eq('page_id', page.id).order('created_at', { ascending: false }).limit(100),
    ])
    services = (svc ?? []) as Service[]
    bookings = (bk ?? []) as BookingRow[]
  }

  // Menu (resto) — kalau fitur menu aktif.
  let menu: MenuItem[] = []
  if (hasMenu && page?.id) {
    const { data } = await supabaseAdmin
      .from('menu_items').select('*').eq('page_id', page.id).order('urutan', { ascending: true })
    menu = (data ?? []) as MenuItem[]
  }

  // Blog & galeri & profil bisnis (customer-editable).
  let blog: BlogPost[] = []
  if (hasBlog && page?.id) {
    const { data } = await supabaseAdmin
      .from('blog_posts').select('*').eq('page_id', page.id).order('created_at', { ascending: false })
    blog = (data ?? []) as BlogPost[]
  }
  let gallery: GalleryImage[] = []
  if (hasGallery && page?.id) {
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

  return (
    <PortalDashboard
      tenantId={tenantId}
      namaTenant={tenant?.nama ?? 'Website Saya'}
      page={page ? { id: page.id, nama_website: page.nama_website, slug: page.slug, status: page.status } : null}
      initialProducts={products}
      hasShop={hasShop}
      hasBooking={hasBooking}
      hasMenu={hasMenu}
      hasBlog={hasBlog}
      hasGallery={hasGallery}
      paymentStatus={paymentStatus}
      initialOrders={shopOrders}
      initialServices={services}
      initialBookings={bookings}
      initialMenu={menu}
      initialBlog={blog}
      initialGallery={gallery}
      initialProfile={profile}
    />
  )
}
