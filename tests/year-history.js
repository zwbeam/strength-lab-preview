/* 12-month longitudinal training-history stress test.
 * Run: node tests/year-history.js
 * Synthetic data only; validates replay stability, not training outcomes.
 */
'use strict';
const assert = require('node:assert/strict');
const E = require('../engine.js');
const start = Date.UTC(2025,0,1), DAY=86400000;
const dateAt = n => new Date(start+n*DAY).toISOString().slice(0,10);
const ids = ['swing','squat','press','row','clean'];
const base = { sessions: [], weights: Object.fromEntries(ids.map(id=>[id,16])), nextWeights:{}, skills:{}, programming:Object.fromEntries(ids.map(id=>[id,{exposures:2}])) };
let clean=0, missed=0, difficult=0, recovery=0;
for(let day=0;day<365;day++){
  // Variable training cadence: 2-4 days/week, plus deliberate weeks off.
  const week=Math.floor(day/7), dow=day%7;
  if(week%13===12 || !([0,2,4,6].includes(dow) && !(week%4===0 && dow===6))) continue;
  const id=ids[(week+dow)%ids.length];
  const p=E.policyFor(id,base), st=E.stateFor(base,id), target={sets:st.sets,reps:st.reps,rest:st.rest};
  const isMissed=day%37===0, isHard=day%23===0&&!isMissed, isRecovery=day%19===0&&!isMissed&&!isHard;
  const mode=isRecovery?'recovery':'volume';
  const good=!isMissed&&!isHard&&!isRecovery;
  const item={id,weight:st.weight,bodyweight:false,quality:isHard?'hard':'clean',pain:false,
    completed:good,performed:!isMissed,mode,actualSets:isMissed?0:isHard?Math.max(0,target.sets-1):target.sets,
    actualReps:target.reps,targetSets:target.sets,targetReps:target.reps,rest:target.rest,
    policyKey:p.key,track:'base'};
  base.sessions.push({id:'synthetic-'+day,date:dateAt(day),items:[item]});
  if(good)clean++;else if(isMissed)missed++;else if(isHard)difficult++;else recovery++;
  const after=E.stateFor(base,id);
  assert.ok(Number.isFinite(after.sets)&&Number.isFinite(after.reps),id+': invalid prescription on '+dateAt(day));
  assert.ok(after.stage>=0&&after.stage<p.stages.length,id+': stage out of bounds');
  if(!good) assert.ok(after.stage<=st.stage,id+': unqualified workout advanced the stage');
  const repeat=E.stateFor(base,id);
  assert.deepEqual({stage:repeat.stage,weight:repeat.weight,streak:repeat.streak},{stage:after.stage,weight:after.weight,streak:after.streak},'Non-deterministic replay');
}
assert.ok(base.sessions.length>100,'Insufficient simulated training history');
for(const id of ids){
 const st=E.stateFor(base,id);
 assert.ok(st.exposures>0,id+': no exposure');
 assert.ok(st.weight===16,id+': unexplained load increase');
}
console.log(JSON.stringify({simulatedDays:365,sessions:base.sessions.length,clean,missed,difficult,recovery,movements:ids.length}));
