// Screen-space floor footprints are shared by navigation and the projected 3D props.
// Height lifts the mesh above these footprints; it never changes walkable ground.
export const STORE_CRATES = [
 {id:'cage',x:221,y:137,w:120,h:67,height:37,kind:'cage'},
 {id:'prize-front',x:385,y:219,w:35,h:23,height:18,kind:'wood'},
 {id:'prize-middle',x:420,y:202,w:24,h:36,height:22,kind:'wood'},
 {id:'prize-back',x:438,y:184,w:25,h:23,height:23,kind:'wood'},
 {id:'prize-right',x:437,y:221,w:27,h:20,height:22,kind:'wood'}
];
export function crateContains(crate,x,y,r=4){
 // Reserve the full base and wheel clearance, including the rear corners.
 // The painted slanted face alone leaves triangular strips that look walkable
 // through the crate, especially with the larger investigator sprite.
 if(crate.kind==='cage')return x+r>219&&x-r<343&&y+r>126&&y-r<206;

 return x+r>crate.x&&x-r<crate.x+crate.w&&y+r>crate.y&&y-r<crate.y+crate.h;
}
export function cageFootprint(){return [{x:240,y:138},{x:340,y:163},{x:323,y:202},{x:223,y:176}];}
