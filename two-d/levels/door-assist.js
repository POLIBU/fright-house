// A short, collision-checked walking route through an already-open doorway.
// No teleporting: callers feed each waypoint into their normal movement solver.
const routes=new WeakMap();
export function assistDoor(s,input,doors,path){if(input.target){routes.delete(s);return input;}const moving=input.up||input.down||input.left||input.right;if(!moving){routes.delete(s);return input;}let cached=routes.get(s);if(cached&&!cached.door.enabled(s)){routes.delete(s);cached=null;}if(!cached){const door=doors.find(d=>d.enabled(s)&&d.trigger(s,input));if(!door)return input;const goal=door.goal(s,input),points=path(s,goal.x,goal.y);if(!points.length)return input;cached={door,points};routes.set(s,cached);}while(cached.points.length&&Math.hypot(cached.points[0].x-s.x,cached.points[0].y-s.y)<.3)cached.points.shift();if(!cached.points.length){routes.delete(s);return input;}return {target:cached.points[0]};}
export const STORE_DOORS=[
 {enabled:s=>s.entry>=.85&&s.phase==='explore',trigger:(s,i)=>s.y>207&&s.y<278&&((i.right&&s.x>=55&&s.x<119)||(i.left&&s.x>75&&s.x<140)),goal:(s,i)=>i.right?{x:132,y:232}:{x:66,y:232}},
 {enabled:s=>s.exit>=.9,trigger:(s,i)=>i.up&&s.x>357&&s.x<418&&s.y>87&&s.y<149,goal:()=>({x:390,y:78})}
];
export const LIBRARY_DOORS=[
 {enabled:()=>true,trigger:(s,i)=>s.y>240&&s.y<326&&((s.x>=40&&s.x<92&&(i.right||i.up))||(s.x>97&&s.x<130&&i.left)),goal:s=>s.x<92?{x:126,y:252}:{x:60,y:306}},
 {enabled:s=>s.exit>=.9,trigger:(s,i)=>i.up&&s.x>1565&&s.x<1657&&s.y>97&&s.y<175,goal:()=>({x:1614,y:90})}
];
export const STREET_DOORS=[{enabled:s=>s.gateProgress>=1,trigger:(s,i)=>i.up&&s.x>207&&s.x<270&&s.y>135&&s.y<198,goal:()=>({x:240,y:132})}];
export const BARREL_DOORS=[{enabled:s=>s.gate>=.95,trigger:(s,i)=>i.up&&s.x>579&&s.x<676&&s.y>103&&s.y<236,goal:()=>({x:642,y:90})}];
