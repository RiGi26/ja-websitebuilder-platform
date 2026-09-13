# Webzoka Store V2 — S2 Warm Commerce Consolidation Review

Status: S2 implementation complete. Stopped before S3.

Date: 2026-09-12

## Scope and verdict

Warm Commerce runtime and required image assets now live in the canonical `ja-websitebuilder-platform` Store. The migrated experience keeps the approved fictional Dapur Rona direction: warm editorial food presentation, practical catalog browsing, inquiry-first behavior, story/process/location content, mobile navigation, and no cart or checkout.

S2 did not standardize `/store`, add filters to the Store index, redesign shared cards, migrate dynamic routes, build Customize, build Recommendation Engine, build Summary, add WhatsApp handoff architecture, add redirects, edit the public source repo, merge, or deploy production.

Verdict: parity gate passed for the explicit canonical Warm Commerce routes. S3 remains separately approval-gated.

## Repositories

| Role | Repository | Worktree | Branch | Result |
|---|---|---|---|---|
| Canonical Store | `ja-websitebuilder-platform` | `D:\Project\Website JapanArena\JapanArena SaaS\.wt-webzoka-v7-prototype` | `codex/webzoka-v7-prototype` | Changed, committed, pushed |
| Warm Commerce source | `ja-landingpage-platform` | `D:\Project\Website JapanArena\JapanArena SaaS\.wt-webzoka-v7-public-homepage` | `codex/webzoka-v7-public-homepage` | Read-only; clean; no changes |

## Source inventory and migration decisions

| Source dependency | S2 treatment |
|---|---|
| Warm Commerce detail route and CSS module | Migrated to explicit canonical detail route and local CSS module |
| `WarmCommerceSite` client experience and CSS module | Migrated into canonical route folder with the smallest import adaptations |
| Warm Commerce data model | Copied into `warm-commerce-data.ts` beside the runtime |
| Source StoreShell and PreviewToolbar | Duplicated as temporary Store-local primitives; public-only links/assets removed or adapted |
| `constants/site` and source `waLink` | Replaced by `src/lib/store/whatsapp.ts`, scoped to Store and `NEXT_PUBLIC_WEBZOKA_WHATSAPP_NUMBER` |
| Source Store logo asset | Omitted; canonical local StoreShell uses a text mark to avoid copying unrelated public assets |
| Shared tokens/components | No broad extraction; Store layout exposes the source display/body font variables only to the Warm runtime |

## Files added or migrated

- `src/app/store/template/warm-commerce/page.tsx`
- `src/app/store/template/warm-commerce/preview/page.tsx`
- `src/app/store/template/warm-commerce/warm-commerce-data.ts`
- `src/app/store/template/warm-commerce/WarmCommerceSite.tsx`
- `src/app/store/template/warm-commerce/WarmCommerceSite.module.css`
- `src/app/store/template/warm-commerce/WarmCommerceDetail.module.css`
- `src/app/store/components/StoreShell.tsx`
- `src/app/store/components/StoreShell.module.css`
- `src/app/store/components/PreviewToolbar.tsx`
- `src/app/store/components/PreviewToolbar.module.css`
- `src/lib/store/whatsapp.ts`
- `public/images/store/warm-commerce/`

Existing files updated:

- `src/app/store/layout.tsx` — Warm typography variables scoped to Store wrapper.
- `src/lib/store/templates.ts` — Warm runtime state moved to canonical local/preview/visible state.
- `src/lib/store/templates.test.ts` — Registry expectations updated for the migrated state.

## Assets

Four unique WebP assets were migrated. The source has five product entries, but the spread image is intentionally reused for the drink/package presentation.

- `dapur-rona-spread.webp` — 188,222 bytes
- `nasi-ayam-kemangi.webp` — 170,206 bytes
- `pastel-ayam.webp` — 144,596 bytes
- `pempek-kapal-selam.webp` — 127,684 bytes

Image quality and source alt semantics were preserved. No unrelated Public Webzoka assets were copied.

## Canonical routes

- `/store/template/warm-commerce`
- `/store/template/warm-commerce/preview`

