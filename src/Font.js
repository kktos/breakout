import SpriteSheet from './Spritesheet.js';
import ENV from "./env.js";
import {loadImage, loadJson} from './utils/loaders.util.js';

// const CHARS= ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ©!-×.';
export const Align= {
    Left: 1,
    Center: 2,
    Right: 3
}

function loadFont(sheet) {
    return loadImage(sheet.img)
        .then(image => {
            const fontSprite= new SpriteSheet(image);
            const offsetX= sheet.offsetX|0;
            const offsetY= sheet.offsetY|0;
            const gapX= sheet.gapX|0;
            const rowLen= image.width;
            for (const [index, char] of [...sheet.charset].entries()) {
                const x= offsetX + index * (sheet.width+gapX) % rowLen;
                const y= offsetY + Math.floor(index * (sheet.width+gapX) / rowLen) * sheet.width;
                fontSprite.define(char, x, y, sheet.width, sheet.height);
            }

            return new Font(sheet.name, fontSprite, sheet.width);
        });
}

export default class Font {
	static load(filename) {
		return loadJson(ENV.FONTS_PATH + filename)
					.then(sheet => loadFont(sheet));
	}

    constructor(name, sprites, size) {
        this.name= name;
        this.sprites= sprites;
        this.spriteSize= size;
        this.size= 1;
        this.align= Align.Left;
        this.cache= new Map();
    }

    get height() {
        return this.spriteSize*this.size;
    }

    textRect(text, x, y) {
        const str= String(text).toUpperCase();
        const width= str.length*this.height;
        switch(this.align) {
            case Align.Center:
                x-= width / 2;
                break;
            case Align.Right:
                x-= width;
                break;
        }
        return [x, y, x+width, y+this.height];
    }

    print(context, text, x, y, color="#fff") {
        const key= JSON.stringify([text,x,y,color]);
        if(!this.cache.has(key)) {
            const canvas= document.createElement('canvas');
            const ctx= canvas.getContext('2d');
            const str= String(text).toUpperCase();
    
            canvas.width= str.length*this.height;
            canvas.height= this.height;
    
            ctx.imageSmoothingEnabled= false;
            [...str].forEach((char, pos) => {
                    this.sprites.draw(char, ctx, pos * this.height, 0, {zoom: this.size});
            });
            
            ctx.globalCompositeOperation= "source-in";
            ctx.fillStyle= color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            this.cache.set(key, canvas);
        }    

        const canvas= this.cache.get(key);
        
        switch(this.align) {
            case Align.Center:
                x-= canvas.width / 2;
                break;
            case Align.Right:
                x-= canvas.width;
                break;
        }

        context.drawImage(canvas, x, y);
        return [x, y, x+canvas.width, y+canvas.height];
    }

}