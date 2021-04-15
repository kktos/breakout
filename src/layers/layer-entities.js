import Layer from "./Layer.js";

export default class LayerEntities extends Layer {

	constructor(gameContext, entities) {
		super(gameContext);

		this.entities= entities;
	}

	render(gameContext) {
		this.entities.forEach(entity => entity.render(gameContext));
	}

}