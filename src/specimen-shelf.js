import * as THREE from 'three';
import {bakeStatic} from '../assetlib.js';
export function addSpecimenShelf(parent,label){
 const root=new THREE.Group(),fixed=new THREE.Group(),floaters=[];root.add(fixed);parent.add(root);
 const wood=new THREE.MeshStandardMaterial({color:0x403a2a,roughness:.94}),skin=new THREE.MeshStandardMaterial({color:0xaaa16c,roughness:.78}),dark=new THREE.MeshStandardMaterial({color:0x433e2c,roughness:.9}),glass=new THREE.MeshStandardMaterial({color:0x9cbbab,transparent:true,opacity:.13,roughness:.12,metalness:.18,side:THREE.DoubleSide,depthWrite:false}),liquid=new THREE.MeshStandardMaterial({color:0x987329,transparent:true,opacity:.12,roughness:.25,side:THREE.DoubleSide,depthWrite:false});
 function ell(p,x,y,z,sx,sy,sz,m=skin){const o=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);p.add(o);return o;}
 function box(p,w,h,d,x,y,z,m=wood){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);p.add(o);return o;}
 for(const x of [-1.35,1.35])box(fixed,.12,2.7,.52,x,1.35,0);for(const y of [.12,.98,1.82,2.7])box(fixed,2.8,.10,.60,0,y,0);box(fixed,2.8,2.7,.055,0,1.35,-.28);
 for(let i=0;i<21;i++){const row=i%3,y=[.17,1.03,1.87][row],x=-1.20+Math.floor(i/3)*.11+(row===1?.65:0);const h=.39+(i%5)*.055,m=new THREE.MeshStandardMaterial({color:[0x733b31,0x3a5141,0x51466a,0x736347][i%4],roughness:1});const book=box(fixed,.085,h,.29,x,y+h/2,-.05,m);book.rotation.z=(i%4-1.5)*.035;for(const yy of [-h*.34,h*.34])box(fixed,.074,.012,.012,x,y+h/2+yy,.102,skin);}
 for(const [i,x,y,r,h,name] of [[0,.66,1.03,.30,.70,'087 / UNKNOWN'],[1,.62,.17,.18,.53,'HAND / 12'],[2,1.04,1.87,.15,.36,'OCULAR'],[3,.45,1.87,.17,.42,'AURICLE']]){
  const jar=new THREE.Group();jar.position.set(x,y,.015);root.add(jar);const pts=[[0,0],[r*.9,0],[r,.035],[r,h*.84],[r*.86,h*.91],[r*.86,h]].map(p=>new THREE.Vector2(...p));jar.add(new THREE.Mesh(new THREE.LatheGeometry(pts,40),glass));const lid=new THREE.Mesh(new THREE.CylinderGeometry(r*.93,r*.94,.035,32),glass);lid.position.y=h+.014;jar.add(lid);ell(jar,0,h+.07,0,r*.20,.045,r*.20,glass);const fluid=new THREE.Mesh(new THREE.CylinderGeometry(r*.96,r*.96,h*.76,32),liquid);fluid.position.y=h*.40;jar.add(fluid);
  const item=new THREE.Group();item.position.y=h*.41;jar.add(item);
  if(i===0){ell(item,0,.025,0,.187,.25,.15);ell(item,0,-.12,.044,.15,.09,.12);for(const s of [-1,1]){ell(item,s*.178,.015,0,.032,.066,.025);ell(item,s*.074,.035,.136,.054,.032,.027);box(item,.077,.005,.014,s*.074,.025,.161,dark);}ell(item,0,-.005,.16,.031,.062,.035);for(const s of [-1,1])ell(item,s*.019,-.041,.177,.009,.010,.005,dark);ell(item,0,-.09,.151,.069,.010,.01,dark);ell(item,0,-.11,.15,.074,.014,.014);}
  if(i===1){ell(item,0,-.06,0,.06,.08,.026);for(let j=0;j<5;j++){const f=ell(item,(j-2)*.023,.037,0,.012,.086-j%2*.013,.014);f.rotation.z=(j-2)*-.1;}}
  if(i===2){ell(item,0,0,0,.065,.066,.066);ell(item,0,0,.059,.027,.027,.008,new THREE.MeshStandardMaterial({color:0x628688}));ell(item,0,0,.065,.012,.014,.004,dark);}
  if(i===3){const shape=new THREE.TorusGeometry(.064,.023,10,24,Math.PI*1.85),ear=new THREE.Mesh(shape,skin);ear.scale.y=1.4;item.add(ear);ell(item,0,0,-.007,.043,.065,.023);}
  const tag=label(name,r*1.45,.085,'#342e22','#a69769');tag.position.set(0,.08,r+.01);jar.add(tag);floaters.push({item,y:item.position.y,seed:i});
 }
 root.remove(fixed);root.add(bakeStatic(fixed));root.position.set(4.2,0,10.08);root.rotation.y=Math.PI;
 return {root,update(t){floaters.forEach(({item,y,seed})=>{item.position.y=y+Math.sin(t*.53+seed)*.018;item.rotation.y=Math.sin(t*.31+seed)*.14;item.rotation.z=Math.sin(t*.43+seed)*.07;});},state:()=>({jars:4,headFloating:true,books:21})};
}
