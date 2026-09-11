# Webzoka Store V2 — System Architecture Consolidation Plan

Status: S0 approved. S1 registry and capability-taxonomy implementation is authorized; S2+ work remains gated.

Date: 2026-09-11

## TASK STATUS

Architecture planning complete and approved in Chat. S1 is limited to the static typed registry, normalized capability taxonomy, focused validation, and this checkpoint update. No Warm Commerce migration, route refactor, Store redesign, redirect, merge, or deploy is part of S1.

## 1. Approved S0 decisions

1. `ja-websitebuilder-platform` owns canonical Store V2. `ja-landingpage-platform` remains Public Webzoka.
2. Canonical Store hostname target: `store.webzoka.com`.
3. Old Public Webzoka Store routes will later use 308 redirects to equivalent canonical routes, not a reverse proxy. Redirect work waits for Warm Commerce parity and host approval.
4. Store WhatsApp configuration uses `NEXT_PUBLIC_WEBZOKA_WHATSAPP_NUMBER`. Preview/dev shows an honest unavailable state when missing; a missing number blocks production launch readiness.
5. Warm Commerce is the initial featured template after parity validation. V1 remains frozen at six flagship templates.
6. Pricing presentation is truthful and scope-based: Website `Mulai Rp600.000`; Website + Portal `Harga menyesuaikan kebutuhan`; Bundle `Harga menyesuaikan scope`. No fake final per-template prices.
7. `Website` means public-facing only; `Website + Portal` adds an internal/admin operational system; `Bundle` adds customer/member login or connected workflow.
8. Course Enrollment maps from program plus enrollment inquiry (`Website`) to admin enrollment management (`Website + Portal`) and student login/schedule/material/attendance/payment (`Bundle`) as scope requires.
9. Target routes are `/store`, `/store/template/[slug]`, `/store/template/[slug]/preview`, `/store/customize/[slug]`, and `/store/summary`. Dynamic route wrappers wait for explicit-route parity.
10. Trust Profile's primary conversion will later use shared Customize / WhatsApp flow, replacing demo email CTA.
11. Warm Commerce migrates to canonical Store in S2. Public routes retire to 308 redirects only after parity.

## REPOS / WORKTREES INSPECTED

| Area | Repository | Worktree | Branch | Evidence inspected |
|---|---|---|---|---|
| Candidate canonical Store V2 | `ja-websitebuilder-platform` | `D:\Project\Website JapanArena\JapanArena SaaS\.wt-webzoka-v7-prototype` | `codex/webzoka-v7-prototype` | `src/app/store`, `src/app/store/store.css`, five template experiences, `docs/webzoka-store-v2-*-review.md`, `src/data/templates.ts`, `src/lib/wa.ts`, app layout/config |
| Public Webzoka / Warm Commerce | `ja-landingpage-platform` | `D:\Project\Website JapanArena\JapanArena SaaS\.wt-webzoka-v7-public-homepage` | `codex/webzoka-v7-public-homepage` | `app/store`, `components/store`, `components/warm-commerce`, `data/warm-commerce.ts`, `constants/site.ts`, Warm Commerce review/log docs, product marketing context, UI standards |

Both worktrees were clean at inspection time. Both branches track their matching `origin/codex/...` branch. No files were changed before this plan document.

Project-level `AGENTS.md` and `CLAUDE.md`, repo-level `CLAUDE.md`, the system-architecture guidance, UI-design guidance, UI/UX guidance, mobile contract, and Warm Commerce design-review instructions were read before planning.

## 2. Current Store V2 findings

### Canonical candidate

`ja-websitebuilder-platform` already owns the Store V2 route family:

- `/store`
- `/store/template/modern-catalog`
- `/store/template/modern-catalog/preview`
- `/store/template/trust-profile`
- `/store/template/trust-profile/preview`
- `/store/template/care-booking`
- `/store/template/care-booking/preview`
- `/store/template/course-enrollment`
- `/store/template/course-enrollment/preview`
- `/store/template/easy-booking`
- `/store/template/easy-booking/preview`

The Store index in `src/app/store/page.tsx` manually renders five cards and explicitly says Warm Commerce remains outside the prototype round. The five detail and preview pages use explicit route folders and local `*Experience` components with a `detail | preview` mode. Their shared CSS is currently one large route stylesheet, `src/app/store/store.css`, with isolated namespaces such as `mc-*`, `tp-*`, `cb-*`, `ce-*`, and `eb-*`.

The approved review packets provide the strongest current product evidence. They consistently describe static/demo behavior, truthful preview boundaries, 44px controls, mobile checks at 390x844, and no fake availability, payment, account, or operational claims.

`src/data/templates.ts` is an older commercial template catalog with unrelated slugs, remote demo URLs, ratings, and price data. It must not become the Store V2 registry without an explicit content migration decision.

### Public Webzoka / Warm Commerce

