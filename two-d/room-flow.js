import {installInstructions} from './instructions-ui.js';
queueMicrotask(installInstructions);
import {installRoomSoundscape} from './room-soundscape.js';
queueMicrotask(installRoomSoundscape);
import {installSecrets} from './secrets-ui.js';
queueMicrotask(installSecrets);
// Keep long-press browser menus off controls while leaving story text selectable.
for(const type of ['contextmenu','selectstart'])document.addEventListener(type,event=>{
 if(event.target instanceof Element&&event.target.closest('button,#touch,#game'))event.preventDefault();
});
// Room files remain independently testable; normal play enters them without menus.
const body=document.body,stage=document.querySelector('#stage');
let leaving=false,entered=false;
const curtain=document.createElement('div');curtain.id='room-curtain';curtain.setAttribute('aria-hidden','true');stage?.append(curtain);
const soundButton=document.querySelector('#sound');
function rememberSound(){try{sessionStorage.setItem('fright-house-muted',String(soundButton?.textContent.includes('OFF')));}catch{}}
// Save after every click handler has applied the new sound setting.
soundButton?.addEventListener('click',()=>setTimeout(rememberSound,0));
function restoreSound(){try{if(sessionStorage.getItem('fright-house-muted')==='true'&&!soundButton?.textContent.includes('OFF'))soundButton?.click();}catch{}}
// Reveal a useful error rather than leaving the player behind a black loading screen.
const loadTimer=body.hasAttribute('data-room-loading')?setTimeout(()=>{if(!entered){body.removeAttribute('data-room-loading');body.classList.add('room-load-error');}},20000):null;
export function enterRoom(start,resumeAudio=()=>{}){
 if(entered)return;entered=true;clearTimeout(loadTimer);start();restoreSound();
 requestAnimationFrame(()=>requestAnimationFrame(()=>{body.removeAttribute('data-room-loading');body.classList.add('room-ready');}));
 const unlock=()=>{resumeAudio();};
 // A direct room URL may not have browser audio permission until the first input.
 window.addEventListener('pointerdown',unlock,{once:true});window.addEventListener('keydown',unlock,{once:true});
}
export function leaveRoom(path){
 if(leaving)return;const url=new URL(path,location.href);if(url.origin!==location.origin)return;
 leaving=true;rememberSound();body.classList.add('room-leaving');document.querySelector('#game')?.blur();
 setTimeout(()=>location.assign(url.href),240);
}
// The first room retains its title; restore the shared mute preference there too.
if(!body.hasAttribute('data-room-loading'))queueMicrotask(restoreSound);
