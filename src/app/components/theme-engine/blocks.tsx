// ============================================================
// THEME SYSTEM — Lapis 2 perpustakaan balok (S0-2 + S1-2).
// Balok section parametrik via token (CSS vars dari packs.ts). Tiap section
// punya beberapa VARIAN; manifest memilih varian per slot.
// S1-2: dukungan FOTO hero (gradient → foto + scrim) + balok Features (keunggulan).
//
// Konvensi: semua warna/font/radius/shadow lewat var(--c-*/--f-*/--r-*/--s-*),
// JANGAN hex hardcoded — kecuali scrim hitam untuk keterbacaan teks di atas foto.
// ============================================================
import type { ComposableContent, ShowcaseItem, MotifVariant, Testimonial, StatItem, FaqItem, InfoLokasi, GalleryContent, TeamMember, PricingContent, PricingPlan, ProcessContent, PartnerLogo, PartnersContent, SocialContent, SocialPlatform, StatementContent, PresetBand } from '@/lib/theme-system/manifest'

export const ENGINE_CSS = `
.ce-root { background: var(--c-page); color: var(--c-ink); font-family: var(--f-body); font-weight: var(--fw-body); -webkit-font-smoothing: antialiased; }
.ce-root h1, .ce-root h2, .ce-root h3 { font-family: var(--f-display); font-weight: var(--fw-display); letter-spacing: var(--tracking); text-wrap: balance; }
.ce-btn { background: var(--c-primary); color: var(--c-on-primary); border-radius: var(--r-pill); box-shadow: var(--s-md); transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s ease; text-decoration: none; }
.ce-btn:hover { transform: translateY(-2px); box-shadow: var(--s-lg); }
.ce-btn:active { transform: scale(.97); }
.ce-card { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--s-sm); transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease; overflow: hidden; }
.ce-card:hover { transform: translateY(-4px); box-shadow: var(--s-lg); }
.ce-eyebrow { color: var(--c-primary); text-transform: uppercase; letter-spacing: .18em; font-weight: 700; font-size: 12px; }
.ce-menu-row { border-top: 1px solid var(--c-border); transition: padding-left .2s ease, background-color .2s ease; }
.ce-menu-row:hover { padding-left: 8px; background: color-mix(in srgb, var(--c-primary) 5%, transparent); }
.ce-feat-row { border-top: 1px solid var(--c-border); transition: padding-left .2s ease; }
.ce-feat-row:hover { padding-left: 8px; }
.ce-root p { text-wrap: pretty; }
.ce-price { font-variant-numeric: tabular-nums; }
.ce-btn:hover { box-shadow: 0 12px 28px color-mix(in srgb, var(--c-primary) 38%, transparent); }
/* Stagger fade-in (CSS-only, server-safe) */
.ce-stagger > * { opacity: 0; transform: translateY(14px); animation: ceFadeUp .5s cubic-bezier(.16,1,.3,1) forwards; }
.ce-stagger > *:nth-child(1){animation-delay:0ms}.ce-stagger > *:nth-child(2){animation-delay:80ms}.ce-stagger > *:nth-child(3){animation-delay:160ms}.ce-stagger > *:nth-child(4){animation-delay:240ms}.ce-stagger > *:nth-child(5){animation-delay:320ms}.ce-stagger > *:nth-child(6){animation-delay:400ms}.ce-stagger > *:nth-child(n+7){animation-delay:480ms}
@keyframes ceFadeUp { to { opacity: 1; transform: translateY(0); } }
/* Lookbook (editorial fashion) — image zoom halus saat hover, tanpa JS */
.ce-look-frame { overflow: hidden; border-radius: var(--r-lg); border: 1px solid var(--c-border); background: linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to)); }
.ce-look-img { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1.001); transition: transform .6s cubic-bezier(.16,1,.3,1); }
.ce-look-card:hover .ce-look-img { transform: scale(1.05); }
.ce-look-idx { font-family: var(--f-display); font-weight: var(--fw-display); color: var(--c-primary); opacity: .55; font-variant-numeric: tabular-nums; }
/* Floating WhatsApp — wajib konteks Indonesia */
.ce-wa { position: fixed; right: 20px; bottom: 20px; z-index: 999; width: 56px; height: 56px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 22px rgba(37,211,102,.40); transition: transform .2s cubic-bezier(.16,1,.3,1); }
.ce-wa:hover { transform: scale(1.08); }
.ce-wa:active { transform: scale(.96); }
/* ── Sprint 5 balok ───────────────────────────────────────── */
/* Testimoni — kartu quote: lift + border menyala primary saat hover */
.ce-quote { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--s-sm); transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease, border-color .25s ease; }
.ce-quote:hover { transform: translateY(-4px); box-shadow: var(--s-lg); border-color: color-mix(in srgb, var(--c-primary) 40%, var(--c-border)); }
.ce-quote-mark { font-family: var(--f-display); font-weight: var(--fw-display); color: var(--c-primary); opacity: .28; line-height: .6; }
/* Testimoni spotlight — panel signature: watermark kutipan raksasa + panel ber-tint + avatar */
.ce-spotlight { position: relative; overflow: hidden; margin: 0; border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--s-sm); background: linear-gradient(180deg, color-mix(in srgb, var(--c-primary) 7%, var(--c-surface)) 0%, var(--c-surface) 70%); }
.ce-spotlight-mark { position: absolute; top: clamp(-28px, -2.5vw, -8px); left: 50%; transform: translateX(-50%); font-family: var(--f-display); font-weight: var(--fw-display); color: var(--c-primary); opacity: .1; font-size: clamp(180px, 28vw, 300px); line-height: 1; pointer-events: none; user-select: none; }
/* Marquee testimoni — dua track berjalan, CSS-only, jeda saat hover */
.ce-marquee { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.ce-marquee-track { display: flex; gap: 20px; width: max-content; animation: ceMarquee 38s linear infinite; }
.ce-marquee:hover .ce-marquee-track { animation-play-state: paused; }
@keyframes ceMarquee { to { transform: translateX(-50%); } }
/* Stats — signature credibility band: kontainer ber-tint primary + garis pemisah antar kolom */
.ce-stat-num { font-family: var(--f-display); font-weight: var(--fw-display); color: var(--c-primary); font-variant-numeric: tabular-nums; line-height: 1; letter-spacing: var(--tracking); }
.ce-stats-band { border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--s-sm); background: linear-gradient(180deg, color-mix(in srgb, var(--c-primary) 6%, var(--c-surface)) 0%, var(--c-surface) 100%); overflow: hidden; }
.ce-stat { padding: 14px 18px; }
.ce-stat + .ce-stat { border-left: 1px solid var(--c-border); }
@media (max-width: 560px) {
  .ce-stats-band { grid-template-columns: repeat(2, 1fr) !important; }
  .ce-stat + .ce-stat { border-left: 0; }
  .ce-stat { border-top: 1px solid var(--c-border); }
  .ce-stat:nth-child(-n+2) { border-top: 0; }
  .ce-stat:nth-child(even) { border-left: 1px solid var(--c-border); }
}
/* FAQ — accordion CSS-only via <details>, ikon +/− berputar */
.ce-faq { border-top: 1px solid var(--c-border); }
.ce-faq > summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 0; font-family: var(--f-display); font-weight: 700; color: var(--c-ink); transition: color .2s ease; }
.ce-faq > summary::-webkit-details-marker { display: none; }
.ce-faq > summary:hover { color: var(--c-primary); }
.ce-faq-ico { flex-shrink: 0; width: 26px; height: 26px; border-radius: 999px; background: color-mix(in srgb, var(--c-primary) 12%, transparent); color: var(--c-primary); display: flex; align-items: center; justify-content: center; transition: transform .25s cubic-bezier(.16,1,.3,1); }
.ce-faq[open] .ce-faq-ico { transform: rotate(45deg); }
.ce-faq-body { padding: 0 0 22px; color: var(--c-muted); line-height: 1.7; max-width: 640px; }
/* Info/Lokasi — kartu jam buka + peta embed */
.ce-map { border: 0; width: 100%; height: 100%; min-height: 280px; display: block; filter: grayscale(.15); }
.ce-jam-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 11px 0; border-top: 1px solid var(--c-border); }
.ce-jam-row:first-child { border-top: 0; }
/* ── Sprint 5b galeri ─────────────────────────────────────── */
/* Masonry — kolom CSS, foto mengalir tinggi-rendah */
.ce-masonry { columns: 3 260px; column-gap: 16px; }
.ce-masonry > figure { break-inside: avoid; margin: 0 0 16px; border-radius: var(--r-md); overflow: hidden; border: 1px solid var(--c-border); box-shadow: var(--s-sm); position: relative; }
.ce-masonry img { width: 100%; display: block; transition: transform .5s cubic-bezier(.16,1,.3,1); }
.ce-masonry figure:hover img { transform: scale(1.05); }
.ce-masonry figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 14px 14px 10px; font-size: 12px; font-weight: 700; color: #fff; background: linear-gradient(180deg, transparent, rgba(0,0,0,.6)); }
/* Before/After — pasangan gambar, label di pojok, lift saat hover */
.ce-ba-card { border-radius: var(--r-lg); overflow: hidden; border: 1px solid var(--c-border); box-shadow: var(--s-sm); background: var(--c-surface); transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease; }
.ce-ba-card:hover { transform: translateY(-4px); box-shadow: var(--s-lg); }
.ce-ba-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
.ce-ba-pane { position: relative; aspect-ratio: 3 / 4; background: linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to)); }
.ce-ba-pane img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ce-ba-tag { position: absolute; top: 10px; left: 10px; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; padding: 4px 9px; border-radius: 999px; background: rgba(0,0,0,.62); color: #fff; }
.ce-ba-tag.after { background: var(--c-primary); color: var(--c-on-primary); }
@media (prefers-reduced-motion: reduce) { .ce-stagger > * { opacity: 1; transform: none; animation: none; } .ce-marquee-track { animation: none; } }
/* ── Sprint A — Trust layer ───────────────────────────────── */
/* Team/People — hover: foto zoom + bio slide up */
.ce-team-card { position: relative; }
.ce-team-photo { overflow: hidden; }
.ce-team-photo img { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1.001); transition: transform .5s cubic-bezier(.16,1,.3,1); }
.ce-team-card:hover .ce-team-photo img { transform: scale(1.05); }
.ce-team-bio-reveal { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 14px 10px; font-size: 12px; line-height: 1.5; color: #fff; background: linear-gradient(180deg, transparent, rgba(0,0,0,.72)); transform: translateY(100%); transition: transform .32s cubic-bezier(.16,1,.3,1); }
.ce-team-card:hover .ce-team-bio-reveal { transform: translateY(0); }
/* Team horizontal — scroll snapping, hidden scrollbar */
.ce-team-scroll { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 8px; }
.ce-team-scroll::-webkit-scrollbar { display: none; }
.ce-team-scroll-item { scroll-snap-align: start; flex-shrink: 0; width: 200px; }
/* Zigzag features — nth-child(even) reverses flex direction */
.ce-zigzag-item { display: flex; gap: 56px; align-items: center; padding: 56px 0; border-top: 1px solid var(--c-border); }
.ce-zigzag-item:first-child { border-top: none; padding-top: 0; }
.ce-zigzag-item:nth-child(even) { flex-direction: row-reverse; }
@media (max-width: 767px) { .ce-zigzag-item, .ce-zigzag-item:nth-child(even) { flex-direction: column; gap: 32px; padding: 40px 0; } }
@media (prefers-reduced-motion: reduce) { .ce-team-photo img { transition: none; } .ce-team-bio-reveal { transition: none; transform: translateY(0); } }
/* ── Sprint B — Conversion layer ──────────────────────────── */
/* Pricing cards — kartu tier, paket unggulan diangkat + ring primary */
.ce-pcard { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--s-sm); display: flex; flex-direction: column; transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease, border-color .25s ease; }
.ce-pcard:hover { transform: translateY(-4px); box-shadow: var(--s-lg); }
.ce-pcard.feat { border-color: var(--c-primary); box-shadow: 0 16px 44px color-mix(in srgb, var(--c-primary) 22%, transparent); }
.ce-pcard-amt { font-family: var(--f-display); font-weight: var(--fw-display); font-variant-numeric: tabular-nums; color: var(--c-ink); line-height: 1; letter-spacing: var(--tracking); }
.ce-pcard-badge { background: var(--c-primary); color: var(--c-on-primary); font-size: 11px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; }
.ce-pcard-feat { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-top: 1px solid var(--c-border); font-size: 14px; color: var(--c-ink); line-height: 1.5; }
.ce-pcard-feat:first-child { border-top: none; }
.ce-pcard-tick { flex-shrink: 0; color: var(--c-primary); margin-top: 2px; }
/* Pricing table — matriks perbandingan, scroll horizontal di mobile */
.ce-ptab-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid var(--c-border); border-radius: var(--r-lg); }
.ce-ptab { width: 100%; border-collapse: collapse; min-width: 560px; }
.ce-ptab th, .ce-ptab td { padding: 16px 18px; text-align: left; border-bottom: 1px solid var(--c-border); vertical-align: middle; }
.ce-ptab tr:last-child td { border-bottom: none; }
.ce-ptab thead th { border-bottom: 2px solid var(--c-border); vertical-align: bottom; }
.ce-ptab .col { text-align: center; }
.ce-ptab thead th.feat { background: color-mix(in srgb, var(--c-primary) 9%, transparent); }
.ce-ptab tbody td.feat, .ce-ptab tfoot td.feat { background: color-mix(in srgb, var(--c-primary) 5%, transparent); }
.ce-ptab-amt { font-family: var(--f-display); font-weight: var(--fw-display); font-variant-numeric: tabular-nums; color: var(--c-ink); font-size: 26px; line-height: 1; }
.ce-ptab-tick { color: var(--c-primary); }
.ce-ptab-x { color: var(--c-muted); opacity: .45; }
/* Process horizontal — node bernomor sebaris + konektor garis */
.ce-proc { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 20px; }
.ce-proc-step { position: relative; text-align: center; padding: 0 8px; }
.ce-proc-node { width: 56px; height: 56px; margin: 0 auto 18px; border-radius: 999px; background: color-mix(in srgb, var(--c-primary) 14%, var(--c-surface)); color: var(--c-primary); display: flex; align-items: center; justify-content: center; font-family: var(--f-display); font-weight: 800; font-size: 22px; position: relative; z-index: 1; }
.ce-proc-line { position: absolute; top: 28px; left: 50%; right: -50%; height: 2px; background: var(--c-border); z-index: 0; }
.ce-proc-step:last-child .ce-proc-line { display: none; }
@media (max-width: 767px) { .ce-proc { grid-auto-flow: row; } .ce-proc-line { display: none; } }
/* Process timeline — linimasa vertikal + node */
.ce-tl-item { position: relative; padding: 0 0 32px 60px; }
.ce-tl-item:last-child { padding-bottom: 0; }
.ce-tl-item::before { content: ''; position: absolute; left: 19px; top: 8px; bottom: -8px; width: 2px; background: var(--c-border); }
.ce-tl-item:last-child::before { display: none; }
.ce-tl-node { position: absolute; left: 0; top: 0; width: 40px; height: 40px; border-radius: 999px; background: var(--c-primary); color: var(--c-on-primary); display: flex; align-items: center; justify-content: center; font-family: var(--f-display); font-weight: 800; font-size: 16px; z-index: 1; }
/* CTA banner — strip lebar penuh, teks kiri + tombol kanan */
.ce-cta-banner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 28px; }
@media (prefers-reduced-motion: reduce) { .ce-pcard { transition: none; } }
/* ── Sprint C — Partner logos / Social links ──────────────── */
/* Logo strip — grayscale→warna saat hover, chip teks bila tak ada logo */
.ce-logo { display: flex; align-items: center; justify-content: center; height: 48px; padding: 0 8px; filter: grayscale(1); opacity: .6; transition: filter .25s ease, opacity .25s ease, transform .25s cubic-bezier(.16,1,.3,1); }
.ce-logo:hover { filter: grayscale(0); opacity: 1; transform: translateY(-2px); }
.ce-logo img { max-height: 100%; max-width: 150px; width: auto; object-fit: contain; display: block; }
.ce-logo-chip { font-family: var(--f-display); font-weight: 700; font-size: 18px; color: var(--c-ink); white-space: nowrap; letter-spacing: var(--tracking); }
.ce-logo-grid { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 18px 48px; }
.ce-logo-marquee { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.ce-logo-track { display: flex; align-items: center; gap: 56px; width: max-content; animation: ceMarquee 30s linear infinite; }
.ce-logo-marquee:hover .ce-logo-track { animation-play-state: paused; }
/* Social — ikon bulat, hover isi primary + lift */
.ce-social-row { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: center; gap: 22px; }
.ce-social-item { display: flex; flex-direction: column; align-items: center; gap: 8px; text-decoration: none; }
.ce-social-ic { width: 52px; height: 52px; border-radius: 999px; display: flex; align-items: center; justify-content: center; background: var(--c-surface); border: 1px solid var(--c-border); color: var(--c-ink); box-shadow: var(--s-sm); transition: transform .25s cubic-bezier(.16,1,.3,1), background-color .25s ease, color .25s ease, box-shadow .25s ease, border-color .25s ease; }
.ce-social-item:hover .ce-social-ic { background: var(--c-primary); color: var(--c-on-primary); border-color: var(--c-primary); transform: translateY(-3px); box-shadow: var(--s-md); }
.ce-social-lbl { font-size: 12px; font-weight: 600; color: var(--c-muted); }
@media (prefers-reduced-motion: reduce) { .ce-logo-track { animation: none; } .ce-logo, .ce-social-ic { transition: none; } }
/* ── Sprint 10a — Showcase khas-industri ──────────────────── */
/* Header kategori (service-list & menu-board grouping) */
.ce-cat-head { display: flex; align-items: center; gap: 14px; margin: 0 0 18px; }
.ce-cat-head h3 { font-size: clamp(18px, 2.4vw, 22px); margin: 0; color: var(--c-ink); white-space: nowrap; }
.ce-cat-head::after { content: ""; flex: 1; height: 1px; background: var(--c-border); }
/* Service list (jasa/klinik) — baris layanan: durasi + harga, aksen primary saat hover */
.ce-svc-row { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--s-sm); transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease, border-color .25s ease; }
.ce-svc-row:hover { transform: translateY(-3px); box-shadow: var(--s-md); border-color: color-mix(in srgb, var(--c-primary) 35%, var(--c-border)); }
.ce-svc-thumb { flex: 0 0 auto; width: 84px; height: 84px; border-radius: var(--r-md, 12px); background-size: cover; background-position: center; border: 1px solid var(--c-border); }
.ce-meta-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: var(--c-primary); background: color-mix(in srgb, var(--c-primary) 9%, transparent); border-radius: var(--r-pill); padding: 4px 11px; white-space: nowrap; }
.ce-meta-pill svg { width: 13px; height: 13px; }
/* Article feed (blog) — kartu artikel: cover zoom + meta penulis·tanggal */
.ce-art-card { display: flex; flex-direction: column; background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--s-sm); overflow: hidden; transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease; }
.ce-art-card:hover { transform: translateY(-4px); box-shadow: var(--s-lg); }
.ce-art-imgwrap { overflow: hidden; aspect-ratio: 16 / 10; }
.ce-art-img { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1.001); transition: transform .55s cubic-bezier(.16,1,.3,1); }
.ce-art-card:hover .ce-art-img { transform: scale(1.06); }
.ce-art-meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--c-muted); }
.ce-art-meta b { color: var(--c-primary); font-weight: 700; }
.ce-art-readmore { font-size: 13px; font-weight: 700; color: var(--c-primary); letter-spacing: .02em; display: inline-flex; align-items: center; gap: 6px; transition: gap .2s ease; }
.ce-art-card:hover .ce-art-readmore { gap: 11px; }
/* Menu board (resto) — daftar berkelompok, harga dotted-leader feel */
.ce-mb-row { display: flex; align-items: baseline; gap: 14px; padding: 13px 0; border-top: 1px dashed var(--c-border); transition: padding-left .2s ease; }
.ce-mb-row:first-child { border-top: none; }
.ce-mb-row:hover { padding-left: 6px; }
.ce-mb-lead { flex: 1; min-width: 0; border-bottom: 1px dotted color-mix(in srgb, var(--c-border) 80%, transparent); transform: translateY(-5px); }
@media (prefers-reduced-motion: reduce) { .ce-svc-row, .ce-art-card, .ce-art-img, .ce-mb-row { transition: none; } }
/* ── Craft: heading sadar-align/ritme + polish per-mood ───── */
.ce-shead { text-align: var(--sec-align, center); margin-bottom: var(--head-mb, 40px); }
.ce-shead .ce-eyebrow { display: block; margin-bottom: 10px; }
/* align-left → eyebrow dapat rule editorial; heading tak dipaksa sempit-tengah */
.ce-root[data-mood="luxury"] .ce-shead .ce-eyebrow, .ce-root[data-mood="minimal"] .ce-shead .ce-eyebrow { display: inline-flex; align-items: center; gap: 12px; }
.ce-root[data-mood="luxury"] .ce-shead[data-rule] .ce-eyebrow::before, .ce-root[data-mood="minimal"] .ce-shead[data-rule] .ce-eyebrow::before { content: ""; width: 30px; height: 1px; background: var(--c-primary); }
/* luxury/minimal: motion lebih lambat & deliberate (design-rules §4 — "considered") */
.ce-root[data-mood="luxury"] .ce-card, .ce-root[data-mood="luxury"] .ce-svc-row, .ce-root[data-mood="luxury"] .ce-art-card, .ce-root[data-mood="luxury"] .ce-quote, .ce-root[data-mood="luxury"] .ce-mb-row { transition-duration: .4s; }
.ce-root[data-mood="luxury"] .ce-btn, .ce-root[data-mood="minimal"] .ce-btn { transition-duration: .35s; }
/* Signature statement band — pull-quote editorial besar, mark raksasa di latar */
.ce-statement { position: relative; overflow: hidden; }
.ce-statement-mark { position: absolute; top: clamp(-40px, -3vw, -16px); left: 50%; transform: translateX(-50%); font-family: var(--f-display); font-weight: var(--fw-display); color: var(--c-primary); opacity: .08; font-size: clamp(160px, 26vw, 300px); line-height: 1; pointer-events: none; user-select: none; }
.ce-statement-q { font-family: var(--f-display); font-weight: var(--fw-display); color: var(--c-ink); letter-spacing: var(--tracking); line-height: 1.18; font-size: clamp(26px, 4.4vw, 46px); margin: 0; text-wrap: balance; }
/* Nav sadar-konten — sticky + blur, tautan section, reservasi menonjol */
.ce-nav { position: sticky; top: 0; z-index: 100; background: color-mix(in srgb, var(--c-page) 85%, transparent); backdrop-filter: saturate(1.2) blur(12px); -webkit-backdrop-filter: saturate(1.2) blur(12px); border-bottom: 1px solid color-mix(in srgb, var(--c-border) 55%, transparent); }
.ce-nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 15px 24px; max-width: 1120px; margin: 0 auto; }
.ce-nav-brand { font-family: var(--f-display); font-weight: var(--fw-display); font-size: 20px; letter-spacing: var(--tracking); color: var(--c-ink); }
.ce-nav-links { display: flex; align-items: center; gap: 28px; }
.ce-nav-link { color: var(--c-muted); text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: .01em; position: relative; transition: color .2s ease; }
.ce-nav-link:hover { color: var(--c-primary); }
.ce-nav-link::after { content: ""; position: absolute; left: 0; bottom: -5px; width: 0; height: 1.5px; background: var(--c-primary); transition: width .25s ease; }
.ce-nav-link:hover::after { width: 100%; }
.ce-root [id] { scroll-margin-top: 84px; }
/* Hero secondary CTA (ghost) — kontras di atas foto/gelap (currentColor) */
.ce-btn-ghost { display: inline-block; padding: 13px 30px; border-radius: var(--r-pill); border: 1px solid currentColor; color: inherit; text-decoration: none; font-weight: 700; font-size: 15px; opacity: .9; transition: opacity .2s ease, background-color .2s ease; }
.ce-btn-ghost:hover { opacity: 1; background: color-mix(in srgb, currentColor 12%, transparent); }
@media (max-width: 767px) { .ce-nav-links { display: none; } }
/* Hero sinematik luxury (Maaemo/Quay) — lebih tinggi, scrim bawah dramatis, scroll cue */
.ce-hero-cue { display: none; }
.ce-root[data-mood="luxury"] .ce-hero-fb { min-height: 100vh; }
.ce-root[data-mood="luxury"] .ce-hero-fb::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 62%; background: linear-gradient(to top, color-mix(in srgb, var(--c-page) 90%, transparent) 0%, transparent 100%); pointer-events: none; z-index: 0; }
.ce-root[data-mood="luxury"] .ce-hero-cue { display: block; position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); z-index: 1; opacity: .7; animation: ceCue 2.2s ease-in-out infinite; }
.ce-root[data-mood="luxury"] .ce-hero-cue svg { width: 26px; height: 26px; }
@keyframes ceCue { 0%, 100% { transform: translate(-50%, 0); opacity: .5; } 50% { transform: translate(-50%, 7px); opacity: .9; } }
/* Menu tab kategori (LiveKitchn) — chip jump-nav, align ikut mood */
.ce-menu-tabs { display: flex; flex-wrap: wrap; gap: 10px; justify-content: var(--sec-items, center); margin: -8px 0 40px; }
.ce-menu-tab { font-size: 13px; font-weight: 600; color: var(--c-muted); border: 1px solid var(--c-border); border-radius: var(--r-pill); padding: 8px 16px; text-decoration: none; transition: color .2s ease, border-color .2s ease, background-color .2s ease; }
.ce-menu-tab:hover { color: var(--c-on-primary); background: var(--c-primary); border-color: var(--c-primary); }
.ce-root [id^="menu-"] { scroll-margin-top: 96px; }
@media (prefers-reduced-motion: reduce) { .ce-nav-link, .ce-nav-link::after, .ce-btn-ghost, .ce-menu-tab { transition: none; } .ce-hero-cue { animation: none; } }
/* ══ Lapis LUX ══════════════════════════════════════════════════════════════
   Gerbang craft via [data-lux] (di-set ComposableRenderer saat pack.lux ada) —
   DEKUPEL dari mood gelap, jadi tema lux TERANG (klinik/sekolah) maupun GELAP
   (resto) sama-sama dapat craft. Tema lama tanpa data-lux → tak terpengaruh. */
.ce-root[data-lux] .ce-shead .ce-eyebrow { display: inline-flex; align-items: center; gap: 12px; }
.ce-root[data-lux] .ce-shead[data-rule] .ce-eyebrow::before { content: ""; width: 30px; height: 1px; background: var(--c-primary); }
.ce-root[data-lux] .ce-card, .ce-root[data-lux] .ce-svc-row, .ce-root[data-lux] .ce-art-card, .ce-root[data-lux] .ce-quote, .ce-root[data-lux] .ce-mb-row { transition-duration: var(--ce-dur-slow, .4s); }
.ce-root[data-lux] .ce-btn { transition-duration: var(--ce-dur-fast, .35s); }
.ce-root[data-lux] .ce-hero-fb { min-height: 100vh; }
.ce-root[data-lux] .ce-hero-fb::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 62%; background: linear-gradient(to top, color-mix(in srgb, var(--c-page) 90%, transparent) 0%, transparent 100%); pointer-events: none; z-index: 0; }
.ce-root[data-lux] .ce-hero-cue { display: block; position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); z-index: 1; opacity: .7; animation: ceCue 2.2s ease-in-out infinite; }
.ce-root[data-lux] .ce-hero-cue svg { width: 26px; height: 26px; }
/* Hero 'cinematic' — ken-burns gambar + scrim GELAP (teks putih terbaca utk lux terang/gelap) + cue */
.ce-hero-cine { position: relative; overflow: hidden; min-height: 100vh; display: flex; align-items: flex-end; padding: 0 24px 92px; }
.ce-hero-kb { position: absolute; inset: 0; z-index: 0; background-size: cover; background-position: center; transform: scale(1.06); animation: ceKenburns 18s ease-out forwards; }
@keyframes ceKenburns { to { transform: scale(1); } }
.ce-hero-cine-grad { position: absolute; inset: 0; z-index: 0; background: linear-gradient(to top, rgba(0,0,0,.74) 0%, rgba(0,0,0,.34) 44%, rgba(0,0,0,.12) 72%, rgba(0,0,0,.20) 100%); }
.ce-hero-cine .ce-hero-cue { display: block; color: #fff; }
/* Showcase 'signature' — beat editorial selang-seling (panen rl-dish) */
.ce-sig { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 72px); align-items: center; margin-bottom: clamp(48px, 8vw, 96px); }
.ce-sig:last-child { margin-bottom: 0; }
.ce-sig:nth-child(even) .ce-sig-media { order: 2; }
.ce-sig-media { position: relative; overflow: hidden; border-radius: var(--r-md); aspect-ratio: 4 / 5; background: linear-gradient(135deg, var(--c-surface2), var(--c-surface)); }
.ce-sig-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform var(--ce-dur-slow, .5s) var(--ce-ease, cubic-bezier(.16,1,.3,1)); }
.ce-sig:hover .ce-sig-media img { transform: scale(1.06); }
.ce-sig-idx { font-family: var(--f-display); font-weight: var(--fw-display); font-size: clamp(40px, 6vw, 72px); color: var(--c-primary); opacity: .4; line-height: 1; font-variant-numeric: tabular-nums; display: block; }
.ce-sig-name { font-size: clamp(26px, 3.4vw, 40px); margin: 10px 0 12px; color: var(--c-ink); }
.ce-sig-lead { color: var(--c-ink-dim, var(--c-muted)); font-size: 16px; line-height: 1.75; max-width: 42ch; margin: 0; }
.ce-sig-meta { margin-top: 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.ce-sig-price { font-family: var(--f-display); font-size: 24px; color: var(--c-primary); }
.ce-sig-tag { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--c-muted); border: 1px solid var(--c-border2, var(--c-border)); padding: 5px 12px; border-radius: 999px; }
@media (max-width: 780px) { .ce-sig { grid-template-columns: 1fr; gap: 24px; } .ce-sig:nth-child(even) .ce-sig-media { order: 0; } }
/* Stats 'recognition' — kolom divider border-kiri, angka serif besar (panen rl-recog) */
.ce-recog { border-top: 1px solid var(--c-border2, var(--c-border)); border-bottom: 1px solid var(--c-border2, var(--c-border)); }
.ce-recog-stat { padding: 14px 26px; border-left: 1px solid var(--c-border2, var(--c-border)); }
.ce-recog-stat:first-child { border-left: none; padding-left: 0; }
.ce-recog-label { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--c-muted); margin-top: 10px; display: block; }
@media (max-width: 640px) { .ce-recog-wrap { grid-template-columns: 1fr 1fr !important; gap: 28px 0; } .ce-recog-stat:nth-child(odd) { border-left: none; padding-left: 0; } }
/* Gallery 'editorial' — grid 4-kolom span tinggi/lebar (panen rl-gal) */
.ce-galed { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 200px; gap: 14px; }
.ce-galed figure { position: relative; overflow: hidden; border-radius: var(--r-md); margin: 0; border: 1px solid var(--c-border2, var(--c-border)); }
.ce-galed img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform var(--ce-dur-slow, .5s) var(--ce-ease, cubic-bezier(.16,1,.3,1)); }
.ce-galed figure:hover img { transform: scale(1.07); }
.ce-galed figcaption { position: absolute; left: 14px; bottom: 12px; font-size: 12px; letter-spacing: .06em; color: #fff; text-shadow: 0 1px 6px rgba(0,0,0,.6); opacity: 0; transition: opacity .3s ease; }
.ce-galed figure:hover figcaption { opacity: 1; }
.ce-galed-tall { grid-row: span 2; }
.ce-galed-wide { grid-column: span 2; }
@media (max-width: 780px) { .ce-galed { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 150px; } }
@media (prefers-reduced-motion: reduce) { .ce-hero-kb { animation: none; transform: none; } .ce-sig-media img, .ce-galed img { transition: none; } }
/* Scroll-reveal lux — section fade+rise saat masuk viewport. Disembunyikan HANYA
   saat JS aktif (.ce-js ditambah <CeReveal/>) → tanpa JS konten tetap TAMPIL.
   GPU murni (opacity/transform), tak ada layout thrash. */
.ce-js .ce-reveal { opacity: 0; transform: translateY(26px); }
.ce-js .ce-reveal.ce-in { opacity: 1; transform: none; transition: opacity .7s var(--ce-ease, cubic-bezier(.16,1,.3,1)), transform .7s var(--ce-ease, cubic-bezier(.16,1,.3,1)); }
@media (prefers-reduced-motion: reduce) { .ce-js .ce-reveal { opacity: 1; transform: none; } }
/* ── Panen flagship toko-atelier (ce-script.ts) ─────────────── */
/* Testimoni carousel — scroll-snap; JS hanya tombol/dot */
.ce-tcar-track { display: flex; gap: clamp(16px, 2vw, 24px); overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; -ms-overflow-style: none; padding-bottom: 6px; }
.ce-tcar-track::-webkit-scrollbar { display: none; }
.ce-tslide { flex: 0 0 min(100%, 480px); scroll-snap-align: start; }
.ce-tctrl { display: flex; gap: 10px; }
.ce-tbtn { width: 46px; height: 46px; border-radius: 999px; border: 1px solid var(--c-border); background: var(--c-surface); color: var(--c-ink); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color .25s ease, color .25s ease, border-color .25s ease, opacity .25s ease; }
.ce-tbtn:hover:not(:disabled) { background: var(--c-primary); color: var(--c-on-primary); border-color: var(--c-primary); }
.ce-tbtn:disabled { opacity: .32; cursor: default; }
.ce-dots { display: flex; gap: 8px; margin-top: 24px; }
.ce-dot { position: relative; width: 8px; height: 8px; border-radius: 999px; background: var(--c-border); border: 0; padding: 0; cursor: pointer; transition: width .3s cubic-bezier(.16,1,.3,1), background-color .3s ease; }
.ce-dot::after { content: ""; position: absolute; inset: -16px; }
.ce-dot[aria-current="true"] { width: 26px; background: var(--c-primary); }
/* Galeri quick-look — trigger overlay + dialog lightbox aksesibel */
.ce-lb-open { position: absolute; inset: 0; z-index: 2; background: transparent; border: 0; cursor: zoom-in; padding: 0; }
.ce-lb { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: clamp(12px, 3vw, 40px); }
.ce-lb[hidden] { display: none; }
.ce-lb-back { position: absolute; inset: 0; background: rgba(8,8,10,.78); backdrop-filter: blur(8px); border: 0; cursor: pointer; }
.ce-lb-panel { position: relative; z-index: 2; max-width: 920px; width: 100%; max-height: 88vh; display: flex; flex-direction: column; background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-lg); overflow: hidden; margin: 0; opacity: 0; transform: translateY(16px) scale(.985); transition: opacity .45s cubic-bezier(.16,1,.3,1), transform .45s cubic-bezier(.16,1,.3,1); }
.ce-lb-in .ce-lb-panel { opacity: 1; transform: none; }
.ce-lb-media { position: relative; background: linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to)); aspect-ratio: 16/10; }
.ce-lb-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ce-lb-title { padding: 16px 20px; font-family: var(--f-display); font-weight: 700; color: var(--c-ink); font-size: 16px; }
.ce-lb-x { position: absolute; top: 10px; right: 10px; z-index: 3; width: 44px; height: 44px; border-radius: 999px; background: rgba(8,8,10,.55); border: 1px solid rgba(255,255,255,.25); color: #fff; font-size: 20px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color .25s ease; }
.ce-lb-x:hover { background: var(--c-primary); }
.ce-lb-prev, .ce-lb-next { position: absolute; top: 50%; transform: translateY(-50%); z-index: 3; width: 44px; height: 44px; border-radius: 999px; background: rgba(8,8,10,.55); border: 1px solid rgba(255,255,255,.25); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color .25s ease; }
.ce-lb-prev { left: 10px; } .ce-lb-next { right: 10px; }
.ce-lb-prev:hover, .ce-lb-next:hover { background: var(--c-primary); }
/* Features sticky-passage — kiri pinned, kanan baris bernomor */
.ce-fsticky { display: grid; grid-template-columns: .9fr 1.4fr; gap: clamp(36px, 6vw, 80px); align-items: start; }
.ce-fsticky-side { position: sticky; top: 96px; }
.ce-fsticky-row { display: grid; grid-template-columns: auto 1fr; gap: clamp(18px, 3vw, 32px); padding: clamp(24px, 3vw, 36px) 0; border-top: 1px solid var(--c-border); transition: padding-left .4s cubic-bezier(.16,1,.3,1); }
.ce-fsticky-rows .ce-fsticky-row:last-child { border-bottom: 1px solid var(--c-border); }
.ce-fsticky-row:hover { padding-left: 12px; }
.ce-fsticky-num { font-family: var(--f-display); font-weight: var(--fw-display); font-size: clamp(26px, 3.2vw, 38px); line-height: 1.1; color: color-mix(in srgb, var(--c-primary) 45%, transparent); min-width: 2.2ch; font-variant-numeric: tabular-nums; transition: color .35s ease; }
.ce-fsticky-row:hover .ce-fsticky-num { color: var(--c-primary); }
@media (max-width: 880px) { .ce-fsticky { grid-template-columns: 1fr; } .ce-fsticky-side { position: static; } }
/* CTA duotone — foto grayscale + tint primary (mix-blend) + tombol magnetic */
.ce-cta-duo { position: relative; overflow: hidden; text-align: center; color: #fff; }
.ce-cta-duo-bg { position: absolute; inset: 0; background-position: center; background-size: cover; filter: grayscale(1) contrast(1.05) brightness(.85); }
.ce-cta-duo-tint { position: absolute; inset: 0; background: linear-gradient(120deg, var(--c-primary), #16161a 70%); mix-blend-mode: color; opacity: .6; }
.ce-cta-duo-scrim { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10,10,12,.82), rgba(10,10,12,.58) 50%, rgba(10,10,12,.86)); }
.ce-cta-duo.noimg .ce-cta-duo-bg { background: radial-gradient(ellipse 70% 60% at 18% 85%, color-mix(in srgb, var(--c-primary) 24%, transparent), transparent 60%), radial-gradient(ellipse 55% 45% at 85% 12%, color-mix(in srgb, var(--c-primary) 12%, transparent), transparent 55%), #101014; filter: none; }
.ce-cta-duo.noimg .ce-cta-duo-tint, .ce-cta-duo.noimg .ce-cta-duo-scrim { display: none; }
.ce-cta-duo-in { position: relative; z-index: 2; max-width: 820px; margin: 0 auto; padding: clamp(96px, 13vw, 160px) 24px; }
.ce-cta-duo h2 { color: #fff; font-size: clamp(34px, 5.6vw, 64px); line-height: 1.05; margin: 0; }
.ce-cta-duo p { color: rgba(255,255,255,.84); max-width: 52ch; margin: 18px auto 0; line-height: 1.75; }
.ce-mag { will-change: transform; transition: transform .45s cubic-bezier(.34,1.56,.64,1); }
@media (prefers-reduced-motion: reduce) {
  .ce-mag { transform: none !important; }
  .ce-lb-panel { opacity: 1; transform: none; }
  .ce-galed figcaption { opacity: 1; }
  .ce-tcar-track { scroll-behavior: auto; }
}
`

