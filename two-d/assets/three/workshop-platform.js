// Connected operating platform assembled entirely from Three.js primitives.
export default function generate(THREE){
 const root=new THREE.Group(),steel=new THREE.MeshStandardMaterial({color:0x586560,metalness:.72,roughness:.5}),dark=new THREE.MeshStandardMaterial({color:0x252d2c,metalness:.5,roughness:.72}),brass=new THREE.MeshStandardMaterial({color:0x9e783c,metalness:.66,roughness:.5}),pad=new THREE.MeshStandardMaterial({color:0x3c4e45,roughness:.94}),red=new THREE.MeshStandardMaterial({color:0x731c1c,roughness:.8});
 const add=(g,m,x,y,z,parent=root)=>{const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);parent.add(mesh);return mesh;};
 add(new THREE.BoxGeometry(1,.09,.53),steel,0,.37,0);add(new THREE.BoxGeometry(.91,.025,.45),pad,0,.425,0);add(new THREE.BoxGeometry(.27,.05,.44),pad,-.30,.445,0).rotation.z=.12;
 for(const x of [-.38,.38]){for(const z of [-.18,.18]){add(new THREE.CylinderGeometry(.026,.034,.34,10),steel,x,.18,z);add(new THREE.CylinderGeometry(.065,.065,.055,12),dark,x,.035,z).rotation.x=Math.PI/2;}add(new THREE.BoxGeometry(.045,.04,.4),brass,x,.14,0);}
 add(new THREE.BoxGeometry(.77,.06,.09),dark,0,.14,0);
 for(const z of [-.27,.27]){add(new THREE.BoxGeometry(.88,.025,.02),brass,0,.49,z);for(const x of [-.43,.43])add(new THREE.CylinderGeometry(.009,.009,.13,8),brass,x,.435,z);}
 for(const x of [-.17,.17])add(new THREE.BoxGeometry(.03,.015,.46),red,x,.451,0);
 for(const x of [-.47,.47])for(const z of [-.23,.23])add(new THREE.SphereGeometry(.012,8,6),brass,x,.426,z);
 const motor=add(new THREE.CylinderGeometry(.065,.065,.18,12),dark,.1,.25,0);motor.rotation.z=Math.PI/2;
 const pedal=add(new THREE.BoxGeometry(.17,.025,.08),brass,.28,.07,.29);pedal.rotation.x=-.22;
 const bounds=new THREE.Box3().setFromObject(root),centre=bounds.getCenter(new THREE.Vector3());for(const part of root.children){part.position.y-=bounds.min.y;part.position.z-=centre.z;}
 return root;
}
