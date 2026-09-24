import * as THREE from 'three';
import {bakeStatic} from '../assetlib.js';
export function buildDoor(kind='red'){
 const root=new THREE.Group(),staticRoot=new THREE.Group(),leaf=new THREE.Group(),hands=[];root.add(staticRoot,leaf);const width=kind==='double'?2.5:1.55,height=2.8;
 const materials=new Map();function box(parent,w,h,d,x,y,z,c){if(!materials.has(c))materials.set(c,new THREE.MeshStandardMaterial({color:c,roughness:.86}));const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),materials.get(c));o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o;}
 const color=kind==='red'?0x82252a:kind==='double'?0x202e2e:0x42372b,trim=kind==='red'?0x49392d:0x2d3633;
 if(kind==='glow'||kind==='hands')box(staticRoot,width+.25,height,.07,0,height/2,-.17,0x030605);
 for(const s of [-1,1]){box(staticRoot,.19,height+.23,.28,s*(width/2+.11),height/2,0,trim);for(let i=0;i<4;i++)box(staticRoot,.017,height,.055,s*(width/2+.06)+i*.027,height/2,.16,0x4e5041);box(staticRoot,.27,.24,.34,s*(width/2+.1),.12,.02,trim);}
 for(const [y,w,h] of [[height+.06,width+.5,.17],[height+.2,width+.65,.12]])box(staticRoot,w,h,.33,0,y,0,trim);
 leaf.position.set(-width/2,0,.025);
 const panels=kind==='double'?2:1;
 for(let n=0;n<panels;n++){const w=width/panels,cx=w*(n+.5);box(leaf,w-.025,height,.11,cx,height/2,0,color);for(let j=0;j<3;j++){const yy=.46+j*.83;box(leaf,w-.19,.66,.035,cx,yy,.073,trim);box(leaf,w-.27,.55,.034,cx,yy,.097,color);for(const s of [-1,1])box(leaf,.025,.63,.029,cx+s*(w/2-.10),yy,.1,0x5a5040);}
  box(leaf,.07,.18,.04,cx+w*.3,1.12,.12,0x64563c);const knob=new THREE.Mesh(new THREE.SphereGeometry(.048,12,8),new THREE.MeshStandardMaterial({color:0x7e6946,metalness:.7,roughness:.42}));knob.position.set(cx+w*.3,1.11,.18);leaf.add(knob);
  for(let j=0;j<45;j++){const x=cx+Math.sin(j*4.13+n)*w*.42,y=.08+(j*19%97)/97*2.63;box(leaf,.007+(j%4)*.006,.018+(j%7)*.018,.005,x,y,.119,j%3?0x615d46:0x241f1a);}
 }
 // Each hand has a palm, thumb and three-joint fingers; pivot motion stays inside the doorway.
 if(kind==='hands')for(let i=0;i<7;i++){const hand=new THREE.Group(),s=i%2?1:-1;hand.position.set(s*(width/2-.03),.30+i*.34,.02);hand.rotation.z=s*.65;staticRoot.add(hand);box(hand,.14,.22,.07,0,0,.03,0x777665);for(let f=0;f<5;f++){const finger=new THREE.Group();finger.position.set((f-2)*.034,.10,.04);hand.add(finger);for(let j=0;j<3;j++){const bone=box(finger,.026,.064,.03,0,.035+j*.048,j*.018,0x92907b);bone.rotation.x=j*.23;}finger.rotation.z=(f-2)*-.16;}hands.push({hand,base:hand.rotation.z,phase:i*1.71});}
 const moving=kind==='hands';if(moving){for(const h of hands)root.attach(h.hand);leaf.rotation.y=-.27;}
 if(kind==='glow'){const glow=new THREE.MeshBasicMaterial({color:0xffa142});for(const s of [-1,1]){const strip=new THREE.Mesh(new THREE.BoxGeometry(.022,2.8,.02),glow);strip.position.set(s*width/2,1.4,.015);staticRoot.add(strip);}const strip=new THREE.Mesh(new THREE.BoxGeometry(width,.025,.02),glow);strip.position.set(0,.025,.08);staticRoot.add(strip);const spill=new THREE.Mesh(new THREE.PlaneGeometry(width*1.6,2.5),new THREE.MeshBasicMaterial({color:0xb56223,transparent:true,opacity:.12,depthWrite:false}));spill.rotation.x=-Math.PI/2;spill.position.set(0,.013,1.24);staticRoot.add(spill);const light=new THREE.PointLight(0xffad55,5,3.5,2);light.position.set(0,.2,.25);root.add(light);}
 root.remove(staticRoot);root.add(bakeStatic(staticRoot));const hinge=leaf.position.clone();leaf.position.set(0,0,0);leaf.rotation.y=0;const leafBaked=bakeStatic(leaf);leaf.position.copy(hinge);leaf.remove(...leaf.children);leaf.add(leafBaked); // leafBaked carries the original offset; put geometry back in hinge coordinates.
 leafBaked.position.set(0,0,0);
 let opened=0;return {root,leaf,width,update(t,dt,open=false,proximity=9){opened=THREE.MathUtils.damp(opened,open?1:0,5,dt);leaf.rotation.y=-opened*1.28-(moving?.27:0);for(const h of hands){h.hand.rotation.z=h.base+Math.sin(t*2.4+h.phase)*.12;h.hand.position.z=.04+(proximity<3?.16:0)*(.5+.5*Math.sin(t*2+h.phase));}},state:()=>({kind,open:opened,hands:hands.length})};
}
