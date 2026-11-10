/* Longitudinal progression regression checks: node tests/progression-history.js */
'use strict';
const assert = require('node:assert/strict');
const E = require('../engine.js');
const id = 'swing';
const base = { sessions: [], weights: { swing: 16 }, nextWeights: {}, skills: {}, programming: { swing: { exposures: 2 } } };
const policy = E.policyFor(id, base);
const first = policy.stages[0], second = policy.stages[1];
assert.ok(second, 'Expected a multi-stage volume progression');
const entry = (date, quality='clean', overrides={}) => ({
  id, weight: 16, bodyweight: false, quality, pain: false,
  completed: quality==='clean', performed: true, mode: 'volume',
  actualSets: first.sets, actualReps: first.reps,
  targetSets: first.sets, targetReps: first.reps, rest: first.rest,
  policyKey: policy.key, track: 'base', ...overrides
});
const session = (date, item) => ({ id: date, date, items: [item] });
const at = items => ({ ...base, sessions: items.map(([date, item]) => session(date, item)) });
const initial = E.stateFor(base, id);
assert.equal(initial.stage, 0);
const one = E.stateFor(at([['2026-01-01', entry('2026-01-01')]]), id);
assert.equal(one.stage, 0, 'One clean exposure must not advance');
const two = E.stateFor(at([
  ['2026-01-01', entry('2026-01-01')],
  ['2026-01-03', entry('2026-01-03')]
]), id);
assert.equal(two.stage, 1, 'Two clean exposures should advance one stage');
const failed = E.stateFor(at([
  ['2026-01-01', entry('2026-01-01')],
  ['2026-01-03', entry('2026-01-03', 'hard', { completed:false, actualSets: Math.max(0,first.sets-1) })],
  ['2026-01-05', entry('2026-01-05')]
]), id);
assert.equal(failed.stage, 0, 'Failure must reset the clean streak');
const missed = E.stateFor(at([
  ['2026-01-01', entry('2026-01-01')],
  ['2026-01-03', entry('2026-01-03', 'clean', { completed:false, performed:false, actualSets:0 })]
]), id);
assert.equal(missed.stage, 0, 'A missed workout cannot advance');
const recovery = E.stateFor(at([
  ['2026-01-01', entry('2026-01-01')],
  ['2026-01-03', entry('2026-01-03', 'clean', { mode:'recovery', completed:false })]
]), id);
assert.equal(recovery.stage, 0, 'Recovery session cannot advance');
const heavier = E.stateFor({ ...at([
  ['2026-01-01', entry('2026-01-01')],
  ['2026-01-03', entry('2026-01-03')]
]), nextWeights:{swing:18} }, id);
assert.equal(heavier.weight, 18);
assert.equal(heavier.stage, 0, 'Load change restarts the volume stage');
console.log('Progression history checks passed');


const milestoneState=at([
 ['2026-01-01',entry('2026-01-01')],
 ['2026-01-03',entry('2026-01-03')]
]);
const allowed=E.loadOptions({...milestoneState,equipment:{kb:[16,18],club:[],pairs:[]}},id);
assert.ok(!allowed.includes(20),'unowned loads must not be offered after a cycle');
assert.ok(!allowed.some(w=>w>18),'owned inventory ceiling must be respected');
const afterGap=E.prescription(at([['2026-01-01',entry('2026-01-01')]]),id,{now:'2026-03-01'});
assert.equal(afterGap.mode,'reentry','long absence must trigger reentry prescription');

const interrupted=E.stateFor(at([
 ['2026-01-01',entry('2026-01-01')],
 ['2026-01-03',entry('2026-01-03','clean',{mode:'reentry',completed:true})],
 ['2026-01-05',entry('2026-01-05')]
]),id);
assert.equal(interrupted.stage,0,'reentry cannot bridge clean exposures across an interruption');
const lowReadiness=E.prescription(at([['2026-01-01',entry('2026-01-01')]]),id,{now:'2026-01-04',readiness:'low'});
assert.equal(lowReadiness.mode,'recovery','low readiness must prescribe recovery mode');
assert.ok(lowReadiness.sets<=first.sets,'recovery must not increase prescribed sets');
const loadChanged=E.stateFor({...at([
 ['2026-01-01',entry('2026-01-01')],
 ['2026-01-03',entry('2026-01-03')]
]),nextWeights:{swing:18}},id);
assert.equal(loadChanged.streak,0,'load change must clear prior exposure streak');
assert.throws(()=>E.selectLoad({...base,equipment:{kb:[16,18],club:[],pairs:[]}},id,20),/Load must be an available/,'load increase cannot bypass cycle gate');
