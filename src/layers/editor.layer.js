import ENV from "../env.js";
import Layer from "./Layer.js";
import {ptInRect} from "../math.js";
// import BrickEntity from "../entities/brick.entity.js";

const TYPES= "gobGrBpyx";

export default class EditorLayer extends Layer {

	constructor(gc, entities) {
		super(gc);
		this.width= gc.screen.canvas.width;
		this.entities= entities;

		this.isDrawing= false;

		this.spritesheet= gc.resourceManager.get("sprite", "bricks");
		this.buttons= [];
		this.selectedType= 0;

		let x= 50;
		for(let idx= 0; idx < TYPES.length; idx++) {
			const left= x+idx*40;
			this.buttons.push({
				type:TYPES[idx],
				sprite: TYPES[idx]=="x"?"silver-0":"standard-"+idx,
				left: left, right: left+32, top: 20, bottom: 20+16
			});
		}


		// for(let idx= 0; idx < TYPES.length; idx++) {
		// 	const brick= new BrickEntity(gc.resourceManager, x+idx*35, 20, TYPES[idx]);
		// 	entities.push(brick);
		// }
	}

	// renderSprite({resourceManager, screen:{ctx}}, op) {
	// 	const [sheet, sprite]= op.sprite.split(":");
	// 	const ss= resourceManager.get("sprite", sheet);
	// 	const zoom= op.zoom || 1;
	// 	const [x, y]= op.pos;
	// 	const [countX, countY]= op.range || [1,1];
	// 	if(countX<=0)
	// 		countX= 1;
	// 	if(countY<=0)
	// 		countY= 1;
	// 	const size= ss.spriteSize(sprite);
	// 	for(let col= 0; col< countX; col++) {
	// 		ss.draw(sprite, ctx, x+col*(size.x*zoom), y, {zoom});
	// 	}
	// }

	handleEvent(gc, e) {
		switch(e.type) {
			case "click": {
				const btn= this.buttons.findIndex(btn => ptInRect(e.offsetX, e.offsetY, btn));
				if(btn>=0)
					this.
					selectedType= btn;
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
		ctx.fillRect(r.left-5, r.top-5, r.right-r.left+10, r.bottom-r.top+10);

		this.buttons.forEach(btn => this.spritesheet.draw(btn.sprite, ctx, btn.left, btn.top));
	}

}