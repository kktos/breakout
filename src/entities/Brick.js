
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

		this.animTrait= new AnimationTrait();

		this.setType(type);
		this.setSprite(this.currSprite);

		this.addTrait(new BrickTrait());
		this.addTrait(this.animTrait);

	}

	setType(type) {
		this.type= type;
		
		const idx= "gobGrBpy".indexOf(type);
		if(idx>=0) {
			this.currSprite= "standard-"+idx;
			return;
		}

		switch(type) {
			case "x":
				this.currSprite= "silver-0";
				this.animTrait.setAnim(this, "silver");
				this.animTrait.start();
				this.data= 4;
				break;
		}		

	}

	render({screen:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
	}	
}