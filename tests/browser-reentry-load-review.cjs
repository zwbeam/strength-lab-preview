'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright'),E=require('../engine');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 try{
  for(const width of [320,390]){
   const now=new Date('2026-11-17T12:00:00Z'),old='2026-10-01';
   const stateSeed={version:33,defaultMinutes:45,programBlock:'abc',sessions:[],weights:{squat:16},nextWeights:{},equipment:{kb:[12,16],club:[],pairs:[]},skills:{},trainingPreferences:{daysPerWeek:3,useKb:true,useClub:false,useBodyweight:false,conditioning:false,skillSessions:false,useComplexes:false}};
   const prior=E.prescription(stateSeed,'squat',{now:old});
   stateSeed.sessions.push({id:'prior-squat',date:old,block:'abc',items:[E.completeRecord(prior,Array.from({length:prior.sets},()=>({done:true,weight:16,reps:prior.reps,leftReps:prior.reps,rightReps:prior.reps,bothSides:true,timingValid:true,continuous:true})),'clean',false)]});
   const ctx=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true,timezoneId:'UTC'});
   await ctx.addInitScript(seed=>{localStorage.setItem('sl-dev-preview-data-v33',JSON.stringify(seed));},stateSeed);
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',async d=>{errors.push(d.message());await d.dismiss();});
   // This test needs a stable training date, not paused timers. Avoid racing
   // pauseAt against the already advancing installed clock.
   await page.clock.setFixedTime(now);
   await page.goto(process.env.STRENGTH_LAB_TEST_URL||'http://127.0.0.1:8765/');
   await page.waitForFunction(()=>storageReady);
   const rx=await page.evaluate(()=>E.prescription(state,'squat',{now:today()}));
   assert.equal(rx.mode,'reentry');assert.equal(rx.returnLoadReview,true);assert.equal(rx.weight,16);
   // Exercise the actual Train screen, not only the formatter in isolation.
   const planned=await page.evaluate(()=>E.plan(state,{now:today()}).items.map(x=>x.id));
   assert.ok(planned.includes('squat'),'Fixture must schedule the returning movement');
   await page.locator('[data-tab="today"]').tap();
   assert.match(await page.locator('#app').innerText(),/review your working weight/i);
   await page.locator('#start').tap();
   assert.match(await page.locator('.notebook-exercise').first().innerText(),/review your working weight/i);
   const visible=await page.evaluate(()=>{const rx=E.prescription(state,'squat',{now:today()}),holder=document.createElement('div');holder.innerHTML=compactPrescription(rx);document.body.appendChild(holder);const text=holder.innerText,warning=holder.querySelector('[role="status"]');holder.remove();return{text,warning:!!warning};});
   assert.equal(visible.warning,true);assert.match(visible.text,/review your working weight/i);
   assert.match(visible.text,/fewer sets do not guarantee/i);
   const short=await page.evaluate(()=>E.prescription(state,'squat',{now:'2026-10-03'}));
   assert.equal(short.returnLoadReview,false);
   assert.equal(await page.evaluate(()=>compactPrescription(E.prescription(state,'squat',{now:'2026-10-03'})).includes('Return after time away')),false);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));
   assert.deepEqual(errors,[]);
   await ctx.close();
   console.log('PASS re-entry load warning rendered, preserved weight, recent training not warned at '+width+'px');
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
