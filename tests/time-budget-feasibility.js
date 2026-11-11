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
assert.equal(first.budget.total,30);
assert.equal(first.budget.flexMax,40);
assert.equal(first.cap,22);
assert.ok(first.total<=40,'flexible session must never exceed 40 minutes');
assert.ok(Array.isArray(first.timeBlocked),'planner must expose time constraints');
assert.ok(first.timeBlocked.every(x=>x.minimumTotalMinutes>=x.requiredMainMinutes+18));
assert.ok(first.timeBlocked.every(x=>x.cannotFitAlone===true||x.minimumTotalMinutes<=40),'distinguish hard time barriers from optional pairing');
console.log('PASS planner time-blocked metadata');
// Verify deferred work is actually considered before normal day movements.
const deferredState={...state,programBlock:'abc',defaultMinutes:45,weights:{squat:12,press:12,row:12,deadlift:12},equipment:{kb:[12,16],club:[10],pairs:[]},deferredIds:['row'],trainingPreferences:{useKb:true,useClub:false,useBodyweight:false,skillSessions:false}};
const deferredPlan=E.plan(deferredState,{now:'2026-11-11',minutes:45});
assert.ok(deferredPlan.items.length>0,'deferred test must schedule a workout');
assert.equal(deferredPlan.items[0].id,'row','eligible deferred movement must receive first scheduling opportunity');
console.log('PASS deferred priority scheduling');
console.log('PASS time-budget diagnostic (documents existing limitation, not a scheduling fix)');

 // Fairness regression: four completed exposures to a competing movement
 // make a skipped eligible movement overdue, without using mobility days.
const fairnessSessions=Array.from({length:4},(_,i)=>({
 id:'fair-'+i,date:'2026-10-'+String(10+i*2).padStart(2,'0'),block:'abc',
 items:[{id:'squat',performed:true,actualSets:1,actualReps:5,targetSets:1,targetReps:5,quality:'clean',mode:'volume'}]
}));
const fairState={...deferredState,deferredIds:[],sessions:fairnessSessions,trainingPreferences:{...deferredState.trainingPreferences,daysPerWeek:7},trainingDefaults:{minGapDays:0,maxTrainingDays:7}};
const fairPlan=E.plan(fairState,{now:'2026-11-11',minutes:45});
assert.ok(fairPlan.items.length>0,'fairness fixture must have a schedulable movement');
assert.notEqual(fairPlan.items[0].id,'squat','four consecutive squat exposures must not indefinitely outrank other eligible lifts');
console.log('PASS movement fairness after four completed strength exposures');

 // Mobility days are not strength exposures. Adding them must not alter
 // movement ordering, progression stages, or the selected prescription.
const mobilityOnly={...fairState,activities:Array.from({length:7},(_,i)=>({
 id:'move-'+i,type:'mobility',date:'2026-10-'+String(20+i).padStart(2,'0'),
 duration:20,effort:'easy',status:'completed',replacesStrength:true
}))};
const fairAfterMobility=E.plan(mobilityOnly,{now:'2026-11-11',minutes:45});
assert.deepEqual(fairAfterMobility.items.map(x=>({id:x.id,sets:x.sets,reps:x.reps,mode:x.mode})),
 fairPlan.items.map(x=>({id:x.id,sets:x.sets,reps:x.reps,mode:x.mode})),
 'mobility days must not alter lifting priority or earn progression');
console.log('PASS mobility activity does not advance fairness exposure count');
