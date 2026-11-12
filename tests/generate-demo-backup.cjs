/* Generate a separate synthetic two-year training backup. Never merge with real data.
 * node tests/generate-demo-backup.cjs [output.json]
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const E=require('../engine.js');
const ids=['swing','squat','press','row','clean','cast'];
const weights={swing:16,squat:16,press:12,row:16,clean:12,cast:10};
const state={version:33,defaultMinutes:45,equipment:{kb:[12,14,16,18,20,22,24,26,28,30,32],club:[5,7.5,10,12.5,15,17.5,20],pairs:[]},weights,nextWeights:{},skills:{},programming:Object.fromEntries(ids.map(id=>[id,id==='swing'?{profile:'wave',lightWeight:12,heavyWeight:16,exposures:2}:{exposures:2}])),sessions:[],workoutDraft:null};
const DAY=86400000,start=Date.UTC(2024,10,12);
const stageChanges=Object.fromEntries(ids.map(id=>[id,0]));
const stageBefore=Object.fromEntries(ids.map(id=>[id,0]));
const checkpoints=[];
const movementCounts=Object.fromEntries(ids.map(id=>[id,{total:0,clean:0,hard:0,recovery:0,missed:0}]));
const swingTracks={heavy:0,light:0};
const swingEligibleTracks={heavy:0,light:0};
const dayString=n=>new Date(start+n*DAY).toISOString().slice(0,10);
let recovery=0,hard=0,missed=0,clean=0;
for(let day=0;day<730;day++){
 const week=Math.floor(day/7),dow=day%7;
 if(week%17===16||![0,2,4].includes(dow))continue;
 const workoutIds=[0,1,2].map(offset=>ids[(week+Math.floor(dow/2)+offset*2)%ids.length]);
 const items=[];
 const isMissed=day%41===0,isHard=!isMissed&&day%29===0,isRecovery=!isMissed&&!isHard&&day%23===0;
 const good=!isMissed&&!isHard&&!isRecovery;
 for(const id of workoutIds){
  const policy=E.policyFor(id,state),st=E.stateFor(state,id);
  if(st.stage!==stageBefore[id]){stageChanges[id]++;stageBefore[id]=st.stage;}
  if(id==='swing')swingTracks[st.track]=(swingTracks[st.track]||0)+1;
  const target={sets:st.sets,reps:st.reps,rest:st.rest};
  const item={id,weight:st.weight,bodyweight:false,quality:isHard?'hard':'clean',pain:false,completed:good,performed:!isMissed,mode:isRecovery?'recovery':'volume',actualSets:isMissed?0:isHard?Math.max(0,target.sets-1):target.sets,actualReps:target.reps,targetSets:target.sets,targetReps:target.reps,rest:target.rest,policyKey:policy.key,track:st.track||'base',note:'SYNTHETIC ENGINE DEMO — NOT ACTUAL TRAINING'};
  items.push(item);
  movementCounts[id].total++;
  movementCounts[id][isMissed?'missed':isHard?'hard':isRecovery?'recovery':'clean']++;
  if(id==='swing'&&E.successful(item))swingEligibleTracks[st.track]++;
 }
 state.sessions.push({id:'engine-demo-'+day,title:'DEMO · '+(good?'Progression':isRecovery?'Recovery':isHard?'Hard':'Missed')+' · '+workoutIds.join(' / '),date:dayString(day),block:'abc',items,finishOutcome:isMissed?'partial':'complete',status:'Synthetic demonstration',notes:'Synthetic training data. Do not mix with real workouts.'});
 if(good)clean++;else if(isMissed)missed++;else if(isHard)hard++;else recovery++;
 if(state.sessions.length%25===0)checkpoints.push({session:state.sessions.length,date:dayString(day),movements:Object.fromEntries(ids.map(move=>{const progress=E.stateFor(state,move);return [move,{stage:progress.stage,weight:progress.weight,exposures:progress.allExposures}];}))});
}
// Capture the final post-workout state, including the last exposure's progression.
for(const id of ids){
 const finalStage=E.stateFor(state,id).stage;
 if(finalStage!==stageBefore[id]){stageChanges[id]++;stageBefore[id]=finalStage;}
}
checkpoints.push({session:state.sessions.length,date:state.sessions.at(-1).date,movements:Object.fromEntries(ids.map(move=>{const progress=E.stateFor(state,move);return [move,{stage:progress.stage,weight:progress.weight,exposures:progress.allExposures,track:progress.track}];}))});
assert.ok(state.sessions.length>250,'Expected substantial two-year history');
assert.ok(state.sessions.every(session=>session.items.length===3),'Each demo workout must have three distinct movements');
assert.ok(state.sessions.every(session=>new Set(session.items.map(item=>item.id)).size===3),'Duplicate movement in demo workout');
for(const id of ids){
 assert.ok(movementCounts[id].total>=100,'Insufficient history for '+id);
 assert.ok(movementCounts[id].clean>=75,'Insufficient qualifying training for '+id);
}
assert.equal(Object.values(movementCounts).reduce((sum,x)=>sum+x.total,0),state.sessions.length*3,'Movement count mismatch');
const checked=E.validateBackup(state);
assert.ok(clean>200,'Demo needs enough clean progression exposures');
assert.ok(hard>0&&missed>0&&recovery>0,'Demo must show all outcome types');
assert.ok(swingTracks.heavy>0&&swingTracks.light>0,'Wave demo must alternate heavy and light exposures');
assert.ok(swingEligibleTracks.heavy>0&&swingEligibleTracks.light>0,'Wave demo must contain qualifying work on both tracks');
const swingSequence=checked.sessions.flatMap(session=>session.items.filter(item=>item.id==='swing').map(item=>({date:session.date,track:item.track,quality:item.quality})));
const swingTransitions=swingSequence.slice(1).reduce((count,item,index)=>count+(item.track!==swingSequence[index].track?1:0),0);
assert.ok(swingTransitions>=8,'Wave demo must demonstrate repeated heavy/light alternation, not just both tracks');
assert.ok(ids.filter(id=>stageChanges[id]>0).length>=4,'Demo must show stage changes across multiple movements');
assert.equal(checked.sessions.length,state.sessions.length);
for(const id of ids){
 const original=E.stateFor(state,id),restored=E.stateFor(checked,id);
 for(const field of ['stage','weight','sets','reps','rest','track','phase','cycles','streak'])
  assert.deepEqual(restored[field],original[field],'Backup replay changed '+id+' '+field);
 const expected=movementCounts[id].total;
 assert.equal(E.records(checked,id).length,expected,'Restored history count mismatch for '+id);
}
const lastCheckpoint=checkpoints.at(-1);
for(const id of ids){
 const current=E.stateFor(checked,id),snapshot=lastCheckpoint.movements[id];
 for(const field of ['stage','weight','track'])
  assert.deepEqual(snapshot[field],current[field],'Progression report disagrees with restored '+id+' '+field);
 assert.equal(snapshot.exposures,current.allExposures,'Exposure report mismatch for '+id);
}
for(const id of ids){const p=E.stateFor(checked,id);assert.ok(Number.isFinite(p.weight)&&p.stage>=0,'Invalid replay for '+id);}
const file=path.resolve(process.argv[2]||'strength-lab-engine-demo-backup.json');
const reportFile=file.replace(/\.json$/,'-progression-report.json');
fs.writeFileSync(reportFile,JSON.stringify({sessions:checked.sessions.length,clean,hard,recovery,missed,stageChanges,swingTracks,swingEligibleTracks,swingTransitions,movementCounts,checkpoints},null,2)+'\n');
fs.writeFileSync(file,JSON.stringify(checked,null,2)+'\n');
console.log(JSON.stringify({file,reportFile,sessions:checked.sessions.length,clean,hard,recovery,missed,stageChanges,swingTracks,swingEligibleTracks,movementCounts,ids}));
