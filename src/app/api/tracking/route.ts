import { NextResponse } from 'next/server'

// GET /api/tracking?kurir=jne&no_resi=12345
// Proxy ke Binderbyte API — tidak ekspos API key ke client.
// Kurir yang didukung: jne, jnt, sicepat, anteraja, ninja, pos, tiki,
// wahana, lion, sap, ninjaxpress, ide, rex, jet, lazada, dll.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const kurir   = searchParams.get('kurir')?.toLowerCase().trim()
  const no_resi = searchParams.get('no_resi')?.trim()

  if (!kurir || !no_resi) {
    return NextResponse.json({ error: 'kurir dan no_resi wajib diisi.' }, { status: 400 })
  }

  const apiKey = process.env.BINDERBYTE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Layanan tracking belum dikonfigurasi.' }, { status: 503 })
  }

  try {
    const url = `https://api.binderbyte.com/v1/track?api_key=${apiKey}&courier=${encodeURIComponent(kurir)}&awb=${encodeURIComponent(no_resi)}`
    const res  = await fetch(url, { next: { revalidate: 60 } }) // cache 1 menit
    const data = await res.json()

    if (!res.ok || data.status !== 200) {
      return NextResponse.json(
        { error: data.message ?? 'Resi tidak ditemukan atau kurir tidak didukung.' },
        { status: 404 },
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal menghubungi layanan tracking.' }, { status: 502 })
  }
}
