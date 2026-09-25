// Each of the nineteen floor finds has its own palette, cut and textile pattern.
export const WARDROBE=[
 ['red-striped-shirt',0x8c4238,0xcba58a,'stripes',0],['mustard-pinafore',0x927644,0x493e31,'plain',1],['blue-cardigan',0x435e77,0xbab7a0,'rib',2],['purple-coat',0x654a6e,0xa28e91,'checks',3],
 ['faded-denim-trousers',0x536c81,0xcbb895,'seams',0],['cream-red-socks',0xc5baa0,0x85443c,'stripes',0],['brown-leather-belt',0x613e2a,0xbba681,'plain',0],['round-wire-spectacles',0x9d916e,0xaaa8a1,'plain',0],
 ['green-check-shirt',0x425f4c,0xa8a47b,'checks',1],['pink-dotted-dress',0x986c77,0xd2bca5,'dots',2],['patched-grey-jumper',0x72777b,0x905b3e,'patch',3],['navy-school-coat',0x344552,0xa39974,'seams',0],
 ['olive-corduroy-trousers',0x707147,0xa8a17e,'rib',1],['blue-yellow-socks',0x426787,0xbba05e,'stripes',1],['red-woven-belt',0x87433c,0xc6b37a,'checks',1],['square-black-spectacles',0x282c34,0x8c9691,'plain',1],
 ['orange-collared-shirt',0x9b6038,0xe0bc87,'seams',2],['blue-floral-dress',0x557582,0xc9b7a1,'flowers',3],['cream-cable-jumper',0xb9ac8e,0x797052,'rib',1]
].map(([name,color,accent,pattern,cut],id)=>({id,name,color,accent,pattern,cut}));
