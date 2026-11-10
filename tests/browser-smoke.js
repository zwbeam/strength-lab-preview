'use strict';
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const viewport of [{width:390,height:844},{width:1280,height:800}]){
   const page=await browser.newPage({viewport});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.locator('#app').waitFor();
   await page.waitForTimeout(750);
   for(const tab of ['progress','learn','settings','today']){
    await page.locator('[data-tab="'+tab+'"]').click();
    await page.waitForTimeout(150);
    if(!await page.locator('#app').innerText())throw Error('Empty '+tab+' tab');
   }
   for(const tab of ['today','progress','learn','settings']){
    await page.locator('[data-tab="'+tab+'"]').click();
    const layout=await page.evaluate(()=>({
     viewport:document.documentElement.clientWidth,
     document:document.documentElement.scrollWidth,
     app:document.querySelector('#app')?.getBoundingClientRect().width||0
    }));
    if(layout.document>layout.viewport+3)throw Error('Horizontal document overflow on '+tab+' at '+viewport.width+'px: '+JSON.stringify(layout));
    if(layout.app<50)throw Error('App content collapsed on '+tab+' at '+viewport.width+'px');
   }
   console.log('Tab layout widths passed at '+viewport.width+'px');
   // Settings must persist equipment ceilings and explicit matched-pair availability.
   await page.locator('[data-tab="settings"]').click();
   const setup=page.locator('#training-setup');
   await setup.evaluate(el=>{const parent=el.closest('details');if(parent)parent.open=true;});
   await setup.locator('#max-kb-kg').fill('32');
   await setup.locator('#max-club-lb').fill('17');
   await setup.locator('#owned-club-weights').fill('5, 7, 10, 12, 15, 17');
   await setup.locator('#owned-kb-weights').fill('12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32');
   await setup.locator('#matched-kb-pairs').fill('16, 18, 20, 22, 24, 26, 28, 30, 32');
   const saveDialogs=[];
   const onSaveDialog=async dialog=>{saveDialogs.push(dialog.message());await dialog.accept();};
   page.on('dialog',onSaveDialog);
   await setup.locator('#save-setup').click();
   const saveDiagnostic=await page.evaluate(()=>({
     ready:typeof storageReady!=='undefined'?storageReady:null,
     writable:typeof storageWritable!=='undefined'?storageWritable:null,
     conflict:typeof storageConflict!=='undefined'?storageConflict:null,
     raw:localStorage.getItem('sl-dev-preview-data-v33')
   }));
   if(!saveDiagnostic.raw)throw Error('Equipment setup did not save: '+JSON.stringify({...saveDiagnostic,dialogs:saveDialogs}));
   page.off('dialog',onSaveDialog);
   const savedEquipment=JSON.parse(saveDiagnostic.raw).equipment;
   if(savedEquipment.maxKbKg!==32||savedEquipment.maxClubLb!==17||savedEquipment.pairs.length!==9||!savedEquipment.kb.includes(32)||!savedEquipment.kb.includes(26)||!savedEquipment.club.includes(17))throw Error('Equipment settings did not persist: '+JSON.stringify(savedEquipment));
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('[data-tab="settings"]').click();
   const restoredSetup=page.locator('#training-setup');
   await restoredSetup.evaluate(el=>{const parent=el.closest('details');if(parent)parent.open=true;});
   if(await restoredSetup.locator('#max-kb-kg').inputValue()!=='32'||await restoredSetup.locator('#max-club-lb').inputValue()!=='17')throw Error('Equipment ceiling inputs did not restore');
   if(!await restoredSetup.locator('#matched-kb-pairs').inputValue().then(x=>x.includes('32')))throw Error('Matched pairs did not restore');
   if(!await restoredSetup.locator('#owned-kb-weights').inputValue().then(x=>x.includes('26')&&x.includes('32')))throw Error('Adjustable increments did not restore');
   if(!await restoredSetup.locator('#owned-club-weights').inputValue().then(x=>x.includes('17')))throw Error('Club increments did not restore');
   console.log('Equipment ceilings and matched-pair settings persisted at '+viewport.width+'px');

   // Exercise the replacement UI with a deliberately unavailable recorded load.
   const replacementProbe=await page.evaluate(()=>{
    const original=state;
    const sample={...state,weights:{...state.weights,deadlift:16},equipment:{...state.equipment,kb:[12,14,18],pairs:[],maxKbKg:18}};
    state=sample;
    const html=unavailableLoadActions({items:[{id:'deadlift',name:'Kettlebell deadlift',bodyweight:false,weight:16,unit:'kg'}]});
    state=original;
    return html;
   });
   if(!replacementProbe.includes('data-replace-weight="deadlift"')||!replacementProbe.includes('12, 14, 18'))throw Error('Replacement UI failed to offer available loads: '+replacementProbe);
   const replacementTransition=await page.evaluate(()=>{
    const original=state;
    const sample={...state,weights:{...state.weights,deadlift:16},equipment:{...state.equipment,kb:[12,14,18],pairs:[],maxKbKg:18}};
    const next=E.replaceUnavailableLoad(sample,'deadlift',14);
    return {weight:E.stateFor(next,'deadlift').weight,stage:E.stateFor(next,'deadlift').stage,before:JSON.stringify(sample.sessions),after:JSON.stringify(next.sessions),original:JSON.stringify(state.sessions)};
   });
   if(replacementTransition.weight!==14||replacementTransition.stage!==0||replacementTransition.before!==replacementTransition.after||replacementTransition.before!==replacementTransition.original)throw Error('Replacement altered historical workouts or failed to reset progression: '+JSON.stringify(replacementTransition));
   console.log('Replacement UI and history-preserving transition passed at '+viewport.width+'px');

   // Click the actual delegated UI action, persist, reload, then restore test fixture.
   const fixtureReady=await page.evaluate(()=>{
    const original=state;
    const sample={...state,weights:{...state.weights,deadlift:16},equipment:{...state.equipment,kb:[12,14,18],pairs:[],maxKbKg:18}};
    if(!persistTraining(sample,null))return false;
    state=sample;
    const host=document.createElement('div');
    host.id='replacement-test-host';
    host.innerHTML=unavailableLoadActions({items:[{id:'deadlift',name:'Kettlebell deadlift',bodyweight:false,weight:16,unit:'kg'}]});
    document.querySelector('#app').prepend(host);
    return true;
   });
   if(!fixtureReady)throw Error('Could not prepare replacement click-through fixture');
   page.once('dialog',dialog=>dialog.accept('14'));
   await page.locator('#replacement-test-host [data-replace-weight="deadlift"]').click();
   const clicked=await page.evaluate(()=>{
    const saved=JSON.parse(localStorage.getItem('sl-dev-preview-data-v33'));
    return {weight:E.stateFor(saved,'deadlift').weight,stage:E.stateFor(saved,'deadlift').stage,sessions:saved.sessions.length};
   });
   if(clicked.weight!==14||clicked.stage!==0||clicked.sessions!==0)throw Error('Replacement click did not persist safely: '+JSON.stringify(clicked));
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForTimeout(250);
   const replacementRestored=await page.evaluate(()=>{
    const saved=JSON.parse(localStorage.getItem('sl-dev-preview-data-v33'));
    return {weight:E.stateFor(saved,'deadlift').weight,sessions:saved.sessions.length};
   });
   if(replacementRestored.weight!==14||replacementRestored.sessions!==0)throw Error('Replacement did not survive reload: '+JSON.stringify(replacementRestored));
   const reset=await page.evaluate(()=>{
    const next={...state,weights:{...state.weights,deadlift:undefined},nextWeights:{...state.nextWeights,deadlift:undefined},equipment:{...state.equipment,kb:[12,14,16,18,20,22,24,26,28,30,32],pairs:[16,18,20,22,24,26,28,30,32],maxKbKg:32}};
    if(!persistTraining(next,null))return false;
    state=next;render();return true;
   });
   if(!reset)throw Error('Failed to reset replacement fixture');
   console.log('Replacement click, save, and reload passed at '+viewport.width+'px');



   await page.locator('[data-tab="today"]').click();
   const mobility=page.locator('#mobility-session');
   if(!await mobility.count())throw Error('Mobility session missing');
   if(await mobility.locator('li').count()!==9)throw Error('Mobility plan should contain nine stages');
   await mobility.locator('#start-mobility').click();
   if(!await mobility.locator('#mobility-clock').count())throw Error('Mobility timer did not start');
   await page.waitForTimeout(1200);
   if(!await mobility.locator('#mobility-clock').innerText())throw Error('Mobility clock empty');
   const audioChecks=await page.evaluate(()=>{
    clearInterval(mobilityClock);
    const sounds=[],spoken=[];
    mobilitySound=kind=>sounds.push(kind);
    mobilitySpeak=message=>spoken.push(message);
    const base=Date.now();
    function step(elapsed){mobilityStartedAt=Date.now()-elapsed*1000;updateMobilityClock();}
    mobilityStageIndex=-1;mobilityLastRemaining=null;
    step(0);
    step(59);step(60);step(61);
    step(117);step(118);step(119);step(120);
    return {sounds,spoken,clock:document.querySelector('#mobility-clock')?.textContent};
   });
   if(audioChecks.sounds.filter(x=>x==='mid').length!==1)throw Error('Midpoint cue duplicated or missing: '+JSON.stringify(audioChecks));
   if(audioChecks.sounds.filter(x=>x==='count').length!==3)throw Error('Countdown should have three distinct beeps: '+JSON.stringify(audioChecks));
   if(audioChecks.sounds.filter(x=>x==='whistle').length!==1||audioChecks.spoken.length!==2)throw Error('Stage transitions must whistle and announce movement: '+JSON.stringify(audioChecks));
   if(!audioChecks.clock.includes('Light club skill'))throw Error('Mobility stage did not advance');

   await mobility.locator('#cancel-mobility').click();
   if(!await mobility.locator('#start-mobility').count())throw Error('Mobility cancel failed');
   console.log('Guided mobility start, clock and cancel passed at '+viewport.width+'px');
   await mobility.locator('#start-mobility').click();
   page.once('dialog',dialog=>dialog.accept());
   await mobility.locator('#finish-mobility').click();
   const mobilityRecord=await page.evaluate(()=>JSON.parse(localStorage.getItem('sl-dev-preview-data-v33')));
   const completedMobility=(mobilityRecord.activities||[]).filter(a=>a.type==='mobility'&&a.status==='completed');
   if(completedMobility.length!==1||completedMobility[0].replacesStrength!==false||completedMobility[0].duration<1)throw Error('Mobility completion not safely recorded');
   if((mobilityRecord.sessions||[]).length!==0)throw Error('Mobility incorrectly added lifting session');
   if(await mobility.locator('#mobility-clock').count())throw Error('Mobility timer still running after save');
   console.log('Mobility completion persistence and no lifting credit passed at '+viewport.width+'px');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForTimeout(400);
   const afterReload=await page.evaluate(()=>JSON.parse(localStorage.getItem('sl-dev-preview-data-v33')));
   if((afterReload.activities||[]).filter(a=>a.type==='mobility'&&a.status==='completed').length!==1)throw Error('Mobility activity lost after reload');
   if((afterReload.sessions||[]).length!==0)throw Error('Mobility altered strength sessions after reload');
   console.log('Mobility survives reload without lifting progression at '+viewport.width+'px');

   await page.locator('[data-tab="progress"]').click();
   const log=page.locator('#app');
   if(!await log.getByRole('heading',{name:'Training Log'}).count())throw Error('Training Log heading missing');
   if(!await page.locator('.notebook-table').count())throw Error('Training Log notebook table missing');
   if(await page.locator('[data-more-notebook]').count())throw Error('Empty Training Log should not paginate');
   if(await page.locator('[data-more-movement-history]').count())throw Error('Empty Training Log should not show movement pagination');
   if(await page.locator('#movement-history-dialog').evaluate(el=>el.open))throw Error('History dialog unexpectedly open');
   console.log('Empty Training Log state passed at '+viewport.width+'px');
   await page.addInitScript(()=>{
    if(sessionStorage.getItem('browser-fixture-installed')==='yes')return;
    sessionStorage.setItem('browser-fixture-installed','yes');
    const sessions=Array.from({length:540},(_,i)=>({
     id:'browser-session-'+i,title:'Browser history '+i,
     date:new Date(Date.UTC(2025,0,1)+i*86400000).toISOString().slice(0,10),
     items:[{id:'swing',weight:16,actualSets:3,actualReps:10,targetSets:3,targetReps:10,
       rest:90,quality:'clean',completed:true,performed:true,pain:false,sets:[{done:true,skipped:false,reps:10,weight:16}]}]
    }));
    localStorage.setItem('sl-dev-preview-data-v33',JSON.stringify({
     version:33,defaultMinutes:45,sessions,weights:{swing:16},
     equipment:{kb:[12,16,20,24,28,32],club:[5,10,15]},nextWeights:{},
     deferredIds:[],activities:[]
    }));
   });
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForTimeout(700);
   const logRenderStart=Date.now();
   await page.locator('[data-tab="progress"]').click();
   const logRenderMs=Date.now()-logRenderStart;
   if(logRenderMs>8000)throw Error('540-session Training Log initial render exceeded 8 seconds: '+logRenderMs+'ms');
   if(await page.locator('.notebook-table tbody tr').count()!==60)throw Error('Initial history should show 60 rows');
   await page.locator('[data-more-notebook]').click();
   if(await page.locator('.notebook-table tbody tr').count()!==120)throw Error('Notebook pagination did not show 120 rows');
   await page.locator('[data-more-notebook]').click();
   if(await page.locator('.notebook-table tbody tr').count()!==180)throw Error('Third notebook page should show 180 rows from 540-session history');
   await page.locator('[data-movement-history="swing"]').first().click();
   const dialog=page.locator('#movement-history-dialog');
   if(!await dialog.evaluate(el=>el.open))throw Error('Movement history did not open');
   if(await dialog.locator('tbody tr').count()!==60)throw Error('Movement history initial page should show 60 rows');
   await dialog.locator('[data-more-movement-history]').click();
   if(await dialog.locator('tbody tr').count()!==120)throw Error('Movement history pagination did not show 120 rows');
   await dialog.locator('[data-more-movement-history]').click();
   if(await dialog.locator('tbody tr').count()!==180)throw Error('Third movement history page should show 180 rows');
   if(!await dialog.evaluate(el=>el.open))throw Error('Movement dialog closed during pagination');
   await dialog.getByRole('button',{name:'Close'}).click();
   if(await dialog.evaluate(el=>el.open))throw Error('Movement history failed to close');
   const visibleRows=await page.locator('.notebook-table tbody tr').count();
   if(visibleRows!==180)throw Error('Notebook lost bounded pagination after movement history browsing');
   console.log('540-session Training Log pagination passed at '+viewport.width+'px; initial render '+logRenderMs+'ms');
   await page.locator('[data-movement-history="swing"]').first().click();
   await dialog.locator('[data-history-view]').first().click();
   if(await dialog.evaluate(el=>el.open))throw Error('History dialog remained open after selecting a session');
   if(!await page.locator('[data-history]').count())throw Error('Selected workout details did not render');
   await page.locator('[data-edit-history]').first().click();
   if(!await page.locator('#history-editor').count())throw Error('History correction editor did not open');
   await page.locator('#cancel-correction').click();
   if(await page.locator('#history-editor').count())throw Error('History correction editor did not close');
   console.log('History correction open/cancel passed at '+viewport.width+'px');
   await page.locator('[data-edit-history]').first().click();
   await page.locator('#history-notes').fill('Browser-tested correction');
   await page.locator('#correction-reason').fill('Automated correction verification');
   await page.locator('#save-correction').click();
   if(!await page.getByText('Correction saved.',{exact:false}).count())throw Error('Correction confirmation missing');
   const corrected=await page.evaluate(()=>{
    const raw=localStorage.getItem('sl-dev-preview-data-v33');
    const state=JSON.parse(raw);
    return state.sessions.find(s=>s.notes==='Browser-tested correction');
   });
   if(!corrected)throw Error('Correction did not persist to local storage');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForTimeout(650);
   const restored=await page.evaluate(()=>{
    const state=JSON.parse(localStorage.getItem('sl-dev-preview-data-v33'));
    return state.sessions.find(s=>s.notes==='Browser-tested correction');
   });
   if(!restored)throw Error('Correction missing after reload');

   const historyIntegrity=await page.evaluate(()=>{
    const data=JSON.parse(localStorage.getItem('sl-dev-preview-data-v33'));
    const sessions=data.sessions||[];
    const ids=sessions.map(x=>x.id);
    const corrected=sessions.filter(x=>x.notes==='Browser-tested correction');
    const original=sessions.find(x=>x.id==='browser-session-0');
    const last=sessions.find(x=>x.id==='browser-session-539');
    return {count:sessions.length,uniqueIds:new Set(ids).size,corrections:corrected.length,
      originalDate:original?.date,lastDate:last?.date,originalWeight:original?.items?.[0]?.weight,
      lastWeight:last?.items?.[0]?.weight,correctedId:corrected[0]?.id};
   });
   if(historyIntegrity.count!==540||historyIntegrity.uniqueIds!==540||historyIntegrity.corrections!==1||
      historyIntegrity.originalDate!=='2025-01-01'||historyIntegrity.originalWeight!==16||
      historyIntegrity.lastWeight!==16||!historyIntegrity.correctedId)
      throw Error('Long-history record integrity failed: '+JSON.stringify(historyIntegrity));
   console.log('540-session history integrity after correction passed at '+viewport.width+'px');

   await page.locator('[data-tab="settings"]').click();
   const backupBefore=await page.evaluate(()=>localStorage.getItem('sl-dev-preview-data-v33'));
   const badDialog=page.waitForEvent('dialog');
   await page.locator('#import').setInputFiles({name:'broken-backup.json',mimeType:'application/json',buffer:Buffer.from('{"sessions":')});
   const badAlert=await badDialog;
   if(!badAlert.message().includes('Cannot restore backup'))throw Error('Malformed backup did not display restore error');
   await badAlert.accept();
   const backupAfter=await page.evaluate(()=>localStorage.getItem('sl-dev-preview-data-v33'));
   if(backupAfter!==backupBefore)throw Error('Malformed backup changed saved training data');
   console.log('Malformed backup rejected without data loss at '+viewport.width+'px');

   const validBackup=JSON.parse(backupBefore);
   validBackup.sessions[0].notes='Restored via browser import';
   validBackup.equipment={...validBackup.equipment,kb:[12,16,20,24],pairs:[12,16],club:[5,10,15],maxKbKg:24,maxClubLb:15};
   const validConfirm=page.waitForEvent('dialog');
   await page.locator('#import').setInputFiles({name:'valid-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(validBackup))});
   const confirmDialog=await validConfirm;
   if(!confirmDialog.message().includes('Replace training data'))throw Error('Valid backup did not request overwrite confirmation');
   await confirmDialog.accept();
   const imported=await page.evaluate(()=>JSON.parse(localStorage.getItem('sl-dev-preview-data-v33')));
   if(imported.sessions.length!==540||imported.sessions[0].notes!=='Restored via browser import'||
      imported.equipment.maxKbKg!==24||imported.equipment.maxClubLb!==15||
      JSON.stringify(imported.equipment.pairs)!==JSON.stringify([12,16]))
      throw Error('Valid backup import did not persist sessions and equipment');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForTimeout(500);
   const importedAfterReload=await page.evaluate(()=>JSON.parse(localStorage.getItem('sl-dev-preview-data-v33')));
   if(importedAfterReload.sessions.length!==540||importedAfterReload.sessions[0].notes!=='Restored via browser import'||
      importedAfterReload.equipment.maxKbKg!==24||
      JSON.stringify(importedAfterReload.equipment.pairs)!==JSON.stringify([12,16]))
      throw Error('Valid backup import did not survive reload');
   console.log('Valid 540-session backup import/reload passed at '+viewport.width+'px');



   console.log('History correction save/reload passed at '+viewport.width+'px');


   if(errors.length)throw Error(viewport.width+'px browser exceptions: '+errors.join(' | '));
   console.log('Browser navigation passed at '+viewport.width+'px');
   await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
