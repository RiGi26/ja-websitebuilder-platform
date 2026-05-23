'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { ExternalLink, Star, ChevronRight } from 'lucide-react'
import { templatesList } from '@/data/templates'

const categories = ['Semua', 'F&B', 'Korporat', 'Retail', 'Kesehatan', 'Edukasi', 'Blog']

export default function TemplateCatalogPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')

  const filteredTemplates = activeCategory === 'Semua'
    ? templatesList
    : templatesList.filter((t) => t.category === activeCategory)

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 bg-[#F5F5F7] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header (Apple Style) */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-apple-blue mb-4 px-3 py-1 bg-blue-50 rounded-lg">
            Design Catalog
          </span>
          <h1 className="text-4xl md:text-6xl sf-display-heavy text-[#1D1D1F] tracking-tight leading-tight mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
            Pilih Dasar <br className="hidden md:block" /> <span className="italic text-apple-blue">Website Anda</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Kumpulan blueprint desain premium yang dioptimasi untuk kecepatan tinggi dan konversi bisnis maksimal.
          </p>
        </div>

        {/* Filter Tabs (Horizontal Scroll on Mobile) */}
        <div className="flex overflow-x-auto pb-4 mb-12 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap sf-display ${
                activeCategory === cat
                  ? 'bg-apple-blue text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white text-gray-500 border border-black/5 hover:bg-gray-50 apple-shadow'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid (Optimized for Mobile/Tablet) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group flex flex-col bg-white rounded-[32px] border border-black/[0.03] apple-shadow hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Visual Preview */}
              <Link href={`/template/${template.id}`} className="block relative aspect-[4/3] overflow-hidden bg-[#F9F9FB]">
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <span className="text-7xl drop-shadow-xl">{template.image}</span>
                </div>
                {/* Device Pill Overlay */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/80 backdrop-blur-md text-[10px] font-black text-gray-900 px-3 py-1 rounded-full border border-black/5 uppercase tracking-widest">
                        {template.category}
                    </span>
                </div>
                {/* Hover Glass Overlay */}
                <div className="absolute inset-0 apple-glass opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                    <span className="bg-[#1D1D1F] text-white px-6 py-3 rounded-full text-xs font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      Lihat Review Perangkat
                    </span>
                </div>
              </Link>

              {/* Content Body */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0">
                    <h3 className="text-xl sf-display-heavy text-[#1D1D1F] leading-tight group-hover:text-apple-blue transition-colors truncate">
                        {template.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-black text-gray-900 bg-gray-50 border border-black/5 px-2 py-1 rounded-lg shrink-0">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-8 flex-1 leading-relaxed">
                  {template.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-black/5 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Investasi</span>
                    <span className="text-xl sf-display-heavy text-[#1D1D1F] tracking-tight">{template.price}</span>
                  </div>
                  <Button asChild variant="outline" className="rounded-full px-5 border-black/5 hover:bg-gray-50 transition-all sf-display text-xs">
                    <Link href={`/template/${template.id}`}>
                      Detail <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[40px] apple-shadow border border-black/5">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl sf-display-heavy text-gray-900 mb-2">Template tidak ditemukan</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Kami sedang menambahkan lebih banyak koleksi desain. Silakan hubungi kami untuk desain custom.</p>
          </div>
        )}
      </div>
    </div>
  )
}
