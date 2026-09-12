# Webzoka Store V2 — S5 Recommendation Engine Review

Status: S5 implementation complete; stopped before S6 Consultation Summary.

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

1. Runtime integrity and template support guards return consultation for malformed or incomplete completed drafts, unknown/unsupported capabilities, cross-template drafts, or a business category that does not match the selected template.
2. Explicit `needsConsultation` or any unresolved S4 `Belum yakin` marker returns consultation.
3. Contradictory operational state returns consultation, including no-dashboard plus selected operations, or selected operations with no capability.
4. Missing customer context returns consultation. A completed draft must contain at least one public or account need.
5. `ops.payment-management` returns consultation because S5 does not define checkout or payment implementation.
6. Account/member needs combined with operations, or a clearly connected customer workflow, return Bundle.
7. Account state such as order tracking, booking history, learning materials, attendance, or membership returns Bundle without operations. Generic login alone without connected workflow returns consultation.
8. Supported operational needs without account/member needs return Website + Portal.
9. Public-only needs, including explicit no-dashboard, return Website.

`baseRecommendation` and `upgradeRecommendation` provide registry context only and cannot override actual selections.

## Template behavior

One taxonomy-driven engine handles all six templates. `customerCan` gates public selections and `optionalCapabilities` gates operational/account selections.

- Warm Commerce: order management → Website + Portal; customer login/order tracking with operations → Bundle.
- Modern Catalog: inventory/customer management → Website + Portal; supported account workflow with operations → Bundle.
- Trust Profile: inquiry follow-up/data management → Website + Portal; generic member login without a clear service workflow → consultation.
- Care Booking: booking management → Website + Portal; login/history with booking operations → Bundle.
- Course Enrollment: public program/enrollment → Website; enrollment/class management → Website + Portal; student login plus learning materials/attendance or operational workflow → Bundle.
- Easy Booking: availability/inventory/booking management → Website + Portal; customer login/history with booking operations → Bundle.

## Persistence and integration boundary

The completion button changes the existing S4 draft to `complete`. The UI derives `RecommendationResult` from that draft and selected template during render, then shows only a compact tier, summary, and one or more reasons. No second recommendation payload is persisted.

The existing `webzoka.store.customize.v1:{templateSlug}` session payload remains the only client-side storage. Refresh restores the draft and recomputes the result; changing an answer returns the wizard to draft mode, so the next completion recomputes from current answers. Per-template keys prevent recommendation leakage between templates.

## Validation evidence

- `npm run typecheck`: exit 0.
- `npx vitest run src/lib/store/recommendation.test.ts src/lib/store/templates.test.ts src/lib/store/customize.test.ts`: 3 files, 28 tests passed.
- `npm run build`: exit 0; six Customize, six detail, and six preview SSG route families generated. Existing Sentry deprecation and multiple-lockfile workspace-root warnings remain non-blocking.
- `git diff --check`: pass.
- `npm run lint`: not run; the existing script is known non-functional under the current Next.js setup (`Invalid project directory ...\\lint`), and no lint configuration changed.
- HTTP smoke on local production server: `/store`, all six detail routes, all six preview routes, all six Customize routes, and unknown Customize slug. Expected 200/404 statuses and one H1 per successful page; 0 failures.
- Browser UAT on local production server: Warm Commerce public-only → Website; edit prior answer to order management → Website + Portal; refresh restoration; Course Enrollment student login + learning materials → Bundle; Trust Profile generic member login → Perlu konsultasi. Current browser smoke showed no visible app error and no horizontal overflow at the available responsive browser viewport.
- Exact 1440×900, 768×900, and 390×844 viewport controls were unavailable in the active in-app browser surface; prior S4 exact-viewport regression remains covered, while S5-specific completion behavior was verified in the active browser surface and through the route/build matrix.

## Deployment

S5 changes the visible Customize completion state, so a new Vercel Preview is required after the validated branch push. Record the Ready URL, deployment ID, source commit, and preview smoke result here before closing the packet. No production deployment is allowed.

## P0/P1/P2

- P0: none identified.
- P1: none identified.
- P2: existing lint-command issue; existing local SpeedInsights warning; client-only session durability remains the approved V1 boundary.

## Deferred to S6

Consultation Summary route, edit/back summary presentation, centralized WhatsApp generator/configuration, URL length/fallback handling, and any final lead-handoff decision.

## Decision requested

Approve or reject the S5 precedence, generic-login consultation rule, payment-scope consultation rule, grouped evidence/result shape, and compact completion-state display. Do not start S6 until approved.
