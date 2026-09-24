import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,project,unproject,advance,blocked,path} from '../isometric/model.js';
test('projection and pointer inverse agree',()=>{for(const [x,y]of [[1,1],[4,6],[8,10]]){const p=project(x,y),q=unproject(p.x,p.y);assert.ok(Math.abs(q.x-x)<1e-8&&Math.abs(q.y-y)<1e-8);}});
test('arrows move in screen direction rather than reversing at diagonal axes',()=>{for(const [x,y]of [[1,0],[-1,0],[0,1],[0,-1]]){const s=initial(),p=project(s.x,s.y);advance(s,x,y,.1);const q=project(s.x,s.y);if(x){assert.ok((q.x-p.x)*x>0);assert.ok(Math.abs(q.y-p.y)<1e-6);}else{assert.ok((q.y-p.y)*y>0);assert.ok(Math.abs(q.x-p.x)<1e-6);}}});
test('counter and cutaway boundaries block movement; wall changes service route',()=>{const s=initial();assert.ok(blocked(2,1.5,s));assert.ok(blocked(3,9,s));assert.equal(path(s,8.1,10.45).length,0);s.gate=true;assert.ok(path(s,8.1,10.45).length>0);});
test('pause freezes movement and time',()=>{const s=initial();s.paused=true;const before=JSON.stringify(s);advance(s,1,1,.1);assert.equal(JSON.stringify(s),before);});
