import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/telemetry-fixture.html',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>Renderer accounting fixture</title>'}));
 await p.goto('http://localhost:8089/two-d/telemetry-fixture.html');
 const results=await p.evaluate(async()=>{
  const t=await import('./runtime-telemetry.js');let state={x:80,y:120,phase:'playing',paused:false};t.configureTelemetry({room:1,state:()=>state,running:()=>true});
  const canvas=()=>document.createElement('canvas');const a=canvas().getContext('2d'),cache=canvas().getContext('2d');cache.fillRect(0,0,2,2);
  function renderer(){const gl=canvas().getContext('webgl2');if(!gl)throw Error('WebGL2 unavailable');const program=gl.createProgram();for(const [type,source]of [[gl.VERTEX_SHADER,'#version 300 es\nvoid main(){gl_Position=vec4(float(gl_VertexID%2)*.5,float(gl_VertexID/2)*.5,0.,1.);}'],[gl.FRAGMENT_SHADER,'#version 300 es\nprecision mediump float;out vec4 c;void main(){c=vec4(1.);}']]){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));gl.attachShader(program,shader);}gl.linkProgram(program);gl.useProgram(program);const indices=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,2,1,3]),gl.STATIC_DRAW);return gl;}
  const gl=renderer(),other=renderer();await new Promise(resolve=>t.whenAssetsReady(resolve));t.markRoomLoaded();
  async function frame(draw){await new Promise(resolve=>{t.requestGameFrame(()=>{draw();queueMicrotask(resolve);});});return structuredClone(__GAME__);}
  const first=await frame(()=>{gl.drawArrays(gl.TRIANGLES,0,6);gl.drawElementsInstanced(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0,3);other.drawArraysInstanced(other.TRIANGLE_STRIP,0,4,2);a.drawImage(cache.canvas,0,0);});
  const cached=await frame(()=>a.drawImage(cache.canvas,0,0));
  const rebuilt=await frame(()=>{cache.fillRect(0,0,1,1);cache.fillRect(1,1,1,1);a.drawImage(cache.canvas,0,0);});
  a.fillRect(0,0,1,1);const between=await frame(()=>a.drawImage(cache.canvas,0,0));
  let coordinator;await new Promise(resolve=>{t.requestGameFrame(()=>a.fillRect(0,0,1,1));t.requestGameFrame(()=>{other.drawArrays(other.TRIANGLES,0,3);queueMicrotask(()=>{coordinator=structuredClone(__GAME__);resolve();});});});
  gl.canvas.dispatchEvent(new Event('webglcontextlost',{bubbles:true}));const failed=await frame(()=>a.fillRect(0,0,1,1));
  return {first,cached,rebuilt,between,coordinator,failed,glErrors:[gl.getError(),other.getError()]};
 });
 assert.deepEqual(results.glErrors,[0,0]);assert.equal(results.first.ready,true);assert.equal(results.first.render.webglDraws,3);assert.equal(results.first.tris,12);assert.equal(results.first.draws,4);assert.equal(results.first.render.initialization.canvasPaints,1);assert.equal(Object.keys(results.first.render.contexts).length,3);
 assert.equal(results.cached.draws,1);assert.equal(results.cached.tris,0);assert.equal(results.rebuilt.draws,3);assert.equal(results.between.draws,2);assert.equal(results.coordinator.draws,2);assert.equal(results.coordinator.tris,1);assert.equal(results.failed.ready,false);assert.ok(results.failed.assets.failures.includes('WebGL context lost'));assert.deepEqual(errors,[]);
 console.log('PASS: multiple renderers, instancing, cache rebuilds/composites, between-frame work, shared frame coordination and renderer failure.');
}finally{await browser.close();}
