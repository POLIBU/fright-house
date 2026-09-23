// Positive lateral displacement is camera-right when looking forward along the railway.
export function trackPoint(s,lateral=0){const x=Math.sin(s*.022)*10+Math.sin(s*.008)*18,dx=.22*Math.cos(s*.022)+.144*Math.cos(s*.008),n=Math.hypot(1,dx);return {x:x-lateral/n,z:s+lateral*dx/n};}
export const RIDE_LENGTH=420;
export const LANE_WIDTH=1.35;
// Every row reserves a clear track outside the full swept volume of its moving hazards.
export const OBSTACLES=[28,55,84,114,144,175,207,238,270,301,332,361,389].map((distance,i)=>({distance,lanes:i%3===0?[0]:i%3===1?[-1,1]:[0,1],id:'hazard-'+i,kind:['wreck','stall','beams','sign','barrel','machinery'][i%6],phase:i*1.73}));
export function newRide(progress=0){return {age:0,hitRows:new Set(),progress,lateral:0,speed:0,gap:24,energy:1,slow:0,hits:0,hitFlash:0,passed:new Set(OBSTACLES.filter(o=>o.distance<progress).map(o=>o.distance)),status:'riding'};}
export function stepRide(s,dt,{steer=0,boost=false,brake=false}={}){
 if(s.status!=='riding')return s;
 dt=Math.min(dt,.05);const previousTime=s.age,previousLateral=s.lateral;s.age+=dt;s.lateral=Math.max(-LANE_WIDTH,Math.min(LANE_WIDTH,s.lateral+steer*3.4*dt));
 const boosting=boost&&!brake&&s.energy>.04&&s.slow<=0;
 const target=s.slow>0?2.7:brake?3.0:boosting?10.3:7.2;
 s.speed+=(target-s.speed)*(1-Math.exp(-dt*4));s.energy=Math.max(0,Math.min(1,s.energy+(boosting?-.27:.16)*dt));s.slow=Math.max(0,s.slow-dt);s.hitFlash=Math.max(0,s.hitFlash-dt);
 const before=s.progress;s.progress=Math.min(RIDE_LENGTH,s.progress+s.speed*dt);
 for(const o of OBSTACLES){if(s.progress>o.distance+2.3)s.passed.add(o.distance);if(s.hitRows.has(o.id)||s.passed.has(o.distance)||Math.abs(o.distance-s.progress)>4)continue;const current=hazardState(o,s.age),previous=hazardState(o,previousTime);for(let i=0;i<current.length;i++){if(sweptContact({progress:before,lateral:previousLateral},{progress:s.progress,lateral:s.lateral},previous[i],current[i])){s.hitRows.add(o.id);s.hits++;s.slow=1.35;s.hitFlash=.75;s.gap-=3;break;}}}
 // It runs much faster outdoors, accelerates in the last stretch and gains on braking/hits.
 const monsterSpeed=s.progress>260?7.8:6.7;
 s.gap=Math.min(30,s.gap+(s.speed-monsterSpeed)*dt);
 if(s.gap<=3)s.status='caught';else if(s.progress>=RIDE_LENGTH)s.status='escaped';
 return s;
}
export function hazardState(o,t){return o.lanes.map((lane,i)=>{const phase=t*1.1+o.phase+i*.7,moving=o.kind==='sign'||o.kind==='barrel'||o.kind==='machinery';return {id:o.id+'-'+i,kind:o.kind,distance:o.distance+(o.kind==='barrel'?Math.sin(phase)*.65:0),lateral:lane*LANE_WIDTH+(o.kind==='barrel'?Math.sin(phase*.8)*.16:o.kind==='machinery'?Math.sin(phase)*.14:0),height:o.kind==='sign'?.72+(.5+.5*Math.sin(phase))*1.8:0,angle:o.kind==='barrel'?t*2+o.phase:o.kind==='machinery'?Math.sin(phase)*.24:0,halfWidth:o.kind==='barrel'?.42:o.kind==='machinery'?.45:o.kind==='beams'?.49:.48,halfDepth:o.kind==='wreck'?.73:o.kind==='barrel'?.36:.48,moving};});}
// Continuous relative slabs keep rendering and collision in the same time/position model.
export function sweptContact(a,b,old,h){let lo=0,hi=1;for(const [u,v,r] of [[a.progress-old.distance,b.progress-h.distance,h.halfDepth+.35],[a.lateral-old.lateral,b.lateral-h.lateral,h.halfWidth+.55]]){const delta=v-u;if(Math.abs(delta)<1e-9){if(Math.abs(u)>r)return false;}else{const x=(-r-u)/delta,y=(r-u)/delta;lo=Math.max(lo,Math.min(x,y));hi=Math.min(hi,Math.max(x,y));if(lo>hi)return false;}}if(h.kind==='sign'){const delta=h.height-old.height;if(Math.abs(delta)<1e-9){if(h.height>1.5)return false;}else if(delta>0)hi=Math.min(hi,(1.5-old.height)/delta);else lo=Math.max(lo,(1.5-old.height)/delta);}return lo<=hi&&hi>=0&&lo<=1;}
export function rideSnapshot(s){const next=OBSTACLES.find(o=>o.distance+2.3>s.progress);return {age:s.age,progress:s.progress,length:RIDE_LENGTH,lateral:s.lateral,speed:s.speed,gap:s.gap,energy:s.energy,hits:s.hits,status:s.status,hazards:OBSTACLES.filter(o=>Math.abs(o.distance-s.progress)<32).flatMap(o=>hazardState(o,s.age)),next:next?{distance:next.distance-s.progress,lanes:next.lanes,kind:next.kind}:null};}
