// ============================================================
// Susun paragraf deskripsi bisnis secara DETERMINISTIK dari jawaban
// "pertanyaan terpandu" di form briefing (tawaran / pelanggan / pembeda).
// Tujuannya: fallback copy generik (copyVariants.ts) hanya terpakai bila klien
// benar-benar tak memberi apa pun. Ini memakai KATA-KATA KLIEN → copy spesifik,
// tanpa AI, tanpa fabrikasi. Disimpan terpisah agar mudah dites & dipakai ulang.
// ============================================================

export interface Narasi {
  tawaran?: string
  pelanggan?: string
  pembeda?: string[]
}

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
const lower = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s)

// Gabung daftar pembeda dgn pemisah Indonesia: "a" · "a dan b" · "a, b, dan c".
export function joinPembeda(items: string[]): string {
  const xs = items.map((s) => s.trim()).filter(Boolean)
  if (xs.length === 0) return ''
  if (xs.length === 1) return xs[0]
  if (xs.length === 2) return `${xs[0]} dan ${xs[1]}`
  return `${xs.slice(0, -1).join(', ')}, dan ${xs[xs.length - 1]}`
}

// Pola luwes: tanpa "tawaran" → string kosong (sengaja jatuh ke fallback
// copyVariants). "pelanggan" jadi klausa "untuk …" hanya bila terisi; "pembeda"
// jadi kalimat kedua. Huruf depan kalimat dikapitalisasi, sisipan klausa
// di-lowercase agar tidak ada kapital nyasar di tengah kalimat.
export function composeDeskripsi(n: Narasi): string {
  const tawaran = (n.tawaran ?? '').trim()
  const pelanggan = (n.pelanggan ?? '').trim()
  const pembeda = joinPembeda(n.pembeda ?? [])

  if (!tawaran) return ''

  const kalimat1 = pelanggan ? `${cap(tawaran)} untuk ${lower(pelanggan)}.` : `${cap(tawaran)}.`
  const kalimat2 = pembeda ? ` ${cap(pembeda)}.` : ''
  return `${kalimat1}${kalimat2}`
}
