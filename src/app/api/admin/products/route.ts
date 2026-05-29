import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

const FIELDS = ['nama', 'deskripsi', 'harga', 'gambar_url', 'kategori', 'stok', 'is_active', 'urutan'] as const

// GET ?pageId= : semua produk halaman (termasuk non-aktif, utk admin)
export async function GET(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const pageId = new URL(request.url).searchParams.get('pageId')
  if (!pageId) return NextResponse.json({ error: 'pageId wajib' }, { status: 400 })
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('page_id', pageId)
    .order('urutan', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: data ?? [] })
}

// POST { page_id, tenant_id, nama, harga, ... }
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const b = await request.json()
    if (!b.page_id || !b.tenant_id || !b.nama) {
      return NextResponse.json({ error: 'page_id, tenant_id, nama wajib' }, { status: 400 })
    }
    const row: Record<string, unknown> = { page_id: b.page_id, tenant_id: b.tenant_id, nama: b.nama }
    for (const f of FIELDS) if (f in b) row[f] = b[f]
    const { data, error } = await supabaseAdmin.from('products').insert(row).select().single()
    if (error) throw error
    return NextResponse.json({ product: data })
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
    const { data, error } = await supabaseAdmin.from('products').update(patch).eq('id', b.id).select().single()
    if (error) throw error
    return NextResponse.json({ product: data })
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
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
