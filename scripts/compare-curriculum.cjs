'use strict';
// Reproduce the checked-in before/after diagnostic from an exact engine commit.
// Synthetic actuals only; no user storage, remote writes or inferred technique.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const current=require('../engine'),{fresh,actual}=require('../tests/fixtures/core-window.cjs'),C=require('../rolling-calendar');
const baselineFile=process.argv[2];
if(!baselineFile)throw Error('Pass an exact baseline engine file exported with git show COMMIT:engine.js');
const filename=path.resolve(__dirname,'../engine-baseline.cjs'),previous=new Module(filename);previous.filename=filename;previous.paths=Module._nodeModulePaths(path.dirname(filename));previous._compile(fs.readFileSync(baselineFile,'utf8'),filename);
const baseline=previous.exports,ids=['hingePractice','bodyweightRow','bodyweightSquat','stepBackLunge','hipDropTwoHand','hipDropSingleHand','bearSquat'];
function notebook(E){const f=path.resolve(__dirname,'../notebook.js'),m=new Module(f);m.filename=f;m.require=name=>name==='./engine.js'?E:require(name);m._compile(fs.readFileSync(f,'utf8'),f);return m.exports;}
function run(E,label,minutes,stress=false){
 let s=fresh(minutes);s.programComposition.blocks.push('bodyweightFoundations','groundPractice');const N=notebook(E),counts={workouts:0,core:0,developingReturns:0,earnedReturns:0,progressingWork:0,maintenance:0,maintenanceAlongside:0},milestones={};
 const total=stress?730:280;
 for(let d=0;d<total;d++){
  if(stress){if(d===180)s.equipment.rowBar.available=false;if(d===210)s.equipment.rowBar.available=true;if(d===300)s=E.configureMovement(s,'hingePractice',{profile:'hingePractice',exposures:3});if(d===365)s.defaultMinutes=30;if(d%61===0||d%365>337)continue;}
  if(![0,2,4].includes(d%7))continue;
  const date=C.add('2026-01-05',d),p=E.plan(s,{now:date,...(stress?{readiness:d%41===0?'low':'normal'}:{})}),a=actual(p);
  if(!p.items.length||p.total>s.defaultMinutes)throw Error('Infeasible actual plan');
  if(stress&&d%67===0)a[0].sets.at(-1).done=false;
  const rows=N.records(p,a);
  for(const row of rows)if(ids.includes(row.id)){
   const earned=E.stateFor(s,row.id,{now:date}).phase==='ready';
   if(row.mode==='reentry')counts[earned?'earnedReturns':'developingReturns']++;
   if(row.completed&&!earned)counts.progressingWork++;
   if(row.earnedMaintenance)counts.maintenance++;
  }
  counts.maintenanceAlongside+=(p.composition?.curriculum?.maintenance||[]).length;counts.workouts++;if(p.block==='abc')counts.core++;
  s.sessions.push({id:'curriculum-'+counts.workouts,title:p.day.name,date,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items:rows});
  s.deferredByBlock=E.deferredBlocksAfter?E.deferredBlocksAfter(s.deferredByBlock||{},p,rows):{...s.deferredByBlock,[p.block]:E.deferredAfter(p,rows)};
  for(const id of ids)if(!milestones[id]&&E.stateFor(s,id,{now:date}).phase==='ready')milestones[id]=date;
 }
 const end=C.add('2026-01-05',total-1),last=E.plan(s,{now:C.add(end,7)});
 return{scenario:stress?'two-year-constraints':'forty-week-controlled',label,minutes,counts,milestones,progress:Object.fromEntries(ids.map(id=>{const st=E.stateFor(s,id,{now:end});return[id,{stage:st.stage,cycles:st.cycles,ready:st.phase==='ready'}];})),nextCurriculum:last.composition?.curriculum||null};
}
for(const stress of [false,true])for(const minutes of [30,45,60])for(const [label,E] of [['before',baseline],['after',current]])console.log(JSON.stringify(run(E,label,minutes,stress)));
const assert=require('node:assert/strict'),keys=Object.keys(current.MOVES).slice(0,10),lookup={sessions:Array.from({length:3000},(_,i)=>({id:'bench-'+i,date:C.add('2010-01-05',i*2),items:keys.map(id=>({id,tag:i}))}))},scope={now:'2026-11-25'};
assert.deepEqual(current.records(lookup,'press',scope),baseline.records(lookup,'press',scope));
function duration(E){E.records(lookup,'press',scope);const start=performance.now();for(let i=0;i<5;i++)E.records(lookup,'press',scope);return Math.round((performance.now()-start)*100)/100;}
console.log(JSON.stringify({scenario:'history-lookup',sessions:3000,movementsPerSession:10,iterations:5,identical:true,baselineMs:duration(baseline),currentMs:duration(current),limit:'Synthetic local lookup timing, not a real-device latency guarantee'}));
