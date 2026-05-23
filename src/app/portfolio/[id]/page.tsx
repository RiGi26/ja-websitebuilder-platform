'use client'

import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { ArrowLeft, ArrowRight, TrendingUp, Clock, Layers, Quote, Home, ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import { projectsData } from '@/data/portfolio'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function CaseStudyPage() {
  const params = useParams()
  const id = params.id as string
  const project = projectsData[id] ?? projectsData['1']
  const totalProjects = Object.keys(projectsData).length
  const currentId = parseInt(id)

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Navigation Breadcrumb (Apple Style) */}
          <div className="flex items-center gap-3 mb-10 animate-fade-in px-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <Link href="/" className="text-gray-400 hover:text-apple-blue transition-colors flex items-center gap-1.5 group">
                  <Home size={14} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Studio</span>
              </Link>
              <ChevronRight size={10} className="text-gray-300" />
              <Link href="/portfolio" className="text-gray-400 hover:text-apple-blue transition-colors flex items-center gap-1.5 group">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Karya Kami</span>
              </Link>
              <ChevronRight size={10} className="text-gray-300" />
              <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-apple-blue uppercase tracking-widest">{project.title}</span>
              </div>
          </div>

          {/* ── HEADER ─────────────────────────────────────────────── */}
          <div className="mb-8">
            {project.badge && (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-apple-blue mb-3">
                {project.badge}
              </p>
            )}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-5 leading-tight sf-display-heavy"
            >
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="font-semibold bg-white apple-shadow">{project.category}</Badge>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5" />{project.year}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Layers className="w-3.5 h-3.5" />Selesai dalam {project.duration}
              </span>
            </div>
          </div>

          {/* ── HERO VISUAL ───────────────────────────────────────── */}
          <div className={`w-full aspect-[16/8] sm:aspect-[16/7] rounded-[32px] bg-gradient-to-br ${project.color} flex items-center justify-center mb-10 apple-shadow border border-black/[0.03] overflow-hidden`}>
            <span className="text-8xl sm:text-9xl drop-shadow-2xl">{project.image}</span>
          </div>

          {/* ── TAGS ─────────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2 mb-10">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-bold bg-white border border-black/[0.03] apple-shadow px-3 py-1 rounded-full">{tag}</Badge>
            ))}
          </div>

          {/* ── CHALLENGE & SOLUTION ─────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-[32px] border border-black/[0.03] p-8 apple-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-xl">
                  🎯
                </div>
                <h2 className="text-lg font-black text-gray-900 sf-display">Tantangan Bisnis</h2>
              </div>
              <p className="text-gray-500 leading-relaxed">{project.challenge}</p>
            </div>
            <div className="bg-white rounded-[32px] border border-black/[0.03] p-8 apple-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-xl">
                  💡
                </div>
                <h2 className="text-lg font-black text-gray-900 sf-display">Solusi yang Kami Bangun</h2>
              </div>
              <p className="text-gray-500 leading-relaxed">{project.solution}</p>
            </div>
          </div>

          {/* ── RESULTS ──────────────────────────────────────────── */}
          <div className="mb-10">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 sf-display px-1">
              <TrendingUp className="w-6 h-6 text-apple-blue" /> Hasil yang Dicapai
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {project.results.map((result, i) => (
                <div key={i} className="bg-white border border-black/[0.03] rounded-[32px] p-8 text-center apple-shadow group hover:-translate-y-1 transition-all">
                  <div className="text-3xl sm:text-4xl font-black text-apple-blue mb-2 tracking-tight sf-display tabular-nums">
                    {result.metric}
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{result.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── SCREENSHOTS ──────────────────────────────────────── */}
          {project.screenshots.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-black text-gray-900 mb-6 sf-display px-1">Halaman yang Dibangun</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.screenshots.map((screenshot, i) => (
                  <div key={i} className="bg-white border border-black/[0.03] rounded-[32px] overflow-hidden apple-shadow group">
                    <div className={`aspect-video bg-gradient-to-br ${project.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                      <div className="text-center">
                        <div className="text-5xl mb-2">{project.image}</div>
                        <p className="text-[10px] font-bold text-gray-600 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full uppercase tracking-widest">
                          {screenshot.title}
                        </p>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="font-black text-gray-900 text-base mb-2 sf-display">{screenshot.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{screenshot.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TESTIMONIAL ──────────────────────────────────────── */}
          <div className="mb-10">
            <div className="bg-[#1D1D1F] rounded-[40px] p-10 md:p-14 relative overflow-hidden shadow-2xl">
              <div className="absolute top-10 right-10 text-white/5">
                <Quote className="w-32 h-32" />
              </div>
              <div className="relative z-10 max-w-3xl">
                <p className="text-white text-xl md:text-2xl font-medium leading-relaxed mb-10 italic" style={{ fontFamily: "'Fraunces', serif" }}>
                  &ldquo;{project.testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-apple-blue flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg shadow-blue-500/20">
                    {project.testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-black text-white text-lg sf-display">{project.testimonial.author}</p>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{project.testimonial.role} · {project.testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CTA ──────────────────────────────────────────────── */}
          <div className="bg-white border border-black/[0.03] rounded-[40px] p-10 md:p-16 text-center mb-16 apple-shadow">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 sf-display-heavy">
              Siap membangun sistem serupa?
            </h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">
              Tim kami siap membantu implementasi website bisnis Anda dengan standar teknologi terbaru.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#1D1D1F] hover:bg-black text-white rounded-2xl px-10 h-14 sf-display-heavy shadow-xl glow-button">
                <Link href="/order">Mulai Konsultasi Sekarang</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl border-black/5 hover:bg-gray-50 h-14 px-10 text-gray-500 font-bold">
                <Link href="/template">Lihat Katalog Template</Link>
              </Button>
            </div>
          </div>

          {/* ── NAVIGATION ───────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4 border-t border-black/5 pt-10">
            {currentId > 1 ? (
              <Link href={`/portfolio/${currentId - 1}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-white group-hover:apple-shadow transition-all">
                  <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-apple-blue" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sebelumnya</p>
                  <p className="text-sm font-bold text-gray-900">Project {currentId - 1}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            
            <div className="flex items-center gap-1.5">
               {[...Array(totalProjects)].map((_, i) => (
                 <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${currentId === i+1 ? 'w-4 bg-apple-blue' : 'bg-gray-200'}`} />
               ))}
            </div>

            {currentId < totalProjects && (
              <Link href={`/portfolio/${currentId + 1}`} className="flex items-center gap-3 group text-right">
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Berikutnya</p>
                  <p className="text-sm font-bold text-gray-900">Project {currentId + 1}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-white group-hover:apple-shadow transition-all">
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-apple-blue" />
                </div>
              </Link>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
