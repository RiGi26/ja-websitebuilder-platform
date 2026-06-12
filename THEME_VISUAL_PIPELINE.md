# THEME VISUAL PIPELINE — ui-ux-pro-max + Playwright

> **Durable companion to `THEME_SYSTEM_PLAN.md`.** Defines *how* the two new skills
> (`ui-ux-pro-max`, Playwright visual-review) plug into the existing 7-step playbook (§5)
> and 3-skill gate (§5.a) — to fix the recurring "UI kurang menarik" problem.
> Disusun 2026-06-07.
>
> **⚠️ ERA BESPOKE (2026-06-12): baca §7 dulu.** Library 96 composable = legacy
> (keputusan owner); pipeline ini kini menjadi **gerbang kelahiran setiap tema
> BESPOKE baru**. §1–§6 tetap berlaku sebagai mekanika dasar; §7 mendefinisikan
> scope baru + jalur capture yang bisa dijalankan agen secara mandiri + ledger.

---

## 0. The problem this solves

The §5.a gate (`/ui-design` · `/make-interfaces-feel-better` · `/website-review`) runs on
**code** — principles applied while building. Three leaks let "kurang menarik" (and its
quieter cousin "inconsistent") through:

1. **Input leak (DEFINE):** palettes + font pairings are invented ad-hoc → drift to generic.
2. **Feedback leak (VERIFY):** screenshots reviewed *by eye*, not scored → no objective bar.
3. **Constraint leak (DEFINE→POLISH):** "principles applied while building" has no
   *written, mood-specific* form to check against — each theme re-derives "what does
   warm/luxury/bold look like" from memory, which is exactly how drift creeps in
   (see `THEME_SYSTEM_PLAN.md` S1 log: "User pribadi suka HERITAGE — TAPI bukan acuan").

Three tools/artifacts, plugged into exactly those leaks (nowhere else):

| Tool | Role | Where it plugs in |
|---|---|---|
| **ui-ux-pro-max** | Curated DB (161 palettes · 57 font pairings · 50+ styles) **+** a scorecard | Step 1–2 (front) **and** Step 7 (back) |
| **Playwright** | The eyes — auto-screenshot 3 viewports | Step 7 only (feeds the scorecard) |
| **`design-rules/<mood>.md`** | Written must/should constraint doc per mood (TypeUI-anatomy adoption — tokens + layout + states + a11y, anchored to real production data, see `src/lib/theme-system/design-rules/`) | Step 2 (front, cross-check) **and** Step 5+7 (back, concrete checklist) |

> This does **not** replace the 3-skill gate. The gate scores *code* across 3 lenses
> (tampilan·rasa·pesan). This pipeline adds a **4th lens applied to pixels: "terbukti"** —
> proven desirable in the rendered output, across breakpoints.

---

## 1. The scheme — overlay on playbook §5

```
PLAYBOOK STEP          BASE (unchanged)            + NEW THIS PIPELINE
─────────────────────────────────────────────────────────────────────────
1. RESEARCH    visual refs for niche       → ui-ux-pro-max: pull STYLE + PALETTE
                                              + FONT-PAIRING per gaya (front lookup)
2. DEFINE      3 manifests (token+variant) → lock tokens FROM the DB, not invented
                                              → cross-check against design-rules/<mood>.md
                                              (must-rules non-negotiable, should-rules guide pick)
3. BUILD       new section variants         (unchanged)
4. SEED        sample content               (unchanged)
5. POLISH      3-skill gate §5.a            → grade against design-rules/<mood>.md
                                              §4 States + §5 A11y as a concrete checklist
6. WIRE        register taxonomy + filter   (unchanged)
7. VERIFY      SSR render + perf checklist  → Playwright SHOOT 3 viewports
                                              → ui-ux-pro-max SCORECARD on pixels
                                              → each bar traces to a numbered "must" in
                                                design-rules/<mood>.md §2/§5
                                              → iterate until pass (the loop)
```

