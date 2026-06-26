'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

const addons = [
  { id: 'blog', name: 'Blog / Artikel', price: 99000, yearlyMaint: 50000 },
  { id: 'shop', name: 'Online Shop', price: 299000, yearlyMaint: 199000 },
  { id: 'admin', name: 'Dashboard Admin', price: 199000, yearlyMaint: 99000 },
  { id: 'member', name: 'Login Member', price: 199000, yearlyMaint: 99000 },
  { id: 'lms', name: 'LMS / E-learning', price: 399000, yearlyMaint: 299000 },
  { id: 'quiz', name: 'Quiz Online', price: 249000, yearlyMaint: 99000 },
  { id: 'portal', name: 'Portal Siswa', price: 299000, yearlyMaint: 149000 },
  { id: 'gsheets', name: 'Google Sheets Integration', price: 149000, yearlyMaint: 49000 },
  { id: 'midtrans', name: 'Midtrans Payment', price: 299000, yearlyMaint: 99000 },
  { id: 'wa', name: 'WhatsApp Automation', price: 199000, yearlyMaint: 99000 },
  { id: 'invoice', name: 'Invoice Automation', price: 199000, yearlyMaint: 99000 },
  { id: 'seo', name: 'SEO Optimization', price: 149000, yearlyMaint: 49000 },
  { id: 'booking', name: 'Booking System', price: 249000, yearlyMaint: 99000 },
  { id: 'chat', name: 'Live Chat', price: 99000, yearlyMaint: 49000 },
]

export default function PricingCalculatorPage() {
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())

  const basePrice = 499000
  const baseYearly = 499000

  const handleToggle = (id: string) => {
    const newSelected = new Set(selectedAddons)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedAddons(newSelected)
  }

  // Calculate totals
  let totalFirstYear = basePrice
  let totalYearlyMaint = baseYearly

  selectedAddons.forEach((id) => {
    const addon = addons.find((a) => a.id === id)
    if (addon) {
      totalFirstYear += addon.price
      totalYearlyMaint += addon.yearlyMaint
    }
  })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-6 bg-[#f4f7fb]">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-10 md:p-14 rounded-[34px] text-white mb-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium mb-6">
                Webzoka Studio
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Smart Website Pricing Calculator
              </h1>
              <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
                Hitung estimasi biaya website sesuai kebutuhan Anda. 
                Harga tahun pertama sudah termasuk setup, development website, domain, hosting, dan maintenance basic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (Options) */}
            <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[30px] shadow-sm">
              
              {/* Base Package Info */}
              <div className="bg-slate-50 border border-blue-100 p-8 rounded-3xl mb-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Paket Hemat — {formatPrice(basePrice)} / Tahun Pertama</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-600" /> Setup website</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-600" /> Pembuatan website modern basic</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-600" /> Domain</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-600" /> Hosting</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-600" /> SSL / HTTPS</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-600" /> Mobile friendly</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-600" /> Maintenance basic</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-600" /> Support revisi minor</li>
                </ul>
              </div>

              <h2 className="text-2xl font-extrabold mb-6 text-slate-900">Pilih Fitur Tambahan (Add-on)</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addons.map((addon) => {
                  const isSelected = selectedAddons.has(addon.id)
                  return (
                    <label
                      key={addon.id}
                      className={`cursor-pointer border-2 rounded-2xl p-5 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={isSelected}
                            onChange={() => handleToggle(addon.id)}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">{addon.name}</h4>
                          <div className="text-blue-600 font-bold mb-1">+ {formatPrice(addon.price)}</div>
                          <div className="text-sm text-slate-500">+ {formatPrice(addon.yearlyMaint)}/tahun maintenance</div>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Right Column (Summary Sticky) */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-28">
                
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-[30px] shadow-xl shadow-blue-900/20 mb-6">
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Tahun Pertama</p>
                  <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
                    {formatPrice(totalFirstYear)}
                  </div>
                  <p className="text-sm text-blue-200 mb-8 border-b border-white/20 pb-6">
                    Sudah termasuk setup + website + domain + hosting + maintenance
                  </p>

                  <p className="text-blue-100 text-sm font-medium mb-1">Estimasi Tahun Kedua & Seterusnya</p>
                  <div className="text-2xl font-bold mb-2">
                    {formatPrice(totalYearlyMaint)} <span className="text-lg font-normal">/ tahun</span>
                  </div>
                  <p className="text-sm text-blue-200 mb-6 border-b border-white/20 pb-6">
                    Hosting + domain + maintenance fitur
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm items-center py-2 border-b border-white/10 border-dashed">
                      <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Paket Website Hemat</span>
                      <span className="font-semibold">{formatPrice(basePrice)}</span>
                    </div>
                    {addons.filter(a => selectedAddons.has(a.id)).map(addon => (
                      <div key={addon.id} className="flex justify-between text-sm items-center py-2 border-b border-white/10 border-dashed">
                        <span className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-300" /> {addon.name}</span>
                        <span className="font-semibold">+ {formatPrice(addon.price)}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-14 text-base font-bold">
                    <Link href="/order">Ajukan Konsultasi Sekarang</Link>
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-sm text-blue-900 leading-relaxed">
                  <strong className="block mb-3 text-base">Informasi Penting:</strong>
                  <ul className="space-y-3 pl-4 list-disc marker:text-blue-400">
                    <li><strong>Tahun pertama mencakup:</strong> Setup website, Development, Domain, Hosting, Maintenance basic.</li>
                    <li><strong>Tahun kedua dan seterusnya hanya dikenakan biaya:</strong> Hosting, Domain, Maintenance fitur aktif.</li>
                    <li>Maintenance fitur dikenakan bervariasi antara {formatPrice(49000)} hingga {formatPrice(299000)} / tahun tergantung fitur dan penggunaan kapasitas penyimpanan (storage).</li>
                    <li>Harga di atas merupakan estimasi awal dan berlaku khusus untuk pengerjaan <strong>Berbasis Template</strong>.</li>
                    <li>Jika Anda mengajukan referensi website manual dengan <strong>Desain/Fitur Custom yang kompleks</strong>, harga final akan dihitung ulang dan disesuaikan saat konsultasi via WhatsApp.</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
