/** @type {import('next').NextConfig} */

import { withSentryConfig } from '@sentry/nextjs'

// P5DB-2 — Security headers.
// Catatan penting: situs klien publik [slug] SENGAJA dibiarkan bisa di-iframe
// (galeri "Karya Kami" di corp-landing menampilkannya via <iframe>). Karena itu
// proteksi anti-clickjacking HANYA dipasang di area sensitif /admin & /portal,
// bukan global. HSTS tanpa includeSubDomains supaya tak memaksa HTTPS ke
// subdomain ekosistem lain.

// Header aman untuk SEMUA route (tak mengubah perilaku, tak memblok konten).
const baseSecurityHeaders = [
  // Paksa HTTPS pada host ini (Vercel selalu HTTPS). Tanpa includeSubDomains/
  // preload supaya tak berdampak ke subdomain saudara di ekosistem.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  // Cegah MIME-sniffing.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Bocorkan referrer seperlunya.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Matikan API perangkat yang tak dipakai.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

// Anti-clickjacking khusus area sensitif (login admin/klien, dashboard).
const noFrameHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
]

const nextConfig = {
  reactStrictMode: true,
  // Optimasi gambar (next/image). Host di-whitelist KETAT (bukan '**') supaya
  // optimizer tak jadi proxy terbuka: storage Supabase ekosistem + Unsplash
  // (dipakai aset template default). Host lain → renderer fallback ke <img>
  // mentah (lihat SmartImg di CeriaOrderRenderer) agar tak ada gambar putus.
  // AVIF/WebP otomatis + resize ke lebar viewport → PNG 0.8–2.3 MB jadi puluhan KB.
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // @react-pdf/renderer = Node-only, di-externalize (jangan di-bundle Turbopack server).
  // Next 16 me-render elemen pakai React 19 (elemen `react.transitional.element`), maka
  // react-pdf HARUS memuat reconciler React-19 (reconciler-31/33). react-pdf memilih
  // reconciler dari `React.version`-nya → kita paksa react@19 di subtree react-pdf via
  // `overrides` di package.json. Externalize = resolusi node_modules dipakai (react@19
  // nested), bukan React vendored Next. Tanpa ini → reconciler-23 (R18) → "React #31".
  serverExternalPackages: ['@react-pdf/renderer'],
  // Karena di-externalize, Vercel hanya menyertakan file yang ter-trace ke fungsi.
  // react-pdf/fontkit MEMBACA file data saat runtime (mis. fontkit *.trie utk shaping)
  // → tanpa ini render sukses lokal (node_modules lengkap) tapi ENOENT/500 di Vercel.
  // Paksa sertakan paket + deps pembawa-data ke fungsi route /invoice.
  outputFileTracingIncludes: {
    '/invoice/[token]': [
      './node_modules/@react-pdf/**/*',
      './node_modules/fontkit/**/*',
      './node_modules/unicode-properties/**/*',
      './node_modules/unicode-trie/**/*',
      './node_modules/dfa/**/*',
      './node_modules/brotli/**/*',
      './node_modules/restructure/**/*',
      // Font Noto Sans JP (glyph CJK) dibaca dari disk saat render — wajib di-bundle.
      './public/fonts/**/*',
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: baseSecurityHeaders },
      { source: '/admin/:path*', headers: noFrameHeaders },
      { source: '/portal/:path*', headers: noFrameHeaders },
    ]
  },
}

// Sentry — error & performance monitoring.
// Opsi upload source map (org/project/authToken) dibaca dari ENV → hanya jalan saat
// di-set (di Vercel/CI); build tetap sukses tanpa itu. tunnelRoute SENGAJA tak dipakai:
// route [slug] multi-tenant bisa bentrok dengan path tunnel.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
})
