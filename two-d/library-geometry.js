// Project the approved doorway finish onto solid jambs and a raised lintel.
// Only the two floor contacts block movement; the opening between is walkable.
export default function generate(THREE){const root=new THREE.Group(),mat=new THREE.MeshBasicMaterial();function frame(name,depth,points){const group=new THREE.Group();group.name=name;group.userData.floor=depth;root.add(group);const shape=new THREE.Shape();points.forEach(([x,y],i)=>shape[i?'lineTo':'moveTo']((x-240)*.05,(360-y)*.05));shape.closePath();const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.34,bevelEnabled:false}),mat);mesh.userData.solidVolume=true;group.add(mesh);}
frame('library-entry-left',264,[[63,202],[68,204],[68,264],[63,262]]);
frame('library-entry-right',273,[[88,222],[94,223],[94,274],[88,273]]);
frame('library-entry-lintel',274,[[63,202],[94,222],[94,227],[63,207]]);
return root;}
