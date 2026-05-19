'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Separator } from '@/app/components/ui/separator'
import { Check, Building2, User, ChevronRight, ChevronLeft, Send, X, LayoutTemplate } from 'lucide-react'
import { templatesData } from '@/data/templates'

// ── Types & Constants ─────────────────────────────────────────────────────────
type ClientType = 'individu' | 'perusahaan' | null

interface FormData {
  clientType: ClientType
  namaUsaha: string
  nomorWa: string
  namaPerusahaan: string
  namapic: string
  jabatan: string
  email: string
  industri: string
  templateId: string | null
  referensiManual: string
  selectedAddons: string[]
  agreedToTerms: boolean
}

const INIT: FormData = {
  clientType: null,
  namaUsaha: '', nomorWa: '',
  namaPerusahaan: '', namapic: '', jabatan: '', email: '', industri: '',
  templateId: null,
  referensiManual: '',
  selectedAddons: [],
  agreedToTerms: false,
}

const ADDONS = [
  { id: 'blog', name: 'Blog / Artikel', price: 99000, yearlyMaint: 50000 },
  { id: 'shop', name: 'Online Shop', price: 299000, yearlyMaint: 199000 },
  { id: 'admin', name: 'Dashboard Admin', price: 199000, yearlyMaint: 99000 },
  { id: 'member', name: 'Login Member', price: 199000, yearlyMaint: 99000 },
  { id: 'lms', name: 'LMS / E-learning', price: 399000, yearlyMaint: 299000 },
  { id: 'quiz', name: 'Quiz Online', price: 249000, yearlyMaint: 99000 },
  { id: 'portal', name: 'Portal Siswa', price: 299000, yearlyMaint: 149000 },
  { id: 'gsheets', name: 'Google Sheets Integration', price: 149000, yearlyMaint: 49000 },
  { id: 'midtrans', name: 'Midtrans Payment', price: 299000, yearlyMaint: 99000 },
  { id: 'wa', name: 'WhatsApp Automation', price: 199000, yearlyMaint: 99000 },
  { id: 'invoice', name: 'Invoice Automation', price: 199000, yearlyMaint: 99000 },
  { id: 'seo', name: 'SEO Optimization', price: 149000, yearlyMaint: 49000 },
  { id: 'booking', name: 'Booking System', price: 249000, yearlyMaint: 99000 },
  { id: 'chat', name: 'Live Chat', price: 99000, yearlyMaint: 49000 },
]

const BASE_PRICE = 499000
const BASE_YEARLY = 499000

// ── Reusable components ────────────────────────────────────────────────────────
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

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

