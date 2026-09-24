export const PERCHES=[{x:193,y:306,dx:-1},{x:305,y:300,dx:1},{x:265,y:178,dx:1}];
export function newRavens(){return PERCHES.map((p,i)=>({...p,id:i,phase:'perched',time:0}));}
export function tickRavens(ravens,player,dt){for(const r of ravens){if(r.phase==='perched'&&Math.hypot(player.x-r.x,player.y-r.y)<37)r.phase='flying';if(r.phase==='flying'){r.time+=dt;if(r.time>=3.8)r.phase='gone';}}}
export function ravenPose(r){const t=r.time;return {x:r.x+r.dx*t*42,y:r.y-t*33-t*t*5,height:r.phase==='perched'?0:Math.sin(Math.min(t,1)*Math.PI/2)*12,wing:r.phase==='perched'?.15:Math.sin(t*24)*1.1};}
