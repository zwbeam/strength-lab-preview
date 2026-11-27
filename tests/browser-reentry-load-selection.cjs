'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright'),E=require('../engine');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 try{for(const width of [320,390]){
  const now=new Date('2026-11-17T12:00:00Z'),old='2026-10-01';
  const seed={version:33,defaultMinutes:45,programBlock:'abc',sessions:[],weights:{squat:16},nextWeights:{},equipment:{kb:[12,16],club:[],pairs:[]},skills:{},trainingPreferences:{daysPerWeek:3,useKb:true,useClub:false,useBodyweight:false,conditioning:false,skillSessions:false,useComplexes:false}};
  const prior=E.prescription(seed,'squat',{now:old});
  seed.sessions.push({id:'prior-squat',date:old,block:'abc',items:[E.completeRecord(prior,Array.from({length:prior.sets},()=>({done:true,weight:16,reps:prior.reps,leftReps:prior.reps,rightReps:prior.reps,bothSides:true,timingValid:true,continuous:true})),'clean',false)]});
  const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true,timezoneId:'UTC'});
  await context.addInitScript(s=>{if(!localStorage.getItem('sl-dev-preview-data-v33'))localStorage.setItem('sl-dev-preview-data-v33',JSON.stringify(s));},seed);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('dialog',async dialog=>{if(dialog.type()==='prompt'){assert.match(dialog.message(),/Previous working weight: 16/);await dialog.accept('12');}else await dialog.dismiss();});
  await page.clock.install({time:new Date(new Date(now).getTime()-60000)});await page.clock.pauseAt(now);
  await page.goto(process.env.STRENGTH_LAB_TEST_URL||'http://127.0.0.1:8765/');
  await page.waitForFunction(()=>storageReady);
  await page.locator('[data-tab="today"]').tap();
  const button=page.locator('[data-reentry-load="squat"]');
  assert.equal(await button.count(),1,'Return-load control must be visible on Train');
  await button.tap();
  const result=await page.evaluate(()=>({rx:E.prescription(state,'squat',{now:today()}),old:state.sessions[0].items[0].weight,reset:state.loadResetAfter?.squat,next:state.nextWeights?.squat}));
  assert.equal(result.rx.weight,12);assert.equal(result.rx.mode,'reentry');assert.equal(result.old,16);
  assert.equal(result.next,12);assert.equal(result.reset,'prior-squat:0');
  await page.reload();await page.waitForFunction(()=>storageReady);
  assert.equal(await page.evaluate(()=>E.prescription(state,'squat',{now:today()}).weight),12);
  assert.equal(await page.evaluate(()=>state.sessions[0].items[0].weight),16);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));
  assert.deepEqual(errors,[]);
  await context.close();console.log('PASS touch return-load selection, reload, immutable history at '+width+'px');
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
