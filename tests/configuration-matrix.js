/* Equipment and settings matrix. Run: node tests/configuration-matrix.js */
'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js');
const gears=[[true,false,false],[false,true,false],[false,false,true],[true,true,false],[true,false,true],[false,true,true],[true,true,true]];
const skills={swing:true,clean:true,rack:true,overhead:true,clubGrip:true,clubTwoHandFoundation:true,hingePattern:true,bearSquat:true,pushupTechnique:true};
let cases=0;
for(const [kb,club,bw] of gears)for(const focus of ['strength','balanced','capacity','skill'])for(const variety of ['consistent','moderate','high'])for(const days of [2,3,4,5,7]){
 const state={version:33,defaultMinutes:30,programBlock:'abc',sessions:[],weights:{squat:16,press:12,row:16,swing:16,cast:10,carry:16,clean:12,front:10,circles:10},equipment:{kb:[12,16],club:[10],pairs:[]},nextWeights:{},skills,trainingPreferences:{daysPerWeek:days,useKb:kb,useClub:club,useBodyweight:bw,useDoubleKb:false,useTwoHandClub:true,focus,variety,conditioning:true,skillSessions:true}};
 const before=JSON.stringify(state);
 const p=E.plan(state,{now:'2026-11-09'});
 assert.equal(JSON.stringify(state),before,'planning mutated configuration '+JSON.stringify({kb,club,bw,focus,variety,days}));
 assert.ok(p.items.length,'empty workout '+JSON.stringify({kb,club,bw,focus,variety,days}));
 assert.ok(p.estimated<=p.cap+1,'budget exceeded');
 for(const rx of p.items){
  const gear=E.MOVES[rx.id].gear;
  if(gear==='kb'||gear==='club'){
   assert.ok(Number.isFinite(rx.weight)&&rx.weight>0,'invalid prescribed load '+rx.id);
   const owned=gear==='kb'?state.equipment.kb:state.equipment.club;
   assert.ok(owned.includes(rx.weight),'unowned prescribed load '+rx.id+': '+rx.weight);
  }
  assert.ok(gear!=='kb'||kb,'KB prescribed while disabled');
  assert.ok(gear!=='club'||club,'club prescribed while disabled');
  assert.ok(gear!=='bodyweight'||bw,'bodyweight prescribed while disabled');
  assert.ok(!['prerequisite','review'].includes(rx.mode),'unready movement prescribed');
 }
 cases++;
}
console.log('PASS',cases,'configuration combinations');
let beginnerCases=0,empty=0;
for(const [kb,club,bw] of [[true,false,false],[false,true,false],[false,false,true],[true,true,true]])for(const skillMode of [0,1,2])for(const focus of ['strength','balanced','capacity','skill'])for(const day of [0,1,2]){
 const selectedSkills=skillMode===0?{}:skillMode===1?{hingePattern:true,clubGrip:true,bearSquat:true}:skills;
 const s={version:33,defaultMinutes:30,programBlock:'abc',sessions:[],weights:{squat:16,press:12,row:16,swing:16,cast:10,carry:16,clean:12,front:10,circles:10},equipment:{kb:[12,16],club:[10],pairs:[]},nextWeights:{},skills:selectedSkills,trainingPreferences:{daysPerWeek:3,useKb:kb,useClub:club,useBodyweight:bw,useTwoHandClub:true,focus,variety:'moderate'}};
 const date=new Date(Date.UTC(2026,10,9+day)).toISOString().slice(0,10);
 const p=E.plan(s,{now:date});if(!p.items.length){empty++;assert.ok((p.requirements||[]).length,'empty workout without prerequisite guidance');}
 beginnerCases++;
}
assert.equal(empty,12);
console.log('PASS',beginnerCases,'beginner combinations;',empty,'correctly blocked pending prerequisites');

let durationCases=0;
for(const minutes of [25,30,35,45,60,75,90,120])for(const [kb,club,bw] of gears){
 const state={version:33,defaultMinutes:minutes,programBlock:'abc',sessions:[],weights:{squat:16,press:12,row:16,swing:16,cast:10,carry:16,clean:12,front:10,circles:10},equipment:{kb:[12,16],club:[10],pairs:[]},nextWeights:{},skills,trainingPreferences:{daysPerWeek:3,useKb:kb,useClub:club,useBodyweight:bw,useDoubleKb:false,useTwoHandClub:true,focus:'balanced',variety:'moderate'}};
 const before=JSON.stringify(state),p=E.plan(state,{now:'2026-11-09',minutes});
 assert.equal(JSON.stringify(state),before,'duration planning mutated state');
 assert.equal(p.budget.total,minutes,'requested duration ignored');
 assert.ok(p.estimated<=p.cap+1,'duration cap exceeded: '+minutes);
 for(const rx of p.items)if(['kb','club'].includes(E.MOVES[rx.id].gear)){
  const owned=E.MOVES[rx.id].gear==='kb'?state.equipment.kb:state.equipment.club;
  assert.ok(owned.includes(rx.weight),'unowned load for '+minutes+' minutes: '+rx.id);
 }
 durationCases++;
}
console.log('PASS',durationCases,'duration/equipment combinations');
