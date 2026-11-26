'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),E=require('../engine'),N=require('../notebook'),{fresh,actual}=require('./fixtures/core-window.cjs');
const src=fs.readFileSync(require.resolve('../app'),'utf8'),code=src.slice(src.indexOf('function warmup(plan){'),src.indexOf('function emptyPlanMessage('));
const state=fresh(30),context={E,state,esc:x=>String(x),today:()=> '2026-01-05'};vm.createContext(context);vm.runInContext(code+';this.warm=warmup;this.cool=cooldown;',context);
const plan=id=>({items:[{id,name:E.MOVES[id].name,weight:5}],budget:E.timeBudget(30)});
assert.match(context.warm(plan('boxStepUp')),/ankle motion/,'Step-up preparation must use the movement pattern, independent of its display name');
assert.equal(typeof E.preparationFor,'function');
console.log('PASS step-up preparation follows engine movement semantics rather than display-name matching');
const opts={now:'2026-01-05'},empty=fresh(30),before=JSON.stringify(empty);let cases=0;
for(const id of Object.keys(E.MOVES))for(let minutes=25;minutes<=120;minutes++){
 const p={items:[{id,name:'Presentation text only',weight:E.MOVES[id].gear==='club'?5:E.MOVES[id].bodyweight?0:12}],budget:E.timeBudget(minutes)},snapshot=JSON.stringify(p),prep=E.preparationFor(empty,p,opts);
 assert.equal(prep.warmup.rounds*prep.warmup.stations.reduce((n,x)=>n+x.seconds,0),480);assert.equal(prep.cooldown.stages.reduce((n,x)=>n+x.minutes,0),10);assert.equal(prep.warmup.light,null);assert.equal(JSON.stringify(p),snapshot);cases++;
}
assert.equal(JSON.stringify(empty),before);assert.equal(cases,54*96);
for(const id of ['boxStepUp','staticStepUp','bearSquat'])assert.equal(E.preparationFor(empty,plan(id),opts).patterns.squat,true);
for(const id of ['getupFloor','getupElbow','hipDropTwoHand','bearCrawl','catCrawl','kneeSlidingPlank','hoverSlidingPlank'])assert.equal(E.preparationFor(empty,plan(id),opts).patterns.ground,true);
assert.equal(E.preparationFor(empty,plan('doublePress'),opts).patterns.hinge,true,'The registered double clean-and-press retains clean preparation without parsing its name');
assert.equal(E.preparationFor(empty,plan('getupFloor'),opts).patterns.overhead,false);assert.equal(E.preparationFor(empty,plan('getup'),opts).patterns.overhead,true);
const compound=E.preparationFor(empty,plan('complexDoubleCleanSquatPress'),opts);for(const pattern of ['complex','hinge','squat','overhead'])assert.equal(compound.patterns[pattern],true);
assert.match(E.preparationFor(empty,plan('bodyweightRow'),opts).warmup.stations[1].text,/row-path rehearsal/);
const untrusted=E.preparationFor(empty,{...plan('press'),items:[{id:'unknown',name:'Heavy overhead snatch squat club'}]},opts);assert.ok(Object.values(untrusted.patterns).every(x=>x===false));
const renamed=plan('boxStepUp');renamed.items[0].name='Nom sans indices';assert.deepEqual(E.preparationFor(empty,renamed,opts).patterns,E.preparationFor(empty,plan('boxStepUp'),opts).patterns);
console.log('PASS '+cases+' movement/duration cases, semantic step/ground/pull/overhead/complex patterns, name independence and pure state/plan preservation');
const familiar=fresh(30);familiar.weights.circles=10;familiar.equipment.club=[5,10];
for(let i=0;i<2;i++){const rx=E.prescription(familiar,'circles',opts),p={items:[rx]};familiar.sessions.push({id:'known-circle-'+i,title:'Actual familiar circles',date:opts.now,items:N.records(p,actual(p))});}
const written={...plan('circles'),items:[{id:'circles',name:E.MOVES.circles.name,weight:10}]},original=JSON.stringify(familiar),advice=E.preparationFor(familiar,written,opts);
assert.deepEqual(advice.warmup.light,{id:'circles',weight:5,unit:'lb'});assert.equal(JSON.stringify(familiar),original);assert.match(advice.warmup.stations[0].text,/5 lb/);assert.match(advice.adaptation,/Strength Lab decisions/);
for(const mutate of [s=>s.equipment.club=[10],s=>s.skills.clubGrip=false,s=>s.trainingPreferences.useClub=false,s=>s.sessions.forEach(x=>x.date='2026-02-05'),s=>s.programming={circles:{profile:'club'}}]){
 const s=structuredClone(familiar);mutate(s);assert.equal(E.preparationFor(s,written,opts).warmup.light,null);
}
assert.equal(E.preparationFor(familiar,written,{now:'2026-03-05'}).warmup.light,null);
const pain=structuredClone(familiar),painRx=E.prescription(pain,'circles',{now:'2026-01-07'}),painPlan={items:[painRx]},painActual=actual(painPlan);painActual[0].pain=true;pain.sessions.push({id:'held-circle',title:'Painful actual work',date:'2026-01-07',items:N.records(painPlan,painActual)});assert.equal(E.preparationFor(pain,written,{now:'2026-01-07'}).warmup.light,null);
const mixed={...written,items:[...written.items,{id:'cast',weight:5},{id:'press',weight:32}]};assert.equal(E.preparationFor(familiar,mixed,opts).warmup.light,null,'Compare only per-club working loads; never mix kg, pairs or heavier companion targets');
assert.equal(E.preparationFor(familiar,plan('doubleClubTechnicalSwipe'),opts).warmup.light,null,'Do not introduce a separate unfamiliar movement or paired warmup load');
const missing={...written,items:[{id:'circles',name:'Circles'}]};assert.equal(E.preparationFor(familiar,missing,opts).warmup.light,null,'Incomplete previews cannot invent a working load');
E.validateBackup(familiar);for(const id of ['circles','cast','press'])assert.deepEqual(E.stateFor(familiar,id,opts),E.stateFor(JSON.parse(original),id,opts));
console.log('PASS owned/familiar light-club choice, limited gear, current skills, disabled gear, future/expired/changed-method evidence, pain holds, mixed units and zero preparation credit');
for(const [warmup,cooldown] of [[0,0],[0,.5],[5,2.5],[5,3],[8,10],[10,7]]){
 const p={...plan('getup'),budget:{warmup,cooldown}},prep=E.preparationFor(empty,p,opts);assert.equal(prep.warmup.rounds*prep.warmup.stations.reduce((n,x)=>n+x.seconds,0),warmup*60);assert.equal(prep.cooldown.stages.reduce((n,x)=>n+x.minutes,0),cooldown);assert.match(context.cool(p),/whole slots, including both sides/);
}
assert.match(context.warm({...plan('press'),budget:{warmup:5,cooldown:3}}),/5 minutes total/);
console.log('PASS existing alternative snapshot allocations remain exact; cooldown slots include both sides and substitutions');
const crypto=require('node:crypto');for(const source of require('../research/preparation-engine-evidence.json').sources){const record=require('../'+source.file).find(x=>x.id===source.id);assert.equal(source.url,record.url);assert.equal(source.sha256,crypto.createHash('sha256').update(record.text).digest('hex'));for(const quote of source.quotes)assert.ok(record.text.includes(quote));assert.notEqual(source.id,441);}
console.log('PASS bounded #550/#130/#136 source claims, actual text hashes and app-vs-source allocation boundaries');
// Optional exact-checkpoint comparison, reproducible without copying an old
// engine into the repository. This diagnoses strength-target compatibility.
if(process.env.STRENGTH_LAB_BASELINE_ENGINE){
 const prior=require(process.env.STRENGTH_LAB_BASELINE_ENGINE);let prescriptions=0,plans=0;
 for(const id of Object.keys(E.MOVES))for(const readiness of ['normal','low']){const s=fresh(60);assert.deepEqual(E.prescription(s,id,{...opts,readiness}),prior.prescription(s,id,{...opts,readiness}));prescriptions++;}
 for(const block of Object.keys(E.BLOCKS))for(const minutes of [30,45,60])for(const readiness of ['normal','low'])for(const mode of ['single','coordinated','protected']){const s=fresh(minutes);s.programBlock=block;s.programComposition={enabled:mode!=='single',blocks:[block],...(mode==='protected'?{coreBlock:block}:{}),continuity:true,minGapDays:1};assert.deepEqual(E.plan(s,{...opts,readiness}),prior.plan(s,{...opts,readiness}));plans++;}
 console.log('PASS exact baseline compatibility: '+prescriptions+' normal/reduced prescriptions and '+plans+' generated strength plans unchanged');
}
