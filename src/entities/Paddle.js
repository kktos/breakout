import Entity from "./Entity.js";
import Audio from "../Audio.js";
import Sticky from "../traits/trait-sticky.js";
import PlayerTrait from "../traits/player.trait.js";

export default class Paddle extends Entity {

	constructor(x, y) {
		super(x, y, "paddles.json");

		this.audio= Audio.retrieve("paddle.json");
		this.size= {x: 0, y: 0};
		this.vel= {x: 0, y: 0};

		this.setSprite("large-0");

		this.addTrait(new Sticky());
		this.addTrait(new PlayerTrait());

	}

	// collides(side, target) {
	// 	if(target instanceof Ball)
	// 		this.audio.play("pong");
	// }

	move(x) {
		this.pos.x= x;
	}

	render({screen:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);

		// ctx.strokeStyle= "white";
		// ctx.strokeRect(this.pos.x-2, this.pos.y-2, this.size.x+2, this.size.y+2);
		// const sticky= this.traits.get(Sticky);
		// ctx.font = '14px sans-serif';
		// ctx.fillText(`ball ${sticky.glued ? "GLUED" : "FREE"}`, 600-200, 600-10);		
		// ctx.fillText(`${sticky.vel.x},${sticky.vel.y}`, 600-100, 600-10);		
	}	
}