export function newStoreAmbience(){return {phase:'closed',age:0,lid:0,eyes:false,rat:{x:42,y:136,height:15,visible:false},flies:Array.from({length:8},(_,i)=>({x:35+i%4*8,y:114+Math.floor(i/4)*30,height:4,wing:0}))};}
export function tickStoreAmbience(s,dt){const a=s.ambience||(s.ambience=newStoreAmbience());for(let i=0;i<a.flies.length;i++){const f=a.flies[i];f.x=43+Math.sin(s.time*1.7+i*2.4)*17;f.y=128+i%3*10+Math.cos(s.time*2.1+i)*8;f.height=5+Math.sin(s.time*3+i)*3;f.wing=Math.sin(s.time*74+i)*.9;}
 if(a.phase==='closed'&&Math.hypot(s.x-43,s.y-147)<48){a.phase='opening';a.age=0;}if(a.phase==='closed'||a.phase==='gone')return;a.age+=dt;
 if(a.phase==='opening'){a.lid=Math.min(1,a.age/.8);a.eyes=a.age>.3;if(a.age>=.8){a.phase='watching';a.age=0;}}
 else if(a.phase==='watching'){a.eyes=!((a.age>.35&&a.age<.48)||(a.age>.82&&a.age<.94));if(a.age>1.3){a.phase='climbing';a.age=0;a.eyes=false;a.rat.visible=true;}}
 else if(a.phase==='climbing'){const t=Math.min(1,a.age/1.1);a.rat.x=42+t*21;a.rat.y=136+t*19;a.rat.height=15*Math.sin((1-t)*Math.PI/2);if(t===1){a.phase='running';a.age=0;}}
 else if(a.phase==='running'){a.rat.x=63-Math.max(0,a.age-1)*27;a.rat.y=155+Math.min(1,a.age)*29;a.rat.height=0;if(a.age>2.3){a.phase='gone';a.rat.visible=false;}}
}
