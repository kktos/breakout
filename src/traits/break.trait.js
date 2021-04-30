import Trait from './trait.js';
import KillableTrait from "./killable.trait.js";

export default class BreakTrait extends Trait {

	collides(gc, side, entity, target) {
		if(target.mass>1 && entity.traits.has(KillableTrait))
			entity.traits.get(KillableTrait).kill();
	}
	

}
