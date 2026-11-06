/* Pacing only: this controller never records sets, skill or progression evidence. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SessionTimer=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const MODES=['manual','automatic','hybrid'];
const mode=d=>MODES.includes(d?.timerMode)?d.timerMode:'automatic'; // Existing drafts retain their old behavior.
const remaining=(c,now=Date.now())=>c?.running?Math.max(0,Math.ceil((c.endAt-now)/1000)):Math.ceil(Math.max(0,c?.remaining||0));
function queue(d){const result=[];d.plan.items.forEach((rx,i)=>{
 const continuous=rx.continuous,sets=continuous?1:rx.sets;
 for(let j=0;j<sets;j++){
  const work=Math.max(1,Math.round((rx.secondsPerSet||rx.reps||30)*(continuous?rx.sets:1)));
  result.push({kind:'work',item:i,set:continuous?null:j,seconds:work,roundSeconds:rx.roundSeconds||null,estimated:!rx.timed,label:`${rx.name} · ${continuous?'continuous practice':'set '+(j+1)}`});
  const more=j<sets-1||i<d.plan.items.length-1;
  const rest=continuous?(i<d.plan.items.length-1?rx.betweenExercises||0:0):rx.roundSeconds?Math.max(0,rx.roundSeconds-work):rx.rest||0;
  if(more&&rest>0)result.push({kind:'rest',item:i,set:continuous?null:j,seconds:rest,roundSeconds:rx.roundSeconds||null,label:(continuous?'Rest between movements':'Rest')+' · '+rx.name});
 }
 });return result;}
function prepare(d,index,now=Date.now(),start=false,confirm=false,seconds=null){const q=queue(d),entry=q[index];d.timerIndex=index;
 if(!entry){d.clock={label:'Timing complete · review your set log',remaining:0,running:false,kind:'complete',completed:true};return;}
 d.clock={...entry,cursor:index,sequence:true,remaining:seconds??entry.seconds,running:false,awaitConfirmation:confirm};
 if(start)resume(d,now);
}
function resume(d,now=Date.now()){const c=d.clock;if(!c||c.running||!c.remaining)return;c.running=true;c.awaitConfirmation=false;c.startedAt=now;c.endAt=now+c.remaining*1000;}
function pause(d,now=Date.now()){if(!d.clock)return;d.clock.remaining=remaining(d.clock,now);d.clock.running=false;delete d.clock.endAt;}
function enterWork(d,now=Date.now(),confirmed=true){d.stage='work';d.workStarted??=new Date(now).toISOString();prepare(d,0,now,mode(d)==='automatic'||mode(d)==='hybrid'&&confirmed,mode(d)==='hybrid'&&!confirmed);}
function custom(d,seconds,label,now=Date.now(),start=true){d.clock={label,kind:d.stage==='work'?'work':d.stage,remaining:Math.max(0,Math.round(seconds)),running:false};if(start)resume(d,now);}
function advance(d,at=Date.now(),user=false){const c=d.clock;if(!c)return;
 if(!c.sequence){
  c.remaining=0;c.running=false;c.completed=true;delete c.endAt;
  if(c.kind==='warmup'&&mode(d)!=='manual')enterWork(d,at,false);
  return;
 }
 const q=queue(d);let index=c.cursor+1,next=q[index],seconds=null;
 if(next?.kind==='rest'&&next.roundSeconds&&Number.isFinite(c.startedAt))seconds=Math.max(0,next.roundSeconds-(at-c.startedAt)/1000);
 if(next?.kind==='rest'&&seconds===0){index++;next=q[index];seconds=null;}
 const boundary=next?.kind==='work'&&next.item!==c.item;
 prepare(d,index,at,mode(d)!=='manual'&&!(mode(d)==='hybrid'&&boundary),mode(d)==='hybrid'&&boundary,seconds);
}
function tick(d,now=Date.now()){let changed=false;for(let n=0;n<queue(d).length+2&&d.clock?.running&&remaining(d.clock,now)===0;n++){const at=d.clock.endAt;advance(d,at);changed=true;}return changed;}
function firstUnlogged(d){const q=queue(d);return q.findIndex(x=>x.kind==='work'&&(x.set===null?d.items[x.item].sets.some(s=>!s.done):!d.items[x.item].sets[x.set].done));}
function primary(d,now=Date.now()){const c=d.clock;
 if(c?.running){pause(d,now);return;}
 if(c?.remaining){resume(d,now);return;}
 if(d.stage==='warmup'&&c?.completed){enterWork(d,now,true);if(mode(d)==='manual')resume(d,now);return;}
 if(d.stage==='work'){const index=firstUnlogged(d);if(index>=0){prepare(d,index,now,true);return;}custom(d,30,'Additional pacing',now,true);return;}
 custom(d,(d.stage==='cooldown'?d.plan.budget.cooldown:d.plan.budget.warmup)*60,d.stage==='cooldown'?'Cooldown':'Warmup',now,true);
}
function add(d,seconds=30,now=Date.now()){if(!d.clock||d.clock.completed){custom(d,seconds,'Additional pacing',now,false);return;}const c=d.clock;c.remaining=remaining(c,now)+seconds;if(c.running)c.endAt=now+c.remaining*1000;}
function skip(d,now=Date.now()){if(d.clock)advance(d,now,true);}
function logged(d,i,j,value,now=Date.now()){
 if(!value){const index=queue(d).findIndex(x=>x.kind==='work'&&x.item===i&&(x.set===j||x.set===null));if(index>=0)prepare(d,index,now,false);return;}
 if(d.items.every(item=>item.sets.every(set=>set.done))){prepare(d,queue(d).length,now);return;}
 if(!d.clock){const index=queue(d).findIndex(x=>x.kind==='work'&&x.item===i&&(x.set===j||x.set===null));if(index>=0)prepare(d,index,now,false);}
 const c=d.clock;if(c?.kind==='work'&&c.item===i&&(c.set===j||c.set===null&&d.items[i].sets.every(set=>set.done)))advance(d,now,true);
}
return{MODES,mode,remaining,queue,prepare,resume,pause,enterWork,custom,advance,tick,primary,add,skip,logged};
});
