
import AnimationTrait from "../traits/animation.trait.js";
import BrickTrait from "../traits/brick.trait.js";
import KillableTrait from "../traits/killable.trait.js";
import Entity from "./entity.js";

export default class BrickEntity extends Entity {

	// src: https://primetimeamusements.com/getting-good-arkanoid/
	// static TYPES= "gobGrBpyxX@#";
	// static POINTS= [50, 60, 70, 80, 90, 100, 110, 120, 1/50, 0, 0, 0];
	// static SPRITES= [
	// 	"standard-0", "standard-1", "standard-2", "standard-3", "standard-4", "standard-5", "standard-6", "standard-7",
	// 	"silver-0", "gold-0", "highlander-0", "template"];

	constructor(resourceMgr, x, y, type) {
		super(resourceMgr, x, y, "bricks");

		this.audio= resourceMgr.get("audio", "bricks");
		this.data= 0;
		this.breakable= true;

		this.animTrait= new AnimationTrait();

		this.setType(type);
		this.setSprite(this.currSprite);

		this.addTrait(new KillableTrait());
		this.addTrait(new BrickTrait());
		this.addTrait(this.animTrait);

	}

	setType(type) {
		this.type= type;
		
		const idx= BrickEntity.TYPES.indexOf(type);
		if(idx<0)
			throw new Error(`Unknown Brick Type ${type}`);

		this.points= BrickEntity.POINTS[idx];
		this.currSprite= BrickEntity.SPRITES[idx];

		switch(type) {
			case "x":
				this.animTrait.setAnim(this, "silver");
				this.animTrait.start();
				this.data= 2;
				break;

			case "X":
				this.animTrait.setAnim(this, "gold");
				this.animTrait.start();
				this.data= Infinity;
				this.breakable= false;
				break;

			case "@":
				this.animTrait.setAnim(this, "highlander");
				this.animTrait.start();
				this.data= Infinity;
				this.breakable= false;
				break;
		}		

	}

	render({viewport:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
		// ctx.fillStyle="#fff";
		// ctx.font= "7px";
		// ctx.fillText(`${this.pos.x},${this.pos.y}`, this.pos.x, this.pos.y+16);
	}	
}

// src: https://primetimeamusements.com/getting-good-arkanoid/
BrickEntity.TYPES= "gobGrBpyxX@#";
BrickEntity.POINTS= [50, 60, 70, 80, 90, 100, 110, 120, 1/50, 0, 0, 0];
BrickEntity.SPRITES= [
	"standard-0", "standard-1", "standard-2", "standard-3", "standard-4", "standard-5", "standard-6", "standard-7",
	"silver-0", "gold-0", "highlander-0", "template"];
