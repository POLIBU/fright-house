export default function(THREE){
const g=new THREE.Group(), M={};
function mat(c,n='timber',r=.82){const k=c+n+r;if(!M[k]){M[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:n==='metal'?.35:0});M[k].name=n;}return M[k];}
function mesh(geo,c,x,y,z,n='timber'){const m=new THREE.Mesh(geo,mat(c,n));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function box(w,h,d,c,x=0,y=0,z=0,n='timber'){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,n);}
function ball(w,h,d,c,x,y,z,n='plaster'){const m=mesh(new THREE.SphereGeometry(1,16,12),c,x,y,z,n);m.scale.set(w,h,d);return m;}
function torus(r,t,c,x,y,z,arc=Math.PI*2,n='metal'){return mesh(new THREE.TorusGeometry(r,t,6,24,arc),c,x,y,z,n);}
box(.105,.067,.014,0x252c2a,0,.0335,0,'metal');box(.09,.032,.002,0xd6c8a0,0,.040,.009,'fabric');for(const x of [-.024,.024])torus(.010,.004,0x101919,x,.038,.011);box(.070,.013,.004,0x71312f,0,.013,.009,'metal');for(const x of [-.045,.045])for(const y of [.008,.06])ball(.0025,.0025,.002,0x909282,x,y,.009,'metal');
for(const x of [-.024,.024])torus(.010,.004,0x101919,x,.038,-.011);box(.09,.032,.002,0xb1a984,0,.040,-.009,'fabric');box(.070,.013,.004,0x71312f,0,.013,-.009,'metal');
g.updateMatrixWorld(true);const bounds=new THREE.Box3(),v=new THREE.Vector3();g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.z-=c.z;o.position.y-=bounds.min.y;});return g;}
