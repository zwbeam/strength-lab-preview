/* Strength Lab v33. All training data stays in the browser. */
'use strict';
const C=window.RollingCalendar,E=window.StrengthEngine,T=window.SessionTimer,N=window.TrainingNotebook,Learning=window.StrengthLearn.create(window.StrengthEngine,window.MovementInstruction),KEY='sl-dev-preview-data-v33',DRAFT='sl-dev-preview-draft-v33',JOURNAL='sl-dev-preview-transaction-v33';
const $=s=>document.querySelector(s),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Date().toLocaleDateString('sv-SE');
const fresh=()=>({version:33,defaultMinutes:45,sessions:[],weights:{},equipment:{kb:[8,12,16,20,24],club:[5,10,15]},nextWeights:{},trainingPreferences:{daysPerWeek:3},created:today()});
let storageRecoveryIssue=false,recoverySnapshot=null,storageReady=false,storageWritable=false,storageConflict=false,storageLockUnavailable=false,storageExpected=null;
function read(k,f){try{const raw=recoverySnapshot?(k===KEY?recoverySnapshot.state:k===DRAFT?recoverySnapshot.draft:localStorage.getItem(k)):localStorage.getItem(k);const v=JSON.parse(raw);return v&&typeof v==='object'?v:f;}catch{return f;}}
let state=read(KEY,fresh());if(state.version!==33||!Array.isArray(state.sessions))state=fresh();state.nextWeights=state.nextWeights||{};state.defaultMinutes=Math.max(30,Number(state.defaultMinutes)||45);state.deferredIds=Array.isArray(state.deferredIds)?state.deferredIds:[];let todayMinutes=state.defaultMinutes;
let draft=read(DRAFT,null),tab='today',readiness='normal',phase='warmup',timerEnd=0,timerInterval=null,learnMode='exercises',learnSelected=null,learnGear='',learnFamily='',learnQuery='',search='',sourceData=null,sourceCache={},openSource=null,searchFull=false,fullMatches=null;
let selectedWorkout=0,cyclePage=0,finishPanel=false,historyEdit=null,historyView=null,correctionNotice='';let notebookVisibleRows=60,movementVisibleRows=60;let historyDateFrom="",historyDateTo="",historyRangePreset="all";let selectedDate=today(),weekStart=C.monday(today()),activityEdit=null;const openEditors=new Set(),panelState=new Map();let focusExpanded=false;
const newIdentity=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
// A browser-managed lock owns writes for this page's lifetime, including recovery.
// Other tabs can read/export; they must close the writer and reload to edit.
function storageNotice(){
 if(storageConflict)return 'Saved data changed outside this tab. Editing is blocked to protect newer history. Export any unsaved work, then close other Strength Lab tabs and reload.';
 if(storageLockUnavailable)return 'This browser cannot safely coordinate saved writes. Use a current browser over HTTPS or localhost. Reading and export remain available.';
 if(!storageWritable)return 'Another Strength Lab tab is editing this training log. This tab is read-only. Close the other tab, then reload here to resume the latest saved workout.';
 return '';
}
function loadTrainingSnapshot(){
 if(!storageWritable){recoverySnapshot=null;try{const journal=JSON.parse(localStorage.getItem(JOURNAL));if(journal?.version===1&&[journal.state,journal.draft].every(v=>v===null||typeof v==='string'))recoverySnapshot=journal;}catch{}}
 state=read(KEY,fresh());if(state.version!==33||!Array.isArray(state.sessions))state=fresh();
 state.nextWeights=state.nextWeights||{};state.defaultMinutes=Number(state.defaultMinutes)||45;state.deferredIds=Array.isArray(state.deferredIds)?state.deferredIds:[];
 todayMinutes=state.defaultMinutes;draft=read(DRAFT,null);
 try{storageExpected={state:localStorage.getItem(KEY),draft:localStorage.getItem(DRAFT)};}catch{storageRecoveryIssue=true;}
}
function checkWriter(){
 if(!storageReady||!storageWritable||storageConflict||storageRecoveryIssue){alert(storageRecoveryIssue?'Storage recovery is pending; saved writes are blocked.':storageNotice()||'Training storage is still loading.');return false;}
 try{if(storageExpected&&(localStorage.getItem(KEY)!==storageExpected.state||localStorage.getItem(DRAFT)!==storageExpected.draft||localStorage.getItem(JOURNAL)!==null)){storageConflict=true;alert(storageNotice());render();return false;}}
 catch{alert('Could not check saved data. No write was attempted; export a backup before closing.');return false;}
 return true;
}
function rememberStorage(){storageExpected={state:localStorage.getItem(KEY),draft:localStorage.getItem(DRAFT)};}
async function initializeStorage(){
 const ready=()=>{loadTrainingSnapshot();storageReady=true;render();};
 if(!navigator.locks?.request){storageLockUnavailable=true;ready();return;}
 try{await navigator.locks.request('sl-dev-preview-v33-writer',{mode:'exclusive',ifAvailable:true},async lock=>{
  if(!lock){
   // Never roll back another tab's in-flight transaction; read its prior snapshot.
   try{const journal=JSON.parse(localStorage.getItem(JOURNAL));if(journal?.version===1)recoverySnapshot=journal;}catch{}
   ready();return;
  }
  storageWritable=true;recoverTrainingStorage();ready();
  await new Promise(()=>{}); // Released by the browser when the page is destroyed.
 });}catch{storageWritable=false;storageLockUnavailable=true;ready();}
}
// An unfinished journal is rolled back before loading state on the next page load.
function restoreTrainingPair(previous){
 for(const [key,value] of [[KEY,previous.state],[DRAFT,previous.draft]]){
  if(localStorage.getItem(key)===value)continue;
  if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);
 }
}
function recoverTrainingStorage(){
 try{const raw=localStorage.getItem(JOURNAL);if(raw===null)return;
  const previous=JSON.parse(raw);if(previous?.version!==1||![previous.state,previous.draft].every(value=>value===null||typeof value==='string'))throw Error('Invalid recovery journal');
  recoverySnapshot=previous;restoreTrainingPair(previous);localStorage.removeItem(JOURNAL);recoverySnapshot=null;
 }catch{storageRecoveryIssue=true;alert('Storage recovery could not finish. Saved data has not been discarded. Writes are blocked; keep this page open and export a backup before closing.');}
}
function persistTraining(nextState,nextDraft){
 if(!checkWriter())return false;
 let previous,journalWritten=false;
 try{
  previous={version:1,state:localStorage.getItem(KEY),draft:localStorage.getItem(DRAFT)};
  localStorage.setItem(JOURNAL,JSON.stringify(previous));journalWritten=true;
  localStorage.setItem(KEY,JSON.stringify(nextState));if(nextDraft)localStorage.setItem(DRAFT,JSON.stringify(nextDraft));else localStorage.removeItem(DRAFT);
  localStorage.removeItem(JOURNAL);rememberStorage();return true;
 }catch{let restored=true;
  if(journalWritten){try{restoreTrainingPair(previous);localStorage.removeItem(JOURNAL);}catch{restored=false;storageRecoveryIssue=true;recoverySnapshot=previous;}}
  alert(restored?'Could not save both training data and draft. Previous saved data was preserved; keep this page open and export a backup.':'Storage failed and recovery is pending. Saved writes are blocked; keep this page open and export a backup before closing.');return false;
 }
}
function save(){const saved=persistTraining(state,draft);if(!saved&&storageExpected){try{state=JSON.parse(storageExpected.state)||fresh();}catch{}}return saved;}
function saveDraft(){if(!checkWriter())return false;try{if(draft)localStorage.setItem(DRAFT,JSON.stringify(draft));else localStorage.removeItem(DRAFT);rememberStorage();return true;}catch{alert('Could not save the workout draft. Export your data before closing this page.');return false;}}
function currentPlan(){return draft?.plan||E.plan(state,{readiness,minutes:todayMinutes});}
// Interval pacing uses wall-clock deadlines; logging remains independent.
function activeTimer(){return draft?.clock||null;}
function changeTimer(mutate){if(!checkWriter()||!draft)return false;const previousClock=draft.clock?JSON.parse(JSON.stringify(draft.clock)):draft.clock;mutate();if(!saveDraft()){draft.clock=previousClock;updateTimer();return false;}updateTimer();return true;}
function timer(seconds,label='Rest'){changeTimer(()=>T.custom(draft,seconds,label,Date.now(),true));}
function timerRemaining(c){return T.remaining(c);}
function pauseTimer(){changeTimer(()=>T.pause(draft));}
function resumeTimer(){changeTimer(()=>T.resume(draft));}
function clearTimer(){if(!checkWriter()||!draft)return;const previousClock=draft.clock;draft.clock=null;if(!saveDraft()){draft.clock=previousClock;updateTimer();return;}clearInterval(timerInterval);updateTimer();}
function formatTime(sec){sec=Math.ceil(Math.max(0,sec));return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
let timerPanelOpen=false;
const SIMPLE_TIMER_KEY='sl-preview-interval-timer-v1';
function readSimpleTimer(){try{const v=JSON.parse(localStorage.getItem(SIMPLE_TIMER_KEY));if(v&&Number.isInteger(v.sets)&&v.sets>=1&&v.sets<=100)return v;}catch{}return {prepare:10,work:20,rest:10,sets:8,index:0,remaining:10,running:false,editing:true};}
let simpleTimer=readSimpleTimer();
let simpleTimerExpanded=false;
// A reload never silently resumes an interval; playback requires an explicit press.
simpleTimer.running=false;delete simpleTimer.endAt;
function simpleSequence(){const t=simpleTimer,q=[{phase:'PREPARE',seconds:t.prepare,set:0}];for(let i=1;i<=t.sets;i++){q.push({phase:'WORK',seconds:t.work,set:i});if(i<t.sets)q.push({phase:'REST',seconds:t.rest,set:i});}return q.filter(x=>x.seconds>0);}
function simpleCurrent(){return simpleSequence()[Math.min(simpleTimer.index,simpleSequence().length-1)]||{phase:'READY',seconds:0,set:0};}
function simpleRemaining(){return simpleTimer.running?Math.max(0,Math.ceil((simpleTimer.endAt-Date.now())/1000)):simpleTimer.remaining;}
function saveSimpleTimer(){try{localStorage.setItem(SIMPLE_TIMER_KEY,JSON.stringify(simpleTimer));}catch{}}
function simpleMove(index){const q=simpleSequence();simpleTimer.index=Math.max(0,Math.min(q.length-1,index));simpleTimer.remaining=q[simpleTimer.index]?.seconds||0;simpleTimer.running=false;delete simpleTimer.endAt;saveSimpleTimer();}
function simpleTimerAction(action){
 const t=simpleTimer,q=simpleSequence();
 if(action==='start'){t.index=0;t.remaining=q[0]?.seconds||0;t.editing=false;t.running=false;delete t.endAt;}
 else if(action==='pause'){if(t.running){t.remaining=simpleRemaining();t.running=false;delete t.endAt;}else if(t.remaining>0){t.running=true;t.endAt=Date.now()+t.remaining*1000;intervalSound(simpleCurrent().phase);}}
 else if(action==='previous'){if(simpleRemaining()<simpleCurrent().seconds)simpleMove(t.index);else simpleMove(t.index-1);}
 else if(action==='next')simpleMove(t.index+1);
 else if(action==='edit'){t.remaining=simpleRemaining();t.running=false;t.editing=true;delete t.endAt;}
 saveSimpleTimer();
}
let intervalAudio=null;
function intervalSound(kind){
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return;
  intervalAudio??=new Audio();
  if(intervalAudio.state==='suspended')intervalAudio.resume().catch(()=>{});
  const notes=kind==='WORK'?[880,1100]:kind==='REST'?[660,520]:kind==='DONE'?[880,880,1100]:[550];
  notes.forEach((hz,i)=>{const osc=intervalAudio.createOscillator(),gain=intervalAudio.createGain(),at=intervalAudio.currentTime+i*.15;
   osc.type='sine';osc.frequency.value=hz;gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.13,at+.015);gain.gain.exponentialRampToValueAtTime(.0001,at+.12);
   osc.connect(gain);gain.connect(intervalAudio.destination);osc.start(at);osc.stop(at+.13);
  });
 }catch{}
}
function simpleTimerTick(){
 if(simpleTimer.editing||!simpleTimer.running)return;
 let changed=false,now=Date.now(),q=simpleSequence();
 while(simpleTimer.running&&now>=simpleTimer.endAt){
  if(simpleTimer.index>=q.length-1){simpleTimer.running=false;simpleTimer.remaining=0;intervalSound('DONE');break;}
  const previousEnd=simpleTimer.endAt;simpleTimer.index++;simpleTimer.remaining=q[simpleTimer.index].seconds;simpleTimer.endAt=previousEnd+simpleTimer.remaining*1000;intervalSound(q[simpleTimer.index].phase);changed=true;
 }
 if(changed||!simpleTimer.running){saveSimpleTimer();render();return;}
 const remaining=$('#timer-current-time');if(remaining)remaining.textContent=formatTime(simpleRemaining());
 const total=$('#timer-total-time');if(total)total.textContent='Total remaining '+formatTime(simpleRemaining()+q.slice(simpleTimer.index+1).reduce((a,x)=>a+x.seconds,0));
}
function timerControls(){
 const t=simpleTimer,c=simpleCurrent(),q=simpleSequence(),left=simpleRemaining(),total=left+q.slice(t.index+1).reduce((a,x)=>a+x.seconds,0);
 if(t.editing)return `<details class="simple-timer-disclosure" ${simpleTimerExpanded?'open':''}><summary>Interval timer · Setup</summary><section class="card simple-timer"><div class="simple-timer-settings">${[['prepare','Prepare'],['work','Work'],['rest','Rest'],['sets','Sets']].map(([key,label])=>`<label>${label}<input type="number" inputmode="numeric" min="${key==='sets'?1:0}" max="${key==='sets'?100:3600}" value="${t[key]}" data-simple-timer-setting="${key}"></label>`).join('')}</div><button class="button" data-simple-timer-action="start">Start</button></section></details>`;
 return `<details class="simple-timer-disclosure" ${simpleTimerExpanded?'open':''}><summary>Interval timer · ${c.phase} · ${formatTime(left)}</summary><section class="card simple-timer simple-timer-active"><div class="timer-active-readout"><strong id="timer-phase">${c.phase}</strong><strong id="timer-current-time">${formatTime(left)}</strong><span id="timer-set">${c.phase==='PREPARE'?'Get ready':'Set '+c.set+' of '+t.sets}</span><span id="timer-total-time">Total remaining ${formatTime(total)}</span></div><div class="timer-navigation"><button class="button secondary" data-simple-timer-action="previous" aria-label="Restart interval or previous interval" title="Restart interval or previous interval">◀</button><button class="button secondary" data-simple-timer-action="pause" aria-label="${t.running?'Pause':'Resume'}" title="${t.running?'Pause':'Resume'}">${t.running?'Ⅱ':'▶Ⅱ'}</button><button class="button secondary" data-simple-timer-action="next" aria-label="Next interval" title="Next interval">▶</button><button class="button secondary smallbtn timer-edit-button" data-simple-timer-action="edit" aria-label="Edit intervals">Edit</button></div></section></details>`;
}

let timerCue='',audioContext=null,lastSignal='';
function unlockTimerAudio(){try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();audioContext.resume().catch(()=>{});}catch{}}
function timerBeep(complete=false){try{if(!audioContext||audioContext.state!=='running')return;const o=audioContext.createOscillator(),gain=audioContext.createGain();o.type='sine';o.frequency.value=complete?880:660;gain.gain.value=.12;o.connect(gain);gain.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+(complete?.35:.12));}catch{}}
function updateTimer(){simpleTimerTick();if(!draft)return;const c=activeTimer(),remaining=timerRemaining(c);
 if(storageWritable&&!storageConflict&&c?.running&&(c.kind==='rest'||c.roundSeconds)&&remaining>=1&&remaining<=3){const event=String(c.endAt)+':'+remaining;if(lastSignal!==event){lastSignal=event;timerCue=String(remaining);mobilitySound('count');}}
 const draftBeforeTick=JSON.stringify(draft);
 const changed=storageWritable&&!storageConflict&&!storageRecoveryIssue&&T.tick(draft);
 let tickSaved=false;
 if(changed){tickSaved=saveDraft();if(!tickSaved)draft=JSON.parse(draftBeforeTick);}
 const face=$('#clock [role="timer"]');if(face)face.textContent=activeTimer()?.untimed?'REPS':formatTime(timerRemaining(activeTimer()));

 const summary=$('#timer-collapsed-time');if(summary)summary.textContent=activeTimer()?.running?formatTime(timerRemaining(activeTimer()))+' remaining':'optional';
 const cue=$('#timer-cue');if(cue)cue.textContent=timerCue;
 if(changed&&tickSaved)render();
}
function start(){timerPanelOpen=false;if(!checkWriter())return;if(draft)return;const opportunity=C.project(state,today(),undefined,{minutes:todayMinutes,readiness})[0];if(selectedDate!==today()||!opportunity||opportunity.date!==today()){alert('The next unfinished workout is not scheduled here. Move its opportunity if recovery allows.');return;}openEditors.clear();panelState.clear();focusExpanded=false;finishPanel=false;const bundle=N.adjusted(state,{readiness,minutes:todayMinutes}),plan=bundle.plan;if(!plan.items.length){alert("No complete movement fits today. Choose more time or adjust your training plan.");return;}draft={calendarVersion:1,timerVersion:3,notebookVersion:1,originalPlan:bundle.original,adjustments:bundle.adjustments,cycleSnapshot:N.cycle(state),id:'d'+newIdentity(),timerMode:T.MODES.includes(state.timerMode)?state.timerMode:'manual',plan,started:new Date().toISOString(),date:today(),stage:'warmup',items:N.newItems(plan),notes:''};T.custom(draft,plan.budget.warmup*60,'Warmup',Date.now(),false);if(!saveDraft()){draft=null;return;}render();}
function changed(i,j,field,value){if(!checkWriter())return;
 if(!draft)return;
 const previous=JSON.stringify(draft);
 const d=draft.items[i].sets[j];
 if(field==='done'&&value&&(!E.validWorkingWeight(draft.plan.items[i].id,d.weight)||!Number.isInteger(Number(d.reps))||Number(d.reps)<=0)){alert('Enter a positive weight and whole reps or seconds before completing this set.');return;}
 if(field==='done'&&value&&draft.notebookVersion===1){const rx=draft.plan.items[i];if(rx.side===2){if(d.bothSides===undefined)d.bothSides=true;const left=Number(d.leftReps),right=Number(d.rightReps);if(d.bothSides!==true||!Number.isInteger(left)||left<=0||!Number.isInteger(right)||right<=0){alert('Enter the actual left and right repetitions and confirm both sides before completing this set.');return;}}if(rx.continuous&&d.continuous===undefined)d.continuous=true;if(rx.roundSeconds&&d.timingValid===undefined)d.timingValid=true;}
 if(field==='skipped'&&value)d.done=false;
 d[field]=['done','bothSides','timingValid','continuous','skipped'].includes(field)?!!value:Number(value);
 if(field==='done')T.logged(draft,i,j,value);
 if(!saveDraft()){draft=JSON.parse(previous);return;}
 render();
}
function editDraft(i,key,value){if(!checkWriter())return;if(!draft)return;const previous=draft.items[i][key];draft.items[i][key]=value;if(!saveDraft()){draft.items[i][key]=previous;return;}render();}
function saveWorkout(){if(!checkWriter())return;if(!draft)return;if(draft.id&&state.sessions.some(session=>session.draftId===draft.id)){alert('This workout is already saved. Export a backup and discard the duplicate draft; no history entry was added.');return;}const previous=JSON.stringify(state);let confirmed;try{E.validateDraft(draft,state);confirmed=draft.notebookVersion===1?N.finishItems(draft,'partial'):draft.items;}catch(error){alert(error.message);return;}const actual=N.records(draft.plan,confirmed);if(!actual.some(x=>x.actualSets>0)){alert('No sets were recorded. Keep this workout as a draft or discard it; a zero-work session should not enter your training history.');return;}
 const notes=$('#notes')?.value??draft.notes;state.deferredIds=E.deferredAfter(draft.plan,actual);state.deferredByBlock={...state.deferredByBlock,[draft.plan.block||'abc']:state.deferredIds};state.sessions.push({id:'s'+newIdentity(),draftId:draft.id||null,date:draft.date,slot:draft.plan.slot,block:draft.plan.block||'abc',programMode:draft.plan.composition?'coordinated':'single',title:draft.plan.day.name,sequenceNumber:state.sessions.length+1,calendarVersion:draft.calendarVersion,notebookVersion:draft.notebookVersion,plan:N.copy(draft.plan),originalPlan:N.copy(draft.originalPlan||draft.plan),adjustments:draft.adjustments||null,finishOutcome:actual.every(x=>x.performed)?'complete':'partial',status:N.status(actual,actual.every(x=>x.performed)?'complete':'partial'),items:actual,notes,started:draft.started,finished:new Date().toISOString()});state.notebookOutlook=draft.cycleSnapshot||[];actual.forEach(x=>{if(x.completed&&state.nextWeights)delete state.nextWeights[x.id]});if(!persistTraining(state,null)){state=JSON.parse(previous);return;}historyView=state.sessions.at(-1).id;correctionNotice='Workout saved. Actual work now informs the next prescription.';draft=null;finishPanel=false;selectedWorkout=0;cyclePage=0;todayMinutes=state.defaultMinutes;readiness='normal';clearInterval(timerInterval);tab='progress';render();}
