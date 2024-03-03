import BrickEntity from "../entities/brick.entity.js";
import ENV from "../env.js";
import {ptInRect} from "../math.js";
import AlertUI from "../ui/alert.ui.js";
import ChooseFileUI from "../ui/choosefile.ui.js";
import EnterLevelInfoUI from "../ui/entertext.ui.js";
import {createBricks, stringifyBricks} from "../utils/bricks.util.js";
import LocalDB from "../utils/storage.util.js";
import UILayer from "./UILayer.js";
import BackgroundLayer from "./background.layer.js";

export default class EditorLayer extends UILayer {

	constructor(gc, entities, templateSheet, ui) {
		super(gc, ui);

		this.width= gc.viewport.canvas.width;
		this.entities= entities;
		this.font= gc.resourceManager.get("font", ENV.MAIN_FONT);

		this.isDrawing= false;
		this.isModified= false;

		this.bricksSprites= gc.resourceManager.get("sprite", "bricks");
		this.paddlesSprites= gc.resourceManager.get("sprite", "paddles");
		this.buttons= [];
		this.selectedType= 0;

		this.firstPoint= null;

		this.templateSheet= templateSheet;

		this.bkgndIndex= 0;
		this.updateBackground= () => {
			gc.scene.events.emit(BackgroundLayer.EVENT_UPDATE_BKGND, this.bkgndIndex, true);
		};

		this.themeName= "user";
		this.levelName= "";

		this.buildUI();

		this.resetLevel();
	}

	resetLevel() {
		this.entities.length= 0;
		this.entities.push(...createBricks(this.gc, {bricksDef: this.templateSheet}));
		this.isModified= false;
		this.updateBrickStats();
	}

	buildUI() {
		const x= 60;
		const y= 10;
		for(let idx= 0; idx < BrickEntity.TYPES.length; idx++) {
			const left= x+idx*40;
			const pts= BrickEntity.POINTS[idx];
			this.buttons.push({
				type: BrickEntity.TYPES[idx],
				points: pts<=0 ? "---" : pts<1 ? "x50" : pts,
				sprite: BrickEntity.SPRITES[idx],
				left: left, right: left+32, top: y, bottom: y+16
			});
		}

		this.ui.innerHTML= `
			<div class="grid-column vcenter">
				<div id="btnBack" class="btn light-shadow icn icn-left-arrow"></div>
				<div class="grid-row">
					THEME
					<select id="theme">
						<option value="arkanoid">Arkanoid</option>
						<option value="arkanoid2">Arkanoid 2</option>
						<option value="user" selected>User</option>
					</select>
				</div>
				<div class="grid-row">
					LEVEL
					<input type="text" placeholder="unnamed" readonly class="w150"/>
				</div>
				<div id="btnNew" class="btn light-shadow icn icn-trash"></div>
				<div id="btnLoad" class="btn light-shadow icn icn-load"></div>
				<div id="btnSave" class="btn light-shadow icn icn-save"></div>
			</div>
			<div class="grid-column vcenter" style="grid-template-rows: 30px; justify-content: space-evenly">
				<div class="grid-row">
					BACKGROUND
					<input id="bkgndIndex" type="number" class="w50" value="${this.bkgndIndex}" min="0" max="${BackgroundLayer.SPRITES.length-1}"/>
				</div>
				<div class="grid-row">TOTAL<input id="brickCount" readonly class="w50" type="text" value="0"/></div>
				<div class="grid-row">BREAKABLE<input id="breakableCount" readonly class="w50" type="text" value="0"/></div>
				<div class="grid-row">POINTS<input id="points" readonly class="w150" type="text" value="0"/></div>
			</div>
		`;
		this.ui.querySelectorAll(".btn").forEach((btn) => btn.addEventListener("click", evt => evt.isTrusted && this.onClickUIBtn(btn.id)));
		this.ui.querySelectorAll("INPUT,SELECT").forEach((el) => el.addEventListener("change", evt => evt.isTrusted && this.onChangeUI(evt.target)));
	}

	onChangeUI(el) {
		switch(el.id) {
			case "theme":
				this.themeName= el.value;
				break;
			case "bkgndIndex":
				this.setBackground(el.value);
				break;
		}
	}

	chooseFile() {
		ChooseFileUI.choose(this.themeName, selected => this.load(selected));
	}

	load(name) {
		const sheet= LocalDB.loadResource(name);
		this.entities.length= 0;
		this.entities.push(...createBricks(this.gc, {brickDef: sheet.bricks, isTemplateMode: true}));
		this.bkgndIndex= sheet.background|0;
		this.updateBackground();
		// this.bkgndLayer.setBackground(this.gc, this.bkgndIndex, true);
		this.ui.querySelectorAll("INPUT")[0].value= sheet.name;
		this.isModified= false;

		this.updateBrickStats();
	}

