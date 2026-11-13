# Training Emphasis — implementation contract

Status: design approved in conversation; **not yet implemented**. Keep equipment availability separate from temporary training intent.

## Settings
Each of Bodyweight, Kettlebells, Heavy clubs, and Complexes: Off / Minor / Major. Initial defaults should preserve the current scheduler until user explicitly opts into emphasis. Kettlebells and clubs retain existing maximum loads, available-load inventories and double-kettlebell eligibility. Do not imply a second club is available unless actually configured. Complexes are a *style overlay* on eligible kettlebell/club movements, not a fourth independent piece of equipment. Only expose eligible verified complexes; do not invent club complexes.

A separate Mobility-only toggle temporarily overrides strength scheduling. Mobility sessions should honor selected duration (e.g. 30 minutes) and be varied and conservative. It does not alter movement progression history or silently record completed strength exposures.

## Engine invariants
- Off means do not schedule that family, but preserve history, progression stage and user equipment.
- Minor/Major are relative priorities, not fixed workout percentages. Use weighted rotation over several sessions with anti-starvation and fatigue/recovery spacing. Example weights Minor=1, Major=3; two Majors share priority equally.
- Complex emphasis changes *style selection within available equipment*, not prerequisite, skill, load or pain gates. If no complex is eligible, explain why and schedule suitable foundations; do not produce an empty session solely due to complexes.
- Bodyweight-only is a legitimate equipment-free program. Mobility-only should work without kettlebells or clubs. If every emphasis is Off, show an actionable configuration message.
- Switches affect future prescriptions only; never rewrite completed workouts, clear saved weights, grant proficiency, auto-promote a movement, or accelerate catch-up after a break.
- Recovery holds, load ceilings, double-bell requirements, duration bounds, and minimum spacing remain hard constraints.
- Keep existing training-focus (strength/capacity/skill/balanced) distinct from *equipment emphasis*; clarify labels in UI.

## Test acceptance
1. Every single-family-only combination, plus KB+club Major/Major and Major/Minor over 20+ planned sessions.
2. All Off, complexes without prerequisites, double KB disabled, and club unavailable.
3. Mobility-only override with no gear; exit override restores original progression state.
4. Change focus after months of logged workouts; no history or progression loss.
5. Pain/reentry and deload safeguards unchanged.
6. Small-screen settings layout and saved preference migration; old backups preserve existing scheduling until emphasis is set.
7. Explicit research provenance: Wildman-derived volume/density and movement prerequisites versus Strength Lab-specific scheduling weights and focus controls.

## Delivery order
1. Add persistent, validated preferences with migration and settings UI.
2. Integrate into block planning and candidate scoring, with deterministic rotation and no progress mutation.
3. Implement mobility-only plan and completion behavior.
4. Expand verified eligible complexes, then full browser and engine regression tests.

## Train page interaction (user-approved, November 13)
- Keep the existing always-visible duration adjustment and calendar unchanged.
- Under the expanded calendar display a compact live emphasis distribution bar visualization; tapping it opens a small emphasis editor with Major/Minor/Off for four families, mobility-only override and Save/Cancel.
- Below that, display the current workout style as a separate compact action; tapping opens a second small style editor and Save/Cancel.
- The settings page and Train dialogs share one source of truth, validation, and save behavior. Saving immediately updates the Train summary and future prescriptions; cancelling makes no change.
- Mobility-only visually sets every other emphasis to Off while active, but retains the previous four emphasis values and both equipment maximums for restoration when disabled. Never overwrite or zero the underlying stored values.
- Keep weight ceilings and double-equipment controls in the equipment section; do not cram them into the Train popup. Ensure accessible buttons, keyboard dialog dismissal, and narrow mobile layout.
- Remove redundant workout-style controls from the duration quick-adjustment area while preserving the duration control itself.
