/* Partial-workout queue and history invariants. Run: node tests/partial-workout-regression.js */
'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js'),fs=require('node:fs'),path=require('node:path');
const cases=[
 {name:'skipped movement',records:[{id:'swing',performed:false}],expected:['swing']},
 {name:'partial sets',records:[{id:'swing',performed:false,actualSets:1}],expected:['swing']},
 {name:'performed but modified',records:[{id:'swing',performed:true,completed:false}],expected:[]},
 {name:'mixed session',records:[{id:'swing',performed:true},{id:'press',performed:false}],expected:['press']},
 {name:'carry previous deferral',deferred:['row'],records:[{id:'swing',performed:false}],expected:['row','swing']},
 {name:'clear completed deferral',deferred:['swing'],records:[{id:'swing',performed:true}],expected:[]}
];
for(const c of cases)assert.deepEqual(E.deferredAfter({deferred:c.deferred||[]},c.records),c.expected,c.name);
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
assert.ok(app.includes("if(!actual.some(x=>x.actualSets>0)){alert('No sets were recorded."),'zero-work partial sessions must not enter history');
console.log('PASS '+(cases.length+1)+' partial-workout invariants');
