
import Entity from "./Entity.js";
import Audio from "../Audio.js";
import BrickTrait from "../traits/brick.trait.js"
import AnimationTrait from "../traits/animation.trait.js"

export default class Brick extends Entity {

	constructor(x, y, type= "g") {
		super(x, y, "bricks.json");

		this.audio= Audio.retrieve("bricks.json");
		this.vel= {x: 0, y: 0};
		this.speed= 0;
		this.data= 0;

		this.setType(type);
		this.setSprite(this.spriteName);

		this.addTrait(new BrickTrait());
		this.addTrait(new AnimationTrait());

	}

	setType(type) {
		this.type= type;
		
		const idx= "gobGrBpy".indexOf(type);
		if(idx>=0) {
			this.spriteName= "standard-"+idx;
			return;
		}

		switch(type) {
			case "x":
				this.spriteName= "silver-0";
				this.anim= "silver";
				this.data= 4;
				break;
		}		

	}

	routeAnim() {
		return this.currSprite;
	}

	render({screen:{ctx}}) {
		// if(this.type == "x")
		// 	this.spritesheet.drawAnim("silver", ctx, this.pos.x, this.pos.y, this.lifetime);
		// else
		this.spritesheet.draw(this.routeAnim(), ctx, this.pos.x, this.pos.y);
	}	
}