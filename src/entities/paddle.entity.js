import Entity from "./entity.js";
import StickyTrait from "../traits/powerups/sticky.trait.js";
import LaserTrait from "../traits/powerups/laser.trait.js";
import EnlargeTrait from "../traits/powerups/enlarge.trait.js";
import DisruptionTrait from "../traits/powerups/disruption.trait.js";
import PlayerTrait from "../traits/player.trait.js";
import MouseXTrait from "../traits/mousex.trait.js";
import PaddleTrait from "../traits/paddle.trait.js";
import AnimationTrait from "../traits/animation.trait.js";
import SpawnerTrait from "../traits/spawner.trait.js";
export default class PaddleEntity extends Entity {

	constructor(gc, x, y) {
		super(gc.resourceManager, x, y, "paddles");

		this.mass= 2;
		this.isFixed= false;
		this.ballCount= 0;
		
		this.visible= false;
		this.audio= gc.resourceManager.get("audio", "paddle");

		this.poweredBy= null;

		this.addTrait(new MouseXTrait());
		this.addTrait(new StickyTrait());
		this.addTrait(new LaserTrait());
		this.addTrait(new EnlargeTrait());
		this.addTrait(new DisruptionTrait(gc));
		this.addTrait(new PlayerTrait(this));
		this.addTrait(new AnimationTrait());
		this.addTrait(new PaddleTrait());
		this.addTrait(new SpawnerTrait());
	}

	reset(gc) {
		this.ballCount= 1;
		this.visible= true;
		const animTrait= this.traits.get(AnimationTrait);
		this.pos.y-= 8;
		animTrait
			.setAnim(this, "beamup")
			.start()
			.then(() => {
				this.pos.y+= 8;
				animTrait.setAnim(this, "normal0");
				// force narrow bounding box to avoid collision tunneling with the tiny ball
				this.size.y= 9;
			});
		this.traits.get(PaddleTrait).revokePower(this);
	}

	render({keys, viewport:{ctx}}) {
		this.visible && this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
		if(keys.isPressed("Control")) {
			ctx.strokeStyle = 'red';
			ctx.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		}
	}	
}