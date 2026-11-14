# Settings and Train control audit

The user requested that adjustments on Settings and Train work together and affect
the actual application. Shared controls now read one saved snapshot. Forms with
Save buttons commit together; the Train target, both readiness selectors and
interval fields save immediately. A pending, unsaved form is not a new preference.

The earlier temporary Train-duration override is intentionally replaced by a
shared persistent target. Valid imported 25–120-minute targets, including values
outside the preset list, remain selectable and are not rounded away on load.

| Control | Saved source / shared behavior | Actual effect and verification |
|---|---|---|
| Workout target | `defaultMinutes`; Settings Equipment & Time, Train Training Plan and Train adjustments | Same target in budget, preparation, cooldown, whole-prescription fit, calendar and new drafts. Both directions, reload, import and failed-save rollback tested. |
| Training days | `trainingPreferences.daysPerWeek`; Settings and Train schedule | Rolling opportunity frequency and weekly limits; the same strength/four-day validation in both paths. Does not create completed work. |
| Today’s readiness | `todayReadiness.date/value`; Train and Settings | Low readiness reduces the actual generated prescription without ordinary progression credit. Great follows normal progression. Survives same-day reload; expires on a new day, including an open page. |
| Focus / variety / conditioning / skills | One shared style transformer for both forms | Both forms preserve the selected program. Focus affects existing priority/spacing rules; variety and optional conditioning/skill opportunities are A/B/C choices. A source block retains its own numeric method. |
| Training emphasis / mobility only | Same saved priorities and same save handler in Settings and Train dialog | Effective display accounts for included equipment; actual movement filters and mobility-only plan use those choices. Availability and priority remain distinct; excluding equipment retains owned weights and saved priorities. |
| Included equipment / owned loads / ceilings / matched pairs | Settings inventory and inclusion flags | Actual eligibility, configured-load availability, paired gates and load offers. Existing integration suites test single/paired bells/clubs, replacement and starting loads. Equipment edits do not erase history. |
| Row bar / step platform / crawl space | Settings station/space fields | Actual generation gates and fixed-geometry comparison. Existing row, row-wave, step-up and crawl suites cover changed/missing setup, progression, correction and offline drafts. |
| Pause / resume | Same pause controls in Settings and Train schedule | Actual opportunities pause or resume with the unfinished queue retained. Manual and dated/duration pauses remain distinct; no catch-up credit. |
| Familiar skills / initial load / profile / baseline | Settings Movement Programming and baseline controls | Actual prerequisites, prescriptions and separate comparison identities. Push-up baseline mirrors advanced programming; existing movement suites cover source profiles, first-use loads and full cycles. |
| Recovery, re-entry, rest/rep/set and exposure settings | Existing per-movement and shared defaults | Actual policies and reduced prescriptions; the new audit changes recovery fraction and observes the generated dose. Source-specific bounds remain enforced. |
| Coordinated blocks / continuity / spacing | Existing saved composition/default fields | Actual selection, independent queues, recovery limits and bounded follow-up priority; covered by composition/continuity and multi-year suites. |
| Workout pacing | `timerMode`; Settings and Train before a workout | New drafts snapshot this mode. The existing prescribed controller now has reachable Train controls for preparation/work/rest. Active drafts retain their saved mode and immutable targets; the next-workout scope is explicit. |
| Custom interval Prepare / Work / Rest / Sets | `intervalPreferences`, shared by Settings and active Train timer | Actual countdown sequence uses these fields. Values persist in JSON backups; old standalone timer settings remain readable. Editing stops/resets custom playback. Starting either timer pauses the other. Timers never check sets or grant credit. |
| Activities and manual calendar moves | Existing activity/move records on Train | Actual recovery/opportunity shifts, with no fictional strength volume. Existing browser smoke and recovery suites cover replacement, pauses, repeated reloads and activity edits. |
| Export / restore / app update / reset | Existing data controls | Full browser regression covers valid/malformed imports, correction, quota rollback, offline assets and deliberate reset. Restore now immediately rehydrates shared display values rather than retaining stale local aliases. |

An active workout keeps the prescription, actuals, original plan and pacing saved
at its start. Controls that would replace its target, readiness, inventory or
program remain guarded until it is finished/discarded. Changing custom intervals
or the next-workout pacing preference cannot rewrite that work.

Read-only tabs show saved changes but cannot write them. The writer lock,
stale-value guards and paired journal remain intact. No storage-key migration,
source-dose rewrite, production deployment or main merge is part of this audit.

Reproduce with `tests/training-settings.js`, `tests/browser-settings-sync.cjs` and
all existing Node/browser suites. The new browser suite exercises both directions
at 320/390, real plan outputs, pacing and interval countdowns, failed writes,
active-draft preservation, offline reload, JSON restore and reader handoff.
