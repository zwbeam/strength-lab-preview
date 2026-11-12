# Strength Lab — Primary App

This repository's `preview` branch contains the rebuilt Strength Lab app. The retired interface was removed from the working branch after an archive was created.

## Recovery checkpoint

The GitHub branch `archive/rebuilt-preview-qa-2026-11` preserves the earlier source tree, including the retired legacy interface. Do not delete that branch during the primary-version migration.

## Data safety

Strength Lab stores training data in the browser's local storage. GitHub branches and repository backups **do not** contain a user's workout history.

Before changing deployment origin, domain, browser profile, or device:

1. Open the currently used Strength Lab installation and export its JSON backup.
2. Save that backup somewhere outside the browser.
3. Open the new installation and import the backup.
4. Confirm workout history, equipment settings, progression, and unfinished-workout behavior before retiring the old URL.

Local storage is scoped to an origin; deploying the same code to a different domain does not automatically transfer stored history. Keep the storage keys `sl-dev-preview-data-v33`, `sl-dev-preview-draft-v33`, and `sl-dev-preview-transaction-v33` stable unless a tested migration is provided.

## Verification

Run **Research coverage audit** from GitHub Actions on the `preview` branch. Both the `audit` and `browser-smoke` jobs must finish successfully for the **current commit** before promotion. Earlier passing runs do not verify later commits.

The audit executes the Node regression suites, verifies the offline cache and packaged review build, and uploads a review artifact. The browser job tests the interface at multiple viewport sizes, including long-history and backup/reload scenarios.

## Release boundary

Commits to `preview` do not constitute a verified Cloudflare production deployment. Keep production unchanged until the current commit passes QA, a user data backup is secured, and the new build is intentionally deployed and checked.
