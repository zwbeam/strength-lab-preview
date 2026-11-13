/* All incomplete lessons must be flagged in Learn. Run: node tests/instruction-coverage-regression.js */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const data=require('../movement-instruction.js');
const partial=Object.entries(data.entries).filter(([,entry])=>entry.coverage!=='reviewed outline');
assert.equal(partial.length,14,'review coverage count changed; review notice and audit');
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
// These two prescribed movements are not source-verified. Keep the engine
// catalog and Learn warnings in sync until a deliberate exercise review.
const engine=require('../engine.js');
for(const id of ['carry','front']) {
  assert.ok(Object.hasOwn(engine.MOVES,id),id+': exercise catalog changed; review instructional coverage');
  assert.equal(typeof engine.MOVES[id].name,'string',id+': missing exercise name');
  assert.ok(data.entries[id].coverage!=='reviewed outline',id+': unsourced exercise must not appear fully reviewed');
}
console.log('PASS '+(partial.length+6)+' incomplete-instruction safeguards');

// A newly registered movement must never break Learn before its dedicated
// lesson exists. Missing lessons remain honestly pending rather than fabricated.
const learn=require('../learning.js').create(engine,data);
for(const id of Object.keys(engine.MOVES)){
 const lesson=learn.instruction(id);assert.ok(lesson&&typeof lesson.coverage==='string',id+': missing accessible coverage state');
 for(const field of ['setup','steps','bracing','mistakes','sourceIds','videoSourceIds'])assert.ok(Array.isArray(lesson[field]),id+': malformed '+field);
 if(!Object.hasOwn(data.entries,id)){assert.match(lesson.coverage,/pending/);assert.deepEqual(learn.videos(id),[]);}
}
console.log('PASS: every canonical movement has a renderable reviewed or explicitly pending lesson');
