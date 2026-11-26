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


## Lifelong integration batch 1: double clubs

Incoming checkpoint 36a8a27, verified against origin/preview. Close-reviewed #205
and #207 in full and reused #206 evidence. The technical/performance naming
inconsistency in #207 is retained in the instructional qualification; the app
programs only the explicitly described four-count technical version.

Add explicit equipment.clubPairs (lb per club) and useDoubleClub opt-in. Missing
fields in existing V33 backups default to unavailable; no history/key migration.
Pair weights must be owned, within the club ceiling and explicitly confirmed.
Working-weight replacement and endpoint load choices use that pair inventory.
Single/two-hand club preparation, recent supporting practice and separate
technique/overhead confirmations gate clean → pullover → technical swipe.
All new doses (2–4 sets of 3, 90-second rest), planning estimates, admission counts
and load-jump limits are app adaptations. One double-club pattern per session
limits duplicated demand; deferred patterns rotate without advancement credit.

All 30 Node suites and historical-correction CJS pass locally. New source quote
and hash checks pass. Targeted mobile acceptance verifies Settings pair removal /
restoration, Movement Library instruction, actual generated swing-clean workout,
completion, reload and Training Log reporting. Full CI verifies the checkpoint
independently. Eight Books, V33 persistence and production remain unchanged.

## Lifelong integration batch 2: bodyweight, paired prerequisites and evidence continuity

Checkpoint d8a2d96 passed audit, browser-smoke, synthetic history and Pages.
Preserved the interrupted work after the approval service hit a usage limit;
no unconfirmed command was treated as executed.

Close-reviewed #85/#88/#554 for bodyweight integration and timing; reused #82/#87
technique. Bear and cat crawls now have engine profiles, explicit technique and
traveling-space gates, actual-duration logging and two-to-four-bout progression.
Thirty/30 is a source learning format; applying it to these crawls, the endpoint
and evidence/recovery rules are app adaptations. No automatic advanced timing
ladder or full paid-program equivalence is claimed.

ABC now considers eligible bodyweight support and opt-in paired clubs, with
family emphasis, freshness, time and recovery priorities. Deferred work remains
available across later pool selections. Repeat partially established clean
practice before introducing another optional pattern. Pure bodyweight training
has lower-body and ground/crawl days. One paired-club pattern per workout, and
paired clubs are not combined with a kettlebell complex in the same prescription.

Reviewed #152/#186/#366 and reused #365/#305/#335: single clean precedes paired
clean; single press plus paired clean precede double clean/press; distinct rack
squat and paired clean precede double squat. Counts/windows are app gates. The
broader source double-swing/outside-swing teaching pathway remains untracked.
Complexes snapshot concise sequence meaning and estimate component work with
conservative floors. Complex logs never also award component exposures.

Fixed prerequisite evidence replay: a clean performed light exposure is neutral,
not qualifying and not an interruption of prior clean evidence. Partial, poor
technique, pain and recovery/re-entry remain nonqualifying. Added a regression
with qualifying exposures separated by a clean light day. Historical values and
policy keys are preserved; future selection uses corrected replay.

Mobile execution uses the existing notebook and timer. “Use prescribed intervals”
loads eligible simple timed prescriptions into the existing timer; the user
starts it explicitly and timing never marks work complete. Ordinary reps stay
untimed. Context/limits are available in movement instruction, duplicate
educational/prerequisite map edges are removed, and technical swipe appears in
club-combination reporting. Eight Books and production are unchanged.

Verification: all 31 non-browser Node suites pass, plus history-corrections CJS.
Source validation checks 61 instruction quote anchors/hashes and three additional
paired-pathway source fingerprints/quotes. Four three-year actual-generator
histories save 1,676 workouts with missed days, vacations, low readiness, partial
work, technique and pain flags, pair removal, owned-load replacement, pause and
backup replay. Dedicated club history reaches pullover and technical swipe.
Existing decade/year suites remain passing. Browser-smoke passed at
320/390/832/1280, curriculum touch flows at 320/390, generated 295-session demo and
populated layouts passed. New mobile flows exercise all three double-club
movements and both crawls, including real 30/30 countdown and no timer credit.
Remote CI independently verifies the pushed checkpoint; physical Android remains
unverified.

Durable deliverable: MOVEMENT-INTEGRATION-COVERAGE.md and its JSON matrix, generated
by scripts/audit-integration.cjs. Inventory: 43 programmable movements, 29 reviewed
outlines, 14 instructional/source limits and two instruction-only double-club
patterns. Current cadence warnings are block-level; broad mixed schedules still
show frequent movement re-entry in stress tests. Refine movement-level continuity
next without weakening eligibility, inventing technical mastery, or adding
catch-up work. Alternating clubs, broader bodyweight/paired pathways, additional
complexes and visual/source verification remain open.


### Final visual/source clarity follow-up

Checkpoint 432d188 passed all GitHub checks and the public RC30 mobile/offline
verification (43 movements, eight Books, no failed assets or browser exceptions).
Visual inspection found stale reference-era wording on the now-programmable
swing-clean lesson. Corrected its scope/qualification copy and the two remaining
alternating-reference labels. Registry prerequisite links that are also sequence
components now appear in the Combinations section without duplicate map edges.
This changes presentation of existing relationships, not progression gates.
Cache revision rc31-integration-copy-20261113; current commit requires independent
QA again. Physical Android review remains outstanding.


## Movement-level continuity checkpoint

Started clean at origin/preview 1d5e059. Reused reviewed #85 Tetris/interleaving
principles; the following scheduling rules and numeric limits are original app
choices, not new source prescriptions. No transcript completion count changes.

Coordinated selection first preserves the existing unfinished-work priority,
then considers eligible movements approaching the configured return window,
based on observed training intervals. A clean reduced return can receive up to
two short follow-ups before another ready block gets its turn. Pain/technique
failures, equipment loss, readiness reductions, gap re-entry and time limits
remain enforced. A saved opt-out restores least-recent-block selection.

Cadence feedback uses actual movement dates and recorded re-entry modes, names
up to three affected patterns and excludes disabled families and future records.
It does not infer physiology or technical mastery. Plan snapshots retain compact
summaries rather than copying the entire analysis. Calendar/notebook forecasts
disable hypothetical continuity priority after the first recommendation; empty
sequence placeholders never stand in for future practice.

Local synthetic comparison against 1d5e059: mixed four-block three-year re-entry
sessions 317 → 240; club/bodyweight 183 → 170; bodyweight 30 → 31; single club block
102 unchanged. These results are test observations, not guaranteed outcomes.
Overloaded rotations remain a documented limitation; no evidence gate was relaxed.

Verification: 32 non-browser Node suites passed plus history-corrections CJS.
Targeted touch acceptance at 320/390 verifies the actual explanation, opt-out
persistence/reload, opt-in restoration and partial follow-up workout saving.
Existing full browser smoke and remaining suites are rerun by current-commit CI.
V33 keys, prior backup formats, timer behavior, eight Books and production remain
unchanged. See tests/continuity-regression.js for failure, gap, duration, fairness,
future projection and immutable replay assertions.


## Alternating double-club integration checkpoint

Continuity checkpoint f75167d passed all GitHub checks. Close-read #147 and #151
again before promoting the final two instructional-only catalog entries.

Inside/outside alternating circles use a new opt-in doubleClubAlternating block,
not an expansion of ABC or the existing foundation block. Matched club equipment,
explicit held-club technique and recent single/paired practice remain mandatory;
outside adds recent inside-circle practice. Sets, rest, matched-weight policy,
planning estimates and exact evidence counts are app choices. #151's 3/5/6–8 and
light timed examples remain contextual; no full bodybuilding ladder, arm-growth
claim or universal two-year wait is programmed. Control of the held club and
actual equal-sided results matter separately from mere repetitions.

Targeted verification: two-year actual-generated history saves 288 workouts,
reaches both inside/outside patterns and includes shortened sessions, gaps,
recovery, incomplete work and technique problems. Equipment removal, skill gates,
left/right imbalance and source-parameter labels are checked. Touch browser
acceptance generates and saves both movements with explicit per-side editing,
alongside the prior clean/pullover/technical-swipe and crawl workflows. All 33 Node suites pass locally, plus historical-correction CJS and targeted
mobile acceptance. Existing curriculum acceptance passed at 320/390; full browser
smoke, remaining suites and current-commit CI are verified before delivery.

Current catalog: 45 programmable entries, 29 reviewed outlines and 16 explicit
instructional/visual limits. No instructional-only entries remain in this catalog;
this is not a claim that every movement or method in 719 usable research sources
has been integrated. Performance swipes, fuller numerical cycles and broader
bodyweight/paired movement families remain engineering/research work. Data keys,
backups, history correction, eight Books and production remain unchanged.


### First-use load reachability correction

Checkpoint b0cc04a passed all GitHub checks. Final inspection found the old
workingWeights renderer was unreachable: paired movements with no starting load
could not enter a workout, while earlier browser fixtures prefilled that load.
Advanced Movement Programming now provides a deliberate owned-load selector
for unstarted movements and existing replacement controls for unavailable loads.
The pure setInitialLoad guard rejects bodyweight, unowned/unmatched choices and
any established positive load; skill flags and history are unchanged. Active
drafts block the action. Existing progression/review controls remain mandatory
for subsequent load changes. Updated empty-plan guidance points to the real UI.

New tests begin with no target load, select it through the actual Settings UI,
reload, generate the workout, enter bilateral actuals where required and save.
The fixture initializer now preserves storage on reload instead of reseeding it.
This addresses the gap that seeded-load tests missed. Source prescriptions and
training intelligence are unchanged by this setup correction.


## Supported sliding-plank pathway

Incoming eb8b66c verified on GitHub, with a clean tree and passing checks. Read
#86/#94 in full and reviewed #89/#97 as the next pulling/stepping research leads.
Added knee-supported sliding plank and outbound knee-hover/knee-down return to
the shared registry, Learn and an opt-in block. The supported pattern can join
eligible ABC bodyweight support. Harder practice needs both recent supported
work and explicit technique confirmation. Repetitions do not confer mastery.
Two-to-four sets of three, 60-second rests and planning seconds are app choices;
no source numeric prescription or further circular-flow progression is inferred.
The #86 captions contain an inconsistent toe cue; instruction uses the explicit
supported setup and distinguishes the toe-tucked hover version taught in #94.

Verification: a two-year actual-generator history saves 288 workouts with gaps,
technique problems, incomplete work, low readiness and backup replay. Touch
browser acceptance at 320/390 opens instruction, starts each real prescription,
saves actual work and reloads it. Ordinary reps stay untimed. Full regression
and current-commit CI are required before delivery. Storage keys, history,
existing programs, eight Books and production are preserved.


The first full run exposed a test-fixture issue: the historical continuity test
confirmed every newly added skill dynamically, changing its movement set while
comparing against old numeric baselines. It now explicitly keeps the new sliding
skills unconfirmed in that fixed comparison. The original thresholds are intact;
new skills have their own two-year and actual-browser tests. This mirrors an
existing user's unchanged confirmations rather than silently opting into additions.


## Secured-bar bodyweight row integration
Reviewed source #89 and preserved exact video/quote/hash evidence in
research/bodyweight-row-evidence.json. Stable bar, repeatable setup, bent-knee
foundation and no sag are source-supported; starting 5 reps, 2–4 sets, 90-second
rest, exposure gates and planning pace are configurable app decisions. The source
60/80 example is not automatically prescribed, and maximum testing is not requested.

The actual generator now supports an opt-in pulling block and eligible ABC support,
requiring secured-bar availability, recorded height and explicit skill confirmation.
Original station setup is immutable; actual geometry changes earn no comparison
credit or technique penalty. Configured-height changes start independent cycles.
Backup/draft validation rejects malformed or missing setup without changing keys.
All 36 Node suites passed, including a two-year 278-workout generated row history.
Touch browser tests at 320/390 passed equipment setup, modified actual results,
backup export, historical correction, progression replay and offline reload.
Remaining: full 60/80 source scheme, straight/elevated-foot progression, platform
step-ups, physical-device/technique review and broader source integration.


## Unloaded step-up foundations and station-aware reporting

Incoming 6452678 matched origin/preview and all GitHub checks passed. Re-read the
full indexed #97 Bodyweight box step up transcript. Its exact URL, normalized
content hash and quote anchors are preserved in research/step-up-evidence.json
and the shared instructional catalog. The 20/24/30-inch demonstration is qualified
by the source's lower-platform advice; no universal height or dose is inferred.

Alternating-lead and static-foot unloaded step-ups now have shared registry
entries, separate explicit skills, verified indexed video links and an opt-in
two-day practice block. Eligible basic alternating work can enter ABC support.
The source treats these as complementary patterns; the app does not invent a
mandatory ladder between them. Stable platform and overhead-clearance confirmation
and recorded height gate generation. Each pattern/height has independent
comparison evidence. There is no automatic height, float or loaded-step advancement.
Starting 2–4 sets of 3 per lead leg, 90-second rests, planning pace, evidence gates
and the input-height range are explicitly app choices.

