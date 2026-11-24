'use strict';
const assert=require('node:assert/strict'),{E,N,C,fresh,receipt,history}=require('./fixtures/core-window.cjs');
const now='2026-02-18',copy=x=>JSON.parse(JSON.stringify(x));
// Old surplus must not postpone foundations that are already beyond the return
// window. A return is reduced actual practice, never automatic advancement.
const s=history(now),snapshot=JSON.stringify(s),next=E.plan(s,{now});
assert.equal(next.block,'abc','Past foundation surplus cannot bank opportunities while foundations are overdue');
assert.match(next.composition.reason,/Resume the selected core after its training gap/);
assert.ok(next.items.some(x=>x.mode==='reentry'));
assert.equal(next.composition.coreAllocation.reservationResetDays,14);
assert.equal(next.composition.coreAllocation.actualCoreVisits,0);
assert.equal(next.composition.coreAllocation.actualOpportunities,5);
assert.equal(JSON.stringify(s),snapshot);
const stages=Object.fromEntries(next.items.map(x=>[x.id,E.stateFor(s,x.id,{now}).stage]));
receipt(s,'abc',now,{selected:false});
for(const row of s.sessions.at(-1).items)if(row.mode==='reentry'){
 assert.equal(row.completed,false);assert.equal(E.stateFor(s,row.id,{now}).stage,stages[row.id]);
}
assert.deepEqual(E.plan(E.validateBackup(copy(s)),{now:C.add(now,2)}),E.plan(s,{now:C.add(now,2)}));
console.log('PASS old foundation surplus expires, current return reserved, reduced actuals do not advance, immutable plans and backup replay');
// Boundaries and dates derive from actual selected work, not calendar forecasts,
// blank entries, settings saves or elapsed timers.
const boundary=history(now);boundary.sessions=boundary.sessions.filter(x=>C.diff(now,x.date)<=14);
const blank=copy(boundary);blank.sessions.push({id:'blank',title:'No work',date:now,block:'abc',calendarVersion:1,items:[]});
assert.equal(E.plan(blank,{now}).composition.coreAllocation.actualCoreVisits,0);
const future=history(now);receipt(future,'abc',C.add(now,30));assert.deepEqual(E.plan(future,{now}),next);
const projected=JSON.stringify(s);C.project(s,now,C.add(now,28));N.cycle(s,{now});assert.equal(JSON.stringify(s),projected);
const oldMethod=copy(s),keys=oldMethod.sessions.map(x=>JSON.stringify(x.items));const configured=E.configureMovement(oldMethod,'press',{profile:'legacy',exposures:3});assert.deepEqual(configured.sessions.map(x=>JSON.stringify(x.items)),keys);assert.equal(E.plan(configured,{now:C.add(now,2)}).composition.coreAllocation.actualCoreVisits,1);
// All configured return windows use the same accounting rule. A long window
// still uses only the existing 56-day observation ceiling, not invented visits.
for(const days of [7,14,21,35,90]){
 const state=history(now);state.trainingDefaults={reentryDays:days};const allocation=E.plan(state,{now}).composition.coreAllocation;
 const lastCore=state.sessions.filter(x=>x.block==='abc').at(-1),expired=C.diff(now,lastCore.date)>days;
 const eligible=state.sessions.filter(x=>C.diff(now,x.date)<56&&(!expired||C.diff(now,x.date)<days)&&x.items.some(y=>y.actualSets>0));
 assert.equal(allocation.reservationResetDays,days);assert.equal(allocation.actualOpportunities,eligible.length);
 assert.equal(allocation.actualCoreVisits,eligible.filter(x=>x.block==='abc').length);
}
const edge=history(now),lastCore=edge.sessions.filter(x=>x.block==='abc').at(-1).date;
assert.ok(E.plan(edge,{now:C.add(lastCore,14)}).composition.coreAllocation.actualCoreVisits>0,'Exact return boundary retains existing attendance credit');
assert.equal(E.plan(edge,{now:C.add(lastCore,15)}).composition.coreAllocation.actualCoreVisits,0,'Beyond the return boundary stale core credit expires');
const reverse=history(now,60,true),r=E.plan(reverse,{now:C.add(now,-1)}).composition.coreAllocation;
assert.equal(r.actualCoreVisits,4);assert.equal(r.actualOpportunities,6);assert.equal(r.reserved,false,'Old developing debt cannot force catch-up reservations');
const unavailable=history(now);unavailable.trainingPreferences.useKb=false;assert.ok(E.plan(unavailable,{now}).items.every(x=>E.MOVES[x.id].gear!=='kb'),'A stale reservation cannot bypass family restrictions');
const noCore=history(now);delete noCore.programComposition.coreBlock;assert.equal(E.plan(noCore,{now}).composition.coreAllocation,undefined);
console.log('PASS configured boundaries, old debt expiry, actual-only counts, restrictions, future isolation and no-core compatibility');
// Corrections withdraw actual reservation credit; undo restores it without
// touching immutable written prescriptions or manufacturing progression.
const correction=copy(s),id=correction.sessions.at(-1).id,edit=N.historyDraft(correction.sessions.at(-1));
edit.items.forEach(x=>x.sets.forEach(y=>{y.done=false;}));
const removed=N.correct(correction,id,edit);assert.equal(E.plan(removed,{now:C.add(now,2)}).composition.coreAllocation.actualCoreVisits,0);
const undo=N.undo(removed,id);assert.equal(E.plan(undo,{now:C.add(now,2)}).composition.coreAllocation.actualCoreVisits,1);
assert.deepEqual(undo.sessions.at(-1).plan,correction.sessions.at(-1).plan);E.validateBackup(removed);E.validateBackup(undo);
console.log('PASS actual correction and undo replay reservation credit with unchanged written plans');
// Resume real coordination after a changed curriculum, then change attendance,
// miss three weeks and shorten sessions. Reserved opportunities are not load or
// learning credit; forecasts remain read-only and original receipts survive.
const crypto=require('node:crypto'),evidence=require('../research/core-window-evidence.json');
for(const source of evidence.sources){const archived=require('../sources-'+String(Math.floor(source.id/30)).padStart(2,'0')+'.json').find(x=>x.id===source.id),text=archived.text.replace(/\s+/g,' ').trim();assert.equal(source.url,archived.url);assert.equal(source.sha256,crypto.createHash('sha256').update(text).digest('hex'));for(const quote of source.quotes)assert.ok(text.includes(quote));}
console.log('PASS verified source quotes and hashes with scheduling reset explicitly labeled as app adaptation');
const resumes=[];
for(const minutes of [30,45,60])for(const frequency of [2,3,5]){
 let state=history(now,minutes),cursor=now,returned=0,saved=0;
 const original=JSON.stringify(state.sessions);
 for(let i=0;i<36;i++){
  if(i===1)state.trainingPreferences.daysPerWeek=frequency;
  if(i===12)cursor=C.add(cursor,21);
  if(i===24)state.defaultMinutes=30;
  const before=JSON.stringify(state),opportunity=C.project(state,cursor,C.add(cursor,14))[0];
  assert.ok(opportunity);assert.equal(JSON.stringify(state),before);
  const when=opportunity.date,plan=receipt(state,null,when,{selected:false});
  assert.ok(plan.total<=state.defaultMinutes);
  if(i===0||i===12){assert.equal(plan.block,'abc');assert.equal(plan.composition.coreAllocation.reserved,true);returned++;}
  for(const item of state.sessions.at(-1).items)if(['reentry','recovery','light','rebuild','deload'].includes(item.mode))assert.equal(item.completed,false);
  assert.equal(JSON.stringify(state.sessions.slice(0,18)),original);
  if(i%12===0)state=E.validateBackup(copy(state));
  saved++;cursor=C.add(when,1);
 }
 resumes.push({minutes,frequency,saved,returned});
}
console.log('PASS nine actual resumed-curriculum histories with 2/3/5-day schedules, missed weeks, shortened sessions, immutable forecasts/backups and original records',JSON.stringify(resumes));
