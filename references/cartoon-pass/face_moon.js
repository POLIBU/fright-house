export default function(THREE){
 const g=new THREE.Group(), mats=new Map();g.userData.mounts='back';
 const C={bone:0xd4c69f,red:0x943d34,ink:0x172127,black:0x080e11,gold:0xb39347,blue:0x398a90,pink:0xb27583,green:0x657b59,rust:0x614538,raw:0x8d8c79};
 function material(c,kind='paint'){const k=c+kind;if(!mats.has(k)){const m=new THREE.MeshStandardMaterial({color:c,roughness:kind==='glass'?.22:kind==='metal'?.52:.69,metalness:kind==='metal'?.55:0});m.name=kind==='metal'?'metal':kind==='glass'?'glass':'plaster';mats.set(k,m);}return mats.get(k);}
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
 function soften(geometry){
  if(geometry.type!=='ExtrudeGeometry')return geometry;
  const geo=geometry.index?geometry.toNonIndexed():geometry,pa=geo.attributes.position,uv=geo.attributes.uv,vertices=[],tex=[];
  function split(a,b,c,level){const dist=(p,q)=>(p[0]-q[0])**2+(p[1]-q[1])**2+(p[2]-q[2])**2;if(level<3&&Math.max(dist(a,b),dist(b,c),dist(c,a))>.0625){const mid=(p,q)=>p.map((v,i)=>(v+q[i])*.5),ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);split(a,ab,ca,level+1);split(ab,b,bc,level+1);split(ca,bc,c,level+1);split(ab,bc,ca,level+1);}else for(const v of [a,b,c]){vertices.push(v[0],v[1],v[2]);tex.push(v[3],v[4]);}}
  const read=i=>[pa.getX(i),pa.getY(i),pa.getZ(i),uv.getX(i),uv.getY(i)];for(let i=0;i<pa.count;i+=3)split(read(i),read(i+1),read(i+2),0);
  const out=new THREE.BufferGeometry();out.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));out.setAttribute('uv',new THREE.Float32BufferAttribute(tex,2));return out;
 }
 function finish(){
  // Backing ribs, shell fastening holes and a hanging bracket belong to each physical prop.
  box(.54,.045,.04,C.rust,0,.30,.01);box(.045,.76,.045,C.rust,0,0,-.005);for(const x of [-.23,.23])bolts(x,.30,.035);
  g.updateMatrixWorld(true);g.traverse(o=>{if(!o.isMesh)return;o.geometry=soften(o.geometry.clone()).applyMatrix4(o.matrixWorld);const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i);a.setZ(i,a.getZ(i)+.18*Math.max(0,1-(x/.82)**2)*Math.max(0,1-(y/1.20)**2));}a.needsUpdate=true;o.geometry.computeVertexNormals();o.position.set(0,0,0);o.rotation.set(0,0,0);o.scale.set(1,1,1);});
  const bounds=new THREE.Box3(),v=new THREE.Vector3();g.updateMatrixWorld(true);g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.y-=bounds.min.y;o.position.z-=c.z;});return g;
 }

 shape([[.17,.83],[-.66,.74,-.83,.03,-.43,-.54],[-.24,-.81,.27,-.72,.50,-.36],[.03,-.42,-.09,-.19,.07,.03],[.29,.16],[.09,.28],[.06,.56,.17,.72,.17,.83]],0x809b9a,.04,.20,.035,[ellipse(-.24,.25,.135,.11)]);
 eye(-.24,.25,.135,.11,{color:C.ink,pupil:false});brow(-.24,.40,.13,C.ink,-1);tube([[-.21,-.30,.29],[-.05,-.26,.31],[.13,-.32,.29]],.028,C.ink);
 ball(.033,.087,.022,C.blue,-.35,.03,.285);ball(.027,.07,.02,C.blue,-.38,-.12,.28);chip(-.44,.21,.29,.07);chip(-.30,-.51,.29,.10);crack([[-.42,.55,.28],[-.29,.45,.28],[-.39,.33,.28]]);

 return finish();
}
