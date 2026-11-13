/* Source-grounded additions, real plan/history replay, reference-only isolation. */
'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs');
const E=require('../engine.js'),I=require('../movement-instruction.js'),L=require('../learning.js').create(E,I);
const normalize=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let anchors=0;
for(const [id,entry] of Object.entries({...I.entries,...I.references})){
 for(const source of entry.sourceIds){assert.notEqual(source,441,'Unusable captions cannot become verified technique');const r=require('../sources-'+String(Math.floor(source/30)).padStart(2,'0')+'.json').find(x=>x.id===source);assert.equal(I.sources[source].url,r.url);assert.equal(I.sources[source].sha256,crypto.createHash('sha256').update(r.text.replace(/\s+/g,' ').trim()).digest('hex'));}
 for(const ev of entry.evidence){const r=require('../sources-'+String(Math.floor(ev.sourceId/30)).padStart(2,'0')+'.json').find(x=>x.id===ev.sourceId);assert.ok(normalize(r.text).includes(normalize(ev.quote)),id+': missing exact source anchor');anchors++;}
}
const fresh=()=>({version:33,defaultMinutes:45,programBlock:'bodyweightFoundations',sessions:[],weights:{doubleClean:12},equipment:{kb:[8,12,16],club:[],pairs:[12]},nextWeights:{},skills:{bodyweightSquat:true,stepBackLunge:true,doubleClean:true,rack:true},trainingPreferences:{daysPerWeek:3,useKb:true,useBodyweight:true,useClub:false,useDoubleKb:true}});
function log(s,p,mode='complete',date='2026-01-01'){
 const records=p.items.map((rx,i)=>{const sets=Array.from({length:rx.sets},(_,j)=>({done:mode!=='partial'||j===0,reps:rx.reps,weight:rx.weight,bothSides:true,...(rx.side===2?{leftReps:rx.reps,rightReps:rx.reps}:{})}));if(mode==='imbalance'&&rx.side===2)sets[0]={...sets[0],leftReps:1,rightReps:rx.reps};return E.completeRecord(rx,sets,mode==='technique'?'breakdown':'clean',mode==='pain'&&i===0);});
 s.sessions.push({id:'new-'+s.sessions.length,date,block:p.block,slot:p.slot,title:p.day.name,items:records});return records;
}
const s=fresh();
const first=E.plan(s,{now:'2026-01-01'});assert.deepEqual(first.items.map(x=>x.id),['bodyweightSquat','stepBackLunge']);assert.ok(first.items.every(x=>x.weight===0&&x.sourceParameters===null&&x.provenanceNote.includes('Strength Lab defaults')));
assert.ok(log(s,first).every(x=>x.completed));assert.ok(log(s,E.plan(s,{now:'2026-01-04'}),'complete','2026-01-04').every(x=>x.completed));assert.equal(E.prescription(s,'bodyweightSquat',{now:'2026-01-04'}).sets,3);
const target=E.prescription(s,'bodyweightSquat',{now:'2026-01-07'}).sets;const partial=log(s,E.plan(s,{now:'2026-01-07'}),'partial','2026-01-07');assert.ok(partial.every(x=>!x.completed));assert.equal(E.prescription(s,'bodyweightSquat',{now:'2026-01-07'}).sets,target);
const imbalance=log(s,E.plan(s,{now:'2026-01-10'}),'imbalance','2026-01-10');assert.equal(imbalance.find(x=>x.id==='stepBackLunge').completed,false);
const pain=log(s,E.plan(s,{now:'2026-01-13'}),'pain','2026-01-13');assert.ok(!pain[0].completed);assert.ok(!E.plan(s,{now:'2026-01-16'}).items.some(x=>x.id===pain[0].id));assert.equal(E.validateBackup(s).sessions.length,5);
const low=E.plan(fresh(),{now:'2026-01-01',readiness:'low'});assert.ok(log(fresh(),low).every(x=>!x.completed));
const missing=fresh();missing.skills={};assert.equal(E.plan(missing,{now:'2026-01-01'}).items.length,0);
const paired=fresh();paired.programBlock='doubleCleanPractice';let p=E.plan(paired,{now:'2026-01-01'});assert.equal(p.items[0].id,'doubleClean');assert.equal(p.items[0].sourceParameters,null);assert.equal(p.items[0].weight,12);assert.ok(log(paired,p).every(x=>x.completed));
assert.equal(E.plan({...paired,equipment:{...paired.equipment,pairs:[]}},{now:'2026-01-04'}).items.length,0);assert.equal(E.plan({...paired,trainingPreferences:{...paired.trainingPreferences,useDoubleKb:false}},{now:'2026-01-04'}).items.length,0);
assert.equal(E.plan({...paired,skills:{rack:true}},{now:'2026-01-04'}).items.length,0);
const disabled=fresh();disabled.learnedMovements={complexCleanPress:true};assert.ok(E.prerequisites(disabled,'complexCleanPress').some(x=>x==='practice:clean'));assert.equal(L.status(disabled,'complexCleanPress').eligible,false);
for(const id of Object.keys(I.references)){assert.equal(L.status(fresh(),id).key,'reference');assert.ok(L.instruction(id).steps.length);assert.ok(!E.MOVES[id]);assert.throws(()=>E.prescription(fresh(),id));assert.ok(L.browse().some(x=>x.id===id));}
assert.ok(L.relations('bearCrawl').educational.some(x=>x.to==='catCrawl'&&!x.gate));
console.log('PASS:',anchors,'source anchors/hashes; multiweek bodyweight progression/partial/imbalance/pain; paired clean equipment/skill gates; complex eligibility consistency; reference-only isolation');
