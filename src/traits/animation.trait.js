import Trait from '../Trait.js';

export default class AnimationTrait extends Trait {

	constructor() {
		super();
	}

	start(entity) {
		if(!entity.anim)
			return;

		entity.anim.isStopped= false;
		entity.anim.loop= animation.loopInitialValue;
		entity.anim.lastFrameIdx= -1;
		entity.anim.frameIdx= -1;
	}

	stop(entity) {
		if(!entity.anim)
			return;

		entity.anim.isStopped= true;
	}

    update(entity) {
		if(!entity.anim)
			return;

		entity.setSprite(
			entity.spritesheet.animFrame(entity.anim, entity.lifetime)
		);

	}
	
}
