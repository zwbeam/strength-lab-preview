/* Generate a separate synthetic two-year training backup. Never merge with real data.
 * node tests/generate-demo-backup.cjs [output.json]
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const E=require('../engine.js');
const ids=['swing','squat','press','row','clean','cast'];
const weights={swing:16,squat:16,press:12,row:16,clean:12,cast:10};
const state={version:33,defaultMinutes:45,equipment:{kb:[12,14,16,18,20,22,24,26,28,30,32],club:[5,7.5,10,12.5,15,17.5,20],pairs:[]},weights,nextWeights:{},skills:{},programming:Object.fromEntries(ids.map(id=>[id,{exposures:2}])),sessions:[],workoutDraft:null};
const DAY=86400000,start=Date.UTC(2024,10,12);
const stageChanges=Object.fromEntries(ids.map(id=>[id,0]));
const stageBefore=Object.fromEntries(ids.map(id=>[id,0]));
const checkpoints=[];
const dayString=n=>new Date(start+n*DAY).toISOString().slice(0,10);
let recovery=0,hard=0,missed=0,clean=0;
for(let day=0;day<730;day++){
 const week=Math.floor(day/7),dow=day%7;
 if(week%17===16||![0,2,4].includes(dow))continue;
 const id=ids[(week+Math.floor(dow/2))%ids.length],policy=E.policyFor(id,state),st=E.stateFor(state,id);
 const isMissed=day%41===0,isHard=!isMissed&&day%29===0,isRecovery=!isMissed&&!isHard&&day%23===0;
 if(st.stage!==stageBefore[id]){stageChanges[id]++;stageBefore[id]=st.stage;}
 const target={sets:st.sets,reps:st.reps,rest:st.rest};
 const good=!isMissed&&!isHard&&!isRecovery;
 const item={id,weight:st.weight,bodyweight:false,quality:isHard?'hard':'clean',pain:false,completed:good,performed:!isMissed,mode:isRecovery?'recovery':'volume',actualSets:isMissed?0:isHard?Math.max(0,target.sets-1):target.sets,actualReps:target.reps,targetSets:target.sets,targetReps:target.reps,rest:target.rest,policyKey:policy.key,track:'base',note:'SYNTHETIC ENGINE DEMO — NOT ACTUAL TRAINING'};
 state.sessions.push({id:'engine-demo-'+day,title:'DEMO · '+(good?'Progression':isRecovery?'Recovery':isHard?'Hard':'Missed')+' · '+id,date:dayString(day),block:'abc',items:[item],finishOutcome:isMissed?'partial':'complete',status:'Synthetic demonstration',notes:'Synthetic training data. Do not mix with real workouts.'});
 if(good)clean++;else if(isMissed)missed++;else if(isHard)hard++;else recovery++;
 if(state.sessions.length%25===0)checkpoints.push({session:state.sessions.length,date:dayString(day),movements:Object.fromEntries(ids.map(move=>{const progress=E.stateFor(state,move);return [move,{stage:progress.stage,weight:progress.weight,exposures:progress.allExposures}];}))});
}
assert.ok(state.sessions.length>250,'Expected substantial two-year history');
const checked=E.validateBackup(state);
assert.ok(clean>200,'Demo needs enough clean progression exposures');
assert.ok(hard>0&&missed>0&&recovery>0,'Demo must show all outcome types');
assert.ok(ids.filter(id=>stageChanges[id]>0).length>=4,'Demo must show stage changes across multiple movements');
assert.equal(checked.sessions.length,state.sessions.length);
for(const id of ids){const p=E.stateFor(checked,id);assert.ok(Number.isFinite(p.weight)&&p.stage>=0,'Invalid replay for '+id);}
const file=path.resolve(process.argv[2]||'strength-lab-engine-demo-backup.json');
const reportFile=file.replace(/\.json$/,'-progression-report.json');
fs.writeFileSync(reportFile,JSON.stringify({sessions:checked.sessions.length,clean,hard,recovery,missed,stageChanges,checkpoints},null,2)+'\n');
fs.writeFileSync(file,JSON.stringify(checked,null,2)+'\n');
console.log(JSON.stringify({file,reportFile,sessions:checked.sessions.length,clean,hard,recovery,missed,stageChanges,ids}));
