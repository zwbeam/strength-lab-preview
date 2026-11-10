'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const begin=app.indexOf('function updateTimer()'),end=app.indexOf('\nfunction start()',begin);
assert.ok(begin>=0&&end>begin,'updateTimer exists');
const section=app.slice(begin,end);
function run(saved){let draft={clock:{running:true,endAt:50,kind:'rest',remaining:0}},renders=0,refresh=0;const f=new Function('draft','activeTimer','timerRemaining','storageWritable','storageConflict','storageRecoveryIssue','T','saveDraft','$','formatTime','timerBeep','render','lastSignal','timerCue','renderCount',section+';updateTimer();return {draft,renders:renderCount()};');let result=f(draft,()=>draft.clock,()=>0,true,false,false,{tick(d){d.clock={running:false,kind:'complete',remaining:0};return true}},()=>saved,()=>null,()=>'',()=>{},()=>{renders++},'', '',()=>renders);return {draft,renders}}
let failed=run(false);assert.deepEqual(failed.draft.clock,{running:true,endAt:50,kind:'rest',remaining:0},'failed auto transition restores previous clock');assert.equal(failed.renders,0,'failed auto transition does not render unsaved completion');let passed=run(true);assert.equal(passed.draft.clock.kind,'complete','saved transition completes');assert.equal(passed.renders,1,'saved transition renders completion');console.log('PASS 5 automatic timer transition checks');
