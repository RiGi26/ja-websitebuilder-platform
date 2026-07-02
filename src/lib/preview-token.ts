import crypto from 'crypto'

// Token link pratinjau klien — draft site sebagai "mockup" yang direview klien
// SEBELUM publish (alur B: mockup = draft build; yang di-approve = persis yang
// live, satu codepath renderSite). Pola sama admin-auth.ts:
// base64url(payload).hmacSHA256hex(payload), server-only (node crypto + env).
// Beda dari sesi admin: payload mengikat pageId, umur default 14 hari, dan
// TIDAK memberi akses apa pun selain melihat render halaman itu.

export const PREVIEW_TOKEN_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000 // 14 hari

// Reuse rantai secret admin (tanpa env baru); PREVIEW_LINK_SECRET opsional bila
// ingin memisahkan (rotasi link pratinjau tanpa memutus sesi admin).
function getSecret(): string {
  const secret =
    process.env.PREVIEW_LINK_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error('PREVIEW_LINK_SECRET / ADMIN_SESSION_SECRET / ADMIN_PASSWORD belum di-set')
  }
  return secret
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

export function createPreviewToken(pageId: string, maxAgeMs = PREVIEW_TOKEN_MAX_AGE_MS): string {
  const exp = Date.now() + maxAgeMs
  const payload = Buffer.from(JSON.stringify({ pid: pageId, exp })).toString('base64url')
  return `${payload}.${sign(payload, getSecret())}`
}

/** pageId bila token sah & belum kedaluwarsa; selain itu null. */
export function verifyPreviewToken(token: string | undefined | null): string | null {
  if (!token) return null
  const dot = token.indexOf('.')
  if (dot <= 0) return null
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  if (!payload || !sig) return null

  let secret: string
  try {
    secret = getSecret()
  } catch {
    return null
  }

  const expected = sign(payload, secret)
  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { pid?: string; exp?: number }
    if (typeof decoded.pid !== 'string' || !decoded.pid) return null
    if (typeof decoded.exp !== 'number' || Date.now() >= decoded.exp) return null
    return decoded.pid
  } catch {
    return null
  }
}
