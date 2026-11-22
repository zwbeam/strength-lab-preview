'use strict';
const assert=require('node:assert/strict'),E=require('../engine');
const old='2026-09-01',now='2026-11-17';
function fresh(){return{version:33,defaultMinutes:45,programBlock:'abc',sessions:[],weights:{squat:16},nextWeights:{},equipment:{kb:[12,16,18],club:[],pairs:[]},skills:{},trainingPreferences:{daysPerWeek:3}};}
function seed(){const s=fresh(),rx=E.prescription(s,'squat',{now:old});s.sessions.push({id:'old-squat',title:'Prior actual squat',date:old,items:[E.completeRecord(rx,Array.from({length:rx.sets},()=>({done:true,weight:16,reps:rx.reps,leftReps:rx.reps,rightReps:rx.reps,bothSides:true,timingValid:true,continuous:true})),'clean',false)]});return s;}
const s=seed(),before=JSON.stringify(s),prior=E.stateFor(s,'squat',{now});
assert.equal(E.prescription(s,'squat',{now}).returnLoadReview,true);
const lowered=E.chooseReentryLoad(s,'squat',12,{now});
assert.equal(JSON.stringify(s),before,'Selection must be immutable');
assert.equal(lowered.sessions[0].items[0].weight,16,'Historical load remains');
assert.equal(lowered.nextWeights.squat,12);
assert.equal(lowered.loadResetAfter.squat,'old-squat:0');
const next=E.prescription(lowered,'squat',{now});
assert.equal(next.weight,12);
assert.equal(next.mode,'reentry');
assert.equal(next.returnLoadReview,true);
assert.equal(E.stateFor(lowered,'squat',{now}).stage,0);
assert.equal(prior.weight,16);
E.validateBackup(lowered);
for(const [label,fn] of [
 ['same load',()=>E.chooseReentryLoad(s,'squat',16,{now})],
 ['heavier load',()=>E.chooseReentryLoad(s,'squat',18,{now})],
 ['unowned load',()=>E.chooseReentryLoad(s,'squat',10,{now})],
 ['short gap',()=>E.chooseReentryLoad(s,'squat',12,{now:'2026-09-03'})],
 ['unknown movement',()=>E.chooseReentryLoad(s,'missing',12,{now})],
 ['bodyweight',()=>E.chooseReentryLoad(s,'pushup',0,{now})]
])assert.throws(fn,undefined,label);
const painful=seed();painful.sessions[0].items[0].pain=true;assert.throws(()=>E.chooseReentryLoad(painful,'squat',12,{now}),/pain review/i);
assert.equal(JSON.stringify(s),before);
console.log('PASS explicit lighter return load, preserved historical weight, progression reset, backup validity and invalid selection guards');
