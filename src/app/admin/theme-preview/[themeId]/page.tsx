import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import ComposableRenderer from '@/app/components/theme-engine/ComposableRenderer'
import TokoAtelierRenderer, { PALETTES as ATELIER_PALETTES } from '@/app/components/themes/toko-atelier/TokoAtelierRenderer'
import { getManifest } from '@/lib/theme-system/manifest'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

export const dynamic = 'force-dynamic'

// Halaman internal — jangan diindeks mesin pencari.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Render ASLI satu gaya tema, full-screen, dengan konten contoh per sub-kategori.
// Inilah UAT visual yang akurat (vs mockup kecil di brief form).
export default async function ThemePreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ themeId: string }>
  searchParams: Promise<{ variant?: string }>
}) {
  const cookieStore = await cookies()
  const isAuth = verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!isAuth) redirect('/admin/login')

  const { themeId } = await params

  // ── Flagship bespoke (di luar registry manifest) ──
  // toko-atelier dark-launched (tak ada di taxonomy) tapi tetap butuh UAT
  // visual; varian palet via ?variant= (noir default · ivoire terang).
  if (themeId === 'toko-atelier') {
    const { variant } = await searchParams
    const v = variant && ATELIER_PALETTES[variant] ? variant : 'noir'
    return (
      <div className="relative">
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[1100] flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 text-white backdrop-blur border border-white/15 shadow-lg">
          <Link href="/admin/theme-preview" className="text-[11px] font-bold text-white/60 hover:text-white">
            ← Semua tema
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-[11px] font-black tracking-wide">Toko Atelier (flagship)</span>
          {Object.keys(ATELIER_PALETTES).map((p) => (
            <Link
              key={p}
              href={p === 'noir' ? '/admin/theme-preview/toko-atelier' : `/admin/theme-preview/toko-atelier?variant=${p}`}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${p === v ? 'border-white/60 text-white' : 'border-white/15 text-white/40 hover:text-white/70'}`}
            >
              {p}
            </Link>
          ))}
        </div>
        <TokoAtelierRenderer content={sampleContentForTheme('toko-atelier')} variant={v} />
      </div>
    )
  }

  const manifest = getManifest(themeId)
  if (!manifest) notFound()

  const content = sampleContentForTheme(themeId)

  return (
    <div className="relative">
      {/* Bar UAT — tidak bagian tema, hanya navigasi internal */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 text-white backdrop-blur border border-white/15 shadow-lg">
        <Link href="/admin/theme-preview" className="text-[11px] font-bold text-white/60 hover:text-white">
          ← Semua tema
        </Link>
        <span className="text-white/20">|</span>
        <span className="text-[11px] font-black tracking-wide">{manifest.label}</span>
        <span className="text-[10px] font-mono text-white/40">{manifest.id}</span>
      </div>

      <ComposableRenderer manifest={manifest} content={content} />
    </div>
  )
}
