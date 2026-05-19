'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import dynamic from 'next/dynamic'

// Dynamic import karena react-responsive-masonry menggunakan browser API
const MasonryGrid = dynamic(() => import('react-responsive-masonry'), { ssr: false })

import { projectsList as projects } from '@/data/portfolio'
const filters = ['Semua', 'F&B', 'Retail', 'Korporat', 'Kesehatan', 'Edukasi']

const getHeight = (size: string) => {
  switch (size) {
    case 'large': return 'h-96'
    case 'medium': return 'h-72'
    case 'small': return 'h-64'
    default: return 'h-80'
  }
}

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('semua')

  const filteredProjects =
    activeFilter === 'semua'
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase())

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
            Karya Desain & Sistem Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Eksplorasi berbagai konsep antarmuka dan sistem website modern yang siap kami implementasikan untuk bisnis Anda.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter.toLowerCase()
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <MasonryGrid columnsCount={3} gutter="1.5rem">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/portfolio/${project.id}`}>
                <div className={`relative ${getHeight(project.size)} rounded-xl overflow-hidden group cursor-pointer`}>
                  <div className={`w-full h-full bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                    <span className="text-7xl">{project.image}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs text-white/70 mb-1">{project.category}</p>
                      <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                      {project.badge && (
                        <span className="text-[10px] text-purple-200 mt-1 block">{project.badge}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </MasonryGrid>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">Tidak ada proyek dalam kategori ini</p>
          </div>
        )}
      </div>
    </div>
  )
}
