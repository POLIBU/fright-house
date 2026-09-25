// Translate a real finger drag into the same directional input used by each room.
export function installTouchJoystick(){
 const nav=document.querySelector('#touch');if(!nav)return;
 const mobile=matchMedia('(any-pointer: coarse), (max-width: 650px)');
 const directions=[...nav.querySelectorAll('[data-key], [data-input]')].filter(b=>/^(arrow)?(up|down|left|right)$/i.test(b.dataset.key||b.dataset.input));
 if(!directions.length)return;
 const supported=new Set(directions.map(b=>(b.dataset.key||b.dataset.input).replace(/^arrow/i,'').toLowerCase()));
 const cardinal=/level-11\.html$/.test(location.pathname);
 const stick=document.createElement('div');stick.id='touch-joystick';stick.setAttribute('role','group');stick.setAttribute('aria-label',cardinal?'Cart steering. Hold left or right to steer; release to return to the middle lane.':'Movement joystick. Drag to move; release to stop.');
 stick.innerHTML='<span class="joystick-track" aria-hidden="true"></span><span class="joystick-thumb" aria-hidden="true"></span>';
 const thumb=stick.lastElementChild,actions=document.createElement('div');actions.className='joystick-actions';
 const buttons=[...nav.querySelectorAll('button')].filter(b=>!directions.includes(b));
 const slots=buttons.map(b=>({button:b,parent:b.parentNode,next:b.nextSibling}));
 let pointer=null,held=new Set();
 function setDirections(next){for(const dir of held)if(!next.has(dir))send('keyup',dir);for(const dir of next)if(!held.has(dir))send('keydown',dir);held=next;}
 function send(type,dir){const key='Arrow'+dir[0].toUpperCase()+dir.slice(1);window.dispatchEvent(new KeyboardEvent(type,{key,code:key,bubbles:true,cancelable:true}));}
 function reset(){if(pointer===null&&!held.size)return;const id=pointer;pointer=null;setDirections(new Set());thumb.style.transform='translate(0px,0px)';stick.classList.remove('held');if(id!==null&&stick.hasPointerCapture(id))stick.releasePointerCapture(id);}
 function move(e){const r=stick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),scale=Math.min(1,40/(d||1));thumb.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;const next=new Set();if(d>12){if(cardinal){const dir=dx<0?'left':'right';if(Math.abs(dx)>12&&supported.has(dir))next.add(dir);}else{if(Math.abs(dx)>12&&Math.abs(dx)/d>.38)next.add(dx<0?'left':'right');if(Math.abs(dy)>12&&Math.abs(dy)/d>.38)next.add(dy<0?'up':'down');for(const dir of next)if(!supported.has(dir))next.delete(dir);}}setDirections(next);}
 stick.addEventListener('pointerdown',e=>{if(pointer!==null)return;e.preventDefault();pointer=e.pointerId;stick.setPointerCapture(pointer);stick.classList.add('held');move(e);});
 stick.addEventListener('pointermove',e=>{if(e.pointerId===pointer){e.preventDefault();move(e);}});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(type,e=>{if(e.pointerId===pointer)reset();});
 window.addEventListener('blur',reset);document.addEventListener('visibilitychange',reset);
 document.addEventListener('click',e=>{if(e.target.closest?.('#pause,#retry,#restart,#start'))reset();},true);
 new MutationObserver(()=>{if(document.querySelector('dialog[open]')||document.body.classList.contains('room-leaving'))reset();}).observe(document.body,{attributes:true,subtree:true,attributeFilter:['open','class']});
 function layout(){reset();nav.classList.toggle('has-joystick',mobile.matches);if(mobile.matches){nav.prepend(stick);nav.append(actions);buttons.forEach(b=>actions.append(b));}else{for(const {button,parent,next}of [...slots].reverse())parent.insertBefore(button,next?.parentNode===parent?next:null);stick.remove();actions.remove();}}
 mobile.addEventListener('change',layout);layout();
}
