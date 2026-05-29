import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { notifyCustomer, type NotifyEvent } from '@/lib/fonnte'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

export async function PATCH(request: Request) {
  // 1. Security Check — verifikasi token sesi signed (bukan cookie statik)
  const cookieStore = await cookies()
  const isAuth = verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const {
      id,
      status,
      progress_step,
      progress_note,
      delivered_url,
      delivered_credentials,
    } = await request.json()

    // 2. Fetch current state untuk diff detection (deteksi WA notification trigger)
    const { data: current, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('progress_step, status, nomor_wa, nama_perusahaan, nama_usaha, delivered_url, created_at')
      .eq('id', id)
      .single()

    if (fetchErr) throw fetchErr

    // 3. Build payload — hanya kirim field yang explicit di-set di body
    const payload: Record<string, unknown> = {
      status,
      progress_step,
      last_updated_at: new Date().toISOString(),
    }
    if (progress_note !== undefined) payload.progress_note = progress_note
    if (delivered_url !== undefined) payload.delivered_url = delivered_url
    if (delivered_credentials !== undefined) payload.delivered_credentials = delivered_credentials

    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update(payload)
      .eq('id', id)

    if (updateErr) throw updateErr

    // 3b. Audit trail — catat perubahan ke order_progress_logs (best-effort,
    // jangan blok / gagalkan response kalau insert log error). Ditulis via
    // service role; tabel terkunci service-role-only (RLS on, no policy).
    const stepChanged = current?.progress_step !== progress_step
    const statusChanged = current?.status !== status
    const noteAdded =
      progress_note !== undefined && progress_note !== null && progress_note !== ''
    const deliveredChanged =
      delivered_url !== undefined && delivered_url !== (current?.delivered_url ?? undefined)

    if (stepChanged || statusChanged || noteAdded || deliveredChanged) {
      const { error: logErr } = await supabaseAdmin.from('order_progress_logs').insert({
        order_id: id,
        from_step: current?.progress_step ?? null,
        to_step: progress_step ?? null,
        from_status: current?.status ?? null,
        to_status: status ?? null,
        progress_note: noteAdded ? progress_note : null,
        changed_by: 'admin',
        source: 'admin',
      })
      if (logErr) console.error('[admin/orders] audit log insert failed:', logErr.message)
    }

    // 4. Tentukan notif event yang perlu dikirim (fire-and-forget, jangan blok response)
    const notifEvent = pickNotifEvent({
      oldStep: current?.progress_step ?? 1,
      newStep: progress_step,
      oldStatus: current?.status ?? 'pending',
      newStatus: status,
      oldDeliveredUrl: current?.delivered_url ?? null,
      newDeliveredUrl: delivered_url !== undefined ? delivered_url : current?.delivered_url ?? null,
    })

    if (notifEvent && current?.nomor_wa) {
      const year = new Date(current.created_at ?? Date.now()).getFullYear()
      const displayId = `JA-${year}-${id.slice(0, 8).toUpperCase()}`
      const clientName = current.nama_perusahaan || current.nama_usaha || 'Customer'
      const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
      const trackUrl = `${base}/track?id=${id}`

      // Fire-and-forget — jangan await, jangan blok PATCH response kalau Fonnte down
      notifyCustomer(notifEvent, current.nomor_wa, {
        clientName,
        displayId,
        trackUrl,
        note: progress_note ?? null,
        deliveredUrl: delivered_url !== undefined ? delivered_url : current?.delivered_url ?? null,
        deliveredCredentials: delivered_credentials ?? null,
      }).catch((err) => console.error('[admin/orders] WA notify failed:', err))
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Logika kapan kirim notif WA:
//   - cancelled: status berubah ke 'cancelled' (sebelumnya bukan)
//   - launch:    step=5 DAN URL website sudah ada DAN (baru sampai 5 atau URL baru di-set)
//   - step:      step berubah ke 2/3/4 (transisi tengah)
// Tidak kirim kalau cuma update note tanpa perubahan step/status/URL.
function pickNotifEvent(args: {
  oldStep: number
  newStep: number
  oldStatus: string
  newStatus: string
  oldDeliveredUrl: string | null
  newDeliveredUrl: string | null
}): NotifyEvent | null {
  const { oldStep, newStep, oldStatus, newStatus, oldDeliveredUrl, newDeliveredUrl } = args

  if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
    return { type: 'cancelled' }
  }

  if (newStep === 5 && newDeliveredUrl && (oldStep !== 5 || !oldDeliveredUrl)) {
    return { type: 'launch' }
  }

  if (oldStep !== newStep && (newStep === 2 || newStep === 3 || newStep === 4)) {
    return { type: 'step', step: newStep }
  }

  return null
}
