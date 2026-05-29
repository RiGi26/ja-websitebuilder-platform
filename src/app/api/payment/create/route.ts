import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!
const IS_PROD = process.env.NEXT_PUBLIC_MIDTRANS_ENV === 'production'
const SNAP_API = IS_PROD
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      client_type, nama_usaha, nama_perusahaan, nama_pic, jabatan,
      nomor_wa, email, industri, template_id, referensi_manual,
      selected_addons, total_estimasi, total_maintenance,
    } = body

    // 1. Insert order with pending_payment status
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert([{
        client_type,
        nama_usaha: client_type === 'individu' ? nama_usaha : null,
        nama_perusahaan: client_type === 'perusahaan' ? nama_perusahaan : null,
        nama_pic: client_type === 'perusahaan' ? nama_pic : null,
        jabatan: client_type === 'perusahaan' ? jabatan : null,
        nomor_wa, email, industri, template_id, referensi_manual,
        selected_addons, total_estimasi, total_maintenance,
        status: 'pending_payment',
        payment_status: 'unpaid',
        type: 'new',
      }])
      .select()
      .single()

    if (dbError) throw new Error(dbError.message)

    const year = new Date().getFullYear()
    const displayId = `JA-${year}-${order.id.slice(0, 8).toUpperCase()}`
    const dpAmount = Math.ceil(total_estimasi * 0.5)
    const clientName = client_type === 'perusahaan' ? nama_perusahaan : nama_usaha
    const midtransOrderId = `${displayId}-DP`
    const finishUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?id=${order.id}`

    // 2. Create Midtrans Snap token
    // gopay.callback_url & shopeepay.callback_url WAJIB di-set terpisah —
    // untuk metode pembayaran berbasis app (deep link), callbacks.finish saja
    // tidak cukup karena app deep link tidak forward query string `?id=`.
    const snapPayload = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: dpAmount,
      },
      item_details: [{
        id: 'dp-50pct',
        price: dpAmount,
        quantity: 1,
        name: `DP 50% — Japan Arena Studio (${industri || 'Website'})`,
      }],
      customer_details: {
        first_name: clientName,
        ...(nomor_wa && { phone: nomor_wa }),
        ...(email && { email }),
      },
      callbacks: {
        finish: finishUrl,
      },
      gopay: {
        enable_callback: true,
        callback_url: finishUrl,
      },
      shopeepay: {
        callback_url: finishUrl,
      },
    }

    const auth = Buffer.from(`${SERVER_KEY}:`).toString('base64')
    const snapRes = await fetch(SNAP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify(snapPayload),
    })

    const snapData = await snapRes.json()
    if (!snapRes.ok) {
      throw new Error(snapData.error_messages?.join(', ') || `Midtrans error: ${snapRes.status}`)
    }

    // 3. Persist midtrans_order_id & dp_amount
    await supabaseAdmin
      .from('orders')
      .update({ midtrans_order_id: midtransOrderId, dp_amount: dpAmount })
      .eq('id', order.id)

    return NextResponse.json({
      snap_token: snapData.token,
      redirect_url: snapData.redirect_url,
      order_id: order.id,
      display_id: displayId,
      dp_amount: dpAmount,
    })
  } catch (err: any) {
    console.error('[payment/create]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
