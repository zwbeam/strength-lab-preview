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
   await page.locator('[data-tab="progress"]').click();
   const log=page.locator('#app');
   if(!await log.getByRole('heading',{name:'Training Log'}).count())throw Error('Training Log heading missing');
   if(!await page.locator('.notebook-table').count())throw Error('Training Log notebook table missing');
   if(await page.locator('[data-more-notebook]').count())throw Error('Empty Training Log should not paginate');
   if(await page.locator('[data-more-movement-history]').count())throw Error('Empty Training Log should not show movement pagination');
   if(await page.locator('#movement-history-dialog').evaluate(el=>el.open))throw Error('History dialog unexpectedly open');
   console.log('Empty Training Log state passed at '+viewport.width+'px');
   await page.addInitScript(()=>{
    const sessions=Array.from({length:180},(_,i)=>({
     id:'browser-session-'+i,title:'Browser history '+i,
     date:new Date(Date.UTC(2025,0,1)+i*86400000).toISOString().slice(0,10),
     items:[{id:'swing',weight:16,actualSets:3,actualReps:10,targetSets:3,targetReps:10,
       rest:90,quality:'clean',completed:true,performed:true,pain:false}]
    }));
    localStorage.setItem('sl-dev-preview-data-v33',JSON.stringify({
     version:33,defaultMinutes:45,sessions,weights:{swing:16},
     equipment:{kb:[12,16,20,24,28,32],club:[5,10,15]},nextWeights:{},
     deferredIds:[],activities:[]
    }));
   });
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForTimeout(700);
   await page.locator('[data-tab="progress"]').click();
   if(await page.locator('.notebook-table tbody tr').count()!==60)throw Error('Initial history should show 60 rows');
   await page.locator('[data-more-notebook]').click();
   if(await page.locator('.notebook-table tbody tr').count()!==120)throw Error('Notebook pagination did not show 120 rows');
   await page.locator('[data-movement-history="swing"]').first().click();
   const dialog=page.locator('#movement-history-dialog');
   if(!await dialog.evaluate(el=>el.open))throw Error('Movement history did not open');
   if(await dialog.locator('tbody tr').count()!==60)throw Error('Movement history initial page should show 60 rows');
   await dialog.locator('[data-more-movement-history]').click();
   if(await dialog.locator('tbody tr').count()!==120)throw Error('Movement history pagination did not show 120 rows');
   if(!await dialog.evaluate(el=>el.open))throw Error('Movement dialog closed during pagination');
   await dialog.getByRole('button',{name:'Close'}).click();
   if(await dialog.evaluate(el=>el.open))throw Error('Movement history failed to close');
   console.log('180-session Training Log pagination passed at '+viewport.width+'px');
   await page.locator('[data-movement-history="swing"]').first().click();
   await dialog.locator('[data-history-view]').first().click();
   if(await dialog.evaluate(el=>el.open))throw Error('History dialog remained open after selecting a session');
   if(!await page.locator('[data-history]').count())throw Error('Selected workout details did not render');
   await page.locator('[data-edit-history]').first().click();
   if(!await page.locator('#history-editor').count())throw Error('History correction editor did not open');
   await page.locator('#cancel-correction').click();
   if(await page.locator('#history-editor').count())throw Error('History correction editor did not close');
   console.log('History correction open/cancel passed at '+viewport.width+'px');

   if(errors.length)throw Error(viewport.width+'px browser exceptions: '+errors.join(' | '));
   console.log('Browser navigation passed at '+viewport.width+'px');
   await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
