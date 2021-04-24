import Trait from './Trait.js';
import Anim from '../Anim.js';

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
	}

	start() {
		if(!this.anim)
			return;

		this.anim
			.reset()
			.play();
	}

	stop() {
		if(!this.anim)
			return;

		this.anim.stop();
	}

    update(entity) {
		if(!this.anim)
			return;

		entity.setSprite(this.anim.frame(entity.lifetime));
	}
	
}
