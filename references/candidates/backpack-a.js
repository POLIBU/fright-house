export default function(THREE){
const g=new THREE.Group(), M={};
function mat(c,n='timber',r=.82){const k=c+n+r;if(!M[k]){M[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:n==='metal'?.35:0});M[k].name=n;}return M[k];}
function mesh(geo,c,x,y,z,n='timber'){const m=new THREE.Mesh(geo,mat(c,n));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function box(w,h,d,c,x=0,y=0,z=0,n='timber'){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,n);}
function ball(w,h,d,c,x,y,z,n='plaster'){const m=mesh(new THREE.SphereGeometry(1,16,12),c,x,y,z,n);m.scale.set(w,h,d);return m;}
function torus(r,t,c,x,y,z,arc=Math.PI*2,n='metal'){return mesh(new THREE.TorusGeometry(r,t,6,24,arc),c,x,y,z,n);}
ball(.19,.23,.09,0x244d4c,0,.27,0,'fabric');box(.34,.30,.16,0x244d4c,0,.18,0,'fabric');ball(.14,.105,.025,0x71312f,0,.13,.097,'fabric');box(.25,.018,.018,0xa87d41,0,.21,.104,'metal');for(const x of [-.11,.11]){const r=torus(.12,.014,0x172f30,x,.24,-.093,Math.PI*2,'fabric');r.scale.x=.42;}torus(.06,.012,0x192d2d,0,.474,0,Math.PI,'fabric');box(.058,.075,.008,0xd6c8a0,.07,.32,.092,'fabric');
g.updateMatrixWorld(true);const bounds=new THREE.Box3(),v=new THREE.Vector3();g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.z-=c.z;o.position.y-=bounds.min.y;});return g;}