Written platform height/pattern remain immutable; actual changes are recorded
without advancement credit or an automatic technique-failure penalty. Bilateral
counts remain explicit. New station fields are optional additions to V33; existing
keys, transactions, writer ownership, backups and correction replay are preserved.
Actual-method fields persist through drafts and historical edits. Reported
completion now respects setup changes for both rows and step-ups instead of saying
"as prescribed" when geometry changed. Settings use registry starting reps so
saving all profiles does not silently change a step-up target from 3 to 5.

Focused verification: three years of actual step-up generation saved 419 workouts
(210 alternating, 209 static), with equipment loss, changing heights, missed days,
short sessions, low readiness, incomplete/unequal actuals, technique flags and
backup replay. A separate three-year mixed composition actually scheduled steps,
rows, paired clubs and kettlebells, preserving independent evidence and method
confirmations. Pain holds, historical correction/undo, forged setup snapshots,
malformed actuals, missing skills and unavailable platforms have targeted checks.
Touch Chromium at 320/390 passed real equipment/skill setup, both generated
patterns, bilateral logging, a historical correction, interrupted draft restoration
and offline save. All six existing browser suites passed as well.

The initial provenance check caught missing literal app-default wording; the
explanation was corrected without weakening the invariant. Browser fixtures now
advance to a separate training day rather than attempting a second strength
workout on a completed calendar date. Mixed fixtures explicitly record continuous
single-club practice before paired work; skill confirmation alone is not evidence.
No source claim was broadened to satisfy a test.

Remaining: loaded stepping and float variants, fuller row source cycles, broader
paired-kettlebell systems, oversized-rotation cadence, source/visual gaps and
physical Android/technique review. Fifty programmable movements now have lessons;
34 reviewed outlines and 16 partial lessons do not imply complete corpus integration.


## Double-kettlebell hinge foundation integration

Incoming eeb21d0 matched origin/preview and passed all GitHub checks. Fully read
source #142, revisited #186/#365 teaching context and retained outside-swing
sources as separate research leads rather than treating them as implemented.
Exact URL, normalized text hash, quote anchors and qualified numerical examples
are preserved in research/double-hinge-evidence.json and the instructional catalog.

New paired deadlift and double swing entries have practical lessons, explicit
experience/technique confirmation, matched-pair inventory gates and independent
owned per-bell load selection, cycle history and load review. The opt-in doubleHinge
block schedules foundation work before an eligible swing. Recent paired deadlift
and single swing evidence are app recency gates. Source experience context covers
much more than two recent workouts; the explicit readiness confirmation remains
separate, including hand-change/clean/press familiarity. No source years, approximate
60% load discussion, gender-specific single-bell examples, half-kilo plate increment
or 6-to-20 rep range is converted into an automatic prescription or mastery test.
Starting 2–4 sets of 5, 90-second rests, pace estimates and load caps are app defaults.

A source-sequence educational relationship points toward double clean, without
retroactively changing existing clean/press/squat gates or histories. Outside swings,
tracked hand changes and full paired numerical systems remain incomplete.
Eight Books, V33 storage keys, writer locks, history correction and timer behavior
are preserved. Imported active drafts for the new hinge movements must use their
configured owned matched load; historical/modified actual work is still retained.

Testing informed the new application decisions before publication: imposing recent
practice on every single-bell skill repeatedly sent trainees back to preparation.
The app now separates the broad explicit experience requirement from narrow recent
paired-deadlift/swing evidence instead of inventing universal deadlines for cleans
and presses. Realistic mixed fixtures choose working loads and confirm only the
relevant skills, rather than enabling every advanced movement with unset loads.
No existing source prescription or admission gate was weakened.

Verification: all 38 Node suites passed, plus six historical-correction CJS tests.
The new three-year actual-generator history saves 430 workouts, including 101
paired deadlifts and 65 double swings, with equipment loss, missed days, reduced
time/readiness, incomplete sets, technique problems and backup replay. Focused
checks cover pain holds, failed foundation work, independent single/paired credit,
explicit capped load review, stale prerequisites, correction/undo, malformed draft
loads and Learn relationship consistency. Touch Chromium at 320/390 passed real
starting-load selection, explicit readiness, two-exposure preparation, ordinary
untimed reps, reduced actual work, correction, offline draft and history reload.
The complete existing browser regression and current-commit GitHub checks remain
required before reporting the preview as fully verified. Physical Android and
visual technique confirmation remain outstanding.

Coverage: 52 programmable movements; 36 reviewed outlines and 16 partial lessons.
The source inventory is still 720 indexed / 719 usable per supplied accounting;
this is not a claim of complete engine integration or recovered external review.


## Coordinated setup and prerequisite continuity
Incoming 4cb9ada verified against origin/preview with all checks green. Revisited
#548's independent foundational-program/implement-wave context. Selection, recency
maintenance and cleanup rules below are Strength Lab decisions, not prescriptions
from that transcript.

Coordinated plans no longer include zero-load setup placeholders as executable
work. Equipment/setup reasons remain available. Baseline placeholders in legacy
mixed records no longer retain unfinished-work priority or create new physical
debt. Genuine skipped/incomplete prescriptions still carry forward. Single-block
first-use setup and all historical records are preserved.

Previously, recent advanced practice could maintain one prerequisite but lose
that benefit at the next ancestor, forcing repeated preparation despite qualified
practice. Maintenance now follows registry-gated chains only. Each ancestor still
needs its own previously earned clean exposures, current policy/load, explicit
skills and no unresolved pain/newer failed work. Only recency transfers: no reps,
cycles, loads, mastery or future practice is invented. Supporting-move insertion
uses the same context as eligibility. Unrelated educational links cannot qualify.

Focused tests pass a two-year load-setup transition (182 ABC and 127 unloaded
preparation workouts), five months of maintained get-up ancestry, older-record
correction/undo, missing skills, pain/failure/load/gap and unrelated-movement
controls. Existing three-year multi-family histories and bounded continuity tests
pass. Touch Chromium at 320/390 passes real setup-to-training transitions and
offline history. A 390px case opens Learn, generates and saves a maintained
hip-pass prescription without modifying old foundation evidence. No major UI
redesign, storage migration, source-dose change or production modification.
Broader oversized rotations remain an acknowledged scheduling limitation.


## Hand-change foundation and explicit timer Start

Preceding cc8b5a3 passed all GitHub checks. Fully reviewed #185 Hand to Hand
Kettle Bell Swing and used the existing reviewed #142 preparation context. Exact
indexed URL, normalized source hash and three quote anchors are preserved in
research/hand-change-evidence.json and the instructional catalog. No source
numeric program, breath cadence, timestamp or universal superiority claim is
inferred from this short tutorial.

The new handChangePractice block uses the shared registry, owned single-bell
starting load, explicit familiar technique plus recent two-hand swing gates,
actual per-hand counts, independent progression/recovery and Training Log.
Five per driving hand means ten alternating swings per set. The selectable
3–5 per-hand target, default 2–4 sets, 90-second rest, pace estimate and load cap
are app decisions. Ordinary reps stay untimed. Missing or unequal side counts,
partial/failed work and recovery doses cannot advance the cycle. Educational
links explain broader paired preparation without retroactively changing existing
paired gates or awarding two-hand/paired component credit.

The real interaction test exposed a separate timer defect: explicit Start prepared
the interval sequence but left it paused. Earlier acceptance pressed Resume next,
masking the behavior. Start now starts the wall-clock countdown immediately; empty
sequences stay stopped, pause/resume preserve elapsed time, and reload still waits
for deliberate playback. Unit checks and touch acceptance assert Start alone, the
rendered 00:07 readout after three seconds, retained timing while an instruction
dialog is open, and no automatic physical-work credit. No major redesign or new
server/storage dependency was introduced.

All 42 Node suites and six historical-correction CJS tests passed locally. New
three-year actual-generator scenarios cover single bell (399 workouts / 316 hand
change exposures), mixed programming (403 / 238) and delayed explicit confirmation
(390 / 304), with load/equipment changes, interruptions, recovery, technique/pain
flags, unequal work and backup replay. Touch Chromium at 320/390 passes real load
and skill setup, source-linked instruction, visible running timer, edited per-hand
actuals, historical correction and offline draft/history restoration. Final complete
browser/CI and public-preview verification remain required before delivery.

Coverage is 53 programmable movements: 37 reviewed outlines, 16 partial lessons.
Outside swings, isolated single-arm swing cycles, fuller numerical club/paired
systems, oversized-rotation cadence and visual/physical Android verification remain
incomplete. Existing V33 keys, writer ownership, backups, eight Books, history and
production are preserved. Source accounting remains separate from full integration.

## Introductory single-arm swing and QA coverage continuation (2026-11-14)

Verified environment and clean local checkout first. The initially supplied
strength-lab checkout was an older main tree; the requested preview and c7dcfdc
exist in zwbeam/strength-lab-preview. Cloned that repository separately, confirmed
origin/preview at c7dcfdc and all six associated GitHub checks successful. Existing
checkout, main, production settings and archive branches were preserved.

Close-read the complete indexed #67 introductory single-arm swing and #446
hard/soft-style comparison. Exact URLs, whitespace-normalized hashes and four
literal anchors are retained in research/single-arm-swing-evidence.json and Learn.
The new opt-in singleArmSwingPractice block requires explicit familiar thumb-back
technique and recent qualified two-hand practice. Independent owned starting load,
2–4 sets of 3–5 per side, 90-second rests, planning pace and progression/recovery
gates are app choices. Work on one side, park, then repeat on the other. No airborne
hand change, soft-style endurance, thumb-up or overhead swing is prescribed.
Existing hand-change and paired prescriptions/gates are preserved. Coverage now
contains 54 programmable lessons: 38 reviewed outlines and 16 partial lessons.

Focused tests save 399/403/390 workouts across three separate three-year actual
histories (single bell, mixed ABC, delayed skill confirmation), including absence,
load/equipment loss, pause, reduced duration/readiness, pain, technique breakdown,
unequal/incomplete actuals and repeated backup validation. Checks cover independent
credit, explicit load review, missing skills/practice, source hashes, malformed
actuals/drafts and correction/undo. Touch acceptance at 320/390 starts from an unset
working load, uses Settings and Learn, generates and saves actual bilateral work,
corrects history and restores draft/history offline. No personal training data is
used. Physical Android and visual technique remain unverified.

The timer acceptance initially observed 00:06 where an exact 00:07 was expected:
real time advanced during browser interactions before the simulated fast-forward.
Both swing browser fixtures now pause the simulated clock before interaction;
Start must still immediately run and advance the rendered countdown. Production
timer behavior was not changed to satisfy the test.

The CI suite guard now checks all JS/CJS Node and browser files, including shared
demo setup, rather than only non-browser JS. Negative temporary fixtures confirm
omitted JS, CJS and browser suites are rejected. Research and transcript changes
now trigger the same QA jobs. This prevents evidence-only updates and future CJS
acceptance additions from silently bypassing verification.

Final local verification: all 43 non-browser JS suites, six historical-correction
CJS tests, all ten browser suites and the 295-workout demo generation/replay passed.
Audit reports regenerate byte-for-byte; 50 offline assets resolve. Existing
hand-change prescription output was compared with c7dcfdc and remains identical;
its original policy label is retained. The new selected profile uses its distinct
single-arm label in Settings. Cache and HTML query revision are rc41. Current
commit GitHub checks and actual DEV HTTPS must still be verified after push;
local results are not substituted for those remote checks.

## Dated-evidence and forecast reliability (2026-11-14)

Started clean at origin/preview 2afde54 with all six GitHub checks successful.
The prior RC41 DEV build had passed exact HTTPS asset comparison and mobile
single-arm/offline acceptance; production main remained 4cb58d8. No newer origin
work was present. This batch addresses a shared replay gap across existing
movements rather than adding another variant or claiming new source integration.

Scheduling already excluded future dates in some places, but progression,
prerequisites, movement gaps, profile turns and slot counts still consumed later
actuals. The previous five-year regression checked only that a future import left
positive targets. It now requires the entire dated prescription to stay identical.

Dated records/state replay now carries an evidence cutoff through prescriptions,
prerequisite/descendant maintenance, waves, failures, deloads, absence, supplemental
selection and coordinated programs. Stable original record keys are constructed
before filtering. Current UI and explicit load/cycle review pass today. Unscoped
archive inspection remains available; raw records, backups, original prescriptions,
correction/undo and all V33 storage keys are retained. No date is silently rewritten.
Known unresolved pain retains its original conservative cross-date hold.

A valid future load-reset marker does not apply its pending increase before its
record date. Genuinely missing markers still block progression rather than being
silently repaired. Current equipment, skill flags, policy and unanchored starting
load settings still apply; no historical configuration state is invented.

Unfinished physical debt is reconstructed through the planning date when a block
has future records. The legacy time-budget suite caught an important boundary:
explicit old pending entries unrelated to future debt must remain prioritized.
Those entries are retained alongside earlier physical debt; future unfinished
records cannot replace today's candidate list. The existing future/deferred-work,
chronological fairness, accessory and mobility contracts now pass unchanged.

Calendar forecasts freeze physical evidence at their starting date, even when
planning later opportunities. Only internal empty ordering placeholders may turn
provisional slots. They cannot qualify future supporting practice, increase load
or grant completion. Queue keys and notebook numbering use dated counts while
retaining the stored archive. The existing explanation panel names future-dated
records, says they remain in Training Log and points to date correction.

