import * as THREE from 'three';
import {bakeStatic} from '../assetlib.js';
export function addCarnivalFacade(root,label){
 const fixed=new THREE.Group(),palette=[0xb13235,0x2b9d9c,0xb09435,0x76519b,0x487d48];
 const mat=(c,m=.05)=>new THREE.MeshStandardMaterial({color:c,roughness:.72,metalness:m});
 const cream=mat(0xd4c696),red=mat(0xb62b34),purple=mat(0x673f80),teal=mat(0x278c93),gold=mat(0xd19c3c,.3),ink=mat(0x233539);
 function box(w,h,d,x,y,z,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);fixed.add(o);return o;}
 function ell(x,y,z,sx,sy,sz,m){const o=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);fixed.add(o);return o;}
 function tube(points,r,m,segments=64){const o=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),segments,r,10,false),m);fixed.add(o);return o;}
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#d8cba8';ctx.fillRect(0,0,512,512);ctx.fillStyle='#bc303c';for(let i=-5;i<8;i++){ctx.beginPath();ctx.moveTo(i*128,0);ctx.lineTo(i*128+58,0);ctx.lineTo(i*128+512+58,512);ctx.lineTo(i*128+512,512);ctx.fill();}let seed=587;for(let i=0;i<2000;i++){seed=(seed*1664525+1013904223)>>>0;ctx.fillStyle=i%3?'#81725e33':'#dad0a57a';ctx.fillRect(seed%512,(seed>>>9)%512,1+seed%7,1+seed%5);}const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(1,2);const striped=new THREE.MeshStandardMaterial({map,roughness:.8});
 for(const s of [-1,1]){
  const x=s*6.2,z=-18.5,h=s<0?8.5:10;
  const tower=new THREE.Mesh(new THREE.CylinderGeometry(.64,.81,h,32,8),striped);tower.position.set(x,6+h/2,z);fixed.add(tower);
  for(const y of [6.18,6+h-.2]){const ring=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.31,32),teal);ring.position.set(x,y,z);fixed.add(ring);}
  const roof=new THREE.Mesh(new THREE.ConeGeometry(1.03,2.05,12,1),red);roof.position.set(x,7+h,z);roof.rotation.y=.12*s;fixed.add(roof);ell(x,8.08+h,z,.11,.20,.11,gold);
  const hatch=new THREE.Mesh(new THREE.TorusGeometry(.24,.056,8,24),gold);hatch.position.set(x,5.3+h,z-.69);fixed.add(hatch);ell(x,5.3+h,z-.70,.19,.19,.018,ink);
  const points=[[s*2.8,13.6,-18.3],[s*3.8,13.4,-19.25],[s*4.5,12.25,-19.6],[s*3.2,11.0,-19.4],[s*3.0,9.7,-18.8],[s*4.4,8.6,-19],[s*4.7,7.6,-20.2]];
  tube(points,.44,red);for(const j of [1,3,5]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.453,.022,6,24),gold);ring.position.fromArray(points[j]);ring.rotation.y=s*.8;fixed.add(ring);}ell(s*2.8,13.6,-18.3,.58,.58,.10,gold);
  for(let i=0;i<8;i++){const p=box(1.2,1.3,.10,s*(2.4+i%3*1.1),7+i*.86,-17.87,mat(palette[i%5]));p.rotation.z=s*Math.sin(i)*.12;}
 }
 // Mouth has real open space; only its perimeter and high teeth are solid scenery.
 const mouth=[[-1.85,6.02,-18.05],[-1.87,7.5,-18.05],[-1.55,9.05,-18.05],[-.9,9.62,-18.05],[0,9.75,-18.05],[.9,9.62,-18.05],[1.55,9.05,-18.05],[1.87,7.5,-18.05],[1.85,6.02,-18.05]];
 tube(mouth,.24,cream);tube(mouth.map(([x,y,z])=>[x*.90,y,z-.14]),.12,red);
 for(const s of [-1,1]){ell(s*1.6,10.15,-18.07,1.10,.83,.20,cream);ell(s*1.25,10.32,-18.27,.54,.49,.08,teal);ell(s*1.18,10.25,-18.35,.20,.28,.05,ink);ell(s*1.12,10.35,-18.40,.054,.063,.025,cream);tube([[s*.62,10.73,-18.35],[s*1.35,11.06,-18.26],[s*2.05,10.7,-18.18]],.14,purple);ell(s*2.14,9.55,-18.17,.34,.30,.07,red);for(let i=0;i<4;i++){const flame=box(.35,1.1,.18,s*(2.55+i*.19),10.1-i*.22,-18.02,red);flame.rotation.z=s*(-.4-i*.2);}}
 ell(0,10.06,-18.39,.58,.38,.27,red);
 for(let i=0;i<7;i++){const x=(i-3)*.33,y=9.40-Math.abs(x)*.16,tooth=new THREE.Mesh(new THREE.ConeGeometry(.17,.48,12),cream);tooth.position.set(x,y,-18.15);tooth.rotation.z=Math.PI+x*.12;fixed.add(tooth);}
 const title='FRIGHT HOUSE';for(let i=0;i<title.length;i++){const x=(i-(title.length-1)/2)*.64,y=13.8-.095*x*x;if(title[i]!==' '){const letter=label(title[i],.68,.93,'#ffd582','#68332a');letter.position.set(x,y,-18.35);letter.rotation.y=Math.PI;letter.rotation.z=-x*.10;fixed.add(letter);}for(const side of [-1,1]){ell(x,y+side*.53,-18.34,.034,.034,.034,new THREE.MeshBasicMaterial({color:(i+side)%5?0xffc659:0x6e5131}));}}
 for(let i=0;i<13;i++){const b=box(.38,.16,.12,-2.35+i*.39,6.12,-18.4,i%2?red:gold);b.rotation.z=Math.sin(i)*.02;}
 root.add(bakeStatic(fixed));const glow=new THREE.PointLight(0xf6b867,65,13,2);glow.position.set(0,11.8,-21);root.add(glow);
}
