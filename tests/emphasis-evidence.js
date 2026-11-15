'use strict';
const assert=require('node:assert/strict'),E=require('../engine'),N=require('../notebook'),C=require('../rolling-calendar');
function fresh(){return {version:33,defaultMinutes:25,programBlock:'abc',sessions:[],weights:{front:5,circles:5,cast:5},equipment:{kb:[8,10],club:[5]},skills:{bodyweightSquat:true},trainingPreferences:{daysPerWeek:3,focus:'balanced',variety:'consistent',useKb:false,useClub:true,useBodyweight:true,useComplexes:false,skillSessions:false,conditioning:false,emphasis:{kb:'major',complex:'major',bodyweight:'major',club:'minor'}}};}
function record(s,date,ids){const p={...E.plan(s,{now:date}),items:ids.map(id=>E.prescription(s,id,{now:date}))};const a=N.newItems(p);for(const i of a)for(const x of i.sets)Object.assign(x,{done:true,bothSides:true,leftReps:x.reps,rightReps:x.reps});s.sessions.push({id:'manual-'+s.sessions.length,date,title:'Recorded practice',items:N.records(p,a)});}

const date='2026-01-07';
function seeded(){const s=fresh();record(s,C.add(date,-4),['bodyweightSquat']);record(s,C.add(date,-2),['bodyweightSquat','circles']);return s;}
const base=seeded(),before=JSON.stringify(base),plan=E.plan(base,{now:date});
assert.equal(plan.items[0].id,'bodyweightSquat','Major bodyweight work must fit before Minor clubs');
assert.equal(E.emphasisDistribution(base).shares.bodyweight,.75);
for(const kb of ['off','minor','major'])for(const complex of ['off','minor','major']){
 const s=structuredClone(base);Object.assign(s.trainingPreferences.emphasis,{kb,complex});
 assert.deepEqual(E.plan(s,{now:date}),plan,'Excluded priorities cannot affect actual prescriptions');
 assert.deepEqual(E.emphasisDistribution(s).weights,E.emphasisDistribution(base).weights);
 assert.deepEqual(s.equipment,base.equipment);assert.deepEqual(s.sessions,base.sessions);
}
assert.equal(JSON.stringify(base),before,'Planning must not mutate history or preferences');
const swapped=structuredClone(base);Object.assign(swapped.trainingPreferences.emphasis,{bodyweight:'minor',club:'major'});
assert.equal(E.plan(swapped,{now:date}).items[0].id,'front','Enabled priorities must change actual selection');
// Reciprocal equipment configuration: excluded clubs/complexes cannot distort KB/BW.
const kbBase=fresh();Object.assign(kbBase.trainingPreferences,{useKb:true,useClub:false});Object.assign(kbBase.trainingPreferences.emphasis,{kb:'minor',club:'major'});
for(const id of ['squat','press','row','swing','clean','carry'])kbBase.weights[id]=8;
record(kbBase,C.add(date,-4),['bodyweightSquat']);record(kbBase,C.add(date,-2),['bodyweightSquat','row']);
const kbPlan=E.plan(kbBase,{now:date});assert.ok(kbPlan.items.length);
for(const club of ['off','minor','major'])for(const complex of ['off','minor','major']){
 const s=structuredClone(kbBase);Object.assign(s.trainingPreferences.emphasis,{club,complex});assert.deepEqual(E.plan(s,{now:date}),kbPlan);
}
// Historical work with an excluded implement is real history, but has no current emphasis share.
const excluded=structuredClone(base),past=fresh();past.trainingPreferences.useKb=true;
for(const id of ['squat','press','row','swing','clean','carry'])past.weights[id]=8;
record(past,C.add(date,-2),['squat','press','row','swing','clean','carry']);
excluded.sessions[1].items.push(...past.sessions[0].items);
assert.deepEqual(E.plan(excluded,{now:date}),plan,'Excluded-family actual work must not dilute current priorities');
assert.equal(excluded.sessions[1].items.length,8);
// Emphasis edits never reset lifetime progression or erase archived actual work.
function historyState(age){const s=fresh();s.skills.hipDropTwoHand=true;
 for(let i=0;i<24;i++)record(s,C.add(date,-age),['hipDropTwoHand']);
 s.skills.hipDropTwoHand=false;
 record(s,C.add(date,-4),['bodyweightSquat']);
 record(s,C.add(date,-2),['bodyweightSquat','front','circles','cast']);return s;}
