import SpriteSheet from "../Spritesheet.js";

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

	});

	if(sheet.animations)
		Object.entries(sheet.animations).forEach(([name, animDef]) => {
			s.defineAnim(name, animDef);
		});

	SpriteSheet.cache.set(filename, s);

	return s;
}