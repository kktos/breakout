
import Entity from "./Entity.js";
import BrickTrait from "../traits/brick.trait.js";
import AnimationTrait from "../traits/animation.trait.js";
import KillableTrait from "../traits/killable.trait.js";

// src: https://primetimeamusements.com/getting-good-arkanoid/
const colors= "gobGrBpy";
const points= [50, 60, 70, 80, 90, 100, 110, 120];
export default class BrickEntity extends Entity {

	constructor(resourceMgr, x, y, type) {
		super(resourceMgr, x, y, "bricks");

		this.audio= resourceMgr.get("audio", "bricks");
		this.data= 0;

		this.animTrait= new AnimationTrait();

		this.setType(type);
		this.setSprite(this.currSprite);

		this.addTrait(new KillableTrait());
		this.addTrait(new BrickTrait());
		this.addTrait(this.animTrait);

	}

	setType(type) {
		this.type= type;
		
		const idx= colors.indexOf(type);
		if(idx>=0) {
			this.currSprite= "standard-"+idx;
			this.points= points[idx];
			return;
		}

		switch(type) {
			case "#":
				this.currSprite= "template";
				break;

			case "x":
				this.currSprite= "silver-0";
				this.animTrait.setAnim(this, "silver");
				this.animTrait.start();
				this.data= 4;
				this.points= 1/50;
				break;
		}		

	}

	render({screen:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
	}	
}