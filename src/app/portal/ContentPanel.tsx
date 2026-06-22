'use client'

import { useState, useEffect } from 'react'
import { Loader2, Check, ChevronDown, ChevronRight, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'
import ImageUploadField from './ImageUploadField'

export type EditableSection = {
  id: string
  tipe_komponen: string
  urutan: number
  is_visible: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isi_komponen: Record<string, any>
}

// Label section yang ramah klien.
const SECTION_LABEL: Record<string, string> = {
  hero_banner: 'Hero / Banner Utama',
  about: 'Tentang',
  features: 'Keunggulan',
  pricing_table: 'Daftar Harga',
  gallery: 'Galeri',
  testimonials: 'Testimoni',
  team: 'Tim',
  cta: 'Ajakan (CTA)',
  contact_form: 'Kontak',
  faq: 'FAQ',
  stats: 'Statistik',
  blog_list: 'Daftar Blog',
  product_list: 'Daftar Produk',
  service_list: 'Daftar Layanan',
  video_embed: 'Video',
  map_embed: 'Peta',
  social_feed: 'Sosial Media',
  custom_html: 'HTML Kustom',
}

// Label field yang ramah klien.
const FIELD_LABEL: Record<string, string> = {
  title: 'Judul',
  subtitle: 'Subjudul',
  eyebrow: 'Label Kecil',
  deskripsi: 'Deskripsi',
  description: 'Deskripsi',
  desc: 'Deskripsi',
  teks: 'Teks',
  text: 'Teks',
  cta_text: 'Teks Tombol',
  cta_link: 'Link Tombol',
  image_url: 'Gambar (URL)',
  gambar_url: 'Gambar (URL)',
  wa: 'WhatsApp',
  email: 'Email',
  nama: 'Nama',
  jabatan: 'Jabatan',
  role: 'Jabatan',
  pertanyaan: 'Pertanyaan',
  jawaban: 'Jawaban',
  label: 'Label',
  value: 'Nilai',
}

function fieldLabel(key: string): string {
  return FIELD_LABEL[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function isImageKey(key: string): boolean {
  return /(image|gambar|foto|logo|avatar|thumbnail|cover)/i.test(key) && !/alt|caption/i.test(key)
}
function isLinkKey(key: string): boolean {
  return /(link|url|href)/i.test(key) && !isImageKey(key)
}
function isLongText(key: string, val: string): boolean {
  return /(deskripsi|description|teks|text|subtitle|jawaban|bio|about|isi|content|quote)/i.test(key) || val.length > 70
}

type DraftMap = Record<string, Record<string, unknown>>
type SaveState = 'saving' | 'saved' | 'error'

export default function ContentPanel({ initial }: { initial: EditableSection[] }) {
  const [sections, setSections] = useState<EditableSection[]>(() => [...initial].sort((a, b) => a.urutan - b.urutan))
  const [drafts, setDrafts] = useState<DraftMap>(() =>
    Object.fromEntries(initial.map((s) => [s.id, structuredClone(s.isi_komponen ?? {})])),
  )
  const [saved, setSaved] = useState<DraftMap>(() =>
    Object.fromEntries(initial.map((s) => [s.id, structuredClone(s.isi_komponen ?? {})])),
  )
  const [state, setState] = useState<Record<string, SaveState | undefined>>({})
  const [metaBusy, setMetaBusy] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(sections[0]?.id ?? null)

  const setField = (sectionId: string, key: string, value: string) => {
    setDrafts((d) => ({ ...d, [sectionId]: { ...d[sectionId], [key]: value } }))
  }
  const setItemField = (sectionId: string, arrKey: string, idx: number, key: string, value: string) => {
    setDrafts((d) => {
      const arr = [...((d[sectionId][arrKey] as Record<string, unknown>[]) ?? [])]
      arr[idx] = { ...arr[idx], [key]: value }
      return { ...d, [sectionId]: { ...d[sectionId], [arrKey]: arr } }
    })
  }

  const isDirty = (sectionId: string): boolean =>
    JSON.stringify(drafts[sectionId]) !== JSON.stringify(saved[sectionId])

  const save = async (sectionId: string) => {
    setState((s) => ({ ...s, [sectionId]: 'saving' }))
    try {
      const res = await fetch('/api/portal/sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, isi_komponen: drafts[sectionId] }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setState((s) => ({ ...s, [sectionId]: 'error' }))
        return
      }
      setSaved((s) => ({ ...s, [sectionId]: structuredClone(drafts[sectionId]) }))
      setState((s) => ({ ...s, [sectionId]: 'saved' }))
      window.dispatchEvent(new Event('portal:saved')) // refresh live preview

    } catch {
      setState((s) => ({ ...s, [sectionId]: 'error' }))
    }
  }

  // Autosave: 1 dtk setelah perubahan terakhir → simpan section yang berubah.
  useEffect(() => {
    const dirtyIds = sections.filter((s) => isDirty(s.id)).map((s) => s.id)
    if (dirtyIds.length === 0) return
    const t = setTimeout(() => { dirtyIds.forEach((id) => save(id)) }, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drafts])

  // Sabuk pengaman: peringatkan kalau menutup/pindah dgn perubahan belum tersimpan.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (sections.some((s) => isDirty(s.id))) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  })

  // PATCH metadata section (is_visible / urutan) — terpisah dari isi_komponen.
  const patchMeta = async (sectionId: string, body: Record<string, unknown>) => {
    await fetch('/api/portal/sections', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionId, ...body }),
    })
  }

  const toggleVisible = async (s: EditableSection) => {
    const next = !s.is_visible
    setSections((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_visible: next } : x)))
    setMetaBusy(s.id)
    try { await patchMeta(s.id, { is_visible: next }) } finally { setMetaBusy(null) }
  }

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir
    if (j < 0 || j >= sections.length) return
    const a = sections[idx], b = sections[j]
    setSections((prev) =>
      prev.map((x) => (x.id === a.id ? { ...x, urutan: b.urutan } : x.id === b.id ? { ...x, urutan: a.urutan } : x))
        .sort((x, y) => x.urutan - y.urutan),
    )
    setMetaBusy(a.id)
    try { await Promise.all([patchMeta(a.id, { urutan: b.urutan }), patchMeta(b.id, { urutan: a.urutan })]) }
    finally { setMetaBusy(null) }
  }

  const inp = 'w-full text-sm rounded-lg border border-black/10 p-2.5 focus:border-apple-blue focus:outline-none'

  // Status simpan per section (untuk badge header).
  const statusOf = (id: string): { text: string; cls: string } | null => {
    if (isDirty(id)) {
      return state[id] === 'saving'
        ? { text: 'Menyimpan…', cls: 'text-gray-400' }
        : { text: 'Belum disimpan', cls: 'text-amber-600' }
    }
    if (state[id] === 'saved') return { text: 'Tersimpan', cls: 'text-green-600' }
    if (state[id] === 'error') return { text: 'Gagal — coba lagi', cls: 'text-red-500' }
    return null
  }

  // Render satu field string (input / textarea / gambar).
  const renderStringField = (sectionId: string, key: string, value: string, onChange: (v: string) => void) => {
    if (isImageKey(key)) {
      return <ImageUploadField key={key} label={fieldLabel(key)} value={value} onChange={onChange} />
    }
    return (
      <div key={key}>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{fieldLabel(key)}</label>
        {isLongText(key, value) && !isLinkKey(key) ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${inp} mt-1`} />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} className={`${inp} mt-1`} />
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">Konten Halaman</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ubah teks & gambar tiap bagian. Tersimpan otomatis — perubahan langsung tampil di website. Atur urutan & sembunyikan bagian lewat tombol di kanan.
        </p>
      </div>

      {sections.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada konten halaman. Tim sedang menyiapkan website Anda.</p>
      ) : (
        <div className="space-y-3">
          {sections.map((s, idx) => {
            const draft = drafts[s.id] ?? {}
            const isOpen = open === s.id
            const st = statusOf(s.id)
            const stringKeys = Object.keys(draft).filter((k) => typeof draft[k] === 'string')
            const arrayKeys = Object.keys(draft).filter(
              (k) => Array.isArray(draft[k]) && (draft[k] as unknown[]).every((it) => it && typeof it === 'object' && !Array.isArray(it)),
            )
            const editableCount = stringKeys.length + arrayKeys.length

            return (
              <div key={s.id} className={`rounded-2xl border overflow-hidden ${s.is_visible ? 'border-black/5' : 'border-dashed border-black/15 bg-gray-50/40'}`}>
                <div className="flex items-center gap-2 p-3 sm:p-4 bg-gray-50">
                  <button
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    className="flex items-center gap-2 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
                  >
                    {isOpen ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
                    <span className={`text-sm font-bold truncate ${s.is_visible ? 'text-gray-900' : 'text-gray-400'}`}>{SECTION_LABEL[s.tipe_komponen] ?? s.tipe_komponen}</span>
                    {!s.is_visible && <span className="text-[10px] text-gray-400 uppercase shrink-0">(disembunyikan)</span>}
                  </button>

                  {st && <span className={`hidden sm:inline text-[10px] font-bold uppercase tracking-widest shrink-0 ${st.cls}`}>{st.text}</span>}

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={() => move(idx, -1)} disabled={idx === 0 || metaBusy === s.id} title="Naik" className="p-1.5 rounded-lg hover:bg-white text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent"><ArrowUp size={15} /></button>
                    <button onClick={() => move(idx, 1)} disabled={idx === sections.length - 1 || metaBusy === s.id} title="Turun" className="p-1.5 rounded-lg hover:bg-white text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent"><ArrowDown size={15} /></button>
                    <button onClick={() => toggleVisible(s)} disabled={metaBusy === s.id} title={s.is_visible ? 'Sembunyikan dari website' : 'Tampilkan di website'} className="p-1.5 rounded-lg hover:bg-white text-gray-500 disabled:opacity-40">
                      {s.is_visible ? <Eye size={15} /> : <EyeOff size={15} className="text-gray-400" />}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="p-4 space-y-4">
                    {editableCount === 0 ? (
                      <p className="text-sm text-gray-400 italic">
                        Bagian ini diisi otomatis dari data lain (mis. produk/layanan/menu). Edit di tab terkait.
                      </p>
                    ) : (
                      <>
                        {stringKeys.map((key) =>
                          renderStringField(s.id, key, draft[key] as string, (v) => setField(s.id, key, v)),
                        )}

                        {arrayKeys.map((arrKey) => (
                          <div key={arrKey} className="space-y-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{fieldLabel(arrKey)}</p>
                            {(draft[arrKey] as Record<string, unknown>[]).map((item, i) => (
                              <div key={i} className="rounded-xl border border-black/5 bg-gray-50/60 p-3 space-y-2">
                                {Object.keys(item)
                                  .filter((k) => typeof item[k] === 'string')
                                  .map((k) =>
                                    renderStringField(s.id, k, item[k] as string, (v) => setItemField(s.id, arrKey, i, k, v)),
                                  )}
                              </div>
                            ))}
                          </div>
                        ))}

                        <div className="flex items-center justify-end gap-3 pt-1">
                          {st && <span className={`text-[10px] font-bold uppercase tracking-widest ${st.cls}`}>{st.text}</span>}
                          <button
                            onClick={() => save(s.id)}
                            disabled={state[s.id] === 'saving' || !isDirty(s.id)}
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-apple-blue text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50"
                          >
                            {state[s.id] === 'saving' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Simpan
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
