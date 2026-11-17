# Strength Lab — Research Integration Ledger Contract
This is the schema and accounting policy, NOT a claim that every source has been concept-classified. The generated ledger is the next development task.

## Source accounting
720 archived source records; 719 usable; corrupt #441 excluded. Retain original archive IDs, video keys, shard names and provenance. Do not collapse duplicate sources into one accounting row.

## Two linked tables
**Source table (one row per archive source):**
`source_id, video_key, shard, usable, text_hash, review_state, linked_concept_ids, outstanding_questions`.

**Concept table (one row per distinct teaching, many sources allowed):**
`concept_id, kind, canonical_name, variants, source_anchors, evidence_quality, implementation_destination, implementation_status, validation_status, outstanding_questions`.

Allowed `kind`: `movement`, `technique`, `troubleshooting`, `prerequisite`, `dose`, `progression`, `program_composition`, `recovery`, `lifelong_philosophy`, `decision_rule`, `other`.

Allowed destinations: `engine`, `movement_instruction`, `learn`, `curriculum`, `book`, `exclude_with_reason`, `unassigned`. A concept may have multiple destinations.

## Evidence levels
- `inventoried`: record exists; no content claim.
- `candidate`: keyword/title/automated extraction proposes a match; human review required.
- `text_verified`: full relevant transcript passage checked and anchored.
- `visual_pending`: video-dependent cue not visually confirmed.
- `implemented`: code path exists; does not certify source fidelity.
- `regression_verified`: deterministic test passes for the implementation.
- `physical_verified`: real device or physical technique acceptance separately recorded.

Source-backed prescriptions must preserve their scope, e.g. example vs general rule. Numeric gates or defaults not directly supported are labeled app-authored. Contradictions are retained as explicit variants rather than silently harmonized.

## Required audit outputs
1. Full 720-row source table and 719 usable accounting.
2. Source-key uniqueness, missing/duplicate IDs and excluded-source check.
3. Concepts by kind, evidence quality, destination and integration status.
4. Unassigned and unresolved concept queues.
5. Matrix mapping concept IDs to engine policy, instruction, Learn topic, curriculum or Book destination.
6. Stable, reproducible generation command with test fixtures.

## Existing inputs
`research/curriculum-coverage-current.json`, `research/movement-integration-coverage.json`, `research/*evidence.json`, `source-index.json`, `sources-00.json` through `sources-23.json`, `scripts/audit-curriculum.cjs`, `scripts/audit-integration.cjs`. Existing metadata is a starting point, not a substitute for full-text evidence.
