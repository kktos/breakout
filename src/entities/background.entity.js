
import Entity from "./Entity.js";

export default class BackgroundEntity extends Entity {

	constructor(resourceMgr, type, w, h) {
		super(resourceMgr, 0, 0, "backgrounds.json");

		this.type= type;
		this.setSprite("normal-"+this.type);
		this.tileSize= this.spritesheet.spriteSize(this.currSprite);
	}

	spriteSize() {
		return this.tileSize;
	}

	collides() {}

	update(dt) {}

	draw(ctx, col, row) {
		this.spritesheet.draw(
			this.currSprite,
			ctx,
			col * this.tileSize.x,
			row * this.tileSize.y
		);		
	}
}