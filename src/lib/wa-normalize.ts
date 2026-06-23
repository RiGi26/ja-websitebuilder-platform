// Normalisasi nomor WhatsApp — MURNI (tanpa DB/jaringan/env), aman diimpor di
// server MAUPUN client. Dipisah dari `fonnte.ts` (yang berisi gateway + token)
// agar komponen klien bisa menampilkan "nomor yang akan dikirim" tanpa ikut
// membundel logika pengiriman. `fonnte.ts` me-re-export fungsi ini.
//
// Output → format <cc>XXXXXXXX (digit saja, tanpa +/spasi/0 depan).
// FLEKSIBEL untuk pasar Japan Arena (Indonesia 62 + Jepang 81): membaca beragam
// format dan tetap benar walau negara nomor BERBEDA dari `defaultCc` tenant
// (mis. admin Indonesia di tenant Jepang `cc=81`). Aturan, berurutan:
//   1. Internasional eksplisit ("+" atau "00") → percaya digit apa adanya.
//   2. Sudah dalam kode negara tenant sendiri (tanpa "0" depan) → jangan double-prefix.
//   3. Lokal "0…": tebak negara dari pola mobile (JP 70/80/90 vs ID 8[1-9]),
//      selain itu pakai `defaultCc` (landline & pola lain).
//   4. Digit telanjang → beri prefix `defaultCc`.
// Untuk nomor lintas-negara yang ambigu, kirim format internasional ("+62…"/"+81…").
// Parity PENUH dengan versi lama untuk semua input tenant Indonesia (defaultCc='62').
export function normalizeWa(phone: string, defaultCc = '62'): string {
  const raw = String(phone ?? '')
  const explicitIntl = /^\s*(?:\+|00)/.test(raw)
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)

  // 1 — internasional eksplisit (+/00)
  if (explicitIntl) return d

  // 2 — sudah dalam kode negara tenant sendiri → jangan tambah prefix lagi
  if (!d.startsWith('0') && defaultCc && d.startsWith(defaultCc)) {
    return d
  }

  // 3 — lokal "0…": deteksi ID vs JP dari pola mobile, selain itu defaultCc
  if (d.startsWith('0')) {
    const local = d.slice(1)
    if (/^[789]0\d{7,}$/.test(local)) return '81' + local   // JP mobile 070/080/090
    if (/^8[1-9]\d{6,}$/.test(local)) return '62' + local    // ID mobile 08[1-9]
    return defaultCc + local                                  // landline & pola lain
  }

  // 4 — digit telanjang → prefix cc tenant
  return defaultCc + d
}
