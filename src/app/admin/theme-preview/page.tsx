import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { INDUSTRY_SUBKATEGORI, getThemes } from '@/lib/theme-system/taxonomy'

export const dynamic = 'force-dynamic'

// Halaman internal — jangan diindeks mesin pencari.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// UAT surface: daftar semua tema READY → link ke render ASLI tiap gaya.
// Beda dari preview kecil brief form (BrandingPreview = mockup); di sini tiap
// kartu membuka ComposableRenderer penuh dengan konten contoh.
export default async function ThemePreviewIndex() {
  const cookieStore = await cookies()
  const isAuth = verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!isAuth) redirect('/admin/login')

  // Iterasi semua industri yang punya lapis sub-kategori. Tampilkan SEMUA
  // sub-kat (termasuk yang belum `ready`) — surface ini internal/UAT, jadi
  // berguna untuk meninjau tema dormant sebelum aktivasi.
  const industries = Object.entries(INDUSTRY_SUBKATEGORI) as [string, NonNullable<typeof INDUSTRY_SUBKATEGORI[keyof typeof INDUSTRY_SUBKATEGORI]>][]

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40 mb-1">
          Theme System · UAT
        </p>
        <h1 className="text-3xl font-black tracking-tight mb-2">Preview Tema (Render Asli)</h1>
        <p className="text-white/50 text-sm mb-10 max-w-xl leading-relaxed">
          Tiap gaya di sini dirender oleh mesin <code className="text-white/70">ComposableRenderer</code> yang
          sama dengan situs jadi — bukan mockup. Klik untuk melihat tampilan penuh dengan konten contoh.
        </p>

        {/* Flagship bespoke — di luar registry composable (dark-launched),
            tetap di-surface untuk UAT visual noir/ivoire. */}
        <div className="mb-14">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/35 mb-6 border-b border-white/10 pb-2">
            Flagship (bespoke)
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: '/admin/theme-preview/toko-atelier', sw: '#C5A572', nama: 'Toko Atelier — Noir', desc: 'Maison gelap-hangat, aksen champagne. Renderer bespoke Opsi A.' },
              { href: '/admin/theme-preview/toko-atelier?variant=ivoire', sw: '#7A5C32', nama: 'Toko Atelier — Ivoire', desc: 'Varian gading terang, aksen perunggu. Palet sama, panggung berlawanan.' },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] hover:border-white/20 transition-colors"
              >
                <span className="inline-block w-8 h-8 rounded-lg mb-3" style={{ background: t.sw }} />
                <div className="font-black text-[15px] mb-1">{t.nama}</div>
                <div className="text-[12px] text-white/45 leading-relaxed mb-3">{t.desc}</div>
                <span className="text-[11px] font-bold text-white/40 group-hover:text-white/70 transition-colors">
                  Buka render →
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-14">
          {industries.map(([tipe, subs]) => (
            <div key={tipe}>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/35 mb-6 border-b border-white/10 pb-2">
                {tipe.replace('_', ' ')}
              </h2>
              <div className="space-y-10">
                {subs.map((sub) => {
                  const themes = getThemes(tipe, sub.id)
                  if (themes.length === 0) return null
                  return (
                    <section key={sub.id}>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
                        {sub.nama}
                        {!sub.ready && (
                          <span className="text-[10px] font-bold text-amber-300/80 bg-amber-400/10 px-2 py-0.5 rounded-full normal-case tracking-normal">
                            dormant
                          </span>
                        )}
                      </h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {themes.map((t) => (
                          <Link
                            key={t.id}
                            href={`/admin/theme-preview/${t.id}`}
                            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] hover:border-white/20 transition-colors"
                          >
                            <span
                              className="inline-block w-8 h-8 rounded-lg mb-3"
                              style={{ background: t.mood }}
                            />
                            <div className="font-black text-[15px] mb-1">{t.nama}</div>
                            <div className="text-[12px] text-white/45 leading-relaxed mb-3">{t.deskripsi}</div>
                            <span className="text-[11px] font-bold text-white/40 group-hover:text-white/70 transition-colors">
                              Buka render →
                            </span>
                          </Link>
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
