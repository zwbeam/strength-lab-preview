/* Training notebook: presentation/actuals only; movement programming stays in engine.js. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./engine.js'):root.StrengthEngine);if(typeof module==='object'&&module.exports)module.exports=api;else root.TrainingNotebook=api;})(typeof globalThis!=='undefined'?globalThis:this,function(E){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x));
const reduced=rx=>['baseline','recovery','reentry','rebuild','deload','time-fit','review','prerequisite'].includes(rx.mode);
function structure(rx){return rx.roundSeconds?`${rx.roundSeconds===60?'Every minute (EMOM)':`Every ${rx.roundSeconds} seconds`} · remaining round time is rest`:rx.durationScope==='total'?`Alternating single reps · ${rx.reps} seconds total under load`:rx.continuous?`Continuous sets · no inter-set rest · ${rx.betweenExercises||0}s between movements`:`Straight ${rx.timed?'timed':'rep'} sets · ${rx.rest}s rest between sets`;}
function differences(original,adjusted){const lines=[];for(const rx of original.items){const next=adjusted.items.find(x=>x.id===rx.id);if(!next)lines.push(`${rx.name}: deferred; not counted as completed`);else if(['sets','reps','weight','rest'].some(k=>next[k]!==rx[k])||next.mode!==rx.mode)lines.push(`${rx.name}: ${rx.sets} × ${rx.reps} → ${next.sets} × ${next.reps}${next.timed?' sec':''}${reduced(next)?'; reduced practice, no advancement credit':''}`);}for(const rx of adjusted.items)if(!original.items.some(x=>x.id===rx.id))lines.push(`${rx.name}: included as eligible work that fits`);return lines;}
function cycle(s,opts={}){
 const through=typeof opts.now==='string'?opts.now:new Date(opts.now??Date.now()).toLocaleDateString('sv-SE');
 const count=s.sessions.filter(x=>x.date<=through).length,rows=[],sim=copy(s),span=s.programComposition?.enabled?Math.max(3,s.programComposition.blocks.length):Math.max(3,E.BLOCKS[s.programBlock||'abc'].days.length);
 // Only sequence placeholders are projected: never fabricate successful training,
 // future skill confirmations, dates, load increases or progression evidence.
 const offset=Math.max(0,Math.min(90,Number(opts.offset)||0));
 for(let i=0;i<offset+Math.min(12,span);i++){
  const p=E.plan(sim,{...opts,projection:i>0,minutes:s.defaultMinutes||45,readiness:'normal'});
  rows.push({number:count+i+1,key:String(count+i+1),plan:p,provisional:i>0});
  if(sim.programComposition?.enabled){const ids=sim.programComposition.blocks,at=ids.indexOf(p.block);sim.programComposition.blocks=[...ids.slice(at+1),...ids.slice(0,at+1)];
   // Coordinate by existing last-practiced ordering, with a separate ordering marker.
   const seen=new Set(rows.map(x=>x.plan.block));const remaining=ids.filter(x=>!seen.has(x));
   if(remaining.length)sim.programComposition.blocks=remaining;else sim.programComposition.blocks=copy(s.programComposition.blocks);
  }
  sim.sessions.push({id:'preview-only-'+i,block:p.block,slot:p.slot,date:'9999-12-31',items:[]});
 }
 return rows.slice(offset);
}
function adjusted(s,opts={}){const original=E.plan(s,{minutes:s.defaultMinutes||45,readiness:'normal'}),plan=E.plan(s,{minutes:opts.minutes??s.defaultMinutes??45,readiness:opts.readiness==='low'?'low':'normal'});return{original,plan,adjustments:{normalMinutes:s.defaultMinutes||45,minutes:plan.budget.total,readiness:opts.readiness||'normal',changes:differences(original,plan)}};}
function newItems(plan){return plan.items.map(rx=>({id:rx.id,sets:Array.from({length:rx.sets},()=>({done:false,reps:rx.reps,weight:rx.weight,...(rx.station?{stationHeightCm:rx.station.heightCm,...(rx.station.kind==='rowBar'?{legPosition:rx.station.legPosition}:{stepPattern:rx.station.stepPattern})}:{})})),quality:'clean',pain:false}));}
function finishItems(d,choice){
 if(!['all','partial'].includes(choice))throw Error('Choose how this workout was completed');
 return d.items.map((item,i)=>{const rx=d.plan.items[i],actual=copy(item);actual.sets.forEach(set=>{
  if(set.skipped)set.done=false;
  else if(choice==='all'){set.done=true;if(rx.side===2&&set.bothSides===undefined)set.bothSides=true;if(rx.continuous&&set.continuous===undefined)set.continuous=true;if(rx.roundSeconds&&set.timingValid===undefined)set.timingValid=true;}
  if(set.done&&(!E.validWorkingWeight(rx.id,set.weight)||!Number.isInteger(set.reps)||set.reps<=0))throw Error(`Enter actual load and reps/seconds for ${rx.name}, or mark the set skipped`);
  if(set.done&&rx.station?.kind==='rowBar'&&(!Number.isFinite(set.stationHeightCm)||set.stationHeightCm<1||set.stationHeightCm>250||!['bent','straight'].includes(set.legPosition)))throw Error('Record the actual row-bar setup before saving');
  if(set.done&&rx.station?.kind==='stepPlatform'&&(!Number.isFinite(set.stationHeightCm)||set.stationHeightCm<1||set.stationHeightCm>100||!['alternating','static'].includes(set.stepPattern)))throw Error('Record the actual step-platform height and stepping pattern before saving');
  if(set.done&&rx.side===2&&(set.bothSides!==true||!Number.isInteger(set.leftReps)||!Number.isInteger(set.rightReps)||set.leftReps<=0||set.rightReps<=0))throw Error(`Record actual left and right repetitions and confirm both sides for ${rx.name}; the app cannot infer bilateral work`);
 });return actual;});
}
function records(plan,items){return plan.items.map((rx,i)=>({...E.completeRecord(rx,items[i].sets,items[i].quality,items[i].pain),prescription:copy(rx),note:items[i].note||''}));}
function status(items,outcome='complete'){
 if(!items.some(x=>x.actualSets>0))return 'No work recorded';
 if(outcome==='partial')return 'Partially completed';
 if(items.some(x=>!Array.isArray(x.sets)))return 'Recorded work (older summary)';
 const exact=items.every(x=>x.performed!==false&&x.quality==='clean'&&!x.pain&&x.sets.filter(s=>s.done&&!s.skipped).length===x.targetSets&&x.sets.filter(s=>s.done&&!s.skipped).every(s=>s.reps===x.targetReps&&Number(s.weight)===Number(x.prescription?.weight??x.weight)&&(s.restSeconds===undefined||s.restSeconds===x.rest)&&(s.roundSeconds===undefined||s.roundSeconds===x.roundSeconds)&&(!x.prescription?.station||s.stationHeightCm===x.prescription.station.heightCm&&(x.prescription.station.kind==='rowBar'?s.legPosition===x.prescription.station.legPosition:s.stepPattern===x.prescription.station.stepPattern))));
 return exact?'Completed as prescribed':'Completed with modifications';
}
function prescription(record){if(record.prescription)return copy(record.prescription);const m=E.MOVES[record.id];return{...copy(record),legacyTargetUnverified:true,name:m.name,unit:m.unit,sets:record.targetSets,reps:record.targetReps,weight:record.weight,side:m.side,timed:!!m.timed,bodyweight:!!m.bodyweight,rest:record.rest};}
function historyDraft(session){if(session.items.some(x=>!Array.isArray(x.sets)))throw Error('This older record has no set-level data; export it before making a manual correction');return{plan:{...(session.plan||{}),items:session.items.map(prescription)},items:session.items.map(x=>({id:x.id,sets:copy(x.sets),quality:x.quality,pain:!!x.pain,note:x.note||''})),date:session.date,notes:session.notes||'',outcome:session.finishOutcome||'complete'};}
function reconcile(s,affected){
 // All progression/eligibility is replayed from history by E; no cached credits exist.
 // Rebuild unfinished queues chronologically, and withdraw pending load selections
 // for corrected movements so an obsolete milestone cannot silently raise a load.
 s.deferredByBlock={};s.deferredIds=[];
 for(const session of [...s.sessions].sort((a,b)=>a.date.localeCompare(b.date))){const block=session.block||'abc',plan=session.plan||{deferred:[]};const pending=s.deferredByBlock[block]||[];s.deferredByBlock[block]=E.deferredAfter({...plan,deferred:[...new Set([...pending,...(plan.deferred||[])])]},session.items);}
 s.deferredIds=s.deferredByBlock.abc||[];
 for(const id of affected)if(s.nextWeights)delete s.nextWeights[id];
 return s;
}
function correct(s,id,edit,reason='User correction',at=new Date().toISOString()){
 const next=copy(s),session=next.sessions.find(x=>x.id===id);if(!session)throw Error('Workout no longer exists');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(edit.date)||(!Number.isFinite(Date.parse(edit.date+'T12:00:00Z'))||new Date(edit.date+'T12:00:00Z').toISOString().slice(0,10)!==edit.date))throw Error('Enter an actual completion date');
 const before={date:session.date,items:copy(session.items),notes:session.notes||'',status:session.status||status(session.items),finishOutcome:session.finishOutcome||'complete'};
 const plan=historyDraft(session).plan,actual=records(plan,edit.items).map((record,i)=>{const old=session.items[i],item=edit.items[i];return !old.prescription&&JSON.stringify(old.sets)===JSON.stringify(item.sets)&&old.quality===item.quality&&!!old.pain===!!item.pain?{...copy(old),note:item.note||''}:record;});
 if(actual.some(x=>x.pain||x.quality==='pain'))for(const x of actual.filter(x=>x.pain||x.quality==='pain'))if(!before.items.find(y=>y.id===x.id&&(y.pain||y.quality==='pain'))&&next.painResolutions)delete next.painResolutions[x.id];
 session.corrections=[...(session.corrections||[]),{at,reason,before}];session.date=edit.date;session.notes=edit.notes||'';session.items=actual;session.finishOutcome=edit.outcome==='partial'||!actual.every(x=>x.performed)?'partial':'complete';session.status=status(actual,session.finishOutcome);session.lastEdited=at;
 return reconcile(next,actual.map(x=>x.id));
}
function undo(s,id,at=new Date().toISOString()){
 const session=s.sessions.find(x=>x.id===id),revision=session?.corrections?.at(-1);if(!revision)throw Error('No correction to restore');
 const next=copy(s),target=next.sessions.find(x=>x.id===id),before={date:target.date,items:copy(target.items),notes:target.notes||'',status:target.status||status(target.items),finishOutcome:target.finishOutcome||'complete'};
 Object.assign(target,copy(revision.before));target.lastEdited=at;target.corrections.push({at,reason:'Restore previous version',before});
 return reconcile(next,target.items.map(x=>x.id));
}
return{copy,structure,differences,cycle,adjusted,newItems,finishItems,records,status,prescription,historyDraft,reconcile,correct,undo};
});
