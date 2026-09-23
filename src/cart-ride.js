import * as THREE from 'three';
import {bakeStatic} from '../assetlib.js';
import {label} from './world.js';
import {OBSTACLES,LANE_WIDTH,RIDE_LENGTH} from './ride-model.js';

export function buildCartRide(scene){
 const root=new THREE.Group();root.visible=false;scene.add(root);const chunks=new Map(),rust=new THREE.MeshStandardMaterial({color:0x634637,roughness:.9,metalness:.28}),wood=new THREE.MeshStandardMaterial({color:0x393a30,roughness:1}),metal=new THREE.MeshStandardMaterial({color:0x414845,roughness:.55,metalness:.65}),red=new THREE.MeshStandardMaterial({color:0x673b36,roughness:.78}),cream=new THREE.MeshStandardMaterial({color:0xb49f72,roughness:.8});
 const path=(s,lateral=0,y=0)=>{const x=Math.sin(s*.022)*10+Math.sin(s*.008)*18,dx=.22*Math.cos(s*.022)+.144*Math.cos(s*.008),n=Math.sqrt(1+dx*dx);return new THREE.Vector3(x+lateral/n,y,s-lateral*dx/n);};
 const forward=(s)=>path(s+.5).sub(path(s-.5)).normalize();
 function groupAt(s,lateral=0){const g=new THREE.Group();g.position.copy(path(s,lateral));const f=forward(s);g.rotation.y=Math.atan2(f.x,f.z);const k=Math.floor(s/28);if(!chunks.has(k))chunks.set(k,new THREE.Group());chunks.get(k).add(g);return g;}
 function mesh(p,geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m;}
 function box(p,w,h,d,mat,x,y,z){return mesh(p,new THREE.BoxGeometry(w,h,d),mat,x,y,z);}
 function rod(p,a,b,r,mat){a=new THREE.Vector3(...a);b=new THREE.Vector3(...b);const d=b.clone().sub(a),m=mesh(p,new THREE.CylinderGeometry(r,r,d.length(),8),mat,...a.clone().add(b).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
 const ground=mesh(root,new THREE.PlaneGeometry(230,580),new THREE.MeshStandardMaterial({color:0x202925,roughness:.94}),0,-.16,210);ground.rotation.x=-Math.PI/2;
 // Parallel tracks follow the same winding service railway through the abandoned park.
 for(let s=-8;s<RIDE_LENGTH+10;s+=1.2){const g=groupAt(s);box(g,4.1,.13,.19,wood,0,-.02,0);for(const lane of [-1,0,1])for(const side of [-1,1])box(g,.055,.11,1.26,metal,lane*LANE_WIDTH+side*.42,.07,0);}
 for(let s=0;s<RIDE_LENGTH;s+=7){const g=groupAt(s);for(const side of [-1,1]){box(g,.10,1.6,.10,wood,side*3.45,.8,0);box(g,.065,.09,7.2,wood,side*3.45,.50,3.5);box(g,.065,.09,7.2,wood,side*3.45,1.22,3.5);}}
 const warning=new THREE.MeshBasicMaterial({color:0xc77637}),black=new THREE.MeshStandardMaterial({color:0x252a25,roughness:.88});
 for(const o of OBSTACLES)for(const lane of o.lanes){const g=groupAt(o.distance,lane*LANE_WIDTH);
  if(o.kind==='timber'){for(let i=0;i<4;i++){const b=box(g,.95,.18,.24,wood,0,.20+i*.15,(i%2)*.12);b.rotation.z=(i%2?.12:-.17);b.rotation.y=i*.42;}}
  else if(o.kind==='cart'){box(g,1.0,.70,1.45,rust,0,.64,0);for(const side of [-1,1])for(const z of [-.5,.5]){const w=mesh(g,new THREE.CylinderGeometry(.22,.22,.13,14),metal,side*.47,.22,z);w.rotation.z=Math.PI/2;}box(g,.82,.18,.64,red,0,1.07,.25);}
  else {for(const side of [-1,1])box(g,.08,1.05,.10,rust,side*.43,.52,0);box(g,1.05,.32,.16,cream,0,.78,0);for(let x=-.4;x<.5;x+=.22){const stripe=box(g,.10,.36,.025,black,x,.78,-.10);stripe.rotation.z=-.4;}}
  // Hazard reflectors remain visible through the short fog range.
  for(const x of [-.38,.38])mesh(g,new THREE.SphereGeometry(.055,8,6),warning,x,1.12,-.08);
 }
 // Closed ticket booths, collapsed signs, wheel silhouettes and a derelict carousel.
 for(let i=0;i<12;i++){const s=18+i*32,side=i%2?1:-1,g=groupAt(s,side*(7+i%3));box(g,3,2.8,2.4,i%2?red:wood,0,1.4,0);box(g,3.45,.18,2.8,rust,0,2.85,0);box(g,1.8,.9,.10,black,0,1.8,-1.23);for(let j=0;j<4;j++){const plank=box(g,1.85,.12,.10,wood,0,1.45+j*.22,-1.30);plank.rotation.z=(j%2?.07:-.08);}const sign=label(['TICKETS','CLOSED 1984','NO RIDERS','ARCADE'][i%4],2.7,.37,'#bca378','#48302b');sign.position.set(0,2.48,-1.34);sign.rotation.y=Math.PI;g.add(sign);}
 function wheel(s,side){const g=groupAt(s,side*18);for(const x of [-3.5,3.5])rod(g,[x,0,0],[0,10,0],.20,rust);const ring=mesh(g,new THREE.TorusGeometry(7.5,.15,8,64),rust,0,10,0);for(let i=0;i<12;i++){const a=i/12*Math.PI*2,x=Math.cos(a)*7.5,y=10+Math.sin(a)*7.5;rod(g,[0,10,0],[x,y,0],.065,metal);box(g,1.3,1.05,1.05,red,x,y-.65,0);}return g;}wheel(68,-1);wheel(308,1);
 const carousel=groupAt(199,-14);mesh(carousel,new THREE.CylinderGeometry(4.8,5,.3,32),rust,0,.25,0);mesh(carousel,new THREE.ConeGeometry(5.5,2.2,16),red,0,5,0);rod(carousel,[0,0,0],[0,5,0],.2,metal);for(let i=0;i<8;i++){const a=i/8*Math.PI*2,x=Math.sin(a)*3.6,z=Math.cos(a)*3.6;rod(carousel,[x,.3,z],[x,4,z],.06,cream);box(carousel,.38,.55,1.2,wood,x,1.4,z);}
 // Dark branches and ragged bunting frame the rails without hiding hazard lanes.
 for(let s=12;s<RIDE_LENGTH;s+=23){const g=groupAt(s);for(const side of [-1,1]){rod(g,[side*4.7,0,0],[side*4.4,4.8,0],.14,wood);rod(g,[side*4.5,3,0],[side*6.5,4.4,.7],.06,wood);}for(let i=0;i<9;i++){const shape=new THREE.Shape();shape.moveTo(-.3,0);shape.lineTo(.3,0);shape.lineTo(.1,-.60);shape.closePath();mesh(g,new THREE.ShapeGeometry(shape),i%2?red:cream,-3.2+i*.8,4.4-Math.sin(i/8*Math.PI)*.5,0);}}
 const gate=groupAt(RIDE_LENGTH);for(const side of [-1,1])box(gate,.4,5,.5,rust,side*2.8,2.5,0);box(gate,6.1,.6,.5,metal,0,4.65,0);const exit=label('PARK EXIT — COAST ROAD',5,.56,'#bdd4b5','#203b30');exit.position.set(0,4.62,-.29);exit.rotation.y=Math.PI;gate.add(exit);
 const exitLight=new THREE.PointLight(0x8aa77f,45,20,2);exitLight.position.copy(path(RIDE_LENGTH,0,4));root.add(exitLight);
 for(const g of chunks.values())root.add(bakeStatic(g));
 const moonCanvas=document.createElement('canvas');moonCanvas.width=moonCanvas.height=384;const mx=moonCanvas.getContext('2d');mx.fillStyle='#8f3028';mx.fillRect(0,0,384,384);let moonSeed=715;const rand=()=>{moonSeed=(moonSeed*1664525+1013904223)>>>0;return moonSeed/4294967296;};for(let i=0;i<1500;i++){const x=rand()*384,y=rand()*384,r=1+rand()*15;mx.fillStyle=i%2?'rgba(36,15,15,.08)':'rgba(194,91,55,.065)';mx.beginPath();mx.ellipse(x,y,r,r*.7,0,0,Math.PI*2);mx.fill();}const lunarShade=mx.createLinearGradient(0,0,384,384);lunarShade.addColorStop(0,'#00000088');lunarShade.addColorStop(.5,'#00000000');lunarShade.addColorStop(1,'#120303aa');mx.fillStyle=lunarShade;mx.fillRect(0,0,384,384);const moonMap=new THREE.CanvasTexture(moonCanvas);moonMap.colorSpace=THREE.SRGBColorSpace;
 const moon=mesh(root,new THREE.SphereGeometry(8,40,28),new THREE.MeshBasicMaterial({map:moonMap,fog:false}),-65,56,475);moon.castShadow=false;const halo=mesh(root,new THREE.SphereGeometry(8.3,32,20),new THREE.MeshBasicMaterial({color:0xa13930,transparent:true,opacity:.10,fog:false,side:THREE.BackSide}),-65,56,475);halo.castShadow=false;
 const moonLight=new THREE.DirectionalLight(0xb64d42,.75);moonLight.position.set(-65,56,475);root.add(moonLight);const fill=new THREE.HemisphereLight(0x778783,0x151916,.33);root.add(fill);
 const cart=new THREE.Group();root.add(cart);box(cart,1.08,.16,1.52,rust,0,.35,0);for(const side of [-1,1])box(cart,.08,.50,1.50,red,side*.54,.66,0);box(cart,1.08,.56,.09,red,0,.69,.72);box(cart,.89,.16,.53,wood,0,.54,-.24);rod(cart,[-.46,1.0,.34],[.46,1.0,.34],.035,metal);for(const x of [-.45,.45])rod(cart,[x,.42,.34],[x,1.0,.34],.026,metal);
 const wheels=[];for(const side of [-1,1])for(const z of [-.52,.52]){const wheel=mesh(cart,new THREE.CylinderGeometry(.23,.23,.12,16),metal,side*.47,.20,z);wheel.rotation.z=Math.PI/2;wheels.push(wheel);}
 const headlamp=new THREE.SpotLight(0xf2c68b,90,38,.40,.75,1.35),target=new THREE.Object3D();headlamp.position.set(0,.8,.70);target.position.set(0,.5,18);cart.add(headlamp,target);headlamp.target=target;
 return {root,path,forward,cart,update(state,t,camera,creature,lookBack=false){const s=state.progress;cart.position.copy(path(s,state.lateral));const f=forward(s);cart.rotation.set(0,Math.atan2(f.x,f.z),Math.sin(t*16)*.006+state.hitFlash*Math.sin(t*55)*.025);wheels.forEach(w=>w.rotation.x=s*4);
  const cameraPos=path(s-.20,state.lateral,1.35+Math.sin(t*12)*.018);camera.position.copy(cameraPos);camera.lookAt(path(s+(lookBack?-12:18),lookBack?state.lateral:state.lateral*.35,lookBack?1.35:1.4));camera.rotation.z+=state.hitFlash*Math.sin(t*43)*.035;moon.position.copy(camera.position).add(new THREE.Vector3(-40,42,210));halo.position.copy(moon.position);
  creature.position.copy(path(s-state.gap,state.lateral*.70,.06+Math.sin(t*17)*.08));const cf=forward(s-state.gap);creature.rotation.set(Math.sin(t*5)*.055,Math.atan2(cf.x,cf.z),Math.sin(t*8)*.06);
 }};
}
