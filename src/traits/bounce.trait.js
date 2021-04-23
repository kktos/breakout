import Trait from './Trait.js';
import {COLLISION} from '../math.js';

export default class BounceTrait extends Trait {

	constructor() {
		super();

		this.isBouncing= true;
	}

	collides(gc, side, entity, target) {
		// if(!this.isBouncing || target.ghost)
		if(!this.isBouncing)
			return;

		switch(side) {
			case COLLISION.LEFT:
				entity.vel.x *= -1;
				break;

			case COLLISION.RIGHT:
				entity.vel.x *= -1;
				break;

			case COLLISION.TOP:
				entity.vel.y *= -1;
				break;

			case COLLISION.BOTTOM:
				entity.vel.y *= -1;
				break;
		}
	}

}