/* Skill-gate invariants. Run: node tests/skill-gates-regression.js */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
const base={version:33,sessions:[],weights:{},equipment:{kb:[12,16],club:[5,10],pairs:[]},nextWeights:{},skills:{},trainingPreferences:{}};
let checks=0;
for(const [id,m] of Object.entries(E.MOVES)){
 const gates=m.requires||[];
 if(!gates.length)continue;
 const missing=E.prerequisites(base,id);
 for(const gate of gates){assert.ok(missing.includes(gate),id+' should require '+gate);checks++;}
 const confirmed={...base,skills:Object.fromEntries(gates.map(x=>[x,true]))};
 const after=E.prerequisites(confirmed,id);
 for(const gate of gates){assert.ok(!after.includes(gate),id+' should accept explicit confirmation of '+gate);checks++;}
 for(const parent of m.practicePrereqs||[]){assert.ok(after.includes('practice:'+parent),id+' must still require practice evidence for '+parent);checks++;}
}
const sample=Object.entries(E.MOVES).find(([,m])=>(m.requires||[]).length&&(m.practicePrereqs||[]).length);
if(sample){const [id,m]=sample;const confirmed={...base,skills:Object.fromEntries(m.requires.map(x=>[x,true])),learnedMovements:{[id]:true}};assert.ok(E.prerequisites(confirmed,id).some(x=>x.startsWith('practice:')),'learned confirmation must not bypass practice gates');checks++;}
console.log('PASS '+checks+' skill-gate invariants across '+Object.keys(E.MOVES).length+' movements');
