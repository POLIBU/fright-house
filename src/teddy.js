import * as THREE from 'three';
import {bakeStatic} from '../assetlib.js';

// A distressed carnival prop inspired by the user's teddy reference; original procedural geometry.
export function addTeddy(scene){
 const root=new THREE.Group();root.position.set(18.1,0,15.45);root.rotation.y=-Math.PI*.25;scene.add(root);
 const fixed=new THREE.Group();root.add(fixed);const eyes=[];
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d');ctx.fillStyle='#948365';ctx.fillRect(0,0,512,512);let seed=9324;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<16000;i++){const x=random()*512,y=random()*512,l=2+random()*9;ctx.strokeStyle=i%3===0?'#514a39':i%3===1?'#c0ac83':'#8c795b';ctx.lineWidth=.6+random();ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+random()*5-2,y-l*.7,x+random()*7-3,y-l);ctx.stroke();}
 const furMap=new THREE.CanvasTexture(canvas);furMap.colorSpace=THREE.SRGBColorSpace;furMap.wrapS=furMap.wrapT=THREE.RepeatWrapping;furMap.repeat.set(3,2);
 const fur=new THREE.MeshStandardMaterial({map:furMap,bumpMap:furMap,bumpScale:.022,color:0xc5b18a,roughness:.99});
 const matted=new THREE.MeshStandardMaterial({map:furMap,color:0x584137,roughness:1}),lining=new THREE.MeshStandardMaterial({color:0x442c2b,roughness:.96}),black=new THREE.MeshStandardMaterial({color:0x0c0b0b,roughness:.75}),skin=new THREE.MeshStandardMaterial({color:0xb78b62,roughness:.77}),lip=new THREE.MeshStandardMaterial({color:0x855448,roughness:.82}),teeth=new THREE.MeshStandardMaterial({color:0xaa9b77,roughness:.73}),thread=new THREE.MeshStandardMaterial({color:0x382d22,roughness:1});
 function mesh(g,mat,x,y,z,parent=fixed){const m=new THREE.Mesh(g,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 function blob(rx,ry,rz,mat,x,y,z,worn=true){const g=new THREE.SphereGeometry(1,worn?40:16,worn?28:12),p=g.attributes.position;for(let i=0;i<p.count;i++){const a=p.getX(i),b=p.getY(i),c=p.getZ(i),noise=worn?1+.024*Math.sin(a*17+b*9)*Math.sin(c*19-b*11):1;p.setXYZ(i,a*rx*noise,b*ry*noise,c*rz*noise);}g.computeVertexNormals();return mesh(g,mat,x,y,z);}
 function tube(points,r,mat,parent=fixed){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),Math.max(12,points.length*5),r,6,false),mat,0,0,0,parent);}
 blob(.34,.41,.25,fur,0,.55,0);blob(.31,.29,.245,fur,0,1.13,.02);
 for(const side of [-1,1]){blob(.115,.13,.075,fur,side*.235,1.36,.01);blob(.063,.078,.023,matted,side*.241,1.37,.079);const arm=blob(.135,.29,.14,fur,side*.345,.67,.018);arm.rotation.z=side*.30;const foot=blob(.18,.19,.27,fur,side*.24,.19,.16);foot.rotation.y=side*.18;blob(.12,.092,.055,matted,side*.25,.17,.38);}
 // Ragged abdomen lining surrounds a porcelain doll face rather than a repeating wall mask.
 blob(.253,.285,.071,lining,0,.575,.233);blob(.215,.246,.030,matted,0,.578,.285);
 const faceGeo=new THREE.SphereGeometry(1,56,40),fp=faceGeo.attributes.position;
 for(let i=0;i<fp.count;i++){const x=fp.getX(i),y=fp.getY(i),z=fp.getZ(i),f=Math.max(0,z);let zz=z*.095;const gauss=(a,b,sx,sy)=>Math.exp(-(((x-a)/sx)**2+((y-b)/sy)**2));
  zz+=f*(.034*gauss(0,-.03,.23,.31)+.022*gauss(0,-.20,.32,.15)-.017*gauss(-.38,.16,.28,.16)-.017*gauss(.38,.16,.28,.16)+.014*gauss(-.58,-.22,.3,.3)+.014*gauss(.58,-.22,.3,.3));fp.setXYZ(i,x*.177*(1-.14*Math.max(0,-y)),y*.212,zz);}
 faceGeo.computeVertexNormals();mesh(faceGeo,skin,0,.58,.301);
 blob(.025,.012,.012,lip,0,.508,.389,false);tube([[-.044,.510,.386],[0,.493,.40],[.047,.510,.386]],.005,lip);
 blob(.012,.009,.010,matted,-.025,.558,.410,false);blob(.010,.007,.01,matted,.023,.559,.408,false);
 function eye(x,y,z,r,colour){const socket=blob(r*1.36,r*1.30,r*.42,lining,x,y,z-.014,false);const rig=new THREE.Group();rig.position.set(x,y,z);root.add(rig);const sclera=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),new THREE.MeshStandardMaterial({color:0xaba690,roughness:.29}));rig.add(sclera);const iris=new THREE.Mesh(new THREE.SphereGeometry(1,24,14),new THREE.MeshStandardMaterial({color:colour,roughness:.20}));iris.scale.set(r*.61,r*.67,r*.13);iris.position.z=r*.90;rig.add(iris);const pupil=new THREE.Mesh(new THREE.SphereGeometry(1,20,12),black);pupil.scale.set(r*.27,r*.34,r*.10);pupil.position.z=r*1.025;rig.add(pupil);const glint=new THREE.Mesh(new THREE.SphereGeometry(r*.09,8,6),new THREE.MeshBasicMaterial({color:0xb9cfc8}));glint.position.set(-r*.19,r*.22,r*1.08);rig.add(glint);eyes.push(rig);return rig;}
 eye(-.065,.621,.393,.026,0x3a8290);tube([[.033,.622,.394],[.068,.634,.397],[.100,.620,.384]],.006,matted);
 for(let i=0;i<5;i++)tube([[.039+i*.013,.621,.40],[.045+i*.013,.610,.398]],.002,thread);
 for(const side of [-1,1]){blob(.080,.081,.040,matted,side*.120,1.176,.239);eye(side*.120,1.176,.258,.044,side<0?0x827455:0x647c70);}
 blob(.132,.075,.054,fur,0,1.063,.241);blob(.050,.032,.022,matted,0,1.084,.295,false);
 // A split fabric grin with two irregular rows of individually shaped prop teeth.
 blob(.145,.071,.034,black,0,1.005,.258,false);
 tube([[-.14,1.054,.26],[-.09,.958,.277],[0,.941,.28],[.10,.977,.27],[.15,1.063,.252]],.021,lining);
 for(let i=0;i<9;i++){const x=(i-4)*.029,y=1.039-.030*(1-(x/.13)**2);const top=blob(.012,.019+(i%3)*.004,.012,teeth,x,y,.285,false);top.rotation.z=(i-4)*.09;const lower=blob(.012,.016,.01,teeth,x,y-.045,.284,false);lower.rotation.z=(i-4)*-.10;}
 // Seams, thread staples, pitted porcelain and worn patches break up the plush surface.
 for(let i=0;i<10;i++){const a=i/9*Math.PI;const x=Math.cos(a)*.23,y=.575+Math.sin(a)*.268;tube([[x-.012,y-.009,.302],[x+.012,y+.01,.305]],.003,thread);}
 for(let i=0;i<7;i++){const y=1.22+i*.016;tube([[.005,y,.26-(y-1.22)*.60],[.025,y+.008,.26-(y-1.22)*.60]],.0026,thread);}
 for(let i=0;i<28;i++){const x=.065+random()*.069,y=.43+random()*.29;blob(.002+random()*.003,.003,.0017,matted,x,y,.301+Math.sqrt(Math.max(0,1-((x/.177)**2)-(((y-.58)/.212)**2)))*.095,false);}
 // Sparse irregular fur tufts catch the flashlight at the silhouette, using one draw call.
 const tufts=new THREE.InstancedMesh(new THREE.ConeGeometry(.006,.028,4),fur,350),dummy=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);for(let i=0;i<350;i++){const a=random()*Math.PI*2,v=random()*2-1,n=new THREE.Vector3(Math.cos(a)*Math.sqrt(1-v*v),v,Math.sin(a)*Math.sqrt(1-v*v));const head=i<170;dummy.position.set(n.x*(head?.314:.345),(head?1.13:.55)+n.y*(head?.295:.416),n.z*(head?.25:.256)+(head?.02:0));dummy.quaternion.setFromUnitVectors(up,n);dummy.updateMatrix();tufts.setMatrixAt(i,dummy.matrix);}fixed.add(tufts);
 // Bake only fixed geometry in local coordinates; eye pivots stay independent.
 root.remove(fixed);fixed.updateMatrixWorld(true);root.add(bakeStatic(fixed));root.updateMatrixWorld(true);
 const target=new THREE.Vector3();
 return {root,eyes,update(camera){root.updateWorldMatrix(true,false);target.copy(camera.position);root.worldToLocal(target);for(const e of eyes){const dx=target.x-e.position.x,dy=target.y-e.position.y,dz=target.z-e.position.z;e.rotation.set(-THREE.MathUtils.clamp(Math.atan2(dy,Math.hypot(dx,dz)),-.45,.45),THREE.MathUtils.clamp(Math.atan2(dx,dz),-.85,.85),0);}},state(){return eyes.map(e=>({yaw:e.rotation.y,pitch:e.rotation.x}));}};
}
