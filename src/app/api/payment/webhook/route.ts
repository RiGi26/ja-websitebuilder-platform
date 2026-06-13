import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { notifyCustomer, notifyReferrer } from '@/lib/fonnte'
import { createEarningForOrder, confirmEarningForOrder } from '@/lib/referral'
import crypto from 'crypto'

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!

// Midtrans requires HTTP 200 always — non-200 triggers retries
// Signature check still happens; invalid ones are logged and ignored
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body

    // Verify signature — reject silently if invalid (return 200 so Midtrans doesn't retry)
    const expected = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${SERVER_KEY}`)
      .digest('hex')

    if (signature_key !== expected) {
      console.warn('[webhook] Invalid signature for order:', order_id)
      return NextResponse.json({ received: true, note: 'signature_mismatch' })
    }

    const isPaid =
      (transaction_status === 'capture' && fraud_status === 'accept') ||
      transaction_status === 'settlement'
    const isPending = transaction_status === 'pending'
    const isFailed = ['deny', 'cancel', 'expire'].includes(transaction_status)

    const update: Record<string, string> = {}

    if (isPaid) {
      update.payment_status = 'dp_paid'
      update.status = 'pending'
    } else if (isPending) {
      update.payment_status = 'awaiting_payment'
    } else if (isFailed) {
      update.payment_status = 'failed'
      update.status = 'pending_payment'
    }

    // Deteksi apakah ini transaksi pelunasan (suffix -LUNAS)
    const isPelunasan = order_id.endsWith('-LUNAS')

    if (Object.keys(update).length > 0) {
      if (isPelunasan) {
        // Pelunasan: match by pelunasan_midtrans_order_id
        const pelunasanUpdate: Record<string, unknown> = {}
        if (isPaid) {
          pelunasanUpdate.payment_status = 'lunas'
          pelunasanUpdate.pelunasan_paid_at = new Date().toISOString()
        }
        if (Object.keys(pelunasanUpdate).length > 0) {
          const { data: pOrder, error: pErr } = await supabaseAdmin
            .from('orders')
            .update(pelunasanUpdate)
            .eq('pelunasan_midtrans_order_id', order_id)
            .select('id, nomor_wa, nama_usaha, nama_perusahaan, created_at, delivered_url')
            .maybeSingle()

          if (pErr) console.error('[webhook] pelunasan DB error:', pErr.message)

          if (isPaid && pOrder?.nomor_wa) {
            const clientName = pOrder.nama_perusahaan || pOrder.nama_usaha || 'Customer'
            const year = new Date(pOrder.created_at ?? Date.now()).getFullYear()
            const displayId = `JA-${year}-${pOrder.id.slice(0, 8).toUpperCase()}`
            const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
            notifyCustomer({ type: 'payment_lunas' }, pOrder.nomor_wa, {
              clientName, displayId,
              trackUrl: `${base}/track?id=${pOrder.id}`,
              deliveredUrl: pOrder.delivered_url ?? null,
            }).catch((e) => console.error('[webhook] WA payment_lunas failed:', e))
          }

          // Program Mitra — pelunasan = komisi terkonfirmasi (idempotent:
          // predicate status='pending' hanya match sekali walau Midtrans retry).
          if (isPaid && pOrder) {
            try {
              const t = await confirmEarningForOrder(pOrder.id)
              if (t.outcome === 'confirmed' && t.referrerWa) {
                const year = new Date(pOrder.created_at ?? Date.now()).getFullYear()
                const displayId = `JA-${year}-${pOrder.id.slice(0, 8).toUpperCase()}`
                const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
                notifyReferrer({ type: 'referral_earning_confirmed' }, t.referrerWa, {
                  referrerName: t.referrerName ?? 'Mitra',
                  amount: t.amount,
                  displayId,
                  mitraUrl: `${base}/mitra`,
                }).catch((e) => console.error('[webhook] WA referral confirm failed:', e))
              }
            } catch (e) {
              console.error('[webhook] referral confirm failed:', e)
            }
          }
        }
      } else {
        // DP: match by midtrans_order_id.
        // Terminal-state guard (audit 2026-06-13): paid states (dp_paid, lunas)
        // tidak boleh ditimpa. Midtrans bisa kirim notifikasi telat/duplikat/
        // out-of-order (mis. 'expire'/'deny'/'pending' setelah 'settlement', atau
        // settlement DP basi setelah pelunasan). Tanpa guard, order yang sudah
        // dibayar bisa turun ke failed/awaiting_payment (atau lunas→dp_paid)
        // diam-diam. Predikat ini juga membuat transisi MASUK dp_paid hanya sekali
        // (anti double-fire WA dari sisi webhook).
        const { data: updatedOrder, error } = await supabaseAdmin
          .from('orders')
          .update(update)
          .eq('midtrans_order_id', order_id)
          .not('payment_status', 'in', '("dp_paid","lunas")')
          .select('id, nomor_wa, nama_usaha, nama_perusahaan, created_at, tracking_token')
          .maybeSingle()

        if (error) console.error('[webhook] DB update error:', error.message)

        if (isPaid && updatedOrder?.nomor_wa) {
          const clientName = updatedOrder.nama_perusahaan || updatedOrder.nama_usaha || 'Customer'
          const year = new Date(updatedOrder.created_at ?? Date.now()).getFullYear()
          const displayId = `JA-${year}-${updatedOrder.id.slice(0, 8).toUpperCase()}`
          const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
          notifyCustomer({ type: 'dp_confirmed' }, updatedOrder.nomor_wa, {
            clientName, displayId,
            trackUrl: `${base}/track?id=${updatedOrder.id}`,
            briefingUrl: `${base}/order/briefing/${updatedOrder.tracking_token}`,
          }).catch((e) => console.error('[webhook] WA dp_confirmed failed:', e))
        }

        // Program Mitra — DP masuk = earning dibuat (pending; langsung
        // confirmed bila order dibayar 100% di muka). Idempotent via
        // order_id UNIQUE + ignoreDuplicates, aman terhadap retry Midtrans.
        if (isPaid && updatedOrder) {
          try {
            const t = await createEarningForOrder(updatedOrder.id)
            if ((t.outcome === 'created' || t.outcome === 'created_confirmed') && t.referrerWa) {
              const year = new Date(updatedOrder.created_at ?? Date.now()).getFullYear()
              const displayId = `JA-${year}-${updatedOrder.id.slice(0, 8).toUpperCase()}`
              const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
              notifyReferrer(
                {
                  type: t.outcome === 'created_confirmed'
                    ? 'referral_earning_confirmed'
                    : 'referral_earning_pending',
                },
                t.referrerWa,
                {
                  referrerName: t.referrerName ?? 'Mitra',
                  amount: t.amount,
                  displayId,
                  mitraUrl: `${base}/mitra`,
                },
              ).catch((e) => console.error('[webhook] WA referral earning failed:', e))
            }
          } catch (e) {
            console.error('[webhook] referral earning failed:', e)
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[webhook] Unhandled error:', err.message)
    // Still return 200 — Midtrans must not retry on our internal errors
    return NextResponse.json({ received: true, error: err.message })
  }
}
