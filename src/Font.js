import {loadImage} from './utils/loaders.util.js';
import SpriteSheet from './Spritesheet.js';

const CHARS= ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ©!-×.';
export const Align= {
    Left: 1,
    Center: 2,
    Right: 3
}
class Font {
    constructor(sprites, size) {
        this.sprites= sprites;
        this.spriteSize= size;
        this.size= 1;
        this.align= Align.Left;
    }

    get height() {
        return this.spriteSize*this.size;
    }

    textRect(text, x, y) {
        const str= String(text).toUpperCase();
        const width= str.length*this.height;
        return [x, y, x+width, y+this.height];
    }

    print(context, text, x, y, color="#fff") {
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

        switch(this.align) {
            case Align.Center:
                x-= canvas.width / 2;
                break;
            case Align.Right:
                x-= canvas.width;
                break;
        }

        context.drawImage(canvas, x, y);
    }
}


export function loadFont(fontName) {
    return loadImage(fontName)
    .then(image => {
        const fontSprite= new SpriteSheet(image);

        const spriteSize= 8;
        const rowLen= image.width;
        for (let [index, char] of [...CHARS].entries()) {
            const x= index * spriteSize % rowLen;
            const y= Math.floor(index * spriteSize / rowLen) * spriteSize;
            fontSprite.define(char, x, y, spriteSize, spriteSize);
        }

        return new Font(fontSprite, spriteSize);
    });
}