`ja-landingpage-platform` currently owns:

- `/store` with one Warm Commerce card;
- `/store/template/warm-commerce` detail;
- `/store/template/warm-commerce/preview` preview;
- `StoreShell` with desktop sidebar and mobile drawer;
- `PreviewToolbar` for the preview route;
- `WarmCommerceSite` as the unique interactive runtime;
- `data/warm-commerce.ts` for metadata, Dapur Rona demo content, categories, products, prices, and image alt text;
- Warm Commerce CSS modules and image assets under `public/images/store/warm-commerce`.

`constants/site.ts` already centralizes the public app's Webzoka WhatsApp number through `NEXT_PUBLIC_WA_NUMBER` and a `waLink` helper. The canonical repo's existing `src/lib/wa.ts` is tenant-specific and should not be overloaded with Store lead-handoff configuration.

## 3. Canonical ownership recommendation and evidence

### Recommendation

Make `ja-websitebuilder-platform` the canonical owner of Store V2, its six template detail/preview runtimes, the customize flow, recommendation engine, consultation summary, and Store WhatsApp handoff.

Keep `ja-landingpage-platform` as Public Webzoka: homepage, pricing/marketing pages, public navigation, and a temporary redirect/deep-link bridge to the canonical Store.

### Evidence

1. Five of the six approved V1 flagship templates already live under the canonical repo's `/store` route family.
2. The canonical repo contains the shared route stylesheet, Next app layout, existing theme/rendering conventions, and the review packets for four of the current Store V2 prototypes.
3. The public repo contains only one Store template and its Store shell is optimized for the public marketing app, not a six-template registry or multi-step consultation product.
4. The product flow ends in a website-builder consultation and future Website/Portal/Bundle decision, which belongs beside the website-builder ownership boundary rather than inside the public marketing shell.
5. Keeping two Store owners would duplicate registry truth, status truth, preview links, CTA behavior, WhatsApp configuration, and future route changes.

### Boundary

`ja-landingpage-platform` may link to Store and temporarily redirect old Store URLs. It must not remain a second source of truth for template metadata, preview status, recommendation rules, or lead summary formatting.

`ja-websitebuilder-platform` owns the Store V2 user journey. It does not absorb the entire Public Webzoka site, its public homepage components, or unrelated marketing routes.

## 4. Warm Commerce consolidation plan

Migration is planned only. Do not execute it in this task.

### Source files/data/assets to migrate

From `ja-landingpage-platform`:

- `app/store/template/warm-commerce/page.tsx`
- `app/store/template/warm-commerce/preview/page.tsx`
- `app/store/template/warm-commerce/WarmCommerceDetail.module.css`
- `components/warm-commerce/WarmCommerceSite.tsx`
- `components/warm-commerce/WarmCommerceSite.module.css`
- `data/warm-commerce.ts`
- `public/images/store/warm-commerce/dapur-rona-spread.webp`
- `public/images/store/warm-commerce/nasi-ayam-kemangi.webp`
- `public/images/store/warm-commerce/pastel-ayam.webp`
- `public/images/store/warm-commerce/pempek-kapal-selam.webp`

Carry the Warm Commerce review evidence into a canonical review packet, preserving the original public-repo review/log files as history until the public route is retired.

Do not copy all of `constants/site.ts`. Extract only the Store-specific contact contract into the canonical Store utility and use an explicit canonical environment variable.

### Shared primitives to adopt

- registry metadata and status badge;
- shared Store breadcrumb/detail frame;
- shared Preview toolbar with template name, Preview status, back link, and customize CTA;
- shared CTA/contact link helper;
- shared WhatsApp message/link generator;
- common skip-link, focus, disclosure, mobile-menu, and reduced-motion behavior;
- common responsive spacing and status tokens.

The public `StoreShell` desktop sidebar/mobile drawer is a useful interaction reference, but it should be adapted into the canonical Store chrome rather than copied as a second shell. Existing canonical template runtimes use their own visual topbars and palettes; the migration must not flatten those directions into one visual theme.

### Unique UX to preserve

- warm food photography and meaningful alt text;
- Dapur Rona demo narrative;
- category filtering for Makanan, Camilan, Minuman, and Paket;
- featured product plus supporting products;
- visible product price examples without implying live stock;
- WhatsApp inquiry path;
- location, hours, story, process, and FAQ sections;
- honest boundary that the preview is not cart, checkout, payment, live stock, or confirmed order;
- mobile menu, Escape-to-close, focus restoration, and 44px interaction targets.

### Parity checks before cutover

1. Canonical Warm detail and preview routes return 200 and preserve metadata/robots behavior.
2. All five image assets load from the canonical public directory with zero missing alt text.
3. Exact 1440x900 and 390x844 checks show one H1, no horizontal overflow, no console errors, and no failed image/network requests.
4. Category filtering, mobile navigation, Escape, focus restoration, product inquiry links, and location links behave as before.
5. Preview status remains truthful: inquiry only, no live availability, no checkout, no payment, no account, no external form submission from the demo.
6. Store index card, detail CTA, preview toolbar, and customize CTA all resolve to the canonical route family.

