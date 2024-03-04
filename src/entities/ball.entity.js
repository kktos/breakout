import ENV from "../env.js";
import BounceTrait from "../traits/bounce.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";
import KillableTrait from "../traits/killable.trait.js";
import VelocityTrait from "../traits/velocity.trait.js";
import Entity from "./Entity.js";

export default class BallEntity extends Entity {
	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y);
		
		this.size= {x: ENV.BALL_RADIUS*2+5, y: ENV.BALL_RADIUS*2+5};
		this.vel= {x: 0, y: -360};
		this.mass= 10;
		this.radius= ENV.BALL_RADIUS;
		this.center= this.size.x/2;
		this.isFixed= false;

		this.addTrait(new VelocityTrait());
		this.addTrait(new BounceTrait());
		this.addTrait(new BoundingBoxTrait());
		this.addTrait(new KillableTrait());
	}

	render({keys, viewport:{ctx}}) {
		const centerX= this.pos.x + this.center;
		const centerY= this.pos.y + this.center;
		ctx.fillStyle= "white";
		ctx.beginPath();
		ctx.arc(centerX, centerY, this.radius, 0, Math.PI*2);
		ctx.fill();

		if(keys.isPressed("Control")) {
			ctx.strokeStyle = 'red';
			ctx.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		}

		// ctx.font = '14px sans-serif';
		// ctx.fillText(`POS= ${this.pos.x|0},${this.pos.y|0} VEL= ${this.vel.x},${this.vel.y}`, 100, 600-10);
		// ctx.fillText(`VEL= ${this.vel.x},${this.vel.y}`, 100, 600-10);
	}
}