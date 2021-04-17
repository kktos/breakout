
import Entity from "./Entity.js";
import AnimationTrait from "../traits/animation.trait.js";
import GravityTrait from "../traits/gravity.trait.js";
import VelocityTrait from "../traits/velocity.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";

export default class PowerupEntity extends Entity {

	constructor(resourceMgr, x, y, type) {
		super(resourceMgr, x, y, "powerups.json");

		this.vel= {x: 0, y: 0};
		this.speed= 0;
		this.data= 0;

		this.animTrait= new AnimationTrait();

		this.setType(type);
		this.setSprite(this.currSprite);

		this.addTrait(this.animTrait);
		this.addTrait(new GravityTrait());
		this.addTrait(new VelocityTrait());
		this.addTrait(new BoundingBoxTrait());

	}

	setType(type) {
		this.type= type;
		
		// const idx= "LESCBDTNPRIM".indexOf(type);
		// if(idx>=0) {
		// 	this.currSprite= "standard-"+idx;
		// 	return;
		// }

		switch(type) {
			case "M":
				this.currSprite= "magnet-0";
				this.animTrait.setAnim(this, "magnet");
				this.animTrait.start();
				this.data= 4;
				break;
		}		

	}

	render({screen:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
	}	
}