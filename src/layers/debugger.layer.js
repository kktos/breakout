import UILayer from "./uilayer.js";
import {Align} from "../font.js";
import BackgroundLayer from "./background.layer.js";
import ENV from "../env.js";

export default class DebuggerLayer extends UILayer {

	constructor(gc, ui, bkgndLayer) {
		super(gc, ui);

		this.rezMgr= gc.resourceManager;
		
		this.width= gc.viewport.width;
		this.height= gc.viewport.height;
		
		this.font= this.rezMgr.get("font", ENV.MAIN_FONT);
		this.bkgndLayer= bkgndLayer;

		this.spritesheetList= this.rezMgr.byKind("sprite");

		this.setSpritesheet(0);

		this.buildUI(this.spritesheetList);
	}

	buildUI(list) {
		list= list.map((item, idx) => `<option value="${idx}">${item.replace(/^[^:]+:/,"")}</option>`);
		this.ui.innerHTML= `
			<div class="grid-column vcenter">
				<div id="btnBack" class="btn light-shadow icn icn-left-arrow"></div>
				<div class="vcenter hright">
					BACKGROUND
					<input id="bkgndIndex" type="number" class="w50" value="${this.bkgndIndex}" min="0" max="${BackgroundLayer.SPRITES.length-1}"/>
				</div>
				<div class="vcenter hright">
					SPRITESHEET
					<select id="ss">${list}</select>
				</div>
			</div>
			<div class="grid-column" style="grid-template-columns:auto auto 1fr">
			</div>
		`;
		this.ui.querySelectorAll(".btn").forEach((el) => el.addEventListener("click", evt => evt.isTrusted && this.onClickUIBtn(el.id)));
		this.ui.querySelectorAll("INPUT,SELECT").forEach((el) => el.addEventListener("change", evt => evt.isTrusted && this.onChangeUI(evt.target)));
	}

	onChangeUI(el) {
		switch(el.id) {
			case "bkgndIndex":
				this.setBackground(el.value);
				break;
			case "ss":
				this.setSpritesheet(el.value);
				break;
		}
	}

	onClickUIBtn(id) {
		switch(id) {
			case "btnBack":
				this.goBack();
				break;
		}
	}

	setBackground(bkgndIndex) {
		this.bkgndIndex= bkgndIndex % BackgroundLayer.SPRITES.length;
		this.bkgndLayer.setBackground(this.gc, this.bkgndIndex);
	}

	setSpritesheet(idx) {
		this.spritesheetName= this.spritesheetList[idx];
		this.spritesheet= this.rezMgr.get(this.spritesheetName);
		this.animations= this.spritesheet.animations;
		this.names= [...this.animations.keys()];
		this.currAnim= 0;
		this.pauseAnim= false;
		this.stepAnim= false;
		this.step= 0;		
	}

	prevAnim() {
		if(this.currAnim > 0)
			this.currAnim--;
		else
			this.currAnim= this.names.length-1;
	}

	nextAnim() {
		if(this.currAnim < this.names.length-1)
			this.currAnim++;
	}

	playAnim() {
		const anim= this.animations.get(this.names[this.currAnim]);
		anim
			.reset();
	}

	handleEvent(gc, e) {
		switch(e.type) {
			case "keydown":
				switch(e.key) {
					case "ArrowDown":
						this.prevAnim();
						break;
					case "ArrowUp":
						this.nextAnim();
						break;

					case "p":
						this.playAnim();
						break;

					case "-": {
						const anim= this.animations.get(this.names[this.currAnim]);
						anim.len= (anim.len*10 + 1)/10;
						break;
					}
					case "+": {
						const anim= this.animations.get(this.names[this.currAnim]);
						anim.len= (anim.len*10 - 1)/10;
						if(anim.len<=0)
							anim.len= 0.1;
						break;
					}

					case "s":
						this.stepAnim= !this.stepAnim;
						break;
					case "a": {
						const anim= this.animations.get(this.names[this.currAnim]);
						this.step--;
						if(this.step<0)
							this.step= anim.frames.length-1;
						break;
					}
					case "z": {
						const anim= this.animations.get(this.names[this.currAnim]);
						this.step= (this.step +1) % anim.frames.length;
						break;
					}
				}
				break;
		}
	}

	render(gc) {
		const {tick, viewport:{ctx}}= gc;
		
		let text;
		let line= 0;
		const nl= () => { line= line + this.font.height+2; return line; };

		const print= (field, value) => {
			nl();
			this.font.align= Align.Right;
			this.font.print(ctx, field, 100, line);
			this.font.align= Align.Left;
			this.font.print(ctx, value, 110, line);	
		};

		ctx.strokeStyle= "#777777";
		ctx.beginPath();
		ctx.moveTo(this.width/2,0);
		ctx.lineTo(this.width/2,this.height);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, this.height/2);
		ctx.lineTo(this.width, this.height/2);
		ctx.stroke();

		const anim= this.animations.get(this.names[this.currAnim]);
		const step= this.stepAnim ? this.step : tick/100;
		const frameSprite= anim.frame(step);
		const frameSpriteSize= this.spritesheet.spriteSize(frameSprite);

		this.font.size= 2;

		print("IDX", this.currAnim);
		print("NAME", this.names[this.currAnim]);
		print("FRAMES", anim.frames.length);
		print("LOOP", anim.loopInitialValue);
		print("SPEED", anim.len);
		print("WIDTH", frameSpriteSize.x);
		print("HEIGHT", frameSpriteSize.y);


		this.spritesheet.draw(frameSprite, ctx, this.width-frameSpriteSize.x-50, 50);

		line= this.height/2;
		this.spritesheet.draw(frameSprite, ctx, this.width/2-frameSpriteSize.x, line-frameSpriteSize.y, {zoom:2});
		line+= frameSpriteSize.y*2;
		this.font.align= Align.Center;
		this.font.print(ctx, frameSprite, this.width/2, line);
		nl(); this.font.print(ctx, anim.loop, this.width/2, line);
		// nl(); this.font.print(ctx, step|0, this.width/2, line);
		// nl(); this.font.print(ctx,  Math.floor(step / anim.len)% anim.frames.length, this.width/2, line);
		
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