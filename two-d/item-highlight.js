// The highlight follows the item's alpha silhouette, with no marker beside it.
const masks=new WeakMap();
export function drawHighlightedSprite(ctx,sprite,x,y,w,h,time=0,revision=0){
 let cached=masks.get(sprite),mask=cached?.canvas;
 if(!mask||cached.revision!==revision){mask=document.createElement('canvas');mask.width=sprite.width;mask.height=sprite.height;const m=mask.getContext('2d');m.drawImage(sprite,0,0);m.globalCompositeOperation='source-in';m.fillStyle='#ffe4a6';m.fillRect(0,0,mask.width,mask.height);masks.set(sprite,{canvas:mask,revision});}
 const pulse=.58+.10*Math.sin(time*1.7);
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha*=pulse;ctx.shadowColor='#efc37b';ctx.shadowBlur=3;
 for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])ctx.drawImage(mask,x+dx,y+dy,w,h);
 ctx.restore();ctx.drawImage(sprite,x,y,w,h);
}
// Brighten the actual 3D surfaces without adding floating geometry or draw calls.
const surfaces=new WeakMap();
export function emphasizeItem(root,active,time=0){
 let materials=surfaces.get(root);
 if(!materials){const unique=new Set(),copies=new Map();const isolate=m=>{if(!copies.has(m))copies.set(m,m.clone());return copies.get(m);};root.traverse(o=>{if(!o.isMesh)return;o.material=Array.isArray(o.material)?o.material.map(isolate):isolate(o.material);for(const m of (Array.isArray(o.material)?o.material:[o.material]))unique.add(m);});materials=[...unique].map(m=>({m,color:m.color?.clone(),emissive:m.emissive?.clone(),intensity:m.emissiveIntensity}));surfaces.set(root,materials);}
 const amount=active?.15+.025*Math.sin(time*1.7):0;
 for(const {m,color,emissive,intensity} of materials){if(emissive){m.emissive.copy(emissive);m.emissive.r+=amount;m.emissive.g+=amount*.8;m.emissive.b+=amount*.43;m.emissiveIntensity=Math.max(intensity||0,active?.85:0);}else if(color){m.color.copy(color);m.color.r+=(1-m.color.r)*amount;m.color.g+=(1-m.color.g)*amount;m.color.b+=(1-m.color.b)*amount;}}
}
