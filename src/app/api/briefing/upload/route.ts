import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Upload gambar dari FORM BRIEFING (pra-akun) → Supabase Storage (bucket public
// 'tenant-uploads'). Otorisasi via briefing token (orders.tracking_token), BUKAN
// sesi portal — pembeli belum punya akun saat mengisi briefing. Path di-scope
// per order: briefing/<orderId>/<uuid>.<ext>. Validasi sama dgn /api/portal/upload.

const BUCKET = 'tenant-uploads'
const MAX_BYTES = 5 * 1024 * 1024
const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const token = form.get('token')
    const file = form.get('file')
    if (typeof token !== 'string' || !token) {
      return NextResponse.json({ error: 'token wajib' }, { status: 400 })
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File wajib' }, { status: 400 })
    }
    const ext = MIME_EXT[file.type]
    if (!ext) {
      return NextResponse.json({ error: 'Format harus JPG, PNG, WebP, atau GIF' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Ukuran gambar maksimal 5MB' }, { status: 400 })
    }

    // Verifikasi token → order (pola sama /api/briefing/detail). Token milik order
    // berbayar nyata → membatasi surface upload anonim.
    const { data: order, error: tokenErr } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('tracking_token', token)
      .maybeSingle()
    if (tokenErr) throw tokenErr
    if (!order) return NextResponse.json({ error: 'Token tidak valid' }, { status: 404 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const path = `briefing/${order.id}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    })
    if (error) throw error

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ ok: true, url: data.publicUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
