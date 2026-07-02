'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Check, AlertCircle, ChevronDown, ChevronRight, Plus, Trash2, RotateCcw } from 'lucide-react'
import type { ThemeSlotManifest, SlotField } from '@/lib/theme-system/slot-schema'

// Tab Konten — kartu "Konten Tema": copy khas-tema (pita, stempel, judul
// bagian, footer, SEO) dari slot manifest tema (BespokeEntry.slots). Form
// DIGENERATE dari manifest — tak ada field tulisan-tangan per tema; tema baru
// cukup ship manifest. Autosave 1 dtk (pola KontenBrandPanel) → PATCH
// /api/portal/theme-copy (hanya key yang berubah). Kosongkan field teks /
// "Kembalikan bawaan" = hapus editan → website pakai copy bawaan tema lagi.

type Value = string | string[] | Record<string, string>[]
type Draft = Record<string, Value>

// Nilai efektif field utk draft awal: editan tersimpan bila ada; array tanpa
// editan diprefill bawaan (langsung kelihatan apa yang diedit); teks tanpa
// editan = '' + placeholder bawaan (kosong = pakai bawaan, tak menulis apa pun).
function initialValue(f: SlotField, stored: unknown): Value {
  if (f.type === 'array') {
    if (Array.isArray(stored) && stored.length) return stored as Value
    return (Array.isArray(f.default) ? f.default : []) as Value
  }
  return typeof stored === 'string' ? stored : ''
}

