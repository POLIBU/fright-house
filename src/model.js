export const SIZE=4.2, N=5;
export const key=(x,z)=>`${x},${z}`;
export const edgeKey=(a,b)=>[a,b].sort().join('|');
const edges=new Set();
function add(ax,az,bx,bz){edges.add(edgeKey(key(ax,az),key(bx,bz)));}
// Three interlocking loops, with two dead-end evidence rooms.
for(let x=0;x<4;x++)add(x,0,x+1,0);
for(let x=0;x<4;x++)add(x,2,x+1,2);
for(let x=0;x<4;x++)add(x,4,x+1,4);
for(const [x,z] of [[0,0],[2,0],[4,0],[0,1],[2,1],[4,1],[0,2],[2,2],[4,2],[0,3],[1,3],[2,3],[4,3]])add(x,z,x,z+1);
add(0,1,1,1);add(2,1,3,1);add(3,1,4,1);add(0,3,1,3);add(1,3,2,3);add(2,3,3,3);add(3,3,4,3);
export const EDGES=edges;
edges.delete(edgeKey('3,4','4,4'));
export const GATES=[{x:2,z:2,name:'THE GRIN',a:'2,2',b:'3,2',c:'2,3'},{x:0,z:3,name:'THE WINK',a:'0,3',b:'1,3',c:'0,4'},{x:2,z:0,name:'THE FROWN',a:'2,0',b:'3,0',c:'2,1'}];
export const INITIAL_GATES=[0,0,1];
export const POWER_GATES=[1,1,0];
export const EVIDENCE=[
{id:'bag',node:'1,1',asset:'backpack',name:'Examine the canvas backpack',title:'Ellie’s backpack',symbol:'☾',text:'A canvas backpack, stiff with salt. Inside: a school photograph and a ticket stamped OCT 17, 1987. A torn maintenance card reads: “GRIN — open SOUTH. Emergency release: MOON, STAR, SUN.”',note:'GRIN: open SOUTH. Jammed passage release: MOON → STAR → SUN.'},
{id:'shoe',node:'4,0',asset:'shoe',name:'Examine the red sneaker',title:'Daniel’s sneaker',symbol:'☀',text:'One red sneaker. The laces are still tied. Beneath the insole is part of a maintenance map: “WINK — open SOUTH.” Someone has added: “It follows the passages. The walls can keep it out.”',note:'WINK: open SOUTH. A wall can force the creature to take a longer route.'},
{id:'tape',node:'1,4',asset:'cassette',name:'Take the cassette',title:'The last recording',symbol:'✦',text:'A cassette in a cracked case marked “TAKE THIS OUTSIDE”. On its folded sleeve: “FROWN — open EAST.” There is a player in maintenance, but the power is out.',note:'FROWN: open EAST. Play the cassette in the maintenance room.'}
];
export function blockedEdge(gate,state){return edgeKey(gate.a,state?gate.b:gate.c);}
export function linked(a,b,states=INITIAL_GATES){return edges.has(edgeKey(a,b))&&!GATES.some((g,i)=>blockedEdge(g,states[i])===edgeKey(a,b));}
export function neighbors(a,states=INITIAL_GATES){const [x,z]=a.split(',').map(Number);return [[x+1,z],[x-1,z],[x,z+1],[x,z-1]].filter(([xx,zz])=>xx>=0&&zz>=0&&xx<N&&zz<N).map(([xx,zz])=>key(xx,zz)).filter(b=>linked(a,b,states));}
export function pathfind(from,to,states=INITIAL_GATES){const q=[from],prev=new Map([[from,null]]);for(let i=0;i<q.length;i++){const a=q[i];if(a===to){const p=[];let c=a;while(c!==null){p.unshift(c);c=prev.get(c);}return p;}for(const b of neighbors(a,states)){if(!prev.has(b)){prev.set(b,a);q.push(b);}}}return [];}
export function cellAt(x,z){return key(Math.max(0,Math.min(N-1,Math.round(x/SIZE))),Math.max(0,Math.min(N-1,Math.round(z/SIZE))));}
export function point(node){const [x,z]=node.split(',').map(Number);return {x:x*SIZE,z:z*SIZE};}
export const ESCAPE_SECONDS=180;
export const POWER_ORDER=[0,1,2];
export const EXIT_ORDER=[0,2,1];
export const RELEASE_ORDER=[1,2,0];
