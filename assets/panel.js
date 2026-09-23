export default function(THREE){
const g=new THREE.Group(), M={};
function mat(c,n='timber',r=.82){const k=c+n+r;if(!M[k]){M[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:n==='metal'?.35:0});M[k].name=n;}return M[k];}
function mesh(geo,c,x,y,z,n='timber'){const m=new THREE.Mesh(geo,mat(c,n));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function box(w,h,d,c,x=0,y=0,z=0,n='timber'){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,n);}
function ball(w,h,d,c,x,y,z,n='plaster'){const m=mesh(new THREE.SphereGeometry(1,16,12),c,x,y,z,n);m.scale.set(w,h,d);return m;}
function torus(r,t,c,x,y,z,arc=Math.PI*2,n='metal'){return mesh(new THREE.TorusGeometry(r,t,6,24,arc),c,x,y,z,n);}
box(4.2,3.2,.16,0x71312f,0,1.6,0);for(let x=-2.05;x<=2.06;x+=.35)box(.013,3.05,.015,0x362b22,x,1.6,.09);
for(const z of [-.105,.105]){for(const x of [-2.01,-1.35,0,1.35,2.01])box(.055,3.2,.055,0xa87d41,x,1.6,z);for(const y of [.13,.65,2.93,3.09])box(4.18,.055,.06,0xa87d41,0,y,z);
for(const x of [-1.68,-.68,.68,1.68]){const m=box(.41,.41,.012,0xbb8d42,x,1.72,z*1.15);m.rotation.z=Math.PI/4;}for(let i=0;i<12;i++){const x=-1.9+i*.35;const m=box(.012,.2+Math.sin(i*12)**2*.65,.016,0x433326,x,.6+Math.sin(i*4)**2*2,z*1.19);m.rotation.z=.14;}}
g.updateMatrixWorld(true);const bounds=new THREE.Box3(),v=new THREE.Vector3();g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.z-=c.z;o.position.y-=bounds.min.y;});return g;}
