export const WORKSHOP_LAMPS=[[39,192,'red'],[192,69,'amber'],[495,60,'red'],[667,232,'amber'],[102,79,'red'],[598,46,'amber'],[676,46,'amber'],[589,209,'amber'],[39,328,'amber'],[304,430,'amber'],[402,431,'amber']];
export const ARENA={width:720,height:540};
export const REVEAL={openAt:1.8,openDuration:2,riseAt:3.8,riseDuration:5,wakeAt:9.3,standAt:12.3,fightAt:13.9};
export const HATCH={x:260,y:249,w:200,h:92};
export function workshopReveal(s){const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x);if(s.phase!=='arrival')return {opening:1,lift:1,offset:0};const opening=ease(clamp((s.age-REVEAL.openAt)/REVEAL.openDuration)),lift=ease(clamp((s.age-REVEAL.riseAt)/REVEAL.riseDuration));return {opening,lift,offset:(1-lift)*135};}
export const TABLE={x:278,y:292,w:164,h:39};
export const FORK={x:207,y:384};
export const EXIT={x:640,y:82};
const length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function newWorkshop(){return {x:360,y:502,face:'up',spriteHeight:68,moving:false,walk:0,time:0,age:0,phase:'arrival',paused:false,health:5,invincible:0,dodge:0,dodgeCooldown:0,dodgeX:0,dodgeY:-1,attack:0,attackPending:false,attackCooldown:0,fork:false,flash:0,flashCooldown:0,moths:Array.from({length:12},(_,i)=>({lamp:i%4,offset:i*2.4,x:0,y:0,age:0})),mothsScared:0,hits:0,shorts:0,casingHits:0,shots:[],sparks:[],footprints:[],stepDistance:0,stepSide:1,cameraX:120,cameraY:180,exit:0,notice:'The door closes behind you. Nothing but dust and darkness.',noticeAge:5,boss:{x:360,y:302,hp:12,maxHp:12,phase:1,mode:'dormant',age:0,armorHits:0,impact:0,face:1,walk:0,sequence:0,zapWait:1,zapSeed:87,chargeTime:.5,targetX:360,targetY:400,flash:0},checkpoint:false};}
export function workshopBlocked(s,x,y,r=7){const rooms=[[105,157,599,406],[290,392,411,461],[319,450,394,516],[587,94,654,208],[622,73,658,128]],floor=[[-r,-r],[r,-r],[-r,r],[r,r]].every(([dx,dy])=>rooms.some(([a,b,c,d])=>x+dx>=a&&x+dx<=c&&y+dy>=b&&y+dy<=d));if(!floor)return true;const reveal=workshopReveal(s);if(s.phase==='arrival'&&reveal.lift<1&&x+r>HATCH.x&&x-r<HATCH.x+HATCH.w&&y+r>HATCH.y&&y-r<HATCH.y+HATCH.h)return true;if(x+r>TABLE.x&&x-r<TABLE.x+TABLE.w&&y+r>TABLE.y&&y-r<TABLE.y+TABLE.h)return true;if(y<165&&s.exit<.85)return true;return false;}
function move(s,actor,dx,dy,dist,r=7){const n=Math.hypot(dx,dy);if(!n)return;const steps=Math.max(1,Math.ceil(dist/2));for(let i=0;i<steps;i++){const x=actor.x+dx/n*dist/steps,y=actor.y+dy/n*dist/steps;if(!workshopBlocked(s,x,actor.y,r)&&!(actor===s.boss&&actor.y>398))actor.x=x;if(!workshopBlocked(s,actor.x,y,r)&&!(actor===s.boss&&y>398))actor.y=y;}}
export function workshopPath(s,x,y){const cell=10,W=73,H=55,key=(x,y)=>y*W+x,prev=new Map(),q=[];function nearest(x,y){const a=Math.round(x/cell),b=Math.round(y/cell);for(let r=0;r<6;r++)for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(!workshopBlocked(s,(a+i)*cell,(b+j)*cell))return [a+i,b+j];}const a=nearest(s.x,s.y),b=nearest(x,y);if(!a||!b)return [];q.push(a);prev.set(key(...a),null);for(let i=0;i<q.length;i++){const p=q[i];if(p[0]===b[0]&&p[1]===b[1]){let k=key(...p);const result=[];while(prev.get(k)!==null){result.push({x:k%W*cell,y:Math.floor(k/W)*cell});k=prev.get(k);}return result.reverse();}for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=p[0]+dx,ny=p[1]+dy,k=key(nx,ny);if(nx<0||nx>=W||ny<0||ny>=H||prev.has(k)||workshopBlocked(s,nx*cell,ny*cell))continue;prev.set(k,key(...p));q.push([nx,ny]);}}return [];}
function notice(s,text){s.notice=text;s.noticeAge=5;}
function mode(b,name){b.mode=name;b.age=0;}
function hurt(s){if(s.invincible||s.dodge||s.phase!=='fight')return;s.health--;s.hits++;s.invincible=1.5;if(s.health<=0){s.phase='caught';notice(s,'The workshop goes dark.');}}
export function dodgeWorkshop(s,input={}){if(s.paused||!['arrival','fight'].includes(s.phase)||s.dodgeCooldown>0)return false;let dx=Number(!!input.right)-Number(!!input.left),dy=Number(!!input.down)-Number(!!input.up);if(!dx&&!dy){[dx,dy]=({left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]})[s.face];}const n=Math.hypot(dx,dy);s.dodgeX=dx/n;s.dodgeY=dy/n;s.dodge=.22;s.dodgeCooldown=1.15;return true;}
export function attackWorkshop(s){if(s.paused||!['arrival','fight'].includes(s.phase)||s.attackCooldown>0)return false;if(!s.fork){if(Math.hypot(s.x-FORK.x,s.y-FORK.y)<42){s.fork=true;s.checkpoint=true;notice(s,'A metal fork. Two hits will force the casing open. Then bridge the contacts.');return true;}notice(s,'Something metallic glints on the dusty floor.');return false;}
s.attack=.4;s.attackCooldown=.55;s.attackPending=true;const dx=s.boss.x-s.x,dy=s.boss.y-s.y;if(Math.hypot(dx,dy)<86)s.face=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';return true;}
function resolveFork(s){const b=s.boss;if(s.phase!=='fight'||length(s,b)>=62)return false;
if(b.mode==='recover'){
 b.hp=Math.max(0,b.hp-3);b.armorHits=0;s.shorts++;b.flash=.8;mode(b,'shorted');s.sparks=Array.from({length:22},(_,i)=>({angle:i*2.399,speed:40+(i%5)*12,age:0}));notice(s,'The fork bridges the contacts. Electricity tears through the rig.');
 if(b.hp===0){mode(b,'dead');s.phase='defeated';s.age=0;s.shots=[];notice(s,'The current dies. The far door is releasing.');}else if(b.hp<=6&&b.phase===1){b.phase=2;b.zapWait=.8;mode(b,'transform');s.shots=[];notice(s,'Its casing splits. The exposed wiring is still alive.');}return true;
}
if(['pursue','grab-warn','grab','charge','shoot','cooldown'].includes(b.mode)){
 b.armorHits++;s.casingHits++;b.impact=.24;
 if(b.armorHits===2){mode(b,'recover');}return true;
}return false;}
export function flashWorkshop(s){if(s.paused||s.phase!=='fight'||s.flashCooldown>0)return false;s.flash=.32;s.flashCooldown=.9;return true;}
function segmentDistance(px,py,x,y,xx,yy){const dx=xx-x,dy=yy-y,t=Math.max(0,Math.min(1,((px-x)*dx+(py-y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(px-x-t*dx,py-y-t*dy);}
export function tickWorkshop(s,input,dt){if(s.paused||['caught','escaped'].includes(s.phase))return;dt=Math.min(.04,dt);s.time+=dt;s.age+=dt;s.noticeAge=Math.max(0,s.noticeAge-dt);for(const name of ['invincible','dodge','dodgeCooldown','attack','attackCooldown','flash','flashCooldown'])s[name]=Math.max(0,s[name]-dt);if(s.attackPending&&s.attack<=.22){s.attackPending=false;resolveFork(s);}const ox=s.x,oy=s.y;let dx=Number(!!input.right)-Number(!!input.left),dy=Number(!!input.down)-Number(!!input.up);if(input.target&&!dx&&!dy){dx=input.target.x-s.x;dy=input.target.y-s.y;}const n=Math.hypot(dx,dy);if(s.dodge>0)move(s,s,s.dodgeX,s.dodgeY,240*dt);else if(n)move(s,s,dx,dy,Math.min(94*dt,input.target?n:Infinity));s.moving=Math.hypot(s.x-ox,s.y-oy)>.01;if(s.moving){s.walk+=dt*11;if(n)s.face=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';s.stepDistance+=Math.hypot(s.x-ox,s.y-oy);if(s.stepDistance>=13){s.stepDistance=0;s.stepSide*=-1;const angle=Math.atan2(s.y-oy,s.x-ox);s.footprints.push({x:s.x-Math.sin(angle)*s.stepSide*3,y:s.y+Math.cos(angle)*s.stepSide*3,angle,age:0});}}
for(const p of s.footprints)p.age+=dt;s.footprints=s.footprints.filter(p=>p.age<14).slice(-100);for(const p of s.sparks)p.age+=dt;s.sparks=s.sparks.filter(p=>p.age<.8);if(!s.fork&&Math.hypot(s.x-FORK.x,s.y-FORK.y)<22){s.fork=true;s.checkpoint=true;notice(s,'A metal fork. Hit the casing twice with E, then strike the exposed contacts.');}
const b=s.boss;b.age+=dt;b.impact=Math.max(0,b.impact-dt);b.flash=Math.max(0,b.flash-dt);
if(s.phase==='arrival'){if(s.age>REVEAL.wakeAt&&b.mode==='dormant'){mode(b,'awakening');notice(s,'The platform locks into place. The thing on it begins to move.');}if(s.age>REVEAL.standAt){b.y=302+Math.min(1,(s.age-REVEAL.standAt)/1.5)*64;b.walk+=dt*6;}if(s.age>REVEAL.fightAt&&s.y<395){s.phase='fight';s.age=0;mode(b,'pursue');notice(s,'Dodge the hands. Two fork hits force its chest open. Strike again to short it.');}}
else if(s.phase==='fight'){
 if(b.phase===2){b.zapWait-=dt;if(b.zapWait<=0&&['pursue','grab-warn'].includes(b.mode)){b.zapSeed=(b.zapSeed*1664525+1013904223)>>>0;b.zapWait=1.1+(b.zapSeed/4294967296)*2.4;b.chargeTime=.5+(b.zapSeed%100)/400;mode(b,'charge');b.targetX=s.x;b.targetY=s.y;}}
 if(b.mode==='pursue'){const toX=s.x-b.x,toY=s.y-b.y;b.face=toX<0?-1:1;b.walk+=dt*(b.phase===2?9:6);const before={x:b.x,y:b.y};move(s,b,toX,toY,(b.phase===2?62:49)*dt,13);if(length(before,b)<.05&&Math.abs(toY)>1){const bypass=b.x<360?-1:1;move(s,b,bypass,0,49*dt,13);}if(length(s,b)<112&&b.age>.55){mode(b,'grab-warn');b.targetX=s.x;b.targetY=s.y;}}
 else if(b.mode==='grab-warn'&&b.age>(b.phase===2?.68:.92)){mode(b,'grab');}
 else if(b.mode==='grab'){move(s,b,b.targetX-b.x,b.targetY-b.y,145*dt,13);if(segmentDistance(s.x,s.y,b.x,b.y,b.targetX,b.targetY)<17&&length(s,b)<92)hurt(s);if(b.age>.38){mode(b,'cooldown');b.sequence++;}}
 else if(b.mode==='charge'&&b.age>b.chargeTime){const a=Math.atan2(b.targetY-(b.y-18),b.targetX-b.x);for(let ray=0;ray<12;ray++){const angle=a+ray*Math.PI/6;s.shots.push({x:b.x,y:b.y-18,dx:Math.cos(angle)*148,dy:Math.sin(angle)*148,age:0});}mode(b,'shoot');}
 else if(b.mode==='shoot'&&b.age>.22){mode(b,'cooldown');b.sequence++;}
 else if(b.mode==='cooldown'&&b.age>(b.phase===2?1.45:1.8))mode(b,'pursue');
 else if(b.mode==='recover'&&b.age>2.4){b.armorHits=0;mode(b,'reseal');}
 else if(b.mode==='reseal'&&b.age>.28)mode(b,'pursue');
 else if(b.mode==='shorted'&&b.age>.8)mode(b,'pursue');
 else if(b.mode==='transform'&&b.age>2.4){mode(b,'pursue');b.sequence=0;}
 for(const bolt of s.shots){bolt.age+=dt;const x=bolt.x,y=bolt.y;bolt.x+=bolt.dx*dt;bolt.y+=bolt.dy*dt;if(segmentDistance(s.x,s.y,x,y,bolt.x,bolt.y)<12){hurt(s);bolt.age=9;}if(workshopBlocked(s,bolt.x,bolt.y,2))bolt.age=9;}s.shots=s.shots.filter(p=>p.age<4);
}
for(const m of s.moths){m.age+=dt;const lamp=WORKSHOP_LAMPS[m.lamp],angle=m.age*(1.1+m.lamp*.12)+m.offset;m.x=lamp[0]+Math.cos(angle)*18+Math.sin(angle*2.3)*5;m.y=lamp[1]+10+Math.sin(angle)*12+Math.cos(angle*1.7)*4;}
if(s.phase==='defeated'){s.exit=Math.min(1,s.exit+dt*.65);if(s.exit>.85&&s.x>622&&s.x<659&&s.y<90)s.phase='escaped';}
s.cameraX=Math.max(0,Math.min(240,s.x-240));s.cameraY=Math.max(0,Math.min(180,s.y-240));}
export function retryWorkshop(s){const n=newWorkshop();n.fork=s.checkpoint;n.checkpoint=s.checkpoint;return n;}
