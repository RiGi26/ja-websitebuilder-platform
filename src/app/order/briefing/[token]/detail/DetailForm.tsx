'use client'

import { useState } from 'react'
import { industriToTipe } from '@/lib/websitebuilder-mapping'
import { Check, Loader2, Plus, Trash2 } from 'lucide-react'

interface TestimoniRow { nama: string; kota: string; teks: string; bintang: string }
interface TeamRow { nama: string; peran: string; foto: string; bio: string }
interface PricingRow { nama: string; harga: string; periode: string; desc: string; fitur: string; unggulan: boolean }
interface ProcessRow { judul: string; desc: string }
interface PartnerRow { nama: string; logo: string; href: string }
interface SocialRow { platform: string; href: string; label: string }

// Section konten Sprint A/B/C yang relevan ditentukan manifest tema (dari page.tsx).
export interface ActiveBlocks {
  team: boolean; pricing: boolean; process: boolean; partners: boolean; social: boolean
}

interface DetailState {
  foto_hero: string
  foto_items: { label: string; url: string }[]
  testimoni: TestimoniRow[]
  team: TeamRow[]
  pricing: PricingRow[]
  process: ProcessRow[]
  partners: PartnerRow[]
  social: SocialRow[]
  kebijakan: string
  catatan_tambahan: string
}

const BLANK_TEAM: TeamRow = { nama: '', peran: '', foto: '', bio: '' }
const BLANK_PRICING: PricingRow = { nama: '', harga: '', periode: '', desc: '', fitur: '', unggulan: false }
const BLANK_PROCESS: ProcessRow = { judul: '', desc: '' }
const BLANK_PARTNER: PartnerRow = { nama: '', logo: '', href: '' }
const BLANK_SOCIAL: SocialRow = { platform: 'instagram', href: '', label: '' }

const SOCIAL_OPTIONS = ['instagram', 'tiktok', 'youtube', 'facebook', 'whatsapp', 'x', 'shopee', 'tokopedia', 'website']

const INIT: DetailState = {
  foto_hero: '',
  foto_items: [{ label: '', url: '' }],
  testimoni: [
    { nama: '', kota: '', teks: '', bintang: '5' },
    { nama: '', kota: '', teks: '', bintang: '5' },
  ],
  team: [{ ...BLANK_TEAM }],
  pricing: [{ ...BLANK_PRICING }],
  process: [{ ...BLANK_PROCESS }],
  partners: [{ ...BLANK_PARTNER }],
  social: [{ ...BLANK_SOCIAL }],
  kebijakan: '',
  catatan_tambahan: '',
}

const inputCls = "w-full px-4 py-3 rounded-[14px] border border-black/[0.08] text-sm font-medium focus:outline-none focus:border-[#0071E3] bg-white transition-colors"
const textareaCls = `${inputCls} resize-none`

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">{label}</label>
      {hint && <p className="text-xs text-gray-400 font-medium -mt-1">{hint}</p>}
      {children}
    </div>
  )
}

function RepeatHead({ label, hint }: { label: string; hint?: string }) {
  return (
    <>
      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      {hint && <p className="text-xs text-gray-400 font-medium mb-4">{hint}</p>}
    </>
  )
}

// Header tiap baris repeatable (nomor + tombol hapus saat >1 baris)
function RowHead({ label, onRemove, removable }: { label: string; onRemove: () => void; removable: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</span>
      {removable && (
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
      )}
    </div>
  )
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 text-[#0071E3] text-sm font-bold hover:underline">
      <Plus size={16} /> {label}
    </button>
  )
}

// Label foto per industri
const FOTO_LABELS: Record<string, string[]> = {
  travel: ['Foto Armada Unggulan', 'Foto Interior Kendaraan', 'Foto Suasana Layanan'],
  restaurant: ['Foto Makanan Unggulan', 'Foto Suasana Restoran', 'Foto Eksterior Tempat'],
  corporate: ['Foto Kantor / Gedung', 'Foto Tim / Karyawan', 'Foto Portofolio / Hasil Kerja'],
  klinik: ['Foto Ruang Klinik', 'Foto Dokter / Tim Medis', 'Foto Fasilitas'],
  sekolah: ['Foto Gedung Sekolah', 'Foto Kegiatan Siswa', 'Foto Fasilitas Belajar'],
  toko_online: ['Foto Produk Unggulan 1', 'Foto Produk Unggulan 2', 'Foto Brand / Packaging'],
  personal: ['Foto Profil Utama', 'Foto Portfolio / Karya', 'Foto Behind the Scenes'],
}

