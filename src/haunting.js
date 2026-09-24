import * as THREE from 'three';
import {floorHeight} from './model.js';
import {horrorHead} from './horror-head.js';

// Lightweight live geometry: jointed limbs, depth-tested smoke and drifting latex.
export function createCreature(){
 const root=new THREE.Group();root.name='the-reaching-thing';const body=new THREE.Group();root.add(body);
 const hideBody=new THREE.MeshStandardMaterial({color:0x0c100f,roughness:.70,metalness:.07});
 const torn=new THREE.MeshStandardMaterial({color:0x26251f,roughness:.85,side:THREE.DoubleSide});
 const core=new THREE.SphereGeometry(1,48,40),p=core.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),r=1+.16*Math.sin(y*14+x*8)*Math.cos(z*11-y*4)+.065*Math.sin(x*23+z*17);p.setXYZ(i,x*(.37+.10*y)*r+.08*Math.sin(y*5),1.56+y*.83,z*.31*r);}
 core.computeVertexNormals();const mass=new THREE.Mesh(core,hideBody);mass.castShadow=true;body.add(mass);
 // Ragged membranous scraps disrupt the outline; no coat, legs, or readable human torso.
 for(let i=0;i<13;i++){const a=i*2.3999,pts=[];for(let j=0;j<=9;j++){const u=j/9;pts.push(new THREE.Vector3(Math.sin(a)*(.20+u*.23)+Math.sin(u*5+i)*.07,1.52-u*(.8+(i%3)*.16),Math.cos(a)*(.17+u*.13)));}const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),16,.013+(i%3)*.007,5,false),torn);body.add(m);}
 const head=horrorHead();head.root.position.set(0,2.15,.14);head.root.scale.setScalar(.94);body.add(head.root);

 const bone=new THREE.MeshStandardMaterial({color:0x615c50,roughness:.79});
 const hide=new THREE.MeshStandardMaterial({color:0x222724,roughness:.91});
 const joint=new THREE.MeshStandardMaterial({color:0x493f35,roughness:.68});
 const limbGeo=new THREE.CylinderGeometry(.024,.061,1,12,12),tipGeo=new THREE.CylinderGeometry(.006,.027,1,8);
 const lp=limbGeo.attributes.position;for(let i=0;i<lp.count;i++){const y=lp.getY(i);lp.setX(i,lp.getX(i)*(1+.16*Math.sin(y*27))+.022*Math.sin((y+.5)*Math.PI));lp.setZ(i,lp.getZ(i)*(1+.13*Math.cos(y*31)));}limbGeo.computeVertexNormals();
 const jointGeo=new THREE.SphereGeometry(.078,12,8),up=new THREE.Vector3(0,1,0),delta=new THREE.Vector3();
 const arms=[];
 function segment(geo,mat){const m=new THREE.Mesh(geo,mat);m.castShadow=true;root.add(m);return m;}
 function link(m,a,b){delta.copy(b).sub(a);m.position.copy(a).add(b).multiplyScalar(.5);m.scale.y=delta.length();m.quaternion.setFromUnitVectors(up,delta.normalize());}
 for(let i=0;i<8;i++){
  const pieces=[segment(limbGeo,hide),segment(limbGeo,bone)];const elbow=segment(jointGeo,joint),palm=segment(jointGeo,bone);palm.scale.set(.8,1.35,.6);
  const fingers=Array.from({length:3},()=>[segment(tipGeo,bone),segment(tipGeo,bone)]);
  arms.push({side:i%2?1:-1,row:Math.floor(i/2),pieces,elbow,palm,fingers,a:new THREE.Vector3(),b:new THREE.Vector3(),c:new THREE.Vector3()});
 }
 const canvas=document.createElement('canvas');canvas.width=canvas.height=96;const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(48,48,0,48,48,48);
 gradient.addColorStop(0,'rgba(255,255,255,.58)');gradient.addColorStop(.4,'rgba(255,255,255,.34)');gradient.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,96,96);
 const map=new THREE.CanvasTexture(canvas),smoke=new THREE.Group();root.add(smoke);
 const motes=Array.from({length:38},(_,i)=>{const material=new THREE.SpriteMaterial({map,color:0x010202,opacity:.85,depthWrite:false,depthTest:true});const p=new THREE.Sprite(material);p.userData.seed=i*2.399963;smoke.add(p);return p;});
 const wrist=new THREE.Vector3(),knuckle=new THREE.Vector3(),tip=new THREE.Vector3();
 let reach=0,reveal=0;
 function update(t,dt,{distance=8,clear=true,laughing=false,grunting=false,speaking=false,lookX=0,lookY=0}={}){
  head.update(t,{speaking:speaking||laughing,lookX,lookY});
  reveal=Math.min(1,reveal+dt*.75);root.scale.y=.35+.65*(1-(1-reveal)**3);
  reach=THREE.MathUtils.damp(reach,clear?THREE.MathUtils.clamp((5-distance)/3,0,1):0,5,dt);
  body.rotation.z=Math.sin(t*2.3)*.035+Math.sin(t*.67)*.018;body.scale.x=1+Math.sin(t*1.9)*.025+(grunting?.028*Math.sin(t*19):0);body.rotation.x=-.025-reach*.07;body.position.y=.035*Math.sin(t*3.8)+(laughing?.018*Math.sin(t*24):0);
  for(const arm of arms){const {side:s,row:r,a,b,c}=arm;const phase=t*(1.25+r*.17+reach*.65)+Math.sin(t*(4.3+r)+r)*.12+r*1.7+(s>0?Math.PI:0),flex=Math.max(0,Math.min(1,.45+.4*Math.sin(phase)+.15*Math.sin(t*6.3+r*2)));const recoil=Math.max(0,Math.sin(t*(.9+r*.11)+r*1.4))**10;
   a.set(s*.22,1.99-r*.24,-.08);
   b.set(s*(.88+.13*Math.sin(phase)),2.62-r*.53+Math.cos(phase)*.15,.02-r*.08+reach*.20-recoil*.15);
   // Alternate folded elbows and grasping hands. Reach remains cosmetic; capture uses maze collision.
   c.set(s*(.64-reach*.28+.09*Math.cos(phase)),2.30-r*.46+Math.sin(phase+.7)*.14,.47+reach*(.50+flex*.55)-recoil*.22);
   link(arm.pieces[0],a,b);link(arm.pieces[1],b,c);arm.elbow.position.copy(b);arm.palm.position.copy(c);arm.palm.rotation.x=-.6-reach*.3;
   for(let f=0;f<3;f++){wrist.copy(c).add(new THREE.Vector3((f-1)*.045,-.02,0));knuckle.copy(wrist).add(new THREE.Vector3((f-1)*.07,-.10-.04*flex,.16));tip.copy(knuckle).add(new THREE.Vector3(-(f-1)*.035,-.15*flex-.035,.09-.06*flex));link(arm.fingers[f][0],wrist,knuckle);link(arm.fingers[f][1],knuckle,tip);}
  }
  for(let i=0;i<motes.length;i++){const p=motes[i],seed=p.userData.seed,life=(t*.18+i/38)%1,angle=seed+t*.25,radius=.16+life*.56;
   p.position.set(Math.sin(angle)*radius,.10+life*2.55,Math.cos(angle)*radius+.02);const size=.95+Math.sin(life*Math.PI)*1.10;p.scale.set(size,size,1);p.material.rotation=seed+t*.12;p.material.opacity=Math.sin(life*Math.PI)*(1.12-.08*reach+.05*Math.sin(t*.73+i))*(.5+.5*reveal);
  }
  root.userData.mouth=head.root.userData.mouth;root.userData.reveal=reveal;root.userData.reach=reach;root.userData.laughing=laughing;
 }
 update(0,0);return {root,update,reset(){reach=0;reveal=0;update(0,0);},arms,smoke};
}

