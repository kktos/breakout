import Trait from './Trait.js';
import KillableTrait from "./killable.trait.js";

export default class ExplosionTrait extends Trait {

	constructor() {
		super();
		this.isExploded= false;
	}

	update(entity) {
		if(this.isExploded)
			return;
		const killable= entity.traits.get(KillableTrait);
		if(killable && killable.isDead) {
			killable.removeAfter= 1;
			entity.audio.play("explosion");
			entity.setAnim("explosion");
			this.isExploded= true;
		}
    }

}
