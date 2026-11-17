# Strength Lab — Restart Instructions for ChatGPT and Codex
Read in this order:
1. PROJECT-MASTER-PLAN.md — vision and UX guardrails.
2. PROJECT-STATE.md — current verified baseline, blockers, next executable batch.
3. DEVELOPMENT-QUEUE.md — ordered tasks and acceptance criteria.
4. DECISION-LOG.md — architectural decisions.
5. RESEARCH-INTEGRATION-LEDGER.md — source/concept accounting contract.
6. ENGINE-KNOWLEDGE-STATUS.md, TRAINING-RULES.md, MOVEMENT-INTEGRATION-COVERAGE.md and relevant research evidence.
7. Actual engine.js, learning.js, movement-instruction.js and tests for the selected batch.

## Working protocol
- Inspect live `preview` HEAD and working state; never assume the previous chat's head is current.
- Select the highest priority feasible task. Prefer a complete bounded change over a long speculative plan.
- Read the relevant exact source text and implementation before asserting fidelity.
- For research work, preserve 720/719 accounting, excluded #441, original source keys, anchors, and the distinction between source fact and app choice.
- For code work, preserve backups, active drafts, historical actuals, method identities, recovery, prerequisite evidence and existing user data.
- Run relevant deterministic tests; where possible verify remote CI for the exact commit. Report unrun tests candidly.
- Commit coherent work to `preview`; update PROJECT-STATE.md and queue in the same batch or a following checkpoint commit.
- Do not overwrite unrelated concurrent changes. No production promotion without user approval.
- Respond to 'Continue' by resuming the next task; do not restart planning unless evidence changes.

## Handoff response template
**Checkpoint:** branch, commit SHA.
**Completed:** exact code/doc changes.
**Verified:** commands, pass/fail, or Actions links for that SHA.
**Not verified:** explicit limitations.
**Next:** one bounded task, required inputs and acceptance criteria.

## Long-horizon review
Every five development batches reconcile queue, source coverage and test status. Every twenty batches revisit curriculum, UX, redundancy and missing research. Counts of user messages are not measures of completion.
