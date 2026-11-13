'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright'),E=require('../engine.js');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 try{for(const width of [320,390]){
  const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true});const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('dialog',async d=>{errors.push('Unexpected dialog: '+d.message());await d.dismiss();});
  await page.goto('http://127.0.0.1:8765/');await page.waitForFunction(()=>storageReady);
  await page.locator('[data-tab="learn"]').tap();assert.equal(await page.locator('.book-volume').count(),8);
  for(const [category,id] of [['kb','singleRackSquat'],['double-club','doubleClubSwingClean'],['bodyweight','bodyweightSquat'],['bodyweight','stepBackLunge'],['double-kb','doubleClean'],['complex','complexCleanPress'],['complex','complexCleanSquatPress'],['complex','complexDoubleCleanSquatPress'],['bodyweight','bearCrawl'],['bodyweight','catCrawl'],['double-club','doubleClubInside'],['double-club','doubleClubOutside']]){
   await page.locator('[data-library-category="'+category+'"] ').evaluate(el=>el.open=true);
   await page.locator('[data-library-category="'+category+'"] [data-learn-move="'+id+'"]').tap();
   const lesson=page.locator('#movement-instruction');assert.ok((await lesson.innerText()).length>200,id);
   const links=await lesson.locator('.video-link').evaluateAll(nodes=>nodes.map(x=>({href:x.href,target:x.target,rel:x.rel})));
   assert.ok(links.length>=1&&links.length<=2,id);for(const link of links){assert.match(link.href,/^https:\/\/www.youtube.com\/watch\?v=/);assert.equal(link.target,'_blank');assert.match(link.rel,/noopener/);}
   if(['doubleClubInside','doubleClubOutside'].includes(id)){assert.ok(!(await lesson.innerText()).includes('Education only'));assert.match(await lesson.innerText(),/Not yet eligible for training/);}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3),'Lesson overflow: '+id);
  }
  await page.locator('[data-tab="settings"]').tap();
  const program=page.locator('#program-block');await program.evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
  await program.selectOption('bodyweightFoundations');
  await page.locator('[data-skill="bodyweightSquat"]').evaluate(el=>el.closest('details').open=true);
  await page.locator('[data-skill="bodyweightSquat"]').check();await page.locator('[data-skill="stepBackLunge"]').check();
  await page.locator('#save-programming').tap();assert.equal(await page.evaluate(()=>state.programBlock),'bodyweightFoundations');
  await page.locator('[data-tab="today"]').tap();
  assert.match(await page.locator('#app').innerText(),/Bodyweight squat/);assert.match(await page.locator('#app').innerText(),/step-back lunge/i);
  await page.locator('#start').tap();assert.equal(await page.locator('.notebook-exercise').count(),2);
  // Only record the first prescribed movement; unperformed unilateral work gets no credit.
  await page.locator('[data-quick-complete="0"]').check();await page.locator('#save-workout').tap();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('sl-dev-preview-data-v33')));
  assert.equal(saved.sessions.length,1);assert.equal(saved.sessions[0].items.find(x=>x.id==='bodyweightSquat').completed,true);assert.equal(saved.sessions[0].items.find(x=>x.id==='stepBackLunge').completed,false);
  await page.reload();await page.waitForFunction(()=>storageReady);assert.equal(await page.evaluate(()=>state.sessions.length),1);
  await page.locator('[data-tab="settings"]').tap();await page.locator('#program-block').evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
  assert.equal(await page.locator('#program-block').inputValue(),'bodyweightFoundations');
  assert.deepEqual(errors,[]);await page.screenshot({path:'demo-'+width+'-curriculum.png',fullPage:true});
  await context.close();console.log('Touch curriculum lessons, exact video mappings, reachable programming, actual partial workout and reload passed at '+width+'px');
 }
 const paired=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const pairState={version:33,defaultMinutes:45,programBlock:'abc',sessions:[],weights:{clean:12,doubleClean:12},nextWeights:{},equipment:{kb:[12],club:[],pairs:[12]},skills:{rack:true,doubleClean:true},trainingPreferences:{daysPerWeek:3,useKb:true,useClub:false,useBodyweight:true,useDoubleKb:true}};
 for(let i=0;i<2;i++){const date=new Date(Date.now()-3*86400000).toISOString().slice(0,10),rx=E.prescription(pairState,'clean',{now:date});pairState.sessions.push({id:'single-clean-'+i,title:'Prior single clean',date,items:[E.completeRecord(rx,Array.from({length:rx.sets},()=>({done:true,weight:12,reps:rx.reps,leftReps:rx.reps,rightReps:rx.reps,bothSides:true})),'clean',false)]});}
 await paired.addInitScript(fixture=>{if(!localStorage.getItem('sl-dev-preview-data-v33'))localStorage.setItem('sl-dev-preview-data-v33',JSON.stringify(fixture));},pairState);
 const page=await paired.newPage();await page.goto('http://127.0.0.1:8765/');await page.waitForFunction(()=>storageReady);
 await page.locator('[data-tab="settings"]').tap();await page.locator('#program-block').evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
 await page.locator('#program-block').selectOption('doubleCleanPractice');await page.locator('#save-programming').tap();await page.locator('[data-tab="today"]').tap();
 assert.match(await page.locator('#app').innerText(),/Double kettlebell clean/);await page.locator('#start').tap();
 assert.equal(await page.locator('.notebook-exercise').count(),1);assert.match(await page.locator('.notebook-exercise').innerText(),/12/);
 await page.locator('[data-quick-complete="0"]').check();await page.locator('#save-workout').tap();
 const result=await page.evaluate(()=>state.sessions.at(-1).items[0]);assert.equal(result.id,'doubleClean');assert.equal(result.completed,true);assert.equal(result.weight,12);
 await page.locator('[data-tab="settings"]').tap();await page.locator('#training-setup').evaluate(el=>el.closest('details').open=true);await page.locator('#matched-kb-pairs').fill('');await page.locator('#save-setup').tap();
 assert.equal(await page.evaluate(()=>E.plan(state).items.some(x=>x.id==='doubleClean')),false);
 await paired.close();console.log('Actual paired-clean workout save and removed-pair equipment restriction passed at 390px');
 const now=new Date().toISOString().slice(0,10),rackState={version:33,defaultMinutes:45,programBlock:'rackSquatPractice',sessions:[],weights:{squat:12,singleRackSquat:12},nextWeights:{},equipment:{kb:[12],club:[],pairs:[]},skills:{rack:true,singleRackSquat:true},trainingPreferences:{daysPerWeek:3,useKb:true,useClub:false,useBodyweight:true}};
 for(const days of [6,3]){const date=new Date(Date.now()-days*86400000).toISOString().slice(0,10),rx=E.prescription(rackState,'squat',{now:date});rackState.sessions.push({id:'goblet-'+days,title:'Reviewed prior goblet practice',date,items:[E.completeRecord(rx,Array.from({length:rx.sets},()=>({done:true,weight:12,reps:rx.reps})),'clean',false)]});}
 E.validateBackup(rackState);const rackContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 await rackContext.addInitScript(fixture=>{if(!localStorage.getItem('sl-dev-preview-data-v33'))localStorage.setItem('sl-dev-preview-data-v33',JSON.stringify(fixture));},rackState);
 const rackPage=await rackContext.newPage(),rackDialogs=[];rackPage.on('dialog',async d=>{rackDialogs.push(d.message());await d.dismiss();});await rackPage.goto('http://127.0.0.1:8765/');await rackPage.waitForFunction(()=>storageReady);
 assert.match(await rackPage.locator('#app').innerText(),/Single-rack kettlebell front squat/);await rackPage.locator('#start').tap();
 await rackPage.locator('[data-quick-complete="0"]').check();await rackPage.locator('#save-workout').tap();
 assert.equal(rackDialogs.length,1);assert.match(rackDialogs[0],/actual left and right/);assert.equal(await rackPage.evaluate(()=>state.sessions.length),2);
 await rackPage.locator('[data-edit-movement="active:0"]').tap();
 const count=await rackPage.evaluate(()=>draft.items[0].sets.length);
 for(let j=0;j<count;j++)for(const side of ['leftReps','rightReps']){
  const input=rackPage.locator('[data-set="0:'+j+':'+side+'"]');await input.evaluate(el=>el.closest('details').open=true);
  assert.equal(await input.inputValue(),'','Unrecorded side must not look like an actual result');await input.fill('3');await input.press('Tab');
 }
 await rackPage.locator('#save-workout').tap();await rackPage.waitForFunction(()=>state.sessions.length===3);
 const rackSaved=await rackPage.evaluate(()=>state.sessions.at(-1).items[0]);assert.equal(rackSaved.id,'singleRackSquat');assert.equal(rackSaved.completed,true);assert.ok(rackSaved.sets.every(x=>x.leftReps===3&&x.rightReps===3));
 await rackContext.close();console.log('Actual prerequisite-qualified single-rack workout and unilateral save passed at 390px');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);if(process.env.GITHUB_ACTIONS)console.log('::error::'+String(error.stack||error).replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A'));process.exitCode=1;});
