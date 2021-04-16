
import Entity from "./Entity.js";
import Audio from "../Audio.js";
import BrickTrait from "../traits/brick-trait.js"

export default class Brick extends Entity {

	constructor(x, y, type= "g") {
		super(x, y, "bricks.json");

		this.audio= Audio.retrieve("bricks.json");

		this.size= {x: 50, y: 20};
		this.vel= {x: 0, y: 0};
		this.speed= 0;
		this.data= 0;
		this.spriteIdx= 0;

		this.setType(type);
		this.setSprite("standard-"+this.spriteIdx);

		this.addTrait(new BrickTrait());

	}

	setType(type) {
		this.type= type;
		
		switch(this.type) {
			case "g":
				this.spriteIdx= 0;
				break;
			case "o":
				this.spriteIdx= 1;
				break;
			case "b":
				this.spriteIdx= 2;
				break;
			case "G":
				this.spriteIdx= 3;
				break;
			case "r":
				this.spriteIdx= 4;
				break;
			case "B":
				this.spriteIdx= 5;
				break;
			case "p":
				this.spriteIdx= 6;
				break;
			case "y":
				this.spriteIdx= 7;
				break;
			case "x":
				this.spriteIdx= 8;
				this.data= 4;
			break;
		}

	}

	render({screen:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
	}	
}