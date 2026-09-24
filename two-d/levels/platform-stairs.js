// The feet follow authored tread/landing centerlines, never a timed floor teleport.
export const STAIR_PATHS=[
 {from:0,to:1,dir:1,points:[[786,690],[786,658],[887,573],[887,529],[897,493]]},
 {from:1,to:2,dir:-1,points:[[62,493],[62,448],[155,373],[155,355]]},
 {from:2,to:3,dir:1,points:[[838,355],[897,296],[838,239],[892,181]]}
];
for(const a of STAIR_PATHS){a.lengths=a.points.slice(1).map((p,i)=>Math.hypot(p[0]-a.points[i][0],p[1]-a.points[i][1]));a.length=a.lengths.reduce((n,v)=>n+v,0);}
export function stairPose(a,distance){let d=Math.max(0,Math.min(a.length,distance));for(let i=0;i<a.lengths.length;i++){if(d<=a.lengths[i]||i===a.lengths.length-1){const t=d/a.lengths[i],p=a.points[i],q=a.points[i+1];return {x:p[0]+(q[0]-p[0])*t,y:p[1]+(q[1]-p[1])*t};}d-=a.lengths[i];}}