Focused verification: 432 actual generated workouts over three years, ten dated
snapshots compared against the full later mixed archive, independent single-arm /
hand-change / bodyweight / hinge blocks, missed intervals, reduced
duration/readiness, incomplete and technically failed work, stable keys, backups
and immutable replay. Additional direct cases cover waves, deloads, absence,
future load markers, pain holds, correction/undo, physical debt and freeze-through
forecasts. Future supporting work cannot qualify paired swings/clubs, get-up
ancestry, sliding planks or crawls early. All existing skills/equipment/recency
gates remain intact. No new source prescription, transcript review count or
technique certification is claimed.

Touch acceptance at 320/390 begins with three future records. It corrects two
dates through the actual historical editor, observes the resulting current
progression, keeps the third future record without credit, reloads the original
active draft offline and saves actual bilateral work. The fixture explicitly
records lunge sides; the save safeguard is not bypassed. The first draft of the
test placed a corrected workout yesterday and correctly received a reduced
consecutive-day prescription; spaced dates now isolate ordinary progression.

Final local checks: all 44 non-browser JS suites and six correction CJS tests
passed. All eleven browser suites and 295-session demo generation/replay passed;
broad browser-smoke was rerun on the final compatibility fix and passed all four
widths, including 2,601 saved workouts, quota rollback, import/reload and offline.
Recovery, dated evidence, continuity and exact five-year future-import checks
also passed after final review. All 50 offline assets resolve; generated inventory
and integration reports remain reproducible, with coverage unchanged at 54.
A direct baseline comparison reproduced the original bug: future foundation logs
incorrectly yielded two current single-arm sets; the dated implementation blocks
those sets until supporting practice is available. Cache/query revision is rc42.
GitHub current-commit QA and actual DEV HTTPS verification remain required after
push; local passes alone are not represented as remote verification.


Final Learn-status follow-up: the eligibility gate already used dated evidence,
but its “currently practicing” label still inspected the full raw archive.
That label now uses the same requested-date boundary. Node and touch checks
verify a future-only movement stays Available, then becomes Practicing when real
current work is saved. Explicit self-confirmed Learned flags stay independent;
full Training Log remains inspectable. Cache/query revision is rc43 so existing
offline installations receive the updated learning asset. The preceding 360e875
DEV build matched all 50 HTTPS runtime assets and passed touch date-correction /
offline acceptance at both widths; this follow-up needs its own current-commit
QA and deployment checks before delivery.

## Optional row baseline-fraction volume wave (2026-11-14)

Started clean at latest origin/preview 4b156c5, with all six GitHub checks green.
Re-read the complete indexed #89 horizontal-row transcript. Retained the original
URL, normalized content hash and exact numerical quote anchors in
research/row-wave-evidence.json and the existing row lesson. No new movement or
source-review completion count is claimed: coverage remains 54 programmable
movements, 38 reviewed outlines and 16 partial lessons.

The source gives 60%/80% rep fractions, an 80% day at two-thirds of 60% total
volume, adding sets and an optional 4–6-week review; its example schedules two
days of each type weekly. The opt-in rowWave profile implements the fraction /
volume relationship at a fixed bent-knee bar setup. It explicitly adapts the
baseline to a user-reviewed conservative clean number, rather than requesting a
maximum test. Rolling timing, 2–4 default lower-rep sets, 90-second rests,
whole-rep/whole-set floor rounding and two clean exposures of each track before
joint stage advancement are app decisions. No forced four-day week or automatic
timed retest is imposed. Ordinary reps remain untimed, and no timer grants credit.

Checks over all 196 supported baseline values exposed a meaningful rounding
boundary: some baselines need at least three lower-rep starting sets to fit even
one higher-rep whole set under the volume cap. Too-small explicit set counts are
rejected with the required minimum. Whole higher-rep sets may plateau across a
stage; they never exceed two-thirds of the paired lower-rep target. Integer
fraction arithmetic avoids needless binary decimal rounding at whole targets.

A positive baseline is tied to the reviewed bar height. Changing configured
height blocks the wave pending explicit review; actual geometry changes retain
the immutable original setup but earn no comparison credit. Explicit baseline
changes, same-number restarts, geometry reviews and returns to the profile get
fresh comparison identities, including an A → B → A baseline sequence. This
prevents reviving an obsolete completed cycle. Endpoint maintenance alternates
without advancing targets. The existing fixed-dose profile remains default,
with its original policy identity and history; direct checkpoint comparison
confirmed byte-identical default row plans and prescriptions.

Existing actual-result, pain, recovery, time-fit, dated/evidenceThrough replay,
backup, correction/undo and writer/draft contracts remain. Failed, partial,
changed-setup or reduced work cannot advance this wave. Joint evidence restarts
with lower-rep practice after recovery. Higher-rep does not mean a heavier
external load. Profile settings never certify pull-up readiness or human technique.

Focused verification includes all baseline arithmetic bounds, exact lower/higher
sequence and joint stages, complete endpoints and maintenance, explicit restarts,
old-profile isolation, geometry review, failure/pain/partial/rest/recovery controls,
future-date isolation, source hashes, and historical correction/undo. Two three-year
actual-generator histories save 388 row-only and 431 mixed workouts, including
bar loss/return, height/baseline review, missed intervals, short sessions, reduced
readiness, partial work, technical difficulty, pain and repeated backup validation.
They record 388/142 row exposures, including 179/66 higher-rep exposures.

Touch acceptance at 320/390 begins without bar/skill/profile setup, configures all
through actual Settings, opens the source lesson, completes lower and higher
prescriptions, corrects a changed actual height, restores an original draft
offline, completes the full cycle, explicitly restarts the same baseline and
reviews at a new height. All old records and original heights remain intact.
Physical Android/apparatus/technique verification remains separate.

All 45 Node JS suites and six correction CJS tests passed. All twelve browser
suites and 295-session demo generation/replay passed. Source audits, 50-asset
offline integrity and JavaScript checks pass; audits now list supported optional
profiles rather than only each movement's default. Cache/query revision is rc44.
Current-commit GitHub checks and exact DEV HTTPS verification remain required
following push; local results alone are not claimed as remote verification.

Final focused acceptance also verifies that rejected whole-set fit leaves the
entire saved state unchanged, and saving unchanged Settings preserves wave counts
and policy identity. Numeric checks prove higher-rep whole-set selection is the
largest count under the cap, not merely an arbitrary smaller count. Oversized
normal targets are deferred rather than reduced for credit; explicit reduced
readiness remains nonqualifying. Active-draft station tampering is rejected.

## Shared Settings and Train controls audit

User-directed reliability batch: shared duration replaces the earlier temporary
Train override. Settings, Training Plan and Today’s Adjustments now use the same
saved target. Same-day readiness is shared and dated; it expires to Normal on a
new day, including an open page. Low readiness changes the actual prescription;
Great retains normal progression. Imported valid non-preset targets remain intact.

Both style forms use one validated transformer and preserve the selected source
program. Effective emphasis excludes disabled equipment without deleting owned
loads or stored priorities. Pause, baselines, equipment gates, advanced dose
controls and calendar effects are checked against actual generated output.
Grouped forms retain explicit Save; immediate controls commit through the existing
paired journal with write-failure rollback and reader protection.

Settings and active Train share backed-up interval configuration. Loading a
prescribed interval also saves the shared values; explicit timer opening survives
rendering. Editing a field before Start preserves the click instead of replacing
its target on blur. Existing prescribed pacing now has reachable controls; both
timers pause one another and never grant physical-work credit. Active draft
targets, actuals and pacing remain preserved. Legacy timer settings remain readable.

The new pure shared-control suite and 320/390 touch suite cover both directions,
actual budgets/doses/countdowns, offline reload, JSON restore, midnight expiry,
failed writes and reader handoff. Existing smoke expectations now reflect the
user-authorized persistent target while retaining history/progression checks.
The enhanced crawl integration test loads prescribed values over different saved
custom values and immediately starts after editing. The complete inventory is
46 Node JS suites, six correction CJS tests and thirteen browser suites. Runtime
precache contains 51 assets at rc45-shared-training-controls. See
SETTINGS-CONTROLS-AUDIT.md for the control-to-effect map. Exact-commit CI and DEV
verification are required after push; local checks do not establish remote status.

Local final verification passed: all 46 Node JS suites, six correction tests,
all thirteen browser suites and the 295-session demo/history replay. Source
audits, suite registration, syntax and 51-asset offline integrity also passed.


## Engine-first optional paired-swing rep progression

Incoming preview 494211f was clean and current after fetch. The user prioritizes
engine/background integration and defers frontend redesign. Close-read #142
again and recorded its exact numerical quote and archived source hash separately
in paired-swing-reps-evidence.json. #85/#88 timing-system context was also read;
their full workout series is not reconstructed from missing program sheets.

The existing doubleSwing now offers optional pairedSwingReps: two fixed sets at
6–20 reps, adding two reps per stage after configurable clean exposures, with
90-second rests. Only the approximate start/end rep discussion is source-backed;
sets, intermediate increments, rest, pace and qualification are app choices. This
is deliberately an optional adaptation rather than a source-complete program.
The default method and original admission gates are retained. No new movement,
mandatory load conversion, experience-year certification or frontend redesign.

New-profile comparisons are revisioned. Leaving and returning, or changing then
restoring exposure/stall settings, cannot reuse obsolete endpoint credit. Saving
unchanged programming retains progress. Whole actuals, reduced-work noncredit,
re-entry, matched inventory, explicit load selection, correction/undo, dated
evidence and immutable draft contracts use the existing engine paths. The
existing profile selector exposes the method without new setup questions.

Focused unit verification covers all eight stages, different exposure thresholds,
actual failure/load/rest/recovery cases, endpoint/load reset, original-profile
isolation, configuration return, date bounds and malformed revisions. Two real
three-year generator histories save 415 paired-only / 430 mixed workouts with
140 / 54 paired-swing exposures, both reaching twenty reps, alongside interruptions,
short sessions, partial work, equipment loss and backup checkpoints. A direct
comparison to 494211f confirms identical default prescriptions for all 54
movements and identical plans for every default block. Touch acceptance covers
actual selection, full cycles, correction, offline draft recovery, unchanged Save
and profile-return isolation.

Complete regression inventory is 47 Node JS suites, six correction CJS tests and
fourteen browser suites. Cache/query revision rc46-paired-swing-reps retains the
51 existing runtime assets. Source audits remain reproducible; no instruction
coverage-completion increase is claimed. Exact-commit CI and live DEV checks
remain required after push.

Final local verification passed all 47 Node JS suites, six correction tests,
all fourteen browser suites and 295-session demo generation/replay. Source
audits, syntax, suite registration and 51-asset offline checks passed.


## Engine endpoint maintenance and progression-review reliability

Incoming 0c6ad52 preview was clean/current after fetch. Reproduced two background
errors: an earned swing endpoint still offered a heavier load after a forty-day
absence, and one hard endpoint maintenance record left fail=1 permanently even
after later full clean maintenance. Tests also reproduced zero-set recovery
erasing fail=2 despite no physical work.

Generic replay now evaluates full endpoint maintenance, clears prior difficulty
and updates lastEligibleKey without advancing another stage or cycle. A density
choice anchored to later maintenance replays at that event. Existing source
volume/density tables, source profiles, keys and numeric gates are unchanged.
Generic and row-wave recovery entries need actual sets before clearing failure.

New advancementReview separates earned completion from a new load/density action.
Dated/live actions require a currently unreduced eligible endpoint prescription
and the latest clean full matching method/load/track/target/rest attempt. Reduced,
incomplete or changed-method work blocks the decision until normal endpoint
maintenance is recorded. Matching planned clean light work remains neutral.
Current readiness, absence, pain/skill and inventory checks come from the existing
prescription engine. Undated audit calls deliberately retain full-history
compatibility; all live action callers pass today. Rejections are read-only.

The existing overview reports pending review honestly and hides unavailable
progression actions. No frontend redesign, storage migration, invented source
prescription or production/main change. Written targets, earned cycles and
original records remain; corrections/undo retain their established replay role.

Focused tests cover eight loaded profiles, neutral light work, zero-set recovery
in both replayers, reduced rebuilding, lost inventory/skills, malformed rest,
future isolation, low readiness, long absence, pain resolution, alternate-method
return and density maintenance-anchor correction/undo. The three-year actual
generator history saves 430 workouts, recovers four observed single-failure
maintenance states and makes fourteen explicit allowed load changes. Phone
acceptance covers low readiness and absence, real reduced/hard/clean work, density
selection at the new maintenance anchor, correcting/restoring its actuals and
an immutable offline density draft at 320/390.

Full inventory is 48 Node JS suites, six correction tests and fifteen browser
suites. Worker/query revision rc47-endpoint-reviews retains 51 assets. Exact-commit
CI and DEV verification remain required after push. No increase to the 54-movement,
38-reviewed/16-partial instructional coverage is claimed.

Final local verification passed all 48 Node JS suites, six correction tests,
all fifteen browser suites and the 295-session demo replay. Source audits,
syntax, suite registration and 51-asset offline integrity passed. Initial
prescriptions for all 54 movements and every default block plan match 0c6ad52;
the intended changes depend on recorded maintenance/recovery history.


## Prerequisite comparison boundaries and recency

