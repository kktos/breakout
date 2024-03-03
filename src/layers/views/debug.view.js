import { createViewport } from "../../utils/canvas.utils.js";
import BackgroundLayer from "../background.layer.js";

export class DebugView {

	constructor(ctx) {
		this.gc= ctx.gc;
		this.vars= ctx.vars;
		this.width= ctx.canvas.width;
		this.height= ctx.canvas.height;
		this.ctx= ctx.canvas.getContext('2d');
		this.canvas= ctx.canvas;

		this.vars.set("frameSpriteSize", {x:0, y:0});
		this.vars.set("anim", { loopInitialValue:0, len:0, frames:{length:0}});
		this.vars.set("frameSprite", "");

		this.rezMgr= this.gc.resourceManager;
		this.spritesheetList= this.rezMgr.byKind("sprite");
		this.setSpritesheet(0);

		this.bkgndIndex= 0;

		this.buildUI(ctx.layer, this.spritesheetList);

	}
 
	buildUI(layer, list) {
		const options= list.map((item, idx) => `<option value="${idx}">${item.replace(/^[^:]+:/,"")}</option>`);
		const html= `
			<div class="vcenter hcenter">
				BACKGROUND
				<input id="bkgndIndex" type="number" class="w50" value="${this.bkgndIndex}" min="0" max="${BackgroundLayer.SPRITES.length-1}"/>
				<div class="grid-column vcenter">
					<div id="btnPrevAnim" class="btn light-shadow">
						<div class="icn z50 icn-up-arrow"></div>Previous
					</div>
					<div id="btnNextAnim" class="btn light-shadow">
						<div class="icn z50 icn-down-arrow"></div>
						Next
					</div>
				</div>
			</div>
			<div class="vcenter hcenter">
				SPRITESHEET
				<select id="ss">${options}</select>
			</div>
		`;

		layer.setContent(html, this);
	}

	onClickUIBtn(id) {
		switch(id) {
		// 	case "btnBack":
		// 		this.goBack();
		// 		break;
			case "btnPrevAnim":
				this.prevAnim();
				break;
			case "btnNextAnim":
				this.nextAnim();
				break;
		}
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
				}
		}
	}

	prevAnim() {
		this.currAnim= this.currAnim > 0 ? this.currAnim-1 : this.names.length-1;
		this.vars.set("currAnim", this.currAnim);
	}

	nextAnim() {
		if(this.currAnim < this.names.length-1)
			this.currAnim++;
		this.vars.set("currAnim", this.currAnim);
	}

	setSpritesheet(idx) {
		this.spritesheetName= this.spritesheetList[idx];
		this.spritesheet= this.rezMgr.get(this.spritesheetName);
		this.animations= this.spritesheet.animations;

		this.names= [...this.animations.keys()];
		this.vars.set("names", this.names);

		this.currAnim= 0;
		this.vars.set("currAnim", this.currAnim);

		this.pauseAnim= false;
		this.stepAnim= false;
		this.step= 0;		
	}

	setBackground(bkgndIndex) {
		this.bkgndIndex= bkgndIndex % BackgroundLayer.SPRITES.length;
		this.gc.scene.events.emit(BackgroundLayer.EVENT_UPDATE_BKGND, this.bkgndIndex, false);
	}

	render(gc) {
		const localGc= {...gc};
		localGc.viewport= createViewport(this.canvas);
		this.ctx.clearRect(0, 0, this.width, this.height);

		const anim= this.animations.get(this.names[this.currAnim]);
		this.vars.set("anim", anim);

		const step= this.stepAnim ? this.step : gc.tick/100;
		const frameSprite= anim.frame(step);
		this.vars.set("frameSprite", frameSprite);

		const frameSpriteSize= this.spritesheet.spriteSize(frameSprite);
		this.vars.set("frameSpriteSize", frameSpriteSize);

		// this.spritesheet.draw(frameSprite, this.ctx, this.width-frameSpriteSize.x-50, 50);

		this.spritesheet.draw(frameSprite, this.ctx, this.width/2-frameSpriteSize.x, this.height/2-frameSpriteSize.y, {zoom:2});
	}

}