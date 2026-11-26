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
// A written method snapshot must remain loggable after current programming changes.
const oldState=fresh(60);oldState.programComposition.enabled=false;oldState.programBlock='abc';oldState.trainingPreferences.focus='skill';oldState.trainingPreferences.useBodyweight=false;oldState.trainingPreferences.useClub=false;
const methodDate='2026-01-05',oldPlan=E.plan(oldState,{now:methodDate}),oldDraft={id:'old-method-draft',date:methodDate,started:methodDate+'T12:00:00Z',stage:'work',calendarVersion:1,notebookVersion:1,plan:oldPlan,items:actual(oldPlan),notes:''};
const changedMethod=E.configureMovement(oldState,'press',{profile:'wave',lightWeight:12,heavyWeight:16});
const methodBefore=JSON.stringify(oldDraft),newKey=E.policyFor('press',changedMethod).key;
E.validateDraft(oldDraft,changedMethod);E.validateBackup({...changedMethod,workoutDraft:oldDraft});
const methodSaved=runSave(changedMethod,oldDraft,E,N,()=>true,()=>null,()=> 'old-method-save',()=>true,()=>{},0,()=>{},message=>{throw Error(message);});
assert.equal(JSON.stringify(oldDraft),methodBefore);assert.equal(methodSaved.sessions.at(-1).items.find(x=>x.id==='press').policyKey,'legacy-v1');assert.equal(E.policyFor('press',methodSaved).key,newKey);assert.equal(E.stateFor(methodSaved,'press',{now:methodDate}).stage,0);assert.equal(E.stateFor(methodSaved,'press',{now:methodDate}).streak,0);E.validateBackup(methodSaved);
console.log('PASS original method draft stays loggable without contributing credit to a newly selected wave method');
// Canonical identity decoding exercises every supported profile independently of
// admission. Synthetic schema objects here are never recorded as physical work.
const {fresh:allMoves,seed}=require('./movement-integration');let identities=0,getupSchema;
for(const id of Object.keys(E.MOVES))for(const profile of E.availableProfiles(id)){
 const s=allMoves();s.equipment.rowBar={available:true,heightCm:100};s.equipment.stepPlatform={available:true,heightCm:15};
 const config={profile};if(profile==='wave')Object.assign(config,{lightWeight:12,heavyWeight:16,heavyReps:2,cycleRevision:2});if(profile==='rowWave')Object.assign(config,{cleanBaseline:10,baselineHeightCm:100,cycleRevision:2});if(profile==='pushup')Object.assign(config,{cleanBaseline:10,fraction:.5,step:2,cycleRevision:2});if(profile==='club')Object.assign(config,{startSets:1,endSets:8,restSeconds:120,seconds:45});if(profile==='getup')Object.assign(config,{weakSide:'right',stepSeconds:30});if(profile==='pairedSwingReps')config.cycleRevision=2;
 s.programming={[id]:config};const policy=E.policyFor(id,s),rx={...E.prescription(s,id,{now:methodDate}),sets:policy.stages[0].sets,reps:policy.stages[0].reps,rest:policy.stages[0].rest,profile,policyKey:policy.key,bodyweight:!!E.MOVES[id].bodyweight,continuous:policy.continuous,durationScope:policy.durationScope,roundSeconds:policy.roundSeconds};
 const p={day:{name:'Identity schema only'},items:[rx],cap:42,budget:E.timeBudget(60)},d={date:methodDate,started:methodDate+'T12:00:00Z',stage:'work',plan:p,items:N.newItems(p),notebookVersion:1};
 E.validateDraft(d,s);E.validateDraft(d,allMoves());if(id==='getup')getupSchema=structuredClone(d);const bad=structuredClone(d);bad.plan.items[0].policyKey='["unknown-method",1]';assert.throws(()=>E.validateDraft(bad,s));identities++;
}
assert.equal(identities,65);console.log('PASS 65 supported profile identities against original and changed/default configurations, custom nesting/revisions and unknown-identity rejection without physical records');
for(const [block,id,change] of [
 ['bodyweightPull','bodyweightRow',s=>{s.equipment.rowBar.heightCm=110;}],
 ['stepUpPractice','boxStepUp',s=>{s.equipment.stepPlatform={available:false,heightCm:20};}],
 ['doubleHinge','doubleDeadlift',s=>{s.equipment.pairs=[];}]
]){
 const s=allMoves();s.programBlock=block;s.defaultMinutes=60;s.equipment.rowBar={available:true,heightCm:100};s.equipment.stepPlatform={available:true,heightCm:15};
 for(const parent of E.MOVES[id].practicePrereqs||[])seed(s,parent,'2026-01-01');
 const p=E.plan(s,{now:methodDate}),d={id:'equipment-'+id,date:methodDate,started:methodDate+'T12:00:00Z',stage:'work',plan:p,items:actual(p),notebookVersion:1};assert.ok(p.items.some(x=>x.id===id));const snapshot=JSON.stringify(d);change(s);E.validateDraft(d,s);E.validateBackup({...s,workoutDraft:d});const saved=runSave(s,d,E,N,()=>true,()=>null,()=> 'equipment-save-'+id,()=>true,()=>{},0,()=>{},message=>{throw Error(message);});assert.equal(JSON.stringify(d),snapshot);E.validateBackup(saved);assert.ok(saved.sessions.at(-1).items.some(x=>x.id===id&&x.actualSets>0));
 if(E.MOVES[id].station){assert.equal(E.stateFor(saved,id,{now:methodDate}).streak,0);assert.equal(E.practiceEvidence(saved,id,{now:methodDate}).count,0);}else assert.equal(E.prescription(saved,id,{now:methodDate}).sets,0,'Unavailable pairs still block new training');
}
console.log('PASS row-height, unavailable platform and removed-pair changes preserve written actuals, backups and current eligibility/geometry gates');
// Earn a genuinely new method/load decision after writing the old method draft.
let newer=allMoves();newer.programBlock='abc';newer.defaultMinutes=60;newer.trainingPreferences.useKb=false;newer.trainingPreferences.useBodyweight=false;newer.trainingPreferences.focus='skill';newer.weights.cast=6;
const castPlan=E.plan(newer,{now:methodDate}),castDraft={id:'older-cast-method',date:methodDate,started:methodDate+'T12:00:00Z',stage:'work',notebookVersion:1,plan:castPlan,items:actual(castPlan)};assert.ok(castPlan.items.some(x=>x.id==='cast'&&x.weight===6));newer.equipment.club=[5];newer.equipment.clubPairs=[5];newer=E.replaceUnavailableLoad(newer,'cast',5,{now:methodDate});newer=E.configureMovement(newer,'cast',{profile:'club',startSets:2,endSets:2,exposures:1});
const later=C.add(methodDate,2),castRx=E.prescription(newer,'cast',{now:later}),castOnly={items:[castRx]};newer.sessions.push({id:'newer-method-earned',date:later,title:'Actual new method endpoint',items:N.records(castOnly,actual(castOnly))});assert.equal(E.advancementReview(newer,'cast',{now:later}).eligible,true);newer.equipment.club.push(6);newer=E.selectLoad(newer,'cast',6,{now:later});assert.equal(newer.nextWeights.cast,6);
const kept=runSave(newer,castDraft,E,N,()=>true,()=>null,()=> 'old-cast-save',()=>true,()=>{},0,()=>{},message=>{throw Error(message);});assert.equal(kept.nextWeights.cast,6,'Old method work at the same numeric weight must not consume the newer method decision');assert.equal(E.stateFor(kept,'cast',{now:later}).weight,6);assert.equal(E.stateFor(kept,'cast',{now:later}).streak,0);E.validateBackup(kept);
console.log('PASS an old method cannot consume an independently earned new-method load decision at the same numeric weight');

