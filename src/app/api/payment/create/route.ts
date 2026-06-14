import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { notifyCustomer } from '@/lib/fonnte'
import { normalizeCode, lookupActiveCode, isSelfReferral } from '@/lib/referral'
import { referralDiscountFor } from '@/lib/referral-tier'
import { computeServerPrice } from '@/lib/pricing/server-price'
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit'
import { getPlatformMidtrans } from '@/lib/platform-midtrans'
import { BESPOKE_VARIANTS } from '@/app/components/themes/toko-bespoke/variants'

export async function POST(request: Request) {
  try {
    // Rate-limit per IP (audit 2026-06-13, #8): pembuatan order tak punya
    // token/auth (belum ada order), jadi batasi spam pembuatan order + token Snap.
    const rl = rateLimit(`pay:create:${clientIp(request)}`, 5, 60_000)
    if (!rl.allowed) return tooManyRequests(rl.retryAfter)

    const body = await request.json()
    // Mode + kredensial Midtrans dipilih runtime dari DB (platform_settings) —
    // bisa di-switch sandbox/production dari /admin tanpa redeploy. Dipanggil
    // sebelum insert order supaya misconfig gagal jelas tanpa order yatim.
    const { serverKey: SERVER_KEY, snapApiUrl: SNAP_API, mode: MIDTRANS_MODE } = await getPlatformMidtrans()
    const {
      client_type, nama_usaha, nama_perusahaan, nama_pic, jabatan,
      nomor_wa, email, industri, template_id, referensi_manual,
      selected_addons, total_estimasi, total_maintenance,
      referral_code,
      // Konteks kalkulator corp (untuk recompute harga server-side bila order
      // datang dari handoff "Rakit Website"). Diabaikan utk billing kalau kosong.
      from_kalkulator, paket, kalkulator_addons, bundle,
      // Handoff tema dari galeri preview corp (Fase 3): tema pilihan customer.
      // Disimpan sbg default brief (briefing_data.preselect), TIDAK memengaruhi harga.
      preselect_subkat, preselect_theme,
    } = body

    // Validasi otoritatif: hanya tema bespoke terdaftar yang dihormati (jangan
    // percaya klien). Tema tak dikenal → preselect diabaikan (brief pakai default).
    const validPreselectTheme =
      preselect_theme && BESPOKE_VARIANTS[String(preselect_theme)] ? String(preselect_theme) : null
    const preselect = validPreselectTheme
      ? { variant: validPreselectTheme, sub_kategori: preselect_subkat ? String(preselect_subkat) : null }
      : null

    // SECURITY: JANGAN pernah percaya harga dari klien. Sebelumnya gross =
    // Number(total_estimasi) langsung jadi gross_amount Midtrans → bisa di-tamper
    // (POST total_estimasi=1000 → bayar Rp1.000 utk build mahal). Sekarang harga
    // dihitung ulang otoritatif dari sumber tepercaya (templatesData + katalog
    // untuk native; mirror harga corp untuk handoff kalkulator). total_estimasi
    // klien hanya dipakai utk deteksi selisih/log, bukan utk menagih.
    const price = computeServerPrice({
      template_id, selected_addons,
      from_kalkulator, paket, kalkulator_addons, bundle,
    })
    if (price.gross == null) {
      return NextResponse.json(
        { error: 'Tidak bisa menentukan harga pesanan. Silakan ulang dari kalkulator atau hubungi tim kami.' },
        { status: 400 },
      )
    }
    const gross = price.gross
    const serverMaintenance = price.maintenance ?? (Number(total_maintenance) || 0)
    // Fidelity fulfillment: simpan add-on MENTAH dari kalkulator corp. Add-on
    // "manual" (g-sheets/invoice-auto/api/email-auto) tak punya SKU WB → ke-drop
    // dari selected_addons saat mapping, padahal sudah ditagih. Disimpan di sini
    // supaya tim tetap melihatnya. Null utk order non-kalkulator.
    const requestedAddons =
      (from_kalkulator || paket) && kalkulator_addons
        ? String(kalkulator_addons).split(',').map((s: string) => s.trim()).filter(Boolean)
        : null
    const claimedGross = Number(total_estimasi) || 0
    if (claimedGross !== gross) {
      console.warn(
        `[payment/create] price mismatch (charging server value): client=${claimedGross} server=${gross} path=${price.path} paket=${paket ?? ''} bundle=${bundle ?? ''} template=${template_id ?? ''}`,
      )
    }

    // 0. Referral (Program Mitra) — server yang berwenang: kode divalidasi
    //    ulang di sini, diskon dihitung ulang (jangan percaya angka klien),
    //    self-referral ditolak diam-diam. Kode invalid TIDAK memblokir order.
    let applied = null as Awaited<ReturnType<typeof lookupActiveCode>>
    const normCode = normalizeCode(referral_code)
    if (normCode) {
      const ref = await lookupActiveCode(normCode)
      if (ref && !isSelfReferral(ref, nomor_wa ?? '', email ?? '')) applied = ref
    }
    const referralDiscount = applied ? referralDiscountFor(gross, applied.discountPercent) : 0
    // total_estimasi tersimpan = NET supaya seluruh math hilir (DP threshold,
    // retry, pelunasan) tetap bekerja tanpa perubahan.
    const netTotal = gross - referralDiscount

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
        selected_addons, requested_addons: requestedAddons,
        total_estimasi: netTotal, total_maintenance: serverMaintenance,
        status: 'pending_payment',
        payment_status: 'unpaid',
        type: 'new',
        referral_code: applied?.code ?? null,
        referrer_id: applied?.referrerId ?? null,
        referral_discount: referralDiscount,
        // Tema pilihan dari galeri corp → default brief form (dibaca briefing page).
        // Ditulis ulang penuh saat briefing disubmit; "done" dicek via briefing_submitted_at.
        ...(preselect && { briefing_data: { preselect } }),
      }])
      .select()
      .single()

    if (dbError) throw new Error(dbError.message)

    const year = new Date().getFullYear()
    const displayId = `JA-${year}-${order.id.slice(0, 8).toUpperCase()}`
    const DP_THRESHOLD = 4_000_000
    const isDP = netTotal >= DP_THRESHOLD
    const dpAmount = isDP ? Math.ceil(netTotal * 0.5) : netTotal
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
        id: isDP ? 'dp-50pct' : 'lunas',
        price: dpAmount,
        quantity: 1,
        name: isDP ? 'DP 50% — Japan Arena Studio' : 'Lunas — Japan Arena Studio',
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

    // 3. Persist midtrans_order_id & dp_amount + environment transaksi (midtrans_mode)
    //    supaya webhook/confirm memverifikasi & poll terhadap key yang benar.
    await supabaseAdmin
      .from('orders')
      .update({ midtrans_order_id: midtransOrderId, dp_amount: dpAmount, midtrans_mode: MIDTRANS_MODE })
      .eq('id', order.id)

    // 4. WA post-order ke customer (fire-and-forget)
    if (nomor_wa) {
      const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
      notifyCustomer({ type: 'order_created' }, nomor_wa, {
        clientName: clientName ?? 'Customer',
        displayId,
        // token disertakan supaya halaman /track milik pelanggan bisa menampilkan
        // rahasia (kredensial/briefing); akses ber-id saja hanya lihat status.
        trackUrl: `${base}/track?id=${order.id}&token=${order.tracking_token}`,
        paymentUrl: snapData.redirect_url,
      }).catch((e) => console.error('[payment/create] WA order_created failed:', e))
    }

    return NextResponse.json({
      snap_token: snapData.token,
      redirect_url: snapData.redirect_url,
      order_id: order.id,
      display_id: displayId,
      dp_amount: dpAmount,
      referral_discount: referralDiscount,
    })
  } catch (err: any) {
    console.error('[payment/create]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
