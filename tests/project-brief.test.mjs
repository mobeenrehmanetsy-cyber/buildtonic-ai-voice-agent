import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyBrief, briefRows, formatBrief, needsListedConsent } from '../app/start-project/model.ts';
test('irrelevant historic consent and size answers do not leak into an exported brief',()=>{
 const b={...emptyBrief,service:'Survey or building concern',heritage:'Not listed / no known heritage status',listedConsent:'Consent granted',size:'Old stale value'};
 const text=formatBrief(b);
 assert.equal(needsListedConsent(b),false);
 assert.ok(!text.includes('Consent granted'));assert.ok(!text.includes('Old stale value'));
});
test('uncertain heritage status retains the consent question',()=>{
 assert.equal(needsListedConsent({...emptyBrief,heritage:'Unsure'}),true);
 assert.equal(needsListedConsent({...emptyBrief,heritage:'Grade II listed',service:'Extension or renovation'}),true);
});
test('export retains user text and makes omitted fields and acknowledgement explicit',()=>{
 const b={...emptyBrief,name:'  Example Person  ',description:'Kitchen & dining\nKeep the old door.',consent:true};
 assert.equal(briefRows(b).find(([key])=>key==='Name')[1],'Example Person');
 assert.ok(formatBrief(b).includes('Kitchen & dining\nKeep the old door.'));
 assert.ok(formatBrief(b).includes('Not specified'));
 assert.ok(formatBrief(b).includes('Agreed to sharing'));
});
