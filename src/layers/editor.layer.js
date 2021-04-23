import ENV from "../env.js";
import UILayer from "./UILayer.js";
import {ptInRect} from "../math.js";
import BrickEntity from "../entities/brick.entity.js";
import {createBricks, stringifyBricks} from "../utils/bricks.util.js";
import AlertUI from "../ui/alert.ui.js";
import ChooseFileUI from "../ui/chooseFile.ui.js";
import BackgroundLayer from "./background.layer.js";

export default class EditorLayer extends UILayer {

	constructor(gc, entities, templateSheet, bkgndLayer) {
		super(gc);

		this.width= gc.screen.canvas.width;
		this.entities= entities;
		this.font= gc.resourceManager.get("font","font.png");

		this.isDrawing= false;
		this.isModified= false;

		this.bricksSprites= gc.resourceManager.get("sprite", "bricks");
		this.paddlesSprites= gc.resourceManager.get("sprite", "paddles");
		this.buttons= [];
		this.selectedType= 0;
		this.templateSheet= templateSheet;

		this.bkgndLayer= bkgndLayer;
		this.bkgndSprite= 0;

		this.themeName= "arkanoid";
		this.levelName= "";

		this.buildUI();

		bkgndLayer.setBackground(gc, this.bkgndSprite);
		this.resetLevel();
	}

	resetLevel() {
		this.entities.length= 0;
		this.entities.push(...createBricks(this.gc, this.templateSheet));
		this.isModified= false;
	}

	buildUI() {
		let x= 100;
		let y= 10;
		for(let idx= 0; idx < BrickEntity.TYPES.length-1; idx++) {
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
				<div id="btnBack" class="btn white-shadow vcenter">BACK</div>
				<div id="btnNew" class="btn white-shadow vcenter">NEW</div>
				<div id="btnLoad" class="btn white-shadow vcenter">LOAD</div>
				<input type="text" value="${this.levelName}" placeholder="level name..."/>
				<div id="btnSave" class="btn white-shadow vcenter hright">SAVE</div>
			</div>
			<div class="grid-column" style="grid-template-columns:auto auto 1fr">
				<div class="vcenter hright">BACKGROUND</div>
				<div id="btnPrevBkgnd" class="btn btn-small white-shadow vcenter">PREV</div>
				<div id="btnNextBkgnd" class="btn btn-small white-shadow vcenter">NEXT</div>
			</div>
		`;
		this.ui.querySelectorAll(".btn").forEach((btn) => btn.addEventListener("click", evt => evt.isTrusted && this.onClickUIBtn(btn.id)));
	}


	chooseFile() {
		ChooseFileUI.choose(selected => this.load(selected));
	}

	load(name) {
		const sheet= JSON.parse(localStorage.getItem(name));
		this.entities.length= 0;
		this.entities.push(...createBricks(this.gc, sheet.bricks, true));
		this.bkgndSprite= sheet.background|0;
		this.bkgndLayer.setBackground(this.gc, this.bkgndSprite);
		this.ui.querySelectorAll("INPUT")[0].value= sheet.name;
		this.isModified= false;		
	}

	save() {
		let name= this.ui.querySelectorAll("INPUT")[0].value;
		name= name.replace(/^\s+/, '');
		name= name.replace(/\s+$/, '');
		if(name=="")
			return;

		this.levelName= name;
		const sheet= {
			bricks: stringifyBricks(this.entities),
			background: this.bkgndSprite,
			name: this.levelName
		};
		localStorage.setItem(`level:${this.themeName}/${this.levelName}`, JSON.stringify(sheet));
		this.isModified= false;
	}

	prevBackground() {
		this.bkgndSprite--;
		if(this.bkgndSprite<0)
			this.bkgndSprite= BackgroundLayer.SPRITES.length-1;
		this.bkgndLayer.setBackground(this.gc, this.bkgndSprite);
	}

	nextBackground() {
		this.bkgndSprite= (this.bkgndSprite + 1) % BackgroundLayer.SPRITES.length;
		this.bkgndLayer.setBackground(this.gc, this.bkgndSprite);
	}

	prevBrickType() {
		this.selectedType--;
		if(this.selectedType<0)
			this.selectedType= BrickEntity.TYPES.length-2;
	}

	nextBrickType() {
		this.selectedType= (this.selectedType+1) % (BrickEntity.TYPES.length-1);
	}

	onClickUIBtn(id) {
		switch(id) {
			case "btnPrevBkgnd":
				this.prevBackground();
				break;

			case "btnNextBkgnd":
				this.nextBackground();
				break;

			case "btnBack":
				if(this.isModified)
					AlertUI.ask("Level was modified and not saved. Quit anyway ?", "QUIT", "NO", () => this.goBack());
				else
					this.goBack();
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

	handleEvent(gc, e) {
		switch(e.type) {
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
				const target= this.entities.find(entity => ptInRect(e.x, e.y, entity));
				if(target) {
					target.setType(e.buttons==2?"#":this.buttons[this.selectedType].type);
					this.isModified= true;
				}				
				break;
			}
			case "mouseup": {
				this.isDrawing= false;
				break;
			}
			case "mousemove": {
				if(!this.isDrawing)
					return;
				const target= this.entities.find(entity => ptInRect(e.x, e.y, entity));
				if(target) {
					target.setType(e.buttons==2?"#":this.buttons[this.selectedType].type);
					this.isModified= true;
				}
				break;
			}
		}
	}

	render(gc) {
		const ctx= gc.screen.ctx;

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

		this.paddlesSprites.draw("normal0-0", ctx, 300, 550);

	}

}