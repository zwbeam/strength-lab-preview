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
