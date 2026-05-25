'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '@/lib/ux-utils'
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
interface FormData {
  clientType: 'individu' | 'perusahaan' | null
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
            <Loader2 className="animate-spin text-apple-blue" size={32} />
        </div>
      }>
        <OrderFormContent />
      </Suspense>
      <Footer />
    </div>
  )
}

function OrderFormContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INIT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const tid = searchParams.get('template')
    if (tid && templatesData[tid]) setForm(f => ({ ...f, templateId: tid }))
  }, [searchParams])

  const set = (key: keyof FormData, val: any) => setForm(f => ({ ...f, [key]: val }))

  const totalAddons = form.selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return acc + (addon?.price || 0)
  }, 0)

  // DYNAMIC PRICING LOGIC
  const selectedTemplate = form.templateId ? templatesData[form.templateId] : null
  const currentBasePrice = selectedTemplate?.price_numeric || 499000
  const currentBaseRenewal = selectedTemplate?.renewal_price || 699000

  const totalAddonYearly = form.selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return acc + (addon?.yearlyMaint || 0)
  }, 0)

  const finalPrice = currentBasePrice + totalAddons
  const totalYearlyMaint = currentBaseRenewal + totalAddonYearly

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => s - 1)

  const toggleAddon = (id: string) => {
    triggerHaptic()
    setForm(f => ({
      ...f,
      selectedAddons: f.selectedAddons.includes(id) 
        ? f.selectedAddons.filter(i => i !== id)
        : [...f.selectedAddons, id]
    }))
  }

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
            status: 'pending',
            type: 'new'
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
      <div className="text-center mb-12 animate-fade-in px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
              {[1,2,3,4].map((s) => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s-1 ? 'w-8 bg-apple-blue' : 'w-4 bg-gray-200'}`} />
              ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2 sf-display-heavy">Project Briefing</h1>
          <p className="text-gray-500 font-medium">Bantu kami memahami visi digital bisnis Anda.</p>
      </div>

      <div className="bg-white rounded-[40px] p-8 md:p-12 apple-shadow border border-black/[0.03] relative">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <StepHeader title="Kategori Client" desc="Pilih jenis identitas untuk website Anda." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'individu', title: 'Individu / UMKM', desc: 'Cocok untuk portfolio, blog, atau usaha mikro.', icon: User },
                  { id: 'perusahaan', title: 'Perusahaan / PT / CV', desc: 'Cocok untuk branding korporat dan skala bisnis menengah.', icon: Building2 },
                ].map(opt => (
                  <button key={opt.id} onClick={() => { set('clientType', opt.id); handleNext(); triggerHaptic(); }}
                    className={`p-8 rounded-[32px] border-2 text-left transition-all hover:translate-y-[-4px] ${form.clientType === opt.id ? 'border-apple-blue bg-blue-50/50 shadow-md' : 'border-gray-100 hover:border-apple-blue/20 bg-gray-50/50'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${form.clientType === opt.id ? 'bg-apple-blue text-white' : 'bg-white text-gray-400'}`}>
                      <opt.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{opt.title}</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <StepHeader title="Informasi Identitas" desc="Lengkapi detail kontak dan nama bisnis Anda." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {form.clientType === 'individu' ? (
                  <FieldRow label="Nama Usaha / Brand" required>
                    <Input placeholder="Contoh: Kedai Kopi Mulyo" value={form.namaUsaha} onChange={e => set('namaUsaha', e.target.value)} className="apple-input" />
                  </FieldRow>
                ) : (
                  <>
                    <FieldRow label="Nama Perusahaan" required>
                      <Input placeholder="Contoh: PT Japan Arena Indonesia" value={form.namaPerusahaan} onChange={e => set('namaPerusahaan', e.target.value)} className="apple-input" />
                    </FieldRow>
                    <FieldRow label="Nama PIC" required>
                      <Input placeholder="Nama lengkap Anda" value={form.namapic} onChange={e => set('namapic', e.target.value)} className="apple-input" />
                    </FieldRow>
                  </>
                )}
                <FieldRow label="Nomor WhatsApp" required>
                  <Input placeholder="Contoh: 08123456789" value={form.nomorWa} onChange={e => set('nomorWa', e.target.value)} className="apple-input" />
                </FieldRow>
                <FieldRow label="Email">
                  <Input placeholder="Alamat email aktif" value={form.email} onChange={e => set('email', e.target.value)} className="apple-input" />
                </FieldRow>
                <div className="md:col-span-2">
                  <FieldRow label="Bidang Industri">
                    <Input placeholder="Contoh: Food & Beverage, Fashion, Pendidikan" value={form.industri} onChange={e => set('industri', e.target.value)} className="apple-input" />
                  </FieldRow>
                </div>
              </div>
              <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
                <Button variant="ghost" onClick={handlePrev} className="rounded-xl px-8 h-14 font-bold text-gray-400"><ChevronLeft className="mr-2" size={18} /> Kembali</Button>
                <Button disabled={!form.nomorWa || (form.clientType === 'individu' ? !form.namaUsaha : !form.namaPerusahaan)} onClick={handleNext} className="rounded-2xl px-12 h-14 bg-apple-blue hover:bg-blue-600 font-bold shadow-lg">Lanjut Ke Template <ChevronRight className="ml-2" size={18} /></Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <StepHeader title="Pilih Fitur Tambahan" desc="Pilih fungsionalitas yang ingin Anda tambahkan ke website." />
              
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl mb-8 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-apple-blue shrink-0 shadow-sm"><Info size={20} /></div>
                  <p className="text-sm text-blue-700 font-medium leading-relaxed">
                      Sistem kami secara otomatis mendeteksi template <strong>{selectedTemplateDetails?.title}</strong>. 
                      Anda bisa menambah fitur spesifik lainnya di bawah ini.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ADDONS.map(addon => (
                  <button key={addon.id} onClick={() => toggleAddon(addon.id)}
                    className={`flex items-start justify-between p-5 rounded-[24px] border-2 transition-all text-left group ${form.selectedAddons.includes(addon.id) ? 'border-apple-blue bg-blue-50/50' : 'border-gray-50 bg-gray-50/30 hover:border-apple-blue/20 hover:bg-white'}`}>
                    <div className="pr-4">
                      <p className="font-bold text-gray-900 text-sm mb-1">{addon.name}</p>
                      <p className="text-xs text-apple-blue font-bold">{formatPrice(addon.price)}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${form.selectedAddons.includes(addon.id) ? 'bg-apple-blue border-apple-blue text-white shadow-sm' : 'border-gray-200 bg-white group-hover:border-apple-blue/30'}`}>
                      {form.selectedAddons.includes(addon.id) && <Check size={14} strokeWidth={4} />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-10 p-6 rounded-3xl bg-[#F9F9FB] border border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Maintenance Tahun Ke-2</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-gray-900">{formatPrice(totalYearlyMaint)}</span>
                        <span className="text-xs text-gray-400 font-medium">/ tahun</span>
                      </div>
                  </div>
                  <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-right">Total Investasi Awal</p>
                      <span className="text-3xl font-black text-apple-blue sf-display-heavy">{formatPrice(finalPrice)}</span>
                  </div>
              </div>

              <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
                <Button variant="ghost" onClick={handlePrev} className="rounded-xl px-8 h-14 font-bold text-gray-400"><ChevronLeft className="mr-2" size={18} /> Kembali</Button>
                <Button onClick={handleNext} className="rounded-2xl px-12 h-14 bg-apple-blue hover:bg-blue-600 font-bold shadow-lg">Review Brief <ChevronRight className="ml-2" size={18} /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <StepHeader title="Konfirmasi & Finalisasi" desc="Pastikan rincian brief Anda sudah sesuai sebelum dikirim ke tim konsultan kami." />
                    <div className="hidden md:block w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-apple-blue"><ShieldCheck size={32} /></div>
                  </div>

                  {submitError && (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-3">
                          <AlertCircle size={20} /> {submitError}
                      </div>
                  )}

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
                                  <p className="text-gray-500 font-semibold">Paket Website Studio ({selectedTemplate?.title || 'Basic'})</p>
                                  <span className="font-bold text-gray-900">{formatPrice(currentBasePrice)}</span>
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
                          form.agreedToTerms ? 'bg-apple-blue border-apple-blue text-white' : 'border-gray-200'
                      }`}>
                          {form.agreedToTerms && <Check size={16} strokeWidth={4} />}
                      </div>
                      <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-900">Saya menyetujui Ketentuan Layanan</p>
                          <p className="text-xs text-gray-500 leading-relaxed">
                              Saya mengkonfirmasi bahwa data yang dimasukkan sudah benar dan bersedia untuk dihubungi oleh tim konsultan Japan Arena Corp untuk proses briefing lebih lanjut.
                          </p>
                      </div>
                  </button>

                  <div className="flex justify-between mt-12 pt-8 border-t border-gray-100 gap-4">
                    <Button variant="ghost" onClick={handlePrev} className="rounded-xl px-8 h-14 font-bold text-gray-400">Kembali</Button>
                    <Button disabled={!form.agreedToTerms || isSubmitting} onClick={handleSubmit} 
                        className="rounded-2xl flex-1 h-14 bg-gray-900 hover:bg-black text-white font-bold shadow-xl flex items-center justify-center gap-3">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Mengirim Brief...
                            </>
                        ) : (
                            <>
                                <Rocket size={20} /> Kirim Brief Project
                            </>
                        )}
                    </Button>
                  </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
