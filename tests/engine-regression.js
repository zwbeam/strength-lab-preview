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
test('owned kettlebell loads only',()=>{const b=base();const choices=E.loadOptions(b,'swing');assert.ok(choices.every(w=>b.equipment.kb.includes(w)),'unowned kettlebell load offered')});
test('owned club loads only',()=>{const b=base();const choices=E.loadOptions(b,'cast');assert.ok(choices.every(w=>b.equipment.club.includes(w)),'unowned club load offered')});
test('unowned kettlebell load rejected',()=>{const b=base();assert.throws(()=>E.selectLoad(b,'swing',99))});
test('unowned club load rejected',()=>{const b=base();assert.throws(()=>E.selectLoad(b,'cast',99))});
test('time allocations reconcile',()=>{for(const minutes of [30,45,60]){const b=E.timeBudget(minutes);assert.equal(b.warmup+b.main+b.cooldown,minutes)}});
test('matched pair inventory limits double press',()=>{const b=base();b.equipment.pairs=[12,16];const choices=E.loadOptions(b,'doublePress');assert.ok(choices.every(w=>b.equipment.pairs.includes(w)),'unowned pair offered')});
test('no pair inventory cannot offer double progression',()=>{const b=base();b.equipment.pairs=[];assert.deepEqual(E.loadOptions(b,'doublePress'),[])});
test('unowned matched pair load rejected',()=>{const b=base();b.equipment.pairs=[12,16];assert.throws(()=>E.selectLoad(b,'doublePress',99))});
test('unavailable load replacement preserves source state',()=>{const b=base();b.nextWeights={swing:20};const before=JSON.stringify(b);const updated=E.replaceUnavailableLoad(b,'swing',16);assert.equal(updated.nextWeights.swing,16);assert.equal(JSON.stringify(b),before)});
test('equipment replacement rejects a currently available working load',()=>{const b=base();assert.throws(()=>E.replaceUnavailableLoad(b,'swing',12),/still available/)});
test('equipment replacement rejects unowned destination',()=>{const b=base();b.nextWeights={swing:20};assert.throws(()=>E.replaceUnavailableLoad(b,'swing',99),/currently available/)});
test('equipment replacement rejects unsupported movement',()=>{assert.throws(()=>E.replaceUnavailableLoad(base(),'notAMovement',12),/loaded movement/)});
test('replacement cannot bypass wave configuration',()=>{const b=base();b.nextWeights={swing:20};b.programming={swing:{profile:'wave',lightWeight:12,heavyWeight:16}};assert.throws(()=>E.replaceUnavailableLoad(b,'swing',12),/wave weights/)});
console.log(passed+' engine tests passed');
