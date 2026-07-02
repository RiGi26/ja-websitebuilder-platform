// ============================================================
// PORTAL — guard keamanan konten tulisan klien (shared).
// Dipakai route /api/portal/sections (isi_komponen) dan
// /api/portal/theme-copy (data_konten.theme_copy). Nilai-nilai ini dirender
// sebagai text node React (BUKAN dangerouslySetInnerHTML), tapi URL berbahaya
// (javascript:, data:text/html) tetap ditolak di pintu tulis — pertahanan
// berlapis, konsisten dengan audit XSS 2026-06-13.
// ============================================================

// Mengembalikan alasan penolakan, atau null bila aman. Rekursif ke array/objek.
export function findUnsafeContent(value: unknown, key = ''): string | null {
  if (key.toLowerCase() === 'html') return 'field "html" tidak diizinkan dari portal'
  if (typeof value === 'string') {
    if (/^\s*javascript:/i.test(value)) return 'URL javascript: tidak diizinkan'
    if (/^\s*data:text\/html/i.test(value)) return 'data URL HTML tidak diizinkan'
    return null
  }
  if (Array.isArray(value)) {
    for (const v of value) {
      const r = findUnsafeContent(v, key)
      if (r) return r
    }
    return null
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const r = findUnsafeContent(v, k)
      if (r) return r
    }
    return null
  }
  return null
}
