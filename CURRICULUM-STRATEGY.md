# Capacity-aware lifelong curriculum

This is the implemented Strength Lab strategy, not a claim that the Wildman
archive or the ten-area release gate is complete. The source facts and limits are
recorded in `research/curriculum-strategy-evidence.json`.

## Foundations, development and maintenance

The existing selected core retains its reserved opportunities. Its physical
attendance, observed movement coverage, actual unfinished work, available
training frequency, recovery and selected duration still govern that reservation.
A thirty-minute protected workout includes preparation and cooldown within thirty
minutes. No new curriculum questionnaire or preference is required. Actual workout plans
remember scheduling intent; earned eligibility is always replayed from actual work.

Protected A/B/C scope uses the same current C-day choices and equipment fallbacks
as workout generation, including reachable later days. Retired declared patterns
do not create current recurrence demand; days containing only retired patterns
do not inflate the visit distance of current foundations. Attendance credit for
the new curriculum starts after the latest retired-pattern day, including partial
physical work. This prevents old-program surplus from postponing current work.
All actual receipts, pending debt and independent movement progress remain saved.
These are app accounting rules, not a new source frequency prescription. See
`research/core-scope-evidence.json` for changed-goal tradeoffs and open limits.

When the ready selections fit the current capacity estimate, ordinary balanced
coordination continues. When they exceed it, the engine focuses eligible developing
work on one program's current movement cycles. Other selected programs remain
saved and queued. A completed supporting-practice qualification alone does not
certify a whole progression cycle. Graduation requires replayed actual work in
the current methods and loads; unconfirmed technical skills stay unconfirmed.

The focused program continues across reserved core and maintenance sessions.
Changed equipment, selected programs, method settings and available time are
reassessed. An unavailable or infeasible lane can wait while another eligible
choice uses the capacity. Historical work is preserved. The existing continuity
opt-out retains the earlier rotation behavior.

## Earned maintenance and full review

Source #123 discusses shorter, submaximal kettlebell/club work while combining it
with conventional lifting. It does not give a universal maintenance algorithm.
Strength Lab adapts that concept only after a current method's cycle is earned
and its full endpoint is review-eligible:

- Ordinary earned targets can use nonadvancing light maintenance: approximately
  half the units, or one familiar set in short sessions. Single timed bouts use
  the existing whole-unit reduction rules. These numbers are app choices.
- The familiar working load, per-set parameters and pacing structure are retained
  where units are reduced. No unowned lower load is invented. Wave and row-wave
  methods keep their independent full prescriptions and track rules.
- Return, pain, rebuilding, deload and setup restrictions take precedence.
  An unearned target is never shortened by this maintenance policy.
- Reduced earned maintenance records no advancement. A new clean full endpoint
  is required before another load/density review. The engine offers that full
  refresh rather than treating repeated light work as new review evidence.

Normal progression prescriptions and the underlying numerical methods are not
rewritten. The engine still needs actual completed work, not a timer, forecast,
setting save or restored plan, to earn a progression step or technical gate.

## Using spare time without mixing histories

A focused workout can include up to two eligible earned maintenance movements
when their current prescriptions fit, with at most four movements after these
additions. Full intervals, transitions, setup allowance and the selected total
ceiling remain in the estimate. Nothing is inserted beyond the budget.

Each maintenance movement has its own identity, load, method and actuals. It does
not count as another program day. A completed primary day advances independently
of an unfinished maintenance movement. Written maintenance debt stays with its
source program; a skipped addition is not silently completed or discarded.
Corrections and undo replay those same ownership rules. Unadmitted choices create
no written debt. Ordinary automatic additions from queued programs wait, while
explicit Major priorities, prerequisite support and existing pending work retain
their existing protection.

Dates and stable record keys are preserved. New optional plan metadata records
ownership; existing V33 data, storage keys and older plans remain supported.

## Capacity is an estimate, not a physiological frequency

The budget uses observed/configured attendance, formal program-day counts and the
existing configurable return interval. Packing estimates consider current earned
work. Actual movement gaps and review needs decide which maintenance target gets
an opportunity. These are app scheduling decisions, not a universal statement that
all movements need the same frequency or that one maintenance set preserves peak
performance indefinitely.

Thirty minutes cannot guarantee simultaneous development of every selected
pattern. The engine keeps foundations and safe targets, focuses attainable work,
and queues the remainder. Increasing time can reopen the queue without awarding
progress on the settings save. Forecasts never graduate a lane or invent future
physical completion.

## Verification and remaining boundaries

`tests/curriculum-strategy.js` checks actual-cycle graduation, separate pending
ownership, full review after light maintenance, profile independence, corrections,
backup rejection, future isolation and changing-capacity histories.
`tests/browser-curriculum-strategy.cjs` exercises the real settings, offline draft,
partial save and history-correction flows on touch viewports.

For reproducible controlled comparisons, export the exact baseline engine and run:

```sh
git show b1077917138393f45287ee29ea55a3168e74dc97:engine.js > /tmp/strength-baseline.js
node scripts/compare-curriculum.cjs /tmp/strength-baseline.js
```

The checked-in results separate returns during unfinished development from returns
to already-earned work. Queueing can delay introductory exposure to later programs.
Synthetic tests cannot verify physical technique, strength retention or Android
hardware acceptance. Source-specific maintenance frequencies, larger curriculum
coverage, the remaining instructional gaps, strict legacy duration fitting and
the rest of the release-gate audit remain open. Do not promote to production on
the basis of this strategy alone.
