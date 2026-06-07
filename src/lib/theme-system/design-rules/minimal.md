---
mood: minimal
source: gen-design-rules.test.ts (derived from THEME_PACKS — 16 tema currently using this mood)
status: AUTHORED (2026-06-07) — derived data + must/should rules, states, layout guidance, a11y written.
---

# Design Rules — mood: `minimal`

> Anchored to **16 production themes** currently tagged `mood: 'minimal'`:
> `fashion-minimal`, `kerajinan-galeri`, `kecantikan-glow`, `rumah-japandi`, `anak-pastel`, `cafe-bloom`, `finedining-nordic`, `umum-freshteal`, `wellness-sage`, `kursus-fokus`, `kreator-clean`, `coach-tenang`, `startup-mint`, `akomodasi-resort`, `jurnal-mono`, `preorder-fokus`

## 1. Mission
**Minimal = let the work speak.** This mood steps back so the *content* (the dish, the
craft, the program, the person) becomes the only thing worth looking at. It belongs to
brands secure enough to not need decoration: galleries, japandi/scandi home goods,
focus-driven courses, sage/earth wellness, quiet portfolios. Muted, low-saturation
palettes, generous whitespace, understated type. Where `clean` is "trust me, I'm
organized" and `luxury` is "look at how composed I am", minimal simply… doesn't perform.

## 2. Style foundations (derived from real tokens — anchor must-rules to these)

**Contrast already in production (ink vs page):** min 8.79:1 · max 18.09:1 · n=16
**Contrast already in production (onPrimary vs primary):** min 2.49:1 · max 18.88:1 · n=16
> Bar from `THEME_VISUAL_PIPELINE.md` §3.2: **must** be ≥ 4.5:1. Use the ranges
> above as the proven floor for new themes in this mood — don't go below the min.

| theme id | primary | page | ink |
|---|---|---|---|
| `fashion-minimal` | `#1C1B19` | `#FAFAF8` | `#1C1B19` |
| `kerajinan-galeri` | `#8A6D3B` | `#FAF8F4` | `#211D18` |
| `kecantikan-glow` | `#BD9A5F` | `#FFFFFF` | `#2A2622` |
| `rumah-japandi` | `#6B6657` | `#F4F3EF` | `#2B2A26` |
| `anak-pastel` | `#8FC9C2` | `#FBF7FF` | `#4A4458` |
| `cafe-bloom` | `#E08CA0` | `#FFF8F4` | `#3A2B30` |

**Radius scale in use:**
**sm:** 10px / 12px / 14px / 18px / 6px / 8px  
**md:** 10px / 12px / 14px / 16px / 18px / 20px / 26px  
**lg:** 14px / 16px / 18px / 20px / 22px / 24px / 28px / 34px

**Font pairing patterns in use:**
- sama · display 600 / body 400 / tracking -0.02em — ×8
- sama · display 700 / body 400 / tracking -0.01em — ×1
- sama · display 700 / body 400 / tracking -0.015em — ×1
- sama · display 700 / body 400 / tracking -0.02em — ×1
- campur · display 800 / body 400 / tracking -0.03em — ×2
- campur · display 800 / body 400 / tracking -0.04em — ×1
- sama · display 700 / body 400 / tracking -0.025em — ×1
- campur · display 700 / body 400 / tracking -0.03em — ×1

**Rules (anchored to the table above):**
- `primary` **should** be desaturated/earthy (sage `#6E8B5A`, rose-dust `#E08CA0`,
  ochre `#8A6D3B`, slate `#6B6657`) — **must not** be a saturated, attention-grabbing
  hue; that's `bold`'s job. The accent should feel like *one tone among several*, not
  a beacon. If the chosen color would work in `bold`, it's the wrong color for `minimal`.
- **`onPrimary`/`primary` is this mood's most acute weak spot** — production ranges
  2.49–18.88:1 with the *lowest single value of any mood* (`cafe-bloom` 2.49, a pastel
  rose on near-white). Desaturated/pastel accents are exactly the colors most likely to
  fail here. **Must** check this pairing before locking any minimal palette — **should**
  default to using `ink` (not `onPrimary`-as-white) for text on light/pastel `primary`
  buttons; reserve white `onPrimary` for the darker, more saturated end of the range.
- Typography **should** stay sans+sans at moderate weight (600–700, the dominant
  pattern — 11/16 `sama` rows) with gentle tracking (−0.01 to −0.02em). **Must not**
  go to display 800–900 — that injects `bold`'s energy where minimal wants quiet.
