import {blocked} from './street-model.js';
const colors=['#a14b3b','#bca05d','#497a73','#847197','#c2b98b'];
export function newConfetti(){const bits=[];for(let i=0;i<240;i++){const x=96+(i*83.173)%239,y=164+(i*53.671)%183;if(!blocked(x,y,{gateProgress:1},2))bits.push({x,y,homeX:x,homeY:y,z:0,age:0,cooldown:0,vx:0,vy:0,angle:i*2.39,color:colors[i%colors.length]});}return bits;}
export function tickConfetti(bits,s,dt,reduced=false){for(const p of bits){p.cooldown=Math.max(0,p.cooldown-dt);const d=Math.hypot(p.x-s.x,p.y-s.y);if(!p.age&&!p.cooldown&&s.moving&&d<17){p.age=.001;p.vx=(p.x-s.x)/Math.max(1,d)*15;p.vy=(p.y-s.y)/Math.max(1,d)*10;p.cooldown=2.4;}
 if(p.age){p.age+=dt;const t=p.age;p.z=Math.sin(Math.min(1,t/1.45)*Math.PI)*(reduced?3:10);const nx=p.x+(p.vx+Math.sin(t*9+p.homeX)*6)*dt,ny=p.y+(p.vy+Math.cos(t*6+p.homeY)*4)*dt;if(!blocked(nx,ny,{gateProgress:1},2)){p.x=nx;p.y=ny;}p.angle+=dt*(reduced?1:6);if(t>=1.45){p.age=0;p.z=0;}}
}}
export function drawConfetti(ctx,bits,airborne){for(const p of bits){if((p.z>1)!==airborne)continue;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y-p.z));ctx.rotate(p.angle);ctx.globalAlpha=.85;ctx.fillStyle=p.color;ctx.fillRect(-1,-.5,2.5,Math.max(.5,Math.abs(Math.cos(p.angle))*1.5));ctx.restore();}}
