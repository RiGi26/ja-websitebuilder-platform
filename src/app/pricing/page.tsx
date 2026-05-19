'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Switch } from '@/app/components/ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion'
import { Check, X } from 'lucide-react'

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'STARTER',
      title: 'Paket Starter',
      description: 'Untuk bisnis yang baru mulai',
      priceMonthly: 1500000,
      priceYearly: 14400000,
      featured: false,
      features: [
        { name: '3 halaman website', included: true },
        { name: 'Desain responsif', included: true },
        { name: 'Form kontak', included: true },
        { name: 'SEO basic', included: true },
        { name: 'Hosting 6 bulan', included: true },
        { name: 'Domain gratis', included: false },
        { name: 'E-commerce', included: false },
        { name: 'Custom backend', included: false },
      ],
    },
    {
      name: 'BISNIS',
      title: 'Paket Bisnis',
      description: 'Paling populer untuk bisnis berkembang',
      priceMonthly: 2500000,
      priceYearly: 24000000,
      featured: true,
      features: [
        { name: '5 halaman website', included: true },
        { name: 'Desain responsif', included: true },
        { name: 'Form kontak', included: true },
        { name: 'SEO advanced', included: true },
        { name: 'Hosting 1 tahun', included: true },
        { name: 'Domain gratis', included: true },
        { name: 'E-commerce basic', included: true },
        { name: 'Custom backend', included: false },
      ],
    },
    {
      name: 'KUSTOM',
      title: 'Paket Kustom',
      description: 'Solusi enterprise untuk bisnis besar',
      priceMonthly: null,
      priceYearly: null,
      featured: false,
      features: [
        { name: 'Unlimited halaman', included: true },
        { name: 'Desain responsif', included: true },
        { name: 'Form kontak', included: true },
        { name: 'SEO advanced', included: true },
        { name: 'Hosting unlimited', included: true },
        { name: 'Domain gratis', included: true },
        { name: 'E-commerce advanced', included: true },
        { name: 'Custom backend', included: true },
      ],
    },
  ]

  const faqs = [
    {
      question: 'Berapa lama proses pembuatan website?',
      answer: 'Rata-rata 5-7 hari kerja untuk paket Starter dan Bisnis. Untuk paket Kustom, timeline disesuaikan dengan kompleksitas proyek.',
    },
    {
      question: 'Apakah saya bisa mengubah paket di kemudian hari?',
      answer: 'Ya, Anda bisa upgrade atau downgrade paket kapan saja. Tim kami akan membantu proses migrasi.',
    },
    {
      question: 'Apa yang terjadi setelah masa hosting habis?',
      answer: 'Anda akan menerima notifikasi sebelum masa hosting habis dan bisa melakukan perpanjangan dengan harga spesial untuk klien existing.',
    },
    {
      question: 'Apakah ada biaya tersembunyi?',
      answer: 'Tidak ada biaya tersembunyi. Semua yang tertera di paket sudah termasuk dalam harga. Biaya tambahan hanya untuk add-on yang Anda minta.',
    },
  ]

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-purple-50 text-purple-700">
            Transparan, tanpa biaya tersembunyi
          </Badge>
          <h1 className="text-5xl font-light mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
            Pilih Paket yang Tepat
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Investasi terbaik untuk bisnis Anda. Semua paket sudah termasuk maintenance dan support.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={!isYearly ? 'font-semibold' : 'text-gray-500'}>Bayar Bulanan</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={isYearly ? 'font-semibold' : 'text-gray-500'}>Bayar Tahunan</span>
          {isYearly && (
            <Badge className="bg-green-100 text-green-700 border-green-200">Hemat 20%</Badge>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-xl p-8 ${
                plan.featured
                  ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 shadow-xl'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              {plan.featured && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white">
                  Paling Populer
                </Badge>
              )}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">{plan.name}</p>
                <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
              <div className="mb-6">
                {plan.priceMonthly ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        {formatPrice(isYearly ? plan.priceYearly! / 12 : plan.priceMonthly)}
                      </span>
                      <span className="text-gray-500">/bulan</span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-gray-500 mt-1">
                        Dibayar {formatPrice(plan.priceYearly!)} per tahun
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-2xl font-semibold">Hubungi Sales</div>
                )}
              </div>
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                asChild
                className={`w-full ${
                  plan.featured
                    ? 'bg-black hover:bg-gray-800'
                    : 'bg-white text-black border-2 border-black hover:bg-gray-50'
                }`}
              >
                <Link href="/order">
                  {plan.priceMonthly ? 'Pilih Paket' : 'Hubungi Sales'}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8" style={{ fontFamily: "'Fraunces', serif" }}>
            Pertanyaan Umum
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Masih ada pertanyaan?</p>
            <Button asChild variant="outline">
              <Link href="/order">Hubungi Kami</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