Incoming preview a978be6 was clean/current after fetch, including recheck after
continuation/date steering. Reproduced a real mismatch: after an earned 8 kg
swing cycle, selected 10 kg, a later reduced 10 kg exposure, loss of that load
and explicit owned replacement back to 8 kg, progression restarted at stage zero
but qualification still counted eight old 8 kg exposures. The recent 10 kg
record made those older records appear current and enabled single-arm practice.

recordsAfterLoadReset now supplies the same chronological/date-cutoff boundary
to progression replay and prerequisite evidence. Future anchors remain inactive
before their date; missing anchors remain blocked. Comparable proof is limited
to the current uninterrupted policy/load comparison, and recency comes from
physical records in that comparison. An intervening recorded method/load attempt
cannot renew an older comparison when the user returns. Normal configured wave
alternation stays within one method, with separate current-weight/track counts.
Matching planned light practice remains neutral.

Descendant maintenance now uses the same scoped child proof. Old child records
before a load reset cannot maintain stale ancestors; after actual requalification,
long-term multi-level maintenance resumes. No parent exposures, progression,
technique confirmation, old records or current active-draft targets are invented.
No new source prescriptions, movement variants or frontend questions were added.

Focused tests cover returned loads and methods, zero/one/two fresh exposures,
dated/frozen evidence, future and missing anchors, wave alternation and malformed
track evidence, planned light/reduced work, correction/undo and multi-level child
reset/requalification. A real three-year mixed generator history saves 430
workouts, makes four returned-load resets and records 74 single-arm exposures.
The five-month maintenance and 432-workout dated archive suites remain covered.
Touch acceptance performs actual Settings inventory removal and replacement,
fresh preparation, corrected/restored physical results, advanced admission and
offline child actuals at 320/390 while preserving all original records.

Regression inventory is 49 Node JS suites, six correction tests and sixteen
browser suites. Worker/query revision rc48-prerequisite-evidence retains 51
assets. Source audits remain reproducible; instructional coverage stays
54 movements / 38 reviewed / 16 partial. Exact-commit CI and live DEV checks
remain required after push. A separate malformed-wave replay lead is recorded
in NEXT-CONTINUATION.md without claiming that prescription issue is fixed here.

Final local verification passed all 49 Node JS suites, six correction tests,
all sixteen browser suites and the 295-session demo replay. Source audits,
syntax, suite registration and 51-asset offline integrity passed. All 54 initial
prescriptions and every default block plan match the a978be6 checkpoint.


## Configured wave loads and heavy-track recovery

Incoming preview acb8285 was clean/current after fetch. Followed the prior batch's
wave lead and read full #228/#403. Preserve their exact archived hashes and quotes
in wave-replay-evidence.json. These sources support lower heavy work, whole
repetitions/sets and long-term alternation; no compulsory universal percentage
or max test is inferred. Existing app progression choices remain explicit.

Reproduced incorrect heavy actuals changing the next configured prescription and
heavy difficulty sticking because generic replay compared heavy targets against
light-stage shapes. Dedicated chronological replay now fixes configured loads,
uses the last qualifying light exposure for the heavy cap and validates each turn
against its actual target. Heavy success clears heavy failure; light progression
and its earned endpoint are preserved. No policy-key migration or new source dose.
Healthy prescriptions across five supported movements and 28 exposures each
(140 total) match the prior checkpoint exactly. Wave stage reporting follows
light progression instead of bouncing between light progress and heavy stage zero.

Incorrect/out-of-turn actuals remain visible but cannot move the wave. Reduced
work may clear matching difficulty only when actually performed; it cannot turn
the wave. Recheck the heavy cap after redistribution/reductions: a 240 kg light
reference, 9 kg heavy load and five-rep normal heavy sets would redistribute to
nine sets of three (243 kg); the corrected whole-set cap permits eight (216 kg).
An impossible heavy set remains blocked, including with low readiness.

Focused verification includes five complete/maintenance wave paths, 442 bounded
weight/rep arithmetic cases, wrong loads on both tracks, partial/rest/technique/
track errors, rebuilding, correction/undo, pain review, future isolation and
nonfinite/zero-set bounds. A real three-year generator history saves 430 workouts
with 66 heavy opportunities and 23 injected difficulty sessions. Phone acceptance
selects the method through Settings, records wrong actual load, corrects/restores
it, performs real intervening unfinished workouts, tests repeated heavy failure
and rebuilding, and restores an immutable offline draft. Original physical work
and unperformed siblings remain intact.

The prior malformed-wave prerequisite regression now asserts the configured
heavy load survives the error and qualification remains blocked immediately
afterward; later genuinely correct configured-track work can restore eligibility.
This updates the test to the repaired behavior rather than preserving the bug.
Inventory: 50 Node JS suites, six correction tests and seventeen browser suites.
Runtime worker/query rc49-wave-replay retains 51 assets. Source audits and exact
DEV/current-commit GitHub checks remain required; no new instructional coverage
completion or production/main change is claimed.

Final local verification passed all 50 Node JS suites, six correction tests,
all seventeen browser suites and the 295-session populated-history replay.
Source audits, syntax, suite registration and 51-asset offline integrity passed.
All 54 initial prescriptions and every default block plan match acb8285; the
140 healthy-wave exposure comparison also matches exactly. The demo retains
all 295 workouts and now reports three real swing-stage increases rather than
98 changes caused by the previous heavy/light stage-display bounce.


## Delivered deload cadence and long-term normal-work resumption

Incoming preview 60da8f3 was clean/current after fetch; production main remains
4cb58d8a4d30796246a83db752b8e420c8bc05c2. Reproduced the optional lighter-exposure
setting repeatedly selecting deload after later neutral light/partial work, since
the lifetime qualifying count remained exactly divisible by its interval. In
A/B/C this can alternate deload and light indefinitely without normal progression.

Count full qualifying normal work after the last delivered planned deload, within
the current method/written-load comparison and explicit reset/date bounds. Actual
load mistakes at the same written load cannot erase the interval. Re-evaluate
structured deload actuals against their written target, technique, rest, load and
setup; retain valid legacy aggregate evidence without inventing sets. Only
actually delivered clean deload work services the interval. It remains neutral
for progression. Reduced/partial work neither counts nor retriggers it.

Apply the existing generic option to density and earned maintenance as well as
volume. Reduce single-set reps/time when possible; explain irreducible whole-unit
minimum practice. Preserve heavy-wave caps and endpoint review. Default interval
zero remains disabled. This is app cadence consistency, no new source prescription.
No history migration, policy-key change, V33 storage change or archive rewrite.

Focused coverage includes multiple loaded/bodyweight/timed/wave methods, partial/
zero/quality/pain/rest/load/station failures, correction/undo, future/frozen
evidence, load replacement, method changes, legacy evidence and interval bounds.
Two three-year actual-generator simulations save 430 workouts each: A/B/C records
124 delivered deloads and 776 normal qualifying movement results; mixed blocks
record 82 deloads and 539 normal qualifying results. A/B/C reaches its earned
endpoint instead of trapping before it.

Phone acceptance at 320/390px changes the real Settings control, performs the
resulting deload, records partial work, corrects/restores the deload in History
and resumes a real normal workout from an immutable offline draft. Prior actual
history stays byte-identical. Inventory: 51 Node JS suites, six correction tests,
eighteen browser suites; cache rc50-deload-cadence retains 51 runtime assets.
Final local verification passed all 51 Node JS suites, six correction tests and
all eighteen browser suites, including the 295-session populated-history replay.
Both source audits, syntax, suite registration and 51-asset offline integrity
passed. All 54 initial prescriptions and every default block plan match 60da8f3
with cadence disabled. Exact-commit CI and public DEV verification remain required
before reporting deployment success.


## Recovery work fractions across single-set methods

Incoming preview 7385c06 was current/clean after fetch. Reproduced a one-set
six-rep fixed row staying 1×6 both at 25% low readiness and 50% re-entry, despite
claiming reduced work. A two-set target also stayed two sets at 75% low readiness
because of upward rounding. These made configured recovery settings ineffective.

A shared whole-unit reduction now uses reps/time for single-set practice and
bounds low-readiness rounding below all normal sets for a fraction below one.
Keep the established multi-set half-dose rounding, familiar loads/rests, source
normal doses, timing/bilateral requirements, policy identities and V33 storage.
Combined low readiness and re-entry take smaller quantities; a return cannot
expand prior reductions. The helper also serves planned deloads without changing
their dose policy. Explain irreducible minimum practice and imported fraction 1;
never label either as a smaller dose. Both remain non-advancing. Inactive
baselines and impossible heavy targets stay blocked; heavy caps remain enforced.
Settings labels now accurately call these work fractions. No source-dose claim.

Focused coverage checks 504 fraction/shape/combined-condition cases, all 54 current
movement prescriptions, single-set fixed rows, higher-rep row waves, timed practice,
get-up drills/total time, minimum heavy work and impossible heavy work. Absence,
pain review, original-target correction/undo and future evidence are covered. A
three-year actual single-set generator history saves 430 workouts, with 41 reduced
and 380 normal qualifying movement results. Backups validate throughout.

Phone acceptance at 320/390px changes the actual Settings fractions, uses both
shared readiness controls, checks real 25%/75% targets, reloads a stopped offline
draft, rejects active-program edits, logs recovery and a partial absent return,
corrects the actual return and resumes normal work. Original history/policy identity
remain intact; reduced work never advances a cycle. Inventory is 52 Node JS suites,
six correction tests and nineteen browser suites; rc51-recovery-dose has 51 assets.
Full local suites, exact-commit CI and public DEV checks remain required.

The follow-up Settings check found a valid imported fraction outside the preset
list was unselected, so Save could replace it with the first option. The shared
training-default select retains valid saved values as selected saved options.
Phone tests preserve imported recovery 1, re-entry .6 and load-jump .3 through
a real Save before exercising reduced fractions. This prevents incidental data
replacement; it does not broaden validation or rewrite stored history.
All 54 normal initial prescriptions and every default block plan match 7385c06.

Final local validation passed all 52 Node JS suites, six correction tests and
all nineteen browser suites, including populated 295-session history. The endpoint
UI check caught a readiness wording compatibility assertion; preserve its existing
Reduced readiness phrase while avoiding a false less-work claim, and rerun the
endpoint suite successfully. Focused recovery/endpoint Node checks also passed
after that wording adjustment and the inactive-row-baseline assertion. Both source
audits, syntax, suite registration and 51-asset offline integrity passed.
Exact-commit CI and DEV verification remain required before reporting deployment.


## Unset-load setup across recovery and coordinated plans

Incoming preview 20faeec was current/clean after fetch. Reproduced low readiness
and explicit re-entry replacing zero-load baseline mode with recovery/return mode.
A coordinated A/B/C + unloaded-hinge plan then preferred three zero-weight loaded
targets over real unloaded preparation. Setup-only omission depended on the mode
that recovery had just overwritten.

Adapt low-readiness/return work only when the loaded movement has a working load.
Keep single-block baseline setup; coordinated plans also reject executable
zero-load targets independently of their mode. Preserve zero-set prerequisite
classification and unresolved pain holds. Explicit owned starting-load selection
then activates real loaded recovery; no invented load or weakened established-load
guard. Familiar positive-load and normal source prescriptions remain unchanged.

Classify old non-bodyweight zero-load placeholders with no actual sets as setup
for dated pending work and unfinished-block priority, including earlier recovery/
return labels. Do not rewrite history or remove real physical work. Keep positive
actuals, genuine partial loaded work, bodyweight work and explicit/legacy pending
work. Future setup cannot clear today's real debt. Correction/undo restores the
same distinctions; pain review remains independent of setup.

Focused coverage includes 60 unset-load cases, persisted readiness, explicit
owned-load transition, five legacy reduced-mode placeholders, genuine partial
work and historical actual preservation, correction/undo, pain review, prerequisite
classification, future isolation and read-only forecasts. A real three-year mixed
generator run starts with low-readiness/return on day zero, later sets familiar
loads explicitly, removes/restores equipment and includes missed/partial work.
It saves 437 workouts: 194 with unloaded practice and 243 with loaded work.

Phone acceptance at 320/390px changes shared readiness, trains unloaded preparation
instead of zero-weight loaded work, sets the actual owned press load in Settings,
starts non-advancing loaded recovery and restores its untouched offline draft.
Original history is preserved. Inventory is 53 Node JS suites, six correction
tests and twenty browser suites; rc52-load-setup retains 51 offline assets.
Full local suites, exact-commit CI and public DEV verification remain required.

Configured-prescription compatibility check: all 54 movements across normal, low
readiness, explicit re-entry and combined conditions match 20faeec exactly (216
comparisons), as do every default block plan. This repair changes unset-load
setup and false queue debt, not familiar configured doses or source programming.

The existing partial-workout regression caught missing legacy load metadata being
mistaken for zero. Tighten setup-only inference to explicit numeric zero with no
actual sets. Missing metadata remains unknown and its pending work stays intact;
add a focused assertion and rerun the complete Node suite. No history is changed.

Final local verification passed the complete 53 Node JS suites and six correction
tests, plus all twenty browser suites and the populated 295-session history.
The legacy-metadata fix was included in a complete Node rerun; broad browser smoke
also passed again afterward, including 2,601-session history and quota rollback.
One replacement-load browser run timed out locating its control; isolated state/UI
diagnostics and the unchanged complete workflow passed on rerun. Keep exact-commit
CI as the final independent check. Source audits, syntax, suite registration and
51-asset offline integrity passed. Public DEV verification remains required.


