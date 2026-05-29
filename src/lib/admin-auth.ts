import crypto from 'crypto'

// Signed admin session — pengganti cookie statik `admin_auth=true` yg bisa
// di-replay siapa pun (httpOnly tidak mencegah orang mengirim cookie manual).
// Token = base64url(payload).hmacSHA256(payload). Diverifikasi server-side
// dengan secret rahasia + cek expiry. Tanpa secret yg benar, token tak bisa
// dipalsukan. File ini server-only (pakai node crypto + env rahasia).

export const ADMIN_COOKIE_NAME = 'admin_session'
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 // 1 hari (detik)

// Secret untuk menandatangani sesi. Pakai ADMIN_SESSION_SECRET kalau ada,
// fallback ke ADMIN_PASSWORD (tetap rahasia). Wajib salah satu di-set.
function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET atau ADMIN_PASSWORD belum di-set — admin auth dinonaktifkan',
    )
  }
  return secret
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

export function createAdminSessionToken(): string {
  const exp = Date.now() + ADMIN_COOKIE_MAX_AGE * 1000
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url')
  return `${payload}.${sign(payload, getSecret())}`
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const dot = token.indexOf('.')
  if (dot <= 0) return false
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  if (!payload || !sig) return false

  let secret: string
  try {
    secret = getSecret()
  } catch {
    return false
  }

  // Bandingkan signature dengan timing-safe equal.
  const expected = sign(payload, secret)
  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false
  }

  // Cek expiry.
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp?: number }
    return typeof decoded.exp === 'number' && Date.now() < decoded.exp
  } catch {
    return false
  }
}
