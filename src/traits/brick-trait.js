import Trait from '../Trait.js';
import Level from '../Level.js';

export default class BrickTrait extends Trait {

	collides({level}, side, entity, target) {
		switch(entity.type) {
			case "x":
				entity.audio.play("ping2");
				entity.data--;
				if(entity.data<=0)
					entity.setType(1);
				break;

			default:
				entity.audio.play("ping");
				level.addTask(Level.REMOVE_ENTITY, entity);
				break;
		}
	}
	
}
