import {SECRETS,cleanEvidence,endingFor} from '../campaign/secrets.js';
export const ALLEY={height:1440,startY:1280,endY:89,tapeY:142,minX:176,maxX:308};
// Coordinates on the authored 480×360 bedroom: mattress left of the nightstand.
export const BEDROOM={girlX:80,girlY:145,girlHeight:55,lampX:112,lampY:116,lampWidth:22,lampHeight:35};
export const ARREST={gateX:172,gateY:215,seatX:300,seatY:334};
export function endingHint(branch){return branch==='arrest'?'Try collecting fewer secret items for an alternative ending.':'To unlock the alternative police ending, collect all the items dropped by the children.';}
export const GIRL_LINE='Hmmm, I don’t know if I liked this game. I’d better go to sleep now.';
export const POLICE_LINE='You are the prime suspect in the disappearance of the children.';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function newEpilogue(items=[],preview=''){const evidence=cleanEvidence(items);return {phase:preview==='bedroom'||preview==='lamp'?'bedroom':preview==='arrest'?'approach':preview==='escape'?'escape':'unload',age:preview==='lamp'?14:0,time:0,paused:false,x:240,y:1280,face:'up',walk:0,moving:false,spriteHeight:68,cameraY:1080,branch:preview==='arrest'?'arrest':preview==='escape'||preview==='bedroom'||preview==='lamp'?'escape':endingFor(evidence),evidence:preview==='arrest'?SECRETS.map(x=>x.id):evidence,preview:!!preview,dawn:0,tapeBroken:false,tapeAge:0,leaves:Array.from({length:100},(_,i)=>({x:180+(i*47)%125,y:130+(i*113)%1170,z:0,vx:0,vy:0,vz:0,angle:i*2.4,age:0})),leafFlights:0,spilled:[],spilledOnce:false,lampOn:true,notice:'',speaker:'DETECTIVE'};}
function phase(s,next){s.phase=next;s.age=0;s.notice='';}
export function tickEpilogue(s,input,dt){if(s.paused||s.phase==='complete')return;dt=clamp(dt,0,.05);s.time+=dt;s.age+=dt;s.moving=false;
 if(s.phase==='unload'){s.y=1280-Math.min(1,s.age/2.8)*65;s.walk+=dt*8;s.moving=true;if(s.age>=2.8){phase(s,'alley');s.notice='The cart has stopped. There is cold air beyond the trees.';}}
 else if(s.phase==='alley'){let dx=Number(!!input.right)-Number(!!input.left),dy=Number(!!input.down)-Number(!!input.up);if(!dx&&!dy&&input.target){dx=input.target.x-s.x;dy=input.target.y-s.y;if(Math.hypot(dx,dy)<3)dx=dy=0;}const n=Math.hypot(dx,dy);if(n){const step=Math.min(95*dt,input.target&&!input.up&&!input.down&&!input.left&&!input.right?n:95*dt);s.x=clamp(s.x+dx/n*step,ALLEY.minX,ALLEY.maxX);s.y=clamp(s.y+dy/n*step,ALLEY.endY,1260);if(s.y<190&&dy<0)s.x+=(240-s.x)*Math.min(1,dt*5);s.moving=true;s.walk+=dt*10;s.face=Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy<0?'up':'down';}s.dawn=Math.max(s.dawn,clamp((ALLEY.startY-s.y)/(ALLEY.startY-ALLEY.endY),0,1));if(s.branch==='arrest'&&s.y<ALLEY.tapeY+8&&!s.tapeBroken){s.tapeBroken=true;s.tapeAge=0;s.notice='Finally, the police are here.';}if(s.y<=ALLEY.endY+1){phase(s,s.branch==='arrest'?'approach':'escape');}}
 if(s.tapeBroken)s.tapeAge+=dt;
 for(const l of s.leaves){if(s.phase==='alley'&&s.moving&&l.z===0&&Math.hypot(l.x-s.x,l.y-s.y)<20){l.vz=38+Math.abs(Math.sin(l.x))*20;l.vx=(l.x-s.x)*3;l.vy=(l.y-s.y)*2;l.z=.1;l.age=0;s.leafFlights++;}if(l.z>0){l.age+=dt;l.x+=l.vx*dt;l.y+=l.vy*dt;l.z=Math.max(0,l.z+l.vz*dt);l.vz-=55*dt;l.vx*=Math.exp(-dt*2);l.angle+=dt*(2+Math.sin(l.x));}}
 s.cameraY=clamp(s.y-220,0,ALLEY.height-360);
 if(s.phase==='approach'){s.speaker='POLICEMAN';if(s.age>2)s.notice=POLICE_LINE;if(s.age>=12)phase(s,'cuff');}
 else if(s.phase==='cuff'){s.speaker='POLICEMAN';s.notice='';if(s.age>1.25&&!s.spilledOnce){s.spilledOnce=true;s.spilled=s.evidence.map((id,i)=>({id,x:ARREST.gateX,y:ARREST.gateY+3,z:30,vx:Math.cos(i*2.4)*(25+i*2),vy:Math.sin(i*2.4)*12,vz:30+i*2,angle:i}));}if(s.age>=2.2)phase(s,'reaction');}
 else if(s.phase==='reaction'){s.speaker='POLICEMAN';s.notice='You… monster… You’re going down!';if(s.age>=3.2)phase(s,'escort');}
 else if(s.phase==='escort'&&s.age>=4)phase(s,'crouch');
 else if(s.phase==='crouch'&&s.age>=3.6)phase(s,'police-drive');
 else if(s.phase==='police-drive'&&s.age>=8)phase(s,'ending-hint');
 else if(s.phase==='ending-hint'){s.speaker='FRIGHT HOUSE';s.notice=endingHint(s.branch);if(s.age>=10)phase(s,s.branch==='arrest'?'arrest-end':'bedroom-end');}
 else if(s.phase==='arrest-end'&&s.age>=5)phase(s,'complete');
 else if(s.phase==='escape'&&s.age>=16.5)phase(s,'bedroom');
 else if(s.phase==='bedroom'){s.speaker='GIRL';s.notice=s.age>=4&&s.age<13?GIRL_LINE:'';s.lampOn=s.age<18;if(s.age>=25)phase(s,'ending-hint');}
 else if(s.phase==='bedroom-end'&&s.age>=6)phase(s,'complete');
 for(const e of s.spilled){if(e.z>0||e.vz>0){e.x+=e.vx*dt;e.y+=e.vy*dt;e.z=Math.max(0,e.z+e.vz*dt);e.vz-=100*dt;e.angle+=dt*4;if(e.z===0){e.vz=0;e.vx=0;}}}
}
export function bedroomPose(s){const t=s.age;return {frame:t<13?Math.floor(t*2)%4:t<15?4:t<17?5:t<18.6?6:7,reaching:t>=13,seated:true,facing:'down-right',girlX:BEDROOM.girlX,girlY:BEDROOM.girlY,girlHeight:BEDROOM.girlHeight,lampOn:s.lampOn,clownFrame:Math.min(3,Math.max(0,Math.floor((t-8)/2))),clownAlpha:clamp((t-7)/5,0,.65),darkness:t<18?0:clamp((t-18)/1.3,0,.97)};}

