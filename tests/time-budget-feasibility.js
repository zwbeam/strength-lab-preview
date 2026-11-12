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
assert.equal(first.budget.flexMax,40,'30-minute Settings and daily adjustments share the same window');
assert.equal(first.cap,22);
const flexible=E.plan({...state,defaultMinutes:45},{now:'2026-11-11',minutes:30});
assert.equal(flexible.budget.flexMax,40,'30-minute adjustment under a 45-minute maximum retains milestone flexibility');
assert.equal(flexible.cap,22);
assert.ok(first.total<=40,'30-minute target must stay within its 40-minute upper limit');
assert.ok(flexible.total<=40,'flexible session must never exceed 40 minutes');
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

 // Changing today's time allocation must not discard or silently complete a
 // movement explicitly waiting in the deferred queue.
const deferredShort=E.plan(deferredState,{now:'2026-11-11',minutes:30,readiness:'low'});
const deferredLong=E.plan(deferredState,{now:'2026-11-11',minutes:60,readiness:'normal'});
for(const [label,p] of [['short/low',deferredShort],['long/normal',deferredLong]]){
 const accountedFor=[...p.items.map(x=>x.id),...p.timeBlocked.map(x=>x.id),
  ...p.held.map(x=>x.id),...p.prerequisite.map(x=>x.id),
  ...p.unavailable.map(x=>x.id),...p.requirements.map(x=>x.id)];
 assert.ok(accountedFor.includes('row'),label+' must account for explicitly deferred row');
}
assert.deepEqual(deferredState.deferredIds,['row'],'planning must not mutate deferred queue');
assert.equal(deferredState.sessions.length,0,'changing time/readiness must not manufacture completion');
const restoredDeferred=E.plan(deferredState,{now:'2026-11-11',minutes:45,readiness:'normal'});
assert.equal(restoredDeferred.items[0].id,'row','restoring normal session must restore deferred movement priority');
console.log('PASS deferred strength priority survives shorter sessions and readiness changes');

 // A partly performed strength session and a merely time-blocked movement
 // are different histories. An actual exposure must remain recorded while
 // the unfinished movement stays pending for its next eligible opportunity.
const partialSession={id:'partial-strength',date:'2026-11-10',block:'abc',calendarVersion:1,
 items:[
  {id:'squat',performed:true,actualSets:2,actualReps:6,targetSets:3,targetReps:6,quality:'clean',mode:'volume'},
  {id:'row',performed:false,actualSets:0,actualReps:0,targetSets:3,targetReps:6,quality:'clean',mode:'volume'}
 ]};
const partialState={...deferredState,sessions:[partialSession],deferredIds:['row']};
const partialNext=E.plan(partialState,{now:'2026-11-11',minutes:45,readiness:'normal'});
assert.equal(partialState.sessions[0].items[0].actualSets,2,'partially completed sets must remain recorded');
assert.equal(partialState.sessions[0].items[1].actualSets,0,'unstarted movement must remain uncredited');
assert.ok(partialNext.day.name.includes('remaining work'),'partial-session follow-up must be identified as remaining work');
assert.ok(partialNext.items.some(x=>x.id==='row')||partialNext.timeBlocked.some(x=>x.id==='row')||
 partialNext.held.some(x=>x.id==='row')||partialNext.prerequisite.some(x=>x.id==='row'),
 'unstarted movement must remain accounted for');
assert.ok(!partialNext.items.some(x=>x.id==='squat'),'already performed movement must not be prescribed again as remaining work');
console.log('PASS partial strength history differs from entirely time-blocked movement');

 // A shortened, low-readiness follow-up may defer the remaining movement
 // again, but it must not turn the already completed sets into another task.
const partialShort=E.plan(partialState,{now:'2026-11-11',minutes:30,readiness:'low'});
const remainingShort=[...partialShort.items,...partialShort.timeBlocked,...partialShort.held,
 ...partialShort.prerequisite,...partialShort.unavailable,...partialShort.requirements].map(x=>x.id);
