import test from 'node:test';import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.js';
import generate from '../two-d/assets/three/clown-jaws.js';
import {mouthProgress,poseJaws} from '../two-d/levels/mouth-motion.js';
test('the jaw gap narrows monotonically and both tooth edges meet at full closure',()=>{const root=generate(THREE);let last=Infinity;for(let i=0;i<=145;i++){const edges=poseJaws(root,mouthProgress(i/100)),gap=edges.upperEdge-edges.lowerEdge;assert.ok(gap<=last+1e-10);assert.ok(gap>=-1e-10);last=gap;}assert.ok(Math.abs(last)<1e-10);assert.equal(mouthProgress(0),0);assert.equal(mouthProgress(1.45),1);assert.equal(mouthProgress(2),1);});
