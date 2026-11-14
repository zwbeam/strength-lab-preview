'use strict';
// A new regression file must run in CI, including CJS and browser suites.
const fs=require('node:fs');
const workflow=fs.readFileSync('.github/workflows/research-coverage.yml','utf8');
const split=workflow.indexOf('\n  browser-smoke:');
if(split<0)throw Error('Missing separate browser job');
const jobs={audit:workflow.slice(0,split),browser:workflow.slice(split)};
const commands=section=>new Set([...section.matchAll(/^[ \t]+(?:run:[ \t]*)?node[ \t]+(?:--test[ \t]+)?(tests\/[A-Za-z0-9_.-]+\.(?:js|cjs))(?:[ \t]+[^\n]*)?$/gm)].map(x=>x[1]));
const refs={audit:commands(jobs.audit),browser:commands(jobs.browser)};
const counts={audit:0,browser:0},missing=[];
for(const file of fs.readdirSync('tests').filter(x=>/\.(?:js|cjs)$/.test(x))){
 const job=file.startsWith('browser-')?'browser':'audit';counts[job]++;
 // Demo generation is shared setup and must also run in the browser job.
 if(!refs[job].has('tests/'+file))missing.push(job+': tests/'+file);
 if(file==='generate-demo-backup.cjs'&&!refs.browser.has('tests/'+file))missing.push('browser demo setup: tests/'+file);
}
if(missing.length)throw Error('Unexecuted regression suites: '+missing.join(', '));
console.log('CI suite coverage:',counts.audit,'Node/setup files;',counts.browser,'browser suites');
