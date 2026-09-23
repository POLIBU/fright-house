import * as THREE from 'three';
import {bakeStatic} from '../assetlib.js';

// Original fairground props. Kept beside the route so evidence and wall handles remain accessible.
export function addAttractions(scene,label){
 const wood=new THREE.MeshStandardMaterial({color:0x634631,roughness:.93}),bone=new THREE.MeshStandardMaterial({color:0xbab08e,roughness:.78}),dark=new THREE.MeshStandardMaterial({color:0x25201c,roughness:.9});
 const yAxis=new THREE.Vector3(0,1,0);
 function mesh(parent,geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 function box(p,w,h,d,mat,x,y,z){return mesh(p,new THREE.BoxGeometry(w,h,d),mat,x,y,z);}
 function ball(p,radii,mat,x,y,z){const m=mesh(p,new THREE.SphereGeometry(1,20,14),mat,x,y,z);m.scale.set(...radii);return m;}
 function rod(p,a,b,r,mat){a=new THREE.Vector3(...a);b=new THREE.Vector3(...b);const d=b.clone().sub(a),m=mesh(p,new THREE.CylinderGeometry(r,r,d.length(),9),mat,...a.clone().add(b).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(yAxis,d.normalize());return m;}
 function curve(p,points,r,mat){return mesh(p,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(a=>new THREE.Vector3(...a))),24,r,6,false),mat);}
 const stall=new THREE.Group();stall.position.set(18.45,0,8.4);stall.rotation.y=-Math.PI/2;scene.add(stall);
 for(const x of [-1.43,1.43]){box(stall,.12,2.70,.14,wood,x,1.35,0);box(stall,.30,.12,.45,wood,x,.06,0);}box(stall,2.98,.16,.18,wood,0,2.57,0);box(stall,2.9,.12,.55,wood,0,.91,.02);
 const sign=label('WIN A FISH',2.8,.36,'#cdb373','#632c28');sign.position.set(0,2.94,.03);stall.add(sign);
 const small=label('ONE LUCKY THROW',1.8,.19,'#b3a27d','#282d25');small.position.set(0,.71,.32);stall.add(small);
 const plastic=new THREE.MeshStandardMaterial({color:0xb3c6b8,roughness:.16,metalness:.05,transparent:true,opacity:.19,side:THREE.DoubleSide,depthWrite:false});
 const water=new THREE.MeshStandardMaterial({color:0x667744,transparent:true,opacity:.29,roughness:.32,depthWrite:false});
 const seam=new THREE.LineBasicMaterial({color:0xd5d7b9,transparent:true,opacity:.60});
 const fishMats=[0xb57030,0x9b854f,0x9d542a].map(color=>new THREE.MeshStandardMaterial({color,roughness:.65}));
 const bags=[];
 for(let i=0;i<6;i++){
  const root=new THREE.Group();root.position.set(-1.13+i*.45,1.21+(i%2)*.08,.04);stall.add(root);bags.push(root);
  const profile=[[.01,0],[.13,.025],[.18,.10],[.18,.48],[.14,.61],[.025,.76],[.05,.82]].map(([x,y])=>new THREE.Vector2(x,y));
  const geo=new THREE.LatheGeometry(profile,32),pos=geo.attributes.position;
  for(let n=0;n<pos.count;n++){const x=pos.getX(n),y=pos.getY(n),z=pos.getZ(n),a=Math.atan2(z,x),wrinkle=1+.055*Math.sin(a*11+y*27);pos.setXYZ(n,x*wrinkle,y,z*.70*wrinkle);}geo.computeVertexNormals();
  mesh(root,geo,plastic);const waterGeo=new THREE.CylinderGeometry(.165,.145,.38,24);const liquid=mesh(root,waterGeo,water,0,.24,0);liquid.scale.z=.70;
  for(const side of [-1,1]){const pts=[];for(let n=0;n<=12;n++){const yy=.04+n*.059,xx=side*(yy<.53?.17:.17*(.77-yy)/.24);pts.push(new THREE.Vector3(xx,yy,.009));}root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),seam));}
  rod(root,[0,.78,0],[0,1.28-(i%2)*.08,0],.006,wood);mesh(root,new THREE.TorusGeometry(.027,.008,6,12),wood,0,.766,0).rotation.x=Math.PI/2;
  const fish=new THREE.Group();fish.position.set(0,.23,.018);fish.rotation.z=i%2?.24:-.32;root.add(fish);const fm=fishMats[i%3];ball(fish,[.105,.047,.032],fm,0,0,0);
  const fin=new THREE.Shape();fin.moveTo(-.074,0);fin.lineTo(-.154,.060);fin.quadraticCurveTo(-.125,0,-.154,-.06);fin.closePath();mesh(fish,new THREE.ExtrudeGeometry(fin,{depth:.006,bevelEnabled:false}),fm,0,0,-.003);
  for(const side of [-1,1]){ball(fish,[.012,.012,.006],bone,.066,.014,side*.025);ball(fish,[.006,.007,.003],dark,.069,.014,side*.031);}
 }
 // Instanced bodies and wings make a small, restless swarm without dozens of draw calls.
 const flies=new THREE.InstancedMesh(new THREE.SphereGeometry(1,7,5),dark,22),wings=new THREE.InstancedMesh(new THREE.SphereGeometry(1,5,4),new THREE.MeshBasicMaterial({color:0x9d9f8b,transparent:true,opacity:.43,depthWrite:false}),44);flies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);wings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);flies.frustumCulled=wings.frustumCulled=false;stall.add(flies,wings);const dummy=new THREE.Object3D();

 // A discarded jointed plastic skeleton, lying flat beside the western wall.
 const skeleton=new THREE.Group();skeleton.position.set(-1.22,.06,8.4);skeleton.rotation.y=.15;scene.add(skeleton);
 rod(skeleton,[0,.10,-.39],[0,.11,.35],.045,bone);
 for(let i=0;i<9;i++)ball(skeleton,[.068,.036,.025],bone,0,.11,-.37+i*.074);
 for(let i=0;i<6;i++)for(const side of [-1,1]){const z=-.35+i*.083,w=.23-Math.abs(i-2)*.024;curve(skeleton,[[0,.11,z],[side*w,.08,z+.015],[side*w,.18,z+.04],[side*.06,.235,z+.058]],.018,bone);}
 rod(skeleton,[0,.235,-.29],[0,.235,.06],.022,bone);
 for(const side of [-1,1]){
  ball(skeleton,[.12,.065,.115],bone,side*.09,.09,.35);
  const shoulder=[side*.23,.12,-.40],elbow=[side*.36,.075,-.10],hand=[side*.45,.07,.12];rod(skeleton,shoulder,elbow,.027,bone);rod(skeleton,elbow,hand,.022,bone);ball(skeleton,[.037,.027,.065],bone,...hand);
  for(let f=0;f<4;f++)rod(skeleton,[hand[0]+(f-1.5)*.015,.07,.15],[hand[0]+(f-1.5)*.024,.06,.24-Math.abs(f-1)*.018],.007,bone);
  const hip=[side*.11,.08,.42],knee=[side*.17,.07,.78],ankle=[side*.24,.06,1.11];rod(skeleton,hip,knee,.032,bone);rod(skeleton,knee,ankle,.024,bone);ball(skeleton,[.049,.032,.11],bone,side*.24,.045,1.17);
  for(const q of [shoulder,elbow,knee])ball(skeleton,[.042,.037,.037],dark,...q);
 }
 const skull=new THREE.Group();skull.position.set(.025,.14,-.66);skull.rotation.y=.23;skull.rotation.z=-.1;skeleton.add(skull);
 ball(skull,[.14,.115,.17],bone,0,0,0);ball(skull,[.095,.045,.07],bone,0,-.025,.13);
 // Dark inset sockets face upward like a cheap moulded fairground prop.
 for(const side of [-1,1]){ball(skull,[.044,.009,.050],dark,side*.061,.105,.051);ball(skull,[.055,.018,.065],bone,side*.067,.093,-.007);}
 ball(skull,[.025,.01,.032],dark,0,.090,.12);
 curve(skull,[[-.10,.0,.12],[-.105,.015,.20],[0,.02,.24],[.105,.015,.20],[.10,0,.12]],.022,bone);
 for(let i=0;i<7;i++)box(skull,.016,.025,.024,bone,(i-3)*.022,.04,.211);
 const tag=label('PROPERTY OF FRIGHT HOUSE',.44,.085,'#574d35','#a39571');tag.rotation.x=-Math.PI/2;tag.position.set(.29,.02,.33);skeleton.add(tag);

 scene.add(bakeStatic(skeleton));scene.remove(skeleton);
 const silk=new THREE.LineBasicMaterial({color:0xb7b5a0,transparent:true,opacity:.36});
 function web(x,z,rotation){const root=new THREE.Group();root.position.set(x,3.12,z);root.rotation.y=rotation;scene.add(root);const corners=[new THREE.Vector3(0,0,1.55),new THREE.Vector3(1.55,0,0),new THREE.Vector3(0,-1.2,0)],center=new THREE.Vector3(.38,-.30,.38),rim=[],lines=[];
  for(let i=0;i<3;i++)for(let j=0;j<5;j++)rim.push(corners[i].clone().lerp(corners[(i+1)%3],j/5));
  for(const p of rim)lines.push(center.clone(),p.clone());
  for(let r=1;r<=9;r++){const ring=rim.map((p,i)=>center.clone().lerp(p,r/9).add(new THREE.Vector3(0,-Math.sin(i*1.7+r)*.011,0)));for(let i=0;i<ring.length;i++)lines.push(ring[i],ring[(i+1)%ring.length]);}
  root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lines),silk));
 }
 web(-1.99,-1.99,0);web(18.79,18.79,Math.PI);
 return {bags:bags.length,update(t){for(let i=0;i<bags.length;i++)bags[i].rotation.z=Math.sin(t*.6+i)*.017;
  for(let i=0;i<22;i++){const a=t*(2.6+(i%4)*.28)+i*2.4;dummy.position.set(Math.sin(a*.73+i)*1.28,1.70+Math.sin(a*1.3)*.33,.30+Math.cos(a)*.22);dummy.rotation.set(a*.2,a,0);dummy.scale.set(.012,.007,.023);dummy.updateMatrix();flies.setMatrixAt(i,dummy.matrix);
   for(let s=0;s<2;s++){dummy.scale.set(.020,.002,.012);dummy.position.x+=(s?1:-1)*.015;dummy.rotation.z=(s?1:-1)*Math.sin(t*85+i)*.7;dummy.updateMatrix();wings.setMatrixAt(i*2+s,dummy.matrix);}
  }flies.instanceMatrix.needsUpdate=wings.instanceMatrix.needsUpdate=true;
 }};
}
