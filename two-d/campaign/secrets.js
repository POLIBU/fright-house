// Optional evidence is independent of room checkpoints and never locks progression.
export const SECRET_KEY='fright-house-optional-evidence-v1';
export const SECRETS=[
 {level:1,id:'ribbon',name:'Red hair ribbon',kind:'ribbon',x:111,y:275,text:'A red ribbon. I wonder who it belonged to.'},
 {level:2,id:'glasses',name:'Small spectacles',kind:'glasses',x:338,y:187,drawer:true,text:'Small spectacles. Poor child. Why would someone take them away?'},
 {level:3,id:'knife',name:'Small pocketknife',kind:'knife',x:222,y:672,text:'A small pocketknife. The handle has been worn smooth.'},
 {level:4,id:'mitten',name:'Blue mitten',kind:'mitten',x:355,y:233,text:'A blue mitten. So small. Where is the other one?'},
 {level:5,id:'photo',name:'Torn photograph',kind:'photo',x:536,y:145,text:'Three children in a photograph. Someone has torn away the other half.'},
 {level:6,id:'key',name:'Numbered locker key',kind:'key',x:72,y:406,text:'A locker key. Only the number 087 is still readable on its faded tag.'},
 {level:7,id:'watch',name:'Stopped wristwatch',kind:'watch',x:113,y:325,text:'A child’s watch. The hands have stopped at 11:17.'},
 {level:8,id:'button',name:'Coat button',kind:'button',x:552,y:396,text:'A loose coat button. A little blue thread is still caught in the holes.'},
 {level:9,id:'bracelet',name:'Silver bracelet',kind:'bracelet',x:290,y:990,contact:true,text:'A small silver bracelet. The clasp is bent open.'},
 {level:10,id:'shoe',name:'Single small shoe',kind:'shoe',x:308,y:729,text:'A little shoe. Its laces are still tied.'},
 {level:11,id:'tag',name:'Faded luggage tag',kind:'tag',x:200,y:1240,contact:true,text:'A faded luggage tag. Whatever was written here has almost worn away.'}
];
export function cleanEvidence(value){return [...new Set(Array.isArray(value)?value:[])].filter(id=>SECRETS.some(s=>s.id===id));}
export function readEvidence(storage=globalThis.localStorage){try{return cleanEvidence(JSON.parse(storage.getItem(SECRET_KEY)||'[]'));}catch{return [];}}
export function collectEvidence(id,storage=globalThis.localStorage){const items=readEvidence(storage);if(!SECRETS.some(s=>s.id===id)||items.includes(id))return false;items.push(id);try{storage.setItem(SECRET_KEY,JSON.stringify(items));}catch{}return true;}
export function resetEvidence(storage=globalThis.localStorage){try{storage.removeItem(SECRET_KEY);}catch{}}
export function endingFor(items){return cleanEvidence(items).length===SECRETS.length?'arrest':'escape';}