- Radius and shadow **can** range moderate-to-generous (this mood doesn't police those
  as tightly as `luxury` does) — softness here reads as "considered ease", not "playful".

## 3. Layout guidance (derived — which archetypes this mood actually uses)

- **Hero:** `split` ×9, `centered` ×7
- **Features:** `grid` ×16
- **Padding:** `airy` ×14, `normal` ×2
- **Alignment:** `left` ×9, `center` ×7

- **Hero is the one near-even split in the whole system** (`split` 9 vs `centered` 7) —
  minimal is comfortable in either posture; **either is acceptable**, picked per
  sub-brand character (editorial-leaning → `split`; product/portfolio-focus → `centered`).
  This flexibility is itself a signature: minimal doesn't need a "house style" of hero
  to feel coherent — the *palette restraint* carries the identity, not the layout.
- **Features `grid` is universal (16/16)** — same as `clean`. Cards in a quiet grid let
  the work be the visual content; **must** default to `grid`.
- **`pad: airy` dominates heavily** (14/16) — minimal's whitespace is not a luxury
  flourish (as in `luxury`) but the literal mechanism of "let the work breathe".
  **Should** default to airy; `normal` (2/16) only for content-dense exceptions.
- **Alignment splits with hero** (`left` 9 / `center` 7, mirroring the hero split) —
  **must** keep them paired (`split`+`left`, `centered`+`center`) per the cross-mood rule.

## 4. States
- **Default:** `surface` barely distinguished from `page` (production deltas are subtle —
  `#FAFAF8`/`#FAF8F4`-style near-twins), `shadow.sm` so light it's almost a suggestion.
  **Should** lean on `border` hairlines more than shadow to separate sections — minimal's
  whole point is that structure should be felt, not announced.
- **Hover (cards/images):** **should** be the gentlest of any mood — a faint border-color
  shift or a 1px shadow nudge. **Must not** scale, glow, or saturate; any of those reads
  as the system reaching for attention, which is exactly what minimal refuses to do.
- **Hover (CTA/buttons):** **should** shift `primary` by a hair (slightly darker/more
  saturated) — restrained, almost imperceptible. The goal is "it responded", not "look at me".
- **Focus-visible:** **must** still be clearly visible — minimal's restraint **must not**
  extend to accessibility. A faint ring that vanishes against `surface` (the near-twin
  problem above) is a real risk here; **should** use `ink` or a high-contrast outline,
  not rely on the (often-low-contrast) `primary`.
- **Active/pressed:** **should** be near-instant, minimal feedback — a hairline shift.
- **Disabled:** **must** drop to `muted`/`border` — but verify it's still distinguishable
  from the *default* near-twin `surface`/`page` pairing; minimal's low-contrast palette
  makes "disabled" and "just quiet" easy to confuse if not handled deliberately.
- **Loading/empty:** **should** be the quietest of any mood — a thin pulse line or
  faint skeleton in `border` tone; anything louder breaks character.

## 5. Accessibility (promote scorecard bars to upfront guidance)
- [ ] Text/bg contrast **must** be ≥ 4.5:1 (production floor for this mood: see §2 above)
- [ ] Focus rings **must** be visible against `surface` and `primary`
- [ ] Touch targets (CTAs) **must** be ≥ 44px
- [ ] Motion **must** respect `prefers-reduced-motion`
- **Mood-specific — the central tension:** minimal's whole aesthetic (low-saturation,
  near-twin surface/page, gentle states) is in *active tension* with WCAG's contrast
  requirements. That's not a reason to relax the bar — it's the reason this mood
  **must** get the most deliberate a11y attention of any in the system, not the least.
  "Restraint" is a design choice; "illegible" is a bug wearing restraint as a disguise.
- **`onPrimary`/`primary` is the system-wide worst offender here** (§2: 2.49:1 floor,
  the single lowest pairing across all 5 moods). **Must not** ship a pastel `primary`
  with white `onPrimary` without an explicit contrast check — this is the exact
  failure mode `cafe-bloom` represents; new themes **must** do better, not match it.
- **Focus rings deserve their own design pass** (see States) — the near-twin
  `surface`/`page` convention that makes minimal feel calm is the same trait that can
  make a default-styled focus ring disappear. Treat this as a DEFINE-time decision,
  not a VERIFY-time fix.