// Scrim untuk teks di atas foto (legibilitas konsisten apa pun temanya).
const HERO_SCRIM = 'linear-gradient(180deg, rgba(0,0,0,.18) 0%, rgba(0,0,0,.38) 55%, rgba(0,0,0,.66) 100%)'
// Wash brand: tint primary halus di sudut atas-kiri → foto hero terasa DIDESAIN
// untuk brand ini (kohesi palet), bukan stock yang sekадar digelapkan scrim hitam.
// Transparan di tengah/bawah supaya tak ganggu keterbacaan teks putih.
const HERO_BRAND_WASH = 'linear-gradient(120deg, color-mix(in srgb, var(--c-primary) 30%, transparent) 0%, transparent 52%)'
// Fill bingkai gambar saat foto KOSONG. Mesh (radial aksen + linear dasar) → ada
// kedalaman + tint primary, jadi state tanpa-foto terlihat intensional (konsisten
// dgn hero no-image), bukan kotak gradient datar. Hanya tampak bila gambar absen.
const MESH_FILL = [
  'radial-gradient(ellipse 78% 60% at 25% 22%, color-mix(in srgb, var(--c-primary) 16%, transparent) 0%, transparent 60%)',
  'linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))',
].join(', ')

// ── MOTIF / TEKSTUR (panen dari BatikTokoRenderer) ────────────
// Tile SVG data-uri, ditint warna primary tema. Dipakai sebagai overlay halus
// di hero + strip footer untuk tema Kerajinan/Heritage. Parametrik: warna &
// opacity dari pemanggil, BUKAN hardcode → satu set motif melayani semua gaya.
function hexBody(hex?: string): string {
  return (hex ?? '#C8922A').replace('#', '')
}
// Kawung — motif batik Jawa klasik (4 elips + inti). Dipanen verbatim.
function motifKawung(color: string, opacity: number): string {
  const c = hexBody(color)
  return `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${c}' fill-opacity='${opacity}'%3E%3Cellipse cx='32' cy='8' rx='10' ry='7'/%3E%3Cellipse cx='32' cy='56' rx='10' ry='7'/%3E%3Cellipse cx='8' cy='32' rx='7' ry='10'/%3E%3Cellipse cx='56' cy='32' rx='7' ry='10'/%3E%3Ccircle cx='32' cy='32' r='6'/%3E%3C/g%3E%3C/svg%3E")`
}
// Tenun — anyaman silang (garis diagonal dua arah), nuansa wastra tenun.
function motifTenun(color: string, opacity: number): string {
  const c = hexBody(color)
  return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23${c}' stroke-opacity='${opacity}' stroke-width='2'%3E%3Cpath d='M0 10 L40 10 M0 30 L40 30'/%3E%3Cpath d='M10 0 L10 40 M30 0 L30 40' stroke-opacity='${opacity * 0.55}'/%3E%3C/g%3E%3C/svg%3E")`
}
function motifTile(variant: MotifVariant | undefined, color: string, opacity: number): string | null {
  if (variant === 'kawung') return motifKawung(color, opacity)
  if (variant === 'tenun') return motifTenun(color, opacity)
  return null
}
const motifSize = (v?: MotifVariant) => (v === 'tenun' ? '40px 40px' : '64px 64px')

