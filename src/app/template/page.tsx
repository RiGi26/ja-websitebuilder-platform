'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { ExternalLink, Star } from 'lucide-react'
import { templatesList } from '@/data/templates'

const categories = ['Semua', 'F&B', 'Korporat', 'Retail', 'Kesehatan', 'Edukasi', 'Blog']

export default function TemplateCatalogPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')

  const filteredTemplates = activeCategory === 'Semua'
    ? templatesList
    : templatesList.filter((t) => t.category === activeCategory)

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
            Katalog Desain
          </Badge>
          <h1 className="text-5xl font-light mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
            Pilih Template Impian Anda
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mulai lebih cepat dengan template premium berbasis open-source yang sudah dioptimasi untuk kecepatan dan SEO.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Preview Image/Icon */}
              <Link href={`/template/${template.id}`} className="block">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border-b border-gray-100 relative overflow-hidden">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{template.image}</span>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Lihat Detail
                    </span>
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Badge variant="secondary" className="mb-2">{template.category}</Badge>
                    <Link href={`/template/${template.id}`}>
                      <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                        {template.title}
                      </h3>
                    </Link>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">
                  {template.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div>
                    <p className="text-xs text-gray-400 line-through">{template.originalPrice}</p>
                    <p className="text-lg font-bold text-gray-900">{template.price}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={template.demoUrl} target="_blank" rel="noopener noreferrer">
                      Demo <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <span className="text-4xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold mb-2">Template tidak ditemukan</h3>
            <p className="text-gray-500">Belum ada template untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  )
}
