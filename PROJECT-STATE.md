# Strength Lab — Current Project State
Updated: 2026-11-16. Branch: `preview`.
This is the durable handoff entry point. Read PROJECT-MASTER-PLAN.md and AGENT-HANDOFF.md before making changes.

## Verified baseline
- Previous application checkpoint: `dac8754f5` (2026-11-16). Research audit, synthetic-history regression, and Pages deployment were reported successful for that checkpoint.
- `PROJECT-MASTER-PLAN.md` committed at `6350519`; the current branch head will advance with documentation commits.
- Source accounting: 720 archived records; 719 usable; excluded source #441. Inventory is NOT complete integration.
- `MOVEMENT-INTEGRATION-COVERAGE.md`: 54 operational movements, 38 reviewed outlines, 16 partial or unsourced lessons.
- Existing research artifacts: `research/curriculum-coverage-current.json`, `research/movement-integration-coverage.json`, `ENGINE-KNOWLEDGE-STATUS.md`, `TRAINING-RULES.md`, `research/development-batches.md`.
- The external 505-source master ledger and anchored independent completion notes are not reconciled in this repository. The 214-row independent journal accounting does not certify matching source text.

## Current priority
**P0: durable coordination and evidence-based research inventory.** Do not add speculative numerical training methods. Canonical queue: DEVELOPMENT-QUEUE.md.

## Current batch
Project-control infrastructure completed: master plan, state, queue, decisions, handoff, research ledger contract. Documentation-only; no runtime engine changes or local regression tests in this batch.

## Next executable batch
Implement a deterministic, read-only source/concept audit that reads the existing transcript shards and coverage artifacts, produces a reviewable ledger of 719 usable sources, and reports mapped versus unmapped source evidence. Never automatically label a transcript as fully integrated based on title matches.

## Known blockers
- External master 505-source ledger and anchored review evidence unavailable in current repo.
- Physical Android/audio/technique acceptance not performed.
- Oversized program rotations can repeatedly trigger re-entry.
- Settings UX needs substantial redesign; Learn needs substantive content; preserve Train and Workout.

## Rules
Every future batch updates this file with: branch/head, completed work, test command and result, unresolved blockers, and exact next task. Do not assert test success unless executed or verified in Actions for the relevant commit. No production promotion or user-data reset without approval.
