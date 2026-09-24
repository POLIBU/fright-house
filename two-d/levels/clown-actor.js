import {STAIR_PATHS,stairPose} from './platform-stairs.js';
const floors=[690,493,355,181];
export function newClown(floor=0){const lower=Math.max(0,floor-1);return {x:floor?floor%2?873:87:835,y:floors[lower],floor:lower,walk:0,moving:false,stair:null,face:'left'};}
export function tickClown(s,dt){const c=s.clown;if(!c||!s.power)return;c.moving=false;if(s.powerAge<.9)return;if(s.powerAge<3){const x=835-(s.powerAge-.9)*30;c.moving=true;c.walk+=dt*9;c.face='left';c.x=x;c.y=661+Math.min(1,(s.powerAge-.9)/1.2)*29;return;}
 const targetFloor=Math.max(0,s.floor-1);if(c.stair){const a=STAIR_PATHS[c.stair.index],previous=c.x;c.stair.distance=Math.min(a.length,c.stair.distance+dt*112);Object.assign(c,stairPose(a,c.stair.distance));c.face=c.x<previous?'left':'right';c.walk+=dt*10;c.moving=true;if(c.stair.distance===a.length){c.floor=a.to;c.stair=null;}return;}
 const target=c.floor<targetFloor?STAIR_PATHS[c.floor].points[0][0]:(s.floor%2?873:87);if(s.ambush?.archer.phase==='aim'||s.ambush?.archer.phase==='release')return;const dx=target-c.x;if(Math.abs(dx)>2){c.x+=Math.sign(dx)*Math.min(Math.abs(dx),dt*138);c.face=dx<0?'left':'right';c.walk+=dt*10;c.moving=true;}else if(c.floor<targetFloor)c.stair={index:c.floor,distance:0};
}
