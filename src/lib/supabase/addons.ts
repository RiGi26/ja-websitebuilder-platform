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

// Artikel published paged (index blog publik /{slug}/blog). Filter kategori
// opsional; total utk pagination. perPage default 9 (grid 3×3 mockup).
export async function fetchPublishedBlogPostsPaged(
  client: Client,
  pageId: string,
  opts: { page?: number; perPage?: number; kategori?: string | null } = {},
): Promise<{ posts: BlogPost[]; total: number }> {
  const perPage = Math.min(Math.max(opts.perPage ?? 9, 1), 24)
  const page = Math.max(opts.page ?? 1, 1)
  const from = (page - 1) * perPage

  let q = client
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('page_id', pageId)
    .eq('is_published', true)
  if (opts.kategori) q = q.eq('kategori', opts.kategori)

  const { data, count, error } = await q
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(from, from + perPage - 1)

  if (error) {
    console.error('fetchPublishedBlogPostsPaged:', error.message)
    return { posts: [], total: 0 }
  }
  return { posts: (data ?? []) as BlogPost[], total: count ?? 0 }
}

// Satu artikel published by slug (halaman baca /{slug}/blog/{postSlug}).
// Draft/slug asing → null (route menjawab 404).
export async function fetchBlogPostBySlug(client: Client, pageId: string, postSlug: string): Promise<BlogPost | null> {
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('page_id', pageId)
    .eq('slug', postSlug)
    .eq('is_published', true)
    .maybeSingle()
  if (error) { console.error('fetchBlogPostBySlug:', error.message); return null }
  return (data ?? null) as BlogPost | null
}

// Artikel pinned (kurasi "Paling Dibaca" di index blog), published saja.
export async function fetchPinnedBlogPosts(client: Client, pageId: string, limit = 4): Promise<BlogPost[]> {
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('page_id', pageId)
    .eq('is_published', true)
    .eq('is_pinned', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit)
  if (error) { console.error('fetchPinnedBlogPosts:', error.message); return [] }
  return (data ?? []) as BlogPost[]
}

// Daftar kategori distinct dari artikel published (chips filter index blog).
export async function fetchBlogKategoris(client: Client, pageId: string): Promise<string[]> {
  const { data, error } = await client
    .from('blog_posts')
    .select('kategori')
    .eq('page_id', pageId)
    .eq('is_published', true)
    .not('kategori', 'is', null)
  if (error) { console.error('fetchBlogKategoris:', error.message); return [] }
  const set = new Set<string>()
  for (const r of (data ?? []) as Array<{ kategori: string | null }>) {
    const k = r.kategori?.trim()
    if (k) set.add(k)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'id'))
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
