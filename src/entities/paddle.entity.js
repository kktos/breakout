import Entity from "./Entity.js";
import StickyTrait from "../traits/powerups/sticky.trait.js";
import LaserTrait from "../traits/powerups/laser.trait.js";
import PlayerTrait from "../traits/player.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";
import MouseXTrait from "../traits/mouseX.trait.js";
import PaddleTrait from "../traits/paddle.trait.js";
import AnimationTrait from "../traits/animation.trait.js";

export default class PaddleEntity extends Entity {

	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y, "paddles");

		this.mass= 2;
		
		this.visible= false;
		this.audio= resourceMgr.get("audio", "paddle");

		this.poweredBy= null;

		this.addTrait(new MouseXTrait());
		this.addTrait(new BoundingBoxTrait());
		this.addTrait(new StickyTrait());
		this.addTrait(new LaserTrait());
		this.addTrait(new PlayerTrait(this));
		this.addTrait(new AnimationTrait());
		this.addTrait(new PaddleTrait());
	}

	reset() {
		this.visible= true;
		const animTrait= this.traits.get(AnimationTrait);
		animTrait
			.setAnim(this, "beamup")
			.start()
			.then(() => {
				animTrait.setAnim(this, "normal0");
				// force narrow bounding box to avoid collision tunneling with the tiny ball
				this.size.y= 5;
			});
		this.traits.get(PaddleTrait).revokePower(this);
	}

	render({screen:{ctx}}) {
		this.visible && this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
	}	
}