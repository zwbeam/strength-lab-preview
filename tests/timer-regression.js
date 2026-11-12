/* Browser-adjacent timer tests. Run: node tests/timer-regression.js */
'use strict';
const assert=require('node:assert/strict'),T=require('../session-timer.js');
let passed=0;
function test(name,fn){try{fn();passed++;console.log('PASS',name)}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
test('countdown tracks wall clock',()=>assert.equal(T.remaining({running:true,endAt:6000},1000),5));
test('pause and resume preserve remaining time',()=>{const d={clock:{remaining:10,running:false}};T.resume(d,1000);T.pause(d,5000);assert.equal(d.clock.remaining,6);assert.equal(d.clock.running,false);T.resume(d,6000);assert.equal(T.remaining(d.clock,9000),3)});
test('background timer expiration completes sequence',()=>{const d={timerVersion:3,timerMode:'automatic',stage:'work',plan:{items:[{name:'Test',sets:1,reps:4,rest:0,timed:true,roundSeconds:4}]},items:[{sets:[{done:false}]}]};T.enterWork(d,1000);T.tick(d,10000);assert.equal(d.clock.kind,'complete')});
test('grind notebook timer counts three-minute rounds without extra rest',()=>{
 const d={timerVersion:3,timerMode:'automatic',stage:'work',
  plan:{items:[{id:'doublePress',name:'Double clean and press',sets:3,reps:3,
   roundSeconds:180,rest:150,timed:false}]},
  items:[{sets:[{done:false},{done:false},{done:false}]}]};
 const q=T.queue(d);
 assert.equal(q.length,3,'each timed round must be one timer entry');
 assert.deepEqual(q.map(x=>x.seconds),[180,180,180],
  'timer must use three-minute round boundaries');
 assert.ok(q.every(x=>x.kind==='work'),'no extra 150-second rest segment');
 assert.equal(q.reduce((n,x)=>n+x.seconds,0),540,'three rounds must total nine minutes');
 T.enterWork(d,1000);
 T.tick(d,541000);
 assert.equal(d.clock.kind,'complete','timer must finish at round boundary');
});
test('paused timer ignores background time and resumes exactly once',()=>{
 const d={timerVersion:3,timerMode:'automatic',stage:'work',
  plan:{items:[{name:'Timed practice',sets:2,reps:5,roundSeconds:60,rest:30,timed:true}]},
  items:[{sets:[{done:false},{done:false}]}]};
 T.enterWork(d,1000);
 T.pause(d,21000);
 assert.equal(d.clock.remaining,40,'pause after 20 seconds must preserve 40');
 T.tick(d,3600000);
 assert.equal(d.clock.remaining,40,'background time must not consume paused seconds');
 assert.equal(d.clock.cursor,0,'background time must not advance paused round');
 T.resume(d,3600000);
 T.tick(d,3640000);
 assert.equal(d.clock.cursor,1,'resumed timer must advance one round at its boundary');
 assert.equal(d.clock.kind,'work','next round must start without duplicate rest');
 T.tick(d,3700000);
 assert.equal(d.clock.kind,'complete','second round must finish once');
});
console.log(passed+'/5 timer checks passed');
