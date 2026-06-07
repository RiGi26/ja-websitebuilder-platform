---
mood: bold
source: gen-design-rules.test.ts (derived from THEME_PACKS — 14 tema currently using this mood)
status: AUTHORED (2026-06-07) — derived data + must/should rules, states, layout guidance, a11y written.
---

# Design Rules — mood: `bold`

> Anchored to **14 production themes** currently tagged `mood: 'bold'`:
> `kuliner-modern`, `fashion-vibrant`, `gadget-neon`, `anak-pop`, `warung-sambal`, `kursus-energi`, `kreator-pop`, `coach-energi`, `agency-bold`, `kendaraan-kuning`, `media-merah`, `niche-pop`, `luar-pop`, `preorder-energi`

## 1. Mission
**Bold = energy you can feel before you read a word.** This mood shouts (politely) —
for brands selling momentum: street-food/modern F&B, gadgets/tech, kids' products,
courses/bootcamps, anything that wants to feel *now* rather than *established*. Punchy
single-hue accents (orange/magenta/cyan), heavyweight type (900), aggressive negative
tracking, high-contrast staging. The page should feel like a poster, not a brochure.

## 2. Style foundations (derived from real tokens — anchor must-rules to these)

**Contrast already in production (ink vs page):** min 16.83:1 · max 19.80:1 · n=14
**Contrast already in production (onPrimary vs primary):** min 3.46:1 · max 7.11:1 · n=14
> Bar from `THEME_VISUAL_PIPELINE.md` §3.2: **must** be ≥ 4.5:1. Use the ranges
> above as the proven floor for new themes in this mood — don't go below the min.

| theme id | primary | page | ink |
|---|---|---|---|
| `kuliner-modern` | `#E2582B` | `#FFFFFF` | `#1A1A1A` |
| `fashion-vibrant` | `#5B2BE8` | `#FFFFFF` | `#0A0A0A` |
| `gadget-neon` | `#D946EF` | `#0A0712` | `#F2ECFB` |
| `anak-pop` | `#E5318F` | `#FFFFFF` | `#2A0E22` |
| `warung-sambal` | `#D62828` | `#FFFCFA` | `#2A1310` |
| `kursus-energi` | `#DC4220` | `#FFFFFF` | `#1F1410` |

**Radius scale in use:**
**sm:** 12px / 14px / 16px / 18px / 6px / 8px  
**md:** 10px / 12px / 18px / 20px / 22px / 24px / 28px  
**lg:** 14px / 18px / 24px / 28px / 30px / 32px / 36px

**Font pairing patterns in use:**
- sama · display 900 / body 400 / tracking -0.03em — ×1
- campur · display 900 / body 400 / tracking -0.035em — ×7
- sama · display 900 / body 400 / tracking -0.025em — ×2
- campur · display 900 / body 400 / tracking -0.03em — ×2
- campur · display 900 / body 400 / tracking -0.04em — ×1
- sama · display 800 / body 400 / tracking -0.02em — ×1

**Rules (anchored to the table above):**
- Display weight **must** be 800–900 with tracking ≤ −0.025em — this is the mood's
  most consistent signature (12/14 themes hit `display: 900`). A bold theme at
  `display: 700` with loose tracking is a contradiction; that's `clean` borrowing energy
  it hasn't earned. **Should** target 900/−0.03em as the center of the range.
- `primary` **should** be a single saturated, high-energy hue (orange `#E2582B`,
  magenta `#D946EF`, cyan family) — **must not** be muted/desaturated; that's `minimal`
  or `clean` territory. The saturation IS the energy signal.
- **`onPrimary`/`primary` is this mood's known soft spot** — production sits at
  3.46–4.34:1 (white text on saturated mid-tone hues), all below the 4.5:1 normal-text
  bar though most clear the 3:1 large-text floor. New bold themes **must** treat CTA
  text as large/bold by construction (it already is, per the typography rule above) —
  but **should** still nudge `onPrimary`/`primary` toward 4:1+ where the hue allows
  (e.g. darken `primary` by ~5–8% — barely perceptible, meaningfully safer).
