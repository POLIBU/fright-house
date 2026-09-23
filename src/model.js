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
export const GATES=[{x:2,z:2,name:'THE GRIN',a:'2,2',b:'3,2',c:'2,3'},{x:0,z:3,name:'THE WINK',a:'0,3',b:'1,3',c:'0,4'}];
export const EVIDENCE=[{id:'bag',node:'1,1',asset:'backpack',name:'A small canvas backpack',title:'Ellie’s backpack',symbol:'☾',digit:4,text:'A blue canvas backpack, stiff with salt. Inside: a school photograph and a ticket stamped OCT 17, 1987. On the lining, someone has drawn a moon beside the number four.',note:'Ellie’s backpack: MOON = 4.'},{id:'shoe',node:'4,0',asset:'shoe',name:'A single red sneaker',title:'Daniel’s sneaker',symbol:'☀',digit:2,text:'One red sneaker. The laces are still tied. Beneath the insole is a scrap of an attraction map: a sun, the number two, and the words “THE WALLS CAN KEEP HIM OUT.”',note:'Daniel’s sneaker: SUN = 2. The walls can keep him out.'},{id:'tape',node:'1,4',asset:'cassette',name:'A cassette in a yellow case',title:'The last recording',symbol:'✦',digit:7,text:'A homemade cassette marked “FOR MUM”. A star and a seven are scratched into the case. There is a player in the maintenance room, but the power is out.',note:'Cassette case: STAR = 7. Find the maintenance-room player.'}];
export function blockedEdge(gate,state){return edgeKey(gate.a,state?gate.b:gate.c);}
export function linked(a,b,states=[0,0]){return edges.has(edgeKey(a,b))&&!GATES.some((g,i)=>blockedEdge(g,states[i])===edgeKey(a,b));}
export function neighbors(a,states=[0,0]){const [x,z]=a.split(',').map(Number);return [[x+1,z],[x-1,z],[x,z+1],[x,z-1]].filter(([xx,zz])=>xx>=0&&zz>=0&&xx<N&&zz<N).map(([xx,zz])=>key(xx,zz)).filter(b=>linked(a,b,states));}
export function pathfind(from,to,states=[0,0]){const q=[from],prev=new Map([[from,null]]);for(let i=0;i<q.length;i++){const a=q[i];if(a===to){const p=[];let c=a;while(c!==null){p.unshift(c);c=prev.get(c);}return p;}for(const b of neighbors(a,states)){if(!prev.has(b)){prev.set(b,a);q.push(b);}}}return [];}
export function cellAt(x,z){return key(Math.max(0,Math.min(N-1,Math.round(x/SIZE))),Math.max(0,Math.min(N-1,Math.round(z/SIZE))));}
export function point(node){const [x,z]=node.split(',').map(Number);return {x:x*SIZE,z:z*SIZE};}
export const ESCAPE_SECONDS=150;
export const POWER_ORDER=[0,1,2];
export const EXIT_CODE='247';
