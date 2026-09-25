import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';import assert from 'node:assert/strict';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{for(const mobile of [false,true]){const p=await b.newPage({viewport:mobile?{width:390,height:844}:{width:1100,height:900},isMobile:mobile,hasTouch:mobile}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:8089/two-d/level-11.html');await p.waitForFunction(()=>frightFinale?.running);
 const cdp=mobile?await p.context().newCDPSession(p):null;let r;
 async function down(dir){if(mobile){await p.locator('#touch-joystick').scrollIntoViewIfNeeded();r=await p.locator('#touch-joystick').boundingBox();const dx=dir==='right'?40:dir==='left'?-40:0,dy=dir==='down'?40:dir==='up'?-40:0;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x+66+dx,y:r.y+66+dy,id:1}]});}else await p.keyboard.down('Arrow'+dir[0].toUpperCase()+dir.slice(1));}
 async function up(dir,cancel=false){if(mobile)await cdp.send('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});else await p.keyboard.up('Arrow'+dir[0].toUpperCase()+dir.slice(1));}
 await p.waitForTimeout(300);assert.ok(await p.evaluate(()=>frightFinale.cart.distance>0));
 await down('left');await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>frightFinale.queued),'left');await up('left');const moved=await p.evaluate(()=>frightFinale.cart.distance);await p.waitForTimeout(150);assert.ok(await p.evaluate(()=>frightFinale.cart.distance)>moved);assert.equal(await p.evaluate(()=>frightFinale.queued),null);
 await down('right');await p.waitForTimeout(100);await up('right',true);const cancelled=await p.evaluate(()=>frightFinale.cart.distance);await p.waitForTimeout(150);assert.ok(await p.evaluate(()=>frightFinale.cart.distance)>cancelled);
 assert.equal(await p.evaluate(()=>frightFinale.cart.dir),'up');assert.ok(await p.evaluate(()=>frightFinale.cart.lane<20));
 if(mobile)await p.locator('#action').tap();else await p.keyboard.press('Space');assert.ok(await p.evaluate(()=>frightFinale.jumps>0));
 assert.deepEqual(errors,[]);console.log((mobile?'Mobile joystick':'Desktop keyboard')+': automatic start, screen-space steering, release/cancel keeps driving, no direction reversal and jump pass.');await p.close();}
}finally{await b.close();}
