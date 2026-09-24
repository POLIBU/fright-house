import test from 'node:test';
import assert from 'node:assert/strict';
import {newStreet,blocked,move,near,path,tick,INTERACTIONS,wheelAngle,bulbLevel} from '../two-d/levels/street-model.js';
test('all street interactions can be reached from the park gate',()=>{const s=newStreet();for(const o of INTERACTIONS)assert.ok(path(s,o.x,o.y).length,o.id);});
test('fences, bench and facade block the player; opening turnstile enables entry',()=>{const s=newStreet();for(const [x,y]of [[155,225],[60,243],[345,277],[239,131]])assert.ok(blocked(x,y,s));s.gate=true;tick(s,.65);assert.equal(blocked(239,133,s),false);});
test('directional controls match the screen and cannot pass through a fence',()=>{const s=newStreet();move(s,-1,0,.1);assert.ok(s.x<239);move(s,1,0,.1);assert.equal(s.x,239);s.x=200;s.y=310;for(let i=0;i<100;i++)move(s,-1,0,.02);assert.ok(s.x>=194);});
test('wheel and bulb animation are deterministic and continue over time',()=>{assert.notEqual(wheelAngle(1),wheelAngle(5));assert.notEqual(bulbLevel(1,0),bulbLevel(5,0));assert.equal(bulbLevel(0,1,true),bulbLevel(9,1,true));const s=newStreet();tick(s,1);assert.equal(s.time,1);});
