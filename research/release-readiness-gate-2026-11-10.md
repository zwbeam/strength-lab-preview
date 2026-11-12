# Strength Lab integration — release gate (2026-11-10)

## Scope and protected branches
- Candidate: `integration/research-coverage-audit` in `zwbeam/strength-lab-preview`.
- Frozen `preview` branch and production `zwbeam/strength-lab` are intentionally unchanged.
- This document is a gate, **not** authorization to merge or deploy.

## Verified automatically
- GitHub Actions for `449c210c25f5929df92438debb4296e2bfa8f838`: success.
- Browser smoke coverage at 390px and 1280px, including equipment inventory, ceilings, matched pairs, replacement load workflow, guided mobility, Training Log and history correction.
- 540-session pagination, correction, export payload, valid import, malformed import rejection and cancelled import.
- 2,600-session history rendering, bounded pagination, historical correction, repeated render/reload, saving workout 2,601, and simulated quota-exhaustion rollback.
- Document horizontal-overflow check for decade-scale Training Log.

## Not yet verified / release blockers
1. **Real-phone training walkthrough:** choose a workout, inspect setup guidance, start, operate timer and audio cues, record partial and completed sets, save, reopen Training Log. Test backgrounding/returning to app.
2. **Real-device backup:** export a JSON file, confirm it is present in device downloads, and restore into an isolated browser/profile. The automated export test checks generated JSON content, not the operating system's download/save experience.
3. **Usability review:** read the Training Report after a realistic month of mixed completed, missed, substituted, and mobility sessions. Check that empty states and prescribed-versus-completed counts are understandable.
4. **Release decision:** review the draft PR and branch diff; decide whether to merge into preview. Production deployment remains a separate explicit decision.

## Safe manual smoke script
1. Export a backup of existing training data **before** opening a candidate build.
2. Test the candidate in a separate browser profile or isolated storage; do not import production data unless intentionally testing restoration.
3. Configure actual KB increments, matched pairs and club loads; save and reload.
4. Complete one 30-minute workout with timer and cues; edit a recorded set, then save.
5. Verify the session and movement history; export, reimport in isolation, and compare session count and equipment.
6. Note issues with screenshots and reproduction steps. Do not merge until blockers are resolved.

## Decision
**Automated gate: passed at 449c210. Manual gate: pending. Release status: hold.**

## 30-round QA checkpoint — November 11, 2026

**Scope:** final 30-round development/QA sequence on `preview`, not production. This updates the earlier automated-gate snapshot without overriding its manual-release blockers.

- `d3cd9d65`: repaired validated-backup nested-object aliasing discovered by the 500-session restore regression. Both GitHub Actions workflows passed.
- `889ae5d3`: added deeper restoration isolation assertions for movement records, equipment and working weights. Both workflows passed.
- `166522ca`: wired offline-precache integrity test into mandatory research audit. Research audit **and** browser smoke jobs passed; Pages build passed.
- `e2a50136`: strengthened offline-precache assertions for query-string duplicate entries and app entry point. **CI still in progress at the checkpoint inspection.** Do not mark this commit green without a completed successful run.
- Browser smoke now exercises 320px, 390px, 832px landscape, and 1280px layouts; passing browser-smoke CI was confirmed for the previous commit.
- Multi-year simulations, backup corruption rejection, and offline manifest integrity have automated checks. They do not prove actual multi-year training effectiveness or device-specific behavior.

### Release decision

**HOLD — no production merge or Cloudflare changes.** All four manual release blockers above remain open until actual-device validation and an explicit release decision. The latest commit also requires green CI. No source review count should be interpreted as proof that all 719 usable transcripts have been faithfully implemented.

### Exit criteria

1. Confirm both workflows green on the final candidate commit, including audit and browser-smoke jobs.
2. Run the real-phone timer/audio/backgrounding and backup export/import walkthrough above.
3. Review the one-month mixed-history Training Report and complete a research-fidelity spot audit against documented evidence.
4. Resolve findings, retest, and obtain explicit authorization before any production deployment.

## Current preview checkpoint — November 11, 2026 (later QA)

The initial candidate-branch and frozen-preview descriptions above are historical. The active development candidate is now **`preview`** in `zwbeam/strength-lab-preview`; this is not authorization to replace the separate production app.

- Commit `1683136c7b330dd29fa284b555b9fbb016da24bd`: Research coverage audit **success** (both `audit` and `browser-smoke` jobs), GitHub Actions run `43158927592`. The Chromium test includes a real service-worker offline reload and tab-navigation scenario at 390px.
- That test first exposed a network-status handler exception in commit `ced9cf2`; commit `1683136` guarded the missing status element and the expanded test subsequently passed.
- Commit `f740066e86411f28940b412a526027afc0b84a0e` updates documentation only. Its audit workflow was not triggered by that docs-only commit; do not claim a new green audit for it. The prior green code-test checkpoint remains `1683136`.
- Instruction-evidence queue still has **seven incomplete lessons**. The independent 719-usable-source review completion must be reconciled with source-level lesson evidence; neither the old 504/720 checkpoint nor the inventory's provisional statuses are current certification.
- **Manual Android timer/audio/backgrounding, OS-level JSON download and isolated restore, realistic month-history usability, and explicit production decision remain open. Release: HOLD.**
