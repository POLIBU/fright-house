export default function(THREE){
const g=new THREE.Group(), M={};
function mat(c,n='timber',r=.82){const k=c+n+r;if(!M[k]){M[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:n==='metal'?.35:0});M[k].name=n;}return M[k];}
function mesh(geo,c,x,y,z,n='timber'){const m=new THREE.Mesh(geo,mat(c,n));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function box(w,h,d,c,x=0,y=0,z=0,n='timber'){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,n);}
function ball(w,h,d,c,x,y,z,n='plaster'){const m=mesh(new THREE.SphereGeometry(1,16,12),c,x,y,z,n);m.scale.set(w,h,d);return m;}
function torus(r,t,c,x,y,z,arc=Math.PI*2,n='metal'){return mesh(new THREE.TorusGeometry(r,t,6,24,arc),c,x,y,z,n);}
g.userData.mounts='back';box(.29,.46,.07,0x242622,0,.23,0,'metal');box(.24,.33,.07,0x141915,0,.23,.053,'metal');const dial=mesh(new THREE.CylinderGeometry(.088,.088,.024,32),0xa87d41,.015,.205,.106,'metal');dial.rotation.x=Math.PI/2;for(let i=0;i<10;i++){const a=i*Math.PI/5;ball(.012,.012,.008,0x121812,.015+Math.cos(a)*.062,.205+Math.sin(a)*.062,.123);}box(.19,.025,.03,0xa87d41,0,.376,.102,'metal');box(.065,.27,.064,0x111915,-.174,.275,.08,'metal');for(const y of [.14,.40])ball(.069,.045,.066,0x111915,-.174,y,.11,'metal');for(let i=0;i<22;i++)torus(.014,.004,0x171a14,-.14,.115-i*.009,.055);
g.updateMatrixWorld(true);const bounds=new THREE.Box3(),v=new THREE.Vector3();g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.z-=c.z;o.position.y-=bounds.min.y;});return g;}
