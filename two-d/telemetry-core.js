// The scale is a world convention, independent of viewport size and camera zoom.
export const METRES_PER_PIXEL=1/40;
export function triangleCount(mode,count,instances=1){return (mode===4?Math.floor(count/3):mode===5||mode===6?Math.max(0,count-2):0)*instances;}
export function roomPosition(room,s){const p=s.cart?{x:s.cart.x+(s.cart.lane||0),y:s.cart.y}:s;const scale=room===3?80:40;return [Number.isFinite(p?.x)?p.x/scale:0,Number.isFinite(p?.y)?p.y/scale:0];}
export function terminal(room,s){return ['caught','dead','gameover'].includes(s.phase||s.status)||(room===12&&s.phase==='complete');}
export function createFrameClock(){let stamps=[],previous=null;return {reset(){previous=null;},sample(now,pos,epoch,stationary=false){stamps.push(now);while(stamps.length>2&&stamps[1]<=now-1000)stamps.shift();const elapsed=stamps.at(-1)-stamps[0],fps=elapsed>0?(stamps.length-1)*1000/elapsed:0,dt=previous?(now-previous.now)/1000:0;const speed=previous&&previous.epoch===epoch&&dt>0&&!stationary?Math.hypot(pos[0]-previous.pos[0],pos[1]-previous.pos[1])/dt:0;previous={now,pos:[...pos],epoch};return {fps,speed};}};}
export function emptyCounts(){return {webglDraws:0,webglTriangles:0,canvasPaints:0,clears:0,contexts:{}};}
