/* Shared saved controls; physical prescriptions and history remain in the engine. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./engine.js'):root.StrengthEngine);if(typeof module==='object'&&module.exports)module.exports=api;else root.TrainingSettings=api;})(typeof globalThis!=='undefined'?globalThis:this,function(E){
'use strict';
const intervals={prepare:10,work:20,rest:10,sets:8};
function checked(s){E.timeBudget(s.defaultMinutes??45);E.validateProgramming(s);return s;}
function durationChoices(s){return [...new Set([25,30,45,60,75,90,120,s.defaultMinutes??45])].sort((a,b)=>a-b);}
function schedule(s,{minutes=s.defaultMinutes??45,daysPerWeek=s.trainingPreferences?.daysPerWeek??3}){if(!Number.isInteger(daysPerWeek)||daysPerWeek<1||daysPerWeek>7)throw Error('Choose 1–7 training days');if(s.trainingPreferences?.focus==='strength'&&daysPerWeek>4)throw Error('Strength emphasis supports at most four sessions per week');return checked({...s,defaultMinutes:minutes,trainingPreferences:{...s.trainingPreferences,daysPerWeek}});}
function style(s,{focus,variety,conditioning,skillSessions}){if(!['balanced','strength','capacity','skill'].includes(focus)||!['consistent','moderate','high'].includes(variety)||typeof conditioning!=='boolean'||typeof skillSessions!=='boolean')throw Error('Invalid workout style');if(focus==='strength'&&(s.trainingPreferences?.daysPerWeek??3)>4)throw Error('Set training days to four or fewer before choosing Strength emphasis');return checked({...s,trainingPreferences:{daysPerWeek:3,...s.trainingPreferences,focus,variety,conditioning,skillSessions}});}
function forToday(s,value,date){return checked({...s,todayReadiness:{date,value}});}
function timerIntervals(s,patch){return checked({...s,intervalPreferences:{...intervals,...s.intervalPreferences,...patch}});}
return{durationChoices,schedule,style,forToday,timerIntervals};
});
