import ENV from "./env.js";
import {loadImage, loadJson} from "./utils/loaders.util.js";
import createSpriteSheet from "./utils/createSpriteSheet.util.js";
import animResolveFrame from "./utils/animResolveFrame.util.js";

export default class SpriteSheet {

	static load(filename) {
		let sheet;
		return loadJson(ENV.SPRITESHEET_DIR+filename)
				.then(s => sheet= s)
				.then(() => loadImage("./assets/"+sheet.img))
				.then((img) =>createSpriteSheet(filename, sheet, img));
	}

	constructor(img) {
		this.img= img;
		this.sprites= new Map();
		this.animations= new Map();
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

    defineAnim(name, animation) {
		if(!animation.loop)
			animation.loop= Infinity;
		animation.frameIdx= -1;
		animation.loopInitialValue= animation.loop;
		this.animations.set(name, animation);
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
	
	animFrame(name, time) {
        const animation= this.animations.get(name);
        return animResolveFrame(animation, time);
	}

	draw(name, ctx, x, y, flip = false) {
		if(this.sprites.has(name))
        	ctx.drawImage(this.sprites.get(name)[flip|0], x, y);
    }

    drawAnim(name, ctx, x, y, distance) {
        const animation= this.animations.get(name);
        this.draw(animResolveFrame(animation, distance), ctx, x, y);
    }


}