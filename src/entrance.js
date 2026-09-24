import * as THREE from 'three';
import {bakeStatic} from '../assetlib.js';
import {addFestoon} from './festoon-lights.js';
import {addParkGrounds} from './park-grounds.js';
import {addRats} from './rats.js';
import {addCarnivalFacade} from './carnival-facade.js';
import {buildFoulRoom} from './foul-room.js';
import {buildDoor} from './door-designs.js';
import {horrorHead} from './horror-head.js';
import {barrelState,movingFloor} from './entrance-model.js';
import {label} from './world.js';
export function buildEntrance(scene){
 const root=new THREE.Group(),fixed=new THREE.Group();root.name='multi-storey-attraction';root.add(fixed);scene.add(root);const mats=new Map();
 function box(p,w,h,d,x,y,z,c){if(!mats.has(c))mats.set(c,new THREE.MeshStandardMaterial({color:c,roughness:.87}));const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mats.get(c));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;}
 function sign(text,x,y,z,w=3,h=.4,rot=0){const o=label(text,w,h);o.position.set(x,y,z);o.rotation.y=rot;fixed.add(o);}
 function rod(p,a,b,r,c){const delta=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),8),new THREE.MeshStandardMaterial({color:c,metalness:.6,roughness:.65}));o.position.fromArray(a).addScaledVector(delta,.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());p.add(o);return o;}
 // Original three-storey frontage, painted cladding, cage lift and a faux-rock flank.
 box(fixed,30,.22,24,0,5.85,-26,0x333a34);
 for(const s of [-1,1]){box(fixed,5.4,9,.5,s*4.6,10.5,-17.5,0x55463b);for(let j=0;j<4;j++){const p=box(fixed,2.4,2,.20,s*(3.2+j%2*2.5),7.4+Math.floor(j/2)*3,-17.84,[0x72382b,0x2e6764,0x9e803b,0x66557a][j]);p.rotation.z=s*(j%2?.11:-.07);}}
 box(fixed,3.7,5,.5,0,12.5,-17.5,0x722d2d);
 for(let i=0;i<38;i++){const bulb=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),new THREE.MeshBasicMaterial({color:i%5?0x896644:0xffbc62}));bulb.position.set(-6+i*.32,11.25,-17.95);fixed.add(bulb);}
 for(let i=0;i<18;i++){const rock=new THREE.Mesh(new THREE.IcosahedronGeometry(.8+i%3*.22,1),new THREE.MeshStandardMaterial({color:0x57564c,roughness:1}));rock.scale.set(1,1.4,.8);rock.position.set(7.2+Math.sin(i*2.1)*.45,6.8+i*.46,-17.5+Math.cos(i)*.5);fixed.add(rock);}
 for(let i=0;i<9;i++)rod(fixed,[5.3+i*.15,6,-18.15],[5.3+i*.15,15,-18.15],.02,0x8f6942);for(let y=6;y<15;y+=.4)rod(fixed,[5.3,y,-18.15],[6.5,y,-18.15],.014,0x6c5638);
 for(let y=9;y<=15;y+=3){box(fixed,y===15?10:13,.17,.55,y===15?-1:0,y,-17.6,0x313e36);for(let i=0;i<27;i++)rod(fixed,[-6.5+i*.5,y,-18.5],[-6.5+i*.5,y+.8,-18.5],.018,0x697260);}
 // A neglected forecourt gives the attraction breathing room and a crooked silhouette.
 const foliage=new THREE.MeshStandardMaterial({color:0x1f352a,roughness:1});for(const [i,x,z] of [[0,-8,-19],[1,9,-21],[2,-11,-30],[3,11,-32],[4,-13,-23]]){rod(fixed,[x,6,z],[x+.25,10.7+i%2,z],.19,0x443b2b);for(let j=0;j<5;j++){const a=j*2.4+i;rod(fixed,[x,8.4+j*.37,z],[x+Math.sin(a)*1.6,10.2+j*.3,z+Math.cos(a)*1.4],.063,0x443b2b);const leaves=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2+j%2*.4,1),foliage);leaves.scale.y=.7;leaves.position.set(x+Math.sin(a)*1.4,10.4+j*.26,z+Math.cos(a)*1.2);fixed.add(leaves);}}
 // A rusted wheel and empty hanging cars, viewed through the trees.
 const wheel=new THREE.Group();wheel.position.set(-12,11.8,-19);wheel.rotation.y=-.2;fixed.add(wheel);const rim=new THREE.Mesh(new THREE.TorusGeometry(4.1,.065,8,64),new THREE.MeshStandardMaterial({color:0x685846,metalness:.4,roughness:.84}));wheel.add(rim);for(let i=0;i<10;i++){const a=i*Math.PI/5,x=Math.cos(a)*4.1,y=Math.sin(a)*4.1;rod(wheel,[0,0,0],[x,y,0],.022,0x71644f);rod(wheel,[x,y,0],[x,y-.5,0],.025,0x8f805e);box(wheel,.72,.42,.50,x,y-.65,0,[0x6d322c,0x385653,0x705d37][i%3]);}for(const s of [-1,1])rod(fixed,[-12+s*2,6,-19],[-12,11.8,-19],.12,0x575849);
 // Shuttered ring-toss stall with a striped peaked canopy.
 const stallX=10,stallZ=-25;for(const x of [-1.8,1.8])for(const z of [-1,1])rod(fixed,[stallX+x,6,stallZ+z],[stallX+x,8.8,stallZ+z],.055,0x716342);box(fixed,3.8,1.1,2,stallX,6.55,stallZ,0x5e3c30);for(let i=0;i<12;i++)box(fixed,3.55,.12,.06,stallX,7.15+i*.12,stallZ-1,0x474c40);const roof=new THREE.Mesh(new THREE.ConeGeometry(2.45,1.15,4),new THREE.MeshStandardMaterial({color:0x743c32,roughness:.9}));roof.position.set(stallX,9.1,stallZ);roof.rotation.y=Math.PI/4;fixed.add(roof);sign('RING TOSS',stallX,8.55,stallZ-1.1,3,.35,Math.PI);
 // Original neon tube arrows point at the actual entrance rather than an empty facade bay.
 function neon(points,color){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'catmullrom',.01),tube=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(8,points.length*4),.034,7,false),new THREE.MeshBasicMaterial({color}));fixed.add(tube);}
 neon([[-3.5,10.15,-18.3],[-2,9.9,-18.3],[-.7,9.15,-18.3]],0xff5d42);neon([[-1.7,9.2,-18.3],[-.7,9.15,-18.3],[-.9,10.0,-18.3]],0xff5d42);
 neon([[3.5,10.2,-18.3],[2.1,9.8,-18.3],[.8,9.1,-18.3]],0x69e1c1);neon([[1.7,9.2,-18.3],[.8,9.1,-18.3],[1,10,-18.3]],0x69e1c1);
 sign('ENTRANCE',-3.8,10.65,-18.2,2.7,.55,Math.PI);sign('ENTER',3.5,10.65,-18.2,2.1,.55,Math.PI);
 for(const [x,c] of [[-2.8,0xff6044],[2.8,0x57d5bb]]){const light=new THREE.PointLight(c,35,8,2);light.position.set(x,9.9,-19.1);root.add(light);}
 // Scalloped arch and unequal roof fins break up the rectangular frontage.
 const arch=[];for(let i=0;i<=32;i++){const a=i/32*Math.PI;arch.push([Math.cos(a)*2.05,8.65+Math.sin(a)*1.25,-18.1]);}neon(arch,0xdfa95a);
 for(let i=0;i<5;i++){const fin=box(fixed,1.15,1.6+i%2*.6,.38,-4+i*1.7,15.2+i%3*.28,-17.7,[0x88543a,0x396768,0x7e3951][i%3]);fin.rotation.z=(i-2)*.17;}
 const facadeLight=new THREE.SpotLight(0xb6c8c0,450,30,.8,.7,1.5);facadeLight.position.set(-5,14,-25);facadeLight.target.position.set(1,10,-17.7);root.add(facadeLight,facadeLight.target);
 // Empty booth: velvet lower panels, glass, speaking grille and ticket drawer.
 box(fixed,2.9,1.2,2,-3.3,6.6,-14.4,0x702f2d);box(fixed,3.1,.13,2.2,-3.3,7.24,-14.4,0x564b37);box(fixed,3, .22,2.1,-3.3,9.1,-14.4,0x6e543b);
 for(const x of [-4.73,-1.87])box(fixed,.12,2.8,.16,x,7.4,-15.4,0x9b7c4d);
 const glass=new THREE.Mesh(new THREE.PlaneGeometry(2.7,1.68),new THREE.MeshStandardMaterial({color:0x638582,transparent:true,opacity:.20,roughness:.18,metalness:.2,side:THREE.DoubleSide}));glass.position.set(-3.3,8.14,-15.42);fixed.add(glass);
 for(let i=0;i<11;i++)rod(fixed,[-3.65+i*.065,7.6,-15.44],[-3.65+i*.065,8.1,-15.44],.009,0x9a8456);box(fixed,.65,.07,.35,-3.3,7.35,-15.56,0x8c805c);sign('TICKETS / 1987',-3.3,8.86,-15.54,2.5,.29,Math.PI);
 const booth=new THREE.PointLight(0xe6a35e,3,4,2);booth.position.set(-3.3,8.4,-14.2);root.add(booth);
 const turn=new THREE.Group();turn.position.set(0,6,-16);root.add(turn);box(turn,.25,1.1,.25,0,.55,0,0x53625a);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;rod(turn,[0,.93,0],[Math.sin(a)*(i===1?.46:1.1),.93-(i===1?.3:0),Math.cos(a)*(i===1?.46:1.1)],.038,0x999878);}
 // Enclosed lower corridor, then a rising ramp and a returning upper gallery.
 box(fixed,3.4,.16,14.8,0,5.92,-8.6,0x383c30);box(fixed,3.4,.16,4.8,0,5.92,3.6,0x383c30);for(const x of [-1.45,1.45])box(fixed,.5,.16,2.4,x,5.92,0,0x383c30);const lowerTrap=box(root,2.4,.16,2.4,0,5.92,0,0x383c30);for(const x of [-1.8,1.8]){if(x>0)box(fixed,.18,3.35,22,x,7.65,-5,0x30332d);else{box(fixed,.18,3.35,6.65,x,7.65,-12.675,0x30332d);box(fixed,.18,3.35,12.65,x,7.65,-.325,0x30332d);box(fixed,.18,.5,2.7,x,9.15,-8,0x30332d);}box(fixed,.16,6.35,x<0?4:2.3,x,9.175,x<0?8:7.15,0x574234);}box(fixed,3.7,.13,22,0,9.4,-5,0x191f1b);
 box(fixed,3.6,.14,4,0,12.35,8,0x272c23);box(fixed,3.6,2.9,.16,0,10.87,6,0x272c23);
 // Visible stair treads overlay a collision-continuous ramp.
 for(let i=0;i<24;i++)box(fixed,3.4,.18,3.5/24,0,6+(i+.5)/24*3,6+(i+.5)/24*3.5,0x534f3c);
 for(const x of [-1.55,1.55])rod(fixed,[x,7,6],[x,10,9.5],.034,0x857449);
 box(fixed,7,.16,3.4,5.2,8.91,10,0x4e4535);box(fixed,3.4,.16,2.2,0,8.91,10.6,0x4e4535);box(fixed,3.4,.16,10,7,8.91,5,0x4e4535);box(fixed,7.5,.16,3.4,4.95,8.91,0,0x4e4535);for(const z of [-1.45,1.45])box(fixed,2.9,.16,.5,-.25,8.91,z,0x4e4535);box(fixed,.5,.16,2.4,-1.45,8.91,0,0x4e4535);
 box(fixed,3.6,3.3,.16,3.5,10.65,8.3,0x593a31);box(fixed,10.4,3.3,.16,3.5,10.65,11.7,0x593a31);box(fixed,.16,3.3,6.6,5.3,10.65,5,0x384845);box(fixed,.16,3.3,13.4,8.7,10.65,5,0x384845);box(fixed,.16,3.3,3.4,-1.7,10.65,0,0x384845);box(fixed,.16,3.3,3.4,-1.7,10.65,10,0x384845);box(fixed,10.4,3.3,.16,3.5,10.65,-1.7,0x554a36);box(fixed,7,3.3,.16,1.8,10.65,1.7,0x554a36);
 box(fixed,11,.14,14,3.5,12.35,5,0x272c23);
 for(const [x,z] of [[-1.36,11.3],[8.3,11.3],[8.3,-1.3],[-1.3,-1.3]]){box(fixed,.25,3.2,.25,x,10.6,z,0x544832);for(const y of [9.22,12])box(fixed,.38,.13,.38,x,y,z,0x756244);}
 box(fixed,.52,.82,.40,8.29,9.41,10.8,0x4a5845);box(fixed,.44,.10,.43,8.29,9.90,10.8,0x766346);
 const trap=box(root,2.4,.14,2.4,0,8.95,0,0x403229);
 const panels=Array.from({length:5},(_,i)=>box(root,1.55,.18,i===0?2:3.2,i*1.65,9,i===0?10.6:10,i%2?0x696049:0x43392c));
 sign('UNEVEN FLOORS — HOLD THE RAIL',3.4,11.6,11.58,4,.33,Math.PI);sign('THIS WAY ↓',7,11.5,8.4,2,.4,Math.PI);for(const x of [6.3,7.7])rod(fixed,[x,11.7,8.4],[x,12.3,8.4],.018,0x6c7055);
 const barrel=new THREE.Group();root.add(barrel);const barrelMesh=new THREE.Mesh(new THREE.CylinderGeometry(.51,.51,.86,24,4),new THREE.MeshStandardMaterial({color:0x745235,roughness:.8}));barrelMesh.rotation.z=Math.PI/2;barrel.add(barrelMesh);for(const x of [-.34,.34]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.514,.026,8,24),new THREE.MeshStandardMaterial({color:0x626559,metalness:.7,roughness:.5}));ring.rotation.y=Math.PI/2;ring.position.x=x;barrel.add(ring);}sign('ROLLING STOCK / WAIT FOR A GAP',0,8.8,5.85,3,.28,Math.PI);for(const x of [-1,1])rod(fixed,[x,8.95,5.85],[x,9.33,5.85],.018,0x6c7055);
 const switchMesh=box(fixed,.20,.32,.08,1.64,7.3,-2,0x92846b);box(fixed,.055,.14,.10,1.59,7.3,-2,0x292c22);sign('LIGHTS',1.59,7.7,-2,.55,.15,-Math.PI/2);
 addFestoon(root,[[[-4.7,9.05,-15.6],[-3.3,8.87,-15.6],[-1.9,9.05,-15.6]],[[-1.65,8.95,-15],[-1.65,8.75,-11],[-1.65,8.95,-8]],[[5.4,12.12,6.3],[7,11.96,6.3],[8.6,12.12,6.3]],[[8.1,8.85,-26.1],[10,8.65,-26.1],[11.9,8.85,-26.1]]]);
 const grounds=addParkGrounds(root,label);
 const rats=addRats(root,[[-4,-22],[4,-23],[-7,-27],[7,-28],[.8,-10],[-.8,-3]],()=>6);
 const foul=buildFoulRoom();root.add(foul.root);
 const doors=[];for(const [kind,x,y,z,rot] of [['double',-1.7,6,-8,Math.PI/2],['glow',1.69,6,-5,-Math.PI/2],['red',7,9,6.15,0],['hands',8.6,9,1.5,-Math.PI/2]]){const d=buildDoor(kind);d.root.position.set(x,y,z);d.root.rotation.y=rot;root.add(d.root);doors.push(d);}
 for(const x of [5.75,8.25])box(root,.9,3.3,.15,x,10.65,6.15,0x3b4235);
 const rig=new THREE.Group();rig.position.set(7,14,5.45);root.add(rig);const head=horrorHead({mechanical:true});head.root.position.y=.57;head.root.scale.setScalar(1.35);rig.add(head.root);
 for(const s of [-1,1]){rod(rig,[0,.05,0],[s*.6,.18,0],.05,0x676a56);rod(rig,[s*.55,.18,0],[s*.68,-.56,.2],.036,0x6c725f);rod(rig,[s*.68,-.56,.2],[s*.34,-.98,.3],.028,0x4c544b);for(let j=0;j<5;j++)rod(rig,[s*.35,-.95,.3],[s*(.28+j*.045),-1.22,.34],.011,0x90917b);}
 for(let j=0;j<7;j++)rod(rig,[-.23,-j*.09,0],[.23,-j*.09,0],.018,0x565d51);rod(rig,[0,.27,0],[0,-.72,0],.043,0x666d58);
 const wires=[];for(const s of [-1,1]){const line=rod(root,[7+s*.3,12.2,5.45],[7+s*.3,10.5,5.45],.011,0x4b5045);wires.push(line);}rig.visible=false;
 const lit=[];for(const [x,y,z] of [[0,8.7,-2],[0,8.8,3],[0,11,9],[7,11.8,9],[7,11.8,3],[0,11.5,0]]){const l=new THREE.PointLight(0xcbb77d,0,7,2);l.position.set(x,y,z);root.add(l);lit.push(l);box(fixed,.5,.10,.24,x,y+.05,z,0x514f3c);}
 root.remove(fixed);root.add(bakeStatic(fixed));addCarnivalFacade(root,label);
 return {root,doors,update(s,dt,p){grounds.update(s.age);rats.update(s.age);foul.update(s.age,s.foulAge);turn.rotation.y=s.turnstile?Math.PI*.62:0;for(const l of lit)l.intensity=s.power?(s.disturbance?2:12):0;const b=barrelState(s.age);barrel.position.set(b.x,6.53,b.z);barrel.rotation.x=b.z/.51;panels.forEach((o,i)=>{const f=movingFloor(i,s.age);o.position.y=9+f.height;o.rotation.z=f.tilt;});doors.forEach((d,i)=>d.update(s.age,dt,(i===2&&s.door)||(i===0&&s.foulDoor),Math.hypot(p.x-d.root.position.x,p.z-d.root.position.z)));rig.visible=s.scareAge>=0;rig.position.y=s.scareAge<0?14:10.15+Math.max(0,1-s.scareAge/.42)**2*3.8+Math.sin(s.scareAge*7)*Math.exp(-s.scareAge*1.2)*.25;rig.rotation.z=Math.sin(s.age*1.7)*.07;head.update(s.age,{clank:s.scareAge>=0&&s.scareAge<5,lookX:(p.x-7)*.2});trap.visible=lowerTrap.visible=s.fallAge<0;for(const w of wires)w.visible=rig.visible;},state:()=>({rats:rats.state(),foul:foul.state(),doors:doors.map(d=>d.state()),jaw:head.jaw.rotation.x,animatronicY:rig.position.y})};
}
