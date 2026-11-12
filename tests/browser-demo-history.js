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
   for(const tab of ['progress','today']){
    await page.locator('[data-tab="'+tab+'"]').click();
    await page.waitForTimeout(500);
    const view=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth,text:document.querySelector('#app')?.innerText||''}));
    assert.ok(view.text.trim().length>100,'Empty populated '+tab+' at '+width);
    assert.ok(view.document<=view.viewport+3,'Overflow in populated '+tab+' at '+width+': '+JSON.stringify(view));
    await page.screenshot({path:'demo-'+width+'-'+tab+'.png',fullPage:true});
   }
   assert.deepEqual(errors,[],'Browser errors at '+width);
   await page.close();
  }
  assert.equal(report.sessions,backup.sessions.length);
  console.log('Populated two-year history browser layouts passed');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
