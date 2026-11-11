/* 52-week deterministic programming simulation. Run: node tests/year-simulation.js */
'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js');
const profiles=[['strength3',3,'strength','moderate',true,true,true],['strength4',4,'strength','high',true,true,true],['balanced3',3,'balanced','moderate',true,true,true],['capacity5',5,'capacity','high',true,true,true],['skill4',4,'skill','high',true,true,true],['kb3',3,'balanced','consistent',true,false,false],['club3',3,'balanced','moderate',false,true,false],['body3',3,'balanced','high',false,false,true]];
let total=0;
for(const [name,days,focus,variety,kb,club,bw] of profiles){
 const state={version:33,defaultMinutes:30,programBlock:'abc',sessions:[],weights:{squat:16,press:12,row:16,swing:16,cast:10,carry:16,clean:12,front:10,circles:10,deadlift:16},equipment:{kb:[12,16],club:[10],pairs:[]},nextWeights:{},skills:{swing:true,clean:true,rack:true,overhead:true,clubGrip:true,clubTwoHandFoundation:true,hingePattern:true,bearSquat:true,pushupTechnique:true},trainingPreferences:{daysPerWeek:days,useKb:kb,useClub:club,useBodyweight:bw,useDoubleKb:false,useTwoHandClub:true,focus,variety,conditioning:true,skillSessions:true}};
 let workouts=0,light=0,credits=0;
 for(let i=0;i<364;i++){
  const weekday=i%7,scheduled=days===3?[0,2,4].includes(weekday):days===4?[0,1,3,5].includes(weekday):weekday<5;
  if(!scheduled)continue;
  const date=new Date(Date.UTC(2026,0,5+i)).toISOString().slice(0,10);
  const p=E.plan(state,{now:date,minutes:30});
  assert.equal(p.restDay,false,name+' unexpected rest '+date);
  assert.ok(p.items.length,name+' empty workout '+date);
  assert.ok(p.estimated<=p.cap+1,name+' exceeds budget '+date);
  const items=p.items.map(rx=>{
   assert.ok(rx.sets>=1&&rx.reps>=1&&rx.weight>=0,name+' invalid prescription '+date+' '+rx.id);
   const weight=E.MOVES[rx.id].bodyweight?0:rx.weight||12;
   const actual=Array.from({length:rx.sets},()=>({done:true,weight,reps:rx.reps,leftReps:rx.reps,rightReps:rx.reps,bothSides:true,timingValid:true,continuous:true}));
   const result=E.completeRecord(rx,actual,'clean',false);
   assert.equal(result.performed,true,name+' clean workout not recorded '+date+' '+rx.id);
   if(rx.mode==='light'){light++;assert.equal(result.completed,false,name+' light day credited');}
   if(result.completed)credits++;
   return result;
  });
  state.sessions.push({id:'sim'+i,title:p.day.name,date,slot:p.slot,block:p.block,items,notebookVersion:1,calendarVersion:1});
  workouts++;
 }
 total+=workouts;
 console.log('PASS',name,{workouts,light,credits});
}
assert.equal(total,1456);
console.log('PASS 52-week simulation:',total,'workouts, 8 profiles');

 // Interrupted 12-week history: missed days and easy mobility do not earn
 // strength progression. Actual strength sessions still follow the engine.
{
 const state={version:33,defaultMinutes:30,programBlock:'abc',sessions:[],activities:[],
  weights:{squat:16,press:12,row:16,swing:16,cast:10,carry:16,clean:12,front:10,circles:10,deadlift:16},
  equipment:{kb:[12,16],club:[10],pairs:[]},nextWeights:{},
  skills:{swing:true,clean:true,rack:true,overhead:true,clubGrip:true,clubTwoHandFoundation:true,hingePattern:true,bearSquat:true,pushupTechnique:true},
  trainingPreferences:{daysPerWeek:3,useKb:true,useClub:true,useBodyweight:true,useDoubleKb:false,useTwoHandClub:true,focus:'balanced',variety:'high',conditioning:true,skillSessions:true}};
 let completed=0,mobility=0,missed=0;
 for(let i=0;i<84;i++){
  if(![0,2,4].includes(i%7))continue;
  const date=new Date(Date.UTC(2026,0,5+i)).toISOString().slice(0,10);
  const slot=i%12;
  if(slot===2||slot===8){
   state.activities.push({id:'mob'+i,date,type:'mobility',duration:20,effort:'easy',status:'completed',replacesStrength:true});
   mobility++;
   continue;
  }
  if(slot===4){missed++;continue;}
  const p=E.plan(state,{now:date,minutes:30});
  assert.ok(p.items.length,'interrupted history empty workout '+date);
  assert.ok(p.estimated<=p.cap+1,'interrupted history exceeds budget '+date);
  const items=p.items.map(rx=>{
   const weight=E.MOVES[rx.id].bodyweight?0:rx.weight||12;
   const actual=Array.from({length:rx.sets},()=>({done:true,weight,reps:rx.reps,leftReps:rx.reps,rightReps:rx.reps,bothSides:true,timingValid:true,continuous:true}));
   return E.completeRecord(rx,actual,'clean',false);
  });
  state.sessions.push({id:'interrupted'+i,title:p.day.name,date,slot:p.slot,block:p.block,items,notebookVersion:1,calendarVersion:1});
  completed++;
 }
 assert.ok(completed>0&&mobility>0&&missed>0,'interruption scenarios must all occur');
 assert.equal(state.sessions.length,completed,'mobility and missed days cannot create strength sessions');
 assert.equal(state.activities.length,mobility,'mobility remains separate from strength progression');
 const next=E.plan(state,{now:'2026-04-01',minutes:30});
 assert.ok(next.items.length,'training should resume after interruptions');
 assert.ok(next.estimated<=next.cap+1,'return workout exceeds budget');
 console.log('PASS interrupted 12-week simulation',{completed,mobility,missed});
}
