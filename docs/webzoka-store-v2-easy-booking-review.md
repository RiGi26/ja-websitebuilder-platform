# Webzoka Store V2 — Easy Booking Review

## Purpose

Easy Booking is Template #6 and the final flagship template for V1. It is for owner-led rental businesses that need visitors to understand units, compare practical details, and send a booking inquiry clearly. The fictional demo brand is **Ruang Jalan Rental**.

The prototype models rental discovery and a booking inquiry. It does not model live availability, instant reservation, payment, customer accounts, or a booking backend.

## Metadata

- Slug: `easy-booking`
- Category: `Rental`
- Business types: Car Rental, Motorcycle Rental, Equipment Rental, Studio Rental, Venue Rental, Property Rental
- Intents: Tampilkan unit, Terima booking, Tampilkan harga, Kelola inventory
- Included: Homepage, Category browsing, Unit catalog, Unit detail, Rental process, Booking inquiry, Requirements/terms, Location/contact, FAQ, Responsive, Basic SEO
- Optional: Availability management, Booking management, Inventory, Transaction tracking, Customer database, Payment, Customer login
- Base recommendation: Website
- Upgrade recommendation: Website + Portal
- Preview status: Preview

## Routes

- `/store`
- `/store/template/easy-booking`
- `/store/template/easy-booking/preview`

## Direction

- Utility-first rental browsing with clear booking inquiry.
- Fictional brand: **Ruang Jalan Rental**.
- Vehicle-rental demo scope using four coherent car categories: City Car, Family, MPV, and Premium.
- `Barlow Condensed` display paired with `IBM Plex Sans` body copy for a practical, inventory-led character.
- Warm White `#F8F7F3`, white, ink `#1B2328`, soft ink `#5B666D`, deep teal `#246A73`, soft teal `#DDECEE`, sand `#EDE6D8`, amber `#D49A3A`, and quiet line `#D8DEE1`.
- Signature visual: CSS-built vehicle study with route lines, unit label, and request/confirm framing. It uses no remote image dependency.
- The page is more utilitarian and inventory-led than Course Enrollment, less editorial than Trust Profile, less clinical than Care Booking, and more booking-specific than Modern Catalog.

## Homepage Narrative

- Hero: `Temukan unit yang tepat, lalu ajukan waktu rental dengan mudah.` with `Lihat Unit` and `Cara Rental` actions.
- Category discovery: City Car, Family, MPV, and Premium filters with a clear all-units reset.
- Featured units: Nara City 1.2 and Kita Hatchback with useful summary information and detail actions.
- Unit catalog: category filtering, search, readable cards, example price visibility, specs, and an honest no-results state.
- Unit detail: selected unit visual, category, example starting price, description, seats, transmission, luggage, fuel, rental terms, pickup/drop-off framing, related units, and `Ajukan Booking`.
- Rental process: `Pilih unit` → `Ajukan tanggal` → `Admin konfirmasi` → `Rental dimulai`.
- Requirements/terms: configurable framing for identity, deposit, and pickup/drop-off area. No mandatory legal or deposit claim is made.
- Booking inquiry: unit, rental start date, rental end date, pickup preference, name, WhatsApp, and optional note.
- Confirmation: `Permintaan booking sudah dicatat.` followed by an explicit admin follow-up for availability, rental details, and final price.
- Location/contact: fictional/demo location and service-area treatment, plus a generic preview WhatsApp destination that must be replaced before production.
- FAQ: confirmation timing, date changes, minimum rental, pickup/drop-off, and unavailable unit handling.
- Final CTA: `Ajukan Booking` and `Hubungi Admin` with a production contact warning.

## Easy Booking Contract

- Visitor journey: arrive → browse categories → compare units → inspect detail → choose dates/preferences → submit inquiry → admin confirms availability and final price.
- Every unit, price, location, service-area statement, and policy example is fictional/configurable demo content.
- The page never claims `Available today`, `Only 1 left`, live seats, instant booking, confirmed reservation, delivery coverage, insurance, customer counts, ratings, awards, or legal guarantees.
- The form is local preview behavior only. It does not create a booking, reserve inventory, accept payment, send data externally, or create an account.
- Confirmation means the request was recorded in the preview. It does not mean a reservation is confirmed.
- The preview explicitly tells visitors not to send identity documents or sensitive data.

## Scope Boundaries

