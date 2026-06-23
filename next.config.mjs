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
  // @react-pdf/renderer (engine invoice PDF) = Node-only, deps berat (fontkit dll).
  // Jangan di-bundle webpack server — biarkan di-require runtime (hindari error build).
  serverExternalPackages: ['@react-pdf/renderer'],
  // Karena di-externalize, file paket (data metrik font .afm, wasm fontkit, dll) HARUS
  // dipaksa ikut ter-trace ke fungsi serverless route /invoice — kalau tidak, render
  // sukses lokal tapi 500 (ENOENT) di Vercel. Sertakan scope @react-pdf + deps datanya.
  outputFileTracingIncludes: {
    '/invoice/[token]': [
      './node_modules/@react-pdf/**/*',
      './node_modules/@foliojs-fork/**/*',
      './node_modules/fontkit/**/*',
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
