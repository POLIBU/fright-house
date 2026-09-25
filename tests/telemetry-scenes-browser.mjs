import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {observer} from './telemetry-observer.mjs';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const base=process.env.GAME_URL||'http://localhost:8089/two-d',out=process.env.PLAYTEST_OUT||'validation/telemetry';await fs.mkdir(out,{recursive:true});
const cases=[
 [1,'street','carousel-inspection',"toyInspector.open(false,'toy');"],
 [3,'platform','power-inspection',"s.inspection='power';"],
 [3,'platform','upper-crusher',"s=newPlatform(3);s.floorTime=1.4;"],
 [3,'platform','platform-hazards',"s=newPlatform(2);s.floorTime=5;"],
 [4,'toystore','rabbit-inspection',"s.inspection=true;s.musicExamined=true;"],
 [4,'toystore','toys-awake',"s.phase='chase';s.phaseAge=2;s.lights=0;"],
 [5,'library','phone-inspection',"s.inspection=true;s.phoneExamined=true;"],
 [5,'library','library-chase',"s.phase='chase';s.phaseAge=8;s.jar=1;s.phoneAnswered=true;s.x=860;s.cameraX=640;s.worm.phase='chase';s.worm.x=730;"],
 [6,'barrel','wheel-inspection',"s.x=WHEEL.x;s.y=WHEEL.y;inspect();"],
 [6,'barrel','rolling-barrels',"for(let i=0;i<300;i++)tickBarrelRun(s,{},.04);"],
 [7,'mezzanine','second-lever',"s.x=CONSOLES[1].x;s.y=CONSOLES[1].y;s.stage=1;inspect();"],
 [7,'mezzanine','moving-floor-steam',"s.x=420;s.y=228;s.stage=1;s.time=1.2;"],
 [8,'workshop','rig-rising',"s.age=8.5;"],
 [8,'workshop','boss-radial-attack',"s.phase='fight';s.age=12;s.fork=true;s.x=210;s.y=380;s.boss.phase=2;s.boss.mode='charge';s.boss.age=.6;s.boss.targetX=s.x;s.boss.targetY=s.y;"],
 [9,'fall','falling-machinery',"s.phase='fall';s.age=3;s.y=1170;s.cameraY=970;s.vy=170;"],
 [9,'fall','bone-landing',"s.phase='landing';s.landAge=.2;s.y=SHAFT.landing;s.cameraY=SHAFT.landing-200;"],
 [10,'finale','gallery-middle',"s.phase='flee';s.x=240;s.y=729;s.cameraY=489;"],
 [11,'finale','late-cart-attacks',"s.rideAge=55;s.speed=210;s.cart.y=3500;s.spiderActive=true;s.spider.y=3680;s.broodClock=0;s.inkClock=0;s.cameraY=3275;"],
 [12,'epilogue','police-evidence',"s=newEpilogue([],'arrest');s.phase='cuff';s.age=1.4;"],
 [12,'epilogue','police-escort',"s=newEpilogue([],'arrest');s.phase='escort';s.age=1;"],
 [12,'epilogue','police-ending',"s=newEpilogue([],'arrest');s.phase='complete';"],
 [12,'epilogue','bedroom-lamp',"s=newEpilogue([],'bedroom');s.age=16;"],
 [12,'epilogue','bedroom-ending',"s=newEpilogue([],'bedroom');s.phase='complete';"]
];
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),results=[];
try{for(const mobile of [false,true])for(const [room,module,name,setup]of cases){const p=await b.newPage({viewport:mobile?{width:390,height:844}:{width:1100,height:1000},isMobile:mobile,hasTouch:mobile}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});await p.addInitScript(observer);
 // Browser-only scene fixtures: no fixture hooks are shipped in the game.
 await p.route(new RegExp('/'+module+'\\.js(?:\\?.*)?$'),async r=>{const response=await r.fetch();await r.fulfill({response,body:await response.text()+`\nwindow.__prepareScene=()=>{${setup}resetTelemetryMotion();};`});});
 await p.goto(base+'/'+(room===1?'index.html':`level-${room}.html`));await p.waitForFunction(()=>__READY__);if(room===1){if(mobile)await p.locator('#start').tap();else await p.locator('#start').click();}
 await p.evaluate(()=>{__audit.samples.length=0;__prepareScene();});await p.waitForTimeout(1200);const a=await p.evaluate(()=>({audit:__audit,g:__GAME__}));assert.deepEqual(errors,[],name);assert.deepEqual(a.audit.mismatches,[],name);assert.equal(a.g.ready,true,name);if(name.endsWith('ending'))assert.equal(a.g.over,true,name);
 await p.screenshot({path:`${out}/${name}-${mobile?'mobile':'desktop'}.png`});const samples=a.audit.samples,result={name,room,mobile,fixture:true,frames:samples.length,peakDraws:Math.max(...samples.map(s=>s.draws)),peakTriangles:Math.max(...samples.map(s=>s.tris)),independentCountsMatch:true};results.push(result);console.log(JSON.stringify(result));await p.close();}
}finally{await b.close();await fs.writeFile(out+'/scenes.json',JSON.stringify(results,null,2));}
