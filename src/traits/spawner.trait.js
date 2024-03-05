import LevelScene from "../scene/level.scene.js";
import Trait from './Trait.js';

export default class SpawnerTrait extends Trait {

	constructor() {
		super();

		this.entities= [];
		this.wannaSpawn= false;
	}

	spawn(entity) {
		this.entities.push(entity);
		this.wannaSpawn= true;
	}

	update(entity, {scene}) {
		if(!this.wannaSpawn || !this.entities.length)
			return;
		this.wannaSpawn= false;
		// this.entities.forEach(entity => scene.addTask(LevelScene.TASK_ADD_ENTITY, entity));
		for (let idx = 0; idx < this.entities.length; idx++) {
			const entity = this.entities[idx];
			scene.addTask(LevelScene.TASK_ADD_ENTITY, entity);		
		}
		this.entities.length= 0;
    }

}