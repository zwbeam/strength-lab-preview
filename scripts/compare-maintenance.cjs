'use strict';
// Reproduce the mature get-up composition diagnostic against an exported engine:
// git show <base>:engine.js > /tmp/prior-engine.js
// node scripts/compare-maintenance.cjs /tmp/prior-engine.js
const path=require('node:path'),assert=require('node:assert/strict');
const {E,N,C,actual}=require('../tests/fixtures/core-window.cjs');
const {fixture,date}=require('../tests/maintenance-cadence');
if(!process.argv[2])throw Error('Supply an exported baseline engine path');
const baseline=require(path.resolve(process.argv[2]));
for(const minutes of [30,45,60])for(const [label,engine] of [['before',baseline],['after',E]]){
 const s=fixture();s.defaultMinutes=minutes;
 const counts={workouts:0,getup:0,getupReturns:0,row:0,rowReturns:0,maintenance:0,developingReturns:0,earnedReturns:0},milestones={};
 for(let n=0;n<120;n++){
  const when=C.add(date,Math.floor(n/3)*7+[0,2,4][n%3]),p=engine.plan(s,{now:when});
  assert.ok(p.total<=minutes);if(!p.items.length)continue;counts.workouts++;
  if(p.composition?.curriculum?.selection==='maintenance')counts.maintenance++;
  for(const rx of p.items){
   if(rx.mode==='reentry')counts[engine.stateFor(s,rx.id,{now:when}).cycles>0?'earnedReturns':'developingReturns']++;
   if(rx.id==='getup'){counts.getup++;if(rx.mode==='reentry')counts.getupReturns++;}
   if(rx.id==='bodyweightRow'){counts.row++;if(rx.mode==='reentry')counts.rowReturns++;}
  }
  const items=N.records(p,actual(p));s.sessions.push({id:'compare-'+n,date:when,title:p.day.name,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items});
  // Get-up is already earned at the checkpoint; only new qualifications belong here.
  for(const rx of p.items)if(rx.id!=='getup'&&!milestones[rx.id]&&engine.stateFor(s,rx.id,{now:when}).cycles>0)milestones[rx.id]=when;
  s.deferredByBlock=engine.deferredBlocksAfter(s.deferredByBlock||{},p,items);
 }
 console.log(JSON.stringify({minutes,label,counts,milestones,rowCycles:engine.stateFor(s,'bodyweightRow',{now:C.add(date,280)}).cycles}));
}
