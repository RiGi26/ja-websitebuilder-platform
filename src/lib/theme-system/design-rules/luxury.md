---
mood: luxury
source: gen-design-rules.test.ts (derived from THEME_PACKS — 31 tema currently using this mood)
status: AUTHORED (2026-06-07) — derived data + must/should rules, states, layout guidance, a11y written.
---

# Design Rules — mood: `luxury`

> Anchored to **31 production themes** currently tagged `mood: 'luxury'`:
> `kuliner-heritage`, `fashion-editorial`, `kerajinan-pusaka`, `kecantikan-noir`, `gadget-onyx`, `rumah-walnut`, `herbal-botani`, `warung-angkringan`, `cafe-roastery`, `finedining-aurum`, `umum-trustnavy`, `estetik-noir`, `wellness-forest`, `reguler-prestasi`, `islami-malam`, `kursus-malam`, `kreator-spotlight`, `profesional-mono`, `coach-prestige`, `startup-midnight`, `agency-noir`, `korporat-slate`, `kendaraan-asphalt`, `wisata-rimba`, `akomodasi-malam`, `jurnal-senja`, `media-malam`, `niche-gelap`, `luar-premium`, `lokal-gelap`, `preorder-malam`

## 1. Mission
**Luxury = quiet confidence, not loud opulence.** This mood whispers "we don't need to
convince you" — for brands that compete on craft, heritage, or prestige rather than
price: fine dining, heritage retail, premium services, executive/agency positioning,
high-end hospitality. Dark stages, restrained gold/jewel accents, generous negative
space, serif-leaning type. The page should feel like walking into a dim, well-appointed
room — every element deliberate, nothing crowding the eye.

## 2. Style foundations (derived from real tokens — anchor must-rules to these)

**Contrast already in production (ink vs page):** min 14.29:1 · max 16.91:1 · n=31
**Contrast already in production (onPrimary vs primary):** min 3.96:1 · max 16.82:1 · n=31
> Bar from `THEME_VISUAL_PIPELINE.md` §3.2: **must** be ≥ 4.5:1. Use the ranges
> above as the proven floor for new themes in this mood — don't go below the min.

| theme id | primary | page | ink |
|---|---|---|---|
| `kuliner-heritage` | `#C8A24B` | `#1A1011` | `#F4E9DE` |
| `fashion-editorial` | `#F2EFEA` | `#0E0E0F` | `#F2EFEA` |
| `kerajinan-pusaka` | `#C8922A` | `#14102E` | `#F3E9D6` |
| `kecantikan-noir` | `#D8A7A0` | `#17121A` | `#F1E7EC` |
| `gadget-onyx` | `#22D3EE` | `#0B0E14` | `#E8EDF4` |
| `rumah-walnut` | `#C49A6C` | `#16130F` | `#ECE3D5` |

**Radius scale in use:**
**sm:** 10px / 12px / 2px / 3px / 4px / 6px / 8px  
**md:** 10px / 12px / 14px / 16px / 18px / 4px / 6px / 8px  
**lg:** 12px / 14px / 16px / 18px / 20px / 22px / 26px / 8px

**Font pairing patterns in use:**
- campur · display 700 / body 400 / tracking -0.01em — ×1
- campur · display 600 / body 400 / tracking -0.02em — ×3
- campur · display 600 / body 400 / tracking -0.005em — ×11
- campur · display 500 / body 400 / tracking -0.005em — ×2
- campur · display 800 / body 400 / tracking -0.03em — ×7
- campur · display 700 / body 400 / tracking -0.005em — ×1
- sama · display 600 / body 400 / tracking -0.005em — ×2
- sama · display 800 / body 400 / tracking -0.03em — ×1
- campur · display 900 / body 400 / tracking -0.035em — ×2
- sama · display 700 / body 400 / tracking -0.02em — ×1

**Rules (anchored to the table above):**
- `page` **must** be dark (production range `#0E0E0F`–`#17121A`, near-black with a
  warm/cool tint). This is luxury's single non-negotiable token — a light-page
  "luxury" theme is a contradiction; that's `clean` or `minimal` wearing a costume.
- `primary` **should** be a restrained metallic/jewel accent (gold `#C8A24B`-family,
  cyan `#22D3EE`, dusty rose `#D8A7A0`) used *sparingly* — as a signature, not a fill
  color. **Must not** saturate large areas with `primary`; luxury reads through
  restraint, and an accent that's everywhere stops being an accent.
- Radius **must** stay tight (production `sm` 2–12px, `lg` capping near 26px — the
  tightest range of any mood by far). Soft/pill-heavy radius reads "friendly", which
  undercuts luxury's formal posture — **must not** borrow `warm`'s generous rounding.
