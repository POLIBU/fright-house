// The highlight follows the item's alpha silhouette, with no marker beside it.
const masks=new WeakMap();
export function drawHighlightedSprite(ctx,sprite,x,y,w,h,time=0,revision=0){
 let cached=masks.get(sprite),mask=cached?.canvas;
 if(!mask||cached.revision!==revision){mask=document.createElement('canvas');mask.width=sprite.width;mask.height=sprite.height;const m=mask.getContext('2d');m.drawImage(sprite,0,0);m.globalCompositeOperation='source-in';m.fillStyle='#ffe4a6';m.fillRect(0,0,mask.width,mask.height);masks.set(sprite,{canvas:mask,revision});}
 drawSpriteOutline(ctx,mask,x,y,w,h,time);ctx.drawImage(sprite,x,y,w,h);
}

let outlineCanvas;
export function drawSpriteOutline(ctx,mask,x,y,w,h,time=0){
 // Cut the complete object silhouette out of the glow. Even translucent pixels
 // keep their original colour when the normal object is drawn over the scene.
 const pad=4,width=Math.ceil(w)+pad*2,height=Math.ceil(h)+pad*2;
 outlineCanvas ||= document.createElement('canvas');
 outlineCanvas.width=width;outlineCanvas.height=height;
 const c=outlineCanvas.getContext('2d');c.imageSmoothingEnabled=false;
 c.shadowColor='#fff2cd';c.shadowBlur=1.5;
 for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(mask,pad+dx,pad+dy,w,h);
 c.shadowBlur=0;c.globalCompositeOperation='destination-out';c.drawImage(mask,pad,pad,w,h);
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha*=Math.min(1,2*(.58+.10*Math.sin(time*1.7)));ctx.drawImage(outlineCanvas,x-pad,y-pad);ctx.restore();
}
