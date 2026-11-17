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
Project-control infrastructure completed. New batch: scripts/build-source-ledger.cjs committed at a3cb02e; it deterministically constructs source-to-operational-movement declared links and checks 720/719/#441 accounting. The script is now run by .github/workflows/source-concept-ledger.yml (commit 1253d6f3), which runs generation and --check and uploads a 30-day artifact. Workflow run 43992431475 PASSED at commit 1253d6f3; generated and --check steps passed; artifact uploaded. Job logs: 720 total/719 usable, #441 excluded, 720 unique keys, 214 journal keys matched, 54 direct-instruction-linked source IDs, 7 programming-example-linked source IDs, 662 usable sources not linked to operational movement coverage, 54 operational movement concepts, zero accounting issues. Counts are declared-link discovery only, not a completeness score. Generated JSON has NOT been committed; new candidate passage artifact will also be uploaded by CI if it passes. No runtime engine changes.

## Next executable batch
Passage candidate discovery script committed at b08a3b61 and CI expanded at 8540a227. Check run 44005378459 for pass/fail and artifact summary. Review candidate excerpts in context; identify distinct source-supported concepts, duplicates, contradictions, and integration destinations. Candidate keyword matches are NOT verified teachings. Artifact 14287778763 is downloadable from run 43992431475 (30-day retention); generated JSON is not yet checked into repo. Avoid interpreting 662 unmapped declared links as 662 unused transcripts. Never automatically label a transcript fully integrated from title/declared source matches.

## Known blockers
- External master 505-source ledger and anchored review evidence unavailable in current repo.
- Physical Android/audio/technique acceptance not performed.
- Oversized program rotations can repeatedly trigger re-entry.
- Settings UX needs substantial redesign; Learn needs substantive content; preserve Train and Workout.

## Rules
Every future batch updates this file with: branch/head, completed work, test command and result, unresolved blockers, and exact next task. Do not assert test success unless executed or verified in Actions for the relevant commit. No production promotion or user-data reset without approval.
