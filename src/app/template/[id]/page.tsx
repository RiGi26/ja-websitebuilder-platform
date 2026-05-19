'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Separator } from '@/app/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import { Monitor, Tablet, Smartphone, Star, Check, FileText, Headphones, Palette, Zap, ExternalLink } from 'lucide-react'

import { templatesData } from '@/data/templates'
import { notFound, useParams } from 'next/navigation'

const features = ['5 halaman termasuk', 'Form kontak', 'SEO setup', 'Hosting gratis 1 tahun']
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
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Area */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Button variant={device === 'desktop' ? 'default' : 'outline'} size="sm" onClick={() => setDevice('desktop')}>
                <Monitor className="w-4 h-4 mr-2" />Desktop
              </Button>
              <Button variant={device === 'tablet' ? 'default' : 'outline'} size="sm" onClick={() => setDevice('tablet')}>
                <Tablet className="w-4 h-4 mr-2" />Tablet
              </Button>
              <Button variant={device === 'mobile' ? 'default' : 'outline'} size="sm" onClick={() => setDevice('mobile')}>
                <Smartphone className="w-4 h-4 mr-2" />Mobile
              </Button>
            </div>

            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[600px]">
              <div className={`bg-white rounded-lg shadow-xl transition-all duration-300 ${
                device === 'desktop' ? 'w-full aspect-[16/10]' :
                device === 'tablet' ? 'w-2/3 aspect-[4/3]' : 'w-1/3 aspect-[9/16]'
              }`}>
                <iframe 
                  src={template.demoUrl} 
                  className="w-full h-full rounded-lg border-none bg-white"
                  title={`Preview ${template.title}`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>



            {/* Specs */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Spesifikasi Teknis</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Platform:</span><span className="ml-2 font-medium">{template.platform}</span></div>
                <div><span className="text-gray-500">Halaman:</span><span className="ml-2 font-medium">{template.pages}</span></div>
                <div><span className="text-gray-500">Kategori:</span><span className="ml-2 font-medium">{template.category}</span></div>
                <div><span className="text-gray-500">Support:</span><span className="ml-2 font-medium">24/7</span></div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Ulasan</h3>
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div key={i} className="bg-white border rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-semibold text-purple-600">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.name}</p>
                            <p className="text-sm text-gray-500">{review.role}</p>
                          </div>
                          <div className="flex text-yellow-400">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                {template.title}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(Math.floor(template.rating))].map((_, i) => (<Star key={i} className="w-4 h-4 fill-current" />))}
                </div>
                <span className="text-sm text-gray-500">({template.reviewCount} ulasan)</span>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{template.price}</span>
                  <span className="text-gray-500 line-through">{template.originalPrice}</span>
                </div>
              </div>
              <div className="mb-6 space-y-2">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 mb-6">
                <Button asChild className="w-full bg-black hover:bg-gray-800">
                  <Link href={`/order?template=${template.id}`}>Pilih Template Ini</Link>
                </Button>
                <Button asChild variant="outline" className="w-full gap-2">
                  <a href={template.demoUrl} target="_blank" rel="noopener noreferrer">
                    Lihat Demo Live <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
              <Separator className="my-6" />
              <div>
                <h4 className="font-semibold mb-4">Termasuk:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {included.map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="my-6" />
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Butuh custom?</p>
                <Link href="/order" className="text-sm text-purple-600 hover:underline font-medium">
                  Hubungi untuk layanan custom →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