// Overlay motif penuh (absolute) — dipakai di dalam hero. Subtil, di bawah konten.
function MotifOverlay({ motif, color, opacity = 0.08 }: { motif?: MotifVariant; color: string; opacity?: number }) {
  const tile = motifTile(motif, color, opacity)
  if (!tile) return null
  return <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: tile, backgroundSize: motifSize(motif) }} />
}

export function formatRupiah(n?: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return ''
  return 'Rp' + n.toLocaleString('id-ID')
}

export function Btn({ text, href }: { text?: string; href?: string }) {
  if (!text) return null
  return (
    <a href={href ?? '#'} className="ce-btn" style={{ display: 'inline-block', padding: '14px 32px', fontWeight: 700, fontSize: 15 }}>
      {text}
    </a>
  )
}

// Nav sadar-konten: tautan anchor ke section yang ada (pola situs resto nyata —
// Locavore/Merah Putih) + tombol reservasi menonjol. Label showcase = kata
// pertama judulnya (Menu/Layanan/Produk/Artikel) → generik lintas industri.
function navFirstWord(s?: string): string | undefined {
  const w = s?.trim().split(/\s+/)[0]
  return w || undefined
}
export function Nav({ content }: { content: ComposableContent }) {
  const links: { label: string; href: string }[] = []
  if (content.showcase?.items?.length) links.push({ label: navFirstWord(content.showcase.title) ?? 'Menu', href: '#showcase' })
  if (content.about) links.push({ label: 'Tentang', href: '#tentang' })
  if (content.team?.length) links.push({ label: navFirstWord(content.teamTitle) ?? 'Tim', href: '#tim' })
  if (content.gallery && ((content.gallery.images?.length ?? 0) > 0 || (content.gallery.pairs?.length ?? 0) > 0)) links.push({ label: 'Galeri', href: '#galeri' })
  if (content.info) links.push({ label: 'Lokasi', href: '#lokasi' })
  return (
    <header className="ce-nav">
      <div className="ce-nav-inner">
        <span className="ce-nav-brand">{content.nama}</span>
        {links.length > 0 && (
          <nav className="ce-nav-links" aria-label="Navigasi utama">
            {links.map((l) => <a key={l.href} className="ce-nav-link" href={l.href}>{l.label}</a>)}
          </nav>
        )}
        {content.hero.ctaText && <Btn text={content.hero.ctaText} href={content.hero.ctaHref} />}
      </div>
    </header>
  )
}

