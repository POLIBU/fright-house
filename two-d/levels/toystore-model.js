import {assistDoor,STORE_DOORS} from './door-assist.js';
import {newStoreAmbience,tickStoreAmbience} from './store-ambience.js';
import {STORE_CRATES,crateContains} from './toystore-crates.js';
export const TOY_COUNT=24;
export const STORE_SOLIDS=[
 {id:'shelf',x:165,y:77,w:169,h:22},{id:'bench',x:99,y:154,w:60,h:38},
 {id:'pedestal',x:420,y:88,w:36,h:24},
 {id:'bin',x:23,y:110,w:32,h:35},
 {id:'partition',x:83,y:90,w:13,h:107},
 {id:'entry-jamb-back',x:81,y:243,w:7,h:10},{id:'entry-jamb-front',x:109,y:242,w:7,h:8}
];
const floors=[[116,97,466,245],[96,97,116,197],[18,156,80,338],[18,96,80,206],[371,72,408,112]];
// Only the diagonal threshold is floor; the tall painted door opening is not.
const entryFloor=[[72,216],[72,244],[126,244],[126,216]];
function inEntry(x,y){let inside=false;for(let i=0,j=entryFloor.length-1;i<entryFloor.length;j=i++){const a=entryFloor[i],b=entryFloor[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}

export const STORE_OBJECTS=[{id:'entry',x:72,y:232,r:42,label:'E · OPEN STOREROOM'},{id:'music',x:436,y:128,r:38,label:'E · INSPECT WIND-UP TOY'},{id:'drawing',x:167,y:171,r:19,label:'E · READ CHILD’S DRAWING'},{id:'exit',x:388,y:119,r:38,label:'E · OPEN RED DOOR'}];
const homes=[
 [187,56,174,111],[206,54,197,111],[230,58,220,112],[254,55,250,111],[277,56,278,111],[306,59,312,111],
 [116,95,119,115],[138,100,146,119],[120,147,168,151],[142,146,167,185],
 [248,140,207,138],[269,143,211,155],[291,146,209,177],[313,149,212,209],
 [241,151,237,216],[263,155,264,218],[286,159,294,217],[311,163,351,201],
 [243,167,376,198],[265,171,365,220],[288,175,414,191],[312,179,453,174],
 [279,150,350,227],[297,166,183,204]
];
export function newStore(prepared=false){return {ambience:newStoreAmbience(),x:prepared?405:53,y:prepared?133:317,face:'up',spriteHeight:68,walk:0,light:false,time:0,phase:'explore',phaseAge:0,entry:prepared?1:0,openingEntry:false,exit:0,openingExit:false,lights:1,health:3,invincible:0,inspection:false,inspectTime:0,turns:0,drawerOpen:0,instructionTaken:false,keyAngle:0,readDrawing:false,paused:false,notice:prepared?'The key is still in the toy.':'You can feel the stares through the walls.',noticeAge:5,toys:homes.map((p,i)=>({id:i,kind:i%6,homeX:p[0],homeY:p[1],spawnX:p[2],spawnY:p[3],x:p[0],y:p[1],height:0,phase:'asleep',age:0,speed:14+(i%5)*2.2,heading:0,walk:0}))};}
export function storeBlocked(s,x,y,r=6){if(![[-r,-r],[r,-r],[-r,r],[r,r]].every(([dx,dy])=>(inEntry(x+dx,y+dy)||floors.some(([a,b,c,d])=>x+dx>=a&&x+dx<=c&&y+dy>=b&&y+dy<=d))))return true;const solids=[...STORE_SOLIDS];if(s.entry<.85)solids.push({x:84,y:214,w:13,h:29});if(s.exit<.9)solids.push({x:369,y:91,w:42,h:13});return STORE_CRATES.some(o=>crateContains(o,x,y,r))||solids.some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h);}
export function moveStore(s,dx,dy,dt){s.moving=false;if(!dx&&!dy)return;const oldX=s.x,oldY=s.y,n=Math.hypot(dx,dy)||1,dist=78*dt,steps=Math.ceil(dist/2)||1;for(let i=0;i<steps;i++){const x=s.x+dx/n*dist/steps,y=s.y+dy/n*dist/steps;if(!storeBlocked(s,x,s.y))s.x=x;if(!storeBlocked(s,s.x,y))s.y=y;}s.moving=Math.hypot(s.x-oldX,s.y-oldY)>.001;if(s.moving)s.walk+=dt*11;s.face=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}
export function storeCanInteract(s,o){return o.id==='music'?Math.hypot((s.x-436)/39,(s.y-128)/35)<1:Math.hypot(s.x-o.x,s.y-o.y)<o.r;}
export function storeNear(s){return STORE_OBJECTS.filter(o=>(s.phase==='explore'||!['music','drawing'].includes(o.id))&&storeCanInteract(s,o)&&(s.phase!=='explore'||s.entry>=.85||o.id==='entry')).sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0];}
const cell=6,W=81,H=61,dirs=[[1,0],[-1,0],[0,1],[0,-1]],navCache=new WeakMap();
const index=(x,y)=>y*W+x;
function nearest(s,x,y,r=6){const gx=Math.round(x/cell),gy=Math.round(y/cell);for(let radius=0;radius<6;radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){const a=gx+dx,b=gy+dy;if(a>=0&&a<W&&b>=0&&b<H&&!storeBlocked(s,a*cell,b*cell,r))return [a,b];}return null;}
function field(s,x,y,r=6){const start=nearest(s,x,y,r);if(!start)return null;const distance=new Int16Array(W*H).fill(-1),q=[start];distance[index(...start)]=0;for(let i=0;i<q.length;i++){const [a,b]=q[i];for(const [dx,dy]of dirs){const nx=a+dx,ny=b+dy;if(nx<0||nx>=W||ny<0||ny>=H)continue;const k=index(nx,ny);if(distance[k]!==-1||storeBlocked(s,nx*cell,ny*cell,r))continue;distance[k]=distance[index(a,b)]+1;q.push([nx,ny]);}}return {distance,start};}
export function storePath(s,x,y){const f=field(s,x,y),start=nearest(s,s.x,s.y);if(!f||!start)return [];let p=start;const route=[];for(let i=0;i<2000;i++){const d=f.distance[index(...p)];if(d<0)return [];if(d===0)break;const next=dirs.map(([dx,dy])=>[p[0]+dx,p[1]+dy]).find(([a,b])=>a>=0&&a<W&&b>=0&&b<H&&f.distance[index(a,b)]===d-1);if(!next)return [];route.push({x:next[0]*cell,y:next[1]*cell});p=next;}return route;}
export function storeAction(s,id){if(s.paused||s.inspection||['caught','escaped'].includes(s.phase))return null;const o=typeof id==='string'?STORE_OBJECTS.find(o=>o.id===id&&storeCanInteract(s,o)):storeNear(s);if(!o||s.phase!=='explore'&&['music','drawing'].includes(o.id))return null;if(o.id==='entry'){if(s.phase==='explore'){s.openingEntry=true;s.notice='A sweet, rotten smell. The toys are watching.';s.noticeAge=4;}else{s.notice='The entrance has slammed shut. Use the red door!';s.noticeAge=3;}}
 if(o.id==='music'&&s.phase==='explore'){s.inspection=true;s.inspectTime=0;return 'music';}
 if(o.id==='drawing'&&s.phase==='explore'){s.readDrawing=true;return 'drawing';}
 if(o.id==='exit'){if(s.phase==='chase'&&s.phaseAge>=7.5){s.openingExit=true;s.notice='THE BOLT IS FREE · Push through the red doorway!';s.noticeAge=3;}else{s.notice=s.phase==='explore'?'A mechanical bolt holds the door. A shaft runs to the wind-up toy.':'The bolt is unwinding. Keep moving until it releases!';s.noticeAge=3;}}return o.id;}
