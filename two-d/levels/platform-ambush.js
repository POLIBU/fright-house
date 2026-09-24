// Telegraphs and projectiles share the same state used by the 3D renderer.
const floors=[690,493,355,181];
export function newAmbush(floor=0){return {archer:{phase:'rest',age:0,targetX:0,targetY:0,shots:0},arrows:[],balloons:[{id:'bomb-'+floor,x:[578,520,358,682][floor],y:floors[floor]-38,phase:'idle',age:0}],floor};}
export function archerOrigin(floor){return {x:floor%2?873:87,y:floors[Math.max(0,floor-1)]-23};}
export function arrowPoint(a,t){
 // First rise through the open stairwell, then descend toward the locked aim point.
 const p=Math.min(1,Math.max(0,t)),q=1-p;
 return {x:q*q*a.startX+2*q*p*a.controlX+p*p*a.targetX,y:q*q*a.startY+2*q*p*a.controlY+p*p*a.targetY};
}
export function tickAmbush(s,dt){
 const m=s.ambush;if(!m||!s.power||s.stair)return;
 if(m.floor!==s.floor){s.ambush=newAmbush(s.floor);return;}
 const archer=m.archer;archer.age+=dt;
 if(s.floor>0){
  if(archer.phase==='rest'&&archer.age>=2){archer.phase='aim';archer.age=0;archer.targetX=Math.max(145,Math.min(820,s.x));archer.targetY=floors[s.floor]-16;}
  if(archer.phase==='aim'&&archer.age>=1.15){const origin=archerOrigin(s.floor),a={id:'arrow-'+(++archer.shots),age:0,startX:origin.x,startY:origin.y,controlX:origin.x,controlY:floors[s.floor]-180,targetX:archer.targetX,targetY:archer.targetY};a.x=a.previousX=origin.x;a.y=a.previousY=origin.y;m.arrows.push(a);archer.phase='release';archer.age=0;}
  if(archer.phase==='release'&&archer.age>.3){archer.phase='rest';archer.age=0;}
 }
 for(const a of m.arrows){a.previousX=a.x;a.previousY=a.y;a.age+=dt;const p=arrowPoint(a,a.age/1.35);a.x=p.x;a.y=p.y;const next=arrowPoint(a,Math.min(1,a.age/1.35+.01));a.angle=Math.atan2(next.y-a.y,next.x-a.x);}
 m.arrows=m.arrows.filter(a=>a.age<1.5&&!a.spent);
 for(const b of m.balloons){b.age+=dt;b.y=floors[s.floor]-38+Math.sin(s.time*2+b.x)*5;if(b.phase==='idle'&&Math.abs(s.x-b.x)<87&&Math.abs(s.y-floors[s.floor])<90){b.phase='fuse';b.age=0;}else if(b.phase==='fuse'&&b.age>=1.6){b.phase='blast';b.age=0;}else if(b.phase==='blast'&&b.age>=.3){b.phase='spent';b.age=0;}}
}
export function ambushHazards(s){const m=s.ambush;if(!m)return [];return [
 ...m.arrows.map(a=>({id:a.id,kind:'arrow',x:a.x,y:a.y,r:4,active:!a.spent,sweep:{x:a.previousX,y:a.previousY},source:a})),
 ...m.balloons.filter(b=>b.phase==='blast').map(b=>({id:b.id,kind:'balloon-bomb',x:b.x,y:floors[s.floor]-10,r:32,active:true}))
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
