// ============================================================
// Pembuatan akun Mitra (Program Mitra) — server-only, dipanggil
// dari admin (invite-only). Mirror pola client-account.ts:
// 1 mitra = 1 akun Supabase Auth (app_metadata.referrer_id) +
// 1 kode referral default. Password plaintext dikembalikan SEKALI
// (tak disimpan) untuk dikirim via WA + email.
// ============================================================

import { supabaseAdmin } from '@/lib/supabase-admin'
import { generatePassword } from '@/lib/client-account'
import { normalizeWa } from '@/lib/fonnte'

export interface CreateReferrerInput {
  nama: string
  email: string
  nomorWa: string
  commissionPercent?: number
  buyerDiscountPercent?: number
}

export interface CreateReferrerResult {
  referrerId: string
  code: string
  email: string
  password: string
}

// Kode default: kata pertama nama (A-Z0-9, maks 8) + 3 karakter acak.
// Contoh: "Budi Santoso" → "BUDI4K7". Retry saat tabrakan UNIQUE.
function candidateCode(nama: string): string {
  const slug = nama
    .trim()
    .split(/\s+/)[0]
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8)
  const charset = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const bytes = new Uint32Array(3)
  crypto.getRandomValues(bytes)
  let rand = ''
  for (let i = 0; i < 3; i++) rand += charset[bytes[i] % charset.length]
  const code = `${slug}${rand}`
  // CHECK DB: ^[A-Z0-9]{4,16}$ — pad bila nama terlalu pendek/kosong.
  return code.length >= 4 ? code : `MITRA${rand}`
}

export async function createReferrerWithAccount(
  input: CreateReferrerInput,
): Promise<CreateReferrerResult> {
  const nama = input.nama.trim()
  const email = input.email.trim().toLowerCase()
  const nomorWa = normalizeWa(input.nomorWa)
  if (!nama) throw new Error('Nama mitra wajib diisi.')
  if (!email.includes('@')) throw new Error('Email mitra tidak valid.')
  if (nomorWa.length < 10) throw new Error('Nomor WA mitra tidak valid.')

  // 1. Insert referrer row.
  const { data: referrer, error: refErr } = await supabaseAdmin
    .from('referrers')
    .insert([{
      nama,
      email,
      nomor_wa: nomorWa,
      commission_percent: input.commissionPercent ?? 10,
      buyer_discount_percent: input.buyerDiscountPercent ?? 5,
      status: 'active',
    }])
    .select('id')
    .single()
  if (refErr) throw new Error(`insert referrer: ${refErr.message}`)

  const referrerId = referrer.id as string
  const password = generatePassword()

  try {
    // 2. Buat akun auth (email langsung confirmed — admin yang membuat).
    const { data: created, error: userErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { referrer_id: referrerId, role: 'referrer' },
      user_metadata: { nama },
    })
    if (userErr) throw new Error(`createUser: ${userErr.message}`)

    // 3. Link user_id ke referrer.
    const { error: linkErr } = await supabaseAdmin
      .from('referrers')
      .update({ user_id: created.user.id })
      .eq('id', referrerId)
    if (linkErr) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id).catch(() => {})
      throw new Error(`link user_id: ${linkErr.message}`)
    }

    // 4. Kode default — retry maks 5x kalau tabrakan UNIQUE.
    let code = ''
    for (let attempt = 0; attempt < 5; attempt++) {
      const cand = candidateCode(nama)
      const { error: codeErr } = await supabaseAdmin
        .from('referral_codes')
        .insert([{ referrer_id: referrerId, code: cand, status: 'active' }])
      if (!codeErr) { code = cand; break }
      if (!codeErr.message.includes('duplicate') && !codeErr.message.includes('unique')) {
        throw new Error(`insert code: ${codeErr.message}`)
      }
    }
    if (!code) throw new Error('Gagal membuat kode referral unik — coba lagi.')

    return { referrerId, code, email, password }
  } catch (err) {
    // Cleanup best-effort supaya tidak ada referrer yatim tanpa akun/kode.
    // (Builder PostgREST tidak melempar — error DB diabaikan di sini.)
    await supabaseAdmin.from('referrers').delete().eq('id', referrerId)
    throw err
  }
}
