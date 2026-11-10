/* End-to-end snatch volume -> density -> load transition test.
   This validates implemented behavior, not independent transcript accuracy. */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
const id='snatch';
let state={sessions:[],weights:{snatch:16},equipment:{kb:[16,18,20]},programming:{snatch:{profile:'snatch',exposures:2}},skills:{}};
const policy=E.policyFor(id,state);
let day=0;
function complete(){
 const st=E.stateFor(state,id);
 const target=st.stagePhase==='density'?policy.density[st.stage]:policy.stages[st.stage];
 const date=new Date(Date.UTC(2026,0,1+day++ )).toISOString().slice(0,10);
 const item={id,weight:st.weight,bodyweight:false,quality:'clean',pain:false,completed:true,performed:true,mode:st.stagePhase,
 actualSets:target.sets,actualReps:target.reps,targetSets:target.sets,targetReps:target.reps,rest:target.rest??0,policyKey:policy.key,track:'base'};
 state={...state,sessions:[...state.sessions,{id:'s'+day,date,items:[item]}]};
}
assert.equal(E.stateFor(state,id).stage,0);
assert.throws(()=>E.chooseCycle(state,id,'density'),/Complete a clean cycle/);
for(let i=0;i<policy.stages.length;i++){
 for(let exposure=0;exposure<2;exposure++)complete();
 assert.equal(E.stateFor(state,id).stage,Math.min(i+1,policy.stages.length-1));
}
assert.equal(E.stateFor(state,id).phase,'ready','volume endpoint reached');
assert.ok(E.loadOptions(state,id).includes(18),'load choice available after clean volume endpoint');
assert.deepEqual(E.loadOptions({...state,equipment:{...state.equipment,maxKbKg:16}},id),[],'configured 16 kg ceiling blocks 18 kg');
assert.ok(E.loadOptions({...state,equipment:{...state.equipment,maxKbKg:18}},id).includes(18),'raising ceiling unlocks owned 18 kg bell');
assert.deepEqual(E.loadOptions({...state,equipment:{...state.equipment,kb:[],maxKbKg:32}},id),[],'empty owned inventory does not invent bells');
assert.throws(()=>E.validateProgramming({...state,equipment:{...state.equipment,maxKbKg:-2}}),/Invalid equipment ceiling/);
assert.throws(()=>E.validateProgramming({...state,equipment:{...state.equipment,maxClubLb:NaN}}),/Invalid equipment ceiling/);
// Matched-pair loads are per bell and require an explicitly recorded pair.
const doubleBase={sessions:[],weights:{doubleSquat:16},equipment:{kb:[16,18,20],club:[5,10],maxKbKg:20},programming:{doubleSquat:{profile:'grind',exposures:2}},skills:{}};
const doublePolicy=E.policyFor('doubleSquat',doubleBase);
let doubleState={...doubleBase,sessions:doublePolicy.stages.flatMap((target,i)=>[0,1].map((exposure)=>({id:'double-'+i+'-'+exposure,date:new Date(Date.UTC(2026,0,1+i*2+exposure)).toISOString().slice(0,10),items:[{id:'doubleSquat',weight:16,quality:'clean',pain:false,completed:true,performed:true,mode:'volume',actualSets:target.sets,actualReps:target.reps,targetSets:target.sets,targetReps:target.reps,rest:target.rest,policyKey:doublePolicy.key,track:'base'}]})))};
assert.equal(E.stateFor(doubleState,'doubleSquat').phase,'ready','matched pair movement completes volume');
assert.deepEqual(E.loadOptions(doubleState,'doubleSquat'),[],'single kettlebell inventory does not imply a matched pair');
doubleState={...doubleState,equipment:{...doubleState.equipment,pairs:[16,18]}};
assert.ok(E.loadOptions(doubleState,'doubleSquat').includes(18),'owned matched pair unlocks per-bell increase');
assert.ok(!E.loadOptions(doubleState,'doubleSquat').includes(20),'unowned 20 kg pair remains unavailable');
assert.deepEqual(E.loadOptions({...doubleState,equipment:{...doubleState.equipment,maxKbKg:16}},'doubleSquat'),[],'per-bell ceiling blocks double load');
// Removing equipment blocks future prescriptions, not historical training evidence.
const prior={sessions:[],weights:{snatch:16,doubleSquat:16,cast:10},equipment:{kb:[16,18],pairs:[16],club:[10,12],maxKbKg:18,maxClubLb:12},trainingPreferences:{useDoubleKb:true},skills:{}};
assert.doesNotMatch(E.prescription(prior,'snatch').reason,/not currently available/,'owned kettlebell is not blocked by equipment availability');
assert.equal(E.prescription({...prior,equipment:{...prior.equipment,kb:[18]}},'snatch').sets,0,'removed kettlebell blocks future prescription');
assert.deepEqual(E.availableWorkingLoads({...prior,equipment:{...prior.equipment,kb:[18]}},'snatch'),[18],'replacement loads exclude removed weight');
assert.deepEqual(E.availableWorkingLoads({...prior,equipment:{...prior.equipment,maxKbKg:14}},'snatch'),[],'replacement loads respect lowered ceiling');
assert.deepEqual(E.availableWorkingLoads({...prior,equipment:{...prior.equipment,pairs:[]}},'doubleSquat'),[],'replacement loads require actual matched pairs');

