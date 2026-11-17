#!/usr/bin/env node
'use strict';
// Stable, human-review queue; scores prioritize review, never imply evidence quality.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const input=JSON.parse(fs.readFileSync(path.join(root,'research/passage-candidates.generated.json'),'utf8'));
const ledger=JSON.parse(fs.readFileSync(path.join(root,'research/source-concept-ledger.generated.json'),'utf8'));
const link=new Map(ledger.sources.map(x=>[x.source_id,x]));
const weights={'long-term-training':6,'program-variety':6,'heavy-light':5,'volume-progression':5,'density-timing':5,'skill-complexity':5,'recovery':5,'warmup-cooldown':5,'training-frequency':4,'prerequisite':4,'equipment-progression':4,'technique-correction':2};
const rows=input.sources.map(s=>{const categories=[...new Set(s.candidates.map(c=>c.concept_candidate))];const linked=link.get(s.source_id);const score=categories.reduce((n,c)=>n+(weights[c]||1),0)+(linked?.linked_instruction_concepts.length?2:0)+(linked?.linked_programming_example_concepts.length?2:0);return {source_id:s.source_id,video_key:s.video_key,title:s.title,review_priority_score:score,matched_categories:categories,passage_count:s.candidates.length,declared_movement_links:linked?.linked_instruction_concepts||[],declared_programming_links:linked?.linked_programming_example_concepts||[],review_state:'not_human_reviewed_in_this_queue',required_review:['Read full source context, not only matched excerpt','Distinguish example from universal rule','Record exact text offset and transcript quote in private working notes','Identify distinct concepts, duplicates, conflicts and destination','Mark visual-dependent claims pending unless video verified']};});
rows.sort((a,b)=>b.review_priority_score-a.review_priority_score||a.source_id-b.source_id);
const out={schema_version:1,scope:'Candidate triage only; ranked keyword coverage is not a claim about source value, accuracy, or integration',total_usable_sources:rows.length,review_order:rows};
if(rows.length!==719)throw Error('Expected 719 usable sources');
const file=path.join(root,'research/passage-review-queue.generated.json'),content=JSON.stringify(out,null,2)+'\n';
if(process.argv.includes('--check')){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==content)throw Error('Review queue is stale');}else fs.writeFileSync(file,content);
console.log(JSON.stringify({sources:rows.length,with_candidates:rows.filter(x=>x.passage_count>0).length,top_review:rows.slice(0,15).map(x=>({id:x.source_id,score:x.review_priority_score,categories:x.matched_categories}))},null,2));
