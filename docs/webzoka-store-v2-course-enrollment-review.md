# Webzoka Store V2 — Course Enrollment Review

## Purpose

Course Enrollment is Template #5 for owner-led education and training businesses that need prospective students to understand programs, schedule, commitment, and enrollment steps clearly. The fictional demo brand is **Kelas Reka**.

The prototype models program discovery and an enrollment-interest request. It is not an LMS, student portal, payment flow, or confirmed enrollment system.

## Metadata

- Slug: `course-enrollment`
- Category: `Edukasi`
- Business types: Language Course, Tutoring, Training Provider, Skills Academy, Bootcamp, Music/Art Course
- Intents: Tampilkan program, Terima pendaftaran, Tampilkan jadwal, Punya student/member login
- Included: Homepage, Program listing, Program detail, Schedule/intake info, Learning journey, Enrollment request, FAQ, Contact, Responsive, Basic SEO
- Optional: Student login, Enrollment management, Class management, Material, Attendance, Payment, Certificate
- Base recommendation: Website
- Upgrade recommendation: Bundle when student login or enrollment management is needed
- Preview status: Preview

## Routes

- `/store`
- `/store/template/course-enrollment`
- `/store/template/course-enrollment/preview`

## Direction

- Structured learning journey + optimistic enrollment clarity.
- Fictional brand: **Kelas Reka**.
- Rubik display paired with DM Sans body copy.
- Warm Paper `#F7F5EF`, white, ink `#1C2730`, soft ink `#58636B`, indigo `#4457B5`, soft indigo `#E8EBF8`, warm yellow `#E4B64A`, mint `#DDEBE3`, and line `#DADDE2`.
- Signature moment: a program-route board with numbered steps, used in the hero and echoed by the featured learning path.
- The page is more colorful and structured than Trust Profile or Care Booking, while remaining calm and premium.

## Homepage Narrative

- Hero: `Temukan program yang cocok untuk langkah berikutnya.` with `Lihat Program` and `Cara Belajar` actions.
- Program discovery: three meaningful demo programs with target learner context, level, example duration, frequency, format, learning topics, included items, and preparation guidance.
- Program detail: selected program panel with `Cocok untuk siapa`, what participants may learn, example schedule pattern, format, what is included, what to prepare, and `Daftar Minat`.
- Featured program: a stronger visual learning path for `Bahasa Jepang Dasar`, rather than a row of equal marketing cards.
- Learning journey: `Pilih program` → `Konsultasi / cek kecocokan` → `Konfirmasi jadwal` → `Mulai belajar`.
- Schedule/intake: example evening, weekend, and flexible-time cards. Copy explicitly states that schedules are examples and must be discussed with the organizer.
- Trust: program clarity, transparent schedule framing, readable learning format, and accessible admin contact path.
- Enrollment request: program, schedule preference, name, WhatsApp, optional email, current level, and optional goal/note.
- Confirmation: `Pendaftaran minat sudah dicatat.` followed by an honest admin follow-up explanation.
- FAQ: program choice, consultation, schedule changes, preparation, and what happens after sending interest.
- Final CTA: `Konsultasi Program` and `Daftar Minat` route to the enrollment-interest section.

## Course Enrollment Contract

- The visitor journey is: arrive → understand programs → compare programs → see schedule/intake examples → understand the learning commitment → send interest → admin follow-up.
- Program data is fictional/demo and intended to be configurable.
- Schedule cards are informational examples. They do not show live seats, capacity, countdowns, or urgency.
- Copy does not claim accreditation, certificates, instructor credentials, completion rates, employment outcomes, exam passes, or guaranteed proficiency.
- Form behavior is local preview behavior only. It does not create an account, accept payment, enroll a student, or send data externally.
- Confirmation means the interest request was recorded in the preview. It does not mean enrollment is confirmed.

## Scope Boundaries

- No student login, LMS, portal, attendance, class management, learning-material delivery, certificate system, payment, checkout, database, API, CRM, or admin system was added.
- No fake seat availability, enrollment counts, testimonials, ratings, partner logos, accreditation, completion statistics, job outcomes, or instructor qualifications were added.
- Modern Catalog, Trust Profile, and Care Booking source experiences were not changed. Store index changes are limited to Course Enrollment card/copy integration.
- Warm Commerce remains outside this repository/worktree and this round.
- No broad Store refactor was made. Existing Store pages do not expose a shared template data registry, so Course Enrollment uses the established route/component pattern and keeps its data local to the bounded experience.

## Implementation Notes

- Course Enrollment uses an isolated `ce-*` CSS namespace in `src/app/store/store.css`.
- The experience component is client-side only for program selection, mobile menu state, FAQ disclosure, form state, and local confirmation state.
- Visuals are CSS and Lucide SVG icons only. No remote image dependency or missing-alt-text surface was introduced.
- Navigation has desktop links and a mobile menu button with `aria-expanded`/`aria-controls`.
- Mobile layout starts at one column, converts the program detail and form to stacked content, and keeps touch targets at or above 44px.
- The design preserves a clear future upgrade path toward a portal/bundle without implementing that system in this round.

## Preview Evidence

- Preview URL: <https://ja-websitebuilder-platform-m8e2irg0y-rigi26s-projects.vercel.app/store/template/course-enrollment/preview>
- Deployment ID: `dpl_E3Wka7qwzU1Gnw7Z3CX7CSCpF5Vx`
- Vercel target/status: `preview` / `Ready`
- Hosted route checks returned `200` for Store, all prior detail/preview routes, and both Course Enrollment routes.

## Verification Evidence

- `npx tsc --noEmit`: pass, exit 0.
- `npm run build`: pass, exit 0; 71/71 static pages generated, including both Course Enrollment routes.
- `git diff --check`: pass, exit 0.
- `npm run lint`: unavailable because this Next 16 project's `next lint` script is interpreted as a missing project directory (`...\\lint`) before linting; no lint configuration was changed.
- Hosted Playwright UAT at exact `1440×900`: no horizontal overflow, one `h1`, no missing image alt, all visible interactive targets at least 44px, hero actions inside the viewport, no console errors/warnings, and no failed requests.
- Hosted Playwright UAT at exact `390×844`: no horizontal overflow, one `h1`, no missing image alt, all visible interactive targets at least 44px, mobile menu opens, hero actions inside the viewport, no console errors/warnings, and no failed requests.
- Hosted interaction checks: program selection updates detail content to `English Conversation`; enrollment-interest form reaches `Pendaftaran minat sudah dicatat.`; FAQ disclosure opens; Store Course card opens the Course detail route.
- Prior-template regression checks at exact `1440×900` and `390×844`: Store, Modern Catalog preview, Trust Profile preview, and Care Booking preview returned `200` with no horizontal overflow and no missing image alt.
- Hosted rendered copy scan found no terms suggesting fake certificates, accreditation, ratings, limited availability, participant counts, completion claims, or job guarantees.

## Review Checks Before Production

- Replace fictional programs, schedule examples, contact destination, and admin follow-up with approved customer content.
- Connect the enrollment-interest action to an approved lead/admin workflow before calling it a production form.
- Decide whether the real business needs only a Website or a Bundle with student/member and enrollment-management capabilities.
- Re-run cross-template exact viewport QA before Store V2 integration/production.
- Keep schedule/intake language informational until a real scheduling or enrollment source exists.

## Commits

- Code/prototype: `e8df496` (`feat(store): add Course Enrollment template prototype`)