assert.equal(E.prescription({...prior,equipment:{...prior.equipment,maxKbKg:14}},'snatch').sets,0,'lowered kettlebell ceiling blocks future prescription');
assert.equal(E.prescription({...prior,equipment:{...prior.equipment,pairs:[]}},'doubleSquat').sets,0,'removed matched pair blocks future prescription');
assert.equal(E.prescription({...prior,equipment:{...prior.equipment,club:[12]}},'cast').sets,0,'removed club load blocks future prescription');
assert.equal(E.prescription({...prior,equipment:{...prior.equipment,maxClubLb:8}},'cast').sets,0,'lowered club ceiling blocks future prescription');
const replacementBase={...prior,equipment:{...prior.equipment,kb:[12,18],maxKbKg:18}};
const replaced=E.replaceUnavailableLoad(replacementBase,'snatch',12);
assert.equal(E.stateFor(replaced,'snatch').weight,12,'replacement load becomes working weight');
assert.equal(E.stateFor(replaced,'snatch').stage,0,'replacement restarts progression at first stage');
assert.equal(replaced.sessions.length,replacementBase.sessions.length,'replacement does not create a training session');
assert.throws(()=>E.replaceUnavailableLoad(replacementBase,'snatch',20),/currently available/,'cannot replace with unowned weight');
assert.throws(()=>E.replaceUnavailableLoad(prior,'snatch',18),/still available/,'cannot bypass normal progression with available working weight');
// Equipment changes after completed sessions must preserve immutable evidence.
const historicPolicy=E.policyFor('snatch',prior);
const historicTarget=historicPolicy.stages[0];
const historicSession={id:'historic-1',date:'2026-10-01',items:[{id:'snatch',weight:16,quality:'clean',pain:false,completed:true,performed:true,mode:'volume',actualSets:historicTarget.sets,actualReps:historicTarget.reps,targetSets:historicTarget.sets,targetReps:historicTarget.reps,rest:historicTarget.rest,policyKey:historicPolicy.key,track:'base'}]};
const historicBase={...prior,sessions:[historicSession],equipment:{...prior.equipment,kb:[12,18]}};
const historicSnapshot=JSON.stringify(historicBase.sessions);
const historicReplacement=E.replaceUnavailableLoad(historicBase,'snatch',12);
assert.equal(JSON.stringify(historicReplacement.sessions),historicSnapshot,'reassignment preserves recorded session evidence exactly');
assert.equal(E.stateFor(historicReplacement,'snatch').weight,12,'new weight takes effect despite earlier heavier session');
assert.equal(E.stateFor(historicReplacement,'snatch').stage,0,'earlier clean exposure does not carry over to new weight');
assert.equal(E.stateFor(historicReplacement,'snatch').streak,0,'earlier exposure streak does not carry over');
assert.equal(E.stateFor(historicBase,'snatch').weight,16,'original state remains unchanged');
assert.throws(()=>E.replaceUnavailableLoad({...historicBase,equipment:{...historicBase.equipment,kb:[12,16,18]}},'snatch',12),/still available/,'history does not enable unauthorized load change');
// Replacing lost matched pairs and club loads follows the same history-safe rule.
const pairHistory={...prior,weights:{...prior.weights,doubleSquat:16},sessions:[{id:'pair-history',date:'2026-10-02',items:[{id:'doubleSquat',weight:16,quality:'clean',pain:false,completed:true,performed:true,actualSets:1,actualReps:5,targetSets:1,targetReps:5,track:'base'}]}],equipment:{...prior.equipment,kb:[12,16,18],pairs:[12]}};
const pairSnapshot=JSON.stringify(pairHistory.sessions);
const pairReplaced=E.replaceUnavailableLoad(pairHistory,'doubleSquat',12);
assert.equal(E.stateFor(pairReplaced,'doubleSquat').weight,12,'matched-pair replacement changes per-bell working weight');
assert.equal(E.stateFor(pairReplaced,'doubleSquat').stage,0,'matched-pair replacement restarts progression');
assert.equal(JSON.stringify(pairReplaced.sessions),pairSnapshot,'matched-pair replacement preserves recorded workouts');
assert.throws(()=>E.replaceUnavailableLoad(pairHistory,'doubleSquat',18),/currently available/,'single owned bell does not qualify as matched pair');
const clubHistory={...prior,sessions:[{id:'club-history',date:'2026-10-03',items:[{id:'cast',weight:10,quality:'clean',pain:false,completed:true,performed:true,actualSets:1,actualReps:5,targetSets:1,targetReps:5,track:'base'}]}],equipment:{...prior.equipment,club:[5,12],maxClubLb:12}};
const clubSnapshot=JSON.stringify(clubHistory.sessions);
const clubReplaced=E.replaceUnavailableLoad(clubHistory,'cast',5);
assert.equal(E.stateFor(clubReplaced,'cast').weight,5,'club replacement changes working weight');
assert.equal(E.stateFor(clubReplaced,'cast').stage,0,'club replacement restarts progression');
assert.equal(JSON.stringify(clubReplaced.sessions),clubSnapshot,'club replacement preserves recorded workouts');
assert.throws(()=>E.replaceUnavailableLoad({...clubHistory,equipment:{...clubHistory.equipment,maxClubLb:4}},'cast',5),/currently available/,'club ceiling cannot be bypassed by replacement');
const backupWithCeilings={version:33,sessions:[],weights:{},equipment:{kb:[12,16,18],club:[5,10,17],maxKbKg:18,maxClubLb:17}};
const restored=E.validateBackup(backupWithCeilings);
assert.equal(restored.equipment.maxKbKg,18,'backup preserves kettlebell ceiling');
assert.equal(restored.equipment.maxClubLb,17,'backup preserves club ceiling');

