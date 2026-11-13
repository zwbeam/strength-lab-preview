const PREFIX="sl-dev-preview-cache-";
const CACHE=PREFIX+"rc27-source-curriculum-20261113";
const FILES=["./","./index.html","./styles.css","./interface-polish.css","./chalkboard-art.svg","./app.js","./notebook.js","./rolling-calendar.js","./engine.js","./session-timer.js","./movement-instruction.js","./learning.js","./programming-education.js","./manifest.webmanifest","./source-index.json","./sources-00.json","./sources-01.json","./sources-02.json","./sources-03.json","./sources-04.json","./sources-05.json","./sources-06.json","./sources-07.json","./sources-08.json","./sources-09.json","./sources-10.json","./sources-11.json","./sources-12.json","./sources-13.json","./sources-14.json","./sources-15.json","./sources-16.json","./sources-17.json","./sources-18.json","./sources-19.json","./sources-20.json","./sources-21.json","./sources-22.json","./sources-23.json","./icon-192.png","./icon-512.png","./preview-build.json","./chalkboard-background.webp","./chalk-notes-overlay.webp","./kettlebell-consistency-chalkboard.webp","./strength-lab-banner.webp","./nav-train.webp","./nav-training-log.webp","./nav-learn.webp","./nav-settings.webp"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url),scope=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{
  if(response.ok&&FILES.some(file=>new URL(file,scope).pathname===url.pathname)){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}
  return response;
 }).catch(async()=>{const cache=await caches.open(CACHE);return await cache.match(request)||await cache.match(request,{ignoreSearch:true})||(request.mode==='navigate'?await cache.match('./index.html'):Response.error());}));
});
