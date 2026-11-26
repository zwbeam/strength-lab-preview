'use strict';
const assert=require('node:assert/strict'),{E,N,C,fresh,actual,receipt}=require('./fixtures/core-window.cjs');
const now='2026-01-05',copy=x=>JSON.parse(JSON.stringify(x));
function curriculum(minutes=45){const s=fresh(minutes);s.programComposition.blocks.push('bodyweightFoundations','groundPractice');return s;}
const s=curriculum(),snapshot=JSON.stringify(s),p=E.plan(s,{now});
assert.equal(p.composition.curriculum.mode,'focused','Overloaded selections need an actual focused curriculum, not only a warning');
assert.equal(p.composition.curriculum.coreBlock,'abc');assert.equal(p.composition.curriculum.activeBlock,'hingePractice');
assert.deepEqual(p.composition.curriculum.blocks.filter(x=>x.role==='queued').map(x=>x.block),['bodyweightPull','bodyweightFoundations','groundPractice']);
assert.equal(p.block,'abc');assert.equal(JSON.stringify(s),snapshot);
const visits=[];let firstGraduate=null;
for(let i=0;i<40;i++){
 const when=C.add(now,Math.floor(i/3)*7+[0,2,4][i%3]),plan=receipt(s,null,when,{selected:false});
 assert.ok(plan.total<=45);if(plan.block!=='abc')visits.push(plan.block);
 if(E.stateFor(s,'hingePractice',{now:when}).phase==='ready'){firstGraduate=when;break;}
 assert.ok(visits.every(x=>x==='hingePractice'),'Do not start several unfinished cycles under overloaded capacity');
}
assert.ok(firstGraduate);assert.ok(visits.length>=4,'A completed supporting qualification alone must not certify a full method cycle');
const nextDate=C.project(s,C.add(firstGraduate,1),C.add(firstGraduate,14))[0].date;
const next=E.plan(s,{now:nextDate}).composition.curriculum;
assert.equal(next.blocks.find(x=>x.block==='hingePractice').role,'maintenance');assert.equal(next.activeBlock,'bodyweightPull');
console.log('PASS protected core, one focused developing cycle, earned-only graduation, queued saved choices and maintenance admission');
// Earned maintenance is explicit nonadvancing work, with the same familiar load,
// reps/rest/method identity and separate actual ownership; unearned targets stay full.
const mixed=curriculum(60);for(const day of [0,2,4,7])receipt(mixed,'hingePractice',C.add(now,day));
const mixedDate=C.add(now,21),written=E.plan(mixed,{now:mixedDate}),part=written.composition.curriculum.maintenance?.[0];
assert.equal(written.block,'abc');assert.equal(part?.block,'hingePractice');assert.equal(part.id,'hingePractice');assert.ok(written.items.length<=4&&written.total<=60);
const maintenance=written.items.find(x=>x.id===part.id),own=E.prescription(mixed,part.id,{now:mixedDate});
for(const key of ['reps','weight','rest','policyKey','profile','track'])assert.equal(maintenance[key],own[key],key+' must retain the current independent method');
assert.equal(maintenance.mode,'light');assert.equal(maintenance.earnedMaintenance,true);assert.ok(maintenance.sets<own.sets);
const unperformed=actual(written);unperformed.find(x=>x.id===part.id).sets.at(-1).done=false;
const rows=N.records(written,unperformed),session={id:'mixed',title:written.day.name,date:mixedDate,block:written.block,slot:written.slot,calendarVersion:1,plan:written,items:rows};
mixed.sessions.push(session);mixed.deferredByBlock=E.deferredBlocksAfter(mixed.deferredByBlock||{},written,rows);
assert.ok(!mixed.deferredByBlock.abc.includes(part.id));assert.ok(mixed.deferredByBlock[part.block].includes(part.id));
const single=copy(mixed);single.programComposition.enabled=false;single.programBlock='abc';assert.equal(E.plan(single,{now:C.add(mixedDate,2)}).slot,1,'An unfinished maintenance target must not freeze a completed primary program day');
assert.deepEqual(N.reconcile(copy(mixed),[]).deferredByBlock,mixed.deferredByBlock);
const nextOpportunity=C.project(mixed,C.add(mixedDate,1),C.add(mixedDate,14))[0];assert.equal(E.plan(mixed,{now:nextOpportunity.date}).block,part.block,'Written maintenance debt remains real unfinished work');
const correction=N.historyDraft(session);correction.items.find(x=>x.id===part.id).sets.forEach(x=>{x.done=true;});
const repaired=N.correct(mixed,'mixed',correction);assert.ok(!repaired.deferredByBlock[part.block].includes(part.id));assert.deepEqual(repaired.sessions.at(-1).plan,written);
const restored=N.undo(repaired,'mixed');assert.ok(restored.deferredByBlock[part.block].includes(part.id));E.validateBackup(restored);
for(const tamper of [c=>{c.primaryIds.pop();},c=>{c.maintenance[0].block='bodyweightPull';},c=>{c.primaryIds.push(c.maintenance[0].id);}]){const bad=copy(restored);tamper(bad.sessions.at(-1).plan.composition.curriculum);assert.throws(()=>E.validateBackup(bad),/curriculum|maintenance/i);}
// Maintenance-only actuals cannot create a primary core visit or primary day.
const maintenanceOnly=copy(mixed);maintenanceOnly.sessions.pop();const only=actual(written);only.forEach(x=>{if(x.id!==part.id)x.sets.forEach(y=>{y.done=false;});});maintenanceOnly.sessions.push({...session,id:'maintenance-only',items:N.records(written,only)});
assert.equal(E.plan(maintenanceOnly,{now:C.add(mixedDate,2)}).composition.coreAllocation.actualCoreVisits,0);
console.log('PASS earned maintenance dose, separate pending ownership, independent primary day, corrections/undo, malformed-backup rejection and no phantom core credit');
function logMovement(state,id,date,rx=E.prescription(state,id,{now:date})){
 const single={items:[rx]},row=N.records(single,actual(single))[0];
 state.sessions.push({id:'method-'+state.sessions.length,title:rx.name,date,block:'abc',items:[row]});return row;
}
const strength=fresh(60);strength.programComposition.enabled=false;strength.equipment.kb.push(13);
let latest;for(let i=0;i<40;i++){latest=C.add(now,Math.floor(i/3)*7+[0,2,4][i%3]);logMovement(strength,'press',latest);if(E.stateFor(strength,'press',{now:latest}).phase==='ready')break;}
assert.equal(E.stateFor(strength,'press',{now:latest}).phase,'ready');assert.equal(E.advancementReview(strength,'press',{now:latest}).eligible,true);
const maintenanceDate=C.add(latest,3),maintenanceRx=E.plan(strength,{now:maintenanceDate,earnedMaintenance:true}).items.find(x=>x.id==='press');
assert.equal(maintenanceRx.earnedMaintenance,true);const earned=E.stateFor(strength,'press',{now:maintenanceDate});logMovement(strength,'press',maintenanceDate,maintenanceRx);
assert.equal(E.stateFor(strength,'press',{now:maintenanceDate}).cycles,earned.cycles);assert.equal(E.stateFor(strength,'press',{now:maintenanceDate}).phase,'ready');
assert.equal(E.advancementReview(strength,'press',{now:maintenanceDate}).eligible,false);assert.deepEqual(E.loadOptions(strength,'press',{now:maintenanceDate}),[]);
const fullDate=C.add(maintenanceDate,3),full=E.plan(strength,{now:fullDate,earnedMaintenance:true}).items.find(x=>x.id==='press');
assert.equal(full.mode,'milestone');assert.equal(full.earnedMaintenance,undefined);assert.equal(full.sets,earned.sets);logMovement(strength,'press',fullDate,full);
assert.equal(E.advancementReview(strength,'press',{now:fullDate}).eligible,true);assert.ok(E.loadOptions(strength,'press',{now:fullDate}).includes(13));assert.equal(strength.weights.press,12);assert.equal(strength.nextWeights.press,undefined);E.validateBackup(strength);
const changedMethod=E.configureMovement(strength,'press',{profile:'legacy',exposures:3});assert.equal(E.stateFor(changedMethod,'press',{now:fullDate}).phase,'volume');assert.ok(!E.plan(changedMethod,{now:C.add(fullDate,3),earnedMaintenance:true}).items.find(x=>x.id==='press')?.earnedMaintenance);
const wave=E.configureMovement(fresh(60),'press',{profile:'wave',lightWeight:12,heavyWeight:16});wave.programComposition.enabled=false;
let waveDate;for(let i=0;i<80;i++){waveDate=C.add(now,Math.floor(i/3)*7+[0,2,4][i%3]);logMovement(wave,'press',waveDate);if(E.stateFor(wave,'press',{now:waveDate}).phase==='ready')break;}
assert.equal(E.stateFor(wave,'press',{now:waveDate}).phase,'ready');const waveNext=C.add(waveDate,3),waveOwn=E.prescription(wave,'press',{now:waveNext}),wavePlan=E.plan(wave,{now:waveNext,earnedMaintenance:true}).items.find(x=>x.id==='press');
for(const key of ['sets','reps','rest','weight','track','policyKey'])assert.equal(wavePlan[key],waveOwn[key]);assert.equal(wavePlan.earnedMaintenance,undefined);
console.log('PASS reduced earned maintenance preserves cycles, requires a new full review before load increase, leaves unearned methods and independent wave prescriptions intact');
// Curriculum roles are explanatory scheduling data, never future graduation.
const future=curriculum(),beforeFuture=E.plan(future,{now});receipt(future,'hingePractice',C.add(now,90));assert.deepEqual(E.plan(future,{now}),beforeFuture);
const projectionState=curriculum(),projectionSnapshot=JSON.stringify(projectionState),forecast=C.project(projectionState,now,C.add(now,35));
assert.ok(forecast.every(x=>x.plan.composition.curriculum.activeBlock==='hingePractice'));assert.ok(forecast.every(x=>!x.plan.composition.curriculum.blocks.find(y=>y.block==='hingePractice').earnedIds.length));assert.equal(JSON.stringify(projectionState),projectionSnapshot);
const balanced=fresh(60);assert.equal(E.plan(balanced,{now}).composition.curriculum.mode,'balanced');
const off=curriculum();off.programComposition.continuity=false;assert.equal(E.plan(off,{now}).composition.curriculum,undefined);
const removed=copy(s);removed.programComposition.blocks=removed.programComposition.blocks.filter(x=>x!=='bodyweightPull');assert.notEqual(E.plan(removed,{now:nextDate}).composition.curriculum.activeBlock,'bodyweightPull');
console.log('PASS immutable forecasts, no predicted qualification, future isolation, ordinary balanced rotation, existing continuity opt-out and changed selected goals');

