import Trait from '../Trait.js';
import Events from "../../events/Events.js";
import BulletEntity from "../../entities/bullet.entity.js";
import LevelScene from "../../scene/level.scene.js";

export default class LaserTrait extends Trait {

	constructor() {
		super();

		this.isActive= false;

		this.on(Events.EVENT_MOUSECLICK, (gc, pos) => {
			this.fire(gc, pos);
		});

	}

	activate(entity) {
		entity.setAnim("gun");
		this.isActive= true;
	}

	deactivate(entity) {
		entity.setAnim("normal0");
		this.isActive= false;
	}

	fire({resourceManager, scene}, pos) {
		if(!this.isActive)
			return;

		const bullets= new BulletEntity(resourceManager, pos.x, pos.y-20);
		scene.addTask(LevelScene.ADD_ENTITY, bullets);
	}


}