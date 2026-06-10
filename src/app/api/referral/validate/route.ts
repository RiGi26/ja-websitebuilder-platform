import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit'
import { logSecurityEvent } from '@/lib/security-log'
import { normalizeCode, lookupActiveCode } from '@/lib/referral'

export const dynamic = 'force-dynamic'

// Validasi kode referral untuk form order (publik, rate-limited).
// Respons sengaja minim: jangan pernah bocorkan komisi, id, atau kontak mitra.

async function validate(req: NextRequest, raw: unknown) {
  const ip = clientIp(req)
  const rl = rateLimit(`refval:${ip}`, 30, 60_000)
  if (!rl.allowed) {
    await logSecurityEvent('refval_ratelimited', { ip })
    return tooManyRequests(rl.retryAfter)
  }

  const code = normalizeCode(raw)
  const ref = code ? await lookupActiveCode(code) : null
  if (!ref) return NextResponse.json({ valid: false })

  return NextResponse.json({
    valid: true,
    discountPercent: ref.discountPercent,
    referrerName: ref.referrerName,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    return await validate(req, body?.code)
  } catch (err) {
    console.error('[api/referral/validate]', err)
    return NextResponse.json({ valid: false })
  }
}

export async function GET(req: NextRequest) {
  try {
    return await validate(req, req.nextUrl.searchParams.get('code'))
  } catch (err) {
    console.error('[api/referral/validate]', err)
    return NextResponse.json({ valid: false })
  }
}
