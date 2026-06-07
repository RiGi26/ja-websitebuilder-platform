import type { ReactNode } from 'react'
import { Plus_Jakarta_Sans, Fraunces, Space_Grotesk, Nunito } from 'next/font/google'

// ============================================================
// THEME SYSTEM — font asli per gaya (polish #4, THEME_SYSTEM_PLAN §12).
// Dimuat di subtree [slug] (situs klien published) saja — tidak membebani
// halaman chrome JA. 4 keluarga memetakan 4 stack abstrak di theme-packs/_fonts.ts:
//   SANS→Jakarta · SERIF→Fraunces · GROTESK→Space Grotesk · ROUNDED→Nunito.
// Tiap font expose CSS variable; _fonts.ts mereferensikannya dengan fallback
// sistem (var(--font-x, <stack sistem>)) → aman bila variabel tak ada (UAT/test).
// ============================================================
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['opsz'] })
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' })

export default function SlugLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${jakarta.variable} ${fraunces.variable} ${grotesk.variable} ${nunito.variable}`}>
      {children}
    </div>
  )
}
