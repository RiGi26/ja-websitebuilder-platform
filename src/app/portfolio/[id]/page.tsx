'use client'

import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Separator } from '@/app/components/ui/separator'
import { ArrowLeft, ArrowRight, ExternalLink, TrendingUp, Users, Clock } from 'lucide-react'
import { useParams } from 'next/navigation'

const projectsData: Record<string, {
  id: number; title: string; category: string; year: string; duration: string
  liveUrl: string; image: string; color: string; tags: string[]
  challenge: string; solution: string
  results: { metric: string; description: string }[]
  screenshots: { title: string; description: string }[]
  testimonial: { quote: string; author: string; role: string; company: string; avatar: string }
}> = {
  '1': {
    id: 1, title: 'Kafe Nusantara', category: 'Restoran', year: '2025', duration: '14 hari',
    liveUrl: 'https://kafenusantara.com', image: '🍽️', color: 'from-orange-100 to-red-100',
    tags: ['React', 'Tailwind CSS', 'SEO', 'Responsive'],
    challenge: 'Kafe Nusantara membutuhkan website yang modern dan mudah digunakan untuk menampilkan menu, lokasi, dan reservasi online. Website lama mereka tidak mobile-friendly dan sulit diupdate.',
    solution: 'Kami membangun website baru dengan fokus pada user experience dan mobile-first design. Integrasi dengan sistem reservasi memudahkan pelanggan untuk booking meja secara online.',
    results: [
      { metric: 'Traffic +300%', description: 'Peningkatan pengunjung website dalam 3 bulan' },
      { metric: 'Konversi +40%', description: 'Lebih banyak reservasi online' },
      { metric: 'Loading 2.1s', description: 'Waktu loading yang sangat cepat' },
    ],
    screenshots: [
      { title: 'Homepage', description: 'Landing page dengan menu unggulan' },
      { title: 'Menu', description: 'Katalog menu lengkap dengan foto' },
      { title: 'Reservasi', description: 'Form booking yang mudah digunakan' },
      { title: 'Kontak', description: 'Lokasi dan informasi kontak' },
    ],
    testimonial: {
      quote: 'Website baru kami benar-benar mengubah cara kami berinteraksi dengan pelanggan. Reservasi online meningkat drastis dan pelanggan sering memuji tampilan website yang profesional.',
      author: 'Budi Santoso', role: 'Pemilik', company: 'Kafe Nusantara', avatar: 'BS',
    },
  },
}

export default function CaseStudyPage() {
  const params = useParams()
  const id = params.id as string
  const project = projectsData[id] ?? projectsData['1']

  return (
    <div className="pt-24 pb-16">
      {/* Back Button */}
      <div className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <Button asChild variant="ghost" size="sm">
            <Link href="/portfolio">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Portofolio
            </Link>
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-5xl font-light mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <Badge variant="outline">{project.category}</Badge>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{project.year}</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4" />{project.duration}</span>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-600 hover:underline">
              <ExternalLink className="w-4 h-4" />Lihat Website Live
            </a>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="px-6 mb-16">
        <div className="max-w-5xl mx-auto">
          <div className={`w-full aspect-[16/9] rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-xl`}>
            <span className="text-9xl">{project.image}</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="px-6 mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Tantangan</h2>
              <p className="text-gray-700 leading-relaxed">{project.challenge}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Solusi</h2>
              <p className="text-gray-700 leading-relaxed">{project.solution}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 mb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">Hasil</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.results.map((result, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{result.metric}</div>
                <p className="text-sm text-gray-600">{result.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <div className="px-6 mb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.screenshots.map((screenshot, i) => (
              <div key={i}>
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-4xl mb-2">{project.image}</div>
                    <p className="text-sm text-gray-500">{screenshot.title}</p>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{screenshot.title}</h3>
                <p className="text-sm text-gray-600">{screenshot.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="px-6 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-12 relative">
            <div className="absolute top-8 left-8 text-8xl text-purple-200 font-serif leading-none">"</div>
            <div className="relative z-10">
              <p className="text-2xl font-light leading-relaxed mb-8 italic" style={{ fontFamily: "'Fraunces', serif" }}>
                {project.testimonial.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-xl">
                  {project.testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-lg">{project.testimonial.author}</p>
                  <p className="text-gray-600">{project.testimonial.role}, {project.testimonial.company}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6">
        <div className="max-w-5xl mx-auto">
          <Separator className="mb-8" />
          <div className="flex items-center justify-between">
            <Button asChild variant="outline">
              <Link href="/portfolio"><ArrowLeft className="w-4 h-4 mr-2" />Semua Proyek</Link>
            </Button>
            <Button asChild>
              <Link href={`/portfolio/${parseInt(id) + 1}`}>
                Proyek Berikutnya<ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
