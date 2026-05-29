import { NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

// Dipanggil via <a href="/api/admin/logout"> (GET) dari dashboard admin.
// Hapus cookie sesi lalu redirect ke halaman login.
export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
