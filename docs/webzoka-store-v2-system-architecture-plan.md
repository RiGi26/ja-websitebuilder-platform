# Webzoka Store V2 — System Architecture Consolidation Plan

Status: S4 Customize flow complete and stopped before S5 Recommendation Engine at the requested review gate.

Date: 2026-09-12

## TASK STATUS

Architecture planning complete and approved in Chat. S1 established the static typed registry and normalized capability taxonomy. S2 migrated Warm Commerce, S3 standardized Store browse/detail/preview, and S4 now captures a normalized client-only Customize draft. S5+ remains gated.

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

S1 implementation uses these files:

- `src/lib/store/types.ts` — `TemplateSlug`, `TemplateStatus`, `TemplateRuntimeStatus`, `StoreCategoryId`, `BusinessTypeId`, `CapabilityId`, `RecommendationTier`, `StoreTemplate`, price, asset, and configurable-field types.
- `src/lib/store/capabilities.ts` — `CAPABILITY_TAXONOMY`, group labels, `RECOMMENDATION_TIERS`, recommendation labels, and `V1_PRICE_PRESENTATION`.
- `src/lib/store/templates.ts` — `STORE_TEMPLATES_BY_SLUG`, deterministic `STORE_TEMPLATE_REGISTRY`, category labels, and typed `getStoreTemplate` lookup.
- `src/lib/store/templates.test.ts` — focused registry, taxonomy, tier, Warm runtime-state, and price-model validation.

Registry rules:

- `capabilities` contains baseline capabilities represented by each template direction.
- `optionalCapabilities` contains future operational/account scope and never implies that the current preview already provides those features.
- `customerCan` contains only visitor-facing baseline capabilities.
- Capability labels live in `CAPABILITY_TAXONOMY`, so future browse/filter/recommendation code can consume one vocabulary.
- `detailRoute` and `previewRoute` use the canonical route convention and remain explicit until dynamic route wrappers pass parity.
- `previewAssets` and `configurableFields` remain optional. S1 adds neither because current runtimes use CSS-built visuals and Customize is deferred.
- S1 baseline: all five local runtimes were `preview` and `visible`; Warm Commerce was `coming-soon`, `pending-migration`, owned by Public Webzoka, and `hidden-until-runtime`. S2 replaces that Warm state with the migrated canonical state recorded below.
- `pricePresentation` uses the approved V1 model. It contains one honest Website starting price and consultation-only Portal/Bundle presentation. It does not copy legacy prices, ratings, reviews, or sold-count data.
- Warm Commerce remains marked `featured: true`; S1's index visibility guard was removed from registry truth after S2 parity, while `/store` merchandising remains deferred to S3.

### S1 decisions and deviations from planning shape

- Registry filename is `templates.ts`, matching the requested Store convention. Planning's provisional `registry.ts` name is not used.
- `optionalCapabilities` separates future operational/account scope from baseline preview capabilities. This prevents an operational upsell from reading as an existing backend feature.
- `runtimeStatus`, `runtimeOwner`, and `storeIndexVisibility` make Warm Commerce's external runtime explicit. Its target canonical routes are metadata only until S2.
- `public.whatsapp-contact`, `public.lead-form`, and `public.order-request` are separate IDs because channel, lead capture, and order intent are different buyer needs.
- `ops.internal-users` represents internal access; Portal remains an operational/admin concept, not an account/member capability.
- Chat's approved Warm Commerce featured decision supersedes the earlier Modern Catalog merchandising default. At S1 it remained hidden from the index until migration/parity; S2 parity is now complete.

Initial registry coverage:

| Slug | Category | Base | Upgrade | Runtime/index state | Initial public capabilities |
|---|---|---|---|---|---|
| `warm-commerce` | Kuliner | Website | Website + Portal | S1 baseline: pending migration, hidden until S2 | catalog, detail, price, WhatsApp, order request, location |
| `modern-catalog` | Retail | Website | Website + Portal | local preview, visible | catalog, detail, search/filter, price, inquiry |
| `trust-profile` | Jasa Profesional | Website | Website + Portal | local preview, visible | profile, services, lead form, consultation, WhatsApp |
| `care-booking` | Klinik & Wellness | Website | Website + Portal | local preview, visible | services, detail, schedule info, location, booking request |
| `course-enrollment` | Edukasi | Website | Bundle when member/enrollment scope is needed | local preview, visible | programs, detail, schedule info, enrollment request |
| `easy-booking` | Rental | Website | Website + Portal | local preview, visible | units, detail, search/filter, price, booking request, location |

