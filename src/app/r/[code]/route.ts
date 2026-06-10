import { NextRequest, NextResponse } from 'next/server'
import { normalizeCode, lookupActiveCode, REFERRAL_COOKIE } from '@/lib/referral'

export const dynamic = 'force-dynamic'

// Short link mitra: {builder}/r/KODE → set cookie atribusi 30 hari di domain
// builder (dibaca form /order), lalu redirect ke landing dengan ?ref= supaya
// corp landing (static export) juga merekamnya di localStorage.

const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? 'https://japanarena.com'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const norm = normalizeCode(decodeURIComponent(code))
  const ref = norm ? await lookupActiveCode(norm) : null

  const res = NextResponse.redirect(
    ref ? `${LANDING_URL}/?ref=${encodeURIComponent(ref.code)}` : `${LANDING_URL}/`,
  )
  if (ref) {
    res.cookies.set(REFERRAL_COOKIE, ref.code, {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      // Bukan httpOnly — form /order membacanya via document.cookie.
      httpOnly: false,
    })
  }
  return res
}
