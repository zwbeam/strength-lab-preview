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
The latest partial audit of all ten areas is in research/wildman-engine-evidence.json.
Each row remains unresolved. The normal checker accepts documented status casing;
release mode still blocks all ten open areas, and closed evidence may not cite
unknown archive IDs or excluded source #441.

## Final UI phase, after the gate

Review Train, Workout, Log, Learn and Settings as actual user journeys; simplify setup, remove duplicated controls, ensure understandable decisions and preserve backups. Run current-commit CI and Android acceptance before release.
