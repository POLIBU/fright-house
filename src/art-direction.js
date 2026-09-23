import * as THREE from 'three';
import {Reflector} from '../vendor/addons/objects/Reflector.js';

// Original procedural paint, inspired by the user's red-and-cream pinwheel reference.
export function spiralMaterial(){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=768;const ctx=canvas.getContext('2d'),im=ctx.createImageData(768,768);let seed=8791;
 for(let y=0;y<768;y++)for(let x=0;x<768;x++){const dx=(x-384)/384,dy=(y-384)/384,r=Math.hypot(dx,dy),a=Math.atan2(dy,dx)+r*.74;const red=Math.sin(a*16)>0;seed=(seed*1664525+1013904223)>>>0;const noise=seed/4294967296;const aged=.89+noise*.11-(y/768)*.075;const c=red?[160,35,31]:[219,201,148];const i=(y*768+x)*4;for(let k=0;k<3;k++)im.data[i+k]=c[k]*aged;im.data[i+3]=255;}
 ctx.putImageData(im,0,0);ctx.globalAlpha=.13;ctx.fillStyle='#3f392b';for(let i=0;i<500;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%768;seed=(seed*1664525+1013904223)>>>0;const y=seed%768;ctx.fillRect(x,y,1+seed%5,3+seed%19);}ctx.globalAlpha=1;const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
 const material=new THREE.MeshStandardMaterial({map:tex,roughness:.87});
 const time={value:0},amount={value:0};
 material.userData.melt={time,amount};
 material.onBeforeCompile=shader=>{
  shader.uniforms.meltTime=time;shader.uniforms.meltAmount=amount;
  shader.vertexShader='attribute float panelSeed; varying float vPanelSeed;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvPanelSeed=panelSeed;');
  shader.fragmentShader='uniform float meltTime; uniform float meltAmount; varying float vPanelSeed;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
   float angle=sin(vPanelSeed*1.71)*.22;
   vec2 shifted=vMapUv-vec2(.5+sin(vPanelSeed*2.3)*.12,.5+cos(vPanelSeed*1.3)*.11);
   vec2 meltedUv=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*shifted*.88+.5;
   vec2 wallUv=meltedUv;
   float rivulet=pow(.5+.5*sin(vMapUv.x*43.0+sin(vMapUv.x*17.0)*2.0),5.0);
   float run=meltTime*.045;
   meltedUv.y += meltAmount*(run*(.20+rivulet*.65)+.035*sin(vMapUv.x*25.0+meltTime*.45));
   meltedUv.x += meltAmount*.014*sin(vMapUv.y*11.0+meltTime*.55);
   vec4 sampledDiffuseColor=texture2D(map,vec2(clamp(meltedUv.x,0.001,.999),fract(meltedUv.y)));
   float mottled=sin(wallUv.x*19.0+vPanelSeed*2.0)*sin(wallUv.y*27.0+vPanelSeed);
   float edgeWear=smoothstep(.37,.52,abs(wallUv.x-.5))*.17;
   float streak=pow(.5+.5*sin(wallUv.x*83.0+vPanelSeed*11.0),18.0)*(.06+.08*wallUv.y);
   sampledDiffuseColor.rgb*=.92+.035*mottled-edgeWear-streak;
   diffuseColor *= sampledDiffuseColor;
   #endif`);
 };
 material.customProgramCacheKey=()=> 'fright-unique-melting-paint-v2';
 return material;
}
export function addCircusCanopy(scene){
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#b8a477';ctx.fillRect(0,0,512,512);for(let x=0;x<512;x+=128){ctx.fillStyle='#823b32';ctx.fillRect(x,0,64,512);}ctx.strokeStyle='#ead6a133';ctx.lineWidth=1;for(let i=0;i<512;i+=4){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,512);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(512,i);ctx.stroke();}const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(8,3);
 const geo=new THREE.PlaneGeometry(21,21,120,120),pos=geo.attributes.position;
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getY(i),radius=Math.hypot(x,z);const a=Math.atan2(z,x);const height=3.32+1.30*Math.max(0,1-radius/14.8)+.085*Math.sin(a*24)*Math.min(1,radius/4)-.14*Math.sin(radius*.9);pos.setXYZ(i,x+8.4,height,z+8.4);}geo.computeVertexNormals();
 const cloth=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:tex,roughness:1,side:THREE.DoubleSide}));cloth.receiveShadow=true;scene.add(cloth);
 const ropeMat=new THREE.MeshStandardMaterial({color:0x776548,roughness:1});for(let i=0;i<12;i++){const a=i*Math.PI/6;const points=[];for(let j=0;j<=16;j++){const r=j/16*10.45;points.push(new THREE.Vector3(8.4+Math.cos(a)*r,4.60-r*.09-.12*Math.sin(j/16*Math.PI),8.4+Math.sin(a)*r));}scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,.019,5,false),ropeMat));}
 return cloth;
}
export function addMirrors(scene){
 const mirrors=[],touch=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0;
 // Each backs onto an existing wall. No mirror occupies a navigable passage.
 const specs=[{id:'stretch',name:'THE LONG LOOK',x:-1.92,z:4.2,rot:Math.PI/2,mode:0,color:0x733c36},{id:'wide',name:'THE BROAD SMILE',x:12.6,z:-1.92,rot:0,mode:1,color:0x2d6365},{id:'ripple',name:'THE CROOKED TRUTH',x:8.4,z:18.72,rot:Math.PI,mode:2,color:0x695a79}];
 const frameMat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.75});
 for(const s of specs){const root=new THREE.Group();root.position.set(s.x,0,s.z);root.rotation.y=s.rot;scene.add(root);
  const box=(w,h,d,c,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),frameMat(c));o.position.set(x,y,z);root.add(o);return o;};
  const paint=frameMat(s.color),brass=frameMat(0xb29355);
  for(const side of [-1,1]){const pts=[];for(let j=0;j<=20;j++){const y=.17+j/20*2.63;pts.push(new THREE.Vector3(side*(.70+.055*Math.sin(y*3.2+s.mode)),y,.03));}root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),32,.087,9,false),paint));for(const y of [.25,1.5,2.71])box(.17,.035,.10,0xb29355,side*.70,y,.055);}
  for(const y of [.16,2.69]){box(1.49,.13,.18,s.color,0,y,0);box(1.34,.027,.02,0xb29355,0,y,.105);}box(1.42,.19,.17,s.color,0,2.83,0);box(1.32,2.40,.05,0x282f2e,0,1.42,-.065);
  const glassGeo=new THREE.PlaneGeometry(1.26,2.38,24,40);const gp=glassGeo.attributes.position;for(let i=0;i<gp.count;i++){const x=gp.getX(i),y=gp.getY(i);gp.setZ(i,s.mode===0?.045*Math.cos(y*2):s.mode===1?.06*Math.cos(x*4):.035*Math.sin(y*5));}glassGeo.computeVertexNormals();
  const shader={...Reflector.ReflectorShader,uniforms:THREE.UniformsUtils.clone(Reflector.ReflectorShader.uniforms)};shader.uniforms.warpMode={value:s.mode};
  shader.vertexShader=shader.vertexShader.replace('varying vec4 vUv;','varying vec4 vUv;\nvarying vec2 panelUv;').replace('vUv = textureMatrix * vec4( position, 1.0 );','vUv = textureMatrix * vec4( position, 1.0 );\n panelUv = uv;');
  shader.fragmentShader=shader.fragmentShader.replace('varying vec4 vUv;','varying vec4 vUv;\nvarying vec2 panelUv;\nuniform float warpMode;').replace('vec4 base = texture2DProj( tDiffuse, vUv );',`vec2 reflected = vUv.xy / vUv.w; vec2 local = panelUv - 0.5;
   if(warpMode < 0.5){ reflected.y -= local.y * 0.13; reflected.x += local.x * 0.045; }
   else if(warpMode < 1.5){ reflected.x -= local.x * 0.14; reflected.y += local.y * 0.035; }
   else { reflected.x += sin(panelUv.y * 18.85) * 0.028; reflected.y += sin(panelUv.x * 12.56) * 0.013; }
   vec4 base = texture2D(tDiffuse, clamp(reflected, vec2(0.002), vec2(0.998)));`);
  const mirror=new Reflector(glassGeo,{color:0x999b92,textureWidth:touch?384:768,textureHeight:touch?768:1024,clipBias:.006,multisample:0,shader});mirror.position.set(0,1.42,.055);mirror.userData={id:s.id,mode:s.mode,updates:0};root.add(mirror);mirrors.push(mirror);
  // All mirrors render the real maze. Hide the other reflective surfaces during each
  // offscreen pass to prevent recursive mirrors and unbounded mobile rendering cost.
  const original=mirror.onBeforeRender;mirror.onBeforeRender=function(renderer,world,camera){if(!mirror.userData.refresh)return;const other=mirrors.filter(m=>m!==mirror).map(m=>[m,m.visible]);other.forEach(([m])=>m.visible=false);try{original.call(this,renderer,world,camera);mirror.userData.updates++;}finally{other.forEach(([m,v])=>m.visible=v);}};
 }
 const frustum=new THREE.Frustum(),projection=new THREE.Matrix4(),pos=new THREE.Vector3(),normal=new THREE.Vector3(),delta=new THREE.Vector3();
 mirrors.updateForCamera=camera=>{camera.updateMatrixWorld();scene.updateMatrixWorld(true);frustum.setFromProjectionMatrix(projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));let nearest=null,best=Infinity;for(const m of mirrors){m.userData.refresh=false;m.getWorldPosition(pos);delta.copy(camera.position).sub(pos);normal.set(0,0,1).transformDirection(m.matrixWorld);const distance=delta.length();if(distance<14&&delta.dot(normal)>0&&frustum.intersectsObject(m)&&distance<best){best=distance;nearest=m;}}if(nearest)nearest.userData.refresh=true;};
 return mirrors;
}
