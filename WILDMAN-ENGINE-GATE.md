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

## Final UI phase, after the gate

Review Train, Workout, Log, Learn and Settings as actual user journeys; simplify setup, remove duplicated controls, ensure understandable decisions and preserve backups. Run current-commit CI and Android acceptance before release.
