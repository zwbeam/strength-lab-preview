/* All incomplete lessons must be flagged in Learn. Run: node tests/instruction-coverage-regression.js */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const data=require('../movement-instruction.js');
const partial=Object.entries(data.entries).filter(([,entry])=>entry.coverage!=='reviewed outline');
assert.equal(partial.length,7,'review coverage count changed; review notice and audit');
assert.ok(app.includes("entry.coverage!=='reviewed outline'"),'Learn must flag every incomplete lesson, not only missing sources');
assert.ok(app.includes('not a complete source-reviewed technique lesson'),'Learn must explain limitations');
for(const [id,entry] of partial)assert.ok(typeof entry.coverage==='string'&&entry.coverage.length>0,'missing coverage label '+id);
console.log('PASS '+(partial.length+3)+' incomplete-instruction safeguards');
