import Trait from '../Trait.js';
import Level from '../Level.js';

export default class Bricks extends Trait {

	collides({level}, side, entity, target) {
		switch(entity.type) {
			case "x":
				entity.data--;
				if(entity.data<=0)
					entity.setType(1);
				entity.audio.play("ping2");
				break;

			default:
				entity.audio.play("ping");
				level.addTask(Level.REMOVE_ENTITY, entity);
				break;
		}
	}
	
}
