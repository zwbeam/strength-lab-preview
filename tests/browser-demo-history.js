'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const windowName={swing:'Two-hand swing',squat:'Goblet squat',press:'Single-arm strict press',row:'Single-arm row',clean:'Single-arm clean',snatch:'Single-arm snatch',complexCleanPress:'Single-arm clean → press'};
const backup=JSON.parse(fs.readFileSync('strength-lab-engine-demo-backup.json','utf8'));
const report=JSON.parse(fs.readFileSync('strength-lab-engine-demo-backup-progression-report.json','utf8'));
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 try{
  for(const width of [320,390,832,1280]){
   const page=await browser.newPage({viewport:{width,height:844}});
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('console',message=>{if(message.type()==='error')errors.push('Console error: '+message.text());});
   await page.addInitScript(data=>{
    const key='sl-dev-preview-data-v33';
    localStorage.setItem(key,JSON.stringify(data));
    localStorage.removeItem('sl-dev-preview-transaction-v33');
    localStorage.removeItem('sl-dev-preview-draft-v33');
   },backup);
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.locator('#app').waitFor();
   await page.locator('[data-tab="progress"]').waitFor();
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('sl-dev-preview-data-v33')||'null'));
   assert.equal(stored?.sessions?.length,backup.sessions.length,'Demo history not loaded at '+width);
   const browserProgress=await page.evaluate(()=>{
    const engine=window.StrengthEngine;
    const saved=JSON.parse(localStorage.getItem('sl-dev-preview-data-v33'));
    return Object.fromEntries(['swing','squat','press','row','clean','cast','snatch','complexCleanPress'].map(id=>{
     const current=engine.stateFor(saved,id);
     return [id,{stage:current.stage,weight:current.weight,track:current.track,exposures:current.allExposures}];
    }));
   });
   const expectedProgress=report.checkpoints.at(-1).movements;
   for(const id of Object.keys(browserProgress)){
    for(const key of ['stage','weight','track','exposures'])
     assert.deepEqual(browserProgress[id][key],expectedProgress[id][key],'Browser progression mismatch '+id+' '+key+' at '+width);
   }
   for(const tab of ['progress','today']){
    await page.locator('[data-tab="'+tab+'"]').click();
    await page.waitForTimeout(500);
    assert.ok(await page.locator('[data-tab="'+tab+'"]').evaluate(el=>el.classList.contains('active')),'Navigation failed to activate '+tab+' at '+width);
    if(tab==='today')assert.ok((await page.locator('#app').innerText()).trim().length>100,'Train content missing at '+width);
    if(tab==='progress'){
     const header=await page.locator('#app').innerText();
     assert.ok(header.includes(backup.sessions.length+' lifetime workouts recorded'),'Training Log did not render full session count at '+width);
     const overview=page.locator('.training-overview-group');
     assert.ok(await overview.count()>=2,'Training Overview gear groups missing at '+width);
     assert.equal(await page.locator('.notebook-table').count(),1,'Bounded workout history table missing at '+width);
     assert.ok(await page.locator('.notebook-table tbody tr').count()<=60,'Workout history initial page exceeds 60 rows at '+width);
    }
    const view=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth,text:document.querySelector('#app')?.innerText||''}));
    assert.ok(view.text.trim().length>100,'Empty populated '+tab+' at '+width);
    assert.ok(view.document<=view.viewport+3,'Overflow in populated '+tab+' at '+width+': '+JSON.stringify(view));
    await page.screenshot({path:'demo-'+width+'-'+tab+'.png',fullPage:true});
    await page.screenshot({path:'demo-'+width+'-'+tab+'-viewport.png'});
    if(tab==='progress'){
     await page.locator('.training-overview-group').first().screenshot({path:'demo-'+width+'-progress-detail.png'});
    }
    if(tab==='progress'){
     const groups=page.locator('.training-overview-group');
     assert.ok(await groups.count()>=4,'Expected at least four equipment categories at '+width);
     const groupNames=await groups.locator(':scope > summary strong').allTextContents();
     assert.deepEqual(groupNames.slice(0,4),['Kettlebells','Kettlebell Complexes','Heavy Clubs','Heavy Club Complexes'],'Core training categories are out of order at '+width);
     assert.ok(groupNames.length===4||(groupNames.length===5&&groupNames[4]==='Other training'),'Unexpected equipment category at '+width);
     await groups.nth(0).locator('summary').first().click();
     const kettlebells=await groups.nth(0).innerText();
     for(const id of ['swing','squat','press','row','clean','snatch'])
      assert.ok(kettlebells.includes(windowName[id]),'Missing kettlebell '+id+' at '+width);
     const swing=groups.nth(0).locator('.overview-movement').filter({hasText:windowName.swing}).first();
     await swing.locator('summary').first().click();
     assert.ok((await swing.innerText()).includes('In the last six months'),'Missing six-month explanation at '+width);
     const squat=groups.nth(0).locator('.overview-movement').filter({hasText:windowName.squat}).first();
     await squat.locator('summary').first().click();
     await page.waitForFunction(()=>document.querySelectorAll('.training-overview-group')[0]?.querySelectorAll('.overview-movement[open]').length===1);
     assert.equal(await groups.nth(0).locator('.overview-movement[open]').count(),1,'Opening a second movement did not close the first at '+width);
     assert.ok(await squat.evaluate(el=>el.open),'Second movement did not open at '+width);
     await swing.locator('summary').first().click();
     await page.waitForFunction(()=>document.querySelectorAll('.training-overview-group')[0]?.querySelectorAll('.overview-movement[open]').length===1);
     assert.equal(await groups.nth(0).locator('.overview-movement[open]').count(),1,'Reopening a movement did not close its sibling at '+width);
     await swing.locator('[data-movement-history="swing"]').click();
     const history=page.locator('#movement-history-dialog');
     assert.ok(await history.evaluate(el=>el.open),'Historical data dialog did not open at '+width);
     const dates=await history.locator('tbody tr td:first-child').allTextContents();
     assert.ok(dates.length>0,'Movement history is empty at '+width);
     assert.deepEqual(dates,[...dates].sort().reverse(),'History must show newest first at '+width);
     assert.equal(await history.locator('tbody tr').count(),dates.length,'History row count differs from dates at '+width);
     assert.equal(dates.length,Math.min(60,backup.sessions.flatMap(x=>x.items.filter(y=>y.id==='swing'&&(y.actualSets>0||y.performed))).length),'Movement history first page has unexpected row count at '+width);
     await history.evaluate(el=>el.close());
     await groups.nth(1).locator('summary').first().click();
     assert.ok((await groups.nth(1).innerText()).includes(windowName.complexCleanPress),'Complex movement missing at '+width);
     await groups.nth(2).locator('summary').first().click();
     assert.ok((await groups.nth(2).innerText()).includes('Two-hand shield cast'),'Heavy club movement missing at '+width);
     await page.waitForTimeout(100);
     assert.equal(await page.locator('.training-overview-group[open]').count(),1,'More than one overview category open at '+width);
    }
   }
   assert.deepEqual(errors,[],'Browser errors at '+width);
   await page.close();
  }
  assert.equal(report.sessions,backup.sessions.length);
  console.log('Populated two-year history browser layouts passed');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);if(process.env.GITHUB_ACTIONS)console.log('::error::'+String(error.stack||error).replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A'));process.exitCode=1;});
