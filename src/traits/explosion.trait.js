import Trait from './Trait.js';
import AnimationTrait from "./animation.trait.js";
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
			this.isExploded= true;
			const anim= entity.traits.get(AnimationTrait);
			anim && anim.setAnim(entity, "explosion");
			killable.removeAfter= Infinity;
			// window.navigator.vibrate(200);
			entity.audio
				.play("explosion")
				.then(() => killable.removeAfter= 0);
		}
    }

}
