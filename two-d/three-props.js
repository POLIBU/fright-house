import * as THREE from '../vendor/three.module.js';
import turnstile from './assets/three/broken-turnstile.js';
import carousel from './assets/three/windup-carousel.js';
export {THREE,carousel};
export function createPropRenderer(){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(96,96,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1.05,1.05,1.2,-1.2,.01,20);camera.position.set(1.8,2.2,5);camera.lookAt(0,.6,0);
 scene.add(new THREE.HemisphereLight(0xdacbb5,0x252e2b,2));const light=new THREE.DirectionalLight(0xffd396,3);light.position.set(-3,5,4);scene.add(light);
 const gate=turnstile(THREE),toy=carousel(THREE);scene.add(gate,toy);toy.scale.setScalar(4);toy.position.y=.15;
 const cache=new Map();let lastProgress=-1;
 return {draw(ctx,kind,progress=0){
  if(!cache.has(kind)||(kind==='gate'&&progress!==lastProgress)){
   gate.visible=kind==='gate';toy.visible=kind==='toy';gate.userData.joints.spindle.rotation.z=progress*Math.PI/2;renderer.render(scene,camera);
   const frame=cache.get(kind)||document.createElement('canvas');frame.width=frame.height=96;frame.getContext('2d').drawImage(renderer.domElement,0,0);cache.set(kind,frame);if(kind==='gate')lastProgress=progress;
  }
  if(kind==='gate')ctx.drawImage(cache.get(kind),221,119,37,36);else ctx.drawImage(cache.get(kind),69,222,24,24);
 },snapshot(){return {draws:renderer.info.render.calls,triangles:renderer.info.render.triangles};}};
}
