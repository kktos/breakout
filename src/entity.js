export default class Entity {
	constructor(x, y) {
		this.pos= {x, y};
		this.vel= {x: 0, y: 0};
		this.speed= 0;
		this.size= {x: 0, y: 0};
	}

	get left() { return this.pos.x;	}
	get right() { return this.pos.x + this.size.x; }
	get top() { return this.pos.y; }
	get bottom() { return this.pos.y + this.size.y; }

	collides() {
	}

	update(dt) {
	}

	render(ctx) {
	}
}