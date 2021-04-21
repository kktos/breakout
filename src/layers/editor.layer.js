import ENV from "../env.js";
import Layer from "./Layer.js";
import {ptInRect} from "../math.js";
import BrickEntity from "../entities/brick.entity.js";
import {createBricks, stringifyBricks} from "../utils/bricks.util.js";
import AlertUI from "../ui/alert.ui.js";
import ChooseFileUI from "../ui/chooseFile.ui.js";

export default class EditorLayer extends Layer {

	constructor(gc, entities, templateSheet) {
		super(gc);
		this.gc= gc;
		this.width= gc.screen.canvas.width;
		this.entities= entities;
		this.font= gc.resourceManager.get("font","font.png");

		this.isDrawing= false;
		this.isModified= false;

		this.spritesheet= gc.resourceManager.get("sprite", "bricks");
		this.buttons= [];
		this.selectedType= 0;
		this.templateSheet= templateSheet;

		this.themeName= "arkanoid";
		this.levelName= "";

		this.buildUI();

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

		this.ui= document.getElementById("ui");
		this.ui.innerHTML= `
			<div class="grid-column vcenter">
				<div id="btnBack" class="btn white-shadow vcenter">BACK</div>
				<div id="btnNew" class="btn white-shadow vcenter">NEW</div>
				<div id="btnLoad" class="btn white-shadow vcenter">LOAD</div>
				<input type="text" value="${this.levelName}" placeholder="level name..."/>
				<div id="btnSave" class="btn white-shadow vcenter hright">SAVE</div>
			</div>
		`;
		ui.querySelectorAll(".btn").forEach((btn) => btn.addEventListener("click", evt => evt.isTrusted && this.onClickUIBtn(btn.id)));
	}

	back() {
		this.ui.innerHTML= "";
		this.gc.coppola.runPrevious();
	}

	chooseFile() {
		ChooseFileUI.choose(selected => this.load(selected));
	}

	load(name) {
		const bricksSheet= JSON.parse(localStorage.getItem(name).replaceAll("-","#"));
		this.entities.length= 0;
		this.entities.push(...createBricks(this.gc, bricksSheet));
		this.isModified= false;		
	}

	save() {
		let name= ui.querySelectorAll("INPUT")[0].value;
		name= name.replace(/^\s+/, '');
		name= name.replace(/\s+$/, '');
		if(name=="")
			return;

		this.levelName= name;
		localStorage.setItem(`level:${this.themeName}/${this.levelName}`, JSON.stringify(stringifyBricks(this.entities)));
		this.isModified= false;
	}

	onClickUIBtn(id) {
		switch(id) {
			case "btnBack":
				if(this.isModified)
					AlertUI.ask("Level was modified and not saved. Quit anyway ?", "QUIT", "NO", () => this.back());
				else
					this.back();
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
			case "click": {
				const btn= this.buttons.findIndex(btn => ptInRect(e.offsetX, e.offsetY, btn));
				if(btn>=0)
					this.selectedType= btn;
				break;
			}
			case "mousedown": {
				this.isDrawing= true;
				break;
			}
			case "mouseup": {
				this.isDrawing= false;
				break;
			}
			case "mousemove": {
				if(!this.isDrawing)
					return;

				// console.log(e);

				const target= this.entities.find(entity => ptInRect(e.offsetX, e.offsetY, entity));
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
			this.spritesheet.draw(btn.sprite, ctx, btn.left, btn.top);
			this.font.size= 1;
			this.font.align= 2;
			this.font.print(ctx, btn.points, btn.left + (btn.right-btn.left)/2, btn.bottom+5);
		});
	}

}