function timeText(n){return n>0?`${n} min`:'—';}
function loadText(rx){return rx.bodyweight?'Bodyweight / no external load':rx.weight?rx.weight+' '+rx.unit:'Choose load';}
function dose(rx){return `${rx.sets} × ${rx.reps}${rx.timed?' sec':''}${rx.durationScope==='total'?' total, alternating sides':rx.side===2?' / side':''}`;}
function card(title,body){return `<section class="card"><h2>${title}</h2>${body}</section>`;}
function readinessButtons(){return `<div class="choice" aria-label="Readiness"><button data-ready="normal" class="${readiness==='normal'?'active':''}">Ready</button><button data-ready="low" class="${readiness==='low'?'active':''}">Low energy / sore</button></div>`;}
function warmup(plan){
 const items=plan.items||[],names=items.map(rx=>E.MOVES[rx.id]?.name||rx.name||rx.id||'').join(' ').toLowerCase();
 const complex=items.some(rx=>/getup|snatch|clean|cast|mill/i.test(rx.id));
 const hinge=/swing|deadlift|hinge|clean|snatch/.test(names);
 const squat=/squat|lunge/.test(names);
 const overhead=/press|snatch|jerk|overhead|cast|mill/.test(names);
 const ground=/get.up|ground|turkish/.test(names);
 const club=/club|cast|mill|circle|shield|gamma/.test(names);
 const station1=club?'Use a familiar light club circle or shield, changing sides halfway through. Stay well below working load.':
  'Use unloaded halos and easy shoulder circles; use a familiar light club only if the movement is already comfortable.';
 const station2=overhead?'Gentle scapular movement, shoulder circles and easy unloaded press-path rehearsal; never force overhead range.':
  club?'Easy shoulder circles, relaxed wrist rotation and gentle scapular motion.':
  'Gentle shoulder circles, scapular movement and comfortable neck ranges; no forced end positions.';
 const station3=ground?'Slow supported floor transitions, spinal rocks and comfortable rotation; do not rush getting up.':
  hinge?'Gentle spinal rocks and unloaded hip-hinge patterning with a comfortable neutral back.':
  'Controlled spinal rocks or accessible supported shin-box transitions; avoid impact.';
 const station4=squat?'Supported squat-range exploration, gentle ankle motion and easy shin-box switches.':
  hinge?'Supported hip rotations and unloaded hip-to-wall hinges, avoiding fatigue and hard end-range stretching.':
  'Shin-box switches or supported hip rotations and comfortable squat-range exploration.';
 const movementNames=items.map(rx=>esc(rx.name||E.MOVES[rx.id]?.name||rx.id)).join(', ');
 return `<ol><li><strong>Minutes 0–2 · Light movement.</strong> ${station1}</li><li><strong>Minutes 2–4 · Shoulders and neck.</strong> ${station2}</li><li><strong>Minutes 4–6 · Spine and pattern.</strong> ${station3}</li><li><strong>Minutes 6–8 · Hips and ankles.</strong> ${station4}</li></ol><p class="muted small">Four-station eight-minute preparation adapted from <button class="source-open" data-open-source="550">Wildman's basic warm-up example</button>; the movements above are selected for this prescription, not presented as a universal mandatory sequence. Strength work: ${movementNames}.${complex?' Rehearse unfamiliar complex elements unloaded before loading.':''} Keep all movement easy and pain-free; do not skip preparation to gain lifting time.</p>`;
}
function cooldown(plan){
 const items=plan.items||[];
 const names=items.map(rx=>E.MOVES[rx.id]?.name||rx.name||rx.id||'').join(' ').toLowerCase();
 const overhead=/press|snatch|jerk|overhead|cast|mill/.test(names);
 const hinge=/swing|deadlift|hinge|clean|snatch/.test(names);
 const squat=/squat|lunge/.test(names);
 const ground=/get.up|ground|turkish/.test(names);
 const grip=/club|cast|mill|carry|circle/.test(names);
 const available=Math.max(0,Math.floor(Number(plan.budget?.cooldown)||0));
 const directions=[
  ['Spinal extension','Gentle Sphinx or another comfortable supported extension',130],
  ['Spinal flexion','Relaxed supported forward fold; do not force end range',129],
  ['Spinal rotation',ground?'Comfortable floor rotation or supported seated twist':'Gentle seated twist, both sides',137],
  ['Hip mobility',squat?'Supported hip rotation and easy ankle motion':hinge?'Gentle hamstring movement and supported hip rotation':'Comfortable hip-flexor stretch or supported shin-box position',135]
 ];
 // Keep Wildman-inspired extension -> flexion -> rotation -> hips ordering.
 // The last stage carries the primary prescription-specific hip emphasis.
 const slots=Math.min(directions.length,available),mins=Array(slots).fill(slots?Math.floor(available/slots):0);
 for(let i=0;i<available%Math.max(1,slots);i++)mins[i]++;
 const rows=directions.slice(0,slots).map((d,i)=>`<li>${mins[i]} min: ${d[0]} — ${d[1]} (<button class="source-open" data-open-source="${d[2]}">source</button>).</li>`);
 // These are substitutions within the existing time allocation, not extra minutes.
 if(slots>=3&&overhead)rows[2]=`<li>${mins[2]} min: Spinal rotation and shoulders — Gentle upper-back rotation followed by a comfortable supported box puppy-dog position if tolerated (<button class="source-open" data-open-source="139">source</button>).</li>`;
 else if(slots>=3&&grip)rows[2]=`<li>${mins[2]} min: Spinal rotation and forearms — Gentle seated twist followed by easy wrist opening and forearm rotation, without loaded stretching (<button class="source-open" data-open-source="132">source</button>).</li>`;
 const focus=overhead?'upper back and shoulders':squat?'hips and ankles':hinge?'posterior chain and hips':grip?'forearms and shoulders':ground?'hips and floor transitions':'comfortable spinal and hip movement';
 return `<ol>${rows.join('')}</ol><p class="muted small">Focus: ${focus}. Wildman's general cooldown directions and order are documented in <button class="source-open" data-open-source="130">Cooldown 1</button> and <button class="source-open" data-open-source="136">Cooldown 4</button>. This ${available}-minute allocation is a Strength Lab scheduling adaptation, not a universal Wildman prescription. Use comfortable ranges and skip painful movements.</p>`;
}
function emptyPlanMessage(p){
 if(p.paused)return 'Training is paused. Resume training when you choose.';
 if(p.held?.length)return 'No workout is ready. Review the pain holds in Progress; more time or lower readiness does not clear a hold.';
 if(p.prerequisite?.length||p.requirements?.length)return 'No workout is ready because movement prerequisites are incomplete. Open Settings → Foundational Movements to confirm the skills you can perform safely, and enter a push-up baseline if applicable. Review Learn for movement instructions. Do not mark skills complete until you can perform them.';
 if(p.scheduled?.length)return 'No workout is ready under the current recovery schedule. Rest and return when the spacing or weekly limit permits; no catch-up volume is needed.';
 if(p.unavailable?.length)return 'No workout is ready with the available equipment. Review your equipment and training block in Settings.';
 if(p.timeBlocked?.length)return 'No complete strength movement fits this time window. The 20-minute Mobility & Movement option below is ready and tailored to the movement you would have trained. Your strength progression stays queued.';
 return 'No strength workout is ready today. Review the training schedule or choose the optional 20-minute Mobility & Movement session below. No strength progression is credited for mobility.';
}
function trainingExplanation(plan){
 const sessions=(state.sessions||[]).filter(x=>x.items?.some(y=>y.actualSets>0)).sort((a,b)=>b.date.localeCompare(a.date));
 const recent=sessions.filter(x=>{const d=C.diff(today(),x.date);return d>=0&&d<28;});
 const days=new Set(recent.map(x=>x.date)).size;
 const p=plan||N.adjusted(state,{minutes:todayMinutes,readiness}).plan;
 const items=p.items||[],last=sessions[0];
 const reduced=items.filter(x=>['light','recovery','reentry','rebuild','deload'].includes(x.mode));
 const practiced=Object.keys(E.MOVES).filter(id=>E.records(state,id).some(x=>x.actualSets>0));
 const stageCount={};
 for(const id of practiced){const stage=movementStage(id);stageCount[stage]=(stageCount[stage]||0)+1;}
 const stageText=Object.entries(stageCount).map(([name,count])=>`${count} ${name.toLowerCase()}`).join(' · ');
 const entries=[];
 entries.push({title:'Where you are',points:[
   last?`${days} strength days in the last 28 days; most recent ${last.date}`:'Your first completed sessions will establish your starting point',
   practiced.length?`${practiced.length} practiced movements: ${stageText}`:'You are learning the foundational movement patterns',
   'The goal is repeatable technique before adding more work, faster work, heavier load or harder skills'
 ]});
 entries.push({title:'Why this workout',points:[
  p.composition?.reason||`The rolling rotation selected ${p.day?.name||'this session'} within your available equipment, skills and time`,
  reduced.length?`${reduced.length} movement${reduced.length===1?' is':'s are'} scheduled as reduced practice rather than progression work`:'The current prescription is based on each movement’s own progression',
  p.spacingRecommended?(p.spacingReason||'Recovery spacing is recommended'):null,
  readiness!=='normal'?`Your reported readiness is ${readiness}; check Today’s Adjustments for its effect on the plan`:null,
  todayMinutes!==state.defaultMinutes?`You selected ${todayMinutes} minutes rather than your usual ${state.defaultMinutes}`:null
 ].filter(Boolean)});
 if(items.length)entries.push({title:'What you are building',points:items.slice(0,5).map(x=>`${x.name}: ${movementStage(x.id).toLowerCase()}`).concat(items.length>5?[`And ${items.length-5} more movements in today’s plan`]:[])});
 if(p.requirements?.length)entries.push({title:'Skills to learn next',points:[`Prerequisites affect which advanced movements the engine can prescribe: ${p.requirements.slice(0,4).map(x=>E.MOVES[x.id]?.name||x.id).join(', ')}${p.requirements.length>4?' and others':''}`]});
 if(p.composition?.cadence?.warning)entries.push({title:'Rotation note',points:[p.composition.cadence.warning]});
 return {entries,days,practiced,items};
}
function explanationContent(plan,overview=false){const info=trainingExplanation(plan);return `<div class="training-explanation">${overview?'<p class="small muted">Your current training picture, calculated from saved workouts and today’s plan.</p>':''}${info.entries.map(entry=>`<section class="explanation-line"><h3>${esc(entry.title)}</h3><ul>${entry.points.map(point=>`<li>${esc(point)}</li>`).join('')}</ul></section>`).join('')}</div>`;}
function programDecision(p){return `<details class="card" id="program-decision"><summary>Why this workout?</summary>${explanationContent(p)}</details>`;}