const longBackupSessions=Array.from({length:540},(_,i)=>({
 id:'backup-session-'+i,title:'Backup history '+i,date:new Date(Date.UTC(2025,0,1+i)).toISOString().slice(0,10),
 items:[{id:'snatch',weight:16,actualSets:3,actualReps:5,targetSets:3,targetReps:5,rest:90,quality:'clean',completed:true,performed:true,pain:false}]
}));
const longBackup={...backupWithCeilings,sessions:longBackupSessions,
 equipment:{kb:[12,14,16,18],pairs:[12,14,16],club:[5,10,17],maxKbKg:18,maxClubLb:17},
 nextWeights:{snatch:12},weights:{snatch:16}};
const roundTrip=E.validateBackup(JSON.parse(JSON.stringify(longBackup)));
assert.equal(roundTrip.sessions.length,540,'long backup retains all sessions');
assert.equal(roundTrip.sessions[0].id,'backup-session-0','long backup retains first session');
assert.equal(roundTrip.sessions[539].id,'backup-session-539','long backup retains final session');
assert.deepEqual(roundTrip.equipment.pairs,[12,14,16],'backup retains matched pair inventory');
assert.equal(roundTrip.nextWeights.snatch,12,'backup retains pending replacement weight');
assert.equal(E.stateFor(roundTrip,'snatch').weight,12,'restored replacement is effective without erasing history');

