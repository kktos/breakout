import Trait from '../Trait.js';

export default class SlowTrait extends Trait {

	constructor() {
		super();

		this.isSlow= false;
	}

	update(entity) {
    }

	collides(gc, side, entity, target) {
	}

}