- No live availability engine, inventory backend, booking backend, CRM, Portal/Hub, Bundle, account, login, payment, checkout, transaction tracking, or customer database was added.
- No remote images, image upload, sensitive ID field, fake scarcity, fake rental/legal/insurance promise, or auto-moving carousel was added.
- Store integration is limited to one Easy Booking card, route links, and the Store round note. Modern Catalog, Trust Profile, Care Booking, and Course Enrollment source experiences remain unchanged. Warm Commerce remains outside this repository/worktree.
- No broad Store refactor or template engine was started. The existing Store has no shared template registry, so Easy Booking follows the established route/component pattern with local demo data.

## Implementation Notes

- Easy Booking uses an isolated `eb-*` CSS namespace in `src/app/store/store.css` and a local `easy-booking-experience.tsx` client component.
- CSS vehicle visuals and Lucide SVG icons keep the prototype self-contained and avoid missing-alt-text surfaces.
- Mobile layout starts as one column, hides the secondary topbar CTA in favor of brand + menu affordance, stacks form fields, and keeps visible controls at or above 44px.
- Category filters, search, selected unit detail, mobile navigation, FAQ disclosure, local form success state, focus rings, and reduced-motion rules are included.
- The code is intentionally structured around local category/unit arrays so a future template data model can replace demo content without changing the page narrative.

## Preview Evidence

- Preview URL: <https://ja-websitebuilder-platform-2ombqyzwo-rigi26s-projects.vercel.app/store/template/easy-booking/preview>
- Deployment ID: `dpl_UVJYkg4iLuwXmhXjc8wy5xatvkRc`
- Vercel target/status: `preview` / `Ready`
- The deploy was created from `codex/webzoka-v7-prototype`; no production deployment or promotion was run.

## Verification Evidence

- Fresh local HTTP checks returned `200` for `/store`, Modern Catalog detail/preview, Trust Profile detail/preview, Care Booking detail/preview, Course Enrollment detail/preview, and Easy Booking detail/preview.
- Fresh hosted HTTP checks returned `200` for the same Store/detail/preview route set on the new Preview deployment.
- `npm run typecheck` (`tsc --noEmit`): pass, exit 0.
- `npm run build`: pass, exit 0; 73 static pages generated, including both Easy Booking routes.
- `git diff --check`: pass, exit 0; Git emitted only existing LF/CRLF normalization notices.
- `npx tsc --noEmit`: the environment's `npx` launcher resolved to its package-install guidance instead of the local compiler; the project-local `npm run typecheck` completed successfully with the same `tsc --noEmit` command.
- `npm run lint`: unavailable because this Next 16 project's `next lint` script interprets `lint` as a missing project directory before linting; no lint configuration was changed.
- Exact browser UAT at `1440×900`: Easy Booking had no horizontal overflow, one `h1`, no missing image alt, all visible interactive targets at least 44px, and no console errors/warnings.
- Exact browser UAT at `390×844`: Easy Booking had no horizontal overflow, one `h1`, no missing image alt, all 46 visible interactive targets at least 44px, and no console errors/warnings.
- Easy Booking interaction checks: mobile menu opens, category filter reduces the catalog to one Family unit, unit selection updates detail and form selection, local inquiry reaches `Permintaan booking sudah dicatat.`, FAQ disclosure opens, and the Store Easy Booking card opens the detail route.
- Hosted Preview interaction check: the same menu/filter/unit/form path reached `Permintaan booking sudah dicatat.` on the deployed Preview URL.
- Hosted Preview exact-viewport audit at `1440×900` and `390×844`: no horizontal overflow, one `h1`, zero missing image alts, all visible interactive targets at least 44px, and no console errors/warnings.
- Prior-template regression UAT at `1440×900` and `390×844`: Store, Modern Catalog preview, Trust Profile preview, Care Booking preview, and Course Enrollment preview each returned one `h1`, zero missing image alts, and no horizontal overflow.

## Review Checks Before Production

- Replace fictional unit catalog, prices, location, service area, terms, and WhatsApp destination with approved customer content.
- Connect the inquiry action to an approved admin/CRM workflow before treating the form as a production lead path.
- Decide whether the real business needs Website only or Website + Portal for availability, inventory, and booking management.
- Re-run cross-template exact viewport QA before Store V2 system integration or production activation.
- Keep all availability language informational until a real inventory/booking source exists.

## Commits

- Code/prototype: `6989ddf` (`feat(store): add Easy Booking template prototype`)
- Review note: final review packet committed after Preview verification.
