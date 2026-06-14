'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  FlaskConical,
  Loader2,
  AlertTriangle,
  ArrowRightLeft,
} from 'lucide-react'

type Mode = 'sandbox' | 'production'

type Props = {
  initialMode: Mode
  keyStatus: Record<Mode, boolean>
}

// Kartu kontrol mode pembayaran PLATFORM (Midtrans Japan Arena yang menagih
// customer). Toggle sandbox <-> production tanpa redeploy — sumber kebenaran ada
// di DB (platform_settings.midtrans_mode), dibaca runtime oleh route /api/payment/*.
export default function PaymentModeControl({ initialMode, keyStatus }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [confirming, setConfirming] = useState<Mode | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const target: Mode = mode === 'production' ? 'sandbox' : 'production'
  const targetReady = keyStatus[target]
  const isProd = mode === 'production'

  const apply = async (next: Mode) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/payment-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: next }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Gagal mengganti mode.')
        return
      }
      setMode(json.mode)
      setConfirming(null)
      router.refresh()
    } catch {
      setError('Error koneksi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 apple-shadow border border-black/[0.03]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Status mode aktif */}
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isProd ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            {isProd ? <ShieldCheck size={26} /> : <FlaskConical size={26} />}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Mode Pembayaran (Midtrans)
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${
                  isProd
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {isProd ? '● Production' : '● Sandbox'}
              </span>
              <span className="text-xs font-medium text-gray-500">
                {isProd ? 'Transaksi nyata — customer benar-benar membayar.' : 'Mode tes — tidak ada uang masuk.'}
              </span>
            </div>
          </div>
        </div>

        {/* Tombol switch */}
        <button
          onClick={() => {
            setError(null)
            setConfirming(target)
          }}
          disabled={loading || !targetReady}
          title={targetReady ? undefined : `Server key ${target} belum di-set di environment.`}
          className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest border border-black/10 text-gray-700 hover:border-apple-blue/40 hover:text-apple-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowRightLeft size={14} />
          Ganti ke {target === 'production' ? 'Production' : 'Sandbox'}
        </button>
      </div>

      {/* Hint bila key mode tujuan belum siap */}
      {!targetReady && (
        <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
          <AlertTriangle size={14} className="shrink-0" />
          Server key <code className="font-mono">MIDTRANS_SERVER_KEY_{target.toUpperCase()}</code> belum
          di-set — tambahkan di environment lalu redeploy agar bisa beralih ke {target}.
        </p>
      )}

      {error && (
        <p className="mt-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {/* Dialog konfirmasi */}
      {confirming && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => !loading && setConfirming(null)}
        >
          <div
            className="bg-white rounded-[28px] p-8 max-w-md w-full apple-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                confirming === 'production' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
              }`}
            >
              {confirming === 'production' ? <ShieldCheck size={22} /> : <FlaskConical size={22} />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Ganti ke mode {confirming === 'production' ? 'Production' : 'Sandbox'}?
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {confirming === 'production' ? (
                <>
                  Mulai sekarang setiap checkout akan <strong>menagih uang sungguhan</strong> ke
                  customer. Pastikan kamu sudah selesai melakukan tes.
                </>
              ) : (
                <>
                  Checkout akan beralih ke <strong>mode tes Midtrans</strong>. Pembayaran apa pun
                  tidak menghasilkan uang nyata — jangan biarkan mode ini aktif saat melayani order
                  asli.
                </>
              )}
            </p>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              Transaksi yang sudah berjalan tetap aman: webhook memverifikasi kedua kunci, jadi
              notifikasi pembayaran in-flight tidak hilang saat mode ditukar.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(null)}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-black/10 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() => apply(confirming)}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white disabled:opacity-50 ${
                  confirming === 'production'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                Ya, ganti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
