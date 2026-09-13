# Webzoka Store V2 — S5 Recommendation Engine Review

Status: S5 bounded revision complete; stopped before S6 Consultation Summary and final approval.

Date: 2026-09-12

## Scope

S5 adds a pure, deterministic rule-based recommendation engine that consumes the normalized S4 `CustomizeDraft`. It returns one of `Website`, `Website + Portal`, `Bundle`, or `Perlu konsultasi`, with grouped capability evidence and buyer-facing Indonesian reasons.

S5 does not add a Summary route, centralized WhatsApp handoff, backend persistence, CRM, Hub integration, checkout, payments, accounts, pricing calculation, AI recommendation, provisioning, or new templates. No merge or production deployment is included.

## Implementation

- Engine: `src/lib/store/recommendation.ts`
- Canonical result types: `src/lib/store/types.ts`
- Focused matrix tests: `src/lib/store/recommendation.test.ts`
- Completion integration: `src/app/store/components/CustomizeWizard.tsx`
- Completion styles: `src/app/store/components/CustomizeWizard.module.css`

API:

```ts
recommendStoreSolution(draft: CustomizeDraft, template: StoreTemplate): RecommendationResult
```

Result shape:

```ts
{
  tier: 'website' | 'website-portal' | 'bundle' | 'consultation'
  label: string
  summary: string
  reasons: readonly string[]
  evidence: {
    publicCapabilities: readonly CapabilityId[]
    operationalCapabilities: readonly CapabilityId[]
    accountCapabilities: readonly CapabilityId[]
  }
  templateSlug: TemplateSlug
  requiresConsultation: boolean
  consultationCode?: RecommendationConsultationCode
}
```

## Rule precedence

1. Runtime integrity and template support guards return consultation for malformed or incomplete completed drafts, unknown/unsupported capabilities, or cross-template drafts. Business-category mismatch is advisory context only and never a consultation trigger by itself.
2. Contradictory operational state returns consultation, including no-dashboard plus selected operations, selected operations with no capability, or unsure mode with selected operations.
3. Both core uncertainty markers with no public, operational, or account signal return consultation. One `Belum yakin` marker and readiness uncertainty (logo, domain, photos, catalog/copy, timeline) do not override a stronger signal. The retained S4 `needsConsultation` flag is compatibility state, not an unconditional tier override.
4. No public, operational, or account signal returns consultation. A valid operational signal does not require a public selection.
5. Persistent account state such as order tracking, booking history, learning materials, attendance, or membership returns Bundle without operations.
6. Account/member needs combined with operations, or generic login plus `order-request`, `booking-request`, or `enrollment-request`, returns Bundle. `schedule-info` is excluded; generic login without a connected workflow returns consultation.
7. Supported operational needs, including `ops.payment-management`, without account/member needs return Website + Portal. Payment is classified only; no payment implementation is implied.
8. Public-only needs, including explicit no-dashboard, return Website.

`baseRecommendation` and `upgradeRecommendation` provide registry context only and cannot override actual selections.

## Template behavior

One taxonomy-driven engine handles all six templates. `customerCan` gates public selections and `optionalCapabilities` gates operational/account selections. Category mismatch is not a hard template restriction.

- Warm Commerce: order management → Website + Portal; customer login/order tracking with operations → Bundle.
- Modern Catalog: inventory/customer management → Website + Portal; supported account workflow with operations → Bundle.
- Trust Profile: inquiry follow-up/data management → Website + Portal; generic member login without a clear service workflow → consultation.
- Care Booking: booking management → Website + Portal; login/history with booking operations → Bundle.
- Course Enrollment: public program/enrollment → Website; enrollment/class management → Website + Portal; student login plus learning materials/attendance or operational workflow → Bundle.
- Easy Booking: availability/inventory/booking management → Website + Portal; customer login/history with booking operations → Bundle.

## Persistence and integration boundary

The completion button changes the existing S4 draft to `complete`. The UI derives `RecommendationResult` from that draft and selected template during render, then shows only a compact tier, summary, and one or more reasons. No second recommendation payload is persisted.

The existing `webzoka.store.customize.v1:{templateSlug}` session payload remains the only client-side storage. Refresh restores the draft and recomputes the result; changing an answer returns the wizard to draft mode, so the next completion recomputes from current answers. Per-template keys prevent recommendation leakage between templates.

## Final test matrix

| # | Scenario | Result |
|---:|---|---|
| 1 | Public + operations + undecided timeline | Website + Portal |
| 2 | Public-only + missing/help readiness assets | Website |
| 3 | Customer and operations both `Belum yakin`, no stronger signal | Perlu konsultasi |
| 4 | One non-core readiness uncertainty | Does not change tier |
| 5 | Category mismatch + supported public needs | Website |
| 6 | Category mismatch + operations | Website + Portal |
| 7 | Payment management + public context | Website + Portal |
| 8 | Payment management + account workflow | Bundle |
| 9 | Generic login + `schedule-info` | Perlu konsultasi |
| 10 | Generic login + `booking-request` | Bundle |
| 11 | Generic login + `order-request` | Bundle |
| 12 | Generic login + `enrollment-request` | Bundle |
| 13 | Order tracking state | Bundle |
| 14 | Booking history state | Bundle |
| 15 | Learning materials state | Bundle |
| 16 | Attendance state | Bundle |
| 17 | Membership state | Bundle |
| 18 | Public-only baseline across six templates | Website |
| 19 | Operations baseline | Website + Portal |
| 20 | Account + operations | Bundle |
| 21 | Contradictory operational selections | Perlu konsultasi |
| 22 | Unsupported runtime capability | Perlu konsultasi |
| 23 | Same input twice | Identical deterministic result |
| 24 | Reasons | Non-empty, Indonesian, buyer-facing |
| 25 | Course Enrollment three tiers | Pass |
| 26 | Care Booking operations | Pass |
| 27 | Easy Booking inventory | Pass |
| 28 | Warm Commerce order management | Pass |

