'use strict';
// Regression: active Train/draft preparation panels must route to the
// source-linked, pattern-aware warmup and cooldown functions.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const between=(a,b)=>{const start=app.indexOf(a);const end=app.indexOf(b,start);assert.ok(start>=0&&end>start,'Missing preparation code anchors');return app.slice(start,end);};
const active=between('function preparation(plan,kind){','function prepSection(plan,kind,');
assert.match(active,/kind==='warmup'\?warmup\(plan\):cooldown\(plan\)/);
assert.match(between('function prepSection(plan,kind,','function compactPrescription('),/preparation\(plan,kind\)/);
const prepPanel=between('function prepSection(plan,kind,','function compactPrescription(');
assert.match(prepPanel,/Wildman Program Design 8/);
assert.match(prepPanel,/Clean & Press: 8–10 minutes/);
assert.match(prepPanel,/Snatch: about 10 minutes/);
const warm=between('function warmup(plan){','function cooldown(plan){');
const cool=between('function cooldown(plan){','function emptyPlanMessage(');
assert.match(warm,/data-open-source="550"/);
assert.match(warm,/const hinge=/);
assert.match(cool,/data-open-source="130"/);
assert.match(cool,/plan\.budget\?\.cooldown/);

const vm=require('node:vm');
const source=between('function warmup(plan){','function emptyPlanMessage(');
const context={E:{MOVES:{singleArmSwing:{name:'Single-arm swing'},clubCircle:{name:'Club circle'},overheadPress:{name:'Overhead press'},bodyweightSquat:{name:'Bodyweight squat'}}},esc:x=>String(x)};
vm.createContext(context);
vm.runInContext(source+';this.renderWarmup=warmup;this.renderCooldown=cooldown;',context);
const plan=(id,cooldown=10)=>({items:[{id,name:context.E.MOVES[id].name}],budget:{warmup:8,cooldown}});
const swing=context.renderWarmup(plan('singleArmSwing'));
const club=context.renderWarmup(plan('clubCircle'));
const squat=context.renderWarmup(plan('bodyweightSquat'));
assert.match(swing,/hip-hinge patterning/);
assert.match(club,/light club circle/);
assert.match(squat,/Supported squat-range exploration/);
assert.notEqual(swing,club,'Different training families need distinct preparation');
assert.equal((swing.match(/<li><strong>Minute /g)||[]).length,4,'Eight-minute warmup needs four one-minute stations repeated twice');
assert.match(swing,/Two easy rounds/);

assert.match(swing,/Minute 1 and 5/);
assert.match(swing,/Minute 2 and 6/);
assert.match(swing,/Minute 3 and 7/);
assert.match(swing,/Minute 4 and 8/);
assert.match(swing,/data-open-source="550"/);
assert.match(swing,/not presented as a universal mandatory sequence/);

assert.match(swing,/Minute 4 and 8/);
const pressCool=context.renderCooldown(plan('overheadPress'));
const swingCool=context.renderCooldown(plan('singleArmSwing'));
assert.match(pressCool,/upper back and shoulders/);
assert.match(swingCool,/posterior chain and hips/);
for(const id of ['singleArmSwing','clubCircle','overheadPress','bodyweightSquat']){
 for(const duration of [30,45,60]){
  const html=context.renderCooldown(plan(id,10));
  const minutes=[...html.matchAll(/<li>(\d+) min:/g)].reduce((sum,x)=>sum+Number(x[1]),0);
  assert.equal(minutes,10,'Cooldown minutes must sum to reserved budget for '+id+' / '+duration);
 }
}
assert.doesNotMatch(pressCool,/advance|progression credit/i);
assert.match(pressCool,/not a universal Wildman prescription/);
assert.match(pressCool,/data-open-source="130"/);
assert.match(pressCool,/data-open-source="139"/);
assert.match(swingCool,/data-open-source="135"/);

console.log('Source-aware warmup and cooldown behavior checks passed');

console.log('Active preparation routing checks passed');