for(const [field,value] of [['profile','wave'],['continuous',true],['roundSeconds',60],['durationScope','total'],['timed',true]]){
 const bad=structuredClone(oldDraft),rx=bad.plan.items.find(x=>x.id==='press');rx[field]=value;assert.throws(()=>E.validateDraft(bad,changedMethod),'Reject mismatched written '+field);
}
console.log('PASS mismatched profile, continuous/round timing and duration-scope metadata fail closed');

const wrongGetupSide=structuredClone(getupSchema);wrongGetupSide.plan.items[0].weakSide='left';assert.throws(()=>E.validateDraft(wrongGetupSide,changedMethod));console.log('PASS get-up weak side must agree with its original captured cycle identity');
const historicalSession=methodSaved.sessions.at(-1),correction=N.historyDraft(historicalSession);correction.items.find(x=>x.id==='press').sets[0].done=false;
const correctedMethod=N.correct(methodSaved,historicalSession.id,correction);assert.equal(E.stateFor(correctedMethod,'press',{now:methodDate}).streak,0);assert.equal(E.stateFor(correctedMethod,'press',{now:methodDate}).stage,0);
const undoneMethod=N.undo(correctedMethod,historicalSession.id);assert.equal(E.stateFor(undoneMethod,'press',{now:methodDate}).streak,0);assert.equal(JSON.stringify(undoneMethod.sessions.at(-1).plan),JSON.stringify(oldPlan));E.validateBackup(undoneMethod);
console.log('PASS correction and undo of original-method actuals retain the immutable plan and cannot advance the current method');
// An older same-method receipt at the selected numeric load is still outside a
// later approved comparison boundary. It cannot consume that newer decision.
let dated=fresh(60);dated.programComposition.enabled=false;dated.trainingPreferences.focus='skill';dated.trainingPreferences.useBodyweight=false;dated.trainingPreferences.useClub=false;dated.equipment.kb.push(13);
const old13=E.prescription({...dated,weights:{...dated.weights,press:13}},'press',{now:'2026-01-01'}),oldRow=E.prescription(dated,'row',{now:'2026-01-01'}),oldDatedPlan={...E.plan(dated,{now:'2026-01-01'}),items:[old13,oldRow]};assert.equal(old13.weight,13);
const datedDraft={id:'older-same-method-load',date:'2026-01-01',started:'2026-01-01T12:00:00Z',stage:'work',notebookVersion:1,plan:oldDatedPlan,items:actual(oldDatedPlan)};let laterDate;
for(let i=0;i<30;i++){laterDate=C.add('2026-01-05',i*2);const rx=E.prescription(dated,'press',{now:laterDate}),p={items:[rx]};dated.sessions.push({id:'dated-cycle-'+i,title:'Actual twelve-kilogram cycle',date:laterDate,items:N.records(p,actual(p))});if(E.stateFor(dated,'press',{now:laterDate}).phase==='ready')break;}
dated=E.selectLoad(dated,'press',13,{now:laterDate});assert.equal(dated.nextWeights.press,13);
const datedSaved=runSave(dated,datedDraft,E,N,()=>true,()=>null,()=> 'old-dated-save',()=>true,()=>{},0,()=>{},message=>{throw Error(message);});assert.equal(datedSaved.nextWeights.press,13,'A receipt older than the approved comparison cannot consume its new load choice');assert.equal(E.stateFor(datedSaved,'press',{now:laterDate}).weight,13);assert.equal(E.stateFor(datedSaved,'press',{now:laterDate}).streak,0);E.validateBackup(datedSaved);
console.log('PASS same-method older actuals preserve a later approved load choice and cannot earn current comparison credit');
