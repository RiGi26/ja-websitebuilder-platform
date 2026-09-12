# Webzoka Store V2 — S4 Customize Review

Status: S4 implementation complete; stopped before S5 Recommendation Engine.

Date: 2026-09-12

## Scope

S4 adds the four-step `/store/customize/[slug]` experience and a normalized client-only draft. It does not add recommendation rules, a summary route, WhatsApp handoff, accounts, checkout, payments, backend persistence, provisioning, redirects, Hub integration, or new templates.

## Route and entry points

- Canonical route: `/store/customize/[slug]`.
- `generateStaticParams` covers all six frozen template slugs.
- Unknown slugs use `notFound()` and return 404.
- Detail-page `Gunakan Template Ini`, the detail final CTA, and the shared preview toolbar all navigate to the selected template's Customize route.

## Wizard

1. `Tentang bisnis`: category, buyer-facing business type, area, current website status, and current contact channels.
2. `Kebutuhan customer`: relevant public and account/member capabilities from the canonical taxonomy, plus `Belum yakin`.
3. `Kebutuhan operasional`: relevant operational capabilities from the selected template, plus mutually exclusive `Tidak perlu dashboard khusus` and `Belum yakin`.
4. `Kesiapan project`: logo, domain, visual, template-aware catalog/menu/program/unit data, business copy, and timeline.

Final state shows captured answers and the honest S5 boundary. It does not calculate or display a recommendation.

## Normalized draft and persistence

The typed `CustomizeDraft` lives in `src/lib/store/types.ts`. It includes schema version, template slug, completion status, step, business context, website/contact context, canonical customer and operational capability IDs, operational mode, readiness assets, timeline, uncertainty markers, and consultation marker.

Drafts serialize to `sessionStorage` under `webzoka.store.customize.v1:{templateSlug}`. Restoration is limited to the current template. Corrupt or unavailable storage is ignored safely. Reset removes only the current template's draft. No personal contact data is collected and no backend write occurs.

## Template-aware behavior

One shared wizard derives options from `customerCan`, `optionalCapabilities`, and `CAPABILITY_TAXONOMY`. Copy adapts to the six directions: menu/product, catalog, services/profile, care/booking, course/program, and rental/unit language. No capability string is duplicated outside the canonical taxonomy.

## Validation and accessibility

- Step 1 requires a buyer-facing business context.
- Step 2 accepts a selected capability or `Belum yakin`.
- Step 3 accepts selected operational needs, `Tidak perlu dashboard khusus`, or `Belum yakin`.
- Step 4 stays non-blocking for partial readiness.
- One H1, visible labels, fieldsets/legends, 44px+ controls, focus-visible states, progressbar semantics, inline error summary, safe-area action bar, no horizontal overflow, and reduced-motion handling are included.

## Validation evidence

- `npm run typecheck`: pass.
- Focused Store/Customize Vitest: 15/15 pass.
- `npm run build`: pass; all six Customize paths statically generated.
- `git diff --check`: pass.
- Browser UAT: production-server checks at 1440×900, 768×900, and 390×844 cover CTA entry, four-step completion, Back/Next preservation, refresh restore, reset, `Belum yakin`, no-dashboard behavior, template-aware options, recommendation-free completion, no overflow, touch targets, and app error capture. No app page errors or failed app requests appeared; local self-hosted runs emitted the existing `/_vercel/speed-insights/script.js` 404/MIME warning from the root `SpeedInsights` integration.
- `npm run lint`: existing script remains non-functional under the current Next.js setup; no lint config changed.

## Deployment

New Vercel Preview: `dpl_6u4UK3KEesKXMW3NHofGfYTsuevt`, status `Ready`, target `preview`, URL `https://ja-websitebuilder-platform-8kpzzgymu-rigi26s-projects.vercel.app`. Remote browser smoke passed at 1440×900, 768×900, and 390×844 with zero console errors, page errors, or failed requests. No production deployment.

## Deferred

S5 Recommendation Engine, S6 Consultation Summary and centralized WhatsApp handoff, and all unrelated platform/payment/account/provisioning work remain deferred.

## Decision requested

Approve or reject the S4 question set, normalized draft model, and client-only persistence boundary for S5 planning. Do not start S5 until approved.
