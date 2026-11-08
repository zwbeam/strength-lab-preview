/* Flexible opportunities, never a dated ledger of earned strength work. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./engine.js'):root.StrengthEngine);if(typeof module==='object'&&module.exports)module.exports=api;else root.RollingCalendar=api;})(typeof globalThis!=='undefined'?globalThis:this,function(E){
'use strict';
const TYPES={mountain:'Mountain bike',gravel:'Gravel ride',road:'Road ride',indoor:'Indoor ride',hiking:'Hiking',trail:'Trail building',labor:'Physical labor',other:'Other substantial activity'};
const iso=x=>new Date(x).toISOString().slice(0,10),add=(d,n)=>iso(Date.parse(d+'T12:00:00Z')+n*86400000),diff=(a,b)=>Math.round((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000);
function monday(d){return add(d,-((new Date(d+'T12:00:00Z').getUTCDay()+6)%7));}
function count(s){return s.sessions.filter(x=>(x.items||[]).some(y=>y.actualSets>0)&&(x.calendarVersion!==1||x.items.every(y=>y.performed===true))).length;}
function key(s,i=0){return (s.programComposition?.enabled?s.programComposition.blocks.join('+'):s.programBlock||'abc')+':'+(count(s)+i);}
function pause(s,now){return E.trainingPaused(s,now);}
function project(s,now,end=add(now,83),opts={}){
 const entries=[],days=s.trainingPreferences?.daysPerWeek||3,virtual=JSON.parse(JSON.stringify(s)),planned=[],history=s.sessions.filter(x=>x.date<=now&&(x.items||[]).some(y=>y.actualSets>0)).sort((a,b)=>a.date.localeCompare(b.date)),last=history.at(-1)?.date;
 let cursor=[now,s.resumeDate||now,s.paused&&s.pauseUntil||now,last?add(last,Math.max(1,Math.floor(7/days))):now].sort().at(-1),i=0,remaining=virtual.programComposition?.blocks?.slice();
 if(s.calendarMoves?.[key(s)])cursor=[cursor,s.calendarMoves[key(s)]].sort().at(-1);
 if(pause(s,now)&&!s.pauseUntil)return entries;
 for(let attempts=0;cursor<=end&&attempts<180;attempts++,cursor=add(cursor,1)){
  if(pause(s,cursor))continue;
  const move=s.calendarMoves?.[key(s,i)];if(move&&cursor<move)continue;
  const activeActivities=(s.activities||[]).filter(a=>a.status==='completed'||a.date>=now);
  const events=activeActivities.filter(a=>a.date===cursor),recent=activeActivities.some(a=>a.date<=cursor&&diff(cursor,a.date)<E.activityRecovery(a));
  if(events.some(a=>a.replacesStrength!==false)||recent)continue;
  if(s.sessions.some(x=>x.date===cursor&&(x.items||[]).some(y=>y.actualSets>0)))continue;
  const allDays=[...new Set([...history.map(x=>x.date),...planned.map(x=>x.date)])];if(allDays.filter(d=>diff(cursor,d)>=0&&diff(cursor,d)<7).length>=days)continue;
  const p=E.plan(virtual,{now:cursor,minutes:cursor===now&&i===0?opts.minutes??s.defaultMinutes??45:s.defaultMinutes||45,readiness:cursor===now&&i===0?opts.readiness:'normal'});if(!p.items.length)continue;
  const spacing=Math.max(s.trainingDefaults?.minGapDays||0,s.programComposition?.enabled?s.programComposition.minGapDays??1:0);
  if(planned.some(x=>diff(cursor,x.date)<spacing&&x.plan.items.some(a=>p.items.some(b=>E.movementDemands(a.id).some(k=>E.movementDemands(b.id).includes(k))))))continue;
  if(s.trainingPreferences?.beginnerSpacing&&planned.some(x=>diff(cursor,x.date)<2&&x.plan.items.some(a=>p.items.some(b=>a.id===b.id))))continue;
  const hard=rx=>rx.track==='heavy'||rx.profile==='grind'||rx.mode==='density';
  if(s.programComposition?.enabled&&p.items.some(hard)&&planned.some(x=>diff(cursor,x.date)<(s.programComposition.hardGapDays??2)&&x.plan.items.some(hard)))continue;
  const row={date:cursor,key:key(s,i),index:i,plan:p,provisional:i>0||cursor!==now,reason:move?'Manually moved; recovery and order still apply.':i===0?'Next unfinished workout; missed dates never consume it.':'Flexible target; shifts with actual training and recovery.'};entries.push(row);planned.push(row);
  virtual.sessions.push({id:'calendar-projection-'+i,slot:p.slot,block:p.block,date:'9999-12-31',items:[]});
  if(virtual.programComposition?.enabled){remaining=remaining.filter(b=>b!==p.block);if(!remaining.length)remaining=s.programComposition.blocks.slice();virtual.programComposition.blocks=remaining.slice();}
  i++;cursor=add(cursor,Math.max(0,Math.floor(7/days)-1));
 }
 return entries;
}
function week(s,now,start=monday(now),opts={}){
 const planned=project(s,now,[add(start,6),add(now,6)].sort().at(-1),opts);
 return Array.from({length:7},(_,i)=>{const date=add(start,i),sessions=s.sessions.filter(x=>x.date===date),activities=(s.activities||[]).filter(a=>a.date===date),workout=planned.find(x=>x.date===date);return{date,sessions,activities,workout,today:date===now,paused:pause(s,date),label:workout?workout.plan.day.name:pause(s,date)?'Paused':'Recovery / flexible',reason:pause(s,date)?'Queue frozen; activity logging is optional.':!workout?'Rest, outside activity, or current eligibility/recovery constraints.':'Dates are flexible opportunities.'};});
}
function reschedule(s,queueKey,date,now){if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||iso(Date.parse(date+'T12:00:00Z'))!==date||date<now)throw Error('Choose today or a future date');return{...s,calendarMoves:{...s.calendarMoves,[queueKey]:date}};}
function activity(s,input){const item={...input};E.validateActivity(item);const next=JSON.parse(JSON.stringify(s));const index=(next.activities||[]).findIndex(x=>x.id===item.id);next.activities=next.activities||[];if(index<0)next.activities.push(item);else{const old=next.activities[index];item.versions=[...(old.versions||[]),{at:new Date().toISOString(),before:{...old,versions:undefined}}];next.activities[index]=item;}return next;}
return{TYPES,add,diff,monday,key,count,project,week,reschedule,activity,pause};
});
