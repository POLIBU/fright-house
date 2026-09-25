import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.js';
import {batchStatic} from '../two-d/batch-static.js';
test('static batching preserves material, world vertices, normals and animated exclusions',()=>{
 const root=new THREE.Group(),material=new THREE.MeshStandardMaterial(),animated=new THREE.Group();root.position.set(3,4,5);root.rotation.y=.3;root.add(animated);
 for(let i=0;i<3;i++){const box=new THREE.Mesh(new THREE.BoxGeometry(1,2,3),material);box.position.set(i*4,i,-i);box.rotation.z=i*.2;(i===2?animated:root).add(box);}
 function vertices(){root.updateWorldMatrix(true,true);const rows=[];root.traverse(m=>{if(!m.isMesh)return;const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry;for(let i=0;i<g.attributes.position.count;i++){const p=new THREE.Vector3().fromBufferAttribute(g.attributes.position,i).applyMatrix4(m.matrixWorld),n=new THREE.Vector3().fromBufferAttribute(g.attributes.normal,i).applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(m.matrixWorld));rows.push([...p.toArray(),...n.toArray()]);}assert.equal(m.material,material);});return rows.sort((a,b)=>a.map(x=>x.toFixed(4)).join(',').localeCompare(b.map(x=>x.toFixed(4)).join(',')));}
 const before=vertices(),child=animated.children[0];batchStatic(THREE,root,[animated]);const after=vertices();assert.equal(after.length,before.length);for(let i=0;i<before.length;i++)for(let j=0;j<6;j++)assert.ok(Math.abs(before[i][j]-after[i][j])<1e-5);assert.equal(animated.children[0],child);assert.equal(root.children.filter(c=>c.isMesh).length,1);animated.position.y=2;assert.notDeepEqual(vertices(),after);
});
