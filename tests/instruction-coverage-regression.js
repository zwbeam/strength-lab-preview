/* All incomplete lessons must be flagged in Learn. Run: node tests/instruction-coverage-regression.js */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const data=require('../movement-instruction.js');
const partial=Object.entries(data.entries).filter(([,entry])=>entry.coverage!=='reviewed outline');
assert.equal(partial.length,7,'review coverage count changed; review notice and audit');
assert.ok(app.includes("entry.coverage!=='reviewed outline'"),'Learn must flag every incomplete lesson, not only missing sources');
assert.ok(app.includes('This page is not a complete technique lesson'),'Learn must explain limitations');
assert.ok(app.includes('Instruction incomplete · ${esc(entry.coverage)}'),'Learn finder and pathway links must reveal incomplete coverage before opening a lesson');
assert.ok(app.includes("Learning.instruction(step.id).coverage!=='reviewed outline'"),'Pathway steps must independently display incomplete lesson status');
assert.ok(app.indexOf('Incomplete lesson:')<app.indexOf('Learning.videos(id).map',app.indexOf('function renderInstruction(')),'incomplete lesson notice must appear before instructional video links');
for(const [id,entry] of partial)assert.ok(typeof entry.coverage==='string'&&entry.coverage.length>0,'missing coverage label '+id);
// Preserve evidence provenance when instructional copy is expanded.
for (const id of ['cast','getup','doublePress','pushup','snatch']) {
  const entry=data.entries[id];
  assert.ok(entry && /partial/i.test(entry.coverage),id+': visually unverified technique must remain flagged');
  assert.ok(entry.sourceIds.length>0 && entry.videoSourceIds.length>0,id+': missing attributed lesson/video');
  assert.ok(entry.evidence.length>0 && entry.evidence.every(e=>entry.sourceIds.includes(e.sourceId)),id+': evidence must match declared sources');
  for(const sourceId of entry.videoSourceIds)assert.ok(Object.hasOwn(data.sources,sourceId),id+': video source missing from catalog '+sourceId);
}
for (const id of ['carry','front']) {
  const entry=data.entries[id];
  assert.ok(entry && /app-authored|unverified|pending/i.test(entry.coverage),id+': unsourced lesson must be disclosed');
  assert.deepEqual(entry.sourceIds,[],id+': do not cite a different exercise as technique evidence');
  assert.deepEqual(entry.videoSourceIds,[],id+': do not link an unrelated exercise as instructional video');
}
console.log('PASS '+(partial.length+6)+' incomplete-instruction safeguards');
