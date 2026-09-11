# Webzoka Store V2 — Care Booking Review

## Purpose

Care Booking is Template #4 for clinics, practitioners, wellness services, and premium salons that need a calm path from service discovery to an appointment request. The fictional brand is **Ruang Pulih**.

The prototype models an appointment request / booking inquiry. It does not model real-time availability or instant confirmation.

## Metadata

- Slug: `care-booking`
- Category: `Klinik & Wellness`
- Business types: Clinic, Physiotherapy, Dental, Beauty Clinic, Therapy, Wellness, Salon
- Intents: Tampilkan layanan, Terima booking, Kelola customer, Punya dashboard admin
- Included: Homepage, Service listing, Service detail, Practitioner profile, Schedule information, Appointment request, Location, FAQ, WhatsApp/contact, Responsive, Basic SEO
- Optional: Appointment management, Customer record, Practitioner management, Reminder, Payment, Customer login
- Base recommendation: Website
- Upgrade recommendation: Website + Portal
- Preview status: Preview

## Routes

- `/store`
- `/store/template/care-booking`
- `/store/template/care-booking/preview`

## Direction

- Calm service clarity using warm white, soft sand, ink, sage, soft sage, muted blue, and quiet line colors.
- Editorial `Newsreader` headings paired with `Manrope` interface copy.
- A service-first hero, larger service entries, role-based practitioner profiles, stacked informational schedule rows, and a clear request path.
- Preview navigation: Layanan, Praktisi, Cara Booking, Lokasi, FAQ, and Ajukan Jadwal.
- Section order: Hero → Services → Practitioner → Schedule Info → How Booking Works → Appointment Request → Location → Trust → FAQ → Final CTA.

## Care Booking Contract

- Hero positioning: “Perawatan yang lebih terarah, dimulai dari langkah yang sederhana.”
- Primary actions: `Lihat Layanan`, `Ajukan Jadwal`, and final `Hubungi Admin`.
- Services: Konsultasi Awal, Sesi Perawatan, and Follow-up / Evaluasi. Each includes non-diagnostic audience guidance, what happens, sample duration, preparation, a demo practitioner, and an appointment-request CTA.
- Practitioners: clearly fictional/demo profiles for Maya Pradana and Raka Putra. No degrees, licenses, certifications, awards, ratings, or outcome claims.
- Schedule: Senin 09.00–15.00, Rabu 12.00–18.00, and Sabtu 09.00–13.00. Copy explicitly labels this as information only, not live availability.
- Request fields: service, optional practitioner, desired day, time period, name, WhatsApp, and a short note. The note helper explicitly excludes diagnosis and medical history.
- Confirmation: local preview state says `Permintaan jadwal sudah dicatat.` and explains that the team will confirm through WhatsApp. It never claims the appointment is confirmed.
- Location: fictional/demo address only: Jl. Sawo Kecil No. 18, Cipete, Jakarta Selatan.
- Trust: clarity comes from visible services, process, practitioner profiles, schedule information, and contact path—not invented proof.
- FAQ: confirmation, rescheduling, practitioner choice, arrival, and uncertainty about which service to choose. Uncertainty routes to admin / initial consultation rather than diagnosis.

## Scope Boundaries

- Form is local preview behavior only; no database, API, CRM, customer account, payment, checkout, portal, clinic-management system, medical record, or real-time scheduling engine was added.
- No sensitive medical fields, patient counts, ratings, certifications, insurance claims, facility claims, or treatment guarantees were added.
- WhatsApp links are generic preview destinations and must be replaced with a real business destination before production activation.
- Modern Catalog and Trust Profile remain separate. Warm Commerce remains out of scope in its separate repository/worktree.
- Template #5 was not started.

## Implementation Notes

- Care Booking uses an isolated `cb-*` CSS namespace. Existing `mc-*` and `tp-*` styling remains untouched except for the new Store card integration.
- The visual system is CSS/icon based; no remote image dependency or missing-alt-text surface was introduced.
- Form success and FAQ disclosure use local browser state. Reduced-motion styling and visible keyboard focus states are included.
- Store detail/preview page metadata identifies Care Booking and keeps the existing Store V2 catalog structure.

## Preview Evidence

- Preview URL: <https://ja-websitebuilder-platform-jw3sff88v-rigi26s-projects.vercel.app>
- Deployment ID: `dpl_DEsx4uSNmhG8EmGiZqTQhV5Qaj4s`
- Vercel target/status: `preview` / `Ready`
- Fresh deployed HTTP checks returned `200` for all seven Store and template routes listed above.
- Deployed browser smoke pass confirmed the preview strip, complete navigation, service/practitioner/schedule content, FAQ expansion, appointment form submission, and confirmation state.

## Verification Evidence

- Fresh local HTTP checks returned `200` for Store, Modern Catalog detail/preview, Trust Profile detail/preview, and Care Booking detail/preview.
- `npx tsc --noEmit`: pass, exit 0.
- `npm run build`: pass, exit 0; all 69 static pages generated, including both Care Booking routes.
- `git diff --check`: pass, exit 0.
- `npm run lint`: unavailable because this Next 16 project’s `next lint` script is interpreted as a missing project directory (`...\\lint`) before linting; no lint configuration was changed.
- CUA browser UAT at the available approximately 584px in-app viewport: Care Booking rendered, Store card/link worked, preview navigation anchors updated the URL, FAQ opened, form submitted, and honest confirmation state appeared.
- The available browser surface did not expose exact viewport override or console-log inspection. Exact 1440×900 and 390×844 screenshots, and direct console warning/error evidence, remain pending a Playwright-capable runner.

## Review Checks Before Production

- Replace fictional practitioner, location, schedule, and WhatsApp destination data.
- Connect the appointment-request action to an approved admin workflow before treating it as a production form.
- Re-run exact 1440×900 and 390×844 visual UAT with console inspection.
- Preserve the appointment-request language; do not convert informational schedule rows into live availability without a real scheduling source.

## Commits

- Code/prototype: `f5e8607` (`feat(store): add Care Booking template prototype`)
- Initial review note: `0981922` (`docs(store): add Care Booking review note`)
