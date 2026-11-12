/* Static regression for bounded Training Log DOM output.
 * Run: node tests/log-pagination.js
 * This guards wiring; browser interaction remains a separate acceptance test.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const checks={
  'initial page limits':/notebookVisibleRows=60,movementVisibleRows=60/.test(app),
  'notebook rows bounded':/lines\.slice\(0,notebookVisibleRows\)\.map/.test(app),
  'single-pass history aggregation':/const lines=\[\];const practicedIds=new Set\(\);for\(const session of sessions\)/.test(app),
  'movement rows bounded':/records\.slice\(0,movementVisibleRows\)\.map/.test(app),
  'notebook load-more button':/data-more-notebook="1"/.test(app),
  'movement load-more button':/data-more-movement-history="1"/.test(app),
  'notebook load-more handler':/notebookVisibleRows\+=60;render\(\)/.test(app),
  'movement load-more handler':/movementVisibleRows\+=60;openMovementHistory/.test(app),
  'dialog movement identity':/dialog\.dataset\.movementId=id/.test(app),
  'new movement resets page':/if\(dialog\.dataset\.movementId!==id\)movementVisibleRows=60/.test(app),
  'already-open dialog safe refresh':/if\(!dialog\.open\)dialog\.showModal\(\)/.test(app),
  'dialog new movement resets page':/movementVisibleRows=60;openMovementHistory/.test(app),
  'history editing remains available':/data-history-view/.test(app)
};
for(const [name,ok] of Object.entries(checks))assert.ok(ok,'Missing log pagination contract: '+name);
// Guard against silent drift in the actual pagination and session persistence contracts.
const browser=fs.readFileSync(require('node:path').join(__dirname,'browser-smoke.js'),'utf8');
const browserChecks={
  'decade-scale fixture size':/decadeUiData\.count!==2600\|\|decadeUiData\.unique!==2600/.test(browser),
  'pagination verifies actual row count':/if\(rows!==expected\)throw Error/.test(browser),
  'pagination preserves saved session count':/afterPaging\.count!==2600/.test(browser),
  'historical correction survives reload':/if\(persistedOldEdit!==1\)throw Error/.test(browser),
  'repeated reopen preserves unique sessions':/afterReopens\.unique!==2600/.test(browser),
  'new session survives reload':/appendedReload\.count!==2601\|\|appendedReload\.ids!==2601/.test(browser),
  'quota failure refuses write':/quotaFailure\.accepted!==false/.test(browser)
};
for(const [name,ok] of Object.entries(browserChecks))assert.ok(ok,'Missing browser history regression: '+name);
console.log('Training Log pagination wiring checks passed: '+Object.keys(checks).length+'; browser scenario coverage: '+Object.keys(browserChecks).length);
