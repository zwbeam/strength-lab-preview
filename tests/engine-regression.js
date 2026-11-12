/* Strength Lab regression suite. Run: node tests/engine-regression.js
   Pure engine checks; browser and offline behavior are tested separately. */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
const base=()=>({version:33,defaultMinutes:30,programBlock:'abc',sessions:[],weights:{squat:16,press:12,row:16,swing:16,cast:10,carry:16,clean:12,front:10,circles:10},equipment:{kb:[12,16],club:[10],pairs:[]},nextWeights:{},skills:{swing:true,clean:true,rack:true,overhead:true,clubGrip:true,clubTwoHandFoundation:true,hingePattern:true,bearSquat:true,pushupTechnique:true},trainingPreferences:{daysPerWeek:3,useKb:true,useClub:true,useBodyweight:true,useDoubleKb:false,useTwoHandClub:true,focus:'strength',variety:'moderate'}});
let passed=0;
function test(name,fn){try{fn();passed++;console.log('PASS',name)}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
test('valid backup',()=>assert.ok(E.validateBackup(base())));
test('all equipment disabled rejected',()=>assert.throws(()=>E.validateBackup({...base(),trainingPreferences:{...base().trainingPreferences,useKb:false,useClub:false,useBodyweight:false}})));
test('strength plan nonempty',()=>assert.ok(E.plan(base(),{now:'2026-11-09'}).items.length));
test('strength cap 4 rolling days',()=>{const b=base();b.trainingPreferences.daysPerWeek=7;b.sessions=Array.from({length:4},(_,i)=>({id:'s'+i,title:'t',date:'2026-11-'+String(5+i).padStart(2,'0'),block:'abc',slot:i%3,items:[{id:'squat',actualSets:1,performed:true}]}));assert.equal(E.plan(b,{now:'2026-11-09'}).restDay,true)});
test('planning does not mutate state',()=>{const b=base(),before=JSON.stringify(b);E.plan(b,{now:'2026-11-09'});assert.equal(JSON.stringify(b),before)});
test('pushup baseline unlocks',()=>assert.notEqual(E.prescription(E.retestPushup(base(),10),'pushup').mode,'prerequisite'));
test('club only',()=>{const b=base();b.trainingPreferences.useKb=false;b.trainingPreferences.useBodyweight=false;assert.ok(E.plan(b,{now:'2026-11-09'}).items.length)});
test('bodyweight only',()=>{const b=base();b.trainingPreferences.useKb=false;b.trainingPreferences.useClub=false;assert.ok(E.plan(b,{now:'2026-11-09'}).items.length)});
test('spacing advice',()=>{const b=base();b.sessions=[{id:'a',title:'a',date:'2026-11-09',slot:0,block:'abc',items:[{id:'squat',actualSets:2,performed:true}]}];assert.equal(E.plan(b,{now:'2026-11-10'}).spacingRecommended,true)});
test('session respects time budget',()=>{const p=E.plan(base(),{now:'2026-11-09'});assert.ok(p.estimated<=p.cap+1)});
test('invalid focus rejected',()=>{const b=base();b.trainingPreferences.focus='nonsense';assert.throws(()=>E.validateBackup(b))});
console.log(passed+' engine tests passed');
