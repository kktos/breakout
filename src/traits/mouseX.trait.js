import Trait from './Trait.js';

export default class MouseXTrait extends Trait {

	update(entity, gc) {
		entity.pos.x= gc.mouse.x;
	}

}
