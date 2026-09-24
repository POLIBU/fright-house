import {AREA_BY_ID,PASSAGES} from './areas.js';
import {ACTIVE_NODES,EVIDENCE,INITIAL_GATES,POWER_GATES,linked,ESCAPE_SECONDS} from '../../src/model.js';

export const SAVE_VERSION = 1;
// Group the original navigation nodes into seven authored areas. The original
// edges and rotating gates remain authoritative, including all three loops.
export const MAZE_AREAS = Object.freeze({
  landing:['0,0','0,1'], 'lost-property':['1,1'], mirrors:['3,0','4,0','4,1'],
  prizes:['1,4','2,4'], maintenance:['4,4'], 'service-passage':['0,4','4,3'],
  'wall-junction':['2,0','2,1','0,2','1,2','2,2','3,2','4,2','0,3','1,3','2,3','3,3'],
});
const areaOf = node => Object.keys(MAZE_AREAS).find(id=>MAZE_AREAS[id].includes(node));
const clone = x => structuredClone(x);
export function newCampaign(){
  return {version:SAVE_VERSION,area:'street',entry:'start',phase:'arrival',mazeNode:null,
    visited:['street'],openedDoors:[],revealedRooms:['street'],evidence:[],journal:[],events:[],
    gates:[...INITIAL_GATES],power:false,recording:false,release:false,escapeSeconds:ESCAPE_SECONDS,
    story:'opening',paused:false,elapsed:0,checkpoint:null};
}
function enter(s,area,entry){
  s.area=area;s.entry=entry;
  if(!s.visited.includes(area))s.visited.push(area);
  if(!s.revealedRooms.includes(area))s.revealedRooms.push(area);
}
export function remember(s,id,text){
  if(s.journal.some(n=>n.id===id))return false;
  s.journal.push({id,text});return true;
}
export function once(s,id){if(s.events.includes(id))return false;s.events.push(id);return true;}
export function openDoor(s,id){
  const door=PASSAGES.find(p=>p.id===id);
  if(!door||![door.a,door.b].includes(s.area))return false;
  if(!s.openedDoors.includes(id))s.openedDoors.push(id);
  return true;
}
export function enterDoor(s,id){
  const door=PASSAGES.find(p=>p.id===id);
  if(!door||!s.openedDoors.includes(id)||![door.a,door.b].includes(s.area))return false;
  enter(s,s.area===door.a?door.b:door.a,id);return true;
}
export function finishFall(s){
  if(s.area!=='workshop'||!s.events.includes('workshop-disturbance'))return false;
  s.mazeNode='0,0';s.phase='investigate';s.story='fall';enter(s,'landing','fall');return true;
}
export function stepMaze(s,node){
  if(!s.mazeNode||!ACTIVE_NODES.has(node)||!linked(s.mazeNode,node,s.gates))return false;
  s.mazeNode=node;enter(s,areaOf(node),'maze');return true;
}
export function collectEvidence(s,id){
  const item=EVIDENCE.find(e=>e.id===id);
  if(!item||item.node!==s.mazeNode||s.evidence.includes(id))return false;
  s.evidence.push(id);remember(s,id,item.note);return true;
}
export function setGate(s,index,value){
  if(!s.mazeNode||!Number.isInteger(index)||index<0||index>2||![0,1].includes(value))return false;
  s.gates[index]=value;return true;
}
// Geometry, interaction range and breaker button sequence are checked by the
// scene controller; this state layer additionally protects story prerequisites.
export function restorePower(s){
  if(s.area!=='maintenance'||s.evidence.length!==3||!s.gates.every((v,i)=>v===POWER_GATES[i]))return false;
  s.power=true;return true;
}
export function playRecording(s){
  if(s.area!=='maintenance'||!s.power||!s.evidence.includes('tape'))return false;
  s.recording=true;remember(s,'exit-handles','LEFT → RIGHT → MIDDLE');return true;
}
export function answerPhone(s){
  if(s.area!=='maintenance'||!s.recording||s.phase!=='investigate')return false;
  s.phase='chase';s.story='phone';s.escapeSeconds=ESCAPE_SECONDS;once(s,'clown-reveal');return true;
}
export function enterPlatform(s){
  if(s.mazeNode!=='0,4'||s.phase!=='chase'||!s.release)return false;
  s.phase='boarding';s.story='boarding';s.mazeNode=null;enter(s,'cart-platform','service-exit');return true;
}
export function advanceTime(s,dt){
  if(s.paused||s.story||!Number.isFinite(dt)||dt<0||s.phase==='caught'||s.phase==='escaped')return;
  s.elapsed+=dt;
  if(s.phase==='chase'){s.escapeSeconds=Math.max(0,s.escapeSeconds-dt);if(s.escapeSeconds===0)s.phase='caught';}
}
export function checkpoint(s){
  const saved=clone(s);saved.checkpoint=null;saved.paused=false;saved.story=null;
  s.checkpoint=saved;return clone(saved);
}
export function retry(s){
  if(!s.checkpoint)return newCampaign();
  const saved=clone(s.checkpoint);saved.checkpoint=clone(s.checkpoint);saved.paused=false;return saved;
}
export function saveCampaign(s){return JSON.stringify(s);}
export function loadCampaign(raw){
  try{const s=JSON.parse(raw);
    if(s?.version!==SAVE_VERSION||!AREA_BY_ID.has(s.area)||!Array.isArray(s.gates)||s.gates.length!==3||s.gates.some(v=>v!==0&&v!==1))return null;
    if(!['visited','openedDoors','revealedRooms','evidence','journal','events'].every(k=>Array.isArray(s[k])))return null;
    if(s.mazeNode!==null&&!ACTIVE_NODES.has(s.mazeNode))return null;
    if(!Number.isFinite(s.elapsed)||!Number.isFinite(s.escapeSeconds)||s.elapsed<0||s.escapeSeconds<0)return null;
    s.paused=true;return s;
  }catch{return null;}
}
