import UILayer from "./UILayer.js";
import {Align} from "../Font.js";
import animResolveFrame from "../utils/animResolveFrame.util.js";

export default class DebuggerLayer extends UILayer {

	constructor(gc) {
		super(gc);

		const rezMgr= gc.resourceManager;
		this.width= gc.screen.canvas.width;
		this.font= rezMgr.get("font","font.png");
		this.spritesheet= rezMgr.get("sprite", "enemies");
		this.pos= {x:10,y:10};

		this.animations= this.spritesheet.animations;
		this.names= [...this.animations.keys()];
		this.currAnim= 0;

		this.upLatch= false;
		this.downLatch= false;

	}

	handleKeyboard(gc, keys) {

		if(!keys.get("ArrowDown") && this.downLatch)
			this.downLatch= false;
		if(!keys.get("ArrowUp") && this.upLatch)
			this.upLatch= false;

		if(keys.get("ArrowDown") && !this.downLatch) {
			if(this.currAnim < this.names.length-1)
				this.currAnim++;
			this.downLatch= true;
		}
		if(keys.get("ArrowUp") && !this.upLatch) {
			if(this.currAnim > 0)
				this.currAnim--;
			else
				this.currAnim= this.names.length-1;
			this.upLatch= true;
		}

	}

	render(gc) {
		const {keys, tick, screen:{ctx}}= gc;
		
		let text;
		let line= 0;
		const nl= () => { line= line + this.font.height; return line; };

		this.handleKeyboard(gc, keys);

		const anim= this.animations.get(this.names[this.currAnim]);

		this.font.size= 2;
		this.font.align= Align.Left;
		text= `NAME.${this.currAnim} ${this.names[this.currAnim]}`;
		this.font.print(ctx, text, 10, nl());
		this.font.print(ctx, "COUNT "+anim.frames.length, 10, nl());

		const frameSprite= animResolveFrame(anim, tick/100);
		const frameSpriteSize= this.spritesheet.spriteSize(frameSprite);
		this.spritesheet.draw(frameSprite, ctx, this.width-frameSpriteSize.x-10, this.pos.y);

		// line+= frameSpriteSize.y;
		// nl();

		// for(let idx= 0; idx < anim.frames.length; idx++) {
		// 	nl();

		// 	const {x:sw, y:sh}= this.spritesheet.spriteSize(anim.frames[idx]);
		// 	text= `${anim.frames[idx]} w${sw} h${sh}`;
		// 	this.font.print(ctx, text, 10, line);
		// 	nl();

		// 	this.spritesheet.draw(anim.frames[idx], ctx, 10, line);
		// 	line+= sh;
		// }
	}

}