/* 500-session backup roundtrip and corruption rejection.
 * Run: node tests/backup-history.js
 */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
const start=Date.UTC(2024,0,1), day=86400000;
const input={version:33,equipment:{kb:[12,16,20,24,28,32],club:[5,10,15]},weights:{swing:16,press:12},nextWeights:{},sessions:[],workoutDraft:null};
for(let i=0;i<500;i++){
 const id=i%2?'press':'swing',date=new Date(start+i*day).toISOString().slice(0,10);
 input.sessions.push({id:'session-'+i,title:'Synthetic session '+i,date,items:[{
   id,weight:id==='press'?12:16,actualSets:3,actualReps:5,targetSets:3,targetReps:5,
   rest:90,quality:'clean',completed:true,performed:true,pain:false
 }]});
}
const serialized=JSON.stringify(input),restored=E.validateBackup(JSON.parse(serialized));
assert.equal(restored.sessions.length,500);
assert.deepEqual(restored.sessions,input.sessions,'Backup roundtrip changed session history');
assert.equal(restored.sessions[0].date,'2024-01-01');
assert.equal(restored.sessions.at(-1).id,'session-499');
const invalid=JSON.parse(serialized);
invalid.sessions[499].id=invalid.sessions[0].id;
assert.throws(()=>E.validateBackup(invalid),/Duplicate workout identity/);
const invalidDate=JSON.parse(serialized);
invalidDate.sessions[300].date='2025-02-30';
assert.throws(()=>E.validateBackup(invalidDate),/Invalid training entry/);
const invalidWeight=JSON.parse(serialized);
invalidWeight.sessions[400].items[0].weight=-2;
assert.throws(()=>E.validateBackup(invalidWeight),/Invalid movement record/);
assert.equal(input.sessions.length,500,'Validation modified source backup');
console.log(JSON.stringify({sessions:500,bytes:Buffer.byteLength(serialized),invalidCasesRejected:3}));
