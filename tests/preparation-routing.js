'use strict';
// Regression: active Train/draft preparation panels must route to the
// source-linked, pattern-aware warmup and cooldown functions.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const between=(a,b)=>{const start=app.indexOf(a);const end=app.indexOf(b,start);assert.ok(start>=0&&end>start,'Missing preparation code anchors');return app.slice(start,end);};
const active=between('function preparation(plan,kind){','function prepSection(plan,kind,');
assert.match(active,/kind==='warmup'\?warmup\(plan\):cooldown\(plan\)/);
assert.match(between('function prepSection(plan,kind,','function compactPrescription('),/preparation\(plan,kind\)/);
const duration=between('function durationDisclosure(plan){','function prepSection(plan,kind,');
assert.match(duration,/planned>target/);
assert.match(duration,/target extended to/);
assert.match(app,/durationDisclosure\(p\)/);
assert.equal((app.match(/durationDisclosure\(p\)/g)||[]).length,2,'Both preview and active workout must disclose extension');

const durationContext={};require('node:vm').createContext(durationContext);
require('node:vm').runInContext(duration+';this.formatDuration=durationDisclosure;',durationContext);
assert.equal(durationContext.formatDuration({budget:{total:30},total:30}),' · ~30 min');
assert.equal(durationContext.formatDuration({budget:{total:30},total:40}),' · 30-min target extended to ~40 min');
assert.equal(durationContext.formatDuration({budget:{total:45},total:49}),' · 45-min target extended to ~49 min');

const prepPanel=between('function prepSection(plan,kind,','function compactPrescription(');
assert.match(prepPanel,/Wildman Program Design 8/);
assert.match(prepPanel,/Clean & Press: 8–10 minutes/);
assert.match(prepPanel,/Snatch: about 10 minutes/);
const warm=between('function warmup(plan){','function cooldown(plan){');
const cool=between('function cooldown(plan){','function emptyPlanMessage(');
assert.match(warm,/data-open-source="550"/);
assert.match(warm,/const hinge=/);
assert.match(cool,/data-open-source="130"/);
assert.match(cool,/plan\.budget\?\.cooldown/);

const vm=require('node:vm');
const source=between('function warmup(plan){','function emptyPlanMessage(');
const context={E:{MOVES:{singleArmSwing:{name:'Single-arm swing'},clubCircle:{name:'Club circle'},overheadPress:{name:'Overhead press'},bodyweightSquat:{name:'Bodyweight squat'}}},esc:x=>String(x)};
vm.createContext(context);
vm.runInContext(source+';this.renderWarmup=warmup;this.renderCooldown=cooldown;',context);
const plan=(id,cooldown=10)=>({items:[{id,name:context.E.MOVES[id].name}],budget:{warmup:8,cooldown}});
const swing=context.renderWarmup(plan('singleArmSwing'));
const club=context.renderWarmup(plan('clubCircle'));
const squat=context.renderWarmup(plan('bodyweightSquat'));
assert.match(swing,/hip-hinge patterning/);
assert.match(club,/light club circle/);
assert.match(squat,/Supported squat-range exploration/);
assert.notEqual(swing,club,'Different training families need distinct preparation');
assert.equal((swing.match(/<li><strong>Minute /g)||[]).length,4,'Eight-minute warmup needs four one-minute stations repeated twice');
assert.match(swing,/Two easy rounds/);

assert.match(swing,/Minute 1 and 5/);
assert.match(swing,/Minute 2 and 6/);
assert.match(swing,/Minute 3 and 7/);
assert.match(swing,/Minute 4 and 8/);
assert.match(swing,/data-open-source="550"/);
assert.match(swing,/not presented as a universal mandatory sequence/);

const pressCool=context.renderCooldown(plan('overheadPress'));
const swingCool=context.renderCooldown(plan('singleArmSwing'));
assert.match(pressCool,/upper back and shoulders/);
assert.match(swingCool,/posterior chain and hips/);
for(const id of ['singleArmSwing','clubCircle','overheadPress','bodyweightSquat']){
 for(const duration of [30,45,60]){
  const html=context.renderCooldown(plan(id,10));
  const minutes=[...html.matchAll(/<li>(\d+) min:/g)].reduce((sum,x)=>sum+Number(x[1]),0);
  assert.equal(minutes,10,'Cooldown minutes must sum to reserved budget for '+id+' / '+duration);
 }
}
assert.doesNotMatch(pressCool,/advance|progression credit/i);
assert.match(pressCool,/not a universal Wildman prescription/);
assert.match(pressCool,/data-open-source="130"/);
assert.match(pressCool,/data-open-source="139"/);
assert.match(swingCool,/data-open-source="135"/);


