// ============================================================
// Konfigurasi Midtrans tingkat PLATFORM (akun Japan Arena sendiri yang menagih
// customer untuk pembuatan website). Server-only.
//
// Mode (sandbox|production) disimpan di DB (platform_settings.midtrans_mode),
// BUKAN di env build-time, supaya bisa di-switch dari /admin tanpa redeploy.
// Server key tetap di env (rahasia) — dua key hidup berdampingan, toggle DB cuma
// memilih key + endpoint mana yang dipakai saat runtime.
//
// Bandingkan dengan tenant-midtrans.ts (Midtrans per-tenant untuk toko klien).
// ============================================================

import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'

export type MidtransMode = 'sandbox' | 'production'

const SNAP_API: Record<MidtransMode, string> = {
  production: 'https://app.midtrans.com/snap/v1/transactions',
  sandbox: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
}
const STATUS_API: Record<MidtransMode, string> = {
  production: 'https://api.midtrans.com/v2',
  sandbox: 'https://api.sandbox.midtrans.com/v2',
}

export type PlatformMidtrans = {
  mode: MidtransMode
  isProduction: boolean
  serverKey: string
  snapApiUrl: string // Snap "create transaction"
  statusApiUrl: string // Core API v2 base (cek status transaksi)
}

// Mode yang dipakai key legacy tunggal (MIDTRANS_SERVER_KEY). CATATAN: prefix
// 'SB-' TIDAK bisa diandalkan untuk membedakan sandbox vs production — sebagian
// akun Midtrans mengeluarkan sandbox key tanpa prefix 'SB-'. Jadi key tunggal
// hanya di-fallback ke mode yang DULU memang dikonfigurasi untuknya, yaitu nilai
// NEXT_PUBLIC_MIDTRANS_ENV — bukan ditebak dari isi key.
function legacyMode(): MidtransMode {
  return process.env.NEXT_PUBLIC_MIDTRANS_ENV === 'production' ? 'production' : 'sandbox'
}

// Resolusi server key untuk sebuah mode. null bila belum dikonfigurasi.
// Urutan: env per-mode (eksplisit) → legacy MIDTRANS_SERVER_KEY (hanya untuk mode
// yang cocok dengan NEXT_PUBLIC_MIDTRANS_ENV, menjaga perilaku lama tetap utuh).
export function serverKeyForMode(mode: MidtransMode): string | null {
  const explicit =
    mode === 'production'
      ? process.env.MIDTRANS_SERVER_KEY_PRODUCTION?.trim()
      : process.env.MIDTRANS_SERVER_KEY_SANDBOX?.trim()
  if (explicit) return explicit

  const legacy = process.env.MIDTRANS_SERVER_KEY?.trim()
  if (legacy && mode === legacyMode()) return legacy
  return null
}

// Mode aktif. Sumber kebenaran = DB. Bila baris belum ada / nilai invalid,
// fallback ke perilaku legacy (NEXT_PUBLIC_MIDTRANS_ENV) supaya tak ada
// perubahan perilaku sebelum admin pertama kali menge-set lewat UI.
export async function getMidtransMode(): Promise<MidtransMode> {
  const { data } = await supabaseAdmin
    .from('platform_settings')
    .select('value')
    .eq('key', 'midtrans_mode')
    .maybeSingle()
  const v = data?.value
  if (v === 'production' || v === 'sandbox') return v
  return process.env.NEXT_PUBLIC_MIDTRANS_ENV === 'production' ? 'production' : 'sandbox'
}

// Konfigurasi penuh untuk mode aktif. Throw bila server key untuk mode itu
// belum di-set (lebih baik gagal jelas daripada 401 misterius dari Midtrans).
export async function getPlatformMidtrans(): Promise<PlatformMidtrans> {
  const mode = await getMidtransMode()
  const serverKey = serverKeyForMode(mode)
  if (!serverKey) {
    throw new Error(
      `Midtrans mode '${mode}' aktif tapi server key-nya belum di-set. ` +
        `Set MIDTRANS_SERVER_KEY_${mode.toUpperCase()} di environment, atau ganti mode di /admin.`,
    )
  }
  return {
    mode,
    isProduction: mode === 'production',
    serverKey,
    snapApiUrl: SNAP_API[mode],
    statusApiUrl: STATUS_API[mode],
  }
}

// Status konfigurasi key per-mode untuk ditampilkan di UI admin (tanpa membuka
// key-nya). true = mode itu siap dipakai.
export function getMidtransKeyStatus(): Record<MidtransMode, boolean> {
  return {
    production: !!serverKeyForMode('production'),
    sandbox: !!serverKeyForMode('sandbox'),
  }
}

// Set mode aktif (dipanggil dari route admin). Validasi nilai di caller.
export async function setMidtransMode(mode: MidtransMode): Promise<void> {
  const { error } = await supabaseAdmin
    .from('platform_settings')
    .upsert(
      { key: 'midtrans_mode', value: mode, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
  if (error) throw new Error(`setMidtransMode: ${error.message}`)
}

// Semua server key terkonfigurasi (unik). Dipakai webhook untuk verifikasi
// tanda tangan terhadap KEDUA env — transaksi yang dibuat di sandbox tetap
// terverifikasi walau mode platform sudah di-flip ke production (atau sebaliknya),
// sehingga notifikasi in-flight tidak hilang saat owner menukar mode.
export function midtransServerKeys(): string[] {
  const keys = [serverKeyForMode('production'), serverKeyForMode('sandbox')].filter(
    (k): k is string => !!k,
  )
  return Array.from(new Set(keys))
}

// Verifikasi tanda tangan webhook Midtrans terhadap semua server key yang
// terkonfigurasi (lihat midtransServerKeys). Timing-safe.
export function verifyMidtransSignature(args: {
  orderId: string
  statusCode: string
  grossAmount: string
  signatureKey: string
}): boolean {
  const { orderId, statusCode, grossAmount, signatureKey } = args
  const sigBuf = Buffer.from(signatureKey ?? '')
  return midtransServerKeys().some((key) => {
    const expected = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${key}`)
      .digest('hex')
    const expBuf = Buffer.from(expected)
    return sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)
  })
}
