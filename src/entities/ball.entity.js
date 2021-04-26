import Entity from "./Entity.js";
import ENV from "../env.js";
import VelocityTrait from "../traits/velocity.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";
import BounceTrait from "../traits/bounce.trait.js";
import KillableTrait from "../traits/killable.trait.js";

export default class BallEntity extends Entity {
	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y);
		
		this.size= {x: ENV.BALL_RADIUS*2+5, y: ENV.BALL_RADIUS*2+5};
		this.vel= {x: 0, y: -360};
		this.mass= 10;
		this.radius= ENV.BALL_RADIUS;
		
		this.addTrait(new VelocityTrait());
		this.addTrait(new BounceTrait());
		this.addTrait(new BoundingBoxTrait());
		this.addTrait(new KillableTrait());
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

		// ctx.font = '14px sans-serif';
		// ctx.fillText(`POS= ${this.pos.x|0},${this.pos.y|0} VEL= ${this.vel.x},${this.vel.y}`, 100, 600-10);
		// ctx.fillText(`VEL= ${this.vel.x},${this.vel.y}`, 100, 600-10);
	}
}