interface Props {
  token: string
  orderId: string
  namaKlien: string
  industri: string
  existingData?: Record<string, unknown>
  blocks?: ActiveBlocks
}

const NO_BLOCKS: ActiveBlocks = { team: false, pricing: false, process: false, partners: false, social: false }

export default function DetailForm({ token, orderId, namaKlien, industri, existingData, blocks = NO_BLOCKS }: Props) {
  const tipe = industriToTipe(industri)
  const fotoLabels = FOTO_LABELS[tipe] ?? ['Foto Utama', 'Foto Pendukung 1', 'Foto Pendukung 2']
  const hasExtra = blocks.team || blocks.pricing || blocks.process || blocks.partners || blocks.social

  const buildInitialForm = (): DetailState => {
    const base = !existingData
      ? { ...INIT, foto_items: fotoLabels.map(label => ({ label, url: '' })) }
      : (() => {
          const ex = existingData as Partial<DetailState>
          return {
            foto_hero: (ex.foto_hero as string) ?? '',
            foto_items: fotoLabels.map((label, i) => ({
              label,
              url: ((ex.foto_items as { label: string; url: string }[])?.[i]?.url) ?? '',
            })),
            testimoni: (ex.testimoni as TestimoniRow[]) ?? INIT.testimoni,
            team: (ex.team as TeamRow[])?.length ? (ex.team as TeamRow[]) : [{ ...BLANK_TEAM }],
            pricing: (ex.pricing as PricingRow[])?.length ? (ex.pricing as PricingRow[]) : [{ ...BLANK_PRICING }],
            process: (ex.process as ProcessRow[])?.length ? (ex.process as ProcessRow[]) : [{ ...BLANK_PROCESS }],
            partners: (ex.partners as PartnerRow[])?.length ? (ex.partners as PartnerRow[]) : [{ ...BLANK_PARTNER }],
            social: (ex.social as SocialRow[])?.length ? (ex.social as SocialRow[]) : [{ ...BLANK_SOCIAL }],
            kebijakan: (ex.kebijakan as string) ?? '',
            catatan_tambahan: (ex.catatan_tambahan as string) ?? '',
          }
        })()
    return base
  }

  const [form, setForm] = useState<DetailState>(buildInitialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Jika sudah ada data sebelumnya → tampilkan summary dulu, bukan form langsung
  const [editMode, setEditMode] = useState(!existingData)

  const set = (key: keyof DetailState, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  // Helper generik untuk section repeatable (team/pricing/process/partners/social)
  const updateRow = (key: keyof DetailState, idx: number, patch: Record<string, unknown>) =>
    setForm(f => {
      const arr = [...(f[key] as Record<string, unknown>[])]
      arr[idx] = { ...arr[idx], ...patch }
      return { ...f, [key]: arr }
    })
  const addRow = (key: keyof DetailState, blank: unknown) =>
    setForm(f => ({ ...f, [key]: [...(f[key] as unknown[]), blank] }))
  const removeRow = (key: keyof DetailState, idx: number) =>
    setForm(f => ({ ...f, [key]: (f[key] as unknown[]).filter((_, j) => j !== idx) }))

  function updateTestimoni(idx: number, field: keyof TestimoniRow, val: string) {
    setForm(f => {
      const arr = [...f.testimoni]
      arr[idx] = { ...arr[idx], [field]: val }
      return { ...f, testimoni: arr }
    })
  }

  function updateFotoItem(idx: number, val: string) {
    setForm(f => {
      const arr = [...f.foto_items]
      arr[idx] = { ...arr[idx], url: val }
      return { ...f, foto_items: arr }
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const detail_data: Record<string, unknown> = {
        foto_hero: form.foto_hero,
        foto_items: form.foto_items.filter(f => f.url.trim()),
        testimoni: form.testimoni.filter(t => t.nama.trim() && t.teks.trim()).map(t => ({
          ...t,
          bintang: parseInt(t.bintang) || 5,
        })),
        kebijakan: form.kebijakan,
        catatan_tambahan: form.catatan_tambahan,
      }
      // Section konten Sprint A/B/C — hanya kirim yang relevan untuk tema klien.
      // Bentuk baris-form; route mentransform ke bentuk composable saat menulis data_konten.
      if (blocks.team) detail_data.team = form.team.filter(t => t.nama.trim() && t.peran.trim())
      if (blocks.pricing) detail_data.pricing = form.pricing.filter(p => p.nama.trim() && p.harga.trim())
      if (blocks.process) detail_data.process = form.process.filter(s => s.judul.trim() && s.desc.trim())
      if (blocks.partners) detail_data.partners = form.partners.filter(p => p.nama.trim())
      if (blocks.social) detail_data.social = form.social.filter(s => s.platform.trim() && s.href.trim())

      const res = await fetch('/api/briefing/detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, detail_data }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Gagal submit')
      setSubmitted(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const fotoTerisi = form.foto_items.filter(f => f.url.trim()).length
  const totalFoto = form.foto_items.length
  const fotoHeroTerisi = form.foto_hero.trim().length > 0

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-black/[0.04]">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Foto & Detail Terkirim!</h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Terima kasih {namaKlien}. Tim kami akan update website dengan foto dan testimoni asli Anda.
          </p>
          {fotoTerisi < totalFoto && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 text-left">
              <p className="text-sm font-bold text-amber-800 mb-1">
                {fotoTerisi}/{totalFoto} foto pendukung diisi
              </p>
              <p className="text-xs text-amber-700">
                Masih ada foto yang belum diisi. Kembali ke form ini kapan saja untuk melengkapi.
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <a href={`/track?id=${orderId}`}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#0071E3] text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors text-sm">
              Lacak Progress
            </a>
            <button onClick={() => { setSubmitted(false); setEditMode(true) }}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors text-sm">
              Tambah / Perbarui Foto
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Summary mode — sudah pernah submit, tampilkan ringkasan + tombol edit
  if (!editMode) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/[0.04]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
              <Check size={22} className="text-green-600" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Detail Website Sudah Ada</h1>
              <p className="text-sm text-gray-500">Halo {namaKlien}, data Tahap 2 sudah diterima.</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2.5 border-b border-black/[0.04]">
              <span className="text-sm text-gray-500">Foto Utama</span>
              <span className={`text-sm font-bold ${form.foto_hero.trim() ? 'text-green-600' : 'text-red-400'}`}>
                {form.foto_hero.trim() ? '✓ Terisi' : '✗ Belum diisi'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-black/[0.04]">
              <span className="text-sm text-gray-500">Foto Pendukung</span>
              <span className={`text-sm font-bold ${fotoTerisi === totalFoto ? 'text-green-600' : 'text-amber-600'}`}>
                {fotoTerisi}/{totalFoto} terisi
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-sm text-gray-500">Testimoni</span>
              <span className="text-sm font-bold text-gray-700">
                {form.testimoni.filter(t => t.nama.trim() && t.teks.trim()).length} testimoni
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => setEditMode(true)}
              className="w-full py-3.5 rounded-2xl bg-[#0071E3] text-white font-black text-sm hover:bg-blue-600 transition-colors">
              {fotoTerisi < totalFoto ? 'Lengkapi Foto yang Kurang' : 'Perbarui Foto & Detail'}
            </button>
            <a href={`/track?id=${orderId}`}
              className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm text-center hover:bg-gray-50 transition-colors">
              Kembali ke Lacak Progress
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0071E3] text-xs font-black px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
          Tahap 2 — Pelengkap Website
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Lengkapi Detail Website</h1>
        <p className="text-gray-500 text-sm font-medium">
          Halo <strong>{namaKlien}</strong>! Tambahkan foto asli dan testimoni nyata agar website Anda terasa lebih personal dan terpercaya.
        </p>
      </div>

      <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-sm border border-black/[0.03] space-y-8">

        {/* Foto Hero */}
        <Field label="Foto Utama / Hero (opsional)" hint="Foto terbaik yang mewakili bisnis Anda — tampil paling menonjol. Boleh dikosongkan & menyusul nanti.">
          <input className={inputCls} value={form.foto_hero} onChange={e => set('foto_hero', e.target.value)}
            placeholder="https://drive.google.com/... atau link foto lainnya" />
        </Field>

        {/* Foto per kategori */}
        <div>
          <RepeatHead label="Foto Pendukung" hint="Boleh link Google Drive (pastikan akses publik), atau URL langsung." />
          <div className="space-y-3">
            {form.foto_items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-40 shrink-0">{item.label}</span>
                <input className={inputCls} value={item.url} onChange={e => updateFotoItem(i, e.target.value)}
                  placeholder="https://..." />
              </div>
            ))}
          </div>
        </div>

        {/* Testimoni nyata */}
        <div>
          <RepeatHead label="Testimoni Nyata Pelanggan" hint="Minta izin pelanggan Anda dulu. Minimal 1 testimonial agar website terasa kredibel." />
          {form.testimoni.map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-[16px] p-5 mb-4 space-y-3">
              <RowHead label={`Testimoni ${i + 1}`} removable={form.testimoni.length > 1}
                onRemove={() => setForm(f => ({ ...f, testimoni: f.testimoni.filter((_, j) => j !== i) }))} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Nama pelanggan" value={t.nama} onChange={e => updateTestimoni(i, 'nama', e.target.value)} />
                <input className={inputCls} placeholder="Kota / Profesi" value={t.kota} onChange={e => updateTestimoni(i, 'kota', e.target.value)} />
              </div>
              <textarea className={textareaCls} rows={2} placeholder="Review / testimoni dalam kalimat mereka sendiri..."
                value={t.teks} onChange={e => updateTestimoni(i, 'teks', e.target.value)} />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Rating:</span>
                {['5', '4', '3'].map(v => (
                  <button key={v} type="button" onClick={() => updateTestimoni(i, 'bintang', v)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${t.bintang === v ? 'bg-amber-400 border-amber-400 text-amber-900' : 'border-gray-200 text-gray-500 hover:border-amber-300'}`}>
                    {'★'.repeat(parseInt(v))}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <AddButton label="Tambah Testimoni" onClick={() => addRow('testimoni', { nama: '', kota: '', teks: '', bintang: '5' })} />
        </div>

        {/* ── Section Sprint A/B/C — hanya tampil bila tema klien memakai blok itu ── */}

        {/* Team / Tim */}
        {blocks.team && (
          <div>
            <RepeatHead label="Tim / Orang di Balik Layanan" hint="Tampilkan wajah tim Anda agar pelanggan lebih percaya. Foto opsional — tanpa foto akan tampil inisial." />
            {form.team.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-[16px] p-5 mb-4 space-y-3">
                <RowHead label={`Anggota ${i + 1}`} removable={form.team.length > 1} onRemove={() => removeRow('team', i)} />
                <div className="grid grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Nama" value={t.nama} onChange={e => updateRow('team', i, { nama: e.target.value })} />
                  <input className={inputCls} placeholder="Peran / Jabatan" value={t.peran} onChange={e => updateRow('team', i, { peran: e.target.value })} />
                </div>
                <input className={inputCls} placeholder="Link foto (opsional)" value={t.foto} onChange={e => updateRow('team', i, { foto: e.target.value })} />
                <input className={inputCls} placeholder="Bio singkat 1 kalimat (opsional)" value={t.bio} onChange={e => updateRow('team', i, { bio: e.target.value })} />
              </div>
            ))}
            <AddButton label="Tambah Anggota Tim" onClick={() => addRow('team', { ...BLANK_TEAM })} />
          </div>
        )}

        {/* Pricing / Paket Harga */}
        {blocks.pricing && (
          <div>
            <RepeatHead label="Paket / Harga" hint="Tampilkan pilihan paket. Tandai satu paket sebagai unggulan agar di-highlight." />
            {form.pricing.map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-[16px] p-5 mb-4 space-y-3">
                <RowHead label={`Paket ${i + 1}`} removable={form.pricing.length > 1} onRemove={() => removeRow('pricing', i)} />
                <div className="grid grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Nama paket (mis. Reguler)" value={p.nama} onChange={e => updateRow('pricing', i, { nama: e.target.value })} />
                  <input className={inputCls} placeholder='Harga (mis. "Rp250rb" / "Gratis")' value={p.harga} onChange={e => updateRow('pricing', i, { harga: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Periode (mis. /bulan) — opsional" value={p.periode} onChange={e => updateRow('pricing', i, { periode: e.target.value })} />
                  <input className={inputCls} placeholder="Deskripsi singkat — opsional" value={p.desc} onChange={e => updateRow('pricing', i, { desc: e.target.value })} />
                </div>
                <textarea className={textareaCls} rows={3} placeholder="Fitur — satu per baris&#10;Contoh:&#10;8x pertemuan&#10;Modul digital&#10;Konsultasi 1-on-1"
                  value={p.fitur} onChange={e => updateRow('pricing', i, { fitur: e.target.value })} />
                <button type="button" onClick={() => updateRow('pricing', i, { unggulan: !p.unggulan })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${p.unggulan ? 'bg-[#0071E3] border-[#0071E3] text-white' : 'border-gray-200 text-gray-500 hover:border-blue-300'}`}>
                  {p.unggulan ? '★ Paket Unggulan' : 'Jadikan Unggulan'}
                </button>
              </div>
            ))}
            <AddButton label="Tambah Paket" onClick={() => addRow('pricing', { ...BLANK_PRICING })} />
          </div>
        )}

        {/* Process / Langkah */}
        {blocks.process && (
          <div>
            <RepeatHead label="Cara Kerja / Langkah" hint="Jelaskan proses layanan Anda langkah demi langkah agar calon pelanggan paham alurnya." />
            {form.process.map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-[16px] p-5 mb-4 space-y-3">
                <RowHead label={`Langkah ${i + 1}`} removable={form.process.length > 1} onRemove={() => removeRow('process', i)} />
                <input className={inputCls} placeholder="Judul langkah (mis. Konsultasi Awal)" value={s.judul} onChange={e => updateRow('process', i, { judul: e.target.value })} />
                <textarea className={textareaCls} rows={2} placeholder="Penjelasan singkat langkah ini..." value={s.desc} onChange={e => updateRow('process', i, { desc: e.target.value })} />
              </div>
            ))}
            <AddButton label="Tambah Langkah" onClick={() => addRow('process', { ...BLANK_PROCESS })} />
          </div>
        )}

        {/* Partners / Logo mitra */}
        {blocks.partners && (
          <div>
            <RepeatHead label="Mitra / Klien" hint="Logo mitra atau klien membangun kepercayaan. Tanpa link logo akan tampil sebagai teks nama." />
            {form.partners.map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-[16px] p-5 mb-4 space-y-3">
                <RowHead label={`Mitra ${i + 1}`} removable={form.partners.length > 1} onRemove={() => removeRow('partners', i)} />
                <input className={inputCls} placeholder="Nama mitra / klien" value={p.nama} onChange={e => updateRow('partners', i, { nama: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Link logo (opsional)" value={p.logo} onChange={e => updateRow('partners', i, { logo: e.target.value })} />
                  <input className={inputCls} placeholder="Link website mitra (opsional)" value={p.href} onChange={e => updateRow('partners', i, { href: e.target.value })} />
                </div>
              </div>
            ))}
            <AddButton label="Tambah Mitra" onClick={() => addRow('partners', { ...BLANK_PARTNER })} />
          </div>
        )}

        {/* Social / Medsos */}
        {blocks.social && (
          <div>
            <RepeatHead label="Media Sosial & Marketplace" hint="Arahkan pengunjung ke akun jualan & komunitas Anda (Instagram, TikTok, Shopee, dll)." />
            {form.social.map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-[16px] p-5 mb-4 space-y-3">
                <RowHead label={`Tautan ${i + 1}`} removable={form.social.length > 1} onRemove={() => removeRow('social', i)} />
                <div className="grid grid-cols-2 gap-3">
                  <select className={inputCls} value={s.platform} onChange={e => updateRow('social', i, { platform: e.target.value })}>
                    {SOCIAL_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt === 'x' ? 'X (Twitter)' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                  <input className={inputCls} placeholder="Label (mis. @akun) — opsional" value={s.label} onChange={e => updateRow('social', i, { label: e.target.value })} />
                </div>
                <input className={inputCls} placeholder="Link / URL akun (mis. https://instagram.com/akun)" value={s.href} onChange={e => updateRow('social', i, { href: e.target.value })} />
              </div>
            ))}
            <AddButton label="Tambah Tautan" onClick={() => addRow('social', { ...BLANK_SOCIAL })} />
          </div>
        )}

        {/* Kebijakan */}
        <Field label="Kebijakan / Syarat & Ketentuan" hint="Informasi penting untuk calon pelanggan — cancellation, refund, syarat, dll.">
          <textarea className={textareaCls} rows={3} value={form.kebijakan}
            onChange={e => set('kebijakan', e.target.value)}
            placeholder="Contoh: Pembatalan H-1 kena charge 50%. Deposit dikembalikan setelah kendaraan diperiksa..." />
        </Field>

        {/* Catatan tambahan */}
        <Field label="Catatan Tambahan untuk Tim Kami" hint="Hal lain yang perlu tim kami tahu — request khusus, preferensi design, dll.">
          <textarea className={textareaCls} rows={2} value={form.catatan_tambahan}
            onChange={e => set('catatan_tambahan', e.target.value)}
            placeholder="Contoh: Mohon gunakan warna yang lebih gelap, saya ingin tampilan mewah..." />
        </Field>

        {hasExtra && (
          <div className="p-4 rounded-[16px] bg-blue-50/60 border border-blue-100 flex items-start gap-3">
            <span className="text-[#0071E3] text-lg shrink-0">✨</span>
            <p className="text-sm font-medium text-gray-600">
              Section di atas <strong className="text-gray-800">disesuaikan dengan tema Anda</strong> — yang Anda isi langsung tampil di website. Semua opsional dan bisa dilengkapi kapan saja.
            </p>
          </div>
        )}

        {!fotoHeroTerisi && (
          <div className="p-4 rounded-[16px] bg-blue-50/60 border border-blue-100 flex items-start gap-3">
            <span className="text-[#0071E3] text-lg shrink-0">💡</span>
            <p className="text-sm font-medium text-gray-600">
              Belum punya link foto? <strong className="text-gray-800">Tidak apa-apa</strong> — kirim saja dulu, tim kami siapkan visual sementara. Anda bisa kembali ke form ini kapan saja untuk menambah foto asli.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-[16px] bg-red-50 border border-red-100">
            <p className="text-sm font-bold text-red-700">{error}</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting}
          className="w-full py-4 rounded-2xl bg-[#0071E3] text-white font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
          {submitting ? <><Loader2 size={18} className="animate-spin" /> Mengirim...</> : <><Check size={18} /> {fotoHeroTerisi ? 'Kirim Detail Website' : 'Kirim Sekarang'}</>}
        </button>
        <a href={`/track?id=${orderId}`}
          className="block w-full text-center text-sm text-gray-400 hover:text-gray-700 font-medium py-2 transition-colors">
          Lewati — lengkapi nanti kapan saja
        </a>
        <p className="text-center text-[11px] text-gray-500 font-medium">
          Semua di tahap ini opsional. Foto & testimoni bikin website lebih meyakinkan, tapi bisa dilengkapi kapan saja lewat link yang sama.
        </p>
      </div>
    </div>
  )
}
