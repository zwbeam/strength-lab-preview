/* Programming profile contract checks. These verify engine declarations, not source transcription fidelity. */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
const base={sessions:[],weights:{snatch:16,doublePress:16,doubleSquat:16,cast:10,getup:16,pushup:0},equipment:{kb:[12,16,18,20],club:[10,12],pairs:[12,16]},skills:{}};
const checks=[
 ['snatch',{profile:'snatch',start:4,end:20,reps:5,roundSeconds:60,exact:411}],
 ['doublePress',{profile:'grind',start:3,end:10,reps:3,roundSeconds:180,exact:366}],
 ['doubleSquat',{profile:'grind',start:3,end:10,reps:3,roundSeconds:180,exact:366}],
 ['getup',{profile:'getup',start:1,end:1,reps:180,exact:423}]
];
for(const [id,expected] of checks){
 const p=E.policyFor(id,base);
 assert.equal(p.profile,expected.profile,id+' profile');
 for(const key of ['start','end','reps'])assert.equal(p.volume[key],expected[key],id+' '+key);
 if(expected.roundSeconds)assert.equal(p.roundSeconds,expected.roundSeconds,id+' interval');
 assert.equal(p.exactParametersSource,expected.exact,id+' parameter source declaration');
 assert.ok(p.principleSources.length,id+' source anchors');
 assert.equal(p.exposures,2,id+' app-default clean exposure threshold');
}
const snatch=E.policyFor('snatch',base);
assert.equal(snatch.stages[0].sets,4);
assert.equal(snatch.stages.at(-1).sets,20);
assert.ok(Array.isArray(snatch.density)&&snatch.density.length===5);
const club=E.policyFor('cast',{...base,programming:{cast:{profile:'club'}}});
assert.equal(club.profile,'club');
assert.equal(club.kind,'app-default');
assert.equal(club.volume.reps,30);
assert.equal(club.volume.rest,60);
const pushup=E.policyFor('pushup',{...base,programming:{pushup:{cleanBaseline:20}}});
assert.equal(pushup.volume.reps,8);
assert.equal(pushup.volume.start,10);
assert.equal(pushup.volume.end,30);
assert.equal(pushup.exactParametersSource,609);
const wave=E.policyFor('swing',{...base,programming:{swing:{profile:'wave',lightWeight:12,heavyWeight:16}}});
assert.equal(wave.profile,'wave');
assert.equal(wave.kind,'app-default');
assert.deepEqual(wave.principleSources,[228,403]);
assert.throws(()=>E.policyFor('swing',{...base,programming:{swing:{profile:'wave',lightWeight:16,heavyWeight:12}}}),/Heavy weight must exceed/);
console.log('Programming profile contract checks passed (research fidelity remains to be audited).');
