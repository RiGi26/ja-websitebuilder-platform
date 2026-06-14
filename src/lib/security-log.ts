import { supabaseAdmin } from '@/lib/supabase-admin'

// ============================================================
// P5DB-3 — Monitoring peristiwa keamanan.
// Catat ke console.warn (Vercel observability) + persist ke tabel
// security_events (service-role). BEST-EFFORT & NON-FATAL: kegagalan
// pencatatan tidak boleh menggagalkan request asalnya.
// Tanpa channel notifikasi keluar — analisis/alert via query SQL.
// ============================================================

export type SecurityEventKind =
  | 'admin_login_failed'
  | 'admin_login_ratelimited'
  | 'track_ratelimited'
  | 'refval_ratelimited'
  | 'midtrans_mode_change'

export async function logSecurityEvent(
  kind: SecurityEventKind,
  opts: { ip?: string; detail?: Record<string, unknown> } = {},
): Promise<void> {
  const { ip, detail } = opts
  // Structured log — kelihatan di Vercel logs, gampang di-grep/alert nanti.
  console.warn(`[security] ${kind} ${JSON.stringify({ ip: ip ?? null, ...(detail ?? {}) })}`)
  try {
    await supabaseAdmin.from('security_events').insert({ kind, ip: ip ?? null, detail: detail ?? {} })
  } catch (e) {
    console.error('[security] persist gagal (non-fatal):', e instanceof Error ? e.message : e)
  }
}
