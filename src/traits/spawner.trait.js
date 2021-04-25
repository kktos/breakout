import Trait from './Trait.js';
import LevelScene from "../scene/level.scene.js";

export default class SpawnerTrait extends Trait {

	constructor() {
		super();

		this.entities= [];
		this.wannaSpawn= false;
	}

	spawn(entities) {
		this.entities.push(entities);
		this.wannaSpawn= true;
	}

	update(entity, {scene}) {
		if(!this.wannaSpawn || !this.entities.length)
			return;
		this.wannaSpawn= false;
		this.entities.forEach(entity => scene.addTask(LevelScene.TASK_ADD_ENTITY, entity));
		this.entities.length= 0;
    }

}