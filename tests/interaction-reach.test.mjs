import test from 'node:test';import assert from 'node:assert/strict';
import {newLibrary,libraryAction} from '../two-d/levels/library-model.js';
import {newStore,storeAction} from '../two-d/levels/toystore-model.js';
import {newPlatform} from '../two-d/levels/platform-model.js';
import {tickAmbush,ambushHazards} from '../two-d/levels/platform-ambush.js';
test('telephone can be reached from front, back and left side of desk',()=>{for(const [x,y]of [[148,220],[148,151],[110,186]]){const s=newLibrary();Object.assign(s,{x,y});assert.equal(libraryAction(s),'phone');}const s=newLibrary();Object.assign(s,{x:230,y:150});assert.equal(libraryAction(s,'phone'),null);});
test('rabbit is reachable in front of its pedestal but not across the room',()=>{for(const [x,y]of [[436,148],[413,129],[454,134]]){const s=newStore();Object.assign(s,{x,y,entry:1});assert.equal(storeAction(s),'music');}const s=newStore();Object.assign(s,{x:350,y:150,entry:1});assert.equal(storeAction(s,'music'),null);});
test('arrows lodge at their target, cease damaging and expire after their fade',()=>{const s=newPlatform(1);s.ambush.arrows.push({id:'test',age:1.34,startX:100,startY:600,controlX:100,controlY:300,targetX:600,targetY:470,x:590,y:460});tickAmbush(s,.02);const a=s.ambush.arrows[0];assert.equal(a.stuck,true);assert.equal(a.x,600);assert.equal(a.y,470);assert.equal(ambushHazards(s).find(h=>h.id==='test').active,false);tickAmbush(s,.8);assert.equal(a.x,600);assert.ok(s.ambush.arrows.includes(a));tickAmbush(s,.6);assert.ok(!s.ambush.arrows.includes(a));});
