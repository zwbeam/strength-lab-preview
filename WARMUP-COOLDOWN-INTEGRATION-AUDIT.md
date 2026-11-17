# Warmup / cooldown source-to-engine audit — checkpoint 1

Status: **evidence and implementation inspection incomplete**. This document deliberately separates verified repository descriptions from unverified behavior. Do not mark release-ready on the basis of this checkpoint.

## Confirmed from current repository documents
- `ENGINE-KNOWLEDGE-STATUS.md` describes an engine pipeline of eligibility → program coordination → source-specific prescription → immutable draft → actuals → replay → continuity → persistence.
- `SETTINGS-CONTROLS-AUDIT.md` states the selected session time influences preparation, cooldown and whole-prescription fit, and that active drafts preserve written targets and pacing.
- `TRAINING-RULES.md` identifies source-specific methods and explicitly distinguishes app decisions from transcript-backed rules.
- The documentation does **not** demonstrate a comprehensive source-to-rule audit for warmups and cooldowns. Their research fidelity and full implementation remain unverified.

## Source-to-rule matrix (initial)
| Concern | Current evidence | Required verification | Status |
|---|---|---|---|
| Preparation budget | Settings control audit: duration affects preparation and whole-prescription fit | Inspect generator implementation and 30/45/60-minute output | Not independently verified |
| Movement-specific warmup | No verified source-to-code mapping in available documents | Identify each active family’s chosen preparatory movements and cited source IDs | Open |
| Skill rehearsal | Engine has familiarity/prerequisite gates | Verify rehearsal choice does not confer technique mastery or progression credit | Open |
| Cooldown budget | Settings control audit: cooldown included in duration calculations | Inspect selection, duration, skipping, and active-draft behavior | Not independently verified |
| Source attribution | Evidence files distinguish transcript instruction from app choices | Link every asserted Wildman principle to accessible source evidence; mark gaps | Open |
| Readiness/re-entry | Existing continuity and conservative return-load rules documented | Test warmup/cooldown under low readiness and absence without rewriting history | Open |
| Safety | Pain holds, equipment and geometry gates documented for movement admission | Verify prep/cooldown uses equivalent restrictions and offers safe substitutions | Open |
| Determinism/variety | No documented warmup selection proof | Test repeatability for same input and variation across sessions | Open |

## Engineering contract for next implementation
1. Inspect the actual warmup/cooldown selector and its callers before editing.
2. Preserve source-specific numerical methods; never silently shorten main work to fit accessory preparation.
3. Use a source ID + exact supported claim for any Wildman-attributed rule; label unsourced choices as Strength Lab design.
4. Distinguish general readiness, pattern rehearsal, and optional mobility. Avoid treating preparation as a progression workout.
5. Make preparation/cooldown respond to active movement, equipment, space, familiarity, pain flags, readiness, and absence without automatic technique clearance.
6. Verify 30/45/60-minute envelopes, active draft persistence, offline reload, export/import and no timer-generated credit.
7. Run targeted regression and full audit/browser smoke at current head; record commit SHA and run URLs.

## Release gate
Do not claim full 719-source integration, verified Wildman warmup philosophy, or production readiness until source evidence, engine behavior, and tests substantiate those claims.

Related: issues #2 and #3.
