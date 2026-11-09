/* App-level draft persistence regression. Run: node tests/draft-save-regression.js */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const part=src.slice(src.indexOf('function changed('),src.indexOf('\nfunction saveWorkout(',src.indexOf('function changed(')));
assert.ok(part.startsWith('function changed('),'draft edit functions found');
let checks=0;
for(const failed of [false,true]){
 let draft={notebookVersion:1,plan:{items:[{id:'swing',side:2}]},items:[{sets:[{weight:12,reps:10,done:false}]}]},writes=0,renders=0;
 const initial=JSON.stringify(draft);
 const run=new Function('draft','E','T','checkWriter','saveDraft','render','alert',part+';changed(0,0,"done",true);return draft;');
 draft=run(draft,{validWorkingWeight:()=>true},{logged:d=>{d.clock={running:true}}},()=>true,()=>{writes++;return !failed},()=>{renders++},()=>{});
 assert.equal(writes,1,'exactly one save per changed set');checks++;
 if(failed){assert.equal(JSON.stringify(draft),initial,'failed save restores entire draft');assert.equal(renders,0);}else{assert.equal(draft.items[0].sets[0].done,true);assert.equal(draft.items[0].sets[0].bothSides,true);assert.equal(renders,1);}
 checks+=3;
}
assert.ok(src.includes("if(!saveDraft()){draft=null;return;}render();"),'failed initial draft save is not presented as started');checks++;
console.log('PASS '+checks+' draft-persistence invariants');