export function addBalloons(scene){
 const colours=[0xa73332,0xb99435,0x327a80,0x496b43,0x79516f,0xc0a377];
 const spots=[[.95,.35],[5.45,3.2],[15.6,.3],[7.35,8.9],[13.75,12],[3.1,16.7],[17.85,16.1]];
 const geo=new THREE.SphereGeometry(1,24,20),p=geo.attributes.position;
 for(let i=0;i<p.count;i++){const y=p.getY(i),taper=.83+.17*y;p.setXYZ(i,p.getX(i)*taper,p.getY(i)*1.28,p.getZ(i)*taper);}geo.computeVertexNormals();
 const knots=new THREE.ConeGeometry(.035,.065,8),cord=new THREE.LineBasicMaterial({color:0xa5977a,transparent:true,opacity:.6});
 const balloons=[];
 for(let i=0;i<spots.length;i++)for(let j=0;j<(i%3===0?2:1);j++){
  const root=new THREE.Group(),material=new THREE.MeshStandardMaterial({color:colours[(i+j)%colours.length],roughness:.31,metalness:.05});const balloon=new THREE.Mesh(geo,material);balloon.scale.setScalar(.26+j*.025);balloon.castShadow=true;root.add(balloon);
  const knot=new THREE.Mesh(knots,material);knot.position.y=-.345;root.add(knot);
  const points=[];for(let n=0;n<=18;n++)points.push(new THREE.Vector3(.045*Math.sin(n*.5+i),-.37-n*.046,.02*Math.sin(n*.4)));
  const string=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),cord);root.add(string);
  root.position.set(spots[i][0]+j*.44,2.72+j*.13,spots[i][1]+j*.18);root.position.y+=floorHeight(root.position.x,root.position.z);root.userData.origin=root.position.clone();root.userData.phase=i*1.73+j*2.4;root.userData.colour=colours[(i+j)%colours.length];scene.add(root);balloons.push(root);
 }
 return {items:balloons,update(t){for(const b of balloons){const o=b.userData.origin,p=b.userData.phase;b.position.set(o.x+Math.sin(t*.43+p)*.12,o.y+Math.sin(t*.68+p)*.10,o.z+Math.cos(t*.38+p)*.10);b.rotation.set(Math.sin(t*.52+p)*.06,0,Math.sin(t*.61+p)*.09);}}};
}
