'use strict';
const assert=require('node:assert/strict'),E=require('../engine'),N=require('../notebook'),C=require('../rolling-calendar');
const date='2026-01-01';
function fresh(id){return{version:33,defaultMinutes:45,programBlock:id==='bodyweightRow'?'bodyweightPull':'stepUpPractice',sessions:[],weights:{},nextWeights:{},equipment:{kb:[],club:[],rowBar:{available:true,heightCm:100},stepPlatform:{available:true,heightCm:15}},skills:{bodyweightRow:true,boxStepUp:true,staticStepUp:true},trainingPreferences:{daysPerWeek:7,useKb:false,useClub:false,useBodyweight:true}};}
function actual(p){return N.newItems(p).map(x=>({...x,sets:x.sets.map(y=>({...y,done:true,bothSides:true,leftReps:y.reps,rightReps:y.reps}))}));}
function log(s,id,when,{light=false,change=()=>{}}={}){const rx=E.prescription(s,id,{now:when});if(light){rx.sets=1;rx.mode='light';}const p={...E.plan(s,{now:when}),items:[rx]},a=actual(p);change(a[0],rx);const row={id:'station-'+s.sessions.length,date:when,title:p.day.name,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items:N.records(p,a)};s.sessions.push(row);return row;}
let cases=0;
for(const id of ['bodyweightRow','boxStepUp','staticStepUp'])for(const field of ['height','pattern']){
 const s=fresh(id);log(s,id,date);const archive=JSON.stringify(s.sessions[0]),row=log(s,id,C.add(date,1),{light:true,change:(a,rx)=>a.sets.forEach(set=>{if(field==='height')set.stationHeightCm=rx.station.heightCm-5;else if(id==='bodyweightRow')set.legPosition='straight';else set.stepPattern=rx.station.stepPattern==='static'?'alternating':'static';})});
 assert.equal(row.items[0].performed,true,'Physical practice stays recorded');assert.equal(row.items[0].completed,false);assert.equal(row.items[0].setupChanged,true);
 assert.equal(E.stateFor(s,id).streak,0,'Changed-setup light work must interrupt clean progression');assert.equal(E.stateFor(s,id).fail,0,'Geometry edits do not manufacture technique failure');assert.equal(E.practiceEvidence(s,id,{now:C.add(date,1)}).count,0);
 log(s,id,C.add(date,3));assert.equal(E.stateFor(s,id).stage,0);assert.equal(E.stateFor(s,id).streak,1);
 const edit=N.historyDraft(row);for(const set of edit.items[0].sets){set.stationHeightCm=row.items[0].prescription.station.heightCm;if(id==='bodyweightRow')set.legPosition='bent';else set.stepPattern=row.items[0].prescription.station.stepPattern;}
 const corrected=N.correct(s,row.id,edit);assert.equal(E.stateFor(corrected,id).stage,1,'Restoring the original station restores valid neutral light evidence');assert.equal(corrected.sessions[1].items[0].completed,false,'Light work never receives ordinary credit');
 assert.equal(E.stateFor(N.undo(corrected,row.id),id).stage,0);assert.equal(JSON.stringify(s.sessions[0]),archive);assert.equal(JSON.stringify(corrected.sessions[1].items[0].prescription),JSON.stringify(row.items[0].prescription));
 const restored=E.validateBackup(JSON.parse(JSON.stringify(s)));assert.deepEqual(E.stateFor(restored,id),E.stateFor(s,id));
 assert.equal(E.stateFor(s,id,{now:date}).streak,1);assert.equal(E.stateFor(s,id,{now:C.add(date,10),evidenceThrough:date}).streak,1);
 const good=fresh(id);log(good,id,date);log(good,id,C.add(date,1),{light:true});assert.equal(E.stateFor(good,id).streak,1);log(good,id,C.add(date,3));assert.equal(E.stateFor(good,id).stage,1,'Clean same-station light practice still preserves the streak');
 const earned=fresh(id);for(let n=0;n<3;n++)log(earned,id,C.add(date,n*3));assert.equal(E.stateFor(earned,id).stage,1);assert.equal(E.stateFor(earned,id).streak,1);
 log(earned,id,C.add(date,7),{light:true,change:a=>a.sets.forEach(set=>set.stationHeightCm-=5)});assert.equal(E.stateFor(earned,id).stage,1,'Changed light geometry must retain an earned stage');assert.equal(E.stateFor(earned,id).streak,0);assert.equal(E.stateFor(earned,id).fail,0);assert.equal(E.practiceEvidence(earned,id,{now:C.add(date,7)}).ready,false);
 const snapshot=JSON.stringify(s);C.project(s,C.add(date,3),C.add(date,28));assert.equal(JSON.stringify(s),snapshot);cases++;
}
// Exercise a genuine automatically reduced consecutive-day row, without relabeling its prescription.
const generated=fresh('bodyweightRow');log(generated,'bodyweightRow',date);const p=E.plan(generated,{now:C.add(date,1)});assert.equal(p.items[0].mode,'light');const a=actual(p);a[0].sets.forEach(x=>x.stationHeightCm=90);generated.sessions.push({id:'actual-generated-light',date:C.add(date,1),title:p.day.name,plan:p,items:N.records(p,a)});assert.equal(E.stateFor(generated,'bodyweightRow').streak,0);
// Three-year actual row history: geometry edits interrupt comparison,
// while physical practice, drafts and older targets remain intact.
let trainee=fresh('bodyweightRow');trainee.programming={bodyweightRow:{profile:'bodyweightPractice',exposures:6}};let saved=0,lights=0,changed=0,forecasts=0;
for(let d=0;d<1095;d++){
 if(d%3===2||d%59===0||d%365>340)continue;
 const when=C.add(date,d),p=E.plan(trainee,{now:when,minutes:d%29===0?25:60,readiness:d%31===0?'low':'normal'});if(!p.items.length)continue;
 const a=actual(p);for(let i=0;i<p.items.length;i++)if(p.items[i].mode==='light'){lights++;{a[i].sets.forEach(x=>x.stationHeightCm=p.items[i].station.heightCm-5);changed++;}}
 const rows=N.records(p,a);trainee.sessions.push({id:'station-long-'+saved,date:when,title:p.day.name,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items:rows});trainee.deferredByBlock={...trainee.deferredByBlock,[p.block]:E.deferredAfter(p,rows)};
 for(const r of rows)if(r.mode==='light'&&r.setupChanged){assert.equal(r.completed,false);assert.equal(E.stateFor(trainee,r.id,{now:when}).streak,0);}
 saved++;if(saved%50===0){const snapshot=JSON.stringify(trainee);C.project(trainee,when,C.add(when,21));assert.equal(JSON.stringify(trainee),snapshot);trainee=E.validateBackup(JSON.parse(snapshot));forecasts++;}
}
assert.ok(saved>300&&lights>20&&changed>5&&forecasts>=6,JSON.stringify({saved,lights,changed,forecasts}));E.validateBackup(trainee);
console.log('PASS '+cases+' changed light-station cases, neutral clean practice, no false failure/credit, independent actuals, correction/undo, backups, date bounds, forecasts and actual consecutive-day generation; three-year actuals',JSON.stringify({saved,lights,changed,forecasts}));