export function policeBeacon(s){return .5+.5*Math.sin(s.time*Math.PI*5);}
// Follow the ground around the rear bumper, then along the near side to the door.
const ESCORT_ROUTE=[[ARREST.gateX,ARREST.gateY],[174,338],[ARREST.seatX,338],[ARREST.seatX,ARREST.seatY]];
function escortPosition(progress){const lengths=ESCORT_ROUTE.slice(1).map((p,i)=>Math.hypot(p[0]-ESCORT_ROUTE[i][0],p[1]-ESCORT_ROUTE[i][1]));let distance=progress*lengths.reduce((a,b)=>a+b,0);for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]||i===lengths.length-1){const a=ESCORT_ROUTE[i],b=ESCORT_ROUTE[i+1],u=clamp(distance/lengths[i],0,1);return {x:a[0]+(b[0]-a[0])*u,y:a[1]+(b[1]-a[1])*u};}distance-=lengths[i];}}
export function policePose(s){const t=s.age,walk=clamp(t/4,0,1),position=escortPosition(walk);return {aiming:s.phase==='approach'&&t>=2&&t<10,frame:t<2?0:t<2.4?1:t<2.8?2:t<3.2?3:t<10?4:t<10.6?5:t<11.2?6:7,reactionFrame:Math.min(3,Math.floor(t/.8)),escortFrame:4+Math.floor(t*7)%4,escortX:position.x,escortY:position.y,escortHeight:70+walk*6};}