const decadeSessions=Array.from({length:2600},(_,i)=>({
 id:'decade-'+i,title:'Long-term session '+i,
 date:new Date(Date.UTC(2020,0,1+i)).toISOString().slice(0,10),
 items:[{id:'snatch',weight:16,actualSets:3,actualReps:5,targetSets:3,targetReps:5,rest:90,quality:'clean',completed:true,performed:true,pain:false}]
}));
const decadeBackup={...longBackup,sessions:decadeSessions};
const decadeStart=Date.now();
const decadeRestored=E.validateBackup(JSON.parse(JSON.stringify(decadeBackup)));
const decadeElapsed=Date.now()-decadeStart;
assert.equal(decadeRestored.sessions.length,2600,'decade-scale backup retains every session');
assert.equal(decadeRestored.sessions[0].id,'decade-0','decade-scale backup retains oldest session');
assert.equal(decadeRestored.sessions.at(-1).id,'decade-2599','decade-scale backup retains newest session');
assert.equal(new Set(decadeRestored.sessions.map(x=>x.id)).size,2600,'decade-scale backup retains unique session identities');

assert.equal(decadeRestored.sessions[0].date,'2020-01-01','decade-scale history retains first date');
assert.equal(decadeRestored.sessions.at(-1).date,new Date(Date.UTC(2020,0,2600)).toISOString().slice(0,10),'decade-scale history retains final date');
assert.equal(decadeRestored.sessions[1300].items[0].weight,16,'decade-scale history retains middle workout load');
assert.equal(decadeRestored.equipment.maxKbKg,18,'decade-scale restore preserves equipment ceiling');
assert.deepEqual(decadeRestored.equipment.pairs,[12,14,16],'decade-scale restore preserves pair inventory');
assert.equal(E.stateFor(decadeRestored,'snatch').weight,12,'decade-scale restore retains active replacement load');

assert.ok(decadeElapsed<10000,'decade-scale backup validation exceeds ten-second regression budget: '+decadeElapsed+'ms');
console.log('2600-session backup validation completed in '+decadeElapsed+'ms');

const duplicateDecade={...decadeBackup,sessions:decadeSessions.map((entry,i)=>i===2599?{...entry,id:'decade-0'}:entry)};
assert.throws(()=>E.validateBackup(duplicateDecade),/Duplicate workout identity/,'decade-scale backup rejects duplicate session identity');
const corruptedDecade={...decadeBackup,sessions:decadeSessions.map((entry,i)=>i===1300?{...entry,items:[{...entry.items[0],weight:-1}]}:entry)};
assert.throws(()=>E.validateBackup(corruptedDecade),/Invalid movement record/,'decade-scale backup rejects corrupted mid-history movement');
const invalidDateDecade={...decadeBackup,sessions:decadeSessions.map((entry,i)=>i===2599?{...entry,date:'2026-02-30'}:entry)};
assert.throws(()=>E.validateBackup(invalidDateDecade),/Invalid training entry/,'decade-scale backup rejects impossible calendar date');
console.log('2600-session duplicate, corrupted-load and invalid-date rejection passed');



