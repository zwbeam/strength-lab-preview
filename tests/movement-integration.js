'use strict';
const assert=require('node:assert/strict'),E=require('../engine'),N=require('../notebook'),L=require('../learning').create(E,require('../movement-instruction'));
const fresh=()=>({version:33,defaultMinutes:45,programBlock:'doubleClub',sessions:[],weights:Object.fromEntries(Object.entries(E.MOVES).map(([id,m])=>[id,m.bodyweight?0:m.gear==='club'?5:12])),nextWeights:{},equipment:{kb:[12],pairs:[12],club:[5,6,10],clubPairs:[5,6],maxClubLb:10},skills:Object.fromEntries(Object.keys(E.SKILLS).map(id=>[id,true])),trainingPreferences:{daysPerWeek:3,useKb:true,useClub:true,useBodyweight:true,useDoubleKb:true,useDoubleClub:true}});
function sets(rx,mode='clean'){return Array.from({length:rx.sets},(_,j)=>({done:mode!=='partial'||j===0,reps:rx.reps,weight:rx.weight,leftReps:rx.reps,rightReps:rx.reps,bothSides:true,continuous:true,timingValid:true,roundSeconds:rx.roundSeconds||0}));}
function seed(s,id,date='2026-01-01'){for(const p of E.MOVES[id].practicePrereqs||[])if(!E.practiceEvidence(s,p,{now:date}).ready)seed(s,p,date);for(let i=0;i<2;i++){const rx=E.prescription(s,id,{now:date});assert.ok(rx.sets>0,'Synthetic prerequisite history must be eligible: '+id);s.sessions.push({id:'seed-'+s.sessions.length,title:'Prior controlled practice',date,items:[E.completeRecord(rx,sets(rx),'clean',false)]});}}
const crypto=require('node:crypto');for(const evidence of require('../research/paired-pathway-evidence.json').sources){const source=require('../sources-'+String(Math.floor(evidence.sourceId/30)).padStart(2,'0')+'.json').find(x=>x.id===evidence.sourceId);assert.equal(evidence.url,source.url);assert.equal(evidence.sha256,crypto.createHash('sha256').update(source.text.replace(/\s+/g,' ').trim()).digest('hex'));assert.ok(source.text.toLowerCase().includes(evidence.quote.toLowerCase()));}
const s=fresh();seed(s,'clubInside');seed(s,'clubOutside');seed(s,'clubShield');
assert.equal(E.prescription({...s,equipment:{...s.equipment,clubPairs:[]}},'doubleClubSwingClean',{now:'2026-01-04'}).sets,0);
assert.equal(E.prescription({...s,trainingPreferences:{...s.trainingPreferences,useDoubleClub:false}},'doubleClubSwingClean',{now:'2026-01-04'}).sets,0);
assert.deepEqual(E.availableWorkingLoads(s,'doubleClubSwingClean'),[5,6]);assert.throws(()=>E.validateBackup({...s,equipment:{...s.equipment,clubPairs:[7]}}));
assert.equal(L.status(s,'doubleClubSwingClean',{now:'2026-01-04'}).eligible,true);
let p=E.plan(s,{now:'2026-01-04'});assert.equal(p.items.filter(x=>E.MOVES[x.id].clubPair).length,1);assert.equal(p.items.find(x=>E.MOVES[x.id].clubPair).id,'doubleClubSwingClean');assert.equal(p.items.find(x=>E.MOVES[x.id].clubPair).sourceParameters,null);
seed(s,'doubleClubSwingClean','2026-01-04');assert.ok(!E.prerequisites(s,'doubleClubPullover',{now:'2026-01-07'}).length);assert.ok(E.prerequisites({...s,skills:{...s.skills,doubleClubOverhead:false}},'doubleClubPullover',{now:'2026-01-07'}).includes('doubleClubOverhead'));
seed(s,'doubleClubPullover','2026-01-07');assert.ok(!E.prerequisites(s,'doubleClubTechnicalSwipe',{now:'2026-01-10'}).length);
const rx=E.prescription(s,'doubleClubTechnicalSwipe',{now:'2026-01-10'});assert.equal(rx.secondsPerSet,36);assert.equal(E.completeRecord(rx,sets(rx,'partial'),'clean',false).completed,false);assert.equal(E.completeRecord(rx,sets(rx),'breakdown',false).completed,false);assert.equal(E.completeRecord(rx,sets(rx),'clean',true).completed,false);
const low=E.prescription(s,'doubleClubTechnicalSwipe',{now:'2026-01-10',readiness:'low'});assert.equal(E.completeRecord(low,sets(low),'clean',false).completed,false);
assert.deepEqual(E.movementDemands('doubleClubTechnicalSwipe'),['lower','shoulder','grip']);
seed(s,'doubleClubSwingClean','2026-01-10');seed(s,'doubleClubSwingClean','2026-01-10');assert.deepEqual(E.loadOptions(s,'doubleClubSwingClean'),[6]);assert.ok(!E.loadOptions(s,'doubleClubSwingClean').includes(10));
assert.equal(E.validateBackup(JSON.parse(JSON.stringify(s))).sessions.length,s.sessions.length);
console.log('PASS double-club end-to-end plan, skills, actuals, workload, equipment, recovery and backup gates');
module.exports={fresh,sets,seed};
