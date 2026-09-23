import * as THREE from 'three';
import {ASSET,bakeStatic} from '../assetlib.js';
import {spiralMaterial,addCircusCanopy,addMirrors} from './art-direction.js';
import {addTeddy} from './teddy.js';
import {addAttractions} from './attractions.js';
import {createCreature,addBalloons} from './haunting.js';
import {SIZE,N,EDGES,GATES,key,edgeKey,point,EVIDENCE} from './model.js';
export function label(text,w=2,h=.4,color='#d8c89b',bg='#142724'){
 const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);x.strokeStyle='#a88958';x.lineWidth=5;x.strokeRect(5,5,c.width-10,c.height-10);x.fillStyle=color;x.textAlign='center';x.textBaseline='middle';x.font=`bold ${Math.min(64,c.height*.48)}px "Special Elite", "Courier New", monospace`;x.fillText(text,512,c.height/2,970);const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;const g=new THREE.Group();for(const side of [1,-1]){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map}));m.position.z=side*.002;m.rotation.y=side<0?Math.PI:0;g.add(m);}return g;
}
export async function buildWorld(scene,{assetBase='./assets/'}={}){
 const proto={};for(const name of ['phone','recorder','backpack','shoe','cassette','breaker'])proto[name]=await ASSET(`${assetBase}${name}.js?v=${document.documentElement.dataset.build||"dev"}`,{surfaces:true});
 const art={};const names=['face_clown','face_hollow','face_sleeper','door_grin','door_wink','door_frown','door_exit'];
 for(const name of names)art[name]=await ASSET(`${assetBase}${name.startsWith('face_')?'humanoid':'art'}/${name}.js?v=${document.documentElement.dataset.build||'dev'}`,{surfaces:true});
 const collision=[],wallMeshes=[],gateMeshes=[],fixtures=[],lights=[],interactables=[],evidenceMeshes={};
 const spiral=spiralMaterial(),floatingFaces=[];let haunting=false,meltAge=0,hauntLevel=0;
 const staticRoot=new THREE.Group();scene.add(staticRoot);
 function box(w,h,d,color,x,y,z,parent=staticRoot){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.9}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function place(name,x,y,z,rot=0,parent=staticRoot){const o=proto[name].clone();o.position.set(x,y,z);o.rotation.y=rot;parent.add(o);return o;}
 function solid(x,z,w,d,h=3.2){collision.push({x,z,w,d,h});}
 function wall(x,z,rot,idx){const o=new THREE.Group();o.position.set(x,0,z);o.rotation.y=rot;staticRoot.add(o);wallMeshes.push(o);solid(x,z,rot? .20:SIZE,rot?SIZE:.20);
  box(SIZE,3.2,.15,0x5a342d,0,1.6,0,o);
  for(const side of [-1,1]){const paint=new THREE.Mesh(new THREE.PlaneGeometry(SIZE-.12,2.90),spiral);paint.position.set(0,1.68,side*.082);paint.rotation.y=side<0?Math.PI:0;o.add(paint);}
  for(const xx of [-SIZE/2+.045,SIZE/2-.045])box(.09,3.2,.19,0x3f5045,xx,1.6,0,o);
  for(const y of [.12,3.13])box(SIZE,.10,.22,0x78623e,0,y,0,o);
 }
 function mountFace(name,x,z,rotation,height=1.48,bottom=1.27){const f=art['face_'+name].clone();const scale=height/f.userData.nativeSize.y;f.scale.setScalar(scale);const d=f.userData.nativeSize.z*scale/2+.55;f.position.set(x+Math.sin(rotation)*d,bottom,z+Math.cos(rotation)*d);f.rotation.y=rotation;scene.add(f);registerFace(f);}

 function registerFace(f){floatingFaces.push({mesh:f,base:f.position.clone(),yaw:f.rotation.y,phase:floatingFaces.length*1.73});}
 let i=0;for(let z=0;z<N;z++)for(let x=0;x<N;x++){
  if(z===0)wall(x*SIZE,-SIZE/2,0,i++);
  if(x===0)wall(-SIZE/2,z*SIZE,Math.PI/2,i++);
  if(x===N-1||!EDGES.has(edgeKey(key(x,z),key(x+1,z))))wall((x+.5)*SIZE,z*SIZE,Math.PI/2,i++);
  if(z===N-1||!EDGES.has(edgeKey(key(x,z),key(x,z+1))))wall(x*SIZE,(z+.5)*SIZE,0,i++);
 }
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');let seed=493;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};ctx.fillStyle='#4c4a37';ctx.fillRect(0,0,512,512);for(let y=0;y<512;y+=64){ctx.fillStyle=y%128?'#524c35':'#474732';ctx.fillRect(0,y,512,62);for(let j=0;j<250;j++){const a=rand();ctx.fillStyle=`rgba(${a>.5?'183,157,106':'20,23,18'},${rand()*.17})`;ctx.fillRect(rand()*512,y+rand()*62,rand()*100,.5+rand()*1.5);}ctx.fillStyle='#17211d';ctx.fillRect((y*7)%512,y,2,64);}for(let j=0;j<1400;j++){ctx.fillStyle=`rgba(5,16,14,${rand()*.13})`;ctx.fillRect(rand()*512,rand()*512,rand()*10,rand()*10);}const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(10,10);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(SIZE*N,SIZE*N),new THREE.MeshStandardMaterial({map:tex,roughness:.67}));floor.rotation.x=-Math.PI/2;floor.position.set(SIZE*2,-.015,SIZE*2);floor.receiveShadow=true;scene.add(floor);
 addCircusCanopy(scene);
 mountFace('clown',4.2,2.1,0,2.55,.49);
 mountFace('hollow',18.9,0,-Math.PI/2,1.05,1.56);mountFace('sleeper',4.2,18.9,Math.PI,1.28,1.44);
 const profiles=[{color:0xffc28a,intensity:18},{color:0xeaaa66,intensity:4},{color:0xc6d3b0,intensity:11},{color:0xffae63,intensity:2.4},{color:0xf1bd70,intensity:17}];
 for(let z=0;z<N;z++)for(let x=0;x<N;x++){
  const seed=x+z*5,dark=[6,8,13,16,18].includes(seed),profile=profiles[(x*3+z*2)%profiles.length];
  const base=(x===4&&z>2)?{color:0x8bc6c0,intensity:13}:dark?{color:0xc98758,intensity:.7}:profile;
  const drop=.28+(seed%3)*.15;box(.025,drop,.025,0x282923,x*SIZE,3.25-drop/2,z*SIZE);
  const shade=new THREE.Mesh(new THREE.ConeGeometry(.19,.12,16,1,true),new THREE.MeshStandardMaterial({color:0x4f4934,side:THREE.DoubleSide,roughness:.8}));shade.position.set(x*SIZE,3.25-drop,z*SIZE);staticRoot.add(shade);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(.048,10,8),new THREE.MeshBasicMaterial({color:dark?0x332c24:base.color}));bulb.position.set(x*SIZE,3.16-drop,z*SIZE);scene.add(bulb);fixtures.push(bulb);
  const l=new THREE.PointLight(base.color,base.intensity,dark?3.4:5.6,2);l.position.set(x*SIZE,3.08-drop,z*SIZE);l.userData.baseColor=base.color;l.userData.baseIntensity=base.intensity;l.userData.flicker=seed===8||seed===16;scene.add(l);lights.push(l);
 }
 const mirrors=addMirrors(scene);
 function setLighting(chase=false){haunting=chase;meltAge=0;hauntLevel=0;spiral.userData.melt.amount.value=0;spiral.userData.melt.time.value=0;lights.forEach((l,i)=>{l.color.setHex(chase?(i%4===0?0xb44a36:0x729f95):l.userData.baseColor);l.intensity=l.userData.baseIntensity*(chase?.55:1);l.userData.level=l.intensity;});}
 function updateLighting(t){for(const l of lights)if(l.userData.flicker)l.intensity=l.userData.level*(.62+.38*Math.sin(t*1.3+l.position.x)**2);}
 setLighting();

 GATES.forEach((g,i)=>{const pivot=new THREE.Group();pivot.position.set((g.x+.5)*SIZE,0,(g.z+.5)*SIZE);scene.add(pivot);const panel=art[['door_grin','door_wink','door_frown'][i]].clone();panel.position.x=-SIZE/2;pivot.add(panel);
  gateMeshes.push(pivot);
  const p=point(g.a);const stand=new THREE.Group();stand.position.set(p.x-1.25,0,p.z-1.25);scene.add(stand);box(.14,1.16,.14,0x3e5145,0,.58,0,stand);const wheel=new THREE.Mesh(new THREE.TorusGeometry(.18,.025,8,20),new THREE.MeshStandardMaterial({color:0xa88958,metalness:.6,roughness:.45}));wheel.position.y=1.22;stand.add(wheel);const tag=label(g.name,1.10,.22);tag.position.set(0,1.61,0);stand.add(tag);const stat=label('TURN 90°',.92,.20);stat.position.set(0,.94,.04);stand.add(stat);const compass=label('N ↑   S ↓',1.2,.3,'#b29c65','#222b24');compass.rotation.x=-Math.PI/2;compass.position.set(p.x,.012,p.z-1.3);scene.add(compass);
  interactables.push({id:'gate'+i,type:'gate',index:i,position:new THREE.Vector3(p.x-1.25,1.22,p.z-1.25),mesh:stand,name:'Turn '+g.name});
  const ring=new THREE.Mesh(new THREE.RingGeometry(2.00,2.06,40),new THREE.MeshStandardMaterial({color:0x968350,metalness:.5,side:THREE.DoubleSide,roughness:.6}));ring.rotation.x=-Math.PI/2;ring.position.set(pivot.position.x,.012,pivot.position.z);scene.add(ring);
 });
 for(const e of EVIDENCE){const p=point(e.node),px=p.x+(e.id==='shoe'?1.40:0),pz=p.z+(e.id==='shoe'?0:1.60);box(1,.075,.65,0x574b34,px,1.03,pz);for(const a of [-.40,.40])box(.07,1,.5,0x263e36,px+a,.5,pz);solid(px,pz,1,.65,1.05);const obj=place(e.asset,px,1.07,pz,Math.PI,scene);if(e.id==='tape')obj.scale.setScalar(2.2);evidenceMeshes[e.id]=obj;const tag=label(e.id==='bag'?'LOST PROPERTY':e.id==='shoe'?'THE SUN ROOM':'LAST PERFORMANCE',2,.3);tag.position.set(p.x,2.35,p.z+1.9);tag.rotation.y=Math.PI;staticRoot.add(tag);interactables.push({id:e.id,type:'evidence',position:new THREE.Vector3(px,1.28,pz),mesh:obj,name:e.name});}
 // Maintenance room has one northern entrance, so its jam is a meaningful obstacle.
 const m=point('4,4');box(2.8,.10,.68,0x493e2c,m.x+0.20,.97,m.z+1.24);for(const x of [-1.0,1.0])box(.1,.94,.57,0x284039,m.x+x,.47,m.z+1.24);solid(m.x+.2,m.z+1.24,2.8,.68,1.04);
 place('recorder',m.x+.37,1.02,m.z+1.19,Math.PI);place('phone',m.x+1.75,1.11,m.z+.22,-Math.PI/2);place('breaker',m.x-1.76,1.18,m.z+.24,Math.PI/2);
 const maint=label('MAINTENANCE / STAFF ONLY',2.8,.35);maint.position.set(m.x,2.73,m.z+1.99);maint.rotation.y=Math.PI;staticRoot.add(maint);
 for(const [id,x,y,z,name] of [['power',m.x-1.6,1.56,m.z+.24,'Inspect the power panel'],['recording',m.x+.37,1.15,m.z+1.18,'Play the cassette'],['phone',m.x+1.6,1.46,m.z+.22,'Answer the telephone'],['release',m.x,1.6,m.z-1.6,'Release the jammed passage']])interactables.push({id,type:id,position:new THREE.Vector3(x,y,z),name});
 const jam=box(SIZE,3.2,.12,0x253932,m.x,1.6,m.z-SIZE/2,scene);
 for(let x=-2.0;x<2.1;x+=.23)box(.045,3.03,.055,0x60716a,x,0,.085,jam);
 for(const y of [-1.49,1.49])box(4.16,.10,.15,0x756345,0,y,.05,jam);
 box(.83,.40,.10,0x7c6944,0,.04,.16,jam);for(const x of [-.25,0,.25]){const wheel=new THREE.Mesh(new THREE.TorusGeometry(.083,.017,8,24),new THREE.MeshStandardMaterial({color:0xad9971,metalness:.45,roughness:.7}));wheel.position.set(x,.05,.235);jam.add(wheel);box(.025,.13,.04,0x292e25,x,.05,.236,jam);}box(.44,.037,.065,0xa88247,0,-.27,.20,jam);jam.visible=false;
 const shutter=box(2.2,3.15,.1,0x35413a,0,1.58,-SIZE/2+.13,scene);for(let y=.1;y<3.2;y+=.17)box(2.2,.023,.06,0x1a2924,0,y,-SIZE/2+.21);const entrance=label('FRIGHT HOUSE — NO RETURN',2.7,.35);entrance.position.set(0,2.72,-SIZE/2+.3);scene.add(entrance);
 const e=point('0,4');const exitDoor=art.door_exit.clone();exitDoor.position.set(e.x-1.91,0,e.z);exitDoor.rotation.y=Math.PI/2;staticRoot.add(exitDoor);interactables.push({id:'exit',type:'exit',position:new THREE.Vector3(e.x-1.62,1.3,e.z),name:'Open the service exit'});const exitSign=label('SERVICE EXIT',1.28,.25,'#a3cebb');exitSign.position.set(e.x-1.75,2.90,e.z);exitSign.rotation.y=Math.PI/2;scene.add(exitSign);
 const rig=createCreature(),creature=rig.root;creature.visible=false;scene.add(creature);
 const balloons=addBalloons(scene),attractions=addAttractions(scene,label),teddy=addTeddy(scene);
 function updateAtmosphere(t,dt){
  for(const f of floatingFaces){f.mesh.position.copy(f.base);f.mesh.position.y+=Math.sin(t*.82+f.phase)*.085;f.mesh.position.x+=Math.cos(t*.49+f.phase)*.035;f.mesh.rotation.y=f.yaw+Math.sin(t*.41+f.phase)*.055;f.mesh.rotation.z=Math.sin(t*.61+f.phase)*.035;}
  balloons.update(t);attractions.update(t);
  // Darkness and liquid paint intensify only once the creature is in the maze.
  hauntLevel=THREE.MathUtils.damp(hauntLevel,haunting&&creature.visible?1:0,1.2,dt);
  if(haunting&&creature.visible)meltAge+=dt;
  spiral.userData.melt.time.value=meltAge;spiral.userData.melt.amount.value=hauntLevel;
  lights.forEach(l=>{l.userData.level=l.userData.baseIntensity*(haunting?.55-.34*hauntLevel:1);l.intensity=l.userData.level;});updateLighting(t);
 }
 const atmosphereState=()=>({faces:floatingFaces.length,teddyEyes:teddy.state(),fishBags:attractions.bags,webs:2,skeletons:0,faceY:floatingFaces[0].mesh.position.y,balloons:balloons.items.length,balloonY:balloons.items[0].position.y,melt:hauntLevel,meltAge,lightScale:haunting?.55-.34*hauntLevel:1,arms:rig.arms.length,reach:creature.userData.reach,smoke:creature.visible?rig.smoke.children.length:0});
 // Static geometry is merged into spatial chunks, keeping draw calls low without losing all culling.
 staticRoot.updateMatrixWorld(true);const chunks=new Map();for(const obj of [...staticRoot.children]){const k=key(Math.floor((obj.position.x+2.1)/8.4),Math.floor((obj.position.z+2.1)/8.4));if(!chunks.has(k))chunks.set(k,new THREE.Group());chunks.get(k).add(obj);}scene.remove(staticRoot);for(const group of chunks.values())scene.add(bakeStatic(group));
 return {collision,gateMeshes,interactables,creature,fixtures,lights,jam,shutter,proto,mirrors,evidenceMeshes,setLighting,updateLighting,updateAtmosphere,atmosphereState,updateGaze:camera=>teddy.update(camera),updateCreature:rig.update,resetCreature:rig.reset};
}
