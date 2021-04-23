
import Entity from "./Entity.js";
import GravityTrait from "../traits/gravity.trait.js";
import VelocityTrait from "../traits/velocity.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";
import BounceTrait from "../traits/bounce.trait.js";
import KillableTrait from "../traits/killable.trait.js";
import ExplosionTrait from "../traits/explosion.trait.js";

export default class EnemyEntity extends Entity {

	constructor(resourceMgr, x, y, type) {
		super(resourceMgr, x, y, "enemies");

		this.audio= resourceMgr.get("audio", "paddle");
		this.vel= {x: -10, y: 10};
		this.speed= 0;
		this.mass= 0.05;
		this.data= 0;
		this.points= 100;

		this.setType(type);
		this.setAnim(this.currSprite);

		this.addTrait(new GravityTrait());
		this.addTrait(new VelocityTrait());
		this.addTrait(new BounceTrait());
		this.addTrait(new ExplosionTrait());
		this.addTrait(new KillableTrait());
		this.addTrait(new BoundingBoxTrait());

	}

	setType(type) {
		this.type= type;
		
		switch(type) {
			case "explosion":
				this.currSprite= type;
				this.pause();
				break;

			default:
				this.currSprite= "blueCone";
				break;
		}		

	}

	render({screen:{ctx}}) {
		this.spritesheet.drawAnim(this.currSprite, ctx, this.pos.x, this.pos.y, this.lifetime);
	}	
}