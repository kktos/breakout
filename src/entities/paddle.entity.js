import Entity from "./Entity.js";
import StickyTrait from "../traits/sticky.trait.js";
import PlayerTrait from "../traits/player.trait.js";

export default class PaddleEntity extends Entity {

	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y, "paddles.json");

		this.audio= resourceMgr.get("audio", "paddle.json");
		this.size= {x: 0, y: 0};
		this.vel= {x: 0, y: 0};

		this.setSprite("large-0");

		this.addTrait(new StickyTrait());
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
		this.spritesheet.drawAnim("large", ctx, this.pos.x, this.pos.y, this.lifetime);

		// this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);

		// ctx.strokeStyle= "white";
		// ctx.strokeRect(this.pos.x-2, this.pos.y-2, this.size.x+2, this.size.y+2);
		// const sticky= this.traits.get(Sticky);
		// ctx.font = '14px sans-serif';
		// ctx.fillText(`${this.lifetime}`, 600-100, 600-10);		
	}	
}