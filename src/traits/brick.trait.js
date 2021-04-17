import Trait from './Trait.js';
import Level from '../Level.js';
import AnimationTrait from './animation.trait.js';
import PowerupEntity from '../entities/powerup.entity.js';
import KillableTrait from "../traits/killable.trait.js";

export default class BrickTrait extends Trait {

	static EVENT_BRICK_KILLED = Symbol('brickKilled');

	collides({level, resourceManager}, side, entity, target) {
		switch(entity.type) {
			case "x":
				entity.audio.play("ping2");
				entity.data--;
				if(entity.data<=0)
					entity.setType(1)
				else {
					if(entity.traits.has(AnimationTrait))
						entity.traits.get(AnimationTrait).start();

					const powerup= new PowerupEntity(resourceManager, 200, 200, "M");
					level.addTask(Level.ADD_ENTITY, powerup);

				}
				break;

			default:
				entity.audio.play("ping");

				if(entity.traits.has(KillableTrait))
					entity.traits.get(KillableTrait).kill();
				break;
		}
	}
	
}
