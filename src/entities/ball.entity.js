import Entity from "./Entity.js";
import VelocityTrait from "../traits/velocity.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";
import BounceTrait from "../traits/bounce.trait.js";

export default class BallEntity extends Entity {
	constructor(x, y, bbx, bby, bbdx, bbdy) {
		super(x, y);
		this.size= {x: 10, y: 10};

		this.vel= {x: 380, y: 360};
		this.speed= 1;
		this.radius= this.size.x/2;
		

		this.addTrait(new VelocityTrait());
		this.addTrait(new BounceTrait());
		this.addTrait(new BoundingBoxTrait(bbx, bby, bbdx, bbdy));
	}

	render({screen:{ctx}}) {
		ctx.fillStyle= "white";
		ctx.beginPath();
		const centerX= this.pos.x + this.radius;
		const centerY= this.pos.y + this.radius;
		ctx.arc(centerX, centerY, this.radius, 0, Math.PI*2);
		ctx.fill();

		// ctx.fillStyle = 'red';
		// ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.x);

		ctx.font = '14px sans-serif';
		// ctx.fillText(`POS= ${this.pos.x|0},${this.pos.y|0} VEL= ${this.vel.x},${this.vel.y}`, 100, 600-10);
		ctx.fillText(`VEL= ${this.vel.x},${this.vel.y}`, 100, 600-10);
	}
}