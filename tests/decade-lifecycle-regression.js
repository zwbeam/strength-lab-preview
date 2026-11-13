/* Deterministic ten-year synthetic lifecycle. No personal workout data is used. */
'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js');
const day=n=>new Date(Date.UTC(2020,0,6+n*86400000/86400000)).toISOString().slice(0,10);
const scenarios=[
 {name:'lifelong-mixed',kb:true,club:true,bw:true,focus:'balanced',variety:'high'},
 {name:'kettlebell-only',kb:true,club:false,bw:false,focus:'strength',variety:'moderate'},
 {name:'club-bodyweight',kb:false,club:true,bw:true,focus:'skill',variety:'high'}
];
let total=0;
for(const scenario of scenarios){
 const state={version:33,defaultMinutes:45,programBlock:'abc',sessions:[],activities:[],weights:{squat:16,press:12,row:16,swing:16,cast:10,carry:16,clean:12,front:10,circles:10,deadlift:16},
 equipment:{kb:[12,14,16,18,20,22,24,26,28,30,32],club:[5,7,10,12,15,17],maxKbKg:32,maxClubLb:17,pairs:[]},nextWeights:{},
 skills:{swing:true,clean:true,rack:true,overhead:true,clubGrip:true,clubTwoHandFoundation:true,hingePattern:true,bearSquat:true,pushupTechnique:true},
 trainingPreferences:{daysPerWeek:3,useKb:scenario.kb,useClub:scenario.club,useBodyweight:scenario.bw,useDoubleKb:false,useTwoHandClub:true,focus:scenario.focus,variety:scenario.variety,conditioning:true,skillSessions:true}};
 let sessions=0,mobility=0,missed=0,hard=0,partial=0,clean=0,breaks=0,checks=0;
 for(let d=0;d<3650;d++){
  if(![0,2,4].includes(d%7))continue;
  const week=Math.floor(d/7);
  if(week%41===40||week%41===39){breaks++;continue;}
  if(week%11===10){missed++;continue;}
  const date=day(d);
  if(d%17===0){state.activities.push({id:scenario.name+'-mob-'+d,date,type:'mobility',duration:20,effort:'easy',status:'completed',replacesStrength:true});mobility++;continue;}
  const minutes=d%13===0?30:d%19===0?60:45;
  const readiness=d%29===0?'low':'normal';
  const before=state.sessions.length;
  const plan=E.plan(state,{now:date,minutes,readiness});
  assert.equal(state.sessions.length,before,'planning mutated history');
  assert.ok(plan.items.length,scenario.name+' empty plan '+date);
  assert.ok(plan.estimated<=plan.cap+1,scenario.name+' time budget '+date);
  const isHard=d%23===0,isPartial=!isHard&&d%31===0;
  const items=plan.items.map(rx=>{
   const gear=E.MOVES[rx.id].gear;
   assert.ok((gear==='kb'&&scenario.kb)||(gear==='club'&&scenario.club)||(gear==='bodyweight'&&scenario.bw),scenario.name+' disabled gear '+rx.id);
   if(gear==='kb'||gear==='club')assert.ok(state.equipment[gear].includes(rx.weight),scenario.name+' unowned load '+rx.id+': '+rx.weight);
   const weight=E.MOVES[rx.id].bodyweight?0:rx.weight;
   const sets=Array.from({length:rx.sets},(_,i)=>({done:!(isPartial&&i===rx.sets-1),weight,reps:rx.reps,leftReps:rx.reps,rightReps:rx.reps,bothSides:true,timingValid:true,continuous:true}));
   const result=E.completeRecord(rx,sets,isHard?'hard':'clean',false);
   assert.equal(result.performed,true,scenario.name+' record missing '+date);
   return result;
  });
  state.sessions.push({id:scenario.name+'-'+d,title:'Synthetic '+scenario.name,date,slot:plan.slot,block:plan.block,items,notebookVersion:1,calendarVersion:1});
  sessions++;if(isHard)hard++;else if(isPartial)partial++;else clean++;
  if(sessions%100===0){
   const restored=E.validateBackup(JSON.parse(JSON.stringify(state)));
   assert.equal(restored.sessions.length,state.sessions.length,'roundtrip session count');
   assert.equal(restored.activities.length,state.activities.length,'roundtrip activities');
   const after=E.plan(restored,{now:day(d+2),minutes:45});
   assert.ok(after.estimated<=after.cap+1,'restored plan budget');
   checks++;
  }
 }
 const restored=E.validateBackup(JSON.parse(JSON.stringify(state)));
 assert.equal(restored.sessions.length,sessions);
 assert.equal(restored.activities.length,mobility);
 assert.ok(sessions>900&&hard>0&&partial>0&&missed>0&&breaks>0&&mobility>0,scenario.name+' incomplete scenario coverage');
 const ids=new Set(restored.sessions.map(x=>x.id));assert.equal(ids.size,sessions,'duplicate session IDs');
 total+=sessions;
 console.log('PASS decade lifecycle '+JSON.stringify({scenario:scenario.name,sessions,mobility,missed,hard,partial,clean,breaks,backupCheckpoints:checks}));
}
assert.ok(total>2700);
console.log('PASS 10-year lifecycle total workouts '+total);
