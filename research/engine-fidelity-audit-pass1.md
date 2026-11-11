# Engine fidelity audit — pass 1 (2026-11-10)

Scope: current integration/research-coverage-audit engine.js. This is a code-to-behavior inventory, **not** a certification that 719 source transcripts were all integrated. The research source ledger/editorial integration map must be cross-checked before any such claim.

## Verified in engine source
- `policyFor`: movement-specific profiles include snatch EMOM, double-kettlebell grind, club timed bouts, heavy/light wave, get-up, push-up, foundational practice. Each profile exposes source references, but their correctness must be independently checked against audit notes.
- `successful` and `completeRecord`: clean, completed, adequate-set/rep and valid-load requirements; bilateral and cadence constraints; pain/technique restrictions.
- `prescription`: repeat-clean-exposure threshold; repeated failure rebuild; optional redistribute strategy; low-readiness reduction; reentry after training gap; cycle milestones.
- `prerequisites`: skill flags and evidence from prerequisite movements.
- `chooseCycle` / `loadOptions` / `selectLoad`: guarded cycle transitions and load increases.
- `timeBudget`: 8-minute warmup, 10-minute cooldown, 30–120-minute strength session; cooldown duration is explicitly an app adaptation.
- `validateBackup`: versioned input validation.

## Unverified / remaining work
1. Cross-reference each profile's `sources` and `exactParametersSource` against the 719-good-source ledger, editorial integration map, and exceptions queue. Confirm explicit prescription vs app heuristic.
2. Add deterministic longitudinal tests (30/180/365/1825 days) for clean exposures, plateaus, repeated misses, pain holds, low readiness, gap reentry, alternate activities, equipment ceilings, and training cycle milestones.
3. Assert safety invariants: no progression from incomplete sets, skipped sides, poor technique, pain, non-strength activity, or a reduced-readiness session; no automatic load increase past inventory/limits.
4. Verify scheduling: strength vs recovery, no double credit, missed days, movement dependencies, heavy/light ordering, and program transitions.
5. Test long-history report performance and backup round-trip with thousands of entries.
6. Complete timer cue integration across warmup, cooldown, mobility and strength; test real Android screen lock and interruption behavior.
7. Resolve outstanding source-verification flags without promoting uncertain captions or medical claims to instructions.

## Release gate
Keep frozen preview and production unchanged. Promote only after research traceability, longitudinal invariants, CI regression, and hands-on Android acceptance tests pass.


## Pass 2 — source-index cross-check and progression qualification (2026-11-10)

The `preview` branch passed the complete Research coverage audit at commit `88f8c9f`, including 1,456 simulated workouts across eight profiles, recovery/skill/timer tests, and browser history testing. This proves regression behavior, **not** exact Wildman source fidelity.

Cross-checked that `source-index.json` contains relevant, title-matched entries for the engine's cited source numbers:
- #411 snatch volume; #410 snatch density.
- #366 and #120 double clean/press and front-squat programming.
- #3 two-hand heavy-club order of operations.
- #228 and #403 heavy/light programming.
- #423 and #658 Turkish get-up nerd math.
- #578 and #581 single-arm heavy-club order of operations.
- #550 basic warmup; #666 volume cycles.

**Evidence limit:** This checks source identity and topic only. Source-index titles and introductory previews do not establish that the engine's exact numerical settings reproduce the transcript. Full-text review and the 719-source completion ledger remain necessary.

**Concrete implementation findings requiring explicit labeling/verification:**
1. `policyFor` defaults to `exposures = 2` across profiles (configurable 1–6). Treat this as an app progression gate until each profile's source evidence confirms it.
2. Snatch defaults: 4→20 sets, 5 reps, 60-second rounds, +1 set; density targets 16×6, 14×7, 12×8, 11×9, 10×10. Cross-check each number against #411/#410 before marking transcript-exact.
3. Double-kettlebell grind defaults: 3→10 sets, 3 reps, 150-second rest, 180-second rounds. Cross-check #366/#120.
4. Club defaults: 2→6 timed sets, 30-second bouts, 60-second rest. #3 is an order-of-operations source; do not assume it establishes all timing parameters.
5. Get-up: 180→600 seconds, 60-second increments by default. Cross-check #423/#658.
6. Warmup: 8-minute allocation attributed to #550; cooldown: 10-minute **app allocation**, not a sourced prescription.
7. Recovery and gap-reentry are implemented safety/programming adaptations; verify their precise thresholds separately rather than describing them as direct Wildman quotes.

**Next evidence gate:** Obtain the completed 719-source ledger and editorial integration map, inspect full text/evidence anchors for the listed source numbers, then annotate each profile with `explicit / interpreted / app adaptation / unresolved`. Do not silently promote source-title matches to numerical verification. Keep production unchanged pending Android acceptance and source audit.


## Pass 3 — direct transcript-text sampling (2026-11-10)

**Important discovery:** The repository itself includes full transcript text in `sources-00.json` through `sources-23.json`, not only the abbreviated `source-index.json`. This permits direct source checking without waiting for another file transfer. These bundled transcripts are not, by themselves, proof that the independent 719-source review ledger and exception queue were integrated.

Direct transcript samples examined:
- **#411, Snatch Nerd Math 1:** explicitly describes movement-specific math and building work capacity by increasing volume at a fixed kettlebell weight.
- **#410, Snatch Nerd Math 2:** explicitly describes transition from snatch volume to density, with fixed-weight limitations motivating the progression.
- **#366, Double Clean/Press + Front Squat Nerd Math 2:** explicitly discusses total work capacity from weight × sets × reps and comparing programming choices by work-capacity calculations.
- **#578, Single Arm Heavy Club order:** explicitly discusses 3–5 initial reps and logging timed continuous work while using volume cycles.
- **#581, Single Arm Heavy Club order 2:** explicitly describes a 20-sets-of-five-per-side goal, starting lower and adding sets; it mentions even-number jumps as illustrative, not mandatory.
- **#666, Volume Cycles:** explicitly describes increasing volume while holding intensity constant.
- **#3, Two-Hand Heavy Club order:** explicitly describes building complexity at one weight and repeating at heavier weights.

**Supported interpretation:** The engine's movement-specific volume/density architecture is directionally grounded in the actual transcripts. In particular, #581 supports the single-arm club 20×5 endpoint and #578 supports its 3–5-rep starting context.

**Still not certified:** This pass did not establish that the global default of two clean exposures, snatch density table, 150-second grind rest, club timed-bout defaults, or 10-minute cooldown are direct numerical prescriptions. These remain app rules or pending verification. The source texts must be checked at each precise numeric claim, not just by broad thematic similarity.

**Engineering follow-up:** Create source-anchored numeric assertions for each opt-in movement profile and explicitly label universal progression/recovery thresholds as app adaptations unless direct evidence is located. Preserve the currently green regression behavior until a specific discrepancy is demonstrated.
