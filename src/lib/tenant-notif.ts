// ============================================================
// Konfigurasi notifikasi WA per-tenant. Server-only.
//
// Token Fonnte tenant disimpan TERENKRIPSI di tenant_notif_config (AES-256-GCM,
// reuse crypto-secret.ts). HYBRID: token tenant (bila is_active) menimpa token
// platform; kosong/non-aktif → pakai FONNTE_TOKEN platform (zero-config).
// Template per-event = free-text editable, dirender aman oleh notif/template.ts.
//
// Mirror pola tenant-midtrans.ts (tabel tenant_payment_config).
// ============================================================

import { supabaseAdmin } from '@/lib/supabase-admin'
import { encryptSecret, decryptSecret, maskKey } from '@/lib/crypto-secret'
import { NOTIF_EVENTS, type NotifEventKey } from '@/lib/notif/template'

export type TenantNotif = {
  /** Token tenant terdekripsi — hanya bila is_active & tersimpan. null = pakai platform. */
  token: string | null
  isActive: boolean
  templates: Partial<Record<NotifEventKey, string>>
}

// Ambil konfigurasi notif tenant. Token didekripsi hanya bila aktif.
export async function getTenantNotif(tenantId: string): Promise<TenantNotif> {
  const { data, error } = await supabaseAdmin
    .from('tenant_notif_config')
    .select('fonnte_token_enc, is_active, templates')
    .eq('tenant_id', tenantId)
    .maybeSingle()
  if (error) throw new Error(`getTenantNotif: ${error.message}`)
  const isActive = !!data?.is_active
  const token = isActive && data?.fonnte_token_enc ? decryptSecret(data.fonnte_token_enc) : null
  return {
    token,
    isActive,
    templates: (data?.templates ?? {}) as Partial<Record<NotifEventKey, string>>,
  }
}

/** Token efektif (HYBRID): token tenant aktif → token platform env → undefined. */
export function effectiveFonnteToken(notif: TenantNotif): string | undefined {
  return notif.token || process.env.FONNTE_TOKEN || undefined
}

// Simpan/Update konfigurasi (token dienkripsi sebelum disimpan). Template hanya
// key event yang dikenal yang ikut tersimpan (buang yang asing).
export async function saveTenantNotif(
  tenantId: string,
  opts: { token?: string; isActive?: boolean; templates?: Partial<Record<NotifEventKey, string>> },
): Promise<void> {
  const patch: Record<string, unknown> = { tenant_id: tenantId, updated_at: new Date().toISOString() }
  if (typeof opts.token === 'string' && opts.token.trim()) {
    patch.fonnte_token_enc = encryptSecret(opts.token.trim())
  }
  if (opts.isActive !== undefined) patch.is_active = opts.isActive
  if (opts.templates !== undefined) {
    const clean: Partial<Record<NotifEventKey, string>> = {}
    for (const k of Object.keys(NOTIF_EVENTS) as NotifEventKey[]) {
      const v = opts.templates[k]
      if (typeof v === 'string' && v.trim()) clean[k] = v.trim()
    }
    patch.templates = clean
  }
  const { error } = await supabaseAdmin
    .from('tenant_notif_config')
    .upsert(patch, { onConflict: 'tenant_id' })
  if (error) throw new Error(`saveTenantNotif: ${error.message}`)
}

// Status ringkas untuk UI — TANPA pernah membuka token mentah.
export async function getTenantNotifStatus(tenantId: string): Promise<{
  configured: boolean
  isActive: boolean
  tokenMask: string | null
  templates: Partial<Record<NotifEventKey, string>>
}> {
  const { data } = await supabaseAdmin
    .from('tenant_notif_config')
    .select('fonnte_token_enc, is_active, templates')
    .eq('tenant_id', tenantId)
    .maybeSingle()
  let tokenMask: string | null = null
  if (data?.fonnte_token_enc) {
    try { tokenMask = maskKey(decryptSecret(data.fonnte_token_enc)) } catch { tokenMask = '••••' }
  }
  return {
    configured: !!data?.fonnte_token_enc,
    isActive: !!data?.is_active,
    tokenMask,
    templates: (data?.templates ?? {}) as Partial<Record<NotifEventKey, string>>,
  }
}
