// ============================================================
// THEME DESIGN RULES — scaffold generator (TypeUI-anatomy adoption).
// Groups THEME_PACKS by `mood`, derives concrete data (contrast ratios,
// font pairs, radius/shadow scale, layout-archetype spread) from REAL
// production tokens — same "DB, not memory" posture as the visual pipeline
// (THEME_VISUAL_PIPELINE.md §2). Writes a skeleton .md per mood with the
// derived tables pre-filled + TODO placeholders for the qualitative
// must/should prose (authored separately, see THEME_SYSTEM_PLAN.md §5/§5.a).
//
// SKIP-IF-EXISTS: never overwrites an authored file — once a mood's .md is
// hand-written, this generator just reports "exists, skip". Delete the file
// to regenerate its skeleton from current token data.
//
// GATED via env GEN_DESIGN_RULES so it doesn't run on `npm test`:
//   GEN_DESIGN_RULES=1 npx vitest run src/lib/theme-system/gen-design-rules.test.ts
// ============================================================
import { it } from 'vitest'
import { existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { THEME_PACKS } from './theme-packs'
import type { TokenPack } from '@/lib/design-tokens/packs'

const GEN = process.env.GEN_DESIGN_RULES
const OUT_DIR = 'src/lib/theme-system/design-rules'

const MOODS = ['clean', 'luxury', 'warm', 'bold', 'minimal'] as const
type Mood = (typeof MOODS)[number]

// ── WCAG contrast helpers (relative luminance, sRGB) ─────────────────────
function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function relLuminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
function contrastRatio(hexA: string, hexB: string): number | null {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  if (!a || !b) return null // skip rgba()/gradient strings — only solid hex compared
  const [l1, l2] = [relLuminance(a), relLuminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}
function fmtRatio(r: number | null): string {
  return r === null ? '—' : `${r.toFixed(2)}:1`
}

// ── Aggregate one mood's packs into derived tables ───────────────────────
function deriveMoodData(mood: Mood, packs: TokenPack[]) {
  const fontPairs = new Map<string, number>()
  const heroCount = new Map<string, number>()
  const featuresCount = new Map<string, number>()
  const padCount = new Map<string, number>()
  const alignCount = new Map<string, number>()
  const radii = { sm: new Set<string>(), md: new Set<string>(), lg: new Set<string>() }
  const inkContrasts: number[] = []
  const primaryContrasts: number[] = []
  const samples: { id: string; primary: string; page: string; ink: string }[] = []

  for (const p of packs) {
    const pairKey = `${p.font.display === p.font.body ? 'sama' : 'campur'} · display ${p.font.displayWeight} / body ${p.font.bodyWeight} / tracking ${p.font.tracking}`
    fontPairs.set(pairKey, (fontPairs.get(pairKey) ?? 0) + 1)
    heroCount.set(p.layout.hero, (heroCount.get(p.layout.hero) ?? 0) + 1)
    featuresCount.set(p.layout.features, (featuresCount.get(p.layout.features) ?? 0) + 1)
    padCount.set(p.layout.pad, (padCount.get(p.layout.pad) ?? 0) + 1)
    alignCount.set(p.layout.align, (alignCount.get(p.layout.align) ?? 0) + 1)
    radii.sm.add(p.radius.sm)
    radii.md.add(p.radius.md)
    radii.lg.add(p.radius.lg)

    const ink = contrastRatio(p.color.ink, p.color.page)
    const prim = contrastRatio(p.color.onPrimary, p.color.primary)
    if (ink !== null) inkContrasts.push(ink)
    if (prim !== null) primaryContrasts.push(prim)
    samples.push({ id: p.id, primary: p.color.primary, page: p.color.page, ink: p.color.ink })
  }

  const fmtCounts = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `\`${k}\` ×${v}`).join(', ')
  const fmtRange = (label: string, set: Set<string>) =>
    `**${label}:** ${[...set].sort().join(' / ')}`
  const minMax = (arr: number[]) =>
    arr.length ? `min ${Math.min(...arr).toFixed(2)}:1 · max ${Math.max(...arr).toFixed(2)}:1 · n=${arr.length}` : '— (gradient/rgba tokens, not solid-hex comparable)'

  return {
    count: packs.length,
    ids: packs.map((p) => p.id),
    fontPairs: [...fontPairs.entries()].map(([k, v]) => `- ${k} — ×${v}`).join('\n'),
    layout: {
      hero: fmtCounts(heroCount),
      features: fmtCounts(featuresCount),
      pad: fmtCounts(padCount),
      align: fmtCounts(alignCount),
    },
    radius: [fmtRange('sm', radii.sm), fmtRange('md', radii.md), fmtRange('lg', radii.lg)].join('  \n'),
    contrastInk: minMax(inkContrasts),
    contrastPrimary: minMax(primaryContrasts),
    samples,
  }
}

function skeletonMd(mood: Mood, data: ReturnType<typeof deriveMoodData>): string {
  const sampleRows = data.samples
    .slice(0, 6)
    .map((s) => `| \`${s.id}\` | \`${s.primary}\` | \`${s.page}\` | \`${s.ink}\` |`)
    .join('\n')
  return `---
mood: ${mood}
source: gen-design-rules.test.ts (derived from THEME_PACKS — ${data.count} tema currently using this mood)
status: SKELETON — derived data only. Author the must/should sections below by hand
  (see THEME_SYSTEM_PLAN.md §5/§5.a — run /ui-design + /make-interfaces-feel-better
  + /website-review while writing, same gate themes themselves pass through).
---

# Design Rules — mood: \`${mood}\`

> Anchored to **${data.count} production themes** currently tagged \`mood: '${mood}'\`:
> ${data.ids.map((i) => `\`${i}\``).join(', ')}

