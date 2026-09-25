import {createRoomMusic} from './room-music.js';
import {takeInstruction,resetInstructions,readInstructions} from './campaign/instructions.js';
import {resetEvidence} from './campaign/secrets.js';
import {enterRoom,leaveRoom} from './room-flow.js';
import {assistDoor,STREET_DOORS} from './levels/door-assist.js';
import {newConfetti,tickConfetti,drawConfetti} from './levels/street-confetti.js';
import {createRavenSound} from './raven-sound.js';
import {mouthProgress} from './levels/mouth-motion.js';
import {createForecourt} from './forecourt.js';
import {createPropRenderer} from './three-props.js';
import {createToyInspector} from './toy-inspection.js';
import {createInspector} from './inspection.js';
import {newStreet,blocked,move,near,path,tick,INTERACTIONS,NEWSPAPER,wheelAngle,bulbLevel} from './levels/street-model.js';
import {drawPlayer} from './levels/temporary-player.js';
import {newCampaign,remember,once,openDoor,enterDoor,checkpoint,saveCampaign,loadCampaign} from './campaign/state.js';
const $=q=>document.querySelector(q),canvas=$('#game'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
const bg=new Image();bg.src='./assets/street-gate-clear.png';
const props=createPropRenderer(),ravenSound=createRavenSound();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const storageKey='fright-house-2d-campaign-v1';
let forecourt=null,confetti=newConfetti();
let s=newStreet(),campaign=newCampaign(),ready=false,running=false,paused=false,muted=false,dialog=null,last=performance.now(),route=[],pending=null,keys=new Set();
const sound={music:createRoomMusic(1),mechanism:new Audio('../audio/wall.mp3'),gateClose:new Audio('../audio/wall.mp3')};sound.music.loop=true;sound.music.volume=.18;sound.music.preload='none';sound.mechanism.volume=.22;sound.gateClose.volume=.58;sound.gateClose.preload='auto';const resumeSounds=new Set();
const inspector=createInspector({onClose(){dialog=null;release();$('#dialog').hidden=true;}});
const toyInspector=createToyInspector({isMuted:()=>muted,onClose(){dialog=null;release();},onDiscover(){s.toy=true;s.toyBroken=false;takeInstruction('carousel');remember(campaign,'windup-mark','Platform I: Two feed pumps. One drive tooth. Keep the vent closed.');persist();}});
function inspect(id,name){release();dialog={name,type:'inspection'};$('#dialog').hidden=true;inspector.open(id);}
function play(id){if(muted||paused)return;const a=sound[id];if(!a.loop)a.currentTime=0;a.play().catch(()=>{});}
function stop(){ravenSound.reset();resumeSounds.clear();for(const a of Object.values(sound)){a.pause();a.currentTime=0;}}
function persist(){campaign.street=structuredClone(s);checkpoint(campaign);try{localStorage.setItem(storageKey,saveCampaign(campaign));}catch{/* Storage is optional; the level remains playable. */}}
function hallSave(){try{return loadCampaign(localStorage.getItem(storageKey))?.area==='ticket-hall';}catch{return false;}}
function saved(){try{const c=loadCampaign(localStorage.getItem(storageKey));if(!c||c.area!=='street'||!c.street)return null;const t=c.street;if(!Number.isFinite(t.x)||!Number.isFinite(t.y)||!Number.isFinite(t.time)||t.time<0||t.phase!=='street'||!Number.isFinite(t.gateProgress)||t.gateProgress<0||t.gateProgress>1)return null;const initial=newStreet(),value={...initial,...t};const progressed=Math.hypot(value.x-initial.x,value.y-initial.y)>1||['newspaper','notices','ticket','toy','stall','gate'].some(id=>value[id])||c.journal.length>0||c.events.length>0;if(!progressed)return null;return blocked(value.x,value.y,value)?null:{campaign:c,street:value};}catch{return null;}}
function release(){keys.clear();route=[];pending=null;document.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
function start(resume=false){if(!ready)return;if(!resume&&!running){resetEvidence();resetInstructions();}inspector.close();toyInspector.close();stop();const previous=resume?saved():null;s=previous?.street||newStreet();confetti=newConfetti();campaign=previous?.campaign||newCampaign();campaign.paused=false;campaign.story=null;running=true;paused=false;dialog=null;release();$('#dialog').hidden=true;$('#veil').hidden=true;$('#stage').classList.remove('completed');$('#pause').textContent='PAUSE';canvas.focus({preventScroll:true});ravenSound.unlock();play('music');persist();}
function say(name,text,type='normal',headline=''){release();dialog={name,type};$('#speaker').textContent=name;$('#line').textContent=text;$('#headline').textContent=headline;$('#headline').hidden=!headline;$('#portrait').textContent=type==='paper'?'▤':name==='FIELD NOTES'?'✎':'…';$('#dialog').classList.toggle('paper',type==='paper');$('#dialog').hidden=false;}
function dismiss(){if(toyInspector.active){toyInspector.close();return;}if(inspector.active){inspector.close();return;}if(paused)return;dialog=null;$('#dialog').hidden=true;}
function pause(){if(!running)return;paused=!paused;campaign.paused=paused;release();$('#pause').textContent=paused?'RESUME':'PAUSE';if(paused){ravenSound.pause();for(const [id,a]of Object.entries(sound)){if(!a.paused)resumeSounds.add(id);a.pause();}}else{ravenSound.resume();for(const id of resumeSounds)if(!muted)sound[id].play().catch(()=>{});resumeSounds.clear();}}
function journal(){if(!running||paused)return;if(dialog){dismiss();return;}say('FIELD NOTES',campaign.journal.length?campaign.journal.map(n=>n.text).join('\n\n'):'No discoveries yet. The bench and noticeboard are worth a look.');}
function finish(){s.phase='entering';s.entryTime=0;release();play('gateClose');once(campaign,'street-complete');}
function enterHall(){s.phase='complete';enterDoor(campaign,'street-hall');campaign.paused=false;campaign.story=null;persist();stop();leaveRoom('./level-2.html?arrival=mouth');}
function interact(targetId=null){if(!running||paused||s.phase==='entering')return;if(dialog){dismiss();return;}const o=typeof targetId==='string'?INTERACTIONS.find(o=>o.id===targetId&&Math.hypot(o.x-s.x,o.y-s.y)<o.r):near(s);if(!o)return;release();
  if(o.id==='newspaper'){s.newspaper=true;remember(campaign,'park-newspaper','PARK CLOSED AFTER CHILDREN VANISH — a witness saw lights inside after midnight. The clipping is dated October 19, 1987.');inspect('newspaper',NEWSPAPER.title);}
  if(o.id==='notices'){s.notices=true;remember(campaign,'missing-notices','Three missing-child notices name Fright House as the last known location.');say('MISSING · THREE CHILDREN','Three faded photographs. All three children were last seen here.');}
  if(o.id==='ticket'){s.ticket=true;remember(campaign,'street-ticket','An admission ticket stamped OCT 17, 1987 lies outside the supposedly closed park.');dialog={name:'AN ADMISSION TICKET',type:'3d'};toyInspector.open(true,'ticket');}
  if(o.id==='toy'){dialog={name:'WIND-UP CAROUSEL',type:'3d'};toyInspector.open(s.toy&&readInstructions().includes('carousel'),'toy',false);}
  if(o.id==='stall'){s.stall=true;remember(campaign,'shuttered-stall','The prize stall is locked. Something rattles behind its shutter, but nobody answers.');play('mechanism');say('BEHIND THE SHUTTER','You tug the shutter. It scrapes upward, then jams.\n\nDusty shelves. Empty hooks. A soft rattle from deeper inside—but nobody answers.');}
  if(o.id==='entrance'){if(!s.gate){s.gate=true;openDoor(campaign,'street-hall');play('mechanism');}else if(s.gateProgress>=1){say('THE TURNSTILE','The broken arm gives way. Walk through the clown’s mouth.');}}
  persist();
}
$('#start').onclick=()=>start();$('#resume').onclick=()=>{if(hallSave())leaveRoom('./level-2.html?arrival=resume');else start(true);};$('#retry').onclick=()=>start();$('#pause').onclick=pause;$('#continue').onclick=dismiss;$('#action').onclick=interact;$('#journal').onclick=journal;$('#light').onclick=()=>{if(running&&!paused&&!dialog)s.light=!s.light;};$('#sound').onclick=()=>{muted=!muted;ravenSound.mute(muted);for(const a of Object.values(sound)){a.muted=muted;if(!muted&&running&&!paused&&a.loop)a.play().catch(()=>{});}$('#sound').textContent=muted?'SOUND OFF':'SOUND ON';$('#sound').setAttribute('aria-label',muted?'Unmute sound':'Mute sound');};
window.addEventListener('keydown',e=>{if(toyInspector.active){if(['e','E'].includes(e.key)&&!e.repeat){e.preventDefault();toyInspector.close();}return;}if(inspector.active){if(['e','E'].includes(e.key)&&!e.repeat){e.preventDefault();inspector.close();}return;}if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(e.repeat)return;if(e.key==='Escape'){pause();return;}if(['e','E',' '].includes(e.key)){interact();return;}if(e.key.toLowerCase()==='j'){journal();return;}if(e.key.toLowerCase()==='f'){$('#light').click();return;}keys.add(e.key.toLowerCase());route=[];pending=null;});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{release();if(running&&!paused)pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)pause();});
for(const b of document.querySelectorAll('[data-key]')){b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key.toLowerCase());route=[];pending=null;b.classList.add('held');};for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>{keys.delete(b.dataset.key.toLowerCase());b.classList.remove('held');});}
canvas.onpointerdown=e=>{if(!running||paused||dialog||s.phase==='entering')return;const r=canvas.getBoundingClientRect(),p={x:(e.clientX-r.left)*480/r.width,y:(e.clientY-r.top)*360/r.height};
  // Click targets include the visible bench paper and noticeboard, rather than
  // requiring the player to click their adjacent walkable interaction points.
  let target=INTERACTIONS.find(o=>Math.hypot(p.x-o.x,p.y-o.y)<12);
  if(p.x>35&&p.x<88&&p.y>222&&p.y<259)target=INTERACTIONS[0];
  if(p.x>61&&p.x<115&&p.y>192&&p.y<229)target=INTERACTIONS[1];
  if(p.x>378&&p.x<478&&p.y>167&&p.y<239)target=INTERACTIONS.find(o=>o.id==='stall');
  if(p.x>293&&p.x<323&&p.y>248&&p.y<278)target=INTERACTIONS.find(o=>o.id==='toy');
  if(p.x>221&&p.x<257&&p.y>112&&p.y<153)target=s.gate&&p.y<140?null:INTERACTIONS.find(o=>o.id==='entrance');
  const aim=target||p;route=path(s,aim.x,aim.y);pending=target?.id||null;if(target&&Math.hypot(s.x-target.x,s.y-target.y)<target.r)interact(target.id);
};
const bulbs=[[174,24,'#e45231'],[199,17,'#edb356'],[225,11,'#e35938'],[257,12,'#39bf67'],[280,17,'#eaa747'],[304,28,'#448bdf'],[47,173,'#d7402e'],[30,179,'#d5a744'],[80,167,'#39a66a'],[144,184,'#d54632'],[329,184,'#d49c43'],[348,190,'#397fd5'],[166,286,'#d9ab55'],[316,286,'#d9ab55'],[152,91,'#d9a452'],[327,86,'#d49a43']];
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function line(x1,y1,x2,y2,color,w=1){ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(Math.round(x1),Math.round(y1));ctx.lineTo(Math.round(x2),Math.round(y2));ctx.stroke();}
function ferris(){const cx=43,cy=46,r=34,angle=wheelAngle(s.time*(reduced?.3:1));ctx.save();ctx.beginPath();ctx.moveTo(12,4);ctx.lineTo(71,4);ctx.lineTo(82,20);ctx.lineTo(79,51);ctx.lineTo(64,73);ctx.lineTo(59,82);ctx.lineTo(10,82);ctx.closePath();ctx.clip();ctx.globalAlpha=.75;line(cx-19,86,cx,cy,'#293838',2);line(cx+19,86,cx,cy,'#263634',2);ctx.strokeStyle='#3f4841';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#34403c';ctx.beginPath();ctx.arc(cx,cy,r-2,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<12;i++){const a=angle+i*Math.PI/6,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;line(cx,cy,x,y,'#35413e');line(cx+Math.cos(a+.19)*5,cy+Math.sin(a+.19)*5,x,y,'#243431');line(x,y,x,y+3,'#516052');rect(x-2,y+3,5,4,'#35453e');rect(x-1,y+4,3,2,'#617064');if(i%3===0){ctx.globalAlpha=.3+.2*Math.sin(s.time*.7+i);rect(x,y,1,2,['#c3904d','#ab6144','#739783','#677f98'][i/3]);ctx.globalAlpha=.75;}}
  rect(cx-2,cy-2,4,4,'#485749');ctx.restore();
}
function lighting(){for(let i=0;i<bulbs.length;i++){const [x,y,color]=bulbs[i],level=bulbLevel(s.time,i,reduced);ctx.save();ctx.globalCompositeOperation='multiply';ctx.fillStyle=`rgba(20,30,26,${(1-level)*.55})`;ctx.beginPath();ctx.ellipse(x,y,3.5,5,0,0,Math.PI*2);ctx.fill();ctx.restore();ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=level*.55;const glow=ctx.createRadialGradient(x,y,0,x,y,13);glow.addColorStop(0,color+'cc');glow.addColorStop(1,color+'00');ctx.fillStyle=glow;ctx.fillRect(x-13,y-13,26,26);rect(x-1,y-2,2,4,color);rect(x,y-1,1,2,'#ffdf9c');ctx.restore();}}
const fog=document.createElement('canvas');fog.width=160;fog.height=60;const fg=fog.getContext('2d');for(let i=0;i<7;i++){const x=18+i*21,y=25+Math.sin(i*3)*9,g=fg.createRadialGradient(x,y,2,x,y,28);g.addColorStop(0,'#a8b5a633');g.addColorStop(1,'#a8b5a600');fg.fillStyle=g;fg.fillRect(x-28,y-28,56,56);}
function fogLayer(){ctx.save();ctx.globalAlpha=.22;for(let i=0;i<4;i++){const drift=reduced?0:Math.sin(s.time*.06+i)*42;ctx.drawImage(fog,-70+i*138+drift,235+Math.sin(i)*27,240,65);}ctx.restore();}
function paper(){ctx.save();ctx.translate(63,242);ctx.rotate(-.25);rect(-8,-4,18,11,'#392e21aa');rect(-9,-5,18,10,'#c0ac79');rect(-8,-4,16,2,'#4c4030');line(0,-1,0,4,'#776243');for(let j=0;j<3;j++){rect(-7,-1+j*2,6,1,'#796647');rect(2,-1+j*2,5,1,'#796647');}ctx.restore();}
function flashlight(){if(!s.light)return;const a={up:-Math.PI/2,down:Math.PI/2,left:Math.PI,right:0}[s.face],x=s.x,y=s.y-9;ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(x,y,2,x,y,73);g.addColorStop(0,'#bda05c35');g.addColorStop(1,'#bda05c00');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,73,a-.38,a+.38);ctx.closePath();ctx.fill();ctx.restore();}
function render(){ctx.clearRect(0,0,480,360);if(ready)ctx.drawImage(bg,0,0,480,360);ferris();forecourt?.draw(ctx,s,false);lighting();drawConfetti(ctx,confetti,false);props.draw(ctx,'ticket');props.draw(ctx,'toy',s.toy?1:0);if(s.y>=150)props.draw(ctx,'gate',s.gateProgress);if(running||s.phase==='complete'){ctx.save();if(s.phase==='entering')ctx.globalAlpha=Math.max(0,1-s.entryTime/.65);drawPlayer(ctx,s,s.moving&&!paused&&!dialog);if(s.phase!=='entering')flashlight();ctx.restore();}forecourt?.draw(ctx,s,true);drawConfetti(ctx,confetti,true);paper();if(s.phase==='entering'){props.draw(ctx,'mouth',mouthProgress(s.entryTime));}props.drawRavens(ctx,s.ravens);if(s.y<150)props.draw(ctx,'gate',s.gateProgress);fogLayer();
  if(route.length){const p=route.at(-1);ctx.strokeStyle='#d8c69888';ctx.beginPath();ctx.ellipse(p.x,p.y,4,2,0,0,Math.PI*2);ctx.stroke();}
  if(s.phase==='entering'){ctx.fillStyle=`rgba(3,5,5,${Math.max(0,(s.entryTime-1.8)/.8)})`;ctx.fillRect(0,0,480,360);}
  if(paused){ctx.fillStyle='#080e0cc9';ctx.fillRect(0,0,480,360);ctx.fillStyle='#d9c49d';ctx.font='16px monospace';ctx.textAlign='center';ctx.fillText('PAUSED',240,176);ctx.textAlign='left';}
  const n=near(s);$('#hint').textContent=running&&!dialog&&!paused?(n?.id==='entrance'&&s.gate?'WALK THROUGH · the turnstile':n?.id==='newspaper'&&s.newspaper?'READ · saved newspaper clipping':n?.label||''):'';
  $('#count').textContent=`FIELD NOTES ${campaign.journal.length}/5`;$('#objective').textContent=s.phase==='entering'?'You can’t get out now.':s.gate?'Walk through the broken turnstile into the funhouse.':s.newspaper?'Someone saw lights after closing. Find the entrance.':'The newspaper on the bench may explain why the park closed.';
}
function frame(now){const dt=Math.min(.04,(now-last)/1000);last=now;if(running&&!paused&&!dialog){if(s.phase==='entering'){s.entryTime+=dt;s.y=Math.max(115,s.y-dt*20);tick(s,dt);if(s.entryTime>=2.7){enterHall();return;}}else{let dx=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft')),dy=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'));
  if(!dx&&!dy&&route.length){dx=route[0].x-s.x;dy=route[0].y-s.y;if(Math.hypot(dx,dy)<2){route.shift();dx=dy=0;}}
  if(!route.length){const guided=assistDoor(s,{up:dy<0,down:dy>0,left:dx<0,right:dx>0},STREET_DOORS,path);if(guided.target){dx=guided.target.x-s.x;dy=guided.target.y-s.y;}}
  move(s,dx,dy,Math.min(dt,Math.hypot(dx,dy)/65));tick(s,dt);tickConfetti(confetti,s,dt,reduced);ravenSound.update(s.ravens);campaign.elapsed+=dt;
  if(!route.length&&pending){interact(pending);pending=null;}
  if(s.gateProgress>=1&&s.y<138){persist();finish();}
}}render();requestAnimationFrame(frame);}
bg.onload=()=>{forecourt=createForecourt(bg);ready=true;$('#start').disabled=false;$('#start').textContent='BEGIN INVESTIGATION';$('#resume').hidden=!saved()&&!hallSave();};bg.onerror=()=>{$('#start').textContent='BACKGROUND FAILED — RELOAD';};
Object.defineProperty(window,'fright2d',{get:()=>JSON.parse(JSON.stringify({...s,area:'street',confetti:{count:confetti.length,airborne:confetti.filter(p=>p.age>0).length},running,paused,dialog:dialog?.name||null,inspection:inspector.snapshot(),toyInspection:toyInspector.snapshot(),props3d:props.snapshot(),mouthClosure:s.phase==='entering'?mouthProgress(s.entryTime):0,foreground:forecourt?.snapshot(),ready,near:near(s)?.id||null,route:route.length,notes:campaign.journal.map(n=>n.id),wheelAngle:wheelAngle(s.time*(reduced?.3:1)),bulbs:bulbs.map((_,i)=>bulbLevel(s.time,i,reduced)),ravenAudio:ravenSound.snapshot(),audio:Object.fromEntries(Object.entries(sound).map(([id,a])=>[id,{paused:a.paused,time:a.currentTime,readyState:a.readyState,error:a.error?.code||null}]))}))});requestAnimationFrame(frame);
