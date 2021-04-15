import Trait from '../Trait.js';
import {COLLISION} from '../math.js';
import Paddle from '../entities/Paddle.js';

export default class Bounce extends Trait {

	constructor() {
		super();

		this.isBouncing= true;
	}

	collides(_, side, entity, target) {
		if(!this.isBouncing)
			return;

		if(target instanceof Paddle) {
			target.audio.play("pong")
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
				if(target instanceof Paddle) {
					const center= target.left + target.size.x/2;
					entity.vel.x= (-10*(center-entity.left))|0;
				}
				break;
		}
	}

}
