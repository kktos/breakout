import Trait from '../trait.js';
import Events from "../../events/events.js";
import BulletEntity from "../../entities/bullet.entity.js";
import LevelScene from "../../scene/level.scene.js";
import AnimationTrait from "../animation.trait.js";

export default class LaserTrait extends Trait {

	constructor() {
		super();

		this.isActive= false;

		this.on(Events.EVENT_MOUSECLICK, (gc, pos) => {
			this.fire(gc, pos);
		});

	}

	activate(entity) {
		const animTrait= entity.traits.get(AnimationTrait);
		animTrait && animTrait.setAnim(entity, "gun");
		this.isActive= true;
	}

	deactivate(entity) {
		const animTrait= entity.traits.get(AnimationTrait);
		animTrait && animTrait.setAnim(entity, "normal0");
		this.isActive= false;
	}

	fire({resourceManager, scene}, pos) {
		if(!this.isActive)
			return;

		const bullets= new BulletEntity(resourceManager, pos.x, pos.y-20);
		scene.addTask(LevelScene.TASK_ADD_ENTITY, bullets);
	}


}