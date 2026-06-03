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
  const existingTahap2 = (order.briefing_data as Record<string, unknown>)?.tahap_2 as Record<string, unknown> | undefined

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <main className="pt-32 pb-24 px-4">
        <DetailForm
          token={token}
          orderId={order.id}
          namaKlien={namaKlien}
          industri={order.industri ?? ''}
          existingData={existingTahap2}
        />
      </main>
    </div>
  )
}
