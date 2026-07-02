// ============================================================
// THEME SYSTEM — pembaca theme_copy untuk renderer bespoke.
// Renderer mengganti literal hardcode dengan t()/list()/items(); nilai datang
// dari content.themeCopy (editan klien via portal) dengan fallback WAJIB ke
// `default` manifest — default = byte-identik copy semula, jadi situs yang
// belum pernah mengedit render persis seperti sebelum migrasi (parity gate).
// Nilai SELALU dirender sebagai text node React — jangan pernah dimasukkan ke
// dangerouslySetInnerHTML.
// ============================================================
import type { ThemeSlotManifest, ThemeCopyValue } from './slot-schema'
import { copyFields } from './slot-schema'

export interface ThemeCopyReader {
  /** Nilai string slot; fallback default manifest; '' bila key tak terdaftar. */
  t: (key: string) => string
  /** Array string (marquee/badge); fallback default; [] bila tak terdaftar. */
  list: (key: string) => string[]
  /** Array objek (item ber-shape `item`); fallback default; [] bila tak terdaftar. */
  items: (key: string) => Record<string, string>[]
}

export function copyGetter(
  themeCopy: Record<string, unknown> | undefined,
  manifest: ThemeSlotManifest,
): ThemeCopyReader {
  const defaults = new Map<string, ThemeCopyValue>(
    copyFields(manifest).map((f) => [f.key, f.default]),
  )
  const stored = themeCopy ?? {}

  return {
    t(key) {
      const v = stored[key]
      if (typeof v === 'string' && v.trim()) return v.trim()
      const d = defaults.get(key)
      return typeof d === 'string' ? d : ''
    },
    list(key) {
      const v = stored[key]
      if (Array.isArray(v)) {
        const strs = v.filter((x): x is string => typeof x === 'string' && !!x.trim()).map((x) => x.trim())
        if (strs.length) return strs
      }
      const d = defaults.get(key)
      return Array.isArray(d) && d.every((x) => typeof x === 'string') ? (d as string[]) : []
    },
    items(key) {
      const v = stored[key]
      if (Array.isArray(v)) {
        const objs = v.filter(
          (x): x is Record<string, string> =>
            !!x && typeof x === 'object' && !Array.isArray(x) &&
            Object.values(x as Record<string, unknown>).every((s) => typeof s === 'string'),
        )
        if (objs.length) return objs
      }
      const d = defaults.get(key)
      return Array.isArray(d) && d.every((x) => typeof x === 'object')
        ? (d as Record<string, string>[])
        : []
    },
  }
}
