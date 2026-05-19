'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Separator } from '@/app/components/ui/separator'
import { Check, Building2, User, ChevronRight, ChevronLeft, Send } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type ClientType = 'individu' | 'perusahaan' | null

interface FormData {
  // tipe
  clientType: ClientType
  // step 1 — individu
  namaUsaha: string
  nomorWa: string
  // step 1 — perusahaan extra
  namaPerusahaan: string
  namapic: string
  jabatan: string
  email: string
  industri: string
  // step 2 — kebutuhan
  tujuanWebsite: string[]
  fiturUtama: string[]
  jumlahHalaman: string
  budget: string
  // step 3 — preferensi
  namaDomain: string
  warnaTema: string
  contohWebsite: string
  targetPasar: string
  deskripsi: string
  // step 4
  agreedToTerms: boolean
}

const INIT: FormData = {
  clientType: null,
  namaUsaha: '', nomorWa: '',
  namaPerusahaan: '', namapic: '', jabatan: '', email: '', industri: '',
  tujuanWebsite: [], fiturUtama: [],
  jumlahHalaman: '', budget: '',
  namaDomain: '', warnaTema: '', contohWebsite: '', targetPasar: '', deskripsi: '',
  agreedToTerms: false,
}

const TUJUAN_OPTIONS = [
  'Company Profile', 'Landing Page', 'Online Shop / E-commerce',
  'LMS / Kursus Online', 'Blog / Artikel', 'Portfolio',
  'Booking & Reservasi', 'Sistem Manajemen', 'Lainnya',
]

const FITUR_OPTIONS = [
  'WhatsApp Button', 'Form Kontak', 'Login Member',
  'Pembayaran Online', 'Blog / Artikel', 'Dashboard Admin',
  'Galeri Foto/Video', 'Testimoni', 'Live Chat',
  'Multilanguage', 'SEO Optimization', 'Google Analytics',
]

const BUDGET_OPTIONS = [
  'Di bawah Rp 1.000.000', 'Rp 1.000.000 – 2.500.000',
  'Rp 2.500.000 – 5.000.000', 'Rp 5.000.000 – 10.000.000', 'Di atas Rp 10.000.000',
]

const HALAMAN_OPTIONS = ['1-3 halaman', '4-5 halaman', '6-10 halaman', '10+ halaman']

// ── Reusable components ────────────────────────────────────────────────────────
function OptionChip({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left ${
        checked
          ? 'border-purple-600 bg-purple-50 text-purple-700'
          : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50/50'
      }`}
    >
      <span className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${
        checked ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
      }`}>
        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </span>
      {label}
    </button>
  )
}

function StepHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  )
}

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-gray-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function OrderFormPage() {
  const [step, setStep] = useState(0) // 0=pilih tipe, 1-4=steps
  const [form, setForm] = useState<FormData>(INIT)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof FormData, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const toggleArr = (key: 'tujuanWebsite' | 'fiturUtama', val: string) => {
    const arr = form[key] as string[]
    set(key, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  const totalSteps = 4
  const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100)

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Brief Terkirim! 🎉</h1>
          <p className="text-gray-600 mb-6">
            Terima kasih! Tim kami akan menghubungi Anda melalui WhatsApp dalam <strong>1×24 jam kerja</strong> untuk konfirmasi dan diskusi lebih lanjut.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 text-left space-y-2 mb-8">
            <p className="text-sm font-semibold text-purple-700">Langkah selanjutnya:</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✅ Brief Anda sudah kami terima</p>
              <p>📞 Tim akan menghubungi via WhatsApp</p>
              <p>📋 Kami siapkan proposal & estimasi biaya</p>
              <p>🚀 Kick-off meeting & mulai pengerjaan</p>
            </div>
          </div>
          <Button onClick={() => { setForm(INIT); setStep(0); setSubmitted(false) }} className="bg-black hover:bg-gray-800 w-full">
            Isi Brief Baru
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-2">Brief Website</p>
          <h1 className="text-4xl font-light mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
            Ceritakan Website Impian Anda
          </h1>
          <p className="text-gray-500">Isi form berikut agar kami dapat memahami kebutuhan Anda dengan tepat</p>
        </div>

        {/* Progress bar */}
        {step > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">Langkah {step} dari {totalSteps}</span>
              <span className="text-xs text-purple-600 font-semibold">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-3">
              {['Info Dasar', 'Kebutuhan', 'Preferensi', 'Review'].map((s, i) => (
                <span key={s} className={`text-[11px] font-medium ${step === i + 1 ? 'text-purple-600' : step > i + 1 ? 'text-green-600' : 'text-gray-400'}`}>
                  {step > i + 1 ? '✓ ' : ''}{s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {/* Step 0 — Pilih Tipe Client */}
          {step === 0 && (
            <div>
              <StepHeader title="Pilih Tipe Client" desc="Apakah Anda mengajukan sebagai individu/UMKM atau mewakili perusahaan?" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { type: 'individu' as ClientType, icon: User, title: 'Individu / UMKM', desc: 'Personal, freelancer, usaha kecil, atau UMKM' },
                  { type: 'perusahaan' as ClientType, icon: Building2, title: 'Perusahaan / Korporat', desc: 'PT, CV, yayasan, atau organisasi resmi' },
                ] as const).map(({ type, icon: Icon, title, desc }) => (
                  <button key={type} type="button"
                    onClick={() => { set('clientType', type); setStep(1) }}
                    className={`group flex flex-col items-start gap-4 p-6 rounded-2xl border-2 text-left transition-all hover:border-purple-400 hover:shadow-md ${
                      form.clientType === type ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">{title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                    <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                      Pilih ini <ChevronRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Info Dasar */}
          {step === 1 && (
            <div className="space-y-5">
              <StepHeader
                title={form.clientType === 'perusahaan' ? 'Informasi Perusahaan' : 'Informasi Dasar'}
                desc="Data kontak yang akan kami gunakan untuk menghubungi Anda"
              />

              {form.clientType === 'individu' ? (
                <>
                  <FieldRow label="Nama / Nama Usaha" required>
                    <Input placeholder="Contoh: Japan Arena" value={form.namaUsaha}
                      onChange={e => set('namaUsaha', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Nomor WhatsApp" required>
                    <Input placeholder="08xxxxxxxxxx" value={form.nomorWa}
                      onChange={e => set('nomorWa', e.target.value)} />
                  </FieldRow>
                </>
              ) : (
                <>
                  <FieldRow label="Nama Perusahaan" required>
                    <Input placeholder="PT. Contoh Sejahtera" value={form.namaPerusahaan}
                      onChange={e => set('namaPerusahaan', e.target.value)} />
                  </FieldRow>
                  <div className="grid grid-cols-2 gap-4">
                    <FieldRow label="Nama PIC" required>
                      <Input placeholder="Nama lengkap" value={form.namapic}
                        onChange={e => set('namapic', e.target.value)} />
                    </FieldRow>
                    <FieldRow label="Jabatan">
                      <Input placeholder="Contoh: Marketing Manager" value={form.jabatan}
                        onChange={e => set('jabatan', e.target.value)} />
                    </FieldRow>
                  </div>
                  <FieldRow label="Nomor WhatsApp" required>
                    <Input placeholder="08xxxxxxxxxx" value={form.nomorWa}
                      onChange={e => set('nomorWa', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Email Perusahaan">
                    <Input type="email" placeholder="email@perusahaan.com" value={form.email}
                      onChange={e => set('email', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Industri / Bidang Usaha" required>
                    <Input placeholder="Contoh: Pendidikan, Kesehatan, Properti" value={form.industri}
                      onChange={e => set('industri', e.target.value)} />
                  </FieldRow>
                </>
              )}
            </div>
          )}

          {/* Step 2 — Kebutuhan Website */}
          {step === 2 && (
            <div className="space-y-7">
              <StepHeader title="Kebutuhan Website" desc="Pilih semua yang sesuai dengan kebutuhan Anda" />

              <FieldRow label="Website untuk apa?" required>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                  {TUJUAN_OPTIONS.map(opt => (
                    <OptionChip key={opt} label={opt}
                      checked={form.tujuanWebsite.includes(opt)}
                      onChange={() => toggleArr('tujuanWebsite', opt)} />
                  ))}
                </div>
              </FieldRow>

              <FieldRow label="Fitur utama yang diinginkan">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                  {FITUR_OPTIONS.map(opt => (
                    <OptionChip key={opt} label={opt}
                      checked={form.fiturUtama.includes(opt)}
                      onChange={() => toggleArr('fiturUtama', opt)} />
                  ))}
                </div>
              </FieldRow>

              <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Estimasi jumlah halaman">
                  <div className="flex flex-col gap-2 mt-1">
                    {HALAMAN_OPTIONS.map(opt => (
                      <button key={opt} type="button" onClick={() => set('jumlahHalaman', opt)}
                        className={`px-3 py-2 rounded-xl border-2 text-sm text-left transition-all ${
                          form.jumlahHalaman === opt ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold' : 'border-gray-200 hover:border-purple-300'
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </FieldRow>

                <FieldRow label="Estimasi budget">
                  <div className="flex flex-col gap-2 mt-1">
                    {BUDGET_OPTIONS.map(opt => (
                      <button key={opt} type="button" onClick={() => set('budget', opt)}
                        className={`px-3 py-2 rounded-xl border-2 text-[12px] text-left transition-all ${
                          form.budget === opt ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold' : 'border-gray-200 hover:border-purple-300'
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </FieldRow>
              </div>
            </div>
          )}

          {/* Step 3 — Preferensi */}
          {step === 3 && (
            <div className="space-y-5">
              <StepHeader title="Preferensi & Referensi" desc="Bantu kami memahami gaya dan kebutuhan spesifik website Anda" />

              <FieldRow label="Nama domain yang diinginkan">
                <Input placeholder="contoh: namabisnisanda.com" value={form.namaDomain}
                  onChange={e => set('namaDomain', e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">Opsional — kami bantu cek ketersediaan domain</p>
              </FieldRow>

              <FieldRow label="Warna / tema website">
                <Input placeholder="Contoh: biru putih modern, dark mode elegan, warm minimalis" value={form.warnaTema}
                  onChange={e => set('warnaTema', e.target.value)} />
              </FieldRow>

              <FieldRow label="Contoh website yang Anda sukai">
                <Input placeholder="https://contohwebsite.com" value={form.contohWebsite}
                  onChange={e => set('contohWebsite', e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">Referensi desain/fitur yang ingin Anda tiru</p>
              </FieldRow>

              {form.clientType === 'perusahaan' && (
                <FieldRow label="Target pasar / audiens">
                  <Input placeholder="Contoh: profesional usia 25-40, ibu rumah tangga, B2B" value={form.targetPasar}
                    onChange={e => set('targetPasar', e.target.value)} />
                </FieldRow>
              )}

              <FieldRow label="Ceritakan website impian Anda" required>
                <Textarea
                  placeholder={`Jelaskan secara bebas:\n- Apa yang ingin Anda sampaikan lewat website?\n- Siapa target pengunjungnya?\n- Ada hal khusus yang ingin Anda sertakan?\n- Deadline atau target waktu?`}
                  rows={6} value={form.deskripsi}
                  onChange={e => set('deskripsi', e.target.value)}
                  className="resize-none"
                />
              </FieldRow>

              {/* Upload box */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Upload Logo / Referensi (Opsional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group">
                  <div className="text-3xl mb-2">📎</div>
                  <p className="text-sm text-gray-600 font-medium group-hover:text-purple-600 transition-colors">
                    Drag & drop atau klik untuk upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Logo, foto referensi, atau dokumen (Max 10MB)</p>
                  <input type="file" className="hidden" multiple accept="image/*,.pdf,.doc,.docx" />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
            <div className="space-y-6">
              <StepHeader title="Review Brief Anda" desc="Periksa kembali sebelum mengirim" />

              <div className="bg-gray-50 rounded-2xl p-5 space-y-4 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tipe Client</p>
                  <p className="font-semibold capitalize text-gray-800">{form.clientType}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Kontak</p>
                  <div className="space-y-1 text-gray-700">
                    {form.namaPerusahaan && <p><span className="text-gray-500">Perusahaan:</span> {form.namaPerusahaan}</p>}
                    {form.namaUsaha && <p><span className="text-gray-500">Nama:</span> {form.namaUsaha}</p>}
                    {form.namapic && <p><span className="text-gray-500">PIC:</span> {form.namapic} {form.jabatan && `(${form.jabatan})`}</p>}
                    <p><span className="text-gray-500">WhatsApp:</span> {form.nomorWa || '-'}</p>
                    {form.email && <p><span className="text-gray-500">Email:</span> {form.email}</p>}
                    {form.industri && <p><span className="text-gray-500">Industri:</span> {form.industri}</p>}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Kebutuhan</p>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="text-gray-500">Tujuan:</span> {form.tujuanWebsite.join(', ') || '-'}</p>
                    <p><span className="text-gray-500">Fitur:</span> {form.fiturUtama.join(', ') || '-'}</p>
                    {form.jumlahHalaman && <p><span className="text-gray-500">Halaman:</span> {form.jumlahHalaman}</p>}
                    {form.budget && <p><span className="text-gray-500">Budget:</span> {form.budget}</p>}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Preferensi</p>
                  <div className="space-y-2 text-gray-700">
                    {form.namaDomain && <p><span className="text-gray-500">Domain:</span> {form.namaDomain}</p>}
                    {form.warnaTema && <p><span className="text-gray-500">Tema:</span> {form.warnaTema}</p>}
                    {form.contohWebsite && <p><span className="text-gray-500">Referensi:</span> {form.contohWebsite}</p>}
                    {form.deskripsi && (
                      <div>
                        <p className="text-gray-500 mb-1">Deskripsi:</p>
                        <p className="bg-white rounded-xl p-3 border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-line">{form.deskripsi}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms */}
              <button type="button" onClick={() => set('agreedToTerms', !form.agreedToTerms)}
                className="flex items-start gap-3 w-full text-left">
                <span className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all ${
                  form.agreedToTerms ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                }`}>
                  {form.agreedToTerms && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </span>
                <span className="text-sm text-gray-600 leading-relaxed">
                  Saya menyetujui bahwa data yang diisi adalah benar dan bersedia dihubungi oleh tim{' '}
                  <span className="font-semibold text-gray-900">Japan Arena Digital Studio</span> untuk proses pembuatan website.
                </span>
              </button>

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-sm font-semibold text-blue-700 mb-1">📞 Proses Selanjutnya</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Setelah form dikirim, tim kami akan menghubungi Anda via WhatsApp dalam <strong>1×24 jam kerja</strong> untuk konfirmasi, diskusi kebutuhan, dan pengiriman proposal + estimasi biaya.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={`flex mt-8 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                {step === 1 ? 'Ubah Tipe' : 'Kembali'}
              </Button>
            )}
            {step > 0 && step < 4 && (
              <Button onClick={() => setStep(s => s + 1)} className="bg-black hover:bg-gray-800 gap-2">
                Lanjutkan
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            {step === 4 && (
              <Button
                disabled={!form.agreedToTerms}
                onClick={() => setSubmitted(true)}
                className="bg-purple-600 hover:bg-purple-700 gap-2"
              >
                <Send className="w-4 h-4" />
                Kirim Brief Website
              </Button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Japan Arena Digital Studio · Semua data dijaga kerahasiaannya
        </p>
      </div>
    </div>
  )
}
