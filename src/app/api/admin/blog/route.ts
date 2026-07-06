import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

const FIELDS = ['judul', 'slug', 'ringkasan', 'konten', 'cover_url', 'penulis', 'kategori', 'is_published', 'published_at'] as const

// GET ?pageId= : semua artikel halaman (termasuk draft, utk admin)
export async function GET(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const pageId = new URL(request.url).searchParams.get('pageId')
  if (!pageId) return NextResponse.json({ error: 'pageId wajib' }, { status: 400 })
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ posts: data ?? [] })
}

// POST { page_id, tenant_id, judul, ... }
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const b = await request.json()
    if (!b.page_id || !b.tenant_id || !b.judul) {
      return NextResponse.json({ error: 'page_id, tenant_id, judul wajib' }, { status: 400 })
    }
    const row: Record<string, unknown> = { page_id: b.page_id, tenant_id: b.tenant_id, judul: b.judul }
    for (const f of FIELDS) if (f in b) row[f] = b[f]
    // auto set published_at saat dipublish & belum ada
    if (b.is_published && !b.published_at) row.published_at = new Date().toISOString()
    const { data, error } = await supabaseAdmin.from('blog_posts').insert(row).select().single()
    if (error) throw error
    return NextResponse.json({ post: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH { id, ...fields }
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const b = await request.json()
    if (!b.id) return NextResponse.json({ error: 'id wajib' }, { status: 400 })
    const patch: Record<string, unknown> = {}
    for (const f of FIELDS) if (f in b) patch[f] = b[f]
    if (b.is_published && !b.published_at) patch.published_at = new Date().toISOString()
    const { data, error } = await supabaseAdmin.from('blog_posts').update(patch).eq('id', b.id).select().single()
    if (error) throw error
    return NextResponse.json({ post: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE { id }
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'id wajib' }, { status: 400 })
    const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
