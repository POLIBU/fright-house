export default function(THREE){
 const g=new THREE.Group(), mats=new Map();
 const C={bone:0xd4c69f,red:0x943d34,ink:0x172127,black:0x080e11,gold:0xb39347,blue:0x398a90,pink:0xb27583,green:0x657b59,rust:0x614538,raw:0x8d8c79};
 function material(c,kind='paint'){const k=c+kind;if(!mats.has(k)){const m=new THREE.MeshStandardMaterial({color:c,roughness:kind==='glass'?.22:kind==='metal'?.52:.69,metalness:kind==='metal'?.55:0});m.name=kind==='metal'?'metal':'painted shell';mats.set(k,m);}return mats.get(k);}
 function mesh(geo,c,x=0,y=0,z=0,kind){const o=new THREE.Mesh(geo,material(c,kind));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o;}
 function box(w,h,d,c,x=0,y=0,z=0,kind){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,kind);}
 function ball(w,h,d,c,x,y,z,kind){const o=mesh(new THREE.SphereGeometry(1,24,16),c,x,y,z,kind);o.scale.set(w,h,d);return o;}
 function ellipse(x,y,rx,ry){const p=new THREE.Path();p.absellipse(x,y,rx,ry,0,Math.PI*2,true);return p;}
 function shape(points,c,z=.08,depth=.14,bevel=.025,holes=[]){const s=new THREE.Shape();s.moveTo(...points[0]);for(let i=1;i<points.length;i++){const p=points[i];if(p.length===6)s.bezierCurveTo(...p);else if(p.length===4)s.quadraticCurveTo(...p);else s.lineTo(...p);}s.closePath();s.holes=holes;return mesh(new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:bevel>0,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:20}),c,0,0,z);}
 function tube(points,r,c,kind='paint'){const v=points.map(p=>new THREE.Vector3(...p));return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v),Math.max(12,points.length*7),r,7,false),c,0,0,0,kind);}
 function rim(x,y,rx,ry,c,z=.28,t=.026){const o=mesh(new THREE.TorusGeometry(1,t,8,40),c,x,y,z);o.scale.set(rx,ry,1);return o;}
 function eye(x,y,rx,ry,{color=C.bone,pupil=true,tilt=0,wink=false}={}){if(wink){tube([[x-rx,y+.03,.29],[x,y-.018,.31],[x+rx,y+.06,.29]],.035,C.ink);return;}ball(rx*.98,ry*.98,.035,C.black,x,y,.06);const ring=rim(x,y,rx,ry,color,.25,.05);ring.rotation.z=tilt;if(pupil){ball(rx*.68,ry*.79,.067,C.bone,x,y,.18,'glass');ball(rx*.40,ry*.57,.033,C.ink,x+.025,y-.018,.241,'glass');ball(.014,.018,.008,0xe5e1c4,x+.04,y+.015,.269,'glass');}}
 function mouth(x,y,rx,ry,c=C.red){ball(rx,ry,.04,C.black,x,y,.09);rim(x,y,rx,ry,c,.245,.052);}
 function bolts(x,y,z=.265){ball(.018,.018,.01,C.rust,x,y,z,'metal');box(.025,.004,.006,C.black,x,y,z+.01);}
 function crack(points){tube(points,.006,C.rust);}
 function chip(x,y,z,s=.06,turn=0){const p=shape([[x-s,y],[x-s*.2,y+s*.6],[x+s*.25,y+s*.4],[x+s,y+s*.6],[x+s*.65,y-s*.3],[x,y-s*.8]],C.raw,z,.004,.002);p.rotation.z=turn;}
 function tooth(x,y,w=.075,h=.12){const o=box(w,h,.065,C.bone,x,y,.26);o.rotation.z=x*.16;return o;}
 function head(color,holes=[],w=.61,h=.70){return shape([[0,-h],[-w*.75,-h,-w*1.08,-h*.30,-w,h*.3],[-w*.95,h*.80,-w*.5,h*1.05,0,h],[w*.60,h*1.05,w*1.02,h*.7,w,h*.24],[w*1.07,-h*.36,w*.58,-h,0,-h]],color,.055,.16,.035,holes);}
 function cheek(x,y,c,rx=.14,ry=.10){return ball(rx,ry,.075,c,x,y,.245);}
 function brow(x,y,w,c,sign=1){tube([[x-w,y-.03*sign,.29],[x,y+.08*sign,.33],[x+w,y,.29]],.030,c);}
 function finish(){
  // Backing ribs, shell fastening holes and a hanging bracket belong to each physical prop.
  
  const bounds=new THREE.Box3(),v=new THREE.Vector3();g.updateMatrixWorld(true);g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.y-=bounds.min.y;o.position.z-=c.z;});return g;
 }

 box(4.2,3.2,.14,0x224e53,0,1.6,0);
 for(const side of [-1,1]){const before=new Set(g.children);
  for(let i=0;i<4;i++){const w=2.85-i*.40,h=2.95-i*.36,t=i%2?.12:.095;const f=new THREE.Group();const a=box(w,t,.055,i%2?C.bone:C.ink,0,h,.10+i*.03);const b=box(w,t,.055,i%2?C.bone:C.ink,0,.20+i*.13,.10+i*.03);const l=box(t,h-.20-i*.13,.055,i%2?C.bone:C.ink,-w/2,(h+.20+i*.13)/2,.10+i*.03);const r=l.clone();r.position.x=w/2;g.add(r);for(const o of [a,b,l,r]){o.rotation.z=(i%2?-.08:.08);}}
  for(const x of [-1.90,1.90])box(.12,3.18,.18,C.red,x,1.6,.02);
  for(const y of [.40,2.30]){box(.16,.20,.05,C.rust,-1.10,y,.23,'metal');for(const dx of [-.05,.05])bolts(-1.10+dx,y,.266);}
  ball(.055,.055,.04,C.gold,.66,.74,.27,'metal');box(.14,.026,.05,C.gold,.63,.74,.30,'metal');
  if(side<0)for(const o of [...g.children])if(!before.has(o)){o.position.z=-o.position.z;o.rotation.y+=Math.PI;}
 }

 return finish();
}
