# Engine fidelity audit — pass 1 (2026-11-10)

Scope: current integration/research-coverage-audit engine.js. This is a code-to-behavior inventory, **not** a certification that 719 source transcripts were all integrated. The research source ledger/editorial integration map must be cross-checked before any such claim.

## Verified in engine source
- `policyFor`: movement-specific profiles include snatch EMOM, double-kettlebell grind, club timed bouts, heavy/light wave, get-up, push-up, foundational practice. Each profile exposes source references, but their correctness must be independently checked against audit notes.
- `successful` and `completeRecord`: clean, completed, adequate-set/rep and valid-load requirements; bilateral and cadence constraints; pain/technique restrictions.
- `prescription`: repeat-clean-exposure threshold; repeated failure rebuild; optional redistribute strategy; low-readiness reduction; reentry after training gap; cycle milestones.
- `prerequisites`: skill flags and evidence from prerequisite movements.
- `chooseCycle` / `loadOptions` / `selectLoad`: guarded cycle transitions and load increases.
- `timeBudget`: 8-minute warmup, 10-minute cooldown, 30–120-minute strength session; cooldown duration is explicitly an app adaptation.
- `validateBackup`: versioned input validation.

## Unverified / remaining work
1. Cross-reference each profile's `sources` and `exactParametersSource` against the 719-good-source ledger, editorial integration map, and exceptions queue. Confirm explicit prescription vs app heuristic.
2. Add deterministic longitudinal tests (30/180/365/1825 days) for clean exposures, plateaus, repeated misses, pain holds, low readiness, gap reentry, alternate activities, equipment ceilings, and training cycle milestones.
3. Assert safety invariants: no progression from incomplete sets, skipped sides, poor technique, pain, non-strength activity, or a reduced-readiness session; no automatic load increase past inventory/limits.
4. Verify scheduling: strength vs recovery, no double credit, missed days, movement dependencies, heavy/light ordering, and program transitions.
5. Test long-history report performance and backup round-trip with thousands of entries.
6. Complete timer cue integration across warmup, cooldown, mobility and strength; test real Android screen lock and interruption behavior.
7. Resolve outstanding source-verification flags without promoting uncertain captions or medical claims to instructions.

## Release gate
Keep frozen preview and production unchanged. Promote only after research traceability, longitudinal invariants, CI regression, and hands-on Android acceptance tests pass.
