export default function(THREE){
 const cfg={"title":"The Usher","width":0.46,"depth":0.3,"temple":0.05,"brow":0.085,"browTilt":0.03,"cheek":0.045,"hollow":0.048,"nose":1.18,"noseBend":0.08,"fold":0.021,"jowl":0.018,"age":4,"asym":0.007,"cant":0.008,"mouthWidth":0.18,"smile":0.011,"sneer":0.012,"gape":0.018,"lip":0.012,"eyeOpen":0.024,"shut":0,"missing":0,"gaze":-0.01,"stray":0.005,"skin":11443591,"lips":7888983,"iris":5659476,"paint":6443846,"teeth":false,"missingTooth":2,"cracks":2,"staples":true};

 const group=new THREE.Group();group.userData.mounts='back';group.userData.design=cfg.title;
 const skinColor=new THREE.Color(cfg.skin),shadowColor=new THREE.Color(0x54453e),rawColor=new THREE.Color(0x9b8c70);
 const skin=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.79,metalness:0});skin.name='plaster';
 const featureSkin=new THREE.MeshStandardMaterial({color:new THREE.Color(cfg.skin).multiplyScalar(.84),roughness:.80});featureSkin.name='plaster';
 const lipMat=new THREE.MeshStandardMaterial({color:cfg.lips,roughness:.83});lipMat.name='plaster';
 const dark=new THREE.MeshStandardMaterial({color:0x141213,roughness:1});
 const bone=new THREE.MeshStandardMaterial({color:0xaaa18b,roughness:.78});
 const eyeWhite=new THREE.MeshStandardMaterial({color:0xb5b3a6,roughness:.37});
 const irisMat=new THREE.MeshStandardMaterial({color:cfg.iris,roughness:.40});
 const pupilMat=new THREE.MeshStandardMaterial({color:0x070c0d,roughness:.17});
 const metal=new THREE.MeshStandardMaterial({color:0x665449,metalness:.5,roughness:.7});metal.name='metal';
 const gauss=(x,y,cx,cy,sx,sy)=>Math.exp(-.5*(((x-cx)/sx)**2+((y-cy)/sy)**2));
 const width=y=>cfg.width*(1-.19*gauss(0,y,0,-.55,1,.19)+.045*gauss(0,y,0,-.08,1,.12));
 const eyeY=s=>.145+s*cfg.cant;
 const mouthY=x=>-.335+cfg.smile*(x/cfg.mouthWidth)**2+cfg.sneer*x;
 const opening=x=>cfg.gape*Math.sqrt(Math.max(0,1-(x/cfg.mouthWidth)**2));
 function sculpt(x,y){
  const ax=Math.abs(x);let d=0;
  d+=.026*gauss(x,y,0,.53,.32,.18); // frontal eminence
  d-=cfg.temple*gauss(ax,y,.36,.30,.084,.19);
  d+=cfg.brow*gauss(ax,y,.19,.265+cfg.browTilt*x,.135,.043); // supraorbital ridge
  d-=.145*gauss(ax,y,.187,eyeY(Math.sign(x)),.100,.081); // joined orbital concavity
  d+=cfg.cheek*gauss(ax,y,.295,-.02,.076,.10); // zygomatic arch
  d-=cfg.hollow*gauss(ax,y,.30,-.205,.095,.13);
  d+=cfg.nose*.100*gauss(x,y,cfg.noseBend*y,.055,.047,.18); // dorsum
  d+=cfg.nose*.135*gauss(x,y,-cfg.noseBend*.16,-.125,.070,.049); // tip, continuous with skin
  d+=.047*gauss(ax,y,.078,-.153,.030,.028); // alar cartilage
  d-=.023*gauss(ax,y,.058,-.174,.022,.013); // nasal sill
  d+=.019*gauss(ax,y,.023,-.227,.016,.040); // philtral columns
  d-=.016*gauss(x,y,0,-.233,.012,.04);
  d+=.027*gauss(x,y,0,-.31,.22,.10); // orbicularis oris
  d+=.035*gauss(x,y,0,-.51,.17,.052); // chin eminence
  d-=.018*gauss(x,y,0,-.447,.17,.027); // labiomental crease
  const foldX=.105+(Math.max(0,-y-.15))*.54;
  d-=cfg.fold*gauss(ax,y,foldX,-.267,.014,.103); // nasolabial folds
  d+=cfg.jowl*gauss(ax,y,.28,-.43,.078,.098);
  d-=.011*gauss(x,y,.022,.32,.008,.065);d-=.009*gauss(x,y,-.025,.34,.009,.07);
  for(let i=0;i<cfg.age;i++){const line=.365+i*.071+.008*Math.cos(x*11+i);d-=.0048*gauss(0,y,0,line,1,.006)*Math.exp(-((x/.32)**4));}
  d+=.0004*Math.sin(x*65+y*49)*Math.sin(y*73-x*32); // very shallow worn casting surface
  return d;
 }
 function front(x,y){const sy=(y-.045)/.805;return cfg.depth*Math.sqrt(Math.max(.015,1-sy*sy-(x/width(y))**2))+sculpt(x,y);}
 const geo=new THREE.SphereGeometry(1,128,96),p=geo.attributes.position,colors=new Float32Array(p.count*3);
 for(let i=0;i<p.count;i++){
  const sy=p.getY(i),y=sy*.805+.045,x=p.getX(i)*width(y),z=p.getZ(i)*cfg.depth;
  const facing=Math.max(0,p.getZ(i));const shift=sculpt(x,y)*Math.min(1,facing*4);
  const asym=cfg.asym*Math.sin(y*3)*facing;
  p.setXYZ(i,x+asym,y,z+shift);
  const orbit=gauss(Math.abs(x),y,.19,.14,.13,.12),fold=gauss(Math.abs(x),y,.12+Math.max(0,-y-.15)*.54,-.27,.020,.12);
  const mottling=Math.sin(x*43+Math.sin(y*29)*2)*Math.sin(y*57-x*11)*.022+Math.sin(x*13+y*19)*.018;
  const c=skinColor.clone().multiplyScalar(.95+mottling);c.lerp(shadowColor,Math.min(.40,(orbit*.24+fold*.08)*facing));
  if(cfg.paint){const paint=gauss(Math.abs(x),y,.19,.14,.10,.06)*.22+gauss(Math.abs(x),y,.26,-.19,.055,.10)*.15;c.lerp(new THREE.Color(cfg.paint),paint*facing);}
  const worn=Math.sin(x*77+y*23)*Math.sin(y*87-x*31);if(worn>.79&&facing>.1)c.lerp(rawColor,.30);
  c.toArray(colors,i*3);
 }
 geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
 // Remove triangles at the real eye and mouth apertures. Their vertices come from
 // SphereGeometry; there is no downloaded mesh or literal vertex data.
 const index=geo.index.array,kept=[];
 for(let i=0;i<index.length;i+=3){let x=0,y=0,z=0;for(let j=0;j<3;j++){x+=p.getX(index[i+j])/3;y+=p.getY(index[i+j])/3;z+=p.getZ(index[i+j])/3;}
  let cut=false;if(z>0){for(const s of [-1,1]){const xx=(x-s*.187)/.103,yy=(y-eyeY(s)-s*.07*(x-s*.187))/(cfg.shut===s?.009:cfg.eyeOpen);if(xx*xx+yy*yy<1)cut=true;}
   if(Math.abs(x)<cfg.mouthWidth&&Math.abs(y-mouthY(x))<opening(x))cut=true;}
  if(!cut)kept.push(index[i],index[i+1],index[i+2]);
 }
 geo.setIndex(kept);geo.computeVertexNormals();add(geo,skin);
 function add(geometry,material,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;group.add(m);return m;}
 function oval(rx,ry,rz,mat,x,y,z,segments=32){const m=add(new THREE.SphereGeometry(1,segments,14),mat,x,y,z);m.scale.set(rx,ry,rz);return m;}
 function curve(points,r,mat,segments=40){return add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(a=>new THREE.Vector3(...a))),segments,r,7,false),mat);}
 function surfaceCurve(points,r,mat,offset=.002){return curve(points.map(([x,y])=>[x,y,front(x,y)+offset]),r,mat,Math.max(6,points.length*4));}
 // Anatomical ears: concha, helix and antihelix are separate nested forms.
 for(const s of [-1,1]){
  const ear=oval(.077,.147,.055,featureSkin,s*(cfg.width-.005),-.004,.016);ear.rotation.z=s*-.12;
  oval(.035,.085,.012,dark,s*(cfg.width+.013),.002,.066,24);
  const outer=[];for(let j=0;j<=26;j++){const a=j/26*Math.PI*2;outer.push([s*(cfg.width+.015+Math.cos(a)*.047),.008+Math.sin(a)*.118,.077+.007*Math.sin(a)]);}curve(outer,.012,featureSkin,48);
  curve([[s*(cfg.width+.020),-.058,.083],[s*(cfg.width-.009),-.005,.091],[s*(cfg.width+.025),.067,.083]],.011,featureSkin,24);
  oval(.029,.038,.034,featureSkin,s*(cfg.width+.008),-.13,.034,24);
  const y=eyeY(s),z=front(s*.187,y);
  oval(.101,.064,.054,dark,s*.187,y,z-.034);
  if(cfg.missing!==s&&cfg.shut!==s){
   oval(.090,.054,.051,eyeWhite,s*.187,y,z-.025);
   const ix=s*.187+cfg.gaze+(s===1?cfg.stray:0),iy=y-.003;
   oval(.027,.028,.006,irisMat,ix,iy,z+.024,32);
   oval(.011,.014,.003,pupilMat,ix,iy,z+.031,24);
   oval(.004,.005,.002,new THREE.MeshStandardMaterial({color:0xe8dfc1,roughness:.12}),ix-.007,iy+.011,z+.034,16);
  }
  for(const upper of [true,false]){const pts=[];for(let j=0;j<=22;j++){const u=-1+j/11,x=s*.187+u*.104,ry=cfg.shut===s?.009:cfg.eyeOpen;const yy=y+s*.07*u*.104+(upper?1:-1)*ry*Math.sqrt(Math.max(0,1-u*u));pts.push([x,yy,front(x,yy)+.006]);}curve(pts,upper?.0055:.0045,featureSkin,36);}
  surfaceCurve([[s*.085,y-.078],[s*.15,y-.098],[s*.235,y-.093],[s*.298,y-.065]],.0045,featureSkin,.003);
  // Eyebrows use short, sparse individual bristles, not painted cartoon arches.
  for(let k=0;k<17;k++){const x=s*(.08+k*.0125),y=.253+.037*Math.sin(k/16*Math.PI)+cfg.browTilt*x;surfaceCurve([[x,y],[x+s*.006,y+.013]],.0018,dark,.003);}
  for(let j=0;j<3;j++)surfaceCurve([[s*.286,y-.025],[s*(.32+j*.009),y-.045-j*.018],[s*(.35+j*.005),y-.06-j*.023]],.0025,lipMat,.001);
 }
 // Paired nostrils tucked below a modeled bridge, tip and alar wings.
 for(const s of [-1,1]){const x=s*.052-cfg.noseBend*.16,y=-.17;oval(.026,.011,.007,dark,x,y,front(x,y)+.003,24);}
 // Lips are continuous swept contours, with a philtrum and separate oral cavity.
 const oral=new THREE.PlaneGeometry(cfg.mouthWidth*2.04,2,40,8),op=oral.attributes.position;for(let i=0;i<op.count;i++){const x=op.getX(i),y=mouthY(x)+op.getY(i)*opening(x)*1.10;op.setXYZ(i,x,y,front(x,y)-.045);}oral.computeVertexNormals();add(oral,dark);
 for(const upper of [true,false]){const pts=[];for(let i=0;i<=44;i++){const x=-cfg.mouthWidth+i/44*cfg.mouthWidth*2;const cupid=upper?.010*Math.cos(x/cfg.mouthWidth*Math.PI*2)*Math.exp(-((x/.12)**2)):0;const y=mouthY(x)+(upper?1:-1)*opening(x)+cupid;pts.push([x,y,front(x,y)+.012]);}curve(pts,upper?cfg.lip*.82:cfg.lip,lipMat,68);}
 if(cfg.teeth){for(let i=-3;i<=3;i++){if(i===cfg.missingTooth)continue;const x=i*.039,y=mouthY(x)+opening(x)-.033;const t=oval(.017,.034,.025,bone,x,y,front(x,y)-.028,20);t.rotation.z=i*-.045;}}
 // A few hairline cracks follow the facial surface; wire staples span a split.
 for(let j=0;j<cfg.cracks;j++){const s=j%2?-1:1,yy=.64-j*.17,xx=s*(.23+j*.016);const pts=[[xx,yy],[xx-s*.04,yy-.07],[xx-s*.022,yy-.105],[xx-s*.06,yy-.18]];surfaceCurve(pts,.0025,dark,.002);if(j===1&&cfg.staples){for(let k=0;k<3;k++){const y=yy-.03-k*.05,x=xx-s*.023;surfaceCurve([[x-.022,y-.006],[x+.025,y+.006]],.0027,metal,.012);}}}
 // Thin irregular rear shell lip, hanging lugs, and rusty fastening heads.
 for(const s of [-1,1]){oval(.018,.018,.010,metal,s*.32,.35,-.23,16);const bracket=add(new THREE.BoxGeometry(.06,.18,.035),metal,s*.30,.32,-.20);}
 group.updateMatrixWorld(true);group.traverse(o=>{if(!o.isMesh)return;o.geometry=o.geometry.clone().applyMatrix4(o.matrixWorld);const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const y=a.getY(i);a.setY(i,y>.32?.32+(y-.32)*.70:y<-.52?-.52+(y+.52)*.72:y);}a.needsUpdate=true;o.geometry.computeVertexNormals();o.position.set(0,0,0);o.rotation.set(0,0,0);o.scale.set(1,1,1);});group.updateMatrixWorld(true);const bounds=new THREE.Box3(),v=new THREE.Vector3();group.traverse(o=>{if(o.isMesh){const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++)bounds.expandByPoint(v.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld));}});const center=bounds.getCenter(new THREE.Vector3());group.children.forEach(o=>{o.position.x-=center.x;o.position.y-=bounds.min.y;o.position.z-=center.z;});return group;
}
