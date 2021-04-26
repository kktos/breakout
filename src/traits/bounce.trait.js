import Trait from './Trait.js';
import {COLLISION, contains} from '../math.js';

export default class BounceTrait extends Trait {

	constructor() {
		super();

		this.isBouncing= true;
	}

	collides(gc, side, entity, target) {
		if(!this.isBouncing || !target.isSolid)
			return;

		// // as the ball can be too fast, it could be trapped "inside" the paddle so we need to get it out !
		// if(entity.class=="BallEntity" && contains(target, entity)) {
		// 	switch(side) {
		// 		case COLLISION.LEFT:
		// 			entity.left= target.right;
		// 			break;
	
		// 		case COLLISION.RIGHT:
		// 			entity.right= target.left;
		// 			break;
	
		// 		case COLLISION.TOP:
		// 			entity.top= target.bottom;
		// 			break;
	
		// 		case COLLISION.BOTTOM:
		// 			entity.bottom= target.top;
		// 			break;
		// 	}
		// }

		// as the ball can be too fast, it could be trapped "inside" the paddle so we need to get it out !
		if(contains(target, entity)) {
			switch(side) {
				case COLLISION.LEFT:
					entity.left= target.right;
					break;
	
				case COLLISION.RIGHT:
					entity.right= target.left;
					break;
	
				case COLLISION.TOP:
					entity.top= target.bottom;
					break;
	
				case COLLISION.BOTTOM:
					entity.bottom= target.top;
					break;
			}
		}

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