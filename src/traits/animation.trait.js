import Trait from '../Trait.js';
import animResolveFrame from '../utils/animResolveFrame.util.js';

export default class AnimationTrait extends Trait {

	constructor() {
		super();
		this.anim= null;
		this.runningAnim= null;
	}

	setAnim(entity, name) {
		this.anim= entity.spritesheet.animations.get(name);
		if(!this.anim)
			throw new Error(`Unknown animation ${name} for ${entity.constructor}`);

		this.runningAnim= {...this.anim};
	}

	start() {
		if(!this.runningAnim)
			return;

		const anim= this.runningAnim;
		anim.isStopped= false;
		anim.loop= anim.loopInitialValue;
		anim.lastFrameIdx= -1;
		anim.frameIdx= -1;
	}

	stop() {
		if(!this.runningAnim)
			return;

		this.runningAnim.isStopped= true;
	}

    update(entity) {
		if(!this.runningAnim)
			return;

		const spriteName= animResolveFrame(this.runningAnim, entity.lifetime);

		// console.log(spriteName, entity.lifetime);

		entity.setSprite(
			spriteName
		);
	}
	
}
