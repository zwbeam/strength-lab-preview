> Engine integration update — November 25, 2026: preparation selection now lives
> in engine.preparationFor, with movement metadata, owned/familiar light-club
> filtering and unloaded fallback. Existing 8+10 allocations stay unchanged.
> Numerical half-load filtering and specific substitutions are app adaptations;
> the #550/#130/#136 bounded evidence is in research/preparation-engine-evidence.json.
> No whole gate area or physical technique certification is closed by this batch.

> Current policy update — November 25, 2026: the explicit user requirement that
> selected time be a real ceiling supersedes the historical flexibility decisions
> below. All new strength plans use that ceiling. Eight-minute preparation,
> ten-minute app cooldown, complete source intervals and existing flexible drafts
> remain supported. See research/session-ceiling-evidence.json and the current
> time-budget/browser regressions. This does not close the warmup/cooldown gate.

# Warmup / cooldown source-to-engine audit — checkpoint 1

Status: **evidence and implementation inspection incomplete**. This document deliberately separates verified repository descriptions from unverified behavior. Do not mark release-ready on the basis of this checkpoint.

## Confirmed from current repository documents
- `ENGINE-KNOWLEDGE-STATUS.md` describes an engine pipeline of eligibility → program coordination → source-specific prescription → immutable draft → actuals → replay → continuity → persistence.
- `SETTINGS-CONTROLS-AUDIT.md` states the selected session time influences preparation, cooldown and whole-prescription fit, and that active drafts preserve written targets and pacing.
- `TRAINING-RULES.md` identifies source-specific methods and explicitly distinguishes app decisions from transcript-backed rules.
- The documentation does **not** demonstrate a comprehensive source-to-rule audit for warmups and cooldowns. Their research fidelity and full implementation remain unverified.

## Source-to-rule matrix (initial)
| Concern | Current evidence | Required verification | Status |
|---|---|---|---|
| Preparation budget | Settings control audit: duration affects preparation and whole-prescription fit | Inspect generator implementation and 30/45/60-minute output | Not independently verified |
| Movement-specific warmup | No verified source-to-code mapping in available documents | Identify each active family’s chosen preparatory movements and cited source IDs | Open |
| Skill rehearsal | Engine has familiarity/prerequisite gates | Verify rehearsal choice does not confer technique mastery or progression credit | Open |
| Cooldown budget | Settings control audit: cooldown included in duration calculations | Inspect selection, duration, skipping, and active-draft behavior | Not independently verified |
| Source attribution | Evidence files distinguish transcript instruction from app choices | Link every asserted Wildman principle to accessible source evidence; mark gaps | Open |
| Readiness/re-entry | Existing continuity and conservative return-load rules documented | Test warmup/cooldown under low readiness and absence without rewriting history | Open |
| Safety | Pain holds, equipment and geometry gates documented for movement admission | Verify prep/cooldown uses equivalent restrictions and offers safe substitutions | Open |
| Determinism/variety | No documented warmup selection proof | Test repeatability for same input and variation across sessions | Open |

## Engineering contract for next implementation
1. Inspect the actual warmup/cooldown selector and its callers before editing.
2. Preserve source-specific numerical methods; never silently shorten main work to fit accessory preparation.
3. Use a source ID + exact supported claim for any Wildman-attributed rule; label unsourced choices as Strength Lab design.
4. Distinguish general readiness, pattern rehearsal, and optional mobility. Avoid treating preparation as a progression workout.
5. Make preparation/cooldown respond to active movement, equipment, space, familiarity, pain flags, readiness, and absence without automatic technique clearance.
6. Verify 30/45/60-minute envelopes, active draft persistence, offline reload, export/import and no timer-generated credit.
7. Run targeted regression and full audit/browser smoke at current head; record commit SHA and run URLs.

## Release gate
Do not claim full 719-source integration, verified Wildman warmup philosophy, or production readiness until source evidence, engine behavior, and tests substantiate those claims.

Related: issues #2 and #3.

## 30-minute source review — November 17, 2026

