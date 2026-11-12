# Instruction completion — evidence retrieval queue

Status: **candidate identification only**, not transcript review or technique verification. This queue uses the source inventory plus the live v74 movement-instruction registry. The inventory's old “Not yet reviewed in full” status and this document's historic 504/720 checkpoint are stale. A separate review effort reports 719 usable transcripts reviewed, but its final ledger and evidence anchors have not been reconciled against this repository. Do not equate transcript review completion with complete movement instruction coverage.

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

## Expanded source-index triage (2026-11-11)

The repository's `source-index.json` was searched by title for each incomplete movement. These are **new retrieval leads, not verified technique citations**:

| Movement | Additional candidates / result | Evidence caution |
| --- | --- | --- |
| Suitcase carry | No title-matched carry lesson. #114 suitcase deadlift and #589 double suitcase deadlift are different exercises. | Do not map deadlift technique to walking carries. |
| Two-hand club front swing | No exact front-swing lesson found by title. | Front press and kettlebell front swing are not equivalent. |
| Turkish get-up | #604 `TURKISH GET UP - A PRIMER`; #18 introductory drills; #20 mastery series; #23/#24 drill series; #620 hardest parts. | Confirm each transition in transcript and visually dependent positions in video. |
| Double clean and press | #152 dedicated double clean/press lesson; #162 double clean/press; #47 dead-stop double clean; #120 programming. | Separate technique evidence from volume-programming evidence. |
| Snatch | #413 technique; #478 half-snatch up; #262 half-snatch down; #381 high transition. | Verify grip, insertion, lowering and prerequisites, not only volume-cycle math. |
| Two-hand shield cast | #214 dedicated two-hand cast; #222 two-hand shield cast; #77 shield cast; #498 shield-cast variant. | Do not substitute single-arm technique; confirm behind-head clearance and breathing visually. |
| Push-up EMOM | #609 progression math; #608 progression method 2; #251 40% rule; #253 frequency; #92 half-screwing pushup. | Programming advice does not by itself certify full push-up setup/regressions. |

**Next verification action:** retrieve complete text of these candidate IDs from `sources-00.json` through `sources-23.json`, record passage-level anchors and classify each claim as explicit, inferred or app-authored. Do not change `movement-instruction.js` coverage labels based on this title search alone.

## Direct transcript evidence sampling (2026-11-11)

Full transcript text, rather than only title metadata, was read for the following source IDs from the repository's `sources-XX.json` files. **This is a source-text review, not a visual-technique certification or a coverage-label change.**

| Movement | Source and directly supported content | Remaining limitation |
| --- | --- | --- |
| Turkish get-up | #604 (`sources-20.json`): begins lying on the ground; sets the kettlebell hand in the handle corner with the other hand assisting; describes locked-out overhead support, ground-to-stand and return, and lowering the weight with assistance. | Visual confirmation of every hand/foot transition and whether the current app outline matches the demonstrated variant. |
| Double clean and press | #152 (`sources-05.json`): thumbs back at bottom, spiral into rack, thumb near collarbone, stable wrist, shoulder opens during press, overhead lockout, glute/trunk tension. It refers learners to separate double-clean and double-press videos. | Verify those prerequisite lessons and transitions before calling the combined outline complete. |
| Snatch | #413 (`sources-13.json`): prerequisite progression from swing to clean to press; clean-and-press up/snatch down drill; bell travels around the outside of the hand rather than flipping over it; aligned wrist and overhead lockout. | Verify hand insertion, snatch-up phase and visual details in the original video; transcript has garbled sections. |
| Two-hand shield cast | #214 and #222 (`sources-07.json`): top hand travels past opposite ear, thumb comes toward shirt neckline; #222 teaches pullover and behind-head backswing prerequisites, 90-degree order position, upright posture, both sides and common hand-height faults. | Behind-head clearance, precise arc and breathing need visual confirmation; avoid claims of medical prevention. |
| Push-up EMOM | #609 (`sources-20.json`): test strict clean maximum without back sway; start around 40% of that number per set for novices; use an every-minute-on-the-minute volume cycle starting around ten minutes and add sets over time. | This supports a programming example, not a complete instructional guide to push-up hand placement and regressions. |

No exact suitcase-carry or two-hand club front-swing source was established in this pass. None of the seven `movement-instruction.js` lessons was automatically promoted to `reviewed outline`.

## Evidence standard

1. Read the actual transcript, not merely its title or the inventory's provisional topic tags.
2. Record exact source ID, video key, relevant passage/offset, and whether a cue is explicit or inferred.
3. Verify visually dependent cues in the original video before asserting them as exact technique.
4. Update `movement-instruction.js` coverage, source IDs and video mappings only after verification; retain a candid “partial” label until the entire lesson is supported.
5. Rerun `tests/instruction-coverage-regression.js` and the complete engine suite. The current test's seven-incomplete count is a checkpoint and must be deliberately updated when coverage changes.
6. Import and verify the final 719-usable-source review ledger and evidence anchors before updating source-review status. Keep that ledger separate from the seven movement-lesson completeness checks. **No additional source is counted reviewed by creating this queue.**

## Archive dependency

The final 719-source review ledger and its evidence anchors have not been reconciled in this repository. The older `Strength_Lab_Source_Inventory.csv` provides **candidate titles and IDs**, not proof of lesson-level verification. Do not fill these lessons from memory, rename unrelated exercises as evidence, or claim the seven lesson gaps are closed merely because the broader transcript review is complete. Do not fill these lessons from memory, rename unrelated exercises as evidence, or claim an increased reviewed count.
