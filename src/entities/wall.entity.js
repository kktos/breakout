import Entity from "./Entity.js";

export default class WallEntity extends Entity {

	constructor(resourceMgr, sprite, x, y) {
		super(resourceMgr, x, y, "backgrounds.json");

		this.vel= {x: 0, y: 0};
		this.setSprite(sprite);
	}

	collides() {
	}

	update(dt) {
	}

	render({screen:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);

		// ctx.strokeStyle= "white";
		// ctx.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
	}
}