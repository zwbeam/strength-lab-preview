# First contextual concept review — sources #281 and #557
Status: **transcript-text reviewed, initial pass** (2026-11-16). Not a video/technique verification, complete-source audit, or implementation approval. Sources: `sources-09.json` (#281, “July 7. 2022 q and a”) and `sources-18.json` (#557, “Q and A may 26”). Passage anchors are distinctive question/topic phrases; transcript captions contain errors. Reopen full source before converting any finding to numeric code.

## C001 — EMOM primarily develops work capacity
**Source #281**, Q&A topic: “compare and contrast every minute on the minute strategies to traditional sets for strength hypertrophy and endurance”.
**Transcript-supported teaching:** Wildman contrasts traditional strength training with longer rest against EMOM using intermediate loads and completing substantial work in limited time. He characterizes EMOM as closer to endurance/work capacity than maximal strength, and explicitly discusses rest and load adjustment when the intended rest interval is not achieved.
**Scope:** Discussion of training methods, not a universal prescription for every movement.
**App implication:** Explain EMOM as a work-capacity method, not a maximal-strength equivalent. Do not apply a blanket 40:20 interval to every EMOM movement; source also discusses swing rep-based EMOM. `engine`, `learn`, `curriculum`.
**Review state:** text-reviewed; exact prescriptions require separate movement-specific verification.

## C002 — Different movement families use different time structures
**Source #281**, same EMOM Q&A passage.
**Transcript-supported teaching:** Swing EMOM progresses from approximately 6–8 repetitions toward 20; clean-and-press work is discussed as longer bouts of approximately 2.5–3 minutes; club work uses 30/30 among several possible intervals. Wildman also describes longer endurance sets as a distinct later direction.
**Scope:** These are examples in a comparative Q&A, not a single universal workout or simultaneous goal.
**App implication:** Preserve movement-specific dose models and explicit program methods. Check existing swing, clean-and-press and club profiles before adding numerical gates. `engine`, `learn`.
**Review state:** text-reviewed, **numeric implementation pending comparison**.

## C003 — Short modular workouts preserve consistency around physical work
**Source #557**, question: contractor with demanding work days and a 16 kg kettlebell.
**Transcript-supported teaching:** Wildman says he would shorten training rather than automatically abandon it; he describes a 10-minute swing option, a 15-minute option, a 20-minute club program, and stacking short sessions when time permits. The discussion emphasizes reinforcing fundamental movement patterns around physically demanding work.
**Scope:** Answer to a specific contractor; not advice to train through injury, illness or unsafe fatigue.
**App implication:** Add a reduced-session path that maintains the current movement's identity and training history, without manufacturing full-session completion. Respect fatigue, recovery and user choice. `curriculum`, `engine`, `learn`.
**Review state:** text-reviewed; adaptive rules would be app-authored unless separately supported.

## C004 — Alternating club skill pathways and balancing directions
**Source #557**, question: regressed mill to catch up with reverse mill; asks how to schedule shield casts.
**Transcript-supported teaching:** In this example Wildman recommends balancing mill and reverse-mill volume and performing them twice weekly; he proposes a separate twice-weekly shield-cast day with optional inside/outside circles or kettlebell movements. The example distinguishes A/B training exposures.
**Scope:** Individual Q&A programming example; not a universal requirement for every club trainee.
**App implication:** Candidate for a club skill-balance pathway, subject to available equipment, readiness, and actual training frequency. Do not automatically impose a four-day schedule. `curriculum`, `learn`.
**Review state:** text-reviewed; schedule generalization not approved.

## C005 — Training accessibility and durable equipment
**Source #557**, opening discussion about the “common man”, economic constraints and durable kettlebells/clubs.
**Transcript-supported teaching:** Wildman frames training as economical, accessible to working people, and based on simple durable equipment rather than expensive gyms.
**Scope:** Programming philosophy, not a numerical rule.
**App implication:** Keep equipment requirements explicit and avoid equipment-upgrade pressure; make time-efficient paths first-class. `learn`, `product_vision`.
**Review state:** text-reviewed.

## C006 — Technique and progression should be taught in understandable order
**Source #281**, windmill/bent-press Q&A passage.
**Transcript-supported teaching:** Wildman discusses re-teaching swing, clean, hand change, press, clean-and-press, get-up and squat as an organized instructional sequence; he separately describes windmill variants leading toward bent press.
**Scope:** A proposed teaching sequence in a Q&A, not a certified dependency graph.
**App implication:** Use as an editorial lead for Learn sequencing. Do not enforce all mentioned steps as mandatory engine prerequisites without cross-checking instructional sources. `learn`, `curriculum`.
**Review state:** text-reviewed; dependency validation pending.

## Preliminary synthesis
The strongest cross-source pattern in these two passages is **method-specific doses combined with flexible session length**: #281 explains why different training methods should not be collapsed into one timer, while #557 describes shortening or stacking modules to fit real working schedules. This is a reason to *investigate* a compact curriculum coordinator, not evidence that the proposed core-plus-development algorithm is already Wildman's system.

## Open checks
- Review full surrounding sections and independent corroboration before converting any example into automatic dose or schedule.
- Verify existing engine method profiles and session-shortening semantics.
- Preserve source-specific scope; do not count these six concepts as six distinct newly implemented features.
- The ranked queue's #496 is not fully reviewed here; review it in a later batch.
