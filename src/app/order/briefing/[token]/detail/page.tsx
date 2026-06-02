import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Navbar from '@/app/components/Navbar'
import DetailForm from './DetailForm'

export const dynamic = 'force-dynamic'

async function getOrderByToken(token: string) {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('id, tracking_token, payment_status, briefing_submitted_at, briefing_data, nama_usaha, nama_perusahaan, industri, tenant_id')
    .eq('tracking_token', token)
    .maybeSingle()
  return data
}

export default async function BriefingDetailPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const order = await getOrderByToken(token)

  if (!order) redirect('/track')
  if (!order.briefing_submitted_at) {
    redirect(`/order/briefing/${token}`)
  }

  const namaKlien = order.nama_perusahaan || order.nama_usaha || 'Customer'
  const existing = (order.briefing_data as Record<string, unknown>)?.tahap_2
  const alreadyDone = !!existing

  if (alreadyDone) {
    return (
      <div className="min-h-screen bg-[#F5F5F7]">
        <Navbar />
        <main className="pt-32 pb-24 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-[32px] p-10 shadow-sm border border-black/[0.04]">
              <div className="text-4xl mb-4">✅</div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">Detail Website Sudah Lengkap!</h1>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Terima kasih {namaKlien}. Tim kami akan segera menyempurnakan website Anda.
              </p>
              <a href={`/track?id=${order.id}`}
                className="inline-flex items-center gap-2 py-3 px-6 bg-[#0071E3] text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors text-sm">
                Lacak Progress
              </a>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <main className="pt-32 pb-24 px-4">
        <DetailForm
          token={token}
          orderId={order.id}
          namaKlien={namaKlien}
          industri={order.industri ?? ''}
        />
      </main>
    </div>
  )
}
