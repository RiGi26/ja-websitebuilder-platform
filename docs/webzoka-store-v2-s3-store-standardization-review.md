# Webzoka Store V2 — S3 Store Standardization Review

Status: S3 implementation complete. Stopped before S4.

Date: 2026-09-12

## Scope and verdict

S3 standardizes Store browse, detail, preview chrome, statuses, filters, and typed dynamic route resolution across the six canonical template runtimes:

- Warm Commerce
- Modern Catalog
- Trust Profile
- Care Booking
- Course Enrollment
- Easy Booking

No Customize wizard, Recommendation Engine, Summary, centralized WhatsApp handoff, Public Webzoka redirect, Hub integration, checkout, accounts, pricing calculator, new template, merge, or production deployment was started.

Verdict: S3 implementation and fresh validation complete. Awaiting Chat approval before S4.

## Repository

| Field | Value |
|---|---|
| Repository | `ja-websitebuilder-platform` |
| Worktree | `D:\Project\Website JapanArena\JapanArena SaaS\.wt-webzoka-v7-prototype` |
| Branch | `codex/webzoka-v7-prototype` |
| Remote | `https://github.com/RiGi26/ja-websitebuilder-platform.git` |
| Production deploy | Not performed |

## Store index architecture

`/store` now uses the canonical `STORE_TEMPLATE_REGISTRY` for visible templates, ordering, featured state, name, category, business fit, descriptions, capabilities, status, routes, and price presentation.

Structure:

- `StoreShell` provides Store navigation, mobile drawer, skip link, focus management, and safe-area handling.
- `StoreIndex` provides the short hero, search, category filter, `Saya ingin…` filter, featured section, six-template catalog, reset state, and no-results state.
- `StoreCard` renders the shared card contract without ratings, reviews, sold counts, or fake popularity.

Warm Commerce is shown in `Pilihan unggulan` and remains present in the six-template catalog.

## Filter behavior

| Control | Behavior |
|---|---|
| Search | URL key `q`; matches name, short name, category, business-type labels, positioning, short description, and capability labels. |
| Category | URL key `category`; matches one canonical `StoreCategoryId`. |
| `Saya ingin…` | URL key `intent`; matches the selected baseline or optional capability ID. Labels are buyer-friendly; optional matches are not presented as included. |
| Combined state | AND semantics across all active controls. |
| Reset | Clears `q`, `category`, and `intent`, returning to all six visible templates. |
| No results | Shows recovery copy and `Reset pencarian`. |

Filter state is deep-linkable and preserved by URL navigation. Query keys are omitted when empty.

## Shared primitives

- `TemplateStatusBadge` uses canonical `STORE_STATUS_LABELS` for `Preview tersedia`, `Live`, and `Segera hadir`.
- `StoreCard` shows name, category, positioning, business fit, Website starting-price presentation, truthful status, `Lihat Template`, and optional `Preview`.
- `StoreTemplateDetailPage` provides the shared detail contract: breadcrumb/back, name/category/status, positioning, business fit, customer capabilities, included features, optional features, price education for Website → Website + Portal → Bundle, Preview CTA, and honest S4 Customize boundary.
- `StorePreviewFrame` and `PreviewToolbar` provide shared back-to-detail, template identity/category, truthful status, and `Gunakan Template Ini` navigation.
- `BUSINESS_TYPE_LABELS`, `STORE_CATEGORY_LABELS`, `STORE_STATUS_LABELS`, `STORE_INTENT_FILTERS`, and `CAPABILITY_TAXONOMY` are the canonical label sources.

## Dynamic route result

Added:

- `/store/template/[slug]`
- `/store/template/[slug]/preview`

Both routes use `generateStaticParams` over the six frozen `TEMPLATE_SLUGS`, typed registry lookup, and `notFound()` for unknown values. Preview resolution is an explicit typed switch from registry slug to the existing runtime component; it is not generic JSON-driven rendering.

Explicit route files remain as thin compatibility checkpoints so existing URL ownership stays stable and generated route validation remains deterministic. They delegate to the same shared detail/preview renderers as the dynamic route tree. No public redirects were added.

## Preview preservation

All six runtime experiences retain their internal design, navigation, content, local controls, demo boundary copy, and interaction logic. Only the outer preview strip is consolidated into `PreviewToolbar`; runtime-specific preview strips are disabled when the shared frame is used. Warm Commerce keeps its local assets, mobile menu, category filter, inquiry boundary, and fictional-business disclosure.

## Accessibility and responsive results

- One H1 per Store, detail, and preview route.
- Search and select controls have semantic labels, correct input type, 44px+ control heights, visible focus styles, and URL-backed state.
- Store mobile menu opens/closes with a labeled button, traps Tab focus, closes on Escape, and restores focus to the trigger.
- Shared Store layout uses mobile-first stacking, safe-area padding, `touch-action: manipulation`, visible focus rings, and reduced-motion rules.
- Fresh browser checks at 390×844, 768×900, and 1440×900 showed no horizontal overflow on Store, all six detail routes, or all six preview routes.
- All meaningful images retain alt text; decorative Lucide icons are hidden from assistive tech.
- Captured browser console error list was empty across the six previews.

## Validation evidence

Fresh validation on 2026-09-12:

- `npm run typecheck` — exit 0.
- `npx vitest run src/lib/store/templates.test.ts` — 9 tests passed, 0 failed.
- `npm run build` — exit 0 on Next.js 16.2.6 with Turbopack; six explicit detail routes, six explicit preview routes, and both typed dynamic route families generated successfully.
- `git diff --check` — exit 0.
- Local HTTP matrix — `/store`, all six detail routes, all six preview routes returned `200`; unknown dynamic detail and preview slugs returned `404`.
- Vercel Preview HTTP matrix — `/store`, all six detail routes, and all six preview routes returned `200`; unknown dynamic detail and preview slugs returned `404`.
- Browser UAT — exact `1440×900`, `768×900`, and `390×844` checks covered Store browse, combined filters, reset/no-results, mobile menu/Escape/focus restoration, all six details, and all six previews. Every hydrated route had one H1, no horizontal overflow, and no captured console errors. Five client-only preview runtimes do not emit their runtime H1 in raw SSR HTML; browser hydration restored the approved one-H1 result.
- New Vercel Preview — target `preview`, status `Ready`, deployment ID `dpl_GbJDF6EZHtkn6MF1hUaQVpTkBSq8`, URL [ja-websitebuilder-platform-o8dp8r7po-rigi26s-projects.vercel.app](https://ja-websitebuilder-platform-o8dp8r7po-rigi26s-projects.vercel.app), source commit `323860d`.
- No production deployment was performed.

## Known deviations

- Existing route-local runtime files remain in their current folders. S3 standardizes their outer contract without broad runtime refactoring.
- The S3 `Gunakan Template Ini` action lands on an honest Customize boundary; it does not create an account, submit a lead, open checkout, or send WhatsApp.
- `npm run lint` remains the existing repo script and was not changed; run only if the repo’s current Next.js lint command is functional.

## Deferred to S4/later

Customize wizard, Recommendation Engine, Summary, centralized WhatsApp handoff, Hub integration, checkout, accounts, pricing calculator, live availability, persistent leads, public route redirects, merge, production deploy, and new templates.

## Stop decision

S3 stops here. Exact decision needed from Chat: approve or reject the S3 shared foundation and dynamic route resolution for later S4 planning. Do not start Customize.
