import Trait from './Trait.js';

export default class MouseXTrait extends Trait {

	update(entity, gc) {
		const bbox= gc.scene.bbox;
		entity.left= gc.mouse.x;
		if(entity.left < bbox.x)
			entity.left= bbox.x;
		else
		if(entity.right > bbox.dx)
			entity.left= bbox.dx - entity.size.x;

	}

}