	save() {
		EnterLevelInfoUI.run("Save level:", (name) => {
			name= name.replace(/^\s+/, '').replace(/\s+$/, '');
			if(name==="")
				return;
				
			this.levelName= name;
			const sheet= {
				bricks: stringifyBricks(this.entities),
				background: this.bkgndIndex,
				name: this.levelName,
				type: "level"
			};
			LocalDB.saveLevel(this.themeName, this.levelName, sheet);
			this.isModified= false;	

			this.ui.querySelectorAll("INPUT")[0].value= name;
		});

	}

	setBackground(bkgndIndex) {
		this.bkgndIndex= bkgndIndex % BackgroundLayer.SPRITES.length;
		// this.bkgndLayer.setBackground(this.gc, this.bkgndIndex);
		this.updateBackground();
	}

	updateBrickStats() {
		const total= this.entities.filter(b=>b.type!=="#").length;
		const breakable= this.entities.filter(b=>!["#","@","X"].includes(b.type)).length;
		const points= this.entities.reduce((acc, curr)=>acc+curr.points|0,0);

		this.ui.querySelector("#brickCount").value= total;
		this.ui.querySelector("#breakableCount").value= breakable;
		this.ui.querySelector("#points").value= points;
	}

	prevBrickType() {
		this.selectedType--;
		if(this.selectedType<0)
			this.selectedType= BrickEntity.TYPES.length-1;
	}

	nextBrickType() {
		this.selectedType= (this.selectedType+1) % (BrickEntity.TYPES.length);
	}

	leave() {
		if(this.isModified)
			AlertUI.ask("Level was modified and not saved. Quit anyway ?", "QUIT", "NO", () => this.goBack());
		else
			this.goBack();
	}

	onClickUIBtn(id) {
		switch(id) {

			case "btnBack":
				this.leave();
				break;

			case "btnSave":
				if(this.isModified)
					this.save();
				break;

			case "btnLoad":
				if(this.isModified)
					AlertUI.ask("Level was modified and not saved. Overwrite it anyway ?", "OVERWRITE", "NO", () => this.chooseFile());
				else
					this.chooseFile();
				break;

			case "btnNew":
				if(this.isModified)
					AlertUI.ask("Level was modified and not saved. Clear it anyway ?", "CLEAR", "NO", () => this.resetLevel());
				else
					this.resetLevel();
				break;
		}
	}

	drawBrick(x, y, buttons) {
		const target= this.entities.find(entity => ptInRect(x, y, entity));
		if(target) {
			target.setType(buttons===2?"#":this.buttons[this.selectedType].type);
			this.isModified= true;
			this.updateBrickStats();
		}				
	}

	// https://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
	line({x:x0, y:y0}, {x:x1, y:y1}, buttons) {
		const dx = Math.abs(x1 - x0);
		const dy = Math.abs(y1 - y0);
		const sx = (x0 < x1) ? 1 : -1;
		const sy = (y0 < y1) ? 1 : -1;
		let err = dx - dy;
	 
		while(true) {
		   this.drawBrick(x0, y0, buttons);
	 
		//    if ((x0 === x1) && (y0 === y1)) break;
		   if (Math.abs(x0 - x1) < 0.0001 && Math.abs(y0 - y1) < 0.0001) break;
		   const e2 = 2*err;
		   if (e2 > -dy) { err -= dy; x0  += sx; }
		   if (e2 < dx) { err += dx; y0  += sy; }
		}
	 }

	handleEvent(gc, e) {
		switch(e.type) {
			case "joybuttondown":
				if(e.CURSOR_LEFT)
					this.leave();
				break;

			case "keydown":
				switch(e.key) {
					case "a":
						this.prevBrickType();
						break;
					case "z":
						this.nextBrickType();
						break;
				}
				break;

			case "click": {
				const btn= this.buttons.findIndex(btn => ptInRect(e.x, e.y, btn));
				if(btn>=0)
					this.selectedType= btn;
				break;
			}
			case "mousedown": {
				this.isDrawing= true;
				this.firstPoint= {x:e.x, y:e.y};
				this.drawBrick(e.x, e.y, e.buttons);
				break;
			}
			case "mouseup": {
				this.isDrawing= false;
				break;
			}
			case "mousemove": {
				if(!this.isDrawing)
					return;

				if(gc.keys.isPressed("Control"))
					this.line(this.firstPoint, {x:e.x, y:e.y}, e.buttons);
				else
					this.drawBrick(e.x, e.y, e.buttons);
				break;
			}
		}
	}

	render(gc) {
		const ctx= gc.viewport.ctx;

		ctx.fillStyle= "#000";
		ctx.fillRect(0, 0, this.width, ENV.WALL_TOP);

		const r= this.buttons[this.selectedType];
		ctx.fillStyle= "#0b94d6";
		ctx.fillRect(r.left-5, r.top-5, r.right-r.left+10, r.bottom-r.top+20);

		this.buttons.forEach(btn => {
			this.bricksSprites.draw(btn.sprite, ctx, btn.left, btn.top);
			this.font.size= 1;
			this.font.align= 2;
			this.font.print(ctx, btn.points, btn.left + (btn.right-btn.left)/2, btn.bottom+5);
		});

		this.paddlesSprites.draw("normal0-0", ctx, 270, 550);

	}

}