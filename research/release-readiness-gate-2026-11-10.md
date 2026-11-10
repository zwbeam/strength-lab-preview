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
