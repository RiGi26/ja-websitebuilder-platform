import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
  createAdminSessionToken,
} from '@/lib/admin-auth'
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit'
import { logSecurityEvent } from '@/lib/security-log'

export async function POST(request: Request) {
  const ip = clientIp(request)
  // P5DB-1 — rem brute force: maks 8 percobaan / 10 menit per IP.
  const rl = rateLimit(`admin-login:${ip}`, 8, 10 * 60_000)
  if (!rl.allowed) {
    await logSecurityEvent('admin_login_ratelimited', { ip })
    return tooManyRequests(rl.retryAfter)
  }

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
    await logSecurityEvent('admin_login_failed', { ip, detail: { remaining: rl.remaining } })
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
