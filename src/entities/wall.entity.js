import Entity from "./entity.js";

export default class WallEntity extends Entity {

	constructor(resourceMgr, sprite, x, y) {
		super(resourceMgr, x, y, "backgrounds");

		this.vel= {x: 0, y: 0};
		this.setSprite(sprite);
	}

	collides() {}
	update() {}

	draw(ctx) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
	}

}