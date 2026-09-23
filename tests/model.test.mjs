import test from 'node:test';
import assert from 'node:assert/strict';
import {N,GATES,INITIAL_GATES,POWER_GATES,EVIDENCE,pathfind,linked,key} from '../src/model.js';
test('every panel combination preserves routes between all rooms',()=>{for(let mask=0;mask<8;mask++){const states=GATES.map((_,i)=>(mask>>i)&1);for(let z=0;z<N;z++)for(let x=0;x<N;x++)assert.ok(pathfind('0,0',key(x,z),states).length,`unreachable ${x},${z}, states ${states}`);}});
test('rotating a panel exchanges its two passages',()=>{for(let i=0;i<3;i++){const states=[...INITIAL_GATES],g=GATES[i];states[i]=0;assert.equal(linked(g.a,g.b,states),true);assert.equal(linked(g.a,g.c,states),false);states[i]=1;assert.equal(linked(g.a,g.b,states),false);assert.equal(linked(g.a,g.c,states),true);}});
test('evidence, maintenance and exit are reachable with the power solution',()=>{for(const node of [...EVIDENCE.map(e=>e.node),'4,4','0,4'])assert.ok(pathfind('0,0',node,POWER_GATES).length);});
test('path steps never cross a blocked gate',()=>{for(let mask=0;mask<8;mask++){const states=GATES.map((_,i)=>(mask>>i)&1),p=pathfind('4,4','0,4',states);for(let i=1;i<p.length;i++)assert.ok(linked(p[i-1],p[i],states));}});
