import Entity from "./Entity.js";
import StickyTrait from "../traits/powerups/sticky.trait.js";
import LaserTrait from "../traits/powerups/laser.trait.js";
import PlayerTrait from "../traits/player.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";
import MouseXTrait from "../traits/mouseX.trait.js";
import PaddleTrait from "../traits/paddle.trait.js";

export default class PaddleEntity extends Entity {

	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y, "paddles");

		this.audio= resourceMgr.get("audio", "paddle");

		this.poweredBy= null;

		this.setAnim("normal0");

		this.addTrait(new MouseXTrait());
		this.addTrait(new BoundingBoxTrait());
		this.addTrait(new StickyTrait());
		this.addTrait(new LaserTrait());
		this.addTrait(new PlayerTrait(this));
		this.addTrait(new PaddleTrait());

	}

	render({screen:{ctx}}) {
		this.spritesheet.drawAnim(this.currSprite, ctx, this.pos.x, this.pos.y, this.lifetime);

		// this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);

		// ctx.strokeStyle= "white";
		// ctx.strokeRect(this.pos.x-2, this.pos.y-2, this.size.x+2, this.size.y+2);
		// const sticky= this.traits.get(Sticky);
		// ctx.font = '14px sans-serif';
		// ctx.fillText(`${this.lifetime}`, 600-100, 600-10);		
	}	
}