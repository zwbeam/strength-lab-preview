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
console.log('Full snatch volume-density-load cycle passed:',day,'sessions including reentry');
