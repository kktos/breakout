import Entity from "./entity.js";
import  {COLLISION} from "./math.js"

export default class Ball extends Entity {
	constructor(x, y, bbx, bby, bbdx, bbdy) {
		super(x, y);
		this.vel= {x: 480, y: 460};
		this.speed= 1;
		this.size= {x: 10, y: 10};
		this.bbox= { x:bbx, y:bby, dx:bbdx, dy:bbdy};
	}

	// get left() { return this.pos.x - this.size.x / 2;	}
	// get top() { return this.pos.y - this.size.x / 2; }

	collides(side, target) {
		switch(side) {
			case COLLISION.LEFT:
				this.vel.x *= -1;
				break;

			case COLLISION.RIGHT:
				this.vel.x *= -1;
				break;

			case COLLISION.TOP:
				this.vel.y *= -1;
				break;

			case COLLISION.BOTTOM:
				this.vel.y *= -1;
				break;
		}
	}

	update(dt) {
		this.pos.x += this.vel.x * dt;
		this.pos.y += this.vel.y * dt;

		if(this.pos.x < this.bbox.x) {
			this.pos.x= this.bbox.x;
			this.vel.x *= -1;
		}
		if(this.right > this.bbox.dx) {
			this.pos.x= this.bbox.dx - this.size.x;
			this.vel.x *= -1;
		}

		if(this.bottom > this.bbox.dy || this.pos.y < this.bbox.y)
			this.vel.y *= -1;
	}

	render(ctx) {
		ctx.fillStyle= "white";
		ctx.beginPath();
		const centerX= this.pos.x + this.size.x/2;
		const centerY= this.pos.y + this.size.x/2;
		ctx.arc(centerX, centerY, this.size.x/2, 0, Math.PI*2);
		ctx.fill();

		// ctx.fillStyle = 'red';
		// ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.x);

		// ctx.font = '10px sans-serif';
		// ctx.fillText(`VEL.X= ${this.vel.x} VEL.Y= ${this.vel.y}`, 5, 600-10);
	}
}