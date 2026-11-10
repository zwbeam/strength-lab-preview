/* Research-to-app movement coverage audit.
 * Run: node tests/research-coverage.js
 * Reports known teaching gaps without treating skill gates or profiles as movements.
 */
'use strict';
const assert = require('node:assert/strict');
const engine = require('../engine.js');
const instruction = require('../movement-instruction.js');
const moves = engine.MOVES;
const entries = instruction.entries || {};
const sources = instruction.sources || instruction.sourceIndex || {};
const gaps = [];
let covered = 0;
for (const [id, move] of Object.entries(moves)) {
  const lesson = entries[id];
  if (!lesson) {
    gaps.push({ id, name: move.name, issue: 'No movement instruction entry' });
    continue;
  }
  assert.equal(typeof lesson.coverage, 'string', id + ': missing coverage declaration');
  assert.ok(Array.isArray(lesson.sourceIds), id + ': sourceIds must be an array');
  if (!Array.isArray(lesson.steps) || !lesson.steps.length)
    gaps.push({ id, name: move.name, issue: 'No step-by-step technique instructions', coverage: lesson.coverage });
  if (!Array.isArray(lesson.setup) || !lesson.setup.length)
    gaps.push({ id, name: move.name, issue: 'No setup instructions', coverage: lesson.coverage });
  if (/partial|pending/i.test(lesson.coverage))
    gaps.push({ id, name: move.name, issue: 'Explicitly incomplete research coverage', coverage: lesson.coverage });
  if (!lesson.sourceIds.length)
    gaps.push({ id, name: move.name, issue: 'No source evidence attached' });
  covered++;
}
for (const id of Object.keys(entries))
  assert.ok(Object.hasOwn(moves, id), 'Instruction for unknown movement: ' + id);
console.log(JSON.stringify({ totalMovements: Object.keys(moves).length, mappedMovements: covered, gaps }, null, 2));
if (process.argv.includes('--strict') && gaps.length) process.exitCode = 1;
