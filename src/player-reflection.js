import * as THREE from 'three';
// Layer 1 is rendered by mirror cameras only; the first-person camera stays on layer 0.
export function createPlayerReflection(){
 const root=new THREE.Group(),limbs=[];root.name='investigator-reflection';const coat=new THREE.MeshStandardMaterial({color:0x645c44,roughness:.96}),denim=new THREE.MeshStandardMaterial({color:0x253c40,roughness:.94}),skin=new THREE.MeshStandardMaterial({color:0x947a60,roughness:.9}),black=new THREE.MeshStandardMaterial({color:0x18211c,roughness:.8});
 function ell(parent,x,y,z,sx,sy,sz,mat){const o=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
 ell(root,0,1.15,0,.24,.36,.13,coat);ell(root,0,1.61,0,.115,.15,.105,skin);ell(root,0,1.7,-.027,.12,.08,.095,black);ell(root,0,1.60,.105,.028,.04,.035,skin);
 for(const s of [-1,1]){ell(root,s*.047,1.65,.096,.018,.013,.011,black);const leg=new THREE.Group();leg.position.set(s*.12,.88,0);root.add(leg);ell(leg,0,-.36,0,.095,.4,.09,denim);ell(leg,0,-.81,.06,.10,.075,.17,black);const arm=new THREE.Group();arm.position.set(s*.27,1.39,0);root.add(arm);ell(arm,0,-.23,0,.075,.25,.08,coat);ell(arm,0,-.5,.02,.056,.075,.04,skin);limbs.push({leg,arm,s});}
 root.traverse(o=>o.layers.set(1));let step=0,last=null;
 return {root,update(camera,dt){const x=camera.position.x,z=camera.position.z,travel=last?Math.hypot(x-last.x,z-last.z):0;last={x,z};step+=travel*5.5;root.position.set(x,camera.position.y-1.65,z);const d=new THREE.Vector3();camera.getWorldDirection(d);root.rotation.y=Math.atan2(d.x,d.z);for(const {leg,arm,s} of limbs){const a=travel>.0001?Math.sin(step)*.35*s:0;leg.rotation.x=THREE.MathUtils.damp(leg.rotation.x,a,12,dt);arm.rotation.x=-leg.rotation.x*.6;}},state:()=>({visibleInMirrors:true,position:root.position.toArray(),walkPhase:step})};
}