const recentOnly=fresh();record(recentOnly,C.add(date,-4),['bodyweightSquat']);record(recentOnly,C.add(date,-2),['bodyweightSquat','front','circles','cast']);
const recentPlan=E.plan(recentOnly,{now:date});
for(const age of [56,365,3650]){
 const s=historyState(age),snapshot=JSON.stringify(s),prior=E.stateFor(s,'hipDropTwoHand',{now:date});E.plan(s,{now:date});
 assert.equal(JSON.stringify(s),snapshot);assert.equal(s.sessions.length,26);assert.ok(prior.cycles>0);
 Object.assign(s.trainingPreferences.emphasis,{bodyweight:'minor',club:'major'});
 assert.deepEqual(E.stateFor(s,'hipDropTwoHand',{now:date}),prior,'Emphasis cannot reset earned movement progression');
 const restored=E.validateBackup(JSON.parse(JSON.stringify(s)));assert.deepEqual(E.plan(restored,{now:date}),E.plan(s,{now:date}));
}
// Future rows must not leak into a dated plan; zero/unperformed work never counts.
const future=structuredClone(recentOnly),extra=historyState(55).sessions.slice(0,24);
future.sessions.push(...extra.map((row,i)=>({...row,id:'future-'+i,date:C.add(date,1)})));
assert.deepEqual(E.plan(future,{now:date}),recentPlan);
const skipped=structuredClone(recentOnly);skipped.sessions[1].items.push(...extra.flatMap(row=>row.items.map(item=>({...item,actualSets:0,performed:false,completed:false,sets:[]}))));
assert.deepEqual(E.plan(skipped,{now:date}),recentPlan);
// Recovery, gates, availability and time caps still govern high-priority work.
const low={...base,todayReadiness:{date,value:'low'}};
assert.ok(E.plan(low,{now:date}).items.every(x=>x.mode==='recovery'));
const gated=structuredClone(base);gated.skills.bodyweightSquat=false;
assert.ok(E.plan(gated,{now:date}).items.every(x=>x.id!=='bodyweightSquat'));
const off=structuredClone(base);off.trainingPreferences.emphasis.bodyweight='off';
assert.ok(E.plan(off,{now:date}).items.every(x=>!x.bodyweight));
for(const s of [base,swapped,excluded,recentOnly,historyState(55)]){
 const p=E.plan(s,{now:date});assert.ok(p.total<=p.budget.total);const snap=JSON.stringify(s);C.project(s,date,C.add(date,28));assert.equal(JSON.stringify(s),snap,'Forecasting must remain read-only');
}
// Three years of actual generated workouts through changing temporary priorities.
let trainee=fresh(),saved=0,forecasts=0;
for(let day=0;day<1095;day+=7){
 if(day%91===0){trainee.trainingPreferences.useClub=!trainee.trainingPreferences.useClub;Object.assign(trainee.trainingPreferences.emphasis,{bodyweight:day%182===0?'major':'minor',club:day%182===0?'minor':'major',kb:day%182===0?'off':'major'});}
 if(day%77===0)continue;
 const when=C.add('2023-01-01',day),p=E.plan(trainee,{now:when,minutes:day%35===0?25:45,readiness:day%49===0?'low':'normal'});
 assert.ok(p.items.every(x=>x.bodyweight||trainee.trainingPreferences.useClub),'Excluded gear cannot be prescribed');
 assert.ok(p.total<=p.budget.total);if(!p.items.length)continue;
 const a=N.newItems(p);for(const item of a)for(const set of item.sets)Object.assign(set,{done:true,bothSides:true,leftReps:set.reps,rightReps:set.reps,timingValid:true});
 if(day%63===0)a[0].sets.at(-1).done=false;
 const records=N.records(p,a);trainee.sessions.push({id:'emphasis-long-'+saved,date:when,title:p.day.name,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items:records});trainee.deferredByBlock={...trainee.deferredByBlock,[p.block]:E.deferredAfter(p,records)};saved++;
 if(saved%20===0){const before=JSON.stringify(trainee);C.project(trainee,when,C.add(when,28));assert.equal(JSON.stringify(trainee),before);trainee=E.validateBackup(JSON.parse(before));assert.equal(JSON.stringify(trainee.sessions),JSON.stringify(JSON.parse(before).sessions));forecasts++;}
}
assert.ok(saved>100&&forecasts>=5);assert.deepEqual(trainee.equipment,fresh().equipment);
console.log('PASS effective excluded-family priorities, real active-priority selection, excluded actual history, retained lifetime history/progression, backups, dated evidence, recovery/gates/time and immutable forecasts; three-year actual changing-emphasis history',JSON.stringify({saved,forecasts}));
