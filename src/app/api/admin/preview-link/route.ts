import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createPreviewToken, PREVIEW_TOKEN_MAX_AGE_MS } from '@/lib/preview-token'

// Mint link pratinjau klien untuk sebuah halaman (admin-gated). Dipakai tombol
// "Link Klien" di PreviewBar: admin salin URL /preview/<token> → kirim ke klien
// via WA → klien melihat draft persis-live tanpa login. Token HMAC ber-expiry
// (preview-token.ts); tak ada state di DB — kedaluwarsa = 404.

export async function POST(request: Request) {
  const cookieStore = await cookies()
  if (!verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const pageId = (body as Record<string, unknown> | null)?.pageId
    if (!pageId || typeof pageId !== 'string') {
      return NextResponse.json({ error: 'pageId wajib' }, { status: 400 })
    }

    // Pastikan halaman ada sebelum menandatangani link (hindari link 404 tersebar).
    const { data: page, error } = await supabaseAdmin
      .from('landing_pages')
      .select('id')
      .eq('id', pageId)
      .maybeSingle()
    if (error) throw error
    if (!page) return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 })

    const token = createPreviewToken(pageId)
    // Origin dari request (jalan di preview *.vercel.app maupun production).
    const origin = new URL(request.url).origin
    return NextResponse.json({
      url: `${origin}/preview/${token}`,
      expiresInDays: Math.round(PREVIEW_TOKEN_MAX_AGE_MS / 86_400_000),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
