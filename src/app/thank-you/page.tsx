'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, MessageCircle, ArrowRight, Clock, Phone, Layers, ClipboardList } from 'lucide-react'
import Navbar from '@/app/components/Navbar'

const REDIRECT_DELAY_SECONDS = 5

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281296917963'

const NEXT_STEPS = [
  {
    icon: MessageCircle,
    time: 'Sekarang — otomatis',
    title: 'Cek WhatsApp Anda',
    desc: 'Link form briefing dikirim ke nomor WA Anda. Isi dalam 1×24 jam agar website segera diproses.',
  },
  {
    icon: Layers,
    time: 'Setelah briefing masuk',
    title: 'Tim membangun website',
    desc: 'Kami kerjakan berdasarkan data briefing Anda. Tidak perlu video call — semua via form.',
  },
  {
    icon: Clock,
    time: '3–5 hari kerja',
    title: 'Website live & URL dikirim',
    desc: 'URL website dikirim via WhatsApp. Pelunasan dilakukan sebelum go-live.',
  },
]

export default function ThankYouPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [displayId, setDisplayId] = useState<string | null>(null)
  const [dpAmount, setDpAmount] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [countdown, setCountdown] = useState(REDIRECT_DELAY_SECONDS)
  const [autoRedirect, setAutoRedirect] = useState(true)
  const [isPelunasan, setIsPelunasan] = useState(false)
  const [briefingToken, setBriefingToken] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // 3 sumber orderId, urutan prioritas:
    //   1. ?id=UUID            → dari callbacks.finish API (CC, VA, QRIS)
    //   2. ?order_id=JA-...-DP → dari Midtrans dashboard default redirect
    //   3. sessionStorage      → fallback untuk GoPay/ShopeePay mobile yang
    //                            sering kehilangan query string saat app deep link
    const idFromUrl = params.get('id')
    const midtransOrderId = params.get('order_id')

    let resolvedOrderId: string | null = null
    let resolvedDisplayId: string | null = null
    let resolvedIsPelunasan = false
    let resolvedToken: string | null = null

    if (idFromUrl) {
      resolvedOrderId = idFromUrl
    } else if (midtransOrderId) {
      // Cek apakah ini pembayaran pelunasan berdasarkan suffix -LUNAS atau param lain
      if (midtransOrderId.toUpperCase().endsWith('-LUNAS')) {
          resolvedIsPelunasan = true;
          const parts = midtransOrderId.replace(/-LUNAS$/i, '').split('-')
          resolvedOrderId = parts[2]?.toLowerCase() ?? null
          resolvedDisplayId = midtransOrderId.replace(/-LUNAS$/i, '')
      } else {
          const parts = midtransOrderId.replace(/-DP$/i, '').split('-')
          resolvedOrderId = parts[2]?.toLowerCase() ?? null
          resolvedDisplayId = midtransOrderId.replace(/-DP$/i, '')
      }
    }

    const pending = sessionStorage.getItem('ja_pending_order')
    if (pending) {
      try {
        const parsed = JSON.parse(pending)
        resolvedDisplayId = resolvedDisplayId || parsed.display_id
        setDpAmount(parsed.dp_amount || parsed.pelunasan_amount || parsed.amount) // Support different amount keys

        // Check if it's pelunasan from session storage
        if (parsed.is_pelunasan || (parsed.display_id && parsed.display_id.toUpperCase().includes('LUNAS'))) {
            resolvedIsPelunasan = true;
        }

        // Fallback: kalau URL tidak punya id (kasus GoPay mobile), pakai sessionStorage
        if (!resolvedOrderId && parsed.order_id) {
          resolvedOrderId = parsed.order_id
        }

        // Kunci form briefing (dibawa dari halaman order) → jalur in-app ke brief.
        if (parsed.tracking_token) resolvedToken = parsed.tracking_token

        // Trigger payment confirm (backup to webhook)
        if (parsed.order_id && parsed.display_id) {
          const suffix = resolvedIsPelunasan ? '-LUNAS' : '-DP';
          fetch('/api/payment/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: parsed.order_id,
              midtrans_order_id: `${parsed.display_id}${suffix}`,
            }),
          }).catch(() => {})
        }
        sessionStorage.removeItem('ja_pending_order')
      } catch {}
    }

    // Fallback token dari localStorage (browser sama, bertahan reload/hard refresh).
    if (!resolvedToken) {
      try {
        const last = localStorage.getItem('ja_last_order')
        if (last) {
          const p = JSON.parse(last)
          if (p.tracking_token && (!resolvedOrderId || p.order_id === resolvedOrderId)) {
            resolvedToken = p.tracking_token
            if (!resolvedOrderId && p.order_id) resolvedOrderId = p.order_id
          }
        }
      } catch {}
    }

    if (resolvedOrderId) setOrderId(resolvedOrderId)
    if (resolvedDisplayId) setDisplayId(resolvedDisplayId)
    setIsPelunasan(resolvedIsPelunasan)
    if (resolvedToken) setBriefingToken(resolvedToken)

    setMounted(true)
  }, [])

  // Auto-redirect ke /track setelah countdown — berlaku untuk SEMUA metode pembayaran
  // (CC, VA, QRIS, E-Wallet, BNPL) karena Midtrans callbacks.finish selalu kirim ke sini.
  // router.replace() supaya tombol back tidak balik ke thank-you yang state-nya sudah kosong.
  useEffect(() => {
    if (!mounted || !orderId || !autoRedirect) return

    if (countdown <= 0) {
      // Bawa token kalau ada → banner "Isi Form Briefing" tampil di /track
      // (tanpa token, IDOR-hardening menyembunyikannya).
      router.replace(briefingToken ? `/track?id=${orderId}&token=${briefingToken}` : `/track?id=${orderId}`)
      return
    }

    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [mounted, orderId, countdown, autoRedirect, briefingToken, router])

  const trackUrl = orderId
    ? (briefingToken ? `/track?id=${orderId}&token=${briefingToken}` : `/track?id=${orderId}`)
    : '/track'
  // orderId may be a shortId (8-char) or full UUID — /track handles both via ilike

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-lg mx-auto">

          {/* Status Card — benchmark: Shopee order confirmed card */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-black/[0.04] mb-4">
            {/* Green header strip */}
            <div className="bg-green-500 px-8 py-7 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={26} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-lg leading-tight">Pembayaran Berhasil!</p>
                <p className="text-green-100 text-sm font-medium mt-0.5">
                  {isPelunasan ? 'Pelunasan project Anda telah kami terima.' : 'DP project Anda telah kami terima.'}
                </p>
              </div>
            </div>

            {/* Order detail rows — benchmark: Tokopedia detail pesanan */}
            <div className="px-8 py-6 divide-y divide-gray-50">
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-500">Nomor Order</span>
                <span className="text-sm font-black text-[#1D1D1F] tracking-wide">
                  {displayId ?? (orderId ? `JA-${new Date().getFullYear()}-${orderId.slice(0, 8).toUpperCase()}` : '—')}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-500">Jenis Pembayaran</span>
                <span className="text-sm font-bold text-[#1D1D1F]">
                  {isPelunasan ? 'Pelunasan (Lunas)' : 'DP 50%'}
                </span>
              </div>
              {dpAmount && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-500">Jumlah Dibayar</span>
                  <span className="text-sm font-black text-green-600">
                    Rp {dpAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-500">Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                  Sedang Diproses
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps — benchmark: Traveloka "Yang perlu kamu lakukan" */}
          <div className="bg-white rounded-[32px] px-8 py-7 shadow-sm border border-black/[0.04] mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-5">Selanjutnya</p>
            <div className="space-y-6">
              {NEXT_STEPS.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <step.icon size={16} className="text-gray-500" />
                    </div>
                    {i < NEXT_STEPS.length - 1 && (
                      <div className="w-px h-full min-h-[20px] bg-gray-100" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{step.time}</p>
                    <p className="text-sm font-bold text-[#1D1D1F]">{step.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info note — benchmark: Shopee "Simpan bukti pembayaran" notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-6">
            <p className="text-xs text-blue-700 leading-relaxed">
              <span className="font-bold">Simpan nomor order Anda.</span> Gunakan nomor ini untuk melacak progress dan mengajukan pertanyaan ke tim kami.
            </p>
          </div>

          {/* Auto-redirect countdown banner — muncul hanya jika orderId valid & auto-redirect aktif */}
          {orderId && autoRedirect && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-3 flex items-center justify-between gap-3">
              <p className="text-xs text-blue-700 leading-relaxed">
                Mengalihkan ke halaman pelacakan dalam <span className="font-black">{countdown}</span> detik...
              </p>
              <button
                onClick={() => setAutoRedirect(false)}
                className="text-xs text-blue-700 font-bold hover:underline shrink-0"
              >
                Batal
              </button>
            </div>
          )}

          {/* CTAs — briefing jadi aksi utama bila token tersedia (jalur in-app, tak perlu WA) */}
          <div className="flex flex-col gap-3">
            {briefingToken && !isPelunasan && (
              <Link
                href={`/order/briefing/${briefingToken}`}
                className="w-full bg-[#0071E3] text-white text-center py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all shadow-sm shadow-blue-200"
              >
                <ClipboardList size={16} /> Isi Form Briefing Sekarang <ArrowRight size={16} />
              </Link>
            )}
            <Link
              href={trackUrl}
              className={`w-full text-center py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all ${
                briefingToken && !isPelunasan
                  ? 'bg-white border border-gray-200 text-[#1D1D1F] hover:bg-gray-50'
                  : 'bg-[#1D1D1F] text-white hover:bg-black shadow-sm'
              }`}
            >
              Lacak Progress Sekarang <ArrowRight size={16} />
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Halo%2C%20saya%20baru%20melakukan%20pembayaran%20DP%20dengan%20order%20${displayId ?? ''}.%20Ada%20yang%20ingin%20saya%20tanyakan.`}
              target="_blank"
              className="w-full bg-white border border-gray-200 text-[#1D1D1F] text-center py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
            >
              <MessageCircle size={16} className="text-green-500" /> Hubungi Tim via WhatsApp
            </a>
          </div>

        </div>
      </main>
    </div>
  )
}
