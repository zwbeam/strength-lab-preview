# Engine comparison audit — C007, C008, C010, C011
Status: static code inspection, 2026-11-16. Source anchors: `research/contextual-concepts-batch-02.md`, transcript #496. Inspected `engine.js` on `preview`. No runtime tests executed in this audit; these are precise code-review findings, not validated user outcomes.

## A01 — Re-entry reduces prescribed dose but not necessarily load
**Evidence in engine:** `movementGap(s,id,...)` calculates days since last actual-set record; `prescription(s,id,...)` uses `trainingDefaults.reentryDays ?? 14` and `reentryFraction ?? .7`. When gap exceeds threshold, it applies `reducedDose` to sets/reps and marks `mode='reentry'`; `weight=st.weight` remains unchanged in this branch. `stateFor` tracks unfinished re-entry and `replay` treats re-entry as no progression credit.
**Source comparison:** #496 discusses adjusting load after time off, preserving skill and individualizing by what happened during the break; it explicitly rejects a universal formula.
**Gap:** Current app policy can return someone to a previously heavy working load after a long break with fewer sets/reps, rather than selecting a conservative available load. This is a **design review risk**, not proof of unsafe behavior in all cases.
**Next action:** Specify an explicit load-review step on re-entry (with safe user choice), test no false progression credit, and ensure history is preserved. Do not encode source anecdote percentages as automatic rules.
**Priority:** High.

## A02 — Weaker-side parity is not established across the engine
**Evidence in engine:** `weakSide` is validated for the get-up profile and defaults to `left` in its policy. Some skill text explicitly says start weaker/match stronger. Static search found no general `sideBalance` field or unilateral scheduler enforcement. This does not prove the app cannot record sides elsewhere.
**Source comparison:** #496 explicitly advises weaker-side-first and stronger-side-matches for unilateral press.
**Gap:** Confirm UI/record schema and movement-specific prescriptions before claiming parity is enforced. Avoid using a default of left as evidence that left is weaker for every user.
**Next action:** Trace per-side logging and unilateral exercise generation; add tests for weak-side matching on applicable exercises.
**Priority:** High.

## A03 — Club interval adaptation requires method labels
**Evidence in engine:** `policyFor` and `prescription` have method/profile-specific doses and configurable rest; policy descriptions distinguish source numerical examples from app defaults.
**Source comparison:** #496 mill-squat Q&A favors maintaining 30/30 when feasible by selecting a lighter club, while acknowledging modifications.
**Gap:** Determine whether changed rest is displayed as a modified method and whether available club loads are considered before increasing rest. No behavioral mismatch certified yet.
**Priority:** Medium.

## A04 — Microload example is not a general progression mandate
**Evidence in engine:** `policyFor` supports movement-specific load configurations; `availableWorkingLoads` and paired-equipment checks constrain prescribed weights to configured equipment.
**Source comparison:** #496 discusses 0.5 kg increments per bell as an example with microloadable bells. Existing Strength Lab user equipment increments are coarser, so matching that example exactly may be impossible.
**Gap:** Confirm the actual paired-bell increment selection and user messaging; do not silently convert a 0.5 kg per-bell example to a compulsory larger increase.
**Priority:** Medium.

## Test acceptance criteria for re-entry feature
1. Given completed training and a gap beyond configured re-entry days, preserve mastery/history and offer a load review instead of silently reusing a heavy load.
2. Given a reduced re-entry session, no advancement credit is awarded; an incomplete re-entry remains pending.
3. Given a user-selected conservative available load, no unavailable weight is prescribed and the selected load is explicit in the log.
4. Given a short break, do not automatically reset prior achievements.
5. Given pain, continue to block progression until review; re-entry must not bypass a pain hold.
6. Distinguish app-chosen thresholds (14 days, 70% dose defaults) from Wildman's individualized coaching examples.

No code behavior was changed in this batch; implementation requires test harness review.
