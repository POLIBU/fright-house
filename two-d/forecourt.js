import {THREE} from './three-props.js';
import generate from './forecourt-geometry.js';
export function createForecourt(image,geometryFactory=generate){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,preserveDrawingBuffer:true});renderer.setSize(480,360,false);renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-12,12,18,0,.01,30);camera.position.z=10;camera.updateProjectionMatrix();camera.updateMatrixWorld();
 const texture=new THREE.Texture(image);texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.LinearFilter;texture.needsUpdate=true;
 const root=geometryFactory(THREE);scene.add(root);root.updateMatrixWorld(true);const v=new THREE.Vector3();
 // Bake projected UVs once. Each solid retains the exact approved painted detail.
 root.traverse(o=>{if(!o.isMesh||o.userData.keepMaterial)return;const p=o.geometry.attributes.position,uv=o.geometry.attributes.uv;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld).project(camera);uv.setXY(i,(v.x+1)/2,(v.y+1)/2);}uv.needsUpdate=true;o.material=new THREE.MeshBasicMaterial({map:texture});});
 const shutter=root.getObjectByName('kiosk-shutter'),cache=new Map();let lastShutter=-1;
 function paintLayer(group){for(const g of root.children)g.visible=g===group;renderer.render(scene,camera);const c=cache.get(group.name)||document.createElement('canvas');c.width=480;c.height=360;c.getContext('2d').drawImage(renderer.domElement,0,0);cache.set(group.name,c);}
 for(const g of root.children)paintLayer(g);
 return {draw(ctx,s,front=false){if(shutter&&lastShutter!==s.shutter){shutter.scale.y=1-s.shutter*.66;shutter.position.y=shutter.userData.baseY+s.shutter*.528;paintLayer(shutter.parent);lastShutter=s.shutter;}
  for(const g of root.children){if((s.y<g.userData.floor)!==front)continue;
   ctx.drawImage(cache.get(g.name),0,0);
  }
 },drawLayer(ctx,name){const frame=cache.get(name);if(frame)ctx.drawImage(frame,0,0);},snapshot(){return {layers:root.children.map(g=>({name:g.name,depth:g.userData.floor,meshes:g.children.length,solidVolumes:g.children.filter(m=>m.userData.solidVolume).length})),shutter:lastShutter};}};
}
