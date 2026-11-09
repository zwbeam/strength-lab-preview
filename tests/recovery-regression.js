/* Recovery and failure regression. Run: node tests/recovery-regression.js */
'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js');
const base=()=>({version:33,defaultMinutes:30,programBlock:'abc',sessions:[],weights:{squat:16,press:12,row:16,swing:16,cast:10,carry:16,clean:12,front:10,circles:10},equipment:{kb:[],club:[],pairs:[]},nextWeights:{},skills:{swing:true,clean:true,rack:true,overhead:true,clubGrip:true,clubTwoHandFoundation:true,hingePattern:true,bearSquat:true,pushupTechnique:true},trainingPreferences:{daysPerWeek:3,useKb:true,useClub:true,useBodyweight:true,focus:'strength',variety:'moderate'}});
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
console.log(passed+'/10 recovery checks passed');
