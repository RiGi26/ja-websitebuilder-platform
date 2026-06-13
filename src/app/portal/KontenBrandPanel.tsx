'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Check, AlertCircle, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import type { KontenBrandFlags } from '@/lib/addons/portal-tabs'

// Tab Konten — kartu kedua: konten brand di data_konten (stats/faq/statement)
// yang dirender tema bespoke/lux tapi sebelumnya tak punya permukaan edit
// (angka draft dari templates.ts nempel permanen). Autosave 1 dtk (pola sama
// TampilanPanel) → PATCH /api/portal/landing-page (whitelist diperluas).
// Baris yang belum lengkap TIDAK ikut dikirim (autosave jalan saat mengetik);
// kosongkan seluruh grup = bagian hilang dari website (self-hide).

export type StatRow = { angka: string; label: string }
export type FaqRow = { q: string; a: string }
export type StatementDraft = { eyebrow: string; quote: string; cite: string }

export interface KontenBrandData {
  flags: KontenBrandFlags
  stats: StatRow[]
  faq: FaqRow[]
  statement: StatementDraft
}

const MAX_STATS = 4
const MAX_FAQ = 10

type Group = 'stats' | 'faq' | 'statement'
type Draft = { stats: StatRow[]; faq: FaqRow[]; statement: StatementDraft }