assert.ok(remainingShort.includes('row'),'short low-readiness follow-up must retain unfinished row');
assert.ok(!partialShort.items.some(x=>x.id==='squat'),'short follow-up must not repeat completed squat');
assert.equal(partialState.sessions[0].items[0].actualSets,2,'short-day replanning cannot alter recorded completed sets');
assert.equal(partialState.sessions[0].items[1].actualSets,0,'short-day replanning cannot credit unstarted row');
const partialRestored=E.plan(partialState,{now:'2026-11-11',minutes:45,readiness:'normal'});
assert.deepEqual(partialRestored.items.map(x=>x.id),partialNext.items.map(x=>x.id),
 'restoring normal time/readiness must restore the same remaining-work prescription');
console.log('PASS partial-session continuation survives short-day and low-readiness replanning');

 // Several consecutive short/low-readiness planning days must not consume
 // unfinished work. Planning is pure: without a recorded completed session,
 // neither the deferred queue nor the already performed sets may drift.
const partialSnapshot=JSON.stringify(partialState);
for(const day of ['2026-11-11','2026-11-12','2026-11-13','2026-11-14','2026-11-15']){
 const p=E.plan(partialState,{now:day,minutes:30,readiness:'low'});
 const accounted=[...p.items,...p.timeBlocked,...p.held,...p.prerequisite,
  ...p.unavailable,...p.requirements].map(x=>x.id);
 assert.ok(accounted.includes('row'),'unfinished row disappeared on '+day);
 assert.ok(!p.items.some(x=>x.id==='squat'),'completed squat repeated on '+day);
 assert.ok(p.total<=40,'short-day ceiling exceeded on '+day);
 assert.equal(JSON.stringify(partialState),partialSnapshot,'planning mutated partial history on '+day);
}
const recoveredAfterShortWeek=E.plan(partialState,{now:'2026-11-16',minutes:45,readiness:'normal'});
assert.ok(recoveredAfterShortWeek.items.some(x=>x.id==='row')||
 recoveredAfterShortWeek.timeBlocked.some(x=>x.id==='row')||
 recoveredAfterShortWeek.held.some(x=>x.id==='row')||
 recoveredAfterShortWeek.prerequisite.some(x=>x.id==='row'),
 'remaining work must survive five consecutive short days');
assert.ok(!recoveredAfterShortWeek.items.some(x=>x.id==='squat'),
 'completed movement must not reappear in remaining-work follow-up');
console.log('PASS five short low-readiness days preserve partial strength history');

 // Recovery should never turn a five-day streak of planning-only checks into
 // completed sessions. The exact same history must still drive the next plan.
const recoveredAgain=E.plan(partialState,{now:'2026-11-16',minutes:45,readiness:'normal'});
assert.deepEqual(recoveredAgain.items.map(x=>x.id),recoveredAfterShortWeek.items.map(x=>x.id),
 'repeated planning on recovery day must be deterministic');
assert.equal(partialState.sessions.length,1,'planning-only days must not add strength sessions');
assert.equal(partialState.sessions[0].items[0].actualSets,2,'completed sets must remain unchanged');
assert.equal(partialState.sessions[0].items[1].actualSets,0,'unstarted movement must remain uncredited');
assert.deepEqual(partialState.deferredIds,['row'],'five planning-only days must preserve deferred queue');
console.log('PASS deterministic return after five short days with no false progression');





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

 // Fairness priority uses chronological past exposures. Full prescription replay
 // is a separate concern: do not claim this test validates historical replay.
const futureRecord={id:'future',date:'2026-12-12',block:'abc',items:[{id:'row',performed:true,actualSets:1,actualReps:5,quality:'clean',mode:'volume'}]};
const historical=E.plan(fairState,{now:'2026-11-11',minutes:45});
const imported=E.plan({...fairState,sessions:[futureRecord,...fairState.sessions.slice().reverse()]},{now:'2026-11-11',minutes:45});
assert.equal(imported.items[0]?.id,historical.items[0]?.id,
 'future or unsorted strength records must not change first-movement fairness priority');
