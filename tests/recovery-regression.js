/* Recovery and failure regression. Run: node tests/recovery-regression.js */
'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js');
const base=()=>({version:33,defaultMinutes:30,programBlock:'abc',sessions:[],weights:{squat:16,press:12,row:16,swing:16,cast:10,carry:16,clean:12,front:10,circles:10},equipment:{kb:[12,16],club:[10],pairs:[]},nextWeights:{},skills:{swing:true,clean:true,rack:true,overhead:true,clubGrip:true,clubTwoHandFoundation:true,hingePattern:true,bearSquat:true,pushupTechnique:true},trainingPreferences:{daysPerWeek:3,useKb:true,useClub:true,useBodyweight:true,focus:'strength',variety:'moderate'}});
const record=(rx,n,quality='clean',pain=false)=>E.completeRecord(rx,Array.from({length:n},()=>({done:true,weight:rx.weight,reps:rx.reps,leftReps:rx.reps,rightReps:rx.reps,bothSides:true,timingValid:true,continuous:true})),quality,pain);
const add=(s,r,date)=>({...s,sessions:[...s.sessions,{id:'s'+s.sessions.length,title:'test',date,slot:0,block:'abc',items:[r]}]});
let passed=0;
function test(name,fn){try{fn();passed++;console.log('PASS',name)}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
const b=base(),rx=E.prescription(b,'squat',{now:'2026-11-09'}),good=record(rx,rx.sets);
test('missed set earns no credit',()=>{const r=record(rx,rx.sets-1);assert.equal(r.completed,false);assert.equal(E.stateFor(add(b,r,'2026-11-09'),'squat').stage,0)});
test('two failures trigger rebuild',()=>{let s=add(b,record(rx,rx.sets-1),'2026-11-09');s=add(s,record(rx,rx.sets,'breakdown'),'2026-11-11');assert.equal(E.prescription(s,'squat',{now:'2026-11-12'}).mode,'rebuild')});
test('pain places movement on hold',()=>{const s=add(b,record(rx,1,'pain',true),'2026-11-09');assert.ok(E.stateFor(s,'squat').hold)});
test('pain resolution requires reentry',()=>{const s=E.resolvePain(add(b,record(rx,1,'pain',true),'2026-11-09'),'squat');assert.equal(E.prescription(s,'squat',{now:'2026-11-12'}).mode,'reentry')});
test('three week absence triggers reentry',()=>{const s=add(b,good,'2026-10-01');assert.equal(E.prescription(s,'squat',{now:'2026-11-09'}).mode,'reentry')});
test('one clean exposure not enough',()=>assert.equal(E.stateFor(add(b,good,'2026-11-09'),'squat').stage,0));
test('two clean exposures advance stage',()=>{const s=add(add(b,good,'2026-11-09'),good,'2026-11-11');assert.equal(E.stateFor(s,'squat').stage,1)});
test('hard quality earns no credit',()=>{const r=record(rx,rx.sets,'hard');assert.equal(r.completed,false);assert.equal(r.performed,false)});
test('hard bike ride blocks same and next day',()=>{const ride={id:'ride1',date:'2026-11-09',type:'mountain',status:'completed',effort:'hard',duration:90,replacesStrength:true};E.validateActivity(ride);const s={...b,activities:[ride]};assert.equal(E.plan(s,{now:'2026-11-09'}).items.length,0);assert.equal(E.plan(s,{now:'2026-11-10'}).items.length,0);assert.equal(s.sessions.length,0)});
test('low readiness reduces work and blocks credit',()=>{const p=E.prescription(b,'squat',{readiness:'low',now:'2026-11-09'});assert.equal(p.mode,'recovery');assert.equal(record(p,p.sets).completed,false)});
test('hard alternative activity never advances unfinished strength work',()=>{
 const partial={...b,sessions:[{id:'partial',date:'2026-11-08',block:'abc',calendarVersion:1,
 items:[{id:'squat',performed:true,actualSets:2,actualReps:6,targetSets:3,targetReps:6,quality:'clean',mode:'volume'},
 {id:'row',performed:false,actualSets:0,actualReps:0,targetSets:3,targetReps:6,quality:'clean',mode:'volume'}]}],
 deferredIds:['row']};
 const before=E.plan(partial,{now:'2026-11-11',minutes:45});
 const ride={id:'ride-recovery',date:'2026-11-09',type:'mountain',status:'completed',effort:'hard',duration:90,replacesStrength:true};
 const withRide={...partial,activities:[ride]};
 const blocked=E.plan(withRide,{now:'2026-11-10',minutes:45});
 assert.equal(blocked.items.length,0,'hard ride must block next-day lifting');
 assert.equal(withRide.sessions.length,1,'alternative activity cannot create strength session');
 assert.deepEqual(withRide.deferredIds,['row'],'hard ride must not consume unfinished movement');
 const resumed=E.plan(withRide,{now:'2026-11-11',minutes:45});
 assert.ok(resumed.items.some(x=>x.id==='row')||resumed.timeBlocked.some(x=>x.id==='row')||
 resumed.held.some(x=>x.id==='row')||resumed.prerequisite.some(x=>x.id==='row'),
 'unfinished row must remain available after recovery');
 assert.ok(!resumed.items.some(x=>x.id==='squat'),'completed squat must not repeat as remaining work');
 assert.equal(partial.sessions[0].items[0].actualSets,2);
 assert.equal(partial.sessions[0].items[1].actualSets,0);
});
test('recovery activity blocks strength without catch-up across repeated checks',()=>{
 const ride={id:'ride-repeat',date:'2026-11-09',type:'mountain',status:'completed',effort:'hard',duration:90,replacesStrength:true};
 const s={...b,activities:[ride]};
 const original=JSON.stringify(s);
 for(const date of ['2026-11-09','2026-11-10']){
  for(const minutes of [30,45,60]){
   const p=E.plan(s,{now:date,minutes,readiness:'normal'});
   assert.equal(p.items.length,0,'hard activity recovery must block lifting '+date+' '+minutes);
   assert.equal(JSON.stringify(s),original,'planning must not change activity or history');
  }
 }
 const after=E.plan(s,{now:'2026-11-11',minutes:45,readiness:'normal'});
 assert.ok(after.items.length>0||after.timeBlocked.length>0||after.held.length>0||
 after.prerequisite.length>0||after.unavailable.length>0,
 'normal scheduling must resume after recovery without invented history');
 assert.equal(s.sessions.length,0,'recovery must not create catch-up sessions');
});
test('hard-activity recovery cannot be bypassed by high readiness',()=>{
 const ride={id:'hard-ready',date:'2026-11-09',type:'mountain',status:'completed',effort:'hard',duration:90,replacesStrength:true};
 const s={...b,activities:[ride]},snapshot=JSON.stringify(s);
 for(const readiness of ['low','normal','great']){
  for(const minutes of [30,45,60]){
   for(const date of ['2026-11-09','2026-11-10']){
    const p=E.plan(s,{now:date,minutes,readiness});
    assert.equal(p.items.length,0,'readiness '+readiness+' must not override hard recovery on '+date);
   }
  }
 }
 assert.equal(JSON.stringify(s),snapshot,'readiness changes cannot rewrite recovery history');
});
console.log(passed+'/13 recovery checks passed');