export function windStoreToy(s){if(s.paused||!s.inspection||s.phase!=='explore'||s.turns)return false;s.turns=3;return true;}
export function collectStoreInstruction(s){if(s.paused||!s.inspection||s.drawerOpen<1||s.instructionTaken)return false;s.instructionTaken=true;s.inspection=false;s.phase='dimming';s.phaseAge=0;s.notice='The tune slows. Every little head turns.';s.noticeAge=3;return true;}
export function closeStoreInspection(s){s.inspection=false;}
export function tickStore(s,input,dt){if(s.paused||['caught','escaped'].includes(s.phase))return;dt=Math.max(0,Math.min(.04,dt));s.keyAngle+=(s.turns*Math.PI*2-s.keyAngle)*Math.min(1,dt*12);if(s.inspection){s.inspectTime+=dt;if(s.turns)s.drawerOpen=Math.min(1,s.drawerOpen+dt/.85);return;}s.time+=dt;tickStoreAmbience(s,dt);s.phaseAge+=dt;s.noticeAge=Math.max(0,s.noticeAge-dt);s.invincible=Math.max(0,s.invincible-dt);
 if(s.phase==='explore'&&s.openingEntry)s.entry=Math.min(1,s.entry+dt/.95);if(s.phase==='dimming'){s.entry=Math.max(0,s.entry-dt*1.7);s.lights=Math.max(0,1-s.phaseAge/2.2);if(s.phaseAge>=2.2){s.phase='blackout';s.phaseAge=0;s.lights=0;}}
 if(s.phase==='blackout'&&s.phaseAge>=.4){s.phase='chase';s.phaseAge=0;s.notice='THE TOYS ARE ALIVE · Keep moving. The red door is releasing.';s.noticeAge=4;}
 if(s.openingExit)s.exit=Math.min(1,s.exit+dt*1.4);
 input=assistDoor(s,input,STORE_DOORS,storePath);
 if(input.target){const dx=input.target.x-s.x,dy=input.target.y-s.y;moveStore(s,dx,dy,Math.min(dt,Math.hypot(dx,dy)/78));}else moveStore(s,(input.right?1:0)-(input.left?1:0),(input.down?1:0)-(input.up?1:0),dt);
 if(s.phase==='chase'){
  let nav=navCache.get(s);if(!nav||s.time-nav.time>.22){nav={...field(s,s.x,s.y,3),time:s.time};navCache.set(s,nav);}
  for(const t of s.toys){if(t.phase==='asleep'&&s.phaseAge>t.id*.055){t.phase='hopping';t.age=0;}if(t.phase==='asleep')continue;t.age+=dt;t.walk+=dt*(9+t.id%4);
   if(t.phase==='hopping'){const p=Math.min(1,t.age/.8);t.x=t.homeX+(t.spawnX-t.homeX)*p;t.y=t.homeY+(t.spawnY-t.homeY)*p;t.height=20*Math.sin(Math.PI*p);if(p===1){t.phase='chasing';t.height=0;}continue;}
   const node=nearest(s,t.x,t.y,3);if(!node||!nav?.distance)continue;const d=nav.distance[index(...node)];let target=null;if(d===0)target={x:s.x,y:s.y};else {const choices=dirs.map(([dx,dy])=>[node[0]+dx,node[1]+dy]).filter(([x,y])=>x>=0&&x<W&&y>=0&&y<H&&nav.distance[index(x,y)]>=0&&nav.distance[index(x,y)]<d);if(choices.length){const p=choices[(t.id+Math.floor(s.time))%choices.length];target={x:p[0]*cell,y:p[1]*cell};}}
   if(target){let dx=target.x-t.x,dy=target.y-t.y,n=Math.hypot(dx,dy)||1;const step=Math.min(n,t.speed*dt),nx=t.x+dx/n*step,ny=t.y+dy/n*step;if(!storeBlocked(s,nx,t.y,3))t.x=nx;if(!storeBlocked(s,t.x,ny,3))t.y=ny;t.heading=Math.atan2(dx,dy);}
   if(t.age>1.25&&s.invincible===0&&Math.hypot(t.x-s.x,t.y-s.y)<7){s.health--;s.invincible=2.6;s.notice='Something grabbed your ankle. Keep moving!';s.noticeAge=2;if(s.health<=0){s.phase='caught';s.inspection=false;break;}}
  }
  if(s.phaseAge>=7.5&&s.phaseAge-dt<7.5){s.notice='THE RED DOOR IS READY · E to open, then run through!';s.noticeAge=5;}
  if(s.exit>=.9&&s.y<88&&s.x>374&&s.x<404){s.phase='escaped';s.inspection=false;}
 }
}
export function retryStore(){return newStore(true);}
