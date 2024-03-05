import ENV from "../env.js";
import Trait from './Trait.js';
import KillableTrait from "./killable.trait.js";

export default class BoundingBoxTrait extends Trait {

    update(entity, {scene}) {
		const bbox= scene.bbox;

		if(entity.bottom > ENV.PADDLE_Y + 10) {
			if(entity.traits.has(KillableTrait))
				entity.traits.get(KillableTrait).kill();
			return;
		}

		if(entity.left < bbox.x) {
			entity.left= bbox.x;
			entity.vel.x *= -1;
		}
		if(entity.right > bbox.dx) {
			entity.left= bbox.dx - entity.size.x;
			entity.vel.x *= -1;
		}

		if(entity.top < bbox.y) {
			entity.vel.y*= -1;
			entity.top= bbox.y;
		}

    }

}