### Later handling of old Public Webzoka routes

After canonical Warm Commerce passes parity and the canonical host is approved:

- add temporary 308 redirects in `ja-landingpage-platform` from `/store` to canonical `/store`;
- redirect `/store/template/warm-commerce` to canonical Warm detail;
- redirect `/store/template/warm-commerce/preview` to canonical Warm preview;
- preserve query strings and UTM parameters;
- verify redirects, canonical metadata, analytics attribution, and deep links;
- only then remove the old Store implementation from the public repo.

Do not delete the public routes before the canonical host, redirect target, and SEO behavior are approved. If the public hostname remains the desired Store hostname, use a reverse-proxy/domain decision instead of guessing a cross-domain redirect.

## 5. Unified V1 template data model

Use a static typed registry. Six frozen templates do not justify a database or CMS. Keep demo content inside each runtime until a later content-management decision.

Suggested types in `src/lib/store/types.ts` and registry in `src/lib/store/registry.ts`:

```ts
type TemplateStatus = 'preview' | 'live' | 'coming-soon'
type Recommendation = 'website' | 'website-portal' | 'bundle' | 'consultation'
type PriceVisibility = 'public' | 'consultation' | 'hidden'

type PreviewAsset = {
  src: string
  alt: string
  kind: 'card' | 'hero' | 'desktop' | 'mobile' | 'gallery'
}

type ConfigurableField = {
  id: string
  label: string
  kind: 'brand' | 'media' | 'catalog' | 'pricing' | 'schedule' |
    'location' | 'contact' | 'copy' | 'operations'
  required: boolean
}

type TemplateRegistryEntry = {
  slug: string
  name: string
  shortName: string
  category: string
  businessTypes: string[]
  intents: string[]
  descriptions: {
    short: string
    positioning: string
    audienceFit: string
  }
  customerCan: string[]
  includedFeatures: string[]
  optionalFeatures: string[]
  previewStatus: TemplateStatus
  routes: { detail: string; preview: string }
  previewAssets?: PreviewAsset[]
  startingPrice?: {
    amount?: number
    display?: string
    visibility: PriceVisibility
    note?: string
  }
  baseRecommendation: Recommendation
  upgradeRecommendation: Recommendation
  featured: boolean
  sortOrder: number
  configurableFields: ConfigurableField[]
  runtimeKey: string
}
```

Rules:

- `intents` and `customerCan` use capability IDs, not free-form labels.
- Display labels live in the capability catalog so search/filter/recommendation stay aligned.
- `routes` are generated from the canonical route convention; retaining them in the registry makes links and tests explicit.
- `previewAssets` is optional because several current prototypes use CSS-built visuals and local art rather than images.
- Initial V1 starting-price visibility should be `consultation` with a truthful note until approved package prices exist. Do not copy old prices from `src/data/templates.ts`.
- Initial `previewStatus` for all six is `preview`; no entry may say `live` until the runtime and lead path are approved.
- Preserve the current Modern Catalog featured treatment as the initial merchandising default; make the final single-featured decision at S3.

Initial registry coverage:

| Slug | Category | Base | Upgrade | Initial public capabilities | Preview assets |
|---|---|---|---|---|---|
| `warm-commerce` | Kuliner | Website | Website + Portal | catalog, detail, price, inquiry, location | Warm Commerce food images |
| `modern-catalog` | Retail / Katalog | Website | Website + Portal | catalog, detail, search/filter, price, inquiry | none required; CSS object study |
| `trust-profile` | Jasa Profesional | Website | Website + Portal | service/detail, process, consultation | none required; CSS editorial art |
| `care-booking` | Klinik & Wellness | Website | Website + Portal | service/detail, schedule info, location, booking request, inquiry | none required; CSS/runtime art |
| `course-enrollment` | Edukasi | Website | Bundle when member/enrollment management is needed | program/detail, schedule info, enrollment request | none required; CSS route-board art |
| `easy-booking` | Rental | Website | Website + Portal | unit/detail, search/filter, price, booking request, location | none required; CSS vehicle study |

## 6. Capability and intent taxonomy

IDs are stable; labels may be copy-edited without changing rules.

### Public-facing

