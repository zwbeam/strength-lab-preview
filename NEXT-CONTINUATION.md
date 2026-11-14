# Continue Strength Lab integration

Use zwbeam/strength-lab-preview branch preview. Read README.md,
DEVELOPMENT-STATUS.md, TRAINING-RULES.md, MOVEMENT-INTEGRATION-COVERAGE.md, and the latest entries in
research/development-batches.md. Preserve production, existing V33 keys/history,
writer locks, draft transactions, backups, correction replay and archive branches.

The first lifelong-integration checkpoint is d8a2d96 (all remote checks passed).
Subsequent work promotes crawls, adds ABC support selection, connects paired
kettlebell preparation, clarifies complex sequences and repairs light-day evidence
retention. Inspect the actual latest GitHub commit and checks before continuing.
Do not assume a later checkpoint passed just because this file exists.

Run all non-browser tests/*.js, the history-corrections.test.cjs suite, and the
eleven browser suites: browser-smoke.js, browser-curriculum.cjs,
browser-integration.cjs, browser-continuity.cjs, browser-foundations.cjs,
browser-step-ups.cjs, browser-double-hinge.cjs, browser-hand-changes.cjs
browser-single-arm-swing.cjs, browser-dated-evidence.cjs and browser-demo-history.js (generate its synthetic backup
first). Serve at 127.0.0.1:8765. Installed Chromium may be selected locally with
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium. Actions uses its own bundle.
Run scripts/audit-curriculum.cjs and scripts/audit-integration.cjs; generated
reports must remain reproducible. All source quotes/hashes must resolve to actual
archive text; #441 is unusable. No invented source prescriptions or timestamps.

Movement-level continuity now includes bounded return follow-ups, impending
return-window priority and per-movement feedback. It reduces avoidable re-entry
without changing qualification. Further evaluate oversized mixed schedules;
alternating double-club inside/outside skill practice now has a separate opt-in
automatic block. Next priorities are fuller supported numerical cycles and
foundational bodyweight pathways; pulling, sliding planks and unloaded stepping now have real generator routes. Full #85/#88 timing-series context is not
implemented. Paired deadlift/swing foundations from #142 now have a real opt-in path.
Hand-to-hand swing from #185 is now tracked. Outside swing and soft-style endurance remain missing from the broader #186
teaching sequence. Do not claim complete lifetime curriculum coverage.

Physical Android review is separate from browser emulation. Keep eight Books
separate from the Movement Library; no further major interface redesign without
user review. Work in tested commits on preview; no production promotion.

First-use correction: Advanced Movement Programming has a per-movement owned
starting-load selector. Keep setInitialLoad's established-load guard; later
changes use progression/replacement review. Browser fixtures must test this from
an unset load and preserve saved data across reload, rather than silently
reseed preconfigured weights. See tests/initial-load.js and browser-integration.


Sources #86/#94 now have supported and knee-hover sliding-plank programming and
mobile acceptance in browser-foundations.cjs. Source #89 bent-knee rows now have secured-bar availability, recorded geometry,
actual-result credit gates, historical correction and offline browser tests.
Source #97 alternating/static-foot step-ups now require stable platform confirmation
and recorded height. Pattern-specific skills and bilateral actuals are independent;
no automatic height/load progression or mandatory ordering between variants is inferred.
Next: further source-reviewed foundational coverage and coherent mixed schedules;
broader row variants, full source 60/80 examples, loaded stepping and broader
paired-kettlebell systems remain separate work.
The doubleHinge block preserves explicit experience/technique checks, owned matched
loads and recent paired-deadlift/single-swing evidence. Its app defaults do not
convert #142 years, 60% load discussion or 6-to-20 reps into universal targets.
Do not retrofit new gates into existing double-clean/press/squat histories without
a tested compatibility strategy.
Do not treat bodyweight as meaning equipment-free for those movements.

Program-continuity checkpoint: keep coordinated load setup separate from owed
physical work. Preserve real partial-work priority and the bounded follow-up rule.
Multi-level maintenance follows only registry-gated descendants with actual clean
evidence; it transfers recency, never exposures/load/mastery. Missing skills,
ancestor corrections, pain, failure, policy/load changes and gaps still block.
Reproduce with tests/composition-setup.js, tests/prerequisite-maintenance.js and
the extended touch tests/browser-continuity.cjs.

Hand-to-hand swing practice is integrated end to end with explicit skill and
recent two-hand practice gates, single-bell inventory, per-hand actual counts,
independent progression and correction replay. Count each swing for its driving
hand: five per hand means ten total. No #185 numeric program, breathing cadence
or automatic admission to paired work is inferred. Read research/hand-change-evidence.json.
Next: use the source inventory to prioritize complete foundational/intermediate
systems and release reliability over obscure variants. Outside swings require
advanced-context/visual review; fuller source numerical cycles remain separate work.

Timer regression: preserve explicit interval Start -> running countdown. Earlier
tests masked a paused-start bug by immediately pressing Resume. Keep reload
deliberately stopped and verify the rendered readout/instruction interaction in
tests/browser-hand-changes.cjs plus tests/interval-start.js.


Introductory single-arm swing is now integrated separately from alternating hand
changes. Read research/single-arm-swing-evidence.json: #67 supplies thumb-back
introduction, #446 distinguishes power from soft-style endurance. Do not infer
soft-style/overhead/thumb-up or paired readiness from these records. Preserve
independent skill, load, actual side counts and cycles. The new browser suite
supports STRENGTH_LAB_TEST_URL for actual DEV HTTPS acceptance. Timer browser
fixtures pause their simulated clock before interaction to avoid elapsed-real-time
races; explicit Start still must run, and reload still stays stopped.


Dated-evidence checkpoint: preserve the new opts.now/evidenceThrough boundary.
Planning must not read later physical evidence; forecasts freeze evidence at the
forecast start date while scheduling later opportunities. Unscoped records/state
remain full-history audit views; current UI and load/cycle actions pass today.
Known unresolved pain remains held across all dates. Future load anchors remain
stored and cannot apply early; genuinely missing anchors still fail closed.
Do not delete future records or silently rewrite dates. The existing correction
UI explains their retention, and date correction/undo uses original actuals.
Keep legitimate explicit/legacy pending work and provisional ordering placeholders.
Reproduce tests/dated-evidence.js (432 workouts and ten dated snapshots) and the
new mobile/HTTPS suite; the old five-year future test now checks exact targets.
Current equipment, skill confirmation and configuration are not historical
snapshots. No source-dose change or new movement coverage count is claimed.

Learn status also uses dated records: future-only practice cannot label a movement
Currently practicing. Explicit Learned self-confirmation remains a separate user
choice. Preserve this distinction and the rc43 worker/query update when refining
eligibility or rendering history. No stored records are removed by the date scope.
