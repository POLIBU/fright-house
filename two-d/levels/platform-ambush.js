// Telegraphs and projectiles share the same state used by the 3D renderer.
import {FLOOR_Y as floors} from './platform-layout.js';
// A broad, slow rise creates a clear walking gap beneath each balloon.
export function balloonY(floor,time){return floors[floor]-68+34*Math.cos(time*1.4+floor*1.1);}
export function newAmbush(floor=0){return {archer:{phase:'rest',age:0,targetX:0,targetY:0,shots:0},arrows:[],balloons:[{id:'bomb-'+floor,x:[578,520,358,682][floor],y:balloonY(floor,0),phase:'idle',age:0}],floor};}
export function archerOrigin(floor,clown){if(clown)return {x:clown.x,y:clown.y-48};return {x:floor%2?873:87,y:floors[Math.max(0,floor-1)]-23};}
export function arrowPoint(a,t){
 // First rise through the open stairwell, then descend toward the locked aim point.
 const p=Math.min(1,Math.max(0,t)),q=1-p;
 return {x:q*q*a.startX+2*q*p*a.controlX+p*p*a.targetX,y:q*q*a.startY+2*q*p*a.controlY+p*p*a.targetY};
}
export function tickAmbush(s,dt){
 const m=s.ambush;if(!m||s.stair)return;
 for(const b of m.balloons)if(b.phase==='idle'||b.phase==='fuse')b.y=balloonY(s.floor,s.time);
 if(!s.power)return;
 if(m.floor!==s.floor){s.ambush=newAmbush(s.floor);return;}
 const archer=m.archer;archer.age+=dt;
 if(s.floor>0&&!s.clown?.stair&&(!s.clown||s.clown.floor===s.floor-1)){
  if(archer.phase==='rest'&&archer.age>=2){archer.phase='aim';archer.age=0;archer.targetX=Math.max(145,Math.min(820,s.x));archer.targetY=floors[s.floor]-16;}
  if(archer.phase==='aim'&&archer.age>=1.15){const origin=archerOrigin(s.floor,s.clown),a={id:'arrow-'+(++archer.shots),age:0,startX:origin.x,startY:origin.y,controlX:origin.x,controlY:floors[s.floor]-180,targetX:archer.targetX,targetY:archer.targetY};a.x=a.previousX=origin.x;a.y=a.previousY=origin.y;m.arrows.push(a);archer.phase='release';archer.age=0;}
  if(archer.phase==='release'&&archer.age>.3){archer.phase='rest';archer.age=0;}
 }
 for(const a of m.arrows){a.previousX=a.x;a.previousY=a.y;a.age+=dt;if(a.age>=1.35){a.x=a.targetX;a.y=a.targetY;a.stuck=true;a.impactAge=a.age-1.35;a.angle=Math.atan2(a.targetY-a.controlY,a.targetX-a.controlX);}else{const p=arrowPoint(a,a.age/1.35),next=arrowPoint(a,a.age/1.35+.01);a.x=p.x;a.y=p.y;a.angle=Math.atan2(next.y-a.y,next.x-a.x);}}
 m.arrows=m.arrows.filter(a=>a.age<2.65&&!a.spent);
 for(const b of m.balloons){b.age+=dt;if(b.phase==='idle'&&Math.abs(s.x-b.x)<64&&Math.abs(s.y-18-b.y)<40){b.phase='fuse';b.age=0;}else if(b.phase==='fuse'&&b.age>=.8){b.phase='blast';b.age=0;}else if(b.phase==='blast'&&b.age>=.3){b.phase='spent';b.age=0;}}
}
export function ambushHazards(s){const m=s.ambush;if(!m)return [];return [
 ...m.arrows.map(a=>({id:a.id,kind:'arrow',x:a.x,y:a.y,r:4,active:!a.spent&&!a.stuck,sweep:{x:a.previousX,y:a.previousY},source:a})),
 ...m.balloons.filter(b=>b.phase==='blast').map(b=>({id:b.id,kind:'balloon-bomb',x:b.x,y:b.y,r:32,active:true}))
 ];}
export function arrowHits(h,s){
 // Swept segment vs the actor's expanded body box prevents fast-arrow tunnelling.
 const dx=h.x-h.sweep.x,dy=h.y-h.sweep.y;let lo=0,hi=1;
 for(const [p,q]of [[-dx,h.sweep.x-(s.x-10)],[dx,s.x+10-h.sweep.x],[-dy,h.sweep.y-(s.y-35)],[dy,s.y+4-h.sweep.y]]){
  if(Math.abs(p)<1e-9){if(q<0)return false;continue;}
  const r=q/p;if(p<0)lo=Math.max(lo,r);else hi=Math.min(hi,r);if(lo>hi)return false;
 }
 return true;
}
