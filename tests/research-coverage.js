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
assert.ok(Object.keys(moves).length >= 20, 'Movement catalog unexpectedly empty');
// Verify every quoted teaching anchor against its original checked-in transcript.
// Normalization handles whitespace/caption punctuation, not paraphrased wording.
const transcriptCache = new Map();
const normalizeQuote = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let checkedQuotes = 0;
for (const [lessonId,lesson] of Object.entries(entries)) for (const evidence of lesson.evidence || []) {
  const sourceId=evidence.sourceId;
  if (!transcriptCache.has(sourceId)) {
    const shard=String(Math.floor(sourceId/30)).padStart(2,'0');
    const original=require('../sources-'+shard+'.json').find(source=>source.id===sourceId);
    assert.ok(original && typeof original.text==='string',lessonId+': missing original transcript '+sourceId);
    transcriptCache.set(sourceId,original);
  }
  const original=transcriptCache.get(sourceId);
  assert.ok(normalizeQuote(original.text).includes(normalizeQuote(evidence.quote)),
    lessonId+': evidence quote not found in original transcript '+sourceId);
  assert.equal(sources[sourceId]?.url,original.url,lessonId+': source URL mismatch '+sourceId);
  checkedQuotes++;
}
assert.ok(checkedQuotes>=20,'unexpected loss of quoted source evidence');
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
  if (/partial|pending|unverified/i.test(lesson.coverage))
    gaps.push({ id, name: move.name, issue: 'Explicitly incomplete research coverage', coverage: lesson.coverage });
  if (!lesson.sourceIds.length)
    gaps.push({ id, name: move.name, issue: 'No source evidence attached' });
  for (const sourceId of lesson.sourceIds)
    assert.ok(Object.hasOwn(sources, sourceId), id + ': unknown source ID ' + sourceId);
  for (const videoId of lesson.videoSourceIds || []) {
    assert.ok(lesson.sourceIds.includes(videoId),id+': video source '+videoId+' must also be declared in sourceIds');
    assert.ok(Object.hasOwn(sources,videoId),id+': unknown video source ID '+videoId);
    assert.ok(/^https:\/\/www[.]youtube[.]com\/watch[?]v=[A-Za-z0-9_-]+$/.test(sources[videoId].url || ''),id+': missing or invalid source video URL '+videoId);
  }
  for (const evidence of lesson.evidence || []) {
    assert.equal(typeof evidence.quote,'string',id+': evidence quotation must be text');
    assert.ok(evidence.quote.trim().length>=8,id+': evidence quotation too short to audit');
    assert.ok(Object.hasOwn(sources,evidence.sourceId),id+': evidence references missing catalog source '+evidence.sourceId);
  }
  if (lesson.evidence?.length && !lesson.sourceIds.length)
    throw Error(id + ': quotations without source attribution');
  for (const evidence of lesson.evidence || [])
    assert.ok(lesson.sourceIds.includes(evidence.sourceId), id + ': evidence not linked to declared source');
  covered++;
}
for (const id of Object.keys(entries))
  assert.ok(Object.hasOwn(moves, id), 'Instruction for unknown movement: ' + id);
const gapSummary = gaps.reduce((counts,gap)=>{counts[gap.issue]=(counts[gap.issue]||0)+1;return counts;},{});
console.log(JSON.stringify({ totalMovements: Object.keys(moves).length, mappedMovements: covered, gapCount:gaps.length, gapSummary, gaps }, null, 2));
// The following are known release-review limitations, not evidence of missing software functionality.
const releaseReview = {
  techniqueIncomplete: gaps.filter(g=>/incomplete research coverage|No step-by-step technique instructions/i.test(g.issue)).map(g=>g.id),
  sourceUnverified: gaps.filter(g=>g.issue==='No source evidence attached').map(g=>g.id)
};
console.log('RELEASE REVIEW '+JSON.stringify(releaseReview));
if (process.argv.includes('--strict') && gaps.length) process.exitCode = 1;
