// Run with: node --test tests/history-corrections.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../engine.js');
const N=require('../notebook.js');
const rx={id:'swing',name:E.MOVES.swing.name,unit:'kg',side:1,weight:16,sets:1,reps:10,rest:90,mode:'normal',policyKey:'legacy-v1',track:'base'};
const set=()=>({done:true,skipped:false,weight:16,reps:10});
const item=()=>N.records({items:[rx]},[{id:'swing',sets:[set()],quality:'clean',pain:false}])[0];
const session=(id,date)=>({id,date,block:'abc',plan:{items:[rx],deferred:[]},items:[item()],notes:'',finishOutcome:'complete',status:'Completed as prescribed'});
const state=()=>({sessions:[session('first','2026-01-01'),session('second','2026-01-02')],deferredIds:[],deferredByBlock:{},nextWeights:{swing:18}});
test('correcting an older workout preserves later records and clears pending load choice',()=>{
 const s=state(),edit=N.historyDraft(s.sessions[0]);edit.items[0].sets[0].done=false;
 const out=N.correct(s,'first',edit,'test correction','2026-02-01T00:00:00Z');
 assert.equal(s.sessions[0].items[0].actualSets,1,'original input must not mutate');
 assert.equal(out.sessions[0].items[0].actualSets,0);
 assert.equal(out.sessions[0].finishOutcome,'partial');
 assert.deepEqual(out.sessions[1].items,s.sessions[1].items);
 assert.equal(out.nextWeights.swing,undefined);
 assert.equal(out.sessions[0].corrections.length,1);
});
test('changing an older date reorders engine replay without duplicating records',()=>{
 const s=state(),edit=N.historyDraft(s.sessions[0]);edit.date='2026-01-03';
 const out=N.correct(s,'first',edit,'move date','2026-02-01T00:00:00Z');
 assert.deepEqual(E.records(out,'swing').map(x=>x.date),['2026-01-02','2026-01-03']);
 assert.equal(E.records(out,'swing').length,2);
});
test('undo restores original workout and records the restoration',()=>{
 const s=state(),edit=N.historyDraft(s.sessions[0]);edit.items[0].sets[0].done=false;
 const corrected=N.correct(s,'first',edit,'test correction','2026-02-01T00:00:00Z');
 const restored=N.undo(corrected,'first','2026-02-02T00:00:00Z');
 assert.deepEqual(restored.sessions[0].items,s.sessions[0].items);
 assert.equal(restored.sessions[0].finishOutcome,'complete');
 assert.equal(restored.sessions[0].corrections.length,2);
 assert.deepEqual(restored.sessions[1].items,s.sessions[1].items);
});
