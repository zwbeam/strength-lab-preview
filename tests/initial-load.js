'use strict';
const assert=require('node:assert/strict'),E=require('../engine'),{fresh}=require('./movement-integration');
for(const id of ['doubleClubInside','doubleClubOutside','doubleClubSwingClean','doubleClean','singleRackSquat']){
 const s=fresh();delete s.weights[id];const weight=E.MOVES[id].gear==='club'?5:12,before=JSON.stringify(s),next=E.setInitialLoad(s,id,weight);
 assert.equal(JSON.stringify(s),before);assert.equal(E.stateFor(next,id).weight,weight);assert.equal(E.stateFor(next,id).stage,0);assert.equal(next.sessions.length,0);assert.equal(E.validateBackup(JSON.parse(JSON.stringify(next))).weights[id],weight);
 assert.throws(()=>E.setInitialLoad(next,id,weight),'Established load must use reviewed progression controls');assert.throws(()=>E.setInitialLoad(s,id,999));assert.throws(()=>E.setInitialLoad(s,id,0));
 const unconfirmed=E.setInitialLoad({...s,skills:{}},id,weight);assert.ok(E.prerequisites(unconfirmed,id).length,'Load entry must not certify skill');
 if(E.MOVES[id].clubPair)assert.throws(()=>E.setInitialLoad({...s,equipment:{...s.equipment,clubPairs:[]}},id,weight));
 if(E.MOVES[id].pair)assert.throws(()=>E.setInitialLoad({...s,equipment:{...s.equipment,pairs:[]}},id,weight));
}
assert.throws(()=>E.setInitialLoad(fresh(),'bodyweightSquat',5));assert.throws(()=>E.setInitialLoad(fresh(),'unknown',5));console.log('PASS initial-load ownership, immutable data, backup compatibility, skill separation and established-load protection');
