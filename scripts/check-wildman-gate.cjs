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
 assert.ok(allowed.has(cells[3].toLowerCase()),'Unrecognized status for '+cells[0]+': '+cells[3]);
 status.set(cells[0],cells[3].toLowerCase());
}
assert.deepEqual([...status.keys()].sort(),[...expected].sort(),'Wildman gate matrix must retain all required audit areas');
// Closing a row requires an independently inspectable source-to-code-to-test record.
const evidence=JSON.parse(fs.readFileSync('research/wildman-engine-evidence.json','utf8'));
assert.equal(evidence.version,1,'Unsupported Wildman evidence ledger version');
assert.ok(evidence.areas&&typeof evidence.areas==='object'&&!Array.isArray(evidence.areas),'Missing evidence areas');
assert.deepEqual(Object.keys(evidence.areas).sort(),[...expected].sort(),'Evidence ledger must cover exactly the ten gate areas');
for(const [area,gateStatus] of status){
 const record=evidence.areas[area];
 assert.ok(record&&typeof record==='object'&&!Array.isArray(record),'Missing evidence record: '+area);
 assert.equal(record.status,gateStatus,'Matrix/evidence status disagreement: '+area);
 if(gateStatus==='unresolved')continue;
 for(const field of ['sourceIds','claim','enginePaths','tests','adaptation','commit']){
  const value=record[field];
  assert.ok(Array.isArray(value)?value.length>0:typeof value==='string'&&value.trim().length>0,area+': missing closure evidence '+field);
 }
 assert.ok(Array.isArray(record.sourceIds)&&record.sourceIds.every(Number.isInteger),area+': source IDs must be numeric');
 const usableSources=new Set(JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../source-index.json'),'utf8')).filter(x=>x.id!==441).map(x=>x.id));
 assert.ok(record.sourceIds.every(id=>usableSources.has(id)),area+': source IDs must resolve to usable archive records; #441 is excluded');
 for(const field of ['enginePaths','tests']){
  assert.ok(Array.isArray(record[field]),area+': '+field+' must be an array');
  for(const p of record[field])assert.ok(typeof p==='string'&&fs.existsSync(p),area+': missing checked-in '+field+' path '+p);
 }
 assert.match(record.commit,/^[0-9a-f]{7,40}$/,area+': invalid evidence commit');
}
const unresolved=[...status].filter(([,value])=>value==='unresolved').map(([name])=>name);
console.log(JSON.stringify({total:status.size,unresolved:unresolved.length,openAreas:unresolved},null,2));
if(process.argv.includes('--release')&&unresolved.length){
 console.error('RELEASE BLOCKED: Wildman engine audit has '+unresolved.length+' unresolved areas.');
 process.exitCode=1;
}