// ── HERO varian (dukung foto opsional) ────────────────────────
type Hero = ComposableContent['hero']

// Latar hero: foto + scrim kalau ada gambar; gradient token kalau tidak.
function heroBg(image?: string, position?: string): React.CSSProperties {
  if (image) {
    return { backgroundImage: `${HERO_BRAND_WASH}, ${HERO_SCRIM}, url(${image})`, backgroundSize: 'cover', backgroundPosition: position || 'center' }
  }
  // Gradient MESH (bukan flat): 2 radial aksen + linear dasar → ada kedalaman.
  return {
    backgroundImage: [
      'radial-gradient(ellipse 70% 55% at 18% 80%, color-mix(in srgb, var(--c-primary) 18%, transparent) 0%, transparent 60%)',
      'radial-gradient(ellipse 55% 45% at 85% 18%, color-mix(in srgb, var(--c-primary) 12%, transparent) 0%, transparent 55%)',
      'linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))',
    ].join(', '),
  }
}
const heroInk = (image?: string) => (image ? '#FFFFFF' : 'var(--c-hero-ink)')

export function HeroCentered({ hero, motif, motifColor }: { hero: Hero; motif?: MotifVariant; motifColor?: string }) {
  const ink = heroInk(hero.image)
  return (
    <section style={{ ...heroBg(hero.image, hero.imagePosition), color: ink, padding: '96px 24px', position: 'relative', overflow: 'hidden' }}>
      <MotifOverlay motif={motif} color={hero.image ? '#FFFFFF' : motifColor ?? '#C8922A'} />
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {hero.eyebrow && <p className="ce-eyebrow" style={{ marginBottom: 16, color: hero.image ? '#FFFFFF' : 'var(--c-primary)' }}>{hero.eyebrow}</p>}
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.05, margin: 0, color: ink }}>{hero.title}</h1>
        {hero.subtitle && <p style={{ marginTop: 24, fontSize: 18, opacity: .9, lineHeight: 1.6 }}>{hero.subtitle}</p>}
        {hero.ctaText && <div style={{ marginTop: 32 }}><Btn text={hero.ctaText} href={hero.ctaHref} /></div>}
      </div>
    </section>
  )
}

