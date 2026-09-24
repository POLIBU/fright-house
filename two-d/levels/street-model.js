export const NEWSPAPER = {
  title:'THE COAST CHRONICLE',
  headline:'PARK CLOSED AFTER CHILDREN VANISH',
  date:'OCTOBER 19, 1987 · LOCAL NEWS',
  body:'The carnival gates remain locked following the disappearance of three children last seen near the Fright House attraction. Staff say the funhouse was closed that evening. A witness reported lights inside after midnight. Families are asking anyone who visited the park to come forward.',
  clue:'Someone circled one sentence: “A witness reported lights inside after midnight.”',
};
export const INTERACTIONS = [
  {id:'newspaper',x:100,y:260,r:27,label:'READ · newspaper on the bench'},
  {id:'notices',x:111,y:241,r:24,label:'EXAMINE · missing-child notices'},
  {id:'ticket',x:143,y:269,r:20,label:'EXAMINE · abandoned admission ticket'},
  {id:'stall',x:335,y:189,r:22,label:'LISTEN · shuttered prize stall'},
  {id:'entrance',x:239,y:147,r:19,label:'PUSH · broken turnstile'},
];
const floors=[
  [190,290,293,362], [95,256,331,297], [91,245,174,287], [104,237,124,258],
  [186,195,291,306], [144,151,362,201], [188,151,291,226], [223,127,254,161],
];
export function newStreet(){return {x:239,y:342,face:'up',walk:0,time:0,light:true,gate:false,gateProgress:0,newspaper:false,notices:false,ticket:false,stall:false,phase:'street'};}
export function blocked(x,y,s,r=4){
  if(![[-r,-r],[r,-r],[-r,r],[r,r]].every(([dx,dy])=>floors.some(([a,b,c,d])=>x+dx>=a&&x+dx<=c&&y+dy>=b&&y+dy<=d)))return true;
  if(s.gateProgress<1&&y-r<140)return true;
  return false;
}
export function move(s,dx,dy,dt){
  const n=Math.hypot(dx,dy)||1,step=65*dt;dx=dx/n*step;dy=dy/n*step;
  const old={x:s.x,y:s.y};
  if(!blocked(s.x+dx,s.y,s))s.x+=dx;
  if(!blocked(s.x,s.y+dy,s))s.y+=dy;
  if(Math.hypot(old.x-s.x,old.y-s.y)>.001){s.walk+=dt*9;s.face=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}
}
export function near(s){
  return INTERACTIONS.filter(o=>Math.hypot(o.x-s.x,o.y-s.y)<o.r).sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0]||null;
}
export function wheelAngle(time){return time*Math.PI/40;}
export function bulbLevel(time,index,reduced=false){return reduced?.68:.55+.35*Math.sin(time*.95+index*.83)+.08*Math.sin(time*.27+index);}
export function path(s,x,y){
  const size=5,key=(x,y)=>x+','+y,start=[Math.round(s.x/size),Math.round(s.y/size)],goal=[Math.round(x/size),Math.round(y/size)],q=[start],prev=new Map([[key(...start),null]]);let end=null;
  for(let n=0;n<q.length;n++){const [a,b]=q[n];if(Math.hypot(a-goal[0],b-goal[1])<=1){end=[a,b];break;}
    for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const p=[a+dx,b+dy],id=key(...p);if(!prev.has(id)&&!blocked(p[0]*size,p[1]*size,s)){prev.set(id,[a,b]);q.push(p);}}
  }
  if(!end)return [];const result=[];for(let p=end;p;p=prev.get(key(...p)))result.unshift({x:p[0]*size,y:p[1]*size});return result.slice(1);
}

export function tick(s,dt){s.time+=dt;if(s.gate)s.gateProgress=Math.min(1,s.gateProgress+dt/0.65);}
