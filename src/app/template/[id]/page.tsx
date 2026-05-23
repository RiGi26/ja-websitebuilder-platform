'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Separator } from '@/app/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import { 
  Monitor, Tablet, Smartphone, Star, Check, FileText, 
  Headphones, Palette, Zap, ExternalLink, ChevronLeft, ArrowRight, Sparkles 
} from 'lucide-react'
import { motion } from 'framer-motion'

import { templatesData } from '@/data/templates'
import { notFound, useParams } from 'next/navigation'

const features = ['Desain sesuai template pilihan', 'Domain + Hosting 1 tahun', 'Mobile Friendly & Responsive', 'Garansi Revisi Minor']
const included = [
  { icon: FileText, label: '5 Halaman' },
  { icon: Palette, label: 'Desain Custom' },
  { icon: Zap, label: 'Loading Cepat' },
  { icon: Headphones, label: 'Support 24/7' },
]
const reviews = [
  { name: 'Budi Santoso', role: 'Pemilik Kafe', rating: 5, comment: 'Website-nya keren banget! Pelanggan jadi lebih mudah lihat menu dan lokasi kami.', avatar: 'BS' },
  { name: 'Siti Nurhaliza', role: 'Owner Butik', rating: 5, comment: 'Proses cepat, hasilnya profesional. Sangat recommended!', avatar: 'SN' },
]

export default function TemplateDetailPage() {
  const params = useParams()
  const id = params.id as string
  const template = templatesData[id]

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  if (!template) return notFound()

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 bg-[#F5F5F7] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb (Apple Style) */}
        <div className="flex items-center gap-2 mb-10 animate-fade-in px-1">
            <Link href="/template" className="text-xs font-bold text-gray-400 hover:text-apple-blue transition-colors uppercase tracking-widest flex items-center gap-1">
                <ChevronLeft size={14} /> Kembali ke Katalog
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Area: Device Preview Lab */}
          <div className="lg:col-span-8 space-y-6 animate-fade-up">
            
            {/* Device Toggles (Floating Control) */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-2 apple-shadow border border-black/5">
                <div className="flex gap-1">
                    {[
                        { id: 'desktop', icon: Monitor, label: 'Desktop' },
                        { id: 'tablet',  icon: Tablet,  label: 'Tablet'  },
                        { id: 'mobile',  icon: Smartphone, label: 'Mobile' },
                    ].map((d) => (
                        <button
                            key={d.id}
                            onClick={() => setDevice(d.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                device === d.id 
                                ? 'bg-apple-blue text-white shadow-md' 
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                        >
                            <d.icon size={16} />
                            <span className="hidden sm:inline">{d.label}</span>
                        </button>
                    ))}
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Responsive Engine</span>
                </div>
            </div>

            {/* Preview Frame Container */}
            <div className="bg-white rounded-[40px] apple-shadow border border-black/5 overflow-hidden flex items-center justify-center min-h-[500px] sm:min-h-[700px] p-4 sm:p-12 relative">
              {/* Device Frame Simulation */}
              <motion.div 
                key={device}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-[24px] shadow-2xl border-[8px] border-black transition-all duration-500 relative ${
                    device === 'desktop' ? 'w-full aspect-[16/10]' :
                    device === 'tablet'  ? 'w-[450px] aspect-[3/4]' : 
                                           'w-[300px] aspect-[9/19.5]'
                }`}
              >
                {/* Dynamic notch for mobile */}
                {device === 'mobile' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20" />
                )}

                <iframe 
                  src={template.demoUrl} 
                  className="w-full h-full rounded-[16px] border-none bg-white"
                  title={`Preview ${template.title}`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </motion.div>
              
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
            </div>

            {/* Technical Specs Card */}
            <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/5 grid grid-cols-2 sm:grid-cols-4 gap-8">
                {[
                    { l: 'Platform', v: template.platform, i: Zap },
                    { l: 'Structure', v: template.pages, i: FileText },
                    { l: 'UX Score', v: '9.8/10', i: Star },
                    { l: 'Support', v: 'Priority', i: Headphones },
                ].map((s, i) => (
                    <div key={i} className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <s.i size={12} className="text-apple-blue" /> {s.l}
                        </p>
                        <p className="text-sm font-bold text-[#1D1D1F]">{s.v}</p>
                    </div>
                ))}
            </div>
          </div>

          {/* Right Area: Sticky Action Sidebar */}
          <div className="lg:col-span-4 animate-fade-up" style={{animationDelay: '100ms'}}>
            <div className="sticky top-24 bg-white rounded-[40px] p-8 md:p-10 apple-shadow border border-black/[0.03] space-y-8">
              
              <div>
                <h2 className="text-3xl md:text-4xl sf-display-heavy text-[#1D1D1F] tracking-tight mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                    {template.title}
                </h2>
                <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (<Star key={i} size={14} className="fill-current" />))}
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">({template.reviewCount} Reviews)</span>
                </div>
              </div>

              <div className="bg-[#F9F9FB] rounded-3xl p-6 border border-black/[0.02]">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Paket Launching Dasar</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sf-display-heavy text-apple-blue tabular-nums">{template.price}</span>
                  <span className="text-sm text-gray-400 line-through font-medium">{template.originalPrice}</span>
                </div>
                <p className="text-[10px] text-green-600 font-bold mt-3 bg-green-50 px-2 py-1 rounded-md inline-block uppercase tracking-wider">Mulai Launching Dalam 7 Hari</p>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Keunggulan Blueprint Ini</p>
                <div className="grid grid-cols-1 gap-3">
                    {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-2xl border border-black/[0.01]">
                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                            <Check size={14} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 leading-tight">{feature}</span>
                    </div>
                    ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button asChild size="lg" className="w-full bg-[#1D1D1F] hover:bg-black h-16 rounded-2xl text-base sf-display-heavy shadow-xl glow-button">
                  <Link href={`/order?template=${template.id}`}>Pilih Template & Mulai Proyek</Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-black/5 hover:bg-gray-50 text-sm font-bold text-gray-500">
                  <a href={template.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Buka Preview Full-Screen <ExternalLink size={16} />
                  </a>
                </Button>
              </div>

              <div className="pt-6 border-t border-black/5 text-center">
                <p className="text-xs text-gray-400 font-medium mb-3 leading-relaxed">
                    Butuh fitur tambahan atau kustomisasi penuh sesuai keinginan Anda?
                </p>
                <Link href="/order" className="inline-flex items-center gap-1.5 text-xs font-bold text-apple-blue uppercase tracking-widest hover:underline">
                  Konsultasi Layanan Custom <ArrowRight size={12} />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
