import {createBricks} from "../utils/bricks.util.js";
import Layer from "./layer.js";

export default class EntitiesLayer extends Layer {

	constructor(gc, entities, sheet= null) {
		super(gc);

		if(sheet)
			entities.push(...createBricks(gc, {bricksDef: sheet}));
		this.entities= entities;
	}

	render(gc) {
		for (let idx = 0; idx < this.entities.length; idx++)
			this.entities[idx].render(gc)
		
		const ctx= gc.viewport.ctx;
		ctx.fillStyle="#fff";
		ctx.font= "10px";
		ctx.fillText(`${gc.scene?gc.scene.breakableCount|0:"-"}/${this.entities.length}`,600-60,600-10);
	}

}