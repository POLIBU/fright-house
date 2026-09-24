import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import {pathfind,cellAt,point,GATES,POWER_GATES} from '../src/model.js';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1100,height:760}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>window.__GAME__);const wait=ms=>page.waitForTimeout(ms);const norm=a=>Math.atan2(Math.sin(a),Math.cos(a));
async function hold(k,ms){await page.keyboard.down(k);await wait(ms);await page.keyboard.up(k);await wait(35);}
async function face(x,z,y=1.65){for(let i=0;i<12;i++){const s=await state();const desired=Math.atan2(-(x-s.pos[0]),-(z-s.pos[1]));const d=norm(desired-s.yaw);if(Math.abs(d)<.025)break;await hold(d>0?'ArrowLeft':'ArrowRight',Math.max(16,Math.min(650,Math.abs(d)/1.75*1000)));}const s=await state(),pitch=Math.atan2(y-1.65,Math.hypot(x-s.pos[0],z-s.pos[1])),d=pitch-s.pitch;if(Math.abs(d)>.03)await hold(d>0?'PageUp':'PageDown',Math.abs(d)*1000);}
async function move(x,z,tol=.13){for(let i=0;i<65;i++){const s=await state(),dist=Math.hypot(s.pos[0]-x,s.pos[1]-z);if(s.over)throw Error('Caught before reaching '+x+','+z);if(dist<tol)return;await face(x,z);await hold('KeyW',Math.min(450,Math.max(30,(dist-.06)/2.15*1000)));}throw Error('Movement stalled '+JSON.stringify(await state())+' target '+x+','+z);}
async function route(node){let s=await state();const start=cellAt(...s.pos),p=pathfind(start,node,s.gates);assert.ok(p.length,'route exists');for(const n of p){const t=point(n);await move(t.x,t.z,.18);}}
async function use(id,x,z,y=1.3){await face(x,z,y);await wait(100);let s=await state();assert.equal(s.near,id,`looking at ${id}, instead ${s.near}; ${JSON.stringify(s.pos)}`);await page.keyboard.press('KeyE');await wait(100);}
async function close(){await page.click('#close-dialog');await wait(100);}
try{
await page.goto(process.env.GAME_URL || 'http://localhost:8087');await page.waitForFunction(()=>window.__READY__===true);await page.click('#begin');await wait(100);
for(const [id,node] of [['bag','1,1']]){await route(node);const p=point(node);await use(id,p.x,p.z+1.60,1.28);assert.equal((await state()).dialog,'evidence');assert.equal((await state()).evidenceVisible[id],false);assert.equal(await page.locator('#evidence-count').innerText(),'1 / 3');await page.screenshot({path:'validation/art/clue-paper.png'});await close();assert.equal((await state()).near,null);await page.screenshot({path:'validation/art/collected.png'});}
await page.reload();await page.waitForFunction(()=>window.__READY__);await page.click('#begin');await wait(150);assert.equal(await page.locator('#evidence-count').innerText(),'0 / 3');assert.ok(Object.values((await state()).evidenceVisible).every(Boolean));assert.deepEqual(errors,[]);console.log('PASS: collection removes prop and prompt, updates top counter; new game restores evidence');
}catch(e){await page.screenshot({path:'validation/playthrough-failure.png'});console.error(e);console.error(await state());process.exitCode=1;}finally{await browser.close();}
