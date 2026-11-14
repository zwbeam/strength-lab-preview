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
