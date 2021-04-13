import Entity from "./entity.js";

export default class Wall extends Entity {
	constructor(x, y, dx, dy) {
		super(x, y);

		this.size= {x: dx, y: dy};
		this.vel= {x: 0, y:0};
		this.speed= 0;
	}

	update(dt) {
		// this.vel.x += this.speed * dt;
		// this.vel.x = this.speed;
		// this.vel.y = this.speed;
		// this.pos.x += this.vel.x * dt;
		// this.pos.y += this.vel.y * dt;
	}

	render(ctx) {
		ctx.fillStyle= "#888888";
		ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
	}	
}