## Reviewed-baseline push-up and row comparison identities

Incoming preview 6ef7300 was current/clean after fetch. Reproduced push-up and
row-wave exposure settings changed from two to three then back to two reviving
older stage progress. Push-up baseline changes had the same weakness; row baseline
reviews already reset, but other cycle-defining row settings could revive credit.

Compare each proposed effective cycle at the prior revision. Changed cycle
settings create a newer identity; unchanged effective Save retains existing keys
and evidence, including revision-zero imported histories. Preserve explicit newer
review revisions, so same-number review advances once and changed-number review
does not advance twice. Push-up revision validation now uses safe integers like
row waves; revisions cannot be lowered or silently overflow. No record rewrite,
policy-key migration or fixed-dose row-history change.

Read full #609 and #89 source text. Preserve existing push-up EMOM volume, rep
fractions, row lower/higher work relationship, rests, timing and qualification.
This is app comparison consistency; it does not impose source max tests or a
calendar-based retest schedule. Existing source/lesson coverage counts stay put.

Focused verification includes eleven changed/restored settings, baselines with
identical rounded reps, no-op defaults/saves, inactive/reactivated push-ups, old
earned endpoints, explicit same/changed-number reviews, revision bounds, correction/
undo, future/frozen evidence, backup compatibility and independent fixed row history.
A three-year real generator history saves 430 workouts, with 141 push-up and 144
row movement results and four explicit annual baseline reviews.

Phone acceptance covers both methods at 320/390px through actual Settings changes,
no-op Save, fresh recorded work, historical corrections/restoration, explicit
same-number review and immutable offline drafts. Original physical history stays
intact; active programming edits remain blocked. Inventory is 54 Node JS suites,
six correction tests and twenty-one browser suites. Worker rc53-baseline-cycles
retains 51 assets. Full local, exact-commit CI and public DEV checks remain required.

No-op normalization additionally checks 993 supported baseline/fraction/step
combinations, including inactive baselines and rounding-dependent row starting
sets. All retain their original key when effective settings are unchanged.
All 216 configured initial prescriptions (four readiness/return conditions across
54 movements) and every default block plan match 6ef7300 exactly.

An existing row browser test immediately reloaded after tapping Save; add an
explicit check of live and persisted row settings before reload. The full
row-wave workflow then passes at both phone widths. No save/reload assertion is
removed and no retry click is added. The refreshed local environment's missing
HTTP server was restarted and verified before the browser run.

Final local verification passed all 54 Node JS suites, six correction tests and
all twenty-one browser suites, including the populated 295-session replay.
Focused baseline coverage also passed after adding the 993 no-op combinations.
Both source audits, syntax, suite registration and 51-asset offline integrity
passed. Exact-commit CI and public DEV remain required before reporting deployment.


## Shared rolling weekly training capacity

Incoming preview f9bebd8 was current/clean after fetch. Reproduced a valid saved
seven-day request and three-day maximum producing seven forecast opportunities
in its first week. Actual engine planning would then reject extra days as they
were recorded. Calendar frequency had ignored maxTrainingDays and the existing
strength-style capacity, while frozen projection placeholders spent no engine
physical-day capacity.

Extract the existing rolling-week formula to weeklyTrainingLimit and use it for
calendar effective frequency. Preserve the saved requested frequency, default
three-day calendar behavior, actual engine capacity and all numerical source
prescriptions. Distinct actual and proposed dates share each projected seven-day
window. No simulated work or progression is recorded. Before observed cadence
exists, retention fallback now respects the effective configured capacity.
No new universal source frequency or forced catch-up schedule is added.

Focused checks cover 196 frequency/maximum/style combinations across twelve
weeks, original defaults, real partial work, same-day duplicate sessions, changed
limits without history rewrites, corrections/undo, manual moves, activity recovery,
pauses, future evidence and read-only forecasts. A three-year actual mixed run
with limits changing from three to two to four, missed/partial work and hard bike
rides saves 424 workouts and validates nine forecast/backup checkpoints.

Phone acceptance uses both Settings and Train requested-frequency controls,
changes maximum capacity, records three actual workouts, checks the next rolling
boundary, raises/lowers the cap without changing history, restores an immutable
offline draft and rejects active programming changes. Requested days remain
intact. Inventory: 55 Node JS suites, six correction tests and twenty-two browser
suites; rc54-weekly-limits retains 51 assets. Full local suites, exact-commit CI
and public DEV remain required.

Compatibility comparisons pass all 216 configured initial prescriptions, every
default block plan and 25 calendars whose weekly maximum is not binding against
f9bebd8. Updated calendars also tolerate an older engine module during worker
startup; a focused module-boundary check verifies the same capped forecast.

Final local verification passed all 55 Node JS suites, six correction tests and
all twenty-two browser suites, including the 295-session populated-history replay.
Focused phone acceptance passed at 320/390px, including explicit discard of its
synthetic unfinished draft without adding history. Both source audits, syntax,
suite registration and 51-asset offline integrity passed. Exact-commit CI and
public DEV verification remain required before reporting deployment.


## Full reduced-work delivery and post-review return evidence

Incoming preview 7cd005a was current/clean after fetch. Reproduced two hard swing
attempts followed by one set of a two-set rebuild clearing fail from two to zero,
even though performed was false. Also reproduced a wrong-load press return
(performed true but actual 10 against written 8) clearing reviewRecovery after
explicit review. Similar reduced replay conditions trusted any positive set.

Generalize the existing deload delivery evaluator to shared deliveredReduced.
Use it for generic, row-wave and configured-wave difficulty recovery, deload
cadence and the existing performed re-entry/recovery acknowledgement after review.
Recheck structured actuals against their saved target, load, setup, bilateral work,
pacing and continuous requirements. Preserve valid legacy aggregate quantities;
missing targets cannot acknowledge delivery. Existing current-track checks and
wave caps remain. Reduced work never earns ordinary progression credit.

Keep the user's explicit review decision, unresolved pain hold, generic actual-
load comparison rules and all recorded work/prescriptions. Corrections/undo and
dated/frozen replay recalculate delivery without rewriting original targets.
This repairs app evidence consistency; no source numerical dose or medical
clearance claim is added.

Focused verification checks 57 incomplete cases across eleven method/track
contexts, including positive partial work, rest/timing/continuity/setup errors,
review returns at wrong loads, quantitative legacy summaries, absent targets and
future isolation. A three-year actual mixed generator saves 430 workouts with
374 reduced movement results, 69 incomplete. Backups validate throughout.

Phone acceptance at 320/390px records a genuine partial rebuild and wrong-load
post-review return, verifies retained flags, corrects/restores actuals repeatedly,
checks zero cycle credit and preserves original history/offline draft targets.
Compatibility checks match all 216 initial prescriptions, every default block
plan and 224 full matching/recovery/rebuild/return trajectory targets to 7cd005a.
Inventory: 56 Node JS suites, six correction tests and twenty-three browser suites;
rc55-reduced-evidence keeps 51 assets. Full local, exact-commit CI and public DEV
verification remain required.

Final local verification passed all 56 Node JS suites, six correction tests and
all twenty-three browser suites, including the 295-session populated-history
replay. Both source audits, syntax, suite registration and 51-asset offline
integrity passed. Exact-commit CI and public DEV verification remain required
before reporting deployment success.


## Persisting unfinished physical returns

Incoming preview dd20947 was current/clean after fetch. Reproduced normal swing
work on January 1, an absent return on February 1 with only one of two prescribed
sets done, and February 2 offering the full three-set normal dose. movementGap
correctly recorded attendance, but no separate state retained the unfinished
return obligation. Redefining attendance as clean completion would incorrectly
call regular difficult practice an absence, so preserve that distinction.

Derive reentryPending from dated movement history. Incomplete/failed or mismatched
re-entry remains pending until clean reduced work is delivered. Later genuinely
successful ordinary history can settle the physical return; preserve its meaning
without inventing credit. The reviewed-pain requirement remains separate and
strict. Exclude setup-only zero-load/zero-set legacy placeholders. Keep working
load comparisons, source doses, record keys and V33 schema unchanged.

Use the pending flag in prescriptions and movement status/narrative. Normal/great
readiness cannot silently enlarge an unfinished return into ordinary work. New
workout targets still reflect current programming; already-written prescriptions
and active drafts remain immutable. Corrections/undo and date/future cutoffs
recalculate the state without rewriting original physical work.

Focused coverage checks 46 interrupted cases across nine methods, actual load
changes, rest/timing/continuity/station errors, ordinary and aggregate legacy
completion, zero-load setup, regular difficulty, separate reviewed-pain evidence
and correction/date boundaries. A three-year actual mixed generator saves 430
workouts with 302 return movement results and 21 interrupted returns.

Phone acceptance at 320/390px uses a dedicated configured fixed-row block, logs
a positive partial return, verifies readiness cannot bypass the reduced target
and that progress status agrees, completes a real retry from an immutable offline
draft, corrects/restores that completion and resumes ordinary progression.
Original history stays intact. Inventory is 57 Node JS suites, six correction
tests and twenty-four browser suites; rc56-return-continuity retains 51 assets.
Full local suites, exact-commit CI and public DEV verification remain required.

Compatibility checks match all 216 initial prescriptions, every default block
plan and 224 complete ordinary/recovery/rebuild/return trajectory targets against
dd20947. The browser fixture uses a one-movement row block so unfinished A/B/C
load setup cannot obscure this return-specific workflow.

Final local verification passed all 57 Node JS suites, six correction tests and
all twenty-four browser suites, including the 295-session populated-history
replay. Both source audits, syntax, suite registration and 51-asset offline
integrity passed. Exact-commit CI and public DEV verification remain required
before reporting deployment success.

## Effective emphasis and included-family practice

Incoming verified checkpoint: 2ebdcf6. Fetched origin/preview and confirmed the
same commit before editing; retained the newer work after the original c7dcfdc
handoff. Production main remains 4cb58d8a4d30796246a83db752b8e420c8bc05c2.

A short 25-minute A/B/C example exposed a real priority mismatch: the display
showed Major bodyweight / Minor clubs as 75/25, but saved Major KB/complex levels
continued to dilute the generator's family weights after those implements were
excluded. Changing only excluded priorities changed the actual workout. The
planner now consumes the display's canonical effective weights. Historical
physical work in excluded or Off families likewise does not dilute current
emphasis. Owned equipment, stored levels and actual history remain retained.

Lifetime movement progression, pain/skill/setup gates, deferred priority and
four-skipped-session fairness remain independent. Relative shares are not exact
delivered workout quotas. No source dose, movement policy identity or storage key
changes. A proposed eight-week accounting window was rejected during full QA:
club/bodyweight synthetic re-entry rose to 211, violating the unchanged bound of
200. The effective-weight fix alone produced 138 in the same diagnostic. Keep
lifetime accounting until future window/cadence work passes the existing bound.

New Node coverage includes eighteen excluded-priority combinations across two
gear configurations, actual active-priority selection, excluded physical history,
preserved earned progression and archives, backups, future/zero evidence,
recovery and a three-year actual-generator history with changing priorities,
equipment inclusion, short sessions, partial work and low readiness.
The focused test fails against the incoming engine. A separate baseline comparison
preserved all 216 per-movement prescriptions and 96 initial all-included block
plans across four durations.

New 320/390px touch acceptance exercises Train → Settings and Settings → Train,
actual target changes, excluded priorities leaving the plan invariant, guarded
unfinished prescriptions, preserved equipment/history, real completion and
offline reload. CI registers both new suites; inventory is 58 Node JS suites,
six correction tests and twenty-five browser suites. Worker/query revision
rc57-emphasis-evidence keeps the same 51 runtime assets. Source audits remain
54 movements / 38 reviewed outlines / 16 partial lessons. Exact-commit CI and
public DEV checks are required before reporting deployment success.

Full browser QA also exposed an existing test-startup race after the 2,601st
workout reload: quota injection ran before asynchronous writer initialization,
so it exercised read-only protection instead of quota rollback. The smoke test
now requires storageReady and storageWritable before injection; all original
rollback/data-preservation assertions remain. No writer-lock behavior changed.

Final local verification passed all 58 Node JS suites, six correction tests and
all twenty-five browser suites, including four-width smoke, 2,601-workout
quota rollback and 295-session populated-history replay. Both source audits,
syntax, CI suite registration and 51-asset offline integrity passed. Production
and storage namespaces remain unchanged; current-commit remote checks still
must pass before this batch is reported as a verified DEV deployment.


## Light-station progression evidence

Incoming verified checkpoint: b1dcec0. Fetched origin/preview and confirmed a clean
synchronized tree and all six existing CI checks. Production main remains
4cb58d8a4d30796246a83db752b8e420c8bc05c2. Source and integration audits remain
54 movements / 38 reviewed outlines / 16 partial lessons.

A changed-setup light row was being treated as neutral progression evidence solely
because its physical target was performed. One normal exposure, a light exposure
at another bar height, then a normal exposure advanced the stage, despite existing
prerequisite evidence rejecting the changed geometry. The generic replay now
requires clean matching-setup light practice for neutrality. Changed setup follows
the existing comparison branch: interrupt the streak, retain earned stage and
physical actuals, and do not add a technique failure. Light work never receives
ordinary cycle credit. Row-wave already had the stricter neutral check.