export default function ThemeCopyPanel({ manifest, initial }: {
  manifest: ThemeSlotManifest
  initial: Record<string, unknown>
}) {
  const fields = manifest.fields.filter((f) => (f.source ?? 'copy') === 'copy')
  const groups = [...new Set(fields.map((f) => f.group))]
  const build = () => Object.fromEntries(fields.map((f) => [f.key, initialValue(f, initial[f.key])])) as Draft

  const [draft, setDraft] = useState<Draft>(build)
  const [saved, setSaved] = useState<Draft>(draft)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [err, setErr] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(groups[0] ?? null)
  const draftRef = useRef(draft)
  draftRef.current = draft
  const savedRef = useRef(saved)
  savedRef.current = saved

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved)

  // Kirim HANYA key yang berubah. String kosong = reset ke bawaan (route
  // menghapus key); array dikirim penuh (baris kosong dibuang dulu).
  const payloadOf = (d: Draft, base: Draft) => {
    const values: Record<string, unknown> = {}
    for (const f of fields) {
      const cur = d[f.key]
      if (JSON.stringify(cur) === JSON.stringify(base[f.key])) continue
      if (f.type === 'array') {
        const rows = (cur as (string | Record<string, string>)[]).filter((r) =>
          typeof r === 'string' ? r.trim() : Object.values(r).every((v) => v.trim()),
        )
        // Array kembali persis = bawaan → kirim null (hapus editan, bukan salin bawaan).
        values[f.key] = JSON.stringify(rows) === JSON.stringify(f.default) ? null : rows
      } else {
        values[f.key] = (cur as string).trim()
      }
    }
    return values
  }

  const save = async () => {
    const snapshot = structuredClone(draftRef.current)
    const values = payloadOf(snapshot, savedRef.current)
    if (Object.keys(values).length === 0) { setSaved(snapshot); return }
    setState('saving'); setErr(null)
    try {
      const res = await fetch('/api/portal/theme-copy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErr(json.error ?? 'Gagal menyimpan')
        setState('error')
        return
      }
      setSaved(snapshot)
      setState('saved')
      window.dispatchEvent(new Event('portal:saved')) // refresh live preview
    } catch {
      setErr('Error koneksi')
      setState('error')
    }
  }

  useEffect(() => {
    if (!isDirty) return
    const t = setTimeout(save, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  })

  const set = (key: string, v: Value) => setDraft((d) => ({ ...d, [key]: v }))

  const inp = 'w-full text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'
  const lbl = 'text-[10px] font-bold text-gray-400 uppercase tracking-widest'

  const renderField = (f: SlotField) => {
    const v = draft[f.key]
    if (f.type === 'array' && !f.item) {
      const rows = v as string[]
      const isDefault = JSON.stringify(rows) === JSON.stringify(f.default)
      return (
        <div key={f.key} data-slot-key={f.key}>
          <div className="flex items-center justify-between">
            <span className={lbl}>{f.label}</span>
            {!isDefault && (
              <button
                onClick={() => set(f.key, [...(f.default as string[])])}
                className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-apple-blue uppercase tracking-widest"
              >
                <RotateCcw size={11} /> Bawaan
              </button>
            )}
          </div>
          <div className="mt-1.5 space-y-1.5">
            {rows.map((row, i) => (
              <div key={i} className="flex gap-1.5">
                <input
                  className={inp}
                  value={row}
                  maxLength={200}
                  onChange={(e) => set(f.key, rows.map((r, j) => (j === i ? e.target.value : r)))}
                />
                <button
                  onClick={() => set(f.key, rows.filter((_, j) => j !== i))}
                  className="shrink-0 p-2 text-gray-300 hover:text-red-500 transition-colors"
                  aria-label={`Hapus item ${i + 1}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {rows.length < (f.max ?? 12) && (
              <button
                onClick={() => set(f.key, [...rows, ''])}
                className="flex items-center gap-1.5 text-xs font-bold text-apple-blue hover:opacity-70"
              >
                <Plus size={13} /> Tambah
              </button>
            )}
          </div>
          {f.hint && <p className="text-[11px] text-gray-400 mt-1.5">{f.hint}</p>}
        </div>
      )
    }
    // Array objek (item) belum dipakai manifest mana pun — tambah UI-nya saat
    // tema pertama membutuhkannya (Wave 5); jangan jatuh ke input string.
    if (f.type === 'array') return null
    // text / textarea / image / link — input tunggal, kosong = pakai bawaan.
    const s = v as string
    const placeholder = typeof f.default === 'string' && f.default ? `Bawaan: ${f.default}` : 'Kosong = pakai bawaan tema'
    return (
      <div key={f.key} data-slot-key={f.key}>
        <span className={lbl}>{f.label}</span>
        {f.type === 'textarea' ? (
          <textarea className={`${inp} mt-1.5 min-h-[72px]`} value={s} maxLength={f.max ?? 2000} placeholder={placeholder} onChange={(e) => set(f.key, e.target.value)} />
        ) : (
          <input className={`${inp} mt-1.5`} value={s} maxLength={f.max ?? 200} placeholder={placeholder} onChange={(e) => set(f.key, e.target.value)} />
        )}
        {f.hint && <p className="text-[11px] text-gray-400 mt-1.5">{f.hint}</p>}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-900">Konten Tema</h2>
        <span className="text-[11px] font-bold uppercase tracking-widest" aria-live="polite">
          {state === 'saving' ? (
            <span className="flex items-center gap-1.5 text-gray-400"><Loader2 size={12} className="animate-spin" /> Menyimpan…</span>
          ) : state === 'saved' ? (
            <span className="flex items-center gap-1.5 text-emerald-600"><Check size={12} /> Tersimpan</span>
          ) : state === 'error' ? (
            <span className="flex items-center gap-1.5 text-red-500"><AlertCircle size={12} /> Gagal</span>
          ) : null}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Kata-kata khas tema (pita, stempel, judul bagian, footer). Kosongkan field untuk kembali ke bawaan tema.
      </p>
      {err && <p className="text-xs text-red-500 mb-3">{err}</p>}

      <div className="space-y-2">
        {groups.map((g) => (
          <div key={g} className="border border-black/[0.06] rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === g ? null : g)}
              className="w-full flex items-center gap-2 p-3 sm:p-4 bg-gray-50 text-left hover:opacity-80 transition-opacity"
            >
              {open === g ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
              <span className="text-sm font-bold text-gray-900">{g}</span>
              <span className="text-xs text-gray-400 font-medium ml-auto shrink-0">
                {fields.filter((f) => f.group === g).length} field
              </span>
            </button>
            {open === g && (
              <div className="p-4 sm:p-5 space-y-4">
                {fields.filter((f) => f.group === g).map(renderField)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
