# Development batches — November 13, 2026

## Batch 1: repair current Actions failures

Incoming preview checkpoint: c69f54a. Kept the original strength-lab checkout and
its interrupted uncommitted files untouched; cloned the requested preview branch
separately. Read README, current source/engine audits, workflows, engine/library,
regressions, and all attached handoff/accounting metadata before editing.

Reproduced both reported failures locally. Learn keyboard activation failed
because rendering dereferenced coverage for three engine complexes without
instruction entries. Canonical movements now remain renderable with an explicitly
pending, unsourced fallback; no invented lesson/video or technical eligibility is
introduced. Existing 31 dedicated instruction entries retain their status.

The history static contract predated date filtering. Updated it and executed the
real table renderer to verify 60/120 row bounds, filter-before-pagination,
inclusive/empty date ranges, read-only behavior and expanded-state preservation.
Added real browser date-range assertions. New history fixtures explicitly open
the intentionally collapsed disclosure, while pagination preserves that open
state across rerenders. Kept decade-scale append/correction/rollback checks.

Local verification: all 30 Node .js regression suites, history-corrections.test.cjs,
295-session demo generation and populated browser replay, plus full browser-smoke
at 320/390/832/1280 widths passed. Includes 3,840 workouts across three decade
lifecycles, 2,600/2,601-session persistence, quota failures and backups. Inspected
the rendered 320px Training Log screenshot. Local browsers use installed Chromium
via an optional executable override; Actions retains its normal bundled browser.

Cache/query revision rc26-ci-repair-20261113. GitHub Actions must verify this new
commit independently; local passes are not reported as remote CI success. No
production promotion, storage-key change, user-data reset or archive deletion.
