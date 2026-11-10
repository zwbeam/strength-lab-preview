/* Five-year replay invariants: synthetic history, not clinical or training-outcome validation. */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
const DAY=86400000,start=Date.UTC(2022,0,1);
const dateAt=n=>new Date(start+n*DAY).toISOString().slice(0,10);
const id='swing',base={sessions:[],weights:{swing:16},nextWeights:{},skills:{},programming:{swing:{exposures:2}}};
const first=E.policyFor(id,base).stages[0];
const entry=(quality='clean',overrides={})=>({id,weight:16,bodyweight:false,quality,pain:false,completed:quality==='clean',performed:true,mode:'volume',actualSets:first.sets,actualReps:first.reps,targetSets:first.sets,targetReps:first.reps,rest:first.rest,policyKey:E.policyFor(id,base).key,track:'base',...overrides});
assert.equal(E.successful(entry('clean')),true);
for(const [name,patch] of [
 ['incomplete',{actualSets:first.sets-1}],['poor technique',{quality:'breakdown'}],['pain',{pain:true}],['recovery',{mode:'recovery',completed:false}],['missing load',{weight:0}],['not completed',{completed:false}]
])assert.equal(E.successful(entry('clean',patch)),false,name+' must not count as successful');
const recoveryEntry=entry('clean',{mode:'recovery'});
assert.equal(E.successful(recoveryEntry),true,'clean reduced session can be successful as a record');
assert.equal(E.stateFor({...base,sessions:[{id:'recovery-only',date:dateAt(0),items:[recoveryEntry]}]},id).stage,0,'recovery must not advance stage');

const painEntry=entry('pain',{pain:true,completed:false});
const painState=E.stateFor({...base,sessions:[{id:'pain-only',date:dateAt(0),items:[painEntry]}]},id);
assert.ok(painState.hold,'unresolved pain must hold movement');
assert.equal(painState.stage,0,'pain must not advance progression');
const partial=entry('clean',{actualSets:first.sets-1});
const partialState=E.stateFor({...base,sessions:[{id:'partial-only',date:dateAt(0),items:[partial]}]},id);
assert.equal(partialState.stage,0,'partial work must not advance progression');

let clean=0,hard=0,missed=0;
for(let day=0;day<1825;day++){
 const week=Math.floor(day/7),dow=day%7;
 if(week%13===12||![0,2,4].includes(dow))continue;
 const missing=day%37===0,difficult=day%29===0&&!missing;
 const item=entry(difficult?'hard':'clean',missing?{completed:false,performed:false,actualSets:0,quality:'minor'}:{});
 if(missing)missed++;else if(difficult)hard++;else clean++;
 base.sessions.push({id:'sim-'+day,date:dateAt(day),items:[item]});
 if(day%35===0){
  const st=E.stateFor(base,id);
  assert.ok(Number.isInteger(st.stage)&&st.stage>=0,'invalid stage at day '+day);
  assert.ok(Number.isFinite(st.sets)&&st.sets>0,'invalid sets at day '+day);
  const p=E.prescription(base,id,{now:dateAt(day)});
  assert.ok(p&&p.id===id&&p.sets>0,'invalid prescription at day '+day);
 }
}
assert.ok(base.sessions.length>500,'expected substantial history');
assert.equal(base.sessions.length,clean+hard+missed);
const end=E.stateFor(base,id);
assert.ok(Number.isInteger(end.stage)&&end.stage>=0);
console.log('Five-year synthetic replay passed:',JSON.stringify({sessions:base.sessions.length,clean,hard,missed,stage:end.stage}));