Routes remain explicit in S2. Dynamic `[slug]` migration remains S3.

## Parity outcome

- Hero: Dapur Rona identity, warm editorial headline, food photography, service notes, menu CTA, and inquiry CTA preserved.
- Catalog: category controls, featured product, five menu entries, pricing, descriptions, and inquiry links preserved.
- Product inquiry: every menu inquiry remains inquiry-first; no cart, checkout, fake stock, ratings, reviews, or urgency language added.
- Content: story, process, location, opening hours, fictional/demo boundary copy, package promotion, and final CTA preserved.
- Mobile: mobile menu, Escape close behavior, focus return to the menu trigger, and touch-sized controls preserved.
- Accessibility: skip link, semantic headings, image alts, keyboard-capable links/controls, focus-visible styles, and reduced-motion CSS retained.

## WhatsApp behavior

No production number is hard-coded. `src/lib/store/whatsapp.ts` reads `NEXT_PUBLIC_WEBZOKA_WHATSAPP_NUMBER` and returns `null` when absent. Local and Preview deployments without that env value show an explicit unavailable notice and non-navigating inquiry state. This is honest prototype behavior, not the S6 handoff architecture.

## Browser evidence

Evidence was captured against the canonical local build and the new Vercel Preview.

- 1440×900: desktop hero and image/text split render correctly; no layout collapse.
- 768×900: intermediate layout remains readable with the canonical preview toolbar and Warm Commerce navigation.
- 390×844: mobile header/menu and hero render without horizontal overflow.
- Mobile menu: opens to an exposed mobile navigation region and closes on Escape with focus remaining on the trigger.
- Category filter: Camilan changes the catalog to the single Pastel Ayam result.
- DOM checks at 390×844: `documentWidth=375`, `bodyWidth=375`, `oneH1=1`; hero image has a non-empty alt.

## Registry transition and Store index impact

| Field | S1 before S2 | S2 after |
|---|---|---|
| `previewStatus` | `coming-soon` | `preview` |
| `runtimeStatus` | `pending-migration` | `local` |
| `runtimeOwner` | `public-webzoka` | `canonical-store` |
| `storeIndexVisibility` | `hidden-until-runtime` | `visible` |
| `featured` | `true` | `true` |

The current `/store` page remains the existing five-card composition and does not yet merchandise Warm Commerce. Registry truth now reflects runtime readiness, while Store index activation is deferred to S3 so S2 does not redesign the browse experience.

## Validation evidence

- `npm run typecheck` — exit 0.
- `npx vitest run src/lib/store/templates.test.ts` — 7 tests passed, exit 0.
- `npm run build` — exit 0; canonical Warm detail/preview routes generated.
- `git diff --check` — pass after commit cleanup.
- Local HTTP matrix — `/store` plus all six detail/preview pairs returned 200 with one H1 each.
- Vercel Preview HTTP matrix — same 13 routes returned 200 with one H1 each.
- Vercel Preview build — Ready.

## Preview deployment

- URL: https://ja-websitebuilder-platform-8d2w0ulpd-rigi26s-projects.vercel.app
- Deployment ID: `dpl_HUq3GxzmwBHXvt8x4KgnVjgATRbv`
- Target: `preview`
- Status: `Ready`
- Production deployment: not performed.

## Known deviations

- Canonical StoreShell uses a local text mark instead of importing the public repo logo asset.
- Canonical StoreShell utility link returns to `/store`; public-repo root links were not carried across the repository boundary.
- WhatsApp inquiry links stay unavailable until the approved env key is configured.
- The Store index does not yet surface Warm Commerce despite registry visibility being `visible`; that merchandising activation belongs to S3.

## Deferred

- S3 Store browse standardization, shared cards, filters, status presentation, and dynamic route wrappers.
- Customize, Recommendation Engine, Summary, centralized WhatsApp handoff, Hub integration, redirects/retirement of old public routes, merge, and production launch QA.

## Commits

- `6097eb7 feat(store): migrate Warm Commerce runtime into canonical Store`
- Documentation commit recorded with this review note and architecture checkpoint.
