'use strict';
// A deliberately conservative release gate: unresolved research is never silently approved.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const doc=fs.readFileSync('WILDMAN-ENGINE-GATE.md','utf8');
const rows=doc.split('\n').filter(line=>/^\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|\s*$/.test(line)&&!/^\|\s*(?:---|Area\s*\|)/.test(line));
const expected=[
 'Sustainable program rotation','Movement-specific progression','Warmup philosophy',
 'Cooldown philosophy','Prerequisites and skill gates','Recovery and continuity',
 'Equipment and real-world constraints','Source-specific methods',
 'Movement instruction','Full research accounting'
];
const allowed=new Set(['verified','adapted-and-tested','unresolved','deliberately out-of-scope']);
const status=new Map();
for(const line of rows){
 const cells=line.split('|').slice(1,-1).map(s=>s.trim());
 if(!expected.includes(cells[0]))continue;
 assert.ok(!status.has(cells[0]),'Duplicate Wildman gate row: '+cells[0]);
 assert.ok(allowed.has(cells[3]),'Unrecognized status for '+cells[0]+': '+cells[3]);
 status.set(cells[0],cells[3]);
}
assert.deepEqual([...status.keys()].sort(),[...expected].sort(),'Wildman gate matrix must retain all required audit areas');
const unresolved=[...status].filter(([,value])=>value==='unresolved').map(([name])=>name);
console.log(JSON.stringify({total:status.size,unresolved:unresolved.length,openAreas:unresolved},null,2));
if(process.argv.includes('--release')&&unresolved.length){
 console.error('RELEASE BLOCKED: Wildman engine audit has '+unresolved.length+' unresolved areas.');
 process.exitCode=1;
}
