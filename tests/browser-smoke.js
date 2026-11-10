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
   if(errors.length)throw Error(viewport.width+'px browser exceptions: '+errors.join(' | '));
   console.log('Browser navigation passed at '+viewport.width+'px');
   await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
