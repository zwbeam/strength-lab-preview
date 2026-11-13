# Movement and programming coverage audit

All 720 indexed records inventoried; 719 usable per supplied audit. Title matches are discovery only; external completion labels do not establish engine integration.

The supplied audit reports 505 master + 214 independent completions. All 214 journal keys match the archive. Their external hashes match neither raw nor whitespace-normalized archived text, so those fingerprints are retained separately; no identical-text claim is made. The master ledger and anchored external review writeups remain unavailable. Source #441 (`kyhhTntpVdY`) is unusable and excluded from verified instruction.

## Runtime coverage

| Category | Programmable movements | Dedicated lessons | Remaining boundary |
|---|---:|---:|---|
| Single kettlebell | 13 | 13 | Partial scope; see per-movement states below. |
| Double kettlebell | 3 | 3 | Partial scope; see per-movement states below. |
| Heavy club | 11 | 11 | Partial scope; see per-movement states below. |
| Double club | 0 | 0 | No automatic system yet. |
| Complexes | 3 | 3 | Partial scope; see per-movement states below. |
| Bodyweight | 7 | 7 | Partial scope; see per-movement states below. |

## Every programmable movement

| ID | Profile | Instruction coverage | Instruction sources |
|---|---|---|---|
| swing | legacy | reviewed outline | #299 |
| squat | legacy | reviewed outline | #304 |
| press | legacy | reviewed outline | #292 |
| row | legacy | reviewed outline | #424 |
| clean | legacy | reviewed outline | #290 |
| carry | legacy | app-authored practical guidance; source/video verification pending | Unmapped |
| cast | legacy | partial: technique and prerequisites; clearance and breathing need visual verification | #214, #222, #543 |
| circles | legacy | reviewed outline | #237, #238 |
| front | legacy | app-authored practical guidance; source/video verification pending | Unmapped |
| snatch | snatch | partial: source-backed staged progression; ballistic timing requires video verification | #413 |
| doublePress | grind | partial: sourced clean and press prerequisites; technique still needs visual verification | #152, #365, #368 |
| doubleSquat | grind | reviewed outline | #186 |
| complexCleanPress | legacy | partial: combined technique outline; dose/rest are app defaults and visual review remains necessary | #295 |
| complexCleanSquatPress | legacy | partial: app combination of reviewed components; #335 gives only brief single-bell context | #295, #335 |
| complexDoubleCleanSquatPress | legacy | partial: full sequence described in transcript; clearance and transitions need visual confirmation | #335 |
| getup | getup | partial: source-backed primer; full transitions still require video review | #423, #604 |
| clubInside | singleClub | reviewed outline | #275 |
| clubOutside | singleClub | reviewed outline | #648 |
| clubShield | singleClub | reviewed outline | #543 |
| getupFloor | getupDrill | reviewed outline | #422 |
| getupElbow | getupDrill | reviewed outline | #298 |
| getupHand | getupDrill | reviewed outline | #372 |
| getupHipPass | getupDrill | reviewed outline | #324 |
| clubInsidePendulum | clubIntermediate | reviewed outline | #260 |
| clubOutsidePendulum | clubIntermediate | reviewed outline | #265 |
| clubFrontPullover | clubIntermediate | reviewed outline | #269 |
| clubOutsidePullover | clubIntermediate | reviewed outline | #269 |
| clubInsidePullover | clubIntermediate | reviewed outline | #624 |
| hingePractice | hingePractice | reviewed outline | #704 |
| pushup | pushup | partial: sourced EMOM volume progression; detailed hand placement and regressions unverified | #609 |
| hipDropTwoHand | ground | reviewed outline | #84 |
| hipDropSingleHand | ground | reviewed outline | #98 |
| bearSquat | ground | reviewed outline | #100 |
| deadlift | deadliftPractice | reviewed outline | #704 |
| bodyweightSquat | ground | reviewed outline | #91 |
| stepBackLunge | ground | reviewed outline | #93 |
| doubleClean | legacy | partial: hard-style transcript outline; paired clearance and catch still require visual verification | #365 |

## Programming scope

Existing volume, snatch density, heavy/light waves, timed club, get-up, push-up, recovery, re-entry, prerequisites and equipment checks remain. Full transcripts support selected worked examples, not universal gates. Two clean exposures, configurable reductions, load-jump caps, activity buffers and calendar choices are application rules. Complexes have separate histories and component evidence but lacked dedicated instruction at the incoming checkpoint.

## Instruction-only references

These lessons never enter automatic prescriptions. Their source-supported teaching is separate from unimplemented dose/equipment/eligibility systems.
- bearCrawl: Bear crawl — #87; reviewed outline
- catCrawl: Cat crawl — #82; reviewed outline
- doubleClubInside: Double-club alternating inside circles — #147; partial: source-reviewed outline; paired-club equipment/programming and visual technique validation remain incomplete
- doubleClubOutside: Double-club alternating outside circles — #151; partial: source-reviewed outline; paired-club equipment/programming and visual technique validation remain incomplete

## Research boundaries and next priorities

New squat/lunge and paired-clean opt-in blocks address foundation gaps; quadruped automatic protocols, double-club equipment/qualification/programming, and richer supported combinations remain incomplete. Prioritize double-club swing-clean foundations (#206) before advanced swipes/mills. Candidate source IDs/titles are in the JSON inventory. A candidate match is not technique verification. Keep the eight Books separate from this catalog; the provided 23,751-word Book I manuscript is editorial context, not newly certified engine evidence.

Reproduce with `node scripts/audit-curriculum.cjs`. No production data is read or modified.
