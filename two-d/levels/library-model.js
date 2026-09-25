import {assistDoor,LIBRARY_DOORS} from './door-assist.js';
export const LIBRARY_WIDTH=1680;
// Screen height includes the vertical cabinet face; only the base occupies floor.
// Rendering and collision share these placements so the rear aisles stay walkable.
export const LIBRARY_AISLE_SHELVES=[
 {id:'aisle-north-1',x:669,y:199,w:97,h:72,baseDepth:18},
 {id:'aisle-south-1',x:898,y:277,w:104,h:77,baseDepth:18},
 {id:'aisle-north-2',x:1139,y:199,w:107,h:68,baseDepth:18},
 {id:'aisle-south-2',x:1354,y:277,w:96,h:75,baseDepth:18}
];
export const LIBRARY_SOLIDS=[{id:'desk',x:119,y:171,w:136,h:37},{id:'back-library',x:130,y:98,w:201,h:19},{id:'right-library-upper',x:431,y:144,w:31,h:18},{id:'right-library-lower',x:431,y:241,w:31,h:24},{id:'old-exit',x:355,y:98,w:50,h:17},{id:'display',x:315,y:242,w:94,h:23},{id:'cabinet',x:18,y:180,w:15,h:18}];
LIBRARY_SOLIDS.push(...[550,750,970,1190,1410,1530].map((x,i)=>({id:'long-shelf-'+i,x:x-51,y:101,w:102,h:21})),...LIBRARY_AISLE_SHELVES.map(o=>({id:o.id,x:o.x-o.w/2,y:o.y-o.baseDepth,w:o.w,h:o.baseDepth})));
const floors=[[96,114,448,269],[18,122,101,276],[18,276,85,341],[431,197,492,239],[480,120,1667,278],[1586,84,1637,133]];
// The opening is a diagonal floor threshold, not the tall painted doorway surface.
const entryPassage=[[65,274],[83,292],[112,263],[94,245]];
function inEntry(x,y){let inside=false;for(let i=0,j=entryPassage.length-1;i<entryPassage.length;j=i++){const a=entryPassage[i],b=entryPassage[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export const SHELF_AMBUSHES=[{id:'jar-092',x:750,y:145},{id:'jar-104',x:970,y:145},{id:'jar-118',x:1210,y:145},{id:'jar-131',x:1460,y:145}];
export const LIBRARY_OBJECTS=[{id:'phone',x:148,y:218,r:25,label:'E · PICK UP THE RINGING PHONE'},{id:'specimens',x:403,y:160,r:28,label:'E · EXAMINE THE SPECIMENS'},{id:'exit',x:1610,y:138,r:42,label:'E · WORK THE EXIT LATCH'}];
export function newLibrary(checkpoint=false){return {x:checkpoint?363:54,y:checkpoint?188:319,face:'up',spriteHeight:68,walk:0,moving:false,time:0,cameraX:0,book:{x:592,y:215,z:0,falling:false,landed:false,collected:false,age:0},unlocking:false,unlockAge:0,paused:false,phase:checkpoint?'search':'ringing',phaseAge:0,phoneAnswered:checkpoint,phoneExamined:checkpoint,inspection:false,receiver:0,jar:0,exit:0,openingExit:false,health:3,invincible:0,notice:checkpoint?'Find the specimen marked 087.':'A telephone is ringing inside the library.',noticeAge:5,ambushes:SHELF_AMBUSHES.map(a=>({...a,phase:"sealed",age:0,volleys:0,face:"down",walk:0,aim:null})),shots:[],puddles:[],shotCount:0,damageCount:0,worm:{x:414,y:169,face:'left',phase:'hidden',age:0,walk:0,aim:null,cooldown:2.6},checkpoint};}
export function libraryBlocked(s,x,y,r=6){if(![[-r,-r],[r,-r],[-r,r],[r,r]].every(([dx,dy])=>(inEntry(x+dx,y+dy)||floors.some(([a,b,c,d])=>x+dx>=a&&x+dx<=c&&y+dy>=b&&y+dy<=d))))return true;if(s.exit<.9&&x+r>1584&&x-r<1639&&y-r<110)return true;return LIBRARY_SOLIDS.some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h);}
export function libraryLineClear(s,a,b,r=2){const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/3);for(let i=0;i<=n;i++){const t=n?i/n:0;if(libraryBlocked(s,a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,r))return false;}return true;}
export function moveLibrary(s,dx,dy,dt){s.moving=false;const n=Math.hypot(dx,dy);if(!n)return;const old={x:s.x,y:s.y},distance=82*dt,steps=Math.ceil(distance/2);for(let i=0;i<steps;i++){const x=s.x+dx/n*distance/steps,y=s.y+dy/n*distance/steps;if(!libraryBlocked(s,x,s.y))s.x=x;if(!libraryBlocked(s,s.x,y))s.y=y;}s.moving=Math.hypot(s.x-old.x,s.y-old.y)>.01;if(s.moving)s.walk+=dt*11;s.face=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}
const CELL=6,W=Math.ceil(LIBRARY_WIDTH/6)+1,H=61,dirs=[[1,0],[-1,0],[0,1],[0,-1]];
function nearest(s,x,y,r){const gx=Math.round(x/CELL),gy=Math.round(y/CELL);for(let k=0;k<7;k++)for(let dy=-k;dy<=k;dy++)for(let dx=-k;dx<=k;dx++){const a=gx+dx,b=gy+dy;if(a>=0&&a<W&&b>=0&&b<H&&!libraryBlocked(s,a*CELL,b*CELL,r))return [a,b];}return null;}
export function libraryPath(s,x,y,from=s,r=6){const a=nearest(s,from.x,from.y,r),b=nearest(s,x,y,r);if(!a||!b)return [];const prev=new Int32Array(W*H).fill(-1),start=a[1]*W+a[0],goal=b[1]*W+b[0],q=[start];prev[start]=start;for(let i=0;i<q.length&&prev[goal]<0;i++){const k=q[i],gx=k%W,gy=Math.floor(k/W);for(const [dx,dy]of dirs){const nx=gx+dx,ny=gy+dy,j=ny*W+nx;if(nx<0||nx>=W||ny<0||ny>=H||prev[j]>=0||libraryBlocked(s,nx*CELL,ny*CELL,r))continue;prev[j]=k;q.push(j);}}if(prev[goal]<0)return [];const route=[];for(let k=goal;k!==start;k=prev[k])route.push({x:k%W*CELL,y:Math.floor(k/W)*CELL});return route.reverse();}
export function libraryCanInteract(s,o){return o.id==='phone'?[[148,218,34],[148,151,31],[110,186,27]].some(([x,y,r])=>Math.hypot(s.x-x,s.y-y)<r):Math.hypot(s.x-o.x,s.y-o.y)<o.r;}
export function libraryNear(s){return LIBRARY_OBJECTS.filter(o=>libraryCanInteract(s,o)).sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0];}
export function libraryAction(s,id){if(s.paused||s.inspection||['caught','escaped','breaking'].includes(s.phase))return null;const o=id?LIBRARY_OBJECTS.find(o=>o.id===id&&libraryCanInteract(s,o)):libraryNear(s);if((!id||id==='book')&&s.book.landed&&!s.book.collected&&Math.hypot(s.x-s.book.x,s.y-s.book.y)<35){s.book.collected=true;s.notice='You snatch the maintenance book. PLATFORM III instructions saved. The exit latch releases.';s.noticeAge=5;return 'book';}if(!o)return null;if(o.id==='phone'){s.phoneExamined=true;s.inspection=true;return 'phone';}if(o.id==='specimens'){if(s.phoneAnswered&&s.phase==='search'){s.phase='breaking';s.phaseAge=0;s.notice='Your sleeve catches the shelf. Glass slips against wood…';s.noticeAge=3;return 'jar';}s.notice='The telephone will not stop ringing.';s.noticeAge=3;}if(o.id==='exit'){if(s.phase==='chase'&&!s.book.collected){s.notice='The exit is interlocked with the fallen maintenance book. Take it from the floor!';s.noticeAge=4;return 'locked';}if(s.phase==='chase'&&!s.unlocking&&!s.openingExit){s.unlocking=true;s.unlockAge=0;s.notice='The lock is grinding open. Dodge its bile until the bolt releases!';s.noticeAge=4;return 'exit';}s.notice=s.unlocking?'The bolt is still turning — keep moving!':'The exit is locked. The desk telephone is still ringing.';s.noticeAge=3;}return o.id;}
export function answerLibraryPhone(s){if(!s.inspection||s.phoneAnswered)return false;s.phoneAnswered=true;s.phase='call';s.phaseAge=0;return true;}
export function closeLibraryPhone(s){if(s.phase==='call'&&s.phaseAge<1.6)return false;s.inspection=false;if(s.phase==='call'){s.phase='search';s.phaseAge=0;}return true;}
function hurt(s){if(s.invincible)return;s.health--;s.damageCount++;s.invincible=1.8;s.notice='It burns. Keep moving — use the furniture as cover!';s.noticeAge=2;if(s.health<=0)s.phase='caught';}
const routes=new WeakMap();
export function tickLibrary(s,input,dt){if(s.paused||['caught','escaped'].includes(s.phase))return;dt=Math.max(0,Math.min(.04,dt));s.moving=false;if(s.inspection){if(s.phase==='call'){s.phaseAge+=dt;s.receiver=Math.min(1,s.receiver+dt*2);}return;}s.receiver=Math.max(0,s.receiver-dt*2);s.time+=dt;s.phaseAge+=dt;s.noticeAge=Math.max(0,s.noticeAge-dt);s.invincible=Math.max(0,s.invincible-dt);
input=assistDoor(s,input,LIBRARY_DOORS,libraryPath);
if(input.target){const dx=input.target.x-s.x,dy=input.target.y-s.y;moveLibrary(s,dx,dy,Math.min(dt,Math.hypot(dx,dy)/82));}else{const dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0);if(dx||dy)moveLibrary(s,dx/Math.hypot(dx,dy),dy/Math.hypot(dx,dy),dt);}
if(s.phase==='search'&&(s.phaseAge>1.2||Math.hypot(s.x-410,s.y-164)<65)){s.phase='breaking';s.phaseAge=0;s.notice='SPECIMEN 087 rattles, then falls from its shelf…';s.noticeAge=3;}
if(s.phase==='breaking'){s.jar=Math.min(1,s.phaseAge/1.1);if(s.phaseAge>=1.1){s.worm.phase='emerge';s.worm.age=s.phaseAge-1.1;}if(s.phaseAge>=2.3){s.phase='chase';s.phaseAge=0;s.worm.phase='crawl';s.worm.age=0;s.notice='RUN! It raises its head before spitting. Use the desk as cover.';s.noticeAge=5;}}
s.cameraX+=(Math.max(0,Math.min(LIBRARY_WIDTH-480,s.x-220))-s.cameraX)*Math.min(1,dt*7);
if(s.phase==='chase'&&!s.book.falling&&!s.book.collected&&s.x>492){s.book.falling=true;s.book.z=95;s.notice='A maintenance book tumbles from the shelf. Grab it — the exit is interlocked!';s.noticeAge=4;}if(s.book.falling&&!s.book.landed){s.book.age+=dt;s.book.z=Math.max(0,95-s.book.age*s.book.age*130);if(s.book.z===0)s.book.landed=true;}
if(s.unlocking){s.unlockAge+=dt;if(s.unlockAge>=2.4){s.unlocking=false;s.openingExit=true;s.notice='THE EXIT IS OPEN · RUN THROUGH!';s.noticeAge=4;}}
if(s.openingExit)s.exit=Math.min(1,s.exit+dt*1.4);
if(s.phase!=='chase')return;const w=s.worm;w.age+=dt;w.cooldown-=dt;
if(w.phase==='crawl'){
let nav=routes.get(s);if(!nav||s.time-nav.time>.25){nav={time:s.time,path:libraryPath(s,s.x,s.y,w,6)};routes.set(s,nav);}while(nav.path.length&&Math.hypot(nav.path[0].x-w.x,nav.path[0].y-w.y)<1.2)nav.path.shift();const target=libraryLineClear(s,w,s,6)?s:nav.path[0];if(target){const dx=target.x-w.x,dy=target.y-w.y,n=Math.hypot(dx,dy)||1,step=Math.min(n,(Math.hypot(s.x-w.x,s.y-w.y)>175?104:65)*dt);if(!libraryBlocked(s,w.x+dx/n*step,w.y,6))w.x+=dx/n*step;if(!libraryBlocked(s,w.x,w.y+dy/n*step,6))w.y+=dy/n*step;w.walk+=dt*9;w.face=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}
if(w.cooldown<=0&&Math.hypot(s.x-w.x,s.y-w.y)>25&&Math.hypot(s.x-w.x,s.y-w.y)<285&&libraryLineClear(s,w,s,2)){w.phase='aim';w.age=0;w.aim={x:s.x,y:s.y};}
}else if(w.phase==='aim'&&w.age>=.95){const dx=w.aim.x-w.x,dy=w.aim.y-w.y,n=Math.hypot(dx,dy)||1;s.shots.push({x:w.x,y:w.y,vx:dx/n*190,vy:dy/n*190,age:0});s.shotCount++;w.phase='spit';w.age=0;
}else if(w.phase==='spit'&&w.age>=.42){w.phase='crawl';w.age=0;w.cooldown=2.3;}
// Local shelf encounters use the same projectile and wall collision rules as the pursuer.
for(const a of s.ambushes){a.age+=dt;
 if(a.phase==='sealed'&&Math.abs(s.x-a.x)<108){a.phase='rattle';a.age=0;}
 else if(a.phase==='rattle'&&a.age>=1){a.phase='fall';a.age=0;}
 else if(a.phase==='fall'&&a.age>=.7){a.phase='emerge';a.age=0;}
 else if(a.phase==='emerge'&&a.age>=.6){a.phase='crawl';a.age=0;}
 else if(a.phase==='crawl'){a.walk+=dt*6;if(a.age>.65&&a.volleys<2&&Math.hypot(s.x-a.x,s.y-a.y)<255&&libraryLineClear(s,a,s,2)){a.phase='aim';a.age=0;a.aim={x:s.x,y:s.y};a.face=s.x<a.x?'left':'right';}}
 else if(a.phase==='aim'&&a.age>=1.1){const dx=a.aim.x-a.x,dy=a.aim.y-a.y,n=Math.hypot(dx,dy)||1;s.shots.push({x:a.x,y:a.y,vx:dx/n*165,vy:dy/n*165,age:0,source:a.id});s.shotCount++;a.volleys++;a.phase='spit';a.age=0;}
 else if(a.phase==='spit'&&a.age>=.5){a.phase='crawl';a.age=-1.2;}
}
for(const shot of s.shots){shot.age+=dt;const steps=Math.ceil(Math.hypot(shot.vx,shot.vy)*dt/2);for(let i=0;i<steps&&!shot.dead;i++){const x=shot.x+shot.vx*dt/steps,y=shot.y+shot.vy*dt/steps;if(libraryBlocked(s,x,y,2)||shot.age>2.5){shot.dead=true;s.puddles.push({x:shot.x,y:shot.y,age:0});break;}shot.x=x;shot.y=y;if(Math.hypot(x-s.x,y-s.y)<7){hurt(s);shot.dead=true;s.puddles.push({x,y,age:0});}}}s.shots=s.shots.filter(p=>!p.dead);for(const p of s.puddles){p.age+=dt;if(p.age>.35&&Math.hypot(p.x-s.x,p.y-s.y)<7)hurt(s);}s.puddles=s.puddles.filter(p=>p.age<2.5);
if(Math.hypot(w.x-s.x,w.y-s.y)<10&&libraryLineClear(s,w,s,2))hurt(s);
if(s.exit>=.9&&s.x>1592&&s.x<1631&&s.y<100)s.phase='escaped';
}
