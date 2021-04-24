import UILayer from "./UILayer.js";
import {Align} from "../Font.js";

export default class DebuggerLayer extends UILayer {

	constructor(gc, ui) {
		super(gc, ui);

		this.rezMgr= gc.resourceManager;
		
		this.width= gc.screen.canvas.width;
		this.height= gc.screen.canvas.height;
		
		this.font= this.rezMgr.get("font","font.png");
		
		this.spritesheetList= this.rezMgr.byKind("sprite");

		this.setSpritesheet(0);

		this.buildUI(this.spritesheetList);
	}

	buildUI(list) {
		list= list.map((item, idx) => `<option value="${idx}">${item.replace(/^[^:]+:/,"")}</option>`);
		this.ui.innerHTML= `
			<div class="grid-column vcenter">
				<div id="btnBack" class="btn white-shadow vcenter">BACK</div>
				<select id="ss">${list}</select>
			</div>
			<div class="grid-column" style="grid-template-columns:auto auto 1fr">
				<div class="vcenter hright">BACKGROUND</div>
				<div id="btnPrevBkgnd" class="btn btn-small white-shadow vcenter">PREV</div>
				<div id="btnNextBkgnd" class="btn btn-small white-shadow vcenter">NEXT</div>
			</div>
		`;
		this.ui.querySelectorAll(".btn").forEach((el) => el.addEventListener("click", evt => evt.isTrusted && this.onClickUIBtn(el.id)));
		this.ui.querySelectorAll("SELECT").forEach((el) => el.addEventListener("change", evt => evt.isTrusted && this.onChangeUI(evt.target)));
	}

	onChangeUI(el) {
		switch(el.id) {
			case "ss":
				this.setSpritesheet(el.value);
				break;
		}
		// console.log(el.id, el.value);
	}

	onClickUIBtn(id) {
		switch(id) {
			case "btnBack":
				this.goBack();
				break;
		}
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
			.reset()
			.play();
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
		const {tick, screen:{ctx}}= gc;
		
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

		this.font.size= 2;

		print("IDX", this.currAnim);
		print("NAME", this.names[this.currAnim]);
		print("FRAMES", anim.frames.length);
		print("LOOP", anim.loopInitialValue);
		print("SPEED", anim.len);

		const step= this.stepAnim ? this.step : tick/100;
		const frameSprite= anim.frame(step);
		const frameSpriteSize= this.spritesheet.spriteSize(frameSprite);
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