The consolidated Strength Lab Book I, §9.13, describes a **5-minute preparation / 20-minute main work / 5-minute lower-intensity movement and notes** allocation as *one workable example*. This is an editorial synthesis of reviewed material, **not an authenticated universal Wildman numerical rule**. The same section emphasizes shifting time toward technical rehearsal on learning days, retaining the primary skill and reducing accessory work under time pressure, and recording partial work honestly. §10 notes an example of a brief morning club routine without treating it as a universal session template.

Current engine timeBudget() reserves 8 warmup + 10 cooldown minutes for **every** 25–120-minute session, leaving only 12 minutes of main work at 30 minutes. Source #550 is cited for the eight-minute warmup format; the 10-minute cooldown is explicitly an app decision. Do not assert that Wildman prescribes 8/10 or 5/5 for all sessions.

**Design decision pending evidence and tests:** Preserve 8/10 as the existing user-preferred, recovery-oriented default; evaluate a separate **explicitly chosen** compact 30-minute strategy that protects meaningful preparation and downshift time while providing adequate primary-skill practice. Do not silently switch, dilute a source-defined dose, or convert partial work into progression credit. Assess 5/20/5 only as a candidate app adaptation and verify source-specific programs first.

**Acceptance scenarios:** 30-minute familiar single-club practice, technique-learning session, full-volume cycle too large for 12 minutes, recovery-only day, and a return after 3 weeks. Report main-work fit, any deferrals, preserved written dose, warmup/cooldown selections, and advancement eligibility. Compare 8/12/10 to candidate 5/20/5 under identical state; avoid claiming one allocation is universally superior.

## Source inventory follow-up: short training blocks
The current source-index.json identifies #1, "10 min of nonstop exercise - fast effective way to build a foundation for all advanced athletics" (Strength & Conditioning, 845 words); #550, "Program Design 8 - Basic Warmup" (Programming & Nerd Math, 1,689 words); #670, "Warm Up design considerations overview : Nerd Math Adjacent"; #130, "Cool down postures 1 - the Sphinx for spinal extension"; and #136, "Cooldown 4 - Pigeon pose - open your hips for better quality of Life". These are indexed titles/previews, not complete source verification. Read the full transcript evidence before converting short-block or warmup/cooldown teaching into scheduling policy.

## Implementation regression
At commit ddb04ea1, tests/preparation-routing.js includes active-call-site checks and direct render assertions for hinge, club, squat and overhead scenarios, eight-minute station count, and ten-minute cooldown sum. Test code has been committed, but successful execution and browser acceptance remain unverified.

## Cross-check against source-based research manual — November 17, 2026

The Strength Lab Wildman Manual, section 14, explicitly treats halos, around-the-world patterns, hip and spinal mobility and cooldown exercises as a menu of techniques, not proof that every session requires a fixed 10+10 minute routine. Its earlier draft describes a 10+30+10 example as exceeding the user session limit, and calls for a duration-aware builder. The example is not the current app budget and should not be misrepresented as a current defect.

The editorial source register independently checks source #550 (YouTube HbFuRSv_gD0) for four warmup families and two rounds of four exercises totaling eight minutes. The live warmup presentation now uses four one-minute stations repeated twice, matching that checked source structure. Movement substitutions remain Strength Lab adaptations, not direct quotes.

**Critical test distinction:** The engine currently treats a 30-minute target as a flexible 25–40-minute band, so it can allocate up to 22 main-work minutes with 8+10 preparation/recovery. A true 30-minute hard stop leaves 12 main-work minutes. These are different contracts. Do not quietly treat a 40-minute prescription as a 30-minute workout. Explicitly label planned total and extension in the interface, and validate completion against actual work. Existing user-approved flexibility must not be silently removed.

Source-index leads still requiring full transcript review: #1 ten-minute nonstop exercise, #279 "Is 10 min of Kettlebelling enough - Part II", #280 "Is 10 minutes of kettlebell enough to be in good shape?", #670 warmup design considerations, and cooldown #126–139. Source-index previews are discovery aids, not full-source proof.