| ID | Buyer-facing label |
|---|---|
| `public.catalog` | Tampilkan produk, menu, layanan, program, atau unit |
| `public.item-detail` | Jelaskan detail pilihan sebelum orang bertanya |
| `public.search-filter` | Bantu pengunjung mencari dan membandingkan pilihan |
| `public.price-display` | Tampilkan harga atau harga mulai yang informatif |
| `public.schedule-info` | Tampilkan jadwal atau pola waktu sebagai informasi |
| `public.location` | Tampilkan lokasi, area layanan, atau cara datang |
| `public.process` | Jelaskan cara pesan, booking, daftar, atau konsultasi |
| `public.inquiry` | Terima pertanyaan dan tindak lanjut melalui admin |
| `public.booking-request` | Terima permintaan jadwal atau tanggal booking |
| `public.enrollment-request` | Terima minat pendaftaran program |
| `public.consultation` | Arahkan calon pelanggan ke percakapan konsultasi |

### Operational

| ID | Buyer-facing label |
|---|---|
| `ops.content-management` | Kelola isi katalog, layanan, program, atau unit |
| `ops.inquiry-follow-up` | Tindak lanjuti inquiry/pesanan secara teratur |
| `ops.booking-management` | Kelola booking dan permintaan jadwal |
| `ops.availability` | Kelola ketersediaan slot atau unit |
| `ops.inventory` | Kelola stok atau inventaris |
| `ops.customer-records` | Simpan dan kelola data pelanggan |
| `ops.practitioner-management` | Kelola praktisi, staf, atau penyedia layanan |
| `ops.enrollment-management` | Kelola pendaftaran peserta |
| `ops.class-management` | Kelola kelas dan peserta |
| `ops.reminders` | Kirim pengingat operasional |
| `ops.payment` | Kelola pembayaran atau transaksi |
| `ops.admin-dashboard` | Pantau pekerjaan melalui dashboard admin |

### Account/member

| ID | Buyer-facing label |
|---|---|
| `account.customer-login` | Pelanggan punya login sendiri |
| `account.student-member-login` | Siswa/member punya area login |
| `account.portal` | Tim internal membutuhkan Portal operasional |

### Mapping six templates

| Template | Public-facing intents | Operational needs | Account/member needs |
|---|---|---|---|
| Warm Commerce | `public.catalog`, `public.item-detail`, `public.price-display`, `public.inquiry`, `public.location`, `public.process` | `ops.content-management`, `ops.inquiry-follow-up`, optionally `ops.inventory`, `ops.customer-records`, `ops.payment` | optionally `account.customer-login`, `account.portal` |
| Modern Catalog | `public.catalog`, `public.item-detail`, `public.search-filter`, `public.price-display`, `public.inquiry` | `ops.content-management`, `ops.inquiry-follow-up`, optionally `ops.payment` | optionally `account.portal` |
| Trust Profile | `public.item-detail`, `public.process`, `public.consultation`, `public.inquiry`, `public.location` | `ops.content-management`, optionally `ops.inquiry-follow-up`, `ops.customer-records`, `ops.admin-dashboard` | optionally `account.portal` |
| Care Booking | `public.catalog`, `public.item-detail`, `public.schedule-info`, `public.location`, `public.process`, `public.booking-request`, `public.inquiry` | `ops.content-management`, `ops.booking-management`, `ops.practitioner-management`, `ops.customer-records`, `ops.reminders`, optionally `ops.payment` | optionally `account.customer-login`, `account.portal` |
| Course Enrollment | `public.catalog`, `public.item-detail`, `public.schedule-info`, `public.process`, `public.enrollment-request`, `public.inquiry` | `ops.content-management`, `ops.enrollment-management`, `ops.class-management`, optionally `ops.reminders`, `ops.payment` | `account.student-member-login`, `account.portal` |
| Easy Booking | `public.catalog`, `public.item-detail`, `public.search-filter`, `public.price-display`, `public.location`, `public.process`, `public.booking-request`, `public.inquiry` | `ops.content-management`, `ops.booking-management`, `ops.availability`, `ops.inventory`, `ops.customer-records`, optionally `ops.payment` | optionally `account.customer-login`, `account.portal` |

## 7. Store browsing architecture

### `/store` information hierarchy

1. Hero: one clear promise that Store helps a business choose an online customer path.
2. Search field with visible label and 16px input text.
3. Business-category filter: Kuliner, Retail/Katalog, Jasa Profesional, Klinik & Wellness, Edukasi, Rental.
4. `Saya ingin...` intent filter using public-facing and operational labels.
5. Featured template, when exactly one is marked `featured`.
6. Six-card catalog grid with status, fit, customer-facing capabilities, and honest actions.
7. Empty state with active-filter summary and a single reset action.

Use client-side filtering. Six static entries do not need a server query, database, search index, or pagination.

### Filter/search semantics

- Search is case-insensitive, trimmed, accent-tolerant, and matches name, shortName, category, businessTypes, intent labels, descriptions, and customerCan labels.
- Multiple categories are OR within the category group.
- Multiple intents are OR within the intent group.
- Category and intent groups combine with AND.
- Search combines with both groups using AND.
- URL query state is canonical: `q`, `category`, and `intent`; comma-separated values are acceptable for multi-select. Back/forward restores the state.
- Reset clears URL state and returns the full six-template list.

