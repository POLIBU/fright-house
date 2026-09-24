// Fixed-camera solids retain the approved hall painting via projected scene textures.
export default function generate(THREE){const root=new THREE.Group(),material=new THREE.MeshStandardMaterial({color:0x645345});function part(name,floor){const g=new THREE.Group();g.name=name;g.userData.floor=floor;root.add(g);return g;}function box(g,x,y,w,h,d){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w*.05,h*.05,d),material);mesh.position.set((x+w/2-240)*.05,(360-y-h/2)*.05,d/2);g.add(mesh);return mesh;}
 const booth=part('ticket-counter',134);box(booth,73,101,77,29,.8);box(booth,73,61,5,42,.3);box(booth,143,60,6,43,.3);box(booth,71,48,80,15,.45);box(booth,72,98,79,7,.95);
 const door=part('staff-door',133);box(door,392,63,36,65,.4);box(door,387,56,5,74,.55);box(door,428,56,5,74,.55);box(door,387,54,46,7,.6);
 const shelf=part('lost-property',227);box(shelf,32,186,18,40,.45);box(shelf,33,184,27,5,.5);
 const lamp=part('counter-lamp',106);box(lamp,124,88,10,14,.25);box(lamp,122,100,14,3,.4);
 return root;}