export default function KontenBrandPanel({ initial }: { initial: KontenBrandData }) {
  const { flags } = initial
  const [draft, setDraft] = useState<Draft>({
    stats: initial.stats,
    faq: initial.faq,
    statement: initial.statement,
  })
  const [saved, setSaved] = useState<Draft>(draft)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [err, setErr] = useState<string | null>(null)
  const firstGroup: Group | null = flags.stats ? 'stats' : flags.faq ? 'faq' : flags.statement ? 'statement' : null
  const [open, setOpen] = useState<Group | null>(firstGroup)
  const draftRef = useRef(draft)
  draftRef.current = draft

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved)

  // Hanya baris lengkap yang dikirim — baris setengah jadi tetap di draft lokal.
  const payloadOf = (d: Draft) => {
    const body: Record<string, unknown> = {}
    if (flags.stats) body.stats = d.stats.filter((r) => r.angka.trim() && r.label.trim())
    if (flags.faq) body.faq = d.faq.filter((r) => r.q.trim() && r.a.trim())
    if (flags.statement) {
      body.statement = d.statement.quote.trim()
        ? { eyebrow: d.statement.eyebrow.trim(), quote: d.statement.quote.trim(), cite: d.statement.cite.trim() }
        : null
    }
    return body
  }

  const save = async () => {
    const snapshot = structuredClone(draftRef.current)
    setState('saving'); setErr(null)
    try {
      const res = await fetch('/api/portal/landing-page', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadOf(snapshot)),
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

  const inp = 'w-full text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'
  const lbl = 'text-[10px] font-bold text-gray-400 uppercase tracking-widest'

  const groupHeader = (key: Group, title: string, hint: string) => (
    <button
      onClick={() => setOpen(open === key ? null : key)}
      className="w-full flex items-center gap-2 p-3 sm:p-4 bg-gray-50 text-left hover:opacity-80 transition-opacity"
    >
      {open === key ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
      <span className="text-sm font-bold text-gray-900">{title}</span>
      <span className="text-xs text-gray-400 font-medium ml-auto shrink-0">{hint}</span>
    </button>
  )

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-900">Angka, FAQ &amp; Filosofi</h2>
        <span className="text-[11px] font-bold uppercase tracking-widest" aria-live="polite">
          {state === 'saving' ? (
            <span className="flex items-center gap-1.5 text-gray-400"><Loader2 size={12} className="animate-spin" /> Menyimpan…</span>
          ) : state === 'saved' ? (
            <span className="flex items-center gap-1.5 text-green-600"><Check size={12} /> Tersimpan</span>
          ) : state === 'error' ? (
            <span className="flex items-center gap-1.5 text-red-500"><AlertCircle size={12} /> Gagal</span>
          ) : null}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Angka pencapaian, tanya jawab, dan filosofi brand yang tampil di website Anda — pastikan isinya data bisnis Anda yang sebenarnya. Tersimpan otomatis. Kosongkan isinya untuk menyembunyikan bagian itu dari website.
      </p>

      <div className="space-y-3">
        {flags.stats && (
          <div className="rounded-2xl border border-black/5 overflow-hidden">
            {groupHeader('stats', 'Angka Pencapaian', `${draft.stats.length}/${MAX_STATS}`)}
            {open === 'stats' && (
              <div className="p-4 space-y-3">
                <p className="text-xs text-gray-500">Angka yang membangun kepercayaan — misalnya &quot;500+&quot; pelanggan, &quot;12 tahun&quot; pengalaman.</p>
                {draft.stats.map((row, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                      <input
                        value={row.angka}
                        onChange={(e) => setDraft((d) => ({ ...d, stats: d.stats.map((r, j) => (j === i ? { ...r, angka: e.target.value } : r)) }))}
                        placeholder="500+"
                        className={inp}
                        aria-label={`Angka statistik ${i + 1}`}
                      />
                      <input
                        value={row.label}
                        onChange={(e) => setDraft((d) => ({ ...d, stats: d.stats.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)) }))}
                        placeholder="Pelanggan puas"
                        className={`${inp} sm:col-span-2`}
                        aria-label={`Keterangan statistik ${i + 1}`}
                      />
                    </div>
                    <button
                      onClick={() => setDraft((d) => ({ ...d, stats: d.stats.filter((_, j) => j !== i) }))}
                      className="p-2.5 rounded-lg hover:bg-red-50 text-red-500 shrink-0"
                      aria-label={`Hapus statistik ${i + 1}`}
                    ><Trash2 size={14} /></button>
                  </div>
                ))}
                {draft.stats.length < MAX_STATS && (
                  <button
                    onClick={() => setDraft((d) => ({ ...d, stats: [...d.stats, { angka: '', label: '' }] }))}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-black/10 text-gray-500 text-[11px] font-bold uppercase hover:text-apple-blue hover:border-apple-blue/30"
                  ><Plus size={14} /> Tambah Angka</button>
                )}
              </div>
            )}
          </div>
        )}

        {flags.faq && (
          <div className="rounded-2xl border border-black/5 overflow-hidden">
            {groupHeader('faq', 'Tanya Jawab (FAQ)', `${draft.faq.length}/${MAX_FAQ}`)}
            {open === 'faq' && (
              <div className="p-4 space-y-3">
                <p className="text-xs text-gray-500">Jawab pertanyaan yang paling sering ditanyakan pelanggan sebelum membeli.</p>
                {draft.faq.map((row, i) => (
                  <div key={i} className="rounded-xl border border-black/5 bg-gray-50/60 p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <div>
                          <label className={lbl}>Pertanyaan</label>
                          <input
                            value={row.q}
                            onChange={(e) => setDraft((d) => ({ ...d, faq: d.faq.map((r, j) => (j === i ? { ...r, q: e.target.value } : r)) }))}
                            className={`${inp} mt-1`}
                          />
                        </div>
                        <div>
                          <label className={lbl}>Jawaban</label>
                          <textarea
                            value={row.a}
                            onChange={(e) => setDraft((d) => ({ ...d, faq: d.faq.map((r, j) => (j === i ? { ...r, a: e.target.value } : r)) }))}
                            rows={2}
                            className={`${inp} mt-1`}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setDraft((d) => ({ ...d, faq: d.faq.filter((_, j) => j !== i) }))}
                        className="p-2.5 rounded-lg hover:bg-red-50 text-red-500 shrink-0"
                        aria-label={`Hapus pertanyaan ${i + 1}`}
                      ><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                {draft.faq.length < MAX_FAQ && (
                  <button
                    onClick={() => setDraft((d) => ({ ...d, faq: [...d.faq, { q: '', a: '' }] }))}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-black/10 text-gray-500 text-[11px] font-bold uppercase hover:text-apple-blue hover:border-apple-blue/30"
                  ><Plus size={14} /> Tambah Pertanyaan</button>
                )}
              </div>
            )}
          </div>
        )}

        {flags.statement && (
          <div className="rounded-2xl border border-black/5 overflow-hidden">
            {groupHeader('statement', 'Filosofi / Kutipan Brand', draft.statement.quote.trim() ? 'Terisi' : 'Kosong')}
            {open === 'statement' && (
              <div className="p-4 space-y-3">
                <p className="text-xs text-gray-500">Satu kalimat yang merangkum nilai bisnis Anda — tampil besar sebagai kutipan di website.</p>
                <div>
                  <label className={lbl}>Label Kecil (opsional)</label>
                  <input
                    value={draft.statement.eyebrow}
                    onChange={(e) => setDraft((d) => ({ ...d, statement: { ...d.statement, eyebrow: e.target.value } }))}
                    placeholder="Filosofi Kami"
                    className={`${inp} mt-1`}
                  />
                </div>
                <div>
                  <label className={lbl}>Kutipan</label>
                  <textarea
                    value={draft.statement.quote}
                    onChange={(e) => setDraft((d) => ({ ...d, statement: { ...d.statement, quote: e.target.value } }))}
                    rows={3}
                    placeholder="Setiap produk kami dibuat dengan tangan, satu per satu."
                    className={`${inp} mt-1`}
                  />
                </div>
                <div>
                  <label className={lbl}>Nama / Sumber (opsional)</label>
                  <input
                    value={draft.statement.cite}
                    onChange={(e) => setDraft((d) => ({ ...d, statement: { ...d.statement, cite: e.target.value } }))}
                    placeholder="Pendiri, Nama Bisnis"
                    className={`${inp} mt-1`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {err && <p className="text-xs text-red-500 font-medium mt-3">{err}</p>}
    </div>
  )
}
