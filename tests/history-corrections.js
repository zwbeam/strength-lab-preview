/* Large-history correction, replay and undo regression.
 * Run: node tests/history-corrections.js
 */
'use strict';
const assert = require('node:assert/strict');
const E = require('../engine.js'), N = require('../notebook.js');
const id='swing', state={sessions:[],weights:{swing:16},nextWeights:{swing:18},programming:{swing:{exposures:2}}};
const policy=E.policyFor(id,state), target=policy.stages[0];
const rx={id,name:E.MOVES[id].name,unit:'kg',side:1,weight:16,sets:target.sets,reps:target.reps,rest:target.rest,mode:'volume',policyKey:policy.key,profile:'legacy',track:'base'};
const sets=()=>Array.from({length:rx.sets},()=>({done:true,skipped:false,weight:16,reps:rx.reps}));
const first=Date.UTC(2025,0,1);
for(let n=0;n<300;n++){
 const date=new Date(first+n*86400000).toISOString().slice(0,10);
 const record={...E.completeRecord(rx,sets(),'clean',false),prescription:{...rx},note:''};
 state.sessions.push({id:'session-'+n,date,block:'abc',items:[record],plan:{items:[rx],deferred:[]},status:'Completed as prescribed',finishOutcome:'complete'});
}
const before=E.stateFor(state,id);
const original=state.sessions[299];
const edit=N.historyDraft(original);
edit.items[0].quality='hard';
const corrected=N.correct(state,original.id,edit,'Correct inaccurate quality report','2026-01-01T00:00:00.000Z');
assert.equal(state.sessions[299].items[0].quality,'clean','Original state mutated');
assert.equal(corrected.sessions[299].items[0].quality,'hard','Correction not applied');
assert.ok(!Object.hasOwn(corrected.nextWeights,id),'Correction retained stale load override');
assert.equal(corrected.sessions.length,300,'History lost during correction');
assert.equal(E.stateFor(corrected,id).hold,before.hold,'Quality correction changed pain hold');
const restored=N.undo(corrected,original.id,'2026-01-02T00:00:00.000Z');
assert.equal(restored.sessions[299].items[0].quality,'clean','Undo did not restore original quality');
assert.equal(restored.sessions.length,300,'Undo lost sessions');
assert.ok(restored.sessions[299].corrections.length>=2,'Correction history missing');
console.log('300-session correction, immutable replay, stale load withdrawal and undo checks passed');