### Responsive behavior

- Start at 390x844 with one-column content, one primary action, and no page-level horizontal scroll.
- Filter chips may scroll inside their own rail, or move into a bottom sheet/drawer on narrow screens; the page itself must not scroll sideways.
- Cards stack identity → status → fit/capabilities → actions.
- All controls are at least 44x44px; search input is at least 16px.
- Intermediate-width checks must catch the transition between two-column cards and desktop composition.

## 8. Detail and Preview standardization

### Shared detail contract

Every detail route exposes:

- breadcrumb: Store → template name;
- name, shortName, category, and Preview/Live/Segera status;
- positioning statement;
- audience/business-type fit;
- `Customer bisa apa` capability list;
- included features;
- optional features and the boundary around them;
- Website → Portal/Bundle education;
- `Lihat Preview`;
- `Gunakan Template Ini`, which leads to `/store/customize/[slug]`;
- truthful note about what the preview does not implement.

The shared frame owns hierarchy, status, breadcrumb, CTA placement, disclosure semantics, and responsive behavior. The runtime owns its visual direction and story.

### Shared preview contract

Every preview route exposes:

- preview toolbar with back-to-detail link;
- template name and status;
- `Gunakan Template Ini` link to customize;
- prototype/no-live-data boundary;
- skip link and focusable main content;
- reduced-motion behavior;
- no fake availability, payment, account, or completion claim.

### 70% shared foundation / 30% unique UX

Shared 70%: route chrome, status, breadcrumb, CTA contract, preview toolbar, scope language, accessibility/focus primitives, responsive tokens, capability labels, recommendation handoff, WhatsApp summary handoff.

Template-specific 30%: hero art, section order, demo business copy, palette, type pairing, menu/catalog/service/program/unit interactions, and local demo data.

Warm Commerce keeps its image-led, warm food runtime. Modern Catalog keeps its CSS object study and variant interaction. Trust Profile keeps editorial credibility. Care Booking keeps appointment-request framing. Course Enrollment keeps program-route selection. Easy Booking keeps unit comparison and inquiry framing.

## 9. Customize flow architecture

Target route: `/store/customize/[slug]`.

Four user-language steps:

1. `Tentang bisnis`: business category, business type, business name, location/coverage, and short description.
2. `Customer-facing needs`: choose what visitors should see or do, using labels such as catalog, price, schedule, inquiry, booking, enrollment, or consultation.
3. `Operational needs`: choose what the owner/team needs to manage, using plain business language such as booking management, inventory, customer records, reminders, or an admin dashboard.
4. `Readiness`: logo, photos, product/service/program/unit list, price information, WhatsApp contact, expected start timing, and whether content help is needed.

Do not ask users about APIs, databases, frameworks, hosting, schemas, or other technical choices.

### State model

```ts
type CustomizeDraft = {
  templateSlug: string
  currentStep: 1 | 2 | 3 | 4
  business: {
    categoryId?: string
    businessType?: string
    businessName?: string
    location?: string
    description?: string
  }
  customerFacingNeeds: string[]
  operationalNeeds: string[]
  readiness: {
    hasLogo: 'yes' | 'no' | 'help'
    hasImages: 'yes' | 'no' | 'help'
    hasContent: 'yes' | 'no' | 'help'
    hasPriceOrScheduleInfo: 'yes' | 'no' | 'help'
    hasWhatsappContact: 'yes' | 'no' | 'help'
    targetTiming?: 'asap' | 'this-month' | 'exploring'
  }
  needsConsultation: boolean
}
```

V1 persistence is client-only `sessionStorage`, keyed by template slug. Do not persist sensitive personal data or submit to a backend. The summary route reads the draft and shows an explicit empty-state recovery path if the session is missing.

`Belum yakin` is a valid action. It marks `needsConsultation`, allows the user to continue, and produces an explainable `Perlu konsultasi` result rather than forcing a guess.

### Navigation/mobile behavior

- one step at a time on mobile;
- visible 1/4 progress indicator;
- Back and Continue preserve answers;
- inline validation below the related field and first-invalid focus on error;
- sticky bottom action bar with safe-area padding and enough content padding so it never covers fields;
- all choices use fieldsets/legends, visible labels, 16px inputs, and 44px targets;
- summary provides Edit step actions that return to the same draft.

## 10. Rule-based recommendation engine V1

Pure function, no pricing engine and no AI:

```ts
recommendTemplatePath(draft: CustomizeDraft, entry: TemplateRegistryEntry): RecommendationResult
```

### Precedence

