// Project the approved doorway finish onto solid jambs and a raised lintel.
// Only the two floor contacts block movement; the opening between is walkable.
export default function generate(THREE){const root=new THREE.Group(),mat=new THREE.MeshBasicMaterial();function frame(name,depth,points){const group=new THREE.Group();group.name=name;group.userData.floor=depth;root.add(group);const shape=new THREE.Shape();points.forEach(([x,y],i)=>shape[i?'lineTo':'moveTo']((x-240)*.05,(360-y)*.05));shape.closePath();const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.34,bevelEnabled:false}),mat);mesh.userData.solidVolume=true;group.add(mesh);}
frame('library-entry-left',276,[[63,204],[68,207],[68,276],[63,273]]);
frame('library-entry-right',294,[[85,224],[91,224],[91,294],[85,290]]);
frame('library-entry-lintel',294,[[63,204],[91,223],[91,229],[63,210]]);
return root;}
