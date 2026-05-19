'use client'

import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { ArrowLeft, ArrowRight, TrendingUp, Clock, Layers, Quote } from 'lucide-react'
import { useParams } from 'next/navigation'
import { projectsData } from '@/data/portfolio'

export default function CaseStudyPage() {
  const params = useParams()
  const id = params.id as string
  const project = projectsData[id] ?? projectsData['1']
  const totalProjects = Object.keys(projectsData).length
  const currentId = parseInt(id)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky Top Bar */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-gray-600 hover:text-black">
            <Link href="/portfolio">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Karya Kami</span>
              <span className="sm:hidden">Kembali</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span>{currentId} / {totalProjects}</span>
            <div className="flex gap-1">
              {currentId > 1 && (
                <Link href={`/portfolio/${currentId - 1}`} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <ArrowLeft className="w-3 h-3" />
                </Link>
              )}
              {currentId < totalProjects && (
                <Link href={`/portfolio/${currentId + 1}`} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="mb-8">
          {project.badge && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500 mb-3">
              {project.badge}
            </p>
          )}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-light mb-5 leading-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="font-semibold">{project.category}</Badge>
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="w-3.5 h-3.5" />{project.year}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Layers className="w-3.5 h-3.5" />Selesai dalam {project.duration}
            </span>
          </div>
        </div>

        {/* ── HERO VISUAL ───────────────────────────────────────── */}
        <div className={`w-full aspect-[16/8] sm:aspect-[16/7] rounded-2xl sm:rounded-3xl bg-gradient-to-br ${project.color} flex items-center justify-center mb-10 shadow-lg overflow-hidden`}>
          <span className="text-8xl sm:text-9xl">{project.image}</span>
        </div>

        {/* ── TAGS ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-medium">{tag}</Badge>
          ))}
        </div>

        {/* ── CHALLENGE & SOLUTION ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <span className="text-base">🎯</span>
              </div>
              <h2 className="text-base font-bold text-gray-900">Tantangan Bisnis</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{project.challenge}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <span className="text-base">💡</span>
              </div>
              <h2 className="text-base font-bold text-gray-900">Solusi yang Kami Bangun</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{project.solution}</p>
          </div>
        </div>

        {/* ── RESULTS ──────────────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" /> Hasil yang Dicapai
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.results.map((result, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-purple-200 hover:shadow-md transition-all">
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                  {result.metric}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{result.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SCREENSHOTS ──────────────────────────────────────── */}
        {project.screenshots.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Halaman yang Dibangun</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.screenshots.map((screenshot, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`aspect-video bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{project.image}</div>
                      <p className="text-xs text-gray-600 font-medium bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
                        {screenshot.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{screenshot.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{screenshot.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TESTIMONIAL ──────────────────────────────────────── */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl sm:rounded-3xl p-7 sm:p-10 relative overflow-hidden">
            <div className="absolute top-5 right-6 text-white/10">
              <Quote className="w-20 h-20" />
            </div>
            <div className="relative z-10">
              <p className="text-white text-base sm:text-xl font-light leading-relaxed mb-8 italic" style={{ fontFamily: "'Fraunces', serif" }}>
                &ldquo;{project.testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {project.testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{project.testimonial.author}</p>
                  <p className="text-purple-200 text-xs">{project.testimonial.role} · {project.testimonial.company}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center mb-10">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Tertarik dengan sistem seperti ini?
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Tim kami bisa implementasikan untuk bisnis Anda. Konsultasi gratis, harga transparan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-black hover:bg-gray-800 text-white">
              <Link href="/order">Konsultasi Gratis →</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/template">Lihat Katalog Template</Link>
            </Button>
          </div>
        </div>

        {/* ── NAVIGATION ───────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          {currentId > 1 ? (
            <Button asChild variant="outline" className="gap-2">
              <Link href={`/portfolio/${currentId - 1}`}>
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Proyek Sebelumnya</span>
                <span className="sm:hidden">Sebelumnya</span>
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {currentId < totalProjects && (
            <Button asChild className="gap-2 bg-black hover:bg-gray-800 ml-auto">
              <Link href={`/portfolio/${currentId + 1}`}>
                <span className="hidden sm:inline">Proyek Berikutnya</span>
                <span className="sm:hidden">Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}
