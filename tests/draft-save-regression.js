/* App-level draft persistence regression. Run: node tests/draft-save-regression.js */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const part=src.slice(src.indexOf('function changed('),src.indexOf('\nfunction saveWorkout(',src.indexOf('function changed(')));
assert.ok(part.startsWith('function changed('),'draft edit functions found');
let checks=0;
for(const failed of [false,true]){
 let draft={notebookVersion:1,plan:{items:[{id:'swing',side:2}]},items:[{sets:[{weight:12,reps:10,leftReps:10,rightReps:10,done:false}]}]},writes=0,renders=0;
 const initial=JSON.stringify(draft);
 const run=new Function('draft','E','T','checkWriter','saveDraft','render','alert',part+';changed(0,0,"done",true);return draft;');
 draft=run(draft,{validWorkingWeight:()=>true},{logged:d=>{d.clock={running:true}}},()=>true,()=>{writes++;return !failed},()=>{renders++},()=>{});
 assert.equal(writes,1,'exactly one save per changed set');checks++;
 if(failed){assert.equal(JSON.stringify(draft),initial,'failed save restores entire draft');assert.equal(renders,0);}else{assert.equal(draft.items[0].sets[0].done,true);assert.equal(draft.items[0].sets[0].bothSides,true);assert.equal(renders,1);}
 checks+=3;
}
assert.ok(src.includes("if(!saveDraft()){draft=null;return;}render();"),'failed initial draft save is not presented as started');checks++;
console.log('PASS '+checks+' draft-persistence invariants');
// Execute the real save path with an immutable old-load draft and a legitimate
// newer load selection. The completed old target cannot consume that selection.
const E=require('../engine'),N=require('../notebook'),C=require('../rolling-calendar'),{fresh,actual}=require('./fixtures/core-window.cjs');
let state=fresh(60);state.programComposition.enabled=false;state.trainingPreferences.useBodyweight=false;state.trainingPreferences.useClub=false;state.equipment.kb.push(13);
let date;for(let i=0;i<40;i++){date=C.add('2026-01-05',Math.floor(i/3)*7+[0,2,4][i%3]);const rx=E.prescription(state,'press',{now:date}),plan={items:[rx]};state.sessions.push({id:'press-'+i,title:rx.name,date,block:'abc',items:N.records(plan,actual(plan))});if(E.stateFor(state,'press',{now:date}).phase==='ready')break;}
const workDate=C.add(date,3),plan=E.plan(state,{now:workDate}),written=JSON.stringify(plan),draft={id:'old-load-draft',date:workDate,started:workDate+'T12:00:00Z',stage:'work',calendarVersion:1,notebookVersion:1,plan,items:actual(plan),notes:''};
state=E.selectLoad(state,'press',13,{now:workDate});assert.equal(state.nextWeights.press,13);
const saveSource=src.slice(src.indexOf('function saveWorkout(){'),src.indexOf('\nfunction timeText(',src.indexOf('function saveWorkout(){')));
const runSave=new Function('state','draft','E','N','checkWriter','$','newIdentity','persistTraining','clearInterval','timerInterval','render','alert',"let historyView,correctionNotice,finishPanel,selectedWorkout,cyclePage,todayMinutes,readiness,tab;"+saveSource+';saveWorkout();return state;');
const saved=runSave(state,draft,E,N,()=>true,()=>null,()=> 'new-load-test',()=>true,()=>{},0,()=>{},message=>{throw Error(message);});
assert.equal(saved.nextWeights.press,13);assert.equal(saved.sessions.at(-1).items.find(x=>x.id==='press').weight,12);assert.equal(JSON.stringify(saved.sessions.at(-1).plan),written);assert.equal(E.stateFor(saved,'press',{now:workDate}).weight,13);assert.equal(E.stateFor(saved,'press',{now:workDate}).stage,0);E.validateBackup(saved);
console.log('PASS immutable old-load draft save preserves a newer earned load selection without awarding progress at that load');
const nextDate=C.add(workDate,3);saved.trainingPreferences.focus='skill';saved.deferredByBlock.abc=['press'];const nextPlan=E.plan(saved,{now:nextDate}),newDraft={id:'new-load-draft',date:nextDate,started:nextDate+'T12:00:00Z',stage:'work',calendarVersion:1,notebookVersion:1,plan:nextPlan,items:actual(nextPlan),notes:''};assert.equal(nextPlan.items.find(x=>x.id==='press').weight,13);
const consumed=runSave(saved,newDraft,E,N,()=>true,()=>null,()=> 'consumed-load-test',()=>true,()=>{},0,()=>{},message=>{throw Error(message);});assert.equal(consumed.nextWeights.press,undefined);assert.equal(E.stateFor(consumed,'press',{now:nextDate}).weight,13);assert.equal(E.stateFor(consumed,'press',{now:nextDate}).stage,0);assert.equal(E.stateFor(consumed,'press',{now:nextDate}).streak,1);
console.log('PASS a pending load is consumed only by genuine completed work at that selected load');
