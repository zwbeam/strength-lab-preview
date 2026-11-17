'use strict';
const assert=require('node:assert/strict'),E=require('../engine'),N=require('../notebook'),C=require('../rolling-calendar');
const date='2026-01-01',copy=x=>JSON.parse(JSON.stringify(x));
function fresh(){return{version:33,defaultMinutes:60,sessions:[],weights:{squat:8,press:8,row:8,swing:8,clean:8,carry:8,cast:5,front:5,circles:5},equipment:{kb:[8],club:[5],rowBar:{available:true,heightCm:100}},skills:Object.fromEntries(Object.keys(E.SKILLS).map(k=>[k,true])),trainingPreferences:{daysPerWeek:3,useKb:true,useClub:true,useBodyweight:true,crawlSpace:true,conditioning:false,skillSessions:false,variety:'consistent'},programComposition:{enabled:true,blocks:['abc','hingePractice','bodyweightPull'],minGapDays:1,hardGapDays:2,continuity:false}};}
function actual(p){return N.newItems(p).map((x,i)=>({...x,sets:x.sets.map(set=>({...set,done:true,bothSides:true,leftReps:p.items[i].durationScope==='total'?3:set.reps,rightReps:p.items[i].durationScope==='total'?3:set.reps,continuous:true,timingValid:true}))}));}
function save(s,when){const p=E.plan(s,{now:when}),rows=N.records(p,actual(p));assert.ok(p.items.length);s.sessions.push({id:'rotation-'+s.sessions.length,date:when,title:p.day.name,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items:rows});s.deferredByBlock={...s.deferredByBlock,[p.block]:E.deferredAfter(p,rows)};return p;}
let cases=0;for(const days of [1,2,3,4,7])for(const maximum of [1,3,7])for(const focus of ['balanced','strength']){
 const s=fresh();Object.assign(s.trainingPreferences,{daysPerWeek:days,focus});s.trainingDefaults={maxTrainingDays:maximum};const before=JSON.stringify(s),p=E.plan(s,{now:date}),r=p.composition.cadence.rotation,limit=Math.min(days,maximum,focus==='strength'?4:7);assert.equal(r.effectiveDaysPerWeek,limit);assert.equal(r.readyBlocks,3);assert.equal(r.programs.find(x=>x.block==='abc').estimatedReturnDays,Math.ceil(63/limit));assert.equal(r.programs.find(x=>x.block==='hingePractice').estimatedReturnDays,Math.ceil(21/limit));assert.equal(r.longestReturnDays,Math.ceil(63/limit));assert.equal(JSON.stringify(s),before);assert.equal(s.trainingPreferences.daysPerWeek,days);cases++;
}
const s=fresh(),p=E.plan(s,{now:date});assert.equal(p.composition.cadence.rotation.longestReturnDays,21);assert.match(p.composition.cadence.warning,/3 program days.*21 days.*14-day return window/);assert.match(p.composition.cadence.warning,/simple rotation.*currently ready/);
assert.match(p.composition.cadence.warning,/approximately 2 programs of this length fit the return window/);
assert.match(p.composition.cadence.warning,/planning guidance, not an automatic change/);
const adjustment=p.composition.cadence.rotationAdjustment;
assert.equal(adjustment.currentLongestReturnDays,21);
assert.equal(adjustment.returnWindowDays,14);
assert.equal(adjustment.removalOptions.length,3);
assert.deepEqual(adjustment.removalOptions.map(x=>x.remainingLongestReturnDays),[5,14,14]);
assert.ok(adjustment.removalOptions.every(x=>x.withinReturnWindow));
assert.equal(p.composition.candidates.length,3,'Advice must not silently remove a selected program');
const protectedCore=fresh();
protectedCore.programComposition.coreBlock='abc';
const protectedBefore=JSON.stringify(protectedCore);
const protectedPlan=E.plan(protectedCore,{now:date});
const guarded=protectedPlan.composition.cadence.rotationAdjustment;
assert.equal(guarded.fastestScenario.remove,'abc','Pure speed may favor deleting the three-day foundation');
assert.notEqual(guarded.preferredScenario.remove,'abc','Protected foundation must not be recommended for removal');
assert.equal(guarded.removalOptions.find(x=>x.remove==='abc').removesProtectedCore,true);
assert.ok(guarded.removalOptions.filter(x=>x.remove!=='abc').every(x=>!x.removesProtectedCore));
assert.equal(JSON.stringify(protectedCore),protectedBefore,'Planning advice must never change saved program selection');
const invalidCore=fresh();invalidCore.programComposition.coreBlock='not-selected';
assert.throws(()=>E.plan(invalidCore,{now:date}),/Protected core must be a selected training block/);
const narrower=fresh();narrower.programComposition.blocks=['abc','hingePractice'];const narrow=E.plan(narrower,{now:date});assert.equal(narrow.composition.cadence.rotation.longestReturnDays,14);assert.equal(narrow.composition.cadence.warning,null);
assert.equal(narrow.composition.cadence.rotationAdjustment,null);
const five=fresh();five.programComposition.blocks.push('bodyweightFoundations','groundPractice');five.trainingDefaults={reentryDays:35};const exact=E.plan(five,{now:date});assert.equal(exact.composition.cadence.rotation.longestReturnDays,35,'Whole-week boundaries must not round floating-point noise up to 36 days');assert.equal(exact.composition.cadence.warning,null);
const station=fresh();station.equipment.rowBar.available=false;const unavailable=E.plan(station,{now:date});assert.equal(unavailable.composition.cadence.rotation.readyBlocks,2);assert.equal(unavailable.composition.cadence.rotation.blockedBlocks,1);assert.equal(unavailable.composition.cadence.rotation.longestReturnDays,14);assert.equal(unavailable.composition.cadence.warning,null,'Blocked station must not inflate the currently ready rotation');
const pause=fresh();pause.paused=true;const empty=E.plan(pause,{now:date}).composition.cadence.rotation;assert.equal(empty.readyBlocks,0);assert.equal(empty.longestReturnDays,null);
// A real unprioritized three-program A/B/C schedule repeats its A day after 21 days.
const measured=fresh();measured.trainingDefaults={reentryDays:120};const aDates=[];for(let i=0;i<18;i++){const when=C.add(date,Math.floor(i/3)*7+[0,2,4][i%3]),p=save(measured,when);if(p.block==='abc'&&p.slot===0)aDates.push(when);}assert.equal(C.diff(aDates[1],aDates[0]),21);assert.equal(E.plan(measured,{now:C.add(date,42)}).composition.cadence.rotation.longestReturnDays,21);
// Sparse actual attendance cannot be projected faster than observed; capped capacity still wins.
const sparse=fresh();for(const day of [0,7,14,21])save(sparse,C.add(date,day));const slow=E.plan(sparse,{now:C.add(date,23)}).composition.cadence.rotation;assert.equal(slow.basis,'capacity-and-observed-pace');assert.equal(slow.longestReturnDays,63);
const capped=copy(measured);capped.trainingDefaults={maxTrainingDays:1,reentryDays:120};assert.equal(E.plan(capped,{now:C.add(date,49)}).composition.cadence.rotation.longestReturnDays,63);
const future=fresh(),beforeFuture=E.plan(future,{now:date});save(future,C.add(date,30));assert.deepEqual(E.plan(future,{now:date}),beforeFuture);const snapshot=JSON.stringify(s);C.project(s,date,C.add(date,28));assert.equal(JSON.stringify(s),snapshot);assert.deepEqual(E.plan(E.validateBackup(copy(s)),{now:date}),p);assert.equal(E.stateFor(s,'squat').stage,0);assert.deepEqual(s.sessions,[]);
// Three-year real mixed plans with temporary station removal, changed weekly caps and partial work.
let trainee=fresh(),saved=0,notes=0,forecasts=0;
for(let d=0;d<1095;d++){
 if(d===180)trainee.equipment.rowBar.available=false;if(d===210)trainee.equipment.rowBar.available=true;
 if(d===365)trainee.trainingDefaults={maxTrainingDays:1};if(d===730)trainee.trainingDefaults={maxTrainingDays:3};
 if(![0,2,4].includes(d%7)||d%61===0||d%365>338)continue;const when=C.add(date,d),p=E.plan(trainee,{now:when,minutes:d%29===0?30:60,readiness:d%31===0?'low':'normal'}),r=p.composition.cadence.rotation;
 assert.equal(r.effectiveDaysPerWeek,Math.min(3,trainee.trainingDefaults?.maxTrainingDays??7));assert.ok(r.programs.every(x=>x.estimatedReturnDays>=Math.ceil(7*r.readyBlocks*x.programDays/r.effectiveDaysPerWeek)));if(d>=180&&d<210)assert.ok(!r.programs.some(x=>x.block==='bodyweightPull'));if(p.composition.cadence.warning)notes++;
 if(!p.items.length)continue;const a=actual(p);if(d%47===0)a[0].sets.at(-1).done=false;const rows=N.records(p,a);trainee.sessions.push({id:'rotation-long-'+saved,date:when,title:p.day.name,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items:rows});trainee.deferredByBlock={...trainee.deferredByBlock,[p.block]:E.deferredAfter(p,rows)};saved++;
 if(saved%50===0){const snapshot=JSON.stringify(trainee);C.project(trainee,when,C.add(when,21));assert.equal(JSON.stringify(trainee),snapshot);trainee=E.validateBackup(JSON.parse(snapshot));forecasts++;}
}
assert.ok(saved>280&&notes>30&&forecasts>=5,JSON.stringify({saved,notes,forecasts}));E.validateBackup(trainee);
console.log('PASS '+cases+' frequency/style/cap matrices, program-day recurrence, measured 21-day A/B/C cycle, blocked/paused programs, observed pace, future isolation, immutable forecasts and backups; three-year actual mixed capacity',JSON.stringify({saved,notes,forecasts}));
