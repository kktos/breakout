
import Entity from "./Entity.js";
import GravityTrait from "../traits/gravity.trait.js";
import VelocityTrait from "../traits/velocity.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";
import BounceTrait from "../traits/bounce.trait.js";
import KillableTrait from "../traits/killable.trait.js";
import ExplosionTrait from "../traits/explosion.trait.js";
import FollowPathTrait from "../traits/followPath.trait.js";
import AnimationTrait from "../traits/animation.trait.js";
import BreakTrait from "../traits/break.trait.js";

export default class EnemyEntity extends Entity {

	constructor(resourceMgr, x, y, type) {
		super(resourceMgr, x, y, "enemies");

		this.audio= resourceMgr.get("audio", "paddle");
		this.vel= {x: 0, y: 10};
		this.speed= 0;
		this.mass= 0.05;
		this.data= 0;
		this.points= 100;

		const animTrait= new AnimationTrait();
		
		this.setType(type, animTrait);

		this.addTrait(new GravityTrait());
		this.addTrait(new VelocityTrait());
		this.addTrait(new BounceTrait());
		this.addTrait(new ExplosionTrait());
		this.addTrait(new KillableTrait());
		this.addTrait(new BoundingBoxTrait());
		this.addTrait(new FollowPathTrait());
		this.addTrait(new BreakTrait());
		this.addTrait(animTrait);

	}

	setType(type, animTrait) {
		this.type= type;
		
		switch(type) {
			case "explosion":
				animTrait.setAnim(this, type);
				break;

			default:
				animTrait.setAnim(this, "blueCone");
				break;
		}		

	}

	render({screen:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
		// this.spritesheet.drawAnim(this.currSprite, ctx, this.pos.x, this.pos.y, this.lifetime);
		// ctx.fillText(`${this.vel.x} ${this.vel.y}`,300,600-20);
	}	
}