const legacyDebt=copy(mixed);legacyDebt.deferredByBlock.singleClub=['clubInside'];assert.deepEqual(N.reconcile(legacyDebt,[]).deferredByBlock.singleClub,['clubInside'],'Unassigned legacy requests must survive unrelated correction replay');
// Capacity changes open the queue without granting progress on the settings save.
const evolving=curriculum(30);for(let i=0;i<240;i++){
 if(i===120){const stages=Object.fromEntries(['bodyweightSquat','hipDropTwoHand','hipDropSingleHand','bearSquat'].map(id=>[id,E.stateFor(evolving,id).stage]));evolving.defaultMinutes=45;for(const [id,stage] of Object.entries(stages))assert.equal(E.stateFor(evolving,id).stage,stage);}
 const date=C.add(now,Math.floor(i/3)*7+[0,2,4][i%3]),plan=receipt(evolving,null,date,{selected:false});assert.ok(plan.total<=evolving.defaultMinutes);
 for(const row of evolving.sessions.at(-1).items)if(row.earnedMaintenance||['recovery','reentry','rebuild','deload','light'].includes(row.mode))assert.equal(row.completed,false);
}
for(const id of ['hingePractice','bodyweightRow','bodyweightSquat','stepBackLunge','hipDropTwoHand','hipDropSingleHand','bearSquat'])assert.equal(E.stateFor(evolving,id).phase,'ready',id+' must earn its complete cycle after capacity opens');E.validateBackup(evolving);
console.log('PASS 240 actual changing-capacity workouts: queued learning resumes at 45 minutes, all seven tracked cycles earned, no settings or maintenance credit');
const auditHistory={sessions:[{id:'late',date:'2026-01-09',items:[{id:'row',tag:'other'},{id:'press',tag:'late'}]},{date:'2026-01-05',items:[{id:'press',tag:'first'},{id:'press',tag:'same-session'}]},{id:'same-day',date:'2026-01-05',items:[{id:'press',tag:'next-session'}]},{id:'future',date:'2027-01-01',items:[{id:'press',tag:'future'}]}]};
const auditRows=E.records(auditHistory,'press',{now:'2026-01-10'});assert.deepEqual(auditRows.map(x=>[x.tag,x._key]),[['first','2026-01-05:1:0'],['same-session','2026-01-05:1:1'],['next-session','same-day:0'],['late','late:1']]);
assert.equal(E.records(auditHistory,'press').length,5);auditRows[0].tag='edited-result';assert.equal(auditHistory.sessions[1].items[0].tag,'first');
console.log('PASS movement history stable identities/order, future scoping and independent returned records');
const twoParts=curriculum(60);let composed=false;
for(let i=0;i<120;i++){
 const date=C.add(now,Math.floor(i/3)*7+[0,2,4][i%3]),plan=E.plan(twoParts,{now:date}),parts=plan.composition.curriculum?.maintenance||[];
 if(parts.length===2){
  const a=actual(plan);a.find(x=>x.id===parts[0].id).sets.forEach(x=>{x.done=false;});const rows=N.records(plan,a);
  twoParts.sessions.push({id:'two-parts',title:plan.day.name,date,block:plan.block,slot:plan.slot,calendarVersion:1,plan,items:rows});twoParts.deferredByBlock=E.deferredBlocksAfter(twoParts.deferredByBlock||{},plan,rows);
  assert.ok(twoParts.deferredByBlock[parts[0].block].includes(parts[0].id));assert.ok(!twoParts.deferredByBlock[parts[1].block].includes(parts[1].id));assert.ok(plan.items.length<=4&&plan.total<=60);assert.deepEqual(N.reconcile(copy(twoParts),[]).deferredByBlock,twoParts.deferredByBlock);E.validateBackup(twoParts);composed=true;break;
 }
 receipt(twoParts,null,date,{selected:false});
}
assert.ok(composed,'Spare capacity should support two independently earned maintenance targets without exceeding four movements');
console.log('PASS two maintenance sources retain separate actual/pending ownership within time and movement ceilings');
const futureParts=curriculum(60);for(const day of [-21,-19,-17,-14])receipt(futureParts,'hingePractice',C.add(now,day));
const currentPlan=E.plan(futureParts,{now}),futureDate=C.add(now,30),futurePlan=E.plan(futureParts,{now:futureDate}),futureActual=actual(futurePlan),futurePart=futurePlan.composition.curriculum.maintenance[0];futureActual.find(x=>x.id===futurePart.id).sets.forEach(x=>{x.done=false;});const futureRows=N.records(futurePlan,futureActual);
futureParts.sessions.push({id:'future-owned',title:futurePlan.day.name,date:futureDate,block:futurePlan.block,slot:futurePlan.slot,calendarVersion:1,plan:futurePlan,items:futureRows});futureParts.deferredByBlock=E.deferredBlocksAfter(futureParts.deferredByBlock||{},futurePlan,futureRows);assert.deepEqual(E.plan(futureParts,{now}),currentPlan);assert.deepEqual(E.plan(E.validateBackup(copy(futureParts)),{now}),currentPlan);
const crypto=require('node:crypto'),evidence=require('../research/curriculum-strategy-evidence.json');for(const source of evidence.sources){const archived=require('../sources-'+String(Math.floor(source.id/30)).padStart(2,'0')+'.json').find(x=>x.id===source.id),text=archived.text.replace(/\s+/g,' ').trim();assert.equal(source.url,archived.url);assert.equal(source.sha256,crypto.createHash('sha256').update(text).digest('hex'));for(const quote of source.quotes)assert.ok(text.includes(quote));}
console.log('PASS future multi-program ownership cannot create current debt/progress; verified bounded source quotes and hashes');
const rowWave=E.configureMovement(fresh(60),'bodyweightRow',{profile:'rowWave',cleanBaseline:10});rowWave.programComposition.enabled=false;rowWave.programBlock='bodyweightPull';let rowDate;
for(let i=0;i<80;i++){rowDate=C.add(now,Math.floor(i/3)*7+[0,2,4][i%3]);logMovement(rowWave,'bodyweightRow',rowDate);if(E.stateFor(rowWave,'bodyweightRow',{now:rowDate}).phase==='ready')break;}
assert.equal(E.stateFor(rowWave,'bodyweightRow',{now:rowDate}).phase,'ready');const rowNext=C.add(rowDate,3),rowOwn=E.prescription(rowWave,'bodyweightRow',{now:rowNext}),rowPlan=E.plan(rowWave,{now:rowNext,earnedMaintenance:true}).items.find(x=>x.id==='bodyweightRow');for(const key of ['sets','reps','rest','weight','track','policyKey'])assert.equal(rowPlan[key],rowOwn[key]);assert.equal(rowPlan.earnedMaintenance,undefined);
console.log('PASS earned row-wave keeps its own paired-track prescription and station identity');
for(const minutes of [30,45,60]){
 const novice=curriculum(minutes);novice.trainingPreferences.daysPerWeek=2;novice.trainingPreferences.useClub=false;novice.equipment={kb:[12],club:[],pairs:[],rowBar:{available:false,heightCm:100}};novice.skills={hingePattern:true,bodyweightSquat:true};novice.programComposition.blocks.push('doubleHinge');const familiar=copy(novice.skills);let cursor=now;
 for(let i=0;i<12;i++){
  const opportunity=C.project(novice,cursor,C.add(cursor,14))[0];assert.ok(opportunity);const plan=receipt(novice,null,opportunity.date,{selected:false});assert.ok(plan.total<=minutes);
  for(const rx of plan.items){assert.ok(!E.MOVES[rx.id].pair&&!E.MOVES[rx.id].clubPair);assert.equal(E.prerequisites(novice,rx.id,{now:opportunity.date}).length,0);if(!rx.bodyweight)assert.ok(E.availableWorkingLoads(novice,rx.id).includes(rx.weight));}
  assert.deepEqual(novice.skills,familiar);cursor=C.add(opportunity.date,1);
 }
 for(const id of ['doubleDeadlift','doubleSwing','bodyweightRow','stepBackLunge','hipDropSingleHand'])assert.equal(E.records(novice,id).length,0);E.validateBackup(novice);
}
console.log('PASS 36 actual limited-equipment beginner workouts preserve explicit skills, unavailable stations/pairs and strict 30/45/60-minute ceilings');
