export default function(THREE){
const g=new THREE.Group(), M={};
function mat(c,n='timber',r=.82){const k=c+n+r;if(!M[k]){M[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:n==='metal'?.35:0});M[k].name=n;}return M[k];}
function mesh(geo,c,x,y,z,n='timber'){const m=new THREE.Mesh(geo,mat(c,n));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function box(w,h,d,c,x=0,y=0,z=0,n='timber'){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,n);}
function ball(w,h,d,c,x,y,z,n='plaster'){const m=mesh(new THREE.SphereGeometry(1,16,12),c,x,y,z,n);m.scale.set(w,h,d);return m;}
function torus(r,t,c,x,y,z,arc=Math.PI*2,n='metal'){return mesh(new THREE.TorusGeometry(r,t,6,24,arc),c,x,y,z,n);}
box(.43,.13,.27,0x242b29,0,.065,0,'metal');box(.24,.006,.16,0x3f4841,-.04,.134,-.015,'metal');box(.18,.006,.095,0xafa783,-.04,.14,-.012,'metal');for(const x of [-.087,.007]){const m=mesh(new THREE.CylinderGeometry(.031,.031,.01,18),0x262b24,x,.149,-.012,'metal');}for(let i=0;i<5;i++)box(.046,.018,.042,i===0?0x71312f:0xd6c8a0,-.12+i*.051,.137,.106,'metal');for(let i=0;i<8;i++)box(.002,.005,.15,0x111717,.109+i*.011,.132,-.012,'metal');box(.075,.009,.13,0x202723,.135,.14,-.012,'metal');
g.updateMatrixWorld(true);const bounds=new THREE.Box3(),v=new THREE.Vector3();g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.z-=c.z;o.position.y-=bounds.min.y;});return g;}
