import Trait from './Trait.js';
import Level from '../Level.js';

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

	update(entity, {level}) {
		if(!this.wannaSpawn || !this.entities.length)
			return;
		this.wannaSpawn= false;
		this.entities.forEach(entity => level.addTask(Level.ADD_ENTITY, entity));
		this.entities.length= 0;
    }

}