function movementLink(id){return `<button class="movement-link" data-instruction="${id}">${esc(E.MOVES[id].name)}</button>`;}
function preparation(plan,kind){
 const total=plan.budget[kind];
 const isWarm=kind==='warmup';
 const sections=isWarm?[
  ['Light movement rehearsal',(plan.items||[]).some(rx=>/club|cast|circles|front/i.test(rx.id))?
   'Practice the planned club pattern unloaded or with a familiar light club; use controlled range':
   (plan.items||[]).some(rx=>/snatch|clean|swing|deadlift|hinge/i.test(rx.id))?
   'Rehearse the hinge and planned kettlebell path unloaded, then with a familiar light bell':
   (plan.items||[]).some(rx=>/squat|getup|press|pushup/i.test(rx.id))?
   'Rehearse the planned squat, press or ground transition unloaded in a comfortable range':
   'Move through the planned first exercise unloaded at an easy pace'],
  ['Shoulders and neck','Controlled shoulder circles, scapular movement and comfortable neck ranges'],
  ['Spine','Gentle spinal rocks or supported spinal articulation without impact'],
  ['Hips','Shin-box switches, supported hip rotations and comfortable squat range']
 ]:[
  ['Spinal extension','Gentle Sphinx position or comfortable supported extension'],
  ['Spinal flexion','Supported forward fold without forcing the range'],
  ['Spinal rotation','Comfortable seated or supported twist'],
  ['Hip mobility',(plan.items||[]).some(rx=>/squat|lunge|bearSquat|getup/i.test(rx.id))?
   'Gentle shin-box switches and supported hip rotations after squat or ground work':
   'Supported shin-box position or gentle hip-flexor stretch']
 ];
 const allocations=isWarm?[2,2,2,2]:Array.from({length:4},(_,i)=>Math.floor(total/4)+(i<total%4?1:0));
 return '<div class="prep-exercises">'+sections.map((entry,i)=>allocations[i]?'<div class="prep-exercise"><div class="prep-name">'+esc(entry[0])+'</div><p class="rx"><strong>'+allocations[i]+' min</strong> · '+esc(entry[1])+'</p></div>':'').join('')+'</div>';
}
function prepSection(plan,kind,open=false){return `<details class="preparation" data-panel="${kind}" ${(panelState.has(kind)?panelState.get(kind):open)?'open':''}><summary>${kind==='warmup'?'Warm-up':'Cooldown'} · ${plan.budget[kind]} min · view movements</summary>${preparation(plan,kind)}</details>`;}
function compactPrescription(rx){const structure=N.structure(rx);const rest=structure.match(/(\d+)s rest between sets/i);const extra=structure.replace(/\d+s rest between sets/i,'').replace(/straight (?:rep|timed|time) sets/ig,'').replace(/^[\s·;,-]+|[\s·;,-]+$/g,'').trim();const detail=extra&&!/^[·;,-]+$/.test(extra)?` <span class="small muted">· ${esc(extra)}</span>`:'';return `<strong>${loadText(rx)} - ${dose(rx)}${rest?' - '+rest[1]+'s Rest between sets':structure&&extra?' - '+esc(extra):''}</strong>${rest?detail:''}${!rx.continuous&&rx.betweenExercises?` <span class="small muted">· ${rx.betweenExercises}s transition</span>`:''}`;}
function pauseControls(){const paused=E.trainingPaused(state,today());return `<details id="pause-training"><summary>${paused?'Training paused'+(state.pauseUntil?' until '+state.pauseUntil:''):'Pause training'}</summary>${paused?'<p class="small">Your next unfinished workout is preserved. Activity logging remains available.</p><button class="button secondary" id="resume-training">Resume training</button>':`<label>Pause<select id="pause-kind"><option value="manual">Until I resume</option><option value="duration">For a number of days</option><option value="date">Until a date</option></select></label><div class="two"><label>Days<input id="pause-days" type="number" min="1" max="365" value="7"></label><label>Resume date<input id="pause-date" type="date" min="${today()}" value="${C.add(today(),7)}"></label></div><button class="button secondary" id="apply-pause">Pause training</button>`}</details>`;}
function activityForm(){const a=activityEdit||{date:selectedDate,type:state.trainingPreferences?.activityTypes?.[0]||'mountain',duration:45,effort:'easy',status:selectedDate>today()?'planned':'completed',replacesStrength:true};return `<details id="activity-form" ${activityEdit?'open':''}><summary>${activityEdit?'Edit activity':'Plan or record an activity'}</summary><div class="two"><label>Activity<select id="activity-type">${Object.entries(C.TYPES).map(([id,name])=>`<option value="${id}" ${a.type===id?'selected':''}>${name}</option>`).join('')}</select></label><label>Date<input id="activity-date" type="date" value="${a.date}"></label><label>Duration (min)<input id="activity-duration" type="number" min="1" max="1440" value="${a.duration}"></label><label>Effort<select id="activity-effort">${['easy','moderate','hard'].map(v=>`<option ${a.effort===v?'selected':''}>${v}</option>`).join('')}</select></label></div><label>Status<select id="activity-status"><option value="planned" ${a.status==='planned'?'selected':''}>Planned</option><option value="completed" ${a.status==='completed'?'selected':''}>Completed</option></select></label><label class="row small">Replaces strength that day<input type="checkbox" id="activity-replaces" ${a.replacesStrength!==false?'checked':''}></label><details><summary>Optional details</summary><div class="two"><label>Distance (km)<input type="number" min="0" step="0.1" id="activity-distance" value="${a.distance??''}"></label><label>Elevation (m)<input type="number" min="0" id="activity-elevation" value="${a.elevation??''}"></label></div><label>Note<input id="activity-notes" value="${esc(a.notes||'')}"></label></details><p class="small muted">Activity never earns lifting credit. Recovery spacing is an app estimate from type, effort and duration; your next strength workout moves forward.</p><button class="button" id="save-activity">${activityEdit?'Save changes':'Save activity'}</button>${activityEdit?'<button class="button secondary" id="cancel-activity">Cancel</button>':''}${activityEdit?.versions?.length?'<button class="button secondary" id="restore-activity">Restore previous version</button>':''}</details>`;}
function renderCycle(){const days=C.week(state,today(),weekStart,{minutes:todayMinutes,readiness});return `<section id="training-calendar" aria-label="Rolling seven-day calendar"><div class="calendar-header"><button class="button secondary smallbtn" data-week="-1" aria-label="Previous week">‹</button><div><strong>${esc(new Intl.DateTimeFormat("en-US",{month:"short",timeZone:"UTC"}).format(new Date(weekStart+"T12:00:00Z")))} ${Number(weekStart.slice(8))}–${Number(C.add(weekStart,6).slice(8))}</strong></div><button class="button secondary smallbtn" data-week="1" aria-label="Next week">›</button></div><div class="calendar-grid">${days.map(d=>{const rides=d.activities.some(a=>['mountain','gravel','road','indoor'].includes(a.type)),done=d.sessions.some(s=>s.items.some(x=>x.actualSets>0))||d.activities.some(a=>a.status==='completed');return `<button data-calendar-day="${d.date}" class="calendar-day ${d.workout?'strength':rides?'cycling':d.activities.length?'activity':'recovery'} ${done?'completed':''} ${d.today?'current-day':''} ${selectedDate===d.date?'selected-day':''}" aria-pressed="${selectedDate===d.date}" aria-label="${d.date}: ${esc(d.label)}${d.activities.map(a=>', '+C.TYPES[a.type]+' '+a.status).join('')}"><small>${new Date(d.date+'T12:00:00Z').toLocaleDateString(undefined,{weekday:'short'})}</small><strong>${Number(d.date.slice(-2))}</strong><span>${done?'✓ ':''}${d.activities.length?rides?'Ride':'Activity':d.workout?d.workout.plan.day.name.split(' · ')[0]:d.paused?'Paused':''}</span></button>`;}).join('')}</div></section>`;}
const durationLabel=n=>n===30?'30 min (25–40)':n===120?'120 min (115–120)':`${n} min (${n-5}–${n+5})`;
function renderAdjustments(bundle){return `<details class="today-adjustments"><summary>Today's Adjustments</summary><div class="two"><label>Time available<select id="today-minutes">${[30,45,60,75,90,120].map(n=>`<option value="${n}" ${todayMinutes===n?'selected':''}>${durationLabel(n)}</option>`).join('')}</select></label><label>Readiness<select id="today-readiness">${[['normal','Normal'],['low','Pretty beat'],['great','Feeling great']].map(([v,l])=>`<option value="${v}" ${readiness===v?'selected':''}>${l}</option>`).join('')}</select></label></div>${bundle.adjustments.changes.length?`<p id="adjustment-explanation" class="small">${bundle.adjustments.changes.map(esc).join('; ')}</p>`:''}<div class="adjustment-extras">${activityForm()}</div></details>`;}
let mobilityStartedAt=0,mobilityClock=null;
function mobilityRoutine(){
 const current=E.plan(state,{now:today(),minutes:todayMinutes,readiness});
 const currentIds=(current.items||[]).map(x=>x.id);
 // When the selected time window cannot fit a strength movement, base the
 // 20-minute alternative on that deferred prescription before old history.
 if(!currentIds.length)currentIds.push(...(current.timeBlocked||[]).map(x=>x.id).filter(id=>E.MOVES[id]));
 const recent=(state.sessions||[]).filter(x=>x.date<=today()).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,3);
 const labels=(currentIds.length?currentIds.map(id=>E.MOVES[id]?.name||id):recent.flatMap(x=>(x.items||[]).filter(i=>i.completed||i.performed||(i.sets||[]).some(set=>set.done)).map(i=>String(i.name||E.MOVES[i.id]?.name||'')))).join(' ').toLowerCase();
 const overhead=/press|snatch|jerk|overhead|cast|mill/.test(labels);
 const grip=/club|cast|mill|swing|clean|snatch|carry/.test(labels);
 const hip=/squat|swing|deadlift|lunge|hinge/.test(labels);
 const hinge=/swing|deadlift|hinge|clean|snatch/.test(labels);
 const squat=/squat|lunge/.test(labels);
 const getup=/get.up|turkish|ground/.test(labels);
 const skill=hinge?'Unloaded hip hinges with soft knees, then slow hip-to-wall reaches; maintain a comfortable neutral back':
  squat?'Supported squat-to-stand practice and easy shin-box transitions':
  overhead?'Unloaded press-path practice, easy scapular motion and shoulder circles':
  getup?'Slow unloaded ground-to-standing transitions with a stable support':
  'Comfortable unloaded transitions and shin-box switches';
 const focus=hinge?'Gentle hamstring and hip movement plus comfortable trunk rotations; avoid hard end-range stretching or loaded lower-back fatigue':
  squat?'Supported ankle dorsiflexion, hip rotation and easy squat positions; stay within pain-free ranges':
  overhead?'Gentle upper-back rotation, scapular movement and shoulder range without forced overhead positions':
  grip?'Relaxed wrist opening, forearm rotation and easy shoulder movement; no loaded grip work':
  getup?'Gentle hip rotation, thoracic rotation and floor transitions with support':
  'Comfortable hip and shoulder mobility with relaxed breathing';
 const stages=[{min:2,title:'Light movement',detail:'Walk in place, easy shoulder circles and comfortable joint ranges.'},{min:2,title:'Light club skill',detail:grip?'Familiar light club pattern or unloaded halos; change hand position halfway. Avoid fatigue and heavy loading.':'Unloaded shoulder circles, gentle reach patterns and easy scapular motion; no club required.'},{min:2,title:'Spine',detail:'Controlled spinal rocks or supported spinal articulation; avoid impact.'},{min:2,title:'Hips',detail:'Shin-box switches or supported hip rotations.'},{min:4,title:'Movement practice',detail:skill+'. Practice unloaded or very lightly, never to failure.'},{min:2,title:'Spinal extension',detail:'Comfortable Sphinx or supported extension; relax without forcing range.'},{min:2,title:'Spinal flexion',detail:'Relaxed supported forward fold.'},{min:2,title:'Spinal rotation',detail:'Gentle seated twist, both sides.'},{min:2,title:'Current prescription focus',detail:focus+'.'}];
 if(state.trainingPreferences?.mobilityOnly!==true)return stages;
 const target=Math.max(20,Math.min(120,todayMinutes));
 // Largest-remainder allocation retains every phase while meeting the selected duration.
 const extra=target-20,weights=stages.map(x=>x.min),shares=weights.map(x=>extra*x/20),mins=stages.map((x,i)=>x.min+Math.floor(shares[i]));
 let remaining=target-mins.reduce((a,b)=>a+b,0);
 const order=shares.map((x,i)=>({i,fraction:x-Math.floor(x)})).sort((a,b)=>b.fraction-a.fraction||a.i-b.i);
 for(let i=0;i<remaining;i++)mins[order[i].i]++;
 return stages.map((x,i)=>({...x,min:mins[i]}));
}
function mobilityPanel(timeBlocked=false){
 const routine=mobilityRoutine(),running=mobilityStartedAt>0,duration=routine.reduce((n,x)=>n+x.min,0);
 return `<details class="list-item" id="mobility-session" ${running||timeBlocked?'open':''}><summary>Mobility & Movement · ${duration} minutes</summary><h2>Mobility & Movement</h2><p class="small muted">Active joint preparation → light movement skills → relaxed cooldown. The next eligible strength prescription guides the movement focus, with recent sessions as a fallback. This is a complete session, not a shortened strength workout.</p><ol>${routine.map(r=>`<li><strong>${r.min} min · ${esc(r.title)}</strong> — ${esc(r.detail)}</li>`).join('')}</ol><p class="small muted">Stay within comfortable, pain-free ranges; modify or stop any movement that causes pain.</p>${running?'<p role="timer" id="mobility-clock">00:00 / ${formatTime(duration*60)}</p><button class="button full" id="finish-mobility">Record Mobility Session</button><button class="button secondary" id="cancel-mobility">Cancel</button>':'<button class="button full mobility-start-button" id="start-mobility">Start Mobility Workout</button>'}</details>`;
}
let mobilitySignalKey='',mobilityStageIndex=-1,mobilityLastRemaining=null;
function mobilitySound(kind){
 try{
  if(!audioContext||audioContext.state!=='running')return;
  const now=audioContext.currentTime;
  const tones=kind==='mid'?[0,.105,.21]:kind==='whistle'?[0,.11]:[0];
  tones.forEach((offset,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type=kind==='whistle'?'triangle':'sine';o.frequency.setValueAtTime(kind==='mid'?1060:kind==='whistle'?1150:640,now+offset);if(kind==='whistle')o.frequency.linearRampToValueAtTime(1550,now+offset+.13);g.gain.setValueAtTime(.0001,now+offset);g.gain.linearRampToValueAtTime(.13,now+offset+.012);g.gain.exponentialRampToValueAtTime(.0001,now+offset+(kind==='whistle'?.23:.065));o.connect(g);g.connect(audioContext.destination);o.start(now+offset);o.stop(now+offset+(kind==='whistle'?.24:.075));});
 }catch{}
}
function mobilitySpeak(message){
 try{if(!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(message);u.rate=1;window.speechSynthesis.speak(u);}catch{}
}
function updateMobilityClock(){
 if(!mobilityStartedAt)return;
 const elapsed=Math.floor((Date.now()-mobilityStartedAt)/1000),routine=mobilityRoutine();
 let begin=0,index=routine.length,remaining=0;
 for(let i=0;i<routine.length;i++){const end=begin+routine[i].min*60;if(elapsed<end){index=i;remaining=end-elapsed;break;}begin=end;}
 const el=$('#mobility-clock');
 if(el)el.textContent=formatTime(Math.min(elapsed,1200))+' / 20:00 · '+(index<routine.length?routine[index].title+' · '+formatTime(remaining):'Complete');
 if(index!==mobilityStageIndex){
  const previousStage=mobilityStageIndex;
  mobilityStageIndex=index;mobilitySignalKey='';mobilityLastRemaining=null;
  if(previousStage>=0)mobilitySound('whistle');
  if(index<routine.length)mobilitySpeak(routine[index].title+'. '+routine[index].min+' minutes.');
  else mobilitySpeak('Mobility complete.');
 }
 if(index>=routine.length)return;
 const length=routine[index].min*60,midpoint=Math.floor(length/2);
 // Use crossed thresholds, not exact-second equality: delayed browser callbacks
 // otherwise silently miss midpoint or countdown cues.
 const previous=mobilityLastRemaining===null?remaining+1:mobilityLastRemaining;
 if(previous>midpoint&&remaining<=midpoint&&remaining>3)mobilitySound('mid');
 if(remaining>=1&&remaining<=3&&previous>remaining)mobilitySound('count');
 mobilityLastRemaining=remaining;
}
function unavailableLoadActions(plan){if(!plan?.items?.length)return '';return plan.items.filter(rx=>!rx.bodyweight&&rx.weight>0&&E.policyFor(rx.id,state).profile!=='wave'&&!E.availableWorkingLoads(state,rx.id).includes(E.stateFor(state,rx.id).weight)&&E.availableWorkingLoads(state,rx.id).length>0).map(rx=>`<div class="card"><p class="small warning">${esc(rx.name)}: ${esc(rx.weight)} ${esc(rx.unit)} is not available. Replacement loads: ${esc(E.availableWorkingLoads(state,rx.id).join(', ')||'none configured')}.</p><button class="button secondary smallbtn" data-replace-weight="${esc(rx.id)}">Choose replacement weight</button></div>`).join('');}
function emphasisEditorFields(prefix){
 const {levels,mobilityOnly}=E.trainingEmphasis(state),names={bodyweight:'Bodyweight',kb:'Kettlebells',club:'Heavy clubs',complex:'Complexes'};
 return `${Object.entries(names).map(([id,label])=>`<label>${label}<select data-emphasis-family="${id}" data-emphasis-editor="${prefix}">${[['off','Off'],['minor','Minor'],['major','Major']].map(([value,name])=>`<option value="${value}" ${levels[id]===value?'selected':''}>${name}</option>`).join('')}</select></label>`).join('')}
 <label class="gear-check"><input type="checkbox" data-mobility-editor="${prefix}" ${mobilityOnly?'checked':''}> Mobility only (pause other training)</label>
 <p class="small muted">Your previous emphasis and all equipment weights remain saved while mobility-only is active.</p>`;
}
function saveEmphasisFrom(editor){
 if(draft)throw Error('Finish or discard your current workout before changing training emphasis.');
 const root=editor==='dialog'?document.querySelector('#train-emphasis-dialog'):document.querySelector('#save-emphasis')?.closest('details');
 if(!root)throw Error('Training emphasis editor is unavailable');
 const levels=Object.fromEntries([...root.querySelectorAll('[data-emphasis-family]')].map(el=>[el.dataset.emphasisFamily,el.value]));
 const emphasis=E.validateTrainingEmphasis(levels),mobilityOnly=root.querySelector('[data-mobility-editor]')?.checked===true;
 const next={...state,trainingPreferences:{daysPerWeek:3,...state.trainingPreferences,emphasis,mobilityOnly}};
 E.validateBackup(next);if(!persistTraining(next,draft))return false;state=next;render();return true;
}
function trainingStyleEditorFields(){
 const pref=state.trainingPreferences||{};
 return `<div class="plan-compact-fields">
 <label class="plan-field-row"><span>Training focus</span><select id="train-style-focus">${[['balanced','Balanced'],['strength','Strength'],['capacity','Work capacity'],['skill','Skill development']].map(([v,n])=>`<option value="${v}" ${(pref.focus||'balanced')===v?'selected':''}>${n}</option>`).join('')}</select></label>
 <label class="plan-field-row"><span>Variety</span><select id="train-style-variety">${[['consistent','Consistent'],['moderate','Moderate'],['high','High']].map(([v,n])=>`<option value="${v}" ${(pref.variety||'moderate')===v?'selected':''}>${n}</option>`).join('')}</select></label>
 <label class="plan-toggle-row"><span>Include conditioning / EMOM</span><input type="checkbox" id="train-style-conditioning" ${pref.conditioning!==false?'checked':''}></label>
 <label class="plan-toggle-row"><span>Include skill practice</span><input type="checkbox" id="train-style-skill" ${pref.skillSessions!==false?'checked':''}></label></div>`;
}
function trainEmphasisSummary(){
 const distribution=E.emphasisDistribution(state),names={bodyweight:'Bodyweight',kb:'Kettlebells',club:'Clubs',complex:'Complexes'};
 const bars=distribution.mobilityOnly?'<p class="small">Mobility only · strength emphasis paused</p>':Object.entries(distribution.shares).filter(([id,share])=>share>0).map(([id,share])=>`<div class="emphasis-bar-row" style="display:flex;align-items:center;gap:8px;margin:7px 0"><span class="small" style="width:95px">${names[id]}</span><span style="flex:1;background:var(--surface-alt,#dce3e8);height:9px;border-radius:9px;overflow:hidden"><span style="display:block;background:var(--accent,#308eb0);height:100%;width:${Math.round(share*100)}%"></span></span><span class="small" style="width:36px;text-align:right">${Math.round(share*100)}%</span></div>`).join('')||'<p class="small">Choose a training emphasis in Settings.</p>';
 return `<div class="card train-emphasis-summary">${bars}<div class="training-emphasis-footer"><p class="small muted">Relative scheduling priorities, not exact workout percentages.</p><button type="button" class="button secondary smallbtn" id="open-emphasis-settings" aria-label="Edit training emphasis">Edit</button></div></div>`;
}
function renderToday(){if(draft)return renderNotebookWorkout();const dates=C.week(state,today(),weekStart,{minutes:todayMinutes,readiness}),d=dates.find(x=>x.date===selectedDate)||dates[0],next=C.project(state,today(),undefined,{minutes:todayMinutes,readiness})[0],bundle=N.adjusted(state,{minutes:todayMinutes,readiness}),p=d.workout?(d.date===today()?bundle.plan:d.workout.plan):null;return `<details class="calendar-disclosure training-plan-disclosure"><summary>Training Plan</summary><div class="training-plan-controls"><details class="training-plan-option"><summary>Time &amp; Schedule · ${state.trainingPreferences?.daysPerWeek||3} days/week · ${durationLabel(state.defaultMinutes)}</summary><div class="training-plan-option-body"><div class="plan-compact-fields"><label class="plan-field-row"><span>Training days per week</span><select id="plan-training-days">${[1,2,3,4,5,6,7].map(n=>`<option value="${n}" ${n===(state.trainingPreferences?.daysPerWeek||3)?'selected':''}>${n}</option>`).join('')}</select></label><label class="plan-field-row"><span>Workout target</span><select id="plan-default-minutes">${[30,45,60,75,90,120].map(n=>`<option value="${n}" ${state.defaultMinutes===n?'selected':''}>${durationLabel(n)}</option>`).join('')}</select></label></div><button type="button" class="button secondary smallbtn" id="save-training-plan-schedule">Save schedule</button></div></details><details class="training-plan-option"><summary>Workout Style — ${esc(({balanced:"Balanced",strength:"Strength",capacity:"Work capacity",skill:"Skill development"})[state.trainingPreferences?.focus||"balanced"]||"Balanced")} with ${esc(({consistent:"consistent",moderate:"moderate",high:"high"})[state.trainingPreferences?.variety||"moderate"]||"moderate")} variety${state.trainingPreferences?.conditioning===false?"":", conditioning"}${state.trainingPreferences?.skillSessions===false?"":", skills"} focus</summary><div class="training-plan-option-body">${trainingStyleEditorFields()}<button type="button" class="button secondary smallbtn" id="save-training-style-inline">Save workout style</button></div></details></div>${renderCycle()}<div class="training-plan-controls training-plan-emphasis"><details class="training-plan-option"><summary>Training Emphasis</summary><div class="training-plan-option-body">${trainEmphasisSummary()}</div></details></div></details><dialog id="train-emphasis-dialog" aria-label="Edit training emphasis"><form method="dialog"><h2>Training Emphasis</h2>${emphasisEditorFields('dialog')}<div class="two"><button type="button" id="save-emphasis-dialog" class="button">Save</button><button type="submit" class="button secondary">Cancel</button></div></form></dialog><section id="selected-workout" class="selected-workout">${p?`<h1>${esc(p.day.name)}</h1><p class="small muted">${esc(p.day.focus)} · ~${p.total} min${d.workout.provisional?' · provisional':''}</p>${d.today?renderAdjustments(bundle)+unavailableLoadActions(p):''}${p.spacingRecommended?`<p class="small warning" role="status">${esc(p.spacingReason)}</p>`:''}${prepSection(p,'warmup')}${p.items.map(rx=>`<div class="list-item compact-movement"><div>${movementLink(rx.id)}<span class="movement-colon">:</span> <span class="rx">${compactPrescription(rx)}</span></div></div>`).join('')}${prepSection(p,'cooldown')}${p.mobilityOnly?mobilityPanel():!p.items.length?`<p role="status" class="small warning">${esc(emptyPlanMessage(p))}</p>`:''}${d.today&&d.workout.index===0&&p.items.length?'<button class="button full" id="start">Start Workout</button>':`<p class="small muted">${esc(d.workout.reason)} Inspect freely; start the next unfinished workout when its opportunity arrives.</p>`}${programDecision(p)}`:`<h1>${d.paused?'Training paused':d.sessions.length?'Recorded training':'Recovery / flexible day'}</h1><p class="small muted" role="status">${esc(!bundle.plan.items.length?emptyPlanMessage(bundle.plan):d.reason)}</p>${d.today?renderAdjustments(bundle)+programDecision(bundle.plan):''}${d.sessions.map(x=>`<button class="button secondary" data-history-view="${esc(x.id)}">${esc(x.title)} · review record</button>`).join('')}${next&&!d.paused&&d.date>=today()?`<p class="small">Next: ${esc(next.plan.day.name)} · ${next.date}</p>`:''}`}${d.activities.map(a=>`<button class="activity-record" data-edit-activity="${esc(a.id)}">${esc(C.TYPES[a.type])} · ${a.duration} min · ${a.effort} · ${a.status==='completed'?'recorded':'planned'}</button>`).join('')}</section>${d.today?mobilityPanel(!bundle.plan.items.length&&(bundle.plan.timeBlocked||[]).length>0&&!bundle.plan.paused&&!(bundle.plan.held||[]).length&&!(bundle.plan.prerequisite||[]).length&&!(bundle.plan.requirements||[]).length):''}`;}
function setEditor(rx,item,i,history=false){const attr=history?'data-hset':'data-set',key=(history?'history':'active')+':'+i,plan=history?historyEdit.edit.plan:draft.plan,transition=i<plan.items.length-1?(rx.betweenExercises||rx.rest):0;
 return `<details data-editor="${key}" ${openEditors.has(key)?'open':''}><summary>Actual sets · tap to collapse</summary><p class="small muted">${rx.legacyTargetUnverified?'Original target load was not saved in this older record.':'Written target stays '+dose(rx)+' · '+loadText(rx)+'.'}</p><div class="simple-set-head"><span>Set</span><span>${esc(rx.unit)}</span><span>${rx.timed?'Seconds':'Reps'}</span><span>Rest, sec</span></div>${item.sets.map((set,j)=>{const last=j===item.sets.length-1,rest=last?set.transitionSeconds??transition:set.restSeconds??rx.rest,restKey=last?'transitionSeconds':'restSeconds';return `<div class="simple-set-row"><span>${j+1}</span><label><span class="sr">Weight set ${j+1}</span><input type="number" min="0" step="0.5" ${rx.bodyweight?'readonly':''} ${attr}="${i}:${j}:weight" value="${set.weight}"></label><label><span class="sr">${rx.timed?'Seconds':'Reps'} set ${j+1}</span><input type="number" min="0" ${attr}="${i}:${j}:reps" value="${set.reps}"></label><label><span class="sr">${last?'Transition':'Rest'} set ${j+1}</span><input type="number" min="0" ${attr}="${i}:${j}:${restKey}" value="${rest}"></label></div>${last?`<p class="small muted">Transition planned ${transition}s${set.transitionSeconds!==undefined?' · actual '+set.transitionSeconds+'s · additional '+Math.max(0,set.transitionSeconds-transition)+'s':''}</p>`:''}${rx.side===2||rx.roundSeconds||rx.continuous?`<details class="method-fields" ${rx.durationScope==='total'?'open':''}><summary>${rx.durationScope==='total'?'Required actual get-ups per side':'Sides / method details · set '+(j+1)}</summary>${rx.side===2?`<div class="two"><label>Left ${rx.durationScope==='total'?'reps':'actual'}<input type="number" min="0" ${attr}="${i}:${j}:leftReps" value="${set.leftReps??(rx.durationScope==='total'?0:set.reps)}"></label><label>Right ${rx.durationScope==='total'?'reps':'actual'}<input type="number" min="0" ${attr}="${i}:${j}:rightReps" value="${set.rightReps??(rx.durationScope==='total'?0:set.reps)}"></label></div><label class="row small">Both sides / directions<input type="checkbox" ${attr}="${i}:${j}:bothSides" ${set.bothSides!==false?'checked':''}></label>`:''}${rx.roundSeconds?`<label>Actual round interval (sec)<input type="number" min="0" ${attr}="${i}:${j}:roundSeconds" value="${set.roundSeconds??rx.roundSeconds}"></label><label class="row small">Prescribed cadence maintained<input type="checkbox" ${attr}="${i}:${j}:timingValid" ${set.timingValid!==false?'checked':''}></label>`:''}${rx.continuous?`<label class="row small">Continuous controlled work<input type="checkbox" ${attr}="${i}:${j}:continuous" ${set.continuous!==false?'checked':''}></label>`:''}</details>`:''}<details class="partial-set"><summary>Skipped / partial set ${j+1}</summary><label class="row small">Not performed<input type="checkbox" ${attr}="${i}:${j}:skipped" ${set.skipped?'checked':''}></label><label class="row small">Performed<input type="checkbox" ${attr}="${i}:${j}:done" ${set.done?'checked':''}></label>${!history?`<button class="done" data-check="${i}:${j}">${set.done?'✓':'Record set performed'}</button>`:''}<button class="button secondary smallbtn" data-remove-set="${history?'history':'active'}:${i}:${j}">Remove set ${j+1}</button></details>`;}).join('')}<div class="buttonrow"><button class="button secondary smallbtn" data-add-set="${history?'history':'active'}:${i}">Add set</button><button class="button secondary smallbtn" data-movement-done="${history?'history':'active'}:${i}">Mark movement performed</button><button class="button secondary smallbtn" data-movement-skip="${history?'history':'active'}:${i}">Mark movement unperformed</button></div><details><summary>Technique / note</summary><label>Technique<select ${history?'data-hquality':'data-quality'}="${i}">${[['clean','Clean and repeatable'],['minor','Minor corrections'],['hard','Too hard / incomplete'],['breakdown','Technique broke down'],['pain','Pain / discomfort']].map(([v,l])=>`<option value="${v}" ${item.quality===v?'selected':''}>${l}</option>`).join('')}</select></label><label class="row small">Pain or unusual discomfort<input type="checkbox" ${history?'data-hpain':'data-pain'}="${i}" ${item.pain?'checked':''}></label><label>Note<input ${history?'data-hnote':'data-item-note'}="${i}" value="${esc(item.note||'')}"></label></details></details>`;
}
function renderNotebookWorkout(){const p=draft.plan,legacy=draft.notebookVersion!==1;return `${timerControls()}<div class="workout-title"><div class="eyebrow">${esc(draft.stage)} · ~${p.total} min</div><h1>${esc(p.day.name)}</h1></div>${prepSection(p,'warmup',draft.stage==='warmup')}<div id="workout-overview">${p.items.map((rx,i)=>`<section class="notebook-exercise"><div class="row"><label class="quick-complete-label quick-left">${''}<input type="checkbox" data-quick-complete="${i}" ${draft.items[i].sets.length&&draft.items[i].sets.every(set=>set.done&&!set.skipped)?'checked':''} aria-label="Complete all prescribed sets for ${esc(rx.name)}"></label><div>${movementLink(rx.id)}<p class="rx">${compactPrescription(rx)}</p></div><div class="quick-complete"><span class="quick-status">${draft.items[i].sets.length&&draft.items[i].sets.every(set=>set.done&&!set.skipped)?'Done':draft.items[i].sets.some(set=>set.done)?'Partial':'Pending'}</span><button class="button secondary smallbtn" data-edit-movement="active:${i}" aria-label="Edit ${esc(rx.name)}">Edit</button></div></div>${setEditor(rx,draft.items[i],i)}</section>`).join('')}</div>${prepSection(p,'cooldown',draft.stage==='cooldown')}<label class="session-note-label">Session note<textarea id="notes">${esc(draft.notes||'')}</textarea></label><button class="button secondary smallbtn" id="discard">Discard Workout</button><p class="small muted">${legacy?'Recovered older draft: only recorded sets are saved.':'Only checked or individually recorded sets count. Unchecked movements remain unperformed.'}</p><button class="button full" id="save-workout">Finish Workout</button>`;}
function renderHistory(){const sessions=(historyView?state.sessions.filter(x=>x.id===historyView):[]).sort((a,b)=>b.date.localeCompare(a.date));return `<section class="history-list"><h2>Training log</h2>${sessions.length?sessions.map(x=>`<details data-history="${esc(x.id)}" ${historyEdit?.id===x.id||historyView===x.id?'open':''}><summary>${esc(x.date)} · ${esc(x.title)}<span class="small muted history-summary">${esc(x.status||N.status(x.items))} · ${x.items.reduce((n,y)=>n+y.actualSets,0)} recorded sets</span></summary>${historyEdit?.id===x.id?`<div id="history-editor"><label>Completion status<select id="history-outcome"><option value="complete" ${historyEdit.edit.outcome!=='partial'?'selected':''}>Completed with recorded actuals</option><option value="partial" ${historyEdit.edit.outcome==='partial'?'selected':''}>Partial / stopped early</option></select></label><label>Actual date<input type="date" id="history-date" value="${historyEdit.edit.date}"></label>${historyEdit.edit.plan.items.map((rx,i)=>`<section class="notebook-exercise"><div class="row">${movementLink(rx.id)}<button class="button smallbtn secondary" data-edit-movement="history:${i}">Edit</button></div><p class="rx">${rx.legacyTargetUnverified?'Historical reference (original load unknown)':'Written'}: ${compactPrescription(rx)}</p>${setEditor(rx,historyEdit.edit.items[i],i,true)}</section>`).join('')}<label>Session note<textarea id="history-notes">${esc(historyEdit.edit.notes)}</textarea></label><label>Correction reason<input id="correction-reason" value="Correct recorded actuals"></label><p class="small">Saving replays progression and eligibility, rebuilds unfinished queues and removes affected pending load choices. Past workouts are preserved.</p><button class="button" id="save-correction">Save correction</button><button class="button secondary" id="cancel-correction">Cancel</button></div>`:`${x.items.map(y=>`<div class="list-item"><div>${movementLink(y.id)}<p class="small muted">${y.actualSets} × ${y.actualReps}${y.durationScope==='total'?' sec total':''} · ${y.weight||'—'} ${esc(y.unit)}</p>${Array.isArray(y.sets)?`<details><summary>Actual sets</summary><ol>${y.sets.map(set=>`<li class="small">${set.done&&!set.skipped?`${set.reps}${y.prescription?.timed?' sec':' reps'} · ${set.weight} ${esc(y.unit)}${set.leftReps!==undefined?' · left '+set.leftReps+', right '+set.rightReps:''}${set.restSeconds!==undefined?' · rest '+set.restSeconds+'s':''}${set.roundSeconds!==undefined?' · round '+set.roundSeconds+'s':''}`:'Not performed'}</li>`).join('')}</ol></details>`:''}${y.note?`<p class="small">${esc(y.note)}</p>`:''}</div></div>`).join('')}${x.notes?`<p>${esc(x.notes)}</p>`:''}<button class="button secondary smallbtn" data-edit-history="${esc(x.id)}">Correct workout</button>`}${x.adjustments?`<details><summary>Original and adjusted plan</summary><p class="small">Normal ${x.adjustments.normalMinutes} min → ${x.adjustments.minutes} min · ${esc(x.adjustments.readiness)}</p>${(x.originalPlan?.items||[]).map(rx=>`<p class="small">Originally: ${esc(rx.name)} · ${dose(rx)} · ${loadText(rx)}</p>`).join('')}${(x.plan?.items||[]).map(rx=>`<p class="small">Adjusted: ${esc(rx.name)} · ${dose(rx)} · ${loadText(rx)}</p>`).join('')}${x.adjustments.changes.map(line=>`<p class="small">${esc(line)}</p>`).join('')}</details>`:''}${x.corrections?.length?`<details><summary>Correction history · ${x.corrections.length}</summary>${x.corrections.map(c=>`<p class="small">${esc(c.at)} · ${esc(c.reason)}</p>`).join('')}<p class="small">Last edited: ${esc(x.lastEdited)}</p><button class="button secondary smallbtn" data-undo-correction="${esc(x.id)}">Restore previous version</button></details>`:''}<button class="button smallbtn danger" data-delete="${esc(x.id)}">Delete entry</button></details>`).join(''):'<p class="empty">No workouts recorded yet.</p>'}</section>`;}
function openMovement(id){if(!E.MOVES[id])return;const m=E.MOVES[id],entry=Learning.instruction(id),dialog=$('#movement-dialog');$('#movement-dialog-title').textContent=m.name;$('#movement-dialog-body').innerHTML=`<p>${esc(entry.purpose)}</p>${[['Setup',entry.setup],['Execution',entry.steps],['Bracing',entry.bracing],['Technique',m.cues],['Common errors',entry.mistakes]].map(([label,lines])=>lines?.length?`<h3>${label}</h3><ul>${lines.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'').join('')}<div class="buttonrow">${Learning.videos(id).map(v=>`<a class="button secondary video-link" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">${esc(v.label||'Watch Wildman instruction')} ↗</a>`).join('')}</div><p class="small muted">${esc(entry.coverage)}</p>`;dialog.showModal();}

function movementStage(id){const m=E.MOVES[id],history=E.records(state,id).filter(x=>x.actualSets>0),st=E.stateFor(state,id);if(st.hold)return 'Review needed';if(!history.length)return 'Not started';if(st.phase==='ready')return 'Cycle complete';if(st.phase==='density'||st.stagePhase==='density')return 'Building density';if(st.phase==='volume'||st.stagePhase==='volume')return 'Building volume';if(history.some(x=>x.completed&&x.quality==='clean'))return 'Building consistency';return 'Learning movement';}
function openMovementHistory(id){
 if(!E.MOVES[id])return;
 const dialog=document.getElementById('movement-history-dialog');if(!dialog)return;
 if(dialog.dataset.movementId!==id)movementVisibleRows=60;
 if(!dialog.open)movementVisibleRows=60;
 dialog.dataset.movementId=id;
 const m=E.MOVES[id],records=state.sessions.flatMap((session,sessionOrder)=>(session.items||[]).filter(item=>item.id===id&&(item.actualSets>0||item.performed)).map((item,itemOrder)=>({session,item,sessionOrder,itemOrder}))).sort((a,b)=>b.session.date.localeCompare(a.session.date)||b.sessionOrder-a.sessionOrder||b.itemOrder-a.itemOrder);
 const rows=records.slice(0,movementVisibleRows).map(({session,item})=>`<tr><td>${esc(session.date)}</td><td>${esc(m.bodyweight?'BW':(item.weight||0)+' '+m.unit)}</td><td>${esc(item.actualSets)}</td><td>${esc(item.actualReps??'—')}</td><td>${esc(item.quality||'—')}</td><td><button class="text-button" data-history-view="${esc(session.id)}">Edit</button></td></tr>`).join('');
 dialog.querySelector('#movement-history-content').innerHTML=`<h2>${esc(m.name)}</h2><p class="small muted">Current stage: ${esc(movementStage(id))} · ${records.length} recorded sessions · showing ${Math.min(movementVisibleRows,records.length)}</p><div class="history-table-wrap" role="region" tabindex="0" aria-label="Movement history table"><table class="history-table"><thead><tr><th>Date</th><th>Load</th><th>Sets</th><th>Reps</th><th>Quality</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="6">No recorded work yet.</td></tr>'}</tbody></table></div>${records.length>movementVisibleRows?'<button class="button secondary" data-more-movement-history="1">Show 60 more sessions</button>':''}<p class="small muted">Newest entries first · scroll for more history.</p>`;
 if(!dialog.open)dialog.showModal();
 dialog.querySelector('.history-table-wrap')?.scrollTo({top:0,left:0});dialog.scrollTop=0;
}
function homeCalendarPreview(){
 const day=C.week(state,today(),weekStart,{minutes:todayMinutes,readiness}).find(d=>d.date===selectedDate);
 if(!day)return '';
 const workout=day.workout?.plan,recorded=day.sessions||[],activities=day.activities||[],date=new Date(day.date+'T12:00:00Z').toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});
 const items=workout?.items||[],rows=items.slice(0,6).map(rx=>`<li><strong>${esc(E.MOVES[rx.id]?.name||rx.id)}</strong> · ${compactPrescription(rx)}</li>`).join('');
 const completed=recorded.flatMap(x=>x.items||[]).filter(x=>x.actualSets>0);
 const history=completed.length?`<p class="small muted">Completed: ${completed.length} movements · ${completed.reduce((n,x)=>n+x.actualSets,0)} sets</p>`:'';
 const other=activities.map(x=>`<p class="small muted">${esc(C.TYPES[x.type]||x.type)} · ${esc(x.duration)} min · ${esc(x.status)}</p>`).join('');
 const title=workout?.day?.name||(recorded.length?'Recorded workout':'Recovery / flexible day');
 return `<details class="card home-calendar-preview" open><summary>${esc(date)} · ${esc(title)}</summary>${workout?`<p class="small muted">${esc(workout.day?.focus||'Strength')} · approx. ${esc(workout.total||todayMinutes)} min${day.workout.provisional?' · provisional':''}</p><ul class="home-preview-list">${rows||'<li>No strength movements scheduled</li>'}</ul>${items.length>6?'<p class="small muted">Additional movements in Train</p>':''}`:'<p class="small muted">No strength workout scheduled for this date.</p>'}${history}${other}</details>`;
}
function trainingReport(){
 const sessions=state.sessions||[],ids=Object.keys(E.MOVES).filter(id=>E.records(state,id).some(x=>x.actualSets>0));
 if(!sessions.length)return '<section class="card"><h3>Training report</h3><p>Complete your first workout to start building a training report.</p></section>';
 const recent=sessions.slice(-12),performed=recent.flatMap(x=>x.items||[]).filter(x=>x.performed);
 const clean=performed.filter(x=>E.successful(x)).length,rate=performed.length?Math.round(clean/performed.length*100):0;
 const rows=ids.map(id=>{const m=E.MOVES[id],st=E.stateFor(state,id),rx=E.prescription(state,id),history=E.records(state,id),last=history.filter(x=>x.performed).at(-1);
 const status=st.hold?'Review before progressing':st.phase==='ready'?'Cycle ready':last?.quality==='hard'?'Repeat and consolidate':st.track==='heavy'?'Heavy exposure next':st.track==='light'?'Light exposure next':'Building the current cycle';
 const dose=rx.timed?rx.sets+' × '+rx.reps+' sec':rx.sets+' × '+rx.reps+' reps';
 return '<div class="stage-row"><div><strong>'+esc(m.name)+'</strong><div class="small muted">'+esc(status)+' · '+esc(rx.weight)+' '+esc(m.unit||'')+' · '+esc(dose)+'</div></div><span>'+esc(st.streak)+'/'+esc(st.policy.exposures)+'</span></div>';}).join('');
 const swing=E.records(state,'swing').filter(x=>x.performed),lastSwing=swing.at(-1),nextSwing=ids.includes('swing')?E.stateFor(state,'swing'):null;
 const wave=nextSwing?.policy?.profile==='wave'?'<p class="small"><strong>Heavy/light swing:</strong> Last recorded '+esc(lastSwing?.track||'unknown')+' · next '+esc(nextSwing.track)+' exposure. Tracks alternate after qualifying work, not necessarily every calendar session.</p>':'';
 return '<section class="card" id="training-report"><h3>Training report</h3><p class="small muted">'+sessions.length+' recorded workouts · '+ids.length+' practiced movements</p><p><strong>Recent execution:</strong> '+clean+' of '+performed.length+' performed movement entries met their prescribed targets ('+rate+'%) across the last 12 workouts.</p><p class="small">Next priority: repeat incomplete or difficult prescriptions; progress only when clean work meets the configured exposure requirement.</p>'+wave+'<h4>Where each movement stands · next prescription</h4><div class="stage-overview">'+rows+'</div><p class="small muted">The fraction shows clean exposures toward the next progression decision. This report summarizes recorded work; it is not a substitute for technique assessment.</p></section>';
}
function notebookHistoryTable(sessions){
 const lines=[];const practicedIds=new Set();for(const session of sessions){
  const items=session.items||[];
  for(const item of items)if(item.actualSets>0||item.performed)practicedIds.add(item.id);
  lines.push({session,performed:items.filter(x=>x.actualSets>0||x.performed).length});
 }
 const filtered=lines.filter(({session})=>(!historyDateFrom||session.date>=historyDateFrom)&&(!historyDateTo||session.date<=historyDateTo));
 const rows=filtered.slice(0,notebookVisibleRows).map(({session,performed})=>`<tr><td>${esc(session.date)}</td><td><button class="text-button" data-history-view="${esc(session.id)}">${esc(session.title||'Workout')}</button></td><td>${performed}</td><td>${esc(session.status||N.status(session.items||[]))}</td></tr>`).join('');
 return `<section class="card workout-history-card"><details class="workout-history-disclosure" open><summary>Workout history · ${filtered.length} of ${sessions.length} workouts</summary><div class="history-filters"><label>Show<select id="history-range-preset">${[['all','All time'],['month','This month'],['lastmonth','Last month'],['90days','Last 90 days'],['custom','Custom dates']].map(([v,n])=>`<option value="${v}" ${historyRangePreset===v?'selected':''}>${n}</option>`).join('')}</select></label><div class="history-date-fields"><label>From<input type="date" id="history-date-from" value="${esc(historyDateFrom)}"></label><label>Through<input type="date" id="history-date-to" value="${esc(historyDateTo)}"></label></div><button type="button" class="button secondary smallbtn" id="history-clear-dates">Clear dates</button></div><p class="small muted">${filtered.length} matching workouts · ${Math.min(notebookVisibleRows,filtered.length)} displayed. Dates inclusive.</p><div class="history-table-wrap" role="region" tabindex="0" aria-label="Workout history table"><table class="history-table notebook-table"><thead><tr><th>Date</th><th>Workout</th><th>Movements</th><th>Status</th></tr></thead><tbody>${rows||'<tr><td colspan="4">No workouts in this date range.</td></tr>'}</tbody></table></div>${filtered.length>notebookVisibleRows?'<button class="button secondary" data-more-notebook="1">Show 60 more workouts</button>':''}</details></section>`;
}
function renderProgress(){const sessions=[...state.sessions].sort((a,b)=>b.date.localeCompare(a.date));const activities=[...(state.activities||[])].sort((a,b)=>b.date.localeCompare(a.date));const strengthDays=new Set(sessions.filter(x=>C.diff(today(),x.date)>=0&&C.diff(today(),x.date)<28&&x.items.some(y=>y.actualSets>0)).map(x=>x.date)).size;
 const recentStrengthWorkouts=sessions.filter(x=>C.diff(today(),x.date)>=0&&C.diff(today(),x.date)<28&&x.items.some(y=>y.actualSets>0)).length;
 const recentMobilityDays=new Set(activities.filter(a=>a.type==='mobility'&&a.status==='completed'&&C.diff(today(),a.date)>=0&&C.diff(today(),a.date)<28).map(a=>a.date)).size;
 return `<section class="hero"><div class="eyebrow">Your progress</div><h1>Training Log</h1><p class="small muted">${strengthDays} strength days · ${recentMobilityDays} mobility days · ${recentStrengthWorkouts} strength workouts in the last 28 days · ${sessions.length} lifetime workouts recorded</p></section>${correctionNotice?`<p class="notice" role="status">${esc(correctionNotice)}</p>`:''}${movementProgress()}${notebookHistoryTable(sessions)}${historyView?renderHistory():''}${activityEdit?activityForm():''}${activities.length?`<details><summary>Other activity · ${activities.length} entries</summary><div class="history-table-wrap"><table class="history-table"><thead><tr><th>Date</th><th>Activity</th><th>Duration</th></tr></thead><tbody>${activities.map(a=>`<tr><td>${esc(a.date)}</td><td><button class="text-button" data-edit-activity="${esc(a.id)}">${esc(C.TYPES[a.type])}</button></td><td>${esc(a.duration)} min</td></tr>`).join('')}</tbody></table></div></details>`:''}`;}
