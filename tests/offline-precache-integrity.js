'use strict';
// Offline install integrity: cache.addAll rejects the install if even one file is missing.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const match=sw.match(/const FILES=(\[[^;]+\]);/);
assert.ok(match,'service worker must expose a static precache manifest');
const files=JSON.parse(match[1]);
assert.ok(files.length>0,'precache list must not be empty');
const normalized=files.map(file=>file.replace(/^\.\//,'').split('?')[0]).filter(Boolean);
assert.equal(new Set(files).size,files.length,'precache must not duplicate URLs');
assert.equal(new Set(normalized).size,normalized.length,
 'precache must not contain duplicate files under different query strings');
assert.ok(files.includes('./')||files.includes('./index.html'),
 'offline precache must include an app entry point');
assert.ok(normalized.includes('sw.js')===false,
 'service worker must not precache its own script under a stale version');
for(const file of normalized){
 assert.ok(!file.startsWith('/')&&!file.includes('..'),'precache must use local relative paths: '+file);
 assert.ok(fs.existsSync(path.join(root,file)),'missing precached file: '+file);
}
assert.ok(normalized.includes('legacy/index.html'),'legacy route remains in offline cache while linked from Settings');
assert.ok(fs.readFileSync(path.join(root,'app.js'),'utf8').includes('href="legacy/index.html"'),
 'legacy offline entry must remain reachable from Settings');
console.log('PASS '+files.length+' offline precache entries resolve to existing local files');
