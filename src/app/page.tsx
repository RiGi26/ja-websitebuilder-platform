'use client'

import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Star, Check, Zap, Rocket } from 'lucide-react'
import { motion } from 'motion/react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 bg-purple-50 text-purple-700 border-purple-200 text-xs font-medium"
              >
                ✦ Terpercaya oleh 500+ bisnis
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-7xl font-light mb-6"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Website profesional,{' '}
              <span className="relative inline-block">
                <span className="relative z-10">tanpa ribet</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-purple-200 -rotate-1 -z-10"></span>
              </span>
              .
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-lg mx-auto"
            >
              Dari desain hingga launch dalam hitungan hari. Website custom yang benar-benar sesuai dengan bisnis Anda.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Button asChild size="lg" className="bg-black hover:bg-gray-800">
                <Link href="/portfolio">Lihat Template</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/order">Hubungi Kami</Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-gray-500 flex items-center justify-center gap-2"
            >
              <span className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </span>
              Rated 4.9 dari 120+ ulasan
            </motion.p>
          </div>

          {/* Device Mockup with Floating Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 relative max-w-5xl mx-auto"
          >
            {/* Browser Mockup */}
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Browser Chrome */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded px-3 py-1 text-xs text-gray-500">
                    example-website.com
                  </div>
                </div>
              </div>

              {/* Website Screenshot Placeholder */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 aspect-[16/10] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🏪</div>
                  <h3 className="text-2xl font-semibold mb-2">Toko Kopi Nusantara</h3>
                  <p className="text-gray-600">Website bisnis lokal yang profesional</p>
                </div>
              </div>
            </div>

            {/* Floating Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -left-8 top-1/4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 border border-gray-100"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">SEO Ready</p>
                <p className="text-xs text-gray-500">Siap ranking di Google</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute -right-8 top-1/3 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 border border-gray-100"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Desain Custom</p>
                <p className="text-xs text-gray-500">Sesuai brand Anda</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 border border-gray-100"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Live in 7 days</p>
                <p className="text-xs text-gray-500">Cepat & tepat waktu</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