// Keep only one overview category and one movement expanded at a time.
document.addEventListener('toggle',event=>{
 const el=event.target;
 if(!(el instanceof HTMLDetailsElement)||!el.open)return;
 if(el.classList.contains('training-overview-group')){
  document.querySelectorAll('.training-overview-group[open]').forEach(other=>{if(other!==el)other.open=false;});
 }else if(el.classList.contains('overview-movement')){
  el.closest('.training-overview-group')?.querySelectorAll('.overview-movement[open]').forEach(other=>{if(other!==el)other.open=false;});
 }
},true);
function movementProgress(){
 const ids=Object.keys(E.MOVES).filter(id=>E.records(state,id).length);
 const pathways=E.complexityOptions(state);
 const sixMonthsAgo=new Date(today()+'T12:00:00Z');sixMonthsAgo.setUTCMonth(sixMonthsAgo.getUTCMonth()-6);
 const since=sixMonthsAgo.toISOString().slice(0,10);
 const item=id=>{
  const m=E.MOVES[id],st=E.stateFor(state,id),rx=E.prescription(state,id),history=E.records(state,id);
  const recent=history.filter(x=>x.date>=since&&x.date<=today()),done=recent.filter(E.successful),last=recent.at(-1);
  const phase=st.hold?'Review required':st.reviewRecovery?'Recovery / reentry':st.phase==='ready'?'Cycle ready':st.phase==='density'?'Building density':'Building volume';
  const track=st.policy.profile==='wave'?(st.track==='heavy'?'Heavy exposure next':'Light exposure next'):'';
  const loadText=m.bodyweight?'bodyweight':(st.weight?st.weight+' '+m.unit:'working load not selected');
  const modes=[...new Set(recent.map(x=>x.mode).filter(Boolean))];
  const setbacks=recent.filter(x=>x.pain||['rebuild','reentry','recovery','deload'].includes(x.mode)).length;
  const narrative=recent.length
   ?'In the last six months you logged '+recent.length+' sessions for this movement, '+done.length+' completed cleanly. '+(last?'Your latest was '+last.date+'. ':'')+(modes.includes('density')?'You have practiced density work. ':'')+(modes.includes('volume')?'You have practiced volume work. ':'')+(setbacks?'There were '+setbacks+' recovery or rebuilding entries; your current prescription accounts for the recorded history. ':'')+(st.hold?'A pain report is on hold; review the movement before progressing.':st.reviewRecovery?'The movement is in recovery/reentry review before normal progression resumes.':st.phase==='ready'?'You have completed the current cycle and are ready to choose the next progression.':st.phase==='density'?'You are now building density: increasing work within a time target.':'You are now building repeatable volume: adding quality sets or repetitions.')+(st.policy.profile==='wave'?' Heavy and light exposures have separate targets; they do not both have to build volume.':'')
   :'No sessions were recorded for this movement in the last six months. The current stage comes from earlier history or your configured starting point.';
  return `<details class="overview-movement"><summary>${esc(m.name)} <span class="tag">${esc(phase)}${track?' · '+esc(track):''}</span></summary>
   <p class="small">${esc(narrative)}</p>
   <p class="small"><strong>Now:</strong> ${esc(phase)} · stage ${st.stage+1} · ${st.streak}/${st.policy.exposures} clean exposures · ${esc(loadText)}.</p>
   <p class="small"><strong>Next:</strong> ${dose(rx)} · ${rx.roundSeconds?'round every '+rx.roundSeconds+'s':rx.rest+'s rest'}${track?' · '+esc(track):''}.</p>
   ${st.phase==='ready'&&st.policy.density&&st.stagePhase==='volume'&&!st.hold?`<button class="button secondary" data-cycle-for="${id}">Choose density cycle</button>`:''}
   ${st.hold?`<p class="warning">${esc(st.hold)}</p><button class="button secondary" data-resolve-pain="${id}">Review and resume movement</button>`:''}
   ${st.phase==='ready'&&!st.hold&&st.policy.profile!=='wave'&&!m.bodyweight?`<button class="button smallbtn" data-weight-for="${id}">Choose next weight</button>`:''}
   <p><button class="button secondary" data-movement-history="${esc(id)}">Historical data</button></p>
  </details>`;
 };
 const group=(name,selected,extra='')=>`<details class="training-overview-group"><summary><strong>${esc(name)}</strong> <span class="small muted">${selected.length} movements</span></summary>${extra}${selected.length?selected.map(item).join(''):'<p class="empty">No recorded movements in this category yet.</p>'}</details>`;
 const complexIds=ids.filter(id=>E.MOVES[id].gear==='kb'&&E.MOVES[id].complex);
 const complexInfo=`<p class="small muted">Complexes progress independently. Readiness depends on practiced component skills and available loads.</p>${pathways.filter(p=>!complexIds.includes(p.id)).map(p=>`<details class="overview-movement"><summary>${esc(p.name)} <span class="tag">${p.ready?'Eligible':'Preparing'}</span></summary><p class="small">${esc(p.ready?'Ready for a conservative technique review.':'Next requirements: '+p.blockers.join('; '))}</p></details>`).join('')}`;
 const clubIds=ids.filter(id=>E.MOVES[id].gear==='club');
 const other=ids.filter(id=>!['kb','club'].includes(E.MOVES[id].gear));
 return card('Training overview','<p class="small muted">Open one category, then one movement. Historical data opens the detailed movement log.</p>'+
  group('Kettlebells',ids.filter(id=>E.MOVES[id].gear==='kb'&&!E.MOVES[id].complex))+
  group('Kettlebell Complexes',complexIds,complexInfo)+
  group('Heavy Clubs',clubIds)+
  group('Heavy Club Complexes',[],'<p class="small muted">Advanced club combinations are under research review; no unverified prescriptions will be scheduled.</p>')+
  (other.length?group('Other training',other):''));
}
function workingWeights(){return `${card('Working weights',`<p class="small muted">Set conservative starting weights. Leave a movement at 0 to select the load while training. No maximum testing required.</p>${Object.entries(E.MOVES).map(([id,m])=>`<div class="field"><label>${esc(m.name)} (${m.unit})</label><input type="number" min="0" step="0.5" data-weight="${id}" ${m.bodyweight?'readonly':''} value="${esc(m.bodyweight?0:state.weights[id]||0)}"></div>`).join('')}<button class="button secondary" id="save-weights">Save working weights</button>`)}`;}