const mobilityPanelSource=between('function mobilityPanel(timeBlocked=false){','let mobilitySignalKey=');
assert.match(mobilityPanelSource,/formatTime\(duration\*60\)/);
assert.doesNotMatch(mobilityPanelSource,/'<p role="timer"/,'Live mobility timer must use an interpolated template literal');
const mobilityClockSource=between('function updateMobilityClock(){','function unavailableLoadActions(');
assert.match(mobilityClockSource,/totalSeconds=routine\.reduce/);
assert.match(mobilityClockSource,/formatTime\(totalSeconds\)/);
assert.doesNotMatch(mobilityClockSource,/1200|20:00/,'Mobility clock must not hardcode 20 minutes');

assert.match(mobilityClockSource,/mobilityActiveRoutine\|\|mobilityRoutine\(\)/);
assert.match(mobilityPanelSource,/mobilityActiveRoutine\?mobilityActiveRoutine:mobilityRoutine\(\)/);
assert.match(app,/mobilityActiveRoutine=mobilityRoutine\(\);mobilityStartedAt=Date\.now\(\)/);
assert.match(app,/if\(b\.id==='cancel-mobility'\)\{if\(mobilityStartedAt&&Date\.now\(\)-mobilityStartedAt>=60000&&!confirm\('Discard this mobility workout without recording it\?'\)\)return;mobilityStartedAt=0;mobilityActiveRoutine=null;/);
assert.match(app,/elapsedSeconds=Math\.max\(0,Math\.floor\(\(Date\.now\(\)-mobilityStartedAt\)\/1000\)\)/);
assert.match(app,/partial=elapsedSeconds<targetSeconds/);
assert.match(app,/notes:\(partial\?'Partial guided mobility session/);
for(const [elapsedSeconds,targetSeconds,expected] of [[1190,1200,true],[1199,1200,true],[1200,1200,false],[1201,1200,false],[1799,1800,true],[1800,1800,false]])assert.equal(elapsedSeconds<targetSeconds,expected,'Second-accurate mobility completion boundary');
assert.match(app,/state=next;mobilityStartedAt=0;mobilityActiveRoutine=null;/);

assert.match(app,/Partial guided mobility session/);
assert.match(app,/current strength prescription remains unfinished\. No lifting credit/);
assert.match(app,/type:'mobility',duration:Math\.min\(1440,elapsed\)/);
assert.match(app,/replacesStrength:true/);

const mobilityClockSource=between('function updateMobilityClock(){','function unavailableLoadActions(');
assert.match(mobilityClockSource,/mobilityLastRemaining===null\?remaining:mobilityLastRemaining/);
assert.doesNotMatch(mobilityClockSource,/mobilityLastRemaining===null\?remaining\+1/);
for(const remaining of [1,2,3,30,60]){
 const previous=remaining;
 assert.equal(previous>remaining,false,'First tick must not invent a crossed countdown threshold');
}


assert.match(app,/if\(b\.id==='cancel-mobility'\)\{if\(mobilityStartedAt&&Date\.now\(\)-mobilityStartedAt>=60000&&!confirm\('Discard this mobility workout without recording it\?'\)\)return;/);
for(const [elapsedMs,shouldConfirm] of [[0,false],[59999,false],[60000,true],[300000,true]])assert.equal(elapsedMs>=60000,shouldConfirm,'Mobility cancellation confirmation threshold');


const todayRender=between('function renderToday(){','function render(');
assert.match(todayRender,/\$\{programDecision\(p\)\}\$\{d\.today&&!p\.mobilityOnly\?mobilityPanel\(\):''\}/);
assert.match(todayRender,/p\.mobilityOnly\?mobilityPanel\(\)/);
assert.match(todayRender,/d\.today\?mobilityPanel\(/);
assert.match(todayRender,/mobilityStartedAt\?'<p class="small muted" role="status">Mobility workout in progress/);
assert.match(todayRender,/<button class="button full" id="start" disabled>Start Workout<\/button>/);


const resetHandler=between("if(b.id==='reset-confirm'){","document.addEventListener('change',e=>{if(e.target?.id==='reset-backup-confirmed')");
assert.match(resetHandler,/persistTraining\(next,null\)/);
assert.match(resetHandler,/mobilityStartedAt=0;mobilityActiveRoutine=null;saveMobilityCheckpoint\(\)/);
assert.match(resetHandler,/window\.speechSynthesis\?\.cancel\(\)/);
assert.match(resetHandler,/clearInterval\(mobilityClock\)/);


assert.match(app,/function start\(\)\{timerPanelOpen=false;if\(!checkWriter\(\)\)return;if\(draft\)return;if\(mobilityStartedAt\)/);
assert.match(app,/if\(b\.id==='start-mobility'\)\{if\(!checkWriter\(\)\)return;if\(mobilityStartedAt\)return;if\(draft\)/);


const mobilityRecovery=between("const MOBILITY_SESSION='sl-dev-preview-mobility-active-v1';",'function mobilityRoutine(){');
assert.match(mobilityRecovery,/sessionStorage\.setItem\(MOBILITY_SESSION/);
assert.match(mobilityRecovery,/sessionStorage\.removeItem\(MOBILITY_SESSION/);
assert.match(mobilityRecovery,/saved\.startedAt>Date\.now\(\)/);
assert.match(mobilityRecovery,/24\*60\*60\*1000/);
assert.match(mobilityRecovery,/routine\.length!==9/);
assert.match(mobilityRecovery,/recoverMobilityCheckpoint\(\);/);

{
 const checkpointSource=between('let mobilityStartedAt=0,mobilityClock=null,mobilityActiveRoutine=null;','function mobilityRoutine(){');
 const storage=new Map(),key='sl-dev-preview-mobility-active-v1',now=1_000_000;
 const browserStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const run=draft=>{const intervals=[];const result=Function('sessionStorage','Date','setInterval','updateMobilityClock','draft',checkpointSource+';return {startedAt:mobilityStartedAt,routine:mobilityActiveRoutine};')(browserStorage,{now:()=>now},fn=>{intervals.push(fn);return intervals.length;},()=>{},draft);return {...result,intervals:intervals.length};};
 assert.equal(run(null).startedAt,0,'No checkpoint means no active mobility');
 const routine=Array.from({length:9},(_,i)=>({min:i===4?4:2,title:'Stage '+i,detail:'Gentle movement'}));
 storage.set(key,JSON.stringify({version:1,startedAt:now-300000,routine}));
 const recovered=run(null);
 assert.equal(recovered.startedAt,now-300000,'Recover original elapsed time');
 assert.equal(recovered.routine.length,9,'Recover frozen routine');
 assert.equal(recovered.intervals,1,'Restart mobility clock');
 assert.equal(run({id:'strength-draft'}).startedAt,0,'Never overlap saved strength');
 assert.equal(storage.has(key),false,'Remove conflicting checkpoint');
 storage.set(key,JSON.stringify({version:1,startedAt:now-25*60*60*1000,routine}));
 assert.equal(run(null).startedAt,0,'Reject expired checkpoint');
 assert.equal(storage.has(key),false,'Remove expired checkpoint');
}


assert.match(mobilityRecovery,/if\(draft\)\{sessionStorage\.removeItem\(MOBILITY_SESSION\);return;\}/);
assert.match(app,/document\.querySelectorAll\('\[data-tab\]'\)\.forEach\(x=>x\.classList\.toggle\('active',x\.dataset\.tab===tab\)\);updateTimer\(\);if\(mobilityStartedAt\)updateMobilityClock\(\);/);

assert.match(app,/mobilityStartedAt=Date\.now\(\);saveMobilityCheckpoint\(\)/);
assert.match(app,/state=next;mobilityStartedAt=0;mobilityActiveRoutine=null;saveMobilityCheckpoint\(\)/);


assert.match(app,/document\.addEventListener\('visibilitychange',\(\)=>\{if\(!document\.hidden\)\{if\(draft\)updateTimer\(\);if\(mobilityStartedAt\)updateMobilityClock\(\);\}\}\)/);
assert.match(app,/window\.addEventListener\('pageshow',\(\)=>\{if\(draft\)updateTimer\(\);if\(mobilityStartedAt\)updateMobilityClock\(\);\}\)/);
assert.match(app,/updateTimer\(\);if\(mobilityStartedAt\)updateMobilityClock\(\);\},250\)/);



const mobilityRoutineSource=between('function mobilityRoutine(){','function mobilityPanel(');
assert.match(mobilityRoutineSource,/const stages=/);
assert.match(mobilityRoutineSource,/return stages\.map/);
const mobilityStageMinutes=[2,2,2,2,4,2,2,2,2];
assert.equal(mobilityStageMinutes.reduce((sum,n)=>sum+n,0),20);

console.log('Source-aware warmup and cooldown behavior checks passed');

console.log('Active preparation routing checks passed');
