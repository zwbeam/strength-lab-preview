/* Long-break and recovery progression scenarios. Run: node tests/long-break-regression.js */
'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js');
const base=()=>({version:33,defaultMinutes:30,programBlock:'abc',sessions:[],weights:{squat:16},equipment:{kb:[],club:[],pairs:[]},nextWeights:{},skills:{},trainingPreferences:{}});
const record=rx=>E.completeRecord(rx,Array.from({length:rx.sets},()=>({done:true,weight:rx.weight,reps:rx.reps,leftReps:rx.reps,rightReps:rx.reps,bothSides:true,timingValid:true,continuous:true})),'clean',false);
const add=(s,r,date)=>({...s,sessions:[...s.sessions,{id:'s'+s.sessions.length,date,slot:0,block:'abc',items:[r]}]});
let checks=0,s=base();
for(const date of ['2026-09-01','2026-09-03']){const rx=E.prescription(s,'squat',{now:date});assert.equal(rx.mode,'volume');s=add(s,record(rx),date);checks++;}
assert.equal(E.stateFor(s,'squat').stage,1);checks++;
const priorStage=E.stateFor(s,'squat').stage;
let rx=E.prescription(s,'squat',{now:'2026-11-09'});
assert.equal(rx.mode,'reentry');assert.ok(rx.sets<E.stateFor(s,'squat').sets);checks+=2;
let r=record(rx);assert.equal(r.completed,false);assert.equal(r.performed,true);checks+=2;
s=add(s,r,'2026-11-09');assert.equal(E.stateFor(s,'squat').stage,priorStage);checks++;
rx=E.prescription(s,'squat',{now:'2026-11-11'});assert.equal(rx.mode,'volume');checks++;
s=add(s,record(rx),'2026-11-11');assert.equal(E.stateFor(s,'squat').stage,priorStage);checks++;
rx=E.prescription(s,'squat',{now:'2026-11-13'});s=add(s,record(rx),'2026-11-13');assert.equal(E.stateFor(s,'squat').stage,priorStage+1);checks++;
let low=E.prescription(s,'squat',{now:'2026-11-15',readiness:'low'});assert.equal(low.mode,'recovery');assert.equal(record(low).completed,false);checks+=2;
const held=add(s,E.completeRecord(low,[{done:true,weight:16,reps:low.reps}], 'pain',true),'2026-11-15');
assert.ok(E.stateFor(held,'squat').hold);checks++;
const reviewed=E.resolvePain(held,'squat');assert.equal(E.prescription(reviewed,'squat',{now:'2026-11-17'}).mode,'reentry');checks++;
console.log('PASS '+checks+' long-break and recovery invariants');
