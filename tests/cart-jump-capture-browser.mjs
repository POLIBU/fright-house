import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.GAME_URL||'http://localhost:8089/two-d',out=process.env.PLAYTEST_OUT||'validation/cart-jump-capture';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{for(const mobile of [false,true]){
 const p=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1100,height:1000},isMobile:mobile,hasTouch:mobile}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/level-11.html');await p.waitForFunction(()=>window.frightFinale?.running&&frightFinale.phase==='ride');
 const jump=()=>mobile?p.locator('#action').tap():p.keyboard.press('Space');
 await jump();await p.waitForFunction(()=>frightFinale.jumpAge>.49&&frightFinale.jumpAge<.6);await jump();
 await p.waitForFunction(()=>frightFinale.jumps===2,{},{timeout:1500});
 await p.waitForFunction(()=>frightFinale.jumpZ>20);await p.locator('#stage').screenshot({path:out+`/second-jump-${mobile?'mobile':'desktop'}.png`});
 await p.waitForFunction(()=>frightFinale.jumpAge===0);await jump();assert.equal(await p.evaluate(()=>frightFinale.jumps),3);
 // Deliberately stop dodging: the normal hazards slow the cart until the monster catches it.
 await p.waitForFunction(()=>frightFinale.phase==='caught',{},{timeout:45000});
 await p.waitForFunction(()=>frightFinale.age>.77);
 const caught=await p.evaluate(()=>frightFinale);assert.ok(Math.abs(caught.spider.x-(caught.cart.x+caught.cart.lane))<.01);assert.ok(Math.abs(caught.spider.y-(caught.cart.y-6))<.01);assert.equal(caught.jumpZ,0);
 await p.locator('#game').screenshot({path:out+`/enclosed-cart-${mobile?'mobile':'desktop'}.png`});
 await p.waitForFunction(()=>!document.querySelector('#veil').hidden);assert.match(await p.locator('#veil h1').innerText(),/FEEDING/);
 if(mobile)await p.locator('#start').tap();else await p.locator('#start').click();await p.waitForFunction(()=>frightFinale.phase==='ride');assert.equal(await p.evaluate(()=>frightFinale.jumps),0);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({mobile,passed:true,catchAge:caught.age,catchX:caught.spider.x,cartX:caught.cart.x+caught.cart.lane,errors}));await p.close();
}}finally{await browser.close();}
