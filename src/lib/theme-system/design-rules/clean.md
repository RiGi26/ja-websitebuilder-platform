---
mood: clean
source: gen-design-rules.test.ts (derived from THEME_PACKS — 19 tema currently using this mood)
status: AUTHORED (2026-06-07) — derived data + must/should rules, states, layout guidance, a11y written.
---

# Design Rules — mood: `clean`

> Anchored to **19 production themes** currently tagged `mood: 'clean'`:
> `kecantikan-blush`, `gadget-studio`, `herbal-daun`, `anak-ceria`, `cafe-latte`, `umum-bluecare`, `estetik-derma`, `reguler-cerdas`, `islami-hijau`, `profesional-korporat`, `startup-aurora`, `agency-prisma`, `korporat-biru`, `kendaraan-bersih`, `wisata-tropis`, `media-biru`, `niche-hijau`, `luar-global`, `lokal-segar`

## 1. Mission
**Clean = trustworthy & approachable.** This is the "I can rely on you" mood — for
brands where credibility beats charisma: clinics, schools, gadgets, corporate/agency,
travel, beauty/skincare. Bright pages, crisp single-accent palettes, confident sans
typography. The page should feel like a well-run front desk: nothing hidden, nothing
fussy, easy to act on. Where `warm` says "come in, sit down", clean says "yes, we can
help — here's how".

## 2. Style foundations (derived from real tokens — anchor must-rules to these)

**Contrast already in production (ink vs page):** min 12.44:1 · max 19.14:1 · n=19
**Contrast already in production (onPrimary vs primary):** min 2.60:1 · max 8.72:1 · n=19
> Bar from `THEME_VISUAL_PIPELINE.md` §3.2: **must** be ≥ 4.5:1. Use the ranges
> above as the proven floor for new themes in this mood — don't go below the min.

| theme id | primary | page | ink |
|---|---|---|---|
| `kecantikan-blush` | `#D98A9E` | `#FFF6F4` | `#3D2B30` |
| `gadget-studio` | `#0071E3` | `#FFFFFF` | `#111316` |
| `herbal-daun` | `#4E944F` | `#F4F8EF` | `#1F2A1C` |
| `anak-ceria` | `#2BA8E0` | `#F6FBFF` | `#1F2A44` |
| `cafe-latte` | `#9C6B4A` | `#FBF7F1` | `#2A211B` |
| `umum-bluecare` | `#1E6FE0` | `#F4F9FF` | `#14233A` |

**Radius scale in use:**
**sm:** 10px / 12px / 14px / 16px / 8px  
**md:** 12px / 14px / 16px / 18px / 20px / 22px / 24px  
**lg:** 18px / 20px / 22px / 24px / 26px / 28px / 30px / 32px

**Font pairing patterns in use:**
- campur · display 600 / body 400 / tracking -0.01em — ×2
- sama · display 800 / body 400 / tracking -0.03em — ×6
- sama · display 700 / body 400 / tracking -0.02em — ×2
- sama · display 800 / body 400 / tracking -0.02em — ×1
- sama · display 600 / body 400 / tracking -0.02em — ×1
- campur · display 800 / body 400 / tracking -0.03em — ×2
- campur · display 700 / body 400 / tracking -0.01em — ×2
- campur · display 900 / body 400 / tracking -0.035em — ×1
- sama · display 700 / body 400 / tracking -0.025em — ×2

**Rules (anchored to the table above):**
- `page` **must** stay near-white (`#FFFFFF`–`#F6FBFF` band) — clean's entire trust signal
  rests on bright, uncluttered space. Anything past `#F4F8EF`-level tinting starts
  reading as `warm` or `minimal`; keep tints whisper-light.
- Pick **one confident accent `primary`** per theme (blue/green/pink/brown — all single-hue,
  none of the production examples mix two accent families). **Must not** introduce a
  second saturated accent — clean earns trust through restraint, not variety.
- `onPrimary`/`primary` contrast is this mood's **known weak spot** — production ranges
  2.60–8.72:1, several sit at the large-text-only floor (`kecantikan-blush` 2.60,
  `anak-ceria` 2.70). New themes **must** target ≥ 4:1 here; if the chosen accent is
  pastel/light (blush/pink family), **should** darken `onPrimary` toward `ink` instead
  of forcing pure white — don't let the palette choice create an a11y debt.
