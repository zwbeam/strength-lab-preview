'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),{E,N,C,fresh,actual}=require('./fixtures/core-window.cjs');
const date='2026-01-05',copy=x=>JSON.parse(JSON.stringify(x));
function fixture(kind='full',today=date){
 let s=fresh(60);s.programComposition.enabled=false;s=E.configureMovement(s,'press',{profile:'legacy',stallStrategy:'redistribute'});
 for(let i=0;i<2;i++){const when=C.add(today,-4+i*2),rx=E.prescription(s,'press',{now:when}),p={items:[rx]},a=actual(p);a[0].quality='hard';if(kind==='partial-reps')a[0].sets[0].leftReps=rx.reps-1;if(kind==='partial-sets')a[0].sets.at(-1).done=false;
 s.sessions.push({id:'stall-'+i,date:when,title:'Actual difficult press work',items:N.records(p,a)});}
 return s;
}
if(require.main===module){
for(const kind of ['full','partial-reps','partial-sets']){
 const s=fixture(kind),snapshot=JSON.stringify(s),st=E.stateFor(s,'press',{now:date}),rx=E.prescription(s,'press',{now:date});
 assert.equal(st.fail,2);assert.equal(rx.mode,'rebuild');assert.equal(rx.reps,Math.max(1,Math.floor(st.reps*(kind==='full'?.8:.6))),kind+' must use actual completion, not the Hard label alone');
 assert.equal(rx.sets,Math.ceil(st.sets*st.reps/rx.reps));assert.ok(rx.sets*rx.reps>=st.sets*st.reps);assert.ok(rx.sets*rx.reps<st.sets*st.reps+rx.reps);assert.equal(JSON.stringify(s),snapshot);
 const edit=N.historyDraft(s.sessions.at(-1));edit.items[0].sets[0].leftReps=st.reps-1;const corrected=N.correct(s,'stall-1',edit);assert.equal(E.prescription(corrected,'press',{now:date}).reps,Math.floor(st.reps*.6));assert.deepEqual(E.prescription(N.undo(corrected,'stall-1'),'press',{now:date}),rx);
 const completed=N.records({items:[rx]},actual({items:[rx]}))[0];assert.equal(completed.completed,false);assert.equal(completed.performed,true);s.sessions.push({id:'delivered-rebuild',date,title:'Nonadvancing recovery',items:[completed]});assert.equal(E.stateFor(s,'press',{now:date}).stage,st.stage);assert.equal(E.stateFor(s,'press',{now:date}).fail,0);E.validateBackup(s);
}
for(const kind of ['full','partial-reps']){
 const s=fixture(kind),foreign=E.configureMovement(s,'press',{profile:'legacy',stallStrategy:'redistribute',exposures:3}),rx=E.prescription(foreign,'press',{now:date}),a=actual({items:[rx]});a[0].quality='hard';if(kind==='full')a[0].sets[0].leftReps=rx.reps-1;
 s.sessions.push({id:'different-method-feedback',date,title:'Independent method actuals',items:N.records({items:[rx]},a)});
 assert.equal(E.stateFor(s,'press',{now:date}).fail,2);assert.equal(E.prescription(s,'press',{now:date}).reps,kind==='full'?4:3,'Another method cannot select the current method recovery branch');
}
console.log('PASS different-method actuals cannot replace the current method stall evidence');
const loadScoped=fixture('full'),otherLoad=copy(loadScoped);otherLoad.weights.press=16;
const otherLoadRx=E.prescription(otherLoad,'press',{now:date}),otherLoadActual=actual({items:[otherLoadRx]});otherLoadActual[0].quality='hard';otherLoadActual[0].sets[0].leftReps=otherLoadRx.reps-1;
loadScoped.sessions.push({id:'other-load-feedback',date,title:'Independent written load',items:N.records({items:[otherLoadRx]},otherLoadActual)});
assert.equal(E.stateFor(loadScoped,'press',{now:date}).weight,12);assert.equal(E.stateFor(loadScoped,'press',{now:date}).fail,2);assert.equal(E.prescription(loadScoped,'press',{now:date}).reps,4);E.validateBackup(loadScoped);
console.log('PASS another written load cannot replace current-load stall feedback or working weight');
let pairedRow=E.configureMovement(fresh(60),'bodyweightRow',{profile:'rowWave',cleanBaseline:10,baselineHeightCm:100,stallStrategy:'redistribute'});
for(let n=0;n<1;n++){const rx=E.prescription(pairedRow,'bodyweightRow',{now:date});pairedRow.sessions.push({id:'row-lower-'+n,date,title:'Actual lower-track work',items:N.records({items:[rx]},actual({items:[rx]}))});}
const higher=E.prescription(pairedRow,'bodyweightRow',{now:date});assert.equal(higher.track,'higher');
for(let n=0;n<2;n++){const a=actual({items:[higher]});a[0].quality='hard';a[0].sets[0].reps=higher.reps-1;pairedRow.sessions.push({id:'retained-higher-'+n,date,title:'Retained written higher-track target',items:N.records({items:[higher]},a)});}
const rowState=E.stateFor(pairedRow,'bodyweightRow',{now:date});assert.equal(rowState.fail,2);assert.equal(rowState.track,'lower');assert.equal(E.prescription(pairedRow,'bodyweightRow',{now:date}).reps,Math.floor(rowState.reps*.6),'Row-wave recovery retains joint paired-track failure evidence');E.validateBackup(pairedRow);
console.log('PASS row-wave joint-track recovery remains distinct from independent heavy/light wave failures');
// A mixed workout can contain real work while this movement has zero finished sets.
// Explicit difficulty remains unfinished evidence; an ordinary skip stays neutral.
for(const quality of ['hard','breakdown','clean']){
 const s=fixture('full'),rx=E.prescription(s,'press',{now:date}),support=E.prescription(s,'squat',{now:date}),p={items:[support,rx]},a=actual(p);
 a[1].sets.forEach(set=>{set.done=false;});a[1].quality=quality;
 const rows=N.records(p,a);assert.ok(rows[0].actualSets>0);assert.equal(rows[1].actualSets,0);
 const session={id:'mixed-zero-feedback',date,title:'Real mixed work and unfinished press',items:rows};s.sessions.push(session);
 const expected=quality==='clean'?4:3,snapshot=JSON.stringify(s);
 assert.equal(E.stateFor(s,'press',{now:date}).fail,2);assert.equal(E.prescription(s,'press',{now:date}).reps,expected,'Zero-set '+quality+' feedback must not masquerade as completed work');assert.equal(JSON.stringify(s),snapshot);
 assert.equal(E.prescription(E.validateBackup(copy(s)),'press',{now:date}).reps,expected);
 const edit=N.historyDraft(session);edit.items[1].sets.forEach(set=>{set.done=true;});const corrected=N.correct(s,session.id,edit);assert.equal(E.prescription(corrected,'press',{now:date}).reps,quality==='clean'?5:4);assert.equal(E.prescription(N.undo(corrected,session.id),'press',{now:date}).reps,expected);
 const future=copy(s);future.sessions.at(-1).date=C.add(date,7);assert.equal(E.prescription(future,'press',{now:date}).reps,4);assert.equal(E.prescription(future,'press',{now:C.add(date,7)}).reps,expected);E.validateBackup(future);
}
console.log('PASS explicit zero-set difficulty versus ordinary skips, genuine mixed work, correction/undo, future isolation and immutable backup replay');
for(const quality of ['hard','breakdown','clean']){
 let s=fresh(60);s.programComposition.enabled=false;s=E.configureMovement(s,'press',{profile:'legacy',stallStrategy:'redistribute'});
 for(let n=0;n<2;n++){const when=C.add(date,-4+n*2),p={items:[E.prescription(s,'squat',{now:when}),E.prescription(s,'press',{now:when})]},a=actual(p);a[1].sets.forEach(set=>{set.done=false;});a[1].quality=quality;const rows=N.records(p,a);assert.ok(rows.some(x=>x.actualSets>0));s.sessions.push({id:'zero-only-'+n,date:when,title:'Mixed actual work, no completed press sets',items:rows});}
 const st=E.stateFor(s,'press',{now:date}),rx=E.prescription(s,'press',{now:date});assert.equal(st.stage,0);assert.equal(st.cycles,0);assert.equal(E.practiceEvidence(s,'press',{now:date}).count,0);assert.equal(st.fail,quality==='clean'?0:2);assert.equal(rx.mode,quality==='clean'?'volume':'rebuild');assert.equal(rx.reps,quality==='clean'?5:3);assert.ok(E.records(s,'press').every(x=>x.actualSets===0));E.validateBackup(s);
}
console.log('PASS zero completed sets never earn progress or qualification; explicit difficulty uses unfinished recovery while clean skips do not invent a stall');
for(const foreignKind of ['method','load','empty-target']){
 const s=fixture('full'),other=foreignKind==='method'?E.configureMovement(s,'press',{profile:'legacy',stallStrategy:'redistribute',exposures:3}):copy(s);if(foreignKind==='load')other.weights.press=16;
 let rx=E.prescription(other,'press',{now:date});if(foreignKind==='empty-target')rx={...rx,mode:'prerequisite',sets:0};const p={items:[E.prescription(s,'squat',{now:date}),rx]},a=actual(p);a[1].sets.forEach(set=>{set.done=false;});a[1].quality='hard';const rows=N.records(p,a);if(foreignKind==='empty-target'){delete rows[1].prescription;delete rows[1].sets;}s.sessions.push({id:'foreign-zero-'+foreignKind,date,title:'Mixed actual work with scoped zero-set feedback',items:rows});
 assert.equal(E.prescription(s,'press',{now:date}).reps,4,foreignKind+' zero-set feedback must not replace current positive-target evidence');assert.equal(E.stateFor(s,'press',{now:date}).weight,12);E.validateBackup(s);
}
console.log('PASS method/load boundaries and empty-target exclusion also apply to explicit zero-set difficulty');
let cases=0;
for(const id of ['press','squat','row','swing','clean','bodyweightRow','bodyweightSquat'])for(const minutes of [30,45,60])for(const partial of [false,true]){
 let s=fresh(minutes);s.programComposition.enabled=false;s=E.configureMovement(s,id,{profile:E.policyFor(id,s).profile,stallStrategy:'redistribute'});
 for(let n=0;n<2;n++){const rx=E.prescription(s,id,{now:date}),p={items:[rx]},a=actual(p);assert.ok(rx.sets>0);a[0].quality='hard';if(partial)a[0].sets.at(-1).done=false;s.sessions.push({id:'matrix-'+n,date,title:'Comparable difficult actuals',items:N.records(p,a)});}
 const st=E.stateFor(s,id,{now:date}),rx=E.prescription(s,id,{now:date}),history=JSON.stringify(s.sessions);assert.equal(rx.mode,'rebuild');assert.equal(rx.reps,Math.max(1,Math.floor(st.reps*(partial?.6:.8))));assert.equal(rx.sets,Math.ceil(st.sets*st.reps/rx.reps));assert.ok(E.plan(s,{now:date}).total<=minutes);assert.equal(JSON.stringify(s.sessions),history);assert.equal(E.stateFor(s,id,{now:date}).weight,st.weight);assert.deepEqual(E.prescription(E.validateBackup(copy(s)),id,{now:date}),rx);cases++;
}
assert.equal(cases,42);
console.log('PASS 42 loaded/bodyweight stall branches under 30/45/60-minute ceilings, immutable replay and unchanged working loads');
const source=require('../sources-08.json').find(x=>x.id===259),evidence=require('../research/stall-recovery-evidence.json');assert.equal(crypto.createHash('sha256').update(source.text).digest('hex'),evidence.source.sha256);for(const quote of evidence.source.quotes)assert.ok(source.text.includes(quote));assert.notEqual(source.id,441);
console.log('PASS completed versus partial stall recovery, whole-unit workload, correction/undo, no progression, immutable history and source #259 quotes');
}
module.exports={fixture};
