export default function(THREE){
const g=new THREE.Group(), M={};
function mat(c,n='timber',r=.82){const k=c+n+r;if(!M[k]){M[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:n==='metal'?.35:0});M[k].name=n;}return M[k];}
function mesh(geo,c,x,y,z,n='timber'){const m=new THREE.Mesh(geo,mat(c,n));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function box(w,h,d,c,x=0,y=0,z=0,n='timber'){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,n);}
function ball(w,h,d,c,x,y,z,n='plaster'){const m=mesh(new THREE.SphereGeometry(1,16,12),c,x,y,z,n);m.scale.set(w,h,d);return m;}
function torus(r,t,c,x,y,z,arc=Math.PI*2,n='metal'){return mesh(new THREE.TorusGeometry(r,t,6,24,arc),c,x,y,z,n);}

function rounded(w,h,d,c,x,y,z,n='timber',r=.03){const s=new THREE.Shape();s.moveTo(-w/2+r,0);s.lineTo(w/2-r,0);s.quadraticCurveTo(w/2,0,w/2,r);s.lineTo(w/2,h-r);s.quadraticCurveTo(w/2,h,w/2-r,h);s.lineTo(-w/2+r,h);s.quadraticCurveTo(-w/2,h,-w/2,h-r);s.lineTo(-w/2,r);s.quadraticCurveTo(-w/2,0,-w/2+r,0);return mesh(new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:5}),c,x,y,z-d/2,n);}
function rod(a,b,r,c,n='metal',r2=r){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),v=vb.clone().sub(va);const m=mesh(new THREE.CylinderGeometry(r2,r,v.length(),10),c,...va.clone().add(vb).multiplyScalar(.5).toArray(),n);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
for(const s of [-1,1]){rod([s*.12,.08,0],[s*.16,1.28,0],.05,0x172421,'fabric',.085);ball(.08,.06,.18,0x13201e,s*.12,.06,.06,'fabric');rod([s*.25,1.97,0],[s*.45,.68,.04],.03,0x26352c,'fabric',.075);rod([s*.45,.68,.04],[s*.46,.43,.06],.025,0x7a8875,'plaster',.04);}ball(.24,.49,.16,0x23372d,0,1.59,0,'fabric');const neck=mesh(new THREE.CylinderGeometry(.05,.07,.15,8),0x70806e,0,2.08,0);ball(.13,.31,.115,0x8c9a83,0,2.36,0);for(const s of [-1,1])ball(.025,.055,.013,0x1d2b24,s*.052,2.42,.103);ball(.029,.08,.01,0x334635,0,2.21,.109);
g.updateMatrixWorld(true);const bounds=new THREE.Box3(),v=new THREE.Vector3();g.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)bounds.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=bounds.getCenter(new THREE.Vector3());g.children.forEach(o=>{o.position.x-=c.x;o.position.z-=c.z;o.position.y-=bounds.min.y;});return g;}
