'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  getAnalyticsConsent,
  loadAnalytics,
  subscribeAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent as ConsentValue,
} from '@/lib/analytics'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()

export default function AnalyticsConsent() {
  const consent = useSyncExternalStore(subscribeAnalyticsConsent, getAnalyticsConsent, () => null)
  const [showPreferences, setShowPreferences] = useState(false)

  useEffect(() => {
    if (consent === 'granted') loadAnalytics(GA_MEASUREMENT_ID)
  }, [consent])

  const saveConsent = (nextConsent: ConsentValue) => {
    setAnalyticsConsent(nextConsent)
    setShowPreferences(false)
  }

  const visible = consent === null || showPreferences

  return (
    <>
      {visible ? (
        <section
          role="dialog"
          aria-labelledby="analytics-consent-title"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-5 shadow-2xl md:inset-x-auto md:right-6 md:w-[min(42rem,calc(100vw-3rem))]"
        >
          <h2 id="analytics-consent-title" className="text-base font-bold text-gray-900">
            Pilihan analitik
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Kami memakai analitik untuk memahami penggunaan halaman dan alur template agar pengalaman Webzoka dapat diperbaiki. Analitik tidak menerima isi draft, nama, nomor WhatsApp, pesan, token, atau user-ID. Pilihan ini dapat diubah kapan saja.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Detailnya ada di <a className="font-semibold text-blue-700 underline" href="https://www.webzoka.com/kebijakan-privasi/">Kebijakan Privasi</a>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => saveConsent('granted')} className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">
              Terima analitik
            </button>
            <button type="button" onClick={() => saveConsent('denied')} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Tolak
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setShowPreferences(true)}
          className="fixed bottom-4 left-4 z-[90] rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-lg hover:bg-gray-50"
        >
          Pengaturan privasi
        </button>
      )}
    </>
  )
}
