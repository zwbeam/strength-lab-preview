'use strict';
const E=require('../../engine'),N=require('../../notebook'),C=require('../../rolling-calendar');
function fresh(minutes=60){return {version:33,defaultMinutes:minutes,programBlock:'abc',sessions:[],weights:{squat:12,press:12,row:12,swing:12,clean:12,carry:12,cast:5,front:5,circles:5},nextWeights:{},equipment:{kb:[12,16,20,24,28,32],pairs:[12,16],club:[5,10,15,17],rowBar:{available:true,heightCm:100}},skills:Object.fromEntries(Object.keys(E.SKILLS).map(k=>[k,true])),trainingPreferences:{daysPerWeek:3,useKb:true,useClub:true,useBodyweight:true,conditioning:false,skillSessions:false,variety:'consistent'},programComposition:{enabled:true,blocks:['abc','hingePractice','bodyweightPull'],coreBlock:'abc',continuity:true,minGapDays:1}};}
function actual(plan){return N.newItems(plan).map((item,i)=>({...item,sets:item.sets.map(set=>({...set,done:true,bothSides:true,leftReps:plan.items[i].durationScope==='total'?3:set.reps,rightReps:plan.items[i].durationScope==='total'?3:set.reps,continuous:true,timingValid:true}))}));}
function receipt(state,block,date,{selected=true,...opts}={}){
 const input=structuredClone(state);if(selected){input.programComposition.enabled=false;input.programBlock=block;}
 const plan=E.plan(input,{now:date,...opts});if(!plan.items.length)throw Error('Fixture has no real work: '+date);
 const items=N.records(plan,actual(plan));state.sessions.push({id:'window-'+state.sessions.length,title:plan.day.name,date,block:plan.block,slot:plan.slot,calendarVersion:1,plan,items});
 state.deferredByBlock={...state.deferredByBlock,[plan.block]:E.deferredAfter(plan,items)};return plan;
}
// Genuine user-selected block receipts, not a claim that coordination produced
// this history. Useful for imported history and changed goals/program choices.
function history(end='2026-02-18',minutes=60,reverse=false){
 const state=fresh(minutes),start=C.add(end,-44);
 for(const day of [0,2,4,7,9,11,14,16,18,21,23,25])receipt(state,reverse?'hingePractice':'abc',C.add(start,day));
 for(const [i,day] of [30,32,34,37,39,41].entries())receipt(state,reverse&&i%3!==2?'abc':'hingePractice',C.add(start,day));
 return state;
}
module.exports={E,N,C,fresh,actual,receipt,history};
