#!/usr/bin/env node
'use strict';
// Candidate passage discovery only. A regex hit is not a verified training instruction.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const archive=Array.from({length:24},(_,i)=>require(path.join(root,'sources-'+String(i).padStart(2,'0')+'.json'))).flat();
const manifest=require(path.join(root,'research/supplied-review-manifest.json'));
const rules=[
{id:'volume-progression',kind:'progression',re:/\b(?:volume cycle|increase (?:the )?(?:sets|reps)|add (?:one|a) set|start with (?:five|ten) sets)\b/gi},
{id:'density-timing',kind:'dose',re:/\b(?:density cycle|every minute on the minute|\bEMOM\b|work rest ratio|work to rest ratio)\b/gi},
{id:'heavy-light',kind:'program_composition',re:/\b(?:heavy light|heavy day|light day|heavy and light|light and heavy)\b/gi},
{id:'training-frequency',kind:'program_composition',re:/\b(?:twice a week|three times a week|four days a week|days per week|times per week)\b/gi},
{id:'long-term-training',kind:'lifelong_philosophy',re:/\b(?:rest of your life|for the rest of your life|train for life|training for life|long term training|long-term training|decades)\b/gi},
{id:'skill-complexity',kind:'progression',re:/\b(?:add complexity|increase complexity|complexity before|complexity of movement|learn the movement|master the movement)\b/gi},
{id:'recovery',kind:'recovery',re:/\b(?:recovery day|active recovery|deload|rest day|recover from|recovery time)\b/gi},
{id:'prerequisite',kind:'prerequisite',re:/\b(?:before you (?:can|start|do)|prerequisite|must learn|learn (?:to|how to).*before)\b/gi},
{id:'technique-correction',kind:'troubleshooting',re:/\b(?:common mistake|do not let|don't let|avoid doing|make sure you|keep your (?:back|wrist|elbow|shoulder))\b/gi},
{id:'warmup-cooldown',kind:'decision_rule',re:/\b(?:warm.?up|cool.?down|joint mobility|mobility practice)\b/gi},
{id:'equipment-progression',kind:'progression',re:/\b(?:increase the weight|go up in weight|move up in weight|heavier kettlebell|heavier club)\b/gi},
{id:'program-variety',kind:'program_composition',re:/\b(?:program tetris|tetris of training|alternating days|rotate (?:the|your) workouts|different training days)\b/gi}
];
const rows=[],totals=Object.fromEntries(rules.map(x=>[x.id,{sources:0,passages:0}]));
for(const r of archive){const key=new URL(r.url).searchParams.get('v');if(key===manifest.accounting.unusable_source_key)continue;const text=r.text||'';const matches=[];for(const rule of rules){rule.re.lastIndex=0;let m,n=0;while((m=rule.re.exec(text))&&n<2){const start=Math.max(0,m.index-110),end=Math.min(text.length,m.index+m[0].length+160);matches.push({concept_candidate:rule.id,kind:rule.kind,match:m[0],offset:m.index,excerpt:text.slice(start,end).replace(/\s+/g,' ').trim(),evidence_status:'candidate_unreviewed'});n++;if(rule.re.lastIndex===m.index)rule.re.lastIndex++;}if(n){totals[rule.id].sources++;totals[rule.id].passages+=n;}}
rows.push({source_id:r.id,video_key:key,title:r.title,candidates:matches});}
rows.sort((a,b)=>a.source_id-b.source_id);
const output={schema_version:1,disclaimer:'Keyword-matched excerpts for human source review. No extracted passage is verified as an instruction or a general programming rule. Nonmatches do not mean the source lacks useful content.',usable_sources:rows.length,source_with_candidates:rows.filter(x=>x.candidates.length).length,source_without_candidates:rows.filter(x=>!x.candidates.length).length,concept_candidate_totals:totals,sources:rows};
if(rows.length!==719)throw Error('Expected 719 usable sources, got '+rows.length);
const dest=path.join(root,'research/passage-candidates.generated.json'),content=JSON.stringify(output,null,2)+'\n';
if(process.argv.includes('--check')){if(!fs.existsSync(dest)||fs.readFileSync(dest,'utf8')!==content)throw Error('Stale candidate output; regenerate');}else fs.writeFileSync(dest,content);
console.log(JSON.stringify({usable_sources:output.usable_sources,source_with_candidates:output.source_with_candidates,source_without_candidates:output.source_without_candidates,concept_candidate_totals:totals},null,2));
