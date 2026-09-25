import {projectedVolume} from './projected-volume.js';
import {STORE_CRATES,cageFootprint} from './levels/toystore-crates.js';
// Fixed-view shelf and cage solids project the approved painting onto real mesh layers.
export default function generate(THREE){const root=new THREE.Group(),mat=new THREE.MeshBasicMaterial();function part(name,depth){const g=new THREE.Group();g.name=name;g.userData.floor=depth;root.add(g);return g;}function box(g,x,y,w,h,d=.35){const o=new THREE.Mesh(new THREE.BoxGeometry(w*.05,h*.05,d),mat);o.position.set((x+w/2-240)*.05,(360-y-h/2)*.05,d/2);g.add(o);}
const shelf=part('back-shelves',100);for(const y of [54,82,92])box(shelf,168,y,163,5,.45);for(const x of [168,223,329])box(shelf,x,52,4,43);const bench=part('drawing-workbench',192);box(bench,100,166,58,7,.6);for(const x of [103,147])box(bench,x,172,7,20,.45);const pedestal=part('music-pedestal',112);box(pedestal,420,88,36,7,.65);for(const x of [422,451])box(pedestal,x,95,5,16);
// Extruded volumes include tops and sides, preserving the painted finish through
// projected UVs. Their solid floor definitions are also used by player/toy navigation.
for(const crate of STORE_CRATES){
 if(crate.kind==='cage'){
  function face(name,depth,points){const g=part(name,depth),shape=new THREE.Shape();points.forEach((p,i)=>shape[i?'lineTo':'moveTo']((p[0]-240)*.05,(360-p[1])*.05));shape.closePath();g.add(new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.15,bevelEnabled:false}),mat));}
  face('cage-back',138,[[240,101],[340,126],[340,163],[240,138]]);
  face('cage-front',202,[[223,139],[323,165],[323,202],[223,176]]);
  face('cage-side',203,[[340,126],[340,163],[323,202],[323,165]]);
  const rim=part('cage-rim',139);for(let i=0;i<5;i++)box(rim,236+i,103+i*1.5,2,35,.14);
  continue;
 }
 const g=part(crate.id,crate.y+crate.h);
 const footprint=crate.kind==='cage'?cageFootprint():[
  {x:crate.x,y:crate.y},{x:crate.x+crate.w,y:crate.y},
  {x:crate.x+crate.w,y:crate.y+crate.h},{x:crate.x,y:crate.y+crate.h}
 ];
 const shape=new THREE.Shape();footprint.forEach((p,i)=>shape[i?'lineTo':'moveTo']((p.x-240)*.05,(360-p.y)*.05));shape.closePath();
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:crate.height*.05,bevelEnabled:false});
 geometry.applyMatrix4(new THREE.Matrix4().set(1,0,0,0, 0,1,1,0, 0,0,1,0, 0,0,0,1));
 const mesh=new THREE.Mesh(geometry,mat);mesh.name=crate.id+'-solid-volume';g.add(mesh);
}
projectedVolume(THREE,bench,mat,[[101,178],[157,178],[157,192],[101,192]],24);
projectedVolume(THREE,shelf,mat,[[169,94],[330,94],[330,100],[169,100]],38);
// The side-wall entrance has only an animated leaf; no upright frame.
return root;}
