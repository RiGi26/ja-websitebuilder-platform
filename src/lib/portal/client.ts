// ============================================================
// Portal client — satu-satunya jalur WRITE website→portal: POST {PORTAL}/api/orders
// (BAKSO_PORTAL_CONTRACT.md §4.1). Bertanda-tangan HMAC (§8) + Idempotency-Key.
// Server-only (rahasia env). House-style outbound: AbortController 15s, Result
// union, fail-closed bila secret belum di-set (order TIDAK boleh diam-diam lolos).
//
// Fase 1: {PORTAL} = stub in-repo (PORTAL_API_URL → `${origin}/api/_portal`). Saat
// Portal nyata live (Fase 2) cukup ganti PORTAL_API_URL — nol perubahan kode.
// ============================================================
import { signPayload, newNonce, newTimestamp, SIG_HEADERS } from './sign'
import type { PortalOrderRequest, PortalOrderResponse, PortalErrorBody } from './types'

const TIMEOUT_MS = 15_000

function getConfig(): { url: string; secret: string } | null {
  const url = process.env.PORTAL_API_URL
  const secret = process.env.PORTAL_API_SECRET
  if (!url || !secret) return null
  return { url: url.replace(/\/+$/, ''), secret }
}

export type PortalCallResult =
  // 201 (fresh) atau 200 (replay idempoten) — body sukses
  | { ok: true; status: 200 | 201; body: PortalOrderResponse }
  // 4xx kontrak (stock_conflict/unknown_*/invalid_payload/…)
  | { ok: false; kind: 'contract'; status: number; body: PortalErrorBody }
  // gangguan transport / konfigurasi (fail-closed)
  | { ok: false; kind: 'transport'; reason: 'not_configured' | 'unreachable' | 'bad_response' }

export async function createPortalOrder(
  req: PortalOrderRequest,
  idempotencyKey: string,
): Promise<PortalCallResult> {
  const cfg = getConfig()
  if (!cfg) {
    console.error('[portal-client] PORTAL_API_URL/PORTAL_API_SECRET belum di-set — order ditolak (fail-closed)')
    return { ok: false, kind: 'transport', reason: 'not_configured' }
  }

  const rawBody = JSON.stringify(req)
  const timestamp = newTimestamp()
  const nonce = newNonce()
  const signature = signPayload(cfg.secret, timestamp, nonce, rawBody)

  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${cfg.url}/orders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        [SIG_HEADERS.timestamp]: timestamp,
        [SIG_HEADERS.nonce]: nonce,
        [SIG_HEADERS.signature]: signature,
        [SIG_HEADERS.idempotency]: idempotencyKey,
      },
      body: rawBody,
      signal: ac.signal,
    })
    clearTimeout(timer)

    const json = await res.json().catch(() => null)
    if (json == null || typeof json !== 'object') {
      return { ok: false, kind: 'transport', reason: 'bad_response' }
    }
    if (res.status === 201 || res.status === 200) {
      return { ok: true, status: res.status as 200 | 201, body: json as PortalOrderResponse }
    }
    return { ok: false, kind: 'contract', status: res.status, body: json as PortalErrorBody }
  } catch (err) {
    clearTimeout(timer)
    const e = err as { cause?: { code?: string }; message?: string }
    console.error('[portal-client] fetch gagal:', e?.cause?.code || e?.message)
    return { ok: false, kind: 'transport', reason: 'unreachable' }
  }
}
