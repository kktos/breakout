import Entity from "./entity.js";

export default class Paddle extends Entity {
	constructor(x, y) {
		super(x, y);

		this.size= {x: 100, y:10};
		this.vel= {x: 0, y:0};
		this.speed= 100;
	}

	collides(side, target) {
	}

	move(x) {
		// this.vel.x= x * this.speed;
		this.pos.x= x;
	}

	update(dt) {
		// this.vel.x += this.speed * dt;
		// this.vel.x = this.speed;
		// this.vel.y = this.speed;
		// this.pos.x += this.vel.x * dt;
		// this.pos.y += this.vel.y * dt;
	}

	render(ctx) {
		ctx.fillStyle= "white";

		ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

		// ctx.font = '10px sans-serif';
		// ctx.fillText(`VEL.X= ${this.vel.x} VEL.Y= ${this.vel.y}`, 5, 600-10);
	}	
}