1. Explicit `needsConsultation` or unresolved/contradictory answers → `Perlu konsultasi`.
2. Account/member needs (`account.customer-login` or `account.student-member-login`) → `Bundle`.
3. Operational needs that require a Portal (`ops.booking-management`, `ops.availability`, `ops.inventory`, `ops.customer-records`, `ops.practitioner-management`, `ops.enrollment-management`, `ops.class-management`, `ops.reminders`, `ops.admin-dashboard`) → `Website + Portal`.
4. Public-only needs → template `baseRecommendation`, initially `Website` for all six.
5. Empty optional selections with a valid template → the template base recommendation, with a reason that the website is the starting point.

`ops.payment` alone does not produce a payment product in V1. It produces `Perlu konsultasi` because payment is explicitly out of V1. A combination that mixes unsupported real-time, regulated, or custom operational expectations also produces `Perlu konsultasi`.

`upgradeRecommendation` participates as the next-step explanation, not as an unconditional override. For example, Course Enrollment can explain that student login or enrollment management moves the recommendation to Bundle; Easy Booking can explain that availability/inventory moves it to Website + Portal.

### Explainable reasons

Every result returns reason IDs and readable labels, for example:

- `base-template`: “Template ini cocok untuk mulai dari website publik.”
- `portal-operations`: “Kamu memilih kebutuhan yang perlu dikelola tim.”
- `member-account`: “Login member/siswa membutuhkan pengalaman di luar website publik.”
- `needs-consultation`: “Ada kebutuhan yang perlu dibahas agar scope dan alurnya tepat.”
- `template-upgrade`: template-specific next-step explanation from registry.

### Tests

- six templates × empty/public-only baseline;
- each operational capability;
- each account/member capability;
- precedence when account + operations are both selected;
- explicit `Belum yakin`;
- unsupported payment/real-time combinations;
- unknown capability IDs fail safely to consultation;
- stable reason ordering and serialization;
- no price calculation and no dependency on browser state.

## 11. Consultation Summary model

```ts
type ConsultationSummary = {
  template: { slug: string; name: string; category: string }
  business: {
    categoryId?: string
    categoryLabel?: string
    businessType?: string
    businessName?: string
    location?: string
    description?: string
  }
  customerFacingNeeds: Array<{ id: string; label: string }>
  operationalNeeds: Array<{ id: string; label: string }>
  readiness: {
    assets: Array<{ id: string; label: string; state: 'yes' | 'no' | 'help' }>
    targetTiming?: string
  }
  recommendation: {
    kind: Recommendation
    label: string
    reasons: string[]
  }
}
```

The summary is generated from the draft, not independently edited. Users can edit any step, return to the wizard, and regenerate without losing prior answers. The summary page should show the selected template, needs, readiness gaps, recommendation, reasons, and next action. It must not imply an order, payment, account, provisioning job, or confirmed project.

## 12. WhatsApp lead handoff

Centralize this in `src/lib/store/whatsapp.ts` or a similarly scoped Store utility. Do not duplicate message templates in six runtimes.

### Configuration

- Use a real Webzoka number from environment/config, preferably `NEXT_PUBLIC_WEBZOKA_WHATSAPP_NUMBER` to distinguish Store contact from tenant-level `src/lib/wa.ts` behavior.
- Add the variable to `.env.example` and deployment configuration during the implementation phase.
- Do not hard-code the real number in source, tests, or preview content.
- Missing configuration must not generate a fake `wa.me` URL. Render a clear fallback action such as copy-summary/contact instructions, with the exact fallback destination decided before S6.

### Message shape

```text
Halo Webzoka, saya ingin konsultasi template website.

Template: {name}
Kategori bisnis: {category/business type}
Nama bisnis: {business name, if provided}
Kebutuhan customer: {selected labels}
Kebutuhan operasional: {selected labels}
Kesiapan: {short readiness summary}
Rekomendasi awal: {Website | Website + Portal | Bundle | Perlu konsultasi}
Alasan: {short reason list}
```

Keep the message readable and short. Use labels, not full descriptions. Cap each list and append `+N lainnya` when needed; enforce a total length budget and test encoded URLs. Include no passwords, identity documents, payment details, or sensitive customer data. If the number is absent or URL creation fails, keep the consultation summary usable and offer copy-to-clipboard/manual contact fallback.

## 13. Shared template-engine boundary

### Proposed canonical structure

```text
src/
  lib/store/
    types.ts
    registry.ts
    capabilities.ts
    recommendation.ts
    whatsapp.ts
    summary.ts
  app/store/
    components/
      StoreChrome.tsx
      StoreFilters.tsx
      TemplateCard.tsx
      TemplateStatus.tsx
      TemplateDetailFrame.tsx
      PreviewToolbar.tsx
      CustomizeStepper.tsx
      ConsultationSummaryView.tsx
    template-runtimes/
      warm-commerce/
      modern-catalog/
      trust-profile/
      care-booking/
      course-enrollment/
      easy-booking/
    store.css
    page.tsx
    template/[slug]/page.tsx
    template/[slug]/preview/page.tsx
    customize/[slug]/page.tsx
    summary/page.tsx
```

