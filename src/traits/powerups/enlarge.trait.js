import Trait from '../Trait.js';
import AnimationTrait from "../animation.trait.js";

export default class EnlargeTrait extends Trait {

	constructor() {
		super();

		this.isActive= false;
	}

	activate(entity) {
		const animTrait= entity.traits.get(AnimationTrait);
		animTrait && animTrait.setAnim(entity, "large0");
		this.isActive= true;
	}

	deactivate(entity) {
		const animTrait= entity.traits.get(AnimationTrait);
		animTrait && animTrait.setAnim(entity, "normal0");
		this.isActive= false;
	}

}