## 6. Capability and intent taxonomy

IDs are stable; labels may be copy-edited without changing rules. S1 uses `public.*`, `ops.*`, and `account.*` prefixes to keep groups explicit and avoid duplicate semantics.

### Public-facing

| ID | Buyer-facing label |
|---|---|
| `public.business-profile` | Profil bisnis |
| `public.catalog` | Tampilkan produk, menu, layanan, program, atau unit |
| `public.item-detail` | Jelaskan detail pilihan sebelum orang bertanya |
| `public.search-filter` | Bantu pengunjung mencari dan membandingkan pilihan |
| `public.price-display` | Tampilkan harga atau harga mulai yang informatif |
| `public.whatsapp-contact` | Kontak WhatsApp |
| `public.lead-form` | Form kontak awal |
| `public.schedule-info` | Tampilkan jadwal atau pola waktu sebagai informasi |
| `public.location` | Tampilkan lokasi, area layanan, atau cara datang |
| `public.process` | Jelaskan cara pesan, booking, daftar, atau konsultasi |
| `public.inquiry` | Terima pertanyaan dan tindak lanjut melalui admin |
| `public.order-request` | Terima permintaan order tanpa checkout otomatis |
| `public.booking-request` | Terima permintaan jadwal atau tanggal booking |
| `public.enrollment-request` | Terima minat pendaftaran program |
| `public.consultation` | Arahkan calon pelanggan ke percakapan konsultasi |

### Operational / admin

| ID | Buyer-facing label |
|---|---|
| `ops.content-management` | Kelola isi katalog, layanan, program, atau unit |
| `ops.order-management` | Kelola order |
| `ops.inquiry-follow-up` | Tindak lanjuti inquiry/pesanan secara teratur |
| `ops.booking-management` | Kelola booking dan permintaan jadwal |
| `ops.availability` | Kelola ketersediaan slot atau unit |
| `ops.inventory` | Kelola stok atau inventaris |
| `ops.customer-records` | Simpan dan kelola data pelanggan |
| `ops.practitioner-management` | Kelola praktisi, staf, atau penyedia layanan |
| `ops.enrollment-management` | Kelola pendaftaran peserta |
| `ops.class-management` | Kelola kelas dan peserta |
| `ops.reminders` | Kirim pengingat operasional |
| `ops.payment-management` | Kelola pembayaran atau transaksi |
| `ops.internal-users` | Atur akses tim internal |
| `ops.admin-dashboard` | Pantau pekerjaan melalui dashboard admin |

### Account / member

| ID | Buyer-facing label |
|---|---|
| `account.customer-login` | Pelanggan punya login sendiri |
| `account.member-login` | Member punya area login sendiri |
| `account.student-login` | Siswa punya area belajar sendiri |
| `account.order-tracking` | Pelanggan dapat melacak status order |
| `account.booking-history` | Pelanggan dapat melihat riwayat booking |
| `account.learning-materials` | Siswa/member dapat mengakses materi belajar |
| `account.attendance` | Siswa/member dapat melihat atau mengisi kehadiran |
| `account.membership` | Kelola status dan manfaat keanggotaan |

Descriptions for every ID live in `CAPABILITY_TAXONOMY` in `src/lib/store/capabilities.ts`.

### Mapping six templates

