import ENV from "./env.js";
import {loadImage, loadJson} from "./loaders.js";

function createSheet(filename, sheet, img) {
	const s= new SpriteSheet(img);

	Object.entries(sheet.sprites).forEach(([key, value]) => {

		if(value.imgs)
			value.imgs.forEach(([x,y,w,h], idx)=> {
				s.define(key+"-"+idx, x, y, w, h, {scale: value.scale});
			});

		if(value.img) {
			const [x,y,w,h]= value.img;
			s.define(key, x, y, w, h, {scale: value.scale});
		}

		if(value.sprites) {
			s.defineComplex(key, value.sprites);
		}

	});

	SpriteSheet.cache.set(filename, s);

	return s;
}

export default class SpriteSheet {

	static cache= new Map();
	static retrieve(name) {
		if(!SpriteSheet.cache.has(name))
			throw new Error(`Unable to find Spritesheet ${name}!`);

		return SpriteSheet.cache.get(name);
	}
	static load(filename) {
		if(SpriteSheet.cache.has(filename))
			throw new Error(`Spritesheet ${filename} was already loaded!`);

		let sheet;
		return loadJson(ENV.SPRITESHEET_DIR+filename)
				.then(s => sheet= s)
				.then(() => loadImage("./assets/"+sheet.img))
				.then((img) =>createSheet(filename, sheet, img));
	}

	constructor(img) {
		this.img= img;
		this.sprites= new Map();
	}	

	define(name, x, y, w, h, {flip, scale}) {
        const sprites = [false, true].map(flip => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

			canvas.width = w;
            canvas.height = h;

			if(scale)
				ctx.scale(scale, scale);

            if (flip) {
                ctx.scale(-1, 1);
                ctx.translate(-w, 0);
            }

            ctx.drawImage(
                this.img,
                x, y, w, h,
                0, 0, w, h);

            return canvas;
        });
        this.sprites.set(name, sprites);
	}

	defineComplex(name, spriteDef) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		{
			let width= 0, height= 0;
			spriteDef.forEach(([offsets, name]) => {
				const [col, row, countX, countY]= offsets;
				const s= this.spriteSize(name);
	
				if(countY) {
					height+= s.y*countY;
				}
				if(countX) {
					width+= s.x*countX;
				}
	
				if(width<s.x)
					width= s.x;
				if(height<s.y)
					height= s.y;
			});
	
			canvas.width = width;
			canvas.height = height;
		}

		let width= 0, height= 0;
		let x= 0, y= 0;
		let dx= 0, dy= 0;

		spriteDef.forEach(([offsets, name]) => {
			const [col, row, countX, countY]= offsets;
			const s= this.spriteSize(name);
			if(countY) {
				dy= height;
				height+= s.y*countY;
			}
			if(countX) {
				dx= width;
				width+= s.x*countX;
			}
			if(width<s.x)
				width= s.x;
			if(height<s.y)
				height= s.y;

			if(countY>1) {
				for(let idx= 0; idx <countY; idx++) {
					ctx.drawImage(
						this.sprites.get(name)[0],
						x, y, s.x, s.y,
						dx, dy, s.x, s.y);			
					dy+= s.y;
				}
			} else
			if(countX>1) {
				for(let idx= 0; idx <countX; idx++) {
					ctx.drawImage(
						this.sprites.get(name)[0],
						x, y, s.x, s.y,
						dx, dy, s.x, s.y);			
					dx+= s.x;
				}
			} else
				ctx.drawImage(
					this.sprites.get(name)[0],
					x, y, s.x, s.y,
					dx, dy, s.x, s.y);			
		});

        this.sprites.set(name, [canvas]);
	}

	draw(name, ctx, x, y, flip = false) {
		if(this.sprites.has(name))
        	ctx.drawImage(this.sprites.get(name)[flip|0], x, y);
    }

	has(name) {
		return this.sprites.has(name);
	}

	spriteSize(name) {
		if(!this.sprites.has(name)) {
			throw new Error(`Unable to find sprite ${name}`);
		}
		const sprite= this.sprites.get(name)[0];
		return {x: sprite.width, y: sprite.height};
	}
}

window.sscache= SpriteSheet.cache;