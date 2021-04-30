import SpriteSheet from "../spritesheet.js";

export default function createSpriteSheet(filename, sheet, img) {
	const s= new SpriteSheet(img);

	Object.entries(sheet.sprites).forEach(([key, value]) => {

		if(value.rects)
			value.rects.forEach(([x,y,w,h], idx)=> {
				s.define(key+"-"+idx, x, y, w, h, {scale: value.scale});
			});

		if(value.rect) {
			const [x,y,w,h]= value.rect;
			s.define(key, x, y, w, h, {scale: value.scale});
		}

		if(value.sprites) {
			s.defineComplex(key, value.sprites);
		}

		if(value.tiles) {
			const tiles= value.tiles;
			const [x,y]= tiles.pos;
			const [w,h]= tiles.size;
			let [dx,dy]= tiles.increment;
			dx*= w;
			dy*= h;
			for(let idx= 0; idx<tiles.count; idx++) {
				s.define(key+"-"+idx, x+(idx*dx), y+(idx*dy), w*value.scale, h*value.scale, {scale: value.scale});	
			}
		}

	});

	if(sheet.animations)
		Object.entries(sheet.animations).forEach(([name, animDef]) => {
			s.defineAnim(name, animDef);
		});

	return s;
}