console.log('PASS chronological fairness priority with future and unsorted records');

 // Imported future-dated records must not rotate optional accessories early.
 // Use a fresh ABC profile with high variety to exercise the one-exposure cadence.
const accessoryBase={...deferredState,deferredIds:[],sessions:[],
 trainingPreferences:{...deferredState.trainingPreferences,skillSessions:true,variety:'high',daysPerWeek:7}};
const accessoryNow=E.plan(accessoryBase,{now:'2026-11-11',minutes:45});
const futureAccessory={...accessoryBase,sessions:[{
 id:'future-accessory',date:'2026-12-11',block:'abc',
 items:[{id:'squat',performed:true,actualSets:1,actualReps:5,quality:'clean',mode:'volume'}]
}]};
const accessoryAfterFuture=E.plan(futureAccessory,{now:'2026-11-11',minutes:45});
assert.deepEqual(accessoryAfterFuture.items.map(x=>x.id),accessoryNow.items.map(x=>x.id),
 'future-dated workout must not advance optional accessory rotation');
console.log('PASS future sessions do not rotate accessories');

 // An imported future unfinished workout must not suppress today's ordinary
 // ABC movements, even if deferred work exists.
const unfinishedFuture={id:'unfinished-future',date:'2026-12-11',block:'abc',calendarVersion:1,
 items:[{id:'row',performed:true,actualSets:1,actualReps:5},
        {id:'press',performed:false,actualSets:0,actualReps:0}]};
const withFutureContinuation={...deferredState,sessions:[unfinishedFuture]};
const beforeFuture=E.plan(deferredState,{now:'2026-11-11',minutes:45});
const afterFuture=E.plan(withFutureContinuation,{now:'2026-11-11',minutes:45});
assert.deepEqual(afterFuture.items.map(x=>x.id),beforeFuture.items.map(x=>x.id),
 'future unfinished block must not replace current-day candidate list');
console.log('PASS future unfinished session cannot hijack current workout');

for(const [target,upper] of [[30,40],[45,50],[60,65],[75,80],[90,95],[120,120]]){
 const p=E.plan({...deferredState,defaultMinutes:target},{now:'2026-11-11',minutes:target});
 assert.equal(p.budget.flexMax,upper,'target '+target+' should use its own bounded window');
 assert.ok(p.total<=upper,'target '+target+' exceeded its window');
}
console.log('PASS Settings and daily duration target windows');

const Calendar=require('../rolling-calendar.js');
// Mobility replaces the opportunity, never the strength progression record.
const mobilityBase={...deferredState,sessions:[],activities:[],trainingPreferences:{...deferredState.trainingPreferences,daysPerWeek:3}};
const originalKey=Calendar.key(mobilityBase);
const originalPlan=E.plan(mobilityBase,{now:'2026-11-12',minutes:45});
const mobilityRecord={id:'mobility-replacement',date:'2026-11-11',type:'mobility',duration:20,effort:'easy',status:'completed',replacesStrength:true,
 notes:'Mobility instead of strength; no lifting credit'};
const afterMobility=Calendar.activity(mobilityBase,mobilityRecord);
assert.equal(afterMobility.sessions.length,0,'mobility must not manufacture a strength session');
assert.equal(Calendar.count(afterMobility),0,'mobility must not advance the strength exposure count');
assert.equal(Calendar.key(afterMobility),originalKey,'mobility must preserve the next strength slot');
assert.deepEqual(E.plan(afterMobility,{now:'2026-11-12',minutes:45}).items.map(x=>x.id),originalPlan.items.map(x=>x.id),
 'the next strength prescription must survive a mobility substitution');
const projected=Calendar.project(afterMobility,'2026-11-11','2026-11-25',{minutes:45});
assert.ok(projected.length,'strength must remain schedulable after mobility');
assert.ok(projected.every(x=>x.date!=='2026-11-11'),'replacement mobility must block duplicate same-day strength');
console.log('PASS mobility substitution preserves queued strength and avoids duplicate same-day training');
