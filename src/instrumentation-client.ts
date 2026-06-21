import * as Sentry from '@sentry/nextjs'

// Sengaja TANPA Session Replay & Feedback widget: berat di bundle + privasi situs customer
// (bisa ditambah nanti bila perlu). Inert tanpa DSN → nol regresi.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
})

// Instrumentasi navigasi App Router.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
