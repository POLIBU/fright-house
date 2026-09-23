// Positive lateral displacement is camera-right when looking forward along the railway.
export function trackPoint(s,lateral=0){const x=Math.sin(s*.022)*10+Math.sin(s*.008)*18,dx=.22*Math.cos(s*.022)+.144*Math.cos(s*.008),n=Math.hypot(1,dx);return {x:x-lateral/n,z:s+lateral*dx/n};}
export const RIDE_LENGTH=420;
export const LANE_WIDTH=1.35;
// Every junction has a safe track and at least three seconds to switch before the next one.
export const OBSTACLES=[28,55,84,114,144,175,207,238,270,301,332,361,389].map((distance,i)=>({distance,lanes:i%3===0?[0]:i%3===1?[-1,1]:[0,1],kind:['timber','cart','barrier'][i%3]}));
export function newRide(progress=0){return {progress,lateral:0,speed:0,gap:24,energy:1,slow:0,hits:0,hitFlash:0,passed:new Set(OBSTACLES.filter(o=>o.distance<progress).map(o=>o.distance)),status:'riding'};}
export function stepRide(s,dt,{steer=0,boost=false,brake=false}={}){
 if(s.status!=='riding')return s;
 dt=Math.min(dt,.05);s.lateral=Math.max(-LANE_WIDTH,Math.min(LANE_WIDTH,s.lateral+steer*3.4*dt));
 const boosting=boost&&!brake&&s.energy>.04&&s.slow<=0;
 const target=s.slow>0?2.7:brake?3.0:boosting?10.3:7.2;
 s.speed+=(target-s.speed)*(1-Math.exp(-dt*4));s.energy=Math.max(0,Math.min(1,s.energy+(boosting?-.27:.16)*dt));s.slow=Math.max(0,s.slow-dt);s.hitFlash=Math.max(0,s.hitFlash-dt);
 const before=s.progress;s.progress=Math.min(RIDE_LENGTH,s.progress+s.speed*dt);
 for(const o of OBSTACLES)if(!s.passed.has(o.distance)&&before<o.distance&&s.progress>=o.distance){s.passed.add(o.distance);if(o.lanes.some(lane=>Math.abs(s.lateral-lane*LANE_WIDTH)<.66)){s.hits++;s.slow=1.35;s.hitFlash=.75;s.gap-=3;}}
 // It runs much faster outdoors, accelerates in the last stretch and gains on braking/hits.
 const monsterSpeed=s.progress>260?7.8:6.7;
 s.gap=Math.min(30,s.gap+(s.speed-monsterSpeed)*dt);
 if(s.gap<=3)s.status='caught';else if(s.progress>=RIDE_LENGTH)s.status='escaped';
 return s;
}
export function rideSnapshot(s){const next=OBSTACLES.find(o=>o.distance>s.progress);return {progress:s.progress,length:RIDE_LENGTH,lateral:s.lateral,speed:s.speed,gap:s.gap,energy:s.energy,hits:s.hits,status:s.status,next:next?{distance:next.distance-s.progress,lanes:next.lanes,kind:next.kind}:null};}
