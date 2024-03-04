import Anim from '../anim.js';
import Trait from './Trait.js';

export default class AnimationTrait extends Trait {

	constructor() {
		super();
		this.anim= null;
	}

	setAnim(entity, name) {
		const anim= entity.spritesheet.animations.get(name);
		if(!anim)
			throw new Error(`Unknown animation ${name} for ${entity.constructor}`);

		this.anim= new Anim(name, anim);
		entity.setSprite(this.anim.frame(0));
		return this;
	}

	start() {
		if(!this.anim)
			return;

		return this.anim
					.reset();
	}

	stop() {
		if(!this.anim)
			return;

		this.anim.stop();
		return this;
	}

    update(entity) {
		if(!this.anim)
			return;

		entity.setSprite(this.anim.frame(entity.lifetime));
	}
	
}
