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
assert.ok(sw.includes('FILES.some(file=>new URL(file,scope).pathname===url.pathname)'),
 'runtime cache must not grow with arbitrary network requests');

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
assert.ok(!normalized.some(file=>file.startsWith('legacy/')),
 'retired legacy interface must not be included in the primary app offline cache');
assert.ok(!fs.readFileSync(path.join(root,'app.js'),'utf8').includes('href="legacy/index.html"'),
 'primary Settings must not link to the retired legacy interface');
// HTML image and inline style URLs must also be available without a network.
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const htmlAssets=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1])
 .concat([...html.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1].replace(/^['"]|['"]$/g,'')));
for(const url of htmlAssets){
 if(!url||/^(?:https?:|data:|#)/i.test(url))continue;
 const asset=url.split(/[?#]/)[0];
 assert.ok(normalized.includes(asset),'HTML asset not available on first offline launch: '+url);
}
// Promoting the preview interface must not silently strand existing training data.
// These persisted keys are intentionally unchanged until a tested migration exists.
const primaryApp=fs.readFileSync(path.join(root,'app.js'),'utf8');
for(const key of ['sl-dev-preview-data-v33','sl-dev-preview-draft-v33','sl-dev-preview-transaction-v33']){
 assert.ok(primaryApp.includes(key),'existing training-data storage key changed without migration: '+key);
}
// CSS can reference artwork outside the HTML dependency graph. Check primary UI assets.
for(const cssFile of ['styles.css','interface-polish.css']){
 const cssPath=path.join(root,cssFile);
 const css=fs.readFileSync(cssPath,'utf8');
 const urls=[...css.matchAll(/url\(\s*['"]?([^)'"]+)['"]?\s*\)/g)].map(match=>match[1].trim());
 for(const url of urls){
  if(/^(?:data:|https?:|#)/i.test(url))continue;
  const asset=url.split(/[?#]/)[0];
  const resolved=path.resolve(path.dirname(cssPath),asset);
  assert.ok(fs.existsSync(resolved),
   'missing CSS asset in '+cssFile+': '+url);
  const local=path.relative(root,resolved).split(path.sep).join('/');
  assert.ok(normalized.includes(local),
   'CSS asset not available on first offline launch: '+cssFile+' -> '+url);
 }
}
console.log('PASS primary CSS asset references resolve');
console.log('PASS '+files.length+' offline precache entries resolve to existing local files');
