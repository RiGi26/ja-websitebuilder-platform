'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, Building2, User, ChevronRight, ChevronLeft, 
  Send, X, LayoutTemplate, Loader2, Sparkles, AlertCircle, 
  Rocket, ShieldCheck, ArrowRight, Star, Info
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { templatesData } from '@/data/templates'
import { supabase } from '@/lib/supabase'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

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
      <p className="text-gray-500 text-sm font-medium">{desc}</p>
    </div>
  )
}

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
    </div>
  )
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

export default function OrderPage() {
  return (
    <div className="pt-32 pb-24 px-4 bg-[#F5F5F7] min-h-screen font-sans">
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-10 h-10 border-4 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        </div>
      }>
        <OrderFormInner />
      </Suspense>
    </div>
  )
}

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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

  const totalAddons = form.selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return acc + (addon?.price || 0)
  }, 0)
  
  const totalYearlyMaint = form.selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return acc + (addon?.yearlyMaint || 0)
  }, BASE_YEARLY)

  const finalPrice = BASE_PRICE + totalAddons

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            client_type: form.clientType,
            nama_usaha: form.clientType === 'individu' ? form.namaUsaha : null,
            nama_perusahaan: form.clientType === 'perusahaan' ? form.namaPerusahaan : null,
            nama_pic: form.clientType === 'perusahaan' ? form.namapic : null,
            jabatan: form.clientType === 'perusahaan' ? form.jabatan : null,
            nomor_wa: form.nomorWa,
            email: form.email,
            industri: form.industri,
            template_id: form.templateId,
            referensi_manual: form.referensiManual,
            selected_addons: form.selectedAddons,
            total_estimasi: finalPrice,
            total_maintenance: totalYearlyMaint,
            status: 'pending'
          }
        ])

      if (error) throw error
      setSubmitted(true)
    } catch (err: any) {
      console.error('Submission error:', err)
      setSubmitError('Terjadi kesalahan koneksi. Silakan hubungi tim kami via WhatsApp jika error berlanjut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSteps = 4
  const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100)

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] apple-shadow p-12 border border-black/[0.03]">
          <div className="w-24 h-24 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Check size={48} strokeWidth={3} />
          </div>
          <h1 className="text-4xl sf-display-heavy text-gray-900 mb-4 tracking-tight leading-tight">Brief Terkirim! 🎉</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Brief Anda sudah dalam antrean kurasi kami. Konsultan Japan Arena Studio akan menghubungi Anda melalui WhatsApp dalam <strong>1x24 jam</strong>.
          </p>
          <div className="bg-[#F5F5F7] rounded-3xl p-6 text-left space-y-4 mb-10 border border-black/[0.02]">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alur Pengerjaan</p>
            <div className="space-y-3">
              {[
                { t: 'Review Brief', c: 'Tim kami menganalisa kebutuhan teknis Anda.' },
                { t: 'Video Call Consultation', c: 'Diskusi mendalam mengenai struktur & strategi web.' },
                { t: 'Proses Pengerjaan', c: 'Website Anda akan live dalam estimasi 7 hari.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-apple-blue text-white flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">{item.t}</p>
                    <p className="text-xs text-gray-500 leading-tight">{item.c}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button asChild className="bg-[#1D1D1F] hover:bg-black w-full py-7 rounded-2xl text-base sf-display-heavy shadow-lg glow-button">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  const selectedTemplateDetails = form.templateId ? templatesData[form.templateId] : null

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header (Apple Style) */}
      <div className="text-center mb-10 px-2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-apple-blue mb-4 px-3 py-1 bg-blue-50 rounded-lg">
                Onboarding Experience
            </span>
            <h1 className="text-3xl md:text-6xl sf-display-heavy text-[#1D1D1F] tracking-tight leading-tight mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
                Ceritakan Website <br className="hidden md:block" /> <span className="italic text-apple-blue">Impian Anda</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
                Pendaftaran ini adalah langkah awal menuju transformasi digital bisnis Anda yang lebih profesional.
            </p>
        </motion.div>
      </div>

      {/* Progress Experience */}
      {step > 0 && (
        <div className="max-w-2xl mx-auto mb-10 px-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Step {step} of {totalSteps}</span>
            <span className="text-xs font-bold text-apple-blue tabular-nums">{progress}% Complete</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner border border-black/[0.03]">
            <motion.div 
                className="h-full bg-apple-blue rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-4">
            {['Info', 'Ref', 'Fitur', 'Final'].map((s, i) => (
              <span key={s} className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${step === i + 1 ? 'text-apple-blue' : step > i + 1 ? 'text-green-600' : 'text-gray-300'}`}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Glass Container */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-white rounded-[32px] md:rounded-[40px] apple-shadow border border-black/[0.03] p-6 md:p-14 relative overflow-hidden mx-2 sm:mx-0"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 min-h-[300px] flex flex-col">
              
              {/* Step 0 — Pilih Tipe Client (Modernized) */}
              {step === 0 && (
              <div className="space-y-10">
                  <StepHeader title="Siapa Anda?" desc="Pilih tipe pendaftar agar kami bisa memberikan rekomendasi strategi yang tepat." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {([
                      { type: 'individu' as ClientType, icon: User, title: 'Individu / UMKM', desc: 'Pemilik usaha kecil, freelancer, atau personal brand.', emoji: '🚀' },
                      { type: 'perusahaan' as ClientType, icon: Building2, title: 'Perusahaan / Korporat', desc: 'Sistem untuk PT, CV, Yayasan, atau Bisnis Menengah.', emoji: '🏢' },
                  ] as const).map(({ type, icon: Icon, title, desc, emoji }) => (
                      <button key={type} type="button"
                      onClick={() => { set('clientType', type); setStep(1) }}
                      className={`group flex flex-col items-start gap-6 p-8 rounded-[32px] border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                          form.clientType === type ? 'border-apple-blue bg-blue-50/30' : 'border-black/[0.03] bg-[#F9F9FB] hover:border-apple-blue/30'
                      }`}
                      >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          form.clientType === type ? 'bg-apple-blue text-white' : 'bg-white text-gray-400 group-hover:text-apple-blue apple-shadow'
                      }`}>
                          <Icon size={32} />
                      </div>
                      <div>
                          <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-xl sf-display-heavy text-gray-900">{title}</h4>
                              <span className="text-xl">{emoji}</span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                      </div>
                      <span className="text-[11px] font-bold text-apple-blue flex items-center gap-2 mt-auto pt-4 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          Pilih Kategori Ini <ArrowRight size={14} />
                      </span>
                      </button>
                  ))}
                  </div>
              </div>
              )}

              {/* Step 1 — Info Dasar (Clean) */}
              {step === 1 && (
              <div className="space-y-8 max-w-2xl">
                  <StepHeader
                  title={form.clientType === 'perusahaan' ? 'Identitas Bisnis' : 'Informasi Kontak'}
                  desc="Gunakan data aktif agar tim kami bisa segera menghubungi Anda untuk tahap awal."
                  />

                  <div className="space-y-6">
                      {form.clientType === 'individu' ? (
                      <>
                          <FieldRow label="Nama Lengkap / Nama Brand" required>
                              <Input placeholder="Contoh: Nara Coffee Studio" value={form.namaUsaha} onChange={e => set('namaUsaha', e.target.value)} className="py-7 rounded-2xl bg-gray-50 border-black/5 text-lg" />
                          </FieldRow>
                          <FieldRow label="WhatsApp Utama" required>
                              <Input placeholder="08xxxxxxxxxx" value={form.nomorWa} onChange={e => set('nomorWa', e.target.value)} className="py-7 rounded-2xl bg-gray-50 border-black/5 text-lg font-mono" />
                          </FieldRow>
                      </>
                      ) : (
                      <>
                          <FieldRow label="Nama Perusahaan" required>
                              <Input placeholder="PT. Jaya Abadi Sejahtera" value={form.namaPerusahaan} onChange={e => set('namaPerusahaan', e.target.value)} className="py-7 rounded-2xl bg-gray-50 border-black/5 text-lg" />
                          </FieldRow>
                          <div className="grid grid-cols-2 gap-6">
                              <FieldRow label="Nama PIC" required>
                                  <Input placeholder="Nama lengkap" value={form.namapic} onChange={e => set('namapic', e.target.value)} className="py-7 rounded-2xl bg-gray-50 border-black/5" />
                              </FieldRow>
                              <FieldRow label="Jabatan PIC">
                                  <Input placeholder="Contoh: Manager Operasional" value={form.jabatan} onChange={e => set('jabatan', e.target.value)} className="py-7 rounded-2xl bg-gray-50 border-black/5" />
                              </FieldRow>
                          </div>
                          <FieldRow label="Nomor WhatsApp PIC" required>
                              <Input placeholder="08xxxxxxxxxx" value={form.nomorWa} onChange={e => set('nomorWa', e.target.value)} className="py-7 rounded-2xl bg-gray-50 border-black/5 font-mono" />
                          </FieldRow>
                          <FieldRow label="Email Bisnis">
                              <Input type="email" placeholder="official@company.com" value={form.email} onChange={e => set('email', e.target.value)} className="py-7 rounded-2xl bg-gray-50 border-black/5" />
                          </FieldRow>
                          <FieldRow label="Industri / Bidang Usaha" required>
                              <Input placeholder="Contoh: Healthcare, EdTech, Real Estate" value={form.industri} onChange={e => set('industri', e.target.value)} className="py-7 rounded-2xl bg-gray-50 border-black/5" />
                          </FieldRow>
                      </>
                      )}
                  </div>
              </div>
              )}

              {/* Step 2 — Template & Referensi (Focus) */}
              {step === 2 && (
              <div className="space-y-8">
                  <StepHeader title="Visual & Referensi" desc="Tentukan arah desain website Anda agar kami bisa membuatkan sketsa awal yang akurat." />

                  {selectedTemplateDetails ? (
                  <div className="bg-blue-50/50 border border-apple-blue/20 rounded-[32px] p-8 md:p-10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-apple-blue text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                      Selected Template
                      </div>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                          <div className="text-[100px] leading-none bg-white w-32 h-32 rounded-3xl flex items-center justify-center shadow-lg border border-black/5 shrink-0 group-hover:scale-105 transition-transform duration-500">
                              {selectedTemplateDetails.image}
                          </div>
                          <div className="text-center md:text-left">
                              <h3 className="text-3xl sf-display-heavy text-gray-900 mb-2">{selectedTemplateDetails.title}</h3>
                              <p className="text-gray-500 mb-4 font-medium italic">Kategori: {selectedTemplateDetails.category}</p>
                              <div className="inline-flex items-center gap-2 text-xs font-bold text-apple-blue bg-white border border-apple-blue/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                  <Sparkles size={12} /> Desain Ini Akan Menjadi Fondasi
                              </div>
                          </div>
                      </div>
                      <button 
                          onClick={() => set('templateId', null)}
                          className="mt-10 mx-auto md:mx-0 text-sm text-red-500 font-bold flex items-center gap-1.5 hover:text-red-700 transition-colors uppercase tracking-widest"
                      >
                          <X className="w-4 h-4" /> Reset Referensi (Isi Manual)
                      </button>
                  </div>
                  ) : (
                  <div className="space-y-6">
                      <div className="flex items-center gap-4 text-gray-400 font-bold uppercase tracking-[0.2em] text-[11px] mb-2">
                          <LayoutTemplate className="w-5 h-5 text-gray-300" />
                          Custom Briefing
                      </div>
                      <FieldRow label="Ceritakan Website Impian Anda (atau Tempel URL Referensi)" required>
                          <Textarea
                              placeholder={`Tuliskan link website referensi (contoh: www.apple.com) atau rincian:
• Apa tujuan utama website Anda?
• Apa warna brand dominan yang ingin digunakan?
• Siapa target pembaca/pembeli utama Anda?`}
                              rows={8} 
                              value={form.referensiManual}
                              onChange={e => set('referensiManual', e.target.value)}
                              className="resize-none bg-gray-50 border-black/5 rounded-[24px] p-6 text-lg placeholder-gray-300 focus:bg-white transition-all leading-relaxed"
                          />
                      </FieldRow>
                  </div>
                  )}
              </div>
              )}

              {/* Step 3 — Add-ons (Premium Picker) */}
              {step === 3 && (
              <div className="space-y-10">
                  <StepHeader title="Otomasi & Fitur Pro" desc="Pilih komponen tambahan untuk memaksimalkan website Anda. Biaya dihitung transparan." />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 pb-2 custom-scrollbar">
                  {ADDONS.map((addon) => {
                      const isSelected = form.selectedAddons.includes(addon.id)
                      return (
                      <label
                          key={addon.id}
                          className={`cursor-pointer border-2 rounded-[24px] p-6 transition-all duration-300 flex flex-col gap-4 relative group ${
                          isSelected ? 'border-apple-blue bg-blue-50/20 shadow-md' : 'border-black/[0.03] bg-gray-50/50 hover:border-apple-blue/30'
                          }`}
                      >
                          <div className="flex justify-between items-start">
                              <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${isSelected ? 'bg-apple-blue border-apple-blue' : 'border-gray-300'}`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                              </div>
                              <div className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-apple-blue' : 'text-gray-400'}`}>
                                  {formatPrice(addon.price).replace('Rp', 'IDR ')}
                              </div>
                          </div>
                          <input
                              type="checkbox"
                              className="absolute opacity-0"
                              checked={isSelected}
                              onChange={() => toggleAddon(addon.id)}
                          />
                          <div>
                              <h4 className="font-bold text-gray-900 group-hover:text-apple-blue transition-colors leading-tight mb-1">{addon.name}</h4>
                              <p className="text-[10px] text-gray-400 font-medium">Renewal: {formatPrice(addon.yearlyMaint)} / thn</p>
                          </div>
                      </label>
                      )
                  })}
                  </div>

                  {/* Floating Summary Bar */}
                  <div className="bg-[#1D1D1F] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
                      <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-full bg-apple-blue flex items-center justify-center shrink-0 shadow-lg glow-button">
                              <Rocket className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1 leading-none">Paket Launching + Addons</p>
                              <div className="text-3xl sf-display-heavy leading-none">{formatPrice(finalPrice)} <span className="text-xs font-medium text-gray-500 ml-1">/ thn 1</span></div>
                          </div>
                      </div>
                      <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-white/10 pl-5 md:pl-0 md:pr-5">
                          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 leading-none">Biaya Maintenance Tahun 2</p>
                          <div className="text-lg font-bold text-apple-blue">{formatPrice(totalYearlyMaint)} <span className="text-[10px] font-medium text-gray-400">/ Thn</span></div>
                      </div>
                  </div>
              </div>
              )}

              {/* Step 4 — Review (Official Contract feel) */}
              {step === 4 && (
              <div className="space-y-10">
                  <StepHeader title="Konfirmasi Data & Brief" desc="Pastikan data di bawah sudah benar. Brief ini akan dijadikan acuan pengerjaan tim kami." />

                  <div className="bg-[#F9F9FB] rounded-[32px] p-8 md:p-12 space-y-10 border border-black/[0.03] apple-shadow">
                      
                      {/* Header Table style */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                          <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori Client</p>
                              <p className="text-lg font-bold text-gray-900 sf-display capitalize">{form.clientType}</p>
                          </div>
                          <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kontak WhatsApp</p>
                              <p className="text-lg font-bold text-apple-blue font-mono">{form.nomorWa}</p>
                          </div>
                          <div className="col-span-full h-px bg-black/[0.03]" />
                          <div className="col-span-full">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subjek Pengerjaan</p>
                              <p className="text-xl font-bold text-gray-900 sf-display">{form.clientType === 'perusahaan' ? form.namaPerusahaan : form.namaUsaha}</p>
                          </div>
                      </div>

                      {/* Breakdown Cost */}
                      <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 pb-4 border-b border-black/[0.03]">Ringkasan Investasi Digital</p>
                          <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                  <span className="text-gray-500 font-semibold">Paket Website Studio (Foundation)</span>
                                  <span className="font-bold text-gray-900">{formatPrice(BASE_PRICE)}</span>
                              </div>
                              {form.selectedAddons.map(id => {
                                  const addon = ADDONS.find(a => a.id === id)
                                  return addon ? (
                                  <div key={id} className="flex justify-between items-center text-apple-blue">
                                      <span className="font-medium text-sm">+ {addon.name}</span>
                                      <span className="font-bold">{formatPrice(addon.price)}</span>
                                  </div>
                                  ) : null
                              })}
                              <div className="pt-6 mt-6 border-t-2 border-black/5 flex justify-between items-center">
                                  <span className="text-xl sf-display-heavy text-gray-900 uppercase tracking-tighter">Total Estimasi Awal</span>
                                  <span className="text-3xl sf-display-heavy text-apple-blue">{formatPrice(finalPrice)}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Apple-style Agreement */}
                  <button type="button" onClick={() => set('agreedToTerms', !form.agreedToTerms)}
                      className={`flex items-start gap-5 w-full text-left p-6 rounded-[24px] border transition-all duration-300 ${
                          form.agreedToTerms ? 'bg-blue-50 border-apple-blue shadow-sm' : 'bg-white border-black/[0.05] hover:border-apple-blue/30'
                      }`}>
                      <div className={`w-7 h-7 rounded-lg flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all duration-300 ${
                          form.agreedToTerms ? 'bg-apple-blue border-apple-blue text-white shadow-lg' : 'border-gray-300 bg-white'
                      }`}>
                          {form.agreedToTerms && <Check className="w-5 h-5" strokeWidth={4} />}
                      </div>
                      <div className="space-y-1">
                          <p className="text-[15px] font-bold text-gray-900 leading-tight">Saya Mengonfirmasi Detail Brief Ini</p>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                              Dengan ini saya menyatakan bahwa data yang diisi telah benar. Saya memahami bahwa rincian biaya di atas merupakan <strong className="text-apple-blue">Estimasi Awal</strong> dan Penawaran Final akan diberikan oleh tim Japan Arena Corp setelah sesi konsultasi melalui WhatsApp.
                          </p>
                      </div>
                  </button>

                  {submitError && (
                      <div className="bg-red-50 text-red-600 text-sm p-5 rounded-2xl border border-red-200 flex items-center gap-3">
                          <AlertCircle size={20} /> {submitError}
                      </div>
                  )}
              </div>
              )}

              {/* Navigation (Floating Bottom) */}
              <div className={`mt-14 flex items-center ${step > 0 ? 'justify-between' : 'justify-end'}`}>
                  {step > 0 && (
                      <Button 
                          variant="outline" 
                          onClick={() => setStep(s => s - 1)} 
                          className="gap-2 border-black/10 hover:bg-gray-100 h-14 rounded-2xl px-6 sf-display text-gray-600"
                      >
                          <ChevronLeft size={18} />
                          {step === 1 ? 'Ubah Kategori' : 'Kembali'}
                      </Button>
                  )}
                  {step < totalSteps ? (
                      <Button 
                          onClick={() => {
                              if(step === 1 && (!form.nomorWa || (form.clientType === 'individu' && !form.namaUsaha) || (form.clientType === 'perusahaan' && !form.namaPerusahaan))) {
                                  alert('Mohon lengkapi data wajib.'); return;
                              }
                              setStep(s => s + 1)
                          }} 
                          className="bg-[#1D1D1F] hover:bg-black text-white h-14 rounded-2xl px-10 sf-display-heavy shadow-lg transition-all active:scale-95 group"
                      >
                          {step === 0 ? 'Mulai Pengisian Brief' : 'Lanjutkan ke Tahap Berikutnya'}
                          <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                  ) : (
                      <Button
                          disabled={!form.agreedToTerms || isSubmitting}
                          onClick={handleSubmit}
                          className="bg-apple-blue hover:bg-[#005BB5] h-14 rounded-2xl px-12 sf-display-heavy text-white shadow-xl glow-button transition-all active:scale-95 min-w-[240px]"
                      >
                          {isSubmitting ? (
                              <>
                              <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              Sedang Mengirim...
                              </>
                          ) : (
                              <>
                              Kirim Brief Sekarang <Send size={18} className="ml-2" />
                              </>
                          )}
                      </Button>
                  )}
              </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Trust Badge Below Form */}
      <div className="mt-12 text-center mb-12">
         <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.3em] flex items-center justify-center gap-3">
             <ShieldCheck size={16} /> 256-bit Secure Briefing Session
         </p>
      </div>
      <Footer />
    </div>
  )
}
