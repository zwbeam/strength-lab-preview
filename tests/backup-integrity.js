/* Backup validation regression. Run: node tests/backup-integrity.js */
'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js');
const b={version:33,defaultMinutes:30,sessions:[],weights:{squat:16},equipment:{kb:[],club:[],pairs:[]},trainingPreferences:{daysPerWeek:3,useKb:true,useClub:true,useBodyweight:true,focus:'balanced'}};
const rx=E.prescription(b,'squat'),rec=E.completeRecord(rx,Array.from({length:rx.sets},()=>({done:true,weight:16,reps:rx.reps,leftReps:rx.reps,rightReps:rx.reps,bothSides:true})),'clean',false);
const ss={id:'s1',title:'A',date:'2026-11-09',items:[rec]};
let passed=0;
function test(name,fn){try{fn();passed++;console.log('PASS',name)}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
test('valid history accepted',()=>assert.ok(E.validateBackup({...b,sessions:[ss]})));
test('JSON round trip accepted',()=>assert.ok(E.validateBackup(JSON.parse(JSON.stringify({...b,sessions:[ss]})))));
test('duplicate session rejected',()=>assert.throws(()=>E.validateBackup({...b,sessions:[ss,ss]})));
test('duplicate movement rejected',()=>assert.throws(()=>E.validateBackup({...b,sessions:[{...ss,items:[rec,rec]}]})));
test('impossible date rejected',()=>assert.throws(()=>E.validateBackup({...b,sessions:[{...ss,date:'2026-02-31'}]})));
test('negative sets rejected',()=>assert.throws(()=>E.validateBackup({...b,sessions:[{...ss,items:[{...rec,actualSets:-1}]}]})));
test('invalid focus rejected',()=>assert.throws(()=>E.validateBackup({...b,trainingPreferences:{...b.trainingPreferences,focus:'oops'}})));
test('duplicate draft identity rejected',()=>assert.throws(()=>E.validateBackup({...b,sessions:[ss,{...ss,id:'s2',draftId:'d'},{...ss,id:'s3',draftId:'d'}]})));
console.log(passed+'/8 backup integrity checks passed');
