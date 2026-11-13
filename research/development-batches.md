# Development batches — November 13, 2026

## Batch 1: repair current Actions failures

Incoming preview checkpoint: c69f54a. Kept the original strength-lab checkout and
its interrupted uncommitted files untouched; cloned the requested preview branch
separately. Read README, current source/engine audits, workflows, engine/library,
regressions, and all attached handoff/accounting metadata before editing.

Reproduced both reported failures locally. Learn keyboard activation failed
because rendering dereferenced coverage for three engine complexes without
instruction entries. Canonical movements now remain renderable with an explicitly
pending, unsourced fallback; no invented lesson/video or technical eligibility is
introduced. Existing 31 dedicated instruction entries retain their status.

The history static contract predated date filtering. Updated it and executed the
real table renderer to verify 60/120 row bounds, filter-before-pagination,
inclusive/empty date ranges, read-only behavior and expanded-state preservation.
Added real browser date-range assertions. New history fixtures explicitly open
the intentionally collapsed disclosure, while pagination preserves that open
state across rerenders. Kept decade-scale append/correction/rollback checks.

Local verification: all then-existing non-browser Node .js regression suites, history-corrections.test.cjs,
295-session demo generation and populated browser replay, plus browser-smoke through long-history checks passed. The final offline assertion
subsequently exposed a stale RC25 expectation after the RC26 bump; the complete
browser suite was rerun after fixing that assertion (see below). Includes 3,840 workouts across three decade
lifecycles, 2,600/2,601-session persistence, quota failures and backups. Inspected
the rendered 320px Training Log screenshot. Local browsers use installed Chromium
via an optional executable override; Actions retains its normal bundled browser.

Cache/query revision rc26-ci-repair-20261113. GitHub Actions must verify this new
commit independently; local passes are not reported as remote CI success. No
production promotion, storage-key change, user-data reset or archive deletion.


### Follow-up CI repair

Commits d534368 and fd098e2 add usable Actions error annotations, wait for storage
readiness, and compare the installed offline cache against the revision declared
by sw.js rather than a hard-coded RC25 name. GitHub run 43495720734 passed BOTH
audit and browser-smoke for fd098e2. Synthetic-history and Pages deployment also
passed on the preceding diagnostic checkpoint. Local full browser-smoke now
passes all four widths including offline reload, quota rollback and 2,601 saves.
Do not extend that QA claim to later curriculum commits without rerunning them.

## Batch 2: source audit and accessible curriculum additions

Inventory all 720 indexed records; supplied accounting identifies 719 usable,
excluding corrupt #441. Reconcile all 214 independent journal video keys with
the archive. Their supplied hashes match neither archived raw nor whitespace-
normalized text; retain both fingerprints without claiming identical source
bodies. Master 505-row ledger and anchored external reviews are not supplied.
The Book I document is identified and hashed, not certified or merged into the
Movement Library. Keep eight distinct Book outlines unchanged.

Close-read #91, #93, #87, #82, #365, #295, #335, #147 and #151. Preserve exact
quoted anchors, archive hashes, original URLs and numerical-example limitations.
Add opt-in bodyweight squat/lunge foundations and matched-pair hard-style clean
practice. Dose, exposure gates and numeric recovery settings are app defaults.
Add practical lessons for these plus all three existing complexes. Component-
practice eligibility is now consistent between Learn and existing complex
planner safeguards. Crawl and alternating double-club lessons are explicitly
instruction-only: no automatic dose, skill credit or equipment inference.

Restore the pre-existing detailed programming UI under Settings → Advanced &
Data → Movement Programming. This makes blocks/skill confirmation configurable
without changing the default A/B/C program or saved history. Programming
education now identifies the selected block, rather than always saying A/B/C.

Coverage and reproducible audit: research/movement-programming-coverage.md,
research/curriculum-coverage-current.json; run node scripts/audit-curriculum.cjs.
Current engine: 37 programmable movements, 37 dedicated lessons plus four
instruction-only lessons. Eleven programmable lessons remain partial/unverified;
counts are coverage, not a claim of complete curriculum or visual validation.

Verification before checkpoint: all 29 non-browser .js suites and six additional
history-correction tests pass. Full browser-smoke passes at 320/390/832/1280;
populated two-year history browser layouts pass. New touch-enabled curriculum
acceptance passes at 320/390: ten lessons, eight separate Books, exact archive
video links, actual partial bodyweight save/reload and no credit for the skipped
lunge. A separate 390px paired-clean workout is generated, saved, and then
blocked when matched-pair equipment is removed. Numerical rules are tested over
multiweek histories including partial/imbalance/pain/low-readiness. Physical
Android technique/audio testing remains outstanding. Cache rc27-source-curriculum-20261113.


## Batch 3: distinct rack-squat evidence and club foundation instruction

GitHub run 43496253448 passed audit and browser-smoke for batch 2 (83b5ecc).
Public Pages build and HTTPS cache rc27 were verified; a touch-enabled 390px
browser opened Learn with eight separate Books, new lessons and no overflow.

Close-read #305 and #206. Add singleRackSquat with its own explicit rack/technique
confirmation, recent goblet foundation evidence, independent volume history and
opt-in block. The source supports 3–5 per side and adding sets at fixed reps;
selected 3 reps, 2–4 sets, 90-second rest and qualification/recovery thresholds
are app choices. Single clean/squat/press sequence and both eligibility systems
now require this distinct rack squat, rather than accepting goblet history as
proof of rack-squat technique. Old history and policy keys are preserved; this
constrains future admission, not retroactive rewriting of stored sessions.

Double-club swing-clean teaching (#206) is available as an instruction-only
foundation. Its later-stage equipment/coordination context, back-burner practice
example, grip, order, controlled return and historical test qualifications are
preserved. No double-club automatic prescription is inferred from those examples.

The actual rack-workout browser test exposed an existing display/data mismatch:
unrecorded side counts looked prefilled although the save guard correctly
required explicit actual counts. Ordinary unilateral actual fields now start
blank when no results exist. Verified: save rejects missing sides without losing
the draft, then explicit left/right entries allow a successful unilateral save.
No bilateral safeguard was weakened. Existing saved side values are unchanged.

Verification: 29 Node suites passed after the engine additions, plus the history
correction CJS suite. Source audit checks 52 exact quote anchors and archive
hashes. Multiweek rack tests cover partial work, goblet/rack separation,
qualification expiration, explicit skill gates and supporting-practice return.
Full browser-smoke passed all four widths after the engine change; the isolated
390px rack flow passed after the side-field fix. Current combined browser tests
and remote CI must finish independently for this checkpoint.
Cache revision rc28-rack-foundation-20261113. Inventory: 38 programmable lessons,
five instruction-only lessons; eleven programmable lessons retain explicit
incomplete status. Production and browser storage namespace remain unchanged.
