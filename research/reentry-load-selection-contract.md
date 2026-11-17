# Re-entry working-load selection — implementation contract
Status: design gate, 2026-11-16. Source basis: transcript #496 reviewed in `research/contextual-concepts-batch-02.md`. Application-specific behavior below is **not** a quoted Wildman algorithm.

## Verified existing implementation
- `engine.js` computes re-entry after an absence and reduces sets/reps, while leaving the prior working load unchanged.
- `returnLoadReview` and the Train/Workout warning are advisory, not a safety interlock.
- `setInitialLoad` deliberately refuses movements with existing weight/history.
- `replaceUnavailableLoad` refuses to change an existing **available** working weight.
- `selectLoad` is a post-cycle progression mechanism; it is not an appropriate route to decrease load on re-entry.
- `loadResetAfter` anchors a new progression cycle to a historical record; any re-entry-specific change must preserve the old session history and not reactivate earlier load-cycle progress.

## Required user flow
1. After a long gap, show the previous working weight and a list of **owned, valid loads for that movement**, with a neutral suggestion to consider a lighter load. No fixed percentage and no claim that one weight is medically safe.
2. Explicit actions: **Keep previous weight** or **Choose a lighter available weight**. Never automatically select, silently modify, or force a lighter load.
3. Do not offer a weight above the previous working weight in this re-entry-specific flow. Reject unowned, nonpositive, mismatched pair, and profile-incompatible loads.
4. Do not offer this action for bodyweight movements, active pain holds, an unfinished draft, or movements requiring a separately configured wave load pair.
5. If lighter weight is chosen, preserve all prior sessions and historical load. Establish a clear load-reset boundary before the new working-load cycle. The existing re-entry dose and no-progression-credit rules must still apply.
6. If previous weight is retained, log the explicit choice without fabricating source authorization. Consider whether the confirmation needs to persist per re-entry episode; avoid repeat prompts every render.
7. Recovery/pain review must continue to override re-entry, and previously recorded evidence must remain auditable after backup/restore and history correction.

## Required tests before release
- Re-entry at 16 kg with owned 12/16 kg: selecting 12 results in a 12 kg next prescription while historical 16 kg sessions remain unchanged.
- Selecting 18 kg, an unowned load, or invalid pair fails without mutation.
- Re-entry after a short break is rejected; bodyweight, wave and pain-hold routes are rejected.
- An active workout cannot have its load changed mid-draft.
- Reload and export/import retain the selected weight and cycle boundary; history edits cannot resurrect the old load stage.
- Explicit Keep Weight works, without granting clean progression credit.
- Touch UI at 320 and 390 px presents both choices without horizontal overflow.

## Decision
Do not reuse `replaceUnavailableLoad` or `selectLoad` as an undocumented shortcut. Implement a separate engine action plus focused regression tests and an intentional workout-setup control. Until this is verified, keep the current warning advisory.
