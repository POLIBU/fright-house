// A leaf hinged in the side wall: closed edge-on, opening inward above the passage.
export default function generate(THREE){
 const root=new THREE.Group();root.matrixAutoUpdate=false;
 const wood=new THREE.MeshStandardMaterial({color:0x613c2a,roughness:.9}),panel=new THREE.MeshStandardMaterial({color:0x493125,roughness:.95}),metal=new THREE.MeshStandardMaterial({color:0x9a8556,metalness:.6,roughness:.55});
 function box(x,y,z,w,h,d,material){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);root.add(m);}
 box(21,33,0,42,66,2,wood);box(21,49,1.1,31,22,.7,panel);box(21,18,1.1,31,24,.7,panel);box(36,32,2,3,5,2,metal);
 for(const y of [10,55])box(1,y,1,2,5,2,metal);
 root.userData.setOpen=progress=>{const angle=-(1-progress)*Math.PI/2,c=Math.cos(angle),s=Math.sin(angle);root.matrix.set(c,0,s,96-240, s,1,0,180-204, -.6*s,0,c,1, 0,0,0,1);root.matrixWorldNeedsUpdate=true;root.userData.angle=-progress*1.55;};root.userData.setOpen(0);return root;
}
