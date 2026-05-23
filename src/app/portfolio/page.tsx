'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { projectsList as projects } from '@/data/portfolio'

const filters = ['Semua', 'F&B', 'Retail', 'Korporat', 'Kesehatan', 'Edukasi']

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('semua')

  const filteredProjects =
    activeFilter === 'semua'
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase())

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100 pt-28 pb-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-apple-blue mb-4">
            Karya & Demo Sistem
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-light mb-5 leading-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Apa yang Bisa Kami
            <br />
            <span className="text-apple-blue">Bangun untuk Anda</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Kumpulan konsep desain dan sistem yang mendemonstrasikan kemampuan tim kami di berbagai industri.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeFilter === filter.toLowerCase()
                  ? 'bg-black text-white border-black shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <Link href={`/portfolio/${project.id}`} className="group block">
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-apple-blue/30 transition-all duration-300">

                    {/* Visual Preview */}
                    <div className={`relative h-52 bg-gradient-to-br ${project.color} flex items-center justify-center overflow-hidden`}>
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                        {project.image}
                      </span>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-white text-black text-sm font-bold px-5 py-2 rounded-full flex items-center gap-2">
                          Lihat Detail <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      {/* Category pill on image */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      {project.badge && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-apple-blue mb-1.5">
                          {project.badge}
                        </p>
                      )}
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-apple-blue transition-colors mb-3 leading-snug">
                        {project.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">Klik untuk lihat studi kasus →</span>
                        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                          <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-apple-blue" />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold mb-2">Belum ada proyek di kategori ini</h3>
            <p className="text-gray-500 text-sm">Segera hadir! Hubungi kami untuk diskusi kebutuhan Anda.</p>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 to-blue-900 rounded-[32px] p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-apple-blue opacity-20 rounded-full blur-3xl"></div>
          <h2 className="text-2xl sm:text-3xl sf-display-heavy mb-3 relative z-10">
            Siap bangun website impian Anda?
          </h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto text-sm sm:text-base relative z-10">
            Tim kami siap mengimplementasikan sistem serupa untuk bisnis Anda. Konsultasi gratis, tanpa komitmen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
            <Link
              href="https://wa.me/6281296917963?text=Halo%20Japan%20Arena%20Studio%2C%20saya%20tertarik%20dengan%20layanan%20pembuatan%20website."
              className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm"
            >
              Konsultasi Gratis Sekarang →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
