export default function(THREE){
const g=new THREE.Group(), M={};
function mat(c,n='timber',r=.82){const k=c+n+r;if(!M[k]){M[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:n==='metal'?.35:0});M[k].name=n;}return M[k];}
function mesh(geo,c,x,y,z,n='timber'){const m=new THREE.Mesh(geo,mat(c,n));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function box(w,h,d,c,x=0,y=0,z=0,n='timber'){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,n);}
function ball(w,h,d,c,x,y,z,n='plaster'){const m=mesh(new THREE.SphereGeometry(1,16,12),c,x,y,z,n);m.scale.set(w,h,d);return m;}
function torus(r,t,c,x,y,z,arc=Math.PI*2,n='metal'){return mesh(new THREE.TorusGeometry(r,t,6,24,arc),c,x,y,z,n);}
g.userData.mounts='back';box(1.35,2.65,.14,0x17302e,0,1.325,0,'metal');box(1.16,2.42,.06,0x244d4c,0,1.29,.10,'metal');for(const x of [-.63,.63])box(.065,2.66,.20,0xa87d41,x,1.33,.03,'metal');box(1.36,.07,.20,0xa87d41,0,2.63,.03,'metal');box(.4,.29,.03,0x121d1d,0,1.97,.147,'metal');for(let x=-.18;x<.2;x+=.045)box(.014,.28,.02,0x927f52,x,1.97,.17,'metal');box(.065,.23,.043,0xa87d41,.43,1.17,.17,'metal');box(.19,.033,.045,0x9e996f,.35,1.17,.21,'metal');for(let i=0;i<4;i++)box(.65,.012,.015,0x111f1d,0,.45+i*.065,.143,'metal');
g.updateMatrixWorld(true);const bounds=new THREE.Box3(),v=new THREE.Vector3();g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.z-=c.z;o.position.y-=bounds.min.y;});return g;}
