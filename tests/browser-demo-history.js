'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const backup=JSON.parse(fs.readFileSync('strength-lab-engine-demo-backup.json','utf8'));
const report=JSON.parse(fs.readFileSync('strength-lab-engine-demo-backup-progression-report.json','utf8'));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [320,390,832,1280]){
   const page=await browser.newPage({viewport:{width,height:844}});
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.addInitScript(data=>localStorage.setItem('sl-dev-preview-data-v33',JSON.stringify(data)),backup);
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.locator('#app').waitFor();
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('sl-dev-preview-data-v33')||'null'));
   assert.equal(stored?.sessions?.length,backup.sessions.length,'Demo history not loaded at '+width);
   for(const tab of ['progress','today']){
    await page.locator('[data-tab="'+tab+'"]').click();
    await page.waitForTimeout(500);
    if(tab==='progress'){
     const header=await page.locator('#app').innerText();
     assert.ok(header.includes(backup.sessions.length+' lifetime workouts recorded'),'Training Log did not render full session count at '+width);
     await page.locator('#movement-progress').evaluate(el=>el.open=true);
     await page.locator('#movement-progress details').first().evaluate(el=>el.open=true);
     const practiced=await page.locator('#movement-progress > summary').innerText();
     assert.ok(practiced.includes('6 practiced movements'),'Training Log omitted movements at '+width);
    }
    const view=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth,text:document.querySelector('#app')?.innerText||''}));
    assert.ok(view.text.trim().length>100,'Empty populated '+tab+' at '+width);
    assert.ok(view.document<=view.viewport+3,'Overflow in populated '+tab+' at '+width+': '+JSON.stringify(view));
    await page.screenshot({path:'demo-'+width+'-'+tab+'.png',fullPage:true});
    if(tab==='progress'){
     const progressText=await page.locator('#movement-progress').innerText();
     for(const id of ['swing','squat','press','row','clean','cast']){
      const name=backup.sessions.flatMap(session=>session.items).find(item=>item.id===id)?.id;
      assert.ok(name,'Missing generated movement '+id);
     }
     assert.ok(progressText.includes('Detailed cycles and milestones'),'Detailed progression section absent at '+width);
    }
   }
   assert.deepEqual(errors,[],'Browser errors at '+width);
   await page.close();
  }
  assert.equal(report.sessions,backup.sessions.length);
  console.log('Populated two-year history browser layouts passed');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
