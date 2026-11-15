'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),E=require('../engine'),N=require('../notebook'),C=require('../rolling-calendar');
function fresh(){return {version:33,defaultMinutes:25,programBlock:'abc',sessions:[],weights:{front:5,circles:5,cast:5},equipment:{kb:[8,10],club:[5]},skills:{bodyweightSquat:true},trainingPreferences:{daysPerWeek:3,focus:'balanced',variety:'consistent',useKb:false,useClub:true,useBodyweight:true,useComplexes:false,skillSessions:false,conditioning:false,emphasis:{kb:'major',complex:'major',bodyweight:'major',club:'minor'}}};}
function record(s,date,ids){const p={...E.plan(s,{now:date}),items:ids.map(id=>E.prescription(s,id,{now:date}))};const a=N.newItems(p);for(const i of a)for(const x of i.sets)Object.assign(x,{done:true,bothSides:true,leftReps:x.reps,rightReps:x.reps});s.sessions.push({id:'manual-'+s.sessions.length,date,title:'Recorded practice',items:N.records(p,a)});}


(async()=>{const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});try{for(const width of [320,390]){
 const now=new Date(),date=now.toISOString().slice(0,10),s=fresh();record(s,C.add(date,-4),['bodyweightSquat']);record(s,C.add(date,-2),['bodyweightSquat','circles']);
 const originalHistory=JSON.stringify(s.sessions),originalEquipment=JSON.stringify(s.equipment);
 const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true,timezoneId:'UTC'});
 await context.addInitScript(s=>{if(!localStorage.getItem('sl-dev-preview-data-v33'))localStorage.setItem('sl-dev-preview-data-v33',JSON.stringify(s));},s);
 const page=await context.newPage(),errors=[],dialogs=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',async d=>{dialogs.push(d.message());await d.dismiss();});await page.clock.install({time:now});await page.clock.pauseAt(now);
 await page.goto(process.env.STRENGTH_LAB_TEST_URL||'http://127.0.0.1:8765/');await page.waitForFunction(()=>storageReady);
 async function open(selector){await page.locator(selector).evaluate(el=>{for(let a=el.parentElement;a;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;});}
 async function plan(){return page.evaluate(()=>JSON.stringify(E.plan(state,{now:today()})));}
 async function trainEdit(values){await page.locator('[data-tab="today"]').tap();await open('#open-emphasis-settings');await page.locator('#open-emphasis-settings').tap();for(const [id,value] of Object.entries(values))await page.locator('#train-emphasis-dialog [data-emphasis-family="'+id+'"]').selectOption(value);await page.locator('#save-emphasis-dialog').tap();}
 async function settingsEdit(values){await page.locator('[data-tab="settings"]').tap();await open('#save-emphasis');for(const [id,value] of Object.entries(values))await page.locator('[data-emphasis-editor="settings"][data-emphasis-family="'+id+'"]').selectOption(value);await page.locator('#save-emphasis').tap();}
 const baseline=await plan();assert.equal(JSON.parse(baseline).items[0].id,'bodyweightSquat');
 await trainEdit({kb:'off',complex:'off'});assert.equal(await plan(),baseline);assert.equal(await page.evaluate(()=>E.emphasisDistribution(state).shares.bodyweight),.75);
 await page.locator('[data-tab="settings"]').tap();await open('#save-emphasis');assert.equal(await page.locator('[data-emphasis-editor="settings"][data-emphasis-family="kb"]').inputValue(),'off');
 await settingsEdit({kb:'major',complex:'major'});assert.equal(await plan(),baseline);
 await trainEdit({bodyweight:'minor',club:'major'});assert.equal(JSON.parse(await plan()).items[0].id,'front');assert.equal(await page.evaluate(()=>E.emphasisDistribution(state).shares.club),.75);
 await settingsEdit({bodyweight:'major',club:'minor'});assert.equal(await plan(),baseline);
 await page.locator('[data-tab="today"]').tap();await open('#open-emphasis-settings');await page.locator('#open-emphasis-settings').tap();assert.equal(await page.locator('#train-emphasis-dialog [data-emphasis-family="bodyweight"]').inputValue(),'major');await page.locator('#train-emphasis-dialog button[type="submit"]').tap();
 assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions)),originalHistory);assert.equal(await page.evaluate(()=>JSON.stringify(state.equipment)),originalEquipment);
 await page.locator('#start').tap();assert.equal(await page.evaluate(()=>draft.plan.items[0].id),'bodyweightSquat');const snapshot=await page.evaluate(()=>JSON.stringify(draft.plan));
 // Settings must never rewrite the written targets of an unfinished workout.
 await settingsEdit({bodyweight:'minor',club:'major'});assert.match(dialogs.pop(),/Finish or discard/);assert.equal(await page.evaluate(()=>JSON.stringify(draft.plan)),snapshot);assert.equal(await page.evaluate(()=>state.trainingPreferences.emphasis.bodyweight),'major');
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>storageReady&&navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>storageReady&&draft);assert.equal(await page.evaluate(()=>JSON.stringify(draft.plan)),snapshot);assert.equal(await page.evaluate(()=>draft.items.some(x=>x.sets.some(y=>y.done))),false);
 await page.locator('[data-tab="today"]').tap();await page.locator('[data-quick-complete="0"]').check();await page.locator('#save-workout').tap();await page.waitForFunction(()=>state.sessions.length===3);
 assert.equal(await page.evaluate(()=>state.sessions[2].items[0].id),'bodyweightSquat');assert.equal(await page.evaluate(()=>state.sessions[2].items[0].completed),true);assert.equal(await page.evaluate(()=>JSON.stringify(state.sessions.slice(0,2))),originalHistory);assert.equal(await page.evaluate(()=>JSON.stringify(state.equipment)),originalEquipment);assert.equal(await page.evaluate(()=>state.programBlock),'abc');
 await page.reload();await page.waitForFunction(()=>storageReady);assert.equal(await page.evaluate(()=>state.sessions.length),3);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));assert.deepEqual(errors,[]);assert.deepEqual(dialogs,[]);await context.close();console.log('PASS touch Train/Settings emphasis sync, excluded priorities ignored, active priorities change actual targets, immutable draft guard, actual logging and offline persistence at '+width+'px');
}}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
