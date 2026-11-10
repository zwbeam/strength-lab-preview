/* Prerequisite contract regression checks.
 * Run: node tests/prerequisite-contract.js
 * No skill confirmation can be inferred merely from a workout log.
 */
'use strict';
const assert = require('node:assert/strict');
const E = require('../engine.js');
const base = { sessions: [], weights: {}, nextWeights: {}, equipment: {kb:[12,16,20,24,28,32],club:[5,10,15]}, skills: {} };
let gated = 0;
for (const [id, move] of Object.entries(E.MOVES)) {
  for (const skill of move.requires || []) {
    assert.ok(Object.hasOwn(E.SKILLS, skill), id + ': unknown skill ' + skill);
    assert.ok(E.prerequisites(base, id).includes(skill), id + ': unconfirmed skill not enforced: ' + skill);
    gated++;
  }
  for (const parent of move.practicePrereqs || []) {
    assert.ok(Object.hasOwn(E.MOVES, parent), id + ': unknown practice prerequisite ' + parent);
    assert.ok(E.prerequisites(base, id).includes('practice:' + parent), id + ': practice prerequisite not enforced: ' + parent);
    gated++;
  }
}
assert.ok(gated > 10, 'Expected substantial skill/practice gating');
console.log('Prerequisite contract OK: ' + gated + ' gates across ' + Object.keys(E.MOVES).length + ' movements');