- Typography is **overwhelmingly sans+sans** (13/19 `sama` rows) at confident weights
  (700–900) with tight tracking (−0.02em to −0.03em). Display/body **should** share the
  same family — mixing in a serif tips the brand toward `luxury` and undercuts the
  "modern, no-nonsense" read clean is going for.

## 3. Layout guidance (derived — which archetypes this mood actually uses)

- **Hero:** `split` ×14, `centered` ×5
- **Features:** `grid` ×19
- **Padding:** `normal` ×14, `airy` ×5
- **Alignment:** `left` ×14, `center` ×5

- **Hero `split`** is the dominant choice (14/19) — a 2-column layout puts copy
  (the trust pitch: "what we do, why it matters") beside an image/illustration, which
  is exactly the "explain yourself clearly" posture clean wants. **Should** be the
  default for service/institutional brands (clinic, school, corporate, gadget).
  `centered` (5/19) suits simpler single-offer brands (e.g. `cafe-latte`) — **should not**
  become the default; it loses the "here's our pitch, here's proof" two-beat rhythm.
- **Features `grid` is universal here (19/19)** — no exceptions in production. This is
  the one layout choice that **must** stay `grid` for clean: scannable feature cards
  ARE the trust-building mechanism (services/programs/specs laid out for comparison).
- **`pad: normal`** dominates (14/19) — clean is brisk, not languorous; airy spacing
  (5/19) is reserved for premium-leaning sub-brands (`profesional-korporat`,
  `agency-prisma`). Default to `normal`.
- **`align: left`** dominates (14/19), pairing naturally with `split` hero — reads as
  organized/documentary rather than ceremonial. **Must** keep `split`+`left` and
  `centered`+`center` paired (don't cross them — see warm's note on the same issue).

## 4. States
- **Default:** crisp `surface` cards on near-white `page`, `shadow.sm` — light, but
  **must not** be flat/borderless; clean still needs depth cues to feel "designed",
  not "default browser".
- **Hover (cards):** **should** lift via `shadow.sm`→`md` + a 1–2px translateY — a
  brisk, businesslike response (not a lazy fade). **Must not** rely on color-shift alone.
- **Hover (CTA/buttons):** **must** darken or saturate `primary` slightly — never
  lighten it; lightening a clean accent often *drops* its already-tight contrast
  further (see §2 weak-spot note).
- **Focus-visible:** **must** render a ≥2px ring in `primary`, offset from the element —
  clean's institutional audiences (clinic/school/corporate) often include
  keyboard-first/assistive-tech users; this is non-negotiable, not a nice-to-have.
- **Active/pressed:** **should** compress scale slightly (~0.98) — fast, decisive feedback.
- **Disabled:** **must** use `muted` on `border`-tinted `surface`; **must not** simply
  lower opacity on the colored button — that often still clears contrast minimums and
  misleads users into thinking it's clickable.
- **Loading/empty:** **should** use skeleton blocks in `border`/`surface` tones, never
  pure gray — staying in-palette keeps the "every pixel is considered" trust signal alive.

## 5. Accessibility (promote scorecard bars to upfront guidance)
- [ ] Text/bg contrast **must** be ≥ 4.5:1 (production floor for this mood: see §2 above)
- [ ] Focus rings **must** be visible against `surface` and `primary`
- [ ] Touch targets (CTAs) **must** be ≥ 44px
- [ ] Motion **must** respect `prefers-reduced-motion`
- **Mood-specific:** clean is *all light-page*, like warm — but pushes brighter
  (`#FFFFFF`–`#F6FBFF` vs warm's cream band). That brightness makes pastel/light accents
  (blush, sky-blue, mint) tempting — and those are exactly the colors that fail
  `onPrimary` contrast (§2). **Must** stress-test any pastel `primary` pick against
  `onPrimary` *before* locking the token-pack — don't assume "looks light and friendly"
  equals "passes a11y".
- **Institutional audiences** (clinic/school/government-adjacent) over-index on
  assistive-tech users. Focus rings and `muted`/`surface` contrast **must** be checked
  with extra care — this mood **must not** treat a11y as a final-pass scorecard item;
  bake it into the DEFINE step.