| Template | Baseline capabilities | Optional operational/account scope | `customerCan` baseline |
|---|---|---|---|
| Warm Commerce | `public.catalog`, `public.item-detail`, `public.price-display`, `public.whatsapp-contact`, `public.order-request`, `public.location`, `public.process` | `ops.content-management`, `ops.order-management`, `ops.inquiry-follow-up`, `ops.inventory`, `ops.customer-records`, `ops.internal-users`, `ops.admin-dashboard`, optional customer login/order tracking | catalog, detail, price, WhatsApp, order request |
| Modern Catalog | `public.catalog`, `public.item-detail`, `public.search-filter`, `public.price-display`, `public.inquiry`, `public.whatsapp-contact`, `public.process` | `ops.content-management`, `ops.order-management`, `ops.inventory`, `ops.customer-records`, `ops.internal-users`, `ops.admin-dashboard`, optional customer login/order tracking | catalog, detail, search/filter, price, inquiry, WhatsApp |
| Trust Profile | `public.business-profile`, `public.catalog`, `public.item-detail`, `public.process`, `public.lead-form`, `public.consultation`, `public.whatsapp-contact` | `ops.inquiry-follow-up`, `ops.customer-records`, `ops.internal-users`, `ops.admin-dashboard`, optional member login. No full CRM claim. | profile, services, lead form, consultation, WhatsApp |
| Care Booking | `public.catalog`, `public.item-detail`, `public.schedule-info`, `public.location`, `public.booking-request`, `public.whatsapp-contact`, `public.process` | `ops.content-management`, `ops.booking-management`, `ops.availability`, `ops.customer-records`, `ops.practitioner-management`, `ops.reminders`, `ops.internal-users`, `ops.admin-dashboard`, optional customer login/booking history | services, detail, schedule, location, booking request, WhatsApp |
| Course Enrollment | `public.catalog`, `public.item-detail`, `public.schedule-info`, `public.enrollment-request`, `public.process`, `public.whatsapp-contact` | `ops.content-management`, `ops.enrollment-management`, `ops.class-management`, `ops.customer-records`, `ops.reminders`, `ops.payment-management`, `ops.internal-users`, `ops.admin-dashboard`, student/member login, materials, attendance, membership | programs, detail, schedule, enrollment request, WhatsApp |
| Easy Booking | `public.catalog`, `public.item-detail`, `public.search-filter`, `public.price-display`, `public.location`, `public.booking-request`, `public.whatsapp-contact`, `public.process` | `ops.content-management`, `ops.booking-management`, `ops.availability`, `ops.inventory`, `ops.customer-records`, `ops.payment-management`, `ops.internal-users`, `ops.admin-dashboard`, optional customer login, booking history, order tracking | units, detail, search/filter, price, location, booking request, WhatsApp |

## 7. Store browsing architecture

S2 integration status: Warm Commerce runtime is canonical and registry-visible, but `/store` remains unchanged. Existing five cards, visual composition, explicit links, and Warm Commerce exclusion remain hard-coded until S3 browse standardization; merchandising activation is intentionally deferred.

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
  schemaVersion: 1
  templateSlug: TemplateSlug
  status: 'draft' | 'complete'
  currentStep: 1 | 2 | 3 | 4
  businessCategory: StoreCategoryId
  businessType: string
  businessArea: string
  currentWebsiteStatus: 'none' | 'existing' | 'refresh' | 'unsure'
  currentContactChannels: ContactChannelId[]
  customerNeeds: CapabilityId[] // public + account/member IDs
  operationalNeeds: CapabilityId[] // operational IDs
  operationalMode: 'none' | 'selected' | 'unsure'
  assets: {
    logo: 'ready' | 'missing' | 'help' | 'unknown'
    domain: 'ready' | 'missing' | 'help' | 'unknown'
    photos: 'ready' | 'missing' | 'help' | 'unknown'
    catalog: 'ready' | 'missing' | 'help' | 'unknown'
    'business-copy': 'ready' | 'missing' | 'help' | 'unknown'
  }
  timeline: 'asap' | 'one-two-weeks' | 'two-four-weeks' | 'undecided'
  uncertainties: Array<'customer-needs' | 'operational-needs'>
  needsConsultation: boolean
}
```

S4 persistence is client-only `sessionStorage`, namespaced as `webzoka.store.customize.v1:{templateSlug}`. Drafts are restored only for the current template; corrupt, unavailable, or cross-template payloads are ignored safely. Do not persist sensitive personal data or submit to a backend. The future summary route remains deferred.

`Belum yakin` is a valid action. It records an uncertainty marker, allows the user to continue, and leaves recommendation calculation to S5 rather than forcing a guess. `Tidak perlu dashboard khusus` clears operational selections and is mutually exclusive with `selected` and `unsure` operational modes.

### Navigation/mobile behavior

- one step at a time on mobile;
- visible 1/4 progress indicator;
- Back and Continue preserve answers;
- inline validation below the related field and first-invalid focus on error;
- sticky bottom action bar with safe-area padding and enough content padding so it never covers fields;
- all choices use fieldsets/legends, visible labels, 16px inputs, and 44px targets;
- summary provides Edit step actions that return to the same draft.
- completion state confirms the draft is saved locally and explicitly stops before recommendation calculation.

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

`ops.payment-management` alone does not produce a payment product in V1. It produces `Perlu konsultasi` because payment is explicitly out of V1. A combination that mixes unsupported real-time, regulated, or custom operational expectations also produces `Perlu konsultasi`.

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
    capabilities.ts
    templates.ts
    templates.test.ts
    recommendation.ts
    whatsapp.ts
    summary.ts
  app/store/
    ...existing explicit routes...
```

