export default function(THREE){
const g=new THREE.Group(), M={};
function mat(c,n='timber',r=.82){const k=c+n+r;if(!M[k]){M[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:n==='metal'?.35:0});M[k].name=n;}return M[k];}
function mesh(geo,c,x,y,z,n='timber'){const m=new THREE.Mesh(geo,mat(c,n));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function box(w,h,d,c,x=0,y=0,z=0,n='timber'){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,n);}
function ball(w,h,d,c,x,y,z,n='plaster'){const m=mesh(new THREE.SphereGeometry(1,16,12),c,x,y,z,n);m.scale.set(w,h,d);return m;}
function torus(r,t,c,x,y,z,arc=Math.PI*2,n='metal'){return mesh(new THREE.TorusGeometry(r,t,6,24,arc),c,x,y,z,n);}
g.userData.mounts='back';ball(.52,.79,.055,0xd6c8a0,0,.9,0);for(const s of [-1,1]){ball(.115,.21,.025,0x241d1b,s*.19,1.07,.061);ball(.053,.12,.02,0xd6c8a0,s*.16,1.06,.085);ball(.064,.09,.025,0x71312f,s*.35,.82,.057);const brow=torus(.145,.027,0x32221e,s*.2,1.23,.06,Math.PI,'timber');brow.rotation.z=s*.25;}ball(.061,.14,.075,0x71312f,0,.89,.082);ball(.33,.20,.03,0x271f1a,0,.59,.066);ball(.30,.105,.035,0xd6c8a0,0,.65,.09);for(let i=-3;i<=3;i++)box(.008,.08,.012,0x4b3026,i*.069,.63,.128);
g.updateMatrixWorld(true);const bounds=new THREE.Box3(),v=new THREE.Vector3();g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.z-=c.z;o.position.y-=bounds.min.y;});return g;}
