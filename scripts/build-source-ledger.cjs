#!/usr/bin/env node
'use strict';
// Deterministic, read-only archive accounting. Candidate links are not integration evidence.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const archive=Array.from({length:24},(_,i)=>({shard:'sources-'+String(i).padStart(2,'0')+'.json',records:require(path.join(root,'sources-'+String(i).padStart(2,'0')+'.json'))})).flatMap(({shard,records})=>records.map(r=>({...r,shard})));
const manifest=require(path.join(root,'research/supplied-review-manifest.json'));
const operational=require(path.join(root,'research/movement-integration-coverage.json'));
const curriculum=require(path.join(root,'research/curriculum-coverage-current.json'));
const excluded=manifest.accounting.unusable_source_key;
const byId=new Map(),byKey=new Map(),issues=[];
const concepts=operational.rows.map(m=>({concept_id:'movement:'+m.id,kind:'movement',name:m.name,destination:['engine','movement_instruction'],implementation_status:m.operational?'implemented':'unimplemented',instruction_status:m.sourceComplete?'reviewed_outline':'partial_or_unsourced',direct_instruction_source_ids:m.sourceIds||[],programming_example_source_id:m.exactParameters||null}));
const instructionMap=new Map(),policyMap=new Map();
for(const c of concepts){for(const id of c.direct_instruction_source_ids){if(!instructionMap.has(id))instructionMap.set(id,[]);instructionMap.get(id).push(c.concept_id);}if(c.programming_example_source_id!=null){const id=c.programming_example_source_id;if(!policyMap.has(id))policyMap.set(id,[]);policyMap.get(id).push(c.concept_id);}}
const journal=new Map(manifest.independent_reviews.map(r=>[r.source_key,r]));
const rows=archive.map(r=>{let key=null;try{key=new URL(r.url).searchParams.get('v');}catch{issues.push('Invalid URL source '+r.id);}
if(byId.has(r.id))issues.push('Duplicate ID '+r.id);else byId.set(r.id,r);
if(key&&byKey.has(key))issues.push('Duplicate video key '+key);else if(key)byKey.set(key,r);
const source=curriculum.sources.find(x=>x.id===r.id);
const instruction=instructionMap.get(r.id)||[],programming=policyMap.get(r.id)||[];
return {source_id:r.id,video_key:key,shard:r.shard,title:r.title,usable:key!==excluded,raw_text_sha256:sha(r.text),review_state:journal.has(key)?'independent_journal_claim_unreconciled':'master_ledger_unavailable',candidate_categories:source?.candidate_categories||[],linked_instruction_concepts:instruction,linked_programming_example_concepts:programming,link_status:instruction.length||programming.length?'declared_in_existing_coverage_not_full_text_verified':'unmapped_in_operational_movement_coverage',unresolved:['No complete anchored concept extraction has been performed']};});
rows.sort((a,b)=>a.source_id-b.source_id);
const summary={total:rows.length,usable:rows.filter(x=>x.usable).length,excluded:rows.filter(x=>!x.usable).map(x=>({id:x.source_id,key:x.video_key})),unique_ids:byId.size,unique_video_keys:byKey.size,independent_journal_keys_matched:rows.filter(x=>journal.has(x.video_key)).length,direct_instruction_linked_sources:rows.filter(x=>x.linked_instruction_concepts.length).length,programming_example_linked_sources:rows.filter(x=>x.linked_programming_example_concepts.length).length,unmapped_sources:rows.filter(x=>x.usable&&x.link_status.startsWith('unmapped')).length,operational_concepts:concepts.length,issues};
if(summary.total!==720||summary.usable!==719||summary.excluded.length!==1||summary.excluded[0].id!==441||issues.length){console.error(JSON.stringify(summary,null,2));process.exit(1);}
const output={schema_version:1,scope:'Deterministic accounting and declared-link discovery, not full transcript concept review or certification of Wildman fidelity',generated_from:['sources-00.json..sources-23.json','research/supplied-review-manifest.json','research/movement-integration-coverage.json','research/curriculum-coverage-current.json'],summary,concepts,sources:rows};
const out=path.join(root,'research/source-concept-ledger.generated.json');
if(process.argv.includes('--check')){if(!fs.existsSync(out)||fs.readFileSync(out,'utf8')!==JSON.stringify(output,null,2)+'\n'){console.error('Generated ledger is stale. Run node scripts/build-source-ledger.cjs');process.exit(1);}}else{fs.writeFileSync(out,JSON.stringify(output,null,2)+'\n');}
console.log(JSON.stringify(summary,null,2));
