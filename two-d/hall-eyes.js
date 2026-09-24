// Painted spiral pupils retain the original dark sockets and aged cream/red palette.
export function drawClownEyes(ctx,time){
 const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 for(const [x,y,direction]of [[254.2,50.3,1],[282.6,50.5,-1]]){
  ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.ellipse(0,0,5.8,6.3,0,0,Math.PI*2);ctx.clip();ctx.fillStyle='#b99870';ctx.fillRect(-7,-7,14,14);
  ctx.rotate(reduced?0:time*.85*direction);ctx.strokeStyle='#752c21';ctx.lineWidth=1.15;ctx.beginPath();for(let i=0;i<=120;i++){const a=i/120*Math.PI*5.5,r=.35+i/120*6.4;ctx[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r);}ctx.stroke();ctx.restore();
 }
}