- `page` **can** go either way (light & punchy like `kuliner-modern`'s white, or dark
  & moody like `bold-energetic`'s near-black) — bold is the one mood that spans both;
  what stays constant is the *contrast intensity*, not the page's lightness.

## 3. Layout guidance (derived — which archetypes this mood actually uses)

- **Hero:** `centered` ×10, `split` ×3, `fullbleed` ×1
- **Features:** `grid` ×13, `rows` ×1
- **Padding:** `normal` ×13, `airy` ×1
- **Alignment:** `center` ×10, `left` ×4

- **Hero `centered`** dominates (10/14) — a single big, loud statement dead-center hits
  harder than a balanced 2-column layout; bold wants impact, not nuance. **Should**
  default here. `split` (3/14) suits brands that need to pair the energy with a concrete
  product shot (gadgets); `fullbleed` (1/14) is the rare maximal move — **must not**
  become a default, it's a specialty card to play once per sub-kategori for VARIASI.
- **Features `grid`** is near-universal (13/14) — punchy cards in a scannable grid keep
  the energy moving without becoming chaotic. **Should** default to `grid`.
- **`pad: normal`** is near-universal (13/14) — bold compresses space to keep momentum;
  airy padding slows the eye down, undercutting the "now, now, now" pacing. **Must**
  default to `normal`; reserve `airy` only if a specific sub-brand needs a calmer beat.
- **`align: center`** dominates (10/14), pairing with `centered` hero for a poster-like
  symmetry. `left` (4/14) pairs with `split`/`fullbleed` — keep them paired (per the
  cross-mood rule already noted in `warm`/`clean`).

## 4. States
- **Default:** high-contrast `surface`/`page` pairing, `shadow.sm` carrying a
  `primary`-tinted glow (production examples use `rgba(234,88,12,…)`-style colored
  shadows, not neutral black) — **should** tint shadows with `primary`; neutral shadows
  read flat/generic against bold's saturated palette.
- **Hover (cards/CTA):** **must** be the snappiest of any mood — quick scale (~1.03–1.05)
  and/or a shadow jump straight to `lg`. Bold's whole identity is energy; a slow,
  considered hover (luxury's approach) would feel like a bug, not a choice.
- **Focus-visible:** **must** render a high-contrast ring — given bold's saturated
  `primary` may sit close to `page` in some palettes, **should** consider an `onPrimary`
  or `ink` ring as a fallback if `primary`-on-`page` contrast is borderline.
- **Active/pressed:** **should** snap to scale ~0.96 with an immediate shadow drop —
  punchy, not eased. Matches the "poster, not brochure" mission.
- **Disabled:** **must** drop saturation hard — to `muted`/`border` — the visual
  "off" cue needs to be as loud as the "on" state is, or it won't read as disabled
  in a palette this saturated.
- **Loading/empty:** **should** keep a `primary`-tinted pulse/shimmer rather than a
  neutral gray skeleton — even "nothing here yet" should carry the brand's energy.

## 5. Accessibility (promote scorecard bars to upfront guidance)
- [ ] Text/bg contrast **must** be ≥ 4.5:1 (production floor for this mood: see §2 above)
- [ ] Focus rings **must** be visible against `surface` and `primary`
- [ ] Touch targets (CTAs) **must** be ≥ 44px
- [ ] Motion **must** respect `prefers-reduced-motion`
- **Mood-specific:** bold is the mood most likely to *want* a contrast fight (saturation
  vs. legibility) — that tension is the design challenge here, not a side-effect.
  **Must** resolve it in favor of legibility every time: a slightly-less-punchy hue
  that clears 4:1 beats a perfect hue that fails at 3.4:1.
- **`onPrimary`/`primary` needs explicit checking before lock-in** (§2: production
  range 3.46–4.34, the tightest "barely passing" cluster of any mood). **Must** run
  the contrast check at DEFINE time, not discover it at the VERIFY scorecard — by then
  the palette feels "final" and fixes feel like compromises.
- **Motion-sensitivity matters more here than the mission suggests** — bold's snappy,
  high-frequency micro-interactions (per States) are exactly the kind that trigger
  vestibular discomfort. `prefers-reduced-motion` **must** swap to instant/no-transition
  states, not just "slower" ones.
