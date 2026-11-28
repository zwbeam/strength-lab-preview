'use strict';
// git show BASE:engine.js > /tmp/baseline-engine.js
// node scripts/compare-core-scope.cjs /tmp/baseline-engine.js
const assert=require('node:assert/strict'),path=require('node:path'),{E,N,C,actual}=require('../tests/fixtures/core-window.cjs'),{fixture,disable,date}=require('../tests/core-scope');
if(!process.argv[2])throw Error('Supply an exported baseline engine path');
const baseline=require(path.resolve(process.argv[2]));
for(const minutes of [30,45,60])for(const [label,engine] of [['before',baseline],['after',E]]){
 const s=disable(fixture(date,minutes)),counts={workouts:0,core:0,developing:0,returns:0,returnsByMovement:{}},milestones={};let firstDeveloping=null;
 for(let n=0;n<120;n++){
  const when=C.add(date,Math.floor(n/3)*7+[0,2,4][n%3]),p=engine.plan(s,{now:when});assert.ok(p.total<=minutes);if(!p.items.length)continue;counts.workouts++;
  if(p.block==='abc')counts.core++;else{counts.developing++;firstDeveloping??=when;}
  for(const rx of p.items)if(rx.mode==='reentry'){counts.returns++;counts.returnsByMovement[rx.id]=(counts.returnsByMovement[rx.id]||0)+1;}
  const items=N.records(p,actual(p));s.sessions.push({id:'scope-follow-'+n,date:when,title:p.day.name,block:p.block,slot:p.slot,calendarVersion:1,plan:p,items});s.deferredByBlock=engine.deferredBlocksAfter(s.deferredByBlock||{},p,items);
  for(const id of ['squat','press','row','swing','cast','carry','clean','front','hingePractice','bodyweightRow'])if(!milestones[id]&&engine.stateFor(s,id,{now:when}).cycles>0)milestones[id]=when;
 }
 console.log(JSON.stringify({minutes,label,counts,firstDeveloping,milestones,storedSessions:s.sessions.length}));
}
