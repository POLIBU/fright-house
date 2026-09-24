import * as THREE from '../vendor/three.module.js';
import turnstile from './assets/three/broken-turnstile.js';
import carousel from './assets/three/windup-carousel.js';
import ravenAsset from './assets/three/raven.js';
import {ravenPose} from './levels/ravens.js';
import jaws from './assets/three/clown-jaws.js';
import ticket from './assets/three/admission-ticket.js';
export {THREE,carousel,ticket};
export function createPropRenderer(){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(96,96,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1.05,1.05,1.2,-1.2,.01,20);camera.position.set(1.8,2.2,5);camera.lookAt(0,.6,0);
 scene.add(new THREE.HemisphereLight(0xdacbb5,0x252e2b,2));const light=new THREE.DirectionalLight(0xffd396,3);light.position.set(-3,5,4);scene.add(light);
 const gate=turnstile(THREE),toy=carousel(THREE),stub=ticket(THREE),mouth=jaws(THREE),raven=ravenAsset(THREE);scene.add(gate,toy,stub,mouth,raven);raven.scale.setScalar(4);stub.scale.setScalar(13);stub.position.y=.3;stub.rotation.x=-.5;stub.rotation.z=.25;toy.scale.setScalar(4);toy.position.y=.15;
 const cache=new Map();let lastProgress=-1;
 return {drawRavens(ctx,birds){for(const r of birds){if(r.phase==='gone')continue;const p=ravenPose(r);gate.visible=toy.visible=stub.visible=mouth.visible=false;raven.visible=true;raven.userData.joints.wings.forEach((w,i)=>w.rotation.x=(i?1:-1)*(r.phase==='perched'?1.3:p.wing));renderer.render(scene,camera);ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y-p.height));ctx.scale(r.dx,1);ctx.drawImage(renderer.domElement,-15,-25,30,30);ctx.restore();}raven.visible=false;},draw(ctx,kind,progress=0){
  if(!cache.has(kind)||((kind==='gate'||kind==='mouth')&&progress!==lastProgress)){
   raven.visible=false;mouth.visible=kind==='mouth';mouth.userData.joints.lower.position.y=mouth.userData.joints.lower.userData.baseY+progress*1.36;gate.visible=kind==='gate';toy.visible=kind==='toy';stub.visible=kind==='ticket';gate.userData.joints.spindle.rotation.z=progress*Math.PI/2;renderer.render(scene,camera);
   const frame=cache.get(kind)||document.createElement('canvas');frame.width=frame.height=96;frame.getContext('2d').drawImage(renderer.domElement,0,0);cache.set(kind,frame);if(kind==='gate'||kind==='mouth')lastProgress=progress;
  }
  if(kind==='gate')ctx.drawImage(cache.get(kind),221,119,37,36);else if(kind==='mouth')ctx.drawImage(cache.get(kind),211,89,60,68);else if(kind==='toy')ctx.drawImage(cache.get(kind),294,248,27,27);else ctx.drawImage(cache.get(kind),131,257,24,21);
 },snapshot(){return {draws:renderer.info.render.calls,triangles:renderer.info.render.triangles};}};
}
