// ============================================================
// Fetch helper data add-on (tabel bersama multi-tenant — Stage 3).
// Dipakai rendering publik. Memakai anon client → RLS hanya
// mengizinkan baris milik landing_page yang published.
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Product, BlogPost, Service, MenuItem, GalleryImage, TenantProfile } from '@/types/websitebuilder'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>

// Produk aktif untuk sebuah halaman, urut by urutan lalu nama.
export async function fetchProductsByPage(client: Client, pageId: string): Promise<Product[]> {
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('page_id', pageId)
    .eq('is_active', true)
    .order('urutan', { ascending: true })
    .order('nama', { ascending: true })

  if (error) {
    console.error('fetchProductsByPage:', error.message)
    return []
  }
  return (data ?? []) as Product[]
}

// Layanan aktif untuk sebuah halaman (booking), urut by urutan lalu nama.
export async function fetchServicesByPage(client: Client, pageId: string): Promise<Service[]> {
  const { data, error } = await client
    .from('services')
    .select('*')
    .eq('page_id', pageId)
    .eq('is_active', true)
    .order('urutan', { ascending: true })
    .order('nama', { ascending: true })

  if (error) {
    console.error('fetchServicesByPage:', error.message)
    return []
  }
  return (data ?? []) as Service[]
}

// Item menu aktif untuk sebuah halaman (resto), urut by urutan lalu nama.
export async function fetchMenuItemsByPage(client: Client, pageId: string): Promise<MenuItem[]> {
  // Kolom EKSPLISIT (bukan select('*')): ini fetch publik via anon client untuk
  // render situs. hpp (biaya) & stok_harian TIDAK boleh bocor ke pengunjung →
  // sengaja tidak diambil. is_sold_out disertakan untuk badge "Habis".
  // Owner/portal membaca kolom penuh lewat path authenticated (lihat portal).
  const { data, error } = await client
    .from('menu_items')
    .select('id, tenant_id, page_id, kategori, nama, deskripsi, harga, gambar_url, is_active, urutan, created_at, updated_at, is_sold_out')
    .eq('page_id', pageId)
    .eq('is_active', true)
    .order('urutan', { ascending: true })
    .order('nama', { ascending: true })

  if (error) {
    console.error('fetchMenuItemsByPage:', error.message)
    return []
  }
  return (data ?? []) as MenuItem[]
}

// Galeri foto aktif untuk sebuah halaman, urut by urutan.
export async function fetchGalleryByPage(client: Client, pageId: string): Promise<GalleryImage[]> {
  const { data, error } = await client
    .from('gallery_images')
    .select('*')
    .eq('page_id', pageId)
    .eq('is_active', true)
    .order('urutan', { ascending: true })
  if (error) { console.error('fetchGalleryByPage:', error.message); return [] }
  return (data ?? []) as GalleryImage[]
}

// Profil bisnis (1 baris) untuk sebuah halaman. null bila belum diisi.
export async function fetchTenantProfile(client: Client, pageId: string): Promise<TenantProfile | null> {
  const { data, error } = await client
    .from('tenant_profile')
    .select('*')
    .eq('page_id', pageId)
    .maybeSingle()
  if (error) { console.error('fetchTenantProfile:', error.message); return null }
  return (data ?? null) as TenantProfile | null
}

// Artikel published untuk sebuah halaman, terbaru dulu.
export async function fetchBlogPostsByPage(client: Client, pageId: string): Promise<BlogPost[]> {
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('page_id', pageId)
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchBlogPostsByPage:', error.message)
    return []
  }
  return (data ?? []) as BlogPost[]
}
