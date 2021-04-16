import Trait from './Trait.js';
import {COLLISION} from '../math.js';
import PaddleEntity from '../entities/paddle.entity.js';

export default class BounceTrait extends Trait {

	constructor() {
		super();

		this.isBouncing= true;
	}

	collides(_, side, entity, target) {
		if(!this.isBouncing)
			return;

		if(target instanceof PaddleEntity) {
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
				if(target instanceof PaddleEntity) {
					const center= target.left + target.size.x/2;
					entity.vel.x= (-10*(center-entity.left))|0;
				}
				break;
		}
	}

}