## 1. Mission
<!-- TODO: one paragraph — what this mood communicates and to whom.
     e.g. "Warm = homemade & menggugah selera; for F&B/heritage brands that want
     the customer to feel invited, not sold to." -->

## 2. Style foundations (derived from real tokens — anchor must-rules to these)

**Contrast already in production (ink vs page):** ${data.contrastInk}
**Contrast already in production (onPrimary vs primary):** ${data.contrastPrimary}
> Bar from \`THEME_VISUAL_PIPELINE.md\` §3.2: **must** be ≥ 4.5:1. Use the ranges
> above as the proven floor for new themes in this mood — don't go below the min.

| theme id | primary | page | ink |
|---|---|---|---|
${sampleRows}

**Radius scale in use:**
${data.radius}

**Font pairing patterns in use:**
${data.fontPairs}

<!-- TODO: turn the above into must/should prose, e.g.
     "Primary **must** read ≥ 4.5:1 against \`page\`; **must not** carry body text.
     Display/body **should** pair serif+sans for [X] feel; **must not** mix two serifs." -->

## 3. Layout guidance (derived — which archetypes this mood actually uses)

- **Hero:** ${data.layout.hero}
- **Features:** ${data.layout.features}
- **Padding:** ${data.layout.pad}
- **Alignment:** ${data.layout.align}

<!-- TODO: explain WHY — e.g. "Warm leans \`hero: centered\` — intimacy over editorial
     distance; \`split\`/\`fullbleed\` should be reserved for [other mood] where X." -->

## 4. States
<!-- TODO: default / hover / focus-visible / active / disabled / loading / empty —
     phrase as must/should anchored to this mood's tokens, e.g.
     "Hover **must** shift surface by one shadow step (sm→md), never just opacity."
     This is currently a gap — not encoded in packs.ts or the scorecard. -->

## 5. Accessibility (promote scorecard bars to upfront guidance)
- [ ] Text/bg contrast **must** be ≥ 4.5:1 (production floor for this mood: see §2 above)
- [ ] Focus rings **must** be visible against \`surface\` and \`primary\`
- [ ] Touch targets (CTAs) **must** be ≥ 44px
- [ ] Motion **must** respect \`prefers-reduced-motion\`
<!-- TODO: add mood-specific a11y notes if any (e.g. dark-mood themes — extra care
     on muted-text contrast; light-mood themes — avoid pure white-on-white states). -->
`
}

it.skipIf(!GEN)('generate design-rules skeletons per mood', () => {
  mkdirSync(OUT_DIR, { recursive: true })

  const byMood = new Map<Mood, TokenPack[]>()
  for (const pack of Object.values(THEME_PACKS)) {
    const mood = pack.mood as Mood
    if (!MOODS.includes(mood)) continue
    if (!byMood.has(mood)) byMood.set(mood, [])
    byMood.get(mood)!.push(pack)
  }

  let written = 0
  let skipped = 0
  for (const mood of MOODS) {
    const packs = byMood.get(mood) ?? []
    const path = `${OUT_DIR}/${mood}.md`
    if (existsSync(path)) {
      skipped++
      // eslint-disable-next-line no-console
      console.log(`  skip  ${path} (exists — delete to regenerate skeleton)`)
      continue
    }
    if (packs.length === 0) {
      // eslint-disable-next-line no-console
      console.log(`  warn  ${mood}: 0 themes use this mood yet — skipping`)
      continue
    }
    writeFileSync(path, skeletonMd(mood, deriveMoodData(mood, packs)))
    written++
    // eslint-disable-next-line no-console
    console.log(`  write ${path} (${packs.length} tema)`)
  }
  // eslint-disable-next-line no-console
  console.log(`\n✓ design-rules: ${written} written, ${skipped} skipped (already authored) → ${OUT_DIR}/`)
})
