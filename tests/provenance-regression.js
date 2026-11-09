/* Research provenance labels must remain truthful. Run: node tests/provenance-regression.js */
'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js');
let checks=0;
for(const [id] of Object.entries(E.MOVES)){
 const p=E.policyFor(id,{}),description=E.describeProgression(id,{});
 assert.ok(description&&description.length>20,'movement needs readable progression: '+id);checks++;
 if(p.exactParametersSource===null&&!['deadliftPractice','ground','pushup','hingePractice','getupDrill','clubIntermediate','getup','singleClub'].includes(p.profile)){
  assert.ok(description.includes('app defaults'),'unverified numeric targets must be labeled: '+id);checks++;
 }
 if(p.exactParametersSource!==null&&['snatch','grind'].includes(p.profile)){
  assert.ok(description.includes('#'+p.exactParametersSource),'source-example movement needs source marker: '+id);checks++;
 }
}
console.log('PASS '+checks+' provenance-label invariants');