New Node coverage checks six height/row-leg/step-pattern cases across rows and both
step-up variants, clean matching-light preservation, correction/undo restoration,
immutable written targets, backups, dated evidence and read-only forecasts. It
reproduces the incoming bug. A genuine engine-generated consecutive-day light row
exercises the actual scheduling route. A three-year stress fixture generates 671
actual workouts with 317 changed-station light entries and thirteen backup/forecast
checks, using the supported six-exposure setting to exercise repeated comparisons.
This synthetic stress schedule is QA evidence, not a source-authored program.

New touch acceptance at 320/390px executes an actual generated light row at changed
height, confirms that a later normal target remains at the current stage, then
corrects/restores geometry and verifies progression replay. Original history,
station preferences and written prescriptions remain unchanged. A new unfinished
workout survives offline reload with unchecked actuals. Baseline comparison keeps
216 initial movement prescriptions, 96 initial block plans and 84 clean same-
station normal/light trajectory states identical to b1dcec0.

CI registers both new suites: 59 Node JS suites, six correction tests and twenty-
six browser suites; coverage counts 61 Node/setup files. Worker/query revision
rc58-station-light retains 51 runtime assets. No storage/schema migration, source
dose rewrite, production change, main merge or Git history rewrite. Full local
suites, exact-commit CI and public DEV verification remain required.

Final local verification passed all 59 Node JS suites, six correction tests and
all twenty-six browser suites, including new touch station-light acceptance and
the 295-session populated-history replay. Both source audits, changed-file syntax,
CI suite registration, diff checks and 51-asset offline integrity passed. Remote
CI and public DEV still require exact-commit verification before reporting success.


## New review requires new return evidence — November 16, 2026

Incoming verified checkpoint: 5c13f55. Fetched and confirmed origin/preview and a
clean working tree. Preserved all newer history since c7dcfdc. Production main
remains 4cb58d8a4d30796246a83db752b8e420c8bc05c2. Required release/data/training
and coverage handoffs remain authoritative.

Reproduced a real history-correction path: record normal work and a later clean
recovery entry, then correct the older entry to report pain and explicitly review
it. The old recovery previously cleared the new review immediately, allowing a
normal target despite the user's decision to resume with reduced work. New reviews
now snapshot existing reentry/recovery keys in optional priorReturnKeys metadata.
Existing entries cannot acknowledge a new decision, including when corrected or
redated. New clean full return work can. Repeating a review with no new unresolved
pain preserves the decision instead of restarting it. Legacy review metadata keeps
its existing interpretation; no storage version or mandatory migration changes.

A linked gap allowed old clean prerequisite work to qualify a dependent movement
while the parent still required its reviewed return. Prerequisite readiness now
honors reviewRecovery, and reviewed descendants cannot maintain older supporting
practice until their own return is delivered. Registry edges, skill confirmations,
source doses, actual exposure counts and earned stages remain unchanged.

New Node coverage reproduces both gaps across seven generic/timed/continuous/row-
wave/configured-wave contexts. It checks old partials later corrected to complete,
new partial/full return work, repeated reviews, future imports, date cutoffs,
correction/undo, immutable written history, idempotence and optional/legacy backup
validation. A three-year actual-generator history saves 430 workouts, fourteen
retrospective reviews and fourteen new completed returns with seven backup/forecast
checks. These are synthetic app tests, not physiological outcome claims.

New 320/390px touch acceptance performs the actual review/resume decision after
older recovery, confirms incomplete new return stays pending, reloads an untouched
return draft offline, records its genuine completion, and corrects/restores that
evidence. Earlier history, station preferences and written targets remain intact.
CI registers both suites: 60 Node JS suites, six correction tests and twenty-seven
browser suites (62 Node/setup files). Cache/query rc59-review-return retains
51 runtime assets. Source coverage stays 54 movements / 38 reviewed / 16 partial.
Full local suites, exact-commit CI and public DEV verification remain required.

Final local verification passed all 60 Node JS suites, six correction tests and
all twenty-seven browser suites, including four-width smoke, quota rollback,
295-session populated history and the new mobile review/return workflow. Both
source audits, syntax, suite registration, diff checks and 51-asset offline
integrity passed. Baseline comparison preserved 216 initial prescriptions and
96 initial block plans. Exact-commit remote checks and public DEV verification
remain required before reporting deployment success.


## Configured-wave cycle comparison identity

Incoming verified checkpoint: 3d0891e; fetched origin/preview and confirmed the
clean synchronized tree. Preserved newer work after c7dcfdc and production/main
boundaries. Read the release/data, engine, coverage and continuation handoffs.

Reproduced progress revival: four actual wave exposures earn stage one; change
the configured load pair, then restore the old pair. The incoming engine restored
stage one and its larger next target despite the intervening saved comparison.
Wave settings now use safe comparison revisions, aligned with the earlier
push-up/row-wave baseline fixes. Effective changes to light/heavy weights, heavy
reps, exposure count or stall strategy create a newer comparison. Effective no-op
saves preserve evidence and canonical defaults; legacy/first-use zero-revision
keys remain unchanged. Positive revisions wrap the original key explicitly.

Re-entry from another profile scans retained legacy/custom and revised wave keys
and begins after their highest revision. This works for older records without a
profile field. Active-wave revisions cannot regress or overflow; comparisons remain local to
the movement. Old actuals, corrections and written targets remain intact. Source
#228/#403 relationships, heavy-work caps, normal single-load programming and global
pain/review/return decisions remain independent. No invented source prescription
or mandatory periodic review is introduced.

New Node coverage exercises twenty-five setting round trips across swing, squat,
press, row and clean; equivalent saves, profile re-entry, legacy/custom keys,
revisions, backups, old-cycle correction/undo and new-cycle date correction.
Configuration changes cannot bypass a pain hold or pending reviewed return. A
three-year actual-generator history saves 430 workouts, 66 heavy exposures and
two explicit annual configuration-review round trips, with seven read-only
forecast/backup checks. Those timing choices are synthetic QA, not app defaults.

New 320/390px touch acceptance edits/restores actual wave settings, saves unchanged
values without resetting, starts the genuinely fresh three-set light target,
reloads its unchecked draft offline, completes it, switches away/back and confirms
a fresh wave after the retained recorded revision. Earlier history and equipment
remain unchanged. CI registers both new suites: 61 Node JS suites, six correction
tests, twenty-eight browser suites (63 Node/setup files). Cache/query revision
rc60-wave-cycles retains the same 51 runtime assets. Source counts remain
54 movements / 38 reviewed outlines / 16 partial lessons. Full local suites,
exact-commit CI and public DEV verification remain required.

Final local verification passed all 61 Node JS suites, six correction tests and
all twenty-eight browser suites, including new wave-cycle touch acceptance and
the 295-session populated-history replay. Both source audits, syntax, suite
registration, diff checks and 51-asset offline integrity passed. Baseline comparison
kept 216 initial prescriptions, 96 initial block plans and 140 unchanged-wave
trajectory states identical to 3d0891e. Exact-commit CI and public DEV checks remain
required before reporting deployment success.


## Organized engine knowledge and source #84 timed hip practice

Incoming verified checkpoint: 7af7664. Fetched origin/preview and confirmed a clean
synchronized tree and six passing existing CI checks; production main remains
4cb58d8a4d30796246a83db752b8e420c8bc05c2. Read the release/data, development, training,
coverage and continuation handoffs. Preserve source accounting boundaries.

The user requested continuing engine work with an update on knowledge organization.
ENGINE-KNOWLEDGE-STATUS.md now describes the source → admission → coordination →
prescription → actuals → replay → recovery → persistence pipeline, working method
families, actual prerequisite edges and remaining limits. It distinguishes the
720-record inventory/719 usable records from 54 operational movement paths and
38 reviewed/16 partial instruction outlines. Recent reliability fixes improve
integration but do not close broader curriculum or source-programming gaps.

Reviewed #84's archived technique and timed-example text. The existing rep-based
hip method was an app alternative; a separate opt-in hipDropTimed method now
implements its whole 30-second alternating example. Both actual seconds and
actual positive balanced hip-touch counts are required. Either side can lead;
8–12/30-touch descriptions are not quotas. Two to four bouts, 60-second rests,
clean-exposure gates and recovery/continuity choices remain app adaptations.
Source quotes, normalized hash, facts/decisions and boundaries are recorded in
research/hip-drop-timed-evidence.json. No source timestamp is invented.

The method uses existing ground/ABC routes, familiarity, actual-result replay,
pain/review/absence, dependent-movement gates, correction/undo, owned-zero-load
validation, time budgeting and offline persistence. Timers supply pacing only.
Multiple total-time bouts reduce their set count during recovery; existing
single-set get-up time reduction is unchanged. Default rep keys/behavior stay
unchanged, and single-hand practice gains no automatic timed target or credit.
Rep-only settings fields hide for timed selection; no new setup questionnaire.

Node acceptance checks the source hash/quotes, whole-bout time, either leading
side, no speed quota, incomplete/missing/unequal actuals, load/quality/pain gates,
all pacing modes without completion credit, separate methods, prerequisite
qualification without child progression, reduced work, corrections, future dates,
backups and forecasts. A three-year mixed actual-generator history saves 430
workouts, 153 timed entries, nine reduced timed entries, 80 single-hand entries
after explicit familiarity confirmation and seven backup/forecast checks. These
are synthetic integration evidence, not physical or clinical outcomes.

Touch acceptance at 320/390px selects the new method, runs a genuine 30-second
work interval without recording physical work, logs incomplete then full actuals,
replays historical time corrections, retains independent old rep progress and
reloads untouched timed drafts offline. CI registers both suites: 62 Node JS
suites, six correction tests, twenty-nine browser suites (64 Node/setup files).
Cache/query rc61-hip-timed retains 51 runtime assets and V33 namespaces.
Instructional counts are unchanged; this adds supported programming depth.

Final local verification passed all 62 Node JS suites, six correction tests and
all twenty-nine browser suites, including new timed-method touch acceptance and
the 295-session populated-history replay. Both source audits, provenance and
instruction safeguards, syntax, suite registration, diff checks and 51-asset
offline integrity passed. Compatibility comparison preserved 216 existing
initial prescriptions, 96 default plans and 56 existing rep/get-up normal,
recovery and return targets. Exact-commit CI and public DEV still require
verification before this batch is reported deployed successfully.


## Capacity-aware mixed-program day feedback

Incoming verified checkpoint: 4b5e600. Fetched origin/preview and confirmed a clean
synchronized tree. The user prioritizes curriculum coherence and source knowledge
that actually works with the training engine. Release, data, training, coverage
and continuation boundaries remain authoritative; production/main is untouched.

Existing feedback estimated the interval between block visits, ignoring days
inside a block. With A/B/C plus two one-day programs at three days/week, each
block can recur weekly while an individual A/B/C day recurs every 21 days. New
composition.cadence.rotation records a simple ready-program round-robin estimate
using actual program-day counts, shared effective weekly limits, and no faster
than recent recorded pace when four training days exist. It excludes currently
blocked candidates and preserves saved selections. The older block-visit estimate
remains distinct and now counts ready blocks. Existing observed movement warnings
retain priority over this structural estimate.

Feedback appears through the existing “Why this workout?” explanation, with the
effective rate and currently ready program count. It is a planning estimate, not
a source prescription, health rule, movement-specific prediction or complete
capacity solver. Internal pattern rotation, future qualification and exact
movement fit remain separate. No program selection, prescription, dose, credit,
recovery threshold or historical record is changed by the feedback.

Integer counts are multiplied before division so an exact 35-day boundary
cannot become 36 days through floating-point rounding.

Node verification covers thirty frequency/cap/style combinations, narrower
rotations, blocked/paused candidates, sparse observed pace, future isolation,
backups and read-only forecasts. Eighteen actual unprioritized workouts reproduce
the 21-day A/B/C recurrence. A three-year actual mixed history saves 335 workouts
through station removal, changed weekly caps, short days, low readiness, partial
work and six forecast/backup checks. 426 opportunities carry an explanatory note;
these counts are synthetic QA, not user outcome claims.

Touch acceptance at 320/390px removes/restores a program, changes shared requested
frequency, changes the maximum, and checks matching three/seven opportunities per
week. It verifies untouched offline drafts, saved capacity snapshots and genuine
work logging. CI registers both new suites: 63 Node JS suites, six correction
tests and thirty browser suites (65 Node/setup files). Cache/query revision
rc62-rotation-capacity retains 51 runtime assets. Source inventory remains
54 operational movements / 38 reviewed outlines / 16 partial lessons.

Final local verification passed all 63 Node JS suites, six correction tests and
all thirty browser suites, including the new capacity-control scenario and the
295-session populated-history replay. The focused Node/mobile suites were rerun
after tightening whole-week arithmetic and clarifying shared-movement coverage.
Both source audits, syntax, suite registration, diff checks and 51-asset offline
integrity passed. Compatibility comparison preserved 216 prescriptions, 96
single-block plans and 72 composed selections/targets excluding advisory metadata.
Exact-commit CI and public DEV verification remain required before deployment
success is reported.


