'use client'

import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Star, Check, Zap, Rocket, BarChart2, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

// ─── Sections ───────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -mr-64 -mt-64 opacity-60 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white border border-black/5 text-[#0071E3] text-[11px] font-bold px-4 py-1.5 rounded-full apple-shadow">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Done-for-You: Kami Buatkan, Anda Terima Beres
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl sf-display-heavy tracking-tight text-gray-900 leading-[1.05] mb-8"
          >
            Website Bisnis Profesional <br />
            <span className="text-apple-blue italic">Tanpa Ribet.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Kami bantu bangun infrastruktur digital bisnismu mulai dari desain, hosting, hingga integrasi pembayaran otomatis. Cukup kirim materi, website Anda live dalam 7 hari.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button asChild size="lg" className="bg-[#1D1D1F] hover:bg-black text-white px-8 py-7 rounded-full text-lg sf-display-heavy shadow-xl glow-button w-full sm:w-auto">
              <Link href="https://wa.me/6281296917963?text=Halo%20Japan%20Arena%20Studio%2C%20saya%20ingin%20konsultasi%20pembuatan%20website%20bisnis.">
                Konsultasi Gratis Sekarang
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-7 rounded-full text-lg sf-display border-black/5 bg-white apple-shadow hover:bg-gray-50 w-full sm:w-auto">
              <Link href="/template">Lihat Katalog Template</Link>
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
              <div className="flex text-yellow-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
              </div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                  Sudah Termasuk Hosting & Support WA 24/7
              </p>
          </motion.div>
        </div>

        {/* Device Mockup with Floating Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          {/* Browser Mockup */}
          <div className="relative bg-white rounded-[40px] shadow-2xl border-[10px] border-black overflow-hidden aspect-[16/10]">
            {/* Browser Chrome */}
            <div className="bg-gray-100 px-6 py-4 flex items-center gap-3 border-b border-gray-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-gray-400 font-mono border border-black/5">
                  studio.japanarenacorp.com
                </div>
              </div>
            </div>

            {/* Website Screenshot Placeholder */}
            <div className="bg-[#F5F5F7] h-full flex items-center justify-center p-12">
              <div className="text-center">
                <div className="text-7xl mb-6">🏪</div>
                <h3 className="text-3xl sf-display-heavy mb-3">Toko Kopi Nusantara</h3>
                <p className="text-gray-500 text-lg">Website bisnis lokal yang profesional & modern</p>
              </div>
            </div>
          </div>

          {/* Floating Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute -left-12 top-1/4 bg-white/80 backdrop-blur-xl rounded-3xl apple-shadow p-5 flex items-center gap-4 border border-white/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
              <div className="text-xl font-bold">Rp</div>
            </div>
            <div>
              <p className="sf-display text-base">Payment Gateway</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Terima QRIS & Bank Transfer</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute -right-12 top-1/3 bg-white/80 backdrop-blur-xl rounded-3xl apple-shadow p-5 flex items-center gap-4 border border-white/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-apple-blue flex items-center justify-center">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="sf-display text-base">WA Automation</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Notifikasi Invoice Otomatis</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function TrackCallout() {
  return (
    <section className="px-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1D1D1F] rounded-[28px] px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-white font-black text-base leading-tight">Sudah pernah order?</p>
            <p className="text-gray-400 text-sm mt-0.5">Pantau progress website Anda secara real-time dengan Order ID.</p>
          </div>
          <Link
            href="/track"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-[#1D1D1F] px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-100 active:scale-95 transition-all whitespace-nowrap"
          >
            Lacak Progress <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <TrackCallout />
      </main>

      <Footer />
    </div>
  )
}
