import { Sora, Noto_Sans_JP } from 'next/font/google'

// Font skin blog 'ja-panel' (bahasa visual Japan Arena: Sora + Noto Sans JP).
// Module-scope (syarat next/font); hanya ter-load di halaman blog yang
// mengimpornya — tidak membebani subtree [slug] lain.
export const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })
export const notoJp = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-jp', display: 'swap', weight: ['400', '500', '700'] })
