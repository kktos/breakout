import {COLLISION, contains} from '../math.js';
import Trait from './Trait.js';

export default class BounceTrait extends Trait {

	constructor(repulsiveFactor= 1) {
		super();

		this.isBouncing= true;
		this.repulsiveFactor= -Math.abs(repulsiveFactor);
	}

	collides(gc, side, entity, target) {
		if(!this.isBouncing || !target.isSolid)
			return;

		// if(contains(target, entity)) {
		// 	console.log(`--- ${target.class} contains ${entity.class}`,target, entity);
		// 	console.log("--- PREV contains ?", entity.previousBbox);
		// }
		
		switch(side) {
			case COLLISION.LEFT:
				entity.vel.x *= this.repulsiveFactor;
				entity.left= entity.previousBbox.left;

				target.vel.x *= this.repulsiveFactor;
				// target.right= entity.previousBbox.right;
				break;

			case COLLISION.RIGHT:
				entity.vel.x *= this.repulsiveFactor;
				entity.right= target.left-1;

				target.vel.x *= this.repulsiveFactor;
				break;

			case COLLISION.TOP:
				entity.vel.y *= this.repulsiveFactor;
				entity.top= entity.previousBbox.top;

				target.vel.y *= this.repulsiveFactor;
				break;

			case COLLISION.BOTTOM:
				entity.vel.y *= this.repulsiveFactor;
				entity.bottom= target.top-1;

				target.vel.y *= this.repulsiveFactor;
				break;
		}
	}

}