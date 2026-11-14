/* Educational views use the training registry; status is not technique certification. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StrengthLearn=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function create(E,content){
 const gearLabels={kb:'Kettlebells',club:'Heavy clubs',bodyweight:'Bodyweight'};
 const familyLabels={hinge:'Hinge',squat:'Squat',press:'Press',pull:'Pull',carry:'Carry',rotation:'Rotation',getup:'Get-up',ground:'Ground movement'};
 const catalog={...E.MOVES,...content.references};
 const move=id=>catalog[id];
 function instruction(id){if(!catalog[id])throw Error('Unknown movement');return content.entries[id]||content.references?.[id]||{purpose:E.MOVES[id].complex?'Combined practice of the named component movements. A complete source-reviewed combination lesson is not available yet.':'Movement instruction has not yet been source-reviewed.',setup:[],steps:[],bracing:[],mistakes:[],sourceIds:[],videoSourceIds:[],evidence:[],coverage:'pending: instructional coverage not yet verified; do not infer technique from a program name'};}
 function videos(id){const entry=instruction(id);return(entry.videoSourceIds||[]).slice(0,2).map(sourceId=>({...content.sources[sourceId],role:entry.videoRole||'instruction',label:entry.videoLabels?.[sourceId]||null,mapping:'Exact indexed transcript URL; no verified timestamps'}));}
 function status(s,id,opts={}){
  if(catalog[id]?.instructionOnly)return{key:'reference',label:'Instruction only',reason:'Source-reviewed teaching reference. No automatic prescription or progression is implemented for this movement.',eligible:false};
  const m=E.MOVES[id],rx=E.prescription(s,id,opts),missing=E.prerequisites(s,id,opts),equipment=s.equipment?.[m.gear];
  const unavailable=!m.bodyweight&&Array.isArray(equipment)&&!equipment.length;
  const blocked=unavailable||missing.length>0||['review','prerequisite'].includes(rx.mode);
  const reason=unavailable?'Required equipment is not available. Review Settings.':blocked?rx.reason:'';
  if(blocked)return{key:'blocked',label:'Not yet eligible for training',reason,eligible:false};
  if(s.learnedMovements?.[id])return{key:'learned',label:'Learned · self-confirmed',reason:'Your familiarity report is not automatic technique certification.',eligible:true};
  if(E.records(s,id,{...opts,now:opts.now??new Date()}).some(x=>x.actualSets>0))return{key:'practicing',label:'Currently practicing',reason:'Recorded practice does not by itself establish technical mastery.',eligible:true};
  return{key:'available',label:'Available to learn',reason:'Review the lesson and confirm required skills before progressing.',eligible:true};
 }
 function relations(id){
  instruction(id);
  const parents=(E.MOVES[id]?.practicePrereqs||[]).map(from=>({from,to:id,dimension:E.MOVES[id].sequence?.includes(from)?'combination':'complexity',gate:true,label:'Supporting practice gate · reviewed teaching plus app evidence rules',sourceIds:E.MOVES[id].teachingSources||[]}));
  const children=Object.keys(E.MOVES).filter(next=>E.MOVES[next].practicePrereqs?.includes(id)).map(to=>({from:id,to,dimension:E.MOVES[to].sequence?.includes(id)?'combination':'complexity',gate:true,label:'Possible next practice · skill confirmation still required',sourceIds:E.MOVES[to].teachingSources||[]}));
  const educational=(content.links||[]).filter(x=>x.from===id||x.to===id).filter(x=>![...parents,...children].some(g=>g.from===x.from&&g.to===x.to)).map(x=>({...x,gate:false}));
  return{parents,children,educational};
 }
 function browse({gear='',family='',query=''}={}){query=query.toLowerCase().trim();return Object.entries(catalog).filter(([id,m])=>(!gear||m.gear===gear)&&(!family||m.family===family)&&(!query||m.name.toLowerCase().includes(query))).map(([id,m])=>({id,...m}));}
 return{move,gearLabels,familyLabels,instruction,videos,status,relations,browse};
}
return{create};
});