- Shadows **should** be deep and dark (`rgba(0,0,0,.4)`+ at `sm`) — the "depth from
  darkness" look, not colored glows (`bold`'s territory).
- Typography is **near-universally serif+sans** (campur, 28/31) at moderate weights
  (600–800) with the tightest tracking band of any mood (−0.005em to −0.035em — almost
  every value negative and small). **Should** pair a serif display with a sans body;
  **must not** go full-sans — that's the one move that collapses luxury into `clean`.

## 3. Layout guidance (derived — which archetypes this mood actually uses)

- **Hero:** `fullbleed` ×31
- **Features:** `rows` ×28, `grid` ×3
- **Padding:** `airy` ×27, `normal` ×4
- **Alignment:** `left` ×31

**This is the most disciplined mood in the system — 31/31 use `fullbleed` hero AND
`align: left`; 28/31 use `features: rows`; 27/31 use `pad: airy`. That uniformity IS
the rule, not an accident:**
- **Hero `fullbleed` is mandatory** — a full-viewport stage is what makes "quiet
  confidence" *visible*; anything smaller (`centered`, `split`) reads as a normal
  commerce site dressed in dark colors. New luxury themes **must** use `fullbleed`.
- **Features `rows`** (numbered/listed, not gridded cards) lets each item breathe in
  its own horizontal band — matching the "one considered thing at a time" pacing.
  **Should** default to `rows`; `grid` (3/31 — likely a deliberate VARIASI #6 spread
  pick within a sub-kategori) is the rare exception, not a fallback.
- **`pad: airy`** is near-universal (27/31) — luxury's negative space IS the luxury.
  **Must** default to airy; `normal` padding makes a dark theme look cramped/ominous
  rather than spacious/refined.
- **`align: left`** is universal (31/31) — pairs with `fullbleed`+`rows` for an
  editorial, magazine-spread rhythm. **Must not** use `center` align in this mood —
  it would clash with every other locked-in choice above.

## 4. States
- **Default:** dark `surface` slightly lifted off `page` (production deltas are subtle —
  `#1A1011`→`#241619`-style, not stark contrast blocks), `shadow.sm` from-darkness.
  **Must not** use bright white cards on a dark page — that's a `bold`/dark-mode move,
  not luxury; it shatters the "dim room" illusion.
- **Hover (cards/images):** **should** brighten via a soft `primary`-tinted glow border
  or a slow, subtle scale (~1.01) — restrained motion, never a snap. Luxury's
  micro-interactions **must** read as "considered", which usually means *slower* easing
  than other moods (`/make-interfaces-feel-better` — favor 300ms+ ease-out here).
- **Hover (CTA/buttons):** **should** intensify the metallic `primary` (more saturation,
  not more brightness) — a "catching the light" effect rather than a color swap.
- **Focus-visible:** **must** render a ring in `primary` (the gold/jewel accent reads
  clearly against dark `page`/`surface` — production ink/page contrast 14.29–16.91:1
  gives plenty of room). Don't default to a generic blue ring; it breaks the palette.
- **Active/pressed:** **should** dim slightly rather than scale — restraint over bounce.
- **Disabled:** **must** drop to `muted` on `surface`, keeping the dark-stage feel —
  **must not** invert to a light disabled-state block (jarring against luxury's page).
- **Loading/empty:** **should** stay dark with a subtle `primary`-tinted shimmer —
  a stark white loading skeleton is the single fastest way to break luxury's immersion.

## 5. Accessibility (promote scorecard bars to upfront guidance)
- [ ] Text/bg contrast **must** be ≥ 4.5:1 (production floor for this mood: see §2 above)
- [ ] Focus rings **must** be visible against `surface` and `primary`
- [ ] Touch targets (CTAs) **must** be ≥ 44px
- [ ] Motion **must** respect `prefers-reduced-motion`
- **Mood-specific (dark-page family):** luxury is the *only* mood that's universally
  dark-page. That's an accessibility asset (ink/page contrast is the strongest of any
  mood, 14.29–16.91:1) — but `muted` text on `surface` needs the same vigilance warm
  flagged for cream-on-cream: **must** verify `muted`/`surface`, not just `ink`/`page`.
- **`onPrimary`/`primary` is solid here** (production floor 3.96:1, near the 4:1 target)
  — the metallic-accent convention naturally produces enough contrast against dark
  surfaces. Keep it that way: **must not** lighten `primary` toward pastel — that's
  the move that would simultaneously break the mood AND the contrast floor.
- **Reduced motion matters more here, not less** — luxury's slower, more deliberate
  animations (per States above) can feel *more* disorienting to motion-sensitive users
  if not gated by `prefers-reduced-motion`, since they linger longer on screen.
