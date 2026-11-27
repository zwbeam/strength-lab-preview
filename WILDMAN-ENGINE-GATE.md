# Wildman-to-engine release gate

Status: OPEN — no claim of complete research integration.

## Priority and release rule

Research-to-engine fidelity takes precedence over cosmetic UI changes. Keep data-loss and security fixes unblocked. Do not promote preview to main until the evidence matrix below is complete, the relevant regression suites pass on the exact candidate commit, and an Android acceptance pass is documented. Source inventory alone never counts as engine integration.

## Required evidence for each programming principle

Each entry must record (1) verified source IDs and bounded claim, (2) engine function and relevant configuration, (3) user-visible outcome, (4) automated behavior test and test result, (5) distinction between source instruction and Strength Lab adaptation, (6) status: verified, adapted-and-tested, unresolved, or deliberately out-of-scope with justification.

Do not mark a principle verified solely because a movement has a lesson, a source link, or an engine route. Unknown or visually ambiguous details stay unresolved.

**Machine-checked closure evidence:** Update `research/wildman-engine-evidence.json` in the same change as any status change here. For each closed row supply numeric `sourceIds`, a bounded `claim`, checked-in `enginePaths` and `tests`, an `adaptation` explanation, and the supporting commit SHA. The CI checker rejects status mismatches, missing files, and empty closure evidence. Passing the checker does not itself prove the cited behavior; review the test assertions and source claims before approving closure.

## Priority audit matrix

| Area | Current evidence | Acceptance test needed | Status |
| --- | --- | --- | --- |
| Sustainable program rotation | Rolling A/B/C; protected-core opportunity reservation, observed coverage and strict protected-core time ceiling | Longitudinal 30/45/60 minute, 2–5 days/week feasibility without perpetual re-entry | Unresolved |
| Movement-specific progression | Separate volume, density, timed and wave methods | Clean completion, miss, partial, load changes, baseline reset and independent method identities | Unresolved |
| Warmup philosophy | Eight-minute two-round four-station allocation, source #550 | Movement-aware preparation, time constraints, clear safety and technique options | Unresolved |
| Cooldown philosophy | Ten-minute app allocation, not attributed as a Wildman mandate | Pattern-aware recovery, realistic duration and source-vs-app labeling | Unresolved |
| Prerequisites and skill gates | Registry paths, equipment and reviewed skill checks | No unearned advanced prescription or credit from component/complex practice | Unresolved |
| Recovery and continuity | Readiness, pain review, re-entry and missed-work logic | Multi-month absences, fatigue, skipped days and edited history replay | Unresolved |
| Equipment and real-world constraints | Owned loads, matched pairs, station geometry | No invented loads, impossible stations, or automatic unsafe increases | Unresolved |
| Source-specific methods | Selected club, bodyweight, paired KB, get-up, snatch examples | Protocol-level comparisons against verified source excerpts | Unresolved |
| Movement instruction | 54 routes; 38 reviewed outlines; 16 partial per ENGINE-KNOWLEDGE-STATUS.md | Close partial teaching and visual gaps without guessing | Unresolved |
| Full research accounting | 720 inventoried, 719 usable, source #441 excluded | Reconcile source ledger, audit journal, destination and engine-relevant gaps | Unresolved |

## Workflow for every future Continue

1. Choose the highest-risk unresolved row.
2. Verify its source evidence and locate the exact engine path.
3. Add a failing behavior test, fix the behavior, and rerun relevant suites.
4. Update this matrix with commit, test, and evidence. Do not mark verified without all three.
5. Defer interface cleanup until the engine gate is satisfied, except when necessary to test or protect data.

## Rotation work in progress (not closed)

The coordinator now reserves actual opportunities for an explicitly selected core,
using effective/observed attendance, the configured return window, formal program
days and observed movement recurrence measured in core visits. Deferred work can
therefore increase the reservation. Primary program in existing Settings supplies
the core when selected for coordination; no additional setup question is added.
The engine retains unfinished-work priority, skills, inventory and recovery gates.
Other selected programs use available opportunities; no saved program is removed.
Protected-core plans include warmup/cooldown inside a hard selected-duration ceiling.

This is an app adaptation, bounded by research/core-composition-evidence.json, not
a source-authored frequency formula. It does not establish automatic curriculum
curation or movement-specific minimum frequency. The 27 two-year diagnostic
matrices deliberately retain/report reduced returns; passing their safety, time
and replay checks does not certify sustainable coverage. Oversized A/B/C cores at
short durations can still consume nearly all capacity while additional skills
remain selected. Admission/maintenance of a manageable developing pathway, strict
budgets for legacy unprotected programs, broader source-method checks and physical
Android acceptance remain open. Do not close the rotation row on this batch.

The tested implementation checkpoint is c1f11baf1add6059b82445be43a4bc6230a9ee68.
Optional-admission implementation checkpoint: 07b7a6c98f4172c6be1f9372ba0045df86163223.
Automatic additions now wait until the declared program fits; unadmitted
choices do not become physical debt. Explicit/partial written work is retained.
Protected fitting omits a final following rest while retaining transitions and
full rounds. In the same 27 two-year diagnostics, developing workouts rose from
5,093 to 5,452 and reentry entries fell from 2,436 to 2,070. These are synthetic
app results, not gate closure or physical outcome evidence. See
research/optional-admission-evidence.json and research/optional-admission-results.json.

