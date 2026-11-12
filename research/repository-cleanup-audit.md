# Repository cleanup audit — pass 1 (2026-11-11)

Scope: `preview` tree and direct inspection of the active entry point, styles, and service worker. **Inventory only; no files deleted.**

## Findings

- The repository retains a `legacy/` application (`index.html`, `app.js`, `styles.css`, `source-index.json`). **Do not delete yet:** the active `sw.js` explicitly precaches these legacy paths.
- Multiple visual generations coexist: `header-*-v16.webp`, `header-*-v23.webp`, `header-workout-v28.webp`, `background-graffiti-v29.webp`, `background-graffiti.png`, and unversioned `art-*.webp` assets. Filename similarity alone does not establish duplication.
- The active `index.html` references `strength-lab-banner.webp`, `styles.css`, and `interface-polish.css`. The service worker lists application scripts, source-index files, 24 transcript bundles, and legacy files. Assets in that manifest may remain runtime-critical even when absent from HTML.
- Transcript bundles `sources-00.json`–`sources-23.json` and source indexes are research assets; preserve them until the 719-source ledger and integration map have been reconciled.
- Cache-version changes must be coordinated with removal of any precached file. Removing a file while leaving it in the install cache list can break offline installation.

## Cleanup gate

1. Scan all references in `index.html`, `app.js`, `styles.css`, `interface-polish.css`, `sw.js`, `manifest.webmanifest`, and tests before labeling an asset unused.
2. Confirm whether the legacy interface is still reachable through navigation, migrations, or offline fallback.
3. Remove only demonstrably unreferenced assets, with an explicit change list and a clean install/offline smoke test.
4. Preserve research evidence and user data compatibility. Do not modify production or Cloudflare.

**Status:** Audit begun; no asset removal authorized by this inventory alone.

## Pass 2 — Active reference tracing

Inspected `index.html`, `app.js`, `styles.css`, `interface-polish.css`, `sw.js`, and `manifest.webmanifest` for representative image generations and the legacy route.

- **Legacy is actively linked:** Settings → About → App Info & Version includes a **Previous training log** link to `legacy/index.html`. The service worker also precaches legacy HTML, JS, CSS, and source index. **Not safe to delete.**
- The service worker precaches all inspected older image candidates, including `header-history-v16.webp`, `header-train-v16.webp`, `background-graffiti.png`, `concept-skull.png`, and `art-hub.webp`. None of those exact names appeared in the inspected active HTML, JS, or CSS. **Potential cleanup candidates, not proven unused**: remaining files, legacy files, and runtime-generated paths have not been exhaustively checked.
- `header-workout-v28.webp` also appears in the service-worker manifest but not the inspected active entry point or styles. Retain pending full cross-file reference and offline-install audit.
- The current cache installation uses `cache.addAll(FILES)`; a missing listed asset can reject the entire cache installation. Remove references and bump the cache identifier in the same change as any deletion.
- A standalone asset removal should also check CSS `url(...)`, JS string references, legacy HTML/CSS/JS, tests, and documentation. The present scan is **not** sufficient evidence to delete files.

**Decision:** Preserve the legacy app and image generations for now; continue tracing before deletion.

## Pass 3 — Cross-generation reference check

Scanned 15 application/runtime files: active and legacy HTML/CSS/JS, engine, learning, movement instruction, notebook, calendar, timer, programming education, and manifest (excluding `sw.js` to distinguish precache-only references).

**Confirmed still in use by legacy CSS:** `header-history-v16.webp`, `header-train-v16.webp`, `header-hub-v16.webp`, `header-settings-v16.webp`, `header-workout-v28.webp`, and `background-graffiti.png`. These are not safe removal candidates while the Previous training log link remains.

**Precache-only within these 15 files:** `concept-skull.png` and `art-hub.webp`. This is not proof of unuse: test scripts, dynamic references, and other non-scanned files remain to be checked. Retain pending full audit.

**Cleanup decision:** Do not delete legacy art based on version suffixes. Preserve the working legacy route and offline precache. The next cleanup pass should enumerate all art assets against all tracked text files, including tests and docs, before proposing deletions.
