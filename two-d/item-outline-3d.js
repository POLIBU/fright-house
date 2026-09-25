import * as THREE from '../vendor/three.module.js';
import {drawSpriteOutline} from './item-highlight.js';
const white=new THREE.MeshBasicMaterial({color:0xffffff}),buffers=new WeakMap();
// Draw the silhouette behind the normal colour pass; never tint the object's materials.
export function drawItemOutlines(ctx,renderer,scene,camera,roots,time=0,x=0,y=0){
 const visible=roots.filter(root=>{for(let o=root;o;o=o.parent)if(!o.visible)return false;return true;});if(!visible.length)return {calls:0,triangles:0};
 const selected=new Set();for(const root of visible)root.traverse(o=>selected.add(o));
 const saved=[];scene.traverse(o=>{if(o.isMesh){saved.push([o,o.visible]);o.visible=o.visible&&selected.has(o);}});
 const material=scene.overrideMaterial;
 try{scene.overrideMaterial=white;renderer.render(scene,camera);const stats={calls:renderer.info.render.calls,triangles:renderer.info.render.triangles};let mask=buffers.get(renderer);if(!mask){mask=document.createElement('canvas');buffers.set(renderer,mask);}mask.width=renderer.domElement.width;mask.height=renderer.domElement.height;const m=mask.getContext('2d');m.drawImage(renderer.domElement,0,0);m.globalCompositeOperation='source-in';m.fillStyle='#fff2cd';m.fillRect(0,0,mask.width,mask.height);drawSpriteOutline(ctx,mask,x,y,mask.width,mask.height,time);return stats;}finally{scene.overrideMaterial=material;for(const [o,value]of saved)o.visible=value;}
}