**Policy:** Keep current 8+10 allocation and 25–40 flexibility unchanged pending source review and engine scenario testing. Do not imply a universal Wildman 10-minute cooldown; do not auto-switch to editorial 5/20/5.

## Decision record: close duration-policy research; proceed to broader engine QA

**Approved implementation baseline (no additional duration control required now):**
1. Retain the source-checked #550 eight-minute warmup, presented as four one-minute stations repeated twice. Movement substitutions are clearly labeled app adaptations.
2. Retain the user-selected ten-minute cooldown as a recovery-oriented Strength Lab allocation, **not** a universal Wildman numeric prescription.
3. Retain the existing 30-minute target's approved 25–40-minute flexibility. A full 40-minute plan is **not** a hard 30-minute session. Main-work capacity is 12 minutes at a hard 30 minutes and at most 22 minutes at the flexible 40-minute ceiling.
4. Preserve full programming protocols and honest completion evidence; never mark an unperformed endpoint complete or silently compress timed progression steps.
5. No automatic 5/20/5 switch. Book I §9.13 presents that allocation as one workable editorial example, not a verified universal Wildman rule.
6. Defer any new hard-stop mode or per-session allocation selector until actual user review shows it is needed; avoid expanding Settings prematurely.

**Verification still required before release:** Execute GitHub CI for latest preview commit, verify movement-aware warmup/cooldown browser presentation and source-link clickthrough, and confirm accurate displayed total duration when the engine extends a 30-minute target. The detailed #1/#279/#280/#670 transcript-level questions remain research follow-ups, not blockers to retaining this conservative existing policy.

## Resolved with Wildman's published program specifications — November 17, 2026

**Primary official sources (not merely editorial inference):**
- Wildman Athletica Clean & Press program: https://www.wildmanathletica.com/cp — follow-along training rounds 10–30 minutes; warmups and cooldowns **8–10 minutes each**.
- Wildman Athletica Snatch program: https://programs.wildmanathletica.com/snatch — warmups **6–8 minutes**, main sessions **about 32–40 minutes**, cooldowns **roughly 10 minutes**, complete sessions **about 40–60 minutes**.
- Wildman Athletica Swings program: https://www.wildmanathletica.com/swings — **10–30 minutes total including warmup and cooldown**; short complete sessions are a supported design goal.
- Wildman Athletica Clean & Press Reloaded: https://programs.wildmanathletica.com/cp-reloaded — **5–25 minutes including warmup and cooldown**.
- Wildman Athletica Turkish Get-Up master-class program guide: https://s3.amazonaws.com/kajabi-storefronts-production/sites/2147529643/themes/2151832023/downloads/xlOFB2RgSg2I2ZXpR9y9_ProgramGuide_TGU_v01.pdf — precise training-block scheduling and comfortable stops rather than training to failure.
- Book I editorial source register, source #550: https://www.youtube.com/watch?v=HbFuRSv_gD0 — four one-minute stations repeated twice for an eight-minute warmup.

**Conclusion:** The app's existing 8-minute warmup and 10-minute cooldown are **directly consistent with official Wildman program prescriptions**, especially Clean & Press and Snatch. They are **not** a universal rule for all Wildman programs: short complete Swings and Clean & Press Reloaded sessions show program-dependent duration. Do not claim all Wildman workouts must reserve 18 minutes, nor that 5/20/5 is Wildman's universal formula.

**Implemented:** The workout preparation panels now disclose the eight-minute source example and the ten-minute app allocation, citing the published 8–10-minute Clean & Press and ~10-minute Snatch cooldown ranges. The existing 30-minute target, 40-minute flexible upper limit, and 8/10 allocation remain unchanged; no hidden auto-switching. CI test checks the disclosure and source-aware warmup/cooldown routing.

**Remaining QA (separate from resolved research question):** run browser and Node suites and check the 30-minute total-duration presentation against engine output. Do not reopen the 8/10 evidence debate without new conflicting primary evidence.
