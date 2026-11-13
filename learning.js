/* Educational views use the training registry; status is not technique certification. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StrengthLearn=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function create(E,content){
 const gearLabels={kb:'Kettlebells',club:'Heavy clubs',bodyweight:'Bodyweight'};
 const familyLabels={hinge:'Hinge',squat:'Squat',press:'Press',pull:'Pull',carry:'Carry',rotation:'Rotation',getup:'Get-up',ground:'Ground movement'};
 function instruction(id){if(!E.MOVES[id])throw Error('Unknown movement');return content.entries[id]||{purpose:E.MOVES[id].complex?'Combined practice of the named component movements. A complete source-reviewed combination lesson is not available yet.':'Movement instruction has not yet been source-reviewed.',setup:[],steps:[],bracing:[],mistakes:[],sourceIds:[],videoSourceIds:[],evidence:[],coverage:'pending: instructional coverage not yet verified; do not infer technique from a program name'};}
 function videos(id){const entry=instruction(id);return(entry.videoSourceIds||[]).slice(0,2).map(sourceId=>({...content.sources[sourceId],role:entry.videoRole||'instruction',label:entry.videoLabels?.[sourceId]||null,mapping:'Exact indexed transcript URL; no verified timestamps'}));}
 function status(s,id,opts={}){
  const m=E.MOVES[id],rx=E.prescription(s,id,opts),missing=E.prerequisites(s,id,opts),equipment=s.equipment?.[m.gear];
  const unavailable=!m.bodyweight&&Array.isArray(equipment)&&!equipment.length;
  const blocked=unavailable||missing.length>0||['review','prerequisite'].includes(rx.mode);
  const reason=unavailable?'Required equipment is not available. Review Settings.':blocked?rx.reason:'';
  if(blocked)return{key:'blocked',label:'Not yet eligible for training',reason,eligible:false};
  if(s.learnedMovements?.[id])return{key:'learned',label:'Learned · self-confirmed',reason:'Your familiarity report is not automatic technique certification.',eligible:true};
  if(E.records(s,id).some(x=>x.actualSets>0))return{key:'practicing',label:'Currently practicing',reason:'Recorded practice does not by itself establish technical mastery.',eligible:true};
  return{key:'available',label:'Available to learn',reason:'Review the lesson and confirm required skills before progressing.',eligible:true};
 }
 function relations(id){
  instruction(id);
  const parents=(E.MOVES[id].practicePrereqs||[]).map(from=>({from,to:id,dimension:'complexity',gate:true,label:'Supporting practice gate · reviewed teaching plus app evidence rules',sourceIds:E.MOVES[id].teachingSources||[]}));
  const children=Object.keys(E.MOVES).filter(next=>E.MOVES[next].practicePrereqs?.includes(id)).map(to=>({from:id,to,dimension:'complexity',gate:true,label:'Possible next practice · skill confirmation still required',sourceIds:E.MOVES[to].teachingSources||[]}));
  const educational=(content.links||[]).filter(x=>x.from===id||x.to===id).map(x=>({...x,gate:false}));
  return{parents,children,educational};
 }
 function browse({gear='',family='',query=''}={}){query=query.toLowerCase().trim();return Object.entries(E.MOVES).filter(([id,m])=>(!gear||m.gear===gear)&&(!family||m.family===family)&&(!query||m.name.toLowerCase().includes(query))).map(([id,m])=>({id,...m}));}
 return{gearLabels,familyLabels,instruction,videos,status,relations,browse};
}
return{create};
});
