/* Strength Lab prescription engine. Pure functions, no browser dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StrengthEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const MOVES={
 swing:{name:'Two-hand swing',gear:'kb',unit:'kg',family:'hinge',method:'volume',reps:10,start:3,end:6,rest:90,sec:25,side:1,cues:['Hinge at the hips; keep your back stable.','Drive with the hips; arms guide the bell.','Stop when the bell no longer floats from hip power.'],avoid:'Do not turn the swing into a squat or shoulder raise.'},
 squat:{name:'Goblet squat',gear:'kb',unit:'kg',family:'squat',method:'volume',reps:6,start:3,end:5,rest:105,sec:30,side:1,cues:['Hold the bell close and brace.','Sit between the hips with heels planted.','Stand tall without leaning backward.'],avoid:'Reduce depth or load if you lose control.'},
 press:{name:'Single-arm strict press',gear:'kb',unit:'kg',family:'press',method:'volume',reps:5,start:2,end:4,rest:120,sec:45,side:2,cues:['Rack with wrist straight and ribs stacked.','Press without a knee dip or sideways lean.','Lower under control; train both sides.'],avoid:'Do not press through shoulder pain.'},
 row:{name:'Single-arm row',gear:'kb',unit:'kg',family:'pull',method:'volume',reps:8,start:2,end:4,rest:90,sec:40,side:2,cues:['Hinge with a stable torso.','Pull elbow toward your back pocket.','Lower without twisting.'],avoid:'Avoid rotating the trunk to finish the pull.'},
 clean:{name:'Single-arm clean',gear:'kb',unit:'kg',family:'hinge',method:'volume',reps:5,start:2,end:4,rest:105,sec:45,side:2,cues:['Start with a controlled hike and hip drive.','Keep the bell close and guide it around the hand.','Finish in a quiet rack without forearm impact.'],avoid:'Stop if the bell repeatedly crashes into your arm.'},
 carry:{name:'Suitcase carry',gear:'kb',unit:'kg',family:'carry',method:'volume',reps:30,start:2,end:4,rest:75,sec:70,side:2,timed:true,cues:['Stand tall with one bell at your side.','Walk slowly without leaning.','Change sides and match the time.'],avoid:'Do not continue if grip or posture fails.'},
 cast:{name:'Two-hand shield cast',gear:'club',unit:'lb',family:'rotation',method:'volume',reps:5,start:2,end:4,rest:90,sec:45,side:2,cues:['Begin with a light club and clear space.','Move smoothly around the head within comfortable range.','Return to the front under control; reverse direction.'],avoid:'Avoid forcing the shoulders or striking the body.'},
 circles:{name:'Two-hand club circles',gear:'club',unit:'lb',family:'rotation',method:'volume',reps:6,start:2,end:4,rest:90,sec:45,side:2,cues:['Brace and keep the feet planted.','Draw a controlled circle on each side.','Match the arc and tempo in both directions.'],avoid:'Do not chase speed at the expense of control.'},
 front:{name:'Two-hand club front swing',gear:'club',unit:'lb',family:'hinge',method:'volume',reps:8,start:3,end:5,rest:90,sec:30,side:1,cues:['Stand stable with hands secure.','Swing with a smooth hip-driven rhythm.','Control the return rather than letting the club pull you.'],avoid:'Avoid snapping the lower back.'}
};
Object.assign(MOVES,{
 snatch:{name:'Single-arm snatch',gear:'kb',unit:'kg',family:'hinge',reps:5,start:4,end:20,rest:0,sec:30,side:2,cues:['Only practice a familiar snatch with a controlled overhead lockout.','Start with the weaker side; match the stronger side.','Stop if hand skin, grip or overhead control deteriorates.'],avoid:'Do not learn a snatch by testing a heavy or unfamiliar load.'},
 doublePress:{name:'Double clean and press',gear:'kb',pair:true,unit:'kg per bell',family:'press',reps:3,start:3,end:10,rest:150,sec:30,side:1,cues:['Use a matched pair you can rack and press with control.','Keep the trunk stable and lower into a quiet rack.'],avoid:'No maximum attempts or grinding repetitions.'},
 doubleSquat:{name:'Double front squat',gear:'kb',pair:true,unit:'kg per bell',family:'squat',reps:3,start:3,end:10,rest:150,sec:30,side:1,cues:['Use a familiar, secure double rack.','Keep depth and bracing repeatable.'],avoid:'Stop when rack position or controlled depth is lost.'}
});
// Skill confirmations are user reports, not automatic technique certification.
const SKILLS={
 swing:{name:'Familiar controlled swing',sources:[288]},clean:{name:'Familiar clean',sources:[288]},overhead:{name:'Controlled overhead lockout and snatch technique',sources:[288]},rack:{name:'Secure double rack',sources:[120]},doublePress:{name:'Familiar double clean and press',sources:[366]},doubleSquat:{name:'Familiar double front squat',sources:[366]},
 getupOverhead:{name:'Stable overhead position through familiar get-up transitions',sources:[423,658]},floorPress:{name:'Comfortable get-up floor press and safe setup/return',sources:[422]},rollToElbow:{name:'Controlled press, roll and elbow support',sources:[298]},pressToHand:{name:'Stable elbow-to-hand support transition',sources:[372]},hipPass:{name:'Controlled hip pass and kneeling transition',sources:[324]},getup:{name:'Familiar complete get-up on both sides with stable overhead position',sources:[423,658]},
 clubTwoHandFoundation:{name:'Prior two-hand club foundation across at least three weights; ready for a reviewed single-arm transition',sources:[275,648,543]},clubGrip:{name:'Controlled club grip, hand changes and clear swing space',sources:[578,581]},clubInside:{name:'Familiar single-arm inside circle on both sides',sources:[275]},clubOutside:{name:'Familiar single-arm outside circle on both sides',sources:[648]},clubShield:{name:'Familiar single-arm shield cast on both sides',sources:[543]}
};
Object.assign(MOVES,{
 getup:{name:'Turkish get-up',gear:'kb',unit:'kg',family:'getup',reps:180,start:1,end:1,rest:0,sec:180,side:2,timed:true,defaultProfile:'getup',requires:['floorPress','rollToElbow','pressToHand','hipPass','getupOverhead','getup'],teachingSources:[422,298,372,324,423,658],cues:['Use a familiar load and deliberate fixation at each transition.','Alternate complete single repetitions; start with your weaker side.','Record total time under load and actual completed reps on each side.'],avoid:'Stop safely if overhead control or a transition deteriorates; do not rush to meet a time goal.'},
 clubInside:{name:'Single-arm club inside circle',gear:'club',unit:'lb',family:'rotation',reps:5,start:4,end:20,rest:0,sec:24,side:2,defaultProfile:'singleClub',requires:['clubTwoHandFoundation','clubGrip','clubInside'],teachingSources:[275,578,581],cues:['Begin from a controlled order position with clear space.','Inside means the hand moves toward the center line.','Match both sides and keep the club under control through hand changes.'],avoid:'Do not replace the two-hand learning foundation with a heavy single-arm attempt.'},
 clubOutside:{name:'Single-arm club outside circle',gear:'club',unit:'lb',family:'rotation',reps:5,start:4,end:20,rest:0,sec:24,side:2,defaultProfile:'singleClub',requires:['clubTwoHandFoundation','clubGrip','clubOutside'],teachingSources:[648,578,581],cues:['Outside means the hand moves away from the center line.','Use a familiar light club and stable controlled movement.','Match inside/outside practice and both sides; do not chase speed.'],avoid:'Stop if the club path, catch or hand change becomes uncontrolled.'},
 clubShield:{name:'Single-arm club shield cast',gear:'club',unit:'lb',family:'rotation',reps:5,start:4,end:20,rest:0,sec:24,side:2,defaultProfile:'singleClub',requires:['clubTwoHandFoundation','clubGrip','clubShield'],teachingSources:[543,578,581],cues:['Build from the familiar two-hand cast before removing support.','Rotate, push, pull and catch with a controlled return to order.','Keep the club off the ground between sets only while technique stays clean.'],avoid:'Do not force a shoulder range or continue after grip or control is lost.'}
});
MOVES.snatch.requires=['swing','clean','overhead'];
MOVES.doublePress.requires=['rack','doublePress'];MOVES.doubleSquat.requires=['rack','doubleSquat'];
// These practice gates are app safeguards; a log does not certify a new technique.
Object.assign(SKILLS,{
 clubPendulumTwoHand:{name:'Familiar supported two-hand pendulum before single-arm practice',sources:[260,265]},
 clubInsidePendulum:{name:'Familiar single-arm inside pendulum',sources:[260]},clubOutsidePendulum:{name:'Familiar single-arm outside pendulum',sources:[265]},
 clubFrontPullover:{name:'Familiar controlled front-to-back pullover',sources:[269,624]},clubOutsidePullover:{name:'Familiar outside pullover',sources:[269]},clubInsidePullover:{name:'Familiar controlled inside pullover with three counts',sources:[624]}
});
const drill=(name,requires,practicePrereqs,source,cues,end=5)=>({name,gear:'kb',unit:'kg',family:'getup',reps:3,start:1,end:1,rest:90,sec:36,repSeconds:6,side:2,defaultProfile:'getupDrill',requires,practicePrereqs,teachingSources:[source],practiceRepEnd:end,practiceSourceNumbers:source===372?372:null,cues,avoid:'Use a familiar light load; stop when support, position or controlled return is lost.'});
Object.assign(MOVES,{
 getupFloor:drill('Get-up floor press practice',['floorPress'],[],422,['Use the familiar floor setup and support the return with the other hand.','Keep a controlled wrist and forearm position; match both sides.']),
 getupElbow:drill('Get-up press to elbow',['floorPress','rollToElbow'],['getupFloor'],298,['Press, roll and rise onto the elbow with deliberate support.','Reverse the sequence with control and match both sides.']),
 getupHand:drill('Get-up press to hand',['floorPress','rollToElbow','pressToHand'],['getupElbow'],372,['Press, roll, elbow, hand; stabilize rather than repeatedly moving the support hand.','Return through elbow and shoulders with control.'],10),
 getupHipPass:drill('Get-up hip-pass practice',['floorPress','rollToElbow','pressToHand','hipPass'],['getupHand'],324,['From stable hand support, lift the hip and bring the knee back in line with the hand.','Orient upright, then reverse deliberately; this drill omits the final stand.'])
});
const clubNext=(name,skill,parents,source,cues,repSeconds=4)=>({name,gear:'club',unit:'lb',family:'rotation',reps:3,start:2,end:6,rest:0,sec:24,repSeconds,side:2,defaultProfile:'clubIntermediate',requires:['clubTwoHandFoundation','clubGrip','clubInside','clubOutside','clubShield',skill],practicePrereqs:parents,teachingSources:[578,581,source],cues,avoid:'Use a familiar light club and reviewed technique; stop rather than force rotation, grip or a catch.'});
const clubBases=['clubInside','clubOutside','clubShield'];
Object.assign(MOVES,{
 clubInsidePendulum:clubNext('Single-arm club inside pendulum','clubInsidePendulum',clubBases,260,['Inside travels toward the center line; use the supported two-hand rehearsal first.','Rotate through a controlled path, then return to order.']),
 clubOutsidePendulum:clubNext('Single-arm club outside pendulum','clubOutsidePendulum',clubBases,265,['Outside travels away from the center line.','Rehearse with two hands, then remove support only with familiar control.']),
 clubFrontPullover:clubNext('Single-arm club front pullover','clubFrontPullover',['clubShield'],269,['Rehearse the familiar straight-back, straight-forward pullover.','Keep the return to order controlled before adding rotation.'],5),
 clubOutsidePullover:clubNext('Single-arm club outside pullover','clubOutsidePullover',['clubFrontPullover'],269,['Use the familiar front-to-back pullover foundation first.','The hand travels outside and past the same-side ear; return under control.'],5),
 clubInsidePullover:clubNext('Single-arm club inside pullover three count','clubInsidePullover',['clubOutsidePullover'],624,['Build from front and outside pullovers before the inside variation.','Use three deliberate counts and demonstrate control before the return.'],6)
});
MOVES.clubInsidePendulum.requires.push('clubPendulumTwoHand');MOVES.clubOutsidePendulum.requires.push('clubPendulumTwoHand');
Object.assign(SKILLS,{hingePattern:{name:'Familiar unloaded hip hinge and controlled bracing',sources:[704]},pushupTechnique:{name:'Familiar clean push-up with stable trunk and controlled range',sources:[609]}});
Object.assign(MOVES,{
 hingePractice:{name:'Unloaded hip-hinge practice',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'hinge',reps:10,start:2,end:3,rest:60,sec:30,side:1,defaultProfile:'hingePractice',requires:['hingePattern'],teachingSources:[704],cues:['Rehearse the unloaded hinge with deliberate bracing and controlled return.','Use the pattern as preparation rather than a maximum-effort test.'],avoid:'Stop when bracing or comfortable movement is lost.'},
 pushup:{name:'Push-up EMOM volume',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'press',reps:0,start:10,end:30,rest:0,sec:20,side:1,defaultProfile:'pushup',requires:['pushupTechnique'],teachingSources:[609],cues:['Keep the trunk stable and use a clean, controlled repetition.','Stop the set when the clean movement standard is lost.','Use the configured conservative baseline; the app does not ask for daily maximum attempts.'],avoid:'Do not turn incomplete or poor-technique reps into progression credit.'}
});
// Ground teaching does not imply a loaded get-up or advanced flow qualification.
Object.assign(SKILLS,{
 hipDropTwoHand:{name:'Familiar two-hand hip drop with stable support and quiet steps',sources:[84]},
 hipDropSingleHand:{name:'Familiar single-hand hip drop with controlled supporting shoulder',sources:[98]},
 bearSquat:{name:'Familiar bear squat with comfortable support and controlled knee movement',sources:[100]}
});
Object.assign(MOVES,{
 hipDropTwoHand:{name:'Two-hand hip-drop practice',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'ground',reps:3,start:2,end:4,rest:60,sec:36,repSeconds:6,side:2,defaultProfile:'ground',requires:['hipDropTwoHand'],teachingSources:[84],cues:['Start standing, lower under control and finish by standing again.','Keep both hands flat, knees close to wrists and use quiet step-step transitions.','Lower the hip and thigh to the ground; keep the supporting shoulder controlled.'],avoid:'Do not jump, buck the hips or let the feet creep away from the hands.'},
 hipDropSingleHand:{name:'Single-hand hip-drop practice',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'ground',reps:3,start:2,end:4,rest:60,sec:36,repSeconds:6,side:2,defaultProfile:'ground',requires:['hipDropTwoHand','hipDropSingleHand'],practicePrereqs:['hipDropTwoHand'],teachingSources:[98,84],cues:['Use the familiar two-hand setup; return the free hand to the same spot.','Sit the hip and thigh down, bring the free elbow toward the belly and look at the hand.','Keep the supporting shoulder away from the ear; exhale on the hip touch and practice both sides.'],avoid:'Do not lift into an unsupported advanced variation or continue with shoulder pain.'},
 bearSquat:{name:'Bear-squat mobility practice',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'ground',reps:60,start:2,end:4,rest:60,sec:60,side:1,timed:true,defaultProfile:'ground',requires:['bearSquat'],teachingSources:[100,554],cues:['Find hand distance from a comfortable kneeling position.','Move from knees down toward straight legs with stable hands and feet.','Keep elbows straight and move deliberately within comfortable range; return to the same knee position.'],avoid:'Do not force range, speed or an endurance target after control deteriorates.'}
});
SKILLS.deadliftTechnique={name:'Familiar two-hand kettlebell deadlift with stable hinge and controlled return',sources:[704]};
MOVES.deadlift={name:'Two-hand kettlebell deadlift',gear:'kb',unit:'kg',family:'hinge',reps:5,start:2,end:4,rest:90,sec:30,repSeconds:6,side:1,defaultProfile:'deadliftPractice',requires:['hingePattern','deadliftTechnique'],practicePrereqs:['hingePractice'],teachingSources:[704],cues:['Place the bell between the feet and hinge back with controlled alignment.','Stand with controlled bracing, glute engagement and a stable trunk.','Return the bell to the ground under control; use a familiar manageable load.'],avoid:'Do not turn the lift into a swing or increase weight before clean practice and deliberate review.'};
const DAYS=[{name:'A · Squat / Press / Pull',focus:'Kettlebell strength',ids:['squat','press','row']},{name:'B · Hinge / Cast / Carry',focus:'Hinge and club control',ids:['swing','cast','carry']},{name:'C · Clean / Club / Squat',focus:'Skill and balanced strength',ids:['clean','front','circles']}];
const LOADS={kb:[4,6,8,10,12,14,16,18,20,22,24,28,32,36,40,44,48],club:[2,3,4,5,7,10,12,15,17,20,25,30,35]};
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
function records(s,id){return(s.sessions||[]).flatMap((x,sessionIndex)=>(x.items||[]).map((y,itemIndex)=>({...y,date:x.date,_key:`${x.id||x.date+':'+sessionIndex}:${itemIndex}`})).filter(y=>y.id===id)).sort((a,b)=>String(a.date).localeCompare(String(b.date)));}
function successful(x){const validLoad=x&&(MOVES[x.id]?.bodyweight?x.bodyweight===true&&Number(x.weight)===0:Number(x.weight)>0);return !!(x&&x.quality==='clean'&&!x.pain&&x.completed===true&&x.actualSets>=x.targetSets&&x.actualReps>=x.targetReps&&validLoad);}
// Each profile states exactly which parameters are examples from a transcript.
// Promotion, recovery and scheduling thresholds remain configurable app decisions.
const PROFILE_NAMES={legacy:'Existing volume defaults',wave:'Heavy / light volume wave',snatch:'Snatch EMOM example',grind:'Double-kettlebell strength example',club:'Two-hand club timed practice',getup:'Get-up alternating time-under-load goal',singleClub:'Single-arm club continuous volume',getupDrill:'Get-up breakdown rep practice',clubIntermediate:'Single-arm club intermediate practice',deadliftPractice:'Loaded hinge foundation',ground:'Foundational ground practice',hingePractice:'Unloaded hinge preparation',pushup:'Push-up baseline EMOM volume'};
function policyFor(id,s={}){
 const m=MOVES[id];if(!Object.hasOwn(MOVES,id))throw Error('Unknown movement');
 const c=s.programming?.[id]||{},profile=c.profile||m.defaultProfile||(['snatch'].includes(id)?'snatch':['doublePress','doubleSquat'].includes(id)?'grind':'legacy');
 if(!availableProfiles(id).includes(profile))throw Error('Unsupported movement profile');
 if(c.stallStrategy!==undefined&&!['repeat','redistribute'].includes(c.stallStrategy))throw Error('Unknown stall strategy');
 const exposures=c.exposures??2;
 if(!Number.isInteger(exposures)||exposures<1||exposures>6)throw Error('Use 1–6 clean exposures');
 let start=m.start,end=m.end,reps=m.reps,rest=m.rest,step=1,timed=!!m.timed,roundSeconds=null,sources=[666],exactParametersSource=null,density=null;
 if(profile==='snatch'){start=4;end=20;reps=5;rest=0;roundSeconds=60;step=c.step??1;if(![1,2].includes(step))throw Error('Snatch set increment must be 1 or 2');sources=[411,410];exactParametersSource=411;density=[{sets:16,reps:6},{sets:14,reps:7},{sets:12,reps:8},{sets:11,reps:9},{sets:10,reps:10}];}
 if(profile==='grind'){start=3;end=10;reps=c.reps??3;if(![3,4,5].includes(reps))throw Error('Double-kettlebell reps must be 3, 4 or 5');rest=150;roundSeconds=180;sources=[366,120];exactParametersSource=366;}
 if(profile==='club'){start=c.startSets??2;end=c.endSets??6;if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||start>6||end<start||end>12)throw Error('Club set range must be 1–12, starting at 1–6');reps=c.seconds??30;if(![15,30,45,60].includes(reps))throw Error('Choose a supported timed bout');timed=true;rest=c.restSeconds??60;if(![30,60,90,120,180].includes(rest))throw Error('Choose a supported club rest interval');sources=[3];}
 if(profile==='wave'){
  if(!Number.isFinite(c.lightWeight)||!Number.isFinite(c.heavyWeight)||c.lightWeight<=0||c.heavyWeight<=c.lightWeight)throw Error('Heavy weight must exceed the light weight');
  
  sources=[228,403];
 }
 if(profile==='getup'){start=1;end=1;reps=180;rest=0;timed=true;step=c.stepSeconds??60;if(![30,60].includes(step))throw Error('Get-up time step must be 30 or 60 seconds');if(c.weakSide!==undefined&&!['left','right'].includes(c.weakSide))throw Error('Choose left or right weaker side');sources=[423,658];exactParametersSource=423;}
 if(profile==='singleClub'){start=4;end=20;reps=5;rest=0;step=c.step??1;if(![1,2].includes(step))throw Error('Single-arm club set increment must be 1 or 2');sources=[578,581];exactParametersSource=578;}
 if(profile==='getupDrill'){start=1;end=1;reps=3;rest=90;sources=m.teachingSources;exactParametersSource=m.practiceSourceNumbers;}
 if(profile==='clubIntermediate'){start=c.startSets??2;end=c.endSets??6;reps=c.repCount??3;rest=0;if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||start>6||end<start||end>12||![3,4,5].includes(reps))throw Error('Intermediate club practice needs 1–12 sets and 3–5 reps');sources=m.teachingSources;exactParametersSource=null;}
 if(profile==='ground'){start=c.startSets??2;end=c.endSets??4;reps=c.repCount??m.reps;rest=60;if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||start>4||end<start||end>6||!(m.timed?[30,60,90]:[3,4,5]).includes(reps))throw Error('Ground practice needs 1–6 sets and a supported dose');sources=m.teachingSources;exactParametersSource=null;}
 if(profile==='deadliftPractice'){start=c.startSets??2;end=c.endSets??4;reps=c.repCount??5;rest=90;if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||start>4||end<start||end>6||![3,5,8].includes(reps))throw Error('Loaded hinge practice needs 1–6 sets and 3, 5 or 8 reps');sources=[704];exactParametersSource=null;}
 if(profile==='hingePractice'){start=2;end=3;reps=10;rest=60;sources=[704];exactParametersSource=704;}
 if(profile==='pushup'){const baseline=c.cleanBaseline??0,fraction=c.fraction??.4;if(!Number.isInteger(baseline)||baseline<0||baseline>200||baseline>0&&baseline<3||![.4,.5].includes(fraction))throw Error('Use a conservative clean baseline of 3–200 and a 40% or 50% fraction');if(c.cycleRevision!==undefined&&(!Number.isInteger(c.cycleRevision)||c.cycleRevision<0))throw Error('Invalid baseline revision');start=10;end=30;reps=Math.floor(baseline*fraction);rest=0;step=c.step??1;if(![1,2].includes(step))throw Error('Push-up set increment must be 1 or 2');roundSeconds=60;sources=[609];exactParametersSource=609;}
 const heavyReps=c.heavyReps??Math.max(1,Math.floor(m.reps*.6));if(profile==='wave'&&(!Number.isInteger(heavyReps)||heavyReps<1||heavyReps>m.reps))throw Error('Heavy reps must be whole and no greater than light reps');
 const stages=[];if(profile==='getup'){for(let seconds=180;seconds<=600;seconds+=step)stages.push({sets:1,reps:seconds,rest:0});}else if(profile==='getupDrill'){for(let count=3;count<=m.practiceRepEnd;count++)stages.push({sets:1,reps:count,rest});}else{for(let sets=start;sets<end;sets+=step)stages.push({sets,reps,rest});stages.push({sets:end,reps,rest});}
 const custom=profile==='club'&&(start!==2||end!==6||rest!==60)?{start,end,rest}:profile==='wave'&&heavyReps!==Math.max(1,Math.floor(m.reps*.6))?{heavyReps}:null;
 let key=profile==='legacy'&&Object.keys(c).length===0?'legacy-v1':JSON.stringify(['rules-20261105-1',id,profile,reps,step,exposures,c.lightWeight,c.heavyWeight,c.stallStrategy||'repeat']);
 if(custom)key=JSON.stringify([key,custom]);if(['clubIntermediate','ground','deadliftPractice'].includes(profile))key=JSON.stringify([key,{start,end}]);if(profile==='pushup')key=JSON.stringify([key,c.cleanBaseline??0,c.fraction??.4,c.cycleRevision??0]);if(profile==='getup')key=JSON.stringify([key,c.weakSide||'left']);
 const parameterNotes=profile==='deadliftPractice'?'Loaded hinge teaching and preparation are from #704. Loaded rep/set/rest targets, recent unloaded evidence and promotion gates are configurable app defaults; the source 2–3×10 example is explicitly unloaded.':profile==='ground'?'Teaching and the two-hand to single-hand sequence are source-supported. Sets, rest, rep targets and exposure gates are app defaults. Bear-squat 60/90-second bouts are #100 examples; the 30-second option is an app regression; hip-drop rep practice is an app alternative to the #84 timed example.':profile==='hingePractice'?'Unloaded 2–3×10 is from #704; rest and pace are app defaults.':profile==='pushup'?'EMOM span and baseline fraction are from #609; conservative input, rounding and promotion/recovery gates are app choices.':profile==='getupDrill'?'Sets, rest and evidence gates are app defaults; only the hand-support light-load rep range has numeric support in #372.':profile==='clubIntermediate'?'Teaching and the general volume method are source-linked; these intermediate set/rep targets and evidence gates are app defaults.':'';
 return{movement:id,profile,parameterNotes,continuous:['getup','singleClub','clubIntermediate'].includes(profile),betweenExercises:['singleClub','clubIntermediate'].includes(profile)?120:0,durationScope:profile==='getup'?'total':null,weakSide:c.weakSide||'left',heavyReps,label:PROFILE_NAMES[profile],key,kind:exactParametersSource===null?'app-default':'transcript-example',volume:{start,end,reps,rest},stages,density,roundSeconds,timed,exposures,principleSources:sources,exactParametersSource,promotion:`${exposures} clean complete exposures (app setting)`,endpoint:'explicit review',config:c};
}
function availableProfiles(id){if(MOVES[id]?.defaultProfile)return [MOVES[id].defaultProfile];if(id==='snatch')return ['snatch'];if(['doublePress','doubleSquat'].includes(id))return ['grind'];if(MOVES[id]?.gear==='club')return ['legacy','club'];if(['swing','squat','press','row','clean'].includes(id))return ['legacy','wave'];return ['legacy'];}
function configureMovement(s,id,config){if(config.profile==='legacy'&&(config.exposures??2)===2&&(!config.stallStrategy||config.stallStrategy==='repeat'))config={};const next={...s,programming:{...s.programming,[id]:config}};const policy=policyFor(id,next);if(policy.profile==='wave'&&![config.lightWeight,config.heavyWeight].every(w=>(s.equipment?.[MOVES[id].gear]||[]).includes(w)))throw Error('Both wave weights must be available');return next;}
function replay(s,id,policy,track='base'){
 const h=records(s,id).filter(x=>(x.policyKey||'legacy-v1')===policy.key&&(x.track||'base')===track);
 let stage=0,stagePhase='volume',ready=false,streak=0,fail=0,cycles=0,weight=MOVES[id].bodyweight?0:policy.profile==='wave'?(track==='heavy'?policy.config.heavyWeight:policy.config.lightWeight):(Number(s.weights?.[id])||0),lastEligibleKey=null;
 const shape=()=>stagePhase==='density'?{...policy.density[stage],rest:0}:policy.stages[stage];
 for(const x of h){
  if(!MOVES[id].bodyweight&&Number(x.weight)>0&&Number(x.weight)!==weight){weight=Number(x.weight);stage=0;stagePhase='volume';ready=false;streak=0;fail=0;}
  if(x.pain||x.quality==='pain'){streak=0;fail++;continue;}
  if(x.performed&&['rebuild','reentry','recovery','deload'].includes(x.mode)){streak=0;if(x.quality==='clean')fail=0;continue;}
  if(x.quality!=='clean'||x.completed===false){streak=0;if(x.actualSets>0||['hard','breakdown'].includes(x.quality))fail++;continue;}
  if(ready)continue;
  const target=shape();
  if(successful(x)&&x.targetSets===target.sets&&x.targetReps===target.reps&&Math.abs(Number(x.rest)-target.rest)<1){
   fail=0;streak++;
   if(streak>=policy.exposures){streak=0;lastEligibleKey=x._key;const steps=stagePhase==='density'?policy.density:policy.stages;
    if(stage<steps.length-1)stage++;else{ready=true;cycles++;if(stagePhase==='volume'&&policy.density&&s.cycleChoices?.[id]?.at===x._key){stagePhase='density';stage=0;ready=false;}}
   }
  }else streak=0;
 }
 const override=Number(s.nextWeights?.[id]);
 if(!MOVES[id].bodyweight&&policy.profile!=='wave'&&override>0&&override!==weight){weight=override;stage=0;stagePhase='volume';ready=false;streak=0;fail=0;}
 return{...shape(),phase:ready?'ready':stagePhase,stagePhase,stage,weight,streak,fail,cycles,lastEligibleKey,last:h.at(-1)||null,exposures:h.length};
}
function stateFor(s,id){
 const policy=policyFor(id,s),h=records(s,id),resolvedKeys=s.painResolutions?.[id]?.painKeys||[];
 const reviewedIndex=h.reduce((last,x,index)=>resolvedKeys.includes(x._key)?index:last,-1);
 const hold=h.some(x=>(x.pain||x.quality==='pain')&&!resolvedKeys.includes(x._key))?'Pain reported: stop and review this movement.':'';
 const reviewRecovery=resolvedKeys.length>0&&!h.slice(reviewedIndex+1).some(x=>x.performed&&['reentry','recovery'].includes(x.mode)&&x.quality==='clean');
 let track='base';
 if(policy.profile==='wave'){const eligible=h.filter(x=>x.policyKey===policy.key&&successful(x));track=eligible.length%2?'heavy':'light';}
 let result=replay(s,id,policy,track);
 if(policy.profile==='wave'){
  const light=replay(s,id,policy,'light');
  if(track==='heavy'){
   const heavyReps=policy.heavyReps;
   // Whole sets; heavy work must stay strictly below light work (#228).
   const lastLight=records(s,id).filter(x=>x.policyKey===policy.key&&x.track==='light'&&successful(x)).at(-1);
   const lightWork=(lastLight?.targetSets??light.sets)*(lastLight?.targetReps??light.reps)*policy.config.lightWeight;
   const sets=Math.max(0,Math.ceil(lightWork/(heavyReps*policy.config.heavyWeight))-1);
   result={...result,sets,reps:heavyReps,phase:light.phase,cycles:light.cycles,streak:0};
  }
 }
 return{...result,hold,reviewRecovery,policy,track,allExposures:h.length};
}
function resolvePain(s,id){if(!MOVES[id])throw Error('Unknown movement');return {...s,painResolutions:{...s.painResolutions,[id]:{painKeys:records(s,id).filter(x=>x.pain||x.quality==='pain').map(x=>x._key)}}};}
function movementGap(s,id,now=new Date()){const last=records(s,id).filter(x=>x.actualSets>0).at(-1);if(!last)return 0;return Math.max(0,Math.floor(calendarDay(now)-calendarDay(last.date)));}
function practiceEvidence(s,id,opts={}){
 const st=stateFor(s,id),history=records(s,id).filter(x=>(x.policyKey||'legacy-v1')===st.policy.key&&Number(x.weight)===st.weight);
 const bad=history.findLastIndex(x=>!successful(x)||['rebuild','reentry','recovery','deload'].includes(x.mode));
 const count=history.slice(bad+1).filter(successful).length,required=s.trainingDefaults?.skillExposures??2,absence=s.trainingDefaults?.reentryDays??14;
 let recent=movementGap(s,id,opts.now)<=absence,maintained=false;
 if(!recent&&opts.forMovement){
  const child=stateFor(s,opts.forMovement),h=records(s,opts.forMovement).filter(x=>(x.policyKey||'legacy-v1')===child.policy.key&&Number(x.weight)===child.weight);
  const lastBad=h.findLastIndex(x=>!successful(x));
  maintained=h.slice(lastBad+1).filter(successful).length>=required&&movementGap(s,opts.forMovement,opts.now)<=absence&&!child.hold;
 }
 const upstreamReady=prerequisites(s,id,opts).length===0;
 return{count,required,ready:count>=required&&(recent||maintained)&&!st.hold&&upstreamReady,recent,maintained,held:!!st.hold};
}
function supportingMoves(s,ids,opts={}){
 const result=[],seen=new Set();
 function visit(id){if(seen.has(id))return;seen.add(id);for(const parent of MOVES[id]?.practicePrereqs||[]){visit(parent);if(!practiceEvidence(s,parent,{...opts,forMovement:id}).ready&&!ids.includes(parent)&&!result.includes(parent))result.push(parent);}}
 ids.forEach(visit);return result;
}
function requirementLabel(key){if(key==='baseline:pushup')return 'Enter a recent conservative clean-rep baseline for push-ups in Settings';return key.startsWith('practice:')?'Recent clean supporting practice: '+MOVES[key.slice(9)].name:SKILLS[key]?.name||key;}
function prerequisites(s,id,opts={}){
 const m=MOVES[id];return[...(m?.defaultProfile==='pushup'&&policyFor(id,s).volume.reps<1?['baseline:pushup']:[]),...(m?.requires||[]).filter(skill=>s.skills?.[skill]!==true),...(m?.practicePrereqs||[]).filter(parent=>!practiceEvidence(s,parent,{...opts,forMovement:id}).ready).map(parent=>'practice:'+parent)];
}
function prescription(s,id,opts={}){
 const m=MOVES[id],st=stateFor(s,id),policy=st.policy,defaults=s.trainingDefaults||{};
 let sets=st.sets,reps=st.reps,rest=st.rest,weight=st.weight,mode=st.phase==='ready'?'milestone':st.phase;
 let reason=policy.profile==='wave'?`${st.track==='heavy'?'Heavy: lower total work':'Light: higher total work'}; each movement advances independently.`:`${policy.label}: complete the prescription cleanly ${policy.exposures} time(s) before the next step.`;
 if(!weight&&!m.bodyweight){mode='baseline';reason='Choose a familiar working weight; do not test a maximum.';}
 else if(st.fail>=2){
  mode='rebuild';
  if(policy.config.stallStrategy==='redistribute'&&!policy.timed&&!policy.roundSeconds&&!policy.continuous&&reps>=3){
   const failed=records(s,id).filter(x=>x.actualSets>0).at(-1);
   const incomplete=failed&&(failed.actualSets<failed.targetSets||failed.actualReps<failed.targetReps||failed.quality==='hard');
   const factor=incomplete?.6:.8;
   reps=Math.max(1,Math.floor(st.reps*factor));sets=Math.ceil(st.sets*st.reps/reps);reason='Stall alternative: fewer reps per set, redistributed volume (#259). Fraction and rounding are app defaults; never rush the work.';
  }else{if(sets<=1)reps=policy.durationScope==='total'?Math.max(30,Math.floor(reps*.7/30)*30):Math.max(1,Math.floor(reps*.7));sets=Math.max(1,sets-1);reason='Repeated difficulty: reduce work and rebuild clean technique (app default).';}
 }
 else if(mode==='milestone')reason='Cycle endpoint reached. Maintain, choose an available load, or select the supported next cycle explicitly.';
 const gapDays=defaults.reentryDays??14;
 if(opts.readiness==='low'){if(policy.durationScope==='total')reps=Math.max(30,Math.floor(reps*(defaults.recoveryFraction??.5)/30)*30);else if(policy.profile==='getupDrill'&&sets===1)reps=Math.max(1,Math.floor(reps*(defaults.recoveryFraction??.5)));else sets=Math.max(1,Math.ceil(sets*(defaults.recoveryFraction??.5)));mode='recovery';reason='Reduced readiness: less work, no advancement credit. '+reason;}
 if(opts.reentry||st.reviewRecovery||movementGap(s,id,opts.now)>gapDays){if(policy.durationScope==='total')reps=Math.min(reps,Math.max(30,Math.floor(st.reps*(defaults.reentryFraction??.7)/30)*30));else if(policy.profile==='getupDrill'&&sets===1)reps=Math.min(reps,Math.max(1,Math.floor(st.reps*(defaults.reentryFraction??.7))));else sets=Math.min(sets,Math.max(1,Math.floor(st.sets*(defaults.reentryFraction??.7))));mode='reentry';reason='Return after absence or review: reduced work; no advancement credit. '+reason;}
 const deloadEvery=defaults.deloadEvery??0;
 const eligible=records(s,id).filter(x=>successful(x)&&!['recovery','reentry','rebuild','deload'].includes(x.mode)).length;
 const sinceDeload=records(s,id).filter(x=>x.actualSets>0).findLastIndex(x=>x.mode==='deload'&&x.performed);
 if(deloadEvery>0&&eligible>0&&eligible%deloadEvery===0&&sinceDeload!==records(s,id).filter(x=>x.actualSets>0).length-1&&mode==='volume'){if(policy.durationScope==='total')reps=Math.max(30,Math.floor(reps*.5/30)*30);else if(policy.profile==='getupDrill'&&sets===1)reps=Math.max(1,Math.floor(reps*.5));else sets=Math.max(1,Math.floor(sets*.5));mode='deload';reason='Planned lighter exposure (app-configured interval); no progression credit.';}
 let blocked='';if(policy.profile==='pushup'&&reps<1)blocked='Enter a recent conservative clean-rep baseline in Settings before starting this source method.';const missing=prerequisites(s,id,opts);
 if(sets<1)blocked='No whole heavy set fits below the last light exposure. Choose a closer heavy weight or build the light cycle first.';
 if(missing.length)blocked='Prerequisites pending: '+missing.map(requirementLabel).join('; ');
 if(policy.profile==='wave'&&![policy.config.lightWeight,policy.config.heavyWeight].every(w=>(s.equipment?.[m.gear]||[]).includes(w)))blocked='A configured wave weight is no longer available. Review equipment and programming.';
 
 if(m.pair&&s.trainingPreferences?.useDoubleKb!==true)blocked='Confirm an available matched kettlebell pair at this weight in Settings.';
 if(st.hold)blocked=st.hold+' Resolve the review before resuming.';
 if(blocked){mode=st.hold?'review':'prerequisite';sets=0;reason=blocked;}
 const adapted=['baseline','recovery','reentry','rebuild','deload','review','prerequisite'].includes(mode);
 const sourceParameters=adapted?null:policy.exactParametersSource===411&&st.stagePhase==='density'?410:policy.exactParametersSource;
 const roundSeconds=policy.roundSeconds;
 const secondsPerSet=policy.timed?reps*(policy.durationScope==='total'?1:m.side):m.repSeconds?reps*m.side*m.repSeconds:m.sec;
 return{id,name:m.name,unit:m.unit,weight,sets,reps,rest,bodyweight:!!m.bodyweight,provenanceNote:policy.parameterNotes,continuous:policy.continuous,betweenExercises:policy.betweenExercises,durationScope:policy.durationScope,weakSide:policy.weakSide,side:m.side,timed:policy.timed,mode,reason,phase:st.phase,streak:st.streak,cycle:st.cycles,policyKey:policy.key,profile:policy.profile,track:st.track,roundSeconds,secondsPerSet,sourceIds:policy.principleSources,sourceParameters,exposureTarget:policy.exposures};
}
function chooseCycle(s,id,choice){
 const st=stateFor(s,id);
 if(st.hold||st.fail||st.phase!=='ready')throw Error('Complete a clean cycle and resolve any review first');
 if(choice!=='density'||!st.policy.density||st.stagePhase!=='volume')throw Error('This movement has no supported density transition');
 return {...s,cycleChoices:{...s.cycleChoices,[id]:{at:st.lastEligibleKey,type:choice}}};
}
function loadOptions(s,id){
 const st=stateFor(s,id),m=MOVES[id];
 if(m.bodyweight)return [];
 if(st.hold||st.fail||st.phase!=='ready')return [];
 const inventory=m.pair?s.equipment?.pairs:s.equipment?.[m.gear];
 // Inventory is optional in simplified setup; offer candidate increments, never claim they are owned.
 const candidates=[...new Set([...(LOADS[m.gear]||[]),...(Array.isArray(inventory)?inventory:[])])].sort((a,b)=>a-b);
 const cap=s.trainingDefaults?.maxLoadJump??.25;
 return candidates.filter(w=>Number.isFinite(w)&&w>st.weight&&w<=st.weight*(1+cap)).sort((a,b)=>a-b);
}
function selectLoad(s,id,weight){if(!loadOptions(s,id).includes(weight))throw Error('Load must be an available, permitted increment after a clean cycle. Adjust the configurable jump limit deliberately if needed.');if(stateFor(s,id).policy.profile==='wave')throw Error('Configure a new heavy/light pair in Settings instead.');return{...s,nextWeights:{...s.nextWeights,[id]:weight}};}
function minutesFor(p){const m=MOVES[p.id];return(p.sets*(p.roundSeconds||((p.secondsPerSet??m.sec)+Math.max(0,p.rest)))/60)+.55;}
function timeBudget(minutes){
 const total=Number.isFinite(Number(minutes))?Number(minutes):45;
 if(!Number.isInteger(total)||total<15||total>120)throw Error('Workout duration must be 15–120 minutes');
 const warmup=total<=20?4:total<=35?5:total<=60?7:10;
 const cooldown=total<=20?3:total<=35?4:total<=60?7:10;
 return {total,warmup,cooldown,main:total-warmup-cooldown};
}
const BLOCKS={
 hingePathway:{name:'Kettlebell hinge foundation',days:[{name:'Unloaded to loaded hinge',focus:'Reviewed deadlift technique with recent unloaded practice',ids:['deadlift']}]},
 groundPractice:{name:'Bodyweight ground foundations',days:[{name:'Ground support and transitions',focus:'Controlled hip drops and bear squats; no equipment needed',ids:['hipDropTwoHand','hipDropSingleHand','bearSquat']}]},
 hingePractice:{name:'Unloaded hinge foundation',days:[{name:'Hip-hinge preparation',focus:'Unloaded teaching example; no equipment needed',ids:['hingePractice']}]},
 pushup:{name:'Push-up volume block',days:[{name:'Push-up EMOM volume',focus:'Conservative clean baseline; explicit review at cycle endpoint',ids:['pushup']}]},
 abc:{name:'Rolling A / B / C',days:DAYS},
 snatch:{name:'Snatch EMOM block',days:[{name:'Snatch volume / density',focus:'Opt-in source example; familiar technique required',ids:['snatch']}]},
 double:{name:'Double-kettlebell strength block',days:[{name:'Double clean and press / front squat',focus:'Source #366 strength example; confirmed matched pair required',ids:['doublePress','doubleSquat']}]},
 getupPractice:{name:'Get-up breakdown practice',days:[{name:'Floor / Elbow / Hand / Hip pass',focus:'Reviewed skills plus recent clean practice; no automatic technique certification',ids:['getupFloor','getupElbow','getupHand','getupHipPass']}]},
 clubIntermediate:{name:'Single-arm club intermediate pathways',days:[{name:'Pendulums and pullovers',focus:'Supporting practice and reviewed skill confirmations required',ids:['clubInsidePendulum','clubOutsidePendulum','clubFrontPullover','clubOutsidePullover','clubInsidePullover']}]},
 getup:{name:'Get-up time-under-load block',days:[{name:'Alternating Turkish get-ups',focus:'Familiar complete single reps; total time under load',ids:['getup']}]},
 singleClub:{name:'Single-arm club foundation block',days:[{name:'Inside / Outside / Shield',focus:'Continuous volume within each movement; breaks between movements',ids:['clubInside','clubOutside','clubShield']}]},
 club:{name:'Two-hand club practice block',days:[{name:'Two-hand club patterns',focus:'Familiar club patterns; choose timed profiles in Settings',ids:['front','cast','circles']}]}
};
const DEMANDS={ground:['lower','shoulder'],getup:['lower','shoulder','grip'],hinge:['lower','grip'],squat:['lower'],press:['shoulder','grip'],pull:['shoulder','grip'],carry:['grip'],rotation:['shoulder','grip']};
function movementDemands(id){return [...(DEMANDS[MOVES[id]?.family]||[])];}
function calendarDay(value){const text=typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?value:new Date(value??Date.now()).toLocaleDateString('sv-SE');return Date.parse(text+'T12:00:00Z')/86400000;}
function trainingPaused(s,now){const day=typeof now==='string'?now:new Date(now??Date.now()).toLocaleDateString('sv-SE');return !!s.paused&&(!s.pauseStarted||day>=s.pauseStarted)&&(!s.pauseUntil||day<s.pauseUntil);}
function activityRecovery(a){
 // Conservative app planning heuristic, not physiological or strength equivalence.
 if(a.effort==='hard')return 2;
 if(a.effort==='moderate')return ['trail','labor'].includes(a.type)&&a.duration>=60||a.type==='mountain'&&a.duration>=90?2:1;
 return a.duration>=120?1:0;
}
function validateActivity(a){
 const types=['mountain','gravel','road','indoor','hiking','trail','labor','other'];
 if(!a||typeof a!=='object'||typeof a.id!=='string'||!a.id||!types.includes(a.type)||!['planned','completed'].includes(a.status)||!['easy','moderate','hard'].includes(a.effort)||!Number.isFinite(a.duration)||a.duration<=0||a.duration>1440||typeof a.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(a.date)||!Number.isFinite(Date.parse(a.date+'T12:00:00Z'))||new Date(a.date+'T12:00:00Z').toISOString().slice(0,10)!==a.date)throw Error('Invalid activity');
 for(const key of ['distance','elevation'])if(a[key]!==undefined&&(!Number.isFinite(a[key])||a[key]<0))throw Error('Invalid activity measurement');
 if(a.notes!==undefined&&typeof a.notes!=='string'||a.replacesStrength!==undefined&&typeof a.replacesStrength!=='boolean')throw Error('Invalid activity details');
 if(a.versions!==undefined){if(!Array.isArray(a.versions)||a.versions.length>1000)throw Error('Invalid activity versions');for(const v of a.versions){if(!v||typeof v.at!=='string'||!Number.isFinite(Date.parse(v.at))||v.before?.versions!==undefined)throw Error('Invalid activity version');validateActivity(v.before);}}
 return a;
}
function blockPlan(s,opts={}){
 const block=s.programBlock||'abc';if(!BLOCKS[block])throw Error('Unknown program block');
 const preferences=s.trainingPreferences||{};
 const originalDays=BLOCKS[block].days;
 const abcDays=block==='abc'?originalDays.map((d,i)=>{
  if(i!==2)return d;
  if(preferences.useKb!==false&&preferences.useDoubleKb===true&&s.skills?.rack===true&&s.skills?.doublePress===true&&s.skills?.doubleSquat===true&&((s.sessions||[]).filter(x=>(x.items||[]).some(y=>y.actualSets>0)).length%6===2))return {name:'C · Double kettlebell strength',focus:'Matched-pair strength practice',ids:['doublePress','doubleSquat']};
  if(preferences.conditioning!==false&&preferences.useKb!==false&&s.skills?.overhead===true&&s.skills?.swing===true&&s.skills?.clean===true&&((s.sessions||[]).filter(x=>(x.items||[]).some(y=>y.actualSets>0)).length%6===5))return {name:'C · Snatch EMOM',focus:'Optional conditioning and skill density',ids:['snatch']};
  if(preferences.skillSessions===false)return {name:'C · Strength practice',focus:'Repeat established fundamentals',ids:['clean','front','squat']};
  return d;
 }):originalDays;
 const days=abcDays,slot=(s.sessions||[]).filter(x=>x.slot!==undefined&&(x.block||'abc')===block&&(x.notebookVersion!==1||(x.items||[]).some(y=>y.actualSets>0))&&(x.calendarVersion!==1||(x.items||[]).every(y=>y.performed===true))).length%days.length;
 let day=days[slot];
 const budget=timeBudget(opts.minutes??s.defaultMinutes??45),defaults=s.trainingDefaults||{};
 const pref=s.trainingPreferences||{};
 const enabled=id=>{const m=MOVES[id];if(!m)return false;if(m.bodyweight)return pref.useBodyweight!==false;if(m.gear==='kb')return pref.useKb!==false&&(!m.pair||pref.useDoubleKb===true);if(m.gear==='club')return pref.useClub!==false&&(!['cast','circles','front'].includes(id)||pref.useTwoHandClub!==false);return true;};
 if(block==='abc'){
  const fallback=pref.useKb!==false?['squat','press','row']:pref.useClub!==false?(pref.useTwoHandClub!==false?['front','circles','cast']:['clubInside','clubOutside']):['pushup','bearSquat','hingePractice'];
  if(!day.ids.some(enabled))day={name:pref.useKb!==false?'Strength fundamentals':pref.useClub!==false?'Club fundamentals':'Bodyweight fundamentals',focus:'Equipment-compatible foundation practice',ids:fallback.filter(enabled)};
 }
 const blockIds=days.flatMap(x=>x.ids),support=supportingMoves(s,blockIds,opts);
 const allowed=new Set([...blockIds,...support]),pending=s.deferredByBlock?.[block]||(block==='abc'?s.deferredIds:[])||[];
 const latest=(s.sessions||[]).filter(x=>(x.block||'abc')===block).at(-1);
 const continuing=latest?.calendarVersion===1&&latest.items.some(x=>x.actualSets>0)&&latest.items.some(x=>!x.performed)&&pending.length>0;
 const candidateIds=[...new Set([...support,...pending.filter(id=>allowed.has(id)),...(continuing?[]:day.ids)])].filter(enabled);
 const focus=pref.focus||'balanced',variety=pref.variety||'moderate';
 const scored=id=>{const m=MOVES[id];if(!m)return 0;const family=m.family||'';return focus==='strength'?(['squat','press','pull','hinge'].includes(family)?2:0):focus==='capacity'?(['hinge','carry'].includes(family)?2:0):focus==='skill'?((m.practicePrereqs||[]).length?2:0):0;};
 const ids=[...candidateIds].sort((a,b)=>scored(b)-scored(a));
 if(variety==='high'&&block==='abc'&&pref.skillSessions!==false){const alternatives=slot===0?['pushup','deadlift']:slot===1?['circles','clean']:['row','press'];for(const id of alternatives){if(enabled(id)&&!ids.includes(id)&&!ids.some(x=>MOVES[x]?.family===MOVES[id]?.family)){ids.push(id);break;}}}

 const items=[],deferred=[],held=[],unavailable=[],prerequisite=[],requirements=[],scheduled=[];let used=0,hard=0;
 const today=calendarDay(opts.now),history=(s.sessions||[]).filter(x=>calendarDay(x.date)<=today);
 const trainingDays=new Set(history.filter(x=>today-calendarDay(x.date)<7&&(x.items||[]).some(y=>y.actualSets>0)).map(x=>x.date));
 const alreadyToday=history.some(x=>calendarDay(x.date)===today&&(x.items||[]).some(y=>y.actualSets>0));
 const restDay=!alreadyToday&&trainingDays.size>=(defaults.maxTrainingDays??6);
 for(const id of ids){
  if(!MOVES[id])continue;
  if(trainingPaused(s,opts.now)){deferred.push(id);continue;}
  
  if(stateFor(s,id).hold){held.push(id);deferred.push(id);continue;}
  const lastTraining=history.filter(x=>(x.items||[]).some(y=>y.actualSets>0)).sort((a,b)=>a.date.localeCompare(b.date)).at(-1);
  const pauseReturn=!!s.pauseStarted&&lastTraining&&lastTraining.date<=s.pauseStarted&&today-calendarDay(lastTraining.date)>(defaults.reentryDays??14);
  const rx=prescription(s,id,{...opts,reentry:opts.reentry||pauseReturn});
  if(rx.mode==='prerequisite'){prerequisite.push(id);requirements.push({id,reason:rx.reason});deferred.push(id);continue;}
  const demands=movementDemands(id);
  const recent=history.some(x=>today-calendarDay(x.date)<(defaults.minGapDays??0)&&(x.items||[]).some(y=>y.actualSets>0&&MOVES[y.id]&&movementDemands(y.id).some(d=>demands.includes(d))));
  const isHard=rx.track==='heavy'||rx.profile==='grind'||rx.mode==='density';
  const outside=(s.activities||[]).some(a=>a.status==='completed'&&calendarDay(a.date)<=today&&(today-calendarDay(a.date)<activityRecovery(a)||a.replacesStrength!==false&&today===calendarDay(a.date)));
  const repeat=s.trainingPreferences?.beginnerSpacing&&history.some(x=>today-calendarDay(x.date)<2&&(x.items||[]).some(y=>y.id===id&&y.actualSets>0));
  if(outside||repeat||restDay||recent||(isHard&&opts.avoidHard)||(isHard&&hard>=(defaults.maxHardMovements??3))){scheduled.push(id);deferred.push(id);continue;}
  const cost=minutesFor(rx)+(items.length?(items.at(-1).betweenExercises||0)/60:0);
  if(used+cost>budget.main+1e-8){deferred.push(id);continue;}
  items.push(rx);used+=cost;if(isHard)hard++;
 }
 return{block,slot,day:continuing?{...day,name:day.name+' · remaining work'}:day,support,items,deferred,held,unavailable,prerequisite,requirements,scheduled,restDay,paused:trainingPaused(s,opts.now),estimated:Math.ceil(used),total:Math.ceil(used)+budget.warmup+budget.cooldown,reentry:items.some(x=>x.mode==='reentry'),cap:budget.main,budget};
}
// Coordinate independent blocks across workouts; never blend their numeric protocols.
function plan(s,opts={}){
 const c=s.programComposition;
 if(!c?.enabled)return blockPlan(s,opts);
 validateComposition(c);
 const day=calendarDay(opts.now),history=(s.sessions||[]).filter(x=>calendarDay(x.date)<=day).sort((a,b)=>calendarDay(a.date)-calendarDay(b.date));
 const hardRecent=history.some(x=>day-calendarDay(x.date)<(c.hardGapDays??2)&&(x.items||[]).some(y=>y.actualSets>0&&(y.track==='heavy'||y.profile==='grind'||y.mode==='density')));
 const defaults={...s.trainingDefaults,minGapDays:Math.max(s.trainingDefaults?.minGapDays??0,c.minGapDays??1)};
 const candidates=c.blocks.map((block,order)=>{
  const last=history.findLastIndex(x=>(x.block||'abc')===block&&(x.items||[]).some(y=>y.actualSets>0));
  const p=blockPlan({...s,programBlock:block,trainingDefaults:defaults},{...opts,avoidHard:hardRecent});
  return {block,order,last,p};
 }).sort((a,b)=>a.last-b.last||a.order-b.order);
 const latest=history.at(-1),unfinished=latest?.calendarVersion===1&&latest.items.some(x=>x.actualSets>0)&&latest.items.some(x=>!x.performed)?candidates.find(x=>x.block===(latest.block||'abc')&&x.p.items.length):null;
 const chosen=unfinished||candidates.find(x=>x.p.items.length)||candidates[0],p=chosen.p;
 const recovery=p.items.some(x=>['recovery','reentry','rebuild','deload'].includes(x.mode));
 const skill=p.support.length>0||['getupPractice','clubIntermediate','groundPractice','hingePractice','hingePathway'].includes(p.block);
 const intensity=p.items.some(x=>x.track==='heavy'||x.profile==='grind'||x.mode==='density');
 const emphasis=recovery?'Recovery':skill?'Skill practice':intensity?'Intensity':'Volume';
 const pending=s.deferredByBlock?.[p.block]||[];
 // Observed cadence is planning feedback, never a progression or medical rule.
 const trainingDays=[...new Set(history.filter(x=>day-calendarDay(x.date)<56&&(x.items||[]).some(y=>y.actualSets>0)).map(x=>calendarDay(x.date)))].sort((a,b)=>a-b);
 const estimatedReturnDays=trainingDays.length>=4?Math.ceil((trainingDays.at(-1)-trainingDays[0])/(trainingDays.length-1)*c.blocks.length):null;
 const absenceDays=s.trainingDefaults?.reentryDays??14;
 const cadence={sampleDays:trainingDays.length,estimatedReturnDays,absenceDays,warning:estimatedReturnDays!==null&&estimatedReturnDays>absenceDays?'At your recent training frequency, revisiting every selected block may take longer than the absence window. Consider fewer active blocks; do not add catch-up work.':null};
 const reason=!p.items.length?'All selected blocks are currently blocked or do not fit. Review the reasons below.':
  (unfinished?'Continue the last unfinished workout before later blocks.':chosen.last<0?'This selected block has not yet been practiced.':'This is the least recently practiced selected block that is ready and fits today.')+
  (pending.length?' Unfinished movements are considered first within this block.':'')+
  (p.support.length?' Supporting foundation practice is included to regain eligibility.':'');
 const status=x=>x.p.items.length?'Ready':x.p.paused?'Paused':x.p.held.length?'Pain review':x.p.scheduled.length?'Recovery schedule':x.p.prerequisite.length?'Prerequisites':x.p.unavailable.length?'Equipment':'Needs more time';
 return {...p,composition:{emphasis,reason,hardRecent,cadence,candidates:candidates.map(x=>({block:x.block,status:status(x)})),sourceIds:[548,578],provenance:'Block selection, spacing and priority are configurable Strength Lab defaults; source methods remain independent.'}};
}
function validateComposition(c){
 if(!c||typeof c!=='object'||Array.isArray(c)||typeof c.enabled!=='boolean'||!Array.isArray(c.blocks)||!c.blocks.length||c.blocks.length>Object.keys(BLOCKS).length||new Set(c.blocks).size!==c.blocks.length||c.blocks.some(id=>!Object.hasOwn(BLOCKS,id)))throw Error('Select unique known training blocks');
 for(const key of ['minGapDays','hardGapDays'])if(c[key]!==undefined&&(!Number.isInteger(c[key])||c[key]<0||c[key]>7))throw Error('Composition spacing must be 0–7 days');
}
function deferredAfter(plan,records){const pending=new Set(plan.deferred||[]);for(const record of records){if(!(record.performed??record.completed))pending.add(record.id);else pending.delete(record.id);}return [...pending];}
function completeRecord(rx,actual,quality,pain){
 const sets=(actual||[]).filter(x=>x.done&&!x.skipped),totalTime=rx.durationScope==='total';
 const valid=x=>validWorkingWeight(rx.id,x.weight)&&Number.isInteger(Number(x.reps))&&Number(x.reps)>0;
 const reps=sets.length?Math.min(...sets.map(x=>totalTime?Number(x.reps)||0:rx.side===2?Math.min(Number(x.leftReps??x.reps)||0,Number(x.rightReps??x.reps)||0):Number(x.reps)||0)):0;
 const weight=sets.length?Number(sets[0].weight):Number(rx.weight),sameLoad=sets.every(x=>Number(x.weight)===weight);
 const bilateral=rx.side!==2||sets.every(x=>{
  if(x.bothSides!==true)return false;
  const left=Number(x.leftReps??(totalTime?0:x.reps)),right=Number(x.rightReps??(totalTime?0:x.reps));
  if(!Number.isInteger(left)||!Number.isInteger(right)||left<=0||right<=0)return false;
  if(!totalTime)return left===right;
  const weak=rx.weakSide==='right'?right:left,strong=rx.weakSide==='right'?left:right;
  return weak>=strong&&weak-strong<=1;
 });
 const exactIntensity=rx.sourceParameters===null||rx.sourceParameters===undefined||sets.length===rx.sets&&(totalTime||sets.every(x=>Number(x.reps)===rx.reps&&(rx.side!==2||Number(x.leftReps??x.reps)===rx.reps&&Number(x.rightReps??x.reps)===rx.reps)));
 const cadence=(!rx.roundSeconds||sets.every(x=>x.timingValid===true))&&sets.every(x=>(x.restSeconds===undefined||x.restSeconds===rx.rest)&&(x.roundSeconds===undefined||x.roundSeconds===(rx.roundSeconds||0))); 
 const continuous=!rx.continuous||sets.every(x=>x.continuous===true);
 const performed=!rx.legacyTargetUnverified&&cadence&&continuous&&!['review','prerequisite'].includes(rx.mode)&&sets.length>0&&sets.length>=rx.sets&&sets.every(valid)&&reps>=rx.reps&&sameLoad&&bilateral&&!['hard','breakdown','pain'].includes(quality)&&!pain;
 return{id:rx.id,name:rx.name,weight,bodyweight:!!MOVES[rx.id]?.bodyweight,unit:rx.unit,actualSets:sets.length,actualReps:reps,targetSets:rx.sets,targetReps:rx.reps,rest:rx.rest,quality,pain:!!pain,mode:rx.mode,policyKey:rx.policyKey||'legacy-v1',profile:rx.profile||'legacy',track:rx.track||'base',roundSeconds:rx.roundSeconds||null,continuous:!!rx.continuous,durationScope:rx.durationScope||null,weakSide:rx.weakSide||null,sourceIds:rx.sourceIds||[],sourceParameters:rx.sourceParameters??null,exposureTarget:rx.exposureTarget??2,performed,completed:performed&&quality==='clean'&&exactIntensity&&weight===Number(rx.weight)&&!['baseline','recovery','reentry','time-fit','review','rebuild','deload','prerequisite'].includes(rx.mode),sets:actual};
}
function nextRest(plan,items,index){
 const rx=plan.items[index];if(!items.some(item=>item.sets.some(set=>!set.done)))return null;
 if(rx.continuous){if(items[index].sets.some(set=>!set.done))return null;return rx.betweenExercises?{seconds:rx.betweenExercises,label:'Rest between movements'}:null;}
 return{seconds:rx.rest,label:'Rest'};
}
function describeProgression(id,s={}){
 const p=policyFor(id,s),m=MOVES[id];
 if(p.profile==='deadliftPractice')return p.parameterNotes+' Practice '+p.volume.start+'–'+p.volume.end+' sets of '+p.volume.reps+'; load changes require explicit review after a clean cycle.';
 if(p.profile==='ground')return p.parameterNotes+' Practice '+p.volume.start+'–'+p.volume.end+' sets of '+p.volume.reps+(p.timed?' seconds.':' per side.');
 if(p.profile==='pushup')return 'Reviewed #609 method: 10–30 one-minute rounds, with '+(p.config.fraction??.4)*100+'% of a conservative clean-rep baseline, rounded down by the app. Review a new baseline explicitly at the endpoint; no daily maximum tests.';
 if(p.profile==='hingePractice')return 'Unloaded 2–3 sets of 10 from #704. Rest, pace estimates and promotion gates are app defaults; this is hinge preparation, not weighted deadlift progression.';
 if(p.profile==='getupDrill')return 'Practice '+m.name+' at 1 set of 3–'+m.practiceRepEnd+' per side. '+(m.practiceSourceNumbers?'The light-load rep pathway is discussed in #372; sets/rest/gates are app defaults.':'Teaching is source-linked; rep/set/rest targets are app defaults.')+' Supporting practice gates do not certify the next technique.';
 if(p.profile==='clubIntermediate')return 'Intermediate single-arm practice: '+p.volume.start+'–'+p.volume.end+' sets of '+p.volume.reps+' per side, continuous within a movement. Exact targets and evidence gates are app defaults; reviewed teaching and the general method are source-linked.';
 if(p.profile==='getup')return 'Alternate familiar single get-ups from 3 to 10 total minutes under load, in '+(p.config.stepSeconds??60)+'-second steps (#423/#658). Exposure gates are app defaults. Advanced multi-rep sets are not automatically assigned.';
 if(p.profile==='singleClub')return 'Build 4–20 sets of 5 per side without resting within a movement (#578); take a two-minute example break between movements (#581). Pendulums, pullovers and mills are later pathways, not automatically unlocked here.';
 return p.label+': '+p.volume.start+'–'+p.volume.end+' sets of '+p.volume.reps+(p.timed?' seconds.':'.')+' Promotion and recovery gates are app settings.';
}
function validWorkingWeight(id,value){const weight=Number(value);return Number.isFinite(weight)&&(MOVES[id]?.bodyweight?weight===0:weight>0);}
function retestPushup(s,baseline){const current=s.programming?.pushup||{};return configureMovement(s,'pushup',{...current,profile:'pushup',cleanBaseline:baseline,cycleRevision:(current.cycleRevision||0)+1});}
function validateProgramming(s){
 if(s.trainingPreferences!==undefined){const p=s.trainingPreferences;if(!p||typeof p!=='object'||!Number.isInteger(p.daysPerWeek)||p.daysPerWeek<1||p.daysPerWeek>7||p.beginnerSpacing!==undefined&&typeof p.beginnerSpacing!=='boolean'||p.activityTypes!==undefined&&(!Array.isArray(p.activityTypes)||p.activityTypes.some(x=>!['mountain','gravel','road','indoor','hiking','trail','labor','other'].includes(x))))throw Error('Invalid training setup');}
 for(const key of ['pauseUntil','resumeDate','pauseStarted'])if(s[key]!==undefined&&s[key]!==null&&(typeof s[key]!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s[key])||!Number.isFinite(Date.parse(s[key]+'T12:00:00Z'))||new Date(s[key]+'T12:00:00Z').toISOString().slice(0,10)!==s[key]))throw Error('Invalid pause date');
 if(s.calendarMoves!==undefined){if(!s.calendarMoves||typeof s.calendarMoves!=='object'||Array.isArray(s.calendarMoves))throw Error('Invalid calendar moves');for(const [key,value] of Object.entries(s.calendarMoves))if(key.length>300||typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value+'T12:00:00Z'))||new Date(value+'T12:00:00Z').toISOString().slice(0,10)!==value)throw Error('Invalid moved date');}
 if(s.activities!==undefined){if(!Array.isArray(s.activities))throw Error('Invalid activities');const ids=new Set();for(const a of s.activities){validateActivity(a);if(ids.has(a.id))throw Error('Duplicate activity');ids.add(a.id);}}

 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 for(const [id,weight] of Object.entries({...s.weights,...s.nextWeights}))if(MOVES[id]?.bodyweight&&weight!==0)throw Error('Bodyweight profiles use zero external load');
 if(s.learnedMovements!==undefined&&(!object(s.learnedMovements)||Object.entries(s.learnedMovements).some(([id,value])=>!Object.hasOwn(MOVES,id)||typeof value!=='boolean')))throw Error('Invalid learning confirmation');
 if(s.timerMode!==undefined&&!['manual','automatic','hybrid'].includes(s.timerMode))throw Error('Invalid workout timer preference');
 if(s.programComposition!==undefined)validateComposition(s.programComposition);
 if(s.programBlock!==undefined&&!Object.hasOwn(BLOCKS,s.programBlock))throw Error('Invalid program block');
 if(s.programming!==undefined){if(!object(s.programming))throw Error('Invalid programming settings');for(const id of Object.keys(s.programming)){if(!object(s.programming[id]))throw Error('Invalid movement settings');policyFor(id,s);}}
 if(s.skills!==undefined&&(!object(s.skills)||Object.values(s.skills).some(x=>typeof x!=='boolean')))throw Error('Invalid prerequisite confirmations');
 if(s.cycleChoices!==undefined){if(!object(s.cycleChoices))throw Error('Invalid cycle choices');for(const [id,choice] of Object.entries(s.cycleChoices))if(!Object.hasOwn(MOVES,id)||!object(choice)||choice.type!=='density'||typeof choice.at!=='string')throw Error('Invalid cycle choice');}
 if(s.deferredByBlock!==undefined){if(!object(s.deferredByBlock))throw Error('Invalid pending blocks');for(const [block,ids] of Object.entries(s.deferredByBlock))if(!Object.hasOwn(BLOCKS,block)||!Array.isArray(ids)||ids.some(id=>!Object.hasOwn(MOVES,id)))throw Error('Invalid pending movements');}
 const ranges={skillExposures:[1,6],minGapDays:[0,7],maxTrainingDays:[1,7],maxHardMovements:[1,12],reentryDays:[1,180],deloadEvery:[0,100]};
 if(s.trainingDefaults!==undefined){if(!object(s.trainingDefaults))throw Error('Invalid training defaults');for(const [key,value] of Object.entries(s.trainingDefaults)){if(Object.hasOwn(ranges,key)){const [lo,hi]=ranges[key];if(!Number.isInteger(value)||value<lo||value>hi)throw Error('Invalid '+key);}else if(['maxLoadJump','recoveryFraction','reentryFraction'].includes(key)){if(!Number.isFinite(value)||value<=0||value>1)throw Error('Invalid '+key);}else throw Error('Unknown training default');}}
 if(s.equipment?.pairs!==undefined&&(!Array.isArray(s.equipment.pairs)||s.equipment.pairs.some(w=>!Number.isFinite(w)||w<=0||!s.equipment.kb.includes(w))))throw Error('Matched pairs must be owned kettlebell weights');
 return s;
}
function validateDraft(d,s){
 if(d===undefined||d===null)return null;
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x),number=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
 if(d.notebookVersion!==undefined&&d.notebookVersion!==1)throw Error('Unsupported notebook draft');
 if(!object(d)||!['warmup','work','cooldown'].includes(d.stage)||typeof d.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||typeof d.started!=='string'||!Number.isFinite(Date.parse(d.started))||!object(d.plan)||!object(d.plan.day)||typeof d.plan.day.name!=='string'||!object(d.plan.budget)||!number(d.plan.cap)||!Array.isArray(d.plan.items)||!d.plan.items.length||!Array.isArray(d.items)||d.items.length!==d.plan.items.length)throw Error('Invalid workout draft');
 timeBudget(d.plan.budget.total);
 for(const key of ['warmup','cooldown','main'])if(!number(d.plan.budget[key]))throw Error('Invalid draft budget');
 if(d.id!==undefined&&typeof d.id!=='string')throw Error('Invalid draft identity');
 if(d.id&&(s.sessions||[]).some(session=>session.draftId===d.id))throw Error('This draft is already saved as a workout');
 if(d.finishChoice!==undefined&&!['all','modified','partial'].includes(d.finishChoice))throw Error('Invalid finish choice');
 if(d.originalPlan!==undefined)validatePlanMetadata(d.originalPlan);
 if(d.adjustments!==undefined)validateAdjustments(d.adjustments);
 if(d.notes!==undefined&&typeof d.notes!=='string')throw Error('Invalid draft notes');
 if(d.plan.block!==undefined&&!Object.hasOwn(BLOCKS,d.plan.block))throw Error('Invalid draft block');
 for(let i=0;i<d.items.length;i++){
  const rx=d.plan.items[i],item=d.items[i],m=MOVES[rx?.id];
  if(!object(rx)||!Object.hasOwn(MOVES,rx.id)||rx.name!==m.name||rx.unit!==m.unit||rx.side!==m.side||!Number.isInteger(rx.sets)||rx.sets<1||rx.sets>200||!Number.isInteger(rx.reps)||rx.reps<1||!number(rx.weight)||!number(rx.rest)||!object(item)||item.id!==rx.id||!['clean','minor','hard','breakdown','pain'].includes(item.quality)||typeof item.pain!=='boolean'||!Array.isArray(item.sets)||(d.notebookVersion===1?item.sets.length>200:item.sets.length!==rx.sets))throw Error('Invalid draft prescription');
  if(m.bodyweight&&rx.weight!==0)throw Error('Invalid bodyweight draft');
  if(rx.profile!==undefined&&!availableProfiles(rx.id).includes(rx.profile))throw Error('Invalid draft profile');
  if(rx.profile!==undefined){const policy=policyFor(rx.id,s);if(rx.profile!==policy.profile||rx.policyKey!==undefined&&rx.policyKey!==policy.key||!!rx.bodyweight!==!!m.bodyweight||!!rx.continuous!==policy.continuous||(rx.durationScope||null)!==policy.durationScope||(rx.roundSeconds||null)!==policy.roundSeconds)throw Error('Draft does not match its programming');}
  if(rx.sourceIds!==undefined&&(!Array.isArray(rx.sourceIds)||rx.sourceIds.some(id=>!Number.isInteger(id)||id<0||id>719)))throw Error('Invalid draft sources');
  for(const set of item.sets){
   if(!object(set)||!number(set.weight)||!Number.isInteger(set.reps)||set.reps<0||typeof set.done!=='boolean'||m.bodyweight&&set.weight!==0)throw Error('Invalid draft set');
   for(const key of ['bothSides','continuous','timingValid','skipped'])if(set[key]!==undefined&&typeof set[key]!=='boolean')throw Error('Invalid draft confirmation');
   for(const key of ['restSeconds','roundSeconds','transitionSeconds'])if(set[key]!==undefined&&!number(set[key]))throw Error('Invalid actual timing');
   if(set.note!==undefined&&typeof set.note!=='string')throw Error('Invalid actual note');
   for(const key of ['leftReps','rightReps'])if(set[key]!==undefined&&(!Number.isInteger(set[key])||set[key]<0))throw Error('Invalid draft side counts');
  }
 }
 if(d.clock!==undefined&&d.clock!==null&&(!object(d.clock)||typeof d.clock.label!=='string'||typeof d.clock.running!=='boolean'||!number(d.clock.remaining)||d.clock.running&&!number(d.clock.endAt)))throw Error('Invalid draft clock');
 if(d.calendarVersion!==undefined&&d.calendarVersion!==1)throw Error('Invalid calendar version');
 if(d.timerVersion!==undefined&&d.timerVersion!==3)throw Error('Invalid timer version');
 if(d.timerMode!==undefined&&!['manual','automatic','hybrid'].includes(d.timerMode))throw Error('Invalid draft timer mode');
 const maxCursor=d.plan.items.reduce((n,rx)=>n+rx.sets*2,0);
 if(d.timerIndex!==undefined&&(!Number.isInteger(d.timerIndex)||d.timerIndex<0||d.timerIndex>maxCursor))throw Error('Invalid timer position');
 if(d.clock){const c=d.clock;
  if(c.kind!==undefined&&!['warmup','work','rest','cooldown','complete'].includes(c.kind))throw Error('Invalid timer kind');
  for(const key of ['sequence','awaitConfirmation','completed','estimated','untimed'])if(c[key]!==undefined&&typeof c[key]!=='boolean')throw Error('Invalid timer state');
  if(c.cursor!==undefined&&(!Number.isInteger(c.cursor)||c.cursor<0||c.cursor>maxCursor))throw Error('Invalid interval cursor');
  if(c.startedAt!==undefined&&!number(c.startedAt))throw Error('Invalid interval start');
 }
 return d;
}
function validatePlanMetadata(p){
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x),num=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
 if(!object(p)||!object(p.day)||typeof p.day.name!=='string'||typeof p.day.focus!=='string'||!object(p.budget)||!Array.isArray(p.items)||p.items.length>Object.keys(MOVES).length||!num(p.cap))throw Error('Invalid recorded plan');
 timeBudget(p.budget.total);for(const key of ['warmup','cooldown','main'])if(!num(p.budget[key]))throw Error('Invalid recorded budget');
 const ids=new Set();for(const rx of p.items){const m=MOVES[rx?.id];if(!m||ids.has(rx.id)||rx.name!==m.name||rx.unit!==m.unit||rx.side!==m.side||!Number.isInteger(rx.sets)||rx.sets<1||rx.sets>200||!Number.isInteger(rx.reps)||rx.reps<1||!num(rx.weight)||!num(rx.rest)||m.bodyweight&&rx.weight!==0)throw Error('Invalid written prescription');ids.add(rx.id);}
}
function validateAdjustments(a){if(!a||typeof a!=='object'||Array.isArray(a)||!Array.isArray(a.changes)||a.changes.some(x=>typeof x!=='string')||!['normal','low','great'].includes(a.readiness))throw Error('Invalid adjustment record');timeBudget(a.normalMinutes);timeBudget(a.minutes);}
function validateNotebookRecord(item){
 const rx=item.prescription,m=MOVES[item.id],num=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
 if(!rx||rx.id!==item.id||rx.name!==m.name||rx.unit!==m.unit||rx.side!==m.side||!Number.isInteger(rx.sets)||rx.sets<1||rx.sets>200||!Number.isInteger(rx.reps)||rx.reps<1||!num(rx.weight)||!num(rx.rest)||!Array.isArray(item.sets)||item.sets.length>200)throw Error('Invalid recorded notebook prescription');
 if(rx.bodyweight!==undefined&&rx.bodyweight!==!!m.bodyweight||m.bodyweight&&rx.weight!==0)throw Error('Invalid notebook load');
 if(rx.roundSeconds!==null&&rx.roundSeconds!==undefined&&!num(rx.roundSeconds))throw Error('Invalid recorded interval');
 for(const set of item.sets){if(!set||typeof set!=='object'||typeof set.done!=='boolean'||!Number.isInteger(set.reps)||set.reps<0||!num(set.weight)||m.bodyweight&&set.weight!==0)throw Error('Invalid recorded actual set');
  for(const k of ['done','bothSides','continuous','timingValid','skipped'])if(set[k]!==undefined&&typeof set[k]!=='boolean')throw Error('Invalid recorded confirmation');
  for(const k of ['leftReps','rightReps'])if(set[k]!==undefined&&(!Number.isInteger(set[k])||set[k]<0))throw Error('Invalid recorded side count');
  for(const k of ['restSeconds','roundSeconds','transitionSeconds'])if(set[k]!==undefined&&!num(set[k]))throw Error('Invalid recorded timing');
 }
 const derived=completeRecord(rx,item.sets,item.quality,item.pain);
 for(const k of ['actualSets','actualReps','weight','targetSets','targetReps','rest','performed','completed'])if(item[k]!==derived[k])throw Error('Recorded actuals disagree with progression evidence');
 if(item.note!==undefined&&typeof item.note!=='string')throw Error('Invalid movement note');
}
function validateBackup(input){
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 if(!object(input)||input.version!==33||!Array.isArray(input.sessions)||!object(input.weights)||!object(input.equipment))throw Error('Not a V33 backup');
 for(const gear of ['kb','club'])if(!Array.isArray(input.equipment[gear])||input.equipment[gear].some(x=>!Number.isFinite(x)||x<=0))throw Error('Invalid equipment');
 for(const map of [input.weights,input.nextWeights||{}]){
  if(!object(map))throw Error('Invalid working weights');
  for(const [id,weight] of Object.entries(map))if(!Object.hasOwn(MOVES,id)||!Number.isFinite(weight)||weight<0)throw Error('Invalid working weights');
 }
 const sessionIds=new Set(),draftIds=new Set();
 for(const session of input.sessions){
  if(!object(session)||typeof session.id!=='string'||typeof session.title!=='string'||typeof session.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(session.date)||!Array.isArray(session.items))throw Error('Invalid training entry');
  if(session.plan!==undefined)validatePlanMetadata(session.plan);
  if(session.originalPlan!==undefined)validatePlanMetadata(session.originalPlan);
  if(session.adjustments!==undefined&&session.adjustments!==null)validateAdjustments(session.adjustments);
  if(session.notes!==undefined&&typeof session.notes!=='string')throw Error('Invalid workout notes');
  if(session.calendarVersion!==undefined&&session.calendarVersion!==1)throw Error('Invalid calendar history version');
  if(session.notebookVersion!==undefined&&session.notebookVersion!==1)throw Error('Unsupported notebook history');
  if(session.finishOutcome!==undefined&&!['complete','partial'].includes(session.finishOutcome))throw Error('Invalid workout outcome');
  if(session.corrections!==undefined){if(!Array.isArray(session.corrections)||session.corrections.length>1000)throw Error('Invalid correction history');for(const revision of session.corrections){
   if(!object(revision)||typeof revision.at!=='string'||!Number.isFinite(Date.parse(revision.at))||typeof revision.reason!=='string'||!object(revision.before)||!Array.isArray(revision.before.items)||typeof revision.before.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(revision.before.date)||typeof revision.before.notes!=='string')throw Error('Invalid correction version');
   if(revision.before.items.some(x=>!Object.hasOwn(MOVES,x?.id)))throw Error('Invalid correction movement');
   validateBackup({...input,sessions:[{id:session.id,title:session.title,date:revision.before.date,items:revision.before.items}],workoutDraft:null});
  }}
  if(sessionIds.has(session.id))throw Error('Duplicate workout identity');sessionIds.add(session.id);
  if(session.draftId!==undefined&&session.draftId!==null){if(typeof session.draftId!=='string'||!session.draftId||draftIds.has(session.draftId))throw Error('Duplicate or invalid workout draft identity');draftIds.add(session.draftId);}
  const movementIds=new Set();
  for(const item of session.items){
   if(item?.prescription)validateNotebookRecord(item);
   if(movementIds.has(item?.id))throw Error('Duplicate movement in workout');movementIds.add(item?.id);
   if(MOVES[item?.id]?.bodyweight&&(item.bodyweight!==true||item.weight!==0))throw Error('Invalid bodyweight record');
   if(!object(item)||!Object.hasOwn(MOVES,item.id)||!Number.isFinite(item.weight)||item.weight<0||!Number.isInteger(item.actualSets)||item.actualSets<0||!Number.isFinite(item.actualReps)||item.actualReps<0||!Number.isInteger(item.targetSets)||item.targetSets<0||!Number.isFinite(item.targetReps)||item.targetReps<=0||!Number.isFinite(item.rest)||item.rest<0||!['clean','minor','hard','breakdown','pain'].includes(item.quality))throw Error('Invalid movement record');
  }
 }
 if(input.notebookOutlook!==undefined){if(!Array.isArray(input.notebookOutlook)||input.notebookOutlook.length>12)throw Error('Invalid cycle outlook');for(const row of input.notebookOutlook){if(!row||!Number.isInteger(row.number)||row.number<1||typeof row.provisional!=='boolean')throw Error('Invalid cycle entry');validatePlanMetadata(row.plan);}}
 if(input.defaultMinutes!==undefined)timeBudget(input.defaultMinutes);
 if(input.deferredIds!==undefined&&(!Array.isArray(input.deferredIds)||input.deferredIds.some(id=>!Object.hasOwn(MOVES,id))))throw Error('Invalid deferred movements');
 if(input.painResolutions!==undefined){
  if(!object(input.painResolutions))throw Error('Invalid movement reviews');
  for(const [id,review] of Object.entries(input.painResolutions))if(!Object.hasOwn(MOVES,id)||!object(review)||!Array.isArray(review.painKeys)||review.painKeys.some(key=>typeof key!=='string'))throw Error('Invalid movement review');
 }
 validateProgramming(input);
 const workoutDraft=validateDraft(input.workoutDraft,input);
 return {...input,workoutDraft,nextWeights:input.nextWeights||{},defaultMinutes:input.defaultMinutes??45,deferredIds:input.deferredIds||[]};
}
return{trainingPaused,activityRecovery,validateActivity,MOVES,SKILLS,DAYS,BLOCKS,LOADS,PROFILE_NAMES,describeProgression,policyFor,availableProfiles,configureMovement,practiceEvidence,supportingMoves,requirementLabel,prerequisites,chooseCycle,loadOptions,selectLoad,retestPushup,validWorkingWeight,validateProgramming,validateDraft,validateBackup,records,successful,stateFor,prescription,minutesFor,timeBudget,plan,completeRecord,nextRest,deferredAfter,resolvePain,movementGap,movementDemands};
});
