/* Time-budget feasibility regression: verify full-cycle endpoint is not silently claimed reachable. */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
const budget30=E.timeBudget(30);
assert.equal(budget30.main,12);
const snatch=E.policyFor('snatch',{});
assert.equal(snatch.stages.at(-1).sets,20);
const endpoint={id:'snatch',sets:20,roundSeconds:60,rest:0};
const endpointMinutes=E.minutesFor(endpoint);
assert.ok(endpointMinutes>budget30.main);
const budget45=E.timeBudget(45);
assert.ok(endpointMinutes<=budget45.main);
const getup=E.policyFor('getup',{});
assert.equal(getup.stages.at(-1).reps,600);
const singleClub=E.policyFor('clubInside',{programming:{clubInside:{profile:'singleClub'}}});
assert.equal(singleClub.stages.at(-1).sets,20);
console.log('TIME-BUDGET FINDING: 30-minute session provides',budget30.main,'main minutes; snatch endpoint requires',endpointMinutes.toFixed(2),'minutes; cannot fit.');
console.log('TIME-BUDGET FINDING: 45-minute session provides',budget45.main,'main minutes; snatch endpoint fits alone.');
console.log('TIME-BUDGET FINDING: club and get-up endpoints need movement-specific feasibility checks, not just workout-fit assertions.');

const state={version:33,programBlock:'snatch',defaultMinutes:30,sessions:[],weights:{snatch:12},equipment:{kb:[12,16],club:[],pairs:[]},skills:{swing:true,clean:true,overhead:true,rack:true},trainingPreferences:{useKb:true,conditioning:true}};
const first=E.plan(state,{now:'2026-11-11',minutes:30});
assert.ok(Array.isArray(first.timeBlocked),'planner must expose time constraints');
assert.ok(first.timeBlocked.every(x=>x.minimumTotalMinutes>=x.requiredMainMinutes+18));
assert.ok(first.timeBlocked.every(x=>x.cannotFitAlone===true||x.minimumTotalMinutes<=30),'distinguish hard time barriers from optional pairing');
console.log('PASS planner time-blocked metadata');
// Verify deferred work is actually considered before normal day movements.
const deferredState={...state,programBlock:'abc',defaultMinutes:45,weights:{squat:12,press:12,row:12,deadlift:12},equipment:{kb:[12,16],club:[10],pairs:[]},deferredIds:['row'],trainingPreferences:{useKb:true,useClub:false,useBodyweight:false,skillSessions:false}};
const deferredPlan=E.plan(deferredState,{now:'2026-11-11',minutes:45});
assert.ok(deferredPlan.items.length>0,'deferred test must schedule a workout');
assert.equal(deferredPlan.items[0].id,'row','eligible deferred movement must receive first scheduling opportunity');
console.log('PASS deferred priority scheduling');
console.log('PASS time-budget diagnostic (documents existing limitation, not a scheduling fix)');