function learnStatus(id){const status=Learning.status(state,id);return `<span class="learn-status status-${status.key}">${esc(status.label)}</span>`;}
function learningNode(id,label=''){const m=E.MOVES[id],entry=Learning.instruction(id);return `<button class="learn-node" data-learn-move="${id}"><strong>${esc(m.name)}</strong>${learnStatus(id)}${entry.coverage!=='reviewed outline'?`<span class="small warning">Instruction incomplete · ${esc(entry.coverage)}</span>`:''}${label?`<span class="small muted">${esc(label)}</span>`:''}</button>`;}
const MOVEMENT_PATHWAYS=[
 {title:'Kettlebell hinge to overhead',description:'From the two-hand swing toward the snatch. The one-arm swing and high pull are learning milestones, not separate tracked exercises yet.',steps:[{id:'swing',label:'Two-hand swing'},{label:'One-arm swing',note:'Technique milestone · not tracked'},{label:'High pull',note:'Technique milestone · not tracked'},{id:'clean',label:'Single-arm clean',note:'Related rack skill'},{id:'snatch',label:'Single-arm snatch'}]},
 {title:'Kettlebell squat and rack',description:'Build the squat pattern, then add the challenge of two bells.',steps:[{id:'squat',label:'Goblet squat'},{id:'doubleSquat',label:'Double front squat'}]},
 {title:'Pressing and overhead control',description:'Build single-arm pressing before more complex double-bell work.',steps:[{id:'press',label:'Single-arm strict press'},{id:'doublePress',label:'Double clean and press'},{id:'getup',label:'Turkish get-up',note:'Related overhead control; not a mandatory final step'}]},
 {title:'Club circles and casts',description:'Two-hand foundations branch into single-arm control.',steps:[{id:'circles',label:'Two-hand circles'},{id:'cast',label:'Two-hand shield cast'},{id:'clubInside',label:'Single-arm inside circle'},{id:'clubOutside',label:'Single-arm outside circle'}]}
];
function renderMovementPathways(){return `<div class="pathway-browser"><p class="small muted">Explore skill relationships. These are teaching pathways, not automatic promotion rules; some intermediate skills are not separately tracked by the training engine.</p>${MOVEMENT_PATHWAYS.map((path,i)=>`<details class="movement-pathway" ${i===0?'open':''}><summary><strong>${esc(path.title)}</strong><span>${esc(path.description)}</span></summary><div class="pathway-steps">${path.steps.map((step,j)=>`<div class="pathway-step"><span class="pathway-index">${j+1}</span><div>${step.id?`<button class="text-button" data-learn-move="${esc(step.id)}">${esc(step.label)}</button>`:`<strong>${esc(step.label)}</strong>`}${step.note?`<p class="small muted">${esc(step.note)}</p>`:''}${step.id?`<p class="small muted">${esc(E.records(state,step.id).some(x=>x.actualSets>0)?movementStage(step.id):'Not yet practiced in log')}</p>${Learning.instruction(step.id).coverage!=='reviewed outline'?`<p class="small warning">Instruction incomplete · ${esc(Learning.instruction(step.id).coverage)}</p>`:''} `:''}</div></div>`).join('')}</div></details>`).join('')}</div>`;}
function renderLearningList(){const rows=Learning.browse({gear:learnGear,family:learnFamily,query:learnQuery});const active=!!(learnQuery.trim()||learnGear||learnFamily);const shown=active?rows:rows.slice(0,6);return `<p class="small muted">${active?rows.length+' matching movements':'Search or filter to find a movement · '+rows.length+' in library'}</p>${shown.map(m=>`<div class="learn-list-row">${learningNode(m.id,Learning.gearLabels[m.gear]+' · '+Learning.familyLabels[m.family])}</div>`).join('')||'<p>No matching movements. Try a different search or filter.</p>'}${!active&&rows.length>6?'<p class="small muted">Showing six examples. Use equipment, movement family, or search to narrow the library.</p>':''}`;}

