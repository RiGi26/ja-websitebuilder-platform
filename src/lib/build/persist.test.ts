import { describe, it, expect } from 'vitest'
import { replaceRows } from './persist'

// Regresi PR #144 (#10): replaceRows sempat "insert-dulu, hapus-lama". Karena
// page_sections punya unique(page_id, urutan), rebuild ke-2+ (saat baris lama
// urutan 0..N masih ada) menabrak constraint → "duplicate key uq_page_section_urutan".
// Test ini mengunci urutan delete→insert + rollback-on-failure.

type Row = Record<string, unknown>

// Fake Supabase client minimal: cukup mendukung rantai yang dipakai replaceRows
//   .from(t).select('*').eq('page_id', x)   → { data, error }
//   .from(t).delete().eq('page_id', x)      → { error }
//   .from(t).insert(rows)                    → { error }
// dan menegakkan unique(page_id, urutan) seperti constraint asli page_sections.
function makeFake(opts: { seed?: Row[]; uniqueOn?: [string, string]; failNextInsert?: boolean } = {}) {
  const state = {
    rows: (opts.seed ?? []).map((r) => ({ ...r })),
    uniqueOn: opts.uniqueOn,
    failNextInsert: !!opts.failNextInsert,
  }
  const client = {
    from() {
      let op: 'select' | 'delete' | null = null
      const builder: Record<string, unknown> = {
        select() {
          op = 'select'
          return builder
        },
        delete() {
          op = 'delete'
          return builder
        },
        eq(col: string, val: unknown) {
          if (op === 'select') {
            return { data: state.rows.filter((r) => r[col] === val).map((r) => ({ ...r })), error: null }
          }
          // delete
          state.rows = state.rows.filter((r) => r[col] !== val)
          return { error: null }
        },
        insert(rows: Row[]) {
          if (state.failNextInsert) {
            state.failNextInsert = false
            return { error: { message: 'forced insert failure' } }
          }
          if (state.uniqueOn) {
            const [a, b] = state.uniqueOn
            const seen = new Set(state.rows.map((r) => `${r[a]}|${r[b]}`))
            for (const nr of rows) {
              const k = `${nr[a]}|${nr[b]}`
              if (seen.has(k)) {
                return {
                  error: { message: 'duplicate key value violates unique constraint "uq_page_section_urutan"' },
                }
              }
              seen.add(k)
            }
          }
          state.rows.push(...rows.map((r) => ({ ...r })))
          return { error: null }
        },
      }
      return builder
    },
  }
  return { client, state }
}

const oldSections: Row[] = [0, 1, 2, 3, 4].map((u) => ({
  id: `old-${u}`,
  page_id: 'P',
  tenant_id: 'T',
  urutan: u,
  tipe_komponen: 'features',
  is_visible: true,
  isi_komponen: {},
}))

const newSections: Row[] = [0, 1, 2, 3, 4].map((u) => ({
  page_id: 'P',
  tenant_id: 'T',
  urutan: u,
  tipe_komponen: 'hero_banner',
  is_visible: true,
  isi_komponen: { v: u },
}))

describe('replaceRows — rebuild idempotent tanpa tabrak unique(page_id, urutan)', () => {
  it('rebuild page yang sudah punya sections (urutan 0..4) TIDAK error duplicate key', async () => {
    const { client, state } = makeFake({ seed: oldSections, uniqueOn: ['page_id', 'urutan'] })

    await expect(
      replaceRows(client as never, 'page_sections', 'P', newSections),
    ).resolves.toBeUndefined()

    // Lama terhapus, baru tersimpan — tepat 5, semua dari batch baru.
    expect(state.rows).toHaveLength(5)
    expect(state.rows.every((r) => (r.isi_komponen as { v?: number })?.v !== undefined)).toBe(true)
    expect((state.rows as Row[]).some((r) => String(r.id ?? '').startsWith('old-'))).toBe(false)
  })

  it('rows kosong → semua section lama dibersihkan', async () => {
    const { client, state } = makeFake({ seed: oldSections, uniqueOn: ['page_id', 'urutan'] })
    await replaceRows(client as never, 'page_sections', 'P', [])
    expect(state.rows).toHaveLength(0)
  })

  it('insert baru gagal → baris lama DIPULIHKAN (rollback) lalu error dilempar', async () => {
    const { client, state } = makeFake({
      seed: oldSections,
      uniqueOn: ['page_id', 'urutan'],
      failNextInsert: true,
    })

    await expect(
      replaceRows(client as never, 'page_sections', 'P', newSections),
    ).rejects.toThrow(/baris lama dipulihkan/)

    // Page tidak kosong: 5 baris lama kembali utuh.
    expect(state.rows).toHaveLength(5)
    expect((state.rows as Row[]).every((r) => String(r.id ?? '').startsWith('old-'))).toBe(true)
  })
})