assert.doesNotThrow(()=>E.validateProgramming({...state,equipment:{kb:[16,18],club:[5,10],pairs:[16,18],maxKbKg:18,maxClubLb:17}}),'valid matched pairs accepted');
assert.throws(()=>E.validateProgramming({...state,equipment:{kb:[16,18],club:[5,10],pairs:[20],maxKbKg:18,maxClubLb:17}}),/Invalid matched kettlebell pairs/,'pair cannot exceed configured ceiling');
assert.throws(()=>E.validateProgramming({...state,equipment:{kb:[16],club:[5],pairs:['16'],maxKbKg:18,maxClubLb:17}}),/Invalid matched kettlebell pairs/,'pair weights must be numeric');
assert.throws(()=>E.validateBackup({...backupWithCeilings,equipment:{...backupWithCeilings.equipment,maxKbKg:0}}),/Invalid equipment ceiling/,'backup rejects invalid ceiling');
assert.throws(()=>E.validateBackup({...backupWithCeilings,equipment:{...backupWithCeilings.equipment,maxClubLb:Infinity}}),/Invalid equipment ceiling/,'backup rejects infinite ceiling');
assert.doesNotThrow(()=>E.validateBackup({...backupWithCeilings,equipment:{kb:[12,16],club:[5,10]}}),'legacy backup without ceilings remains compatible');
state=E.chooseCycle(state,id,'density');
assert.equal(E.stateFor(state,id).stagePhase,'density','density transition should activate explicitly');
assert.equal(E.stateFor(state,id).stage,0,'density begins at first density stage');
assert.equal(E.loadOptions(state,id).length,0,'cannot increase load in the middle of density');
for(let i=0;i<policy.density.length;i++){
 for(let exposure=0;exposure<2;exposure++)complete();
 assert.equal(E.stateFor(state,id).stage,Math.min(i+1,policy.density.length-1),'density stage '+i+' advances');
}
assert.equal(E.stateFor(state,id).phase,'ready','density endpoint reached');
assert.ok(E.loadOptions(state,id).includes(18),'post-density load selection available');
state=E.selectLoad(state,id,18);
assert.equal(E.stateFor(state,id).weight,18);
assert.equal(E.stateFor(state,id).stage,0,'new load starts volume again');
assert.equal(E.stateFor(state,id).stagePhase,'volume','new load must reset density to volume');
assert.equal(E.stateFor(state,id).phase,'volume','new load cannot inherit a completed-cycle milestone');
assert.equal(E.stateFor(state,id).streak,0);
assert.deepEqual(E.loadOptions(state,id),[],'cannot raise load again before rebuilding volume');
// Confirm that the heavier weight cannot inherit a previous clean-cycle completion.
assert.throws(()=>E.chooseCycle(state,id,'density'),/Complete a clean cycle/);
complete();
assert.equal(E.stateFor(state,id).stage,0,'one clean exposure at new weight is insufficient');
assert.equal(E.stateFor(state,id).streak,1,'first clean exposure at new weight is counted');
complete();
assert.equal(E.stateFor(state,id).stage,1,'second clean exposure advances the new load');
assert.deepEqual(E.loadOptions(state,id),[],'cannot raise load after only one completed stage');
// An interrupted return must not count as another clean advancement.
const interrupted=E.stateFor(state,id);
const pauseDate=new Date(Date.UTC(2026,0,1+day++)).toISOString().slice(0,10);
state={...state,sessions:[...state.sessions,{id:'s'+day,date:pauseDate,items:[{id,weight:interrupted.weight,quality:'clean',pain:false,completed:true,performed:true,mode:'reentry',actualSets:interrupted.sets,actualReps:interrupted.reps,targetSets:interrupted.sets,targetReps:interrupted.reps,rest:interrupted.rest,policyKey:policy.key,track:'base'}]}]};
assert.equal(E.stateFor(state,id).stage,1,'reentry does not advance a volume stage');
assert.equal(E.stateFor(state,id).streak,0,'reentry interrupts the advancement streak');
assert.deepEqual(E.loadOptions(state,id),[],'reentry cannot unlock a load increase');
// After reentry, the normal two-exposure gate must still apply.
complete();
assert.equal(E.stateFor(state,id).stage,1,'first post-reentry clean exposure must not advance');
assert.equal(E.stateFor(state,id).streak,1,'post-reentry streak restarts at one');
complete();
assert.equal(E.stateFor(state,id).stage,2,'second post-reentry clean exposure advances');
assert.equal(E.stateFor(state,id).streak,0,'advancement resets the streak');
assert.deepEqual(E.loadOptions(state,id),[],'partial rebuilt volume still cannot unlock weight');
assert.throws(()=>E.selectLoad(state,id,20),/available, permitted increment/,'cannot skip to a heavier weight during rebuild');
// Equipment ceiling: completion must not invent weights the user does not own.
const ceiling={...state,nextWeights:{...state.nextWeights,snatch:20},equipment:{...state.equipment,kb:[16,18,20]}};
assert.equal(E.stateFor(ceiling,id).weight,20,'test fixture is at the heaviest owned bell');
assert.deepEqual(E.loadOptions(ceiling,id),[],'no load beyond configured inventory');
assert.throws(()=>E.selectLoad(ceiling,id,22),/available, permitted increment/,'unowned bell cannot be selected');
// An empty explicitly configured inventory must never be treated as permission
// to offer generic catalog weights.
const noEquipment={...ceiling,equipment:{...ceiling.equipment,kb:[]}};
assert.deepEqual(E.loadOptions(noEquipment,id),[],'explicitly empty kettlebell inventory means no available load');
assert.throws(()=>E.selectLoad(noEquipment,id,22),/available, permitted increment/);
console.log('Full snatch volume-density-load cycle passed:',day,'sessions including reentry and equipment ceiling');
