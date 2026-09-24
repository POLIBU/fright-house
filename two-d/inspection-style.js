import * as THREE from '../vendor/three.module.js';
// Inverted hulls follow each procedural mesh and its animated parent transforms.
export function outlineInspection(root){const meshes=[];root.traverse(o=>{if(o.isMesh&&!o.userData.inspectionOutline&&!o.userData.outlined&&!o.material?.transparent)meshes.push(o);});const material=new THREE.MeshBasicMaterial({color:0x080909,side:THREE.BackSide});for(const mesh of meshes){mesh.userData.outlined=true;const hull=new THREE.Mesh(mesh.geometry,material);hull.name='inspection-ink-outline';hull.userData.inspectionOutline=true;hull.scale.setScalar(1.035);mesh.add(hull);}return root;}

export function setInspectionBackdrop(canvas){canvas.style.setProperty('background','repeating-conic-gradient(#eee 0% 25%,#191919 0% 50%) 0 0 / 48px 48px','important');canvas.dataset.inspectionBackdrop='checkerboard';}
