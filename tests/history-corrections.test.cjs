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

test('correction removes earned progression exposure and undo restores it',()=>{
 const s=state();
 const initial=E.records(s,'swing');
 assert.equal(initial.length,2);
 assert.equal(initial.filter(x=>x.completed).length,2);
 const edit=N.historyDraft(s.sessions[0]);edit.items[0].quality='hard';
 const corrected=N.correct(s,'first',edit,'quality correction','2026-02-01T00:00:00Z');
 const after=E.records(corrected,'swing');
 assert.equal(after.length,2,'correction must not duplicate an exposure');
 assert.equal(after.filter(x=>x.completed).length,1,'hard-quality exposure must not earn credit');
 assert.equal(after[0].quality,'hard');
 const restored=N.undo(corrected,'first','2026-02-02T00:00:00Z');
 assert.equal(E.records(restored,'swing').filter(x=>x.completed).length,2,'undo must restore original progression credit');
 assert.equal(E.records(restored,'swing').length,2,'undo must not duplicate an exposure');
});
test('same-day sessions retain stable ordering after a date correction',()=>{
 const s=state(),edit=N.historyDraft(s.sessions[0]);edit.date='2026-01-02';
 const out=N.correct(s,'first',edit,'same-day correction','2026-02-01T00:00:00Z');
 assert.deepEqual(E.records(out,'swing').map(x=>x._key),['first:0','second:0']);
});

test('correcting one of two clean exposures reverses stage advancement and undo restores it',()=>{
 const id='swing',base={sessions:[],weights:{swing:16},nextWeights:{},skills:{},programming:{swing:{exposures:2}}};
 const policy=E.policyFor(id,base),first=policy.stages[0];
 assert.ok(policy.stages[1],'test requires at least two stages');
 const prescription={id,name:E.MOVES[id].name,unit:'kg',side:1,weight:16,sets:first.sets,reps:first.reps,rest:first.rest,mode:'volume',policyKey:policy.key,profile:policy.profile,track:'base'};
 const actualSets=()=>Array.from({length:first.sets},()=>({done:true,skipped:false,weight:16,reps:first.reps}));
 const make=(sessionId,date)=>{
  const record={...E.completeRecord(prescription,actualSets(),'clean',false),prescription:{...prescription},note:''};
  assert.equal(record.completed,true,'test setup must earn a clean exposure');
  return{id:sessionId,date,block:'abc',plan:{items:[prescription],deferred:[]},items:[record],finishOutcome:'complete',status:'Completed as prescribed'};
 };
 const initial={...base,sessions:[make('one','2026-01-01'),make('two','2026-01-03')]};
 assert.equal(E.stateFor(initial,id).stage,1,'two exposures should advance');
 const edit=N.historyDraft(initial.sessions[0]);edit.items[0].quality='hard';
 const corrected=N.correct(initial,'one',edit,'quality correction','2026-02-01T00:00:00Z');
 assert.equal(E.stateFor(corrected,id).stage,0,'corrected hard exposure should reverse advancement');
 const restored=N.undo(corrected,'one','2026-02-02T00:00:00Z');
 assert.equal(E.stateFor(restored,id).stage,1,'undo should restore the original stage');
});
