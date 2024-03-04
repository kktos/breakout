import Trait from './Trait.js';

export default class MouseXTrait extends Trait {

	update(entity, gc) {
		const bbox= gc.scene.bbox;
		entity.pos.x= gc.mouse.x;
		if(entity.left < bbox.x)
			entity.pos.x= bbox.x;
		else
		if(entity.right > bbox.dx)
			entity.pos.x= bbox.dx - entity.size.x;

	}

}
