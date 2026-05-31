// ============================================================
// Akses konfigurasi pembayaran Midtrans per-tenant. Server-only.
// Dipakai route checkout & webhook toko. Server key klien disimpan
// terenkripsi di tenant_payment_config (lihat crypto-secret.ts).
// ============================================================

import { supabaseAdmin } from '@/lib/supabase-admin'
import { encryptSecret, decryptSecret } from '@/lib/crypto-secret'

export type TenantMidtrans = {
  serverKey: string
  clientKey: string | null
  isProduction: boolean
  snapApiUrl: string
}

// Ambil & dekripsi kredensial Midtrans tenant. null bila belum dikonfigurasi/aktif.
export async function getTenantMidtrans(tenantId: string): Promise<TenantMidtrans | null> {
  const { data, error } = await supabaseAdmin
    .from('tenant_payment_config')
    .select('midtrans_server_key_enc, midtrans_client_key, midtrans_is_production, is_active')
    .eq('tenant_id', tenantId)
    .maybeSingle()
  if (error) throw new Error(`getTenantMidtrans: ${error.message}`)
  if (!data || !data.is_active || !data.midtrans_server_key_enc) return null

  const serverKey = decryptSecret(data.midtrans_server_key_enc)
  const isProduction = !!data.midtrans_is_production
  return {
    serverKey,
    clientKey: data.midtrans_client_key ?? null,
    isProduction,
    snapApiUrl: isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions',
  }
}

// Simpan/Update kredensial (server key dienkripsi sebelum disimpan).
export async function saveTenantMidtrans(
  tenantId: string,
  opts: { serverKey?: string; clientKey?: string | null; isProduction?: boolean; isActive?: boolean },
): Promise<void> {
  const patch: Record<string, unknown> = { tenant_id: tenantId }
  if (typeof opts.serverKey === 'string' && opts.serverKey.trim()) {
    patch.midtrans_server_key_enc = encryptSecret(opts.serverKey.trim())
  }
  if (opts.clientKey !== undefined) patch.midtrans_client_key = opts.clientKey
  if (opts.isProduction !== undefined) patch.midtrans_is_production = opts.isProduction
  if (opts.isActive !== undefined) patch.is_active = opts.isActive

  const { error } = await supabaseAdmin
    .from('tenant_payment_config')
    .upsert(patch, { onConflict: 'tenant_id' })
  if (error) throw new Error(`saveTenantMidtrans: ${error.message}`)
}

// Status ringkas untuk UI (tanpa membuka server key).
export async function getTenantPaymentStatus(tenantId: string): Promise<{
  configured: boolean
  isActive: boolean
  isProduction: boolean
  clientKey: string | null
}> {
  const { data } = await supabaseAdmin
    .from('tenant_payment_config')
    .select('midtrans_server_key_enc, midtrans_client_key, midtrans_is_production, is_active')
    .eq('tenant_id', tenantId)
    .maybeSingle()
  return {
    configured: !!data?.midtrans_server_key_enc,
    isActive: !!data?.is_active,
    isProduction: !!data?.midtrans_is_production,
    clientKey: data?.midtrans_client_key ?? null,
  }
}
