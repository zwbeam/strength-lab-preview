'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),{E,N,C,fresh,actual,receipt}=require('./fixtures/core-window.cjs');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 try{for(const width of [320,390]){
  const now=new Date(),date=now.toISOString().slice(0,10),seed=fresh(60);seed.programComposition.blocks.push('bodyweightFoundations','groundPractice');
  for(const day of [-21,-19,-17,-14])receipt(seed,'hingePractice',C.add(date,day));
  const original=JSON.stringify(seed.sessions),context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true,timezoneId:'UTC'});
  await context.addInitScript(s=>{if(!localStorage.getItem('sl-dev-preview-data-v33'))localStorage.setItem('sl-dev-preview-data-v33',JSON.stringify(s));},seed);
  const page=await context.newPage(),errors=[],dialogs=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',async d=>{dialogs.push(d.message());await d.dismiss();});await page.clock.setFixedTime(now);
  await page.goto(process.env.STRENGTH_LAB_TEST_URL||'http://127.0.0.1:8765/');await page.waitForFunction(()=>storageReady&&storageWritable);
  async function open(selector){await page.locator(selector).evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});}
  await open('#program-decision > summary');assert.match(await page.locator('#program-decision').innerText(),/Your training curriculum/);assert.match(await page.locator('#program-decision').innerText(),/Learning focus/);assert.match(await page.locator('#program-decision').innerText(),/Waiting for room/);
  await page.locator('[data-tab="settings"]').tap();await open('#composition-continuity');await page.locator('#composition-continuity').uncheck();await page.locator('#save-programming').tap();assert.equal(await page.evaluate(()=>E.plan(state,{now:today()}).composition.curriculum),undefined);
  await open('#composition-continuity');await page.locator('#composition-continuity').check();await page.locator('#save-programming').tap();await page.locator('[data-tab="today"]').tap();await open('#today-minutes');await page.locator('#today-minutes').selectOption('30');assert.ok(await page.evaluate(()=>E.plan(state,{now:today()}).total<=30));
  await page.locator('[data-tab="settings"]').tap();await open('#default-minutes');assert.equal(await page.locator('#default-minutes').inputValue(),'30');await page.locator('#default-minutes').selectOption('60');await page.locator('#save-setup').tap();await page.locator('[data-tab="today"]').tap();assert.equal(await page.locator('#today-minutes').inputValue(),'60');assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions)),original);
  await page.locator('#start').tap();const part=await page.evaluate(()=>draft.plan.composition.curriculum.maintenance[0]);assert.equal(part.id,'hingePractice');assert.equal(await page.evaluate(()=>draft.plan.block),'abc');
  const written=await page.evaluate(()=>JSON.stringify(draft.plan)),maintenanceIndex=await page.evaluate(id=>draft.plan.items.findIndex(x=>x.id===id),part.id);
  assert.equal(await page.evaluate(i=>draft.plan.items[i].earnedMaintenance,maintenanceIndex),true);
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>storageReady&&storageWritable&&navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>storageReady&&storageWritable&&draft);assert.equal(await page.evaluate(()=>JSON.stringify(draft.plan)),written);assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions)),original);
  const bilateral=await page.evaluate(()=>draft.plan.items.flatMap((x,i)=>x.side===2?[{i,reps:x.reps,sets:x.sets}]:[]));
  for(const x of bilateral){await page.locator('[data-edit-movement="active:'+x.i+'"]').tap();for(let j=0;j<x.sets;j++)for(const side of ['leftReps','rightReps']){const selector='[data-set="'+x.i+':'+j+':'+side+'"]';await open(selector);await page.locator(selector).fill(String(x.reps));await page.locator(selector).press('Tab');}}
  for(const el of await page.locator('[data-quick-complete]').all())if(Number(await el.getAttribute('data-quick-complete'))!==maintenanceIndex)await el.check();
  await page.locator('#save-workout').tap();await page.waitForFunction(n=>state.sessions.length===n+1,seed.sessions.length);
  assert.ok(await page.evaluate(id=>state.deferredByBlock.hingePractice.includes(id),part.id));assert.ok(await page.evaluate(id=>!state.deferredByBlock.abc.includes(id),part.id));
  assert.equal(await page.evaluate(()=>{const next=JSON.parse(JSON.stringify(state));next.programComposition.enabled=false;next.programBlock='abc';return E.plan(next,{now:C.add(today(),2)}).slot;}),1);
  assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions.at(-1).plan)),written);assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions.slice(0,-1))),original);
  const sessionId=await page.evaluate(()=>state.sessions.at(-1).id);await page.locator('[data-edit-history="'+sessionId+'"]').tap();await page.locator('[data-edit-movement="history:'+maintenanceIndex+'"]').tap();await open('[data-hset="'+maintenanceIndex+':0:done"]');await page.locator('[data-hset="'+maintenanceIndex+':0:done"]').check();await page.locator('#save-correction').tap();
  assert.ok(await page.evaluate(id=>!state.deferredByBlock.hingePractice.includes(id),part.id));assert.equal(await page.evaluate(id=>state.sessions.at(-1).items.find(x=>x.id===id).completed,part.id),false);assert.equal(await page.evaluate(id=>E.advancementReview(state,id,{now:today()}).eligible,part.id),false);
  assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions.at(-1).plan)),written);assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions.slice(0,-1))),original);assert.ok(await page.evaluate(()=>E.validateBackup(JSON.parse(JSON.stringify(state))).sessions.length>0));
  await page.reload();await page.waitForFunction(()=>storageReady&&storageWritable);assert.ok(await page.evaluate(id=>!state.deferredByBlock.hingePractice.includes(id),part.id));assert.deepEqual(errors,[]);assert.deepEqual(dialogs,[]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));await context.close();
  const rotated=fresh(60);rotated.programComposition.blocks.push('bodyweightFoundations','groundPractice');
  for(const offset of [-25,-23,-21,-18])receipt(rotated,'hingePractice',C.add(date,offset));
  const hostDate=C.add(date,-4),host=E.plan(rotated,{now:hostDate}),addition=host.composition.curriculum.maintenance[0],only=actual(host);
  for(const item of only)if(item.id!==addition.id)for(const set of item.sets)set.done=false;
  rotated.sessions.push({id:'maintenance-only',title:host.day.name,date:hostDate,block:host.block,slot:host.slot,calendarVersion:1,notebookVersion:1,plan:host,items:N.records(host,only)});
  rotated.deferredByBlock=E.deferredBlocksAfter(rotated.deferredByBlock||{},host,rotated.sessions.at(-1).items);
  receipt(rotated,'bodyweightPull',C.add(date,-2));delete rotated.programComposition.coreBlock;rotated.programComposition.continuity=false;E.validateBackup(rotated);
  const nextContext=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true,timezoneId:'UTC'}),nextPage=await nextContext.newPage(),nextErrors=[];
  nextPage.on('pageerror',e=>nextErrors.push(e.message));nextPage.on('dialog',async d=>{if(d.type()==='confirm')await d.accept();else{nextErrors.push(d.message());await d.dismiss();}});await nextPage.clock.setFixedTime(now);
  await nextPage.goto(process.env.STRENGTH_LAB_TEST_URL||'http://127.0.0.1:8765/');await nextPage.waitForFunction(()=>storageReady&&storageWritable);
  await nextPage.locator('[data-tab="settings"]').tap();await nextPage.locator('#import').evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
  await nextPage.locator('#import').setInputFiles({name:'maintenance-attendance.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(rotated))});await nextPage.waitForFunction(n=>state.sessions.length===n,rotated.sessions.length);
  assert.equal(await nextPage.evaluate(()=>E.plan(state,{now:today()}).block),'abc');assert.equal(await nextPage.evaluate(()=>JSON.stringify(state.sessions)),JSON.stringify(rotated.sessions));
  await nextPage.locator('[data-tab="today"]').tap();await nextPage.locator('#start').tap();assert.equal(await nextPage.evaluate(()=>draft.plan.block),'abc');const preserved=await nextPage.evaluate(()=>JSON.stringify(draft.plan));
  await nextPage.evaluate(()=>navigator.serviceWorker.ready);await nextPage.reload();await nextPage.waitForFunction(()=>storageReady&&storageWritable&&draft&&navigator.serviceWorker.controller);await nextContext.setOffline(true);await nextPage.reload();await nextPage.waitForFunction(()=>storageReady&&storageWritable&&draft);
  assert.equal(await nextPage.evaluate(()=>JSON.stringify(draft.plan)),preserved);assert.equal(await nextPage.evaluate(()=>JSON.stringify(state.sessions)),JSON.stringify(rotated.sessions));assert.deepEqual(nextErrors,[]);assert.ok(await nextPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));await nextContext.close();
  console.log('PASS '+width+'px imported maintenance-only attendance retains untouched primary rotation and immutable offline draft');
  console.log('PASS '+width+'px focused curriculum explanation, shared settings/opt-out, immutable offline mixed draft, independent partial ownership, real correction and review gate');
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
