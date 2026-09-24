import {LIBRARY_WIDTH} from './levels/library-model.js';
// Extend the approved wood-and-wallpaper architecture with a continuous corridor.
export function createLibraryBackdrop(image){const c=document.createElement('canvas');c.width=LIBRARY_WIDTH;c.height=360;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#020404';x.fillRect(0,0,c.width,c.height);x.drawImage(image,0,0,480,360);const sx=image.width/480,sy=image.height/360;
function patch(a,b,w,h,dx,dy,dw=w,dh=h){x.drawImage(image,a*sx,b*sy,w*sx,h*sy,dx,dy,dw,dh);}
for(let p=480;p<LIBRARY_WIDTH;p+=120){patch(135,8,120,105,p,8,120,108);for(let y=120;y<278;y+=79)patch(339,133,100,79,p,y,120,79);patch(115,269,120,12,p,278);}
// The joining opening removes the former painted right wall at floor level.
patch(350,175,85,61,431,187,62,61);x.fillStyle='#443124';x.fillRect(432,181,60,6);x.fillStyle='#986c40';x.fillRect(434,184,58,2);x.fillStyle='#2a211b';x.fillRect(470,187,5,8);x.fillRect(470,240,5,10);x.fillStyle='#201812';x.fillRect(436,172,52,13);x.fillStyle='#d2b686';x.font='6px monospace';x.fillText('ARCHIVE →',441,181);
x.fillStyle='#201b16';x.fillRect(LIBRARY_WIDTH-12,8,12,282);x.fillStyle='#72513a';x.fillRect(LIBRARY_WIDTH-12,8,3,282);x.fillStyle='#080c09';x.fillRect(1587,28,48,91);x.fillStyle='#4e2620';x.fillRect(1582,24,6,95);x.fillRect(1635,24,6,95);x.fillRect(1582,24,59,6);
// Individual wall lights and section numbers break up the long run of shelving.
for(const [i,p]of [500,700,910,1140,1380,1580].entries()){x.fillStyle='#513c27';x.fillRect(p,35,4,23);x.fillStyle=i%2?'#79946b':'#b29b5b';x.fillRect(p-2,37,8,11);x.fillStyle='#d8c18a';x.font='7px monospace';x.fillText(['I','II','III','IV','V','VI'][i],p+13,70);}
return c;}
