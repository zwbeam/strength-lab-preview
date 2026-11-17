# Strength Lab — Current Project State
Updated: 2026-11-16. Branch: `preview`.
This is the durable handoff entry point. Read PROJECT-MASTER-PLAN.md and AGENT-HANDOFF.md before making changes.

## Verified baseline
- Previous application checkpoint: `dac8754f5` (2026-11-16). Research audit, synthetic-history regression, and Pages deployment were reported successful for that checkpoint.
- `PROJECT-MASTER-PLAN.md` committed at `6350519`; the current branch head will advance with documentation commits.
- Source accounting: 720 archived records; 719 usable; excluded source #441. Inventory is NOT complete integration.
- `MOVEMENT-INTEGRATION-COVERAGE.md`: 54 operational movements, 38 reviewed outlines, 16 partial or unsourced lessons.
- Existing research artifacts: `research/curriculum-coverage-current.json`, `research/movement-integration-coverage.json`, `ENGINE-KNOWLEDGE-STATUS.md`, `TRAINING-RULES.md`, `research/development-batches.md`.
- The external 505-source master ledger and anchored independent completion notes are not reconciled in this repository. The 214-row independent journal accounting does not certify matching source text.

## Current priority
**P0: durable coordination and evidence-based research inventory.** Do not add speculative numerical training methods. Canonical queue: DEVELOPMENT-QUEUE.md.

## Current batch
Project-control infrastructure completed. New batch: scripts/build-source-ledger.cjs committed at a3cb02e; it deterministically constructs source-to-operational-movement declared links and checks 720/719/#441 accounting. The script is now run by .github/workflows/source-concept-ledger.yml (commit 1253d6f3), which runs generation and --check and uploads a 30-day artifact. Workflow run 43992431475 PASSED at commit 1253d6f3; generated and --check steps passed; artifact uploaded. Job logs: 720 total/719 usable, #441 excluded, 720 unique keys, 214 journal keys matched, 54 direct-instruction-linked source IDs, 7 programming-example-linked source IDs, 662 usable sources not linked to operational movement coverage, 54 operational movement concepts, zero accounting issues. Counts are declared-link discovery only, not a completeness score. Generated JSON has NOT been committed; new candidate passage artifact will also be uploaded by CI if it passes. No runtime engine changes.

## Next executable batch
Passage candidate discovery script committed at b08a3b61 and CI expanded at 8540a227. Run 44005378459 PASSED: 719 usable sources, 438 with candidate matches, 281 without matches; the generated candidate output was uploaded. Added deterministic full-source review queue script d584835 and workflow extension c3a8e87; queue CI run 44006431205 PASSED. First contextual research notes committed in research/contextual-concepts-batch-01.md at bb6b30c: 6 scoped concept findings from source #281 and #557, not engine implementations. Reviewed five additional scoped concepts C007–C011 from reopened source #496 in research/contextual-concepts-batch-02.md (commit 12be57d). Static engine comparison documented in research/engine-source-gap-audit-01.md (commit 7a4d07e): re-entry currently reduces dose using app defaults (14-day gap, 0.7 fraction) but retains working load; source #496 emphasizes individual load adjustment. Weaker-side parity and microloading remain unverified. Next: inspect test harness, add focused re-entry tests, design conservative available-load review without changing historical mastery or bypassing pain hold. Existing source claims must not be treated as automatically implemented. Keep source-derived guidance separate from app-authored scheduling. Candidate keyword matches are NOT verified teachings. Artifact 14287778763 is downloadable from run 43992431475 (30-day retention); generated JSON is not yet checked into repo. Avoid interpreting 662 unmapped declared links as 662 unused transcripts. Never automatically label a transcript fully integrated from title/declared source matches.

## Known blockers
- External master 505-source ledger and anchored review evidence unavailable in current repo.
- Physical Android/audio/technique acceptance not performed.
- Oversized program rotations can repeatedly trigger re-entry.
- Settings UX needs substantial redesign; Learn needs substantive content; preserve Train and Workout.

## Rules
Every future batch updates this file with: branch/head, completed work, test command and result, unresolved blockers, and exact next task. Do not assert test success unless executed or verified in Actions for the relevant commit. No production promotion or user-data reset without approval.


## 2026-11-16 — re-entry load advisory checkpoint
- `engine.js` now exposes `returnLoadReview` and adds a clear working-weight review message on extended weighted-movement re-entry; this is advisory, not an automatic deload, and does not alter stored load/history. Commit `b3966a99`.
- `tests/long-break-regression.js` now checks advisory, original weight, and no false short-gap advisory. Commit `9c867d9e`.
- `.github/workflows/synthetic-history.yml` now runs long-break and return-continuity tests before browser history checks. Commit `f73d9e5a`.
- CI run `44012894485` was queued when checked. **Do not claim passing until checked.** Next: verify CI; trace UI visibility of `reason`, assess stronger load-selection gate and weak-side enforcement.


## 2026-11-16 — regression triage and warning UI
- Synthetic history run `44012894485` **passed**, including the new long-break and return-continuity checks; Pages run `44012908994` passed.
- Research coverage run `44012885331` failed in the pre-existing snatch rebuild test because it used wall-clock time and accidentally triggered re-entry. Test now pins `now:'2026-11-03'` immediately after two November 1–2 hard sessions, commit `578ff8fb`.
- `app.js` compact workout prescription now visibly renders the `returnLoadReview` advisory, commit `6b9f8d9f`; this is a warning, **not** a load-selection gate. Current CI runs `44014721386` and `44014721364` pending when checked.
- Next: verify both CI runs, inspect actual browser screenshot/readout of return warning, add a focused browser assertion, and determine appropriate explicit user-confirmed conservative load selection. Do not silently change owned weights or historical progression.


## 2026-11-16 — mobile browser verification coverage
- Synthetic history run `44014721364` passed after `app.js` warning integration; Pages run `44014742365` succeeded.
- Added `tests/browser-reentry-load-review.cjs` to assert visible warning at 320/390px, preserved weight, and no warning on recent practice (commit `dd5492fb`). Registered in `.github/workflows/research-coverage.yml` (commit `0cc7771a`).
- Research coverage run `44014918567` was queued at last check. Test not yet verified green. Next: inspect browser test outcome and fix fixture/visibility issues, then evaluate a deliberate conservative-load selection flow without changing historical progression.


## 2026-11-17 — return-load selection implementation and browser gate
- Engine `chooseReentryLoad` committed `4fa1b111`; separate app-authored return-load action accepts only a lighter configured working load during eligible re-entry, preserves historical records, and establishes load-reset boundary. Test `tests/reentry-load-selection.js` committed `27e1bdba` and CI wired `3bc1e177`.
- Train UI `Review return weight` prompt and persistence committed `7aa3f1a6`. Pages run `44084008160` and synthetic history run `44084007491` passed at this UI commit; full research audit was in progress at last check.
- Added mobile end-to-end `tests/browser-reentry-load-selection.cjs` commit `5a389f96` and registered it in research coverage workflow commit `b9ceade5`. Run `44084255482` queued at last check. Do not claim this new test passed yet.
- Next: verify the new test and research audit; address any failures; then improve Keep Weight confirmation and accessibility. Remaining broader priorities: curriculum fidelity, Settings redesign, Learn completion, Training Log polish, Android manual acceptance.
