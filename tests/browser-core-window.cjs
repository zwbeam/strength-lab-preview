'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),{E,history}=require('./fixtures/core-window.cjs');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 try{for(const width of [320,390]){
  const now=new Date(),date=now.toISOString().slice(0,10),seed=history(date),original=JSON.stringify(seed.sessions);
  const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true,timezoneId:'UTC'});
  await context.addInitScript(s=>{if(!localStorage.getItem('sl-dev-preview-data-v33'))localStorage.setItem('sl-dev-preview-data-v33',JSON.stringify(s));},seed);
  const page=await context.newPage(),errors=[],dialogs=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',async d=>{dialogs.push(d.message());await d.dismiss();});await page.clock.setFixedTime(now);
  await page.goto(process.env.STRENGTH_LAB_TEST_URL||'http://127.0.0.1:8765/');await page.waitForFunction(()=>storageReady&&storageWritable);
  async function open(selector){await page.locator(selector).evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});}
  assert.equal(await page.evaluate(()=>E.plan(state,{now:today()}).block),'abc');
  await open('#program-decision > summary');assert.match(await page.locator('#program-decision').innerText(),/Resume the selected core after its training gap/);
  assert.equal(await page.evaluate(()=>E.plan(state,{now:today()}).composition.coreAllocation.actualCoreVisits),0);
  assert.ok(await page.evaluate(()=>E.plan(state,{now:today()}).items.some(x=>x.mode==='reentry')));
  await page.locator('[data-tab="settings"]').tap();await open('#default-minutes');await page.locator('#default-minutes').selectOption('30');await page.locator('#save-setup').tap();await page.locator('[data-tab="today"]').tap();
  assert.equal(await page.locator('#today-minutes').inputValue(),'30');assert.equal(await page.evaluate(()=>E.plan(state,{now:today()}).block),'abc');assert.ok(await page.evaluate(()=>E.plan(state,{now:today()}).total<=30));
  await open('#today-minutes');await page.locator('#today-minutes').selectOption('60');await page.locator('[data-tab="settings"]').tap();await open('#default-minutes');assert.equal(await page.locator('#default-minutes').inputValue(),'60');await page.locator('[data-tab="today"]').tap();assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions)),original);
  await page.locator('#start').tap();assert.equal(await page.evaluate(()=>draft.plan.block),'abc');const written=await page.evaluate(()=>JSON.stringify(draft.plan));
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>storageReady&&storageWritable&&navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>storageReady&&storageWritable&&draft);
  assert.equal(await page.evaluate(()=>JSON.stringify(draft.plan)),written);assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions)),original);assert.ok(await page.evaluate(()=>draft.items.every(x=>x.sets.every(y=>!y.done))));
  const before=await page.evaluate(()=>Object.fromEntries(draft.plan.items.map(x=>[x.id,E.stateFor(state,x.id,{now:today()}).stage])));
  const bilateral=await page.evaluate(()=>draft.plan.items.flatMap((x,i)=>x.side===2?[{i,reps:x.reps,sets:x.sets}]:[]));
  for(const x of bilateral){await page.locator('[data-edit-movement="active:'+x.i+'"]').tap();for(let j=0;j<x.sets;j++)for(const side of ['leftReps','rightReps']){const selector='[data-set="'+x.i+':'+j+':'+side+'"]';await open(selector);await page.locator(selector).fill(String(x.reps));await page.locator(selector).press('Tab');}}
  for(const x of await page.locator('[data-quick-complete]').all())await x.check();await page.locator('#save-workout').tap();await page.waitForFunction(n=>state.sessions.length===n+1,seed.sessions.length);
  assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions.slice(0,-1))),original);assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions.at(-1).plan)),written);
  const rows=await page.evaluate(()=>state.sessions.at(-1).items);for(const row of rows)if(row.mode==='reentry'){assert.equal(row.completed,false);assert.equal(await page.evaluate(id=>E.stateFor(state,id,{now:today()}).stage,row.id),before[row.id]);}
  assert.equal(await page.evaluate(()=>E.plan(state,{now:today()}).composition.coreAllocation.actualCoreVisits),1);assert.ok(await page.evaluate(()=>E.validateBackup(JSON.parse(JSON.stringify(state))).sessions.length>0));
  assert.deepEqual(errors,[]);assert.deepEqual(dialogs,[]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));await context.close();
  console.log('PASS '+width+'px expired core credit, shared duration settings, genuine nonadvancing return, unchanged history and immutable offline draft');
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
