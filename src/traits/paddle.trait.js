import Trait from './Trait.js';
import {COLLISION} from '../math.js';
import BallEntity from "../entities/ball.entity.js";
import PowerupEntity from "../entities/powerup.entity.js";
import KillableTrait from "./killable.trait.js";
import PlayerTrait from "./player.trait.js";
import StickyTrait from "./powerups/sticky.trait.js";
import LaserTrait from "./powerups/laser.trait.js";
import EnlargeTrait from "./powerups/enlarge.trait.js";
import DisruptionTrait from "./powerups/disruption.trait.js";

export default class PaddleTrait extends Trait {

	constructor() {
		super();
	}

	revokePower(paddle) {
		switch(paddle.poweredBy) {
			case "C": {
				paddle.traits.get(StickyTrait).isSticky= false;
				break;
			}
			case "L": {
				paddle.traits.get(LaserTrait).deactivate(paddle);
				break;
			}
			case "E": {
				paddle.traits.get(EnlargeTrait).deactivate(paddle);
				break;
			}

		}

	}

	grantPower(paddle, type) {
		switch(type) {
			case "C": {
				paddle.poweredBy= type;
				paddle.traits.get(StickyTrait).isSticky= true;
				break;
			}
			case "E": {
				paddle.poweredBy= type;
				paddle.traits.get(EnlargeTrait).activate(paddle);
				break;
			}
			case "L": {
				paddle.poweredBy= type;
				paddle.traits.get(LaserTrait).activate(paddle);
				break;
			}
			case "P": {
				paddle.traits.get(PlayerTrait).addLife();
				break;
			}
			case "D": {
				paddle.traits.get(DisruptionTrait).addBalls(paddle);
				break;
			}
		}
	}

	collides(gc, side, paddle, target) {

		if(target instanceof PowerupEntity) {
			const killable= target.traits.get(KillableTrait);
			if(killable.isDead)
				return;

			this.revokePower(paddle);
			this.grantPower(paddle, target.type);

			killable.kill();			
			return;
		}

		if(target instanceof BallEntity) {
			paddle.audio.play("pong");
			if(COLLISION.BOTTOM) {
				const center= paddle.left + paddle.size.x/2;
				target.vel.x= (-10*(center-target.left))|0;
			}
			return;
		}

	}

}