The latest partial audit of all ten areas is in research/wildman-engine-evidence.json.
Each row remains unresolved. The normal checker accepts documented status casing;
release mode still blocks all ten open areas, and closed evidence may not cite
unknown archive IDs or excluded source #441.



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

Developing-continuity implementation checkpoint: dc2c92130a89f1ee3a95f9f9f456dc46138fcdc1.



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

Latest-return peer-bound implementation checkpoint: 2c4cf7c0d5901a64b5facf7dbc2087dee4876326.



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

Core-attendance accounting implementation checkpoint: 454d0cdb85b856be1d766cc59e8685d0a87a128e.



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

## Final UI phase, after the gate

Review Train, Workout, Log, Learn and Settings as actual user journeys; simplify setup, remove duplicated controls, ensure understandable decisions and preserve backups. Run current-commit CI and Android acceptance before release.

Implementation checkpoint: `41e5aee67ac57b7ab1832ce7489fe3af1d647fca` contains the focused curriculum strategy and regression coverage. Local verification passed 72 Node suites, six correction tests and 37 browser suites, with final focused checks after the last changes. All ten audit areas remain unresolved.


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

Selected-session ceiling implementation checkpoint: `f39f6137d195f3a0c5e0a6a294d825c92f8e609d`. All 72 Node suites, six correction tests and 37 browser suites passed locally across the broad run and corrected follow-ups. All ten audit areas remain unresolved.


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

Written-method reliability implementation checkpoint: `6c7d31f30d27f3efc1696775dab35153745dc4b0`. Local QA passed 72 Node suites, six correction tests and 38 browser suites across the broad run and final focused/diagnostic follow-ups. All ten gate rows remain unresolved.


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

Engine preparation implementation checkpoint: `54b359cab3c0f8ffdafcd375040ba49a5882ed72`. All 73 Node suites, six correction tests and 39 browser suites passed locally across the broad run and final follow-ups. All ten audit areas remain unresolved.


Load-evidence follow-up (November 26): generic working loads now change only from
delivered written normal/light/reduced work, or an explicit approved selection.
Skipped, mismatched-load or incomplete receipts cannot invent a baseline or erase
an earned cycle/difficulty. Explicit pending loads begin their dated comparison
before the first attempt, preserving partial-attempt difficulty and legacy
pending-choice behavior. Physical record success remains separate from ordinary
progressionCredit; all nine nonadvancing roles are excluded even when legacy
completed flags are true. Shared delivered-target proof protects light neutrality
and reduced-work acknowledgements. A saved receipt consumes an approved load only
inside its current dated method/reset comparison and when replay retains that
load without the pending override. Older/future receipts cannot erase a newer
choice. Actuals, historical flags, snapshots, V33 keys and source numerical
methods remain; there is no user-data migration or new setting. See
research/load-evidence-audit.json. Runtime rc72-load-evidence keeps 51 cached
assets; suite inventory is 74 Node JS, six correction tests and 40 browser suites.
All ten gate areas remain unresolved. Continue source-protocol and sustainable
maintenance/recovery verification; preserve the separate unfinished cat-crawl tree.

Load-evidence implementation checkpoint: `beb8f065e3fcc0ea909ce7423f0783e35a7c69af`. Local QA passed 74 Node suites, six correction tests and 40 browser suites across the broad run and final compatibility/focused follow-ups. All ten audit areas remain unresolved.


Primary-attendance follow-up (November 27): completing only an appended earned
maintenance movement no longer marks its untouched primary program as recently
trained in rotation ordering. A later completed selected workout previously hid
the immediate unfinished-work priority and exposed this false attendance after
changing away from a protected core. Candidate recency now uses primary actuals,
consistent with existing primary-day and core-reservation ownership. Actual
maintenance remains in history and retains its own progression/continuity evidence;
it does not become a second program day. Correction of genuine primary work and
undo replay the corresponding rotation choice. No settings, dose, history,
load, storage namespace or backup schema changes. This is an app accounting
safeguard, not a newly sourced Wildman frequency rule. All ten gate areas remain
unresolved; automatic sustainable maintenance frequencies and source-specific
methods still require evidence. Runtime rc73-primary-attendance keeps 51 cached
assets. Suite inventory remains 74 Node JS, six correction tests and 40 browser
suites. See research/primary-attendance-evidence.json.


Stall-recovery source follow-up: #259 distinguishes failed/unfinished work from
completed difficult work in its 60% versus 80% rep examples. The existing opt-in
redistribution strategy now uses actual set/rep completion for that branch; the
Hard label alone no longer forces 60%. New tests retain whole-set volume rounding,
independent method histories, wave heavy-work caps, correction/undo and zero
advancement for rebuild. The two-attempt trigger, completion-to-feedback mapping
and rounding remain app adaptations. The full temporary alternate volume subcycle
in #259 is still not implemented; all ten gate rows remain unresolved. No working
load, setting, stored history, V33 key or schema changes. Read
research/stall-recovery-evidence.json. Runtime rc74-stall-recovery keeps 51 cached
assets; inventory is 75 Node suites, six correction tests and 41 browser suites.


