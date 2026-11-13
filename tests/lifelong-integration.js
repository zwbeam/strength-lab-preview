/* Actual E.plan -> notebook actuals -> history -> replay across three years. */
'use strict';
const assert=require('node:assert/strict'),E=require('../engine'),N=require('../notebook');
const {fresh,seed,sets}=require('./movement-integration');
const day=n=>new Date(Date.UTC(2024,0,1)+n*86400000).toISOString().slice(0,10);
const results=[];
for(const config of [{name:'mixed',kb:true,club:true,bw:true,blocks:['abc','doubleClub','bodyweight','double']},{name:'double-club',kb:false,club:true,bw:false,blocks:['doubleClub']},{name:'bodyweight',kb:false,club:false,bw:true,blocks:['abc','bodyweight']},{name:'club-bodyweight',kb:false,club:true,bw:true,blocks:['abc','doubleClub','bodyweight']}]){
 let s=fresh();s.programBlock='abc';Object.assign(s.trainingPreferences,{useKb:config.kb,useClub:config.club,useBodyweight:config.bw,crawlSpace:true,focus:'balanced',variety:'high'});s.programComposition={enabled:true,blocks:config.blocks,minGapDays:1,hardGapDays:2};
 // Prior skill practice is explicit synthetic history, not generated qualification.
 for(const id of ['clubInside','clubOutside','clubShield','singleRackSquat','doubleClean','press'])seed(s,id,day(-3));
 if(!config.kb){s.equipment.kb=[];s.equipment.pairs=[];}if(!config.club){s.equipment.club=[];s.equipment.clubPairs=[];}
 const seen=new Set(),counts={saved:0,missed:0,partial:0,technique:0,pain:0,recovery:0,return:0,checkpoints:0,pairRestrictions:0,replacements:0,paused:0};
 for(let d=0;d<1095;d++){
  if(d===180)s.equipment.clubPairs=[];
  if(d===210&&config.club)s.equipment.clubPairs=[5,6];
  if(d===540)s.equipment.pairs=[];
  if(d===570&&config.kb)s.equipment.pairs=[12];
  if(d===500){s.paused=true;s.pauseStarted=day(d);s.pauseUntil=day(514);}
  if(d===720&&config.club){s.equipment.club=[6,10];s.equipment.clubPairs=[6];for(const [id,m] of Object.entries(E.MOVES))if(m.gear==='club'&&!E.availableWorkingLoads(s,id).includes(E.stateFor(s,id).weight)){s=E.replaceUnavailableLoad(s,id,6);counts.replacements++;}}
  if(![0,2,4].includes(d%7))continue;
  if(d%365>=330&&d%365<351||d%43===0){counts.missed++;continue;}
  s.trainingPreferences.crawlSpace=!(d>=360&&d<420);
  s.trainingPreferences.focus=['balanced','skill','capacity','strength'][Math.floor(d/91)%4];
  s.trainingPreferences.variety=d%11===0?'consistent':'high';
  // Model an explicit pain review after time away, never a timer-driven release.
  if(d%21===0)for(const id of Object.keys(E.MOVES))if(E.stateFor(s,id).hold)s=E.resolvePain(s,id);
  const readiness=d%17===0?'low':'normal',minutes=d%13===0?30:d%19===0?60:45,p=E.plan(s,{now:day(d),minutes,readiness});
  if(d>=180&&d<210){assert.ok(!p.items.some(x=>E.MOVES[x.id].clubPair));counts.pairRestrictions++;}
  if(d>=540&&d<570)assert.ok(!p.items.some(x=>E.MOVES[x.id].pair));
  if(d>=500&&d<514){assert.equal(p.items.length,0);counts.paused++;}
  assert.ok(p.estimated<=p.cap+1,'time cap '+config.name+' '+day(d));assert.equal(new Set(p.items.map(x=>x.id)).size,p.items.length);
  assert.ok(p.items.filter(x=>E.MOVES[x.id].clubPair).length<=1);
  const mode=d%37===0?'partial':d%41===0?'technique':d%53===0?'pain':'clean';
  const actual=p.items.map((rx,i)=>{
   const m=E.MOVES[rx.id];assert.ok(m.bodyweight?config.bw:m.gear==='kb'?config.kb:config.club);
   assert.equal(E.prerequisites(s,rx.id,{now:day(d)}).length,0,rx.id+' prematurely prescribed');
   if(!m.bodyweight)assert.ok(E.availableWorkingLoads(s,rx.id).includes(rx.weight),'unowned '+rx.id);
   if(m.defaultProfile==='crawl')assert.ok(s.trainingPreferences.crawlSpace);
   const actualSets=sets(rx);if(mode==='partial')actualSets.at(-1).done=false;
   const result=E.completeRecord(rx,actualSets,mode==='technique'?'breakdown':'clean',mode==='pain'&&i===0);
   if(mode==='partial'||mode==='technique'||mode==='pain'&&i===0||['recovery','reentry','light','rebuild','deload'].includes(rx.mode))assert.equal(result.completed,false,'false credit '+rx.id);
   return {...result,prescription:rx};
  });
  if(!actual.some(x=>x.actualSets>0))continue;
  const before=Object.fromEntries(p.items.map(rx=>[rx.id,E.stateFor(s,rx.id).stage]));
  s.sessions.push({id:config.name+'-'+d,title:p.day.name,date:day(d),slot:p.slot,block:p.block,calendarVersion:1,notebookVersion:1,items:actual});
  s.deferredByBlock={...s.deferredByBlock,[p.block]:E.deferredAfter(p,actual)};
  for(const item of actual){if(item.actualSets>0)seen.add(item.id);if(!item.completed)assert.ok(E.stateFor(s,item.id).stage<=before[item.id],'incomplete advancement');}
  counts.saved++;if(mode!=='clean')counts[mode]++;if(p.items.some(x=>x.mode==='recovery'))counts.recovery++;if(p.items.some(x=>x.mode==='reentry'))counts.return++;
  if(counts.saved%60===0){const restored=E.validateBackup(JSON.parse(JSON.stringify(s)));assert.equal(restored.sessions.length,s.sessions.length);assert.deepEqual(E.plan(restored,{now:day(d+2),minutes:45}),E.plan(s,{now:day(d+2),minutes:45}));counts.checkpoints++;}
 }
 assert.ok(counts.saved>250&&counts.missed&&counts.partial&&counts.pain&&counts.recovery&&counts.return&&counts.pairRestrictions&&(!config.club||counts.replacements)&&counts.paused,JSON.stringify(counts));
 if(config.bw)assert.ok([...seen].some(id=>E.MOVES[id].bodyweight),'bodyweight missing '+config.name);
 if(config.name==='double-club'){assert.ok(seen.has('doubleClubPullover'),'No pullover advancement');assert.ok(seen.has('doubleClubTechnicalSwipe'),'No technical-swipe advancement');}
 if(config.club)assert.ok(seen.has('doubleClubSwingClean'),'paired-club foundation missing '+config.name);
 if(config.kb)assert.ok(seen.has('doubleClean'),'paired-kb foundation missing');
 E.validateBackup(JSON.parse(JSON.stringify(s)));results.push({scenario:config.name,...counts,movements:[...seen]});
}
// Explicit crawl progression and incomplete duration cannot become qualification.
const c=fresh();c.programBlock='bodyweight';c.trainingPreferences.crawlSpace=true;
const rx=E.prescription(c,'bearCrawl',{now:day(0)});assert.equal(rx.reps,30);assert.equal(rx.rest,30);assert.equal(rx.timed,true);assert.equal(rx.sourceParameters,null);
assert.equal(E.prescription({...c,trainingPreferences:{...c.trainingPreferences,crawlSpace:false}},'bearCrawl').sets,0);
const short=sets(rx);short.at(-1).reps=15;assert.equal(E.completeRecord(rx,short,'clean',false).completed,false);
assert.ok(E.prerequisites(c,'catCrawl',{now:day(0)}).includes('practice:bearCrawl'));seed(c,'bearCrawl',day(0));assert.equal(E.prerequisites(c,'catCrawl',{now:day(2)}).length,0);
const pair=fresh();assert.ok(E.prerequisites(pair,'doubleClean',{now:day(0)}).includes('practice:clean'));assert.ok(E.prerequisites(pair,'doublePress',{now:day(0)}).includes('practice:doubleClean'));assert.ok(E.prerequisites(pair,'doubleSquat',{now:day(0)}).includes('practice:singleRackSquat'));
const light=fresh();const addLight=(mode)=>{const rx=E.prescription(light,'clean',{now:day(0)});if(mode==='light'){rx.mode='light';rx.sets=1;}light.sessions.push({id:'light-'+light.sessions.length,title:'Heavy/light practice',date:day(0),items:[E.completeRecord(rx,sets(rx),'clean',false)]});};
addLight('volume');addLight('light');assert.equal(E.practiceEvidence(light,'clean',{now:day(0)}).count,1);addLight('volume');assert.equal(E.practiceEvidence(light,'clean',{now:day(0)}).ready,true);
console.log('PASS three-year application-generated integration histories '+JSON.stringify(results));
