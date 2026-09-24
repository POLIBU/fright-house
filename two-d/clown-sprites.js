import {CLOWN_DRAW_HEIGHT} from './levels/platform-layout.js';
const sheet=new Image(),stairs=new Image(),frames=[],climb=[];
function cut(image,cols,rows){const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(image,0,0);const p=x.getImageData(0,0,c.width,c.height).data,out=[];for(let row=0;row<rows;row++){const rr=[];for(let col=0;col<cols;col++){const left=Math.floor(col*c.width/cols),right=Math.floor((col+1)*c.width/cols),top=Math.floor(row*c.height/rows),bottom=Math.floor((row+1)*c.height/rows);let x0=right,y0=bottom,x1=left,y1=top;for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)if(p[(y*c.width+x)*4+3]>90){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}rr.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1});}out.push(rr);}return out;}
sheet.onload=()=>frames.push(...cut(sheet,4,2));sheet.src=new URL('./assets/characters/clown-walk-shoot-v1.png',import.meta.url).href;
stairs.onload=()=>climb.push(...cut(stairs,4,2));stairs.src=new URL('./assets/characters/clown-stairs-v1.png',import.meta.url).href;
export const clownSpritesReady=()=>frames.length===2;
export function drawClowns(ctx,s){if(!s.power||!clownSpritesReady()||s.powerAge<.6)return;const c=s.clown;if(!c)return;const a=s.ambush.archer;let image=sheet,row=0,index=Math.floor(c.walk*4/(Math.PI*2))%4,flip=c.face==='left';if(c.stair&&climb.length===2){image=stairs;row=flip?1:0;flip=false;}else if(!c.moving){row=1;index=a.phase==='aim'?a.age<.4?1:2:a.phase==='release'?3:0;flip=s.x<c.x;}const f=(image===stairs?climb:frames)[row][index];
 // Height excludes the bow above the head: bow-draw frames get more canvas,
 // not a smaller clown. The larger actor remains scenery outside player collision.
 const scale=CLOWN_DRAW_HEIGHT/frames[0][0].h,w=f.w*scale,h=f.h*scale;ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(c.x,c.y);if(flip)ctx.scale(-1,1);ctx.drawImage(image,f.x,f.y,f.w,f.h,-w/2,-h,w,h);ctx.restore();
}
