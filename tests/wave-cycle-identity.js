'use strict';
const assert=require('node:assert/strict'),E=require('../engine'),N=require('../notebook'),C=require('../rolling-calendar');
const date='2026-01-01',copy=x=>JSON.parse(JSON.stringify(x)),base={profile:'wave',lightWeight:8,heavyWeight:10};
function fresh(id='swing'){return{version:33,defaultMinutes:60,programBlock:'abc',sessions:[],weights:{[id]:8},nextWeights:{},equipment:{kb:[8,9,10,12],club:[]},skills:Object.fromEntries(Object.keys(E.SKILLS).map(k=>[k,true])),trainingPreferences:{daysPerWeek:3,useKb:true,useClub:false,useBodyweight:false,useComplexes:false,conditioning:false,skillSessions:false}};}
function log(s,id,when=date,change=()=>{}){const rx=E.prescription(s,id,{now:when}),p={...E.plan(s,{now:when,minutes:120}),items:[rx]},a=N.newItems(p);for(const item of a)for(const set of item.sets)Object.assign(set,{done:true,bothSides:true,leftReps:set.reps,rightReps:set.reps});change(a[0],rx);const row={id:'wave-cycle-'+s.sessions.length,date:when,title:'Configured wave practice',block:p.block,slot:p.slot,calendarVersion:1,plan:p,items:N.records(p,a)};s.sessions.push(row);return row;}
let cases=0;
for(const id of ['swing','squat','press','row','clean'])for(const patch of [{lightWeight:9},{heavyWeight:12},{heavyReps:1},{exposures:3},{stallStrategy:'redistribute'}]){
 let s=E.configureMovement(fresh(id),id,base);for(let n=0;n<4;n++)log(s,id);assert.equal(E.stateFor(s,id).stage,1);const original=copy(s),key=E.policyFor(id,s).key,history=JSON.stringify(s.sessions);
 const noOp=E.configureMovement(s,id,{...base,heavyReps:Math.floor(E.MOVES[id].reps*.6),exposures:2,stallStrategy:'repeat'});assert.equal(E.policyFor(id,noOp).key,key);assert.equal(E.stateFor(noOp,id).stage,1,'Equivalent Save must preserve evidence');
 s=E.configureMovement(s,id,{...base,...patch});assert.equal(E.stateFor(s,id).stage,0);assert.equal(s.programming[id].cycleRevision,1);
 s=E.configureMovement(s,id,base);assert.equal(E.stateFor(s,id).stage,0,'Restoring old wave settings must not revive old progress');assert.equal(E.stateFor(s,id).track,'light');assert.equal(s.programming[id].cycleRevision,2);assert.notEqual(E.policyFor(id,s).key,key);assert.equal(JSON.stringify(s.sessions),history);assert.deepEqual(original.sessions,s.sessions);
 const same=E.configureMovement(s,id,base);assert.equal(same.programming[id].cycleRevision,2);assert.equal(E.policyFor(id,same).key,E.policyFor(id,s).key);
 const restored=E.validateBackup(copy(s));assert.deepEqual(E.prescription(restored,id,{now:date}),E.prescription(s,id,{now:date}));assert.equal(E.practiceEvidence(s,id,{now:date}).count,0);assert.equal(E.deloadStatus({...s,trainingDefaults:{deloadEvery:2}},id,{now:date}).qualifyingSinceDeload,0);
 log(s,id);assert.equal(E.stateFor(s,id).track,'heavy');assert.equal(E.stateFor(s,id).stage,0);assert.equal(E.stateFor(s,id).streak,0); // heavy track has its own current state
 const revision=s.programming[id].cycleRevision;s=E.configureMovement(s,id,{});s=E.configureMovement(s,id,base);assert.equal(E.stateFor(s,id).stage,0);assert.equal(E.stateFor(s,id).track,'light');assert.ok(s.programming[id].cycleRevision>revision,'Profile re-entry must start after stored wave revisions');
 assert.equal(JSON.stringify(s.sessions.slice(0,4)),history);cases++;
}
// First-use legacy keys, explicit default heavy reps and safe revision limits.
for(const id of ['swing','squat','press','row','clean']){
 const legacy=fresh(id);legacy.programming={[id]:{...base,heavyReps:1}};for(let n=0;n<4;n++)log(legacy,id);const oldKey=E.policyFor(id,legacy).key;for(const session of legacy.sessions)delete session.items[0].profile;
 const kept=E.configureMovement(legacy,id,{...base,heavyReps:1});assert.equal(E.policyFor(id,kept).key,oldKey);assert.equal(E.stateFor(kept,id).stage,1);
 const back=E.configureMovement(E.configureMovement(legacy,id,{}),id,{...base,heavyReps:1});assert.equal(back.programming[id].cycleRevision,1);assert.equal(E.stateFor(back,id).stage,0);
 for(const revision of [-1,.5,NaN,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>E.configureMovement(legacy,id,{...base,cycleRevision:revision}));
 const explicit=E.configureMovement(legacy,id,{...base,heavyReps:1,cycleRevision:8});assert.equal(E.configureMovement(explicit,id,{...base,heavyReps:1}).programming[id].cycleRevision,8);
 const maximum=E.configureMovement(legacy,id,{...base,heavyReps:1,cycleRevision:Number.MAX_SAFE_INTEGER});assert.throws(()=>E.configureMovement(maximum,id,{...base,heavyReps:2}));assert.deepEqual(maximum.sessions,legacy.sessions);
 const edit=N.historyDraft(legacy.sessions[0]);edit.items[0].sets[0].done=false;const changed=N.correct(back,legacy.sessions[0].id,edit);assert.equal(E.stateFor(changed,id).stage,0);assert.equal(E.stateFor(N.undo(changed,legacy.sessions[0].id),id).stage,0);
 const future=copy(back);future.sessions.push({...copy(legacy.sessions[0]),id:'future-'+id,date:C.add(date,30)});assert.deepEqual(E.prescription(future,id,{now:date}),E.prescription(back,id,{now:date}));E.validateBackup(back);
}
// Reconfiguration cannot bypass a global pain hold or the reviewed return obligation.
let held=E.configureMovement(fresh(),'swing',base);log(held,'swing',date,a=>a.pain=true);held=E.configureMovement(held,'swing',{...base,heavyWeight:12});assert.ok(E.stateFor(held,'swing').hold);assert.equal(E.prescription(held,'swing',{now:date}).sets,0);held=E.resolvePain(held,'swing');held=E.configureMovement(held,'swing',base);assert.equal(E.stateFor(held,'swing').reviewRecovery,true);assert.equal(E.prescription(held,'swing',{now:date}).mode,'reentry');log(held,'swing');assert.equal(E.stateFor(held,'swing').reviewRecovery,false);
// New revised-cycle work still obeys evidence dates and historical correction/undo.
let dated=E.configureMovement(fresh(),'swing',base);dated=E.configureMovement(dated,'swing',{...base,heavyWeight:12});dated=E.configureMovement(dated,'swing',base);const later=C.add(date,10),row=log(dated,'swing',later);assert.equal(E.stateFor(dated,'swing',{now:date}).track,'light');assert.equal(E.stateFor(dated,'swing',{now:later}).track,'heavy');const edit=N.historyDraft(row);edit.date=date;const moved=N.correct(dated,row.id,edit);assert.equal(E.stateFor(moved,'swing',{now:date}).track,'heavy');assert.equal(E.stateFor(N.undo(moved,row.id),'swing',{now:date}).track,'light');assert.equal(dated.sessions[0].items[0].prescription.policyKey,E.policyFor('swing',dated).key);
// Explicit configuration reviews across three years of actual generated A/B/C work.
let trainee=fresh();for(const id of ['swing','squat','press','row','clean','carry'])trainee.weights[id]=8;trainee=E.configureMovement(trainee,'swing',base);let saved=0,reviews=0,heavies=0,forecasts=0;
for(let d=0;d<1095;d++){
 if(d===365||d===730){const previous=trainee.programming.swing.cycleRevision,history=JSON.stringify(trainee.sessions);trainee=E.configureMovement(trainee,'swing',{...base,heavyWeight:12});trainee=E.configureMovement(trainee,'swing',base);assert.equal(trainee.programming.swing.cycleRevision,previous+2);assert.equal(E.stateFor(trainee,'swing',{now:C.add(date,d)}).stage,0);assert.equal(JSON.stringify(trainee.sessions),history);reviews++;}
 if(![0,2,4].includes(d%7)||d%59===0||d%365>338)continue;const when=C.add(date,d),p=E.plan(trainee,{now:when,minutes:d%29===0?30:60,readiness:d%31===0?'low':'normal'});if(!p.items.length)continue;const a=N.newItems(p);for(let i=0;i<a.length;i++)for(const set of a[i].sets)Object.assign(set,{done:true,bothSides:true,leftReps:set.reps,rightReps:set.reps});if(d%37===0)a[0].sets.at(-1).done=false;
 for(const rx of p.items)if(rx.profile==='wave'&&rx.track==='heavy'){heavies++;assert.ok(rx.sets*rx.reps*rx.weight<E.stateFor(trainee,rx.id,{now:when}).waveLightWork);}
 const rows=N.records(p,a);trainee.sessions.push({id:'wave-cycle-long-'+saved,date:when,title:p.day.name,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items:rows});trainee.deferredByBlock={...trainee.deferredByBlock,[p.block]:E.deferredAfter(p,rows)};saved++;
 if(saved%60===0){const snapshot=JSON.stringify(trainee);C.project(trainee,when,C.add(when,21));assert.equal(JSON.stringify(trainee),snapshot);trainee=E.validateBackup(JSON.parse(snapshot));forecasts++;}
}
assert.ok(saved>350&&reviews===2&&heavies>20&&forecasts>=6,JSON.stringify({saved,reviews,heavies,forecasts}));E.validateBackup(trainee);
console.log('PASS '+cases+' configured-wave setting round trips, equivalent saves, fresh tracks/stages, profile re-entry, retained history, prerequisites, cadence and backups; three-year actual configuration reviews',JSON.stringify({saved,reviews,heavies,forecasts}));