S1 adds only the four `src/lib/store` files listed above. Shared UI primitives, runtime moves, recommendation rules, summary state, WhatsApp handoff, and dynamic route wrappers remain later-phase work.

The registry lives in `templates.ts`, not the legacy `src/data/templates.ts`. The legacy catalog remains outside Store V2 because it contains unrelated slugs, ratings, reviews, sold counts, remote demo URLs, and old prices.

### Planned post-S1 structure

```text
src/
  lib/store/
    types.ts
    capabilities.ts
    templates.ts
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

No route refactor is part of S1. Dynamic wrappers remain gated by explicit-route parity.

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

S1 changed no UI. Fresh local HTTP smoke covered `/store` plus all five existing detail/preview pairs: all 11 routes returned `200` and rendered exactly one `<h1>`. Visual browser UAT remains deferred because S1 did not alter route or UI code.

## 16. Approval-gated implementation phases S0–S7

| Phase | Goal and exact scope | Likely files/modules | Prerequisites | Validation | Rollback/checkpoint | Chat approval gate |
|---|---|---|---|---|---|---|
| S0 | Approve ownership, boundary, registry shape, route target, redirect policy, WhatsApp env, and V1 scope. Docs only. | This plan document | Source inspection complete | Approved Chat decisions recorded in `0c9a765` | Keep both repos unchanged; reject plan without code rollback | Completed; S1 authorized |
| S1 | Add typed registry, capability taxonomy, labels, six entries, completeness tests. No route/UI refactor. | `src/lib/store/types.ts`, `capabilities.ts`, `templates.ts`, `templates.test.ts` | S0 approval | `npm run typecheck`; focused Vitest 7/7; `npm run build`; `git diff --check`; 11-route HTTP smoke | Remove registry modules; existing five prototypes remain unchanged | Pending S1 Review Packet approval |
| S2 | Consolidate Warm Commerce data/assets/runtime into canonical repo; adapt shared primitives; keep public implementation and routes intact. | Canonical `src/app/store/template/warm-commerce`, `public/images/store/warm-commerce`, `docs/webzoka-store-v2-s2-warm-commerce-review.md`, Store-local migration adapters | S1 registry | Warm parity matrix, typecheck/build, exact viewport browser checks | Keep public Warm as source; hide/revert canonical Warm adapter | Approve parity and migration ownership |
| S3 | Standardize `/store`, detail, preview shell, statuses, cards, filters, and dynamic route wrappers across six templates. | `src/app/store/page.tsx`, `src/app/store/components/*`, `[slug]` route wrappers, `store.css` split/tokens | S2 parity; route/host decision | Route matrix, filter semantics, responsive/a11y/browser checks | Restore explicit routes and old Store index; no public redirects | Approve shared foundation and dynamic routes |
| S4 | Add four-step Customize wizard, client-only normalized draft state, validation, mobile action bar, and `Belum yakin`. | `customize/[slug]`, `CustomizeWizard`, `src/lib/store/customize.ts`, `src/lib/store/types.ts` | S3 shared contract | State transition tests, keyboard/mobile UAT, session restoration/reset, route matrix | Keep S5 recommendation boundary explicit; remove wizard only if S4 is rejected | Approve question set and persistence boundary |
| S5 | Add pure recommendation rules and explainable reasons. No pricing, AI, DB, or provisioning. | `src/lib/store/recommendation.ts`, tests, capability mapping | S4 draft model | Truth-table tests and six-template baseline tests | Disable recommendation result and fall back to `Perlu konsultasi` | Approve precedence and Website/Portal/Bundle meaning |
| S6 | Add normalized summary, edit/back behavior, central WhatsApp generator/config, URL length/fallback handling. | `summary/page.tsx`, `src/lib/store/whatsapp.ts`, `.env.example`, deployment config | S5 rules; real number and fallback decision | Message snapshot/length tests, config-present/absent tests, browser handoff checks | Revert CTA to manual consultation; no outgoing message is sent automatically | Approve real contact and final message |
| S7 | Full six-template QA, Warm parity, regression, SEO/redirect readiness, launch checklist. | QA docs/scripts, route metadata, public redirect files after approval | S6 complete; canonical host approved | Exact viewport browser UAT, HTTP checks, build/typecheck, console/network audit | Do not redirect/remove public routes; keep Store in preview | Approve launch and public-route cutover |

### S1 validation evidence

- `npm run typecheck` — exit 0.
- `npx vitest run src/lib/store/templates.test.ts` — 1 file passed, 7 tests passed.
- `npm run build` — exit 0; Next.js generated existing Store routes and no Warm Commerce canonical route.
- `git diff --check` — exit 0.
- `npm run lint` — existing script unavailable under current Next.js version: `Invalid project directory provided, no such directory: ...\\lint`. No lint configuration was added or changed.
- Fresh local HTTP smoke — `/store` and Modern Catalog, Trust Profile, Care Booking, Course Enrollment, and Easy Booking detail/preview routes all returned `200`; each response contained exactly one `<h1>`.

### S2 actual outcome and validation evidence

- Warm Commerce now owns explicit canonical routes: `/store/template/warm-commerce` and `/store/template/warm-commerce/preview`.
- Runtime/data/CSS moved under `src/app/store/template/warm-commerce`; temporary Store-local `StoreShell` and `PreviewToolbar` primitives were added under `src/app/store/components`.
- Four required WebP assets moved under `public/images/store/warm-commerce`; no unrelated Public Webzoka assets were copied.
- Warm registry transition: `coming-soon`/`pending-migration`/`public-webzoka`/`hidden-until-runtime` → `preview`/`local`/`canonical-store`/`visible`; `featured: true` preserved.
- `/store` browse composition stayed unchanged. Warm merchandising remains deferred to S3.
- `npm run typecheck` — exit 0.
- `npx vitest run src/lib/store/templates.test.ts` — 1 file passed, 7 tests passed, exit 0.
- `npm run build` — exit 0; both canonical Warm routes generated.
- `git diff --check` — pass.
- Fresh local and Vercel Preview HTTP matrices — `/store` plus all six detail/preview pairs returned `200`; each response contained exactly one `<h1>`.
- Browser UAT — 1440×900, 768×900, and 390×844; mobile menu/Escape and Camilan filter verified; mobile DOM width stayed below viewport width.
- New Preview deployment: `dpl_HUq3GxzmwBHXvt8x4KgnVjgATRbv`, status Ready, target `preview`.
- Full bounded S2 packet: `docs/webzoka-store-v2-s2-warm-commerce-review.md`.

### S3 actual outcome and validation evidence

- `/store` is now registry-driven and rendered through the shared `StoreShell`.
- Warm Commerce is the initial featured template. All six visible templates are reachable in the catalog grid.
- Search matches template name, short name, category label, business-type label, positioning, short description, and baseline/optional capability labels.
- Category and buyer-intent filters use URL query parameters (`q`, `category`, `intent`) with AND semantics. Reset clears all three; empty results explain recovery.
- `StoreCard`, `TemplateStatusBadge`, `StoreTemplateDetailPage`, `StorePreviewFrame`, and `PreviewToolbar` are shared Store primitives.
- Detail pages use one registry-backed contract: breadcrumb, name/category/status, positioning, business fit, customer capabilities, included/optional scope, Website → Website + Portal → Bundle education, Preview CTA, and honest S4 Customize boundary.
- Preview pages use one shared outer toolbar. Template-specific navigation, content, palette, type, and interactions remain inside each runtime; old duplicated preview strips are disabled only when the shared toolbar is present.
- Typed dynamic resolvers are implemented for `/store/template/[slug]` and `/store/template/[slug]/preview`, enumerate the six frozen slugs with `generateStaticParams`, and return 404 for unknown slugs. Explicit page wrappers remain the stable URL checkpoints and delegate to the same shared renderers after parity proof.
- No Customize, Recommendation Engine, Summary, centralized WhatsApp handoff, redirect, Hub integration, checkout, account, pricing calculator, new template, merge, or production deployment was added.
- Fresh browser UAT passed at 1440×900, 768×900, and 390×844: Store browse, filters, reset/no-results, mobile menu/Escape/focus restoration, six detail routes, six preview routes, one H1 per route, no horizontal overflow, and no captured console errors.
- Fresh evidence: `npm run typecheck` exit 0; focused Store Vitest 9/9 passed; `npm run build` exit 0; `git diff --check` exit 0. Local and Vercel Preview HTTP matrices returned 200 for Store plus all six detail/preview pairs, and 404 for unknown dynamic slugs.
- New Vercel Preview: `dpl_GbJDF6EZHtkn6MF1hUaQVpTkBSq8`, `Ready`, target `preview`, URL `https://ja-websitebuilder-platform-o8dp8r7po-rigi26s-projects.vercel.app`, source commit `323860d`. No production deployment.

### S4 actual outcome and validation evidence

- Canonical Customize route is `/store/customize/[slug]`; `generateStaticParams` enumerates all six frozen template slugs and unknown slugs return 404.
- Detail-page `Gunakan Template Ini`, detail final CTA, and shared preview toolbar now navigate directly to the selected template's `customizeRoute`.
- One shared `CustomizeWizard` drives all six templates. Template-aware customer and operational options are derived from `customerCan`/`optionalCapabilities` and `CAPABILITY_TAXONOMY`; no duplicate capability IDs were introduced.
- Step 1 captures category, free buyer-facing business type, service area, current website status, and current contact channels. Step 2 captures relevant public/account needs plus `Belum yakin`. Step 3 captures relevant operational needs plus mutually exclusive `Tidak perlu dashboard khusus` and `Belum yakin`. Step 4 captures logo, domain, visual, catalog/menu/program/unit data, business copy, and timeline readiness.
- Normalized draft model lives in `src/lib/store/types.ts`; serialization, safe restoration, per-template namespacing, reset, validation, and uncertainty transitions live in `src/lib/store/customize.ts`.
- Persistence is client-only session storage under `webzoka.store.customize.v1:{templateSlug}`. No name, phone, email, backend write, account, payment, checkout, or CRM data is collected.
- Completion shows the captured-answer review and the explicit boundary that recommendation calculation is next. No Recommendation Engine, Summary route, WhatsApp handoff, provisioning, or pricing result was added.
- Focused Store/Customize Vitest: 15/15 passed. Fresh browser UAT on production server: detail CTA navigation, four-step completion, Back/Next preservation, refresh restoration, reset, `Belum yakin`, no-dashboard exclusivity, template-aware options, recommendation-free completion, 1440×900, 768×900, and 390×844 responsive/no-overflow checks passed; no app page errors or failed app requests were captured. Local self-hosted runs emitted the existing `/_vercel/speed-insights/script.js` 404/MIME warning from the root `SpeedInsights` integration.
- Fresh `npm run typecheck` exit 0, `npm run build` exit 0, and `git diff --check` pass. `npm run lint` remains non-functional under the existing Next.js setup (`Invalid project directory ...\\lint`); lint configuration was not changed.
- New Vercel Preview: `dpl_4oUwycFGNzh3AXjQQXDwgh5EjVQy`, status `Ready`, target `preview`, URL `https://ja-websitebuilder-platform-mogkbs0i4-rigi26s-projects.vercel.app`, source branch `codex/webzoka-v7-prototype`. No production deployment.

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

S0–S3 decisions are approved and recorded. S4 is implemented and stopped at the requested review gate. Chat must decide whether to approve the four-step Customize question set, normalized draft boundary, and client-only persistence for S5 planning. This packet does not authorize S5 work.

## GIT STATUS

- Canonical worktree: S3 implementation and docs committed on `codex/webzoka-v7-prototype`; final status is recorded in the S3 review packet.
- Public Webzoka worktree: clean; no files changed.

## PLAN DOC PATH

`D:\Project\Website JapanArena\JapanArena SaaS\.wt-webzoka-v7-prototype\docs\webzoka-store-v2-system-architecture-plan.md`

S0–S4 architecture checkpoint file. S4 adds the shared Customize wizard, normalized draft model, client-only session persistence, and validation notes in the canonical worktree.

Commits:

- S0 architecture checkpoint: `0c9a765`.
- S1 registry and taxonomy: `5db6523`.
- S2 runtime migration: `6097eb7`.
- S3 Store standardization implementation: `323860d`.
- S4 Customize implementation: `d08a4dc`.
- S4 docs/evidence: pending final Preview evidence commit.

## 20. Verdict

S4 Customize flow is complete within scope. Registry truth, six-template browse/detail/preview foundation, direct Customize entry, normalized client-only draft, four-step capture, safe restoration/reset, and responsive/a11y behavior are validated. Boundary remains clear: Recommendation Engine, Summary, centralized WhatsApp handoff, redirects, Hub integration, checkout, accounts, pricing calculator, new templates, merge, and production launch remain deferred. Stop here pending S4 review; do not start S5.
