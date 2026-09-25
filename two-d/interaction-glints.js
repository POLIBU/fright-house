// Small intermittent highlights sit on the objects, never over the controls.
export function drawGlint(ctx,x,y,time,scale=1){
 const pulse=Math.max(0,Math.sin(time*2.2+x*.09+y*.04));if(pulse<.48)return;
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);ctx.globalAlpha=(pulse-.48)/.52;ctx.fillStyle='#fff4ce';ctx.fillRect(-3,0,7,1);ctx.fillRect(0,-3,1,7);ctx.fillStyle='#fff';ctx.fillRect(0,0,1,1);ctx.restore();
}
export function drawInteractionGlints(ctx,level,s,time){
 if(!s?.running||s.paused||s.dialog||s.inspection===true||s.inspection?.open||s.inspection?.active||document.querySelector('dialog[open]'))return;
 let points=[];
 if(level===1)points=[[63,240],[143,265],[308,258]];
 if(level===2)points=[[126,112],[338,127]];
 if(level===4&&s.entry>=.85&&s.phase==='explore')points=[[436,81],[132,158]];
 if(level===5){if(s.phase==='ringing')points.push([148,138]);if(s.book?.landed&&!s.book?.collected)points.push([s.book.x||592,s.book.y||215]);}
 if(level===6&&!s.turns)points=[[648,184]];
 if(level===7)points=[[151,314],[648,230],[150,161]];
 if(level===8&&!s.fork)points=[[207,379]];
 if(level===10)points=[[240,146]];
 for(const [x,y] of points)drawGlint(ctx,x-(s.cameraX||0),y-(s.cameraY||0),time,level===3?2:1);
}
