import { supabaseAdmin } from '@/lib/supabase-admin'
import { MAX_SKEW_MS } from './sign'

// ============================================================
// Nonce shared-store DB-backed untuk INGEST push Portal→WB (BAKSO_PORTAL_CONTRACT.md §8).
// INSERT ON CONFLICT DO NOTHING RETURNING (atomik, replay-safe lintas instance) —
// pengganti makeNonceCache per-instance (sign.ts) yang bocor lintas-lambda. Dipakai
// /api/sync/* yang tak punya idempotency key.
// ============================================================
export type IngestNonceResult = 'fresh' | 'replay' | 'error'

export async function consumeIngestNonce(nonce: string | null, ttlMs = MAX_SKEW_MS): Promise<IngestNonceResult> {
  if (!nonce) return 'replay'
  const { data, error } = await supabaseAdmin
    .from('used_nonce')
    .upsert(
      { nonce, expires_at: new Date(Date.now() + ttlMs).toISOString() },
      { onConflict: 'nonce', ignoreDuplicates: true },
    )
    .select('nonce')
  if (error) {
    console.error('[ingest-nonce] store error:', error.message)
    return 'error'
  }
  return (data?.length ?? 0) > 0 ? 'fresh' : 'replay'
}
