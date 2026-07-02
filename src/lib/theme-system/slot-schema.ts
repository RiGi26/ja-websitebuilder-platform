// ============================================================
// THEME SYSTEM — slot-schema: manifest field editable per tema bespoke.
// SATU sistem untuk: (A) zero-hardcoded-copy (copy tema pindah ke slot ber-
// default), (C) click-to-edit (data-edit key → form field), (E) compiler
// HTML-first (manifest di-emit dari anotasi data-slot mockup).
//
// Manifest hidup di KODE (themes/toko-bespoke/slots/<theme>.slots.ts),
// didaftarkan via BespokeEntry.slots — coupled ke versi renderer, ikut ship
// atomik. Nilai editan klien tersimpan di landing_pages.data_konten.theme_copy
// (JSONB merge, tanpa kolom baru); absen → renderer fallback ke `default`
// manifest, jadi situs existing render identik (retrofit-safety).
// ============================================================
import { findUnsafeContent } from '@/lib/portal/content-safety'

export type SlotType = 'text' | 'textarea' | 'image' | 'link' | 'array'

// Batas panjang default per tipe bila field tak menyetel `max` sendiri.
const DEFAULT_MAX: Record<Exclude<SlotType, 'array'>, number> = {
  text: 200,
  textarea: 2000,
  image: 2048,
  link: 2048,
}
const DEFAULT_MAX_ITEMS = 12

export interface SlotField {
  /** Dot-path unik per tema. Namespace menentukan pipe penyimpanan:
   *  - 'copy.*' → data_konten.theme_copy (pipe baru, route /api/portal/theme-copy)
   *  - path ComposableContent existing (hero.title, statement.quote, …) TIDAK
   *    dideklarasi ulang di sini — tetap di pipe lamanya; manifest boleh
   *    MENDAFTARNYA (source 'section'/'konten'/'catalog') supaya click-to-edit
   *    bisa memetakan klik → form pemiliknya. */
  key: string
  type: SlotType
  /** Label bahasa Indonesia untuk form portal. */
  label: string
  /** Grup accordion di portal: 'Pita & Badge' | 'Footer' | 'Navigasi' | … */
  group: string
  /** Maks karakter (text/textarea/image/link) atau maks item (array). */
  max?: number
  /** Copy bawaan tema — WAJIB persis sama dengan hardcode renderer semula. */
  default: string | string[] | Record<string, string>[]
  /** Bentuk satu item untuk type 'array' berisi objek. Absen = array string. */
  item?: SlotField[]
  hint?: string
  /** Pipe pemilik nilai. Absen = 'copy' (pipe baru). Selain 'copy' hanya
   *  dipakai untuk mapping click-to-edit, TIDAK divalidasi/ditulis route ini. */
  source?: 'copy' | 'section' | 'konten' | 'catalog'
}

export interface ThemeSlotManifest {
  /** Key tema di BESPOKE_RENDERERS. */
  theme: string
  fields: SlotField[]
}

/** Field yang nilainya tersimpan di theme_copy (pipe 'copy'). */
export function copyFields(manifest: ThemeSlotManifest): SlotField[] {
  return manifest.fields.filter((f) => (f.source ?? 'copy') === 'copy')
}

export type ThemeCopyValue = string | string[] | Record<string, string>[]

export interface ValidationOk { ok: true; values: Record<string, ThemeCopyValue>; removals: string[] }
export interface ValidationErr { ok: false; error: string }

// ── Validator input PATCH theme-copy ─────────────────────────
// input = { [key]: nilai } dari portal. Aturan:
// - key wajib terdaftar di manifest dengan pipe 'copy'
// - null / string kosong / array kosong = HAPUS key (kembali ke default tema)
// - tipe & panjang divalidasi per SlotField; URL image/link wajib https://
// - saringan XSS shared (javascript:, data:text/html, field "html")
export function validateThemeCopyInput(
  manifest: ThemeSlotManifest,
  input: unknown,
): ValidationOk | ValidationErr {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, error: 'payload tidak valid' }
  }
  const byKey = new Map(copyFields(manifest).map((f) => [f.key, f]))
  const values: Record<string, ThemeCopyValue> = {}
  const removals: string[] = []

  for (const [key, raw] of Object.entries(input as Record<string, unknown>)) {
    const field = byKey.get(key)
    if (!field) return { ok: false, error: `field "${key}" tidak dikenal untuk tema ini` }

    // Penghapusan → fallback default.
    if (raw === null || raw === '' || (Array.isArray(raw) && raw.length === 0)) {
      removals.push(key)
      continue
    }

    const unsafe = findUnsafeContent(raw)
    if (unsafe) return { ok: false, error: `"${field.label}": ${unsafe}` }

    if (field.type === 'array') {
      const parsed = parseArrayValue(field, raw)
      if (typeof parsed === 'string') return { ok: false, error: `"${field.label}": ${parsed}` }
      values[key] = parsed
    } else {
      const parsed = parseScalarValue(field, raw)
      if (parsed === null) {
        return { ok: false, error: `"${field.label}" tidak valid (maks ${field.max ?? DEFAULT_MAX[field.type]} karakter${field.type === 'image' || field.type === 'link' ? ', URL https://' : ''})` }
      }
      values[key] = parsed
    }
  }

  if (Object.keys(values).length === 0 && removals.length === 0) {
    return { ok: false, error: 'Tak ada perubahan' }
  }
  return { ok: true, values, removals }
}

// String ber-trim dengan batas panjang; image/link wajib https://.
function parseScalarValue(field: SlotField, raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const s = raw.trim()
  const max = field.max ?? DEFAULT_MAX[field.type as Exclude<SlotType, 'array'>]
  if (!s || s.length > max) return null
  if ((field.type === 'image' || field.type === 'link') && !s.startsWith('https://')) return null
  return s
}

// Array string (tanpa `item`) atau array objek (dengan `item`). Return pesan
// error (string) atau nilai valid.
function parseArrayValue(field: SlotField, raw: unknown): string | string[] | Record<string, string>[] {
  if (!Array.isArray(raw)) return 'harus berupa daftar'
  const maxItems = field.max ?? DEFAULT_MAX_ITEMS
  if (raw.length > maxItems) return `maksimal ${maxItems} item`

  if (!field.item) {
    const out: string[] = []
    for (const v of raw) {
      if (typeof v !== 'string') return 'tiap item harus teks'
      const s = v.trim()
      if (!s || s.length > DEFAULT_MAX.text) return `tiap item wajib terisi, maks ${DEFAULT_MAX.text} karakter`
      out.push(s)
    }
    return out
  }

  const out: Record<string, string>[] = []
  for (const v of raw) {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return 'bentuk item tidak valid'
    const r = v as Record<string, unknown>
    const item: Record<string, string> = {}
    for (const sub of field.item) {
      const parsed = parseScalarValue(sub, r[sub.key])
      if (parsed === null) return `item: "${sub.label}" tidak valid`
      item[sub.key] = parsed
    }
    out.push(item)
  }
  return out
}