This follows the canonical repo's existing `src/app/store`, `src/app/components`, and `src/lib` conventions while keeping Store-specific primitives route-scoped. Existing route-local experiences may be moved into `template-runtimes` only during an approved migration phase.

### Shared candidates

Registry/types, capability IDs/labels, TemplateCard, filters/search, status badges, detail primitives, preview toolbar, CTA/contact helpers, WhatsApp utility, accessibility/focus primitives, responsive tokens, safe-area action bar, and truthful status/boundary copy.

### Template-specific candidates

Hero art, section order, business UI/content, palette/type pairing, local demo datasets, menu/catalog/service/program/unit interactions, and template-specific mobile composition.

Do not merge Store demo runtimes into `src/app/components/theme-engine` or `src/lib/theme-system` yet. Those modules serve the customer-site rendering/provisioning system; Store V2 previews are product-selection experiences. A future adapter can connect them after a real provisioning contract exists.

## 14. Route convention and migration

### Evaluation

Current explicit routes are appropriate for isolated prototypes: they preserve unique metadata and keep each runtime bounded. They do not scale to six registry-driven detail/preview contracts, shared status, or a customize flow without duplicated route logic.

### Target

Use dynamic route wrappers backed by static registry entries:

- `/store`
- `/store/template/[slug]`
- `/store/template/[slug]/preview`
- `/store/customize/[slug]`
- `/store/summary`

`generateStaticParams` should enumerate the six frozen slugs. Unknown slugs use a controlled not-found path. The dynamic wrapper selects the correct runtime via a typed `runtimeKey` map; it does not dynamically import arbitrary user input.

### Migration sequence

1. Add registry and capability types without changing current URLs.
2. Add adapters for existing explicit experiences.
3. Build shared detail/preview wrappers and compare them against existing explicit routes.
4. Move to dynamic wrappers only after route parity and preview QA pass.
5. Add customize/summary routes.
6. Redirect/remove old public Warm Commerce routes only after canonical host and parity approval.

No route refactor is part of this planning task.

## 15. Cross-template QA matrix

| Surface | Templates/routes | Desktop | Mobile/intermediate | Required checks |
|---|---|---|---|---|
| Store index | `/store` | 1440x900 | 390x844 and intermediate width | hero/H1, search, category filter, intent filter, multi-filter AND semantics, featured card, six cards, empty state, truthful statuses, URL/back state, no overflow |
| Detail | six `/store/template/[slug]` routes | 1440x900 | 390x844 and intermediate width | breadcrumb, one H1, category/status, audience fit, included/optional, Website→Portal/Bundle education, Preview CTA, Customize CTA, alt text, keyboard/focus |
| Preview | six `/preview` routes | 1440x900 | 390x844 and intermediate width | toolbar, back link, Customize CTA, unique runtime interaction, honest demo boundary, no live/payment/account claim, no console/network errors |
| Customize | six `/store/customize/[slug]` routes | 1440x900 | 390x844 and intermediate width | four steps, validation, back/forward, Belum yakin, session restore, safe-area action bar, focus/error recovery, no technical questions |
| Summary | `/store/summary` | 1440x900 | 390x844 and intermediate width | normalized fields, reason display, edit/back, missing-session recovery, copy summary, WhatsApp config/fallback, no sensitive data |
| Warm parity | migrated Warm detail/preview | 1440x900 | 390x844 and intermediate width | images, category filter, mobile menu/Escape/focus, inquiry/location links, visual and content parity, status honesty |

Every route must check: overflow, one H1, meaningful/decorative alt behavior, console/network errors, keyboard order/focus-visible, reduced motion, touch targets >=44px, form labels/input size, responsive image sizing, CTA/status honesty, and interaction confirmation states.

Run browser UAT only after implementation phases create a changed UI. This task is plan-only, so no browser UAT claim is made here.

## 16. Approval-gated implementation phases S0–S7