## Actual protected-core capacity and conservative Wildman audit — November 22

Fetched and inspected actual origin/preview at d8a8e95, including the Wildman gate,
evidence checker and protected-core advisory commits. The original checkout still
contained an interrupted cat-crawl batch. Preserved it unchanged and created an
isolated worktree at /workspace/strength-lab-engine from the latest remote.
Production main remains 4cb58d8a4d30796246a83db752b8e420c8bc05c2.

Reproduced two baseline failures: gate statuses were capitalized in Markdown but
the checker only accepted lowercase; and calendar/notebook projections removed
a protected core from their temporary block list while retaining its required
coreBlock. Settings also rebuilt composition without retaining the core. New
behavior tests first reproduced the invalid forecast. These paths are repaired.
A blocked optional remainder now also restores the saved selection for ordering
instead of permanently freezing an otherwise ready legacy calendar.

Actual selection now reserves opportunities for an explicitly selected core. The
app capacity fraction uses effective weekly capacity, no faster than observed
attendance, the configured return window and the greater of formal program days
or observed movement recurrence measured in core visits. Deferred work therefore
cannot be assumed to fit one visit per formal day. Existing unfinished work,
readiness, prerequisites, pain, spacing and equipment checks remain mandatory.
Ordinary consecutive reservations are bounded when another block is ready, except
when the core alone consumes the available capacity. No additional sessions,
catch-up dose, component credit or load advancement are invented.

The existing Primary program control supplies a core when selected for coordinated
training; valid saved cores survive unchanged saves. No new setup question is
added. Protected-core plans use the chosen total duration as a hard ceiling,
including eight-minute preparation and ten-minute cooldown. Unprotected legacy
plans retain their old flexible fitting and remain an explicit open issue.

Full #404/#548/#606 text supports retaining foundations and complementary program
tradeoffs, not this numerical reservation rule. Facts, hashes, exact quotes, app
adaptations and limits are in research/core-composition-evidence.json. The initial
45-minute, three-day/week scenario returns A/B/C within fourteen days while
serving both developing blocks. This does not prove every core is sustainable.

Final 27 two-year actual-generator diagnostics cover 30/45/60 minutes, 2/3/5 days,
single kettlebells, clubs and bodyweight, missing equipment, partials, reduced
readiness, a month-long absence and later thirty-minute constraints. They save
8,820 workouts and perform 99 read-only forecast/backup checks. A separate real
paired-core case uses prior actual supporting and paired practice and only owned
matched loads. Results are in research/core-composition-results.json.
The diagnostic matrices retain 2,436 reentry entries: these are reported findings,
not passing sustainable-curriculum acceptance. Broad short-session cores can use
nearly all capacity and leave very little developing work. No claim of automatic
source-complete curriculum curation or solved perpetual re-entry is made.

New 320/390px acceptance covers imported core startup, calendar/notebook forecasts,
Settings preservation, primary-to-core connection, strict thirty-minute real
prescriptions, genuine actuals and immutable untouched drafts offline.
The full browser run exposed duplicate Mobility controls; rendering now has one
shared panel. Existing cancellation confirmation is exercised for both decline
and accept, without weakening the safeguard.

The broader baseline contained test defects: duplicate preparation constants,
assertions expecting both obsolete and current mobility-startup behavior, a
return-load fixture that overwrote its saved choice on reload, and a return-load
Node backup fixture missing required title/frequency metadata. These fixtures and
assertions now verify the existing current contracts. No backup validator, pain,
completion or load-selection guard was loosened.

Education incorrectly claimed current short-session cooldowns were below ten
minutes. It now matches the actual allocation, links source #550's warmup format
and explicitly distinguishes that source's separate transition and longer
preparation examples. New tests cover every 25–120-minute preparation budget.

All ten release-gate areas remain unresolved. Their ledger now records partial
source/code/test traces, concrete findings and remaining questions. Normal gate
validation accepts documented casing; release mode still rejects open rows.
Closure evidence must reference actual usable archive IDs and cannot cite #441.
Generated source ledger, passage candidates and review queue reproduce with
720 unique / 719 usable records and 214 matched independent-journal keys. The
662 usable sources unmapped in operational coverage are not treated as reviewed
or integrated. Generated artifacts were retained under /tmp/strength-lab-core-audit.

CI registers 68 Node JS suites, six correction tests and 33 browser suites
(70 Node/setup files). Runtime rc63-core-reservation retains 51 cache assets and
all V33 storage keys. Full local suite completion, exact-commit GitHub checks and
public DEV acceptance are required before reporting a verified deployment.

Final local verification passed all 68 Node JS suites, all six correction tests
and all 33 browser suites, including the current source final core diagnostics,
paired-core eligible dates, mobile primary/core selection and offline snapshots.
Both coverage audits, all six source-accounting generation/check commands, syntax,
suite registration, diff checks and 51-asset offline integrity passed. Release
mode deliberately remains blocked by all ten unresolved areas. Exact-commit
remote CI and public DEV verification still must complete before deployment is
reported verified.


## Admit optional practice without manufacturing debt — November 22

Incoming verified checkpoint: c05c3d3. Environment access recovered, fetched
origin/preview, confirmed the isolated /workspace/strength-lab-engine worktree
was clean and synchronized, and verified all six incoming checks. The interrupted
cat-crawl work in the original checkout remains preserved. No production/main
operation, storage migration or history rewrite is part of this batch.

A new failing test reproduced automatic hip practice displacing the declared
press/row work in a protected thirty-minute core. Automatic additions could enter
the unfinished-work queue without ever having been assigned as a prescription.
Their incidental recurrence also inflated observed core sweep size and reduced
capacity for other selected programs.

Protected coordination now orders automatic supplemental/variety candidates
after declared program work, prerequisite support and real pending work. Choices
that cannot be admitted become optionalStandby metadata, never assigned physical
debt or credit. Explicit saved Major family priorities are not silently demoted.
Existing/unknown pending IDs remain mandatory; actual partial or unperformed
written accessories retain their established continuation behavior. Observed core
sweeps use declared patterns and supporting practice rather than incidental
optional entries. No old history, queue or saved program is removed.

A second failing test reproduced a complete press prescription not fitting
because planning reserved a following rest after the final movement. Protected
fitting now omits that final following rest, restoring the preceding transition
when another movement is added. Complete rounds, all per-movement targets, rests,
policy identities and conservative setup allowance remain unchanged. Existing
unprotected fitting is untouched. New interval checks cover every block at
30/45/60 minutes against the actual queue. Self-paced duration is still an app
estimate; timers never record physical work.

The existing workout explanation shows why extra skill practice is waiting.
A further regression reproduced a developing choice incorrectly described as
the oldest ready selected program while an older core was eligible. Reserved
capacity choices now use the actual allocation explanation. No new settings or
frontend restructuring was added.

Research facts, exact archive quotes and hashes from #404/#548/#550/#606 remain
separate from app admission/cost rules in research/optional-admission-evidence.json.
No new instructional scope or source completion count is claimed. Runtime
coverage remains 54 movements / 38 reviewed outlines / 16 partial lessons.

Controlled before/after runs used the exact c05c3d3 engine blob
50a8380dd879e59bd48fa9f9e361cb40f52608b0, identical inventories, skills, doses and
120 genuine generated workouts at three days/week. Thirty-minute developing
workouts rose from 12 to 29, with reentry entries 57 to 55. At 45 minutes they
rose from 49 to 56, with reentry 51 to 45; the 60-minute case stayed 60/60 with
zero reentry. These are synthetic app diagnostics, not physical outcomes.

The existing 27 two-year matrix was also rerun: all 8,820 workouts remain inside
protected time budgets. Developing workouts rise from 5,093 to 5,452 and reentry
entries fall from 2,436 to 2,070. Results are retained in
research/optional-admission-results.json alongside clear limitations. The release
gate remains unresolved; oversized cores and developing-block admission still
need work. This batch does not certify sustainable curriculum coverage.

New mobile acceptance at 320/390px exercises shared Train/Settings durations,
automatic admission at 45 minutes versus standby at 30, the complete squat/press
plan without phantom final rest, genuine logged bilateral actuals, no optional
debt or credit and immutable untouched drafts offline. New Node cases cover
explicit pending work, partial written accessories, Major priorities, observed
optional gaps, real allocation explanations, date-safe forecasts and backups.

Compatibility comparison preserves 108 default normal/reduced prescriptions
and all 96 legacy block/duration plans exactly. Final local verification passes
all 69 Node JS suites, six correction tests and all 34 browser suites. Both
source audits, source quote/hash checks, syntax, suite registration, diff checks
and 51-asset offline integrity pass. Cache/query rc64-optional-admission keeps all
V33 namespaces. All ten Wildman gate rows remain unresolved; development checking
passes and release checking remains intentionally blocked. Exact-commit CI and
public DEV verification remain required before reporting a verified deployment.


Developing-continuity follow-up (November 22): protected coordination now carries
actual developing practice across intervening reserved core workouts. A first
clean exposure gets a bounded follow-up when current core work is time-blocked;
a genuine reduced-return sequence may also retain its follow-up. Evidence must
match the current method and comparison load (wave methods retain their existing
comparison rules). Core reservations, actual unfinished work, readiness, skills,
equipment, independent progression and the continuity opt-out retain priority.
After three consecutive developing visits, another ready developing peer gets a
turn. Two recorded developing retention priorities yield to a never-practiced
ready peer; this does not weaken core retention or force every movement to the
same frequency. Forecasts and elapsed timer time never award learning credit.

This is a Strength Lab scheduling adaptation, not a Wildman numeric protocol.
Sources #85/#288/#404/#548 support the bounded fundamentals/learning rationale;
verified quotes and limits are in research/developing-continuity-evidence.json.
Controlled results in research/developing-continuity-results.json compare the
exact da8b481 baseline: over 120 workouts at three days/week, the thirty-minute
case records 21 normal developing entries versus 10, and six reentry entries
versus twelve. All four tracked developing foundations qualify through actuals.
The 45/60-minute cases retain all seven tracked ready cycle endpoints. Tradeoffs
remain: one additional reentry at sixty minutes and a later bodyweight-squat
qualification at forty-five. These are synthetic results, not physical outcomes
or a universal recurrence guarantee. Three additional two-year stress histories
save 858 actual workouts with missed sessions, absences, equipment/policy/time
changes, reduced work and immutable forecasts/backups.

All ten Wildman gate areas remain unresolved. Automatic curriculum curation,
movement-specific maintenance frequency, oversized cores, legacy unprotected
strict time fitting, instructional verification and real Android acceptance
remain open. Regression inventory is 70 Node JS suites, six correction tests and
35 browser suites. Runtime/query rc65-developing-continuity keeps 51 assets and
all existing V33 storage namespaces. No user-data migration is introduced.

Final local verification: all 70 Node JS suites, six correction tests and all
35 browser suites pass. The existing core-composition mobile save timeout did
not reproduce on its full two-width rerun; diagnostic logging remains and no
assertion was weakened. The final focused suite also verifies that an old-method
return cannot grant current-method follow-up without time pressure. Both source
audits, gate checker, syntax, suite registration, diff checks and all 51 offline
assets pass. Compared with the exact da8b481 engine, 108 default normal/reduced
prescriptions and 72 legacy block/duration plans remain identical. Current-commit
CI and public DEV checks are required separately after push.


November 23 peer-bound correction: the latest-session return path now counts the
same selected developing history as the cross-core follow-up path. Previously,
three developing turns separated by core workouts could receive a fourth turn
when the latest receipt was a reduced return and surplus core capacity existed.
Both paths now yield to another ready developing peer after the existing three
turns. Absent/blocked peers do not force empty workouts; core reservation and
unprotected-program continuity remain unchanged. No qualification, dose, load,
method, saved selection or storage namespace changes.

The regression uses actual engine-generated, user-selected workout receipts,
including explicitly reduced practice; it is not a claim that the automatic
scheduler generated that historical selection. The same fixture fails before
the correction and passes afterward, with immutable backup replay and no return
credit. Mobile tests verify the peer choice and untouched offline draft at
320/390px. Existing 30/45/60-minute controlled and two-year stress diagnostics
retain their prior counts and endpoints. This enforces the existing app fairness
bound, not a newly sourced Wildman numerical rule. All ten gate rows remain open;
automatic curriculum curation and movement-specific maintenance still need work.
Runtime rc66-peer-bound retains 51 assets and existing V33 keys. Regression suite
inventory stays 70 Node JS, six correction tests and 35 browser suites.


