import Layer from "./Layer.js";
import createBricks from "../utils/createBricks.util.js";

export default class EntitiesLayer extends Layer {

	constructor(gc, entities, sheet) {
		super(gc);

		entities.push(...createBricks(gc, sheet));
		this.entities= entities;
	}

	render(gc) {
		this.entities.forEach(entity => entity.render(gc));
		
		const ctx= gc.screen.ctx;
		ctx.fillStyle="#fff";
		ctx.font= "10px";
		ctx.fillText(this.entities.length,600-50,600-10);
	}

}