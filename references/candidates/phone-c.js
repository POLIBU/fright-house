export default function(THREE){
const g=new THREE.Group(), M={};
function mat(c,n='timber',r=.82){const k=c+n+r;if(!M[k]){M[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:n==='metal'?.35:0});M[k].name=n;}return M[k];}
function mesh(geo,c,x,y,z,n='timber'){const m=new THREE.Mesh(geo,mat(c,n));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function box(w,h,d,c,x=0,y=0,z=0,n='timber'){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,n);}
function ball(w,h,d,c,x,y,z,n='plaster'){const m=mesh(new THREE.SphereGeometry(1,16,12),c,x,y,z,n);m.scale.set(w,h,d);return m;}
function torus(r,t,c,x,y,z,arc=Math.PI*2,n='metal'){return mesh(new THREE.TorusGeometry(r,t,6,24,arc),c,x,y,z,n);}

function rounded(w,h,d,c,x,y,z,n='timber',r=.03){const s=new THREE.Shape();s.moveTo(-w/2+r,0);s.lineTo(w/2-r,0);s.quadraticCurveTo(w/2,0,w/2,r);s.lineTo(w/2,h-r);s.quadraticCurveTo(w/2,h,w/2-r,h);s.lineTo(-w/2+r,h);s.quadraticCurveTo(-w/2,h,-w/2,h-r);s.lineTo(-w/2,r);s.quadraticCurveTo(-w/2,0,-w/2+r,0);return mesh(new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:5}),c,x,y,z-d/2,n);}
function rod(a,b,r,c,n='metal',r2=r){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),v=vb.clone().sub(va);const m=mesh(new THREE.CylinderGeometry(r2,r,v.length(),10),c,...va.clone().add(vb).multiplyScalar(.5).toArray(),n);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
g.userData.mounts='back';box(.32,.44,.08,0x242b27,0,.22,0,'metal');box(.27,.27,.05,0x161f1b,0,.19,.055,'metal');torus(.085,.013,0x92815b,0,.19,.09);for(let i=0;i<10;i++){const a=i*Math.PI/5;torus(.009,.004,0x92815b,Math.cos(a)*.060,.19+Math.sin(a)*.060,.098);}for(const s of [-1,1]){ball(.058,.045,.047,0x101a17,s*.145,.38,.10,'metal');rod([s*.14,.41,.10],[s*.04,.44,.08],.028,0x101a17);}rod([-.04,.44,.08],[.04,.44,.08],.023,0x101a17);for(let i=0;i<20;i++)torus(.012,.003,0x17221a,.18,.34-i*.011,.02);
g.updateMatrixWorld(true);const bounds=new THREE.Box3(),v=new THREE.Vector3();g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.z-=c.z;o.position.y-=bounds.min.y;});return g;}
