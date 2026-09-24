import * as THREE from 'three';
// The world is rendered at a deliberately low resolution. DOM text and controls stay sharp.
export function createPixelRenderer(renderer,{enabled=true}={}){
 const target=new THREE.WebGLRenderTarget(240,160,{type:THREE.HalfFloatType,minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,depthBuffer:true});target.texture.generateMipmaps=false;
 const uniforms={sceneMap:{value:target.texture},resolution:{value:new THREE.Vector2(240,160)},clock:{value:0}};
 const material=new THREE.ShaderMaterial({uniforms,depthTest:false,depthWrite:false,vertexShader:'varying vec2 screenUv;void main(){screenUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`
 varying vec2 screenUv;uniform sampler2D sceneMap;uniform vec2 resolution;uniform float clock;
 vec3 displayColor(vec2 uv){return linearToOutputTexel(vec4(toneMapping(texture2D(sceneMap,uv).rgb),1.)).rgb;}
 float noise(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec2 uv=screenUv;vec3 original=displayColor(uv);vec2 pixel=floor(uv*resolution);float d=(mod(pixel.x,2.)+mod(pixel.y,2.)*2.)/4.-.375;vec3 color=floor(clamp(original+d/15.,0.,1.)*15.+.5)/15.;vec3 right=displayColor(uv+vec2(1./resolution.x,0.)),up=displayColor(uv+vec2(0.,1./resolution.y));float edge=smoothstep(.11,.38,length(original-right)+length(original-up));color*=1.-edge*.43;color+=(noise(pixel+floor(clock*8.))-.5)*.014;gl_FragColor=vec4(clamp(color,0.,1.),1.);}
 `});
 const scene=new THREE.Scene(),camera=new THREE.Camera();scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));
 function resize(w,h){const scale=160/Math.min(w,h);const width=Math.max(120,Math.min(640,Math.round(w*scale))),height=Math.max(120,Math.min(480,Math.round(h*scale)));target.setSize(width,height);uniforms.resolution.value.set(width,height);}
 resize(innerWidth,innerHeight);
 return {resize,render(world,view,time){uniforms.clock.value=time;if(!enabled){renderer.setRenderTarget(null);renderer.render(world,view);return;}renderer.setRenderTarget(target);renderer.render(world,view);renderer.setRenderTarget(null);renderer.render(scene,camera);},state:()=>({style:enabled?'fake-2d':'smooth',internalResolution:[target.width,target.height],paletteLevels:enabled?16:null}),dispose(){target.dispose();material.dispose();}};
}
