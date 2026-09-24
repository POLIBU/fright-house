import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,blocked,move,tick,pathTo} from '../two-d/model.js';
test('L-shaped room excludes black void and counter; rotating wall opens corridor',()=>{assert.ok(blocked(300,270,true));assert.ok(blocked(100,118,true));assert.ok(blocked(418,214,false));assert.equal(blocked(418,214,true),false);assert.equal(blocked(190,180,false),false);});
test('directional movement follows the screen and cannot pass through the closed wall',()=>{const s=initial();move(s,-1,0,.1);assert.ok(s.x<192);move(s,1,0,.1);assert.equal(s.x,192);s.x=418;s.y=205;for(let i=0;i<50;i++)move(s,0,1,.02);assert.ok(s.y<211);s.wallOpen=true;for(let i=0;i<50;i++)move(s,0,1,.02);assert.ok(s.y>240);});
test('creature has a route through the opened corridor, cannot pursue through closed wall',()=>{const s=initial();s.x=418;s.y=320;assert.equal(pathTo(s),null);s.wallOpen=true;assert.ok(pathTo(s));s.phase='chase';s.monster.delay=0;for(let i=0;i<900;i++){tick(s,1/60);assert.equal(blocked(s.monster.x,s.monster.y,true),false);}assert.equal(s.phase,'caught');});
