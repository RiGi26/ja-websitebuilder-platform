// ============================================================
// THEME SYSTEM — token pack otentik per gaya (gabungan per-industri).
// Dipecah dari theme-packs.ts tunggal (>900 baris) jadi 1 file per industri
// agar terkelola (FU#2, 2026-06-07). Manifest mereferensikan id di sini lebih
// dulu (resolveManifestPack), fallback ke PACKS generik.
//
// Tambah industri baru = buat theme-packs/<industri>.ts + daftarkan di sini.
// ============================================================
import type { TokenPack } from '@/lib/design-tokens/packs'
import { TOKO_PACKS } from './toko'
import { RESTAURANT_PACKS } from './restaurant'
import { KLINIK_PACKS } from './klinik'
import { SEKOLAH_PACKS } from './sekolah'
import { PERSONAL_PACKS } from './personal'
import { COMPANY_PACKS } from './company'

export const THEME_PACKS: Record<string, TokenPack> = {
  ...TOKO_PACKS,
  ...RESTAURANT_PACKS,
  ...KLINIK_PACKS,
  ...SEKOLAH_PACKS,
  ...PERSONAL_PACKS,
  ...COMPANY_PACKS,
}