export function HeroSplit({ hero, nama, motif, motifColor }: { hero: Hero; nama: string; motif?: MotifVariant; motifColor?: string }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: '112px 24px', position: 'relative', overflow: 'hidden' }}>
      <MotifOverlay motif={motif} color={motifColor ?? '#C8922A'} opacity={0.05} />
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div>
          {hero.eyebrow && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 36, height: 1, background: 'var(--c-primary)' }} />
              <span className="ce-eyebrow">{hero.eyebrow}</span>
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(38px, 5vw, 64px)', lineHeight: 1.08, margin: 0, color: 'var(--c-ink)' }}>{hero.title}</h1>
          {hero.subtitle && <p style={{ marginTop: 24, fontSize: 18, color: 'var(--c-muted)', lineHeight: 1.7, maxWidth: 520 }}>{hero.subtitle}</p>}
          {hero.ctaText && <div style={{ marginTop: 36 }}><Btn text={hero.ctaText} href={hero.ctaHref} /></div>}
        </div>
        <div style={{ position: 'relative', minHeight: 420, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--c-border)', boxShadow: 'var(--s-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...(hero.image ? { backgroundImage: `${HERO_BRAND_WASH}, url(${hero.image})`, backgroundSize: 'cover', backgroundPosition: hero.imagePosition || 'center' } : { background: `linear-gradient(150deg, var(--c-hero-from), var(--c-hero-to))` }) }}>
          {!hero.image && (
            <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 'clamp(120px, 18vw, 220px)', lineHeight: 1, color: 'var(--c-hero-ink)', opacity: .9 }}>
              {(nama.trim()[0] ?? 'A').toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

export function HeroFullbleed({ hero, motif, motifColor }: { hero: Hero; motif?: MotifVariant; motifColor?: string }) {
  const ink = heroInk(hero.image)
  return (
    <section className="ce-hero-fb" style={{ ...heroBg(hero.image, hero.imagePosition), color: ink, minHeight: '90vh', display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden', padding: '0 24px 80px' }}>
      <MotifOverlay motif={motif} color={hero.image ? '#FFFFFF' : motifColor ?? '#C8922A'} opacity={0.07} />
      <span className="ce-hero-cue" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </span>
      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        {hero.eyebrow && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ width: 36, height: 1, background: hero.image ? '#FFFFFF' : 'var(--c-primary)' }} />
            <span className="ce-eyebrow" style={{ color: hero.image ? '#FFFFFF' : 'var(--c-primary)' }}>{hero.eyebrow}</span>
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(48px, 9vw, 104px)', lineHeight: .98, margin: 0, color: ink }}>{hero.title}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 28, marginTop: 32 }}>
          {hero.subtitle && <p style={{ fontSize: 18, opacity: .9, lineHeight: 1.6, maxWidth: 480, margin: 0 }}>{hero.subtitle}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
            {hero.ctaText && <Btn text={hero.ctaText} href={hero.ctaHref} />}
            {hero.ctaText2 && <a className="ce-btn-ghost" href={hero.ctaHref2 ?? '#'}>{hero.ctaText2}</a>}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── FEATURES varian (keunggulan / "Mengapa Kami") ─────────────
type Feature = { title: string; desc: string }

// Heading "keunggulan" dari konten (bukan hardcode generik). Fallback non-generik;
// align & ritme ikut craft var (.ce-shead). data-rule → eyebrow dapat rule editorial
// di mood luxury/minimal.
export type FeatHead = { eyebrow?: string; title?: string; subtitle?: string }
function FeatHeading({ eyebrow, title, subtitle }: FeatHead) {
  return (
    <div className="ce-shead" data-rule>
      <p className="ce-eyebrow">{eyebrow ?? 'Keunggulan'}</p>
      <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', margin: 0, color: 'var(--c-ink)' }}>{title ?? 'Mengapa Memilih Kami'}</h2>
      {subtitle && <p style={{ fontSize: 16, color: 'var(--c-muted)', margin: '12px 0 0', lineHeight: 1.6, maxWidth: 640, display: 'inline-block' }}>{subtitle}</p>}
    </div>
  )
}

export function FeaturesGrid({ features, heading }: { features: Feature[]; heading?: FeatHead }) {
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 80px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <FeatHeading {...heading} />
        <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="ce-card" style={{ padding: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'color-mix(in srgb, var(--c-primary) 14%, transparent)', color: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 18, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 style={{ fontSize: 19, margin: '0 0 8px', color: 'var(--c-ink)' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeaturesRows({ features, heading }: { features: Feature[]; heading?: FeatHead }) {
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <FeatHeading {...heading} />
      {features.map((f, i) => (
        <div key={i} className="ce-feat-row" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'baseline', padding: '28px 0' }}>
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 40, lineHeight: 1, color: 'var(--c-primary)', opacity: .4 }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 style={{ fontSize: 22, margin: '0 0 8px', color: 'var(--c-ink)' }}>{f.title}</h3>
            <p style={{ fontSize: 15, color: 'var(--c-muted)', lineHeight: 1.7, margin: 0, maxWidth: 620 }}>{f.desc}</p>
          </div>
        </div>
      ))}
      </div>
    </section>
  )
}

// ── SHOWCASE varian (produk/menu) ─────────────────────────────
function ShowHeading({ title, subtitle }: { title?: string; subtitle?: string }) {
  if (!title && !subtitle) return null
  return (
    <div className="ce-shead">
      {title && <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', margin: '0 0 8px', color: 'var(--c-ink)' }}>{title}</h2>}
      {subtitle && <p style={{ fontSize: 16, color: 'var(--c-muted)', margin: 0, maxWidth: 620, display: 'inline-block' }}>{subtitle}</p>}
    </div>
  )
}

export function ShowcaseMenuList({ showcase }: { showcase: NonNullable<ComposableContent['showcase']> }) {
  return (
    <section style={{ padding: 'var(--sec-pad-y, 88px) 24px', maxWidth: 820, margin: '0 auto' }}>
      <ShowHeading title={showcase.title} subtitle={showcase.subtitle} />
      <div className="ce-stagger">
        {showcase.items.map((it: ShowcaseItem, i) => (
          <div key={i} className="ce-menu-row" style={{ padding: '22px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
              <h3 style={{ fontSize: 19, margin: 0, color: 'var(--c-ink)' }}>{it.nama}</h3>
              {it.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)', whiteSpace: 'nowrap' }}>{formatRupiah(it.harga)}</span>}
            </div>
            {it.desc && <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: '6px 0 0', maxWidth: 560 }}>{it.desc}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export function ShowcaseCardGrid({ showcase }: { showcase: NonNullable<ComposableContent['showcase']> }) {
  return (
    <section style={{ padding: 'var(--sec-pad-y, 88px) 24px', maxWidth: 1120, margin: '0 auto' }}>
      <ShowHeading title={showcase.title} subtitle={showcase.subtitle} />
      <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {showcase.items.map((it: ShowcaseItem, i) => (
          <div key={i} className="ce-card">
            <div style={{ aspectRatio: '4 / 3', background: it.gambar ? `center/cover no-repeat url(${it.gambar})` : MESH_FILL }} />
            <div style={{ padding: 20 }}>
              <h3 style={{ fontSize: 17, margin: '0 0 6px', color: 'var(--c-ink)' }}>{it.nama}</h3>
              {it.desc && <p style={{ fontSize: 13, color: 'var(--c-muted)', lineHeight: 1.55, margin: '0 0 10px' }}>{it.desc}</p>}
              {it.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)' }}>{formatRupiah(it.harga)}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Bingkai gambar lookbook: <img> dgn zoom kalau ada foto; placeholder bermartabat
// (inisial di atas gradient token) kalau belum. ratio = aspect-ratio CSS.
function LookFrame({ it, ratio }: { it: ShowcaseItem; ratio: string }) {
  return (
    <div className="ce-look-frame" style={{ aspectRatio: ratio }}>
      {it.gambar ? (
        <img className="ce-look-img" src={it.gambar} alt={it.nama} loading="lazy" />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 'clamp(56px, 10vw, 120px)', lineHeight: 1, color: 'var(--c-hero-ink)', opacity: .85 }}>
            {(it.nama.trim()[0] ?? 'A').toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}

function LookCaption({ idx, it }: { idx: number; it: ShowcaseItem }) {
  return (
    <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 14 }}>
      <span className="ce-look-idx" style={{ fontSize: 15 }}>{String(idx + 1).padStart(2, '0')}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: 19, margin: 0, color: 'var(--c-ink)' }}>{it.nama}</h3>
        {it.desc && <p style={{ fontSize: 13, color: 'var(--c-muted)', lineHeight: 1.55, margin: '4px 0 0' }}>{it.desc}</p>}
      </div>
      {it.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)', whiteSpace: 'nowrap' }}>{formatRupiah(it.harga)}</span>}
    </div>
  )
}

// Lookbook — showcase editorial fashion: 1 spread featured + grid portrait 3/4.
export function ShowcaseLookbook({ showcase }: { showcase: NonNullable<ComposableContent['showcase']> }) {
  const items = showcase.items
  const [featured, ...rest] = items
  return (
    <section style={{ padding: 'var(--sec-pad-y, 96px) 24px', maxWidth: 1120, margin: '0 auto' }}>
      <ShowHeading title={showcase.title} subtitle={showcase.subtitle} />
      <div className="ce-stagger">
        {/* Spread featured — landscape besar + kaption editorial di samping */}
        {featured && (
          <div className="ce-look-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 36, alignItems: 'center', marginBottom: 56 }}>
            <LookFrame it={featured} ratio="4 / 5" />
            <div>
              <span className="ce-look-idx" style={{ fontSize: 'clamp(40px, 6vw, 64px)', display: 'block', marginBottom: 12 }}>01</span>
              <h3 style={{ fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 12px', color: 'var(--c-ink)', lineHeight: 1.1 }}>{featured.nama}</h3>
              {featured.desc && <p style={{ fontSize: 16, color: 'var(--c-muted)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 460 }}>{featured.desc}</p>}
              {featured.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 22, color: 'var(--c-primary)' }}>{formatRupiah(featured.harga)}</span>}
            </div>
          </div>
        )}
        {/* Sisanya — grid kartu portrait */}
        {rest.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
            {rest.map((it, i) => (
              <div key={i} className="ce-look-card">
                <LookFrame it={it} ratio="3 / 4" />
                <LookCaption idx={i + 1} it={it} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Sprint 10a — SHOWCASE khas-industri ───────────────────────
// Kelompokkan item per kategori, pertahankan urutan kemunculan. Bila tak ada
// item ber-kategori → satu grup tunggal tanpa header (perilaku list polos).
function groupByKategori(items: ShowcaseItem[]): { kategori?: string; items: ShowcaseItem[] }[] {
  if (!items.some((it) => it.kategori)) return [{ items }]
  const order: string[] = []
  const map = new Map<string, ShowcaseItem[]>()
  for (const it of items) {
    const key = it.kategori || 'Lainnya'
    if (!map.has(key)) { map.set(key, []); order.push(key) }
    map.get(key)!.push(it)
  }
  return order.map((k) => ({ kategori: k, items: map.get(k)! }))
}

// Tanggal ISO → "8 Jun 2026". Defensif: input tak valid → undefined.
const BULAN_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
function formatTanggalID(iso?: string): string | undefined {
  if (!iso) return undefined
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return undefined
  // UTC supaya deterministik lintas timezone (server/test/produksi konsisten).
  return `${d.getUTCDate()} ${BULAN_ID[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

// Ikon jam inline (no-emoji policy, dijaga test) — currentColor ikut token.
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  )
}

// SERVICE-LIST (jasa/klinik) — baris layanan: nama + deskripsi + badge durasi +
// harga, dikelompokkan per kategori bila ada. Foto opsional (thumbnail kecil).
export function ShowcaseServiceList({ showcase }: { showcase: NonNullable<ComposableContent['showcase']> }) {
  const groups = groupByKategori(showcase.items)
  return (
    <section style={{ padding: 'var(--sec-pad-y, 88px) 24px', maxWidth: 880, margin: '0 auto' }}>
      <ShowHeading title={showcase.title} subtitle={showcase.subtitle} />
      <div className="ce-stagger" style={{ display: 'grid', gap: 36 }}>
        {groups.map((g, gi) => (
          <div key={gi}>
            {g.kategori && <div className="ce-cat-head"><h3>{g.kategori}</h3></div>}
            <div style={{ display: 'grid', gap: 14 }}>
              {g.items.map((it, i) => (
                <div key={i} className="ce-svc-row" style={{ display: 'flex', gap: 18, alignItems: 'flex-start', padding: '18px 20px' }}>
                  {it.gambar && <div className="ce-svc-thumb" style={{ backgroundImage: `url(${it.gambar})` }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: 18, margin: 0, color: 'var(--c-ink)' }}>{it.nama}</h3>
                      {it.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)', whiteSpace: 'nowrap' }}>{formatRupiah(it.harga)}</span>}
                    </div>
                    {it.desc && <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: '6px 0 0' }}>{it.desc}</p>}
                    {it.durasi != null && (
                      <div style={{ marginTop: 10 }}>
                        <span className="ce-meta-pill"><ClockIcon /> ± {it.durasi} menit</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ARTICLE-FEED (blog) — kartu artikel: cover + meta penulis · tanggal + judul +
// ringkasan + "Baca selengkapnya". Tanpa harga (artikel bukan produk).
export function ShowcaseArticleFeed({ showcase }: { showcase: NonNullable<ComposableContent['showcase']> }) {
  return (
    <section style={{ padding: 'var(--sec-pad-y, 88px) 24px', maxWidth: 1120, margin: '0 auto' }}>
      <ShowHeading title={showcase.title} subtitle={showcase.subtitle} />
      <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
        {showcase.items.map((it, i) => {
          const tgl = formatTanggalID(it.tanggal)
          return (
            <article key={i} className="ce-art-card">
              <div className="ce-art-imgwrap" style={{ background: MESH_FILL }}>
                {it.gambar && <img className="ce-art-img" src={it.gambar} alt={it.nama} loading="lazy" />}
              </div>
              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {(it.penulis || tgl) && (
                  <div className="ce-art-meta">
                    {it.penulis && <b>{it.penulis}</b>}
                    {it.penulis && tgl && <span aria-hidden>·</span>}
                    {tgl && <span>{tgl}</span>}
                  </div>
                )}
                <h3 style={{ fontSize: 19, margin: 0, color: 'var(--c-ink)', lineHeight: 1.3 }}>{it.nama}</h3>
                {it.desc && <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: 0 }}>{it.desc}</p>}
                <span className="ce-art-readmore" style={{ marginTop: 'auto' }}>Baca selengkapnya →</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

// MENU-BOARD (resto) — daftar menu dikelompokkan per kategori (gaya papan menu):
// nama + deskripsi di kiri (leader dotted), harga di kanan.
const menuSlug = (s: string) => 'menu-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export function ShowcaseMenuBoard({ showcase }: { showcase: NonNullable<ComposableContent['showcase']> }) {
  const groups = groupByKategori(showcase.items)
  const tabs = groups.filter((g) => g.kategori).length > 1
  return (
    <section style={{ padding: 'var(--sec-pad-y, 88px) 24px', maxWidth: 860, margin: '0 auto' }}>
      <ShowHeading title={showcase.title} subtitle={showcase.subtitle} />
      {/* Tab kategori (LiveKitchn) — jump ke tiap grup */}
      {tabs && (
        <div className="ce-menu-tabs">
          {groups.map((g, gi) => g.kategori ? <a key={gi} className="ce-menu-tab" href={`#${menuSlug(g.kategori)}`}>{g.kategori}</a> : null)}
        </div>
      )}
      <div className="ce-stagger" style={{ display: 'grid', gap: 40 }}>
        {groups.map((g, gi) => (
          <div key={gi} id={g.kategori ? menuSlug(g.kategori) : undefined}>
            {g.kategori && <div className="ce-cat-head"><h3>{g.kategori}</h3></div>}
            <div>
              {g.items.map((it, i) => (
                <div key={i} className="ce-mb-row">
                  <div className="ce-mb-lead">
                    <h3 style={{ fontSize: 17, margin: 0, color: 'var(--c-ink)', display: 'inline' }}>{it.nama}</h3>
                    {it.desc && <span style={{ fontSize: 13, color: 'var(--c-muted)', marginLeft: 8 }}>{it.desc}</span>}
                  </div>
                  {it.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)', whiteSpace: 'nowrap' }}>{formatRupiah(it.harga)}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// STATEMENT — signature band (craft): pernyataan posisi/filosofi editorial. Mark
// kutip raksasa di latar (ditint primary), kalimat besar serif, sitasi opsional.
// Align ikut craft var (kiri utk luxury/minimal, tengah utk clean/warm).
export function StatementBand({ statement }: { statement: StatementContent }) {
  const inner: React.CSSProperties = {
    maxWidth: 920, margin: '0 auto', position: 'relative', zIndex: 1,
    textAlign: 'var(--sec-align, center)' as unknown as React.CSSProperties['textAlign'],
  }
  return (
    <section className="ce-statement" style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 96px) 24px' }}>
      <span className="ce-statement-mark" aria-hidden>&ldquo;</span>
      <div style={inner}>
        {statement.eyebrow && <p className="ce-eyebrow" style={{ marginBottom: 18 }}>{statement.eyebrow}</p>}
        <p className="ce-statement-q">{statement.quote}</p>
        {statement.cite && <p style={{ marginTop: 24, fontSize: 14, color: 'var(--c-muted)', letterSpacing: '.04em' }}>{statement.cite}</p>}
      </div>
    </section>
  )
}

// ── ABOUT / CTA / FOOTER ──────────────────────────────────────
export function About({ about }: { about: NonNullable<ComposableContent['about']> }) {
  return (
    <section style={{ padding: 'var(--sec-pad-y, 72px) 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', borderLeft: '3px solid var(--c-primary)', paddingLeft: 'clamp(20px, 4vw, 40px)' }}>
        <p className="ce-eyebrow" style={{ marginBottom: 12 }}>Tentang Kami</p>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 34px)', margin: '0 0 16px', color: 'var(--c-ink)' }}>{about.title}</h2>
        <p style={{ fontSize: 17, color: 'var(--c-muted)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{about.body}</p>
      </div>
    </section>
  )
}

export function CTA({ cta }: { cta: NonNullable<ComposableContent['cta']> }) {
  return (
    <section style={{ padding: '32px 24px 96px' }}>
      <div
        style={{
          maxWidth: 920, margin: '0 auto', padding: '64px 32px', textAlign: 'center',
          borderRadius: 'var(--r-lg)', color: 'var(--c-hero-ink)', boxShadow: 'var(--s-lg)',
          border: '1px solid var(--c-border)', overflow: 'hidden',
          backgroundImage: [
            'radial-gradient(ellipse 60% 80% at 50% 0%, color-mix(in srgb, var(--c-primary) 22%, transparent) 0%, transparent 60%)',
            'linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))',
          ].join(', '),
        }}
      >
        <h2 style={{ fontSize: 'clamp(26px, 4.5vw, 36px)', margin: '0 0 12px', color: 'var(--c-hero-ink)' }}>{cta.title}</h2>
        {cta.subtitle && <p style={{ opacity: .85, margin: '0 0 28px', fontSize: 16 }}>{cta.subtitle}</p>}
        <Btn text={cta.ctaText ?? 'Pesan Sekarang'} href={cta.ctaHref} />
      </div>
    </section>
  )
}

// Floating WhatsApp — komponen wajib konteks Indonesia (pesan via WA).
export function FloatingWA({ wa }: { wa?: string }) {
  const digits = (wa ?? '').replace(/[^\d]/g, '')
  if (!digits) return null
  return (
    <a className="ce-wa" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" aria-label="Pesan via WhatsApp">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    </a>
  )
}

// ── SECTION HEADING generik (eyebrow + judul) ─────────────────
function SectionHead({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="ce-shead" data-rule>
      {eyebrow && <p className="ce-eyebrow">{eyebrow}</p>}
      <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', margin: 0, color: 'var(--c-ink)' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 16, color: 'var(--c-muted)', margin: '10px 0 0', maxWidth: 560, lineHeight: 1.6, display: 'inline-block' }}>{subtitle}</p>}
    </div>
  )
}

// ── STATS — strip angka kredibilitas (tabular-nums) ───────────
// countUp (panen flagship): SSR tetap menulis nilai final; ce-script.ts
// menganimasikan 0→final saat band terlihat (no-JS/reduce = final).
export function Stats({ stats, countUp }: { stats: StatItem[]; countUp?: boolean }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: '64px 24px' }}>
      <div className="ce-stats-band ce-stagger" style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, padding: '28px 12px' }}>
        {stats.map((s, i) => (
          <div key={i} className="ce-stat" style={{ textAlign: 'center' }}>
            <div className="ce-stat-num" data-cu={countUp || undefined} style={{ fontSize: 'clamp(34px, 5vw, 52px)' }}>{s.angka}</div>
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--c-muted)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── TESTIMONI — 3 varian sosial-proof ─────────────────────────
function QuoteCard({ t }: { t: Testimonial }) {
  return (
    <figure className="ce-quote" style={{ margin: 0, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span className="ce-quote-mark" style={{ fontSize: 52 }} aria-hidden>&ldquo;</span>
      <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: 'var(--c-ink)' }}>{t.quote}</blockquote>
      <figcaption style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 38, height: 38, borderRadius: 999, background: 'color-mix(in srgb, var(--c-primary) 16%, transparent)', color: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
          {(t.nama.trim()[0] ?? 'A').toUpperCase()}
        </span>
        <span>
          <span style={{ display: 'block', fontWeight: 700, fontSize: 14, color: 'var(--c-ink)' }}>{t.nama}</span>
          {t.peran && <span style={{ display: 'block', fontSize: 12, color: 'var(--c-muted)' }}>{t.peran}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

export function TestimoniCards({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    // Section pakai --c-page (base) supaya kartu quote (--c-surface, "raised") terangkat.
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow="Kata Mereka" title="Dipercaya Pelanggan Kami" />
        <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {testimonials.map((t, i) => <QuoteCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  )
}

export function TestimoniSpotlight({ testimonials }: { testimonials: Testimonial[] }) {
  const t = testimonials[0]
  if (!t) return null
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 96px) 24px' }}>
      <figure className="ce-spotlight" style={{ maxWidth: 880, margin: '0 auto', padding: 'clamp(40px, 6vw, 68px) clamp(28px, 5vw, 56px)' }}>
        <span className="ce-spotlight-mark" aria-hidden>&ldquo;</span>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <blockquote style={{ margin: '0 0 32px', fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 'clamp(22px, 3.4vw, 32px)', lineHeight: 1.4, color: 'var(--c-ink)', letterSpacing: 'var(--tracking)' }}>
            {t.quote}
          </blockquote>
          <figcaption style={{ display: 'inline-flex', alignItems: 'center', gap: 13 }}>
            <span style={{ width: 46, height: 46, borderRadius: 999, background: 'color-mix(in srgb, var(--c-primary) 16%, transparent)', color: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 19, flexShrink: 0 }}>
              {(t.nama.trim()[0] ?? 'A').toUpperCase()}
            </span>
            <span style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 15, color: 'var(--c-ink)' }}>{t.nama}</span>
              {t.peran && <span style={{ display: 'block', fontSize: 13, color: 'var(--c-muted)', marginTop: 2 }}>{t.peran}</span>}
            </span>
          </figcaption>
        </div>
      </figure>
    </section>
  )
}

export function TestimoniMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  // Gandakan daftar agar loop -50% mulus.
  const loop = [...testimonials, ...testimonials]
  return (
    <section style={{ background: 'var(--c-page)', padding: '80px 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <SectionHead eyebrow="Kata Mereka" title="Ribuan Pelanggan Puas" />
      </div>
      <div className="ce-marquee">
        <div className="ce-marquee-track">
          {loop.map((t, i) => (
            <figure key={i} className="ce-quote" aria-hidden={i >= testimonials.length} style={{ margin: 0, padding: 24, width: 340, flexShrink: 0 }}>
              <blockquote style={{ margin: '0 0 14px', fontSize: 15, lineHeight: 1.6, color: 'var(--c-ink)' }}>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption style={{ fontSize: 13, color: 'var(--c-muted)' }}>
                <strong style={{ color: 'var(--c-ink)' }}>{t.nama}</strong>{t.peran ? ` · ${t.peran}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ — accordion CSS-only (<details>), objection-handling ───
export function FAQ({ faq }: { faq: FaqItem[] }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionHead eyebrow="Pertanyaan Umum" title="Yang Sering Ditanyakan" />
        <div>
          {faq.map((f, i) => (
            <details key={i} className="ce-faq" name="ce-faq">
              <summary>
                <span style={{ fontSize: 17 }}>{f.q}</span>
                <span className="ce-faq-ico" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </span>
              </summary>
              <div className="ce-faq-body" style={{ fontSize: 15 }}>{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── GALERI — masonry fasilitas / before-after (Sprint 5b) ─────
export function MasonryGallery({ gallery }: { gallery: GalleryContent }) {
  const images = gallery.images ?? []
  if (images.length === 0) return null
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow={gallery.subtitle ? undefined : 'Galeri'} title={gallery.title ?? 'Galeri'} subtitle={gallery.subtitle} />
        <div className="ce-masonry">
          {images.map((img, i) => (
            <figure key={i}>
              <img src={img.src} alt={img.caption ?? `Galeri ${i + 1}`} loading="lazy" />
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BeforeAfterGallery({ gallery }: { gallery: GalleryContent }) {
  const pairs = gallery.pairs ?? []
  if (pairs.length === 0) return null
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <SectionHead eyebrow="Hasil Nyata" title={gallery.title ?? 'Sebelum & Sesudah'} subtitle={gallery.subtitle ?? 'Foto asli pasien kami, atas persetujuan.'} />
        <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {pairs.map((p, i) => (
            <figure key={i} className="ce-ba-card" style={{ margin: 0 }}>
              <div className="ce-ba-pair">
                <div className="ce-ba-pane">
                  <img src={p.before} alt={`Sebelum${p.label ? ` — ${p.label}` : ''}`} loading="lazy" />
                  <span className="ce-ba-tag">Sebelum</span>
                </div>
                <div className="ce-ba-pane">
                  <img src={p.after} alt={`Sesudah${p.label ? ` — ${p.label}` : ''}`} loading="lazy" />
                  <span className="ce-ba-tag after">Sesudah</span>
                </div>
              </div>
              {p.label && <figcaption style={{ padding: '14px 18px', fontSize: 14, fontWeight: 600, color: 'var(--c-ink)' }}>{p.label}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── LUX — varian craft tier "lux" (panen RestaurantLuxRenderer) ──────────────
// Hanya dirender oleh manifest lux (hero:'cinematic' / showcase:'signature' /
// stats:'recognition' / gallery:'editorial'). Membaca nada lux (--c-surface2/
// --c-ink-dim/--c-border2) + motion (--ce-ease/--ce-dur-*) dgn fallback aman →
// nol regresi: tema lama tak pernah menjangkau balok ini.

// Hero sinematik — ken-burns gambar + scrim gelap + scroll cue. Teks putih di atas
// foto (terbaca utk lux terang maupun gelap). Tanpa foto → mesh fill bertekstur.
export function HeroCinematic({ hero, motif, motifColor }: { hero: Hero; motif?: MotifVariant; motifColor?: string }) {
  return (
    <section className="ce-hero-cine" style={{ color: '#FFFFFF', background: '#0B0B0C' }}>
      <div className="ce-hero-kb" aria-hidden style={hero.image ? { backgroundImage: `url(${hero.image})` } : { backgroundImage: MESH_FILL }} />
      <div className="ce-hero-cine-grad" aria-hidden />
      <MotifOverlay motif={motif} color={hero.image ? '#FFFFFF' : motifColor ?? '#C8922A'} opacity={0.06} />
      <span className="ce-hero-cue" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </span>
      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        {hero.eyebrow && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 22 }}>
            <span style={{ width: 32, height: 1, background: '#FFFFFF', opacity: .65 }} />
            <span className="ce-eyebrow" style={{ color: '#FFFFFF' }}>{hero.eyebrow}</span>
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(50px, 9vw, 116px)', lineHeight: .98, letterSpacing: '-.02em', margin: 0, color: '#FFFFFF', maxWidth: '15ch' }}>{hero.title}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 30, marginTop: 34 }}>
          {hero.subtitle && <p style={{ fontSize: 17, opacity: .92, lineHeight: 1.7, maxWidth: '46ch', margin: 0 }}>{hero.subtitle}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
            {hero.ctaText && <Btn text={hero.ctaText} href={hero.ctaHref} />}
            {hero.ctaText2 && <a className="ce-btn-ghost" href={hero.ctaHref2 ?? '#'}>{hero.ctaText2}</a>}
          </div>
        </div>
      </div>
    </section>
  )
}

// Showcase signature — top-N item ber-gambar selang-seling kiri/kanan + indeks
// besar + harga + tag; sisanya daftar ringkas. Industri-agnostik. Tanpa gambar →
// fallback daftar penuh.
export function ShowcaseSignature({ showcase }: { showcase: NonNullable<ComposableContent['showcase']> }) {
  const items = showcase.items
  const featured = items.filter((it) => it.gambar).slice(0, 3)
  const rest = featured.length > 0 ? items.filter((it) => !featured.includes(it)) : items
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 96px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <ShowHeading title={showcase.title} subtitle={showcase.subtitle} />
        {featured.length > 0 && (
          <div className="ce-stagger">
            {featured.map((it, i) => (
              <article key={i} className="ce-sig">
                <div className="ce-sig-media">{it.gambar && <img src={it.gambar} alt={it.nama} loading="lazy" />}</div>
                <div>
                  <span className="ce-sig-idx">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="ce-sig-name">{it.nama}</h3>
                  {it.desc && <p className="ce-sig-lead">{it.desc}</p>}
                  <div className="ce-sig-meta">
                    {it.harga != null && <span className="ce-price ce-sig-price">{formatRupiah(it.harga)}</span>}
                    {it.kategori && <span className="ce-sig-tag">{it.kategori}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {rest.length > 0 && (
          <div className="ce-stagger" style={{ maxWidth: 820, marginTop: featured.length > 0 ? 'clamp(40px, 6vw, 72px)' : 0 }}>
            {rest.map((it, i) => (
              <div key={i} className="ce-menu-row" style={{ padding: '18px 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
                  <h3 style={{ fontSize: 18, margin: 0, color: 'var(--c-ink)' }}>{it.nama}</h3>
                  {it.harga != null && <span className="ce-price" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--c-primary)', whiteSpace: 'nowrap' }}>{formatRupiah(it.harga)}</span>}
                </div>
                {it.desc && <p style={{ fontSize: 13, color: 'var(--c-ink-dim, var(--c-muted))', lineHeight: 1.6, margin: '5px 0 0', maxWidth: 560 }}>{it.desc}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Stats recognition — band kolom divider border-kiri, angka serif besar.
export function StatsRecognition({ stats, countUp }: { stats: StatItem[]; countUp?: boolean }) {
  const items = stats.slice(0, 4)
  if (items.length === 0) return null
  return (
    <section className="ce-recog" style={{ background: 'var(--c-surface2, var(--c-surface))', padding: 'clamp(56px, 7vw, 90px) 24px' }}>
      <div className="ce-recog-wrap" style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((s, i) => (
          <div key={i} className="ce-recog-stat">
            <b className="ce-stat-num" data-cu={countUp || undefined} style={{ fontSize: 'clamp(38px, 4.6vw, 58px)', display: 'block' }}>{s.angka}</b>
            <span className="ce-recog-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// Gallery editorial — grid 4-kolom dgn span tinggi/lebar (maks 6), foto zoom +
// caption reveal saat hover.
// quicklook (panen flagship): tiap foto memicu dialog lightbox SSR tunggal
// (ce-script.ts: focus-trap, Esc, panah). Tanpa prop → output lama byte-identik.
export function GalleryEditorial({ gallery, quicklook }: { gallery: GalleryContent; quicklook?: boolean }) {
  const images = (gallery.images ?? []).slice(0, 6)
  if (images.length === 0) return null
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow={gallery.subtitle ? undefined : 'Galeri'} title={gallery.title ?? 'Galeri'} subtitle={gallery.subtitle} />
        <div className="ce-galed">
          {images.map((img, i) => (
            <figure key={i} className={i === 0 ? 'ce-galed-tall' : (i === 1 || i === 4) ? 'ce-galed-wide' : undefined}>
              <img src={img.src} alt={img.caption ?? `Galeri ${i + 1}`} loading="lazy" />
              {img.caption && <figcaption>{img.caption}</figcaption>}
              {quicklook && (
                <button
                  type="button" className="ce-lb-open"
                  aria-label={`Perbesar foto: ${img.caption ?? `galeri ${i + 1}`}`}
                  data-src={img.src} data-title={img.caption ?? gallery.title ?? 'Galeri'}
                />
              )}
            </figure>
          ))}
        </div>
      </div>
      {quicklook && <GalleryLightbox />}
    </section>
  )
}

// Dialog quick-look tunggal (diisi ce-script.ts dari data-* trigger).
function GalleryLightbox() {
  return (
    <div className="ce-lb" role="dialog" aria-modal="true" aria-label="Pratinjau foto" hidden>
      <div className="ce-lb-back" data-lb-close aria-hidden />
      <figure className="ce-lb-panel">
        <button type="button" className="ce-lb-x" data-lb-close aria-label="Tutup pratinjau">×</button>
        <div className="ce-lb-media"><img alt="" /></div>
        <figcaption className="ce-lb-title" />
        <button type="button" className="ce-lb-prev" aria-label="Foto sebelumnya"><ChevL /></button>
        <button type="button" className="ce-lb-next" aria-label="Foto berikutnya"><ChevR /></button>
      </figure>
    </div>
  )
}

// ── INFO / LOKASI — jam buka + peta embed + reservasi ─────────
export function InfoLokasiBlock({ info }: { info: InfoLokasi }) {
  const hasMap = !!info.mapsQuery
  const mapSrc = hasMap
    ? `https://maps.google.com/maps?q=${encodeURIComponent(info.mapsQuery!)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : null
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow="Kunjungi Kami" title="Jam Buka & Lokasi" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28, alignItems: 'stretch' }}>
          {/* Kartu jam + kontak */}
          <div className="ce-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {info.jam && info.jam.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--c-muted)' }}>Jam Operasional</h3>
                {info.jam.map((j, i) => (
                  <div key={i} className="ce-jam-row">
                    <span style={{ fontWeight: 600, color: 'var(--c-ink)', fontSize: 14 }}>{j.hari}</span>
                    <span className="ce-price" style={{ color: 'var(--c-muted)', fontSize: 14 }}>{j.jam}</span>
                  </div>
                ))}
              </div>
            )}
            {info.alamat && (
              <div>
                <h3 style={{ fontSize: 14, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--c-muted)' }}>Alamat</h3>
                <p style={{ margin: 0, color: 'var(--c-ink)', fontSize: 15, lineHeight: 1.6 }}>{info.alamat}</p>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 'auto' }}>
              {info.reservasiText && <Btn text={info.reservasiText} href={info.reservasiHref ?? '#'} />}
              {info.telp && (
                <a href={`tel:${info.telp.replace(/[^\d+]/g, '')}`} style={{ display: 'inline-block', padding: '14px 28px', borderRadius: 'var(--r-pill)', border: '1px solid var(--c-border)', color: 'var(--c-ink)', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
                  Telepon
                </a>
              )}
            </div>
          </div>
          {/* Peta embed (tanpa API key) atau placeholder bermartabat */}
          <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--c-border)', boxShadow: 'var(--s-sm)', minHeight: 280, background: 'linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))' }}>
            {mapSrc && <iframe className="ce-map" src={mapSrc} title="Peta lokasi" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── TEAM / PEOPLE — 3 varian (Sprint A) ──────────────────────
// Avatar: foto bila ada, fallback inisial 2 huruf di atas surface-primary.
function TeamAvatar({ member }: { member: TeamMember }) {
  const initials = member.nama.trim().split(/\s+/).slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase() || 'T'
  if (member.foto) {
    return <img src={member.foto} alt={member.nama} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  }
  // Fallback bermartabat: chip inisial bundar di atas gradient lembut — bukan
  // blok warna polos sepenuh frame (yang terlihat kosong, terutama di spotlight 3/4).
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, color-mix(in srgb, var(--c-primary) 16%, var(--c-surface)), var(--c-surface))' }}>
      <div style={{ width: 'min(46%, 104px)', aspectRatio: '1', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in srgb, var(--c-primary) 20%, var(--c-surface))', border: '1px solid color-mix(in srgb, var(--c-primary) 32%, transparent)', color: 'var(--c-primary)', fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number, fontSize: 'clamp(20px, 3.2vw, 36px)', lineHeight: 1 }}>
        {initials}
      </div>
    </div>
  )
}

// Grid — semua anggota setara, auto-fit (klinik, sekolah, company)
export type TeamHead = { eyebrow?: string; title?: string }
export function TeamGrid({ team, heading }: { team: TeamMember[]; heading?: TeamHead }) {
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow={heading?.eyebrow ?? 'Tim Kami'} title={heading?.title ?? 'Kenali Tim di Balik Layanan Kami'} />
        <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {team.map((m, i) => (
            <div key={i} className="ce-team-card" style={{ textAlign: 'center' }}>
              <div className="ce-team-photo" style={{ aspectRatio: '1/1', borderRadius: 'var(--r-lg)', border: '1px solid var(--c-border)', overflow: 'hidden', position: 'relative', marginBottom: 14 }}>
                <TeamAvatar member={m} />
                {m.bio && <div className="ce-team-bio-reveal">{m.bio}</div>}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: 'var(--c-ink)' }}>{m.nama}</h3>
              <span style={{ fontSize: 13, color: 'var(--c-primary)', fontWeight: 600 }}>{m.peran}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Spotlight — 1 featured besar (kiri/atas) + grid pendukung (kanan/bawah)
export function TeamSpotlight({ team, heading }: { team: TeamMember[]; heading?: TeamHead }) {
  const [featured, ...rest] = team
  if (!featured) return null
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow={heading?.eyebrow ?? 'Tim Kami'} title={heading?.title ?? 'Kenali Tim Ahli Kami'} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40, alignItems: 'start' }}>
          <div className="ce-team-card">
            <div className="ce-team-photo" style={{ aspectRatio: '3/4', borderRadius: 'var(--r-lg)', border: '1px solid var(--c-border)', overflow: 'hidden', position: 'relative', marginBottom: 20 }}>
              <TeamAvatar member={featured} />
              {featured.bio && <div className="ce-team-bio-reveal">{featured.bio}</div>}
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: 'var(--c-ink)' }}>{featured.nama}</h3>
            <span style={{ fontSize: 14, color: 'var(--c-primary)', fontWeight: 600 }}>{featured.peran}</span>
            {featured.bio && <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.65, margin: '10px 0 0' }}>{featured.bio}</p>}
          </div>
          {rest.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, alignContent: 'start', paddingTop: 8 }}>
              {rest.map((m, i) => (
                <div key={i} className="ce-team-card" style={{ textAlign: 'center' }}>
                  <div className="ce-team-photo" style={{ aspectRatio: '1/1', borderRadius: 'var(--r-md)', border: '1px solid var(--c-border)', overflow: 'hidden', position: 'relative', marginBottom: 10 }}>
                    <TeamAvatar member={m} />
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 3px', color: 'var(--c-ink)' }}>{m.nama}</h3>
                  <span style={{ fontSize: 12, color: 'var(--c-primary)', fontWeight: 600 }}>{m.peran}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Horizontal — scroll strip (tim banyak, mis. coach directory)
export function TeamHorizontal({ team, heading }: { team: TeamMember[]; heading?: TeamHead }) {
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow={heading?.eyebrow ?? 'Tim Kami'} title={heading?.title ?? 'Kenali Tim di Balik Layanan Kami'} />
        <div className="ce-team-scroll">
          {team.map((m, i) => (
            <div key={i} className="ce-team-card ce-team-scroll-item">
              <div className="ce-team-photo" style={{ aspectRatio: '1/1', borderRadius: 'var(--r-lg)', border: '1px solid var(--c-border)', overflow: 'hidden', position: 'relative', marginBottom: 12 }}>
                <TeamAvatar member={m} />
                {m.bio && <div className="ce-team-bio-reveal">{m.bio}</div>}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 3px', color: 'var(--c-ink)' }}>{m.nama}</h3>
              <span style={{ fontSize: 12, color: 'var(--c-primary)', fontWeight: 600 }}>{m.peran}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── ABOUT varian — 3 gaya baru + text lama (Sprint A) ─────────
type AboutContent = NonNullable<ComposableContent['about']>

// Split-Right — teks kiri, gambar kanan (editorial bersih)
export function AboutSplitRight({ about }: { about: AboutContent }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 80px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
        <div>
          <p className="ce-eyebrow" style={{ marginBottom: 12 }}>Tentang Kami</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 20px', color: 'var(--c-ink)' }}>{about.title}</h2>
          <p style={{ fontSize: 16, color: 'var(--c-muted)', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>{about.body}</p>
          {about.ctaText && <div style={{ marginTop: 28 }}><Btn text={about.ctaText} href={about.ctaHref} /></div>}
        </div>
        <div style={{ minHeight: 360, borderRadius: 'var(--r-lg)', border: '1px solid var(--c-border)', overflow: 'hidden', boxShadow: 'var(--s-lg)', background: MESH_FILL }}>
          {about.image && <img src={about.image} alt={about.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 360 }} />}
        </div>
      </div>
    </section>
  )
}

// Split-Left — gambar kiri, teks kanan (reversed)
export function AboutSplitLeft({ about }: { about: AboutContent }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 80px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
        <div style={{ minHeight: 360, borderRadius: 'var(--r-lg)', border: '1px solid var(--c-border)', overflow: 'hidden', boxShadow: 'var(--s-lg)', background: MESH_FILL }}>
          {about.image && <img src={about.image} alt={about.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 360 }} />}
        </div>
        <div>
          <p className="ce-eyebrow" style={{ marginBottom: 12 }}>Tentang Kami</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 20px', color: 'var(--c-ink)' }}>{about.title}</h2>
          <p style={{ fontSize: 16, color: 'var(--c-muted)', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>{about.body}</p>
          {about.ctaText && <div style={{ marginTop: 28 }}><Btn text={about.ctaText} href={about.ctaHref} /></div>}
        </div>
      </div>
    </section>
  )
}

// Story — sinematik: judul centered, gambar full-width, teks centered bawah
export function AboutStory({ about }: { about: AboutContent }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="ce-eyebrow" style={{ marginBottom: 12 }}>Tentang Kami</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', margin: 0, color: 'var(--c-ink)' }}>{about.title}</h2>
        </div>
        <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--c-border)', marginBottom: 48, aspectRatio: '16/7', background: MESH_FILL, boxShadow: 'var(--s-lg)' }}>
          {about.image && <img src={about.image} alt={about.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 17, color: 'var(--c-muted)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{about.body}</p>
          {about.ctaText && <div style={{ marginTop: 28 }}><Btn text={about.ctaText} href={about.ctaHref} /></div>}
        </div>
      </div>
    </section>
  )
}

// ── FEATURES ZIGZAG — alternating image+text (Sprint A) ───────
export function FeaturesZigzag({ features, heading }: { features: NonNullable<ComposableContent['features']>; heading?: FeatHead }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <FeatHeading {...heading} />
        <div>
          {features.map((f, i) => (
            <div key={i} className="ce-zigzag-item">
              {/* Visual: foto bila ada, gradient + angka watermark bila tidak */}
              <div style={{ flex: '1 1 340px', minHeight: 280, borderRadius: 'var(--r-lg)', border: '1px solid var(--c-border)', overflow: 'hidden', boxShadow: 'var(--s-sm)', position: 'relative', background: 'linear-gradient(135deg, var(--c-hero-from), var(--c-hero-to))' }}>
                {f.image
                  ? <img src={f.image} alt={f.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 280 }} />
                  : <span aria-hidden style={{ position: 'absolute', bottom: 12, right: 20, fontFamily: 'var(--f-display)', fontWeight: 900, fontSize: 'clamp(80px, 14vw, 140px)', lineHeight: 1, color: 'var(--c-hero-ink)', opacity: 0.18, userSelect: 'none' }}>{String(i + 1).padStart(2, '0')}</span>
                }
              </div>
              {/* Teks: angka watermark dekoratif + heading + body */}
              <div style={{ flex: '1 1 340px' }}>
                <span aria-hidden style={{ display: 'block', fontFamily: 'var(--f-display)', fontWeight: 900, fontSize: 'clamp(56px, 10vw, 80px)', lineHeight: 1, color: 'var(--c-primary)', opacity: 0.1, marginBottom: -16, userSelect: 'none' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, margin: '0 0 14px', color: 'var(--c-ink)' }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: 'var(--c-muted)', lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── SPRINT B — Conversion layer (Pricing / Process / CTA varian) ──
// Ikon centang reusable (SVG, stroke = currentColor → ikut warna parent).
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// Tombol outline (sekunder) — dipakai paket non-unggulan supaya hierarki jelas.
function BtnOutline({ text, href }: { text?: string; href?: string }) {
  if (!text) return null
  return (
    <a href={href ?? '#'} style={{ display: 'inline-block', padding: '13px 28px', borderRadius: 'var(--r-pill)', border: '1px solid var(--c-border)', color: 'var(--c-ink)', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
      {text}
    </a>
  )
}

// ── PRICING — 3 varian (cards / table / single) ──────────────
function PricingCard({ plan }: { plan: PricingPlan }) {
  const feat = !!plan.unggulan
  return (
    <div className={feat ? 'ce-pcard feat' : 'ce-pcard'} style={{ padding: 30, position: 'relative' }}>
      {feat && <span className="ce-pcard-badge" style={{ position: 'absolute', top: -12, left: 30 }}>{plan.badge ?? 'Paling Populer'}</span>}
      <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: 'var(--c-ink)' }}>{plan.nama}</h3>
      {plan.desc && <p style={{ fontSize: 13, color: 'var(--c-muted)', lineHeight: 1.5, margin: '0 0 18px' }}>{plan.desc}</p>}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 22 }}>
        <span className="ce-pcard-amt" style={{ fontSize: 'clamp(30px, 5vw, 40px)' }}>{plan.harga}</span>
        {plan.periode && <span style={{ fontSize: 14, color: 'var(--c-muted)' }}>{plan.periode}</span>}
      </div>
      {plan.fitur.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          {plan.fitur.map((f, i) => (
            <div key={i} className="ce-pcard-feat">
              <CheckIcon className="ce-pcard-tick" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 'auto' }}>
        {feat
          ? <Btn text={plan.ctaText ?? 'Pilih Paket'} href={plan.ctaHref} />
          : <BtnOutline text={plan.ctaText ?? 'Pilih Paket'} href={plan.ctaHref} />}
      </div>
    </div>
  )
}

// Cards — tier berdampingan; paket unggulan di-highlight (ring + badge).
export function PricingCards({ pricing }: { pricing: PricingContent }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow="Paket & Harga" title={pricing.title ?? 'Pilih Paket yang Pas'} subtitle={pricing.subtitle} />
        <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, alignItems: 'stretch' }}>
          {pricing.plans.map((p, i) => <PricingCard key={i} plan={p} />)}
        </div>
      </div>
    </section>
  )
}

// Table — matriks perbandingan; baris = gabungan semua fitur, centang per paket.
export function PricingTable({ pricing }: { pricing: PricingContent }) {
  const plans = pricing.plans
  const allFeatures: string[] = []
  for (const p of plans) for (const f of p.fitur) if (!allFeatures.includes(f)) allFeatures.push(f)
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <SectionHead eyebrow="Paket & Harga" title={pricing.title ?? 'Bandingkan Paket'} subtitle={pricing.subtitle} />
        <div className="ce-ptab-wrap">
          <table className="ce-ptab">
            <thead>
              <tr>
                <th aria-hidden />
                {plans.map((p, i) => (
                  <th key={i} className={p.unggulan ? 'col feat' : 'col'}>
                    {p.unggulan && <div className="ce-pcard-badge" style={{ display: 'inline-block', marginBottom: 8 }}>{p.badge ?? 'Populer'}</div>}
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-ink)' }}>{p.nama}</div>
                    <div className="ce-ptab-amt" style={{ marginTop: 6 }}>{p.harga}</div>
                    {p.periode && <div style={{ fontSize: 12, color: 'var(--c-muted)' }}>{p.periode}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((f, ri) => (
                <tr key={ri}>
                  <td style={{ fontSize: 14, color: 'var(--c-ink)' }}>{f}</td>
                  {plans.map((p, ci) => (
                    <td key={ci} className={p.unggulan ? 'col feat' : 'col'}>
                      {p.fitur.includes(f)
                        ? <CheckIcon className="ce-ptab-tick" />
                        : <span className="ce-ptab-x" aria-label="tidak termasuk">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td aria-hidden />
                {plans.map((p, i) => (
                  <td key={i} className={p.unggulan ? 'col feat' : 'col'}>
                    {p.unggulan
                      ? <Btn text={p.ctaText ?? 'Pilih'} href={p.ctaHref} />
                      : <BtnOutline text={p.ctaText ?? 'Pilih'} href={p.ctaHref} />}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  )
}

// Single — 1 paket unggulan terfokus, fitur 2-kolom, CTA besar.
export function PricingSingle({ pricing }: { pricing: PricingContent }) {
  const plan = pricing.plans.find(p => p.unggulan) ?? pricing.plans[0]
  if (!plan) return null
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="Penawaran" title={pricing.title ?? 'Satu Paket, Semua Fitur'} subtitle={pricing.subtitle} />
        <div className="ce-pcard feat" style={{ padding: 'clamp(28px, 5vw, 48px)', textAlign: 'center', alignItems: 'center' }}>
          {plan.badge && <span className="ce-pcard-badge" style={{ marginBottom: 16 }}>{plan.badge}</span>}
          <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: 'var(--c-ink)' }}>{plan.nama}</h3>
          {plan.desc && <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: '0 0 20px', maxWidth: 420 }}>{plan.desc}</p>}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            <span className="ce-pcard-amt" style={{ fontSize: 'clamp(40px, 8vw, 60px)' }}>{plan.harga}</span>
            {plan.periode && <span style={{ fontSize: 16, color: 'var(--c-muted)' }}>{plan.periode}</span>}
          </div>
          {plan.fitur.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 28px', textAlign: 'left', width: '100%', maxWidth: 520, marginBottom: 32 }}>
              {plan.fitur.map((f, i) => (
                <div key={i} className="ce-pcard-feat" style={{ borderTop: 'none' }}>
                  <CheckIcon className="ce-pcard-tick" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}
          <Btn text={plan.ctaText ?? 'Mulai Sekarang'} href={plan.ctaHref} />
        </div>
      </div>
    </section>
  )
}

// ── PROCESS / STEPS — 3 varian (horizontal / timeline / cards) ──
// Horizontal — node bernomor sebaris + konektor; collapse ke kolom di mobile.
export function ProcessHorizontal({ process }: { process: ProcessContent }) {
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow="Cara Kerja" title={process.title ?? 'Cara Kerjanya'} subtitle={process.subtitle} />
        <div className="ce-proc">
          {process.steps.map((s, i) => (
            <div key={i} className="ce-proc-step">
              <div className="ce-proc-node">{i + 1}</div>
              <span className="ce-proc-line" aria-hidden />
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px', color: 'var(--c-ink)' }}>{s.judul}</h3>
              <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Timeline — linimasa vertikal bernomor (cocok proses panjang / riwayat).
export function ProcessTimeline({ process }: { process: ProcessContent }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="Proses Kami" title={process.title ?? 'Langkah demi Langkah'} subtitle={process.subtitle} />
        <div>
          {process.steps.map((s, i) => (
            <div key={i} className="ce-tl-item">
              <div className="ce-tl-node">{i + 1}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: 'var(--c-ink)' }}>{s.judul}</h3>
              <p style={{ fontSize: 15, color: 'var(--c-muted)', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Cards — kartu langkah grid dengan angka watermark besar.
export function ProcessCards({ process }: { process: ProcessContent }) {
  return (
    <section style={{ background: 'var(--c-surface)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <SectionHead eyebrow="Cara Kerja" title={process.title ?? 'Cara Kerjanya'} subtitle={process.subtitle} />
        <div className="ce-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {process.steps.map((s, i) => (
            <div key={i} className="ce-card" style={{ padding: 28, position: 'relative' }}>
              <span aria-hidden style={{ position: 'absolute', top: 16, right: 20, fontFamily: 'var(--f-display)', fontWeight: 900, fontSize: 56, lineHeight: 1, color: 'var(--c-primary)', opacity: 0.12, userSelect: 'none' }}>{String(i + 1).padStart(2, '0')}</span>
              <div style={{ width: 40, height: 40, borderRadius: 999, background: 'color-mix(in srgb, var(--c-primary) 14%, var(--c-surface))', color: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 17, marginBottom: 18 }}>{i + 1}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px', color: 'var(--c-ink)' }}>{s.judul}</h3>
              <p style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA varian — banner (strip lebar) / split (gambar + ajakan) ──
export function CTABanner({ cta }: { cta: NonNullable<ComposableContent['cta']> }) {
  return (
    <section style={{ padding: '32px 24px 96px' }}>
      <div
        className="ce-cta-banner"
        style={{
          maxWidth: 1120, margin: '0 auto', padding: 'clamp(36px, 5vw, 56px)',
          borderRadius: 'var(--r-lg)', color: 'var(--c-hero-ink)', boxShadow: 'var(--s-lg)',
          border: '1px solid var(--c-border)', overflow: 'hidden',
          backgroundImage: [
            'radial-gradient(ellipse 50% 120% at 100% 50%, color-mix(in srgb, var(--c-primary) 24%, transparent) 0%, transparent 60%)',
            'linear-gradient(120deg, var(--c-hero-from), var(--c-hero-to))',
          ].join(', '),
        }}
      >
        <div style={{ flex: '1 1 360px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', margin: '0 0 8px', color: 'var(--c-hero-ink)' }}>{cta.title}</h2>
          {cta.subtitle && <p style={{ opacity: .85, margin: 0, fontSize: 16, lineHeight: 1.6 }}>{cta.subtitle}</p>}
        </div>
        <Btn text={cta.ctaText ?? 'Pesan Sekarang'} href={cta.ctaHref} />
      </div>
    </section>
  )
}

export function CTASplit({ cta }: { cta: NonNullable<ComposableContent['cta']> }) {
  return (
    <section style={{ padding: '32px 24px 96px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--c-border)', boxShadow: 'var(--s-lg)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div style={{ minHeight: 280, background: MESH_FILL }}>
          {cta.image && <img src={cta.image} alt={cta.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 280 }} />}
        </div>
        <div style={{ padding: 'clamp(32px, 5vw, 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--c-surface)' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', margin: '0 0 12px', color: 'var(--c-ink)' }}>{cta.title}</h2>
          {cta.subtitle && <p style={{ color: 'var(--c-muted)', margin: '0 0 28px', fontSize: 16, lineHeight: 1.7 }}>{cta.subtitle}</p>}
          <div><Btn text={cta.ctaText ?? 'Pesan Sekarang'} href={cta.ctaHref} /></div>
        </div>
      </div>
    </section>
  )
}

// ── SPRINT C — Partner logos / Social links ──────────────────
// Satu logo: <img> bila ada URL, fallback chip teks nama. Bungkus <a> bila href.
// `dup` = salinan untuk loop marquee → aria-hidden + tak fokus.
function LogoItem({ p, dup }: { p: PartnerLogo; dup?: boolean }) {
  const inner = p.logo
    ? <img src={p.logo} alt={p.nama} loading="lazy" />
    : <span className="ce-logo-chip">{p.nama}</span>
  const a11y = dup ? { 'aria-hidden': true, tabIndex: -1 } : {}
  return p.href && !dup
    ? <a className="ce-logo" href={p.href} target="_blank" rel="noopener noreferrer" aria-label={p.nama}>{inner}</a>
    : <div className="ce-logo" aria-label={dup ? undefined : p.nama} {...a11y}>{inner}</div>
}

// Grid — deret logo statis terpusat (sedikit logo, "dipercaya oleh").
export function PartnersGrid({ partners }: { partners: PartnersContent }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: '64px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <SectionHead eyebrow="Mitra & Klien" title={partners.title ?? 'Dipercaya Oleh'} subtitle={partners.subtitle} />
        <div className="ce-logo-grid">
          {partners.logos.map((p, i) => <LogoItem key={i} p={p} />)}
        </div>
      </div>
    </section>
  )
}

// Marquee — strip logo bergerak (banyak logo), jeda saat hover.
export function PartnersMarquee({ partners }: { partners: PartnersContent }) {
  const loop = [...partners.logos, ...partners.logos]
  return (
    <section style={{ background: 'var(--c-page)', padding: '64px 0' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
        <SectionHead eyebrow="Mitra & Klien" title={partners.title ?? 'Dipercaya Oleh'} subtitle={partners.subtitle} />
      </div>
      <div className="ce-logo-marquee">
        <div className="ce-logo-track">
          {loop.map((p, i) => <LogoItem key={i} p={p} dup={i >= partners.logos.length} />)}
        </div>
      </div>
    </section>
  )
}

// Ikon platform (24×24, fill=currentColor → ikut warna tema). Brand = simple-icons
// (CC0); marketplace/website = bentuk solid sederhana. Label selalu tampil → jelas.
const SOCIAL_ICONS: Record<SocialPlatform, string> = {
  instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z',
  tiktok: 'M16.6 0h-3.3v13.2a2.7 2.7 0 1 1-2.7-2.7c.2 0 .4 0 .6.1V7.2a6 6 0 0 0-.6 0 6 6 0 1 0 6 6V6.7a7.3 7.3 0 0 0 4.3 1.4V4.8a4.3 4.3 0 0 1-2.9-1.1A4.3 4.3 0 0 1 16.6 0z',
  youtube: 'M23.5 6.2a3 3 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3 3 0 0 0 2.12-2.14A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12z',
  facebook: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 9.56 23.93v-8.39H6.69v-3.47h2.87V9.41c0-2.85 1.7-4.42 4.3-4.42 1.25 0 2.55.22 2.55.22v2.8h-1.44c-1.41 0-1.85.88-1.85 1.79v2.15h3.16l-.5 3.47h-2.66v8.39C19.61 23.1 24 18.1 24 12.07z',
  whatsapp: 'M.06 24l1.69-6.16A11.87 11.87 0 0 1 .16 11.9C.16 5.34 5.5 0 12.05 0a11.82 11.82 0 0 1 8.41 3.49 11.82 11.82 0 0 1 3.48 8.41c0 6.56-5.34 11.89-11.89 11.89a11.9 11.9 0 0 1-5.69-1.45L.06 24zm6.6-3.8c1.68 1 3.28 1.59 5.39 1.59 5.45 0 9.89-4.43 9.89-9.89 0-5.46-4.42-9.89-9.88-9.89-5.45 0-9.89 4.43-9.89 9.88a9.86 9.86 0 0 0 1.51 5.26l-1 3.65 3.98-1.2zm11.39-5.46c-.07-.12-.27-.2-.57-.35-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41z',
  x: 'M18.24 2.25h3.31l-7.23 8.26L23 21.75h-6.66l-5.21-6.82-5.97 6.82H1.86l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z',
  shopee: 'M12 2a4 4 0 0 0-4 4H5.5a1.5 1.5 0 0 0-1.5 1.36l-1 11A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.64l-1-11A1.5 1.5 0 0 0 18.5 6H16a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2h-4a2 2 0 0 1 2-2zm-2.5 7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z',
  tokopedia: 'M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.83 0l7-7a2 2 0 0 0 0-2.83zM6.5 8A1.5 1.5 0 1 1 8 6.5 1.5 1.5 0 0 1 6.5 8z',
  website: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.93 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8zM12 4c.83 1.2 1.48 2.53 1.91 3.96h-3.82C10.52 6.53 11.17 5.2 12 4zM4.26 14a7.96 7.96 0 0 1 0-4h3.38a16.6 16.6 0 0 0 0 4H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.03 8.03 0 0 1 5.07 16zm2.95-8H5.07a8.03 8.03 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.02 8zM12 20c-.83-1.2-1.48-2.53-1.91-3.96h3.82C13.48 17.47 12.83 18.8 12 20zm2.34-6H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4zm.27 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14a16.6 16.6 0 0 0 0-4h3.38a7.96 7.96 0 0 1 0 4h-3.38z',
}
const SOCIAL_LABEL: Record<SocialPlatform, string> = {
  instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', facebook: 'Facebook',
  whatsapp: 'WhatsApp', x: 'X', shopee: 'Shopee', tokopedia: 'Tokopedia', website: 'Website',
}

// Social strip — ikon medsos/marketplace, arahkan ke tempat transaksi/komunitas.
export function SocialStrip({ social }: { social: SocialContent }) {
  return (
    <section style={{ background: 'var(--c-surface)', padding: '64px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <SectionHead eyebrow="Terhubung" title={social.title ?? 'Ikuti & Belanja di'} subtitle={social.subtitle} />
        <div className="ce-social-row">
          {social.links.map((l, i) => {
            const label = l.label ?? SOCIAL_LABEL[l.platform]
            const path = SOCIAL_ICONS[l.platform] ?? SOCIAL_ICONS.website
            return (
              <a key={i} className="ce-social-item" href={l.href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <span className="ce-social-ic">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={path} /></svg>
                </span>
                <span className="ce-social-lbl">{label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Footer({ content, motif, motifColor }: { content: ComposableContent; motif?: MotifVariant; motifColor?: string }) {
  const strip = motifTile(motif, motifColor ?? '#C8922A', 0.5)
  return (
    <>
    {strip && <div aria-hidden style={{ height: 28, opacity: 0.25, backgroundImage: strip, backgroundSize: motifSize(motif), borderTop: '1px solid var(--c-border)' }} />}
    <footer style={{ borderTop: strip ? 'none' : '1px solid var(--c-border)', padding: '32px 24px', maxWidth: 1120, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--f-display)', fontWeight: 'var(--fw-display)' as unknown as number }}>{content.nama}</span>
      <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--c-muted)' }}>
        {content.contact?.wa && <a href={`https://wa.me/${content.contact.wa}`} style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 700 }}>WhatsApp</a>}
        {content.contact?.email && <a href={`mailto:${content.contact.email}`} style={{ color: 'var(--c-muted)', textDecoration: 'none' }}>Email</a>}
        {content.contact?.alamat && <span>{content.contact.alamat}</span>}
      </div>
    </footer>
    </>
  )
}

// ════════════════════════════════════════════════════════════
// PANEN FLAGSHIP TOKO-ATELIER — varian interaktif (ce-script.ts).
// Hanya dirender bila manifest memilihnya → tema lama nol regresi.
// ════════════════════════════════════════════════════════════
const ChevL = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
)
const ChevR = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
)

// Testimoni carousel — scroll-snap (geser native), JS hanya tombol+dot.
// Pola aria sama dgn flagship: region carousel + slide bernomor + dot berlabel.
export function TestimoniCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const many = testimonials.length > 1
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 88px) 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <SectionHead eyebrow="Kata Mereka" title="Dipercaya Pelanggan Kami" />
          {many && (
            <div className="ce-tctrl" style={{ marginBottom: 40 }}>
              <button type="button" className="ce-tbtn ce-tprev" aria-label="Testimoni sebelumnya"><ChevL /></button>
              <button type="button" className="ce-tbtn ce-tnext" aria-label="Testimoni berikutnya"><ChevR /></button>
            </div>
          )}
        </div>
        <div className="ce-tcar" role="region" aria-roledescription="carousel" aria-label="Testimoni pelanggan">
          <div className="ce-tcar-track" tabIndex={0} role="group" aria-label="Daftar testimoni — gulir horizontal atau pakai tombol panah">
            {testimonials.map((t, i) => (
              <div className="ce-tslide" key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} dari ${testimonials.length}`}>
                <QuoteCard t={t} />
              </div>
            ))}
          </div>
          {many && (
            <div className="ce-dots" role="group" aria-label="Pilih testimoni">
              {testimonials.map((_, i) => (
                <button type="button" className="ce-dot" key={i} aria-label={`Ke testimoni ${i + 1}`} aria-current={i === 0 ? 'true' : 'false'} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Features sticky-passage — kiri pinned (CSS sticky), kanan baris bernomor.
export function FeaturesSticky({ features, heading }: { features: Feature[]; heading?: FeatHead }) {
  return (
    <section style={{ background: 'var(--c-page)', padding: 'var(--sec-pad-y, 96px) 24px' }}>
      <div className="ce-fsticky" style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div className="ce-fsticky-side">
          <p className="ce-eyebrow" style={{ margin: 0 }}>{heading?.eyebrow ?? 'Keunggulan'}</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', margin: '14px 0 0', color: 'var(--c-ink)' }}>{heading?.title ?? 'Mengapa Memilih Kami'}</h2>
          {heading?.subtitle && <p style={{ fontSize: 15, color: 'var(--c-muted)', margin: '14px 0 0', lineHeight: 1.7, maxWidth: '38ch' }}>{heading.subtitle}</p>}
        </div>
        <div className="ce-fsticky-rows">
          {features.map((f, i) => (
            <div className="ce-fsticky-row" key={i}>
              <span className="ce-fsticky-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <b style={{ display: 'block', fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 'clamp(18px, 2.2vw, 23px)', color: 'var(--c-ink)' }}>{f.title}</b>
                <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--c-muted)', lineHeight: 1.7, maxWidth: '52ch' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Band add-on (newsletter/career) — strip CTA sekunder dari injeksi B-section.
// Dirender ComposableRenderer di luar alur manifest; data-band utk verifikasi.
export function AddonBand({ band }: { band: PresetBand }) {
  return (
    <section data-band={band.preset} style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)', padding: '56px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ maxWidth: 640 }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', margin: 0, color: 'var(--c-ink)' }}>{band.title}</h2>
          {band.subtitle && <p style={{ margin: '10px 0 0', fontSize: 15, color: 'var(--c-muted)', lineHeight: 1.7 }}>{band.subtitle}</p>}
        </div>
        {band.ctaText && <Btn text={band.ctaText} href={band.ctaHref} />}
      </div>
    </section>
  )
}

// CTA duotone — band full-bleed: foto grayscale + tint primary (mix-blend) +
// scrim; tombol .ce-mag (magnetic, pointer presisi saja). Tanpa foto → mesh.
export function CTADuotone({ cta }: { cta: NonNullable<ComposableContent['cta']> }) {
  return (
    <section className={`ce-cta-duo${cta.image ? '' : ' noimg'}`}>
      <div className="ce-cta-duo-bg" style={cta.image ? { backgroundImage: `url(${cta.image})` } : undefined} />
      <div className="ce-cta-duo-tint" />
      <div className="ce-cta-duo-scrim" />
      <div className="ce-cta-duo-in">
        <h2>{cta.title}</h2>
        {cta.subtitle && <p>{cta.subtitle}</p>}
        {cta.ctaText && (
          <div style={{ marginTop: 38, display: 'flex', justifyContent: 'center' }}>
            <a
              href={cta.ctaHref ?? '#'} className="ce-btn ce-mag"
              style={{ display: 'inline-block', padding: '16px 36px', fontWeight: 700, fontSize: 15, boxShadow: '0 14px 44px color-mix(in srgb, var(--c-primary) 35%, transparent)' }}
            >
              {cta.ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