ui-ux-pro-max appears **twice** (choose at front, score at back). Playwright appears
**once** (capture for the back loop). `design-rules/<mood>.md` appears **twice** too —
front as a cross-check at DEFINE, back as the checklist POLISH/VERIFY grade against —
closing the loop between "what we said we'd build" and "what we shipped". Everything
else stays as-is.

---

## 2. Front half — ui-ux-pro-max as the DB (Step 1–2)

**Goal:** stop inventing palettes/fonts. Pull from the curated DB so each of the 3 gaya
in a sub-kategori is distinct *by construction* (serves VARIASI #6).

**Per sub-kategori (covers all 3 gaya in ONE pass):**

1. Invoke `ui-ux-pro-max`. Query its DB for the niche → it returns ranked
   **style + palette + font-pairing** candidates per product type.
2. For the 3 gaya, pick **3 deliberately spread** entries (terang↔gelap, ramai↔minimal,
   hangat↔elegan). The DB's 161 palettes make a real spread easy — no cloning the
   personal-favorite heritage (prinsip #6).
3. Translate the chosen palette + pairing into the existing `theme-packs.ts` token shape.
   The DB is the **source**, `theme-packs.ts` stays the **store**. No new files.
4. **Cross-check against `design-rules/<mood>.md` §2–3** before locking the pack: does
   the picked palette/pairing/layout violate any **must**-rule (e.g. luxury page must
   stay dark, warm page must stay cream, bold display-weight must hit 800–900)? A DB
   pick that clears ui-ux-pro-max but breaks a mood's must-rule still needs a swap —
   the DB supplies *candidates*, the design-rules file supplies the *mood contract*.

**Output of front half:** 3 token-packs whose colors + fonts came from a curated DB
*and* passed the mood's written contract — not memory, and not "looks fine to me".
This is where most of the "menarik" lift comes from — good raw palettes, mood-true.

---

## 3. Back half — Playwright + scorecard (Step 7, the loop)

**Goal:** turn "kurang menarik" from a vibe into pass/fail findings on real pixels.

### 3.1 Capture (Playwright)

> **Decision (2026-06-07):** the `/admin/theme-preview/[themeId]` route needs admin auth
> (cookie + `ADMIN_SESSION_SECRET`), which would mean running the dev server + minting a
> token. The `theme-samples/<id>.html` files are **fully self-contained** (inline CSS +
> token vars, system fonts), so we screenshot them via `file://` instead — no server, no
> auth, faster. `scripts/shoot-themes.mjs` does exactly this.

```
1. Ensure theme-samples/<themeId>.html exists (the render artifact).
2. node scripts/shoot-themes.mjs <themeId> [<themeId> ...]
   → writes theme-samples/<themeId>-{mobile,tablet,desktop}.png  (375/768/1440)
3. Claude reads the PNGs and runs §3.2 on them.
```

The script freezes CSS entrance animations (stagger fade-up) so each shot captures the
settled state, and uses `deviceScaleFactor: 1` to keep file/token size down.

> **Remaining seam (wire when S7 starts):** generating `theme-samples/<id>.html` for a
> *brand-new* theme. The 9 existing samples were produced during the Klinik sprint; a small
> generator (SSR `ComposableRenderer` → static HTML + the inline `.ce-*` CSS) would let the
> capture step run on any registered theme id. Not needed for the smoke test (existing HTML).

### 3.2 Scorecard (ui-ux-pro-max, applied to the screenshots)

Score each flagship against ui-ux-pro-max's priority categories — but **on the rendered
pixels**, not the code. Pass bar = all CRITICAL/HIGH green, ≤1 MEDIUM amber. Each row
now traces back to a numbered **must**-rule in `design-rules/<mood>.md` — the scorecard
isn't a separate opinion, it's the same contract checked on pixels instead of tokens.

| # | Category | What to check in the screenshot | Bar | Traces to `design-rules/<mood>.md` |
|---|---|---|---|---|
| 1 | Accessibility | text/bg contrast reads ≥4.5:1; focus rings visible | CRITICAL | §5 a11y checklist + §2 onPrimary/primary floor |
| 2 | Touch & interaction | CTAs look ≥44px; clear primary vs secondary | CRITICAL | §5 a11y checklist (touch targets) |
| 4 | **Style match** | does it *look* like the niche + chosen style? distinct from the other 2 gaya? | HIGH | §1 Mission + §3 layout-archetype rules (e.g. luxury must be `fullbleed`+`left`) |
| 5 | Layout & responsive | no overflow/clipping at 375; container sane at 1440 | HIGH | §3 layout guidance (hero/features/pad/align "must" defaults) |
| 6 | Typography & color | hierarchy by size/weight (not color); pairing reads on-brand | MEDIUM | §2 style-foundations rules (display weight, tracking, page-color family) |
| — | **Signature moment** | is there ONE memorable beat? (Phase 2.5) or is it a flat stack? | the "menarik" gate | §4 States (hover/focus "should" rules — where the memorable beat usually lives) |

Output findings in the §Output-Format buckets (Critical/High/Medium/Quick-Win) with the
viewport + what to change. Feed fixes back into tokens/blocks → re-shoot → re-score.

### 3.3 The loop, bounded

```
shoot → score → if not pass: fix tokens/blocks → re-shoot ONLY changed flagship → score
```

Stop when flagship passes the bar, or after **2 iterations** (diminishing returns — escalate
to user with the screenshots if still failing).

---

## 4. Token budget & gating (so cost stays sane)

Per the cost analysis (skills load full body only when invoked; screenshots ≈1–1.6k tok each):

| Trigger | What loads | Gate |
|---|---|---|
| Step 1–2, per **sub-kategori** | ui-ux-pro-max body (~6.8k tok) **once** | NOT per gaya — one lookup covers all 3 |
| Step 7, per **sprint** | Playwright shots: **3 flagship × 3 viewports = 9** | NOT all 9 themes — flagship only |
| Iterate | re-shoot **only the changed flagship** | not the full set |

Rule of thumb: **one ui-ux-pro-max load + ~9–15 screenshots per sub-kategori sprint.**
Never load ui-ux-pro-max alongside `/ui-design` as a parallel gate — it's a *lookup/scorer*,
invoked at its two steps, then done.

---

## 5. Prasyarat — one-time tooling setup (NOT a theme sprint)

> This is **tooling install**, orthogonal to `THEME_SYSTEM_PLAN.md`'s sprint numbering.
> That plan's Sprint 0 (composable engine + taksonomi) is already DONE; the program is now
> at **Sprint 7**. The steps below are a one-time prerequisite, run once, then this pipeline
> is simply *applied inside playbook §5* from Sprint 7 onward — no new sprint number.

- [x] Activate `ui-ux-pro-max` as a command — copied to `.claude/commands/ui-ux-pro-max.md` (2026-06-07).
- [x] `npm i -D playwright` + `npx playwright install chromium` — done.
- [x] Add `scripts/shoot-themes.mjs` — done (file:// capture, 3 viewports, anim-freeze).
- [x] `theme-samples/*.png` added to `.gitignore`.
- [x] Smoke test on `umum-bluecare` — 3 PNGs generated, content/images render correctly.

**Prasyarat DONE (2026-06-07).** Pipeline ready to apply inside playbook §5 from Sprint 7.

- [x] §3.1 seam — HTML generator for brand-new themes: `src/lib/theme-system/gen-samples.test.tsx`
  (env-gated `GEN_SAMPLES`, SSR `ComposableRenderer` → `theme-samples/<id>.html` + index).
  `GEN_SAMPLES=all npx vitest run src/lib/theme-system/gen-samples.test.tsx`. Done 2026-06-07.

**PIPELINE HIDUP — pertama dipakai penuh di Sprint 7 (Sekolah, 2026-06-07).** Front: ui-ux-pro-max
DB → palet/pairing 9 gaya (kontras ≥4.5:1). Back: shoot 6 gaya ×3 viewport → scorecard PASS
(semua CRITICAL/HIGH hijau, no iterate). Berlaku di playbook §5 tiap sprint berikutnya.

---

## 6. Definition of done (this pipeline)

- A sub-kategori's 3 token-packs trace to ui-ux-pro-max DB entries (not invented).
- Each flagship has a 3-viewport screenshot set + a scorecard pass recorded.
- The §5.a 3-skill gate still runs (code lenses) **and** the pixel scorecard passes
  (the 4th lens, "terbukti").
- Net cost stayed within §4 budget.

---

## 7. ERA BESPOKE (2026-06-12) — scope baru + jalur agen mandiri

**Konteks:** owner memutuskan library 96 composable tidak dipakai sebagai arah produk
(terlalu generik). Semua kerja tema = **bespoke renderer** (quality bar = Toko Atelier),
1 tema/sub-kategori/sprint. Pipeline ini menjadi **gerbang wajib kelahiran tiap tema
bespoke** — bukan alat audit library lama.

### 7.1 Apa yang berubah dari §1–§6

| Aspek | Dulu (composable) | Sekarang (bespoke) |
|---|---|---|
| Unit kerja | 3 gaya / sub-kategori | **1 tema** / sub-kategori (workflow owner 2026-06-11) |
| Token store | `theme-packs.ts` | CSS vars di renderer tema (`--ta-*`, `--kl-*`, …) |
| Generator HTML | `gen-samples.test.tsx` (vitest, user-run) | **+ runner tsc+node** (agen-mandiri): pola `scripts/gen-atelier-entry.tsx` + `scripts/run-gen.cjs` |
| Capture | `npm run shoot` (Playwright, user-run) | **+ `npm run shoot:chrome`** (Chrome terpasang, agen-mandiri) |
| Anti-duplikat | VARIASI antar 3 gaya | **`DESIGN_LEDGER.md`** — cek di DEFINE, tambah baris di PR tema |

### 7.2 Loop agen-mandiri (terbukti end-to-end 2026-06-12 pada toko-atelier)

```
1. GEN    npx tsc -p scripts/tsconfig.gen-<tema>.json
          node [.tmp-gen-<tema>/]scripts/gen-<tema>-entry.js   (alias @/ → pakai run-gen.cjs)
2. SHOOT  npm run shoot:chrome -- <id>          → fold view 375/768/1440 (detail per-section)
          npm run shoot:chrome -- <id> --full   → full-page overview (100vh dipatok 820px)
3. READ   agen MEMBACA PNG → scorecard §3.2 (CRITICAL/HIGH wajib hijau)
4. FIX    iterate ≤2× (batas §3.3), re-shoot hanya yang berubah
```

Catatan: `--full` untuk komposisi keseluruhan; **penilaian detail (kontras, typography,
touch target) pakai mode fold** — gambar full-page ter-downscale saat dibaca agen.
`npm run shoot` (Playwright) tetap ada untuk verifikasi user di mesin lokal.

### 7.3 Urutan gerbang tiap sprint tema bespoke

```
DEFINE   riset arah unik → CEK DESIGN_LEDGER.md (font/hero/motif/signature belum terpakai)
         → ui-ux-pro-max DB utk kandidat palet+pairing → kontrak design-rules/<mood>.md
BUILD    renderer bespoke (+ mode sparse — pelajaran #132) + contrast self-test
GATE-1   3-skill (kode): /ui-design + /make-interfaces-feel-better + /website-review
GATE-2   pixel (§7.2): shoot → scorecard → iterate ≤2×
LEDGER   tambah baris tema di DESIGN_LEDGER.md (dalam PR yang sama)
REVIEW   HTML sample + screenshot ke owner → PR → CI → merge atas perintah owner
```

### 7.4 Loop pelajaran (UAT → aturan)

Temuan visual/UX dari UAT atau order nyata → catat di `DESIGN_LEDGER.md`
§Pelajaran **sekaligus** tanam aturannya di `design-rules/<mood>.md` / checklist
brief / renderer. Pelajaran yang tidak ditanam = akan terulang.
