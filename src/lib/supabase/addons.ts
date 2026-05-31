// ============================================================
// Fetch helper data add-on (tabel bersama multi-tenant — Stage 3).
// Dipakai rendering publik. Memakai anon client → RLS hanya
// mengizinkan baris milik landing_page yang published.
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Product, BlogPost, Service } from '@/types/websitebuilder'

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
