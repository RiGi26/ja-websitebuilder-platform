import * as Sentry from '@sentry/nextjs'

// Inert tanpa NEXT_PUBLIC_SENTRY_DSN → situs lama nol regresi (prinsip perubahan-aman-additive).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
})
