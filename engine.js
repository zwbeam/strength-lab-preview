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
/* Complexes use their own conservative, app-defined volume prescriptions.
 * One rep means one complete sequence, not one repetition of each component logged separately.
 * Scheduling and technique approval remain separate readiness decisions.
 */
Object.assign(MOVES,{
 complexCleanPress:{name:'Single-arm clean → press complex',gear:'kb',unit:'kg',family:'complex',complex:true,sequence:['clean','press'],reps:2,start:2,end:5,rest:120,sec:70,side:2,cues:['Use a familiar light kettlebell.','One repetition is a clean followed by one strict press.','Complete both sides with clean transitions and controlled overhead lockout.'],avoid:'Do not use a heavy press load or rush the transition.'},
 complexCleanSquatPress:{name:'Single-arm clean → squat → press complex',gear:'kb',unit:'kg',family:'complex',complex:true,sequence:['clean','squat','press'],reps:2,start:2,end:4,rest:150,sec:90,side:2,cues:['Use a conservative load you can control in every position.','One repetition is one clean, one squat, then one press.','Keep the rack stable and switch sides deliberately.'],avoid:'Stop if the rack, squat or overhead position breaks down.'},
 complexDoubleCleanSquatPress:{name:'Double clean → squat → press complex',gear:'kb',pair:true,unit:'kg per bell',family:'complex',complex:true,sequence:['doublePress','doubleSquat'],reps:1,start:2,end:4,rest:180,sec:100,side:1,cues:['Use a familiar matched pair.','One repetition is a double clean, double front squat, then double press.','Maintain a controlled double rack throughout.'],avoid:'Do not attempt before each component and the double rack are familiar.'}
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
// Source-reviewed technique; the following practice doses are configurable app
// choices, not numerical prescriptions from the instructional videos.
Object.assign(SKILLS,{
 bodyweightSquat:{name:'Familiar comfortable bodyweight squat with stable heels and complete standing return',sources:[91]},
 stepBackLunge:{name:'Familiar step-back lunge with stable lead foot and controlled return on both sides',sources:[93]},
 doubleClean:{name:'Familiar hard-style double clean, controlled rack and safe parking',sources:[365]}
});
Object.assign(MOVES,{
 bodyweightSquat:{name:'Bodyweight squat',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'squat',reps:3,start:2,end:4,rest:60,sec:24,repSeconds:4,side:1,defaultProfile:'ground',foundationPractice:true,requires:['bodyweightSquat'],teachingSources:[91],cues:['Set feet around shoulder width, generally forward, and reach the arms forward.','Keep the heels down and work in a comfortable controlled depth.','Stand all the way up and finish the hips before the next rep.'],avoid:'Do not force depth or count repetitions with lost control.'},
 stepBackLunge:{name:'Bodyweight step-back lunge',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'squat',reps:3,start:2,end:4,rest:60,sec:36,repSeconds:6,side:2,defaultProfile:'ground',foundationPractice:true,requires:['stepBackLunge'],teachingSources:[93],cues:['Keep the lead foot stable and pointed generally forward; step back without a preparatory shuffle.','Maintain controlled head-to-tailbone alignment and a grounded lead heel.','Return to full standing and match both legs.'],avoid:'Reduce the step or range if heel contact, alignment or comfort is lost.'},
 doubleClean:{name:'Double kettlebell clean',gear:'kb',pair:true,unit:'kg per bell',family:'hinge',reps:3,start:2,end:4,rest:90,sec:36,repSeconds:6,side:1,foundationPractice:true,requires:['rack','doubleClean'],teachingSources:[365],cues:['Leave clearance for both bells, with a controlled hike and thumbs back.','Drive the hips to a stable hard-style rack without colliding the hands.','Park the bells under control in the same place; never drop them.'],avoid:'Do not use unfamiliar pairs, a soft catch, bent wrists or uncontrolled handle contact.'}
});
SKILLS.singleRackSquat={name:'Familiar single-side rack squat with controlled wrist, trunk and both-side return',sources:[305]};
MOVES.singleRackSquat={name:'Single-rack kettlebell front squat',gear:'kb',unit:'kg',family:'squat',side:2,reps:3,start:2,end:4,rest:90,sec:36,repSeconds:6,foundationPractice:true,requires:['rack','singleRackSquat'],practicePrereqs:['squat'],teachingSources:[305],cues:['Set a straight-wrist rack with the elbow near the hip and thumb near collarbone height.','Squat with control, stand fully and match repetitions on both sides.','Use a familiar load and comfortable depth; keep repetitions stable while developing volume.'],avoid:'Goblet squat experience alone does not confirm single-rack technique.'};
MOVES.complexCleanSquatPress.sequence=['clean','singleRackSquat','press'];
// These are application evidence gates, not a claim of mandatory source rep counts.
MOVES.doubleClean.practicePrereqs=['clean'];
MOVES.doublePress.practicePrereqs=['press','doubleClean'];MOVES.doublePress.teachingSources=[152,365,366];
MOVES.doubleSquat.practicePrereqs=['singleRackSquat','doubleClean'];MOVES.doubleSquat.teachingSources=[186,305,365];
MOVES.complexDoubleCleanSquatPress.sequence=['doubleClean','doubleSquat','doublePress'];
MOVES.complexCleanPress.practicePrereqs=['clean','press'];MOVES.complexCleanPress.teachingSources=[295];
MOVES.complexCleanSquatPress.practicePrereqs=['clean','singleRackSquat','press'];MOVES.complexCleanSquatPress.teachingSources=[295,305,335];
MOVES.complexDoubleCleanSquatPress.practicePrereqs=['doubleSquat','doublePress'];MOVES.complexDoubleCleanSquatPress.teachingSources=[335];
// Double-club technique is source-reviewed; dose, admission and load caps are app decisions.
Object.assign(SKILLS,{
 doubleClubOrder:{name:'Familiar two-club swing clean and stable double order',sources:[206]},
 doubleClubOverhead:{name:'Completed familiar single/two-hand circles, shield/halo/gamma preparation and controlled double-club overhead range',sources:[205]},
 doubleClubPullover:{name:'Familiar double pullover without loss of pelvic or trunk control',sources:[205]},
 doubleClubSwipe:{name:'Familiar four-count technical swipe with controlled stops and breathing',sources:[207]}
});
Object.assign(MOVES,{
 doubleClubSwingClean:{name:'Double-club swing clean to order',gear:'club',clubPair:true,unit:'lb per club',family:'hinge',side:1,reps:3,start:2,end:4,rest:90,sec:24,repSeconds:8,defaultProfile:'doubleClub',teachingSources:[206],requires:['clubGrip','clubTwoHandFoundation','doubleClubOrder'],practicePrereqs:['clubInside','clubOutside','clubShield'],cues:['Drive from the hips into a controlled double order.','Keep elbows in and set the clubs down with control.'],avoid:'Use only a familiar matched pair; stop when grip, order or alignment is lost.'},
 doubleClubPullover:{name:'Double-club pullover',gear:'club',clubPair:true,unit:'lb per club',family:'rotation',side:1,reps:3,start:2,end:4,rest:90,sec:30,repSeconds:10,defaultProfile:'doubleClub',teachingSources:[205],requires:['clubGrip','doubleClubOrder','doubleClubOverhead','doubleClubPullover'],practicePrereqs:['doubleClubSwingClean','clubShield'],cues:['Maintain glute engagement and controlled pelvic alignment with clubs behind you.','Keep elbows inward and return to a stable double order.'],avoid:'Stop with back pain or loss of pelvic control; do not force overhead range.'},
 doubleClubTechnicalSwipe:{name:'Double-club technical swipe',gear:'club',clubPair:true,unit:'lb per club',family:'rotation',side:1,reps:3,start:2,end:4,rest:90,sec:36,repSeconds:12,defaultProfile:'doubleClub',teachingSources:[207,206,205],sequence:['doubleClubSwingClean','doubleClubPullover'],requires:['doubleClubOrder','doubleClubOverhead','doubleClubSwipe'],practicePrereqs:['doubleClubSwingClean','doubleClubPullover'],cues:['One repetition: swing, stop, pullover, stop.','Exhale at each count; maintain glute engagement through the overhead phase.'],avoid:'Practice the four-count technical version; performance swipes are not automatically substituted.'}
});
Object.assign(SKILLS,{bearCrawl:{name:'Familiar controlled opposite-limb bear crawl',sources:[87]},catCrawl:{name:'Familiar low knee-hover cat crawl with controlled opposite limbs',sources:[82]}});
MOVES.bearCrawl={name:'Bear crawl',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'ground',side:1,timed:true,reps:30,start:2,end:4,rest:30,sec:30,defaultProfile:'crawl',requires:['bearCrawl'],teachingSources:[87,554,88],cues:['Travel with opposite hand and foot in a clear stable space.','Keep a comfortable individual support position and stop when control changes.'],avoid:'Do not force range or continue through wrist/shoulder pain.'};
MOVES.catCrawl={name:'Cat crawl',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'ground',side:1,timed:true,reps:30,start:2,end:4,rest:30,sec:30,defaultProfile:'crawl',requires:['bearCrawl','catCrawl'],practicePrereqs:['bearCrawl'],teachingSources:[82,87,554,88],cues:['Keep the knees just off the ground and move opposite limbs with a controlled trunk.','Retain the earlier crawl pattern; stop before support or coordination breaks down.'],avoid:'Do not turn fatigue into an automatic harder crawl or longer bout.'};
Object.assign(SKILLS,{
 doubleClubInside:{name:'Familiar alternating inside circles with stable held club and matched side control',sources:[147]},
 doubleClubOutside:{name:'Familiar alternating outside circles with controlled catch and held-club stability',sources:[151]}
});
MOVES.doubleClubInside={name:'Double-club alternating inside circles',gear:'club',clubPair:true,unit:'lb per club',family:'rotation',side:2,reps:3,start:2,end:4,rest:90,sec:48,repSeconds:8,defaultProfile:'doubleClub',requires:['clubGrip','clubTwoHandFoundation','doubleClubOrder','doubleClubInside'],practicePrereqs:['doubleClubSwingClean','clubInside','clubOutside'],teachingSources:[147],cues:['Stabilize the held club while the other performs its inside circle.','Catch, regain balance and alternate; record actual repetitions for each side.'],avoid:'Stop if either club escapes order, wrist control or controlled deceleration.'};
MOVES.doubleClubOutside={name:'Double-club alternating outside circles',gear:'club',clubPair:true,unit:'lb per club',family:'rotation',side:2,reps:3,start:2,end:4,rest:90,sec:48,repSeconds:8,defaultProfile:'doubleClub',requires:['clubGrip','clubTwoHandFoundation','doubleClubOrder','doubleClubInside','doubleClubOutside'],practicePrereqs:['doubleClubInside','clubOutside'],teachingSources:[151,147],cues:['Keep a stable order, controlled ribs and glute engagement.','Alternate outside circles without overtracking or letting the held club tip.'],avoid:'Do not add load or repetitions when the held club cannot be controlled.'};
Object.assign(SKILLS,{
 kneeSlidingPlank:{name:'Familiar knee-supported sliding plank with controlled elbows, trunk and comfortable floor support',sources:[86]},
 hoverSlidingPlank:{name:'Familiar knee-hover outbound sliding plank with controlled knee-down return',sources:[94]}
});
MOVES.kneeSlidingPlank={name:'Knee-supported sliding plank',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'ground',side:1,reps:3,start:2,end:4,rest:60,sec:30,repSeconds:10,defaultProfile:'ground',foundationPractice:true,requires:['kneeSlidingPlank'],teachingSources:[86],cues:['Set hand distance from a comfortable child-position reach.','Slide out and back at a controlled head height, with elbows close.','Engage glutes and tuck the tailbone at extension; exhale where tension is greatest.'],avoid:'Do not force kneeling range, bounce the trunk or progress through wrist, elbow or knee pain.'};
MOVES.hoverSlidingPlank={name:'Knee-hover sliding plank',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'ground',side:1,reps:3,start:2,end:4,rest:60,sec:36,repSeconds:12,defaultProfile:'ground',foundationPractice:true,requires:['kneeSlidingPlank','hoverSlidingPlank'],practicePrereqs:['kneeSlidingPlank'],teachingSources:[94,86],cues:['Lift the knees slightly at the back, then slide forward with controlled elbows.','Engage glutes at extension, lower knees without collapsing the trunk and return.','Keep hands and feet controlled; speed does not replace the sequence.'],avoid:'Regress to knee support if the hover, trunk position or controlled return cannot be maintained.'};
SKILLS.bodyweightRow={name:'Familiar controlled bent-knee horizontal row on a secured stable bar',sources:[89]};
MOVES.bodyweightRow={name:'Bent-knee bodyweight bar row',gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'pull',station:'rowBar',side:1,reps:5,start:2,end:4,rest:90,sec:30,repSeconds:6,defaultProfile:'bodyweightPractice',foundationPractice:true,requires:['bodyweightRow'],teachingSources:[89],cues:['Use a secured stable bar and repeatable hand spacing.','Keep feet flat, engage glutes and pull toward the mid-chest line without sagging.','Keep the prescribed bar height and bent-leg setup; record any change.'],avoid:'Do not use an unstable bar, force range or continue with pain or lost trunk control.'};
MOVES.complexCleanPress.sequenceDescription='One rep: clean → strict press; match both sides.';
MOVES.complexCleanSquatPress.sequenceDescription='One rep: clean → single-rack squat → strict press; match both sides.';
// Source #97 teaches two complementary unloaded patterns, not a mandatory
// alternating-to-static mastery ladder. Numeric doses and equipment gates are app choices.
for(const [id,pattern,name] of [['boxStepUp','alternating','Alternating-lead bodyweight step-up'],['staticStepUp','static','Static-foot bodyweight step-up']]){
 SKILLS[id]={name:'Familiar controlled '+pattern+' step-up on a stable familiar low platform, with equal-sided return',sources:[97]};
 MOVES[id]={name,gear:'bodyweight',bodyweight:true,unit:'bodyweight',family:'squat',side:2,reps:3,start:2,end:4,rest:90,sec:36,repSeconds:6,defaultProfile:'bodyweightPractice',foundationPractice:true,station:'stepPlatform',stepPattern:pattern,requires:[id],teachingSources:[97],cues:['Use a familiar stable low platform and clear overhead space; begin without external load.','Stand fully, engage the glutes and control the quiet step-down.','Match repetitions on each lead leg; lower the platform if trunk or leg alignment is lost.'],avoid:'Do not add height, external load or speed to compensate for uncontrolled stepping.'};
}
MOVES.complexDoubleCleanSquatPress.sequenceDescription='One rep: double clean → front squat → press from rack; no extra clean.';
MOVES.doubleClubTechnicalSwipe.sequenceDescription='One rep: swing → stop → pullover → stop (four counts).';
// #142's paired hinge preparation; experience/technique confirmations are not
// inferred from the app's short recent-practice windows.
Object.assign(SKILLS,{
 doubleKbReadiness:{name:'Established single-bell swing, hand-change, clean and press experience; reviewed #142 paired-bell preparation and familiar lighter per-bell load',sources:[142]},
 doubleDeadlift:{name:'Familiar controlled double-kettlebell deadlift and safe paired set-down',sources:[142]},
 doubleSwing:{name:'Familiar thumbs-back double swing with stable trunk, clearance and controlled parking',sources:[142]}
});
MOVES.doubleDeadlift={name:'Double kettlebell deadlift',gear:'kb',pair:true,unit:'kg per bell',family:'hinge',side:1,reps:5,start:2,end:4,rest:90,sec:30,repSeconds:6,defaultProfile:'doubleHinge',foundationPractice:true,requires:['hingePattern','deadliftTechnique','doubleKbReadiness','doubleDeadlift'],teachingSources:[142],cues:['Use a familiar matched pair with clearance between the feet.','Practice the controlled vertical lift before introducing a swing.','Stand tall and lower with control; do not drop the bells.'],avoid:'Paired load is the sum of both bells; single-bell familiarity does not confirm paired technique.'};
MOVES.doubleSwing={name:'Double kettlebell swing',gear:'kb',pair:true,unit:'kg per bell',family:'hinge',side:1,reps:5,start:2,end:4,rest:90,sec:20,repSeconds:4,defaultProfile:'doubleHinge',foundationPractice:true,requires:['doubleKbReadiness','doubleDeadlift','doubleSwing'],practicePrereqs:['doubleDeadlift','swing'],teachingSources:[142],cues:['Use a familiar lighter matched pair, a stable stance and room for both bells.','Hike with thumbs back, keep heels grounded and drive the hips to stand fully.','Keep ribs controlled, arms at or below shoulder height and park in the starting position.'],avoid:'Do not use thumbs-up sport variations, lose trunk control or drop the bells; stop when the hinge deteriorates.'};
const DAYS=[{name:'A · Squat / Press / Pull',focus:'Kettlebell strength',ids:['squat','press','row']},{name:'B · Hinge / Cast / Carry',focus:'Hinge and club control',ids:['swing','cast','carry']},{name:'C · Clean / Club / Squat',focus:'Skill and balanced strength',ids:['clean','front','circles']}];
const LOADS={kb:[4,6,8,10,12,14,16,18,20,22,24,28,32,36,40,44,48],club:[2,3,4,5,7,10,12,15,17,20,25,30,35]};
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
function records(s,id){return(s.sessions||[]).flatMap((x,sessionIndex)=>(x.items||[]).map((y,itemIndex)=>({...y,date:x.date,_key:`${x.id||x.date+':'+sessionIndex}:${itemIndex}`,_sessionOrder:sessionIndex,_itemOrder:itemIndex})).filter(y=>y.id===id)).sort((a,b)=>String(a.date).localeCompare(String(b.date))||a._sessionOrder-b._sessionOrder||a._itemOrder-b._itemOrder);}
function successful(x){const validLoad=x&&(MOVES[x.id]?.bodyweight?x.bodyweight===true&&Number(x.weight)===0:Number(x.weight)>0);return !!(x&&x.quality==='clean'&&!x.pain&&x.completed===true&&x.actualSets>=x.targetSets&&x.actualReps>=x.targetReps&&validLoad);}
// Each profile states exactly which parameters are examples from a transcript.
// Promotion, recovery and scheduling thresholds remain configurable app decisions.
const PROFILE_NAMES={doubleHinge:'Paired-kettlebell hinge practice',bodyweightPractice:'Bodyweight fixed-setup volume practice',crawl:'Crawl 30/30 practice',doubleClub:'Double-club controlled rep practice',legacy:'Existing volume defaults',wave:'Heavy / light volume wave',snatch:'Snatch EMOM example',grind:'Double-kettlebell strength example',club:'Two-hand club timed practice',getup:'Get-up alternating time-under-load goal',singleClub:'Single-arm club continuous volume',getupDrill:'Get-up breakdown rep practice',clubIntermediate:'Single-arm club intermediate practice',deadliftPractice:'Loaded hinge foundation',ground:'Foundational ground practice',hingePractice:'Unloaded hinge preparation',pushup:'Push-up baseline EMOM volume'};
function policyFor(id,s={}){
 const m=MOVES[id];if(!Object.hasOwn(MOVES,id))throw Error('Unknown movement');
 const c=s.programming?.[id]||{},profile=c.profile||m.defaultProfile||(['snatch'].includes(id)?'snatch':['doublePress','doubleSquat'].includes(id)?'grind':'legacy');
 if(!availableProfiles(id).includes(profile))throw Error('Unsupported movement profile');
 if(c.stallStrategy!==undefined&&!['repeat','redistribute'].includes(c.stallStrategy))throw Error('Unknown stall strategy');
 const exposures=c.exposures??2;
 if(!Number.isInteger(exposures)||exposures<1||exposures>6)throw Error('Use 1–6 clean exposures');
 let start=m.start,end=m.end,reps=m.reps,rest=m.rest,step=1,timed=!!m.timed,roundSeconds=null,sources=m.foundationPractice||m.complex?m.teachingSources:[666],exactParametersSource=null,density=null;
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
 if(profile==='crawl'){start=2;end=4;reps=30;rest=30;timed=true;sources=m.teachingSources;exactParametersSource=null;}
 if(profile==='doubleHinge'){start=c.startSets??2;end=c.endSets??4;reps=c.repCount??m.reps;rest=90;if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||start>4||end<start||end>6||![3,5,6,8,10].includes(reps))throw Error('Paired hinge practice needs 1–6 sets and a supported rep target (app limits)');sources=m.teachingSources;exactParametersSource=null;}
 if(profile==='doubleClub'){start=c.startSets??2;end=c.endSets??4;reps=c.repCount??3;rest=90;if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||start>4||end<start||end>6||![3,4,5].includes(reps))throw Error('Double-club practice needs 1–6 sets and 3–5 reps (app limits)');sources=m.teachingSources;exactParametersSource=null;}
 if(profile==='bodyweightPractice'){start=c.startSets??2;end=c.endSets??4;reps=c.repCount??m.reps;rest=90;if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||start>4||end<start||end>6||![3,4,5,6,8,10].includes(reps))throw Error('Bodyweight practice needs 1–6 sets and a supported rep target');sources=m.teachingSources;exactParametersSource=null;}
 if(profile==='ground'){start=c.startSets??2;end=c.endSets??4;reps=c.repCount??m.reps;rest=60;if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||start>4||end<start||end>6||!(m.timed?[30,60,90]:[3,4,5]).includes(reps))throw Error('Ground practice needs 1–6 sets and a supported dose');sources=m.teachingSources;exactParametersSource=null;}
 if(profile==='deadliftPractice'){start=c.startSets??2;end=c.endSets??4;reps=c.repCount??5;rest=90;if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||start>4||end<start||end>6||![3,5,8].includes(reps))throw Error('Loaded hinge practice needs 1–6 sets and 3, 5 or 8 reps');sources=[704];exactParametersSource=null;}
 if(profile==='hingePractice'){start=2;end=3;reps=10;rest=60;sources=[704];exactParametersSource=704;}
 if(profile==='pushup'){const baseline=c.cleanBaseline??0,fraction=c.fraction??.4;if(!Number.isInteger(baseline)||baseline<0||baseline>200||baseline>0&&baseline<3||![.4,.5].includes(fraction))throw Error('Use a conservative clean baseline of 3–200 and a 40% or 50% fraction');if(c.cycleRevision!==undefined&&(!Number.isInteger(c.cycleRevision)||c.cycleRevision<0))throw Error('Invalid baseline revision');start=10;end=30;reps=Math.floor(baseline*fraction);rest=0;step=c.step??1;if(![1,2].includes(step))throw Error('Push-up set increment must be 1 or 2');roundSeconds=60;sources=[609];exactParametersSource=609;}
 const heavyReps=c.heavyReps??Math.max(1,Math.floor(m.reps*.6));if(profile==='wave'&&(!Number.isInteger(heavyReps)||heavyReps<1||heavyReps>m.reps))throw Error('Heavy reps must be whole and no greater than light reps');
 const stages=[];if(profile==='getup'){for(let seconds=180;seconds<=600;seconds+=step)stages.push({sets:1,reps:seconds,rest:0});}else if(profile==='getupDrill'){for(let count=3;count<=m.practiceRepEnd;count++)stages.push({sets:1,reps:count,rest});}else{for(let sets=start;sets<end;sets+=step)stages.push({sets,reps,rest});stages.push({sets:end,reps,rest});}
 const custom=profile==='club'&&(start!==2||end!==6||rest!==60)?{start,end,rest}:profile==='wave'&&heavyReps!==Math.max(1,Math.floor(m.reps*.6))?{heavyReps}:null;
 let key=profile==='legacy'&&Object.keys(c).length===0?'legacy-v1':JSON.stringify(['rules-20261105-1',id,profile,reps,step,exposures,c.lightWeight,c.heavyWeight,c.stallStrategy||'repeat']);
 if(custom)key=JSON.stringify([key,custom]);if(['clubIntermediate','ground','deadliftPractice','doubleClub','bodyweightPractice','doubleHinge'].includes(profile))key=JSON.stringify([key,{start,end}]);if(profile==='pushup')key=JSON.stringify([key,c.cleanBaseline??0,c.fraction??.4,c.cycleRevision??0]);if(profile==='getup')key=JSON.stringify([key,c.weakSide||'left']);
 if(m.station==='rowBar')key=JSON.stringify(['row-practice-v1',profile,reps,start,end,exposures,c.stallStrategy||'repeat',s.equipment?.rowBar?.heightCm??null,'bent']);
 if(m.station==='stepPlatform')key=JSON.stringify(['step-practice-v1',id,profile,reps,start,end,exposures,c.stallStrategy||'repeat',s.equipment?.stepPlatform?.heightCm??null]);
 const parameterNotes=profile==='doubleHinge'?'Technique, deadlift-before-swing order and lighter per-bell preparation are from #142. Reps/sets/rest, recent-practice gates, planning pace and load-review caps are app defaults. Source 6-to-20 rep, multi-year and approximate load examples are context, not automatic targets or mastery tests.':m.station==='stepPlatform'?'Unloaded alternating and static-foot technique, equal sides and controlled deceleration are from #97. Reps/sets/rest, fixed-height comparison, exposure/recovery gates and planning pace are Strength Lab app defaults. No automatic height or external-load progression is prescribed.':profile==='bodyweightPractice'?'Technique and fixed-variable volume principles are from #89. Selected reps/sets/rest, stable-height comparison, exposure/recovery gates and planning pace are app defaults. No maximum test or full 60/80% program is prescribed.':profile==='crawl'?'Thirty-second work/rest intervals follow #88/#554 learning examples. Applying them to this crawl, 2–4 bouts, exposure gates and recovery doses are Strength Lab adaptations. No automatic 20/10, 60/60 or four-minute endurance advancement is inferred.':profile==='doubleClub'?'Technique and breakdown order are source-reviewed. All rep/set/rest targets, prerequisite evidence counts, exposure gates, load increases and recovery reductions are Strength Lab adaptations, not a source double-club program.':id==='singleRackSquat'?'The 3–5 reps per side and fixed-rep/add-set method are from #305. The selected 3 reps, 2–4-set range, 90-second rest, exposure and recovery gates are Strength Lab choices.':m.foundationPractice?'Technique is source-reviewed; rep/set/rest targets, exposure gates and recovery doses are Strength Lab defaults.':m.complex?'Combination teaching is source-linked; complex dose/rest and component-evidence gates are Strength Lab decisions, not a universal worked-example prescription.':profile==='deadliftPractice'?'Loaded hinge teaching and preparation are from #704. Loaded rep/set/rest targets, recent unloaded evidence and promotion gates are configurable app defaults; the source 2–3×10 example is explicitly unloaded.':profile==='ground'?'Teaching and the two-hand to single-hand sequence are source-supported. Sets, rest, rep targets and exposure gates are app defaults. Bear-squat 60/90-second bouts are #100 examples; the 30-second option is an app regression; hip-drop rep practice is an app alternative to the #84 timed example.':profile==='hingePractice'?'Unloaded 2–3×10 is from #704; rest and pace are app defaults.':profile==='pushup'?'EMOM span and baseline fraction are from #609; conservative input, rounding and promotion/recovery gates are app choices.':profile==='getupDrill'?'Sets, rest and evidence gates are app defaults; only the hand-support light-load rep range has numeric support in #372.':profile==='clubIntermediate'?'Teaching and the general volume method are source-linked; these intermediate set/rep targets and evidence gates are app defaults.':'';
 return{movement:id,profile,parameterNotes,continuous:['getup','singleClub','clubIntermediate'].includes(profile),betweenExercises:['singleClub','clubIntermediate'].includes(profile)?120:0,durationScope:profile==='getup'?'total':null,weakSide:c.weakSide||'left',heavyReps,label:PROFILE_NAMES[profile],key,kind:exactParametersSource===null?'app-default':'transcript-example',volume:{start,end,reps,rest},stages,density,roundSeconds,timed,exposures,principleSources:sources,exactParametersSource,promotion:`${exposures} clean complete exposures (app setting)`,endpoint:'explicit review',config:c};
}
function availableProfiles(id){if(MOVES[id]?.defaultProfile)return [MOVES[id].defaultProfile];if(id==='snatch')return ['snatch'];if(['doublePress','doubleSquat'].includes(id))return ['grind'];if(MOVES[id]?.gear==='club')return ['legacy','club'];if(['swing','squat','press','row','clean'].includes(id))return ['legacy','wave'];return ['legacy'];}
function configureMovement(s,id,config){if(config.profile==='legacy'&&(config.exposures??2)===2&&(!config.stallStrategy||config.stallStrategy==='repeat'))config={};const next={...s,programming:{...s.programming,[id]:config}};const policy=policyFor(id,next);if(policy.profile==='wave'&&![config.lightWeight,config.heavyWeight].every(w=>(s.equipment?.[MOVES[id].gear]||[]).includes(w)))throw Error('Both wave weights must be available');return next;}
function replay(s,id,policy,track='base'){
 const all=records(s,id);const resetAfter=s.loadResetAfter?.[id];const boundary=resetAfter?all.findIndex(x=>x._key===resetAfter):-1;if(resetAfter&&resetAfter!=='__start__'&&boundary<0)throw Error('Missing load reset anchor: restore or repair training history before progressing');const h=(resetAfter==='__start__'?all:boundary>=0?all.slice(boundary+1):all).filter(x=>(x.policyKey||'legacy-v1')===policy.key&&(x.track||'base')===track);
 let stage=0,stagePhase='volume',ready=false,streak=0,fail=0,cycles=0,weight=MOVES[id].bodyweight?0:policy.profile==='wave'?(track==='heavy'?policy.config.heavyWeight:policy.config.lightWeight):(Number(s.weights?.[id])||0),lastEligibleKey=null;
 const shape=()=>stagePhase==='density'?{...policy.density[stage],rest:0}:policy.stages[stage];
 for(const x of h){
  if(!MOVES[id].bodyweight&&Number(x.weight)>0&&Number(x.weight)!==weight){weight=Number(x.weight);stage=0;stagePhase='volume';ready=false;streak=0;fail=0;}
  if(x.pain||x.quality==='pain'){streak=0;fail++;continue;}
  if(x.performed&&x.mode==='light')continue;
  if(['rebuild','reentry','recovery','deload'].includes(x.mode)){streak=0;if(x.quality==='clean')fail=0;continue;}
  if(MOVES[id].station&&x.setupChanged&&x.quality==='clean'&&!x.pain){streak=0;continue;}
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
// App continuity rule: only registry-gated descendants may maintain a previously
// qualified prerequisite. This transfers recency, never exposures, load or mastery.
function gatedDescendant(child,parent,seen=new Set()){
 if(!MOVES[child]||seen.has(child))return false;seen.add(child);
 return (MOVES[child].practicePrereqs||[]).some(id=>id===parent||gatedDescendant(id,parent,seen));
}
function practiceEvidence(s,id,opts={}){
 const st=stateFor(s,id),history=records(s,id).filter(x=>(x.policyKey||'legacy-v1')===st.policy.key&&Number(x.weight)===st.weight);
 const neutralLight=x=>x.performed&&x.mode==='light'&&x.quality==='clean'&&!x.pain&&!x.setupChanged;
 const bad=history.findLastIndex(x=>!neutralLight(x)&&(!successful(x)||['rebuild','reentry','recovery','deload'].includes(x.mode)));
 const count=history.slice(bad+1).filter(successful).length,required=s.trainingDefaults?.skillExposures??2,absence=s.trainingDefaults?.reentryDays??14;
 let recent=movementGap(s,id,opts.now)<=absence,maintained=false;
 const maintenanceFor=opts.maintenanceFor||opts.forMovement;
 if(!recent&&maintenanceFor&&gatedDescendant(maintenanceFor,id)){
  const child=stateFor(s,maintenanceFor),h=records(s,maintenanceFor).filter(x=>(x.policyKey||'legacy-v1')===child.policy.key&&Number(x.weight)===child.weight);
  const lastBad=h.findLastIndex(x=>!successful(x)&&!neutralLight(x));
  maintained=h.slice(lastBad+1).filter(successful).length>=required&&movementGap(s,maintenanceFor,opts.now)<=absence&&!child.hold&&(MOVES[maintenanceFor].requires||[]).every(key=>s.skills?.[key]===true);
 }
 const upstreamReady=prerequisites(s,id,{...opts,maintenanceFor:maintained?maintenanceFor:opts.maintenanceFor}).length===0;
 return{count,required,ready:count>=required&&(recent||maintained)&&!st.hold&&upstreamReady,recent,maintained,held:!!st.hold};
}
function supportingMoves(s,ids,opts={}){
 const result=[],seen=new Set();
 function visit(id,root){if(seen.has(id))return;seen.add(id);for(const parent of MOVES[id]?.practicePrereqs||[]){visit(parent,root);if(!practiceEvidence(s,parent,{...opts,forMovement:id,maintenanceFor:root}).ready&&!ids.includes(parent)&&!result.includes(parent))result.push(parent);}}
 ids.forEach(id=>visit(id,id));return result;
}
function requirementLabel(key){if(key==='baseline:pushup')return 'Enter a recent conservative clean-rep baseline for push-ups in Settings';return key.startsWith('practice:')?'Recent clean supporting practice: '+MOVES[key.slice(9)].name:SKILLS[key]?.name||key;}
function prerequisites(s,id,opts={}){
 const m=MOVES[id];return[...(m?.defaultProfile==='pushup'&&policyFor(id,s).volume.reps<1?['baseline:pushup']:[]),...(m?.requires||[]).filter(skill=>s.skills?.[skill]!==true),...(m?.practicePrereqs||[]).filter(parent=>!practiceEvidence(s,parent,{...opts,forMovement:id}).ready).map(parent=>'practice:'+parent)];
}
/* Complex readiness is advisory; eligible movements have independent prescriptions and logs. */
const COMPLEX_PATHWAYS=Object.freeze([
 {id:'complexCleanPress',name:'Single-arm clean → press',gear:'kb',requires:['clean','press']},
 {id:'complexCleanSquatPress',name:'Single-arm clean → front squat → press',gear:'kb',requires:['clean','singleRackSquat','press']},
 {id:'complexDoubleCleanSquatPress',name:'Double clean → front squat → press',gear:'kb',requires:['doubleSquat','doublePress'],matchedPair:true}
]);
function complexityOptions(s,opts={}){
 const enabled=s.trainingPreferences?.useKb!==false&&s.trainingPreferences?.useComplexes!==false;
 return COMPLEX_PATHWAYS.map(pathway=>{
  const missing=pathway.requires.filter(id=>!Object.hasOwn(MOVES,id)||!practiceEvidence(s,id,{now:opts.now}).ready);
  const pairAvailable=!pathway.matchedPair||(s.trainingPreferences?.useDoubleKb===true&&(s.equipment?.pairs||[]).length>0);
  const movement=MOVES[pathway.id];
  const weight=Number(stateFor(s,pathway.id).weight||0);
  const inventory=movement.pair?s.equipment?.pairs:s.equipment?.kb;
  const validLoad=weight>0&&Array.isArray(inventory)&&inventory.includes(weight);
  const rackReady=!pathway.matchedPair||s.skills?.rack===true;
  const blockers=[...missing.map(id=>Object.hasOwn(MOVES,id)?MOVES[id].name+' needs recent clean practice':id+' is not yet implemented'),...(!pairAvailable?['A matched kettlebell pair must be configured']:[]),...(!rackReady?['Confirm a secure double rack in Settings']:[]),...(!validLoad?['Review the owned working load in Settings → Advanced & Data → Movement Programming or Training Log']:[])];
  if(!enabled)blockers.unshift('Kettlebell complexes are disabled');
  return {...pathway,ready:!blockers.length,blockers,advisory:true};
 });
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
 let blocked='';if(m.station==='stepPlatform'&&(!s.equipment?.stepPlatform?.available||!validStepHeight(s.equipment.stepPlatform.heightCm)))blocked='Confirm a stable step platform, overhead clearance and a familiar controlled height in Settings before step-up practice.';if(m.station==='rowBar'&&(!s.equipment?.rowBar?.available||!validRowHeight(s.equipment.rowBar.heightCm)))blocked='Confirm a secured stable row bar and record its height in Settings before bodyweight pulling.';if(m.defaultProfile==='crawl'&&s.trainingPreferences?.crawlSpace!==true)blocked='Confirm clear, stable traveling space for crawl practice in Settings.';if(policy.profile==='pushup'&&reps<1)blocked='Enter a recent conservative clean-rep baseline in Settings before starting this source method.';const missing=prerequisites(s,id,opts);
 if(sets<1)blocked='No whole heavy set fits below the last light exposure. Choose a closer heavy weight or build the light cycle first.';
 if(missing.length)blocked='Prerequisites pending: '+missing.map(requirementLabel).join('; ');
 if(policy.profile==='wave'&&![policy.config.lightWeight,policy.config.heavyWeight].every(w=>(s.equipment?.[m.gear]||[]).includes(w)))blocked='A configured wave weight is no longer available. Review equipment and programming.';
 
 if(m.clubPair&&(s.trainingPreferences?.useDoubleClub!==true||!(s.equipment?.clubPairs||[]).includes(weight)))blocked='Confirm an available matched club pair at this per-club weight in Settings.';
 if(m.pair&&(s.trainingPreferences?.useDoubleKb!==true||!(s.equipment?.pairs||[]).includes(weight)))blocked='Confirm an available matched kettlebell pair at this weight in Settings.';
 if(!m.bodyweight&&weight>0){const available=s.equipment?.[m.gear];const ceiling=m.gear==='kb'?s.equipment?.maxKbKg:s.equipment?.maxClubLb;if((Array.isArray(available)&&!available.includes(weight))||(ceiling!==undefined&&weight>ceiling))blocked='The recorded working weight is not currently available in your equipment. Available loads: '+(availableWorkingLoads(s,id).join(', ')||'none configured')+'. Update the working weight or Settings; training history is preserved.';}
 if(st.hold)blocked=st.hold+' Resolve the review before resuming.';
 if(blocked){mode=st.hold?'review':'prerequisite';sets=0;reason=blocked;}
 const adapted=['baseline','recovery','reentry','rebuild','deload','review','prerequisite'].includes(mode);
 const sourceParameters=adapted?null:policy.exactParametersSource===411&&st.stagePhase==='density'?410:policy.exactParametersSource;
 const roundSeconds=policy.roundSeconds;
 const sequenceSeconds=m.complex?(m.sequence||[]).reduce((n,id)=>{const part=MOVES[id];return n+(part.repSeconds||part.sec/part.reps);},0):0;
 const secondsPerSet=m.complex?Math.max(m.sec,reps*m.side*sequenceSeconds):policy.timed?reps*(policy.durationScope==='total'?1:m.side):m.repSeconds?reps*m.side*m.repSeconds:m.sec;
 const station=m.station==='rowBar'?{kind:'rowBar',heightCm:s.equipment?.rowBar?.heightCm??null,legPosition:'bent'}:m.station==='stepPlatform'?{kind:'stepPlatform',heightCm:s.equipment?.stepPlatform?.heightCm??null,stepPattern:m.stepPattern}:undefined;
 return{id,name:m.name,unit:m.unit,...(station?{station,setupDescription:station.kind==='rowBar'?'Bar '+station.heightCm+' cm · bent knees; keep setup constant':'Platform '+station.heightCm+' cm · '+(station.stepPattern==='static'?'static foot':'alternate lead')+'; keep height constant'}:{}),weight,sets,reps,rest,bodyweight:!!m.bodyweight,sequenceDescription:m.sequenceDescription||null,provenanceNote:policy.parameterNotes,continuous:policy.continuous,betweenExercises:policy.betweenExercises,durationScope:policy.durationScope,weakSide:policy.weakSide,side:m.side,timed:policy.timed,mode,reason,phase:st.phase,streak:st.streak,cycle:st.cycles,policyKey:policy.key,profile:policy.profile,track:st.track,roundSeconds,secondsPerSet,sourceIds:policy.principleSources,sourceParameters,exposureTarget:policy.exposures};
}
function chooseCycle(s,id,choice){
 const st=stateFor(s,id);
 if(st.hold||st.fail||st.phase!=='ready')throw Error('Complete a clean cycle and resolve any review first');
 if(choice!=='density'||!st.policy.density||st.stagePhase!=='volume')throw Error('This movement has no supported density transition');
 return {...s,cycleChoices:{...s.cycleChoices,[id]:{at:st.lastEligibleKey,type:choice}}};
}
function loadOptions(s,id){
 const st=stateFor(s,id),m=MOVES[id];
 if(m.bodyweight||st.policy.profile==='wave')return [];
 if(st.hold||st.fail||st.phase!=='ready')return [];
 const inventory=m.clubPair?s.equipment?.clubPairs:m.pair?(Array.isArray(s.equipment?.pairs)?s.equipment.pairs:[]):s.equipment?.[m.gear];
 // Progression may only offer equipment the athlete has explicitly configured.
 // Suggested catalog weights belong in setup, never in a live workout progression.
 const candidates=[...new Set(Array.isArray(inventory)?inventory:[])].sort((a,b)=>a-b);
 const cap=s.trainingDefaults?.maxLoadJump??.25;
 const ceiling=s.equipment?.maxKbKg!==undefined&&m.gear==='kb'?Number(s.equipment.maxKbKg):s.equipment?.maxClubLb!==undefined&&m.gear==='club'?Number(s.equipment.maxClubLb):Infinity;
 return candidates.filter(w=>Number.isFinite(w)&&w>st.weight&&w<=st.weight*(1+cap)&&w<=ceiling).sort((a,b)=>a-b);
}
function availableWorkingLoads(s,id){const m=MOVES[id];if(!m||m.bodyweight)return [];const list=m.clubPair?s.equipment?.clubPairs:m.pair?s.equipment?.pairs:s.equipment?.[m.gear];const ceiling=m.gear==='kb'?s.equipment?.maxKbKg:s.equipment?.maxClubLb;return(Array.isArray(list)?list:[]).filter(w=>Number.isFinite(w)&&w>0&&(ceiling===undefined||w<=ceiling)).sort((a,b)=>a-b);}
function repairMissingLoadAnchor(s,id,confirm){
 if(confirm!=='RESET_PROGRESS_FROM_SCRATCH')throw Error('Explicit progression reset confirmation required');
 if(!Object.hasOwn(MOVES,id)||MOVES[id].bodyweight)throw Error('A loaded movement is required');
 const marker=s.loadResetAfter?.[id];
 if(!marker||marker==='__start__'||records(s,id).some(x=>x._key===marker))throw Error('No missing load reset anchor to repair');
 const next={...s,loadResetAfter:{...s.loadResetAfter,[id]:records(s,id).at(-1)?._key||'__start__'}};
 return next;
}
function setInitialLoad(s,id,weight){
 const m=MOVES[id];if(!m||m.bodyweight)throw Error('Select a loaded movement');
 if(stateFor(s,id).weight>0||records(s,id).some(x=>x.actualSets>0&&x.weight>0))throw Error('Working load already established; use existing load review controls');
 if(!availableWorkingLoads(s,id).includes(weight))throw Error('Starting load must be explicitly available for this movement');
 return {...s,weights:{...s.weights,[id]:weight},nextWeights:{...s.nextWeights,[id]:weight}};
}
function replaceUnavailableLoad(s,id,weight){const m=MOVES[id];if(!m||m.bodyweight)throw Error('A loaded movement is required');if(policyFor(id,s).profile==='wave')throw Error('Change configured wave weights instead');if(!availableWorkingLoads(s,id).includes(weight))throw Error('Replacement weight must be currently available');const current=stateFor(s,id);if(availableWorkingLoads(s,id).includes(current.weight))throw Error('Current working weight is still available; use normal progression controls');return{...s,nextWeights:{...s.nextWeights,[id]:weight},loadResetAfter:{...s.loadResetAfter,[id]:records(s,id).at(-1)?._key||'__start__'}};}
function selectLoad(s,id,weight){if(!loadOptions(s,id).includes(weight))throw Error('Load must be an available, permitted increment after a clean cycle. Adjust the configurable jump limit deliberately if needed.');if(stateFor(s,id).policy.profile==='wave')throw Error('Configure a new heavy/light pair in Settings instead.');return{...s,nextWeights:{...s.nextWeights,[id]:weight},loadResetAfter:{...s.loadResetAfter,[id]:records(s,id).at(-1)?._key||'__start__'}};}
function minutesFor(p){const m=MOVES[p.id];return(p.sets*(p.roundSeconds||((p.secondsPerSet??m.sec)+Math.max(0,p.rest)))/60)+.55;}
function timeBudget(minutes){
 const total=minutes===undefined||minutes===null?45:typeof minutes==='number'?minutes:NaN;
 if(!Number.isInteger(total)||total<25||total>120)throw Error('Strength workout duration must be 25–120 minutes');
 // Protect preparation and recovery when session time is compressed.
 // Eight minutes follows the two-round four-station warm-up format (source 550).
 // Ten minutes of cooldown is an app allocation, not a quoted Wildman rule.
 const warmup=8;
 const cooldown=10;
 return {total,warmup,cooldown,main:total-warmup-cooldown};
}
const BLOCKS={
 doubleHinge:{name:'Double-kettlebell hinge foundations',days:[{name:'Paired deadlift preparation',focus:'Explicit experienced-trainee readiness, controlled paired lifting and owned matched bells',ids:['doubleDeadlift']},{name:'Paired swing practice',focus:'Recent paired hinge and single-bell foundations; explicit double-swing confirmation',ids:['doubleSwing']}]},
 stepUpPractice:{name:'Unloaded step-up foundations',days:[{name:'Alternating-lead step-up practice',focus:'Equal lead legs, controlled ascent and quiet return at a fixed platform height',ids:['boxStepUp']},{name:'Static-foot step-up practice',focus:'Stable planted foot, controlled alignment and equal work on each leg',ids:['staticStepUp']}]},
 bodyweightPull:{name:'Bodyweight pulling foundations',days:[{name:'Bent-knee bar row practice',focus:'Secured bar, recorded height and repeatable bent-leg setup',ids:['bodyweightRow']}]},
 slidingPlank:{name:'Sliding-plank foundations',days:[{name:'Supported to knee-hover sliding practice',focus:'Explicit floor-support skills, recent basic practice and controlled returns',ids:['kneeSlidingPlank','hoverSlidingPlank']}]},
 doubleClubAlternating:{name:'Alternating double-club skill practice',days:[{name:'Alternating inside / outside club practice',focus:'Opt-in later coordination pathway; app practice dose with separate side results',ids:['doubleClubInside','doubleClubOutside']}]},
 bodyweight:{name:'Bodyweight foundations and crawling',days:[{name:'Bodyweight lower-body practice',focus:'Squat and equal-sided lunge practice',ids:['bodyweightSquat','stepBackLunge']},{name:'Bodyweight ground practice',focus:'Ground transitions and controlled 30/30 crawl practice',ids:['hipDropTwoHand','hipDropSingleHand','bearSquat','bearCrawl','catCrawl']}]},
 doubleClub:{name:'Double-club foundations and technical swipe',days:[{name:'Double-club coordinated practice',focus:'Swing clean → pullover → four-count technical swipe; app practice dose',ids:['doubleClubSwingClean','doubleClubPullover','doubleClubTechnicalSwipe']}]},
 rackSquatPractice:{name:'Single-rack squat practice',days:[{name:'Single-rack squat foundation',focus:'Distinct rack control and equal-sided fixed-rep volume',ids:['singleRackSquat']}]},
 bodyweightFoundations:{name:'Bodyweight squat and lunge foundations',days:[{name:'Bodyweight lower-body practice',focus:'Controlled squat and step-back lunge without external load',ids:['bodyweightSquat','stepBackLunge']}]},
 doubleCleanPractice:{name:'Double-kettlebell clean practice',days:[{name:'Matched-pair clean foundation',focus:'Explicitly confirmed rack and double-clean technique; owned matched pair',ids:['doubleClean']}]},
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
const SUPPORT_POOLS={bodyweight:['bodyweightSquat','stepBackLunge','hipDropTwoHand','bearCrawl','catCrawl','bearSquat','pushup','kneeSlidingPlank','bodyweightRow','boxStepUp'],club:['doubleClubSwingClean','doubleClubPullover','doubleClubTechnicalSwipe']};
const DEMANDS={ground:['lower','shoulder'],getup:['lower','shoulder','grip'],hinge:['lower','grip'],squat:['lower'],press:['shoulder','grip'],pull:['shoulder','grip'],carry:['grip'],rotation:['shoulder','grip'],complex:['lower','shoulder','grip']};
function movementDemands(id){if(MOVES[id]?.clubPair)return ['lower','shoulder','grip'];return [...(DEMANDS[MOVES[id]?.family]||[])];}
function calendarDay(value){const text=typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?value:new Date(value??Date.now()).toLocaleDateString('sv-SE');return Date.parse(text+'T12:00:00Z')/86400000;}
function trainingPaused(s,now){const day=typeof now==='string'?now:new Date(now??Date.now()).toLocaleDateString('sv-SE');return !!s.paused&&(!s.pauseStarted||day>=s.pauseStarted)&&(!s.pauseUntil||day<s.pauseUntil);}
function activityRecovery(a){
 // Conservative app planning heuristic, not physiological or strength equivalence.
 if(a.effort==='hard')return 2;
 if(a.effort==='moderate')return ['trail','labor'].includes(a.type)&&a.duration>=60||a.type==='mountain'&&a.duration>=90?2:1;
 return a.duration>=120?1:0;
}
function validateActivity(a){
 const types=['mountain','gravel','road','indoor','hiking','trail','labor','other','mobility'];
 if(!a||typeof a!=='object'||typeof a.id!=='string'||!a.id||!types.includes(a.type)||!['planned','completed'].includes(a.status)||!['easy','moderate','hard'].includes(a.effort)||!Number.isFinite(a.duration)||a.duration<=0||a.duration>1440||typeof a.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(a.date)||!Number.isFinite(Date.parse(a.date+'T12:00:00Z'))||new Date(a.date+'T12:00:00Z').toISOString().slice(0,10)!==a.date)throw Error('Invalid activity');
 for(const key of ['distance','elevation'])if(a[key]!==undefined&&(!Number.isFinite(a[key])||a[key]<0))throw Error('Invalid activity measurement');
 if(a.notes!==undefined&&typeof a.notes!=='string'||a.replacesStrength!==undefined&&typeof a.replacesStrength!=='boolean')throw Error('Invalid activity details');
 if(a.versions!==undefined){if(!Array.isArray(a.versions)||a.versions.length>1000)throw Error('Invalid activity versions');for(const v of a.versions){if(!v||typeof v.at!=='string'||!Number.isFinite(Date.parse(v.at))||v.before?.versions!==undefined)throw Error('Invalid activity version');validateActivity(v.before);}}
 return a;
}
function movementEnabled(s,id){const pref=s.trainingPreferences||{},emphasis=pref.emphasis?trainingEmphasis(s).levels:null;const m=MOVES[id];if(!m)return false;if(emphasis&&(emphasis[m.complex?'complex':m.bodyweight?'bodyweight':m.gear]||'minor')==='off')return false;if(m.bodyweight)return pref.useBodyweight!==false;if(m.gear==='kb')return pref.useKb!==false&&(!m.pair||pref.useDoubleKb===true);if(m.gear==='club')return pref.useClub!==false&&(!m.clubPair||pref.useDoubleClub===true)&&(!['cast','circles','front'].includes(id)||pref.useTwoHandClub!==false);return true;}
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
 // 30-minute target has a 25–40-minute flexible window. Extension is reserved for a full priority prescription.
 // The same target window applies in Settings and Today's Adjustments.
 // 30-minute sessions have a 25–40 minute band; other targets allow ±5.
 const flexMax=budget.total===30?40:Math.min(120,budget.total+5);
 const maxMain=flexMax-budget.warmup-budget.cooldown;
 const pref=s.trainingPreferences||{};
 const emphasis=pref.emphasis?trainingEmphasis(s).levels:null;
 const enabled=id=>movementEnabled(s,id);
 if(block==='abc'){
  const fallback=pref.useKb!==false?['squat','press','row']:pref.useClub!==false?(pref.useTwoHandClub!==false?['front','circles','cast']:['clubInside','clubOutside']):[['bodyweightSquat','stepBackLunge','hingePractice'],['hipDropTwoHand','bearCrawl','bearSquat','hingePractice'],['pushup','catCrawl','hipDropSingleHand','hingePractice']][slot];
  if(!day.ids.some(enabled))day={name:pref.useKb!==false?'Strength fundamentals':pref.useClub!==false?'Club fundamentals':'Bodyweight fundamentals',focus:'Equipment-compatible foundation practice',ids:fallback.filter(enabled)};
 }
 // App composition: one eligible bodyweight support and one opt-in paired-club
 // pattern can join ABC; primary cycle targets remain independent.
 const supplemental=[];
 if(block==='abc'){
  const choose=pool=>pool.filter(id=>enabled(id)&&(MOVES[id].requires||[]).every(skill=>s.skills?.[skill]===true)&&(MOVES[id].defaultProfile!=='crawl'||pref.crawlSpace===true)&&(!MOVES[id].clubPair||(s.equipment?.clubPairs||[]).length>0)&&!day.ids.includes(id)&&!day.ids.some(x=>MOVES[x].family===MOVES[id].family)).filter(id=>{const rx=prescription(s,id,opts);return rx.sets>0&&(MOVES[id].bodyweight||availableWorkingLoads(s,id).includes(rx.weight));}).sort((a,b)=>{
   const learning=id=>{const e=practiceEvidence(s,id,opts);return e.recent&&e.count>0&&e.count<e.required;};
   if(learning(a)!==learning(b))return learning(a)?-1:1;
   if((pref.variety||'moderate')==='consistent')return pool.indexOf(a)-pool.indexOf(b);
   const last=id=>records(s,id).filter(x=>x.actualSets>0&&x.performed).at(-1)?.date||'';
   return last(a).localeCompare(last(b))||pool.indexOf(a)-pool.indexOf(b);
  })[0];
  const body=choose(SUPPORT_POOLS.bodyweight);if(body)supplemental.push(body);
  if(pref.useDoubleClub===true&&pref.skillSessions!==false){const club=choose(SUPPORT_POOLS.club);if(club)supplemental.push(club);}
 }
 const blockIds=block==='abc'?[...new Set([...days.flatMap(x=>x.ids),...day.ids,...Object.values(SUPPORT_POOLS).flat()])]:days.flatMap(x=>x.ids),support=supportingMoves(s,day.ids,opts);
 const allowed=new Set([...blockIds,...support,...COMPLEX_PATHWAYS.map(x=>x.id)]),pending=s.deferredByBlock?.[block]||(block==='abc'?s.deferredIds:[])||[];
 const latest=(s.sessions||[]).filter(x=>(x.block||'abc')===block&&calendarDay(x.date)<=calendarDay(opts.now)).sort((a,b)=>calendarDay(a.date)-calendarDay(b.date)).at(-1);
 const continuing=latest?.calendarVersion===1&&latest.items.some(x=>x.actualSets>0)&&latest.items.some(x=>!x.performed&&x.mode!=='baseline')&&pending.length>0;
 // On the third ABC day, substitute one eligible complex for overlapping basics.
 // Keep the existing day unchanged unless prerequisite evidence is current.
 const complexChoices=block==='abc'&&slot===2&&pref.useKb!==false&&pref.useComplexes!==false&&(!emphasis||emphasis.complex!=='off')&&!continuing
  ?complexityOptions(s,opts).filter(x=>x.ready):[];
 // Rotate among independently eligible complexes so a permanently ready
 // pathway cannot starve another. Use recorded exposures, not calendar turns.
 const complexPriority=['complexCleanPress','complexCleanSquatPress','complexDoubleCleanSquatPress'];
 const complexChoice=[...complexChoices].sort((a,b)=>
  records(s,a.id).length-records(s,b.id).length
  ||complexPriority.indexOf(a.id)-complexPriority.indexOf(b.id)
 )[0];
 const complexIds=complexChoice?[complexChoice.id]:[];
 // Keep fundamentals if the complex cannot actually be prescribed at a configured load.
 const replaced=new Set(complexChoice?.requires||[]);
 const candidateIds=[...new Set([...support,...pending.filter(id=>allowed.has(id)),...(continuing?[]:day.ids.filter(id=>!replaced.has(id))),...complexIds,...supplemental.filter(id=>!complexChoice||!MOVES[id].clubPair)])].filter(enabled);
 const focus=pref.focus||'balanced',variety=pref.variety||'moderate';
 const scored=id=>{const m=MOVES[id];if(!m)return 0;const family=m.family||'';return focus==='strength'?(['squat','press','pull','hinge'].includes(family)?2:0):focus==='capacity'?(['hinge','carry'].includes(family)?2:0):focus==='skill'?((m.practicePrereqs||[]).length?2:0):0;};
 // Prioritize eligible deferred work before accessories; never override recovery or prerequisites.
 // A deferred movement must not starve merely because an earlier accessory repeatedly fits first.
 const pendingOrder=new Map(pending.filter(id=>allowed.has(id)).map((id,i)=>[id,i]));
 const progressRank=id=>{const st=stateFor(s,id),p=st.policy;return st.phase==='ready'?-1:st.stage/(Math.max(1,(st.stagePhase==='density'?p.density:p.stages).length-1));};
 // Track completed exposures rather than calendar days: mobility and rest never
 // make a strength movement artificially overdue or advance its progression.
 const exposureSessions=(s.sessions||[])
  .filter(x=>calendarDay(x.date)<=calendarDay(opts.now)&&(x.items||[]).some(y=>y.actualSets>0&&y.performed))
  .sort((a,b)=>calendarDay(a.date)-calendarDay(b.date));
 const skippedExposures=id=>{
  const last=exposureSessions.findLastIndex(x=>(x.items||[]).some(y=>y.id===id&&y.actualSets>0&&y.performed));
  return last<0?exposureSessions.length:exposureSessions.length-1-last;
 };
 // Prefer underrepresented Major families without overriding deferred work,
 // readiness, or recovery. Counts are completed exposures, not calendar days.
 const familyOf=id=>{const m=MOVES[id];return m?.complex?'complex':m?.bodyweight?'bodyweight':m?.gear==='kb'?'kb':m?.gear==='club'?'club':null;};
 const priority=(emphasis||supplemental.length)?Object.fromEntries(EMPHASIS_FAMILIES.map(id=>[id,(emphasis||trainingEmphasis(s).levels)[id]==='major'?3:(emphasis||trainingEmphasis(s).levels)[id]==='minor'?1:0])):null;
 const familyExposure=Object.fromEntries(EMPHASIS_FAMILIES.map(id=>[id,0]));
 if(priority)for(const session of exposureSessions)for(const item of session.items||[]){
  if(item.actualSets>0&&item.performed){const family=familyOf(item.id);if(family)familyExposure[family]++;}
 }
 const familyDeficit=id=>{
  const family=familyOf(id);if(!priority||!family||!priority[family])return 0;
  const total=Object.values(familyExposure).reduce((a,b)=>a+b,0);
  const weightTotal=Object.values(priority).reduce((a,b)=>a+b,0);
  return (total+1)*priority[family]/Math.max(1,weightTotal)-familyExposure[family];
 };
 const ids=[...candidateIds].sort((a,b)=>{
  const ap=pendingOrder.has(a),bp=pendingOrder.has(b);
  if(ap!==bp)return ap?-1:1;
  if(ap&&bp)return pendingOrder.get(a)-pendingOrder.get(b);
  // A movement skipped for four completed lifting sessions gets a fair chance.
  // Otherwise stagger volume peaks by favoring the nearer cycle endpoint.
  const overdueA=skippedExposures(a)>=4,overdueB=skippedExposures(b)>=4;
  if(overdueA!==overdueB)return overdueA?-1:1;
  if(overdueA&&overdueB)return skippedExposures(b)-skippedExposures(a);
  return (priority?familyDeficit(b)-familyDeficit(a):0)||progressRank(b)-progressRank(a)||scored(b)-scored(a);
 });
 // Stable primary lifts remain; rotate only a single optional accessory after successful exposures.
 const completedCount=exposureSessions.length;
 if(block==='abc'&&variety!=='consistent'&&pref.skillSessions!==false){
  const pool=slot===0?['deadlift','pushup']:slot===1?['circles','clean']:['row','press'];
  const rotation=Math.floor(completedCount/(variety==='high'?1:3));
  for(let n=0;n<pool.length;n++){
   const id=pool[(rotation+n)%pool.length];
   if(enabled(id)&&!ids.includes(id)&&!ids.some(x=>MOVES[x]?.family===MOVES[id]?.family)){ids.push(id);break;}
  }
 }

 const items=[],deferred=[],held=[],unavailable=[],prerequisite=[],requirements=[],scheduled=[],timeBlocked=[];let used=0,hard=0;
 const today=calendarDay(opts.now),history=(s.sessions||[]).filter(x=>calendarDay(x.date)<=today);
 const trainingDays=new Set(history.filter(x=>today-calendarDay(x.date)<7&&(x.items||[]).some(y=>y.actualSets>0)).map(x=>x.date));
 const alreadyToday=history.some(x=>calendarDay(x.date)===today&&(x.items||[]).some(y=>y.actualSets>0));
 const weeklyLimit=Math.min(defaults.maxTrainingDays??7,pref.daysPerWeek??7,pref.focus==='strength'?4:7);
 const restDay=!alreadyToday&&trainingDays.size>=weeklyLimit;
 const previousTraining=history.filter(x=>calendarDay(x.date)<today&&(x.items||[]).some(y=>y.actualSets>0)).sort((a,b)=>calendarDay(b.date)-calendarDay(a.date))[0];
 const gap=previousTraining?today-calendarDay(previousTraining.date):Infinity;
 const consecutive=gap===1;
 // Recommend spacing for 3-4 day schedules; never silently block a flexible training day.
 const spacingRecommended=!alreadyToday&&!restDay&&consecutive&&weeklyLimit<=4;
 const recentDemands=new Set((previousTraining?.items||[]).filter(x=>x.actualSets>0).flatMap(x=>movementDemands(x.id)));

 for(const id of ids){
  if(!MOVES[id])continue;
  if(block==='abc'&&MOVES[id].bodyweight&&day.ids.some(x=>!MOVES[x].bodyweight)&&items.some(x=>x.bodyweight)){deferred.push(id);continue;}
  // App workload cap: one paired-club pattern per session; rotate deferred patterns.
  if((MOVES[id].clubPair&&items.some(x=>MOVES[x.id].clubPair||MOVES[x.id].complex))||(MOVES[id].complex&&items.some(x=>MOVES[x.id].clubPair))){deferred.push(id);continue;}
  if(trainingPaused(s,opts.now)){deferred.push(id);continue;}
  
  if(stateFor(s,id).hold){held.push(id);deferred.push(id);continue;}
  const lastTraining=history.filter(x=>(x.items||[]).some(y=>y.actualSets>0)).sort((a,b)=>a.date.localeCompare(b.date)).at(-1);
  const pauseReturn=!!s.pauseStarted&&lastTraining&&lastTraining.date<=s.pauseStarted&&today-calendarDay(lastTraining.date)>(defaults.reentryDays??14);
  let rx=prescription(s,id,{...opts,reentry:opts.reentry||pauseReturn});
  // Heavy/light here means alternating normal and reduced-volume exposures, NOT
  // changing to an unverified heavier bell. Light exposures are non-advancing.
  if(block==='abc'&&pref.focus!=='skill'&&rx.mode==='volume'&&rx.sets>=2&&rx.profile!=='wave'){
   const prior=records(s,id).filter(x=>x.actualSets>0&&x.performed&&x.mode!=='baseline');
   const light=prior.length%2===1;
   if(light){
    const reduced=Math.max(1,Math.floor(rx.sets*.7));
    if(reduced<rx.sets)rx={...rx,sets:reduced,mode:'light',reason:'Light exposure: '+reduced+' of '+rx.sets+' planned sets at the established load. This is deliberate reduced-volume practice; it does not advance the progression cycle.'};
   }
  }
  if(opts.omitUnstartedLoads&&!MOVES[id].bodyweight&&rx.mode==='baseline'){unavailable.push(id);requirements.push({id,reason:'Choose an owned familiar starting load in Settings → Advanced & Data → Movement Programming. Unstarted load setup is not unfinished physical work.'});continue;}
  if(rx.mode==='prerequisite'){prerequisite.push(id);requirements.push({id,reason:rx.reason});deferred.push(id);continue;}
  const demands=movementDemands(id);
  const recent=history.some(x=>today-calendarDay(x.date)<(defaults.minGapDays??0)&&(x.items||[]).some(y=>y.actualSets>0&&MOVES[y.id]&&movementDemands(y.id).some(d=>demands.includes(d))));
  const isHard=rx.track==='heavy'||rx.profile==='grind'||rx.mode==='density';
  // Consecutive sessions sharing major demands are light practice rather than hard progression.
  const overlap=consecutive&&demands.some(d=>recentDemands.has(d));
  if(overlap&&rx.mode==='volume'&&rx.sets>1&&rx.profile!=='wave'){
   const planned=rx.sets;
   rx={...rx,sets:Math.max(1,Math.floor(rx.sets*.7)),mode:'light',reason:'Consecutive-day overlap: reduced-volume practice instead of a second hard exposure; no progression credit. Original sets: '+planned+'.'};
  }
  const outside=(s.activities||[]).some(a=>a.status==='completed'&&calendarDay(a.date)<=today&&(today-calendarDay(a.date)<activityRecovery(a)||a.replacesStrength!==false&&today===calendarDay(a.date)));
  const repeat=s.trainingPreferences?.beginnerSpacing&&history.some(x=>today-calendarDay(x.date)<2&&(x.items||[]).some(y=>y.id===id&&y.actualSets>0));
  if(outside||repeat||restDay||recent||(isHard&&opts.avoidHard)||(isHard&&hard>=(defaults.maxHardMovements??3))){scheduled.push(id);deferred.push(id);continue;}
  const cost=minutesFor(rx)+(items.length?(items.at(-1).betweenExercises||0)/60:0);
  // The first movement that can actually be scheduled owns the flexible window.
  // Held, recovering, or prerequisite-blocked candidates must not consume priority.
  const priority=items.length===0;
  const limit=priority?maxMain:Math.max(budget.main,used);
  if(used+cost>limit+1e-8){deferred.push(id);timeBlocked.push({id,requiredMainMinutes:Math.ceil(cost),minimumTotalMinutes:Math.ceil(cost+budget.warmup+budget.cooldown),cannotFitAlone:cost>maxMain+1e-8,reason:cost>maxMain+1e-8?'Full progression exceeds the flexible session ceiling; no advancement credit is possible until the time allocation changes.':'Full prescription did not fit the priority-protected session; it remains deferred.'});continue;}
  items.push(rx);used+=cost;if(isHard)hard++;
 }
 return{block,slot,day:continuing?{...day,name:day.name+' · remaining work'}:day,support,items,deferred,timeBlocked,held,unavailable,prerequisite,requirements,scheduled,restDay,spacingRecommended,spacingReason:spacingRecommended?'A rest or easier activity day is recommended after yesterday’s workout; you may train if recovered.':'',paused:trainingPaused(s,opts.now),estimated:Math.ceil(used),total:Math.ceil(used)+budget.warmup+budget.cooldown,reentry:items.some(x=>x.mode==='reentry'),cap:maxMain,budget:{...budget,targetMain:budget.main,flexMax,main:maxMain},extended:used>budget.main+1e-8};
}
// Coordinate independent blocks across workouts; never blend their numeric protocols.
// Training Emphasis is a temporary scheduling preference, independent of equipment inventory.
const EMPHASIS_FAMILIES=['bodyweight','kb','club','complex'];
const EMPHASIS_LEVELS=['off','minor','major'];
function trainingEmphasis(s){
 const saved=s.trainingPreferences?.emphasis;
 const defaults={bodyweight:'minor',kb:'major',club:'minor',complex:'minor'};
 const levels=Object.fromEntries(EMPHASIS_FAMILIES.map(id=>[id,EMPHASIS_LEVELS.includes(saved?.[id])?saved[id]:defaults[id]]));
 return {levels,mobilityOnly:s.trainingPreferences?.mobilityOnly===true};
}
function validateTrainingEmphasis(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid training emphasis');
 for(const id of EMPHASIS_FAMILIES)if(!EMPHASIS_LEVELS.includes(value[id]))throw Error('Select Off, Minor or Major for '+id);
 if(EMPHASIS_FAMILIES.every(id=>value[id]==='off'))throw Error('Choose at least one training emphasis');
 return Object.fromEntries(EMPHASIS_FAMILIES.map(id=>[id,value[id]]));
}
function emphasisDistribution(s){
 const {levels,mobilityOnly}=trainingEmphasis(s);
 const effective=Object.fromEntries(EMPHASIS_FAMILIES.map(id=>[id,mobilityOnly?'off':levels[id]]));
 const weights=Object.fromEntries(EMPHASIS_FAMILIES.map(id=>[id,effective[id]==='major'?3:effective[id]==='minor'?1:0]));
 const total=Object.values(weights).reduce((a,b)=>a+b,0);
 return {levels,effective,weights,total,mobilityOnly,shares:Object.fromEntries(EMPHASIS_FAMILIES.map(id=>[id,total?weights[id]/total:0]))};
}
function mobilityOnlyPlan(s,opts={}){
 const budget=timeBudget(opts.minutes??s.defaultMinutes??45);
 const total=budget.total;
 return {block:s.programBlock||'abc',slot:0,day:{name:'Mobility & recovery',focus:'Unloaded movement, comfortable range of motion, and recovery',ids:[]},
  support:[],items:[],deferred:[],timeBlocked:[],held:[],unavailable:[],prerequisite:[],requirements:[],scheduled:[],
  restDay:false,spacingRecommended:false,spacingReason:'',paused:false,estimated:0,total,
  reentry:false,cap:0,budget:{...budget,targetMain:0,flexMax:total,main:0},extended:false,
  mobilityOnly:true,mobilityMinutes:total};
}
// Scheduling feedback and bounded continuity are app decisions, not source prescriptions.
function movementCadence(s,ids,now,absenceDays){
 const day=calendarDay(now),allowed=new Set(ids),rows=[];
 for(const id of allowed){
  const h=records(s,id).filter(x=>x.actualSets>0&&calendarDay(x.date)<=day&&day-calendarDay(x.date)<56);
  if(!h.length)continue;
  const dates=[...new Set(h.map(x=>x.date))].sort(),lastDate=dates.at(-1);
  const meanDays=dates.length>=3?Math.ceil((calendarDay(lastDate)-calendarDay(dates[0]))/(dates.length-1)):null;
  const reentries=h.filter(x=>x.mode==='reentry').length;
  rows.push({id,name:MOVES[id].name,sampleDays:dates.length,lastDate,gapDays:day-calendarDay(lastDate),meanDays,reentries,atRisk:meanDays!==null&&meanDays>absenceDays,repeatedReentry:reentries>=2});
 }
 return rows.sort((a,b)=>Number(b.repeatedReentry)-Number(a.repeatedReentry)||b.reentries-a.reentries||a.id.localeCompare(b.id));
}
function continuityCandidate(s,candidates,history,opts){
 if(opts.projection||s.programComposition?.continuity===false)return null;
 const physical=history.filter(x=>(x.items||[]).some(y=>y.actualSets>0)),latest=physical.at(-1);
 if(!latest)return null;
 const block=latest.block||'abc',candidate=candidates.find(x=>x.block===block&&x.p.items.length);
 if(!candidate)return null;
 // At most two follow-ups (three consecutive sessions total); never consume a
 // blocked opportunity or silently keep every other selected block waiting.
 let run=0;for(let i=physical.length-1;i>=0&&(physical[i].block||'abc')===block;i--)run++;
 if(run>=3&&candidates.some(x=>x.block!==block&&x.p.items.length))return null;
 const ids=(latest.items||[]).filter(x=>x.performed&&x.quality==='clean'&&!x.pain).filter(x=>candidate.p.items.some(rx=>rx.id===x.id&&!['review','prerequisite','reentry'].includes(rx.mode)));
 for(const item of ids){
  const evidence=practiceEvidence(s,item.id,opts);
  const returning=item.mode==='reentry';
  const recentReturn=physical.slice(-run).some(x=>(x.items||[]).some(y=>y.id===item.id&&y.mode==='reentry'&&y.performed&&y.quality==='clean'&&!y.pain));
  const learning=recentReturn&&evidence.recent&&evidence.count>0&&evidence.count<evidence.required;
  if(returning||learning)return{candidate,id:item.id,reason:returning?'Follow up recent reduced return practice':'Build on recent clean supporting practice'};
 }
 return null;
}
function retentionCandidate(s,candidates,history,opts){
 if(opts.projection||s.programComposition?.continuity===false)return null;
 const days=[...new Set(history.filter(x=>(x.items||[]).some(y=>y.actualSets>0)).map(x=>calendarDay(x.date)))].slice(-8);
 const interval=days.length>=3?Math.max(1,Math.ceil((days.at(-1)-days[0])/(days.length-1))):Math.ceil(7/(s.trainingPreferences?.daysPerWeek||3));
 const physical=history.filter(x=>(x.items||[]).some(y=>y.actualSets>0));
 const absence=s.trainingDefaults?.reentryDays??14,latest=physical.at(-1),block=latest?.block||'abc';
 let run=0;for(let i=physical.length-1;i>=0&&(physical[i].block||'abc')===block;i--)run++;
 const due=[];
 for(const candidate of candidates){
  if(run>=3&&candidate.block===block&&candidates.some(x=>x.block!==block&&x.p.items.length))continue;
  for(const rx of candidate.p.items){
   if(!['volume','light','density','milestone'].includes(rx.mode))continue;
   const gap=movementGap(s,rx.id,opts.now);
   if(gap>0&&gap<=absence&&gap+interval>absence)due.push({candidate,id:rx.id,gap});
  }
 }
 return due.sort((a,b)=>b.gap-a.gap||a.candidate.last-b.candidate.last)[0]||null;
}
function plan(s,opts={}){
 if(s.trainingPreferences?.mobilityOnly===true)return mobilityOnlyPlan(s,opts);
 const c=s.programComposition;
 if(!c?.enabled)return blockPlan(s,opts);
 validateComposition(c);
 const day=calendarDay(opts.now),history=(s.sessions||[]).filter(x=>calendarDay(x.date)<=day).sort((a,b)=>calendarDay(a.date)-calendarDay(b.date));
 const hardRecent=history.some(x=>day-calendarDay(x.date)<(c.hardGapDays??2)&&(x.items||[]).some(y=>y.actualSets>0&&(y.track==='heavy'||y.profile==='grind'||y.mode==='density')));
 const defaults={...s.trainingDefaults,minGapDays:Math.max(s.trainingDefaults?.minGapDays??0,c.minGapDays??1)};
 const candidates=c.blocks.map((block,order)=>{
  const last=history.findLastIndex(x=>(x.block||'abc')===block&&(x.items||[]).some(y=>y.actualSets>0));
  const p=blockPlan({...s,programBlock:block,trainingDefaults:defaults},{...opts,avoidHard:hardRecent,omitUnstartedLoads:true});
  return {block,order,last,p};
 }).sort((a,b)=>a.last-b.last||a.order-b.order);
 const latest=history.at(-1),unfinished=latest?.calendarVersion===1&&latest.items.some(x=>x.actualSets>0)&&latest.items.some(x=>!x.performed&&x.mode!=='baseline')?candidates.find(x=>x.block===(latest.block||'abc')&&x.p.items.length):null;
 const retention=unfinished?null:retentionCandidate(s,candidates,history,opts);
 const continuity=unfinished||retention?null:continuityCandidate(s,candidates,history,opts);
 const chosen=unfinished||retention?.candidate||continuity?.candidate||candidates.find(x=>x.p.items.length)||candidates[0],p=chosen.p;
 const recovery=p.items.some(x=>['recovery','reentry','rebuild','deload'].includes(x.mode));
 const skill=p.support.length>0||['getupPractice','clubIntermediate','groundPractice','hingePractice','hingePathway'].includes(p.block);
 const intensity=p.items.some(x=>x.track==='heavy'||x.profile==='grind'||x.mode==='density');
 const emphasis=recovery?'Recovery':skill?'Skill practice':intensity?'Intensity':'Volume';
 const pending=s.deferredByBlock?.[p.block]||[];
 // Observed cadence is planning feedback, never a progression or medical rule.
 const trainingDays=[...new Set(history.filter(x=>day-calendarDay(x.date)<56&&(x.items||[]).some(y=>y.actualSets>0)).map(x=>calendarDay(x.date)))].sort((a,b)=>a-b);
 const estimatedReturnDays=trainingDays.length>=4?Math.ceil((trainingDays.at(-1)-trainingDays[0])/(trainingDays.length-1)*c.blocks.length):null;
 const absenceDays=s.trainingDefaults?.reentryDays??14;
 const activeIds=[...new Set(candidates.flatMap(x=>[...BLOCKS[x.block].days.flatMap(d=>d.ids),...x.p.items.map(rx=>rx.id)]))].filter(id=>movementEnabled(s,id));
 const movementRows=opts.projection?[]:movementCadence(s,activeIds,opts.now,absenceDays);
 const repeated=movementRows.filter(x=>x.repeatedReentry),risk=movementRows.filter(x=>x.atRisk);
 const movementWarning=repeated.length?'Repeated reduced returns: '+repeated.slice(0,3).map(x=>x.name).join(', ')+(repeated.length>3?' and '+(repeated.length-3)+' more':'')+'. Consider fewer active patterns; missed work has not earned progression credit.':risk.length?'Some movements are recurring less often than the configured return window: '+risk.slice(0,3).map(x=>x.name).join(', ')+'. Review the rotation rather than adding catch-up work.':null;
 const cadence={movements:movementRows.filter(x=>x.repeatedReentry||x.atRisk).slice(0,3),movementSummary:{observed:movementRows.length,repeatedReentry:repeated.length,atRisk:risk.length},retention:retention?{id:retention.id,block:chosen.block}:null,continuity:continuity?{id:continuity.id,block:chosen.block}:null,sampleDays:trainingDays.length,estimatedReturnDays,absenceDays,warning:movementWarning||(estimatedReturnDays!==null&&estimatedReturnDays>absenceDays?'At your recent training frequency, revisiting every selected block may take longer than the absence window. Consider fewer active blocks; do not add catch-up work.':null)};
 const reason=!p.items.length?'All selected blocks are currently blocked or do not fit. Review the reasons below.':
  (unfinished?'Continue the last unfinished workout before later blocks.':retention?'Revisit '+MOVES[retention.id].name+' before its configured return window is exceeded, based on your recorded training frequency.':continuity?continuity.reason+' for '+MOVES[continuity.id].name+'. Existing progression and recovery requirements still apply.':chosen.last<0?'This selected block has not yet been practiced.':'This is the least recently practiced selected block that is ready and fits today.')+
  (pending.length?' Unfinished movements are considered first within this block.':'')+
  (p.support.length?' Supporting foundation practice is included to regain eligibility.':'');
 const status=x=>x.p.items.length?'Ready':x.p.paused?'Paused':x.p.held.length?'Pain review':x.p.scheduled.length?'Recovery schedule':x.p.prerequisite.length?'Prerequisites':x.p.unavailable.length?'Equipment':'Needs more time';
 return {...p,composition:{emphasis,reason,hardRecent,cadence,candidates:candidates.map(x=>({block:x.block,status:status(x)})),sourceIds:[548,578,...(p.items.some(x=>x.bodyweight)?[85]:[])],provenance:'Block selection, spacing and priority are configurable Strength Lab defaults; source methods remain independent.'}};
}
function validateComposition(c){
 if(c?.continuity!==undefined&&typeof c.continuity!=='boolean')throw Error('Invalid continuity preference');
 if(!c||typeof c!=='object'||Array.isArray(c)||typeof c.enabled!=='boolean'||!Array.isArray(c.blocks)||!c.blocks.length||c.blocks.length>Object.keys(BLOCKS).length||new Set(c.blocks).size!==c.blocks.length||c.blocks.some(id=>!Object.hasOwn(BLOCKS,id)))throw Error('Select unique known training blocks');
 for(const key of ['minGapDays','hardGapDays'])if(c[key]!==undefined&&(!Number.isInteger(c[key])||c[key]<0||c[key]>7))throw Error('Composition spacing must be 0–7 days');
}
function deferredAfter(plan,records){const pending=new Set(plan.deferred||[]);for(const record of records){if(record.mode==='baseline'){pending.delete(record.id);continue;}if(!(record.performed??record.completed))pending.add(record.id);else pending.delete(record.id);}return [...pending];}
function completeRecord(rx,actual,quality,pain){
 const sets=(actual||[]).filter(x=>x.done&&!x.skipped),totalTime=rx.durationScope==='total';
 const valid=x=>validWorkingWeight(rx.id,x.weight)&&Number.isInteger(Number(x.reps))&&Number(x.reps)>0&&(rx.side!==2||(x.bothSides===true&&Number.isInteger(Number(x.leftReps))&&Number(x.leftReps)>0&&Number.isInteger(Number(x.rightReps))&&Number(x.rightReps)>0));
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
 const sameStation=!rx.station||sets.every(x=>x.stationHeightCm===rx.station.heightCm&&(rx.station.kind==='rowBar'?x.legPosition===rx.station.legPosition:x.stepPattern===rx.station.stepPattern));
 const exactIntensity=rx.sourceParameters===null||rx.sourceParameters===undefined||sets.length===rx.sets&&(totalTime||sets.every(x=>Number(x.reps)===rx.reps&&(rx.side!==2||Number(x.leftReps??x.reps)===rx.reps&&Number(x.rightReps??x.reps)===rx.reps)));
 const cadence=(!rx.roundSeconds||sets.every(x=>x.timingValid===true))&&sets.every(x=>(x.restSeconds===undefined||x.restSeconds===rx.rest)&&(x.roundSeconds===undefined||x.roundSeconds===(rx.roundSeconds||0))); 
 const continuous=!rx.continuous||sets.every(x=>x.continuous===true);
 const performed=!rx.legacyTargetUnverified&&cadence&&continuous&&!['review','prerequisite'].includes(rx.mode)&&sets.length>0&&sets.length>=rx.sets&&sets.every(valid)&&reps>=rx.reps&&sameLoad&&bilateral&&!['hard','breakdown','pain'].includes(quality)&&!pain;
 return{id:rx.id,name:rx.name,weight,...(rx.station?{setupChanged:sets.length>0&&!sameStation}:{}),bodyweight:!!MOVES[rx.id]?.bodyweight,unit:rx.unit,actualSets:sets.length,actualReps:reps,targetSets:rx.sets,targetReps:rx.reps,rest:rx.rest,quality,pain:!!pain,mode:rx.mode,policyKey:rx.policyKey||'legacy-v1',profile:rx.profile||'legacy',track:rx.track||'base',roundSeconds:rx.roundSeconds||null,continuous:!!rx.continuous,durationScope:rx.durationScope||null,weakSide:rx.weakSide||null,sourceIds:rx.sourceIds||[],sourceParameters:rx.sourceParameters??null,exposureTarget:rx.exposureTarget??2,performed,completed:performed&&quality==='clean'&&sameStation&&exactIntensity&&weight===Number(rx.weight)&&!['baseline','light','recovery','reentry','time-fit','review','rebuild','deload','prerequisite'].includes(rx.mode),sets:actual};
}
function nextRest(plan,items,index){
 const rx=plan.items[index];if(!items.some(item=>item.sets.some(set=>!set.done)))return null;
 if(rx.continuous){if(items[index].sets.some(set=>!set.done))return null;return rx.betweenExercises?{seconds:rx.betweenExercises,label:'Rest between movements'}:null;}
 return{seconds:rx.rest,label:'Rest'};
}
function describeProgression(id,s={}){
 const p=policyFor(id,s),m=MOVES[id];
 if(p.profile==='deadliftPractice')return p.parameterNotes+' Practice '+p.volume.start+'–'+p.volume.end+' sets of '+p.volume.reps+'; load changes require explicit review after a clean cycle.';
 if(['crawl','doubleClub','doubleHinge'].includes(p.profile))return p.parameterNotes+' Current cycle (app defaults): '+p.volume.start+'–'+p.volume.end+' sets of '+p.volume.reps+(p.timed?' seconds':' reps')+', '+p.volume.rest+' seconds rest.';
 if(p.profile==='bodyweightPractice')return p.parameterNotes+' Practice '+p.volume.start+'–'+p.volume.end+' sets of '+p.volume.reps+(MOVES[id].side===2?' per lead leg.':' reps.')+' Rest '+p.volume.rest+' seconds. Height stays fixed until deliberately reassessed.';
 if(p.profile==='ground')return p.parameterNotes+' Practice '+p.volume.start+'–'+p.volume.end+' sets of '+p.volume.reps+(p.timed?' seconds.':MOVES[id].side===2?' per side.':' reps.');
 if(p.profile==='pushup')return 'Reviewed #609 method: 10–30 one-minute rounds, with '+(p.config.fraction??.4)*100+'% of a conservative clean-rep baseline, rounded down by the app. Review a new baseline explicitly at the endpoint; no daily maximum tests.';
 if(p.profile==='hingePractice')return 'Unloaded 2–3 sets of 10 from #704. Rest, pace estimates and promotion gates are app defaults; this is hinge preparation, not weighted deadlift progression.';
 if(p.profile==='getupDrill')return 'Practice '+m.name+' at 1 set of 3–'+m.practiceRepEnd+' per side. '+(m.practiceSourceNumbers?'The light-load rep pathway is discussed in #372; sets/rest/gates are app defaults.':'Teaching is source-linked; rep/set/rest targets are app defaults.')+' Supporting practice gates do not certify the next technique.';
 if(p.profile==='clubIntermediate')return 'Intermediate single-arm practice: '+p.volume.start+'–'+p.volume.end+' sets of '+p.volume.reps+' per side, continuous within a movement. Exact targets and evidence gates are app defaults; reviewed teaching and the general method are source-linked.';
 if(p.profile==='getup')return 'Alternate familiar single get-ups from 3 to 10 total minutes under load, in '+(p.config.stepSeconds??60)+'-second steps (#423/#658). Exposure gates are app defaults. Advanced multi-rep sets are not automatically assigned.';
 if(p.profile==='singleClub')return 'Build 4–20 sets of 5 per side without resting within a movement (#578); take a two-minute example break between movements (#581). Pendulums, pullovers and mills are later pathways, not automatically unlocked here.';
 return p.label+': '+p.volume.start+'–'+p.volume.end+' sets of '+p.volume.reps+(p.timed?' seconds.':'.')+(p.exactParametersSource===null?' These numeric targets are app defaults, not an independently verified source prescription.':' Source example #'+p.exactParametersSource+' informs the numeric targets; check its context before treating them as universal.')+' Promotion and recovery gates are app settings.';
}
function validWorkingWeight(id,value){const weight=Number(value);return Number.isFinite(weight)&&(MOVES[id]?.bodyweight?weight===0:weight>0);}
function retestPushup(s,baseline){const current=s.programming?.pushup||{};return configureMovement(s,'pushup',{...current,profile:'pushup',cleanBaseline:baseline,cycleRevision:(current.cycleRevision||0)+1});}
function validRowHeight(x){return typeof x==='number'&&Number.isFinite(x)&&x>=1&&x<=250;}
function validStepHeight(x){return typeof x==='number'&&Number.isFinite(x)&&x>=1&&x<=100;}
function validateStation(rx){if(MOVES[rx.id]?.station==='stepPlatform'){const station=rx.station;let key;try{key=JSON.parse(rx.policyKey);}catch{throw Error('Invalid step-up setup identity');}if(!station||station.kind!=='stepPlatform'||!validStepHeight(station.heightCm)||station.stepPattern!==MOVES[rx.id].stepPattern||!Array.isArray(key)||key[0]!=='step-practice-v1'||key[1]!==rx.id||key[8]!==station.heightCm)throw Error('Invalid step-up prescription setup or cycle identity');}if(MOVES[rx.id]?.station==='rowBar'&&(!rx.station||rx.station.kind!=='rowBar'||!validRowHeight(rx.station.heightCm)||rx.station.legPosition!=='bent'))throw Error('Invalid row prescription setup');if(MOVES[rx.id]?.station==='rowBar'){let key;try{key=JSON.parse(rx.policyKey);}catch{throw Error('Invalid row setup identity');}if(!Array.isArray(key)||key[0]!=='row-practice-v1'||key[7]!==rx.station.heightCm||key[8]!==rx.station.legPosition)throw Error('Row setup disagrees with its cycle identity');}}
function validateStationActual(set,rx){if(!set||typeof set!=='object'||Array.isArray(set))throw Error('Invalid actual set');if(set.stationHeightCm!==undefined&&!validRowHeight(set.stationHeightCm))throw Error('Invalid actual bar height');if(rx?.station?.kind==='stepPlatform'&&((set.stationHeightCm!==undefined&&!validStepHeight(set.stationHeightCm))||set.done&&(!validStepHeight(set.stationHeightCm)||!['alternating','static'].includes(set.stepPattern))))throw Error('Invalid actual step-platform setup');if(set.stepPattern!==undefined&&!['alternating','static'].includes(set.stepPattern))throw Error('Invalid actual stepping pattern');if(set.legPosition!==undefined&&!['bent','straight'].includes(set.legPosition))throw Error('Invalid actual row leg position');}
function validateProgramming(s){
 if(s.equipment?.stepPlatform!==undefined){const step=s.equipment.stepPlatform;if(!step||typeof step!=='object'||Array.isArray(step)||typeof step.available!=='boolean'||step.heightCm!==null&&!validStepHeight(step.heightCm)||step.available&&!validStepHeight(step.heightCm))throw Error('Invalid stable step-platform setup');}
 if(s.equipment?.rowBar!==undefined){const row=s.equipment.rowBar;if(!row||typeof row!=='object'||Array.isArray(row)||typeof row.available!=='boolean'||row.heightCm!==null&&!validRowHeight(row.heightCm)||row.available&&!validRowHeight(row.heightCm))throw Error('Invalid secured row-bar setup');}

 if(s.equipment!==undefined){if(!s.equipment||typeof s.equipment!=='object'||Array.isArray(s.equipment))throw Error('Invalid equipment');for(const key of ['maxKbKg','maxClubLb'])if(s.equipment[key]!==undefined&&(!Number.isFinite(s.equipment[key])||s.equipment[key]<1||s.equipment[key]>100))throw Error('Invalid equipment ceiling: '+key);if(s.equipment.pairs!==undefined&&(!Array.isArray(s.equipment.pairs)||s.equipment.pairs.some(w=>!Number.isFinite(w)||w<=0||(s.equipment.maxKbKg!==undefined&&w>s.equipment.maxKbKg))))throw Error('Invalid matched kettlebell pairs');}

 if(s.trainingPreferences!==undefined){const p=s.trainingPreferences;if(p&&typeof p==='object'){for(const key of ['useKb','useClub','useBodyweight','crawlSpace','useDoubleKb','useDoubleClub','useTwoHandClub','useComplexes','conditioning','skillSessions'])if(p[key]!==undefined&&typeof p[key]!=='boolean')throw Error('Invalid training preference: '+key);if(p.focus!==undefined&&!['balanced','strength','capacity','skill'].includes(p.focus))throw Error('Invalid training focus');if(p.variety!==undefined&&!['consistent','moderate','high'].includes(p.variety))throw Error('Invalid variety');if(p.emphasis!==undefined)validateTrainingEmphasis(p.emphasis);if(p.mobilityOnly!==undefined&&typeof p.mobilityOnly!=='boolean')throw Error('Invalid mobility-only setting');if(p.useKb===false&&p.useClub===false&&p.useBodyweight===false)throw Error('Select at least one equipment type');}if(!p||typeof p!=='object'||!Number.isInteger(p.daysPerWeek)||p.daysPerWeek<1||p.daysPerWeek>7||p.beginnerSpacing!==undefined&&typeof p.beginnerSpacing!=='boolean'||p.activityTypes!==undefined&&(!Array.isArray(p.activityTypes)||p.activityTypes.some(x=>!['mountain','gravel','road','indoor','hiking','trail','labor','other'].includes(x))))throw Error('Invalid training setup');}
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
 if(s.equipment?.clubPairs!==undefined&&(!Array.isArray(s.equipment.clubPairs)||s.equipment.clubPairs.some(w=>!Number.isFinite(w)||w<=0||!(s.equipment.club||[]).includes(w)||(s.equipment.maxClubLb!==undefined&&w>s.equipment.maxClubLb))))throw Error('Matched club pairs must be owned per-club weights within the ceiling');
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
  validateStation(rx);if(m.station==='stepPlatform'&&(rx.station.heightCm!==s.equipment?.stepPlatform?.heightCm||!s.equipment?.stepPlatform?.available))throw Error('Step-up draft does not match available configured platform');if(m.station==='rowBar'&&rx.station.heightCm!==s.equipment?.rowBar?.heightCm)throw Error('Row draft does not match configured bar height');
  if(m.defaultProfile==='doubleHinge'&&!availableWorkingLoads(s,rx.id).includes(rx.weight))throw Error('Paired hinge draft requires its configured owned matched load');
  if(m.bodyweight&&rx.weight!==0)throw Error('Invalid bodyweight draft');
  if(rx.profile!==undefined&&!availableProfiles(rx.id).includes(rx.profile))throw Error('Invalid draft profile');
  if(rx.profile!==undefined){const policy=policyFor(rx.id,s);if(rx.profile!==policy.profile||rx.policyKey!==undefined&&rx.policyKey!==policy.key||!!rx.bodyweight!==!!m.bodyweight||!!rx.continuous!==policy.continuous||(rx.durationScope||null)!==policy.durationScope||(rx.roundSeconds||null)!==policy.roundSeconds)throw Error('Draft does not match its programming');}
  if(rx.sourceIds!==undefined&&(!Array.isArray(rx.sourceIds)||rx.sourceIds.some(id=>!Number.isInteger(id)||id<0||id>719)))throw Error('Invalid draft sources');
  for(const set of item.sets){
   validateStationActual(set,rx);
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
 const ids=new Set();for(const rx of p.items){const m=MOVES[rx?.id];if(!m||ids.has(rx.id)||rx.name!==m.name||rx.unit!==m.unit||rx.side!==m.side||!Number.isInteger(rx.sets)||rx.sets<1||rx.sets>200||!Number.isInteger(rx.reps)||rx.reps<1||!num(rx.weight)||!num(rx.rest)||m.bodyweight&&rx.weight!==0)throw Error('Invalid written prescription');ids.add(rx.id);validateStation(rx);}
}
function validateAdjustments(a){if(!a||typeof a!=='object'||Array.isArray(a)||!Array.isArray(a.changes)||a.changes.some(x=>typeof x!=='string')||!['normal','low','great'].includes(a.readiness))throw Error('Invalid adjustment record');timeBudget(a.normalMinutes);timeBudget(a.minutes);}
function validateNotebookRecord(item){
 const rx=item.prescription,m=MOVES[item.id],num=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
 if(!rx||rx.id!==item.id||rx.name!==m.name||rx.unit!==m.unit||rx.side!==m.side||!Number.isInteger(rx.sets)||rx.sets<1||rx.sets>200||!Number.isInteger(rx.reps)||rx.reps<1||!num(rx.weight)||!num(rx.rest)||!Array.isArray(item.sets)||item.sets.length>200)throw Error('Invalid recorded notebook prescription');
 validateStation(rx);
 if(rx.bodyweight!==undefined&&rx.bodyweight!==!!m.bodyweight||m.bodyweight&&rx.weight!==0)throw Error('Invalid notebook load');
 if(rx.roundSeconds!==null&&rx.roundSeconds!==undefined&&!num(rx.roundSeconds))throw Error('Invalid recorded interval');
 for(const set of item.sets){validateStationActual(set,rx);if(!set||typeof set!=='object'||typeof set.done!=='boolean'||!Number.isInteger(set.reps)||set.reps<0||!num(set.weight)||m.bodyweight&&set.weight!==0)throw Error('Invalid recorded actual set');
  for(const k of ['done','bothSides','continuous','timingValid','skipped'])if(set[k]!==undefined&&typeof set[k]!=='boolean')throw Error('Invalid recorded confirmation');
  for(const k of ['leftReps','rightReps'])if(set[k]!==undefined&&(!Number.isInteger(set[k])||set[k]<0))throw Error('Invalid recorded side count');
  for(const k of ['restSeconds','roundSeconds','transitionSeconds'])if(set[k]!==undefined&&!num(set[k]))throw Error('Invalid recorded timing');
 }
 const derived=completeRecord(rx,item.sets,item.quality,item.pain);if(rx.station&&item.setupChanged!==derived.setupChanged)throw Error('Recorded setup comparison disagrees with actuals');
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
 if(input.loadResetAfter!==undefined){
  if(!object(input.loadResetAfter))throw Error('Invalid load reset boundaries');
  for(const [id,key] of Object.entries(input.loadResetAfter))
   if(!Object.hasOwn(MOVES,id)||MOVES[id].bodyweight||typeof key!=='string'||!key||key.length>256||(key!=='__start__'&&!input.sessions.some((session,index)=>session.items.some((item,itemIndex)=>item.id===id&&`${session.id||session.date+':'+index}:${itemIndex}`===key))))
    throw Error('Invalid load reset boundary');
 }
 const sessionIds=new Set(),draftIds=new Set();
 for(const session of input.sessions){
  if(!object(session)||typeof session.id!=='string'||typeof session.title!=='string'||typeof session.date!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(session.date)||!Number.isFinite(Date.parse(session.date+'T12:00:00Z'))||new Date(session.date+'T12:00:00Z').toISOString().slice(0,10)!==session.date||!Array.isArray(session.items))throw Error('Invalid training entry');
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
   validateBackup({...input,loadResetAfter:undefined,sessions:[{id:session.id,title:session.title,date:revision.before.date,items:revision.before.items}],workoutDraft:null});
  }}
  if(sessionIds.has(session.id))throw Error('Duplicate workout identity');sessionIds.add(session.id);
  if(session.draftId!==undefined&&session.draftId!==null){if(typeof session.draftId!=='string'||!session.draftId||draftIds.has(session.draftId))throw Error('Duplicate or invalid workout draft identity');draftIds.add(session.draftId);}
  const movementIds=new Set();
  for(const item of session.items){
   if(MOVES[item?.id]?.station&&!item?.prescription)throw Error('Station-based history requires its original setup prescription');
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
 return JSON.parse(JSON.stringify({...input,workoutDraft,nextWeights:input.nextWeights||{},defaultMinutes:input.defaultMinutes??45,deferredIds:input.deferredIds||[]}));
}
return{trainingEmphasis,validateTrainingEmphasis,emphasisDistribution,mobilityOnlyPlan,COMPLEX_PATHWAYS,complexityOptions,repairMissingLoadAnchor,setInitialLoad,replaceUnavailableLoad,availableWorkingLoads,trainingPaused,activityRecovery,validateActivity,movementCadence,MOVES,SKILLS,DAYS,BLOCKS,LOADS,PROFILE_NAMES,describeProgression,policyFor,availableProfiles,configureMovement,practiceEvidence,supportingMoves,requirementLabel,prerequisites,chooseCycle,loadOptions,selectLoad,retestPushup,validWorkingWeight,validateProgramming,validateDraft,validateBackup,records,successful,stateFor,prescription,minutesFor,timeBudget,plan,completeRecord,nextRest,deferredAfter,resolvePain,movementGap,movementDemands};
});
