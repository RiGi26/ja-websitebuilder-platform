// ============================================================
// Engine template notifikasi WA per-tenant (free-text, anti-rusak).
// MURNI — tanpa DB/jaringan; aman diimpor server & diuji unit (vitest).
//
// Tenant boleh menulis template BEBAS memakai placeholder {token}. Engine
// menjamin pesan TAK PERNAH rusak walau input bebas:
//   • SAVE  → validateTemplate() menolak token tak dikenal / wajib hilang /
//             malformed / kosong / kepanjangan (gerbang utama).
//   • SEND  → renderTemplate() SELALU mengembalikan pesan koheren: token tak
//             dikenal dibuang, baris yang jadi kosong (placeholder opsional
//             kosong) di-drop, dan bila template bermasalah → fallback ke
//             default platform.
//
// Layer ini = tenant → pembeli-bisnisnya. Berbeda dari template platform di
// `fonnte.ts` (Japan Arena → customer pembuatan situs) yang TIDAK editable tenant.
// ============================================================

export type NotifEventKey = 'order_receipt' | 'order_admin'

/** Nilai placeholder untuk satu order — sudah jadi string siap-tempel. */
export interface NotifVars {
  nama: string
  bisnis: string
  kode: string
  items: string
  total: string
  bayar: string
  lacak: string
  alamat?: string | null
  catatan?: string | null
  tanggal?: string | null
}

type VarKey = keyof NotifVars

interface EventDef {
  label: string
  recipient: 'buyer' | 'admin'
  /** Placeholder yang BOLEH dipakai event ini (di luar ini = tak dikenal). */
  vars: VarKey[]
  /** Placeholder yang WAJIB hadir di template (gate save). */
  required: VarKey[]
  /** Template default platform — dipakai bila tenant tak set / template invalid. */
  default: string
}

const ALL_VARS: VarKey[] = ['nama', 'bisnis', 'kode', 'items', 'total', 'bayar', 'lacak', 'alamat', 'catatan', 'tanggal']

/** Katalog event WA sisi-WB yang editable tenant. "Berapa banyak" = daftar ini. */
export const NOTIF_EVENTS: Record<NotifEventKey, EventDef> = {
  order_receipt: {
    label: 'Struk ke pembeli (saat order dibuat)',
    recipient: 'buyer',
    vars: ALL_VARS,
    required: ['kode'],
    default: [
      'Halo {nama}! 🙏',
      '',
      'Terima kasih, pesanan Anda di *{bisnis}* sudah kami terima.',
      '',
      'Order: *{kode}*',
      '🧾 {items}',
      '💰 Total: *{total}*',
      '📦 {bayar}',
      '📍 {alamat}',
      '',
      'Kami akan konfirmasi ketersediaan & detail pembayaran via chat ini. 😊',
      'Lacak: {lacak}',
    ].join('\n'),
  },
  order_admin: {
    label: 'Notifikasi ke admin (order baru masuk)',
    recipient: 'admin',
    vars: ALL_VARS,
    required: [],
    default: [
      '🍜 *Pesanan baru!*',
      '',
      '{bisnis}',
      'Order: *{kode}*',
      '',
      '👤 {nama}',
      '🧾 {items}',
      '💰 Total: *{total}*',
      '📦 {bayar}',
      '📍 {alamat}',
      '📝 {catatan}',
      '',
      'Kelola pesanan di dashboard Anda.',
    ].join('\n'),
  },
}

const MAX_LEN = 1200
const TOKEN_RE = /\{(\w+)\}/g

export interface TemplateCheck {
  ok: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validasi template tenant SAAT SIMPAN — gerbang utama anti-rusak.
 * ok=false → tolak simpan (UI tampilkan errors). warnings = saran lembut, tak memblok.
 */
export function validateTemplate(event: NotifEventKey, raw: string): TemplateCheck {
  const def = NOTIF_EVENTS[event]
  const errors: string[] = []
  const warnings: string[] = []
  const text = (raw ?? '').trim()

  if (!text) {
    errors.push('Template tidak boleh kosong.')
    return { ok: false, errors, warnings }
  }
  if (text.length > MAX_LEN) {
    errors.push(`Template terlalu panjang (maks ${MAX_LEN} karakter, saat ini ${text.length}).`)
  }
  // Kurawal tak seimbang → "{total" atau "}" liar = malformed.
  const opens = (text.match(/\{/g) || []).length
  const closes = (text.match(/\}/g) || []).length
  if (opens !== closes) {
    errors.push('Ada kurung kurawal { } yang tidak seimbang — tulis placeholder utuh seperti {nama}, {total}.')
  }

  const used = new Set<string>()
  for (const m of text.matchAll(TOKEN_RE)) used.add(m[1])

  const allowed = new Set<string>(def.vars as string[])
  const unknown = [...used].filter((t) => !allowed.has(t))
  if (unknown.length) {
    errors.push(
      `Placeholder tak dikenal: ${unknown.map((u) => `{${u}}`).join(', ')}. ` +
      `Yang tersedia: ${def.vars.map((v) => `{${v}}`).join(', ')}.`,
    )
  }

  const missing = def.required.filter((r) => !used.has(r))
  if (missing.length) {
    errors.push(
      `Placeholder wajib hilang: ${missing.map((m) => `{${m}}`).join(', ')} — ` +
      'pembeli butuh ini untuk merujuk pesanannya.',
    )
  }

  if (event === 'order_receipt' && !used.has('total')) {
    warnings.push('Biasanya {total} disertakan agar pembeli langsung tahu jumlah yang harus dibayar.')
  }

  return { ok: errors.length === 0, errors, warnings }
}

/** Baris dianggap "berisi" bila punya minimal satu huruf/angka (apa pun skrip). */
function lineHasContent(line: string): boolean {
  return /[\p{L}\p{N}]/u.test(line)
}

/** Tempel nilai placeholder; token tak dikenal → '' (tak pernah bocor ke pembeli). */
function interpolate(source: string, def: EventDef, vars: NotifVars): string {
  const allowed = new Set<string>(def.vars as string[])
  return source.replace(TOKEN_RE, (_full, key: string) => {
    if (!allowed.has(key)) return ''
    const v = (vars as unknown as Record<string, unknown>)[key]
    return v == null ? '' : String(v)
  })
}

/**
 * Rapikan hasil interpolasi:
 *  • baris kosong MURNI dipertahankan (pemisah paragraf yang disengaja),
 *  • baris yang tinggal simbol/emoji tanpa huruf-angka (sisa placeholder opsional
 *    yang kosong, mis. "📍 ") DIBUANG,
 *  • baris kosong beruntun dikompres jadi maksimal satu, lalu trim.
 */
function cleanup(filled: string): string {
  const lines: string[] = []
  for (const ln of filled.split('\n')) {
    if (ln.trim() === '') { lines.push(''); continue }
    if (!lineHasContent(ln)) continue
    lines.push(ln.replace(/[ \t]+$/u, ''))
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

/**
 * Render template tenant SAAT KIRIM. SELALU kembalikan pesan koheren.
 * raw kosong / tidak lolos validasi → fallback ke template default platform.
 */
export function renderTemplate(event: NotifEventKey, raw: string | null | undefined, vars: NotifVars): string {
  const def = NOTIF_EVENTS[event]
  const text = (raw ?? '').trim()
  const useDefault = !text || !validateTemplate(event, text).ok
  const source = useDefault ? def.default : text

  let out = cleanup(interpolate(source, def, vars))
  // Jaring terakhir: bila entah bagaimana kosong, paksa default.
  if (!out) out = cleanup(interpolate(def.default, def, vars))
  return out
}
