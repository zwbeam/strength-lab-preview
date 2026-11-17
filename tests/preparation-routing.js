'use strict';
// Regression: active Train/draft preparation panels must route to the
// source-linked, pattern-aware warmup and cooldown functions.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const between=(a,b)=>{const start=app.indexOf(a);const end=app.indexOf(b,start);assert.ok(start>=0&&end>start,'Missing preparation code anchors');return app.slice(start,end);};
const active=between('function preparation(plan,kind){','function prepSection(plan,kind,');
assert.match(active,/kind==='warmup'\?warmup\(plan\):cooldown\(plan\)/);
assert.match(between('function prepSection(plan,kind,','function compactPrescription('),/preparation\(plan,kind\)/);
const warm=between('function warmup(plan){','function cooldown(plan){');
const cool=between('function cooldown(plan){','function emptyPlanMessage(');
assert.match(warm,/data-open-source="550"/);
assert.match(warm,/const hinge=/);
assert.match(cool,/data-open-source="130"/);
assert.match(cool,/plan\.budget\?\.cooldown/);
console.log('Active preparation routing checks passed');
