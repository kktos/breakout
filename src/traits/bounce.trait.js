import Trait from './trait.js';
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

		if(contains(target, entity)) {
			console.log("contains",target, entity);
		}

		switch(side) {
			case COLLISION.LEFT:
				entity.vel.x *= -1;
				entity.left= target.right+1;
				break;

			case COLLISION.RIGHT:
				entity.vel.x *= -1;
				entity.right= target.left-1;
				break;

			case COLLISION.TOP:
				entity.vel.y *= -1;
				entity.top= target.bottom+1;
				break;

			case COLLISION.BOTTOM:
				entity.vel.y *= -1;
				entity.bottom= target.top-1;
				break;
		}
	}

}