Zero-set feedback reliability follow-up: recovery branch selection now retains
explicit Hard/Breakdown feedback on a positive written target even when none of
that movement's sets were completed in an otherwise real mixed workout. Such
feedback was already difficulty evidence in replay, but the branch lookup skipped
it and could reuse older completed work. Ordinary clean skips remain neutral;
empty legacy targets and other method/load comparisons remain excluded. No
progression/qualification, failure threshold, working load, stored actual, snapshot,
V33 key, schema or setting changes. Source #259 remains contextual; interpreting
zero-set feedback is an app safeguard, not a new Wildman dose protocol. The full
alternate volume subcycle and all ten gate closures remain open. Read
research/zero-set-feedback-evidence.json. Runtime rc75-zero-feedback retains 51
cached assets; inventory stays 75 Node suites, six correction tests and 41 browser
suites. The focused mobile recovery suite now includes six cases at 320/390px.


Written-load difficulty follow-up: generic inferred-load replay now owns failure
evidence by the written load, matching the existing approved-load and recovery
lookup boundaries. Undelivered work written at another load cannot manufacture
current-load difficulty or erase existing own-load difficulty. Genuine delivered
new-load work can still establish its load; failures against the current written
target still count even when actual weight differs. Cross-load interruptions
still reset a clean streak and require fresh full endpoint evidence before load
review. Known unresolved pain remains movement-wide, including future-dated
reports. Stored history, snapshots, V33 keys and numerical methods are unchanged.
This is an app comparison safeguard, not a new Wildman dose protocol. All ten
gate areas and the full alternate recovery subcycle remain open. Read
research/comparable-difficulty-evidence.json. Runtime rc76-comparable-difficulty
keeps 51 cached assets; inventory stays 75 Node suites, six correction tests and
41 browser suites. The focused load-evidence browser suite now has ten cases.

Clean delivered legacy time-fit work is now nonadvancing without manufacturing
difficulty in generic, heavy/light or row-wave replay. It does not clear existing
difficulty, restore qualification or certify a new load review. Hard/unfinished
work still counts, and the source-specific track rules remain. No new time-fit
plans are generated: the selected ceiling and full-dose deferral remain in force.
This preserves old written history without mistaking role credit for actual failure.


Lighter-load rebuilding review: repeated current-load difficulty now has an
explicit owned-lighter-load action on Train and Log. It starts a fresh comparison
without advancing, changing methods, enabling skills or rewriting old actuals.
Current pain holds, active drafts, writer locks, matched-pair inventories and
bodyweight/heavy-light exclusions remain. With no lighter owned load, advice
explains the constraint. Settings reflects the same chosen baseline.

The action writes an optional V33 loadComparisonStarts boundary (review day and
known receipt identities) plus the existing load fields. This is not a migration:
old data is untouched. The boundary prevents history-date edits, prior earned
cycles and already-known future receipts from restoring an old heavier baseline
or awarding fresh endpoint/return evidence. The existing transaction journal and
backup validation protect the operation. Source #259 supplies general alternate-
strategy context; lighter-load review and its guards are app adaptations, not a
universal numerical prescription. Read research/rebuild-load-review-evidence.json.

A synthetic 120-workout history changes between 30/45/60 minutes, includes an
extended absence, earns three explicit promotions and makes one later explicit
lighter-load review after actual difficulty. It preserves backups and old work.
Full alternate recovery cycles, movement-specific maintenance and all ten audit
closures remain open. Runtime rc77-rebuild-load keeps 51 cached assets and the
existing V33 namespaces. Inventory is 76 Node suites, six correction tests and
42 browser suites; the new mobile acceptance suite has four cases at 320/390px.


Alternate-volume follow-up (#259, partial): eligible opted-in legacy/
bodyweightPractice methods now preserve a separate lower-rep, add-set subcycle.
Its goal uses the existing volume endpoint capped to the starting session budget;
one-set steps and configured clean exposures are app adaptations. Actual clean
alternate work alone advances that subgoal. It then returns to the original
stalled target without awarding original progress or increasing load. Readiness,
return work, corrections and later settings cannot manufacture completed steps.
Legacy unmarked receipts retain their interpretation; new optional prescription
metadata is validated without changing V33 root data or storage namespaces.

The 156-workout generated trajectory and 30/45/60-minute scheduled completion
examples retain strict ceilings, independent original progression and backup
replay. Time-budget changes after starting do not silently shrink the earned goal.
Oversized saved curricula/low attendance, source-specific alternate methods,
maintenance-frequency evidence, instructional verification and all ten gate areas
remain open. See research/alternate-volume-cycle-evidence.json. Runtime rc78-
alternate-volume retains 51 offline assets; inventory is 77 Node suites, six
history-correction tests and 42 browser suites. Mobile stall acceptance expands
to ten cases including resumed and 30-minute cycles.
