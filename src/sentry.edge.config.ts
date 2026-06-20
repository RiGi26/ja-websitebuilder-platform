import * as Sentry from '@sentry/nextjs'

// Edge runtime (middleware, edge routes). Inert tanpa DSN.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
})
