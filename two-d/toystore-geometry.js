import {STORE_CRATES,cageFootprint} from './levels/toystore-crates.js';
// Fixed-view shelf and cage solids project the approved painting onto real mesh layers.
export default function generate(THREE){const root=new THREE.Group(),mat=new THREE.MeshBasicMaterial();function part(name,depth){const g=new THREE.Group();g.name=name;g.userData.floor=depth;root.add(g);return g;}function box(g,x,y,w,h,d=.35){const o=new THREE.Mesh(new THREE.BoxGeometry(w*.05,h*.05,d),mat);o.position.set((x+w/2-240)*.05,(360-y-h/2)*.05,d/2);g.add(o);}
const shelf=part('back-shelves',100);for(const y of [54,82,92])box(shelf,168,y,163,5,.45);for(const x of [168,223,329])box(shelf,x,52,4,43);const bench=part('drawing-workbench',192);box(bench,100,166,58,7,.6);for(const x of [103,147])box(bench,x,172,7,20,.45);const pedestal=part('music-pedestal',112);box(pedestal,420,88,36,7,.65);for(const x of [422,451])box(pedestal,x,95,5,16);
// Extruded volumes include tops and sides, preserving the painted finish through
// projected UVs. Their solid floor definitions are also used by player/toy navigation.
for(const crate of STORE_CRATES){
 const g=part(crate.id,crate.kind==='cage'?202:crate.y+crate.h);
 const footprint=crate.kind==='cage'?cageFootprint():[
  {x:crate.x,y:crate.y},{x:crate.x+crate.w,y:crate.y},
  {x:crate.x+crate.w,y:crate.y+crate.h},{x:crate.x,y:crate.y+crate.h}
 ];
 const shape=new THREE.Shape();footprint.forEach((p,i)=>shape[i?'lineTo':'moveTo']((p.x-240)*.05,(360-p.y)*.05));shape.closePath();
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:crate.height*.05,bevelEnabled:false});
 geometry.applyMatrix4(new THREE.Matrix4().set(1,0,0,0, 0,1,1,0, 0,0,1,0, 0,0,0,1));
 const mesh=new THREE.Mesh(geometry,mat);mesh.name=crate.id+'-solid-volume';g.add(mesh);
}
return root;}