| Phase | Goal and exact scope | Likely files/modules | Prerequisites | Validation | Rollback/checkpoint | Chat approval gate |
|---|---|---|---|---|---|---|
| S0 | Approve ownership, boundary, registry shape, route target, redirect policy, WhatsApp env, and V1 scope. Docs only. | This plan document; decision notes if separately approved | Source inspection complete | Line-by-line review against product decision | Keep both repos unchanged; reject plan without code rollback | Approve architecture packet and open decisions |
| S1 | Add typed registry, capability taxonomy, labels, six entries, completeness tests. No route/UI refactor. | `src/lib/store/types.ts`, `registry.ts`, `capabilities.ts`, tests | S0 approval | Typecheck, registry validation, taxonomy mapping tests | Remove registry modules; existing five prototypes remain unchanged | Approve registry content and taxonomy |
| S2 | Consolidate Warm Commerce data/assets/runtime into canonical repo; adapt shared primitives; keep public implementation and routes intact. | Canonical `src/app/store/template-runtimes/warm-commerce`, `src/public/images/store/warm-commerce`, review doc; migration adapters | S1 registry | Warm parity matrix, typecheck/build, exact viewport browser checks | Keep public Warm as source; hide/revert canonical Warm adapter | Approve parity and migration ownership |
| S3 | Standardize `/store`, detail, preview shell, statuses, cards, filters, and dynamic route wrappers across six templates. | `src/app/store/page.tsx`, `src/app/store/components/*`, `[slug]` route wrappers, `store.css` split/tokens | S2 parity; route/host decision | Route matrix, filter semantics, responsive/a11y/browser checks | Restore explicit routes and old Store index; no public redirects | Approve shared foundation and dynamic routes |
| S4 | Add four-step customize wizard, client-only draft state, validation, mobile action bar, and `Belum yakin`. | `customize/[slug]`, `CustomizeStepper`, `src/lib/store/summary.ts` | S3 shared contract | State transition tests, keyboard/mobile UAT, missing-session recovery | Keep detail/preview CTA at consultation placeholder; remove wizard route | Approve question set and persistence boundary |
| S5 | Add pure recommendation rules and explainable reasons. No pricing, AI, DB, or provisioning. | `src/lib/store/recommendation.ts`, tests, capability mapping | S4 draft model | Truth-table tests and six-template baseline tests | Disable recommendation result and fall back to `Perlu konsultasi` | Approve precedence and Website/Portal/Bundle meaning |
| S6 | Add normalized summary, edit/back behavior, central WhatsApp generator/config, URL length/fallback handling. | `summary/page.tsx`, `src/lib/store/whatsapp.ts`, `.env.example`, deployment config | S5 rules; real number and fallback decision | Message snapshot/length tests, config-present/absent tests, browser handoff checks | Revert CTA to manual consultation; no outgoing message is sent automatically | Approve real contact and final message |
| S7 | Full six-template QA, Warm parity, regression, SEO/redirect readiness, launch checklist. | QA docs/scripts, route metadata, public redirect files after approval | S6 complete; canonical host approved | Exact viewport browser UAT, HTTP checks, build/typecheck, console/network audit | Do not redirect/remove public routes; keep Store in preview | Approve launch and public-route cutover |

## 17. V1 deferred scope

Cart, checkout, payment, customer account, AI recommendation, automatic provisioning, real-time availability, full Hub/Portal/LMS/clinic/rental backends, reviews/ratings, persistent lead database, CRM automation, CMS-driven registry, public self-serve pricing engine, live inventory, live scheduling, enrollment confirmation, customer/member portals, and production notification automation remain out of V1 unless separately approved.

The V1 summary is a client-side consultation brief. It is not an order, booking, enrollment, payment, account, or provisioning request.

## RISKS / OPEN DECISIONS

### Risks

- Two live Store owners can diverge in copy, status, CTA, and SEO unless the public repo becomes redirect-only.
- Moving Warm Commerce across Next apps can break image paths, font loading, static/export assumptions, or CSS-module imports.
- A dynamic runtime dispatcher can accidentally accept untrusted slug input unless constrained to the typed registry.
- Current template runtimes have different language, fonts, topbars, and local form behavior; over-sharing can erase approved UX or create regressions.
- A missing/incorrect WhatsApp number can create a dead or misdirected lead path.
- Preview demo copy can be mistaken for live availability, confirmed booking, or enrollment unless boundary copy remains standardized.
- Client-only session storage can be lost when users change browser/device; V1 must present this as a local consultation draft, not durable CRM storage.
- Existing `src/data/templates.ts` price/rating data may be mistaken for approved V1 commercial metadata.

## EXACT DECISIONS NEEDED FROM CHAT

S0 decisions above are approved and recorded. S1 Review asks Chat to approve the concrete registry content, capability IDs/labels, runtime-status treatment for Warm Commerce, and validation evidence before S2 migration begins.

## GIT STATUS

- Canonical worktree: S0 checkpoint document is the only intended change before S1 implementation.
- Public Webzoka worktree: clean; no files changed.

## PLAN DOC PATH

`D:\Project\Website JapanArena\JapanArena SaaS\.wt-webzoka-v7-prototype\docs\webzoka-store-v2-system-architecture-plan.md`

S0 checkpoint file. S1 implementation will add only the scoped Store registry, taxonomy, tests, and validation notes in the canonical worktree.

## 20. Verdict

S0 architecture checkpoint is approved. Recommended boundary remains clear: canonical Store V2 and template runtimes in `ja-websitebuilder-platform`; Public Webzoka remains marketing/public-web owner with temporary redirects. S1 registry work is scoped below; Warm Commerce migration, route standardization, customize, recommendation, summary, WhatsApp handoff, and launch QA remain approval-gated later phases.
