import Trait from './trait.js';
import LevelScene from '../scene/level.scene.js';
import AnimationTrait from './animation.trait.js';
import PowerupEntity from '../entities/powerup.entity.js';
import KillableTrait from "../traits/killable.trait.js";

export default class BrickTrait extends Trait {

	// static EVENT_BRICK_KILLED = Symbol('brickKilled');
	// static powerAfter= 10;

	constructor() {
		super();
	}

	resetPowerTimer() {
		BrickTrait.powerAfter= Math.random()*20|0 + 1;
	}

	collides(gc, side, entity, target) {
		const {scene, resourceManager}= gc;

		if(entity.ghost || target.mass<=1)
			return;
	
		switch(entity.type) {
			case "x":
			case "X":
			case "@":
				entity.data--;
				if(entity.data>0) {
					entity.audio.play("ping2");
					if(entity.traits.has(AnimationTrait))
						entity.traits.get(AnimationTrait).start();
					break;
				}

			default:
				entity.audio.play("ping");

				if(entity.traits.has(KillableTrait))
					entity.traits.get(KillableTrait).kill();

				entity.ghost= true;
				BrickTrait.powerAfter--;

				if(BrickTrait.powerAfter <=0) {
					this.resetPowerTimer();
					const powerup= new PowerupEntity(resourceManager, entity.pos.x, entity.pos.y);
					scene.addTask(LevelScene.TASK_ADD_ENTITY, powerup);
				}
		
				break;
		}
	}
	
}

BrickTrait.EVENT_BRICK_KILLED = Symbol('brickKilled');
BrickTrait.powerAfter= 10;
