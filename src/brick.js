import Entity from "./entity.js";

export default class Brick extends Entity {
	constructor(id, x, y, type= 0) {
		super(x, y);

		this.id= id;
		
		this.size= {x: 50, y:20};
		this.vel= {x: 0, y:0};
		this.speed= 0;
		this.data= 0;
		this.setType(type);
	}

	setType(type) {
		this.type= type|0;
		switch(this.type) {
			case 2:
				this.data= 100;
			break;
		}

	}

	collides(hit) {
		switch(this.type) {
			case 2:
				this.data--;
				if(this.data<=0)
					this.setType(1);
				break;

			case 1:
				return true;

			default:
				return true;
		}
		return false;
	}

	update(dt) {
		// this.vel.x += this.speed * dt;
		// this.vel.x = this.speed;
		// this.vel.y = this.speed;
		// this.pos.x += this.vel.x * dt;
		// this.pos.y += this.vel.y * dt;
	}

	render(ctx) {

		switch(this.type) {
			case 1:
				ctx.fillStyle= "#5555EE";
				ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
				break;

			case 2:
				ctx.fillStyle= "#25aa25";
				ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
				ctx.fillStyle= "white";
				ctx.font = '10px sans-serif';
				ctx.fillText(`${this.data}`, this.right-20, this.bottom-8);		
				break;

			default:
				ctx.fillStyle= "purple";
				ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
				break;
			}

		ctx.fillStyle= "white";
		ctx.font = '10px sans-serif';
		ctx.fillText(`${this.type}`, this.pos.x+5, this.pos.y+12);		
	}	
}