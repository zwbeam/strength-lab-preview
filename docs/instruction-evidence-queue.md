# Instruction completion — evidence retrieval queue

Status: **candidate identification only**, not transcript review or technique verification. This queue uses the source inventory plus the live v74 movement-instruction registry. The inventory's old “Not yet reviewed in full” status is not the authoritative cumulative 504/720 research ledger. Reconcile against that ledger before assigning review status.

## Highest priority

| Movement | Existing evidence in app | Specific missing evidence | Candidate inventory source(s) | Action |
| --- | --- | --- | --- | --- |
| Suitcase carry (`carry`) | No mapped instructional source or video | Full setup, safe load handling, steps, common faults, breathing | No exact “suitcase carry” title found in inventory; **#115 “Build Your Core Quickly - Kettlebell 56 Suitcase Deadlift” is a different movement**, not a substitute | Locate an actual carry lesson or mark this instruction as original app guidance, not Wildman-sourced |
| Two-hand club front swing (`front`) | No mapped instructional source or video | Identify exact movement and teaching progression, not a front *press* | #235 “Heavy club 13 - front press” and #236 “Heavy club 2 hand Front Press” are **different movements** | Find an exact front-swing source; do not relabel a front-press lesson |
| Turkish get-up (`getup`) | #423 time-under-tension programming overview | Complete transition-by-transition stand and descent instruction, hand/foot positions, safety | #423 only supports a programming goal; inventory contains other get-up-related titles that need title/ID triage | Review dedicated technique lessons; keep timed programming distinct from technical mastery |
| Double clean and press (`doublePress`) | #152 combination outline | Dedicated double-clean instruction, rack setup, press transitions | #363 “Kettlebell Conan Cleans Low - Double kb clean to alternating cleans”; #257–259 “Kettlebell Manual Parts 2–4” are **candidates only**, not validated exact matches | Check transcript content before adding any mapping |
| Snatch (`snatch`) | #413 breakdown outline | Full beginner skill sequence, hand insertion, lowering, prerequisites | #571 “Simple Drills to Master the Kettlebell Snatch” (video key `crNLMShSSh0`) | Verify complete transcript and visual-specific details before updating |
| Two-hand shield cast (`cast`) | #214, #543 short technique notes | Full breathing, behind-head clearance and error corrections | Existing mapped lessons; other shield-cast variants are not interchangeable | Verify clearance and breathing from complete original |
| Push-up EMOM (`pushup`) | #609 clean-rep/programming lesson | Full setup, hand position, body alignment and regressions | #609 is programming-first | Separate source-derived volume prescription from app-authored setup |

## Evidence standard

1. Read the actual transcript, not merely its title or the inventory's provisional topic tags.
2. Record exact source ID, video key, relevant passage/offset, and whether a cue is explicit or inferred.
3. Verify visually dependent cues in the original video before asserting them as exact technique.
4. Update `movement-instruction.js` coverage, source IDs and video mappings only after verification; retain a candid “partial” label until the entire lesson is supported.
5. Rerun `tests/instruction-coverage-regression.js` and the complete engine suite. The current test's seven-incomplete count is a checkpoint and must be deliberately updated when coverage changes.
6. Preserve the verified 504/720 cumulative ledger independently. **No additional source is counted reviewed by creating this queue.**

## Archive dependency

The full transcript archive and latest durable review ledger were not accessible as raw files in this execution. The accessible older `Strength_Lab_Source_Inventory.csv` provides **candidate titles and IDs**, not the transcript contents or current review state. Do not fill these lessons from memory, rename unrelated exercises as evidence, or claim an increased reviewed count.
