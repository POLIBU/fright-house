import {readEvidence} from './campaign/secrets.js';
import {triangleCount,roomPosition,terminal,createFrameClock,emptyCounts} from './telemetry-core.js';
// Imported first by each room, before any canvas, image or WebGL renderer is created.
window.__READY__=false;
const nativeRAF=window.requestAnimationFrame.bind(window),callbacks=new Map(),clock=createFrameClock();
let nextId=0,scheduled=false,inFrame=false,frame=0,epoch=0,config,loaded=false,reportedReady=false,failed=false,counts=emptyCounts(),initialization=emptyCounts();
let contextId=0;const contexts=new WeakMap(),images=new WeakMap(),pending=new Set(),assetWaiters=new Set(),failures=[];
function bucket(){return !reportedReady&&!inFrame?initialization:counts;}
function record(ctx,key,n){const b=bucket();b[key]+=n;let id=contexts.get(ctx);if(!id){id=`${ctx.canvas?.id||'offscreen'}-${++contextId}`;contexts.set(ctx,id);}const entry=b.contexts[id]||={webglDraws:0,webglTriangles:0,canvasPaints:0,clears:0};entry[key]+=n;}
function wrap(proto,name,measure){if(!proto?.[name])return;const original=proto[name];proto[name]=function(...args){const result=Reflect.apply(original,this,args);measure(this,args);return result;};}
function glDraw(gl,mode,count,instances=1,calls=1){record(gl,'webglDraws',calls);record(gl,'webglTriangles',triangleCount(mode,count,instances));}
// Renderer canvases are often detached, so their context-loss events cannot
// reach a listener on document. Observe each canvas when its context is created.
const observedCanvases=new WeakSet();
for(const type of ['HTMLCanvasElement','OffscreenCanvas']){const p=window[type]?.prototype;if(!p)continue;const original=p.getContext;p.getContext=function(...args){const context=Reflect.apply(original,this,args);if(context&&!observedCanvases.has(this)){observedCanvases.add(this);this.addEventListener('webglcontextlost',()=>fail('WebGL context lost'));}return context;};}
for(const type of ['WebGLRenderingContext','WebGL2RenderingContext']){const p=window[type]?.prototype;if(!p)continue;
 wrap(p,'drawArrays',(gl,a)=>glDraw(gl,a[0],a[2]));wrap(p,'drawElements',(gl,a)=>glDraw(gl,a[0],a[1]));
 wrap(p,'drawArraysInstanced',(gl,a)=>glDraw(gl,a[0],a[2],a[3]));wrap(p,'drawElementsInstanced',(gl,a)=>glDraw(gl,a[0],a[1],a[4]));
 wrap(p,'clear',(gl)=>record(gl,'clears',1));
 const original=p.getExtension;p.getExtension=function(name){const extension=Reflect.apply(original,this,[name]);if(extension&&!extension.__frightMeasured){const gl=this;
  if(name==='ANGLE_instanced_arrays'){wrap(extension,'drawArraysInstancedANGLE',(_,a)=>glDraw(gl,a[0],a[2],a[3]));wrap(extension,'drawElementsInstancedANGLE',(_,a)=>glDraw(gl,a[0],a[1],a[4]));}
  if(name==='WEBGL_multi_draw')for(const method of ['multiDrawArraysWEBGL','multiDrawElementsWEBGL','multiDrawArraysInstancedWEBGL','multiDrawElementsInstancedWEBGL'])wrap(extension,method,(_,a)=>{const arrays=method.includes('Arrays'),instanced=method.includes('Instanced'),drawCount=a.at(-1),values=arrays?a[3]:a[1],offset=arrays?a[4]:a[2],instances=instanced?a[arrays?5:6]:null,instanceOffset=instanced?a[arrays?6:7]:0;for(let i=0;i<drawCount;i++)glDraw(gl,a[0],values[offset+i],instanced?instances[instanceOffset+i]:1);});
  Object.defineProperty(extension,'__frightMeasured',{value:true});
 }return extension;};
}
for(const type of ['CanvasRenderingContext2D','OffscreenCanvasRenderingContext2D']){const p=window[type]?.prototype;for(const name of ['drawImage','fill','stroke','fillRect','strokeRect','fillText','strokeText','putImageData'])wrap(p,name,ctx=>record(ctx,'canvasPaints',1));wrap(p,'clearRect',ctx=>record(ctx,'clears',1));}
function fail(message){failed=true;window.__READY__=false;if(!failures.includes(message))failures.push(message);}
const src=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
Object.defineProperty(HTMLImageElement.prototype,'src',{...src,set(value){const previous=images.get(this);if(previous)pending.delete(previous);const token={image:this,url:String(value)};images.set(this,token);pending.add(token);const settle=ok=>{if(images.get(this)!==token)return;pending.delete(token);if(!ok)fail('Image failed: '+token.url);flushAssets();};this.addEventListener('load',()=>settle(true),{once:true});this.addEventListener('error',()=>settle(false),{once:true});src.set.call(this,value);}});
let fontsReady=false;document.fonts.ready.then(()=>{fontsReady=true;flushAssets();},()=>fail('Fonts failed'));
function flushAssets(){if(pending.size||!fontsReady||failed)return;for(const fn of [...assetWaiters]){assetWaiters.delete(fn);fn();}}
export function whenAssetsReady(fn){assetWaiters.add(fn);queueMicrotask(flushAssets);}
export function markRoomLoaded(){loaded=true;}
export function resetTelemetryMotion(){epoch++;clock.reset();}
export function configureTelemetry(options){config=options;}
export function requestGameFrame(callback){const id=++nextId;callbacks.set(id,callback);if(!scheduled){scheduled=true;nativeRAF(run);}return id;}
export function cancelGameFrame(id){callbacks.delete(id);}
function run(now){scheduled=false;inFrame=true;const batch=[...callbacks];for(const [id,fn]of batch){if(!callbacks.delete(id))continue;try{fn(now);}catch(error){fail(String(error));console.error(error);}}
 if(config){const s=config.state()||{},phase=s.phase||s.status||(config.room===2?'hall':'loading'),running=config.running(),paused=config.paused?config.paused():!!s.paused,pos=config.position?config.position(s):roomPosition(config.room,s),motion=clock.sample(now,pos,`${epoch}:${phase}:${s.hits||0}`,paused||!running);
  const rendered=counts.canvasPaints+counts.webglDraws>0;window.__READY__=!!(loaded&&!failed&&fontsReady&&(reportedReady||pending.size===0&&rendered));
  reportedReady ||= window.__READY__;const score=readEvidence().length;
  window.__GAME__={pos,...motion,score,over:terminal(config.room,s),draws:counts.webglDraws+counts.canvasPaints,tris:counts.webglTriangles,room:config.room,phase,frame:++frame,timestamp:now,ready:window.__READY__,running,paused,render:{...counts,initialization},assets:{pending:pending.size,failures:[...failures]}};
 }
 inFrame=false;counts=emptyCounts();if(callbacks.size&&!scheduled){scheduled=true;nativeRAF(run);}
}
window.addEventListener('error',e=>{if(e.error)fail(String(e.error));});
document.addEventListener('webglcontextlost',()=>fail('WebGL context lost'),true);
