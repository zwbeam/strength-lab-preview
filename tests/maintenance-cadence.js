'use strict';
const assert=require('node:assert/strict'),{E,N,C,fresh,actual,receipt}=require('./fixtures/core-window.cjs');
const date='2026-06-01';
function fixture(today=date){
 const s=fresh(30);s.weights.getup=12;
 s.programComposition={enabled:true,coreBlock:'hingePractice',blocks:['hingePractice','getup','bodyweightPull','bodyweightFoundations','groundPractice'],continuity:true,minGapDays:1};
 // Explicitly selected, actually delivered history; not coordinator-generated.
 // Thirty timed exposures earn this method. The last light exposure cannot
 // certify the full endpoint, even though it does count as physical practice.
 for(let n=0;n<30;n++)receipt(s,'getup',C.add(today,-94+n*3));
 for(const gap of [7,4])receipt(s,'hingePractice',C.add(today,-gap));
 receipt(s,'getup',C.add(today,-2),{earnedMaintenance:true});
 return s;
}
function save(s,p,when){const items=N.records(p,actual(p));s.sessions.push({id:'cadence-'+s.sessions.length,date:when,title:p.day.name,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items});s.deferredByBlock=E.deferredBlocksAfter(s.deferredByBlock||{},p,items);}
if(require.main===module){
 const s=fixture(),before=JSON.stringify(s),earned=E.stateFor(s,'getup',{now:date});
 assert.equal(earned.phase,'ready');assert.equal(E.records(s,'getup',{now:date}).at(-1).earnedMaintenance,true);
 assert.equal(E.movementGap(s,'getup',date),2);assert.equal(E.advancementReview(s,'getup',{now:date}).eligible,false);
 const p=E.plan(s,{now:date});assert.equal(p.block,'bodyweightPull','Recent clean maintenance must not consume a developing workout solely because load review needs a full endpoint');assert.equal(p.composition.curriculum.selection,'developing');assert.ok(p.total<=30);assert.equal(p.items.some(x=>x.id==='getup'),false);
 C.project(s,date,C.add(date,14));assert.equal(JSON.stringify(s),before,'Planning and forecasting must not alter physical history');
 let full=null;
 for(let n=0;n<9;n++){const when=C.add(date,Math.floor(n/3)*7+[0,2,4][n%3]),next=E.plan(s,{now:when});assert.ok(next.total<=30);if(!next.items.length)continue;const rx=next.items.find(x=>x.id==='getup');if(rx){assert.equal(rx.mode,'milestone');assert.equal(rx.earnedMaintenance,undefined);assert.equal(E.advancementReview(s,'getup',{now:when}).eligible,false);full={when,gap:E.movementGap(s,'getup',when)};}save(s,next,when);if(full)break;}
 assert.ok(full,'The full review must still receive a real workout');assert.ok(full.gap>2&&full.gap<=14);assert.equal(E.advancementReview(s,'getup',{now:full.when}).eligible,true);assert.equal(E.stateFor(s,'getup',{now:full.when}).cycles,earned.cycles);assert.equal(s.weights.getup,12);E.validateBackup(s);
 const original=fixture(),last=original.sessions.at(-1),draft=N.historyDraft(last);draft.items[0].sets[0].done=false;
 const partial=N.correct(original,last.id,draft);assert.equal(E.plan(partial,{now:date}).block,'getup','Incomplete maintenance must retain full-review priority');assert.equal(E.advancementReview(partial,'getup',{now:date}).eligible,false);
 const undone=N.undo(partial,last.id);assert.equal(E.plan(undone,{now:date}).block,'bodyweightPull');E.validateBackup(partial);E.validateBackup(undone);
 const legacy=fixture();delete legacy.sessions.at(-1).items[0].prescription;assert.equal(E.plan(legacy,{now:date}).block,'getup','Unverified maintenance cannot authorize deferral');
 const overdue=fixture();for(const session of overdue.sessions)if(session.block==='getup')session.date=C.add(session.date,-11);assert.equal(E.movementGap(overdue,'getup',date),13);assert.equal(E.plan(overdue,{now:date}).block,'getup','Return-window urgency overrides healthy maintenance');
 const maintenanceOnly=fixture();maintenanceOnly.programComposition.blocks=['hingePractice','getup'];assert.equal(E.plan(maintenanceOnly,{now:date}).block,'getup','Do not delay full review when there is no competing developing program');
 const future=fixture();future.sessions.at(-1).date=C.add(date,7);assert.equal(E.advancementReview(future,'getup',{now:date}).eligible,true,'Future light work cannot invalidate present full-endpoint evidence');
 for(const minutes of [45,60]){const roomy=fixture();roomy.defaultMinutes=minutes;const next=E.plan(roomy,{now:date});assert.ok(next.total<=minutes);assert.ok(next.items.some(x=>x.id==='getup'&&x.mode==='milestone'),'Keep full-review additions when they fit available time');}
 // Exercise real written plans at different capacities, with missed visits and
 // an extended absence. Skipped dates and projections never earn endpoints.
 for(const minutes of [30,45,60])for(const frequency of [2,3,4,5]){
  const state=fixture();state.defaultMinutes=minutes;state.trainingPreferences.daysPerWeek=frequency;
  const originalCount=state.sessions.length;
  for(let n=0;n<48;n++){
   if(n%13===7)continue;
   const when=C.add(date,Math.floor(n/frequency)*7+Math.floor(n%frequency*7/frequency)+(n>=24?28:0)),written=E.plan(state,{now:when}),snapshot=JSON.stringify(state);
   assert.ok(written.total<=minutes);assert.deepEqual(E.plan(state,{now:when}),written);assert.equal(JSON.stringify(state),snapshot);
   if(written.items.length){save(state,written,when);assert.equal(state.weights.getup,12);}
  }
  assert.ok(state.sessions.length>originalCount);E.validateBackup(state);
 }
 const long=fixture(),qualified={},returns={developing:0,earned:0};
 for(let n=0;n<120;n++){
  const when=C.add(date,Math.floor(n/3)*7+[0,2,4][n%3]),written=E.plan(long,{now:when});assert.ok(written.total<=30);if(!written.items.length)continue;
  for(const rx of written.items)if(rx.mode==='reentry')returns[E.stateFor(long,rx.id,{now:when}).cycles>0?'earned':'developing']++;
  save(long,written,when);
  for(const rx of written.items)if(rx.id!=='getup'&&!qualified[rx.id]&&E.stateFor(long,rx.id,{now:when}).cycles>0)qualified[rx.id]=when;
 }
 assert.ok(qualified.bodyweightRow<='2026-06-19','Dedicated maintenance must not delay the initial row cycle by another week');
 for(const id of ['hingePractice','bodyweightRow','bodyweightSquat','stepBackLunge','hipDropTwoHand','hipDropSingleHand','bearSquat'])assert.ok(qualified[id]&&qualified[id]<='2026-08-26',id+' must earn its foundation cycle through actual work');
 assert.equal(returns.developing,0);assert.ok(returns.earned<=14);E.validateBackup(long);
 const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),evidence=require('../research/maintenance-cadence-evidence.json');
 for(const source of evidence.sources){assert.notEqual(source.id,441);const archived=JSON.parse(fs.readFileSync(path.join(__dirname,'..',source.file),'utf8')).find(x=>x.id===source.id);assert.ok(archived);assert.equal(crypto.createHash('sha256').update(archived.text).digest('hex'),source.sha256);for(const quote of source.quotes)assert.ok(archived.text.includes(quote));}
 console.log('PASS dedicated maintenance cadence: developing opportunity, bounded full review, actual-only load gate, partial/legacy urgency, correction/undo, future isolation, forecast purity, backup and roomy additions');
}
module.exports={fixture,date};
