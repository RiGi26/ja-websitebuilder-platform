// ============================================================
// HMAC-SHA256 request signing — Website ⇄ Portal (BAKSO_PORTAL_CONTRACT.md §8).
// Server-only (node crypto + env rahasia). JANGAN import dari komponen client.
//
// Base string = `${timestamp}\n${nonce}\n${rawBody}` (untuk endpoint berbody;
// reconcile body-kosong pakai canonical path+query — di luar Fase 1). Digest HEX
// (selaras house-style admin-auth.ts). Verifikasi pakai timing-safe compare +
// jendela skew 5 menit + (opsional) nonce-replay store.
// ============================================================
import crypto from 'crypto'

export const SIG_HEADERS = {
  timestamp: 'x-ja-timestamp',
  nonce: 'x-ja-nonce',
  signature: 'x-ja-signature',
  idempotency: 'idempotency-key',
} as const

export const MAX_SKEW_MS = 5 * 60_000 // 5 menit (contract §8)

function signBase(timestamp: string, nonce: string, rawBody: string): string {
  return `${timestamp}\n${nonce}\n${rawBody}`
}

/** HMAC-SHA256 hex atas base string. */
export function signPayload(secret: string, timestamp: string, nonce: string, rawBody: string): string {
  return crypto.createHmac('sha256', secret).update(signBase(timestamp, nonce, rawBody)).digest('hex')
}

/** Nonce per-request (128-bit hex). */
export function newNonce(): string {
  return crypto.randomBytes(16).toString('hex')
}

/** Timestamp epoch-ms sebagai string (header X-JA-Timestamp). */
export function newTimestamp(): string {
  return String(Date.now())
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

export type VerifyReason = 'missing' | 'skew' | 'bad_signature' | 'replay'
export type VerifyResult = { ok: true } | { ok: false; reason: VerifyReason }

/**
 * Verifikasi request bertanda-tangan masuk. `seenNonce(nonce)` opsional: return
 * true bila nonce sudah pernah dipakai (replay envelope) → tolak. Anti-replay
 * OTORITATIF tetap unique-key idempotency di DB (contract §8); nonce = lapis kedua.
 */
export function verifySignedRequest(opts: {
  secret: string
  timestamp: string | null
  nonce: string | null
  signature: string | null
  rawBody: string
  now?: number
  seenNonce?: (nonce: string) => boolean
}): VerifyResult {
  const { secret, timestamp, nonce, signature, rawBody } = opts
  if (!timestamp || !nonce || !signature) return { ok: false, reason: 'missing' }

  const ts = Number(timestamp)
  const now = opts.now ?? Date.now()
  if (!Number.isFinite(ts) || Math.abs(now - ts) > MAX_SKEW_MS) return { ok: false, reason: 'skew' }

  const expected = signPayload(secret, timestamp, nonce, rawBody)
  if (!timingSafeEqualHex(signature, expected)) return { ok: false, reason: 'bad_signature' }

  if (opts.seenNonce && opts.seenNonce(nonce)) return { ok: false, reason: 'replay' }
  return { ok: true }
}

/**
 * Cache nonce in-memory (per-instance — sama caveat rate-limit.ts). Cukup utk
 * Fase 1 stub; produksi nyata pindah ke shared store (Redis/DB) per contract §8.
 * Mengembalikan true bila nonce SUDAH terlihat (= replay).
 */
export function makeNonceCache(ttlMs = MAX_SKEW_MS) {
  const seen = new Map<string, number>()
  let lastPrune = 0
  return (nonce: string): boolean => {
    const now = Date.now()
    if (now - lastPrune > 60_000) {
      for (const [k, exp] of seen) if (exp <= now) seen.delete(k)
      lastPrune = now
    }
    if (seen.has(nonce)) return true
    seen.set(nonce, now + ttlMs)
    return false
  }
}
