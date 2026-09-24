import * as THREE from 'three';
// Sculpted original mask: displaced shell, separate cheekbones, orbital rims and hinged mandible.
export function horrorHead({mechanical=false}={}){
 const root=new THREE.Group(),eyes=[],jaw=new THREE.Group();root.add(jaw);
 const mat=(color,roughness=.85,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const ivory=mat(mechanical?0x999d90:0xc1b58f),dark=mat(0x0c100e),red=mat(0x792720),blue=mat(0x226b75),tooth=mat(0xbab18b),steel=mat(0x50574e,.43,.75),hair=mat(0x732716);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#c9c3a8';ctx.fillRect(0,0,256,256);let seed=3781;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<4800;i++){const x=rand()*256,y=rand()*256;ctx.fillStyle=i%4?'#99957d55':'#4a48394a';ctx.fillRect(x,y,1+rand()*3,1+rand()*4);}ctx.strokeStyle='#4b4c394a';ctx.lineWidth=.6;for(let i=0;i<55;i++){let x=rand()*256,y=rand()*256;ctx.beginPath();ctx.moveTo(x,y);for(let j=0;j<6;j++){x+=rand()*12-6;y+=rand()*8;ctx.lineTo(x,y);}ctx.stroke();}const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;ivory.map=texture;ivory.bumpMap=texture;ivory.bumpScale=.005;
 function ell(parent,x,y,z,sx,sy,sz,m){const g=new THREE.SphereGeometry(1,28,20),p=g.attributes.position;for(let i=0;i<p.count;i++){const a=p.getX(i),b=p.getY(i),c=p.getZ(i),r=1+.016*Math.sin(a*47+b*33)*Math.cos(c*39);p.setXYZ(i,a*r,b*r,c*r);}g.computeVertexNormals();const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
 function tube(parent,points,r,m){const o=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),24,r,7,false),m);parent.add(o);return o;}
 ell(root,0,.23,0,.34,.39,.25,ivory);ell(root,0,-.04,-.08,.25,.23,.18,dark);
 for(const side of [-1,1]){
  ell(root,side*.25,-.005,.10,.09,.19,.14,ivory);ell(root,side*.143,.17,.207,.128,.115,.066,dark);
  const eye=new THREE.Group();eye.position.set(side*.143,.17,.253);root.add(eye);ell(eye,0,0,0,.075,.073,.052,tooth);ell(eye,0,0,.046,.035,.035,.013,mat(0x698b8b,.36));ell(eye,0,0,.056,.016,.021,.008,dark);ell(eye,-.01,.012,.063,.007,.007,.004,mat(0xd6ddd0,.15));eyes.push(eye);
  tube(root,[[side*.045,.24,.245],[side*.12,.29,.24],[side*.25,.25,.21]],.026,ivory);
  tube(root,[[side*.25,.11,.18],[side*.29,-.035,.18],[side*.24,-.12,.21]],.023,ivory);
  if(!mechanical){const paint=ell(root,side*.15,.395,.17,.068,.145,.034,blue);paint.rotation.z=side*.13;tube(root,[[side*.08,.27,.218],[side*.08,.50,.132],[side*.21,.49,.134]],.012,red);}
  for(let i=0;i<8;i++)tube(root,[[side*(.23-i*.003),.05-i*.028,.211],[side*(.27-i*.003),.035-i*.028,.203]],.0035,dark);
 }
 ell(root,0,.064,.26,.062,.093,.07,ivory);if(!mechanical)ell(root,0,.042,.33,.078,.068,.064,red);
 jaw.position.set(0,-.025,-.02);
 ell(jaw,0,-.17,.115,.24,.085,.13,ivory);ell(jaw,0,-.125,.205,.18,.054,.07,red);
 tube(root,[[-.24,-.075,.22],[-.15,-.038,.267],[0,-.045,.28],[.15,-.028,.25],[.24,-.075,.21]],.024,mechanical?steel:red);
 tube(jaw,[[-.23,-.09,.19],[-.19,-.18,.24],[0,-.23,.255],[.19,-.18,.24],[.23,-.09,.19]],.023,mechanical?steel:red);
 for(let i=0;i<10;i++){const x=(i-4.5)*.038;ell(root,x,-.073+Math.abs(x)*.09,.263,.017,.033+(i%3)*.004,.024,tooth);ell(jaw,x,-.18+Math.abs(x)*.19,.26,.016,.023,.022,tooth);}
 if(mechanical){for(const side of [-1,1]){ell(root,side*.295,.05,0,.044,.052,.03,steel);tube(root,[[side*.25,.02,0],[side*.25,-.22,.10]],.018,steel);}for(let i=0;i<12;i++){const a=i*2.4;tube(root,[[Math.sin(a)*.2,-.2,-.1],[Math.sin(a)*.27,-.38-i*.018,-.07],[Math.cos(a)*.18,-.52-i*.022,.08]],.006,i%3?steel:red);}}
 else for(const side of [-1,1])for(let i=0;i<30;i++){const a=i*.71;tube(root,[[side*(.27+.035*Math.sin(a)),.36-i%5*.05,-.045-i%4*.03],[side*(.38+.08*Math.sin(a)),.04,-.09+Math.cos(a)*.12],[side*(.40+.1*Math.sin(a)), -.34-i%6*.045,-.1+Math.cos(a)*.13]],.012,hair);}
 let mouth=0;
 return {root,update(t,{speaking=0,lookX=0,lookY=0,clank=false}={}){mouth=speaking? .20+Math.abs(Math.sin(t*15)*Math.cos(t*6))*.65:clank?.22+.5*Math.max(0,Math.sin(t*8)):.13+Math.sin(t*1.7)*.045;jaw.rotation.x=mouth;for(const [i,e] of eyes.entries()){e.rotation.y=THREE.MathUtils.clamp(lookX+Math.sin(t*.7+i)*.06,-.42,.42);e.rotation.x=THREE.MathUtils.clamp(lookY+Math.sin(t*1.1)*.04,-.24,.24);}root.rotation.z=Math.sin(t*.53)*.025;root.userData.mouth=mouth;},eyes,jaw};
}
