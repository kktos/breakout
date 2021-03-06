import Trait from './trait.js';
import KillableTrait from "./killable.trait.js";
import ENV from "../env.js";

export default class BoundingBoxTrait extends Trait {

    update(entity, {scene}) {
		const bbox= scene.bbox;

		if(entity.bottom > ENV.PADDLE_Y + 10) {
			if(entity.traits.has(KillableTrait))
				entity.traits.get(KillableTrait).kill();
			return;
		}

		if(entity.left < bbox.x) {
			entity.pos.x= bbox.x;
			entity.vel.x *= -1;
		}
		if(entity.right > bbox.dx) {
			entity.pos.x= bbox.dx - entity.size.x;
			entity.vel.x *= -1;
		}

		if(entity.pos.y < bbox.y) {
			entity.vel.y*= -1;
			entity.pos.y= bbox.y;
		}

    }

}
