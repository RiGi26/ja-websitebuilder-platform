// ============================================================
// Observabilitas keandalan WA — rekam tiap percobaan kirim ke wa_log (server-only).
// Tujuan: kegagalan kirim WA (struk/tahap-lanjut) TAK lagi hening. Saat pembeli
// melapor "tak dapat WA", owner/kami bisa query alasan pasti (token, nomor, http).
//
// Dipakai fire-and-forget setelah sendWhatsApp: `sendWhatsApp(...).then(r => logWa(...))`.
// Insert sendiri di-swallow (jangan sampai logging menggagalkan order/notif).
// ============================================================
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { FonnteResult } from '@/lib/fonnte'
import type { NotifEventKey } from '@/lib/notif/template'

/** Samarkan nomor utk simpan (jangan simpan PII penuh): 6281****5678. */
function maskTarget(phone: string): string {
  const d = String(phone ?? '').replace(/\D/g, '')
  if (d.length <= 8) return d ? `${d.slice(0, 2)}****` : ''
  return `${d.slice(0, 4)}****${d.slice(-4)}`
}

export async function logWa(args: {
  orderCode: string
  tenantSlug: string
  event: NotifEventKey
  target: string
  result: FonnteResult
}): Promise<void> {
  try {
    await supabaseAdmin.from('wa_log').insert({
      order_code: args.orderCode,
      tenant_slug: args.tenantSlug,
      event: args.event,
      target_masked: maskTarget(args.target),
      ok: args.result.ok,
      error: args.result.ok ? null : args.result.error,
    })
  } catch (e) {
    console.error('[wa-log] insert gagal:', (e as Error)?.message)
  }
}