Regression-harness repair: browser-reentry-load-review.cjs exposed a race between
installing an advancing fake clock and pausing at the same instant ("Cannot
fast-forward to the past"). This date-only test now uses setFixedTime; app load,
re-entry warning, unchanged owned weight and no-warning-for-recent-work assertions
are retained. This is a test-clock fix, not an app save/progression fix.


Final local peer-bound verification: all 70 Node JS suites, six correction tests
and 35 browser suites pass. The initial browser clock-setup failure was repaired
as described above; both affected mobile widths and the final remaining suite
were rerun successfully, with original assertions retained. Focused correction/
undo, absent/blocked peer, unprotected compatibility, genuine reduced receipts,
backup replay and offline draft checks pass. Exact-baseline compatibility retains
108 prescriptions and 72 legacy block/duration plans. Source audits, gate check,
syntax, suite registration, diff checks and 51 cached assets pass. Public DEV and
exact-commit CI remain separate post-push verification requirements.


November 24 core-attendance accounting: old core work can no longer bank
reservation credit across a lapse longer than the configured return interval.
Scheduling accounting begins at the first actual core visit, restarts at an
actual core return after such a lapse, and ignores old credit/debt while the
core is currently overdue. During continuous core attendance the prior balancing
policy stays in force. The 56-day attendance/recurrence observation, reserved
core, actual unfinished work, peer bounds, equipment, prerequisite and recovery
rules remain intact. Earned movement history and progression never reset here.
No new setting, stored phase, program deletion, load change or migration exists.

The failing baseline fixture has 18 genuine user-selected workout receipts: old
foundational work followed by developing-only training. Old scheduling chooses
another developing block despite the core being 19 days absent; current scheduling
reserves its reduced return without advancement. Old pre-core developing debt
also does not force catch-up reservations. See research/core-window-evidence.json
for verified source facts versus this app adaptation, and core-window-results.json
for exact c4b9bd2 comparisons. All three 120-workout controlled histories and three
286-workout stress histories retain baseline counts, qualifications and endpoints.
A broader continuously rolling quota was rejected after it lost club qualification
in constrained testing. This narrower correction preserves developing learning.

Tests cover actual correction/undo, backup replay, future isolation, custom return
intervals, no-core compatibility, disabled families, selected-duration Settings/
Train agreement, immutable offline drafts and genuinely logged nonadvancing
returns. All ten gate rows remain unresolved. Automatic curriculum curation,
movement-specific maintenance, oversized cores, strict legacy duration fitting,
instructional verification and real Android acceptance remain open. Inventory:
71 Node JS suites, six correction tests and 36 browser suites. Runtime/query
rc67-core-window retains 51 runtime assets and all existing V33 namespaces.

Nine additional resumed-curriculum cases (30/45/60 minutes × 2/3/5-day schedules)
log 324 actual workouts and 18 expected foundation returns, including a three-week
absence and a later reduction to thirty minutes. Forecasts and backups stay
read-only, original receipts remain unchanged and reduced work never advances.
The workout explanation now names the selected core's training gap as the reason
for resuming it. No setting or user-data migration was added.

Final local verification: all 71 Node JS suites, six correction tests and all
36 browser suites pass. The final focused mobile and Node runs include the core
resume explanation, exact return-interval boundary, source quote/hash checks and
nine resumed-training scenarios. Existing developing-continuity assertions were
preserved after rejecting the broader policy. Compatibility retains all 108
default prescriptions and 72 legacy block/duration plans. Source audits, release-
gate tracking, syntax, suite registration, diff checks and 51-asset offline
integrity pass. All ten gate areas remain unresolved. Exact-commit CI and public
DEV verification are required separately after push.


Capacity-aware curriculum strategy (November 25): see CURRICULUM-STRATEGY.md for
foundation reservation, one developing lane under overload, earned maintenance,
queued saved choices and independent actual/pending ownership. Old balanced
coordination and the continuity opt-out remain. New reduced maintenance requires
a completed current cycle and a usable full review, grants no advancement, and
requires new full endpoint work before another progression review. Wave methods
keep their own doses. No new setting, storage key or data migration is introduced.
Source #123's conventional-lifting context and all app numerical adaptations are
explicit in research/curriculum-strategy-evidence.json. All ten audit areas remain
open; this is not full transcript or physical-technique certification. Runtime
rc68-curriculum retains 51 cached assets and V33 keys. Suite inventory is 72 Node
JS suites, six correction tests and 37 browser suites.


Curriculum strategy batch: the implemented policy is described in
CURRICULUM-STRATEGY.md, with exact source quotes/context, current-method actuals,
independent written ownership and explicit numerical-app choices. The old
slot-only experiment was rejected after it crowded out later learning. Earned
maintenance can instead share genuine spare time; it does not become a program
day, shorten an unearned target or authorize a new load. Reduced earned work
requires new full endpoint actuals before another progression review.

The former overloaded legacy-tag fairness fixture now checks actual unfinished
cycle focus rather than treating a recorded retention label as earned mastery.
Balanced three-program peer bounds still run unchanged. The thirty-minute
controlled assertion now checks completed cycles plus honest queueing, rather
than requiring every saved skill to receive an introduction. Simulated returns
during development and returns to already-earned work are reported separately.
Neither maintenance count nor elapsed time is treated as progression evidence.

Exact b107791 comparisons are reproducible with scripts/compare-curriculum.cjs
and recorded in research/curriculum-strategy-results.json. In the three
120-workout controlled cases, unfinished-development returns are 6→4, 2→0 and
1→0 for 30/45/60 minutes. Thirty-minute completed tracked cycles rise from one to
two; all seven tracked cycles remain earned at 45/60. Later introductions are
queued, and some earned returns increase under constrained time. Three two-year
constraint cases save 286 actual workouts each; 45/60-minute starters retain all
seven current cycles after a method change versus six at baseline. The separate
240-workout capacity-change case earns all seven after moving 30→45 minutes.
No physical strength-retention or technique verification is inferred.

Movement lookup now filters before copying unrelated rows, preserving stable
record keys, session/item order and date scoping. The reproducible 3,000-session,
ten-movement lookup produces identical records; measured local timing is in the
results JSON. This does not promise real-device latency. Backup/correction replay
preserves unassigned legacy requests and new maintenance-source ownership.

The actual app save path also preserves a newer pending load selection when an
older immutable draft is completed. Only completed work at the selected load
consumes that pending choice. Regression tests execute the real save function:
the old-load target stays recorded, the newer load remains at its own unearned
baseline, and genuine full work at the new load consumes the choice and supplies
only its actual exposure. No weights are raised by a setting save.

Final local verification: all 72 Node JS suites, six correction tests and 37
browser suites pass. The final focused runs include source hashes/quotes, 36
limited-equipment beginner workouts, earned row-wave/KB-wave independence,
240 capacity-changing actual workouts, two separate maintenance sources, future
ownership isolation and the real app save path for old/new pending loads. All
108 default prescriptions and 72 legacy block/duration plans remain identical.
Source audits, gate tracking, syntax, suite registration, diff checks and all
51 cached assets pass. Existing V33 keys/data and the separate unfinished worktree
remain preserved. Exact-commit CI and live DEV verification are still required
separately after push; no production promotion is authorized.


Selected-session ceiling follow-up (November 25): all newly generated single,
coordinated and protected-core strength plans now fit the selected total duration,
including the existing eight-minute warmup and ten-minute app cooldown. The old
30→40 and other +5-minute extensions are superseded by the explicit user ceiling
requirement. Full prescriptions, rounds, transitions, prerequisites and recovery
rules remain; targets that cannot fit stay deferred with minimum-time guidance.
Existing flexible drafts and recorded plans remain loggable/backup-compatible.
Source #550 and app decisions are bounded in research/session-ceiling-evidence.json.
This corrects timing consistency, not all source-specific methods or sustainable
maintenance frequencies. All ten gate areas remain unresolved. Runtime rc69-session-ceiling
retains 51 cached assets and V33 keys; suite inventory remains 72 Node JS, six
correction tests and 37 browser suites. Continue with the source-specific method,
preparation and recovery audit; preserve the separate unfinished cat-crawl tree.

The exact 0986545 baseline admits twenty snatch rounds at a selected thirty
minutes and reports thirty-nine total. The correction defers that same endpoint,
reports a thirty-nine-minute minimum, blocks at thirty-eight and fits all twenty
rounds at thirty-nine/forty-five. The 864-case matrix covers all 24 blocks, six
durations, three composition modes and two readiness states. Legacy flexible
drafts remain valid and unchanged. Archived #550 text/hash and bounded quotes are
verified in the behavior suite. Row-wave recovery now explicitly tests a dose
that must wait at forty-five and can fit at sixty without advancement credit.

An attempted packing unification was rejected: omitting legacy terminal rest
admitted more movement patterns and increased club/bodyweight re-entry sessions
from 138 to 218 in the existing three-year diagnostic. Retaining legacy estimates
restored 426 saved workouts and 138 returns. The original four-scenario bounds
remain unchanged and pass. Browser startup initially found the old local server
stopped; it was restarted. The step-up fixture also failed once during setup;
its isolated complete rerun passed at 320/390px. Exact-head CI must pass before
this batch is reported as deployed and verified. All ten audit rows remain open.

Local verification completed: all 72 Node suites, six correction tests and 37 browser suites pass across the broad run and corrected follow-ups. Both source audits, suite registration, syntax, gate validation, 51 cache assets and diff checks pass. Exact-head CI and public DEV verification follow the preview push.


Written-method reliability follow-up (November 25): active workouts now validate
against their original canonical policy/setup identity instead of mutable current
settings. Original method or apparatus changes no longer prevent actual work from
being saved/restored. Supported keys are decoded and re-encoded through policyFor;
unknown/noncanonical identities and inconsistent timing/scope metadata fail closed.
New workout admission keeps current skills, owned pairs, stations and recovery gates.
Old-method work cannot advance another method or consume its pending load choice,
even at the same numeric weight. Existing snapshots, V33 keys and history remain
unchanged; no programming-context field or user-data migration is introduced.
See research/written-policy-evidence.json and tests/draft-save-regression.js.
New tests/browser-draft-policy.cjs covers real import, offline save and reload at
320/390px. Runtime rc70-written-policy retains 51 assets; inventory is 72 Node JS,
six correction tests and 38 browser suites. All ten gate areas remain unresolved;
source-specific progression/preparation/recovery and physical instruction still
need their complete evidence audit. Preserve the unfinished cat-crawl tree.

Baseline regressions were reproduced before correction: a legacy press draft
cannot save after selecting a wave method; an old legacy-club receipt consumes a
legitimately earned new-method load choice at the same numeric weight. Current
save-path tests preserve both actuals and the choice. All 65 supported profile
identities validate against original and changed/default current configuration;
unknown identities and incompatible timing/scope/get-up-side metadata fail closed.
Schema-only identity cases are never logged as physical work. Genuine old actuals
also retain their original comparison after correction/undo and backup round-trip.

Two historical tests assumed current apparatus inventory must validate earlier
work. They now assert the required separation: unchanged snapshots are restorable,
unavailable platforms/pairs still prevent new training, mismatched actual load
cannot earn a written load, and malformed zero loads fail validation. No admission
or prerequisite gate is removed. The first smoke attempt mixed cache revisions
because the revision was bumped during QA; the complete smoke suite was rerun
successfully on the final cache. A paired-swing save timed out once; explicit
validation/dialog diagnostics were added and the complete isolated rerun passed
both widths. A recovery-review fixture read draft.plan immediately after Start;
it now waits for the rendered draft, retains error diagnostics and passes both
widths. No automatic retry or weakened source/progression assertion was added.

Local QA complete: all 72 Node suites, six correction tests and 38 browser suites pass across the broad run and final focused/diagnostic follow-ups. Both source audits, syntax, all 51 offline assets, suite registration, gate and diff checks pass. Exact-head CI and live DEV acceptance follow push.


Engine preparation follow-up (November 25): preparationFor now selects warmup and
cooldown advice in the pure engine from registered movement families/IDs and
complex components, rather than display-name searches in the interface. Step-ups
receive ankle/squat preparation; floor, pull, hinge and overhead work retain their
own patterns. A light club is optional only for a simple movement already written,
with current comparable familiarity, grip confirmation and owned single-club load
at no more than half the lowest written per-club working load. Otherwise preparation
stays unloaded. No kg/lb comparison, invented load, new movement admission or
strength/component credit exists. Half-load selection is an app choice, not a
universal Wildman percentage. Cooldown slots include both sides/substitutions and
allow comfortable rest. Existing 8+10 allocations, strength targets, old snapshot
allocations and V33 data remain. No new settings or data migration are introduced.
See research/preparation-engine-evidence.json. Exact 85571a6 comparison preserves
108 prescriptions and 432 strength plans. Runtime rc71-preparation-engine retains
51 cached assets; inventory is 73 Node JS, six correction tests and 39 browser
suites. All ten gate rows remain unresolved; fuller source-protocol, maintenance,
technique and real-device acceptance remain separate work.

The baseline step-up warmup regression fails because display-name matching misses
its squat/ankle pattern. The pure engine corrects it and keeps unknown names from
acting as programming evidence. Tests cover 5,184 movement/duration combinations,
owned/familiar versus limited gear, missing grip, disabled clubs, changed methods,
pain holds, future/stale evidence, compound patterns and zero strength credit.
Alternative snapshot allocations, including fractional cooldown slots, stay exact.
The actual 85571a6 comparison preserves 108 prescriptions and 432 strength plans.

All 73 Node suites, six correction tests and 39 browser suites pass across the
broad run and final follow-ups. The step-up browser history editor hit a hidden
ancestor disclosure; the fixture now opens all ancestors before filling the field,
with all assertions retained, and its complete rerun passes. The new mobile suite
passes preview, active workout and offline reload for step-ups, familiar light
clubs and limited clubs at 320/390px, with unchanged plans and no fabricated work.
Both source audits, 51 cache entries, syntax, suite registration, gate and diff
checks pass. Exact-head CI and public DEV acceptance follow the preview push.
