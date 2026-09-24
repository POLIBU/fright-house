// Original procedural fly. Articulated wing pivots are driven by level time.
export default function generate(THREE){
 const root=new THREE.Group(),body=new THREE.MeshStandardMaterial({color:0x252a22,roughness:.8}),eyes=new THREE.MeshStandardMaterial({color:0x564330,roughness:.5}),wing=new THREE.MeshStandardMaterial({color:0xa0a899,transparent:true,opacity:.58,roughness:.35,side:THREE.DoubleSide,depthWrite:false});
 function oval(parent,x,y,z,sx,sy,sz,material){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),material);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;}
 oval(root,0,.009,0,.004,.0045,.008,body);oval(root,0,.01,.009,.004,.004,.0035,eyes);
 for(const side of [-1,1]){
  const pivot=new THREE.Group();pivot.name=side<0?'wing-left':'wing-right';pivot.position.set(side*.002,.012,.002);root.add(pivot);oval(pivot,side*.007,0,-.003,.009,.0007,.004,wing);
  for(let i=0;i<3;i++){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.0004,.0004,.009,4),body);leg.position.set(side*.0045,.0045,(i-1)*.005);leg.rotation.z=side*.5;root.add(leg);}
 }
 const bounds=new THREE.Box3().setFromObject(root),center=bounds.getCenter(new THREE.Vector3());for(const part of root.children){part.position.x-=center.x;part.position.y-=bounds.min.y;part.position.z-=center.z;}return root;
}
