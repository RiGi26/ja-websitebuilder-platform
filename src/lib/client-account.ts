// ============================================================
// Pembuatan akun login customer (pemilik website) — server-only.
// Tiap tenant punya 1 akun Supabase Auth dengan app_metadata.tenant_id,
// sehingga get_tenant_id() (RLS) mengisolasi datanya. Dipakai saat
// provisioning website (auto) maupun pembuatan ulang manual.
// ============================================================

import { supabaseAdmin } from '@/lib/supabase-admin'

// Password acak ramah-ucap (tanpa karakter ambigu) untuk dikirim ke customer.
export function generatePassword(len = 12): string {
  const charset = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint32Array(len)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < len; i++) out += charset[bytes[i] % charset.length]
  return out
}

export type ClientAccountResult =
  | { created: true; email: string; password: string; userId: string }
  | { created: false; email: string; reason: 'exists' | 'no_email' }

/**
 * Buat akun login untuk tenant. Idempotent: jika tenant sudah punya
 * auth_user_id, tidak membuat ulang. Mengembalikan password HANYA saat
 * akun baru dibuat (tak tersimpan di DB).
 */
export async function createClientAccountForTenant(
  tenantId: string,
  email: string | null | undefined,
  namaTenant?: string,
): Promise<ClientAccountResult> {
  // Sudah punya akun? jangan buat ulang.
  const { data: tenant } = await supabaseAdmin
    .from('tenants')
    .select('auth_user_id, email')
    .eq('id', tenantId)
    .maybeSingle()

  const targetEmail = (email ?? tenant?.email ?? '').trim()
  if (tenant?.auth_user_id) {
    return { created: false, email: targetEmail, reason: 'exists' }
  }
  // Tanpa email yang valid, akun tak bisa dibuat (login pakai email).
  if (!targetEmail || !targetEmail.includes('@')) {
    return { created: false, email: targetEmail, reason: 'no_email' }
  }

  const password = generatePassword()

  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email: targetEmail,
    password,
    email_confirm: true, // langsung aktif (admin yang membuat)
    app_metadata: { tenant_id: tenantId, role: 'client' },
    user_metadata: { nama: namaTenant ?? null },
  })
  if (error) throw new Error(`createUser: ${error.message}`)

  const userId = created.user.id
  const { error: linkErr } = await supabaseAdmin
    .from('tenants')
    .update({ auth_user_id: userId })
    .eq('id', tenantId)
  if (linkErr) throw new Error(`link auth_user_id: ${linkErr.message}`)

  return { created: true, email: targetEmail, password, userId }
}
