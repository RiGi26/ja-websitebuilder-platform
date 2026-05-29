import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
  createAdminSessionToken,
} from '@/lib/admin-auth'

export async function POST(request: Request) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  // Tidak ada fallback password default — wajib di-set via env.
  if (!ADMIN_PASSWORD) {
    console.error('[admin/login] ADMIN_PASSWORD belum di-set di environment')
    return NextResponse.json(
      { success: false, error: 'Server belum dikonfigurasi (ADMIN_PASSWORD)' },
      { status: 500 },
    )
  }

  const { password } = await request.json()
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  // Cookie berisi token signed (HMAC) — bukan nilai statik yg bisa ditebak.
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: '/',
  })
  return response
}