The final bounded revision also explicitly covers: Easy Booking ops-only booking + inventory → Website + Portal; Warm Commerce ops-only order management → Website + Portal; customer-needs uncertainty with clear operations → Website + Portal; no public + no operations + no account → Consultation; and generic login only → Consultation.

Fresh focused Vitest covered this matrix with 35 tests:

```text
npx vitest run src/lib/store/recommendation.test.ts src/lib/store/templates.test.ts src/lib/store/customize.test.ts
3 files passed, 34 tests passed
```

## Validation evidence

- `npm run typecheck`: exit 0.
- `npm run build`: exit 0; six Customize, six detail, and six preview SSG route families generated. Existing Sentry deprecation and multiple-lockfile workspace-root warnings remained non-blocking.
- `git diff --check`: exit 0.
- `npm run lint`: exit 1 because the existing script invokes `next lint` as a directory (`Invalid project directory ...\\lint`); lint configuration was not changed.
- Local production HTTP matrix: `/store`, all six detail routes, all six preview routes, all six Customize routes, and unknown Customize slug returned `200/404` as expected; every successful response contained one `<h1>`; 0 failures.
- Preview HTTP matrix: same 20-route coverage returned `200/404` as expected; 0 failures.

## Exact viewport evidence

The recorded browser evidence is a sampled tier/viewport matrix, not every tier at every viewport. Verified examples:

- Website @ `1440×900`.
- Website + Portal @ `768×900`.
- Bundle @ `390×844`.
- Consultation @ `390×844`.

This bounded revision changed only the recommendation engine, focused tests, and S5 docs; no UI source changed, so no full viewport rerun was required.

Fresh local and deployed-preview browser checks used explicit viewport overrides for those samples:

- `1440×900`: Website visible. Local Modern Catalog category mismatch still returned Website; deployed Warm Commerce public-only returned Website. `scrollWidth === clientWidth` (1425 after scrollbar subtraction).
- `768×900`: Local edit flow recomputed Website → Website + Portal after changing the previous answer to order management. Deployed Easy Booking operations returned Website + Portal. `scrollWidth === clientWidth` (753).
- `390×844`: Local Course Enrollment account/persistent-state flow returned Bundle and stayed Bundle after refresh; local Trust Profile generic login returned Perlu konsultasi. Deployed Course Enrollment returned Bundle and stayed Bundle after refresh; deployed Trust Profile returned Perlu konsultasi. `scrollWidth === clientWidth` (375).
- All four visible result classes were directly observed: Website, Website + Portal, Bundle, and Perlu konsultasi.
- Long reason wrapping: mobile recommendation reason rendered inside a 256px content column with `scrollWidth === clientWidth`; measured heights 67px local payment case and 112px deployed Bundle case, confirming wrapping without horizontal overflow.
- Touch controls: local 390px completion controls measured 44px for links/reset and 48px for completion buttons; no visible interactive control measured below 44px.
- Recompute/restore: local and deployed edit/refresh checks changed or restored the result from the current per-template draft; distinct template flows retained their own result class and template context.
- Edge-case UI flows: local category mismatch → normal tier, payment-management without account → Website + Portal, generic login + schedule-info → Perlu konsultasi, booking/order/enrollment connected workflows → Bundle, and persistent account state → Bundle.

## Console / network evidence

- Local CUA browser console capture: `[]` error/warning entries across the S5 flows.
- Deployed preview CUA browser console capture: `[]` error/warning entries.
- HTTP regression was verified for `/store`, all six detail routes, all six preview routes, all six Customize routes, and an unknown Customize slug returning 404.
- S5 engine is client-only and makes no recommendation API request. Comprehensive browser failed-request capture was unavailable, so this packet does not claim universal `no failed network requests`.
- `NoFallbackError` observed during local server shutdown is a P2 investigation note only, not a proven user-facing defect. The existing root `SpeedInsights` integration remains a known unrelated local warning from earlier S4 runs; it is outside S5 and did not appear in the inspected CUA console captures.

## Deployment

New Vercel Preview is Ready:

- URL: `https://ja-websitebuilder-platform-c9anlhhsn-rigi26s-projects.vercel.app`
- Deployment ID: `dpl_DFN12PeSk8MWbepEpse6objq2th2`
- Target/status: `preview` / `Ready`
- Deployed build completed successfully; preview browser UAT passed at 1440×900, 768×900, and 390×844.
- No production deployment was made.

No production deployment was made.

## P0/P1/P2

- P0: none identified.
- P1: none identified.
- P2: `NoFallbackError` during local server shutdown is investigation-only, not a proven user-facing defect; existing lint-command issue; existing local SpeedInsights warning; Vercel install reported 13 dependency audit findings; client-only session durability remains the approved V1 boundary.

## Deferred to S6

Consultation Summary route, edit/back summary presentation, centralized WhatsApp generator/configuration, URL length/fallback handling, and any final lead-handoff decision.

## Decision requested

Approve or request bounded revision for the final S5 precedence, grouped evidence/result shape, and compact completion-state display. Do not start S6 until approved.
