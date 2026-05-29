'use client'

import { useState, useEffect } from 'react'
import { Search, Package, CheckCircle2, Plane, Warehouse, ShieldAlert, Loader2, AlertCircle, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { supabase } from '@/lib/supabase'
import AddonMarketplace from '@/app/components/AddonMarketplace'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281296917963'

const STEPS = [
  { title: 'Briefing & Onboarding', icon: Package },
  { title: 'Analisis & Strategi', icon: Warehouse },
  { title: 'Desain Visual (Mockup)', icon: ShieldAlert },
  { title: 'Development & Integrasi', icon: Plane },
  { title: 'Final Launch', icon: CheckCircle2 },
]

export default function PublicProjectTracker() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-search jika ada ?id= di URL (dari link di thank-you page)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('id')
    if (!orderId) return
    setQuery(orderId)
    setTimeout(() => handleSearchById(orderId), 300)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchById = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: dbErr } = await supabase
        .from('orders')
        .select('*')
        .ilike('id', `${id.slice(0, 8)}%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (dbErr) throw dbErr
      setResult(data)
    } catch {
      setResult('not_found')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return

    setLoading(true)
    setError(null)

    try {
      // Normalize: strip "JA-YYYY-" prefix if user pastes display ID
      const normalized = query.replace(/^JA-\d{4}-/i, '').toLowerCase()
      const isDisplayId = /^[a-f0-9]{8}$/i.test(normalized)

      let q = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(1)

      if (isDisplayId) {
        // Search by first 8 chars of UUID (display ID)
        q = q.ilike('id', `${normalized}%`)
      } else {
        q = q.or(`nomor_wa.eq.${query},id.eq.${query}`)
      }

      const { data, error: dbErr } = await q.single()

      if (dbErr) throw dbErr
      setResult(data)
    } catch (err: any) {
      console.error('Tracking error:', err)
      setResult('not_found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      
      <main className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12 animate-fade-in">
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-apple-blue mb-4 px-3 py-1 bg-blue-50 rounded-lg">
                    Project Transparency
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4 sf-display-heavy">Lacak Progres Website</h2>
                <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
                    Masukkan <strong>Order ID</strong> (contoh: JA-2025-XXXXXXXX) atau <strong>nomor WhatsApp</strong> yang digunakan saat order untuk melihat status real-time.
                </p>
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-12 apple-shadow border border-black/[0.03] animate-fade-up">
                <form onSubmit={handleSearch} className="relative max-w-md mx-auto mb-10">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Order ID atau Nomor WA..."
                        className="w-full bg-gray-50 border border-black/5 rounded-2xl pl-6 pr-[120px] md:pr-[160px] py-4 text-lg font-bold placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-apple-blue/10 focus:bg-white transition-all shadow-inner"
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 top-2 bottom-2 bg-[#1D1D1F] text-white px-4 md:px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                        <span className="hidden sm:inline">Cek Status</span>
                        <span className="sm:hidden">Cek</span>
                    </button>
                </form>

                <AnimatePresence mode="wait">
                    {result === 'not_found' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="text-center py-10 bg-red-50 rounded-[32px] border border-red-100"
                        >
                            <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
                            <p className="text-red-600 font-bold">Data tidak ditemukan.</p>
                            <p className="text-red-500 text-sm">Pastikan nomor WhatsApp yang Anda masukkan sudah benar.</p>
                        </motion.div>
                    )}

                    {result && result !== 'not_found' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 animate-fade-in"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/5 pb-8">
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Status Proyek</p>
                                    <h3 className="text-2xl sf-display-heavy text-[#1D1D1F] capitalize">{result.status}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Estimasi rincian biaya: <span className="font-bold text-apple-blue">Rp {result.total_estimasi?.toLocaleString('id-ID')}</span></p>
                                </div>
                                <div className="bg-blue-50 text-apple-blue px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 border border-blue-100">
                                    <div className="w-2 h-2 rounded-full bg-apple-blue animate-pulse" />
                                    Project ID: {result.id.slice(0,8).toUpperCase()}
                                </div>
                            </div>

                            {/* Apple Style Vertical Timeline */}
                            <div className="relative pl-10 space-y-12 before:content-[''] before:absolute before:left-[14px] before:top-2 before:bottom-2 before:w-[3px] before:bg-gray-100">
                                {STEPS.map((step, i) => {
                                    const stepNum = i + 1
                                    const isDone = result.progress_step > stepNum || result.status === 'completed'
                                    const isCurrent = result.progress_step === stepNum && result.status !== 'completed'
                                    
                                    return (
                                        <div key={i} className="relative group">
                                            {/* Dot */}
                                            <div className={`absolute -left-[43px] w-8 h-8 rounded-full border-4 border-white z-10 flex items-center justify-center transition-all duration-500 shadow-sm ${isDone ? 'bg-green-500' : isCurrent ? 'bg-apple-blue ring-4 ring-blue-100' : 'bg-gray-200'}`}>
                                                {isDone && <CheckCircle2 size={14} className="text-white" />}
                                                {isCurrent && <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
                                            </div>
                                            
                                            {/* Content */}
                                            <div className={`flex items-start gap-6 transition-all duration-300 ${!isDone && !isCurrent ? 'opacity-30' : 'opacity-100'}`}>
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 apple-shadow border border-black/5 transition-transform group-hover:scale-105 ${isCurrent ? 'bg-apple-blue text-white shadow-blue-200' : 'bg-white text-gray-400'}`}>
                                                    <step.icon size={24} />
                                                </div>
                                                <div className="pt-1">
                                                    <h4 className={`text-lg font-bold ${isCurrent ? 'text-apple-blue' : 'text-[#1D1D1F]'}`}>{step.title}</h4>
                                                    <p className="text-sm text-gray-500 font-medium">
                                                        {isDone ? 'Tahap ini telah selesai.' : isCurrent ? 'Tim kami sedang mengerjakan tahap ini.' : 'Menunggu antrean pengerjaan.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="pt-10 mt-10 border-t border-black/5 text-center">
                                <p className="text-sm text-gray-400 mb-6">Butuh perubahan detail brief atau konsultasi?</p>
                                <a 
                                    href={`https://wa.me/${WA_NUMBER}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#1D1D1F] text-white rounded-full font-bold text-sm hover:bg-black transition-all shadow-lg glow-button"
                                >
                                    <MessageCircle size={18} /> Hubungi Project Manager
                                </a>
                            </div>

                            {/* Self-Service Upgrade Section ala Rumahweb */}
                            {(result.progress_step >= 4 || result.status === 'completed') && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                                    className="mt-16 pt-16 border-t-2 border-dashed border-gray-200"
                                >
                                    <AddonMarketplace existingOrder={result} onSuccess={() => handleSearch({ preventDefault: () => {} } as any)} />
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