function renderInstruction(id){const m=E.MOVES[id],entry=Learning.instruction(id),status=Learning.status(state,id),relation=Learning.relations(id),policy=E.policyFor(id,state);
 const section=(heading,items,ordered=false)=>items?.length?`<section class="instruction-section"><h3>${heading}</h3><${ordered?'ol':'ul'}>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</${ordered?'ol':'ul'}></section>`:'';
 const related=Learning.browse({family:m.family}).filter(x=>x.id!==id).slice(0,3);
 const gaps=['setup','steps','bracing','mistakes'].filter(key=>!entry[key]?.length);
 return `<article class="card movement-instruction" id="movement-instruction" aria-label="Movement instruction"><div class="eyebrow">${esc(Learning.gearLabels[m.gear])} · ${esc(Learning.familyLabels[m.family])}</div><h2>${esc(m.name)}</h2>${learnStatus(id)}<p>${esc(entry.purpose)}</p>${entry.coverage!=='reviewed outline'?`<p class="notice"><strong>Incomplete lesson: ${esc(entry.coverage)}.</strong> This page is not a complete technique lesson. Use the linked source where available, and do not treat this outline or a learned checkbox as certification.${!entry.sourceIds.length?' Source and video mapping are still pending.':''}</p>`:''}<p class="small ${status.eligible?'muted':'warning'}" id="learning-eligibility">${esc(status.reason)}</p>

 ${section('Setup',entry.setup)}${section('Step by step',entry.steps,true)}${section('Breathing and bracing',entry.bracing)}${section('Technique reminders',m.cues)}${section('Common mistakes and corrections',entry.mistakes)}
 
 <section class="instruction-section"><h3>Training prerequisites</h3>${(m.requires||[]).length?`<ul>${m.requires.map(skill=>`<li>${state.skills?.[skill]?'Confirmed: ':'Not confirmed: '}${esc(E.SKILLS[skill].name)}</li>`).join('')}</ul>`:'<p class="small">No additional skill checkbox is defined by the current engine; use familiar technique and review the lesson.</p>'}${(m.practicePrereqs||[]).map(parent=>`<p class="small">Supporting practice: ${esc(E.MOVES[parent].name)} · ${E.practiceEvidence(state,parent,{forMovement:id}).ready?'recent clean evidence ready':'recent clean evidence needed'}</p>`).join('')}${(m.requires||[]).length?`<p class="small muted">Confirm only skills you can perform comfortably and consistently. This is a self-report, not technique certification; recorded supporting practice and pain safeguards still apply.</p>${m.requires.map(skill=>`<label class="row small"><span>${esc(E.SKILLS[skill].name)}</span><input type="checkbox" data-learn-skill="${esc(skill)}" ${state.skills?.[skill]?"checked":""}></label>`).join("")}<button class="button secondary smallbtn" data-save-learn-skills="${id}">Save prerequisite confirmations</button>`:""}<button class="button secondary smallbtn" data-learn-settings>Advanced programming settings</button></section>
 <section class="instruction-section"><h3>Develop this movement</h3><div class="learning-dimensions"><div><h4>Volume and density</h4><p>${esc(E.describeProgression(id,state))}</p>${policy.density?'<p>Density is an explicit later choice in Progress after the reviewed volume cycle.</p>':'<p>No automatic density progression is defined for this profile.</p>'}</div><div><h4>Load and strength</h4><p>${m.bodyweight?'This profile uses no external load. Develop controlled practice rather than inventing a weight increase.':'Complete the current clean cycle, then deliberately review an owned load in Progress. The app does not raise weight automatically.'}</p></div><div><h4>Movement complexity</h4><p>Review supporting skills and the focused pathway. A completed rep count does not establish mastery.</p><button class="button secondary smallbtn" data-learn="pathways">View focused pathway</button></div><div><h4>Combinations</h4>${relation.educational.filter(x=>x.dimension==='combination').map(x=>learningNode(x.from===id?x.to:x.from,x.label)).join('')||'<p>No source-reviewed combination link is mapped here yet.</p>'}</div></div></section>
 <button class="button secondary" data-confirm-learned="${id}">${state.learnedMovements?.[id]?'Remove my learned confirmation':'I have learned this movement'}</button><p class="small muted">This is your familiarity report, not technique certification. It never bypasses the engine’s skill, practice or pain rules.</p>
 <details class="source-coverage"><summary>Sources and instruction coverage</summary><p class="small">${esc(entry.coverage)}. ${gaps.length?'Coverage still incomplete for: '+gaps.join(', ')+'.':''}</p><p class="small">Video URLs match the verified transcript metadata. Playback availability was not rechecked here. The archive has no verified segment timestamps, so none are invented.</p>${[...new Set([...entry.sourceIds,...(m.requires||[]).flatMap(skill=>E.SKILLS[skill].sources)])].map(source=>`<button class="source-open" data-open-source="${source}">Research source #${source}</button>`).join('')}</details>
 ${related.length?`<details><summary>Related ${esc(Learning.familyLabels[m.family])} patterns</summary><p class="small">Same app movement family; these are not additional prerequisites.</p>${related.map(x=>learningNode(x.id)).join('')}</details>`:''}<section class="instruction-section movement-video-section"><h3>Watch Mark Wildman Demonstrate</h3><div class="buttonrow">${Learning.videos(id).map((video,i)=>`<a class="button secondary video-link" href="${esc(video.url)}" target="_blank" rel="noopener noreferrer" title="${esc(video.title)}" aria-label="Watch Mark Wildman: ${esc(m.name)} · video ${i+1}">${esc(video.label||(video.role==='programming'?'Watch programming example':'Watch Wildman instruction'))}${Learning.videos(id).length>1?' '+(i+1):''} ↗</a>`).join('')||'<p class="small muted">A verified movement-video mapping is not available yet.</p>'}</div></section></article>`;
}
function renderPathway(id){const m=E.MOVES[id],r=Learning.relations(id),next=[...r.children,...r.educational.filter(x=>x.from===id&&x.dimension==='complexity')],previous=[...r.parents,...r.educational.filter(x=>x.to===id&&x.dimension==='complexity')];
 return `<section class="card focused-pathway" id="focused-pathway" aria-label="Focused movement progression map"><p class="small muted">Tap a movement to center its map. Every lesson stays open; training eligibility is a separate decision.</p><section><h3>Supporting practice / earlier learning</h3>${previous.map(x=>learningNode(x.from,x.label)).join('')||'<p class="small muted">No earlier movement node is mapped. Review the required skills below.</p>'}</section><div class="pathway-arrow" aria-hidden="true">↓</div><div class="pathway-center"><span class="eyebrow">Current focus</span><h2>${esc(m.name)}</h2>${learnStatus(id)}<p class="small">${esc(Learning.status(state,id).reason)}</p></div><div class="pathway-arrow" aria-hidden="true">↓</div><section><h3>Possible next complexity</h3>${next.map(x=>learningNode(x.to,x.label)).join('')||'<p class="small muted">No further reviewed complexity node is mapped yet. Volume/load development may still be available.</p>'}</section><p class="small muted">Practice gates come from the training registry. Other educational links are source-reviewed suggestions, never automatic advancement.</p></section>`;
}
function renderProgrammingEducation(){const block=E.BLOCKS['abc'];return `<section id="programming-education"><h2>Programming</h2><p>Your current block: <strong>${esc(block.name)}</strong> · preferred ${state.trainingPreferences?.daysPerWeek||3} opportunities/week · normal ${state.defaultMinutes} minutes. Each movement keeps its own evidence and progression.</p>${window.ProgrammingEducation.topics.map(t=>`<details><summary>${esc(t.title)}</summary><p>${esc(t.principle)}</p><h3>How Strength Lab uses it</h3><p>${esc(t.app)}</p><p class="small muted">Scope and limits: ${esc(t.limits)}</p><div class="buttonrow">${t.sourceIds.map(id=>{const source=window.ProgrammingEducation.sources[id];return `<a class="button secondary smallbtn" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">Wildman lesson #${id} ↗</a>`;}).join('')}</div></details>`).join('')}</section>`;}
function renderLearn(){
 const books=[
 ['I','Foundations of Training',['The training problem and lifelong practice','Movement patterns, positions, and leverage','Training variables and adaptation','Fatigue, recovery, and sustainable progress','Movement preparation and warm-up construction','Cooldowns and downshifting','Technical quality and progression decisions']],
 ['II','Kettlebell Fundamentals',['Foundational kettlebell movements','Setup, technique, and safe practice','Foundational training progressions']],
 ['III','Advanced Kettlebell Training',['Advanced movement pathways','Complexity and skill development','Programming advanced kettlebell work']],
 ['IV','Heavy Club Fundamentals',['Foundational heavy-club movements','Grip, paths, and coordination','Foundational club progressions']],
 ['V','Advanced Heavy Club Training',['Advanced club movements','Complexity and movement combinations','Advanced club programming']],
 ['VI','Nerd Math: The Complete Course',['Volume and density','Load and progression calculations','Long-term training mathematics']],
 ['VII','Training Tetris and Program Design',['Scheduling training modalities','Balancing strength, skill, and recovery','Building adaptable programs']],
 ['VIII','The Strength Lab Reference Atlas',['Movement reference','Programming and terminology reference','Training decision reference']]
 ];
 return `<div id="learn-browser" class="hub-page learn-hub"><section class="hero"><h1>Strength Lab Books</h1><p class="small muted">An eight-volume training library under development. Expand a book to see its planned subjects. The chapter outlines are provisional and no unfinished manuscript is presented as published instruction.</p></section><div class="book-series">${books.map(([num,title,sections])=>`<details class="hub-tile book-volume"><summary><strong>Book ${num} · ${title}</strong><span>In development</span></summary><div class="hub-content"><p class="small muted">${num==='I'?'Working manuscript exists; editorial and source review are incomplete.':'Planned volume; instructional chapters are not yet published.'}</p><div class="book-chapters">${sections.map(section=>`<div class="book-chapter"><span>${section}</span><small>In development</small></div>`).join('')}</div></div></details>`).join('')}</div><section class="card" id="movement-library"><h2>Movement library</h2><p class="small muted">Browse the movement lessons and practice pathways currently available in Strength Lab.</p><div class="field"><label for="learn-search">Search movements</label><input id="learn-search" type="search" value="${esc(learnQuery)}" placeholder="Search by movement name"></div><div id="learn-results">${renderLearningList()}</div>${learnSelected?`<button id="learn-back" class="button secondary">Back to movement list</button>${renderInstruction(learnSelected)}`:''}${renderMovementPathways()}</section></div>`;
}
function sourceResults(){const q=search.toLowerCase().trim();const found=sourceData.filter(x=>fullMatches===null?(!q||x.title.toLowerCase().includes(q)):fullMatches.has(x.id));return `<p class="small muted">${found.length} matching sources · showing first 80</p>${found.slice(0,80).map(x=>`<div class="list-item"><div><button class="source-open" data-open-source="${x.id}">${esc(x.title)}</button><div class="small muted">${esc(x.group)} · ${x.words.toLocaleString()} words</div></div></div>`).join('')}${found.length>80?'<p class="muted small">Narrow your search to show more.</p>':''}`;}
async function sourceDocument(id){const chunk=Math.floor(id/30);if(!sourceCache[chunk]){const r=await fetch(`sources-${String(chunk).padStart(2,'0')}.json`);if(!r.ok)throw Error('Transcript not available');sourceCache[chunk]=await r.json();}return sourceCache[chunk].find(x=>x.id===id);}
async function openTranscript(id){try{const d=await sourceDocument(id);openSource=d;const dialog=$('#transcript-dialog');$('#transcript-title').textContent=d.title;$('#transcript-meta').textContent=`${d.group} · full transcript · source #${id}`;$('#transcript-body').textContent=d.text;$('#transcript-link').href=d.url||'#';dialog.showModal();}catch(err){alert('Could not open transcript: '+err.message);}}
async function searchTranscriptBodies(){if(!sourceData)return;const q=search.trim().toLowerCase();if(!q){alert('Enter a phrase to search across the transcripts.');return;}const button=$('#search-full');if(button){button.disabled=true;button.textContent='Searching 720 transcripts…';}try{const found=new Set();for(let chunk=0;chunk<24;chunk++){if(!sourceCache[chunk]){const r=await fetch(`sources-${String(chunk).padStart(2,'0')}.json`);if(!r.ok)throw Error('Transcript archive unavailable');sourceCache[chunk]=await r.json();}for(const d of sourceCache[chunk])if(d.title.toLowerCase().includes(q)||d.text.toLowerCase().includes(q))found.add(d.id);}fullMatches=found;const el=$('#sources');if(el)el.innerHTML=sourceResults();}catch(err){alert('Full-text search failed: '+err.message);}finally{if(button){button.disabled=false;button.textContent='Search inside all transcripts';}}}
async function loadSources(){if(sourceData)return;try{const r=await fetch('source-index.json');sourceData=await r.json();if(tab==='learn'&&learnMode==='atlas')render();}catch{const x=$('#sources');if(x)x.innerHTML='<p class="warning">Source inventory is not available offline yet. Reconnect once to cache it.</p>';}}
function renderProgramming(){
 const defaults=state.trainingDefaults||{};
 const select=(key,label,values,fallback)=>`<div class="field"><label for="training-${key}">${label}</label><select id="training-${key}" data-training-default="${key}">${values.map(value=>`<option value="${value}" ${(defaults[key]??fallback)===value?'selected':''}>${value}</option>`).join('')}</select></div>`;
 return card('Training programming',`<p>Choose a block of familiar movements. Profile changes begin a separate cycle; your history stays intact. Finish or discard an active workout before changing programming.</p><div class="field"><label for="program-block">Program block</label><select id="program-block">${Object.entries(E.BLOCKS).map(([id,b])=>`<option value="${id}" ${(state.programBlock||'abc')===id?'selected':''}>${esc(b.name)}</option>`).join('')}</select></div>
 <details><summary>Prerequisite skills</summary><p class="small">Confirm only skills you can already perform comfortably. These app safeguards are not a technique certification.</p>${Object.entries(E.SKILLS).map(([id,skill])=>`<label class="row small"><span>${esc(skill.name)}</span><input type="checkbox" data-skill="${id}" ${state.skills?.[id]?'checked':''}></label>`).join('')}</details>
 ${Object.entries(E.MOVES).map(([id,m])=>{const p=E.policyFor(id,state),c=p.config;return `<details><summary>${esc(m.name)} programming</summary><div class="field"><label>Profile</label><select data-program-profile="${id}">${E.availableProfiles(id).map(profile=>`<option value="${profile}" ${profile===p.profile?'selected':''}>${esc(E.PROFILE_NAMES[profile])}</option>`).join('')}</select></div><div class="field"><label>Clean exposures per step (app default: 2)</label><input type="number" min="1" max="6" data-program-exposures="${id}" value="${p.exposures}"></div>
 ${E.availableProfiles(id).includes('wave')?`<div class="field"><label>Light weight (${m.unit})</label><input type="number" min="0" data-wave-light="${id}" value="${c.lightWeight||state.weights[id]||0}"></div><div class="field"><label>Heavy weight (${m.unit})</label><input type="number" min="0" data-wave-heavy="${id}" value="${c.heavyWeight||0}"></div><div class="field"><label>Heavy-day reps per set (app default)</label><input type="number" min="1" max="${m.reps}" data-wave-reps="${id}" value="${c.heavyReps??Math.max(1,Math.floor(m.reps*.6))}"></div><p class="small muted">Wave rep/set ratios are app defaults; lower heavy work follows #228. Choose two actual owned weights.</p>`:''}
 ${id==='snatch'||['singleClub','pushup'].includes(m.defaultProfile)?`<label>Set increment <select data-program-step="${id}">${[1,2].map(n=>`<option ${c.step===n?'selected':''}>${n}</option>`).join('')}</select></label>`:''}
 ${m.defaultProfile==='getup'?`<label>Time increment (seconds) <select data-getup-step="${id}">${[30,60].map(n=>`<option ${(c.stepSeconds??60)===n?'selected':''}>${n}</option>`).join('')}</select></label><label>Weaker / non-dominant side <select data-getup-weak="${id}"><option value="left" ${(c.weakSide||'left')==='left'?'selected':''}>Left</option><option value="right" ${c.weakSide==='right'?'selected':''}>Right</option></select></label>`:''}
 ${m.defaultProfile==='pushup'?`<div class="field"><label>Recent conservative clean-rep baseline (already exclude a failed/final rep; 0 leaves this method inactive)</label><input type="number" min="0" max="200" data-pushup-baseline="${id}" value="${c.cleanBaseline??0}"></div><label>Baseline fraction from reviewed example <select data-pushup-fraction="${id}"><option value="0.4" ${(c.fraction??.4)===.4?'selected':''}>40%</option><option value="0.5" ${c.fraction===.5?'selected':''}>50%</option></select></label><p>No daily maximum test is requested. Whole-rep rounding and the exposure gate are app decisions.</p>`:''}
 ${['clubIntermediate','ground','deadliftPractice'].includes(m.defaultProfile)?`<div class="field"><label>Starting sets (app default)</label><input type="number" min="1" max="${['ground','deadliftPractice'].includes(m.defaultProfile)?4:6}" data-intermediate-start="${id}" value="${c.startSets??2}"></div><div class="field"><label>Endpoint sets (app default)</label><input type="number" min="1" max="${['ground','deadliftPractice'].includes(m.defaultProfile)?6:12}" data-intermediate-end="${id}" value="${c.endSets??(['ground','deadliftPractice'].includes(m.defaultProfile)?4:6)}"></div><label>${m.timed?'Seconds':m.side===2?'Reps per side':'Reps'} (app-selected target) <select data-intermediate-reps="${id}">${(m.defaultProfile==='deadliftPractice'?[3,5,8]:m.timed?[30,60,90]:[3,4,5]).map(n=>`<option ${(c.repCount??(m.defaultProfile==='deadliftPractice'?5:m.timed?60:3))===n?'selected':''}>${n}</option>`).join('')}</select></label>`:''}
 ${m.practicePrereqs?.length?`<p>Recent supporting practice required: ${m.practicePrereqs.map(parent=>esc(E.MOVES[parent].name)).join('; ')}. Skill confirmation is still required separately.</p>`:''}
 ${m.pair?`<label>Reps per set <select data-program-reps="${id}">${[3,4,5].map(n=>`<option ${(c.reps||3)===n?'selected':''}>${n}</option>`).join('')}</select></label>`:''}
 ${E.availableProfiles(id).includes('club')?`<div class="field"><label>Starting sets (app default)</label><input type="number" min="1" max="6" data-club-start="${id}" value="${c.startSets??2}"></div><div class="field"><label>Endpoint sets (app default)</label><input type="number" min="1" max="12" data-club-end="${id}" value="${c.endSets??6}"></div><label>Rest seconds (app default) <select data-club-rest="${id}">${[30,60,90,120,180].map(n=>`<option ${(c.restSeconds??60)===n?'selected':''}>${n}</option>`).join('')}</select></label><label>Seconds per side/direction for timed profile <select data-program-seconds="${id}">${[15,30,45,60].map(n=>`<option ${(c.seconds||30)===n?'selected':''}>${n}</option>`).join('')}</select></label><p class="small muted">Timed practice follows the principle in #3; bout lengths, set limits and rest are app defaults, not that lesson's exact program.</p>`:''}
 <label class="row small"><span>Use rep redistribution after repeated stalls when supported (not continuous or timed profiles; #259 principle, app rounding)</span><input type="checkbox" data-program-stall="${id}" ${c.stallStrategy==='redistribute'?'checked':''}></label><p class="small">${esc(p.parameterNotes||'')} ${p.exactParametersSource!==null?'Worked-example parameters from source #'+p.exactParametersSource:'App-default parameters; principles from '+p.principleSources.map(i=>'#'+i).join(', ')}.</p></details>`;}).join('')}
 <details><summary>Coordinated program</summary><p>Optional: rotate selected blocks using recorded work, readiness and available time. Each block keeps its own movement cycles. Selection and spacing below are Strength Lab defaults, informed by #548; this is not its full multi-level program.</p><label class="row"><span>Coordinate selected blocks</span><input type="checkbox" id="composition-enabled" ${state.programComposition?.enabled?'checked':''}></label>${Object.entries(E.BLOCKS).map(([id,b])=>`<label class="row small"><span>${esc(b.name)}</span><input type="checkbox" data-composition-block="${id}" ${(state.programComposition?.blocks||[state.programBlock||'abc']).includes(id)?'checked':''}></label>`).join('')}<label>Days between overlapping demands <select id="composition-gap">${[0,1,2,3].map(n=>`<option ${(state.programComposition?.minGapDays??1)===n?'selected':''}>${n}</option>`).join('')}</select></label><label>Days between heavy/density workouts <select id="composition-hard-gap">${[0,1,2,3,4,7].map(n=>`<option ${(state.programComposition?.hardGapDays??2)===n?'selected':''}>${n}</option>`).join('')}</select></label><p class="small">Pain and prerequisites remain mandatory. Other recovery settings still apply. Disable coordination to return to the single block above.</p></details>
 <details><summary>Recovery and scheduling defaults</summary><p class="small muted">All values here are configurable Strength Lab rules. Sources support varying demand and recovery, not these exact thresholds.</p>
 ${select('skillExposures','Recent clean supporting exposures before pathway eligibility',[1,2,3,4,6],2)}${select('minGapDays','Minimum calendar days between overlapping demands',[0,1,2,3],0)}${select('maxTrainingDays','Maximum training days per rolling seven days',[3,4,5,6,7],6)}${select('maxHardMovements','Maximum heavy/density movements in one session',[1,2,3],3)}${select('maxLoadJump','Maximum offered load increase (fraction)',[.1,.25,.5,1],.25)}${select('reentryDays','Days absent before reduced re-entry',[7,14,21,28],14)}${select('recoveryFraction','Low-readiness set fraction',[.25,.5,.75],.5)}${select('reentryFraction','Re-entry set fraction',[.5,.7,.75],.7)}${select('deloadEvery','Lighter exposure after this many qualifying exposures (0 disables)',[0,6,8,12],0)}</details><button class="button secondary" id="save-programming">Save training programming</button>`);
}
function saveProgramming(){
 if(draft){alert('Finish or discard the current workout before changing programming.');return;}
 try{
  let next={...state,programBlock:$('#program-block').value,skills:{...(state.skills||{})},trainingDefaults:{}};
  document.querySelectorAll('[data-skill]').forEach(el=>next.skills[el.dataset.skill]=el.checked);
  document.querySelectorAll('[data-training-default]').forEach(el=>next.trainingDefaults[el.dataset.trainingDefault]=Number(el.value));
  for(const el of document.querySelectorAll('[data-program-profile]')){
   const id=el.dataset.programProfile,profile=el.value,c={profile,exposures:Number($(`[data-program-exposures="${id}"]`).value),stallStrategy:$(`[data-program-stall="${id}"]`).checked?'redistribute':'repeat'};
   if(profile==='wave'){c.lightWeight=Number($(`[data-wave-light="${id}"]`).value);c.heavyWeight=Number($(`[data-wave-heavy="${id}"]`).value);c.heavyReps=Number($(`[data-wave-reps="${id}"]`).value);}
   if(['snatch','singleClub','pushup'].includes(profile))c.step=Number($(`[data-program-step="${id}"]`).value);
   if(profile==='pushup'){c.cleanBaseline=Number($(`[data-pushup-baseline="${id}"]`).value);c.fraction=Number($(`[data-pushup-fraction="${id}"]`).value);c.cycleRevision=state.programming?.[id]?.cycleRevision||0;}
   if(['clubIntermediate','ground','deadliftPractice'].includes(profile)){c.startSets=Number($(`[data-intermediate-start="${id}"]`).value);c.endSets=Number($(`[data-intermediate-end="${id}"]`).value);c.repCount=Number($(`[data-intermediate-reps="${id}"]`).value);}
   if(profile==='getup'){c.stepSeconds=Number($(`[data-getup-step="${id}"]`).value);c.weakSide=$(`[data-getup-weak="${id}"]`).value;}
   if(profile==='grind')c.reps=Number($(`[data-program-reps="${id}"]`).value);
   if(profile==='club'){c.seconds=Number($(`[data-program-seconds="${id}"]`).value);c.startSets=Number($(`[data-club-start="${id}"]`).value);c.endSets=Number($(`[data-club-end="${id}"]`).value);c.restSeconds=Number($(`[data-club-rest="${id}"]`).value);}
   next=E.configureMovement(next,id,c);
  }
  const compositionBlocks=[...document.querySelectorAll('[data-composition-block]:checked')].map(el=>el.dataset.compositionBlock);
  if($('#composition-enabled').checked||state.programComposition)next.programComposition={enabled:$('#composition-enabled').checked,blocks:compositionBlocks.length?compositionBlocks:[next.programBlock],minGapDays:Number($('#composition-gap').value),hardGapDays:Number($('#composition-hard-gap').value)};
  E.validateProgramming(next);const previous=state;state=next;if(!save()){state=previous;return;}render();
 }catch(error){alert('Cannot save programming: '+error.message);}
}
function renderSettings(){
 const section=(title,description,body)=>`<details class="hub-tile"><summary><strong>${title}</strong><span>${description}</span></summary><div class="hub-content">${body}</div></details>`;
 const checked=(key,fallback)=>((state.trainingPreferences?.[key]??fallback)?'checked':'');
 const gear=`<section id="training-setup" class="setup-card"><p class="small muted">Choose what to include. You'll record actual working loads during foundation workouts.</p>
 <label class="gear-check"><input type="checkbox" id="gear-kb" ${checked('useKb',true)}> Kettlebells</label>
 <label class="gear-check"><input type="checkbox" id="gear-club" ${checked('useClub',true)}> Heavy clubs</label>
 <label class="gear-check"><input type="checkbox" id="gear-bodyweight" ${checked('useBodyweight',true)}> Bodyweight training</label>
 <label class="gear-check"><input type="checkbox" id="gear-double" ${checked('useDoubleKb',false)}> Include double-kettlebell exercises (matched pair available)</label>
 <label class="gear-check"><input type="checkbox" id="gear-complexes" ${checked('useComplexes',true)}> Include kettlebell complexes when prerequisite skills are ready (advisory only for now)</label>
 <label class="gear-check"><input type="checkbox" id="gear-twohand" ${checked('useTwoHandClub',true)}> Include two-handed club exercises (one club)</label>
 <div class="two"><label>Training days per week (Strength: maximum 4)<select id="training-days">${[1,2,3,4,5,6,7].map(n=>`<option value="${n}" ${n===(state.trainingPreferences?.daysPerWeek||3)?'selected':''}>${n}</option>`).join('')}</select></label>
 <label>Usual workout target<select id="default-minutes">${[30,45,60,75,90,120].map(n=>`<option value="${n}" ${state.defaultMinutes===n?'selected':''}>${durationLabel(n)}</option>`).join('')}</select></label></div>
 <div class="two"><label>Maximum kettlebell (kg)<input id="max-kb-kg" type="number" min="1" max="100" step="1" value="${esc((state.equipment?.maxKbKg??(Math.max(...(state.equipment?.kb||[]),0)||32)))}"></label><label>Maximum club (lb)<input id="max-club-lb" type="number" min="1" max="100" step="1" value="${esc((state.equipment?.maxClubLb??(Math.max(...(state.equipment?.club||[]),0)||17)))}"></label></div><p class="small muted">Equipment ceilings prevent suggested weight increases beyond what you own. Change these when you upgrade your equipment; training history is preserved.</p> <label>Available heavy club weights (lb, comma-separated)<input id="owned-club-weights" type="text" inputmode="decimal" value="${esc((state.equipment?.club||[]).join(', '))}" placeholder="5, 7, 10, 12, 15, 17"></label><p class="small muted">List the loads you can actually assemble with your club. The maximum is a separate limit.</p><label>Available single kettlebell weights (kg, comma-separated)<input id="owned-kb-weights" type="text" inputmode="decimal" value="${esc((state.equipment?.kb||[]).join(', '))}" placeholder="12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32"></label><p class="small muted">List weights you can actually assemble, including adjustable increments. This is separate from your maximum.</p><label>Matched kettlebell pairs (kg per bell, comma-separated)<input id="matched-kb-pairs" type="text" inputmode="decimal" value="${esc((state.equipment?.pairs||[]).join(', '))}" placeholder="12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32"></label><p class="small muted">Only list weights for which you can assemble two kettlebells simultaneously. Leave blank if no matched pairs are available.</p><button id="save-setup" class="button full">Save Equipment & Time</button></section>`;
 const pref=state.trainingPreferences||{};
 const programming=`<p class="small muted">Tetris-inspired A/B/C is the default. Choose your emphasis and how much variation you enjoy; progression still follows your recorded training.</p>
 <label>Training focus<select id="training-focus">${[['balanced','Balanced / Train for Life'],['strength','Strength emphasis'],['capacity','Work capacity'],['skill','Skill development']].map(([v,n])=>`<option value="${v}" ${(pref.focus||'balanced')===v?'selected':''}>${n}</option>`).join('')}</select></label>
 <label>Variety<select id="training-variety">${[['consistent','Consistent core movements'],['moderate','Moderate — familiar structure, varied support'],['high','High — more supporting movement variation']].map(([v,n])=>`<option value="${v}" ${(pref.variety||'moderate')===v?'selected':''}>${n}</option>`).join('')}</select></label>
 <label class="gear-check"><input type="checkbox" id="training-conditioning" ${pref.conditioning!==false?'checked':''}> Include conditioning / EMOM opportunities</label>
 <label class="gear-check"><input type="checkbox" id="training-skill-days" ${pref.skillSessions!==false?'checked':''}> Include dedicated skill practice</label>
 <p class="small muted">Core exercises repeat so progress can be measured. These preferences influence supporting exercise selection; the A/B/C engine now alternates normal and lighter-volume exposures for eligible movements. Light exposures preserve your progression streak without counting as advancement; heavy-weight changes still require deliberate load selection.</p>
 <button id="save-training-focus" class="button full">Save Training Focus</button>`;
 const emphasisSettings=`<p class="small muted">Change priorities without resetting history or equipment.</p>${emphasisEditorFields('settings')}<button id="save-emphasis" class="button full">Save Training Emphasis</button>`;
 const fundamentals=`<p class="small muted">Check only movements you can already perform with control. Unchecked skills stay as prerequisites; starting loads are collected during workouts.</p>
 ${['hingePattern','pushupTechnique','bearSquat','swing','clean','rack','overhead','doublePress','doubleSquat','clubGrip','clubTwoHandFoundation','clubInside','clubOutside','clubShield'].map(id=>`<label class="row small"><span>${esc(E.SKILLS[id].name)}</span><input type="checkbox" data-foundation-skill="${id}" ${state.skills?.[id]?'checked':''}></label>`).join('')}
 <button id="save-foundation-skills" class="button full">Save Familiar Movements</button>`;
 const pushupBaseline=`<p class="small muted">Optional: enter a conservative number of clean push-ups you can repeat with good form, not a maximum test. This unlocks the push-up EMOM progression.</p><label>Clean push-up baseline (3–200)<input id="pushup-baseline" type="number" min="3" max="200" step="1" value="${esc(state.programming?.pushup?.cleanBaseline||'')}" placeholder="Not set"></label><button class="button full" id="save-pushup-baseline">Save Push-up Baseline</button>`;
 const timer=`<label>Timer mode<select id="timer-mode">${['manual','automatic','hybrid'].map(mode=>`<option value="${mode}" ${(state.timerMode||'manual')===mode?'selected':''}>${mode[0].toUpperCase()+mode.slice(1)}</option>`).join('')}</select></label><p class="small muted">Manual, automatic, or hybrid interval pacing. Timers never log sets for you.</p><button class="button secondary" id="save-timer-mode">Save Timer Preference</button>`;
 return `<div class="hub-page settings-hub"><section class="hero"><h1>Settings</h1></section><div class="hub-group"><h2>My Training</h2>
 ${section('Equipment & Training Time','What you own and when you can train',gear)}
 ${section('Training Emphasis','Major, Minor, Off and mobility-only',emphasisSettings)}
 ${section('Training Focus & Variety','Personalize your training emphasis',programming)}
 ${section('Pause Training','Temporarily suspend scheduled workouts',pauseControls())}
 
 ${section('Push-up Baseline','Enable optional push-up progression',pushupBaseline)}
 </div><div class="hub-group"><h2>Advanced &amp; Data</h2>${section('Timer & Alerts','Interval pacing',timer)}</div>
 <div class="hub-group"><h2>Backups</h2>${section('Export Backup','Save your training data',`<button class="button" id="export">Export JSON backup</button><button class="button secondary" id="export-csv">Export CSV</button>`)}
 ${section('Restore Backup','Import saved JSON',`<input id="import" type="file" accept=".json,application/json">`)}
 ${section('Check for App Update','Refresh app code without erasing workouts',`<p class="small muted">Checks for a newer installed version and refreshes the app. Your training data remains in local storage.</p><button class="button secondary" id="check-app-update">Check for App Update</button><p class="small muted" id="app-update-status" role="status"></p>`)}
 ${section('Clear All App Data','Irreversible local reset',`<button class="button danger" id="reset">Clear All App Data</button><dialog id="reset-confirm-dialog"><h2>Clear all Strength Lab data?</h2><p>All saved workouts, progression, equipment settings, preferences and unfinished workouts on this device will be erased. This cannot be undone.</p><p>Download a complete JSON backup and verify that it is saved before continuing.</p><button type="button" class="button secondary" id="reset-download-backup">Download Backup</button><label class="gear-check"><input type="checkbox" id="reset-backup-confirmed"> I have verified that my backup is saved, or I accept permanent loss of my data.</label><div class="two"><button type="button" class="button secondary" id="reset-cancel">Cancel</button><button type="button" class="button danger" id="reset-confirm" disabled>Clear All Data</button></div></dialog>`)}</div>
 <div class="hub-group"><h2>About</h2>${section('App Info & Version','Strength Lab development preview',`<p>Data stays in your browser unless exported. Export a backup before clearing browser data or switching devices.</p>`)}</div></div>`;
}

document.addEventListener('change',e=>{const key=e.target?.dataset?.simpleTimerSetting;if(!key)return;const value=Number(e.target.value),max=key==='sets'?100:3600,min=key==='sets'?1:0;if(!Number.isInteger(value)||value<min||value>max){e.target.value=simpleTimer[key];return;}simpleTimer[key]=value;simpleTimer.index=0;simpleTimer.remaining=simpleSequence()[0]?.seconds||0;saveSimpleTimer();});
function render(){if($('#workout-focus'))focusExpanded=$('#workout-focus').open;document.querySelectorAll('[data-editor][open]').forEach(el=>openEditors.add(el.dataset.editor));const main=$('#app');main.dataset.activeTab=tab;main.innerHTML=(storageReady&&storageNotice()?'<div class="notice warning" role="alert" id="storage-notice">'+esc(storageNotice())+'</div>':'')+(storageRecoveryIssue?'<div class="notice warning" role="alert">Storage recovery is pending. Saved writes are blocked; export a backup before closing.</div>':'')+(tab==='today'?renderToday():tab==='progress'?renderProgress():tab==='learn'?renderLearn():renderSettings());if(storageReady&&(!storageWritable||storageConflict||storageRecoveryIssue)){main.querySelectorAll('input,select,textarea,button').forEach(el=>{if(el.closest('#learn-browser')&&!el.hasAttribute('data-confirm-learned'))return;if(!['export','export-csv','search-full','clear-source','source-search','import'].includes(el.id)&&el.dataset.editActivity===undefined&&el.dataset.calendarDay===undefined&&el.dataset.week===undefined&&!el.hasAttribute('data-calendar-today')&&el.dataset.openSource===undefined&&el.dataset.instruction===undefined&&el.dataset.prep===undefined&&el.dataset.cyclePage===undefined&&el.dataset.selectWorkout===undefined&&el.dataset.historyView===undefined&&el.dataset.learn===undefined)el.disabled=true;});}
 document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));updateTimer();}
function download(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
function replaceWeight(id){if(draft){alert('Finish or discard the active workout before changing its working weight.');return;}const options=E.availableWorkingLoads(state,id);if(!options.length){alert('No available replacement loads. Configure your equipment in Settings.');return;}const answer=prompt('Replacement weight for '+E.MOVES[id].name+' ('+E.MOVES[id].unit+'): '+options.join(', '),String(options[0]));if(answer===null)return;try{const next=E.replaceUnavailableLoad(state,id,Number(answer));if(!persistTraining(next,draft))return;state=next;render();}catch(error){alert(error.message);}}
function chooseWeight(id){if(draft){alert('Finish or discard the active workout before changing its next load.');return;}const m=E.MOVES[id],opts=E.loadOptions(state,id);if(!opts.length){alert('No eligible heavier load within your configured jump limit. Maintain, add suitable equipment, or deliberately review the limit in Settings.');return;}const answer=prompt(`Next available ${m.name} weight (${m.unit}): ${opts.join(', ')}. Enter one, or cancel to maintain.`,String(opts[0]));if(answer===null)return;try{state=E.selectLoad(state,id,Number(answer));save();render();}catch(error){alert(error.message);}}
document.addEventListener('change',e=>{const b=e.target;if(!b.matches('[data-quick-complete]'))return;if(!checkWriter()||!draft){render();return;}const i=Number(b.dataset.quickComplete),item=draft.items[i],rx=draft.plan.items[i];if(!item||!rx)return;const before=JSON.stringify(item.sets),checked=b.checked;item.sets.forEach(set=>{set.done=checked;set.skipped=!checked;if(checked){if(rx.side===2&&set.bothSides===undefined)set.bothSides=true;if(rx.continuous&&set.continuous===undefined)set.continuous=true;if(rx.roundSeconds&&set.timingValid===undefined)set.timingValid=true;}});if(!saveDraft())item.sets=JSON.parse(before);render();});
document.addEventListener('change',e=>{
 const id=e.target.id;if(!['history-range-preset','history-date-from','history-date-to'].includes(id))return;
 if(id==='history-range-preset'){
  historyRangePreset=e.target.value;
  if(historyRangePreset==='all'){historyDateFrom='';historyDateTo='';}
  else if(historyRangePreset==='custom'){historyDateFrom=historyDateFrom||today();historyDateTo=historyDateTo||today();}
  else {const d=new Date(today()+'T12:00:00Z'),iso=x=>x.toISOString().slice(0,10);
   if(historyRangePreset==='month'){historyDateFrom=iso(new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1)));historyDateTo=today();}
   if(historyRangePreset==='lastmonth'){historyDateFrom=iso(new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()-1,1)));historyDateTo=iso(new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),0)));}
   if(historyRangePreset==='90days'){historyDateFrom=iso(new Date(d.getTime()-89*86400000));historyDateTo=today();}
  }
 }else{historyRangePreset='custom';historyDateFrom=document.querySelector('#history-date-from')?.value||'';historyDateTo=document.querySelector('#history-date-to')?.value||'';}
 notebookVisibleRows=60;const wasOpen=document.querySelector('.workout-history-disclosure')?.open!==false;render();const section=document.querySelector('.workout-history-disclosure');if(section)section.open=wasOpen;
});
document.addEventListener('change',e=>{if(e.target.id==='today-minutes'){todayMinutes=Number(e.target.value);render();}if(e.target.id==='today-readiness'){readiness=e.target.value;render();}});
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 if(!storageReady)return;
 if(!(b.dataset.editActivity||b.dataset.calendarDay||b.dataset.week||b.hasAttribute('data-calendar-today')||b.dataset.tab||b.dataset.instruction!==undefined||b.dataset.prep!==undefined||b.dataset.historyView!==undefined||b.dataset.movementHistory!==undefined||b.dataset.moreNotebook!==undefined||b.dataset.moreMovementHistory!==undefined||b.dataset.selectWorkout!==undefined||b.dataset.cyclePage!==undefined||b.dataset.openSource!==undefined||b.dataset.learn||b.dataset.learnMove!==undefined||b.hasAttribute('data-learn-settings')||b.id==='learn-back'||['export','export-csv','search-full','clear-source'].includes(b.id))&&!checkWriter())return;
  if(b.id==='start-mobility'){if(draft){alert('Finish or discard the active strength workout first.');return;}unlockTimerAudio();mobilityStartedAt=Date.now();mobilityStageIndex=-1;mobilitySignalKey='';mobilityLastRemaining=null;if(mobilityClock)clearInterval(mobilityClock);mobilityClock=setInterval(updateMobilityClock,1000);render();updateMobilityClock();return;}
 if(b.id==='cancel-mobility'){mobilityStartedAt=0;try{window.speechSynthesis?.cancel();}catch{}if(mobilityClock)clearInterval(mobilityClock);mobilityClock=null;render();return;}
 if(b.id==='finish-mobility'){if(!mobilityStartedAt)return;const elapsed=Math.max(1,Math.round((Date.now()-mobilityStartedAt)/60000));if(elapsed<mobilityRoutine().reduce((n,x)=>n+x.min,0)&&!confirm('Record '+elapsed+' minutes as a partial mobility session?'))return;try{const value={id:'a'+newIdentity(),date:today(),type:'mobility',duration:Math.min(1440,elapsed),effort:'easy',status:'completed',replacesStrength:true,notes:'Guided mobility replacing today’s strength opportunity; current prescription remains unfinished. No lifting credit.'};const next=C.activity(state,value);E.validateBackup(next);if(!persistTraining(next,draft))return;state=next;mobilityStartedAt=0;try{window.speechSynthesis?.cancel();}catch{}if(mobilityClock)clearInterval(mobilityClock);mobilityClock=null;correctionNotice='Mobility recorded. Your next strength prescription remains queued; no lifting credit or catch-up workout was added.';render();}catch(error){alert('Cannot record mobility: '+error.message);}return;}
 if(b.dataset.calendarDay){const planOpen=document.querySelector('.training-plan-disclosure')?.open===true;const expandedOptions=[...document.querySelectorAll('.training-plan-option')].map(el=>el.open);selectedDate=b.dataset.calendarDay;activityEdit=null;render();const plan=document.querySelector('.training-plan-disclosure');if(plan){plan.open=planOpen;plan.querySelectorAll('.training-plan-option').forEach((el,i)=>{el.open=expandedOptions[i]===true;});}return;}
 if(b.dataset.week){weekStart=C.add(weekStart,Number(b.dataset.week)*7);selectedDate=weekStart;activityEdit=null;render();return;}
 if(b.hasAttribute('data-calendar-today')){selectedDate=today();weekStart=C.monday(today());render();return;}
 if(b.dataset.moveWorkout||b.dataset.moveHere){try{const date=b.dataset.moveHere?selectedDate:$('#move-workout-date').value,next=C.reschedule(state,b.dataset.moveWorkout||b.dataset.moveHere,date,today());E.validateBackup(next);if(!persistTraining(next,draft))return;state=next;selectedDate=date;weekStart=C.monday(date);render();}catch(error){alert(error.message);}return;}
 if(b.id==='apply-pause'){if(draft){alert('Finish or discard the active workout before pausing the queue.');return;}try{const kind=$('#pause-kind').value,days=Number($('#pause-days').value);if(kind==='duration'&&(!Number.isInteger(days)||days<1||days>365))throw Error('Choose 1–365 pause days');const until=kind==='manual'?null:kind==='duration'?C.add(today(),days):$('#pause-date').value;if(until&&until<=today())throw Error('Choose a future resume date');const next={...state,paused:true,pauseStarted:today(),pauseUntil:until};E.validateBackup(next);if(!persistTraining(next,draft))return;state=next;render();}catch(error){alert(error.message);}return;}
 if(b.id==='resume-training'){const next={...state,paused:false,pauseUntil:null,resumeDate:today()};if(!persistTraining(next,draft))return;state=next;selectedDate=today();weekStart=C.monday(today());render();return;}
 if(b.dataset.editActivity){activityEdit=N.copy(state.activities.find(x=>x.id===b.dataset.editActivity));selectedDate=activityEdit.date;if(tab==='progress')render();else render();$('#activity-form').scrollIntoView({block:'start'});return;}
 if(b.id==='cancel-activity'){activityEdit=null;render();return;}
 if(b.id==='save-activity'||b.id==='restore-activity'){try{let value;if(b.id==='restore-activity'){value={...activityEdit.versions.at(-1).before,versions:activityEdit.versions};}else{const date=$('#activity-date').value,status=$('#activity-status').value;if(status==='completed'&&date>today())throw Error('Use Planned for a future activity');value={id:activityEdit?.id||'a'+newIdentity(),date,type:$('#activity-type').value,duration:Number($('#activity-duration').value),effort:$('#activity-effort').value,status,replacesStrength:$('#activity-replaces').checked,notes:$('#activity-notes').value};for(const k of ['distance','elevation'])if($('#activity-'+k).value!=='')value[k]=Number($('#activity-'+k).value);}
  const next=C.activity(state,value);E.validateBackup(next);if(!persistTraining(next,draft))return;state=next;activityEdit=null;correctionNotice='Activity saved. Strength queue and recovery opportunities updated; no lifting credit added.';render();
 }catch(error){alert('Cannot save activity: '+error.message);}return;}
 if(b.id==='save-training-plan-schedule'){if(draft){alert('Finish or discard the current workout before changing your schedule.');return;}try{const daysPerWeek=Number($('#plan-training-days').value),defaultMinutes=Number($('#plan-default-minutes').value);if(!Number.isInteger(daysPerWeek)||daysPerWeek<1||daysPerWeek>7||![30,45,60,75,90,120].includes(defaultMinutes))throw Error('Invalid schedule');if((state.trainingPreferences?.focus||'balanced')==='strength'&&daysPerWeek>4)throw Error('Strength emphasis supports at most four sessions per week.');const next={...state,defaultMinutes,trainingPreferences:{daysPerWeek:3,...state.trainingPreferences,daysPerWeek}};E.validateBackup(next);if(!persistTraining(next,draft))return;state=next;todayMinutes=defaultMinutes;render();}catch(error){alert('Cannot save schedule: '+error.message);}return;}
 if(b.id==='save-training-style-inline'){if(draft){alert('Finish or discard your current workout before changing workout style.');return;}try{const focus=$('#train-style-focus').value,variety=$('#train-style-variety').value;if(!['balanced','strength','capacity','skill'].includes(focus)||!['consistent','moderate','high'].includes(variety))throw Error('Invalid workout style');if(focus==='strength'&&(state.trainingPreferences?.daysPerWeek||3)>4)throw Error('Set training days to four or fewer before choosing Strength emphasis.');const next={...state,programBlock:'abc',trainingPreferences:{daysPerWeek:3,...state.trainingPreferences,focus,variety,conditioning:$('#train-style-conditioning').checked,skillSessions:$('#train-style-skill').checked}};E.validateBackup(next);if(!persistTraining(next,draft))return;state=next;render();}catch(error){alert('Cannot save workout style: '+error.message);}return;}
 if(b.id==='open-emphasis-settings'){
  const root=document.querySelector('#train-emphasis-dialog');if(!root)return;
  const {levels,mobilityOnly}=E.trainingEmphasis(state);
  root.querySelectorAll('[data-emphasis-family]').forEach(el=>{el.value=levels[el.dataset.emphasisFamily]||'minor';});
  const check=root.querySelector('[data-mobility-editor]');if(check)check.checked=mobilityOnly;
  root.showModal();return;
 }
 if(b.id==='save-emphasis-dialog'){try{saveEmphasisFrom('dialog');}catch(error){alert('Cannot save training emphasis: '+error.message);}return;}
 if(b.id==='save-emphasis'){try{saveEmphasisFrom('settings');}catch(error){alert('Cannot save training emphasis: '+error.message);}return;}
 if(b.id==='save-training-focus'){if(draft){alert('Finish or discard your current workout before changing training focus.');return;}try{const focus=$('#training-focus').value,variety=$('#training-variety').value;if(!['balanced','strength','capacity','skill'].includes(focus)||!['consistent','moderate','high'].includes(variety))throw Error('Invalid training preference');if(focus==='strength'&&(state.trainingPreferences?.daysPerWeek||3)>4)throw Error('Set training days to four or fewer in Equipment & Time before selecting Strength emphasis.');const next={...state,programBlock:'abc',trainingPreferences:{daysPerWeek:3,...state.trainingPreferences,focus,variety,conditioning:$('#training-conditioning').checked,skillSessions:$('#training-skill-days').checked}};E.validateBackup(next);if(!persistTraining(next,draft))return;state=next;render();}catch(error){alert('Cannot save training focus: '+error.message);}return;}
 if(b.id==='save-pushup-baseline'){if(draft){alert('Finish or discard the current workout before changing the baseline.');return;}try{const baseline=Number($('#pushup-baseline').value);if(!Number.isInteger(baseline)||baseline<3||baseline>200)throw Error('Enter 3–200 controlled repetitions');const next=E.retestPushup(state,baseline);E.validateBackup(next);if(!persistTraining(next,draft))return;state=next;render();}catch(error){alert('Cannot save push-up baseline: '+error.message);}return;}
 if(b.id==='save-foundation-skills'){if(draft){alert('Finish or discard the current workout before changing prerequisites.');return;}const skills={...state.skills};document.querySelectorAll('[data-foundation-skill]').forEach(el=>skills[el.dataset.foundationSkill]=el.checked);const next={...state,skills};if(!persistTraining(next,draft))return;state=next;render();return;}
 if(b.id==='save-setup'){if(draft){alert('Finish or discard the active workout before changing Training Setup.');return;}try{const useKb=$('#gear-kb').checked,useClub=$('#gear-club').checked,useBodyweight=$('#gear-bodyweight').checked,useDoubleKb=useKb&&$('#gear-double').checked,useComplexes=useKb&&$('#gear-complexes').checked,useTwoHandClub=useClub&&$('#gear-twohand').checked;if(!useKb&&!useClub&&!useBodyweight)throw Error('Select at least one training equipment type');const daysPerWeek=Number($('#training-days').value);if((state.trainingPreferences?.focus||'balanced')==='strength'&&daysPerWeek>4)throw Error('Strength emphasis supports up to four strength sessions per week. Choose 3–4 days or change training focus.');const maxKbKg=Number($('#max-kb-kg').value),maxClubLb=Number($('#max-club-lb').value);if(!Number.isFinite(maxKbKg)||maxKbKg<1||maxKbKg>100||!Number.isFinite(maxClubLb)||maxClubLb<1||maxClubLb>100)throw Error('Equipment ceilings must be between 1 and 100');const clubInput=$('#owned-club-weights').value.trim();const clubLoads=clubInput?clubInput.split(',').map(v=>Number(v.trim())):[];if(clubLoads.some(w=>!Number.isFinite(w)||w<=0||w>maxClubLb))throw Error('Club weights must be positive numbers at or below the club ceiling');const ownedClub=[...new Set(clubLoads)].sort((a,b)=>a-b);const ownedInput=$('#owned-kb-weights').value.trim();const owned=ownedInput?ownedInput.split(',').map(v=>Number(v.trim())):[];if(owned.some(w=>!Number.isFinite(w)||w<=0||w>maxKbKg))throw Error('Single kettlebell weights must be positive numbers at or below the kettlebell ceiling');const ownedKb=[...new Set(owned)].sort((a,b)=>a-b);const pairInput=$('#matched-kb-pairs').value.trim();const pairs=pairInput?pairInput.split(',').map(v=>Number(v.trim())):[];if(pairs.some(w=>!Number.isFinite(w)||w<=0||w>maxKbKg))throw Error('Matched pair weights must be positive numbers at or below the kettlebell ceiling');const matchedPairs=[...new Set(pairs)].sort((a,b)=>a-b);const next={...state,equipment:{...state.equipment,kb:[...new Set([...ownedKb,...matchedPairs])].sort((a,b)=>a-b),club:ownedClub,maxKbKg,maxClubLb,pairs:matchedPairs},defaultMinutes:Number($('#default-minutes').value),trainingPreferences:{...state.trainingPreferences,daysPerWeek:Number($('#training-days').value),useKb,useClub,useBodyweight,useDoubleKb,useComplexes,useTwoHandClub}};E.validateBackup(next);if(!persistTraining(next,draft))return;state=next;todayMinutes=state.defaultMinutes;render();}catch(error){alert('Cannot save setup: '+error.message);}return;}

 if(b.dataset.instruction){openMovement(b.dataset.instruction);return;}
 if(b.dataset.prep){const info={walk:['Easy walking in place','Take relaxed steps in clear space at a comfortable pace. No breath holds or loaded work.'],mobility:['Gentle joint movement','Five slow shoulder circles each direction and five ankle rocks each side. Stay in a comfortable pain-free range, pause and repeat as time permits.'],breathing:['Relaxed breathing','Stand or sit comfortably; let breathing settle without forced holds or stretching.']};const x=info[b.dataset.prep];$('#movement-dialog-title').textContent=x[0];$('#movement-dialog-body').textContent=x[1]+' Strength Lab preparation default.';$('#movement-dialog').showModal();return;}
 if(b.dataset.cyclePage){cyclePage=b.dataset.cyclePage==='current'?0:b.dataset.cyclePage==='back'?Math.max(0,cyclePage-3):Math.min(90,cyclePage+3);selectedWorkout=cyclePage;render();return;}
 if(b.dataset.selectWorkout!==undefined){selectedWorkout=Number(b.dataset.selectWorkout);render();$('#selected-workout').scrollIntoView({block:'start'});return;}
 if(b.id==='history-clear-dates'){historyDateFrom='';historyDateTo='';historyRangePreset='all';notebookVisibleRows=60;render();return;}
 if(b.dataset.moreNotebook){notebookVisibleRows+=60;render();return;}
 if(b.dataset.moreMovementHistory){movementVisibleRows+=60;openMovementHistory(document.getElementById('movement-history-dialog')?.dataset.movementId);return;}
 if(b.dataset.movementHistory){movementVisibleRows=60;openMovementHistory(b.dataset.movementHistory);return;}if(b.dataset.historyView){document.getElementById('movement-history-dialog')?.close();historyView=b.dataset.historyView;tab='progress';render();return;}
 
 if(b.dataset.editMovement){const requested=b.dataset.editMovement;const node=document.querySelector(`[data-editor="${b.dataset.editMovement}"]`);if(node?.open){node.open=false;openEditors.delete(b.dataset.editMovement);}else{document.querySelectorAll('[data-editor][open]').forEach(el=>el.open=false);openEditors.clear();openEditors.add(requested);}render();if(openEditors.has(b.dataset.editMovement))document.querySelector(`[data-editor="${b.dataset.editMovement}"]`).scrollIntoView({block:'center'});return;}
 if(b.dataset.addSet||b.dataset.removeSet||b.dataset.movementDone||b.dataset.movementSkip){const [context,index,setIndex]=(b.dataset.addSet||b.dataset.removeSet||b.dataset.movementDone||b.dataset.movementSkip).split(':'),i=Number(index),target=context==='history'?historyEdit?.edit:draft;if(!target)return;const item=target.items[i],rx=target.plan.items[i];
  if(b.dataset.addSet){if(item.sets.length>=200)return;item.sets.push({done:false,reps:rx.reps,weight:rx.weight});}
  if(b.dataset.removeSet)item.sets.splice(Number(setIndex),1);
  if(b.dataset.movementDone)item.sets.forEach(x=>{x.done=true;x.skipped=false;if(rx.side===2&&x.bothSides===undefined)x.bothSides=true;if(rx.continuous&&x.continuous===undefined)x.continuous=true;if(rx.roundSeconds&&x.timingValid===undefined)x.timingValid=true;});
  if(b.dataset.movementSkip)item.sets.forEach(x=>{x.done=false;x.skipped=true;});
  if(context==='active')saveDraft();render();return;
 }
 if(b.dataset.editHistory){if(draft){alert('Finish or discard the active workout before correcting history. Its written prescription must remain stable.');return;}try{const session=state.sessions.find(x=>x.id===b.dataset.editHistory);historyEdit={id:session.id,base:JSON.stringify(session),edit:N.historyDraft(session)};render();}catch(error){alert(error.message);}return;}
 if(b.id==='cancel-correction'){historyEdit=null;render();return;}
 if(b.id==='save-correction'){if(!historyEdit)return;const session=state.sessions.find(x=>x.id===historyEdit.id);if(JSON.stringify(session)!==historyEdit.base){alert('This workout changed; reload the saved record before correcting it.');return;}try{const edit=historyEdit.edit;edit.outcome=$('#history-outcome').value;edit.date=$('#history-date').value;edit.notes=$('#history-notes').value;const before=E.plan(state),next=N.correct(state,historyEdit.id,edit,$('#correction-reason').value||'User correction');E.validateBackup(next);if(!persistTraining(next,null))return;state=next;const changes=N.differences(before,E.plan(state));correctionNotice='Correction saved. Progression and eligibility recalculated; pending load choices reviewed. '+(changes.join('; ')||'Next working targets unchanged. No exposure was duplicated.');historyView=historyEdit.id;historyEdit=null;render();}catch(error){alert('Cannot save correction: '+error.message);}return;}
 if(b.dataset.undoCorrection){if(draft){alert('Finish or discard the active workout before restoring history.');return;}try{const next=N.undo(state,b.dataset.undoCorrection);E.validateBackup(next);if(!persistTraining(next,null))return;state=next;correctionNotice='Previous version restored. Progression recalculated; restoration recorded in the audit trail.';render();}catch(error){alert(error.message);}return;}
 if(b.hasAttribute('data-learn-settings')){tab='settings';render();return;}
 if(b.dataset.learnMove!==undefined){if(!E.MOVES[b.dataset.learnMove])return;learnSelected=b.dataset.learnMove;render();$('#movement-instruction')?.scrollIntoView({block:'start'});return;}
 if(b.id==='learn-back'){learnSelected=null;render();return;}
 if(b.dataset.saveLearnSkills){if(draft){alert('Finish or discard the active workout before changing skill confirmations.');return;}const id=b.dataset.saveLearnSkills;if(!E.MOVES[id])return;const nextSkills={...(state.skills||{})};document.querySelectorAll('[data-learn-skill]').forEach(el=>{if(el.checked)nextSkills[el.dataset.learnSkill]=true;else delete nextSkills[el.dataset.learnSkill];});const previous=state;state={...state,skills:nextSkills};if(!save()){state=previous;return;}render();return;}
 if(b.dataset.confirmLearned){const id=b.dataset.confirmLearned;if(!E.MOVES[id])return;const previous=state;state={...state,learnedMovements:{...state.learnedMovements,[id]:!state.learnedMovements?.[id]}};if(!save()){state=previous;return;}render();return;}
 if(b.hasAttribute('data-retest-pushup')){if(draft){alert('Finish or discard the active workout before reviewing the baseline.');return;}const value=prompt('Enter a recent conservative clean-rep baseline. Exclude any failed/final rep; no maximum test is requested now.',String(state.programming?.pushup?.cleanBaseline||0));if(value===null)return;try{const previous=state;state=E.retestPushup(state,Number(value));if(!save()){state=previous;return;}render();}catch(error){alert(error.message);}return;}
 if(b.id==='save-timer-mode'){state.timerMode=$('#timer-mode').value;if(!save())return;render();return;}
 if(b.id==='save-programming'){saveProgramming();return;}
 if(b.dataset.cycleFor){if(draft){alert('Finish or discard the active workout before changing its cycle.');return;}try{state=E.chooseCycle(state,b.dataset.cycleFor,'density');save();render();}catch(error){alert(error.message);}return;}
 if(b.id==='toggle-pause'){state.paused=!state.paused;save();render();return;}
 if(b.dataset.resolvePain){if(confirm('Resume only when the painful movement has been reviewed and you are comfortable returning. This is your decision, not medical clearance. Resume with reduced work?')){state=E.resolvePain(state,b.dataset.resolvePain);save();render();}return;}
 if(b.dataset.tab){tab=b.dataset.tab;if(tab==='today'){selectedDate=today();weekStart=C.monday(today());activityEdit=null;}render();return;}
 if(b.dataset.openSource!==undefined){openTranscript(Number(b.dataset.openSource));return;}
 if(b.id==='search-full'){searchTranscriptBodies();return;}
 if(b.id==='clear-source'){search='';fullMatches=null;render();return;}
 if(b.dataset.ready){readiness=b.dataset.ready;render();return;}
 if(b.dataset.movementTimer!==undefined){const rx=draft?.plan.items[Number(b.dataset.movementTimer)];if(rx?.durationScope==='total'){timer(rx.reps,`${rx.name} goal`);render();}return;}
 if(b.dataset.startRound!==undefined){const i=Number(b.dataset.startRound),rx=draft?.plan.items[i];if(!rx?.roundSeconds)return;draft.roundStarts??={};draft.roundStarts[rx.id]=Date.now();saveDraft();timer(rx.roundSeconds,`Round · ${rx.name}`);render();return;}
 if(b.id==='start'){unlockTimerAudio();timerCue='';start();return;}
 if(b.id==='save-duration'){state.defaultMinutes=Number($('#default-minutes').value)||45;if(!save())return;todayMinutes=state.defaultMinutes;render();return;}
 if(b.dataset.stage){unlockTimerAudio();timerCue='';panelState.set('warmup',false);panelState.set('cooldown',b.dataset.stage==='cooldown');if(b.dataset.stage==='work'){T.enterWork(draft,Date.now(),true);}else{draft.stage=b.dataset.stage;T.custom(draft,draft.plan.budget.cooldown*60,'Cooldown',Date.now(),T.mode(draft)!=='manual');}saveDraft();render();return;}
 if(b.dataset.timer!==undefined){timer(Number(b.dataset.timer),draft?.stage==='warmup'?'Warmup':draft?.stage==='cooldown'?'Cooldown':'Rest');render();return;}
 if(b.dataset.simpleTimerAction){const action=b.dataset.simpleTimerAction;simpleTimerAction(action);if(action==='start'||action==='edit')simpleTimerExpanded=true;render();return;}
 if(b.dataset.clock){if(!draft)return;unlockTimerAudio();timerCue='';const action=b.dataset.clock;if(action==='primary')T.primary(draft);if(action==='pause')T.pause(draft);if(action==='previous')T.previous(draft);if(action==='restart')T.restart(draft);if(action==='next')T.skip(draft);if(action==='resume')T.resume(draft);if(action==='clear')T.skip(draft);if(action==='add')T.add(draft);if(action==='custom'){const seconds=Number($('#custom-rest-seconds')?.value);if(!Number.isInteger(seconds)||seconds<1||seconds>7200){alert('Enter a rest duration between 1 and 7200 seconds.');return;}T.custom(draft,seconds,'Custom rest',Date.now(),true);}timerPanelOpen=true;saveDraft();render();return;}
 if(b.dataset.focusCheck){const [i,j]=b.dataset.focusCheck.split(':').map(Number);
 const set=draft?.items[i]?.sets[j];if(draft?.stage!=='work'||!set||set.done)return;
 if(!E.validWorkingWeight(draft.plan.items[i].id,set.weight)||!(Number(set.reps)>0)){
  const field=!E.validWorkingWeight(draft.plan.items[i].id,set.weight)?'weight':'reps';
  const input=document.querySelector(`[data-set="${i}:${j}:${field}"]`);
  if(input){input.focus();input.scrollIntoView?.({block:'center',behavior:'smooth'});}
  const notice=document.querySelector('#focus-validation');
  if(notice)notice.textContent=`Enter a valid ${field} before marking this set complete.`;
  return;
 }
 changed(i,j,'done',true);return;}
 if(b.dataset.check){const [i,j]=b.dataset.check.split(':').map(Number);changed(i,j,'done',!draft.items[i].sets[j].done);return;}
 if(b.id==='save-workout'){saveWorkout();return;}
 if(b.id==='discard'){if(confirm('Discard the current workout draft?')){if(!persistTraining(state,null))return;draft=null;clearInterval(timerInterval);render();}return;}
 if(b.dataset.learn){learnMode=b.dataset.learn;render();return;}
 if(b.dataset.replaceWeight){replaceWeight(b.dataset.replaceWeight);return;}
 if(b.dataset.weightFor){chooseWeight(b.dataset.weightFor);return;}
 if(b.dataset.delete){if(confirm('Delete this training entry? The movement progression will be recalculated.')){const next=N.reconcile({...state,sessions:state.sessions.filter(x=>x.id!==b.dataset.delete)},Object.keys(E.MOVES));if(persistTraining(next,draft)){state=next;render();}}return;}
 if(draft&&['save-weights','save-equipment'].includes(b.id)){alert('Finish or discard the active workout before changing weights or equipment.');return;}
 if(b.id==='save-weights'){document.querySelectorAll('[data-weight]').forEach(x=>(state.weights[x.dataset.weight]=Math.max(0,Number(x.value)||0),state.nextWeights[x.dataset.weight]=Math.max(0,Number(x.value)||0)));if(!save())return;alert('Working weights saved.');render();return;}
 if(b.id==='save-equipment'){try{const equipment={...state.equipment};document.querySelectorAll('[data-equipment]').forEach(x=>{equipment[x.dataset.equipment]=[...new Set(x.value.split(',').map(Number).filter(n=>Number.isFinite(n)&&n>0))].sort((a,b)=>a-b)});const next=E.validateProgramming({...state,equipment}),previous=state;state=next;if(!save()){state=previous;return;}alert('Equipment saved.');render();}catch(error){alert('Cannot save equipment: '+error.message);}return;}
 if(b.id==='export'){download('strength-lab-v33-backup.json',JSON.stringify({...state,workoutDraft:draft},null,2),'application/json');return;}
 if(b.id==='export-csv'){const rows=[['date','session','movement','weight','unit','sets','min_reps_or_seconds','quality','pain']];state.sessions.forEach(x=>x.items.forEach(y=>rows.push([x.date,x.title,y.name,y.weight,y.unit,y.actualSets,y.actualReps,y.quality,y.pain])));download('strength-lab-v33-history.csv',rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n'),'text/csv');return;}
 if(b.id==='check-app-update'){
  const status=document.querySelector('#app-update-status');
  b.disabled=true;if(status)status.textContent='Checking for updated app files…';
  try{
   if(!('serviceWorker' in navigator))throw Error('This browser does not support offline app updates. Reload the page while connected.');
   const registration=await navigator.serviceWorker.getRegistration('./');
   if(!registration)throw Error('No service worker is installed yet. Reload while online to install it.');
   await registration.update();
   // Do not delete the active offline cache here. The service worker owns cache
   // rotation on activation; deleting it before a replacement is ready can
   // strand an installed app when the network drops during reload.
   if(status)status.textContent='Update check complete. Reloading app files; saved training is untouched.';
   window.location.reload();
  }catch(error){if(status)status.textContent='Update check could not finish: '+error.message;b.disabled=false;}
  return;
 }
 if(b.id==='reset'){const dialog=document.querySelector('#reset-confirm-dialog');const acknowledgement=document.querySelector('#reset-backup-confirmed');const confirmButton=document.querySelector('#reset-confirm');if(acknowledgement)acknowledgement.checked=false;if(confirmButton)confirmButton.disabled=true;dialog?.showModal();return;}
 if(b.id==='reset-download-backup'){try{const backup=E.validateBackup({...state,workoutDraft:draft});download('strength-lab-v33-backup-before-reset.json',JSON.stringify(backup,null,2),'application/json');}catch(error){alert('Backup could not be prepared: '+error.message);}return;}
 if(b.id==='reset-cancel'){document.querySelector('#reset-confirm-dialog')?.close();return;}
 if(b.id==='reset-confirm'){if(!document.querySelector('#reset-backup-confirmed')?.checked)return;
  if(!confirm('Final confirmation: permanently erase all Strength Lab training data on this device?'))return;
  const next=fresh();if(!persistTraining(next,null))return;state=next;draft=null;todayMinutes=state.defaultMinutes;simpleTimer={prepare:10,work:20,rest:10,sets:8,index:0,remaining:10,running:false,editing:true};try{localStorage.removeItem(SIMPLE_TIMER_KEY);}catch{alert('Training data was cleared, but interval timer preferences could not be erased. Clear browser storage if a complete reset is required.');}mobilityStartedAt=0;clearInterval(timerInterval);if(mobilityClock)clearInterval(mobilityClock);mobilityClock=null;tab='today';render();return;
 }
});
document.addEventListener('change',e=>{if(e.target?.id==='reset-backup-confirmed'){const confirmButton=document.querySelector('#reset-confirm');if(confirmButton)confirmButton.disabled=!e.target.checked;}});
document.addEventListener('change',e=>{const el=e.target;
 if(el.id==='finish-kind'){if(!checkWriter()||!draft)return;draft.finishChoice=el.value;saveDraft();return;}
 if(['learn-equipment','learn-family','pathway-movement'].includes(el.id)){if(el.id==='learn-equipment')learnGear=el.value;if(el.id==='learn-family')learnFamily=el.value;if(el.id==='pathway-movement')learnSelected=el.value;render();return;}
 if(el.id==='import'||el.dataset.set||el.dataset.quality!==undefined||el.dataset.pain!==undefined){if(!checkWriter())return;}
 if(historyEdit&&['history-date','history-notes','history-outcome'].includes(el.id)){if(!checkWriter())return;historyEdit.edit[el.id==='history-date'?'date':el.id==='history-outcome'?'outcome':'notes']=el.value;return;}
 if(el.dataset.hset){if(!checkWriter()||!historyEdit)return;const [i,j,key]=el.dataset.hset.split(':');if(key==='skipped'&&el.checked)historyEdit.edit.items[+i].sets[+j].done=false;historyEdit.edit.items[+i].sets[+j][key]=['done','skipped','bothSides','continuous','timingValid'].includes(key)?el.checked:Number(el.value);return;}
 if(el.dataset.hquality!==undefined){if(checkWriter()&&historyEdit)historyEdit.edit.items[+el.dataset.hquality].quality=el.value;return;}
 if(el.dataset.hpain!==undefined){if(checkWriter()&&historyEdit)historyEdit.edit.items[+el.dataset.hpain].pain=el.checked;return;}
 if(el.dataset.hnote!==undefined){if(checkWriter()&&historyEdit)historyEdit.edit.items[+el.dataset.hnote].note=el.value;return;}
 if(el.dataset.itemNote!==undefined){editDraft(+el.dataset.itemNote,'note',el.value);return;}
 if(el.dataset.set){const [i,j,key]=el.dataset.set.split(':');changed(+i,+j,key,['done','skipped','bothSides','timingValid','continuous'].includes(key)?el.checked:el.value);return;}
 if(el.dataset.quality!==undefined){editDraft(+el.dataset.quality,'quality',el.value);return;}
 if(el.dataset.pain!==undefined){editDraft(+el.dataset.pain,'pain',el.checked);return;}
 if(el.id==='import'){const f=el.files?.[0];if(!f)return;if(f.size>10000000){alert('Cannot restore backup: Backup is too large');el.value='';return;}f.text().then(t=>{const x=E.validateBackup(JSON.parse(t));if(confirm('Replace training data and the active workout with this backup?')){const {workoutDraft,...nextState}=x;if(!persistTraining(nextState,workoutDraft))return;state=nextState;draft=workoutDraft;clearInterval(timerInterval);tab=draft?'today':'progress';render();}}).catch(err=>alert('Cannot restore backup: '+err.message));return;}
});
document.addEventListener('input',e=>{if(e.target.id==='learn-search'){learnQuery=e.target.value;$('#learn-results').innerHTML=renderLearningList();return;}if(e.target.id==='source-search'){search=e.target.value;fullMatches=null;const el=$('#sources');if(el&&sourceData)el.innerHTML=sourceResults();}if(e.target.id==='notes'&&draft&&checkWriter()){draft.notes=e.target.value;saveDraft();}});
window.addEventListener('online',()=>{const network=$('#network');if(network)network.textContent='LOCAL FIRST';});window.addEventListener('offline',()=>{const network=$('#network');if(network)network.textContent='OFFLINE READY';});
setInterval(()=>{updateTimer()},250);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&draft)updateTimer();});
window.addEventListener('pageshow',()=>{if(draft)updateTimer();});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
window.addEventListener('storage',event=>{
 if(![KEY,DRAFT,JOURNAL,null].includes(event.key))return;
 if(storageWritable){storageConflict=true;clearInterval(timerInterval);render();}
 else if(storageReady){loadTrainingSnapshot();render();}
});
document.addEventListener('toggle',e=>{if(e.target.classList?.contains('simple-timer-disclosure'))simpleTimerExpanded=e.target.open;if(e.target.dataset?.panel)panelState.set(e.target.dataset.panel,e.target.open);if(e.target.id==='workout-focus')focusExpanded=e.target.open;if(e.target.id==='optional-timer')timerPanelOpen=e.target.open;if(e.target.dataset?.editor){if(e.target.open)openEditors.add(e.target.dataset.editor);else openEditors.delete(e.target.dataset.editor);}},true);
$('#app').innerHTML='<div role="status">Loading saved training…</div>';
initializeStorage();
