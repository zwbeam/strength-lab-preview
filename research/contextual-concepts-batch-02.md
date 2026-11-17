# Contextual concept review — source #496
Status: initial transcript-text review (2026-11-16). Source: `sources-16.json`, #496, “Mark Wildman Q&A - May 13th, 2023”. This is a long multi-topic Q&A; passages below were directly reopened and reviewed, not a certification of every segment or video. Offsets refer to the zero-based character index in `text`.

## C007 — Weaker side sets the limit; stronger side matches
**Anchor:** text offset ~11,200, Q&A “imbalance specifically kettlebell overhead pressed left side is not as strong as the right side”.
**Teaching:** For unilateral pressing, Wildman says to start with the weaker side and match its work with the stronger side rather than adding extra sets to the weak side.
**Scope:** Unilateral training example; does not establish identical side rules for all asymmetrical rehab or medical cases.
**App check:** `engine.js` includes weaker-side instructions for snatch and get-up, but this initial check does **not** establish that every unilateral movement's scheduler and actual-rep logging enforce weak-side-matched work. Audit required.
**Destination:** movement_instruction, engine, learn. **Status:** text-reviewed; engine gap unverified.

## C008 — Microloadable paired bells permit fixed-volume load progression
**Anchor:** text offset ~7,000–9,200, Q&A on double clean-and-press/front squat and microloading.
**Teaching:** Wildman contrasts earlier fixed-weight volume/density strategies with adjustable bells, discussing a five-by-five example and adding approximately 0.5 kg per bell per workout while holding sets/reps constant. He also mentions 10×10 German-volume training as a separate example.
**Scope:** Equipment-dependent illustrative programming, **not** a recommendation to impose 10×10 or 0.5 kg per bell on every user.
**App implication:** Check if the existing paired-bell profile can distinguish fixed-volume microloading from volume progression. Strength Lab's 2 kg adjustment increments may make the described half-kilo-per-bell example unavailable; no automatic approximation is authorized.
**Destination:** engine, curriculum, learn. **Status:** text-reviewed; method implementation pending.

## C009 — Training frequency must respect the actual activity and schedule
**Anchor:** text offset ~13,000, Q&A on combining pull-ups, running, swings and clean-and-press.
**Teaching:** A two-exposure-per-week starting answer is offered for each activity, but Wildman emphasizes that “running” is too broad without knowing the event and that frequency must fit the work schedule.
**Scope:** Individual question, not a universal minimum or a fixed weekly template.
**App implication:** Coordinator should preserve meaningful exposures where feasible without promising that every desired movement fits every schedule.
**Destination:** curriculum, learn. **Status:** text-reviewed.

## C010 — Rest modification depends on purpose, load and technique
**Anchor:** text offset ~17,600–19,100, Q&A on extending mill-squat rest to 45 seconds.
**Teaching:** Wildman explains that the standard 30/30 timing is part of that program's intended adaptation, and reducing load may be preferable to changing rest when the issue is excessive weight; he also acknowledges that modifications may be appropriate with sufficient reason.
**Scope:** Specific club protocol, not a universal 30/30 rule or an instruction to train through unsafe symptoms.
**App implication:** Explain when a change alters the intended method. Allow safe modification without silently representing it as the original source protocol.
**Destination:** engine, learn. **Status:** text-reviewed.

## C011 — Return from time off should reflect break length and retained skill
**Anchor:** text offset ~22,500–25,300, Q&A on resuming a program after a break.
**Teaching:** Wildman distinguishes short breaks from longer ones, describes reducing load after longer interruptions, and explains that previously learned skill can make rebuilding faster than first-time progression. He explicitly says there is no universal math because activity during the break and individual circumstances matter.
**Scope:** Coaching anecdotes, not a general-purpose fixed percent-deload formula.
**App implication:** Evaluate re-entry algorithm against actual history and individual context. Do **not** encode the quoted three-week reduction example as a universal threshold. Retain prior mastery while allowing conservative load reduction.
**Destination:** engine, curriculum, learn. **Status:** text-reviewed; implementation comparison pending.

## Synthesis and guardrails
These passages reinforce source #281's **method-specific training** and source #557's **schedule-adaptable programming**. They add a specific caution: **the source explicitly rejects a universal re-entry formula**, so app numerical thresholds must remain labeled as application heuristics.

## Next audit
Trace the actual engine's unilateral rep balancing, adjustable-bell increments, return-to-training history, and method-specific timing. Compare Learn copy to these anchors. Review other passages in #496 and corroborating sources before treating any Q&A example as a general Wildman policy.
