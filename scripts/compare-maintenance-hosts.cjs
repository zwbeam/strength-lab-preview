'use strict';
// Export BASE:engine.js, then pass its path. Synthetic actuals, no user storage.
const assert=require('node:assert/strict'),path=require('node:path'),{E,N,C,actual}=require('../tests/fixtures/core-window.cjs'),{fixture,date}=require('../tests/maintenance-hosts');
if(!process.argv[2])throw Error('Supply an exported baseline engine path');
const baseline=require(path.resolve(process.argv[2]));
for(const minutes of [30,45,60])for(const [label,engine] of [['before',baseline],['after',E]]){
 const s=fixture(date,minutes),counts={workouts:0,core:0,getup:0,getupReturns:0,getupMaintenance:0},milestones={};let firstGetup=null;
 for(let n=0;n<120;n++){
  const when=C.add(date,Math.floor(n/3)*7+[0,2,4][n%3]),p=engine.plan(s,{now:when});assert.ok(p.total<=minutes);if(!p.items.length)continue;counts.workouts++;if(p.block==='abc')counts.core++;
  for(const rx of p.items)if(rx.id==='getup'){counts.getup++;if(rx.mode==='reentry')counts.getupReturns++;if(rx.earnedMaintenance)counts.getupMaintenance++;firstGetup??={date:when,gap:engine.movementGap(s,'getup',when),mode:rx.mode};}
  const items=N.records(p,actual(p));s.sessions.push({id:'host-follow-'+n,date:when,title:p.day.name,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items});s.deferredByBlock=engine.deferredBlocksAfter(s.deferredByBlock||{},p,items);
  for(const id of ['hipDropTwoHand','hipDropSingleHand','bearSquat','hingePractice','bodyweightSquat','stepBackLunge'])if(!milestones[id]&&engine.stateFor(s,id,{now:when}).cycles>0)milestones[id]=when;
 }
 console.log(JSON.stringify({minutes,label,counts,firstGetup,milestones,selectedPrograms:s.programComposition.blocks.length,storedSessions:s.sessions.length}));
}
