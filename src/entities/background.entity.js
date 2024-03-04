
import Entity from "./Entity.js";

export default class BackgroundEntity extends Entity {

	constructor(resourceMgr, type) {
		super(resourceMgr, 0, 0, "backgrounds");

		this.type= type;
		this.setSprite(this.type);
	}

	collides() {}

	update() {}

	draw(ctx, col, row) {
		this.spritesheet.draw(
			this.currSprite,
			ctx,
			col * this.size.x,
			row * this.size.y
		);		
	}
}