// ── Internal Form Component (Wrapped in Suspense) ──────────────────────────────
function OrderFormInner() {
  const searchParams = useSearchParams()
  const templateParam = searchParams.get('template')
  const initialTemplateId = templateParam && templatesData[templateParam] ? templateParam : null

  const [step, setStep] = useState(0) // 0=Tipe, 1=Info, 2=Referensi, 3=Addons, 4=Review
  const [form, setForm] = useState<FormData>({
    ...INIT,
    templateId: initialTemplateId
  })
  const [submitted, setSubmitted] = useState(false)

  // Force sync URL params with state in case of client-side caching
  useEffect(() => {
    const param = searchParams.get('template')
    if (param && templatesData[param]) {
      setForm(prev => prev.templateId !== param ? { ...prev, templateId: param } : prev)
    }
  }, [searchParams])

  const set = (key: keyof FormData, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const toggleAddon = (id: string) => {
    const isSelected = form.selectedAddons.includes(id)
    if (isSelected) {
      set('selectedAddons', form.selectedAddons.filter(a => a !== id))
    } else {
      set('selectedAddons', [...form.selectedAddons, id])
    }
  }

  // Calculate totals
  const totalAddons = form.selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return acc + (addon?.price || 0)
  }, 0)
  
  const totalYearlyMaint = form.selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return acc + (addon?.yearlyMaint || 0)
  }, BASE_YEARLY)

  const finalPrice = BASE_PRICE + totalAddons

  const totalSteps = 4
  const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100)

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 pt-12 pb-16">
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
              <p>📋 Kami siapkan proposal & estimasi biaya (Total: {formatPrice(finalPrice)})</p>
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

  const selectedTemplateDetails = form.templateId ? templatesData[form.templateId] : null

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-2">Pendaftaran & Brief</p>
        <h1 className="text-4xl font-light mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
          Ceritakan Website Impian Anda
        </h1>
        <p className="text-gray-500">Ikuti langkah-langkah berikut untuk memulai pembuatan website Anda</p>
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
          <div className="flex justify-between mt-3 px-1">
            {['Info Dasar', 'Referensi', 'Fitur/Add-on', 'Review'].map((s, i) => (
              <span key={s} className={`text-[11px] font-medium ${step === i + 1 ? 'text-purple-600' : step > i + 1 ? 'text-green-600' : 'text-gray-400'}`}>
                {step > i + 1 ? '✓ ' : ''}{s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-10">
        
        {/* Step 0 — Pilih Tipe Client */}
        {step === 0 && (
          <div>
            <StepHeader title="Pilih Tipe Pendaftar" desc="Apakah Anda mengajukan sebagai individu/UMKM atau mewakili perusahaan?" />
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
                  <span className="text-xs font-semibold text-purple-600 flex items-center gap-1 mt-auto pt-2">
                    Pilih ini <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Info Dasar */}
        {step === 1 && (
          <div className="space-y-6">
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
                    <Input placeholder="Contoh: Manager" value={form.jabatan}
                      onChange={e => set('jabatan', e.target.value)} />
                  </FieldRow>
                </div>
                <FieldRow label="Nomor WhatsApp PIC" required>
                  <Input placeholder="08xxxxxxxxxx" value={form.nomorWa}
                    onChange={e => set('nomorWa', e.target.value)} />
                </FieldRow>
                <FieldRow label="Email Perusahaan">
                  <Input type="email" placeholder="email@perusahaan.com" value={form.email}
                    onChange={e => set('email', e.target.value)} />
                </FieldRow>
                <FieldRow label="Industri / Bidang Usaha" required>
                  <Input placeholder="Contoh: Pendidikan, Kesehatan, Retail" value={form.industri}
                    onChange={e => set('industri', e.target.value)} />
                </FieldRow>
              </>
            )}
          </div>
        )}

        {/* Step 2 — Template & Referensi */}
        {step === 2 && (
          <div className="space-y-6">
            <StepHeader title="Referensi Website" desc="Dasar desain yang akan kami buatkan untuk Anda" />

            {selectedTemplateDetails ? (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Terpilih dari Katalog
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-4xl bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm">
                    {selectedTemplateDetails.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedTemplateDetails.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Kategori: {selectedTemplateDetails.category}</p>
                    <p className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded inline-block font-medium">
                      Desain ini akan dijadikan dasar website Anda
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => set('templateId', null)}
                  className="mt-4 text-sm text-red-500 font-semibold flex items-center gap-1 hover:text-red-600"
                >
                  <X className="w-4 h-4" /> Batal pilih template ini (Isi manual)
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4 text-gray-700 font-semibold">
                  <LayoutTemplate className="w-5 h-5" />
                  Anda belum memilih template dari katalog
                </div>
                <FieldRow label="Ceritakan website yang Anda inginkan (URL/Ide Manual)" required>
                  <Textarea
                    placeholder={`Tuliskan link website referensi (contoh: www.apple.com) atau ceritakan:
- Tujuannya untuk apa?
- Warna yang disukai?
- Target audiensnya siapa?`}
                    rows={5} 
                    value={form.referensiManual}
                    onChange={e => set('referensiManual', e.target.value)}
                    className="resize-none bg-white"
                  />
                </FieldRow>
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Add-ons (Smart Calculator) */}
        {step === 3 && (
          <div className="space-y-6">
            <StepHeader title="Fitur Tambahan (Add-on)" desc="Pilih fitur tambahan yang diperlukan. Total harga akan otomatis dihitung." />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 pb-2 custom-scrollbar">
              {ADDONS.map((addon) => {
                const isSelected = form.selectedAddons.includes(addon.id)
                return (
                  <label
                    key={addon.id}
                    className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 flex items-start gap-3 ${
                      isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        onChange={() => toggleAddon(addon.id)}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">{addon.name}</h4>
                      <div className="text-blue-600 text-sm font-bold mt-0.5">+{formatPrice(addon.price)}</div>
                    </div>
                  </label>
                )
              })}
            </div>

            {/* Smart Calculator Summary Strip */}
            <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-slate-400 text-xs font-medium mb-1">Paket Dasar + Addon</p>
                <div className="text-2xl font-bold">{formatPrice(finalPrice)} <span className="text-xs font-normal text-slate-300">/ Tahun Pertama</span></div>
              </div>
              <div className="text-right sm:text-right w-full sm:w-auto">
                <p className="text-slate-400 text-xs font-medium mb-1">Renewal Tahun Ke-2</p>
                <div className="text-sm font-semibold text-blue-300">{formatPrice(totalYearlyMaint)} / thn</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <div className="space-y-6">
            <StepHeader title="Review & Konfirmasi" desc="Periksa kembali detail pesanan Anda sebelum mengirim brief" />

            <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 space-y-5 text-sm border border-gray-100">
              {/* Kontak */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 border-b pb-2">Data Pemesan ({form.clientType})</p>
                <div className="grid grid-cols-2 gap-y-2 text-gray-700">
                  {form.clientType === 'perusahaan' ? (
                    <>
                      <div className="col-span-2 sm:col-span-1"><span className="text-gray-500">Perusahaan:</span> <br/>{form.namaPerusahaan}</div>
                      <div className="col-span-2 sm:col-span-1"><span className="text-gray-500">Industri:</span> <br/>{form.industri}</div>
                      <div className="col-span-2 sm:col-span-1"><span className="text-gray-500">PIC:</span> <br/>{form.namapic} ({form.jabatan})</div>
                      <div className="col-span-2 sm:col-span-1"><span className="text-gray-500">Email:</span> <br/>{form.email || '-'}</div>
                    </>
                  ) : (
                    <div className="col-span-2"><span className="text-gray-500">Nama Usaha/Personal:</span> <br/>{form.namaUsaha}</div>
                  )}
                  <div className="col-span-2"><span className="text-gray-500">WhatsApp:</span> <br/>{form.nomorWa}</div>
                </div>
              </div>

              {/* Referensi */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 border-b pb-2">Referensi Desain</p>
                {selectedTemplateDetails ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedTemplateDetails.image}</span>
                    <span className="font-semibold text-purple-700">Template Katalog: {selectedTemplateDetails.title}</span>
                  </div>
                ) : (
                  <div className="text-gray-700 whitespace-pre-line bg-white p-3 rounded-lg border">
                    {form.referensiManual || '-'}
                  </div>
                )}
              </div>

              {/* Kalkulasi Akhir */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 border-b pb-2">Rincian Estimasi Biaya</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>✅ Paket Website Hemat Dasar</span>
                    <span className="font-medium">{formatPrice(BASE_PRICE)}</span>
                  </div>
                  {form.selectedAddons.map(id => {
                    const addon = ADDONS.find(a => a.id === id)
                    return addon ? (
                      <div key={id} className="flex justify-between items-center text-blue-700">
                        <span>+ {addon.name}</span>
                        <span className="font-medium">{formatPrice(addon.price)}</span>
                      </div>
                    ) : null
                  })}
                  <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold text-lg text-slate-900">
                    <span>Total Estimasi Awal</span>
                    <span>{formatPrice(finalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                    <span>Biaya perpanjangan tahun berikutnya</span>
                    <span>{formatPrice(totalYearlyMaint)} / thn</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <button type="button" onClick={() => set('agreedToTerms', !form.agreedToTerms)}
              className="flex items-start gap-3 w-full text-left bg-blue-50/50 p-4 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors">
              <span className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all ${
                form.agreedToTerms ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}>
                {form.agreedToTerms && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </span>
              <span className="text-sm text-gray-700 leading-relaxed">
                Saya mengerti bahwa ini adalah <strong className="text-blue-800">Estimasi Awal untuk website berbasis Template</strong>. Jika saya mengajukan referensi dengan fitur/desain <strong className="text-blue-800">Custom</strong>, harga final dapat menyesuaikan tingkat kerumitan pengerjaan. Saya menyetujui untuk dihubungi via WhatsApp.
              </span>
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className={`flex mt-10 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? 'Ubah Tipe' : 'Kembali'}
            </Button>
          )}
          {step > 0 && step < totalSteps && (
            <Button onClick={() => setStep(s => s + 1)} className="bg-black hover:bg-gray-800 gap-2 px-8">
              Lanjutkan
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
          {step === totalSteps && (
            <Button
              disabled={!form.agreedToTerms}
              onClick={() => setSubmitted(true)}
              className="bg-blue-600 hover:bg-blue-700 gap-2 px-8 shadow-lg shadow-blue-600/30"
            >
              <Send className="w-4 h-4" />
              Kirim Pendaftaran
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OrderPage() {
  return (
    <div className="pt-24 pb-16 px-4 bg-[#f4f7fb] min-h-screen">
      <Suspense fallback={<div className="text-center pt-20">Loading form...</div>}>
        <OrderFormInner />
      </Suspense>
    </div>
  )
}
