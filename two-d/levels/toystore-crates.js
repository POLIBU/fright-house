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
 // The cage is angled in the painted room; its floor is a convex quadrilateral.
 if(crate.kind==='cage'){
  const points=cageFootprint();let inside=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++){
   const a=points[i],b=points[j];
   if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)inside=!inside;
   const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));
   if(Math.hypot(x-a.x-t*dx,y-a.y-t*dy)<r)return true;
  }
  return inside;
 }
 return x+r>crate.x&&x-r<crate.x+crate.w&&y+r>crate.y&&y-r<crate.y+crate.h;
}
export function cageFootprint(){return [{x:240,y:138},{x:340,y:163},{x:323,y:202},{x:223,y:176}];}
